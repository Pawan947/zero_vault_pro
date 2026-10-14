# Security Policy

## Supported code

Security fixes are applied to the latest revision of the `main` branch. This repository is a portfolio project and does not currently publish long-term support releases.

## Reporting a vulnerability

Please **do not open a public issue containing exploit details, credentials, personal data, or a live vulnerable target**.

Use GitHub's **Security → Report a vulnerability** workflow for this repository. Include:

- affected route or component;
- reproducible steps using non-sensitive test data;
- expected and observed behavior;
- impact assessment;
- suggested mitigation, if available.

Do not include production keys, session cookies, storage credentials, Firebase credentials, or decrypted user files.

## Security model and known limitations

- Files are encrypted by the application before S3-compatible storage receives them.
- The server holds the encryption master key; this is **not** a zero-knowledge design.
- AES-CTR provides confidentiality but not ciphertext integrity. A production version should use authenticated chunks (for example, chunked AES-GCM) or per-chunk authentication tags while preserving range access.
- Browser-provided geolocation can be spoofed and is not a strong authentication factor.
- Deployment secrets must be supplied through environment variables and must never be committed.
- Firebase Realtime Database rules must enforce per-user access.

## Responsible testing

Test only against an instance and storage account you own or are explicitly authorized to assess. Do not access another user's objects, credentials, or sessions.
