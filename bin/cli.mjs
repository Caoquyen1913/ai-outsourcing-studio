#!/usr/bin/env node
// AI Outsourcing Studio — global installer for Claude Code.
//
// Installs the studio into ~/.claude/ (the global Claude Code config):
//   ~/.claude/agents/aos-*.md
//   ~/.claude/commands/aos/*.md          → /aos:idea, /aos:board, ...
//   ~/.claude/skills/aos-*/SKILL.md
//   ~/.claude/ai-outsourcing-studio/     (lib: scripts, references, templates)
//   ~/.claude/aos-file-manifest.json     (SHA256 manifest for uninstall/integrity)
//
// The installer also merges hook entries into ~/.claude/settings.json without
// touching any existing hooks (e.g. from other extensions). It uses absolute
// paths so hooks work regardless of the shell.
//
// Per-project state (.company/, deliverables/) is created in the user's CWD
// when they run /aos:idea — the global install only ships framework code.
//
// Commands:
//   npx ai-outsourcing-studio install        # (default) install into ~/.claude/
//   npx ai-outsourcing-studio uninstall      # remove everything the installer put there
//   npx ai-outsourcing-studio update         # reinstall (equivalent to install --force)
//   npx ai-outsourcing-studio --version
//   npx ai-outsourcing-studio --help

import {
  cp, mkdir, readdir, readFile, writeFile, stat, rm, copyFile,
} from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { resolve, join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(__dirname, "..");
const templateDir = resolve(packageDir, "template");

// Target directory for install. Defaults to `~/.claude/`, but honours
// AOS_CLAUDE_HOME for CI/sandbox testing without touching the real home.
const CLAUDE_HOME = resolve(
  process.env.AOS_CLAUDE_HOME || join(homedir(), ".claude"),
);
const MANIFEST_PATH = resolve(CLAUDE_HOME, "aos-file-manifest.json");
const SETTINGS_PATH = resolve(CLAUDE_HOME, "settings.json");

// Package version
const pkg = JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8"));

const HELP = `AI Outsourcing Studio — multi-agent software company for Claude Code

Usage:
  npx ai-outsourcing-studio <command> [flags]

Commands:
  install           Install into ~/.claude/ (default if no command given)
  uninstall         Remove all files this installer put in ~/.claude/
  update            Reinstall (overwrites existing files, keeps your settings.json hooks)
  --version         Print version
  --help            Show this help

After install, use the studio from any Claude Code session:
  /aos:idea "your product pitch"    # start a new project
  /aos:board                        # live company dashboard
  /aos:tasks                        # task board + sync log
  /aos:standup                      # one-line status per role
  /aos:kickoff                      # re-run CEO discovery
  /aos:ship                         # final Ops + QA + CEO sign-off

Per-project state (.company/, deliverables/) lives in the folder you run the
commands from — not in ~/.claude/. The global install only ships framework
code (agents, commands, skills, scripts, references).
`;

// ---------- entrypoint ----------

const args = process.argv.slice(2);
const cmd = args[0] || "install";

if (cmd === "--help" || cmd === "-h") {
  process.stdout.write(HELP);
  process.exit(0);
}

if (cmd === "--version" || cmd === "-v") {
  console.log(pkg.version);
  process.exit(0);
}

try {
  if (cmd === "install" || cmd === "init") {
    const force = args.includes("--force") || cmd === "update";
    await install({ force });
  } else if (cmd === "update") {
    await install({ force: true });
  } else if (cmd === "uninstall" || cmd === "remove") {
    await uninstall();
  } else {
    console.error(`unknown command: ${cmd}\n`);
    process.stdout.write(HELP);
    process.exit(2);
  }
} catch (err) {
  console.error(`\nerror: ${err.message}`);
  process.exit(1);
}

// ---------- install ----------

async function install({ force }) {
  if (!existsSync(templateDir)) {
    throw new Error(`template directory missing at ${templateDir}`);
  }

  await mkdir(CLAUDE_HOME, { recursive: true });

  console.log(`→ installing AI Outsourcing Studio v${pkg.version} into ${CLAUDE_HOME}`);

  // Walk the template and plan the copy operations. Each entry is:
  //   { src: abs path in package, dst: abs path under ~/.claude/, type: 'file' }
  const plan = [];

  // agents/         → ~/.claude/agents/
  await planCopyTree(join(templateDir, "agents"), join(CLAUDE_HOME, "agents"), plan);

  // commands/       → ~/.claude/commands/  (preserves the "aos/" subfolder → /aos:*)
  await planCopyTree(join(templateDir, "commands"), join(CLAUDE_HOME, "commands"), plan);

  // skills/         → ~/.claude/skills/
  await planCopyTree(join(templateDir, "skills"), join(CLAUDE_HOME, "skills"), plan);

  // ai-outsourcing-studio/ → ~/.claude/ai-outsourcing-studio/
  await planCopyTree(
    join(templateDir, "ai-outsourcing-studio"),
    join(CLAUDE_HOME, "ai-outsourcing-studio"),
    plan,
  );

  // Collision check
  if (!force) {
    const collisions = plan.filter(e => existsSync(e.dst));
    if (collisions.length) {
      console.error(`Refusing to overwrite existing files in ~/.claude/:`);
      for (const c of collisions.slice(0, 8)) {
        console.error(`  - ${relative(CLAUDE_HOME, c.dst).replace(/\\/g, "/")}`);
      }
      if (collisions.length > 8) console.error(`  ... and ${collisions.length - 8} more`);
      console.error(`\nRe-run with --force (or 'update') to overwrite.`);
      process.exit(1);
    }
  }

  // Execute copies
  for (const e of plan) {
    await mkdir(dirname(e.dst), { recursive: true });
    await copyFile(e.src, e.dst);
  }
  console.log(`  ✓ copied ${plan.length} files`);

  // Merge hooks into settings.json
  const hooksAdded = await mergeSettings();
  if (hooksAdded > 0) {
    console.log(`  ✓ merged ${hooksAdded} hook entr${hooksAdded === 1 ? "y" : "ies"} into settings.json`);
  } else {
    console.log(`  ✓ settings.json already has our hooks`);
  }

  // Write manifest (SHA256 of every installed file)
  const manifest = {
    name: pkg.name,
    version: pkg.version,
    installed_at: new Date().toISOString(),
    claude_home: CLAUDE_HOME,
    files: {},
  };
  for (const e of plan) {
    const rel = relative(CLAUDE_HOME, e.dst).replace(/\\/g, "/");
    manifest.files[rel] = await sha256(e.dst);
  }
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`  ✓ wrote manifest: ${relative(CLAUDE_HOME, MANIFEST_PATH).replace(/\\/g, "/")}`);

  printSuccessBanner();
}

async function planCopyTree(srcDir, dstDir, plan) {
  if (!existsSync(srcDir)) return;
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const s = join(srcDir, entry.name);
    const d = join(dstDir, entry.name);
    if (entry.isDirectory()) {
      await planCopyTree(s, d, plan);
    } else if (entry.isFile()) {
      plan.push({ src: s, dst: d, type: "file" });
    }
  }
}

async function sha256(path) {
  const h = createHash("sha256");
  h.update(await readFile(path));
  return h.digest("hex");
}

// ---------- settings.json merge ----------

async function mergeSettings() {
  const scriptsDir = join(CLAUDE_HOME, "ai-outsourcing-studio", "scripts");
  // Use forward slashes in the path so it works in bash on Windows (Git Bash)
  // and in JSON regardless of platform.
  const updateBoard = posixify(join(scriptsDir, "update-board.mjs"));
  const logChat = posixify(join(scriptsDir, "log-chat.mjs"));

  let settings = {};
  if (existsSync(SETTINGS_PATH)) {
    try {
      settings = JSON.parse(await readFile(SETTINGS_PATH, "utf8"));
    } catch (e) {
      throw new Error(`failed to parse ${SETTINGS_PATH}: ${e.message}`);
    }
  }

  settings.hooks ||= {};
  settings.hooks.PostToolUse ||= [];
  settings.hooks.SessionStart ||= [];

  // Tag our entries so update/uninstall can find them.
  const AOS_TAG = "aos-studio";
  let added = 0;

  const ensureHookGroup = (bucket, matcher, command) => {
    const existing = bucket.find(
      g => g._aos === AOS_TAG && g.matcher === matcher,
    );
    if (existing) {
      // Update command in case scripts path changed
      existing.hooks = [{ type: "command", command }];
      return 0;
    }
    bucket.push({
      _aos: AOS_TAG,
      matcher,
      hooks: [{ type: "command", command }],
    });
    return 1;
  };

  added += ensureHookGroup(
    settings.hooks.PostToolUse,
    "Task",
    `node "${logChat}"`,
  );
  added += ensureHookGroup(
    settings.hooks.PostToolUse,
    "Write|Edit|MultiEdit",
    `node "${updateBoard}"`,
  );

  // SessionStart groups use a different shape (no matcher)
  const sessionExists = settings.hooks.SessionStart.find(
    g => g._aos === AOS_TAG,
  );
  if (sessionExists) {
    sessionExists.hooks = [
      { type: "command", command: `node "${updateBoard}"` },
    ];
  } else {
    settings.hooks.SessionStart.push({
      _aos: AOS_TAG,
      hooks: [{ type: "command", command: `node "${updateBoard}"` }],
    });
    added++;
  }

  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
  return added;
}

// ---------- uninstall ----------

async function uninstall() {
  if (!existsSync(MANIFEST_PATH)) {
    console.log(`no manifest found at ${MANIFEST_PATH} — nothing to uninstall.`);
    return;
  }
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  console.log(`→ uninstalling ${manifest.name}@${manifest.version} from ${CLAUDE_HOME}`);

  let removed = 0;
  for (const rel of Object.keys(manifest.files)) {
    const abs = join(CLAUDE_HOME, rel);
    if (existsSync(abs)) {
      await rm(abs, { force: true });
      removed++;
    }
  }

  // Remove empty directories we created (best-effort, leaf-first).
  const dirs = new Set();
  for (const rel of Object.keys(manifest.files)) {
    let d = dirname(join(CLAUDE_HOME, rel));
    while (d.startsWith(CLAUDE_HOME) && d !== CLAUDE_HOME) {
      dirs.add(d);
      d = dirname(d);
    }
  }
  const dirList = [...dirs].sort((a, b) => b.length - a.length); // deepest first
  for (const d of dirList) {
    try {
      const entries = await readdir(d);
      if (entries.length === 0) await rm(d, { recursive: false, force: true });
    } catch {}
  }

  // Remove our tagged hook entries from settings.json
  if (existsSync(SETTINGS_PATH)) {
    try {
      const settings = JSON.parse(await readFile(SETTINGS_PATH, "utf8"));
      const clean = (bucket) => (bucket || []).filter(g => g._aos !== "aos-studio");
      if (settings.hooks) {
        if (settings.hooks.PostToolUse) settings.hooks.PostToolUse = clean(settings.hooks.PostToolUse);
        if (settings.hooks.SessionStart) settings.hooks.SessionStart = clean(settings.hooks.SessionStart);
      }
      await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
    } catch {}
  }

  // Remove manifest itself
  await rm(MANIFEST_PATH, { force: true });

  console.log(`  ✓ removed ${removed} files and cleaned settings.json`);
  console.log(`\nUninstall complete.`);
}

// ---------- util ----------

function posixify(p) {
  return p.replace(/\\/g, "/");
}

function printSuccessBanner() {
  console.log(`\n✓ AI Outsourcing Studio v${pkg.version} installed into ~/.claude/\n`);
  console.log(`Start using it from any Claude Code session:`);
  console.log(`  /aos:idea "your product pitch"`);
  console.log(`  /aos:board`);
  console.log(`  /aos:tasks\n`);
  console.log(`Per-project state (.company/, deliverables/) will be created in the folder`);
  console.log(`you run the commands from. The global install only holds framework code.\n`);
  console.log(`To remove: npx ai-outsourcing-studio uninstall`);
}
