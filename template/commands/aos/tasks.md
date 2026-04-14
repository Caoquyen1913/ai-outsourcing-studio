---
name: aos:tasks
description: Show the task board and recent sync log
---
Show the live task board for the active project.

1. Read `.company/state.json`. If `active_project` is null, tell the user there's no active project and stop.
2. Run `node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" render <slug>` to refresh `TASKBOARD.md`.
3. Read and print `.company/projects/<slug>/TASKBOARD.md` verbatim.
4. If the user passed filter args ($ARGUMENTS), also run `node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" list <slug> $ARGUMENTS` and print the filtered list under a `## Filtered` heading.
5. Read the last 10 lines of `.company/projects/<slug>/SYNC.md` (if it exists) and print them under a `## Recent sync` heading.
6. Do nothing else — no analysis, no edits.
