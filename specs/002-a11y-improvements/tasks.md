# Tasks: Web & Native Accessibility (A11y) Overhaul

**Input**: Design documents from `/specs/002-a11y-improvements/`  
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Setup & Landmarks

- [ ] T001 Add `<a href="#mainContent" class="skip-link" id="skipLink">Chuyển đến nội dung chính</a>` as first body child in `index.html`
- [ ] T002 Add `id="mainContent"` to `<main class="content">` and `tabindex="-1"` to allow programmatic focus in `index.html`
- [ ] T003 Add `<div id="a11yStatus" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>` for live screen reader feedback in `index.html`
- [ ] T004 Add CSS styling for `.skip-link` and `.sr-only` utility in `styles.css`

## Phase 2: User Story 1 — Screen Reader Announcements (P1)

- [ ] T005 Implement `announce(message)` helper in `src/app.mjs` to push debounced polite live announcements
- [ ] T006 Wire live announcements on search input in `src/app.mjs` ("Tìm thấy X nhà mạng" / "Không tìm thấy cấu hình phù hợp")
- [ ] T007 Wire live announcements on filter chip activation in `src/app.mjs` ("Đã lọc: [Tên nhóm], hiển thị X nhà mạng")
- [ ] T008 Wire live announcements on platform switch in `src/app.mjs` ("Đã chọn nền tảng [Android / iPhone]")
- [ ] T009 Wire live announcements on save/unsave actions in `src/app.mjs` ("Đã lưu [Tên]" / "Đã bỏ lưu [Tên]")

## Phase 3: User Story 2 — Keyboard Navigation & Focus Hardening (P1)

- [ ] T010 Implement arrow-key (Left, Right, Up, Down, Home, End) keyboard navigation across carrier card buttons in `#carrierGrid` in `src/app.mjs`
- [ ] T011 Fix modal deletion focus drop in `deleteCustom(id)` in `src/app.mjs`: when deleting custom profile from modal, restore focus to next surviving card or `#search`
- [ ] T012 Ensure skip link activation smoothly scrolls and focuses `#mainContent` without jumping in `src/app.mjs`

## Phase 4: User Story 3 — Touch Target Sizing (P2)

- [ ] T013 Verify and enforce minimum 44×44px bounding boxes for all interactive touch controls (`.chip`, `.platform-tab`, `.bookmark`, `.close-btn`, `.field-copy`, `.detail-icon-btn`) under `@media (max-width: 600px)` in `styles.css`

## Phase 5: User Story 4 — High Contrast & Display Modes (P2)

- [ ] T014 Add `@media (forced-colors: active)` rules for Windows High Contrast Mode in `styles.css` (`ButtonBorder`, `Highlight`, `CanvasText`)
- [ ] T015 Add `@media (prefers-contrast: more)` rules in `styles.css` elevating border contrast and secondary text contrast
- [ ] T016 Verify strict `@media (prefers-reduced-motion: reduce)` suppression of all animations and transitions

## Phase 6: Automated Tests & Verification

- [ ] T017 Create `tests/a11y.test.mjs` testing landmarks, skip link, icon button accessible names, SVG decorative attributes, and heading order
- [ ] T018 Run `npm test` and verify all tests pass
- [ ] T019 Run Lighthouse Accessibility Audit and axe-core scan in browser, verifying 100/100 score and 0 violations
- [ ] T020 Run production builds (`npm run build:site` and `npm run build:web`)
