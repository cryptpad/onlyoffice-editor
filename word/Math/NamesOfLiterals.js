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


		["\\}", undefined, oNamesOfLiterals.opCloseBracket[0]],
		["\\|", undefined, oNamesOfLiterals.opOpenCloseBracket[0]],


		["\\\\", undefined, true],
		["  ", undefined, oNamesOfLiterals.spaceLiteral[0]], // 2/18em space  very thin math space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // 3/18em space thin math space
		["  ", undefined, oNamesOfLiterals.spaceLiteral[0]],  // 7/18em space  very very thick math space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // Digit-width space
		[" ", undefined, oNamesOfLiterals.spaceLiteral[0]], // Space-with space (non-breaking space)
		["\t", undefined, oNamesOfLiterals.spaceLiteral[0]], //Tab

		["\\above", "┴", true],

		["\\acute", "́", oNamesOfLiterals.accentLiteral[0]],
		["\\aleph", "ℵ"],
		["\\alpha", "α"],
		["\\Alpha", "Α"],
		["\\amalg", "∐", oNamesOfLiterals.opNaryLiteral[0]],
		["\\angle", "∠"],
		["\\aoint", "∳", oNamesOfLiterals.opNaryLiteral[0]],
		["\\approx", "≈", oNamesOfLiterals.operatorLiteral[0]],
		["\\asmash", "⬆"],
		["\\ast", "∗"],
		["\\asymp", "≍", oNamesOfLiterals.operatorLiteral[0]],

		["\\atop", "¦", oNamesOfLiterals.overLiteral[0]], //LateX true

		["\\bar", "̅", oNamesOfLiterals.accentLiteral[0]],
		["\\Bar", "̿", oNamesOfLiterals.accentLiteral[0]], //todo
		["\\because", "∵"],
		["\\begin", "〖"], //Unicode  LaTeX: ["\\begin{"],

		["\\below", "┬", true],

		["\\bet", "ℶ"],
		["\\beta", "β"],
		["\\Beta", "Β"],
		["\\beth", "ℶ"],

		["\\bigcap", "⋂", oNamesOfLiterals.functionLiteral[0]], // todo in unicode NaryOp REFACTOR ["⋂", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigcup", "⋃", oNamesOfLiterals.functionLiteral[0]], // 	["⋃", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigodot", "⨀", oNamesOfLiterals.functionLiteral[0]], //["⨀", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigoplus", "⨁", oNamesOfLiterals.functionLiteral[0]], //["⨁", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigotimes", "⨂", oNamesOfLiterals.functionLiteral[0]], //["⨂", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigsqcup", "⨆", oNamesOfLiterals.functionLiteral[0]], //["⨆", oNamesOfLiterals.opNaryLiteral[0]],
		["\\biguplus", "⨄", oNamesOfLiterals.functionLiteral[0]], //		["⨄", oNamesOfLiterals.opNaryLiteral[0]],
		["\\bigvee", "⋁", oNamesOfLiterals.functionLiteral[0]],
		["\\bigwedge", "⋀", oNamesOfLiterals.functionLiteral[0]],

		["\\bot", "⊥", oNamesOfLiterals.operatorLiteral[0]],

		["\\bowtie", "⋈"],
		["\\box", "□", oNamesOfLiterals.boxLiteral[0]],
		["\\Box", "□", oNamesOfLiterals.boxLiteral[0]],
		["\\boxdot", "⊡"],
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
		["\\check", "̌", oNamesOfLiterals.accentLiteral[0]],
		["\\Chi", "Χ"],
		["\\chi", "χ"],
		["\\circ", "∘"],
		["\\close", "┤", true],
		["\\clubsuit", "♣"],
		["\\coint", "∲", oNamesOfLiterals.opNaryLiteral[0]],
		["\\cong", "≅", oNamesOfLiterals.operatorLiteral[0]],
		["\\contain", "∋", oNamesOfLiterals.operatorLiteral[0]],
		["\\coprod", "∐", oNamesOfLiterals.functionLiteral[0]], //check type
		["\\cup", "∪"],
		["\\dalet", "ℸ"],
		["\\daleth", "ℸ"],
		["\\dashv", "⊣"],
		["\\dd", "ⅆ"],
		["\\Dd", "ⅅ"],
		["\\ddddot", "⃜", oNamesOfLiterals.accentLiteral[0]],
		["\\dddot", "⃛", oNamesOfLiterals.accentLiteral[0]],
		["\\ddot", "̈", oNamesOfLiterals.accentLiteral[0]],
		["\\ddots", "⋱"],
		["\\defeq", "≝"],
		["\\degc", "℃"],
		["\\degf", "℉"],
		["\\degree", "°"],
		["\\delta", "δ"],
		["\\Delta", "Δ"],
		["\\Deltaeq", "≜"],
		["\\diamond", "⋄"],
		["\\diamondsuit", "♢"],
		["\\div", "÷", oNamesOfLiterals.operatorLiteral[0]],
		["\\dot", "̇", oNamesOfLiterals.accentLiteral[0]],
		["\\doteq", "≐"],
		["\\dots", "…"],
		//double chars
		["\\downarrow", "↓"],
		["\\Downarrow", "⇓"],
		["\\dsmash", "⬇"],
		["\\ee", "ⅇ"],//0x2147
		["\\ell", "ℓ"],//0x2113
		["\\emptyset", "∅"],
		["\\emsp", " ", oNamesOfLiterals.spaceLiteral[0]], // [" ", oNamesOfLiterals.spaceLiteral[0]], // 1em space
		["\\end", "〗", oNamesOfLiterals.opCloseBracket[0]], //LaTeX ["\\end{"],
		["\\ensp", " ", oNamesOfLiterals.spaceLiteral[0],], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 9/18em space
		["\\epsolon", "ϵ"],
		["\\Epsolon", "Ε"],
		["\\eqarray", "█", true],
		["\\equiv", "≡", oNamesOfLiterals.operatorLiteral[0]],
		["\\eqno", "#"],
		["\\eta", "η"],
		["\\Eta", "Η"],
		["\\exists", "∃", oNamesOfLiterals.operatorLiteral[0]],
		["\\forall", "∀", oNamesOfLiterals.operatorLiteral[0]],
		//fractur
		["\\frown", "⌑"],
		["\\funcapply", "⁡", oNamesOfLiterals.operatorLiteral[0]],
		["\\G", "Γ"],
		["\\gamma", "γ"],
		["\\Gamma", "Γ"],
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
		["\\Im", "ℑ"],
		["\\imath", "𝚤"],
		["\\in", "∈", oNamesOfLiterals.operatorLiteral[0]],
		["\\inc", "∆"],
		["\\infty", "∞"],
		["\\int", "∫", oNamesOfLiterals.opNaryLiteral[0]],
		["\\iota", "ι"],
		["\\Iota", "Ι"],
		["\\itimes", "⁢", oNamesOfLiterals.operatorLiteral[0]],
		["\\j", "Jay"],
		["\\jj", "ⅉ"],
		["\\jmath", "𝚥"],
		["\\kappa", "κ"],
		["\\Kappa", "Κ"],
		["\\ket", "⟩", oNamesOfLiterals.opCloseBracket[0]],
		["\\rangle", "⟩", oNamesOfLiterals.opCloseBracket[0]],
		["\\lambda", "λ"],
		["\\Lambda", "Λ"],
		["\\langle", "⟨", oNamesOfLiterals.opOpenBracket[0]],
		["\\lbbrack", "⟦", oNamesOfLiterals.opOpenBracket[0]],
		["\\llbracket", "⟦", oNamesOfLiterals.opOpenBracket[0]],
		["\\lbrace", "\\{", oNamesOfLiterals.opOpenBracket[0]], // todo check in word { or \\{
		["\\lbrack", "[", oNamesOfLiterals.opOpenBracket[0]],
		["\\lceil", "⌈", oNamesOfLiterals.opOpenBracket[0]],
		["\\ldiv", "∕", oNamesOfLiterals.overLiteral[0]],
		["\\ldivide", "∕", oNamesOfLiterals.overLiteral[0]],
		["\\ldots", "…"],
		["\\le", "≤", oNamesOfLiterals.operatorLiteral[0]],
		["\\left", "├", true], //LaTeX type === \left
		["\\leftarrow", "←"],
		["\\Leftarrow", "⇐"],
		["\\leftharpoondown", "↽"],
		["\\leftharpoonup", "↼"],
		["\\leftrightarrow", "↔"],
		["\\Leftrightarrow", "⇔", oNamesOfLiterals.operatorLiteral[0]],
		["\\leq", "≤"],
		["\\lfloor", "⌊", oNamesOfLiterals.opOpenBracket[0]],
		["\\lhvec", "⃐", oNamesOfLiterals.opOpenBracket[0]], //check word
		["\\ll", "≪"],
		["\\lmoust", "⎰", oNamesOfLiterals.opOpenBracket[0]],
		["\\Longleftarrow", "⟸"],
		["\\Longleftrightarrow", "⟺"],
		["\\Longrightarrow", "⟹"],
		["\\lrhar", "⇋"],
		["\\lvec", "⃖", oNamesOfLiterals.accentLiteral[0]],
		["\\mapsto", "↦"],
		["\\matrix", "■", true],
		["\\medsp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 4/18em space medium math space
		["\\mid", "∣", true],
		["\\rvert", "∣", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\lvert", "∣", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\middle", "ⓜ", true],
		["\\models", "⊨"],
		["\\mp", "∓"],
		["\\mu", "μ"],
		["\\Mu", "Μ"],
		["\\nabla", "∇"],
		["\\naryand", "▒", true],
		["\\nbsp", " ", oNamesOfLiterals.spaceLiteral[0]],
		["\\ne", "≠"],
		["\\nearrow", "↗"],
		["\\neg", "¬", oNamesOfLiterals.operatorLiteral[0]],
		["\\neq", "≠"],
		["\\ni", "∋", oNamesOfLiterals.operatorLiteral[0]],
		["\\norm", "‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\notcontain", "∌"],
		["\\notelement", "∉"],
		["\\notin", "∉"],
		["\\nu", "ν"],
		["\\Nu", "Ν"],
		["\\nwarrow", "↖"],
		["\\o", "ο"],
		["\\O", "Ο"],
		["\\odot", "⊙"],
		["\\of", "▒", true],
		["\\oiiint", "∰", oNamesOfLiterals.opNaryLiteral[0]],
		["\\oiint", "∯", oNamesOfLiterals.opNaryLiteral[0]],
		["\\oint", "∮", oNamesOfLiterals.opNaryLiteral[0]],
		["\\omega", "ω"],
		["\\Omega", "Ω"],
		["\\ominus", "⊖"],
		["\\open", "├", true],
		["\\oplus", "⊕", oNamesOfLiterals.operatorLiteral[0]],
		["\\otimes", "⊗", oNamesOfLiterals.operatorLiteral[0]],
		["\\overbar", "¯", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overbrace", "⏞", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overbracket", "⎴", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overline", "¯", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overparen", "⏜", oNamesOfLiterals.hBracketLiteral[0]],
		["\\overshell", "⏠", oNamesOfLiterals.hBracketLiteral[0]],
		["\\parallel", "∥"], //check
		["\\partial", "∂"],
		["\\perp", "⊥", oNamesOfLiterals.operatorLiteral[0]],
		["\\phi", "ϕ"],
		["\\Phi", "Φ"],
		["\\pi", "π"],
		["\\Pi", "Π"],
		["\\pm", "±"],
		["\\pmatrix", "⒨", true],
		["\\pppprime", "⁗", oNamesOfLiterals.accentLiteral[0]],
		["\\ppprime", "‴", oNamesOfLiterals.accentLiteral[0]],
		["\\pprime", "″", oNamesOfLiterals.accentLiteral[0]],
		["\\prec", "≺", oNamesOfLiterals.operatorLiteral[0]],
		["\\preceq", "≼", oNamesOfLiterals.operatorLiteral[0]],
		["\\prime", "′", oNamesOfLiterals.accentLiteral[0]],
		["\\prod", "∏", oNamesOfLiterals.opNaryLiteral[0]], //oNamesOfLiterals.functionLiteral[0]
		["\\propto", "∝"],
		["\\psi", "ψ"],
		["\\Psi", "Ψ"],
		["\\qdrt", "∜", oNamesOfLiterals.sqrtLiteral[0]],
		["\\rangle", "〉", oNamesOfLiterals.opCloseBracket[0]],
		["\\Rangle", "⟫", oNamesOfLiterals.opCloseBracket[0]],
		["\\ratio", "∶"],
		["\\rbrace", "}", oNamesOfLiterals.opCloseBracket[0]],
		["\\rbrack", "]", oNamesOfLiterals.opCloseBracket[0]],
		["\\Rbrack", "⟧", oNamesOfLiterals.opCloseBracket[0]],
		["\\rceil", "⌉", oNamesOfLiterals.opCloseBracket[0]],
		["\\rddots", "⋰"],
		["\\Re", "ℜ"],
		["\\rect", "▭", oNamesOfLiterals.rectLiteral[0]],
		["\\rfloor", "⌋", oNamesOfLiterals.opCloseBracket[0]],
		["\\rho", "ρ"],
		["\\Rho", "Ρ"],
		["\\rhvec", "⃑"],
		["\\right", "┤", true],
		["\\rightarrow", "→"],
		["\\Rightarrow", "⇒", oNamesOfLiterals.operatorLiteral[0]],
		["\\rightharpoondown", "⇁"],
		["\\rightharpoonup", "⇀"],
		["\\rmoust", "⎱", oNamesOfLiterals.opCloseBracket[0]],
		["\\root", "⒭", true], //check
		["\\sdiv", "⁄", oNamesOfLiterals.overLiteral[0]],
		["\\sdivide", "⁄", oNamesOfLiterals.overLiteral[0]],
		//Script
		["\\searrow", "↘"],
		["\\setminus", "∖"],
		["\\sigma", "σ"],
		["\\Sigma", "Σ"],
		["\\sim", "∼", oNamesOfLiterals.operatorLiteral[0]],
		["\\simeq", "≃", oNamesOfLiterals.operatorLiteral[0]],
		["\\smash", "⬍"],
		["\\smile", "⌣"],
		["\\spadesuit", "♠"],
		["\\sqcap", "⊓"],
		["\\sqcup", "⊔"],
		["√(", undefined, true],
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
		["\\Tau", "Τ"],
		["\\therefore", "∴"],
		["\\theta", "θ"],
		["\\Theta", "Θ"],
		["\\thicksp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 5/18em space thick math space
		["\\thinsp", " ", oNamesOfLiterals.spaceLiteral[0]],
		["\\tilde", "̃", oNamesOfLiterals.accentLiteral[0]],
		["\\times", "×", oNamesOfLiterals.operatorLiteral[0]],
		["\\to", "→"],
		["\\top", "⊤", oNamesOfLiterals.operatorLiteral[0]],
		["\\tvec", "⃡", oNamesOfLiterals.accentLiteral[0]],
		["\\ubar", "̲", oNamesOfLiterals.accentLiteral[0]], //check
		["\\Ubar", "̳", oNamesOfLiterals.accentLiteral[0]], //check
		["\\underbar", "▁", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underbrace", "⏟", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underbracket", "⎵", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underline", "▱", oNamesOfLiterals.hBracketLiteral[0]],
		["\\underparen", "⏝", oNamesOfLiterals.hBracketLiteral[0]],
		["\\uparrow", "↑"],
		["\\Uparrow", "⇑"],
		["\\updownarrow", "↕"],
		["\\Updownarrow", "⇕"],
		["\\uplus", "⊎"],
		["\\upsilon", "υ"],
		["\\Upsilon", "Υ"],
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
		["\\Vert", "‖", oNamesOfLiterals.opOpenCloseBracket[0]],
		["\\Vmatrix", "⒩"],
		["\\vphantom", "⇳"],
		["\\vthicksp", " ", oNamesOfLiterals.spaceLiteral[0]], //[" ", oNamesOfLiterals.spaceLiteral[0]], // 6/18em space very thick math space
		["\\wedge", "∧", oNamesOfLiterals.operatorLiteral[0]],
		["\\wp", "℘"],//0x2118
		["\\wr", "≀"],
		["\\xi", "ξ"],
		["\\Xi", "Ξ"],
		["\\zeta", "ζ"],
		["\\Zeta", "Ζ"],
		["\\zwnj", "‌"],
		["\\zwsp", "​", oNamesOfLiterals.spaceLiteral[0]], //["​", oNamesOfLiterals.spaceLiteral[0]], // zero-width space

		//Unicode invisible operators
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

		["!", undefined, true],
		["!!", "‼"],
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

		// ["\\sf", 3, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\script", 7, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\scr", 7, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\rm", -1, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\oldstyle", 7, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathtt", 11, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathsfit", 5, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathsfbfit", 6, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathsfbf", 4, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathsf", 3, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathrm", -1, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathit", 1, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathfrak", 9, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathcal", 7, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathbfit", 2, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathbffrak", 10, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathbfcal", 8, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathbf", 0, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\mathbb", 12, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\it", 1, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\fraktur", 9, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\frak", 9, oNamesOfLiterals.mathFontLiteral[0]],
		// ["\\double", 12, oNamesOfLiterals.mathFontLiteral[0]],

		["/", undefined, oNamesOfLiterals.overLiteral[0]], // opOpen

		["\\over", undefined, true],
		["\\limits", undefined, true],
		["\\dfrac{", undefined, true],
		["\\frac", undefined, true],
		["\\cfrac{", undefined, true],// https://www.tutorialspoint.com/tex_commands/cfrac.htm
		["\\boxed", undefined, true], //TODO
		["\\binom", undefined, true],
		["\\begin{", undefined, true],
		["\\backslash", "\\", oNamesOfLiterals.opCloseBracket[0]],
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
		// ["\""],
		// ["\'"],

		// ["\\quad", 8193, oNamesOfLiterals.spaceLiteral[0]], // 1 em (nominally, the height of the font)
		// ["\\qquad", [8193, 8193], oNamesOfLiterals.spaceLiteral[0]], // 2em
		//["\\text{", "text{"],

		// ["\\lim", oNamesOfLiterals.functionLiteral[0]], LaTeX
		// ["\\lg", oNamesOfLiterals.functionLiteral[0]],

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
		//Char
		[
			function (str) {
				return str[0];
			},
			undefined,
			oNamesOfLiterals.charLiteral[0],
		],
	];
	const functionNames = [
		"tan", "tanh", "sup", "sum", "sinh", "sin", "sec", "ker", "hom",
		"arg", "arctan", "arcsin", "arcsec", "arccsc", "arccot", "arccos",
		"inf", "gcd", "exp", "dim", "det", "deg", "csc", "coth", "cot",
		"cosh", "cos", "log", "ln", "Pr",
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
		let Proceed = function (oTokens, oContext) {
			switch (oTokens.type) {
				case oNamesOfLiterals.charLiteral[num]:
				case oNamesOfLiterals.operatorLiteral[num]:
				case oNamesOfLiterals.mathOperatorLiteral[num]:
				case oNamesOfLiterals.numberLiteral[num]:
					oContext.Add_Text(oTokens.value);
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
					if (oTokens.up) {
						ConvertTokens(
							oTokens.up,
							oPreSubSup.getUpperIterator(),
						)
					}
					if (oTokens.down) {
						ConvertTokens(
							oTokens.down,
							oPreSubSup.getLowerIterator(),
						)
					}
					break;
				case oNamesOfLiterals.accentLiteral[num]:
					let oAccent = oContext.Add_Accent(
						new CTextPr(),
						oTokens.value,
						null
					);
					ConvertTokens(
						oTokens.base,
						oAccent.getBase(),
					);
					break;
				case oNamesOfLiterals.fractionLiteral[num]:
					let oFraction = oContext.Add_Fraction(
						{},
						null,
						null
					);
					ConvertTokens(
						oTokens.up,
						oFraction.getNumeratorMathContent()
					);
					ConvertTokens(
						oTokens.down,
						oFraction.getDenominatorMathContent()
					);
					break;
				case oNamesOfLiterals.subSupLiteral[num]:
					let SubSup = oContext.Add_Script(
						oTokens.up && oTokens.down,
						{},
						null,
						null,
						null
					);
					ConvertTokens(
						oTokens.value,
						SubSup.getBase(),
					);
					if (oTokens.up) {
						ConvertTokens(
							oTokens.up,
							SubSup.getUpperIterator(),
						)
					}
					if (oTokens.down) {
						ConvertTokens(
							oTokens.down,
							SubSup.getLowerIterator(),
						)
					}
					break;
				case oNamesOfLiterals.opBuildupLiteral[num]:
					console.log('log')
					break;
				case oNamesOfLiterals.bracketBlockLiteral[num]:
					let oBracket = oContext.Add_DelimiterEx(
						new CTextPr(),
						1,
						[null],
						oTokens.left,
						oTokens.right,
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
			}
		}

		let num = 1;
		if (oTokens.type === "LaTeXEquation") {
			oTokens = oTokens.body;
		}
		if (Array.isArray(oTokens)) {
			for (let i = 0; i < oTokens.length; i++) {
				Proceed(oTokens[i], oContext);
			}
		}
		else {
			Proceed(oTokens, oContext)
		}

	}

	function Tokenizer() {
		this._string = undefined;
		this._cursor = undefined;
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

		for (let i = 0; i < wordAutoCorrection.length; i++) {
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

})(window);
