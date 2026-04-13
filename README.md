# AI Outsourcing Studio

A Claude Code project scaffold that turns a one-line idea into a working web app by simulating a full software outsourcing company — CEO, CTO, BA, Designer, Dev, DBA, Ops, QA, and a Devil's Advocate critic — each as a Claude subagent with its own system prompt, tool allowlist, and role boundaries.

Inspired by the GSD (`/gsd:*`) workflow, but framed around an outsourcing studio: you pitch the CEO, the company debates, builds, tests, and ships.

## Install

Three installation methods. Pick whichever matches your stack.

### Option A — curl one-liner (no Node required)

Like [get-shit-done](https://github.com/gsd-build/get-shit-done/), download and run a single shell script. Works on macOS, Linux, WSL, and Git Bash on Windows.

```bash
# Install into the current directory
curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash

# Install into a specific directory
curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash -s -- ./my-startup

# Force-overwrite
curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash -s -- ./my-startup --force
```

Pin to a specific tag or commit:

```bash
AOS_REF=v0.1.0 bash <(curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh)
```

### Option B — PowerShell one-liner (Windows native)

```powershell
# Install into the current directory
irm https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.ps1 | iex

# Install into a specific directory (with optional Force)
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.ps1))) -Target ./my-startup -Force
```

Requires Windows 10+ (ships with `tar.exe`).

### Option C — npx (if you have Node ≥ 18)

```bash
# Current directory
npx ai-outsourcing-studio init

# Specific directory
npx ai-outsourcing-studio init ./my-startup

# Force overwrite
npx ai-outsourcing-studio init ./my-startup --force
```

Or install globally and use the `aios` short alias:

```bash
npm install -g ai-outsourcing-studio
aios init ./my-startup
```

> **Note for repo maintainer:** before publishing, replace `yourname/ai-outsourcing-studio` in this README and in the two `install.*` scripts with your actual GitHub `owner/repo` path.

## Works with

The studio is designed tool-agnostic. A single install drops config for four agentic tools so you can use whichever you prefer:

| Tool | Picks up from | Integration depth |
|------|---------------|-------------------|
| **Claude Code** (primary) | `CLAUDE.md` + `.claude/` (agents, skills, commands, settings, hooks) | **Native.** Parallel subagents, hooks, slash commands, auto-board, auto-chatlog. |
| **Google Antigravity IDE** | `AGENTS.md` at repo root | **Native.** Antigravity reads `AGENTS.md` automatically. Its parallel multi-agent runtime maps onto the pipeline where allowed (e.g. DBA + Ops after ARCH). |
| **Google Gemini CLI** | `GEMINI.md` + `.gemini/commands/*.toml` | **Commands + charter.** Same `/aos-*` slash commands, but executes the pipeline sequentially within a turn (no true parallel subagents). |
| **Cursor** | `.cursor/rules/ai-outsourcing-studio.mdc` + `AGENTS.md` | **Always-on rule.** No slash commands — use natural language in Composer ("act as CEO on this pitch…"). |

All four share the same shell-level primitives:
- `scripts/task.mjs` (tasks, bugs, sync log)
- `scripts/update-board.mjs` (board renderer)
- `.company/` (state, board, chatlog, inbox, per-project artifacts)
- `.claude/agents/` (role prompts — readable by any agentic tool)

This means: a `B-NNN` bug filed by QA in Claude Code is visible to a Cursor Composer turn or a Gemini CLI session in the same repo, because the task board is just files on disk.

## Use

```bash
cd my-startup
claude           # or: gemini, or open in Cursor / Antigravity
```

On session start, the live company **Board** prints automatically. Then:

```
/aos-idea "a tiny todo list web app with Google auth"
```

The CEO subagent takes over, asks 3–6 discovery questions, writes `BRIEF.md` with **Win Conditions**, and hands off down the pipeline:

```
CEO → BA → Designer → CTO → DBA + Ops → Dev → QA → (bug loop) → Ops → CEO sign-off
```

Watch progress at any time:

| Command | What it shows |
|---------|---------------|
| `/aos-board` | Live dashboard: roles, open tasks, recent sync, artifacts |
| `/aos-tasks` | Full task board + recent sync log |
| `/aos-standup` | One-line status from every role |
| `/aos-kickoff` | Re-trigger CEO discovery on the active project |
| `/aos-ship` | Final Ops + QA + CEO sign-off (blocks if any open bugs) |

Your generated app lands in `deliverables/<project-slug>/`.

## What you get

After `init`, your directory contains:

```
CLAUDE.md                  # company charter, role map, doctrines
.mcp.json                  # MCP server config (empty placeholder)
.gitignore
README.md                  # studio operator guide
.claude/
  agents/                  # 9 role subagents (CEO, CTO, BA, Designer, Dev, DBA, Ops, QA, Devil's Advocate)
  skills/                  # debate, handoff, deliverable-scaffold, sync
  commands/                # /aos-idea /aos-board /aos-tasks /aos-standup /aos-kickoff /aos-ship
  settings.json            # hooks for live board + chatlog + sync
.company/
  BOARD.md                 # live dashboard (hook-maintained)
  CHATLOG.md               # inter-agent spawn log
  state.json               # machine-readable state
  inbox.md                 # raw pitches drop here
  projects/<slug>/         # per-project artifacts (created on /aos-idea)
scripts/
  update-board.mjs         # board renderer (hook + manual)
  log-chat.mjs             # chatlog appender (hook)
  task.mjs                 # task system + sync log CLI
deliverables/              # generated web apps land here
```

## Doctrines baked in

- **Win Condition Doctrine** — every project is treated as company-survival. CEO writes 3–5 stricter-than-AC win conditions; ship-time sign-off requires evidence each is met.
- **Bug Loop** — every defect QA finds becomes a `B-NNN` task with an owner, refs, and a re-verify loop. No wave is approved with any open or in_review bug.
- **Sync Loop** — every role appends a one-line status entry at the end of every turn and reads the tail at the start, so no role acts on a stale picture.
- **Responsibility & Accountability** — own outcomes not tasks; quality > speed; silence is complicity; push back hard then commit.
- **Mandatory debates** — at every checkpoint (post-SPEC, post-DESIGN, post-ARCH, post-DATA-MODEL, after each Dev wave) the owning role spawns the Devil's Advocate via the `debate` skill and writes the result to `REVIEWS/`.

Read the installed `CLAUDE.md` for the full charter.

## Requirements

- Node.js ≥ 18 (for the CLI installer and the studio's hook scripts)
- [Claude Code](https://claude.com/claude-code) installed and authenticated

## Local development of this package

```bash
git clone <this repo>
cd ai-outsourcing-studio
node bin/cli.mjs init ../some-test-dir
```

Or `npm link` then `npx ai-outsourcing-studio init` from anywhere.

## License

MIT
