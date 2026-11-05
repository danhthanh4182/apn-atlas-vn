# APN Atlas VN Constitution
<!-- Sync Impact Report
Version change: unratified template → 1.0.0
Modified principles: none (initial adoption)
Added sections: Core Principles I–V; Additional Constraints; Development Workflow & Quality Gates; Governance
Removed sections: template placeholder principles, sections, and governance rules
Follow-up TODOs: none
-->

## Core Principles

### I. Offline-First, Static Delivery (NON-NEGOTIABLE)
Every core capability — catalog browsing, search, profile details, saved profiles, custom profiles,
and JSON backup import/export — MUST work with no network access after the first load.

- The runtime MUST NOT call a backend, API, CDN, or third-party service; all required assets MUST
  ship with the build.
- `site/` MUST remain a static GitHub Pages artifact. The native `www/` bundle MUST NOT register a
  service worker, while the web build MUST register `sw.js`.
- Assets needed for first-run offline use MUST be listed in the service worker precache, and the
  cache name MUST change whenever those bytes change.

Rationale: the app is used while configuring connectivity, often precisely when data is unavailable.

### II. Source-Traceable, Verification-Labelled Data (NON-NEGOTIABLE)
Every built-in carrier entry MUST carry `source` (HTTPS), `sourceLabel`, and an explicit `status`.

- `official` MUST require an operator-owned, regulator, or equally authoritative source. Third-party,
  community, or unconfirmed values MUST NOT be `official`; use `reference`, `unverified`, or
  `upcoming`, and MUST NOT render them with verified styling.
- An MVNO APN MUST NOT be inferred from its host network's APN. Unknown fields MUST remain blank
  rather than guessed; alternatives MAY be listed only with their own status and source.
- Every catalog change MUST update the "data reviewed" date in `src/catalog.mjs` and include a test
  asserting the new status/APN pair.

Rationale: users may copy these values into device settings; a wrong APN looks identical to a right
one until connectivity fails.

### III. Local-Only, Bounded User Data
- Saved IDs and custom profiles MUST persist only in browser `localStorage`; the app MUST NOT
  transmit profiles, device identifiers, or telemetry.
- Custom input MUST pass `validateCustomProfile` before storage, export, or import. Imports MUST
  enforce the size, format-version, and 200-profile limits and MUST drop IDs not present in the
  catalog.
- Custom profiles MUST carry `status: custom` and MUST NOT receive carrier logos or verification
  badges.
- The JSON backup format MUST remain backward compatible, or its version MUST be bumped with a
  migration path and updated parser tests.

### IV. Honest Platform Boundaries
- The app MUST NOT claim or imply that it writes system APN settings. Android reference XML MUST
  retain the `reference-only` marker, and iOS guidance MUST show no APN when `iosAuto` is true.
- Build artifacts MUST be described exactly: debug APK, simulator `.app`, unsigned IPA, and signed
  IPA are distinct deliverables.
- UI copy and documentation MUST state operator and OS restrictions instead of hiding them.

### V. Escaped-by-Default, Test-Gated Simplicity
- All dataset and user-derived values rendered into HTML or XML MUST pass through `escapeHtml` or
  `escapeXml`; unescaped interpolation is prohibited.
- The web app MUST remain framework-free ES modules with no runtime bundler. A new runtime
  dependency MUST be justified in the feature plan with its offline and bundle-size impact.
- `npm test` MUST pass before merge. Catalog/build parity, service-worker handling, logo
  attribution, and CI workflow invariants MUST remain covered by `node:test`.
- Prefer the smallest ES module and the existing `node:test` harness over new tooling; delete dead
  code rather than layering shims.

## Additional Constraints

- **Stack**: static HTML/CSS/ESM, Capacitor 8 wrappers, GitHub Pages deployment, Node.js build
  scripts. No server-side runtime.
- **Brand assets**: carrier logos MUST be bundled locally, mapped one-to-one to carrier IDs with
  HTTPS `source` attribution; brand artwork remains outside the MIT license (see
  `assets/carriers/README.md`).
- **Secrets**: Apple and Android signing material MUST live only in GitHub Actions secrets or local
  keystores; certificates, profiles, and keys MUST NEVER be committed.
- **Network surface**: at runtime the app MUST make no cross-origin requests; build-time downloads
  (for example the carrier logo fetch) run only in maintainer or CI scripts.

## Development Workflow & Quality Gates

- New behavior MUST follow the Spec Kit flow: constitution → `/speckit.specify` → `/speckit.plan` →
  `/speckit.tasks` → `/speckit.implement`; each feature's spec, plan, and tasks live under `specs/`.
- Before merge, run `npm test`, `npm run build:site`, and `npm run build:web`; then exercise the
  changed UI path in a browser, or in the native wrapper when applicable.
- Data changes MUST include the source URL, a status decision, and test coverage; workflow changes
  MUST keep the assertions in `tests/workflow.test.mjs` green.
- Reviews MUST verify constitution compliance and MUST name any justified deviation.

## Governance

This constitution supersedes conflicting conventions in the repository. Amendments are made through
`/speckit.constitution`, require a Sync Impact Report, and MUST keep dates in ISO `YYYY-MM-DD` form.

**Versioning policy**:

- **MAJOR**: a principle is removed or redefined in a backward-incompatible way.
- **MINOR**: a principle or section is added, or guidance is materially expanded.
- **PATCH**: clarifications, wording, and typo fixes with no semantic change.

**Compliance**: every change review MUST check the affected principles; unresolved conflicts MUST be
raised before merge. Added complexity MUST be justified against Principle V. The active feature spec
under `specs/` and `README.md` provide runtime development guidance where this document is silent.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
