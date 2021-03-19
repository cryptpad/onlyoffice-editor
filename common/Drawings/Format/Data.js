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
(
  /**
   * @param {Window} window
   * @param {undefined} undefined
   */
  function (window, undefined) {
    // imports

    var InitClass = AscFormat.InitClass;
    var CBaseFormatObject = AscFormat.CBaseFormatObject;
    var oHistory = AscCommon.History;
    var CChangeBool = AscDFH.CChangesDrawingsBool;
    var CChangeLong = AscDFH.CChangesDrawingsLong;
    var CChangeDouble = AscDFH.CChangesDrawingsDouble;
    var CChangeString = AscDFH.CChangesDrawingsString;
    var CChangeObjectNoId = AscDFH.CChangesDrawingsObjectNoId;
    var CChangeObject = AscDFH.CChangesDrawingsObject;
    var CChangeContent = AscDFH.CChangesDrawingsContent;
    var CChangeDouble2 = AscDFH.CChangesDrawingsDouble2;

    var drawingsChangesMap = AscDFH.drawingsChangesMap;
    var drawingContentChanges = AscDFH.drawingContentChanges;
    var changesFactory = AscDFH.changesFactory;
    var drawingConstructorsMap = window['AscDFH'].drawingsConstructorsMap;

    // consts
    var Point_type_asst     = 0;
    var Point_type_doc      = 1;
    var Point_type_node     = 2;
    var Point_type_parTrans = 3;
    var Point_type_pres     = 4;
    var Point_type_sibTrans = 5;




    function PtLst() {
      CBaseFormatObject.call(this);
      this.points = [];
    }
    InitClass(PtLst, CBaseFormatObject, AscDFH.historyitem_type_PtLst);





    changesFactory[AscDFH.historyitem_PointCxnId] = CChangeString;
    changesFactory[AscDFH.historyitem_PointModelId] = CChangeString;
    changesFactory[AscDFH.historyitem_PointType] = CChangeLong;
    changesFactory[AscDFH.historyitem_PointExtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointPrSet] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointSpPr] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointT] = CChangeObject;

    drawingsChangesMap[AscDFH.historyitem_PointCxnId] = function(oClass, value) {oClass.cxnId = value;};
    drawingsChangesMap[AscDFH.historyitem_PointModelId] = function(oClass, value) {oClass.modelId = value;};
    drawingsChangesMap[AscDFH.historyitem_PointType] = function(oClass, value) {oClass.type = value;};
    drawingsChangesMap[AscDFH.historyitem_PointExtLst] = function(oClass, value) {oClass.extLst = value;};
    drawingsChangesMap[AscDFH.historyitem_PointPrSet] = function(oClass, value) {oClass.prSet = value;};
    drawingsChangesMap[AscDFH.historyitem_PointSpPr] = function(oClass, value) {oClass.spPr = value;};
    drawingsChangesMap[AscDFH.historyitem_PointT] = function(oClass, value) {oClass.t = value;};


    function Point() {
      CBaseFormatObject.call(this);
      this.cxnId = null;
      this.modelId = null; // simple type TODO: set required field
      this.type = null;

      this.extLst = null;
      this.prSet = null;
      this.spPr = null;
      this.t = null;
    }
    InitClass(Point, CBaseFormatObject, AscDFH.historyitem_type_Point);

    Point.prototype.setCxnId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PointCxnId, this.cxnId, pr));
      this.cxnId = pr;
    }

    Point.prototype.setModelId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PointModelId, this.modelId, pr));
      this.modelId = pr;

    }

    Point.prototype.setType = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PointType, this.type, pr));
      this.type = pr;
    }

    Point.prototype.setExtLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointExtLst, this.extLst, oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.setPrSet = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointPrSet, this.prSet, oPr));
      this.prSet = oPr;
      this.setParentToChild(oPr);

    }

    Point.prototype.setSpPr = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointSpPr, this.spPr, oPr));
      this.spPr = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.setT = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointT, this.t, oPr));
      this.t = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.getCxnId = function () {
      return this.cxnId;
    }

    Point.prototype.getModelId = function () {
      return this.modelId;

    }

    Point.prototype.getType = function () {
      return this.type;
    }

    Point.prototype.getExtLst = function() {
      return this.extLst;
    }

    Point.prototype.getPrSet = function() {
      return this.prSet;
    }

    Point.prototype.getSpPr = function() {
      return this.spPr;
    }

    Point.prototype.getT = function() {
      return this.t;
    }


    changesFactory[AscDFH.historyitem_PrSetCoherent3DOff] = CChangeBool;
    changesFactory[AscDFH.historyitem_PrSetCsCatId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetCsTypeId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetCustAng] = CChangeLong;
    changesFactory[AscDFH.historyitem_PrSetCustFlipHor] = CChangeBool;
    changesFactory[AscDFH.historyitem_PrSetCustFlipVert] = CChangeBool;
    changesFactory[AscDFH.historyitem_PrSetCustLinFactNeighborX] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustLinFactNeighborY] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustLinFactX] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustLinFactY] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustRadScaleInc] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustRadScaleRad] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustScaleX] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustScaleY] = CChangeDouble2;
    changesFactory[AscDFH.historyitem_PrSetCustSzX] = CChangeLong;
    changesFactory[AscDFH.historyitem_PrSetCustSzY] = CChangeLong;
    changesFactory[AscDFH.historyitem_PrSetCustT] = CChangeBool;
    changesFactory[AscDFH.historyitem_PrSetLoCatId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetLoTypeId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetPhldr] = CChangeBool;
    changesFactory[AscDFH.historyitem_PrSetPhldrT] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetPresAssocID] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetPresName] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetPresStyleCnt] = CChangeLong;
    changesFactory[AscDFH.historyitem_PrSetPresStyleIdx] = CChangeLong;
    changesFactory[AscDFH.historyitem_PrSetPresStyleLbl] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetQsCatId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetQsTypeId] = CChangeString;
    changesFactory[AscDFH.historyitem_PrSetStyle] = CChangeObject;
    changesFactory[AscDFH.historyitem_PrSetPresLayoutStyle] = CChangeObject;

    drawingsChangesMap[AscDFH.historyitem_PrSetCoherent3DOff] = function(oClass, value) {oClass.coherent3DOff = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCsCatId] = function(oClass, value) {oClass.csCatId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCsTypeId] = function(oClass, value) {oClass.csTypeId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustAng] = function(oClass, value) {oClass.custAng = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustFlipHor] = function(oClass, value) {oClass.custFlipHor = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustFlipVert] = function(oClass, value) {oClass.custFlipVert = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactNeighborX] = function(oClass, value) {oClass.custLinFactNeighborX = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactNeighborY] = function(oClass, value) {oClass.custLinFactNeighborY = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactX] = function(oClass, value) {oClass.custLinFactX = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactY] = function(oClass, value) {oClass.custLinFactY = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustRadScaleInc] = function(oClass, value) {oClass.custRadScaleInc = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustRadScaleRad] = function(oClass, value) {oClass.custRadScaleRad = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustScaleX] = function(oClass, value) {oClass.custScaleX = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustScaleY] = function(oClass, value) {oClass.custScaleY = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustSzX] = function(oClass, value) {oClass.custSzX = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustSzY] = function(oClass, value) {oClass.custSzY = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetCustT] = function(oClass, value) {oClass.custT = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetLoCatId] = function(oClass, value) {oClass.loCatId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetLoTypeId] = function(oClass, value) {oClass.loTypeId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPhldr] = function(oClass, value) {oClass.phldr = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPhldrT] = function(oClass, value) {oClass.phldrT = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresAssocID] = function(oClass, value) {oClass.presAssocID = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresName] = function(oClass, value) {oClass.presName = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleCnt] = function(oClass, value) {oClass.presStyleCnt = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleIdx] = function(oClass, value) {oClass.presStyleIdx = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleLbl] = function(oClass, value) {oClass.presStyleLbl = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetQsCatId] = function(oClass, value) {oClass.qsCatId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetQsTypeId] = function(oClass, value) {oClass.qsTypeId = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetStyle] = function(oClass, value) {oClass.style = value;};
    drawingsChangesMap[AscDFH.historyitem_PrSetPresLayoutStyle] = function(oClass, value) {oClass.presLayoutStyle = value;};

    function PrSet() {
      CBaseFormatObject.call(this);
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
      this.loTypeId = null;
      this.phldr = null;
      this.phldrT = null;
      this.presAssocID = null;
      this.presName = null;
      this.presStyleCnt = null;
      this.presStyleIdx = null;
      this.presStyleLbl = null;
      this.qsCatId = null;
      this.qsTypeId = null;

      this.presLayoutStyle = null;
      this.style = null;
    }
    InitClass(PrSet, CBaseFormatObject, AscDFH.historyitem_type_PrSet);


    PrSet.prototype.setCoherent3DOff = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCoherent3DOff, this.coherent3DOff, pr));
      this.coherent3DOff = pr;
    }

    PrSet.prototype.setCsCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetCsCatId, this.csCatId, pr));
      this.csCatId = pr;
    }

    PrSet.prototype.setCsTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetCsTypeId, this.csTypeId, pr))
      this.csTypeId = pr;
    }

    PrSet.prototype.setCustAng = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustAng, this.custAng, pr));
      this.custAng = pr;
    }

    PrSet.prototype.setCustFlipHor = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustFlipHor, this.custFlipHor, pr));
      this.custFlipHor = pr;
    }

    PrSet.prototype.setCustFlipVert = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustFlipVert, this.custFlipVert, pr));
      this.custFlipVert = pr;
    }

    PrSet.prototype.setCustLinFactNeighborX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactNeighborX, this.custLinFactNeighborX, pr));
      this.custLinFactNeighborX = pr;
    }

    PrSet.prototype.setCustLinFactNeighborY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactNeighborY, this.custLinFactNeighborY, pr));
      this.custLinFactNeighborY = pr;
    }

    PrSet.prototype.setCustLinFactX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactX, this.custLinFactX, pr));
      this.custLinFactX = pr;
    }

    PrSet.prototype.setCustLinFactY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactY, this.custLinFactY, pr));
      this.custLinFactY = pr;
    }

    PrSet.prototype.setCustRadScaleInc = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustRadScaleInc, this.custRadScaleInc, pr));
      this.custRadScaleInc = pr;
    }

    PrSet.prototype.setCustRadScaleRad = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustRadScaleRad, this.custRadScaleRad, pr));
      this.custRadScaleRad = pr;
    }

    PrSet.prototype.setCustScaleX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustScaleX, this.custScaleX, pr));
      this.custScaleX = pr;
    }

    PrSet.prototype.setCustScaleY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustScaleY, this.custScaleY, pr));
      this.custScaleY = pr;
    }

    PrSet.prototype.setCustSzX = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustSzX, this.custSzX, pr));
      this.custSzX = pr;
    }

    PrSet.prototype.setCustSzY = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustSzY, this.custSzY, pr));
      this.custSzY = pr;
    }

    PrSet.prototype.setCustT = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustT, this.custT, pr));
      this.custT = pr;
    }

    PrSet.prototype.setLoCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetLoCatId, this.loCatId, pr));
      this.loCatId = pr;
    }

    PrSet.prototype.setLoTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetLoTypeId, this.loTypeId, pr));
      this.loTypeId = pr;
    }

    PrSet.prototype.setPhldr = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetPhldr, this.phldr, pr));
      this.phldr = pr;
    }

    PrSet.prototype.setPhldrT = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPhldrT, this.phldrT, pr));
      this.phldrT = pr;
    }

    PrSet.prototype.setPresAssocID = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresAssocID, this.presAssocID, pr));
      this.presAssocID = pr;
    }

    PrSet.prototype.setPresName = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresName, this.presName, pr));
      this.presName = pr;
    }
    PrSet.prototype.setPresStyleCnt = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetPresStyleCnt, this.presStyleCnt, pr));
      this.presStyleCnt = pr;
    }

    PrSet.prototype.setPresStyleIdx = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetPresStyleIdx, this.presStyleIdx, pr));
      this.presStyleIdx = pr;
    }

    PrSet.prototype.setPresStyleLbl = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresStyleLbl, this.presStyleLbl, pr));
      this.presStyleLbl = pr;
    }

    PrSet.prototype.setQsCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetQsCatId, this.qsCatId, pr));
      this.qsCatId = pr;
    }

    PrSet.prototype.setQsTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetQsTypeId, this.qsTypeId, pr));
      this.qsTypeId = pr;
    }

    PrSet.prototype.setStyle = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PrSetStyle,this.style,oPr));
      this.style = oPr;
      this.setParentToChild(oPr);
    }

    PrSet.prototype.setPresLayoutStyle = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PrSetPresLayoutStyle,this.presLayoutStyle,oPr));
      this.presLayoutStyle = oPr;
      this.setParentToChild(oPr);
    }

    PrSet.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setCoherent3DOff(this.getCoherent3DOff());
      oCopy.setCsCatId(this.getCsCatId());
      oCopy.setCsTypeId(this.getCsTypeId());
      oCopy.setCustAng(this.getCustAng());
      oCopy.setCustFlipHor(this.getCustFlipHor());
      oCopy.setCustFlipVert(this.getCustFlipVert());
      oCopy.setCustLinFactNeighborX(this.getCustLinFactNeighborX());
      oCopy.setCustLinFactNeighborY(this.getCustLinFactNeighborY());
      oCopy.setCustLinFactX(this.getCustLinFactX());
      oCopy.setCustLinFactY(this.getCustLinFactY());
      oCopy.setCustRadScaleInc(this.getCustRadScaleInc());
      oCopy.setCustRadScaleRad(this.getCustRadScaleRad());
      oCopy.setCustScaleX(this.getCustScaleX());
      oCopy.setCustScaleY(this.getCustScaleY());
      oCopy.setCustSzX(this.getCustSzX());
      oCopy.setCustSzY(this.getCustSzY());
      oCopy.setCustT(this.getCustT());
      oCopy.setLoCatId(this.getLoCatId());
      oCopy.setLoTypeId(this.getLoTypeId());
      oCopy.setPhldr(this.getPhldr());
      oCopy.setPhldrT(this.getPhldrT());
      oCopy.setPresAssocID(this.getPresAssocID());
      oCopy.setPresName(this.getPresName());
      oCopy.setPresStyleCnt(this.getPresStyleCnt());
      oCopy.setPresStyleIdx(this.getPresStyleIdx());
      oCopy.setPresStyleLbl(this.getPresStyleLbl());
      oCopy.setQsCatId(this.getQsCatId());
      oCopy.setQsTypeId(this.getQsTypeId());
      if (this.getStyle()) {
        var style = this.getStyle();
        oCopy.setStyle(this.style.createDuplicate(style));
      }
      if (this.getPresLayoutStyle()) {
        var presLayoutStyle = this.getPresLayoutStyle();
        oCopy.setPresLayoutStyle(this.presLayoutStyle.createDuplicate(presLayoutStyle));
      }
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

    PrSet.prototype.getLoTypeId = function () {
      return this.loTypeId;
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

    PrSet.prototype.getStyle= function () {
      return this.qsTypeId;
    }

    PrSet.prototype.getPresLayoutStyle = function () {
      return this.qsTypeId;
    }

  })(window)
