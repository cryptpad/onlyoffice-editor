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
  const token = this._eat("Char");
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
      value: token.value,
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
Parser.prototype.isAnMathLiteral = function (tokenName) {
  return tokenName === "anMath";
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
  return tokenName === "anOther" || tokenName === "Space" || tokenName === 'aASCII' || tokenName === "Char";
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
  return this.isAnOtherLiteral(tokenName) || this.isAnMathLiteral(tokenName);
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
  return  token.value;
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
  return tokenName === "opOpen";
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
//check
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
    return token;
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
    close = this._eat("|").value;
    var exp = this.expLiteral();
    open = this._eat("|").value;
  }
  if (this._lookahead?.type === "├") {
    return this.eatCloseOrOpenBracket();
  }

  return {
    type: "expBracketLiteral",
    open,
    close,
    exp,
  };
};
Parser.prototype.eatCloseOrOpenBracket = function () {
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
Parser.prototype.eatBracket = function (type) {
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
Parser.prototype.isExpBracketLiteral = function (tokenName) {
  return (
    this.isOpOpenerLiteral(tokenName) ||
    tokenName === "|" ||
    tokenName === "||" ||
    tokenName === "├"
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
  if (this.isWordLiteral(this._lookahead?.type)) {
    let token = this.wordLiteral();
    if (this._lookahead?.type === "nASCII") {
      token.nASCII = this.nASCIILiteral();
    }
    return token;
  } else if (this._lookahead?.type === "anMath") {
    return this.anMathLiteral();
  } else if (this.isNumberLiteral(this._lookahead?.type)) {
    return this.numberLiteral();
  } else if (this.isOtherLiteral(this._lookahead?.type)) {
    return this.otherLiteral();
  } else if (this.isExpBracketLiteral(this._lookahead?.type)) {
    return this.expBracketLiteral();
  } else if (this._lookahead?.type === "opNary") {
    return this.opNaryLiteral();
  } else if (this._lookahead?.type === "anOther") {
    return this.anOtherLiteral();
  }
};
Parser.prototype.isScriptBaseLiteral = function (tokenName) {
  return (
    this.isWordLiteral(this._lookahead?.type) ||
    tokenName === "anMath" ||
    this.isNumberLiteral(this._lookahead?.type) ||
    this.isOtherLiteral(this._lookahead?.type) ||
    this.isExpBracketLiteral(this._lookahead?.type) ||
    tokenName === "anOther" ||
    tokenName === "opNary" ||
    tokenName === "┬" ||
    tokenName === "┴"
  );
};
Parser.prototype.soperandLiteral = function (isSubSup) {
  if (this.isOperandLiteral(this._lookahead?.type)) {
    const operand = this.operandLiteral(isSubSup);
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
Parser.prototype.preScriptLiteral = function() {
  if (this._lookahead?.type === "opOpen") {
    this._eat("opOpen");
  
    if (this._lookahead?.type === "_") {
      this._eat("_");
      if (this.isSoperandLiteral(this._lookahead?.type)) {
        var firstSoperand = this.soperandLiteral("_");
        if (this._lookahead?.type === "^") {
          this._eat("^");
          if (this.isSoperandLiteral(this._lookahead?.type)) {
            var secondSoperand = this.soperandLiteral("^");
  
            this._eat("opClose");
            let base = this.scriptBaseLiteral();
            return {
              type: "prescriptSubsup",
              base,
              firstSoperand,
              secondSoperand,
            };
          }
        } 
        this._eat("opClose");
        let base = this.scriptBaseLiteral();
        return {
          type: "prescriptSubscript",
          base,
          firstSoperand,
        };
      }
    } else if (this._lookahead?.type === "^") {
      this._eat("^");
      if (this.isSoperandLiteral(this._lookahead?.type)) {
        var secondSoperand = this.soperandLiteral("^");
        if (this._lookahead?.type === "_") {
          this._eat("_");
          if (this.isSoperandLiteral(this._lookahead?.type)) {
            var firstSoperand = this.soperandLiteral("_");
            this._eat("opClose");
            let base = this.scriptBaseLiteral();

            return {
              type: "prescriptSubsup",
              base,
              firstSoperand,
              secondSoperand,
            };
          }
        }
        this._eat("opClose");
        let base = this.scriptBaseLiteral();
        return {
          type: "prescriptSuperscript",
          base,
          secondSoperand,
        };
      }
    }
  }
};
Parser.prototype.isPreScriptLiteral = function(tokenName) {
  return tokenName === "opOpen"
};
Parser.prototype.expSubsupLiteral = function (token) {
  if (this.isPreScriptLiteral(this._lookahead?.type)) {
    return this.preScriptLiteral();
  }

  if (token === undefined) {
    token = this.scriptBaseLiteral();
  }

  if (this._lookahead?.type === "_") {
    this._eat("_");
    if (this.isSoperandLiteral(this._lookahead?.type)) {
      var firstSoperand = this.soperandLiteral("_");
      if (this._lookahead?.type === "^") {
        this._eat("^");
        if (this.isSoperandLiteral(this._lookahead?.type)) {
          var secondSoperand = this.soperandLiteral("^");
         
          if (token.type !== "opNary") {
            return {
              type: "expSubsup",
              base: token,
              firstSoperand,
              secondSoperand,
            };
          }
          
        }
      } else {
        if (token.type !== "opNary") {
          return {
            type: "expSubscript",
            base: token,
            firstSoperand,
          };
        }
      }
    }
  } 
  else if (this._lookahead?.type === "^") {
    this._eat("^");
    if (this.isSoperandLiteral(this._lookahead?.type)) {
      var secondSoperand = this.soperandLiteral("^");
      if (this._lookahead?.type === "_") {
        this._eat("_");
        if (this.isSoperandLiteral(this._lookahead?.type)) {
          var firstSoperand = this.soperandLiteral("_");
          if (token.type !== "opNary") {
            return {
              type: "expSubsup",
              base: token,
              firstSoperand,
              secondSoperand,
            };
          }
        }
      }
      if (token.type !== "opNary") {
        return {
          type: "expSuperscript",
          base: token,
          secondSoperand,
        };
      }
    }
  } 
  else if (this._lookahead?.type === "┬") {
    this._eat("┬");
    var below = this.soperandLiteral();
    return {
      type: "expBelow",
      base: token,
      below,
    };
  } 
  else if (this._lookahead?.type === "┴") {
    this._eat("┴");
    var above = this.soperandLiteral();
    return {
      type: "expAbove",
      base: token,
      above,
    };
  }
  else if (this._lookahead?.type === "specialScript") {
    var secondSoperand = this.specialScriptLiteral();
    if (this._lookahead?.type === "specialSubscripts") {
      var firstSoperand = this.specialSubscriptLiteral();
      return {
        type: "expSubsup",
        base: token,
        firstSoperand,
        secondSoperand,
      }
    }
    return {
          type: "expSuperscript",
          base: token,
          secondSoperand,
    }
  }
  else if (this._lookahead?.type === "specialSubscripts") {
    var secondSoperand = this._eat("specialSubscripts");
    if (this._lookahead?.type === "specialScript") {
      var firstSoperand = this._eat("specialScript");
      return {
        type: "expSubsup",
        base: token,
        firstSoperand,
        secondSoperand,
      }
    }
    return {
          type: "expSubscript",
          base: token,
          secondSoperand,
    }
  }

  if (token.type === "opNary" && this._lookahead.type === "▒") {
    this._eat("▒");
    let thirdSoperand = this.soperandLiteral();
    return {
      type: "expSubsup",
      base: token,
      firstSoperand,
      secondSoperand,
      thirdSoperand,
    };
  }

  return token;
};
Parser.prototype.specialScriptLiteral = function() {
  let cursor = this._tokenizer._cursor;
  let literal = this._eat("specialScript").value;
  let one = this._tokenizer.getSymbols(literal);
  one = this._tokenizer.specialSuperscriptsConvert(one)
  
  for (let i = 0; i < one.length; i++) {
    this._tokenizer._string.splice(cursor, 0, one[i]);
    cursor++;
  }

  this._tokenizer._cursor -= 1;
  this._lookahead = this._tokenizer.getNextToken();

  return this.soperandLiteral(cursor);
};
Parser.prototype.specialSubscriptLiteral = function() {
  let cursor = this._tokenizer._cursor;
  let literal = this._eat("specialSubscripts").value;
  let one = this._tokenizer.getSymbols(literal);
  one = this._tokenizer.specialSubscriptsConvert(one)
  
  for (let i = 0; i < one.length; i++) {
    this._tokenizer._string.splice(cursor, 0, one[i]);
    cursor++;
  }

  this._tokenizer._cursor -= 1;
  this._lookahead = this._tokenizer.getNextToken();

  return this.soperandLiteral(cursor);
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
  let output = undefined;
  if (this.isAtomsLiteral(this._lookahead?.type)) {
    output = this.atomsLiteral();
  } else if (this.isExpBracketLiteral(this._lookahead?.type)) {
    output = this.expBracketLiteral();
  } 
  
  if (this.isNumberLiteral(this._lookahead?.type) && !output) {
    output = this.numberLiteral();
  }

  return output
};
Parser.prototype.isEntityLiteral = function (tokenName) {
  return (
    this.isAtomsLiteral(tokenName) ||
    this.isExpBracketLiteral(tokenName) ||
    this.isNumberLiteral(tokenName)
  );
};
Parser.prototype.factorLiteral = function (isSubSup) {
  let next = this._tokenizer.getNextNextToken()?.type;
  if (this.isEntityLiteral(this._lookahead?.type) && 
      ((isSubSup !== undefined && next !== isSubSup) || (isSubSup === undefined && next !== "^" && next !== "_"))
      && (next !== "┴" && next !== "┬")
      && next !== "specialScript"
      )  {
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
    return entity;
  }
  else if (this.isFunctionLiteral(this._lookahead?.type)) {
    return this.functionLiteral();
  }
  else if (this.isExpScriptLiteral(this._lookahead?.type)) {
    return this.expScriptLiteral();
  }
};
Parser.prototype.isFactorLiteral = function (tokenName) {
  return (
    this.isEntityLiteral(tokenName) ||
    this.isFunctionLiteral(tokenName) ||
    (this.isExpScriptLiteral(tokenName) &&
      (this._tokenizer.getNextNextToken()?.type === "^" ||
        this._tokenizer.getNextNextToken()?.type === "_"))
  );
};
Parser.prototype.operandLiteral = function (isSubSup) {
  const factorList = [this.factorLiteral(isSubSup)];
  let next = this._tokenizer.getNextNextToken()?.type;

  while (
    this.isFactorLiteral(this._lookahead?.type) && 
    this._lookahead?.type !== "|" && 
    this._lookahead?.type !== "specialScript" && 
    this._lookahead?.type !== "specialSubscripts"
    ) {
      if (isSubSup < this._tokenizer._cursor) {
        return factorList;
      }    
    factorList.push(this.factorLiteral(isSubSup));
    next = this._tokenizer.getNextNextToken()?.type;
  }

  return factorList;
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
Parser.prototype.rectLiteral = function () {
  if (this._lookahead?.type === "▭") {
    this._eat("▭");
    if (this.isOperandLiteral(this._lookahead?.type)) {
      const token = this.operandLiteral();
      return {
        type: "rectLiteral",
        value: token,
      };
    }
  }
  return null;
};
Parser.prototype.isRectLiteral = function (tokenName) {
  return tokenName === "▭";
};
Parser.prototype.overbarLiteral = function () {
  this._eat("Diacritic")
  if (this.isOperandLiteral(this._lookahead?.type)) {
      const token = this.operandLiteral();
      return {
        type: "overbarLiteral",
        value: token,
      };
  }
  return null;
};
Parser.prototype.isOverbarLiteral = function (tokenName) {
  return this._lookahead?.value === '̄';
};

Parser.prototype.underbarLiteral = function () {
  if (this._lookahead?.type === "▁") {
    this._eat("▁");
    if (this.isOperandLiteral(this._lookahead?.type)) {
      const token = this.operandLiteral();
      return {
        type: "underbarLiteral",
        value: token,
      };
    }
  }
  return null;
};
Parser.prototype.isUnderbarLiteral = function (tokenName) {
  return tokenName === "▁";
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
Parser.prototype.isNthrtLiteral = function (tokenName) {
  return tokenName === "√(";
};
Parser.prototype.functionLiteral = function () {
  if (this.isSqrtLiteral(this._lookahead?.type)) {
    const token = this.sqrtLiteral();
    return token;
  }
  if (this.isCubertLiteral(this._lookahead?.type)) {
    const token = this.cubertLiteral();
    return token;
  }
  if (this.isFourthrtLiteral(this._lookahead?.type)) {
    const token = this.fourthrtLiteral();
    return token;
  }
  if (this.isNthrtLiteral(this._lookahead?.type)) {
    const token = this.nthrtLiteral();
    return token;
  }
  if (this.isBoxLiteral(this._lookahead?.type)) {
    const token = this.boxLiteral();
    return token;
  }
  if (this.isRectLiteral(this._lookahead?.type)) {
    const token = this.rectLiteral();
    return token;
  }
  if (this.isOverbarLiteral(this._lookahead?.type)) {
    const token = this.overbarLiteral();
    return token;
  }
  if (this.isUnderbarLiteral(this._lookahead?.type)) {
    const token = this.underbarLiteral();
    return token;
  }
  if (this.isHbrackLiteral(this._lookahead?.type)) {
    const token = this.hbrackLiteral();
    return token;
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
    this.isRectLiteral(tokenName) ||
    this.isOverbarLiteral(tokenName) ||
    this.isUnderbarLiteral(tokenName) ||
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
    const fracList = this.fractionLiteral();
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
Parser.prototype.fractionLiteral = function (numerator) {
  if (numerator === undefined) {
    numerator = this.numeratorLiteral();
  }
  
  if (this._lookahead?.type === "opOver") {
    const opOver = this.opOverLiteral();

    if (this.isOperandLiteral(this._lookahead?.type)) {
      const operand = this.operandLiteral();

      let fracs = this._fractionLiteral(operand);
      return {
        type: "fractionLiteral",
        numerator,
        opOver,
        operand: fracs?.length === 0 || fracs === null ? operand : fracs,
      };
    }
  }
  if (this._lookahead?.type === "¦") {
    this._eat("¦");
    if (this.isNumeratorLiteral(this._lookahead?.type)) {
      const operand = this.numeratorLiteral();
      return {
        type: "binomLiteral",
        numerator,
        operand,
      };
    }
  }
  return null;
};
Parser.prototype.isFractionLiteral = function (tokenName) {
  const nextNextToken = this._tokenizer.getNextNextToken();
  return (
    this.isNumeratorLiteral(tokenName) &&
    (nextNextToken?.type === "opOver" || nextNextToken?.type === "¦")
  );
};
Parser.prototype._fractionLiteral = function(numerator) {
  if (this._lookahead?.type === "opOver") {
    const opOver = this.opOverLiteral();
    if (this.isOperandLiteral(this._lookahead?.type)) {
      const operand = this.operandLiteral();
      let fracs = [];
      while (this._isFractionLiteral(this._lookahead?.type)) {
        fracs.push(this._fractionLiteral(operand));
      }
      return {
        type: "fractionLiteral",
        numerator,
        opOver,
        operand: fracs.length === 0 ? operand : fracs,
      }
    }
  } 
  else {
    return null;
  }
};
Parser.prototype._isFractionLiteral = function (tokenName) {
  return tokenName === "opOver";
};
//TODO: add array
Parser.prototype.elementLiteral = function () {
  if (this.isFractionLiteral(this._lookahead?.type)) {
    return this.fractionLiteral();
  }
  if (this.isOperandLiteral(this._lookahead?.type)) {
    return this.operandLiteral();
  }
};
Parser.prototype.isElementLiteral = function (tokenName) {
  return this.isFractionLiteral(tokenName) || this.isOperandLiteral(tokenName);
};
Parser.prototype.expLiteral = function () {
  const expList = [this.elementLiteral()];

  let ap = this.someCalc(expList);
  if (ap) {
    expList.push(ap);
  }

  while ( this._lookahead?.type !== "|" &&
    this.isElementLiteral(this._lookahead?.type) ||
    this.isOtherLiteral(this._lookahead?.type) 
  ) {
    if (this.isOtherLiteral(this._lookahead?.type)) {
      expList.push(this.otherLiteral());
    } else if (this.isElementLiteral(this._lookahead?.type)) {
      expList.push(this.elementLiteral());
    }

    ap = this.someCalc(expList);
    if (ap) {
      expList.push(ap);
    }
  }

  return {
    type: "expLiteral",
    value: expList,
  };
};
Parser.prototype.someCalc = function (expList) {
  let prevElement = expList[expList.length - 1];
  if (prevElement) {
    let lenOfCh = prevElement?.length;
    prevElement = prevElement[lenOfCh - 1];
    if (prevElement?.close) {
      if (this._lookahead?.type === "opOver" || this._lookahead?.type === "¦") {
        const numerator = expList.pop();
        return this.fractionLiteral(numerator);
      } 
      
      else if (this._lookahead?.type === "^" || this._lookahead?.type === "_") {
        const base = expList.pop();
        return this.expSubsupLiteral(base);
      }

      else if (this._lookahead?.type === "┬" || this._lookahead?.type === "┴") {
        const base = expList.pop();
        return this.expSubsupLiteral(base);
      }
    }

    if (
      this._lookahead?.type == "▒" &&
      (prevElement?.type === "naryLiteral" ||
        prevElement?.type === "expSuperscript" ||
        prevElement?.type === "expSubscript" ||
        prevElement?.type === "expSubsup")
    ) {
      this._eat("▒");
      expList[expList.length - 1].exp = this.elementLiteral();
    }
  }
};
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

//=====================Tokenizer====================//

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
	")", "]", "}", "〉",
	"(", "[", "{", "〈",
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
  
	"+",
	"-",
	"*",
  
  "/", "∕", "⊘",
  "^", "_", "√", "∛", "∜", "□", "/", "|",
  "⏜", "⏝", "⎴", "⎵", "⏞", "⏟", "⏠", "⏡",
  ",", ".",
  "&", "■",
  
  ];
  const AutoCorrect = [
	[/^\\above/, 0x2534],
	[/^\\acute/, 0x0301],
	[/^\\aleph/, 0x2135],
	[/^\\alpha/, 0x03b1],
	[/^\\amalg/, 0x2210],
	[/^\\angle/, 0x2220],
	[/^\\aoint/, 0x2233],
	[/^\\approx/, 0x2248],
	[/^\\asmash/, 0x2b06],
	[/^\\ast/, 0x2217],
	[/^\\asymp/, 0x224d],
	[/^\\atop/, 0x00a6],
	[/^\\Bar/, 0x033f],
	[/^\\bar/, 0x0305],
	[/^\\because/, 0x2235],
	[/^\\begin/, 0x3016],
	[/^\\below/, 0x252c],
	[/^\\beta/, 0x03b2],
	[/^\\beth/, 0x2136],
	[/^\\bot/, 0x22a5],
	[/^\\bigcap/, 0x22c2],
	[/^\\bigcup/, 0x22c2],
	[/^\\bigodot/, 0x2a00],
	[/^\\bigoplus/, 0x2a01],
	[/^\\bigotimes/, 0x2a02],
	[/^\\bigsqcup/, 0x2a06],
	[/^\\biguplus/, 0x2a04],
	[/^\\bigvee/, 0x22c1],
	[/^\\bigwedge/, 0x22c0],
	[/^\\bowtie/, 0x22c8],
	[/^\\box/, 0x25a1],
	[/^\\bra/, 0x27e8],
	[/^\\breve/, 0x0306],
	[/^\\bullet/, 0x2219],
	[/^\\cap/, 0x2229],
	[/^\\cbrt/, 0x221b],
	[/^\\cdot/, 0x22c5],
	[/^\\cdots/, 0x22ef],
	[/^\\check/, 0x030c],
	[/^\\chi/, 0x03c7],
	[/^\\circ/, 0x2218],
	[/^\\close/, 0x2524],
	[/^\\clubsuit/, 0x2663],
	[/^\\coint/, 0x2232],
	[/^\\cong/, 0x2245],
	[/^\\cup/, 0x222a],
	[/^\\daleth/, 0x2138],
	[/^\\dashv/, 0x22a3],
	[/^\\Dd/, 0x2145],
	[/^\\dd/, 0x2146],
	[/^\\ddddot/, 0x20dc],
	[/^\\dddot/, 0x20db],
	[/^\\ddot/, 0x0308],
	[/^\\ddots/, 0x22f1],
	[/^\\degree/, 0x00b0],
	[/^\\Delta/, 0x0394],
	[/^\\delta/, 0x03b4],
	[/^\\diamond/, 0x22c4],
	[/^\\diamondsuit/, 0x2662],
	[/^\\div/, 0x00f7],
	[/^\\dot/, 0x0307],
	[/^\\doteq/, 0x2250],
	[/^\\dots/, 0x2026],
	[/^\\Downarrow/, 0x21d3],
	[/^\\downarrow/, 0x2193],
	[/^\\dsmash/, 0x2b07],
	[/^\\ee/, 0x2147],
	[/^\\ell/, 0x2113],
	[/^\\emptyset/, 0x2205],
	[/^\\emsp/, 0x2003],
	[/^\\end/, 0x3017],
	[/^\\ensp/, 0x2002],
	[/^\\epsilon/, 0x03f5],
	[/^\\eqarray/, 0x2588],
	[/^\\eqno/, 0x0023],
	[/^\\equiv/, 0x2261],
	[/^\\eta/, 0x03b7],
	[/^\\exists/, 0x2203],
	[/^\\forall/, 0x2200],
	[/^\\funcapply/, 0x2061],
	[/^\\Gamma/, 0x0393],
	[/^\\gamma/, 0x03b3],
	[/^\\ge/, 0x2265],
	[/^\\geq/, 0x2265],
	[/^\\gets/, 0x2190],
	[/^\\gg/, 0x226b],
	[/^\\gimel/, 0x2137],
	[/^\\grave/, 0x0300],
	[/^\\hairsp/, 0x200a],
	[/^\\hat/, 0x0302],
	[/^\\hbar/, 0x210f],
	[/^\\heartsuit/, 0x2661],
	[/^\\hookleftarrow/, 0x21a9],
	[/^\\hookrightarrow/, 0x21aa],
	[/^\\hphantom/, 0x2b04],
	[/^\\hsmash/, 0x2b0c],
	[/^\\hvec/, 0x20d1],
	[/^\\ii/, 0x2148],
	[/^\\iiiint/, 0x2a0c],
	[/^\\iiint/, 0x222d],
	[/^\\iint/, 0x222c],
	[/^\\Im/, 0x2111],
	[/^\\imath/, 0x0131],
	[/^\\in/, 0x2208],
	[/^\\inc/, 0x2206],
	[/^\\infty/, 0x221e],
	[/^\\int/, 0x222b],
	[/^\\iota/, 0x03b9],
	[/^\\jj/, 0x2149],
	[/^\\jmath/, 0x0237],
	[/^\\kappa/, 0x03ba],
	[/^\\ket/, 0x27e9],
	[/^\\Lambda/, 0x039b],
	[/^\\lambda/, 0x03bb],
	[/^\\langle/, 0x27e8],
	[/^\\lbrace/, 0x007b],
	[/^\\lbrack/, 0x005b],
	[/^\\lceil/, 0x2308],
	[/^\\ldiv/, 0x2215],
	[/^\\ldots/, 0x2026],
	[/^\\le/, 0x2264],
	[/^\\Leftarrow/, 0x21d0],
	[/^\\leftarrow/, 0x2190],
	[/^\\leftharpoondown/, 0x21bd],
	[/^\\leftharpoonup/, 0x21bc],
	[/^\\Leftrightarrow/, 0x21d4],
	[/^\\leftrightarrow/, 0x2194],
	[/^\\leq/, 0x2264],
	[/^\\lfloor/, 0x230a],
	[/^\\ll/, 0x226a],
	[/^\\Longleftarrow/, 0x27f8],
	[/^\\longleftarrow/, 0x27f5],
	[/^\\Longleftrightarrow/, 0x27fa],
	[/^\\longleftrightarrow/, 0x27f7],
	[/^\\Longrightarrow/, 0x27f9],
	[/^\\longrightarrow/, 0x27f6],
	[/^\\mapsto/, 0x21a6],
	[/^\\matrix/, 0x25a0],
	[/^\\medsp/, 0x205f],
	[/^\\mid/, 0x2223],
	[/^\\models/, 0x22a8],
	[/^\\mp/, 0x2213],
	[/^\\mu/, 0x03bc],
	[/^\\nabla/, 0x2207],
	[/^\\naryand/, 0x2592],
	[/^\\nbsp/, 0x00a0],
	[/^\\ndiv/, 0x2298],
	[/^\\ne/, 0x2260],
	[/^\\nearrow/, 0x2197],
	[/^\\neg/, 0x00ac],
	[/^\\neq/, 0x2260],
	[/^\\ni/, 0x220b],
	[/^\\norm/, 0x2016],
	[/^\\nu/, 0x03bd],
	[/^\\nwarrow/, 0x2196],
	[/^\\odot/, 0x2299],
	[/^\\of/, 0x2592],
	[/^\\oiiint/, 0x2230],
	[/^\\oiint/, 0x222f],
	[/^\\oint/, 0x222e],
	[/^\\Omega/, 0x03a9],
	[/^\\omega/, 0x03c9],
	[/^\\ominus/, 0x2296],
	[/^\\open/, 0x251c],
	[/^\\oplus/, 0x2295],
	[/^\\oslash/, 0x2298],
	[/^\\otimes/, 0x2297],
	[/^\\over/, 0x002f],
	[/^\\overbar/, 0x00af],
	[/^\\overbrace/, 0x23de],
	[/^\\overparen/, 0x23dc],
	[/^\\parallel/, 0x2225],
	[/^\\partial/, 0x2202],
	[/^\\phantom/, 0x27e1],
	[/^\\Phi/, 0x03a6],
	[/^\\phi/, 0x03d5],
	[/^\\Pi/, 0x03a0],
	[/^\\pi/, 0x03c0],
	[/^\\pm/, 0x00b1],
	[/^\\pppprime/, 0x2057],
	[/^\\ppprime/, 0x2034],
	[/^\\pprime/, 0x2033],
	[/^\\prcue/, 0x227c],
	[/^\\prec/, 0x227a],
	[/^\\preceq/, 0x2aaf],
	[/^\\preccurlyeq/, 0x227c],
	[/^\\prime/, 0x2032],
	[/^\\prod/, 0x220f],
	[/^\\propto/, 0x221d],
	[/^\\Psi/, 0x03a8],
	[/^\\psi/, 0x03c8],
	[/^\\qdrt/, 0x221c],
	[/^\\rangle/, 0x27e9],
	[/^\\ratio/, 0x2236],
	[/^\\rbrace/, 0x007d],
	[/^\\rbrack/, 0x005d],
	[/^\\rceil/, 0x2309],
	[/^\\rddots/, 0x22f0],
	[/^\\Re/, 0x211c],
	[/^\\rect/, 0x25ad],
	[/^\\rfloor/, 0x230b],
	[/^\\rho/, 0x03c1],
	[/^\\Rightarrow/, 0x21d2],
	[/^\\rightarrow/, 0x2192],
	[/^\\rightharpoondown/, 0x21c1],
	[/^\\rightharpoonup/, 0x21c0],
	[/^\\rrect/, 0x25a2],
	[/^\\sdiv/, 0x2044],
	[/^\\searrow/, 0x2198],
	[/^\\setminus/, 0x2216],
	[/^\\Sigma/, 0x03a3],
	[/^\\sigma/, 0x03c3],
	[/^\\sim/, 0x223c],
	[/^\\simeq/, 0x2243],
	[/^\\smash/, 0x2b0d],
	[/^\\spadesuit/, 0x2660],
	[/^\\sqcap/, 0x2293],
	[/^\\sqcup/, 0x2294],
	[/^\\sqrt/, 0x221a],
	[/^\\sqsubseteq/, 0x2291],
	[/^\\sqsuperseteq/, 0x2292],
	[/^\\star/, 0x22c6],
	[/^\\subset/, 0x2282],
	[/^\\subseteq/, 0x2286],
	[/^\\succ/, 0x227b],
	[/^\\succeq/, 0x227d],
	[/^\\sum/, 0x2211],
	[/^\\superset/, 0x2283],
	[/^\\superseteq/, 0x2287],
	[/^\\swarrow/, 0x2199],
	[/^\\tau/, 0x03c4],
	[/^\\therefore/, 0x2234],
	[/^\\Theta/, 0x0398],
	[/^\\theta/, 0x03b8],
	[/^\\thicksp/, 0x2005],
	[/^\\thinsp/, 0x2006],
	[/^\\tilde/, 0x0303],
	[/^\\times/, 0x00d7],
	[/^\\to/, 0x2192],
	[/^\\top/, 0x22a4],
	[/^\\tvec/, 0x20e1],
	[/^\\underbar/, 0x2581],
	[/^\\underbrace/, 0x23df],
	[/^\\underparen/, 0x23dd],
	[/^\\Uparrow/, 0x21d1],
	[/^\\uparrow/, 0x2191],
	[/^\\Updownarrow/, 0x21d5],
	[/^\\updownarrow/, 0x2195],
	[/^\\uplus/, 0x228e],
	[/^\\Upsilon/, 0x03a5],
	[/^\\upsilon/, 0x03c5],
	[/^\\varepsilon/, 0x03b5],
	[/^\\varphi/, 0x03c6],
	[/^\\varpi/, 0x03d6],
	[/^\\varrho/, 0x03f1],
	[/^\\varsigma/, 0x03c2],
	[/^\\vartheta/, 0x03d1],
	[/^\\vbar/, 0x2502],
	[/^\\vdash/, 0x22a2],
	[/^\\vdots/, 0x22ee],
	[/^\\vec/, 0x20d7],
	[/^\\vee/, 0x2228],
	[/^\\Vert/, 0x2016],
	[/^\\vert/, 0x007c],
	[/^\\vphantom/, 0x21f3],
	[/^\\vthicksp/, 0x2004],
	[/^\\wedge/, 0x2227],
	[/^\\wp/, 0x2118],
	[/^\\wr/, 0x2240],
	[/^\\Xi/, 0x039e],
	[/^\\xi/, 0x03be],
	[/^\\zeta/, 0x03b6],
	[/^\\zwnj/, 0x200c],
	[/^\\zwsp/, 0x200b],
	[/^\\root/, 0x221a],
	[/^\\boxdot/, 0x22a1],
	[/^\\boxminus/, 0x229f],
	[/^\\boxplus/, 0x229e],
	[/^\\degc/, 0x2103],
	[/^\\degf/, 0x2109],
	[/^\\Deltaeq/, 0x225c],
	[/^\\frown/, 0x2311],
	[/^\\left/, 0x251c],
	[/^\\lmoust/, 0x23b0],
	[/^\\contain/, 0x220b],
	[/^\\perp/, 0x22a5],
	[/^\\right/, 0x2524],
	[/^\\rmoust/, 0x23b1],
	[/^\\smile/, 0x2323],
	[/^\\overbracket/, 0x23b4],
	[/^\\underbracket/, 0x23b5],
	[/^\\overshell/, 0x23e0],
	[/^\\undershell/, 0x23e1],
  ];
  const specialSuperscripts = [ "⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹","ⁱ","ⁿ","⁺","⁻","⁼","⁽","⁾"];
  const specialSubscripts = [ "₀","₁","₂","₃","₄","₅","₆","₇","₈","₉","₊","₋","₌","₍","₎"];
  const Spec = [
	[ function (str) { return checkRule(str, arrOpNary)}, "opNary" ],
	[ function (str) { return checkRule(str, [")", "]", "}", "〉"])}, "opClose"],
	[ function (str) { return checkRule(str, ["(", "[", "{", "〈"])}, "opOpen"],
  
	[ function (str) { return checkRule(str, "├")}, "├" ],
	[ function (str) { return checkRule(str, "┤")}, "┤" ],
	[ function (str) { return checkRule(str, "┬")}, "┬" ],
	[ function (str) { return checkRule(str, "┴")}, "┴" ],
  
	[ function (str) {
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
	}, "specialScript" ],
  
	[ function (str) {
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
	}, "specialSubscripts" ],
  
	// MathOperators:
	[ function (str) {return checkRule(str, "▁")}, "▁" ],
	[ function (str) {return checkRule(str, "▭")}, "▭" ],
	[ function (str) {return checkRule(str, "□")}, "□" ],
	[ function (str) {return checkRule(str, "&")}, "&" ],
	[ function (str) {return checkRule(str, "!")}, "!" ],
	[ function (str) {return checkRule(str, "▒")}, "▒" ],
	[ function (str) {return checkRule(str, "|")}, "|" ],
	[ function (str) {return checkRule(str, "∞")}, "∞" ],
	[ function (str) {return checkRule(str, "^")}, "^" ],
	[ function (str) {return checkRule(str, "_")}, "_" ],
	[ function (str) {return checkRule(str, "¦")}, "¦" ],
  
	[function (str) {return checkRule(str, "+")}, "Char"],
	[function (str) {return checkRule(str, "-")}, "Char"],
	[function (str) {return checkRule(str, "*")}, "Char"],
  
	[function (str) {return checkRule(str, {seq : ["!", "!"]})}, "!!"],
	[function (str) {return checkRule(str, {seq : ["|", "|"]})}, "||"],
	[function (str) {return checkRule(str, {seq : ["-", "∞"]})}, "-∞"],
	[function (str) {return checkRule(str, {seq : ["√", "("]})}, "√("],
  
	[function (str) {return checkRule(str, "√")}, "√"],
	[function (str) {return checkRule(str, "∛")}, "∛"],
	[function (str) {return checkRule(str, "∜")}, "∜"],
	[function (str) {return checkRule(str, ["/", "∕", "⊘"])}, "opOver"],
	[function (str) {return checkRule(str, ["^", "_", "√", "∛", "∜", "□", "/", "|"])}, "opBuildup"],
	[function (str) {return checkRule(str, ["⏜", "⏝", "⎴", "⎵", "⏞", "⏟", "⏠", "⏡"])}, "opHbracket"],
	[function (str) {return checkRule(str, [",", "."])}, "opDecimal"],
	[function (str) {return checkRule(str, ["&", "■"])}, "opArray"], //add \x{000B}
  
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
	// anMATH:
	[/^[\uE000-\uE3FF\u2102-\u2131\u2133\u2134]/, "anMath" ],
  
	// ------------------------------------------
	// AnOther:𝛽
	[ function (str) {return checkRule(str, anOther)}, "anOther" ],
  
	// ------------------------------------------
	// Numbers:
	[function (str) {
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
	}, "nASCII"],
  
	// ------------------------------------------
	// aASCII:
	[function (str) {
	  let index = 0;
	  let literal = str[index];
	  let out = "";
	  let code = literal.charCodeAt();
  
	  while ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
		out += literal;
		index++;
		if (str[index]) {
		  literal = str[index];
		  code = literal.charCodeAt();
		} else {
		  return out
		}
	  }
  
	  if (out != "") {
		return out;
	  }
	  return null;
	}, "aASCII"],
  
	// ------------------------------------------
	// Space:
	[ function (str) {return checkRule(str, " ")}, "Space" ],
  
	// ------------------------------------------
	// Char:
	[ function (str) {
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
			!specialSuperscripts.includes(literal) &&
			!specialSubscripts.includes(literal) &&
			literal !== " ") {
		  out += literal;
		  index++;
		  literal = str[index];
		}
		if (out === "") {
		  return null;
		}
		return out;
	}, "Char" ],
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
	  }
	  else {
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
	} else if (typeof data === 'object') {
	  return seqChar(str, data.seq);
	}
  }

  Tokenizer.prototype.specialSuperscripts = specialSuperscripts;
  Tokenizer.prototype.specialSubscripts = specialSubscripts;
  Tokenizer.prototype.specialSuperscriptsConvert = function(arr) {
	const arrReal = ["0","1","2","3","4","5","6","7","8","9","i","n","+","-","=","(",")"];
	let outArr = [];
	for (let i = 0; i < arr.length; i++) {
	  let index = specialSuperscripts.indexOf(arr[i]);
	  if (typeof index !== "number") {
		return null;
	  }
	  outArr.push(arrReal[index]);
	 
	}
	return outArr;
  }
  Tokenizer.prototype.specialSubscriptsConvert = function(arr) {
	const arrReal = ["0","1","2","3","4","5","6","7","8","9","+","-","=","(",")"];
	let outArr = [];
	for (let i = 0; i < arr.length; i++) {
	  let index = specialSubscripts.indexOf(arr[i]);
	  if (typeof index !== "number") {
		return null;
	  }
	  outArr.push(arrReal[index]);
	 
	}
	return outArr;
  }

  function Tokenizer() {
	this._string = undefined;
	this._cursor = undefined;
  }
  Tokenizer.prototype.init = function (string) {
	this._string = this.getSymbols(string);
	this._cursor = 0;
  };
  Tokenizer.prototype.cursor = function () {
	return this._cursor;
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
	  this._string = String.fromCharCode(token) + this._string;
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
  Tokenizer.prototype._match = function (regexp, string) {
	var matched = null;
	if (typeof regexp === "function") {
	  matched = regexp(string);
	}
  
	if (matched === null || matched === undefined) {
	  return null;
	}
  
	this._cursor += this.getSymbols(matched).length;
	return matched;
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
  Tokenizer.prototype._matchSpecial = function (regexp, string) {
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
  Tokenizer.prototype.getSymbols = function (string) {
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
  }

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
