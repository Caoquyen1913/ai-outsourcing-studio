<div align="center">

<img src="https://raw.githubusercontent.com/Caoquyen1913/ai-outsourcing-studio/main/assets/banner.svg" alt="AI Outsourcing Studio" width="720">

<h1>AI Outsourcing Studio</h1>

<p><strong>Pitch a one-line idea. A full AI software company designs, builds, tests, and ships it — autonomously.</strong></p>

<p>A <a href="https://claude.com/claude-code">Claude Code</a> extension that installs a simulated software outsourcing company into your global <code>~/.claude/</code>. CEO, CTO, BA/PO, Designer, Dev, DBA, Ops, QA, and a Devil's Advocate — each a Claude subagent with its own prompt, tools, and role boundaries — debate, hand off work, and build a working web app while you watch.</p>

<p>
  <a href="https://www.npmjs.com/package/ai-outsourcing-studio"><img src="https://img.shields.io/npm/v/ai-outsourcing-studio?color=4F46E5&label=npm&logo=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ai-outsourcing-studio"><img src="https://img.shields.io/npm/dm/ai-outsourcing-studio?color=4F46E5" alt="npm downloads"></a>
  <a href="https://github.com/Caoquyen1913/ai-outsourcing-studio/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/ai-outsourcing-studio?color=4F46E5" alt="license"></a>
  <img src="https://img.shields.io/node/v/ai-outsourcing-studio?color=4F46E5&logo=node.js&logoColor=white" alt="node version">
  <a href="https://github.com/Caoquyen1913/ai-outsourcing-studio/pulls"><img src="https://img.shields.io/badge/PRs-welcome-4F46E5" alt="PRs welcome"></a>
</p>

<p>
  <a href="#install">Install</a> ·
  <a href="#use">Use</a> ·
  <a href="#the-roles">Roles</a> ·
  <a href="#core-doctrines">Doctrines</a> ·
  <a href="#contributing">Contributing</a>
</p>

</div>

---

## Why

Prompting a single AI agent to "build me an app" gives you a wall of code with no product thinking, no design contract, no test plan, and no one playing skeptic. **AI Outsourcing Studio** splits the work across nine specialist roles that behave like a real agency: someone owns scope, someone owns architecture, someone owns the schema, someone owns quality — and a Devil's Advocate is paid to poke holes before anything ships. You pitch once and stay out of the way.

## Install

```bash
npx ai-outsourcing-studio install
```

That's it. Files land in your global Claude Code directory:

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

> Your existing hooks, agents, skills, and other extensions are **not** touched — the installer merges into `settings.json` by appending tagged entries, and every file it writes is recorded in a manifest for a clean uninstall.

<details>
<summary><strong>Other install methods</strong> (global npm, curl, PowerShell)</summary>

**Global npm install**

```bash
npm install -g ai-outsourcing-studio
ai-outsourcing-studio install
# or the short alias:
aos install
```

**Shell one-liners** (for machines without `npx` on the path — they shell out to `npx` under the hood):

```bash
# macOS / Linux / WSL / Git Bash
curl -fsSL https://raw.githubusercontent.com/Caoquyen1913/ai-outsourcing-studio/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/Caoquyen1913/ai-outsourcing-studio/main/install.ps1 | iex
```

</details>

## Use

Open the folder you want the studio to build in (this becomes the target project) and start Claude Code:

```bash
cd my-new-app
claude
```

Pitch the CEO:

```
/aos:idea "a tiny todo list web app with Google auth"
```

The CEO starts in **autonomous mode**. It asks at most 3 strategic vision questions — often zero — then hands off down the pipeline and doesn't bother you again until there's something to sign off:

```
CEO → BA → Designer → CTO → DBA + Ops → Dev → QA → (bug loop) → Ops → CEO sign-off
```

> **The CEO will not ask you about tech, stack, framework, database, hosting, libraries, UI, copy, deadlines, or budget.** Those are delegated. CTO picks the stack. Designer picks tokens, layout, and copy. DBA designs the schema. Ops writes the runbook. QA files every defect as a bug task and re-verifies fixes in a loop until zero bugs remain.

### Watch progress

| Command | What it shows |
|---------|---------------|
| `/aos:board` | Live dashboard — roles, open tasks, recent sync, artifacts |
| `/aos:tasks` | Full task board + recent sync log |
| `/aos:standup` | One-line status from every role |
| `/aos:kickoff` | Re-trigger CEO discovery to revise scope mid-project |
| `/aos:ship` | Final Ops + QA + CEO sign-off (blocks if any open bugs) |

### Where things land

```
my-new-app/
├── .company/              # BOARD.md, CHATLOG.md, state.json, per-project artifacts
│   └── projects/<slug>/   # BRIEF.md, SPEC.md, DESIGN.md, ARCH.md, TASKS.md, ...
└── deliverables/<slug>/   # the actual generated web app
```

Multiple projects in different folders each keep their own `.company/` — the global install only ships framework code.

## The roles

Nine subagents, each with a strict lane. No one asks upward for permission to do their own job.

| Role | Owns | Decides |
|------|------|---------|
| 🧭 **CEO** | Vision, scope, win conditions | The only role that talks to you |
| 📋 **BA / PO** | Requirements, backlog | User stories & acceptance criteria |
| 🎨 **Designer** | UI/UX | Design tokens, layout, copy |
| 🏗️ **CTO** | Architecture | Tech stack & system design |
| 🗄️ **DBA** | Data | Schema & migrations |
| ⚙️ **Ops** | Delivery | CI, deploy, runbook |
| 💻 **Dev** | Implementation | How the code is written |
| 🔍 **QA / QC** | Quality | Test strategy & the bug loop |
| 😈 **Devil's Advocate** | Dissent | Stress-tests every major decision |

## Core doctrines

Every role reads these on every turn. Full text ships in `~/.claude/ai-outsourcing-studio/references/CLAUDE.md`.

- **Autonomy Doctrine** — The user pitched and walked out the door. They are a client, not a collaborator. CEO is the only role that may speak to the user, and only for 3 strategic vision questions at kickoff (ideally zero), a user-initiated `/aos:kickoff` revision, or the final release note. Every other role runs silent.
- **Delegation Matrix** — CEO decides vision + scope + win conditions. CTO decides tech stack + architecture. Designer decides UI + tokens + copy. DBA decides data model. Ops decides CI + deploy. Dev decides implementation details. QA decides test strategy.
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

## Use with OpenAI Codex CLI

The studio integrates with [OpenAI Codex CLI](https://developers.openai.com/codex/cli) as a first-class second front-end. Install both at once:

```bash
npx ai-outsourcing-studio install --codex
```

This adds a Codex layer under `~/.codex/` on top of the shared company library in `~/.claude/`:

- A managed block is **merged non-destructively** into `~/.codex/AGENTS.md` (your existing global instructions are preserved — the block sits between `<!-- AOS:START -->` / `<!-- AOS:END -->` markers and is cleanly removed on uninstall).
- The studio **skills** are copied to `~/.codex/skills/aos-*/` in Codex's native `SKILL.md` format. This includes both the protocol skills (`aos-sync`, `aos-handoff`, `aos-debate`, `aos-deliverable-scaffold`) and the **entry-point skills** you launch from the `/` menu: `aos-idea` (give it a one-line pitch), `aos-board`, `aos-tasks`, `aos-standup`, `aos-kickoff`, `aos-ship`.
- The same entry points are **also** installed as legacy custom prompts under `~/.codex/prompts/` (`/prompts:aos-idea "<pitch>"`, `/prompts:aos-board`, …) for older Codex builds that still index the prompts directory. Current Codex builds surface skills in the `/` menu but no longer list `~/.codex/prompts/`, so prefer the `aos-*` skills.

Because Codex has no subagents, it runs the same pipeline **sequentially in one session** — adopting each role's prompt from `~/.claude/agents/aos-*.md` in turn and emulating handoffs and Devil's Advocate debates itself. Once installed, `npx ai-outsourcing-studio update` keeps the Codex layer in sync automatically; `uninstall` removes it and restores your `AGENTS.md`.

## Other tools

The studio also ships canonical `AGENTS.md`, `GEMINI.md`, and a Cursor rule in `~/.claude/ai-outsourcing-studio/references/`. To drive the same project from another agentic tool (Antigravity, Gemini CLI, Cursor), copy the relevant file to your project root — e.g. `cp ~/.claude/ai-outsourcing-studio/references/AGENTS.md .`. Native `/aos:*` slash commands and subagents are Claude Code only; other tools drive the pipeline by loading role prompts from `~/.claude/agents/aos-*.md`.

## Requirements

- **Node.js ≥ 18** — for the installer and the studio's scripts
- **[Claude Code](https://claude.com/claude-code)** — installed and authenticated

## Local development

```bash
git clone https://github.com/Caoquyen1913/ai-outsourcing-studio.git
cd ai-outsourcing-studio

# Test-install into a sandbox (does NOT touch your real ~/.claude/)
AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs install
find .tmp-home/.claude -type f

# Test uninstall
AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs uninstall
```

`AOS_CLAUDE_HOME` is an escape hatch for testing — do not set it in normal use.

## Contributing

Issues and PRs are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, and please open an issue to discuss anything larger than a bug fix before sending a big PR.

## License

[MIT](LICENSE) © caoquyen1913 and contributors
