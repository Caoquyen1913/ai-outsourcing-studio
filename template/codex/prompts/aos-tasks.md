---
description: Show the AI Outsourcing Studio task board and recent sync log
---
Read the active project slug from `.company/state.json` (`active_project`). Then render and print the
task board:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" render <slug>
```
Show `.company/projects/<slug>/TASKBOARD.md`, followed by the last ~10 lines of
`.company/projects/<slug>/SYNC.md`. Do not start new work — this is a read-only status view.
