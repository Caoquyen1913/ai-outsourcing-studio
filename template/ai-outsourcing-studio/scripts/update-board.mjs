#!/usr/bin/env node
// Regenerates .company/BOARD.md from .company/state.json.
// Called by a PostToolUse hook after Write|Edit under .company/ or deliverables/.
// Also readable as a manual command: `node scripts/update-board.mjs`.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const statePath = resolve(root, ".company/state.json");
const boardPath = resolve(root, ".company/BOARD.md");
const chatPath  = resolve(root, ".company/CHATLOG.md");

if (!existsSync(statePath)) process.exit(0);

const state = JSON.parse(readFileSync(statePath, "utf8"));

const now = new Date().toISOString().replace("T", " ").slice(0, 19);

const roleOrder = ["aos-ceo", "aos-cto", "aos-ba", "aos-designer", "aos-dev", "aos-dba", "aos-ops", "aos-qa", "aos-devils-advocate"];
const roleLabel = {
  "aos-ceo": "CEO", "aos-cto": "CTO", "aos-ba": "BA", "aos-designer": "Designer", "aos-dev": "Dev",
  "aos-dba": "DBA", "aos-ops": "Ops", "aos-qa": "QA", "aos-devils-advocate": "Devil's Advocate",
};

const pad = (s, n) => String(s ?? "-").padEnd(n).slice(0, n);

const rows = roleOrder.map(k => {
  const r = state.roles?.[k] ?? {};
  return `| ${pad(roleLabel[k], 16)} | ${pad(r.status, 10)} | ${pad(r.current, 30)} | ${pad(r.last_action, 19)} |`;
}).join("\n");

const art = state.artifacts ?? {};
const mark = v => (v === true ? "✅" : v === "partial" ? "🟡" : "⬜");
const artLine = `BRIEF ${mark(art.BRIEF)}  SPEC ${mark(art.SPEC)}  DESIGN ${mark(art.DESIGN)}  ARCH ${mark(art.ARCH)}  DATA-MODEL ${mark(art["DATA-MODEL"])}  TASKS ${mark(art.TASKS)}  TEST-PLAN ${mark(art["TEST-PLAN"])}  RUNBOOK ${mark(art.RUNBOOK)}  CODE ${mark(art.CODE)}`;

// Tail the last ~6 chat entries (skip header).
let chatter = "_(none yet)_";
if (existsSync(chatPath)) {
  const lines = readFileSync(chatPath, "utf8").split(/\r?\n/).filter(Boolean);
  const logLines = lines.filter(l => /^\d{4}-\d{2}-\d{2}/.test(l));
  if (logLines.length) chatter = logLines.slice(-6).join("\n");
}

const active = state.active_project
  ? `**${state.active_project}** — status: ${state.status ?? "?"}${state.phase ? `, phase: ${state.phase}` : ""}${state.wave ? `, wave: ${state.wave}` : ""}`
  : "_none_ — run `/aos:idea \"<pitch>\"` to start.";

// Per-project surfaces: open tasks per owner + recent sync entries.
let taskSection = "";
let syncSection = "";
if (state.active_project) {
  const slug = state.active_project;
  const tasksPath = resolve(root, ".company/projects", slug, "tasks.jsonl");
  if (existsSync(tasksPath)) {
    const events = readFileSync(tasksPath, "utf8")
      .split(/\r?\n/).filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
    const tasks = new Map();
    for (const ev of events) {
      if (ev.op === "add") {
        tasks.set(ev.id, { id: ev.id, type: ev.type, title: ev.title, owner: ev.owner, status: ev.status || "open" });
      } else if (ev.op === "update") {
        const t = tasks.get(ev.id);
        if (!t) continue;
        if (ev.status) t.status = ev.status;
        if (ev.owner) t.owner = ev.owner;
      }
    }
    const open = [...tasks.values()].filter(t => t.status !== "done" && t.status !== "cancelled");
    const bugs = open.filter(t => t.type === "bug");
    const byOwner = {};
    for (const t of open) (byOwner[t.owner] ||= []).push(t);
    const ownerLines = Object.entries(byOwner)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([owner, list]) => {
        const ids = list.slice(0, 4).map(t => `${t.id}${t.type === "bug" ? "🐞" : ""}`).join(" ");
        const more = list.length > 4 ? ` (+${list.length - 4})` : "";
        return `- **${owner}** (${list.length}): ${ids}${more}`;
      });
    taskSection = `\n## Open tasks (${open.length}, bugs: ${bugs.length})\n${ownerLines.join("\n") || "_none_"}\n`;
  }
  const syncP = resolve(root, ".company/projects", slug, "SYNC.md");
  if (existsSync(syncP)) {
    const syncLines = readFileSync(syncP, "utf8").split(/\r?\n/).filter(l => /^\[\d{4}/.test(l));
    const tail = syncLines.slice(-5);
    if (tail.length) syncSection = `\n## Recent sync\n\`\`\`\n${tail.join("\n")}\n\`\`\`\n`;
  }
}

const out = `# Outsourcing Studio — Live Board
_Updated: ${now}_

**Active project:** ${active}

## Roles
| Role             | Status     | Current task                   | Last action         |
|------------------|------------|--------------------------------|---------------------|
${rows}
${taskSection}${syncSection}
## Recent chatter
${chatter}

## Artifacts
${artLine}
`;

writeFileSync(boardPath, out);
