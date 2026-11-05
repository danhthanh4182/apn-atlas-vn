# Feature Specification: Design System UI/UX & Motion Refresh

**Feature Branch**: N/A (no branch hook configured; spec directory `specs/001-ui-ux-motion-refresh`)

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "Hãy cải tiến UI/UX, motion theo design system sau" with the design-system export `APN Atlas VN — Design System (Web + App).html` and its eight reference images, plus the correction: carrier logos are those crawled into the repository per `assets/carriers/README.md`, never loaded from the internet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and find a carrier at any screen size (Priority: P1)

A visitor opens APN Atlas on a phone, tablet, or desktop and immediately understands the library, finds their carrier, sees whether its APN is verified, and opens it.

**Why this priority**: Searching the library is the primary task and the entry point for every other flow. A complete, self-sufficient redesign of this surface alone already delivers the visual and responsive upgrade.

**Independent Test**: Load the app at 1440, 1024, 768, 600 and 390 screen widths, and in the installed app at tablet and phone sizes, then search and filter for a carrier. The shell, hierarchy, cards, statuses, and navigation must match the design system at each size without using any other screen.

**Acceptance Scenarios**:

1. **Given** a desktop viewport of at least 1251 px, **When** the library opens, **Then** a 260 px sidebar, a hero with the Vietnamese headline "Một thư viện. Mọi kết nối.", the four statistics, and a three-column card grid (maximum content width 1460 px) are shown.
2. **Given** a web viewport between 601 and 1250 px, **When** the library opens, **Then** the sidebar narrows to 226 px, collapses to a 72 px icon rail at 880 px and below, and the cards remain in two columns.
3. **Given** a web viewport of 600 px or less, **When** the library opens, **Then** a bottom tab bar with four destinations and a central create action replaces the sidebar, the grid becomes one column, statistics become a 2×2 block, and every touch target is at least 44 px.
4. **Given** the installed app at 744 pt or wider, **When** the library opens, **Then** an 84 pt rail, a 320 pt carrier list, and a detail pane are visible together; selecting a list item updates the detail pane without leaving the list.
5. **Given** the installed app below 744 pt, **When** the library opens, **Then** a four-item bottom tab bar, one-column list, 20 pt gutters, safe-area insets, and touch targets of at least 48 pt are used.
6. **Given** a search query or kind filter, **When** results change, **Then** each card shows the carrier mark (locally bundled logo or monogram), carrier name, network type and prefix, the APN for the selected platform, exactly one accurate status, and a detail affordance.
7. **Given** a keyboard or screen-reader user, **When** they traverse the library, **Then** navigation, search, filters, platform switch, and every card are reachable, labelled, and operable without a pointer.

---

### User Story 2 - Inspect and copy APN values with confidence (Priority: P2)

A user opens a carrier and can verify the source and status, read the correct values for their phone platform, copy one field or all fields, and save the profile locally.

**Why this priority**: Copying the correct APN is the moment the product delivers value; the detail experience must be trustworthy before motion polish matters.

**Independent Test**: Open a verified carrier and a reference-only carrier, switch between Android and iPhone, copy a field, copy all values, save and unsave, and expand advanced settings. No other screen is required.

**Acceptance Scenarios**:

1. **Given** a verified carrier, **When** its detail opens, **Then** the carrier name, network type, status, source, reviewed date, and platform-specific values are visible, with per-field copy actions for populated values and a primary "Sao chép tất cả" action.
2. **Given** a reference or unverified carrier, **When** its detail opens, **Then** the status is labelled "Cần kiểm tra" with the reference color and an explicit warning, and no verified styling is applied.
3. **Given** an iPhone with an automatically configured APN, **When** the user selects iPhone, **Then** no APN value is presented for copying and the screen explains that the APN is automatic.
4. **Given** a carrier with additional parameters, **When** the user activates "Thông số nâng cao", **Then** the extra values expand in place, remain keyboard operable, and collapse without losing the current scroll position.
5. **Given** the installed app at tablet size, **When** the user selects different carriers in the list, **Then** the detail pane updates on the same screen and keeps the selected item visible.
6. **Given** a long carrier name or APN value at 320 px width, **When** the detail renders, **Then** values wrap or truncate accessibly and copy actions remain reachable.

---

### User Story 3 - Experience responsive, restrained motion (Priority: P3)

A user feels that the interface responds immediately, that transitions explain where content came from, and that no animation gets in the way of their task.

**Why this priority**: Motion is part of the design identity, but only after the screens are correct and usable; it is also independently switchable through the reduce-motion preference.

**Independent Test**: Hover and press cards and buttons, switch views, open and close detail, and enable the operating system reduce-motion setting. Timing and feedback can be observed without changing any data.

**Acceptance Scenarios**:

1. **Given** a pointer device, **When** the user hovers a card or button, **Then** visual feedback appears within 180 ms.
2. **Given** the library is revealed or its results change, **When** cards enter, **Then** each card completes its entrance within 300 ms with a 45 ms stagger capped at 12 cards.
3. **Given** the user switches views or opens a detail surface, **When** the transition runs, **Then** it completes within 450 ms using the approved ease-out, and interactive controls remain responsive throughout.
4. **Given** the user presses, selects, or saves, **When** feedback is shown, **Then** the approved spring motion may be used without shifting surrounding layout.
5. **Given** the operating system reduce-motion preference is enabled, **When** any screen changes state, **Then** non-essential motion is disabled, state changes are immediate, and no functionality is lost.

---

### User Story 4 - Manage saved profiles, custom profiles, and backups in the refreshed system (Priority: P4)

A user can save carriers, create and edit a personal profile, import or export a backup, and read setup guidance, all with the same visual language and without data loss.

**Why this priority**: These flows are less frequent but must not look or behave like a separate product after the redesign; their existing data rules remain contractual.

**Independent Test**: Save a carrier, create and edit a custom profile, export and re-import a backup, open the guide, and trigger a validation error. All flows remain usable offline.

**Acceptance Scenarios**:

1. **Given** the saved view, **When** the user removes a saved carrier, **Then** the card disappears immediately, the saved count updates, and the change persists after reload.
2. **Given** the custom-profile form, **When** an invalid name, APN, MCC, or MNC is submitted, **Then** the field is identified with an accessible error message and the dialog stays open.
3. **Given** a valid custom profile, **When** it is saved, **Then** it appears with the "Cấu hình riêng" badge, never receives a carrier logo or verified styling, and remains after reload.
4. **Given** the backup surface, **When** the user exports, **Then** a backup file is produced locally; **When** the user imports a valid backup, **Then** profiles and saved IDs are restored; invalid files show a clear error and change nothing.
5. **Given** the guide view, **When** it opens, **Then** the platform switch, step cards, system-permission warning, and source links use the new component system and the warning remains prominent.
6. **Given** any dialog, **When** the user presses Escape, activates Close, or uses the platform back action, **Then** the dialog closes and focus returns to the control that opened it.

---

### Edge Cases

- Breakpoint boundaries: exactly 600/601, 880/881, and 1250/1251 screen pixels; installed app at exactly 743/744 pt.
- Very narrow screens (320 px), landscape phones with limited height, and 200% text zoom: no horizontal scrolling, clipped actions, or overlapping safe-area insets.
- Carrier marks: missing, unreadable, or failed local logo shows the monogram fallback with reserved space and no broken-image icon; no external request is attempted.
- Status variants: official, reference, unverified, upcoming, and custom each display an accurate label and style; an APN that is blank, automatic, or not yet published is never shown as copyable data.
- Long Vietnamese carrier names, long APN strings, and long source labels wrap without covering copy or save actions.
- Reduce-motion enabled, high-contrast mode, keyboard-only navigation, screen reader, and 200% zoom: all content and actions remain available.
- Rapid repeated interactions (double activation, fast filter changes, opening detail during entrance motion): no duplicate saves, no stale detail, no stuck overlays.
- Offline after first load, including a cold start with no network: library, detail, copy, save, custom profiles, backup dialogs, guide, and motion all work; no empty states caused by missing remote assets.
- Toast collisions and errors (copy failure, storage unavailable, invalid backup): the latest message is announced and does not block the interface.

## Requirements *(mandatory)*

### Design Reference Values

These values are the approved design contract, taken from the Foundations and Components boards. They apply to web and installed app unless a platform-specific value is stated.

| Role | Value |
| --- | --- |
| Ground | `#0b121b` |
| Surface | `#111c27` |
| Surface 2 | `#16222d` |
| Card | `#121e29` |
| Line | `#283642` |
| Text | `#f1f6f5` |
| Muted | `#96a5af` |
| Lime accent | `#c8f48b` |
| Lime dark | `#263e27` |
| Reference / warning | `#e7d699` |

| Type style | Size / line height / weight |
| --- | --- |
| Hero | 52 / 1.06 / 825 |
| Title | 28 / 770 |
| Card | 18 / 800 |
| Body | 13 / 1.7 |
| Label | 10 / 0.16em tracking |
| Mono (APN values) | 12 / 700 |

| Shape | Radius |
| --- | --- |
| Chip | 8 |
| Input | 10 |
| Card | 13 |
| Hero | 18 |
| App action button (pill) | 24 |

| Motion | Value |
| --- | --- |
| Ease-out | `cubic-bezier(.22,1,.36,1)` |
| Spring | `cubic-bezier(.34,1.56,.64,1)` |
| Hover feedback | 180 ms |
| Card entrance | 300 ms |
| View change | 450 ms |
| Stagger | 45 ms, maximum 12 items |
| Reduced motion | All non-essential motion off |

| Surface | Width | Navigation | Grid | Interaction |
| --- | --- | --- | --- | --- |
| Web desktop | ≥1251 px | 260 px sidebar | 3 columns, 14 px gap, max 1460 px | Pointer + hover |
| Web tablet | 601–1250 px | 226 px sidebar; 72 px rail at ≤880 px | 2 columns, 28–34 px gutters | Touch + pointer |
| Web mobile | ≤600 px | Bottom tab bar + central create | 1 column, 15 px gutters, 2×2 statistics | Touch ≥44 px |
| App tablet | ≥744 pt | 84 pt rail + 320 pt list | Master–detail, three zones | Touch ≥48 pt |
| App mobile | <744 pt | Four-item tab bar | 1 column, 20 pt gutters, safe area | Touch ≥48 pt |

### Functional Requirements

- **FR-001**: Every surface MUST use the approved color roles above; ad-hoc colors outside the role set are prohibited, and the reference color MUST be reserved for unverified or caution states.
- **FR-002**: Typography MUST follow the approved hierarchy, line heights, weights, and letter-spacing; APN values and other technical tokens MUST use the monospace style.
- **FR-003**: Component shapes MUST use the approved radii, with 24-radius pill actions reserved for the installed app.
- **FR-004**: Web at 1251 px and above MUST show the 260 px sidebar, hero, statistics, and three-column grid inside a 1460 px maximum content width.
- **FR-005**: Web from 601 to 1250 px MUST keep a 226 px sidebar that becomes a 72 px icon rail at 880 px and below, with the hero, statistics, two-column cards, and 28–34 px gutters.
- **FR-006**: Web at 600 px and below MUST use the bottom tab bar with four destinations and a central create action, the hero, one-column cards, 2×2 statistics, 15 px gutters, and touch targets of at least 44 px.
- **FR-007**: The installed app at 744 pt and above MUST present a three-zone master–detail layout: 84 pt rail, 320 pt carrier list, and a detail pane; list selection MUST update detail without navigation.
- **FR-008**: The installed app below 744 pt MUST use a four-item bottom tab bar, one-column content, 20 pt gutters, safe-area protection, and touch targets of at least 48 pt.
- **FR-009**: Carrier cards MUST present the carrier mark, name, network type, prefix, the APN appropriate to the selected platform, one status, and a detail affordance, in that visual hierarchy.
- **FR-010**: Each catalog entry MUST display exactly one status from the approved vocabulary: "Đã xác minh" for official sources, "Cần kiểm tra" for reference or unverified values, "Chưa ra mắt" for upcoming carriers, and "Cấu hình riêng" for custom profiles. Only official entries may use verified styling.
- **FR-011**: Status MUST always be conveyed by text plus color; color alone MUST NOT distinguish states.
- **FR-012**: Carrier marks MUST come from the repository's locally bundled assets produced by the crawl documented in `assets/carriers/README.md`; the runtime MUST NOT request logo images from the internet. A missing or failed mark MUST fall back to the carrier monogram.
- **FR-013**: The library MUST retain search across name, APN, host, prefix, note, aliases, and alternative APNs; kind filters; saved-only views; and the Android/iPhone platform switch, with active states matching the design.
- **FR-014**: The detail surface MUST show carrier identity, network type, host, prefix, status, source label with reviewed date, and platform-specific values; reference entries MUST show an explicit caution; iPhone automatic APNs MUST explain why no copyable APN exists.
- **FR-015**: Every populated detail field MUST offer a copy action with a visible success or failure confirmation; "Sao chép tất cả" MUST copy all visible populated values with their labels in a readable local format.
- **FR-016**: Users MUST be able to save or unsave a carrier from both the card and the detail surface, with the saved state and counts persisting locally.
- **FR-017**: Advanced parameters MUST be collapsed by default, expand in place, remain keyboard operable, and preserve the user's position in the detail surface.
- **FR-018**: Custom-profile creation and editing MUST keep the existing data limits and validation while adopting the new dialog, field, button, and error treatments; custom profiles MUST NOT receive carrier logos or verified styling.
- **FR-019**: Backup export and import MUST keep the existing format, size, count, and validation rules, adopt the new dialog treatment, and never transmit user data off the device.
- **FR-020**: The guide view MUST adopt the new component system, keep its platform switch, step content, source links, and prominent warning that the app cannot write system APN settings.
- **FR-021**: Motion MUST use the approved ease-out for entrances and view changes, the approved spring only for direct interaction feedback, 180 ms hover feedback, 300 ms card entrance, 450 ms view change, and 45 ms stagger capped at 12 items.
- **FR-022**: Motion MUST NOT cause layout shift or block input; controls MUST remain usable while entrance or view animations run.
- **FR-023**: When the operating system reduce-motion preference is enabled, all non-essential animation and transition MUST be removed and state changes MUST be immediate.
- **FR-024**: All interactive surfaces MUST meet WCAG 2.1 AA contrast, expose a visible focus indicator, have accessible names, support keyboard operation, and announce status and confirmation messages to assistive technology.
- **FR-025**: Touch targets MUST be at least 44 px on the web and at least 48 pt in the installed app, with no overlapping or hover-only interactions.
- **FR-026**: The redesign MUST preserve offline-first behavior: no runtime cross-origin requests, all new visual assets included in the offline cache, and the cache identity updated when those assets change.
- **FR-027**: Vietnamese MUST remain the primary interface language; the hero MUST read "Một thư viện. Mọi kết nối." and navigation, statuses, actions, and guidance MUST use the approved Vietnamese labels, while technical APN terms remain in their standard English form.
- **FR-028**: Existing behavior and data semantics MUST not regress: catalog contents and statuses, search, filters, platform switching, saving, custom profiles, backup compatibility, and guide links remain functionally unchanged.
- **FR-029**: Active, hover, pressed, selected, disabled, saved, and loading states MUST be visually distinct and consistent across web and app, and toasts MUST not block interaction.
- **FR-030**: Any typeface or icon font introduced MUST be bundled locally and covered by the offline cache; external font or icon services are prohibited.
- **FR-031**: Creating a custom profile MUST remain reachable on every form factor. Where the installed-app phone tab bar has no central create action, the "Của tôi" view MUST expose a primary create action.

### Key Entities

- **Design token set**: Approved color roles, type styles, radii, motion timings and easings, and responsive breakpoints shared by web and app.
- **Carrier card**: The library representation of a carrier: local mark or monogram, name, type, prefix, platform-specific APN, status, and saved state.
- **APN detail**: The full carrier view: identity, provenance and reviewed date, status, platform values, copy actions, advanced parameters, and save state.
- **Navigation shell**: The responsive container for navigation: desktop sidebar, tablet rail, web tab bar, or app tab bar with master–detail variants.
- **Custom profile and backup**: User-owned local data with unchanged fields, validation limits, and import/export contract, presented through the refreshed dialogs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At boundary widths of 600/601, 880/881, and 1250/1251 screen pixels, and at 743/744 pt in the installed app, the rendered navigation, column count, gutters, and touch-target sizes match the approved surface table exactly.
- **SC-002**: A side-by-side visual review against the reference boards at 1440, 1024, 768, 600, and 390 px, plus app tablet and app phone sizes, finds no critical or high-severity deviations and confirms the approved color, type, radius, and motion values.
- **SC-003**: 100% of text meets WCAG 2.1 AA contrast, 100% of icon-only controls have accessible names, and a keyboard-only user can complete browse → detail → copy without a pointer.
- **SC-004**: 100% of interactive targets meet the 44 px web / 48 pt app minimum and show a visible focus indicator; no action is reachable only by hover.
- **SC-005**: From launch, a user can open a specific carrier and copy its APN in at most 3 interactions on mobile or tablet and at most 2 on desktop, excluding typing a search query, with copy confirmation appearing within 0.2 seconds.
- **SC-006**: All entrances and view changes complete within the 180/300/450 ms budgets with the 45 ms stagger capped at 12; with reduce motion enabled, zero non-essential animations run, and motion or asset loading causes zero layout shift.
- **SC-007**: A runtime network audit shows zero cross-origin requests, and an offline session after first load can use the library, detail, copy, save, custom profiles, backup dialogs, and guide.
- **SC-008**: A catalog audit shows 100% of entries with exactly one correct status, and 0 reference, unverified, upcoming, or custom entries styled as verified.
- **SC-009**: All existing automated tests pass, and search, filter, platform switch, save/unsave, create/edit custom profile, export, import, and guide flows show no functional regression.
- **SC-010**: At 320 px width and 200% text zoom, no horizontal scrolling, clipped actions, overlapping safe areas, or hidden content occurs.

## Assumptions

- Both the installable web app and the Android/iOS app are in scope. They share one visual system; the app differs in pill radius (24), touch minimums (48 pt), and the tablet master–detail layout.
- The supplied design-system HTML and eight reference images are authoritative. The Foundations board defines token values and the Components board defines component states; screen images define layout composition.
- Carrier logos are already crawled and bundled according to `assets/carriers/README.md`; this feature does not add crawling, hotlinking, or runtime fetching. The bundled assets are the source of truth, with the monogram as fallback. Brand artwork remains outside the MIT code license.
- Catalog data, status meanings, backup format, validation limits, and local-only storage are unchanged; this feature changes presentation, layout, wording, and interaction feedback only.
- "Mạng vật lý" maps to network/MNO entries, "Mạng ảo" to MVNO entries, "Khác" to partner/other entries, and "Của tôi" to custom profiles.
- Sample counts shown in the reference images (12 carriers, 4 infrastructure networks, 6 MVNOs) are illustrative; rendered counts derive from the catalog.
- Vietnamese is the primary locale. The English eyebrow "MOBILE NETWORK TOOLKIT · 2026" and standard APN parameter names remain untranslated.
- The installed-app tablet layout applies at 744 pt and above; web layouts do not switch to master–detail at that width.
- Any new font or icon asset will be bundled locally and included in the offline cache; no new runtime service, analytics, or external dependency is assumed.
- Existing views and entry points remain; no new backend, account, or sync capability is introduced.
- Motion is progressive enhancement: all information and actions remain available when motion is disabled or unsupported.
