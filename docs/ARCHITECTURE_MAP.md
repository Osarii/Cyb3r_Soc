# Cyb3r_Soc architecture map

Use this document only when root or V2 `AGENTS.md` lacks the required mapping.
It is a routing map, not implementation documentation.

## Project shell

`src/main.tsx` imports global and official-asset CSS, preloads critical video
assets, then renders `App` inside `BrowserRouter`.

`src/App.tsx` controls the active routes, session boot gate, system offline
gate, mitigation progress, visual-test mode, and the shared V2 frame.

`ReferenceShell` in `src/v2/DashboardReference.tsx` supplies the V2 sidebar,
topbar, background, content offset, mobile menu, and shared navigation.

## Active V2 screens

| Route | React entry | CSS |
| --- | --- | --- |
| `/dashboard` | `DashboardReference.tsx` | `reference-dashboard.css` |
| `/boot-preview` and initial session boot | `SpecialScreens.tsx`: `InitialBootScreenV2` | `special-screens.css` |
| `/threat-map` | `ThreatMapReference.tsx` within `ReferenceShell` | `threat-map-reference.css` |
| `/mitigation`, `/incidents/:id/mitigation` | `SpecialScreens.tsx`: `DDoSMitigationScreenV2` | `special-screens.css` |
| `/offline` and offline state | `SpecialScreens.tsx`: `ServerUnavailableV2` | `special-screens.css` |

Other application pages are framed routes. They are not a visual-convergence
target unless a task names them.

## Shared components

- `components/brand/CyberSOCLogo.tsx`: canonical responsive logo asset choice.
- `components/brand/Cyb3r_SocLogo.tsx`: V2-facing logo facade and mark API.
- `components/brand/AmbientField.tsx`: static ambient SVG field.
- `components/assets/AdaptiveAssetImage.tsx`: WebM/static asset switching.
- `components/ai/CyberAI.tsx`: persistent assistant UI and state-specific asset.
- `components/special-screens/DDoSInterceptor.tsx`: DDoS-only asset wrapper.
- `components/special-screens/ServerStatusCube.tsx`: Offline-only cube wrapper.
- `hooks/useAnimationActivity.ts`: viewport, tab visibility and reduced-motion
  activity policy.

Inspect these only when the target screen imports them or evidence points to
their output.

## Assets

`src/assets/asset-manifest.json` documents available official assets. Active
asset families are in `src/assets/branding/`, `ai/`, `special-screens/`, and
`decorations/`.

`AdaptiveAssetImage` prefers active WebM only when motion and visibility permit;
it retains static fallback and reserved geometry.

Do not generate replacement assets unless the task expressly authorizes it.

## Styles

- `src/styles/global.css`: legacy/global baseline; inspect only direct selectors.
- `src/styles/official-assets.css`: official asset constraints and CyberAI fix.
- `src/v2/reference-dashboard.css`: Dashboard plus V2 shared shell styling.
- `src/v2/threat-map-reference.css`: Threat Map screen styling.
- `src/v2/special-screens.css`: Boot, DDoS and Offline styling.

Screen-specific rules stay in their V2 CSS file. Avoid global zoom and global
scale transforms.

## Visual testing

Official target PNGs: `Cyb3r_Soc_References_1to1/`.

Current, repeat, diff and metrics paths are respectively:

- `tests/visual/current/`
- `tests/visual/repeat/`
- `tests/visual/diffs/`
- `tests/visual/diffs/metrics.json`

`scripts/capture-visuals.mjs` captures all named routes deterministically at
1672 × 941, checks repeatability, and writes per-screen comparison metrics.

`tests/visual/cyb3r_soc.responsive.spec.ts` covers mobile/tablet dimensions,
interaction paths, boot-once behavior, mitigation pause/cancel, and overflow.

`tests/visual/performance.audit.spec.ts` checks key screens under simulated
110%, 125%, and 150% zoom without runtime source changes.

Never change targets or thresholds simply to obtain a passing visual result.

## Legacy

`src/components/layout/*` and `src/components/loaders/Loaders.tsx` remain
legacy-isolated: no active V2 route imports them. Do not migrate, refactor, or
inspect them unless an explicit task or direct runtime dependency requires it.

## Generated outputs

`dist/`, `node_modules/`, `.npm-cache/`, `test-results/`,
`playwright-report/`, and visual current/repeat/diff output are generated or
diagnostic material, not application source.

`.gitignore` intentionally excludes current visual captures and the official
reference directory from accidental staging in this checkout. The reference
directory remains the local visual source of truth and must not be changed.

ZIP archives are delivery artifacts; do not modify or delete them without a
task that expressly requests it.

## Important dependencies

- React + React Router: screen composition and routes.
- Zustand: SOC state and simulation/mitigation state.
- react-simple-maps + world-atlas: map geometry.
- lucide-react: interface icons.
- styled-components: `ExactBackground` only.
- Playwright: deterministic visual, responsive and performance checks.

## State and fixtures

`src/app/store/useSOCStore.ts` holds shared SOC status, attacks and mutation
actions used by routes. Read it only when a target screen's displayed data or
interaction is demonstrably incorrect.

`src/data/fixtures/dashboard.fixture.ts` supplies Dashboard metrics.
`src/data/fixtures/mitigation.fixture.ts` supplies deterministic mitigation
progress. Fixture changes are data changes, not layout fixes; do not inspect or
modify them for ordinary geometry work.

## Animation boundary

`useAnimationActivity.ts` gates animated assets by viewport, document
visibility, and reduced-motion preference. `official-assets.css` contains the
asset-level overrides that prevent external legacy selectors from affecting
asset containers.

For visual convergence, prefer changing static geometry or screen-specific
surface styling first. Open motion code only when the mismatch is motion or a
runtime stability issue.

## Capture order

1. Use the route and numbered image belonging to the requested screen.
2. Read its matching metric entry instead of every metric.
3. Read the diff only to localize dominant regions.
4. Capture that same screen after an evidence-based patch.
5. Do not regenerate the other four screens unless the modified dependency is
   shared and evidence warrants regression coverage.

## Tooling boundary

Project rules live in root `AGENTS.md`; V2 routing lives in `src/v2/AGENTS.md`.
The global `cybersoc-visual-convergence` skill applies the one-screen visual
workflow. Token-saviour chooses savings strategy when applicable. RTK reduces
noisy command output only; it never authorizes broader source inspection.

Do not add Serena, Ponytail, Caveman, or other code-reading/authoring tools
without an explicit phase or request that evaluates them.

## Efficient task routing

For a named screen, use `src/v2/AGENTS.md`, then open its two primary files.
Read only that screen's target/current/diff/metric. Follow imports or selectors
only when a direct relationship or failing check proves the need. Stop once the
evidence supports the smallest correct patch and proportional validation.

## Strict scope template

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
