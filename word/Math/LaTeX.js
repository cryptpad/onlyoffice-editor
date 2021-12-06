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

var BAR_FRACTION				= 0;
var SKEWED_FRACTION				= 1;
var LINEAR_FRACTION				= 2;
var NO_BAR_FRACTION				= 3;
var LITLE_DEFAULT				= 4;

function CLaTeXParser(props, str) {
	this.str = str;
	this.indexOfAtom = 0;
	this.arrAtomsOfFormula = [];
	this.Pr = { ctrPrp: new CTextPr() };
	this.ParaMath = props;
	this.Paragraph = props.Paragraph;
	this.Root = props.Root;
	this.isError = false;
	this.isInMatrix = false;
};
CLaTeXParser.prototype.prepare = function() {
	var t0 = performance.now();
	CLaTeXLexer(this, this.Root);
	var t1 = performance.now();
	console.log("Lexer work " + (t1 - t0) + " milliseconds.");
	this.Root.Correct_Content(true);
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
	["\\itimes", 0x2062],
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
	for (var i = 0; i <= str.length; i++) {
		strTempWord += str[i];

		if (strTempWord == '^' && str[i+1] != '{') {
			strTempWord = "";
			this.arrAtomsOfFormula.push('^');
			this.arrAtomsOfFormula.push('{');
			i++;
			this.arrAtomsOfFormula.push(str[i].trim());
			this.arrAtomsOfFormula.push('}');
		} 

		else if (strTempWord == '_' && str[i+1] != '{') {
			strTempWord = ""
			this.arrAtomsOfFormula.push('_');
			this.arrAtomsOfFormula.push('{');
			i++;
			this.arrAtomsOfFormula.push(str[i].trim());
			this.arrAtomsOfFormula.push('}');
		} 

		else if (
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
			str[i + 1] == "&" ||
			str[i + 1] == "," ||
			(str[i + 1] == "[" && strTempWord != "\\") ||
			(str[i + 1] == "]" && strTempWord != "\\") ||
			(str[i - 1] == "_" && str[i + 2] == "_") ||
			strTempWord == "(" ||
			strTempWord == "\\middle" ||
			strTempWord == ")" ||
			strTempWord == "[" ||
			strTempWord == "]" ||
			strTempWord == "{" ||
			strTempWord == "&" ||
			strTempWord == "}" ||
			strTempWord == "^" ||
			strTempWord == "-" ||
			strTempWord == "_" ||
			strTempWord == "\\," ||
			strTempWord == "\\left" ||
			strTempWord == "\\right"
		) {
			this.arrAtomsOfFormula.push(strTempWord.trim());
			strTempWord = "";
		}
	}
	this.arrAtomsOfFormula = this.arrAtomsOfFormula.filter(Boolean);
	console.log(this.arrAtomsOfFormula);
};
//Service
CLaTeXParser.prototype.GetNextAtom = function () {
	this.indexOfAtom++;
	return this.indexOfAtom - 1 <= this.length
		? undefined
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
	return (
		(exitIfSee && typeof exitIfSee != "number" && strFAtom == exitIfSee) ||
		(exitIfSee && Array.isArray(exitIfSee) && exitIfSee.includes(strFAtom))
	)
};
CLaTeXParser.prototype.CreateLitleBox = function (FormArgument) {
	var oBox = new CBox(this.Pr);
	FormArgument.Add_Element(oBox);
	var BoxMathContent = oBox.getBase();
	BoxMathContent.SetArgSize(-1);
	return BoxMathContent;
};
CLaTeXParser.prototype.CheckSyntax = function () {
	for (var i = 0; i < arguments.length; i++) {
		if (this.CheckSyntaxSequence(arguments[i][0], undefined, undefined, arguments[i][2])) {
			return arguments[i][1];
		}
	}
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
CLaTeXParser.prototype.CheckSyntaxSequence = function (strPattern, afterAllNotThatSymbol, now, index) {
	var intPatternIndex = 0;
	var arrOfData = this.arrAtomsOfFormula;
	
	if (!index) {
		var intIndexData = now ? this.indexOfAtom - 1 : this.indexOfAtom;
	}
	else {
		var intIndexData = index;
	}
	
	do {
		if (GetBracetCodeLexer[arrOfData[intIndexData]])
		{
			var intBrac = 1;
			var startBracet = arrOfData[intIndexData];
			var closeBracet = GetCloseBracet[startBracet];

			do {
				intIndexData++;
				
				if (arrOfData[intIndexData] == startBracet) {
					intBrac++;
				}
				
				else if (arrOfData[intIndexData] == closeBracet) {
					intBrac--;
				}

				//если не нашли скобку и вышли за границы
				if (arrOfData[intIndexData] == undefined) {
					return false;
				}

			} while (intBrac != 0);
			intIndexData++;
			intPatternIndex++;
		}

		else if (typeof strPattern[intPatternIndex] == 'number')
		{
			intPatternIndex++;
			intIndexData++;
		} 

		else if (arrOfData[intIndexData] == strPattern[intPatternIndex]) {
			intPatternIndex++;
			intIndexData++;
		}
		else {
			return false
		}

	} while (intPatternIndex != strPattern.length);

	if (afterAllNotThatSymbol) {
		if (arrOfData[intIndexData] == afterAllNotThatSymbol) {
			return false;
		} 
		else {
			return true
		}
	}
	return true;
};
var GetBracetCodeLexer = {
	"(": 40,
	")": 41,
	"{": 123,
	"}": 125,
	"\\{": 123,
	"\\}": 125,
	"[": 91,
	"]": 93,
	"\\[": 91,
	"\\]": 93,
	"|": 124,
	"\\|": 8214,
	"\\langle": 10216,
	"\\rangle": 10217,
	"\\lfloor": 0x230a,
	"\\rfloor": 0x230b,
	"\\lceil": 0x2308,
	"\\rceil": 0x2309,
	"\\ulcorner": 0xcbb9,
	"\\urcorner": 0xcbba,
	"/": 0x2f,
	"\\backslash": 0x5c
}
CLaTeXParser.prototype.StartLexer = function (context, arrSymbol) {
	if (this.CheckFutureAtom() == '^' || this.CheckFutureAtom() == '_') {
		this.GetNextAtom();
	}

	if (!arrSymbol) {
		var strOpentBracet = this.CheckFutureAtom();
		var strCloseBracet = GetCloseBracet[strOpentBracet];

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
CLaTeXParser.prototype.CheckIsDegreeAndIndex = function (index) {
	return (
		this.CheckSyntaxSequence(["^", 1, "_", 1], null, null, index) ||
		this.CheckSyntaxSequence(["_", 1, "^", 1], null, null, index)
	) 
};
CLaTeXParser.prototype.CheckIsDegreeOrIndex = function (index) {
	return (
		this.CheckSyntaxSequence(["_", "{"], "^", null, index) ||
		this.CheckSyntaxSequence(["^", "{"], "_", null, index)
	)
};
CLaTeXParser.prototype.GetError = function (rule) {
	var str = '';

	var strMinOne  = this.arrAtomsOfFormula[this.indexOfAtom - 1]
	if (strMinOne != undefined && this.indexOfAtom - 1 >= 0) {
		str += strMinOne;
	} 
	
	var now = this.arrAtomsOfFormula[this.indexOfAtom];
	if (now != undefined) {
		str += now;
	}
	
	var strPlusOne  = this.arrAtomsOfFormula[this.indexOfAtom + 1]
	if (strPlusOne != undefined && this.indexOfAtom + 1 < this.arrAtomsOfFormula.length) {
		str += strPlusOne;
	}

	var strPlusTwo  = this.arrAtomsOfFormula[this.indexOfAtom + 2]
	if (strPlusTwo != undefined && this.indexOfAtom + 2 < this.arrAtomsOfFormula.length) {
		str += strPlusTwo;
	}

	console.error(rule, '\nПримерное место ошибки:', "..."+str+"...");
	this.Root.Remove_Content(0, this.Root.Content.length);
	this.isError = true;
}
CLaTeXParser.prototype.CheckIsStrFAtomUndefined = function(strFAtom) {
	return (strFAtom === undefined || strFAtom === null)
}
CLaTeXParser.prototype.GetErrorNames = function(map) {
	var strSentence = '';
	for (var vegetable in map) {
		strSentence += vegetable + ', ';
	}
	strSentence = '(' + strSentence + '...' + ')';
	return strSentence
}
//Fraction
CLaTeXParser.prototype.AddFraction = function(FormArgument, strFAtom) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	// ^{ ... }/_{ ... }
	var isInlineFraction = this.CheckSyntaxSequence(["^", 1, "/", "_", 1], null, true);
	var typeOfFraction;
	
	if (isInlineFraction === true) {
		typeOfFraction = SKEWED_FRACTION;
	} 
	else {
		typeOfFraction = GetTypeOfFrac[strFAtom];
	}
	
	if (typeof typeOfFraction === 'number') {
		var Fraction = this.CreateFraction(FormArgument, typeOfFraction);
		this.FillFracContent(Fraction, typeOfFraction);
	}
};
CLaTeXParser.prototype.CreateFraction = function (FormArgument, typeOfFraction) {
	var Fraction;
	this.Pr.type = typeOfFraction;

	if (typeOfFraction === LITLE_DEFAULT) {
		this.Pr.type = 0;
		var Box = this.CreateLitleBox(FormArgument);
		Fraction = Box.Add_Fraction(this.Pr, null, null);
	}

	else if (typeOfFraction !== LITLE_DEFAULT) {
		Fraction = FormArgument.Add_Fraction(this.Pr, null, null);
	}

	return Fraction;
};
CLaTeXParser.prototype.FillFracContent = function (FormArgument, typeOfFraction) {
	this.StartLexer(FormArgument.getNumeratorMathContent());
	this.StartLexer(FormArgument.getDenominatorMathContent());
};
var GetTypeOfFrac = {
	'\\frac' : BAR_FRACTION,
	'\\tfrac': LITLE_DEFAULT,
	'\\sfrac': SKEWED_FRACTION,
	'\\nicefrac': LINEAR_FRACTION,
	'\\dfrac': BAR_FRACTION,
	'\\binom': NO_BAR_FRACTION
}
CLaTeXParser.prototype.CheckSyntaxOfFraction = function(strFAtom) {
	//binom must be processed if AddBinom func
	if (typeof GetTypeOfFrac[strFAtom] === 'number' && strFAtom != '\\binom') {
		
		if (
			this.CheckSyntaxSequence(["{", "{"]) ||
			this.CheckSyntaxSequence(["^", 1, "/", "_", 1])
		) {
			return true;
		} 
		
		else {
			var strMessage = this.GetErrorNames(GetTypeOfFrac);
			this.GetError("Error while read: " + strMessage)
			return false;
		}
	}
	return false
}
//Limit
CLaTeXParser.prototype.AddLimit = function (FormArgument, strFAtom) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	if (!(this.CheckSyntaxSequence(["_", '{'], '^') || this.CheckSyntaxSequence(["^", '{'], '_'))) {
		var strMessage = this.GetErrorNames(GetTypeOfLimit);
		this.GetError("Error while read: " + strMessage)
	}
	
	var typeOfLimit = GetTypeOfLimit[strFAtom];
	
	var typeOfBottom = this.CheckSyntax(
		[['^', 1], 'BOTTOM_DEGREE'],
		[['_', 1], 'BOTTOM_INDEX']
	)
	
	if (typeOfBottom) {
		var Limit = this.CreateLimit(FormArgument, typeOfBottom);
		this.FillLimitContent(Limit, typeOfLimit);
	}
};
CLaTeXParser.prototype.CreateLimit = function (FormArgument, typeOfBottom) {
	this.Pr.type = GetTypeOfIndexLimit[typeOfBottom];
	var Limit = FormArgument.Add_Limit(this.Pr, null, null); 
	return Limit;
};
CLaTeXParser.prototype.FillLimitContent = function(Limit, typeOfLimit) {
	Limit.getFName().Add_Text(typeOfLimit, this.Paragraph, STY_PLAIN);
	this.StartLexer(Limit.getIterator());
};
var GetTypeOfIndexLimit = {
	'BOTTOM_DEGREE': 1,
	'BOTTOM_INDEX': 0
};
var GetTypeOfLimit = {
	'\\lim': 'lim',
	'\\inf': 'inf',
	'\\sup': 'sup',
	'\\max': 'max',
	'\\min': 'min'
}
//Function
CLaTeXParser.prototype.AddFunction = function (FormArgument, strFAtom) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}
	var typeOfFunction = GetTypeOfFunction[strFAtom];
	var Function = this.CreateFunction(FormArgument)

	if (typeOfFunction === 1) {
		var isDegreeOrIndex = this.CheckIsDegreeOrIndex();
		var isDegreeAndIndex = this.CheckIsDegreeAndIndex();
		var strName = strFAtom.slice(1);
		
		if (isDegreeAndIndex || isDegreeOrIndex) {
			
			this.AddScript(Function.getFName(), strName, isDegreeOrIndex, isDegreeAndIndex);
			this.StartLexer(Function.getArgument());
		}
		else {
			Function.getFName().Add_Text(strName, this.Paragraph);
			this.StartLexer(Function.getArgument());
		}
	}

	else if (typeOfFunction === 2) {
		this.AddLimit(Function.getFName(), strFAtom);
		this.StartLexer(Function.getArgument());
	}

	else if (typeOfFunction === 3) {
		Function.getFName().Add_Text(strFAtom, this.Paragraph);
		this.StartLexer(Function.getArgument());
	}
};
CLaTeXParser.prototype.CreateFunction = function (FormArgument) {
	var Function = FormArgument.Add_Function(this.Pr, null, null);
	return Function;
};
var GetTypeOfFunction = {
	"\\cos": 1,
	"\\sin": 1,
	"\\tan": 1,
	"\\cot": 1,
	"\\arcsin": 1,
	"\\arccos": 1,
	"\\arctan": 1,
	"\\arccot": 1,
	"\\sinh": 1,
	"\\cosh": 1,
	"\\tanh": 1,
	"\\coth": 1,
	"\\sec": 1,
	"\\exp": 1,
	"\\csc": 1,

	"mod": 3,
	
	"\\lim": 2,
	"\\inf": 2,
	"\\sup": 2,
	"\\max": 2,
	"\\min": 2
};
//Script
CLaTeXParser.prototype.AddScript = function(FormArgument, strFAtom, isDegreeOrIndex, isDegreeAndIndex) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	this.CheckScriptErrorsLexer();

	var typeOfScript = this.GetTypeOfScript(isDegreeOrIndex, isDegreeAndIndex);
	var Script = this.CreateScript(FormArgument, typeOfScript);
	this.FillScriptBase(Script, strFAtom, typeOfScript);
};
CLaTeXParser.prototype.GetTypeOfANDScript = function(index) {
	return this.CheckSyntax(
		[['_', 1, '^', 1], 'SUB_SUP', index],
		[['^', 1, '_', 1], 'SUP_SUB', index],
		[['_', 1, '^', 1], 'SUB_SUP', index],
		[['^', 1, '_', 1], 'SUP_SUB', index]
	);
};
CLaTeXParser.prototype.GetTypeOfOrScript = function(index) {
	return this.CheckSyntax(
		[['_'], 'DEGREE_SUBSCRIPT', index],
		[['^'], 'DEGREE_SUPERSCRIPT', index]
	);
};
CLaTeXParser.prototype.CreateScript = function(FormArgument, type) {
	var isBothDegreeAndIndex = false;

	if (type == 'DEGREE_SUPERSCRIPT') {
		this.Pr.type = DEGREE_SUPERSCRIPT;
	}

	else if (type == 'DEGREE_SUBSCRIPT') {
		this.Pr.type = DEGREE_SUBSCRIPT;
	}
	
	else if (type == 'SUB_SUP' || type == 'SUP_SUB') {
		isBothDegreeAndIndex = true;
		this.Pr.type = DEGREE_SubSup;
	}

	var Script = FormArgument.Add_Script(isBothDegreeAndIndex, this.Pr, null, null, null);
	return Script;
};
CLaTeXParser.prototype.FillScriptBase = function(Script, name, typeOfScript) {
	this.AddSymbol(name, Script.getBase());
	this.FillScriptContent(Script, typeOfScript);
};
CLaTeXParser.prototype.FillScriptContent = function(Script, typeOfScript) {
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
	this.StartLexer(Iterator);
};
CLaTeXParser.prototype.FillScriptContentWriteSub = function(Script) {
	var Iterator = Script.getLowerIterator();
	this.StartLexer(Iterator);
};
CLaTeXParser.prototype.GetTypeOfScript = function(isOr, isAnd, index) {
	var type;
	if (isAnd) {
		type = this.GetTypeOfANDScript(index);
	} else if (isOr) {
		type = this.GetTypeOfOrScript(index);
	}
	return type
};
CLaTeXParser.prototype.CheckSupSubForLexer = function () {
	return (
		this.CheckIsDegreeAndIndex() || this.CheckIsDegreeOrIndex()
	);
};
CLaTeXParser.prototype.CheckScriptErrorsLexer = function () {
	if (!(this.CheckSyntaxSequence(["_", "{", "^", "{"]) ||
		this.CheckSyntaxSequence(["^", "{", "_", "{"]) || 
		this.CheckSyntaxSequence(["^", "{"], '_') ||
		this.CheckSyntaxSequence(["_", "{"], '^'))
	) {
		this.GetError('Проблема с индексом или степенью: ^{}, _{}, ^{}_{}')
	}
};
//Radical
CLaTeXParser.prototype.AddRadical = function (FormArgument) {
	var typeOfRadical = this.GetTypeOfRadical();

	var Radical = this.CreateRadical(FormArgument, typeOfRadical);
	this.FillRadicalContent(Radical, typeOfRadical);
};
CLaTeXParser.prototype.CreateRadical = function (FormArgument, typeOfRadical) {
	if (typeOfRadical == SQUARE_RADICAL) {
		this.Pr.degHide = true;
	}
	else if (typeOfRadical == DEGREE_RADICAL) {
		this.Pr.degHide = false;
	}

	var Radical = FormArgument.Add_Radical(this.Pr, null, null);
	return Radical
};
CLaTeXParser.prototype.GetTypeOfRadical = function () {
	if (this.CheckFutureAtom() == '[') {
		return DEGREE_RADICAL;
	} else {
		return SQUARE_RADICAL;
	}
}
CLaTeXParser.prototype.FillRadicalContent = function (Radical, typeOfRadical) {
	if (typeOfRadical == DEGREE_RADICAL) {
		if (this.CheckSyntaxSequence(["["])) {
			this.StartLexer(Radical.getDegree());
		}
		else {
			this.GetError('Проблема с индексом корня: sqrt[_]{}')
		}
	}

	if (this.CheckSyntaxSequence(["{"])) {
		this.StartLexer(Radical.getBase());
	}

	else {
		this.GetError('Проблема с данными корня: sqrt[]{_}')
	}
};
//Bracet
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
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	var Script;
	var strTypeOfScript;
	if (!strFAtom) {
		strFAtom = this.GetNextAtom();
	}

	if (strFAtom != '\\left') {
		var strOpenBracet = strFAtom;
		var strCloseBracet = GetCloseBracet[strOpenBracet];
		if (!strCloseBracet) {
			return
		}

		var indexOfCloseBracet = this.CheckCloseBracet(strOpenBracet, strCloseBracet);
		var OutputMiddleFunc = this.MiddleCount(indexOfCloseBracet);
		var intCountOfMiddle = OutputMiddleFunc[0];
		var strTypeOfMiddle = OutputMiddleFunc[1]; //todo

		strOpenBracet = GetBracetCode[strOpenBracet];
		strCloseBracet = GetBracetCode[strCloseBracet];

		var Bracet = this.CreateBracetBlock(
			FormArgument,
			strOpenBracet,
			strCloseBracet,
			intCountOfMiddle
			); 
		
		this.FillBracetBlockContent(Bracet, intCountOfMiddle, GetCloseBracet[strFAtom]);
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
		} else {
			this.GetError('Нет закрывающей скобки: \left( \middle| \right)')
		}

		var isBeforeBracetsDegreeOrIndex = this.CheckIsDegreeOrIndex(indexOfCloseBracet + 2)
		var isBeforeBracetsDegreeAndIndex = this.CheckIsDegreeAndIndex(indexOfCloseBracet + 2)
		if(isBeforeBracetsDegreeOrIndex || isBeforeBracetsDegreeAndIndex) {
			strTypeOfScript = this.GetTypeOfScript(isBeforeBracetsDegreeOrIndex, isBeforeBracetsDegreeAndIndex, indexOfCloseBracet + 2);
			Script = this.CreateScript(FormArgument, strTypeOfScript);
			FormArgument = Script.getBase();
		}

		strOpenBracet = GetBracetCode[strStartBracet];
		strCloseBracet = GetBracetCode[strCloseBracet];

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
		
		if (Script !== undefined) {
			this.FillScriptContent(Script, strTypeOfScript)
		}
	}
};
CLaTeXParser.prototype.CheckCloseBracet = function(strOpenBracet, strCloseBracet) {
	if (!strCloseBracet) {
		strCloseBracet = GetCloseBracet[strOpenBracet];
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
	}

	else {
		this.StartLexer(BracetBlock.getElementMathContent(0), exit);
	}
};
var GetCloseBracet = {
	//["|", "|",
	"(": ")",
	"{": "}",
	"[": "]",
	"\\{": "\\}",
	//["\\|", "\\|",
	"\\langle": "\\rangle",
	"\\lfloor": "\\rfloor",
	"\\lceil": "\\rceil",
	"\\ulcorner": "\\urcorner",
	"/": "\\backslash",
	"\\left": "\\right"
};
var GetBracetCode = {
	"(": null,
	")": null,
	"{": 123,
	"}": 125,
	"\\{": 123,
	"\\}": 125,
	"[": 91,
	"]": 93,
	"\\[": 91,
	"\\]": 93,
	"|": 124,
	"\\|": 8214,
	"\\langle": 10216,
	"\\rangle": 10217,
	"\\lfloor": 0x230a,
	"\\rfloor": 0x230b,
	"\\lceil": 0x2308,
	"\\rceil": 0x2309,
	"\\ulcorner": 0xcbb9,
	"\\urcorner": 0xcbba,
	"/": 0x2f,
	"\\backslash": 0x5c,
	".": "empty"
};
CLaTeXParser.prototype.CheckIsBrackets = function (strFAtom) {
	var strTempAtom = this.CheckFutureAtom(-1);
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
CLaTeXParser.prototype.CheckBraketsLatex = function(strFAtom) {
	return (
		this.CheckIsBrackets(strFAtom) &&
		this.CheckFutureAtom(-2) != '\\sqrt' &&
		this.CheckFutureAtom(-1) != '\\pmod' &&
		this.CheckFutureAtom(-2) != '_' &&
		this.CheckFutureAtom(-2) != '^'
	)
};
//Binom
CLaTeXParser.prototype.AddBinom = function (FormArgument) {
	
	if (this.CheckSyntaxSequence(["{", "{"])) {
		var Delimiter = this.AddBracet(FormArgument);
		var BaseMathContent = Delimiter.getElementMathContent(0);
		this.AddFraction(BaseMathContent, '\\binom');
	}

	else {
		this.GetError('Проблема с биномом: \binom{}{}')
	}
};
//Mod
CLaTeXParser.prototype.AddPMod = function (FormArgument) {
	
	if (this.CheckSyntaxSequence(["{"])) {
		var Delimiter = this.AddBracet(FormArgument);
		this.AddFunction(Delimiter.getElementMathContent(0), "mod");
	}

	else {
		this.GetError('Проблема с модулем: \pmod{}')
	}
};
//Large Operator
CLaTeXParser.prototype.AddLargeOperator = function (FormArgument, strFAtom) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	var strNameOfLargeOperator = CheckIsLargeOperator[strFAtom];
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
};
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
};
var CheckIsLargeOperator = {
	"\\sum": 8721,
	"\\prod": 8719,
	"\\coprod": 8720,
	"\\bigcup": 8899,
	"\\bigcap": 8898,
	"\\bigvee": 8897,
	"\\bigwedge": 8896,
};
//Accent 
CLaTeXParser.prototype.AddAccent = function (FormArgument, name) {
	if (this.CheckIsStrFAtomUndefined(name)) {
		return
	}
	
	if (this.CheckSyntaxSequence(["{"])) {
		var Accent;
		var intPosition = null;
		
		if (GetIsAddBar[name]) {
			
			if (name == "\\overline") {
				intPosition = 0;
			}
		
			else if (name == "\\underline") {
				intPosition = 1;
			}

			Accent = FormArgument.Add_Bar({ ctrPrp: this.Pr.ctrPrp, pos: intPosition }, null);
		}
		
		else if (GetIsAddGroupChar[name]) {
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
				GetAccent[name],
				null
			);
		}

		this.StartLexer(Accent.getBase())
	}
	else {
		this.GetError("Проблема с акцентом: hat{}, overline{}...");
	}
};
var GetIsAddBar = {
	"\\overline": true,
	"\\underline": true
};
var GetIsAddGroupChar = {
	"\\overbrace": true,
	"\\underbrace": true,
};
CLaTeXParser.prototype.CheckIsAccent = function (strFAtom) {
	return (
		GetAccent[strFAtom] ||
		GetIsAddBar[strFAtom] ||
		GetIsAddGroupChar[strFAtom]
	);
};
var GetAccent = {
	"\\widetilde": 771,
	"\\widehat": 770,
	"\\overrightarrow": 8407,
	"\\overleftarrow": 8406,
	"\\dot": 775,
	"\\ddot": 776,
	"\\hat": 770,
	"\\check": 780,
	"\\acute": 769,
	"\\grave": 768,
	"\\bar": 773,
	"\\vec": 8407,
	"\\breve": 774,
	"\\tilde": 771
};
//Inetegral
CLaTeXParser.prototype.AddIntegral = function (FormArgument, strFAtom) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	var Integral = this.CreateIntegral(FormArgument, strFAtom);
	this.FillIntegralContent(Integral);
};
CLaTeXParser.prototype.CreateIntegral =  function(FormArgument, strFAtom) {
	var strNameOfIntegral = strFAtom;
	var intCountOfIntegral = GetCountOfIntegral[strNameOfIntegral];
	var isOTypeIntegral = GetTypeOfIntegral[strNameOfIntegral];
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
			hideBoxes.supHide = false;
		}
		else if (this.CheckFutureAtom() == "_") {
			hideBoxes.subHide = false;
			hideBoxes.supHide = true;
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
};
CLaTeXParser.prototype.FillIntegralContent =  function(Integral) {
	if (this.CheckFutureAtom() == '^') {
		this.StartLexer(Integral.getSupMathContent());
		
		if (this.CheckFutureAtom() == '_') {
			this.StartLexer(Integral.getSubMathContent());
		}
	}

	else if (this.CheckFutureAtom() == '_') {
		this.StartLexer(Integral.getSubMathContent());
		
		if (this.CheckFutureAtom() == '^') {
			this.StartLexer(Integral.getSupMathContent());
		}
	}

	this.StartLexer(Integral.getBase());
};
var GetCountOfIntegral = {
	"\\int": 1,
	"\\oint": 1,
	"\\iint": 2,
	"\\oiint": 2,
	"\\iiint": 3,
	"\\oiiint": 3
};
var GetTypeOfIntegral = {
	"\\int": false,
	"\\oint": true,
	"\\iint": false,
	"\\oiint": true,
	"\\iiint": false,
	"\\oiiint": true
};
//Matrix
CLaTeXParser.prototype.AddMatrix = function (FormArgument) {
	this.isInMatrix = true;

	this.GetNextAtom(); // skip {
	var typeOfMatrix = this.GetNextAtom();
	this.GetNextAtom(); // skip }

	var arrTempMatrixData = this.CreateMatrix(FormArgument, typeOfMatrix);
	console.log(arrTempMatrixData)
	var Matrix = arrTempMatrixData[0];
	var arrExitData = arrTempMatrixData[1];
	var intRowsCount = arrTempMatrixData[2];
	var intColsCount = arrTempMatrixData[3];

	this.FillMatrixContent(
		Matrix,
		arrExitData,
		intRowsCount,
		intColsCount
	);

	this.GetNextAtom(); // skip {
	if (typeOfMatrix != this.GetNextAtom()) {
		console.log('error in matrix')
	}
	this.GetNextAtom(); // skip }
	this.isInMatrix = false;
};
CLaTeXParser.prototype.CreateMatrix = function(FormArgument, typeOfMatrix) {
	var Bracets = []

	if (this.CheckFutureAtom() == '{') {
		do {
			var strFAtom = this.GetNextAtom();
		} while (strFAtom != '}');
	}

	if (typeOfMatrix == "pmatrix") {
		Bracets.push(GetBracetCode["("], GetBracetCode[")"])
	}
	else if (typeOfMatrix == "bmatrix") {
		Bracets.push(GetBracetCode["["], GetBracetCode["]"])
	}
	else if (typeOfMatrix == "Bmatrix") {
		Bracets.push(GetBracetCode["{"], GetBracetCode["}"])
	}
	else if (typeOfMatrix == "vmatrix") {
		Bracets.push(GetBracetCode["|"], GetBracetCode["|"])
	}
	
	var intColsCount = 1;
	var intRowsCount = 1;
	var strTempArr;
	var intIndex = 0;

	var arrBufferExit = [];
	do {
		strTempArr = this.CheckFutureAtom(intIndex);
		if (strTempArr == "&") {
			arrBufferExit.push('&');
		}
		if (strTempArr == "&" && intRowsCount == 1) {
			intColsCount++;
		}
		if (strTempArr == "\\") {
			intRowsCount++;
			arrBufferExit.push('\\');
		}
		intIndex++;
	} while (strTempArr != "\\end");
	arrBufferExit.push('\\end');

	if (typeOfMatrix != 'matrix' && typeOfMatrix != 'array') {
		var Matrix = FormArgument.Add_MatrixWithBrackets(
			Bracets[0],
			Bracets[1],
			this.Pr.ctrPrp,
			intRowsCount,
			intColsCount,
			false,
			[]
		);
	}

	else {
		var Matrix = FormArgument.Add_Matrix(
			this.Pr.ctrPrp,
			intRowsCount,
			intColsCount,
			false,
			[]
		);
	}

	return[Matrix, arrBufferExit, intRowsCount, intColsCount];
};
CLaTeXParser.prototype.FillMatrixContent = function(Matrix, arrExitData, intRowsCount, intColsCount) {
	var intIndexOfExitBuffer = 0;

	for (var RowIndex = 0; RowIndex < intRowsCount; RowIndex++) {
		
		for (var ColIndex = 0; ColIndex < intColsCount; ColIndex++) {
			var MathContent = Matrix.getContentElement(RowIndex, ColIndex);
			this.StartLexer(MathContent, arrExitData[intIndexOfExitBuffer]);
			var to = MathContent.GetTextContent().str
			intIndexOfExitBuffer++;
		}
	}
};
CLaTeXParser.prototype.CheckIsMatrix = function () {
	return (
		this.CheckElementSequence(["\\begin", "{", "matrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "pmatrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "bmatrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "Bmatrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "vmatrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "Vmatrix", "}"], true) ||
		this.CheckElementSequence(["\\begin", "{", "array", "}"], true) 
	);
};
//Text and symbols
CLaTeXParser.prototype.AddSymbol = function (strFAtom, FormArgument, type, typeText) {
	if (this.CheckIsStrFAtomUndefined(strFAtom)) {
		return
	}

	if (this.CheckFutureAtom() == '\\' && !this.isInMatrix) {
		if (type) {
			if (type) {
				this.Pr['scr'] = type;
				FormArgument.Add_Symbol(strFAtom.charCodeAt(0), typeText, {brk: true});
			}
		} else {
			
			if (strFAtom.length > 1) {
				FormArgument.Add_Text(strFAtom, this.Paragraph, {brk: true});
			} 
			
			else {
				FormArgument.Add_Symbol(strFAtom.charCodeAt(0), this.Pr, {brk: true});
			}
		}
		this.GetNextAtom()
	}

	else {
	
		if (type) {
			this.Pr['scr'] = type;
			FormArgument.Add_Symbol(strFAtom.charCodeAt(0), typeText, this.Pr);
		}

		var strCode = this.arrLaTeXSymbols.get(strFAtom);
		if (strCode) {
			FormArgument.Add_Symbol(strCode, this.Pr);
		}

		else if (strFAtom.length > 1) {
			FormArgument.Add_Text(strFAtom, this.Paragraph);
		}
		else {
			FormArgument.Add_Symbol(strFAtom.charCodeAt(0), this.Pr);
		}
	}
};
CLaTeXParser.prototype.CheckIsText = function (strFAtom) {
	if (GetBracetCode[strFAtom]) {
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
CLaTeXParser.prototype.AddMathText = function(FormArgument, strFAtom) {
	var type = CheckMathText[strFAtom];
	var objSty = CheckMathTextSty[strFAtom];

	var strFAtom = this.GetNextAtom();

	do {
		strFAtom = this.GetNextAtom();
		
		if (strFAtom != '{' && strFAtom != '}') {

			if (strFAtom.length == 1) {
				this.AddSymbol(strFAtom, FormArgument, type, objSty);
			}
			
			else if (strFAtom.length > 1) {
				
				for (var i = 0; i < strFAtom.length; i++) {
					this.AddSymbol(strFAtom[i], FormArgument, type, objSty);
				}
			}
		}
	} while (strFAtom != '}');
};
var CheckMathText = {
	'\\mathnormal': 0,
	'\\mathbf': 0,
	'\\mathrm': 0,
	'\\mathcal': 1,
	'\\mathfrak': 2,
	'\\mathbb': 3,
	'\\mathsf': 4,
	'\\mathtt': 5
};
var CheckMathTextSty = {
	'\\mathnormal': {Italic: true, Bold: false},
	'\\mathbf': {Italic: false, Bold: true},
	'\\mathsf': {Italic: false, Bold: false},
	'\\mathtt': {Italic: false, Bold: false},
	'\\mathfrak': {Italic: false, Bold: false},
	'\\mathrm': {Italic: false}
};
/**
 * @param Parser
 * @param FormArgument Функция в которую будет записываться контент.
 * @param exitIfSee Число элементов которые может обработать функция, или символ при нахождении которых функция завершит работу.
 */
function CLaTeXLexer(Parser, FormArgument, exitIfSee) {
	if (Parser.isError) {
		return
	}
	//\left.\frac{x^3}{3}\right|_0^1
	var intFAtoms = 0;
	var strFAtom = 0;
	do {
		if (Parser.isError) {
			return
		}

		strFAtom = Parser.GetNextAtom();

		//check
		if (Parser.ExitFromLexer(strFAtom, exitIfSee) ) {
			return
		};

		//construction
		if (GetTypeOfFunction[strFAtom] != null) {
			Parser.AddFunction(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (Parser.CheckFutureAtom() == '\\' && !Parser.isInMatrix) {
			Parser.AddSymbol(strFAtom, FormArgument)
		}

		else if (Parser.CheckSyntaxOfFraction(strFAtom) && !Parser.isError) {
			Parser.AddFraction(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (strFAtom == "\\binom") {
			Parser.AddBinom(FormArgument);
			intFAtoms++;
		}

		else if (strFAtom == "\\sqrt" && !Parser.isError) {
			Parser.AddRadical(FormArgument);
			intFAtoms++;
		}

		else if (strFAtom == "\\bmod" && !Parser.isError) {
			FormArgument.Add_Box(Parser.Pr, "mod")
			intFAtoms++;
		}

		else if (strFAtom == "\\pmod" && !Parser.isError) {
			Parser.AddPMod(FormArgument);
			intFAtoms++;
		}

		else if (typeof CheckMathText[strFAtom] == 'number' && !Parser.isError) {
			Parser.AddMathText(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (CheckIsLargeOperator[strFAtom] && !Parser.isError) {
			Parser.AddLargeOperator(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (GetCountOfIntegral[strFAtom] && !Parser.isError) {
			Parser.AddIntegral(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (Parser.CheckIsAccent(strFAtom) && !Parser.isError) {
			Parser.AddAccent(FormArgument, strFAtom);
			intFAtoms++;
		}

		else if (Parser.CheckIsMatrix() && !Parser.isError) {
			Parser.AddMatrix(FormArgument);
			intFAtoms++;
		}

		else if (Parser.CheckSupSubForLexer() && !Parser.isError) {
			var isDegreeOrIndex = Parser.CheckIsDegreeOrIndex();
			var isDegreeAndIndex = Parser.CheckIsDegreeAndIndex();
			Parser.AddScript(FormArgument, strFAtom, isDegreeOrIndex, isDegreeAndIndex);
			intFAtoms++;
		}

		else if (Parser.CheckBraketsLatex(strFAtom) && !Parser.isError) {
			Parser.AddBracets(FormArgument, strFAtom);
			if (exitIfSee == Parser.CheckFutureAtom(-1)) {
				return
			}
			intFAtoms++;
		}

		else if (Parser.CheckIsText(strFAtom) && !Parser.isError) {
			Parser.AddSymbol(strFAtom, FormArgument);
			intFAtoms++;
		}

		//post check
		if (typeof exitIfSee === "number" && intFAtoms >= exitIfSee) {
			return;
		}

	} while (strFAtom != undefined);
};
//To LaTex
function ToLaTex(Root) {
	this.Root = Root;
	this.objTempData = {};
	this.objString = {
		arr: []
	};
	this.scr;
	this.brk = false;
};
//Service
ToLaTex.prototype.ConvertData = function(WriteObject, inputObj) {
	if (inputObj) {
		if (inputObj.Content) {
			if (inputObj.Content.length > 0) {
				for (var index = 0; index < inputObj.Content.length; index++) {
					
					var name = index + '_' + inputObj.Content[index].constructor.name;
					var CName = inputObj.Content[index].constructor.name
					var content = inputObj.Content[index];
					var data = {};
					
					if (CName == 'CFraction' || CName == 'CDegree') {
						data = {
							type: content.Pr.type
						}
					}
					else if (CName == 'CRadical') {
						data = {
							degHide: content.Pr.degHide
						}
					}
					else if (CName == 'CMathMatrix') {
						data = {
							nRow: content.nRow,
							nCol: content.nCol
						}
					}
					else if(CName == 'CNary') {
						data = {
							chr: content.Pr.chr,
							limLoc: content.Pr.limLoc
						}
					}
					else if(CName == 'CAccent') {
						data = {
							chr: content.Pr.chr
						}
					}
					else if(CName == 'CBar') {
						data = {
							pos: content.Pr.pos
						}
					}
					else if(CName == 'CEqArray') {
						data = {
							row: content.Pr.row
						}
					}
					else if(CName == 'ParaRun' && content.Content.length > 0) {
						data = {
							scr: content.MathPrp.scr,
							brk: content.MathPrp.brk,
							bold: content.CompiledPr.Bold,
							italic: content.CompiledPr.Italic,
						}
					}
					else if(CName == 'CDelimiter') {
						data = {
							begOper: content['begOper'].code,
							endOper: content.endOper.code,
							sepOper: content.sepOper.code,
							nCol: content.nCol
						}
					}

					if (Object.keys(data).length > 0) 
					{
						WriteObject[name] = {
							data: data
						}
					}
					else 
					{
						WriteObject[name] = {}
					}
					
					var isEmpty = this.ConvertData(WriteObject[name], content);
					
					if (isEmpty) {
						delete WriteObject[name]
					}
				}
			}
		}
		else {
			WriteObject[inputObj.constructor.name] = String.fromCharCode(inputObj.getCodeChr());
		}	
	}
	return this.CheckIsObjectEmpty(WriteObject)
};
ToLaTex.prototype.CheckIsObjectEmpty = function(obj) {
	for (var key in obj) {
		return false;
	}
	
	return true;
};
ToLaTex.prototype.GetNamesOfObject = function(obj) {
	var names = Object.keys(obj);
	
	names = names.filter(function(item) {
		return item !== 'data'
	})

	return names
};
ToLaTex.prototype.Convert = function(obj, start, end) {
	if (start) {
		this.objString.arr.push(start);
	}

	var propert = this.GetNamesOfObject(obj);
	
	for (var index = 0; index < propert.length; index++) {

		var name = propert[index];
		var nameForCheck = name.split('_')[1];

		if (nameForCheck == 'CEqArray') {
			this.AddCEqArray(name, obj);
		}
		else if (nameForCheck == 'CFraction') {
			this.AddFraction(name, obj);
		}
		else if (nameForCheck == 'CAccent') {
			this.AddAccent(name, obj);
		}
		else if (nameForCheck == 'CMathFunc') {
			this.AddFunction(name, obj);
		}
		else if (nameForCheck == 'CNary') {
			this.AddNary(name, obj);
		}
		else if (nameForCheck == 'CRadical') {
			this.AddRadical(name, obj);
		}
		else if (nameForCheck == 'CDegree') {
			this.AddDegree(name, obj);
		}
		else if (nameForCheck == 'CDelimiter') {
			this.AddBracets(name, obj);
		}
		else if (nameForCheck == 'CDegreeSubSup') {
			this.AddDegreeSubSup(name, obj);
		}
		else if (nameForCheck == 'CBar') {
			this.AddBar(name, obj);
		}
		else if (nameForCheck == 'CLimit') {
			this.AddLimit(name, obj);
		}
		else if (nameForCheck == 'CMathMatrix') {
			this.AddMatrix(name, obj);
		}
		else if (nameForCheck == 'ParaRun') {
			this.CheckParaRun(name, obj);
			if (this.brk == true) {
				this.objString.arr.push(' \\\\ ');
				this.brk = false;
			}
			this.Convert(obj[name])
		}
		else if (nameForCheck == 'CMathContent') {
			this.Convert(obj[name]);
		}
		else if (nameForCheck == 'CMathText') {
			this.AddText(name, obj);
		}
		else if (nameForCheck == 'CBox') {
			this.AddBox(name, obj);
		}
	}
	
	if (end) {
		this.objString.arr.push(end);
	}
};
//Processing
ToLaTex.prototype.AddCEqArray = function(name, obj) {
	var intRow = obj[name].data.row;

	if (intRow > 1) {
		var ArrayContent = this.GetNamesOfObject(obj[name]);
		for (var arr in ArrayContent) {
			this.Convert(obj[name][ArrayContent[arr]], ' ', ' \\\\')
		}
	} else {
		this.Convert(obj[name]);
	}
};
ToLaTex.prototype.AddFraction = function(name, obj) {
	var intType = obj[name].data.type; 
	
	if (intType == 1) {
		var fracContent = this.GetNamesOfObject(obj[name]);
		this.Convert(obj[name][fracContent[0]], '^{', '}/_');
		this.Convert(obj[name][fracContent[1]], '{', '}');
	}
	else {
		this.objString.arr.push('\\frac');
		for (var innerObj in obj[name]) {
			if (innerObj != 'data') {
				this.Convert(obj[name][innerObj], '{', '}');
			}
		}
	}
	
};
ToLaTex.prototype.AddBracets = function(name, obj) {
	if (
		obj[name]['0_CMathContent']['1_CFraction'] && 
		obj[name]['0_CMathContent']['1_CFraction'].data.type == 3
	){
		this.AddBinom('1_CFraction', obj[name]['0_CMathContent']);
	}

	else if (this.CheckIsMod(name, obj)) {
		this.AddMod(name, obj);
	}

	else {
		var strLeft = (obj[name].data.begOper == null) 
			? '\\left.' 
			: '\\left' + String.fromCharCode(obj[name].data.begOper);

		var strRight =  (obj[name].data.endOper == null) 
			? '\\right.'
			: '\\right' + String.fromCharCode(obj[name].data.endOper);

		var strSeparator = (obj[name].data.sepOper == null) 
			? '\\middle|' 
			: '\\middle' + String.fromCharCode(obj[name].data.sepOper);

		var intCount = obj[name].data.nCol;

		if (intCount >= 1) {
			this.objString.arr.push(strLeft);
			var index = 0;

			for (var frac in obj[name]) {
				if (index == intCount || index == 0) {
					this.Convert(obj[name][frac]);
				}
				else {
					this.Convert(obj[name][frac], null, strSeparator);
				}
				index++;
			}
			this.objString.arr.push(strRight);
		}
	}
};
ToLaTex.prototype.AddDegree = function(name, obj)  {
	var objDegree = this.GetNamesOfObject(obj[name]);
	var intType = obj[name].data.type;

	this.Convert(obj[name][objDegree[0]])
	
	if (intType == 1) {
		this.objString.arr.push('^')
	}
	
	else if (intType == -1) {
		this.objString.arr.push('_')
	}

	console.log(obj[name][objDegree[1]])
	this.Convert(obj[name][objDegree[1]], '{', '}')
};
ToLaTex.prototype.AddRadical = function(name, obj) {
	var objRadical = this.GetNamesOfObject(obj[name]);
	var isDegHide = obj[name].data.degHide;
	
	this.objString.arr.push('\\sqrt');

	if (!isDegHide) {
		this.Convert(obj[name][objRadical[0]], '[', ']');
	}
	this.Convert(obj[name][objRadical[1]], '{', '}');
};
ToLaTex.prototype.AddBar = function(name, obj) {
	var intType = obj[name].data.pos;
	var strType;

	if (intType == 0) {
		strType = '\\overline{';
	}
	else if (intType == 1) {
		strType = '\\underline{';
	}

	if (typeof strType == 'string') {
		this.Convert(obj[name]['0_CMathContent'], strType, '}');
	}
};
ToLaTex.prototype.AddDegreeSubSup = function(name, obj) {
	var objDegree = this.GetNamesOfObject(obj[name]);
	
	this.Convert(obj[name][objDegree[0]], null, '^{');
	this.Convert(obj[name][objDegree[1]], null, '}_{');
	this.Convert(obj[name][objDegree[2]], null, '}');
};
ToLaTex.prototype.AddFunction = function(name, obj) {
	this.objString.arr.push('\\');

	for (var indexInner in obj[name]) {
		this.Convert(obj[name][indexInner])
	}
};
ToLaTex.prototype.AddBinom = function(name, obj) {
	this.objString.arr.push('\\binom');

	for (var indexInner in obj[name]) {
		if (indexInner != 'data') {
			this.Convert(obj[name][indexInner], '{', '}');
		}
	}
};
ToLaTex.prototype.AddNary = function(name, obj) {
	var strChr = obj[name].data.chr;
	var strTypeOfLargeOperator = GetNaryCode[strChr];
	
	this.objString.arr.push(strTypeOfLargeOperator);

	if (obj[name].data.limLoc == false) {
		this.objString.arr.push('\\limits');
	}

	var objIntegral = this.GetNamesOfObject(obj[name]);

	var objIndex = obj[name][objIntegral[0]];
	var objDegree =  obj[name][objIntegral[1]];
	var objBase = obj[name][objIntegral[2]];

	var strCodeOfIndexText = objIndex['0_ParaRun']['0_CMathText'].CMathText;
	var strCodeOfDegreeText = objDegree['0_ParaRun']['0_CMathText'].CMathText;

	if (strCodeOfIndexText.charCodeAt() != 11034) {
		this.Convert(objIndex, '_{', '}');
	}
	if (strCodeOfDegreeText.charCodeAt() != 11034) {
		this.Convert(objDegree, '^{', '}');
	}
	this.Convert(objBase);
};
var GetNaryCode = {
	undefined: '\\int',
	8748: '\\iint',
	8749: '\\iiint',
	8750: '\\oint',
	8751: '\\oiint',
	8752: '\\oiiint',
	8721: '\\sum',
	8899: '\\bigcup',
	8898: '\\bigcap',
	8719: '\\prod',
	8720: '\\coprod',
	8897: '\\bigvee',
	8896: '\\bigwedge'
};
ToLaTex.prototype.AddLimit = function(name, obj) {
	var objDegree = Object.keys(obj[name]);
	this.Convert(obj[name][objDegree[0]], null, '_{');
	this.Convert(obj[name][objDegree[1]], null, '}');
};
ToLaTex.prototype.AddAccent = function(name, obj) {
	var intType = obj[name].data.chr;
	var strType = GetCodeAccent[intType] + '{';

	this.Convert(obj[name]['0_CMathContent'], strType, '}');
};
ToLaTex.prototype.AddMod = function(name, obj) {
	var objModContent = obj[name]['0_CMathContent']['1_CMathFunc']['1_CMathContent'];
	this.Convert(objModContent, '\\pmod{', '}');
};
ToLaTex.prototype.AddBox = function(name, obj) {
	var objBoxContent = obj[name]['0_CMathContent']['0_ParaRun'];
	
	if (
		objBoxContent != undefined && 
		objBoxContent['0_CMathText'].CMathText == 'm' &&
		objBoxContent['1_CMathText'].CMathText == 'o' &&
		objBoxContent['2_CMathText'].CMathText == 'd'
	) 
	{
		this.objString.arr.push('\\bmod');
	}
	else
	{
		this.Convert(obj[name]);
	}

};
ToLaTex.prototype.AddMatrix = function(name, obj) {
	var objMatrixContent = this.GetNamesOfObject(obj[name]);
	var intCol = obj[name].data.nCol;
	var intRow = obj[name].data.nRow;

	var indexCol = 0;
	var indexRow = 0;

	this.objString.arr.push('\\begin{matrix}')

	for(var sub in objMatrixContent) {
		indexCol++
		
		if (indexCol < intCol) {
			this.Convert(obj[name][objMatrixContent[sub]], '', '&')
		} 

		else if (indexCol == intCol) {
			this.Convert(obj[name][objMatrixContent[sub]])
			this.objString.arr.push('\\\\')
			indexCol = 0;
			indexRow++;
		}
	}
	this.objString.arr.push('\\end{matrix}')
};
ToLaTex.prototype.CheckIsMod = function(name, obj) {
	if (obj[name]['0_CMathContent']['1_CMathFunc'] != undefined) {
		var objModContent = obj[name]['0_CMathContent']['1_CMathFunc']['0_CMathContent']['0_ParaRun']
	
		return (
			objModContent['0_CMathText'].CMathText == 'm' && 
			objModContent['1_CMathText'].CMathText == 'o' && 
			objModContent['2_CMathText'].CMathText == 'd'
		)
	}
	
};
var GetCodeAccent = {
	8407: '\\vec',
	773: '\\bar',
	774: '\\breve',
	776: '\\ddot',
	775: '\\dot',
	768: '\\grave',
	769: '\\acute',
	771: '\\tilde',
	780: '\\check',
	770: '\\hat',
};
ToLaTex.prototype.AddText = function(name, obj) {
	var strText = obj[name].CMathText;

	var strSymbol = this.GetCode.get(strText.charCodeAt())
	if (strSymbol !== null && strSymbol !== undefined) {
		strText = strSymbol
	}
	
	this.objString.arr.push(strText);
};
ToLaTex.prototype.CheckParaRun = function(name, obj) {
	if (obj[name].data.brk != undefined) {
		this.brk = true;
	}

	if (this.scr == undefined && obj[name].data.scr != undefined) {
		this.scr = obj[name].data.scr;
		var strItalic = obj[name].data.bold;
		var strBold = obj[name].data.italic;

		if (this.scr == 1) {
			this.objString.arr.push('\\mathcal{');
		}
		else if (this.scr == 3) {
			this.objString.arr.push('\\mathbb{');
		}
		else if (this.scr == 0 && strItalic == true) {
			this.objString.arr.push('\\mathnormal{');
		}
		else if (this.scr == 0 && strItalic == false) {
			this.objString.arr.push('\\mathrm{');
		}
		else if (this.scr == 0 && strBold == true && strItalic == false) {
			this.objString.arr.push('\\mathbf{');
		}
		else if (this.scr == 4 && strBold == false && strItalic == false) {
			this.objString.arr.push('\\mathsf{');
		}
		else if (this.scr == 5 && strBold == false && strItalic == false) {
			this.objString.arr.push('\\mathtt{');
		}
		else if (this.scr == 2 && strBold == false && strItalic == false) {
			this.objString.arr.push('\\mathfrak{');
		}
	}

	else if (this.scr != obj[name].data.scr) {
		this.scr = obj[name].data.scr; 
		this.objString.arr.push('}');
	}
};
ToLaTex.prototype.GetCode = new Map([
	[0x0391, '\\Alpha'],
	[0x03B1, '\\alpha'],
	[0x0392, '\\Beta'],
	[0x03B2, '\\beta'],
	[0x0393, '\\Gamma'],
	[0x03B3, '\\gamma'],
	[0x0394, '\\Delta'],
	[0x03B4, '\\delta'],
	[0x0395, '\\Epsilon'],
	[0x03F5, '\\epsilon'],
	[0x03B5, '\\varepsilon'],
	[0x0396, '\\Zeta'],
	[0x03B6, '\\zeta'],
	[0x0397, '\\Eta'],
	[0x03B7, '\\eta'],
	[0x0398, '\\Theta'],
	[0x03B8, '\\theta'],
	[0x03D1, '\\vartheta'],
	[0x0399, '\\Iota'],
	[0x03B9, '\\iota'],
	[0x039A, '\\Kappa'],
	[0x03BA, '\\kappa'],
	[0x03F0, '\\varkappa'],
	[0x039B, '\\Lambda'],
	[0x03BB, '\\lambda'],
	[0x039C, '\\Mu'],
	[0x03BC, '\\mu'],
	[0x039D, '\\Nu'],
	[0x03BD, '\\nu'],
	[0x039E, '\\Xi'],
	[0x03BE, '\\xi'],
	[0x039F, '\\Omicron'],
	[0x03BF, '\\omicron'],
	[0x03A0, '\\Pi'],
	[0x03C0, '\\pi'],
	[0x03D6, '\\varpi'],
	[0x03A1, '\\Rho'],
	[0x03C1, '\\rho'],
	[0x03F1, '\\varrho'],
	[0x03A3, '\\Sigma'],
	[0x03C2, '\\sigma'],
	[0x03F2, '\\varsigma'],
	[0x03A4, '\\Tau '],
	[0x03C4, '\\tau'],
	[0x03A5, '\\Upsilon'],
	[0x03C5, '\\upsilon'],
	[0x03A6, '\\Phi'],
	[0x03C6, '\\phi'],
	[0x03D5, '\\varphi'],
	[0x03D5, '\\varPhi'],
	[0x03A7, '\\Chi'],
	[0x03C7, '\\chi'],
	[0x03A8, '\\Psi'],
	[0x03C8, '\\psi'],
	[0x03A9, '\\Omega'],
	[0x03C9, '\\omega'],
	[0x03DC, '\\Digamma'],
	[0x03DD, '\\digamma'],
	[0x203C, '\!!'],
	[0x2026, '\...'],
	[0x2237, '\::'],
	[0x2254, '\:='],
	[0x226E, '\/<'],
	[0x226F, '\/>'],
	[0x2260, '\/='],
	[0x2534, '\\above'],
	[0x0301, '\\acute'],
	[0x2135, '\\aleph'],
	[0x2210, '\\amalg'],
	[0x2220, '\\angle'],
	[0x222E, '\\aoint'],
	[0x2248, '\\approx'],
	[0x2B06, '\\asmash'],
	[0x2217, '\\ast'],
	[0x224D, '\\asymp'],
	[0x00A6, '\\atop'],
	[0x0305, '\\bar'],
	[0x033F, '\\Bar'],
	[0x2235, '\\because'],
	[0x3016, '\\begin'],
	[0x252C, '\\below'],
	[0x2136, '\\bet'],
	[0x2136, '\\beth'],
	[0x22C2, '\\bigcap'],
	[0x22C3, '\\bigcup'],
	[0x2A00, '\\bigodot'],
	[0x2A01, '\\bigoplus'],
	[0x2A02, '\\bigotimes'],
	[0x2A06, '\\bigsqcup'],
	[0x2A04, '\\biguplus'],
	[0x22C1, '\\bigvee'],
	[0x22C0, '\\bigwedge'],
	[0x22A5, '\\bot'],
	[0x22C8, '\\bowtie'],
	[0x25A1, '\\box'],
	[0x22A1, '\\boxdot'],
	[0x229F, '\\boxminus'],
	[0x229E, '\\boxplus'],
	[0x27E8, '\\bra'],
	[0x2936, '\\break'],
	[0x0306, '\\breve'],
	[0x2219, '\\bullet'],
	[0x2229, '\\cap'],
	[0x221B, '\\cbrt'],
	[0x24B8, '\\cases'],
	[0x22C5, '\\cdot'],
	[0x22EF, '\\cdots'],
	[0x030C, '\\check'],
	[0x2218, '\\circ'],
	[0x2524, '\\close'],
	[0x2663, '\\clubsuit'],
	[0x2232, '\\coint'],
	[0x2245, '\\cong'],
	[0x2210, '\\coprod'],
	[0x222A, '\\cup'],
	[0x2138, '\\dalet'],
	[0x2138, '\\daleth'],
	[0x22A3, '\\dashv'],
	[0x2146, '\\dd'],
	[0x2145, '\\Dd'],
	[0x20DC, '\\ddddot'],
	[0x20DB, '\\dddot'],
	[0x0308, '\\ddot'],
	[0x22F1, '\\ddots'],
	[0x225D, '\\defeq'],
	[0x2103, '\\degc'],
	[0x2109, '\\degf'],
	[0x00B0, '\\degree'],
	[0x225C, '\\Deltaeq'],
	[0x22C4, '\\diamond'],
	[0x2662, '\\diamondsuit'],
	[0x00F7, '\\div'],
	[0x0307, '\\dot'],
	[0x2250, '\\doteq'],
	[0x2026, '\\dots'],
	[0xD552, '\\doublea'],
	[0xD538, '\\doubleA'],
	[0xD553, '\\doubleb'],
	[0xD539, '\\doubleB'],
	[0xD554, '\\doublec'],
	[0x2102, '\\doubleC'],
	[0xD555, '\\doubled'],
	[0xD53B, '\\doubleD'],
	[0xD556, '\\doublee'],
	[0xD53C, '\\doubleE'],
	[0xD557, '\\doublef'],
	[0xD53D, '\\doubleF'],
	[0xD558, '\\doubleg'],
	[0xD53E, '\\doubleG'],
	[0xD559, '\\doubleh'],
	[0x210D, '\\doubleH'],
	[0xD55A, '\\doublei'],
	[0xD540, '\\doubleI'],
	[0xD55B, '\\doublej'],
	[0xD541, '\\doubleJ'],
	[0xD55C, '\\doublek'],
	[0xD542, '\\doubleK'],
	[0xD55D, '\\doublel'],
	[0xD543, '\\doubleL'],
	[0xD55E, '\\doublem'],
	[0xD544, '\\doubleM'],
	[0xD55F, '\\doublen'],
	[0x2115, '\\doubleN'],
	[0xD560, '\\doubleo'],
	[0xD546, '\\doubleO'],
	[0xD561, '\\doublep'],
	[0x2119, '\\doubleP'],
	[0xD562, '\\doubleq'],
	[0x211A, '\\doubleQ'],
	[0xD563, '\\doubler'],
	[0x211D, '\\doubleR'],
	[0xD564, '\\doubles'],
	[0xD54A, '\\doubleS'],
	[0xD565, '\\doublet'],
	[0xD54B, '\\doubleT'],
	[0xD566, '\\doubleu'],
	[0xD54C, '\\doubleU'],
	[0xD567, '\\doublev'],
	[0xD54D, '\\doubleV'],
	[0xD568, '\\doublew'],
	[0xD54E, '\\doubleW'],
	[0xD569, '\\doublex'],
	[0xD54F, '\\doubleX'],
	[0xD56A, '\\doubley'],
	[0xD550, '\\doubleY'],
	[0xD56B, '\\doublez'],
	[0x2124, '\\doubleZ'],
	[0x2193, '\\downarrow'],
	[0x21D3, '\\Downarrow'],
	[0x2B07, '\\dsmash'],
	[0x2147, '\\ee'],
	[0x2113, '\\ell'],
	[0x2205, '\\emptyset'],
	[0x2003, '\\emsp'],
	[0x3017, '\\end'],
	[0x2002, '\\ensp'],
	[0x2588, '\\eqarray'],
	[0x2261, '\\equiv'],
	[0x2203, '\\exists'],
	[0x2200, '\\forall'],
	[0xD51E, '\\fraktura'],
	[0xD504, '\\frakturA'],
	[0xD51F, '\\frakturb'],
	[0xD505, '\\frakturB'],
	[0xD520, '\\frakturc'],
	[0x212D, '\\frakturC'],
	[0xD521, '\\frakturd'],
	[0xD507, '\\frakturD'],
	[0xD522, '\\frakture'],
	[0xD508, '\\frakturE'],
	[0xD523, '\\frakturf'],
	[0xD509, '\\frakturF'],
	[0xD524, '\\frakturg'],
	[0xD50A, '\\frakturG'],
	[0xD525, '\\frakturh'],
	[0x210C, '\\frakturH'],
	[0xD526, '\\frakturi'],
	[0x2111, '\\frakturI'],
	[0xD527, '\\frakturj'],
	[0xD50D, '\\frakturJ'],
	[0xD528, '\\frakturk'],
	[0xD50E, '\\frakturK'],
	[0xD529, '\\frakturl'],
	[0xD50F, '\\frakturL'],
	[0xD52A, '\\frakturm'],
	[0xD510, '\\frakturM'],
	[0xD52B, '\\frakturn'],
	[0xD511, '\\frakturN'],
	[0xD52C, '\\frakturo'],
	[0xD512, '\\frakturO'],
	[0xD52D, '\\frakturp'],
	[0xD513, '\\frakturP'],
	[0xD52E, '\\frakturq'],
	[0xD514, '\\frakturQ'],
	[0xD52F, '\\frakturr'],
	[0x211C, '\\frakturR'],
	[0xD530, '\\frakturs'],
	[0xD516, '\\frakturS'],
	[0xD531, '\\frakturt'],
	[0xD517, '\\frakturT'],
	[0xD532, '\\frakturu'],
	[0xD518, '\\frakturU'],
	[0xD533, '\\frakturv'],
	[0xD519, '\\frakturV'],
	[0xD534, '\\frakturw'],
	[0xD51A, '\\frakturW'],
	[0xD535, '\\frakturx'],
	[0xD51B, '\\frakturX'],
	[0xD536, '\\fraktury'],
	[0xD51C, '\\frakturY'],
	[0xD537, '\\frakturz'],
	[0x2128, '\\frakturZ'],
	[0x2311, '\\frown'],
	[0x2061, '\\funcapply'],
	[0x2265, '\\ge'],
	[0x2265, '\\geq'],
	[0x2190, '\\gets'],
	[0x226B, '\\gg'],
	[0x2137, '\\gimel'],
	[0x0300, '\\grave'],
	[0x200A, '\\hairsp'],
	[0x0302, '\\hat'],
	[0x210F, '\\hbar'],
	[0x2661, '\\heartsuit'],
	[0x21A9, '\\hookleftarrow'],
	[0x21AA, '\\hookrightarrow'],
	[0x2B04, '\\hphantom'],
	[0x2B0C, '\\hsmash'],
	[0x20D1, '\\hvec'],
	[0x2148, '\\ii'],
	[0x222D, '\\iiint'],
	[0x222C, '\\iint'],
	[0x2A0C, '\\iiiint'],
	[0x2111, '\\Im'],
	[0x0131, '\\imath'],
	[0x2208, '\\in'],
	[0x2206, '\\inc'],
	[0x221E, '\\infty'],
	[0x222B, '\\int'],
	[0x2062, '\\itimes'],
	[0x2149, '\\jj'],
	[0x0237, '\\jmath'],
	[0x27E9, '\\ket'],
	[0x2329, '\\langle'],
	[0x27E6, '\\lbbrack'],
	[0x007B, '\\lbrace'],
	[0x005B, '\\lbrack'],
	[0x2308, '\\lceil'],
	[0x2215, '\\ldiv'],
	[0x2215, '\\ldivide'],
	[0x2026, '\\ldots'],
	[0x2264, '\\le'],
	[0x251C, '\\left'],
	[0x2190, '\\leftarrow'],
	[0x21D0, '\\Leftarrow'],
	[0x21BD, '\\leftharpoondown'],
	[0x21BC, '\\leftharpoonup'],
	[0x2194, '\\leftrightarrow'],
	[0x21D4, '\\Leftrightarrow'],
	[0x2264, '\\leq'],
	[0x230A, '\\lfloor'],
	[0x20D0, '\\lhvec'],
	[0x226A, '\\ll'],
	[0x23B0, '\\lmoust'],
	[0x27F8, '\\Longleftarrow'],
	[0x27FA, '\\Longleftrightarrow'],
	[0x27F9, '\\Longrightarrow'],
	[0x21CB, '\\lrhar'],
	[0x20D6, '\\lvec'],
	[0x21A6, '\\mapsto'],
	[0x25A0, '\\matrix'],
	[0x205F, '\\medsp'],
	[0x2223, '\\mid'],
	[0x24DC, '\\middle'],
	[0x22A8, '\\models'],
	[0x2213, '\\mp'],
	[0x2207, '\\nabla'],
	[0x2592, '\\naryand'],
	[0x00A0, '\\nbsp'],
	[0x2260, '\\ne'],
	[0x2197, '\\nearrow'],
	[0x2260, '\\neq'],
	[0x220B, '\\ni'],
	[0x2016, '\\norm'],
	[0x220C, '\\notcontain'],
	[0x2209, '\\notelement'],
	[0x2209, '\\notin'],
	[0x2196, '\\nwarrow'],
	[0x03BF, '\\o'],
	[0x039F, '\\O'],
	[0x2299, '\\odot'],
	[0x2592, '\\of'],
	[0x2230, '\\oiiint'],
	[0x222F, '\\oiint'],
	[0x222E, '\\oint'],
	[0x2296, '\\ominus'],
	[0x251C, '\\open'],
	[0x2295, '\\oplus'],
	[0x2297, '\\otimes'],
	[0x002F, '\\over'],
	[0x00AF, '\\overbar'],
	[0x23DE, '\\overbrace'],
	[0x23B4, '\\overbracket'],
	[0x00AF, '\\overline'],
	[0x23DC, '\\overparen'],
	[0x23E0, '\\overshell'],
	[0x2225, '\\parallel'],
	[0x2202, '\\partial'],
	[0x24A8, '\\pmatrix'],
	[0x22A5, '\\perp'],
	[0x27E1, '\\phantom'],
	[0x00B1, '\\pm'],
	[0x2057, '\\pppprime'],
	[0x2034, '\\ppprime'],
	[0x2033, '\\pprime'],
	[0x227A, '\\prec'],
	[0x227C, '\\preceq'],
	[0x2032, '\\prime'],
	[0x220F, '\\prod'],
	[0x221D, '\\propto'],
	[0x221C, '\\qdrt'],
	[0x232A, '\\rangle'],
	[0x27EB, '\\Rangle'],
	[0x2236, '\\ratio'],
	[0x007D, '\\rbrace'],
	[0x005D, '\\rbrack'],
	[0x27E7, '\\Rbrack'],
	[0x2309, '\\rceil'],
	[0x22F0, '\\rddots'],
	[0x211C, '\\Re'],
	[0x25AD, '\\rect'],
	[0x230B, '\\rfloor'],
	[0x20D1, '\\rhvec'],
	[0x2524, '\\right'],
	[0x2192, '\\rightarrow'],
	[0x21D2, '\\Rightarrow'],
	[0x21C1, '\\rightharpoondown'],
	[0x21C0, '\\rightharpoonup'],
	[0x23B1, '\\rmoust'],
	[0x24AD, '\\root'],
	[0xD4B6, '\\scripta'],
	[0xD49C, '\\scriptA'],
	[0xD4B7, '\\scriptb'],
	[0x212C, '\\scriptB'],
	[0xD4B8, '\\scriptc'],
	[0xD49E, '\\scriptC'],
	[0xD4B9, '\\scriptd'],
	[0xD49F, '\\scriptD'],
	[0x212F, '\\scripte'],
	[0x2130, '\\scriptE'],
	[0xD4BB, '\\scriptf'],
	[0x2131, '\\scriptF'],
	[0x210A, '\\scriptg'],
	[0xD4A2, '\\scriptG'],
	[0xD4BD, '\\scripth'],
	[0x210B, '\\scriptH'],
	[0xD4BE, '\\scripti'],
	[0x2110, '\\scriptI'],
	[0xD4BF, '\\scriptj'],
	[0xD4A5, '\\scriptJ'],
	[0xD4C0, '\\scriptk'],
	[0xD4A6, '\\scriptK'],
	[0x2113, '\\scriptl'],
	[0x2112, '\\scriptL'],
	[0xD4C2, '\\scriptm'],
	[0x2133, '\\scriptM'],
	[0xD4C3, '\\scriptn'],
	[0xD4A9, '\\scriptN'],
	[0x2134, '\\scripto'],
	[0xD4AA, '\\scriptO'],
	[0xD4C5, '\\scriptp'],
	[0xD4AB, '\\scriptP'],
	[0xD4C6, '\\scriptq'],
	[0xD4AC, '\\scriptQ'],
	[0xD4C7, '\\scriptr'],
	[0x211B, '\\scriptR'],
	[0xD4C8, '\\scripts'],
	[0xD4AE, '\\scriptS'],
	[0xD4C9, '\\scriptt'],
	[0xD4AF, '\\scriptT'],
	[0xD4CA, '\\scriptu'],
	[0xD4B0, '\\scriptU'],
	[0xD4CB, '\\scriptv'],
	[0xD4B1, '\\scriptV'],
	[0xD4CC, '\\scriptw'],
	[0xD4B2, '\\scriptW'],
	[0xD4CD, '\\scriptx'],
	[0xD4B3, '\\scriptX'],
	[0xD4CE, '\\scripty'],
	[0xD4B4, '\\scriptY'],
	[0xD4CF, '\\scriptz'],
	[0xD4B5, '\\scriptZ'],
	[0x2044, '\\sdiv'],
	[0x2044, '\\sdivide'],
	[0x2198, '\\searrow'],
	[0x2216, '\\setminus'],
	[0x223C, '\\sim'],
	[0x2243, '\\simeq'],
	[0x2B0D, '\\smash'],
	[0x2323, '\\smile'],
	[0x2660, '\\spadesuit'],
	[0x2293, '\\sqcap'],
	[0x2294, '\\sqcup'],
	[0x221A, '\\sqrt'],
	[0x2291, '\\sqsubseteq'],
	[0x2292, '\\sqsuperseteq'],
	[0x22C6, '\\star'],
	[0x2282, '\\subset'],
	[0x2286, '\\subseteq'],
	[0x227B, '\\succ'],
	[0x227D, '\\succeq'],
	[0x2211, '\\sum'],
	[0x2283, '\\superset'],
	[0x2287, '\\superseteq'],
	[0x2199, '\\swarrow'],
	[0x2234, '\\therefore'],
	[0x2005, '\\thicksp'],
	[0x2006, '\\thinsp'],
	[0x0303, '\\tilde'],
	[0x00D7, '\\times'],
	[0x2192, '\\to'],
	[0x22A4, '\\top'],
	[0x20E1, '\\tvec'],
	[0x0332, '\\ubar'],
	[0x0333, '\\Ubar'],
	[0x2581, '\\underbar'],
	[0x23DF, '\\underbrace'],
	[0x23B5, '\\underbracket'],
	[0x25B1, '\\underline'],
	[0x23DD, '\\underparen'],
	[0x2191, '\\uparrow'],
	[0x21D1, '\\Uparrow'],
	[0x2195, '\\updownarrow'],
	[0x21D5, '\\Updownarrow'],
	[0x228E, '\\uplus'],
	[0x2502, '\\vbar'],
	[0x22A2, '\\vdash'],
	[0x22EE, '\\vdots'],
	[0x20D7, '\\vec'],
	[0x2228, '\\vee'],
	[0x007C, '\\vert'],
	[0x2016, '\\Vert'],
	[0x24A9, '\\Vmatrix'],
	[0x21F3, '\\vphantom'],
	[0x2004, '\\vthicksp'],
	[0x2227, '\\wedge'],
	[0x2118, '\\wp'],
	[0x2240, '\\wr'],
	[0x200C, '\\zwnj'],
	[0x200B, '\\zwsp'],
	[0x2245, '\~='],
	[0x2213, '\-+'],
	[0x00B1, '\+-'],
	[0x226A, '\<<'],
	[0x2264, '\<='],
	[0x2192, '\->'],
	[0x2265, '\>='],
	[0x226B, '\>>']
]);
//--------------------------------------------------------export----------------------------------------------------
window["AscCommonWord"] = window["AscCommonWord"] || {};
window["AscCommonWord"].CLaTeXParser = CLaTeXParser;
window["AscCommonWord"].CLaTeXLexer = CLaTeXLexer;
