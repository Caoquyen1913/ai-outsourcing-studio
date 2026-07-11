# Contributing to AI Outsourcing Studio

Thanks for taking the time to contribute! This project is a Claude Code extension packaged
as an npm installer — there's no build step and no runtime dependencies, so getting set up is quick.

## Ground rules

- Open an issue before starting anything larger than a bug fix, so we can agree on the approach.
- Keep PRs focused — one logical change per PR.
- Match the existing style: plain ESM Node (`.mjs`), no dependencies, Markdown for role/command/skill content.

## Project layout

| Path | What it is |
|------|-----------|
| `bin/cli.mjs` | The installer. Copies `template/**` into `~/.claude/`, merges hooks, writes the manifest. |
| `template/agents/aos-*.md` | The 9 role subagent prompts. |
| `template/commands/aos/*.md` | The `/aos:*` slash commands. |
| `template/skills/aos-*/SKILL.md` | The debate / handoff / sync / scaffold skills. |
| `template/ai-outsourcing-studio/` | Scripts, references, and company-seed templates. |
| `assets/` | Logo and banner (SVG). |

## Local development

Test the installer against a sandbox — this never touches your real `~/.claude/`:

```bash
git clone https://github.com/Caoquyen1913/ai-outsourcing-studio.git
cd ai-outsourcing-studio

AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs install
find .tmp-home/.claude -type f          # inspect what got installed

AOS_CLAUDE_HOME="$(pwd)/.tmp-home/.claude" node bin/cli.mjs uninstall
```

To smoke-test a real install of your working copy without publishing:

```bash
npm pack                                 # produces ai-outsourcing-studio-x.y.z.tgz
npx ./ai-outsourcing-studio-*.tgz install
```

## Commit & PR checklist

- [ ] `node bin/cli.mjs install` / `uninstall` both run clean in a sandbox.
- [ ] No new runtime dependencies added to `package.json`.
- [ ] README updated if you changed commands, roles, or install behavior.
- [ ] Commit messages are descriptive (imperative mood, e.g. "add Ops runbook step").

## Releasing (maintainers)

See the release steps in the project's publishing notes. In short: bump the version with
`npm version <patch|minor|major>`, push the tag, and publish with `npm publish`.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
