---
name: aos-tasks
description: Show the AI Outsourcing Studio task board and recent sync log for the active project. Read-only status view — use when the user wants to see tasks, the task board, or recent role activity.
---

# AI Outsourcing Studio — Task Board

Read the active project slug from `.company/state.json` (`active_project`). Then render and print the
task board:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" render <slug>
```
Show `.company/projects/<slug>/TASKBOARD.md`, followed by the last ~10 lines of
`.company/projects/<slug>/SYNC.md`. Do not start new work — this is a read-only status view.
