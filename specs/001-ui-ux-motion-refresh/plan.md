# Design System UI/UX & Motion Refresh — Implementation Plan

## Context

Implement `specs/001-ui-ux-motion-refresh/spec.md` against the existing vanilla ES-module app. The design export is already largely reflected in `styles.css`; the remaining work is to make the tokens exact, split the web shells correctly (260/226/72 px and mobile tab bar), add the installed-app tablet master–detail mode, rebuild the detail actions around source/status/platform switching plus copy-all and save, and add the specified motion and accessibility behavior. Carrier marks stay in the repository's crawled local assets (`assets/carriers/README.md`); no runtime image fetch is added. No new runtime dependency or bundled font is introduced.

The spec is the acceptance contract. This plan resolves the implementation choices the spec leaves open.

## Approach

### 1. Normalize design tokens, typography, and primary surfaces

Edit `styles.css` `:root` to contain exactly these role values and add the shape/motion tokens:

- Colors: `--bg:#0b121b`, `--surface:#111c27`, `--surface2:#16222d`, `--card:#121e29` (change from `#131e29`), `--line:#283642`, `--text:#f1f6f5`, `--muted:#96a5af`, `--lime:#c8f48b`, `--lime-bright:#d3ff9d`, `--lime-dark:#263e27`, `--reference:#e7d699`.
- Radii: `--radius-chip:8px`, `--radius-input:10px`, `--radius-card:13px`, `--radius-hero:18px`, `--radius-app:24px`; delete the unused `--radius:16px`.
- Motion: `--ease-out:cubic-bezier(.22,1,.36,1)`, `--spring:cubic-bezier(.34,1.56,.64,1)`, `--motion-hover:180ms`, `--motion-card:300ms`, `--motion-view:450ms`, `--motion-stagger:45ms`.
- Mono: `--font-mono:ui-monospace,SFMono-Regular,Consolas,monospace`.

Apply them without rewriting the decorative palette:

- `body { font-size:13px; }`; keep the existing font stack (no font file).
- `.carrier-card` background `var(--card)`, border `var(--line)`, radius `var(--radius-card)`.
- `.sidebar` background `var(--bg)`, border `var(--line)`; `.topbar` border `var(--line)`.
- `.detail-pane` background `var(--surface)`; `.editor-pane` background `var(--surface2)`; `.mobile-nav` background `var(--surface)`, remove the alpha suffix; `.step-card` background `var(--card)`.
- `.search-wrap input`, `.apn-chip` background `var(--surface2)`; borders `var(--line)`.
- `.field-value.missing`, input placeholders, `.menu-label`, `.sidebar-bottom small`, and `.library-footer` use `var(--muted)`, not `--soft`; remove the unused `--soft` token. `--muted` is the only secondary-text role; do not use a darker tint for informational text.
- `.primary-btn:hover` background `var(--lime-bright)`.
- `.status.reference` and `.status.unverified` use `var(--reference)` (and the same reference dot color); leave `official`, `upcoming`, and `custom` hues as they are.
- Use `var(--font-mono)` in `.apn-chip`, `.banner-apn`, and `.field-value`; drop the repeated stack.
- Use `var(--radius-chip)` on `.chip`, `var(--radius-input)` on inputs/search, `var(--radius-hero)` on `.hero`, and `var(--radius-app)` in the native-app action rules from step 3.

Type-scale changes: `.hero h1` max 52px (`clamp(37px,4.15vw,52px)`); `.section-head h2` max 28px; `.apn-chip` font-size 12px; `.section-kicker`, `.eyebrow`, `.detail-kicker`, `.banner-label`, and `.menu-label` stay 10px with `letter-spacing:.16em`. Keep `.detail-header h2` at 38px desktop / 34px mobile because it is the detail title, not the section Title style.

Long unbroken names MUST wrap: `.carrier-name, .carrier-kind, .detail-header h2, .detail-source-line { overflow-wrap:anywhere; max-width:100%; }`. Keep the existing `.field-value` word-break; the card may grow vertically rather than clip the name.

Remove the `.hero-tag` span (including `.hero-tag-dot`) and the `.hero-corner` span, and their CSS rules, from `index.html`/`styles.css`; keep the hero art. New or changed rules must use the role tokens, `--font-mono`, and the radii above; do not introduce new hex values. Existing decorative gradients, logo plates, carrier hue tiles, and shadows are the source palette and stay.

Run a Lighthouse accessibility pass once the shell is in place; any informational text still below 4.5:1 is promoted to `var(--muted)` or `var(--text)` rather than left as a contrast failure. Decorative text is not exempt unless it repeats content already announced.

Covers FR-001, FR-002, FR-003, FR-027, FR-030.

### 2. Split the web responsive shells at the specified breakpoints

Replace the single `@media(max-width:880px)` block with a tablet-rail block and a mobile block. Keep the existing `@media(max-width:1250px)` block (226 px sidebar, two columns, 34 px gutters).

Add `@media(min-width:601px) and (max-width:880px)`:

- `.sidebar { display:flex; width:72px; flex:0 0 72px; padding:24px 10px; align-items:center; }`
- Hide `.brand-name`, `.menu-label`, `.nav-item>span:not(.nav-icon)`, `.nav-count`, `.sidebar-bottom p`, `.sidebar-bottom small`, and `.online-indicator b`; center `.brand`, `.nav-item`, `.menu-group`, and the offline dot; keep the active nav background.
- `.topbar { height:72px; padding:0 28px; }`; hide `.topbar-left`, `.mobile-brand`, and `.topbar .icon-btn`; keep `.primary-btn.small` visible; `.locale-pill { margin-right:0; }`.
- `.content { padding:28px 28px 64px; }`; `.mobile-nav { display:none; }`; keep two-column `.carrier-grid`; use the tablet hero/stat adjustments (`hero-text:85%`, hero padding 28, `stat-num:21px`).

Move the mobile-only topbar/content/action-hide rules into `@media(max-width:600px)`: `.topbar{height:66px;padding:0 17px}`, `.content{padding:17px 15px 105px}`, `.topbar .primary-btn.small{display:none}`, `.topbar .icon-btn{display:none}`, `.locale-pill{margin-right:0}`, and `.topbar-left{display:none}`. Keep the full `.mobile-brand` layout rule at base with `display:none` (align-items, gap, font-size, letter-spacing), plus the `.mobile-mark`/`.mark-star`/`.mobile-vn` visual rules; only set `.mobile-brand{display:flex}` at 600 px and in the `html.native-app` below-744 block, so the native 601–743 range gets the complete brand styling.

Keep the `.mobile-nav` positioning/background/padding rules and the `.mob-nav`/`.add-mob` visual rules at the base level, with `.mobile-nav{display:none}` as the base; only the `display:flex` activation belongs at 600 px and below (the native-app block below 744 px also activates it). At 601–880 the rail is visible, there is no bottom nav, and the create button stays in the top bar.

Add mobile touch sizing inside the 600 px block: `min-width:44px;min-height:44px` on `.chip, .platform-tab, .bookmark, .close-btn, .detail-icon-btn, .field-copy, .icon-btn, .detail-back, .copy-big, .outline-btn, .primary-btn, .search-wrap input, .detail-tools summary, .detail-advanced summary, .advanced-fields summary`; keep `.mob-nav{min-height:48px}` and make `.detail-actionbar{flex-wrap:wrap}`.

Covers FR-004, FR-005, FR-006, FR-025.

### 3. Add the native-app shell and tablet master–detail

**Build flag.** Insert `const NATIVE_SHELL=false;` immediately after the imports in `src/app.mjs`. In `scripts/prepare-web.mjs`, after the existing service-worker removal, do:

```js
const withNative = withoutWorker.replace('const NATIVE_SHELL=false;', 'const NATIVE_SHELL=true;');
if (withNative === withoutWorker) throw Error('Native shell flag not found; avoid shipping the web shell in the native app');
writeFileSync(appFile, withNative);
```

`prepare-site.mjs` stays unchanged, so `site/src/app.mjs` keeps `false`.

**DOM.** Add a third shell child after `.main-wrap` in `index.html`:

```html
<aside class="detail-column" id="detailColumn" aria-label="Chi tiết nhà mạng" aria-live="polite"></aside>
```

Add `<span class="offline-pill"><span></span>Offline sẵn sàng</span>` inside `.topbar-actions` before `.locale-pill`.

Add `tabindex="-1"` to the existing `.detail-pane` so it can receive focus after a host move.

**Layout state.** In `src/app.mjs` add:

```js
const TABLET_MEDIA = window.matchMedia('(min-width:744px)');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
const detailPane = document.querySelector('.detail-pane');
function isNativeTablet(){ return NATIVE_SHELL && TABLET_MEDIA.matches; }
```

At startup: add `native-app` with `document.documentElement.classList.toggle('native-app', NATIVE_SHELL)`, call `updateLayoutMode({refresh:false})`, then call the initial `renderCards({animate:true})`.

`updateLayoutMode({refresh=true}={})` toggles `native-tablet` on `document.documentElement` and moves `.detail-pane` into `#detailColumn` for native tablet and back into `#detailScrim` otherwise. When moved inline, set `role="region"`, remove `aria-modal`, hide the scrim, and clear `body.style.overflow`; when moved back, restore `role="dialog"`/`aria-modal="true"`, and if `state.detailId` exists show the scrim and set `body.style.overflow='hidden'`. If a detail was open across the mode switch, focus `.detail-pane` after the move (the close button is hidden inline; the pane is the stable focus target). `#detailColumn` is hidden when not in native tablet. If native tablet and `refresh` is true, call `renderCards({animate:false})` after mounting; the startup call passes `refresh:false` to avoid a duplicate render.

`openDetail(id)` gets a native-tablet branch: set `state.detailId`, show `#detailColumn`, render, scroll it to top, and return without touching the scrim or body overflow. Web keeps the existing modal path but stores return focus (step 6). `closeDetail()` in native tablet clears `#detailContent` and hides the column; web hides the scrim and restores focus.

`renderCards` at the end calls `ensureTabletSelection(results)`; it opens the first result when native tablet has no valid current detail and closes the detail when results are empty. `switchView` toggles `guide-view` on `document.documentElement`; CSS collapses the grid to two zones and hides the detail column for the guide. Add `TABLET_MEDIA.addEventListener('change', updateLayoutMode)` when `NATIVE_SHELL`.

When `ensureTabletSelection` closes or replaces an inline detail while focus is inside `#detailContent`, move focus to the new selected card's `.card-open`, or to `#search` when the list is empty. This covers unsaving the currently open card in the saved view on native tablet.

**CSS.** Append the native rules after the web media queries.

```css
.detail-column { display:none; }
html.native-app .sidebar { display:none; }
html.native-app .mobile-nav { display:flex; }
html.native-app .add-mob { display:none; }
html.native-app .hero, html.native-app .stats-row { display:none; }
html.native-app .topbar .primary-btn.small,
html.native-app .topbar .icon-btn,
html.native-app .locale-pill { display:none; }
html.native-app .offline-pill { display:inline-flex; }
.offline-pill { display:none; align-items:center; gap:7px; border:1px solid var(--line); background:var(--lime-dark); color:var(--lime); border-radius:999px; padding:7px 11px; font-size:10px; font-weight:800; }
.offline-pill>span { width:6px; height:6px; border-radius:50%; background:var(--lime); }
html.native-app .mobile-vn { display:none; }
html.native-app .mobile-brand { display:flex; }
html.native-app #libraryView .section-kicker,
html.native-app #libraryView .section-head p { display:none; }
html.native-app .library-footer { display:none; }
html.native-app .primary-btn, html.native-app .outline-btn { border-radius:var(--radius-app); min-height:48px; }
html.native-app .copy-big { border-radius:var(--radius-app); min-width:48px; min-height:48px; }
html.native-app .chip, html.native-app .platform-tab,
html.native-app .bookmark, html.native-app .close-btn,
html.native-app .detail-icon-btn, html.native-app .field-copy,
html.native-app .icon-btn, html.native-app .detail-back,
html.native-app .search-wrap input, html.native-app .detail-tools summary,
html.native-app .detail-advanced summary, html.native-app .advanced-fields summary { min-width:48px; min-height:48px; }
html.native-app .form-field input, html.native-app .form-field select, html.native-app .form-field textarea { min-height:48px; }
```

Add `@media(max-width:743px)` for native mobile. Every selector in this block is prefixed with `html.native-app`: `content{padding:16px 20px 105px}`, `section-head` stacked, `section-head h2{font-size:34px;line-height:1.1}`, `detail-banner{display:none}`, `carrier-grid{grid-template-columns:1fr}`, `steps-grid{grid-template-columns:1fr}`, `toolbar-platform{width:100%}` with `.platform-tab{flex:1}`, and `topbar{height:calc(64px + env(safe-area-inset-top));padding-top:env(safe-area-inset-top)}`. At 601–743 these overrides beat the web rail block because they are later, and the `html.native-app` scope keeps them off web.

Add `html.native-tablet`; every selector below is prefixed with `html.native-tablet`:

- `html.native-tablet, html.native-tablet body { height:100dvh; overflow:hidden; }`
- `.app-shell { display:grid; grid-template-columns:84px 320px minmax(0,1fr); min-height:100dvh; }`
- Sidebar: `display:flex; width:84px; height:100dvh; padding-top:calc(24px + env(safe-area-inset-top));` hide labels/counts/sidebar text exactly as the web rail.
- Hide `.topbar` and `.mobile-nav`; `.main-wrap{height:100dvh;overflow-y:auto;border-right:1px solid var(--line)}`; `.content{max-width:none;padding:20px}`; hide `.library-footer`.
- `.section-head` stacked; `.toolbar` stacked; `.platform-switch` full width; `.carrier-grid{grid-template-columns:1fr;gap:8px}`.
- `#detailColumn{display:block;height:100dvh;overflow-y:auto}`; `html.native-tablet .detail-pane{width:auto;height:auto;min-height:100%;overflow:visible;display:flex;flex-direction:column;border:0;box-shadow:none;animation:none;background:var(--surface)}`; `html.native-tablet #detailContent{flex:1;min-height:0}`; hide `.detail-back` and `.detail-pane .close-btn`; keep the bookmark. `#detailColumn` is the only scroller; the pane must not create a second scroll container.
- `html.native-tablet.guide-view .app-shell{grid-template-columns:84px minmax(0,1fr)}`; `html.native-tablet.guide-view #detailColumn{display:none}`.

Native compact cards (CSS only, same markup), all scoped to `html.native-app`: `html.native-app .card-body{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"mark name" "mark kind" "apn apn";column-gap:12px;align-items:center}`, `html.native-app .card-top{grid-area:mark;display:block}`, `html.native-app .bookmark{position:absolute;top:8px;right:8px;z-index:2}`, `html.native-app .carrier-name{grid-area:name;margin:0;padding-right:34px}`, `html.native-app .carrier-kind{grid-area:kind}`, `html.native-app .apn-chip{grid-area:apn;margin:8px 0 10px}`, `html.native-app .carrier-card{min-height:0}`. Do not add a second card markup and do not apply these compact grid rules on web.

Covers FR-007, FR-008, FR-025, FR-031.

### 4. Rebuild library card semantics, status labels, and platform switching

In `renderCards` change the card markup to a real button overlay and remove invalid nested interactivity:

- `<article class="carrier-card${p.id===state.detailId?' selected':''}" data-id="${esc(p.id)}">` without `role`/`tabindex`/`aria-label`.
- First child `<button class="card-open" type="button" data-open="${esc(p.id)}" aria-label="Xem chi tiết ${esc(p.name)}" aria-current="${p.id===state.detailId?'true':'false'}"></button>`. Every interpolated dataset or user value in an attribute or text node MUST go through `esc`; the overlay label is not exempt.
- Keep the bookmark `<button data-save aria-pressed="${saved}" aria-label="${saved?'Bỏ lưu':'Lưu'} ${esc(p.name)}">`, the name, kind/prefix, APN chip, status, and the visual CTA span.
- Each card gets `style="--i:${Math.min(index,11)}"` for the stagger.
- Add `updateSelectedCard()` that toggles `.selected` and `aria-current` on the existing cards; call it from `renderCards` after `innerHTML`, from `openDetail` after setting `state.detailId` in either mode, and from `closeDetail` after clearing it in either mode. `renderCards` also renders the initial selected class/attribute.
- In `toggleSave`, when the active element is a `[data-save]` inside `#carrierGrid`, record its card index before `renderCards`. After the render, focus the matching `[data-save="${id}"]` if it still exists; otherwise focus the `.card-open` of the next card at `min(index, last)`, then the first `.card-open`, then `#search`. If the active element was the detail save button, skip this fallback and let the detail render restore it.
- Remove the `carrierGrid` keydown handler; the overlay button provides Enter/Space. Keep the click delegation, checking `[data-save]` before `[data-open]`.

CSS: `.carrier-card{position:relative}`, `.card-open{position:absolute;inset:0;z-index:1;border:0;background:transparent;border-radius:inherit;cursor:pointer}`, `.card-open:focus-visible{outline:2px solid var(--lime);outline-offset:-2px}`, `.card-body,.card-footer{position:relative;pointer-events:none}`, `.bookmark{position:relative;z-index:2;pointer-events:auto}`, `html.native-tablet .carrier-card.selected{border-color:var(--lime);background:var(--surface2)}`. Keep the card hover on `.carrier-card:hover`. A custom profile named `"><img src=x onerror=alert(1)>` must render as text and as an escaped label, not create an element.

Status labels in `app.mjs` become `STATUS = { official:'Đã xác minh', reference:'Cần kiểm tra', unverified:'Cần kiểm tra', upcoming:'Chưa ra mắt', custom:'Cấu hình riêng' }`. The detail banner label for reference becomes `APN THAM KHẢO / CẦN KIỂM TRA`. Do not change catalog status values.

Fix the platform switch: `setPlatform(platform)` must call `renderCards({animate:true})` as well as `renderGuide()` and re-render an open detail; today card APNs go stale. Update `aria-pressed` on every `[data-platform]` button. Replace the direct `qsa('[data-platform]')` listeners with one document-level click handler that calls `setPlatform` for any `[data-platform]` (needed for the dynamically rendered detail switch).

Add a second, structurally identical platform switch after the search inside `.toolbar`: `<div class="platform-switch toolbar-platform" role="group" aria-label="Chọn nền tảng">` with Android/iPhone buttons carrying `data-platform` and initial `aria-pressed`. Keep the existing switch in `.section-head`. CSS: `.toolbar-platform{display:none}` by default; at `@media(max-width:600px)` hide `.section-head > .platform-switch` and show `.toolbar-platform`; do the same for `html.native-app` below 744 px and for `html.native-tablet`. This gives the design order title → search → platform → filters on mobile/native while desktop/tablet keep the switch beside the title. Both copies are updated by `setPlatform`, and only one is displayed at a time.

CSS for the duplicated switch: `.toolbar-platform{display:none}`; `@media(max-width:600px){ .section-head>.platform-switch{display:none} .toolbar-platform{display:flex;width:100%} }`; `@media(max-width:743px){ html.native-app .section-head>.platform-switch{display:none} html.native-app .toolbar-platform{display:flex} }`; `html.native-tablet .section-head>.platform-switch{display:none}` and `html.native-tablet .toolbar-platform{display:flex}`.

Set the initial accessibility state in `index.html` (not only inside JS updaters): `aria-current="page"` on both the sidebar and mobile-nav library buttons; `aria-pressed="true"` on every initial Android platform button and `"false"` on every iPhone button in the section-head, toolbar, and guide switches; `aria-label="Chọn nền tảng"` on those groups; `aria-label="Lọc nhà mạng"` on `.chip-row`; `aria-label="Điều hướng di động"` on `.mobile-nav`; `aria-label="Trang chủ APN Atlas"` on `#brandHome`; `aria-label="Trợ giúp"` on `#headerHelp`; `aria-label="Tạo cấu hình mới"` on `#mobileAdd`; `aria-label="Tìm nhà mạng, APN, đầu số"` on `#search`. Use these exact dynamic labels: bookmark `Lưu ${name}` / `Bỏ lưu ${name}` (card, detail header, and title attribute), close buttons `Đóng`, copy buttons `Sao chép ${label}`, card overlay `Xem chi tiết ${name}`. `switchView`/`setPlatform` keep the values current after interaction; at startup no updater call is required because the HTML already carries them.

After the initial HTML, keep state current: `renderCards` sets `aria-pressed` on every `.chip` from `state.kind`, `switchView` sets `aria-current="page"` on the active `[data-view]` and removes it from the rest, and `setPlatform` sets `aria-pressed` on every `[data-platform]` button (including hidden copies and the detail switch).

Hero copy in `index.html`: `<h1>Một thư viện.<br><em>Mọi kết nối.</em></h1>`; remove the hero tag/corner elements.

At 600 px and below set `.section-head h2{font-size:28px}` (the current 24 px is below the design Title scale).

Covers FR-009, FR-010, FR-011, FR-012, FR-013, FR-016, FR-024, FR-027, FR-029.

### 5. Rebuild the detail surface and add copy-all

Add to `src/catalog.mjs`:

Extend the `src/app.mjs` import from `./catalog.mjs` with `DATA_REVIEWED`, `profileFields`, and `buildProfileCopyText`; do not add a second import statement.

```js
export const DATA_REVIEWED = '2026-11-05';

export function profileFields(profile, platform='android') { ... }
```

`profileFields` returns `Array<{label, value, advanced?, copy?}>` using `PROFILE_DEFAULTS`, in this exact order:

- Always: `Tên APN` = name.
- Android order: `APN` = `getCarrierApnForPlatform(profile, 'android')`, `Username`, `Password`, `APN type`, `Protocol`, `Roaming protocol`, `Authentication`, `Bearer`, `MCC / MNC`. `MCC / MNC` is `${mcc} / ${mnc}` when both exist with `copy:true`; otherwise it is `Tự nhận theo SIM` with `copy:false`.
- Android advanced (`advanced:true`): `Proxy`, `Port`, `Server`, `MMSC`, `MMS proxy`, `MMS port`, `MVNO type` (`None` when empty), `MVNO value`.
- iOS order: `Cellular Data` = platform APN, `Username`, `Password`, `LTE setup (optional)`, `Personal Hotspot`. `LTE setup` and `Personal Hotspot` are `''` when `iosAuto`, otherwise `iosLte || (id==='itel' ? apn : '')` and `iosHotspot || (id==='itel' ? apn : '')`. The generic `APN` row is Android-only; iOS uses the `Cellular Data` label to avoid a duplicate.

Add:

```js
export function buildProfileCopyText(profile, platform='android', {includeAdvanced=true}={}) {
  return profileFields(profile, platform)
    .filter(({value, copy, advanced}) => copy !== false && String(value ?? '').trim() !== '' && (includeAdvanced || !advanced))
    .map(({label, value}) => `${label}: ${value}`)
    .join('\n');
}
```

Use `profileFields` in `renderDetail` for both the basic list and the advanced `<details>`; remove the inline Android/iOS arrays. `fieldRow` defaults to `copy:true` but MUST honor a field's `copy:false`, and it already suppresses the button when the value is empty. This makes every populated, copyable field available; the MCC/MNC “Tự nhận theo SIM” explanation is not copied.

Detail markup changes in `renderDetail`:

- After the title/meta, render a source/status line: `badge(p)`, then for catalog entries `Nguồn công khai: <a class="detail-source-link" href="${source}" target="_blank" rel="noopener noreferrer">${sourceLabel || 'Nguồn công khai'}</a> · ${dd.mm.yyyy}` when official, or `Nguồn tham khảo: <a ...>${sourceLabel || 'Nguồn tham khảo'}</a> · ${dd.mm.yyyy}` otherwise. The date comes from `DATA_REVIEWED`; custom profiles show `Lưu trên thiết bị này` and no link. Give `.detail-source-link{word-break:break-word}`.
- Add a `<div class="platform-switch detail-platform" role="group" aria-label="Chọn nền tảng">` group with Android/iPhone buttons (`data-platform`, `aria-pressed`), placed before the banner.
- Compute `const verified = p.status==='official' && available;`, `const reference = p.status==='reference' || p.status==='unverified';`, `const custom = p.kind==='custom';`, and `const caution = reference || !available;`. Banner class is `verified ? '' : custom ? 'custom' : 'warn'`; note class is `caution ? 'detail-note-warn' : ''` (custom stays neutral). Banner label precedence: `iosAuto` → `APN IPHONE / TỰ ĐỘNG`; custom → `CẤU HÌNH RIÊNG`; reference → `APN THAM KHẢO / CẦN KIỂM TRA`; verified → `ACCESS POINT NAME (APN)`; otherwise → `APN STATUS` (for upcoming or missing APN). Add `.detail-banner.custom{background:var(--surface2);border-color:var(--line)}` and `.detail-banner.custom .banner-label{color:var(--muted)}`. Only an official entry with an available APN gets the green verified banner; custom never does.
- Keep the APN banner and its `Sao chép APN` button; hide the banner only for `html.native-app` below 744 px.
- Render the advanced fields as `<details class="detail-advanced detail-advanced-fields">`; keep the alternatives as `detail-advanced apn-alternatives`. Rename its summary to `Thông số nâng cao →`.
- Replace the two `.detail-bottom` rows with:
  - `<details class="detail-tools"><summary>Xuất & chia sẻ</summary>` containing the existing JSON export, Android XML, edit/duplicate, and delete-custom buttons with their current `data-action`/disabled logic.
  - `<div class="detail-actionbar"><button class="outline-btn" data-action="save-detail" data-save-region="footer" aria-pressed="${saved}">${saved?'Đã lưu':'Lưu'}</button><button class="primary-btn" data-action="copy-all">Sao chép tất cả</button></div>`. The header bookmark keeps `data-action="save-detail"`, gets `data-save-region="header"`, `aria-pressed="${saved}"`, and the `Lưu`/`Bỏ lưu` label; the click handler treats both regions alike.

Detail event handling: there is exactly ONE delegated `document` click listener, the same handler introduced in step 4. Do not add a second handler. It orders operations: platform button → detailScrim backdrop close → detail `[data-copy]`/`[data-action]`. Remove the old `detailScrim` listener and every direct `[data-platform]` listener. Add `copy-all` to compute `buildProfileCopyText(p, state.platform, {includeAdvanced: document.querySelector('#detailContent .detail-advanced-fields')?.open === true})` and call `copyText(text, 'Đã sao chép tất cả thông số')`. Change `copyText(value)` to `copyText(value, successMessage)` and use the custom message; keep the `execCommand` fallback and failure toast.

`renderDetail` MUST preserve keyboard focus across its own re-renders. Before replacing `innerHTML`, if the active element is inside `#detailContent` and the detail is already open, capture `{platform, saveRegion, action, copyLabel}` from the focused element's `data-platform`, `data-save-region`, `data-action`, or `aria-label`. After rendering, restore with detail-scoped selectors only: `#detailContent .detail-platform [data-platform="${platform}"]`, `#detailContent [data-action="save-detail"][data-save-region="${saveRegion}"]`, `#detailContent [data-action="${action}"]`, or `#detailContent [aria-label="${CSS.escape(copyLabel)}"]` in that order. If the copied field disappeared because the platform changed, focus `#detailContent .detail-platform button[aria-pressed="true"]`. These re-renders are not dialog opens, so do not push onto the dialog focus stack.

CSS: `#detailContent{display:flex;flex-direction:column;min-height:100%}` so a short detail still pushes the footer to the bottom; `.detail-source-line{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0 16px;font-size:11px;color:var(--muted)}`; `.detail-source-link{color:var(--lime);text-decoration:underline;text-underline-offset:3px;word-break:break-word}`; `.detail-platform{margin:0 0 16px}`. `.detail-actionbar{position:sticky;bottom:0;z-index:2;display:flex;gap:10px;margin-top:auto;padding:12px 30px calc(12px + env(safe-area-inset-bottom));background:var(--surface);border-top:1px solid var(--line)}`; primary flex 1, save min-width 110px. `.detail-tools{margin:0 30px 24px;border-top:1px solid var(--line)}`; `.detail-tools summary{cursor:pointer;list-style:none;color:var(--lime);font-size:12px;font-weight:750;padding:12px 0}`. The detail pane is the scroll container on web; on native tablet the `#detailColumn` is the scroll container, and the sticky footer remains inside `.detail-pane`.

For 320 px and 200% text zoom: `.detail-actionbar{flex-wrap:wrap}` and `.detail-actionbar .primary-btn{white-space:normal;text-align:center}`; the save button may become full-width on its own row. `.dialog-actions .primary-btn` also gets `white-space:normal;text-align:center`. No interactive control may overflow the viewport or cover another control.

Covers FR-014, FR-015, FR-016, FR-017, FR-019, FR-024.

### 6. Custom profiles, backup, guide, and focus management

- Add `<div class="custom-actions" id="customActions" hidden><button class="primary-btn" type="button" id="customCreate">+ Tạo cấu hình</button></div>` after the library section head. In `app.mjs`, bind `customCreate` to `openEditor()` and set `hidden = !(NATIVE_SHELL && state.view==='custom')` in `switchView` and after render; this is the create entry point when the native tab bar has no central `+`.
- The native app hides `.add-mob`; web mobile keeps it.
- Add a form error region `<p class="form-error" id="formError" role="alert" hidden></p>` before the dialog actions. In the `saveEditor` catch, map `Invalid name`, `Invalid APN`, `Invalid MCC`, `Invalid MNC` to `editName`, `editApn`, `editMcc`, `editMnc`: set `aria-invalid="true"` and `aria-describedby="formError"`, focus the field, write the exact message (`Tên cấu hình phải từ 1 đến 80 ký tự.`, `APN phải từ 1 đến 128 ký tự.`, `MCC phải gồm đúng 3 chữ số.`, or `MNC phải gồm 2 hoặc 3 chữ số.`) into `#formError`, and unhide it. Do not also show the generic toast for a mapped field error. Clear `aria-invalid`/`aria-describedby` and hide the region on `input`; keep the existing toast for uncategorized errors.
- Apply the token/radius/button typography to `.editor-pane`, `.backup-pane`, form fields, `.warning-card`, and `.step-card`; do not change the backup data limits or parser calls.

- CSS: `.custom-actions{display:flex;justify-content:flex-end;margin:0 0 16px}`; `.form-error{color:var(--reference);font-size:12px;line-height:1.5;margin:10px 0 0}`; `.form-field input[aria-invalid="true"], .form-field select[aria-invalid="true"]{border-color:var(--reference)}`.
- Implement a focus stack in `app.mjs`:

```js
const focusStack = [];
function rememberFocus(){ focusStack.push(document.activeElement); }
function restoreFocus(){ const node=focusStack.pop(); if(node?.isConnected){ node.focus(); return; } const target=[el('search'),...qsa('[data-view].active')].find(x=>x && x.offsetParent!==null); target?.focus(); }
function trapFocus(event, container){ ... first/last enabled focusable ... }
```

Call `rememberFocus()` before opening detail (only when the scrim is hidden), editor, and backup; call `restoreFocus()` in the matching close. In the global keydown, before the Escape handling, trap Tab in the topmost visible dialog (`editorScrim`, then `backupScrim`, then `detailScrim`). On opening a modal detail, focus the close button; on opening disk dialogs, keep the existing focus of `editName` and add focus for the backup close button. The inline native-tablet detail is `role="region"`, not a dialog, and is not trapped.

While any of those modals is visible, the global `/` search shortcut is ignored; it must not focus the library search behind a dialog.

Covers FR-018, FR-019, FR-020, FR-024, FR-031.

### 7. Add the motion system

Use the tokens from step 1.

- Card entrance: add `@keyframes card-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}` and `.carrier-grid.cards-enter .carrier-card{animation:card-in var(--motion-card) var(--ease-out) both;animation-delay:calc(var(--i,0) * var(--motion-stagger))}`.
- Change `renderCards` to `renderCards({animate=false}={})`; it toggles `cards-enter` on `#carrierGrid`. Call with `animate:true` for the initial library render, `switchView` when the destination is library/saved/custom (not guide), filter-chip changes, and `setPlatform`; call with `animate:false` for search input, save/unsave, editor save/delete, import, and layout-mode changes. Do not animate on each search keystroke; that repeats a 300 ms entrance for every character and delays the result.
- View change: `@keyframes view-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`; `.view-enter{animation:view-in var(--motion-view) var(--ease-out) both}`. In `switchView`, remove/re-add `view-enter` on the visible section (force reflow with `void section.offsetWidth`).
- Detail/dialog entrance: change `.detail-pane` to `animation:slide-in var(--motion-card) var(--ease-out) both` and `.editor-pane` to `animation:appear var(--motion-card) var(--ease-out) both`; native-tablet inline detail has `animation:none`.
- Hover: replace the 0.2s/0.17s transitions in `.nav-item`, `.carrier-card`, `.chip`, `.platform-tab`, `.search-wrap input`, `.primary-btn`, `.outline-btn`, `.advanced-fields summary span`, and `.toast` with `var(--motion-hover)`.
- Spring press: add `:active` scale `.97` with `transform var(--motion-hover) var(--spring)` to primary/outline buttons, chips, platform tabs, bookmarks, and mobile nav items. Keep the existing hover lifts.
- Reduced motion: keep the global `@media(prefers-reduced-motion:reduce)` kill. In JS use `REDUCED.matches` for `window.scrollTo` and `scrollIntoView` (`auto` instead of `smooth`); `switchView` and `exploreBtn` use a shared helper. CSS already removes the animation classes' effect.

Covers FR-021, FR-022, FR-023, FR-029.

### 8. Build flag, offline cache, and automated tests

- `scripts/prepare-web.mjs`: implement the `NATIVE_SHELL` replacement and throw as in step 3. Keep the service-worker removal. No other copy changes.
- `sw.js`: change `CACHE` to `'apn-atlas-vn-v1.3-design-system'`; no new files need precaching because no new asset or stylesheet is added.
- `tests/build.test.mjs`: after the existing build calls, assert `www/src/app.mjs` matches `/const NATIVE_SHELL=true;/`, `site/src/app.mjs` matches `/const NATIVE_SHELL=false;/`, and keep the existing SW-removal/catalog-parity assertions.
- `tests/catalog.test.mjs`: import `profileFields`, `buildProfileCopyText`, and `DATA_REVIEWED`; add one test that `buildProfileCopyText(Viettel,'android')` contains `Tên APN: Viettel`, `APN: v-internet`, `APN type: default,supl`, `Protocol: IPv4/IPv6`, and does not contain an empty `Username:` line; assert `profileFields` includes an advanced field flagged `advanced`; build a custom profile with `proxy:'10.0.0.1'` and assert `{includeAdvanced:false}` omits `Proxy:` while `{includeAdvanced:true}` includes it; assert `buildProfileCopyText(Pottel,'ios')` omits `Cellular Data`, `LTE setup`, and `Personal Hotspot` because Pottel has `iosAuto`; assert `DATA_REVIEWED` is `2026-11-05`. Do not add source-text assertions for CSS.
- Do not change catalog data/status values or the backup format.

Covers FR-026, FR-028, FR-030.

## Critical files & anchors

- `styles.css`: `:root`; the `@media(max-width:1250px)`, new `601–880`, `600`, and native blocks; `.carrier-card`/`.card-*`; `.detail-*`; `.mobile-nav`/`.mob-nav`.
- `src/app.mjs`: imports and `NATIVE_SHELL`; `renderCards`, `switchView`, `setPlatform`, `renderDetail`, `openDetail`/`closeDetail`, `bindEvents`, `saveEditor`, `openEditor`/`openBackup`.
- `index.html`: `.app-shell` (add `#detailColumn`), `#libraryView` section head, `#detailScrim` `.detail-pane`, `.mobile-nav`, topbar actions, form error region.
- `src/catalog.mjs`: after `getCarrierApnForPlatform`, add `DATA_REVIEWED`, `profileFields`, `buildProfileCopyText`; reuse `PROFILE_DEFAULTS` and `getCarrierApnForPlatform`.
- `scripts/prepare-web.mjs` and `tests/build.test.mjs`: native flag replacement/assertions.

## Verification

Run from `C:/Users/Thanh/orca/apn-atlas-vn`.

1. `npm test` — all existing tests plus the new build-flag and copy-all assertions pass.
2. `npm run build:site` and `npm run build:web` — both succeed; inspect `site/src/app.mjs` (flag false) and `www/src/app.mjs` (flag true, no service-worker registration).
3. Serve the web build: `python -m http.server 8080 --directory site` and open `http://127.0.0.1:8080/`. Serve the native simulation: `python -m http.server 8081 --directory www` and open `http://127.0.0.1:8081/`.

Web layout checks (computed values, not just screenshots):

- At 1440: sidebar width 260, 3 card columns, hero headline “Một thư viện. Mọi kết nối.”, computed content max-width 1460.
- At 1250: sidebar 226, 2 columns; at 1251: sidebar 260, 3 columns.
- At 881: sidebar 226, 2 columns. At 880 and 768: sidebar 72 (icon rail), 2 columns, no bottom nav, topbar create button visible.
- At 600: no sidebar, 1 column, bottom tab bar with central `+`, stats 2×2, touch targets at least 44 px; at 601: rail returns and the bottom bar is absent.
- Search and kind filters update cards and keep the platform APN correct; clicking iPhone updates both library cards and an open detail (regression check for `setPlatform`).
- At 390 and in the native list, the library order is title → search → Android/iPhone → filter chips, and only the toolbar platform switch is visible; at 1440/1090 the switch sits beside the section title and the toolbar copy is hidden.
- At 320 px and at 200% text zoom (web and native): no horizontal scroll, the detail action bar wraps, long names/APNs wrap or truncate accessibly, and every action remains reachable.
- Create a custom profile with an 80-character unbroken name; at 320 px and 200% text zoom the card name and detail `h2` wrap inside their containers, are not clipped, and do not create horizontal scroll.

Detail checks (open Viettel):

- Source line shows `Nguồn công khai`, `Viettel Telecom`, and `· 05.11.2026`; the source link opens in a new tab.
- Android/iPhone segmented control switches values in place; iPhone for Pottel shows no copyable APN and explains automatic configuration.
- Every populated field has a copy button; with the advanced disclosure collapsed, `Sao chép tất cả` copies exactly the visible labeled populated lines and omits `Proxy`/`Port`/`Server`/MMS/MVNO advanced values; expanding the disclosure and copying again includes them. The toast reads `Đã sao chép tất cả thông số`.
- Save toggles the footer between `Lưu` and `Đã lưu`, updates the card bookmark/count, and survives reload.
- `Thông số nâng cao →` expands; the `Xuất & chia sẻ` disclosure still exports JSON/XML and still edits/deletes custom profiles.
- Reference/unverified Local or FPT shows `Cần kiểm tra` in reference gold; SkyFi shows `Chưa ra mắt`; a custom profile shows `Cấu hình riêng` and no carrier logo. Official entries remain green.
- A custom profile detail shows the neutral `CẤU HÌNH RIÊNG` banner, never the green verified banner; the status badge is `Cấu hình riêng`.
- Create a custom profile named `"><img src=x onerror=alert(1)>`; the card and detail render it as text, the overlay `aria-label` is escaped, and no image element or script runs.
- In the custom editor, submit an MCC of `12` and confirm focus moves to the MCC field, `aria-invalid="true"` is set, and `#formError` announces `MCC phải gồm đúng 3 chữ số.` without a duplicate toast.
- With keyboard focus on the detail platform switch, press iPhone; focus returns to the iPhone button and the detail re-renders once. Focus the footer save button and press it; focus returns to the same save control. One platform click calls `setPlatform` once (no duplicate render/animation).
- Dialog keyboard: Tab cycles inside the detail/editor/backup, Escape closes, and focus returns to the opener.
- Saved-view keyboard removal: focus a card bookmark and unsave it; focus moves to the next card’s open control (or search when empty), never `body`. Repeat from the detail footer save, then close the detail; focus lands on search or the active nav button.

Native simulation checks (`www`, flag true):

- At 390×844: `document.documentElement.classList.contains('native-app')` is true; hero/stats are hidden; the tab bar has four items (no central `+`); the top bar shows the offline pill; “Của tôi” shows `Tạo cấu hình`, and it opens the editor.
- At 834×1112: `native-tablet` is true; `.app-shell` has 84/320/remaining columns; topbar/mobile nav are hidden; selecting a list row updates the inline detail; the detail has no scrim, its back/close buttons are hidden, and its save/copy-all footer is sticky.
- At 700×900 (native, between 601 and 743): cards and guide steps are one column, the tab bar has four items, and the toolbar platform switch is visible.
- In the 834×1112 native tablet, the selected list row has the lime selected border/background and `aria-current="true"`; a short detail pushes the action bar to the bottom, and a long detail keeps it visible while the detail column scrolls. The detail pane itself does not scroll independently.
- The native list uses compact cards (mark/name/kind/APN/status visible) and the native tablet rail shows only icons.
- Resize across 744 pt: entering tablet moves the pane inline and auto-selects the first result; returning to 743 pt restores the modal/native-mobile shell without a stuck overlay.
- `www` has no service-worker registration; `site` does.

Motion and accessibility checks:

- Card entrance computes to 300 ms, view transitions 450 ms, hover transitions 180 ms, and card `--i` is capped at 11 (no delay beyond 495 ms).
- With Chrome “Emulate prefers-reduced-motion: reduce”: card/view animations do not run, transitions are none, and view switches/scrolls are immediate.
- Motion does not shift layout: the card grid, logo plates, and sticky footer stay fixed; buttons remain clickable during entrance.
- Keyboard-only browse → card overlay button → detail → copy works; card overlay focus is visible; Tab is trapped in modals; icon-only buttons have Vietnamese accessible names; Lighthouse accessibility has no contrast or name failures.
- On first load, both library nav buttons expose `aria-current="page"`, every platform button exposes the correct `aria-pressed`, and the chip row, mobile nav, brand, help, search, bookmark, copy, and close controls use the exact Vietnamese labels above.
- At 390 and 834, keyboard-focus the detail platform switch and footer save control, change each, and confirm focus stays on the detail-scoped equivalent (not the section/toolbar switch or header bookmark).
- Offline: load `site`, switch DevTools offline, reload; library, detail, copy, save, custom profiles, backup dialogs, guide, and motion still work; the network panel shows no cross-origin requests and no remote logo/font requests.

## Assumptions & contingencies

- The native flag is the single source of truth for app-specific layout; the installed builds must use `www` from `prepare-web.mjs`. If a different packaging path bypasses that script, set `NATIVE_SHELL=true` there as well.
- Carrier logos are the already-crawled local assets documented in `assets/carriers/README.md`; this plan does not crawl or fetch anything at runtime. The monogram fallback remains.
- Reference screenshots use illustrative counts and statuses; rendered counts/statuses come from `src/catalog.mjs` and are not changed to match the images.
- No font or icon package is added. Inter remains first in the stack when installed; the system fallback is acceptable. If a product decision later requires bundled Inter, it must be added as a local asset and to the offline cache, but that is outside this plan.
- Search updates are immediate and do not run the card entrance; view, filter, and platform changes do. This keeps typing responsive while preserving the designed entrance for navigational changes.
- The installed-app list reuses the existing card markup with the compact CSS variant; it does not introduce a second card component.
