# sdkjs — Euro-Office JavaScript SDK

Guidance for AI agents working in **sdkjs** — the Euro-Office JavaScript SDK for the document
editors. This is the canonical instruction file; `CLAUDE.md` points here.

## What this repo is

sdkjs is the client-side engine for five document editors: **word** (text documents),
**cell** (spreadsheets), **slide** (presentations), **pdf** (viewer/annotator/editor), and
**visio** (diagrams). It is a hard fork of `ONLYOFFICE/sdkjs`, rebranded to Euro-Office, and
still periodically syncs from upstream (`git.onlyoffice.com`).

It is **not** an npm package. The build concatenates+minifies the sources into per-editor
bundles (`sdk-all.js` / `sdk-all-min.js`) that the sibling **web-apps** repo loads via
`<script>` tags. sdkjs lives in a multi-repo workspace alongside `web-apps` (the UI/toolbars),
`core` (the C++/WASM engine, fonts, x2t converter), `server`, and `DocumentServer`. Licensed
**AGPL v3** (GUI assets are CC-BY-SA 4.0).

## Repository layout

| Path        | Purpose |
| :---------- | :------ |
| `common/`   | Shared, editor-agnostic engine: base API, history/undo, co-editing, drawings, charts, fonts, formatting (DrawingML), serialization. Everything below depends on it. |
| `word/`     | Text-document editor + document model (`Editor/`), drawings, math, native overrides (`Local/`). |
| `cell/`     | Spreadsheet editor: `model/` (workbook + formula engine), `view/` (rendering), `graphics/`. |
| `slide/`    | Presentation editor + themes/textures. |
| `pdf/`      | PDF editor; `src/` is the implementation, `build/` a compiled wrapper, `test/` a harness. |
| `visio/`    | Diagram editor with its own VSDX serialization (`model/`). |
| `build/`    | Grunt build: `Gruntfile.js`, `package.json`, `license.header`. Run grunt from **here**. |
| `configs/`  | `<editor>.json` file-lists that drive the build (load order); `externs.json` for Closure. |
| `tests/`    | QUnit suites per editor + `code-style/check.py` (the lint gate). |
| `vendor/`   | Third-party libs (jQuery, XRegExp, etc.). Excluded from lint/build minification. |
| `tools/`    | One-off Python maintenance scripts (color schemes, SVG cursors). |

## Build & develop

For Docker dev environment setup (running the full server stack), see [/DocumentServer/AGENTS.md](../DocumentServer/AGENTS.md).

Requires **Node.js** and, for the full compile, **Java** (the build uses Google Closure
Compiler, pinned to `google-closure-compiler@20240317`). There is **no root `package.json`**;
all build deps live in `build/`.

```bash
# Full SDK build (release; ADVANCED minification). Run from build/.
cd build && npm install -g grunt-cli && npm ci && grunt
# Outputs: ../deploy/sdkjs/{word,cell,slide,visio}/sdk-all-min.js + sdk-all.js
```

```bash
# Debug/dev loop — NO recompile, NO Java needed. Run from build/.
grunt develop              # writes ../develop/sdkjs/<editor>/scripts.js listing the
                           # individual source files, so editors/tests load unminified sources
grunt develop --compiled   # same manifest, but pointing at the compiled bundles
```

Day-to-day inner loop: edit a source file → `grunt develop` → reload the editor/test page.
You only need the full `grunt` (Closure) build to produce release/min bundles.

Other flags: `--desktop=true` (desktop-only files), `--mobile=true`, `--map` (source maps),
`--level=WHITESPACE_ONLY` (faster, readable output), `--addon=sdkjs-forms` (merges an external
addon repo's `configs/`).

**`make` is NOT the SDK build.** The Makefile's default target also builds the sibling
`../web-apps` repo and requires it to be checked out next to sdkjs; it is the integration
build. Use `grunt` in `build/` for SDK-only work. (The Makefile's `SDKJS_FILES` is also stale —
it lists only `word/sdk-all.js` though grunt builds all editors.)

### Adding a source file

There are **no ES modules and no tree-shaking** — files are plain scripts concatenated in the
order listed in `configs/<editor>.json`. A new `.js` is invisible to the build until you add it
to the right array inside the top-level `sdk` object in the config (`sdk` → `min` = core engine
→ `sdk-all-min.js`; `sdk` → `common` = the rest → `sdk-all.js`; also `desktop`, `mobile`,
`exclude_mobile`). There is no flat key called `sdk.min` — grep for `"min":` inside the `sdk`
block. Order matters: dependencies must appear before dependents (e.g. `apiCommon.js`
before `api.js`).

## Tests

QUnit suites run headless via `node-qunit-puppeteer`, **from the repo root**:

```bash
# one-time setup (from repo root)
npm install grunt-cli node-qunit-puppeteer
npm install --prefix build
node node_modules/grunt-cli/bin/grunt --gruntfile build/Gruntfile.js develop

# run a single suite
node node_modules/node-qunit-puppeteer/cli.js tests/word/api/api.html 30000 "--no-sandbox"
```

CI (`.github/workflows/check-build.yml`, self-hosted runners) enumerates suites explicitly —
there is **no working aggregate runner** (`tests/runAll.js` exists but CI doesn't use it).

**CI branch scope:** `check-build.yml` triggers on push and pull_request for `fork`, `develop`,
`release/**`, and `hotfix/**`. It does **not** run on `main` — PRs targeting `main` are not
CI-guarded by this workflow.

Heaviest coverage is in `tests/cell/spreadsheet-calculation/` (formula engine) and
`tests/word/`. Suites depend on the generated `develop/sdkjs/*/scripts.js`, so run
`grunt develop` first.

## Code style — the build-breakers

The **only** enforced lint gate is `python tests/code-style/check.py` (run from repo root).
ESLint config (`.eslintrc.yaml`) exists but is **not** wired into CI. `check.py` fails the build
if any `.js` (outside `vendor/` and `externs/`) does not:

1. contain the AGPL header string `Copyright Ascensio System`,
2. contain the literal `LV-1050`,
3. use LF line endings (no CRLF), and
4. end with a trailing newline.

⚠️ **Known divergence:** the Euro-Office fork removed the `LV-1050` Latvian address from *every*
header, but `check.py` still checks for it — so **`check.py` currently fails at the
Latvian-address step** on a clean checkout. Don't "fix" this by re-adding `LV-1050` to files;
match the existing header (which omits it). Treat the upstream check script as out of sync with
the fork.

Every source file starts with the AGPL block (copy an existing file's header verbatim), then:

```js
"use strict";
(function(window, undefined)
{
	// ... module body ...
})(window);
```

Conventions to follow:

- **Globals, not modules.** Publish symbols onto window namespaces, assigning **both**
  `window['Name'].Sym = window.Name.Sym = Sym` (bracket form survives Closure minification).
- **Naming:** public editor methods `asc_*` (e.g. `asc_getCanUndo`); property accessors
  `get_X` / `put_X` (plain methods, not real JS properties); enums/constants `c_oAsc*`
  (in `apiDefines.js` / `commonDefines.js`); internal classes `C`-prefixed (`CDocument`,
  `CColor`). Events fire via `this.sendEvent('asc_onXxx', ...)`; listeners via
  `asc_registerCallback`.
- **Indentation: tabs.**
- Never hand-edit generated artifacts: `deploy/.../sdk-all*.js` and
  `develop/sdkjs/*/scripts.js` are build output.

## Architecture notes

### Global namespaces (set on `window`)

| Namespace | Meaning |
| :-------- | :------ |
| `Asc` | Public editor API, enums, error codes, `asc_*` classes. The editor singleton is `Asc.editor` (and `window.editor`). |
| `AscCommon` | Shared engine: `baseEditorsApi`, History, `TableId`, collaborative editing, utilities. |
| `AscFormat` | OOXML DrawingML / shared formatting & drawing types (shapes, fills). |
| `AscDFH` | Change/history factory (`AscDFH.changesFactory[...]`, history-point descriptions). |
| `AscCommonWord` / `AscWord` | Word document-model internals. |
| `AscCommonExcel` | Spreadsheet model (workbook, cells, `cFormulaFunction` map). |
| `AscPDF` / `AscViewer` | PDF internals and the render/viewer layer. |
| `AscMath` | Equation engine. |
| `AscFonts` | Font system. |
| `AscDesktopEditor` | Bridge to the native desktop app (present only in desktop builds). |

### Per-editor API layers

Each editor dir has the same set of API files:

- `api.js` — the editor client API class (`asc_docs_api` for word/slide, `spreadsheet_api`
  for cell, `PDFEditorApi`, `VisioEditorApi`). Extends `AscCommon.baseEditorsApi` via
  `Object.create(...)`. These are large files (word/cell `api.js` are 10k–16k lines).
- `apiBuilder.js` — the **Document Builder** API (`Api*` classes, JSDoc-heavy, `get_/put_`
  accessors). Server-side / scripting surface, distinct from `api.js`. Wrapped in
  `(function(window, builder){...})`.
- `api_plugins.js` + `plugin-events.js` (+ `common/base-plugin-events.js`) — the plugin API
  and event typedefs.
- `fromToJSON.js` — serialization helpers + unit converters (MM/EMU/Twips/Px); note it also
  holds utilities like `private_GetLogicDocument()`.
- `apiDefines.js` — editor-specific `c_oAsc*` constants.

### Shared engine (`common/`)

- **Undo/redo & change tracking:** every document mutation creates a change object
  (`AscDFH.changesFactory`) recorded in `History` (`HistoryCommon.js`). `TableId.js` is an
  object registry mapping string IDs → document objects; required for both undo/redo and
  co-editing (changes reference objects by ID, not pointer).
- **Co-editing:** `docscoapi.js` (WebSocket transport) + `CollaborativeEditingBase.js` +
  `collaborativeHistory.js`. PDF reuses Word's collab model (`pdf/src/CollaborativeEditing.js`
  extends `CWordCollaborativeEditing`).
- **Drawings/Charts/Format:** large subsystems under `common/Drawings/`, `common/Charts/`,
  plus the `AscFormat` types — shared by all editors for shapes, charts, images.
- **Cell formula engine:** parser in `cell/model/FormulaObjects/parserFormula.js`; functions in
  the `AscCommonExcel.cFormulaFunction` map; recalculation orchestrated in `cell/model/Workbook.js`
  (`wbModel` = data model, `wb` = `WorksheetView` render/controller).

## Gotchas

- The editor instance lives in both `Asc.editor` and `window.editor` (desktop compat) — code
  often checks both.
- External callers must use bracket access (`window['Asc']['asc_docs_api']`); dot access on
  public names gets mangled by Closure ADVANCED minification.
- `make` pulls in `../web-apps`; for SDK-only work use `grunt` in `build/`.
- Use `npm ci` (not `npm install`) in `build/` to respect the committed `npm-shrinkwrap.json`.
- The full `grunt` build needs Java; `grunt develop` does not.

## Where future findings live

This file is orientation-only — keep it small. Long-tail findings (edge-case behaviours,
subsystem quirks, debugging recipes) belong in the findings store described in issue **#51**
(frontmatter docs + derived index + local vector DB cache). Once #51 lands, that store is the
canonical home; add new discoveries there, not here.
