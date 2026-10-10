# Pilot server

`main.js` serves the authenticated API and the web client. `service.js` owns workflow authorization and mutations. `store.js` persists indexed JSON records in SQLite and provides atomic transactions. `auth.js` handles email OTP and sessions. `files.js` validates, privately stores and authorizes photo/PDF attachments.

Run instructions, assumptions and remaining work are in [DEVELOPMENT.md](../DEVELOPMENT.md).

Technical references checked during implementation: [Node SQLite API](https://nodejs.org/api/sqlite.html), [Node crypto API](https://nodejs.org/api/crypto.html), and [Resend email endpoint](https://resend.com/docs/api-reference/emails/send-email). Actual provider delivery still needs configured credentials and live verification.
