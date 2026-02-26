const express = require("express");
const router = express.Router();
const { ref, get, push, update } = require("firebase/database");
const { db } = require("../config/firebase");
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require("@simplewebauthn/server");
const base64url = require("base64url");
const { rpName, rpID, origin } = require("../config/webauthn");
const { requireLogin } = require("../middleware/auth");

const crypto = require('crypto');

// 1. Generate Registration Options
router.get("/register-options", async (req, res) => {
    try {
        let userAuthenticators = [];
        let uid;
        let email;

        const dynamicOrigin = `https://${req.get('host')}`;
        const dynamicRpID = req.hostname;

        if (req.session.user) {
            uid = req.session.user.uid;
            email = req.session.user.email;
            const userAuthenticatorsRef = ref(db, `users/${uid}/authenticators`);
            const snapshot = await get(userAuthenticatorsRef);
            userAuthenticators = snapshot.val() ? Object.values(snapshot.val()) : [];
        } else {
            email = req.query.email;
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            uid = crypto.randomBytes(16).toString('hex');
        }

        const opts = {
            rpName: rpName || "Secure Storage",
            rpID: dynamicRpID,
            userID: new Uint8Array(Buffer.from(uid)),
            userName: email,
            timeout: 60000,
            attestationType: "none",
            excludeCredentials: userAuthenticators.map(auth => ({
                id: auth.credentialID,
                type: "public-key",
                transports: auth.transports,
            })),
            authenticatorSelection: {
                residentKey: "preferred",
                userVerification: "preferred",
                authenticatorAttachment: "platform", // forces local lock (Windows Hello / Apple Touch ID)
            },
        };

        const options = await generateRegistrationOptions(opts);
        req.session.currentChallenge = options.challenge;
        req.session.dynamicOrigin = dynamicOrigin;
        req.session.dynamicRpID = dynamicRpID;

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Failed to save session" });
            }
            res.json(options);
        });
    } catch (err) {
        console.error("WebAuthn Registration Options Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Verify Registration
router.post("/register-verify", async (req, res) => {
    try {
        const { body } = req;
        const expectedChallenge = req.session.currentChallenge;
        const expectedOrigin = req.session.dynamicOrigin || origin;
        const expectedRPID = req.session.dynamicRpID || rpID;

        if (!expectedChallenge) {
            return res.status(400).json({ error: "Challenge not found in session." });
        }

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge,
                expectedOrigin,
                expectedRPID,
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: error.message });
        }

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const { credential } = registrationInfo;
            const { id: credentialID, publicKey: credentialPublicKey, counter, transports } = credential;

            const newAuthenticator = {
                credentialID: credentialID,
                credentialPublicKey: base64url.encode(Buffer.from(credentialPublicKey)),
                counter,
                transports: transports || body.response.transports || [],
            };

            if (req.session.user) {
                const user = req.session.user;
                await push(ref(db, `users/${user.uid}/authenticators`), newAuthenticator);
                await update(ref(db, `users/${user.uid}`), { email: user.email });

                req.session.currentChallenge = undefined;
                res.json({ verified: true });
            } else {
                req.session.pendingAuthenticator = newAuthenticator;
                req.session.currentChallenge = undefined;
                res.json({ verified: true, pending: true });
            }
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (err) {
        console.error("WebAuthn Registration Verify Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Generate Authentication Options
router.get("/login-options", async (req, res) => {
    try {
        const dynamicRpID = req.hostname;
        const opts = {
            timeout: 60000,
            userVerification: "preferred",
            rpID: dynamicRpID,
        };

        const uid = req.session.partialLogin?.uid || req.session.user?.uid;
        if (uid) {
            const snapshot = await get(ref(db, `users/${uid}/authenticators`));
            if (snapshot.exists()) {
                const authenticators = Object.values(snapshot.val());
                opts.allowCredentials = authenticators.map(auth => ({
                    id: auth.credentialID,
                    type: "public-key",
                    transports: auth.transports || [],
                }));
            }
        }

        const options = await generateAuthenticationOptions(opts);
        req.session.currentChallenge = options.challenge;
        req.session.dynamicOrigin = `https://${req.get('host')}`;
        req.session.dynamicRpID = dynamicRpID;
        req.session.save((err) => {
            if (err) console.error("Session save error in options:", err);
            res.json(options);
        });
    } catch (err) {
        console.error("WebAuthn Login Options Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Verify Authentication
router.post("/login-verify", async (req, res) => {
    try {
        const { body } = req;
        const expectedChallenge = req.session.currentChallenge;
        const credentialID = body.id;

        let foundAuth = null;
        let foundUid = null;
        let foundAuthKey = null;

        if (req.session.partialLogin) {
            foundUid = req.session.partialLogin.uid;
            const authSnap = await get(ref(db, `users/${foundUid}/authenticators`));
            if (authSnap.exists()) {
                Object.entries(authSnap.val()).forEach(([key, a]) => {
                    if (a.credentialID === credentialID) {
                        foundAuth = a;
                        foundAuthKey = key;
                    }
                });
            }
        } else {
            const usersSnap = await get(ref(db, "users"));
            if (usersSnap.exists()) {
                usersSnap.forEach(uSnap => {
                    const auths = uSnap.val().authenticators;
                    if (auths) {
                        Object.entries(auths).forEach(([key, a]) => {
                            if (a.credentialID === credentialID) {
                                foundAuth = a;
                                foundUid = uSnap.key;
                                foundAuthKey = key;
                            }
                        });
                    }
                });
            }
        }

        if (!foundAuth || !foundUid) {
            return res.status(400).json({ error: "Authenticator not found" });
        }

        const userRef = ref(db, `users/${foundUid}`);
        const userSnap = await get(userRef);
        const userData = userSnap.val();
        const userEmail = userData?.email || req.session.partialLogin?.email;

        if (!userEmail) {
            return res.status(400).json({ error: "User email not found." });
        }

        const expectedOrigin = req.session.dynamicOrigin || origin;
        const expectedRPID = req.session.dynamicRpID || rpID;
        const opts = {
            response: body,
            expectedChallenge,
            expectedOrigin,
            expectedRPID,
            credential: {
                id: foundAuth.credentialID,
                publicKey: base64url.toBuffer(foundAuth.credentialPublicKey),
                counter: foundAuth.counter,
                transports: foundAuth.transports,
            },
        };

        const verification = await verifyAuthenticationResponse(opts);
        const { verified, authenticationInfo } = verification;

        if (verified) {
            const { newCounter } = authenticationInfo;
            if (foundAuthKey) {
                await update(ref(db, `users/${foundUid}/authenticators/${foundAuthKey}`), { counter: newCounter });
            }

            req.session.user = { uid: foundUid, email: userEmail };
            req.session.currentChallenge = undefined;
            req.session.partialLogin = undefined;

            req.session.save((err) => {
                if (err) return res.status(500).json({ error: "Failed to save session" });
                res.json({ verified: true });
            });
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (err) {
        console.error("WebAuthn Login Verify Error:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
