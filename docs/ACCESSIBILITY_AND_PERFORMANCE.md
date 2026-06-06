# Accessibility & Performance Audit

A before/after review of the TicketLedger web client across the modernization.

> **Method note:** this is a **manual/heuristic** audit based on the code and
> build output. It is _not_ an automated Lighthouse/axe run — there is no
> headless browser in the build environment. For quantitative scores, run
> `npx lighthouse http://localhost:3000` and an axe scan (axe-core is already in
> the dependency tree) against a running instance.

## Accessibility

| Area                | Before                                                  | After                                                                                  |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Status feedback     | `alert()` — blocking, modal, not screen-reader friendly | `aria-live="polite"` status region + `role="alert"` busy overlay                       |
| Keyboard focus      | Browser default only                                    | Explicit `:focus-visible` outline (3px), offset                                        |
| Bypass navigation   | None                                                    | "Skip to main content" skip link                                                       |
| Controls labelling  | Button text only ("Book Now")                           | Descriptive `aria-label` per event; toggle has `aria-pressed`                          |
| Semantics/landmarks | Mostly `<div>`; single `<header>`/`<main>`              | `header`/`main#main`/`section[aria-labelledby]`/`article`/`ul`>`li`, ordered `h1`→`h3` |
| Color contrast      | White on `#f44336` ≈ **3.99:1** (fails WCAG AA)         | White on `#c62828` ≈ **5.6:1** (light) / AA-compliant dark accent                      |
| Theming/preference  | Fixed dark gradient; no user control                    | Light/dark via `light-dark()`, defaults to OS pref, toggle persists                    |
| Motion              | No `prefers-reduced-motion` handling                    | Reduced-motion media query disables transitions/animations                             |
| Oversized text      | Loading message at **100px** (overflow)                 | 1.5rem                                                                                 |
| Language            | `lang="en"` present ✅                                  | Retained                                                                               |

**Recommended next checks:** run axe on the connected + disconnected states;
verify the third-party `WalletSelector` modal's focus trap and labelling (it is
vendor-controlled); confirm contrast of muted text in both themes with a tool.

## Performance

| Metric (production build) | Before (baseline) | After            | Notes                                 |
| ------------------------- | ----------------- | ---------------- | ------------------------------------- |
| Main JS chunk             | ~1.85 MB          | ~1.91 MB         | Dominated by the Aptos SDK + adapters |
| Main JS gzipped           | ~830 KB           | ~848 KB          | Effectively unchanged                 |
| CSS                       | ~5 KB             | ~6 KB            | Theme tokens added                    |
| Runtime deps shipped      | included `dotenv` | `dotenv` removed | One dead dep dropped                  |

The overhaul intentionally **avoided a regression**: the Aptos `ts-sdk`
1.33→1.39 bump tripled the bundle to **5.74 MB** (1.52 MB gz) for no functional
gain, so it was reverted (see CHANGELOG).

### Performance recommendations (tracked, not yet done)

1. **Code-split the wallet UI / SDK** with dynamic `import()` so the heavy
   Aptos bundle isn't fully on the critical path.
2. Configure `build.rollupOptions.output.manualChunks` to separate vendor code
   for better caching.
3. Re-evaluate the Aptos SDK major upgrade (v7) _with bundle analysis_ before
   adopting it.
4. Add a bundle-size budget check to CI (e.g. `size-limit`).
