# AI Outsourcing Studio

A Claude Code extension that turns a one-line idea into a working web application by simulating a full software outsourcing company — CEO, CTO, BA, Designer, Dev, DBA, Ops, QA/QC, and a Devil's Advocate critic. Each role is a Claude subagent with its own system prompt, tools, and role boundaries. The company runs autonomously: you pitch once, the roles debate and hand off work among themselves, and you come back to a shipped project.

Installs into your global `~/.claude/` directory so the `/aos:*` slash commands are available in any Claude Code session.

## Install

```bash
npx ai-outsourcing-studio install
```

That's it. Files land in:

```
~/.claude/
├── agents/aos-*.md                 # 9 role subagents
├── commands/aos/*.md               # /aos:idea, /aos:board, /aos:tasks, ...
├── skills/aos-*/SKILL.md           # debate, handoff, sync, deliverable-scaffold
├── ai-outsourcing-studio/          # scripts, references, seeds (the "library" folder)
│   ├── scripts/*.mjs               # task.mjs, update-board.mjs, log-chat.mjs
│   ├── references/                 # canonical CLAUDE.md, AGENTS.md, GEMINI.md
│   ├── templates/company-seed/     # seed for new .company/ directories
│   └── VERSION
├── aos-file-manifest.json          # manifest for clean uninstall
└── settings.json                   # merged with your existing hooks (non-destructive)
```

Your existing hooks, agents, skills, and other extensions are **not** touched — the installer merges into `settings.json` by appending tagged entries.

### Alternative installers

For users without `npx` / Node on the path (cloned repo, CI, etc.):

```bash
# macOS / Linux / WSL / Git Bash
curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.ps1 | iex
```

Both wrappers shell out to `npx ai-outsourcing-studio install` under the hood.

### Global install via npm

```bash
npm install -g ai-outsourcing-studio
ai-outsourcing-studio install
# or the short alias:
aos install
```

## Use

Open any folder in Claude Code (this is the project the studio will work on):

```bash
cd my-new-app
claude
```

Pitch the CEO:

```
/aos:idea "a tiny todo list web app with Google auth"
```

The CEO role starts in **autonomous mode**. It will ask at most 3 strategic vision questions — often zero — and then immediately hand off down the pipeline:

```
CEO → BA → Designer → CTO → DBA + Ops → Dev → QA → (bug loop) → Ops → CEO sign-off
```

**The CEO will not ask you about tech, stack, framework, database, hosting, libraries, UI, copy, deadlines, or budget.** Those are delegated. CTO picks the stack. Designer picks tokens, layout, and copy. DBA designs the schema. Ops writes the runbook. QA files every defect as a bug task and re-verifies fixes in a loop until zero bugs remain.

Watch progress at any time:

| Command | What it shows |
|---------|---------------|
| `/aos:board` | Live dashboard — roles, open tasks, recent sync, artifacts |
| `/aos:tasks` | Full task board + recent sync log |
| `/aos:standup` | One-line status from every role |
| `/aos:kickoff` | Re-trigger CEO discovery to revise scope mid-project |
| `/aos:ship` | Final Ops + QA + CEO sign-off (blocks if any open bugs) |

Per-project state lands in the folder where you ran the command:

```
my-new-app/
├── .company/              # BOARD.md, CHATLOG.md, state.json, per-project artifacts
│   └── projects/<slug>/   # BRIEF.md, SPEC.md, DESIGN.md, ARCH.md, TASKS.md, ...
└── deliverables/<slug>/   # the actual generated web app
```

Multiple projects in different folders each keep their own `.company/` — the global install only ships framework code.

## Core doctrines

Every role reads these on every turn. Full text is in `~/.claude/ai-outsourcing-studio/references/CLAUDE.md`.

- **Autonomy Doctrine** — The user pitched and walked out the door. They are a client, not a collaborator. CEO is the only role that may speak to the user, and only for 3 strategic vision questions at kickoff (ideally zero), a user-initiated `/aos:kickoff` revision, or the final release note. Every other role runs silent.
- **Delegation Matrix** — CEO decides vision + scope + win conditions. CTO decides tech stack + architecture. Designer decides UI + tokens + copy. DBA decides data model. Ops decides CI + deploy. Dev decides implementation details. QA decides test strategy. No one asks upward for permission to do their own job.
- **Win Condition Doctrine** — Every project is treated as company-survival. CEO writes 3–5 observable, stricter-than-AC win conditions in BRIEF.md. Ship-time sign-off requires documented evidence each is met.
- **Bug Loop** — Every defect QA finds becomes a `B-NNN` task with an owner, file:line refs, and a re-verify loop. No wave is approved with any open or in_review bug. Dev reproduces before fixing, addresses root cause not symptom, and marks in_review; QA re-runs the exact failing test plus full regression, loop until zero.
- **Sync Loop** — Every role appends a one-line status entry at the end of every turn (`task.mjs sync ...`) and reads the tail at the start, so no role acts on a stale picture.
- **Responsibility & Accountability** — Own outcomes, not tasks. Quality > speed. Silence is complicity. Push back hard via the `aos-debate` skill, then commit fully.
- **Mandatory debates** — At post-SPEC, post-DESIGN, post-ARCH, post-DATA-MODEL, and after each Dev wave, the owning role spawns the Devil's Advocate via the `aos-debate` skill and writes the result to `REVIEWS/`.

## Update / uninstall

```bash
# Update to the newest version (overwrites framework files, leaves your projects alone)
npx ai-outsourcing-studio update

# Remove everything this installer put in ~/.claude/ (manifest-driven)
npx ai-outsourcing-studio uninstall
```

Uninstall reads `~/.claude/aos-file-manifest.json` and removes exactly the files it installed, plus its tagged entries in `settings.json`. Your other hooks, agents, skills, and extensions are untouched.

## Multi-tool notes

The studio ships canonical `AGENTS.md`, `GEMINI.md`, and a Cursor rule in `~/.claude/ai-outsourcing-studio/references/`. If you want to use the same project with another agentic tool (Antigravity, Gemini CLI, Cursor), copy the relevant file to your project root manually — e.g. `cp ~/.claude/ai-outsourcing-studio/references/AGENTS.md .` — so that tool picks it up. Native `/aos:*` slash commands and subagents are Claude Code only; other tools drive the pipeline by loading role prompts from `~/.claude/agents/aos-*.md` via file includes.

## Requirements

- Node.js ≥ 18 (for the installer and the studio's scripts)
- [Claude Code](https://claude.com/claude-code) installed and authenticated

## Local development

```bash
git clone <this repo>
cd ai-outsourcing-studio

# Test-install into a sandbox (does NOT touch real ~/.claude/)
AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs install
find .tmp-home/.claude -type f

# Test uninstall
AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs uninstall
```

`AOS_CLAUDE_HOME` is an escape hatch for testing — do not set it in normal use.

## License

MIT
