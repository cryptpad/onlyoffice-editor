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
//todo ┤ and check


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
		fractionLiteral:				[0, "FractionLiteral"],
		spaceLiteral:					[1, "SpaceLiteral"],
		charLiteral:					[2, "CharLiteral"],
		accentLiteral:					[4, "AccentLiteral"],
		operatorLiteral:				[5, "OperatorLiteral"],
		binomLiteral:					[6, "BinomLiteral"],
		bracketBlockLiteral:			[7, "BracketBlock"],
		functionLiteral:				[8, "FunctionLiteral"],
		subSupLiteral:					[9, "SubSupLiteral"],
		sqrtLiteral:					[10, "SqrtLiteral"],
		numberLiteral:					[11, "NumberLiteral"],
		mathOperatorLiteral:			[12, "MathOperatorLiteral"],
		rectLiteral:					[13, "RectLiteral"],
		boxLiteral:						[14, "BoxLiteral"],
		preScriptLiteral:				[15, "PreScriptLiteral"],
		mathFontLiteral:				[16, "MathFontLiteral"],
		overLiteral:					[17, "OverLiteral"],
		diacriticLiteral:				[18, "DiacriticLiteral"],
		diacriticBaseLiteral:			[19, "DiacriticBaseLiteral"],
		otherLiteral:					[20, "OtherLiteral"],
		anMathLiteral:					[21, "AnMathLiteral"],
		opBuildupLiteral:				[22, "opBuildUpLiteral"],
		opOpenBracket:					[23, "opOpenLiteral"],
		opCloseBracket:					[24, "opCLoseLiteral"],
		opOpenCloseBracket:				[25, "opCloseLiteral"],
		belowLiteral:					[26, "belowLiteral"],
		aboveLiteral:					[27, "aboveLiteral"],
		hBracketLiteral:				[27, "hBracketLiteral"],
		opNaryLiteral:					[28, "opNaryLiteral"],
		asciiLiteral:					[29, "asciiLiteral"],
		opArrayLiteral:					[30, "opArrayLiteral"],
		opDecimal:						[31, "opDecimal"],

		specialScriptNumberLiteral:		[32, "specialScriptLiteral"],
		specialScriptCharLiteral:		[33, "specialScriptLiteral"],
		specialScriptBracketLiteral:	[34, "specialScriptBracketLiteral"],
		specialScriptOperatorLiteral:	[35, "specialScriptBracketLiteral"],

		specialIndexNumberLiteral:		[36, "specialScriptLiteral"],
		specialIndexCharLiteral:		[37, "specialScriptLiteral"],
		specialIndexBracketLiteral:		[38, "specialScriptBracketLiteral"],
		specialIndexOperatorLiteral:	[39, "specialScriptBracketLiteral"],

		textLiteral:					[40, "textLiteral"],
		nthrtLiteral:					[41, "nthrtLiteral"],
		fourthrtLiteral:				[41, "fourthrtLiteral"],
		cubertLiteral:					[42, "cubertLiteral"],
		overBarLiteral:					[43, "overBarLiteral"],
	};
	const AutoCorrect = {
		A: [
			["Alpha", "Α"],
		],
		a: [
			["above", 0x2534],
			["acute", 0x0301],
			["aleph", 0x2135],
			["alpha", 0x03b1],
			["amalg", 0x2210],
			["angle", 0x2220], // word
			["aoint", 0x2233],
			["approx", 0x2248],
			["asmash", 0x2b06],
			["ast", 0x2217],
			["asymp", 0x224d],
			["atop", 0x00a6],
		],
		B: [
			["Bar", 0x033f],
			["Beta",]
		],
		b: [
			["bar", 0x0305],
			["because", 0x2235],
			["begin", 0x3016],
			["below", 0x252c],
			["beta", 0x03b2],
			["beth", 0x2136],
			["bet", 0x2136],
			["bot", 0x22a5],
			["bigcap", 0x22c2],
			["bigcup", 0x22c2],
			["bigodot", 0x2a00],
			["bigoplus", 0x2a01],
			["bigotimes", 0x2a02],
			["bigsqcup", 0x2a06],
			["biguplus", 0x2a04],
			["bigvee", 0x22c1],
			["bigwedge", 0x22c0],
			["bowtie", 0x22c8],
			["boxdot", 0x22a1],
			["boxplus", 0x229e],
			["boxminus", 0x229f],
			["box", 0x25a1],
			["bra", 0x27e8],
			["breve", 0x0306],
			["bullet", 0x2219],
		],
		c: [
			["cap", 0x2229],
			["cbrt", 0x221b],
			["cdots", 0x22ef],
			["cdot", 0x22c5],
			["check", 0x030c],
			["chi", 0x03c7],
			["circ", 0x2218],
			["close", 0x2524],
			["clubsuit", 0x2663],
			["coint", 0x2232],
			["cong", 0x2245],
			["contain", 0x220b],
			["cup", 0x222a],
		],
		D: [
			["Dd", 0x2145],
			["Downarrow", 0x21d3],
			["Delta", 0x0394],
			["Deltaeq", 0x225c],
		],
		d: [
			["daleth", 0x2138],
			["dalet", 0x2138],

			["dashv", 0x22a3],
			["ddddot", 0x20dc],
			["dddot", 0x20db],
			["ddots", 0x22f1],
			["ddot", 0x0308],
			["dd", 0x2146],
			["degree", 0x00b0],
			["delta", 0x03b4],
			["diamondsuit", 0x2662],
			["diamond", 0x22c4],
			["div", 0x00f7],
			["doteq", 0x2250],
			["dots", 0x2026],
			["dot", 0x0307],
			["downarrow", 0x2193],
			["dsmash", 0x2b07],
			["degc", 0x2103],
			["degf", 0x2109],

		],
		e: [
			["ee", 0x2147],
			["ell", 0x2113],
			["emptyset", 0x2205],
			["emsp", 0x2003],
			["end", 0x3017],
			["ensp", 0x2002],
			["epsilon", 0x03f5],
			["eqarray", 0x2588],
			["eqno", 0x0023],
			["equiv", 0x2261],
			["eta", 0x03b7],
			["exists", 0x2203],
		],
		f: [
			["forall", 0x2200],
			["funcapply", 0x2061],
			["frown", 0x2311],
		],
		G: [
			["Gamma", 0x0393],
		],
		g: [
			["gamma", 0x03b3],
			["geq", 0x2265],
			["gets", 0x2190],
			["ge", 0x2265],
			["gg", 0x226b],
			["gimel", 0x2137],
			["grave", 0x0300],
		],
		h: [
			["hairsp", 0x200a],
			["hat", 0x0302],
			["hbar", 0x210f],
			["heartsuit", 0x2661],
			["hookleftarrow", 0x21a9],
			["hookrightarrow", 0x21aa],
			["hphantom", 0x2b04],
			["hsmash", 0x2b0c],
			["hvec", 0x20d1],
		],
		I: [
			["Im", 0x2111],
		],
		i: [
			["iiiint", 0x2a0c],
			["iiint", 0x222d],
			["iint", 0x222c],
			["ii", 0x2148],
			["int", 0x222b],
			["imath", "𝚤"], //todo surogate pair
			["inc", 0x2206],
			["infty", 0x221e],
			["in", 0x2208],
			["iota", 0x03b9],
		],
		j: [
			["jj", 0x2149],
			["jmath", "𝚥"],
		],
		k: [
			["kappa", 0x03ba],
			["ket", 0x27e9],
		],
		L: [
			["Lambda", 0x039b],
			["Longleftrightarrow", 0x27fa],
			["Longrightarrow", 0x27f9],
			["Leftarrow", 0x21d0],
		],
		l: [
			["lambda", 0x03bb],
			["langle", 0x27e8],
			["lbrace", 0x007b],
			["lbrack", 0x005b],
			["lceil", 0x2308],
			["ldiv", 0x2215],
			["ldots", 0x2026],
			["le", 0x2264],
			["leftarrow", 0x2190],
			["leftharpoondown", 0x21bd],
			["leftharpoonup", 0x21bc],
			["Leftrightarrow", 0x21d4],
			["leftrightarrow", 0x2194],
			["leq", 0x2264],
			["lfloor", 0x230a],
			["ll", 0x226a],
			["Longleftarrow", 0x27f8],
			["longleftarrow", 0x27f5],
			["longleftrightarrow", 0x27f7],
			["longrightarrow", 0x27f6],
			["left", 0x251c],
			["lmoust", 0x23b0],
		],
		m: [
			["mapsto", 0x21a6],
			["matrix", 0x25a0],
			["medsp", 0x205f],
			["mid", 0x2223],
			["models", 0x22a8],
			["mp", 0x2213],
			["mu", 0x03bc],
		],
		n: [
			["nabla", 0x2207],
			["naryand", 0x2592],
			["nbsp", 0x00a0],
			["ndiv", 0x2298],
			["nearrow", 0x2197],
			["neg", 0x00ac],
			["neq", 0x2260],
			["ne", 0x2260],

			["ni", 0x220b],
			["norm", 0x2016],
			["nu", 0x03bd],
			["nwarrow", 0x2196],
		],
		O: [
			["Omega", 0x03a9],
		],
		o: [
			["odot", 0x2299],
			["of", 0x2592],
			["oiiint", 0x2230],
			["oiint", 0x222f],
			["oint", 0x222e],
			["omega", 0x03c9],
			["ominus", 0x2296],
			["open", 0x251c],
			["oplus", 0x2295],
			["oslash", 0x2298],
			["otimes", 0x2297],

			["overbar", 0x00af],
			["overbrace", 0x23de],
			["overbracket", 0x23b4],
			["overparen", 0x23dc],
			["overshell", 0x23e0],
			["over", 0x002f],
		],
		P: [
			["Pi", 0x03a0],
			["Phi", 0x03a6],
			["Psi", 0x03a8],
		],
		p: [
			["parallel", 0x2225],
			["partial", 0x2202],
			["perp", 0x22a5],
			["phantom", 0x27e1],
			["phi", 0x03d5],
			["pi", 0x03c0],
			["pm", 0x00b1],
			["pppprime", 0x2057],
			["ppprime", 0x2034],
			["pprime", 0x2033],
			["prcue", 0x227c],
			["preceq", 0x2aaf],
			["preccurlyeq", 0x227c],
			["prec", 0x227a],

			["prime", 0x2032],
			["prod", 0x220f],
			["propto", 0x221d],
			["psi", 0x03c8],
		],
		q: [
			["qdrt", 0x221c],
		],
		R: [
			["Re", 0x211c],
			["Rightarrow", 0x21d2],
		],
		r: [
			["rangle", 0x27e9],
			["ratio", 0x2236],
			["rbrace", 0x007d],
			["rbrack", 0x005d],
			["rceil", 0x2309],
			["rddots", 0x22f0],
			["rect", 0x25ad],
			["rfloor", 0x230b],
			["rho", 0x03c1],
			["right", 0x2524],
			["rightarrow", 0x2192],
			["rightharpoondown", 0x21c1],
			["rightharpoonup", 0x21c0],
			["rmoust", 0x23b1],
			["rrect", 0x25a2],
			["root", 8730],
		],
		S: [
			["Sigma", 0x03a3],
		],
		s: [
			["sdiv", 0x2044],
			["searrow", 0x2198],
			["setminus", 0x2216],
			["sigma", 0x03c3],
			["sim", 0x223c],
			["simeq", 0x2243],
			["smash", 0x2b0d],
			["smile", 0x2323],
			["spadesuit", 0x2660],
			["sqcap", 0x2293],
			["sqcup", 0x2294],
			["sqrt", 0x221a],
			["sqsubseteq", 0x2291],
			["sqsuperseteq", 0x2292],
			["star", 0x22c6],
			["subseteq", 0x2286],
			["subset", 0x2282],
			["succeq", 0x227d],
			["succ", 0x227b],
			["sum", 0x2211],
			["superset", 0x2283],
			["superseteq", 0x2287],
			["swarrow", 0x2199],
		],
		T: [
			["Theta", 0x0398],
		],
		t: [
			["tau", 0x03c4],
			["therefore", 0x2234],
			["theta", 0x03b8],
			["thicksp", 0x2005],
			["thinsp", 0x2006],
			["tilde", 0x0303],
			["times", 0x00d7],
			["to", 0x2192],
			["top", 0x22a4],
			["tvec", 0x20e1],
		],
		U: [
			["Uparrow", 0x21d1],
			["Updownarrow", 0x21d5],
			["Upsilon", 0x03a5],
		],
		u: [
			["ubar", 32],
			["underbar", 0x2581],
			["underbrace", 0x23df],
			["underbracket", 0x23b5],
			["underparen", 0x23dd],
			["undershell", 0x23e1],
			["uparrow", 0x2191],
			["updownarrow", 0x2195],
			["uplus", 0x228e],
			["upsilon", 0x03c5],
		],
		V: [
			["Vert", 0x2016],
		],
		v: [
			["varepsilon", 0x03b5],
			["varphi", 0x03c6],
			["varpi", 0x03d6],
			["varrho", 0x03f1],
			["varsigma", 0x03c2],
			["vartheta", 0x03d1],
			["vbar", 0x2502],
			["vdash", 0x22a2],
			["vdots", 0x22ee],
			["vec", 0x20d7],
			["vee", 0x2228],
			["vert", 0x007c],
			["vphantom", 0x21f3],
			["vthicksp", 0x2004],
		],
		w: [
			["wedge", 0x2227],
			["wp", 0x2118],
			["wr", 0x2240],
		],
		X: [
			["Xi", 0x039e],
		],
		x: [
			["xi", 0x03be],
		],
		z: [
			["zeta", 0x03b6],
			["zwnj", 0x200c],
			["zwsp", 0x200b],
		],
	};
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
	const LaTeXTokenRules = [
		[
			function (str) {
				let literal = str[0];
				if (/\d/.test(literal)) {
					return literal;
				}
			},
			oNamesOfLiterals.numberLiteral[0],
		],
		[
			function (str, oTokenizerContext) {
				return oTokenizerContext.ProcessString(str, " ");
			},
			oNamesOfLiterals.spaceLiteral[0],
		],
		[
			function (str) {
				let literal = str[0];
				if (/^[a-zA-Z]/.test(literal)) {
					return literal;
				}
			},
			oNamesOfLiterals.charLiteral[0],
		],

		["\\\\"],

		["\\zeta", oNamesOfLiterals.charLiteral[0], "ζ"],
		["\\xi", oNamesOfLiterals.charLiteral[0], "ξ"],
		["\\wp", oNamesOfLiterals.charLiteral[0], "℘"],
		["\\widehat", oNamesOfLiterals.accentLiteral[0], 770],
		["\\widecheck", "widecheck"],
		["\\vert", "opOpen/opClose", "∣"],
		["\\vec", oNamesOfLiterals.accentLiteral[0], 8407],
		["\\vartheta", oNamesOfLiterals.charLiteral[0], "ϑ"],
		["\\varsigma", oNamesOfLiterals.charLiteral[0], "ς"],
		["\\varrho", oNamesOfLiterals.charLiteral[0], "ϱ"],
		["\\varpropto",  oNamesOfLiterals.charLiteral[0], "∝"],
		["\\varpi", oNamesOfLiterals.charLiteral[0], "ϖ"],
		["\\varphi", oNamesOfLiterals.charLiteral[0], "φ"],
		["\\varnothing",  oNamesOfLiterals.charLiteral[0], "∅"],
		["\\varkappa", oNamesOfLiterals.charLiteral[0], "ϰ"],
		["\\varepsilon", oNamesOfLiterals.charLiteral[0], "ε"],
		["\\varPi", oNamesOfLiterals.charLiteral[0], "Π"],
		["\\varPhi", oNamesOfLiterals.charLiteral[0], "Φ"],
		["\\varOmega", oNamesOfLiterals.charLiteral[0], "Ω"],
		["\\varLambda", oNamesOfLiterals.charLiteral[0], "Λ"],
		["\\varGamma", oNamesOfLiterals.charLiteral[0], "Γ"],
		["\\varDelta", oNamesOfLiterals.charLiteral[0], "Δ"],
		["\\urcorner", "opClose", "┐"],
		["\\upuparrows",  oNamesOfLiterals.charLiteral[0], "⇈"],
		["\\upsilon", oNamesOfLiterals.charLiteral[0], "𝜐"],
		["\\uplus",  oNamesOfLiterals.charLiteral[0], "⊎"],
		["\\upharpoonright",  oNamesOfLiterals.charLiteral[0], "↾"],
		["\\upharpoonleft",  oNamesOfLiterals.charLiteral[0], "↿"],
		["\\updownarrow",  oNamesOfLiterals.charLiteral[0], "↕"],
		["\\uparrow",  oNamesOfLiterals.charLiteral[0], "↑"],
		["\\unrhd",  oNamesOfLiterals.charLiteral[0], "⊵"],
		["\\unlhd",  oNamesOfLiterals.charLiteral[0], "⊴"],
		["\\underrightarrow", "underrightarrow"],
		["\\underparen", "underparen"],
		["\\underlinesegment", "underlinesegment"],
		["\\underline", "underline"],
		["\\underleftrightarrow", "underleftrightarrow"],
		["\\underleftarrow", "underleftarrow"],
		["\\undergroup", "undergroup"],
		["\\underbrace", "underbrace"],
		["\\underbar", "underbar"],
		["\\ulcorner", "opOpen", "┌"],
		["\\twoheadrightarrow",  oNamesOfLiterals.charLiteral[0], "↠"],
		["\\twoheadleftarrow",  oNamesOfLiterals.charLiteral[0], "↞"],
		["\\trianglerighteq",  oNamesOfLiterals.charLiteral[0], "⊵"],
		["\\triangleright",  oNamesOfLiterals.charLiteral[0], "▹"],
		["\\triangleq",  oNamesOfLiterals.charLiteral[0], "≜"],
		["\\trianglelefteq",  oNamesOfLiterals.charLiteral[0], "⊴"],
		["\\triangleleft",  oNamesOfLiterals.charLiteral[0], "◃"],
		["\\triangledown",  oNamesOfLiterals.charLiteral[0], "▽"],
		["\\triangle",  oNamesOfLiterals.charLiteral[0], "△"],
		["\\top",  oNamesOfLiterals.charLiteral[0], "⊤"],
		["\\to",  oNamesOfLiterals.charLiteral[0], "→"],
		["\\times", oNamesOfLiterals.mathOperatorLiteral[0], "×"],
		["\\tilde", oNamesOfLiterals.accentLiteral[0], 771],
		["\\thicksim ",  oNamesOfLiterals.charLiteral[0], "∼"],
		["\\thickapprox",  oNamesOfLiterals.charLiteral[0], "≈"],
		["\\theta",  oNamesOfLiterals.charLiteral[0], "θ"],
		["\\therefore",  oNamesOfLiterals.charLiteral[0], "∴"],
		["\\tfrac", "\\tfrac"],
		["\\text{", "text{"],
		["\\tau", oNamesOfLiterals.charLiteral[0], "τ"],
		["\\tanh", oNamesOfLiterals.functionLiteral[0]],
		["\\tan", oNamesOfLiterals.functionLiteral[0]],
		["\\swarrow",  oNamesOfLiterals.charLiteral[0], "↙"],
		["\\surd",  oNamesOfLiterals.charLiteral[0], "√"],
		["\\supsetneqq",  oNamesOfLiterals.charLiteral[0], "⫌"],
		["\\supsetneq",  oNamesOfLiterals.charLiteral[0], "⊋"],
		["\\supseteqq",  oNamesOfLiterals.charLiteral[0], "⫆"],
		["\\supseteq",  oNamesOfLiterals.charLiteral[0], "⊇"],
		["\\supset",  oNamesOfLiterals.charLiteral[0], "⊃"],
		["\\sup", oNamesOfLiterals.functionLiteral[0]],
		["\\sum", oNamesOfLiterals.functionLiteral[0]],
		["\\succsim",  oNamesOfLiterals.charLiteral[0], "≿"],
		["\\succnsim",  oNamesOfLiterals.charLiteral[0], "⋩"],
		["\\succneqq",  oNamesOfLiterals.charLiteral[0], "⪶"],
		["\\succnapprox",  oNamesOfLiterals.charLiteral[0], "⪺"],
		["\\succeq",  oNamesOfLiterals.charLiteral[0], "⪰"],
		["\\succcurlyeq",  oNamesOfLiterals.charLiteral[0], "≽"],
		["\\succapprox",  oNamesOfLiterals.charLiteral[0], "⪸"],
		["\\succ",  oNamesOfLiterals.charLiteral[0], "≻"],
		["\\subsetneqq",  oNamesOfLiterals.charLiteral[0], "⫋"],
		["\\subsetneq",  oNamesOfLiterals.charLiteral[0], "⊊"],
		["\\subseteqq",  oNamesOfLiterals.charLiteral[0], "⫅"],
		["\\subseteq",  oNamesOfLiterals.charLiteral[0], "⊆"],
		["\\subset",  oNamesOfLiterals.charLiteral[0], "⊂"],
		["\\star",  oNamesOfLiterals.charLiteral[0], "★"],
		["\\square",  oNamesOfLiterals.charLiteral[0], "□"],
		["\\sqsupseteq",  oNamesOfLiterals.charLiteral[0], "⊒"],
		["\\sqsupset",  oNamesOfLiterals.charLiteral[0], "⊐"],
		["\\sqsubseteq",  oNamesOfLiterals.charLiteral[0], "⊑"],
		["\\sqsubset",  oNamesOfLiterals.charLiteral[0], "⊏"],
		["\\sqrt[", "\\sqrt["],
		["\\sqrt", "\\sqrt"],
		["\\sqcup",  oNamesOfLiterals.charLiteral[0], "⊔"],
		["\\sqcap",  oNamesOfLiterals.charLiteral[0], "⊓"],
		["\\sphericalangle",  oNamesOfLiterals.charLiteral[0], "∢"],
		["\\spadesuit",  oNamesOfLiterals.charLiteral[0], "♠"],
		["\\smile",  oNamesOfLiterals.charLiteral[0], "⌣"],
		["\\smallsmile",  oNamesOfLiterals.charLiteral[0], "⌣"],
		["\\smallsetminus",  oNamesOfLiterals.charLiteral[0], "∖"],
		["\\smallint",  oNamesOfLiterals.charLiteral[0], "∫"],
		["\\smallfrown",  oNamesOfLiterals.charLiteral[0], "⌢"],
		["\\sinh", oNamesOfLiterals.functionLiteral[0]],
		["\\sin", oNamesOfLiterals.functionLiteral[0]],
		["\\simeq",  oNamesOfLiterals.charLiteral[0], "≃"],
		["\\sim",  oNamesOfLiterals.charLiteral[0], "∼"],
		["\\sigma", oNamesOfLiterals.charLiteral[0], "σ"],
		["\\sideset", "\\sideset"], //todo
		["\\shortparallel",  oNamesOfLiterals.charLiteral[0], "∥"],
		["\\shortmid",  oNamesOfLiterals.charLiteral[0], "∣"],
		["\\sharp",  oNamesOfLiterals.charLiteral[0], "♯"],
		["\\sf", oNamesOfLiterals.mathFontLiteral[0], 3],
		["\\sec", oNamesOfLiterals.functionLiteral[0]],
		["\\searrow",  oNamesOfLiterals.charLiteral[0], "↘"],
		["\\script", oNamesOfLiterals.mathFontLiteral[0], 7],
		["\\scr", oNamesOfLiterals.mathFontLiteral[0], 7],
		["\\rvert", "∣", "opOpen/opClose"],
		["\\rtimes",  oNamesOfLiterals.charLiteral[0], "↱"],
		["\\rrbracket", "⟧", "opOpen"],
		["\\rparen", "opClose"],
		["\\root ", "\\root"],
		["\\rmoustache", "opClose", "⎱"],
		["\\rm", oNamesOfLiterals.mathFontLiteral[0], -1],
		["\\risingdotseq",  oNamesOfLiterals.charLiteral[0], "≓"],
		["\\rightthreetimes",  oNamesOfLiterals.charLiteral[0], "⋌"],
		["\\rightsquigarrow",  oNamesOfLiterals.charLiteral[0], "⇝"],
		["\\rightrightarrows",  oNamesOfLiterals.charLiteral[0], "⇉"],
		["\\rightleftharpoons",  oNamesOfLiterals.charLiteral[0], "⇌"],
		["\\rightleftarrows",  oNamesOfLiterals.charLiteral[0], "⇄"],
		["\\rightharpoonup",  oNamesOfLiterals.charLiteral[0], "⇀"],
		["\\rightharpoondown",  oNamesOfLiterals.charLiteral[0], "⇁"],
		["\\rightarrowtail",  oNamesOfLiterals.charLiteral[0], "↣"],
		["\\rightarrow",  oNamesOfLiterals.charLiteral[0], "→"],
		["\\right", "\\right"],
		["\\rho", oNamesOfLiterals.charLiteral[0], "ρ"],
		["\\rhd",  oNamesOfLiterals.charLiteral[0], "⊳"],
		["\\rgroup", "opClose", "⟯"],
		["\\rfloor", "opClose", "⌋"],
		["\\restriction",  oNamesOfLiterals.charLiteral[0], "↾"],
		["\\rect"],
		["\\rceil", "opClose", "⌉"],
		["\\rbrack", "opClose", "]"],
		["\\rbrace", "opClose", "}"],
		["\\rangle", "opClose", "⟩"],
		["\\rang", "opClose"],
		["\\rVert", "∥", "opOpen/opClose"],
		["\\rBrace", "opClose", "]}"], //todo
		["\\quad", 8193, oNamesOfLiterals.spaceLiteral[0]], // 1 em (nominally, the height of the font)
		["\\qquad", [8193, 8193], oNamesOfLiterals.spaceLiteral[0]], // 2em
		["\\psi ", oNamesOfLiterals.charLiteral[0], "ψ"],
		["\\propto ",  oNamesOfLiterals.charLiteral[0], "∝"],
		["\\projlim", oNamesOfLiterals.functionLiteral[0]],
		["\\prod", oNamesOfLiterals.functionLiteral[0]],
		["\\prime", oNamesOfLiterals.accentLiteral[0], 39],
		["\\precsim",  oNamesOfLiterals.charLiteral[0], "≾"],
		["\\precnsim",  oNamesOfLiterals.charLiteral[0], "⋨"],
		["\\precneqq",  oNamesOfLiterals.charLiteral[0], "⪵"],
		["\\precnapprox",  oNamesOfLiterals.charLiteral[0], "⪹"],
		["\\preceq",  oNamesOfLiterals.charLiteral[0], "⪯"],
		["\\preccurlyeq",  oNamesOfLiterals.charLiteral[0], "≼"],
		["\\precapprox",  oNamesOfLiterals.charLiteral[0], "⪷"],
		["\\prec",  oNamesOfLiterals.charLiteral[0], "≺"],
		["\\pod"],
		["\\pmod"],
		["\\pmatrix", "\\pmatrix"],
		["\\pm",  oNamesOfLiterals.charLiteral[0], "±"],
		["\\pitchfork",  oNamesOfLiterals.charLiteral[0], "⋔"],
		["\\pi", oNamesOfLiterals.charLiteral[0], "π"],
		["\\phi",  oNamesOfLiterals.charLiteral[0], "𝜙"],
		["\\phantom", "\\phantom"], //todo
		["\\perp",  oNamesOfLiterals.charLiteral[0], "⊥"],
		["\\partial", oNamesOfLiterals.charLiteral[0], "∂"],
		["\\parallel",  oNamesOfLiterals.charLiteral[0], "∥"],
		["\\owns",  oNamesOfLiterals.charLiteral[0], "∋"],
		["\\overrightharpoon", "overrightharpoon"],
		["\\overrightarrow", undefined, "Arrow"],
		["\\overrightarrow", "overrightarrow"],
		["\\overparen", "Arrow"],
		["\\overlinesegment", "overlinesegment"],
		["\\overline", "Arrow"],
		["\\overleftrightarrow", undefined, "Arrow"],
		["\\overleftharpoon", "overleftharpoon"],
		["\\overleftarrow", undefined, "Arrow"],
		["\\overgroup", "overgroup"],
		["\\overbrace"],
		["\\over"],
		["\\otimes",  oNamesOfLiterals.charLiteral[0], "⊗"],
		["\\oslash",  oNamesOfLiterals.charLiteral[0], "⊘"],
		["\\oplus",  oNamesOfLiterals.charLiteral[0], "⊕"],
		["\\ominus",  oNamesOfLiterals.charLiteral[0], "⊖"],
		["\\omicron", oNamesOfLiterals.charLiteral[0], "ο"],
		["\\omega", oNamesOfLiterals.charLiteral[0], "ω"],
		["\\oldstyle", oNamesOfLiterals.mathFontLiteral[0], 7],
		["\\oint", oNamesOfLiterals.functionLiteral[0]], //∮
		["\\of ", "\\of"],
		["\\odot",  oNamesOfLiterals.charLiteral[0], "⊙"],
		["\\o", oNamesOfLiterals.charLiteral[0], "ο"],
		["\\nwarrow",  oNamesOfLiterals.charLiteral[0], "↖"],
		["\\nvdash",  oNamesOfLiterals.charLiteral[0], "⊬"],
		["\\nvDash",  oNamesOfLiterals.charLiteral[0], "⊭"],
		["\\nu", oNamesOfLiterals.charLiteral[0], "𝜈"],
		["\\ntrianglerighteq",  oNamesOfLiterals.charLiteral[0], "⋭"],
		["\\ntriangleright",  oNamesOfLiterals.charLiteral[0], "⋫"],
		["\\ntrianglelefteq",  oNamesOfLiterals.charLiteral[0], "⋬"],
		["\\ntriangleleft",  oNamesOfLiterals.charLiteral[0], "⋪"],
		["\\nsupseteq",  oNamesOfLiterals.charLiteral[0], "⊉"],
		["\\nsucceq",  oNamesOfLiterals.charLiteral[0], "⋡"],
		["\\nsucc",  oNamesOfLiterals.charLiteral[0], "⊁"],
		["\\nsubseteq",  oNamesOfLiterals.charLiteral[0], "⊈"],
		["\\nsim",  oNamesOfLiterals.charLiteral[0], "≁"],
		["\\nshortparallel",  oNamesOfLiterals.charLiteral[0], "∦"],
		["\\nshortmid",  oNamesOfLiterals.charLiteral[0], "∤"],
		["\\nrightarrow",  oNamesOfLiterals.charLiteral[0], "↛"],
		["\\npreceq",  oNamesOfLiterals.charLiteral[0], "⋠"],
		["\\nprec",  oNamesOfLiterals.charLiteral[0], "⊀"],
		["\\nparallel",  oNamesOfLiterals.charLiteral[0], "∦"],
		["\\notin",  oNamesOfLiterals.charLiteral[0], "∉"],
		["\\not", oNamesOfLiterals.accentLiteral[0], 824],
		["\\nmid",  oNamesOfLiterals.charLiteral[0], "∤"],
		["\\nless",  oNamesOfLiterals.charLiteral[0], "≮"],
		["\\nleqslant",  oNamesOfLiterals.charLiteral[0], ""],
		["\\nleqq",  oNamesOfLiterals.charLiteral[0], ""],
		["\\nleq",  oNamesOfLiterals.charLiteral[0], "≰"],
		["\\nleftrightarrow",  oNamesOfLiterals.charLiteral[0], "↮"],
		["\\nleftarrow",  oNamesOfLiterals.charLiteral[0], "↚"],
		["\\ni",  oNamesOfLiterals.charLiteral[0], "∋"],
		["\\ngtr",  oNamesOfLiterals.charLiteral[0], "≯"],
		["\\ngeqslant",  oNamesOfLiterals.charLiteral[0], ""],
		["\\ngeqq",  oNamesOfLiterals.charLiteral[0], ""],
		["\\ngeq",  oNamesOfLiterals.charLiteral[0], "≱"],
		["\\nexists",  oNamesOfLiterals.charLiteral[0], "∄"],
		["\\neq",  oNamesOfLiterals.charLiteral[0], "≠"],
		["\\neg",  oNamesOfLiterals.charLiteral[0], "¬"],
		["\\nearrow",  oNamesOfLiterals.charLiteral[0], "↗"],
		["\\ne",  oNamesOfLiterals.charLiteral[0], "≠"],
		["\\ncong",  oNamesOfLiterals.charLiteral[0], "≆"],
		["\\natural",  oNamesOfLiterals.charLiteral[0], "♮"],
		["\\nabla",  oNamesOfLiterals.charLiteral[0], "∇"],
		["\\nVdash",  oNamesOfLiterals.charLiteral[0], "⊮"],
		["\\nVDash",  oNamesOfLiterals.charLiteral[0], "⊯"],
		["\\nRightarrow",  oNamesOfLiterals.charLiteral[0], "⇏"],
		["\\nLeftrightarrow",  oNamesOfLiterals.charLiteral[0], "⇎"],
		["\\nLeftarrow",  oNamesOfLiterals.charLiteral[0], "⇍"],
		["\\multimap",  oNamesOfLiterals.charLiteral[0], "⊸"],
		["\\mu", oNamesOfLiterals.charLiteral[0], "μ"],
		["\\mp",  oNamesOfLiterals.charLiteral[0], "∓"],
		["\\models",  oNamesOfLiterals.charLiteral[0], "⊨"],
		["\\mod", oNamesOfLiterals.functionLiteral[0]],
		["\\mit", oNamesOfLiterals.mathFontLiteral[0], 1],
		["\\minimum", oNamesOfLiterals.functionLiteral[0]],
		["\\min", oNamesOfLiterals.functionLiteral[0]],
		["\\mid",  oNamesOfLiterals.charLiteral[0], "∣"], //todo Space for mid  https://www.tutorialspoint.com/tex_commands/mid.htm
		["\\mho",  oNamesOfLiterals.charLiteral[0], "℧"],
		["\\measuredangle",  oNamesOfLiterals.charLiteral[0], "∡"],
		["\\maximum", oNamesOfLiterals.functionLiteral[0]],
		["\\max", oNamesOfLiterals.functionLiteral[0]],
		["\\matrix", "\\matrix"],
		["\\mathtt", oNamesOfLiterals.mathFontLiteral[0], 11],
		["\\mathsfit", oNamesOfLiterals.mathFontLiteral[0], 5],
		["\\mathsfbfit", oNamesOfLiterals.mathFontLiteral[0], 6],
		["\\mathsfbf", oNamesOfLiterals.mathFontLiteral[0], 4],
		["\\mathsf", oNamesOfLiterals.mathFontLiteral[0], 3],
		["\\mathrm", oNamesOfLiterals.mathFontLiteral[0], -1],
		["\\mathring", "mathring"],
		["\\mathit", oNamesOfLiterals.mathFontLiteral[0], 1],
		["\\mathfrak", oNamesOfLiterals.mathFontLiteral[0], 9],
		["\\mathcal", oNamesOfLiterals.mathFontLiteral[0], 7],
		["\\mathbfit", oNamesOfLiterals.mathFontLiteral[0], 2],
		["\\mathbffrak", oNamesOfLiterals.mathFontLiteral[0], 10],
		["\\mathbfcal", oNamesOfLiterals.mathFontLiteral[0], 8],
		["\\mathbf", oNamesOfLiterals.mathFontLiteral[0], 0],
		["\\mathbb", oNamesOfLiterals.mathFontLiteral[0], 12],
		["\\mapsto",  oNamesOfLiterals.charLiteral[0], "↦"],
		["\\maltese",  oNamesOfLiterals.charLiteral[0], "✠"],
		["\\lvertneqq",  oNamesOfLiterals.charLiteral[0], "≨"],
		["\\lvert", "∣", "opOpen/opClose"],
		["\\ltimes",  oNamesOfLiterals.charLiteral[0], "⋉"],
		["\\lt",  oNamesOfLiterals.charLiteral[0], "<"],
		["\\lrcorner", "opOpen", "┘"],
		["\\lparen", "opOpen"],
		["\\lozenge",  oNamesOfLiterals.charLiteral[0], "◊"],
		["\\lor",  oNamesOfLiterals.charLiteral[0], "∨"],
		["\\looparrowright",  oNamesOfLiterals.charLiteral[0], "↬"],
		["\\looparrowleft",  oNamesOfLiterals.charLiteral[0], "↫"],
		["\\longrightarrow",  oNamesOfLiterals.charLiteral[0], "⟶"],
		["\\longmapsto",  oNamesOfLiterals.charLiteral[0], "⟼"],
		["\\longleftrightarrow",  oNamesOfLiterals.charLiteral[0], "⟷"],
		["\\longleftarrow",  oNamesOfLiterals.charLiteral[0], "⟵"],
		["\\log", oNamesOfLiterals.functionLiteral[0]],
		["\\lnsim",  oNamesOfLiterals.charLiteral[0], "⋦"],
		["\\lnot",  oNamesOfLiterals.charLiteral[0], "¬"],
		["\\lneqq",  oNamesOfLiterals.charLiteral[0], "≨"],
		["\\lneq",  oNamesOfLiterals.charLiteral[0], "⪇"],
		["\\lnapprox",  oNamesOfLiterals.charLiteral[0], "⪉"],
		["\\ln", oNamesOfLiterals.functionLiteral[0]],
		["\\lmoustache", "opOpen", "⎰"],
		["\\llless",  oNamesOfLiterals.charLiteral[0], "⋘"],
		["\\lll",  oNamesOfLiterals.charLiteral[0], "⋘"],
		["\\llcorner", "opOpen", "└"],
		["\\llbracket", "opOpen", "⟦"],
		["\\ll",  oNamesOfLiterals.charLiteral[0], "≪"],
		["\\limsup", oNamesOfLiterals.functionLiteral[0]], // check space
		["\\limits", "\\limits"],
		["\\liminf", oNamesOfLiterals.functionLiteral[0]], // check space
		["\\lim", oNamesOfLiterals.functionLiteral[0]],
		["\\lim", oNamesOfLiterals.functionLiteral[0]],
		["\\lhd",  oNamesOfLiterals.charLiteral[0], "⊲"],
		["\\lgroup", "opOpen", "⟮"],
		["\\lg", oNamesOfLiterals.functionLiteral[0]],
		["\\lfloor", "opOpen", "⌊"],
		["\\le",  oNamesOfLiterals.charLiteral[0], "≤"],
		["\\lesssim",  oNamesOfLiterals.charLiteral[0], "≲"],
		["\\lessgtr",  oNamesOfLiterals.charLiteral[0], "≶"],
		["\\lesseqqgtr",  oNamesOfLiterals.charLiteral[0], "⪋"],
		["\\lesseqgtr",  oNamesOfLiterals.charLiteral[0], "⋚"],
		["\\lessdot",  oNamesOfLiterals.charLiteral[0], "⋖"],
		["\\lessapprox",  oNamesOfLiterals.charLiteral[0], "⪅"],
		["\\leqslant",  oNamesOfLiterals.charLiteral[0], "⩽"],
		["\\leqq",  oNamesOfLiterals.charLiteral[0], "≦"],
		["\\leq",  oNamesOfLiterals.charLiteral[0], "≤"],
		["\\leftthreetimes",  oNamesOfLiterals.charLiteral[0], "⋋"],
		["\\leftrightsquigarrow",  oNamesOfLiterals.charLiteral[0], "↭"],
		["\\leftrightharpoons",  oNamesOfLiterals.charLiteral[0], "⇋"],
		["\\leftrightarrows",  oNamesOfLiterals.charLiteral[0], "⇆"],
		["\\leftrightarrow",  oNamesOfLiterals.charLiteral[0], "↔"],
		["\\leftleftarrows",  oNamesOfLiterals.charLiteral[0], "⇇"],
		["\\leftharpoondown",  oNamesOfLiterals.charLiteral[0], "↽"],
		["\\leftarrowtail",  oNamesOfLiterals.charLiteral[0], "↢"],
		["\\leftarrow",  oNamesOfLiterals.charLiteral[0], "←"],
		["\\left", "\\left"],
		["\\leadsto",  oNamesOfLiterals.charLiteral[0], "⇝"],
		["\\ldots",  oNamesOfLiterals.charLiteral[0], "…"],
		["\\ldotp",  oNamesOfLiterals.charLiteral[0], "."],
		["\\lceil", "opOpen", "⌈"],
		["\\lbrack", "opOpen", "["],
		["\\lbrace", "opOpen", "{"],
		["\\langle", "opOpen", "⟨"],
		["\\lang", "opOpen"],
		["\\land",  oNamesOfLiterals.charLiteral[0], "∧"],
		["\\lambda", oNamesOfLiterals.charLiteral[0], "λ"],
		["\\lambda", oNamesOfLiterals.charLiteral[0], "Λ"],
		["\\lambda",  oNamesOfLiterals.charLiteral[0], "𝜆"],
		["\\lVert", "∥", "opOpen/opClose"],
		["\\lBrace", "opOpen", "{["], //todo
		["\\ker", oNamesOfLiterals.functionLiteral[0]],
		["\\kappa", oNamesOfLiterals.charLiteral[0], "𝜅"], // check kappa
		["\\jmath", oNamesOfLiterals.charLiteral[0], "𝐽"],
		["\\jmath",  oNamesOfLiterals.charLiteral[0], "𝚥"],
		["\\jj", oNamesOfLiterals.charLiteral[0], "𝑗"],
		["\\j", oNamesOfLiterals.charLiteral[0], "𝐽𝑎𝑦"],
		["\\it", oNamesOfLiterals.mathFontLiteral[0], 1],
		["\\iota", oNamesOfLiterals.charLiteral[0], "ι"],
		["\\iota", oNamesOfLiterals.charLiteral[0], "Ι"],
		["\\intop", oNamesOfLiterals.functionLiteral[0]],
		["\\intercal",  oNamesOfLiterals.charLiteral[0], "⊺"],
		["\\int", oNamesOfLiterals.functionLiteral[0]],
		["\\injlim", oNamesOfLiterals.functionLiteral[0]], // todo Check space
		["\\infty",  oNamesOfLiterals.charLiteral[0], "∞"],
		["\\infinite", oNamesOfLiterals.functionLiteral[0]],
		["\\inf", oNamesOfLiterals.functionLiteral[0]],
		["\\in",  oNamesOfLiterals.charLiteral[0], "∈"],
		["\\implies",  oNamesOfLiterals.charLiteral[0], "⟹"],
		["\\impliedby",  oNamesOfLiterals.charLiteral[0], "⟸"],
		["\\imath", oNamesOfLiterals.charLiteral[0], "𝚤"],
		["\\iint", oNamesOfLiterals.functionLiteral[0]],
		["\\iiint", oNamesOfLiterals.functionLiteral[0]],
		["\\iiiint", oNamesOfLiterals.functionLiteral[0]],
		["\\ii", oNamesOfLiterals.charLiteral[0], "𝑖"],
		["\\iff",  oNamesOfLiterals.charLiteral[0], "⟺"],
		["\\idotsint", oNamesOfLiterals.functionLiteral[0]],
		["\\idotsint",  oNamesOfLiterals.charLiteral[0], "∫⋯∫"],
		["\\hslash",  oNamesOfLiterals.charLiteral[0], "ℏ"],
		["\\hslash",  oNamesOfLiterals.charLiteral[0], "ℏ"],
		["\\hookrightarrow",  oNamesOfLiterals.charLiteral[0], "↪"],
		["\\hookleftarrow",  oNamesOfLiterals.charLiteral[0], "↩"],
		["\\hom", oNamesOfLiterals.functionLiteral[0]],
		["\\heartsuit",  oNamesOfLiterals.charLiteral[0], "♡"],
		["\\hbar", oNamesOfLiterals.charLiteral[0], "ℏ"],
		["\\hat", oNamesOfLiterals.accentLiteral[0], 770],
		["\\gtrsim",  oNamesOfLiterals.charLiteral[0], "≳"],
		["\\gtrless",  oNamesOfLiterals.charLiteral[0], "≷"],
		["\\gtreqqless",  oNamesOfLiterals.charLiteral[0], "⪌"],
		["\\gtreqless",  oNamesOfLiterals.charLiteral[0], "⋛"],
		["\\gtrdot",  oNamesOfLiterals.charLiteral[0], "⋗"],
		["\\gtrapprox",  oNamesOfLiterals.charLiteral[0], "⪆"],
		["\\gt",  oNamesOfLiterals.charLiteral[0], ">"],
		["\\grave", oNamesOfLiterals.accentLiteral[0], 768],
		["\\gnsim",  oNamesOfLiterals.charLiteral[0], "⋧"],
		["\\gneqq",  oNamesOfLiterals.charLiteral[0], "≩"],
		["\\gneq",  oNamesOfLiterals.charLiteral[0], "⪈"],
		["\\gimel", oNamesOfLiterals.charLiteral[0], "ℷ"],
		["\\gimel",  oNamesOfLiterals.charLiteral[0], "ℷ"],
		["\\gggtr",  oNamesOfLiterals.charLiteral[0], "⋙"],
		["\\ggg",  oNamesOfLiterals.charLiteral[0], "⋙"],
		["\\gg",  oNamesOfLiterals.charLiteral[0], "≫"],
		["\\gets",  oNamesOfLiterals.charLiteral[0], "←"],
		["\\geqslant",  oNamesOfLiterals.charLiteral[0], "⩾"],
		["\\geqq",  oNamesOfLiterals.charLiteral[0], "≧"],
		["\\geq",  oNamesOfLiterals.charLiteral[0], "≥"],
		["\\ge",  oNamesOfLiterals.charLiteral[0], "≥"],
		["\\gcd", oNamesOfLiterals.functionLiteral[0]],
		["\\gamma",  oNamesOfLiterals.charLiteral[0], "γ"],
		["\\frown",  oNamesOfLiterals.charLiteral[0], "⌢"],
		["\\fraktur", oNamesOfLiterals.mathFontLiteral[0], 9],
		["\\frak", oNamesOfLiterals.mathFontLiteral[0], 9],
		["\\frac"],
		["\\forall",  oNamesOfLiterals.charLiteral[0], "∀"],
		["\\flat",  oNamesOfLiterals.charLiteral[0], "♭"],
		["\\fallingdotseq",  oNamesOfLiterals.charLiteral[0], "≒"],
		["\\exp", oNamesOfLiterals.functionLiteral[0]],
		["\\exists",  oNamesOfLiterals.charLiteral[0], "∃"],
		["\\eth",  oNamesOfLiterals.charLiteral[0], "ð"],
		["\\eta",  oNamesOfLiterals.charLiteral[0], "η"],
		["\\equiv",  oNamesOfLiterals.charLiteral[0], "≡"],
		["\\eqslantless",  oNamesOfLiterals.charLiteral[0], "⪕"],
		["\\eqslantgtr",  oNamesOfLiterals.charLiteral[0], "⪖"],
		["\\eqsim",  oNamesOfLiterals.charLiteral[0], "≂"],
		["\\eqcirc",  oNamesOfLiterals.charLiteral[0], "≖"],
		["\\epsilon", oNamesOfLiterals.charLiteral[0], "ϵ"],
		["\\end{"],
		["\\emptyset",  oNamesOfLiterals.charLiteral[0], "∅"],
		["\\ell", oNamesOfLiterals.charLiteral[0], "ℓ"],
		["\\ee", oNamesOfLiterals.charLiteral[0], "𝑒"],
		["\\downharpoonright",  oNamesOfLiterals.charLiteral[0], "⇂"],
		["\\downharpoonleft",  oNamesOfLiterals.charLiteral[0], "⇃"],
		["\\downdownarrows",  oNamesOfLiterals.charLiteral[0], "⇊"],
		["\\downarrow",  oNamesOfLiterals.charLiteral[0], "↓"],
		["\\doublecup",  oNamesOfLiterals.charLiteral[0], "⋓"],
		["\\doublecap",  oNamesOfLiterals.charLiteral[0], "⋒"],
		["\\doublebarwedge",  oNamesOfLiterals.charLiteral[0], "⩞"],
		["\\double", oNamesOfLiterals.mathFontLiteral[0], 12],
		["\\dotso",  oNamesOfLiterals.charLiteral[0], "…"], //TODO
		["\\dotsm",  oNamesOfLiterals.charLiteral[0], "⋯"], //TODO
		["\\dotsi",  oNamesOfLiterals.charLiteral[0], "⋯"], //TODO
		["\\dotsc",  oNamesOfLiterals.charLiteral[0], "…"],
		["\\dotsb",  oNamesOfLiterals.charLiteral[0], "⋯"], //Binary TODO https://www.tutorialspoint.com/tex_commands/dotsb.htm
		["\\dots",  oNamesOfLiterals.charLiteral[0], "…"],
		["\\dotplus",  oNamesOfLiterals.charLiteral[0], "∔"],
		["\\doteq",  oNamesOfLiterals.charLiteral[0], "≐"],
		["\\dot", oNamesOfLiterals.accentLiteral[0], 775],
		["\\divideontimes",  oNamesOfLiterals.charLiteral[0], "⋇"],
		["\\div",  oNamesOfLiterals.charLiteral[0], "÷"],
		["\\dim", oNamesOfLiterals.functionLiteral[0]],
		["\\digamma",  oNamesOfLiterals.charLiteral[0], "ϝ"],
		["\\diamondsuit",  oNamesOfLiterals.charLiteral[0], "♢"],
		["\\diamond",  oNamesOfLiterals.charLiteral[0], "⋄"],
		["\\diagup",  oNamesOfLiterals.charLiteral[0], "╱"],
		["\\diagdown",  oNamesOfLiterals.charLiteral[0], "╲"],
		["\\dfrac{"],
		["\\det", oNamesOfLiterals.functionLiteral[0]],
		["\\delta",  oNamesOfLiterals.charLiteral[0], "δ"],
		["\\deg", oNamesOfLiterals.functionLiteral[0]],
		["\\ddots",  oNamesOfLiterals.charLiteral[0], "⋱"],
		["\\ddot", oNamesOfLiterals.accentLiteral[0], 776],
		["\\ddagger",  oNamesOfLiterals.charLiteral[0], "‡"],
		["\\dd", oNamesOfLiterals.charLiteral[0], "𝑑"],
		["\\dashv",  oNamesOfLiterals.charLiteral[0], "⊣"],
		["\\dashrightarrow",  oNamesOfLiterals.charLiteral[0], "⇢"],
		["\\dashleftarrow",  oNamesOfLiterals.charLiteral[0], "⇠"],
		["\\daleth", oNamesOfLiterals.charLiteral[0], "ℸ"],
		["\\daleth",  oNamesOfLiterals.charLiteral[0], "ℸ"],
		["\\dalet", oNamesOfLiterals.charLiteral[0], "ℸ"],
		["\\dagger",  oNamesOfLiterals.charLiteral[0], "†"],
		["\\curvearrowright",  oNamesOfLiterals.charLiteral[0], "↷"],
		["\\curvearrowleft",  oNamesOfLiterals.charLiteral[0], "↶"],
		["\\curlywedge",  oNamesOfLiterals.charLiteral[0], "⋏"],
		["\\curlyvee",  oNamesOfLiterals.charLiteral[0], "⋎"],
		["\\curlyeqsucc",  oNamesOfLiterals.charLiteral[0], "⋟"],
		["\\curlyeqprec",  oNamesOfLiterals.charLiteral[0], "⋞"],
		["\\cup",  oNamesOfLiterals.charLiteral[0], "∪"],
		["\\csc", oNamesOfLiterals.functionLiteral[0]],
		["\\coth", oNamesOfLiterals.functionLiteral[0]],
		["\\cot", oNamesOfLiterals.functionLiteral[0]],
		["\\cosh", oNamesOfLiterals.functionLiteral[0]],
		["\\cos", oNamesOfLiterals.functionLiteral[0]],
		["\\coprod", oNamesOfLiterals.functionLiteral[0]],
		["\\cong",  oNamesOfLiterals.charLiteral[0], "≅"],
		["\\complement",  oNamesOfLiterals.charLiteral[0], "∁"],
		["\\colon",  oNamesOfLiterals.charLiteral[0], ":"],
		["\\clubsuit",  oNamesOfLiterals.charLiteral[0], "♣"],
		["\\circleddash",  oNamesOfLiterals.charLiteral[0], "⊝"],
		["\\circledcirc",  oNamesOfLiterals.charLiteral[0], "⊚"],
		["\\circledast",  oNamesOfLiterals.charLiteral[0], "⊛"],
		["\\circledS",  oNamesOfLiterals.charLiteral[0], "Ⓢ"],
		["\\circledR",  oNamesOfLiterals.charLiteral[0], "®"],
		["\\circlearrowright",  oNamesOfLiterals.charLiteral[0], "↻"],
		["\\circlearrowleft",  oNamesOfLiterals.charLiteral[0], "↺"],
		["\\circeq",  oNamesOfLiterals.charLiteral[0], "≗"],
		["\\circ",  oNamesOfLiterals.charLiteral[0], "∘"],
		["\\chi", oNamesOfLiterals.charLiteral[0], "χ"],
		["\\checkmark",  oNamesOfLiterals.charLiteral[0], "✓"],
		["\\check", oNamesOfLiterals.accentLiteral[0], 780],
		["\\cfrac{"],// https://www.tutorialspoint.com/tex_commands/cfrac.htm
		["\\centerdot",  oNamesOfLiterals.charLiteral[0], "⋅"],
		["\\cdots",  oNamesOfLiterals.charLiteral[0], "⋯"],
		["\\cdot",  oNamesOfLiterals.charLiteral[0], "⋅"],
		["\\cap",  oNamesOfLiterals.charLiteral[0], "∩"],
		["\\bumpeq",  oNamesOfLiterals.charLiteral[0], "≏"],
		["\\bullet",  oNamesOfLiterals.charLiteral[0], "∙"],
		["\\breve", oNamesOfLiterals.accentLiteral[0], 774],
		["\\boxtimes",  oNamesOfLiterals.charLiteral[0], "⊠"],
		["\\boxplus",  oNamesOfLiterals.charLiteral[0], "⊞"],
		["\\boxminus",  oNamesOfLiterals.charLiteral[0], "⊟"],
		["\\boxed", "\\boxed"], //TODO
		["\\boxdot",  oNamesOfLiterals.charLiteral[0], "⊡"],
		["\\box"],
		["\\bowtie",  oNamesOfLiterals.charLiteral[0], "⋈"],
		["\\bot",  oNamesOfLiterals.charLiteral[0], "⊥"],
		["\\blacktriangleright",  oNamesOfLiterals.charLiteral[0], "▶"],
		["\\blacktriangleleft",  oNamesOfLiterals.charLiteral[0], "◀"],
		["\\blacktriangledown",  oNamesOfLiterals.charLiteral[0], "▼"],
		["\\blacktriangle",  oNamesOfLiterals.charLiteral[0], "▲"],
		["\\blacksquare",  oNamesOfLiterals.charLiteral[0], "■"],
		["\\blacklozenge",  oNamesOfLiterals.charLiteral[0], "⧫"],
		["\\binom"],
		["\\bigwedge", oNamesOfLiterals.functionLiteral[0]],
		["\\bigwedge",  oNamesOfLiterals.charLiteral[0], "⋀"],
		["\\bigvee", oNamesOfLiterals.functionLiteral[0]],
		["\\bigvee",  oNamesOfLiterals.charLiteral[0], "⋁"],
		["\\biguplus", oNamesOfLiterals.functionLiteral[0]],
		["\\biguplus",  oNamesOfLiterals.charLiteral[0], "⨄"],
		["\\bigtriangleup",  oNamesOfLiterals.charLiteral[0], "△"],
		["\\bigtriangledown",  oNamesOfLiterals.charLiteral[0], "▽"],
		["\\bigstar",  oNamesOfLiterals.charLiteral[0], "★"],
		["\\bigsqcup", oNamesOfLiterals.functionLiteral[0]],
		["\\bigsqcup",  oNamesOfLiterals.charLiteral[0], "⨆"],
		["\\bigotimes", oNamesOfLiterals.functionLiteral[0]],
		["\\bigotimes",  oNamesOfLiterals.charLiteral[0], "⨂"],
		["\\bigoplus", oNamesOfLiterals.functionLiteral[0]],
		["\\bigoplus",  oNamesOfLiterals.charLiteral[0], "⨁"],
		["\\bigodot", oNamesOfLiterals.functionLiteral[0]],
		["\\bigodot",  oNamesOfLiterals.charLiteral[0], "⨀"],
		["\\bigcup", oNamesOfLiterals.functionLiteral[0]],
		["\\bigcup",  oNamesOfLiterals.charLiteral[0], "⋃"],
		["\\bigcirc",  oNamesOfLiterals.charLiteral[0], "◯"],
		["\\bigcap", oNamesOfLiterals.functionLiteral[0]],
		["\\bigcap",  oNamesOfLiterals.charLiteral[0], "⋂"],
		["\\beth", oNamesOfLiterals.charLiteral[0], "ℶ"],
		["\\beth",  oNamesOfLiterals.charLiteral[0], "ℶ"],
		["\\beta",  oNamesOfLiterals.charLiteral[0], "β"],
		["\\bet", oNamesOfLiterals.charLiteral[0], "ℶ"],
		["\\begin{"],
		["\\because", oNamesOfLiterals.charLiteral[0], "∵"],
		["\\barwedge", oNamesOfLiterals.charLiteral[0], "⊼"],
		["\\bar", oNamesOfLiterals.accentLiteral[0], 772],
		["\\backslash", "opClose", "\\"],
		["\\backsimeq", oNamesOfLiterals.charLiteral[0], "⋍"],
		["\\backsim", oNamesOfLiterals.charLiteral[0], "∽"],
		["\\backprime", oNamesOfLiterals.charLiteral[0], "‵"],
		["\\backepsilon", oNamesOfLiterals.charLiteral[0], "∍"],
		["\\asymp",  oNamesOfLiterals.charLiteral[0], "≍"],
		["\\ast",  oNamesOfLiterals.charLiteral[0], "∗"],
		["\\arg", oNamesOfLiterals.functionLiteral[0]],
		["\\arctan", oNamesOfLiterals.functionLiteral[0]],
		["\\arcsin", oNamesOfLiterals.functionLiteral[0]],
		["\\arcsec", oNamesOfLiterals.functionLiteral[0]],
		["\\arccsc", oNamesOfLiterals.functionLiteral[0]],
		["\\arccot", oNamesOfLiterals.functionLiteral[0]],
		["\\arccos", oNamesOfLiterals.functionLiteral[0]],
		["\\approxeq", "≊",  oNamesOfLiterals.charLiteral[0]],
		["\\approx",  oNamesOfLiterals.charLiteral[0], "≈"],
		["\\angle",  oNamesOfLiterals.charLiteral[0], "∠"],
		["\\and",  oNamesOfLiterals.charLiteral[0], "&"],
		["\\amalg",  oNamesOfLiterals.charLiteral[0], "⨿"],
		["\\alpha", oNamesOfLiterals.charLiteral[0], "α"],
		["\\aleph", oNamesOfLiterals.charLiteral[0], "ℵ"],
		["\\acute", oNamesOfLiterals.accentLiteral[0], 769],
		["\\Zeta", oNamesOfLiterals.charLiteral[0], "Ζ"],
		["\\Xi", oNamesOfLiterals.charLiteral[0], "Ξ"],
		["\\Upsilon", oNamesOfLiterals.charLiteral[0], "𝛶"],
		["\\Updownarrow",  oNamesOfLiterals.charLiteral[0], "⇕"],
		["\\Uparrow",  oNamesOfLiterals.charLiteral[0], "⇑"],
		["\\Theta",  oNamesOfLiterals.charLiteral[0], "Θ"],
		["\\Tau", oNamesOfLiterals.charLiteral[0], "T"],
		["\\Supset",  oNamesOfLiterals.charLiteral[0], "⋑"],
		["\\Subset",  oNamesOfLiterals.charLiteral[0], "⋐"],
		["\\Sigma", oNamesOfLiterals.charLiteral[0], "Σ"],
		["\\S",  oNamesOfLiterals.charLiteral[0], "§"],
		["\\Rsh",  oNamesOfLiterals.charLiteral[0], "↱"],
		["\\Rrightarrow",  oNamesOfLiterals.charLiteral[0], "⇛"],
		["\\Rightarrow",  oNamesOfLiterals.charLiteral[0], "⇒"],
		["\\Rho", oNamesOfLiterals.charLiteral[0], "Ρ"],
		["\\Re", oNamesOfLiterals.charLiteral[0], "ℜ"],
		["\\Psi ", oNamesOfLiterals.charLiteral[0], "Ψ"],
		["\\Pr", oNamesOfLiterals.functionLiteral[0]],
		["\\Pi", oNamesOfLiterals.charLiteral[0], "Π"],
		["\\Phi",  oNamesOfLiterals.charLiteral[0], "Φ"],
		["\\Overrightarrow", "Overrightarrow"],
		["\\Omicron", oNamesOfLiterals.charLiteral[0], "Ο"],
		["\\Omega", oNamesOfLiterals.charLiteral[0], "Ω"],
		["\\O", oNamesOfLiterals.charLiteral[0], "Ο"],
		["\\Nu", oNamesOfLiterals.charLiteral[0], "Ν"],
		["\\Mu", oNamesOfLiterals.charLiteral[0], "Μ"],
		["\\Lsh",  oNamesOfLiterals.charLiteral[0], "↰"],
		["\\Longrightarrow",  oNamesOfLiterals.charLiteral[0], "⟹"],
		["\\Longleftrightarrow",  oNamesOfLiterals.charLiteral[0], "⟺"],
		["\\Longleftarrow",  oNamesOfLiterals.charLiteral[0], "⟸"],
		["\\Lleftarrow",  oNamesOfLiterals.charLiteral[0], "⇚"],
		["\\Leftrightarrow",  oNamesOfLiterals.charLiteral[0], "⇔"],
		["\\Leftarrow",  oNamesOfLiterals.charLiteral[0], "⇐"],
		["\\Lambda",  oNamesOfLiterals.charLiteral[0], "Λ"],
		["\\Kappa",oNamesOfLiterals.charLiteral[0], "Κ"], // check kappa
		["\\Join",  oNamesOfLiterals.charLiteral[0], "⋈"],
		["\\Im", oNamesOfLiterals.charLiteral[0], "𝕴"],
		["\\Gamma",  oNamesOfLiterals.charLiteral[0], "Γ"],
		["\\Game",  oNamesOfLiterals.charLiteral[0], "⅁"],
		["\\G",  oNamesOfLiterals.charLiteral[0], "Γ"],
		["\\Finv",  oNamesOfLiterals.charLiteral[0], "Ⅎ"],
		["\\Eta",  oNamesOfLiterals.charLiteral[0], "Η"],
		["\\Epsilon", oNamesOfLiterals.charLiteral[0], "Ε"],
		["\\Downarrow",  oNamesOfLiterals.charLiteral[0], "⇓"],
		["\\Doteq",  oNamesOfLiterals.charLiteral[0], "≑"],
		["\\Diamond",  oNamesOfLiterals.charLiteral[0], "◊"],
		["\\Delta",  oNamesOfLiterals.charLiteral[0], "Δ"],
		["\\Dd", oNamesOfLiterals.charLiteral[0], "𝐷"],
		["\\Cup",  oNamesOfLiterals.charLiteral[0], "⋓"],
		["\\Chi", oNamesOfLiterals.charLiteral[0], "X"],
		["\\Cap",  oNamesOfLiterals.charLiteral[0], "⋒"],
		["\\Bumpeq",  oNamesOfLiterals.charLiteral[0], "≎"],
		["\\Box",  oNamesOfLiterals.charLiteral[0], "□"],
		["\\Beta",  oNamesOfLiterals.charLiteral[0], "Β"],
		["\\Alpha", oNamesOfLiterals.charLiteral[0], "A"],

		["\\:", 8287, oNamesOfLiterals.spaceLiteral[0]], //	4/18 em
		["\\,", 8198, oNamesOfLiterals.spaceLiteral[0]], // 1/6 em
		[",", oNamesOfLiterals.mathOperatorLiteral[0]], //check type
		["}"],
		["_"],
		["^"],
		["+", oNamesOfLiterals.mathOperatorLiteral[0]],
		["-", oNamesOfLiterals.mathOperatorLiteral[0]],
		["*", oNamesOfLiterals.mathOperatorLiteral[0]],
		["=", oNamesOfLiterals.mathOperatorLiteral[0]],
		["!", oNamesOfLiterals.mathOperatorLiteral[0]],
		["&"],
		["."],
		["'", oNamesOfLiterals.accentLiteral[0]],
		["''", oNamesOfLiterals.accentLiteral[0]],
		["(", "opOpen"],
		[")", "opClose"],
		["[", "opOpen"],
		["]", "opClose"],
		["\\{", "opOpen"],
		["\\}", "opClose"],
		["⟨", "opOpen"],
		["⟩", "opClose"],
		["|", "opOpen/opClose"],
		["\\|", "opOpen/opClose"],["/", "opOpen"],
		["{"],
		["}"],

		//Delimiters
		// ["\\\v{", "\v{"],
		// ["\\H{", "H{"],
		// ["\\\r{", "\r{"],
		// ['\\"{', '"{'],
		// ["\\.{", ".{"],
		// ["\\\\u{", "\\u{"],
		// ["\\={", "={"],
		// ["\\~{", "~{"],
		// ["\\^{", "^{"],
		// ["\\`{", "`{"],
		// ["\\'{", "'{"],
		// //Accent functions inside \text{…}
		//["\\array"], //TODO//Bigg https://www.tutorialspoint.com/tex_commands/bigg.htm
		// "\\bf" as \\mathbf// \boldsymbol \boldsymbol - applies to nearly all symbols, not just letters and numbers. //TODO//buildrel  https://www.tutorialspoint.com/tex_commands/buildrel.htm
		//\brack - creates a bracketed structure.
		//brace //TODO https://www.tutorialspoint.com/tex_commands/brace.htm//cal  // CALIGRPAHIC https://www.tutorialspoint.com/tex_commands/cal.htm// \cases  https://www.tutorialspoint.com/tex_commands/cases.htm//Chose https://www.tutorialspoint.com/tex_commands/choose.htm//["\\ddddot", "...",  oNamesOfLiterals.charLiteral[0]],
		//["\\dddot", "...",  oNamesOfLiterals.charLiteral[0]],//dbinom TODO//def
		//{ \DeclareMathOperator #1 #2  } //https://www.tutorialspoint.com/tex_commands/declare_math_operator.htm// nolimits_ TODO
		// \det\limits_{\rm sub} TODO// displaystyle
		// displaylines TODO//eqalignno todo - Used for equation alignment with optionally numbered (tagged) lines.
		//eqalign" TODO align//\fbox todo Used to put a box around argument; argument is in text mode.//genfrac todo https://www.tutorialspoint.com/tex_commands/genfrac.htm//["\\gvertneqq",  oNamesOfLiterals.charLiteral[0], ""],//todo \hline - Used to draw horizontal line in matrix
		//todo \hdashline - Used to draw horizontal dash line in matrix
		//todo hbox https://www.tutorialspoint.com/tex_commands/hbox.htm//todo \hfil - Used to set horizontal alignment in matrices and arrays.//todo \Huge//todo \huge//["\\kern" , "Space"], // todo//TODO Large
		//TODO large
		//TODO LARGE//llap  todo//MathBin todo//mathinner todo//mathring todo
		//mathrel todo
		//mathpunct todo
		//mathord todo
		//mathhop todo//\mathstrut - todo Used to achieve more uniform appearance in adjacent formulas as an invisible box whose width is zero.//mbox todo//mkern space todo//mspace todo
		//mskip todo//negthickspace   space todo
		//negmedspace  space todo
		//negthinspace space todo//newenvironment todo
		//newcommand todo
		//operatorname//not todo \not\gt === \ngtr
		//normalsize
		//\nolimits
		// /nobreakspace//mathchoice todo//overwithdelims
		//["\\overset", , "Arrow"],\overset - Used to overset argument #1 (in scriptstyle) over argument #2.{ \overset #1 #2}//["\\pmb", "", ""], todo BOLD//rlap todo//scriptscriptstyle  todo//setminu//shoveright
		//shoveleft//small todo
		//skew todo//space//stackrel//strut todo//substack todo//tbinom//texttt
		//textsf
		//textrm
		//textit
		//textbf//thinspace//Tiny
		//tiny//tt//["\\unicode", "unicode"],
		//["\\underset", "underset"],//uproot//["\\hspace", , oNamesOfLiterals.spaceLiteral[0]], //ex em
		//["\\enspace", 8192, oNamesOfLiterals.spaceLiteral[0]], // EN QUAD 1 en (= 1/2 em)
		// https://latex-tutorial.com/latex-space/
		// https://jkorpela.fi/chars/spaces.html
		//Spaces
		//	\Bbb as mathbb
		//	\atop - Command to create fractions without horizontal fraction bar
		// sub-formula2	Denominator
		// delimiter2	Displayed after the fraction
		// delimiter1	Displayed before the fraction
		// sub-formula1	Displayed as Numerator
		// \atopwithdelims - Command to create fractions without fraction bar//["\\!", "", oNamesOfLiterals.spaceLiteral[0]], TODO realize negative space
		//Text-Spaces ==========//["\\;", "", oNamesOfLiterals.spaceLiteral[0]],
		//["\\>", "", oNamesOfLiterals.spaceLiteral[0]],//Functions// Integrals// todo trig To symbol
		//["\\abovewithdelims", "", ""] //todo \above command gives control over thickness of horizontal fraction bar.
		//["\\above", "", ""] //Fraction
		//["\\", "", ""], //TODO
	];
	const UnicodeTokensRule = [
		[
			function (str) {
				return str[0];
			},
			oNamesOfLiterals.otherLiteral[0],
		],
		[
			function (str) {
				let literal = str[0];
				if (/^[a-zA-Z]/.test(literal)) {
					return literal;
				}
			},
			oNamesOfLiterals.charLiteral[0],
		],
		[
			function (str) {
				let literal = str[0];
				if (/\d/.test(literal)) {
					return literal;
				}
			},
			oNamesOfLiterals.numberLiteral[0],
		],
		[
			function (str) {
				const code = GetFixedCharCodeAt(str[0]);
				if (code >= 768 && code <= 879) {
					return str[0];
				}
			},
			oNamesOfLiterals.diacriticLiteral[0],
		],
		[
			function (str) {
				if (GetLaTeXMathFont.includes(str[0])) {
					return str[0];
				}
			},
			oNamesOfLiterals.otherLiteral[0],
		],

		["&"],
		["@"],
		["\\array("],

		["∑", oNamesOfLiterals.opNaryLiteral[0]],
		["⅀", oNamesOfLiterals.opNaryLiteral[0]],
		["⨊", oNamesOfLiterals.opNaryLiteral[0]],
		["∏", oNamesOfLiterals.opNaryLiteral[0]],
		["∐", oNamesOfLiterals.opNaryLiteral[0]],
		["⨋", oNamesOfLiterals.opNaryLiteral[0]],
		["∫", oNamesOfLiterals.opNaryLiteral[0]],
		["∬", oNamesOfLiterals.opNaryLiteral[0]],
		["∭", oNamesOfLiterals.opNaryLiteral[0]],
		["⨌", oNamesOfLiterals.opNaryLiteral[0]],
		["∮", oNamesOfLiterals.opNaryLiteral[0]],
		["∯", oNamesOfLiterals.opNaryLiteral[0]],
		["∰", oNamesOfLiterals.opNaryLiteral[0]],
		["∱", oNamesOfLiterals.opNaryLiteral[0]],
		["⨑", oNamesOfLiterals.opNaryLiteral[0]],
		["∲", oNamesOfLiterals.opNaryLiteral[0]],
		["∳", oNamesOfLiterals.opNaryLiteral[0]],
		["⨍", oNamesOfLiterals.opNaryLiteral[0]],
		["⨎", oNamesOfLiterals.opNaryLiteral[0]],
		["⨏", oNamesOfLiterals.opNaryLiteral[0]],
		["⨕", oNamesOfLiterals.opNaryLiteral[0]],
		["⨖", oNamesOfLiterals.opNaryLiteral[0]],
		["⨗", oNamesOfLiterals.opNaryLiteral[0]],
		["⨘", oNamesOfLiterals.opNaryLiteral[0]],
		["⨙", oNamesOfLiterals.opNaryLiteral[0]],
		["⨚", oNamesOfLiterals.opNaryLiteral[0]],
		["⨛", oNamesOfLiterals.opNaryLiteral[0]],
		["⨜", oNamesOfLiterals.opNaryLiteral[0]],
		["⨒", oNamesOfLiterals.opNaryLiteral[0]],
		["⨓", oNamesOfLiterals.opNaryLiteral[0]],
		["⨔", oNamesOfLiterals.opNaryLiteral[0]],
		["⋀", oNamesOfLiterals.opNaryLiteral[0]],
		["⋁", oNamesOfLiterals.opNaryLiteral[0]],
		["⋂", oNamesOfLiterals.opNaryLiteral[0]],
		["⋃", oNamesOfLiterals.opNaryLiteral[0]],
		["⨃", oNamesOfLiterals.opNaryLiteral[0]],
		["⨄", oNamesOfLiterals.opNaryLiteral[0]],
		["⨅", oNamesOfLiterals.opNaryLiteral[0]],
		["⨆", oNamesOfLiterals.opNaryLiteral[0]],
		["⨀", oNamesOfLiterals.opNaryLiteral[0]],
		["⨁", oNamesOfLiterals.opNaryLiteral[0]],
		["⨂", oNamesOfLiterals.opNaryLiteral[0]],
		["⨉", oNamesOfLiterals.opNaryLiteral[0]],
		["⫿", oNamesOfLiterals.opNaryLiteral[0]],

		[")", oNamesOfLiterals.opCloseBracket[0]],
		["]", oNamesOfLiterals.opCloseBracket[0]],
		["}", oNamesOfLiterals.opCloseBracket[0]],
		["〉", oNamesOfLiterals.opCloseBracket[0]],
		["⟩", oNamesOfLiterals.opCloseBracket[0]],
		["〗", oNamesOfLiterals.opCloseBracket[0]],
		["⌉", oNamesOfLiterals.opCloseBracket[0]],
		["⌋", oNamesOfLiterals.opCloseBracket[0]],

		["(", oNamesOfLiterals.opOpenBracket[0]],
		["[", oNamesOfLiterals.opOpenBracket[0]],
		["{", oNamesOfLiterals.opOpenBracket[0]],
		["〈", oNamesOfLiterals.opOpenBracket[0]],
		["⟨", oNamesOfLiterals.opOpenBracket[0]],
		["〖", oNamesOfLiterals.opOpenBracket[0]],
		["⌈", oNamesOfLiterals.opOpenBracket[0]],
		["⌊", oNamesOfLiterals.opOpenBracket[0]],

		["├"],
		["┤"],
		["┬"],
		["┴"],

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
		["ⁱ", oNamesOfLiterals.specialScriptCharLiteral[0]],
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
		["▁"],
		["▭"],
		["□"],
		["!"],
		["▒"],
		["^"],
		["_"],

		["×", oNamesOfLiterals.operatorLiteral[0]],
		["⋅", oNamesOfLiterals.operatorLiteral[0]],
		["∈", oNamesOfLiterals.operatorLiteral[0]],
		["∋", oNamesOfLiterals.operatorLiteral[0]],
		["∼", oNamesOfLiterals.operatorLiteral[0]],
		["≃", oNamesOfLiterals.operatorLiteral[0]],
		["≅", oNamesOfLiterals.operatorLiteral[0]],
		["≈", oNamesOfLiterals.operatorLiteral[0]],
		["≍", oNamesOfLiterals.operatorLiteral[0]],
		["≡", oNamesOfLiterals.operatorLiteral[0]],
		["≤", oNamesOfLiterals.operatorLiteral[0]],
		["≥", oNamesOfLiterals.operatorLiteral[0]],
		["≶", oNamesOfLiterals.operatorLiteral[0]],
		["≷", oNamesOfLiterals.operatorLiteral[0]],
		["≽", oNamesOfLiterals.operatorLiteral[0]],
		["≺", oNamesOfLiterals.operatorLiteral[0]],
		["≻", oNamesOfLiterals.operatorLiteral[0]],
		["≼", oNamesOfLiterals.operatorLiteral[0]],
		["⊂", oNamesOfLiterals.operatorLiteral[0]],
		["⊃", oNamesOfLiterals.operatorLiteral[0]],
		["⊆", oNamesOfLiterals.operatorLiteral[0]],
		["⊇", oNamesOfLiterals.operatorLiteral[0]],
		["⊑", oNamesOfLiterals.operatorLiteral[0]],
		["⊒", oNamesOfLiterals.operatorLiteral[0]],
		["+", oNamesOfLiterals.operatorLiteral[0]],
		["-", oNamesOfLiterals.operatorLiteral[0]],
		["=", oNamesOfLiterals.operatorLiteral[0]],
		["*", oNamesOfLiterals.operatorLiteral[0]],
		["∃", oNamesOfLiterals.operatorLiteral[0]],
		["∀", oNamesOfLiterals.operatorLiteral[0]],
		["¬", oNamesOfLiterals.operatorLiteral[0]],
		["∧", oNamesOfLiterals.operatorLiteral[0]],
		["∨", oNamesOfLiterals.operatorLiteral[0]],
		["⇒", oNamesOfLiterals.operatorLiteral[0]],
		["⇔", oNamesOfLiterals.operatorLiteral[0]],
		["⊕", oNamesOfLiterals.operatorLiteral[0]],
		["⊤", oNamesOfLiterals.operatorLiteral[0]],
		["⊥", oNamesOfLiterals.operatorLiteral[0]],
		["⊢", oNamesOfLiterals.operatorLiteral[0]],
		["⨯", oNamesOfLiterals.operatorLiteral[0]],
		["⨝", oNamesOfLiterals.operatorLiteral[0]],
		["⟕", oNamesOfLiterals.operatorLiteral[0]],
		["⟖", oNamesOfLiterals.operatorLiteral[0]],
		["⟗", oNamesOfLiterals.operatorLiteral[0]],
		["⋉", oNamesOfLiterals.operatorLiteral[0]],
		["⋊", oNamesOfLiterals.operatorLiteral[0]],
		["▷", oNamesOfLiterals.operatorLiteral[0]],
		["÷", oNamesOfLiterals.operatorLiteral[0]],
		["∞", oNamesOfLiterals.operatorLiteral[0]],
		['←', oNamesOfLiterals.operatorLiteral[0]],
		['→', oNamesOfLiterals.operatorLiteral[0]],
		['↔', oNamesOfLiterals.operatorLiteral[0]],
		['⇐', oNamesOfLiterals.operatorLiteral[0]],
		['⇒', oNamesOfLiterals.operatorLiteral[0]],
		['⇔', oNamesOfLiterals.operatorLiteral[0]],
		['↩', oNamesOfLiterals.operatorLiteral[0]],
		['↪', oNamesOfLiterals.operatorLiteral[0]],
		['↼', oNamesOfLiterals.operatorLiteral[0]],
		['⇀', oNamesOfLiterals.operatorLiteral[0]],
		['↽', oNamesOfLiterals.operatorLiteral[0]],
		['⇁', oNamesOfLiterals.operatorLiteral[0]],
		['⟵', oNamesOfLiterals.operatorLiteral[0]],
		['⟶', oNamesOfLiterals.operatorLiteral[0]],
		['⟷', oNamesOfLiterals.operatorLiteral[0]],
		['⟸', oNamesOfLiterals.operatorLiteral[0]],
		['⟹', oNamesOfLiterals.operatorLiteral[0]],
		['⟺', oNamesOfLiterals.operatorLiteral[0]],
		['↦', oNamesOfLiterals.operatorLiteral[0]],
		['⊨', oNamesOfLiterals.operatorLiteral[0]],
		['⊢', oNamesOfLiterals.operatorLiteral[0]],
		["⊣", oNamesOfLiterals.operatorLiteral[0]],

		["⁡", oNamesOfLiterals.operatorLiteral[0]], // invisible function application
		["⁢", oNamesOfLiterals.operatorLiteral[0]], // invisible times
		["⁣", oNamesOfLiterals.operatorLiteral[0]], // invisible seperator
		["⁤", oNamesOfLiterals.operatorLiteral[0]], // invisible plus

		["-∞", oNamesOfLiterals.operatorLiteral[0]],
		["!!"],

		["^", oNamesOfLiterals.opBuildupLiteral[0]],
		["_", oNamesOfLiterals.opBuildupLiteral[0]],
		["√", oNamesOfLiterals.opBuildupLiteral[0]],
		["√(", oNamesOfLiterals.opBuildupLiteral[0]],
		["∛", oNamesOfLiterals.opBuildupLiteral[0]],
		["∜", oNamesOfLiterals.opBuildupLiteral[0]],
		["□", oNamesOfLiterals.opBuildupLiteral[0]],
		["/", oNamesOfLiterals.opBuildupLiteral[0]],
		["|", oNamesOfLiterals.opOpenCloseBracket[0]],
		["||", oNamesOfLiterals.opOpenCloseBracket[0]],

		["¦", oNamesOfLiterals.overLiteral[0]],
		["/", oNamesOfLiterals.overLiteral[0]],
		["∕", oNamesOfLiterals.overLiteral[0]],
		["⊘", oNamesOfLiterals.overLiteral[0]],
		["⒞", oNamesOfLiterals.overLiteral[0]],

		["⏜", oNamesOfLiterals.hBracketLiteral[0]],
		["⏝", oNamesOfLiterals.hBracketLiteral[0]],
		["⎴", oNamesOfLiterals.hBracketLiteral[0]],
		["⎵", oNamesOfLiterals.hBracketLiteral[0]],
		["⏞", oNamesOfLiterals.hBracketLiteral[0]],
		["⏟", oNamesOfLiterals.hBracketLiteral[0]],
		["⏠", oNamesOfLiterals.hBracketLiteral[0]],
		["⏡", oNamesOfLiterals.hBracketLiteral[0]],

		[",", "opDecimal"],
		[".", "opDecimal"],

		//word
		["...", oNamesOfLiterals.otherLiteral[0], "…"],
		[":=", oNamesOfLiterals.otherLiteral[0], "≔"],
		["~=", oNamesOfLiterals.otherLiteral[0], "≅"],
		["+-", oNamesOfLiterals.otherLiteral[0], "±"],
		["-+", oNamesOfLiterals.otherLiteral[0], "∓"],
		["<=", oNamesOfLiterals.otherLiteral[0], "≤"],
		[">=", oNamesOfLiterals.otherLiteral[0], "≥"],
		["<<", oNamesOfLiterals.otherLiteral[0], "≪"],
		[">>", oNamesOfLiterals.otherLiteral[0], "≫"],

		["&", "opArray"],
		["■", "opArray"],

		["\""],
		["\'"],
		["\\/", oNamesOfLiterals.overLiteral[0]],

		["​", oNamesOfLiterals.spaceLiteral[0]], // zero-width space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 1/18em space very very thin math space
		["  ", oNamesOfLiterals.spaceLiteral[0]], // 2/18em space  very thin math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 3/18em space thin math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 4/18em space medium math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 5/18em space thick math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 6/18em space very thick math space
		["  ", oNamesOfLiterals.spaceLiteral[0]],  // 7/18em space  very very thick math space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 9/18em space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // 1em space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // Digit-width space
		[" ", oNamesOfLiterals.spaceLiteral[0]], // Space-with space (non-breaking space)
		["\t", oNamesOfLiterals.spaceLiteral[0]], //Tab
	];
	const GetLaTeXMathFont = [
		'𝐀', '𝐴', '𝑨', '𝖠', '𝗔', '𝘈', '𝘼', '𝒜', '𝓐', '𝔄', '𝕬', '𝙰', '𝔸',
		'𝐁', '𝐵', '𝑩', '𝖡', '𝗕', '𝘉', '𝘽', 'ℬ', '𝓑', '𝔅', '𝕭', '𝙱', '𝔹',
		'𝐂', '𝐶', '𝑪', '𝖢', '𝗖', '𝘊', '𝘾', '𝒞', '𝓒', 'ℭ', '𝕮', '𝙲', 'ℂ',
		'𝐃', '𝐷', '𝑫', '𝖣', '𝗗', '𝘋', '𝘿', '𝒟', '𝓓', '𝔇', '𝕯', '𝙳', '𝔻',
		'𝐄', '𝐸', '𝑬', '𝖤', '𝗘', '𝘌', '𝙀', 'ℰ', '𝓔', '𝔈', '𝕰', '𝙴', '𝔼',
		'𝐅', '𝐹', '𝑭', '𝖥', '𝗙', '𝘍', '𝙁', 'ℱ', '𝓕', '𝔉', '𝕱', '𝙵', '𝔽',
		'𝐆', '𝐺', '𝑮', '𝖦', '𝗚', '𝘎', '𝙂', '𝒢', '𝓖', '𝔊', '𝕲', '𝙶', '𝔾',
		'𝐇', '𝐻', '𝑯', '𝖧', '𝗛', '𝘏', '𝙃', 'ℋ', '𝓗', 'ℌ', '𝕳', '𝙷', 'ℍ',
		'𝐈', '𝐼', '𝑰', '𝖨', '𝗜', '𝘐', '𝙄', 'ℐ', '𝓘', 'ℑ', '𝕴', '𝙸', '𝕀',
		'𝐉', '𝐽', '𝑱', '𝖩', '𝗝', '𝘑', '𝙅', '𝒥', '𝓙', '𝔍', '𝕵', '𝙹', '𝕁',
		'𝐊', '𝐾', '𝑲', '𝖪', '𝗞', '𝘒', '𝙆', '𝒦', '𝓚', '𝔎', '𝕶', '𝙺', '𝕂',
		'𝐋', '𝐿', '𝑳', '𝖫', '𝗟', '𝘓', '𝙇', 'ℒ', '𝓛', '𝔏', '𝕷', '𝙻', '𝕃',
		'𝐌', '𝑀', '𝑴', '𝖬', '𝗠', '𝘔', '𝙈', 'ℳ', '𝓜', '𝔐', '𝕸', '𝙼', '𝕄',
		'𝐍', '𝑁', '𝑵', '𝖭', '𝗡', '𝘕', '𝙉', '𝒩', '𝓝', '𝔑', '𝕹', '𝙽', 'ℕ',
		'𝐎', '𝑂', '𝑶', '𝖮', '𝗢', '𝘖', '𝙊', '𝒪', '𝓞', '𝔒', '𝕺', '𝙾', '𝕆',
		'𝐏', '𝑃', '𝑷', '𝖯', '𝗣', '𝘗', '𝙋', '𝒫', '𝓟', '𝔓', '𝕻', '𝙿', 'ℙ',
		'𝐐', '𝑄', '𝑸', '𝖰', '𝗤', '𝘘', '𝙌', '𝒬', '𝓠', '𝔔', '𝕼', '𝚀', 'ℚ',
		'𝐑', '𝑅', '𝑹', '𝖱', '𝗥', '𝘙', '𝙍', 'ℛ', '𝓡', 'ℜ', '𝕽', '𝚁', 'ℝ',
		'𝐒', '𝑆', '𝑺', '𝖲', '𝗦', '𝘚', '𝙎', '𝒮', '𝓢', '𝔖', '𝕾', '𝚂', '𝕊',
		'𝐓', '𝑇', '𝑻', '𝖳', '𝗧', '𝘛', '𝙏', '𝒯', '𝓣', '𝔗', '𝕿', '𝚃', '𝕋',
		'𝐔', '𝑈', '𝑼', '𝖴', '𝗨', '𝘜', '𝙐', '𝒰', '𝓤', '𝔘', '𝖀', '𝚄', '𝕌',
		'𝐕', '𝑉', '𝑽', '𝖵', '𝗩', '𝘝', '𝙑', '𝒱', '𝓥', '𝔙', '𝖁', '𝚅', '𝕍',
		'𝐖', '𝑊', '𝑾', '𝖶', '𝗪', '𝘞', '𝙒', '𝒲', '𝓦', '𝔚', '𝖂', '𝚆', '𝕎',
		'𝐗', '𝑋', '𝑿', '𝖷', '𝗫', '𝘟', '𝙓', '𝒳', '𝓧', '𝔛', '𝖃', '𝚇', '𝕏',
		'𝐘', '𝑌', '𝒀', '𝖸', '𝗬', '𝘠', '𝙔', '𝒴', '𝓨', '𝔜', '𝖄', '𝚈', '𝕐',
		'𝐙', '𝑍', '𝒁', '𝖹', '𝗭', '𝘡', '𝙕', '𝒵', '𝓩', 'ℨ', '𝖅', '𝚉', 'ℤ',
		'𝐚', '𝑎', '𝒂', '𝖺', '𝗮', '𝘢', '𝙖', '𝒶', '𝓪', '𝔞', '𝖆', '𝚊', '𝕒',
		'𝐛', '𝑏', '𝒃', '𝖻', '𝗯', '𝘣', '𝙗', '𝒷', '𝓫', '𝔟', '𝖇', '𝚋', '𝕓',
		'𝐜', '𝑐', '𝒄', '𝖼', '𝗰', '𝘤', '𝙘', '𝒸', '𝓬', '𝔠', '𝖈', '𝚌', '𝕔',
		'𝐝', '𝑑', '𝒅', '𝖽', '𝗱', '𝘥', '𝙙', '𝒹', '𝓭', '𝔡', '𝖉', '𝚍', '𝕕',
		'𝐞', '𝑒', '𝒆', '𝖾', '𝗲', '𝘦', '𝙚', 'ℯ', '𝓮', '𝔢', '𝖊', '𝚎', '𝕖',
		'𝐟', '𝑓', '𝒇', '𝖿', '𝗳', '𝘧', '𝙛', '𝒻', '𝓯', '𝔣', '𝖋', '𝚏', '𝕗',
		'𝐠', '𝑔', '𝒈', '𝗀', '𝗴', '𝘨', '𝙜', 'ℊ', '𝓰', '𝔤', '𝖌', '𝚐', '𝕘',
		'𝐡', 'ℎ', '𝒉', '𝗁', '𝗵', '𝘩', '𝙝', '𝒽', '𝓱', '𝔥', '𝖍', '𝚑', '𝕙',
		'𝐢', '𝑖', '𝒊', '𝗂', '𝗶', '𝘪', '𝙞', '𝒾', '𝓲', '𝔦', '𝖎', '𝚒', '𝕚',
		'𝐣', '𝑗', '𝒋', '𝗃', '𝗷', '𝘫', '𝙟', '𝒿', '𝓳', '𝔧', '𝖏', '𝚓', '𝕛',
		'𝐤', '𝑘', '𝒌', '𝗄', '𝗸', '𝘬', '𝙠', '𝓀', '𝓴', '𝔨', '𝖐', '𝚔', '𝕜',
		'𝐥', '𝑙', '𝒍', '𝗅', '𝗹', '𝘭', '𝙡', '𝓁', '𝓵', '𝔩', '𝖑', '𝚕', '𝕝',
		'𝐦', '𝑚', '𝒎', '𝗆', '𝗺', '𝘮', '𝙢', '𝓂', '𝓶', '𝔪', '𝖒', '𝚖', '𝕞',
		'𝐧', '𝑛', '𝒏', '𝗇', '𝗻', '𝘯', '𝙣', '𝓃', '𝓷', '𝔫', '𝖓', '𝚗', '𝕟',
		'𝐨', '𝑜', '𝒐', '𝗈', '𝗼', '𝘰', '𝙤', 'ℴ', '𝓸', '𝔬', '𝖔', '𝚘', '𝕠',
		'𝐩', '𝑝', '𝒑', '𝗉', '𝗽', '𝘱', '𝙥', '𝓅', '𝓹', '𝔭', '𝖕', '𝚙', '𝕡',
		'𝐪', '𝑞', '𝒒', '𝗊', '𝗾', '𝘲', '𝙦', '𝓆', '𝓺', '𝔮', '𝖖', '𝚚', '𝕢',
		'𝐫', '𝑟', '𝒓', '𝗋', '𝗿', '𝘳', '𝙧', '𝓇', '𝓻', '𝔯', '𝖗', '𝚛', '𝕣',
		'𝐬', '𝑠', '𝒔', '𝗌', '𝘀', '𝘴', '𝙨', '𝓈', '𝓼', '𝔰', '𝖘', '𝚜', '𝕤',
		'𝐭', '𝑡', '𝒕', '𝗍', '𝘁', '𝘵', '𝙩', '𝓉', '𝓽', '𝔱', '𝖙', '𝚝', '𝕥',
		'𝐮', '𝑢', '𝒖', '𝗎', '𝘂', '𝘶', '𝙪', '𝓊', '𝓾', '𝔲', '𝖚', '𝚞', '𝕦',
		'𝐯', '𝑣', '𝒗', '𝗏', '𝘃', '𝘷', '𝙫', '𝓋', '𝓿', '𝔳', '𝖛', '𝚟', '𝕧',
		'𝐰', '𝑤', '𝒘', '𝗐', '𝘄', '𝘸', '𝙬', '𝓌', '𝔀', '𝔴', '𝖜', '𝚠', '𝕨',
		'𝐱', '𝑥', '𝒙', '𝗑', '𝘅', '𝘹', '𝙭', '𝓍', '𝔁', '𝔵', '𝖝', '𝚡', '𝕩',
		'𝐲', '𝑦', '𝒚', '𝗒', '𝘆', '𝘺', '𝙮', '𝓎', '𝔂', '𝔶', '𝖞', '𝚢', '𝕪',
		'𝐳', '𝑧', '𝒛', '𝗓', '𝘇', '𝘻', '𝙯', '𝓏', '𝔃', '𝔷', '𝖟', '𝚣', '𝕫',

		'𝚤',
		'𝚥',

		'Α', '𝚨', '𝛢', '𝜜', '𝝖', '𝞐',
		'Β', '𝚩', '𝛣', '𝜝', '𝝗', '𝞑',
		'Γ', '𝚪', '𝛤', '𝜞', '𝝘', '𝞒',
		'Δ', '𝚫', '𝛥', '𝜟', '𝝙', '𝞓',
		'Ε', '𝚬', '𝛦', '𝜠', '𝝚', '𝞔',
		'Ζ', '𝚭', '𝛧', '𝜡', '𝝛', '𝞕',
		'Η', '𝚮', '𝛨', '𝜢', '𝝜', '𝞖',
		'Θ', '𝚯', '𝛩', '𝜣', '𝝝', '𝞗',
		'Ι', '𝚰', '𝛪', '𝜤', '𝝞', '𝞘',
		'Κ', '𝚱', '𝛫', '𝜥', '𝝟', '𝞙',
		'Λ', '𝚲', '𝛬', '𝜦', '𝝠', '𝞚',
		'Μ', '𝚳', '𝛭', '𝜧', '𝝡', '𝞛',
		'Ν', '𝚴', '𝛮', '𝜨', '𝝢', '𝞜',
		'Ξ', '𝚵', '𝛯', '𝜩', '𝝣', '𝞝',
		'Ο', '𝚶', '𝛰', '𝜪', '𝝤', '𝞞',
		'Π', '𝚷', '𝛱', '𝜫', '𝝥', '𝞟',
		'Ρ', '𝚸', '𝛲', '𝜬', '𝝦', '𝞠',
		'ϴ', '𝚹', '𝛳', '𝜭', '𝝧', '𝞡',
		'Σ', '𝚺', '𝛴', '𝜮', '𝝨', '𝞢',
		'Τ', '𝚻', '𝛵', '𝜯', '𝝩', '𝞣',
		'Υ', '𝚼', '𝛶', '𝜰', '𝝪', '𝞤',
		'Φ', '𝚽', '𝛷', '𝜱', '𝝫', '𝞥',
		'Χ', '𝚾', '𝛸', '𝜲', '𝝬', '𝞦',
		'Ψ', '𝚿', '𝛹', '𝜳', '𝝭', '𝞧',
		'Ω', '𝛀', '𝛺', '𝜴', '𝝮', '𝞨',
		'∇', '𝛁', '𝛻', '𝜵', '𝝯', '𝞩',
		'α', '𝛂', '𝛼', '𝜶', '𝝰', '𝞪',
		'β', '𝛃', '𝛽', '𝜷', '𝝱', '𝞫',
		'γ', '𝛄', '𝛾', '𝜸', '𝝲', '𝞬',
		'δ', '𝛅', '𝛿', '𝜹', '𝝳', '𝞭',
		'ε', '𝛆', '𝜀', '𝜺', '𝝴', '𝞮',
		'ζ', '𝛇', '𝜁', '𝜻', '𝝵', '𝞯',
		'η', '𝛈', '𝜂', '𝜼', '𝝶', '𝞰',
		'θ', '𝛉', '𝜃', '𝜽', '𝝷', '𝞱',
		'ι', '𝛊', '𝜄', '𝜾', '𝝸', '𝞲',
		'κ', '𝛋', '𝜅', '𝜿', '𝝹', '𝞳',
		'λ', '𝛌', '𝜆', '𝝀', '𝝺', '𝞴',
		'μ', '𝛍', '𝜇', '𝝁', '𝝻', '𝞵',
		'ν', '𝛎', '𝜈', '𝝂', '𝝼', '𝞶',
		'ξ', '𝛏', '𝜉', '𝝃', '𝝽', '𝞷',
		'ο', '𝛐', '𝜊', '𝝄', '𝝾', '𝞸',
		'π', '𝛑', '𝜋', '𝝅', '𝝿', '𝞹',
		'ρ', '𝛒', '𝜌', '𝝆', '𝞀', '𝞺',
		'ς', '𝛓', '𝜍', '𝝇', '𝞁', '𝞻',
		'σ', '𝛔', '𝜎', '𝝈', '𝞂', '𝞼',
		'τ', '𝛕', '𝜏', '𝝉', '𝞃', '𝞽',
		'υ', '𝛖', '𝜐', '𝝊', '𝞄', '𝞾',
		'φ', '𝛗', '𝜑', '𝝋', '𝞅', '𝞿',
		'χ', '𝛘', '𝜒', '𝝌', '𝞆', '𝟀',
		'ψ', '𝛙', '𝜓', '𝝍', '𝞇', '𝟁',
		'ω', '𝛚', '𝜔', '𝝎', '𝞈', '𝟂',
		'∂', '𝛛', '𝜕', '𝝏', '𝞉', '𝟃',
		'ϵ', '𝛜', '𝜖', '𝝐', '𝞊', '𝟄',
		'ϑ', '𝛝', '𝜗', '𝝑', '𝞋', '𝟅',
		'ϰ', '𝛞', '𝜘', '𝝒', '𝞌', '𝟆',
		'ϕ', '𝛟', '𝜙', '𝝓', '𝞍', '𝟇',
		'ϱ', '𝛠', '𝜚', '𝝔', '𝞎', '𝟈',
		'ϖ', '𝛡', '𝜛', '𝝕', '𝞏', '𝟉',
		'Ϝ', '𝟊',
		'ϝ', '𝟋',
		// '0', '𝟎', '𝟘', '𝟢', '𝟬', '𝟶',
		// '1', '𝟏', '𝟙', '𝟣', '𝟭', '𝟷',
		// '2', '𝟐', '𝟚', '𝟤', '𝟮', '𝟸',
		// '3', '𝟑', '𝟛', '𝟥', '𝟯', '𝟹',
		// '4', '𝟒', '𝟜', '𝟦', '𝟰', '𝟺',
		// '5', '𝟓', '𝟝', '𝟧', '𝟱', '𝟻',
		// '6', '𝟔', '𝟞', '𝟨', '𝟲', '𝟼',
		// '7', '𝟕', '𝟟', '𝟩', '𝟳', '𝟽',
		// '8', '𝟖', '𝟠', '𝟪', '𝟴', '𝟾',
		// '9', '𝟗', '𝟡', '𝟫', '𝟵', '𝟿',

		"ⅇ", "ⅈ", "ⅉ", "ⅅ", "ⅆ",
	];

	//https://www.cs.bgu.ac.il/~khitron/Equation%20Editor.pdf
	const wordAutoCorrection = [
		["Dd", "ⅅ"],
		["dd", "ⅆ"],
		["ell", "ℓ"],//0x2113
		["ee", "ⅇ"],//0x2147
		["hbar", "ℏ"],//0x210f
		["ii", "ⅈ"],//0x2148
		["Im", "ℑ"],//0x2111
		["imath", "𝚤"],
		["j", "Jay"],
		["jj", "ⅉ"],//0x2149
		["jmath", "𝚥"],
		["partial", "∂"],//0x2202
		["Re", "ℜ"],//0x211c
		["wp", "℘"],//0x2118
		["aleph", "ℵ"],//0x2135
		["bet", "ℶ"],//0x2136["beth", "ℶ"],//0x2136
		["gimel", "ℷ"],//0x2137
		["daleth", "ℸ"], ["dalet", "ℸ"],

		["Alpha", "Α"], ["alpha", "α"],//0x03b1
		["Beta", "Β"], ["beta", "β"],
		["gamma", "γ"], ["Gamma", "Γ"], ["G", "Γ"],
		["delta", "δ"], ["Delta", "Δ"],
		["epsolon", "ϵ"], ["Epsolon", "Ε"], ["varepsilon", "ε"],
		["zelta", "ζ"], ["Zelta", "Ζ"],
		["eta", "η"], ["Eta", "Η"],
		["Theta", "Θ"], ["theta", "θ"], ["vartheta", "ϑ"],
		["iota", "ι"], ["Iota", "Ι"],
		["kappa", "κ"], ["Kappa", "Κ"],
		["lambda", "λ"], ["Lambda", "Λ"],
		["mu", "μ"], ["Mu", "Μ"],
		["nu", "ν"], ["Nu", "Ν"],
		["xi", "ξ"], ["Xi", "Ξ"],
		["o", "ο"], ["O", "Ο"],
		["Pi", "Π"], ["pi", "ρ"], ["varpi", "ϖ"],
		["rho", "ρ"], ["Rho", "Ρ"], ["varrho", "ϱ"],
		["Sigma", "Σ"], ["sigma", "σ"], ["varsigma", "ς"],
		["Tau", "Τ"], ["tau", "τ"],
		["Upsilon", "Υ"], ["upsilon", "υ"],
		["Phi", "Φ"], ["phi", "ϕ"], ["varphi", "φ"],
		["Chi", "Χ"], ["chi", "χ"],
		["Psi", "Ψ"], ["psi", "ψ"],
		["Omega", "Ω"], ["omega", "ω"],

		["!!", "‼"],
		["...", "…"],
		["::", "∷"],
		["...", "…"],
		[":=", "≔"],
		["~=", "≅"],
		["+-", "±"],
		["-+", "∓"],
		["<=", "≤"],
		[">=", "≥"],
		["<<", "≪"],
		[">>", "≫"],

		["angle", "∠"],
		["approx", "≈"],
		["ast", "∗"],
		["asymp", "≍"],
		["because", ""],
		["bot", ""],
		["bowtie", ""],
		["boxdot", ""],
		["boxminus", ""],
		["boxplus", ""],
		["bullet", ""],
		["cap", ""],
		["cdot", ""],
		["cdots", ""],
		["circ", ""],
		["clubsuit", ""],
		["cong", ""],
		["cup", ""],
		["equiv", ""],
		["ni", ""],
		["contain", ""],
		["rmoust", ""],
		["succeq", ""],
		["to", ""],
		["rightarrow", ""],
		["Rightarrow", ""],
		["dashv", ""],
		["exists", ""],
		["odot", ""],
		["etminus", ""],
		["superset", ""],
		["gets", ""],
		["leftarrow", ""],
		["Leftarrow", ""],
		["ddots", ""],
		["forall", ""],
		["ominus", ""],
		["sim", ""],
		["superseteq", ""],
		["uparrow", ""],
		["Uparrow", ""],
		["defeq", ""],
		["frown", ""],
		["oplus", ""],
		["simeq", ""],
		["therefore", ""],
		["downarrow", ""],
		["Downarrow", ""],
		["degc", ""],
		["heartsuit", ""],
		["otimes", ""],
		["smile", ""],
		["times", ""],
		["leftrightarrow", ""],
		["Leftrightarrow", ""],
		["degf", ""],
		["in", ""],
		["overbracket", ""],
		["spadesuit", ""],
		["top", ""],
		["updownarrow", ""],
		["Updownarrow", ""],
		["degree", ""],
		["inc", ""],
		["parallel", ""],
		["sqcap", ""],
		["underbracket", ""],
		["nwarrow", ""],
		["Longrightarrow", ""],
		["Deltaeq", ""],
		["infty", ""],
		["perp", ""],
		["sqcup", ""],
		["underline", ""],
		["nearrow", ""],
		["Longleftarrow", ""],
		["diamond", ""],
		["ldots", ""],
		["prec", ""],
		["sqsubseteq", ""],
		["uplus", ""],
		["swarrow", ""],
		["Longleftrightarrow", ""],
		["diamondsuit", ""],
		["left", ""],
		["preceq", ""],
		["sqsuperseteq", ""],
		["vdash", ""],
		["searrow", ""],
		["hookrightarrow", ""],
		["div", ""],
		["lmoust", ""],
		["propto", ""],
		["star", ""],
		["vdots", ""],
		["rightharpoonup", ""],
		["hookleftarrow", ""],
		["doteq", ""],
		["models", ""],
		["ratio", ""],
		["subset", ""],
		["vee", ""],
		["rightharpoondown", ""],
		["break", ""],
		["dots", ""],
		["nabla", ""],
		["rddots", ""],
		["subseteq", ""],
		["wedge", ""],
		["leftharpoonup", ""],
		["lrhar", ""],
		["emptyset", ""],
		["neg", ""],
		["right", ""],
		["succ", ""],
		["wr", ""],
	];
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
						{ctrPrp : new CTextPr(), type : DEGREE_PreSubSup},
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


	function Tokenizer(isLaTeX) {
		this._string = undefined;
		this._cursor = undefined;
		this._isLaTeX = isLaTeX;
		this.TokenRules = isLaTeX ? LaTeXTokenRules : UnicodeTokensRule;
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

		let string = this._string.slice(this._cursor);
		//Check
		if (!this._isLaTeX) {
			let newString = GetUnicodeAutoCorrectionToken(string, this);
			if (newString) {
				if (Array.isArray(newString)) {
					string = newString;
				}
				else {
					return newString
				}
			}
		}

		for (let i = this.TokenRules.length - 1; i >= 0; i--) {
			let autoCorrectRule = this.TokenRules[i];

			let regexp = autoCorrectRule[0];
			let tokenClass = autoCorrectRule[1];
			if (tokenClass === undefined)
				tokenClass = regexp;

			let tokenData = autoCorrectRule[2];
			let tokenValue = this.MatchToken(regexp, string);

			if (tokenValue === null)
				continue;

			if (undefined === tokenData)
				tokenData = tokenValue;

			return {
				class: tokenClass,
				data: tokenData,
			}
		}

		let str = "";
		for (let i = 0; i <= this._cursor - 1; i++) {
			str += " ";
		}
		str += "^"
		throw new SyntaxError(`Unexpected token: "${string[0]}"\n` + this._string.join('') + "\n" + str);
	}
	Tokenizer.prototype.ProcessString = function (str, char) {
		let intLenOfRule = 0;
		while (intLenOfRule <= char.length - 1) {
			if (char[intLenOfRule] === str[intLenOfRule]) {
				intLenOfRule++;
			} else {
				return;
			}
		}
		return char;
	}
	Tokenizer.prototype.MatchToken = function (regexp, string){
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
