---
name: aos-sync
description: Use this skill at the END OF EVERY TURN you take as a role — and at the START of every turn to read peer status. This is the company's daily standup mechanism. Appends a one-line status entry to SYNC.md and reads the recent tail so you stay aware of what other roles are doing. Skipping sync is a Definition-of-Done violation.
---

# Sync Protocol

The studio runs on shared situational awareness. Every role syncs at the end of every turn so every other role knows what just happened, what's next, and what's blocked. Every role reads the sync tail at the start of every turn so it doesn't act on a stale picture of the world.

## When to use

- **At the START of every turn**, BEFORE producing any output: read the last ~10 entries of `.company/projects/<slug>/SYNC.md` and the open-task list from `TASKBOARD.md`. Mention any peer activity that affects your work.
- **At the END of every turn**, BEFORE returning to your parent: append a one-line sync entry. This is a hard Definition-of-Done item — no role returns without syncing.

## Inputs

1. **slug** — active project slug (from `.company/state.json.active_project`).
2. **role** — your role name (ceo, cto, ba, designer, dev, dba, ops, qa, devils-advocate).
3. **status** — one short sentence: what you just shipped or learned.
4. **done** — comma-separated task ids you completed this turn (e.g. `T-007,B-002`). Use `-` if none.
5. **next** — comma-separated task ids you're handing on or about to start. Use `-` if none.
6. **blockers** — short text describing what's blocking the project (yours or someone else's). Use `none` if clean.

## Protocol

### Start of turn — situational awareness

Run:
```
cat .company/projects/<slug>/SYNC.md | tail -n 12
```
and:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" list <slug> --status open
```

If anything in those outputs affects your assignment — a peer raised a bug that touches your file, a blocker on a task you depend on, a decision that changes your inputs — call it out in your first sentence and adapt your plan accordingly. Do NOT silently proceed on a stale picture.

### End of turn — append a sync entry

Run:
```
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" sync <slug> \
  --role <role> \
  --status "<one-sentence what you just did>" \
  --done "<task ids>" \
  --next "<task ids>" \
  --blockers "<text or 'none'>"
```

Then verify the entry landed with `tail -n 1 .company/projects/<slug>/SYNC.md`.

## Anti-patterns

- Do NOT batch multiple turns into one sync entry. One turn = one entry.
- Do NOT write generic statuses like "working on stuff". Name the artifact, the task id, or the file.
- Do NOT skip the start-of-turn read. Acting on stale state is the failure mode this skill exists to prevent.
- Do NOT mark `blockers: none` if there are real blockers. Surface them — that's how the company unblocks itself.
- Do NOT use sync as a substitute for handoff or debate — it complements them, not replaces them.
