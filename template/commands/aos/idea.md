---
name: aos:idea
description: Submit a new product idea to the AI Outsourcing Studio CEO (fully autonomous mode)
argument-hint: "<one-line pitch>"
---

A new idea has just arrived from the user. The raw pitch is:

> $ARGUMENTS

**The user is a client who is pitching and walking out the door.** The company runs the project autonomously from here. Do NOT treat the user as an always-on collaborator.

Your job as the Reception Desk:

1. Append the pitch to `.company/inbox.md` under a new `## Pitch (<ISO timestamp>)` heading. Do NOT clear the file — the CEO will read it.
2. Check `.company/state.json`. If `active_project` is not null, tell the user there is already an active project and ask ONCE whether they want to queue this idea, abandon the active project (requires explicit `yes, abandon <slug>`), or cancel this pitch. Parallel projects are not supported.
3. If no active project, spawn the **aos-ceo** subagent via the Task tool with this prompt (verbatim — do NOT soften the autonomy clause):

   > A new pitch is in `.company/inbox.md`. Read it and run your Phase 1–7 workflow from `$HOME/.claude/agents/aos-ceo.md`.
   >
   > **AUTONOMOUS MODE — strict rules:**
   > - Follow your Autonomy Mandate exactly. The user is a client who walked out; the company runs itself.
   > - In Phase 3 (discovery), ask ZERO questions if you can infer the three vision dimensions (who, what pain, what winning looks like) from the pitch + reasonable defaults. Otherwise ask AT MOST 3 strategic, vision-only questions in a single batch.
   > - You are FORBIDDEN from asking the user about tech, stack, framework, database, hosting, auth provider, libraries, UI library, colors, fonts, layout, copy tone, integrations, deadlines, budget, or any implementation detail. Those are delegated to CTO / Designer / DBA / Ops / Dev / QA and they will decide autonomously.
   > - Before asking ANY question, draft the inferences you would make with zero questions. If those inferences are defensible for a generic user in the target segment, ask zero questions.
   > - When BRIEF.md is ready (with `## Win conditions`, `## Assumptions`, `## Delegated decisions`, zero `## Open questions`), invoke `Skill("aos-handoff", ...)` to PO **immediately**. Do NOT pause to confirm BRIEF with the user.
   > - The next time the user hears from the company is either (a) `/aos:board` / `/aos:tasks` if they run it manually, or (b) the final release note at ship time. Everything in between is debate, delegation, and execution.
   >
   > Do not soften these rules. Do not invent hybrid workflows. Run the pipeline.

4. Return a short summary to the user: the pitch was received, CEO is taking over in autonomous mode, they'll see at most 3 strategic questions (possibly zero), and they can check `/aos:board` anytime. Let them know the next full contact is at ship time unless they manually run `/aos:kickoff` to revise scope.
