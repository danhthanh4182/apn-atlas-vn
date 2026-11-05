# Implementation Plan: PageSpeed Insights 100/100 Performance Optimization

**Branch**: `003-perf-pagespeed-100` | **Date**: 2026-11-06 | **Spec**: [specs/003-perf-pagespeed-100/spec.md](spec.md)

## Summary

Deliver a surgical performance optimization to eliminate Cumulative Layout Shift (CLS), vendor self-hosted fonts, and remove all render-blocking network requests, driving PageSpeed Insights / Lighthouse performance to 100/100 across both mobile and desktop.

## Technical Context

- **Platform**: Vanilla ES modules, HTML5, CSS3, Service Worker.
- **Tools**: Lighthouse CLI 13.6.0, `sharp` for font/image inspection, Node test runner.
- **Constraints**: 100% offline-first, zero remote runtime dependencies, backwards compatible with Capacitor Android/iOS builds.

## Implementation Steps

### 1. Eliminate Headline Layout Shift (CLS)
- In `index.html`:
  Pre-render the two lines of `h1` directly in HTML:
  ```html
  <h1>
    <span class="hm-line"><span class="hm-in" style="--i:0">Một thư viện.</span></span>
    <span class="hm-line"><span class="hm-in" style="--i:1"><em>Mọi kết nối.</em></span></span>
  </h1>
  ```
- In `src/hero-motion.mjs`:
  In `splitLines(h1)`: check `if(h1.querySelector('.hm-line')) return;` so it avoids wiping `h1.textContent = ''` when the lines are already statically marked up.
- In `styles.css`:
  Ensure `.hm-line` and `.hm-in` have `contain: layout style;` to isolate subtrees from causing outer layout shifts.

### 2. Image Dimensions & Layout Containment
- In `src/logos.mjs`:
  Add `width="98" height="44"` to all `<img class="carrier-logo" ...>`.
- In `styles.css`:
  Declare `.carrier-avatar.has-logo { aspect-ratio: 98 / 44; contain: paint layout; }` so the image box size is known immediately before the PNG image bytes are decoded.
- Scope any initial grid min-height:
  Only on `#libraryView:not(.has-rendered) #carrierGrid` to prevent layout collapse on initial paint, removing it as soon as the first render completes so empty search states have no blank space.

### 3. Self-Host Be Vietnam Pro (Offline-First Typography)
- Download the 4 essential WOFF2 font files for `Be Vietnam Pro` (weights 400, 600, 700, 800) into `assets/fonts/`.
- In `styles.css`:
  Define local `@font-face` rules for `Be Vietnam Pro` pointing to `./assets/fonts/...` with `font-display: swap`.
- In `index.html`:
  Remove `<link rel="preconnect" href="https://fonts.googleapis.com">` and the Google Fonts stylesheet link.
  Add local font preload: `<link rel="preload" href="./assets/fonts/be-vietnam-pro-700.woff2" as="font" type="font/woff2" crossorigin>`.
- In `sw.js`:
  Add the font paths to `CORE` precache list and bump `CACHE` to `'apn-atlas-vn-v1.7-perf-100'`.

### 4. Build Scripts & Cache Sync
- Update `scripts/prepare-site.mjs` and `scripts/prepare-web.mjs` to ensure `assets/fonts/` is copied into `site/` and `www/`.
- Update `tests/build.test.mjs` to assert local fonts are present in both distributions.

## Verification Matrix

1. `npm test`: all 16 tests pass.
2. Lighthouse Desktop: Performance **≥ 99** (target 100), CLS **< 0.01**.
3. Lighthouse Mobile: Performance **≥ 98** (target 100), CLS **0.00**.
4. Network Inspection: Zero requests to Google Fonts; all fonts load from `./assets/fonts/`.
5. Offline Mode: verify fonts and hero motion work in simulated offline environment.
