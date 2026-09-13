# Cyb3r_Soc — Fast Visual Loop v2

Purpose: deterministic visual convergence with minimal agent context, browser churn and false baselines.

## Why v2 exists

`tests/visual/diffs/metrics.json` is generated output. A failed experimental capture can overwrite it even after the code patch is reverted. Therefore it must **not** be used as the acceptance baseline.

v2 stores accepted comparison baselines separately in:

```text
tests/visual/accepted-baselines.json
```

Only `visual:baseline` and a successful `visual:accept` write that file.

## One-time session setup

Keep Vite running in a separate terminal:

```powershell
npm run visual:dev
```

## First use for a screen

Run the normal check while the code is in a known-good/accepted state:

```powershell
npm run visual:boot
```

If no accepted baseline exists yet, it still captures the screen and prints for example:

```text
VISUAL: BOOT
STATUS: BASELINE_MISSING
CURRENT: 12.628%
ACTION: npm run visual:baseline -- boot --from-last
```

If that state is really the state you want to protect, seed it explicitly:

```powershell
npm run visual:baseline -- boot --from-last
```

This explicit step prevents a failed experimental metric from silently becoming the next baseline.

## Screen checks

```powershell
npm run visual:dashboard
npm run visual:boot
npm run visual:threat
npm run visual:ddos
npm run visual:offline
```

Each command:

1. verifies the existing Vite server;
2. captures only one screen through the existing deterministic capture script;
3. stores trial artifacts under the OS temp directory;
4. compares the trial to `accepted-baselines.json`;
5. prints only a compact decision.

Example:

```text
VISUAL: BOOT
BASELINE: 12.628%
CURRENT: 11.931%
DELTA: -0.697pp
RESULT: IMPROVED
CURRENT_FILE: <temp path>
```

## Cost-control policy

For each hypothesis:

1. exactly one focused edit;
2. exactly one visual check;
3. `REGRESSED` or `UNCHANGED` -> revert and STOP;
4. do not inspect screenshots, try alternatives or build after a failed hypothesis;
5. `IMPROVED` -> inspect at most one relevant screenshot if necessary;
6. perform only the justified cleanup;
7. run at most one second measurement;
8. accept the final improved cached trial;
9. build once, only for code that will remain.

Hard limit: two measurements per hypothesis.

## Accepting improvement without recapture

```powershell
npm run visual:accept -- boot
```

This command:

- refuses non-improvements;
- copies the already-captured trial into canonical `tests/visual/*` outputs;
- updates `metrics.json`;
- updates `accepted-baselines.json` to the newly accepted value;
- does not launch a browser.

## Baseline safety

Do not seed a baseline while an experimental patch is active.

Do not derive accepted baselines from `tests/visual/diffs/metrics.json` automatically. That file may reflect a rejected capture.

If you intentionally establish a new accepted state, run a fresh check on that state and explicitly use:

```powershell
npm run visual:baseline -- <screen> --from-last
```

## RTK policy

Do not wrap `visual:*` commands with RTK. Their output is already intentionally tiny.

Local measured results on this project:

```text
git status:     ~25.8% output reduction
git diff --stat: ~31.1% output reduction
```

That is useful for repeated Git inspection, but it is not a 25–31% reduction in total model usage. Use RTK selectively for noisy Git/search output:

```powershell
rtk git status
rtk git diff --stat
rtk git diff -- <file>
```

Prefer raw build/error output on Windows when diagnosing failures.
