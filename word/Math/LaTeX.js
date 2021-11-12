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

function CLaTeXParser(props, str) {
	this.str = str;
	this.indexOfAtom = 0;
	this.arrAtomsOfFormula = [];
	this.Pr = { ctrPrp: new CTextPr() };
	this.Paragraph = CMathContent.Paragraph;
	this.ParaMath = props;
	this.Root = props.Root;
}

CLaTeXParser.prototype.prepare = function () {
	var t0 = performance.now();
	CLaTeXLexer(this, this.Root);
	var t1 = performance.now();
	console.log("Lexer work " + (t1 - t0) + " milliseconds.");
};

CLaTeXParser.prototype.arrLaTeXSymbols = new Map([
	["\\Alpha", 0x0391],
	["\\alpha", 0x03b1],
	["\\Beta", 0x0392],
	["\\beta", 0x03b2],
	["\\Gamma", 0x0393],
	["\\gamma", 0x03b3],
	["\\Delta", 0x0394],
	["\\delta", 0x03b4],
	["\\Epsilon", 0x0395],
	["\\epsilon", 0x03f5],
	["\\varepsilon", 0x03b5],
	["\\Zeta", 0x0396],
	["\\zeta", 0x03b6],
	["\\Eta", 0x0397],
	["\\eta", 0x3b7],
	["\\Theta", 0x0398],
	["\\theta", 0x03b8],
	["\\vartheta", 0x03d1],
	["\\Iota", 0x0399],
	["\\iota", 0x03b9],
	["\\Kappa", 0x039a],
	["\\kappa", 0x03ba],
	["\\varkappa", 0x03f0],
	["\\Lambda", 0x039b],
	["\\lambda", 0x03bb],
	["\\Mu", 0x039c],
	["\\mu", 0x03bc],
	["\\Nu", 0x039d],
	["\\nu", 0x03bd],
	["\\Xi", 0x039e],
	["\\xi", 0x03be],
	["\\Omicron", 0x039f],
	["\\omicron", 0x03bf],
	["\\Pi", 0x03a0],
	["\\pi", 0x03c0],
	["\\varpi", 0x03d6],
	["\\Rho", 0x03a1],
	["\\rho", 0x03c1],
	["\\varrho", 0x03f1],
	["\\Sigma", 0x03a3],
	["\\sigma", 0x03c2],
	["\\varsigma", 0x03f2],
	["\\Tau ", 0x03a4],
	["\\tau", 0x03c4],
	["\\Upsilon", 0x03a5],
	["\\upsilon", 0x03c5],
	["\\Phi", 0x03a6],
	["\\phi", 0x03c6],
	["\\varphi", 0x03d5],
	["\\varPhi", 0x03d5],
	["\\Chi", 0x03a7],
	["\\chi", 0x03c7],
	["\\Psi", 0x03a8],
	["\\psi", 0x03c8],
	["\\Omega", 0x03a9],
	["\\omega", 0x03c9],
	["\\Digamma", 0x03dc],
	["\\digamma", 0x03dd],
	["!!", 0x203c],
	["...", 0x2026],
	["::", 0x2237],
	[":=", 0x2254],
	["/<", 0x226e],
	["/>", 0x226f],
	["/=", 0x2260],
	["\\above", 0x2534],
	["\\acute", 0x0301],
	["\\aleph", 0x2135],
	["\\amalg", 0x2210],
	["\\angle", 0x2220],
	["\\aoint", 0x222e],
	["\\approx", 0x2248],
	["\\asmash", 0x2b06],
	["\\ast", 0x2217],
	["\\asymp", 0x224d],
	["\\atop", 0x00a6],
	["\\bar", 0x0305],
	["\\Bar", 0x033f],
	["\\because", 0x2235],
	["\\begin", 0x3016],
	["\\below", 0x252c],
	["\\bet", 0x2136],
	["\\beth", 0x2136],
	["\\bigcap", 0x22c2],
	["\\bigcup", 0x22c3],
	["\\bigodot", 0x2a00],
	["\\bigoplus", 0x2a01],
	["\\bigotimes", 0x2a02],
	["\\bigsqcup", 0x2a06],
	["\\biguplus", 0x2a04],
	["\\bigvee", 0x22c1],
	["\\bigwedge", 0x22c0],
	[
		"\\binomial",
		[
			0x0028, 0x0061, 0x002b, 0x0062, 0x0029, 0x005e, 0x005e, 0x003d, 0x2211,
			0x005f, 0x0028, 0x006b, 0x003d, 0x0030, 0x0029, 0x005e, 0x006e, 0x0020,
			0x2592, 0x0028, 0x006e, 0x00a6, 0x006b, 0x0029, 0x0061, 0x005e, 0x006b,
			0x0020, 0x0062, 0x005e, 0x0028, 0x006e, 0x002d, 0x006b, 0x0029,
		],
	],
	["\\bot", 0x22a5],
	["\\bowtie", 0x22c8],
	["\\box", 0x25a1],
	["\\boxdot", 0x22a1],
	["\\boxminus", 0x229f],
	["\\boxplus", 0x229e],
	["\\bra", 0x27e8],
	["\\break", 0x2936],
	["\\breve", 0x0306],
	["\\bullet", 0x2219],
	["\\cap", 0x2229],
	["\\cbrt", 0x221b],
	["\\cases", 0x24b8],
	["\\cdot", 0x22c5],
	["\\cdots", 0x22ef],
	["\\check", 0x030c],
	["\\circ", 0x2218],
	["\\close", 0x2524],
	["\\clubsuit", 0x2663],
	["\\coint", 0x2232],
	["\\cong", 0x2245],
	["\\coprod", 0x2210],
	["\\cup", 0x222a],
	["\\dalet", 0x2138],
	["\\daleth", 0x2138],
	["\\dashv", 0x22a3],
	["\\dd", 0x2146],
	["\\Dd", 0x2145],
	["\\ddddot", 0x20dc],
	["\\dddot", 0x20db],
	["\\ddot", 0x0308],
	["\\ddots", 0x22f1],
	["\\defeq", 0x225d],
	["\\degc", 0x2103],
	["\\degf", 0x2109],
	["\\degree", 0x00b0],
	["\\Deltaeq", 0x225c],
	["\\diamond", 0x22c4],
	["\\diamondsuit", 0x2662],
	["\\div", 0x00f7],
	["\\dot", 0x0307],
	["\\doteq", 0x2250],
	["\\dots", 0x2026],
	["\\doublea", 0x1d552],
	["\\doubleA", 0x1d538],
	["\\doubleb", 0x1d553],
	["\\doubleB", 0x1d539],
	["\\doublec", 0x1d554],
	["\\doubleC", 0x2102],
	["\\doubled", 0x1d555],
	["\\doubleD", 0x1d53b],
	["\\doublee", 0x1d556],
	["\\doubleE", 0x1d53c],
	["\\doublef", 0x1d557],
	["\\doubleF", 0x1d53d],
	["\\doubleg", 0x1d558],
	["\\doubleG", 0x1d53e],
	["\\doubleh", 0x1d559],
	["\\doubleH", 0x210d],
	["\\doublei", 0x1d55a],
	["\\doubleI", 0x1d540],
	["\\doublej", 0x1d55b],
	["\\doubleJ", 0x1d541],
	["\\doublek", 0x1d55c],
	["\\doubleK", 0x1d542],
	["\\doublel", 0x1d55d],
	["\\doubleL", 0x1d543],
	["\\doublem", 0x1d55e],
	["\\doubleM", 0x1d544],
	["\\doublen", 0x1d55f],
	["\\doubleN", 0x2115],
	["\\doubleo", 0x1d560],
	["\\doubleO", 0x1d546],
	["\\doublep", 0x1d561],
	["\\doubleP", 0x2119],
	["\\doubleq", 0x1d562],
	["\\doubleQ", 0x211a],
	["\\doubler", 0x1d563],
	["\\doubleR", 0x211d],
	["\\doubles", 0x1d564],
	["\\doubleS", 0x1d54a],
	["\\doublet", 0x1d565],
	["\\doubleT", 0x1d54b],
	["\\doubleu", 0x1d566],
	["\\doubleU", 0x1d54c],
	["\\doublev", 0x1d567],
	["\\doubleV", 0x1d54d],
	["\\doublew", 0x1d568],
	["\\doubleW", 0x1d54e],
	["\\doublex", 0x1d569],
	["\\doubleX", 0x1d54f],
	["\\doubley", 0x1d56a],
	["\\doubleY", 0x1d550],
	["\\doublez", 0x1d56b],
	["\\doubleZ", 0x2124],
	["\\downarrow", 0x2193],
	["\\Downarrow", 0x21d3],
	["\\dsmash", 0x2b07],
	["\\ee", 0x2147],
	["\\ell", 0x2113],
	["\\emptyset", 0x2205],
	["\\emsp", 0x2003],
	["\\end", 0x3017],
	["\\ensp", 0x2002],
	["\\eqarray", 0x2588],
	["\\equiv", 0x2261],
	["\\exists", 0x2203],
	["\\forall", 0x2200],
	["\\fraktura", 0x1d51e],
	["\\frakturA", 0x1d504],
	["\\frakturb", 0x1d51f],
	["\\frakturB", 0x1d505],
	["\\frakturc", 0x1d520],
	["\\frakturC", 0x212d],
	["\\frakturd", 0x1d521],
	["\\frakturD", 0x1d507],
	["\\frakture", 0x1d522],
	["\\frakturE", 0x1d508],
	["\\frakturf", 0x1d523],
	["\\frakturF", 0x1d509],
	["\\frakturg", 0x1d524],
	["\\frakturG", 0x1d50a],
	["\\frakturh", 0x1d525],
	["\\frakturH", 0x210c],
	["\\frakturi", 0x1d526],
	["\\frakturI", 0x2111],
	["\\frakturj", 0x1d527],
	["\\frakturJ", 0x1d50d],
	["\\frakturk", 0x1d528],
	["\\frakturK", 0x1d50e],
	["\\frakturl", 0x1d529],
	["\\frakturL", 0x1d50f],
	["\\frakturm", 0x1d52a],
	["\\frakturM", 0x1d510],
	["\\frakturn", 0x1d52b],
	["\\frakturN", 0x1d511],
	["\\frakturo", 0x1d52c],
	["\\frakturO", 0x1d512],
	["\\frakturp", 0x1d52d],
	["\\frakturP", 0x1d513],
	["\\frakturq", 0x1d52e],
	["\\frakturQ", 0x1d514],
	["\\frakturr", 0x1d52f],
	["\\frakturR", 0x211c],
	["\\frakturs", 0x1d530],
	["\\frakturS", 0x1d516],
	["\\frakturt", 0x1d531],
	["\\frakturT", 0x1d517],
	["\\frakturu", 0x1d532],
	["\\frakturU", 0x1d518],
	["\\frakturv", 0x1d533],
	["\\frakturV", 0x1d519],
	["\\frakturw", 0x1d534],
	["\\frakturW", 0x1d51a],
	["\\frakturx", 0x1d535],
	["\\frakturX", 0x1d51b],
	["\\fraktury", 0x1d536],
	["\\frakturY", 0x1d51c],
	["\\frakturz", 0x1d537],
	["\\frakturZ", 0x2128],
	["\\frown", 0x2311],
	["\\funcapply", 0x2061],
	["\\ge", 0x2265],
	["\\geq", 0x2265],
	["\\gets", 0x2190],
	["\\gg", 0x226b],
	["\\gimel", 0x2137],
	["\\grave", 0x0300],
	["\\hairsp", 0x200a],
	["\\hat", 0x0302],
	["\\hbar", 0x210f],
	["\\heartsuit", 0x2661],
	["\\hookleftarrow", 0x21a9],
	["\\hookrightarrow", 0x21aa],
	["\\hphantom", 0x2b04],
	["\\hsmash", 0x2b0c],
	["\\hvec", 0x20d1],
	[
		"\\identitymatrix",
		[
			0x0028, 0x25a0, 0x0028, 0x0031, 0x0026, 0x0030, 0x0026, 0x0030, 0x0040,
			0x0030, 0x0026, 0x0031, 0x0026, 0x0030, 0x0040, 0x0030, 0x0026, 0x0030,
			0x0026, 0x0031, 0x0029, 0x0029,
		],
	],
	["\\ii", 0x2148],
	["\\iiint", 0x222d],
	["\\iint", 0x222c],
	["\\iiiint", 0x2a0c],
	["\\Im", 0x2111],
	["\\imath", 0x0131],
	["\\in", 0x2208],
	["\\inc", 0x2206],
	["\\infty", 0x221e],
	["\\int", 0x222b],
	[
		"\\integral",
		[
			0x0031, 0x002f, 0x0032, 0x03c0, 0x222b, 0x005f, 0x0030, 0x005e, 0x0032,
			0x03c0, 0x2592, 0x2146, 0x03b8, 0x0020, 0x0028, 0x0061, 0x002b, 0x0062,
			0x0073, 0x0069, 0x006e, 0x0020, 0x03b8, 0x0029, 0x003d, 0x0031, 0x002f,
			0x221a, 0x0028, 0x0061, 0x005e, 0x0032, 0x002d, 0x0062, 0x005e, 0x0032,
			0x0029,
		],
	],
	["\\itimes", 0x2062],
	["\\j", [0x004a, 0x0061, 0x0079]],
	["\\jj", 0x2149],
	["\\jmath", 0x0237],
	["\\ket", 0x27e9],
	["\\langle", 0x2329],
	["\\lbbrack", 0x27e6],
	["\\lbrace", 0x007b],
	["\\lbrack", 0x005b],
	["\\lceil", 0x2308],
	["\\ldiv", 0x2215],
	["\\ldivide", 0x2215],
	["\\ldots", 0x2026],
	["\\le", 0x2264],
	["\\left", 0x251c],
	["\\leftarrow", 0x2190],
	["\\Leftarrow", 0x21d0],
	["\\leftharpoondown", 0x21bd],
	["\\leftharpoonup", 0x21bc],
	["\\leftrightarrow", 0x2194],
	["\\Leftrightarrow", 0x21d4],
	["\\leq", 0x2264],
	["\\lfloor", 0x230a],
	["\\lhvec", 0x20d0],
	[
		"\\limit",
		[
			0x006c, 0x0069, 0x006d, 0x005f, 0x0028, 0x006e, 0x2192, 0x221e, 0x0029,
			0x2061, 0x3016, 0x0028, 0x0031, 0x002b, 0x0031, 0x002f, 0x006e, 0x0029,
			0x005e, 0x006e, 0x3017, 0x003d, 0x0065,
		],
	],
	["\\ll", 0x226a],
	["\\lmoust", 0x23b0],
	["\\Longleftarrow", 0x27f8],
	["\\Longleftrightarrow", 0x27fa],
	["\\Longrightarrow", 0x27f9],
	["\\lrhar", 0x21cb],
	["\\lvec", 0x20d6],
	["\\mapsto", 0x21a6],
	["\\matrix", 0x25a0],
	["\\medsp", 0x205f],
	["\\mid", 0x2223],
	["\\middle", 0x24dc],
	["\\models", 0x22a8],
	["\\mp", 0x2213],
	["\\nabla", 0x2207],
	["\\naryand", 0x2592],
	["\\nbsp", 0x00a0],
	["\\ne", 0x2260],
	["\\nearrow", 0x2197],
	["\\neq", 0x2260],
	["\\ni", 0x220b],
	["\\norm", 0x2016],
	["\\notcontain", 0x220c],
	["\\notelement", 0x2209],
	["\\notin", 0x2209],
	["\\nwarrow", 0x2196],
	["\\o", 0x03bf],
	["\\O", 0x039f],
	["\\odot", 0x2299],
	["\\of", 0x2592],
	["\\oiiint", 0x2230],
	["\\oiint", 0x222f],
	["\\oint", 0x222e],
	["\\ominus", 0x2296],
	["\\open", 0x251c],
	["\\oplus", 0x2295],
	["\\otimes", 0x2297],
	["\\over", 0x002f],
	["\\overbar", 0x00af],
	["\\overbrace", 0x23de],
	["\\overbracket", 0x23b4],
	["\\overline", 0x00af],
	["\\overparen", 0x23dc],
	["\\overshell", 0x23e0],
	["\\parallel", 0x2225],
	["\\partial", 0x2202],
	["\\pmatrix", 0x24a8],
	["\\perp", 0x22a5],
	["\\phantom", 0x27e1],
	["\\pm", 0x00b1],
	["\\pppprime", 0x2057],
	["\\ppprime", 0x2034],
	["\\pprime", 0x2033],
	["\\prec", 0x227a],
	["\\preceq", 0x227c],
	["\\prime", 0x2032],
	["\\prod", 0x220f],
	["\\propto", 0x221d],
	["\\qdrt", 0x221c],
	[
		"\\quadratic",
		[
			0x0078, 0x003d, 0x0028, 0x002d, 0x0062, 0x00b1, 0x221a, 0x0028, 0x0062,
			0x005e, 0x0032, 0x002d, 0x0034, 0x0061, 0x0063, 0x0029, 0x0029, 0x002f,
			0x0032, 0x0061,
		],
	],
	["\\rangle", 0x232a],
	["\\Rangle", 0x27eb],
	["\\ratio", 0x2236],
	["\\rbrace", 0x007d],
	["\\rbrack", 0x005d],
	["\\Rbrack", 0x27e7],
	["\\rceil", 0x2309],
	["\\rddots", 0x22f0],
	["\\Re", 0x211c],
	["\\rect", 0x25ad],
	["\\rfloor", 0x230b],
	["\\rhvec", 0x20d1],
	["\\right", 0x2524],
	["\\rightarrow", 0x2192],
	["\\Rightarrow", 0x21d2],
	["\\rightharpoondown", 0x21c1],
	["\\rightharpoonup", 0x21c0],
	["\\rmoust", 0x23b1],
	["\\root", 0x24ad],
	["\\scripta", 0x1d4b6],
	["\\scriptA", 0x1d49c],
	["\\scriptb", 0x1d4b7],
	["\\scriptB", 0x212c],
	["\\scriptc", 0x1d4b8],
	["\\scriptC", 0x1d49e],
	["\\scriptd", 0x1d4b9],
	["\\scriptD", 0x1d49f],
	["\\scripte", 0x212f],
	["\\scriptE", 0x2130],
	["\\scriptf", 0x1d4bb],
	["\\scriptF", 0x2131],
	["\\scriptg", 0x210a],
	["\\scriptG", 0x1d4a2],
	["\\scripth", 0x1d4bd],
	["\\scriptH", 0x210b],
	["\\scripti", 0x1d4be],
	["\\scriptI", 0x2110],
	["\\scriptj", 0x1d4bf],
	["\\scriptJ", 0x1d4a5],
	["\\scriptk", 0x1d4c0],
	["\\scriptK", 0x1d4a6],
	["\\scriptl", 0x2113],
	["\\scriptL", 0x2112],
	["\\scriptm", 0x1d4c2],
	["\\scriptM", 0x2133],
	["\\scriptn", 0x1d4c3],
	["\\scriptN", 0x1d4a9],
	["\\scripto", 0x2134],
	["\\scriptO", 0x1d4aa],
	["\\scriptp", 0x1d4c5],
	["\\scriptP", 0x1d4ab],
	["\\scriptq", 0x1d4c6],
	["\\scriptQ", 0x1d4ac],
	["\\scriptr", 0x1d4c7],
	["\\scriptR", 0x211b],
	["\\scripts", 0x1d4c8],
	["\\scriptS", 0x1d4ae],
	["\\scriptt", 0x1d4c9],
	["\\scriptT", 0x1d4af],
	["\\scriptu", 0x1d4ca],
	["\\scriptU", 0x1d4b0],
	["\\scriptv", 0x1d4cb],
	["\\scriptV", 0x1d4b1],
	["\\scriptw", 0x1d4cc],
	["\\scriptW", 0x1d4b2],
	["\\scriptx", 0x1d4cd],
	["\\scriptX", 0x1d4b3],
	["\\scripty", 0x1d4ce],
	["\\scriptY", 0x1d4b4],
	["\\scriptz", 0x1d4cf],
	["\\scriptZ", 0x1d4b5],
	["\\sdiv", 0x2044],
	["\\sdivide", 0x2044],
	["\\searrow", 0x2198],
	["\\setminus", 0x2216],
	["\\sim", 0x223c],
	["\\simeq", 0x2243],
	["\\smash", 0x2b0d],
	["\\smile", 0x2323],
	["\\spadesuit", 0x2660],
	["\\sqcap", 0x2293],
	["\\sqcup", 0x2294],
	["\\sqrt", 0x221a],
	["\\sqsubseteq", 0x2291],
	["\\sqsuperseteq", 0x2292],
	["\\star", 0x22c6],
	["\\subset", 0x2282],
	// ['/\\subseteq', 0x2288],
	["\\subseteq", 0x2286],
	["\\succ", 0x227b],
	["\\succeq", 0x227d],
	["\\sum", 0x2211],
	["\\superset", 0x2283],
	["\\superseteq", 0x2287],
	["\\swarrow", 0x2199],
	["\\therefore", 0x2234],
	["\\thicksp", 0x2005],
	["\\thinsp", 0x2006],
	["\\tilde", 0x0303],
	["\\times", 0x00d7],
	["\\to", 0x2192],
	["\\top", 0x22a4],
	["\\tvec", 0x20e1],
	["\\ubar", 0x0332],
	["\\Ubar", 0x0333],
	["\\underbar", 0x2581],
	["\\underbrace", 0x23df],
	["\\underbracket", 0x23b5],
	["\\underline", 0x25b1],
	["\\underparen", 0x23dd],
	["\\uparrow", 0x2191],
	["\\Uparrow", 0x21d1],
	["\\updownarrow", 0x2195],
	["\\Updownarrow", 0x21d5],
	["\\uplus", 0x228e],
	["\\vbar", 0x2502],
	["\\vdash", 0x22a2],
	["\\vdots", 0x22ee],
	["\\vec", 0x20d7],
	["\\vee", 0x2228],
	["\\vert", 0x007c],
	["\\Vert", 0x2016],
	["\\Vmatrix", 0x24a9],
	["\\vphantom", 0x21f3],
	["\\vthicksp", 0x2004],
	["\\wedge", 0x2227],
	["\\wp", 0x2118],
	["\\wr", 0x2240],
	["\\zwnj", 0x200c],
	["\\zwsp", 0x200b],
	["~=", 0x2245],
	["-+", 0x2213],
	["+-", 0x00b1],
	["<<", 0x226a],
	["<=", 0x2264],
	["->", 0x2192],
	[">=", 0x2265],
	[">>", 0x226b],
]);

CLaTeXParser.prototype.Parse = function (str) {
	var strTempWord = "";
	for (var i = 0; i < str.length; i++) {
		strTempWord += str[i];
		if (
			str[i + 1] == "\\" ||
			str[i + 1] == "^" ||
			str[i + 1] == "_" ||
			str[i + 1] == "-" ||
			str[i + 1] == "+" ||
			str[i + 1] == "/" ||
			str[i + 1] == "*" ||
			(str[i + 1] == "(" && strTempWord != "\\") ||
			(str[i + 1] == ")" && strTempWord != "\\") ||
			(str[i + 1] == "{" && strTempWord != "\\") ||
			(str[i + 1] == "}" && strTempWord != "\\") ||
			str[i + 1] == " " ||
			str[i + 1] == "," ||
			(str[i + 1] == "[" && strTempWord != "\\") ||
			(str[i + 1] == "]" && strTempWord != "\\") ||
			strTempWord == "(" ||
			strTempWord == "\\middle" ||
			strTempWord == ")" ||
			strTempWord == "[" ||
			strTempWord == "]" ||
			strTempWord == "{" ||
			strTempWord == "}" ||
			strTempWord == "^" ||
			strTempWord == "-" ||
			strTempWord == "_" ||
			strTempWord == "\\left" ||
			strTempWord == "\\right"
		) {
			this.arrAtomsOfFormula.push(strTempWord.trim());
			strTempWord = "";
		}
	}
	this.arrAtomsOfFormula = this.arrAtomsOfFormula.filter(Boolean);
	console.log(
		"🚀 ~ file: Math.js ~ line 4053 ~ this.arrAtomsOfFormula",
		this.arrAtomsOfFormula
	);
};

//Service
CLaTeXParser.prototype.GetNextAtom = function () {
	this.indexOfAtom++;
	return this.indexOfAtom - 1 <= this.length
		? null
		: this.arrAtomsOfFormula[this.indexOfAtom - 1];
};

CLaTeXParser.prototype.CheckFutureAtom = function (n) {
	if (n) {
		return this.arrAtomsOfFormula[this.indexOfAtom + n];
	}

	else {
		return this.arrAtomsOfFormula[this.indexOfAtom];
	}
};

CLaTeXParser.prototype.ExitFromLexer = function (strFAtom, exitIfSee) {
	if (exitIfSee && typeof exitIfSee != "number" && strFAtom == exitIfSee)
	{
		return true;
	} 
	
	else {
		return false;
	}
};

CLaTeXParser.prototype.CreateLitleBox = function (FormArgument) {
	var oBox = new CBox(this.Pr);
	FormArgument.Add_Element(oBox);
	var BoxMathContent = oBox.getBase();
	BoxMathContent.SetArgSize(-1);
	return BoxMathContent;
};

CLaTeXParser.prototype.CheckSyntax = function () {
	for (var i = 0; i <= arguments.length; i++) {
		if (this.CheckSyntaxSequence(arguments[i][0])) {
			return arguments[i][1];
		}
	}

	console.log('Проблема')
	return false;
};

CLaTeXParser.prototype.CheckElementSequence = function (strPattern, now, countOfPostParse) {
	var arrOfData = this.arrAtomsOfFormula;
	var intIndexData = now ? this.indexOfAtom - 1 : this.indexOfAtom;

	for (var index = 0; index < strPattern.length; index++, intIndexData++) {
		if (strPattern[index] != arrOfData[intIndexData]) return false;
	}

	if (countOfPostParse) {
		this.RecipientSeveralAtom(countOfPostParse);
	}
	return true;
};

CLaTeXParser.prototype.RecipientSeveralAtom = function (intCount) {
	for (var index = 1; index <= intCount; index++) {
		this.GetNextAtom();
	}
};

CLaTeXParser.prototype.CheckSyntaxSequence = function (strPattern, afterAllNotThatSymbol, now) {
	var intPatternIndex = 0;
	var arrOfData = this.arrAtomsOfFormula;
	var intIndexData = now ? this.indexOfAtom - 1 : this.indexOfAtom;
	var isCorrect = true;

	do {
		if (
			typeof strPattern[intPatternIndex] === "number" &&
			typeof Number(arrOfData[intIndexData]) === "number"
		)
		{
			intPatternIndex++;
			var index = 0;

			do {
				intIndexData++;
				index++;
			} while (index < strPattern[intPatternIndex]);
		}

		else if (
			strPattern[intPatternIndex] == arrOfData[intIndexData] &&
			strPattern[intPatternIndex] != "{"
		) {
			intIndexData++;
			intPatternIndex++;
		}

		else if (
			strPattern[intPatternIndex] == arrOfData[intIndexData] &&
			arrOfData[intIndexData] == "{"
		)
		{
			intIndexData++;
			do {
				intIndexData++;
			} while (arrOfData[intIndexData - 1] != "}");

			intPatternIndex++;
		}

		else {
			return false
		}
	} while (intPatternIndex != strPattern.length);

	if (
		afterAllNotThatSymbol &&
		arrOfData[intIndexData] == afterAllNotThatSymbol
	) {
		return true;
	}

	return isCorrect;
};

CLaTeXParser.prototype.StartLexer = function (context, arrSymbol) {
	if (this.CheckFutureAtom() == '^' || this.CheckFutureAtom() == '_') {
		this.GetNextAtom();
	}

	if (!arrSymbol) {
		var strOpentBracet = this.CheckFutureAtom();
		var strCloseBracet = this.GetCloseBracet.get(strOpentBracet);

		if (strCloseBracet) {
			CLaTeXLexer(this, context, strCloseBracet);
		}

		else {
			CLaTeXLexer(this, context, 1);
		}
	}

	else if (arrSymbol) {
		if (typeof arrSymbol != 'number') {
			CLaTeXLexer(this, context, arrSymbol);
		}

		else {
			CLaTeXLexer(this, context, arrSymbol);
		}
	}
};

CLaTeXParser.prototype.CheckIsDegreeAndIndex = function () {
	if (
		this.CheckSyntaxSequence(["^", 1, "_", 1]) ||
		this.CheckSyntaxSequence(["^", "{", "_", "{"]) ||
		this.CheckSyntaxSequence(["_", 1, "^", 1]) ||
		this.CheckSyntaxSequence(["_", "{", "^", "{"]) ||
		this.CheckSyntaxSequence(["^", "{", "_", 1]) ||
		this.CheckSyntaxSequence(["^", 1, "_", "{"]) ||
		this.CheckSyntaxSequence(["_", 1, "^", "{"]) ||
		this.CheckSyntaxSequence(["_", "{", "^", 1]) 
	) 
	{
		return true;
	} 
	
	else 
	{
		return false;
	}
};

CLaTeXParser.prototype.CheckIsDegreeOrIndex = function () {
	if (
		this.CheckSyntaxSequence(["_", 1], "^") ||
		this.CheckSyntaxSequence(["^", 1], "_") ||
		this.CheckSyntaxSequence(["_", '{'], "^")||
		this.CheckSyntaxSequence(["^", '{'], "_")
	)
	{
		return true;
	}
	
	else
	{
		return false;
	}
};

//Fraction
CLaTeXParser.prototype.AddFraction = function(FormArgument, strFAtom, type) {
	var isInlineFraction = this.CheckSyntaxSequence(["^", 1, "/", "_", 1], null, true)

	if (!strFAtom) {
		strFAtom = this.GetNextAtom();
	}

	var typeOfFraction = null;
	
	if (isInlineFraction) {
		typeOfFraction = 'SKEWED_FRACTION';
	} 
	else {
		if (!type) {
			typeOfFraction = this.GetTypeOfFrac.get(strFAtom); //duplication in Lexer!
		}
		else {
			typeOfFraction = type;
		}
	}

	if (typeOfFraction) {
		var Fraction = this.CreateFraction(FormArgument, typeOfFraction);
		this.FillFracContent(Fraction, isInlineFraction);
	}
};

CLaTeXParser.prototype.CreateFraction = function (FormArgument, typeOfFraction) {
	if (typeOfFraction == 'BAR_FRACTION') {
		this.Pr.type = 0;
	}

	if (typeOfFraction == 'SKEWED_FRACTION') {
		this.Pr.type = 1;
	}

	if (typeOfFraction == 'LINEAR_FRACTION') {
		this.Pr.type = 2;
	}

	if (typeOfFraction == 'NO_BAR_FRACTION') {
		this.Pr.type = 3;
	}

	if (typeOfFraction == 'LITLE_DEFAULT_FRACTION') {
		var Box = this.CreateLitleBox(FormArgument);
		var Fraction = Box.Add_Fraction(this.Pr, null, null);
		return Fraction;

	} 
	else {
		var Fraction = FormArgument.Add_Fraction(this.Pr, null, null);
		return Fraction;
	}
};

CLaTeXParser.prototype.FillFracContent = function (FormArgument, isInlineFraction) {
	if (!isInlineFraction) {
		this.StartLexer(FormArgument.getNumeratorMathContent());
		this.StartLexer(FormArgument.getDenominatorMathContent());
	}
	else {
		this.StartLexer(FormArgument.getNumeratorMathContent());
		this.GetNextAtom();
		this.StartLexer(FormArgument.getDenominatorMathContent());
	}
};

CLaTeXParser.prototype.GetTypeOfFrac = new Map([
	['\\frac', 'DEFAULT_FRACTION'],
	['\\tfrac', 'LITLE_DEFAULT_FRACTION'],
	['\\sfrac', 'SKEWED_FRACTION'],
	['\\nicefrac', 'LINEAR_FRACTION'],
	['\\dfrac', 'DEFAULT_FRACTION'], // todo dfrac
]);

//Limit
CLaTeXParser.prototype.AddLimit = function (FormArgument, strFAtom) {
	var typeOfLimit = this.GetTypeOfLimit.get(strFAtom);
	var typeOfBottom = this.CheckSyntax(
		[['^', '{'], 'BOTTOM_WITH_BRACETS_DEGREE'],
		[['_', '{'], 'BOTTOM_WITH_BRACETS_INDEX'],
		[['^', 1], 'BOTTOM_DEGREE'],
		[['_', 1], 'BOTTOM_INDEX']
	)
	
	if (typeOfBottom) {
		var Limit = this.CreateLimit(FormArgument, typeOfBottom);
		this.FillLimitContent(Limit, typeOfLimit);
	}
	
};

CLaTeXParser.prototype.FillLimitContent = function(Limit, typeOfLimit) {
	Limit.getFName().Add_Text(typeOfLimit, this.Paragraph, STY_PLAIN);
	this.StartLexer(Limit.getIterator());
};

CLaTeXParser.prototype.CreateLimit = function (FormArgument, typeOfBottom) {
	this.Pr.type = this.GetTypeOfIndexLimit.get(typeOfBottom);
	var Limit = FormArgument.Add_Limit(this.Pr, null, null); 
	return Limit;
};

CLaTeXParser.prototype.GetTypeOfIndexLimit = new Map([
	['BOTTOM_DEGREE', 1],
	['BOTTOM_WITH_BRACETS_DEGREE', 1],
	['BOTTOM_INDEX', 0],
	['BOTTOM_WITH_BRACETS_INDEX', 0],
]);

CLaTeXParser.prototype.GetTypeOfLimit = new Map([
	['\\lim', 'lim'],
	['\\inf', 'inf'],
	['\\sup', 'sup'],
	['\\max', 'max'],
	['\\min', 'min'],
]);

//Function 
CLaTeXParser.prototype.AddFunction = function (FormArgument, strFAtom) {
	var typeOfFunction = this.GetTypeOfFunction.get(strFAtom);
	var Function = this.CreateFunction(FormArgument)

	if (typeOfFunction == 1) {
		var isDegreeOrIndex = this.CheckIsDegreeOrIndex();
		var isDegreeAndIndex = this.CheckIsDegreeAndIndex();

		if (isDegreeAndIndex || isDegreeOrIndex) {
			this.AddScript(Function.getFName(), strFAtom.slice(1), isDegreeOrIndex, isDegreeAndIndex);
			this.StartLexer(Function.getArgument());
		} 
		else {
			Function.getFName().Add_Text(strFAtom.slice(1), this.Paragraph);
			this.StartLexer(Function.getArgument());
		}
	
	} 

	else if (typeOfFunction == 2) {
		this.AddLimit(Function.getFName(), strFAtom);
		this.StartLexer(Function.getArgument());
	}

	else if (typeOfFunction == 3) {
		Function.getFName().Add_Text(strFAtom, this.Paragraph);
		this.StartLexer(Function.getArgument());
	}
};

CLaTeXParser.prototype.CreateFunction = function (FormArgument) {
	var Function = FormArgument.Add_Function(this.Pr, null, null)
	return Function;
}

CLaTeXParser.prototype.GetTypeOfFunction = new Map([
	["\\cos", 1],
	["\\sin", 1],
	["\\tan", 1],
	["\\cot", 1],
	["\\arcsin", 1],
	["\\arccos", 1],
	["\\arctan", 1],
	["\\arccot", 1],
	["\\sinh", 1],
	["\\cosh", 1],
	["\\tanh", 1],
	["\\coth", 1],
	["\\sec", 1],
	["\\exp", 1],
	["\\csc", 1],

	["mod", 3],

	['\\lim', 2],
	['\\inf', 2],
	['\\sup', 2],
	['\\max', 2],
	['\\min', 2],
]);

//Script
CLaTeXParser.prototype.AddScript = function(FormArgument, strFAtom, isDegreeOrIndex, isDegreeAndIndex, isPre) {
	var Script = null; 
	var typeOfScript = null;

	if (isDegreeAndIndex) {
		typeOfScript = this.CheckSyntax(
			[['_', '{', '^', '{'], 'SUB_SUP'],
			[['^', '{', '_', '{'], 'SUP_SUB'],
			[['_', 1, '^', 1], 'SUB_SUP'],
			[['^', 1, '_', 1], 'SUP_SUB']
		);

		Script = this.CreateScript(FormArgument, typeOfScript);
	} 

	else if (isDegreeOrIndex) {
		typeOfScript = this.CheckSyntax(
			[['_'], 'DEGREE_SUBSCRIPT'],
			[['^'], 'DEGREE_SUPERSCRIPT']
		);

		Script = this.CreateScript(FormArgument, typeOfScript);
	}

	this.FillScriptContent(Script, strFAtom, typeOfScript)
};

CLaTeXParser.prototype.CreateScript = function(FormArgument, type) {
	var isBothDegreeAndIndex = false;
	if (type == 'DEGREE_SUPERSCRIPT') {
		this.Pr.type = DEGREE_SUPERSCRIPT;
	} else if (type == 'DEGREE_SUBSCRIPT') {
		this.Pr.type = DEGREE_SUBSCRIPT;
	} else if (type == 'SUB_SUP' || type == 'SUP_SUB') {
		isBothDegreeAndIndex = true;
		this.Pr.type = DEGREE_SubSup;
	}

	var Script = FormArgument.Add_Script(isBothDegreeAndIndex, this.Pr, null, null, null);
	return Script;
};

CLaTeXParser.prototype.FillScriptContent = function(Script, name, typeOfScript) {
	Script.getBase().Add_Text(name, this.Paragraph);

	if (typeOfScript == 'DEGREE_SUPERSCRIPT') {
		this.FillScriptContentWriteSub(Script);
	}
	else if (typeOfScript == 'DEGREE_SUBSCRIPT') {
		this.FillScriptContentWriteSup(Script);
	}
	else if (typeOfScript == 'SUB_SUP') {
		this.FillScriptContentWriteSub(Script);
		this.FillScriptContentWriteSup(Script);
	}
	else if (typeOfScript == 'SUP_SUB') {
		this.FillScriptContentWriteSup(Script);
		this.FillScriptContentWriteSub(Script);
	}
};

CLaTeXParser.prototype.FillScriptContentWriteSup = function(Script) {
	var Iterator = Script.getUpperIterator();
	this.CheckFutureAtom(); // get ^ sup
	this.StartLexer(Iterator);
};

CLaTeXParser.prototype.FillScriptContentWriteSub = function(Script) {
	var Iterator = Script.getLowerIterator();
	this.CheckFutureAtom(); // get _ sub
	this.StartLexer(Iterator);
};

CLaTeXParser.prototype.AddScriptForText = function(FormArgument, strFAtom) {
	var isDegreeOrIndex = this.CheckIsDegreeOrIndex();
	var isDegreeAndIndex = this.CheckIsDegreeAndIndex();

	this.AddScript(FormArgument, strFAtom, isDegreeOrIndex, isDegreeAndIndex);
};

CLaTeXParser.prototype.CheckSupSubForLexer = function () {
	return (
		(this.CheckSyntaxSequence(["^", 1]) && this.CheckFutureAtom(-2) != "_") ||
		(this.CheckSyntaxSequence(["_", 1]) && this.CheckFutureAtom(-2) != "^") ||
		this.CheckSyntaxSequence(["_", "{", "^", "{"]) ||
		this.CheckSyntaxSequence(["^", "{", "_", "{"]) ||
		this.CheckSyntaxSequence(["^", 1, "_", 1]) ||
		this.CheckSyntaxSequence(["_", 1, "^", 1])
	);
};

//Radical
CLaTeXParser.prototype.AddRadical = function (FormArgument) {
	var typeOfRadical = null;
	if (this.CheckFutureAtom() == '[') {
		typeOfRadical  = DEGREE_RADICAL;
	} else {
		typeOfRadical = SQUARE_RADICAL;
	}

	var Radical = this.CreateRadical(FormArgument, typeOfRadical);
	this.FillRadicalContent(Radical, typeOfRadical);
};

CLaTeXParser.prototype.CreateRadical = function (FormArgument, typeOfRadical) {
	if (typeOfRadical == SQUARE_RADICAL) {
		this.Pr.degHide = true;
	} else if (typeOfRadical == DEGREE_RADICAL) {
		this.Pr.type = typeOfRadical;
	}

	var Radical = FormArgument.Add_Radical(this.Pr, null, null);
	return Radical
};

CLaTeXParser.prototype.FillRadicalContent = function (Radical, typeOfRadical) {
	if (typeOfRadical == DEGREE_RADICAL) {
		this.StartLexer(Radical.getDegree());
		
	}
	this.StartLexer(Radical.getBase());
};

CLaTeXParser.prototype.AddPMod = function (FormArgument) {
	var Mod = this.AddBracet(
		FormArgument, 
		this.GetBracetCode.get('('),
		this.GetBracetCode.get(')')
		);

	var MathContent = Mod.getElementMathContent(0);
	MathContent.Add_Text('mod ', this.Paragraph);
	this.StartLexer(MathContent);
};

CLaTeXParser.prototype.AddBracet = function (FormArgument, open, close) {
	if (open == undefined) {
		open = null
	};

	if (close == undefined) {
		close = null
	};
	
	var Bracet = FormArgument.Add_DelimiterEx(
		this.Pr.ctrPrp,
		1,
		[null],
		open,
		close
	);

	return Bracet;	
};

//BracetBlock
CLaTeXParser.prototype.AddBracets = function(FormArgument, strFAtom) {
	if (!strFAtom) {
		strFAtom = this.GetNextAtom();
	}
	if (strFAtom != '\\left') {
		var strOpenBracet = strFAtom;
		var strCloseBracet = this.GetCloseBracet.get(strOpenBracet);
		if (!strCloseBracet) {
			return
		}

		var indexOfCloseBracet = this.CheckCloseBracet(strOpenBracet, strCloseBracet);
		var OutputMiddleFunc = this.MiddleCount(indexOfCloseBracet);
		var intCountOfMiddle = OutputMiddleFunc[0];
		var strTypeOfMiddle = OutputMiddleFunc[1]; //todo

		strOpenBracet = this.GetBracetCode.get(strOpenBracet);
		strCloseBracet = this.GetBracetCode.get(strCloseBracet);

		var Bracet = this.CreateBracetBlock(
			FormArgument,
			strOpenBracet,
			strCloseBracet,
			intCountOfMiddle
			); 
		
		this.FillBracetBlockContent(Bracet, intCountOfMiddle, this.GetCloseBracet.get(strFAtom));
	}
	else if (strFAtom == '\\left') {
		var strStartBracet = this.GetNextAtom();
		var strCloseBracet;
		var indexOfCloseBracet = this.CheckCloseBracet("\\left");
		
		var OutputMiddleFunc = this.MiddleCount(indexOfCloseBracet);
		var intCountOfMiddle = OutputMiddleFunc[0];
		var strTypeOfMiddle = OutputMiddleFunc[1]; //todo

		if (indexOfCloseBracet != false) {
			strCloseBracet = this.arrAtomsOfFormula[indexOfCloseBracet + 1];
		}

		strOpenBracet = this.GetBracetCode.get(strStartBracet);
		strCloseBracet = this.GetBracetCode.get(strCloseBracet);

		if (strCloseBracet == "empty") {
			strCloseBracet = -1;
		}
		if (strOpenBracet == "empty") {
			strOpenBracet = -1;
		}

		var Bracet = this.CreateBracetBlock(
			FormArgument,
			strOpenBracet,
			strCloseBracet,
			intCountOfMiddle
			); 
		
		this.FillBracetBlockContent(Bracet, intCountOfMiddle, "\\right");
		this.GetNextAtom();
	}
};

CLaTeXParser.prototype.CheckCloseBracet = function(strOpenBracet, strCloseBracet) {
	if (!strCloseBracet) {
		strCloseBracet = this.GetCloseBracet.get(strOpenBracet);
	}

	var intPatternIndex = 1;
	var arrOfData = this.arrAtomsOfFormula;
	var intIndexData = this.indexOfAtom;

	while (intIndexData < arrOfData.length) {
	
		if (arrOfData[intIndexData] == strOpenBracet) {
			intPatternIndex++;
		} 
		else if (arrOfData[intIndexData] == strCloseBracet) {
			intPatternIndex--;
		}

		if (arrOfData[intIndexData] == strCloseBracet && intPatternIndex == 0) {
			return intIndexData;
		}

		intIndexData++;
	}
	return false;
};

CLaTeXParser.prototype.MiddleCount = function(countOfMiddle) {
	var arrOfData = this.arrAtomsOfFormula;
	var intIndexData = this.indexOfAtom;

	var intCount = 0;
	var strDelim = null;
	while (intIndexData < countOfMiddle) {
	
		if (arrOfData[intIndexData] == '\\middle') {
			intCount++;
			if (intCount == 0) {
				strDelim = arrOfData[intIndexData + 1];
			}
		} 
		intIndexData++;
	}
	return [intCount, strDelim];
};

CLaTeXParser.prototype.CreateBracetBlock = function (FormArgument, strOpenBracet, strCloseBracet, MiddleCount) {
	var BracetBlock = FormArgument.Add_DelimiterEx(
		this.Pr.ctrPrp,
		1 + MiddleCount,
		[null],
		strOpenBracet,
		strCloseBracet
	);
	return BracetBlock;
};

CLaTeXParser.prototype.FillBracetBlockContent = function (BracetBlock, countOfDelim, exit) {
	if (countOfDelim + 1 > 1) {
		for(var index = 0; index < countOfDelim; index++) {
			this.StartLexer(BracetBlock.getElementMathContent(index), '\\middle');
			this.GetNextAtom();
		}
		this.StartLexer(BracetBlock.getElementMathContent(index), exit);
		this.GetNextAtom();
	} else {
		this.StartLexer(BracetBlock.getElementMathContent(0), exit);
	}
};

CLaTeXParser.prototype.GetCloseBracet = new Map([
	//["|", "|"],
	["(", ")"],
	["{", "}"],
	["[", "]"],
	["\\{", "\\}"],
	//["\\|", "\\|"],
	["\\langle", "\\rangle"],
	["\\lfloor", "\\rfloor"],
	["\\lceil", "\\rceil"],
	["\\ulcorner", "\\urcorner"],
	["/", "\\backslash"],
	["\\left", "\\right"],
]);

CLaTeXParser.prototype.GetBracetCode = new Map([
	["(", null],
	[")", null],
	["{", 123],
	["}", 125],
	["\\{", 123],
	["\\}", 125],
	["[", 91],
	["]", 93],
	["\\[", 91],
	["\\]", 93],
	["|", 124],
	["\\|", 8214],
	["\\langle", 10216],
	["\\rangle", 10217],
	["\\lfloor", 0x230a],
	["\\rfloor", 0x230b],
	["\\lceil", 0x2308],
	["\\rceil", 0x2309],
	["\\ulcorner", 0xcbb9],
	["\\urcorner", 0xcbba],
	["/", 0x2f],
	["\\backslash", 0x5c],
	[".", "empty"],
]);

CLaTeXParser.prototype.CheckIsBrackets = function (strFAtom) {
	var  strTempAtom = this.CheckFutureAtom(-1);
	if (
		strTempAtom == "|" ||
		strTempAtom == "(" ||
		strTempAtom == "[" ||
		strTempAtom == "\\{" ||
		strTempAtom == "\\|" ||
		strTempAtom == "\\langle" ||
		strTempAtom == "\\lfloor" ||
		strTempAtom == "\\lceil" ||
		strTempAtom == "\\ulcorner" ||
		strTempAtom == "/" ||
		strFAtom == "\\left" 
	) {
		return true;
	} else {
		return false;
	}
};

//Binom
CLaTeXParser.prototype.AddBinom = function (FormArgument) {
	var Delimiter = this.AddBracet(FormArgument);
    var BaseMathContent = Delimiter.getElementMathContent(0);
	this.AddFraction(BaseMathContent, null, NO_BAR_FRACTION);
};

//Mod : todo add bmod variant
CLaTeXParser.prototype.AddPMod = function (FormArgument) {
	var Delimiter = this.AddBracet(FormArgument);
	this.AddFunction(Delimiter.getElementMathContent(0), "mod");
};

//Large Operator
CLaTeXParser.prototype.AddLargeOperator = function (FormArgument, str) {
	var strNameOfLargeOperator = this.CheckIsLargeOperator.get(str);

	var intTypeOFLoc = 1;

	if (this.CheckFutureAtom() == "\\limits") {
		this.GetNextAtom();
		intTypeOFLoc = 0;
	}

	var LargeOperator = this.CreateLargeOperator(FormArgument, intTypeOFLoc, strNameOfLargeOperator);
	this.FillLargeOperatorContent(LargeOperator);
};

CLaTeXParser.prototype.CreateLargeOperator = function(FormArgument, intTypeOFLoc, strName) {
	var Pr = {
		ctrPrp: new CTextPr(),
		limLoc: intTypeOFLoc,
		subHide: false,
		supHide: false,
		chr: strName,
	};

	if (this.CheckIsDegreeAndIndex()) {
		Pr.supHide = false;
		Pr.subHide = false;
	} 
	
	else if (this.CheckIsDegreeOrIndex()) {
		this.CheckSyntaxSequence(["^", 1])
			? ((Pr.subHide = true), (Pr.supHide = false))
			: ((Pr.subHide = false), (Pr.supHide = true));
	} 
	
	else {
		Pr.supHide = true;
		Pr.subHide = true;
	}

	var LargeOperator = FormArgument.Add_NAry(Pr, null, null, null);
	return LargeOperator;
}

CLaTeXParser.prototype.FillLargeOperatorContent = function(LargeOperator) {
	
	var strTempAtom = this.CheckFutureAtom();
	
	if (strTempAtom == "^") {
		this.StartLexer(LargeOperator.getSupMathContent());

		if (this.CheckFutureAtom() == "_") {
			this.StartLexer(LargeOperator.getSubMathContent());
		}
	} 
	
	else if (strTempAtom == "_") {
		this.StartLexer(LargeOperator.getSubMathContent());

		if (this.CheckFutureAtom() == "^") {
			this.StartLexer(LargeOperator.getSupMathContent());
		}
	}

	this.StartLexer(LargeOperator.getBase());
}

CLaTeXParser.prototype.CheckIsLargeOperator = new Map([
	["\\sum", 8721],
	["\\prod", 8719],
	["\\coprod", 8720],
	["\\bigcup", 8899],
	["\\bigcap", 8898],
	["\\bigvee", 8897],
	["\\bigwedge", 8896],
]);

//Accent 
CLaTeXParser.prototype.AddAccent = function (FormArgument, name) {
	var Accent;
	var intPosition = null;
	
	if (this.GetIsAddBar.get(name)) {
		if (name == "\\overline") {
			intPosition = 0;
		}
	
		else if (name == "\\underline") {
			intPosition = 1;
		}

		Accent = FormArgument.Add_Bar({ ctrPrp: this.Pr.ctrPrp, pos: intPosition }, null);
	}
	
	else if (this.GetIsAddGroupChar.get(name)) {
		if (name == "\\overbrace") {
			Accent = FormArgument.Add_GroupCharacter(
				{
					ctrPrp: this.Pr.ctrPrp,
					chr: 9182,
					pos: VJUST_TOP,
					vertJc: VJUST_BOT,
				},
				null
			);
		}

		if (name == "\\underbrace") {
			Accent = FormArgument.Add_GroupCharacter(
				{ ctrPrp: this.Pr.ctrPrp },
				null
			);
		}
	}

	else {
		Accent = FormArgument.Add_Accent(
			this.Pr.ctrPrp,
			this.GetAccent.get(name),
			null
		);
	}

	this.StartLexer(Accent.getBase())
};

CLaTeXParser.prototype.GetIsAddBar = new Map([
	["\\overline", true],
	["\\underline", true],
]);

CLaTeXParser.prototype.GetIsAddGroupChar = new Map([
	["\\overbrace", true],
	["\\underbrace", true],
]);

CLaTeXParser.prototype.CheckIsAccent = function (strFAtom) {
	return (
		this.GetAccent.get(strFAtom) ||
		this.GetIsAddBar.get(strFAtom) ||
		this.GetIsAddGroupChar.get(strFAtom)
	);
};

CLaTeXParser.prototype.GetAccent = new Map([
	["\\widetilde", 771],
	["\\widehat", 770],
	["\\overrightarrow", 8407],
	["\\overleftarrow", 8406],
	["\\dot", 775],
	["\\ddot", 776],
	["\\hat", 770],
	["\\check", 780],
	["\\acute", 769],
	["\\grave", 768],
	["\\bar", 773],
	["\\vec", 8407],
	["\\breve", 774],
	["\\tilde", 771],
]);

//Inetegral todo: check is base block closed
CLaTeXParser.prototype.AddIntegral = function (FormArgument, strFAtom) {
	var Integral = this.CreateIntegral(FormArgument, strFAtom);
	this.FillIntegralContent(Integral);
};

CLaTeXParser.prototype.CreateIntegral =  function(FormArgument, strFAtom) {
	var strNameOfIntegral = strFAtom;
	var intCountOfIntegral = this.GetCountOfIntegral.get(strNameOfIntegral);
	var isOTypeIntegral = this.GetTypeOfIntegral.get(strNameOfIntegral);
	var TypeOFLoc = 1;

	var hideBoxes = {
		supHide: false,
		subHide: false,
	};

	if (this.CheckFutureAtom() == "\\limits") {
		TypeOFLoc = 0;
		this.GetNextAtom();
	}

	if (this.CheckIsDegreeOrIndex() && !this.CheckIsDegreeAndIndex()) {
		if (this.CheckFutureAtom() == "^") {
			hideBoxes.subHide = true;
			hideBoxes.supHide = false
		}
		else if (this.CheckFutureAtom() == "_") {
			hideBoxes.subHide = false;
			hideBoxes.supHide = true
		}
	}

	if (!this.CheckIsDegreeOrIndex() && !this.CheckIsDegreeAndIndex()) {
		hideBoxes.supHide = true; 
		hideBoxes.subHide = true;
	}

	var Integral = FormArgument.Add_Integral(
		intCountOfIntegral,
		isOTypeIntegral,
		TypeOFLoc,
		hideBoxes.supHide,
		hideBoxes.subHide,
		this.Pr.ctrPrp,
		null,
		null,
		null
	);
	
	return Integral;
}

CLaTeXParser.prototype.FillIntegralContent =  function(Integral) {
	if (this.CheckFutureAtom() == '^') {
		this.StartLexer(Integral.getSupMathContent());
		
		if (this.CheckFutureAtom() == '_') {
			this.StartLexer(Integral.getSubMathContent());
		}
	}

	else if (this.CheckFutureAtom() == '_') {
		this.StartLexer(Integral.getSubMathContent());
		
		if (this.CheckFutureAtom() == '_') {
			this.StartLexer(Integral.getSupMathContent());
		}
	}

	this.StartLexer(Integral.getBase());
}

CLaTeXParser.prototype.GetCountOfIntegral = new Map([
	["\\int", 1],
	["\\oint", 1],
	["\\iint", 2],
	["\\oiint", 2],
	["\\iiint", 3],
	["\\oiiint", 3],
]);

CLaTeXParser.prototype.GetTypeOfIntegral = new Map([
	["\\int", false],
	["\\oint", true],
	["\\iint", false],
	["\\oiint", true],
	["\\iiint", false],
	["\\oiiint", true],
]);

//Matrix 
CLaTeXParser.prototype.AddMatrix = function (FormArgument) {
	
	var typeOfMatrix = this.CheckFutureAtom(-2);
	console.log(typeOfMatrix)
	if (typeOfMatrix == "pmatrix") {
		var Delimiter = FormArgument.Add_DelimiterEx(
			this.Pr.ctrPr,
			1,
			[null],
			this.GetBracetCode.get("("),
			this.GetBracetCode.get(")")
		);
		FormArgument = Delimiter.getElementMathContent(0);
	}
	else if (typeOfMatrix == "bmatrix") {
		var Delimiter = FormArgument.Add_DelimiterEx(
			this.Pr.ctrPr,
			1,
			[null],
			this.GetBracetCode.get("["),
			this.GetBracetCode.get("]")
		);
		FormArgument = Delimiter.getElementMathContent(0);
	}
	else if (typeOfMatrix == "Bmatrix") {
		var Delimiter = FormArgument.Add_DelimiterEx(
			this.Pr.ctrPr,
			1,
			[null],
			this.GetBracetCode.get("{"),
			this.GetBracetCode.get("}")
		);
		FormArgument = Delimiter.getElementMathContent(0);
	}
	else if (typeOfMatrix == "vmatrix") {
		var Delimiter = FormArgument.Add_DelimiterEx(
			this.Pr.ctrPr,
			1,
			[null],
			this.GetBracetCode.get("|"),
			this.GetBracetCode.get("|")
		);
		FormArgument = Delimiter.getElementMathContent(0);
	}
	else if (typeOfMatrix == "Vmatrix") {
		var Delimiter = FormArgument.Add_DelimiterEx(
			this.Pr.ctrPr,
			1,
			[null],
			this.GetBracetCode.get("\\|"),
			this.GetBracetCode.get("\\|")
		);
		FormArgument = Delimiter.getElementMathContent(0);
	}

	var intColsCount = 1;
	var intRowsCount = 1;
	var strTempArr;
	var intIndex = 0;

	do {
		strTempArr = this.CheckFutureAtom(intIndex);
		if (strTempArr == "&" && intRowsCount == 1) {
			intColsCount++;
		}
		if (strTempArr == "\\") {
			intRowsCount++;
		}
		intIndex++;
	} while (strTempArr != "\\end");

	var Pr = {
		ctrPrp: this.Pr.ctrPr,
		row: intRowsCount,
		mcs: [{ count: intColsCount, mcJc: 0 }], //todo mcJc  0 = center;
		plcHide: false,
	};

	var Matrix = new CMathMatrix(Pr);
	FormArgument.Add_Element(Matrix);

	for (var RowIndex = 0; RowIndex < intRowsCount; RowIndex++) {
		for (var ColIndex = 0; ColIndex < intColsCount; ColIndex++) {
			var MathContent = Matrix.getContentElement(RowIndex, ColIndex);
			CLaTeXLexer(this, MathContent, ["&", "\\", "\\end"]);
		}
	}
	this.RecipientSeveralAtom(3);
};

CLaTeXParser.prototype.CreateMatrix = function() {
	
}

CLaTeXParser.prototype.CheckIsMatrix = function () {
	return (
		this.CheckElementSequence(["\\begin", "{", "matrix", "}"], true, 3) ||
		this.CheckElementSequence(["\\begin", "{", "pmatrix", "}"], true, 3) ||
		this.CheckElementSequence(["\\begin", "{", "bmatrix", "}"], true, 3) ||
		this.CheckElementSequence(["\\begin", "{", "Bmatrix", "}"], true, 3) ||
		this.CheckElementSequence(["\\begin", "{", "vmatrix", "}"], true, 3) ||
		this.CheckElementSequence(["\\begin", "{", "Vmatrix", "}"], true, 3)
	);
};

//Text
CLaTeXParser.prototype.AddText = function (strFAtom, FormArgument) {
	this.AddSymbol(strFAtom, FormArgument);
};

CLaTeXParser.prototype.AddSymbol = function (strFAtom, FormArgument) {
	var strCode = this.arrLaTeXSymbols.get(strFAtom);

	if (strCode) {
		FormArgument.Add_Text(String.fromCharCode(strCode), this.Paragraph);
	}

	else {
		if (strFAtom == ",")
		{
			FormArgument.Add_Text(", ", this.Paragraph);
		}

		else
		{
			FormArgument.Add_Text(strFAtom, this.Paragraph);
		}
	}
};

CLaTeXParser.prototype.CheckIsText = function (strFAtom) {
	if (this.GetBracetCode.get(strFAtom)) {
		return false;
	}

	else if (
		strFAtom == "matrix" &&
		strFAtom == "\\left" &&
		strFAtom == "\\right" &&
		strFAtom != undefined &&
		strFAtom != '(' &&
		strFAtom != ')' 
	) {
		return false
	}

	return true
};


/**
 * @param Parser
 * @param FormArgument Функция в которую будет записываться контент.
 * @param exitIfSee Число элементов которые может обработать Lexer, или символ/массив символов при нахождении которых Lexer завершит работу.
 */
function CLaTeXLexer(Parser, FormArgument, exitIfSee) {
	//todo: update parser (y_0 y_1y_2y_3y_4)
	//todo: space in math - https://ru.overleaf.com/learn/latex/Spacing_in_math_mode
	//todo: bmod to func
	//fix radical
	var intFAtoms = 0;
	var strFAtom = 0;
	do {
		strFAtom = Parser.GetNextAtom();

		//check
		 if (Parser.ExitFromLexer(strFAtom, exitIfSee)){return};

		//construction
		if (Parser.GetTypeOfFunction.get(strFAtom) != null) {
			Parser.AddFunction(FormArgument, strFAtom);
			intFAtoms++;
		}
	
		else if (Parser.GetTypeOfFrac.get(strFAtom) != null || Parser.CheckSyntaxSequence(["^", 1, "/", "_", 1], null, true)) {
			Parser.AddFraction(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (strFAtom == "\\binom") {
			Parser.AddBinom(FormArgument);
			intFAtoms++;
		}

		else if (strFAtom == "\\sqrt") {
			Parser.AddRadical(FormArgument);
			intFAtoms++;
		}
		
		else if (strFAtom == "\\bmod") {
			Parser.AddText(" mod ", FormArgument);
			intFAtoms++;
		} 
		
		else if (strFAtom == "\\pmod") {
			Parser.AddPMod(FormArgument);
			intFAtoms++;
		} 
		
		else if (Parser.CheckIsLargeOperator.get(strFAtom)) {
			Parser.AddLargeOperator(FormArgument, strFAtom);
			intFAtoms++;
		} 
		
		else if (Parser.GetCountOfIntegral.get(strFAtom)) {
			Parser.AddIntegral(FormArgument, strFAtom);
			intFAtoms++;
		} 
		
		else if (Parser.CheckIsAccent(strFAtom)) {
			Parser.AddAccent(FormArgument, strFAtom);
			intFAtoms++;
		} 
		
		else if (Parser.CheckIsMatrix()) {
			Parser.AddMatrix(FormArgument);
			intFAtoms++;
		} 
		
		else if (
			Parser.CheckIsBrackets(strFAtom) && 
			Parser.CheckFutureAtom(-2) != '\\sqrt' && 
			Parser.CheckFutureAtom(-1) != '\\pmod' &&
			Parser.CheckFutureAtom(-2) != '_' &&
			Parser.CheckFutureAtom(-2) != '^'
		) 
		{
			Parser.AddBracets(FormArgument, strFAtom);
			intFAtoms++;
		}
		
		else if (Parser.CheckSupSubForLexer()) {
			Parser.AddScriptForText(FormArgument, strFAtom);
			intFAtoms++;
		} 
		
		else if (Parser.CheckIsText(strFAtom)) {
			Parser.AddText(strFAtom, FormArgument);
			intFAtoms++;
		}

		if (typeof exitIfSee === "number" && intFAtoms >= exitIfSee) {
			return;
		}

	} while (strFAtom != undefined);
}

//--------------------------------------------------------export----------------------------------------------------
window["AscCommonWord"] = window["AscCommonWord"] || {};
window["AscCommonWord"].CLaTeXParser = CLaTeXParser;
window["AscCommonWord"].CLaTeXLexer = CLaTeXLexer;
