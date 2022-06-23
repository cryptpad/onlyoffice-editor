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
//Since (La)TeX isn't context-free
//LaTeX have 2 modes: text and math(spaces are ignored)

(function (window) {
	const num = 1;//needs for debug, default value: 0

	const oLiteralNames = window.AscCommonWord.oNamesOfLiterals;
	const ConvertTokens = window.AscCommonWord.ConvertTokens;
	const Tokenizer = window.AscCommonWord.Tokenizer;
	const LimitFunctions = window.AscCommonWord.LimitFunctions;
	const FunctionNames = window.AscCommonWord.functionNames;
	const GetTypeFont = window.AscCommonWord.GetTypeFont;
	const GetMathFontChar = window.AscCommonWord.GetMathFontChar;

	function CLaTeXParser() {
		this.oTokenizer = new Tokenizer(true);
		this.intMathFontType = -1;
		this.isWaitCloseBracket = false;
		this.isReceiveOneTokenAtTime = false;
		this.oPrevLookahead = {};
		this.isPrevBracket = false;
	}

	CLaTeXParser.prototype.ReadTokensWhileEnd = function (arrTypeOfLiteral, isSpecial) {
		let arrLiterals = [];
		let isOne = this.isReceiveOneTokenAtTime;

		if (isOne) {
			let strValue = this.EatToken(arrTypeOfLiteral[0]).data;

			let oLiteral = {
				type: arrTypeOfLiteral[num],
				value: this.intMathFontType === -1
					? strValue
					: GetMathFontChar[strValue][this.intMathFontType],
			};
			arrLiterals.push(oLiteral);
		}
		else {
			let strLiteral = "";
			while (this.oLookahead.class === arrTypeOfLiteral[0]) {
				strLiteral += this.EatToken(arrTypeOfLiteral[0]).data;
			}
			arrLiterals.push({
				type: arrTypeOfLiteral[num],
				value: strLiteral,
			})
		}
		return this.GetContentOfLiteral(arrLiterals);
	};

	CLaTeXParser.prototype.SaveState = function () {
		this.oTokenizer.SaveState();
	}
	CLaTeXParser.prototype.RestoreState = function () {
		this.oTokenizer.RestoreState();
		this.oLookahead = this.oTokenizer.GetNextToken()
		this.oPrevLookahead = undefined;
	}
	CLaTeXParser.prototype.Parse = function (string) {
		this.oTokenizer.Init(string);
		this.oLookahead = this.oTokenizer.GetNextToken();
		return this.GetASTTree();
	};
	CLaTeXParser.prototype.GetASTTree = function () {
		return {
			type: "LaTeXEquation",
			body: this.GetExpressionLiteral(),
		};
	};
	CLaTeXParser.prototype.GetCharLiteral = function () {
		return this.ReadTokensWhileEnd(oLiteralNames.charLiteral)
	};
	CLaTeXParser.prototype.GetSpaceLiteral = function () {
		return this.ReadTokensWhileEnd(oLiteralNames.spaceLiteral);
	};
	CLaTeXParser.prototype.GetNumberLiteral = function () {
		let strDecimal,
			oRightNumber,
		    oLeftNumber = this.ReadTokensWhileEnd(oLiteralNames.numberLiteral);

		this.SaveState();
		if (this.oLookahead.class === oLiteralNames.opDecimal[0]) {
			strDecimal = this.EatToken(this.oLookahead.class).data;
			if (this.oLookahead.class === oLiteralNames.numberLiteral[0]) {
				oRightNumber = this.ReadTokensWhileEnd(oLiteralNames.numberLiteral);
				return {
					type: oLiteralNames.numberLiteral[0],
					value: strDecimal,
					left: oLeftNumber,
					right: oRightNumber,
				}
			} else {
				this.RestoreState();
			}
		}
		return oLeftNumber;
	};
	CLaTeXParser.prototype.GetOperatorLiteral = function () {
		const strToken = this.EatToken(oLiteralNames.operatorLiteral[0]);
		return {
			type: oLiteralNames.operatorLiteral[num],
			value: strToken.data,
		};
	}
	CLaTeXParser.prototype.IsAccentLiteral = function () {
		return this.oLookahead.class === oLiteralNames.accentLiteral[0];
	};
	CLaTeXParser.prototype.GetAccentLiteral = function (oBase) {
		let strAccent, oResultAccent;
		if (this.oLookahead.data === "'" || this.oLookahead.data === "''") {
			strAccent = this.EatToken(this.oLookahead.class).data;
			oResultAccent = {
				type: oLiteralNames.subSupLiteral[num],
				value: oBase,
				up: {
					type: oLiteralNames.charLiteral[num],
					value: strAccent,
				}
			};
		}
		else {
			strAccent = this.EatToken(this.oLookahead.class).data;
			oBase = this.GetArguments(1);
			oBase = this.GetContentOfLiteral(oBase);

			oResultAccent = {
				type: oLiteralNames.accentLiteral[1],
				base: oBase,
				value: strAccent,
			};
		}
		return oResultAccent;
	};
	CLaTeXParser.prototype.IsFractionLiteral = function () {
		return (this.oLookahead.class === "\\frac" || this.oLookahead.class === "\\binom" || this.oLookahead.class === "\\cfrac");
	};
	CLaTeXParser.prototype.GetFractionLiteral = function () {
		const isBinom = this.oLookahead.class === "\\binom";
		this.EatToken(this.oLookahead.class);
		const oResult = this.GetArguments(2);
		return {
			type: isBinom ? oLiteralNames.binomLiteral[num] : oLiteralNames.fractionLiteral[num],
			up: oResult[0],
			down: oResult[1],
		};
	};
	CLaTeXParser.prototype.IsExpBracket = function () {
		return this.isWaitCloseBracket === false && (
			this.oLookahead.class === oLiteralNames.opOpenBracket[0] ||
			this.oLookahead.class === oLiteralNames.opOpenCloseBracket[0] ||
			this.oLookahead.data === "├"
		);
	};
	CLaTeXParser.prototype.GetBracketLiteral = function () {
		let arrBracketContent, strLeftSymbol, strRightSymbol;
		if (this.oLookahead.data === "├") {
			this.EatToken(this.oLookahead.class);
			if (this.oLookahead.class === oLiteralNames.opOpenBracket[0] || this.oLookahead.data === "." || this.oLookahead.class === oLiteralNames.opOpenCloseBracket[0]) {
				strLeftSymbol = this.EatToken(this.oLookahead.class).data;
			}
			this.isWaitCloseBracket = true;
			arrBracketContent = this.GetExpressionLiteral();
			if (this.oLookahead.data === "┤") {
				this.EatToken("┤");
				this.isWaitCloseBracket = false;
				if (this.oLookahead.class === oLiteralNames.opCloseBracket[0] || this.oLookahead.data === "." || this.oLookahead.class === oLiteralNames.opOpenCloseBracket[0]) {
					strRightSymbol = this.EatToken(this.oLookahead.class).data;
				}
			}
		}
		else if (this.oLookahead.class === oLiteralNames.opOpenBracket[0] || this.oLookahead.class === oLiteralNames.opOpenCloseBracket[0]) {
			this.SaveState();
			this.oPrevLookahead = this.EatToken(this.oLookahead.class);
			strLeftSymbol = this.oPrevLookahead.data;
			this.isWaitCloseBracket = true;
			arrBracketContent = this.GetExpressionLiteral();

			if (this.oLookahead.class === null) {
				this.RestoreState();
				this.EatToken(this.oLookahead.class)
				return {
					type: oLiteralNames.charLiteral[num],
					value: strLeftSymbol.data,
				}
			}

			if (this.oLookahead.class === oLiteralNames.opCloseBracket[0] || this.oLookahead.class === oLiteralNames.opOpenCloseBracket[0]) {
				strRightSymbol = this.EatToken(this.oLookahead.class).data;
			}
			this.isWaitCloseBracket = false;
		}
		return {
			type: oLiteralNames.bracketBlockLiteral[num],
			left: strLeftSymbol,
			right: strRightSymbol,
			value: arrBracketContent,
		};
	};
	CLaTeXParser.prototype.IsElementLiteral = function () {
		return (
			this.IsFractionLiteral() ||
			this.oLookahead.class === oLiteralNames.numberLiteral[0] ||
			this.oLookahead.class === oLiteralNames.charLiteral[0] ||
			this.oLookahead.class === oLiteralNames.spaceLiteral[0] ||
			this.IsSqrtLiteral() ||
			this.IsExpBracket() ||
			this.IsFuncLiteral() ||
			this.oLookahead.class === "\\middle" ||
			this.IsAccentLiteral() ||
			this.IsPreScript() ||
			this.IsChangeMathFont() ||
			this.oLookahead.class === "{" ||
			this.oLookahead.class === oLiteralNames.operatorLiteral[0] ||
			this.IsReactLiteral() ||
			this.IsBoxLiteral() ||
			this.oLookahead.class === oLiteralNames.opDecimal[0] ||
			this.IsMatrixLiteral() ||
			this.oLookahead.class === "\\begin{equation}" || this.oLookahead.class === "\\end{equation}"
		);
	};
	CLaTeXParser.prototype.GetElementLiteral = function () {
		if (this.IsFractionLiteral()) {
			return this.GetFractionLiteral();
		}
		else if (this.oLookahead.class === oLiteralNames.numberLiteral[0]) {
			return this.GetNumberLiteral();
		}
		else if (this.oLookahead.class === oLiteralNames.charLiteral[0]) {
			return this.GetCharLiteral();
		}
		else if (this.oLookahead.class === oLiteralNames.opDecimal[0]) {
			let strDecimalLiteral = this.EatToken(this.oLookahead.class).data;
			return {
				type: oLiteralNames.opDecimal[num],
				value: strDecimalLiteral
			}
		}
		else if (this.oLookahead.class === oLiteralNames.spaceLiteral[0]) {
			return this.GetSpaceLiteral();
		}
		else if (this.IsSqrtLiteral()) {
			return this.GetSqrtLiteral();
		}
		else if (this.IsExpBracket()) {
			return this.GetBracketLiteral();
		}
		else if (this.IsFuncLiteral()) {
			return this.GetFuncLiteral();
		}
		else if (this.oLookahead.class === "\\middle") {
			this.EatToken("\\middle");
			return {
				type: "MiddleLiteral",
				value: this.EatToken(this.oLookahead.class).data,
			};
		}
		else if (this.IsAccentLiteral()) {
			return this.GetAccentLiteral();
		}
		else if (this.IsPreScript()) {
			return this.GetPreScriptLiteral();
		}
		else if (this.IsChangeMathFont()) {
			return this.GetMathFontLiteral();
		}
		// else if (this.IsSymbolLiteral()) {
		// 	return this.GetSymbolLiteral()
		// }
		else if (this.oLookahead.data === "{") {
			return this.GetArguments(1)[0];
		}
		else if (this.oLookahead.class === oLiteralNames.operatorLiteral[0]) {
			return this.GetOperatorLiteral()
		}
		else if (this.IsReactLiteral()) {
			return this.GetRectLiteral()
		}
		else if (this.IsBoxLiteral()) {
			return this.GetBoxLiteral()
		}
		// else if (this.isArrayLiteral()) {
		// 	return arrayLiteral();
		// }
		else if (this.IsMatrixLiteral()) {
			return this.GetMatrixLiteral();
		}
		else if (this.oLookahead.class === "\\begin{equation}" || this.oLookahead.class === "\\end{equation}") {
			this.EatToken(this.oLookahead.class)
		}
	};
	CLaTeXParser.prototype.IsFuncLiteral = function () {
		return this.oLookahead.class === oLiteralNames.functionLiteral[0] || this.oLookahead.class === oLiteralNames.opNaryLiteral[0]
	};
	CLaTeXParser.prototype.GetFuncLiteral = function () {
		let oOutput;
		let oFuncContent = this.EatToken(this.oLookahead.class);
		if (this.oLookahead.class === "\\limits") {
			this.EatToken("\\limits");
		}
		let oThirdContent = !this.IsSubSup()
			? this.GetArguments(1)
			: undefined;

		let name = oFuncContent.data.slice(1)
		if (LimitFunctions.includes(name)) {
			oOutput = {
				type: oLiteralNames.functionWithLimitLiteral[num],
				value: name,
			}
		}
		else if (oFuncContent.class === oLiteralNames.opNaryLiteral[0]) {
			oOutput = {
				type: oLiteralNames.opNaryLiteral[num],
				value: oFuncContent.data,
			}
		}
		else {
			if (FunctionNames.includes(name)) {
				oFuncContent.data = name;
			}
			oOutput = {
				type: oLiteralNames.functionLiteral[num],
				value: oFuncContent.data,
			};
		}

		if (oThirdContent) {
			oOutput.third = oThirdContent;
		}
		return oOutput;
	};
	CLaTeXParser.prototype.IsReactLiteral = function () {
		return this.oLookahead.class === "\\rect"
	}
	CLaTeXParser.prototype.GetRectLiteral = function () {
		this.EatToken("\\rect");
		let oContent = this.GetArguments(1);
		return {
			type: oLiteralNames.rectLiteral[num],
			value: oContent,
		}
	}
	CLaTeXParser.prototype.IsBoxLiteral = function () {
		return this.oLookahead.class === "\\box";
	}
	CLaTeXParser.prototype.GetBoxLiteral = function () {
		this.EatToken("\\box");
		let oContent = this.GetArguments(1);
		return {
			type: oLiteralNames.boxLiteral[num],
			value: oContent,
		}
	}
	//todo if over
	//refactor
	CLaTeXParser.prototype.GetWrapperElementLiteral = function () {
		if (!this.IsSubSup() && this.oLookahead.class !== "\\over") {
			let oWrapperContent = this.GetElementLiteral();
			if (this.IsSubSup() || this.oLookahead.class === "\\limits") {
				return this.GetSubSupLiteral(oWrapperContent);
			}
			else if (this.oLookahead.class === "\\over") {
				//TODO
			}
			else if (this.oLookahead.class === oLiteralNames.accentLiteral[0]) {
				return this.GetAccentLiteral(oWrapperContent);
			}
			return oWrapperContent;
		}
	};
	CLaTeXParser.prototype.IsSubSup = function () {
		return (this.oLookahead.class === "^" || this.oLookahead.class === "_");
	};
	//refactor
	CLaTeXParser.prototype.GetSubSupLiteral = function (oBaseContent, isSingle) {
		let isLimits, oDownContent, oUpContent, oThirdContent;
		if (undefined === oBaseContent) {
			oBaseContent = this.GetElementLiteral();
		}
		if (this.oLookahead.class === "\\limits") {
			this.EatToken("\\limits");
			isLimits = true;
		}
		if (this.oLookahead.class === "_") {
			oDownContent = this.GetPartOfSupSup();
			if (this.oLookahead.class === "^" && isSingle !== true) {
				oUpContent = this.GetPartOfSupSup();
			}
			else if (oDownContent && oDownContent.down === undefined && oDownContent.base) {
				oDownContent = oDownContent.base;
			}
		}
		else if (this.oLookahead.class === "^") {
			oUpContent = this.GetPartOfSupSup();
			if (this.oLookahead.class === "_" && isSingle !== true) {
				oDownContent = this.GetPartOfSupSup();
			}
			else if (oUpContent && oUpContent.up === undefined && oUpContent.base) {
				oUpContent = oUpContent.base;
			}
		}

		if (
			oBaseContent &&
			(oBaseContent.type === oLiteralNames.functionLiteral[num] ||
			oBaseContent.type === oLiteralNames.opNaryLiteral[num] ||
			oBaseContent.type === oLiteralNames.functionWithLimitLiteral[num])
		) {
			oThirdContent = this.GetArguments(1);
		}

		let oOutput = {
			type: oLiteralNames.subSupLiteral[num],
			value: oBaseContent
		};
		if (oUpContent) {
			oOutput.up = oUpContent
		}
		if (oDownContent) {
			oOutput.down = oDownContent
		}
		if (oThirdContent) {
			oOutput.third = oThirdContent
		}
		if (isLimits) {
			oOutput.isLimits = isLimits
		}
		return oOutput;
	};
	CLaTeXParser.prototype.GetPartOfSupSup = function () {
		let strSymbol = this.oLookahead.class;
		this.EatToken(strSymbol);

		let oElement = (this.oLookahead.data === "{")
			? this.GetArguments(1)
			: this.GetElementLiteral();

		if (this.oLookahead.class === strSymbol) {
			oElement = this.GetSubSupLiteral(oElement, true);
		}
		return oElement;
	};
	CLaTeXParser.prototype.IsPreScript = function () {
		return (this.oLookahead.class === "^" || this.oLookahead.class === "_");
	};
	CLaTeXParser.prototype.GetPreScriptLiteral = function () {
		let oUpContent;
		let oDownContent;
		let oBaseContent;
		let oOutput;

		if (this.oLookahead.class === "_") {
			oDownContent = this.GetPartOfSupSup();
			if (this.oLookahead.class === "^") {
				oUpContent = this.GetPartOfSupSup();
			}
		}
		else if (this.oLookahead.class === "^") {
			oUpContent = this.GetPartOfSupSup();
			if (this.oLookahead.class === "_") {
				oDownContent = this.GetPartOfSupSup();
			}
		}

		this.SkipFreeSpace();
		oBaseContent = this.GetElementLiteral();

		oOutput = {
			type: oLiteralNames.preScriptLiteral[num],
		};
		if (oUpContent) {
			oOutput.up = oUpContent;
		}
		if (oDownContent) {
			oOutput.down = oDownContent;
		}
		if (oBaseContent) {
			oOutput.value = oBaseContent;
		}
		return oOutput;
	};
	CLaTeXParser.prototype.IsSqrtLiteral = function () {
		return this.oLookahead.class === oLiteralNames.sqrtLiteral[0];
	};
	CLaTeXParser.prototype.GetSqrtLiteral = function () {
		let oBaseContent, oIndexContent, oOutput;
		this.EatToken(oLiteralNames.sqrtLiteral[0]);
		if (this.oLookahead.data === "[") {
			this.EatToken(this.oLookahead.class);
			oIndexContent = this.GetExpressionLiteral("]");
			if (this.oLookahead.data === "]") {
				this.EatToken(this.oLookahead.class);
			}
		}
		oBaseContent = this.GetArguments(1);
		oOutput = {
			type: oLiteralNames.sqrtLiteral[num],
			value: oBaseContent,
		};
		if (oIndexContent) {
			oOutput.index = oIndexContent;
		}
		return oOutput;
	};
	CLaTeXParser.prototype.IsChangeMathFont = function () {
		return this.oLookahead.class === oLiteralNames.mathFontLiteral[0]
	}
	CLaTeXParser.prototype.GetMathFontLiteral = function () {
		let intPrevType = this.intMathFontType;
		this.intMathFontType = GetTypeFont[this.oLookahead.data];

		if (this.oLookahead.data !== "{") {
			this.isReceiveOneTokenAtTime = true;
		}

		this.EatToken(this.oLookahead.class)
		let oOutput = {
			type: oLiteralNames.mathFontLiteral[num],
			value: this.GetArguments(1)
		};
		this.isReceiveOneTokenAtTime = false;
		this.intMathFontType = intPrevType;
		return oOutput;
	}

	CLaTeXParser.prototype.IsSubTrackLiteral = function () {

	}
	CLaTeXParser.prototype.GetSubTrackLiteral = function () {

	}

	CLaTeXParser.prototype.IsMatrixLiteral = function () {
		return (
			this.oLookahead.class === oLiteralNames.matrixLiteral[0]
		)
	}
	CLaTeXParser.prototype.GetMatrixLiteral = function () {
		this.EatToken(this.oLookahead.class);
		this.SkipFreeSpace();
		if (this.oLookahead.data === "{") {
			this.EatToken(this.oLookahead.class);
		}

		let matrix = [];
		while (this.oLookahead.data !== "}" && this.oLookahead.class !== "endOfMatrix") {
			matrix.push(this.GetRayOfMatrixLiteral());
		}
		if (this.oLookahead.data === "}" || this.oLookahead.class === "endOfMatrix") {
			this.EatToken(this.oLookahead.class)
		}

		return {
			class: oLiteralNames.matrixLiteral[num],
			value: matrix,
		}
	}
	CLaTeXParser.prototype.GetRayOfMatrixLiteral = function () {
		let arrRayContent = [];
		while (this.oLookahead.class !== "\\\\" && this.oLookahead.data !== "}" && this.oLookahead.class !== "endOfMatrix") {
			arrRayContent.push(this.GetElementOfMatrix())
		}
		if (this.oLookahead.class === "\\\\") {
			this.EatToken("\\\\")
		}
		this.SkipFreeSpace();
		return arrRayContent
	}
	CLaTeXParser.prototype.GetElementOfMatrix = function () {
		let element = [this.GetArguments(1)];
		this.SkipFreeSpace();
		if (this.oLookahead.class === "&") {
			this.EatToken("&");
		}
		this.SkipFreeSpace();
		return element
	}

	CLaTeXParser.prototype.GetExpressionLiteral = function (strBreakSymbol, strBreakType) {
		const arrEndOfExpression = ["}", "\\endgroup", "\\end", "┤", "&"];
		const arrExpList = [];
		while (
			this.IsElementLiteral() &&
			!arrEndOfExpression.includes(this.oLookahead.data) &&
			((strBreakType && !strBreakType.includes(this.oLookahead.data)) ||
				!strBreakType) &&
			this.oLookahead.class !== strBreakSymbol &&
			this.oLookahead.class !== null &&
			this.oLookahead.class !== "opClose" &&
			((this.isWaitCloseBracket && this.oLookahead.class !== "opOpen/opClose") || !this.isWaitCloseBracket)) {
			if (this.IsPreScript()) {
				arrExpList.push(this.GetPreScriptLiteral());
			}
			else {
				arrExpList.push(this.GetWrapperElementLiteral());
			}
		}

		return this.GetContentOfLiteral(arrExpList)
	};
	CLaTeXParser.prototype.EatToken = function (tokenType) {
		const oToken = this.oLookahead;
		if (oToken === null) {
			throw new SyntaxError(
				`Unexpected end of input, expected: "${tokenType}"`
			);
		}
		if (oToken.class !== tokenType) {
			throw new SyntaxError(
				`Unexpected token: "${oToken.class}", expected: "${tokenType}"`
			);
		}
		this.oLookahead = this.oTokenizer.GetNextToken();
		return oToken;
	};
	CLaTeXParser.prototype.SkipFreeSpace = function () {
		while (this.oLookahead.class === oLiteralNames.spaceLiteral[0]) {
			this.oLookahead = this.oTokenizer.GetNextToken();
		}
	};
	CLaTeXParser.prototype.GetArguments = function (intCountOfArguments) {
		let oArgument = [];
		while (intCountOfArguments > 0) {
			this.SkipFreeSpace();
			if (this.oLookahead.data === "{") {
				this.EatToken(this.oLookahead.class);
				oArgument.push(this.GetExpressionLiteral());
				this.EatToken(this.oLookahead.class);
			}
			else {
				oArgument.push(this.GetWrapperElementLiteral());
			}
			intCountOfArguments--;
		}
		if (oArgument.length === 1 && Array.isArray(oArgument)) {
			return oArgument[0];
		}
		return oArgument;
	};
	CLaTeXParser.prototype.CheckMathFont = function (str) {
		const fontTypeGroup = this.oTokenizer.GetOMathFont[str];
		if (undefined !== fontTypeGroup) {
			const fontType = fontTypeGroup[this.intMathFontType];
			if (undefined !== fontType) {
				return {
					CharLiteral: fontType,
					FontStyle: this.intMathFontType,
				}
			}
		}
	}

	CLaTeXParser.prototype.GetContentOfLiteral = function (oContent) {
		if (Array.isArray(oContent)) {
			if (oContent.length === 1) {
				return oContent[0];
			}
			return oContent;
		}
		return oContent;
	}

	function ConvertLaTeXToTokensList(str, oContext, isGetOnlyTokens) {
		if (undefined === str || null === str) {
			return
		}

		const oConverter = new CLaTeXParser(true);
		const oTokens = oConverter.Parse(str);

		if (!isGetOnlyTokens) {
			ConvertTokens(oTokens, oContext);
		} else {
			return oTokens;
		}
		return true;
	}
	//---------------------------------------export----------------------------------------------------
	window["AscCommonWord"] = window["AscCommonWord"] || {};
	window["AscCommonWord"].ConvertLaTeXToTokensList = ConvertLaTeXToTokensList;
})(window);
