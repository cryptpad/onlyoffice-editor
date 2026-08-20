/**
 * Gate contracts for the mobile browser floor — DATA, consumed by
 * build/scripts/verify-browser-target.mjs (which is a generic runner).
 *
 * Sibling of browser-floor.mjs: the floor VALUES live there, the enforcement
 * contract lives here, the verifier consumes both — mirroring the established
 * theme.config.mjs ↔ replacements.manifest.mjs ↔ verify-replacements.mjs trio.
 * A values file should not encode where webpack's config lives or how it spells
 * its plugin options; that's contract data, so it belongs here.
 *
 * Adding a config consumer or a required engine is a new row here — never a code
 * change in the gate.
 */

// Each config must import browser-floor.mjs AND wire the floor via the named export
// (positive assertion — the value is the import, never a literal). New consumer? Add a row.
//
// Form-coupled: the value must directly follow the key. `\s*` spans newlines, so a
// multi-line `target:\n  ESBUILD_TARGET` still matches; a wrap like `[...ESBUILD_TARGET]`
// would (correctly) not — that is a different wiring and should be reviewed.
export const TARGET_CONTRACTS = [
  { file: 'vendor/framework7-react/build/webpack.config.js', wires: /target:\s*ESBUILD_TARGET\b/, label: 'webpack esbuild target' },
  { file: 'vendor/framework7-react/babel.config.js',         wires: /targets:\s*BROWSERSLIST\b/,  label: 'babel preset-env targets' },
  { file: 'vendor/framework7-react/postcss.config.js',       wires: /browsers:\s*BROWSERSLIST\b/, label: 'postcss browsers' },
];

// Engines the floor must cover in BOTH lists. New engine (e.g. Firefox)? Add a row.
export const REQUIRED_ENGINES = [
  { label: 'iOS/Safari',     esbuild: /^safari/, browserslist: /Safari|iOS/i },
  { label: 'Android/Chrome', esbuild: /^chrome/, browserslist: /and_chr|android|chrome/i },
];
