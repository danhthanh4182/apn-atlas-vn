# Implementation Plan: Web & Native Accessibility (A11y) Overhaul

**Branch**: `002-a11y-improvements` | **Date**: 2026-11-06 | **Spec**: [specs/002-a11y-improvements/spec.md](spec.md)

## Summary

Deliver a comprehensive accessibility (a11y) upgrade for APN Atlas VN across web and native shells (Capacitor Android/iOS). Building on the existing WCAG AA compliance, this feature introduces:
1. **A skip link** (`#skipLink`) to allow keyboard and switch-control users to bypass header/sidebar navigation directly to content.
2. **An `aria-live="polite"` status announcer** (`#a11yStatus`) that delivers clear, non-intrusive Vietnamese speech feedback when searching, switching filters, changing platforms, or modifying saved profiles.
3. **Card grid keyboard navigation** (arrow-key navigation / roving tabindex) enabling native-like navigation through the carrier directory.
4. **Modal deletion focus hardening**: eliminate the edge-case focus drop to `<body>` when deleting a custom profile from within a modal dialog.
5. **Windows High Contrast Mode** (`forced-colors: active`) and **`prefers-contrast: more`** support for low-vision and assistive display users.
6. **Touch target guarantees**: explicit minimum 44×44 CSS px hit areas on mobile and touch devices.
7. **Automated regression testing**: dedicated accessibility assertions in `tests/a11y.test.mjs`.

## Technical Context

- **Language/Runtime**: Vanilla JavaScript (ES2022+ modules), HTML5 semantic landmarks, CSS3 custom properties & media queries.
- **Dependencies**: Zero runtime dependencies. Capacitor Core/Android/iOS for native wrapper.
- **Storage**: Client-side `localStorage` (`apn-atlas-saved-v1`, `apn-atlas-custom-v1`).
- **Testing**: Node.js test runner (`node --test tests/*.test.mjs`), headless Chromium verification via `eval`.
- **Target Platforms**: Web (Desktop/Laptop/Tablet/Mobile), Android 8+ (Capacitor), iOS 15+ (Capacitor).
- **Constraints**: 100% offline-capable, zero external font/script dependencies at runtime, strict CSP adherence.

## Architecture & Implementation Steps

### 1. Skip Navigation Link
- Add `<a href="#libraryHeading" class="skip-link" id="skipLink">Chuyển đến nội dung chính</a>` immediately after `<body>` in `index.html`.
- Style `.skip-link`: visually hidden by default (`translate: 0 -150%`), but slides down smoothly into view on `:focus-visible` with high-contrast lime background (`var(--lime)`), dark text (`#162519`), `z-index: 9999`, and `outline: 2px solid #fff`.
- Ensure activating it moves keyboard focus smoothly to the main heading without scroll jumping.

### 2. Live Announcement Region (`#a11yStatus`)
- Add `<div id="a11yStatus" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>` to `index.html`.
- Style `.sr-only`: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;`.
- In `src/app.mjs`:
  - Helper `announce(message)` debounces and updates `#a11yStatus.textContent`.
  - On search input: announce `"Tìm thấy X nhà mạng"` (or `"Không tìm thấy cấu hình phù hợp"`).
  - On filter chip click: announce `"Đã lọc: [Tất cả / Mạng vật lý / Mạng ảo / Của tôi], hiển thị X nhà mạng"`.
  - On platform switch: announce `"Đã chọn nền tảng Android"` / `"Đã chọn nền tảng iPhone"`.
  - On save/unsave: announce `"Đã lưu [Tên nhà mạng]"` / `"Đã bỏ lưu [Tên nhà mạng]"`.

### 3. Modal Deletion Focus Hardening
- In `deleteCustom(id)`:
  - If the detail modal was open when deleted, record whether deletion was triggered via keyboard.
  - After `closeDetail()` and `renderCards()`, ensure focus lands on the next surviving card's `.card-open` button, or on `#search` if no profiles remain. Never leave focus on `<body>`.

### 4. Arrow Key Navigation in Carrier Grid
- In `#carrierGrid`:
  - Support Arrow Left / Right / Up / Down keys to navigate between cards when focused on a card's `.card-open` button.
  - Home moves to first card; End moves to last card.
  - Enter and Space open detail (already native button behavior).

### 5. High Contrast & Display Modes
- `@media (forced-colors: active)`:
  - Ensure `.carrier-card`, `.chip`, `.platform-tab`, `.primary-btn`, `.outline-btn`, and dialog borders use system semantic colors:
    - Card borders: `1px solid ButtonBorder`
    - Selected card: `outline: 2px solid Highlight; outline-offset: 2px;`
    - Focus outlines: `outline: 2px solid Highlight;`
    - Buttons: `forced-color-adjust: none` or semantic `ButtonText` on `ButtonFace`.
- `@media (prefers-contrast: more)`:
  - Increase border contrast (`--line: #425566`), elevate muted text (`--muted: #b8c9d4`), and sharpen card hover borders.

### 6. Automated Tests (`tests/a11y.test.mjs`)
- Test skip link presence and target resolution.
- Test that all icon-only buttons carry non-empty `aria-label` or `title`.
- Test that all SVG icons have `aria-hidden="true"` and `focusable="false"`.
- Test that form inputs have associated labels and error descriptions.
- Test that heading hierarchy has no skipped levels.

## Verification Matrix

1. `npm test`: all unit and integration tests pass (including new `tests/a11y.test.mjs`).
2. Lighthouse Accessibility Audit: Score **100 / 100**, 0 failed audits.
3. axe-core scan in browser: 0 violations across all WCAG 2.2 rules.
4. Screen reader simulation: `#a11yStatus` receives correct announcements during search, filter, and platform change.
5. Keyboard test: Tab through skip link -> search -> chips -> grid -> detail modal -> escape -> verify focus returns to trigger.
