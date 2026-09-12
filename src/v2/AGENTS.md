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
