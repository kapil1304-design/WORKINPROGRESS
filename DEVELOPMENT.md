# Shared web application

Requires Node.js 24 or newer. The original browser demo remains in `app/`; the shared application is served from `web/` by `server/main.js`.

## Run locally

1. Copy `.env.example` to `.env`.
2. Set `OWNER_EMAIL` and optionally `OWNER_NAME`. Use synthetic accounts while testing locally.
3. Run `npm start` from the project root.
4. Open `http://127.0.0.1:3000` and request the email login code.
5. With `MAIL_MODE=local`, read the code from the newest file in `runtime/mailbox`. This development mailbox does not send email. Enter that code in the browser.

On Windows, if a newly installed Node is not yet on PATH:

```powershell
& 'C:\Program Files\nodejs\node.exe' --env-file-if-exists=.env server/main.js
```

The owner creates projects and invites members by email with a per-project role. Every participant logs in separately; there is no identity selector in the shared app. Local mode is restricted to loopback and cannot run in production.

## Real email and shared hosting

Set `MAIL_MODE=resend`, `RESEND_API_KEY` and `MAIL_FROM` for a configured/verified sender. Every login then sends a real single-use email OTP. This path requires provider credentials and a verified sender; it must be exercised before inviting real users. Operational notifications remain in-app only.

Shared deployment requires `NODE_ENV=production`, an HTTPS `APP_ORIGIN`, a reverse proxy terminating TLS, an appropriate `HOST`, a persistent `DATA_DIR`, and backup/restore procedures. Never expose the local mailbox or runtime directory through a static file server. No deployment or provider purchase has been performed.

## Commands

For a slow visible local walkthrough with a saved WebM recording (Windows/Edge; local mailbox only), set `RECORD_WALKTHROUGH=1` and optionally `WALKTHROUGH_OUTPUT`, then run `node --env-file-if-exists=.env scripts/walkthrough.js`. The script adds synthetic QA data, leaves its completed project closed, and saves video, step results and screenshots under ignored runtime/. The 2026-10-11 run passed 39 visible steps and 53 automated checks; evidence is in runtime/full-test-2026-10-11/. Video records the actual browser viewport without audio. Recording artifacts and test account data stay local.

```text
npm run check
npm test
npm start
```

The application has no third-party runtime packages. It uses Node's HTTP, crypto and SQLite modules. Node 24's SQLite module may print an experimental API notice; this is an implementation risk to review before a production rollout. SQLite is intended for a single-server pilot; migration to PostgreSQL can follow measured capacity needs.

## Implemented workflows

- Task dependency planning: start dates and inclusive calendar-day durations, multiple prerequisite checkboxes, parallel branches, slack-aware delay propagation into PDI/dispatch/delivery, circular/phase checks and responsible-member reminder/report action. Legacy tasks default to one day on their due date; edit Plan / dependencies for realistic estimates. Planning edits change forecasts; target-date revisions retain approvals. Nine targeted browser checks passed; MP4 evidence is local in runtime/dependency-test-1791727213001/.

- Automatic milestones: latest required work date, next-day one-day PDI, editable default seven-day dispatch allowance and delivery three days after dispatch. Task phases separate pre-PDI work, post-PDI corrections/packing and post-delivery installation. Owner/PM confirm the work list and actual inspection; verified work is required. Forecasts and approved targets remain separate; closed schedules freeze until reopening. New projects enter a dispatch target and preview delivery. Verified with 53 automated tests and targeted local browser checks on 2026-10-11.

- Email OTP authentication, expiry, attempt/resend limits, hashed session tokens, HTTP-only cookies and logout.
- Durable SQLite records, transactional mutations, audit events, optimistic task-date/version checks and update retry deduplication.
- Owner-created projects, per-project membership/roles, owner invitations and membership removal.
- Direct task allocation, acknowledgement, progress, blockers, physical verification, returns and purchase dispatch/receipt/inspection quantities.
- Two-person task-date changes; manager-requested/owner-approved delivery changes; reciprocal scope approval with accepted work allocated and customer notification in one transaction.
- Customer-safe current progress, optional response to approved revisions, multilingual scoped comments, private photo/PDF uploads and authorized downloads.
- Monday–Saturday scheduled status tracking in Asia/Kolkata, recurring two-hour in-app alerts during 09:00–19:30, owner/manager escalation and evening carryover to the next working morning.
- Close anytime, suspend updates/reminders, owner-only reopening at the prior stage without resetting approved dates or progress.

## Explicit pilot defaults

Purchase head/manager are one role. The configured project start date begins the one-year retention period. Active projects retain their records until closed; expiry then requires owner review/export, with no automatic deletion. Upload formats are JPEG/PNG/WebP/PDF; the adjustable maximum is 5 MB, distinct from the expected under-1-MB typical file size. Customer status free text is excluded from projections; shared customer comments and files require an explicit audience. Internal project membership authorizes operational collaboration; vendor/service accounts see only their assigned work, their own status and their private conversation plus designated internal contact names.

Each member reports per project, not three times for every task. A task update also counts as member reporting. A later update satisfies earlier outstanding scheduled periods; no notification debt is created for closed periods, pre-membership periods or Sunday. Reminder checks run every minute while the server is running. An unresolved previous working-day evening report carries into the next working morning. Older missing history remains in stored alerts; jobs do not reconstruct arbitrary outages before the previous working day.

## Remaining work

Not a completed production release. Remaining features include module/template UI, drawing revision acknowledgements, notification administration, configurable role capabilities, deterministic report exports, immutable report snapshots, notification failure dashboards, customer safe-label review, backup/restore automation and demonstrated restoration, production hosting and operational ownership. Local visual walkthroughs have passed; actual email delivery, representative participant usability and production operation still need verification. No AI, WhatsApp, ERP or mobile integration is included.

The pilot progress indicator counts visible verified tasks; it is not the report's proposed weighted physical-progress measure and is labelled accordingly. Closure is separate from final acceptance and does not fabricate customer sign-off.
