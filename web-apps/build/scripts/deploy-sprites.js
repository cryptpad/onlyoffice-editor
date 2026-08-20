#!/usr/bin/env node
// Replaces build/sprites/Gruntfile.js + sprites.sh — no grunt, no npm install per run.
//
// Produces:
//   apps/common/main/resources/img/toolbar/icons.svg          (all-editors sprite)
//   apps/<editor>/main/resources/img/toolbar/icons.svg        (per-editor sprites ×5)
//   apps/common/main/resources/img/doc-formats/formats@2.5x.svg
//
// Invariants preserved from the Gruntfile (must not regress):
//   shape.id = bare filename (no path prefix)
//   SVGO disabled for toolbar sprites (svg-sprite's bundled SVGO has a Node 18
//     callback bug — and the icons don't need it anyway)
//   mode.symbol.inline:true  → <svg width="0" height="0" style="position:absolute">
//   mode.symbol.inline:false → plain <svg xmlns="…"> for docformats

'use strict';

const path    = require('path');
const fs      = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const APPS      = path.join(REPO_ROOT, 'apps');

// ---- helpers ----------------------------------------------------------------

function globDir(dir, ext = '.svg') {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith(ext) && !f.startsWith('.'))
        .sort()
        .map(f => path.join(dir, f));
}

// Convert one SVG source file into a <symbol> string.
// Preserves all root attributes except width/height; adds id="<basename>".
function svgToSymbol(file) {
    const content = fs.readFileSync(file, 'utf8');

    // Extract root <svg ...> opening tag (handles multi-line)
    const tagMatch = content.match(/<svg([\s\S]*?)>/);
    if (!tagMatch) throw new Error(`No <svg> in ${file}`);

    // Parse attributes: key="value" or key='value'
    const attrStr = tagMatch[1];
    const attrRe  = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    const attrs   = {};
    let m;
    while ((m = attrRe.exec(attrStr)) !== null) {
        attrs[m[1]] = m[2] !== undefined ? m[2] : m[3];
    }

    // Synthesize viewBox from width/height when absent (matches svg-sprite behaviour)
    if (!attrs.viewBox && attrs.width !== undefined && attrs.height !== undefined) {
        attrs.viewBox = `0 0 ${attrs.width} ${attrs.height}`;
    }

    delete attrs.width;
    delete attrs.height;

    const id      = path.basename(file, '.svg');
    const attrOut = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');

    // Strip opening <svg...> and closing </svg>; keep inner content
    const inner = content
        .replace(/<svg[\s\S]*?>/, '')
        .replace(/<\/svg>\s*$/, '');

    return `<symbol ${attrOut} id="${id}">${inner}</symbol>`;
}

function writeSprite(srcs, destFile, inline) {
    const symbols = srcs.map(svgToSymbol).join('');
    const svg = inline
        ? `<svg width="0" height="0" style="position:absolute">${symbols}</svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, svg);
}

// ---- sprite definitions -----------------------------------------------------

const EDITORS = [
    { name: 'word',  dir: 'documenteditor'     },
    { name: 'cell',  dir: 'spreadsheeteditor'  },
    { name: 'slide', dir: 'presentationeditor' },
    { name: 'pdf',   dir: 'pdfeditor'          },
    { name: 'draw',  dir: 'visioeditor'        },
];

function toolbarSrcs(editorDir) {
    const common = path.join(APPS, 'common', 'main', 'resources', 'img', 'toolbar', 'v2', '2.5x');
    const editor = path.join(APPS, editorDir, 'main', 'resources', 'img', 'toolbar', 'v2', '2.5x');
    return [
        // order matches Gruntfile: common small → big → huge, then editor small → big → huge
        ...globDir(common),
        ...globDir(path.join(common, 'big')),
        ...globDir(path.join(common, 'huge')),
        ...globDir(editor),
        ...globDir(path.join(editor, 'big')),
        ...globDir(path.join(editor, 'huge')),
    ];
}

function allEditorToolbarSrcs() {
    // "toolbar" all-editors sprite: same glob order as Gruntfile generate_svg_sprite_task
    const common = path.join(APPS, 'common', 'main', 'resources', 'img', 'toolbar', 'v2', '2.5x');
    const files  = [
        ...globDir(common),
        ...globDir(path.join(common, 'big')),
        ...globDir(path.join(common, 'huge')),
    ];
    for (const { dir } of EDITORS) {
        const e = path.join(APPS, dir, 'main', 'resources', 'img', 'toolbar', 'v2', '2.5x');
        files.push(
            ...globDir(e),
            ...globDir(path.join(e, 'big')),
            ...globDir(path.join(e, 'huge')),
        );
    }
    return files;
}

// ---- docformats: uses svgo to strip xmlns from each symbol ------------------

async function writeDocformats(destFile) {
    // svgo is already in build/node_modules (used by deploy-common.js)
    const { optimize } = await import('svgo');

    const srcDir = path.join(APPS, 'common', 'main', 'resources', 'img', 'doc-formats');
    const srcs   = globDir(srcDir).filter(f => path.basename(f) !== 'formats@2.5x.svg');

    const symbolStrs = srcs.map(file => {
        const raw      = fs.readFileSync(file, 'utf8');
        const result   = optimize(raw, { plugins: ['removeXMLNS'] });
        const content  = result.data || raw;

        const tagMatch = content.match(/<svg([\s\S]*?)>/);
        if (!tagMatch) throw new Error(`No <svg> in ${file}`);

        const attrRe = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
        const attrs  = {};
        let m;
        while ((m = attrRe.exec(tagMatch[1])) !== null) {
            attrs[m[1]] = m[2] !== undefined ? m[2] : m[3];
        }
        delete attrs.width;
        delete attrs.height;
        delete attrs.xmlns;  // removeXMLNS equivalent for the symbol wrapper

        const id      = path.basename(file, '.svg');
        const attrOut = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
        const inner   = content
            .replace(/<svg[\s\S]*?>/, '')
            .replace(/<\/svg>\s*$/, '');

        return `<symbol ${attrOut} id="${id}">${inner}</symbol>`;
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbolStrs.join('')}</svg>`;
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, svg);
    return srcs.length;
}

// ---- main -------------------------------------------------------------------

async function main() {
    // Per-editor toolbar sprites
    for (const { name, dir } of EDITORS) {
        const srcs = toolbarSrcs(dir);
        const dest = path.join(APPS, dir, 'main', 'resources', 'img', 'toolbar', 'icons.svg');
        writeSprite(srcs, dest, true);
        process.stdout.write(`  deploy-sprites: ${name} (${srcs.length} icons)\n`);
    }

    // Common all-editors toolbar sprite
    const allSrcs    = allEditorToolbarSrcs();
    const commonDest = path.join(APPS, 'common', 'main', 'resources', 'img', 'toolbar', 'icons.svg');
    writeSprite(allSrcs, commonDest, true);
    process.stdout.write(`  deploy-sprites: common (${allSrcs.length} icons)\n`);

    // Docformats sprite
    const docfmtDest = path.join(APPS, 'common', 'main', 'resources', 'img', 'doc-formats', 'formats@2.5x.svg');
    const n = await writeDocformats(docfmtDest);
    process.stdout.write(`  deploy-sprites: docformats (${n} icons)\n`);

    process.stdout.write('  deploy-sprites: done\n');
}

main().catch(err => {
    process.stderr.write(`deploy-sprites: ${err.message}\n${err.stack}\n`);
    process.exit(1);
});
