/*
 * (c) Copyright Ascensio System SIA 2010-2019
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
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

var literalTests = require("./list/literal-tests").literalTests;
var fractionTest = require("./list/fraction-test").fractionTest;
var sqrtTests = require("./list/sqrt-tests").sqrtTests;
var scriptTests = require("./list/script-tests").striptTests;
var belowAbove = require("./list/aboveAndBelow-test").testAboveBelow;
var hbrackTests = require("./list/hbrack-tests").hbrackTests;
var bracketsTest = require("./list/brackets-test").bracketsTest;
var compltexTest = require("./list/complex-stuff").compltexTest;
var boxTest = require("./list/box-tests").boxTest;
var special_scripts = require("./list/special_scripts-tests").specialTest;

var CUnicodeConverter = require("../UnicodeParser.js");
var assert = require("chai").assert;

// const arr = [
// 	"∑",
// 	"⅀",
// 	"⨊",
// 	"∏",
// 	"∐",
// 	"⨋",
// 	"∫",
// 	"∬",
// 	"∭",
// 	"⨌",
// 	"∮",
// 	"∯",
// 	"∰",
// 	"∱",
// 	"⨑",
// 	"∲",
// 	"∳",
// 	"⨍",
// 	"⨎",
// 	"⨏",
// 	"⨕",
// 	"⨖",
// 	"⨗",
// 	"⨘",
// 	"⨙",
// 	"⨚",
// 	"⨛",
// 	"⨜",
// 	"⨒",
// 	"⨓",
// 	"⨔",
// 	"⋀",
// 	"⋁",
// 	"⋂",
// 	"⋃",
// 	"⨃",
// 	"⨄",
// 	"⨅",
// 	"⨆",
// 	"⨀",
// 	"⨁",
// 	"⨂",
// 	"⨉",
// 	"⫿",
// 	"(",
// 	"[",
// 	"{",
// 	"〈",
// 	")",
// 	"]",
// 	"}",
// 	"〉",
// 	"├",
// 	"┤",
// 	"┬",
// 	"┴",
// 	"▁",
// 	"¯",
// 	"▭",
// 	"□",
// 	"&",
// 	"▒",
// 	"^",
// 	"_",
// 	"¦",
// 	"√",
// 	"∛",
// 	"∜",
// 	"⊘",
// 	"/",
// 	",",
// 	".",
// 	"⏜",
// 	"⏝",
// 	"⎴",
// 	"⎵",
// 	"⏞",
// 	"⏟",
// 	"⏠",
// 	"⏡",
// 	"&",
// 	"■",
// ];

// describe("Проверка литералов из операторов", function () {
//   arr.forEach((literal) => li_test("\\" + literal));
// });

describe("Проверка работоспособности простых литералов", function () {
	literalTests(test);
});
describe("Проверка работоспособности деления", function () {
	fractionTest(test);
});
describe("Проверка работоспособности радикалов", function () {
	sqrtTests(test);
});
describe("Проверка работоспособности скриптов", function () {
	scriptTests(test);
});
describe("Проверка работоспособности below/above", function () {
	belowAbove(test);
});
describe("Проверка работоспособности hBrack", function () {
	hbrackTests(test);
});
describe("Проверка работоспособности скобок", function () {
	bracketsTest(test);
});
describe("Проверка работоспособности комплексных выражений", function () {
	compltexTest(test);
});
describe("Проверка box", function () {
	boxTest(test);
});
describe("Проверка special_scripts", function () {
	special_scripts(test);
});

function test(program, expected, description = "Без описания") {
	it(description, function () {
		const ast = CUnicodeConverter(program);
		assert.deepEqual(
			ast,
			expected
			// `Get:\n${JSON.stringify(ast, null, 2)}
			// Expected:\n${JSON.stringify(expected, null, 2)}`
		);
	});
}

// function li_test(literal) {
// 	it(`Проверка литерала: ${literal}`, function () {
// 		const ast = parser.parse(literal);
// 		let expected = {
// 			type: "Root",
// 			body: {
// 				type: "expLiteral",
// 				value: [
// 					{
// 						type: "CharLiteral",
// 						value: `${literal}`,
// 					},
// 				],
// 			},
// 		};
// 		chai.assert.deepEqual(
// 			ast,
// 			expected,
// 			`Get:\n${JSON.stringify(ast, null, 2)}
// 			Expected:\n${JSON.stringify(expected, null, 2)}`
// 		);
// 		expected = undefined;
// 	});
// }
