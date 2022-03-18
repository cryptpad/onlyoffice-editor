//=====================Parser====================//
function Parser() {
	this._string = "";
	this._tokenizer = new Tokenizer();
}

Parser.prototype.parse = function (string) {
	this._string = string;
	this._tokenizer.init(string);
	this._lookahead = this._tokenizer.getNextToken();
	return this.Program();
};
Parser.prototype.Program = function () {
	return {
		type: "Root",
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
Parser.prototype.CharLiteral = function () {
	const token =
		this._lookahead.type === "Other" ? this._eat("Other") : this._eat("Char");

	return {
		type: "CharLiteral",
		value: token.value,
	};
};
/**
 * SpaceLiteral
 * : SPACE
 * ;
 *
 * type: Space
 */
Parser.prototype.SpaceLiteral = function () {
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
Parser.prototype.aASCIILiteral = function () {
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
Parser.prototype.nASCIILiteral = function () {
	if (this._lookahead?.type === "nASCII") {
		const token = this._eat("nASCII");
		return {
			type: "NumericLiteral",
			value: Number(token.value),
		};
	}
	return null;
};
/**
 * anMathLiteral
 * 	: anMath
 * 	;
 *
 * type: anMath
 *
 */
Parser.prototype.anMathLiteral = function () {
	const token = this._eat("anMath");
	return {
		type: "anMathLiteral",
		value: token.value,
	};
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
Parser.prototype.anOtherLiteral = function () {
	switch (this._lookahead.type) {
		case "anOther":
			var token = this._eat("anOther");
			return {
				type: "anOtherLiteral",
				value: token,
			};
		case "Char":
			var token = this.CharLiteral();
			return {
				type: "anOtherLiteral",
				value: token,
			};
		case "Space":
			var token = this.SpaceLiteral();
			return {
				type: "anOtherLiteral",
				value: token,
			};
		case "aASCII":
			var token = this.aASCIILiteral();
			return {
				type: "anOtherLiteral",
				value: token,
			};
	}
};
Parser.prototype.isAnOtherLiteral = function (tokenName) {
	const arr = [
		"√",
		"∛",
		"∜",
		"&",
		"^",
		"_",
		"√(",
		"-∞",
		"∞",
		"|",
		"||",
		"!",
		"!!",
	];
	return (
		tokenName !== "anMath" &&
		tokenName !== "nASCII" &&
		tokenName !== null &&
		tokenName !== undefined &&
		tokenName !== "opOpen" &&
		tokenName !== "opClose" &&
		tokenName !== "opOver" &&
		tokenName !== "opNary" &&
		tokenName !== "opBuildup" &&
		tokenName !== "opHbracket" &&
		tokenName !== "opDecimal" &&
		tokenName !== "opArray" &&
		!arr.includes(tokenName)
	);
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
Parser.prototype.anLiteral = function () {
	if (this.isAnOtherLiteral(this._lookahead?.type)) {
		return this.anOtherLiteral();
	} else {
		return this.anMathLiteral();
	}
};
Parser.prototype.isAnLiteral = function (tokenName) {
	return this.isAnOtherLiteral(tokenName) || tokenName === "anMath";
};
/**
 * DiacriticLiteral
 *	: Diacritic
 *	;
 *
 * type: Diacritic
 */
Parser.prototype.diacriticLiteral = function () {
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
Parser.prototype.opArrayLiteral = function () {
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
Parser.prototype.opCloseLiteral = function () {
	const token = this._eat("opClose");
	return {
		type: "opClose",
		value: token.value,
	};
};
/**
 * opCloserLiteral
 * : opCloser
 * ;
 *
 * type: opClose || \\close
 *
 */
Parser.prototype.opCloserLiteral = function () {
	switch (this._lookahead?.type) {
		case "\\close":
			return {
				type: "opClose",
				value: "\\close",
			};

		case "opClose":
			return opCloseLiteral();
	}
};
Parser.prototype.isOpCloserLiteral = function (tokenName) {
	return tokenName === "opClose" || tokenName === "\\close";
};
/**
 * opDecimalLiteral
 * : opDecimal
 * ;
 *
 * type: opDecimal
 *
 */
Parser.prototype.opDecimalLiteral = function () {
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
Parser.prototype.opHbracketLiteral = function () {
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
Parser.prototype.opNaryLiteral = function () {
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
Parser.prototype.opOpenLiteral = function () {
	const token = this._eat("opOpen");
	return {
		type: "opOpen",
		value: token.value,
	};
};
/**
 * opOpenerLiteral
 * : opOpen
 * ;
 *
 * type: opOpen || \\open
 *
 */
Parser.prototype.opOpenerLiteral = function () {
	switch (this._lookahead?.type) {
		case "\\open":
			return {
				type: "opOpen",
				value: "\\open",
			};
		case "opOpen":
			return opOpenLiteral();
	}
};
Parser.prototype.isOpOpenerLiteral = function (tokenName) {
	return tokenName === "opOpen" || tokenName === "\\open";
};
/**
 * opOverLiteral
 * : opOver
 * ;
 *
 * type: opOver
 *
 */
Parser.prototype.opOverLiteral = function () {
	const token = this._eat("opOver");
	return {
		type: "opOver",
		value: token.value,
	};
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
Parser.prototype.opBuildupLiteral = function () {
	// или
	if (this._lookahead?.type === "opBuildup") {
		const token = this._eat("opBuildup");
		return {
			type: "opBuildup",
			value: token.value,
		};
	} else {
		switch (this._lookahead?.type) {
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
Parser.prototype.isOpBuildupLiteral = function (tokenName) {
	return (
		tokenName === "opBuildup" ||
		tokenName === "opArray" ||
		tokenName === "opOpen" ||
		tokenName === "opClose" ||
		tokenName === "opNary" ||
		tokenName === "opOver" ||
		tokenName === "opHbracket" ||
		tokenName === "opDeciamal"
	);
};
//TODO!
/**
 * otherLiteral
 * : CharLiteral
 * ;
 *
 * type: Char
 *
 * char – {αn + nASCII + diacritic + opBuildup + CR} rule doesn't followed BHF notation, what is it
 */
Parser.prototype.otherLiteral = function () {
	return this.CharLiteral();
};
Parser.prototype.isOtherLiteral = function (tokenName) {
	return tokenName === "Char";
};
//exp in diacritic literal migth be a cause of left-recursion! check
/**
 * diacriticBaseLiteral
 * : anLiteral
 * | nASCIILiteral
 * | "(" expLiteral ")"
 * ;
 *
 */
Parser.prototype.diacriticBaseLiteral = function () {
	if (this.isAnLiteral(this._lookahead?.type)) {
		const token = this.anLiteral();
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	} else if (this._lookahead?.type === "nASCII") {
		const token = this.nASCIILiteral();
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	} else if (this._lookahead?.type === "(") {
		this._eat("(");
		const token = this.expLiteral();
		this._eat(")");
		return {
			type: "diacriticbaseLiteral",
			value: token,
		};
	}
};
Parser.prototype.isDiacriticBaseLiteral = function (tokenName) {
	return (
		tokenName === this.isAnLiteral(tokenName) ||
		(tokenName === "nASCII" && this._lookahead?.type === ".") ||
		this._lookahead?.type === "," ||
		tokenName === "("
	);
};
/**
 * diacritcsLiteral
 * : diacritic
 * | diacritics diacritic -> diacritic diacritic diacritic diacritic
 * ;
 *
 */
Parser.prototype.diacritcsLiteral = function () {
	const diacriticsList = [this.diacriticLiteral()];

	while (this._lookahead?.type === "Diacritic") {
		diacriticsList.push(this.diacriticLiteral());
	}

	return {
		type: "diacritcsLiteral",
		value: diacriticsList,
	};
};
Parser.prototype.isDiacritcsLiteral = function (tokenName) {
	return this.isDiacriticBaseLiteral(tokenName);
};
//MAY BE A CAUSE OF PROBLEM WITH wordLiteral
/**
 * atomLiteral
 * : an
 * | diacriticbase diacritics
 * ;
 *
 */
Parser.prototype.atomLiteral = function () {
	if (
		this._lookahead?.type === "anMath" ||
		this.isAnOtherLiteral(this._lookahead?.type)
	) {
		const token = this.anLiteral();
		return {
			type: "atomLiteral",
			value: token,
		};
	} else if (this.isDiacriticBaseLiteral(this._lookahead?.type)) {
		const base = this.diacriticBaseLiteral();
		if (this.isDiacritcsLiteral(this._lookahead?.type)) {
			const diacritic = this.diacritcsLiteral();

			return {
				type: "atomLiteral",
				base,
				diacritic,
			};
		}
	}

	return null;
};
Parser.prototype.isAtomLiteral = function (tokenName) {
	return this.isAnLiteral(tokenName) || this.isDiacriticBaseLiteral(tokenName);
};
Parser.prototype.atomsLiteral = function () {
	const atomsList = [this.atomLiteral()];

	while (this.isAtomLiteral(this._lookahead?.type)) {
		atomsList.push(this.atomLiteral());
	}

	return {
		type: "atomsLiteral",
		value: atomsList,
	};
};
Parser.prototype.isAtomsLiteral = function (tokenName) {
	return this.isAtomLiteral(tokenName);
};
Parser.prototype.digitsLiteral = function () {
	const nASCIIList = [this.nASCIILiteral()];

	while (this._lookahead?.type === "nASCII") {
		nASCIIList.push(this.nASCIILiteral());
	}

	return {
		type: "digitsLiteral",
		value: nASCIIList,
	};
};
Parser.prototype.isDigitsLiteral = function (tokenName) {
	return tokenName === "nASCII";
};
Parser.prototype.numberLiteral = function () {
	const left = this.digitsLiteral();

	if (this._lookahead?.type === "opDecimal") {
		const decimal = this._eat("opDecimal").value;

		if (this.isDigitsLiteral(this._lookahead?.type)) {
			const right = this.digitsLiteral();

			return {
				type: "numberLiteral",
				number: left,
				decimal,
				afterDeciamal: right,
			};
		}
	}

	return left;
};
Parser.prototype.isNumberLiteral = function (tokenName) {
	return this.isDigitsLiteral(tokenName);
};
Parser.prototype.expBracketLiteral = function () {
	if (this._lookahead?.type === "opOpen") {
		const openLiteral = this.opOpenLiteral();
		const exp = this.expLiteral();
		const closeLiteral = this.opCloseLiteral();

		return {
			type: "expBracketLiteral",
			exp,
			open: openLiteral,
			close: closeLiteral,
		};
	}
	if (this._lookahead?.type === "||") {
		var open,
			close = this._eat("||");
		var exp = this.expLiteral();
		this._eat("||");
	}
	if (this._lookahead?.type === "|") {
		var open,
			close = this._eat("|");
		var exp = this.expLiteral();
		this._eat("|");
	}

	return {
		type: "expBracketLiteral",
		open,
		close,
		exp,
	};
};
Parser.prototype.isExpBracketLiteral = function (tokenName) {
	return (
		this.isOpOpenerLiteral(tokenName) || tokenName === "|" || tokenName === "||"
	);
};
Parser.prototype.wordLiteral = function () {
	const wordList = [this.aASCIILiteral()];

	while (this._lookahead?.type === "aASCII") {
		wordList.push(this.aASCIILiteral());
	}

	return {
		type: "wordLiteral",
		value: wordList,
	};
};
Parser.prototype.isWordLiteral = function (tokenName) {
	return tokenName === "aASCII";
};
Parser.prototype.scriptBaseLiteral = function () {
	var token = null;

	if (this.isWordLiteral(this._lookahead?.type)) {
		token = this.wordLiteral();
		if (this._lookahead?.type === "nASCII") {
			token.nASCII = this.nASCIILiteral();
		}
	} else if (this._lookahead?.type === "anMath") {
		token = this.anMathLiteral();
	} else if (this.isNumberLiteral(this._lookahead?.type)) {
		token = this.numberLiteral();
	} else if (this.isOtherLiteral(this._lookahead?.type)) {
		token = this.otherLiteral();
	} else if (this.isExpBracketLiteral(this._lookahead?.type)) {
		token = this.expBracketLiteral();
	} else if (this._lookahead?.type === "opNary") {
		token = this.opNaryLiteral();
	}

	if (token != null) {
		return {
			type: "scriptBaseLiteral",
			value: token,
		};
	}
	return null;
};
Parser.prototype.isScriptBaseLiteral = function (tokenName) {
	return (
		this.isWordLiteral(this._lookahead?.type) ||
		tokenName === "anMath" ||
		this.isNumberLiteral(this._lookahead?.type) ||
		this.isOtherLiteral(this._lookahead?.type) ||
		this.isExpBracketLiteral(this._lookahead?.type) ||
		tokenName === "opNary"
	);
};
//operand might be a cause of left recursion - check
Parser.prototype.soperandLiteral = function () {
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const operand = this.operandLiteral();
		return {
			type: "soperandLiteral",
			operand,
		};
	}
	switch (this._lookahead?.type) {
		case "-":
			const minus = this._eat("-");
			if (this.isOperandLiteral(this._lookahead?.type)) {
				const operand = this.operandLiteral();

				return {
					type: "soperandLiteral",
					operand,
					minus: minus.value === "-",
				};
			}
			break;
		case "-∞":
			const token = this._eat("-∞");
			return {
				type: "soperandLiteral",
				operand: token.value,
			};
		case "∞":
			const tokens = this._eat("∞");
			return {
				type: "soperandLiteral",
				operand: tokens.value,
			};
	}
	return null;
};
Parser.prototype.isSoperandLiteral = function (tokenName) {
	return (
		this.isOperandLiteral(tokenName) ||
		tokenName === "-" ||
		tokenName === "-∞" ||
		tokenName === "∞"
	);
};
Parser.prototype.expSubsupLiteral = function () {
	if (this.isScriptBaseLiteral(this._lookahead?.type)) {
		const token = this.scriptBaseLiteral();

		if (this._lookahead?.type === "_") {
			this._eat("_");
			if (this.isSoperandLiteral(this._lookahead?.type)) {
				var firstSoperand = this.soperandLiteral();
				if (this._lookahead?.type === "^") {
					this._eat("^");
					if (this.isSoperandLiteral(this._lookahead?.type)) {
						var secondSoperand = this.soperandLiteral();

						return {
							type: "expSubsup",
							base: token,
							firstSoperand,
							secondSoperand,
						};
					}
				} else {
					return {
						type: "expSuperscript",
						base: token,
						secondSoperand,
					};
				}
			}
		} else if (this._lookahead?.type === "^") {
			this._eat("^");
			if (this.isSoperandLiteral(this._lookahead?.type)) {
				var secondSoperand = this.soperandLiteral();
				if (this._lookahead?.type === "_") {
					this._eat("_");
					if (this.isSoperandLiteral(this._lookahead?.type)) {
						var firstSoperand = this.soperandLiteral();

						return {
							type: "expSubsup",
							base: token,
							firstSoperand,
							secondSoperand,
						};
					}
				}
				return {
					type: "expSuperscript",
					base: token,
					secondSoperand,
				};
			}
		}

		return token.value;
	}

	return null;
};
Parser.prototype.isExpSubsupLiteral = function (tokenName) {
	return this.isScriptBaseLiteral(tokenName);
};
Parser.prototype.expScriptLiteral = function () {
	return this.expSubsupLiteral();
};
Parser.prototype.isExpScriptLiteral = function (tokenName) {
	return this.isExpSubsupLiteral(tokenName);
};
Parser.prototype.entityLiteral = function () {
	if (this.isAtomsLiteral(this._lookahead?.type)) {
		return this.atomLiteral();
	} else if (this.isExpBracketLiteral(this._lookahead?.type)) {
		return this.expBracketLiteral();
	} else if (this.isExpScriptLiteral(this._lookahead?.type)) {
		return this.expScriptLiteral();
	}
	return null;
};
Parser.prototype.isEntityLiteral = function (tokenName) {
	return (
		this.isAtomsLiteral(tokenName) ||
		this.isExpBracketLiteral(tokenName) ||
		this.isExpScriptLiteral(tokenName)
	);
};
Parser.prototype.factorLiteral = function () {
	const nextNext = this._tokenizer.getNextNextToken()?.value;
	if (
		nextNext !== "^" &&
		nextNext !== "_" &&
		this.isEntityLiteral(this._lookahead?.type)
	) {
		const entity = this.entityLiteral();

		if (entity && this._lookahead?.type === "!") {
			const postfix = this._eat("!");
			return {
				type: "factorLiteral",
				value: entity,
				postfix,
			};
		} else if (entity && this._lookahead?.type === "!!") {
			const postfix = this._eat("!!");
			return {
				type: "factorLiteral",
				value: entity,
				postfix,
			};
		}

		if (entity) {
			return {
				type: "factorLiteral",
				value: entity,
			};
		}
	} else if (this.isFunctionLiteral(this._lookahead?.type)) {
		const token = this.functionLiteral();
		return {
			type: "factorLiteral",
			value: token,
		};
	} else if (this.isExpScriptLiteral(this._lookahead?.type)) {
		const token = this.expScriptLiteral();
		return {
			type: "factorLiteral",
			value: token,
		};
	}

	return null;
};
//Recursion!
Parser.prototype.isFactorLiteral = function (tokenName) {
	return (
		this.isEntityLiteral(tokenName) ||
		this.isFunctionLiteral(tokenName) ||
		(this.isExpScriptLiteral(tokenName) &&
			(this._tokenizer.getNextNextToken().type === "^" ||
				this._tokenizer.getNextNextToken().type === "_"))
	);
};
Parser.prototype.operandLiteral = function () {
	const factorList = [this.factorLiteral()];

	while (this.isFactorLiteral(this._lookahead?.type)) {
		const nextNextToken = this._tokenizer.getNextNextToken()?.value;
		if (
			this.isFractionLiteral(this._lookahead?.type) &&
			(nextNextToken === "/" || nextNextToken === "\\atop")
		) {
			const token = this.fractionLiteral();
			if (token !== null) {
				factorList.push(token);
			}
		} else {
			factorList.push(this.factorLiteral());
		}
	}

	return {
		type: "operandLiteral",
		value: factorList,
	};
};
Parser.prototype.isOperandLiteral = function (tokenName) {
	return this.isFactorLiteral(tokenName);
};
Parser.prototype.boxLiteral = function () {
	if (this._lookahead?.type === "□") {
		this._eat("□");
		if (this.isOperandLiteral(this._lookahead?.type)) {
			const token = this.operandLiteral();
			return {
				type: "boxLiteral",
				value: token,
			};
		}
	}
	return null;
};
Parser.prototype.isBoxLiteral = function (tokenName) {
	return tokenName === "□";
};
Parser.prototype.hbrackLiteral = function () {
	const token = this.opHbracketLiteral();
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const operand = this.operandLiteral();
		return {
			type: "hbrackLiteral",
			hbracket: token,
			operand,
		};
	}
	return null;
};
Parser.prototype.isHbrackLiteral = function (tokenName) {
	return tokenName === "opHbracket";
};
Parser.prototype.sqrtLiteral = function () {
	this._eat("√");
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const token = this.operandLiteral();
		return {
			type: "sqrtLiteral",
			value: token,
		};
	}
	return null;
};
Parser.prototype.isSqrtLiteral = function (tokenName) {
	return tokenName === "√";
};
Parser.prototype.cubertLiteral = function () {
	this._eat("∛");
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const token = this.operandLiteral();
		return {
			type: "cubertLiteral",
			value: token,
		};
	}
	return null;
};
Parser.prototype.isCubertLiteral = function (tokenName) {
	return tokenName === "∛";
};
Parser.prototype.fourthrtLiteral = function () {
	this._eat("∜");
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const token = this.operandLiteral();
		return {
			type: "fourthrtLiteral",
			value: token,
		};
	}
	return null;
};
Parser.prototype.isFourthrtLiteral = function (tokenName) {
	return tokenName === "∜";
};
Parser.prototype.nthrtLiteral = function () {
	this._eat("√(");
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const index = this.operandLiteral();
		this._eat("&");
		if (this.isOperandLiteral(this._lookahead?.type)) {
			const content = this.operandLiteral();
			this._eat("opClose");
			return {
				type: "nthrtLiteral",
				index,
				content,
			};
		}
	}
};
Parser.prototype.isNthrtLiteral = function (tokenName) {
	return tokenName === "√(";
};
Parser.prototype.functionLiteral = function () {
	if (this.isSqrtLiteral(this._lookahead?.type)) {
		const token = this.sqrtLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}
	if (this.isCubertLiteral(this._lookahead?.type)) {
		const token = this.cubertLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}
	if (this.isFourthrtLiteral(this._lookahead?.type)) {
		const token = this.fourthrtLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}
	if (this.isNthrtLiteral(this._lookahead?.type)) {
		const token = this.nthrtLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}
	if (this.isBoxLiteral(this._lookahead?.type)) {
		const token = this.boxLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}
	if (this.isHbrackLiteral(this._lookahead?.type)) {
		const token = this.hbrackLiteral();
		return {
			type: "functionLiteral",
			valueL: token,
		};
	}

	return null;
};
Parser.prototype.isFunctionLiteral = function (tokenName) {
	return (
		this.isSqrtLiteral(tokenName) ||
		this.isCubertLiteral(tokenName) ||
		this.isFourthrtLiteral(tokenName) ||
		this.isNthrtLiteral(tokenName) ||
		this.isBoxLiteral(tokenName) ||
		this.isHbrackLiteral(tokenName)
	);
};
Parser.prototype.numeratorLiteral = function () {
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const token = this.operandLiteral();
		return {
			type: "numeratorLiteral",
			value: token,
		};
	}

	if (this.isFractionLiteral(this._lookahead?.type)) {
		const fracList = [fractionLiteral()];

		while (this.isFractionLiteral(this._lookahead?.type)) {
			fracList.push(fractionLiteral());
		}

		return {
			type: "numeratorLiteral",
			value: fracList,
		};
	}

	return null;
};
Parser.prototype.isNumeratorLiteral = function (tokenName) {
	return this.isOperandLiteral(tokenName);
};
Parser.prototype.fractionLiteral = function () {
	const numerator = this.numeratorLiteral();
	if (this._lookahead?.type === "opOver" || this._lookahead?.value === "/") {
		const opOver = this.opOverLiteral();

		if (this.isOperandLiteral(this._lookahead?.type)) {
			const operand = this.operandLiteral();
			return {
				type: "fractionLiteral",
				numerator,
				opOver,
				operand,
			};
		}
	}
	return null;
};
Parser.prototype.isFractionLiteral = function (tokenName) {
	return this.isNumeratorLiteral(tokenName);
};
//TODO: add array
//cause of left recursion!
Parser.prototype.elementLiteral = function () {
	const nextNextToken = this._tokenizer.getNextNextToken()?.value;
	if (
		this.isFractionLiteral(this._lookahead?.type) &&
		(nextNextToken === "/" || nextNextToken === "\\atop")
	) {
		const token = this.fractionLiteral();
		if (token !== null) {
			return token;
		}
	}
	if (this.isOperandLiteral(this._lookahead?.type)) {
		const token = this.operandLiteral();
		return token;
	}
};
Parser.prototype.isElementLiteral = function (tokenName) {
	return this.isFractionLiteral(tokenName) || this.isOperandLiteral(tokenName);
};
Parser.prototype.expLiteral = function () {
	const expList = [this.elementLiteral()];

	while (
		this.isElementLiteral(this._lookahead?.type) ||
		this._lookahead?.type === "Other"
	) {
		if (this._lookahead?.type === "Other") {
			expList.push(this.otherLiteral());
		} else {
			expList.push(this.elementLiteral());
		}
	}

	return {
		type: "expLiteral",
		value: expList,
	};
};
//-------------------------------------------------
Parser.prototype._eat = function (tokenType) {
	const token = this._lookahead;

	if (token === null) {
		throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`);
	}

	if (token.type !== tokenType) {
		throw new SyntaxError(
			`Unexpected token: "${token.type}", expected: "${tokenType}"`
		);
	}

	//Advance to the next token.
	this._lookahead = this._tokenizer.getNextToken();
	return token;
};

//=====================TOKENIZER====================//
/**
 * Tokenizer spec.
 */
const Spec = [
	// ------------------------------------------
	// Op opNary:
	[
		/^(∑|⅀|⨊|∏|∐|⨋|∫|∬|∭|⨌|∮|∯|∰|∱|⨑|∲|∳|⨍|⨎|⨏|⨕|⨖|⨗|⨘|⨙|⨚|⨛|⨜|⨒|⨓|⨔|⋀|⋁|⋂|⋃|⨃|⨄|⨅|⨆|⨀|⨁|⨂|⨉|⫿)/,
		"opNary",
	],

	// ------------------------------------------
	//opCLoser:
	[/^\\close/, "\\close"],
	// opClose:
	[/^(\)|\]|\}|\〉)/, "opClose"],

	// opOpen: ( [ { 〈
	[/^(\(|\[|\{|\〈)/, "opOpen"],
	[/^\\open/, "\\open"],

	// ------------------------------------------
	// MathOperators:
	[/^(\!)/, "!"],
	[/^(\!\!)/, "!!"],
	[/^(\|\|)/, "||"],
	[/^(\|)/, "|"],
	[/^(\∞)/, "∞"],
	[/^(\-\∞)/, "-∞"],
	[/^[\^]/, "^"],
	[/^[\_]/, "_"],

	[/^(\√\()/, "√("],
	[/^[\√]/, "√"],
	[/^[\∛]/, "∛"],
	[/^[\∜]/, "∜"],
	[/^[\&]/, "&"],

	// ------------------------------------------
	// opOver
	[/^(\/|\\atop)/, "opOver"],

	// ------------------------------------------
	// opBuildUp:
	[/^(\^|\_|\√|\∛|\∜|\□|\/|\|)/, "opBuildup"],

	// ------------------------------------------
	// Op hBrack:
	[/^(⏜|⏝|⎴|⎵|⏞|⏟|⏠|⏡)/, "opHbracket"],

	// ------------------------------------------
	// Op decimal:
	[/^(\,|\.)/, "opDecimal"],

	// ------------------------------------------
	// opARRAY:
	[/^(&|■|\x{000B})/, "opArray"],

	// ------------------------------------------
	// Diacritic:
	[
		function (str) {
			const code = fixedCharCodeAt(str);
			if (code >= 768 && code <= 879) {
				return {
					0: str,
				};
			}

			return null;
		},
		"Diacritic",
	],

	// ------------------------------------------
	// anMATH:
	[
		function (str) {
			const code = fixedCharCodeAt(str);
			const result = /^[^\w\d\s\|\[\{\〈\)\]\}\〉\+\-\*]+/.exec(str);
			if (
				(code >= 119808 && code <= 120831) ||
				(code >= 8450 && code <= 8500 && result !== null)
			) {
				return result;
			}
			return null;
		},
		"anMath",
	],

	// ------------------------------------------
	// AnOther:
	[/^[^\w\d\s\|\[\{\〈\)\]\}\〉\+\-\*]+/, "Other"],

	// ------------------------------------------
	// Numbers:
	[/^\d+/, "nASCII"],

	// ------------------------------------------
	// aASCII:
	[/^[a-zA-Z]+/, "aASCII"],

	// ------------------------------------------
	// Space:
	[/\s/, "Space"],

	// ------------------------------------------
	// Char:
	[/^./, "Char"],
];
function Tokenizer() {
	this._string = undefined;
	this._cursor = undefined;
}
Tokenizer.prototype.init = function (string) {
	this._string = string;
	this._cursor = 0;
};
Tokenizer.prototype.isEOF = function () {
	return this._cursor === this._string.length;
};
Tokenizer.prototype.hasMoreTokens = function () {
	return this._cursor < this._string.length;
};
Tokenizer.prototype.getNextToken = function () {
	if (!this.hasMoreTokens()) {
		return null;
	}

	const string = this._string.slice(this._cursor);

	for (const [regexp, tokenType] of Spec) {
		const tokenValue = this._match(regexp, string);

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
// LL(2)
Tokenizer.prototype.getNextNextToken = function () {
	if (!this.hasMoreTokens()) {
		return null;
	}

	const newString = this._string;
	const string = newString.slice(this._cursor);

	for (const [regexp, tokenType] of Spec) {
		const tokenValue = this._matchSpecial(regexp, string);

		if (tokenValue === null) {
			continue;
		}

		if (tokenType === null) {
			return this.getNextNextToken();
		}

		return {
			type: tokenType,
			value: tokenValue,
		};
	}
	throw new SyntaxError(`Unexpected token: "${string[0]}"`);
};
Tokenizer.prototype._match = function (regexp, string) {
	var matched;
	if (typeof regexp === "function") {
		matched = regexp(string);
	} else if (typeof regexp === "object") {
		matched = regexp.exec(string);
	}

	if (matched === null) {
		return null;
	}
	this._cursor += matched[0].length;
	return matched[0];
};
Tokenizer.prototype._matchSpecial = function (regexp, string) {
	var matched;
	if (typeof regexp === "function") {
		matched = regexp(string);
	} else if (typeof regexp === "object") {
		matched = regexp.exec(string);
	}

	if (matched === null) {
		return null;
	}
	return matched[0];
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

function ManualTest() {
	const parser = new Parser();
	const program = `x+5/3+y`;
	const ast = parser.parse(program);
	console.log(JSON.stringify(ast, null, 2));
}
//ManualTest();

function MassiveTest() {
	const fractionTests = (test) => {
		test(
			`1/2`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "fractionLiteral",
							numerator: {
								type: "numeratorLiteral",
								value: {
									type: "operandLiteral",
									value: [
										{
											type: "factorLiteral",
											value: {
												type: "digitsLiteral",
												value: [
													{
														type: "NumericLiteral",
														value: 1,
													},
												],
											},
										},
									],
								},
							},
							opOver: {
								type: "opOver",
								value: "/",
							},
							operand: {
								type: "operandLiteral",
								value: [
									{
										type: "factorLiteral",
										value: {
											type: "digitsLiteral",
											value: [
												{
													type: "NumericLiteral",
													value: 2,
												},
											],
										},
									},
								],
							},
						},
					],
				},
			},
			"Проверка работы базового деления: 1/2"
		);
		test(
			`x/2`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "fractionLiteral",
							numerator: {
								type: "numeratorLiteral",
								value: {
									type: "operandLiteral",
									value: [
										{
											type: "factorLiteral",
											value: {
												type: "atomLiteral",
												value: {
													type: "anOtherLiteral",
													value: {
														type: "aASCIILiteral",
														value: "x",
													},
												},
											},
										},
									],
								},
							},
							opOver: {
								type: "opOver",
								value: "/",
							},
							operand: {
								type: "operandLiteral",
								value: [
									{
										type: "factorLiteral",
										value: {
											type: "digitsLiteral",
											value: [
												{
													type: "NumericLiteral",
													value: 2,
												},
											],
										},
									},
								],
							},
						},
					],
				},
			},
			"Проверка работы базового деления: x/2"
		);
		test(
			`x+5/2`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "x",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "fractionLiteral",
									numerator: {
										type: "numeratorLiteral",
										value: {
											type: "operandLiteral",
											value: [
												{
													type: "factorLiteral",
													value: {
														type: "digitsLiteral",
														value: [
															{
																type: "NumericLiteral",
																value: 5,
															},
														],
													},
												},
											],
										},
									},
									opOver: {
										type: "opOver",
										value: "/",
									},
									operand: {
										type: "operandLiteral",
										value: [
											{
												type: "factorLiteral",
												value: {
													type: "digitsLiteral",
													value: [
														{
															type: "NumericLiteral",
															value: 2,
														},
													],
												},
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка работы базового деления: x+5/2"
		);
		test(
			`x+5/x+2`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "x",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "fractionLiteral",
									numerator: {
										type: "numeratorLiteral",
										value: {
											type: "operandLiteral",
											value: [
												{
													type: "factorLiteral",
													value: {
														type: "digitsLiteral",
														value: [
															{
																type: "NumericLiteral",
																value: 5,
															},
														],
													},
												},
											],
										},
									},
									opOver: {
										type: "opOver",
										value: "/",
									},
									operand: {
										type: "operandLiteral",
										value: [
											{
												type: "factorLiteral",
												value: {
													type: "digitsLiteral",
													value: [
														{
															type: "NumericLiteral",
															value: 2,
														},
													],
												},
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка работы базового деления: x+5/x+2"
		);
		// test(`x+5/(2+c)`, {
		//   "type": "Root",
		//   "body": {
		//     "type": "expLiteral",
		//     "value": [
		//       {
		//         "type": "operandLiteral",
		//         "value": [
		//           {
		//             "type": "factorLiteral",
		//             "value": {
		//               "type": "atomLiteral",
		//               "value": {
		//                 "type": "anOtherLiteral",
		//                 "value": {
		//                   "type": "aASCIILiteral",
		//                   "value": "x"
		//                 }
		//               }
		//             }
		//           },
		//           {
		//             "type": "factorLiteral",
		//             "value": {
		//               "type": "atomLiteral",
		//               "value": {
		//                 "type": "anOtherLiteral",
		//                 "value": {
		//                   "type": "CharLiteral",
		//                   "value": "+"
		//                 }
		//               }
		//             }
		//           },
		//           {
		//             "type": "fractionLiteral",
		//             "numerator": {
		//               "type": "numeratorLiteral",
		//               "value": {
		//                 "type": "operandLiteral",
		//                 "value": [
		//                   {
		//                     "type": "factorLiteral",
		//                     "value": {
		//                       "type": "digitsLiteral",
		//                       "value": [
		//                         {
		//                           "type": "NumericLiteral",
		//                           "value": 5
		//                         }
		//                       ]
		//                     }
		//                   }
		//                 ]
		//               }
		//             },
		//             "opOver": {
		//               "type": "opOver",
		//               "value": "/"
		//             },
		//             "operand": {
		//               "type": "operandLiteral",
		//               "value": [
		//                 {
		//                   "type": "factorLiteral",
		//                   "value": {
		//                     "type": "expBracketLiteral",
		//                     "exp": {
		//                       "type": "expLiteral",
		//                       "value": [
		//                         {
		//                           "type": "operandLiteral",
		//                           "value": [
		//                             {
		//                               "type": "factorLiteral",
		//                               "value": {
		//                                 "type": "digitsLiteral",
		//                                 "value": [
		//                                   {
		//                                     "type": "NumericLiteral",
		//                                     "value": 2
		//                                   }
		//                                 ]
		//                               }
		//                             },
		//                             {
		//                               "type": "factorLiteral",
		//                               "value": {
		//                                 "type": "atomLiteral",
		//                                 "value": {
		//                                   "type": "anOtherLiteral",
		//                                   "value": {
		//                                     "type": "CharLiteral",
		//                                     "value": "+"
		//                                   }
		//                                 }
		//                               }
		//                             },
		//                             {
		//                               "type": "factorLiteral",
		//                               "value": {
		//                                 "type": "atomLiteral",
		//                                 "value": {
		//                                   "type": "anOtherLiteral",
		//                                   "value": {
		//                                     "type": "aASCIILiteral",
		//                                     "value": "c"
		//                                   }
		//                                 }
		//                               }
		//                             }
		//                           ]
		//                         }
		//                       ]
		//                     },
		//                     "open": {
		//                       "type": "opOpen",
		//                       "value": "("
		//                     },
		//                     "close": {
		//                       "type": "opClose",
		//                       "value": ")"
		//                     }
		//                   }
		//                 }
		//               ]
		//             }
		//           }
		//         ]
		//       }
		//     ]
		//   }
		// }
		// );
	};
	const literalTests = (test) => {
		test(
			`1`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 1,
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: 1"
		);

		test(
			`1+2`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 1,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 2,
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: 1+2"
		);

		test(
			`1+2+3`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 1,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 2,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 3,
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: 1+2+3"
		);

		test(
			`a`,
			{
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "a",
											},
										},
									},
								},
							],
						},
					],
				},
				type: "Root",
			},
			"Проверка простого литерала: a"
		);

		test(
			"abc123def",
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "abc",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 123,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "def",
											},
										},
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: abc123def"
		);

		test(
			"abc+123+def",
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "abc",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 123,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "def",
											},
										},
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: abc+123+def"
		);

		test(
			"𝐀𝐁𝐂𝐨𝐹",
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anMathLiteral",
											value: "𝐀𝐁𝐂𝐨𝐹",
										},
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала: 𝐀𝐁𝐂𝐨𝐹"
		);

		//spaces
		test(
			"   𝐀𝐁𝐂𝐨𝐹   ",
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anMathLiteral",
											value: "𝐀𝐁𝐂𝐨𝐹",
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала - пробелы: '   𝐀𝐁𝐂𝐨𝐹   '"
		);

		//spaces & tabs
		test(
			" 	𝐀𝐁𝐂𝐨𝐹  	 ",
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: "\t",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anMathLiteral",
											value: "𝐀𝐁𝐂𝐨𝐹",
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: "\t",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "SpaceLiteral",
												value: " ",
											},
										},
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала - пробелы и табуляция: ' 	𝐀𝐁𝐂𝐨𝐹  	 '"
		);

		test(
			`1+fbnd+(3+𝐀𝐁𝐂𝐨𝐹)+c+5`,
			{
				type: "Root",
				body: {
					type: "expLiteral",
					value: [
						{
							type: "operandLiteral",
							value: [
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 1,
											},
										],
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "fbnd",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "expBracketLiteral",
										exp: {
											type: "expLiteral",
											value: [
												{
													type: "operandLiteral",
													value: [
														{
															type: "factorLiteral",
															value: {
																type: "digitsLiteral",
																value: [
																	{
																		type: "NumericLiteral",
																		value: 3,
																	},
																],
															},
														},
														{
															type: "factorLiteral",
															value: {
																type: "atomLiteral",
																value: {
																	type: "anOtherLiteral",
																	value: {
																		type: "CharLiteral",
																		value: "+",
																	},
																},
															},
														},
														{
															type: "factorLiteral",
															value: {
																type: "atomLiteral",
																value: {
																	type: "anMathLiteral",
																	value: "𝐀𝐁𝐂𝐨𝐹",
																},
															},
														},
													],
												},
											],
										},
										open: {
											type: "opOpen",
											value: "(",
										},
										close: {
											type: "opClose",
											value: ")",
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "aASCIILiteral",
												value: "c",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "atomLiteral",
										value: {
											type: "anOtherLiteral",
											value: {
												type: "CharLiteral",
												value: "+",
											},
										},
									},
								},
								{
									type: "factorLiteral",
									value: {
										type: "digitsLiteral",
										value: [
											{
												type: "NumericLiteral",
												value: 5,
											},
										],
									},
								},
							],
						},
					],
				},
			},
			"Проверка простого литерала - пробелы и табуляция: '1+fbnd+(3+𝐀𝐁𝐂𝐨𝐹)+c+5'"
		);
	};
	const scriptTests = (test) => {
		test(`2^2`, {}, "");
		test(`x^2`, {}, "");
	};
	const sqrtTests = (test) => {
		test(`√5`, {
			type: "Root",
			body: {
				type: "expLiteral",
				value: [
					{
						type: "operandLiteral",
						value: [
							{
								type: "factorLiteral",
								value: {
									type: "functionLiteral",
									valueL: {
										type: "sqrtLiteral",
										value: {
											type: "operandLiteral",
											value: [
												{
													type: "factorLiteral",
													value: {
														type: "digitsLiteral",
														value: [
															{
																type: "NumericLiteral",
																value: 5,
															},
														],
													},
												},
											],
										},
									},
								},
							},
						],
					},
				],
			},
		});
		test(`√a`, {
			type: "Root",
			body: {
				type: "expLiteral",
				value: [
					{
						type: "operandLiteral",
						value: [
							{
								type: "factorLiteral",
								value: {
									type: "functionLiteral",
									valueL: {
										type: "sqrtLiteral",
										value: {
											type: "operandLiteral",
											value: [
												{
													type: "factorLiteral",
													value: {
														type: "atomLiteral",
														value: {
															type: "anOtherLiteral",
															value: {
																type: "aASCIILiteral",
																value: "a",
															},
														},
													},
												},
											],
										},
									},
								},
							},
						],
					},
				],
			},
		});
		test(`√(2&a-4)`, {}, "");
	};

	const parser = new Parser();
	const tests = [fractionTests, literalTests, scriptTests, sqrtTests];
	var isError = false;

	function test(program, expected) {
		const ast = parser.parse(program);
		var isEqual = deepEqual(ast, expected);
	
		if (isEqual === false) {
			console.warn(`Expected:\n${JSON.stringify(expected, null, 2)}But get:\n${JSON.stringify(ast, null, 2)}`);
			isError = true;
		}
	}


	tests.forEach((testRun) => testRun(test));
	if (!isError) {
		console.log("All assertions passed!");
	}
	
}
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
 
    if (a == null || typeof(a) != "object" ||
        b == null || typeof(b) != "object")
    {
        return false;
    }
 
    var propertiesInA = 0, propertiesInB = 0;
    for (var property in a) {
        propertiesInA += 1;
    }
    for (var property in b) {
        propertiesInB += 1;
        if (!(property in a) || !deepEqual(a[property], b[property])) {
            return false;        
        }
    }        
    return propertiesInA == propertiesInB;
}
//MassiveTest()