---
name: handoff
description: Use this skill to pass work from one role to the next in the company pipeline. Validates that the source artifact exists and has the required sections, then spawns the target role with a precise prompt pointing at the artifact. Use instead of ad-hoc Task spawns whenever you are completing your deliverable and the next role needs to pick it up.
---

# Handoff Protocol

Standard way to pass the baton from one role to the next. Keeps the pipeline deterministic and logged.

## When to use

At the end of your turn, after your Definition of Done checklist is green and your artifact is written. Examples:
- CEO → BA (BRIEF.md → SPEC.md)
- BA → CTO (SPEC.md → ARCH.md)
- CTO → DBA (ARCH.md → DATA-MODEL.md)
- CTO → Dev (TASKS.md → code)
- Dev → QA (deliverable code → TEST-PLAN execution)
- QA → CTO (test results → code review)
- Ops → CEO (RUNBOOK.md → final sign-off)

## Inputs

Caller must provide:
1. **from** — your role name.
2. **to** — target role name (must match a file in `.claude/agents/`).
3. **artifact** — path of the file the target must read first.
4. **project slug** — active project.
5. **ask** — one-sentence statement of what you want the target to produce.

## Protocol

### Step 1 — Validate the artifact
- Check the file exists. If not, STOP — you have not completed your Definition of Done.
- Check it contains all the required sections for its type (see `CLAUDE.md` ownership table).
- Check you have updated `.company/state.json` to mark your role's artifact as complete.

### Step 2 — Spawn the target
Use the Task tool with `subagent_type = <to>`. Prompt template:

> You are `<to>`. `<from>` has completed their deliverable and is handing off to you.
>
> **Active project:** `<slug>`
> **Upstream artifact:** `<artifact>` — read this first, completely.
> **Ask:** `<ask>`
>
> Before producing output, perform the **scope gate** (list the 3 most plausible misunderstandings and rule them out).
>
> Follow your system prompt in `.claude/agents/<to>.md` — in particular your Definition of Done checklist and the Debate Obligation at checkpoints.
>
> When you return, you MUST have:
> 1. Written your owned artifact(s).
> 2. Updated `.company/state.json` (your role's slot + artifacts map).
> 3. Invoked the `debate` skill if your artifact is at a mandatory checkpoint.
> 4. Completed your own handoff to the next role, OR returned a clear reason why handoff cannot proceed.

### Step 3 — Return
Return a one-line summary to your parent: `HANDOFF <from> → <to>: <artifact> — <ask>`.

## Anti-patterns

- Do NOT hand off without first running your own Definition of Done checklist.
- Do NOT hand off to a role that does not own the next artifact in the pipeline (see `CLAUDE.md` table).
- Do NOT bundle multiple unrelated asks into one handoff — split them.
- Do NOT skip the scope gate in the target's prompt.
