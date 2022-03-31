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

//========================================================================//
//========Processing class for LaTeX and Unicode lexers===================//
//========================================================================//

var LaTeX = 0;
var Unicode = 1;
//BINOM

// \begin{matrix}
// a & b & c \\
// d & e & f \\
// g & h & i
// \end{matrix}

// ^1/_3 syntax not supported in word
// in unicode if index/degree after brackets block then brackets symbols nor disap.

// in word all brackets type is writes, exept (), only 2^((2)) => 2^(2) with visible brackets
//type of fraction must stored in lexers!

//в unicode блочный элемент с () не сохранчтет скобки, с другими - сохраняет 
var arrLaTeXFunctionsName = [
	"cos",
	"sin",
	"tan",
	"cot",
	"arcsin",
	"arccos",
	"arctan",
	"arccot",
	"sinh",
	"cosh",
	"tanh",
	"coth",
	"sec",
	"exp",
	"csc",
	"arcsec",
	"arccsc",
	"sech",
	"csch",
	"srcsinh",
	"arctanh",
	"arcsech",
	"arccosh",
	"arccoth",
	"arccsch",
]
var MathOperators = [
	'+', '=', '*', '-',
	'!', '@', '#', '$',
	'%', '?', '&',
	'^', '_', '/',
	' ', '.', ',', ' ',
	'\\fraktur', open
];
var Bracets = [
	'(', ')',
	'[', ']',
	'{', '}',
	'|',
];
var isLaTeXAtom = [
	'log', 'lin', 'ln', 'max', 'min', 'exp',
	'matrix',
	'sqrt',
	'left', 'right', 'middle', 'frac', 'binom',
	'equiv',
	'to', 'bmod',

	"sum", "prod", "coprod", 'bigoplus', 'bigotimes', 'bigsqcup', 'bigodot',
	"bigcup", "bigcap", "bigvee", "bigwedge", 'biguplus',
	"int", "oint", "iint", "oiint", "iiint", "oiiint", 'iiiint',
];
var UnicodeSymbols = [
	'┴', '┬', '▒', '√', "┤", "├", "〖", "〗", '█', '¦',
	'│', '“', '×', '·', '•', '', '∫', '∑', '∏', '▭',
	'', '√', '▁', '⊘', '⁄', '\/', '∩', '±', '∕'
];
var SymbolsForCorrect = {
	'A': {
		"\\above": 0x2534,
		"\\acute": 0x0301,
		"\\amalg": 0x2210,
		"\\angle": 0x2220,
		"\\aoint": 0x222e,
		"\\approx": 0x2248,
		"\\asmash": 0x2b06,
		"\\ast": 0x2217,
		"\\asymp": 0x224d,
		"\\atop": 0x00a6,

		"\\Alpha": 0x0391,
		"\\alpha": 0x03b1,
	},
	'B': {
		"\\Beta": 0x0392, "\\beta": 0x03b2,
		"\\bar": 0x0305,
		"\\Bar": 0x033f,
		"\\because": 0x2235,
		"\\begin": 0x3016,
		"\\below": 0x252c,
		"\\bet": 0x2136,
		"\\beth": 0x2136,
		"\\bigcap": 0x22c2,
		"\\bigcup": 0x22c3,
		"\\bigodot": 0x2a00,
		"\\bigoplus": 0x2a01,
		"\\bigotimes": 0x2a02,
		"\\bigsqcup": 0x2a06,
		"\\biguplus": 0x2a04,
		"\\bigvee": 0x22c1,
		"\\bigwedge": 0x22c0,
		"\\bot": 0x22a5,
		"\\bowtie": 0x22c8,
		"\\box": 0x25a1,
		"\\boxdot": 0x22a1,
		"\\boxminus": 0x229f,
		"\\boxplus": 0x229e,
		"\\bra": 0x27e8,
		"\\break": 0x2936,
		"\\breve": 0x0306,
		"\\bullet": 0x2219,
		//['\\binomial',[0x0028, 0x0061, 0x002B, 0x0062, 0x0029, 0x005E, 0x005E, 0x003D, 0x2211, 0x005F, 0x0028, 0x006B, 0x003D, 0x0030, 0x0029, 0x005E, 0x006E, 0x0020, 0x2592, 0x0028, 0x006E, 0x00A6, 0x006B, 0x0029, 0x0061, 0x005E, 0x006B, 0x0020, 0x0062, 0x005E, 0x0028, 0x006E, 0x002D, 0x006B, 0x0029]],};
	},
	'C': {
		"\\Chi": 0x03a7, "\\chi": 0x03c7,

		"\\cap": 0x2229,
		"\\cbrt": 0x221b,
		"\\cases": 0x24b8,
		"\\cdot": 0x22c5,
		"\\cdots": 0x22ef,
		"\\check": 0x030c,
		"\\circ": 0x2218,
		"\\close": 0x2524,
		"\\clubsuit": 0x2663,
		"\\coint": 0x2232,
		"\\cong": 0x2245,
		"\\coprod": 0x2210,
		"\\cup": 0x222a,
	},
	'D': {
		"\\dalet": 0x2138,
		"\\daleth": 0x2138,
		"\\dashv": 0x22a3,
		"\\dd": 0x2146,
		"\\Dd": 0x2145,
		"\\ddddot": 0x20dc,
		"\\dddot": 0x20db,
		"\\ddot": 0x0308,
		"\\ddots": 0x22f1,
		"\\defeq": 0x225d,
		"\\degc": 0x2103,
		"\\degf": 0x2109,
		"\\degree": 0x00b0,
		"\\Deltaeq": 0x225c,
		"\\diamond": 0x22c4,
		"\\diamondsuit": 0x2662,
		"\\div": 0x00f7,
		"\\dot": 0x0307,
		"\\doteq": 0x2250,
		"\\dots": 0x2026,
		"\\downarrow": 0x2193,
		"\\Downarrow": 0x21d3,
		"\\dsmash": 0x2b07,

		"\\Digamma": 0x03dc, "\\digamma": 0x03dd,
		"\\Delta": 0x0394, "\\delta": 0x03b4,

		"\\doublea": 0x1d552, "\\doubleA": 0x1d538,
		"\\doubleb": 0x1d553, "\\doubleB": 0x1d539,
		"\\doublec": 0x1d554, "\\doubleC": 0x2102,
		"\\doubled": 0x1d555, "\\doubleD": 0x1d53b,
		"\\doublee": 0x1d556, "\\doubleE": 0x1d53c,
		"\\doublef": 0x1d557, "\\doubleF": 0x1d53d,
		"\\doubleg": 0x1d558, "\\doubleG": 0x1d53e,
		"\\doubleh": 0x1d559, "\\doubleH": 0x210d,
		"\\doublei": 0x1d55a, "\\doubleI": 0x1d540,
		"\\doublej": 0x1d55b, "\\doubleJ": 0x1d541,
		"\\doublek": 0x1d55c, "\\doubleK": 0x1d542,
		"\\doublel": 0x1d55d, "\\doubleL": 0x1d543,
		"\\doublem": 0x1d55e, "\\doubleM": 0x1d544,
		"\\doublen": 0x1d55f, "\\doubleN": 0x2115,
		"\\doubleo": 0x1d560, "\\doubleO": 0x1d546,
		"\\doublep": 0x1d561, "\\doubleP": 0x2119,
		"\\doubleq": 0x1d562, "\\doubleQ": 0x211a,
		"\\doubler": 0x1d563, "\\doubleR": 0x211d,
		"\\doubles": 0x1d564, "\\doubleS": 0x1d54a,
		"\\doublet": 0x1d565, "\\doubleT": 0x1d54b,
		"\\doubleu": 0x1d566, "\\doubleU": 0x1d54c,
		"\\doublev": 0x1d567, "\\doubleV": 0x1d54d,
		"\\doublew": 0x1d568, "\\doubleW": 0x1d54e,
		"\\doublex": 0x1d569, "\\doubleX": 0x1d54f,
		"\\doubley": 0x1d56a, "\\doubleY": 0x1d550,
		"\\doublez": 0x1d56b, "\\doubleZ": 0x2124,
	},
	'E': {
		"\\Epsilon": 0x0395, "\\epsilon": 0x03f5,
		"\\Eta": 0x0397, "\\eta": 0x3b7,

		"\\ee": 0x2147,
		"\\ell": 0x2113,
		"\\emptyset": 0x2205,
		"\\emsp": 0x2003,
		"\\end": 0x3017,
		"\\ensp": 0x2002,
		"\\eqarray": 0x2588,
		"\\equiv": 0x2261,
		"\\exists": 0x2203,
	},
	'F': {
		"\\forall": 0x2200,
		"\\frown": 0x2311,
		"\\funcapply": 0x2061,

		"\\fraktura": 0x1d51e, "\\frakturA": 0x1d504,
		"\\frakturb": 0x1d51f, "\\frakturB": 0x1d505,
		"\\frakturc": 0x1d520, "\\frakturC": 0x212d,
		"\\frakturd": 0x1d521, "\\frakturD": 0x1d507,
		"\\frakture": 0x1d522, "\\frakturE": 0x1d508,
		"\\frakturf": 0x1d523, "\\frakturF": 0x1d509,
		"\\frakturg": 0x1d524, "\\frakturG": 0x1d50a,
		"\\frakturh": 0x1d525, "\\frakturH": 0x210c,
		"\\frakturi": 0x1d526, "\\frakturI": 0x2111,
		"\\frakturj": 0x1d527, "\\frakturJ": 0x1d50d,
		"\\frakturk": 0x1d528, "\\frakturK": 0x1d50e,
		"\\frakturl": 0x1d529, "\\frakturL": 0x1d50f,
		"\\frakturm": 0x1d52a, "\\frakturM": 0x1d510,
		"\\frakturn": 0x1d52b, "\\frakturN": 0x1d511,
		"\\frakturo": 0x1d52c, "\\frakturO": 0x1d512,
		"\\frakturp": 0x1d52d, "\\frakturP": 0x1d513,
		"\\frakturq": 0x1d52e, "\\frakturQ": 0x1d514,
		"\\frakturr": 0x1d52f, "\\frakturR": 0x211c,
		"\\frakturs": 0x1d530, "\\frakturS": 0x1d516,
		"\\frakturt": 0x1d531, "\\frakturT": 0x1d517,
		"\\frakturu": 0x1d532, "\\frakturU": 0x1d518,
		"\\frakturv": 0x1d533, "\\frakturV": 0x1d519,
		"\\frakturw": 0x1d534, "\\frakturW": 0x1d51a,
		"\\frakturx": 0x1d535, "\\frakturX": 0x1d51b,
		"\\fraktury": 0x1d536, "\\frakturY": 0x1d51c,
		"\\frakturz": 0x1d537, "\\frakturZ": 0x2128,
	},
	'G': {
		"\\ge": 0x2265,
		"\\geq": 0x2265,
		"\\gets": 0x2190,
		"\\gg": 0x226b,
		"\\gimel": 0x2137,
		"\\grave": 0x0300,
		"\\Gamma": 0x0393, "\\gamma": 0x03b3,
	},
	'H': {
		"\\hairsp": 0x200a,
		"\\hat": 0x0302,
		"\\hbar": 0x210f,
		"\\heartsuit": 0x2661,
		"\\hookleftarrow": 0x21a9,
		"\\hookrightarrow": 0x21aa,
		"\\hphantom": 0x2b04,
		"\\hsmash": 0x2b0c,
		"\\hvec": 0x20d1,
	},
	'I': {
		"\\ii": 0x2148,
		"\\iiint": 0x222d,
		"\\iint": 0x222c,
		"\\iiiint": 0x2a0c,
		"\\Im": 0x2111,
		"\\imath": 0x0131,
		"\\in": 0x2208,
		"\\inc": 0x2206,
		"\\infty": 0x221e,
		"\\int": 0x222b,
		"\\itimes": 0x2062,
		"\\Iota": 0x0399, "\\iota": 0x03b9,
		//['\\identitymatrix', [0x0028, 0x25A0, 0x0028, 0x0031, 0x0026, 0x0030, 0x0026, 0x0030, 0x0040, 0x0030, 0x0026, 0x0031, 0x0026, 0x0030, 0x0040, 0x0030, 0x0026, 0x0030, 0x0026, 0x0031, 0x0029, 0x0029]],
		//['\\integral', [0x0031, 0x002F, 0x0032, 0x03C0, 0x222B, 0x005F, 0x0030, 0x005E, 0x0032, 0x03C0, 0x2592, 0x2146, 0x03B8, 0x0020, 0x0028, 0x0061, 0x002B, 0x0062, 0x0073, 0x0069, 0x006E, 0x0020, 0x03B8, 0x0029, 0x003D, 0x0031, 0x002F, 0x221A, 0x0028, 0x0061, 0x005E, 0x0032, 0x002D, 0x0062, 0x005E, 0x0032, 0x0029]],
	},
	'J': {
		//['\\jj', 0x2149],
		"\\jj": 0x2149,
		"\\jmath": 0x0237,
	},
	'K': {
		"\\ket": 0x27e9,
		"\\Kappa": 0x039a, "\\kappa": 0x03ba,
	},
	'L': {
		"\\Lambda": 0x039b, "\\lambda": 0x03bb,
		"\\langle": 0x2329,
		"\\lbbrack": 0x27e6,
		"\\lbrace": 0x007b,
		"\\lbrack": 0x005b,
		"\\lceil": 0x2308,
		"\\ldiv": 0x2215,
		"\\ldivide": 0x2215,
		"\\ldots": 0x2026,
		"\\le": 0x2264,
		"\\left": 0x251c,
		"\\leftarrow": 0x2190,
		"\\Leftarrow": 0x21d0,
		"\\leftharpoondown": 0x21bd,
		"\\leftharpoonup": 0x21bc,
		"\\leftrightarrow": 0x2194,
		"\\Leftrightarrow": 0x21d4,
		"\\leq": 0x2264,
		"\\lfloor": 0x230a,
		"\\lhvec": 0x20d0,
		"\\ll": 0x226a,
		"\\lmoust": 0x23b0,
		"\\Longleftarrow": 0x27f8,
		"\\Longleftrightarrow": 0x27fa,
		"\\Longrightarrow": 0x27f9,
		"\\lrhar": 0x21cb,
		"\\lvec": 0x20d6,
		//['\\limit', [0x006C, 0x0069, 0x006D, 0x005F, 0x0028, 0x006E, 0x2192, 0x221E, 0x0029, 0x2061, 0x3016, 0x0028, 0x0031, 0x002B, 0x0031, 0x002F, 0x006E, 0x0029, 0x005E, 0x006E, 0x3017, 0x003D, 0x0065]],
	},
	'M': {
		"\\mapsto": 0x21a6,
		"\\matrix": 0x25a0,
		"\\medsp": 0x205f,
		"\\mid": 0x2223,
		"\\middle": 0x24dc,
		"\\models": 0x22a8,
		"\\mp": 0x2213,

		"\\Mu": 0x039c, "\\mu": 0x03bc,
	},
	'N': {
		"\\nabla": 0x2207,
		"\\naryand": 0x2592,
		"\\nbsp": 0x00a0,
		"\\ne": 0x2260,
		"\\nearrow": 0x2197,
		"\\neq": 0x2260,
		"\\ni": 0x220b,
		"\\norm": 0x2016,
		"\\notcontain": 0x220c,
		"\\notelement": 0x2209,
		"\\notin": 0x2209,
		"\\nwarrow": 0x2196,

		"\\Nu": 0x039d, "\\nu": 0x03bd,
	},
	'O': {
		"\\o": 0x03bf,
		"\\O": 0x039f,
		"\\odot": 0x2299,
		"\\of": 0x2592,
		"\\oiiint": 0x2230,
		"\\oiint": 0x222f,
		"\\oint": 0x222e,
		"\\ominus": 0x2296,
		"\\open": 0x251c,
		"\\oplus": 0x2295,
		"\\otimes": 0x2297,
		"\\over": 0x002f,
		"\\overbar": 0x00af,
		"\\overbrace": 0x23de,
		"\\overbracket": 0x23b4,
		"\\overline": 0x00af,
		"\\overparen": 0x23dc,
		"\\overshell": 0x23e0,
		"\\Omega": 0x03a9, "\\omega": 0x03c9,
		"\\Omicron": 0x039f, "\\omicron": 0x03bf,
	},
	'P': {
		"\\Phi": 0x03a6, "\\phi": 0x03c6,
		"\\Pi": 0x03a0, "\\pi": 0x03c0,
		"\\parallel": 0x2225,
		"\\partial": 0x2202,
		"\\pmatrix": 0x24a8,
		"\\perp": 0x22a5,
		"\\phantom": 0x27e1,
		"\\pm": 0x00b1,
		"\\pppprime": 0x2057,
		"\\ppprime": 0x2034,
		"\\pprime": 0x2033,
		"\\prec": 0x227a,
		"\\preceq": 0x227c,
		"\\prime": 0x2032,
		"\\prod": 0x220f,
		"\\propto": 0x221d,
	},
	'R': {
		"\\Rho": 0x03a1, "\\rho": 0x03c1,

		"\\rangle": 0x232a,
		"\\Rangle": 0x27eb,
		"\\ratio": 0x2236,
		"\\rbrace": 0x007d,
		"\\rbrack": 0x005d,
		"\\Rbrack": 0x27e7,
		"\\rceil": 0x2309,
		"\\rddots": 0x22f0,
		"\\Re": 0x211c,
		"\\rect": 0x25ad,
		"\\rfloor": 0x230b,
		"\\rhvec": 0x20d1,
		"\\right": 0x2524,
		"\\rightarrow": 0x2192,
		"\\Rightarrow": 0x21d2,
		"\\rightharpoondown": 0x21c1,
		"\\rightharpoonup": 0x21c0,
		"\\rmoust": 0x23b1,
		"\\root": 0x24ad,
	},
	'Q': {
		//['\\quadratic', [0x0078, 0x003d, 0x0028, 0x002d, 0x0062, 0x00B1, 0x221A, 0x0028, 0x0062, 0x005e, 0x0032, 0x002d, 0x0034, 0x0061, 0x0063, 0x0029, 0x0029, 0x002f, 0x0032, 0x0061]],
		"\\qdrt": 0x221c,
	},
	'S': {
		"\\Sigma": 0x03a3, "\\sigma": 0x03c2,

		"\\sdiv": 0x2044,
		"\\sdivide": 0x2044,
		"\\searrow": 0x2198,
		"\\setminus": 0x2216,
		"\\sim": 0x223c,
		"\\simeq": 0x2243,
		"\\smash": 0x2b0d,
		"\\smile": 0x2323,
		"\\spadesuit": 0x2660,
		"\\sqcap": 0x2293,
		"\\sqcup": 0x2294,
		"\\sqrt": 0x221a,
		"\\sqsubseteq": 0x2291,
		"\\sqsuperseteq": 0x2292,
		"\\star": 0x22c6,
		"\\subset": 0x2282,
		"\\subseteq": 0x2286,
		"\\succ": 0x227b,
		"\\succeq": 0x227d,
		"\\sum": 0x2211,
		"\\superset": 0x2283,
		"\\superseteq": 0x2287,
		"\\swarrow": 0x2199,

		"\\scripta": 0x1d4b6, "\\scriptA": 0x1d49c,
		"\\scriptb": 0x1d4b7, "\\scriptB": 0x212c,
		"\\scriptc": 0x1d4b8, "\\scriptC": 0x1d49e,
		"\\scriptd": 0x1d4b9, "\\scriptD": 0x1d49f,
		"\\scripte": 0x212f, "\\scriptE": 0x2130,
		"\\scriptf": 0x1d4bb, "\\scriptF": 0x2131,
		"\\scriptg": 0x210a, "\\scriptG": 0x1d4a2,
		"\\scripth": 0x1d4bd, "\\scriptH": 0x210b,
		"\\scripti": 0x1d4be, "\\scriptI": 0x2110,
		"\\scriptj": 0x1d4bf, "\\scriptJ": 0x1d4a5,
		"\\scriptk": 0x1d4c0, "\\scriptK": 0x1d4a6,
		"\\scriptl": 0x2113, "\\scriptL": 0x2112,
		"\\scriptm": 0x1d4c2, "\\scriptM": 0x2133,
		"\\scriptn": 0x1d4c3, "\\scriptN": 0x1d4a9,
		"\\scripto": 0x2134, "\\scriptO": 0x1d4aa,
		"\\scriptp": 0x1d4c5, "\\scriptP": 0x1d4ab,
		"\\scriptq": 0x1d4c6, "\\scriptQ": 0x1d4ac,
		"\\scriptr": 0x1d4c7, "\\scriptR": 0x211b,
		"\\scripts": 0x1d4c8, "\\scriptS": 0x1d4ae,
		"\\scriptt": 0x1d4c9, "\\scriptT": 0x1d4af,
		"\\scriptu": 0x1d4ca, "\\scriptU": 0x1d4b0,
		"\\scriptv": 0x1d4cb, "\\scriptV": 0x1d4b1,
		"\\scriptw": 0x1d4cc, "\\scriptW": 0x1d4b2,
		"\\scriptx": 0x1d4cd, "\\scriptX": 0x1d4b3,
		"\\scripty": 0x1d4ce, "\\scriptY": 0x1d4b4,
		"\\scriptz": 0x1d4cf, "\\scriptZ": 0x1d4b5,
	},
	'T': {
		"\\Tau ": 0x03a4, "\\tau": 0x03c4,
		"\\Theta": 0x0398, "\\theta": 0x03b8,
		"\\therefore": 0x2234,
		"\\thicksp": 0x2005,
		"\\thinsp": 0x2006,
		"\\tilde": 0x0303,
		"\\times": 0x00d7,
		"\\to": 0x2192,
		"\\top": 0x22a4,
		"\\tvec": 0x20e1,
	},
	'U': {
		"\\Upsilon": 0x03a5, "\\upsilon": 0x03c5,
		"\\ubar": 0x0332,
		"\\Ubar": 0x0333,
		"\\underbar": 0x2581,
		"\\underbrace": 0x23df,
		"\\underbracket": 0x23b5,
		"\\underline": 0x25b1,
		"\\underparen": 0x23dd,
		"\\uparrow": 0x2191,
		"\\Uparrow": 0x21d1,
		"\\updownarrow": 0x2195,
		"\\Updownarrow": 0x21d5,
		"\\uplus": 0x228e,
	},
	'V': {
		"\\varepsilon": 0x03b5,
		"\\vartheta": 0x03d1,
		"\\varkappa": 0x03f0,

		"\\vbar": 0x2502,
		"\\vdash": 0x22a2,
		"\\vdots": 0x22ee,
		"\\vec": 0x20d7,
		"\\vee": 0x2228,
		"\\vert": 0x007c,
		"\\Vert": 0x2016,
		"\\Vmatrix": 0x24a9,
		"\\vphantom": 0x21f3,
		"\\vthicksp": 0x2004,

		"\\varpi": 0x03d6,
		"\\varrho": 0x03f1,
		"\\varsigma": 0x03f2,
		"\\varphi": 0x03d5,
		"\\varPhi": 0x03d5,
	},
	'W': {
		"\\wedge": 0x2227,
		"\\wp": 0x2118,
		"\\wr": 0x2240,
	},
	'X': {
		"\\Xi": 0x039e, "\\xi": 0x03be,
	},
	'Z': {
		"\\Zeta": 0x0396, "\\zeta": 0x03b6,
		"\\zwsp": 0x200b,
		"\\zwnj": 0x200c,
	}
}

// control words, to be replaced before parsing
var controlUnicodeWords = {

	// from tech note: Appendix B. Character Keywords and Properties
	'above': '2534',
	'acute': '0301',
	'aleph': '2135',
	'alpha': '03B1',
	'amalg': '2210',
	'angle': '2220',
	'aoint': '2233',
	'approx': '2248',
	'asmash': '2B06',
	'ast': '2217',
	'asymp': '224D',
	'atop': '00A6',
	'Bar': '033F',
	'bar': '0305',
	'because': '2235',
	'begin': '3016',
	'below': '252C',
	'beta': '03B2',
	'beth': '2136',
	'bot': '22A5',
	'bigcap': '22C2',
	'bigcup': '22C2',
	'bigodot': '2A00',
	'bigoplus': '2A01',
	'bigotimes': '2A02',
	'bigsqcup': '2A06',
	'biguplus': '2A04',
	'bigvee': '22C1',
	'bigwedge': '22C0',
	'bowtie': '22C8',
	'box': '25A1',
	'bra': '27E8',
	'breve': '0306',
	'bullet': '2219',
	'cap': '2229',
	'cbrt': '221B',
	'cdot': '22C5',
	'cdots': '22EF',
	'check': '030C',
	'chi': '03C7',
	'circ': '2218',
	'close': '2524',
	'clubsuit': '2663',
	'coint': '2232',
	'cong': '2245',
	'cup': '222A',
	'daleth': '2138',
	'dashv': '22A3',
	'Dd': '2145',
	'dd': '2146',
	'ddddot': '20DC',
	'dddot': '20DB',
	'ddot': '0308',
	'ddots': '22F1',
	'degree': '00B0',
	'Delta': '0394',
	'delta': '03B4',
	'diamond': '22C4',
	'diamondsuit': '2662',
	'div': '00F7',
	'dot': '0307',
	'doteq': '2250',
	'dots': '2026',
	'Downarrow': '21D3',
	'downarrow': '2193',
	'dsmash': '2B07',
	'ee': '2147',
	'ell': '2113',
	'emptyset': '2205',
	'emsp': '2003',
	'end': '3017',
	'ensp': '2002',
	'epsilon': '03F5',
	'eqarray': '2588',
	'eqno': '0023',
	'equiv': '2261',
	'eta': '03B7',
	'exists': '2203',
	'forall': '2200',
	'funcapply': '2061',
	'Gamma': '0393',
	'gamma': '03B3',
	'ge': '2265',
	'geq': '2265',
	'gets': '2190',
	'gg': '226B',
	'gimel': '2137',
	'grave': '0300',
	'hairsp': '200A',
	'hat': '0302',
	'hbar': '210F',
	'heartsuit': '2661',
	'hookleftarrow': '21A9',
	'hookrightarrow': '21AA',
	'hphantom': '2B04',
	'hsmash': '2B0C',
	'hvec': '20D1',
	'ii': '2148',
	'iiiint': '2A0C',
	'iiint': '222D',
	'iint': '222C',
	'Im': '2111',
	'imath': '0131',
	'in': '2208',
	'inc': '2206',
	'infty': '221E',
	'int': '222B',
	'iota': '03B9',
	'jj': '2149',
	'jmath': '0237',
	'kappa': '03BA',
	'ket': '27E9',
	'Lambda': '039B',
	'lambda': '03BB',
	'langle': '27E8',
	'lbrace': '007B',
	'lbrack': '005B',
	'lceil': '2308',
	'ldiv': '2215',
	'ldots': '2026',
	'le': '2264',
	'Leftarrow': '21D0',
	'leftarrow': '2190',
	'leftharpoondown': '21BD',
	'leftharpoonup': '21BC',
	'Leftrightarrow': '21D4',
	'leftrightarrow': '2194',
	'leq': '2264',
	'lfloor': '230A',
	'll': '226A',
	'Longleftarrow': '27F8',
	'longleftarrow': '27F5',
	'Longleftrightarrow': '27FA',
	'longleftrightarrow': '27F7',
	'Longrightarrow': '27F9',
	'longrightarrow': '27F6',
	'mapsto': '21A6',
	'matrix': '25A0',
	'medsp': '205F',
	'mid': '2223',
	'models': '22A8',
	'mp': '2213',
	'mu': '03BC',
	'nabla': '2207',
	'naryand': '2592',
	'nbsp': '00A0',
	'ndiv': '2298',
	'ne': '2260',
	'nearrow': '2197',
	'neg': '00AC',
	'neq': '2260',
	'ni': '220B',
	'norm': '2016',
	'nu': '03BD',
	'nwarrow': '2196',
	'odot': '2299',
	'of': '2592',
	'oiiint': '2230',
	'oiint': '222F',
	'oint': '222E',
	'Omega': '03A9',
	'omega': '03C9',
	'ominus': '2296',
	'open': '251C',
	'oplus': '2295',
	'oslash': '2298',
	'otimes': '2297',
	'over': '002F',
	'overbar': '00AF',
	'overbrace': '23DE',
	'overparen': '23DC',
	'parallel': '2225',
	'partial': '2202',
	'phantom': '27E1',
	'Phi': '03A6',
	'phi': '03D5',
	'Pi': '03A0',
	'pi': '03C0',
	'pm': '00B1',
	'pppprime': '2057',
	'ppprime': '2034',
	'pprime': '2033',
	'prcue': '227C',
	'prec': '227A',
	'preceq': '2AAF',
	'preccurlyeq': '227C',
	'prime': '2032',
	'prod': '220F',
	'propto': '221D',
	'Psi': '03A8',
	'psi': '03C8',
	'qdrt': '221C',
	'rangle': '27E9',
	'ratio': '2236',
	'rbrace': '007D',
	'rbrack': '005D',
	'rceil': '2309',
	'rddots': '22F0',
	'Re': '211C',
	'rect': '25AD',
	'rfloor': '230B',
	'rho': '03C1',
	'Rightarrow': '21D2',
	'rightarrow': '2192',
	'rightharpoondown': '21C1',
	'rightharpoonup': '21C0',
	'rrect': '25A2',
	'sdiv': '2044',
	'searrow': '2198',
	'setminus': '2216',
	'Sigma': '03A3',
	'sigma': '03C3',
	'sim': '223C',
	'simeq': '2243',
	'smash': '2B0D',
	'spadesuit': '2660',
	'sqcap': '2293',
	'sqcup': '2294',
	'sqrt': '221A',
	'sqsubseteq': '2291',
	'sqsuperseteq': '2292',
	'star': '22C6',
	'subset': '2282',
	'subseteq': '2286',
	'succ': '227B',
	'succeq': '227D',
	'sum': '2211',
	'superset': '2283',
	'superseteq': '2287',
	'swarrow': '2199',
	'tau': '03C4',
	'therefore': '2234',
	'Theta': '0398',
	'theta': '03B8',
	'thicksp': '2005',
	'thinsp': '2006',
	'tilde': '0303',
	'times': '00D7',
	'to': '2192',
	'top': '22A4',
	'tvec': '20E1',
	'underbar': '2581',
	'underbrace': '23DF',
	'underparen': '23DD',
	'Uparrow': '21D1',
	'uparrow': '2191',
	'Updownarrow': '21D5',
	'updownarrow': '2195',
	'uplus': '228E',
	'Upsilon': '03A5',
	'upsilon': '03C5',
	'varepsilon': '03B5',
	'varphi': '03C6',
	'varpi': '03D6',
	'varrho': '03F1',
	'varsigma': '03C2',
	'vartheta': '03D1',
	'vbar': '2502',
	'vdash': '22A2',
	'vdots': '22EE',
	'vec': '20D7',
	'vee': '2228',
	'Vert': '2016',
	'vert': '007C',
	'vphantom': '21F3',
	'vthicksp': '2004',
	'wedge': '2227',
	'wp': '2118',
	'wr': '2240',
	'Xi': '039E',
	'xi': '03BE',
	'zeta': '03B6',
	'zwnj': '200C',
	'zwsp': '200B',

	// based on section 3.6, "Square Roots and Radicals" of tech note
	'root': '221A',

	// based on https://www.cs.bgu.ac.il/~khitron/Equation%20Editor.pdf
	'boxdot': '22A1',
	'boxminus': '229F',
	'boxplus': '229E',
	'degc': '2103',
	'degf': '2109',
	'Deltaeq': '225C',
	'frown': '2311',
	'left': '251C',
	'lmoust': '23B0',
	'contain': '220B',
	'perp': '22A5',
	'right': '2524',
	'rmoust': '23B1',
	'smile': '2323',
	'overbracket': '23B4',
	'underbracket': '23B5',
	'overshell': '23E0',
	'undershell': '23E1'
};
var mathFonts = {
	// https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
	'A': { 'serif-bold': '𝐀', 'serif-italic': '𝐴', 'serif-bolditalic': '𝑨', 'sans-normal': '𝖠', 'sans-bold': '𝗔', 'sans-italic': '𝘈', 'sans-bolditalic': '𝘼', 'script-normal': '𝒜', 'script-bold': '𝓐', 'fraktur-normal': '𝔄', 'fraktur-bold': '𝕬', 'monospace-normal': '𝙰', 'doublestruck-normal': '𝔸' },
	'B': { 'serif-bold': '𝐁', 'serif-italic': '𝐵', 'serif-bolditalic': '𝑩', 'sans-normal': '𝖡', 'sans-bold': '𝗕', 'sans-italic': '𝘉', 'sans-bolditalic': '𝘽', 'script-normal': 'ℬ', 'script-bold': '𝓑', 'fraktur-normal': '𝔅', 'fraktur-bold': '𝕭', 'monospace-normal': '𝙱', 'doublestruck-normal': '𝔹' },
	'C': { 'serif-bold': '𝐂', 'serif-italic': '𝐶', 'serif-bolditalic': '𝑪', 'sans-normal': '𝖢', 'sans-bold': '𝗖', 'sans-italic': '𝘊', 'sans-bolditalic': '𝘾', 'script-normal': '𝒞', 'script-bold': '𝓒', 'fraktur-normal': 'ℭ', 'fraktur-bold': '𝕮', 'monospace-normal': '𝙲', 'doublestruck-normal': 'ℂ' },
	'D': { 'serif-bold': '𝐃', 'serif-italic': '𝐷', 'serif-bolditalic': '𝑫', 'sans-normal': '𝖣', 'sans-bold': '𝗗', 'sans-italic': '𝘋', 'sans-bolditalic': '𝘿', 'script-normal': '𝒟', 'script-bold': '𝓓', 'fraktur-normal': '𝔇', 'fraktur-bold': '𝕯', 'monospace-normal': '𝙳', 'doublestruck-normal': '𝔻' },
	'E': { 'serif-bold': '𝐄', 'serif-italic': '𝐸', 'serif-bolditalic': '𝑬', 'sans-normal': '𝖤', 'sans-bold': '𝗘', 'sans-italic': '𝘌', 'sans-bolditalic': '𝙀', 'script-normal': 'ℰ', 'script-bold': '𝓔', 'fraktur-normal': '𝔈', 'fraktur-bold': '𝕰', 'monospace-normal': '𝙴', 'doublestruck-normal': '𝔼' },
	'F': { 'serif-bold': '𝐅', 'serif-italic': '𝐹', 'serif-bolditalic': '𝑭', 'sans-normal': '𝖥', 'sans-bold': '𝗙', 'sans-italic': '𝘍', 'sans-bolditalic': '𝙁', 'script-normal': 'ℱ', 'script-bold': '𝓕', 'fraktur-normal': '𝔉', 'fraktur-bold': '𝕱', 'monospace-normal': '𝙵', 'doublestruck-normal': '𝔽' },
	'G': { 'serif-bold': '𝐆', 'serif-italic': '𝐺', 'serif-bolditalic': '𝑮', 'sans-normal': '𝖦', 'sans-bold': '𝗚', 'sans-italic': '𝘎', 'sans-bolditalic': '𝙂', 'script-normal': '𝒢', 'script-bold': '𝓖', 'fraktur-normal': '𝔊', 'fraktur-bold': '𝕲', 'monospace-normal': '𝙶', 'doublestruck-normal': '𝔾' },
	'H': { 'serif-bold': '𝐇', 'serif-italic': '𝐻', 'serif-bolditalic': '𝑯', 'sans-normal': '𝖧', 'sans-bold': '𝗛', 'sans-italic': '𝘏', 'sans-bolditalic': '𝙃', 'script-normal': 'ℋ', 'script-bold': '𝓗', 'fraktur-normal': 'ℌ', 'fraktur-bold': '𝕳', 'monospace-normal': '𝙷', 'doublestruck-normal': 'ℍ' },
	'I': { 'serif-bold': '𝐈', 'serif-italic': '𝐼', 'serif-bolditalic': '𝑰', 'sans-normal': '𝖨', 'sans-bold': '𝗜', 'sans-italic': '𝘐', 'sans-bolditalic': '𝙄', 'script-normal': 'ℐ', 'script-bold': '𝓘', 'fraktur-normal': 'ℑ', 'fraktur-bold': '𝕴', 'monospace-normal': '𝙸', 'doublestruck-normal': '𝕀' },
	'J': { 'serif-bold': '𝐉', 'serif-italic': '𝐽', 'serif-bolditalic': '𝑱', 'sans-normal': '𝖩', 'sans-bold': '𝗝', 'sans-italic': '𝘑', 'sans-bolditalic': '𝙅', 'script-normal': '𝒥', 'script-bold': '𝓙', 'fraktur-normal': '𝔍', 'fraktur-bold': '𝕵', 'monospace-normal': '𝙹', 'doublestruck-normal': '𝕁' },
	'K': { 'serif-bold': '𝐊', 'serif-italic': '𝐾', 'serif-bolditalic': '𝑲', 'sans-normal': '𝖪', 'sans-bold': '𝗞', 'sans-italic': '𝘒', 'sans-bolditalic': '𝙆', 'script-normal': '𝒦', 'script-bold': '𝓚', 'fraktur-normal': '𝔎', 'fraktur-bold': '𝕶', 'monospace-normal': '𝙺', 'doublestruck-normal': '𝕂' },
	'L': { 'serif-bold': '𝐋', 'serif-italic': '𝐿', 'serif-bolditalic': '𝑳', 'sans-normal': '𝖫', 'sans-bold': '𝗟', 'sans-italic': '𝘓', 'sans-bolditalic': '𝙇', 'script-normal': 'ℒ', 'script-bold': '𝓛', 'fraktur-normal': '𝔏', 'fraktur-bold': '𝕷', 'monospace-normal': '𝙻', 'doublestruck-normal': '𝕃' },
	'M': { 'serif-bold': '𝐌', 'serif-italic': '𝑀', 'serif-bolditalic': '𝑴', 'sans-normal': '𝖬', 'sans-bold': '𝗠', 'sans-italic': '𝘔', 'sans-bolditalic': '𝙈', 'script-normal': 'ℳ', 'script-bold': '𝓜', 'fraktur-normal': '𝔐', 'fraktur-bold': '𝕸', 'monospace-normal': '𝙼', 'doublestruck-normal': '𝕄' },
	'N': { 'serif-bold': '𝐍', 'serif-italic': '𝑁', 'serif-bolditalic': '𝑵', 'sans-normal': '𝖭', 'sans-bold': '𝗡', 'sans-italic': '𝘕', 'sans-bolditalic': '𝙉', 'script-normal': '𝒩', 'script-bold': '𝓝', 'fraktur-normal': '𝔑', 'fraktur-bold': '𝕹', 'monospace-normal': '𝙽', 'doublestruck-normal': 'ℕ' },
	'O': { 'serif-bold': '𝐎', 'serif-italic': '𝑂', 'serif-bolditalic': '𝑶', 'sans-normal': '𝖮', 'sans-bold': '𝗢', 'sans-italic': '𝘖', 'sans-bolditalic': '𝙊', 'script-normal': '𝒪', 'script-bold': '𝓞', 'fraktur-normal': '𝔒', 'fraktur-bold': '𝕺', 'monospace-normal': '𝙾', 'doublestruck-normal': '𝕆' },
	'P': { 'serif-bold': '𝐏', 'serif-italic': '𝑃', 'serif-bolditalic': '𝑷', 'sans-normal': '𝖯', 'sans-bold': '𝗣', 'sans-italic': '𝘗', 'sans-bolditalic': '𝙋', 'script-normal': '𝒫', 'script-bold': '𝓟', 'fraktur-normal': '𝔓', 'fraktur-bold': '𝕻', 'monospace-normal': '𝙿', 'doublestruck-normal': 'ℙ' },
	'Q': { 'serif-bold': '𝐐', 'serif-italic': '𝑄', 'serif-bolditalic': '𝑸', 'sans-normal': '𝖰', 'sans-bold': '𝗤', 'sans-italic': '𝘘', 'sans-bolditalic': '𝙌', 'script-normal': '𝒬', 'script-bold': '𝓠', 'fraktur-normal': '𝔔', 'fraktur-bold': '𝕼', 'monospace-normal': '𝚀', 'doublestruck-normal': 'ℚ' },
	'R': { 'serif-bold': '𝐑', 'serif-italic': '𝑅', 'serif-bolditalic': '𝑹', 'sans-normal': '𝖱', 'sans-bold': '𝗥', 'sans-italic': '𝘙', 'sans-bolditalic': '𝙍', 'script-normal': 'ℛ', 'script-bold': '𝓡', 'fraktur-normal': 'ℜ', 'fraktur-bold': '𝕽', 'monospace-normal': '𝚁', 'doublestruck-normal': 'ℝ' },
	'S': { 'serif-bold': '𝐒', 'serif-italic': '𝑆', 'serif-bolditalic': '𝑺', 'sans-normal': '𝖲', 'sans-bold': '𝗦', 'sans-italic': '𝘚', 'sans-bolditalic': '𝙎', 'script-normal': '𝒮', 'script-bold': '𝓢', 'fraktur-normal': '𝔖', 'fraktur-bold': '𝕾', 'monospace-normal': '𝚂', 'doublestruck-normal': '𝕊' },
	'T': { 'serif-bold': '𝐓', 'serif-italic': '𝑇', 'serif-bolditalic': '𝑻', 'sans-normal': '𝖳', 'sans-bold': '𝗧', 'sans-italic': '𝘛', 'sans-bolditalic': '𝙏', 'script-normal': '𝒯', 'script-bold': '𝓣', 'fraktur-normal': '𝔗', 'fraktur-bold': '𝕿', 'monospace-normal': '𝚃', 'doublestruck-normal': '𝕋' },
	'U': { 'serif-bold': '𝐔', 'serif-italic': '𝑈', 'serif-bolditalic': '𝑼', 'sans-normal': '𝖴', 'sans-bold': '𝗨', 'sans-italic': '𝘜', 'sans-bolditalic': '𝙐', 'script-normal': '𝒰', 'script-bold': '𝓤', 'fraktur-normal': '𝔘', 'fraktur-bold': '𝖀', 'monospace-normal': '𝚄', 'doublestruck-normal': '𝕌' },
	'V': { 'serif-bold': '𝐕', 'serif-italic': '𝑉', 'serif-bolditalic': '𝑽', 'sans-normal': '𝖵', 'sans-bold': '𝗩', 'sans-italic': '𝘝', 'sans-bolditalic': '𝙑', 'script-normal': '𝒱', 'script-bold': '𝓥', 'fraktur-normal': '𝔙', 'fraktur-bold': '𝖁', 'monospace-normal': '𝚅', 'doublestruck-normal': '𝕍' },
	'W': { 'serif-bold': '𝐖', 'serif-italic': '𝑊', 'serif-bolditalic': '𝑾', 'sans-normal': '𝖶', 'sans-bold': '𝗪', 'sans-italic': '𝘞', 'sans-bolditalic': '𝙒', 'script-normal': '𝒲', 'script-bold': '𝓦', 'fraktur-normal': '𝔚', 'fraktur-bold': '𝖂', 'monospace-normal': '𝚆', 'doublestruck-normal': '𝕎' },
	'X': { 'serif-bold': '𝐗', 'serif-italic': '𝑋', 'serif-bolditalic': '𝑿', 'sans-normal': '𝖷', 'sans-bold': '𝗫', 'sans-italic': '𝘟', 'sans-bolditalic': '𝙓', 'script-normal': '𝒳', 'script-bold': '𝓧', 'fraktur-normal': '𝔛', 'fraktur-bold': '𝖃', 'monospace-normal': '𝚇', 'doublestruck-normal': '𝕏' },
	'Y': { 'serif-bold': '𝐘', 'serif-italic': '𝑌', 'serif-bolditalic': '𝒀', 'sans-normal': '𝖸', 'sans-bold': '𝗬', 'sans-italic': '𝘠', 'sans-bolditalic': '𝙔', 'script-normal': '𝒴', 'script-bold': '𝓨', 'fraktur-normal': '𝔜', 'fraktur-bold': '𝖄', 'monospace-normal': '𝚈', 'doublestruck-normal': '𝕐' },
	'Z': { 'serif-bold': '𝐙', 'serif-italic': '𝑍', 'serif-bolditalic': '𝒁', 'sans-normal': '𝖹', 'sans-bold': '𝗭', 'sans-italic': '𝘡', 'sans-bolditalic': '𝙕', 'script-normal': '𝒵', 'script-bold': '𝓩', 'fraktur-normal': 'ℨ', 'fraktur-bold': '𝖅', 'monospace-normal': '𝚉', 'doublestruck-normal': 'ℤ' },
	'a': { 'serif-bold': '𝐚', 'serif-italic': '𝑎', 'serif-bolditalic': '𝒂', 'sans-normal': '𝖺', 'sans-bold': '𝗮', 'sans-italic': '𝘢', 'sans-bolditalic': '𝙖', 'script-normal': '𝒶', 'script-bold': '𝓪', 'fraktur-normal': '𝔞', 'fraktur-bold': '𝖆', 'monospace-normal': '𝚊', 'doublestruck-normal': '𝕒' },
	'b': { 'serif-bold': '𝐛', 'serif-italic': '𝑏', 'serif-bolditalic': '𝒃', 'sans-normal': '𝖻', 'sans-bold': '𝗯', 'sans-italic': '𝘣', 'sans-bolditalic': '𝙗', 'script-normal': '𝒷', 'script-bold': '𝓫', 'fraktur-normal': '𝔟', 'fraktur-bold': '𝖇', 'monospace-normal': '𝚋', 'doublestruck-normal': '𝕓' },
	'c': { 'serif-bold': '𝐜', 'serif-italic': '𝑐', 'serif-bolditalic': '𝒄', 'sans-normal': '𝖼', 'sans-bold': '𝗰', 'sans-italic': '𝘤', 'sans-bolditalic': '𝙘', 'script-normal': '𝒸', 'script-bold': '𝓬', 'fraktur-normal': '𝔠', 'fraktur-bold': '𝖈', 'monospace-normal': '𝚌', 'doublestruck-normal': '𝕔' },
	'd': { 'serif-bold': '𝐝', 'serif-italic': '𝑑', 'serif-bolditalic': '𝒅', 'sans-normal': '𝖽', 'sans-bold': '𝗱', 'sans-italic': '𝘥', 'sans-bolditalic': '𝙙', 'script-normal': '𝒹', 'script-bold': '𝓭', 'fraktur-normal': '𝔡', 'fraktur-bold': '𝖉', 'monospace-normal': '𝚍', 'doublestruck-normal': '𝕕' },
	'e': { 'serif-bold': '𝐞', 'serif-italic': '𝑒', 'serif-bolditalic': '𝒆', 'sans-normal': '𝖾', 'sans-bold': '𝗲', 'sans-italic': '𝘦', 'sans-bolditalic': '𝙚', 'script-normal': 'ℯ', 'script-bold': '𝓮', 'fraktur-normal': '𝔢', 'fraktur-bold': '𝖊', 'monospace-normal': '𝚎', 'doublestruck-normal': '𝕖' },
	'f': { 'serif-bold': '𝐟', 'serif-italic': '𝑓', 'serif-bolditalic': '𝒇', 'sans-normal': '𝖿', 'sans-bold': '𝗳', 'sans-italic': '𝘧', 'sans-bolditalic': '𝙛', 'script-normal': '𝒻', 'script-bold': '𝓯', 'fraktur-normal': '𝔣', 'fraktur-bold': '𝖋', 'monospace-normal': '𝚏', 'doublestruck-normal': '𝕗' },
	'g': { 'serif-bold': '𝐠', 'serif-italic': '𝑔', 'serif-bolditalic': '𝒈', 'sans-normal': '𝗀', 'sans-bold': '𝗴', 'sans-italic': '𝘨', 'sans-bolditalic': '𝙜', 'script-normal': 'ℊ', 'script-bold': '𝓰', 'fraktur-normal': '𝔤', 'fraktur-bold': '𝖌', 'monospace-normal': '𝚐', 'doublestruck-normal': '𝕘' },
	'h': { 'serif-bold': '𝐡', 'serif-italic': 'ℎ', 'serif-bolditalic': '𝒉', 'sans-normal': '𝗁', 'sans-bold': '𝗵', 'sans-italic': '𝘩', 'sans-bolditalic': '𝙝', 'script-normal': '𝒽', 'script-bold': '𝓱', 'fraktur-normal': '𝔥', 'fraktur-bold': '𝖍', 'monospace-normal': '𝚑', 'doublestruck-normal': '𝕙' },
	'i': { 'serif-bold': '𝐢', 'serif-italic': '𝑖', 'serif-bolditalic': '𝒊', 'sans-normal': '𝗂', 'sans-bold': '𝗶', 'sans-italic': '𝘪', 'sans-bolditalic': '𝙞', 'script-normal': '𝒾', 'script-bold': '𝓲', 'fraktur-normal': '𝔦', 'fraktur-bold': '𝖎', 'monospace-normal': '𝚒', 'doublestruck-normal': '𝕚' },
	'j': { 'serif-bold': '𝐣', 'serif-italic': '𝑗', 'serif-bolditalic': '𝒋', 'sans-normal': '𝗃', 'sans-bold': '𝗷', 'sans-italic': '𝘫', 'sans-bolditalic': '𝙟', 'script-normal': '𝒿', 'script-bold': '𝓳', 'fraktur-normal': '𝔧', 'fraktur-bold': '𝖏', 'monospace-normal': '𝚓', 'doublestruck-normal': '𝕛' },
	'k': { 'serif-bold': '𝐤', 'serif-italic': '𝑘', 'serif-bolditalic': '𝒌', 'sans-normal': '𝗄', 'sans-bold': '𝗸', 'sans-italic': '𝘬', 'sans-bolditalic': '𝙠', 'script-normal': '𝓀', 'script-bold': '𝓴', 'fraktur-normal': '𝔨', 'fraktur-bold': '𝖐', 'monospace-normal': '𝚔', 'doublestruck-normal': '𝕜' },
	'l': { 'serif-bold': '𝐥', 'serif-italic': '𝑙', 'serif-bolditalic': '𝒍', 'sans-normal': '𝗅', 'sans-bold': '𝗹', 'sans-italic': '𝘭', 'sans-bolditalic': '𝙡', 'script-normal': '𝓁', 'script-bold': '𝓵', 'fraktur-normal': '𝔩', 'fraktur-bold': '𝖑', 'monospace-normal': '𝚕', 'doublestruck-normal': '𝕝' },
	'm': { 'serif-bold': '𝐦', 'serif-italic': '𝑚', 'serif-bolditalic': '𝒎', 'sans-normal': '𝗆', 'sans-bold': '𝗺', 'sans-italic': '𝘮', 'sans-bolditalic': '𝙢', 'script-normal': '𝓂', 'script-bold': '𝓶', 'fraktur-normal': '𝔪', 'fraktur-bold': '𝖒', 'monospace-normal': '𝚖', 'doublestruck-normal': '𝕞' },
	'n': { 'serif-bold': '𝐧', 'serif-italic': '𝑛', 'serif-bolditalic': '𝒏', 'sans-normal': '𝗇', 'sans-bold': '𝗻', 'sans-italic': '𝘯', 'sans-bolditalic': '𝙣', 'script-normal': '𝓃', 'script-bold': '𝓷', 'fraktur-normal': '𝔫', 'fraktur-bold': '𝖓', 'monospace-normal': '𝚗', 'doublestruck-normal': '𝕟' },
	'o': { 'serif-bold': '𝐨', 'serif-italic': '𝑜', 'serif-bolditalic': '𝒐', 'sans-normal': '𝗈', 'sans-bold': '𝗼', 'sans-italic': '𝘰', 'sans-bolditalic': '𝙤', 'script-normal': 'ℴ', 'script-bold': '𝓸', 'fraktur-normal': '𝔬', 'fraktur-bold': '𝖔', 'monospace-normal': '𝚘', 'doublestruck-normal': '𝕠' },
	'p': { 'serif-bold': '𝐩', 'serif-italic': '𝑝', 'serif-bolditalic': '𝒑', 'sans-normal': '𝗉', 'sans-bold': '𝗽', 'sans-italic': '𝘱', 'sans-bolditalic': '𝙥', 'script-normal': '𝓅', 'script-bold': '𝓹', 'fraktur-normal': '𝔭', 'fraktur-bold': '𝖕', 'monospace-normal': '𝚙', 'doublestruck-normal': '𝕡' },
	'q': { 'serif-bold': '𝐪', 'serif-italic': '𝑞', 'serif-bolditalic': '𝒒', 'sans-normal': '𝗊', 'sans-bold': '𝗾', 'sans-italic': '𝘲', 'sans-bolditalic': '𝙦', 'script-normal': '𝓆', 'script-bold': '𝓺', 'fraktur-normal': '𝔮', 'fraktur-bold': '𝖖', 'monospace-normal': '𝚚', 'doublestruck-normal': '𝕢' },
	'r': { 'serif-bold': '𝐫', 'serif-italic': '𝑟', 'serif-bolditalic': '𝒓', 'sans-normal': '𝗋', 'sans-bold': '𝗿', 'sans-italic': '𝘳', 'sans-bolditalic': '𝙧', 'script-normal': '𝓇', 'script-bold': '𝓻', 'fraktur-normal': '𝔯', 'fraktur-bold': '𝖗', 'monospace-normal': '𝚛', 'doublestruck-normal': '𝕣' },
	's': { 'serif-bold': '𝐬', 'serif-italic': '𝑠', 'serif-bolditalic': '𝒔', 'sans-normal': '𝗌', 'sans-bold': '𝘀', 'sans-italic': '𝘴', 'sans-bolditalic': '𝙨', 'script-normal': '𝓈', 'script-bold': '𝓼', 'fraktur-normal': '𝔰', 'fraktur-bold': '𝖘', 'monospace-normal': '𝚜', 'doublestruck-normal': '𝕤' },
	't': { 'serif-bold': '𝐭', 'serif-italic': '𝑡', 'serif-bolditalic': '𝒕', 'sans-normal': '𝗍', 'sans-bold': '𝘁', 'sans-italic': '𝘵', 'sans-bolditalic': '𝙩', 'script-normal': '𝓉', 'script-bold': '𝓽', 'fraktur-normal': '𝔱', 'fraktur-bold': '𝖙', 'monospace-normal': '𝚝', 'doublestruck-normal': '𝕥' },
	'u': { 'serif-bold': '𝐮', 'serif-italic': '𝑢', 'serif-bolditalic': '𝒖', 'sans-normal': '𝗎', 'sans-bold': '𝘂', 'sans-italic': '𝘶', 'sans-bolditalic': '𝙪', 'script-normal': '𝓊', 'script-bold': '𝓾', 'fraktur-normal': '𝔲', 'fraktur-bold': '𝖚', 'monospace-normal': '𝚞', 'doublestruck-normal': '𝕦' },
	'v': { 'serif-bold': '𝐯', 'serif-italic': '𝑣', 'serif-bolditalic': '𝒗', 'sans-normal': '𝗏', 'sans-bold': '𝘃', 'sans-italic': '𝘷', 'sans-bolditalic': '𝙫', 'script-normal': '𝓋', 'script-bold': '𝓿', 'fraktur-normal': '𝔳', 'fraktur-bold': '𝖛', 'monospace-normal': '𝚟', 'doublestruck-normal': '𝕧' },
	'w': { 'serif-bold': '𝐰', 'serif-italic': '𝑤', 'serif-bolditalic': '𝒘', 'sans-normal': '𝗐', 'sans-bold': '𝘄', 'sans-italic': '𝘸', 'sans-bolditalic': '𝙬', 'script-normal': '𝓌', 'script-bold': '𝔀', 'fraktur-normal': '𝔴', 'fraktur-bold': '𝖜', 'monospace-normal': '𝚠', 'doublestruck-normal': '𝕨' },
	'x': { 'serif-bold': '𝐱', 'serif-italic': '𝑥', 'serif-bolditalic': '𝒙', 'sans-normal': '𝗑', 'sans-bold': '𝘅', 'sans-italic': '𝘹', 'sans-bolditalic': '𝙭', 'script-normal': '𝓍', 'script-bold': '𝔁', 'fraktur-normal': '𝔵', 'fraktur-bold': '𝖝', 'monospace-normal': '𝚡', 'doublestruck-normal': '𝕩' },
	'y': { 'serif-bold': '𝐲', 'serif-italic': '𝑦', 'serif-bolditalic': '𝒚', 'sans-normal': '𝗒', 'sans-bold': '𝘆', 'sans-italic': '𝘺', 'sans-bolditalic': '𝙮', 'script-normal': '𝓎', 'script-bold': '𝔂', 'fraktur-normal': '𝔶', 'fraktur-bold': '𝖞', 'monospace-normal': '𝚢', 'doublestruck-normal': '𝕪' },
	'z': { 'serif-bold': '𝐳', 'serif-italic': '𝑧', 'serif-bolditalic': '𝒛', 'sans-normal': '𝗓', 'sans-bold': '𝘇', 'sans-italic': '𝘻', 'sans-bolditalic': '𝙯', 'script-normal': '𝓏', 'script-bold': '𝔃', 'fraktur-normal': '𝔷', 'fraktur-bold': '𝖟', 'monospace-normal': '𝚣', 'doublestruck-normal': '𝕫' },
	'ı': { 'serif-italic': '𝚤' },
	'ȷ': { 'serif-italic': '𝚥' },
	'Α': { 'serif-bold': '𝚨', 'serif-italic': '𝛢', 'serif-bolditalic': '𝜜', 'sans-bold': '𝝖', 'sans-bolditalic': '𝞐' },
	'Β': { 'serif-bold': '𝚩', 'serif-italic': '𝛣', 'serif-bolditalic': '𝜝', 'sans-bold': '𝝗', 'sans-bolditalic': '𝞑' },
	'Γ': { 'serif-bold': '𝚪', 'serif-italic': '𝛤', 'serif-bolditalic': '𝜞', 'sans-bold': '𝝘', 'sans-bolditalic': '𝞒' },
	'Δ': { 'serif-bold': '𝚫', 'serif-italic': '𝛥', 'serif-bolditalic': '𝜟', 'sans-bold': '𝝙', 'sans-bolditalic': '𝞓' },
	'Ε': { 'serif-bold': '𝚬', 'serif-italic': '𝛦', 'serif-bolditalic': '𝜠', 'sans-bold': '𝝚', 'sans-bolditalic': '𝞔' },
	'Ζ': { 'serif-bold': '𝚭', 'serif-italic': '𝛧', 'serif-bolditalic': '𝜡', 'sans-bold': '𝝛', 'sans-bolditalic': '𝞕' },
	'Η': { 'serif-bold': '𝚮', 'serif-italic': '𝛨', 'serif-bolditalic': '𝜢', 'sans-bold': '𝝜', 'sans-bolditalic': '𝞖' },
	'Θ': { 'serif-bold': '𝚯', 'serif-italic': '𝛩', 'serif-bolditalic': '𝜣', 'sans-bold': '𝝝', 'sans-bolditalic': '𝞗' },
	'Ι': { 'serif-bold': '𝚰', 'serif-italic': '𝛪', 'serif-bolditalic': '𝜤', 'sans-bold': '𝝞', 'sans-bolditalic': '𝞘' },
	'Κ': { 'serif-bold': '𝚱', 'serif-italic': '𝛫', 'serif-bolditalic': '𝜥', 'sans-bold': '𝝟', 'sans-bolditalic': '𝞙' },
	'Λ': { 'serif-bold': '𝚲', 'serif-italic': '𝛬', 'serif-bolditalic': '𝜦', 'sans-bold': '𝝠', 'sans-bolditalic': '𝞚' },
	'Μ': { 'serif-bold': '𝚳', 'serif-italic': '𝛭', 'serif-bolditalic': '𝜧', 'sans-bold': '𝝡', 'sans-bolditalic': '𝞛' },
	'Ν': { 'serif-bold': '𝚴', 'serif-italic': '𝛮', 'serif-bolditalic': '𝜨', 'sans-bold': '𝝢', 'sans-bolditalic': '𝞜' },
	'Ξ': { 'serif-bold': '𝚵', 'serif-italic': '𝛯', 'serif-bolditalic': '𝜩', 'sans-bold': '𝝣', 'sans-bolditalic': '𝞝' },
	'Ο': { 'serif-bold': '𝚶', 'serif-italic': '𝛰', 'serif-bolditalic': '𝜪', 'sans-bold': '𝝤', 'sans-bolditalic': '𝞞' },
	'Π': { 'serif-bold': '𝚷', 'serif-italic': '𝛱', 'serif-bolditalic': '𝜫', 'sans-bold': '𝝥', 'sans-bolditalic': '𝞟' },
	'Ρ': { 'serif-bold': '𝚸', 'serif-italic': '𝛲', 'serif-bolditalic': '𝜬', 'sans-bold': '𝝦', 'sans-bolditalic': '𝞠' },
	'ϴ': { 'serif-bold': '𝚹', 'serif-italic': '𝛳', 'serif-bolditalic': '𝜭', 'sans-bold': '𝝧', 'sans-bolditalic': '𝞡' },
	'Σ': { 'serif-bold': '𝚺', 'serif-italic': '𝛴', 'serif-bolditalic': '𝜮', 'sans-bold': '𝝨', 'sans-bolditalic': '𝞢' },
	'Τ': { 'serif-bold': '𝚻', 'serif-italic': '𝛵', 'serif-bolditalic': '𝜯', 'sans-bold': '𝝩', 'sans-bolditalic': '𝞣' },
	'Υ': { 'serif-bold': '𝚼', 'serif-italic': '𝛶', 'serif-bolditalic': '𝜰', 'sans-bold': '𝝪', 'sans-bolditalic': '𝞤' },
	'Φ': { 'serif-bold': '𝚽', 'serif-italic': '𝛷', 'serif-bolditalic': '𝜱', 'sans-bold': '𝝫', 'sans-bolditalic': '𝞥' },
	'Χ': { 'serif-bold': '𝚾', 'serif-italic': '𝛸', 'serif-bolditalic': '𝜲', 'sans-bold': '𝝬', 'sans-bolditalic': '𝞦' },
	'Ψ': { 'serif-bold': '𝚿', 'serif-italic': '𝛹', 'serif-bolditalic': '𝜳', 'sans-bold': '𝝭', 'sans-bolditalic': '𝞧' },
	'Ω': { 'serif-bold': '𝛀', 'serif-italic': '𝛺', 'serif-bolditalic': '𝜴', 'sans-bold': '𝝮', 'sans-bolditalic': '𝞨' },
	'∇': { 'serif-bold': '𝛁', 'serif-italic': '𝛻', 'serif-bolditalic': '𝜵', 'sans-bold': '𝝯', 'sans-bolditalic': '𝞩' },
	'α': { 'serif-bold': '𝛂', 'serif-italic': '𝛼', 'serif-bolditalic': '𝜶', 'sans-bold': '𝝰', 'sans-bolditalic': '𝞪' },
	'β': { 'serif-bold': '𝛃', 'serif-italic': '𝛽', 'serif-bolditalic': '𝜷', 'sans-bold': '𝝱', 'sans-bolditalic': '𝞫' },
	'γ': { 'serif-bold': '𝛄', 'serif-italic': '𝛾', 'serif-bolditalic': '𝜸', 'sans-bold': '𝝲', 'sans-bolditalic': '𝞬' },
	'δ': { 'serif-bold': '𝛅', 'serif-italic': '𝛿', 'serif-bolditalic': '𝜹', 'sans-bold': '𝝳', 'sans-bolditalic': '𝞭' },
	'ε': { 'serif-bold': '𝛆', 'serif-italic': '𝜀', 'serif-bolditalic': '𝜺', 'sans-bold': '𝝴', 'sans-bolditalic': '𝞮' },
	'ζ': { 'serif-bold': '𝛇', 'serif-italic': '𝜁', 'serif-bolditalic': '𝜻', 'sans-bold': '𝝵', 'sans-bolditalic': '𝞯' },
	'η': { 'serif-bold': '𝛈', 'serif-italic': '𝜂', 'serif-bolditalic': '𝜼', 'sans-bold': '𝝶', 'sans-bolditalic': '𝞰' },
	'θ': { 'serif-bold': '𝛉', 'serif-italic': '𝜃', 'serif-bolditalic': '𝜽', 'sans-bold': '𝝷', 'sans-bolditalic': '𝞱' },
	'ι': { 'serif-bold': '𝛊', 'serif-italic': '𝜄', 'serif-bolditalic': '𝜾', 'sans-bold': '𝝸', 'sans-bolditalic': '𝞲' },
	'κ': { 'serif-bold': '𝛋', 'serif-italic': '𝜅', 'serif-bolditalic': '𝜿', 'sans-bold': '𝝹', 'sans-bolditalic': '𝞳' },
	'λ': { 'serif-bold': '𝛌', 'serif-italic': '𝜆', 'serif-bolditalic': '𝝀', 'sans-bold': '𝝺', 'sans-bolditalic': '𝞴' },
	'μ': { 'serif-bold': '𝛍', 'serif-italic': '𝜇', 'serif-bolditalic': '𝝁', 'sans-bold': '𝝻', 'sans-bolditalic': '𝞵' },
	'ν': { 'serif-bold': '𝛎', 'serif-italic': '𝜈', 'serif-bolditalic': '𝝂', 'sans-bold': '𝝼', 'sans-bolditalic': '𝞶' },
	'ξ': { 'serif-bold': '𝛏', 'serif-italic': '𝜉', 'serif-bolditalic': '𝝃', 'sans-bold': '𝝽', 'sans-bolditalic': '𝞷' },
	'ο': { 'serif-bold': '𝛐', 'serif-italic': '𝜊', 'serif-bolditalic': '𝝄', 'sans-bold': '𝝾', 'sans-bolditalic': '𝞸' },
	'π': { 'serif-bold': '𝛑', 'serif-italic': '𝜋', 'serif-bolditalic': '𝝅', 'sans-bold': '𝝿', 'sans-bolditalic': '𝞹' },
	'ρ': { 'serif-bold': '𝛒', 'serif-italic': '𝜌', 'serif-bolditalic': '𝝆', 'sans-bold': '𝞀', 'sans-bolditalic': '𝞺' },
	'ς': { 'serif-bold': '𝛓', 'serif-italic': '𝜍', 'serif-bolditalic': '𝝇', 'sans-bold': '𝞁', 'sans-bolditalic': '𝞻' },
	'σ': { 'serif-bold': '𝛔', 'serif-italic': '𝜎', 'serif-bolditalic': '𝝈', 'sans-bold': '𝞂', 'sans-bolditalic': '𝞼' },
	'τ': { 'serif-bold': '𝛕', 'serif-italic': '𝜏', 'serif-bolditalic': '𝝉', 'sans-bold': '𝞃', 'sans-bolditalic': '𝞽' },
	'υ': { 'serif-bold': '𝛖', 'serif-italic': '𝜐', 'serif-bolditalic': '𝝊', 'sans-bold': '𝞄', 'sans-bolditalic': '𝞾' },
	'φ': { 'serif-bold': '𝛗', 'serif-italic': '𝜑', 'serif-bolditalic': '𝝋', 'sans-bold': '𝞅', 'sans-bolditalic': '𝞿' },
	'χ': { 'serif-bold': '𝛘', 'serif-italic': '𝜒', 'serif-bolditalic': '𝝌', 'sans-bold': '𝞆', 'sans-bolditalic': '𝟀' },
	'ψ': { 'serif-bold': '𝛙', 'serif-italic': '𝜓', 'serif-bolditalic': '𝝍', 'sans-bold': '𝞇', 'sans-bolditalic': '𝟁' },
	'ω': { 'serif-bold': '𝛚', 'serif-italic': '𝜔', 'serif-bolditalic': '𝝎', 'sans-bold': '𝞈', 'sans-bolditalic': '𝟂' },
	'∂': { 'serif-bold': '𝛛', 'serif-italic': '𝜕', 'serif-bolditalic': '𝝏', 'sans-bold': '𝞉', 'sans-bolditalic': '𝟃' },
	'ϵ': { 'serif-bold': '𝛜', 'serif-italic': '𝜖', 'serif-bolditalic': '𝝐', 'sans-bold': '𝞊', 'sans-bolditalic': '𝟄' },
	'ϑ': { 'serif-bold': '𝛝', 'serif-italic': '𝜗', 'serif-bolditalic': '𝝑', 'sans-bold': '𝞋', 'sans-bolditalic': '𝟅' },
	'ϰ': { 'serif-bold': '𝛞', 'serif-italic': '𝜘', 'serif-bolditalic': '𝝒', 'sans-bold': '𝞌', 'sans-bolditalic': '𝟆' },
	'ϕ': { 'serif-bold': '𝛟', 'serif-italic': '𝜙', 'serif-bolditalic': '𝝓', 'sans-bold': '𝞍', 'sans-bolditalic': '𝟇' },
	'ϱ': { 'serif-bold': '𝛠', 'serif-italic': '𝜚', 'serif-bolditalic': '𝝔', 'sans-bold': '𝞎', 'sans-bolditalic': '𝟈' },
	'ϖ': { 'serif-bold': '𝛡', 'serif-italic': '𝜛', 'serif-bolditalic': '𝝕', 'sans-bold': '𝞏', 'sans-bolditalic': '𝟉' },
	'Ϝ': { 'serif-bold': '𝟊' },
	'ϝ': { 'serif-bold': '𝟋' },
	'0': { 'serif-bold': '𝟎', 'doublestruck-normal': '𝟘', 'sans-normal': '𝟢', 'sans-bold': '𝟬', 'monospace-normal': '𝟶' },
	'1': { 'serif-bold': '𝟏', 'doublestruck-normal': '𝟙', 'sans-normal': '𝟣', 'sans-bold': '𝟭', 'monospace-normal': '𝟷' },
	'2': { 'serif-bold': '𝟐', 'doublestruck-normal': '𝟚', 'sans-normal': '𝟤', 'sans-bold': '𝟮', 'monospace-normal': '𝟸' },
	'3': { 'serif-bold': '𝟑', 'doublestruck-normal': '𝟛', 'sans-normal': '𝟥', 'sans-bold': '𝟯', 'monospace-normal': '𝟹' },
	'4': { 'serif-bold': '𝟒', 'doublestruck-normal': '𝟜', 'sans-normal': '𝟦', 'sans-bold': '𝟰', 'monospace-normal': '𝟺' },
	'5': { 'serif-bold': '𝟓', 'doublestruck-normal': '𝟝', 'sans-normal': '𝟧', 'sans-bold': '𝟱', 'monospace-normal': '𝟻' },
	'6': { 'serif-bold': '𝟔', 'doublestruck-normal': '𝟞', 'sans-normal': '𝟨', 'sans-bold': '𝟲', 'monospace-normal': '𝟼' },
	'7': { 'serif-bold': '𝟕', 'doublestruck-normal': '𝟟', 'sans-normal': '𝟩', 'sans-bold': '𝟳', 'monospace-normal': '𝟽' },
	'8': { 'serif-bold': '𝟖', 'doublestruck-normal': '𝟠', 'sans-normal': '𝟪', 'sans-bold': '𝟴', 'monospace-normal': '𝟾' },
	'9': { 'serif-bold': '𝟗', 'doublestruck-normal': '𝟡', 'sans-normal': '𝟫', 'sans-bold': '𝟵', 'monospace-normal': '𝟿' },
};
var arrUnicodeOperators = [
	'×', '⋅', '∈', '∋', '∼', '≃', '≅', '≈',
	'≍', '≡', '≤', '≥', '≶', '≷', '≽', '≺',
	'≻', '≼', '⊂', '⊃', '⊆', '⊇', '⊑', '⊒',
];
var arrUnicodeOperatorsValues = {
	'×': 215,
	'⋅': 8901,
	'∈': 8712,
	'∋': 8715,
	'∼': 8764,
	'≃': 8771,
	'≅': 8773,
	'≈': 8776,
	'≍': 8781,
	'≡': 8801,
	'≤': 8804,
	'≥': 8805,
	'≶': 8822,
	'≷': 8823,
	'≽': 8829,
	'≺': 8826,
	'≻': 8827,
	'≼': 8828,
	'⊂': 8834,
	'⊃': 8835,
	'⊆': 8838,
	'⊇': 8839,
	'⊑': 8849,
	'⊒': 8850,
};
var arrNarryOperators = [
	'∑', '∏', '∫', '∬', '∭', '⨌', '∮', '∱',
	'⨑', '⋂', '⨃', '⋃', '⨄', '⨀', '⨁', '⨂',
];
var arrLogicOperators = [
	'∃', '∀', '¬', '∧', '∨', '⇒', '⇔', '⊕', '⊤', '⊥', '⊢',
];
var arrDBOperators = [
	'⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷', '÷', 'π', 'σ',
];
var arrUnicodeSpecificOperators = [
	'▒', '█', '▭', '□', '■', '▁', '¦', '⒞', '├', '┤', '┬', '┴', '©', '〖', '〗', '⒨', 'Ⅎ', '⁄', '∕', '⊘', '│', '∣',
];
var arrUnicodeRoots = [
	'√', '∛', '∜',
];
var arrUnicodeSuperscripts = [
	'⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻', '⁼', '⁽', '⁾',
];
var arrUnicodeSubsripts = [
	'₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₊', '₋', '₌', '₍', '₎',
];
var arrUnicodeDelimiters = [
	'(', ')', '[', ']', '{', '}', '⟨', '⟩', '⌈', '⌉', '⌊', '⌋',
];
var arrUnicodeUnderOverBraces = [
	'⏜', '⏝', '⏞', '⏟', '⏠', '⏡', '⎴', '⎵', '¯',
];
var arrLaTeXUnderOverBraces = [
	'\\underbrace', '\\underparen', '\\underbar', '\\overbrace', '\\overparen', '\\overbar', '\\overshell', '\\undershell', '\\overbracket', '\\underbracket',
];
var arrUnicodeStretchyArrows = [
	'←', '→', '↔', '⇐', '⇒', '⇔', '↩', '↪', '↼', '⇀', '↽', '⇁', '⊢', '⊣', '⟵', '⟶', '⟷', '⟸', '⟹', '⟺', '↦', ','
];
var arrUnicodeEnclusures = [
	'▭', ' ̄', '▁', '▢', '○', '⟌⃧', '⬭',
];
var arrUnicodePhantoms = [
	'⟡', '⬄', '⇳', '⬍', '⬆', '⬇', '⬌',
];
var arrUnicodeCombiningMarks = [
	'̂', '̌', '̃', '́', '̀', '̇', '̈', '⃛', '̄', '⃗',
];

var typeOfFraction = null;
var FRACTION_IN_BOX = 4;
var BAR_FRACTION = BAR_FRACTION;
var SKEWED_FRACTION = SKEWED_FRACTION;
var LINEAR_FRACTION = LINEAR_FRACTION;
function EquationProcessing(Parent) {
	this.Parent = Parent;
	this.IndexesOfIgnoredAtoms = {};
	this.type = this.CheckTypeOfParent();
	this.eqArray = undefined;
}
EquationProcessing.prototype.isLaTeX = function () {
	return this.type === LaTeX;
};
EquationProcessing.prototype.isUnicode = function () {
	return this.type === Unicode;
};
EquationProcessing.prototype.CheckTypeOfParent = function () {
	if (this.Parent instanceof CLaTeXParser) {
		return LaTeX;
	}
	else if (this.Parent instanceof CUnicodeParser) {
		return Unicode;
	}
};
EquationProcessing.prototype.Parse = function () {
	var strTempWord = "";
	var str = this.Parent.str;
	var arrAtoms = [];
	var arrCheckParser = [];

	arrCheckParser = arrCheckParser.concat(MathOperators, Bracets, isLaTeXAtom, arrLaTeXFunctionsName);

	if (this.isLaTeX()) {
		arrCheckParser = arrCheckParser.concat(arrLaTeXUnderOverBraces);
	}
	else if (this.isUnicode()) {
		arrCheckParser = arrCheckParser.concat(UnicodeSymbols);
	}

	for (var i = 0; i <= str.length; i++) {
		if (str[i] !== undefined && str[i].charCodeAt() !== 65533 && str[i] !== '\u2061') {
			strTempWord += str[i];

			var tempStrForLaTeX;

			if (strTempWord === '\u2061') {
				strTempWord = '';
				continue
			}

			if (i >= 1 && (str[i - 1] === '^' || str[i - 1] === '_') && !this.StartBracet[str[i]]) {
				arrAtoms.push(strTempWord);
				strTempWord = "";
				tempStrForLaTeX = "";
			}

			if (!isNaN(strTempWord) && !isNaN(str[i + 1])) {
				continue
			}

			if (strTempWord[0] === '\\' && strTempWord.length > 1 && str[i + 1] !== '\\' && strTempWord[1] !== '\\') {
				tempStrForLaTeX = strTempWord;
				tempStrForLaTeX = tempStrForLaTeX.slice(1)
			}

			var one = tempStrForLaTeX + str[i + 1];
			if (arrLaTeXFunctionsName.includes(one)) {
				continue
			}

			if (arrCheckParser.includes(strTempWord) ||
				arrCheckParser.includes(tempStrForLaTeX) ||
				arrCheckParser.includes(str[i + 1]) ||
				str[i + 1] === '\\' && str[i] !== '\\' ||
				str[i+1] === ' ' ||
				strTempWord === '\\\\') {
					arrAtoms.push(strTempWord);
					strTempWord = "";
					tempStrForLaTeX = "";
			}
		}
	}

	arrAtoms.push(strTempWord);
	this.Parent.arrAtoms = arrAtoms.filter(Boolean);
	console.log(this.Parent.arrAtoms, this.type === LaTeX ? 'Latex' : 'Unicode');
};
//	Change intIndexArray;
EquationProcessing.prototype.GetNextAtom = function () {
	this.Parent.intIndexArray++;
	return this.GetNowAtom();
};
EquationProcessing.prototype.GetNowAtom = function () {
	return this.Parent.arrAtoms[this.Parent.intIndexArray];
};
EquationProcessing.prototype.GetAtomByIndex = function (n) {
	if (n < 0 || n >= this.Parent.arrAtoms.length) {
		return false;
	}
	return this.Parent.arrAtoms[n];
};
//	Not change intIndexArray;
EquationProcessing.prototype.GetFutureAtom = function (n) {
	if (n === undefined) {
		n = 1;
	}
	return this.Parent.arrAtoms[this.Parent.intIndexArray + n];
};
EquationProcessing.prototype.GetPrevAtom = function () {
	if (this.Parent.intIndexArray >= 0) {
		return false;
	}
	return this.Parent.arrAtoms[this.Parent.intIndexArray];
};
EquationProcessing.prototype.ScriptBracetSyntaxChecker = function (index) {
	var Obj = {
		Script: [],
		index: index + 1,
		symbol: null,
	};

	Obj.symbol = this.GetAtomByIndex(Obj.index);
	Obj.index++;

	if (Obj.symbol === '^' || Obj.symbol === '_') {
		Obj.Script.push(Obj.symbol);

		//скобка или символы
		Obj.symbol = this.GetAtomByIndex(Obj.index);
		Obj.Script.push(Obj.symbol === '(' || Obj.symbol === '{' ? '(' : '1');
		Obj.symbol = false;

		//Скобка с данными
		if (Obj.Script[Obj.Script.length - 1] === '(') {
			Obj.symbol = this.CheckAfterBracet(Obj);
		} else {
			Obj.index++;
			Obj.symbol = this.GetAtomByIndex(Obj.index);
		}

		//После скобки новый элемент
		if (Obj.symbol !== false &&
			Obj.symbol !== undefined &&
			Obj.Script[0] === '^'
			? (Obj.symbol === '_')
			: (Obj.symbol === '^')) {
			Obj.Script.push(Obj.symbol);
			//скобка или элемент
			Obj.symbol = this.GetAtomByIndex(Obj.index + 1);
			Obj.Script.push(Obj.symbol === '(' || Obj.symbol === '{' ? '(' : '1');
		}
	}
	return Obj.Script;
};
EquationProcessing.prototype.CheckAfterBracet = function (Obj) {
	var strNowAtom = this.GetAtomByIndex(Obj.index);
	var intTempIndex = Obj.index;
	var strOpenBracet;
	var strCloseBracet;

	if (strNowAtom === '(') {
		strOpenBracet = '(';
		strCloseBracet = ')';
	}
	else if (strNowAtom === '{') {
		strOpenBracet = '{';
		strCloseBracet = '}'
	}

	if (strNowAtom === strOpenBracet) {
		var strAtom;
		var intCounter = 1;

		do {
			strAtom = this.GetAtomByIndex(Obj.index);
			if (strAtom === strOpenBracet && intTempIndex !== Obj.index) {
				intCounter++;
			}
			Obj.index++;

			if (strAtom === strCloseBracet) {
				intCounter--;
			}
		} while (!(intCounter === 0 && strAtom === strCloseBracet));

		if (strAtom === strCloseBracet) {
			return this.GetAtomByIndex(Obj.index);
		}

		else {
			return false;
		}
	}
};
EquationProcessing.prototype.SearchAtom = function (str, maxIndex) {
	if (maxIndex === undefined) {
		maxIndex = this.Parent.arrAtoms.length;
	}
	for (var i = this.Parent.intIndexArray; i < this.Parent.arrAtoms.length && i < maxIndex; i++) {
		if (str === this.Parent.arrAtoms[i]) {
			return i;
		}
	}

	return false;
};
EquationProcessing.prototype.AddIndexToIgnor = function (intIndex, isWriteOnSee) {
	if (isWriteOnSee === undefined) {
		isWriteOnSee = false;
	}
	if (!this.IndexesOfIgnoredAtoms[intIndex]) {
		this.IndexesOfIgnoredAtoms[intIndex] = isWriteOnSee;
	}
};
EquationProcessing.prototype.AddBracetBlockToIgnor = function (n, isWriteOnSee) {
	var intIndex;
	if (n === undefined) {
		intIndex = 1
	} else {
		intIndex = n;
	}
	var startIndex = this.Parent.intIndexArray + intIndex;
	var middleIndex;

	var strTempAtom = this.GetFutureAtom(intIndex);
	if (strTempAtom === '_' || strTempAtom === '^') {
		intIndex++;
		middleIndex = this.Parent.intIndexArray + intIndex
	}
	var intExitIndex = this.CheckCloseBracet(this.Parent.intIndexArray + intIndex);
	if (intExitIndex !== false) {
		this.AddIndexToIgnor(startIndex, isWriteOnSee);
		this.AddIndexToIgnor(intExitIndex, isWriteOnSee);
		if (middleIndex) {
			this.AddIndexToIgnor(middleIndex, isWriteOnSee);
		}
		return intExitIndex;
	}
};
EquationProcessing.prototype.StartLexer = function (context, indexOfExit) {
	var strAtom = this.GetFutureAtom();

	if (indexOfExit === undefined) {
		indexOfExit = this.CheckCloseBracet(undefined, undefined, true);
	}

	if (indexOfExit) {
		if (this.isLaTeX()) {
			CLaTeXLexer(this.Parent, context, indexOfExit);
		}
		else if (this.isUnicode()) {
			CUnicodeLexer(this.Parent, context, indexOfExit);
		}
	}
	else {
		if (this.isLaTeX()) {
			CLaTeXLexer(this.Parent, context, true);
		}
		else if (this.isUnicode()) {
			CUnicodeLexer(this.Parent, context, true);
		}
	}
};
EquationProcessing.prototype.CheckSyntax = function (arrRules, n) {
	if (undefined === n) { n = 0 }
	arrRules = this[arrRules]
	var str = this.Parent.arrAtoms;
	// var arrRules = [
	// 	{
	// 		Data: '\\sqrt'
	// 	},
	// 	{
	// 		MustBeExactBracet: ['[', ']'],
	// 		isRequired: false,
	// 	},
	// 	{
	// 		MustBeExactBracet: ['|', '|'],
	// 	}
	// 	// {
	// 	// 	Data: true, // {...} (...) or single atom/char
	// 	// 	MustBeBracets: true, //-> Data.true
	// 	// 	MustBeExactBracet: ['[', ']']
	// 	// },
	// 	// {
	// 	// 	Data: ["^", "_"], // 3, 4, "_",
	// 	// 	Save: 'FirstSymbol'
	// 	// },
	// 	// {
	// 	// 	Data: true // {...} (...) or single atom/char
	// 	// },
	// 	// {
	// 	// 	Reverse: 'FirstSymbol'
	// 	// },
	// 	// {
	// 	// 	Data: true // {...} (...) or single atom/char
	// 	// },
	// ];
	var oRule;
	var strIndex = this.Parent.intIndexArray + n;
	var arrVariables = {};
	var requared = true;
	var returnData = null;

	var ProceedIsRequired = function () {
		if (!oRule.hasOwnProperty('isRequired')) {
			oRule.isRequired = true;
			requared = true;
		} else {
			requared = oRule['isRequired'];
		}
	};
	var ProceedReverse = function () {
		if (oRule.hasOwnProperty('Reverse')) {
			var oDataOfPrevBlock = arrVariables[oRule.Reverse].data;
			var strWhatFindinPrevBlock = arrVariables[oRule.Reverse].whatFind;
			if (oDataOfPrevBlock.includes(str[strIndex]) && str[strIndex] !== strWhatFindinPrevBlock) {
				strIndex++;
				return true
			}
		}
		return false
	};
	var ProceedSave = function () {
		if (oRule.hasOwnProperty('Save')) {
			arrVariables[oRule.Save] = {};
			arrVariables[oRule.Save].data = oRule.Data;
		}
	};
	var ProceedData = function (t) {
		if (oRule.hasOwnProperty('Data')) {

			//значит нужен блок или символ, неважно какой
			if (oRule.Data === true) {

				var varIndexOfCloseBracet = oRule.hasOwnProperty('MustBeExactBracet')
					? t.CheckCloseBracet(strIndex, oRule.MustBeExactBracet)
					: t.CheckCloseBracet(strIndex);

				if (oRule.hasOwnProperty('MustBeBracets')) {
					if (varIndexOfCloseBracet === false && requared) {
						return false
					}
				}

				if (typeof varIndexOfCloseBracet === 'number') {
					//strIndex++; // перевод на след. символ
					strIndex = varIndexOfCloseBracet + 1;
					return true;
				}
				else {
					if (oRule.hasOwnProperty('MustBeExactBracet') && requared === false) {
						return true
					}
					else if (!oRule.hasOwnProperty('MustBeExactBracet') && strIndex + 1 <= str.length) {
						strIndex++;
						return true;
					}
					else if (requared === true) {
						return false
					}

				}
			}
			//значит символ может быть одним из содерж. в этом массиве
			else if (Array.isArray(oRule.Data)) {
				if (oRule.Data.includes(str[strIndex])) {
					if (oRule.hasOwnProperty('Save')) {
						arrVariables[oRule.Save]['whatFind'] = str[strIndex];
					}
					if (oRule.hasOwnProperty('returnIndex')) {
						returnData = strIndex;
					}
					strIndex++;
					return true;
				}
				else if (requared) {
					return false
				}
			}
			//значит элемент должен быть строкой
			else if (typeof oRule.Data === 'string') {
				if (oRule.Data === str[strIndex]) {
					if (oRule.hasOwnProperty('Save')) {
						arrVariables[oRule.Save]['whatFind'] = str[strIndex];
					}
					if (oRule.hasOwnProperty('returnIndex')) {
						returnData = strIndex;
					}
					strIndex++;
					return true;
				}
				else if (requared) {
					return false
				}
			}
		}
	};
	var ProceedMustBracets = function () {
		if (oRule.hasOwnProperty('MustBeBracets')) {
			oRule.Data = true;
		}
	};
	var ProceedExactBracets = function () {
		if (oRule.hasOwnProperty('MustBeExactBracet')) {
			oRule.MustBeBracets = true;
			oRule.Data = true;
		}
	};
	var WhileSearch = function () {
		if (oRule.hasOwnProperty('While')) {
			var searchAtom = oRule.While;

			while (strIndex < str.length) {
				if (searchAtom === str[strIndex]) {
					return true
				} else {
					strIndex++;
				}
			}
		}
	}
	for (var i = 0; i < arrRules.length; i++) {
		oRule = arrRules[i];

		var wil = WhileSearch(); if (wil) {
			continue
		}
		ProceedIsRequired()
		var Rev = ProceedReverse(); if (Rev) {
			continue
		}
		ProceedSave();
		ProceedExactBracets();
		ProceedMustBracets();
		var Data = ProceedData(this); if (!Data) {
			return false
		}
	}

	if (returnData === null) {
		return true;
	} else {
		return returnData;
	}
};
EquationProcessing.prototype.CheckCloseBracet = function (index, startAndExitBracet, isFirstAtomIsStartBracket) {
	var intPatternIndex = 0;
	var arrOfData = this.Parent.arrAtoms;
	var intTempIndex = index !== undefined ? index : this.Parent.intIndexArray;
	var startIndex = intTempIndex;
	var startBracet = false;
	var exitBracet = false;
	var isFirstBracet = false;
	var indexesForIgnor = [];

	if (startAndExitBracet !== undefined) {
		startBracet = startAndExitBracet[0];
		exitBracet = startAndExitBracet[1];
	}
	var isOneVerticalBarIsKnow = false;

	while (intTempIndex < arrOfData.length && !isFirstBracet) {

		if (arrOfData[intTempIndex] === '\\middle') {
			indexesForIgnor.push(intTempIndex)
			if (this.GetAtomByIndex(intTempIndex + 1) === '|') {
				indexesForIgnor.push(intTempIndex + 1)
				intTempIndex++;
				intTempIndex++;
			}
			continue;
		}

		var isStart = (startBracet === true)
			? arrOfData[intTempIndex] === startBracet
			: this.StartBracet[arrOfData[intTempIndex]];

		if (isFirstAtomIsStartBracket === true && intTempIndex === startIndex && !isStart) {
			return false
		}
		if (isStart === true && ((!isOneVerticalBarIsKnow && arrOfData[intTempIndex] === '|') || (isOneVerticalBarIsKnow && arrOfData[intTempIndex] !== '|') || isOneVerticalBarIsKnow === false)) {
			if (!startBracet
				&& (arrOfData[intTempIndex] === '\\left'
					|| arrOfData[intTempIndex] === '\\open'
					|| arrOfData[intTempIndex] === '├')
			) {
				indexesForIgnor.push(intTempIndex, intTempIndex + 1);
				intTempIndex++;
			}
			if (arrOfData[intTempIndex] === '|') {
				isOneVerticalBarIsKnow = true;
			}
			intPatternIndex++;
			intTempIndex++;
			continue;
		} else if (intTempIndex === index) {
			isFirstBracet = true;
		}

		var Close = (exitBracet === true)
			? arrOfData[intTempIndex] === exitBracet
			: this.CloseBracet[arrOfData[intTempIndex]];

		if (Close) {
			if (!exitBracet
				&& (arrOfData[intTempIndex] === '\\right'
					|| arrOfData[intTempIndex] === '\\close'
					|| arrOfData[intTempIndex] === '┤')
				&& (intTempIndex >= 1
					&& arrOfData[intTempIndex - 1] !== '\\left')
			) {
				indexesForIgnor.push(intTempIndex, intTempIndex + 1);
				intTempIndex++;
			}
			intPatternIndex--;
		}

		if (Close && intPatternIndex === 0) {
			indexesForIgnor.push(intTempIndex)
			for (var nCount = 0; nCount < indexesForIgnor.length; nCount++) {
				this.AddIndexToIgnor(indexesForIgnor[nCount]);
			}
			return intTempIndex;
		}
		intTempIndex++;
	}
	return false;
}
EquationProcessing.prototype.GetLastAtomBlockCopy = function (FormArgument) {
	var intLenOfContent = FormArgument.Content.length - 1;
	if (intLenOfContent < 0) {
		intLenOfContent = 0;
	}
	if (FormArgument.Content[intLenOfContent]) {
		var oldContent = FormArgument.Content[intLenOfContent].Copy(false);
	}
	return oldContent;
};
EquationProcessing.prototype.DeleteLastAtomBlock = function (FormArgument) {
	var intLenOfContent = FormArgument.Content.length - 1;
	if (intLenOfContent < 0) {
		return false;
	}
	FormArgument.Remove_FromContent(intLenOfContent, 1);
	FormArgument.CurPos = FormArgument.Content.length;
};
EquationProcessing.prototype.AddNewLine = function (FormArgument) {
	if (FormArgument === undefined) { return }

	if (this.eqArray === undefined) {
		var props = { row: 2, ctrPrp: this.Parent.Pr.ctrPrp };
		var EqArray = new CEqArray(props);
		var oldFrom = FormArgument.Copy(false);

		FormArgument.Remove_FromContent(0, FormArgument.Content.length);
		FormArgument.Correct_Content(true);
		FormArgument.Internal_Content_Add(0, EqArray, false);
		
		for (var i = 0; i < oldFrom.Content.length; i++) {
			EqArray.getElementMathContent(0).Internal_Content_Add(
				i,
				oldFrom.Content[i],
				true
			);
		}
		this.eqArray = EqArray;
		this.StartLexer(EqArray.getElementMathContent(1));
		return EqArray.getElementMathContent(1);
	}
	else {
		console.log(this.eqArray);
	}
};
EquationProcessing.prototype.RemoveEmptyBlock = function (FormArgument) {
	var LengthOfContent = FormArgument.Content.length - 1;
	if (LengthOfContent < 0) {
		return false;
	}
	var LastBlock = FormArgument.Content[LengthOfContent];

	if (LastBlock && LastBlock.GetTextOfElement() === '⬚') {
		FormArgument.Remove_FromContent(LengthOfContent, 1);
		FormArgument.CurPos = FormArgument.Content.length;
	}
};
EquationProcessing.prototype.SkipIngnoredAtoms = function (index, indexOfCloseAtom) {
	if (this.IndexesOfIgnoredAtoms[index] === false) {
		if (index >= indexOfCloseAtom) {
			return
		}
		var strAtom = this.GetNextAtom();

		if (strAtom !== undefined) {
			strAtom = this.SkipIngnoredAtoms(index + 1);
		}
		return strAtom
	}
	else {
		return this.GetNowAtom()
	}
};
EquationProcessing.prototype.WriteIngnoredAtoms = function (FormArgument, index, strAtom) {
	if (this.IndexesOfIgnoredAtoms[index] === true) {
		this.AddSymbol(strAtom, FormArgument);
	}
};
//Rules
EquationProcessing.prototype.GetRuleAndScript = [
	{ Data: ["^", "_"], Save: 'FirstSymbol' },
	{ Data: true },
	{ Reverse: 'FirstSymbol' },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleOrScript = [
	{ Data: ["^", "_"] },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleUnicodePreScript = [
	{ Data: ['(', '{', '['] },
	{ Data: ["^", "_"], Save: 'FirstSymbol' },
	{ Data: true },
	{ Reverse: 'FirstSymbol' },
	{ Data: true },
	{ Data: [')', '}', ']'] },
];
EquationProcessing.prototype.GetRuleOrSDivFraction = [
	{ Data: true },
	{ Data: '/', returnIndex: true },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleOrLDivFraction = [
	{ Data: true },
	{ Data: '∕', returnIndex: true },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleOrNDivFraction = [
	{ Data: true },
	{ Data: '⊘', returnIndex: true },
	{ Data: true },
];
EquationProcessing.prototype.GetInlineLaTeXFraction = [
	{ Data: '^' },
	{ Data: true },
	{ Data: '/' },
	{ Data: '_' },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleUnicodeIsBinom = [
	{ Data: true },
	{ Data: '¦', returnIndex: true },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleBox = [
	{ Data: ['\\box', '□'] },
	{ Data: true },
];
EquationProcessing.prototype.GetRuleRect = [
	{ Data: ['\\rect', '▭'] },
	{ Data: true },
];
EquationProcessing.prototype.GetUnicodeRuleOverUnderBrace = [
	{ Data: arrUnicodeUnderOverBraces},
	{ Data: true},
];
EquationProcessing.prototype.GetLaTeXRuleOverUnderBrace = [
	{ Data: arrLaTeXUnderOverBraces},
	{ Data: true},
];
EquationProcessing.prototype.GetLaTeXRuleMatrix = [
	{ Data: '\\begin'},
	{ Data: '{'},
	{ Data: ['matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix']},
	{ Data: '}'},
	{ While: '\\end'},
	{ Data: '{'},
	{ Data: ['matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix']},
	{ Data: '}'},
];
EquationProcessing.prototype.GetUnicodeRuleMatrix = [
	{ Data: '■'},
	{ Data: true},
];

//Script
EquationProcessing.prototype.AddScript = function (FormArgument, strAtomBase) {
	var arrPreTypeOfScript = this.ScriptBracetSyntaxChecker(this.Parent.intIndexArray - 1);
	var intType = this.GetTypeOfScript(arrPreTypeOfScript);
	var Script;

	if (!strAtomBase) {
		this.RemoveEmptyBlock(FormArgument)
		var PrevAtom = this.GetLastAtomBlockCopy(FormArgument);
		if (PrevAtom) {
			this.DeleteLastAtomBlock(FormArgument);
			Script = this.CreateScript(FormArgument, intType, arrPreTypeOfScript.length);
			Script.getBase().Add_ToContent(0, PrevAtom);
		}

	} else {
		Script = this.CreateScript(FormArgument, intType, arrPreTypeOfScript.length);
		Script.getBase().Add_Text(strAtomBase, this.Parent.ParaMath.Paragraph);
	}

	if (Script) {
		this.FillScriptContent(Script, intType, arrPreTypeOfScript);
	}

};
EquationProcessing.prototype.AddPreScript = function (FormArgument) {
	if (this.isUnicode() && this.GetFutureAtom() === '(') {
		this.GetNextAtom()
	}
	var arrPreTypeOfScript = this.ScriptBracetSyntaxChecker(this.Parent.intIndexArray - 1 < 0 ? 0 : this.Parent.intIndexArray - 1);
	var intType = this.GetTypeOfScript(arrPreTypeOfScript);
	var Script = this.CreateScript(FormArgument, -1, arrPreTypeOfScript.length);

	this.RemoveEmptyBlock(FormArgument)
	this.FillScriptContent(Script, intType, arrPreTypeOfScript);
	this.StartLexer(Script.getBase());

	if (this.isUnicode() && this.GetFutureAtom() === ')') {
		this.GetNextAtom()
	}
};
EquationProcessing.prototype.GetTypeOfScript = function (arrType) {
	if (arrType[0] === '^' && arrType.length === 2) {
		return DEGREE_SUPERSCRIPT;
	}
	else if (arrType[0] === '_' && arrType.length === 2) {
		return DEGREE_SUBSCRIPT;
	}
	else {
		return DEGREE_SubSup;
	}
};
EquationProcessing.prototype.CreateScript = function (FormArgument, type, lengthOfType) {
	var Pr = { type: type };
	var isBothDegreeAndIndex = false;

	if (lengthOfType === 4) {
		isBothDegreeAndIndex = true;
	}

	var Script = FormArgument.Add_Script(isBothDegreeAndIndex, Pr, null, null, null);
	return Script;
};
EquationProcessing.prototype.FillScriptBase = function (Script, isPre, strFAtom) {
	if (isPre === true) {
		if (this.StartBracet[this.GetFutureAtom(0)]) {
			this.AddBracetBlockToIgnor();
			this.StartLexer(Script.getBase());
		}
		else {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 0, true);
			this.StartLexer(Script.getBase(), this.Parent.intIndexArray + 0);
		}
	}
	else {
		if (this.StartBracet[strFAtom]) {
			var exit = this.AddBracetBlockToIgnor();
			this.StartLexer(Script.getBase());
		}
		else {
			Script.getBase().Add_Text(strFAtom, this.Parent.ParaMath.Paragraph);
		}
	}
}
EquationProcessing.prototype.FillScriptContent = function (Script, typeOfScript, PreTypeOfScript, isPre) {
	var intScriptLength = PreTypeOfScript.length;

	if (intScriptLength === 2) {
		if (typeOfScript === DEGREE_SUPERSCRIPT) {
			this.FillScriptContentWriteSup(Script, isPre);
		}
		else if (typeOfScript === DEGREE_SUBSCRIPT) {
			this.FillScriptContentWriteSub(Script, isPre);
		}
	}
	else if (intScriptLength === 4) {
		if (PreTypeOfScript[0] === '_') {
			this.FillScriptContentWriteSub(Script, isPre);
			this.Parent.intIndexArray++;
			this.FillScriptContentWriteSup(Script, isPre);
		} else if (PreTypeOfScript[0] === '^') {
			this.FillScriptContentWriteSup(Script, isPre);
			this.Parent.intIndexArray++;
			this.FillScriptContentWriteSub(Script, isPre);
		}
	}
};
EquationProcessing.prototype.FillScriptContentWriteSup = function (Script, isPre) {
	var Iterator = Script.getUpperIterator();
	this.FillScriptIterator(Iterator, isPre);
};
EquationProcessing.prototype.FillScriptContentWriteSub = function (Script, isPre) {
	var Iterator = Script.getLowerIterator();
	this.FillScriptIterator(Iterator, isPre);
};
EquationProcessing.prototype.FillScriptIterator = function (Iterator, isPre) {
	var n = 1;

	if (this.StartBracet[this.GetFutureAtom(n)]) {
		var intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(Iterator, intExit);
	}
	else {
		this.StartLexer(Iterator, true);
	}
}
EquationProcessing.prototype.CheckAndScript = function (isPre) {
	if (isPre === true) {
		return this.CheckSubAndSup(0); //PreSubOfSup
	}
	else {
		return this.CheckSubAndSup(); //SubOrSup
	}
};
EquationProcessing.prototype.CheckOrScript = function (isPre) {
	if (isPre === true) {
		return this.CheckSubOrSup(0); //PreSubOfSup
	}
	else {
		return this.CheckSubOrSup(); //SubOrSup
	}
};
EquationProcessing.prototype.CheckSubOrSup = function (n) {
	if (n === undefined) {
		n = 1;
	}
	var strTempAtom = this.GetFutureAtom(n);
	if (strTempAtom === "_" || strTempAtom === '^') {
		var index = this.CheckCloseBracet(this.Parent.intIndexArray + n + 1);
		if (index === false) {
			if (this.GetFutureAtom(n + 1)) {
				return true
			}
		}
		return typeof index === 'number';
		// add a_b & i^2
	}
};
EquationProcessing.prototype.CheckSubAndSup = function (n) {
	if (n === undefined) {
		n = 0;
	}
	var symbol;
	var strNow = this.GetFutureAtom(n);
	var strIndex;

	if (strNow === "_" || strNow === '^') {
		if (strNow === "_") {
			symbol = '^';
			strIndex = this.CheckCloseBracet(this.Parent.intIndexArray + n + 1);

		}
		if (strNow === "^") {
			symbol = '_';
			strIndex = this.CheckCloseBracet(this.Parent.intIndexArray + n + 1);
		}

		if (symbol !== undefined) {
			strNow = this.Parent.arrAtoms[strIndex + 1];
			strIndex = this.CheckCloseBracet(strIndex + 2);
		}
		return typeof strIndex === 'number';
	}
};
//Function
EquationProcessing.prototype.AddFunction = function (FormArgument, strAtom) {
	if (this.isLaTeX()) {
		strAtom = strAtom.slice(1);
	}

	var typeOfFunction = this.GetTypeOfFunction[strAtom];
	var Function = this.CreateFunction(FormArgument)

	//sin, cos, tan and etc.
	if (typeOfFunction === 1) {
		var isDegreeOrIndex = this.CheckSubOrSup();
		var isDegreeAndIndex = this.CheckSubAndSup();

		if (isDegreeAndIndex || isDegreeOrIndex) {
			this.Parent.intIndexArray++;
			this.AddScript(Function.getFName(), strAtom);
		} else {
			Function.getFName().Add_Text(strAtom, this.Parent.Paragraph);
		}

		var intClose = this.CheckCloseBracet(this.Parent.intIndexArray + 1);
		var tempAtom = this.GetFutureAtom();

		if (intClose && this.StartBracet[tempAtom]) {
			if (this.isLaTeX() && tempAtom === '{') {
				this.AddBracetBlockToIgnor();
			}
			this.StartLexer(Function.getArgument(), intClose);
		}
		else {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
			this.StartLexer(Function.getArgument(), this.Parent.intIndexArray + 1);
		}
	}

	//lim, min, max, inf and etc.
	else if (typeOfFunction === 2) {
		this.AddLimit(Function.getFName(), strAtom);

		if (this.StartBracet[this.GetFutureAtom()]) {
			this.AddBracetBlockToIgnor();
		}
		this.StartLexer(Function.getArgument());
	}

	//mod
	else if (typeOfFunction === 3) {
		Function.getFName().Add_Text(strAtom, this.Parent.Paragraph);
		if (this.StartBracet[this.GetFutureAtom()]) {
			var exit = this.AddBracetBlockToIgnor();
		}
		if (exit === false) {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
		}
		this.StartLexer(Function.getArgument(), exit);
	}
};
EquationProcessing.prototype.CreateFunction = function (FormArgument) {
	var Function = FormArgument.Add_Function({}, null, null);
	return Function;
};
EquationProcessing.prototype.GetTypeOfFunction = {
	"cos": 1,
	"sin": 1,
	"tan": 1,
	"cot": 1,
	"arcsin": 1,
	"arccos": 1,
	"arctan": 1,
	"arccot": 1,
	"sinh": 1,
	"cosh": 1,
	"tanh": 1,
	"coth": 1,
	"sec": 1,
	"exp": 1,
	"csc": 1,
	"arcsec": 1,
	"arccsc": 1,
	"sech": 1,
	"csch": 1,
	"srcsinh": 1,
	"arctanh": 1,
	"arcsech": 1,
	"arccosh": 1,
	"arccoth": 1,
	"arccsch": 1,

	"mod": 3,

	"lim": 2,
	"inf": 2,
	"sup": 2,
	"max": 2,
	"min": 2
};
//Bracet
EquationProcessing.prototype.AddBracet = function (FormArgument) {
	var BracetBlockData = {};
	var intNowPos = this.Parent.intIndexArray;

	BracetBlockData.intIndexStartBracet = intNowPos;
	BracetBlockData.intIndexCloseBracet = this.CheckCloseBracet(BracetBlockData.intIndexStartBracet);

	//проверить наличие \middle|
	this.GetBracet(BracetBlockData, 0);
	this.GetBracet(BracetBlockData, 1);

	if (BracetBlockData.strStartBracet === '.') {
		BracetBlockData.strStartBracet = -1;
	}
	if (BracetBlockData.strCloseBracet === '.') {
		BracetBlockData.strCloseBracet = -1;
	}

	if (BracetBlockData.strStartBracet === '(') {
		BracetBlockData.strStartBracet = null;
	}
	if (BracetBlockData.strCloseBracet === ')') {
		BracetBlockData.strCloseBracet = null;
	}

	var Bracet = this.CreateBracetBlock(
		FormArgument,
		typeof BracetBlockData.strStartBracet === 'string' ? BracetBlockData.strStartBracet.charCodeAt() : BracetBlockData.strStartBracet,
		typeof BracetBlockData.strCloseBracet === 'string' ? BracetBlockData.strCloseBracet.charCodeAt() : BracetBlockData.strCloseBracet,
		0
	);

	this.FillBracetBlockContent(Bracet, BracetBlockData.intIndexCloseBracet);
};
EquationProcessing.prototype.StartBracet = {
	'(': true,
	'.': true,
	'{': true,
	'[': true,
	'├': true,
	'\\open': true,
	'\\left': true,
	'〖': true,
	'\\{': true,
	'\\langle': true,
	'\\lfloor': true,
	'\\lceil': true,
	'\\ulcorner': true,
	'|': true,
};
EquationProcessing.prototype.CloseBracet = {
	')': true,
	'.': true,
	'}': true,
	']': true,
	'┤': true,
	'\\close': true,
	'\\right': true,
	'〗': true,
	'|': true,
};
EquationProcessing.prototype.GetBracet = function (Obj, type) {
	type = (type === 0)
		? 'StartBracet'
		: 'CloseBracet';

	var strBracet = this.GetAtomByIndex(Obj['intIndex' + type])

	if (strBracet === '├' || strBracet === '┤') {
		Obj['intIndex' + type] = Obj['intIndex' + type] + 1;
		Obj['str' + type] = this.GetAtomByIndex(Obj['intIndex' + type]);
		this.Parent.intIndexArray++;
	}
	else if (strBracet === '\\left' || strBracet === '\\right') {
		Obj['intIndex' + type] = Obj['intIndex' + type] + 1;
		Obj['str' + type] = this.GetAtomByIndex(Obj['intIndex' + type]);
		this.Parent.intIndexArray++;
	}
	else if (strBracet === '\\open' || strBracet === '\\close') {
		Obj['intIndex' + type] = Obj['intIndex' + type] + 1;
		Obj['str' + type] = this.GetAtomByIndex(Obj['intIndex' + type]);
		this.Parent.intIndexArray++;
	}

	else {
		Obj['str' + type] = strBracet;
	}
};
EquationProcessing.prototype.CreateBracetBlock = function (FormArgument, strOpenBracet, strCloseBracet, MiddleCount) {
	var BracetBlock = FormArgument.Add_DelimiterEx(
		new CTextPr(),
		1 + MiddleCount,
		[null],
		strOpenBracet,
		strCloseBracet
	);
	return BracetBlock;
};
EquationProcessing.prototype.FillBracetBlockContent = function (BracetBlock, indexOfExit) {
	this.StartLexer(BracetBlock.getElementMathContent(0), indexOfExit);
};
EquationProcessing.prototype.CreateLitleBox = function (FormArgument) {
	var oBox = new CBox(this.Parent.Pr);
	FormArgument.Add_Element(oBox);
	var BoxMathContent = oBox.getBase();
	BoxMathContent.SetArgSize(-1);
	return BoxMathContent;
};
//Fraction
//if check fraction - index of symbol / adding to ignor list
EquationProcessing.prototype.CheckIsFrac = function () {
	if (this.isLaTeX()) {
		var LaTeXFractionsList = {
			'\\frac': BAR_FRACTION,
			'\\sfrac': SKEWED_FRACTION,
			'\\cfrac': LINEAR_FRACTION,
			'\\nicefrac': FRACTION_IN_BOX,
		};
		var intTypeFrac = LaTeXFractionsList[this.GetNowAtom()];
		typeOfFraction = intTypeFrac;
		return (typeof intTypeFrac === 'number');
	}
	else if (this.isUnicode()) {
		var isSDiv = this.CheckSyntax('GetRuleOrSDivFraction');
		if (typeof isSDiv === 'number') {
			if (this.IndexesOfIgnoredAtoms.hasOwnProperty(isSDiv)) {
				return false;
			}
			typeOfFraction = BAR_FRACTION;
			this.AddIndexToIgnor(isSDiv); return isSDiv
		}

		var isLDiv = this.CheckSyntax('GetRuleOrLDivFraction');
		if (typeof isLDiv === 'number') {
			if (this.IndexesOfIgnoredAtoms.hasOwnProperty(isLDiv)) {
				return false;
			}
			typeOfFraction = SKEWED_FRACTION;
			this.AddIndexToIgnor(isLDiv); return isLDiv
		}

		var isNDiv = this.CheckSyntax('GetRuleOrNDivFraction');
		if (typeof isNDiv === 'number') {
			if (this.IndexesOfIgnoredAtoms.hasOwnProperty(isNDiv)) {
				return false;
			}
			typeOfFraction = LINEAR_FRACTION;
			this.AddIndexToIgnor(isNDiv); return isNDiv
		}
	}
};
EquationProcessing.prototype.AddFraction = function (FormArgument) {
	//	1.	a/b		a∕b		a⊘c
	//		/sdiv	/ldiv	/ndiv
	//	2.	\frac{}{} \sfrac{}{} \cfrac{}{}
	//sdiv standart, ldiv skewed, ndiv inline

	var Fraction = this.CreateFraction(FormArgument);
	this.FillFracContent(Fraction);
	typeOfFraction = null;
};
EquationProcessing.prototype.CreateFraction = function (FormArgument) {
	var Fraction;

	if (typeOfFraction === FRACTION_IN_BOX) {
		this.Parent.Pr.type = 0;
		var Box = this.CreateLitleBox(FormArgument);
		Fraction = Box.Add_Fraction(this.Parent.Pr.type, null, null);
	} else {
		this.Parent.Pr.type = typeOfFraction;
		Fraction = FormArgument.Add_Fraction(this.Parent.Pr, null, null);
	}
	return Fraction;
};
EquationProcessing.prototype.FillFracContent = function (FormArgument) {
	var intExit;
	if (this.isLaTeX()) {
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent(), intExit);
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getDenominatorMathContent(), intExit);
	}
	else if (this.isUnicode()) {
		this.Parent.intIndexArray--;
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent(), intExit || true);
		this.Parent.intIndexArray++;
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getDenominatorMathContent(), intExit || true);
	}
};
//Binom
EquationProcessing.prototype.AddBinom = function (FormArgument) {
	var Delimiter = this.CreateBracetBlock(FormArgument, null, null, 0);
	var BaseMathContent = Delimiter.getElementMathContent(0);
	this.AddFraction(BaseMathContent);
};
EquationProcessing.prototype.CheckIsBinom = function (FormArgument) {
	var intIndexOfBinomSymbol = this.CheckSyntax('GetRuleUnicodeIsBinom');
	if (this.IndexesOfIgnoredAtoms.hasOwnProperty(intIndexOfBinomSymbol)) {
		return false;
	}
	this.AddIndexToIgnor(intIndexOfBinomSymbol); return intIndexOfBinomSymbol
};
//Box
EquationProcessing.prototype.CheckIsBox = function () {
	var isBox = this.CheckSyntax('GetRuleBox');
	return isBox;
};
EquationProcessing.prototype.AddBox = function (FormArgument) {
	var Box = this.CreateBox(FormArgument);
	this.StartLexer(Box);
};
EquationProcessing.prototype.CreateBox = function (FormArgument) {
	this.Parent.Pr.type = 0;
	var Box = this.CreateLitleBox(FormArgument);
	return Box;
};
//Rect
EquationProcessing.prototype.CheckRect = function (strAtom) {
	if (this.isUnicode() && strAtom === '▭' && this.GetFutureAtom()) {
		return true;
	} else if (this.isLaTeX && strAtom === '\\rect' && this.GetFutureAtom()) {
		return true
	}
	return false;
}
EquationProcessing.prototype.AddRect = function (FormArgument) {
	var Box = FormArgument.Add_BorderBox(this.Parent.Pr, null);
	var intExit = this.AddBracetBlockToIgnor();
	this.StartLexer(Box.getBase(), intExit || true);
}
//Limit: Limits (switch must be in options)
EquationProcessing.prototype.AddLimit = function (FormArgument, strAtom) {
	var typeOfBottom;

	if (this.isUnicode()) {
		if (this.GetFutureAtom() === '\\limits') {
			this.GetNextAtom()
		}
		var strTempSymbol = this.Parent.arrAtoms[this.Parent.intIndexArray + 1].charCodeAt();

		// lim_(n→∞) a_n === lim┬(n→∞) a_n
		if (strTempSymbol === 9524 || strTempSymbol === 94) {
			this.Parent.intIndexArray++;
			typeOfBottom = '^';
		} else if (strTempSymbol === 9516 || strTempSymbol === 95) {
			this.Parent.intIndexArray++;
			typeOfBottom = '_';
		}
		typeOfBottom = this.GetTypeOfScript(typeOfBottom);
	}
	else if (this.isLaTeX()) {
		if (this.GetFutureAtom() === '\\limits') {
			this.Parent.intIndexArray++;
		}
		typeOfBottom = this.ScriptBracetSyntaxChecker(this.Parent.intIndexArray);
		if (typeOfBottom.length === 2) {
			typeOfBottom = this.GetTypeOfScript(typeOfBottom);
		}
	}

	if (typeof typeOfBottom === 'number' || typeof typeOfBottom === 'string') {
		var Limit = this.CreateLimit(FormArgument, typeOfBottom);
		this.FillLimitContent(Limit, strAtom);
	}
};
EquationProcessing.prototype.CreateLimit = function (FormArgument, typeOfBottom) {
	var Pr = {};
	Pr.type = this.GetTypeOfIndexLimit[typeOfBottom];

	var Limit = FormArgument.Add_Limit(Pr, null, null);
	return Limit;
};
EquationProcessing.prototype.FillLimitContent = function (Limit, typeOfLimit) {
	Limit.getFName().Add_Text(typeOfLimit, this.Parent.ParaMath.Paragraph, STY_PLAIN);
	var intExit = this.AddBracetBlockToIgnor()
	this.StartLexer(Limit.getIterator(), intExit);
};
EquationProcessing.prototype.GetTypeOfIndexLimit = {
	'DEGREE_SUBSCRIPT': 0,
	'DEGREE_SUPERSCRIPT': 1
};
//Radical
EquationProcessing.prototype.AddRadical = function (FormArgument) {
	var typeOfRadical = this.GetTypeOfRadical();
	var Radical = this.CreateRadical(FormArgument, typeOfRadical);
	this.FillRadicalContent(Radical, typeOfRadical);
};
EquationProcessing.prototype.CreateRadical = function (FormArgument, typeOfRadical) {
	var Pr = {};
	if (typeOfRadical === SQUARE_RADICAL) {
		Pr.degHide = true;
	}
	else if (typeOfRadical === DEGREE_RADICAL) {
		Pr.degHide = false;
	}

	var Radical = FormArgument.Add_Radical(Pr, null, null);
	return Radical
};
EquationProcessing.prototype.GetTypeOfRadical = function () {
	var indexOfExit = this.AddBracetBlockToIgnor();

	if (this.isLaTeX()) {

		if (this.GetFutureAtom() === '[') {
			return DEGREE_RADICAL;
		} else {
			return SQUARE_RADICAL;
		}
	}
	else if (this.isUnicode()) {

		var strSeparator = this.SearchAtom('&', indexOfExit);
		if (strSeparator) {
			return DEGREE_RADICAL;
		}
		return SQUARE_RADICAL;
	}

};
EquationProcessing.prototype.FillRadicalContent = function (Radical) {
	if (this.isLaTeX()) {
		if (this.GetFutureAtom() === '[') {
			var exit = this.AddBracetBlockToIgnor();
			this.StartLexer(Radical.getDegree(), exit);
		}

		if (this.GetFutureAtom() === '{') {
			var intExitIndex = this.AddBracetBlockToIgnor();
			this.StartLexer(Radical.getBase(), intExitIndex);
		}
	}
	else if (this.isUnicode()) {
		var closeBracet = this.AddBracetBlockToIgnor()
		if (closeBracet) {
			this.Parent.intIndexArray++;
			var indexOfDelimetr = this.SearchAtom('&');
		}

		if (typeof indexOfDelimetr === 'number') {
			this.AddIndexToIgnor(indexOfDelimetr)
			this.StartLexer(Radical.getDegree(), indexOfDelimetr);
		}

		this.StartLexer(Radical.getBase(), closeBracet);
	}
};
//Large Operator: Limits (switch must be in options) idotsint!
EquationProcessing.prototype.AddLargeOperator = function (FormArgument, strAtom) {
	var strNameOfLargeOperator;

	if (this.isLaTeX()) {
		strAtom = strAtom.slice(1);
		strNameOfLargeOperator = this.CheckIsLargeOperator[strAtom];
	}
	else if (this.isUnicode()) {
		var code = strAtom.charCodeAt();
		if (this.UnicodeLargeOperator[code]) {
			strNameOfLargeOperator = code;
		}
	}

	var intTypeOFLoc = 1;
	if (this.Parent.arrAtoms[this.Parent.intIndexArray + 1] === "\\limits") {
		this.GetNextAtom();
		//intTypeOFLoc = 0;
	}
	var LargeOperator = this.CreateLargeOperator(FormArgument, intTypeOFLoc, strNameOfLargeOperator);
	this.FillLargeOperatorContent(LargeOperator);
};
EquationProcessing.prototype.CreateLargeOperator = function (FormArgument, intTypeOFLoc, strName) {
	var Pr = {
		ctrPrp: new CTextPr(),
		limLoc: intTypeOFLoc,
		subHide: false,
		supHide: false,
		chr: strName,
	};

	if (this.CheckSyntax('GetRuleAndScript', 1)) {
		Pr.supHide = false;
		Pr.subHide = false;
	}
	else if (this.CheckSyntax('GetRuleOrScript', 1)) {
		if (this.GetFutureAtom() === '^') {
			Pr.subHide = true;
			Pr.supHide = false;
		}
		else {
			Pr.subHide = false;
			Pr.supHide = true;
		}
	}
	else {
		Pr.supHide = true;
		Pr.subHide = true;
	}

	var LargeOperator = FormArgument.Add_NAry(Pr, null, null, null);
	return LargeOperator;
};
//Work only with brackets for argument!
EquationProcessing.prototype.FillLargeOperatorContent = function (LargeOperator) {
	var strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];
	var intExit = undefined;
	if (strTempAtom === "^") {
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(LargeOperator.getSupMathContent(), intExit);
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom == "_") {
			intExit = this.AddBracetBlockToIgnor();
			this.StartLexer(LargeOperator.getSubMathContent(), intExit);
		}
	}
	else if (strTempAtom === "_") {
		intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(LargeOperator.getSubMathContent(), intExit);
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom === "^") {
			intExit = this.AddBracetBlockToIgnor();
			this.StartLexer(LargeOperator.getSupMathContent(), intExit);
		}
	}

	if (this.isUnicode()) {
		if (this.GetFutureAtom() === '▒') {
			this.Parent.intIndexArray++;
		}


		intExit = this.AddBracetBlockToIgnor();
	}

	if (this.isLaTeX() && this.GetFutureAtom() === '{') {
		intExit = this.AddBracetBlockToIgnor()
	}

	this.StartLexer(LargeOperator.getBase(), intExit);
};
EquationProcessing.prototype.CheckIsLargeOperator = {
	"sum": 8721,
	"prod": 8719,
	"coprod": 8720,
	"bigcup": 8899,
	"bigoplus": 10753,
	"bigodot": 10752,
	"biguplus": 10756,
	"bigotimes": 10754,
	"bigsqcup": 10758,
	"bigcap": 8898,
	"bigvee": 8897,
	"bigwedge": 8896,
	"int": 8747,
	"oint": 8755,
	"iint": 8748,
	"oiint": 8751,
	"iiint": 8749,
	"oiiint": 8752,
	'iiiint': 10764,
};
EquationProcessing.prototype.UnicodeLargeOperator = {
	8720: true, //∐
	8755: true, //∳
	8898: true, //⋂
	8899: true, //⋃
	10752: true, //⨀
	10753: true, //⨁
	10754: true, //⨂
	10758: true, //⨆
	10756: true, //⨄
	8897: true, //⋁
	8896: true, //⋀
	8754: true, //∲
	10764: true, //⨌
	8749: true, //∭
	8748: true, //∬
	8747: true, //∫
	8752: true, //∰
	8751: true, //∯
	8750: true, //∮
	8719: true, //∏
	8721: true, //∑
};
//Mod
EquationProcessing.prototype.AddPMod = function (FormArgument) {
	var Delimiter = this.CreateBracetBlock(FormArgument, null, null, 0);
	this.AddFunction(Delimiter.getElementMathContent(0), "\\mod");
};
//Accent
EquationProcessing.prototype.AddAccent = function (FormArgument, name) {
	var Accent;

	if (this.isLaTeX()) {
		var intPosition = null;

		if (this.GetIsAddBar[name]) {
			if (name === "\\overline") {
				intPosition = 0;
			}
			else if (name === "\\underline") {
				intPosition = 1;
			}

			Accent = FormArgument.Add_Bar({ ctrPrp: this.Pr.ctrPrp, pos: intPosition }, null);
		}

		else if (this.GetIsAddGroupChar[name]) {
			if (name === "\\overbrace") {
				Accent = FormArgument.Add_GroupCharacter(
					{
						ctrPrp: this.Parent.Pr.ctrPrp,
						chr: 9182,
						pos: VJUST_TOP,
						vertJc: VJUST_BOT,
					},
					null
				);
			}

			if (name === "\\underbrace") {
				Accent = FormArgument.Add_GroupCharacter(
					this.Parent.Pr,
					null
				);
			}
		}

		else {
			Accent = FormArgument.Add_Accent(
				this.Parent.Pr.ctrPrp,
				this.GetAccent[name],
				null
			);
		}
	}

	else if (this.isUnicode()) {
		Accent = FormArgument.Add_Accent(
			this.Parent.Pr.ctrPrp,
			this.accent,
			null
		);
		this.accent = undefined;
	}

	if (this.StartBracet[this.GetFutureAtom()]) {
		var exit = this.AddBracetBlockToIgnor();
	}
	if (exit === false) {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
		exit = this.Parent.intIndexArray + 1;
	}
	this.StartLexer(Accent.getBase(), exit)

	if (this.isUnicode()) {
		this.Parent.intIndexArray++;
	}
};
//Matrix
EquationProcessing.prototype.AddMatrix = function (FormArgument) {
	var arrTempMatrixData;
	var Matrix;
	var arrExitData;
	var intRowsCount;
	var intColsCount;

	var strTempType = this.GetNowAtom()
	var type = strTempType.slice(1, strTempType.length)
	this.GetNextAtom(); // skip (
	arrTempMatrixData = this.CreateMatrix(FormArgument, type);

	Matrix = arrTempMatrixData[0];
	arrExitData = arrTempMatrixData[1];
	intRowsCount = arrTempMatrixData[2];
	intColsCount = arrTempMatrixData[3];

	this.FillMatrixContent(
		Matrix,
		arrExitData,
		intRowsCount,
		intColsCount
	);
};
EquationProcessing.prototype.CreateMatrix = function (FormArgument, typeOfMatrix) {
	var Bracets = [];

	if (this.isLaTeX()) {
		if (this.GetFutureAtom() === '{') {
			do {
				var strAtom = this.GetNextAtom();
			} while (strAtom != '}');
		}

		if (typeOfMatrix === "pmatrix") {
			Bracets.push(null, null)
		}
		else if (typeOfMatrix === "bmatrix") {
			Bracets.push("[".charCodeAt(), "]".charCodeAt())
		}
		else if (typeOfMatrix === "Bmatrix") {
			Bracets.push("{".charCodeAt(), "}".charCodeAt())
		}
		else if (typeOfMatrix === "vmatrix") {
			Bracets.push("|".charCodeAt(), "|".charCodeAt())
		}
		else if (typeOfMatrix === "Vmatrix") {
			Bracets.push("‖".charCodeAt(), "‖".charCodeAt())
		}
	}

	var intColsCount = 1;
	var intRowsCount = 1;
	var strTempArr;
	var intIndex = this.Parent.intIndexArray + 1;

	var arrBufferExit = [];
	var intIndexExit = this.CheckCloseBracet(intIndex - 1);

	do {
		strTempArr = this.GetAtomByIndex(intIndex);
		if (strTempArr === "&") {
			arrBufferExit.push(intIndex);
		}
		if (strTempArr === "&" && intRowsCount === 1) {
			intColsCount++;
		}
		if (strTempArr === "\\" || strTempArr === '@') {
			intRowsCount++;
			arrBufferExit.push(intIndex);
		}
		intIndex++;
	} while (intIndexExit !== intIndex && strTempArr !== "\\end");
	arrBufferExit.push(intIndex + 1);

	for (var nCount = 0; nCount < arrBufferExit.length; nCount++) {
		this.AddIndexToIgnor(arrBufferExit[nCount]);
	}

	var Matrix;
	if (typeOfMatrix !== 'matrix' && typeOfMatrix !== 'array') {
		Matrix = FormArgument.Add_MatrixWithBrackets(
			Bracets[0],
			Bracets[1],
			this.Parent.Pr.ctrPrp,
			intRowsCount,
			intColsCount,
			false,
			[]
		);
	}
	else {
		Matrix = FormArgument.Add_Matrix(
			this.Parent.Pr.ctrPrp,
			intRowsCount,
			intColsCount,
			false,
			[]
		);
	}

	return [Matrix, arrBufferExit, intRowsCount, intColsCount];
};
EquationProcessing.prototype.FillMatrixContent = function (Matrix, arrExitData, intRowsCount, intColsCount) {
	var intIndexOfExitBuffer = 0;

	for (var RowIndex = 0; RowIndex < intRowsCount; RowIndex++) {
		for (var ColIndex = 0; ColIndex < intColsCount; ColIndex++) {
			var MathContent = Matrix.getContentElement(RowIndex, ColIndex);
			this.StartLexer(MathContent, arrExitData[intIndexOfExitBuffer]);
			intIndexOfExitBuffer++;
		}
	}
};
EquationProcessing.prototype.CheckIsMatrix = function (str) {
	var arrMatrixLaTeX = ['\\matrix','\\bmatrix','\\pmatrix', '\\Bmatrix', '\\vmatrix', '\\Vmatrix']
	if (this.isLaTeX() && arrMatrixLaTeX.includes(str)) {
		return true
	}
	else if (this.isUnicode() && str && str.codePointAt() === 9632) {
		return true;
	}
	return false
};
EquationProcessing.prototype.ArrMatrixTypes = [
	'matrix',
	'pmatrix',
	'bmatrix',
	'Bmatrix',
	'vmatrix',
	'Vmatrix',
];
EquationProcessing.prototype.GetIsAddBar = {
	"\\overline": true,
	"\\underline": true,
};
EquationProcessing.prototype.GetIsAddGroupChar = {
	"\\overbrace": true,
	"\\underbrace": true,
};
EquationProcessing.prototype.GetAccent = {
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
	"\\tilde": 771,
	//771 : "\\widetilde",
	//770 : "\\widehat",
	//8407: "\\overrightarrow",
	8406: "\\overleftarrow",
	775: "\\dot",
	776: "\\ddot",
	770: "\\hat",
	780: "\\check",
	769: "\\acute",
	768: "\\grave",
	773: "\\bar",
	8407: "\\vec",
	774: "\\breve",
	771: "\\tilde",
};
EquationProcessing.prototype.CheckIsAccent = function (strAtom) {
	if (this.isLaTeX()) {
		return (
			this.GetAccent[strAtom] ||
			this.GetIsAddBar[strAtom] ||
			this.GetIsAddGroupChar[strAtom]
		);
	}
	else if (this.isUnicode()) {
		if (this.StartBracet[this.GetNowAtom()]) {
			var intCloseExitBracet = this.CheckCloseBracet(this.Parent.intIndexArray);
			if (typeof intCloseExitBracet === 'number') {
				var strTempTtom = this.GetAtomByIndex(intCloseExitBracet + 1);
				if (strTempTtom) {
					var accent = this.GetAccent[strTempTtom.charCodeAt()];
				}

				if (accent) {
					this.accent = this.GetAtomByIndex(intCloseExitBracet + 1).charCodeAt();
					return true;
				}
			}
		}
		return false;
	}
};
//Text and symbols, mod
EquationProcessing.prototype.AddSymbol = function (strAtom, FormArgument, type, typeText) {
	if (undefined === strAtom) {
		return
	}

	if (strAtom !== ' ') {
		strAtom.trim()
	}

	if (type) {
		this.Pr = this.Parent.Pr;
		this.Pr['scr'] = type;
		FormArgument.Add_Symbol(strAtom.charCodeAt(0), typeText, this.Pr);
	} else {

		if (strAtom === '\\bmod') {
			FormArgument.Add_Text('mod', this.Parent.ParaMath.Paragraph);
		}

		var secondLetterofAtom = strAtom.length > 1 ? strAtom[1].toUpperCase() : ''; // after "//"
		var intNumberOfLetter = secondLetterofAtom.codePointAt(0);
		if (strAtom[0] === '\\' && intNumberOfLetter >= 65 && intNumberOfLetter <= 90) {
			var strCode = SymbolsForCorrect[secondLetterofAtom][strAtom];
			if (strCode) {
				FormArgument.Add_Symbol(strCode, this.Pr);
			}
		}
		else if (strAtom.length > 1) {
			FormArgument.Add_Text(strAtom, this.Parent.ParaMath.Paragraph);
		}
		else {
			FormArgument.Add_Symbol(strAtom.charCodeAt(0), this.Pr);
		}
	}
};
EquationProcessing.prototype.CheckIsText = function (strAtom) {
	if (GetBracetCode[strAtom]) {
		return false;
	}

	else if (
		strAtom === "matrix" &&
		strAtom === "\\left" &&
		strAtom === "\\right" &&
		strAtom !== undefined &&
		strAtom !== '(' &&
		strAtom !== ')'
	) {
		return false
	}

	return true
};
EquationProcessing.prototype.AddMathText = function (FormArgument, strAtom) {
	var type = this.CheckMathText[strAtom];
	var objSty = this.CheckMathTextSty[strAtom];
	strAtom = this.GetNextAtom();

	if (strAtom === '{') {
		do {
			if (strAtom != '{' && strAtom != '}') {
				if (strAtom.length === 1) {
					this.AddSymbol(strAtom, FormArgument, type, objSty);
				}
				else if (strAtom.length > 1) {
					for (var i = 0; i < strAtom.length; i++) {
						this.AddSymbol(strAtom[i], FormArgument, type, objSty);
					}
				}
			}
			strAtom = this.GetNextAtom();
		} while (strAtom != '}');
	} else {
		if (strAtom.length > 1) {
			this.Parent.arrAtoms.splice(this.Parent.intIndexArray, 1, strAtom[0], strAtom.slice(1))
			strAtom = this.GetNowAtom();
			this.AddSymbol(strAtom[0], FormArgument, type, objSty);
		} else {
			this.AddSymbol(strAtom, FormArgument, type, objSty);
		}
	}
};
EquationProcessing.prototype.CheckMathText = {
	'\\mathcal': 1, '\\script': 1,
	'\\mathfrak': 2, '\\fraktur': 2,
	'\\mathbb': 3, '\\duble': 3,
	//these fonts are not supported by word as "\fraktrurA" syntaxes
	//'\\mathsf': 4,
	//'\\mathtt': 5,
	//'\\mathnormal': 0, defualt math fonts and not suported by word
	//'\\mathbf': 0,
	'\\mathrm': 0,
};
EquationProcessing.prototype.CheckMathTextSty = {
	// '\\mathnormal': {Italic: true, Bold: false},
	// '\\mathbf': {Italic: false, Bold: true},
	// '\\mathsf': {Italic: false, Bold: false},
	// '\\mathtt': {Italic: false, Bold: false},
	'\\mathfrak': { Italic: false, Bold: false },
	'\\fraktur': { Italic: false, Bold: false },
	'\\mathrm': { Italic: false }
};
//Mod
EquationProcessing.prototype.AddPMod = function (FormArgument) {
	var Delimiter = this.CreateBracetBlock(FormArgument, null, null, 0);
	this.AddFunction(Delimiter.getElementMathContent(0), "\\mod");
};
EquationProcessing.prototype.ConvertToAtom = function () {
	for (var intCount = 0; intCount < this.Parent.arrAtoms.length; intCount++) {
		var Atom = this.Parent.arrAtoms[intCount]
		if (Atom[0] === '\\') {
			var secondLetterofAtom = Atom.length > 1 ? Atom[1].toUpperCase() : '';
			var intNumberOfLetter = secondLetterofAtom.codePointAt(0);
			if (intNumberOfLetter >= 65 && intNumberOfLetter <= 90) {
				var oLetterWords = SymbolsForCorrect[secondLetterofAtom];
				if (undefined !== oLetterWords && oLetterWords.hasOwnProperty(Atom)) {
					var strCode = oLetterWords[Atom]
					if (strCode) {
						this.Parent.arrAtoms[intCount] = String.fromCharCode(strCode)
					}
				}
			}
		}
	}
};
//OverUnderBrace
EquationProcessing.prototype.AddUnderOverBrace = function (FormArgument, strAtom) {
	var Brace;
	
	switch (strAtom) {
		case "⏞":
		case "\\underbrace":	Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9182, pos : VJUST_TOP, vertJc : VJUST_BOT}, null ); break;

		case "⏟":
		case "\\overbrace":		Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp}, null ); break;
		
		case "⏜":
		case "\\underparen":	Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9181, pos : VJUST_BOT, vertJc : VJUST_TOP}, null ); break;
		
		//not stretch
		case "⎴":
		case "\\overbracket":	Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9140, pos : VJUST_BOT, vertJc : VJUST_TOP}, null ); break;
		case "⎵":
		case "\\underbracket":	Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9141, pos : VJUST_BOT, vertJc : VJUST_TOP}, null ); break;
		
		case "⏝":
		case "\\overparen":		Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9180, pos : VJUST_TOP, vertJc : VJUST_BOT}, null ); break;
		
		case "\\underbar":		Brace = FormArgument.Add_Bar({ctrPrp : this.Parent.Pr.ctrPrp, pos : LOCATION_BOT}, null); break;
		case "\\overline":
		case "\\overbar":		Brace = FormArgument.Add_Bar({ctrPrp : this.Parent.Pr.ctrPrp, pos : LOCATION_TOP}, null); break;
		
		case "⏠":
		case "\\overshell":		Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9184, pos : VJUST_TOP, vertJc : VJUST_BOT}, null ); break;
		
		case "⏡":
		case "\\undershell":	Brace = FormArgument.Add_GroupCharacter({ctrPrp : this.Parent.Pr.ctrPrp, chr : 9185, pos : VJUST_BOT, vertJc : VJUST_TOP}, null ); break;
		default: break;
	}

	if (Brace) {
		var intExit = this.AddBracetBlockToIgnor();
		this.StartLexer(Brace.getBase(), intExit || true);
	}
}

//========================================================================//
//==========================LaTeX_Lexer===================================//
//========================================================================//
function CLaTeXParser(str, props) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = { ctrPrp: new CTextPr() };
	this.ParaMath = props;
	this.isError = false;
	this.isInMatrix = false;
	this.Processing;
}
CLaTeXParser.prototype.Start = function () {
	this.Processing = new EquationProcessing(this);
	this.Processing.Parse();

	var t0 = performance.now();
	CLaTeXLexer(this, this.ParaMath.Root);
	var t1 = performance.now();
	//console.log("Lexer work " + (t1 - t0) + " milliseconds.");

	EquationProcessing.prototype.RemoveEmptyBlock(this.ParaMath.Root);
	this.ParaMath.Root.Correct_Content(true);
	//this.ParaMath.Paragraph.LogicDocument.UpdateSelection();
};
function CLaTeXLexer(Parser, FormArgument, indexOfCloseAtom) {
	var eProc = Parser.Processing;
	var strAtom;
	var intCounter = 0;
	do {
		strAtom = eProc.GetNextAtom();
		var isWrite = !(eProc.IndexesOfIgnoredAtoms[Parser.intIndexArray] === false);
		var isExit = indexOfCloseAtom === Parser.intIndexArray;

		if (isWrite && strAtom !== undefined) {
			if (eProc.GetTypeOfFunction[strAtom.slice(1)] != null) {
				eProc.AddFunction(FormArgument, strAtom);
				intCounter++;
			}
			else if (eProc.CheckIsFrac() && !Parser.isError) {
				eProc.AddFraction(FormArgument, strAtom);
				intCounter++;
			}
			else if (strAtom == "\\sqrt" && !Parser.isError) {
				eProc.AddRadical(FormArgument);
				intCounter++;
			}
			else if (eProc.CheckIsMatrix(strAtom)) {
				eProc.AddMatrix(FormArgument);
				intCounter++;
			}
			else if (strAtom == "\\pmod" && !Parser.isError) {
				eProc.AddPMod(FormArgument);
			}
			else if (eProc.CheckSyntax('GetRuleBox')) {
				eProc.AddBox(FormArgument);
			}
			else if (eProc.CheckIsLargeOperator[strAtom.slice(1)] && !Parser.isError) {
				eProc.AddLargeOperator(FormArgument, strAtom);
				intCounter++;
			}
			else if (eProc.CheckSyntax('GetRuleOrScript') || eProc.CheckSyntax('GetRuleAndScript') && !Parser.isError) {
				var intIndex = eProc.Parent.intIndexArray - 1;
				var strPrevAtom = eProc.GetAtomByIndex(eProc.Parent.intIndexArray - 1);
				if (intIndex < 0 || strPrevAtom === false || strPrevAtom === ' ' || strPrevAtom === '') {
					eProc.AddPreScript(FormArgument)
				} else {
					eProc.AddScript(FormArgument);
				}
				intCounter++;
			}
			else if (eProc.StartBracet[strAtom] && eProc.CheckCloseBracet(eProc.Parent.intIndexArray) && !Parser.isError) {
				eProc.AddBracet(FormArgument);
				intCounter++;
			}
			else if (strAtom == "\\binom") {
				eProc.AddBinom(FormArgument);
				intCounter++;
			}
			else if (eProc.CheckSyntax('GetLaTeXRuleOverUnderBrace')) {
				eProc.AddUnderOverBrace(FormArgument, strAtom);
				intCounter++;
			}
			else if (strAtom === '\\\\') {
				FormArgument = eProc.AddNewLine(FormArgument);
				intCounter++;
				FormArgument.Correct_Content(true)
			}
			else if (eProc.CheckSyntax('GetRuleRect')) {
				eProc.AddRect(FormArgument)
				intCounter++;
			}
			else if (eProc.CheckIsAccent(strAtom) && !Parser.isError) {
				eProc.AddAccent(FormArgument, strAtom);
				intCounter++;
			}
			else if (typeof eProc.CheckMathText[strAtom] == 'number' && !Parser.isError) {
				eProc.AddMathText(FormArgument, strAtom);
				intCounter++;
			}
			else if (!Parser.isError && strAtom !== undefined) {
				eProc.AddSymbol(strAtom, FormArgument);
				intCounter++;
			}
		}

		if (isExit) {
			return
		}
	} while (indexOfCloseAtom !== Parser.intIndexArray && eProc.GetFutureAtom() !== undefined && strAtom !== undefined && !Parser.isError && !(indexOfCloseAtom === true && intCounter === 1));
}

//========================================================================//
//==========================Unicode_Lexer=================================//
//========================================================================//
function CUnicodeParser(str, props) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = { ctrPrp: new CTextPr() };
	this.ParaMath = props;
	this.Processing;
}
CUnicodeParser.prototype.Start = function () {
	this.Processing = new EquationProcessing(this);
	this.Processing.Parse();
	this.Processing.ConvertToAtom()

	var t0 = performance.now();
	this.ParaMath.Root.Content = []
	CUnicodeLexer(this, this.ParaMath.Root);
	var t1 = performance.now();
	//console.log("Unicode work " + (t1 - t0) + " milliseconds.");

	EquationProcessing.prototype.RemoveEmptyBlock(this.ParaMath.Root);
	this.ParaMath.Root.Correct_Content(true);
};
function CUnicodeLexer(Parser, FormArgument, indexOfCloseAtom) {
	var eProc = Parser.Processing;
	var strAtom;
	var intCounter = 0;
	do {
		strAtom = eProc.GetNextAtom();
		var isWrite = !(eProc.IndexesOfIgnoredAtoms[Parser.intIndexArray] === false);
		var isExit = indexOfCloseAtom === Parser.intIndexArray;

		if (isWrite && strAtom !== undefined) {
			if (eProc.CheckIsFrac()) {
				eProc.AddFraction(FormArgument, strAtom);
				intCounter++;
			}
			else if (eProc.GetTypeOfFunction[strAtom] != null) {
				eProc.AddFunction(FormArgument, strAtom);
				intCounter++;
			}
			else if (eProc.UnicodeLargeOperator[strAtom.charCodeAt()]) {
				eProc.AddLargeOperator(FormArgument, strAtom);
				intCounter++;
			}
			else if (eProc.CheckSyntax('GetRuleOrScript') || eProc.CheckSyntax('GetRuleAndScript') || eProc.CheckSyntax('GetRuleUnicodePreScript') && !Parser.isError) {
				var intIndex = eProc.Parent.intIndexArray - 1;
				var strPrevAtom = eProc.GetAtomByIndex(eProc.Parent.intIndexArray - 1);
				if (intIndex < 0 || strPrevAtom === false || strPrevAtom === ' ' || strPrevAtom === '') {
					eProc.AddPreScript(FormArgument)
				} else {
					eProc.AddScript(FormArgument);
				}
				intCounter++;
			}
			else if (eProc.CheckIsMatrix(strAtom)) {
				eProc.AddMatrix(FormArgument);
				intCounter++;
			}
			else if (strAtom === "\\pmod" && !Parser.isError) {
				eProc.AddPMod(FormArgument);
				intCounter++;
			}
			else if (strAtom.charCodeAt() === 8730) {
				eProc.AddRadical(FormArgument);
				intCounter++;
			}
			else if (eProc.CheckIsBinom()) {
				eProc.AddBinom(FormArgument);
				intCounter++;
			}
			else if (eProc.CheckIsAccent(strAtom)) {
				eProc.AddAccent(FormArgument);
				intCounter++;
			}
			else if (eProc.CheckSyntax('GetRuleBox')) {
				eProc.AddBox(FormArgument);
			}
			else if (eProc.CheckSyntax('GetRuleRect')) {
				eProc.AddRect(FormArgument)
				intCounter++;
			}
			else if (eProc.CheckSyntax('GetUnicodeRuleOverUnderBrace')) {
				eProc.AddUnderOverBrace(FormArgument);
				intCounter++;
			}
			else if (eProc.StartBracet[strAtom] && eProc.CheckCloseBracet(eProc.Parent.intIndexArray)) {
				eProc.AddBracet(FormArgument);
				intCounter++;
			}
			else if (typeof eProc.CheckMathText[strAtom] == 'number') {
				eProc.AddMathText(FormArgument, strAtom);
				intCounter++;
			}
			else {
				eProc.AddSymbol(strAtom, FormArgument);
				intCounter++;
			}
		}

		if (isExit) {
			return
		}
	} while (indexOfCloseAtom !== Parser.intIndexArray && eProc.GetFutureAtom() !== undefined && strAtom !== undefined && !Parser.isError && !(indexOfCloseAtom === true && intCounter === 1));
}

//--------------------------------------------------------export----------------------------------------------------
window["AscCommonWord"] = window["AscCommonWord"] || {};
window["AscCommonWord"].CLaTeXParser = CLaTeXParser;
window["AscCommonWord"].CLaTeXLexer = CLaTeXLexer;
window["AscCommonWord"].CUnicodeParser = CUnicodeParser;
