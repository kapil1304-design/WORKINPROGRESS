# Local pilot prototype

Open `index.html` in a modern browser. No installation or build is required.

This is a local demonstration using browser localStorage and explicitly selectable demo identities. It is **not secure multi-user software** and must use synthetic data only. Email OTP and server-side authorization are not implemented. Data is specific to the browser/profile and is not shared with colleagues.

Implemented for demonstration: project creation, members, scoped demo views, task allocation, status submission and physical verification, two-person task-date/scope approvals, manager-to-owner delivery approval, customer-safe progress, scoped comments, closure, owner-only reopening at the retained stage, in-app alerts.

Assumed prototype defaults: purchase head and manager are one role; local browser timezone (production target Asia/Kolkata); active-project retention extends until closure; expiry requires owner review and no automatic deletion. Reminders are evaluated while the page is open, every two minutes; first eligible alert follows a missed window and repeats in two-hour buckets during working hours. A late member update resolves earlier missed windows on that date. Real background scheduling requires the server milestone.

Pending: real email OTP/provider credentials, server database and authorization, photo/PDF attachments, customer acceptance action, supply quantities/receipts, dependency graph, retention automation, unattended reminder delivery, formal reports and automated tests. Closure suppresses pending alerts in this prototype; the full server should retain auditable delivery history.

Verification checklist: create a project as owner; allocate work; switch to assigned staff and submit; switch to manager and verify; request a date change and confirm requester cannot approve; approve as a different manager; close as manager, confirm updates stop and reopen action absent; reopen as owner and confirm retained stage/status. Check customer view omits internal approval requests and personal status authors. Check vendor sees only own tasks/updates/comments.
