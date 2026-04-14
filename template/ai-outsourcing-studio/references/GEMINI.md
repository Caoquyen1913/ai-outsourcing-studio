# GEMINI.md

Entry point for the **Google Gemini CLI** in this repo.

This project is an **AI Outsourcing Studio** — a simulated software outsourcing company (CEO, CTO, PO, Designer, Dev, DBA, Ops, QA, Devil's Advocate) that turns a user's product idea into a shipped web application.

## Load the charter first

Before doing anything else, load the canonical operating charter:

```
@CLAUDE.md
@AGENTS.md
```

`CLAUDE.md` contains the full doctrines (Win Condition, Responsibility, Task System, Bug Loop, Sync Loop, role ownership table, anti-mistake guardrails). `AGENTS.md` contains a tool-agnostic summary and the pipeline diagram. Both are mandatory reading.

## Role prompts

Each role is a self-contained system prompt in `.claude/agents/*.md`. When the user asks you to "act as CEO" or "run as Designer", load that file with `@.claude/agents/<role>.md` and adopt it verbatim for the turn.

Roles: `ceo`, `cto`, `ba`, `designer`, `dev`, `dba`, `ops`, `qa`, `devils-advocate`.

## Slash commands (Gemini CLI)

Commands live in `.gemini/commands/*.toml`. Identical names to the Claude Code set:

| Command | What it does |
|---------|--------------|
| `/aos:idea "<pitch>"` | Submit a new idea — starts the pipeline with the CEO |
| `/aos:board` | Print the live company dashboard |
| `/aos:tasks` | Print the task board + recent sync log |
| `/aos:standup` | One-line status from every role |
| `/aos:kickoff` | Re-trigger CEO discovery on the active project |
| `/aos:ship` | Final Ops + QA + CEO sign-off |

## Sequential execution model (important)

Gemini CLI does not spawn parallel subagents the way Claude Code does. When running the pipeline in Gemini CLI:

1. Within a single turn, adopt the first role (e.g. CEO) by loading its `.claude/agents/<role>.md` prompt.
2. Produce that role's deliverable, update `.company/state.json`, run `node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" sync <slug> --role <role> ...`.
3. In the same turn (or next), adopt the next role in the pipeline and repeat.
4. At every checkpoint, invoke the `debate` skill by loading `$HOME/.claude/skills/aos-debate/SKILL.md` and running the protocol with yourself as both defender and challenger — but label the outputs distinctly in the `REVIEWS/debate-<n>.md` file. It is less adversarial than Claude Code's real subagent debates, but still creates an audit trail.
5. Never skip the sync entry when switching roles.

## Task system

All roles share a task board + sync log per project. CLI:

```bash
# Add a task
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" add <slug> --type <feature|bug|chore|review|decision|risk> \
  --title "..." --owner <role> --source <role> --refs "..."

# Update status
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" update <slug> <id> --status <open|in_progress|in_review|done|cancelled> --note "..."

# List / filter
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" list <slug> [--status open] [--owner aos-dev] [--type bug]

# Append a sync entry (MANDATORY at end of every turn)
node "$HOME/.claude/ai-outsourcing-studio/scripts/task.mjs" sync <slug> --role <r> --status "..." --done "T-1,T-2" --next "T-3" --blockers "..."
```

Every bug QA finds MUST become a `B-NNN` task. See the **Bug Loop** section in `$HOME/.claude/ai-outsourcing-studio/references/CLAUDE.md` for the full re-verify protocol.

## Quick start

```
@CLAUDE.md
@AGENTS.md
/aos:idea "<your product pitch>"
```

Then answer the CEO's discovery questions. Use `/aos:board` and `/aos:tasks` to monitor.
