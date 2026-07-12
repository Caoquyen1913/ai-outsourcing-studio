---
description: Print the AI Outsourcing Studio live board for the current project
---
Regenerate and show the company board. Run:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/update-board.mjs"
```
then print `.company/BOARD.md`. If there is no `.company/` in the current directory yet, say that no
project has been started here and suggest `/prompts:aos-idea "<pitch>"`.
