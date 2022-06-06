import "./node.js";
import "../NamesOfLiterals.js";
import "../LaTeXParser.js";
import "./LaTeXList/fraction.js";
import "./LaTeXList/degree-tests.js";
import "./LaTeXList/brackets-test.js";
import "./LaTeXList/accents-tests.js";
import "./LaTeXList/numericFunctions-test.js";
import "./LaTeXList/sqrt-tests.js";
import "./LaTeXList/style-test.js";
import { assert } from "chai";

const parser = window.AscCommonWord.ConvertLaTeXToTokensList;
const accent = window.AscCommonWord.accents;
const fraction = window.AscCommonWord.fraction;
const degree = window.AscCommonWord.degree;
const brackets = window.AscCommonWord.brackets;
const numericFunctions = window.AscCommonWord.numericFunctions;
const sqrt = window.AscCommonWord.sqrt;
const style = window.AscCommonWord.style;

describe("Сhecking the health of fractions", function () {
	fraction(test);
});
describe("Сhecking the health of degrees and indexes", function () {
	degree(test);
});
describe("Сhecking the health of brackets", function () {
	brackets(test);
});
describe("Сhecking accents", function () {
 	accent(test);
});
describe("Сhecking standard numerical functions", function () {
	numericFunctions(test);
});
describe("Сhecking radical functions", function () {
	sqrt(test);
});
describe("Сhecking math fonts", function () {
	style(test);
});

function test(program, expected, description = "Без описания") {
	it(description, function () {
		const ast = parser(program, undefined, true);
		assert.deepEqual(ast, expected);
	});
}
