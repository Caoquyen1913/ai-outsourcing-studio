# AI Outsourcing Studio

A Claude Code project that turns a one-line idea into a working web app by simulating a full software outsourcing company — CEO, CTO, BA, Dev, DBA, Ops, QA — each as a Claude subagent with its own system prompt, tools, and role boundaries.

## Quickstart

1. Open this folder in Claude Code.
2. On session start, the live **Board** prints automatically so you can see the company's current state.
3. Pitch an idea:
   ```
   /aos:idea "a tiny todo list web app with Google auth"
   ```
4. The CEO will ask you a handful of discovery questions. Answer them.
5. Watch the company work. Check the board anytime:
   ```
   /board
   ```
6. When the CEO signs off, your generated app is in `deliverables/<project-slug>/`.

## How it works

- Each role is a subagent in `.claude/agents/`.
- Agents communicate by writing artifacts to `.company/projects/<slug>/` (SPEC, ARCH, TASKS, etc.) and by spawning each other via the Task tool.
- A `debate` skill lets any role spawn the Devil's Advocate for structured critique — mandatory at every major checkpoint.
- A hook regenerates `.company/BOARD.md` after every write, and appends agent-to-agent spawns to `.company/CHATLOG.md`.

Read `CLAUDE.md` for the full charter, role map, and anti-mistake guardrails.

## Slash commands

| Command    | Purpose |
|------------|---------|
| `/aos:idea`    | Submit a new idea to the CEO |
| `/aos:board`   | Print the live company board |
| `/aos:standup` | Ask every role for a one-line status |
| `/aos:kickoff` | Re-run CEO discovery on the active project |
| `/aos:ship`    | Trigger final Ops + QA + CEO sign-off |

## Layout

```
.claude/agents/     8 role definitions (system prompts)
.claude/skills/     debate, handoff, deliverable-scaffold
.claude/commands/   slash commands
.company/           live state: BOARD.md, CHATLOG.md, state.json, projects/
deliverables/       generated web apps land here
scripts/            hook handlers (update-board, log-chat)
```
