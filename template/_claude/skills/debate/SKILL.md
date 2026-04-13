---
name: debate
description: Use this skill to run a structured pro/con debate between two roles (usually the role holding a position vs. devils-advocate) when you reach a checkpoint requiring adversarial review. Invoke at every mandatory checkpoint — post-SPEC, post-ARCH, post-DATA-MODEL, and after each Dev wave — or whenever a significant decision needs stress-testing. Input should name the topic, the artifact path under review, and the two role names.
---

# Debate Protocol

You are standing at a checkpoint. Something (a SPEC, ARCH, DATA-MODEL, code wave, etc.) is about to be handed off. Before handoff, it must survive a structured 2-agent debate.

## When to use

Mandatory checkpoints (enforced by role system prompts):
- After BA writes SPEC.md → debate(ba vs devils-advocate)
- After CTO writes ARCH.md → debate(cto vs devils-advocate)
- After DBA writes DATA-MODEL.md → debate(dba vs devils-advocate)
- After each Dev wave completes → debate(dev vs devils-advocate) on the wave's code delta
- Whenever CEO has low confidence in a decision → debate(any role vs devils-advocate)

## Inputs

Caller must tell you:
1. **Topic** — one sentence describing the decision under review.
2. **Artifact path** — the file the defender will cite.
3. **Defender role** — subagent name (ceo, cto, ba, dev, dba, ops, qa).
4. **Challenger role** — almost always `devils-advocate`, but can be any role (e.g. DBA challenging CTO's ARCH.md).
5. **Project slug** — used to locate `.company/projects/<slug>/REVIEWS/`.

## Protocol

Execute these steps in order. Do not skip.

### Step 1 — Compute the review number
List files matching `.company/projects/<slug>/REVIEWS/debate-*.md`. Next number `N` = count + 1. The output file is `debate-<N>.md`.

### Step 2 — Spawn the DEFENDER
Use the Task tool with `subagent_type = <defender role>`. Prompt template:

> Read `<artifact path>`. You are defending it in a structured debate. In ≤400 words:
> 1. State the core claim (one sentence).
> 2. Give your 3 strongest reasons, each citing specific lines in `<artifact path>` as `file:line`.
> 3. List the 2 most likely objections and your rebuttal to each.
> End with: `DEFENDER POSITION COMPLETE`.

Capture the full response verbatim.

### Step 3 — Spawn the CHALLENGER
Use the Task tool with `subagent_type = <challenger role>` (usually `devils-advocate`). Prompt template:

> Read `<artifact path>` and the DEFENDER's position below. Your job is adversarial critique — find the weakest links. In ≤400 words:
> 1. Identify the 3 most dangerous assumptions the defender is making.
> 2. For each, describe a plausible real-world scenario where it breaks.
> 3. Propose 1–2 concrete changes that would close the biggest gap.
> Be rigorous, not contrarian-for-its-own-sake. Cite lines in the artifact.
>
> ---
> DEFENDER POSITION:
> <paste defender output>
>
> End with: `CHALLENGER POSITION COMPLETE`.

Capture the full response verbatim.

### Step 4 — Write the debate artifact
Write `.company/projects/<slug>/REVIEWS/debate-<N>.md` with this structure:

```markdown
---
n: <N>
topic: <topic>
artifact: <artifact path>
defender: <defender role>
challenger: <challenger role>
date: <ISO timestamp>
---

# Debate <N>: <topic>

## Defender (<defender role>)
<defender output verbatim>

## Challenger (<challenger role>)
<challenger output verbatim>

## Synthesis (by caller)
<left for the caller to fill in after reading>
```

### Step 5 — Return to caller
Return a concise summary (≤150 words) of the debate's key tension and the 1–3 decision points the caller must now resolve. Do NOT decide yourself — the calling role synthesizes and writes the Synthesis section, then either:
- accepts the artifact as-is (writes "NO CHANGES" in Synthesis), or
- amends the artifact to address challenger concerns (writes diff summary in Synthesis).

## Anti-patterns

- Do NOT spawn more than 2 agents per debate (defender + challenger only).
- Do NOT let the debate exceed one round. If unresolved, escalate to CEO.
- Do NOT edit the artifact during the debate — only the caller, after Step 5, may edit it.
- Do NOT skip writing `debate-<N>.md` even if the challenger agrees — the file is the audit trail.
