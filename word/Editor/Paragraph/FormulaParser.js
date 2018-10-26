/**
 * Created by Sergey on 06.10.2018.
 */
(function (undefined) {

    var sIdentifier = '(\u0009|\u0000A|\u0000D|[\u0020-\uD7FF]|[\uE000-\uFFFD]|[\u10000-\u10FFFF])+';
    var sComparison = '<=|<>|>=|=|<|>';
    var sOperator =  "<>|<=|>=|>|<|-|\\^|\\*|/|\\%|\\+|=";
    var sColumnName = '([a-z]|[A-Z]){1,2}';
    var sDecimalDigit = '[0-9]';
    var sRowName = sDecimalDigit + '+';
    var sColon = ':';
    var sComma = ',';
    var sFullStop = '\\.';
    var sWholeNumberPart = sDecimalDigit + '+';
    var sFractionalPart = sDecimalDigit + '+';
    var sConstant = sWholeNumberPart + sFullStop + sFractionalPart + '|' + '(' + sWholeNumberPart + '(' + sFullStop +')*)' + '|' + sFullStop + sFractionalPart;
    var sCellName = sColumnName + sRowName;
    var sCellCellRange = sCellName + sColon + sCellName;
    var sRowRange = sRowName + sColon + sRowName;
    var sColumnRange = sColumnName + sColon + sColumnName;
    var sCellRange = '(' + sCellCellRange + ')|(' + sRowRange + ')|(' + sColumnRange + ')';
    var sCellReference = '(' + sCellRange + ')|(' + sCellName + ')';
    var sBookmark = "[_A-Za-z]([A-Za-z0-9]{0,39})";
    var sBookmarkCellRef = sBookmark + '( +(' + sCellReference + '))*';
    var sFunctions = "ABS|AND|AVERAGE|COUNT|DEFINED|FALSE|INT|MAX|MIN|MOD|NOT|OR|PRODUCT|ROUND|SIGN|SUM|TRUE" ;

    const oComparisonOpRegExp = new RegExp(sComparison, 'g');
    const oColumnNameRegExp = new RegExp(sColumnName, 'g');
    const oCellNameRegExp = new RegExp(sCellName, 'g');
    const oRowNameRegExp = new RegExp(sRowName, 'g');
    const oCellRangeRegExp = new RegExp(sCellRange, 'g');
    const oCellCellRangeRegExp = new RegExp(sCellCellRange, 'g');
    const oRowRangeRegExp = new RegExp(sRowRange);
    const oColRangeRegExp = new RegExp(sColumnRange);
    const oCellReferenceRegExp = new RegExp(sCellReference, 'g');
    const oIdentifierRegExp = new RegExp(sIdentifier, 'g');
    const oBookmarkNameRegExp = new RegExp(sBookmark, 'g');
    const oBookmarkCellRefRegExp = new RegExp(sBookmarkCellRef, 'g');
    const oConstantRegExp = new RegExp(sConstant, 'g');
    const oOperatorRegExp = new RegExp(sOperator, 'g');
    const oFunctionsRegExp = new RegExp(sFunctions, 'gi');


    var oLettersMap = {};
    oLettersMap['A'] = oLettersMap['a'] = 0;
    oLettersMap['B'] = oLettersMap['b'] = 1;
    oLettersMap['C'] = oLettersMap['c'] = 2;
    oLettersMap['D'] = oLettersMap['d'] = 3;
    oLettersMap['E'] = oLettersMap['e'] = 4;
    oLettersMap['F'] = oLettersMap['f'] = 5;
    oLettersMap['G'] = oLettersMap['g'] = 6;
    oLettersMap['H'] = oLettersMap['h'] = 7;
    oLettersMap['I'] = oLettersMap['i'] = 8;
    oLettersMap['J'] = oLettersMap['j'] = 9;
    oLettersMap['K'] = oLettersMap['k'] = 10;
    oLettersMap['L'] = oLettersMap['l'] = 11;
    oLettersMap['M'] = oLettersMap['m'] = 12;
    oLettersMap['N'] = oLettersMap['n'] = 13;
    oLettersMap['O'] = oLettersMap['o'] = 14;
    oLettersMap['P'] = oLettersMap['p'] = 15;
    oLettersMap['Q'] = oLettersMap['q'] = 16;
    oLettersMap['R'] = oLettersMap['r'] = 17;
    oLettersMap['S'] = oLettersMap['s'] = 18;
    oLettersMap['T'] = oLettersMap['t'] = 19;
    oLettersMap['U'] = oLettersMap['u'] = 20;
    oLettersMap['V'] = oLettersMap['v'] = 21;
    oLettersMap['W'] = oLettersMap['w'] = 22;
    oLettersMap['X'] = oLettersMap['x'] = 23;
    oLettersMap['Y'] = oLettersMap['y'] = 24;
    oLettersMap['Z'] = oLettersMap['z'] = 25;

    var oDigitMap = {};
    oDigitMap['0'] = -1;
    oDigitMap['1'] = 0;
    oDigitMap['2'] = 1;
    oDigitMap['3'] = 2;
    oDigitMap['4'] = 3;
    oDigitMap['5'] = 4;
    oDigitMap['6'] = 5;
    oDigitMap['7'] = 6;
    oDigitMap['8'] = 7;
    oDigitMap['9'] = 8;


    function CParseResult(){
        this.isError = false;
        this.error = null;
        this.pos = -1;
        this.parseTree = null;
    }

    function CCalculateResult() {
        this.isError = false;
        this.value = null;
    }

    function CFormulaNode() {
        this.document = null;
        this.children = [];
    }
    CFormulaNode.prototype.calculate = function (oResult) {
    };
    CFormulaNode.prototype.isFunction = function () {
        return false;
    };
    CFormulaNode.prototype.isOperator = function () {
        return false;
    };


    function CNumberNode() {
        CFormulaNode.call(this);
        this.value = null;
    }
    CNumberNode.prototype = Object.create(CFormulaNode.prototype);
    CNumberNode.prototype.precedence = 15;

    function CListSeparatorNode() {
        CFormulaNode.call(this);
    }
    CListSeparatorNode.prototype = Object.create(CFormulaNode.prototype);
    CListSeparatorNode.prototype.precedence = 15;

    function COperatorNode(){
        CFormulaNode.call(this);
    }

    COperatorNode.prototype = Object.create(CFormulaNode.prototype);
    COperatorNode.prototype.precedence = 0;
    COperatorNode.prototype.isOperator = function(){
        return true;
    };

    function CUnaryMinusOperatorNode(){
        COperatorNode.call(this);
    }

    CUnaryMinusOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CUnaryMinusOperatorNode.prototype.precedence = 13;
    CUnaryMinusOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 1){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }

        this.children[0].calculate(oResult);
        if(!oResult.isError){
            oResult.value = -oResult.value;
        }
    };

    function CPowersAndRootsOperatorNode(){
        COperatorNode.call(this);
    }

    CPowersAndRootsOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPowersAndRootsOperatorNode.prototype.precedence = 12;
    CPowersAndRootsOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);
            if(!oResult.isError){
                oResult.value = Math.pow(a, oResult.value);
            }
        }
    };
    function CMultiplicationOperatorNode(){
        COperatorNode.call(this);
    }

    CMultiplicationOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CMultiplicationOperatorNode.prototype.precedence = 11;
    CMultiplicationOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);
            if(!oResult.isError){
                oResult.value = a * oResult.value;
            }
        }
    };

    function CDivisionOperatorNode(){
        COperatorNode.call(this);
    }

    CDivisionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CDivisionOperatorNode.prototype.precedence = 10;
    CDivisionOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = a / oResult.value;
            }
        }
    };

    function CPercentageOperatorNode(){
        COperatorNode.call(this);
    }

    CPercentageOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPercentageOperatorNode.prototype.precedence = 8;
    CPercentageOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 1){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        if(!oResult.isError){
            oResult.value /= 100.0;
        }
    };


    function CAdditionOperatorNode(){
        COperatorNode.call(this);
    }

    CAdditionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CAdditionOperatorNode.prototype.precedence = 7;
    CAdditionOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = a + oResult.value;
            }
        }
    };

    function CSubtractionOperatorNode(){
        COperatorNode.call(this);
    }

    CSubtractionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CSubtractionOperatorNode.prototype.precedence = 7;
    CSubtractionOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = a - oResult.value;
            }
        }
    };
    function CSubtractionOperatorNode(){
        COperatorNode.call(this);
    }

    function CEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CEqualToOperatorNode.prototype.precedence = 6;
    CEqualToOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a === oResult.value) ? 1.0 : 0.0;
            }
        }
    };

    function CNotEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CNotEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CNotEqualToOperatorNode.prototype.precedence = 5;
    CNotEqualToOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a !== oResult.value) ? 1.0 : 0.0;
            }
        }
    };
    function CLessThanOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOperatorNode.prototype.precedence = 4;
    CLessThanOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a < oResult.value) ? 1.0 : 0.0;
            }
        }
    };
    function CLessThanOrEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOrEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOrEqualToOperatorNode.prototype.precedence = 3;
    CLessThanOrEqualToOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a <= oResult.value) ? 1.0 : 0.0;
            }
        }
    };
    function CGreaterThanOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOperatorNode.prototype.precedence = 2;
    CGreaterThanOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a > oResult.value) ? 1.0 : 0.0;
            }
        }
    };
    function CGreaterThanOrEqualOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOrEqualOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOrEqualOperatorNode.prototype.precedence = 1;
    CGreaterThanOrEqualOperatorNode.prototype.calculate = function (oResult) {
        if(this.children.length != 2){
            oResult.isError = true;
            oResult.error = "Error in Formula";
            return;
        }
        this.children[0].calculate(oResult);
        var a;
        if(!oResult.isError){
            a = oResult.value;
            this.children[1].calculate(oResult);

            if(!oResult.isError){
                if(AscFormat.fApproxEqual(0.0, oResult.value)){
                    oResult.isError = true;
                    oResult.error = "Error in Formula";
                    return;
                }
                oResult.value = (a >= oResult.value) ? 1.0 : 0.0;
            }
        }
    };



    function CLeftParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CLeftParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CLeftParenOperatorNode.prototype.precedence = 1;
    CLeftParenOperatorNode.prototype.calculate = function (oResult) {
    };

    function CRightParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CRightParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CRightParenOperatorNode.prototype.precedence = 1;
    CRightParenOperatorNode.prototype.calculate = function (oResult) {
    };

    var oOperatorsMap = {};
    oOperatorsMap["-"] = CUnaryMinusOperatorNode;
    oOperatorsMap["^"] = CPowersAndRootsOperatorNode;
    oOperatorsMap["*"] = CMultiplicationOperatorNode;
    oOperatorsMap["/"] = CDivisionOperatorNode;
    oOperatorsMap["%"] = CPercentageOperatorNode;
    oOperatorsMap["+"] = CAdditionOperatorNode;
    oOperatorsMap["-"] = CSubtractionOperatorNode;
    oOperatorsMap["="] = CEqualToOperatorNode;
    oOperatorsMap["<>"]= CNotEqualToOperatorNode;
    oOperatorsMap["<"] = CLessThanOperatorNode;
    oOperatorsMap["<="]= CLessThanOrEqualToOperatorNode;
    oOperatorsMap[">"] = CGreaterThanOperatorNode;
    oOperatorsMap[">="] = CGreaterThanOrEqualOperatorNode;
    oOperatorsMap["("] = CLeftParenOperatorNode;
    oOperatorsMap[")"] = CRightParenOperatorNode;


    const LEFT = 0;
    const RIGHT = 1;
    const ABOVE = 2;
    const BELOW = 3;
    function CCellRangeNode(){
        CFormulaNode.call(this);
        this.bookmarkName = null;
        this.c1 = null;
        this.r1 = null;
        this.c2 = null;
        this.r2 = null;
        this.dir = null;
    }
    CCellRangeNode.prototype = Object.create(CFormulaNode.prototype);
    CCellRangeNode.prototype.getValList = function(){
        return [];
    };

    CCellRangeNode.prototype.isCell = function(){
        return this.c1 !== null && this.r1 !== null
            && this.c2 === null && this.r2 === null;
    };

    function CFunctionNode(){
        CFormulaNode.call(this);
        this.arguments = [];
    }

    CFunctionNode.prototype = Object.create(CFormulaNode.prototype);
    CFunctionNode.prototype.precedence = 14;
    CFunctionNode.prototype.minArgumentsCount = 0;
    CFunctionNode.prototype.maxArgumentsCount = 0;
    CFunctionNode.prototype.calculate = function (oResult) {
        if(oResult.bError){
            return;
        }
        if(this.arguments.length < this.minArgumentsCount
            || this.arguments.length > this.maxArgumentsCount){
            oResult.bError = true;
        }
    };
    CFunctionNode.prototype.isFunction = function () {
        return true;
    };


    function CABSFunctionNode(){
        CFunctionNode.call(this);
    }
    CABSFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CABSFunctionNode.prototype.minArgumentsCount = 1;
    CABSFunctionNode.prototype.maxArgumentsCount = 1;
    CABSFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
        if(oResult.bError){
            return;
        }
        var oArg = this.arguments[0];
        if(oArg instanceof CCellRangeNode){
            if(oArg.isCell()){
                oResult.value = Math.abs(oArg.getValList()[0]);
                return;
            }
            else{
                oResult.bError = true;
                oResult.error = "Error in Formula";
            }
        }
    };

    function CANDFunctionNode(){
        CFunctionNode.call(this);
    }
    CANDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CANDFunctionNode.prototype.minArgumentsCount = 2;
    CANDFunctionNode.prototype.maxArgumentsCount = 2;
    CANDFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CAVERAGEFunctionNode(){
        CFunctionNode.call(this);
    }
    CAVERAGEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CAVERAGEFunctionNode.prototype.minArgumentsCount = 2;
    CAVERAGEFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CAVERAGEFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CCOUNTFunctionNode(){
        CFunctionNode.call(this);
    }
    CCOUNTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CCOUNTFunctionNode.prototype.minArgumentsCount = 2;
    CCOUNTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CCOUNTFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };


    function CDEFINEDFunctionNode(){
        CFunctionNode.call(this);
    }
    CDEFINEDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CDEFINEDFunctionNode.prototype.minArgumentsCount = 2;
    CDEFINEDFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CDEFINEDFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CFALSEFunctionNode(){
        CFunctionNode.call(this);
    }
    CFALSEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CFALSEFunctionNode.prototype.minArgumentsCount = 2;
    CFALSEFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CFALSEFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CINTFunctionNode(){
        CFunctionNode.call(this);
    }
    CINTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CINTFunctionNode.prototype.minArgumentsCount = 2;
    CINTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CINTFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };
    function CMAXFunctionNode(){
        CFunctionNode.call(this);
    }
    CMAXFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMAXFunctionNode.prototype.minArgumentsCount = 2;
    CMAXFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CMAXFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CMINFunctionNode(){
        CFunctionNode.call(this);
    }
    CMINFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMINFunctionNode.prototype.minArgumentsCount = 2;
    CMINFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CMINFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CMODFunctionNode(){
        CFunctionNode.call(this);
    }
    CMODFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMODFunctionNode.prototype.minArgumentsCount = 2;
    CMODFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CMODFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CNOTFunctionNode(){
        CFunctionNode.call(this);
    }
    CNOTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CNOTFunctionNode.prototype.minArgumentsCount = 2;
    CNOTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CNOTFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CORFunctionNode(){
        CFunctionNode.call(this);
    }
    CORFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CORFunctionNode.prototype.minArgumentsCount = 2;
    CORFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CORFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CPRODUCTFunctionNode(){
        CFunctionNode.call(this);
    }
    CPRODUCTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CPRODUCTFunctionNode.prototype.minArgumentsCount = 2;
    CPRODUCTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CPRODUCTFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CROUNDFunctionNode(){
        CFunctionNode.call(this);
    }
    CROUNDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CROUNDFunctionNode.prototype.minArgumentsCount = 2;
    CROUNDFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CROUNDFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };


    function CSIGNFunctionNode(){
        CFunctionNode.call(this);
    }
    CSIGNFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CSIGNFunctionNode.prototype.minArgumentsCount = 2;
    CSIGNFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CSIGNFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CSUMFunctionNode(){
        CFunctionNode.call(this);
    }
    CSUMFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CSUMFunctionNode.prototype.minArgumentsCount = 2;
    CSUMFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CSUMFunctionNode.prototype.calculate = function (oResult) {
        CFunctionNode.prototype.calculate.call(this, oResult);
    };

    function CParseQueue() {
        this.begin = null;
    }


    var oFuncMap = {};
    oFuncMap['ABS'] = CABSFunctionNode;
    oFuncMap['AND'] = CANDFunctionNode;
    oFuncMap['AVERAGE'] = CAVERAGEFunctionNode;
    oFuncMap['COUNT'] = CCOUNTFunctionNode;
    oFuncMap['DEFINED'] = CDEFINEDFunctionNode;
    oFuncMap['FALSE'] = CFALSEFunctionNode;
    oFuncMap['INT'] = CINTFunctionNode;
    oFuncMap['MAX'] = CMAXFunctionNode;
    oFuncMap['MIN'] = CMINFunctionNode;
    oFuncMap['MOD'] = CMODFunctionNode;
    oFuncMap['NOT'] = CNOTFunctionNode;
    oFuncMap['OR'] = CORFunctionNode;
    oFuncMap['PRODUCT'] = CPRODUCTFunctionNode;
    oFuncMap['ROUND'] = CROUNDFunctionNode;
    oFuncMap['SIGN'] = CSIGNFunctionNode;
    oFuncMap['SUM'] = CSUMFunctionNode;


    function CFormulaParser(sListSeparator, sDigitSeparator){
        this.listSeparator = sListSeparator;
        this.digitSeparator = sDigitSeparator;

        this.formula = null;
        this.pos = 0;
        this.parseQueue = null;
        this.bUnary = true;
        this.error = null;
    }

    CFormulaParser.prototype.checkExpression = function(oRegExp, fCallback){
        oRegExp.lastIndex = this.pos;
        var oRes = oRegExp.exec(this.formula);
        if(oRes && oRes.index === this.pos){
            var ret = fCallback.call(this, this.pos, oRegExp.lastIndex);
            this.pos = oRegExp.lastIndex;
            return ret;
        }
        return null;
    };


    CFormulaParser.prototype.parseNumber = function(nStartPos, nEndPos){
        var ret = new CNumberNode();
        ret.value = parseFloat(this.formula.slice(nStartPos, nEndPos));
        return ret;
    };


    CFormulaParser.prototype.parseCoord = function(nStartPos, nEndPos, oMap, nBase){
        var nRet = 0;
        var nMultiplicator = 1;
        for(var i = nEndPos - 1; i >= nStartPos; --i){
            nRet += oMap[this.formula[i]]*nMultiplicator;
            nMultiplicator *= nBase;
        }
        return nRet;
    };

    CFormulaParser.prototype.parseCol = function(nStartPos, nEndPos){
        return this.parseCoord(nStartPos, nEndPos, oLettersMap, 26);
    };

    CFormulaParser.prototype.parseRow = function(nStartPos, nEndPos){
        return this.parseCoord(nStartPos, nEndPos, oDigitMap, 10);
    };

    CFormulaParser.prototype.parseCellName = function(){
        var c, r;
        c = this.checkExpression(oColumnNameRegExp, this.parseCol);
        if(c === null){
            return null;
        }
        r = this.checkExpression(oRowNameRegExp, this.parseRow);
        if(r === null){
            return null;
        }
        var oRet = new CCellRangeNode();
        oRet.c1 = c;
        oRet.r1 = r;
        return oRet;
    };

    CFormulaParser.prototype.parseCellCellRange = function (nStart, nEndPos) {

        var oFirstCell, oSecondCell;
        oFirstCell = this.checkExpression(oCellNameRegExp, this.parseCellName);
        if(oFirstCell === null){
            return null;
        }
        oSecondCell = this.checkExpression(oCellNameRegExp, this.parseCellName);
        if(oSecondCell === null){
            return null;
        }
        var r1, r2, c1, c2;
        r1 = Math.min(oFirstCell.r1, oSecondCell.r1);
        r2 = Math.max(oFirstCell.r1, oSecondCell.r1);
        c1 = Math.min(oFirstCell.c1, oSecondCell.c1);
        c2 = Math.max(oFirstCell.c1, oSecondCell.c1);
        oFirstCell.r1 = r1;
        oFirstCell.r2 = r2;
        oFirstCell.c1 = c1;
        oFirstCell.c2 = c2;
        return oFirstCell;
    };

    CFormulaParser.prototype.parseRowRange = function(nStartPos, nEndPos){
        var r1, r2;
        r1 = this.checkExpression(oRowNameRegExp, this.parseRow);
        if(r1 === null){
            return null;
        }
        this.pos++;
        r2 = this.checkExpression(oRowNameRegExp, this.parseRow);
        if(r2 === null){
            return null;
        }
        var oRet = new CCellRangeNode();
        oRet.r1 = Math.min(r1, r2);
        oRet.r2 = Math.max(r1, r2);
        return oRet;
    };

    CFormulaParser.prototype.parseColRange = function(nStartPos, nEndPos){
        var c1, c2;
        c1 = this.checkExpression(oColumnNameRegExp, this.parseCol);
        if(c1 === null){
            return null;
        }
        this.pos++;
        c2 = this.checkExpression(oColumnNameRegExp, this.parseCol);
        if(c2 === null){
            return null;
        }
        var oRet = new CCellRangeNode();
        oRet.c1 = Math.min(c1, c2);
        oRet.c2 = Math.max(c1, c2);
        return oRet;
    };

    CFormulaParser.prototype.parseCellRange = function (nStartPos, nEndPos) {
        var oRet;
        oRet = this.checkExpression(oCellCellRangeRegExp, this.parseCellCellRange);
        if(oRet){
            return oRet;
        }
        oRet = this.checkExpression(oRowRangeRegExp, this.parseRowRange);
        if(oRet){
            return oRet;
        }
        oRet = this.checkExpression(oColRangeRegExp, this.parseColRange);
        if(oRet){
            return oRet;
        }
        return null;
    };

    CFormulaParser.prototype.parseCellRef = function(nStartPos, nEndPos){
        var oRet;
        oRet = this.checkExpression(oCellRangeRegExp, this.parseCellRange);
        if(oRet){
            return oRet;
        }
        oRet = this.checkExpression(oCellNameRegExp, this.parseCellName);
        if(oRet){
            return oRet;
        }
        return null;
    };

    CFormulaParser.prototype.parseBookmark = function (nStartPos, nEndPos) {
        var oRet = new CCellRangeNode();
        oRet.bookmarkName = this.formula.slice(nStartPos, nEndPos);
        return oRet;
    };

    CFormulaParser.prototype.parseBookmarkCellRef = function(nStartPos, nEndPos){
        var oResult = this.checkExpression(oBookmarkNameRegExp, this.parseBookmark);
        if(oResult === null){
            return null;
        }
        if(this.pos < nEndPos){
            while(this.formula[this.pos] === ' '){
                ++this.pos;
            }
            var oRes = this.checkExpression(oCellReferenceRegExp, this.parseCellRef);
            if(oRes){
                oRes.bookmarkName = oResult.bookmarkName;
                return oRes;
            }
        }
        return oResult;
    };


    CFormulaParser.prototype.parseOperator = function(nStartPos, nEndPos){
        var sOperator = this.formula.slice(nStartPos, nEndPos);
        if(sOperator === '-'){
            if(this.bUnary){
                return new CUnaryMinusOperatorNode();
            }
            else {
                this.bUnary = true;
                return new CSubtractionOperatorNode();
            }
        }
        if(oOperatorsMap[sOperator]){
            this.bUnary = true;
            return new oOperatorsMap[sOperator]();
        }
        return null;
    };

    CFormulaParser.prototype.parseFunction = function(nStartPos, nEndPos){
        var sFunction = this.formula.slice(nStartPos, nEndPos);
        if(oFuncMap[sFunction]){
            return new oFuncMap[sFunction]();
        }
        return null;
    };

    CFormulaParser.prototype.parseCurrent = function () {
        while(this.formula[this.pos] === ' '){
            ++this.pos;
        }
        if(this.pos >= this.formula.length){
            return null;
        }
        //check parentheses
        if(this.formula[this.pos] === '('){
            ++this.pos;
            this.bUnary = true;
            return new CLeftParenOperatorNode();
        }
        if(this.formula[this.pos] === ')'){
            ++this.pos;
            this.bUnary = false;
            return new CRightParenOperatorNode();
        }
        if(this.formula[this.pos] === ','){
            ++this.pos;
            return new CListSeparatorNode();
        }
        var oRet;
        //check operators
        oRet = this.checkExpression(oOperatorRegExp, this.parseOperator);
        if(oRet){
            return oRet;
        }
        //check number
        oRet = this.checkExpression(oConstantRegExp, this.parseNumber);
        if(oRet){
            this.bUnary = false;
            return oRet;
        }
        //check function
        oRet = this.checkExpression(oFunctionsRegExp, this.parseFunction);
        if(oRet){
            return oRet;
        }
        //check bookmark
        oRet = this.checkExpression(oBookmarkCellRefRegExp, this.parseBookmarkCellRef);
        if(oRet){
            this.bUnary = false;
            return oRet;
        }
        //check cell reference
        var oRes = this.checkExpression(oCellReferenceRegExp, this.parseCellRef);
        if(oRes){
            this.bUnary = false;
            return oRes;
        }
        return null;
    };

    CFormulaParser.prototype.parse = function(sFormula){
        var oParseResult = new CParseResult();

        this.pos = 0;
        this.formula = sFormula;
        this.parseQueue = null;
        this.error = null;
        if(typeof sFormula !== "string"){
            oParseResult = new CParseResult();
            oParseResult.isError = true;
            oParseResult.error = "Illegal Argument Type";
            return oParseResult;
        }
        this.parseQueue = new CParseQueue();
        var oCurToken;
        var aStack = [], aQueue = [];
        var ret = [];
        while (oCurToken = this.parseCurrent()){
            if(oCurToken instanceof CNumberNode || oCurToken instanceof CCellRangeNode){
                aQueue.push(oCurToken);
            }
            if(oCurToken.isFunction()){
                aStack.push(oCurToken);
            }
            if(oCurToken instanceof CListSeparatorNode){
                while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                   aQueue.push(aStack.pop());
                }
                if(aStack.length === 0){
                    throw "Error in formula";
                }
            }
            if(oCurToken instanceof CLeftParenOperatorNode){
                aStack.push(oCurToken);
            }
            if(oCurToken instanceof CRightParenOperatorNode){
                while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                    aQueue.push(aStack.pop());
                }
                if(aStack.length === 0){
                    throw "Error in formula";
                }
                aStack.pop();
                if(aStack[aStack.length-1] && aStack[aStack.length-1].isFunction()){
                    aQueue.push(aStack.pop());
                }
            }
            if(oCurToken.isOperator()){
                while(aStack.length > 0 && (!aStack[aStack.length-1].isFunction() || aStack[aStack.length-1].precedence >= oCurToken.precedence)){
                    aQueue.push(aStack.pop());
                }
                aStack.push(oCurToken);
            }
        }
        while (aStack.length > 0){
            oCurToken = aStack.pop();
            if(oCurToken instanceof CLeftParenOperatorNode || oCurToken instanceof CRightParenOperatorNode){
                throw "Error in formula";
            }
            aQueue.push(oCurToken);
        }
        return aQueue;
    };
    window['AscCommonWord'] = window['AscCommonWord'] || {};
    window['AscCommonWord'].CFormulaParser = CFormulaParser;
})();