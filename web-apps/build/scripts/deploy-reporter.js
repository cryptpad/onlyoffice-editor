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

'use strict';

// Gap 4: presentationeditor reporter view — replaces grunt's deploy-reporter task.
//
// grunt's deploy-reporter does three things:
//   1. terser-minify app.reporter.js → BUILD_ROOT  (this script)
//   2. copy index.reporter.html.deploy → index.reporter.html  (deploy-html.js)
//   3. inline ?__inline=true scripts in index.reporter.html  (inline-svgs.js)
//
// This script only handles step 1. Steps 2 and 3 are covered by deploy-html.js
// and inline-svgs.js respectively — run all three as part of the full pipeline.
//
// Run from web-apps/build/:
//   BUILD_ROOT=/var/www/... node scripts/deploy-reporter.js
//
// BUILD_ROOT must be set. PRODUCT_VERSION and APP_COPYRIGHT are optional.

const fs   = require('fs');
const path = require('path');
const { minify } = require('terser');
const { ensureDir } = require('./lib/build-utils');

const REPO_ROOT  = path.resolve(__dirname, '..', '..');
const BUILD_ROOT = process.env.BUILD_ROOT;

if (!BUILD_ROOT) {
    console.error('deploy-reporter: BUILD_ROOT must be set');
    process.exit(1);
}

const COMMON_JSON  = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'build', 'common.json'), 'utf8'));
const PKG_VERSION  = process.env.PRODUCT_VERSION || COMMON_JSON.version;
const PKG_BUILD    = process.env.BUILD_NUMBER    || COMMON_JSON.build;
const PKG_HOMEPAGE = COMMON_JSON.homepage || 'http://www.onlyoffice.com';

// Mirrors grunt's copyright variable (Gruntfile:33-39).
// APP_COPYRIGHT env var overrides the default header, matching grunt's behaviour.
const copyrightHeader = process.env.APP_COPYRIGHT
    || `Copyright (c) Ascensio System SIA ${new Date().getFullYear()}. All rights reserved`;

const PREAMBLE = [
    '/*!',
    ` * ${copyrightHeader}`,
    ` *`,
    ` * ${PKG_HOMEPAGE}`,
    ` *`,
    ` * Version: ${PKG_VERSION} (build:${PKG_BUILD})`,
    ` */`,
].join('\n');

const SRC  = path.join(REPO_ROOT, 'apps', 'presentationeditor', 'main', 'app.reporter.js');
const DEST = path.join(BUILD_ROOT, 'web-apps', 'apps', 'presentationeditor', 'main', 'app.reporter.js');

(async () => {
    const source = fs.readFileSync(SRC, 'utf8');
    const result = await minify(source, {
        format: {
            comments: false,
            preamble: PREAMBLE,
        },
    });
    ensureDir(path.dirname(DEST));
    fs.writeFileSync(DEST, result.code, 'utf8');
    console.log('deploy-reporter: app.reporter.js done');
})().catch(err => {
    console.error('deploy-reporter failed:', err.message || err);
    process.exit(1);
});
