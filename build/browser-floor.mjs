/**
 * SINGLE SOURCE OF TRUTH — supported-browser floor for mobile editors.
 *
 * Nextcloud policy: iOS 17 (Safari 17) + Android 9 (updatable WebView = Chrome 111+).
 * Binding constraint: Safari 17 ↔ ES2022. Never hardcode a target in any
 * webpack/babel/postcss config — verify-browser-target.mjs fails the build if you do.
 *
 * SCOPE: mobile editors only. The desktop editors are NOT governed by this file —
 * they ship the legacy OnlyOffice source un-transpiled (Terser minify-only,
 * mangle:false, no babel/esbuild target, no autoprefixer), so they have no explicit
 * floor to centralise; desktop's floor is implicit in its source. Do NOT "unify"
 * desktop onto this floor — transpiling the desktop source would risk the dynamic
 * property-access / `var Common = Common || {}` patterns (see build/README.md, the
 * "esbuild deferred for desktop" note).
 */

export const BROWSERSLIST   = ['iOS >= 17', 'Safari >= 17', 'chrome >= 111', 'not dead'];
export const ESBUILD_TARGET = ['safari17', 'chrome111'];

// The gate that enforces these values is data-driven from a sibling manifest:
// build/browser-floor.manifest.mjs (TARGET_CONTRACTS, REQUIRED_ENGINES),
// consumed by build/scripts/verify-browser-target.mjs.
