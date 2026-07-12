---
name: aos-board
description: Print the AI Outsourcing Studio live company board for the current project. Use when the user wants to see the studio board, project status overview, or company dashboard.
---

# AI Outsourcing Studio — Board

Regenerate and show the company board. Run:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/update-board.mjs"
```
then print `.company/BOARD.md`. If there is no `.company/` in the current directory yet, say that no
project has been started here and suggest the `aos-idea` skill with a one-line pitch.
