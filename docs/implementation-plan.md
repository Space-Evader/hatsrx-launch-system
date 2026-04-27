# HatsRx Safe Implementation Plan (Planning Only)

## Context Check
I scanned the repository and found only one source file (`Space-Out.as`) at the current commit. The expected planning docs listed in the request (`README.md`, `AGENTS.md`, `HATSRX_BLUEPRINT.md`, `PRODUCT_TAGGING_SYSTEM.md`, `QUIZ_LOGIC.md`, `WIX_BUILD_TASKS.md`, `CONTENT_ENGINE.md`) are not present in this checkout.

This plan is therefore a **safe starter plan** based on the requested HatsRx scope and the constraints provided, and should be refined once those files are available.

## Guardrails (Explicitly Applied)
- Planning step only (no Wix code).
- No changes to payments, shipping, subscriptions, or publishing.
- Beginner-friendly structure and sequencing.

## 1) Repo Folder Structure (Proposed for HatsRx work)

```text
/
├─ docs/
│  ├─ 00-overview.md
│  ├─ 01-blueprint-summary.md
│  ├─ 02-tagging-schema.md
│  ├─ 03-quiz-rules.md
│  ├─ 04-wix-task-checklist.md
│  └─ 05-content-engine-guide.md
├─ planning/
│  ├─ phase-1-issues.md
│  ├─ risk-register.md
│  └─ assumptions-and-open-questions.md
├─ data/
│  ├─ product-tags.sample.csv
│  ├─ quiz-logic.sample.json
│  └─ content-snippets.sample.csv
├─ qa/
│  ├─ manual-test-cases.md
│  └─ acceptance-criteria.md
└─ IMPLEMENTATION_PLAN.md
```

> Keep implementation artifacts in docs/planning/data first, and postpone Wix editor and production wiring until review is complete.

## 2) GitHub Issue List (Phase 1)

1. **Issue: Validate source docs and lock scope**
   - Collect and confirm the seven expected planning files.
   - Add a one-page scope statement: what is in/out for Phase 1.
   - Acceptance: reviewed and approved in writing.

2. **Issue: Define product tagging schema (v1)**
   - Create a beginner-friendly tag dictionary (allowed values + examples).
   - Map each product/category to tags in a reviewable table.
   - Acceptance: no ambiguous tags remaining.

3. **Issue: Convert quiz logic into decision table**
   - Convert branching rules to a step-by-step matrix.
   - Add edge-case handling (“no match”, “multi-match”, missing answers).
   - Acceptance: each answer path reaches a deterministic output.

4. **Issue: Build content inventory for recommendation outputs**
   - Inventory all recommendation snippets, disclaimers, CTAs.
   - Add owner and review status columns.
   - Acceptance: every quiz outcome has approved content.

5. **Issue: Draft Wix task breakdown (no coding)**
   - Translate tasks into click-by-click setup steps.
   - Split tasks into “safe now” vs “later/blocked”.
   - Acceptance: a beginner can follow without developer assumptions.

6. **Issue: QA checklist + sign-off workflow**
   - Create manual test checklist for core flows.
   - Add rollback notes and “do-not-touch” areas (payments/shipping/subscriptions/publishing).
   - Acceptance: test checklist executed once in staging.

## 3) First Pull Request Plan

**PR Title (suggested):** `docs: add Phase 1 HatsRx planning pack (no-code, safe scope)`

**PR Contents:**
- Add normalized planning docs (`docs/` and `planning/`).
- Include the Phase 1 issue list and acceptance criteria.
- Include explicit guardrails: no payment/shipping/subscription/publishing changes.
- Include beginner runbook/checklist.

**PR Review Checklist:**
- [ ] No Wix/Velo code added.
- [ ] No store operations settings touched.
- [ ] All tasks phrased in beginner-friendly, sequential steps.
- [ ] Each Phase 1 issue has clear acceptance criteria.

## 4) Missing Information Needed From You

1. The actual repository/branch containing these files:
   - `README.md`
   - `AGENTS.md`
   - `HATSRX_BLUEPRINT.md`
   - `PRODUCT_TAGGING_SYSTEM.md`
   - `QUIZ_LOGIC.md`
   - `WIX_BUILD_TASKS.md`
   - `CONTENT_ENGINE.md`
2. Which environment is Phase 1 targeting first (local docs only, Wix staging site, or both)?
3. Any compliance language/disclaimer requirements (medical claims, legal review, FDA-style wording constraints).
4. Desired definition of done for Phase 1 (documentation complete vs staging flow validated).
5. Who approves copy/tagging logic (name/role), and expected turnaround time.

## 5) What to Build First

**Build first:** a single “source-of-truth” planning packet that merges blueprint, tagging, and quiz logic into one deterministic decision table + content map.

Why first:
- It removes ambiguity before any platform work.
- It is safe (no operational ecommerce risk).
- It is beginner-friendly and reviewable by non-developers.

**First concrete deliverable:**
- `planning/phase-1-issues.md`
- `docs/02-tagging-schema.md`
- `docs/03-quiz-rules.md`
- `qa/acceptance-criteria.md`

Then proceed to Wix task execution planning only after these are approved.
