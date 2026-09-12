# Cyb3r_Soc

SOC cybersecurity dashboard built with React, Vite and TypeScript.

## Active architecture

- `src/App.tsx` owns route selection and boot/offline route gates.
- `src/v2/` contains the active V2 visual screens.
- `src/v2/DashboardReference.tsx` exports the shared V2 shell and Dashboard.
- Shared visual dependencies: `components/brand`, `components/ai`,
  `components/assets`, `components/special-screens`, `components/map`,
  `hooks/useAnimationActivity.ts`, and `styles/official-assets.css`.
- Keep screen-specific CSS in the screen CSS file; do not promote it globally.

## Legacy

`src/components/layout/*` and `src/components/loaders/Loaders.tsx` are legacy
and are outside active V2 routes. Legacy code must not be inspected, migrated,
or modified unless a task explicitly requires it or a direct runtime dependency
proves it necessary.

## Visual source of truth

- Target: `Cyb3r_Soc_References_1to1/`
- Current: `tests/visual/current/`
- Repeat: `tests/visual/repeat/`
- Diff: `tests/visual/diffs/`
- Metrics: `tests/visual/diffs/metrics.json`
- `docs/references/` is supporting material, not the official source of truth.

## Critical invariants

- Never modify official reference PNGs or relax visual thresholds to obtain PASS.
- Never use global CSS `zoom` or global `transform: scale()`.
- Preserve compact navigation at 150% browser zoom.
- Preserve the CyberAI 125% jitter fix in `styles/official-assets.css`:
  `.cyber-ai .ai-orb > .cyber-ai-orb-asset` must remain relative, unbordered,
  and without inherited animation.
- Keep generated visual output separate from application source.
- Avoid unrelated refactors and do not scan the whole repository by default.

## Context efficiency

1. Start with files explicitly named by the task.
2. Follow only direct imports, selectors, runtime dependencies, or failing tests.
3. Do not recursively inspect unrelated directories or legacy code.
4. Do not reopen unchanged files unless required information is missing.
5. Prefer targeted symbol/import/selector searches over full-file reads.
6. Never dump the full repository tree or large files without a concrete need.
7. Bound diagnostic output; normally target 4–8 KB.
8. Prefer `git diff --stat`, file-scoped diff, `git log -5 --oneline`, and
   specific tests over broad output.
9. Summarize discoveries instead of repeating source or logs.
10. Stop investigation once sufficient evidence exists; do not general-audit
    unless explicitly requested.

## Validation policy

- Local screen CSS: build, that screen capture/test, and responsive only when
  geometry or breakpoints changed.
- Shared component: build, direct consumers, and responsive when layout changes.
- Global structural change: build, complete responsive suite, relevant visual
  regression.
- Visual phase closure: run every validation required to substantiate PASS.
- Never omit a critical validation solely to save tokens.

## Command discipline

- For noisy terminal operations, prefer RTK when it materially reduces output.
- RTK reduces command output; it does not choose code-reading scope.
- Use native commands when output is already small or full detail is necessary.
- Do not use `Get-ChildItem -Recurse`, complete `git log`, complete `git diff`,
  or broad repository searches unless explicitly necessary.

## Task scope template

```text
TASK: <screen / feature>
PRIMARY FILES: <known files>
ALLOWED CONTEXT: direct dependencies only
DO NOT INSPECT: other screens, legacy, unrelated generated outputs
TARGET: <if applicable>
CURRENT: <if applicable>
DIFF: <if applicable>
METRICS: <if applicable>
RULE: Do not perform a general repository audit. Open another source file only
when a direct import, runtime dependency, CSS selector, failing test, or other
concrete evidence demonstrates that it is necessary.
```

## Commands

- Build: `npm.cmd run build`
- Responsive: `npm.cmd run test:responsive`
- Visual capture: `node scripts/capture-visuals.mjs`

Read `src/v2/AGENTS.md` for V2 screen routing and
`docs/ARCHITECTURE_MAP.md` only when this file lacks needed detail.
