---
description: Finalize and sign off the active AI Outsourcing Studio project
---
Run the ship sequence for the active project, following the AUTO-SHIP steps in
`$HOME/.claude/ai-outsourcing-studio/references/CLAUDE.md`:

1. As QA, confirm zero open or in_review bugs and that the full test suite is green. If any bug is
   still open, **stop and report it — do not ship.**
2. As PO, confirm final acceptance of every P0 story in `SPEC.md`.
3. As Ops, finalize `RUNBOOK.md`, ensure CI is green, and build the release artifact.
4. As CEO, write `REVIEWS/ceo-ship.md` with per-Win-Condition evidence, flip
   `.company/state.json` status to `SHIPPED`, and emit the release note.

Append a sync entry for each role as you go.
