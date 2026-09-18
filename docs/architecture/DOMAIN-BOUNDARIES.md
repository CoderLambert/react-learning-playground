# Domain Boundaries

This document describes the target dependency direction enforced by the repository architecture gate. The machine-readable source of truth is `architecture/ownership-manifest.mjs`; temporary exceptions are recorded in `architecture/debt-register.mjs`.

## Dependency model

```text
App / app-integration
        |
        +--> curated domain public capabilities
                 |
                 +--> domain application / domain logic
                          |
                          +--> domain infrastructure / ports
                                   |
                                   +--> platform / neutral primitives
```

Rules:

1. `app-integration` owns cross-domain composition. Peer domains do not assemble another domain's runtime implementation.
2. A tracked peer domain may consume AI, Assessment, or Workbench only through that target domain's curated `public.js` entry unless a temporary debt item explicitly records the current legacy crossing.
3. A domain's `public.js` is intentionally small. Root `index.js` barrels are not automatically stable cross-domain contracts.
4. `src/platform/**` is neutral infrastructure and must not depend back on business domains.
5. `src/components/**` is physically mixed and is therefore a shared surface, not a single logical business owner. Ownership is derived from the feature using it.
6. Existing illegal crossings may be registered temporarily, but each entry requires a concrete source, target owner, owner, cleanup Issue, and removal condition. When the crossing disappears, the architecture test treats the now-stale debt entry as a failure so the ledger must shrink.
7. Required workflow/check identity is outside this architecture contract and must remain unchanged.

## Logical owners

| Owner | Primary surface | Notes |
| --- | --- | --- |
| `app-integration` | `src/App.jsx`, `src/main.jsx` | Cross-domain composition and application shell |
| `ai` | `src/ai/**` | Generic AI/application runtime; curated entry `src/ai/public.js` |
| `assessment` | `src/assessment/**` | Assessment application/domain/infrastructure; curated entry `src/assessment/public.js` |
| `workbench` | `src/workbench/**` | Workbench state/runtime; curated entry `src/workbench/public.js` |
| `learning-actions` | `src/learning-actions/**` | Learning-action contracts and prompt handoff |
| `content-source` | `src/source/**`, `src/content/**` | Source/content capabilities and learning material |
| `platform` | `src/platform/**` | Neutral browser/platform primitives; no reverse business dependency |
| `ci` | workflows, scripts, architecture metadata, package contract | Verification and tooling ownership |

## Shared integration surfaces

`architecture/ownership-manifest.mjs` marks the following as coordinated surfaces rather than normal owner-local files:

- `src/App.jsx` / `src/main.jsx`;
- `package.json` / `package-lock.json`;
- `.github/workflows/**`;
- `src/App.css` / `src/index.css`;
- `src/demos/index.js`;
- mixed `src/components/**` surfaces.

These follow the repository's one-writer-per-hotspot rule during a wave.

### Feature-owned component matrix

The following entries are the complete logical ownership matrix for the
currently feature-owned portion of `src/components/**`:

| Repository path | Logical owner | Browser impact |
| --- | --- | --- |
| `src/components/ai-assistant/**` | `ai` | `domain` |
| `src/components/learning-inspector/**` | `workbench` | `domain` |
| `src/components/notes/**` | `workbench` | `domain` |
| `src/components/source-viewer/**` | `content-source` | `domain` |
| `src/components/source-locator/**` | `content-source` | `domain` |
| `src/components/mdx/**` | `content-source` | `domain` |
| `src/components/ChapterCheckpoint.jsx` | `workbench` | `domain` |
| `src/components/chapterCheckpointMap.js` | `workbench` | `domain` |
| `src/components/CodeViewer.jsx` | `content-source` | `domain` |

Unlisted `src/components/**` paths, including generic `ui/**` and legacy flat
components, remain shared/unknown. They are not inferred from directory names
and therefore retain the browser classifier's FULL fallback.

## Architecture gate

`tests/architecture-boundaries.test.mjs` is automatically included by the canonical required-test inventory. It verifies:

- static imports, side-effect imports, export-from statements and literal dynamic imports;
- extensionless imports and `?query` / `#fragment` normalization;
- tracked peer-domain deep imports;
- platform reverse dependencies;
- domain dependency cycles after registered legacy debt is excluded;
- debt-ledger freshness and required cleanup metadata;
- curated AI / Assessment / Workbench public entries without `export *` mega-barrels.
- feature-owned component paths from the exact matrix above, including peer
  deep-import rejection and curated public-entry acceptance fixtures;
- the `learning-actions/index.js` public façade used by cross-feature callers.
- the JS-only `learning-actions/public.js` façade used where cross-feature
  protocol consumers must also load in Node-side contract tests.

The ownership manifest also exposes `getBrowserImpactOwnership(path)`. Unknown paths deliberately resolve to `browserImpact: "full"`; #182 can reuse this taxonomy instead of maintaining an independent path-ownership model.

## Current temporary debt

There are currently no registered architecture debt exceptions. Peer-domain dependencies must satisfy the architecture gate directly; any future temporary exception requires an explicit Scope Drift/architecture decision under `issue-rule.md`, a concrete crossing identity, an owner, a cleanup Issue, and a removal condition.
