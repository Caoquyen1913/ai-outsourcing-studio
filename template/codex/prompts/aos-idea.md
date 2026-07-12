---
description: Pitch a product idea to the AI Outsourcing Studio and run the full company pipeline
argument-hint: "<one-line product pitch>"
---
First read `$HOME/.claude/ai-outsourcing-studio/references/CLAUDE.md` in full, then run the **AI Outsourcing Studio** on this pitch:

$ARGUMENTS

Follow the Codex single-agent emulation described in your global AGENTS.md: drive the pipeline
CEO → PO → Designer → CTO → DBA + Ops → Dev (wave by wave) → QA (bug loop) → Ops → CEO sign-off,
sequentially, adopting each role's system prompt from `$HOME/.claude/agents/aos-<role>.md` in turn.

Honor the Autonomy Doctrine — do NOT ask the user about tech, stack, framework, database, hosting,
UI, copy, or deadlines; those are delegated decisions. Record the pitch in `.company/inbox.md`,
create/keep state under `.company/`, and file tasks + sync entries via
`node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs"`.

Begin as the CEO: write `BRIEF.md` with a `## Win conditions` section, then proceed down the pipeline.
Run the mandatory Devil's Advocate debate at each checkpoint (post-SPEC, post-DESIGN, post-ARCH,
post-DATA-MODEL, and after every Dev wave).
