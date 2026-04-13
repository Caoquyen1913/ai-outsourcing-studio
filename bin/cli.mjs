#!/usr/bin/env node
// AI Outsourcing Studio — installer CLI.
// Copies the template tree into a target directory, restoring dot-prefixed
// files and folders that npm would otherwise strip on publish.

import { cp, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = resolve(__dirname, "..", "template");

// Names that npm/git strip or that we deliberately store under a non-dot name
// inside the package, then restore on copy.
const RENAME = {
  "_claude":  ".claude",
  "_company": ".company",
  "_gemini":  ".gemini",
  "_cursor":  ".cursor",
  "gitignore": ".gitignore",
  "mcp.json":  ".mcp.json",
};

const HELP = `AI Outsourcing Studio — a Claude Code multi-agent software company

Usage:
  npx ai-outsourcing-studio init [dir]   Install studio into <dir> (default: cwd)
  npx ai-outsourcing-studio --help       Show this help

Init flags:
  --force        Overwrite if studio files already exist in the target

After install:
  cd <dir>
  claude                            # opens Claude Code in the studio
  /aos-idea "your product pitch"    # the CEO takes over
  /aos-board                        # see the live company dashboard
  /aos-tasks                        # see the task board
`;

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === "--help" || cmd === "-h") {
  process.stdout.write(HELP);
  process.exit(0);
}

if (cmd === "init") {
  const rest = args.slice(1);
  const force = rest.includes("--force");
  const positional = rest.filter(a => !a.startsWith("--"));
  const target = resolve(positional[0] || process.cwd());
  await init(target, force);
  process.exit(0);
}

console.error(`unknown command: ${cmd}\n`);
process.stdout.write(HELP);
process.exit(2);

// ---------- impl ----------

async function init(target, force) {
  if (!existsSync(templateDir)) {
    console.error(`internal error: template directory missing at ${templateDir}`);
    process.exit(1);
  }

  await mkdir(target, { recursive: true });

  const collisions = [
    "CLAUDE.md",
    "AGENTS.md",
    "GEMINI.md",
    ".claude",
    ".company",
    ".gemini",
    ".cursor",
    "scripts",
    ".mcp.json",
    ".gitignore",
    "README.md",
  ].filter(p => existsSync(join(target, p)));

  if (collisions.length && !force) {
    console.error(`The target directory already contains studio files:`);
    console.error(`  ${target}\n`);
    for (const c of collisions) console.error(`  - ${c}`);
    console.error(`\nRe-run with --force to overwrite, or pick a different directory.`);
    process.exit(1);
  }

  await copyTemplate(templateDir, target);

  const cdPath = target.includes(" ") ? `"${target}"` : target;
  console.log(`\n✓ AI Outsourcing Studio installed.`);
  console.log(`  Location: ${target}\n`);
  console.log(`Next steps:`);
  console.log(`  cd ${cdPath}`);
  console.log(`  claude`);
  console.log(`  /aos-idea "your product pitch"\n`);
  console.log(`Then watch the company work via /aos-board and /aos-tasks.`);
  console.log(`Read CLAUDE.md and template README for the full operating model.\n`);
}

async function copyTemplate(srcDir, dstDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const dstName = RENAME[entry.name] || entry.name;
    const dstPath = join(dstDir, dstName);
    if (entry.isDirectory()) {
      await mkdir(dstPath, { recursive: true });
      await copyTemplate(srcPath, dstPath);
    } else {
      await cp(srcPath, dstPath);
    }
  }
}
