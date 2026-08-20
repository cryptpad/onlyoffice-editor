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
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 */

/**
 * Single source of truth for load-bearing string-replace-loader patterns.
 *
 * Consumed by:
 *   theme.config.mjs     — scoping + keymaster entries (search/flags only; replace stays there)
 *   webpack.editor.factory.mjs — locale-fetch entry
 *   build/scripts/verify-replacements.mjs — source-side preflight gate (Check A)
 *
 * Semantic:
 *   minCount  — fail if count drops below this (a drop means an idiom was refactored/removed)
 *   exact     — fail if count is not exactly this (singletons)
 *
 * Re-baseline procedure (when a count legitimately changes):
 *   1. Run node scripts/verify-replacements.mjs to confirm the new count.
 *   2. Update minCount/exact here.
 *   3. Commit the baseline change IN THE SAME COMMIT as the source change that caused it.
 *   A drop must never be re-baselined without confirming the dropped occurrences were
 *   genuinely removed (not refactored into an un-shimmed idiom).
 *
 * Entries with flags use the search string as a regex pattern.
 * Entries without flags are treated as literal strings (string-replace-loader behaviour).
 */
export const LOAD_BEARING = [
    {
        id:       'common-guard',
        search:   'if \\(Common === undefined\\)(?:\\s*\\{)?\\s+var Common = \\{\\};(?:\\s*\\})?',
        flags:    'g',
        minCount: 117,
    },
    {
        id:       'c_-const',
        search:   '^var (c_[a-zA-Z]+) = \\{',
        flags:    'gm',
        minCount: 23,
    },
    {
        id:       'ALLCAPS-const',
        search:   '^var ([A-Z][A-Z0-9_]+) = ',
        flags:    'gm',
        minCount: 13,
    },
    {
        id:    'keymaster-export',
        search: "if(typeof module !== 'undefined') module.exports = key;",
        exact:  1,
    },
    {
        id:    'keymaster-global',
        search: 'global.key = assignKey;',
        exact:  1,
    },
    {
        id:    'locale-fetch',
        search: 'if \\( !window\\.fetch \\) \\{[\\s\\S]*?\\} else _requireLang\\(\\);',
        flags:  'g',
        exact:  1,
    },
];
