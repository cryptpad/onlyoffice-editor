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

//TODO: put the names of literals in a separate list

function CUnicodeParser() {
	this._string = "";
	this._tokenizer = new CUnicodeTokenizer();

	//need for group like "|1+2|"
	this._isNotStepInBracketBlock = false;
}
CUnicodeParser.prototype.parse = function (string) {
	this._string = string;
	this._tokenizer.init(string);
	this._lookahead = this._tokenizer.getNextToken();
	return this.Program();
};
CUnicodeParser.prototype.Program = function () {
	return {
		type: "UnicodeEquation",
		body: this.expLiteral(),
	};
};
/**
 * CharLiteral
 * 	: Char
 * 	;
 *
 * type : Char
 */
CUnicodeParser.prototype.CharLiteral = function () {
	const token = this._eat("Char");
	return {
		CharLiteral: token.value,
	};
};
/*
 * SpaceLiteral
 * : SPACE
 * ;
 *
 * type: Space
 */
CUnicodeParser.prototype.SpaceLiteral = function () {
	const token = this._eat("Space");
	return {
		type: "SpaceLiteral",
		value: token.value,
	};
};
/**
 * aASCIILiteral
 * : aASCII
 * ;
 *
 * type: aASCII
 */
CUnicodeParser.prototype.aASCIILiteral = function () {
	const token = this._eat("aASCII");
	return {
		type: "aASCIILiteral",
		value: token.value,
	};
};
/**
 * nASCIILiteral
 * 	: nASCII
 * 	;
 *
 * type: nASCII
 *
 */
CUnicodeParser.prototype.nASCIILiteral = function () {
	if (this._lookahead.type === "nASCII") {
		const token = this._eat("nASCII");
		return {
			NumberLiteral: token.value,
		};
	}
};
/**
 * anMathLiteral
 * 	: anMath
 * 	;
 *
 * type: anMath
 *
 */
CUnicodeParser.prototype.anMathLiteral = function () {
	const token = this._eat("anMath");
	return {
		type: "anMathLiteral",
		value: token.value,
	};
};
CUnicodeParser.prototype.isAnMathLiteral = function () {
	return this._lookahead.type === "anMath";
};
/**
 * anOtherLiteral
 * 	: anOther
 * 	;
 *
 * type: anOther
 *
 * Unicode alphanumeric not including αnMath nor nASCII
 */
CUnicodeParser.prototype.anOtherLiteral = function () {
	switch (this._lookahead.type) {
		case "anOther":
			return this._eat("anOther");
		case "Char":
			return this.CharLiteral();
		case "nASCII":
			return this.nASCIILiteral();
	}
};
CUnicodeParser.prototype.isAnOtherLiteral = function () {
	return (
		this._lookahead.type === "anOther" ||
		this._lookahead.type === "Char" ||
		this._lookahead.type === "nASCII"
	);
};
CUnicodeParser.prototype.operatorLiteral = function () {
	const token = this._eat("Operator");
	return {
		Operator: token.value,
	};
};
/**
 * anLiteral
 * 	: anMath
 * 	| anOther
 *
 *
 *
 * if (anMath || anOther) { anLiteral }
 *
 */
CUnicodeParser.prototype.anLiteral = function () {
	if (this.isAnOtherLiteral()) {
		return this.anOtherLiteral();
	} else {
		return this.anMathLiteral();
	}
};
CUnicodeParser.prototype.isAnLiteral = function () {
	return this.isAnOtherLiteral() || this.isAnMathLiteral();
};
/**
 * DiacriticLiteral
 *	: Diacritic
 *	;
 *
 * type: Diacritic
 */
CUnicodeParser.prototype.diacriticLiteral = function () {
	const token = this._eat("Diacritic");
	return {
		type: "DiacriticLiteral",
		value: token.value,
	};
};
/**
 * opArrayLiteral
 * : opArray
 * ;
 *
 * type: opArray
 *
 */
CUnicodeParser.prototype.opArrayLiteral = function () {
	const token = this._eat("opArray");
	return {
		type: "opArrayLiteral",
		value: token.value,
	};
};
/**
 * opCloseLiteral
 * : opClose
 * ;
 *
 * type: opClose
 *
 */
CUnicodeParser.prototype.opCloseLiteral = function () {
	const token = this._eat("opClose");
	return token.value;
};
/**
 * opCloserLiteral
 * : opCloser
 * ;
 *
 * type: opClose || \\close
 *
 */
CUnicodeParser.prototype.opCloserLiteral = function () {
	switch (this._lookahead.type) {
		case "\\close":
			return {
				type: "opClose",
				value: "\\close",
			};
		case "opClose":
			return opCloseLiteral();
	}
};
CUnicodeParser.prototype.isOpCloserLiteral = function () {
	return (
		this._lookahead.type === "opClose" || this._lookahead.type === "\\close"
	);
};
/**
 * opDecimalLiteral
 * : opDecimal
 * ;
 *
 * type: opDecimal
 *
 */
CUnicodeParser.prototype.opDecimalLiteral = function () {
	const token = this._eat("opDecimal");
	return {
		type: "opDecimal",
		value: token.value,
	};
};
/**
 * opHbracketLiteral
 * : opHbracket
 * ;
 *
 * type: opHbracket
 */
CUnicodeParser.prototype.opHbracketLiteral = function () {
	const token = this._eat("opHbracket");
	return {
		type: "opHbracket",
		value: token.value,
	};
};
/**
 * opNaryLiteral
 * : opNary
 * ;
 *
 * type: opNary
 *
 */
CUnicodeParser.prototype.opNaryLiteral = function () {
	const token = this._eat("opNary");
	return {
		type: "opNary",
		value: token.value,
	};
};
/**
 * opOpenLiteral
 * : opOpen
 * ;
 *
 * type: opOpen
 *
 */
CUnicodeParser.prototype.opOpenLiteral = function () {
	const token = this._eat("opOpen");
	return token.value;
};
/**
 * opOpenerLiteral
 * : opOpen
 * ;
 *
 * type: opOpen || \\open
 *
 */
CUnicodeParser.prototype.opOpenerLiteral = function () {
	switch (this._lookahead.type) {
		case "\\open":
			return {
				type: "opOpen",
				value: "\\open",
			};
		case "opOpen":
			return opOpenLiteral();
	}
};
CUnicodeParser.prototype.isOpOpenerLiteral = function () {
	return this._lookahead.type === "opOpen";
};
/**
 * opOverLiteral
 * : opOver
 * ;
 *
 * type: opOver
 *
 */
CUnicodeParser.prototype.opOverLiteral = function () {
	const token = this._eat("opOver");
	return token.value;
};
/**
 * opBuildupLiteral
 * : opBuildup
 * | opArray
 * | opOpen
 * | opClose
 * | opNary
 * | opOver
 * | opHbracket
 * | opDeciamal
 * ;
 *
 */
CUnicodeParser.prototype.opBuildupLiteral = function () {
	if (this._lookahead.type === "opBuildup") {
		const token = this._eat("opBuildup");
		return {
			type: "opBuildup",
			value: token.value,
		};
	} else {
		switch (this._lookahead.type) {
			case "opArray":
				token.value = this.opArrayLiteral();
			case "opOpen":
				token.value = this.opOpenLiteral();
			case "opClose":
				token.value = this.opCloseLiteral();
			case "opNary":
				token.value = this.opNaryLiteral();
			case "opOver":
				token.value = this.opOverLiteral();
			case "opHbracket":
				token.value = this.opHbracketLiteral();
			case "opDeciamal":
				token.value = this.opDecimalLiteral();
		}
	}
};
CUnicodeParser.prototype.isOpBuildupLiteral = function () {
	return (
		this._lookahead.type === "opBuildup" ||
		this._lookahead.type === "opArray" ||
		this._lookahead.type === "opOpen" ||
		this._lookahead.type === "opClose" ||
		this._lookahead.type === "opNary" ||
		this._lookahead.type === "opOver" ||
		this._lookahead.type === "opHbracket" ||
		this._lookahead.type === "opDeciamal"
	);
};
/**
 * otherLiteral
 * : CharLiteral
 * ;
 *
 * type: Char
 *
 * char – {αn + nASCII + diacritic + opBuildup + CR} rule doesn't followed BHF notation, what is it
 */
CUnicodeParser.prototype.otherLiteral = function () {
	return this.CharLiteral();
};
CUnicodeParser.prototype.isOtherLiteral = function () {
	let next = this._tokenizer.getNextNextToken();
	return (
		this._lookahead.type === "Char" && next && next.type !== "specialScript"
	);
};
/**
 * diacriticBaseLiteral
 * : anLiteral
 * | nASCIILiteral
 * | "(" expLiteral ")"
 * ;
 *
 */
CUnicodeParser.prototype.diacriticBaseLiteral = function () {
	if (this.isAnLiteral()) {
		const token = this.anLiteral();
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	} else if (this._lookahead.type === "nASCII") {
		const token = this.nASCIILiteral();
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	} else if (this._lookahead.type === "(") {
		this._eat("(");
		const token = this.expLiteral();
		this._eat(")");
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	}
};
CUnicodeParser.prototype.isDiacriticBaseLiteral = function () {
	return this.isAnLiteral() || this._lookahead.type === "nASCII";
};
/**
 * diacritcsLiteral
 * : diacritic
 * | diacritics diacritic -> diacritic diacritic diacritic diacritic
 * ;
 *
 */
CUnicodeParser.prototype.diacritcsLiteral = function () {
	const diacriticsList = [this.diacriticLiteral()];
	while (this._lookahead.type === "Diacritic") {
		diacriticsList.push(this.diacriticLiteral());
	}
	return diacriticsList;
};
CUnicodeParser.prototype.isDiacritcsLiteral = function () {
	return lookaheadToken.type === "Diacritic";
};
/**
 * atomLiteral
 * : an
 * | diacriticbase diacritics
 * ;
 *
 */
CUnicodeParser.prototype.atomLiteral = function () {
	let next = this._tokenizer.getNextNextToken();
	if (((next && next.type !== "Diacritic") || !next) && this.isAnLiteral()) {
		return this.anLiteral();
	} else if (this.isDiacriticBaseLiteral()) {
		const base = this.diacriticBaseLiteral();
		if (this.isDiacritcsLiteral()) {
			const diacritic = this.diacritcsLiteral();
			return {
				type: "atomLiteral",
				base,
				diacritic,
			};
		}
	}
};
CUnicodeParser.prototype.isAtomLiteral = function () {
	return this.isAnLiteral() || this.isDiacriticBaseLiteral();
};
CUnicodeParser.prototype.atomsLiteral = function () {
	const atomsList = [this.atomLiteral()];
	let next = this._tokenizer.getNextNextToken();
	while (
		this.isAtomLiteral() &&
		next &&
		next.type !== "opOver" &&
		next &&
		next.type !== "^" &&
		next &&
		next.type !== "_"
	) {
		atomsList.push(this.atomLiteral());
		next = this._tokenizer.getNextNextToken().type;
	}

	if (atomsList.length === 1) {
		return atomsList[0];
	}
	return atomsList;
};
CUnicodeParser.prototype.isAtomsLiteral = function () {
	return this.isAtomLiteral();
};
CUnicodeParser.prototype.digitsLiteral = function () {
	const nASCIIList = [this.nASCIILiteral()];
	while (this._lookahead && this._lookahead.type === "nASCII") {
		nASCIIList.push(this.nASCIILiteral());
	}
	return nASCIIList;
};
CUnicodeParser.prototype.isDigitsLiteral = function () {
	return this._lookahead.type === "nASCII";
};
CUnicodeParser.prototype.numberLiteral = function () {
	const left = this.digitsLiteral();
	if (this._lookahead.type === "opDecimal") {
		const decimal = this._eat("opDecimal").value;
		if (this.isDigitsLiteral()) {
			const right = this.digitsLiteral();
			return {
				type: "numberLiteral",
				number: left,
				decimal,
				after: right,
			};
		}
	}
	return left;
};
CUnicodeParser.prototype.isNumberLiteral = function () {
	return this.isDigitsLiteral();
};
CUnicodeParser.prototype.expBracketLiteral = function () {
	let open = undefined;
	let close = undefined;
	let exp = undefined;

	if (this._lookahead.type === "opOpen") {
		open = this.opOpenLiteral();
		exp = this.expLiteral();
		close = this.opCloseLiteral();
	} else if (this._lookahead.type === "||") {
		open = this._eat("||");
		exp = this.expLiteral();
		close = this._eat("||");
	} else if (this._lookahead.type === "|") {
		open = this._eat("|").value;
		this._isNotStepInBracketBlock = true;
		exp = this.expLiteral();
		close = this._eat("|").value;
		this._isNotStepInBracketBlock = false;
	} else if (this._lookahead.type === "├") {
		return this.eatCloseOrOpenBracket();
	}

	// //все варианты скобок
	// if (this.isExpSubsupLiteral(true)) {
	// 	return this.expSubsupLiteral({
	// 		type: "expBracketLiteral",
	// 		exp,
	// 		open,
	// 		close,
	// 	})
	// }

	return {
		type: "expBracketLiteral",
		exp,
		open,
		close,
	};
};
CUnicodeParser.prototype.eatCloseOrOpenBracket = function () {
	if (this._lookahead.type === "├") {
		this._eat("├");
		const openLiteral = this.eatBracket();
		const exp = this.expLiteral();
		this._eat("┤");
		const closeLiteral = this.eatBracket();

		return {
			type: "expBracketLiteral",
			open: openLiteral,
			close: closeLiteral,
			exp,
		};
	}
};
CUnicodeParser.prototype.eatBracket = function (type) {
	var token = undefined;
	switch (this._lookahead.type) {
		case "opClose":
			token = this.opCloseLiteral();
			break;
		case "opOpen":
			token = this.opOpenLiteral();
			break;
		case "Char":
			token = this.CharLiteral();
			break;
		case "nASCII":
			token = this.nASCIILiteral();
			break;
		case "Space":
			token = this.SpaceLiteral();
			break;
	}
	token.type = type;
	return token;
};
CUnicodeParser.prototype.isExpBracketLiteral = function () {
	const tokenName = this._lookahead.type;
	return (
		this.isOpOpenerLiteral() ||
		tokenName === "|" ||
		tokenName === "||" ||
		tokenName === "├"
	);
};
CUnicodeParser.prototype.wordLiteral = function () {
	const wordList = [this.aASCIILiteral()];
	while (this._lookahead.type === "aASCII") {
		wordList.push(this.aASCIILiteral());
	}
	return {
		type: "wordLiteral",
		value: wordList,
	};
};
CUnicodeParser.prototype.isWordLiteral = function () {
	return this._lookahead.type === "aASCII";
};
CUnicodeParser.prototype.scriptBaseLiteral = function () {
	if (this.isWordLiteral()) {
		let token = this.wordLiteral();
		if (this._lookahead.type === "nASCII") {
			token.nASCII = this.nASCIILiteral();
		}
		return token;
	} else if (this._lookahead.type === "anMath") {
		return this.anMathLiteral();
	} else if (this.isNumberLiteral()) {
		return this.numberLiteral();
	} else if (this.isOtherLiteral()) {
		return this.otherLiteral();
	} else if (this.isExpBracketLiteral()) {
		return this.expBracketLiteral();
	} else if (this._lookahead.type === "opNary") {
		return this.opNaryLiteral();
	} else if (this._lookahead.type === "anOther") {
		return this.anOtherLiteral();
	} else if (this._lookahead.type === "Char") {
		return this.CharLiteral();
	} else if (this.isSqrtLiteral()) {
		return this.sqrtLiteral();
	} else if (this.isCubertLiteral()) {
		return this.cubertLiteral();
	} else if (this.isFourthrtLiteral()) {
		return this.fourthrtLiteral();
	} else if (this.isNthrtLiteral()) {
		return this.nthrtLiteral();
	}
};
CUnicodeParser.prototype.isScriptBaseLiteral = function () {
	return (
		this.isWordLiteral() ||
		this.isNumberLiteral() ||
		this.isOtherLiteral() ||
		this.isExpBracketLiteral() ||
		this._lookahead.type === "anOther" ||
		this._lookahead.type === "opNary" ||
		this._lookahead.type === "┬" ||
		this._lookahead.type === "┴" ||
		this._lookahead.type === "Char" ||
		this._lookahead.type === "anMath"
	);
};
CUnicodeParser.prototype.soperandLiteral = function (isSubSup) {
	if (this.isOperandLiteral()) {
		let operand = this.operandLiteral(isSubSup);

		if (this._lookahead.type === "⒞") {
			operand = this.fractionLiteral(operand);
		}

		return {
			type: "soperandLiteral",
			operand,
		};
	}
	switch (this._lookahead.value) {
		case "-":
			const minus = this._eat("Operator");
			if (this.isOperandLiteral()) {
				const operand = this.operandLiteral();

				return {
					type: "soperandLiteral",
					operand,
					minus: minus.value === "-",
				};
			}
			break;
		case "-∞":
			const token = this._eat("Operator");
			return {
				type: "soperandLiteral",
				operand: token.value,
			};
		case "∞":
			const tokens = this._eat("Operator");
			return {
				type: "soperandLiteral",
				operand: tokens.value,
			};
	}
	if (this._lookahead.type === "Operator") {
		return this.operatorLiteral();
	}
};
CUnicodeParser.prototype.isSoperandLiteral = function () {
	return (
		this.isOperandLiteral() ||
		this._lookahead.value === "-" ||
		this._lookahead.value === "-∞" ||
		this._lookahead.value === "∞"
	);
};
CUnicodeParser.prototype.preScriptLiteral = function () {
	if (this._lookahead.type === "opOpen") {
		this._eat("opOpen");

		if (this._lookahead.type === "_") {
			this._eat("_");
			if (this.isSoperandLiteral()) {
				var firstSoperand = this.soperandLiteral("preScript");
				if (this._lookahead.type === "^") {
					this._eat("^");
					if (this.isSoperandLiteral()) {
						var secondSoperand = this.soperandLiteral("preScript");

						this._eat("opClose");
						let base = this.scriptBaseLiteral();
						return {
							type: "prescriptSubsup",
							base,
							down: firstSoperand,
							up: secondSoperand,
						};
					}
				}
				this._eat("opClose");
				let base = this.scriptBaseLiteral();
				return {
					type: "prescriptSubscript",
					base,
					down: firstSoperand,
				};
			}
		} else if (this._lookahead.type === "^") {
			this._eat("^");
			if (this.isSoperandLiteral()) {
				var secondSoperand = this.soperandLiteral("preScript");
				if (this._lookahead.type === "_") {
					this._eat("_");
					if (this.isSoperandLiteral()) {
						var firstSoperand = this.soperandLiteral("preScript");
						this._eat("opClose");
						let base = this.scriptBaseLiteral();
						return {
							type: "prescriptSubsup",
							base,
							down: firstSoperand,
							up: secondSoperand,
						};
					}
				}
				this._eat("opClose");
				let base = this.scriptBaseLiteral();
				return {
					type: "prescriptSuperscript",
					base,
					up: secondSoperand,
				};
			}
		}
	}
};
CUnicodeParser.prototype.isPreScriptLiteral = function () {
	let next = this._tokenizer.getNextNextToken();
	if (next && (next.type === "_" || next.type === "^")) {
		return this._lookahead.type === "opOpen";
	}
	return false;
};
CUnicodeParser.prototype.expSubsupLiteral = function (token, isOne) {
	if (isOne === undefined || isOne === null) {
		isOne = false;
	}
	let content = undefined;

	if (this.isPreScriptLiteral()) {
		return this.preScriptLiteral();
	}

	if (token === undefined) {
		token = this.scriptBaseLiteral();
	}

	if (this.isScriptStandartContent()) {
		content = this.scriptStandartContent(token, isOne);
	} else if (this.isScriptBelowAboveContent()) {
		content = this.scriptBelowAboveContent(token);
	} else if (this.isScriptSpecialContent()) {
		content = this.scriptSpecialContent(token);
	}

	if (token && token.type === "opNary" && this._lookahead.type === "▒") {
		this._eat("▒");
		let thirdSoperand = this.soperandLiteral();
		return {
			type: "expSubsup",
			base: token,
			down: content.down,
			up: content.up,
			thirdSoperand,
		};
	} else {
		return content;
	}
};
CUnicodeParser.prototype.scriptStandartContent = function (base, isOne) {
	if (this._lookahead.type === "_") {
		this._eat("_");
		if (this.isSoperandLiteral()) {
			var firstSoperand =
				base && base.type === "opNary"
					? this.soperandLiteral("custom")
					: this.soperandLiteral("_");
			if (this._lookahead.type === "^" && isOne === false) {
				this._eat("^");
				if (this.isSoperandLiteral()) {
					var secondSoperand = this.soperandLiteral("^");
					return {
						type: "expSubsup",
						base,
						down: firstSoperand,
						up: secondSoperand,
					};
				}
			} else {
				return {
					type: "expSubscript",
					base,
					down: firstSoperand,
				};
			}
		}
	} else if (this._lookahead.type === "^") {
		this._eat("^");
		if (this.isSoperandLiteral()) {
			var secondSoperand =
				base && base.type === "opNary"
					? this.soperandLiteral("custom")
					: this.soperandLiteral("^");
			if (this._lookahead.type === "_" && isOne === false) {
				this._eat("_");
				if (this.isSoperandLiteral()) {
					var firstSoperand = this.soperandLiteral("_");
					return {
						type: "expSubsup",
						base,
						down: firstSoperand,
						up: secondSoperand,
					};
				}
			}
			return {
				type: "expSuperscript",
				base,
				up: secondSoperand,
			};
		}
	}
};
CUnicodeParser.prototype.isScriptStandartContent = function () {
	return this._lookahead.type === "_" || this._lookahead.type === "^";
};
CUnicodeParser.prototype.scriptBelowAboveContent = function (base) {
	if (this._lookahead.type === "┬") {
		this._eat("┬");
		var below = this.soperandLiteral();
		return {
			type: "expBelow",
			base,
			down: below,
		};
	} else if (this._lookahead.type === "┴") {
		this._eat("┴");
		var above = this.soperandLiteral();
		return {
			type: "expAbove",
			base,
			up: above,
		};
	}
};
CUnicodeParser.prototype.isScriptBelowAboveContent = function () {
	return this._lookahead.type === "┬" || this._lookahead.type === "┴";
};
CUnicodeParser.prototype.scriptSpecialContent = function (base) {
	if (this._lookahead.type === "specialScript") {
		var secondSoperand = this.specialScriptLiteral();
		if (this._lookahead.type === "specialSubscripts") {
			var firstSoperand = this.specialSubscriptLiteral();
			return {
				type: "expSubsup",
				base,
				down: firstSoperand,
				up: secondSoperand,
			};
		}

		return {
			type: "expSuperscript",
			base,
			up: secondSoperand,
		};
	} else if (this._lookahead.type === "specialSubscripts") {
		var firstSoperand = this.specialSubscriptLiteral();
		if (this._lookahead.type === "specialScript") {
			var secondSoperand = this.specialScriptLiteral();
			return {
				type: "expSubsup",
				base,
				down: firstSoperand,
				up: secondSoperand,
			};
		}
		return {
			type: "expSubscript",
			base,
			down: firstSoperand,
		};
	}
};
CUnicodeParser.prototype.isScriptSpecialContent = function () {
	return (
		this._lookahead.type === "specialScript" ||
		this._lookahead.type === "specialSubscripts"
	);
};
CUnicodeParser.prototype.specialScriptLiteral = function () {
	let cursor = Object.assign({}, this._tokenizer)._cursor;
	let start_cursor = cursor;
	let literal = this._eat("specialScript").value;
	let arrOne = this._tokenizer.getSymbols(literal);

	let one = this._tokenizer.specialSuperscriptsConvert(arrOne);

	for (let i = 0; i < one.length; i++) {
		this._tokenizer._string.splice(
			start_cursor - arrOne.length + i,
			1,
			one[i]
		);
		cursor++;
	}
	this._tokenizer._cursor = start_cursor - arrOne.length;
	this._lookahead = this._tokenizer.getNextToken();
	return this.soperandLiteral(start_cursor);
};
CUnicodeParser.prototype.specialSubscriptLiteral = function () {
	let cursor = Object.assign({}, this._tokenizer)._cursor;
	let start_cursor = cursor;
	let literal = this._eat("specialSubscripts").value;
	let arrOne = this._tokenizer.getSymbols(literal);

	let one = this._tokenizer.specialSubscriptsConvert(arrOne);

	for (let i = 0; i < one.length; i++) {
		this._tokenizer._string.splice(
			start_cursor - arrOne.length + i,
			1,
			one[i]
		);
		cursor++;
	}

	this._tokenizer._cursor = start_cursor - arrOne.length;
	this._lookahead = this._tokenizer.getNextToken();
	return this.soperandLiteral(start_cursor);
};
CUnicodeParser.prototype.isExpSubsupLiteral = function (isBaseExist) {
	if (!isBaseExist) {
		return this.isScriptBaseLiteral();
	} else if (isBaseExist) {
		return (
			this.isScriptStandartContent() ||
			this.isScriptBelowAboveContent() ||
			this.isScriptSpecialContent()
		);
	}
	return false;
};
CUnicodeParser.prototype.expScriptLiteral = function () {
	return this.expSubsupLiteral();
};
CUnicodeParser.prototype.isExpScriptLiteral = function () {
	return this.isExpSubsupLiteral();
};
CUnicodeParser.prototype.entityLiteral = function () {
	let output = undefined;
	if (this.isAtomsLiteral()) {
		output = this.atomsLiteral();
	} else if (this.isExpBracketLiteral()) {
		output = this.expBracketLiteral();
	} else if (this._lookahead.type === "Operator") {
		output = this.operatorLiteral();
	} else if (this.isNumberLiteral()) {
		output = this.numberLiteral();
	}
	return output;
};
CUnicodeParser.prototype.isEntityLiteral = function (isSubSup) {
	if (!isSubSup) {
		isSubSup = false;
	}
	return (
		this.isAtomsLiteral() ||
		this.isExpBracketLiteral() ||
		this.isNumberLiteral() ||
		(this._lookahead.type === "Operator" && typeof isSubSup === "number")
	);
};
CUnicodeParser.prototype.isNextTypeNotScript = function (next) {
	if (next) {
		return (
			next.type !== "┬" &&
			next.type !== "^" &&
			next.type !== "_" &&
			next.type !== "┴" &&
			next.type !== "^" &&
			next.type !== "_"
		);
	} else {
		return true;
	}
};
CUnicodeParser.prototype.isAfterBracketScript = function () {
	let after = this.getAfterBracket();
	if (
		after &&
		(after == "┬" ||
			after == "^" ||
			after == "_" ||
			after == "┴" ||
			after == "^" ||
			after == "_")
	) {
		return true;
	}
	return false;
};
//TODO: REFACTOR
CUnicodeParser.prototype.factorLiteral = function (isSubSup) {
	let next = this._tokenizer.getNextNextToken();

	if (
		(this.isNextTypeNotScript(next) ||
			(typeof isSubSup === "string" &&
				next &&
				isSubSup !== next.type &&
				(next.type === "^" || next.type === "_")) ||
			!next) &&
		this.isEntityLiteral(isSubSup) &&
		!this.isFunctionLiteral() &&
		((next.type !== "specialScript" && next.type !== "specialSubscripts") ||
			isSubSup)
	) {
		if (
			this.isAfterBracketScript() &&
			isSubSup !== "⏞" &&
			isSubSup !== "preScript" &&
			isSubSup !== "custom"
		) {
			return this.expScriptLiteral();
		} else {
				let entity = this.entityLiteral();

				if (this._lookahead.type === "!") {
					this._eat("!");
					return {
						type: "factorialLiteral",
						exp: entity,
					};
				} else if (this._lookahead.type === "!!") {
					this._eat("!!");
					return {
						type: "factorialLiteral",
						exp: entity,
					};
				}

				return entity;
			
		}
	} else if (this.isFunctionLiteral()) {
		let one = this.functionLiteral();
		if (this._lookahead.type === "_") {
			one = this.expSubsupLiteral(one);
		} else if (this._lookahead.type === "^") {
			one = this.expSubsupLiteral(one);
		}
		return one;
	} else if (this.isExpScriptLiteral()) {
		return this.expScriptLiteral();
	}
};
CUnicodeParser.prototype.isFactorLiteral = function (isSubSup) {
	if (!isSubSup) {
		isSubSup = false;
	}
	const next = this._tokenizer.getNextNextToken();
	return (
		this.isEntityLiteral(isSubSup) ||
		this.isFunctionLiteral() ||
		(this.isExpScriptLiteral() &&
			next &&
			(next.type === "^" || next.type === "_"))
	);
};
//TODO: REFACTOR
CUnicodeParser.prototype.operandLiteral = function (isSubSup) {
	const factorList = [];
	factorList.push(this.factorLiteral(isSubSup));
	let next = this._tokenizer.getNextNextToken();

	while (
		this.isFactorLiteral(isSubSup) &&
		this._lookahead.type !== "|" &&
		this._lookahead.type !== "specialScript" &&
		this._lookahead.type !== "specialSubscripts" &&
		((next && next.type !== "opOver") || !next) &&
		((typeof isSubSup === "number" &&
			isSubSup >= this._tokenizer._cursor) ||
			typeof isSubSup !== "number")
	) {
		factorList.push(this.factorLiteral(isSubSup));

		if (isSubSup < this._tokenizer._cursor) {
			return factorList;
		}

		next = this._tokenizer.getNextNextToken();
		if (next) {
			next = next.type;
		}
	}

	if (factorList.length === 1) {
		return factorList[0];
	}

	return factorList;
};
CUnicodeParser.prototype.isOperandLiteral = function () {
	return this.isFactorLiteral();
};
CUnicodeParser.prototype.boxLiteral = function () {
	if (this._lookahead.type === "□") {
		this._eat("□");
		if (this.isOperandLiteral()) {
			const token = this.operandLiteral();
			return {
				type: "boxLiteral",
				value: token,
			};
		}
	}
};
CUnicodeParser.prototype.rectLiteral = function () {
	if (this._lookahead.type === "▭") {
		this._eat("▭");
		if (this.isOperandLiteral()) {
			const token = this.operandLiteral();
			return {
				type: "rectLiteral",
				value: token,
			};
		}
	}
};
CUnicodeParser.prototype.isRectLiteral = function () {
	return this._lookahead.type === "▭";
};
CUnicodeParser.prototype.overbarLiteral = function () {
	this._eat("Diacritic");
	if (this.isOperandLiteral()) {
		const token = this.operandLiteral();
		return {
			type: "overbarLiteral",
			value: token,
		};
	}
};
CUnicodeParser.prototype.isOverbarLiteral = function () {
	return this._lookahead.value === "̄";
};
CUnicodeParser.prototype.underbarLiteral = function () {
	if (this._lookahead.type === "▁") {
		this._eat("▁");
		if (this.isOperandLiteral()) {
			const token = this.operandLiteral();
			return {
				type: "underbarLiteral",
				value: token,
			};
		}
	}
};
CUnicodeParser.prototype.isUnderbarLiteral = function () {
	return this._lookahead.type === "▁";
};
CUnicodeParser.prototype.isBoxLiteral = function () {
	return this._lookahead.type === "□";
};
CUnicodeParser.prototype.hbrackLiteral = function () {
	if (this.isOperandLiteral()) {
		this._eat("opHbracket");
		let operand = this.operandLiteral("⏞");
		if (this._lookahead.type === "_" || this._lookahead.type === "^") {
			let down = undefined;
			let up = undefined;

			if (this._lookahead.type === "_") {
				down = this.scriptStandartContent(undefined, true);
				return {
					type: "hbrackLiteral",
					operand,
					down: down.down,
				};
			} else {
				up = this.scriptStandartContent(undefined, true);
				return {
					type: "hbrackLiteral",
					operand,
					up: up.up,
				};
			}
		}
		return {
			type: "hbrackLiteral",
			operand,
		};
	}
};
CUnicodeParser.prototype.isHbrackLiteral = function () {
	return this._lookahead.type === "opHbracket";
};
CUnicodeParser.prototype.sqrtLiteral = function () {
	this._eat("√");
	while (this._lookahead.type === "Space") {
		this._eat("Space");
	}
	if (this.isOperandLiteral()) {
		const token = this.expLiteral();
		return {
			type: "sqrtLiteral",
			value: token,
		};
	}
};
CUnicodeParser.prototype.isSqrtLiteral = function () {
	return this._lookahead.type === "√";
};
CUnicodeParser.prototype.cubertLiteral = function () {
	this._eat("∛");
	if (this.isOperandLiteral()) {
		const token = this.operandLiteral();
		return {
			type: "cubertLiteral",
			value: token,
		};
	}
};
CUnicodeParser.prototype.isCubertLiteral = function () {
	return this._lookahead.type === "∛";
};
CUnicodeParser.prototype.fourthrtLiteral = function () {
	this._eat("∜");
	if (this.isOperandLiteral()) {
		const token = this.operandLiteral();
		return {
			type: "fourthrtLiteral",
			value: token,
		};
	}
};
CUnicodeParser.prototype.isFourthrtLiteral = function () {
	return this._lookahead.type === "∜";
};
CUnicodeParser.prototype.nthrtLiteral = function () {
	this._eat("√(");
	if (this.isOperandLiteral()) {
		const index = this.operandLiteral();
		this._eat("&");
		if (this.isOperandLiteral()) {
			const content = this.expLiteral();
			this._eat("opClose");
			return {
				type: "nthrtLiteral",
				index,
				content,
			};
		}
	}
};
CUnicodeParser.prototype.isNthrtLiteral = function () {
	return this._lookahead.type === "√(";
};
CUnicodeParser.prototype.functionLiteral = function () {
	if (this.isSqrtLiteral()) {
		const token = this.sqrtLiteral();

		let temp = this.proceedOfSqrt();
		if (temp) {
			token.index = temp;
		}
		return token;
	}
	if (this.isCubertLiteral()) {
		const token = this.cubertLiteral();
		return token;
	}
	if (this.isFourthrtLiteral()) {
		const token = this.fourthrtLiteral();
		return token;
	}
	if (this.isNthrtLiteral()) {
		const token = this.nthrtLiteral();
		return token;
	}
	if (this.isBoxLiteral()) {
		const token = this.boxLiteral();
		return token;
	}
	if (this.isRectLiteral()) {
		const token = this.rectLiteral();
		return token;
	}
	if (this.isOverbarLiteral()) {
		const token = this.overbarLiteral();
		return token;
	}
	if (this.isUnderbarLiteral()) {
		const token = this.underbarLiteral();
		return token;
	}
	if (this.isHbrackLiteral()) {
		const token = this.hbrackLiteral();
		return token;
	}
};
CUnicodeParser.prototype.proceedOfSqrt = function () {
	if (this._lookahead.type === "▒") {
		this._eat("▒");
		return this.entityLiteral();
	}
};
CUnicodeParser.prototype.isFunctionLiteral = function () {
	return (
		this.isSqrtLiteral() ||
		this.isCubertLiteral() ||
		this.isFourthrtLiteral() ||
		this.isNthrtLiteral() ||
		this.isBoxLiteral() ||
		this.isRectLiteral() ||
		this.isOverbarLiteral() ||
		this.isUnderbarLiteral() ||
		this.isHbrackLiteral()
	);
};
CUnicodeParser.prototype.numeratorLiteral = function () {
	if (this.isOperandLiteral()) {
		const token = this.operandLiteral();
		return token;
	}
};
CUnicodeParser.prototype.isNumeratorLiteral = function () {
	return this.isOperandLiteral();
};
CUnicodeParser.prototype.fractionLiteral = function (numerator) {
	if (numerator === undefined) {
		numerator = this.numeratorLiteral();
	}
	if (this._lookahead.type === "opOver") {
		const opOver = this.opOverLiteral();
		if (this.isOperandLiteral()) {
			let operand = undefined;
			let next = this._tokenizer.getNextNextToken();
			if (next && next.type === "opOver") {
				operand = this.fractionLiteral();
			} else {
				operand = this.operandLiteral();
			}
			return {
				type: "fractionLiteral",
				up: numerator,
				opOver,
				down: operand,
			};
		}
	} else if (this._lookahead.type === "¦") {
		this._eat("¦");
		if (this.isNumeratorLiteral()) {
			const operand = this.numeratorLiteral();
			return {
				type: "binomLiteral",
				numerator,
				operand,
			};
		}
	} else if (this._lookahead.type === "⒞") {
		this._eat("⒞");
		if (this.isNumeratorLiteral()) {
			const operand = this.numeratorLiteral();
			return {
				type: "binomLiteral",
				numerator,
				operand,
			};
		}
	}
};
CUnicodeParser.prototype.isFractionLiteral = function () {
	return this.isNumeratorLiteral();
};
CUnicodeParser.prototype.elementLiteral = function () {
	if (this.isElementLiteral()) {
		if (this.isNumeratorLiteral()) {
			let up = this.numeratorLiteral();
			//обрабатываем как деление
			if (this._lookahead.type === "opOver" || this._lookahead.type === "¦") {
				let down = this.fractionLiteral(up);
				//возвращаем объект деления
				return down;
			}
			//возвращаем элемент
			return up;
		} else if (this.isOperandLiteral()) {
			return this.operandLiteral();
		} else if (this.isArrayLiteral()) {
			return this.arrayLiteral();
		}
	}
};
CUnicodeParser.prototype.isElementLiteral = function () {
	return (
		this.isFractionLiteral() ||
		this.isOperandLiteral() ||
		this.isArrayLiteral() 
	);
};
CUnicodeParser.prototype.isRowLiteral = function () {
	return this.isExpLiteral();
};
CUnicodeParser.prototype.rowLiteral = function () {
	let rowArr = [];
	while (this.isExpLiteral() || this._lookahead.type === "&") {
		if (this._lookahead.type === "&") {
			this._eat("&");
		} else {
			rowArr.push(this.expLiteral());
		}
	}
	if (rowArr.length > 0) {
		return {
			type: "rowLiteral",
			exp: rowArr,
		};
	}
};
CUnicodeParser.prototype.rowsLiteral = function () {
	let rowsArr = [];
	while (this.isRowLiteral() || this._lookahead.type === "@") {
		if (this._lookahead.type === "@") {
			this._eat("@");
		} else {
			rowsArr.push(this.rowLiteral());
		}
	}
	if (rowsArr.length > 0) {
		return {
			type: "rowsLiteral",
			exp: rowsArr,
		};
	}
};
CUnicodeParser.prototype.arrayLiteral = function () {
	this._eat("\\array(");
	const exp = this.rowsLiteral();
	if (this._lookahead.value === ")") {
		this._eat("opClose");
		return {
			type: "arrayLiteral",
			exp,
		};
	}
};
CUnicodeParser.prototype.isArrayLiteral = function () {
	return this._lookahead.type === "\\array(";
};
CUnicodeParser.prototype.isExpLiteral = function () {
	return this.isElementLiteral();
};
CUnicodeParser.prototype.expLiteral = function () {
	const expList = [];
	while (
		(this.isElementLiteral() ||
			this.isOtherLiteral() ||
			this._lookahead.type === "Space" ||
			this._lookahead.type === "Operator") &&
		!(
			//позволяет отработать выход из блока || без бесконечной рекурсии
			(
				this._lookahead.type === "|" &&
				this._isNotStepInBracketBlock === true
			)
		)
	) {
		if (this.isElementLiteral()) {
			expList.push(this.elementLiteral());
		} else if (this.isOtherLiteral()) {
			expList.push(this.otherLiteral());
		} else if (this._lookahead.type === "Space") {
			expList.push(this.SpaceLiteral());
		} else if (this._lookahead.type === "Operator") {
			expList.push(this.operatorLiteral());
		}
	}
	if (expList.length === 1) {
		return expList[0];
	}
	return expList;
};
//---------------------------------------------------------------------------
CUnicodeParser.prototype._eat = function (tokenType) {
	const token = this._lookahead;

	if (token === null) {
		throw new SyntaxError(
			`Unexpected end of input, expected: "${tokenType}"`
		);
	}

	if (token.type !== tokenType) {
		throw new SyntaxError(
			`Unexpected token: "${token.type}", expected: "${tokenType}"`
		);
	}

	//Advance to the next token.
	this._prev = this._lookahead;
	this._lookahead = this._tokenizer.getNextToken();
	return token;
};
CUnicodeParser.prototype.getAfterBracket = function () {
	if (this._lookahead.type === "opOpen") {
		let cursor = this._tokenizer._cursor;
		let counter = 1;

		while (counter !== 0 && cursor <= this._tokenizer._string.length) {
			let symbol = this._tokenizer._string[cursor];

			if (openBracets.includes(symbol)) {
				counter++;
			} else if (closeBracets.includes(symbol)) {
				counter--;
			}
			cursor++;
		}
		return this._tokenizer._string[cursor];
	}
};

//===================================TOKENIZER================================
const arrOpNary = [
	"∑",
	"⅀",
	"⨊",
	"∏",
	"∐",
	"⨋",
	"∫",
	"∬",
	"∭",
	"⨌",
	"∮",
	"∯",
	"∰",
	"∱",
	"⨑",
	"∲",
	"∳",
	"⨍",
	"⨎",
	"⨏",
	"⨕",
	"⨖",
	"⨗",
	"⨘",
	"⨙",
	"⨚",
	"⨛",
	"⨜",
	"⨒",
	"⨓",
	"⨔",
	"⋀",
	"⋁",
	"⋂",
	"⋃",
	"⨃",
	"⨄",
	"⨅",
	"⨆",
	"⨀",
	"⨁",
	"⨂",
	"⨉",
	"⫿",
];
const anOther = [
	"Α",
	"Β",
	"Γ",
	"Δ",
	"Ε",
	"Ζ",
	"Η",
	"Θ",
	"Ι",
	"Κ",
	"Λ",
	"Μ",
	"Ν",
	"Ξ",
	"Ο",
	"Π",
	"Ρ",
	"Σ",
	"Τ",
	"Υ",
	"Φ",
	"Χ",
	"Ψ",
	"Ω",
	"α",
	"β",
	"γ",
	"δ",
	"ε",
	"ζ",
	"η",
	"θ",
	"ι",
	"κ",
	"λ",
	"μ",
	"ν",
	"ξ",
	"ο",
	"π",
	"ρ",
	"σ",
	"τ",
	"υ",
	"φ",
	"χ",
	"ψ",
	"ω",
	"𝚨",
	"𝚩",
	"𝚪",
	"𝚫",
	"𝚬",
	"𝚭",
	"𝚮",
	"𝚯",
	"𝚰",
	"𝚱",
	"𝚲",
	"𝚳",
	"𝚴",
	"𝚵",
	"𝚶",
	"𝚷",
	"𝚸",
	"𝚺",
	"𝚻",
	"𝚼",
	"𝚽",
	"𝚾",
	"𝚿",
	"𝛀",
	"𝛂",
	"𝛃",
	"𝛄",
	"𝛅",
	"𝛆",
	"𝛇",
	"𝛈",
	"𝛉",
	"𝛊",
	"𝛋",
	"𝛌",
	"𝛍",
	"𝛎",
	"𝛏",
	"𝛐",
	"𝛑",
	"𝛒",
	"𝛔",
	"𝛕",
	"𝛖",
	"𝛗",
	"𝛘",
	"𝛙",
	"𝛚",
	"𝛢",
	"𝛣",
	"𝛤",
	"𝛥",
	"𝛦",
	"𝛧",
	"𝛨",
	"𝛩",
	"𝛪",
	"𝛫",
	"𝛬",
	"𝛭",
	"𝛮",
	"𝛯",
	"𝛰",
	"𝛱",
	"𝛲",
	"𝛴",
	"𝛵",
	"𝛶",
	"𝛷",
	"𝛸",
	"𝛹",
	"𝛺",
	"𝛼",
	"𝛽",
	"𝛾",
	"𝛿",
	"𝜀",
	"𝜁",
	"𝜂",
	"𝜃",
	"𝜄",
	"𝜅",
	"𝜆",
	"𝜇",
	"𝜈",
	"𝜉",
	"𝜊",
	"𝜋",
	"𝜌",
	"𝜎",
	"𝜏",
	"𝜐",
	"𝜑",
	"𝜒",
	"𝜓",
	"𝜔",
	"𝜜",
	"𝜝",
	"𝜞",
	"𝜟",
	"𝜠",
	"𝜡",
	"𝜢",
	"𝜣",
	"𝜤",
	"𝜥",
	"𝜦",
	"𝜧",
	"𝜨",
	"𝜩",
	"𝜪",
	"𝜫",
	"𝜬",
	"𝜮",
	"𝜯",
	"𝜰",
	"𝜱",
	"𝜲",
	"𝜳",
	"𝜴",
	"𝜶",
	"𝜷",
	"𝜸",
	"𝜹",
	"𝜺",
	"𝜻",
	"𝜼",
	"𝜽",
	"𝜾",
	"𝜿",
	"𝝀",
	"𝝁",
	"𝝂",
	"𝝃",
	"𝝄",
	"𝝅",
	"𝝆",
	"𝝈",
	"𝝉",
	"𝝊",
	"𝝋",
	"𝝌",
	"𝝍",
	"𝝎",
	"𝝖",
	"𝝗",
	"𝝘",
	"𝝙",
	"𝝚",
	"𝝛",
	"𝝜",
	"𝝝",
	"𝝞",
	"𝝟",
	"𝝠",
	"𝝡",
	"𝝢",
	"𝝣",
	"𝝤",
	"𝝥",
	"𝝦",
	"𝝨",
	"𝝩",
	"𝝪",
	"𝝫",
	"𝝬",
	"𝝭",
	"𝝮",
	"𝝰",
	"𝝱",
	"𝝲",
	"𝝳",
	"𝝴",
	"𝝵",
	"𝝶",
	"𝝷",
	"𝝸",
	"𝝹",
	"𝝺",
	"𝝻",
	"𝝼",
	"𝝽",
	"𝝾",
	"𝝿",
	"𝞀",
	"𝞂",
	"𝞃",
	"𝞄",
	"𝞅",
	"𝞆",
	"𝞇",
	"𝞈",
	"𝞐",
	"𝞑",
	"𝞒",
	"𝞓",
	"𝞔",
	"𝞕",
	"𝞖",
	"𝞗",
	"𝞘",
	"𝞙",
	"𝞚",
	"𝞛",
	"𝞜",
	"𝞝",
	"𝞞",
	"𝞟",
	"𝞠",
	"𝞢",
	"𝞣",
	"𝞤",
	"𝞥",
	"𝞦",
	"𝞧",
	"𝞨",
	"𝞪",
	"𝞫",
	"𝞬",
	"𝞭",
	"𝞮",
	"𝞯",
	"𝞰",
	"𝞱",
	"𝞲",
	"𝞳",
	"𝞴",
	"𝞵",
	"𝞶",
	"𝞷",
	"𝞸",
	"𝞹",
	"𝞺",
	"𝞼",
	"𝞽",
	"𝞾",
	"𝞿",
	"𝟀",
	"𝟁",
	"𝟂",
];
const special = [
	")",
	"]",
	"}",
	"〉",
	"(",
	"[",
	"{",
	"〈",
	"├",
	"┤",
	"┬",
	"┴",
	"▁",
	"¯",
	"▭",
	"□",
	"&",
	"!",
	"▒",
	"|",
	"∞",
	"^",
	"_",
	"¦",
	"√",
	"∛",
	"∜",

	"/",
	"∕",
	"⊘",
	"^",
	"_",
	"√",
	"∛",
	"∜",
	"□",
	"/",
	"|",
	"⏜",
	"⏝",
	"⎴",
	"⎵",
	"⏞",
	"⏟",
	"⏠",
	"⏡",
	",",
	".",
	"&",
	"■",
];
const operatorLiterals = [
	"×",
	"⋅",
	"∈",
	"∋",
	"∼",
	"≃",
	"≅",
	"≈",
	"≍",
	"≡",
	"≤",
	"≥",
	"≶",
	"≷",
	"≽",
	"≺",
	"≻",
	"≼",
	"⊂",
	"⊃",
	"⊆",
	"⊇",
	"⊑",
	"⊒",

	"+",
	"-",
	"=",
	"*",

	"∃",
	"∀",
	"¬",
	"∧",
	"∨",
	"⇒",
	"⇔",
	"⊕",
	"⊤",
	"⊥",
	"⊢",
	"⨯",
	"⨝",
	"⟕",
	"⟖",
	"⟗",
	"⋉",
	"⋊",
	"▷",
	"÷",

	"∞",


	'←','→','↔','⇐','⇒','⇔','↩','↪','↼','⇀','↽','⇁','⟵','⟶','⟷','⟸','⟹','⟺','↦','⊨','⊢','⊣'
];
//TODO replace with codes
const invisibleOperators = [
	"⁡", // invisible function application
	"⁢", // invisible times
	"⁣", // invisible seperator
	"⁤", // invisible plus
];
//TODO replace with codes
const invisibleSpaces = [
	"​", // zero-width space
	" ", // 1/18 space
	//"   " // 2/18 space -> from two 1/18 space
	" ", // 3/18 space
	" ", // 4/18 space
	" ", // 5/18 space
	" ", // 6/18 space
	//"  " // 6 + 1 space
	" ", // 9/18 space
	" ", // 1em space
	" ", // Digit-width space
	" ", //Space
];
const specialSuperscripts = [
	"⁰",
	"¹",
	"²",
	"³",
	"⁴",
	"⁵",
	"⁶",
	"⁷",
	"⁸",
	"⁹",
	"ⁱ",
	"ⁿ",
	"⁺",
	"⁻",
	"⁼",
	"⁽",
	"⁾",
];
const specialSubscripts = [
	"₀",
	"₁",
	"₂",
	"₃",
	"₄",
	"₅",
	"₆",
	"₇",
	"₈",
	"₉",
	"₊",
	"₋",
	"₌",
	"₍",
	"₎",
];
const openBracets = ["(", "[", "{", "〈", "〖", "⌈", "⌊"];
const closeBracets = [")", "]", "}", "〉", "〗", "⌉", "⌋"];

CUnicodeTokenizer.prototype.specialSuperscriptsConvert = function (arr) {
	const arrReal = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"i",
		"n",
		"+",
		"-",
		"=",
		"(",
		")",
	];
	let outArr = [];
	for (let i = 0; i < arr.length; i++) {
		let index = specialSuperscripts.indexOf(arr[i]);
		if (typeof index !== "number") {
			return null;
		}
		outArr.push(arrReal[index]);
	}
	return outArr;
};
CUnicodeTokenizer.prototype.specialSubscriptsConvert = function (arr) {
	const arrReal = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"+",
		"-",
		"=",
		"(",
		")",
	];
	let outArr = [];
	for (let i = 0; i < arr.length; i++) {
		let index = specialSubscripts.indexOf(arr[i]);
		if (typeof index !== "number") {
			return null;
		}
		outArr.push(arrReal[index]);
	}
	return outArr;
};

//Rules for tokenizer
//TODO: REFACTOR CHAR RULE
const Spec = [
	[
		function (str) {
			return checkRule(str, "\t");
		},
		"Space",
	],
	[
		function (str) {
			return checkRule(str, "&");
		},
		"&",
	],
	[
		function (str) {
			return checkRule(str, "@");
		},
		"@",
	],
	[
		function (str) {
			return checkRule(str, { seq: ["\\", "a", "r", "r", "a", "y", "("] });
		},
		"\\array(",
	],

	[
		function (str) {
			return checkRule(str, arrOpNary);
		},
		"opNary",
	],
	[
		function (str) {
			return checkRule(str, closeBracets);
		},
		"opClose",
	],
	[
		function (str) {
			return checkRule(str, openBracets);
		},
		"opOpen",
	],
	[
		function (str) {
			return checkRule(str, { seq: ["-", "∞"] });
		},
		"Operator",
	],
	[
		function (str) {
			return checkRule(str, "├");
		},
		"├",
	],
	[
		function (str) {
			return checkRule(str, "┤");
		},
		"┤",
	],
	[
		function (str) {
			return checkRule(str, "┬");
		},
		"┬",
	],
	[
		function (str) {
			return checkRule(str, "┴");
		},
		"┴",
	],
	[
		function (str) {
			let index = 0;
			let out = "";
			let literal = str[index];
			if (specialSuperscripts.includes(literal)) {
				while (specialSuperscripts.includes(literal)) {
					out += literal;
					index++;
					literal = str[index];
				}
				return out;
			}
			return null;
		},
		"specialScript",
	],
	[
		function (str) {
			let index = 0;
			let out = "";
			let literal = str[index];
			if (specialSubscripts.includes(literal)) {
				while (specialSubscripts.includes(literal)) {
					out += literal;
					index++;
					literal = str[index];
				}
				return out;
			}
			return null;
		},
		"specialSubscripts",
	],
	[
		function (str) {
			return checkRule(str, "▁");
		},
		"▁",
	],
	[
		function (str) {
			return checkRule(str, "▭");
		},
		"▭",
	],
	[
		function (str) {
			return checkRule(str, "□");
		},
		"□",
	],
	[
		function (str) {
			return checkRule(str, "!");
		},
		"!",
	],
	[
		function (str) {
			return checkRule(str, "▒");
		},
		"▒",
	],
	[
		function (str) {
			return checkRule(str, "|");
		},
		"|",
	],
	[
		function (str) {
			return checkRule(str, "^");
		},
		"^",
	],
	[
		function (str) {
			return checkRule(str, "_");
		},
		"_",
	],
	[
		function (str) {
			return checkRule(str, "¦");
		},
		"¦",
	],
	[
		function (str) {
			return checkRule(str, "⒞");
		},
		"⒞",
	],
	//===============================================
	[
		function (str) {
			return checkRule(str, operatorLiterals);
		},
		"Operator",
	],
	//===============================================
	[
		function (str) {
			return checkRule(str, { seq: ["!", "!"] });
		},
		"!!",
	],
	[
		function (str) {
			return checkRule(str, { seq: ["|", "|"] });
		},
		"||",
	],
	[
		function (str) {
			return checkRule(str, { seq: ["√", "("] });
		},
		"√(",
	],
	[
		function (str) {
			return checkRule(str, "√");
		},
		"√",
	],
	[
		function (str) {
			return checkRule(str, "∛");
		},
		"∛",
	],
	[
		function (str) {
			return checkRule(str, "∜");
		},
		"∜",
	],
	[
		function (str) {
			return checkRule(str, ["/", "∕", "⊘"]);
		},
		"opOver",
	],
	[
		function (str) {
			return checkRule(str, ["^", "_", "√", "∛", "∜", "□", "/", "|"]);
		},
		"opBuildup",
	],
	[
		function (str) {
			return checkRule(str, ["⏜", "⏝", "⎴", "⎵", "⏞", "⏟", "⏠", "⏡"]);
		},
		"opHbracket",
	],
	[
		function (str) {
			return checkRule(str, [",", "."]);
		},
		"opDecimal",
	],
	[
		function (str) {
			return checkRule(str, ["&", "■"]);
		},
		"opArray",
	],

	// ------------------------------------------
	// Diacritic:
	[
		function (str) {
			const code = fixedCharCodeAt(str[0]);
			if (code >= 768 && code <= 879) {
				return str[0];
			}
			return null;
		},
		"Diacritic",
	],

	// ------------------------------------------
	// // anMATH:
	// [/^[\uE000-\uE3FF\u2102-\u2131\u2133\u2134]/, "anMath"],

	// ------------------------------------------
	// AnOther:𝛽
	[
		function (str) {
			return checkRule(str, anOther);
		},
		"anOther",
	],

	// ------------------------------------------
	// Numbers:
	[
		function (str) {
			let arrNumber = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
			let index = 0;
			let out = "";
			let literal = str[index];
			if (arrNumber.includes(literal)) {
				while (arrNumber.includes(literal)) {
					out += literal;
					index++;
					literal = str[index];
				}
				return out;
			}
			return null;
		},
		"nASCII",
	],

	// ------------------------------------------
	// aASCII:
	// [
	// 	function (str) {
	// 		let index = 0;
	// 		let literal = str[index];
	// 		let out = "";
	// 		let code = literal.charCodeAt();

	// 		while ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
	// 			out += literal;
	// 			index++;
	// 			if (str[index]) {
	// 				literal = str[index];
	// 				code = literal.charCodeAt();
	// 			} else {
	// 				return out;
	// 			}
	// 		}

	// 		if (out != "") {
	// 			return out;
	// 		}
	// 		return null;
	// 	},
	// 	"aASCII",
	// ],

	// ------------------------------------------
	// Space:
	[
		function (str) {
			return checkRule(str, " ");
		},
		"Space",
	],

	// ------------------------------------------
	// Char:
	[
		function (str) {
			let index = 0;
			let out = "";
			let literal = str[index];
			let arrNumber = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
			while (
				literal !== "\n" &&
				literal !== "\r" &&
				literal !== "\u2028" &&
				literal !== "\u2029" &&
				literal !== undefined &&
				!arrNumber.includes(literal) &&
				!special.includes(literal) &&
				!operatorLiterals.includes(literal) &&
				!specialSuperscripts.includes(literal) &&
				!specialSubscripts.includes(literal) &&
				literal !== " " &&
				literal !== "⒞" &&
				literal !== "\t"
			) {
				out += literal;
				index++;
				literal = str[index];
			}
			if (out === "") {
				return null;
			}
			return out;
		},
		"Char",
	],
];
function singleChar(str, char) {
	let literal = str[0];
	if (literal === char) {
		return literal;
	}
	return null;
}
function arrChar(str, arr) {
	let literal = str[0];
	if (arr.includes(literal)) {
		return literal;
	}
	return null;
}
function seqChar(str, arr) {
	let literal = "";
	for (let i = 0; i < arr.length; i++) {
		if (str[i] === arr[i]) {
			literal += str[i];
		} else {
			return null;
		}
	}
	return literal;
}
function checkRule(str, data) {
	if (Array.isArray(data)) {
		return arrChar(str, data);
	} else if (typeof data === "string" && data.length === 1) {
		return singleChar(str, data);
	} else if (typeof data === "object") {
		return seqChar(str, data.seq);
	}
}
const AutoCorrect = [
	["\\above", 0x2534],
	["\\acute", 0x0301],
	["\\aleph", 0x2135],
	["\\alpha", 0x03b1],
	["\\amalg", 0x2210],
	["\\angle", 0x2220],
	["\\aoint", 0x2233],
	["\\approx", 0x2248],
	["\\asmash", 0x2b06],
	["\\ast", 0x2217],
	["\\asymp", 0x224d],
	["\\atop", 0x00a6],
	["\\Bar", 0x033f],
	["\\bar", 0x0305],
	["\\because", 0x2235],
	["\\begin", 0x3016],
	["\\below", 0x252c],
	["\\beta", 0x03b2],
	["\\beth", 0x2136],
	["\\bot", 0x22a5],
	["\\bigcap", 0x22c2],
	["\\bigcup", 0x22c2],
	["\\bigodot", 0x2a00],
	["\\bigoplus", 0x2a01],
	["\\bigotimes", 0x2a02],
	["\\bigsqcup", 0x2a06],
	["\\biguplus", 0x2a04],
	["\\bigvee", 0x22c1],
	["\\bigwedge", 0x22c0],
	["\\bowtie", 0x22c8],
	["\\box", 0x25a1],
	["\\bra", 0x27e8],
	["\\breve", 0x0306],
	["\\bullet", 0x2219],
	["\\boxdot", 0x22a1],
	["\\boxminus", 0x229f],
	["\\boxplus", 0x229e],
	["\\cap", 0x2229],
	["\\cbrt", 0x221b],
	["\\cdot", 0x22c5],
	["\\cdots", 0x22ef],
	["\\check", 0x030c],
	["\\chi", 0x03c7],
	["\\circ", 0x2218],
	["\\close", 0x2524],
	["\\clubsuit", 0x2663],
	["\\coint", 0x2232],
	["\\cong", 0x2245],
	["\\cup", 0x222a],
	["\\daleth", 0x2138],
	["\\dashv", 0x22a3],
	["\\Dd", 0x2145],
	["\\dd", 0x2146],
	["\\ddddot", 0x20dc],
	["\\dddot", 0x20db],
	["\\ddot", 0x0308],
	["\\ddots", 0x22f1],
	["\\degree", 0x00b0],
	["\\Delta", 0x0394],
	["\\delta", 0x03b4],
	["\\diamond", 0x22c4],
	["\\diamondsuit", 0x2662],
	["\\div", 0x00f7],
	["\\dot", 0x0307],
	["\\doteq", 0x2250],
	["\\dots", 0x2026],
	["\\Downarrow", 0x21d3],
	["\\downarrow", 0x2193],
	["\\dsmash", 0x2b07],
	["\\degc", 0x2103],
	["\\degf", 0x2109],
	["\\Deltaeq", 0x225c],
	["\\ee", 0x2147],
	["\\ell", 0x2113],
	["\\emptyset", 0x2205],
	["\\emsp", 0x2003],
	["\\end", 0x3017],
	["\\ensp", 0x2002],
	["\\epsilon", 0x03f5],
	["\\eqarray", 0x2588],
	["\\eqno", 0x0023],
	["\\equiv", 0x2261],
	["\\eta", 0x03b7],
	["\\exists", 0x2203],
	["\\forall", 0x2200],
	["\\funcapply", 0x2061],
	["\\frown", 0x2311],
	["\\Gamma", 0x0393],
	["\\gamma", 0x03b3],
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
	["\\iiiint", 0x2a0c],
	["\\iiint", 0x222d],
	["\\iint", 0x222c],
	["\\Im", 0x2111],
	["\\imath", 0x0131],
	["\\in", 0x2208],
	["\\inc", 0x2206],
	["\\infty", 0x221e],
	["\\int", 0x222b],
	["\\iota", 0x03b9],
	["\\jj", 0x2149],
	["\\jmath", 0x0237],
	["\\kappa", 0x03ba],
	["\\ket", 0x27e9],
	["\\Lambda", 0x039b],
	["\\lambda", 0x03bb],
	["\\langle", 0x27e8],
	["\\lbrace", 0x007b],
	["\\lbrack", 0x005b],
	["\\lceil", 0x2308],
	["\\ldiv", 0x2215],
	["\\ldots", 0x2026],
	["\\le", 0x2264],
	["\\Leftarrow", 0x21d0],
	["\\leftarrow", 0x2190],
	["\\leftharpoondown", 0x21bd],
	["\\leftharpoonup", 0x21bc],
	["\\Leftrightarrow", 0x21d4],
	["\\leftrightarrow", 0x2194],
	["\\leq", 0x2264],
	["\\lfloor", 0x230a],
	["\\ll", 0x226a],
	["\\Longleftarrow", 0x27f8],
	["\\longleftarrow", 0x27f5],
	["\\Longleftrightarrow", 0x27fa],
	["\\longleftrightarrow", 0x27f7],
	["\\Longrightarrow", 0x27f9],
	["\\longrightarrow", 0x27f6],
	["\\left", 0x251c],
	["\\lmoust", 0x23b0],
	["\\mapsto", 0x21a6],
	["\\matrix", 0x25a0],
	["\\medsp", 0x205f],
	["\\mid", 0x2223],
	["\\models", 0x22a8],
	["\\mp", 0x2213],
	["\\mu", 0x03bc],
	["\\nabla", 0x2207],
	["\\naryand", 0x2592],
	["\\nbsp", 0x00a0],
	["\\ndiv", 0x2298],
	["\\ne", 0x2260],
	["\\nearrow", 0x2197],
	["\\neg", 0x00ac],
	["\\neq", 0x2260],
	["\\ni", 0x220b],
	["\\norm", 0x2016],
	["\\nu", 0x03bd],
	["\\nwarrow", 0x2196],
	["\\odot", 0x2299],
	["\\of", 0x2592],
	["\\oiiint", 0x2230],
	["\\oiint", 0x222f],
	["\\oint", 0x222e],
	["\\Omega", 0x03a9],
	["\\omega", 0x03c9],
	["\\ominus", 0x2296],
	["\\open", 0x251c],
	["\\oplus", 0x2295],
	["\\oslash", 0x2298],
	["\\otimes", 0x2297],
	["\\over", 0x002f],
	["\\overbar", 0x00af],
	["\\overbrace", 0x23de],
	["\\overparen", 0x23dc],
	["\\parallel", 0x2225],
	["\\partial", 0x2202],
	["\\phantom", 0x27e1],
	["\\Phi", 0x03a6],
	["\\phi", 0x03d5],
	["\\Pi", 0x03a0],
	["\\pi", 0x03c0],
	["\\pm", 0x00b1],
	["\\pppprime", 0x2057],
	["\\ppprime", 0x2034],
	["\\pprime", 0x2033],
	["\\prcue", 0x227c],
	["\\prec", 0x227a],
	["\\preceq", 0x2aaf],
	["\\preccurlyeq", 0x227c],
	["\\prime", 0x2032],
	["\\prod", 0x220f],
	["\\propto", 0x221d],
	["\\Psi", 0x03a8],
	["\\psi", 0x03c8],
	["\\qdrt", 0x221c],
	["\\rangle", 0x27e9],
	["\\ratio", 0x2236],
	["\\rbrace", 0x007d],
	["\\rbrack", 0x005d],
	["\\rceil", 0x2309],
	["\\rddots", 0x22f0],
	["\\Re", 0x211c],
	["\\rect", 0x25ad],
	["\\rfloor", 0x230b],
	["\\rho", 0x03c1],
	["\\Rightarrow", 0x21d2],
	["\\rightarrow", 0x2192],
	["\\rightharpoondown", 0x21c1],
	["\\rightharpoonup", 0x21c0],
	["\\rrect", 0x25a2],
	["\\root", 8730],
	["\\sdiv", 0x2044],
	["\\searrow", 0x2198],
	["\\setminus", 0x2216],
	["\\Sigma", 0x03a3],
	["\\sigma", 0x03c3],
	["\\sim", 0x223c],
	["\\simeq", 0x2243],
	["\\smash", 0x2b0d],
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
	["\\tau", 0x03c4],
	["\\therefore", 0x2234],
	["\\Theta", 0x0398],
	["\\theta", 0x03b8],
	["\\thicksp", 0x2005],
	["\\thinsp", 0x2006],
	["\\tilde", 0x0303],
	["\\times", 0x00d7],
	["\\to", 0x2192],
	["\\top", 0x22a4],
	["\\tvec", 0x20e1],
	["\\underbar", 0x2581],
	["\\underbrace", 0x23df],
	["\\underparen", 0x23dd],
	["\\Uparrow", 0x21d1],
	["\\uparrow", 0x2191],
	["\\Updownarrow", 0x21d5],
	["\\updownarrow", 0x2195],
	["\\uplus", 0x228e],
	["\\Upsilon", 0x03a5],
	["\\upsilon", 0x03c5],
	["\\varepsilon", 0x03b5],
	["\\varphi", 0x03c6],
	["\\varpi", 0x03d6],
	["\\varrho", 0x03f1],
	["\\varsigma", 0x03c2],
	["\\vartheta", 0x03d1],
	["\\vbar", 0x2502],
	["\\vdash", 0x22a2],
	["\\vdots", 0x22ee],
	["\\vec", 0x20d7],
	["\\vee", 0x2228],
	["\\Vert", 0x2016],
	["\\vert", 0x007c],
	["\\vphantom", 0x21f3],
	["\\vthicksp", 0x2004],
	["\\wedge", 0x2227],
	["\\wp", 0x2118],
	["\\wr", 0x2240],
	["\\Xi", 0x039e],
	["\\xi", 0x03be],
	["\\zeta", 0x03b6],
	["\\zwnj", 0x200c],
	["\\zwsp", 0x200b],
	["\\contain", 0x220b],
	["\\perp", 0x22a5],
	["\\right", 0x2524],
	["\\rmoust", 0x23b1],
	["\\smile", 0x2323],
	["\\overbracket", 0x23b4],
	["\\underbracket", 0x23b5],
	["\\overshell", 0x23e0],
	["\\undershell", 0x23e1],
];
function CUnicodeTokenizer() {
	this._string = undefined;
	this._cursor = undefined;
}
CUnicodeTokenizer.prototype.init = function (string) {
	this._string = this.getSymbols(string);
	this._cursor = 0;
};
CUnicodeTokenizer.prototype.cursor = function () {
	return this._cursor;
};
CUnicodeTokenizer.prototype.isEOF = function () {
	return this._cursor === this._string.length;
};
CUnicodeTokenizer.prototype.hasMoreTokens = function () {
	return this._cursor < this._string.length;
};
CUnicodeTokenizer.prototype.getNextToken = function () {
	if (!this.hasMoreTokens()) {
		return {
			type: null,
			value: null,
		};
	}
	let string = this._string.slice(this._cursor);

	for (let i = 0; i < AutoCorrect.length; i++) {
		let autoCorrectRule = AutoCorrect[i];
		let regexp = autoCorrectRule[0];
		let token = autoCorrectRule[1];
		const tokenValue = this._match(regexp, string);

		if (tokenValue === null) {
			continue;
		}

		this._string = this._string.slice(tokenValue.length);
		this._string.splice(0, 0, String.fromCharCode(token));
		string = this._string;
		break;
	}

	for (let i = 0; i < Spec.length; i++) {
		let autoCorrectRule = Spec[i];
		let regexp = autoCorrectRule[0];
		let tokenType = autoCorrectRule[1];

		let tokenValue = this._match(regexp, string);

		if (tokenValue === null) {
			continue;
		}

		if (tokenType === null) {
			return this.getNextToken();
		}

		return {
			type: tokenType,
			value: tokenValue,
		};
	}

	throw new SyntaxError(`Unexpected token: "${string[0]}"`);
};
CUnicodeTokenizer.prototype._match = function (regexp, string) {
	var matched = null;
	
	if (typeof regexp === "function") {
		matched = regexp(string);
	} else {

		if (string[1] === regexp[1]) {
			matched = checkRule(string, {seq: regexp.split("")});
		}
	}

	if (matched === null || matched === undefined) {
		return null;
	}

	if (typeof regexp !== "function") {
		return this.getSymbols(matched);
	} else {
		this._cursor += this.getSymbols(matched).length;
	}
	return matched;
};
// LL(2) TODO: REMOVE THIS METHOD
CUnicodeTokenizer.prototype.getNextNextToken = function () {
	if (!this.hasMoreTokens()) {
		return {
			type: null,
			value: null,
		};
	}

	const newString = this._string;
	const string = newString.slice(this._cursor);

	for (const [regexp, tokenType] of Spec) {
		const tokenValue = this._matchSpecial(regexp, string);

		if (tokenValue === null) {
			continue;
		}

		if (tokenType === null) {
			this._cursor++;
			return this.getNextNextToken();
		}

		return {
			type: tokenType,
			value: tokenValue,
		};
	}
	throw new SyntaxError(`Unexpected token: "${string[0]}"`);
};
CUnicodeTokenizer.prototype._matchSpecial = function (regexp, string) {
	var matched = null;
	if (typeof regexp === "function") {
		matched = regexp(string);
	}

	if (matched === null) {
		return null;
	}
	return matched;
};
// https://mathiasbynens.be/notes/javascript-unicode
// Iterate through all characters in a string to account for surrogate pairs
CUnicodeTokenizer.prototype.getSymbols = function (string) {
	var index = 0;
	var length = string.length;
	var output = [];
	for (; index < length; ++index) {
		var charCode = string.charCodeAt(index);
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
};
//get right code of Unicode symbol, esspesialy it surrogate pair (UTF-16)
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#fixing_charcodeat_to_handle_non-basic-multilingual-plane_characters_if_their_presence_earlier_in_the_string_is_known
function fixedCharCodeAt(str) {
	var code = str.charCodeAt(0);
	var hi, low;

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
function CUnicodeConverter(str) {
	if (undefined === str || null === str) {
		return
	}

	let oParser = new CUnicodeParser();
	let oTokens = oParser.parse(str);
	return oTokens;
}
//--------------------------------------------------------export----------------------------------------------------
if (typeof window !== 'undefined') {
	window["AscCommonWord"] = window["AscCommonWord"] || {};
	window["AscCommonWord"].CUnicodeConverter = CUnicodeConverter;
}

module.exports = CUnicodeConverter;
