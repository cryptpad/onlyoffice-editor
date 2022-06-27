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

(function (window) {
	/**
	 * @typedef {Object} LiteralType
	 * @property {number} index Индекс литерала
	 * @property {string} nameOfLiteral Название литерала
	 */
	/**
	 * @param {Object.<number, LiteralType>} LiteralTypesList
	 */
	const oNamesOfLiterals = {
		fractionLiteral: [0, "FractionLiteral"],
		spaceLiteral: [1, "SpaceLiteral"],
		charLiteral: [2, "CharLiteral"],
		accentLiteral: [4, "AccentLiteral"],
		operatorLiteral: [5, "OperatorLiteral"],
		binomLiteral: [6, "BinomLiteral"],
		bracketBlockLiteral: [7, "BracketBlock"],
		functionLiteral: [8, "FunctionLiteral"],
		subSupLiteral: [9, "SubSupLiteral"],
		sqrtLiteral: [10, "SqrtLiteral"],
		numberLiteral: [11, "NumberLiteral"],
		mathOperatorLiteral: [12, "MathOperatorLiteral"],
		rectLiteral: [13, "RectLiteral"],
		boxLiteral: [14, "BoxLiteral"],
		preScriptLiteral: [15, "PreScriptLiteral"],
		mathFontLiteral: [16, "MathFontLiteral"],
		overLiteral: [17, "OverLiteral"],
		diacriticLiteral: [18, "DiacriticLiteral"],
		diacriticBaseLiteral: [19, "DiacriticBaseLiteral"],
		otherLiteral: [20, "OtherLiteral"],
		anMathLiteral: [21, "AnMathLiteral"],
		opBuildupLiteral: [22, "opBuildUpLiteral"],
		opOpenBracket: [23, "opOpenLiteral"],
		opCloseBracket: [24, "opCLoseLiteral"],
		opOpenCloseBracket: [25, "opCloseLiteral"],
		belowLiteral: [26, "belowLiteral"],
		aboveLiteral: [27, "aboveLiteral"],
		hBracketLiteral: [28, "hBracketLiteral"],
		opNaryLiteral: [29, "opNaryLiteral"],
		asciiLiteral: [30, "asciiLiteral"],
		opArrayLiteral: [31, "opArrayLiteral"],
		opDecimal: [32, "opDecimal"],

		specialScriptNumberLiteral: [33, "specialScriptLiteral"],
		specialScriptCharLiteral: [34, "specialScriptLiteral"],
		specialScriptBracketLiteral: [35, "specialScriptBracketLiteral"],
		specialScriptOperatorLiteral: [36, "specialScriptBracketLiteral"],

		specialIndexNumberLiteral: [37, "specialScriptLiteral"],
		specialIndexCharLiteral: [38, "specialScriptLiteral"],
		specialIndexBracketLiteral: [39, "specialScriptBracketLiteral"],
		specialIndexOperatorLiteral: [40, "specialScriptBracketLiteral"],

		textLiteral: [41, "textLiteral"],
		nthrtLiteral: [42, "nthrtLiteral"],
		fourthrtLiteral: [43, "fourthrtLiteral"],
		cubertLiteral: [44, "cubertLiteral"],
		overBarLiteral: [45, "overBarLiteral"],

		factorialLiteral: [46, "factorialLiteral"],
		rowLiteral: [47, "rowLiteral"],
		rowsLiteral: [48, "rowsLiteral"],

		minusLiteral: [49, "minusLiteral"],
		LaTeXLiteral: [50, "LaTeXLiteral"],

		functionWithLimitLiteral: [51, "functionWithLimitLiteral"],
		functionNameLiteral: [52, "functionNameLiteral"],
		matrixLiteral: [53, "matrixLiteral"],

		arrayLiteral: [53, "arrayLiteral"],
	};
	const wordAutoCorrection = [
		// Если массив правила состоит из:
		// 		* элемента для сравнения,
		// 		* корректирующего элемента;
		//
		// 		например: [alpha, α]
		//
		//	Значение будет равно: a
		// 	Класс будет равен значению oLiteralNames.CharLiteral[0]

		// Если массив правила состоит из:
		// 		* элемента для сравнения,
		//      * undefined || str,
		// 		* значение из oNamesOfLiterals || true
		//
		// 		например: ["⁰", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]]
		//
		//  Значение равно:
		//		* arr[1] === undefined: arr[0]
		//		* typeof arr[1] === "string": arr[1]
		//	Класс равен:
		//		* arr[2] === true: Значение
		//		* typeof arr[2] === "number" (oNamesOfLiterals): arr[2]

		//Char
		[
			function (str) {
				return str[0];
			},
			undefined,
			oNamesOfLiterals.charLiteral[0],
		],
		//Diacritics
		[
			function (str) {
				const code = GetFixedCharCodeAt(str[0]);
				if (code >= 768 && code <= 879) {
					return str[0];
				}
			},
			undefined,
			oNamesOfLiterals.diacriticLiteral[0],
		],
		//Numbers
		[
			function (str) {
				const arrNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
				let literal = str[0];
				if (arrNumbers.includes(literal)) {
					return literal;
				}
			},
			undefined,
			oNamesOfLiterals.numberLiteral[0],
		],
		//Mathematical Alphanumeric Symbols 1D400:1D7FF
		[
			function (arrData) {
				let intCode = GetFixedCharCodeAt(arrData[0]);
				if (intCode >= 0x1D400 && intCode <= 0x1D7FF) {
					return arrData[0];
				}
			},
			undefined,
			oNamesOfLiterals.otherLiteral[0],
		],

		// ["⅀", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨊", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨋", oNamesOfLiterals.opNaryLiteral[0]],
		// ["∫", oNamesOfLiterals.opNaryLiteral[0]],
		// ["∱", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨑", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨍", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨎", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨏", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨕", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨖", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨗", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨘", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨙", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨚", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨛", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨜", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨒", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨓", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨔", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨃", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨅", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⨉", oNamesOfLiterals.opNaryLiteral[0]],
		// ["⫿", oNamesOfLiterals.opNaryLiteral[0]],

		["  ", undefined, oNamesOfLiterals.spaceLiteral[0]], // 2/18em space  very thin math space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // 3/18em space thin math space
		["  ", undefined, oNamesOfLiterals.spaceLiteral[0]],  // 7/18em space  very very thick math space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // Digit-width space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // Space-with space (non-breaking space)
		["\t", undefined, oNamesOfLiterals.spaceLiteral[0]], //Tab
		["\n", undefined, oNamesOfLiterals.spaceLiteral[0]],

		["⁣", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⁤", undefined, oNamesOfLiterals.operatorLiteral[0]],

		//Unicode DB operators
		["⨯", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⨝", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⟕", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⟖", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⟗", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⋉", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["⋊", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["▷", undefined, oNamesOfLiterals.operatorLiteral[0]],

		["(", undefined, oNamesOfLiterals.opOpenBracket[0]],
		[")", undefined, oNamesOfLiterals.opCloseBracket[0]],
		["{", undefined, oNamesOfLiterals.opOpenBracket[0]],
		["}", undefined, oNamesOfLiterals.opCloseBracket[0]],

		["^", undefined, true],
		["_", undefined, true],

		["!", undefined, oNamesOfLiterals.charLiteral[0]],
		["!!", "‼", oNamesOfLiterals.charLiteral[0]],
		["...", "…"],
		["::", "∷"],
		[":=", "≔"],

		["~=", "≅", oNamesOfLiterals.operatorLiteral[0]],
		["+-", "±"],
		["-+", "∓"],
		["<<", "≪"],
		["<=", "≤"],
		[">=", "≥", oNamesOfLiterals.operatorLiteral[0]],
		["->", "→"],
		[">>", "≫"],

		["&", undefined, true],
		["@", undefined, true],
		["array(", undefined, true], // unicode

		[",", undefined, oNamesOfLiterals.opDecimal[0]],
		[".", undefined, oNamesOfLiterals.opDecimal[0]],

		["⁰", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["¹", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["²", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["³", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁴", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁵", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁶", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁷", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁸", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁹", undefined, oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["ⁱ", undefined, oNamesOfLiterals.specialScriptCharLiteral[0]],
		["ⁿ", undefined, oNamesOfLiterals.specialScriptCharLiteral[0]],
		["⁺", undefined, oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁻", undefined, oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁼", undefined, oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁽", undefined, oNamesOfLiterals.specialScriptBracketLiteral[0]],
		["⁾", undefined, oNamesOfLiterals.specialScriptBracketLiteral[0]],

		["₀", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₁", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₂", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₃", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₄", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₅", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₆", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₇", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₈", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₉", undefined, oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₊", undefined, oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₋", undefined, oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₌", undefined, oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₍", undefined, oNamesOfLiterals.specialIndexBracketLiteral[0]],
		["₎", undefined, oNamesOfLiterals.specialIndexBracketLiteral[0]],

		["/", undefined, oNamesOfLiterals.overLiteral[0]], // opOpen
		["'", undefined, oNamesOfLiterals.accentLiteral[0]],
		["''", undefined, oNamesOfLiterals.accentLiteral[0]],
		["|", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\|", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],

		["⊘", undefined, oNamesOfLiterals.overLiteral[0]],
		["⒞", undefined, oNamesOfLiterals.overLiteral[0]],
		["|", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],
		["||", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\/", undefined, oNamesOfLiterals.overLiteral[0]],

		["+", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["-", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["*", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["=", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["≶", undefined, oNamesOfLiterals.operatorLiteral[0]],
		["≷", undefined, oNamesOfLiterals.operatorLiteral[0]],

		["\\backslash", "\\", oNamesOfLiterals.opCloseBracket[0]],

		[
			function (str) {
				if (str[0] === "\\") {
					let strOutput = "\\";
					let index = 1;
					while (str[index] && /[a-zA-Z]/.test(str[index])) {
						strOutput += str[index];
						index++;
					}
					return strOutput;
				}
			},
			undefined,
			oNamesOfLiterals.charLiteral[0]
		],
		[
			function (str) {
				if (str[0] === "\\") {
					let strOutput = "\\";
					let index = 1;
					while (str[index] && /[a-zA-Z]/.test(str[index])) {
						strOutput += str[index];
						index++;
					}
					if (functionNames.includes(strOutput.slice(1))) {
						return strOutput;
					}
				}
			},
			undefined,
			oNamesOfLiterals.functionLiteral[0]
		],

		["\\above", "┴", true],
		["\\Alpha", "Α"],
		["\\Bar", "̿", oNamesOfLiterals.accentLiteral[0]], //todo
		["\\Beta", "Β"],
		["\\Box", "□", oNamesOfLiterals.boxLiteral[0]],
		["\\Bmatrix", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\Chi", "Χ"],
		["\\Dd", "ⅅ"],
		["\\Delta", "Δ"],
		["\\Deltaeq", "≜"],
		["\\Downarrow", "⇓"],
		["\\Epsolon", "Ε"],
		["\\Eta", "Η"],
		["\\G", "Γ"],
		["\\Gamma", "Γ"],
		["\\Im", "ℑ"],
		["\\Iota", "Ι"],
		["\\Kappa", "Κ"],
		["\\Lambda", "Λ"],
		["\\Leftarrow", "⇐"],
		["\\Leftrightarrow", "⇔", oNamesOfLiterals.operatorLiteral[0]],
		["\\Longleftarrow", "⟸"],
		["\\Longleftrightarrow", "⟺"],
		["\\Longrightarrow", "⟹"],
		["\\Mu", "Μ"],
		["\\Nu", "Ν"],
		["\\O", "Ο"],
		["\\Omega", "Ω"],
		["\\Phi", "Φ"],
		["\\Pi", "Π"],
		["\\Psi", "Ψ"],
		["\\Rangle", "⟫", oNamesOfLiterals.opCloseBracket[0]],
		["\\Rbrack", "⟧", oNamesOfLiterals.opCloseBracket[0]],
		["\\Re", "ℜ"],
		["\\Rho", "Ρ"],
		["\\Rightarrow", "⇒", oNamesOfLiterals.operatorLiteral[0]],
		["\\Sigma", "Σ"],
		["\\Tau", "Τ"],
		["\\Theta", "Θ"],
		["\\Ubar", "̳", oNamesOfLiterals.accentLiteral[0]], //check
		["\\Uparrow", "⇑"],
		["\\Updownarrow", "⇕"],
		["\\Upsilon", "Υ"],
		["\\Vert", "‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\Vmatrix", "⒩", oNamesOfLiterals.matrixLiteral[0]],
		["\\Xi", "Ξ"],
		["\\Zeta", "Ζ"],
		["\\above", "┴", true],
		["\\acute", "́", oNamesOfLiterals.accentLiteral[0]],
		["\\aleph", "ℵ"],
		["\\alpha", "α"],
		["\\amalg", "∐", oNamesOfLiterals.opNaryLiteral[0]],
		["\\angle", "∠"],
		["\\aoint", "∳", oNamesOfLiterals.opNaryLiteral[0]],
		["\\approx", "≈", oNamesOfLiterals.operatorLiteral[0]],
		["\\asmash", "⬆"],
		["\\ast", "∗"],
		["\\asymp", "≍", oNamesOfLiterals.operatorLiteral[0]],
		["\\atop", "¦", oNamesOfLiterals.overLiteral[0]], //LateX true
		["\\array", "■"],

		["\\bar", "̅", oNamesOfLiterals.accentLiteral[0]],
		["\\because", "∵"],
		["\\begin", "〖"], //Unicode  LaTeX: ["\\begin{"],
		["\\begin{", undefined, true],
		["\\begin{equation}", undefined, true],
		["\\begin{array}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{matrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{pmatrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{bmatrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{Bmatrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{vmatrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{Vmatrix}", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\below", "┬", true],
		["\\bet", "ℶ"],
		["\\beta", "β"],
		["\\beth", "ℶ"],
		["\\bmatrix", undefined, oNamesOfLiterals.matrixLiteral[0]],


		["\\bmod", " mod ", oNamesOfLiterals.charLiteral[0]],
		["\\bigcap", "⋂", oNamesOfLiterals.opNaryLiteral[0]], // todo in unicode NaryOp REFACTOR ["⋂", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigcup", "⋃", oNamesOfLiterals.opNaryLiteral[0]], // 	["⋃", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigodot", "⨀", oNamesOfLiterals.opNaryLiteral[0]], //["⨀", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigoplus", "⨁", oNamesOfLiterals.opNaryLiteral[0]], //["⨁", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigotimes", "⨂", oNamesOfLiterals.opNaryLiteral[0]], //["⨂", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigsqcup", "⨆", oNamesOfLiterals.opNaryLiteral[0]], //["⨆", oNamesOfLiterals.opNaryLiteral[0]],
		["\\biguplus", "⨄", oNamesOfLiterals.opNaryLiteral[0]], //		["⨄", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigvee", "⋁", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigwedge", "⋀", oNamesOfLiterals.opNaryLiteral[0]],
		["\\binom", undefined, true],
		["\\bot", "⊥", oNamesOfLiterals.operatorLiteral[0]],
		["\\bowtie", "⋈"],
		["\\box", "□", oNamesOfLiterals.boxLiteral[0]],
		["\\boxdot", "⊡"],
		["\\boxed", undefined, true], //TODO
		["\\boxminus", "⊟"],
		["\\boxplus", "⊞"],
		["\\bra", "⟨", oNamesOfLiterals.opOpenBracket[0]],
		["\\break", "⤶"],
		["\\breve", "̆", oNamesOfLiterals.accentLiteral[0]],
		["\\bullet", "∙"],
		["\\cap", "∩"],
		["\\cases", "Ⓒ", true],
		["\\cbrt", "∛", oNamesOfLiterals.sqrtLiteral[0]], //oNamesOfLiterals.opBuildupLiteral[0] to functionLiteral?
		["\\cdot", "⋅", oNamesOfLiterals.operatorLiteral[0]],
		["\\cdots", "⋯"],
		["\\cfrac", undefined, true],// https://www.tutorialspoint.com/tex_commands/cfrac.htm
		["\\check", "̌", oNamesOfLiterals.accentLiteral[0]],
		["\\chi", "χ"],
		["\\circ", "∘"],
		["\\close", "┤", true],
		["\\clubsuit", "♣"],
		["\\coint", "∲", oNamesOfLiterals.opNaryLiteral[0]],
		["\\cong", "≅", oNamesOfLiterals.operatorLiteral[0]],
		["\\contain", "∋", oNamesOfLiterals.operatorLiteral[0]],
		["\\coprod", "∐", oNamesOfLiterals.opNaryLiteral[0]], //check type
		["\\cup", "∪"],
		["\\dalet", "ℸ"],
		["\\daleth", "ℸ"],
		["\\dashv", "⊣"],
		["\\dd", "ⅆ"],
		["\\ddddot", "⃜", oNamesOfLiterals.accentLiteral[0]],
		["\\dddot", "⃛", oNamesOfLiterals.accentLiteral[0]],
		["\\ddot", "̈", oNamesOfLiterals.accentLiteral[0]],
		["\\ddots", "⋱"],
		["\\defeq", "≝"],
		["\\degc", "℃"],
		["\\degf", "℉"],
		["\\degree", "°"],
		["\\delta", "δ"],
		["\\dfrac{", undefined, true],
		["\\diamond", "⋄"],
		["\\diamondsuit", "♢"],
		["\\div", "÷", oNamesOfLiterals.operatorLiteral[0]],
		["\\dot", "̇", oNamesOfLiterals.accentLiteral[0]],
		["\\doteq", "≐"],
		["\\dots", "…"], //double chars
		["\\downarrow", "↓"],
		["\\dsmash", "⬇"],
		["\\ee", "ⅇ"],//0x2147
		["\\ell", "ℓ"],//0x2113
		["\\emptyset", "∅"],
		["\\emsp", " ", oNamesOfLiterals.spaceLiteral[0]], // [" ", oNamesOfLiterals.spaceLiteral[0]], // 1em space
		["\\end", "〗", oNamesOfLiterals.opCloseBracket[0]], //LaTeX ["\\end{"],
		["\\end{equation}", undefined, true],
		["\\end{array}", undefined, "endOfMatrix"],
		["\\end{matrix}", undefined, "endOfMatrix"],
		["\\end{pmatrix}", undefined, "endOfMatrix"],
		["\\end{bmatrix}", undefined, "endOfMatrix"],
		["\\end{Bmatrix}", undefined, "endOfMatrix"],
		["\\end{vmatrix}", undefined, "endOfMatrix"],
		["\\end{Vmatrix}", undefined, "endOfMatrix"],
		["\\ensp", " ", oNamesOfLiterals.spaceLiteral[0],], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 9/18em space
		["\\epsilon", "ϵ"],
		["\\eqarray", "█", true],
		["\\eqno", "#"],
		["\\equiv", "≡", oNamesOfLiterals.operatorLiteral[0]],
		["\\eta", "η"],
		["\\exists", "∃", oNamesOfLiterals.operatorLiteral[0]],
		["\\forall", "∀", oNamesOfLiterals.operatorLiteral[0]], //fractur
		["\\frac", undefined, true],
		["\\frown", "⌑"],
		["\\funcapply", "⁡", oNamesOfLiterals.operatorLiteral[0]],
		["\\gamma", "γ"],
		["\\ge", "≥", oNamesOfLiterals.operatorLiteral[0]],
		["\\geq", "≥", oNamesOfLiterals.operatorLiteral[0]],
		["\\gets", "←"],
		["\\gg", "≫"],
		["\\gimel", "ℷ"],//0x2137
		["\\grave", "̀", oNamesOfLiterals.accentLiteral[0]],
		["\\hairsp", " ", oNamesOfLiterals.spaceLiteral[0]], //	[" ", oNamesOfLiterals.spaceLiteral[0]], // 1/18em space very very thin math space
		["\\hat", "̂", oNamesOfLiterals.accentLiteral[0]], //["\\hat", oNamesOfLiterals.accentLiteral[0], 770],
		["\\hbar", "ℏ"],//0x210f
		["\\heartsuit", "♡"],
		["\\hookleftarrow", "↩"],
		["\\hookrightarrow", "↪"],
		["\\hphantom", "⬄"],
		["\\hsmash", "⬌"],
		["\\hvec", "⃑"],
		["\\ii", "ⅈ"],//0x2148
		["\\iiiint", "⨌", oNamesOfLiterals.opNaryLiteral[0]], //LaTeX oNamesOfLiterals.functionLiteral[0] //Unicode oNamesOfLiterals.opNaryLiteral[0]
		["\\iiint", "∭", oNamesOfLiterals.opNaryLiteral[0]],
		["\\iint", "∬", oNamesOfLiterals.opNaryLiteral[0]],
		["\\imath", "𝚤"],
		["\\in", "∈", oNamesOfLiterals.operatorLiteral[0]],
		["\\inc", "∆"],
		["\\infty", "∞"],
		["\\int", "∫", oNamesOfLiterals.opNaryLiteral[0]],
		["\\iota", "ι"],
		["\\itimes", "⁢", oNamesOfLiterals.operatorLiteral[0]],
		["\\j", "Jay"],
		["\\jj", "ⅉ"],
		["\\jmath", "𝚥"],
		["\\kappa", "κ"],
		["\\ket", "⟩", oNamesOfLiterals.opCloseBracket[0]],
		["\\lambda", "λ"],
		["\\langle", "⟨", oNamesOfLiterals.opOpenBracket[0]],
		["\\lbbrack", "⟦", oNamesOfLiterals.opOpenBracket[0]],
		["\\lbrace", "\\{", oNamesOfLiterals.opOpenBracket[0]], // todo check in word { or \\{
		["\\lbrack", "[", oNamesOfLiterals.opOpenBracket[0]],
		["\\lceil", "⌈", oNamesOfLiterals.opOpenBracket[0]],
		["\\ldiv", "∕", oNamesOfLiterals.overLiteral[0]],
		["\\ldivide", "∕", oNamesOfLiterals.overLiteral[0]],
		["\\ldots", "…"],
		["\\le", "≤", oNamesOfLiterals.operatorLiteral[0]],
		["\\left", "├", true], //LaTeX type === \left
		["\\leftarrow", "←"],
		["\\leftharpoondown", "↽"],
		["\\leftharpoonup", "↼"],
		["\\leftrightarrow", "↔"],
		["\\leq", "≤"],
		["\\lfloor", "⌊", oNamesOfLiterals.opOpenBracket[0]],
		["\\lhvec", "⃐", oNamesOfLiterals.opOpenBracket[0]], //check word
		["\\limits", undefined, true],
		["\\ll", "≪"],
		["\\llbracket", "⟦", oNamesOfLiterals.opOpenBracket[0]],
		["\\lmoust", "⎰", oNamesOfLiterals.opOpenBracket[0]],
		["\\lrhar", "⇋"],
		["\\lvec", "⃖", oNamesOfLiterals.accentLiteral[0]],
		["\\lvert", "|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\mapsto", "↦"],
		["\\matrix", "■", oNamesOfLiterals.matrixLiteral[0]],
		["\\medsp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 4/18em space medium math space
		["\\mid", "∣", true],
		["\\middle", "ⓜ", true],
		["\\models", "⊨"],
		["\\mp", "∓"],
		["\\mu", "μ"],
		["\\nabla", "∇"],
		["\\naryand", "▒", true],
		["\\nbsp", " ", oNamesOfLiterals.spaceLiteral[0]],
		["\\ne", "≠"],
		["\\nearrow", "↗"],
		["\\neg", "¬", oNamesOfLiterals.operatorLiteral[0]],
		["\\neq", "≠"],
		["\\ni", "∋", oNamesOfLiterals.operatorLiteral[0]],
		["\\norm", "‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		//["\\not", "̸"], //doesn't implement in word
		["\\notcontain", "∌"],
		["\\notelement", "∉"],
		["\\notin", "∉"],
		["\\nu", "ν"],
		["\\nwarrow", "↖"],
		["\\o", "ο"],
		["\\odot", "⊙"],
		["\\of", "▒", true],
		["\\oiiint", "∰", oNamesOfLiterals.opNaryLiteral[0]],
		["\\oiint", "∯", oNamesOfLiterals.opNaryLiteral[0]],
		["\\oint", "∮", oNamesOfLiterals.opNaryLiteral[0]],
		["\\omega", "ω"],
		["\\ominus", "⊖"],
		["\\open", "├", true],
		["\\oplus", "⊕", oNamesOfLiterals.operatorLiteral[0]],
		["\\otimes", "⊗", oNamesOfLiterals.operatorLiteral[0]],
		["\\over", undefined, true],
		["\\overbar", "¯", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overbrace", "⏞", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overbracket", "⎴", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overline", "¯", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overparen", "⏜", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overset", "┴", true],

		["\\overshell", "⏠", oNamesOfLiterals.hBracketLiteral[0]],
		["\\parallel", "∥"], //check
		["\\partial", "∂"],
		["\\perp", "⊥", oNamesOfLiterals.operatorLiteral[0]],
		["\\phi", "ϕ"],
		["\\pi", "π"],
		["\\pm", "±"],
		["\\pmatrix", "⒨", oNamesOfLiterals.matrixLiteral[0]],
		["\\pppprime", "⁗", oNamesOfLiterals.accentLiteral[0]],
		["\\ppprime", "‴", oNamesOfLiterals.accentLiteral[0]],
		["\\pprime", "″", oNamesOfLiterals.accentLiteral[0]],
		["\\prec", "≺", oNamesOfLiterals.operatorLiteral[0]],
		["\\preceq", "≼", oNamesOfLiterals.operatorLiteral[0]],
		["\\prime", "′", oNamesOfLiterals.accentLiteral[0]],
		["\\prod", "∏", oNamesOfLiterals.opNaryLiteral[0]], //oNamesOfLiterals.functionLiteral[0]
		["\\propto", "∝"],
		["\\psi", "ψ"],
		["\\qdrt", "∜", oNamesOfLiterals.sqrtLiteral[0]],
		["\\rangle", "〉", oNamesOfLiterals.opCloseBracket[0]],
		["\\rangle", "⟩", oNamesOfLiterals.opCloseBracket[0]],
		["\\ratio", "∶"],
		["\\rbrace", "}", oNamesOfLiterals.opCloseBracket[0]],
		["\\rbrack", "]", oNamesOfLiterals.opCloseBracket[0]],
		["\\rceil", "⌉", oNamesOfLiterals.opCloseBracket[0]],
		["\\rddots", "⋰"],
		["\\Rect", "▭", oNamesOfLiterals.rectLiteral[0]],
		["\\rect", "▭", oNamesOfLiterals.rectLiteral[0]],
		["\\rfloor", "⌋", oNamesOfLiterals.opCloseBracket[0]],
		["\\rho", "ρ"],
		["\\rhvec", "⃑"],
		["\\right", "┤", true],
		["\\rightarrow", "→"],
		["\\rightharpoondown", "⇁"],
		["\\rightharpoonup", "⇀"],
		["\\rmoust", "⎱", oNamesOfLiterals.opCloseBracket[0]],
		["\\root", "⒭", true], //check
		["\\rvert", "|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\sdiv", "⁄", oNamesOfLiterals.overLiteral[0]],
		["\\sdivide", "⁄", oNamesOfLiterals.overLiteral[0]], //Script
		["\\searrow", "↘"],
		["\\setminus", "∖"],
		["\\sigma", "σ"],
		["\\sim", "∼", oNamesOfLiterals.operatorLiteral[0]],
		["\\simeq", "≃", oNamesOfLiterals.operatorLiteral[0]],
		["\\smash", "⬍"],
		["\\smile", "⌣"],
		["\\spadesuit", "♠"],
		["\\sqcap", "⊓"],
		["\\sqcup", "⊔"],
		["\\sqrt", "√", oNamesOfLiterals.sqrtLiteral[0]],
		["\\sqsubseteq", "⊑", oNamesOfLiterals.operatorLiteral[0]],
		["\\sqsuperseteq", "⊒", oNamesOfLiterals.operatorLiteral[0]],
		["\\star", "⋆"],
		["\\subset", "⊂", oNamesOfLiterals.operatorLiteral[0]],
		["\\subseteq", "⊆", oNamesOfLiterals.operatorLiteral[0]],
		["\\succ", "≻", oNamesOfLiterals.operatorLiteral[0]],
		["\\succeq", "≽", oNamesOfLiterals.operatorLiteral[0]],
		["\\sum", "∑", oNamesOfLiterals.opNaryLiteral[0]],
		["\\superset", "⊃", oNamesOfLiterals.operatorLiteral[0]],
		["\\superseteq", "⊇", oNamesOfLiterals.operatorLiteral[0]],
		["\\swarrow", "↙"],
		["\\tau", "τ"],
		["\\therefore", "∴"],
		["\\theta", "θ"],
		["\\thicksp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 5/18em space thick math space
		["\\thinsp", " ", oNamesOfLiterals.spaceLiteral[0]],
		["\\tilde", "̃", oNamesOfLiterals.accentLiteral[0]],
		["\\times", "×", oNamesOfLiterals.operatorLiteral[0]],
		["\\to", "→"],
		["\\top", "⊤", oNamesOfLiterals.operatorLiteral[0]],
		["\\tvec", "⃡", oNamesOfLiterals.accentLiteral[0]],
		["\\ubar", "̲", oNamesOfLiterals.accentLiteral[0]], //check
		["\\ulcorner", "┌", oNamesOfLiterals.opOpenBracket[0]],
		["\\underbar", "▁", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underbrace", "⏟", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underbracket", "⎵", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underline", "▱", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underparen", "⏝", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underset", "┬", true],
		["\\uparrow", "↑"],
		["\\updownarrow", "↕"],
		["\\uplus", "⊎"],
		["\\upsilon", "υ"],
		["\\urcorner", "┐", oNamesOfLiterals.opCloseBracket[0]],
		["\\varepsilon", "ε"],
		["\\varphi", "φ"],
		["\\varpi", "ϖ"],
		["\\varpropto", "∝"],
		["\\varrho", "ϱ"],
		["\\varsigma", "ς"],
		["\\vartheta", "ϑ"],
		["\\vbar", "│"],
		["\\vdash", "⊢", oNamesOfLiterals.operatorLiteral[0]],
		["\\vdots", "⋮"],
		["\\vec", "⃗", oNamesOfLiterals.accentLiteral[0]],
		["\\vee", "∨", oNamesOfLiterals.operatorLiteral[0]],
		["\\vert", "|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\vmatrix", undefined, oNamesOfLiterals.matrixLiteral[0]],
		["\\vphantom", "⇳"],
		["\\vthicksp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 6/18em space very thick math space
		["\\wedge", "∧", oNamesOfLiterals.operatorLiteral[0]],
		["\\widehat", "̂", oNamesOfLiterals.accentLiteral[0]], //["\\hat", oNamesOfLiterals.accentLiteral[0], 770],
		["\\wp", "℘"],//0x2118
		["\\wr", "≀"],
		["\\xi", "ξ"],
		["\\zeta", "ζ"],
		["\\zwnj", "‌"],
		["\\zwsp", "​", oNamesOfLiterals.spaceLiteral[0]], //["​", oNamesOfLiterals.spaceLiteral[0]], // zero-width space

		["√(", undefined, oNamesOfLiterals.sqrtLiteral[0]],
		["\\sqrt(", "√(", oNamesOfLiterals.sqrtLiteral[0]],
		["\\}", undefined, oNamesOfLiterals.opCloseBracket[0]],
		["\\|", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],

		["\\\\", undefined, true],

		["\\sf", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\script", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\scr", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\rm", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\oldstyle", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathtt", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfit", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfbfit", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfbf", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsf", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathrm", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathit", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathfrak", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathcal", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbfit", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbffrak", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbfcal", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbf", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbb", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\it", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\fraktur", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\frak", undefined, oNamesOfLiterals.mathFontLiteral[0]],
		["\\double", undefined, oNamesOfLiterals.mathFontLiteral[0]],

		// ["\""],
		// ["\'"],

		["\\quad", " ", oNamesOfLiterals.spaceLiteral[0]], // 1 em (nominally, the height of the font)
		// ["\\qquad", [8193, 8193], oNamesOfLiterals.spaceLiteral[0]], // 2em
		//["\\text{", "text{"],

		["\\,", " ", oNamesOfLiterals.spaceLiteral[0]], // 3/18em space thin math space
		["\\:", " ", oNamesOfLiterals.spaceLiteral[0]], // 4/18em space thin math space
		["\\;", " ", oNamesOfLiterals.spaceLiteral[0]], // 5/18em space thin math space
		//["\!", " ", oNamesOfLiterals.spaceLiteral[0]], // -3/18 of \quad (= -3 mu)
		["\\ ", " ", oNamesOfLiterals.spaceLiteral[0]], // equivalent of space in normal text
		["\\qquad", "  ", oNamesOfLiterals.spaceLiteral[0]], // equivalent of space in normal text

		["\\\\", undefined, true],
		// ["\\lim", oNamesOfLiterals.opNaryLiteral[0]], LaTeX
		// ["\\lg", oNamesOfLiterals.opNaryLiteral[0]],
	];
	const functionNames = [
		"tan", "tanh", "sup", "sinh", "sin", "sec", "ker", "hom",
		"arg", "arctan", "arcsin", "arcsec", "arccsc", "arccot", "arccos",
		"inf", "gcd", "exp", "dim", "det", "deg", "csc", "coth", "cot",
		"cosh", "cos", "Pr", "lg"
	];
	const limitFunctions = [
		"log", "lim", "min", "max", "ln",
	];
	const UnicodeSpecialScript = {
		"⁰": "0",
		"¹": "1",
		"²": "2",
		"³": "3",
		"⁴": "4",
		"⁵": "5",
		"⁶": "6",
		"⁷": "7",
		"⁸": "8",
		"⁹": "9",
		"ⁱ": "i",
		"ⁿ": "n",
		"⁺": "+",
		"⁻": "-",
		"⁼": "=",
		"⁽": "(",
		"⁾": ")",

		"₀": "0",
		"₁": "1",
		"₂": "2",
		"₃": "3",
		"₄": "4",
		"₅": "5",
		"₆": "6",
		"₇": "7",
		"₈": "8",
		"₉": "9",
		"₊": "+",
		"₋": "-",
		"₌": "=",
		"₍": "(",
		"₎": ")",
	}
	const GetTypeFont = {
		"\\sf": 3,
		"\\script": 7,
		"\\scr": 7,
		"\\rm": -1,
		"\\oldstyle": 7,
		"\\mathtt": 11,
		"\\mathsfit": 5,
		"\\mathsfbfit": 6,
		"\\mathsfbf": 4,
		"\\mathsf": 3,
		"\\mathrm": -1,
		"\\mathit": 1,
		"\\mathfrak": 9,
		"\\mathcal": 7,
		"\\mathbfit": 2,
		"\\mathbffrak": 10,
		"\\mathbfcal": 8,
		"\\mathbf": 0,
		"\\mathbb": 12,
		"\\it": 1,
		"\\fraktur": 9,
		"\\frak": 9,
		"\\double": 12,
	}
	const GetMathFontChar = {
		'A': {
			0: '𝐀',
			1: '𝐴',
			2: '𝑨',
			3: '𝖠',
			4: '𝗔',
			5: '𝘈',
			6: '𝘼',
			7: '𝒜',
			8: '𝓐',
			9: '𝔄',
			10: '𝕬',
			11: '𝙰',
			12: '𝔸'
		},
		'B': {
			0: '𝐁',
			1: '𝐵',
			2: '𝑩',
			3: '𝖡',
			4: '𝗕',
			5: '𝘉',
			6: '𝘽',
			7: 'ℬ',
			8: '𝓑',
			9: '𝔅',
			10: '𝕭',
			11: '𝙱',
			12: '𝔹'
		},
		'C': {
			0: '𝐂',
			1: '𝐶',
			2: '𝑪',
			3: '𝖢',
			4: '𝗖',
			5: '𝘊',
			6: '𝘾',
			7: '𝒞',
			8: '𝓒',
			9: 'ℭ',
			10: '𝕮',
			11: '𝙲',
			12: 'ℂ'
		},
		'D': {
			0: '𝐃',
			1: '𝐷',
			2: '𝑫',
			3: '𝖣',
			4: '𝗗',
			5: '𝘋',
			6: '𝘿',
			7: '𝒟',
			8: '𝓓',
			9: '𝔇',
			10: '𝕯',
			11: '𝙳',
			12: '𝔻'
		},
		'E': {
			0: '𝐄',
			1: '𝐸',
			2: '𝑬',
			3: '𝖤',
			4: '𝗘',
			5: '𝘌',
			6: '𝙀',
			7: 'ℰ',
			8: '𝓔',
			9: '𝔈',
			10: '𝕰',
			11: '𝙴',
			12: '𝔼'
		},
		'F': {
			0: '𝐅',
			1: '𝐹',
			2: '𝑭',
			3: '𝖥',
			4: '𝗙',
			5: '𝘍',
			6: '𝙁',
			7: 'ℱ',
			8: '𝓕',
			9: '𝔉',
			10: '𝕱',
			11: '𝙵',
			12: '𝔽'
		},
		'G': {
			0: '𝐆',
			1: '𝐺',
			2: '𝑮',
			3: '𝖦',
			4: '𝗚',
			5: '𝘎',
			6: '𝙂',
			7: '𝒢',
			8: '𝓖',
			9: '𝔊',
			10: '𝕲',
			11: '𝙶',
			12: '𝔾'
		},
		'H': {
			0: '𝐇',
			1: '𝐻',
			2: '𝑯',
			3: '𝖧',
			4: '𝗛',
			5: '𝘏',
			6: '𝙃',
			7: 'ℋ',
			8: '𝓗',
			9: 'ℌ',
			10: '𝕳',
			11: '𝙷',
			12: 'ℍ'
		},
		'I': {
			0: '𝐈',
			1: '𝐼',
			2: '𝑰',
			3: '𝖨',
			4: '𝗜',
			5: '𝘐',
			6: '𝙄',
			7: 'ℐ',
			8: '𝓘',
			9: 'ℑ',
			10: '𝕴',
			11: '𝙸',
			12: '𝕀'
		},
		'J': {
			0: '𝐉',
			1: '𝐽',
			2: '𝑱',
			3: '𝖩',
			4: '𝗝',
			5: '𝘑',
			6: '𝙅',
			7: '𝒥',
			8: '𝓙',
			9: '𝔍',
			10: '𝕵',
			11: '𝙹',
			12: '𝕁'
		},
		'K': {
			0: '𝐊',
			1: '𝐾',
			2: '𝑲',
			3: '𝖪',
			4: '𝗞',
			5: '𝘒',
			6: '𝙆',
			7: '𝒦',
			8: '𝓚',
			9: '𝔎',
			10: '𝕶',
			11: '𝙺',
			12: '𝕂'
		},
		'L': {
			0: '𝐋',
			1: '𝐿',
			2: '𝑳',
			3: '𝖫',
			4: '𝗟',
			5: '𝘓',
			6: '𝙇',
			7: 'ℒ',
			8: '𝓛',
			9: '𝔏',
			10: '𝕷',
			11: '𝙻',
			12: '𝕃'
		},
		'M': {
			0: '𝐌',
			1: '𝑀',
			2: '𝑴',
			3: '𝖬',
			4: '𝗠',
			5: '𝘔',
			6: '𝙈',
			7: 'ℳ',
			8: '𝓜',
			9: '𝔐',
			10: '𝕸',
			11: '𝙼',
			12: '𝕄'
		},
		'N': {
			0: '𝐍',
			1: '𝑁',
			2: '𝑵',
			3: '𝖭',
			4: '𝗡',
			5: '𝘕',
			6: '𝙉',
			7: '𝒩',
			8: '𝓝',
			9: '𝔑',
			10: '𝕹',
			11: '𝙽',
			12: 'ℕ'
		},
		'O': {
			0: '𝐎',
			1: '𝑂',
			2: '𝑶',
			3: '𝖮',
			4: '𝗢',
			5: '𝘖',
			6: '𝙊',
			7: '𝒪',
			8: '𝓞',
			9: '𝔒',
			10: '𝕺',
			11: '𝙾',
			12: '𝕆'
		},
		'P': {
			0: '𝐏',
			1: '𝑃',
			2: '𝑷',
			3: '𝖯',
			4: '𝗣',
			5: '𝘗',
			6: '𝙋',
			7: '𝒫',
			8: '𝓟',
			9: '𝔓',
			10: '𝕻',
			11: '𝙿',
			12: 'ℙ'
		},
		'Q': {
			0: '𝐐',
			1: '𝑄',
			2: '𝑸',
			3: '𝖰',
			4: '𝗤',
			5: '𝘘',
			6: '𝙌',
			7: '𝒬',
			8: '𝓠',
			9: '𝔔',
			10: '𝕼',
			11: '𝚀',
			12: 'ℚ'
		},
		'R': {
			0: '𝐑',
			1: '𝑅',
			2: '𝑹',
			3: '𝖱',
			4: '𝗥',
			5: '𝘙',
			6: '𝙍',
			7: 'ℛ',
			8: '𝓡',
			9: 'ℜ',
			10: '𝕽',
			11: '𝚁',
			12: 'ℝ'
		},
		'S': {
			0: '𝐒',
			1: '𝑆',
			2: '𝑺',
			3: '𝖲',
			4: '𝗦',
			5: '𝘚',
			6: '𝙎',
			7: '𝒮',
			8: '𝓢',
			9: '𝔖',
			10: '𝕾',
			11: '𝚂',
			12: '𝕊'
		},
		'T': {
			0: '𝐓',
			1: '𝑇',
			2: '𝑻',
			3: '𝖳',
			4: '𝗧',
			5: '𝘛',
			6: '𝙏',
			7: '𝒯',
			8: '𝓣',
			9: '𝔗',
			10: '𝕿',
			11: '𝚃',
			12: '𝕋'
		},
		'U': {
			0: '𝐔',
			1: '𝑈',
			2: '𝑼',
			3: '𝖴',
			4: '𝗨',
			5: '𝘜',
			6: '𝙐',
			7: '𝒰',
			8: '𝓤',
			9: '𝔘',
			10: '𝖀',
			11: '𝚄',
			12: '𝕌'
		},
		'V': {
			0: '𝐕',
			1: '𝑉',
			2: '𝑽',
			3: '𝖵',
			4: '𝗩',
			5: '𝘝',
			6: '𝙑',
			7: '𝒱',
			8: '𝓥',
			9: '𝔙',
			10: '𝖁',
			11: '𝚅',
			12: '𝕍'
		},
		'W': {
			0: '𝐖',
			1: '𝑊',
			2: '𝑾',
			3: '𝖶',
			4: '𝗪',
			5: '𝘞',
			6: '𝙒',
			7: '𝒲',
			8: '𝓦',
			9: '𝔚',
			10: '𝖂',
			11: '𝚆',
			12: '𝕎'
		},
		'X': {
			0: '𝐗',
			1: '𝑋',
			2: '𝑿',
			3: '𝖷',
			4: '𝗫',
			5: '𝘟',
			6: '𝙓',
			7: '𝒳',
			8: '𝓧',
			9: '𝔛',
			10: '𝖃',
			11: '𝚇',
			12: '𝕏'
		},
		'Y': {
			0: '𝐘',
			1: '𝑌',
			2: '𝒀',
			3: '𝖸',
			4: '𝗬',
			5: '𝘠',
			6: '𝙔',
			7: '𝒴',
			8: '𝓨',
			9: '𝔜',
			10: '𝖄',
			11: '𝚈',
			12: '𝕐'
		},
		'Z': {
			0: '𝐙',
			1: '𝑍',
			2: '𝒁',
			3: '𝖹',
			4: '𝗭',
			5: '𝘡',
			6: '𝙕',
			7: '𝒵',
			8: '𝓩',
			9: 'ℨ',
			10: '𝖅',
			11: '𝚉',
			12: 'ℤ'
		},
		'a': {
			0: '𝐚',
			1: '𝑎',
			2: '𝒂',
			3: '𝖺',
			4: '𝗮',
			5: '𝘢',
			6: '𝙖',
			7: '𝒶',
			8: '𝓪',
			9: '𝔞',
			10: '𝖆',
			11: '𝚊',
			12: '𝕒'
		},
		'b': {
			0: '𝐛',
			1: '𝑏',
			2: '𝒃',
			3: '𝖻',
			4: '𝗯',
			5: '𝘣',
			6: '𝙗',
			7: '𝒷',
			8: '𝓫',
			9: '𝔟',
			10: '𝖇',
			11: '𝚋',
			12: '𝕓'
		},
		'c': {
			0: '𝐜',
			1: '𝑐',
			2: '𝒄',
			3: '𝖼',
			4: '𝗰',
			5: '𝘤',
			6: '𝙘',
			7: '𝒸',
			8: '𝓬',
			9: '𝔠',
			10: '𝖈',
			11: '𝚌',
			12: '𝕔'
		},
		'd': {
			0: '𝐝',
			1: '𝑑',
			2: '𝒅',
			3: '𝖽',
			4: '𝗱',
			5: '𝘥',
			6: '𝙙',
			7: '𝒹',
			8: '𝓭',
			9: '𝔡',
			10: '𝖉',
			11: '𝚍',
			12: '𝕕'
		},
		'e': {
			0: '𝐞',
			1: '𝑒',
			2: '𝒆',
			3: '𝖾',
			4: '𝗲',
			5: '𝘦',
			6: '𝙚',
			7: 'ℯ',
			8: '𝓮',
			9: '𝔢',
			10: '𝖊',
			11: '𝚎',
			12: '𝕖'
		},
		'f': {
			0: '𝐟',
			1: '𝑓',
			2: '𝒇',
			3: '𝖿',
			4: '𝗳',
			5: '𝘧',
			6: '𝙛',
			7: '𝒻',
			8: '𝓯',
			9: '𝔣',
			10: '𝖋',
			11: '𝚏',
			12: '𝕗'
		},
		'g': {
			0: '𝐠',
			1: '𝑔',
			2: '𝒈',
			3: '𝗀',
			4: '𝗴',
			5: '𝘨',
			6: '𝙜',
			7: 'ℊ',
			8: '𝓰',
			9: '𝔤',
			10: '𝖌',
			11: '𝚐',
			12: '𝕘'
		},
		'h': {
			0: '𝐡',
			1: 'ℎ',
			2: '𝒉',
			3: '𝗁',
			4: '𝗵',
			5: '𝘩',
			6: '𝙝',
			7: '𝒽',
			8: '𝓱',
			9: '𝔥',
			10: '𝖍',
			11: '𝚑',
			12: '𝕙'
		},
		'i': {
			0: '𝐢',
			1: '𝑖',
			2: '𝒊',
			3: '𝗂',
			4: '𝗶',
			5: '𝘪',
			6: '𝙞',
			7: '𝒾',
			8: '𝓲',
			9: '𝔦',
			10: '𝖎',
			11: '𝚒',
			12: '𝕚'
		},
		'j': {
			0: '𝐣',
			1: '𝑗',
			2: '𝒋',
			3: '𝗃',
			4: '𝗷',
			5: '𝘫',
			6: '𝙟',
			7: '𝒿',
			8: '𝓳',
			9: '𝔧',
			10: '𝖏',
			11: '𝚓',
			12: '𝕛'
		},
		'k': {
			0: '𝐤',
			1: '𝑘',
			2: '𝒌',
			3: '𝗄',
			4: '𝗸',
			5: '𝘬',
			6: '𝙠',
			7: '𝓀',
			8: '𝓴',
			9: '𝔨',
			10: '𝖐',
			11: '𝚔',
			12: '𝕜'
		},
		'l': {
			0: '𝐥',
			1: '𝑙',
			2: '𝒍',
			3: '𝗅',
			4: '𝗹',
			5: '𝘭',
			6: '𝙡',
			7: '𝓁',
			8: '𝓵',
			9: '𝔩',
			10: '𝖑',
			11: '𝚕',
			12: '𝕝'
		},
		'm': {
			0: '𝐦',
			1: '𝑚',
			2: '𝒎',
			3: '𝗆',
			4: '𝗺',
			5: '𝘮',
			6: '𝙢',
			7: '𝓂',
			8: '𝓶',
			9: '𝔪',
			10: '𝖒',
			11: '𝚖',
			12: '𝕞'
		},
		'n': {
			0: '𝐧',
			1: '𝑛',
			2: '𝒏',
			3: '𝗇',
			4: '𝗻',
			5: '𝘯',
			6: '𝙣',
			7: '𝓃',
			8: '𝓷',
			9: '𝔫',
			10: '𝖓',
			11: '𝚗',
			12: '𝕟'
		},
		'o': {
			0: '𝐨',
			1: '𝑜',
			2: '𝒐',
			3: '𝗈',
			4: '𝗼',
			5: '𝘰',
			6: '𝙤',
			7: 'ℴ',
			8: '𝓸',
			9: '𝔬',
			10: '𝖔',
			11: '𝚘',
			12: '𝕠'
		},
		'p': {
			0: '𝐩',
			1: '𝑝',
			2: '𝒑',
			3: '𝗉',
			4: '𝗽',
			5: '𝘱',
			6: '𝙥',
			7: '𝓅',
			8: '𝓹',
			9: '𝔭',
			10: '𝖕',
			11: '𝚙',
			12: '𝕡'
		},
		'q': {
			0: '𝐪',
			1: '𝑞',
			2: '𝒒',
			3: '𝗊',
			4: '𝗾',
			5: '𝘲',
			6: '𝙦',
			7: '𝓆',
			8: '𝓺',
			9: '𝔮',
			10: '𝖖',
			11: '𝚚',
			12: '𝕢'
		},
		'r': {
			0: '𝐫',
			1: '𝑟',
			2: '𝒓',
			3: '𝗋',
			4: '𝗿',
			5: '𝘳',
			6: '𝙧',
			7: '𝓇',
			8: '𝓻',
			9: '𝔯',
			10: '𝖗',
			11: '𝚛',
			12: '𝕣'
		},
		's': {
			0: '𝐬',
			1: '𝑠',
			2: '𝒔',
			3: '𝗌',
			4: '𝘀',
			5: '𝘴',
			6: '𝙨',
			7: '𝓈',
			8: '𝓼',
			9: '𝔰',
			10: '𝖘',
			11: '𝚜',
			12: '𝕤'
		},
		't': {
			0: '𝐭',
			1: '𝑡',
			2: '𝒕',
			3: '𝗍',
			4: '𝘁',
			5: '𝘵',
			6: '𝙩',
			7: '𝓉',
			8: '𝓽',
			9: '𝔱',
			10: '𝖙',
			11: '𝚝',
			12: '𝕥'
		},
		'u': {
			0: '𝐮',
			1: '𝑢',
			2: '𝒖',
			3: '𝗎',
			4: '𝘂',
			5: '𝘶',
			6: '𝙪',
			7: '𝓊',
			8: '𝓾',
			9: '𝔲',
			10: '𝖚',
			11: '𝚞',
			12: '𝕦'
		},
		'v': {
			0: '𝐯',
			1: '𝑣',
			2: '𝒗',
			3: '𝗏',
			4: '𝘃',
			5: '𝘷',
			6: '𝙫',
			7: '𝓋',
			8: '𝓿',
			9: '𝔳',
			10: '𝖛',
			11: '𝚟',
			12: '𝕧'
		},
		'w': {
			0: '𝐰',
			1: '𝑤',
			2: '𝒘',
			3: '𝗐',
			4: '𝘄',
			5: '𝘸',
			6: '𝙬',
			7: '𝓌',
			8: '𝔀',
			9: '𝔴',
			10: '𝖜',
			11: '𝚠',
			12: '𝕨'
		},
		'x': {
			0: '𝐱',
			1: '𝑥',
			2: '𝒙',
			3: '𝗑',
			4: '𝘅',
			5: '𝘹',
			6: '𝙭',
			7: '𝓍',
			8: '𝔁',
			9: '𝔵',
			10: '𝖝',
			11: '𝚡',
			12: '𝕩'
		},
		'y': {
			0: '𝐲',
			1: '𝑦',
			2: '𝒚',
			3: '𝗒',
			4: '𝘆',
			5: '𝘺',
			6: '𝙮',
			7: '𝓎',
			8: '𝔂',
			9: '𝔶',
			10: '𝖞',
			11: '𝚢',
			12: '𝕪'
		},
		'z': {
			0: '𝐳',
			1: '𝑧',
			2: '𝒛',
			3: '𝗓',
			4: '𝘇',
			5: '𝘻',
			6: '𝙯',
			7: '𝓏',
			8: '𝔃',
			9: '𝔷',
			10: '𝖟',
			11: '𝚣',
			12: '𝕫'
		},
		'ı': {mathit: '𝚤'},
		'ȷ': {mathit: '𝚥'},
		'Α': {0: '𝚨', 1: '𝛢', 2: '𝜜', 4: '𝝖', 6: '𝞐'},
		'Β': {0: '𝚩', 1: '𝛣', 2: '𝜝', 4: '𝝗', 6: '𝞑'},
		'Γ': {0: '𝚪', 1: '𝛤', 2: '𝜞', 4: '𝝘', 6: '𝞒'},
		'Δ': {0: '𝚫', 1: '𝛥', 2: '𝜟', 4: '𝝙', 6: '𝞓'},
		'Ε': {0: '𝚬', 1: '𝛦', 2: '𝜠', 4: '𝝚', 6: '𝞔'},
		'Ζ': {0: '𝚭', 1: '𝛧', 2: '𝜡', 4: '𝝛', 6: '𝞕'},
		'Η': {0: '𝚮', 1: '𝛨', 2: '𝜢', 4: '𝝜', 6: '𝞖'},
		'Θ': {0: '𝚯', 1: '𝛩', 2: '𝜣', 4: '𝝝', 6: '𝞗'},
		'Ι': {0: '𝚰', 1: '𝛪', 2: '𝜤', 4: '𝝞', 6: '𝞘'},
		'Κ': {0: '𝚱', 1: '𝛫', 2: '𝜥', 4: '𝝟', 6: '𝞙'},
		'Λ': {0: '𝚲', 1: '𝛬', 2: '𝜦', 4: '𝝠', 6: '𝞚'},
		'Μ': {0: '𝚳', 1: '𝛭', 2: '𝜧', 4: '𝝡', 6: '𝞛'},
		'Ν': {0: '𝚴', 1: '𝛮', 2: '𝜨', 4: '𝝢', 6: '𝞜'},
		'Ξ': {0: '𝚵', 1: '𝛯', 2: '𝜩', 4: '𝝣', 6: '𝞝'},
		'Ο': {0: '𝚶', 1: '𝛰', 2: '𝜪', 4: '𝝤', 6: '𝞞'},
		'Π': {0: '𝚷', 1: '𝛱', 2: '𝜫', 4: '𝝥', 6: '𝞟'},
		'Ρ': {0: '𝚸', 1: '𝛲', 2: '𝜬', 4: '𝝦', 6: '𝞠'},
		'ϴ': {0: '𝚹', 1: '𝛳', 2: '𝜭', 4: '𝝧', 6: '𝞡'},
		'Σ': {0: '𝚺', 1: '𝛴', 2: '𝜮', 4: '𝝨', 6: '𝞢'},
		'Τ': {0: '𝚻', 1: '𝛵', 2: '𝜯', 4: '𝝩', 6: '𝞣'},
		'Υ': {0: '𝚼', 1: '𝛶', 2: '𝜰', 4: '𝝪', 6: '𝞤'},
		'Φ': {0: '𝚽', 1: '𝛷', 2: '𝜱', 4: '𝝫', 6: '𝞥'},
		'Χ': {0: '𝚾', 1: '𝛸', 2: '𝜲', 4: '𝝬', 6: '𝞦'},
		'Ψ': {0: '𝚿', 1: '𝛹', 2: '𝜳', 4: '𝝭', 6: '𝞧'},
		'Ω': {0: '𝛀', 1: '𝛺', 2: '𝜴', 4: '𝝮', 6: '𝞨'},
		'∇': {0: '𝛁', 1: '𝛻', 2: '𝜵', 4: '𝝯', 6: '𝞩'},
		'α': {0: '𝛂', 1: '𝛼', 2: '𝜶', 4: '𝝰', 6: '𝞪'},
		'β': {0: '𝛃', 1: '𝛽', 2: '𝜷', 4: '𝝱', 6: '𝞫'},
		'γ': {0: '𝛄', 1: '𝛾', 2: '𝜸', 4: '𝝲', 6: '𝞬'},
		'δ': {0: '𝛅', 1: '𝛿', 2: '𝜹', 4: '𝝳', 6: '𝞭'},
		'ε': {0: '𝛆', 1: '𝜀', 2: '𝜺', 4: '𝝴', 6: '𝞮'},
		'ζ': {0: '𝛇', 1: '𝜁', 2: '𝜻', 4: '𝝵', 6: '𝞯'},
		'η': {0: '𝛈', 1: '𝜂', 2: '𝜼', 4: '𝝶', 6: '𝞰'},
		'θ': {0: '𝛉', 1: '𝜃', 2: '𝜽', 4: '𝝷', 6: '𝞱'},
		'ι': {0: '𝛊', 1: '𝜄', 2: '𝜾', 4: '𝝸', 6: '𝞲'},
		'κ': {0: '𝛋', 1: '𝜅', 2: '𝜿', 4: '𝝹', 6: '𝞳'},
		'λ': {0: '𝛌', 1: '𝜆', 2: '𝝀', 4: '𝝺', 6: '𝞴'},
		'μ': {0: '𝛍', 1: '𝜇', 2: '𝝁', 4: '𝝻', 6: '𝞵'},
		'ν': {0: '𝛎', 1: '𝜈', 2: '𝝂', 4: '𝝼', 6: '𝞶'},
		'ξ': {0: '𝛏', 1: '𝜉', 2: '𝝃', 4: '𝝽', 6: '𝞷'},
		'ο': {0: '𝛐', 1: '𝜊', 2: '𝝄', 4: '𝝾', 6: '𝞸'},
		'π': {0: '𝛑', 1: '𝜋', 2: '𝝅', 4: '𝝿', 6: '𝞹'},
		'ρ': {0: '𝛒', 1: '𝜌', 2: '𝝆', 4: '𝞀', 6: '𝞺'},
		'ς': {0: '𝛓', 1: '𝜍', 2: '𝝇', 4: '𝞁', 6: '𝞻'},
		'σ': {0: '𝛔', 1: '𝜎', 2: '𝝈', 4: '𝞂', 6: '𝞼'},
		'τ': {0: '𝛕', 1: '𝜏', 2: '𝝉', 4: '𝞃', 6: '𝞽'},
		'υ': {0: '𝛖', 1: '𝜐', 2: '𝝊', 4: '𝞄', 6: '𝞾'},
		'φ': {0: '𝛗', 1: '𝜑', 2: '𝝋', 4: '𝞅', 6: '𝞿'},
		'χ': {0: '𝛘', 1: '𝜒', 2: '𝝌', 4: '𝞆', 6: '𝟀'},
		'ψ': {0: '𝛙', 1: '𝜓', 2: '𝝍', 4: '𝞇', 6: '𝟁'},
		'ω': {0: '𝛚', 1: '𝜔', 2: '𝝎', 4: '𝞈', 6: '𝟂'},
		'∂': {0: '𝛛', 1: '𝜕', 2: '𝝏', 4: '𝞉', 6: '𝟃'},
		'ϵ': {0: '𝛜', 1: '𝜖', 2: '𝝐', 4: '𝞊', 6: '𝟄'},
		'ϑ': {0: '𝛝', 1: '𝜗', 2: '𝝑', 4: '𝞋', 6: '𝟅'},
		'ϰ': {0: '𝛞', 1: '𝜘', 2: '𝝒', 4: '𝞌', 6: '𝟆'},
		'ϕ': {0: '𝛟', 1: '𝜙', 2: '𝝓', 4: '𝞍', 6: '𝟇'},
		'ϱ': {0: '𝛠', 1: '𝜚', 2: '𝝔', 4: '𝞎', 6: '𝟈'},
		'ϖ': {0: '𝛡', 1: '𝜛', 2: '𝝕', 4: '𝞏', 6: '𝟉'},
		'Ϝ': {0: '𝟊'},
		'ϝ': {0: '𝟋'},
		'0': {0: '𝟎', 12: '𝟘', 3: '𝟢', 4: '𝟬', 11: '𝟶'},
		'1': {0: '𝟏', 12: '𝟙', 3: '𝟣', 4: '𝟭', 11: '𝟷'},
		'2': {0: '𝟐', 12: '𝟚', 3: '𝟤', 4: '𝟮', 11: '𝟸'},
		'3': {0: '𝟑', 12: '𝟛', 3: '𝟥', 4: '𝟯', 11: '𝟹'},
		'4': {0: '𝟒', 12: '𝟜', 3: '𝟦', 4: '𝟰', 11: '𝟺'},
		'5': {0: '𝟓', 12: '𝟝', 3: '𝟧', 4: '𝟱', 11: '𝟻'},
		'6': {0: '𝟔', 12: '𝟞', 3: '𝟨', 4: '𝟲', 11: '𝟼'},
		'7': {0: '𝟕', 12: '𝟟', 3: '𝟩', 4: '𝟳', 11: '𝟽'},
		'8': {0: '𝟖', 12: '𝟠', 3: '𝟪', 4: '𝟴', 11: '𝟾'},
		'9': {0: '𝟗', 12: '𝟡', 3: '𝟫', 4: '𝟵', 11: '𝟿'},
	};

	let type = false;
	function GetBracketCode(code) {
		const oBrackets = {
			".": -1,
			"\\{": "{".charCodeAt(0),
			"\\}": "}".charCodeAt(0),
			"\\|": "‖".charCodeAt(0),
			"|": 124,
		}
		if (code) {
			let strBracket = oBrackets[code];
			if (strBracket) {
				return strBracket
			}
			return code.charCodeAt(0)
		}
	}

	// \\above -> empty above block (up and down)
	// \\sqrt ->   empty sqrt
	// / -> empty frac
	// _ -> empty base and empty index; _2 -> empty base with index 2
	// _ -> empty base and empty index; _2 -> empty base with index 2
	// \hat -> diacritic without base

	//https://www.cs.bgu.ac.il/~khitron/Equation%20Editor.pdf
	function GetUnicodeAutoCorrectionToken(str, context) {
		if (str[0] !== "\\") {
			return;
		}

		const isLiteral = (str[0] === "\\" && str[1] === "\\");
		const strLocal = isLiteral
			? str.slice(2)
			: str.slice(1);

		const SegmentForSearch = isLiteral ? AutoCorrect[str[2]] : AutoCorrect[str[1]];
		if (SegmentForSearch) {
			for (let i = 0; i < SegmentForSearch.length; i++) {
				let token = SegmentForSearch[i];
				let result = ProcessString(strLocal, token[0]);
				if (undefined === result) {
					continue
				}

				let strData = typeof token[1] === "string"
					? token[1]
					: String.fromCharCode(token[1]);

				context._cursor += isLiteral ? result + 2 : result;
				if (isLiteral) {
					return {
						class: oNamesOfLiterals.operatorLiteral[0],
						data: strData,
					}
				}
				str = isLiteral
					? str.slice(result + 2)
					: str.slice(result + 1);

				str.splice(0, 0, strData)
				return str
			}
		}
	}

	function ProcessString(str, char) {
		let intLenOfRule = 0;
		while (intLenOfRule <= char.length - 1) {
			if (char[intLenOfRule] === str[intLenOfRule]) {
				intLenOfRule++;
			}
			else {
				return;
			}
		}
		return intLenOfRule;
	}

	function ConvertTokens(oTokens, oContext) {
		let Paragraph = oContext.Paragraph;
		let Proceed = function (oTokens, oContext) {
			if (oTokens) {
				switch (oTokens.type) {
					case undefined:
						ConvertTokens(
							oTokens[0],
							oContext,
						);
						break;
					case oNamesOfLiterals.functionNameLiteral[num]:
					case oNamesOfLiterals.specialScriptNumberLiteral[num]:
					case oNamesOfLiterals.specialScriptCharLiteral[num]:
					case oNamesOfLiterals.specialScriptBracketLiteral[num]:
					case oNamesOfLiterals.specialScriptOperatorLiteral[num]:
					case oNamesOfLiterals.specialIndexNumberLiteral[num]:
					case oNamesOfLiterals.specialIndexCharLiteral[num]:
					case oNamesOfLiterals.specialIndexBracketLiteral[num]:
					case oNamesOfLiterals.specialIndexOperatorLiteral[num]:
					case oNamesOfLiterals.opDecimal[num]:
					case oNamesOfLiterals.charLiteral[num]:
					case oNamesOfLiterals.operatorLiteral[num]:
					case oNamesOfLiterals.mathOperatorLiteral[num]:
					case oNamesOfLiterals.opNaryLiteral[num]:
					case oNamesOfLiterals.numberLiteral[num]:
						oContext.Add_Text(oTokens.value, Paragraph);
						break;
					case oNamesOfLiterals.preScriptLiteral[num]:
						let oPreSubSup = oContext.Add_Script(
							oTokens.up && oTokens.down,
							{ctrPrp: new CTextPr(), type: DEGREE_PreSubSup},
							null,
							null,
							null
						);
						ConvertTokens(
							oTokens.value,
							oPreSubSup.getBase(),
						);
						UnicodeArgument(
							oTokens.up,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oPreSubSup.getUpperIterator()
						)
						UnicodeArgument(
							oTokens.down,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oPreSubSup.getLowerIterator()
						)
						break;
					case oNamesOfLiterals.accentLiteral[num]:
						let oAccent = oContext.Add_Accent(
							new CTextPr(),
							oTokens.value.charCodeAt(0),
							null
						);
						UnicodeArgument(
							oTokens.base,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oAccent.getBase()
						)
						break;
					case oNamesOfLiterals.fractionLiteral[num]:
						let oFraction = oContext.Add_Fraction(
							{},
							null,
							null
						);
						UnicodeArgument(
							oTokens.up,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oFraction.getNumeratorMathContent()
						)
						UnicodeArgument(
							oTokens.down,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oFraction.getDenominatorMathContent()
						)
						break;
					case oNamesOfLiterals.binomLiteral[num]:
						let oBinom = oContext.Add_Fraction(
							{ctrPrp : new CTextPr(), type : NO_BAR_FRACTION},
							null,
							null
						);
						UnicodeArgument(
							oTokens.up,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oBinom.getNumeratorMathContent()
						);
						UnicodeArgument(
							oTokens.down,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oBinom.getDenominatorMathContent()
						);
						break;
					case oNamesOfLiterals.subSupLiteral[num]:
						if (oTokens.value.type === oNamesOfLiterals.functionLiteral[num]) {
							let oFunc = oContext.Add_Function({}, null, null);
							let oFuncName = oFunc.getFName();
							let SubSup = oFuncName.Add_Script(
								oTokens.up && oTokens.down,
								{},
								null,
								null,
								null
							);
							SubSup.getBase().Add_Text(oTokens.value.value)

							UnicodeArgument(
								oTokens.up,
								oNamesOfLiterals.bracketBlockLiteral[num],
								SubSup.getUpperIterator()
							)
							UnicodeArgument(
								oTokens.down,
								oNamesOfLiterals.bracketBlockLiteral[num],
								SubSup.getLowerIterator()
							)

							let oFuncArgument = oFunc.getArgument();
							UnicodeArgument(
								oTokens.third,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oFuncArgument
							)
						}
						else if (oTokens.value.type === oNamesOfLiterals.functionWithLimitLiteral[num]) {
							let oFuncWithLimit = oContext.Add_FunctionWithLimit(
								{},
								null,
								null,
							);
							oFuncWithLimit
								.getFName()
								.Content[0]
								.getFName()
								.Add_Text(oTokens.value.value);

							let oLimitIterator = oFuncWithLimit
								.getFName()
								.Content[0]
								.getIterator();

							if (oTokens.up || oTokens.down) {
								UnicodeArgument(
									oTokens.up === undefined ? oTokens.down : oTokens.up,
									oNamesOfLiterals.bracketBlockLiteral[num],
									oLimitIterator
								)
							}
							UnicodeArgument(
								oTokens.third,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oFuncWithLimit.getArgument()
							)
						}
						else if (oTokens.value.type === oNamesOfLiterals.opNaryLiteral[num]) {
							let oNary = oContext.Add_NAry({chr: oTokens.value.value.charCodeAt(0)}, null, null, null);
							ConvertTokens(
								oTokens.third,
								oNary.getBase(),
							);
							UnicodeArgument(
								oTokens.up,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oNary.getSupMathContent()
							)
							UnicodeArgument(
								oTokens.down,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oNary.getSubMathContent()
							)
						}
						else {
							let isSubSup = (oTokens.up !== undefined && oTokens.down !== undefined && oTokens.up.length > 0 && oTokens.down.length > 0);
							let Pr = {ctrPrp : new CTextPr()};
							if (!isSubSup) {
								if (oTokens.up) {
									Pr.type = DEGREE_SUPERSCRIPT
								} else if (oTokens.down) {
									Pr.type = DEGREE_SUBSCRIPT
								}
							}

							let SubSup = oContext.Add_Script(
								isSubSup,
								Pr,
								null,
								null,
								null
							);
							ConvertTokens(
								oTokens.value,
								SubSup.getBase(),
							);
							UnicodeArgument(
								oTokens.up,
								oNamesOfLiterals.bracketBlockLiteral[num],
								SubSup.getUpperIterator()
							)
							UnicodeArgument(
								oTokens.down,
								oNamesOfLiterals.bracketBlockLiteral[num],
								SubSup.getLowerIterator()
							)
						}
						break;
					case oNamesOfLiterals.functionWithLimitLiteral[num]:
						let Pr = {ctrPrp : new CTextPr()};
						Pr.type = (oTokens.up === undefined)
							? LIMIT_LOW
							: LIMIT_UP;

						let oLimit = oContext.Add_Limit(
							Pr,
							null,
							null,
						);
						ConvertTokens(
							oTokens.value,
							oLimit.getFName()
						);
						if (oTokens.up || oTokens.down) {
							UnicodeArgument(
								oTokens.up === undefined ? oTokens.down : oTokens.up,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oLimit.getIterator()
							)
						}
						break;
					case oNamesOfLiterals.bracketBlockLiteral[num]:
						let oBracket = oContext.Add_DelimiterEx(
							new CTextPr(),
							1,
							[null],
							GetBracketCode(oTokens.left),
							GetBracketCode(oTokens.right),
						);
						ConvertTokens(
							oTokens.value,
							oBracket.getElementMathContent(0)
						);
						break;
					case oNamesOfLiterals.sqrtLiteral[num]:
						let oRadical = oContext.Add_Radical(
							{},
							null,
							null
						);
						ConvertTokens(
							oTokens.value,
							oRadical.getBase()
						);
						ConvertTokens(
							oTokens.index,
							oRadical.getDegree()
						);
						break;
					case oNamesOfLiterals.functionLiteral[num]:
						let oFunc = oContext.Add_Function({}, null, null);
						oFunc.getFName().Add_Text(oTokens.value);
						ConvertTokens(
							oTokens.third,
							oFunc.getArgument()
						);
						break;
					case oNamesOfLiterals.spaceLiteral[num]:
						oContext.Add_Text(oTokens.value);
						break;
					case oNamesOfLiterals.mathFontLiteral[num]:
						ConvertTokens(
							oTokens.value,
							oContext,
						);
						break;
					case oNamesOfLiterals.matrixLiteral[num]:
						let strStartBracket, strEndBracket;
						if (oTokens.strMatrixType){
							if (oTokens.strMatrixType.length === 2) {
								strStartBracket = oTokens.strMatrixType[0].charCodeAt(0)
								strEndBracket = oTokens.strMatrixType[1].charCodeAt(0)
							}
							else {
								strEndBracket = strStartBracket = oTokens.strMatrixType[0].charCodeAt(0)
							}
						}
						let rows = oTokens.value.length;
						let cols = oTokens.value[0].length;
						if (strEndBracket && strStartBracket) {
							let Delimiter = oContext.Add_DelimiterEx(new CTextPr(), 1, [null], strStartBracket, strEndBracket);
							oContext = Delimiter.getElementMathContent(0);
						}
						let oMatrix = oContext.Add_Matrix(new CTextPr(), rows, cols, false, []);

						for (let intRow = 0; intRow < rows; intRow++) {
							for (let intCol = 0; intCol < cols; intCol++) {
								let oContent = oMatrix.getContentElement(intRow, intCol);
								ConvertTokens(
									oTokens.value[intRow][intCol],
									oContent,
								);
							}
						}
						break;
					case oNamesOfLiterals.arrayLiteral[num]:
						let intCountOfRows = oTokens.value.length
						let oEqArray = oContext.Add_EqArray({ctrPrp: new CTextPr(), row : intCountOfRows}, null, null);
						for (let i = 0; i < oTokens.value.length; i++) {
							let oMathContent = oEqArray.getElementMathContent(i);
							ConvertTokens(
								oTokens.value[i],
								oMathContent,
							);
						}
						break;
					case oNamesOfLiterals.boxLiteral[num]:
						let oBox = oContext.Add_Box({}, null);
						UnicodeArgument(
							oTokens.value,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oBox.getBase(),
						)
						break;
					case oNamesOfLiterals.rectLiteral[num]:
						let oBorderBox = oContext.Add_BorderBox({}, null);
						UnicodeArgument(
							oTokens.value,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oBorderBox.getBase(),
						)
						break;
					case oNamesOfLiterals.overBarLiteral[num]:
						let oBar = oContext.Add_Bar({ctrPrp : new CTextPr(), pos : LOCATION_BOT}, null);
						UnicodeArgument(
							oTokens.value,
							oNamesOfLiterals.bracketBlockLiteral[num],
							oBar.getBase(),
						)
						break;
				}
			}
		}

		const UnicodeArgument = function(oInput, oComparison, oContext) {
			if (oInput && type === 0 && oInput.type === oComparison) {
				ConvertTokens(
					oInput.value,
					oContext,
				)
			}
			else if (oInput) {
				ConvertTokens(
					oInput,
					oContext,
				)
			}
		}


		let num = 1;
		if (oTokens !== undefined && (oTokens.type === "LaTeXEquation" || oTokens.type === "UnicodeEquation")) {
			oTokens = oTokens.body;
			type = oTokens.type === "LaTeXEquation" ? 1 : 0;
		}
		if (oTokens !== undefined && Array.isArray(oTokens)) {
			for (let i = 0; i < oTokens.length; i++) {
				if (Array.isArray(oTokens[i])) {
					let oToken = oTokens[i];
					for (let j = 0; j < oTokens[i].length; j++) {
						Proceed(oToken[j], oContext);
					}
				} else {
					Proceed(oTokens[i], oContext);
				}
			}
		}
		else {
			Proceed(oTokens, oContext)
		}
	}

	function Tokenizer() {
		this._string = undefined;
		this._cursor = undefined;
		this.state = [];
	}

	Tokenizer.prototype.Init = function (string) {
		this._string = this.GetSymbols(string);
		this._cursor = 0;
	}
	/**
	 * Iterate through all characters in a string to account for surrogate pairs
	 * https://mathiasbynens.be/notes/javascript-unicode
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#fixing_charcodeat_to_handle_non-basic-multilingual-plane_characters_if_their_presence_earlier_in_the_string_is_known
	 */
	Tokenizer.prototype.GetSymbols = function (string) {
		let index = 0;
		let output = [];
		for (; index < string.length; ++index) {
			let charCode = string.charCodeAt(index);
			if (charCode >= 0xd800 && charCode <= 0xdbff) {
				charCode = string.charCodeAt(index + 1);
				if (charCode >= 0xdc00 && charCode <= 0xdfff) {
					output.push(string.slice(index, index + 2));
					++index;
					continue;
				}
			}
			output.push(string.charAt(index));
		}
		return output;
	}
	Tokenizer.prototype.IsHasMoreTokens = function () {
		return this._cursor < this._string.length;
	}
	Tokenizer.prototype.GetNextToken = function () {
		if (!this.IsHasMoreTokens()) {
			return {
				class: undefined,
				data: undefined,
			};
		}

		let autoCorrectRule,
			tokenValue,
			tokenClass,
			strError = "",
			string = this._string.slice(this._cursor);

		for (let i = wordAutoCorrection.length - 1; i >= 0; i--) {
			autoCorrectRule = wordAutoCorrection[i];

			tokenValue = this.MatchToken(autoCorrectRule[0], string);
			if (tokenValue === null && autoCorrectRule.length >= 2 && autoCorrectRule[1] !== undefined) {
				tokenValue = this.MatchToken(autoCorrectRule[1], string);
			}

			if (tokenValue === null) {
				continue
			}
			else if (autoCorrectRule.length === 2) {
				tokenClass = oNamesOfLiterals.charLiteral[0];
				tokenValue = autoCorrectRule[1];
			}
			else if (autoCorrectRule.length === 3) {
				if (typeof autoCorrectRule[0] === "function") {
					tokenClass = autoCorrectRule[2];
				}
				else {
					tokenValue = (autoCorrectRule[1] === undefined)
						? autoCorrectRule[0]
						: autoCorrectRule[1];

					tokenClass = (autoCorrectRule[2] === true)
						? tokenValue
						: autoCorrectRule[2];
				}
			}

			return {
				class: tokenClass,
				data: tokenValue,
			}
		}

		for (let i = 0; i <= this._cursor - 1; i++) {
			strError += " ";
		}
		strError += "^";
		throw new SyntaxError(`Unexpected token: "${string[0]}"\n` + this._string.join('') + "\n" + strError);
	}
	Tokenizer.prototype.ProcessString = function (str, char) {
		let intLenOfRule = 0;
		while (intLenOfRule <= char.length - 1) {
			if (char[intLenOfRule] === str[intLenOfRule]) {
				intLenOfRule++;
			}
			else {
				return;
			}
		}
		return char;
	}
	Tokenizer.prototype.MatchToken = function (regexp, string) {
		let oMatched = (typeof regexp === "function")
			? regexp(string, this)
			: this.ProcessString(string, regexp);

		if (oMatched === null || oMatched === undefined) {
			return null;
		}
		this._cursor += this.GetSymbols(oMatched).length;
		return oMatched;
	}
	Tokenizer.prototype.SaveState = function () {
		this.state.push({
			_string: this._string,
			_cursor: this._cursor,
		})
	}
	Tokenizer.prototype.RestoreState = function () {
		let oState = this.state.shift();
		this._cursor = oState._cursor;
		this._string = oState._string;
	}

	function GetFixedCharCodeAt(str) {
		let code = str.charCodeAt(0);
		let hi, low;

		if (0xd800 <= code && code <= 0xdbff) {
			hi = code;
			low = str.charCodeAt(1);
			if (isNaN(low)) {
				return null;
			}
			return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
		}
		if (0xdc00 <= code && code <= 0xdfff) {
			return false;
		}
		return code;
	}

	//--------------------------------------------------------export----------------------------------------------------
	window["AscCommonWord"] = window["AscCommonWord"] || {};
	window["AscCommonWord"].oNamesOfLiterals = oNamesOfLiterals;
	window["AscCommonWord"].GetUnicodeAutoCorrectionToken = GetUnicodeAutoCorrectionToken;
	window["AscCommonWord"].ConvertTokens = ConvertTokens;
	window["AscCommonWord"].Tokenizer = Tokenizer;
	window["AscCommonWord"].UnicodeSpecialScript = UnicodeSpecialScript;
	window["AscCommonWord"].LimitFunctions = limitFunctions;
	window["AscCommonWord"].functionNames = functionNames;
	window["AscCommonWord"].GetTypeFont = GetTypeFont;
	window["AscCommonWord"].GetMathFontChar = GetMathFontChar;

})(window);
