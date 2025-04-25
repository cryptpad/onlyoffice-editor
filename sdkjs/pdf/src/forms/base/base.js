/*
 * (c) Copyright Ascensio System SIA 2010-2024
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
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
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

(function(){

    //------------------------------------------------------------------------------------------------------------------
	//
	// Internal
	//
	//------------------------------------------------------------------------------------------------------------------

    let FIELDS_HIGHLIGHT = {
        r: 221,
        g: 228,
        b: 255
    };
    let FIELDS_HIGHLIGHT_REQ = {
        r: 176,
        g: 176,
        b: 255
    };

    let BUTTON_PRESSED = {
        r: 153,
        g: 193,
        b: 218
    };

    let BORDER_TYPES = {
        solid:      0,
        beveled:    1,
        dashed:     2,
        inset:      3,
        underline:  4
    };

    //------------------------------------------------------------------------------------------------------------------
	//
	// pdf api types
	//
	//------------------------------------------------------------------------------------------------------------------
    
    let ALIGN_TYPE = {
        left:   0,
        center: 1,
        right:  2
    };

    let APPEARANCE_TYPE = {
        normal:     0,
        rollover:   1,
        mouseDown:  2
    };

    const CHAR_LIM_MAX = 500; // to do проверить

    // For Span attributes (start)
    let FONT_STRETCH = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal",
        "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];

    let FONT_STYLE = {
        italic: "italic",
        normal: "normal"
    }

    let FONT_WEIGHT = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    let LINE_WIDTH = {
        none:   0,
        thin:   1,
        medium: 2,
        thick:  3
    }

    let VALID_ROTATIONS = [0, 90, 180, 270];

    const MAX_TEXT_SIZE = 32767;
	
	const DEFAULT_FIELD_FONT = "Arial";
	
	
	// freeze objects
    Object.freeze(FIELDS_HIGHLIGHT);
    Object.freeze(ALIGN_TYPE);
    Object.freeze(FONT_STRETCH);
    Object.freeze(FONT_STYLE);
    Object.freeze(FONT_WEIGHT);
    Object.freeze(VALID_ROTATIONS);

    
    /**
	 * Class representing a base field class.
	 * @constructor
    */
    function CBaseField(sName, nType, nPage, aRect, oDoc)
    {
        this.type = nType;

        this._kids          = [];
        this._borderStyle   = undefined;
        this._delay         = false;
        this._display       = AscPDF.Api.Objects.display["visible"];
        this._doc           = oDoc;
        this._fillColor     = undefined;
        this._bgColor       = undefined;          // prop for old versions (fillColor)
        this._hidden        = false;             // This property has been superseded by the display property and its use is discouraged.
        this._lineWidth     = undefined;        // In older versions of this specification, this property was borderWidth
        this._borderWidth   = undefined;       
        this._name          = sName;         // partial field name
        this._page          = nPage;        // integer | array
        this._print         = true;        // This property has been superseded by the display property and its use is discouraged.
        this._readonly      = false;
        this._required      = false;       // for all except button
        this._rotation      = 0;
        this._strokeColor   = null;     // In older versions of this specification, this property was borderColor. The use of borderColor is now discouraged,
                                        // although it is still valid for backward compatibility.
        this._noExport      = false;
        this._borderColor   = undefined;
        this._submitName    = "";
        this._textColor     = [0,0,0];
        this._textFont          = undefined; // исходный
        this._textFontActual    = undefined; // фактический используемый
        this._fgColor       = undefined;
        this._textSize      = 10;
        this._fontStyle     = 0;    // информация о стиле шрифта (bold, italic)
        this._userName      = "";   // It is intended to be used as tooltip text whenever the cursor enters a field. 
        //It can also be used as a user-friendly name, instead of the field name, when generating error messages.
        this._parent        = null;
        
        this._triggers = new AscPDF.CFormTriggers();

        // internal
        this._id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add(this, this._id);

        this._isWidget = aRect && aRect.length == 4 ? true : false;

        this._curShiftView = { // смещение, когда мы скролим, т.е. активное смещение
            x: 0,
            y: 0
        }
        this._oldShiftView = { // смещение, когда значение формы применено (т.е. форма не активна)
            x: 0,
            y: 0
        }

        this._apIdx     = undefined; // индекс формы на странице в исходном файле (в массиве метода getInteractiveForms), используется для получения appearance
        this._parentIdx = undefined; // индекс родителя во время чтения

        this.needCommit             = false;
        this._needDrawHighlight     = true;
        this._needDrawHoverBorder   = false;
        this._needRecalc            = true;
        this._wasChanged            = false; // была ли изменена форма
        this._bDrawFromStream       = false; // нужно ли рисовать из стрима
        this._hasOriginView         = false; // имеет ли внешний вид из файла
        this._originView = {
            normal:     null,
            mouseDown:  null,
            rollover:   null
        }

        this._partialName = sName;
        this.api = this.GetFormApi();
        this["api"] = this.api;
		
		this.compositeInput = null;
		this.compositeReplaceCount = 0;

        this.Lock = new AscCommon.CLock();
        this.SetRect(aRect);
    }

    CBaseField.prototype.IsAnnot = function() {
        return false;
    };
    CBaseField.prototype.IsForm = function() {
        return true;
    };
    CBaseField.prototype.IsDrawing = function() {
        return false;
    };
    CBaseField.prototype.IsPdfObject = function() {
        return true;
    };
    CBaseField.prototype.SetApIdx = function(nIdx) {
        this._apIdx = nIdx;
    };
    CBaseField.prototype.GetApIdx = function() {
        if (-1 == this._apIdx) {
            if (undefined == this.GetId()) {
                return -1;
            }
            else {
                let nApIdx = Number(this.GetId().replace("_", ""));
                if (!isNaN(nApIdx)) {
                    return nApIdx;
                }
            }
        }

        return this._apIdx;
    };

    CBaseField.prototype.AddToChildsMap = function(nIdx) {
        this.GetDocument().AddFieldToChildsMap(this, nIdx);
    };
    /**
	 * Can or not enter text into form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.IsCanEditText = function() {
        return false;
    };
	/**
	 * Check if fonts are available, if not then we download them
	 * @returns {boolean}
	 */
	CBaseField.prototype.checkFonts = function() {
		return this._doc && 1 === this._doc.defaultFontsLoaded;
	};
	CBaseField.prototype.getAllRasterImages = function(images) {};
    /**
	 * Invokes only on open forms.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetOriginPage = function(nPage) {
        this._origPage = nPage;
    };
    CBaseField.prototype.GetOriginPage = function() {
        return this._origPage;
    };

    /**
	 * Gets the child field by the specified partial name.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 * @returns {?CBaseField}
	 */
    CBaseField.prototype.GetField = function(sName) {
        for (let i = 0; i < this._kids.length; i++) {
            if (this._kids[i]._partialName == sName)
                return this._kids[i];
        }

        return null;
    };
    CBaseField.prototype.SetNeedCommit = function(bValue) {
        if (editor.getDocumentRenderer().IsOpenFormsInProgress)
            return;

        this.needCommit = bValue;
    };
    CBaseField.prototype.IsNeedCommit = function() {
        return this.needCommit;
    };
    CBaseField.prototype.SetPage = function(nPage) {
        if (this.GetPage() == nPage) {
            return;
        }
        
        let oDoc        = this.GetDocument();
        let oNewPage    = oDoc.GetPageInfo(nPage);
        
        if (oNewPage) {
            oDoc.RemoveField(this.GetId(), true);
            oDoc.AddField(this, nPage);
        }
    };
    CBaseField.prototype.GetPage = function() {
        let oParentPage = this.GetParentPage();
        if (!oParentPage || !(oParentPage instanceof AscPDF.CPageInfo)) {
            return -1;
        }

        return oParentPage.GetIndex();
    };

    /**
	 * Gets the child field by the specified partial name.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 * @returns {?CBaseField}
	 */
    CBaseField.prototype.AddKid = function(oField) {
        this._kids.push(oField);
        AscCommon.History.Add(new CChangesPDFFormAddKid(this, this._kids.length - 1, [oField]))
        oField._parent = this;
    };
    CBaseField.prototype.GetKids = function() {
        return this._kids;
    };
    CBaseField.prototype.GetKid = function(nPos, bStrict) {
        if (this.IsWidget() && bStrict != true)
            return this;

        return this._kids[nPos];
    };
    /**
	 * Removes field from kids.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @param {CBaseField} oField - the field to remove.
	 * @returns {boolean} - returns false if field isn't in the field kids.
	 */
    CBaseField.prototype.RemoveKid = function(oField) {
        let nIndex = this._kids.indexOf(oField);
        if (nIndex != -1) {
            this._kids.splice(nIndex, 1);
            AscCommon.History.Add(new CChangesPDFFormRemoveKid(this, nIndex, [oField]))
            oField._parent = null;
            return true;
        }

        return false;
    };
    
    /**
	 * Gets all widgets fields of this parent field.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 * @returns {Array}
	 */
    CBaseField.prototype.GetAllWidgets = function() {
        if (this.IsWidget())
            return [];

        let aWidgets    = [];
        let aKids       = this.GetKids();
        for (let i = 0; i < aKids.length; i++) {
            if (aKids[i].IsWidget()) {
                aWidgets.push(aKids[i]);
            }
            else
                aWidgets = aWidgets.concat(aKids[i].GetAllWidgets());
        }

        return aWidgets;
    };

    CBaseField.prototype.Recalculate = function() {};
    
    CBaseField.prototype.GetDocContent = function(bFormatContent) {
        return bFormatContent ? this.contentFormat : this.content;
    };

    CBaseField.prototype.getFormRelRect = function() {
        return this.contentClipRect;
    };
    CBaseField.prototype.getFormRect = function() {
        let aOrigRect = this.GetOrigRect();

        return {
            X : aOrigRect[0] * g_dKoef_pt_to_mm,
            Y : aOrigRect[1] * g_dKoef_pt_to_mm,
            W : (aOrigRect[2] - aOrigRect[0]) * g_dKoef_pt_to_mm,
            H : (aOrigRect[3] - aOrigRect[1]) * g_dKoef_pt_to_mm
        }
    };
    
    CBaseField.prototype.GetFullName = function() {
        if (this._parent)
        {
            if (this._partialName != undefined)
                return this._parent.GetFullName() + "." + this._partialName;
            else
                return this._parent.GetFullName();
        }

        return this._partialName ? this._partialName : "";
    };
    CBaseField.prototype.GetPartialName = function() {
        return this._partialName;
    };
    /**
	 * Sets the action of the field for a given trigger.
     * Note: This method will overwrite any action already defined for the chosen trigger.
	 * @memberof CBaseField
     * @param {number} nTriggerType - A string that sets the trigger for the action. (FORMS_TRIGGERS_TYPES)
	 * @param {Array} aActionsInfo - array with actions info for specified trigger. (info from openForms method)
     * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetActionsOnOpen = function(nTriggerType, aActionsInfo) {
        let oDocument = this.GetDocument();
        let aActions = [];
        for (let i = 0; i < aActionsInfo.length; i++) {
            let oAction;
            let aFields = [];
            switch (aActionsInfo[i]["S"]) {
                case AscPDF.ACTIONS_TYPES.JavaScript:
                    oAction = new AscPDF.CActionRunScript(aActionsInfo[i]["JS"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case AscPDF.ACTIONS_TYPES.ResetForm:
                    oAction = new AscPDF.CActionReset(aActionsInfo[i]["Fields"], Boolean(aActionsInfo[i]["Flags"]));
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case AscPDF.ACTIONS_TYPES.URI:
                    oAction = new AscPDF.CActionURI(aActionsInfo[i]["URI"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case AscPDF.ACTIONS_TYPES.HideShow:
                    oAction = new AscPDF.CActionHideShow(Boolean(aActionsInfo[i]["H"]), aActionsInfo[i]["T"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case AscPDF.ACTIONS_TYPES.GoTo:
                    let oRect = {
                        top:    aActionsInfo[i]["top"],
                        right:  aActionsInfo[i]["right"],
                        bottom: aActionsInfo[i]["bottom"],
                        left:   aActionsInfo[i]["left"]
                    }
                    if (aActionsInfo[i]["bottom"] != null && aActionsInfo[i]["top"] != null) {
                        oRect.top = aActionsInfo[i]["bottom"];
                        oRect.bottom = aActionsInfo[i]["top"];
                    }

                    oAction = new AscPDF.CActionGoTo(aActionsInfo[i]["page"], aActionsInfo[i]["kind"], aActionsInfo[i]["zoom"], oRect);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case AscPDF.ACTIONS_TYPES.Named:
                    oAction = new AscPDF.CActionNamed(AscPDF.CActionNamed.GetInternalType(aActionsInfo[i]["N"]));
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
            }
        }

        switch (nTriggerType) {
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseUp:
                this._triggers.MouseUp = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseDown:
                this._triggers.MouseDown = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter:
                this._triggers.MouseEnter = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseExit:
                this._triggers.MouseExit = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnFocus:
                this._triggers.OnFocus = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnBlur:
                this._triggers.OnBlur = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Keystroke:
                this._triggers.Keystroke = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Validate:
                this._triggers.Validate = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Calculate:
                this._triggers.Calculate = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Format:
                this._triggers.Format = new AscPDF.CFormTrigger(nTriggerType, aActions);
                break;
        }

        aActions.forEach(function(oAction) {
            oAction.SetTrigger(nTriggerType);
        });

        return aActions;
    };

    /**
	 * Sets the JavaScript action of the field for a given trigger.
     * Note: This method will overwrite any action already defined for the chosen trigger.
	 * @memberof CBaseField
     * @param {number} nTriggerType - A string that sets the trigger for the action.
     * @param {string} sScript - The JavaScript code to be executed when the trigger is activated.
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetAction = function(nTriggerType, sScript) {
        let oDoc        = this.GetDocument();
        let oCalcInfo   = oDoc.GetCalculateInfo();
        let oAction     = new AscPDF.CActionRunScript(sScript);
        oAction.SetField(this);

        switch (nTriggerType) {
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseUp:
                this._triggers.MouseUp = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseDown:
                this._triggers.MouseDown = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter:
                this._triggers.MouseEnter = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseExit:
                this._triggers.MouseExit = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnFocus:
                this._triggers.OnFocus = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnBlur:
                this._triggers.OnBlur = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Keystroke:
                this._triggers.Keystroke = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Validate:
                this._triggers.Validate = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Calculate:
                this._triggers.Calculate = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                oCalcInfo.RemoveFieldFromOrder(this.GetFullName());
                oCalcInfo.AddFieldToOrder(oDoc.GetField(this.GetFullName()).GetApIdx());
                break;
            case AscPDF.FORMS_TRIGGERS_TYPES.Format:
                this._triggers.Format = new AscPDF.CFormTrigger(nTriggerType, [oAction]);
                break;
        }
    };

    /**
	 * Sets a flag that we have entered the field.
     * This is not the same as an doc.activeField.
	 * @memberof CBaseField
     * @param {boolean} bInField
	 */
    CBaseField.prototype.SetInForm = function(bInField) {
        this.isInForm = bInField;
    };
    CBaseField.prototype.IsInForm = function() {
        return !!this.isInForm;
    };
    
    /**
	 * Gets the JavaScript action of the field for a given trigger.
	 * @memberof CBaseField
     * @param {number} nType - A string that sets the trigger for the action. (FORMS_TRIGGERS_TYPES)
	 * @typeofeditors ["PDF"]
     * @returns {CFormTrigger}
	 */
    CBaseField.prototype.GetTrigger = function(nType) {
        switch (nType) {
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseUp:
                return this._triggers.MouseUp;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseDown:
                return this._triggers.MouseDown;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter:
                return this._triggers.MouseEnter;
            case AscPDF.FORMS_TRIGGERS_TYPES.MouseExit:
                return this._triggers.MouseExit;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnFocus:
                return this._triggers.OnFocus;
            case AscPDF.FORMS_TRIGGERS_TYPES.OnBlur:
                return this._triggers.OnBlur;
            case AscPDF.FORMS_TRIGGERS_TYPES.Keystroke:
                return this._triggers.Keystroke;
            case AscPDF.FORMS_TRIGGERS_TYPES.Validate:
                return this._triggers.Validate;
            case AscPDF.FORMS_TRIGGERS_TYPES.Calculate:
                return this._triggers.Calculate;
            case AscPDF.FORMS_TRIGGERS_TYPES.Format:
                return this._triggers.Format;
        }

        return null;
    };
    CBaseField.prototype.GetListActions = function() {
        let aActions = [];

        let oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.MouseUp);
        if (oAction) {
            aActions.push(oAction);
        }
        
        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.MouseDown);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.MouseExit);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.OnFocus);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.OnBlur);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Keystroke);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Validate);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Calculate);
        if (oAction) {
            aActions.push(oAction);
        }

        oAction = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Format);
        if (oAction) {
            aActions.push(oAction);
        }
        
        return aActions;
    };
    CBaseField.prototype.SetDocument = function(oDoc) {
        if (this._doc == oDoc) {
            return;
        }

        this._doc = oDoc;
    };
    CBaseField.prototype.GetDocument = function() {
        return this._doc;
    };

    CBaseField.prototype.GetParent = function() {
        return this._parent;
    };

    /**
	 * Gets form value (which was commited).
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.GetParentValue = function(bInherit) {
        let oParent = this.GetParent();
        if (oParent == null && this._value == null)
            return undefined;
        else if (bInherit === false || (this._value != null && this.GetPartialName() != null)) {
            return this._value;
        }
        
        if (oParent)
            return oParent.GetParentValue();
    };
    /**
	 * Sets api value of form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetParentValue = function(value) {
        let oParent = this.GetParent();
        if (oParent && this.IsWidget() && oParent.IsAllKidsWidgets())
            oParent.SetParentValue(value);
        else {
            this.SetWasChanged(true);
            let oDoc = this.GetDocument();
            oDoc.History.Add(new CChangesPDFFormParentValue(this, this._value, value));
            this._value = value;
        }
    };

    /**
	 * Checks if all kids are widgets (and have same names).
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.IsAllKidsWidgets = function() {
        let aKids = this.GetKids();

        if (aKids.length > 0) {
            if (aKids[0].IsWidget() == false)
                return false;

            let sFullName = aKids[0].GetFullName();
            for (let i = 1; i < aKids.length; i++) {
                if (sFullName != aKids[i].GetFullName() || aKids[i].IsWidget() == false)
                    return false;
            }

            return true;
        }

        return false;
    };
    /**
     * Does the actions setted for specifed trigger type.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @returns {canvas}
	 */
    CBaseField.prototype.AddActionsToQueue = function() {
        let oThis           = this;
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        Object.values(arguments).forEach(function(type) {
            let oTrigger = oThis.GetTrigger(type);
        
            if (oTrigger && oTrigger.Actions.length > 0 && false == AscCommon.History.UndoRedoInProgress) {
                oActionsQueue.AddActions(oTrigger.Actions);
            }
        })
        
        oActionsQueue.Start();
    };
    CBaseField.prototype.IsUseInDocument = function() {
        let oPage = this.GetParentPage();
        if (oPage && oPage.fields.includes(this)) {
            return true;
        }

        return false;
    };
    CBaseField.prototype.DrawHighlight = function(oCtx) {
        if (this.IsHidden() == true)
            return;

        let oViewer     = Asc.editor.getDocumentRenderer();
        let nPage       = this.GetPage();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom * oViewer.getDrawingPageScale(nPage);
        let aBgColor    = this.GetBackgroundColor();

        let xCenter = oViewer.width >> 1;
        if (oViewer.documentWidth > oViewer.width) {
            xCenter = (oViewer.documentWidth >> 1) - (oViewer.scrollX) >> 0;
        }
        let yPos    = oViewer.scrollY >> 0;
        let page    = oViewer.drawingPages[nPage];
        let w       = (page.W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let h       = (page.H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let indLeft = ((xCenter * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - (w >> 1);
        let indTop  = ((page.Y - yPos) * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        
        let isLandscape = oViewer.isLandscapePage(nPage);
        if (isLandscape) {
            indLeft = indLeft + (w - h) / 2;
        }

        let aOrigRect = this.GetOrigRect();
        let X = aOrigRect[0] * nScale + indLeft;
        let Y = aOrigRect[1] * nScale + indTop;
        let W = (aOrigRect[2] - aOrigRect[0]) * nScale;
        let H = (aOrigRect[3] - aOrigRect[1]) * nScale;

        if (null == aBgColor)
            oCtx.globalAlpha = 0.8;
        
        oCtx.globalCompositeOperation = "destination-over";
        
        if (this.IsNeedDrawFromStream())
            AscPDF.startMultiplyMode(oCtx);
        
        if (this.GetType() == AscPDF.FIELD_TYPES.radiobutton && this._chStyle == AscPDF.CHECKBOX_STYLES.circle) {
            oCtx.beginPath();
            if (this.IsRequired())
                oCtx.fillStyle = 'rgb(' + FIELDS_HIGHLIGHT_REQ.r + ', ' + FIELDS_HIGHLIGHT_REQ.g + ', ' + FIELDS_HIGHLIGHT_REQ.b + ')';
            else 
                oCtx.fillStyle = 'rgb(' + FIELDS_HIGHLIGHT.r + ', ' + FIELDS_HIGHLIGHT.g + ', ' + FIELDS_HIGHLIGHT.b + ')';
            // выставляем в центр круга
            let centerX = X + W / 2;
            let centerY = Y + H / 2;
            let nRadius = Math.min(W / 2, H / 2);
            oCtx.arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
            oCtx.fill();
            oCtx.closePath();
        }
        else if (this.GetType() != AscPDF.FIELD_TYPES.button){
            oCtx.beginPath();
            if (this.IsRequired())
                oCtx.fillStyle = 'rgb(' + FIELDS_HIGHLIGHT_REQ.r + ', ' + FIELDS_HIGHLIGHT_REQ.g + ', ' + FIELDS_HIGHLIGHT_REQ.b + ')';
            else 
                oCtx.fillStyle = 'rgb(' + FIELDS_HIGHLIGHT.r + ', ' + FIELDS_HIGHLIGHT.g + ', ' + FIELDS_HIGHLIGHT.b + ')';
            oCtx.fillRect(X, Y, W, H);
            oCtx.closePath();
        }
        
        AscPDF.endMultiplyMode(oCtx);
    };
    CBaseField.prototype.DrawBorders = function(oGraphicsPDF) {
        let aOringRect  = this.GetOrigRect();
        let aBgColor;
        if (this.GetType() == AscPDF.FIELD_TYPES.button)
            aBgColor = this.GetBackgroundColor() || [1];
        else
            aBgColor = this.IsNeedDrawHighlight() == false ? (this.GetBackgroundColor() || [1]) : [1];

        let oBgRGBColor = this.GetRGBColor(aBgColor);

        if (aBgColor && aBgColor.length != 0)
            oBgRGBColor = AscPDF.MakeColorMoreGray(oBgRGBColor, 50);
        
        let nLineWidth = this.GetBorderWidth() != undefined ? this.GetBorderWidth() : 1;

        if (nLineWidth == 0) {
            return;
        }

        oGraphicsPDF.SetLineWidth(nLineWidth);

        let X       = aOringRect[0];
        let Y       = aOringRect[1];
        let nWidth  = aOringRect[2] - aOringRect[0];
        let nHeight = aOringRect[3] - aOringRect[1];

        let color;
        if (this._strokeColor != null) {
            color = this.GetRGBColor(this._strokeColor);
            oGraphicsPDF.SetStrokeStyle(color.r, color.g, color.b);
        }

        // корректировка координат по бордеру
        Y += nLineWidth / 2;
        X += nLineWidth / 2;
        nWidth  -= nLineWidth;
        nHeight -= nLineWidth;

        // по умолчанию рисуется solid
        let nBorderStyle = this.GetBorderStyle() != undefined ? this.GetBorderStyle() : BORDER_TYPES.solid;

        if (this.GetType() == AscPDF.FIELD_TYPES.radiobutton && this._chStyle == AscPDF.CHECKBOX_STYLES.circle) {
            // выставляем в центр круга
            let centerX = X + nWidth / 2;
            let centerY = Y + nHeight / 2;
            let nRadius = Math.min(nWidth / 2, nHeight / 2);

            // отрисовка
            switch (nBorderStyle) {
                case BORDER_TYPES.solid:
                case BORDER_TYPES.underline:
                    if (color == null)
                        break;
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.beveled:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                        oGraphicsPDF.Stroke();
                    }

                    // left semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, 3 * Math.PI / 4, - Math.PI / 4, false);
                    if (this.IsPressed()) {
                        oGraphicsPDF.SetStrokeStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                    }
                    else {
                        oGraphicsPDF.SetStrokeStyle(255, 255, 255);
                    }
                    oGraphicsPDF.Stroke();

                    // right semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, - Math.PI / 4, 3 * Math.PI / 4, false);
                    if (this.IsPressed()) {
                        oGraphicsPDF.SetStrokeStyle(255, 255, 255);
                    }
                    else {
                        oGraphicsPDF.SetStrokeStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                    }
                    oGraphicsPDF.Stroke();

                    break;
                case BORDER_TYPES.dashed:
                    if (color == null)
                        break;

                    oGraphicsPDF.SetLineDash([3]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.inset:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                        oGraphicsPDF.Stroke();
                    }
                    
                    // left semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, 3 * Math.PI / 4, - Math.PI / 4, false);
                    if (this.IsPressed())
                        oGraphicsPDF.SetStrokeStyle(0, 0, 0);
                    else
                        oGraphicsPDF.SetStrokeStyle(128, 128, 128);
                    oGraphicsPDF.Stroke();

                    // right semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, - Math.PI / 4, 3 * Math.PI / 4, false);
                    if (this.IsPressed())
                        oGraphicsPDF.SetStrokeStyle(255, 255, 255);
                    else
                        oGraphicsPDF.SetStrokeStyle(191, 191, 191);
                    oGraphicsPDF.Stroke();

                    break;
            }

            return;
        }
        else {
            // отрисовка
            switch (nBorderStyle) {
                case BORDER_TYPES.solid:
                    if (color == null)
                        break;
                    
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                    oGraphicsPDF.Stroke();

                    break;
                case BORDER_TYPES.beveled:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                        oGraphicsPDF.Stroke();
                    }
                    
                    // left part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);

                    if (this.GetType() == AscPDF.FIELD_TYPES.button && this.IsPressed() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
                        oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                    }
                    else {
                        if ((this.GetType() == AscPDF.FIELD_TYPES.radiobutton || this.GetType() == AscPDF.FIELD_TYPES.checkbox) && this.IsPressed())
                            oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                        else
                            oGraphicsPDF.SetFillStyle(255, 255, 255);
                    }

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // top part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // bottom part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);

                    if (this.GetType() == AscPDF.FIELD_TYPES.button && this.IsPressed() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
                        oGraphicsPDF.SetFillStyle(255, 255, 255);
                    }
                    else {
                        if ((this.GetType() == AscPDF.FIELD_TYPES.radiobutton || this.GetType() == AscPDF.FIELD_TYPES.checkbox) && this.IsPressed())
                            oGraphicsPDF.SetFillStyle(255, 255, 255);
                        else
                            oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                    }

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // right part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    break;
                case BORDER_TYPES.dashed:
                    if (color == null)
                        break;

                    oGraphicsPDF.SetLineDash([3]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.inset:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                        oGraphicsPDF.Stroke();
                    }

                    // left part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);

                    if (this.GetType() == AscPDF.FIELD_TYPES.button && this.IsPressed() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
                        oGraphicsPDF.SetFillStyle(0, 0, 0);
                    }
                    else {
                        if ((this.GetType() == AscPDF.FIELD_TYPES.radiobutton || this.GetType() == AscPDF.FIELD_TYPES.checkbox) && this.IsPressed())
                            oGraphicsPDF.SetFillStyle(0, 0, 0);
                        else
                            oGraphicsPDF.SetFillStyle(128, 128, 128);
                    }

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // top part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // bottom part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);

                    if (this.GetType() == AscPDF.FIELD_TYPES.button && this.IsPressed() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
                        oGraphicsPDF.SetFillStyle(255, 255, 255);
                    }
                    else {
                        if ((this.GetType() == AscPDF.FIELD_TYPES.radiobutton || this.GetType() == AscPDF.FIELD_TYPES.checkbox) && this.IsPressed())
                            oGraphicsPDF.SetFillStyle(255, 255, 255);
                        else
                            oGraphicsPDF.SetFillStyle(191, 191, 191);
                    }
                    
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // right part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);

                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    break;
                case BORDER_TYPES.underline:
                    if (color == null)
                        break;
                    
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X - nLineWidth / 2, Y + nHeight);
                    oGraphicsPDF.LineTo(X + nWidth + nLineWidth / 2, Y + nHeight);
                    oGraphicsPDF.Stroke();
                    break;
            }
        }        

        // pressed border
        if (this.GetType() == AscPDF.FIELD_TYPES.button && this.IsPressed() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push && this._imgData.mouseDown == undefined) {
            switch (nBorderStyle) {
                case BORDER_TYPES.solid:
                case BORDER_TYPES.dashed:
                case BORDER_TYPES.underline: {
                    
                        // left part
                        oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);

                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                        oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.ClosePath();
                        oGraphicsPDF.Fill();

                        // top part
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                        oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                        oGraphicsPDF.ClosePath();
                        oGraphicsPDF.Fill();
                    }
                    break;
                }
        }

        // draw comb cells
        if ((this.GetType() == AscPDF.FIELD_TYPES.text && this.IsComb() == true) && this._borderColor != null && (nBorderStyle == BORDER_TYPES.solid || nBorderStyle == BORDER_TYPES.dashed)) {
            let nCombWidth = (nWidth / this._charLimit);
            let nIndentX = nCombWidth;
            
            for (let i = 0; i < this._charLimit - 1; i++) {
                oGraphicsPDF.MoveTo(X + nIndentX, Y);
                oGraphicsPDF.LineTo(X + nIndentX, Y + nHeight);
                oGraphicsPDF.Stroke();
                nIndentX += nCombWidth;
            }
        }
    };
    /**
	 * Gets rgb color object from internal color array.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @returns {object}
	 */
    CBaseField.prototype.GetRGBColor = function(aInternalColor) {
        let oColor = {};

        if (aInternalColor.length == 1) {
            oColor = {
                r: Math.round(aInternalColor[0] * 255),
                g: Math.round(aInternalColor[0] * 255),
                b: Math.round(aInternalColor[0] * 255)
            }
        }
        else if (aInternalColor.length == 3) {
            oColor = {
                r: Math.round(aInternalColor[0] * 255),
                g: Math.round(aInternalColor[1] * 255),
                b: Math.round(aInternalColor[2] * 255)
            }
        }
        else if (aInternalColor.length == 4) {
            function cmykToRgb(c, m, y, k) {
                return {
                    r: Math.round(255 * (1 - c) * (1 - k)),
                    g: Math.round(255 * (1 - m) * (1 - k)),
                    b: Math.round(255 * (1 - y) * (1 - k))
                }
            }

            oColor = cmykToRgb(aInternalColor[0], aInternalColor[1], aInternalColor[2], aInternalColor[3]);
        }

        return oColor;
    };
    
    CBaseField.prototype.DrawSelected = function() {
        return;
    };
    CBaseField.prototype.SetParentPage = function(oParent) {
        this.parentPage = oParent;
    };
    CBaseField.prototype.GetParentPage = function() {
        return this.parentPage;
    };
    CBaseField.prototype.Get_Id = function() {
        return this._id;
    };
    CBaseField.prototype.GetId = function() {
        return this._id;
    };
    CBaseField.prototype.SetNeedRecalc = function(bRecalc, bSkipAddToRedraw) {
        if (bRecalc == false) {
            this._needRecalc = false;
        }
        else {
            if ([AscPDF.FIELD_TYPES.text, AscPDF.FIELD_TYPES.combobox].includes(this.GetType())) {
                this.GetDocument().SetNeedUpdateTarget(true);
            }
            this._needRecalc = true;
            if (bSkipAddToRedraw != true)
                this.AddToRedraw();
        }
    };
    CBaseField.prototype.IsNeedRecalc = function() {
        return this._needRecalc;
    };
    CBaseField.prototype.Refresh_RecalcData = function(){};
    CBaseField.prototype.SetWasChanged = function(isChanged) {
        let oViewer = Asc.editor.getDocumentRenderer();
        let oDoc = Asc.editor.getPDFDoc();
        let canChange = !oViewer.IsOpenFormsInProgress && !oDoc.History.UndoRedoInProgress;
        if (this._wasChanged == isChanged || !canChange) {
            return;
        }
        
        oDoc.History.Add(new CChangesPDFFormChanged(this, this._wasChanged, isChanged));

        this._wasChanged = isChanged;
        this.IsWidget() && this.SetDrawFromStream(!isChanged);
    };

    CBaseField.prototype.UndoNotAppliedChanges = function() {
        let isChanged = this.IsChanged();
        this.SetValue(this.GetParentValue());
        this.SetNeedRecalc(true);
        this.SetNeedCommit(false);

        if (!isChanged)
            this.SetWasChanged(false);
    };

    CBaseField.prototype.ClearCache = function() {
        this._originView.normal     = null;
        this._originView.mouseDown  = null;
        this._originView.rollover   = null;
    };
    CBaseField.prototype.IsChanged = function() {
        return this._wasChanged;  
    };
    CBaseField.prototype.SetHasOriginView = function(bHas) {
        this._hasOriginView = bHas;
        this.SetDrawFromStream(bHas);
    };
    CBaseField.prototype.HasOriginView = function() {
        return this._hasOriginView;
    };
    CBaseField.prototype.IsNeedDrawFromStream = function() {
        return this._bDrawFromStream;
    };
    CBaseField.prototype.SetDrawFromStream = function(bFromStream) {
        if (bFromStream && this.HasOriginView())
            this._bDrawFromStream = true;
        else
            this._bDrawFromStream = false;
    };
    CBaseField.prototype.SetDrawHighlight = function(bDraw) {
        this._needDrawHighlight = bDraw;
    };
    CBaseField.prototype.IsNeedDrawHighlight = function() {
        return this._needDrawHighlight;
    };

    CBaseField.prototype.AddToRedraw = function() {
        let oViewer = editor.getDocumentRenderer();
        let nPage   = this.GetPage();
        
        if (false == this.IsUseInDocument()) {
            return;
        }
        
        function setRedrawPageOnRepaint() {
            if (oViewer.pagesInfo.pages[nPage]) {
                oViewer.pagesInfo.pages[nPage].needRedrawForms = true;
                // oViewer.thumbnails && oViewer.thumbnails._repaintPage(nPage);
            }
        }

        oViewer.paint(setRedrawPageOnRepaint);
    };

    CBaseField.prototype.GetType = function() {
        return this.type;
    };
    CBaseField.prototype.GetStrType = function() {
        switch (this.GetType()) {
            case AscPDF.FIELD_TYPES.button:
                return "button";
            case AscPDF.FIELD_TYPES.checkbox:
                return "checkbox";
            case AscPDF.FIELD_TYPES.combobox:
                return "combobox";
            case AscPDF.FIELD_TYPES.listbox:
                return "listbox";
            case AscPDF.FIELD_TYPES.radiobutton:
                return "radiobutton";
            case AscPDF.FIELD_TYPES.signature:
                return "signature";
            case AscPDF.FIELD_TYPES.text:
                return "text";
            case AscPDF.FIELD_TYPES.unknown: 
                return "unknown";
        }
    };

    CBaseField.prototype.SetReadOnly = function(bReadOnly) {
        this._readonly = bReadOnly;
    };
    CBaseField.prototype.IsReadOnly = function() {
        return this._readonly;
    };

    CBaseField.prototype.SetNoExport = function(bNoExport) {
        this._noExport = bNoExport;
    };
    CBaseField.prototype.IsNoExport = function() {
        return this._noExport;
    };
    
    CBaseField.prototype.SetRequired = function(bRequired) {
        if (this.GetType() != AscPDF.FIELD_TYPES.button && this.IsRequired() != bRequired) {
            this._required = bRequired;
            this.SetWasChanged(true);
            this.AddToRedraw();
        }
    };
    CBaseField.prototype.IsRequired = function() {
        return this._required;
    };
    CBaseField.prototype.SetBorderColor = function(aColor) {
        this._strokeColor = this._borderColor = aColor;
        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CBaseField.prototype.GetBorderColor = function() {
        return this._strokeColor;
    };
    CBaseField.prototype.SetBackgroundColor = function(aColor) {
        this._fillColor = this._bgColor = aColor;
        this.SetWasChanged(true);
        this.AddToRedraw();
    };
    CBaseField.prototype.GetBackgroundColor = function() {
        return this._fillColor;
    };
    CBaseField.prototype.SetHighlight = function(nType) {
        this._highlight = nType;
    };
    CBaseField.prototype.GetHighlight = function() {
        return this._highlight;
    };
    CBaseField.prototype.IsHidden = function() {
        let nType = this.GetDisplay();
        if (nType == window["AscPDF"].Api.Objects.display["hidden"] || nType == window["AscPDF"].Api.Objects.display["noView"])
            return true;

        return false;
    };
    CBaseField.prototype.SetDisplay = function(nType) {
        AscCommon.History.Add(new CChangesPDFFormDisplay(this, this._display, nType));

        this._display = nType;

        this.SetWasChanged(true);
        this.AddToRedraw();
    };
    CBaseField.prototype.GetDisplay = function() {
        return this._display;
    };
    CBaseField.prototype.GetDefaultValue = function() {
        if (this._defaultValue == null && this.GetParent())
            return this.GetParent().GetDefaultValue();
        
        return this._defaultValue;
    };
    CBaseField.prototype.SetDefaultValue = function(value) {
        this._defaultValue = value;
        this.SetWasChanged(true);
    };
	
	CBaseField.prototype.canBeginCompositeInput = function() {
		return false;
	};
	CBaseField.prototype.beforeCompositeInput = function() {
	};
	CBaseField.prototype.EnterText = function(codePoints) {
	};
    /**
	 * Sets default value for form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.Reset = function() {
        let defValue = this.GetDefaultValue() || "";
        if (this.GetValue() != defValue) {
            this.SetValue(defValue);
            this.SetWasChanged(true);
            this.SetNeedRecalc(true);
        }
    };

    CBaseField.prototype.DrawBackground = function(oGraphicsPDF) {
        let aOrigRect       = this.GetOrigRect();
        let aBgColor        = this.GetBackgroundColor();
        let oBgRGBColor;

        if (null == aBgColor && this.IsPressed && this.IsPressed())
            aBgColor = [1];
        
        if (aBgColor && aBgColor.length != 0)
            oBgRGBColor = this.GetRGBColor(aBgColor);

        if (!oBgRGBColor || this.IsNeedDrawHighlight())
            return;

        let X       = aOrigRect[0];
        let Y       = aOrigRect[1];
        let nWidth  = aOrigRect[2] - aOrigRect[0];
        let nHeight = aOrigRect[3] - aOrigRect[1];
        
        oGraphicsPDF.SetGlobalAlpha(1);

        if (this.GetType() == AscPDF.FIELD_TYPES.radiobutton && this._chStyle == AscPDF.CHECKBOX_STYLES.circle) {
            if (this.IsHovered() && this.IsPressed()) {
                if (aBgColor.length == 1 && aBgColor[0] == 1) {
                    oBgRGBColor = {r: 191, g: 0, b: 0};
                }
                else {
                    if (this.GetBorderStyle() !== BORDER_TYPES.beveled)
                        oBgRGBColor = AscPDF.MakeColorMoreGray(oBgRGBColor, 50);
                }
            }

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
            // выставляем в центр круга
            let centerX = X + nWidth / 2;
            let centerY = Y + nHeight / 2;
            let nRadius = Math.min(nWidth / 2, nHeight / 2);
            oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
            oGraphicsPDF.Fill();
            oGraphicsPDF.ClosePath();
        }
        else {
            if ((this.GetType() == AscPDF.FIELD_TYPES.radiobutton || this.GetType() == AscPDF.FIELD_TYPES.checkbox) && this.IsPressed() && this.GetBorderStyle() !== BORDER_TYPES.beveled) {
                oBgRGBColor = AscPDF.MakeColorMoreGray(this.GetRGBColor(aBgColor), 50);
            }
            
            oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
            oGraphicsPDF.FillRect(X, Y, nWidth, nHeight);
        }
    };

    /**
	 * Gets Api class for this form.
	 * @memberof CBaseField
     * @param {number} nIdx - The 0-based index of the item in the list or -1 for the last item in the list.
     * @param {boolean} [bExportValue=true] - Specifies whether to return an export value.
	 * @typeofeditors ["PDF"]
     * @returns {ApiBaseField}
	 */
    CBaseField.prototype.GetFormApi = function() {
        if (this.api)
            return this.api;

        switch (this.GetType()) {
            case AscPDF.FIELD_TYPES.text:
                return new AscPDF.ApiTextField(this);
            case AscPDF.FIELD_TYPES.combobox:
                return new AscPDF.ApiComboBoxField(this);
            case AscPDF.FIELD_TYPES.listbox:
                return new AscPDF.ApiListBoxField(this);
            case AscPDF.FIELD_TYPES.checkbox:
                return new AscPDF.ApiCheckBoxField(this);
            case AscPDF.FIELD_TYPES.radiobutton:
                return new AscPDF.ApiRadioButtonField(this);
            case AscPDF.FIELD_TYPES.button:
                return new AscPDF.ApiPushButtonField(this);
        }

        return null;
    };

    // pdf api methods

    /**
	 * A string that sets the trigger for the action. Values are:
	 * @typedef {"MouseUp" | "MouseDown" | "MouseEnter" | "MouseExit" | "OnFocus" | "OnBlur" | "Keystroke" | "Validate" | "Calculate" | "Format"} cTrigger
	 * For a list box, use the Keystroke trigger for the Selection Change event.
     */
    CBaseField.prototype.RevertContentView = function() {
        this.content.ResetShiftView();
        this._curShiftView.x = this._oldShiftView.x;
        this._curShiftView.y = this._oldShiftView.y;

        this._bAutoShiftContentView = false;
        this.content.ShiftView(this._oldShiftView.x, this._oldShiftView.y);

        if (this._scrollInfo) {
            let nMaxShiftY                  = this._scrollInfo.scroll.maxScrollY;
            this._scrollInfo.scrollCoeff    = Math.abs(this._curShiftView.y / nMaxShiftY);
        }

        this.AddToRedraw();
    };
    CBaseField.prototype.IsWidget = function() {
        return this._isWidget;
    };
    CBaseField.prototype.IsNeedRevertShiftView = function() {
        if (this._curShiftView.y != this._oldShiftView.y ||
            this._curShiftView.x != this._oldShiftView.x)
            return true;
    };
    CBaseField.prototype.GetBordersWidth = function() {
        let nLineWidth = this._lineWidth != undefined ? this._lineWidth : 1;

        if (nLineWidth == 0 || this._borderStyle == undefined) {
            return {
                left:     nLineWidth,
                top:      nLineWidth,
                right:    nLineWidth,
                bottom:   nLineWidth
            }
        }

        switch (this._borderStyle) {
            case BORDER_TYPES.solid:
            case BORDER_TYPES.dashed:
                return {
                    left:     nLineWidth,
                    top:      nLineWidth,
                    right:    nLineWidth,
                    bottom:   nLineWidth
                }
            case BORDER_TYPES.beveled:
            case BORDER_TYPES.inset:
                return {
                    left:     2 * nLineWidth,
                    top:      2 * nLineWidth,
                    right:    2 * nLineWidth,
                    bottom:   2 * nLineWidth
                }
            case BORDER_TYPES.underline:
                return {
                    left:     0,
                    top:      0,
                    right:    0,
                    bottom:   nLineWidth
                }
        }
    };
    CBaseField.prototype.GetMarginsFromBorders = function() {
        let oBorders = this.GetBordersWidth();

        switch (this._borderStyle) {
            case BORDER_TYPES.solid:
            case BORDER_TYPES.dashed:
            case BORDER_TYPES.underline:
                return {
                    left:     oBorders.bottom,
                    top:      oBorders.bottom,
                    right:    oBorders.bottom,
                    bottom:   oBorders.bottom
                }
            case BORDER_TYPES.inset:
            case BORDER_TYPES.beveled:
                return {
                    left:     oBorders.bottom,
                    top:      oBorders.bottom,
                    right:    oBorders.bottom,
                    bottom:   oBorders.bottom
                }
            default:
                return {
                    left:     oBorders.bottom,
                    top:      oBorders.bottom,
                    right:    oBorders.bottom,
                    bottom:   oBorders.bottom
                }
        };
    };
    CBaseField.prototype.HasShiftView = function() {
        if (this.content.ShiftViewX != 0 || this.content.ShiftViewY != 0)
            return true;

        return false;
    };
    CBaseField.prototype.MoveCursorToStartPos = function() {
        this.content.MoveCursorToStartPos();
    };
    
    CBaseField.prototype.SetBorderStyle = function(nStyle) {
        if (this._borderStyle != nStyle) {
            this._borderStyle = nStyle;
            this.SetWasChanged(true);
            this.SetNeedRecalc(true);
            if (this.IsComb && this.IsComb() == true) {
                this.content.GetElement(0).Content.forEach(function(run) {
                    run.RecalcInfo.Measure = true;
                });
            }
        }
    };
    CBaseField.prototype.GetBorderStyle = function() {
        return this._borderStyle;
    };
    CBaseField.prototype.SetBorderWidth = function(nWidth) {
        if (this._borderWidth != nWidth) {
            this._borderWidth = nWidth;
            this._lineWidth = nWidth;

            this.SetWasChanged(true);
            this.SetNeedRecalc(true);
        }
    };
    CBaseField.prototype.GetBorderWidth = function() {
        return this._borderWidth || this._lineWidth;
    };
    /**
     * Returns a canvas with origin view (from appearance stream) of current form.
	 * @memberof CBaseField
     * @param {number} nAPType - APPEARANCE_TYPE (type of AP)
	 * @typeofeditors ["PDF"]
     * @returns {canvas}
	 */
    CBaseField.prototype.GetOriginView = function(nAPType, nPageW, nPageH) {
        if (this._apIdx == -1)
            return null;

        let oViewer = editor.getDocumentRenderer();
        let oFile   = oViewer.file;
        
        let oApearanceInfo  = this.GetOriginViewInfo(nPageW, nPageH);
        let oSavedView, oApInfoTmp;
        if (!oApearanceInfo)
            return null;
            
        switch (nAPType) {
            case APPEARANCE_TYPE.normal:
                oApInfoTmp = oApearanceInfo["N"];
                oSavedView = this._originView.normal;
                break;
            case APPEARANCE_TYPE.rollover:
                if (oApearanceInfo["R"]) {
                    oApInfoTmp = oApearanceInfo["R"]
                    oSavedView = this._originView.rollover;
                }
                else {
                    oApInfoTmp = oApearanceInfo["N"]
                    oSavedView = this._originView.normal;
                }
                break;
            case APPEARANCE_TYPE.mouseDown:
                if (oApearanceInfo["D"]) {
                    oApInfoTmp = oApearanceInfo["D"]
                    oSavedView = this._originView.mouseDown;
                }
                else {
                    oApInfoTmp = oApearanceInfo["N"]
                    oSavedView = this._originView.normal;
                }
                break;
            default:
                oApInfoTmp = oApearanceInfo["N"];
                oSavedView = this._originView.normal;
                break;
        }

        if (oSavedView && oSavedView.width == oApearanceInfo["w"] && oSavedView.height == oApearanceInfo["h"])
            return oSavedView;
        
        let canvas  = document.createElement("canvas");
        let nWidth  = oApearanceInfo["w"];
        let nHeight = oApearanceInfo["h"];

        canvas.width    = nWidth;
        canvas.height   = nHeight;

        canvas.x    = oApearanceInfo["x"];
        canvas.y    = oApearanceInfo["y"];
        
        if (!oApInfoTmp)
            return null;

        let supportImageDataConstructor = (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isIeEdge) ? false : true;

        let ctx             = canvas.getContext("2d");
        let mappedBuffer    = oFile.getUint8ClampedArray(oApInfoTmp["retValue"], 4 * nWidth * nHeight);
        let imageData       = null;

        if (supportImageDataConstructor)
        {
            imageData = new ImageData(mappedBuffer, nWidth, nHeight);
        }
        else
        {
            imageData = ctx.createImageData(nWidth, nHeight);
            imageData.data.set(mappedBuffer, 0);                    
        }
        if (ctx)
            ctx.putImageData(imageData, 0, 0);
        
        oViewer.file.free(oApInfoTmp["retValue"]);

        switch (nAPType) {
            case APPEARANCE_TYPE.normal:
                this._originView.normal = canvas;
                break;
            case APPEARANCE_TYPE.rollover:
                if (oApearanceInfo["R"]) {
                    this._originView.rollover = canvas;
                }
                else {
                    this._originView.normal = canvas;
                }
                break;
            case APPEARANCE_TYPE.mouseDown:
                if (oApearanceInfo["D"]) {
                    this._originView.mouseDown = canvas;
                }
                else {
                    this._originView.normal = canvas;
                }
                break;
            default:
                this._originView.normal = canvas;
                break;
        }

        return canvas;
    };
    /**
     * Returns AP info of this field.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @returns {Object}
	 */
    CBaseField.prototype.GetOriginViewInfo = function(nPageW, nPageH) {
        let oViewer     = editor.getDocumentRenderer();
        let oFile       = oViewer.file;
        let nPage       = this.GetOriginPage();
        let oOriginPage = oFile.pages.find(function(page) {
            return page.originIndex == nPage;
        });

        if (oOriginPage.fieldsAPInfo == null || oOriginPage.fieldsAPInfo.size.w != nPageW || oOriginPage.fieldsAPInfo.size.h != nPageH) {
            oOriginPage.fieldsAPInfo = {
                info: oFile.nativeFile["getInteractiveFormsAP"](nPage, nPageW, nPageH),
                size: {
                    w: nPageW,
                    h: nPageH
                }
            }
        }
        
        for (let i = 0; i < oOriginPage.fieldsAPInfo.info.length; i++) {
            if (oOriginPage.fieldsAPInfo.info[i]["i"] == this._apIdx)
                return oOriginPage.fieldsAPInfo.info[i];
        }

        return null;
    };
	
	CBaseField.prototype.DrawOnPage = function(pdfGraphics, textBoxGraphics, pageIndex) {
		if (this.IsHidden())
			return;
		
        if (pdfGraphics.isThumbnails) {
            this.DrawBorders(pdfGraphics);
        }
        else {
            if (this.IsNeedDrawFromStream())
                this.DrawFromStream(pdfGraphics);
            else
                this.DrawFromTextBox(pdfGraphics, textBoxGraphics, pageIndex);
        }
	};

    CBaseField.prototype.DrawFromStream = function(oGraphicsPDF) {
        let nAPType = this.IsHovered && this.IsHovered() ? AscPDF.APPEARANCE_TYPE.rollover : undefined;

        let originView = this.GetOriginView(nAPType, oGraphicsPDF.GetDrawingPageW(), oGraphicsPDF.GetDrawingPageH());

        let aOringRect = this.GetOrigRect();

        let X = aOringRect[0];
        let Y = aOringRect[1];

        if (originView) {
            oGraphicsPDF.SetGlobalAlpha(1);
            oGraphicsPDF.DrawImageXY(originView, X, Y, undefined, true);
        }

        // oGraphicsPDF.SetLineWidth(1);
        // let nWidth  = aOringRect[2] - aOringRect[0];
        // let nHeight = aOringRect[3] - aOringRect[1];

        // Y += 1 / 2;
        // X += 1 / 2;
        // nWidth  -= 1;
        // nHeight -= 1;

        // oGraphicsPDF.SetStrokeStyle(0, 255, 255);
        // oGraphicsPDF.SetLineDash([]);
        // oGraphicsPDF.BeginPath();
        // oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
        // oGraphicsPDF.Stroke();

        this.DrawLocks(oGraphicsPDF);
    };
    CBaseField.prototype.DrawLocks = function(oGraphicsPDF) {
        let aOrigRect   = this.GetRect();
        let nX          = aOrigRect[0];
        let nY          = aOrigRect[1];
        let nWidth      = (aOrigRect[2] - aOrigRect[0]);
        let nHeight     = (aOrigRect[3] - aOrigRect[1]);

        let aRegions = [[
            [nX, nY],
            [nX + nWidth, nY],
            [nX + nWidth, nY + nHeight],
            [nX, nY + nHeight]
        ]];

        oGraphicsPDF.DrawLockObjectRect(this.Lock.Get_Type(), aRegions);
    };
	CBaseField.prototype.DrawFromTextBox = function(pdfGraphics, textBoxGraphics, pageIndex) {
		this.Draw(pdfGraphics, textBoxGraphics);
	};
    CBaseField.prototype.GetParent = function() {
        return this._parent;
    };
    CBaseField.prototype.GetTopParent = function() {
        if (this._parent) 
        {
            if (this._parent._parent)
                return this._parent.GetTopParent();
            else
                return this._parent;
        }

        return null;
    };

    CBaseField.prototype.SetApiTextColor = function(aApiColor) {
        if ([AscPDF.FIELD_TYPES.radiobutton, AscPDF.FIELD_TYPES.checkbox].includes(this.GetType()))
            return;

        let color = AscPDF.Api.Objects.color;

        let oRGB = color.convert(aApiColor, "RGB");
        if (this.content) {
            let oPara       = this.content.GetElement(0);
            let oApiPara    = editor.private_CreateApiParagraph(oPara);

            oApiPara.SetColor(Math.round(oRGB[1] * 255), Math.round(oRGB[2] * 255), Math.round(oRGB[3] * 255), false);
            oPara.RecalcCompiledPr(true);
        }
        if (this.contentFormat) {
            let oPara       = this.contentFormat.GetElement(0);
            let oApiPara    = editor.private_CreateApiParagraph(oPara);

            oApiPara.SetColor(Math.round(oRGB[1] * 255), Math.round(oRGB[2] * 255), Math.round(oRGB[3] * 255), false);
            oPara.RecalcCompiledPr(true);
        }

        let oApiColor   = color.convert(oRGB, aApiColor[0]);
        this._textColor = oApiColor.slice(1);

        this.SetWasChanged(true);
        this.AddToRedraw();
    };
    
    CBaseField.prototype.SetTextColor = function(aColor) {
        this._textColor = aColor;
        
        let oRGB = this.GetRGBColor(aColor);
        if (this.content) {
            let oPara       = this.content.GetElement(0);
            let oApiPara    = editor.private_CreateApiParagraph(oPara);

            oApiPara.SetColor(oRGB.r, oRGB.g, oRGB.b, false);
            oPara.RecalcCompiledPr(true);
        }
        if (this.contentFormat) {
            let oPara       = this.contentFormat.GetElement(0);
            let oApiPara    = editor.private_CreateApiParagraph(oPara);

            oApiPara.SetColor(oRGB.r, oRGB.g, oRGB.b, false);
            oPara.RecalcCompiledPr(true);
        }
        
        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CBaseField.prototype.GetTextColor = function() {
        return this._textColor;
    };
    CBaseField.prototype.SetTextFont = function(sFontName) {
        if (typeof(sFontName) !== "string" && sFontName == "")
            return;

        this._textFont = sFontName;
        this.SetWasChanged(true);
        this.AddToRedraw();
    };
    CBaseField.prototype.SetFontKey = function(sKey) {
        this._fontKey = sKey;
    };
    CBaseField.prototype.GetFontKey = function() {
        return this._fontKey;
    };
    CBaseField.prototype.SetTextFontActual = function(sFontName) {
        if (typeof(sFontName) !== "string" && sFontName == "")
            return;
        
        this._textFontActual = sFontName;

        if (this.content)
			this.content.SetFont(sFontName);
		
		if (this.contentFormat)
			this.contentFormat.SetFont(sFontName);
        
        this.SetWasChanged(true);
        this.AddToRedraw();
    };
    CBaseField.prototype.GetTextFontActual = function() {
        return this._textFontActual;
    };
    CBaseField.prototype.GetTextFont = function() {
        return this._textFont;
    };
    CBaseField.prototype.SetFontStyle = function(oStyle) {
        this._fontStyle = oStyle;

        if (this.content) {
            this.content.SetBold(oStyle.bold);
        }
        if (this.contentFormat) {
            this.contentFormat.SetBold(oStyle.bold);
        }
        if (this.content) {
            this.content.SetItalic(oStyle.italic);
        }
        if (this.contentFormat) {
            this.contentFormat.SetItalic(oStyle.italic);
        }
    };
    CBaseField.prototype.GetFontStyle = function() {
        return this._fontStyle;
    };
    CBaseField.prototype.SetTextSize = function(nSize) {
        this._textSize = nSize;
        
        if (nSize != 0) {
            if (this.content) {
                this.content.SetFontSize(nSize);
            }
            if (this.contentFormat) {
                this.contentFormat.SetFontSize(nSize);
            }
        }
        
        this.SetWasChanged(true);
        this.SetNeedRecalc();
    };
    CBaseField.prototype.GetTextSize = function() {
        return this._textSize;
    };
    CBaseField.prototype.SetRect = function(aOrigRect) {
        this._origRect = aOrigRect;
        this.SetWasChanged(true);
    };
    CBaseField.prototype.GetOrigRect = function() {
        return this._origRect;
    };
    CBaseField.prototype.GetRect = function() {
        return this.GetOrigRect();
    };

    // common triggers
    CBaseField.prototype.onMouseEnter = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter);
    };
    CBaseField.prototype.onMouseExit = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseExit);
    };
    CBaseField.prototype.onFocus = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.OnFocus);
    };
    CBaseField.prototype.onBlur = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.OnBlur);
    };
    CBaseField.prototype.onMouseUp = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseUp);
    };
    /**
	 * Escape from form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.Blur = function() {
        let oDoc = this.GetDocument();
        oDoc.SetGlobalHistory();

        this.SetInForm(false);

        if (this.content && this.content.IsSelectionUse()) {
            this.content.RemoveSelection();
        }
        
        if (oDoc.activeForm == this) {
            oDoc.activeForm = null;
            this.onBlur();
        }
    };
    // export
    CBaseField.prototype["getType"] = function() {
        return this.type;
    };
    CBaseField.prototype["getPage"] = function() {
        return this.GetPage();
    };
    CBaseField.prototype["getPagePos"] = function() {
        let aOrigRect = this.GetOrigRect();
        return {
            "x" : aOrigRect[0],
            "y" : aOrigRect[1],
            "w" : (aOrigRect[2] - aOrigRect[0]),
            "h" : (aOrigRect[3] - aOrigRect[1])
        };
    };
    CBaseField.prototype.WriteToBinaryBase = function(memory) {
        // type
        memory.WriteByte(this.GetType());

        // apidx
        memory.WriteLong(this.GetApIdx());

        // annont flags
        let bHidden      = false;
        let bPrint       = false;
        let bNoView      = false;
        let ToggleNoView = false;
        let locked       = false;
        let lockedC      = false;
        let noZoom       = false;
        let noRotate     = false;

        let nDisplayType = this.GetDisplay();
        if (nDisplayType == 1) {
            bHidden = true;
        }
        else if (nDisplayType == 0 || nDisplayType == 3) {
            bPrint = true;
            if (nDisplayType == 3) {
                bNoView = true;
            }
        }
        let annotFlags = (bHidden << 1) |
        (bPrint << 2) |
        (noZoom << 3) |
        (noRotate << 4) |
        (bNoView << 5) |
        (locked << 7) |
        (ToggleNoView << 8) |
        (lockedC << 9);

        memory.WriteLong(annotFlags);

        // page
        memory.WriteLong(this.GetOriginPage());

        // rect
        let aOrigRect = this.GetOrigRect();
        memory.WriteDouble(aOrigRect[0]); // x1
        memory.WriteDouble(aOrigRect[1]); // y1
        memory.WriteDouble(aOrigRect[2]); // x2
        memory.WriteDouble(aOrigRect[3]); // y2

        // pos for flags
        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);
        
        annotFlags = 0;
        let nBorder = this.GetBorderStyle();
        let nBorderW = this.GetBorderWidth();
        if (nBorder != null || nBorderW != null) {
            annotFlags |= (1 << 4);
            memory.WriteByte(nBorder);
            memory.WriteDouble(nBorderW);
            if (nBorder == 2) {
                memory.WriteLong(1); memory.WriteDouble(3);
            }
        }
        
        // write flags
        let nEndPos = memory.GetCurPosition();
        memory.Seek(nStartPos);
        memory.WriteLong(annotFlags);
        memory.Seek(nEndPos);
    };
    CBaseField.prototype.GetFontSizeAP = function(oContent) {
        let oPara   = oContent.GetElement(0);
        let oRun    = oPara.GetElement(0);
        let oTextPr = oRun.Get_CompiledPr(true);

        return oTextPr.FontSize;
    };
    CBaseField.prototype.WriteToBinaryBase2 = function(memory) {
        // font name
        let sFontName = this.GetTextFont() || "";
        memory.WriteString(sFontName);

        // text size
        let nFontSize = this.GetTextSize() || 0;
        memory.WriteDouble(nFontSize);

        // форматируемое значение
        let oFormatTrigger      = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Format);
        let oActionRunScript    = oFormatTrigger ? oFormatTrigger.GetActions()[0] : null;
        let oContentToDraw      = oActionRunScript ? this.contentFormat : this.content;

        // text size for ap
        memory.WriteDouble(this.GetFontSizeAP(oContentToDraw));

        // font style
        let oStyle = this.GetFontStyle();
        let nStyle = 0;
        if (oStyle.bold) {
            nStyle |= (1 << 0);
        }
        if (oStyle.italic) {
            nStyle |= (1 << 1);
        }
        memory.WriteLong(nStyle);

        // text color
        let aTextColor = this.GetTextColor();
        if (aTextColor && aTextColor.length != 0) {
            memory.WriteLong(aTextColor.length);

            for (let i = 0; i < aTextColor.length; i++) {
                memory.WriteDouble(aTextColor[i]);
            }
        }

        // align 
        if ([AscPDF.FIELD_TYPES.text, AscPDF.FIELD_TYPES.combobox, AscPDF.FIELD_TYPES.listbox].includes(this.GetType())) {
            let nAlignType = this.GetAlign();
            memory.WriteByte(nAlignType);
        }

        // сюда пойдут 1ые флаги полей
        memory.widgetFlags   = 0;
        memory.posForWidgetFlags  = memory.GetCurPosition();
        memory.Skip(4);
        
        if (this.IsReadOnly()) {
            memory.widgetFlags |= (1 << 0);
        }

        if (this.IsRequired()) {
            memory.widgetFlags |= (1 << 1);
        }

        if (this.IsNoExport()) {
            memory.widgetFlags |= (1 << 2);
        }

        // сюда пойдут 2ые флаги полей
        memory.fieldDataFlags   = 0;
        memory.posForFieldDataFlags  = memory.GetCurPosition();
        memory.Skip(4);
        
        //
        // username
        //

        //
        // default style
        //

        let sFontKey = this.GetFontKey();
        if (sFontKey) {
            memory.fieldDataFlags |= (1 << 2);
            memory.WriteString(sFontKey);
        }

        // highlight
        let nHighlightType = this.GetHighlight();
        if (nHighlightType != null) {
            memory.fieldDataFlags |= (1 << 3);
            memory.WriteByte(nHighlightType);
        }

        let aBorderColor = this.GetBorderColor();
        if (aBorderColor && aBorderColor.length != 0) {
            memory.fieldDataFlags |= (1 << 5);
            memory.WriteLong(aBorderColor.length);
            for (let i = 0; i < aBorderColor.length; i++) {
                memory.WriteDouble(aBorderColor[i]);
            }
        }

        //
        // rotate
        //

        let aBgColor = this.GetBackgroundColor();
        if (aBgColor && aBgColor.length != 0) {
            memory.fieldDataFlags |= (1 << 7);
            memory.WriteLong(aBgColor.length);
            for (let i = 0; i < aBgColor.length; i++) {
                memory.WriteDouble(aBgColor[i]);;
            }
        }

        // default value
        let defValue = this.GetDefaultValue();
        if (defValue != null) {
            memory.fieldDataFlags |= (1 << 8);
            memory.WriteString(defValue);
        }

        // parent
        let oParent = this.GetParent();
        if (oParent != null) {
            memory.fieldDataFlags |= (1 << 17);
            memory.WriteLong(oParent.GetApIdx());
        }

        // partial name
        let sName = this.GetPartialName();
        if (sName != null) {
            memory.fieldDataFlags |= (1 << 18);
            memory.WriteString(sName);
        }

        // actions
        let aActions = this.GetListActions();
        memory.WriteLong(aActions.length);
        
        for (let i = 0; i < aActions.length; i++) {
            aActions[i].WriteToBinary(memory);
        }
    };
    CBaseField.prototype.WriteToBinaryAsParent = function(memory) {
        memory.WriteLong(this.GetApIdx());
        // pos for flags
        let nStartPos   = memory.GetCurPosition();
        let nFlags      = 0;
        memory.Skip(4);

        // partial name
        let sName = this.GetPartialName();
        if (sName != null) {
            nFlags |= (1 << 0);
            memory.WriteString(sName);
        }

        // value
        let value = this.GetParentValue();
        if (value != null && Array.isArray(value) == false) {
            nFlags |= (1 << 1);
            memory.WriteString(value);
        }

        // default value
        let defValue = this.GetDefaultValue();
        if (defValue != null) {
            nFlags |= (1 << 2);
            memory.WriteString(defValue);
        }

        // combobox/listbox
        let curIdxs = [];
        if ([AscPDF.FIELD_TYPES.combobox, AscPDF.FIELD_TYPES.listbox].includes(this.GetType())) {
            curIdxs = this.GetParentCurIdxs();
        }
        if (curIdxs.length > 0) {
            nFlags |= (1 << 3);
            memory.WriteLong(curIdxs.length);
            for (let i = 0; i < curIdxs.length; i++) {
                memory.WriteLong(curIdxs[i]);
            }
        }

        // parent
        let oParent = this.GetParent();
        if (oParent != null) {
            nFlags |= (1 << 4);
            memory.WriteLong(oParent.GetApIdx());
        }

        if (value != null && Array.isArray(value) == true) {
            // флаг что значение - это массив
            nFlags |= (1 << 5);
            memory.WriteLong(value.length);
            for (let i = 0; i < value.length; i++) {
                memory.WriteString(value[i]);
            }
        }

        // write flags
        let nEndPos = memory.GetCurPosition();
        memory.Seek(nStartPos);
        memory.WriteLong(nFlags);
        memory.Seek(nEndPos);
    };
    CBaseField.prototype.WriteRenderToBinary = function(memory) {
        // пока только для text, combobox
        if (false == [AscPDF.FIELD_TYPES.text, AscPDF.FIELD_TYPES.combobox, AscPDF.FIELD_TYPES.listbox].includes(this.GetType())) {
            return;
        }

        // тут будет длина комманд
        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);

        let oContentToDraw = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.Format) ? this.contentFormat : this.content;
        oContentToDraw.Draw(0, memory.docRenderer);

        // запись длины комманд
        let nEndPos = memory.GetCurPosition();
        memory.Seek(nStartPos);
        memory.WriteLong(nEndPos - nStartPos);
        memory.Seek(nEndPos);
    };

    // for format

    // private methods

    function private_GetFieldAlign(sJc)
	{
		if ("left" === sJc)
			return align_Left;
		else if ("right" === sJc)
			return align_Right;
		else if ("center" === sJc)
			return align_Center;

		return undefined;
	}

    if (!window["AscPDF"])
	    window["AscPDF"] = {};
    
	window["AscPDF"].ALIGN_TYPE         = ALIGN_TYPE;
	window["AscPDF"].BORDER_TYPES       = BORDER_TYPES;
    window["AscPDF"].APPEARANCE_TYPE    = APPEARANCE_TYPE;
    window["AscPDF"].VALID_ROTATIONS    = VALID_ROTATIONS;
    window["AscPDF"].MAX_TEXT_SIZE      = MAX_TEXT_SIZE;
    window["AscPDF"].FONT_STRETCH       = FONT_STRETCH;
    window["AscPDF"].FONT_STYLE         = FONT_STYLE;
    window["AscPDF"].FONT_WEIGHT        = FONT_WEIGHT;
	window["AscPDF"].DEFAULT_FIELD_FONT = DEFAULT_FIELD_FONT;

    window["AscPDF"].CBaseField = CBaseField;
    
})();

