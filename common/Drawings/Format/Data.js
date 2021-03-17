"use strict";
(
  /**
   * @param {Window} window
   * @param {undefined} undefined
   */
  function (window, undefined) {
    function DiagramData() {
      this.ptLst = [];
      this.point = null;
      this.prSet = null;
      this.spPr = null;
      this.textBlock = null;
    }

    function Point() {
      this.cxnId = null;
      this.modelId = null;
      this.typeId = null;
    }

    Point.prototype.getCxnId = function () {
      return this.cxnId ? this.cxnId : null;
    }

    Point.prototype.getModelId = function () {
      return this.modelId ? this.modelId : null;

    }

    Point.prototype.getTypeId = function () {
      return this.typeId ? this.typeId : null;
    }

    function PrSet() {
      this.coherent3DOff = null;
      this.csCatId = null;
      this.csTypeId = null;
      this.custAng = null;
      this.custFlipHor = null;
      this.custFlipVert = null;
      this.custLinFactNeighborX = null;
      this.custLinFactNeighborY = null;
      this.custLinFactX = null;
      this.custLinFactY = null;
      this.custRadScaleInc = null;
      this.custRadScaleRad = null;
      this.custScaleX = null;
      this.custScaleY = null;
      this.custSzX = null;
      this.custSzY = null;
      this.custT = null;
      this.loCatId = null;
      this.phldr = null;
      this.phldrT = null;
      this.presAssocID = null;
      this.presName = null;
      this.presStyleCnt = null;
      this.presStyleIdx = null;
      this.presStyleLbl = null;
      this.qsCatId = null;
      this.qsTypeId = null;
    }


    PrSet.prototype.getCoherent3DOff = function () {
      return this.coherent3DOff;
    }

    PrSet.prototype.getCsCatId = function () {
      return this.csCatId;
    }

    PrSet.prototype.getCsTypeId = function () {
      return this.csTypeId;
    }

    PrSet.prototype.getCustAng = function () {
      return this.custAng;
    }

    PrSet.prototype.getCustFlipHor = function () {
      return this.custFlipHor;
    }

    PrSet.prototype.getCustFlipVert = function () {
      return this.custFlipVert;
    }

    PrSet.prototype.getCustLinFactNeighborX = function () {
      return this.custLinFactNeighborX;
    }

    PrSet.prototype.getCustLinFactNeighborY = function () {
      return this.custLinFactNeighborY;
    }

    PrSet.prototype.getCustLinFactX = function () {
      return this.custLinFactX;
    }

    PrSet.prototype.getCustLinFactY = function () {
      return this.custLinFactY;
    }

    PrSet.prototype.getCustRadScaleInc = function () {
      return this.custRadScaleInc;
    }

    PrSet.prototype.getCustRadScaleRad = function () {
      return this.custRadScaleRad;
    }

    PrSet.prototype.getCustScaleX = function () {
      return this.custScaleX;
    }

    PrSet.prototype.getCustScaleY = function () {
      return this.custScaleY;
    }

    PrSet.prototype.getCustSzX = function () {
      return this.custSzX;
    }

    PrSet.prototype.getCustSzY = function () {
      return this.custSzY;
    }

    PrSet.prototype.getCustT = function () {
      return this.custT;
    }

    PrSet.prototype.getLoCatId = function () {
      return this.loCatId;
    }

    PrSet.prototype.getPhldr = function () {
      return this.phldr;
    }

    PrSet.prototype.getPhldrT = function () {
      return this.phldrT;
    }

    PrSet.prototype.getPresAssocID = function () {
      return this.presAssocID;
    }

    PrSet.prototype.getPresName = function () {
      return this.presName;
    }
    PrSet.prototype.getPresStyleCnt = function () {
      return this.presStyleCnt;
    }

    PrSet.prototype.getPresStyleIdx = function () {
      return this.presStyleIdx;
    }

    PrSet.prototype.getPresStyleLbl = function () {
      return this.presStyleLbl;
    }

    PrSet.prototype.getQsCatId = function () {
      return this.qsCatId;
    }

    PrSet.prototype.getQsTypeId = function () {
      return this.qsTypeId;
    }

    function SpBr() {
      this.bwMode = null;
    }

    SpBr.prototype.getSpPrBwMode = function () {
        return this.bwMode;
    }

    function TextBlock() {
    }

    function BodyPr() {
      this.anchor = null;
      this.anchorCtr = null;
      this.bIns = null;
      this.compatLnSpc = null;
      this.forceAA = null;
      this.fromWordArt = null;
      this.horzOverflow = null;
      this.lIns = null;
      this.numCol = null;
      this.rIns = null;
      this.rot = null;
      this.rtlCol = null;
      this.spcCol = null;
      this.spcFirstLastPara = null;
      this.tIns = null;
      this.upright = null;
      this.vert = null;
      this.vertOverflow = null;
      this.wrap = null;
    }

    BodyPr.prototype.getAnchor = function () {
      return this.anchor;
    }

    BodyPr.prototype.getAnchorCtr = function () {
      return this.anchorCtr;
    }

    BodyPr.prototype.getBIns = function () {
      return this.bIns;
    }

    BodyPr.prototype.getCompatLnSpc = function () {
      return this.compatLnSpc;
    }

    BodyPr.prototype.getForceAA = function () {
      return this.forceAA;
    }

    BodyPr.prototype.getFromWordArt = function () {
      return this.fromWordArt;
    }

    BodyPr.prototype.getHorzOverflow = function () {
      return this.horzOverflow;
    }

    BodyPr.prototype.getLIns = function () {
      return this.lIns;
    }

    BodyPr.prototype.getNumCol = function () {
      return this.numCol;
    }

    BodyPr.prototype.getRIns = function () {
      return this.rIns;
    }

    BodyPr.prototype.getRot = function () {
      return this.rot;
    }

    BodyPr.prototype.getRtlCol = function () {
      return this.rtlCol;
    }

    BodyPr.prototype.getSpcCol = function () {
      return this.spcCol;
    }

    BodyPr.prototype.getSpcFirstLastPara = function () {
      return this.spcFirstLastPara;
    }

    BodyPr.prototype.gettIns = function () {
      return this.tIns;
    }

    BodyPr.prototype.getUpright = function () {
      return this.upright;
    }

    BodyPr.prototype.getVert = function () {
      return this.vert;
    }

    BodyPr.prototype.getVertOverflow = function () {
      return this.vertOverflow;
    }

    BodyPr.prototype.getWrap = function () {
      return this.wrap;
    }

    function LstStyle() {

    }

    function TextPh() { // a:p

    }

    function TextRun() { // a:r

    }

    function RunProperties() { // a:rPr
      this.altLang = null;
      this.b = null;
      this.baseline = null;
      this.bmk = null;
      this.cap = null;
      this.dirty = null;
      this.err = null;
      this.i = null;
      this.kern = null;
      this.kumimoji = null;
      this.lang = null;
      this.noProof = null;
      this.normalizeH = null;
      this.smtClean = null;
      this.smtId = null;
      this.spc = null;
      this.strike = null;
      this.sz = null;
      this.u = null;
    }




  })(window)
