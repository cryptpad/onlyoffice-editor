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
(function(window, undefined){

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function private_PtToMM(pt)
	{
		return 25.4 / 72.0 * pt;
	}
	function private_Twips2MM(twips)
	{
		return 25.4 / 72.0 / 20 * twips;
	}
	function private_GetDrawingDocument()
	{
		return editor.WordControl.m_oLogicDocument.DrawingDocument;
	}
	function private_EMU2MM(EMU)
	{
		return EMU / 36000.0;
	}
	function private_MM2EMU(MM)
	{
		return MM * 36000.0;
	}
	function private_GetLogicDocument()
	{
		return editor.WordControl.m_oLogicDocument;
	}
	function private_MM2Twips(mm)
	{
		return mm / (25.4 / 72.0 / 20);
	}
	/**
	 * Get the first Run in the array specified.
	 * @typeofeditors ["CDE"]
	 * @param {Array} firstPos - first doc pos of element
	 * @param {Array} secondPos - second doc pos of element
	 * @return {1 || 0 || - 1}
	 * If returns 1  -> first element placed before second
	 * If returns 0  -> first element placed like second
	 * If returns -1 -> first element placed after second
	 */
	function private_checkRelativePos(firstPos, secondPos)
	{
		for (var nPos = 0, nLen = Math.min(firstPos.length, secondPos.length); nPos < nLen; ++nPos)
		{
			if (!secondPos[nPos] || !firstPos[nPos] || firstPos[nPos].Class !== secondPos[nPos].Class)
				return 1;

			if (firstPos[nPos].Position < secondPos[nPos].Position)
				return 1;
			else if (firstPos[nPos].Position > secondPos[nPos].Position)
				return -1;
		}

		return 0;
	}
	function private_MM2Pt(mm)
	{
		return mm / (25.4 / 72.0);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// End of private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var WriterToJSON   = window['AscCommon'].WriterToJSON;
	var ReaderFromJSON = window['AscCommon'].ReaderFromJSON;
	
	WriterToJSON.prototype.SerWorksheet = function(oWorksheet)
	{
		var aCols = [];
		for (var nCol = 0; nCol < oWorksheet.aCols.length; nCol++)
			aCols.push(this.SerCol(oWorksheet.aCols[nCol]));

		var aDrawings = [];
		for (var nDrawing = 0; nDrawing < oWorksheet.Drawings.length; nDrawing++)
			aDrawings.push(this.SerDrawingExel(oWorksheet.Drawings[nDrawing]));

		var aHyperlinks = [];
		var aWorksheetLinks = oWorksheet.worksheet.hyperlinkManager.getAll();
		// for (var nHyperlink = 0; nHyperlink < aWorksheetLinks.length; nHyperlink++)
		// 	aHyperlinks.push(this.SerHyperlinkExel(aWorksheetLinks[nHyperlink]));

		return {
			autoFilter:            this.SerAutoFilter(oWorksheet.AutoFilter),
			cols:                  aCols,
			conditionalFormatting: this.SerCondFormatting(),
			dataValidations:       this.SerDataValidations(oWorksheet.dataValidations),
			drawings:              aDrawings,      
			headerFooter:          null, /// всегда лежит объект CHeaderFooterData
			hiperlinks:            aHyperlinks /// to do

		}
	};
	WriterToJSON.prototype.SerDrawingExel = function(oDrawingExel)
	{
		return {
			pos: {
				x: oDrawingExel.Pos.X,
				y: oDrawingExel.Pos.Y
			},

			ext:     oDrawingExel.ext,
			from:    this.SerCellObjectInfo(oDrawingExel.from),
			to:      this.SerCellObjectInfo(oDrawingExel.to),
			graphic: this.SerGraphicObject(oDrawingExel.graphicObject),
			editAs:  ToXML_ST_EditAs(oDrawingExel.editAs)
		}
	};
	WriterToJSON.prototype.SerCellObjectInfo = function(oCellObjectInfo)
	{
		return {
			col:    oCellObjectInfo.col,
			colOff: private_MM2EMU(oCellObjectInfo.colOff),
			row:    oCellObjectInfo.row,
			rowOff: private_MM2EMU(oCellObjectInfo.rowOff)
		}
	};
	WriterToJSON.prototype.Ser = function(o)
	{

	};
	WriterToJSON.prototype.Ser = function(o)
	{

	};
	WriterToJSON.prototype.SerDataValidations = function(oDataValidations)
	{
		var aElems = [];
		for (var nElem = 0; nElem < oDataValidations.elems.length; nElem++)
			aElems.push(this.SerDataValitation(oDataValidations.elems[nElem]));

		return {
			dataValidation: aElems,
			disablePrompts: oDataValidations.disablePrompts,
			xWindow:        oDataValidations.xWindow,
			yWindow:        oDataValidations.yWindow
		}
	};
	WriterToJSON.prototype.SerDataValitation = function(oDataValidation)
	{
		return {
			formula1: this.SerFormula(oDataValidation.formula1),
			formula2: this.SerFormula(oDataValidation.formula2),

			allowBlank:       oDataValidation.allowBlank,
			error:            oDataValidation.error,
			errorStyle:       ToXML_ST_DataValidationErrorStyle(oDataValidation.errorStyle),
			errorTitle:       oDataValidation.errorTitle,
			imeMode:          ToXML_ST_DataValidationImeMode(oDataValidation.imeMode),
			operator:         ToXML_ST_DataValidationOperator(oDataValidation.operator),
			prompt:           oDataValidation.prompt,
			promptTitle:      oDataValidation.promptTitle,
			showDropDown:     oDataValidation.showDropDown,
			showErrorMessage: oDataValidation.showErrorMessage,
			showInputMessage: oDataValidation.showInputMessage,
			sqref:            getSqRefString(oDataValidation.ranges),
			type:             ToXML_ST_DataValidationType(oDataValidation.type)
		}
	};
	WriterToJSON.prototype.SerFormula = function(oFormula)
	{
		return {
			formula: oFormula.text,
			type:    "formula"
		}
	};
	WriterToJSON.prototype.SerCondFormatting = function(oCondFormatting)
	{
		var aCondRules = [];
		for (var nRule = 0; nRule < oCondFormatting.aConditionalFormattingRules.length; nRule++)
			aCondRules.push(this.SerConditionalRule(oCondFormatting.aConditionalFormattingRules[nRule]));

		return {
			cfRule: aCondRules,
			pivot:  oCondFormatting.pivot,
			sqref:  getSqRefString(oCondFormatting.ranges)
		}
	};
	WriterToJSON.prototype.SerConditionalRule = function(oCondRule)
	{
		var aRules = [];
		for (var nRule = 0; nRule < oCondRule.aRuleElements.length; nRule++)
			aRules.push(this.SerRuleElement(oCondRule.aRuleElements[nRule]));

		return {
			rules:        aRules,
			aboveAverage: oCondRule.aboveAverage,
			bottom:       oCondRule.bottom,
			dxfId:        oCondRule.dxf,
			equalAverage: oCondRule.equalAverage,
			operator:     ToXML_CFOperatorType(oCondRule.operator),
			percent:      oCondRule.percent,
			priority:     oCondRule.priority,
			rank:         oCondRule.rank,
			stdDev:       oCondRule.stdDev,
			stopIfTrue:   oCondRule.stopIfTrue,
			text:         oCondRule.text,
			timePeriod:   ToXML_ST_TimePeriod(oCondRule.timePeriod),
			type:         ToXML_CfRuleType(oCondRule.type),
		}
	};
	WriterToJSON.prototype.SerRuleElement = function(oRule)
	{
		if (oRule instanceof AscCommonExcel.CColorScale)
			return this.SerColorScale(oRule);
		if (oRule instanceof AscCommonExcel.CDataBar)
			return this.SerDataBar(oRule);
		if (oRule instanceof AscCommonExcel.CIconSet)
			return this.SerIconSet(oRule);
		if (oRule instanceof AscCommonExcel.CFormulaCF)
			return this.SerFormulaCF(oRule);
	};
	WriterToJSON.prototype.SerFormulaCF = function(oFormulaCf)
	{
		return {
			formula: oFormulaCf.Text,
			type:    "formulaCf"
		}
	};
	WriterToJSON.prototype.SerIconSet = function(oIconSet)
	{
		var aCFVO = [];
		for (var nElem = 0; nElem < oIconSet.aCFVOs.length; nElem++)
			aCFVO.push(this.SerCondFmtValObj(oIconSet.aCFVOs[nElem]));

		var aCFIS = [];
		for (nElem = 0; nElem < oIconSet.aIconSets.length; nElem++)
			aCFIS.push(this.SerCondFmtIconSet(oIconSet.aIconSets[nElem]));

		return {
			cfvo:      aCFVO,
			cfIcon:    aCFIS,
			iconSet:   ToXML_IconSetType(oIconSet.IconSet),
			percent:   oIconSet.Percent,
			reverse:   oIconSet.Reverse,
			showValue: oIconSet.ShowValue,
			type:      "iconSet"
		}
	};
	WriterToJSON.prototype.SerCondFmtIconSet = function(oCFIS)
	{
		return {
			iconSet: ToXML_IconSetType(oCFIS.IconSet),
			iconId:  oCFIS.IconId
		}
	};
	WriterToJSON.prototype.SerDataBar = function(oDataBar)
	{
		var aCFVO = [];
		for (var nElem = 0; nElem < oDataBar.aCFVOs.length; nElem++)
			aCFVO.push(this.SerCondFmtValObj(oDataBar.aCFVOs[nElem]));

		var sAxisPos = undefined;
		switch (oDataBar.AxisPosition)
		{
			case AscCommonExcel.EDataBarAxisPosition.automatic:
				sAxisPos = "auto";
				break;
			case AscCommonExcel.EDataBarAxisPosition.middle:
				sAxisPos = "middle";
				break;
			case AscCommonExcel.EDataBarAxisPosition.none:
				sAxisPos = "none";
				break;
		}

		var sDir = undefined;
		switch (oDataBar.Direction)
		{
			case AscCommonExcel.EDataBarDirection.context:
				sDir = "context";
				break;
			case AscCommonExcel.EDataBarDirection.leftToRight:
				sDir = "leftToRight";
				break;
			case AscCommonExcel.EDataBarDirection.rightToLeft:
				sDir = "rightToLeft";
				break;
		}

		return {
			cfvo:                aCFVO,
			color:               this.SerColorExel(oDataBar.Color),
			negativeColor:       this.SerColorExel(oDataBar.NegativeColor),
			borderColor:         this.SerColorExel(oDataBar.BorderColor),
			axisColor:           this.SerColorExel(oDataBar.AxisColor),
			negativeBorderColor: this.SerColorExel(oDataBar.NegativeBorderColor),
			
			maxLength: oDataBar.MaxLength,
			minLength: oDataBar.MinLength,
			showValue: oDataBar.ShowValue,
			axPos:     sAxisPos,
			dir:       sDir,
			gradient:  oDataBar.Gradient,
			negBarClrSameAsPositive:    oDataBar.NegativeBarColorSameAsPositive,
			negBarBdrClrSameAsPositive: oDataBar.NegativeBarBorderColorSameAsPositive,
			type:                       "dataBar"
		}
	};
	WriterToJSON.prototype.SerColorScale = function(oColorScale)
	{
		var aCFVO = [];
		for (var nElem = 0; nElem < oColorScale.aCFVOs.length; nElem++)
			aCFVO.push(this.SerCondFmtValObj(oColorScale.aCFVOs[nElem]));

		var aColors = [];
		for (var nColor = 0; nColor < oColorScale.aColors.length; nColor++)
			aColors.push(this.SerColorExel(oColorScale.aColors[nColor]));

		return {
			cfvo:  aCFVO,
			color: aColors,
			type:  "clrScale"
		}
	};
	WriterToJSON.prototype.SerCondFmtValObj = function(oCondFmtValObj)
	{
		return {
			gte:  oCondFmtValObj.Gte,
			type: ToXML_ST_CfvoType(oCondFmtValObj.Type),
			val:  oCondFmtValObj.Val
		}
	};
	WriterToJSON.prototype.SerColorExel = function(oColor)
	{
		var res;
		if (oColor instanceof AscCommonExcel.ThemeColor)
			res = {
				rgb:   oColor.rgb,
				theme: oColor.theme,
				tint:  oColor.tint,
				type:  "themeClr"

			}
		else if (oColor instanceof AscCommonExcel.RgbColor)
			res = {
				rgb:   oColor.rgb,
				type:  "rgbClr"
			}

		return res;
	};
	WriterToJSON.prototype.SerCol = function(oCol)
	{
		return {
			bestFit:      oCol.BestFit,
			collapsed:    oCol.collapsed,
			customWidth:  oCol.CustomWidth,
			hidden:       oCol.hd,
			outlineLevel: oCol.outlineLevel,
			width:        oCol.width,
			xfs:          this.SerXFS(oCol.xfs)
		}
	};
	WriterToJSON.prototype.SerXFS = function(oXFS)
	{
		return {
			alignment: this.SerAlign(oXFS.align),
			pretection: {
				hidden: oXFS.hidden,
				locked: oXFS.locked
			},

			applyAlignment:  oXFS.ApplyAlignment,
			applyBorder:     oXFS.ApplyBorder,
			applyFill:       oXFS.ApplyFill,
			applyFont:       oXFS.ApplyFont,
			ApplyFont:       oXFS.ApplyNumberFormat,
			applyProtection: oXFS.applyProtection,
			borderId:        oXFS.borderid,
			fillId:          oXFS.fillid,
			fontId:          oXFS.fontid,
			numFmtId:        oXFS.numid,
			pivotButton:     oXFS.PivotButton,
			quotePrefix:     oXFS.QuotePrefix,
			xfId:            oXFS.XfId,
		}
	};
	WriterToJSON.prototype.SerAlign = function(oAlign)
	{
		return {
			horizontal:     ToXml_ST_HorizontalAlignment(oAlign.hor),
			indent:         oAlign.indent,
			relativeIndent: oAlign.RelativeIndent,
			shrinkToFit:    oAlign.shrink,
			textRotation:   oAlign.angle,
			vertical:       ToXml_ST_VerticalAlignment(oAlign.ver),
			wrapText:       oAlign.wrap
		}
	};
	WriterToJSON.prototype.SerAutoFilter = function(oAutoFilter)
	{
		var aFilterColumns = [];
		if (oAutoFilter.FilterColumns)
		{
			for (var nFilterCol = 0; nFilterCol < oAutoFilter.FilterColumns.length; nFilterCol)
				aFilterColumns.push(this.SerFilterColumn(oAutoFilter.FilterColumns[nFilterCol]));
		}
		
		return {
			filterColumn: aFilterColumns,
			sortState:    this.SerSortState(oAutoFilter.SortState),
			ref:          this.SerRef(oAutoFilter.Ref)
		}
	};
	WriterToJSON.prototype.SerFilterColumn = function(oFilterColumn)
	{
		if (!oFilterColumn)
			return oFilterColumn;

		return {
			colorFilter:   this.SerColorFilter(oFilterColumn.ColorFilter),
			customFilters: this.SerCustomFilters(oFilterColumn.CustomFiltersObj),
			dynamicFilter: this.SerDynamicFilter(oFilterColumn.DynamicFilter),
			filters:       this.SerFilters(oFilterColumn.Filters),
			top10:         this.SerTop10(oFilterColumn.Top10),
			colId:         oFilterColumn.ColId,
			showButton:    oFilterColumn.ShowButton
		}
	};
	WriterToJSON.prototype.SerColorFilter = function(oColorFilter)
	{
		if (!oColorFilter)
			return oColorFilter;

		return {
			cellColor: oColorFilter.CellColor,
			dxfId:     dxf
		}
	};
	WriterToJSON.prototype.SerCustomFilters = function(oCustomFilters)
	{
		if (!oCustomFilters)
			return oCustomFilters;

		var aFilters = [];
		if (oCustomFilters.CustomFilters)
		{
			for (var nFilter = 0; nFilter < oCustomFilters.CustomFilters.length; nFilter++)
				aFilters.push(this.SerCustomFilter(oCustomFilters.CustomFilters[nFilter]));
		}

		return {
			and:           oCustomFilters.And,
			customFilters: aFilters
		}
	};
	WriterToJSON.prototype.SerCustomFilter = function(oCustomFilter)
	{
		return {
			operator: ToXml_ST_FilterOperator(oCustomFilter.Operator),
			val:      oCustomFilter.val
		}
	};
	WriterToJSON.prototype.SerDynamicFilter = function(oDynamicFilter)
	{
		if (!oDynamicFilter)
			return oDynamicFilter;

		return {
			type:      ToXml_ST_DynamicFilterType(oDynamicFilter.Type),
			maxValIso: oDynamicFilter.MaxVal,
			valIso:    oDynamicFilter.Val
		}
	};
	WriterToJSON.prototype.SerFilters = function(oFilters)
	{
		if (!oFilters)
			return oFilters;

		var aDateGroupItem = [];
		for (var nDate = 0; nDate < oFilters.Dates.length; nDate++)
			aDateGroupItem.push(this.SerFilterDate(oFilters.Dates[nDate]));
			
		var aFilter = [];
		for (var nFilter = 0; nFilter < oFilters.Values.length; nFilter++)
			aFilter.push(oFilters.Values[nFilter]);

		return {
			dateGroupItem: aDateGroupItem,
			filter:        aFilter,
			blank:         oFilters.blank
		}
	};
	WriterToJSON.prototype.SerFilterDate = function(oFilterDate)
	{
		return {
			start:            oFilterDate.start,
			end:              oFilterDate.end,
			dateTimeGrouping: ToXml_ST_DateTimeGrouping(oFilterDate.dateTimeGrouping)
		}
	};
	WriterToJSON.prototype.SerTop10 = function(oTop10)
	{
		if (!oTop10)
			return oTop10;

		return {
			filterVal: oTop10.FilterVal,
			percent:   oTop10.Percent,
			top:       oTop10.Top,
			val:       oTop10.Val
		}
	};
	WriterToJSON.prototype.SerSortState = function(oSortState)
	{
		if (!oSortState)
			return oSortState;

		var aSortConditions= [];
		if (oSortState.SortConditions)
		{
			for (var nSort = 0; nSort < oSortState.SortConditions.length; nSort++)
				aSortConditions.push(this.SerSortCondition(oSortState.SortConditions[nSort]));
		}

		return {
			sortCondition: aSortConditions,
			caseSensitive: oSortState.CaseSensitive,
			columnSort:    oSortState.ColumnSort,
			ref:           this.SerRef(oSortState.Ref),
			sortMethod:    oSortState.SortMethod /// ???
		}
	};
	WriterToJSON.prototype.SerSortCondition = function(oSortCondition)
	{
		var sSortBy = undefined;
		switch (oSortCondition.ConditionSortBy)
		{
			case Asc.ESortBy.sortbyCellColor:
				sSortBy = "cellColor";
				break;
			case Asc.ESortBy.sortbyFontColor:
				sSortBy = "fontColor";
				break;
			case Asc.ESortBy.sortbyIcon:
				sSortBy = "icon";
				break;
			case Asc.ESortBy.sortbyValue:
				sSortBy = "value";
				break;
		}
		return {
			sortBy: sSortBy,
			descending: oSortCondition.ConditionDescending,
			ref:        this.SerRef(oSortCondition.Ref)
		}
	};
	WriterToJSON.prototype.SerRef = function(oRef)
	{
		if (!oRef)
			return oRef;

		var sColumn1 = AscCommon.g_oCellAddressUtils.colnumToColstr(oRef.c1);
		var sColumn2 = AscCommon.g_oCellAddressUtils.colnumToColstr(oRef.c2);

		return sColumn1 + oRef.r1 + ":" + sColumn2 + oRef.r2;
	};
	WriterToJSON.prototype.Ser = function(o)
	{

	};
	WriterToJSON.prototype.Ser = function(o)
	{

	};
	WriterToJSON.prototype.Ser = function(o)
	{

	};

	function getSqRefString(ranges)
	{
		var refs = [];
		for (var i = 0; i < ranges.length; ++i) {
			refs.push(ranges[i].getName());
		}
		return refs.join(' ');
	}
	function FromXml_ST_FilterOperator(val) {
		var res = -1;
		if ("equal" === val) {
			res = Asc.c_oAscCustomAutoFilter.equals;
		} else if ("lessThan" === val) {
			res = Asc.c_oAscCustomAutoFilter.isLessThan;
		} else if ("lessThanOrEqual" === val) {
			res = Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo;
		} else if ("notEqual" === val) {
			res = Asc.c_oAscCustomAutoFilter.doesNotEqual;
		} else if ("greaterThanOrEqual" === val) {
			res = Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo;
		} else if ("greaterThan" === val) {
			res = Asc.c_oAscCustomAutoFilter.isGreaterThan;
		}
		return res;
	}
	function ToXml_ST_FilterOperator(val) {
		var res = "";
		if (Asc.c_oAscCustomAutoFilter.equals === val) {
			res = "equal";
		} else if (Asc.c_oAscCustomAutoFilter.isLessThan === val) {
			res = "lessThan";
		} else if (Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo === val) {
			res = "lessThanOrEqual";
		} else if (Asc.c_oAscCustomAutoFilter.doesNotEqual === val) {
			res = "notEqual";
		} else if (Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo === val) {
			res = "greaterThanOrEqual";
		} else if (Asc.c_oAscCustomAutoFilter.isGreaterThan === val) {
			res = "greaterThan";
		}
		return res;
	}
	function FromXml_ST_DynamicFilterType(val) {
		var res = -1;
		if ("null" === val) {
			res = Asc.c_oAscDynamicAutoFilter.nullType;
		} else if ("aboveAverage" === val) {
			res = Asc.c_oAscDynamicAutoFilter.aboveAverage;
		} else if ("belowAverage" === val) {
			res = Asc.c_oAscDynamicAutoFilter.belowAverage;
		} else if ("tomorrow" === val) {
			res = Asc.c_oAscDynamicAutoFilter.tomorrow;
		} else if ("today" === val) {
			res = Asc.c_oAscDynamicAutoFilter.today;
		} else if ("yesterday" === val) {
			res = Asc.c_oAscDynamicAutoFilter.yesterday;
		} else if ("nextWeek" === val) {
			res = Asc.c_oAscDynamicAutoFilter.nextWeek;
		} else if ("thisWeek" === val) {
			res = Asc.c_oAscDynamicAutoFilter.thisWeek;
		} else if ("lastWeek" === val) {
			res = Asc.c_oAscDynamicAutoFilter.lastWeek;
		} else if ("nextMonth" === val) {
			res = Asc.c_oAscDynamicAutoFilter.nextMonth;
		} else if ("thisMonth" === val) {
			res = Asc.c_oAscDynamicAutoFilter.thisMonth;
		} else if ("lastMonth" === val) {
			res = Asc.c_oAscDynamicAutoFilter.lastMonth;
		} else if ("nextQuarter" === val) {
			res = Asc.c_oAscDynamicAutoFilter.nextQuarter;
		} else if ("thisQuarter" === val) {
			res = Asc.c_oAscDynamicAutoFilter.thisQuarter;
		} else if ("lastQuarter" === val) {
			res = Asc.c_oAscDynamicAutoFilter.lastQuarter;
		} else if ("nextYear" === val) {
			res = Asc.c_oAscDynamicAutoFilter.nextYear;
		} else if ("thisYear" === val) {
			res = Asc.c_oAscDynamicAutoFilter.thisYear;
		} else if ("lastYear" === val) {
			res = Asc.c_oAscDynamicAutoFilter.lastYear;
		} else if ("yearToDate" === val) {
			res = Asc.c_oAscDynamicAutoFilter.yearToDate;
		} else if ("Q1" === val) {
			res = Asc.c_oAscDynamicAutoFilter.q1;
		} else if ("Q2" === val) {
			res = Asc.c_oAscDynamicAutoFilter.q2;
		} else if ("Q3" === val) {
			res = Asc.c_oAscDynamicAutoFilter.q3;
		} else if ("Q4" === val) {
			res = Asc.c_oAscDynamicAutoFilter.q4;
		} else if ("M1" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m1;
		} else if ("M2" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m2;
		} else if ("M3" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m3;
		} else if ("M4" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m4;
		} else if ("M5" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m5;
		} else if ("M6" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m6;
		} else if ("M7" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m7;
		} else if ("M8" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m8;
		} else if ("M9" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m9;
		} else if ("M10" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m10;
		} else if ("M11" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m11;
		} else if ("M12" === val) {
			res = Asc.c_oAscDynamicAutoFilter.m12;
		}
		return res;
	}
	function ToXml_ST_DynamicFilterType(val) {
		var res = "";
		if (Asc.c_oAscDynamicAutoFilter.nullType === val){
			res = "null";
		} else if (Asc.c_oAscDynamicAutoFilter.aboveAverage === val) {
			res = "aboveAverage";
		} else if (Asc.c_oAscDynamicAutoFilter.belowAverage === val) {
			res = "belowAverage";
		} else if (Asc.c_oAscDynamicAutoFilter.tomorrow === val) {
			res = "tomorrow";
		} else if (Asc.c_oAscDynamicAutoFilter.today === val) {
			res = "today";
		} else if (Asc.c_oAscDynamicAutoFilter.yesterday === val) {
			res = "yesterday";
		} else if (Asc.c_oAscDynamicAutoFilter.nextWeek === val) {
			res = "nextWeek";
		} else if (Asc.c_oAscDynamicAutoFilter.thisWeek === val) {
			res = "thisWeek";
		} else if (Asc.c_oAscDynamicAutoFilter.lastWeek === val) {
			res = "lastWeek";
		} else if (Asc.c_oAscDynamicAutoFilter.nextMonth === val) {
			res = "nextMonth";
		} else if (Asc.c_oAscDynamicAutoFilter.thisMonth === val) {
			res = "thisMonth";
		} else if (Asc.c_oAscDynamicAutoFilter.lastMonth === val) {
			res = "lastMonth";
		} else if (Asc.c_oAscDynamicAutoFilter.nextQuarter === val) {
			res = "nextQuarter";
		} else if (Asc.c_oAscDynamicAutoFilter.thisQuarter === val) {
			res = "thisQuarter";
		} else if (Asc.c_oAscDynamicAutoFilter.lastQuarter === val) {
			res = "lastQuarter";
		} else if (Asc.c_oAscDynamicAutoFilter.nextYear === val) {
			res = "nextYear";
		} else if (Asc.c_oAscDynamicAutoFilter.thisYear === val) {
			res = "thisYear";
		} else if (Asc.c_oAscDynamicAutoFilter.lastYear === val) {
			res = "lastYear";
		} else if (Asc.c_oAscDynamicAutoFilter.yearToDate === val) {
			res = "yearToDate";
		} else if (Asc.c_oAscDynamicAutoFilter.q1 === val) {
			res = "Q1";
		} else if (Asc.c_oAscDynamicAutoFilter.q2 === val) {
			res = "Q2";
		} else if (Asc.c_oAscDynamicAutoFilter.q3 === val) {
			res = "Q3";
		} else if (Asc.c_oAscDynamicAutoFilter.q4 === val) {
			res = "Q4";
		} else if (Asc.c_oAscDynamicAutoFilter.m1 === val) {
			res = "M1";
		} else if (Asc.c_oAscDynamicAutoFilter.m2 === val) {
			res = "M2";
		} else if (Asc.c_oAscDynamicAutoFilter.m3 === val) {
			res = "M3";
		} else if (Asc.c_oAscDynamicAutoFilter.m4 === val) {
			res = "M4";
		} else if (Asc.c_oAscDynamicAutoFilter.m5 === val) {
			res = "M5";
		} else if (Asc.c_oAscDynamicAutoFilter.m6 === val) {
			res = "M6";
		} else if (Asc.c_oAscDynamicAutoFilter.m7 === val) {
			res = "M7";
		} else if (Asc.c_oAscDynamicAutoFilter.m8 === val) {
			res = "M8";
		} else if (Asc.c_oAscDynamicAutoFilter.m9 === val) {
			res = "M9";
		} else if (Asc.c_oAscDynamicAutoFilter.m10 === val) {
			res = "M10";
		} else if (Asc.c_oAscDynamicAutoFilter.m11 === val) {
			res = "M11";
		} else if (Asc.c_oAscDynamicAutoFilter.m12 === val) {
			res = "M12";
		}
		return res;
	}
	function FromXml_ST_DateTimeGrouping(val) {
		var res = -1;
		if ("year" === val) {
			res = Asc.EDateTimeGroup.datetimegroupYear;
		} else if ("month" === val) {
			res = Asc.EDateTimeGroup.datetimegroupMonth;
		} else if ("day" === val) {
			res = Asc.EDateTimeGroup.datetimegroupDay;
		} else if ("hour" === val) {
			res = Asc.EDateTimeGroup.datetimegroupHour;
		} else if ("minute" === val) {
			res = Asc.EDateTimeGroup.datetimegroupMinute;
		} else if ("second" === val) {
			res = Asc.EDateTimeGroup.datetimegroupSecond;
		}
		return res;
	}
	function ToXml_ST_DateTimeGrouping(val) {
		var res = "";
		if (Asc.EDateTimeGroup.datetimegroupYear === val) {
			res = "year";
		} else if (Asc.EDateTimeGroup.datetimegroupMonth === val) {
			res = "month";
		} else if (Asc.EDateTimeGroup.datetimegroupDay === val) {
			res = "day";
		} else if (Asc.EDateTimeGroup.datetimegroupHour === val) {
			res = "hour";
		} else if (Asc.EDateTimeGroup.datetimegroupMinute === val) {
			res = "minute";
		} else if (Asc.EDateTimeGroup.datetimegroupSecond === val) {
			res = "second";
		}
		return res;
	}
	function ToXml_ST_HorizontalAlignment(val) {
		var res = "";
		switch (val)
		{
			case -1:
				res = "general";
				break;
			case AscCommon.align_Left:
				res = "left";
				break;
			case AscCommon.align_Center:
				res = "center";
				break;
			case AscCommon.align_Right:
				res = "right";
				break;
			case AscCommon.align_Justify:
				res = "justify";
				break;
		}
		return res;
	}
	function FromXml_ST_HorizontalAlignment(val) {
		var res = -1;
		if ("general" === val) {
			res = -1;
		} else if ("left" === val) {
			res = AscCommon.align_Left;
		} else if ("center" === val) {
			res = AscCommon.align_Center;
		} else if ("right" === val) {
			res = AscCommon.align_Right;
		} else if ("fill" === val) {
			res = AscCommon.align_Justify;
		} else if ("justify" === val) {
			res = AscCommon.align_Justify;
		} else if ("centerContinuous" === val) {
			res = AscCommon.align_Center;
		} else if ("distributed" === val) {
			res = AscCommon.align_Justify;
		}
		return res;
	}
	function ToXml_ST_VerticalAlignment(val) {
		var res = "";
		switch (val)
		{
			case Asc.c_oAscVAlign.Top:
				res = "top";
				break;
			case Asc.c_oAscVAlign.Center:
				res = "center";
				break;
			case Asc.c_oAscVAlign.Bottom:
				res = "bottom";
				break;
			case Asc.c_oAscVAlign.Just:
				res = "justify";
				break;
			case Asc.c_oAscVAlign.Dist:
				res = "distributed";
				break;
		}
		return res;
	}
	function FromXml_ST_VerticalAlignment(val) {
		var res = -1;
		if ("top" === val) {
			res = Asc.c_oAscVAlign.Top;
		} else if ("center" === val) {
			res = Asc.c_oAscVAlign.Center;
		} else if ("bottom" === val) {
			res = Asc.c_oAscVAlign.Bottom;
		} else if ("justify" === val) {
			res = Asc.c_oAscVAlign.Just;
		} else if ("distributed" === val) {
			res = Asc.c_oAscVAlign.Dist;
		}
		return res;
	}
	function ToXML_ST_CfvoType(nType)
	{
		var sType = "";
		switch (nType)
		{
			case AscCommonExcel.ECfvoType.Formula:
				sType = "formula";
				break;
			case AscCommonExcel.ECfvoType.Maximum:
				sType = "max";
				break;
			case AscCommonExcel.ECfvoType.Minimum:
				sType = "min";
				break;
			case AscCommonExcel.ECfvoType.Number:
				sType = "num";
				break;
			case AscCommonExcel.ECfvoType.Percent:
				sType = "percent";
				break;
			case AscCommonExcel.ECfvoType.Percentile:
				sType = "percentile";
				break;
			case AscCommonExcel.ECfvoType.AutoMin:
				sType = "autoMin";
				break;
			case AscCommonExcel.ECfvoType.AutoMax:
				sType = "autoMax";
				break;
		}

		return sType;
	}
	function FromXML_ST_CfvoType(sType)
	{
		var nType = -1;
		switch (sType)
		{
			case "formula":
				nType = AscCommonExcel.ECfvoType.Formula;
				break;
			case "max":
				nType = AscCommonExcel.ECfvoType.Maximum;
				break;
			case "min":
				nType = AscCommonExcel.ECfvoType.Minimum;
				break;
			case "num":
				nType = AscCommonExcel.ECfvoType.Number;
				break;
			case "percent":
				nType = AscCommonExcel.ECfvoType.Percent;
				break;
			case "percentile":
				nType = AscCommonExcel.ECfvoType.Percentile;
				break;
			case "autoMin":
				nType = AscCommonExcel.ECfvoType.AutoMin;
				break;
			case "autoMax":
				nType = AscCommonExcel.ECfvoType.AutoMax;
				break;
		}

		return nType;
	}
	function ToXML_IconSetType(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.EIconSetType.Arrows3:
				sType = "3Arrows";
				break;
			case Asc.EIconSetType.Arrows3Gray:
				sType = "3ArrowsGray";
				break;
			case Asc.EIconSetType.Flags3:
				sType = "3Flags";
				break;
			case Asc.EIconSetType.Signs3:
				sType = "3Signs";
				break;
			case Asc.EIconSetType.Symbols3:
				sType = "3Symbols";
				break;
			case Asc.EIconSetType.Symbols3_2:
				sType = "3Symbols2";
				break;
			case Asc.EIconSetType.Traffic3Lights1:
				sType = "3TrafficLights1";
				break;
			case Asc.EIconSetType.Traffic3Lights2:
				sType = "3TrafficLights2";
				break;
			case Asc.EIconSetType.Arrows4:
				sType = "4Arrows";
				break;
			case Asc.EIconSetType.Arrows4Gray:
				sType = "4ArrowsGray";
				break;
			case Asc.EIconSetType.Rating4:
				sType = "4Rating";
				break;
			case Asc.EIconSetType.RedToBlack4:
				sType = "4RedToBlack";
				break;
			case Asc.EIconSetType.Traffic4Lights:
				sType = "4TrafficLights";
				break;
			case Asc.EIconSetType.Arrows5:
				sType = "5Arrows";
				break;
			case Asc.EIconSetType.Arrows5Gray:
				sType = "5ArrowsGray";
				break;
			case Asc.EIconSetType.Quarters5:
				sType = "5Quarters";
				break;
			case Asc.EIconSetType.Rating5: 
				sType = "5Rating";
				break;
			case Asc.EIconSetType.Triangles3:
				sType = "3Triangles";
				break;
			case Asc.EIconSetType.Stars3:
				sType = "3Stars";
				break;
			case Asc.EIconSetType.Boxes5:
				sType = "5Boxes";
				break;
			case Asc.EIconSetType.NoIcons:
				sType = "NoIcons";
				break;
		}

		return sType;
	}
	function FromXML_IconSetType(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "3Arrows":
				nType = Asc.EIconSetType.Arrows3;
				break;
			case "3ArrowsGray":
				nType = Asc.EIconSetType.Arrows3Gray;
				break;
			case "3Flags":
				nType = Asc.EIconSetType.Flags3;
				break;
			case "3Signs":
				nType = Asc.EIconSetType.Signs3;
				break;
			case "3Symbols":
				nType = Asc.EIconSetType.Symbols3;
				break;
			case "3Symbols2":
				nType = Asc.EIconSetType.Symbols3_2;
				break;
			case "3TrafficLights1":
				nType = Asc.EIconSetType.Traffic3Lights1;
				break;
			case "3TrafficLights2":
				nType = Asc.EIconSetType.Traffic3Lights2;
				break;
			case "4Arrows":
				nType = Asc.EIconSetType.Arrows4;
				break;
			case "4ArrowsGray":
				nType = Asc.EIconSetType.Arrows4Gray;
				break;
			case "4Rating":
				nType = Asc.EIconSetType.Rating4;
				break;
			case "4RedToBlack":
				nType = Asc.EIconSetType.RedToBlack4;
				break;
			case "4TrafficLights":
				nType = Asc.EIconSetType.Traffic4Lights;
				break;
			case "5Arrows":
				nType = Asc.EIconSetType.Arrows5;
				break;
			case "5ArrowsGray":
				nType = Asc.EIconSetType.Arrows5Gray;
				break;
			case "5Quarters":
				nType = Asc.EIconSetType.Quarters5;
				break;
			case "5Rating": 
				nType = Asc.EIconSetType.Rating5;
				break;
			case "3Triangles":
				nType = Asc.EIconSetType.Triangles3;
				break;
			case "3Stars":
				nType = Asc.EIconSetType.Stars3;
				break;
			case "5Boxes":
				nType = Asc.EIconSetType.Boxes5;
				break;
			case "NoIcons":
				nType = Asc.EIconSetType.NoIcons;
				break;
		}

		return nType;
	}
	function ToXML_CFOperatorType(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case AscCommonExcel.ECfOperator.Operator_beginsWith:
				sType = "beginsWith";
				break;
			case AscCommonExcel.ECfOperator.Operator_between:
				sType = "between";
				break;
			case AscCommonExcel.ECfOperator.Operator_containsText:
				sType = "containsText";
				break;
			case AscCommonExcel.ECfOperator.Operator_endsWith:
				sType = "endsWith";
				break;
			case AscCommonExcel.ECfOperator.Operator_equal:
				sType = "equal";
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThan:
				sType = "greaterThan";
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual:
				sType = "greaterThanOrEqual";
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThan:
				sType = "lessThan";
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThanOrEqual:
				sType = "lessThanOrEqual";
				break;
			case AscCommonExcel.ECfOperator.Operator_notBetween:
				sType = "notBetween";
				break;
			case AscCommonExcel.ECfOperator.Operator_notContains:
				sType = "notContains";
				break;
			case AscCommonExcel.ECfOperator.Operator_notEqual:
				sType = "notEqual";
				break;
		}

		return sType;
	}
	function FromXML_CFOperatorType(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "beginsWith":
				nType = AscCommonExcel.ECfOperator.Operator_beginsWith;
				break;
			case "between":
				nType = AscCommonExcel.ECfOperator.Operator_between;
				break;
			case "containsText":
				nType = AscCommonExcel.ECfOperator.Operator_containsText;
				break;
			case "endsWith":
				nType = AscCommonExcel.ECfOperator.Operator_endsWith;
				break;
			case "equal":
				nType = AscCommonExcel.ECfOperator.Operator_equal;
				break;
			case "greaterThan":
				nType = AscCommonExcel.ECfOperator.Operator_greaterThan;
				break;
			case "greaterThanOrEqual":
				nType = AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual;
				break;
			case "lessThan":
				nType = AscCommonExcel.ECfOperator.Operator_lessThan;
				break;
			case "lessThanOrEqual":
				nType = AscCommonExcel.ECfOperator.Operator_lessThanOrEqual;
				break;
			case "notBetween":
				nType = AscCommonExcel.ECfOperator.Operator_notBetween;
				break;
			case "notContains":
				nType = AscCommonExcel.ECfOperator.Operator_notContains;
				break;
			case "notEqual":
				nType = AscCommonExcel.ECfOperator.Operator_notEqual;
				break;
		}

		return nType;
	}
	function ToXML_ST_TimePeriod(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case AscCommonExcel.ST_TimePeriod.last7Days:
				sType = "last7Days";
				break;
			case AscCommonExcel.ST_TimePeriod.lastMonth:
				sType = "lastMonth";
				break;
			case AscCommonExcel.ST_TimePeriod.lastWeek:
				sType = "lastWeek";
				break;
			case AscCommonExcel.ST_TimePeriod.nextMonth:
				sType = "nextMonth";
				break;
			case AscCommonExcel.ST_TimePeriod.nextWeek:
				sType = "nextWeek";
				break;
			case AscCommonExcel.ST_TimePeriod.thisMonth:
				sType = "thisMonth";
				break;
			case AscCommonExcel.ST_TimePeriod.thisWeek:
				sType = "thisWeek";
				break;
			case AscCommonExcel.ST_TimePeriod.today:
				sType = "today";
				break;
			case AscCommonExcel.ST_TimePeriod.tomorrow:
				sType = "tomorrow";
				break;
			case AscCommonExcel.ST_TimePeriod.yesterday:
				sType = "yesterday";
				break;
		}

		return sType;
	}
	function FromXML_ST_TimePeriod(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "last7Days":
				nType = AscCommonExcel.ST_TimePeriod.last7Days;
				break;
			case "lastMonth":
				nType = AscCommonExcel.ST_TimePeriod.lastMonth;
				break;
			case "lastWeek":
				nType = AscCommonExcel.ST_TimePeriod.lastWeek;
				break;
			case "nextMonth":
				nType = AscCommonExcel.ST_TimePeriod.nextMonth;
				break;
			case "nextWeek":
				nType = AscCommonExcel.ST_TimePeriod.nextWeek;
				break;
			case "thisMonth":
				nType = AscCommonExcel.ST_TimePeriod.thisMonth;
				break;
			case "thisWeek":
				nType = AscCommonExcel.ST_TimePeriod.thisWeek;
				break;
			case "today":
				nType = AscCommonExcel.ST_TimePeriod.today;
				break;
			case "tomorrow":
				nType = AscCommonExcel.ST_TimePeriod.tomorrow;
				break;
			case "yesterday":
				nType = AscCommonExcel.ST_TimePeriod.yesterday;
				break;
		}

		return nType;
	}
	function ToXML_CfRuleType(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.ECfType.aboveAverage:
				sType = "aboveAverage";
				break;
			case Asc.ECfType.beginsWith:
				sType = "beginsWith";
				break;
			case Asc.ECfType.cellIs:
				sType = "cellIs";
				break;
			case Asc.ECfType.colorScale:
				sType = "colorScale";
				break;
			case Asc.ECfType.containsBlanks:
				sType = "containsBlanks";
				break;
			case Asc.ECfType.containsErrors:
				sType = "containsErrors";
				break;
			case Asc.ECfType.containsText:
				sType = "containsText";
				break;
			case Asc.ECfType.dataBar:
				sType = "dataBar";
				break;
			case Asc.ECfType.duplicateValues:
				sType = "duplicateValues";
				break;
			case Asc.ECfType.expression:
				sType = "expression";
				break;
			case Asc.ECfType.iconSet:
				sType = "iconSet";
				break;
			case Asc.ECfType.notContainsBlanks:
				sType = "notContainsBlanks";
				break;
			case Asc.ECfType.notContainsErrors:
				sType = "notContainsErrors";
				break;
			case Asc.ECfType.notContainsText:
				sType = "notContainsText";
				break;
			case Asc.ECfType.timePeriod:
				sType = "timePeriod";
				break;
			case Asc.ECfType.top10:
				sType = "top10";
				break;
			case Asc.ECfType.uniqueValues:
				sType = "uniqueValues";
				break;
			case Asc.ECfType.endsWith:
				sType = "endsWith";
				break;
		}

		return sType;
	}
	function FromXML_CfRuleType(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "aboveAverage":
				nType = Asc.ECfType.aboveAverage;
				break;
			case "beginsWith":
				nType = Asc.ECfType.beginsWith;
				break;
			case "cellIs":
				nType = Asc.ECfType.cellIs;
				break;
			case "colorScale":
				nType = Asc.ECfType.colorScale;
				break;
			case "containsBlanks":
				nType = Asc.ECfType.containsBlanks;
				break;
			case "containsErrors":
				nType = Asc.ECfType.containsErrors;
				break;
			case "containsText":
				nType = Asc.ECfType.containsText;
				break;
			case "dataBar":
				nType = Asc.ECfType.dataBar;
				break;
			case "duplicateValues":
				nType = Asc.ECfType.duplicateValues;
				break;
			case "expression":
				nType = Asc.ECfType.expression;
				break;
			case "iconSet":
				nType = Asc.ECfType.iconSet;
				break;
			case "notContainsBlanks":
				nType = Asc.ECfType.notContainsBlanks;
				break;
			case "notContainsErrors":
				nType = Asc.ECfType.notContainsErrors;
				break;
			case "notContainsText":
				nType = Asc.ECfType.notContainsText;
				break;
			case "timePeriod":
				nType = Asc.ECfType.timePeriod;
				break;
			case "top10":
				nType = Asc.ECfType.top10;
				break;
			case "uniqueValues":
				nType = Asc.ECfType.uniqueValues;
				break;
			case "endsWith":
				nType = Asc.ECfType.endsWith;
				break;
		}

		return nType;
	}
	function ToXML_ST_DataValidationErrorStyle(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.EDataValidationErrorStyle.Stop:
				sType = "stop";
				break;
			case Asc.EDataValidationErrorStyle.Warning:
				sType = "warning";
				break;
			case Asc.EDataValidationErrorStyle.Information:
				sType = "information";
				break;
		}

		return sType;
	}
	function FromXML_ST_DataValidationErrorStyle(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "stop":
				nType = Asc.EDataValidationErrorStyle.Stop;
				break;
			case "warning":
				nType = Asc.EDataValidationErrorStyle.Warning;
				break;
			case "information":
				nType = Asc.EDataValidationErrorStyle.Information;
				break;
		}

		return nType;
	}
	function ToXML_ST_DataValidationImeMode(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.EDataValidationImeMode.NoControl:
				sType = "noControl";
				break;
			case Asc.EDataValidationImeMode.Off:
				sType = "off";
				break;
			case Asc.EDataValidationImeMode.On:
				sType = "on";
				break;
			case Asc.EDataValidationImeMode.Disabled:
				sType = "disabled";
				break;
			case Asc.EDataValidationImeMode.Hiragana:
				sType = "hiragana";
				break;
			case Asc.EDataValidationImeMode.FullKatakana:
				sType = "fullKatakana";
				break;
			case Asc.EDataValidationImeMode.HalfKatakana:
				sType = "halfKatakana";
				break;
			case Asc.EDataValidationImeMode.FullAlpha:
				sType = "fullAlpha";
				break;
			case Asc.EDataValidationImeMode.HalfAlpha:
				sType = "halfAlpha";
				break;
			case Asc.EDataValidationImeMode.FullHangul:
				sType = "fullHangul";
				break;
			case Asc.EDataValidationImeMode.HalfHangul:
				sType = "halfHangul";
				break;
		}

		return sType;
	}
	function FromXML_ST_DataValidationImeMode(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "noControl":
				nType = Asc.EDataValidationImeMode.NoControl;
				break;
			case "off":
				nType = Asc.EDataValidationImeMode.Off;
				break;
			case "on":
				nType = Asc.EDataValidationImeMode.On;
				break;
			case "disabled":
				nType = Asc.EDataValidationImeMode.Disabled;
				break;
			case "hiragana":
				nType = Asc.EDataValidationImeMode.Hiragana;
				break;
			case "fullKatakana":
				nType = Asc.EDataValidationImeMode.FullKatakana;
				break;
			case "halfKatakana":
				nType = Asc.EDataValidationImeMode.HalfKatakana;
				break;
			case "fullAlpha":
				nType = Asc.EDataValidationImeMode.FullAlpha;
				break;
			case "halfAlpha":
				nType = Asc.EDataValidationImeMode.HalfAlpha;
				break;
			case "fullHangul":
				nType = Asc.EDataValidationImeMode.FullHangul;
				break;
			case "halfHangul":
				nType = Asc.EDataValidationImeMode.HalfHangul;
				break;
		}

		return nType;
	}
	function ToXML_ST_DataValidationOperator(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.EDataValidationOperator.Between:
				sType = "between";
				break;
			case Asc.EDataValidationOperator.NotBetween:
				sType = "notBetween";
				break;
			case Asc.EDataValidationOperator.Equal:
				sType = "equal";
				break;
			case Asc.EDataValidationOperator.NotEqual:
				sType = "notEqual";
				break;
			case Asc.EDataValidationOperator.LessThan:
				sType = "lessThan";
				break;
			case Asc.EDataValidationOperator.LessThanOrEqual:
				sType = "lessThanOrEqual";
				break;
			case Asc.EDataValidationOperator.GreaterThan:
				sType = "greaterThan";
				break;
			case Asc.EDataValidationOperator.GreaterThanOrEqual:
				sType = "greaterThanOrEqual";
				break;
		}

		return sType;
	}
	function FromXML_ST_DataValidationOperator(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "between":
				nType = Asc.EDataValidationOperator.Between;
				break;
			case "notBetween":
				nType = Asc.EDataValidationOperator.NotBetween;
				break;
			case "equal":
				nType = Asc.EDataValidationOperator.Equal;
				break;
			case "notEqual":
				nType = Asc.EDataValidationOperator.NotEqual;
				break;
			case "lessThan":
				nType = Asc.EDataValidationOperator.LessThan;
				break;
			case "lessThanOrEqual":
				nType = Asc.EDataValidationOperator.LessThanOrEqual;
				break;
			case "greaterThan":
				nType = Asc.EDataValidationOperator.GreaterThan;
				break;
			case "greaterThanOrEqual":
				nType = Asc.EDataValidationOperator.GreaterThanOrEqual;
				break;
		}

		return nType;
	}
	function ToXML_ST_DataValidationType(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case Asc.EDataValidationType.None:
				sType = "none";
				break;
			case Asc.EDataValidationType.Custom:
				sType = "custom";
				break;
			case Asc.EDataValidationType.Date:
				sType = "date";
				break;
			case Asc.EDataValidationType.Decimal:
				sType = "decimal";
				break;
			case Asc.EDataValidationType.List:
				sType = "list";
				break;
			case Asc.EDataValidationType.TextLength:
				sType = "textLength";
				break;
			case Asc.EDataValidationType.Time:
				sType = "time";
				break;
			case Asc.EDataValidationType.Whole:
				sType = "whole";
				break;
		}

		return sType;
	}
	function FromXML_ST_DataValidationType(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "none":
				nType = Asc.EDataValidationType.None;
				break;
			case "custom":
				nType = Asc.EDataValidationType.Custom;
				break;
			case "date":
				nType = Asc.EDataValidationType.Date;
				break;
			case "decimal":
				nType = Asc.EDataValidationType.Decimal;
				break;
			case "list":
				nType = Asc.EDataValidationType.List;
				break;
			case "textLength":
				nType = Asc.EDataValidationType.TextLength;
				break;
			case "time":
				nType = Asc.EDataValidationType.Time;
				break;
			case "whole":
				nType = Asc.EDataValidationType.Whole;
				break;
		}

		return nType;
	}
	function ToXML_ST_EditAs(nType)
	{
		var sType = undefined;
		switch (nType)
		{
			case AscCommon.c_oAscCellAnchorType.cellanchorAbsolute:
				sType = "absolute";
				break;
			case AscCommon.c_oAscCellAnchorType.cellanchorOneCell:
				sType = "oneCell";
				break;
			case AscCommon.c_oAscCellAnchorType.cellanchorTwoCell:
				sType = "twoCell";
				break;
		}

		return sType;
	}
	function FromXML_ST_EditAse(sType)
	{
		var nType = undefined;
		switch (sType)
		{
			case "absolute":
				nType = AscCommon.c_oAscCellAnchorType.cellanchorAbsolute;
				break;
			case "oneCell":
				nType = AscCommon.c_oAscCellAnchorType.cellanchorOneCell;
				break;
			case "twoCell":
				nType = AscCommon.c_oAscCellAnchorType.cellanchorTwoCell;
				break;
		}

		return nType;
	}
	
    //----------------------------------------------------------export----------------------------------------------------
    window['AscCommon']       = window['AscCommon'] || {};
    window['AscFormat']       = window['AscFormat'] || {};
	
})(window);



