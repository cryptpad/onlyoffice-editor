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
    oLettersMap['A'] = 1;
    oLettersMap['B'] = 2;
    oLettersMap['C'] = 3;
    oLettersMap['D'] = 4;
    oLettersMap['E'] = 5;
    oLettersMap['F'] = 6;
    oLettersMap['G'] = 7;
    oLettersMap['H'] = 8;
    oLettersMap['I'] = 9;
    oLettersMap['J'] = 10;
    oLettersMap['K'] = 11;
    oLettersMap['L'] = 12;
    oLettersMap['M'] = 13;
    oLettersMap['N'] = 14;
    oLettersMap['O'] = 15;
    oLettersMap['P'] = 16;
    oLettersMap['Q'] = 17;
    oLettersMap['R'] = 18;
    oLettersMap['S'] = 19;
    oLettersMap['T'] = 20;
    oLettersMap['U'] = 21;
    oLettersMap['V'] = 22;
    oLettersMap['W'] = 23;
    oLettersMap['X'] = 24;
    oLettersMap['Y'] = 25;
    oLettersMap['Z'] = 26;

    var oDigitMap = {};
    oDigitMap['0'] = 0;
    oDigitMap['1'] = 1;
    oDigitMap['2'] = 2;
    oDigitMap['3'] = 3;
    oDigitMap['4'] = 4;
    oDigitMap['5'] = 5;
    oDigitMap['6'] = 6;
    oDigitMap['7'] = 7;
    oDigitMap['8'] = 8;
    oDigitMap['9'] = 9;


    function CFormulaNode() {
        this.document = null;
        this.result = null;
        this.error = null;
        this.parseQueue = null;
    }
    CFormulaNode.prototype.argumentsCount = 0;
    CFormulaNode.prototype.calculate = function () {
        this.error = null;
        this.result = null;
        if(!this.parseQueue){
            this.setError("Error", "");
            return;
        }
        var aArgs = [];
        for(var i = 0; i < this.argumentsCount; ++i){
            var oArg = this.parseQueue.getNext();
            if(!oArg){
                this.setError("Missing argument", "");
                return;
            }
            oArg.calculate();
            if(oArg.error){
                this.error = oArg.error;
                return;
            }
            aArgs.push(oArg);
        }
        this._calculate(aArgs);
    };

    CFormulaNode.prototype._calculate = function(aArgs){
        this.setError("Function is not implemented", "");
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
    CFormulaNode.prototype.setParseQueue = function(oQueue){
        this.parseQueue = oQueue;
    };

    CFormulaNode.prototype.argumentsCount = 0;

    function CNumberNode() {
        CFormulaNode.call(this);
        this.value = null;
    }
    CNumberNode.prototype = Object.create(CFormulaNode.prototype);
    CNumberNode.prototype.precedence = 15;
    CNumberNode.prototype.getValue = function () {
        return this.value;
    };
    CNumberNode.prototype._calculate = function () {
        if(AscFormat.isRealNumber(this.value)){
            this.result = this.value;
        }
        else{
            this.setError("Not a number", null);
        }
        return this.error;
    };

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
    CUnaryMinusOperatorNode.prototype._calculate = function (aArgs) {
        this.result = -aArgs[0].result;
    };

    function CPowersAndRootsOperatorNode(){
        COperatorNode.call(this);
    }

    CPowersAndRootsOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPowersAndRootsOperatorNode.prototype.precedence = 12;
    CPowersAndRootsOperatorNode.prototype._calculate = function (aArgs) {
        this.result = Math.pow(aArgs[0].result, aArgs[1].result);
    };
    function CMultiplicationOperatorNode(){
        COperatorNode.call(this);
    }

    CMultiplicationOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CMultiplicationOperatorNode.prototype.precedence = 11;
    CMultiplicationOperatorNode.prototype._calculate = function (aArgs) {
        this.result = aArgs[0].result * aArgs[1].result;
    };

    function CDivisionOperatorNode(){
        COperatorNode.call(this);
    }

    CDivisionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CDivisionOperatorNode.prototype.precedence = 10;
    CDivisionOperatorNode.prototype._calculate = function (aArgs) {
        if(AscFormat.fApproxEqual(0.0, aArgs[1].result)){
            this.setError("Zero Divide", null);
            return;
        }
        this.result = aArgs[0].result/aArgs[1].result;
    };

    function CPercentageOperatorNode(){
        COperatorNode.call(this);
    }

    CPercentageOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CPercentageOperatorNode.prototype.precedence = 8;
    CPercentageOperatorNode.prototype.argumentsCount = 1;
    CPercentageOperatorNode.prototype._calculate = function (aArgs) {
        this.result = aArgs[0].result / 100.0;//TODO: Fix parsing. % goes after one argument
    };


    function CAdditionOperatorNode(){
        COperatorNode.call(this);
    }

    CAdditionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CAdditionOperatorNode.prototype.precedence = 7;
    CAdditionOperatorNode.prototype._calculate = function (aArgs) {
        this.result = aArgs[0].result + aArgs[1].result;
    };

    function CSubtractionOperatorNode(){
        COperatorNode.call(this);
    }

    CSubtractionOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CSubtractionOperatorNode.prototype.precedence = 7;
    CSubtractionOperatorNode.prototype._calculate = function (aArgs) {
        this.result = aArgs[0].result - aArgs[1].result;
    };

    function CEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CEqualToOperatorNode.prototype.precedence = 6;
    CEqualToOperatorNode.prototype._calculate = function (aArgs) {
        this.result = AscFormat.fApproxEqual(aArgs[0].result, aArgs[1].result) ? 1.0 : 0.0;
    };

    function CNotEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CNotEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CNotEqualToOperatorNode.prototype.precedence = 5;
    CNotEqualToOperatorNode.prototype._calculate = function (aArgs) {
        this.result = AscFormat.fApproxEqual(aArgs[0].result, aArgs[1].result) ? 0.0 : 1.0;
    };
    function CLessThanOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOperatorNode.prototype.precedence = 4;
    CLessThanOperatorNode.prototype._calculate = function (aArgs) {
        this.result = (aArgs[0].result < aArgs[1].result) ? 1.0 : 0.0;
    };
    function CLessThanOrEqualToOperatorNode(){
        COperatorNode.call(this);
    }

    CLessThanOrEqualToOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CLessThanOrEqualToOperatorNode.prototype.precedence = 3;
    CLessThanOrEqualToOperatorNode.prototype._calculate = function (aArgs) {
        this.result = (aArgs[0].result <= aArgs[1].result) ? 1.0 : 0.0;
    };
    function CGreaterThanOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOperatorNode.prototype.precedence = 2;
    CGreaterThanOperatorNode.prototype._calculate = function (aArgs) {
        this.result = (aArgs[0].result > aArgs[1].result) ? 1.0 : 0.0;
    };
    function CGreaterThanOrEqualOperatorNode(){
        COperatorNode.call(this);
    }

    CGreaterThanOrEqualOperatorNode.prototype = Object.create(COperatorNode.prototype);
    CGreaterThanOrEqualOperatorNode.prototype.precedence = 1;
    CGreaterThanOrEqualOperatorNode.prototype._calculate = function (aArgs) {
        this.result = (aArgs[0].result >= aArgs[1].result) ? 1.0 : 0.0;
    };



    function CLeftParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CLeftParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CLeftParenOperatorNode.prototype.precedence = 1;
    CLeftParenOperatorNode.prototype._calculate = function (aArgs) {
    };

    function CRightParenOperatorNode(){
        CFormulaNode.call(this);
    }

    CRightParenOperatorNode.prototype = Object.create(CFormulaNode.prototype);
    CRightParenOperatorNode.prototype.precedence = 1;
    CRightParenOperatorNode.prototype._calculate = function (aArgs) {
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
    CABSFunctionNode.prototype._calculate = function (aArgs) {
        this.result = Math.abs(aArgs[0].result);
    };

    function CANDFunctionNode(){
        CFunctionNode.call(this);
    }
    CANDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CANDFunctionNode.prototype.minArgumentsCount = 2;
    CANDFunctionNode.prototype.maxArgumentsCount = 2;
    CANDFunctionNode.prototype._calculate = function (aArgs) {
        this.result = (AscFormat.fApproxEqual(aArgs[0].result, 0.0) || AscFormat.fApproxEqual(aArgs[1].result, 0.0)) ? 0.0 : 1.0;
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
    CAVERAGEFunctionNode.prototype._calculate = function (aArgs) {
        var summ = 0.0;
        var count = 0;
        var result;
        for(var i = 0; i < aArgs.length; ++i){
            result = aArgs[i].result;
            if(Array.isArray(result)){
                for(var j = 0; j < result.length; ++j){
                    summ += result[j];
                }
                count += result.length;
            }
            else {
                summ += result;
                ++count;
            }
        }
        this.result = summ/count;
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
    CCOUNTFunctionNode.prototype._calculate = function (aArgs) {
        var count = 0;
        var result;
        for(var i = 0; i < aArgs.length; ++i){
            result = aArgs[i].result;
            if(Array.isArray(result)){
                count += result.length;
            }
            else {
                ++count;
            }
        }
        this.result = count;
    };


    function CDEFINEDFunctionNode(){
        CFunctionNode.call(this);
    }
    CDEFINEDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CDEFINEDFunctionNode.prototype.minArgumentsCount = 1;
    CDEFINEDFunctionNode.prototype.maxArgumentsCount = 1;
    CDEFINEDFunctionNode.prototype._calculate = function (aArgs) {
        this.result = 0.0;//TODO: Implement
    };

    function CFALSEFunctionNode(){
        CFunctionNode.call(this);
    }
    CFALSEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CFALSEFunctionNode.prototype.minArgumentsCount = 0;
    CFALSEFunctionNode.prototype.maxArgumentsCount = 0;
    CFALSEFunctionNode.prototype._calculate = function (aArgs) {
        return this.result = 0.0;
    };
    function CTRUEFunctionNode(){
        CFunctionNode.call(this);
    }
    CTRUEFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CTRUEFunctionNode.prototype.minArgumentsCount = 0;
    CTRUEFunctionNode.prototype.maxArgumentsCount = 0;
    CTRUEFunctionNode.prototype._calculate = function (aArgs) {
        this.result = 1.0;
    };

    function CINTFunctionNode(){
        CFunctionNode.call(this);
    }
    CINTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CINTFunctionNode.prototype.minArgumentsCount = 1;
    CINTFunctionNode.prototype.maxArgumentsCount = 1;
    CINTFunctionNode.prototype._calculate = function (aArgs) {
        this.result = (aArgs[0].result >> 0);
    };
    function CIFFunctionNode(){
        CFunctionNode.call(this);
    }
    CIFFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CIFFunctionNode.prototype.minArgumentsCount = 3;
    CIFFunctionNode.prototype.maxArgumentsCount = 3;
    CIFFunctionNode.prototype._calculate = function (aArgs) {
        this.result = ((aArgs[0].result !== 0.0) ? aArgs[1] : aArgs[2]);
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


    CMAXFunctionNode.prototype.findMax = function (aArgs) {
        var fMax;
        var result = aArgs[0].result;
        if(Array.isArray(result)){
            fMax = this.findMax(result);
        }
        else {
            fMax = result;
        }
        for(var i = 1; i < aArgs.length; ++i){
            result = aArgs[i].result;
            if(Array.isArray(result)){
                var fMax_ = this.findMax(result);
                if(fMax_ > fMax){
                    fMax = fMax_;
                }
            }
            else{
                if(fMax < result){
                    fMax = result;
                }
            }
        }
        return fMax;
    };

    CMAXFunctionNode.prototype._calculate = function (aArgs) {
        this.result = this.findMax(aArgs);
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
    CMINFunctionNode.prototype.findMin = function(aArgs){
        var fMin;
        var result = aArgs[0].result;
        if(Array.isArray(result)){
            fMin = this._calculate(result);
        }
        else {
            fMin = result;
        }
        for(var i = 1; i < aArgs.length; ++i){
            result = aArgs[i].result;
            if(Array.isArray(result)){
                var fMin_ = this._calculate(result);
                if(fMin_ < fMin){
                    fMin = fMin_;
                }
            }
            else{
                if(fMin > result){
                    fMin = result;
                }
            }
        }
        return fMin;
    };
    CMINFunctionNode.prototype._calculate = function (aArgs) {

        this.result = this.findMin(aArgs);
    };

    function CMODFunctionNode(){
        CFunctionNode.call(this);
    }
    CMODFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CMODFunctionNode.prototype.minArgumentsCount = 2;
    CMODFunctionNode.prototype.maxArgumentsCount = 2;
    CMODFunctionNode.prototype._calculate = function (aArgs) {
        return aArgs[0].result % aArgs[1].result;//TODO
    };

    function CNOTFunctionNode(){
        CFunctionNode.call(this);
    }
    CNOTFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CNOTFunctionNode.prototype.minArgumentsCount = 1;
    CNOTFunctionNode.prototype.maxArgumentsCount = 1;
    CNOTFunctionNode.prototype._calculate = function (aArgs) {
        return AscFormat.fApproxEqual(aArgs[0].result, 0.0);
    };

    function CORFunctionNode(){
        CFunctionNode.call(this);
    }
    CORFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CORFunctionNode.prototype.minArgumentsCount = 2;
    CORFunctionNode.prototype.maxArgumentsCount = 2;
    CORFunctionNode.prototype._calculate = function (aArgs) {
        return !AscFormat.fApproxEqual(aArgs[0].result, 0.0) || !AscFormat.fApproxEqual(aArgs[1].result, 0.0);
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
    CPRODUCTFunctionNode.prototype.product = function(aArgs){
        var res = 1.0;
        for(var i = 0; i < aArgs.length; ++i){
            var result = aArgs[i].result;
            if(Array.isArray(result)){
                res *= this.product(result);
            }
            else{
                res *= result;
            }
        }
        return res;
    };
    CPRODUCTFunctionNode.prototype._calculate = function (aArgs) {
        this.result = this.product(aArgs);
    };

    function CROUNDFunctionNode(){
        CFunctionNode.call(this);
    }
    CROUNDFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CROUNDFunctionNode.prototype.minArgumentsCount = 2;
    CROUNDFunctionNode.prototype.maxArgumentsCount = 2;
    CROUNDFunctionNode.prototype._calculate = function (aArgs) {
        return Math.round(aArgs[0].result);//TODO
    };


    function CSIGNFunctionNode(){
        CFunctionNode.call(this);
    }
    CSIGNFunctionNode.prototype = Object.create(CFunctionNode.prototype);
    CSIGNFunctionNode.prototype.minArgumentsCount = 1;
    CSIGNFunctionNode.prototype.maxArgumentsCount = 1;
    CSIGNFunctionNode.prototype._calculate = function (aArgs) {
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
    CSUMFunctionNode.prototype.sumArray = function (aArgs) {
        var ret = 0.0;
        for(var i = 0; i < aArgs.length; ++i){
            if(Array.isArray(aArgs[i])){
                ret += this.sumArray(aArgs[i]);
            }
            else {
                ret += aArgs[i];
            }
        }
        return ret;
    };
    CSUMFunctionNode.prototype._calculate = function (aArgs) {
        this.result = this.sumArray(aArgs);
    };

    function CParseQueue() {
        this.queue = [];
        this.result = null;
        this.pos = -1;
    }
    CParseQueue.prototype.add = function(oToken){
        oToken.setParseQueue(this);
        this.queue.push(oToken);
    };
    CParseQueue.prototype.getNext = function(){
        if(this.pos > -1){
            return this.queue[--this.pos];
        }
        return null;
    };



    CParseQueue.prototype.calculate = function(oDocument){
        this.pos = this.queue.length - 1;
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
        var number = parseFloat(this.formula.slice(nStartPos, nEndPos));
        if(AscFormat.isRealNumber(number)){
            var ret = new CNumberNode();
            ret.value = number;
            return ret;
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
        return this.parseCoord(nStartPos, nEndPos, oLettersMap, 26) - 1;
    };

    CFormulaParser.prototype.parseRow = function(nStartPos, nEndPos){
        return this.parseCoord(nStartPos, nEndPos, oDigitMap, 10) - 1;
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
            if(this.flags & PARSER_MASK_UNARY_OPERATOR){
                return new CUnaryMinusOperatorNode();
            }
            return new CSubtractionOperatorNode();
        }
        if(oOperatorsMap[sOperator]){
            return new oOperatorsMap[sOperator]();
        }
        return null;
    };

    CFormulaParser.prototype.parseFunction = function(nStartPos, nEndPos){
        var sFunction = this.formula.slice(nStartPos, nEndPos).toUpperCase();
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
            return new CLeftParenOperatorNode();
        }
        if(this.formula[this.pos] === ')'){
            ++this.pos;
            return new CRightParenOperatorNode();
        }
        if(this.formula[this.pos] === this.listSeparator){
            ++this.pos;
            return new CListSeparatorNode();
        }
        var oRet;
        //check operators
        oRet = this.checkExpression(oOperatorRegExp, this.parseOperator);
        if(oRet){
            return oRet;
        }
        //check function
        oRet = this.checkExpression(oFunctionsRegExp, this.parseFunction);
        if(oRet){
            return oRet;
        }
        //directions
        if(this.formula.indexOf('LEFT', this.pos) === this.pos){
            this.pos += 'LEFT'.length;
            oRet = new CCellRangeNode();
            oRet.dir = LEFT;
            return oRet;
        }
        if(this.formula.indexOf('ABOVE', this.pos) === this.pos){
            this.pos += 'ABOVE'.length;
            oRet = new CCellRangeNode();
            oRet.dir = ABOVE;
            return oRet;
        }
        if(this.formula.indexOf('BELOW', this.pos) === this.pos){
            this.pos += 'BELOW'.length;
            oRet = new CCellRangeNode();
            oRet.dir = BELOW;
            return oRet;
        }
        if(this.formula.indexOf('RIGHT', this.pos) === this.pos){
            this.pos += 'RIGHT'.length;
            oRet = new CCellRangeNode();
            oRet.dir = BELOW;
            return oRet;
        }
        //check cell reference
        var oRes = this.checkExpression(oCellReferenceRegExp, this.parseCellRef);
        if(oRes){
            return oRes;
        }
        //check number
        oRet = this.checkExpression(oConstantRegExp, this.parseNumber);
        if(oRet){
            return oRet;
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
            return this.formula.slice(nStartPos, endPos);
        }
        return "";
    };

    CFormulaParser.prototype.parse = function(sFormula){
        if(typeof sFormula !== "string"){
            this.setError("Illegal Argument Type", "");
            return;
        }
        this.pos = 0;
        this.formula = sFormula.toUpperCase();
        this.parseQueue = null;
        this.error = null;


        this.parseQueue = new CParseQueue();
        var oCurToken;
        var aStack = [];
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
            if(oCurToken instanceof CNumberNode || oCurToken instanceof CFALSEFunctionNode || oCurToken instanceof CTRUEFunctionNode){
                if(oLastToken instanceof CNumberNode || oLastToken instanceof CCellRangeNode || oLastToken instanceof CRightParenOperatorNode || oLastToken instanceof CFALSEFunctionNode || oLastToken instanceof CTRUEFunctionNode){
                    this.setError(ERROR_TYPE_MISSING_OPERATOR, null);
                    return;
                }
                if(this.flags & PARSER_MASK_NUMBER){
                    this.parseQueue.add(oCurToken);
                    this.setFlag(PARSER_MASK_NUMBER, true);
                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                    this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, true);
                    this.setFlag(PARSER_MASK_BINARY_OPERATOR, true);
                    this.setFlag(PARSER_MASK_FUNCTION, false);
                    this.setFlag(PARSER_MASK_LIST_SEPARATOR, aFunctionsStack.length > 0);
                    this.setFlag(PARSER_MASK_CELL_NAME, false);
                    this.setFlag(PARSER_MASK_CELL_RANGE, false);
                    this.setFlag(PARSER_MASK_BOOKMARK, true);
                    this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
            } else if(oCurToken instanceof CCellRangeNode){
                if((oCurToken.isDir() || oCurToken.isCellRange()) && !(this.flags & PARSER_MASK_CELL_RANGE)){
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, ':');
                    return;
                }
                if(oCurToken.isBookmarkCellRange() && !(this.flags & PARSER_MASK_BOOKMARK_CELL_REF)){
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, ':');//TODO: Send cell range
                    return;
                }
                if((oCurToken.isCell() || oCurToken.isBookmark()) && (oLastToken instanceof CNumberNode || oLastToken instanceof CCellRangeNode || oLastToken instanceof CRightParenOperatorNode || oLastToken instanceof CFALSEFunctionNode || oLastToken instanceof CTRUEFunctionNode)){
                    this.setError(ERROR_TYPE_MISSING_OPERATOR, null);
                    return;
                }
                this.parseQueue.add(oCurToken);
                this.setFlag(PARSER_MASK_NUMBER, true);
                this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                this.setFlag(PARSER_MASK_RIGHT_PAREN, true);
                this.setFlag(PARSER_MASK_BINARY_OPERATOR, oCurToken.isCell() || oCurToken.isBookmark());
                this.setFlag(PARSER_MASK_FUNCTION, false);
                this.setFlag(PARSER_MASK_LIST_SEPARATOR, aFunctionsStack.length > 0);
                this.setFlag(PARSER_MASK_CELL_NAME, false);
                this.setFlag(PARSER_MASK_CELL_RANGE, false);
                this.setFlag(PARSER_MASK_BOOKMARK, false);
                this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
            } else if(oCurToken.isFunction()){
                if(this.flags & PARSER_MASK_FUNCTION){
                    aStack.push(oCurToken);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                    if(oCurToken.maxArgumentsCount < 1){
                        this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    }
                    else{
                        this.setFlag(PARSER_MASK_LEFT_PAREN, true);
                        this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                        this.setFlag(PARSER_MASK_LIST_SEPARATOR, false);
                        this.setFlag(PARSER_MASK_BINARY_OPERATOR, false);
                        this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                        this.setFlag(PARSER_MASK_NUMBER, false);
                        this.setFlag(PARSER_MASK_FUNCTION, false);
                        this.setFlag(PARSER_MASK_CELL_NAME, false);
                        this.setFlag(PARSER_MASK_CELL_RANGE, false);
                        this.setFlag(PARSER_MASK_BOOKMARK, false);
                        this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
                    }
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
            } else if(oCurToken instanceof CListSeparatorNode){
                if(!(this.flags & PARSER_MASK_LIST_SEPARATOR)){
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
                else{
                    if(aFunctionsStack.length > 0){
                        ++aFunctionsStack[aFunctionsStack.length-1].argumentsCount;
                        if(aFunctionsStack[aFunctionsStack.length-1].argumentsCount >= aFunctionsStack[aFunctionsStack.length-1].maxArgumentsCount){
                            this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                            return;
                        }
                        while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                            this.parseQueue.add(aStack.pop());
                        }
                        if(aStack.length === 0){
                            this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));//TODO
                            return;
                        }
                    }
                    else{
                        this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                        return;
                    }

                    this.setFlag(PARSER_MASK_LEFT_PAREN, true);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                    this.setFlag(PARSER_MASK_LIST_SEPARATOR, false);
                    this.setFlag(PARSER_MASK_BINARY_OPERATOR, false);
                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, true);
                    this.setFlag(PARSER_MASK_NUMBER, true);
                    this.setFlag(PARSER_MASK_FUNCTION, true);
                    this.setFlag(PARSER_MASK_CELL_NAME, true);
                    this.setFlag(PARSER_MASK_CELL_RANGE, aFunctionsStack.length > 0 && aFunctionsStack[aFunctionsStack.length-1].listSupport());
                    this.setFlag(PARSER_MASK_BOOKMARK, true);
                    this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, aFunctionsStack.length > 0 && aFunctionsStack[aFunctionsStack.length-1].listSupport());
                }
            } else if(oCurToken instanceof CLeftParenOperatorNode){
                if(this.flags && PARSER_MASK_LEFT_PAREN){
                    if(oLastToken && oLastToken.isFunction(oLastToken)){
                        aFunctionsStack.push(oLastToken);
                    }
                    this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                    this.setFlag(PARSER_MASK_RIGHT_PAREN, true);
                    this.setFlag(PARSER_MASK_LIST_SEPARATOR, false);
                    this.setFlag(PARSER_MASK_BINARY_OPERATOR, false);
                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, true);
                    this.setFlag(PARSER_MASK_NUMBER, true);
                    this.setFlag(PARSER_MASK_FUNCTION, true);
                    this.setFlag(PARSER_MASK_CELL_NAME, true);
                    this.setFlag(PARSER_MASK_CELL_RANGE, aFunctionsStack.length > 0 && aFunctionsStack[aFunctionsStack.length-1].listSupport());
                    this.setFlag(PARSER_MASK_BOOKMARK, false);
                    this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, aFunctionsStack.length > 0 && aFunctionsStack[aFunctionsStack.length-1].listSupport());
                }
                else{
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
                aStack.push(oCurToken);
            } else if(oCurToken instanceof CRightParenOperatorNode){
                if(aFunctionsStack.length > 0 && aStack[0] && aStack[0].isFunction()){
                    ++aFunctionsStack[aFunctionsStack.length-1].argumentsCount;
                    if(aFunctionsStack[aFunctionsStack.length-1].argumentsCount > aFunctionsStack[aFunctionsStack.length-1].maxArgumentsCount){
                        this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                        return;
                    }
                    aFunctionsStack.pop();
                }
                while(aStack.length > 0 && !(aStack[aStack.length-1] instanceof CLeftParenOperatorNode)){
                    this.parseQueue.add(aStack.pop());
                }

                if(aStack.length === 0){
                    this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                    return;
                }
                aStack.pop();
                if(aStack[aStack.length-1] && aStack[aStack.length-1].isFunction()){
                    this.parseQueue.add(aStack.pop());
                }
                this.setFlag(PARSER_MASK_NUMBER, true);
                this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                this.setFlag(PARSER_MASK_LEFT_PAREN, false);
                this.setFlag(PARSER_MASK_RIGHT_PAREN, true);
                this.setFlag(PARSER_MASK_BINARY_OPERATOR, true);
                this.setFlag(PARSER_MASK_FUNCTION, false);
                this.setFlag(PARSER_MASK_LIST_SEPARATOR, aFunctionsStack.length > 0);
                this.setFlag(PARSER_MASK_CELL_NAME, false);
                this.setFlag(PARSER_MASK_CELL_RANGE, false);
                this.setFlag(PARSER_MASK_BOOKMARK, false);
                this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
            } else if(oCurToken.isOperator()){
                if(oCurToken instanceof CUnaryMinusOperatorNode){
                    if(!(this.flags & PARSER_MASK_UNARY_OPERATOR)){
                        this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                        return;
                    }
                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, false);
                }
                else{
                    if(!(this.flags & PARSER_MASK_BINARY_OPERATOR)){
                        this.setError(ERROR_TYPE_SYNTAX_ERROR, this.getErrorString(nStartPos, this.pos));
                        return;
                    }

                    this.setFlag(PARSER_MASK_UNARY_OPERATOR, true);
                }
                this.setFlag(PARSER_MASK_NUMBER, true);
                this.setFlag(PARSER_MASK_LEFT_PAREN, true);
                this.setFlag(PARSER_MASK_RIGHT_PAREN, false);
                this.setFlag(PARSER_MASK_BINARY_OPERATOR, false);
                this.setFlag(PARSER_MASK_FUNCTION, true);
                this.setFlag(PARSER_MASK_LIST_SEPARATOR, false);
                this.setFlag(PARSER_MASK_CELL_NAME, true);
                this.setFlag(PARSER_MASK_CELL_RANGE, false);
                this.setFlag(PARSER_MASK_BOOKMARK, true);
                this.setFlag(PARSER_MASK_BOOKMARK_CELL_REF, false);
                while(aStack.length > 0 && ((aStack[aStack.length-1] instanceof CLeftParenOperatorNode) || aStack[aStack.length-1].precedence >= oCurToken.precedence)){
                    this.parseQueue.add(aStack.pop());
                }
                aStack.push(oCurToken);
            }
            oLastToken = oCurToken;
            nStartPos = this.pos;
        }
        while (aStack.length > 0){
            oCurToken = aStack.pop();
            if(oCurToken instanceof CLeftParenOperatorNode || oCurToken instanceof CRightParenOperatorNode){
                this.setError(ERROR_TYPE_SYNTAX_ERROR, "");//TODO
                return;
            }
            this.parseQueue.add(oCurToken);
        }
    };
    window['AscCommonWord'] = window['AscCommonWord'] || {};
    window['AscCommonWord'].CFormulaParser = CFormulaParser;



//GENERATE TEST DATA
    var sListSeparator = ",";
    var sDisitSeparator = ".";


    function addParens(sExpression){
        var ret = [];
        ret.push("(" + sExpression + ")");
        return ret;
    }

    function createConstant(){
        var ret = [];
        ret.push("0"+sDisitSeparator+"32");
        ret.push(sDisitSeparator + "163");
        ret.push("153");
        ret.push("12" + sDisitSeparator);
        return ret;
    }

    function addPrefix(sExpression){
        var ret = [];
        ret.push("-"+sExpression);
        return ret;
    }

    var aInfixOp = ["<>","<=",">=",">","<","-","^","*","/","%","+","="];
    function createInfixExpression(sExpression1, sExpression2){
        var ret = [];
        for(var i = 0; i < aInfixOp.length; ++i){
            ret.push(sExpression1 + aInfixOp[i] + sExpression2);
        }
        return ret;
    }

    function createBookmark(){
        var ret = [];
        ret.push("jsdj");
        ret.push("jsdj1");
        return ret;
    }
    function createDir(){
        var ret = [];
        ret.push("LeFt");
        ret.push("AboVe");
        ret.push("RIGHT");
        ret.push("below");
        return ret;
    }

    function createCellReference(){
        var ret = [];
        ret.push("Cd3");
        ret.push("a:B");
        ret.push("2:10");
        ret.push("d1:C3");
        return ret;
    }

    function createBookMarkCellRef(){
        var ret = [];
        var aBookMarks = createBookmark();
        var aCellRefs = createCellReference();
        for(var i = 0; i < aBookMarks.length; ++i){
            for(var j = 0; j < aCellRefs.length; ++j){
                ret.push(aBookMarks[i] + " " + aCellRefs[j]);
            }
        }
        return ret;
    }

    function getAllCombinations(aExp, len){
        var ret = [], i;
        if(len === 1){
            for(i = 0; i < aExp.length; ++i){
                ret.push([aExp[i]]);
            }
            return ret;
        }
        var aSets = getAllCombinations(aExp, len - 1);
        for(i = 0; i < aExp.length; ++i){
            var sExp = aExp[i];
            for(var j = 0; j < aSets.length; ++j){
                var aSet = [].concat(aSets[j]);
                aSet.push(sExp);
                ret.push(aSet);
            }
        }
        return ret;
    }

    var nMaxArgCount = 3;
    function createExpression(aExp){
        var ret = [].concat(aExp);
        var oArgsMap = {};
        oArgsMap[1] = getAllCombinations(aExp, 1);
        for(var i = 0; i < oArgsMap[1].length; ++i){
            ret = ret.concat(addParens(oArgsMap[1][i][0]));
            ret = ret.concat(addPrefix(oArgsMap[1][i][0]));
        }
        oArgsMap[2] = getAllCombinations(aExp, 2);
        for(i = 0; i < oArgsMap[2].length; ++i){
            ret = ret.concat(createInfixExpression(oArgsMap[2][i][0], oArgsMap[2][i][1]));
        }
        var aFunctions = [];
        for(var key in oFuncMap){
            if(oFuncMap.hasOwnProperty(key)){
                var oFunc = oFuncMap[key];
                if(oFunc.prototype.maxArgumentsCount === 0){
                    aFunctions.push(key);
                    continue;
                }
                for(i = oFunc.prototype.minArgumentsCount; i <= oFunc.prototype.maxArgumentsCount && i <= nMaxArgCount; ++i){
                    if(!oArgsMap[i]){
                        oArgsMap[i] = getAllCombinations(aExp, i);
                    }
                    var aArgs = oArgsMap[i];
                    for(var i1 = 0; i1 < aArgs.length; ++i1){
                        var aList = aArgs[i1];
                        var sStr = key + "(";
                        for(var j1 = 0; j1 < aList.length - 1; ++j1){
                            sStr += (aList[j1] + sListSeparator + " ");
                        }
                        sStr += (aList[j1] + ")");
                        aFunctions.push(sStr);
                    }
                }
            }
        }
        ret = ret.concat(aFunctions);
        return ret;
    }

    function TEST2(){
        var aExp = (createExpression(createConstant().concat(createBookmark().concat(createBookMarkCellRef().concat(createCellReference().concat(createDir()))))));
        var oParser = new CFormulaParser(sListSeparator, sDisitSeparator);
        for(var i = 0; i < aExp.length; ++i){
            var sExp = aExp[i];
            oParser.parse(sExp);
            console.log("\n___________EXPRESSION____________");
            console.log("Expression: " + sExp);
            console.log("QUEUE: " + JSON.stringify(oParser.parseQueue));
            console.log("ERROR: " + JSON.stringify(oParser.error));
            console.log("__________________________________");

        }

    }
    window['AscCommonWord'].createExpression = TEST2;
})();