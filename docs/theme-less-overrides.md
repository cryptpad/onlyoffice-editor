# Theme LESS overrides

How brand/theme CSS is compiled into each editor bundle.

---

## File layout

```
theme/euro-office/assets/less/
  theme.less          ← entry: brand variables (@nc-primary etc.) + @import "overrides.less"
  overrides.less      ← @import each override file
  overrides/
    header.less       ← per-editor header logo (body[data-editor-type="…"] selectors)
    about.less        ← about dialog logo
```

`theme.less` is the only file you need to know about. It defines brand variables
and pulls in all override files via `overrides.less`. Adding a new override means
adding a file and one `@import` line — nothing in `build/` or `apps/` changes.

---

## How it gets compiled

`theme.config.mjs` writes a one-line redirector stub at build startup:

```
apps/common/main/resources/less/_theme-main.less
  → @import "../../../../../theme/euro-office/assets/less/theme.less";
```

Each editor's `app.less` imports the stub at the end:

```less
@import "../../../../common/main/resources/less/_theme-main.less";
```

This pulls `theme.less` into the same LESS compilation scope as the rest of the
editor CSS, so theme variables get last-write-wins precedence over upstream
defaults. `_theme-main.less` is gitignored — it is regenerated on every build.

### Why a redirector stub rather than a copy

If `theme.less` were copied into place, its own relative imports would break:

```less
/* inside theme.less */
@import "overrides.less";   /* resolves relative to theme.less's location */
```

After copying, LESS would look for `overrides.less` next to the copy — not found.
The stub avoids this: the single `@import` line tells LESS to compile `theme.less`
in its original location, so all of its relative imports resolve correctly.

---

## Adding a new override

1. Create `theme/euro-office/assets/less/overrides/<name>.less`
2. Add `@import "overrides/<name>";` to `theme/euro-office/assets/less/overrides.less`
3. Rebuild — the new rules appear in every editor's `app.css`

No changes to `build/` or `apps/` are needed.

---

## Image paths in overrides

`url()` references in override LESS (e.g. `icon-document.svg`) are relative to
the compiled CSS output file, which sits at `apps/<editor>/main/app.css`. Theme
images are deployed from `theme/euro-office/assets/img/` to `BUILD_ROOT` by
`deploy-theme-images.js` (Phase 2 of the build pipeline). The path convention in
`overrides/header.less` uses `@{common-image-const-path}/header/…`, which expands
to `../../../../common/main/resources/img/header/…` relative to the CSS file.
