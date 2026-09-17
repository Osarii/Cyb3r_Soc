# V2 screen routing

Use this map before opening source. Inspect only the target screen and direct
dependencies unless a regression, import, selector, or failing test requires more.

| Screen | Primary React | Primary CSS | Direct dependencies when needed |
| --- | --- | --- | --- |
| Dashboard | `DashboardReference.tsx` | `reference-dashboard.css` | `referenceExact/ExactAttackSwitch`, `brand/*`, `ai/CyberAI` |
| Boot | `SpecialScreens.tsx` (`InitialBootScreenV2`) | `special-screens.css` | `brand/Cyb3r_SocLogo`, `referenceExact/ExactBackground` |
| Threat Map | `ThreatMapReference.tsx` | `threat-map-reference.css` | `DashboardReference` shell, `components/map/ThreatMap` only if evidence requires it |
| DDoS | `SpecialScreens.tsx` (`DDoSMitigationScreenV2`) | `special-screens.css` | `special-screens/DDoSInterceptor`, mitigation fixture |
| Offline | `SpecialScreens.tsx` (`ServerUnavailableV2`) | `special-screens.css` | `special-screens/ServerStatusCube`, `brand/Cyb3r_SocLogo` |

## Current Agent Workflow

### Integration policy
- Codex only implements/integrates changes.
- Do not run validation unless explicitly requested.
- Do not run `npm run build`, React Doctor, tests, browser validation, Playwright, or visual diffs by default.
- The user performs validation after Codex finishes.
- Never run `git add .`, commit, push, or stage files unless explicitly requested.

### Serena
- Use Serena for semantic code navigation on medium/complex tasks.
- Prefer symbol-level tools such as:
  - `get_symbols_overview`
  - `find_symbol`
  - `find_declaration`
  - `find_referencing_symbols`
  - `find_implementations`
- Use Serena when tracing stores, callbacks, state, component relationships, routes, or data flow.
- Do not use Serena for simple CSS, assets, paths, or trivial textual changes.
- If a task explicitly requires Serena and Serena is unavailable, stop. Do not silently replace it with textual search.

### RTK
- RTK executable:
  `C:\Users\jgarc\.local\bin\rtk.exe`
- Use RTK only when terminal output would otherwise be large or noisy.
- Do not use RTK unnecessarily for small commands.
- RTK does not replace Serena for semantic code understanding.

### Ponytail
- Follow Ponytail principles:
  - reuse existing code before creating new abstractions
  - prefer the smallest working change
  - avoid speculative abstractions
  - avoid unnecessary files/components/helpers
  - preserve existing architecture unless change is necessary
  - minimize diff size without sacrificing correctness

### CYBER_SOC project rules
- Preserve the existing CYBER_SOC visual language and architecture.
- Reuse the existing store/data flow instead of creating duplicate sources of truth.
- Do not redesign stable screens unless explicitly requested.
- Avoid document-level scrolling in primary desktop/fullscreen views.
- Do not use CSS `zoom` or `transform: scale()` as layout fixes.

### Sensitive/stable areas
- Do not modify `EntrySystemShader.tsx` unless the task explicitly requires it.
- Do not modify `InteractiveNeuralVortexBackground.tsx` unless explicitly required.
- Entry/Boot lifecycle is considered stable.
- Do not refactor shaders merely to satisfy `react-doctor/no-giant-component`.

### React Doctor status
- Current full-project React Doctor baseline: 95/100.
- Remaining `no-giant-component` warnings are accepted technical debt for now.
- Do not pursue 100/100 unless explicitly requested.

### Output discipline
- Keep agent responses concise.
- After integration report:
  1. what changed
  2. files created
  3. files modified
  4. relevant limitations
- Do not spend tokens describing validation that was not run.
## Screen workflow

1. Read the target screen's mapped React and CSS first.
2. Compare only its target/current/diff/metric artifacts.
3. Open a direct dependency only when evidence requires it.
4. Make the smallest evidence-based patch.
5. Capture and measure the same screen again.
6. Run proportional validation.

Do not inspect other V2 screens, legacy files, or the full repository merely to
be thorough. Do not modify official reference PNGs or visual thresholds.

## Visual artifact routing

For every screen, use the matching numbered artifact:

| Screen | Target / current |
| --- | --- |
| Dashboard | `01-dashboard.png` |
| Boot | `02-boot-screen.png` |
| Threat Map | `03-threat-map.png` |
| DDoS | `04-ddos-mitigation.png` |
| Offline | `05-server-offline.png` |

Targets are in `Cyb3r_Soc_References_1to1/`; current images are in
`tests/visual/current/`; diffs and metrics are in `tests/visual/diffs/`.
Do not read unrelated generated captures.

## Shared shell boundary

`ReferenceShell` is shared by Dashboard, Threat Map, and framed application
routes. Treat its sidebar, topbar, background, offsets, and CyberAI placement
as a direct dependency only when the mismatch touches those elements.

Boot, DDoS and Offline use their own full-screen V2 shell in `SpecialScreens`.
Do not change the shared Dashboard shell to solve their visual differences.

## Desktop viewport rule

When adapting a primary V2 desktop screen, keep its `ReferenceShell` content
within the available `100dvh` viewport. Preserve the shared sidebar and
topbar, distribute page rows with `min-height: 0` and `minmax(0, 1fr)`, and
avoid visible scrollbars in primary panels. Prefer compact summaries, tabs, or
“Ver todos” routes for long collections. Apply this per screen; do not impose
a dashboard layout on other routes.

## Validation selection

- Local CSS detail: build plus that screen capture.
- Geometry or breakpoint change: add `npm.cmd run test:responsive`.
- Shared shell or asset behavior: validate every direct V2 consumer affected.
- Before declaring a visual phase PASS: rerun the relevant deterministic capture
  and compare the recorded metric before and after.

## Invariants

- Preserve `prefers-reduced-motion` behavior.
- Preserve the CyberAI asset-specific jitter override.
- Do not use global `zoom` or a global scaling transform.
- Stop if the next patch is not supported by an observable mismatch.
