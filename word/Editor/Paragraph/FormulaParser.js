/**
 * Created by Sergey on 06.10.2018.
 */
(function (undefined) {

    var sIdentifier = '(\u0009|\u0000A|\u0000D|[\u0020-\uD7FF]|[\uE000-\uFFFD]|[\u10000-\u10FFFF])+';
    var sComparison = '<=|<>|>=|=|<|>';
    var sOperator =  "<>|<=|>=|>|<|-|\\^|\\*|/|\\%|\\+|=";
    var sColumnName = '([A-Z]){1,2}';
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
    var sBookmark = "[_A-Z]([A-Z0-9]{0,39})";
    var sBookmarkCellRef = sBookmark + '( +(' + sCellReference + '))*';
    var sFunctions = "(ABS|AND|AVERAGE|COUNT|DEFINED|FALSE|INT|MAX|MIN|MOD|NOT|OR|PRODUCT|ROUND|SIGN|SUM|TRUE)" ;

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
    const oFunctionsRegExp = new RegExp(sFunctions, 'g');


    var oLettersMap = {};
    oLettersMap['A'] = 0;
    oLettersMap['B'] = 1;
    oLettersMap['C'] = 2;
    oLettersMap['D'] = 3;
    oLettersMap['E'] = 4;
    oLettersMap['F'] = 5;
    oLettersMap['G'] = 6;
    oLettersMap['H'] = 7;
    oLettersMap['I'] = 8;
    oLettersMap['J'] = 9;
    oLettersMap['K'] = 10;
    oLettersMap['L'] = 11;
    oLettersMap['M'] = 12;
    oLettersMap['N'] = 13;
    oLettersMap['O'] = 14;
    oLettersMap['P'] = 15;
    oLettersMap['Q'] = 16;
    oLettersMap['R'] = 17;
    oLettersMap['S'] = 18;
    oLettersMap['T'] = 19;
    oLettersMap['U'] = 20;
    oLettersMap['V'] = 21;
    oLettersMap['W'] = 22;
    oLettersMap['X'] = 23;
    oLettersMap['Y'] = 24;
    oLettersMap['Z'] = 25;

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


    function CFormulaNode() {
        this.document = null;
        this.result = null;
        this.error = null;
    }
    CFormulaNode.prototype.calculate = function (aArgs) {
    };
    CFormulaNode.prototype.isFunction = function () {
        return false;
    };
    CFormulaNode.prototype.isOperator = function () {
        return false;
    };
    CFormulaNode.prototype.setError = function (Type, Data) {
        this.error = new CError();
        this.error.Type = Type;
        this.error.Data = Data;
    };

    CFormulaNode.prototype.argumentsCount = 0;

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
    COperatorNode.prototype.argumentsCount = 2;
    COperatorNode.prototype.isOperator = function(){
        return true;
    };

    function CUnaryMinusOperatorNode(){
        COperatorNode.call(this);
    }

    CUnaryMinusOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CUnaryMinusOperatorNode.prototype.precedence = 13;
    CUnaryMinusOperatorNode.prototype.argumentsCount = 1;
    CUnaryMinusOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 1){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = -aArgs[0];
    };

    function CPowersAndRootsOperatorNode(){
        COperatorNode.call(this);
    }

    CPowersAndRootsOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPowersAndRootsOperatorNode.prototype.precedence = 12;
    CPowersAndRootsOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = Math.pow(aArgs[0], aArgs[1]);
    };
    function CMultiplicationOperatorNode(){
        COperatorNode.call(this);
    }

    CMultiplicationOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CMultiplicationOperatorNode.prototype.precedence = 11;
    CMultiplicationOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = aArgs[0] * aArgs[1];
    };

    function CDivisionOperatorNode(){
        COperatorNode.call(this);
    }

    CDivisionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CDivisionOperatorNode.prototype.precedence = 10;
    CDivisionOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        if(AscFormat.fApproxEqual(0.0, aArgs[1])){
            this.setError("Error in Formula", "Cannot divide by zero");
            return;
        }
        this.result = aArgs[0]/aArgs[1];
    };

    function CPercentageOperatorNode(){
        COperatorNode.call(this);
    }

    CPercentageOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPercentageOperatorNode.prototype.precedence = 8;
    CPercentageOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 1){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = aArgs[0] / 100.0;
    };


    function CAdditionOperatorNode(){
        COperatorNode.call(this);
    }

    CAdditionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CAdditionOperatorNode.prototype.precedence = 7;
    CAdditionOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = aArgs[0] + aArgs[1];
    };

    function CSubtractionOperatorNode(){
        COperatorNode.call(this);
    }

    CSubtractionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CSubtractionOperatorNode.prototype.precedence = 7;
    CSubtractionOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = aArgs[0] - aArgs[1];
    };
    function CSubtractionOperatorNode(){
        COperatorNode.call(this);
    }

    function CEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CEqualToOperatorNode.prototype.precedence = 6;
    CEqualToOperatorNode.prototype.calculate = function (aArgs) {

        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = AscFormat.fApproxEqual(aArgs[0], aArgs[1]) ? 1.0 : 0.0;
    };

    function CNotEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CNotEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CNotEqualToOperatorNode.prototype.precedence = 5;
    CNotEqualToOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = AscFormat.fApproxEqual(aArgs[0], aArgs[1]) ? 0.0 : 1.0;
    };
    function CLessThanOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOperatorNode.prototype.precedence = 4;
    CLessThanOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = (aArgs[0] < aArgs[1]) ? 1.0 : 0.0;
    };
    function CLessThanOrEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOrEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOrEqualToOperatorNode.prototype.precedence = 3;
    CLessThanOrEqualToOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = (aArgs[0] <= aArgs[1]) ? 1.0 : 0.0;
    };
    function CGreaterThanOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOperatorNode.prototype.precedence = 2;
    CGreaterThanOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = (aArgs[0] > aArgs[1]) ? 1.0 : 0.0;
    };
    function CGreaterThanOrEqualOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOrEqualOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOrEqualOperatorNode.prototype.precedence = 1;
    CGreaterThanOrEqualOperatorNode.prototype.calculate = function (aArgs) {
        if(aArgs.length != 2){
            this.setError("Error in Formula", "Calculation Error");
            return;
        }
        this.result = (aArgs[0] >= aArgs[1]) ? 1.0 : 0.0;
    };



    function CLeftParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CLeftParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CLeftParenOperatorNode.prototype.precedence = 1;
    CLeftParenOperatorNode.prototype.calculate = function (aArgs) {
    };

    function CRightParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CRightParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CRightParenOperatorNode.prototype.precedence = 1;
    CRightParenOperatorNode.prototype.calculate = function (aArgs) {
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
        return this.bookmarkName === null && this.c1 !== null && this.r1 !== null && this.c2 === null && this.r2 === null;
    };
    CCellRangeNode.prototype.isDir = function(){
        return this.dir !== null;
    };
    CCellRangeNode.prototype.isBookmarkCellRange = function(){
        return this.bookmarkName !== null && (this.c1 !== null || this.r1 !== null) && (this.c2 !== null || this.r2 !== null);
    };
    CCellRangeNode.prototype.isCellRange = function(){
        return this.bookmarkName === null && (this.c1 !== null || this.r1 !== null) && (this.c2 !== null || this.r2 !== null);
    };

    CCellRangeNode.prototype.isBookmarkCell = function(){
        return this.bookmarkName !== null && this.c1 !== null && this.r1 !== null && this.c2 === null && this.r2 === null;
    };
    CCellRangeNode.prototype.isBookmarkCellRange = function(){
        return this.bookmarkName !== null && (this.c1 !== null || this.r1 !== null) && (this.c2 !== null || this.r2 !== null);
    };
    CCellRangeNode.prototype.isBookmark = function(){
        return this.bookmarkName !== null && this.c1 === null && this.r1 === null && this.c2 === null && this.r2 === null;
    };

    function CFunctionNode(){
        CFormulaNode.call(this);
        this.arguments = [];
    }

    CFunctionNode.prototype = Object.create(CFormulaNode.prototype);
    CFunctionNode.prototype.precedence = 14;
    CFunctionNode.prototype.minArgumentsCount = 0;
    CFunctionNode.prototype.maxArgumentsCount = 0;
    CFunctionNode.prototype.calculate = function (aArgs) {
        if(this.minArgumentsCount > aArgs.length || this.maxArgumentsCount < aArgs.length){
            this.setError("Error in formula", "Arguments count");
        }
    };
    CFunctionNode.prototype.isFunction = function () {
        return true;
    };
    CFunctionNode.prototype.listSupport = function () {
        return false;
    };


    function CABSFunctionNode(){
        CFunctionNode.call(this);
    }
    CABSFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CABSFunctionNode.prototype.minArgumentsCount = 1;
    CABSFunctionNode.prototype.maxArgumentsCount = 1;
    CABSFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = Math.abs(aArgs[0]);
    };

    function CANDFunctionNode(){
        CFunctionNode.call(this);
    }
    CANDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CANDFunctionNode.prototype.minArgumentsCount = 2;
    CANDFunctionNode.prototype.maxArgumentsCount = 2;
    CANDFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = (AscFormat.fApproxEqual(aArgs[0], 0.0) || AscFormat.fApproxEqual(aArgs[1], 0.0)) ? 0.0 : 1.0;
    };

    function CAVERAGEFunctionNode(){
        CFunctionNode.call(this);
    }
    CAVERAGEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CAVERAGEFunctionNode.prototype.minArgumentsCount = 2;
    CAVERAGEFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CAVERAGEFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CAVERAGEFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        var summ = 0.0;
        for(var i = 0; i < aArgs.length; ++i){
            summ += aArgs[i];
        }
        this.result = summ/aArgs.length;
    };

    function CCOUNTFunctionNode(){
        CFunctionNode.call(this);
    }
    CCOUNTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CCOUNTFunctionNode.prototype.minArgumentsCount = 2;
    CCOUNTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CCOUNTFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CCOUNTFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = aArgs.length;
    };


    function CDEFINEDFunctionNode(){
        CFunctionNode.call(this);
    }
    CDEFINEDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CDEFINEDFunctionNode.prototype.minArgumentsCount = 2;
    CDEFINEDFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CDEFINEDFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return 0.0;//TODO
    };

    function CFALSEFunctionNode(){
        CFunctionNode.call(this);
    }
    CFALSEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CFALSEFunctionNode.prototype.minArgumentsCount = 0;
    CFALSEFunctionNode.prototype.maxArgumentsCount = 0;
    CFALSEFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return this.result = 0.0;
    };
    function CTRUEFunctionNode(){
        CFunctionNode.call(this);
    }
    CTRUEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CTRUEFunctionNode.prototype.minArgumentsCount = 0;
    CTRUEFunctionNode.prototype.maxArgumentsCount = 0;
    CTRUEFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = 1;
    };

    function CINTFunctionNode(){
        CFunctionNode.call(this);
    }
    CINTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CINTFunctionNode.prototype.minArgumentsCount = 2;
    CINTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CINTFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return (aArgs[0] >> 0);
    };
    function CMAXFunctionNode(){
        CFunctionNode.call(this);
    }
    CMAXFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMAXFunctionNode.prototype.minArgumentsCount = 2;
    CMAXFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CMAXFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CMAXFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return Math.max.apply(Math, aArgs);
    };

    function CMINFunctionNode(){
        CFunctionNode.call(this);
    }
    CMINFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMINFunctionNode.prototype.minArgumentsCount = 2;
    CMINFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CMINFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CMINFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return Math.min.apply(Math, aArgs);
    };

    function CMODFunctionNode(){
        CFunctionNode.call(this);
    }
    CMODFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMODFunctionNode.prototype.minArgumentsCount = 2;
    CMODFunctionNode.prototype.maxArgumentsCount = 2;
    CMODFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return aArgs[0] % aArgs[1];//TODO
    };

    function CNOTFunctionNode(){
        CFunctionNode.call(this);
    }
    CNOTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CNOTFunctionNode.prototype.minArgumentsCount = 1;
    CNOTFunctionNode.prototype.maxArgumentsCount = 1;
    CNOTFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return AscFormat.fApproxEqual(aArgs[0], 0.0);
    };

    function CORFunctionNode(){
        CFunctionNode.call(this);
    }
    CORFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CORFunctionNode.prototype.minArgumentsCount = 2;
    CORFunctionNode.prototype.maxArgumentsCount = 2;
    CORFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return !AscFormat.fApproxEqual(aArgs[0], 0.0) || !AscFormat.fApproxEqual(aArgs[1], 0.0);
    };

    function CPRODUCTFunctionNode(){
        CFunctionNode.call(this);
    }
    CPRODUCTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CPRODUCTFunctionNode.prototype.minArgumentsCount = 2;
    CPRODUCTFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CPRODUCTFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CPRODUCTFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = 1;
        for(var i = 0; i < aArgs.length; ++i){
            this.result *= aArgs[i];
        }
    };

    function CROUNDFunctionNode(){
        CFunctionNode.call(this);
    }
    CROUNDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CROUNDFunctionNode.prototype.minArgumentsCount = 2;
    CROUNDFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CROUNDFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        return Math.round(aArgs[0]);
    };


    function CSIGNFunctionNode(){
        CFunctionNode.call(this);
    }
    CSIGNFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CSIGNFunctionNode.prototype.minArgumentsCount = 1;
    CSIGNFunctionNode.prototype.maxArgumentsCount = 1;
    CSIGNFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        if(aArgs[0] < 0.0){
            this.result = -1.0;
        }
        else if(aArgs[1] > 0.0){
            this.result = 1.0;
        }
        else{
            this.result = 0.0;
        }
    };

    function CSUMFunctionNode(){
        CFunctionNode.call(this);
    }
    CSUMFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CSUMFunctionNode.prototype.minArgumentsCount = 2;
    CSUMFunctionNode.prototype.maxArgumentsCount = +Infinity;
    CSUMFunctionNode.prototype.listSupport = function () {
        return true;
    };
    CSUMFunctionNode.prototype.calculate = function (aArgs) {
        CFunctionNode.prototype.calculate.call(this, aArgs);
        if(this.error){
            return;
        }
        this.result = 0.0;
        for(var i = 0; i < aArgs.length; ++i){
            this.result += aArgs[i];
        }
    };

    function CParseQueue() {
        this.queue = [];
        this.result = null;
    }

    CParseQueue.prototype.calculate = function(oDocument){
        var aQueue = this.queue.slice();
        for (var i = 0; i < aQueue.length; ++i){
            var oCurToken = aQueue[i];
            if(oCurToken.isOperator() || oCurToken.isFunction()){
                var aArgs = aQueue.splice(i - oCurToken.argumentsCount, oCurToken.argumentsCount);
                oCurToken.calculate(aArgs);
                if(oCurToken.error){
                    return oCurToken.error;
                }
                aQueue[i - oCurToken.argumentsCount] = oCurToken.result;
                i = i - oCurToken.argumentsCount;
            }
            // else if(oCurToken instanceof CNumberNode){
            //     aQueue[i] = oCurToken.value;
            // }
        }
        this.result = aQueue[0];
        return null;
    };
    function CError(){
        this.Type = null;
        this.Data = null;
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


    var PARSER_MASK_LEFT_PAREN      = 1;
    var PARSER_MASK_RIGHT_PAREN     = 2;
    var PARSER_MASK_LIST_SEPARATOR  = 4;
    var PARSER_MASK_BINARY_OPERATOR = 8;
    var PARSER_MASK_UNARY_OPERATOR  = 16;
    var PARSER_MASK_NUMBER          = 32;
    var PARSER_MASK_FUNCTION        = 64;
    var PARSER_MASK_CELL_NAME       = 128;
    var PARSER_MASK_CELL_RANGE      = 256;
    var PARSER_MASK_BOOKMARK        = 512;
    var PARSER_MASK_BOOKMARK_CELL_REF = 1024;

    var ERROR_TYPE_SYNTAX_ERROR = "Syntax Error";
    var ERROR_TYPE_MISSING_OPERATOR = "Missing Operator";

    function CFormulaParser(sListSeparator, sDigitSeparator){
        this.listSeparator = ',';
        this.digitSeparator = sDigitSeparator;

        this.formula = null;
        this.pos = 0;
        this.parseQueue = null;
        this.error = null;
        this.flags = 0;//[unary opearor, binary operator,]
    }

    CFormulaParser.prototype.setFlag = function(nMask, bVal){
        if(bVal){
            this.flags |= nMask;
        }
        else{
            this.flags &= (~nMask);
        }
    };

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
        if(this.flags & PARSER_MASK_NUMBER){
            var number = parseFloat(this.formula.slice(nStartPos, nEndPos));
            if(!AscFormat.isRealNumber(number)){
                var ret = new CNumberNode();
                ret.value = number;
                return ret;
            }
        }
        return null;
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
        while (this.formula[this.pos] === ' '){
            ++this.pos;
        }
        ++this.pos;
        while (this.formula[this.pos] === ' '){
            ++this.pos;
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
        while (this.formula[this.pos] === ' '){
            ++this.pos;
        }
        ++this.pos;
        while (this.formula[this.pos] === ' '){
            ++this.pos;
        }
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
        while (this.formula[this.pos] === ' '){
            ++this.pos;
        }
        ++this.pos;
        while (this.formula[this.pos] === ' '){
            ++this.pos;
        }
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
        if(this.flags & PARSER_MASK_CELL_RANGE){
            oRet = this.checkExpression(oCellRangeRegExp, this.parseCellRange);
            if(oRet){
                return oRet;
            }
        }
        if(this.flags & PARSER_MASK_CELL_NAME){
            oRet = this.checkExpression(oCellNameRegExp, this.parseCellName);
            if(oRet){
                return oRet;
            }
        }
        return null;
    };

    CFormulaParser.prototype.parseBookmark = function (nStartPos, nEndPos) {
        if(this.flags & PARSER_MASK_BOOKMARK){
            var oRet = new CCellRangeNode();
            oRet.bookmarkName = this.formula.slice(nStartPos, nEndPos);
            return oRet;
        }
        return null;
    };

    CFormulaParser.prototype.parseBookmarkCellRef = function(nStartPos, nEndPos){

        var oResult = this.checkExpression(oBookmarkNameRegExp, this.parseBookmark);
        if(oResult === null){
            return null;
        }

        if(this.flags & PARSER_MASK_BOOKMARK_CELL_REF){
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
        }
        return oResult;
    };


    CFormulaParser.prototype.parseOperator = function(nStartPos, nEndPos){
        var sOperator = this.formula.slice(nStartPos, nEndPos);
        if(sOperator === '-'){
            if(this.flags & PARSER_MASK_UNARY_OPERATOR){
                return new CUnaryMinusOperatorNode();
            }
            else if(this.flags & PARSER_MASK_BINARY_OPERATOR) {
                return new CSubtractionOperatorNode();
            }
        }
        if(this.flags & PARSER_MASK_BINARY_OPERATOR) {
            if(oOperatorsMap[sOperator]){
                return new oOperatorsMap[sOperator]();
            }
        }
        return null;
    };

    CFormulaParser.prototype.parseFunction = function(nStartPos, nEndPos){
        if(this.flags & PARSER_MASK_FUNCTION){
            var sFunction = this.formula.slice(nStartPos, nEndPos).toUpperCase();
            if(oFuncMap[sFunction]){
                return new oFuncMap[sFunction]();
            }
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
        if((this.flags & PARSER_MASK_LEFT_PAREN) && this.formula[this.pos] === '('){
            ++this.pos;
            return new CLeftParenOperatorNode();
        }
        if((this.flags & PARSER_MASK_RIGHT_PAREN) && this.formula[this.pos] === ')'){
            ++this.pos;
            return new CRightParenOperatorNode();
        }
        if((this.flags & PARSER_MASK_LIST_SEPARATOR) && this.formula[this.pos] === this.listSeparator){
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
            return oRet;
        }
        //check function
        oRet = this.checkExpression(oFunctionsRegExp, this.parseFunction);
        if(oRet){
            return oRet;
        }
        //check cell reference
        var oRes = this.checkExpression(oCellReferenceRegExp, this.parseCellRef);
        if(oRes){
            return oRes;
        }
        //check bookmark
        oRet = this.checkExpression(oBookmarkCellRefRegExp, this.parseBookmarkCellRef);
        if(oRet){
            return oRet;
        }
        return null;
    };

    CFormulaParser.prototype.setError = function(Type, Data){
        this.parseQueue = null;
        this.error = new CError();
        this.error.Type = Type;
        this.error.Data = Data;
    };

    CFormulaParser.prototype.getErrorString = function(startPos, endPos){
        var nStartPos = startPos;
        while (nStartPos < this.formula.length){
            if(this.formula[nStartPos] === ' '){
                nStartPos++;
            }
            else{
                break;
            }
        }
        if(nStartPos < endPos){
            return this.formula.splice(nStartPos, endPos);
        }
        return "";
    };

    CFormulaParser.prototype.parse = function(sFormula){
        this.pos = 0;
        this.formula = sFormula;
        this.parseQueue = null;
        this.error = null;

        if(typeof sFormula !== "string"){
            this.setError("Illegal Argument Type", "");
            return;
        }
        this.parseQueue = new CParseQueue();
        var oCurToken;
        var aStack = [], aQueue = [];
        var aFunctionsStack = [];
        var oLastToken;
        this.setFlag(PARSER_MASK_LEFT_PAREN, true);
        this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
        this.setFlag(PARSER_MASK_LIST_SEPARATOR, false);
        this.setFlag(PARSER_MASK_BINARY_OPERATOR, false);
        this.setFlag(PARSER_MASK_UNARY_OPERATOR, true);
        this.setFlag(PARSER_MASK_NUMBER, true);
        this.setFlag(PARSER_MASK_FUNCTION, true);
        this.setFlag(PARSER_MASK_CELL_NAME, true);
        this.setFlag(PARSER_MASK_CELL_RANGE, false);
        this.setFlag(PARSER_MASK_BOOKMARK, true);
        this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
        var nStartPos = this.pos;
        while (oCurToken = this.parseCurrent()){
            if(oCurToken instanceof CNumberNode){
                if(oLastToken instanceof CNumberNode){
                    this.setError(ERROR_TYPE_MISSING_OPERATOR, null);
                    return;
                }
                if(this.flags & PARSER_MASK_NUMBER){
                    aQueue.push(oCurToken);
                    this.setFlag(PARSER_MASK_NUMBER, true);
                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                    this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                    this.setFlag(PARSER_MASK_BINARY_OPERATOR, true);
                    this.setFlag(PARSER_MASK_FUNCTION, false);
                    this.setFlag(PARSER_MASK_LIST_SEPARATOR, aFunctionsStack.length > 0);
                    this.setFlag(PARSER_MASK_CELL_NAME, false);
                    this.setFlag(PARSER_MASK_CELL_RANGE, false);
                    this.setFlag(PARSER_MASK_BOOKMARK, false);
                    this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                }
            } else if(oCurToken instanceof CCellRangeNode){
                if(oCurToken.isDir() || oCurToken.isBookmarkCellRange() || oCurToken.isCellRange()){

                }
                aQueue.push(oCurToken);
            } else if(oCurToken.isFunction()){
                if(this.flags & PARSER_MASK_FUNCTION){
                    aStack.push(oCurToken);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                    if(oCurToken.maxArgumentsCount < 1){
                        this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    }
                    else{
                        this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    }
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                }
            } else if(oCurToken instanceof CListSeparatorNode){
                if(aFunctionsStack.length > 0){
                    ++aFunctionsStack[aFunctionsStack.length-1].argumentsCount;
                    if(aFunctionsStack[aFunctionsStack.length-1].argumentsCount >= aFunctionsStack[aFunctionsStack.length-1].maxArgumentsCount){
                        this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                        return;
                    }
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
                while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                   aQueue.push(aStack.pop());
                }
                if(aStack.length === 0){
                    this.setError("Error in formula", this.formula[this.pos]);
                    return;
                }
            } else if(oCurToken instanceof CLeftParenOperatorNode){
                if(oLastToken && oLastToken.isFunction()){
                    aFunctionsStack.push(oLastToken);
                    this.setFlag(PARSER_MASK_CELL_RANGE, true);
                }
                aStack.push(oCurToken);
            } else if(oCurToken instanceof CRightParenOperatorNode){
                if(aFunctionsStack.length > 0 && aStack[0] && aStack[0].isFunction()){
                    ++aFunctionsStack[aFunctionsStack.length-1].argumentsCount;
                    aFunctionsStack.pop();
                }
                while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                    aQueue.push(aStack.pop());
                }

                if(aStack.length === 0){
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
                aStack.pop();
                if(aStack[aStack.length-1] && aStack[aStack.length-1].isFunction()){
                    aQueue.push(aStack.pop());
                }
            } else if(oCurToken.isOperator()){
                while(aStack.length > 0 && (aStack[aStack.length-1].isFunction() || aStack[aStack.length-1].precedence >= oCurToken.precedence)){
                    aQueue.push(aStack.pop());
                }
                aStack.push(oCurToken);
            }
            oLastToken = oCurToken;
            nStartPos = this.pos;
        }
        while (aStack.length > 0){
            oCurToken = aStack.pop();
            if(oCurToken instanceof CLeftParenOperatorNode || oCurToken instanceof CRightParenOperatorNode){
                this.setError("Error in formula", this.formula[this.pos]);
                return;
            }
            aQueue.push(oCurToken);
        }
        this.parseQueue.queue = aQueue;
        return aQueue;
    };
    window['AscCommonWord'] = window['AscCommonWord'] || {};
    window['AscCommonWord'].CFormulaParser = CFormulaParser;
})();