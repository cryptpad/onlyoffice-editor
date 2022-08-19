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
		skewedFractionLiteral: [54, "skewedFractionLiteral"],
		EqArrayliteral: [55, "EqArrayliteral"],
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
			oNamesOfLiterals.charLiteral[0],
		],
		//Accent
		[
			function (str) {
				const code = GetFixedCharCodeAt(str[0]);
				if (code >= 768 && code <= 879) {
					return str[0];
				}
			},
			oNamesOfLiterals.accentLiteral[0],
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

		["  ", oNamesOfLiterals.spaceLiteral[0]], // 2/18em space  very thin math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 3/18em space thin math space
		["  ", oNamesOfLiterals.spaceLiteral[0]],  // 7/18em space  very very thick math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // Digit-width space
		[" ",  oNamesOfLiterals.spaceLiteral[0]], // Space-with space (non-breaking space)
		["\t", oNamesOfLiterals.spaceLiteral[0]], //Tab
		["\n", oNamesOfLiterals.spaceLiteral[0]],

		["⁣", oNamesOfLiterals.operatorLiteral[0]],
		["⁤", oNamesOfLiterals.operatorLiteral[0]],

		//Unicode DB operators
		["⨯", oNamesOfLiterals.operatorLiteral[0]],
		["⨝", oNamesOfLiterals.operatorLiteral[0]],
		["⟕", oNamesOfLiterals.operatorLiteral[0]],
		["⟖", oNamesOfLiterals.operatorLiteral[0]],
		["⟗", oNamesOfLiterals.operatorLiteral[0]],
		["⋉", oNamesOfLiterals.operatorLiteral[0]],
		["⋊", oNamesOfLiterals.operatorLiteral[0]],
		["▷", oNamesOfLiterals.operatorLiteral[0]],

		["(", oNamesOfLiterals.opOpenBracket[0]],
		[")", oNamesOfLiterals.opCloseBracket[0]],
		["{", oNamesOfLiterals.opOpenBracket[0]],
		["}", oNamesOfLiterals.opCloseBracket[0]],

		["^", true],
		["_", true],

		// ["!", oNamesOfLiterals.charLiteral[0]],
		// ["!!", "‼", oNamesOfLiterals.charLiteral[0]],
		// ["...", "…"],
		// ["::", "∷"],
		// [":=", "≔"],

		// ["~=", "≅", oNamesOfLiterals.operatorLiteral[0]],
		// ["+-", "±"],
		// ["-+", "∓"],
		// ["<<", "≪"],
		// ["<=", "≤"],
		// [">=", "≥", oNamesOfLiterals.operatorLiteral[0]],
		// ["->", "→"],
		// [">>", "≫"],

		["&", true],
		["@", true],
		["array(", oNamesOfLiterals.matrixLiteral[0]],

		["⁰", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["¹", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["²", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["³", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁴", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁵", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁶", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁷", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁸", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["⁹", oNamesOfLiterals.specialScriptNumberLiteral[0]],
		["ⁱ",  oNamesOfLiterals.specialScriptCharLiteral[0]],
		["ⁿ", oNamesOfLiterals.specialScriptCharLiteral[0]],
		["⁺", oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁻", oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁼", oNamesOfLiterals.specialScriptOperatorLiteral[0]],
		["⁽", oNamesOfLiterals.specialScriptBracketLiteral[0]],
		["⁾", oNamesOfLiterals.specialScriptBracketLiteral[0]],

		["₀", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₁", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₂", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₃", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₄", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₅", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₆", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₇", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₈", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₉", oNamesOfLiterals.specialIndexNumberLiteral[0]],
		["₊", oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₋", oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₌", oNamesOfLiterals.specialIndexOperatorLiteral[0]],
		["₍", oNamesOfLiterals.specialIndexBracketLiteral[0]],
		["₎", oNamesOfLiterals.specialIndexBracketLiteral[0]],

		["/", oNamesOfLiterals.overLiteral[0]], // opOpen
		["'", oNamesOfLiterals.accentLiteral[0]],
		["''", oNamesOfLiterals.accentLiteral[0]],
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\|", oNamesOfLiterals.opOpenCloseBracket[0]],

		["⊘",  oNamesOfLiterals.overLiteral[0]],
		["⒞", oNamesOfLiterals.overLiteral[0]],
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["||", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\/", oNamesOfLiterals.overLiteral[0]],

		["+", oNamesOfLiterals.operatorLiteral[0]],
		["-", oNamesOfLiterals.operatorLiteral[0]],
		["*", oNamesOfLiterals.operatorLiteral[0]],
		["=", oNamesOfLiterals.operatorLiteral[0]],
		["≶", oNamesOfLiterals.operatorLiteral[0]],
		["≷", oNamesOfLiterals.operatorLiteral[0]],

		["\\", oNamesOfLiterals.opCloseBracket[0]],

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
			oNamesOfLiterals.charLiteral[0]
		],

		["┴", true],
		["Α"],
		["̿", oNamesOfLiterals.accentLiteral[0]], //todo
		["Β"],
		["□", oNamesOfLiterals.boxLiteral[0]],
		["\\Bmatrix", oNamesOfLiterals.matrixLiteral[0]],
		["Χ"],
		["ⅅ"],
		["Δ"],
		["≜"],
		["⇓"],
		["Ε"],
		["Η"],
		["Γ"],
		["Γ"],
		["ℑ"],
		["Ι"],
		["Κ"],
		["Λ"],
		["⇐"],
		["⇔", oNamesOfLiterals.operatorLiteral[0]],
		["⟸"],
		["⟺"],
		["⟹"],
		["Μ"],
		["Ν"],
		["Ο"],
		["Ω"],
		["Φ"],
		["Π"],
		["Ψ"],
		["⟫", oNamesOfLiterals.opCloseBracket[0]],
		["⟧", oNamesOfLiterals.opCloseBracket[0]],
		["ℜ"],
		["Ρ"],
		["⇒", oNamesOfLiterals.operatorLiteral[0]],
		["Σ"],
		["Τ"],
		["Θ"],
		["̳", oNamesOfLiterals.accentLiteral[0]], //check
		["⇑"],
		["⇕"],
		["Υ"],
		["‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		["⒩", oNamesOfLiterals.matrixLiteral[0]],
		["Ξ"],
		["Ζ"],
		["┴", true],
		["́", oNamesOfLiterals.accentLiteral[0]],
		["ℵ"],
		["α"],
		["∐", oNamesOfLiterals.opNaryLiteral[0]],
		["∠"],
		["∳", oNamesOfLiterals.opNaryLiteral[0]],
		["≈", oNamesOfLiterals.operatorLiteral[0]],
		["⬆"],
		["∗"],
		["≍", oNamesOfLiterals.operatorLiteral[0]],
		["¦", oNamesOfLiterals.overLiteral[0]], //LateX true
		["■", oNamesOfLiterals.matrixLiteral[0]],
		["‵", oNamesOfLiterals.accentLiteral[0]],
		["̅", oNamesOfLiterals.accentLiteral[0]],
		["∵"],
		["〖", oNamesOfLiterals.opOpenBracket[0]], //Unicode  LaTeX: ["\\begin{"],
		["\\begin{", true],
		["\\begin{equation}",  true],
		["\\begin{array}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{cases}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{matrix}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{pmatrix}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{bmatrix}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{Bmatrix}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{vmatrix}", oNamesOfLiterals.matrixLiteral[0]],
		["\\begin{Vmatrix}", oNamesOfLiterals.matrixLiteral[0]],
		["┬", true],
		["ℶ"],
		["β"],
		["ℶ"],
		["\\bmatrix", oNamesOfLiterals.matrixLiteral[0]],
		["\\bmod", " mod ", oNamesOfLiterals.charLiteral[0]],
		["⋂", oNamesOfLiterals.opNaryLiteral[0]], // todo in unicode NaryOp REFACTOR ["⋂", oNamesOfLiterals.opNaryLiteral[0]],
		["⋃", oNamesOfLiterals.opNaryLiteral[0]], // 	["⋃", oNamesOfLiterals.opNaryLiteral[0]],
		["⨀", oNamesOfLiterals.opNaryLiteral[0]], //["⨀", oNamesOfLiterals.opNaryLiteral[0]],
		["⨁", oNamesOfLiterals.opNaryLiteral[0]], //["⨁", oNamesOfLiterals.opNaryLiteral[0]],
		["⨂", oNamesOfLiterals.opNaryLiteral[0]], //["⨂", oNamesOfLiterals.opNaryLiteral[0]],
		["⨆", oNamesOfLiterals.opNaryLiteral[0]], //["⨆", oNamesOfLiterals.opNaryLiteral[0]],
		["⨄", oNamesOfLiterals.opNaryLiteral[0]], //		["⨄", oNamesOfLiterals.opNaryLiteral[0]],
		["⋁", oNamesOfLiterals.opNaryLiteral[0]],
		["⋀", oNamesOfLiterals.opNaryLiteral[0]],
		["\\binom", true],
		["⊥", oNamesOfLiterals.operatorLiteral[0]],
		["⋈"],
		["□", oNamesOfLiterals.boxLiteral[0]],
		["⊡"],
		["⊟"],
		["\\boxplus", "⊞"],
		["⟨", oNamesOfLiterals.opOpenBracket[0]],
		["\\break", "⤶"],
		["̆", oNamesOfLiterals.accentLiteral[0]],
		["∙"],
		["∩"],
		["\\cr", "\\\\", true],
		["█", true],//Ⓒ
		["∛", oNamesOfLiterals.sqrtLiteral[0]], //oNamesOfLiterals.opBuildupLiteral[0] to functionLiteral?
		["⋅", oNamesOfLiterals.operatorLiteral[0]],
		["⋯"],
		["\\cfrac", true],// https://www.tutorialspoint.com/tex_commands/cfrac.htm
		["̌", oNamesOfLiterals.accentLiteral[0]],
		["χ"],
		["∘"],
		["┤", true],
		["♣"],
		["∲", oNamesOfLiterals.opNaryLiteral[0]],
		["≅", oNamesOfLiterals.operatorLiteral[0]],
		["∋", oNamesOfLiterals.operatorLiteral[0]],
		["∐", oNamesOfLiterals.opNaryLiteral[0]], //check type
		["∪"],
		["ℸ"],
		["ℸ"],
		["⊣"],
		["ⅆ"],
		["⃜", oNamesOfLiterals.accentLiteral[0]],
		["⃛", oNamesOfLiterals.accentLiteral[0]],
		["̈", oNamesOfLiterals.accentLiteral[0]],
		["⋱"],
		["≝"],
		["℃"],
		["℉"],
		["°"],
		["δ"],
		["\\dfrac{", true],
		["⋄"],
		["♢"],
		["÷", oNamesOfLiterals.operatorLiteral[0]],
		["̇", oNamesOfLiterals.accentLiteral[0]],
		["≐"],
		["…"],
		["↓"],
		["⬇"],
		["ⅇ"],
		["ℓ"],
		["∅"],
		[" ", oNamesOfLiterals.spaceLiteral[0]], // [" ", oNamesOfLiterals.spaceLiteral[0]], // 1em space
		["〗", oNamesOfLiterals.opCloseBracket[0]], //LaTeX ["\\end{"],
		["\\end{equation}", true],
		["\\end{array}", "endOfMatrix"],
		["\\end{cases}", "endOfMatrix"],
		["\\end{matrix}", "endOfMatrix"],
		["\\end{pmatrix}", "endOfMatrix"],
		["\\end{bmatrix}", "endOfMatrix"],
		["\\end{Bmatrix}", "endOfMatrix"],
		["\\end{vmatrix}", "endOfMatrix"],
		["\\end{Vmatrix}", "endOfMatrix"],
		[" ", oNamesOfLiterals.spaceLiteral[0],], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 9/18em space
		["ϵ"],
		["█", true],
		["#"],
		["≡", oNamesOfLiterals.operatorLiteral[0]],
		["η"],
		["∃", oNamesOfLiterals.operatorLiteral[0]],
		["∀", oNamesOfLiterals.operatorLiteral[0]], //fractur
		["\\frac", true],
		["⌑"],
		["⁡", oNamesOfLiterals.operatorLiteral[0]],
		["γ"],
		["≥", oNamesOfLiterals.operatorLiteral[0]],
		["≥", oNamesOfLiterals.operatorLiteral[0]],
		["←"],
		["≫"],
		["ℷ"],//0x2137
		["̀", oNamesOfLiterals.accentLiteral[0]],
		[" ", oNamesOfLiterals.spaceLiteral[0]], //	[" ", oNamesOfLiterals.spaceLiteral[0]], // 1/18em space very very thin math space
		["̂", oNamesOfLiterals.accentLiteral[0]], //["\\hat", oNamesOfLiterals.accentLiteral[0], 770],
		["ℏ"],//0x210f
		["♡"],
		["↩"],
		["↪"],
		["⬄"],
		["⬌"],
		["⃑"],
		["ⅈ"],//0x2148
		["⨌", oNamesOfLiterals.opNaryLiteral[0]], //LaTeX oNamesOfLiterals.functionLiteral[0] //Unicode oNamesOfLiterals.opNaryLiteral[0]
		["∭", oNamesOfLiterals.opNaryLiteral[0]],
		["∬", oNamesOfLiterals.opNaryLiteral[0]],
		["𝚤"],
		["∈", oNamesOfLiterals.operatorLiteral[0]],
		["∆"],
		["∞"],
		["∫", oNamesOfLiterals.opNaryLiteral[0]],
		["ι"],
		//["\\itimes", "⁢", oNamesOfLiterals.operatorLiteral[0]],
		["Jay"],
		["ⅉ"],
		["𝚥"],
		["κ"],
		["⟩", oNamesOfLiterals.opCloseBracket[0]],
		["λ"],
		["⟨", oNamesOfLiterals.opOpenBracket[0]],
		["⟦", oNamesOfLiterals.opOpenBracket[0]],
		["\\{", oNamesOfLiterals.opOpenBracket[0]], // todo check in word { or \\{
		["[", oNamesOfLiterals.opOpenBracket[0]],
		["⌈", oNamesOfLiterals.opOpenBracket[0]],
		["∕", oNamesOfLiterals.overLiteral[0]],
		["∕", oNamesOfLiterals.overLiteral[0]],
		["…"],
		["≤", oNamesOfLiterals.operatorLiteral[0]],
		["├", true], //LaTeX type === \left
		["←"],
		["↽"],
		["↼"],
		["↔"],
		["≤"],
		["⌊", oNamesOfLiterals.opOpenBracket[0]],
		["⃐", oNamesOfLiterals.opOpenBracket[0]], //check word
		["\\limits", true],
		["≪"],
		["⟦", oNamesOfLiterals.opOpenBracket[0]],
		["⎰", oNamesOfLiterals.opOpenBracket[0]],
		["⇋"],
		["⃖", oNamesOfLiterals.accentLiteral[0]],
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["↦"],
		["■", oNamesOfLiterals.matrixLiteral[0]],
		[" ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 4/18em space medium math space
		["∣", true],
		["ⓜ", true],
		["⊨"],
		["∓"],
		["μ"],
		["∇"],
		["▒", true],
		[" ", oNamesOfLiterals.spaceLiteral[0]],
		["≠"],
		["↗"],
		["¬", oNamesOfLiterals.operatorLiteral[0]],
		["≠"],
		["∋", oNamesOfLiterals.operatorLiteral[0]],
		["‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		//["\\not", "̸"], //doesn't implement in word
		["∌"],
		["∉"],
		["∉"],
		["ν"],
		["↖"],
		["ο"],
		["⊙"],
		["▒", true],
		["∰", oNamesOfLiterals.opNaryLiteral[0]],
		["∯", oNamesOfLiterals.opNaryLiteral[0]],
		["∮", oNamesOfLiterals.opNaryLiteral[0]],
		["ω"],
		["⊖"],
		["├", true],
		["⊕", oNamesOfLiterals.operatorLiteral[0]],
		["⊗", oNamesOfLiterals.operatorLiteral[0]],
		["\\over", true],
		["¯", oNamesOfLiterals.hBracketLiteral[0]],
		["⏞", oNamesOfLiterals.hBracketLiteral[0]],
		["⎴", oNamesOfLiterals.hBracketLiteral[0]],
		["¯", true],
		["⏜", oNamesOfLiterals.hBracketLiteral[0]],
		["┴", true],
		["⏠", oNamesOfLiterals.hBracketLiteral[0]],
		["∥"], //check
		["∂"],
		["⊥", oNamesOfLiterals.operatorLiteral[0]],
		["ϕ"],
		["π"],
		["±"],
		["⒨", oNamesOfLiterals.matrixLiteral[0]],
		["⁗", oNamesOfLiterals.accentLiteral[0]],
		["‴", oNamesOfLiterals.accentLiteral[0]],
		["″", oNamesOfLiterals.accentLiteral[0]],
		["≺", oNamesOfLiterals.operatorLiteral[0]],
		["≼", oNamesOfLiterals.operatorLiteral[0]],
		["′", oNamesOfLiterals.accentLiteral[0]],
		["∏", oNamesOfLiterals.opNaryLiteral[0]], //oNamesOfLiterals.functionLiteral[0]
		["∝"],
		["ψ"],
		["∜", oNamesOfLiterals.sqrtLiteral[0]],
		["〉", oNamesOfLiterals.opCloseBracket[0]],
		["⟩", oNamesOfLiterals.opCloseBracket[0]],
		["∶"],
		["}", oNamesOfLiterals.opCloseBracket[0]],
		["]", oNamesOfLiterals.opCloseBracket[0]],
		["⌉", oNamesOfLiterals.opCloseBracket[0]],
		["⋰"],
		["▭", oNamesOfLiterals.rectLiteral[0]],
		["▭", oNamesOfLiterals.rectLiteral[0]],
		["⌋", oNamesOfLiterals.opCloseBracket[0]],
		["ρ"],
		["⃑"],
		["┤", true],
		["→"],
		["⇁"],
		["⇀"],
		["⎱", oNamesOfLiterals.opCloseBracket[0]],
		["⒭", oNamesOfLiterals.sqrtLiteral[0]], //check
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["⁄", oNamesOfLiterals.overLiteral[0]],
		["⁄", oNamesOfLiterals.overLiteral[0]], //Script
		["↘"],
		["∖"],
		["σ"],
		["∼", oNamesOfLiterals.operatorLiteral[0]],
		["≃", oNamesOfLiterals.operatorLiteral[0]],
		["⬍"],
		["⌣"],
		["♠"],
		["⊓"],
		["⊔"],
		["√", oNamesOfLiterals.sqrtLiteral[0]],
		["⊑", oNamesOfLiterals.operatorLiteral[0]],
		["⊒", oNamesOfLiterals.operatorLiteral[0]],
		["⋆"],
		["⊂", oNamesOfLiterals.operatorLiteral[0]],
		["⊆", oNamesOfLiterals.operatorLiteral[0]],
		["█", true],
		["≻", oNamesOfLiterals.operatorLiteral[0]],
		["≽", oNamesOfLiterals.operatorLiteral[0]],
		["∑", oNamesOfLiterals.opNaryLiteral[0]],
		["⊃", oNamesOfLiterals.operatorLiteral[0]],
		["⊇", oNamesOfLiterals.operatorLiteral[0]],
		["√", oNamesOfLiterals.sqrtLiteral[0]],
		["↙"],
		["τ"],
		["∴"],
		["θ"],
		[" ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 5/18em space thick math space
		[" ", oNamesOfLiterals.spaceLiteral[0]],
		["̃", oNamesOfLiterals.accentLiteral[0]],
		["×", oNamesOfLiterals.operatorLiteral[0]],
		["→"],
		["⊤", oNamesOfLiterals.operatorLiteral[0]],
		["⃡", oNamesOfLiterals.accentLiteral[0]],
		["̲", oNamesOfLiterals.accentLiteral[0]], //check
		["┌", oNamesOfLiterals.opOpenBracket[0]],
		["▁", oNamesOfLiterals.hBracketLiteral[0]],
		["⏟", oNamesOfLiterals.hBracketLiteral[0]],
		["⎵", oNamesOfLiterals.hBracketLiteral[0]],
		["▁", true],
		["⏝", oNamesOfLiterals.hBracketLiteral[0]],
		["┬", true],
		["↑"],
		["↕"],
		["⊎"],
		["υ"],
		["┐", oNamesOfLiterals.opCloseBracket[0]],
		["ε"],
		["φ"],
		["ϖ"],
		["∝"],
		["ϱ"],
		["ς"],
		["ϑ"],
		["│", true],
		["⊢", oNamesOfLiterals.operatorLiteral[0]],
		["⋮"],
		["⃗", oNamesOfLiterals.accentLiteral[0]],
		["∨", oNamesOfLiterals.operatorLiteral[0]],
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["⇳"],
		[" ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 6/18em space very thick math space
		["∧", oNamesOfLiterals.operatorLiteral[0]],
		["̂", oNamesOfLiterals.accentLiteral[0]], //["\\hat", oNamesOfLiterals.accentLiteral[0], 770],
		["℘"],//0x2118
		["≀"],
		["ξ"],
		["ζ"],
		["‌"],
		["​", oNamesOfLiterals.spaceLiteral[0]], //["​", oNamesOfLiterals.spaceLiteral[0]], // zero-width space

		["√", oNamesOfLiterals.sqrtLiteral[0]],
		//["√(", oNamesOfLiterals.sqrtLiteral[0]],
		["\\}", oNamesOfLiterals.opCloseBracket[0]],
		["\\|", "‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\\\", true],

		["\\sf",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\script",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\scr",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\rm",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\oldstyle", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathtt",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfit", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfbfit", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsfbf",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathsf", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathrm",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathit", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathfrak", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathcal", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbfit",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbffrak", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbfcal",  oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbf", oNamesOfLiterals.mathFontLiteral[0]],
		["\\mathbb", oNamesOfLiterals.mathFontLiteral[0]],
		["\\it", oNamesOfLiterals.mathFontLiteral[0]],
		["\\fraktur", oNamesOfLiterals.mathFontLiteral[0]],
		["\\frak", oNamesOfLiterals.mathFontLiteral[0]],
		["\\double", oNamesOfLiterals.mathFontLiteral[0]],
		["\\sfrac", true],

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

		["\\\\", true],
		// ["\\lim", oNamesOfLiterals.opNaryLiteral[0]], LaTeX
		// ["\\lg", oNamesOfLiterals.opNaryLiteral[0]],

		// ["/<", "≮", oNamesOfLiterals.operatorLiteral[0]],
		// ["/=", "≠", oNamesOfLiterals.operatorLiteral[0]],
		// ["/>", "≯", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\exists", "∄", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\in", "∉", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\ni", "∌", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\simeq", "≄", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\cong", "≇", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\approx", "≉", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\asymp", "≭", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\equiv", "≢", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\le", "≰", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\ge", "≱", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\lessgtr", "≸", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\gtrless", "≹", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\succeq", "⋡", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\prec", "⊀", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\succ", "⊁", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\preceq", "⋠", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\subset", "⊄", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\supset", "⊅", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\subseteq", "⊈", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\supseteq", "⊉", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\sqsubseteq", "⋢", oNamesOfLiterals.operatorLiteral[0]],
		// ["/\\sqsupseteq", "⋣", oNamesOfLiterals.operatorLiteral[0]],

		[",", true],
		[".", true],

		[
			function (str) {
				if (str[0] === "\\") {
					let strOutput = "\\";
					let index = 1;
					while (str[index] && /[a-zA-Z]/.test(str[index])) {
						strOutput += str[index];
						index++;
					}
					if (functionNames.includes(strOutput.slice(1)) || limitFunctions.includes(strOutput.slice(1))) {
						return strOutput;
					}
				}
				else {
					let index = 0;
					let strOutput = "";
					while (str[index] && /[a-zA-Z]/.test(str[index])) {
						strOutput += str[index];
						index++;
					}
					if (limitFunctions.includes(strOutput) || functionNames.includes(strOutput)) {
						return strOutput
					}
				}
			},
			oNamesOfLiterals.functionLiteral[0]
		],
	];
	const functionNames = [
		"tan", "tanh", "sup", "sinh", "sin", "sec", "ker", "hom",
		"arg", "arctan", "arcsin", "arcsec", "arccsc", "arccot", "arccos",
		"inf", "gcd", "exp", "dim", "det", "deg", "csc", "coth", "cot",
		"cosh", "cos", "Pr", "lg", "ln", "log", "sgn",
	];
	const limitFunctions = [
		"lim", "min", "max",
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
			"〖": -1,
			"〗": -1,
		}
		if (code) {
			let strBracket = oBrackets[code];
			if (strBracket) {
				return strBracket
			}
			return code.charCodeAt(0)
		}
	}

	function GetHBracket(code) {
		switch (code) {
			case "⏜":
				return VJUST_TOP;
			case "⏝":
				return VJUST_BOT;
			case "⏞":
				return VJUST_TOP;
			case "⏟":
				return VJUST_BOT;
			case "⏠":
				return VJUST_TOP;
			case "⏡":
				return VJUST_BOT;
			case "⎴":
				return VJUST_BOT;
			case "⎵":
				return VJUST_TOP;
		}
	}

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
		if (typeof oTokens === "object") {
			const Paragraph = oContext.Paragraph;
			const Proceed = function (oTokens, oContext) {
				if (oTokens) {
					switch (oTokens.type) {
						case undefined:
							for (let i = 0; i < oTokens.length; i++) {
								ConvertTokens(
									oTokens[i],
									oContext,
								);
							}
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
							if (oTokens.decimal) {
								ConvertTokens(
									oTokens.left,
									oContext,
								);
								oContext.Add_Text(oTokens.decimal, Paragraph)
								ConvertTokens(
									oTokens.right,
									oContext,
								);
							}
							else {
								oContext.Add_Text(oTokens.value, Paragraph);
							}
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
								GetFixedCharCodeAt(oTokens.value),
								null
							);
							UnicodeArgument(
								oTokens.base,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oAccent.getBase()
							)
							break;
						case oNamesOfLiterals.skewedFractionLiteral[num]:
						case oNamesOfLiterals.fractionLiteral[num]:
						case oNamesOfLiterals.binomLiteral[num]:
							let oFraction;
							if (oTokens.type === oNamesOfLiterals.binomLiteral[num]) {
								oFraction = oContext.Add_Fraction(
									{ctrPrp: new CTextPr(), type: NO_BAR_FRACTION},
									null,
									null
								);
							}
							else if (oTokens.type === oNamesOfLiterals.fractionLiteral[num]) {
								oFraction = oContext.Add_Fraction(
									{ctrPrp: new CTextPr(), type: oTokens.fracType},
									null,
									null
								);
							}
							else if (oTokens.type === oNamesOfLiterals.skewedFractionLiteral[num]) {
								oFraction = oContext.Add_Fraction(
									{ctrPrp: new CTextPr(), type: SKEWED_FRACTION},
									null,
									null
								);
							}
							UnicodeArgument(
								oTokens.up,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oFraction.getNumeratorMathContent()
							);
							UnicodeArgument(
								oTokens.down,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oFraction.getDenominatorMathContent()
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
								let isSubSup = ((Array.isArray(oTokens.up) && oTokens.up.length > 0) || (!Array.isArray(oTokens.up) && oTokens.up !== undefined)) &&
									((Array.isArray(oTokens.down) && oTokens.down.length > 0) || (!Array.isArray(oTokens.down) && oTokens.down !== undefined))

								let Pr = {ctrPrp: new CTextPr()};
								if (!isSubSup) {
									if (oTokens.up) {
										Pr.type = DEGREE_SUPERSCRIPT
									}
									else if (oTokens.down) {
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
							let oFuncWithLimit = oContext.Add_FunctionWithLimit(
								{},
								null,
								null,
							);
							if (typeof oTokens.value === "object") {
								UnicodeArgument(
									oTokens.value,
									oNamesOfLiterals.bracketBlockLiteral[num],
									oFuncWithLimit.getFName().Content[0].getFName()
								)
							}
							else {
								oFuncWithLimit
									.getFName()
									.Content[0]
									.getFName()
									.Add_Text(oTokens.value);
							}

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
							break;

						case oNamesOfLiterals.hBracketLiteral[num]:
							let intBracketPos = GetHBracket(oTokens.hBrack);
							let intIndexPos = oTokens.up === undefined ? LIMIT_LOW : LIMIT_UP;

							if (!(oTokens.up || oTokens.down)) {
								let oGroup = oContext.Add_GroupCharacter({
									ctrPrp: new CTextPr(),
									chr: oTokens.hBrack.charCodeAt(0),
									pos: intBracketPos,
									vertJc: 1
								}, null);
								UnicodeArgument(
									oTokens.value,
									oNamesOfLiterals.bracketBlockLiteral[num],
									oGroup.getBase()
								)
							}
							else {
								let Limit = oContext.Add_Limit({ctrPrp: new CTextPr(), type: intIndexPos}, null, null);
								let MathContent = Limit.getFName();
								let oGroup = MathContent.Add_GroupCharacter({
									ctrPrp: new CTextPr(),
									chr: oTokens.hBrack.charCodeAt(0),
									vertJc: 1,
									pos: intBracketPos
								}, null);

								UnicodeArgument(
									oTokens.value,
									oNamesOfLiterals.bracketBlockLiteral[num],
									oGroup.getBase()
								)

								if (oTokens.down || oTokens.up) {
									UnicodeArgument(
										oTokens.up === undefined ? oTokens.down : oTokens.up,
										oNamesOfLiterals.bracketBlockLiteral[num],
										Limit.getIterator()
									)
								}
							}

							break;
						case oNamesOfLiterals.bracketBlockLiteral[num]:
							let oBracket = oContext.Add_DelimiterEx(
								new CTextPr(),
								oTokens.value.length ? oTokens.value.length : 1,
								[null],
								GetBracketCode(oTokens.left),
								GetBracketCode(oTokens.right),
							);
							if (oTokens.value.length) {
								for (let intCount = 0; intCount < oTokens.value.length; intCount++) {
									ConvertTokens(
										oTokens.value[intCount],
										oBracket.getElementMathContent(intCount)
									);
								}
							}
							else {
								ConvertTokens(
									oTokens.value,
									oBracket.getElementMathContent(0)
								);
							}

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
							UnicodeArgument(
								oTokens.third,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oFunc.getArgument()
							)
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
							if (oTokens.strMatrixType) {
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
							let oEqArray = oContext.Add_EqArray({
								ctrPrp: new CTextPr(),
								row: intCountOfRows
							}, null, null);
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
							let intLocation = oTokens.overUnder === "▁" ? LOCATION_BOT : LOCATION_TOP;
							let oBar = oContext.Add_Bar({ctrPrp: new CTextPr(), pos: intLocation}, null);
							UnicodeArgument(
								oTokens.value,
								oNamesOfLiterals.bracketBlockLiteral[num],
								oBar.getBase(),
							)
							break;
					}
				}
			}
			const UnicodeArgument = function (oInput, oComparison, oContext) {
				if (oInput && type === 0 && oInput.type === oComparison && oInput.left === "(" && oInput.right === ")") {
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

			let num = 1; // debug
			if (oTokens.type === "LaTeXEquation" || oTokens.type === "UnicodeEquation") {
				type = oTokens.type === "LaTeXEquation" ? 1 : 0;
				oTokens = oTokens.body;
			}
			if (Array.isArray(oTokens)) {
				for (let i = 0; i < oTokens.length; i++) {
					if (Array.isArray(oTokens[i])) {
						let oToken = oTokens[i];
						for (let j = 0; j < oTokens[i].length; j++) {
							Proceed(oToken[j], oContext);
						}
					}
					else {
						Proceed(oTokens[i], oContext);
					}
				}
			}
			else {
				Proceed(oTokens, oContext)
			}
		}
		else {
			oContext.Add_Text(oTokens, oContext.Paragraph);
		}
	}

	function Tokenizer() {
		this._string = [];
		this._cursor = 0;
		this.state = [];
	}

	Tokenizer.prototype.Init = function (string) {
		this._string = this.GetSymbols(string);
		this._cursor = 0;
	}
	Tokenizer.prototype.GetSymbols = function (str) {
		let output = [];
		for (let oIter = str.getUnicodeIterator(); oIter.check(); oIter.next()) {
			output.push(String.fromCodePoint(oIter.value()));
		}
		return output;
	}
	Tokenizer.prototype.GetStringLength = function (str) {
		let len = 0;
		for (let oIter = str.getUnicodeIterator(); oIter.check(); oIter.next()) {
			len++;
		}
		return len;
	}
	Tokenizer.prototype.IsHasMoreTokens = function () {
		return this._cursor < this._string.length;
	}
	Tokenizer.prototype.GetTextOfToken = function (intIndex, isLaTeX) {
		let arrToken = wordAutoCorrection[intIndex];
		if (typeof arrToken[0] !== "function") {
			if (isLaTeX && arrToken[1] !== undefined) {
				return arrToken[0];
			}
			else if (!isLaTeX && arrToken[1] !== undefined) {
				return arrToken[1];
			}
		}
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
			string = this._string.slice(this._cursor);

		for (let i = wordAutoCorrection.length - 1; i >= 0; i--) {
			autoCorrectRule = wordAutoCorrection[i];

			tokenValue = this.MatchToken(autoCorrectRule[0], string);

			if (tokenValue === null)
			{
				continue;
			}
			else if (autoCorrectRule.length === 1)
			{
				tokenClass = oNamesOfLiterals.charLiteral[1];
			}
			else if (autoCorrectRule.length === 2)
			{
				tokenClass = (autoCorrectRule[1] === true)
					? tokenValue
					: autoCorrectRule[1];
			}

			return {
				class: tokenClass,
				data: tokenValue,
				index: i,
			}
		}
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
		this._cursor += this.GetStringLength(oMatched);
		return oMatched;
	}
	Tokenizer.prototype.SaveState = function (oLookahead) {
		let strClass = oLookahead.class;
		let data = oLookahead.data;
		this.state.push({
			_string: this._string,
			_cursor: this._cursor,
			oLookahead: {
				class: strClass,
				data: data,
			},
		})
	}
	Tokenizer.prototype.RestoreState = function () {
		if (this.state.length > 0) {
			let oState = this.state.shift();
			this._cursor = oState._cursor;
			this._string = oState._string;
			return oState.oLookahead;
		}
	}

	//	Автокррекции НЕ срабатывает только при вводе букв и цифр, есть исключения для скобок
	//
	//	Автокоррекция состоит из нескольник частей:
	//
	//		Есть автокоррекция слов \int \sqrt \in \ifty...
	//			- Слово конвертируются только если ввод происходит после него,
	//			конвертация блоков не влияет на это.
	//
	//
	//		Есть автокоррекция блоков
	//			- Автокррекция происходит блоками(chain convertation), так если ввести x^1^2^3,
	//			то при первой орбаботке будет создан X^1^(CDegree 2^3), а при следующем нажатии
	//			X^(СDegree 1^(CDegree 2^3)) и т.д;
	//
	//			- Если ввести оператор(-, +, =, /) или нажать после него пробел конвертнется ВСЕ,
	//			что стоит до него (chain convertation тут не работает);
	//
	//			- Все скобки, кроме ( ) | |, работают как опертаоры
	//				* скобки Не являются оператором для скобок
	//			- Для LaTeX'a имеет смысле добавить в исключения { и }
	//
	//			- Есть правила для автоконвертации основанные на лексере:
	//				* деление по всей видимости конвертится только если есть второй аргумент -> 1/2
	//				* или введен один знак деления (вокруг пробелы, нет первого аргумента и т.п)
	//
	//

	//нужно придумать как убрать дублирование и использовать токенизаторы
	const AutoCorrectionRules = [
		//true обозначает обычный текст, цифры и блоки контента (CFraction, CLmit, CDegree...);
		[true, "_", true, "^", true],
		[true, "^", true, "_", true],
		[true, "/", true],
		["/", true],
		[true, "^", true],
		["^", true],
		[true, "_", true],
		["_", true],
	];
	function AutoCorrectionFunc(oCMathContent, nInputType) {
		this.InputContent = oCMathContent; //CMathContent
		this.isBreak = false;
		this.ProceedContent = [];
		this.FlatDatas = [];
		this.intCounter = 0;
		this.RuleData = [];
		this.FirstElement;
		this.nInputType = nInputType;
	}
	AutoCorrectionFunc.prototype.FillProceedContent = function() {
		if (undefined !== this.InputContent) {
			
			for (let i = this.InputContent.length - 1; i >= 0; i--) {
				let oCurrentContent = this.InputContent[i]; 
				

				if (oCurrentContent !== undefined && oCurrentContent.Content.length > 0 && !this.isBreak) {
					let oProceedObj = new ProceedContent(oCurrentContent, this); 
					this.ProceedContent.push(oProceedObj);
				}
			}
		}
	}
	AutoCorrectionFunc.prototype.ProceedContentFunc = function() {
		for (let i = 0; i < this.ProceedContent.length && !this.isBreak; i++) {
			this.ProceedContent[i].Start();
			this.ProceedContent[i].Clean();

			//обрезка по оператору, а для LaTeX'a по символу //
			this.ProceedContent[i].ProceedOperators(this.nInputType);
			

			if (this.isBreak === true) {
				let intCount = i + 1;
				this.ProceedContent.splice(i+1, this.ProceedContent.length - intCount)
				break;
			}
		}
	}
	AutoCorrectionFunc.prototype.ProceedBracketsAndCut = function() {
		for (let i = 0; i < this.ProceedContent.length; i++) {
			this.ProceedContent[i].oRootContext.TrimUnnecessaryBrackets();
		}
	}
	AutoCorrectionFunc.prototype.ProceedRules = function() {
		for (let i = 0; i < AutoCorrectionRules.length; i++) {

			let arrRule = AutoCorrectionRules[i];
			let intContentOutput = 0;
			let intContentPos = 0;

			for (let nPos = 0; nPos < arrRule.length && nPos === intContentOutput; nPos++, intContentPos++) {

				let assumedObject = arrRule[nPos]; // boolean || str

				if (intContentPos < this.RuleData.length)
				{
					if (assumedObject === true)
					{
						let intNewPos = this.IsTextDataRule(intContentPos);
						
						if (undefined !== intNewPos)
						{
							intContentPos = intNewPos - 1;
							intContentOutput++;
							intNewPos = undefined;
						}
					}
					else
					{
						let isContinue = this.IsContentSameRule(intContentPos, assumedObject);
						
						if (isContinue === true)
						{
							intContentOutput++;
						} else {
							break;
						}
					}
				}
				else
				{
					break;
				}
			}

			if (intContentOutput === arrRule.length)
			{
				return intContentPos;
			}
		}
	}
	AutoCorrectionFunc.prototype.DeleteContent = function(intDelCount) {
		let intCounter = 0;
		
		for (let i = 0; i < this.ProceedContent.length; i++) {
			let oElement = this.ProceedContent[i];
			oElement.InitRuler()

			if (oElement.Content.Type !== 49)
			{
				intCounter++;
			} 
			else
			{
				while (oElement.IsHasContentForRule())
				{
					intCounter++;

					if (intCounter >= intDelCount)
					{
						break;
					} else {
						oElement.intRuleCounter--;
					}
				}
			}

			if (intCounter >= intDelCount)
			{
				this.ProceedContent.length = i + 1;

				if (oElement.Content.Type === 49) {
					oElement.SliceByRuleCounter()
				}
				break;
			}
		}
	}
	AutoCorrectionFunc.prototype.CheckRules = function() {
		if (this.nInputType === 0)
		{

			for (let i = 0; i < this.ProceedContent.length; i++) {
			
				let oElement = this.ProceedContent[i];
				oElement.InitRuler();
	
				if (oElement.Content.Type ===  49)
				{
					while (oElement.IsHasContentForRule() )
					{
						let oContentForRule = oElement.GetContentForCheckRule();
						this.RuleData.push(oContentForRule);
					}
				}
				else
				{
					let oContentForRule = oElement.oRootContext;
					this.RuleData.push(oContentForRule);
				}
			}
	
			let intLenForDel = this.ProceedRules();
			this.DeleteContent(intLenForDel);
		}
	}
	AutoCorrectionFunc.prototype.GetFirstInput = function() {
		this.FirstElement = this.ProceedContent[0].GetFirstElement();
	}
	AutoCorrectionFunc.prototype.IsTextDataRule = function(nPos) {
		let intCopyPos = nPos;

		for (intCopyPos; intCopyPos < this.RuleData.length; intCopyPos++) {

			let oCurrentContent = this.RuleData[intCopyPos];
			let Class = oCurrentContent.class;

			if (!(Class === 2 || Class === 3 || Class === 11 || Class === 10 || Class === 29 || oCurrentContent instanceof ProceedAutoCorection))
			{
				break
			}
		}

		if (nPos < intCopyPos) {
			return intCopyPos
		}
	}
	AutoCorrectionFunc.prototype.IsContentSameRule = function(nPos, strAssumed) {
			let oCurrentContent = this.RuleData[nPos];
			let strClass = oCurrentContent.data;

			return strClass === strAssumed;
	}
	AutoCorrectionFunc.prototype.GetText = function() {
		for (let i = 0; i < this.ProceedContent.length; i++) {
			this.ProceedContent[i].GetText();
		}
	}
	AutoCorrectionFunc.prototype.CreateFlatData = function() {
		let arrTemp = [];

		for (let i = 0; i < this.ProceedContent.length; i++) {
			let odata = this.ProceedContent[i].GetFlat();
			arrTemp.push(odata);
		}

		this.FlatDatas = arrTemp;
	}
	AutoCorrectionFunc.prototype.GetOutputData = function() {
		let arrOutputData = [];

		for (let i = 0; i < this.FlatDatas.length; i++) {
			arrOutputData.push({
				str: this.FlatDatas[i],
				DelCount: this.FlatDatas[i].length,
			})
		}

		return arrOutputData;
	}
	AutoCorrectionFunc.prototype.IsNotHaveContentToConvert = function() {
		return this.ProceedContent.length === 1 && this.ProceedContent[0].oRootContext.str.length === 0;
	}
	function ProceedContent(oContent, Parent) {
		this.Content = oContent;
		this.strContent = oContent.GetTextOfElement(); //TODO Latex or Unicode
		this.oRootContext = new ProceedAutoCorection(undefined, this);

		this.Context = this.oRootContext;
		this.oElement;
		this.oTokenizer = new Tokenizer();
		this.oTokenizer.Init(this.strContent);
		this.Parent = Parent;

		this.intRuleCounter;
	}
	ProceedContent.prototype.ProceedBracketsBlock = function() {
		this.Context = this.Context.SetInnerLevel();
		this.WriteNow();

		let isEnd = false;
		
		while (this.oTokenizer.IsHasMoreTokens() && !isEnd) {
			
			this.GetNext();

			if (this.oElement.class === 23 || this.oElement.class === 25) {
				this.WriteNow(this.ProceedBracketsBlock());
			}
			else if (this.oElement.class === 24 || this.oElement.class === 25) {
				this.WriteNow();
				isEnd = true;
			}
			else {
				this.WriteNow();
			}
		}

		this.Context = this.Context.SetUpperLevel();
		this.oElement = undefined;
	}
	ProceedContent.prototype.GetNext = function() {
		this.oElement = this.oTokenizer.GetNextToken();
	}
	ProceedContent.prototype.WriteNow = function(str) {
		if (str) {
			this.Context.PushToStr(str);
		}
		else if (this.oElement) {
			this.Context.PushToStr(this.oElement);
		}
	}
	ProceedContent.prototype.Start = function() {
		for (let i = this.Content.Content.length; i >= 0 && this.oTokenizer.IsHasMoreTokens(); i++) {
			
			this.GetNext();

			if ((this.oElement.class === 23 || this.oElement.class === 25))
			{
				this.ProceedBracketsBlock();
			}

			//если мы нашли оператор вне скобок, то удалеям все, что было считано до этого момента и прекращаем оброботку
			else if (this.Context === this.oRootContext && this.oElement.class === oNamesOfLiterals.operatorLiteral[0])
			{
				this.Context.SetEmpty();
				this.Parent.isBreak = true;
				continue;
			}
			else
			{
				this.WriteNow();
			}
		}
	}
	ProceedContent.prototype.Clean = function() {
		this.Context = undefined;
		this.oTokenizer = undefined;
		this.oElement = undefined;
	}
	ProceedContent.prototype.GetFlat = function() {
		return this.oRootContext.FlatData();
	}
	ProceedContent.prototype.ProceedOperators = function(nInputType) {
		let isBreak = this.oRootContext.ProceedOperators(nInputType);

		if (true === isBreak) {
			this.Parent.isBreak = true;
		}
	}
	ProceedContent.prototype.InitRuler = function() {
		this.intRuleCounter = this.oRootContext.str.length - 1;
	}
	ProceedContent.prototype.GetContentForCheckRule = function() {
		let oContent = this.oRootContext.str[this.intRuleCounter];
		this.intRuleCounter--;

		return oContent;
	}
	ProceedContent.prototype.IsHasContentForRule = function() {
		return this.intRuleCounter >= 0;
	}
	ProceedContent.prototype.IsStart = function() {
		return this.intRuleCounter === this.oRootContext.str.length - 1;
	}
	ProceedContent.prototype.GetFirstElement = function() {
		let intArrLen = this.oRootContext.str.length - 1;
		let oContent = this.oRootContext.str[intArrLen];
		
		this.oRootContext.str.length = intArrLen;

		return oContent;
	}
	ProceedContent.prototype.SliceByRuleCounter = function() {
		if (this.intRuleCounter !== 0) {
			let intDelete = this.intRuleCounter;
			if (intDelete >= 0) {
				this.oRootContext.str.splice(0, intDelete);
			}
		}
	}
	ProceedContent.prototype.GetText = function() {
		this.oRootContext.GetText()
	}
	function ProceedAutoCorection(Parent, oProceedContent) {
		this.str = [];
		this.Parent = Parent !== undefined ? Parent : null;
		this.ProceedContent = oProceedContent;
		this.oOutputData;
		this.intAllContentLen = 0;
		this.isOneWord = false;
	}
	ProceedAutoCorection.prototype.GetParent = function() {
		if (this.Parent !== null) {
			return this.Parent
		}
		return false;
	}
	ProceedAutoCorection.prototype.PushToStr = function(str) {
		if (this.str !== undefined) {
			this.str.push(str);
		}
	}
	ProceedAutoCorection.prototype.SetInnerLevel = function() {
		let oInnerObj = new ProceedAutoCorection(this, this.ProceedContent);
		this.str.push(oInnerObj);
		return oInnerObj;
	}
	ProceedAutoCorection.prototype.SetUpperLevel = function() {
		return this.GetParent();
	}
	ProceedAutoCorection.prototype.GetLength = function() {
		let intLen = 0;

		for (let i = 0; i < this.str.length; i++) {

			if (this.str[i] instanceof ProceedAutoCorection)
			{
				intLen += this.str[i].GetLength();
			}
			else
			{
				intLen += this.str[i].length;
			}
		}
		return intLen;
	}
	ProceedAutoCorection.prototype.GetText = function() {
		this.intAllContentLen = this.GetLength();
		this.oOutputData = this.GetTextOfLevel();
	}
	ProceedAutoCorection.prototype.GetTextOfLevel = function() {
		let strOutput = [];
		let intLen = 0;

		for (let i = 0; i < this.str.length; i++) {

			let oElement = this.str[i];

			if (oElement instanceof ProceedAutoCorection)
			{
				let Content = oElement.GetTextOfLevel();
				strOutput = strOutput.concat(Content.str);
				intLen += Content.len;
			}
			else
			{
				strOutput.push(oElement.data)
				intLen += oElement.data.length;
			}
		}
		return {str: strOutput, len: intLen};
	}
	ProceedAutoCorection.prototype.GetCorrectionWord = function() {
		let indexOfSlashes = this.arrOutputStr.lastIndexOf("\\");
		let arrSearchedArray = [];

		if (-1 !== indexOfSlashes) {

			for (let i = this.arrOutputStr.length - 1; i >= indexOfSlashes; i--) {
				arrSearchedArray.pop(this.arrOutputStr[i]);
			}

			let isOnlyLettersAndNumbers = true;

			for (let i = 0; i < this.arrOutputStr.length - 1; i++) {
				let intCode = arrOutputStr[i].charCodeAt(0);

				if (!this.IsLetterOrNumber(intCode)){
					isOnlyLettersAndNumbers = false;
				}
			}
			if (isOnlyLettersAndNumbers) {

				let strAutoCorrection = arrSearchedArray.join("");
				let NewAutoCorrection = this.FindInAutoCorrectionRules(str[this.str.length - 1]);

				if (NewAutoCorrection) {
					strAutoCorrection = NewAutoCorrection;
				}

				return {
					str: strAutoCorrection,
					len: arrSearchedArray.length,
				}
			}
		}
	}
	ProceedAutoCorection.prototype.FindInAutoCorrectionRules = function(str) {
		for (let i = wordAutoCorrection.length - 1; i >= 0; i--) {

			let autoCorrectRule = wordAutoCorrection[i];

			if (typeof autoCorrectRule[0] !== "function" && autoCorrectRule[0] === str && autoCorrectRule[1] !== undefined) {
					return autoCorrectRule[1];
			}

		}
	}
	ProceedAutoCorection.prototype.IsLetterOrNumber = function(intCode) {
		if (
			!(intCode >= 97 && intCode <= 122 ||//a-z
			intCode >= 65 && intCode <= 90 ||	//A-Z
			intCode >= 48 && intCode <= 57		//0-9
			)
		) {
			return false;
		}
		return true;
	}
	ProceedAutoCorection.prototype.ProcessingAutoCorrectWord = function() {
		for (let i = this.str.length - 1; i >= 0; i--) {
			
			if (this.str[i].convert && this.str[i].data !== this.str[i].convert) {
				this.str.splice(0, i);
				this.isOneWord = true;
				break;
			}
		}
	}
	ProceedAutoCorection.prototype.TrimUnnecessaryBrackets = function() {
		this.ProceedContent.Parent.intCounter += this.GetBracketCountAndCut();
	}
	ProceedAutoCorection.prototype.GetBracketCountAndCut = function() {
		let intLocalCount = 0
		let intCount = this.ProceedContent.Parent.intCounter;

		for (let i = this.str.length - 1; i >= 0; i--) {
			let oContent = this.str[i];

			if (oContent instanceof ProceedAutoCorection) {
				intLocalCount += oContent.GetBracketCountAndCut();
			} 
			else {
				if (oContent.class === oNamesOfLiterals.opOpenBracket[0] || (oContent.class === oNamesOfLiterals.opOpenCloseBracket[0] && intLocalCount !== 1)) {
					intLocalCount++;
					if (intCount + intLocalCount > 0 && i !== 0) {
						this.str.splice(0, i)
						break;
					}
					else if (this.ProceedContent.Parent.ProceedContent.length === 1 && intCount + intLocalCount > 0) {
						this.str.splice(0, i + 1)
						break;
					}
				} 
				else if (oContent.class === oNamesOfLiterals.opCloseBracket[0] || oContent.class === oNamesOfLiterals.opOpenCloseBracket[0]) {
					intLocalCount--;
				} 
			}
		}

		return intLocalCount;
	}
	ProceedAutoCorection.prototype.SetEmpty = function() {
		this.str = [];
	}
	ProceedAutoCorection.prototype.ProceedOperators = function(nInputType) {
		
		for (let i = this.str.length - 1; i >= 0; i--) {
			if (nInputType === 1) { //LaTeX
				if (this.str[i].data && this.str[i].data[0] === "\\") {
					this.str.splice(0, i - 1);
					return true;
				}
			}
			else {
				if (this.str[i].class === oNamesOfLiterals.operatorLiteral[0]) {
					this.str.splice(0, i + 1);
					return true;
				}
			}
		}
	}
	ProceedAutoCorection.prototype.FlatData = function() {
		for (let i = 0; i < this.str.length; i++) {
			let oContent = this.str[i];

			if (oContent instanceof ProceedAutoCorection)
			{
				let arrData = oContent.FlatData();
				
				if (arrData) {
					this.str.splice(
						i,
						1,
					);
					for (let j = 0; j < arrData.length; j++) {
						this.str.splice(i+j, 0, arrData[j]);
					}
				}
			}
			else if (oContent.data.length > 1)
			{
				this.str.splice(i,1);
	
				for (let j = 0; j < oContent.data.length; j++) {

					let oTemp = {
						"class": 11,
						"data": oContent.data[j],
						"index": 2
					}
					this.str.splice(i + j, 0, oTemp);

				}

				i += oContent.data.length - 1;
			}

			if (this.Parent !== null) {
				return this.str;
			}
		}

		let arr = [];

		for (let i = 0; i < this.str.length; i++) {
			arr.push(this.str[i].data);
		}

		return arr;
	}

	function AutoCorrect(oCMathContent, nInputType) {
		let oData = new AutoCorrectionFunc(oCMathContent, nInputType);

		oData.FillProceedContent();
		oData.ProceedContentFunc();
		oData.ProceedBracketsAndCut();

		if (oData.intCounter === 0)
		{
			oData.GetFirstInput();
			let isNotContinue = oData.IsNotHaveContentToConvert();

			if (!isNotContinue) {
				oData.CheckRules();
				oData.GetText();
				oData.CreateFlatData();
				return oData.GetOutputData();
			}
		}
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

	const AutoCorrection = {
		"!!": "‼",
		"...": "…",
		"::": "∷",
		":=": "≔",
		
		"\\above": "┴",
		"\\acute": "́",
		"\\aleph": "ℵ",
		"\\alpha": "α",
		"\\Alpha": "Α",
		"\\amalg": "∐",
		"\\angle": "∠",
		"\\aoint": "∳",
		"\\approx": "≈",
		"\\asmash": "⬆",
		"\\ast": "∗",
		"\\asymp": "≍",
		"\\atop": "¦",

		"\\bar": "̅",
		"\\Bar": "̿",
		"\\because": "∵",
		"\\begin": "〖",
		"\\below": "┬",
		"\\bet": "ℶ",
		"\\beta": "β",
		"\\Beta": "Β",
		"\\beth": "ℶ",
		"\\bigcap": "⋂",
		"\\bigcup": "⋃",
		"\\bigodot": "⨀",
		"\\bigoplus": "⨁",
		"\\bigotimes": "⨂",
		"\\bigsqcup": "⨆",
		"\\biguplus": "⨄",
		"\\bigvee": "⋁",
		"\\bigwedge": "⋀",
		"\\binomial": "(a+b)^n=∑_(k=0)^n ▒(n¦k)a^k b^(n-k)",
		"\\bot": "⊥",
		"\\bowtie": "⋈",
		"\\box": "□",
		"\\boxdot": "⊡",
		"\\boxminus": "⊟",
		"\\boxplus": "⊞",
		"\\bra": "⟨",
		"\\break": "⤶",
		"\\breve": "̆",
		"\\bullet": "∙",

		"\\cap": "∩",
		"\\cases": "Ⓒ",
		"\\cbrt": "∛",
		"\\cdot": "⋅",
		"\\cdots": "⋯",
		"\\check": "̌",
		"\\chi": "χ",
		"\\Chi": "Χ",
		"\\circ": "∘",
		"\\close": "┤",
		"\\clubsuit": "♣",
		"\\coint": "∲",
		"\\cong": "≅",
		"\\coprod": "∐",
		"\\cup": "∪",

		"\\dalet": "ℸ",
		"\\daleth": "ℸ",
		"\\dashv": "⊣",
		"\\dd": "ⅆ",
		"\\Dd": "ⅅ",
		"\\ddddot": "⃜",
		"\\dddot": "⃛",
		"\\ddot": "̈",
		"\\ddots": "⋱",
		"\\defeq": "≝",
		"\\degc": "℃",
		"\\degf": "℉",
		"\\degree": "°",
		"\\delta": "δ",
		"\\Delta": "Δ",
		"\\Deltaeq": "≜",
		"\\diamond": "⋄",
		"\\diamondsuit": "♢",
		"\\div": "÷",
		"\\dot": "̇",
		"\\doteq": "≐",
		"\\dots": "…",
		"\\doublea": "𝕒",
		"\\doubleA": "𝔸",
		"\\doubleb": "𝕓",
		"\\doubleB": "𝔹",
		"\\doublec": "𝕔",
		"\\doubleC": "ℂ",
		"\\doubled": "𝕕",
		"\\doubleD": "𝔻",
		"\\doublee": "𝕖",
		"\\doubleE": "𝔼",
		"\\doublef": "𝕗",
		"\\doubleF": "𝔽",
		"\\doubleg": "𝕘",
		"\\doubleG": "𝔾",
		"\\doubleh": "𝕙",
		"\\doubleH": "ℍ",
		"\\doublei": "𝕚",
		"\\doubleI": "𝕀",
		"\\doublej": "𝕛",
		"\\doubleJ": "𝕁",
		"\\doublek": "𝕜",
		"\\doubleK": "𝕂",
		"\\doublel": "𝕝",
		"\\doubleL": "𝕃",
		"\\doublem": "𝕞",
		"\\doubleM": "𝕄",
		"\\doublen": "𝕟",
		"\\doubleN": "ℕ",
		"\\doubleo": "𝕠",
		"\\doubleO": "𝕆",
		"\\doublep": "𝕡",
		"\\doubleP": "ℙ",
		"\\doubleq": "𝕢",
		"\\doubleQ": "ℚ",
		"\\doubler": "𝕣",
		"\\doubleR": "ℝ",
		"\\doubles": "𝕤",
		"\\doubleS": "𝕊",
		"\\doublet": "𝕥",
		"\\doubleT": "𝕋",
		"\\doubleu": "𝕦",
		"\\doubleU": "𝕌",
		"\\doublev": "𝕧",
		"\\doubleV": "𝕍",
		"\\doublew": "𝕨",
		"\\doubleW": "𝕎",
		"\\doublex": "𝕩",
		"\\doubleX": "𝕏",
		"\\doubley": "𝕪",
		"\\doubleY": "𝕐",
		"\\doublez": "𝕫",
		"\\doubleZ": "ℤ",
		"\\downarrow": "↓",
		"\\Downarrow": "⇓",
		"\\dsmash": "⬇",

		"\\ee": "ⅇ",
		"\\ell": "ℓ",
		"\\emptyset": "∅",
		"\\emsp": " ",
		"\\end": "〗",
		"\\ensp": " ",
		"\\epsilon": "ϵ",
		"\\Epsilon": "Ε",
		"\\eqarray": "█",
		"\\equiv": "≡",
		"\\eta": "η",
		"\\Eta": "Η",
		"\\exists": "∃",

		"\\forall": "∀",
		"\\fraktura": "𝔞",
		"\\frakturA": "𝔄",
		"\\frakturb": "𝔟",
		"\\frakturB": "𝔅",
		"\\frakturc": "𝔠",
		"\\frakturC": "ℭ",
		"\\frakturd": "𝔡",
		"\\frakturD": "𝔇",
		"\\frakture": "𝔢",
		"\\frakturE": "𝔈",
		"\\frakturf": "𝔣",
		"\\frakturF": "𝔉",
		"\\frakturg": "𝔤",
		"\\frakturG": "𝔊",
		"\\frakturh": "𝔥",
		"\\frakturH": "ℌ",
		"\\frakturi": "𝔦",
		"\\frakturI": "ℑ",
		"\\frakturj": "𝔧",
		"\\frakturJ": "𝔍",
		"\\frakturk": "𝔨",
		"\\frakturK": "𝔎",
		"\\frakturl": "𝔩",
		"\\frakturL": "𝔏",
		"\\frakturm": "𝔪",
		"\\frakturM": "𝔐",
		"\\frakturn": "𝔫",
		"\\frakturN": "𝔑",
		"\\frakturo": "𝔬",
		"\\frakturO": "𝔒",
		"\\frakturp": "𝔭",
		"\\frakturP": "𝔓",
		"\\frakturq": "𝔮",
		"\\frakturQ": "𝔔",
		"\\frakturr": "𝔯",
		"\\frakturR": "ℜ",
		"\\frakturs": "𝔰",
		"\\frakturS": "𝔖",
		"\\frakturt": "𝔱",
		"\\frakturT": "𝔗",
		"\\frakturu": "𝔲",
		"\\frakturU": "𝔘",
		"\\frakturv": "𝔳",
		"\\frakturV": "𝔙",
		"\\frakturw": "𝔴",
		"\\frakturW": "𝔚",
		"\\frakturx": "𝔵",
		"\\frakturX": "𝔛",
		"\\fraktury": "𝔶",
		"\\frakturY": "𝔜",
		"\\frakturz": "𝔷",
		"\\frakturZ": "ℨ",
		"\\frown": "⌑",
		"\\funcapply": "⁡⁡⁡",

		"\\G": "Γ",
		"\\gamma": "γ",
		"\\Gamma": "Γ",
		"\\ge": "≥",
		"\\geq": "≥",
		"\\gets": "←",
		"\\gg": "≫",
		"\\gimel": "ℷ",
		"\\grave": "̀",

		"\\hairsp": " ",
		"\\hat": "̂",
		"\\hbar": "ℏ",
		"\\heartsuit": "♡",
		"\\hookleftarrow": "↩",
		"\\hookrightarrow": "↪",
		"\\hphantom": "⬄",
		"\\hsmash": "⬌",
		"\\hvec": "⃑",

		"\\identitymatrix": "(■(1&0&0@0&1&0@0&0&1))",
		"\\ii": "ⅈ",
		"\\iiiint": "⨌",
		"\\iiint": "∭",
		"\\iint": "∬",
		"\\Im": "ℑ",
		"\\imath": "ı",
		"\\in": "∈",
		"\\inc": "∆",
		"\\infty": "∞",
		"\\int": "∫",
		"\\integral": "1/2π ∫_0^2π ▒ⅆθ/(a+b sin θ)=1/√(a^2-b^2)",
		"\\iota": "ι",
		"\\Iota": "Ι",
		"\\itimes": "⁢",
		
		"\\j": "Jay",
		"\\jj": "ⅉ",
		"\\jmath": "ȷ",
		"\\kappa": "κ",
		"\\Kappa": "Κ",
		"\\ket": "⟩",
		"\\lambda": "λ",
		"\\Lambda": "Λ",
		"\\langle": "〈",
		"\\lbbrack": "⟦",
		"\\lbrace": "\{",
		"\\lbrack": "[",
		"\\lceil": "⌈",
		"\\ldiv": "∕",
		"\\ldivide": "∕",
		"\\ldots": "…",
		"\\le": "≤",
		"\\left": "├",
		"\\leftarrow": "←",
		"\\Leftarrow": "⇐",
		"\\leftharpoondown": "↽",
		"\\leftharpoonup": "↼",
		"\\leftrightarrow": "↔",
		"\\Leftrightarrow": "⇔",
		"\\leq": "≤",
		"\\lfloor": "⌊",
		"\\lhvec": "⃐",
		"\\limit": "lim_(n→∞)⁡〖(1+1/n)^n〗=e",
		"\\ll": "≪",
		"\\lmoust": "⎰",
		"\\Longleftarrow": "⟸",
		"\\Longleftrightarrow": "⟺",
		"\\Longrightarrow": "⟹",
		"\\lrhar": "⇋",
		"\\lvec": "⃖",

		"\\mapsto": "↦",
		"\\matrix": "■",
		"\\medsp": " ",
		"\\mid": "∣",
		"\\middle": "ⓜ",
		"\\models": "⊨",
		"\\mp": "∓",
		"\\mu": "μ",
		"\\Mu": "Μ",

		"\\nabla": "∇",
		"\\naryand": "▒",
		"\\nbsp": " ",
		"\\ne": "≠",
		"\\nearrow": "↗",
		"\\neg": "¬",
		"\\neq": "≠",
		"\\ni": "∋",
		"\\norm": "‖",
		"\\notcontain": "∌",
		"\\notelement": "∉",
		"\\notin": "∉",
		"\\nu": "ν",
		"\\Nu": "Ν",
		"\\nwarrow": "↖",

		"\\o": "ο",
		"\\O": "Ο",
		"\\odot": "⊙",
		"\\of": "▒",
		"\\oiiint": "∰",
		"\\oiint": "∯",
		"\\oint": "∮",
		"\\omega": "ω",
		"\\Omega": "Ω",
		"\\ominus": "⊖",
		"\\open": "├",
		"\\oplus": "⊕",
		"\\otimes": "⊗",
		"\\overbar": "¯",
		"\\overbrace": "⏞",
		"\\overbracket": "⎴",
		"\\overline": "¯",
		"\\overparen": "⏜",
		"\\overshell": "⏠",

		"\\parallel": "∥",
		"\\partial": "∂",
		"\\perp": "⊥",
		"\\phantom": "⟡",
		"\\phi": "ϕ",
		"\\Phi": "Φ",
		"\\pi": "π",
		"\\Pi": "Π",
		"\\pm": "±",
		"\\pmatrix": "⒨",
		"\\pppprime": "⁗",
		"\\ppprime": "‴",
		"\\pprime": "″",
		"\\prec": "≺",
		"\\preceq": "≼",
		"\\prime": "′",
		"\\prod": "∏",
		"\\propto": "∝",
		"\\psi": "ψ",
		"\\Psi": "Ψ",

		"\\qdrt": "∜",
		"\\quadratic": "x=(-b±√(b^2-4ac))/2a",

		"\\rangle": "〉",
		"\\Rangle": "⟫",
		"\\ratio": "∶",
		"\\rbrace": "}",
		"\\rbrack": "]",
		"\\Rbrack": "⟧",
		"\\rceil": "⌉",
		"\\rddots": "⋰",
		"\\Re": "ℜ",
		"\\rect": "▭",
		"\\rfloor": "⌋",
		"\\rho": "ρ",
		"\\Rho": "Ρ",
		"\\rhvec": "⃑",
		"\\right": "┤",
		"\\rightarrow": "→",
		"\\Rightarrow": "⇒",
		"\\rightharpoondown": "⇁",
		"\\rightharpoonup": "⇀",
		"\\rmoust": "⎱",
		"\\root": "⒭",

		"\\scripta": "𝒶",
		"\\scriptA": "𝒜",
		"\\scriptb": "𝒷",
		"\\scriptB": "ℬ",
		"\\scriptc": "𝒸",
		"\\scriptC": "𝒞",
		"\\scriptd": "𝒹",
		"\\scriptD": "𝒟",
		"\\scripte": "ℯ",
		"\\scriptE": "ℰ",
		"\\scriptf": "𝒻",
		"\\scriptF": "ℱ",
		"\\scriptg": "ℊ",
		"\\scriptG": "𝒢",
		"\\scripth": "𝒽",
		"\\scriptH": "ℋ",
		"\\scripti": "𝒾",
		"\\scriptI": "ℐ",
		"\\scriptj": "𝒥",
		"\\scriptk": "𝓀",
		"\\scriptK": "𝒦",
		"\\scriptl": "ℓ",
		"\\scriptL": "ℒ",
		"\\scriptm": "𝓂",
		"\\scriptM": "ℳ",
		"\\scriptn": "𝓃",
		"\\scriptN": "𝒩",
		"\\scripto": "ℴ",
		"\\scriptO": "𝒪",
		"\\scriptp": "𝓅",
		"\\scriptP": "𝒫",
		"\\scriptq": "𝓆",
		"\\scriptQ": "𝒬",
		"\\scriptr": "𝓇",
		"\\scriptR": "ℛ",
		"\\scripts": "𝓈",
		"\\scriptS": "𝒮",
		"\\scriptt": "𝓉",
		"\\scriptT": "𝒯",
		"\\scriptu": "𝓊",
		"\\scriptU": "𝒰",
		"\\scriptv": "𝓋",
		"\\scriptV": "𝒱",
		"\\scriptw": "𝓌",
		"\\scriptW": "𝒲",
		"\\scriptx": "𝓍",
		"\\scriptX": "𝒳",
		"\\scripty": "𝓎",
		"\\scriptY": "𝒴",
		"\\scriptz": "𝓏",
		"\\scriptZ": "𝒵",
		"\\sdiv": "⁄",
		"\\sdivide": "⁄",
		"\\searrow": "↘",
		"\\setminus": "∖",
		"\\sigma": "σ",
		"\\Sigma": "Σ",
		"\\sim": "∼",
		"\\simeq": "≃",
		"\\smash": "⬍",
		"\\smile": "⌣",
		"\\spadesuit": "♠",
		"\\sqcap": "⊓",
		"\\sqcup": "⊔",
		"\\sqrt": "√",
		"\\sqsubseteq": "⊑",
		"\\sqsuperseteq": "⊒",
		"\\star": "⋆",
		"\\subset": "⊂",
		"\\subseteq": "⊆",
		"\\succ": "≻",
		"\\succeq": "≽",
		"\\sum": "∑",
		"\\superset": "⊃",
		"\\superseteq": "⊇",
		"\\swarrow": "↙",

		"\\tau": "τ",
		"\\Tau": "Τ",
		"\\therefore": "∴",
		"\\theta": "θ",
		"\\Theta": "Θ",
		"\\thicksp": " ",
		"\\thinsp": " ",
		"\\tilde": "̃",
		"\\times": "×",
		"\\to": "→",
		"\\top": "⊤",
		"\\tvec": "⃡",

		"\\ubar": "̲",
		"\\Ubar": "̳",
		"\\underbar": "▁",
		"\\underbrace": "⏟",
		"\\underbracket": "⎵",
		"\\underline": "▁",
		"\\underparen": "⏝",
		"\\uparrow": "↑",
		"\\Uparrow": "⇑",
		"\\updownarrow": "↕",
		"\\Updownarrow": "⇕",
		"\\uplus": "⊎",
		"\\upsilon": "υ",
		"\\Upsilon": "Υ",
		
		"\\varepsilon": "ε",
		"\\varphi": "φ",
		"\\varpi": "ϖ",
		"\\varrho": "ϱ",
		"\\varsigma": "ς",
		"\\vartheta": "ϑ",
		"\\vbar": "│",
		"\\vdots": "⋮",
		"\\vec": "⃗",
		"\\vee": "∨",
		"\\vert": "|",
		"\\Vert": "‖",
		"\\Vmatrix": "⒩",
		"\\vphantom": "⇳",
		"\\vthicksp": " ",

		"\\wedge": "∧",
		"\\wp": "℘",
		"\\wr": "≀",
		
		"\\xi": "ξ",
		"\\Xi": "Ξ",

		"\\zeta": "ζ",
		"\\Zeta": "Ζ",
		"\\zwnj": "‌",
		"\\zwsp": "​",

		"~=": "≅",
		"+-": "±",
		"-+": "∓",
		"<<": "≪",
		"<=": "≤",
		"->": "→",
		">=": "≥",
		'>>': "≫",
	}

	//REFACTOR
	function ConvertCorrectionWordToSymbols (oCMathContent, intInputCode) {
		let isConvert = false;
		
		//при автокоррекции мы обрабатываем только только слово стоящее перед курсором
		if (intInputCode)
		{

			let oContent = oCMathContent.Content[oCMathContent.CurPos];
			let str = "";
			let intStart = 0;

			for (let nCount = oContent.State.ContentPos - 1; nCount >= 0; nCount--) {
				let oElement = oContent.Content[nCount];
				let intCode = oElement.value;

				intStart = nCount;

				// первый обработанный элемент, то что было введено после слова
				if (nCount === oContent.State.ContentPos - 1)
				{ 
					let isContinue = !(intCode >= 97 && intCode <= 122 || intCode >= 65 && intCode <= 90); // не a-zA-z && 0-9

					if (!isContinue)
					{
						return
					}
				}
				else
				{
					str = oElement.GetTextOfElement() + str;
				}

				if (intCode === 92) {
					isConvert = true;
					break;
				}
			}

			if (oContent.State.ContentPos - 1 > intStart) {
	
				let strCorrection = AutoCorrection[str];
				if (strCorrection) {

					oContent.RemoveFromContent(intStart, oContent.State.ContentPos - 1 - intStart + 1, true);
					oContent.AddText(strCorrection, intStart);
					isConvert = true
					
					oCMathContent.Correct_Content(true)
					oContent.State.ContentPos =  intStart + 1;
				}
			}
		}
		//при конвертации блока формулы проверяем все
		else
		{
			if (oCMathContent.Type === 49) {

				for (let nCount = 0; nCount < oCMathContent.Content.length; nCount++) {
	
					if (oCMathContent.Content[nCount].value === 92) {
	
						let str = oCMathContent.Content[nCount].GetTextOfElement();
						let intStart = nCount;
						let intEnd;
	
						for (let i = nCount + 1; i < oCMathContent.Content.length; i++) {
	
							let oContent = oCMathContent.Content[i];
							let intCode = oContent.value;
							
							if (intCode >= 97 && intCode <= 122 || intCode >= 65 && intCode <= 90) {
								intEnd = i;
								str += oContent.GetTextOfElement();
							}
							else
							{
								break;
							}
	
							nCount++;
						}
	
						if (intEnd > intStart) {
	
							let strCorrection = AutoCorrection[str];
							if (strCorrection) {
	
								nCount -= (intEnd - intStart);
								oCMathContent.RemoveFromContent(intStart, intEnd - intStart + 1, true);
								oCMathContent.AddText(strCorrection, intStart);
								isConvert = true;
							}
						}
					}
				}
			}
			else
			{
				for (let nCount = 0; nCount < oCMathContent.Content.length; nCount++) {
					isConvert = ConvertCorrectionWordToSymbols(oCMathContent.Content[nCount], nInputType) || isConvert;
				}
			}
		}
		
		return isConvert;
	}
	
	//--------------------------------------------------------export----------------------------------------------------
	window["AscMath"] = window["AscMath"] || {};
	window["AscMath"].oNamesOfLiterals = oNamesOfLiterals;
	window["AscMath"].GetUnicodeAutoCorrectionToken = GetUnicodeAutoCorrectionToken;
	window["AscMath"].ConvertTokens = ConvertTokens;
	window["AscMath"].Tokenizer = Tokenizer;
	window["AscMath"].UnicodeSpecialScript = UnicodeSpecialScript;
	window["AscMath"].LimitFunctions = limitFunctions;
	window["AscMath"].functionNames = functionNames;
	window["AscMath"].GetTypeFont = GetTypeFont;
	window["AscMath"].GetMathFontChar = GetMathFontChar;
	window["AscMath"].AutoCorrect = AutoCorrect;
	window["AscMath"].AutoCorrection = AutoCorrection;
	window["AscMath"].ConvertCorrectionWordToSymbols = ConvertCorrectionWordToSymbols;

})(window);
