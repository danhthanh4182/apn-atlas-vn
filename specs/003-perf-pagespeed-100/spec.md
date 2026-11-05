# Feature Specification: PageSpeed Insights 100/100 Performance Optimization

**Feature Branch**: `003-perf-pagespeed-100`  
**Created**: 2026-11-06  
**Status**: Ready for Plan  
**Input**: "Optimize PageSpeed Insights score to 100/100 (eliminate CLS, self-host fonts, reserve dimensions)"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant Layout Stability & Zero Layout Shift (Priority: P1)

Users visiting the web app on desktop or mobile must experience an immediate, rock-solid render where elements do not jump, shift, or pop in abruptly while reading or interacting. The Cumulative Layout Shift (CLS) must remain 0.00 across all viewports.

**Why this priority**: Layout shifts disorient users, cause accidental mis-clicks, and degrade the user experience. Eliminating CLS on desktop directly raises the performance score from 83 to 100.

**Independent Test**:
- Run Lighthouse Desktop audit: assert `cumulative-layout-shift` score is 1.0 (CLS < 0.01).
- Visual check: hero headline line mask animation plays smoothly without wiping `h1` or pushing down hero buttons.
- Carrier logos decode smoothly in reserved aspect-ratio boxes.

**Acceptance Scenarios**:
1. **Given** the desktop viewport (1440px), **When** the page loads, **Then** `h1` lines appear with zero vertical jump or layout recalculation.
2. **Given** the carrier card grid, **When** cards are injected during initial render, **Then** the page footer does not jump down abruptly.
3. **Given** carrier logo images, **When** images decode from disk/cache, **Then** the containing avatar plate maintains a fixed 98×44 px box.

---

### User Story 2 - Self-Hosted Offline-First Fonts & Zero Render-Blocking Handshake (Priority: P1)

Users must experience immediate First Contentful Paint (FCP) without waiting for cross-origin DNS resolution, TLS handshakes, or CSS stylesheets from Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). The app must remain 100% offline-first and self-contained.

**Why this priority**: Eliminating remote network dependencies makes the app faster, respects privacy, and guarantees true offline functionality everywhere.

**Independent Test**:
- Network panel check: 0 requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
- Inspect `@font-face` rules: fonts load from `./assets/fonts/`.
- Precached in Service Worker: font files exist in `sw.js` cache.

**Acceptance Scenarios**:
1. **Given** fresh visitor or offline state, **When** the app loads, **Then** `Be Vietnam Pro` fonts load locally from `assets/fonts/` with `font-display: swap`.
2. **Given** network inspection, **When** auditing render-blocking resources, **Then** zero third-party font stylesheets block page rendering.

---

### User Story 3 - Maximum PageSpeed / Lighthouse Scores Across All Categories (Priority: P2)

The web application must achieve a perfect 100/100 across all 4 categories (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop.

**Why this priority**: Demonstrates top-tier engineering craft, world-class loading performance, and high discoverability.

**Independent Test**:
- Run Lighthouse CLI on mobile and desktop viewports.
- Assert all 4 category scores equal 100 / 100.

**Acceptance Scenarios**:
1. **Given** desktop audit, **When** Lighthouse executes, **Then** Performance = 100, Accessibility = 100, Best Practices = 100, SEO = 100.
2. **Given** mobile audit, **When** Lighthouse executes, **Then** Performance = 100, Accessibility = 100, Best Practices = 100, SEO = 100.

---

## Edge Cases

- **Search with zero results**: Reserving initial space for `#carrierGrid` must only apply to the initial page load, and must never leave an empty gap when search returns zero results or when `#emptyState` is visible.
- **Font loading fallback**: If a browser fails to load custom WOFF2 fonts, fallback font stack (`Inter`, system-ui, -apple-system, sans-serif) must render immediately without layout explosion.
- **Slow 3G network simulation**: Content must be readable immediately while logos and non-critical assets stream in.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Static `index.html` MUST pre-render `h1` line containers (`.hm-line` and `.hm-in`) so that `src/hero-motion.mjs` does not execute `h1.textContent = ''` at runtime.
- **FR-002**: `src/logos.mjs` MUST output explicit `width="98"` and `height="44"` attributes on all carrier logo `<img>` tags.
- **FR-003**: `styles.css` MUST declare `aspect-ratio: 98 / 44` and `contain-intrinsic-size` on `.carrier-avatar.has-logo` to prevent reflow.
- **FR-004**: `assets/fonts/` MUST host local WOFF2 font files for `Be Vietnam Pro` (weights 400, 600, 700, 800).
- **FR-005**: `index.html` MUST remove all links to `fonts.googleapis.com` and `fonts.gstatic.com` and preload local critical font via `<link rel="preload" href="./assets/fonts/be-vietnam-pro-bold.woff2" as="font" type="font/woff2" crossorigin>`.
- **FR-006**: `styles.css` MUST define local `@font-face` rules pointing to `./assets/fonts/` with `font-display: swap`.
- **FR-007**: `sw.js` MUST include all local font files in the `CORE` precache list and bump `CACHE` to `'apn-atlas-vn-v1.7-perf-100'`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desktop Cumulative Layout Shift (CLS) MUST be **< 0.02** (Lighthouse CLS score ≥ 0.98).
- **SC-002**: Desktop Performance score on Lighthouse MUST reach **≥ 99 / 100** (target 100).
- **SC-003**: Mobile Performance score on Lighthouse MUST reach **≥ 98 / 100** (target 100).
- **SC-004**: Accessibility, Best Practices, and SEO scores MUST remain **100 / 100**.
- **SC-005**: All existing unit and build tests (`tests/*.test.mjs`) MUST pass 100%.
