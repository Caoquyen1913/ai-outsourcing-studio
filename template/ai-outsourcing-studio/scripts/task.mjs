#!/usr/bin/env node
// Per-project task system + sync log for the AI Outsourcing Studio.
//
// Storage (per project slug):
//   .company/projects/<slug>/tasks.jsonl   — append-only event log (1 JSON per line)
//   .company/projects/<slug>/TASKBOARD.md  — rendered view (regenerated on every change)
//   .company/projects/<slug>/SYNC.md       — append-only daily/checkpoint sync log
//
// ID scheme:
//   T-NNN  feature / chore / review task
//   B-NNN  bug
//   D-NNN  decision
//   K-NNN  risk
//
// Commands:
//   node scripts/task.mjs add    <slug> --type <feature|bug|chore|review|decision|risk> --title "..." --owner <role> [--source <role>] [--refs "..."] [--blocking "T-1,T-2"]
//   node scripts/task.mjs update <slug> <id> [--status open|in_progress|blocked|in_review|done|cancelled] [--owner <role>] [--note "..."]
//   node scripts/task.mjs list   <slug> [--status open] [--owner dev] [--type bug] [--json]
//   node scripts/task.mjs render <slug>
//   node scripts/task.mjs sync   <slug> --role <r> --status "..." [--done "T-1,T-2"] [--next "T-3"] [--blockers "..."]
//
// Notes:
//   - Append-only. Never edit tasks.jsonl by hand. Use update.
//   - Renderer replays events to compute current state. Safe under concurrent appends.

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const argv = process.argv.slice(2);
const cmd = argv.shift();
const slug = argv.shift();

if (!cmd || !slug) {
  console.error("usage: task.mjs <add|update|list|render|sync> <slug> ...");
  process.exit(2);
}

const projDir = resolve(root, ".company/projects", slug);
const tasksPath = resolve(projDir, "tasks.jsonl");
const boardPath = resolve(projDir, "TASKBOARD.md");
const syncPath  = resolve(projDir, "SYNC.md");

if (!existsSync(projDir)) mkdirSync(projDir, { recursive: true });

function parseFlags(arr) {
  const out = {};
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].startsWith("--")) continue;
    const key = arr[i].slice(2);
    const peek = arr[i + 1];
    const val = (peek !== undefined && !peek.startsWith("--")) ? arr[++i] : "true";
    out[key] = val;
  }
  return out;
}

function readEvents() {
  if (!existsSync(tasksPath)) return [];
  return readFileSync(tasksPath, "utf8")
    .split(/\r?\n/).filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function appendEvent(ev) {
  appendFileSync(tasksPath, JSON.stringify(ev) + "\n");
}

function prefixFor(type) {
  if (type === "bug") return "B";
  if (type === "decision") return "D";
  if (type === "risk") return "K";
  return "T";
}

function nextId(prefix, events) {
  const used = events
    .filter(e => e.op === "add" && typeof e.id === "string" && e.id.startsWith(prefix + "-"))
    .map(e => parseInt(e.id.split("-")[1], 10))
    .filter(n => Number.isFinite(n));
  const n = used.length ? Math.max(...used) + 1 : 1;
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

function reduceState(events) {
  const tasks = new Map();
  for (const ev of events) {
    if (ev.op === "add") {
      tasks.set(ev.id, {
        id: ev.id,
        type: ev.type,
        title: ev.title,
        owner: ev.owner,
        source: ev.source || "-",
        refs: ev.refs || "",
        blocking: ev.blocking || "",
        status: ev.status || "open",
        created_at: ev.ts,
        updated_at: ev.ts,
        notes: [],
      });
    } else if (ev.op === "update") {
      const t = tasks.get(ev.id);
      if (!t) continue;
      if (ev.status) t.status = ev.status;
      if (ev.owner) t.owner = ev.owner;
      if (ev.note) t.notes.push({ ts: ev.ts, note: ev.note });
      t.updated_at = ev.ts;
    }
  }
  return tasks;
}

function fmtRow(t) {
  const title = (t.title || "").replace(/\|/g, "\\|").slice(0, 80);
  return `| ${t.id} | ${t.type} | ${t.status} | ${t.owner} | ${t.source} | ${title} | ${t.refs || "-"} |`;
}

function renderBoard() {
  const tasks = [...reduceState(readEvents()).values()].sort((a, b) => a.id.localeCompare(b.id));
  const open = tasks.filter(t => t.status !== "done" && t.status !== "cancelled");
  const closed = tasks.filter(t => t.status === "done" || t.status === "cancelled");

  const bugsOpen = open.filter(t => t.type === "bug").length;

  const head = `| ID | Type | Status | Owner | Source | Title | Refs |
|----|------|--------|-------|--------|-------|------|`;

  const out = `# Task Board — ${slug}
_Updated: ${new Date().toISOString().replace("T", " ").slice(0, 19)}_

**Open: ${open.length}** (bugs: ${bugsOpen}) — **Closed: ${closed.length}**

> Append-only event log lives in \`tasks.jsonl\`. This file is regenerated. Do not edit by hand.

## Open
${head}
${open.map(fmtRow).join("\n") || "| - | - | - | - | - | _no open tasks_ | - |"}

## Closed
${head}
${closed.map(fmtRow).join("\n") || "| - | - | - | - | - | _none yet_ | - |"}
`;
  writeFileSync(boardPath, out);
}

const ts = new Date().toISOString();

switch (cmd) {
  case "add": {
    const f = parseFlags(argv);
    if (!f.type || !f.title || !f.owner) {
      console.error("add requires --type --title --owner");
      process.exit(2);
    }
    const events = readEvents();
    const id = nextId(prefixFor(f.type), events);
    appendEvent({
      ts, op: "add", id,
      type: f.type, title: f.title, owner: f.owner,
      source: f.source || "unknown",
      refs: f.refs || "",
      blocking: f.blocking || "",
      status: "open",
    });
    renderBoard();
    console.log(id);
    break;
  }
  case "update": {
    const id = argv.shift();
    if (!id) { console.error("update requires <id>"); process.exit(2); }
    const f = parseFlags(argv);
    appendEvent({
      ts, op: "update", id,
      status: f.status, owner: f.owner, note: f.note,
    });
    renderBoard();
    console.log(`updated ${id}`);
    break;
  }
  case "list": {
    const f = parseFlags(argv);
    const tasks = [...reduceState(readEvents()).values()];
    const filtered = tasks.filter(t =>
      (!f.status || t.status === f.status) &&
      (!f.owner || t.owner === f.owner) &&
      (!f.type || t.type === f.type)
    );
    if (f.json === "true" || f.json === undefined && false) {
      console.log(JSON.stringify(filtered, null, 2));
    } else if (f.json) {
      console.log(JSON.stringify(filtered, null, 2));
    } else {
      if (filtered.length === 0) console.log("(no tasks match)");
      else filtered.forEach(t => console.log(`${t.id}  [${t.status}]  ${t.owner.padEnd(10)}  ${t.type.padEnd(8)}  ${t.title}`));
    }
    break;
  }
  case "render": {
    renderBoard();
    console.log(`rendered ${boardPath}`);
    break;
  }
  case "sync": {
    const f = parseFlags(argv);
    if (!f.role || !f.status) {
      console.error("sync requires --role --status");
      process.exit(2);
    }
    if (!existsSync(syncPath)) {
      writeFileSync(syncPath,
`# Sync Log — ${slug}

Append-only daily/checkpoint sync. Every role appends a line at the end of its turn.
Format: \`[YYYY-MM-DD HH:MM:SS] <role>: <status> | done: <ids> | next: <ids> | blockers: <text>\`

---
`);
    }
    const line = `[${ts.replace("T", " ").slice(0, 19)}] ${f.role}: ${f.status} | done: ${f.done || "-"} | next: ${f.next || "-"} | blockers: ${f.blockers || "none"}\n`;
    appendFileSync(syncPath, line);
    console.log("synced");
    break;
  }
  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(2);
}
