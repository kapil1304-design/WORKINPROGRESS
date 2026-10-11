# WorkInProgress — Project and application rules

Last updated: 2026-10-11
Status: Initial documented rules; application rules are requirements/proposals awaiting implementation.
Source: [Complete project report](WorkInProgress_Complete_Project_Document.doc), especially §§5–12, 15, and Added Input; user's instruction to maintain six project documents.

## Visible workflow verification and assignment visibility — 2026-10-11

Visible acceptance testing uses synthetic WATCH TEST data and simulated physical verification only; it does not establish real machine acceptance or official customer commitments. Existing unrelated project data was left intact. Walkthrough requires local development mailbox and loopback origin. Browser artifacts/OTP files remain ignored; codes are not logged.

## Explicit task recipient selection — 2026-10-11

Assignment must target an explicitly selected execution member added to the project; global owner access alone does not make the owner an added task recipient. Customers are excluded. Owner/manager/purchase manager retain assignment authority. This turn includes a user-authorized one-project reset, not a general deletion policy.

## Vendor member item name — 2026-10-11

Item names are descriptive vendor membership metadata, not task allocations or completion approvals. Owner may add/edit them under existing membership permissions. Non-vendor roles store no vendor item name. Existing project-scoped vendor/customer isolation remains.

## Project PO number and authorized test reset — 2026-10-11

Project PO is an operational reference, not an accounting integration or purchase approval. Validate text/length; unrelated external vendor/service views do not expose the customer PO number. The one-project data reset was explicitly user-authorized and is not a new general deletion/retention rule.

## Member departments and editing — 2026-10-11

Only business owner edits membership/profile details on open projects. Departments do not imply permissions; role changes remain explicit owner grants. Validate configured department names and email uniqueness, reject stale profile/membership versions, record before/after values in audit history. Participant-type changes are blocked when other memberships or assignments would be invalidated.

## Verified shared application milestone — 2026-10-10

Implementation commit b92b2d31972d9737cd90f6576323687fc7b09e01 passed npm run check and all 24 automated tests on GitHub Actions (Node 24.21.0, Ubuntu). Evidence: https://github.com/kapil1304-design/WORKINPROGRESS/actions/runs/38072536855. Test coverage includes actual HTTP OTP/session/CSRF/logout, attempts/expiry, SQLite restart persistence, negative project/vendor/customer/file access, version/idempotency behavior, approval rules, scope allocation transaction rollback, quantity constraints, closure/reopening and reminder timing/deduplication/carryover.

DEV02/DEV03 core server workflows are implemented and automated checks passed; actual provider email, local Windows startup and visual browser QA remain unverified. No hosting, real participant invitation or production rollout occurred. Node installation is still waiting for the Windows administrator prompt. Tests ran remotely so this local installation delay did not prevent verification.

Current handoff: source is in server/ and web/, setup in DEVELOPMENT.md. Next continue remaining report workflows and browser/production readiness. User delegated routine decisions; do not restart discovery questioning.

## Shared application implementation — 2026-10-10

Current milestone supersedes the earlier browser-prototype-only implementation status. User requested continued project development. Assistant selected Node.js 24, built-in HTTP/crypto/SQLite and a responsive web client for the single-server pilot; no third-party runtime dependencies or hosting purchase.

Implemented source: server/store.js, server/auth.js, server/service.js, server/files.js, server/main.js and web/. Includes persistent transactional records, email OTP/session handling, project-scoped role checks, membership removal, allocation/acknowledgement/status, physical verification, supply quantities, approval workflows, scoped comments, private photo/PDF downloads, customer-safe projections/optional revision responses, owner-only reopening, and server reminder jobs in Asia/Kolkata. See DEVELOPMENT.md for setup and precise limits. Implementation is awaiting runtime test results at this handoff point.

Pilot assumptions: role purchase head=manager; 5-MB configurable upload cap (expected files remain under 1 MB); JPEG/PNG/WebP/PDF; expiry requires owner review, no deletion; active retention extends until closure. Member reporting is per project; late updates satisfy earlier outstanding periods. Evening reminder debt carries to next working morning; arbitrary outages before the previous working day are not reconstructed. Internal membership grants operational collaboration; external accounts see assigned work/private conversation plus designated internal contacts. Customer free-text status is excluded; explicitly shared comments/files remain visible.

Authentication development mode stores test codes in an ignored local mailbox, binds loopback, and cannot run in production. Real email integration uses Resend with provider credentials/verified sender, not yet exercised. Every actual login requires a single-use code; there is no demo identity selector in the shared app.

Verification pending: Node installation requires Windows administrator approval; service and HTTP/OTP tests are written in test/. GitHub Actions workflow runs syntax and tests. Do not mark tests passed until run. No shared deployment, actual email delivery, browser visual QA or backup restoration has been performed. Remaining report features are listed in DEVELOPMENT.md; not all F01–F36/AT01–AT38 are implemented or passed.

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

## Documentation and development

1. Read AGENTS.md and all six project documents at the start of a work session. Review them after meaningful changes and before handoff; update affected files in the same change. Review all six at milestones/releases and when a revised report arrives.
2. Preserve the source report. Keep `ARCHITECHTURE.MD` as the requested architecture filename. Keep stable IDs and working relative links.
3. Separate confirmed user needs, proposed behavior, approved decisions, implemented behavior, and verified outcomes. Report v1.0 does not approve a stack, timeline, cost, staffing ratio, or service guarantee.
4. Record durable decisions with date, rationale, source/approval status, and affected documents in MEMORY.MD. Keep TASKS.MD statuses and acceptance evidence truthful.
5. Choose implementation conventions when the stack is selected; record them here instead of inventing repository commands or standards before code exists.
6. Run checks appropriate to actual changes. Permission, quantity, commitment, reminder, and concurrency behavior require meaningful tests during implementation. Never mark those tests passed based only on document review or a UI demonstration.
7. Preserve unrelated user changes and keep secrets/personal/commercial records out of repository documentation and logs.

## Ownership and work commitments

- Every issued assignment has one accountable owner, defined scope, applicable target date, completion criteria, and verifier or verification policy.
- The assignee acknowledges or disputes scope/date. Preserve the original request and accepted commitment. Reassignment records outgoing and incoming ownership.
- Project owners remain accountable for decisions, recovery, and customer commitments. Reminders do not resolve exceptions or replace accountable ownership.
- Internal team members, vendor members and service-provider members follow the confirmed three scheduled daily updates Monday–Saturday. The earlier proposed separate standard-product confirmation cadence is superseded by the user-confirmed common schedule; submission remains open anytime.
- An update records completed work, pending work, forecast, next action, and blockers. No progress requires a reason; a forecast beyond commitment requires a delay reason.
- Record urgent blockers immediately. Name the resolver, help/decision required, and response deadline; recovery actions have their own owner/date.

## Status, freshness, and verification

Execution state and schedule health are independent dimensions.

| Dimension | Values / meaning |
| --- | --- |
| Execution | Not started; In progress; Blocked; Submitted for verification; Completed; Cancelled |
| Schedule / data health | On track; At risk; Overdue; Update missing; multiple exception flags may coexist |

Blocked work can still receive updates. In-progress work can be overdue. Missing updates must be visible even before the commitment date. Do not infer confident on-track status from unchanged dates when the data is stale.

Reported completion is a submission, not acceptance where verification is required. Enforce independent verification when configured; an assignee cannot self-approve such work. Returns/reopenings retain earlier submissions and decisions. Cancellation is separate from completion and needs an authorized reason.

Show last-updated time, department/authorized source, whether information is reported or verified, and update freshness. Preserve actual event time and entry time; updates entered on someone's behalf retain their source and confirmation state.

## Dates, dependencies, and scope

- Keep original baseline, current approved plan, assignee forecast, and actual dates separately.
- Preserve date-change author, reason, previous value, and applicable approval. Revising a vendor promise does not erase the original commitment.
- Only authorized approval changes an official customer commitment. Dependency propagation, reminders, chat, AI, customer comments, and adverse forecasts do not change it automatically.
- Use project timezone/calendar/holidays and the agreed cutoff for date-only commitments. State whether lead time uses working or calendar days and what starts it: PO, advance receipt, drawing approval, or agreed condition.
- Pilot dependency relationships are finish-to-start. Reject loops. Any early-work override requires documented authorization and rationale.
- Describe delivery impact as a forecast with assumptions/calculation time. Advanced scheduling and buffer computation remain later proposals.
- Scope changes record request, revision, affected work/quantities, proposed time/cost impact, and decision. Drawing changes require affected-person acknowledgement; an authorized person determines stop/continue/rework action.
- Customer approval references the exact submission version. Returned submissions create another review cycle without erasing history.

## Supply and quantity rules

- Required factory arrival, committed dispatch, expected arrival, actual receipt, and acceptance are separate facts.
- Dispatch never means available for assembly. Only accepted usable quantity satisfies readiness.
- Track shipments, partial receipts, held/rejected quantity, short supply, rework, and scrap separately. Quantities and units must be explicit and nonnegative.
- For a receipt, accepted quantity cannot exceed received quantity. Accepted/rejected/held allocations must not double-count the same units; validate transitions when inspection changes.
- A partial supply cannot close the full requirement. Retries cannot duplicate shipments, receipts, or acceptance counts.
- Quantity changes record an adjustment and reason. Service hours are effort, not proof of accepted deliverables.

## Visibility and permissions

| Information | Authorized internal members | Customer | Assigned vendor |
| --- | --- | --- | --- |
| Operational project progress | Project scope | Customer-safe project view | Own commitments only |
| Department progress | Authorized detail | Department labels/status | Only necessary own inputs |
| Supplier activity | Authorized detail | Neutral labels/status by default | Own work only |
| Personal identities/contacts | As granted | Hidden by default | Designated contact only |
| Other vendors and assignments | As granted | Identity hidden by default | Hidden |
| Internal prices/costs | Separately restricted | Hidden by default | Own documents only if granted |
| Drawings, files, and comments | According to audience | Explicitly shared content | Assigned/shared content only |
| Conversations | Explicit membership | Explicit customer conversations | Explicit own-vendor/task conversations |

Read/write/assign/approve/export/manage-user capabilities are separate grants. Admin-created department or role names do not grant capabilities automatically. Evaluate effective scope for the active project and assignment. A global title or project membership alone does not grant all records or all conversations.

Confirmed pilot requirement: a vendor/customer organization may have several people from different departments with individual logins. Keep organization membership separate from each person's project/assignment/conversation grants. Company-wide visibility, invitation authority and permission administration are not implied by an individual's department title.

The 10 initial internal departments are Mechanical, Design, Assembly, Procurement, Electrical Wiring, PLC Programming, Software Development, Installation, Stores and Material Control, and Testing. Administrators can add more as the company evolves. Preserve these exact selected names in initial configuration; do not hard-code the list or promote other suggested departments to confirmed configuration. Additions/renames must preserve assignment references and audit history; membership or name changes do not implicitly grant new capabilities.

Enforce authorization server-side on records, fields, files, nested queries, participant lists, autocomplete, mentions, search, exports, background jobs, and notifications. Deny absent grants. Prevent cross-project/customer/vendor access even when an ID or direct file URL is known.

Customer publication reviews must consider free text, filenames, title blocks, photograph content, and metadata as well as visible uploader names. Revocation blocks future access and deliveries; downloaded copies cannot be recalled.

## Project chat

- Separate internal, customer, vendor, and task conversation audiences with explicit membership. A vendor must not discover other vendors through suggestions, participant lists, forwarding, or attachments.
- Link only records and files the recipient can access. Recheck audience before a message/file is forwarded or reused in another conversation.
- Messages/replies/photographs/mentions/unread notifications support coordination. Pins, search, edit history, and optional read receipts are report recommendations whose release placement remains open.
- A message can propose an action, blocker, or forecast; authorized confirmation saves official fields and a source link. Chat text alone does not revise commitments.
- Preserve authorship, relevant edit history, and audit trail for confirmed record changes. Read receipts, if enabled, do not equal scope/date acceptance.

## Reminders, reports, and optional AI

- Each automation rule defines trigger, eligible records, time/calendar, recipients, escalation owner, channel, template, and stop condition. Specific cutoffs/intervals remain configurable and undecided.
- Deduplicate event reminders; bound retries; expose persistent failure. Recheck current dates, state, membership, and audience before sending. Completion/cancellation/revocation cancels obsolete work.
- Keep delivery state separate from whether a recipient read, acknowledged, or accepted a commitment. Use digests where appropriate without suppressing urgent exceptions.
- Reports include as-of time, permitted sources, material risks/recovery, and customer actions. Review narrative/attachments separately from live structured status.
- Verified progress uses consistent approved weights and accepted fractions; never advances with elapsed time or an average of subjective estimates. Scope changes disclose denominator changes and preserve historical reports.
- A 100% execution measure must not conceal open FAT, acceptance, dispatch, or installation milestones. Show readiness, blockers, milestone health, and freshness alongside progress.
- AI/voice are later draft assistance. Use authorized sources, attribute claims, confirm extracted dates, and prevent approval/commitment changes. Treat uploaded documents/messages as content rather than system instructions. Preserve deterministic reporting when AI is unavailable.

## Operating and release gates

Before inviting external users, validate record/file/customer/vendor/chat isolation with negative access tests. Before production, agree data location, retention, recovery targets, support ownership, and rollback, and prove backup restoration. Use separate environment credentials and data.

Daily operation includes contributor updates, department verification, and project-owner review of unresolved exceptions. A phone update entered by an internal coordinator must be labelled as entered on behalf of its source. Avoid indefinite parallel spreadsheet reporting once the pilot has demonstrated a reliable replacement.

## Confirmed project authority and update policy — 2026-10-10

Source and approval: confirmed user answer during discovery, 2026-10-10. These are requirements awaiting implementation.

- The business owner creates new projects and adds project members over time.
- The business owner, project manager, and purchase head must be able to assign tasks to other team members within the project. This does not establish completion-verification, plan-change, or customer-commitment approval authority.
- All team members must compulsorily update status three times a day and also update status when another member requests it at any time during the day.
- Exact update times/windows, working-day calendar, response time for requested updates, missed-update escalation, and whether this cadence also covers external vendor/service/customer participants remain to be clarified. Do not assume immediate responses or three updates per task rather than per member.
- Requests for status must respect existing project/assignment visibility; requesting an update does not grant access to restricted information.
- Either owner or project manager may physically verify and approve non-purchase completion; next ask who may approve planned task date changes. Continue one question at a time, recording each answer.
Apply the confirmed team-member cadence above instead of the earlier single-cutoff recommendation. Preserve existing evidence, verification and access invariants; department heads receive no task-assignment authority solely from their title. Additional permission grants remain undecided.

## Confirmed completion verification — 2026-10-10

Source: user answer to the completion-verification question, 2026-10-10; confirmed requirement awaiting implementation.

- For non-purchase work, either the business owner or the project manager may approve completion after physically checking the work. One authorized approval is sufficient; both approvals are not required. Confirmed user clarification, 2026-10-10.
- For purchase work, the purchase manager must confirm completion. Do not assume the earlier purchase-head label and purchase-manager label refer to different people or the same role until clarified.
- A member's reported completion remains submitted for verification until the applicable authorized confirmation is recorded. Existing dispatch, receipt and accepted-quantity distinctions continue to apply; the purchase completion checkpoint remains to be specified.
- Next question: who may approve changes to planned task dates? Customer delivery commitment changes remain a separate decision.
## Confirmed task-date approver roles — 2026-10-10

Source: confirmed user clarification, "all 3", for planned task start/completion date changes. The business owner, project manager and purchase manager are all included as authorized approvers. Confirmed follow-up: one of these three initiates the date-change request, and a different one of the three approves it. The initiator cannot approve their own request; approval from the third person is not required. This answer does not establish authority to revise official customer delivery commitments or scope.

Preserve the original baseline, prior dates, change reason, requester, approving person(s) and approval time. Interface and server authorization must use the final agreed approval rule. These are documented requirements; no application implementation or test is complete.

The project manager initiates customer delivery-date changes and the business owner approves; customer notification is mandatory and acceptance optional; next ask project-scope change authority.
Confirmed task-date workflow clarification, 2026-10-10: preserve requester, requested dates, reason, decision, approving person and timestamps. Apply the approved task dates only after a different authorized person approves; retain original baseline and prior approved dates. This workflow is distinct from assignee forecast updates. Proposed UI exposes request and approve/return actions according to scope; server checks actor identity and authority. Application behavior and tests remain unimplemented.
## Customer delivery-date authority — 2026-10-10

Source: user's explicit correction of the previous answer, 2026-10-10. Confirmed requirement awaiting implementation.

- The project manager initiates a request to change the delivery date promised to the customer; the business owner approves it. These are distinct, fixed responsibilities.
- The earlier answer naming the purchase manager was withdrawn by the user. It grants no customer delivery-date authority.
- The project manager cannot approve their own request. The business owner's approval is required before changing the approved delivery commitment.
- Preserve the original customer commitment, requested revision, reason, requester, approving person, decision and timestamps. Keep forecasts separate from approved commitments.
- After business-owner approval, the customer must be notified of the revised delivery date and offered an option to accept it. Work must continue without waiting for customer acceptance. Record internal approval, notification and customer acceptance separately; silence does not mean acceptance.
- Scope-change authority is confirmed as reciprocal initiation/approval between business owner and project manager. Next clarify customer approval versus optional acceptance for scope changes.

## Revised delivery-date notification and acceptance — 2026-10-10

Confirmed user requirement: after project-manager initiation and business-owner approval, notify the customer of the revised delivery date and provide an acceptance option. Customer approval is not a gate to continued work. Display the owner-approved revised date and customer acceptance state separately; retain the original commitment and do not label an unaccepted revision as customer-agreed.

Proposed implementation implications: maintain a revision record with requested/approved dates, reason, internal decision, customer notification state and optional customer acceptance tied to that exact revision. Expose notification failure internally and retain customer responses. Do not pause execution because acceptance is pending. Notification channel and handling of an explicit customer objection remain open.

Next discovery question: must the customer approve a scope/specification change before affected work proceeds, or is notification with optional acceptance sufficient?
## Confirmed project-scope change authority — 2026-10-10

Source: confirmed user answer about adding/removing project work or changing machine specifications, 2026-10-10. Requirement awaiting implementation.

- If the project manager initiates a scope change, the business owner approves it.
- If the business owner initiates a scope change, notify the project manager; the project manager approves it.
- The initiator cannot approve their own change. These reciprocal responsibilities apply to scope changes; customer delivery-date changes retain the separately confirmed fixed project-manager initiation/business-owner approval rule.
- Apply the scope revision only after the other authorized person approves. Preserve original scope, requested revision, reason, affected tasks/specifications/quantities, proposed date/cost impacts, initiator, decision, approver and timestamps.
- Proposed UI and server behavior: scoped request/approve/return actions, notification to the project manager for owner-initiated changes, and rejection of self-approval or unauthorized approval. Preserve historical reports and disclose any progress-weight denominator changes.
- Confirmed follow-up: scope-change requests must be recorded and work continues without waiting for customer acceptance, rejection or approval. Customer response remains separate from internal scope approval. Within seven days, accept/reject the additional scope, assign accepted scope to the team, and notify the customer. The limit is seven calendar days from receipt of the change request.
- The period starts on receipt of the change request; next ask customer progress publication policy.
## Scope-change recording and customer response — 2026-10-10

Source: user follow-up about customer handling of scope/specification changes.

Confirmed: record the requested change; work must continue without waiting for customer acceptance, rejection or approval. Preserve the separately confirmed reciprocal internal owner/project-manager approval rule. Pending customer response must not be treated as acceptance.

Confirmed follow-up: within seven days, the company must accept or reject the requested additional scope, assign accepted additional scope to the team, and notify the customer of the decision and applicable allocation. Rejected scope is not assigned for execution. This is a scope-decision/allocation/notification deadline, not a deadline to complete the additional work or obtain customer approval. The user confirmed seven calendar days, including weekends and holidays, starting when the change request is received. Overdue handling remains to be clarified.

Customer progress visibility is confirmed: latest permitted progress whenever customers log in, without internal publication review. Evening window confirmed through 20:00, with reminders stopping at 19:30. Working days confirmed as Monday–Saturday; submission remains open on Sunday. Next ask reminder delivery channels.
## Confirmed additional-scope handling deadline — 2026-10-10

Source: confirmed user clarification. The company must complete its acceptance/rejection decision, assignment of accepted additional scope to the team, and notification to the customer within seven days. Retain the existing owner/project-manager reciprocal internal approval rule and authorized task-assignment roles. Customer response does not block continued work; rejected additional scope must not be assigned for execution.

Proposed implementation/design: record received/requested time, internal decision and reason, authorized decision-makers, team allocations, customer notification/delivery state and corresponding timestamps. Show pending decisions, unassigned accepted scope and notification failures. Calculate the deadline only after the period start and calendar/working-day basis are agreed. Additional work completion dates remain separately planned.

Customer progress visibility is confirmed: latest permitted progress whenever customers log in, without internal publication review. Evening window confirmed through 20:00, with reminders stopping at 19:30. Working days confirmed as Monday–Saturday; submission remains open on Sunday. Next ask reminder delivery channels. Overdue scope-request escalation remains open.
Calendar clarification, 2026-10-10: the confirmed additional-scope decision, accepted-work assignment and customer-notification deadline is seven calendar days, including weekends and holidays. Do not calculate it using working days. Confirmed follow-up: the seven-calendar-day period starts when the change request is received. Record receipt time as the deadline basis. Next ask whether permitted customer progress appears live or requires internal review. Existing internal approval responsibilities and continued work without waiting for customer response remain in force.
## Finalized additional-scope handling period — 2026-10-10

Confirmed user clarification: within seven calendar days from receipt of a change request, complete the internal acceptance/rejection decision, assign accepted additional scope to the team, and notify the customer. Weekends and holidays count. Preserve the reciprocal owner/project-manager approval rule. Customer response does not block continued work, and silence is not acceptance.

Record request receipt, resulting deadline, decision, accepted-scope allocation and customer notification timestamps. Exact timezone/cutoff and overdue escalation details remain open; implementation and application checks have not been performed.

Discovery handoff: scope handling duration and starting event are answered. Q05 is answered: customer-permitted progress is visible whenever customers log in. Evening window confirmed through 20:00 and reminders stop at 19:30. Scheduled days confirmed as Monday–Saturday; submission always open. Next ask Q06 reminder delivery channels. Continue one question at a time.
## Confirmed customer progress visibility — 2026-10-10

Source: user answer to Q05, "they can see it any time they login". Customers may view the latest permitted recorded progress whenever they log in; permitted structured progress does not wait for business-owner or project-manager publication review.

Continue to enforce customer/project/field access controls, department labels, restricted identities/commercial information and explicit file-sharing permissions. Show update timestamps, missing/stale updates and reported versus physically verified completion; visible progress is not automatically verified completion. This answer concerns progress visibility and does not approve automatic sharing of internal narratives, chat or attachments.

Proposed implementation/UI: authorized customer dashboard reads current permitted progress and freshness on login/access. Preserve the separate completion-verification and scoped-file publication rules. This remains a requirement awaiting implementation.

Scheduled times/windows are confirmed as 10:00 ±1 hour, 14:00 ±1 hour and 19:00 ±1 hour. Evening window confirmed through 20:00, with reminders stopping at 19:30. Working days confirmed as Monday–Saturday; submission remains open on Sunday. Next ask reminder delivery channels.
## Confirmed scheduled updates and reminders — 2026-10-10

Source: confirmed user answer to Q06.

| Scheduled time | Allowed update window |
| --- | --- |
| 10:00 morning | 09:00–11:00 |
| 14:00 afternoon | 13:00–15:00 |
| 19:00 evening | 18:00–20:00 |

Each scheduled update has a one-hour allowance before and after its scheduled time. Members may also voluntarily update at any time; the earlier obligation to respond to permitted requests from other members remains. Additional voluntary updates do not eliminate the scheduled-update requirement unless a counting policy is later agreed.

Superseding user clarification: update submission never closes. For missing scheduled updates, keep sending reminders or warnings every two hours during working hours of 09:00–19:30, and highlight missing updates to the business owner and project manager. The earlier two-reminder cap is withdrawn. Missing updates and reminders must never block work. First-reminder trigger, timezone, working-day calendar, notification channels and late-update reminder cancellation remain to be clarified.

Proposed implementation/UI: configurable scheduled windows; timestamped update history; visible missing-update flags; reminder records with bounded, deduplicated delivery. Keep work actions available when updates are missing. Customer freshness and reported/verified labels remain visible. No application implementation or reminder test has been performed.

Scheduled updates apply Monday–Saturday; submission stays open every day including Sunday. Next ask reminder and warning delivery channels.
## Superseding missing-update reminder policy — 2026-10-10

Source: confirmed user correction. Scheduled windows indicate when updates are expected; they never close the ability to submit. Continue reminders/warnings every two hours during working hours 09:00–19:30 for missing updates, and highlight the non-updating members to the business owner and project manager. This replaces the earlier two-reminder limit. Never stop or restrict work for missing updates.

Proposed implementation/UI: persistent missing-update flags, owner/project-manager exception views, auditable recurring reminder delivery with deduplication and authorization checks. No application behavior or tests are implemented. First-reminder trigger, late-update resolution/cancellation, timezone, working days and delivery channels remain open.

Confirmed timing clarification: the evening scheduled-update window remains 18:00–20:00, while reminders/warnings stop at 19:30. Submission remains available anytime, including after 20:00; the scheduled window is a timeliness measure, not a submission lock. Do not send reminders outside 09:00–19:30. Scheduled days are Monday–Saturday, with submission open every day. Next ask reminder delivery channels.
Evening timing confirmation, 2026-10-10: user confirmed keeping the 18:00–20:00 scheduled update window while reminders stop at 19:30. Keep submission available anytime and never block work. Reminder hours remain 09:00–19:30. Working days, timezone, first reminder trigger and notification channels remain open. Next discovery question: which channels should deliver reminders and warnings—in-app, email, WhatsApp, or a combination?
## Confirmed weekly update calendar — 2026-10-10

Source: user clarification. Status-update submission is always open, at any time on every day including Sunday. The three normal scheduled updates apply Monday through Saturday. Their ±1-hour periods measure timely reporting only; they never restrict submission.

Normal scheduled-update reminders follow Monday–Saturday, with delivery only during 09:00–19:30. Sunday has no normal scheduled-update obligation or associated reminder schedule. Preserve the ability to update voluntarily and the previously confirmed obligation to respond to permitted status requests; Sunday handling of such requests and outstanding reminders has not been separately specified.

The evening scheduled timeliness period remains 18:00–20:00 while reminder delivery stops at 19:30. No missing update or reminder blocks work. Holiday exceptions, timezone, first reminder trigger, carryover/resolution and delivery channels remain open.

Next question: which channels should carry reminders and warnings—in-app notifications, email, WhatsApp, or a combination?
## Confirmed platform phases and pending notification channels — 2026-10-10

Source: user clarification. First version is a web application only. A mobile application belongs to the second phase, after experience across approximately 20–50 projects. This is a phase gate for later discussion, not an approved mobile delivery date; whether project count means completed or handled projects remains open.

Notification channels are not decided. User supports the proposal of WhatsApp reminders containing a web link to submit the update, after WhatsApp integration. This does not authorize provider selection, integration spend or message sending.

Interim recommendation, not yet approved: in-app reminders/missing-update warnings and business-owner/project-manager exception views for the web version; email reminders with an authorized update-page link if users need notifications while the web app is closed. In-app notifications alone reach users when they open/use the application. Browser push can be evaluated separately if needed. WhatsApp integration is not required for the core update workflow.

Update links must require login and current project/task authorization; a link must not bypass access controls. No credentials or private status data in URLs. Keep reminder generation separate from delivery channels so email/WhatsApp can be added later without changing the reporting rules.

Phase-one in-app notifications are confirmed for everyone; email is not selected. Vendor/service-provider cadence is confirmed as the same schedule. Customer reporting exemption is confirmed; Q07 endpoint confirmed through final acceptance; either business owner or project manager may close the project. Acceptance documents are optional; closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed phase-one notification channel — 2026-10-10

Source: confirmed user answer, "in app is fine for everyone in the first phase". Phase one uses in-app notifications for all participant types, with project/assignment/audience authorization enforced. Email reminders were proposed but not selected; WhatsApp integration remains a later proposal. No external messaging channel is required for phase one.

Provide members their permitted reminders/warnings and notify the business owner/project manager of missing updates through authorized in-app views. Persist notifications for viewing when users open the web app; do not imply out-of-app delivery. Existing reminder cadence, working hours, scheduled days and non-blocking work rules remain. Notification-channel approval does not extend internal scheduled-update obligations to external participants without clarification.

Vendor and service-provider members follow the same scheduled updates. Customers are exempt from compulsory updates and may write voluntarily. Q07 endpoint confirmed through final acceptance; either business owner or project manager may close the project. Acceptance documents are optional; closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed vendor and service-provider reporting cadence — 2026-10-10

Source: user answer, "same for all", to whether vendors and service providers follow the same three scheduled daily updates. Internal team members, vendor members and service-provider members follow the same schedule: Monday–Saturday at 10:00, 14:00 and 19:00, each with ±1-hour timeliness allowance. Submission remains available at all times, including Sundays.

Missing scheduled updates follow the confirmed recurring two-hour in-app reminders/warnings during 09:00–19:30 and highlights to the business owner/project manager. Work is never blocked. This confirmed cadence supersedes the earlier proposed separate standard-product vendor confirmation cadence. Maintain organization/project/assignment access restrictions and avoid cross-vendor information disclosure.

Confirmed follow-up: customers have no compulsory status updates and may write whenever they choose. Do not send customer missing-status-update reminders. Separate customer approval/input workflows remain distinct. Next ask the project lifecycle endpoint under Q07.
## Confirmed customer reporting exemption — 2026-10-10

Source: confirmed user answer. Customers are not required to submit status updates and may write whenever they choose. Exclude customer members from compulsory three-times-daily reporting, missing-status-update warnings and escalation for failure to submit scheduled status updates. Internal staff, vendors and service providers retain the confirmed reporting obligations.

Customer messages and comments remain limited to authorized project/conversation audiences, with ordinary authorship and timestamps. Customers can continue viewing permitted progress whenever they log in and optionally accepting revised delivery dates. This reporting exemption does not settle separately tracked customer approval/input deadlines or reminder policies; do not invent such obligations.

Proposed UI/server behavior: no scheduled status-update compliance indicator or missing-update reminder for customer roles; permit voluntary writing within authorized conversations. Notification-channel access remains in-app for all phase-one participants. No application implementation or test is complete.

Lifecycle endpoint confirmed through installation and final acceptance at the customer site. Closure authority confirmed as either business owner or project manager; acceptance documents are optional; closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed lifecycle endpoint — 2026-10-10

Source: confirmed user answer to Q07, "till final acceptance". Phase-one project tracking continues through installation and final acceptance at the customer's site, beyond factory testing and dispatch. This does not authorize post-acceptance warranty/service-management expansion.

Keep factory testing, dispatch, receipt, installation and final acceptance distinct milestones. Dispatch or installation completion alone does not mean project closure. Record final-acceptance criteria, evidence, authorized decision-maker, decision date and remaining punch-list items; detailed acceptance/closure policies remain to be agreed. The customer's scheduled-status reporting exemption does not remove a separately defined final-acceptance action.

Proposed implementation/UI: preserve authorized project access, progress, blockers and milestone history through final acceptance. Include installation and final-acceptance milestones in phase-one planning and customer views. No application implementation or tests are complete.

Either business owner or project manager may close the project. Acceptance documents are optional; closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed project closure authority — 2026-10-10

Source: confirmed user answer, "we will close it --me or project manager". Either the business owner or the project manager may close the project; one authorized closure action is sufficient. This does not require reciprocal approval under the separate scope-change rule.

Maintain tracking through final acceptance as already confirmed. Record closure actor, time and supporting evidence. Who supplies final-acceptance evidence, whether customer sign-off is required, and treatment of open punch-list items remain to be clarified. Do not equate an internal closure action with customer acceptance without evidence.

Proposed implementation/UI: scoped closure action for business owner/project manager, server authorization and audit history; final-acceptance/closure criteria to be finalized before implementation. No application implementation or test is complete.

Acceptance documents are optional, with an attachment option. Closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed optional acceptance document — 2026-10-10

Source: user answer to whether a customer-signed acceptance document must be uploaded before closure: a document is not necessary, but the option must exist. Record the acceptance document as optional, with attachment and authorized viewing/download available when provided.

Either business owner or project manager may close the project without a mandatory acceptance-document upload. Record the authorized closure action and timestamp; do not label closure as customer-signed acceptance unless such evidence actually exists. Existing private-file access/sharing rules apply to optional documents.

Proposed closure interface: optional acceptance attachment; no required-document validation blocking closure. Application implementation and tests remain pending. Handling of open punch-list items remains undecided.

Closure is allowed anytime by owner/project manager. Closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed unrestricted closure timing — 2026-10-10

Source: confirmed user answer, "we can close anytime". Either business owner or project manager may close a project at any time, including with pending tasks, punch-list items or acceptance milestones. Do not require all items completed or an acceptance document before closure.

Project closure is separate from task completion and final acceptance: retain actual outstanding-item and milestone states, prior evidence, actor and closure timestamp. Do not automatically mark pending work completed, invent customer acceptance, or set progress to 100% merely because the project is closed. The lifecycle supports tracking through final acceptance, but does not impose final acceptance as a closure gate.

Proposed implementation/UI: authorized close action with no all-items-complete validation; display the closed project and its outstanding records truthfully. Whether outstanding work stays active with reminders after closure, and reopening authority, remain to be clarified. No application implementation or tests are complete.

Closed projects stop execution updates and reminders until reopened. Only the business owner may reopen a project; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed closed-project behavior — 2026-10-10

Source: confirmed user clarification, "close means close---until we re-open". Closure stops project execution updates and project-related reminders/warnings, including pending-task and missing-status reminders, until the project is reopened. Preserve outstanding states and history; do not mark unfinished work completed or erase records.

The general always-open status submission rule applies to open projects; a closed project is the explicit exception. Proposed implementation/UI: closed project records remain available for authorized historical viewing, execution/update actions are disabled, and queued reminders are cancelled or suppressed with a current-state check before delivery. Record closure/reopening events and actors. No application implementation or tests are complete.

Reopening authority, whether pending tasks resume unchanged, and reminder scheduling after reopening remain to be clarified. Do not create missed-update obligations for the period the project was closed.

Only the business owner may reopen a closed project. Reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed project reopening authority — 2026-10-10

Source: confirmed user answer, "only me". Only the business owner may reopen a closed project. The project manager may close a project under the existing rule but cannot reopen it.

Proposed implementation/UI: expose the reopen action only to the authorized business owner and enforce that permission on the server. Preserve the closed interval, reopening actor/time and existing task/milestone history. Do not generate missing-update obligations for the closed interval. No application implementation or permission tests have been performed.

Whether all outstanding tasks resume unchanged, and when scheduled reminders restart after reopening, remain to be clarified.

Reopening resumes the last closing stage and recorded work state. English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed reopening resumption — 2026-10-10

Source: confirmed user answer, "reopen on last closing stage". When the business owner reopens a project, resume from the stage and recorded work state at its most recent closure, rather than restarting the project.

Preserve completed and pending task/milestone states, assignments, dates, evidence and history. Reopening does not automatically reset progress, reassign work or shift approved dates. Any later task-date or scope changes follow their separately confirmed approval rules. Only the business owner may reopen.

Proposed implementation/UI: retain the pre-closure execution stage independently of closed status and restore it on reopening. Record reopening actor/time and resume open-project update availability; do not create missing-update obligations for the closed interval. Exact reminder restart handling remains open. No application implementation or tests are complete.

English-only screens and comments in any language are confirmed. Email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed phase-one language policy — 2026-10-10

Source: confirmed user answer. All screens use English only. Comments may be written in any language.

Use English navigation, labels, instructions, validation messages and system notifications. Preserve multilingual comments as entered using Unicode-capable storage, rendering and exports; do not require English-only comments or silently translate them. Automatic translation and voice input are not approved by this answer. Existing comment/conversation access controls apply regardless of language.

Proposed implementation/UI: English interface with Unicode text entry/display and suitable font fallback for multilingual comments. No application implementation or language tests are complete.

Every login uses an email OTP. Internet generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed email-OTP login — 2026-10-10

Source: confirmed user answer. Every login requires a one-time code sent to the user's email. Email/password login is not the selected method. This does not require an OTP for every page or action within an authenticated session; session lifetime remains to be decided.

Authentication email delivery is required for phase one despite operational reminders/notifications being in-app only. Keep authentication delivery separate from status-reminder channels. Email delivery provider, code expiry, retry limits, resend behavior, session duration and recovery procedures remain implementation/operating decisions.

Proposed implementation/UI: enter registered email, request OTP, enter and verify a single-use code, then access authorized project records. Protect codes, prevent reuse, bound verification attempts and resend requests, and avoid exposing account existence. Never log raw codes or place them in update URLs. No authentication implementation or tests have been performed.

Internet reliability is confirmed as generally reliable with very rare interruptions. Next ask essential ERP/accounting/Excel integrations for phase one.
## Confirmed connectivity assumption — 2026-10-10

Source: confirmed user answer. Internet is generally reliable across the discussed work locations; interruptions are very rare. This is a user-reported planning assumption, not a measured uptime guarantee.

Plan phase one around an online web workflow. No full offline editing or synchronization requirement is established by this answer. Proposed handling of rare interruptions: clearly show failed or pending submission, preserve unsent form text where practical, allow retry, and avoid duplicate saves or falsely displaying an unsaved update as submitted. This is a design recommendation awaiting implementation.

Phase one uses direct entry; no ERP/accounting/Excel connection required. Photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed phase-one direct entry — 2026-10-10

Source: confirmed user answer. Enter projects, tasks and operational purchase references directly into the web app. No existing ERP, accounting-system or Excel connection is required for phase one. This does not approve accounting, inventory valuation or ERP-replacement functionality; purchase records remain operational references under the existing scope.

Proposed implementation/UI: authorized direct-entry forms with validation and audit history; core execution must not depend on external-system synchronization. Optional imports/exports and later integrations remain separate scope decisions. No application implementation or tests are complete.

Q08 language, login, connectivity and essential-integration questions are answered. Photo/PDF-only attachments are confirmed. Fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed phase-one attachment types — 2026-10-10

Source: confirmed user answer, "photo and pdf only". Phase-one attachments are limited to photos and PDF documents. CAD files, videos and other file categories are outside this selected upload scope.

Proposed implementation/UI: photo/PDF upload and authorized viewing/download, with server-side type validation and existing private-file/project/assignment/audience permissions. An acceptance document remains optional and may be attached as a permitted PDF or photo. Specific photo formats, per-file size limits, upload volumes, retention and storage budget remain to be decided. No upload implementation or tests have been performed.

Expected attachment count is fewer than 50 photos/PDFs combined per project lifetime. Files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed attachment-volume estimate — 2026-10-10

Source: user answer to expected attachment count across one project's lifetime. Expect fewer than 50 photos and PDFs combined per project. This is a planning estimate, not an enforced upload quota. File sizes and retention remain open; count alone does not establish storage capacity or cost.

Files are expected to be under 1 MB each. One-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration.
## Confirmed attachment-size estimate — 2026-10-10

Source: user answer to the largest expected uploaded photo/PDF. Files are expected to be under 1 MB each, with fewer than 50 files combined per project lifetime. This implies approximately under 50 MB of original attachment payload per project, or under 1 GB across 20 projects, before copies, previews, backups and other records. These are planning estimates, not enforced upload or storage quotas.

A hard upload limit, precise MB unit and handling of larger files remain implementation decisions; do not reject larger uploads solely on the basis of an expected-size answer. Retention and backup/recovery policies remain open.

Initial maximum retention is one year, extendable later. The period starts when the project starts. Active-project retention extends automatically; next clarify extension duration.
## Confirmed initial retention duration — 2026-10-10

Source: user answer to closed-project record/attachment retention. Initial maximum retention is one year; the user may extend it later if required.

Confirmed user clarification: the one-year retention period starts when the project starts, not when it closes or when each file is uploaded. The distinction between project creation date and configured project start date remains to be specified if they differ. Expiry behavior (automatic deletion versus owner review/export), treatment of reopened projects, backups and audit records remain undecided. No deletion or retention job is authorized or implemented by this documentation change.

Proposed implementation/design: configurable retention duration so a later approved extension is possible; preserve the final agreed retention deadline and expiry policy in operating documentation.

Automatic extension for active projects is confirmed. Next clarify whether extension lasts until closure or adds another full year.
## Confirmed retention starting event — 2026-10-10

Source: confirmed user clarification. The initial one-year maximum retention period starts when the project starts. It is not a one-year period after closure and does not restart for each uploaded attachment.

Extension remains possible by later decision. Automatic deletion, active-project expiry handling, reopening effects and backup retention are not decided. Do not implement deletion based solely on this duration. The exact project-start field/date basis must be defined during design if creation and actual/planned start differ.

Automatic extension for active projects is confirmed. Next clarify whether extension lasts until closure or adds another full year.
## Confirmed automatic active-project retention extension — 2026-10-10

Source: confirmed user answer, "automatic extention", to retention when a project is still active after one year. Automatically extend retention for an active project rather than requiring business-owner approval. Do not expire or delete its records/attachments merely because the first year has elapsed while it remains active.

The baseline period is one year from project start. Extension duration/increments and retention after eventual closure remain to be clarified; do not infer a new full year or automatic deletion on closure. Reopening and backup retention details also remain open. No retention automation or deletion is implemented.

Next question: should automatic extension keep the records until the project closes, or add another full year each time?
## Maintenance

Update when an invariant, permission policy, operating convention, or stack-specific development rule changes. Reflect changes in PRD.MD, ARCHITECHTURE.MD, DESIGN.MD, TASKS.MD, and MEMORY.MD as applicable.

## Change log

| Date | Change |
| --- | --- |
| 2026-10-08 | Captured documentation maintenance, execution, visibility, supply, chat, reporting, and release rules from the report. |
| 2026-10-09 | Recorded confirmed multiple departmental users per external organization, with individual logins and independently scoped grants. |
| 2026-10-09 | Recorded expandable initial department configuration and separation of confirmed names from recommendations. |
| 2026-10-09 | Recorded the three selected additions and 10-department initial configuration with exact names. |

| 2026-10-10 | Recorded confirmed project creation/member management, task-assignment authority and mandatory three daily plus requested updates; advanced discovery to completion verification. |

| 2026-10-10 | Recorded physical completion confirmation by owner/project manager and purchase confirmation by purchase manager; left approval combination and purchase checkpoint open. |

| 2026-10-10 | Clarified that either owner or project manager may approve non-purchase completion after physical verification; advanced discovery to planned task date-change authority. |

| 2026-10-10 | Confirmed owner, project manager and purchase manager as task-date approver roles; independent versus joint approval remains open. |

| 2026-10-10 | Confirmed task-date changes require one initiator and a different approver among owner/project manager/purchase manager; prohibited self-approval and advanced discovery to customer delivery-date authority. |

| 2026-10-10 | Recorded business owner and purchase manager as customer delivery-date authority; exact approval workflow and customer agreement remain open. |

| 2026-10-10 | Corrected customer delivery-date authority: project manager initiates and business owner approves; superseded the withdrawn purchase-manager answer. Customer acceptance versus notification remains open. |

| 2026-10-10 | Confirmed mandatory customer notification and optional acceptance of revised delivery dates; work continues without customer approval and acceptance remains separately recorded. Next: scope-change authority. |

| 2026-10-10 | Confirmed reciprocal scope-change initiation/approval between owner and project manager, with project-manager notification for owner requests; customer scope approval remains open. |

| 2026-10-10 | Recorded scope-change requests and continued work without waiting for customer decision; seven-day requirement remains pending clarification. |

| 2026-10-10 | Clarified seven-day additional-scope limit covers acceptance/rejection, assignment of accepted scope and customer notification; period start and day basis remain open. |

| 2026-10-10 | Confirmed additional-scope handling limit is seven calendar days; request-receipt starting point remains pending confirmation. |

| 2026-10-10 | Confirmed seven-calendar-day scope handling period starts at receipt of the change request; advanced discovery to Q05 customer progress publication. |

| 2026-10-10 | Confirmed Q05 customer visibility of latest permitted progress on login without internal publication review; advanced discovery to three daily update times. |

| 2026-10-10 | Recorded 10:00/14:00/19:00 updates with ±1-hour windows, voluntary updates anytime and two missed-update reminders without work blocking; reminder timing remains open. |

| 2026-10-10 | Superseded two-reminder cap with recurring two-hour reminders/warnings during 09:00–19:30 and owner/project-manager highlights; submissions remain open and work continues. Evening window overlap requires clarification. |

| 2026-10-10 | Confirmed evening update window remains 18:00–20:00 while reminders stop at 19:30; advanced discovery to applicable working days. |

| 2026-10-10 | Confirmed Monday–Saturday scheduled reporting and always-open submission including Sundays; advanced discovery to reminder delivery channels. |

| 2026-10-10 | Confirmed web-only first version and later mobile phase after about 20–50 projects; recorded WhatsApp-link proposal and unapproved interim in-app/email recommendation. |

| 2026-10-10 | Confirmed in-app notifications for all phase-one participants; email not selected and WhatsApp deferred. Next clarify vendor/service-provider reporting cadence. |

| 2026-10-10 | Confirmed common scheduled reporting for internal, vendor and service-provider members; superseded separate vendor cadence proposal and left customer reporting for clarification. |

| 2026-10-10 | Confirmed no compulsory customer status updates and voluntary writing anytime; advanced discovery to Q07 project lifecycle endpoint. |

| 2026-10-10 | Confirmed phase-one lifecycle through installation and final acceptance at customer site; next clarify final-acceptance authority and criteria. |

| 2026-10-10 | Confirmed either business owner or project manager may close a project; customer final-acceptance evidence and punch-list policy remain open. |

| 2026-10-10 | Confirmed optional acceptance-document attachment without blocking project closure; next clarify open punch-list handling. |

| 2026-10-10 | Confirmed owner/project manager may close anytime with pending items, retaining truthful task/acceptance states; post-closure pending-task behavior remains open. |

| 2026-10-10 | Confirmed closed projects stop execution updates and reminders until reopened, preserving pending states/history; next clarify reopening authority. |

| 2026-10-10 | Confirmed only business owner may reopen closed projects; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration. |

| 2026-10-10 | Confirmed owner-led reopening resumes last closing stage with recorded work state/history preserved; advanced discovery to Q08 interface language. |

| 2026-10-10 | Confirmed English-only screens and comments in any language; advanced discovery to Q08 login method. |

| 2026-10-10 | Confirmed email OTP for every login, separate from in-app operational notifications; advanced discovery to connectivity. |

| 2026-10-10 | Recorded user-reported reliable internet with very rare interruptions; advanced discovery to essential phase-one integrations. |

| 2026-10-10 | Confirmed direct entry and no required ERP/accounting/Excel integration for phase one; advanced discovery to Q09 attachments. |

| 2026-10-10 | Confirmed phase-one attachments limited to photos and PDFs; advanced discovery to approximate project-lifetime attachment count. |

| 2026-10-10 | Recorded fewer than 50 attachments per project lifetime as a planning estimate; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration. |

| 2026-10-10 | Recorded expected files under 1 MB each and approximate attachment payload; advanced discovery to closed-project retention. |

| 2026-10-10 | Confirmed initial one-year maximum retention with possible later extension; next clarify whether the period starts at project closure. |

| 2026-10-10 | Confirmed one-year retention starts when the project starts; active-project extension and expiry behavior remain open. |

| 2026-10-10 | Confirmed automatic retention extension for projects still active after one year; extension duration and post-closure expiry remain open. |

| 2026-10-10 | User authorized pilot development and delegated remaining assumptions; local workflow prototype implemented and seven isolated logic checks passed. |

| 2026-10-10 | Implemented Node/SQLite shared web application, OTP adapter, scoped workflows, files and reminder jobs; tests written and runtime verification pending. |

| 2026-10-10 | Recorded verified shared application milestone: GitHub Actions syntax check and all 24 tests passed; actual email/browser/local deployment checks remain pending. |

| 2026-10-11 | Added project-specific member departments and audited owner correction editing; all 29 local tests passed and live local app restarted with existing data preserved. |

| 2026-10-11 | Added project PO number and cleared the explicitly authorized single test project; 30 tests passed and app restarted. |

| 2026-10-11 | Added project-specific vendor member item name with editing; 32 local tests passed and live app restarted. |

| 2026-10-11 | Required explicit assignment to added project members; 34 local tests passed and authorized test project reset completed. |

| 2026-10-11 | Prominent assignee selection and dialog scroll reset; 34 automated tests and 34 slow visible workflow checks passed, plus selector visibility regression. |
