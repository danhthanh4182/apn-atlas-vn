# Tasks: PageSpeed Insights 100/100 Performance Optimization

**Input**: Design documents from `/specs/003-perf-pagespeed-100/`  
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Self-Host Fonts & Offline Precache

- [ ] T001 Download `Be Vietnam Pro` WOFF2 files (400, 600, 700, 800) into `assets/fonts/`
- [ ] T002 Add `@font-face` rules for `Be Vietnam Pro` pointing to `./assets/fonts/` in `styles.css`
- [ ] T003 Remove Google Fonts links and add local font preload in `index.html`
- [ ] T004 Add local font paths to `sw.js` `CORE` array and bump `CACHE` to `apn-atlas-vn-v1.7-perf-100`

## Phase 2: Eliminate Layout Shift (CLS)

- [ ] T005 Pre-render `h1` line containers (`.hm-line` and `.hm-in`) directly in `index.html`
- [ ] T006 Update `splitLines(h1)` in `src/hero-motion.mjs` to bypass DOM rewriting when lines are pre-rendered
- [ ] T007 Add explicit `width="98" height="44"` on all carrier logo `<img>` tags in `src/logos.mjs`
- [ ] T008 Add `aspect-ratio: 98 / 44; contain: paint layout;` to `.carrier-avatar.has-logo` in `styles.css`
- [ ] T009 Scope initial grid min-height to `#libraryView:not(.has-rendered) #carrierGrid` and toggle class after initial render in `src/app.mjs`

## Phase 3: Build Pipeline & Automated Tests

- [ ] T010 Update `tests/build.test.mjs` to assert `assets/fonts/` is copied to `site/` and `www/`
- [ ] T011 Run `npm test` and rebuild `site/` and `www/`

## Phase 4: Verification & Performance Audit

- [ ] T012 Run Lighthouse Desktop audit and verify Performance score ≥ 99 (target 100) and CLS < 0.01
- [ ] T013 Run Lighthouse Mobile audit and verify Performance score ≥ 98 (target 100) and CLS 0.00
- [ ] T014 Run network traffic audit in browser confirming zero external font requests
