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

function EquationProcessing(Parent) {
	this.Parent = Parent;
	this.IndexesOfIgnoredAtoms = {};
	this.type = this.CheckTypeOfParent();
};
EquationProcessing.prototype.ParserData = [
	"+", "^", "√", "&", "_", "-", "┴", "*", "(", ")",
	"{", "}", "&", "▒", "┬", "[", "]", "┤", "├", "〖", "〗",
	"┴", 'tan', '¦', 'mod'
];
EquationProcessing.prototype.Parse = function() {
	var strTempWord = "";
	var str = this.Parent.str;
	var arrAtoms = [];

	for (var i = 0; i <= str.length; i++) {
		
		if (this.type === 'Unicode') {
			if (str[i+1] == '〖' || str[i+1] == '〗') {
				if (str[i].charCodeAt() == 8289) {
					i++;
				}
			}
		}
		
		if (str[i] !== undefined) {
			strTempWord += str[i];
		}

		if (this.type === 'LaTeX') {
			if (strTempWord == '^' && str[i+1] != '{') {
				strTempWord = "";
				arrAtoms.push('^');
				arrAtoms.push('{');
				i++;
				arrAtoms.push(str[i].trim());
				arrAtoms.push('}');
			}
	
			else if (strTempWord == '_' && str[i+1] != '{') {
				strTempWord = ""
				arrAtoms.push('_');
				arrAtoms.push('{');
				i++;
				arrAtoms.push(str[i].trim());
				arrAtoms.push('}');
			}
		}
		
		if (this.ParserData.includes(str[i + 1]) || this.ParserData.includes(strTempWord) || str[i+1] == '//') {
			arrAtoms.push(strTempWord.trim());
			strTempWord = "";
		}
	}
	arrAtoms.push(strTempWord.trim());

	this.Parent.arrAtoms = arrAtoms.filter(Boolean);
	console.log(this.Parent.arrAtoms, this.type);
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

	if (Obj.symbol == '^' || Obj.symbol == '_') {
		Obj.Script.push(Obj.symbol);

		//скобка или символы
		Obj.symbol = this.GetAtomByIndex(Obj.index);
		Obj.Script.push(Obj.symbol == '(' || Obj.symbol == '{' ? '(' : '1');
		Obj.symbol = false;
		
		//Скобка с данными
		if (Obj.Script[Obj.Script.length - 1] == '(') {
			Obj.symbol = this.CheckAfterBracet(Obj);
		} else {
			Obj.index++;
			Obj.symbol = this.GetAtomByIndex(Obj.index);
		}
		
		//После скобки новый элемент
		if (Obj.symbol!==false && Obj.symbol!== undefined && Obj.Script[0] == '^' ? (Obj.symbol == '_') : (Obj.symbol == '^')) {
			Obj.Script.push(Obj.symbol);
			//скобка или элемент
			Obj.symbol = this.GetFutureAtom(Obj.index + 1);
			Obj.Script.push(Obj.symbol == '(' || Obj.symbol == '{' ? '(' : '1');
		}
	}
	return Obj.Script;
};
//replace names of variables!
EquationProcessing.prototype.CheckAfterBracet = function(Obj) {
	var one = this.GetAtomByIndex(Obj.index);

	var tempIndex = Obj.index;
	var strOpenBracet;
	var strCloseBracet;

	if (one == '(') {
		strOpenBracet = '(';
		strCloseBracet = ')'
	}
	else if (one == '{') {
		strOpenBracet = '{';
		strCloseBracet = '}'
	}

	if (one == strOpenBracet) {
		var atom;
		var ind = 1;

		do {
			atom = this.GetAtomByIndex(Obj.index);
			if (atom == strOpenBracet && tempIndex != Obj.index) {
				ind++;
			}
			Obj.index++;

			if (atom == strCloseBracet) {
				ind--;
			}
		} while (!(ind == 0 && atom == strCloseBracet));

		if (atom == strCloseBracet) {
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
	if(strTempAtom == '_' || strTempAtom == '^') {
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

	if (strAtom == '^' || strAtom == '_') {
		strAtom = this.GetNextAtom();
	}

	if (indexOfExit === undefined ) {
		indexOfExit = this.CheckCloseBracet();
	}

	if (indexOfExit) {
		if (this.type === 'LaTeX') {
			CLaTeXLexer(this.Parent, context, indexOfExit);
		}
		else if (this.type === 'Unicode') {
			CUnicodeLexer(this.Parent, context, indexOfExit);
		}
	}
	else {
		if (this.type === 'LaTeX') {
			CLaTeXLexer(this.Parent, context);
		}
		else if (this.type === 'Unicode') {
			CUnicodeLexer(this.Parent, context);
		}
		
	}
};
//Script 
//todo: prescript
//		script for bracet block
EquationProcessing.prototype.AddScript = function(strAtom, FormArgument) {
	var type = this.GetTypeOfScript();
	var Script = this.CreateScript(FormArgument, type);
	this.FillScriptBase(Script, strAtom, type);
};
EquationProcessing.prototype.GetTypeANDScript = function(type) {
	if (type[0] == '^' && type[2] == '_') {
		return 'SUP_SUB'
	}
	else if (type[0] == '_' && type[2] == '^') {
		return 'SUB_SUP'
	}
};
EquationProcessing.prototype.GetTypeOrScript = function(type) {
	if (type[0] == '^') {
		return 'DEGREE_SUPERSCRIPT'
	}
	else if (type[0] == '_') {
		return 'DEGREE_SUBSCRIPT'
	}
};
EquationProcessing.prototype.GetTypeOfScript = function() {
	var type = this.BracetSyntaxChecker(this.Parent.intIndexArray);

	if (type.length == 2) {
		return this.GetTypeOrScript(type);
	}
	else if (type.length == 4) {
		return this.GetTypeANDScript(type);
	}
};
EquationProcessing.prototype.CreateScript = function(FormArgument, type) {
	var Pr = {};
	var isBothDegreeAndIndex = false;

	if (type == 'DEGREE_SUPERSCRIPT' || type == 'DEGREE_SUBSCRIPT') {
		Pr.type = this.GetTypeOfIndexLimit[type];
	}
	
	else if (type == 'SUB_SUP' || type == 'SUP_SUB') {
		isBothDegreeAndIndex = true;
		Pr.type = 1;
	}
	else if (type == -1) {
		isBothDegreeAndIndex = true;
		Pr.type = -1;
	}

	var Script = FormArgument.Add_Script(isBothDegreeAndIndex, Pr, null, null, null);
	return Script;
};
EquationProcessing.prototype.FillScriptBase = function(Script, name, typeOfScript) {
	Script.getBase().Add_Text(name, this.Parent.ParaMath.Paragraph);
	this.FillScriptContent(Script, typeOfScript);
};
EquationProcessing.prototype.FillScriptContent = function(Script, typeOfScript) {
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
EquationProcessing.prototype.FillScriptContentWriteSup = function(Script) {
	var Iterator = Script.getUpperIterator();

	if (this.StartBracet[this.GetFutureAtom(2)]) {
		this.AddBracetBlockToIgnor();
		this.StartLexer(Iterator);
	}
	else {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2, true);
		this.StartLexer(Iterator, this.Parent.intIndexArray + 2);
	}
};
EquationProcessing.prototype.FillScriptContentWriteSub = function(Script) {
	var Iterator = Script.getLowerIterator();
	
	if (this.StartBracet[this.GetFutureAtom(2)]) {
		this.AddBracetBlockToIgnor();
		this.StartLexer(Iterator);
	} else {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2, true);
		this.StartLexer(Iterator, this.Parent.intIndexArray + 2);
	}
};
EquationProcessing.prototype.CheckSubOrSup = function() {
	var strTempAtom = this.GetFutureAtom(1);
	if(strTempAtom == "_" || strTempAtom == '^') {
		var index = this.CheckCloseBracet(this.Parent.intIndexArray + 2);
		if (index === false) {
			if (this.GetFutureAtom(2)) {
				return true
			}
		}
		return typeof index === 'number';
		// add a_b & i^2
	}
};
EquationProcessing.prototype.CheckSubAndSup = function() {
	var symbol;
	var strNow = this.GetFutureAtom(1);

	if(strNow == "_" || strNow == '^') {
		if (strNow == "_") {
			symbol = '^';
			var index = this.CheckCloseBracet(this.Parent.intIndexArray + 2);
		}
		if (strNow == "^") {
			symbol = '_';
			var index = this.CheckCloseBracet(this.Parent.intIndexArray + 2);
		}

		if (symbol !== undefined) {
			strNow = this.Parent.arrAtoms[index + 1];
			var index = this.CheckCloseBracet(index + 2);
		}
		
		return typeof index === 'number';
		// add a_b & i^2
	}
};
//PreScript
EquationProcessing.prototype.AddPreScript = function(FormArgument) {
	var Script = this.CreateScript(FormArgument, -1);
	this.FillScriptPreScript(Script);
};
EquationProcessing.prototype.FillScriptPreScript = function(Script) {

	this.Parent.intIndexArray--;
	var type = this.GetTypeOfScript();
	
	if (type == 'SUB_SUP') {
		this.FillScriptContentWriteSub(Script);
		this.FillScriptContentWriteSup(Script);
	}
	else if (type == 'SUP_SUB') {
		this.FillScriptContentWriteSup(Script);
		this.FillScriptContentWriteSub(Script);
	}
	if (this.type === 'Unicode') {
		this.Parent.intIndexArray++;
	}

	if (this.StartBracet[this.GetFutureAtom(1)]) {
		var exit = this.AddBracetBlockToIgnor();
		this.StartLexer(Script.getBase(), exit);
	} else {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 1, true);
		this.StartLexer(Script.getBase(), this.Parent.intIndexArray + 1);
	}
};
EquationProcessing.prototype.CheckPreScript = function() {
	var n;
	this.type === 'Unicode'
		? n = this.Parent.intIndexArray + 1
		: n = this.Parent.intIndexArray;

	var symbol;
	var strNow = this.Parent.arrAtoms[n];

	if(strNow == "_" || strNow == '^') {
		if (strNow == "_") {
			symbol = '^';
			if (this.StartBracet[this.Parent.arrAtoms[n+1]]) {
				var index = this.CheckCloseBracet(n + 1);
			} else {
				index = false
			}
		}
		if (strNow == "^") {
			symbol = '_';
			if (this.StartBracet[this.Parent.arrAtoms[n+1]]) {
				var index = this.CheckCloseBracet(n + 1);
			} else {
				index = false
			}
		}
		if (symbol !== undefined) {
			if (index !== false) {
				strNow = this.Parent.arrAtoms[index];
				var index = this.CheckCloseBracet(index + 1);
			}
			else {
				var tempIndex = n + 1;
				var index = this.CheckCloseBracet(tempIndex + 1);
				if (index === false) {
					index = tempIndex + 1
				}
			}
		}
		return typeof index === 'number';
	}
};
//Function
EquationProcessing.prototype.AddFunction = function (FormArgument, strAtom) {
	if (this.type === 'LaTeX') {
		strAtom = strAtom.slice(1);
	}

	var typeOfFunction = this.GetTypeOfFunction[strAtom];
	var Function = this.CreateFunction(FormArgument)
	
	//sin, cos, tan and etc.
	if (typeOfFunction === 1) {
		var isDegreeOrIndex = this.CheckSubOrSup();
		var isDegreeAndIndex = this.CheckSubAndSup();

		if (isDegreeAndIndex || isDegreeOrIndex) {
			this.AddScript(Function.getFName(), strAtom, isDegreeOrIndex, isDegreeAndIndex);
			this.StartLexer(Function.getArgument());
		}
		else {
			Function.getFName().Add_Text(strAtom, this.Parent.Paragraph);
			
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
//Bracet
EquationProcessing.prototype.CheckCloseBracet = function(index) {
	var intPatternIndex = 0;
	var arrOfData = this.Parent.arrAtoms;
	var intTempIndex = index !== undefined ? index : this.Parent.intIndexArray;

	while (intTempIndex < arrOfData.length) {
	
		if (this.StartBracet[arrOfData[intTempIndex]]) {
			if (arrOfData[intTempIndex] == '\\left' || arrOfData[intTempIndex] == '\\open') {
				intTempIndex++;
			}
			intPatternIndex++;
		}

		else if (this.CloseBracet[arrOfData[intTempIndex]]) {
			if (arrOfData[intTempIndex] == '\\right' || arrOfData[intTempIndex] == '\\close') {
				intTempIndex++;
			}
			intPatternIndex--;
		}

		if (this.CloseBracet[arrOfData[intTempIndex]] && intPatternIndex == 0) {
			return intTempIndex;
		}

		intTempIndex++;
	}
	return false;
};
EquationProcessing.prototype.CheckIsBrackets = function (strAtom) {
	if (strAtom == "(" || 
		strAtom == "[" ||
		strAtom == "{" ||
		strAtom == "├"
		) {
		return true;
	}
	
	return false;
};
EquationProcessing.prototype.AddBracet = function(FormArgument) {
	var BracetBlockData = {};

	BracetBlockData.intIndexStartBracet = this.Parent.intIndexArray;
	BracetBlockData.intIndexCloseBracet = this.CheckCloseBracet(BracetBlockData.intIndexStartBracet);
	
	this.GetBracet(BracetBlockData, 0);
	this.GetBracet(BracetBlockData, 1);
	
	if (BracetBlockData.strStartBracet == '.') {
		BracetBlockData.strStartBracet = -1;
	}
	if (BracetBlockData.strCloseBracet == '.') {
		BracetBlockData.strCloseBracet = -1;
	}

	if (BracetBlockData.strStartBracet == '(') {
		BracetBlockData.strStartBracet = null;
	}
	if (BracetBlockData.strCloseBracet == ')') {
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
	type = (type == 0)
		? 'StartBracet'
		: 'CloseBracet';

	var strBracet = this.GetAtomByIndex(Obj['intIndex' + type])

	if (strBracet == '├' || strBracet == '┤') {
		Obj['intIndex' + type] = Obj['intIndex' + type] + 1;
		Obj['str' + type] = this.GetAtomByIndex(Obj['intIndex' + type]);
		this.Parent.intIndexArray++;
	}
	else if (strBracet == '\\left' || strBracet == '\\right') {
		Obj['intIndex' + type] = Obj['intIndex' + type] + 1;
		Obj['str' + type] = this.GetAtomByIndex(Obj['intIndex' + type]);
		this.Parent.intIndexArray++;
	}
	else if (strBracet == '\\open' || strBracet == '\\close') {
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
		new  CTextPr(),
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
	var checkIsFrac = function(str) {
		if (str == '\\frac' ||
			str == '\\sfrac' ||
			str == '\\dfrac' ||
			str == '\\cfrac' ||
			str == '\\sdiv' ||
			str == '\\ldiv' ||
			str == '\\ndiv'
		) {
			return true;
		} else {
			return false
		}
	}

	var checkUnicodeFrac = function(str) {
		if (str.charCodeAt() == 47 ||   //sdiv
			str.charCodeAt() == 8260 || //sdiv
			str.charCodeAt() == 8725 || //ldiv
			str.charCodeAt() == 8856 || //ndiv
			str == '\/'
		) {
			return true;
		} else {
			return false;
		}
	}
	
	var isFrac = checkIsFrac(this.GetAtomByIndex(this.Parent.intIndexArray - 1));
	var indexOfCLose = this.CheckCloseBracet();

	if (isFrac) {
		
	} else if (checkUnicodeFrac(this.Parent.arrAtoms[indexOfCLose + 1])) {
		console.log('a \ b ...')
		console.log(checkUnicodeFrac(this.Parent.arrAtoms[indexOfCLose + 1]), this.Parent.arrAtoms[indexOfCLose + 1])
	}
	else {
		console.log('nope')
	}
	
	
	//two type of syntaxis:
	//
	//	1.	a/b		a∕b		a⊘c
	//	2.	/sdiv(a)(b)		/ldiv(a)(b)		/ndiv(a)(b)
	//	3. \frac{}{} \sfrac{}{} \cfrac{}{} ...
	//
	//sdiv standart
	//ldiv skewed
	//ndiv inline

};
EquationProcessing.prototype.CheckIsUnicodeSmallFrac = function(str) {
	if (this.UnicodeSmallFrac[str.charCodeAt()] === true) {
		return true;
	} else {
		return false
	}
};
EquationProcessing.prototype.UnicodeSmallFrac = {
	47: true,
	8260: true,
	8725: true,
	8856: true,
	'\/': true
};
EquationProcessing.prototype.CheckIsLaTeXFullFrac = function(str) {
	if (this.LaTeXFullFrac[str] === true) {
		return true;
	} else {
		return false
	}
};
EquationProcessing.prototype.LaTeXFullFrac = {
	'\\frac': true,
	'\\sfrac': true,
	'\\cfrac': true,
	'\\nicefrac': true
};
EquationProcessing.prototype.CheckIsFrac = function() {
	var isFrac;

	if (this.type === 'LaTeX') {
		isFrac = this.CheckIsLaTeXFullFrac(this.GetNowAtom());

		if (isFrac === false) {
			return false;
		}
		return true;
	}

	else if (this.type === 'Unicode') {
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
EquationProcessing.prototype.CheckTypeOfParent = function() {
	if (this.Parent instanceof CLaTeXParser) {
		return 'LaTeX'
	} else if (this.Parent instanceof CUnicodeParser) {
		return 'Unicode'
	}
};
EquationProcessing.prototype.AddFraction = function(FormArgument, strAtom) {
	var typeOfFraction;

	if (this.type === 'LaTeX') {
		typeOfFraction = this.GetTypeOfFrac[strAtom];
		//var isInlineFraction = this.CheckSyntaxSequence(["^", 1, "/", "_", 1], null, true);
	}
	else if (this.type === 'Unicode') {
		var exitIndex = this.CheckCloseBracet();
		this.AddIndexToIgnor(exitIndex)
		typeOfFraction = this.GetTypeOfFrac[this.Parent.arrAtoms[exitIndex + 1]];
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
	if (this.type === 'LaTeX') {
		this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent());
		this.AddBracetBlockToIgnor();
		this.Parent.intIndexArray++;
		this.StartLexer(FormArgument.getDenominatorMathContent());
	}
	else if (this.type === 'Unicode') {
		this.Parent.intIndexArray--;
		this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getNumeratorMathContent());
		this.Parent.intIndexArray++;
		this.AddBracetBlockToIgnor();
		this.StartLexer(FormArgument.getDenominatorMathContent());
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
//Limit
EquationProcessing.prototype.AddLimit = function (FormArgument, strAtom) {
	var typeOfBottom;

	if (this.type === 'Unicode') {
		var strTempSymbol = this.Parent.arrAtoms[this.Parent.intIndexArray + 1].charCodeAt();
		
		// lim_(n→∞) a_n === lim┬(n→∞) a_n
		if (strTempSymbol == 9524 || strTempSymbol == 94) {
			this.Parent.intIndexArray++;
			typeOfBottom = '^';
		} else if (strTempSymbol == 9516 || strTempSymbol == 95) {
			this.Parent.intIndexArray++;
			typeOfBottom = '_';
		}
		typeOfBottom = this.GetTypeOrScript([typeOfBottom]);
	}
	else if (this.type === 'LaTeX') {
		typeOfBottom = this.BracetSyntaxChecker(this.Parent.intIndexArray);
		if (typeOfBottom.length == 2) {
			typeOfBottom = this.GetTypeOrScript(typeOfBottom);
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
	if (typeOfRadical == SQUARE_RADICAL) {
		Pr.degHide = true;
	}
	else if (typeOfRadical == DEGREE_RADICAL) {
		Pr.degHide = false;
	}

	var Radical = FormArgument.Add_Radical(Pr, null, null);
	return Radical
};
EquationProcessing.prototype.GetTypeOfRadical = function () {
	var indexOfExit = this.AddBracetBlockToIgnor();
	
	if (this.type === 'LaTeX') {
		
		if (this.GetFutureAtom() == '[') {
			return DEGREE_RADICAL;
		} else {
			return SQUARE_RADICAL;
		}
	}
	else if (this.type === 'Unicode') {
		
		var strSeparator = this.SearchAtom('&', indexOfExit);
		if (strSeparator) {
			return DEGREE_RADICAL;
		}
		return SQUARE_RADICAL;
	}

};
EquationProcessing.prototype.FillRadicalContent = function (Radical) {
	if (this.type === 'LaTeX') {
		if (this.GetFutureAtom() == '[') {
			this.StartLexer(Radical.getDegree());
		}
		
		if (this.GetFutureAtom() == '{') {
			this.AddBracetBlockToIgnor();
			this.StartLexer(Radical.getBase());
		}
	}
	else if (this.type === 'Unicode') {
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
//Large Operator: add limits
EquationProcessing.prototype.AddLargeOperator = function (FormArgument, strAtom) {
	var strNameOfLargeOperator;

	if (this.type === 'LaTeX') {
		strAtom = strAtom.slice(1);
		strNameOfLargeOperator = this.CheckIsLargeOperator[strAtom];
	}
	else if (this.type === 'Unicode') {
		var code = strAtom.charCodeAt();
		if (this.UnicodeLargeOperator[code]) {
			strNameOfLargeOperator = code;
		}
	}

	var intTypeOFLoc = 1;
	// if (this.Parent.arrAtoms[this.Parent.intIndexArray + 1] == "\\limits") {
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
	else if (this.CheckSubOrSup()) {
		if (this.GetFutureAtom() == '^') {
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
EquationProcessing.prototype.FillLargeOperatorContent = function(LargeOperator) {
	var strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];
	
	if (strTempAtom == "^") {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
		this.StartLexer(LargeOperator.getSupMathContent());
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom == "_") {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
			this.StartLexer(LargeOperator.getSubMathContent());
		}
	}
	else if (strTempAtom == "_") {
		this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
		this.StartLexer(LargeOperator.getSubMathContent());
		strTempAtom = this.Parent.arrAtoms[this.Parent.intIndexArray + 1];

		if (strTempAtom == "^") {
			this.AddIndexToIgnor(this.Parent.intIndexArray + 2);
			this.StartLexer(LargeOperator.getSupMathContent());
		}
	}

	if (this.type === 'Unicode') {
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
	
	if (this.type === 'Unicode') {
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
		index = undefined;
		
		if (this.StartBracet[this.Parent.arrAtoms[index+2]]) {
			index = this.CheckCloseBracet(this.Parent.intIndexArray+2);
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

	if (this.type === 'LaTeX') {
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
						ctrPrp: this.Parent.Pr.ctrPrp,
						chr: 9182,
						pos: VJUST_TOP,
						vertJc: VJUST_BOT,
					},
					null
				);
			}

			if (name == "\\underbrace") {
				Accent = FormArgument.Add_GroupCharacter(
					this.Parent.Pr,
					null
				);
			}
		}

		else {
			Accent = FormArgument.Add_Accent(
				this.Parent.Pr.ctrPrp,
				GetAccent[name],
				null
			);
		}
	}

	else if (this.type === 'Unicode') {
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
	
	if (this.type === 'Unicode') {
		this.Parent.intIndexArray++;
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
EquationProcessing.prototype.CheckIsAccent = function (strAtom) {
	if (this.type === 'LaTeX') {
		return (
			GetAccent[strAtom] ||
			GetIsAddBar[strAtom] ||
			GetIsAddGroupChar[strAtom]
		);
	}
	else if (this.type === 'Unicode') {
		if (this.StartBracet[this.GetNowAtom()]) {
			var intCloseExitBracet = this.CheckCloseBracet(this.Parent.intIndexArray);
			if (typeof intCloseExitBracet === 'number') {
				var accent = GetAccent[this.GetAtomByIndex(intCloseExitBracet + 1).charCodeAt()];
				if (accent) {
					this.accent = this.GetAtomByIndex(intCloseExitBracet + 1).charCodeAt();
				return true;
				}
			}
		}
		return false;
	}
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
	"\\tilde": 771,
	771 : "\\widetilde",
	770 : "\\widehat",
	8407: "\\overrightarrow",
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
	771 : "\\tilde"
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
};


function CLaTeXParser(props, str) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = {ctrPrp: new CTextPr()};
	this.ParaMath = props;
	this.isError = false;
	this.isInMatrix = false;
	this.Processing;
};
CLaTeXParser.prototype.prepare = function() {
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
	"": 0x203c,
	".": 0x2026,
	"": 0x2237,
	"": 0x2254,
	"": 0x226e,
	"": 0x226f,
	"": 0x2260,
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
	"zwsp": 0x200b
}
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
			var strAtom = this.GetNextAtom();
		} while (strAtom != '}');
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
CLaTeXParser.prototype.AddSymbol = function (strAtom, FormArgument, type, typeText) {

	if (this.Processing.GetFutureAtom() == '\\' && !this.isInMatrix) {
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
		this.GetNextAtom()
	}

	else {
	
		if (type) {
			this.Pr['scr'] = type;
			FormArgument.Add_Symbol(strAtom.charCodeAt(0), typeText, this.Pr);
		}

		var strCode = this.arrLaTeXSymbols[strAtom];
		if (strCode) {
			FormArgument.Add_Symbol(strCode, this.Pr);
		}

		else if (strAtom.length > 1) {
			FormArgument.Add_Text(strAtom, this.ParaMath.Paragraph);
		}
		else {
			FormArgument.Add_Symbol(strAtom.charCodeAt(0), this.Pr);
		}
	}
};
CLaTeXParser.prototype.CheckIsText = function (strAtom) {
	if (GetBracetCode[strAtom]) {
		return false;
	}

	else if (
		strAtom == "matrix" &&
		strAtom == "\\left" &&
		strAtom == "\\right" &&
		strAtom != undefined &&
		strAtom != '(' &&
		strAtom != ')' 
	) {
		return false
	}

	return true
};
CLaTeXParser.prototype.AddMathText = function(FormArgument, strAtom) {
	var type = CheckMathText[strAtom];
	var objSty = CheckMathTextSty[strAtom];

	var strAtom = this.GetNextAtom();

	do {
		strAtom = this.GetNextAtom();
		
		if (strAtom != '{' && strAtom != '}') {

			if (strAtom.length == 1) {
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
function CLaTeXLexer(Parser, FormArgument, indexOfCloseAtom) {
	var strAtom;
	var isDontWrite = function(index) {
		if (Parser.Processing.IndexesOfIgnoredAtoms[index] == false) {
			strAtom = Parser.Processing.GetNextAtom();
			
			if (strAtom !== undefined) {
				isDontWrite(index + 1);
			}
		}
	}
	do {
		strAtom = Parser.Processing.GetNextAtom();
		if (indexOfCloseAtom == Parser.intIndexArray || strAtom === undefined) {
			if(Parser.Processing.IndexesOfIgnoredAtoms[Parser.intIndexArray] == true) {
				Parser.AddSymbol(strAtom, FormArgument);
			}
			return
		};
		isDontWrite(Parser.intIndexArray);

		if (Parser.Processing.GetTypeOfFunction[strAtom.slice(1)] != null) {
			Parser.Processing.AddFunction(FormArgument, strAtom);
		}
		else if (Parser.Processing.CheckIsFrac() && !Parser.isError) {
			Parser.Processing.AddFraction(FormArgument, strAtom)
		}
		else if (strAtom == "\\sqrt" && !Parser.isError) {
			Parser.Processing.AddRadical(FormArgument);
		}
		else if (Parser.Processing.CheckIsLargeOperator[strAtom.slice(1)] && !Parser.isError) {
			Parser.Processing.AddLargeOperator(FormArgument, strAtom);
		}
		else if (Parser.Processing.CheckSubOrSup() || Parser.Processing.CheckSubAndSup() && !Parser.isError) {
			Parser.Processing.AddScript(strAtom, FormArgument);
		}
		else if (Parser.Processing.CheckPreScript()) {
			Parser.Processing.AddPreScript(FormArgument, strAtom);
		}
		else if (Parser.Processing.StartBracet[strAtom] && !Parser.isError) {
			Parser.Processing.AddBracet(FormArgument);
		}
		else if (strAtom == "\\pmod" && !Parser.isError) {
			Parser.Processing.AddPMod(FormArgument);
		}
		else if (strAtom == "\\binom") {
			Parser.Processing.AddBinom(FormArgument);
		}
		else if (Parser.Processing.CheckIsAccent(strAtom) && !Parser.isError) {
			Parser.Processing.AddAccent(FormArgument, strAtom);
		}
		// else if (typeof CheckMathText[strAtom] == 'number' && !Parser.isError) {
		// 	Parser.AddMathText(FormArgument, strAtom);
		// }
		else if (!Parser.isError && strAtom !== undefined) {
			Parser.AddSymbol(strAtom, FormArgument);
		}


		// else if (Parser.CheckFutureAtom() == '\\' && !Parser.isInMatrix) {
		// 	Parser.AddSymbol(strAtom, FormArgument)
		// }
		// else if (strAtom == "\\bmod" && !Parser.isError) {
		// 	FormArgument.Add_Box(Parser.Pr, "mod")
		// }
		// else if (Parser.CheckIsMatrix() && !Parser.isError) {
		// 	Parser.AddMatrix(FormArgument);
		// }
		//Parser.CheckIsText(strAtom)
	} while (strAtom != undefined);
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
	this.unicode;
	this.unicodeArr = [];
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
					else if(CName == 'CLimit') {
						data = {
							type: content.Pr.type
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
			? '\\left(' 
			: '\\left' + String.fromCharCode(obj[name].data.begOper);

		var strRight =  (obj[name].data.endOper == null) 
			? '\\right)'
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

	var strCodeOfIndexText = objIndex['0_ParaRun'] ? objIndex['0_ParaRun']['0_CMathText'].CMathText : '1';
	var strCodeOfDegreeText = objDegree['0_ParaRun']? objDegree['0_ParaRun']['0_CMathText'].CMathText : '1';

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
	var objDegree = this.GetNamesOfObject(obj[name]);
	var LimitType = obj[name].data.type;

	if (LimitType === 0) {
		this.Convert(obj[name][objDegree[0]], null, '_{');
	}
	else if (LimitType === 1) {
		this.Convert(obj[name][objDegree[0]], null, '^{');
	}

	this.Convert(obj[name][objDegree[1]], '', '}');
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

function CUnicodeParser(str, props) {
	this.str = str;
	this.intIndexArray = -1;
	this.arrAtoms = [];
	this.Pr = {ctrPrp: new CTextPr()};
	this.ParaMath = props;
	this.Processing;
};
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
	do {
		var strAtom = Parser.Processing.GetNextAtom();
		if (indexOfCloseBracet == Parser.intIndexArray) {
			if(Parser.Processing.IndexesOfIgnoredAtoms[Parser.intIndexArray] == true) {
				FormArgument.Add_Text(strAtom, Parser.Paragraph);
			}
			return;
		}
		else if(Parser.Processing.IndexesOfIgnoredAtoms[Parser.intIndexArray] == false) {
			strAtom = Parser.Processing.GetNextAtom();
		}
		if (strAtom === undefined) {
			return;
		}
		else if (Parser.Processing.CheckIsFrac() && Parser.Processing.StartBracet[strAtom]) {
			Parser.Processing.AddFraction(FormArgument, strAtom);
		}
		else if (Parser.Processing.GetTypeOfFunction[strAtom] != null) {
			Parser.Processing.AddFunction(FormArgument, strAtom);
		}
		else if (Parser.Processing.UnicodeLargeOperator[strAtom.charCodeAt()]) {
			Parser.Processing.AddLargeOperator(FormArgument, strAtom)
		}
		else if (Parser.Processing.CheckSubOrSup() || Parser.Processing.CheckSubAndSup()) {
			Parser.Processing.AddScript(strAtom, FormArgument);
		}
		else if (Parser.Processing.CheckPreScript()) {
			Parser.intIndexArray++;
			Parser.Processing.AddPreScript(FormArgument, strAtom);
		}
		else if (strAtom.charCodeAt() === 8730) {
			Parser.Processing.AddRadical(FormArgument);
		}
		else if (Parser.Processing.CheckIsBinom()) {
			Parser.Processing.AddBinom(FormArgument);
		}
		else if (Parser.Processing.CheckIsAccent(strAtom)) {
			Parser.Processing.AddAccent(FormArgument);
		}
		else if (Parser.Processing.CheckIsBrackets(strAtom)) {
			Parser.Processing.AddBracet(FormArgument);
		}
		else {
			FormArgument.Add_Text(strAtom, Parser.Paragraph);
		}
	} while (strAtom != undefined);
};

//--------------------------------------------------------export----------------------------------------------------
window["AscCommonWord"] = window["AscCommonWord"] || {};
window["AscCommonWord"].CLaTeXParser = CLaTeXParser;
window["AscCommonWord"].CLaTeXLexer = CLaTeXLexer;
window["AscCommonWord"].CUnicodeParser = CUnicodeParser;
