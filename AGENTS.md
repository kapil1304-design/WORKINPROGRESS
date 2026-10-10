# WorkInProgress project instructions

Last updated: 2026-10-10

## Active development baseline — 2026-10-10

Latest user instruction authorizes development of a testable pilot and delegates remaining routine decisions to the assistant. Stop the sequential questionnaire; ask only for essential missing information. This supersedes earlier documentation-only scope and pending-question handoffs. Existing confirmed business rules remain binding.

Implementation assumptions (assistant-selected, revisable):
- Local development first, no hosting purchase or production launch. Browser prototype uses synthetic data only.
- Purchase head and purchase manager represent one role.
- Production timezone target Asia/Kolkata; current prototype uses browser local time.
- Active-project retention extends until closure; expired closed projects require owner review/export before any deletion. No automatic deletion.
- Reminders begin after a missed timeliness period, repeat in two-hour buckets during Monday–Saturday 09:00–19:30, and a later member update resolves earlier missed periods that day. No reminder debt for closed intervals. Sunday has no scheduled obligations.
- Simple version-one forms and configurable business data; no budget, launch date or service guarantee inferred.
- Initial technology is dependency-free HTML/CSS/JavaScript for a local workflow prototype. Secure shared pilot requires a server database, server authorization, real email OTP and unattended jobs; backend/provider choice will follow available runtime and deployment evidence.

Current output: [local pilot](app/index.html), [source](app/app.js), [prototype notes](app/README.md). Implements demonstrable projects, members, tasks, status updates, verification, approval requests, scoped demo views/comments, in-app alerts and closure/reopening.

Validation performed: seven isolated JavaScript workflow checks passed (self-approval denied; alternate task-date approver allowed; purchase manager delivery initiation denied; owner delivery approval; reciprocal scope approval; vendor task isolation; closed-project request denial). These test demo logic, not security. Static file references checked. Visual browser QA was not performed. Node is absent from PATH and its standard install path; Python launcher is unavailable.

Limitations: browser-local data and selectable demo identities; no actual email OTP, secure server enforcement, file uploads, unattended reminders, supply receipts/quantities, dependencies, customer acceptance action or production backup/recovery. No report acceptance register test is marked passed. Next milestone is secure multi-user foundation and completing these pilot workflows. Full original report scope is not represented as implemented.

## Required reading

At the start of every project work session, read this file and the six maintained documents: `PRD.MD`, `ARCHITECHTURE.MD`, `RULES.MD`, `DESIGN.MD`, `TASKS.MD`, and `MEMORY.MD`. Read applicable instructions in any subdirectory before changing its files.

The initial source is `WorkInProgress_Complete_Project_Document.doc`, version 1.0, dated 8 October 2026, including its Added Input. Preserve that report as the initial discussion record. The architecture filename intentionally follows the user's requested spelling, `ARCHITECHTURE.MD`; do not create a competing architecture document.

## Maintain documentation with the work

Review the six documents after each meaningful project change and before ending a work session. Update the affected documents in the same change as the implementation or decision. Review all six at milestones, releases, and whenever a revised report arrives. A review with no relevant change does not require rewriting a document or changing its last-updated date.

| Change | Documents to update |
| --- | --- |
| Requirements, scope, feature priority, acceptance criteria | PRD.MD, TASKS.MD; RULES.MD or DESIGN.MD if behavior changes |
| Components, data model, interfaces, hosting, integrations | ARCHITECHTURE.MD, TASKS.MD; RULES.MD if constraints change |
| Permissions, workflow invariants, development conventions | RULES.MD and affected PRD.MD, ARCHITECHTURE.MD, DESIGN.MD |
| Screens, fields, interactions, approved visual decisions | DESIGN.MD; PRD.MD and TASKS.MD if scope changes |
| Work started, completed, blocked, or verified | TASKS.MD |
| Durable decisions, discovered facts, unresolved issues, handoff | MEMORY.MD and the document owning the detail |

Update the date and change log only in documents actually changed. Keep stable requirement, feature, task, and acceptance-test IDs. Link completed tasks to evidence and describe checks actually performed. Record unresolved concerns and next actions in TASKS.MD and MEMORY.MD.

## Evidence and decision discipline

Distinguish confirmed user needs, report proposals, implementation choices, and verified implementation. The report explicitly leaves technology stack, budget, staffing, schedule, and service targets undecided. Documentation creation does not approve the proposed feature priorities or authorize building and deploying the entire application.

Record decisions with date, rationale, source or decision-maker, approval status, and affected documents. Do not describe a recommendation as approved, a test as passed without running it, or a feature as implemented without evidence. Never replace baseline commitments with forecasts or let chat/AI silently make official commitments.

## Current scope

The user authorized pilot development and delegated routine remaining decisions on 2026-10-10. Maintain documentation alongside implementation; ask questions only when essential. Follow the permission and confidentiality rules in RULES.MD during implementation. Preserve unrelated user work and the original report. Do not commit secrets or personal/commercial data into these documents.

| 2026-10-10 | User authorized pilot development and delegated remaining assumptions; local workflow prototype implemented and seven isolated logic checks passed. |
