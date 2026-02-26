<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=ZERO%20VAULT%20PRO&fontSize=60&fontColor=00fff7&animation=fadeIn&fontAlignY=38&desc=Secure%20Team%20Storage%20%E2%80%94%20Built%20by%20Pawan%20Yadav&descAlignY=60&descColor=a78bfa" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00FFF7&center=true&vCenter=true&multiline=true&width=700&height=80&lines=WebAuthn+%2B+Passkey+MFA+%F0%9F%94%90;AES-256+File+Encryption+%F0%9F%9B%A1%EF%B8%8F;Policy-Aware+Cloud+Storage+%E2%98%81%EF%B8%8F)](https://git.io/typing-svg)

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

<br/>

> **© 2026 Pawan Yadav — All Rights Reserved**  
> [github.com/Pawan947](https://github.com/Pawan947) · MIT Licensed · PEP Classes Project Submission

</div>

---

## ⚡ What is Zero Vault Pro?

> A **phishing-resistant, zero-trust cloud storage platform** where every file is encrypted, every share link is policy-bound, and every login can be locked behind a hardware passkey — all without managing a single raw S3 bucket.

```
User → Firebase Auth → [optional WebAuthn MFA] → Session
     → Upload → AES-256-CTR encrypt → S3 Object Store
     → Share → Policy Engine (expiry + geofence + IP cap) → Recipient
```

---

## 🔐 Core Security Stack

<table>
<tr>
<td width="50%">

### Identity & Auth
- 🔑 **WebAuthn / Passkeys** — Windows Hello, Touch ID, hardware keys
- 🔥 **Firebase Auth** — Email + password baseline
- 🍪 **httpOnly session cookies** — Secure in production
- 🔄 **Partial-login MFA gate** — Promotes session only after authenticator

</td>
<td width="50%">

### File & Share Security
- 🛡️ **AES-256-CTR encryption** — Every file encrypted at write
- ⏱️ **Expiring share links** — Time-bound with total + per-IP download caps
- 🌍 **Geofencing** — Haversine-based GPS radius enforcement
- 🚫 **Permission matrix** — Per-share: download / upload / delete flags

</td>
</tr>
</table>

---

## 🛠️ Tech Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ZERO VAULT PRO                           │
│                                                             │
│  ┌──────────┐    ┌──────────────────────────────────────┐  │
│  │  EJS UI  │───▶│         Express Backend               │  │
│  └──────────┘    │  ┌──────────┐  ┌──────────────────┐  │  │
│                  │  │auth.js   │  │storage.js        │  │  │
│                  │  │webauthn  │  │public.js         │  │  │
│                  │  └────┬─────┘  └────────┬─────────┘  │  │
│                  └───────┼─────────────────┼────────────┘  │
│                          │                 │               │
│              ┌───────────▼──┐    ┌─────────▼──────────┐   │
│              │  Firebase    │    │  S3 Object Store   │   │
│              │  Auth + DB   │    │  (AES-256 files)   │   │
│              └──────────────┘    └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features At a Glance

| Feature | Description | Status |
|---|---|:---:|
| 🔑 WebAuthn MFA | Passkey second factor (Windows Hello / Touch ID) | ✅ |
| 🔐 AES-256 Encryption | Files encrypted before upload, decrypted on stream | ✅ |
| 📁 Folder Sharing | Scoped access with permission flags + expiry | ✅ |
| 🔗 Public Share Links | Time-limited, IP-capped, geofenced download URLs | ✅ |
| 🌍 Geofencing | GPS radius enforcement on shares and links | ✅ |
| 🎬 Video Streaming | Range-request streaming from encrypted S3 objects | ✅ |
| 📤 API Upload | Universal upload endpoint with API key auth | ✅ |
| 📂 Folder Management | Create, list, delete — scoped to user namespace | ✅ |

---

## ⚙️ Quick Start

```bash
# 1. Clone
git clone https://github.com/Pawan947/zero_vault_pro.git
cd zero_vault_pro

# 2. Install
npm install

# 3. Config
cp .env.example .env
# → Fill in Firebase, S3, and session credentials

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## 🗂️ Project Structure

```
zero_vault_pro/
│
├── 📁 config/
│   ├── aws.js          ← S3 client setup
│   ├── firebase.js     ← Firebase init
│   └── webauthn.js     ← RP config
│
├── 📁 middleware/
│   └── auth.js         ← requireLogin + checkSharedAccess
│
├── 📁 routes/
│   ├── auth.js         ← Login / Register / Logout
│   ├── storage.js      ← Upload / Download / Share / Delete
│   ├── webauthn.js     ← Passkey register & login verify
│   └── public.js       ← Public share link handler
│
├── 📁 utils/
│   ├── cryptoHelpers.js ← AES-256-CTR stream cipher
│   ├── s3Helpers.js    ← List, ensure folder
│   ├── geo.js          ← Haversine geofence distance
│   └── appHelpers.js   ← Path + expiry utilities
│
├── 📁 views/           ← EJS templates
├── 🔧 server.js        ← App entry point
├── 📄 .env.example     ← Config template
├── 📄 LICENSE          ← MIT © Pawan Yadav
└── 📄 NOTICE           ← Attribution
```

---

## 🌐 Environment Variables

```env
SESSION_SECRET=        # Secret for session encryption
FIREBASE_API_KEY=      # Firebase project API key
FIREBASE_AUTH_DOMAIN=  # Firebase auth domain
FIREBASE_DATABASE_URL= # Realtime DB URL
S3_ENDPOINT=           # S3-compatible endpoint
S3_REGION=             # Region
S3_ACCESS_KEY_ID=      # S3 access key
S3_SECRET_ACCESS_KEY=  # S3 secret
S3_BUCKET=             # Bucket name
RP_ID=                 # WebAuthn domain (e.g. yourdomain.vercel.app)
ORIGIN=                # Full origin URL for WebAuthn
UNIVERSAL_API_KEY=     # API key for universal upload endpoint
```

See [`.env.example`](.env.example) — **never commit your real `.env`.**

---

## 📊 Author

<div align="center">

| | |
|---|---|
| **Name** | Pawan Yadav |
| **GitHub** | [@Pawan947](https://github.com/Pawan947) |
| **Project** | PEP Classes — February 2026 |
| **License** | MIT — Copyright © 2026 Pawan Yadav |

<br/>

[![GitHub followers](https://img.shields.io/github/followers/Pawan947?style=social&label=Follow)](https://github.com/Pawan947)
[![GitHub stars](https://img.shields.io/github/stars/Pawan947/zero_vault_pro?style=social)](https://github.com/Pawan947/zero_vault_pro)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&animation=fadeIn" width="100%"/>

**Zero Vault Pro** · Built with 🔐 by [Pawan Yadav](https://github.com/Pawan947)  
*Any copy or fork must retain original authorship — see [NOTICE](NOTICE)*

</div>
