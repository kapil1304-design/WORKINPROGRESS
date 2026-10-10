# WorkInProgress — Tasks and development backlog

Last updated: 2026-10-10
Status: Pilot development in progress; local workflow prototype implemented, secure shared pilot pending.
Source: [Complete project report](WorkInProgress_Complete_Project_Document.doc), especially §§8, 13–14 and Added Input.

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

## Status and scope rules

Use Not started, In progress, Blocked, and Done. Done requires actual output and applicable validation evidence; planned features and written test cases do not count as implemented or passed. Record blockers with a condition and next action. Assign task owners when staffing is agreed; no delivery dates are assumed.

The user has authorized reading the report and creating/maintaining the six documents. The application backlog below is derived from the report for planning. Pilot scope, implementation decisions, budget/team, and rollout approvals remain open. P1/P2/P3 are proposed priorities, not approved delivery promises.

## Documentation tasks

| ID | Task | Status | Evidence / next action |
| --- | --- | --- | --- |
| DOC01 | Read report v1.0 and Added Input | Done | Read Word text, including configurable departments/roles and scoped chat. |
| DOC02 | Create the six requested project documents | Done | PRD.MD, ARCHITECHTURE.MD, RULES.MD, DESIGN.MD, TASKS.MD, MEMORY.MD. |
| DOC03 | Add persistent project documentation instructions | Done | AGENTS.md defines startup reading, update triggers, and handoff review. |
| DOC04 | Validate files, links, feature/test coverage, and scope status | Done | Checked all seven nonempty documents, dates, local links, R01–R12, F01–F36, and AT01–AT30. Reviewed proposed/confirmed scope labels. |
| DOC05 | Assess and document cloud hosting recommendation | Done | ARCHITECHTURE.MD records database/file/RAM separation and planning considerations; MEMORY.MD records tentative preference with provider choice still open. |
| DOC06 | Prepare pre-development business questionnaire | Done | Q01–Q10 below map the remaining discovery inputs and decisions; recommendations are pending user answers. |

## Pre-development questionnaire — 2026-10-09

The questions below consolidate discovery; existing requirements such as vendor isolation, department-level customer identity and preserved commitments remain in force. Recommendations are proposals, not accepted answers. Users may answer in numbered form and accept or replace each recommendation. Technical implementation choices can follow the business answers.

| ID | Question / inputs | Recommended starting point or purpose | Decision / task links |
| --- | --- | --- | --- |
| Q01 | Is this initially only for your company, or intended for other companies to subscribe? | Start with own-company operations; commercial tenancy affects architecture. | D16, T002, T004 |
| Q02 | Should the first release cover a complete pilot project with internal work, suppliers/services, customer visibility, configurable roles and project chat? Which features are essential on day one? | Phone-friendly web pilot using the existing core workflows, then expand based on usage; confirm boundaries rather than treating all proposals as approved. | D18, T002, T003 |
| Q03 | Roughly how many concurrent projects, internal users, vendor users and customer users are expected initially and within a year? | Estimate workload before choosing cloud capacity; distinguish registered users from simultaneous use where known. | D19, T001, T004 |
| Q04 | What departments exist, and which role assigns work, verifies completion, changes the project plan, and approves official customer date/scope changes? | One accountable owner per project; department-level verification; explicit authorized date/scope decisions. | D01, D05, D07–D09, T001, T002 |
| Q05 | Should permitted customer status appear live, or wait for internal review? | Live structured status; reviewed narrative and explicitly shared files, retaining customer-safe identities. | D04, D06, T002, T021 |
| Q06 | What are working days, daily update cutoff, missed-update escalation recipients, and required reminder channels? | Configurable project calendar/cutoff; daily active-work updates and scheduled standard-product confirmations; in-app first, external channels as agreed. | D02, D03, D10, T002, T018 |
| Q07 | Describe one typical machine project: stages, rough task count, vendor/service steps, customer approvals, and whether scope ends at dispatch or installation/final acceptance. | Use that example to validate the plan, data model and first pilot. | D12, D19, T001, T003 |
| Q08 | Which languages and login method are needed? Is internet reliable at all work locations? Is any existing ERP/Excel/messaging integration essential in the first release? | Simple English and email invitations as proposals; responsive phone/desktop UI; local drafts for brief interruptions; explicit decision for essential integrations. | D10, D11, D17, T002–T004 |
| Q09 | What files will users upload, approximately how much per day/project, how long must records/files be retained, and are there customer requirements for hosting location? | Size private file storage separately from records and RAM; determine retention/region/recovery needs before production. | D13, D14, D19, T001, T004 |
| Q10 | What recurring cloud/notification budget and desired pilot date should guide the plan? Who will validate the pilot with you? | Estimate build/operation after scope and workload are known; a requested date is not yet an agreed delivery commitment. | D15, T002, T004, T026 |

Work can proceed in stages: Q01–Q07 establish the core pilot shape; Q08–Q10 guide implementation/integration and hosting planning. Provider purchase, external-user rollout and production launch also require resolved operating/recovery details from the existing decision register.

## Discovery answers

Ask one question at a time in this conversation, as requested by the user. Record each answer before proceeding and preserve unresolved detail rather than treating an entire grouped question as answered.

| Question | Status | User answer / remaining detail |
| --- | --- | --- |
| Q01 | Answered, 2026-10-09 | Initial implementation in own company to test all capabilities, flow and handling and refine the platform. About 20 projects. Discuss any offering to other companies later. D16 resolved for initial phase; exact first-version feature placement remains open. |
| Q03 | Partially answered, 2026-10-09 | Approximately 20 potentially concurrent projects; maximum 10 internal staff, 15 vendor organizations and 5 customer organizations. Multiple departmental people per external organization may need separate logins. Exact user counts per organization, simultaneous sessions and growth remain open. |
| Q02 | Participant scope answered, 2026-10-09; feature placement still open | User confirmed all participant types in a controlled pilot to test the complete coordination flow: internal staff, vendors, service providers and customers. This does not separately approve every proposed feature. Next continue Q03 one question at a time. |
| Q04 | Departments and creation/assignment authority answered; verification/approval pending, 2026-10-10 | Confirmed 10 departments: Mechanical, Design, Assembly, Procurement, Electrical Wiring, PLC Programming, Software Development, Installation, Stores and Material Control, Testing. More may be added. Remaining suggestions are optional. Business owner creates projects and adds members over time; business owner, project manager and purchase head assign tasks to other team members. Either owner or project manager physically verifies and approves non-purchase completion; purchase manager confirms purchase completion. plan-change and customer-commitment authority remain open. |
| Q05 | Answered, 2026-10-10 | Customers can view latest permitted recorded progress whenever they log in, without waiting for internal publication review. Existing confidentiality and reported/verified distinctions remain. |
| Q07 | Lifecycle and closure/reopening answered, 2026-10-10 | Track through installation and final acceptance at the customer site. Either owner or project manager may close the project. Acceptance document is optional, with an attachment option. Open punch-list closure policy remains open; closure is allowed anytime; closed projects stop updates and reminders until reopened; only the business owner may reopen; reopening resumes the last closing stage; English-only screens and multilingual comments confirmed; email OTP every login confirmed; connectivity is generally reliable with very rare interruptions; phase-one records are entered directly; photo/PDF-only attachments are confirmed; fewer than 50 attachments per project lifetime confirmed; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration. |
| Q08 | Answered, 2026-10-10 | All screens English only; comments may be written in any language. Every login requires OTP sent by email. Internet is generally reliable with very rare interruptions. Projects, tasks and purchase references are entered directly in the app; no ERP/accounting/Excel integration is required for phase one. Next ask Q09 attachment types. Authentication email is separate from in-app operational notifications. |
| Q09 | Attachment types answered, 2026-10-10 | Photos and PDFs only for phase one. Fewer than 50 photos/PDFs combined per project lifetime is a planning estimate, not a quota. Files expected under 1 MB each. Initial maximum retention is one year, extendable later; start event, expiry behavior and recovery details remain open; files expected under 1 MB each; one-year maximum retention confirmed, extendable later; the period starts when the project starts; active-project retention extends automatically; next clarify extension duration. |
| Q10 | Pending | No answers recorded yet. |
| Q06 | Partially answered, 2026-10-10 | All team members must update three times daily and whenever requested by other members during the day. Scheduled updates: 10:00, 14:00, 19:00, each ±1 hour; voluntary updates anytime; recurring reminders/warnings every two hours during 09:00–19:30, missing-update highlights to owner/project manager, and submission always open; work is never blocked. In-app notifications confirmed for everyone in phase one; recurring reminders every two hours during 09:00–19:30 Monday–Saturday. Timezone, first trigger/carryover, requested-response deadlines and external reporting cadence is confirmed for vendors/services; customers are exempt. Other reminder details remain open. |

## Proposed development sequence

Dependencies are task IDs. Parallel scheduling and staffing should be chosen later; the order below reflects prerequisite behavior, especially permission enforcement before external access.

| ID | Stage / work | Features | Depends on | Status | Completion evidence required |
| --- | --- | --- | --- | --- | --- |
| T001 | Discovery: select a real pilot project and collect plan/PO/service/approval/report examples | R01–R25 | — | In progress | Pilot project/organization counts, multi-user participation and 10 initial departments recorded. Exact external user load, Q04 authority, remaining answers and real pilot walkthrough pending. |
| T002 | Decide pilot scope, ownership model, visibility, update/verification rules, and added-feature placement | F01–F24, F35–F36 | T001 | In progress | Own-company initial phase and all participant types in controlled pilot confirmed; detailed feature placement, operating policies and other decisions remain open. |
| T003 | Design phone/desktop workflows and validate with representative roles | F16–F18, F35–F36 | T001, T002 | Not started | Wireframes and usability findings; each role finds and updates own work |
| T004 | Select stack, hosting, providers, workload/recovery targets, and estimate build/support effort | Architecture / operations | T002 | Not started | Evaluate cloud recommendation: project/user load, record/file growth, retention, connectivity, region, backup/export needs and recurring budget; record provider choice and estimates separately from commitments |
| T005 | Establish application foundation, migrations, environments, deployment and rollback setup | Foundation | T004 | Not started | Working development/staging setup and documented commands |
| T006 | Implement identity, invitations, organization/project membership and explicit capabilities | F01–F02 | T005 | Not started | Negative project/vendor tests AT01–AT02; revocation behavior |
| T007 | Add admin-defined departments/roles and project-specific multi-role assignments | F35 | T006 | Not started | AT26–AT27; designation rename does not grant capabilities |
| T008 | Implement private files, revisions/audiences, authorized downloads and audit events | F09, F22 | T006 | Not started | AT03; direct-download/revocation cases and audit evidence |
| T009 | Add project/module hierarchy and versioned templates | F03–F04 | T007, T008 | Not started | Template provenance and project isolation; no confidential copies |
| T010 | Implement allocation, acknowledgement, ownership, dates, and date history | F05–F06 | T009 | Not started | AT05, AT18; distinct baseline/plan/forecast/actual values |
| T011 | Implement finish-to-start dependencies, calendars, cycle checks, and affected successors | F07 | T010 | Not started | AT08–AT09; no automatic customer promise changes |
| T012 | Build My Work, daily updates, drafts, freshness, and concurrency/idempotency behavior | F08, F18, F22 | T010 | Not started | AT06–AT07, AT20, AT24; on-behalf source attribution |
| T013 | Build blockers, recovery actions, verification, returns, and reopening | F14, F19 | T012 | Not started | AT13–AT14; traceable resolver/owner/deadline and acceptance |
| T014 | Build standard supply acknowledgement, lead-time basis, promises, and readiness | F10 | T010, T012 | Not started | AT10; preserved original vendor promise |
| T015 | Build custom manufacturing stages, quantities, rework, and drawing acknowledgements | F11 | T014, T008 | Not started | Stage/quantity evidence and applicable revision tracking |
| T016 | Build service deliverables, pending inputs, updates, and acceptance | F12 | T013 | Not started | Demonstrated service workflow; effort separate from acceptance |
| T017 | Build partial shipment, receipt, inspection, and accepted-material readiness | F13 | T014, T015 | Not started | AT11–AT12; no double counting or readiness from dispatch |
| T018 | Implement reminders, digests, escalation, retry/deduplication, cancellation and failure visibility | F15 | T012–T017 | Not started | AT15–AT17, revoked-recipient cases and calendar handling |
| T019 | Build internal project/portfolio exception dashboards | F16 | T011–T018 | Not started | Counts link to supporting records; stale projects are flagged |
| T020 | Implement scope changes, exact-version approvals, and drawing revision impact | F20–F21 | T008, T013, T015 | Not started | AT19, AT21; change history and approved authority |
| T021 | Build customer-safe projections, preview, shared attachments, and customer action list | F17 | T019, T020 | Not started | AT01, AT03–AT04; separate live status/file sharing gates |
| T022 | Build authorized search, deterministic reports, snapshots, and exports | F23–F24 | T021 | Not started | AT03–AT04, AT22; as-of/source/calculation context and negative search cases |
| T023 | Build scoped project chat, replies, files, mentions, and unread notifications | F36 | T006–T008, T010, T018 | Not started | AT28, AT30 across messages, participants, suggestions, events and links |
| T024 | Add confirmed chat-to-action/blocker/forecast links and agreed chat conveniences | F36 | T013, T014, T023 | Not started | AT29; authorized confirmation, source link, no duplicate official changes |
| T025 | Validate privacy gates, recoverability, representative load, support and rollback | Release readiness | T008, T018, T021–T024 | Not started | AT01–AT24, AT26–AT30 as applicable; AT23 restore and recorded unresolved defects |
| T026 | Run real-project pilot, train participants, and collect baseline/outcome measures | Pilot | T025 | Not started | Working adoption, update quality, reporting-effort findings; critical defects resolved |
| T027 | Stabilize and roll out to additional projects in controlled groups | Expansion | T026 | Not started | Accepted operating ownership and evidence-driven release decisions |

T023–T024 are additions mapped from the appended chat requirements; their exact release placement must be decided under D18. External chat is subject to the same isolation gate as other external surfaces. If deferred, record that decision and adjust pilot acceptance scope explicitly.

## Proposed later work

| ID | Work | Features | Prerequisites | Status |
| --- | --- | --- | --- | --- |
| L001 | Resource overlap warnings | F25 | Valid effort/capacity data and observed pilot need | Not started |
| L002 | Advanced dependency forecasts, buffer calculations, and forecast validation | F26 | Reliable calendars/durations/dependencies; pilot evidence | Not started |
| L003 | Supplier reliability and recurring-delay analysis | F27 | Historical accepted-supply and blocker data | Not started |
| L004 | Voice-assisted draft entry | F28 | Approved provider/language/data handling; confirmation flow | Not started |
| L005 | AI draft summaries with authorized source links and deterministic fallback | F29 | Approved provider/data policy; AT25 and negative leakage tests | Not started |
| L006 | Email/messaging delivery and reply ingestion | F30 | Approved channels/provider; attribution, deduplication and confirmation | Not started |
| L007 | ERP/purchase/inventory integrations | F31 | Separate scope, contracts/interfaces and reconciliation rules | Not started |
| L008 | Commercial multi-company administration | F32 | Deferred by Q01 answer; revisit offering to other companies in a later discussion | Not started |
| L009 | Native apps and deeper offline conflict resolution | F33 | Pilot evidence and explicit platform/synchronization scope | Not started |
| L010 | Scheduling optimization | F34 | Trusted scheduling/capacity data and validated optimization objectives | Not started |

## Stage exit conditions

| Report stage | Exit condition |
| --- | --- |
| 0 Discovery | Owner walks a real project from allocation to acceptance and identifies roles/records. |
| 1 Product design | Each role can find work, submit an update, and understand the next action. |
| 2 Foundation | Test customer/vendor accounts cannot retrieve unrelated records or files. |
| 3 Internal execution | Work can be assigned, updated, blocked, recovered, submitted, returned, and accepted with history. |
| 4 Vendor execution | Vendor revises promises and submits partial delivery without unrelated visibility. |
| 5 Customer visibility | Customer sees relevant progress/delays without restricted identities or costs. |
| 6 Pilot | Daily coordination is reliable; critical access/data/status defects resolved; named operating owners accept responsibility. |
| 7 Expansion | Added capabilities address measured bottlenecks and controlled rollout is supported. |

## Validation record

| Date | Scope | Result | Evidence |
| --- | --- | --- | --- |
| 2026-10-08 | Source reading | Completed | Word report v1.0, sections 1–18 and Added Input read. |
| 2026-10-08 | Documentation structure/traceability | Passed | PowerShell check: seven nonempty documents with dates and valid local links; PRD contains R01–R12, F01–F36 and AT01–AT30. Scope labels reviewed against source. |
| — | Application AT01–AT30 | Not run | Application does not exist in this workspace; AT25 belongs to later AI work. |

## Current next actions and unresolved work

Documentation setup is complete. Initial phase remains own-company use across about 20 potentially concurrent projects; maximum 10 staff, 15 vendor organizations, 5 customer organizations; multiple external departmental user accounts. Q04 confirms 10 initial departments after adding Installation, Stores and Material Control, and Testing. Creation/member addition and assignment authority are answered; three daily and requested updates are mandatory for team members. Either owner or project manager may approve non-purchase completion after physical verification. Task-date approver roles are confirmed as owner, project manager and purchase manager. One of these three initiates a task-date change and a different one approves; no self-approval. The project manager initiates customer delivery-date changes and the business owner approves. Customer notification is mandatory, acceptance is optional and work continues without it. Scope-change authority is reciprocal owner/project-manager initiation and approval. Customer response does not block continued work; the seven-day limit covers scope decision, accepted-scope assignment and customer notification. The period starts on receipt of the change request. Q05 is answered: latest permitted progress is visible whenever customers log in. Evening window confirmed through 20:00 and reminders stop at 19:30. Working days confirmed as Monday–Saturday; submission always open. Next ask reminder delivery channels under Q06, then remaining discovery questions one at a time. Detailed feature placement, exact user/session counts, pilot inputs, hosting/stack/budget and delivery date remain open. Use answers for T002 policies and T004 planning; application implementation has not started.

## Confirmed project authority and update policy — 2026-10-10

Source and approval: confirmed user answer during discovery, 2026-10-10. These are requirements awaiting implementation.

- The business owner creates new projects and adds project members over time.
- The business owner, project manager, and purchase head must be able to assign tasks to other team members within the project. This does not establish completion-verification, plan-change, or customer-commitment approval authority.
- All team members must compulsorily update status three times a day and also update status when another member requests it at any time during the day.
- Exact update times/windows, working-day calendar, response time for requested updates, missed-update escalation, and whether this cadence also covers external vendor/service/customer participants remain to be clarified. Do not assume immediate responses or three updates per task rather than per member.
- Requests for status must respect existing project/assignment visibility; requesting an update does not grant access to restricted information.
- Either owner or project manager may physically verify and approve non-purchase completion; next ask who may approve planned task date changes. Continue one question at a time, recording each answer.
T001/T002 remain in progress: project creation/member addition and internal assignment authority are answered; the update frequency and on-demand obligation are confirmed. Either owner or project manager may approve non-purchase completion after physical verification; planned task date-change authority is the next question. Q06 timing/escalation and external-participant applicability remain open. No implementation or application test is complete.

## Confirmed completion verification — 2026-10-10

Source: user answer to the completion-verification question, 2026-10-10; confirmed requirement awaiting implementation.

- For non-purchase work, either the business owner or the project manager may approve completion after physically checking the work. One authorized approval is sufficient; both approvals are not required. Confirmed user clarification, 2026-10-10.
- For purchase work, the purchase manager must confirm completion. Do not assume the earlier purchase-head label and purchase-manager label refer to different people or the same role until clarified.
- A member's reported completion remains submitted for verification until the applicable authorized confirmation is recorded. Existing dispatch, receipt and accepted-quantity distinctions continue to apply; the purchase completion checkpoint remains to be specified.
- Next question: who may approve changes to planned task dates? Customer delivery commitment changes remain a separate decision.
## Planned task date authority — clarification pending, 2026-10-10

User initially answered 'combination', then clarified 'all 3': business owner, project manager and purchase manager. Approval method is confirmed: one of these three initiates the date-change request and a different one approves it; no self-approval. Next ask customer delivery commitment authority.

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

Update at actual work start, completion, blocker changes, priority changes, and validation outcomes. Keep evidence and next actions current. Update related feature/acceptance records in PRD.MD and the handoff in MEMORY.MD together.

## Change log

| Date | Change |
| --- | --- |
| 2026-10-08 | Created documentation task record and report-derived stage/backlog mapping, including Added Input and later-feature gates. |
| 2026-10-09 | Recorded cloud advisory work as DOC05 and expanded T004 hosting/capacity/cost selection evidence; application tasks remain not started. |
| 2026-10-09 | Added Q01–Q10 pre-development questionnaire and DOC06; started T001 discovery while pilot inputs and answers remain pending. |
| 2026-10-09 | Recorded Q01 answer and partial Q03 input, resolved initial company/product boundary, started T002 decisions, and set one-question-at-a-time discovery handoff. |
| 2026-10-09 | Recorded confirmed pilot participation for all roles; retained open feature placement and moved the next question to project concurrency under Q03. |
| 2026-10-09 | Recorded Q03 project concurrency answer; moved the next question to internal staff count while other user/load estimates remain open. |
| 2026-10-09 | Recorded participant maxima under Q03; next clarify vendor/customer organizations versus individual account counts. |
| 2026-10-09 | Recorded multiple departmental people per external organization needing separate logins; next ask company departments under Q04. |
| 2026-10-09 | Recorded Q04's seven confirmed departments, future expansion and pending suggestions; next confirm suggested additions before authority questions. |
| 2026-10-09 | Recorded three selected additions and 10-department list; advanced Q04 to internal task-allocation authority. |

| 2026-10-10 | Recorded confirmed project creation/member management, task-assignment authority and mandatory three daily plus requested updates; advanced discovery to completion verification. |

| 2026-10-10 | Recorded physical completion confirmation by owner/project manager and purchase confirmation by purchase manager; left approval combination and purchase checkpoint open. |

| 2026-10-10 | Clarified that either owner or project manager may approve non-purchase completion after physical verification; advanced discovery to planned task date-change authority. |

| 2026-10-10 | Recorded preference for a combination of task-date approvers; exact roles and approval method remain pending clarification. |

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

## Current implementation milestones

| ID | Work | Status | Evidence |
| --- | --- | --- | --- |
| DEV01 | Local pilot workflow prototype | Done | app/index.html, app/app.js, app/style.css; seven isolated logic checks passed; visual QA not performed. |
| DEV02 | Secure shared persistence and email OTP | Not started | Requires server runtime, database, server permission checks and email delivery configuration. |
| DEV03 | Complete attachments, supply workflows, customer acceptance and background reminders | Not started | Implement against confirmed rules with meaningful permission/workflow tests. |

| 2026-10-10 | User authorized pilot development and delegated remaining assumptions; local workflow prototype implemented and seven isolated logic checks passed. |

## GitHub publication — 2026-10-10

User explicitly requested pushing this project to their GitHub account with repository name WORKINPROGRESS. Default visibility: private. README.md and .gitignore prepared; Git and GitHub CLI installation started with user approval. Authentication, repository creation and push remain pending; do not describe remote publication as complete until verified.

## GitHub handoff — 2026-10-10

GitHub account authenticated: kapil1304-design. User created the existing WORKINPROGRESS repository and authorized pushing the project. Repository is public and was verified empty; preserve its existing visibility. Remote: https://github.com/kapil1304-design/WORKINPROGRESS. Git/GitHub CLI installed successfully. Initial main-branch commit/push is being prepared; verify remote commit before reporting success.

## Verified GitHub publication — 2026-10-10

Initial project push completed to https://github.com/kapil1304-design/WORKINPROGRESS on main. Commit: 7eb61dba557ae631a5441774efeb8d04e4c8ec0e. Verified local HEAD equals remote refs/heads/main using git ls-remote. Repository visibility remains public as created by the user. Included prototype source, seven maintained instruction/project documents, README, ignore rules and original report. Git diff --cached --check passed before commit. No app hosting/deployment performed.
