---
description: Finalize and ship the active project
---

Run the end-of-project ship sequence.

1. Read `.company/state.json`. If `active_project` is null, stop and tell the user.
2. Verify pre-conditions:
   - `artifacts.CODE === true`
   - Latest `REVIEWS/cto-*.md` has verdict `approve`
   - Latest `REVIEWS/qa-*.md` has verdict `pass`
   - **`node scripts/task.mjs list <slug> --type bug --status open` returns zero rows**
   - **`node scripts/task.mjs list <slug> --type bug --status in_review` returns zero rows**
   If any pre-condition fails, print what's missing and stop. Do NOT proceed to ship.
3. Spawn Ops for finalization:
   > Ship-time finalization on `<slug>`. Fill every TBD in RUNBOOK.md. Ensure CI green on a clean clone. Package a release artifact. Run your mandatory debate with devils-advocate on RUNBOOK.md. Return when done.
4. When Ops returns clean, spawn QA for final pass:
   > Ship-time final pass on `<slug>`. Run the full suite (including any slow/e2e tier). Confirm the coverage matrix is 100% pass. Run your mandatory debate with devils-advocate on the coverage matrix. Return.
5. When QA returns pass, spawn CEO for sign-off:
   > Ship-time sign-off on `<slug>`. Verify EVERY `## Win conditions` entry in BRIEF.md is demonstrably met — write `REVIEWS/ceo-ship.md` with one bullet per win condition citing the evidence (test name, screen, RUNBOOK section, etc.). Verify success criteria too. Confirm zero open or in_review bugs. Flip `state.json.status` to `SHIPPED`. Return a ≤100-word release note to the user.
6. Return the CEO's release note to the user, including the path `deliverables/<slug>/`.
