---
description: Submit a new product idea to the CEO of the outsourcing studio
argument-hint: "<one-line pitch>"
---

A new idea has just arrived from the user. The raw pitch is:

> $ARGUMENTS

Your job as the Reception Desk:

1. Append the pitch to `.company/inbox.md` under a new `## Pitch (<ISO timestamp>)` heading. Do NOT clear the file — the CEO will read it.
2. Check `.company/state.json`. If `active_project` is not null, ask the user whether they want to:
   - queue this idea until the active project ships (append to inbox, do nothing else), OR
   - abandon the active project in favor of this one (requires explicit "yes, abandon <slug>"), OR
   - run both in parallel (not currently supported — inform the user).
3. If no active project, spawn the CEO subagent via the Task tool with prompt:
   > A new pitch is in `.company/inbox.md`. Read it, run your Phase 1–7 workflow from `.claude/agents/ceo.md`, and hand off to BA when BRIEF.md is ready.
4. Return a short summary to the user: the pitch was received, CEO is taking over, they'll see discovery questions shortly, and they can check `/board` anytime.
