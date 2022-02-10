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

//Limits
//all latex words aka \forall
//bmod
//	|^(2)
//binom

var LaTeX = 0;
var Unicode = 1;

//TODO: P\left(A=2\middle|\frac{A^2}{B}>4\right)
//TODO: Add pre-script with degree OR index for unicode and LaTeX: _x{1+2}...
//TODO: impliment in LaTeX \underbrace and \overbrace -> \underbrace{1+3}_{i}  \underbrace{1+3}^{i}
//		\overparen \underparen \overbrace \underbrace \overshell \undershell \overbracket \underbracket
//change process of making degree and indexies?
//TODO: impliment \boxed{} or \rect

var MathOperators = [
	'+', '=', '*', '-',
	'!', '@', '#', '$',
	'%', '?', '&',
	'^', '_', '/',
	' ', '.', ',', ' '
];
var Bracets = [
	'(',	')',
	'[',	']',
	'{',	'}',
	'|',
];
var isLaTeXAtom = [
	'cos',		'sin',		'tan',		'sec',		'cot',		'csc',
	'arcsin',	'arccos',	'arctan',	'arcsec',
	'arccos',	'arccot',	'arccsc',
	'sinh',		'cosh',		'tanh',		'coth',		'sech',		'csch',
	'srcsinh',	'arctanh',	'arcsech',	'arccosh',	'arccoth',	'arccsch',
	'log',		'lin',		'ln',		'max',		'min',		'exp',
	'matrix',
	'sqrt',
	'left',		'right',	'middle',	'frac',

	'to'
];
var GreekLetters = {
	"Alpha": 0x0391,	"alpha": 0x03b1,
	"Beta": 0x0392,		"beta": 0x03b2,
	"Gamma": 0x0393,	"gamma": 0x03b3,
	"Delta": 0x0394,	"delta": 0x03b4,
	"Epsilon": 0x0395,	"epsilon": 0x03f5,	"varepsilon": 0x03b5,
	"Zeta": 0x0396,		"zeta": 0x03b6,
	"Eta": 0x0397,		"eta": 0x3b7,
	"Theta": 0x0398,	"theta": 0x03b8,	"vartheta": 0x03d1,
	"Iota": 0x0399,		"iota": 0x03b9,
	"Kappa": 0x039a,	"kappa": 0x03ba,	"varkappa": 0x03f0,
	"Lambda": 0x039b,	"lambda": 0x03bb,
	"Mu": 0x039c,		"mu": 0x03bc,
	"Nu": 0x039d,		"nu": 0x03bd,
	"Xi": 0x039e,		"xi": 0x03be,
	"Omicron": 0x039f,	"omicron": 0x03bf,
	"Pi": 0x03a0,		"pi": 0x03c0,		"varpi": 0x03d6,
	"Rho": 0x03a1,		"rho": 0x03c1,		"varrho": 0x03f1,
	"Sigma": 0x03a3,	"sigma": 0x03c2,	"varsigma": 0x03f2,
	"Tau ": 0x03a4,		"tau": 0x03c4,
	"Upsilon": 0x03a5,	"upsilon": 0x03c5,
	"Phi": 0x03a6,		"phi": 0x03c6,		"varphi": 0x03d5,	"varPhi": 0x03d5,
	"Chi": 0x03a7,		"chi": 0x03c7,
	"Psi": 0x03a8,		"psi": 0x03c8,
	"Omega": 0x03a9,	"omega": 0x03c9,
	"Digamma": 0x03dc,	"digamma": 0x03dd,
};
var UnicodeSymbols = [
	'┴', '┬', '▒', '√', "┤", "├", "〖", "〗", '█', '¦',
	'│', '“', '×', '·', '•', '', '∫', '∑', '∏', '▭',
	'','√', '▁', '⊘', '⁄', '\\', '\/'
];

function EquationProcessing(Parent) {
	this.Parent = Parent;
	this.IndexesOfIgnoredAtoms = {};
	this.type = this.CheckTypeOfParent();
}
EquationProcessing.prototype.isLaTeX = function() {
	return this.type === LaTeX;
};
EquationProcessing.prototype.isUnicode = function() {
	return this.type === Unicode;
};
EquationProcessing.prototype.CheckTypeOfParent = function() {
	if (this.Parent instanceof CLaTeXParser) {
		return LaTeX;
	}
	else if (this.Parent instanceof CUnicodeParser) {
		return Unicode;
	}
};
EquationProcessing.prototype.Parse = function() {
	var strTempWord = "";
	var str = this.Parent.str;
	var arrAtoms = [];
	var isInMatrix = false;
	var arrCheckParser = [];
	
	arrCheckParser = arrCheckParser.concat(MathOperators, Bracets)
	if (this.isLaTeX()) {
		arrCheckParser = arrCheckParser.concat(isLaTeXAtom);
	}
	else if (this.isUnicode()) {
		arrCheckParser = arrCheckParser.concat(UnicodeSymbols);
	}

	for (var i = 0; i <= str.length; i++) {
		if (str[i] !== undefined && str[i].charCodeAt() !== 65533) {
			strTempWord += str[i];

			var tempStrForLaTeX;

			if (strTempWord === '\u2061') {
				strTempWord = '';
				continue
			}

			if (!isNaN(strTempWord) && !isNaN(str[i+1]) ) {
				continue
			}

			if (strTempWord[0] === '\\' && strTempWord.length > 1) {
				tempStrForLaTeX = strTempWord;
				tempStrForLaTeX = tempStrForLaTeX.slice(1)
			}

			if (arrCheckParser.includes(strTempWord) || arrCheckParser.includes(tempStrForLaTeX) || arrCheckParser.includes(str[i+1])) {
				arrAtoms.push(strTempWord.trim());
				strTempWord = "";
				tempStrForLaTeX = "";
			}
		}
	}

	strTempWord.trim();
	arrAtoms.push(strTempWord);

	this.Parent.arrAtoms = arrAtoms.filter(Boolean);
	console.log(this.Parent.arrAtoms, this.type === LaTeX ? 'Latex' : 'Unicode');
};
EquationProcessing.prototype.GetNextAtom = function() {
	this.Parent.intIndexArray++;
	return this.GetNowAtom();
};
EquationProcessing.prototype.GetNowAtom = function() {
	return this.Parent.arrAtoms[this.Parent.intIndexArray];
};
EquationProcessing.prototype.GetAtomByIndex = function(n) {
	return this.Parent.arrAtoms[n];
};
EquationProcessing.prototype.GetFutureAtom = function(n) {
	if (n === undefined) {
		n = 1;
	}
	return this.Parent.arrAtoms[this.Parent.intIndexArray + n];
};
EquationProcessing.prototype.BracetSyntaxChecker = function(index) {
	var Obj = {
		Script : [],
		index : index + 1,
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
		if (Obj.symbol!==false && Obj.symbol!== undefined && Obj.Script[0] === '^' ? (Obj.symbol === '_') : (Obj.symbol === '^')) {
			Obj.Script.push(Obj.symbol);
			//скобка или элемент
			Obj.symbol = this.GetFutureAtom(Obj.index + 1);
			Obj.Script.push(Obj.symbol === '(' || Obj.symbol === '{' ? '(' : '1');
		}
	}
	return Obj.Script;
};
EquationProcessing.prototype.CheckAfterBracet = function(Obj) {
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
EquationProcessing.prototype.SearchAtom = function(str, maxIndex) {
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
EquationProcessing.prototype.AddIndexToIgnor = function(intIndex, isWriteOnSee) {
	if (isWriteOnSee === undefined) {
		isWriteOnSee = false;
	}
	if (!this.IndexesOfIgnoredAtoms[intIndex]) {
		this.IndexesOfIgnoredAtoms[intIndex] = isWriteOnSee;
	}
};
EquationProcessing.prototype.AddBracetBlockToIgnor = function(n, isWriteOnSee) {
	var intIndex;
	if (n === undefined) {
		intIndex = 1
	} else {
		intIndex = n;
	}
	this.AddIndexToIgnor(this.Parent.intIndexArray + intIndex, isWriteOnSee);

	var strTempAtom = this.GetFutureAtom(intIndex);
	if(strTempAtom === '_' || strTempAtom === '^') {
		intIndex++;
		this.AddIndexToIgnor(this.Parent.intIndexArray + intIndex, isWriteOnSee);
	}
	var intExitIndex = this.CheckCloseBracet(this.Parent.intIndexArray + intIndex);
	if (intExitIndex !== false) {
		this.AddIndexToIgnor(intExitIndex, isWriteOnSee)
		return intExitIndex;
	}
};
EquationProcessing.prototype.StartLexer = function(context, indexOfExit) {
	var strAtom = this.GetFutureAtom();

	if (strAtom === '^' || strAtom === '_') {
		strAtom = this.GetNextAtom();
	}

	if (indexOfExit === undefined ) {
		indexOfExit = this.CheckCloseBracet();
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
			CLaTeXLexer(this.Parent, context);
		}
		else if (this.isUnicode()) {
			CUnicodeLexer(this.Parent, context);
		}

	}
};
EquationProcessing.prototype.CheckSyntax = function(arrRules) {
	arrRules = this[arrRules]
	// By default block - requared and dont skips: oRule.isRequired = false - do it
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
	var strIndex = this.Parent.intIndexArray;

	var arrVariables = {};
	var requared = true;

	var ProceedIsRequired = function () {
		if (!oRule.hasOwnProperty('isRequired')) {
			oRule.isRequired = true;
			requared = true;
		} else {
			requared = false;
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
					strIndex += varIndexOfCloseBracet;
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
			//значит символ может быть одним из содерж. в этом массиве.
			else if (Array.isArray(oRule.Data)) {
				if (oRule.Data.includes(str[strIndex])) {
					if (oRule.hasOwnProperty('Save')) {
						arrVariables[oRule.Save]['whatFind'] = str[strIndex];
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

	for (var i = 0; i < arrRules.length; i++) {
		oRule = arrRules[i];

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
	return true;
};
EquationProcessing.prototype.CheckCloseBracet = function(index, startAndExitBracet) {
	var intPatternIndex = 0;
	var arrOfData = this.Parent.arrAtoms;
	var intTempIndex = index !== undefined ? index : this.Parent.intIndexArray;

	var startBracet = false;
	var exitBracet = false;

	if (startAndExitBracet !== undefined) {
		startBracet = startAndExitBracet[0];
		exitBracet = startAndExitBracet[1];
	}

	var isFirstBracet = false;
	var isSpecialBracet = false;
	while (intTempIndex < arrOfData.length && !isFirstBracet) {

		if (arrOfData[intTempIndex] === '|' && intTempIndex === index && startBracet === '|') {
			isSpecialBracet = true;
			intTempIndex++;
		}
		else if (isSpecialBracet && arrOfData[intTempIndex] === '|') {
			return intTempIndex;
		}
		else {
			var Start = startBracet
				? arrOfData[intTempIndex] === startBracet
				: this.StartBracet[arrOfData[intTempIndex]];

			if (Start) {
				if (!startBracet && (arrOfData[intTempIndex] === '\\left' || arrOfData[intTempIndex] === '\\open')) intTempIndex++;
				intPatternIndex++;
			} else {
				if (intTempIndex === index)
					isFirstBracet = true;
			}

			var Close = exitBracet
				? arrOfData[intTempIndex] === exitBracet
				: this.CloseBracet[arrOfData[intTempIndex]];

			if (Close) {
				if (!exitBracet && (arrOfData[intTempIndex] == '\\right' || arrOfData[intTempIndex] == '\\close'))
					intTempIndex++;
				intPatternIndex--;
			}

			if (Close && intPatternIndex === 0)
				return intTempIndex;

			intTempIndex++;
		}
	}
	return false;
}
//Rules
EquationProcessing.prototype.GetRuleAndScript = [
	{Data: true},
	{Data: ["^", "_"],	Save: 'FirstSymbol'},
	{Data: true},
	{Reverse: 'FirstSymbol'},
	{Data: true},
];
EquationProcessing.prototype.GetRuleOrScript = [
	{Data: true},
	{Data: ["^", "_"]},
	{Data: true},
];
//Script
//script for bracet block
//pre-script for bracet block
EquationProcessing.prototype.AddScript = function(strAtom, FormArgument, isPre) {
	var arrPreTypeOfScript = this.BracetSyntaxChecker(isPre ? -1 : this.Parent.intIndexArray);
	var intType = isPre ? -1 : this.GetTypeOfScript(arrPreTypeOfScript);
	var Script = this.CreateScript(FormArgument, intType, arrPreTypeOfScript.length);

	if (isPre) {
		this.FillScriptContent(Script, intType, arrPreTypeOfScript, isPre);
		this.FillScriptBase(Script, isPre);
	}
	else {
		this.FillScriptBase(Script, null, strAtom);
		this.FillScriptContent(Script, intType, arrPreTypeOfScript);
	}
};
EquationProcessing.prototype.GetTypeOfScript = function(arrType) {
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
EquationProcessing.prototype.CreateScript = function(FormArgument, type, lengthOfType) {
	var Pr = {type: type};
	var isBothDegreeAndIndex = false;

	if (lengthOfType === 4) {
		isBothDegreeAndIndex = true;
	}

	var Script = FormArgument.Add_Script(isBothDegreeAndIndex, Pr, null, null, null);
	return Script;
};
EquationProcessing.prototype.FillScriptBase = function(Script, isPre, strFAtom) {
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
EquationProcessing.prototype.FillScriptContent = function(Script, typeOfScript, PreTypeOfScript, isPre) {
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
			if (isPre) {
				this.Parent.intIndexArray++;
			}
			this.FillScriptContentWriteSup(Script, isPre);
		} else if (PreTypeOfScript[0] === '^') {
			this.FillScriptContentWriteSup(Script, isPre);
			if (isPre) {
				this.Parent.intIndexArray++;
			}
			this.FillScriptContentWriteSub(Script, isPre);
		}
	}
};
EquationProcessing.prototype.FillScriptContentWriteSup = function(Script, isPre) {
	var Iterator = Script.getUpperIterator();
	this.FillScriptIterator(Iterator, isPre);
};
EquationProcessing.prototype.FillScriptContentWriteSub = function(Script, isPre) {
	var Iterator = Script.getLowerIterator();
	this.FillScriptIterator(Iterator, isPre);
};
EquationProcessing.prototype.FillScriptIterator = function(Iterator, isPre) {
	var n = isPre === true ? 1 : 2;

	if (this.StartBracet[this.GetFutureAtom(n)]) {
		this.AddBracetBlockToIgnor();
		this.StartLexer(Iterator);
	}
	else {
		this.AddIndexToIgnor(this.Parent.intIndexArray + n, true);
		this.StartLexer(Iterator, this.Parent.intIndexArray + n);
	}
}
EquationProcessing.prototype.CheckAndScript = function(isPre) {
	if (isPre === true) {
		return this.CheckSubAndSup(0); //PreSubOfSup
	}
	else {
		return this.CheckSubAndSup(); //SubOrSup
	}
};
EquationProcessing.prototype.CheckOrScript = function(isPre) {
	if (isPre === true) {
		return this.CheckSubOrSup(0); //PreSubOfSup
	}
	else {
		return this.CheckSubOrSup(); //SubOrSup
	}
};
EquationProcessing.prototype.CheckSubOrSup = function(n) {
	if (n === undefined) {
		n = 1;
	}
	var strTempAtom = this.GetFutureAtom(n);
	if(strTempAtom === "_" || strTempAtom === '^') {
		var index = this.CheckCloseBracet(this.Parent.intIndexArray + n+1);
		if (index === false) {
			if (this.GetFutureAtom(n+1)) {
				return true
			}
		}
		return typeof index === 'number';
		// add a_b & i^2
	}
};
EquationProcessing.prototype.CheckSubAndSup = function(n) {
	if (n === undefined) {
		n = 1;
	}
	var symbol;
	var strNow = this.GetFutureAtom(n);
	var strIndex;

	if(strNow === "_" || strNow === '^') {
		if (strNow === "_") {
			symbol = '^';
			strIndex = this.CheckCloseBracet(this.Parent.intIndexArray + n+1);

		}
		if (strNow === "^") {
			symbol = '_';
			strIndex = this.CheckCloseBracet(this.Parent.intIndexArray + n+1);
		}

		if (symbol !== undefined) {
			strNow = this.Parent.arrAtoms[strIndex + 1];
			strIndex = this.CheckCloseBracet(strIndex + 2);
		}
		return typeof strIndex === 'number';
	}
};
// //PreScript
// EquationProcessing.prototype.AddPreScript = function(FormArgument) {
// 	var Script = this.CreateScript(FormArgument, -1, 4);
// 	this.FillScriptPreScript(Script);
// };
// EquationProcessing.prototype.FillScriptPreScript = function(Script) {
// 	this.Parent.intIndexArray--;
// 	var type = this.GetTypeOfScript();

// 	if (type === 'SUB_SUP') {
// 		this.FillScriptContentWriteSub(Script);
// 		this.FillScriptContentWriteSup(Script);
// 	}
// 	else if (type === 'SUP_SUB') {
// 		this.FillScriptContentWriteSup(Script);
// 		this.FillScriptContentWriteSub(Script);
// 	}
// 	if (this.isUnicode()) {
// 		this.Parent.intIndexArray++;
// 	}

// 	if (this.StartBracet[this.GetFutureAtom(1)]) {
// 		var exit = this.AddBracetBlockToIgnor();
// 		this.StartLexer(Script.getBase(), exit);
// 	} else {
// 		this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
// 		this.StartLexer(Script.getBase(), this.Parent.intIndexArray + 1);
// 	}
// };
// EquationProcessing.prototype.CheckPreScript = function() {
// 	var n;
// 	this.isUnicode()
// 		? n = this.Parent.intIndexArray + 1
// 		: n = this.Parent.intIndexArray;

// 	var symbol;
// 	var strNow = this.Parent.arrAtoms[n];

// 	if(strNow === "_" || strNow === '^') {
// 		if (strNow === "_") {
// 			symbol = '^';
// 			if (this.StartBracet[this.Parent.arrAtoms[n+1]]) {
// 				var index = this.CheckCloseBracet(n + 1);
// 			} else {
// 				index = false
// 			}
// 		}
// 		if (strNow === "^") {
// 			symbol = '_';
// 			if (this.StartBracet[this.Parent.arrAtoms[n+1]]) {
// 				var index = this.CheckCloseBracet(n + 1);
// 			} else {
// 				index = false
// 			}
// 		}
// 		if (symbol !== undefined) {
// 			if (index !== false) {
// 				strNow = this.Parent.arrAtoms[index];
// 				var index = this.CheckCloseBracet(index + 1);
// 			}
// 			else {
// 				var tempIndex = n + 1;
// 				var index = this.CheckCloseBracet(tempIndex + 1);
// 				if (index === false) {
// 					index = tempIndex + 1
// 				}
// 			}
// 		}
// 		return typeof index === 'number';
// 	}
// };
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

			this.AddScript(strAtom, Function.getFName());

			var indexOfCLose = this.CheckCloseBracet();
			if (indexOfCLose && this.StartBracet[this.GetFutureAtom()]) {
				this.AddBracetBlockToIgnor();
				this.StartLexer(Function.getArgument(), indexOfCLose);
			}
			else {
				this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
				this.StartLexer(Function.getArgument(), this.Parent.intIndexArray + 1);
			}
		}
		else {
			Function.getFName().Add_Text(strAtom, this.Parent.Paragraph);
			var intClose = this.CheckCloseBracet();
			if (intClose && this.StartBracet[this.GetFutureAtom()]) {
				this.AddBracetBlockToIgnor();
				this.StartLexer(Function.getArgument(), intClose);
			}
			else {
				this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
				this.StartLexer(Function.getArgument(), this.Parent.intIndexArray + 1);
			}
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

	"mod": 3,

	"lim": 2,
	"inf": 2,
	"sup": 2,
	"max": 2,
	"min": 2
};
EquationProcessing.prototype.CheckIsBrackets = function (strAtom) {
	return (strAtom === "(" ||
			strAtom === "[" ||
			strAtom === "{" ||
			strAtom === "├")
};
EquationProcessing.prototype.AddBracet = function(FormArgument) {
	var BracetBlockData = {};

	BracetBlockData.intIndexStartBracet = this.Parent.intIndexArray;
	BracetBlockData.intIndexCloseBracet = this.CheckCloseBracet(BracetBlockData.intIndexStartBracet);

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
	'/': true,
	'|': true,
	'\\|' : true
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
};
EquationProcessing.prototype.GetBracet = function(Obj, type) {
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
//Fraction
EquationProcessing.prototype.CheckIsUnicodeFrac = function() {
	//two types of syntax:
	//
	//	1.	a/b		a∕b		a⊘c
	//	2.	/sdiv(a)(b)		/ldiv(a)(b)		/ndiv(a)(b)
	//	3. \frac{}{} \sfrac{}{} \cfrac{}{} ...
	//
	//sdiv standart
	//ldiv skewed
	//ndiv inline

	var checkIsFrac = function(str) {
		return (
			str === '\\frac' || str === '\\sfrac'||
			str === '\\dfrac'|| str === '\\cfrac'||
			str === '\\sdiv' || str === '\\ldiv' ||
			str === '\\ndiv'
		)
	}

	var checkUnicodeFrac = function(str) {
		return (str.charCodeAt() === 47 || //sdiv
			str.charCodeAt() === 8260 || //sdiv
			str.charCodeAt() === 8725 || //ldiv
			str.charCodeAt() === 8856 || //ndiv
			str === '\/'
		)
	}

	var isFrac = checkIsFrac(this.GetAtomByIndex(this.Parent.intIndexArray - 1));
	var indexOfCLose = this.CheckCloseBracet();

	if (isFrac) {

	} else if (checkUnicodeFrac(this.Parent.arrAtoms[indexOfCLose + 1])) {
		console.log('a \ b ...')
		checkUnicodeFrac(this.Parent.arrAtoms[indexOfCLose + 1]), this.Parent.arrAtoms[indexOfCLose + 1];
	}
	else {
		console.log('nope')
	}

};
EquationProcessing.prototype.CheckIsUnicodeSmallFrac = function(str) {
	return this.UnicodeSmallFrac[str.charCodeAt()] === true;
};
EquationProcessing.prototype.UnicodeSmallFrac = {
	47: true,
	8260: true,
	8725: true,
	8856: true,
	'\/': true
};
EquationProcessing.prototype.CheckIsLaTeXFullFrac = function(str) {
	return this.LaTeXFullFrac[str] === true;
};
EquationProcessing.prototype.LaTeXFullFrac = {
	'\\frac': true,
	'\\sfrac': true,
	'\\cfrac': true,
	'\\nicefrac': true
};
EquationProcessing.prototype.CheckIsFrac = function() {
	var isFrac;

	if (this.isLaTeX()) {
		isFrac = this.CheckIsLaTeXFullFrac(this.GetNowAtom());
		return !(isFrac === false);
	}

	else if (this.isUnicode()) {
		var index = this.CheckCloseBracet(this.Parent.intIndexArray);

		if (index === false) {
			return false;
		}

		if (index !== false) {
			if(index + 1 >= this.Parent.arrAtoms.length) {
				return false
			}
			isFrac = this.CheckIsUnicodeSmallFrac(this.Parent.arrAtoms[index + 1]);
			return this.CheckCloseBracet(index+2) && isFrac;
		}
	}
};
EquationProcessing.prototype.AddFraction = function(FormArgument, strAtom) {
	var typeOfFraction;

	if (this.isLaTeX()) {
		typeOfFraction = this.GetTypeOfFrac[strAtom];
		//var isInlineFraction = this.CheckSyntaxSequence(["^", 1, "/", "_", 1], null, true);
	}
	else if (this.isUnicode()) {
		var exitIndex = this.CheckCloseBracet();
		this.AddIndexToIgnor(exitIndex)
		typeOfFraction = this.GetTypeOfFrac[this.Parent.arrAtoms[exitIndex + 1]];
		console.log(typeOfFraction)
	}

	if (typeof typeOfFraction === 'number') {
		var Fraction = this.CreateFraction(FormArgument, typeOfFraction);
		this.FillFracContent(Fraction);
	}
}
EquationProcessing.prototype.CreateFraction = function (FormArgument, typeOfFraction) {
	var Fraction;
	this.Parent.Pr.type = typeOfFraction;

	if (typeOfFraction === 2) {
		this.Parent.Pr.type = 0;
		var Box = this.CreateLitleBox(FormArgument);
		Fraction = Box.Add_Fraction(this.Parent.Pr.type, null, null);
	}

	else if (typeOfFraction !== 2) {
		Fraction = FormArgument.Add_Fraction(this.Parent.Pr, null, null);
	}

	return Fraction;
};
EquationProcessing.prototype.FillFracContent = function (FormArgument) {
	if (this.isLaTeX()) {
		this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent());
		this.AddBracetBlockToIgnor();
		this.Parent.intIndexArray++;
		this.StartLexer(FormArgument.getDenominatorMathContent());
	}
	else if (this.isUnicode()) {
		this.Parent.intIndexArray--;
		var intExitIndex = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent(), intExitIndex);
		this.Parent.intIndexArray++;
		intExitIndex = false;
		intExitIndex = this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getDenominatorMathContent(), intExitIndex);
	}
};
EquationProcessing.prototype.GetTypeOfFrac = {
	'\\frac' :0,
	'\\tfrac': 4,
	'\\sfrac': 1,
	'\\nicefrac': 2,
	'\\dfrac': 0,
	'\\binom': 3,
	'\\': 0,
	"⁄" : 1,
	'⊘': 2,
	'\/': 0
};
//Limit: Limits (switch must be in options)
EquationProcessing.prototype.AddLimit = function (FormArgument, strAtom) {
	var typeOfBottom;

	if (this.isUnicode()) {
		var strTempSymbol = this.Parent.arrAtoms[this.Parent.intIndexArray + 1].charCodeAt();

		// lim_(n→∞) a_n === lim┬(n→∞) a_n
		if (strTempSymbol === 9524 || strTempSymbol === 94) {
			this.Parent.intIndexArray++;
			typeOfBottom = '^';
		} else if (strTempSymbol === 9516 || strTempSymbol === 95) {
			this.Parent.intIndexArray++;
			typeOfBottom = '_';
		}
		typeOfBottom = this.GetTypeOrScript([typeOfBottom]);
	}
	else if (this.isLaTeX()) {
		typeOfBottom = this.BracetSyntaxChecker(this.Parent.intIndexArray);
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
EquationProcessing.prototype.FillLimitContent = function(Limit, typeOfLimit) {
	Limit.getFName().Add_Text(typeOfLimit, this.Parent.ParaMath.Paragraph, STY_PLAIN);
	this.AddBracetBlockToIgnor()
	this.StartLexer(Limit.getIterator());
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
			this.StartLexer(Radical.getDegree());
		}

		if (this.GetFutureAtom() === '{') {
			this.AddBracetBlockToIgnor();
			this.StartLexer(Radical.getBase());
		}
	}
	else if (this.isUnicode()) {
		var closeBracet = this.AddBracetBlockToIgnor()
		this.Parent.intIndexArray++;
		var indexOfDelimetr = this.SearchAtom('&');

		if (typeof indexOfDelimetr === 'number') {
			this.AddIndexToIgnor(indexOfDelimetr)
			this.StartLexer(Radical.getDegree(), indexOfDelimetr);
		}
		this.StartLexer(Radical.getBase(), closeBracet);
	}
};
//Large Operator: Limits (switch must be in options)
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
	// if (this.Parent.arrAtoms[this.Parent.intIndexArray + 1] === "\\limits") {
	// 	this.GetNextAtom();
	// 	intTypeOFLoc = 0;
	// }
	var LargeOperator = this.CreateLargeOperator(FormArgument, intTypeOFLoc, strNameOfLargeOperator);
	this.FillLargeOperatorContent(LargeOperator);
};
EquationProcessing.prototype.CreateLargeOperator = function(FormArgument, intTypeOFLoc, strName) {
	var Pr = {
		ctrPrp: new CTextPr(),
		limLoc: intTypeOFLoc,
		subHide: false,
		supHide: false,
		chr: strName,
	};

	if (this.CheckSubAndSup()) {
		Pr.supHide = false;
		Pr.subHide = false;
	}
	else if (this.CheckSubOrSup(1)) {
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
EquationProcessing.prototype.FillLargeOperatorContent = function(LargeOperator) {
	var strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

	if (strTempAtom === "^") {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
		this.StartLexer(LargeOperator.getSupMathContent());
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom == "_") {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
			this.StartLexer(LargeOperator.getSubMathContent());
		}
	}
	else if (strTempAtom === "_") {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
		this.StartLexer(LargeOperator.getSubMathContent());
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom === "^") {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
			this.StartLexer(LargeOperator.getSupMathContent());
		}
	}

	if (this.isUnicode()) {
		this.Parent.intIndexArray++;
	}

	var indexOfCLose = this.AddBracetBlockToIgnor();
	if (indexOfCLose === undefined) {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true)
		indexOfCLose = this.Parent.intIndexArray + 1;
	}

	this.StartLexer(LargeOperator.getBase(), indexOfCLose);
};
EquationProcessing.prototype.CheckIsLargeOperator = {
	"sum": 8721,
	"prod": 8719,
	"coprod": 8720,
	"bigcup": 8899,
	"bigcap": 8898,
	"bigvee": 8897,
	"bigwedge": 8896,
	"int":8747,
	"oint":8755,
	"iint":8748,
	"oiint":8751,
	"iiint":8749,
	"oiiint":8752,
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
//Binom
EquationProcessing.prototype.AddBinom = function (FormArgument) {
	var Delimiter = this.CreateBracetBlock(FormArgument, null, null, 0);
	var BaseMathContent = Delimiter.getElementMathContent(0);
	this.AddFraction(BaseMathContent, '\\binom');
};
//Duplicate CheckIsFrac!
EquationProcessing.prototype.CheckIsBinom = function() {
	if (this.isUnicode()) {
		var index;
		var one, delim, two;
		if (this.StartBracet[this.Parent.arrAtoms[this.Parent.intIndexArray+1]]) {
			index = this.CheckCloseBracet(this.Parent.intIndexArray+1);
		} else {
			index = this.Parent.intIndexArray+1;
		}

		if (index) {
			one = true;
		}

		if (this.Parent.arrAtoms[index+1] === '¦') {
			delim = true;
		}

		if (this.StartBracet[this.Parent.arrAtoms[index+2]]) {
			index = this.CheckCloseBracet(index+2);
		} else {
			index = this.Parent.intIndexArray+2;
		}

		if (index) {
			two = true;
			index = undefined;
		}


		return one && delim && two
	}
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

	if (this.isLaTeX()) {
		this.Parent.isInMatrix = true;

		this.GetNextAtom(); // skip {
		var typeOfMatrix = this.GetNextAtom();
		this.GetNextAtom(); // skip }

		arrTempMatrixData = this.CreateMatrix(FormArgument, typeOfMatrix);

		Matrix =		arrTempMatrixData[0];
		arrExitData =	arrTempMatrixData[1];
		intRowsCount =	arrTempMatrixData[2];
		intColsCount =	arrTempMatrixData[3];

		this.FillMatrixContent(
			Matrix,
			arrExitData,
			intRowsCount,
			intColsCount
		);

		this.GetNextAtom() // skip {
		if (typeOfMatrix != this.GetNextAtom()) {
			console.log('error in matrix')
		}
		this.GetNextAtom(); // skip }
		this.Parent.isInMatrix = false;
	}

	else if (this.isUnicode()) {
		this.GetNextAtom(); // skip (
		arrTempMatrixData = this.CreateMatrix(FormArgument, 'matrix');
		
		Matrix =		arrTempMatrixData[0];
		arrExitData =	arrTempMatrixData[1];
		intRowsCount =	arrTempMatrixData[2];
		intColsCount =	arrTempMatrixData[3];

		this.FillMatrixContent(
			Matrix,
			arrExitData,
			intRowsCount,
			intColsCount
		);
	}
};
EquationProcessing.prototype.CreateMatrix = function(FormArgument, typeOfMatrix) {
	var Bracets = [];

	if (this.isLaTeX()) {
		if (this.GetFutureAtom() === '{') {
			do {
				var strAtom = this.GetNextAtom();
			} while (strAtom != '}');
		}

		if (typeOfMatrix === "pmatrix") {
			Bracets.push(GetBracetCode["("], GetBracetCode[")"])
		}
		else if (typeOfMatrix === "bmatrix") {
			Bracets.push(GetBracetCode["["], GetBracetCode["]"])
		}
		else if (typeOfMatrix === "Bmatrix") {
			Bracets.push(GetBracetCode["{"], GetBracetCode["}"])
		}
		else if (typeOfMatrix === "vmatrix") {
			Bracets.push(GetBracetCode["|"], GetBracetCode["|"])
		}
	} else {

	}

	var intColsCount = 1;
	var intRowsCount = 1;
	var strTempArr;
	var intIndex = this.Parent.intIndexArray + 1;

	var arrBufferExit = [];
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
	} while (strTempArr !== "\\end" && strTempArr !== ')');
	arrBufferExit.push(intIndex-1);

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

	return[Matrix, arrBufferExit, intRowsCount, intColsCount];
};
EquationProcessing.prototype.FillMatrixContent = function(Matrix, arrExitData, intRowsCount, intColsCount) {
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
	if (this.isLaTeX()) {
		var n = 0, isBegin, isBracet, isMatrix;
		isBegin = this.GetFutureAtom(n) === '\\begin'; n++;

		if (isBegin) {
			isBracet = this.GetFutureAtom(n) === '{';
			n++;
		}

		if (isBegin && isBracet) {
			isMatrix = this.ArrMatrixTypes.includes(this.GetFutureAtom(n));
			n++;
		}

		if (isBegin && isBracet && isMatrix) {
			isBracet = this.GetFutureAtom(n) === '}';
		}

		return isBegin && isBracet && isMatrix;
	}

	else if (this.isUnicode()) {
		if (str && str.codePointAt() === 9632) {
			return true;
		} else {
			return false
		}
	}
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
	775 : "\\dot",
	776 : "\\ddot",
	770 : "\\hat",
	780 : "\\check",
	769 : "\\acute",
	768 : "\\grave",
	773 : "\\bar",
	8407: "\\vec",
	774 : "\\breve",
	771 : "\\tilde",
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
//GetBracetCodeLexer don't used
EquationProcessing.prototype.GetBracetCodeLexer = {
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
	"\\backslash": 0x5c,
};
//Text and symbols
EquationProcessing.prototype.AddSymbol = function (strAtom, FormArgument, type, typeText) {
	if (strAtom === ')' || strAtom === '(') {
		return
	}
	if (this.GetFutureAtom() === '\\' && !this.isInMatrix) {
		if (type) {
			if (type) {
				this.Pr['scr'] = type;
				FormArgument.Add_Symbol(strAtom.charCodeAt(0), typeText, {brk: true});
			}
		} else {

			if (strAtom.length > 1) {
				FormArgument.Add_Text(strAtom, this.ParaMath.Paragraph, {brk: true});
			}

			else {
				FormArgument.Add_Symbol(strAtom.charCodeAt(0), this.Pr, {brk: true});
			}
		}
	}

	else {

		if (type) {
			this.Pr['scr'] = type;
			FormArgument.Add_Symbol(strAtom.charCodeAt(0), typeText, this.Pr);
		}

		var strCode = this.Parent.arrLaTeXSymbols[strAtom];
		if (strCode) {
			FormArgument.Add_Symbol(strCode, this.Pr);
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
EquationProcessing.prototype.AddMathText = function(FormArgument, strAtom) {
	var type = this.CheckMathText[strAtom];
	var objSty = this.CheckMathTextSty[strAtom];
	strAtom = this.GetNextAtom();

	do {
		strAtom = this.GetNextAtom();

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
	} while (strAtom != '}');
};
EquationProcessing.prototype.CheckMathText = {
	'\\mathnormal': 0,
	'\\mathbf': 0,
	'\\mathrm': 0,
	'\\mathcal': 1,
	'\\mathfrak': 2,
	'\\mathbb': 3,
	'\\mathsf': 4,
	'\\mathtt': 5,
};
EquationProcessing.prototype.CheckMathTextSty = {
	'\\mathnormal': {Italic: true, Bold: false},
	'\\mathbf': {Italic: false, Bold: true},
	'\\mathsf': {Italic: false, Bold: false},
	'\\mathtt': {Italic: false, Bold: false},
	'\\mathfrak': {Italic: false, Bold: false},
	'\\mathrm': {Italic: false}
};

//========================================================================//
//==========================LaTeX_Lexer===================================//
//========================================================================//
function CLaTeXParser(props, str) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = {ctrPrp: new CTextPr()};
	this.ParaMath = props;
	this.isError = false;
	this.isInMatrix = false;
	this.Processing;
}
CLaTeXParser.prototype.Start = function() {
	this.Processing = new EquationProcessing(this);
	this.Processing.Parse();

	var t0 = performance.now();
	CLaTeXLexer(this, this.ParaMath.Root);
	var t1 = performance.now();
	console.log("Lexer work " + (t1 - t0) + " milliseconds.");
	this.ParaMath.Root.Correct_Content(true);
};
CLaTeXParser.prototype.arrLaTeXSymbols = {
	"Alpha": 0x0391,
	"alpha": 0x03b1,
	"Beta": 0x0392,
	"beta": 0x03b2,
	"Gamma": 0x0393,
	"gamma": 0x03b3,
	"Delta": 0x0394,
	"delta": 0x03b4,
	"Epsilon": 0x0395,
	"epsilon": 0x03f5,
	"varepsilon": 0x03b5,
	"Zeta": 0x0396,
	"zeta": 0x03b6,
	"Eta": 0x0397,
	"eta": 0x3b7,
	"Theta": 0x0398,
	"theta": 0x03b8,
	"vartheta": 0x03d1,
	"Iota": 0x0399,
	"iota": 0x03b9,
	"Kappa": 0x039a,
	"kappa": 0x03ba,
	"varkappa": 0x03f0,
	"Lambda": 0x039b,
	"lambda": 0x03bb,
	"Mu": 0x039c,
	"mu": 0x03bc,
	"Nu": 0x039d,
	"nu": 0x03bd,
	"Xi": 0x039e,
	"xi": 0x03be,
	"Omicron": 0x039f,
	"omicron": 0x03bf,
	"Pi": 0x03a0,
	"pi": 0x03c0,
	"varpi": 0x03d6,
	"Rho": 0x03a1,
	"rho": 0x03c1,
	"varrho": 0x03f1,
	"Sigma": 0x03a3,
	"sigma": 0x03c2,
	"varsigma": 0x03f2,
	"Tau ": 0x03a4,
	"tau": 0x03c4,
	"Upsilon": 0x03a5,
	"upsilon": 0x03c5,
	"Phi": 0x03a6,
	"phi": 0x03c6,
	"varphi": 0x03d5,
	"varPhi": 0x03d5,
	"Chi": 0x03a7,
	"chi": 0x03c7,
	"Psi": 0x03a8,
	"psi": 0x03c8,
	"Omega": 0x03a9,
	"omega": 0x03c9,
	"Digamma": 0x03dc,
	"digamma": 0x03dd,
	".": 0x2026,
	"above": 0x2534,
	"acute": 0x0301,
	"aleph": 0x2135,
	"amalg": 0x2210,
	"angle": 0x2220,
	"aoint": 0x222e,
	"approx": 0x2248,
	"asmash": 0x2b06,
	"ast": 0x2217,
	"asymp": 0x224d,
	"atop": 0x00a6,
	"bar": 0x0305,
	"Bar": 0x033f,
	"because": 0x2235,
	"begin": 0x3016,
	"below": 0x252c,
	"bet": 0x2136,
	"beth": 0x2136,
	"bigcap": 0x22c2,
	"bigcup": 0x22c3,
	"bigodot": 0x2a00,
	"bigoplus": 0x2a01,
	"bigotimes": 0x2a02,
	"bigsqcup": 0x2a06,
	"biguplus": 0x2a04,
	"bigvee": 0x22c1,
	"bigwedge": 0x22c0,
	"bot": 0x22a5,
	"bowtie": 0x22c8,
	"box": 0x25a1,
	"boxdot": 0x22a1,
	"boxminus": 0x229f,
	"boxplus": 0x229e,
	"bra": 0x27e8,
	"break": 0x2936,
	"breve": 0x0306,
	"bullet": 0x2219,
	"cap": 0x2229,
	"cbrt": 0x221b,
	"cases": 0x24b8,
	"cdot": 0x22c5,
	"cdots": 0x22ef,
	"check": 0x030c,
	"circ": 0x2218,
	"close": 0x2524,
	"clubsuit": 0x2663,
	"coint": 0x2232,
	"cong": 0x2245,
	"coprod": 0x2210,
	"cup": 0x222a,
	"dalet": 0x2138,
	"daleth": 0x2138,
	"dashv": 0x22a3,
	"dd": 0x2146,
	"Dd": 0x2145,
	"ddddot": 0x20dc,
	"dddot": 0x20db,
	"ddot": 0x0308,
	"ddots": 0x22f1,
	"defeq": 0x225d,
	"degc": 0x2103,
	"degf": 0x2109,
	"degree": 0x00b0,
	"Deltaeq": 0x225c,
	"diamond": 0x22c4,
	"diamondsuit": 0x2662,
	"div": 0x00f7,
	"dot": 0x0307,
	"doteq": 0x2250,
	"dots": 0x2026,
	"doublea": 0x1d552,
	"doubleA": 0x1d538,
	"doubleb": 0x1d553,
	"doubleB": 0x1d539,
	"doublec": 0x1d554,
	"doubleC": 0x2102,
	"doubled": 0x1d555,
	"doubleD": 0x1d53b,
	"doublee": 0x1d556,
	"doubleE": 0x1d53c,
	"doublef": 0x1d557,
	"doubleF": 0x1d53d,
	"doubleg": 0x1d558,
	"doubleG": 0x1d53e,
	"doubleh": 0x1d559,
	"doubleH": 0x210d,
	"doublei": 0x1d55a,
	"doubleI": 0x1d540,
	"doublej": 0x1d55b,
	"doubleJ": 0x1d541,
	"doublek": 0x1d55c,
	"doubleK": 0x1d542,
	"doublel": 0x1d55d,
	"doubleL": 0x1d543,
	"doublem": 0x1d55e,
	"doubleM": 0x1d544,
	"doublen": 0x1d55f,
	"doubleN": 0x2115,
	"doubleo": 0x1d560,
	"doubleO": 0x1d546,
	"doublep": 0x1d561,
	"doubleP": 0x2119,
	"doubleq": 0x1d562,
	"doubleQ": 0x211a,
	"doubler": 0x1d563,
	"doubleR": 0x211d,
	"doubles": 0x1d564,
	"doubleS": 0x1d54a,
	"doublet": 0x1d565,
	"doubleT": 0x1d54b,
	"doubleu": 0x1d566,
	"doubleU": 0x1d54c,
	"doublev": 0x1d567,
	"doubleV": 0x1d54d,
	"doublew": 0x1d568,
	"doubleW": 0x1d54e,
	"doublex": 0x1d569,
	"doubleX": 0x1d54f,
	"doubley": 0x1d56a,
	"doubleY": 0x1d550,
	"doublez": 0x1d56b,
	"doubleZ": 0x2124,
	"downarrow": 0x2193,
	"Downarrow": 0x21d3,
	"dsmash": 0x2b07,
	"ee": 0x2147,
	"ell": 0x2113,
	"emptyset": 0x2205,
	"emsp": 0x2003,
	"end": 0x3017,
	"ensp": 0x2002,
	"eqarray": 0x2588,
	"equiv": 0x2261,
	"exists": 0x2203,
	"forall": 0x2200,
	"fraktura": 0x1d51e,
	"frakturA": 0x1d504,
	"frakturb": 0x1d51f,
	"frakturB": 0x1d505,
	"frakturc": 0x1d520,
	"frakturC": 0x212d,
	"frakturd": 0x1d521,
	"frakturD": 0x1d507,
	"frakture": 0x1d522,
	"frakturE": 0x1d508,
	"frakturf": 0x1d523,
	"frakturF": 0x1d509,
	"frakturg": 0x1d524,
	"frakturG": 0x1d50a,
	"frakturh": 0x1d525,
	"frakturH": 0x210c,
	"frakturi": 0x1d526,
	"frakturI": 0x2111,
	"frakturj": 0x1d527,
	"frakturJ": 0x1d50d,
	"frakturk": 0x1d528,
	"frakturK": 0x1d50e,
	"frakturl": 0x1d529,
	"frakturL": 0x1d50f,
	"frakturm": 0x1d52a,
	"frakturM": 0x1d510,
	"frakturn": 0x1d52b,
	"frakturN": 0x1d511,
	"frakturo": 0x1d52c,
	"frakturO": 0x1d512,
	"frakturp": 0x1d52d,
	"frakturP": 0x1d513,
	"frakturq": 0x1d52e,
	"frakturQ": 0x1d514,
	"frakturr": 0x1d52f,
	"frakturR": 0x211c,
	"frakturs": 0x1d530,
	"frakturS": 0x1d516,
	"frakturt": 0x1d531,
	"frakturT": 0x1d517,
	"frakturu": 0x1d532,
	"frakturU": 0x1d518,
	"frakturv": 0x1d533,
	"frakturV": 0x1d519,
	"frakturw": 0x1d534,
	"frakturW": 0x1d51a,
	"frakturx": 0x1d535,
	"frakturX": 0x1d51b,
	"fraktury": 0x1d536,
	"frakturY": 0x1d51c,
	"frakturz": 0x1d537,
	"frakturZ": 0x2128,
	"frown": 0x2311,
	"funcapply": 0x2061,
	"ge": 0x2265,
	"geq": 0x2265,
	"gets": 0x2190,
	"gg": 0x226b,
	"gimel": 0x2137,
	"grave": 0x0300,
	"hairsp": 0x200a,
	"hat": 0x0302,
	"hbar": 0x210f,
	"heartsuit": 0x2661,
	"hookleftarrow": 0x21a9,
	"hookrightarrow": 0x21aa,
	"hphantom": 0x2b04,
	"hsmash": 0x2b0c,
	"hvec": 0x20d1,
	"ii": 0x2148,
	"iiint": 0x222d,
	"iint": 0x222c,
	"iiiint": 0x2a0c,
	"Im": 0x2111,
	"imath": 0x0131,
	"in": 0x2208,
	"inc": 0x2206,
	"infty": 0x221e,
	"int": 0x222b,
	"itimes": 0x2062,
	"jj": 0x2149,
	"jmath": 0x0237,
	"ket": 0x27e9,
	"langle": 0x2329,
	"lbbrack": 0x27e6,
	"lbrace": 0x007b,
	"lbrack": 0x005b,
	"lceil": 0x2308,
	"ldiv": 0x2215,
	"ldivide": 0x2215,
	"ldots": 0x2026,
	"le": 0x2264,
	"left": 0x251c,
	"leftarrow": 0x2190,
	"Leftarrow": 0x21d0,
	"leftharpoondown": 0x21bd,
	"leftharpoonup": 0x21bc,
	"leftrightarrow": 0x2194,
	"Leftrightarrow": 0x21d4,
	"leq": 0x2264,
	"lfloor": 0x230a,
	"lhvec": 0x20d0,
	"ll": 0x226a,
	"lmoust": 0x23b0,
	"Longleftarrow": 0x27f8,
	"Longleftrightarrow": 0x27fa,
	"Longrightarrow": 0x27f9,
	"lrhar": 0x21cb,
	"lvec": 0x20d6,
	"mapsto": 0x21a6,
	"matrix": 0x25a0,
	"medsp": 0x205f,
	"mid": 0x2223,
	"middle": 0x24dc,
	"models": 0x22a8,
	"mp": 0x2213,
	"nabla": 0x2207,
	"naryand": 0x2592,
	"nbsp": 0x00a0,
	"ne": 0x2260,
	"nearrow": 0x2197,
	"neq": 0x2260,
	"ni": 0x220b,
	"norm": 0x2016,
	"notcontain": 0x220c,
	"notelement": 0x2209,
	"notin": 0x2209,
	"nwarrow": 0x2196,
	"o": 0x03bf,
	"O": 0x039f,
	"odot": 0x2299,
	"of": 0x2592,
	"oiiint": 0x2230,
	"oiint": 0x222f,
	"oint": 0x222e,
	"ominus": 0x2296,
	"open": 0x251c,
	"oplus": 0x2295,
	"otimes": 0x2297,
	"over": 0x002f,
	"overbar": 0x00af,
	"overbrace": 0x23de,
	"overbracket": 0x23b4,
	"overline": 0x00af,
	"overparen": 0x23dc,
	"overshell": 0x23e0,
	"parallel": 0x2225,
	"partial": 0x2202,
	"pmatrix": 0x24a8,
	"perp": 0x22a5,
	"phantom": 0x27e1,
	"pm": 0x00b1,
	"pppprime": 0x2057,
	"ppprime": 0x2034,
	"pprime": 0x2033,
	"prec": 0x227a,
	"preceq": 0x227c,
	"prime": 0x2032,
	"prod": 0x220f,
	"propto": 0x221d,
	"qdrt": 0x221c,
	"rangle": 0x232a,
	"Rangle": 0x27eb,
	"ratio": 0x2236,
	"rbrace": 0x007d,
	"rbrack": 0x005d,
	"Rbrack": 0x27e7,
	"rceil": 0x2309,
	"rddots": 0x22f0,
	"Re": 0x211c,
	"rect": 0x25ad,
	"rfloor": 0x230b,
	"rhvec": 0x20d1,
	"right": 0x2524,
	"rightarrow": 0x2192,
	"Rightarrow": 0x21d2,
	"rightharpoondown": 0x21c1,
	"rightharpoonup": 0x21c0,
	"rmoust": 0x23b1,
	"root": 0x24ad,
	"scripta": 0x1d4b6,
	"scriptA": 0x1d49c,
	"scriptb": 0x1d4b7,
	"scriptB": 0x212c,
	"scriptc": 0x1d4b8,
	"scriptC": 0x1d49e,
	"scriptd": 0x1d4b9,
	"scriptD": 0x1d49f,
	"scripte": 0x212f,
	"scriptE": 0x2130,
	"scriptf": 0x1d4bb,
	"scriptF": 0x2131,
	"scriptg": 0x210a,
	"scriptG": 0x1d4a2,
	"scripth": 0x1d4bd,
	"scriptH": 0x210b,
	"scripti": 0x1d4be,
	"scriptI": 0x2110,
	"scriptj": 0x1d4bf,
	"scriptJ": 0x1d4a5,
	"scriptk": 0x1d4c0,
	"scriptK": 0x1d4a6,
	"scriptl": 0x2113,
	"scriptL": 0x2112,
	"scriptm": 0x1d4c2,
	"scriptM": 0x2133,
	"scriptn": 0x1d4c3,
	"scriptN": 0x1d4a9,
	"scripto": 0x2134,
	"scriptO": 0x1d4aa,
	"scriptp": 0x1d4c5,
	"scriptP": 0x1d4ab,
	"scriptq": 0x1d4c6,
	"scriptQ": 0x1d4ac,
	"scriptr": 0x1d4c7,
	"scriptR": 0x211b,
	"scripts": 0x1d4c8,
	"scriptS": 0x1d4ae,
	"scriptt": 0x1d4c9,
	"scriptT": 0x1d4af,
	"scriptu": 0x1d4ca,
	"scriptU": 0x1d4b0,
	"scriptv": 0x1d4cb,
	"scriptV": 0x1d4b1,
	"scriptw": 0x1d4cc,
	"scriptW": 0x1d4b2,
	"scriptx": 0x1d4cd,
	"scriptX": 0x1d4b3,
	"scripty": 0x1d4ce,
	"scriptY": 0x1d4b4,
	"scriptz": 0x1d4cf,
	"scriptZ": 0x1d4b5,
	"sdiv": 0x2044,
	"sdivide": 0x2044,
	"searrow": 0x2198,
	"setminus": 0x2216,
	"sim": 0x223c,
	"simeq": 0x2243,
	"smash": 0x2b0d,
	"smile": 0x2323,
	"spadesuit": 0x2660,
	"sqcap": 0x2293,
	"sqcup": 0x2294,
	"sqrt": 0x221a,
	"sqsubseteq": 0x2291,
	"sqsuperseteq": 0x2292,
	"star": 0x22c6,
	"subset": 0x2282,
	"subseteq": 0x2286,
	"succ": 0x227b,
	"succeq": 0x227d,
	"sum": 0x2211,
	"superset": 0x2283,
	"superseteq": 0x2287,
	"swarrow": 0x2199,
	"therefore": 0x2234,
	"thicksp": 0x2005,
	"thinsp": 0x2006,
	"tilde": 0x0303,
	"times": 0x00d7,
	"to": 0x2192,
	"top": 0x22a4,
	"tvec": 0x20e1,
	"ubar": 0x0332,
	"Ubar": 0x0333,
	"underbar": 0x2581,
	"underbrace": 0x23df,
	"underbracket": 0x23b5,
	"underline": 0x25b1,
	"underparen": 0x23dd,
	"uparrow": 0x2191,
	"Uparrow": 0x21d1,
	"updownarrow": 0x2195,
	"Updownarrow": 0x21d5,
	"uplus": 0x228e,
	"vbar": 0x2502,
	"vdash": 0x22a2,
	"vdots": 0x22ee,
	"vec": 0x20d7,
	"vee": 0x2228,
	"vert": 0x007c,
	"Vert": 0x2016,
	"Vmatrix": 0x24a9,
	"vphantom": 0x21f3,
	"vthicksp": 0x2004,
	"wedge": 0x2227,
	"wp": 0x2118,
	"zwnj": 0x200c,
	"wr": 0x2240,
	"zwsp": 0x200b,
};
function CLaTeXLexer(Parser, FormArgument, indexOfCloseAtom) {
	var eProc = Parser.Processing;
	var strAtom;
	var isDontWrite = function(index) {
		if (eProc.IndexesOfIgnoredAtoms[index] === false) {
			strAtom = eProc.GetNextAtom();

			if (strAtom !== undefined) {
				isDontWrite(index + 1);
			}
		}
	};

	do {
		if (!Parser.isError) {

			strAtom = eProc.GetNextAtom();

			if (indexOfCloseAtom == Parser.intIndexArray || strAtom === undefined) {
				if(eProc.IndexesOfIgnoredAtoms[Parser.intIndexArray] === true) {
					eProc.AddSymbol(strAtom, FormArgument);
				}
				return
			}

			isDontWrite(Parser.intIndexArray);

			if (strAtom === undefined) {
				return
			}
			if (eProc.GetTypeOfFunction[strAtom.slice(1)] != null) {
				eProc.AddFunction(FormArgument, strAtom);
			}
			else if (eProc.CheckIsFrac() && !Parser.isError) {
				eProc.AddFraction(FormArgument, strAtom)
			}
			else if (strAtom == "\\sqrt" && !Parser.isError) {
				eProc.AddRadical(FormArgument);
			}
			else if (eProc.CheckIsMatrix()) {
				eProc.AddMatrix(FormArgument);
			}
			else if (eProc.CheckIsLargeOperator[strAtom.slice(1)] && !Parser.isError) {
				eProc.AddLargeOperator(FormArgument, strAtom);
			}
			else if (eProc.CheckOrScript(true) || eProc.CheckAndScript(true)) {
				eProc.AddScript(strAtom, FormArgument, true);
			}
			else if (eProc.CheckSyntax('GetRuleOrScript') || eProc.CheckSyntax('GetRuleAndScript') && !Parser.isError) {
				eProc.AddScript(strAtom, FormArgument);
			}
			else if (eProc.StartBracet[strAtom] && !Parser.isError) {
				eProc.AddBracet(FormArgument);
			}
			else if (strAtom == "\\pmod" && !Parser.isError) {
				eProc.AddPMod(FormArgument);
			}
			else if (strAtom == "\\binom") {
				eProc.AddBinom(FormArgument);
			}
			else if (eProc.CheckIsAccent(strAtom) && !Parser.isError) {
				eProc.AddAccent(FormArgument, strAtom);
			}
			// else if (typeof eProc.CheckMathText[strAtom] == 'number' && !Parser.isError) {
			// 	Parser.AddMathText(FormArgument, strAtom);
			// }
			else if (!Parser.isError && strAtom !== undefined) {
				eProc.AddSymbol(strAtom, FormArgument);
			}
		}
	} while (strAtom !== undefined);
}

//========================================================================//
//==========================Unicode_Lexer=================================//
//========================================================================//
function CUnicodeParser(str, props) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = {ctrPrp: new CTextPr()};
	this.ParaMath = props;
	this.Processing;
}
CUnicodeParser.prototype.Start = function() {
	this.Processing = new EquationProcessing(this);
	this.Processing.Parse();

	var t0 = performance.now();
	CUnicodeLexer(this, this.ParaMath.Root);
	var t1 = performance.now();
	console.log("Unicode work " + (t1 - t0) + " milliseconds.");

	this.ParaMath.Root.Correct_Content(true);
};
function CUnicodeLexer(Parser, FormArgument, indexOfCloseBracet) {
	var eProc = Parser.Processing;
	var strAtom;

	do {
		console.log(Parser.ParaMath.GetText())
		strAtom = eProc.GetNextAtom();
		if (indexOfCloseBracet === Parser.intIndexArray) {
			if(eProc.IndexesOfIgnoredAtoms[Parser.intIndexArray] === true) {
				FormArgument.Add_Text(strAtom, Parser.Paragraph);
			}
			return;
		}
		else if(eProc.IndexesOfIgnoredAtoms[Parser.intIndexArray] === false) {
			strAtom = eProc.GetNextAtom();
		}
		if (strAtom === undefined) {
			return;
		}
		else if (eProc.CheckIsFrac() && eProc.StartBracet[strAtom]) {
			eProc.AddFraction(FormArgument, strAtom);
		}
		else if (eProc.GetTypeOfFunction[strAtom] != null) {
			eProc.AddFunction(FormArgument, strAtom);
		}
		else if (eProc.UnicodeLargeOperator[strAtom.charCodeAt()]) {
			eProc.AddLargeOperator(FormArgument, strAtom)
		}
		else if (eProc.CheckSyntax('GetRuleOrScript') || eProc.CheckSyntax('GetRuleAndScript')) {
			eProc.AddScript(strAtom, FormArgument);
		}
		else if (eProc.CheckOrScript(true) || eProc.CheckAndScript(true)) {
			Parser.intIndexArray++;
			eProc.AddScript(strAtom, FormArgument, true);
		}
		else if (eProc.CheckIsMatrix(strAtom)) {
			eProc.AddMatrix(FormArgument);
		}
		else if (strAtom.charCodeAt() === 8730) {
			eProc.AddRadical(FormArgument);
		}
		else if (eProc.CheckIsBinom()) {
			eProc.AddBinom(FormArgument);
		}
		else if (eProc.CheckIsAccent(strAtom)) {
			eProc.AddAccent(FormArgument);
		}
		else if (eProc.CheckIsBrackets(strAtom)) {
			eProc.AddBracet(FormArgument);
		}
		else {
			FormArgument.Add_Text(strAtom, Parser.Paragraph);
		}
	} while (strAtom != undefined);
}

//--------------------------------------------------------export----------------------------------------------------
window["AscCommonWord"] = window["AscCommonWord"] || {};
window["AscCommonWord"].CLaTeXParser = CLaTeXParser;
window["AscCommonWord"].CLaTeXLexer = CLaTeXLexer;
window["AscCommonWord"].CUnicodeParser = CUnicodeParser;
