#!/usr/bin/env node
// PostToolUse hook for the Task tool. Appends a one-line entry to .company/CHATLOG.md
// describing which subagent was spawned and the first 200 chars of its prompt.
// Hook input arrives as JSON on stdin (Claude Code hook protocol).

import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chatPath = resolve(root, ".company/CHATLOG.md");

let raw = "";
try {
  for await (const chunk of process.stdin) raw += chunk;
} catch {}

if (!raw) process.exit(0);

let payload;
try { payload = JSON.parse(raw); } catch { process.exit(0); }

const tool = payload.tool_name || payload.tool || "";
if (tool !== "Task") process.exit(0);

const input = payload.tool_input || payload.input || {};
const to = input.subagent_type || "unknown";
const prompt = (input.prompt || input.description || "").replace(/\s+/g, " ").slice(0, 200);

// "from" is the currently active agent — we cannot reliably detect it from the hook
// payload, so we read state.json's "speaking" field if set, else default to "main".
let from = "main";
try {
  const { readFileSync } = await import("node:fs");
  const state = JSON.parse(readFileSync(resolve(root, ".company/state.json"), "utf8"));
  from = state.speaking || "main";
} catch {}

const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
const line = `${ts}  ${from} → ${to}     "${prompt}"\n`;

if (!existsSync(dirname(chatPath))) mkdirSync(dirname(chatPath), { recursive: true });
appendFileSync(chatPath, line);
