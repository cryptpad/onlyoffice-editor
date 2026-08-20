#!/usr/bin/env node
/**
 * (c) Copyright Ascensio System SIA 2010-2024
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 */

/**
 * Check D — browser-target consistency gate (data-driven).
 *
 * The contracts live in build/browser-floor.manifest.mjs (TARGET_CONTRACTS,
 * REQUIRED_ENGINES); this script is a generic runner. To add a config consumer or a
 * required engine, edit the manifest — never this file.
 *
 * Asserts:
 *   1. framework7-react/package.json has no `browserslist` key (floor lives only in
 *      browser-floor.mjs).
 *   2. every TARGET_CONTRACTS config imports browser-floor.mjs AND wires the floor via
 *      the named export. Positive assertion: a hardcoded literal (any shape) never
 *      matches `target: ESBUILD_TARGET`, so every hardcode form is caught WITHOUT the
 *      gate needing to know what a target literal looks like.
 *   3. every REQUIRED_ENGINES engine is present in both ESBUILD_TARGET and BROWSERSLIST
 *      (presence only — the gate does not validate version values in the queries).
 *
 * Run as part of Phase 5 gates (BUILD_ROOT not needed).
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ESBUILD_TARGET, BROWSERSLIST }       from '../browser-floor.mjs';
import { TARGET_CONTRACTS, REQUIRED_ENGINES } from '../browser-floor.manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '../..');
const F7_DIR    = path.join(ROOT, 'vendor', 'framework7-react');

let failed = false;
const fail = msg => { console.error(`verify-browser-target: FAIL  ${msg}`); failed = true; };
const ok   = msg =>   console.log(`verify-browser-target: ok    ${msg}`);

// 1. No browserslist key in package.json — the floor lives only in browser-floor.mjs.
const pkg = JSON.parse(fs.readFileSync(path.join(F7_DIR, 'package.json'), 'utf8'));
if (pkg.browserslist) {
    fail('vendor/framework7-react/package.json still has a "browserslist" key — delete it; floor lives in browser-floor.mjs');
} else {
    ok('package.json has no browserslist key');
}

// 2. Each consumer imports the source AND wires the floor via the named export.
for (const c of TARGET_CONTRACTS) {
    const abs = path.join(ROOT, c.file);
    if (!fs.existsSync(abs)) {
        fail(`${c.file} — config missing or moved (update TARGET_CONTRACTS in browser-floor.manifest.mjs)`);
        continue;
    }
    const src = fs.readFileSync(abs, 'utf8');
    if (!src.includes('browser-floor.mjs')) {
        fail(`${c.file} — does not import browser-floor.mjs`);
    } else if (!c.wires.test(src)) {
        fail(`${c.file} — must wire ${c.label} from browser-floor.mjs (no hardcoded target)`);
    } else {
        ok(`${c.file} — ${c.label} wired from source`);
    }
}

// 3. Each required engine present in both the esbuild target and the browserslist.
for (const e of REQUIRED_ENGINES) {
    if (!ESBUILD_TARGET.some(t => e.esbuild.test(t))) {
        fail(`ESBUILD_TARGET missing ${e.label} entry — floor unguarded`);
    } else if (!BROWSERSLIST.some(q => e.browserslist.test(q))) {
        fail(`BROWSERSLIST missing ${e.label} entry — floor unguarded`);
    } else {
        ok(`${e.label} floor present`);
    }
}

// ---- result -----------------------------------------------------------------
if (failed) {
    console.error('verify-browser-target: FAILED');
    process.exit(1);
}

console.log('verify-browser-target: all checks passed');
