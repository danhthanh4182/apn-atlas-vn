# Feature Specification: Web & Native Accessibility (A11y) Overhaul

**Feature Branch**: `002-a11y-improvements`  
**Created**: 2026-11-06  
**Status**: Ready for Plan  
**Input**: "Cải thiện accessibility cả web và app"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Screen Reader Navigation & Live Announcements (Priority: P1)

A visually impaired user navigating via screen reader (TalkBack on Android, VoiceOver on iOS/macOS, NVDA/JAWS on Windows) must understand the full structure of the app, receive clear announcements when search results or filters change, and hear the active platform (Android vs iPhone) without disorientation.

**Why this priority**: Screen reader users must be able to discover, search, filter, and inspect Vietnamese APN settings independently and confidently.

**Independent Test**:
- Use screen reader (or CDP accessibility tree snapshots).
- Type in search input: screen reader announces matching carrier count (e.g. "Tìm thấy 3 nhà mạng").
- Switch filter chips (Mạng vật lý, Mạng ảo): announces active filter and result count.
- Switch platform (Android / iPhone): announces active platform.
- Open detail: focus lands on dialog title or close button, announces carrier name and verification status.

**Acceptance Scenarios**:
1. **Given** the library view is displayed, **When** the user types "viettel" into `#search`, **Then** an `aria-live="polite"` region announces the updated count ("Tìm thấy 1 nhà mạng").
2. **Given** a screen reader is focused on the platform switch, **When** the user activates "iPhone", **Then** the group announces "Đã chọn nền tảng iPhone" and card APN chips update accessibly.
3. **Given** any modal dialog (detail, editor, backup) is opened, **When** screen reader navigates, **Then** focus is strictly contained within the modal and background content is `aria-hidden="true"` or inert.

---

### User Story 2 - Keyboard Navigation & Skip Links (Priority: P1)

A motor-impaired or keyboard-only user must be able to bypass topbar and sidebar navigation via a skip link, navigate cards efficiently, and maintain logical focus order across all views without any keyboard traps.

**Why this priority**: Keyboard accessibility is the foundation for assistive technologies, switch controls, and power users.

**Independent Test**:
- Press Tab upon page load: a visible "Chuyển đến nội dung chính" skip link appears as the first focusable element.
- Pressing Enter on the skip link moves focus directly to `#libraryHeading` or `#search`.
- Tabbing through carrier cards allows activating with Space/Enter.
- Escape closes any open modal and returns focus to the exact triggering element.

**Acceptance Scenarios**:
1. **Given** initial page load, **When** Tab is pressed, **Then** `#skipLink` becomes visible with clear focus styling and links to `#mainContent`.
2. **Given** focus is inside an open detail modal, **When** Escape is pressed, **Then** the modal closes and focus returns to the card's open button.
3. **Given** high-contrast keyboard mode, **When** any control receives focus, **Then** an explicit high-contrast focus outline (`2px solid var(--lime)` with `outline-offset: 3px`) is visible.

---

### User Story 3 - Touch Target Sizing & Spacing for Motor Accessibility (Priority: P2)

Users with motor tremors, reduced dexterity, or using one-handed mobile devices must have generous, accessible hit targets across all interactive controls (minimum 44×44 CSS px for primary mobile actions, and at least 24×24 px on desktop with sufficient padding).

**Why this priority**: Prevents mis-taps and ensures mobile and tablet interfaces are easy to operate for all ages and abilities.

**Independent Test**:
- In mobile viewport (320px–390px), measure computed bounding boxes of all clickable buttons, tabs, chips, and close controls.
- Verify every interactive target has at least 44×44 px hit area.

**Acceptance Scenarios**:
1. **Given** viewport width ≤600px, **When** inspecting bookmark stars, platform tabs, close buttons, copy buttons, and filter chips, **Then** all bounding boxes measure ≥44px height and ≥44px width.
2. **Given** card open overlays, **When** tapping anywhere on the card body, **Then** the overlay activates the detail view without conflict with the bookmark button.

---

### User Story 4 - Contrast, Windows High Contrast Mode & Reduced Motion (Priority: P2)

Users with low vision or vestibular motion sensitivity must have legible contrast under all display settings, including Windows High Contrast (`forced-colors: active`), `prefers-contrast: more`, and `prefers-reduced-motion: reduce`.

**Why this priority**: Meets WCAG 2.2 Level AA and AAA contrast standards and ensures comfortable, seizure-safe experience for vestibular disorder sufferers.

**Independent Test**:
- Emulate `forced-colors: active`: verify borders, buttons, and text remain visible and distinguishable.
- Emulate `prefers-contrast: more`: verify text and borders receive enhanced contrast.
- Emulate `prefers-reduced-motion: reduce`: verify hero orbital motion, radar sweep, card stagger, and transitions are completely suppressed.

**Acceptance Scenarios**:
1. **Given** `forced-colors: active`, **When** the page renders, **Then** cards, buttons, and focus outlines use system semantic colors (`ButtonText`, `Highlight`, `CanvasText`).
2. **Given** `prefers-reduced-motion: reduce`, **When** page loads or view changes, **Then** zero transition delays or keyframe animations run.

---

## Edge Cases

- **Empty search results**: When a search query produces zero results, `#emptyState` must announce "Không tìm thấy cấu hình phù hợp" to assistive technology and provide a direct focusable action to clear search or create custom APN.
- **Custom profile deletion in modal**: When deleting the currently active profile from within the modal dialog, focus must cleanly fall back to `#search` or the next surviving card, never dropping to `<body>`.
- **Screen zoom up to 200% / 400%**: Layout must reflow into a single column without horizontal scrollbars, and modal action bars must stack cleanly without overlapping.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Page MUST provide a visible-on-focus skip link `<a href="#mainContent" class="skip-link">` as the first focusable element in DOM.
- **FR-002**: System MUST provide an `aria-live="polite"` live region (`#a11yStatus`) to announce dynamic state changes (search result counts, active filter selection, platform change, copy success).
- **FR-003**: All interactive controls MUST maintain a minimum touch target size of 44×44 px on mobile/touch viewports and at least 24×24 px on desktop.
- **FR-004**: All modal dialogs (detail, editor, backup) MUST trap keyboard Tab focus, close on Escape, restore focus to the opener upon close, and apply `aria-hidden="true"` / `inert` to background siblings while active.
- **FR-005**: All form inputs in the custom editor MUST explicitly link their error messages via `aria-describedby="formError"` and set `aria-invalid="true"` when validation fails.
- **FR-006**: Heading hierarchy MUST be strictly descending (`h1` -> `h2` -> `h3`) without skipping levels.
- **FR-007**: System MUST support `forced-colors: active` (Windows High Contrast Mode) with explicit `forced-color-adjust: none` or semantic system color variables on borders, focus rings, and selection indicators.
- **FR-008**: System MUST support `prefers-contrast: more` by increasing border opacity and text contrast on muted secondary labels.
- **FR-009**: System MUST strictly honor `prefers-reduced-motion: reduce` across all animations (hero motion, orbital rotation, card entrance, dialog transition, countUp).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse Accessibility audit score MUST remain **100 / 100** with **0** failed audits on both mobile and desktop viewports.
- **SC-002**: Automated axe-core scan MUST report **0 violations** across all rules (color-contrast, button-name, aria-roles, focus-order, heading-order).
- **SC-003**: 100% of user flows (browse, search, filter, open detail, copy APN, save, create custom APN, backup export/import) MUST be fully operable using keyboard only (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys).
- **SC-004**: At 200% text zoom and 320px viewport, `document.documentElement.scrollWidth` MUST be ≤ `document.documentElement.clientWidth` (zero horizontal overflow).
