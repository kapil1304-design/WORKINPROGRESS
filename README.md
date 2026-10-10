# WORKINPROGRESS

An experimental web application for coordinating automotive machine projects, internal teams, vendors and service providers, with customer progress visibility.

## Run the shared web application

The Node.js/SQLite application now provides separate OTP logins, persistent records and server-enforced workflow permissions. See [development and setup instructions](DEVELOPMENT.md). Real email delivery requires a configured provider; local testing uses a development mailbox.

## Original local prototype

Open [app/index.html](app/index.html) in a modern browser. No installation is required. Use the clearly labelled demo identity selector to explore workflows.

This version stores demonstration data in the browser. It has no real email OTP or secure shared backend. Use synthetic data only. See [prototype details](app/README.md) for implemented workflows and remaining work.

## Project documentation

- [Requirements](PRD.MD)
- [Architecture](ARCHITECHTURE.MD)
- [Rules](RULES.MD)
- [Design](DESIGN.MD)
- [Tasks](TASKS.MD)
- [Project memory](MEMORY.MD)

The latest active development baseline in those documents supersedes historical discovery handoffs. The original Word report is retained as the initial discussion record.
