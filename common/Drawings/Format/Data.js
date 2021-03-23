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
    var Point_type_asst = 0;
    var Point_type_doc = 1;
    var Point_type_node = 2;
    var Point_type_parTrans = 3;
    var Point_type_pres = 4;
    var Point_type_sibTrans = 5;

    var Cxn_type_parOf = 0;
    var Cxn_type_presOf = 1;
    var Cxn_type_presParOf = 2;
    var Cxn_type_unknownRelationShip = 3;

    var LayoutNode_type_b = 0;
    var LayoutNode_type_t = 1;

    var Alg_type_composite = 0;
    var Alg_type_conn = 1;
    var Alg_type_cycle = 2;
    var Alg_type_hierChild = 3;
    var Alg_type_hierRoot = 4;
    var Alg_type_lin = 5;
    var Alg_type_pyra = 6;
    var Alg_type_snake = 7;
    var Alg_type_sp = 8;
    var Alg_type_tx = 9;

    var Param_type_alignTx = 0;
    var Param_type_ar = 1;
    var Param_type_autoTxRot = 2;
    var Param_type_begPts = 3;
    var Param_type_begSty = 4;
    var Param_type_bendPt = 5;
    var Param_type_bkpt = 6;
    var Param_type_bkPtFixedVal = 7;
    var Param_type_chAlign = 8;
    var Param_type_chDir = 9;
    var Param_type_connRout = 10;
    var Param_type_contDir = 11;
    var Param_type_ctrShpMap = 12;
    var Param_type_dim = 13;
    var Param_type_dstNode = 14;
    var Param_type_endPts = 15;
    var Param_type_endSty = 16;
    var Param_type_fallback = 17;
    var Param_type_flowDir = 18;
    var Param_type_grDir = 19;
    var Param_type_hierAlign = 20;
    var Param_type_horzAlign = 21;
    var Param_type_linDir = 22;
    var Param_type_lnSpAfChP = 23;
    var Param_type_lnSpAfParP = 24;
    var Param_type_lnSpCh = 25;
    var Param_type_lnSpPar = 26;
    var Param_type_nodeHorzAlign = 27;
    var Param_type_nodeVertAlign = 28;
    var Param_type_off = 29;
    var Param_type_parTxLTRAlign = 30;
    var Param_type_parTxRTLAlign = 31;
    var Param_type_pyraAcctBkgdNode = 32;
    var Param_type_pyraAcctPos = 33;
    var Param_type_pyraAcctTxMar = 34;
    var Param_type_pyraAcctTxNode = 35;
    var Param_type_pyraLvlNode = 36;
    var Param_type_rotPath = 37;
    var Param_type_rtShortDist = 38;
    var Param_type_secChAlign = 39;
    var Param_type_secLinDir = 40;
    var Param_type_shpTxLTRAlignCh = 41;
    var Param_type_shpTxRTLAlignCh = 42;
    var Param_type_spanAng = 43;
    var Param_type_srcNode = 44;
    var Param_type_stAng = 45;
    var Param_type_stBulletLvl = 46;
    var Param_type_stElem = 47;
    var Param_type_txAnchorHorz = 48;
    var Param_type_txAnchorHorzCh = 49;
    var Param_type_txAnchorVert = 50;
    var Param_type_txAnchorVertCh = 51;
    var Param_type_txBlDir = 52;
    var Param_type_txDir = 53;
    var Param_type_vertAlign = 54;


    changesFactory[AscDFH.historyitem_DataModelBg] = CChangeObject;
    changesFactory[AscDFH.historyitem_DataModelCxnLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_DataModelExtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_DataModelPtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_DataModelWhole] = CChangeObject;
    drawingsChangesMap[AscDFH.historyitem_DataModelBg] = function (oClass, value) {oClass.bg = value;};
    drawingsChangesMap[AscDFH.historyitem_DataModelCxnLst] = function (oClass, value) {oClass.cxnLst = value;};
    drawingsChangesMap[AscDFH.historyitem_DataModelExtLst] = function (oClass, value) {oClass.extLst = value;};
    drawingsChangesMap[AscDFH.historyitem_DataModelPtLst] = function (oClass, value) {oClass.ptLst = value;};
    drawingsChangesMap[AscDFH.historyitem_DataModelWhole] = function (oClass, value) {oClass.whole = value;};
    function DataModel() {
      CBaseFormatObject.call(this);
      this.bg = null;
      this.cxnLst = null;
      this.extLst = null;
      this.ptLst = null;
      this.whole = null;
    }
    InitClass(DataModel, CBaseFormatObject, AscDFH.historyitem_type_DataModel);

    DataModel.prototype.setBg = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_DataModelBg, this.getBg(), oPr));
      this.bg = oPr;
      this.setParentToChild(oPr);
    }

    DataModel.prototype.setCxnLst = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_DataModelCxnLst, this.getCxnLst(), oPr));
      this.cxnLst = oPr;
      this.setParentToChild(oPr);
    }

    DataModel.prototype.setExtLst = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_DataModelExtLst, this.getExtLst(), oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    DataModel.prototype.setPtLst = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_DataModelPtLst, this.getPtLst(), oPr));
      this.ptLst = oPr;
      this.setParentToChild(oPr);
    }

    DataModel.prototype.setWhole = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_DataModelWhole, this.getWhole(), oPr));
      this.whole = oPr;
      this.setParentToChild(oPr);
    }

    DataModel.prototype.fillObject = function(oCopy, oIdMap) {
      if (this.bg) {
        this.set(this.bg.createDuplicate(oIdMap));
      }
      if (this.cxnLst) {
        this.set(this.cxnLst.createDuplicate(oIdMap));
      }
      if (this.extLst) {
        this.set(this.extLst.createDuplicate(oIdMap));
      }
      if (this.ptLst) {
        this.set(this.ptLst.createDuplicate(oIdMap));
      }
      if (this.whole) {
        this.set(this.whole.createDuplicate(oIdMap));
      }
    }

    DataModel.prototype.getBg = function () {
      return this.bg;
    }

    DataModel.prototype.getCxnLst = function () {
      return this.cxnLst;
    }

    DataModel.prototype.getExtLst = function () {
      return this.extLst;
    }

    DataModel.prototype.getPtLst = function () {
      return this.ptLst;
    }

    DataModel.prototype.getWhole = function () {
      return this.whole;
    }

    changesFactory[AscDFH.historyitem_CCommonDataListAdd] = CChangeContent;
    changesFactory[AscDFH.historyitem_CCommonDataListRemove] = CChangeContent;
    drawingContentChanges[AscDFH.historyitem_CCommonDataListAdd] = function(oClass) {return oClass.list;};
    drawingContentChanges[AscDFH.historyitem_CCommonDataListRemove] = function(oClass) {return oClass.list;};
    function CCommonDataList() {
      CBaseFormatObject.call(this);
      this.list = [];
    }
    InitClass(CCommonDataList, CBaseFormatObject, AscDFH.historyitem_type_CCommonDataList);

    CCommonDataList.prototype.addToLst = function(nIdx, oPr) {
      var nInsertIdx = Math.min(this.list.length, Math.max(0, nIdx));
      oHistory.Add(new CChangeContent(this, AscDFH.historyitem_CCommonDataListAdd, nInsertIdx, [oPr], true));
      this.list.splice(nInsertIdx, 0, oPr);
      this.setParentToChild(oPr);
    };

    CCommonDataList.prototype.removeFromLst = function(nIdx) {
      if(nIdx > -1 && nIdx < this.list.length) {
        this.list[nIdx].setParent(null);
        oHistory.Add(new CChangeContent(this, AscDFH.historyitem_CCommonDataListRemove, nIdx, [this.list[nIdx]], false));
        this.list.splice(nIdx, 1);
      }
    };

    CCommonDataList.prototype.fillObject = function(oCopy, oIdMap) {
      for(var nIdx = 0; nIdx < this.list.length; ++nIdx) {
        oCopy.addToLst(nIdx, this.list[nIdx].createDuplicate(oIdMap));
      }
    };

    function PtLst() {
      CCommonDataList.call(this);
    }
    InitClass(PtLst, CCommonDataList, AscDFH.historyitem_type_PtLst);

    function CxnLst() {
      CCommonDataList.call(this);
    }
    InitClass(CxnLst, CCommonDataList, AscDFH.historyitem_type_CxnLst);


    changesFactory[AscDFH.historyitem_CxnDestId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnDestOrd] = CChangeLong;
    changesFactory[AscDFH.historyitem_CxnModelId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnParTransId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnPresId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnSibTransId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnSrcId] = CChangeString;
    changesFactory[AscDFH.historyitem_CxnSrcOrd] = CChangeLong;
    changesFactory[AscDFH.historyitem_CxnType] = CChangeLong;
    changesFactory[AscDFH.historyitem_CxnExtLst] = CChangeObject;
    drawingsChangesMap[AscDFH.historyitem_CxnDestId] = function (oClass, value) {oClass.destId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnDestOrd] = function (oClass, value) {oClass.destOrd = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnModelId] = function (oClass, value) {oClass.modelId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnParTransId] = function (oClass, value) {oClass.parTransId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnPresId] = function (oClass, value) {oClass.presId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnSibTransId] = function (oClass, value) {oClass.sibTransId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnSrcId] = function (oClass, value) {oClass.srcId = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnSrcOrd] = function (oClass, value) {oClass.srcOrd = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnType] = function (oClass, value) {oClass.type = value;};
    drawingsChangesMap[AscDFH.historyitem_CxnExtLst] = function (oClass, value) {oClass.extLst = value;};
    function Cxn() {
      CBaseFormatObject.call(this);
      this.destId = null;
      this.destOrd = null;
      this.modelId = null;
      this.parTransId = null;
      this.presId = null;
      this.sibTransId = null;
      this.srcId = null;
      this.srcOrd = null;
      this.type = null;

      this.extLst = null;
    }
    InitClass(Cxn, CBaseFormatObject, AscDFH.historyitem_type_Cxn);

    Cxn.prototype.setDestId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnDestId, this.getDestId(), pr));
      this.destId = pr;
    }

    Cxn.prototype.setDestOrd = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_CxnDestOrd, this.getDestOrd(), pr));
      this.destOrd = pr;
    }

    Cxn.prototype.setModelId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnModelId, this.getModelId(), pr));
      this.modelId = pr;
    }

    Cxn.prototype.setParTransId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnParTransId, this.getParTransId(), pr));
      this.parTransId = pr;
    }

    Cxn.prototype.setPresId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnPresId, this.getPresId(), pr));
      this.presId = pr;
    }

    Cxn.prototype.setSibTransId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnSibTransId, this.getSibTransId(), pr));
      this.sibTransId = pr;
    }

    Cxn.prototype.setSrcId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_CxnSrcId, this.getSrcId(), pr));
      this.srcId = pr;
    }

    Cxn.prototype.setSrcOrd = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_CxnSrcOrd, this.getSrcOrd(), pr));
      this.srcOrd = pr;
    }

    Cxn.prototype.setType = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_CxnType, this.getType(), pr));
      this.type = pr;
    }

    Cxn.prototype.setExtLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_CxnExtLst, this.getExtLst(), oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    Cxn.prototype.getDestId = function() {
      return this.destId;
    }

    Cxn.prototype.getDestOrd = function() {
      return this.destOrd;
    }

    Cxn.prototype.getModelId = function() {
      return this.modelId;
    }

    Cxn.prototype.getParTransId = function() {
      return this.parTransId;
    }

    Cxn.prototype.getPresId = function() {
      return this.presId;
    }

    Cxn.prototype.getSibTransId = function() {
      return this.sibTransId;
    }

    Cxn.prototype.getSrcId = function() {
      return this.srcId;
    }

    Cxn.prototype.getSrcOrd = function() {
      return this.srcOrd;
    }

    Cxn.prototype.getType = function() {
      return this.type;
    }

    Cxn.prototype.getExtLst = function() {
      return this.extLst;
    }

    Cxn.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setDestId(this.getDestId());
      oCopy.setDestOrd(this.getDestOrd());
      oCopy.setModelId(this.getModelId());
      oCopy.setParTransId(this.getParTransId());
      oCopy.setPresId(this.getPresId());
      oCopy.setSibTransId(this.getSibTransId());
      oCopy.setSrcId(this.getSrcId());
      oCopy.setSrcOrd(this.getSrcOrd());
      oCopy.setType(this.getType());
      if (this.getExtLst()) {
        oCopy.setExtLst(this.extLst.createDuplicate(oIdMap));
      }
    }

    function ExtLst() {
      CCommonDataList.call(this);
    }
    InitClass(ExtLst, CCommonDataList, AscDFH.historyitem_type_ExtLst);

    changesFactory[AscDFH.historyitem_ExtUri] = CChangeString;
    drawingsChangesMap[AscDFH.historyitem_ExtUri] = function (oClass, value) {oClass.uri = value;};
    function Ext() {
      CBaseFormatObject.call(this);
      this.uri = null;
    }
    InitClass(Ext, CBaseFormatObject, AscDFH.historyitem_type_Ext);

    Ext.prototype.setUri = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_ExtUri, this.getUri(), pr));
      this.uri = pr;
    }

    Ext.prototype.getUri = function() {
      return this.uri;
    }

    Ext.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setUri(this.getUri());
    }

    changesFactory[AscDFH.historyitem_BgFormatBlipFill] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatEffectDag] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatEffectLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatGradFill] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatGrpFill] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatNoFill] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatPattFill] = CChangeObject;
    changesFactory[AscDFH.historyitem_BgFormatSolidFill] = CChangeObject;
    drawingContentChanges[AscDFH.historyitem_BgFormatBlipFill] = function(oClass) {return oClass.blipFill;};
    drawingContentChanges[AscDFH.historyitem_BgFormatEffectDag] = function(oClass) {return oClass.effectDag;};
    drawingContentChanges[AscDFH.historyitem_BgFormatEffectLst] = function(oClass) {return oClass.effectLst;};
    drawingContentChanges[AscDFH.historyitem_BgFormatGradFill] = function(oClass) {return oClass.gradFill;};
    drawingContentChanges[AscDFH.historyitem_BgFormatGrpFill] = function(oClass) {return oClass.grpFill;};
    drawingContentChanges[AscDFH.historyitem_BgFormatNoFill] = function(oClass) {return oClass.noFill;};
    drawingContentChanges[AscDFH.historyitem_BgFormatPattFill] = function(oClass) {return oClass.pattFill;};
    drawingContentChanges[AscDFH.historyitem_BgFormatSolidFill] = function(oClass) {return oClass.solidFill;};
    function BgFormat() {
      CBaseFormatObject.call(this);
      this.blipFill = null;
      this.effectDag = null;
      this.effectLst = null;
      this.gradFill = null;
      this.grpFill = null;
      this.noFill = null;
      this.pattFill = null;
      this.solidFill = null;
    }
    InitClass(BgFormat, CBaseFormatObject, AscDFH.historyitem_type_BgFormat);


    BgFormat.prototype.setBlipFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatBlipFill, this.getBlipFill(), oPr));
      this.blipFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setEffectDag = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatEffectDag, this.getEffectDag(), oPr));
      this.effectDag = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setEffectLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatEffectLst, this.getEffectLst(), oPr));
      this.effectLst = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setGradFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatGradFill, this.getGradFill(), oPr));
      this.gradFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setGrpFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatGrpFill, this.getGrpFill(), oPr));
      this.grpFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setNoFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatNoFill, this.getNoFill(), oPr));
      this.noFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setPattFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatPattFill, this.getPattFill(), oPr));
      this.pattFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.setSolidFill = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_BgFormatSolidFill, this.getSolidFill(), oPr));
      this.solidFill = oPr;
      this.setParentToChild(oPr);
    }

    BgFormat.prototype.fillObject = function(oCopy, oIdMap) {
      if (this.getBlipFill()) {
        oCopy.setBlipFill(this.getBlipFill().createDuplicate(oIdMap));
      }
      if (this.getEffectDag()) {
        oCopy.setEffectDag(this.getEffectDag().createDuplicate(oIdMap));
      }
      if (this.getEffectLst()) {
        oCopy.setEffectLst(this.getEffectLst().createDuplicate(oIdMap));
      }
      if (this.getGradFill()) {
        oCopy.setGradFill(this.getGradFill().createDuplicate(oIdMap));
      }
      if (this.getGrpFill()) {
        oCopy.setGrpFill(this.getGrpFill().createDuplicate(oIdMap));
      }
      if (this.getNoFill()) {
        oCopy.setNoFill(this.getNoFill().createDuplicate(oIdMap));
      }
      if (this.getPattFill()) {
        oCopy.setPattFill(this.getPattFill().createDuplicate(oIdMap));
      }
      if (this.getSolidFill()) {
        oCopy.setSolidFill(this.getSolidFill().createDuplicate(oIdMap));
      }

    }

    BgFormat.prototype.getBlipFill = function() {
      return this.blipFill;
    }

    BgFormat.prototype.getEffectDag = function() {
      return this.effectDag;
    }

    BgFormat.prototype.getEffectLst = function() {
      return this.effectLst;
    }

    BgFormat.prototype.getGradFill = function() {
      return this.gradFill;
    }

    BgFormat.prototype.getGrpFill = function() {
      return this.grpFill;
    }

    BgFormat.prototype.getNoFill = function() {
      return this.noFill;
    }

    BgFormat.prototype.getPattFill = function() {
      return this.pattFill;
    }

    BgFormat.prototype.getSolidFill = function() {
      return this.solidFill;
    }




    changesFactory[AscDFH.historyitem_WholeEffectDag] = CChangeObject;
    changesFactory[AscDFH.historyitem_WholeEffectLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_WholeLn] = CChangeObject;
    drawingsChangesMap[AscDFH.historyitem_WholeEffectDag] = function (oClass, value) {oClass.effectDag = value;};
    drawingsChangesMap[AscDFH.historyitem_WholeEffectLst] = function (oClass, value) {oClass.effectLst = value;};
    drawingsChangesMap[AscDFH.historyitem_WholeLn] = function (oClass, value) {oClass.ln = value;};
    function Whole() {
      CBaseFormatObject.call(this);
      this.effectDag = null;
      this.effectLst = null;
      this.ln = null;
    }
    InitClass(Whole, CBaseFormatObject, AscDFH.historyitem_type_Whole);

    Whole.prototype.setEffectDag = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_WholeEffectDag, this.getEffectDag(), oPr));
      this.effectDag = oPr;
      this.setParentToChild(oPr);
    }

    Whole.prototype.setEffectLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_WholeEffectLst, this.getEffectLst(), oPr));
      this.effectLst = oPr;
      this.setParentToChild(oPr);
    }

    Whole.prototype.setLn = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_WholeLn, this.getLn(), oPr));
      this.ln = oPr;
      this.setParentToChild(oPr);
    }

    Whole.prototype.getEffectDag = function() {
      return this.effectDag;
    }

    Whole.prototype.getEffectLst = function() {
      return this.effectLst;
    }

    Whole.prototype.getLn = function() {
      return this.ln;
    }

    Whole.prototype.fillObject = function (oCopy, oIdMap) {
      if (this.getEffectDag()) {
        oCopy.setEffectDag(this.effectDag.createDuplicate(oIdMap));
      }
      if (this.getEffectLst()) {
        oCopy.setEffectLst(this.effectLst.createDuplicate(oIdMap));
      }
      if (this.getLn()) {
        oCopy.setLn(this.ln.createDuplicate(oIdMap));
      }
    }

    changesFactory[AscDFH.historyitem_PointCxnId] = CChangeString;
    changesFactory[AscDFH.historyitem_PointModelId] = CChangeString;
    changesFactory[AscDFH.historyitem_PointType] = CChangeLong;
    changesFactory[AscDFH.historyitem_PointExtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointPrSet] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointSpPr] = CChangeObject;
    changesFactory[AscDFH.historyitem_PointT] = CChangeObject;
    drawingsChangesMap[AscDFH.historyitem_PointCxnId] = function (oClass, value) {oClass.cxnId = value;};
    drawingsChangesMap[AscDFH.historyitem_PointModelId] = function (oClass, value) {oClass.modelId = value;};
    drawingsChangesMap[AscDFH.historyitem_PointType] = function (oClass, value) {oClass.type = value;};
    drawingsChangesMap[AscDFH.historyitem_PointExtLst] = function (oClass, value) {oClass.extLst = value;};
    drawingsChangesMap[AscDFH.historyitem_PointPrSet] = function (oClass, value) {oClass.prSet = value;};
    drawingsChangesMap[AscDFH.historyitem_PointSpPr] = function (oClass, value) {oClass.spPr = value;};
    drawingsChangesMap[AscDFH.historyitem_PointT] = function (oClass, value) {oClass.t = value;};
    function Point() {
      CBaseFormatObject.call(this);
      this.cxnId = null;
      this.modelId = null;
      this.type = null;

      this.extLst = null;
      this.prSet = null;
      this.spPr = null;
      this.t = null;
    }

    InitClass(Point, CBaseFormatObject, AscDFH.historyitem_type_Point);

    Point.prototype.setCxnId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PointCxnId, this.getCxnId(), pr));
      this.cxnId = pr;
    }

    Point.prototype.setModelId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PointModelId, this.getModelId(), pr));
      this.modelId = pr;

    }

    Point.prototype.setType = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PointType, this.getType(), pr));
      this.type = pr;
    }

    Point.prototype.setExtLst = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointExtLst, this.getExtLst(), oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.setPrSet = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointPrSet, this.getPrSet(), oPr));
      this.prSet = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.setSpPr = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointSpPr, this.getSpPr(), oPr));
      this.spPr = oPr;
      this.setParentToChild(oPr);
    }

    Point.prototype.setT = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PointT, this.getT(), oPr));
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

    Point.prototype.getExtLst = function () {
      return this.extLst;
    }

    Point.prototype.getPrSet = function () {
      return this.prSet;
    }

    Point.prototype.getSpPr = function () {
      return this.spPr;
    }

    Point.prototype.getT = function () {
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
    drawingsChangesMap[AscDFH.historyitem_PrSetCoherent3DOff] = function (oClass, value) {
      oClass.coherent3DOff = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCsCatId] = function (oClass, value) {
      oClass.csCatId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCsTypeId] = function (oClass, value) {
      oClass.csTypeId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustAng] = function (oClass, value) {
      oClass.custAng = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustFlipHor] = function (oClass, value) {
      oClass.custFlipHor = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustFlipVert] = function (oClass, value) {
      oClass.custFlipVert = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactNeighborX] = function (oClass, value) {
      oClass.custLinFactNeighborX = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactNeighborY] = function (oClass, value) {
      oClass.custLinFactNeighborY = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactX] = function (oClass, value) {
      oClass.custLinFactX = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustLinFactY] = function (oClass, value) {
      oClass.custLinFactY = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustRadScaleInc] = function (oClass, value) {
      oClass.custRadScaleInc = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustRadScaleRad] = function (oClass, value) {
      oClass.custRadScaleRad = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustScaleX] = function (oClass, value) {
      oClass.custScaleX = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustScaleY] = function (oClass, value) {
      oClass.custScaleY = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustSzX] = function (oClass, value) {
      oClass.custSzX = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustSzY] = function (oClass, value) {
      oClass.custSzY = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetCustT] = function (oClass, value) {
      oClass.custT = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetLoCatId] = function (oClass, value) {
      oClass.loCatId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetLoTypeId] = function (oClass, value) {
      oClass.loTypeId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPhldr] = function (oClass, value) {
      oClass.phldr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPhldrT] = function (oClass, value) {
      oClass.phldrT = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresAssocID] = function (oClass, value) {
      oClass.presAssocID = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresName] = function (oClass, value) {
      oClass.presName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleCnt] = function (oClass, value) {
      oClass.presStyleCnt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleIdx] = function (oClass, value) {
      oClass.presStyleIdx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresStyleLbl] = function (oClass, value) {
      oClass.presStyleLbl = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetQsCatId] = function (oClass, value) {
      oClass.qsCatId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetQsTypeId] = function (oClass, value) {
      oClass.qsTypeId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetStyle] = function (oClass, value) {
      oClass.style = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrSetPresLayoutStyle] = function (oClass, value) {
      oClass.presLayoutStyle = value;
    };
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
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCoherent3DOff, this.getCoherent3DOff(), pr));
      this.coherent3DOff = pr;
    }

    PrSet.prototype.setCsCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetCsCatId, this.getCsCatId(), pr));
      this.csCatId = pr;
    }

    PrSet.prototype.setCsTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetCsTypeId, this.getCsTypeId(), pr))
      this.csTypeId = pr;
    }

    PrSet.prototype.setCustAng = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustAng, this.getCustAng(), pr));
      this.custAng = pr;
    }

    PrSet.prototype.setCustFlipHor = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustFlipHor, this.getCustFlipHor(), pr));
      this.custFlipHor = pr;
    }

    PrSet.prototype.setCustFlipVert = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustFlipVert, this.getCustFlipVert(), pr));
      this.custFlipVert = pr;
    }

    PrSet.prototype.setCustLinFactNeighborX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactNeighborX, this.getCustLinFactNeighborX(), pr));
      this.custLinFactNeighborX = pr;
    }

    PrSet.prototype.setCustLinFactNeighborY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactNeighborY, this.getCustLinFactNeighborY(), pr));
      this.custLinFactNeighborY = pr;
    }

    PrSet.prototype.setCustLinFactX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactX, this.getCustLinFactX(), pr));
      this.custLinFactX = pr;
    }

    PrSet.prototype.setCustLinFactY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustLinFactY, this.getCustLinFactY(), pr));
      this.custLinFactY = pr;
    }

    PrSet.prototype.setCustRadScaleInc = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustRadScaleInc, this.getCustRadScaleInc(), pr));
      this.custRadScaleInc = pr;
    }

    PrSet.prototype.setCustRadScaleRad = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustRadScaleRad, this.getCustRadScaleRad(), pr));
      this.custRadScaleRad = pr;
    }

    PrSet.prototype.setCustScaleX = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustScaleX, this.getCustScaleX(), pr));
      this.custScaleX = pr;
    }

    PrSet.prototype.setCustScaleY = function (pr) {
      oHistory.Add(new CChangeDouble2(this, AscDFH.historyitem_PrSetCustScaleY, this.getCustScaleY(), pr));
      this.custScaleY = pr;
    }

    PrSet.prototype.setCustSzX = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustSzX, this.getCustSzX(), pr));
      this.custSzX = pr;
    }

    PrSet.prototype.setCustSzY = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetCustSzY, this.getCustSzY(), pr));
      this.custSzY = pr;
    }

    PrSet.prototype.setCustT = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetCustT, this.getCustT(), pr));
      this.custT = pr;
    }

    PrSet.prototype.setLoCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetLoCatId, this.getLoCatId(), pr));
      this.loCatId = pr;
    }

    PrSet.prototype.setLoTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetLoTypeId, this.getLoTypeId(), pr));
      this.loTypeId = pr;
    }

    PrSet.prototype.setPhldr = function (pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_PrSetPhldr, this.getPhldr(), pr));
      this.phldr = pr;
    }

    PrSet.prototype.setPhldrT = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPhldrT, this.getPhldrT(), pr));
      this.phldrT = pr;
    }

    PrSet.prototype.setPresAssocID = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresAssocID, this.getPresAssocID(), pr));
      this.presAssocID = pr;
    }

    PrSet.prototype.setPresName = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresName, this.getPresName(), pr));
      this.presName = pr;
    }
    PrSet.prototype.setPresStyleCnt = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetPresStyleCnt, this.getPresStyleCnt(), pr));
      this.presStyleCnt = pr;
    }

    PrSet.prototype.setPresStyleIdx = function (pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_PrSetPresStyleIdx, this.getPresStyleIdx(), pr));
      this.presStyleIdx = pr;
    }

    PrSet.prototype.setPresStyleLbl = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetPresStyleLbl, this.getPresStyleLbl(), pr));
      this.presStyleLbl = pr;
    }

    PrSet.prototype.setQsCatId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetQsCatId, this.getQsCatId(), pr));
      this.qsCatId = pr;
    }

    PrSet.prototype.setQsTypeId = function (pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_PrSetQsTypeId, this.getQsTypeId(), pr));
      this.qsTypeId = pr;
    }

    PrSet.prototype.setStyle = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PrSetStyle, this.getStyle(), oPr));
      this.style = oPr;
      this.setParentToChild(oPr);
    }

    PrSet.prototype.setPresLayoutStyle = function (oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_PrSetPresLayoutStyle, this.getPresLayoutStyle(), oPr));
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
        oCopy.setStyle(this.style.createDuplicate(oIdMap));
      }
      if (this.getPresLayoutStyle()) {
        oCopy.setPresLayoutStyle(this.presLayoutStyle.createDuplicate(oIdMap));
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

    PrSet.prototype.getStyle = function () {
      return this.qsTypeId;
    }

    PrSet.prototype.getPresLayoutStyle = function () {
      return this.qsTypeId;
    }

    changesFactory[AscDFH.historyitem_LayoutDefDefStyle] = CChangeString;
    changesFactory[AscDFH.historyitem_LayoutDefMinVer] = CChangeString;
    changesFactory[AscDFH.historyitem_LayoutDefUniqueId] = CChangeString;
    changesFactory[AscDFH.historyitem_LayoutDefCatLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefClrData] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefAddTitle] = CChangeContent;
    changesFactory[AscDFH.historyitem_LayoutDefRemoveTitle] = CChangeContent;
    changesFactory[AscDFH.historyitem_LayoutDefExtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefLayoutNode] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefSampData] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefStyleData] = CChangeObject;
    changesFactory[AscDFH.historyitem_LayoutDefAddDesc] = CChangeContent;
    changesFactory[AscDFH.historyitem_LayoutDefRemoveDesc] = CChangeContent;
    drawingsChangesMap[AscDFH.historyitem_LayoutDefDefStyle] = function (oClass, value) {oClass.defStyle = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefMinVer] = function (oClass, value) {oClass.minVer = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefUniqueId] = function (oClass, value) {oClass.uniqueId = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefCatLst] = function (oClass, value) {oClass.catLst = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefClrData] = function (oClass, value) {oClass.clrData = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefExtLst] = function (oClass, value) {oClass.extLst = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefLayoutNode] = function (oClass, value) {oClass.layoutNode = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefSampData] = function (oClass, value) {oClass.sampData = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutDefStyleData] = function (oClass, value) {oClass.styleData = value;};
    drawingContentChanges[AscDFH.historyitem_LayoutDefAddTitle] = function(oClass) {return oClass.title;};
    drawingContentChanges[AscDFH.historyitem_LayoutDefRemoveTitle] = function(oClass) {return oClass.title;};
    drawingContentChanges[AscDFH.historyitem_LayoutDefAddDesc] = function(oClass) {return oClass.desc;};
    drawingContentChanges[AscDFH.historyitem_LayoutDefRemoveDesc] = function(oClass) {return oClass.desc;};
    function LayoutDef() {
      CBaseFormatObject.call(this);
      this.defStyle = null;
      this.minVer = null;
      this.uniqueId = null;
      this.catLst = null;
      this.clrData = null;
      this.desc = [];
      this.extLst = null;
      this.layoutNode = null;
      this.sampData = null;
      this.styleData = null;
      this.title = [];
    }
    InitClass(LayoutDef, CBaseFormatObject, AscDFH.historyitem_type_LayoutDef);

    LayoutDef.prototype.setDefStyle = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutDefDefStyle, this.getDefStyle(), pr));
      this.defStyle = pr;
    }

    LayoutDef.prototype.setMinVer = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutDefMinVer, this.getMinVer(), pr));
      this.minVer = pr;
    }

    LayoutDef.prototype.setUniqueId = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutDefUniqueId, this.getUniqueId(), pr));
      this.uniqueId = pr;
    }

    LayoutDef.prototype.setCatLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefCatLst, this.getCatLst(), oPr));
      this.catLst = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.setClrData = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefClrData, this.getClrData(), oPr));
      this.clrData = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.setExtLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefExtLst, this.getExtLst(), oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.setLayoutNode = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefLayoutNode, this.getLayoutNode(), oPr));
      this.layoutNode = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.setSampData = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefSampData, this.getSampData(), oPr));
      this.sampData = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.setStyleData = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_LayoutDefStyleData, this.getStyleData(), oPr));
      this.styleData = oPr;
      this.setParentToChild(oPr);
    }

    LayoutDef.prototype.addToLstTitle = function(nIdx, oPr) {
      var nInsertIdx = Math.min(this.title.length, Math.max(0, nIdx));
      oHistory.Add(new CChangeContent(this, AscDFH.historyitem_LayoutDefAddTitle, nInsertIdx, [oPr], true));
      this.title.splice(nInsertIdx, 0, oPr);
      this.setParentToChild(oPr);
    };

    LayoutDef.prototype.removeFromLstTitle = function(nIdx) {
      if(nIdx > -1 && nIdx < this.title.length) {
        this.title[nIdx].setParent(null);
        oHistory.Add(new CChangeContent(this, AscDFH.historyitem_LayoutDefRemoveTitle, nIdx, [this.title[nIdx]], false));
        this.title.splice(nIdx, 1);
      }
    };

    LayoutDef.prototype.addToLstDesc = function(nIdx, oPr) {
      var nInsertIdx = Math.min(this.desc.length, Math.max(0, nIdx));
      oHistory.Add(new CChangeContent(this, AscDFH.historyitem_LayoutDefAddDesc, nInsertIdx, [oPr], true));
      this.desc.splice(nInsertIdx, 0, oPr);
      this.setParentToChild(oPr);
    };

    LayoutDef.prototype.removeFromLstDesc = function(nIdx) {
      if(nIdx > -1 && nIdx < this.desc.length) {
        this.desc[nIdx].setParent(null);
        oHistory.Add(new CChangeContent(this, AscDFH.historyitem_LayoutDefRemoveDesc, nIdx, [this.desc[nIdx]], false));
        this.desc.splice(nIdx, 1);
      }
    };

    LayoutDef.prototype.getDefStyle = function() {
      return this.defStyle;
    }

    LayoutDef.prototype.getMinVer = function() {
      return this.minVer;
    }

    LayoutDef.prototype.getUniqueId = function() {
      return this.uniqueId;
    }

    LayoutDef.prototype.getCatLst = function() {
      return this.catLst;
    }

    LayoutDef.prototype.getClrData = function() {
      return this.clrData;
    }

    LayoutDef.prototype.getDesc = function() {
      return this.desc;
    }

    LayoutDef.prototype.getExtLst = function() {
      return this.extLst;
    }

    LayoutDef.prototype.getLayoutNode = function() {
      return this.layoutNode;
    }

    LayoutDef.prototype.getSampData = function() {
      return this.sampData;
    }

    LayoutDef.prototype.getStyleData = function() {
      return this.styleData;
    }

    LayoutDef.prototype.getTitle = function() {
      return this.title;
    }

    LayoutDef.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setDefStyle(this.getDefStyle());
      oCopy.setMinVer(this.getMinVer());
      oCopy.setUniqueId(this.getUniqueId());
      if (this.getCatLst()) {
        oCopy.setCatLst(this.getCatLst().createDuplicate(oIdMap));
      }
      if (this.getClrData()) {
        oCopy.setClrData(this.getClrData().createDuplicate(oIdMap));
      }
      if (this.getExtLst()) {
        oCopy.setExtLst(this.getExtLst().createDuplicate(oIdMap));
      }
      if (this.getLayoutNode()) {
        oCopy.setLayoutNode(this.getLayoutNode().createDuplicate(oIdMap));
      }
      if (this.getSampData()) {
        oCopy.setSampData(this.getSampData().createDuplicate(oIdMap));
      }
      if (this.getStyleData()) {
        oCopy.setStyleData(this.getStyleData().createDuplicate(oIdMap));
      }
      for(var nIdx = 0; nIdx < this.title.length; ++nIdx) {
        oCopy.addToLst(nIdx, this.title[nIdx].createDuplicate(oIdMap));
      }
      for(nIdx = 0; nIdx < this.desc.length; ++nIdx) {
        oCopy.addToLst(nIdx, this.desc[nIdx].createDuplicate(oIdMap));
      }
    }

    function CatLst() {
      CCommonDataList.call(this);
    }
    InitClass(CatLst, CCommonDataList, AscDFH.historyitem_type_CatLst);

    changesFactory[AscDFH.historyitem_SCatPri] = CChangeLong;
    changesFactory[AscDFH.historyitem_SCatType] = CChangeString;
    drawingsChangesMap[AscDFH.historyitem_SCatPri] = function (oClass, value) {oClass.pri = value;};
    drawingsChangesMap[AscDFH.historyitem_SCatType] = function (oClass, value) {oClass.type = value;};
    function SCat() {
      CBaseFormatObject.call(this);
      this.pri = null;
      this.type = null;
    }
    InitClass(SCat, CBaseFormatObject, AscDFH.historyitem_type_SCat);

    SCat.prototype.setPri = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_SCatPri, this.getPri(), pr));
      this.pri = pr;
    }

    SCat.prototype.setType = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_SCatType, this.getType(), pr));
      this.type = pr;
    }

    SCat.prototype.getPri = function() {
      return this.pri;
    }

    SCat.prototype.getType = function() {
      return this.type;
    }

    SCat.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setPri(this.getPri());
      oCopy.setType(this.getType());
    }

    changesFactory[AscDFH.historyitem_ClrDataUseDef] = CChangeBool;
    changesFactory[AscDFH.historyitem_ClrDataDataModel] = CChangeObject;
    drawingsChangesMap[AscDFH.historyitem_ClrDataUseDef] = function (oClass, value) {oClass.useDef = value;};
    drawingsChangesMap[AscDFH.historyitem_ClrDataDataModel] = function (oClass, value) {oClass.dataModel = value;};
    function ClrData() {
      CBaseFormatObject.call(this);
      this.useDef = null;
      this.dataModel = null;
    }
    InitClass(ClrData, CBaseFormatObject, AscDFH.historyitem_type_ClrData);

    ClrData.prototype.setUseDef = function(pr) {
      oHistory.Add(new CChangeBool(this, AscDFH.historyitem_ClrDataUseDef, this.getUseDef(), pr));
      this.useDef = pr;
    }

    ClrData.prototype.setDataModel = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_ClrDataDataModel, this.getDataModel(), oPr));
      this.dataModel = oPr;
      this.setParentToChild(oPr);
    }

    ClrData.prototype.getUseDef = function() {
      return this.useDef;
    }

    ClrData.prototype.getDataModel = function() {
      return this.dataModel;
    }

    ClrData.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setUseDef(this.getUseDef());
      if (this.getDataModel()) {
        oCopy.setDataModel(this.getDataModel().createDuplicate(oIdMap));
      }
    }

    changesFactory[AscDFH.historyitem_DescLang] = CChangeString;
    changesFactory[AscDFH.historyitem_DescVal] = CChangeString;
    drawingsChangesMap[AscDFH.historyitem_DescLang] = function (oClass, value) {oClass.lang = value;};
    drawingsChangesMap[AscDFH.historyitem_DescVal] = function (oClass, value) {oClass.val = value;};
    function Desc() {
      CBaseFormatObject.call(this);
      this.lang = null;
      this.val = null;
    }
    InitClass(Desc, CBaseFormatObject, AscDFH.historyitem_type_Desc);

    Desc.prototype.setLang = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_DescLang, this.getLang(), pr));
      this.lang = pr;
    }

    Desc.prototype.setVal = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_DescVal, this.getVal(), pr));
      this.val = pr;
    }

    Desc.prototype.getLang = function() {
      return this.lang;
    }

    Desc.prototype.getVal = function() {
      return this.val;
    }

    Desc.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setLang(this.getLang());
      oCopy.setVal(this.getVal());
    }

    changesFactory[AscDFH.historyitem_LayoutNodeChOrder] = CChangeLong;
    changesFactory[AscDFH.historyitem_LayoutNodeMoveWith] = CChangeString;
    changesFactory[AscDFH.historyitem_LayoutNodeName] = CChangeString;
    changesFactory[AscDFH.historyitem_LayoutNodeStyleLbl] = CChangeString;
    drawingsChangesMap[AscDFH.historyitem_LayoutNodeChOrder] = function (oClass, value) {oClass.chOrder = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutNodeMoveWith] = function (oClass, value) {oClass.moveWith = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutNodeName] = function (oClass, value) {oClass.name = value;};
    drawingsChangesMap[AscDFH.historyitem_LayoutNodeStyleLbl] = function (oClass, value) {oClass.styleLbl = value;};
    function LayoutNode() {
      CCommonDataList.call(this);
      this.chOrder = null;
      this.moveWith = null;
      this.name = null;
      this.styleLbl = null;
    }
    InitClass(LayoutNode, CCommonDataList, AscDFH.historyitem_type_LayoutNode);

    LayoutNode.prototype.setChOrder = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_LayoutNodeChOrder, this.getChOrder(), pr));
      this.chOrder = pr;
    }

    LayoutNode.prototype.setMoveWith = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutNodeMoveWith, this.getMoveWith(), pr));
      this.moveWith = pr;
    }

    LayoutNode.prototype.setName = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutNodeName, this.getName(), pr));
      this.name = pr;
    }

    LayoutNode.prototype.setStyleLbl = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_LayoutNodeStyleLbl, this.getStyleLbl(), pr));
      this.styleLbl = pr;
    }

    LayoutNode.prototype.getChOrder = function() {
      return this.chOrder;
    }

    LayoutNode.prototype.getMoveWith = function() {
      return this.moveWith;
    }

    LayoutNode.prototype.getName = function() {
      return this.name;
    }

    LayoutNode.prototype.getStyleLbl = function() {
      return this.styleLbl;
    }

    LayoutNode.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setChOrder(this.getChOrder());
      oCopy.setMoveWith(this.getMoveWith());
      oCopy.setName(this.getName());
      oCopy.setStyleLbl(this.getStyleLbl());
    }

    changesFactory[AscDFH.historyitem_AlgRev] = CChangeLong;
    changesFactory[AscDFH.historyitem_AlgType] = CChangeLong;
    changesFactory[AscDFH.historyitem_AlgExtLst] = CChangeObject;
    changesFactory[AscDFH.historyitem_AlgAddParam] = CChangeContent;
    changesFactory[AscDFH.historyitem_AlgRemoveParam] = CChangeContent;
    drawingsChangesMap[AscDFH.historyitem_AlgRev] = function (oClass, value) {oClass.rev = value;};
    drawingsChangesMap[AscDFH.historyitem_AlgType] = function (oClass, value) {oClass.type = value;};
    drawingsChangesMap[AscDFH.historyitem_AlgExtLst] = function (oClass, value) {oClass.extLst = value;};
    drawingContentChanges[AscDFH.historyitem_AlgAddParam] = function(oClass) {return oClass.param;};
    drawingContentChanges[AscDFH.historyitem_AlgRemoveParam] = function(oClass) {return oClass.param;};
    function Alg() {
      CBaseFormatObject.call(this);
      this.rev = null;
      this.type = null;
      this.extLst = null;
      this.param = [];
    }
    InitClass(Alg, CBaseFormatObject, AscDFH.historyitem_type_Alg);

    Alg.prototype.setRev = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_AlgRev, this.getRev(), pr));
      this.rev = pr;
    }

    Alg.prototype.setType = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_AlgType, this.getType(), pr));
      this.type = pr;
    }

    Alg.prototype.setExtLst = function(oPr) {
      oHistory.Add(new CChangeObject(this, AscDFH.historyitem_AlgExtLst, this.getExtLst(), oPr));
      this.extLst = oPr;
      this.setParentToChild(oPr);
    }

    Alg.prototype.addToLstParam = function(nIdx, oPr) {
      var nInsertIdx = Math.min(this.param.length, Math.max(0, nIdx));
      oHistory.Add(new CChangeContent(this, AscDFH.historyitem_AlgAddParam, nInsertIdx, [oPr], true));
      this.param.splice(nInsertIdx, 0, oPr);
      this.setParentToChild(oPr);
    };

    Alg.prototype.removeFromLstParam = function(nIdx) {
      if(nIdx > -1 && nIdx < this.param.length) {
        this.param[nIdx].setParent(null);
        oHistory.Add(new CChangeContent(this, AscDFH.historyitem_AlgRemoveParam, nIdx, [this.param[nIdx]], false));
        this.param.splice(nIdx, 1);
      }
    };

    Alg.prototype.getRev = function() {
      return this.rev;
    }

    Alg.prototype.getType = function() {
      return this.type;
    }

    Alg.prototype.getExtLst = function() {
      return this.extLst;
    }

    Alg.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setRev(this.getRev());
      oCopy.setType(this.getType());
      if (this.getExtLst()) {
        oCopy.setExtLst(this.getExtLst().createDuplicate(oIdMap));
      }
      for(var nIdx = 0; nIdx < this.param.length; ++nIdx) {
        oCopy.addToLst(nIdx, this.param[nIdx].createDuplicate(oIdMap));
      }
    }


    changesFactory[AscDFH.historyitem_ParamType] = CChangeLong;
    changesFactory[AscDFH.historyitem_ParamVal] = CChangeString;
    drawingsChangesMap[AscDFH.historyitem_ParamType] = function (oClass, value) {oClass.type = value;};
    drawingsChangesMap[AscDFH.historyitem_ParamVal] = function (oClass, value) {oClass.val = value;};
    function Param() {
      CBaseFormatObject.call(this);
      this.type = null;
      this.val = null;
    }
    InitClass(Param, CBaseFormatObject, AscDFH.historyitem_type_Param);

    Param.prototype.setType = function(pr) {
      oHistory.Add(new CChangeLong(this, AscDFH.historyitem_ParamType, this.getType(), pr));
      this.type = pr;
    }

    Param.prototype.setVal = function(pr) {
      oHistory.Add(new CChangeString(this, AscDFH.historyitem_ParamVal, this.getVal(), pr));
      this.val = pr;
    }

    Param.prototype.getType = function() {
      return this.type;
    }

    Param.prototype.getVal = function() {
      return this.val;
    }

    Param.prototype.fillObject = function (oCopy, oIdMap) {
      oCopy.setType(this.getType());
      oCopy.setVal(this.getVal());
    }



  })(window)
