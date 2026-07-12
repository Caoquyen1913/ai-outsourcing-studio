---
name: aos-standup
description: Run a company-wide standup — one-line status from every AI Outsourcing Studio role (CEO, PO, Designer, CTO, DBA, Ops, Dev, QA). Use when the user wants a standup or a per-role status roundup.
---

# AI Outsourcing Studio — Standup

Produce a company standup for the active project. Read `.company/state.json` and the tail of
`.company/projects/<slug>/SYNC.md`, then print one concise status line per role — CEO, PO, Designer,
CTO, DBA, Ops, Dev, QA — covering what each last did, what is next, and any blocker. Do not start new
work.
