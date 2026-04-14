---
name: aos:kickoff
description: Re-trigger CEO discovery on the active project
---
Re-open CEO discovery — useful when scope has drifted or the user wants to add/remove features mid-project.

1. Read `.company/state.json`. If `active_project` is null, tell the user to run `/aos:idea` first and stop.
2. Spawn the CEO subagent with prompt:
   > Kickoff re-run on active project `<slug>`. Read BRIEF.md and the latest state. Ask the user up to 5 clarifying questions to re-validate or update scope. Then decide whether to:
   > (a) keep BRIEF.md as-is,
   > (b) update BRIEF.md (version it by appending a `## Revision <n>` section — do not rewrite history), and in that case re-handoff to PO for SPEC update, or
   > (c) abandon the project (requires explicit user confirmation).
3. Return the CEO's summary to the user.
