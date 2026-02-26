# ZeroV2 — Secure Team Storage

<div align="center">

**Built & Owned by [Pawan Yadav](https://github.com/Pawan947)**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![WebAuthn](https://img.shields.io/badge/WebAuthn-Passkey-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

*Submitted for PEP Classes Project — February 2026*

</div>

---

## About

ZeroV2 is a **secure, cloud-based file storage and collaboration platform** with phishing-resistant WebAuthn (passkey) multi-factor authentication. It provides a private, policy-aware gateway between users and object storage — supporting granular sharing, expiring links, geofencing, and AES-256 file encryption.

---

## Features

- **WebAuthn / Passkey MFA** — Phishing-resistant second factor using Windows Hello, Apple Touch ID, or hardware keys
- **Firebase Authentication** — Email/password registration and login
- **Encrypted File Storage** — All files encrypted at rest with AES-256-CTR before writing to S3
- **Folder Sharing** — Share folders with other users with custom permissions (download / upload / delete)
- **Expiring Share Links** — Generate time-limited, per-IP-capped file-sharing links
- **Geofencing** — Restrict access to shares and links based on GPS location radius
- **Video Streaming** — Range-request-aware video streaming directly from encrypted S3 objects
- **Universal API Upload** — Programmatic upload endpoint protected by API key

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Auth | Firebase Auth, WebAuthn (@simplewebauthn) |
| Database | Firebase Realtime Database |
| File Storage | S3-compatible object storage |
| Encryption | AES-256-CTR (Node.js crypto) |
| Templating | EJS |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pawan947/zeroV2.git
cd zeroV2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env` with your own Firebase project, S3 bucket, and session secret credentials.

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

See [`.env.example`](.env.example) for the full list of required variables. **Never commit your real `.env` file.**

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Random secret for session encryption |
| `FIREBASE_API_KEY` | Firebase project API key |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |
| `S3_ACCESS_KEY_ID` | S3 access key |
| `S3_SECRET_ACCESS_KEY` | S3 secret key |
| `S3_BUCKET` | S3 bucket name |
| `S3_ENDPOINT` | S3 endpoint URL |
| `RP_ID` | WebAuthn Relying Party ID (your domain) |
| `ORIGIN` | Full origin URL for WebAuthn |

---

## Project Structure

```
zeroV2/
├── config/          # Firebase, S3, WebAuthn configuration
├── middleware/      # Authentication & shared access middleware
├── routes/          # Express route handlers (auth, storage, webauthn, public)
├── utils/           # Helper functions (crypto, S3, geo, path helpers)
├── views/           # EJS templates (login, register, file browser, share)
├── server.js        # Application entry point
├── .env.example     # Environment variable template
├── LICENSE          # MIT License
└── NOTICE           # Attribution notice
```

---

## Security Model

- Session cookies are `httpOnly` and `secure` in production
- WebAuthn challenges are single-use and stored in server-side sessions
- Shared access entries enforce recipient email, expiry time, and optional geofence
- Public share links enforce total download caps, per-IP limits, expiry, and geofence
- All stored files are AES-256-CTR encrypted using a key derived from `SESSION_SECRET`

---

## License

MIT License — Copyright (c) 2026 **Pawan Yadav** ([github.com/Pawan947](https://github.com/Pawan947))

See [LICENSE](LICENSE) for full terms. Any copy or derivative of this project must retain attribution to the original author.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Pawan947">Pawan Yadav</a>
</div>
