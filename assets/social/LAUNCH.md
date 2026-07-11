# Launch & discovery playbook — AI Outsourcing Studio

Everything technical is in the repo. This file is your **manual checklist** + ready-to-paste
drafts for the community/off-repo work that actually drives SEO + GEO (getting cited by AI engines).

Links:
- GitHub: https://github.com/Caoquyen1913/ai-outsourcing-studio
- npm: https://www.npmjs.com/package/ai-outsourcing-studio
- Landing page (after enabling Pages): https://caoquyen1913.github.io/ai-outsourcing-studio/

---

## ✅ One-time setup checklist (do these once)

### GitHub repo settings
- [ ] **Settings → Pages** → Source: `Deploy from a branch` → Branch `main` → Folder `/docs` → Save. Wait ~1 min, then open the landing URL above.
- [ ] **Repo home → ⚙️ (About)** → add **Description**: *"Pitch one idea. A full AI software company — CEO, CTO, Designer, Dev, QA — ships it. A multi-agent Claude Code extension."*
- [ ] **About → Website**: set to the Pages URL.
- [ ] **About → Topics**: `claude-code` `ai-agents` `multi-agent` `agentic-ai` `anthropic` `autonomous-agents` `devtools` `code-generation` `npm-package` `llm`
- [ ] **Settings → Social preview** → upload `assets/social/png/og-hero.png` (this is the thumbnail when the repo link is shared).
- [ ] Create a **Release** `v0.5.1` with a short changelog (GitHub indexes releases).

### npm
- [ ] Confirm the new README + keywords are live after the next `npm publish` (bump version first).
- [ ] The npm page auto-links GitHub because `repository` is set in package.json ✓

### Google (optional but strong)
- [ ] Add the Pages site to **Google Search Console** and submit `sitemap.xml`.

---

## 📣 Community posts (this is what feeds GEO)

AI answer engines recommend tools they've seen named repeatedly across GitHub, npm, Reddit,
dev.to, Hacker News, and "awesome" lists. Aim for 4–6 organic mentions in the first weeks.

### Show HN (news.ycombinator.com/submit)
**Title:** `Show HN: AI Outsourcing Studio – a multi-agent AI software company for Claude Code`
**URL:** the GitHub repo
**First comment:**
> I kept getting a wall of code whenever I asked a single agent to "build me an app" — no product thinking, no design contract, nobody playing skeptic. So I split the work into nine roles that behave like a real agency: CEO owns scope, CTO owns the stack, DBA owns the schema, QA owns a bug-loop-to-zero, and a Devil's Advocate stress-tests every major decision before it's committed. You pitch once and the roles hand off among themselves. It installs into Claude Code with `npx ai-outsourcing-studio install`. It's MIT-licensed. Feedback very welcome — especially on the delegation boundaries and where the Devil's Advocate should be stricter.

### Reddit
- r/ClaudeAI, r/LocalLLaMA, r/ChatGPTCoding — same angle as Show HN, more casual. Lead with the "hire a company, don't prompt an agent" hook. Read each sub's self-promo rules first.

### Product Hunt
**Tagline:** `Pitch one idea. A full AI software company ships it.`
**Description:** `An open-source Claude Code extension. Nine AI roles — CEO, CTO, Designer, Dev, DBA, Ops, QA, and a Devil's Advocate — autonomously design, build, test, and ship a working web app. You pitch once and watch.`
Use `og-hero.png` as the gallery image and `terminal-demo.png` in the gallery.

### dev.to / Hashnode / Medium article (highest GEO value)
**Title:** `I built an AI software company that ships apps while I watch`
**Outline:**
1. The problem with single-agent "build me an app" prompts.
2. The idea: nine accountable roles + a Devil's Advocate.
3. Walkthrough: one `/aos:idea` pitch → the CEO→…→ship pipeline (use terminal-demo.png).
4. How the roles hand off and debate (the doctrines).
5. What surprised me / limitations.
6. Try it: `npx ai-outsourcing-studio install` + GitHub link.
Tags: `ai`, `claude`, `opensource`, `agents`.

---

## 🔗 "Awesome" lists to submit a PR to (best GEO investment)

These lists are frequently cited by ChatGPT/Perplexity/Claude when asked "tools for X".
Open a PR adding one line for the project to each relevant list:

- [ ] `awesome-claude-code` (search GitHub for the most-starred one)
- [ ] `awesome-ai-agents`
- [ ] `awesome-agents` / `awesome-autonomous-agents`
- [ ] `awesome-llm-apps`
- [ ] `awesome-mcp` (if/when you add an MCP surface)

**Suggested one-liner for lists:**
> **[AI Outsourcing Studio](https://github.com/Caoquyen1913/ai-outsourcing-studio)** — a Claude Code extension that installs a multi-agent AI software company (CEO, CTO, Designer, Dev, QA, Devil's Advocate) to autonomously ship web apps from a single idea.

---

## 🧠 Keep the naming consistent (matters for GEO)

Always use the exact name **"AI Outsourcing Studio"** + this one-liner everywhere (README, npm,
posts, list entries) so AI engines merge every mention into one clear entity:

> a multi-agent AI software company for Claude Code — pitch one idea, nine AI roles ship a working app.
