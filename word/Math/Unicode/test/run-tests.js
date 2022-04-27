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
