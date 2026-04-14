---
name: aos:standup
description: Run a company-wide standup across all roles
---
Run a morning standup across the company.

1. Read `.company/state.json`. If `active_project` is null, tell the user there's nothing to stand up on and stop.
2. For each role in [aos-ceo, aos-cto, aos-po, aos-designer, aos-dev, aos-dba, aos-ops, aos-qa], spawn the subagent via the Task tool with prompt:
   > Standup. In ONE SENTENCE, report:
   > (a) what you last shipped, (b) what you're waiting on, (c) any blocker.
   > Do not do any work. Do not update state.json. Do not spawn anyone. Just answer.
3. Collect the eight one-liners into a `## Standup (<timestamp>)` section and print it to the user.
4. Do not append to CHATLOG or modify state.
