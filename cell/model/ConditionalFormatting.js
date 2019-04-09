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

(function (window, undefined) {
	/*
	 * Import
	 * -----------------------------------------------------------------------------
	 */
	var FT_Common = AscFonts.FT_Common;
	var CellValueType = AscCommon.CellValueType;
	var EIconSetType = Asc.EIconSetType;
	/**
	 * Отвечает за условное форматирование
	 * -----------------------------------------------------------------------------
	 *
	 * @constructor
	 * @memberOf Asc
	 */
	function CConditionalFormatting () {
		this.pivot = false;
		this.ranges = null;
		this.aRules = [];

		return this;
	}
	CConditionalFormatting.prototype.setSqref = function(sqref) {
		this.ranges = AscCommonExcel.g_oRangeCache.getActiveRangesFromSqRef(sqref);
	};
	CConditionalFormatting.prototype.isValid = function() {
		//todo more checks
		return this.ranges && this.ranges.length > 0;
	};
	CConditionalFormatting.prototype.initRules = function() {
		for (var i = 0; i < this.aRules.length; ++i) {
			this.aRules[i].updateConditionalFormatting(this);
	}
	};

	//todo need another approach
	function CConditionalFormattingFormulaParent (ws, rule, isDefName) {
		this.ws = ws;
		this.rule = rule;
		this.isDefName = isDefName;
	}
	CConditionalFormattingFormulaParent.prototype.onFormulaEvent = function(type, eventData) {
		if (AscCommon.c_oNotifyParentType.IsDefName === type && this.isDefName) {
			return {bbox: this.rule.getBBox(), ranges: this.rule.ranges};
		} else if (AscCommon.c_oNotifyParentType.Change === type) {
			this.ws.setDirtyConditionalFormatting(new AscCommonExcel.MultiplyRange(this.rule.ranges));
		}
	};
	CConditionalFormattingFormulaParent.prototype.clone = function() {
		return new CConditionalFormattingFormulaParent(this.ws, this.rule, this.isDefName);
	};

	function CConditionalFormattingRule () {
		this.aboveAverage = true;
		this.activePresent = false;
		this.bottom = false;
		this.dxf = null;
		this.equalAverage = false;
		this.id = null;
		this.operator = null;
		this.percent = false;
		this.priority = null;
		this.rank = null;
		this.stdDev = null;
		this.stopIfTrue = false;
		this.text = null;
		this.timePeriod = null;
		this.type = null;

		this.aRuleElements = [];

		// from CConditionalFormatting
		// Combined all the rules into one array to sort the priorities,
		// so they transferred these properties to the rule
		this.pivot = false;
		this.ranges = null;

		return this;
	}
	CConditionalFormattingRule.prototype.clone = function() {
		var i, res = new CConditionalFormattingRule();
		res.aboveAverage = this.aboveAverage;
		res.bottom = this.bottom;
		if (this.dxf)
			res.dxf = this.dxf.clone();
		res.equalAverage = this.equalAverage;
		res.operator = this.operator;
		res.percent = this.percent;
		res.priority = this.priority;
		res.rank = this.rank;
		res.stdDev = this.stdDev;
		res.stopIfTrue = this.stopIfTrue;
		res.text = this.text;
		res.timePeriod = this.timePeriod;
		res.type = this.type;

		res.updateConditionalFormatting(this);

		for (i = 0; i < this.aRuleElements.length; ++i)
			res.aRuleElements.push(this.aRuleElements[i].clone());
		return res;
	};
	CConditionalFormattingRule.prototype.getTimePeriod = function() {
		var start, end;
		var now = new Asc.cDate();
		now.setUTCHours(0, 0, 0, 0);
		switch (this.timePeriod) {
			case AscCommonExcel.ST_TimePeriod.last7Days:
				now.setUTCDate(now.getUTCDate() + 1);
				end = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() - 7);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.lastMonth:
				now.setUTCDate(1);
				end = now.getExcelDate();
				now.setUTCMonth(now.getUTCMonth() - 1);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.thisMonth:
				now.setUTCDate(1);
				start = now.getExcelDate();
				now.setUTCMonth(now.getUTCMonth() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.nextMonth:
				now.setUTCDate(1);
				now.setUTCMonth(now.getUTCMonth() + 1);
				start = now.getExcelDate();
				now.setUTCMonth(now.getUTCMonth() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.lastWeek:
				now.setUTCDate(now.getUTCDate() - now.getUTCDay());
				end = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() - 7);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.thisWeek:
				now.setUTCDate(now.getUTCDate() - now.getUTCDay());
				start = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() + 7);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.nextWeek:
				now.setUTCDate(now.getUTCDate() - now.getUTCDay() + 7);
				start = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() + 7);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.yesterday:
				end = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() - 1);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.today:
				start = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.tomorrow:
				now.setUTCDate(now.getUTCDate() + 1);
				start = now.getExcelDate();
				now.setUTCDate(now.getUTCDate() + 1);
				end = now.getExcelDate();
				break;
		}
		return {start: start, end: end};
	};
	CConditionalFormattingRule.prototype.getValueCellIs = function(ws, opt_parent, opt_bbox, opt_offset, opt_returnRaw) {
		var res;
		if (null !== this.text) {
			res = new AscCommonExcel.cString(this.text);
		} else if (this.aRuleElements[1]) {
			res = this.aRuleElements[1].getValue(ws, opt_parent, opt_bbox, opt_offset, opt_returnRaw);
		}
		return res;
	};
	CConditionalFormattingRule.prototype.getFormulaCellIs = function() {
		return null === this.text && this.aRuleElements[1];
	};
	CConditionalFormattingRule.prototype.cellIs = function(operator, cell, v1, v2) {
		if (operator === AscCommonExcel.ECfOperator.Operator_beginsWith ||
			operator === AscCommonExcel.ECfOperator.Operator_endsWith ||
			operator === AscCommonExcel.ECfOperator.Operator_containsText ||
			operator === AscCommonExcel.ECfOperator.Operator_notContains) {
			return this._cellIsText(operator, cell, v1);
		} else {
			return this._cellIsNumber(operator, cell, v1, v2);
		}
	};
	CConditionalFormattingRule.prototype._cellIsText = function(operator, cell, v1) {
		if (!v1 || AscCommonExcel.cElementType.empty === v1.type) {
			v1 = new AscCommonExcel.cString("");
		}
		if (AscCommonExcel.ECfOperator.Operator_notContains === operator) {
			return !this._cellIsText(AscCommonExcel.ECfOperator.Operator_containsText, cell, v1);
		}
		var cellType = cell ? cell.type : null;
		if (cellType === CellValueType.Error || AscCommonExcel.cElementType.error === v1.type) {
			return false;
		}
		var res = false;
		var cellVal = cell ? cell.getValueWithoutFormat().toLowerCase() : "";
		var v1Val = v1.toLocaleString().toLowerCase();
		switch (operator) {
			case AscCommonExcel.ECfOperator.Operator_beginsWith:
			case AscCommonExcel.ECfOperator.Operator_endsWith:
				if (AscCommonExcel.cElementType.string === v1.type && (cellType === CellValueType.String || "" === v1Val)) {
					if (AscCommonExcel.ECfOperator.Operator_beginsWith === operator) {
						res = cellVal.startsWith(v1Val);
					} else {
						res = cellVal.endsWith(v1Val);
					}
				} else {
					res = false;
				}
				break;
			case AscCommonExcel.ECfOperator.Operator_containsText:
				if ("" === cellVal) {
					res = false;
				} else {
					res = -1 !== cellVal.indexOf(v1Val);
				}
				break;
		}
		return res;
	};
	CConditionalFormattingRule.prototype._cellIsNumber = function(operator, cell, v1, v2) {
		if (!v1 || AscCommonExcel.cElementType.empty === v1.type) {
			v1 = new AscCommonExcel.cNumber(0);
		}
		if ((cell && cell.type === CellValueType.Error) || AscCommonExcel.cElementType.error === v1.type) {
			return false;
		}
		var cellVal;
		var res = false;
		switch (operator) {
			case AscCommonExcel.ECfOperator.Operator_equal:
				if (AscCommonExcel.cElementType.number === v1.type) {
					if (!cell || cell.isNullTextString()) {
						res = 0 === v1.getValue();
					} else if (cell.type === CellValueType.Number) {
						res = cell.getNumberValue() === v1.getValue();
					} else {
						res = false;
					}
				} else if (AscCommonExcel.cElementType.string === v1.type) {
					if (!cell || cell.isNullTextString()) {
						res = "" === v1.getValue().toLowerCase();
					} else if (cell.type === CellValueType.String) {
						cellVal = cell.getValueWithoutFormat().toLowerCase();
						res = cellVal === v1.getValue().toLowerCase();
					} else {
						res = false;
					}
				} else if (AscCommonExcel.cElementType.bool === v1.type) {
					if (cell && cell.type === CellValueType.Bool) {
						res = cell.getBoolValue() === v1.toBool();
					} else {
						res = false;
					}
				}
				break;
			case AscCommonExcel.ECfOperator.Operator_notEqual:
				res = !this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_equal, cell, v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThan:
				if (AscCommonExcel.cElementType.number === v1.type) {
					if (!cell || cell.isNullTextString()) {
						res = 0 > v1.getValue();
					} else if (cell.type === CellValueType.Number) {
						res = cell.getNumberValue() > v1.getValue();
					} else {
						res = true;
					}
				} else if (AscCommonExcel.cElementType.string === v1.type) {
					if (!cell || cell.isNullTextString()) {
						res = "" > v1.getValue().toLowerCase();
					} else if (cell.type === CellValueType.Number) {
						res = false;
					} else if (cell.type === CellValueType.String) {
						cellVal = cell.getValueWithoutFormat().toLowerCase();
						//todo Excel uses different string compare function
						res = cellVal > v1.getValue().toLowerCase();
					} else if (cell.type === CellValueType.Bool) {
						res = true;
					}
				} else if (AscCommonExcel.cElementType.bool === v1.type) {
					if (cell && cell.type === CellValueType.Bool) {
						res = cell.getBoolValue() > v1.toBool();
					} else {
						res = false;
					}
				}
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual:
				res = this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_greaterThan, cell, v1) ||
					this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_equal, cell, v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThan:
				res = !this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual, cell, v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThanOrEqual:
				res = !this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_greaterThan, cell, v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_between:
				res = this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual, cell, v1) &&
					this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_lessThanOrEqual, cell, v2);
				break;
			case AscCommonExcel.ECfOperator.Operator_notBetween:
				res = !this._cellIsNumber(AscCommonExcel.ECfOperator.Operator_between, cell, v1, v2);
				break;
		}
		return res;
	};
	CConditionalFormattingRule.prototype.getAverage = function(val, average, stdDev) {
		var res = false;
		/*if (this.stdDev) {
			average += (this.aboveAverage ? 1 : -1) * this.stdDev + stdDev;
		}*/
		if (this.aboveAverage) {
			res = val > average;
		} else {
			res = val < average;
		}
		res = res || (this.equalAverage && val == average);
		return res;
	};
	CConditionalFormattingRule.prototype.hasStdDev = function() {
		return null !== this.stdDev;
	};
	CConditionalFormattingRule.prototype.updateConditionalFormatting = function (cf) {
		var i;
		this.pivot = cf.pivot;
		if (cf.ranges) {
			this.ranges = [];
			for (i = 0; i < cf.ranges.length; ++i) {
				this.ranges.push(cf.ranges[i].clone());
			}
		}
	};
	CConditionalFormattingRule.prototype.getBBox = function() {
		var bbox = null;
		if (this.ranges && this.ranges.length > 0) {
			bbox = this.ranges[0].clone();
			for(var i = 1 ; i < this.ranges.length; ++i){
				bbox.union2(this.ranges[i]);
			}
		}
		return bbox;
	};
	CConditionalFormattingRule.prototype.getIndexRule = function(values, ws, value) {
		var valueCFVO;
		var aCFVOs = this._getCFVOs();
		for (var i = aCFVOs.length - 1; i >= 0; --i) {
			valueCFVO = this._getValue(values, aCFVOs[i], ws);
			if (value > valueCFVO || (aCFVOs[i].Gte && value === valueCFVO)) {
				return i;
			}
		}
		return 0;
	};
	CConditionalFormattingRule.prototype.getMin = function(values, ws) {
		var aCFVOs = this._getCFVOs();
		var oCFVO = (aCFVOs && 0 < aCFVOs.length) ? aCFVOs[0] : null;
		return this._getValue(values, oCFVO, ws);
	};
	CConditionalFormattingRule.prototype.getMid = function(values, ws) {
		var aCFVOs = this._getCFVOs();
		var oCFVO = (aCFVOs && 2 < aCFVOs.length) ? aCFVOs[1] : null;
		return this._getValue(values, oCFVO, ws);
	};
	CConditionalFormattingRule.prototype.getMax = function(values, ws) {
		var aCFVOs = this._getCFVOs();
		var oCFVO = (aCFVOs && 2 === aCFVOs.length) ? aCFVOs[1] : ((aCFVOs && 2 < aCFVOs.length) ? aCFVOs[2] : null);
		return this._getValue(values, oCFVO, ws);
	};
	CConditionalFormattingRule.prototype._getCFVOs = function () {
		var oRuleElement = this.aRuleElements[0];
		return oRuleElement && oRuleElement.aCFVOs;
	};
	CConditionalFormattingRule.prototype._getValue = function (values, oCFVO, ws) {
		var res, min;
		if (oCFVO) {
			if (oCFVO.Val) {
				res = 0;
				if (null === oCFVO.formula) {
					oCFVO.formulaParent = new CConditionalFormattingFormulaParent(ws, this, false);
					oCFVO.formula = new CFormulaCF();
					oCFVO.formula.Text = oCFVO.Val;
				}
				var calcRes = oCFVO.formula.getValue(ws, oCFVO.formulaParent, null, null, true);
				if (calcRes && calcRes.tocNumber) {
					calcRes = calcRes.tocNumber();
					if (calcRes && calcRes.toNumber) {
						res = calcRes.toNumber();
					}
				}
			}
			switch (oCFVO.Type) {
				case AscCommonExcel.ECfvoType.Minimum:
					res = AscCommonExcel.getArrayMin(values);
					break;
				case AscCommonExcel.ECfvoType.Maximum:
					res = AscCommonExcel.getArrayMax(values);
					break;
				case AscCommonExcel.ECfvoType.Number:
					break;
				case AscCommonExcel.ECfvoType.Percent:
					min = AscCommonExcel.getArrayMin(values);
					res = min + (AscCommonExcel.getArrayMax(values) - min) * res / 100;
					break;
				case AscCommonExcel.ECfvoType.Percentile:
					res = AscCommonExcel.getPercentile(values, res / 100.0);
					if (AscCommonExcel.cElementType.number === res.type) {
						res = res.getValue();
					} else {
						res = AscCommonExcel.getArrayMin(values);
					}
					break;
				case AscCommonExcel.ECfvoType.Formula:
					break;
				default:
					res = -Number.MAX_VALUE;
					break;
			}
		}
		return res;
	};

	function CColorScale () {
		this.aCFVOs = [];
		this.aColors = [];

		return this;
	}
	CColorScale.prototype.type = AscCommonExcel.ECfType.colorScale;
	CColorScale.prototype.clone = function() {
		var i, res = new CColorScale();
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		for (i = 0; i < this.aColors.length; ++i)
			res.aColors.push(this.aColors[i].clone());
		return res;
	};

	function CDataBar () {
		this.MaxLength = 90;
		this.MinLength = 10;
		this.ShowValue = true;
		this.AxisPosition = AscCommonExcel.EDataBarAxisPosition.automatic;
		this.Gradient = true;
		this.Direction = AscCommonExcel.EDataBarDirection.context;
		this.NegativeBarColorSameAsPositive = false;
		this.NegativeBarBorderColorSameAsPositive = true;

		this.aCFVOs = [];
		this.Color = null;
		this.NegativeColor = null;
		this.BorderColor = null;
		this.NegativeBorderColor = null;
		this.AxisColor = null;
		return this;
	}
	CDataBar.prototype.type = AscCommonExcel.ECfType.dataBar;
	CDataBar.prototype.clone = function() {
		var i, res = new CDataBar();
		res.MaxLength = this.MaxLength;
		res.MinLength = this.MinLength;
		res.ShowValue = this.ShowValue;
		res.AxisPosition = this.AxisPosition;
		res.Gradient = this.Gradient;
		res.Direction = this.Direction;
		res.NegativeBarColorSameAsPositive = this.NegativeBarColorSameAsPositive;
		res.NegativeBarBorderColorSameAsPositive = this.NegativeBarBorderColorSameAsPositive;
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		if (this.Color)
			res.Color = this.Color.clone();
		if (this.NegativeColor)
			res.NegativeColor = this.NegativeColor.clone();
		if (this.BorderColor)
			res.BorderColor = this.BorderColor.clone();
		if (this.NegativeBorderColor)
			res.NegativeBorderColor = this.NegativeBorderColor.clone();
		if (this.AxisColor)
			res.AxisColor = this.AxisColor.clone();
		return res;
	};

	function CFormulaCF () {
		this.Text = null;
		this._f = null;

		return this;
	}
	CFormulaCF.prototype.clone = function() {
		var res = new CFormulaCF();
		res.Text = this.Text;
		return res;
	};
	CFormulaCF.prototype.init = function(ws, opt_parent) {
		if (!this._f) {
			this._f = new AscCommonExcel.parserFormula(this.Text, opt_parent, ws);
			this._f.parse();
			if (opt_parent) {
				//todo realize removeDependencies
				this._f.buildDependencies();
			}
		}
	};
	CFormulaCF.prototype.getFormula = function(ws, opt_parent) {
		this.init(ws, opt_parent);
		return this._f;
	};
	CFormulaCF.prototype.getValue = function(ws, opt_parent, opt_bbox, opt_offset, opt_returnRaw) {
		this.init(ws, opt_parent);
		var res = this._f.calculate(null, opt_bbox, opt_offset);
		if (!opt_returnRaw) {
			res = this._f.simplifyRefType(res);
		}
		return res;
	};

	function CIconSet () {
		this.IconSet = EIconSetType.Traffic3Lights1;
		this.Percent = true;
		this.Reverse = false;
		this.ShowValue = true;

		this.aCFVOs = [];
		this.aIconSets = [];

		return this;
	}
	CIconSet.prototype.type = AscCommonExcel.ECfType.iconSet;
	CIconSet.prototype.clone = function() {
		var i, res = new CIconSet();
		res.IconSet = this.IconSet;
		res.Percent = this.Percent;
		res.Reverse = this.Reverse;
		res.ShowValue = this.ShowValue;
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		for (i = 0; i < this.aIconSets.length; ++i)
			res.aIconSets.push(this.aIconSets[i].clone());
		return res;
	};

	function CConditionalFormatValueObject () {
		this.Gte = true;
		this.Type = null;
		this.Val = null;
		this.formulaParent = null;
		this.formula = null;

		return this;
	}
	CConditionalFormatValueObject.prototype.clone = function() {
		var res = new CConditionalFormatValueObject();
		res.Gte = this.Gte;
		res.Type = this.Type;
		res.Val = this.Val;
		res.formulaParent = this.formulaParent ? this.formulaParent.clone() : null;
		res.formula = this.formula ? this.formula.clone() : null;
		return res;
	};

	function CConditionalFormatIconSet () {
		this.IconSet = null;
		this.IconId = null;

		return this;
	}
	CConditionalFormatIconSet.prototype.clone = function() {
		var res = new CConditionalFormatIconSet();
		res.IconSet = this.IconSet;
		res.IconId = this.IconId;
		return res;
	};

	function CGradient (c1, c2) {
		this.MaxColorIndex = 512;
		this.base_shift = 8;

		this.c1 = c1;
		this.c2 = c2;

		this.min = this.max = 0;
		this.koef = null;
		this.r1 = this.r2 = 0;
		this.g1 = this.g2 = 0;
		this.b1 = this.b2 = 0;

		return this;
	}

	CGradient.prototype.init = function (min, max) {
		var distance = max - min;

		this.min = min;
		this.max = max;
		this.koef = distance ? this.MaxColorIndex / (2.0 * distance) : 0;
		this.r1 = this.c1.getR();
		this.g1 = this.c1.getG();
		this.b1 = this.c1.getB();
		this.r2 = this.c2.getR();
		this.g2 = this.c2.getG();
		this.b2 = this.c2.getB();
	};
	CGradient.prototype.calculateColor = function (indexColor) {
		if (indexColor < this.min) {
			indexColor = this.min;
		} else if (indexColor > this.max) {
			indexColor = this.max;
		}
		indexColor = (this.koef ? (indexColor - this.min) * this.koef : this.MaxColorIndex / 2) >> 0;

		var r = (this.r1 + ((FT_Common.IntToUInt(this.r2 - this.r1) * indexColor) >> this.base_shift)) & 0xFF;
		var g = (this.g1 + ((FT_Common.IntToUInt(this.g2 - this.g1) * indexColor) >> this.base_shift)) & 0xFF;
		var b = (this.b1 + ((FT_Common.IntToUInt(this.b2 - this.b1) * indexColor) >> this.base_shift)) & 0xFF;
		//console.log("index=" + indexColor + ": r=" + r + " g=" + g + " b=" + b);
		return new AscCommonExcel.RgbColor((r << 16) + (g << 8) + b);
	};

	var iCheckGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2hlY2stZ3JlZW4iPjxwYXRoIGlkPSJFbGxpcHNlIiBkPSJNMTUgOEMxNSAxMS44NjYgMTEuODY2IDE1IDggMTVDNC4xMzQwMSAxNSAxIDExLjg2NiAxIDhDMSA0LjEzNDAxIDQuMTM0MDEgMSA4IDFDMTEuODY2IDEgMTUgNC4xMzQwMSAxNSA4WiIgZmlsbD0iIzY4QTQ5MCIvPjxwYXRoIGlkPSJFbGxpcHNlIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTggMTRDMTEuMzEzNyAxNCAxNCAxMS4zMTM3IDE0IDhDMTQgNC42ODYyOSAxMS4zMTM3IDIgOCAyQzQuNjg2MjkgMiAyIDQuNjg2MjkgMiA4QzIgMTEuMzEzNyA0LjY4NjI5IDE0IDggMTRaTTggMTVDMTEuODY2IDE1IDE1IDExLjg2NiAxNSA4QzE1IDQuMTM0MDEgMTEuODY2IDEgOCAxQzQuMTM0MDEgMSAxIDQuMTM0MDEgMSA4QzEgMTEuODY2IDQuMTM0MDEgMTUgOCAxNVoiIGZpbGw9IiMzMjZGNUIiLz48cGF0aCBpZD0iVmVjdG9yIDMgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuODA1MSA1LjU5MzJMNy42MzkxNiAxMi42MDQxTDQuMjQxNjggOC42NTE4OUw1Ljc1ODMyIDcuMzQ4MTFMNy41MTg3MyA5LjM5NTk0TDExLjE5NDkgNC40MDY4TDEyLjgwNTEgNS41OTMyWiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+';
	var iCheckSymbolGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2hlY2stc3ltYm9sLWdyZWVuIj48cGF0aCBpZD0iVmVjdG9yIDMuMSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNCA0LjI5NTc4TDYuNjgyMDMgMTRMMiA4LjY3ODIxTDMuNjM0MTcgNy4yNTYwOEw2LjU1MjE4IDEwLjU3MjhMMTIuMjYyOCAzTDE0IDQuMjk1NzhaIiBmaWxsPSIjNjhBNDkwIi8+PHBhdGggaWQ9IlZlY3RvciAzLjEgKFN0cm9rZSkgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMTYzMSAyLjMwMTgzTDE0LjcwMTggNC4xOTU1Mkw2LjcxMTg2IDE0Ljc5MDlMMS4yOTI1NCA4LjYzMTA1TDMuNjgxMDggNi41NTI0NEw2LjUyMjM0IDkuNzgxOTRMMTIuMTYzMSAyLjMwMTgzWk0xMi4zNjI2IDMuNjk4MThMNi41ODIwMSAxMS4zNjM3TDMuNTg3MjYgNy45NTk3M0wyLjcwNzQ1IDguNzI1MzdMNi42NTIxOSAxMy4yMDkxTDEzLjI5ODIgNC4zOTYwNEwxMi4zNjI2IDMuNjk4MThaIiBmaWxsPSIjMzI2RjVCIi8+PC9nPjwvc3ZnPg==';
	var iCircleTwoWhiteQuarters = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlIC10d28gd2hpdGUgcXVhcnRlcnMiPjxwYXRoIGlkPSJFbGxpcHNlIDIuMyIgZD0iTTE1IDhDMTUgMTEuODY2IDExLjg2NiAxNSA4IDE1QzQuMTM0MDEgMTUgMSAxMS44NjYgMSA4QzEgNC4xMzQwMSA0LjEzNDAxIDEgOCAxQzExLjg2NiAxIDE1IDQuMTM0MDEgMTUgOFoiIGZpbGw9IndoaXRlIi8+PHBhdGggaWQ9IkVsbGlwc2UgMi4zIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTggMTRDMTEuMzEzNyAxNCAxNCAxMS4zMTM3IDE0IDhDMTQgNC42ODYyOSAxMS4zMTM3IDIgOCAyQzQuNjg2MjkgMiAyIDQuNjg2MjkgMiA4QzIgMTEuMzEzNyA0LjY4NjI5IDE0IDggMTRaTTggMTVDMTEuODY2IDE1IDE1IDExLjg2NiAxNSA4QzE1IDQuMTM0MDEgMTEuODY2IDEgOCAxQzQuMTM0MDEgMSAxIDQuMTM0MDEgMSA4QzEgMTEuODY2IDQuMTM0MDEgMTUgOCAxNVoiIGZpbGw9IiMzMTMxMzEiLz48cGF0aCBpZD0iRWxsaXBzZSAyLjQiIGQ9Ik04IDJDNy4yMTIwNyAyIDYuNDMxODUgMi4xNTUyIDUuNzAzOSAyLjQ1NjcyQzQuOTc1OTUgMi43NTgyNSA0LjMxNDUxIDMuMjAwMjEgMy43NTczNiAzLjc1NzM2QzMuMjAwMjEgNC4zMTQ1MSAyLjc1ODI1IDQuOTc1OTUgMi40NTY3MiA1LjcwMzlDMi4xNTUxOSA2LjQzMTg1IDIgNy4yMTIwNyAyIDhDMiA4Ljc4NzkzIDIuMTU1MTkgOS41NjgxNSAyLjQ1NjcyIDEwLjI5NjFDMi43NTgyNSAxMS4wMjQxIDMuMjAwMjEgMTEuNjg1NSAzLjc1NzM2IDEyLjI0MjZDNC4zMTQ1MSAxMi43OTk4IDQuOTc1OTUgMTMuMjQxNyA1LjcwMzkgMTMuNTQzM0M2LjQzMTg1IDEzLjg0NDggNy4yMTIwNyAxNCA4IDE0TDggOEw4IDJaIiBmaWxsPSIjNTA1MDUwIi8+PC9nPjwvc3ZnPg==';
	var iCircleBlack = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLWJsYWtjIj48ZyBpZD0iRWxsaXBzZSI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIGZpbGw9IiM1MDUwNTAiLz48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNi41IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9nPjwvZz48L3N2Zz4=';
	var iCircleGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLWdyYXkiPjxnIGlkPSJFbGxpcHNlIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNyIgZmlsbD0iI0IxQjFCMSIvPjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSI2LjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjIiLz48L2c+PC9nPjwvc3ZnPg==';
	var iCircleGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLWdyZWVuIj48cGF0aCBpZD0iRWxsaXBzZSIgZD0iTTE1IDhDMTUgMTEuODY2IDExLjg2NiAxNSA4IDE1QzQuMTM0MDEgMTUgMSAxMS44NjYgMSA4QzEgNC4xMzQwMSA0LjEzNDAxIDEgOCAxQzExLjg2NiAxIDE1IDQuMTM0MDEgMTUgOFoiIGZpbGw9IiM2OEE0OTAiLz48cGF0aCBpZD0iRWxsaXBzZSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDE0QzExLjMxMzcgMTQgMTQgMTEuMzEzNyAxNCA4QzE0IDQuNjg2MjkgMTEuMzEzNyAyIDggMkM0LjY4NjI5IDIgMiA0LjY4NjI5IDIgOEMyIDExLjMxMzcgNC42ODYyOSAxNCA4IDE0Wk04IDE1QzExLjg2NiAxNSAxNSAxMS44NjYgMTUgOEMxNSA0LjEzNDAxIDExLjg2NiAxIDggMUM0LjEzNDAxIDEgMSA0LjEzNDAxIDEgOEMxIDExLjg2NiA0LjEzNDAxIDE1IDggMTVaIiBmaWxsPSIjMzI2RjVCIi8+PC9nPjwvc3ZnPg==';
	var iCircleLightRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLWxpZ2h0IHJlZCI+PHBhdGggaWQ9IkVsbGlwc2UiIG9wYWNpdHk9IjAuNSIgZD0iTTEuNSA4QzEuNSA0LjQxMDE1IDQuNDEwMTUgMS41IDggMS41QzExLjU4OTkgMS41IDE0LjUgNC40MTAxNSAxNC41IDhDMTQuNSAxMS41ODk5IDExLjU4OTkgMTQuNSA4IDE0LjVDNC40MTAxNSAxNC41IDEuNSAxMS41ODk4IDEuNSA4WiIgZmlsbD0iI0Q2NTUzMiIgc3Ryb2tlPSIjOUUzNzFCIi8+PC9nPjwvc3ZnPg==';
	var iCircleOneWhiteQuarter = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLW9uZSB3aGl0ZSBxdWFydGVyIj48cGF0aCBpZD0iRWxsaXBzZSAyIiBkPSJNMTQuOTk5OSA3Ljk5OTk2QzE0Ljk5OTkgMTEuODY1OSAxMS44NjU5IDE0Ljk5OTkgNy45OTk5NiAxNC45OTk5QzQuMTMzOTkgMTQuOTk5OSAxIDExLjg2NTkgMSA3Ljk5OTk2QzEgNC4xMzM5OSA0LjEzMzk5IDEgNy45OTk5NiAxQzExLjg2NTkgMSAxNC45OTk5IDQuMTMzOTkgMTQuOTk5OSA3Ljk5OTk2WiIgZmlsbD0id2hpdGUiLz48cGF0aCBpZD0iRWxsaXBzZSAyIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuOTk5OTYgMTMuOTk5OUMxMS4zMTM3IDEzLjk5OTkgMTMuOTk5OSAxMS4zMTM3IDEzLjk5OTkgNy45OTk5NkMxMy45OTk5IDQuNjg2MjggMTEuMzEzNyAyIDcuOTk5OTYgMkM0LjY4NjI4IDIgMiA0LjY4NjI4IDIgNy45OTk5NkMyIDExLjMxMzcgNC42ODYyOCAxMy45OTk5IDcuOTk5OTYgMTMuOTk5OVpNNy45OTk5NiAxNC45OTk5QzExLjg2NTkgMTQuOTk5OSAxNC45OTk5IDExLjg2NTkgMTQuOTk5OSA3Ljk5OTk2QzE0Ljk5OTkgNC4xMzM5OSAxMS44NjU5IDEgNy45OTk5NiAxQzQuMTMzOTkgMSAxIDQuMTMzOTkgMSA3Ljk5OTk2QzEgMTEuODY1OSA0LjEzMzk5IDE0Ljk5OTkgNy45OTk5NiAxNC45OTk5WiIgZmlsbD0iIzMxMzEzMSIvPjxwYXRoIGlkPSJFbGxpcHNlIDIuMSIgZD0iTTIgOEMyIDkuMTg2NjkgMi4zNTE4OSAxMC4zNDY3IDMuMDExMTggMTEuMzMzNEMzLjY3MDQ3IDEyLjMyMDEgNC42MDc1NCAxMy4wODkxIDUuNzAzOSAxMy41NDMzQzYuODAwMjUgMTMuOTk3NCA4LjAwNjY1IDE0LjExNjIgOS4xNzA1NCAxMy44ODQ3QzEwLjMzNDQgMTMuNjUzMiAxMS40MDM1IDEzLjA4MTggMTIuMjQyNiAxMi4yNDI2QzEzLjA4MTggMTEuNDAzNSAxMy42NTMyIDEwLjMzNDQgMTMuODg0NyA5LjE3MDU0QzE0LjExNjIgOC4wMDY2NiAxMy45OTc0IDYuODAwMjYgMTMuNTQzMyA1LjcwMzlDMTMuMDg5MSA0LjYwNzU0IDEyLjMyMDEgMy42NzA0NyAxMS4zMzM0IDMuMDExMThDMTAuMzQ2NyAyLjM1MTg5IDkuMTg2NjkgMiA4IDJMOCA4TDIgOFoiIGZpbGw9IiM1MDUwNTAiLz48L2c+PC9zdmc+';
	var iCircleRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLXJlZCI+PHBhdGggaWQ9IkVsbGlwc2UiIGQ9Ik0xNSA4QzE1IDExLjg2NiAxMS44NjYgMTUgOCAxNUM0LjEzNDAxIDE1IDEgMTEuODY2IDEgOEMxIDQuMTM0MDEgNC4xMzQwMSAxIDggMUMxMS44NjYgMSAxNSA0LjEzNDAxIDE1IDhaIiBmaWxsPSIjRDY1NTMyIi8+PHBhdGggaWQ9IkVsbGlwc2UgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAxNEMxMS4zMTM3IDE0IDE0IDExLjMxMzcgMTQgOEMxNCA0LjY4NjI5IDExLjMxMzcgMiA4IDJDNC42ODYyOSAyIDIgNC42ODYyOSAyIDhDMiAxMS4zMTM3IDQuNjg2MjkgMTQgOCAxNFpNOCAxNUMxMS44NjYgMTUgMTUgMTEuODY2IDE1IDhDMTUgNC4xMzQwMSAxMS44NjYgMSA4IDFDNC4xMzQwMSAxIDEgNC4xMzQwMSAxIDhDMSAxMS44NjYgNC4xMzQwMSAxNSA4IDE1WiIgZmlsbD0iIzlFMzcxQiIvPjwvZz48L3N2Zz4=';
	var iCircleThreeWhiteQuarters = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLXRocmVlIHdoaXRlIHF1YXJ0ZXJzIj48cGF0aCBpZD0iRWxsaXBzZSAyLjUiIGQ9Ik0xIDguMDAwMDVDMSA0LjEzNDAzIDQuMTM0MDMgMSA4LjAwMDA1IDFDMTEuODY2MSAxIDE1LjAwMDEgNC4xMzQwMyAxNS4wMDAxIDguMDAwMDVDMTUuMDAwMSAxMS44NjYxIDExLjg2NjEgMTUuMDAwMSA4LjAwMDA1IDE1LjAwMDFDNC4xMzQwMyAxNS4wMDAxIDEgMTEuODY2MSAxIDguMDAwMDVaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGlkPSJFbGxpcHNlIDIuNSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjAwMDA1IDJDNC42ODYzMSAyIDIgNC42ODYzMSAyIDguMDAwMDVDMiAxMS4zMTM4IDQuNjg2MzEgMTQuMDAwMSA4LjAwMDA1IDE0LjAwMDFDMTEuMzEzOCAxNC4wMDAxIDE0LjAwMDEgMTEuMzEzOCAxNC4wMDAxIDguMDAwMDVDMTQuMDAwMSA0LjY4NjMxIDExLjMxMzggMiA4LjAwMDA1IDJaTTguMDAwMDUgMUM0LjEzNDAzIDEgMSA0LjEzNDAzIDEgOC4wMDAwNUMxIDExLjg2NjEgNC4xMzQwMyAxNS4wMDAxIDguMDAwMDUgMTUuMDAwMUMxMS44NjYxIDE1LjAwMDEgMTUuMDAwMSAxMS44NjYxIDE1LjAwMDEgOC4wMDAwNUMxNS4wMDAxIDQuMTM0MDMgMTEuODY2MSAxIDguMDAwMDUgMVoiIGZpbGw9IiMzMTMxMzEiLz48cGF0aCBpZD0iRWxsaXBzZSAyLjYiIGQ9Ik0xNCA4QzE0IDcuMjEyMDcgMTMuODQ0OCA2LjQzMTg1IDEzLjU0MzMgNS43MDM5QzEzLjI0MTcgNC45NzU5NSAxMi43OTk4IDQuMzE0NTEgMTIuMjQyNiAzLjc1NzM2QzExLjY4NTUgMy4yMDAyMSAxMS4wMjQxIDIuNzU4MjUgMTAuMjk2MSAyLjQ1NjcyQzkuNTY4MTUgMi4xNTUxOSA4Ljc4NzkzIDIgOCAyTDggOEwxNCA4WiIgZmlsbD0iIzUwNTA1MCIvPjwvZz48L3N2Zz4=';
	var iCircleWhite = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLXdoaXRlIj48cGF0aCBpZD0iRWxsaXBzZSAyLjkiIGQ9Ik0xIDhDMSA0LjEzNDAxIDQuMTM0MDEgMSA4IDFDMTEuODY2IDEgMTUgNC4xMzQwMSAxNSA4QzE1IDExLjg2NiAxMS44NjYgMTUgOCAxNUM0LjEzNDAxIDE1IDAuOTk5OTk5IDExLjg2NiAxIDhaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGlkPSJFbGxpcHNlIDIuOSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDJDNC42ODYyOSAyIDIgNC42ODYyOSAyIDhDMiAxMS4zMTM3IDQuNjg2MjkgMTQgOCAxNEMxMS4zMTM3IDE0IDE0IDExLjMxMzcgMTQgOEMxNCA0LjY4NjI5IDExLjMxMzcgMiA4IDJaTTggMUM0LjEzNDAxIDEgMSA0LjEzNDAxIDEgOEMwLjk5OTk5OSAxMS44NjYgNC4xMzQwMSAxNSA4IDE1QzExLjg2NiAxNSAxNSAxMS44NjYgMTUgOEMxNSA0LjEzNDAxIDExLjg2NiAxIDggMVoiIGZpbGw9IiMzMTMxMzEiLz48L2c+PC9zdmc+';
	var iCircleYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ2lyY2xlLXllbGxvdyI+PHBhdGggaWQ9IkVsbGlwc2UiIGQ9Ik0xNSA4QzE1IDExLjg2NiAxMS44NjYgMTUgOCAxNUM0LjEzNDAxIDE1IDEgMTEuODY2IDEgOEMxIDQuMTM0MDEgNC4xMzQwMSAxIDggMUMxMS44NjYgMSAxNSA0LjEzNDAxIDE1IDhaIiBmaWxsPSIjRUFDMjgyIi8+PHBhdGggaWQ9IkVsbGlwc2UgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAxNEMxMS4zMTM3IDE0IDE0IDExLjMxMzcgMTQgOEMxNCA0LjY4NjI5IDExLjMxMzcgMiA4IDJDNC42ODYyOSAyIDIgNC42ODYyOSAyIDhDMiAxMS4zMTM3IDQuNjg2MjkgMTQgOCAxNFpNOCAxNUMxMS44NjYgMTUgMTUgMTEuODY2IDE1IDhDMTUgNC4xMzQwMSAxMS44NjYgMSA4IDFDNC4xMzQwMSAxIDEgNC4xMzQwMSAxIDhDMSAxMS44NjYgNC4xMzQwMSAxNSA4IDE1WiIgZmlsbD0iI0EyODAyRiIvPjwvZz48L3N2Zz4=';
	var iCrossRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ3Jvc3MtcmVkIj48cGF0aCBpZD0iRWxsaXBzZSIgZD0iTTE0Ljk5OTkgNy45OTk5NkMxNC45OTk5IDExLjg2NTkgMTEuODY1OSAxNC45OTk5IDcuOTk5OTYgMTQuOTk5OUM0LjEzMzk5IDE0Ljk5OTkgMSAxMS44NjU5IDEgNy45OTk5NkMxIDQuMTMzOTkgNC4xMzM5OSAxIDcuOTk5OTYgMUMxMS44NjU5IDEgMTQuOTk5OSA0LjEzMzk5IDE0Ljk5OTkgNy45OTk5NloiIGZpbGw9IiNENjU1MzIiLz48cGF0aCBpZD0iRWxsaXBzZSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ljk5OTk2IDEzLjk5OTlDMTEuMzEzNiAxMy45OTk5IDEzLjk5OTkgMTEuMzEzNiAxMy45OTk5IDcuOTk5OTZDMTMuOTk5OSA0LjY4NjI3IDExLjMxMzYgMiA3Ljk5OTk2IDJDNC42ODYyNyAyIDIgNC42ODYyNyAyIDcuOTk5OTZDMiAxMS4zMTM2IDQuNjg2MjcgMTMuOTk5OSA3Ljk5OTk2IDEzLjk5OTlaTTcuOTk5OTYgMTQuOTk5OUMxMS44NjU5IDE0Ljk5OTkgMTQuOTk5OSAxMS44NjU5IDE0Ljk5OTkgNy45OTk5NkMxNC45OTk5IDQuMTMzOTkgMTEuODY1OSAxIDcuOTk5OTYgMUM0LjEzMzk5IDEgMSA0LjEzMzk5IDEgNy45OTk5NkMxIDExLjg2NTkgNC4xMzM5OSAxNC45OTk5IDcuOTk5OTYgMTQuOTk5OVoiIGZpbGw9IiM5RTM3MUIiLz48cGF0aCBpZD0iVmVjdG9yIDQgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNi41ODU3OSA4TDQuMjkyODkgNS43MDcxMUw1LjcwNzExIDQuMjkyODlMOCA2LjU4NTc5TDEwLjI5MjkgNC4yOTI4OUwxMS43MDcxIDUuNzA3MTFMOS40MTQyMSA4TDExLjcwNzEgMTAuMjkyOUwxMC4yOTI5IDExLjcwNzFMOCA5LjQxNDIxTDUuNzA3MTEgMTEuNzA3MUw0LjI5Mjg5IDEwLjI5MjlMNi41ODU3OSA4WiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+';
	var iCrossSymbolRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iQ3Jvc3Mtc3ltYm9sLXJlZCI+PHBhdGggaWQ9IlZlY3RvciA0LjEgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNi4xOTczNSA4TDIgMy44MDI2NUwzLjgwMjY1IDJMOCA2LjE5NzM1TDEyLjE5NzMgMkwxNCAzLjgwMjY1TDkuODAyNjUgOEwxNCAxMi4xOTczTDEyLjE5NzMgMTRMOCA5LjgwMjY1TDMuODAyNjUgMTRMMiAxMi4xOTczTDYuMTk3MzUgOFoiIGZpbGw9IiNENjU1MzIiLz48cGF0aCBpZD0iVmVjdG9yIDQuMSAoU3Ryb2tlKSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zLjgwMjY1IDEuMjkyODlMOCA1LjQ5MDI0TDEyLjE5NzMgMS4yOTI4OUwxNC43MDcxIDMuODAyNjVMMTAuNTA5OCA4TDE0LjcwNzEgMTIuMTk3M0wxMi4xOTczIDE0LjcwNzFMOCAxMC41MDk4TDMuODAyNjUgMTQuNzA3MUwxLjI5Mjg5IDEyLjE5NzNMNS40OTAyNCA4TDEuMjkyODkgMy44MDI2NUwzLjgwMjY1IDEuMjkyODlaTTIuNzA3MTEgMy44MDI2NUw2LjkwNDQ1IDhMMi43MDcxMSAxMi4xOTczTDMuODAyNjUgMTMuMjkyOUw4IDkuMDk1NTVMMTIuMTk3MyAxMy4yOTI5TDEzLjI5MjkgMTIuMTk3M0w5LjA5NTU0IDhMMTMuMjkyOSAzLjgwMjY1TDEyLjE5NzMgMi43MDcxMUw4IDYuOTA0NDVMMy44MDI2NSAyLjcwNzExTDIuNzA3MTEgMy44MDI2NVoiIGZpbGw9IiM5RTM3MUIiLz48L2c+PC9zdmc+';
	var iDashYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRGFzaC15ZWxsb3ciPjxwYXRoIGlkPSJSZWN0YW5nbGUiIGQ9Ik0xIDVIMTVWMTFIMVY1WiIgZmlsbD0iI0VBQzI4MiIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQgNkgyVjEwSDE0VjZaTTEgNVYxMUgxNVY1SDFaIiBmaWxsPSIjQUY5MDQ1Ii8+PC9nPjwvc3ZnPg==';
	var iDiamondRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRGlhbW9uZC1yZWQiPjxyZWN0IGlkPSJSZWN0YW5nbGUgMi40IiB4PSI4IiB5PSIxLjcwNzExIiB3aWR0aD0iOC44OTk1IiBoZWlnaHQ9IjguODk5NSIgcng9IjEuNSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgOCAxLjcwNzExKSIgZmlsbD0iI0Q2NTUzMiIgc3Ryb2tlPSIjOUUzODFDIi8+PC9nPjwvc3ZnPg==';
	var iDown = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRG93biI+PHBhdGggaWQ9IlVuaW9uIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNkwyIDEwLjVMMiA0LjVMNiA3LjdMNiAwLjk5OTk5OUwxMSAxTDExIDcuN0wxNSA0LjVMMTUgMTAuNUw4LjUgMTZaIiBmaWxsPSIjRDY1NTMyIi8+PHBhdGggaWQ9IlVuaW9uIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgNC41TDIgMTAuNUw4LjUgMTZMMTUgMTAuNUwxNSA0LjVMMTEgNy43TDExIDFMNiAwLjk5OTk5OUw2IDcuN0wyIDQuNVpNNyAyTDcgOS43ODA2MkwzIDYuNTgwNjJMMyAxMC4wMzYyTDguNSAxNC42OUwxNCAxMC4wMzYyTDE0IDYuNTgwNjJMMTAgOS43ODA2M0wxMCAyTDcgMloiIGZpbGw9IiM5RTM4MUMiLz48L2c+PC9zdmc+';
	var iDownGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRG93bi1ncmF5Ij48cGF0aCBpZD0iVW5pb24iIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC41IDE2TDIgMTAuNUwyIDQuNUw2IDcuN0w2IDAuOTk5OTk5TDExIDFMMTEgNy43TDE1IDQuNUwxNSAxMC41TDguNSAxNloiIGZpbGw9IiM4MDgwODAiLz48cGF0aCBpZD0iVW5pb24gKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMiA0LjVMMiAxMC41TDguNSAxNkwxNSAxMC41TDE1IDQuNUwxMSA3LjdMMTEgMUw2IDAuOTk5OTk5TDYgNy43TDIgNC41Wk03IDJMNyA5Ljc4MDYyTDMgNi41ODA2MkwzIDEwLjAzNjJMOC41IDE0LjY5TDE0IDEwLjAzNjJMMTQgNi41ODA2MkwxMCA5Ljc4MDYzTDEwIDJMNyAyWiIgZmlsbD0iIzY0NjI2MiIvPjwvZz48L3N2Zz4=';
	var iDownIncline = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRG93bkluY2xpbmUiPjxwYXRoIGlkPSJVbmlvbiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA1Ljk5OTk4TDE1IDE1TDYgMTVMMSA5Ljk5OTk4TDYuMTEwODYgOS45OTk5OEwwLjk5OTk1IDQuODg5MDdMNC44ODkwNCAwLjk5OTk4M0wxMCA2LjExMDk1TDEwIDAuOTk5OTg0TDE1IDUuOTk5OThaIiBmaWxsPSIjRUFDMjgyIi8+PHBhdGggaWQ9IlVuaW9uIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEgOS45OTk5OEw2IDE1TDE1IDE1TDE1IDUuOTk5OThMMTAgMC45OTk5ODRMMTAgNi4xMTA5NUw0Ljg4OTA0IDAuOTk5OTgzTDAuOTk5OTUgNC44ODkwN0w2LjExMDg2IDkuOTk5OThMMSA5Ljk5OTk4Wk0yLjQxNDE2IDQuODg5MDdMOC41MjUwNyAxMUwzLjQxNDIxIDExTDYuNDE0MjEgMTRMMTQgMTRMMTQgNi40MTQyTDExIDMuNDE0MkwxMSA4LjUyNTE2TDQuODg5MDQgMi40MTQyTDIuNDE0MTYgNC44ODkwN1oiIGZpbGw9IiNBNDgwMkIiLz48L2c+PC9zdmc+';
	var iDownInclineGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRG93bkluY2xpbmUtZ3JheSI+PHBhdGggaWQ9IlVuaW9uIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1IDUuOTk5OThMMTUgMTVMNiAxNUwxIDkuOTk5OThMNi4xMTA4NiA5Ljk5OTk4TDAuOTk5OTUgNC44ODkwN0w0Ljg4OTA0IDAuOTk5OTgzTDEwIDYuMTEwOTVMMTAgMC45OTk5ODRMMTUgNS45OTk5OFoiIGZpbGw9IiM4MDgwODAiLz48cGF0aCBpZD0iVW5pb24gKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMSA5Ljk5OTk4TDYgMTVMMTUgMTVMMTUgNS45OTk5OEwxMCAwLjk5OTk4NEwxMCA2LjExMDk1TDQuODg5MDQgMC45OTk5ODNMMC45OTk5NSA0Ljg4OTA3TDYuMTEwODYgOS45OTk5OEwxIDkuOTk5OThaTTIuNDE0MTYgNC44ODkwN0w4LjUyNTA3IDExTDMuNDE0MjEgMTFMNi40MTQyMSAxNEwxNCAxNEwxNCA2LjQxNDJMMTEgMy40MTQyTDExIDguNTI1MTZMNC44ODkwNCAyLjQxNDJMMi40MTQxNiA0Ljg4OTA3WiIgZmlsbD0iIzY0NjI2MiIvPjwvZz48L3N2Zz4=';
	var iExclamationSymbolYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRXhjbGFtYXRpb24tc3ltYm9sLXllbGxvdyI+PHBhdGggaWQ9IiEiIGQ9Ik03LjI3MTUyIDkuMjE5MjlMNy4wNTk2IDUuNzM5MUM3LjAxOTg3IDUuMDYwOTkgNyA0LjU3NDIgNyA0LjI3ODczQzcgMy44NzY3MSA3LjA5NDkyIDMuNTY0MjkgNy4yODQ3NyAzLjM0MTQ4QzcuNDc5MDMgMy4xMTM4MyA3LjczMjg5IDMgOC4wNDYzNiAzQzguNDI2MDUgMyA4LjY3OTkxIDMuMTQ1MzEgOC44MDc5NSAzLjQzNTkzQzguOTM1OTggMy43MjE3MSA5IDQuMTM1ODQgOSA0LjY3ODM0QzkgNC45OTgwMiA4Ljk4NDU1IDUuMzIyNTQgOC45NTM2NCA1LjY1MTkyTDguNjY4ODcgOS4yMzM4MkM4LjYzNzk3IDkuNjYwMDYgOC41NzE3NCA5Ljk4NzAxIDguNDcwMiAxMC4yMTQ3QzguMzY4NjUgMTAuNDQyMyA4LjIwMDg4IDEwLjU1NjEgNy45NjY4OSAxMC41NTYxQzcuNzI4NDggMTAuNTU2MSA3LjU2MjkxIDEwLjQ0NzIgNy40NzAyIDEwLjIyOTJDNy4zNzc0OCAxMC4wMDY0IDcuMzExMjYgOS42Njk3NSA3LjI3MTUyIDkuMjE5MjlaTTguMDA2NjIgMTRDNy43MzczMSAxNCA3LjUwMTEgMTMuOTA1NSA3LjI5ODAxIDEzLjcxNjZDNy4wOTkzNCAxMy41MjI5IDcgMTMuMjU0MSA3IDEyLjkxMDJDNyAxMi42MDk5IDcuMDk0OTIgMTIuMzU1NiA3LjI4NDc3IDEyLjE0NzNDNy40NzkwMyAxMS45MzQyIDcuNzE1MjMgMTEuODI3NiA3Ljk5MzM4IDExLjgyNzZDOC4yNzE1MiAxMS44Mjc2IDguNTA3NzMgMTEuOTM0MiA4LjcwMTk5IDEyLjE0NzNDOC45MDA2NiAxMi4zNTU2IDkgMTIuNjA5OSA5IDEyLjkxMDJDOSAxMy4yNDkyIDguOTAwNjYgMTMuNTE1NiA4LjcwMTk5IDEzLjcwOTRDOC41MDMzMSAxMy45MDMxIDguMjcxNTIgMTQgOC4wMDY2MiAxNFoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBpZD0iISAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjI3NDIgOS4yOTM2Mkw2LjA2MTMxIDUuNzk3NkM2LjAyMTUxIDUuMTE4MzcgNiA0LjYwNjA2IDYgNC4yNzg3M0M2IDMuNzI3NjUgNi4xMzA0OCAzLjE1NDMgNi41MjM2IDIuNjkyOTJDNi45MTc5MiAyLjIzMDgyIDcuNDU2MDcgMiA4LjA0NjM2IDJDOC4zNTk4MyAyIDguNzAxNTEgMi4wNTk3OCA5LjAxODMgMi4yNDExQzkuMzQ1ODkgMi40Mjg2MiA5LjU3OTIzIDIuNzA3ODEgOS43MjE3NSAzLjAyOTc4QzkuOTM0MDcgMy41MDUzIDEwIDQuMDg0NDkgMTAgNC42NzgzNEMxMCA1LjAyNzkxIDkuOTgzMjEgNS4zODEyMSA5Ljk0OTk1IDUuNzM4MUw5LjY2NTk5IDkuMzA5NzNDOS42MzE2NyA5Ljc4IDkuNTUzOTIgMTAuMjM5OSA5LjM4MzQ2IDEwLjYyMkM5LjMwNTAyIDEwLjc5NzkgOS4xOTI4MiAxMC45NzU1IDkuMDM1ODQgMTEuMTI5NUM5LjE3OTg0IDExLjIyMiA5LjMxMjk1IDExLjMzNDUgOS40MzMzNyAxMS40NjUzQzkuODEyNTcgMTEuODY2OSAxMCAxMi4zNjg4IDEwIDEyLjkxMDJDMTAgMTMuNDU0OSA5LjgzMzIyIDE0LjAwMyA5LjQwMDE2IDE0LjQyNTNDOS4wMjQ1OCAxNC43OTE2IDguNTQ1ODQgMTUgOC4wMDY2MiAxNUM3LjQ3NjM3IDE1IDYuOTk4OTUgMTQuODA0MiA2LjYxNjk0IDE0LjQ0ODlMNi42MDgzIDE0LjQ0MDhMNi41OTk4NCAxNC40MzI2QzYuMTY0MDQgMTQuMDA3NiA2IDEzLjQ1NTEgNiAxMi45MTAyQzYgMTIuMzc4NSA2LjE3NjMyIDExLjg3ODkgNi41NDU3MSAxMS40NzM2QzYuNjU4MjggMTEuMzUwMSA2Ljc4MjA2IDExLjI0MjcgNi45MTU1OCAxMS4xNTI3QzYuNzQ3OTMgMTAuOTk0NiA2LjYyOTc0IDEwLjgwODEgNi41NDk5OSAxMC42MjA2TDYuNTQ2OTEgMTAuNjEzNEM2LjM5NDI4IDEwLjI0NjYgNi4zMTc3MSA5Ljc4Njk0IDYuMjc1MzkgOS4zMDcxNkw2LjI3NDIgOS4yOTM2MlpNOC43MDE5OSAxMi4xNDczQzguNTA3NzMgMTEuOTM0MiA4LjI3MTUyIDExLjgyNzYgNy45OTMzOCAxMS44Mjc2QzcuNzE1MjMgMTEuODI3NiA3LjQ3OTAzIDExLjkzNDIgNy4yODQ3NyAxMi4xNDczQzcuMDk0OTIgMTIuMzU1NiA3IDEyLjYwOTkgNyAxMi45MTAyQzcgMTMuMjU0MSA3LjA5OTM0IDEzLjUyMjkgNy4yOTgwMSAxMy43MTY2QzcuNTAxMSAxMy45MDU1IDcuNzM3MzEgMTQgOC4wMDY2MiAxNEM4LjI3MTUyIDE0IDguNTAzMzEgMTMuOTAzMSA4LjcwMTk5IDEzLjcwOTRDOC45MDA2NiAxMy41MTU2IDkgMTMuMjQ5MiA5IDEyLjkxMDJDOSAxMi42MDk5IDguOTAwNjYgMTIuMzU1NiA4LjcwMTk5IDEyLjE0NzNaTTguNjY4ODcgOS4yMzM4Mkw4Ljk1MzY0IDUuNjUxOTJDOC45ODQ1NSA1LjMyMjU1IDkgNC45OTgwMiA5IDQuNjc4MzRDOSA0LjEzNTg0IDguOTM1OTggMy43MjE3MSA4LjgwNzk1IDMuNDM1OTNDOC42Nzk5MSAzLjE0NTMxIDguNDI2MDUgMyA4LjA0NjM2IDNDNy43MzI4OSAzIDcuNDc5MDMgMy4xMTM4MyA3LjI4NDc3IDMuMzQxNDhDNy4wOTQ5MiAzLjU2NDI5IDcgMy44NzY3MSA3IDQuMjc4NzNDNyA0LjU3NDIgNy4wMTk4NyA1LjA2MDk5IDcuMDU5NiA1LjczOTFMNy4yNzE1MiA5LjIxOTI5QzcuMzExMjYgOS42Njk3NSA3LjM3NzQ4IDEwLjAwNjQgNy40NzAyIDEwLjIyOTJDNy41NjI5MSAxMC40NDcyIDcuNzI4NDggMTAuNTU2MSA3Ljk2Njg5IDEwLjU1NjFDOC4yMDA4OCAxMC41NTYxIDguMzY4NjUgMTAuNDQyMyA4LjQ3MDIgMTAuMjE0N0M4LjU3MTc0IDkuOTg3MDEgOC42Mzc5NyA5LjY2MDA2IDguNjY4ODcgOS4yMzM4MloiIGZpbGw9IiNBMjgwMkYiLz48L2c+PC9zdmc+';
	var iExclamationYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRXhjbGFtYXRpb24teWVsbG93Ij48cGF0aCBpZD0iRWxsaXBzZSIgZD0iTTE1IDhDMTUgMTEuODY2IDExLjg2NiAxNSA4IDE1QzQuMTM0MDEgMTUgMSAxMS44NjYgMSA4QzEgNC4xMzQwMSA0LjEzNDAxIDEgOCAxQzExLjg2NiAxIDE1IDQuMTM0MDEgMTUgOFoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBpZD0iRWxsaXBzZSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDE0QzExLjMxMzcgMTQgMTQgMTEuMzEzNyAxNCA4QzE0IDQuNjg2MjkgMTEuMzEzNyAyIDggMkM0LjY4NjI5IDIgMiA0LjY4NjI5IDIgOEMyIDExLjMxMzcgNC42ODYyOSAxNCA4IDE0Wk04IDE1QzExLjg2NiAxNSAxNSAxMS44NjYgMTUgOEMxNSA0LjEzNDAxIDExLjg2NiAxIDggMUM0LjEzNDAxIDEgMSA0LjEzNDAxIDEgOEMxIDExLjg2NiA0LjEzNDAxIDE1IDggMTVaIiBmaWxsPSIjQTI4MDJGIi8+PHBhdGggaWQ9IiEiIGQ9Ik03LjI3MTUyIDguNjUzOUw3LjA1OTYgNS40OTAwOUM3LjAxOTg3IDQuODczNjIgNyA0LjQzMTA5IDcgNC4xNjI0OEM3IDMuNzk3MDEgNy4wOTQ5MiAzLjUxMjk5IDcuMjg0NzcgMy4zMTA0NEM3LjQ3OTAzIDMuMTAzNDggNy43MzI4OSAzIDguMDQ2MzYgM0M4LjQyNjA1IDMgOC42Nzk5MSAzLjEzMjEgOC44MDc5NSAzLjM5NjNDOC45MzU5OCAzLjY1NjEgOSA0LjAzMjU4IDkgNC41MjU3NkM5IDQuODE2MzggOC45ODQ1NSA1LjExMTQgOC45NTM2NCA1LjQxMDgzTDguNjY4ODcgOC42NjcxMUM4LjYzNzk3IDkuMDU0NiA4LjU3MTc0IDkuMzUxODMgOC40NzAyIDkuNTU4NzhDOC4zNjg2NSA5Ljc2NTc0IDguMjAwODggOS44NjkyMiA3Ljk2Njg5IDkuODY5MjJDNy43Mjg0OCA5Ljg2OTIyIDcuNTYyOTEgOS43NzAxNSA3LjQ3MDIgOS41NzE5OUM3LjM3NzQ4IDkuMzY5NDQgNy4zMTEyNiA5LjA2MzQxIDcuMjcxNTIgOC42NTM5Wk04LjAwNjYyIDEzQzcuNzM3MzEgMTMgNy41MDExIDEyLjkxNDEgNy4yOTgwMSAxMi43NDI0QzcuMDk5MzQgMTIuNTY2MyA3IDEyLjMyMTkgNyAxMi4wMDkyQzcgMTEuNzM2MiA3LjA5NDkyIDExLjUwNTEgNy4yODQ3NyAxMS4zMTU3QzcuNDc5MDMgMTEuMTIyIDcuNzE1MjMgMTEuMDI1MSA3Ljk5MzM4IDExLjAyNTFDOC4yNzE1MiAxMS4wMjUxIDguNTA3NzMgMTEuMTIyIDguNzAxOTkgMTEuMzE1N0M4LjkwMDY2IDExLjUwNTEgOSAxMS43MzYyIDkgMTIuMDA5MkM5IDEyLjMxNzUgOC45MDA2NiAxMi41NTk3IDguNzAxOTkgMTIuNzM1OEM4LjUwMzMxIDEyLjkxMTkgOC4yNzE1MiAxMyA4LjAwNjYyIDEzWiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+';
	var iFlagGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRmxhZy1ncmVlbiI+PHBhdGggaWQ9IlZlY3RvciAyLjMiIGQ9Ik01IDFMNSAxMEwxNCA1LjVMNSAxWiIgZmlsbD0iIzY4QTQ5MCIvPjxwYXRoIGlkPSJWZWN0b3IgMi4zIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUgMTBMMTQgNS41TDUgMUw1IDEwWk02IDguMzgxOTdMMTEuNzYzOSA1LjVMNiAyLjYxODAzTDYgOC4zODE5N1oiIGZpbGw9IiMzMjZGNUIiLz48cmVjdCBpZD0iUmVjdGFuZ2xlIDIiIHg9IjIiIHk9IjAuOTk5OTk2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgZmlsbD0iIzcyNzI3MiIvPjwvZz48L3N2Zz4=';
	var iFlagRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRmxhZy1yZWQiPjxwYXRoIGlkPSJWZWN0b3IgMi4zIiBkPSJNNSAxTDUgMTBMMTQgNS41TDUgMVoiIGZpbGw9IiNENjU1MzIiLz48cGF0aCBpZD0iVmVjdG9yIDIuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDEwTDE0IDUuNUw1IDFMNSAxMFpNNiA4LjM4MTk3TDExLjc2MzkgNS41TDYgMi42MTgwM0w2IDguMzgxOTdaIiBmaWxsPSIjOUUzNzFCIi8+PHJlY3QgaWQ9IlJlY3RhbmdsZSAyIiB4PSIyIiB5PSIwLjk5OTk5NiIgd2lkdGg9IjIiIGhlaWdodD0iMTQiIGZpbGw9IiM3MjcyNzIiLz48L2c+PC9zdmc+';
	var iFlagYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRmxhZy15ZWxsb3ciPjxwYXRoIGlkPSJWZWN0b3IgMi4zIiBkPSJNNSAxTDUgMTBMMTQgNS41TDUgMVoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBpZD0iVmVjdG9yIDIuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDEwTDE0IDUuNUw1IDFMNSAxMFpNNiA4LjM4MTk3TDExLjc2MzkgNS41TDYgMi42MTgwM0w2IDguMzgxOTdaIiBmaWxsPSIjQTI4MDJGIi8+PHJlY3QgaWQ9IlJlY3RhbmdsZSAyIiB4PSIyIiB5PSIwLjk5OTk5NiIgd2lkdGg9IjIiIGhlaWdodD0iMTQiIGZpbGw9IiM3MjcyNzIiLz48L2c+PC9zdmc+';
	var iFourFilledBars = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRm91ciBmaWxsZWQgYmFycyI+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEiIGQ9Ik00IDdIOFYxNUg0VjdaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyA4SDVWMTRIN1Y4Wk00IDdWMTVIOFY3SDRaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMiIGQ9Ik0xIDEwSDVWMTVIMVYxMFoiIGZpbGw9IiM0QTdEQjEiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNCAxMUgyVjE0SDRWMTFaTTEgMTBWMTVINVYxMEgxWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjMiIGQ9Ik0xMCAxSDE0VjE1SDEwVjFaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjMgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMgMkgxMVYxNEgxM1YyWk0xMCAxVjE1SDE0VjFIMTBaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMiIgZD0iTTcgNEgxMVYxNUg3VjRaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjIgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgNUg4VjE0SDEwVjVaTTcgNFYxNUgxMVY0SDdaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L2c+PC9zdmc+';
	var iFourFilledBoxes = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iRnVsbCBmaWxsZWQgYm94ZXMiPjxwYXRoIGlkPSJSZWN0YW5nbGUgMyIgZD0iTTAgM0MwIDEuODk1NDMgMC44OTU0MzEgMSAyIDFINkM3LjEwNDU3IDEgOCAxLjg5NTQzIDggM1Y3QzggOC4xMDQ1NyA3LjEwNDU3IDkgNiA5SDJDMC44OTU0MzEgOSAwIDguMTA0NTcgMCA3VjNaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYgMkgyQzEuNDQ3NzIgMiAxIDIuNDQ3NzIgMSAzVjdDMSA3LjU1MjI4IDEuNDQ3NzIgOCAyIDhINkM2LjU1MjI4IDggNyA3LjU1MjI4IDcgN1YzQzcgMi40NDc3MiA2LjU1MjI4IDIgNiAyWk0yIDFDMC44OTU0MzEgMSAwIDEuODk1NDMgMCAzVjdDMCA4LjEwNDU3IDAuODk1NDMxIDkgMiA5SDZDNy4xMDQ1NyA5IDggOC4xMDQ1NyA4IDdWM0M4IDEuODk1NDMgNy4xMDQ1NyAxIDYgMUgyWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEiIGQ9Ik03IDNDNyAxLjg5NTQzIDcuODk1NDMgMSA5IDFIMTNDMTQuMTA0NiAxIDE1IDEuODk1NDMgMTUgM1Y3QzE1IDguMTA0NTcgMTQuMTA0NiA5IDEzIDlIOUM3Ljg5NTQzIDkgNyA4LjEwNDU3IDcgN1YzWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDJIOUM4LjQ0NzcyIDIgOCAyLjQ0NzcyIDggM1Y3QzggNy41NTIyOCA4LjQ0NzcyIDggOSA4SDEzQzEzLjU1MjMgOCAxNCA3LjU1MjI4IDE0IDdWM0MxNCAyLjQ0NzcyIDEzLjU1MjMgMiAxMyAyWk05IDFDNy44OTU0MyAxIDcgMS44OTU0MyA3IDNWN0M3IDguMTA0NTcgNy44OTU0MyA5IDkgOUgxM0MxNC4xMDQ2IDkgMTUgOC4xMDQ1NyAxNSA3VjNDMTUgMS44OTU0MyAxNC4xMDQ2IDEgMTMgMUg5WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjIiIGQ9Ik0wIDEwQzAgOC44OTU0MyAwLjg5NTQzMSA4IDIgOEg2QzcuMTA0NTcgOCA4IDguODk1NDMgOCAxMFYxNEM4IDE1LjEwNDYgNy4xMDQ1NyAxNiA2IDE2SDJDMC44OTU0MzEgMTYgMCAxNS4xMDQ2IDAgMTRWMTBaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjIgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNiA5SDJDMS40NDc3MiA5IDEgOS40NDc3MiAxIDEwVjE0QzEgMTQuNTUyMyAxLjQ0NzcyIDE1IDIgMTVINkM2LjU1MjI4IDE1IDcgMTQuNTUyMyA3IDE0VjEwQzcgOS40NDc3MiA2LjU1MjI4IDkgNiA5Wk0yIDhDMC44OTU0MzEgOCAwIDguODk1NDMgMCAxMFYxNEMwIDE1LjEwNDYgMC44OTU0MzEgMTYgMiAxNkg2QzcuMTA0NTcgMTYgOCAxNS4xMDQ2IDggMTRWMTBDOCA4Ljg5NTQzIDcuMTA0NTcgOCA2IDhIMloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIiBkPSJNNyAxMEM3IDguODk1NDMgNy44OTU0MyA4IDkgOEgxM0MxNC4xMDQ2IDggMTUgOC44OTU0MyAxNSAxMFYxNEMxNSAxNS4xMDQ2IDE0LjEwNDYgMTYgMTMgMTZIOUM3Ljg5NTQzIDE2IDcgMTUuMTA0NiA3IDE0VjEwWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDlIOUM4LjQ0NzcyIDkgOCA5LjQ0NzcyIDggMTBWMTRDOCAxNC41NTIzIDguNDQ3NzIgMTUgOSAxNUgxM0MxMy41NTIzIDE1IDE0IDE0LjU1MjMgMTQgMTRWMTBDMTQgOS40NDc3MiAxMy41NTIzIDkgMTMgOVpNOSA4QzcuODk1NDMgOCA3IDguODk1NDMgNyAxMFYxNEM3IDE1LjEwNDYgNy44OTU0MyAxNiA5IDE2SDEzQzE0LjEwNDYgMTYgMTUgMTUuMTA0NiAxNSAxNFYxMEMxNSA4Ljg5NTQzIDE0LjEwNDYgOCAxMyA4SDlaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L2c+PC9zdmc+';
	var iOneFilledBars = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iT25lIGZpbGxlZCBiYXJzIj48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMSIgZD0iTTQgN0g4VjE1SDRWN1oiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03IDhINVYxNEg3VjhaTTQgN1YxNUg4VjdINFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMyIgZD0iTTEgMTBINVYxNUgxVjEwWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00IDExSDJWMTRINFYxMVpNMSAxMFYxNUg1VjEwSDFaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyIgZD0iTTEwIDFIMTRWMTVIMTBWMVoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAySDExVjE0SDEzVjJaTTEwIDFWMTVIMTRWMUgxMFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIiBkPSJNNyA0SDExVjE1SDdWNFoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCA1SDhWMTRIMTBWNVpNNyA0VjE1SDExVjRIN1oiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjwvZz48L3N2Zz4=';
	var iOneFilledBoxes = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iT25lIGZpbGxlZCBib3hlcyI+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEiIGQ9Ik03IDNDNyAxLjg5NTQzIDcuODk1NDMgMSA5IDFIMTNDMTQuMTA0NiAxIDE1IDEuODk1NDMgMTUgM1Y3QzE1IDguMTA0NTcgMTQuMTA0NiA5IDEzIDlIOUM3Ljg5NTQzIDkgNyA4LjEwNDU3IDcgN1YzWiIgZmlsbD0iI0IzQjNCMyIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDJIOUM4LjQ0NzcyIDIgOCAyLjQ0NzcyIDggM1Y3QzggNy41NTIyOCA4LjQ0NzcyIDggOSA4SDEzQzEzLjU1MjMgOCAxNCA3LjU1MjI4IDE0IDdWM0MxNCAyLjQ0NzcyIDEzLjU1MjMgMiAxMyAyWk05IDFDNy44OTU0MyAxIDcgMS44OTU0MyA3IDNWN0M3IDguMTA0NTcgNy44OTU0MyA5IDkgOUgxM0MxNC4xMDQ2IDkgMTUgOC4xMDQ1NyAxNSA3VjNDMTUgMS44OTU0MyAxNC4xMDQ2IDEgMTMgMUg5WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjQiIGQ9Ik0wIDNDMCAxLjg5NTQzIDAuODk1NDMxIDEgMiAxSDZDNy4xMDQ1NyAxIDggMS44OTU0MyA4IDNWN0M4IDguMTA0NTcgNy4xMDQ1NyA5IDYgOUgyQzAuODk1NDMxIDkgMCA4LjEwNDU3IDAgN1YzWiIgZmlsbD0iI0IzQjNCMyIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy40IChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYgMkgyQzEuNDQ3NzIgMiAxIDIuNDQ3NzIgMSAzVjdDMSA3LjU1MjI4IDEuNDQ3NzIgOCAyIDhINkM2LjU1MjI4IDggNyA3LjU1MjI4IDcgN1YzQzcgMi40NDc3MiA2LjU1MjI4IDIgNiAyWk0yIDFDMC44OTU0MzEgMSAwIDEuODk1NDMgMCAzVjdDMCA4LjEwNDU3IDAuODk1NDMxIDkgMiA5SDZDNy4xMDQ1NyA5IDggOC4xMDQ1NyA4IDdWM0M4IDEuODk1NDMgNy4xMDQ1NyAxIDYgMUgyWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjUiIGQ9Ik0wIDEwQzAgOC44OTU0MyAwLjg5NTQzMSA4IDIgOEg2QzcuMTA0NTcgOCA4IDguODk1NDMgOCAxMFYxNEM4IDE1LjEwNDYgNy4xMDQ1NyAxNiA2IDE2SDJDMC44OTU0MzEgMTYgMCAxNS4xMDQ2IDAgMTRWMTBaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjUgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNiA5SDJDMS40NDc3MiA5IDEgOS40NDc3MiAxIDEwVjE0QzEgMTQuNTUyMyAxLjQ0NzcyIDE1IDIgMTVINkM2LjU1MjI4IDE1IDcgMTQuNTUyMyA3IDE0VjEwQzcgOS40NDc3MiA2LjU1MjI4IDkgNiA5Wk0yIDhDMC44OTU0MzEgOCAwIDguODk1NDMgMCAxMFYxNEMwIDE1LjEwNDYgMC44OTU0MzEgMTYgMiAxNkg2QzcuMTA0NTcgMTYgOCAxNS4xMDQ2IDggMTRWMTBDOCA4Ljg5NTQzIDcuMTA0NTcgOCA2IDhIMloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIiBkPSJNNyAxMEM3IDguODk1NDMgNy44OTU0MyA4IDkgOEgxM0MxNC4xMDQ2IDggMTUgOC44OTU0MyAxNSAxMFYxNEMxNSAxNS4xMDQ2IDE0LjEwNDYgMTYgMTMgMTZIOUM3Ljg5NTQzIDE2IDcgMTUuMTA0NiA3IDE0VjEwWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDlIOUM4LjQ0NzcyIDkgOCA5LjQ0NzcyIDggMTBWMTRDOCAxNC41NTIzIDguNDQ3NzIgMTUgOSAxNUgxM0MxMy41NTIzIDE1IDE0IDE0LjU1MjMgMTQgMTRWMTBDMTQgOS40NDc3MiAxMy41NTIzIDkgMTMgOVpNOSA4QzcuODk1NDMgOCA3IDguODk1NDMgNyAxMFYxNEM3IDE1LjEwNDYgNy44OTU0MyAxNiA5IDE2SDEzQzE0LjEwNDYgMTYgMTUgMTUuMTA0NiAxNSAxNFYxMEMxNSA4Ljg5NTQzIDE0LjEwNDYgOCAxMyA4SDlaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L2c+PC9zdmc+';
	var iSide = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iU2lkZSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggaWQ9IlVuaW9uIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2IDcuNDk5OTlMMTAuNSAxNEwzLjUwMDAyIDE0TDcuNTAwMDIgOS45OTk5OUwxLjAwMDAyIDkuOTk5OTlMMS4wMDAwMiA0Ljk5OTk5TDcuNTAwMDIgNC45OTk5OUwzLjUwMDAyIDAuOTk5OTg1TDEwLjUgMC45OTk5ODVMMTYgNy40OTk5OVoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBpZD0iVW5pb24gKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMy41MDAwMiAxNEwxMC41IDE0TDE2IDcuNDk5OTlMMTAuNSAwLjk5OTk4NUwzLjUwMDAyIDAuOTk5OTg1TDcuNTAwMDIgNC45OTk5OUwxLjAwMDAyIDQuOTk5OTlMMS4wMDAwMiA5Ljk5OTk5TDcuNTAwMDIgOS45OTk5OUwzLjUwMDAyIDE0Wk0yLjAwMDAyIDguOTk5OTlMOS45MTQyMyA4Ljk5OTk4TDUuOTE0MjMgMTNMMTAuMDM2MiAxM0wxNC42OTAxIDcuNDk5OTlMMTAuMDM2MiAxLjk5OTk4TDUuOTE0MjMgMS45OTk5OUw5LjkxNDIzIDUuOTk5OThMMi4wMDAwMiA1Ljk5OTk5TDIuMDAwMDIgOC45OTk5OVoiIGZpbGw9IiNBNDgwMkIiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==';
	var iSideGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iU2lkZV9ncmF5IiBjbGlwLXBhdGg9InVybCgjY2xpcDApIj48cGF0aCBpZD0iVW5pb24iIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgNy40OTk5OUwxMC41IDE0TDMuNTAwMDIgMTRMNy41MDAwMiA5Ljk5OTk5TDEuMDAwMDIgOS45OTk5OUwxLjAwMDAyIDQuOTk5OThMNy41MDAwMiA0Ljk5OTk5TDMuNTAwMDIgMC45OTk5ODVMMTAuNSAwLjk5OTk4NUwxNiA3LjQ5OTk5WiIgZmlsbD0iIzgwODA4MCIvPjxwYXRoIGlkPSJVbmlvbiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zLjUwMDAyIDE0TDEwLjUgMTRMMTYgNy40OTk5OUwxMC41IDAuOTk5OTg1TDMuNTAwMDIgMC45OTk5ODVMNy41MDAwMiA0Ljk5OTk5TDEuMDAwMDIgNC45OTk5OEwxLjAwMDAyIDkuOTk5OTlMNy41MDAwMiA5Ljk5OTk5TDMuNTAwMDIgMTRaTTIuMDAwMDIgOC45OTk5OUw5LjkxNDIzIDguOTk5OThMNS45MTQyMyAxM0wxMC4wMzYyIDEzTDE0LjY5MDEgNy40OTk5OUwxMC4wMzYyIDEuOTk5OThMNS45MTQyMyAxLjk5OTk5TDkuOTE0MjMgNS45OTk5OEwyLjAwMDAyIDUuOTk5OThMMi4wMDAwMiA4Ljk5OTk5WiIgZmlsbD0iIzY0NjI2MiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+';
	var iStarGold = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iU3Rhci1nb2xkIj48cGF0aCBpZD0iU3RhciIgZD0iTTggMUw5Ljg4ODU0IDZIMTZMMTEgOS41TDEzLjUgMTVMOCAxMkwyLjUgMTVMNSA5LjVMMCA2SDYuMTExNDZMOCAxWiIgZmlsbD0iI0UzQkM3QiIvPjxwYXRoIGlkPSJTdGFyIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuODg4NTQgNkw4IDFMNi4xMTE0NiA2SDBMNSA5LjVMMi41IDE1TDggMTJMMTMuNSAxNUwxMSA5LjVMMTYgNkg5Ljg4ODU0Wk0xMi44Mjc2IDdIOS4xOTczTDggMy44MzAxTDYuODAyNyA3SDMuMTcyMzdMNi4yNTQyMyA5LjE1NzNMNC42NDkwNSAxMi42ODg3TDggMTAuODYwOUwxMS4zNTEgMTIuNjg4N0w5Ljc0NTc3IDkuMTU3M0wxMi44Mjc2IDdaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48L2c+PC9zdmc+';
	var iStarHalf = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iU3Rhci1oYWxmIj48cGF0aCBpZD0iU3VidHJhY3QiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAxMkwxMy41IDE1TDExIDkuNUwxNiA2SDkuODg4NTRMOCAxVjMuODMwMUw5LjE5NzMgN0gxMi44Mjc2TDkuNzQ1NzcgOS4xNTczTDExLjM1MSAxMi42ODg3TDggMTAuODYwOVYxMloiIGZpbGw9IiM3MjcyNzIiLz48cGF0aCBpZD0iU3VidHJhY3RfMiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDFMNi4xMTE0NiA2SDBMNSA5LjVMMi41IDE1TDggMTJWMVoiIGZpbGw9IiNFM0JDN0IiLz48cGF0aCBpZD0iU3VidHJhY3RfMyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDFMNi4xMTE0NiA2SDBMNSA5LjVMMi41IDE1TDggMTJWMTAuODYwOUw0LjY0OTA1IDEyLjY4ODdMNi4yNTQyMyA5LjE1NzNMMy4xNzIzNiA3SDYuODAyN0w4IDMuODMwMVYxWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9nPjwvc3ZnPg==';
	var iStarSilver = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iU3Rhci1zaWx2ZXIiPjxwYXRoIGlkPSJTdGFyIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuODg4NTQgNkw4IDFMNi4xMTE0NiA2SDBMNSA5LjVMMi41IDE1TDguMTE0MDMgMTIuMDU1N0wxMy41IDE1TDExIDkuNUwxNiA2SDkuODg4NTRaTTEyLjgyNzYgN0g5LjE5NzNMOCAzLjgzMDFMNi44MDI3IDdIMy4xNzIzN0w2LjI1NDIzIDkuMTU3M0w0LjYxNjE5IDEyLjc2MUw4LjEyMzgyIDEwLjkyMTRMMTEuMzQ5IDEyLjY4NDVMOS43NDU3NyA5LjE1NzNMMTIuODI3NiA3WiIgZmlsbD0iIzcyNzI3MiIvPjwvZz48L3N2Zz4=';
	var iThreeFilledBars = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVGhyZWUgZmlsbGVkIGJhcnMiPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIiBkPSJNNCA3SDhWMTVINFY3WiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcgOEg1VjE0SDdWOFpNNCA3VjE1SDhWN0g0WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzIiBkPSJNMSAxMEg1VjE1SDFWMTBaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQgMTFIMlYxNEg0VjExWk0xIDEwVjE1SDVWMTBIMVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIiBkPSJNMTAgMUgxNFYxNUgxMFYxWiIgZmlsbD0iI0IzQjNCMyIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4zIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDJIMTFWMTRIMTNWMlpNMTAgMVYxNUgxNFYxSDEwWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjIiIGQ9Ik03IDRIMTFWMTVIN1Y0WiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwIDVIOFYxNEgxMFY1Wk03IDRWMTVIMTFWNEg3WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==';
	var iThreeFilledBoxes = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVGhyZWUgZmlsbGVkIGJveGVzIj48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMSIgZD0iTTcgM0M3IDEuODk1NDMgNy44OTU0MyAxIDkgMUgxM0MxNC4xMDQ2IDEgMTUgMS44OTU0MyAxNSAzVjdDMTUgOC4xMDQ1NyAxNC4xMDQ2IDkgMTMgOUg5QzcuODk1NDMgOSA3IDguMTA0NTcgNyA3VjNaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMgMkg5QzguNDQ3NzIgMiA4IDIuNDQ3NzIgOCAzVjdDOCA3LjU1MjI4IDguNDQ3NzIgOCA5IDhIMTNDMTMuNTUyMyA4IDE0IDcuNTUyMjggMTQgN1YzQzE0IDIuNDQ3NzIgMTMuNTUyMyAyIDEzIDJaTTkgMUM3Ljg5NTQzIDEgNyAxLjg5NTQzIDcgM1Y3QzcgOC4xMDQ1NyA3Ljg5NTQzIDkgOSA5SDEzQzE0LjEwNDYgOSAxNSA4LjEwNDU3IDE1IDdWM0MxNSAxLjg5NTQzIDE0LjEwNDYgMSAxMyAxSDlaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMiIGQ9Ik0wIDNDMCAxLjg5NTQzIDAuODk1NDMxIDEgMiAxSDZDNy4xMDQ1NyAxIDggMS44OTU0MyA4IDNWN0M4IDguMTA0NTcgNy4xMDQ1NyA5IDYgOUgyQzAuODk1NDMxIDkgMCA4LjEwNDU3IDAgN1YzWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02IDJIMkMxLjQ0NzcyIDIgMSAyLjQ0NzcyIDEgM1Y3QzEgNy41NTIyOCAxLjQ0NzcyIDggMiA4SDZDNi41NTIyOCA4IDcgNy41NTIyOCA3IDdWM0M3IDIuNDQ3NzIgNi41NTIyOCAyIDYgMlpNMiAxQzAuODk1NDMxIDEgMCAxLjg5NTQzIDAgM1Y3QzAgOC4xMDQ1NyAwLjg5NTQzMSA5IDIgOUg2QzcuMTA0NTcgOSA4IDguMTA0NTcgOCA3VjNDOCAxLjg5NTQzIDcuMTA0NTcgMSA2IDFIMloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIiBkPSJNMCAxMEMwIDguODk1NDMgMC44OTU0MzEgOCAyIDhINkM3LjEwNDU3IDggOCA4Ljg5NTQzIDggMTBWMTRDOCAxNS4xMDQ2IDcuMTA0NTcgMTYgNiAxNkgyQzAuODk1NDMxIDE2IDAgMTUuMTA0NiAwIDE0VjEwWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYgOUgyQzEuNDQ3NzIgOSAxIDkuNDQ3NzIgMSAxMFYxNEMxIDE0LjU1MjMgMS40NDc3MiAxNSAyIDE1SDZDNi41NTIyOCAxNSA3IDE0LjU1MjMgNyAxNFYxMEM3IDkuNDQ3NzIgNi41NTIyOCA5IDYgOVpNMiA4QzAuODk1NDMxIDggMCA4Ljg5NTQzIDAgMTBWMTRDMCAxNS4xMDQ2IDAuODk1NDMxIDE2IDIgMTZINkM3LjEwNDU3IDE2IDggMTUuMTA0NiA4IDE0VjEwQzggOC44OTU0MyA3LjEwNDU3IDggNiA4SDJaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyIgZD0iTTcgMTBDNyA4Ljg5NTQzIDcuODk1NDMgOCA5IDhIMTNDMTQuMTA0NiA4IDE1IDguODk1NDMgMTUgMTBWMTRDMTUgMTUuMTA0NiAxNC4xMDQ2IDE2IDEzIDE2SDlDNy44OTU0MyAxNiA3IDE1LjEwNDYgNyAxNFYxMFoiIGZpbGw9IiM0QTdEQjEiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyA5SDlDOC40NDc3MiA5IDggOS40NDc3MiA4IDEwVjE0QzggMTQuNTUyMyA4LjQ0NzcyIDE1IDkgMTVIMTNDMTMuNTUyMyAxNSAxNCAxNC41NTIzIDE0IDE0VjEwQzE0IDkuNDQ3NzIgMTMuNTUyMyA5IDEzIDlaTTkgOEM3Ljg5NTQzIDggNyA4Ljg5NTQzIDcgMTBWMTRDNyAxNS4xMDQ2IDcuODk1NDMgMTYgOSAxNkgxM0MxNC4xMDQ2IDE2IDE1IDE1LjEwNDYgMTUgMTRWMTBDMTUgOC44OTU0MyAxNC4xMDQ2IDggMTMgOEg5WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==';
	var iTrafficLightGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHJhZmZpYy1saWdodC1ncmVlbiI+PHBhdGggaWQ9IlJlY3RhbmdsZSAyIiBkPSJNMSAzQzEgMS44OTU0MyAxLjg5NTQzIDEgMyAxSDEzQzE0LjEwNDYgMSAxNSAxLjg5NTQzIDE1IDNWMTNDMTUgMTQuMTA0NiAxNC4xMDQ2IDE1IDEzIDE1SDNDMS44OTU0MyAxNSAxIDE0LjEwNDYgMSAxM1YzWiIgZmlsbD0iIzUwNTA1MCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAySDNDMi40NDc3MiAyIDIgMi40NDc3MiAyIDNWMTNDMiAxMy41NTIzIDIuNDQ3NzIgMTQgMyAxNEgxM0MxMy41NTIzIDE0IDE0IDEzLjU1MjMgMTQgMTNWM0MxNCAyLjQ0NzcyIDEzLjU1MjMgMiAxMyAyWk0zIDFDMS44OTU0MyAxIDEgMS44OTU0MyAxIDNWMTNDMSAxNC4xMDQ2IDEuODk1NDMgMTUgMyAxNUgxM0MxNC4xMDQ2IDE1IDE1IDE0LjEwNDYgMTUgMTNWM0MxNSAxLjg5NTQzIDE0LjEwNDYgMSAxMyAxSDNaIiBmaWxsPSIjMzAzMDMwIi8+PHBhdGggaWQ9IkVsbGlwc2UiIGQ9Ik0xMyA4QzEzIDUuMjM4NTggMTAuNzYxNCAzIDggM0M1LjIzODU4IDMgMyA1LjIzODU4IDMgOEMzIDEwLjc2MTQgNS4yMzg1OCAxMyA4IDEzQzEwLjc2MTQgMTMgMTMgMTAuNzYxNCAxMyA4WiIgZmlsbD0iIzY4QTQ5MCIvPjwvZz48L3N2Zz4=';
	var iTrafficLightRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHJhZmZpYy1saWdodC1yZWQiPjxwYXRoIGlkPSJSZWN0YW5nbGUgMiIgZD0iTTEgM0MxIDEuODk1NDMgMS44OTU0MyAxIDMgMUgxM0MxNC4xMDQ2IDEgMTUgMS44OTU0MyAxNSAzVjEzQzE1IDE0LjEwNDYgMTQuMTA0NiAxNSAxMyAxNUgzQzEuODk1NDMgMTUgMSAxNC4xMDQ2IDEgMTNWM1oiIGZpbGw9IiM1MDUwNTAiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDIgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMgMkgzQzIuNDQ3NzIgMiAyIDIuNDQ3NzIgMiAzVjEzQzIgMTMuNTUyMyAyLjQ0NzcyIDE0IDMgMTRIMTNDMTMuNTUyMyAxNCAxNCAxMy41NTIzIDE0IDEzVjNDMTQgMi40NDc3MiAxMy41NTIzIDIgMTMgMlpNMyAxQzEuODk1NDMgMSAxIDEuODk1NDMgMSAzVjEzQzEgMTQuMTA0NiAxLjg5NTQzIDE1IDMgMTVIMTNDMTQuMTA0NiAxNSAxNSAxNC4xMDQ2IDE1IDEzVjNDMTUgMS44OTU0MyAxNC4xMDQ2IDEgMTMgMUgzWiIgZmlsbD0iIzMwMzAzMCIvPjxwYXRoIGlkPSJFbGxpcHNlIiBkPSJNMTMgOEMxMyA1LjIzODU4IDEwLjc2MTQgMyA4IDNDNS4yMzg1OCAzIDMgNS4yMzg1OCAzIDhDMyAxMC43NjE0IDUuMjM4NTggMTMgOCAxM0MxMC43NjE0IDEzIDEzIDEwLjc2MTQgMTMgOFoiIGZpbGw9IiNENjU1MzIiLz48L2c+PC9zdmc+';
	var iTrafficLightYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHJhZmZpYy1saWdodC15ZWxsb3ciPjxwYXRoIGlkPSJSZWN0YW5nbGUgMiIgZD0iTTEgM0MxIDEuODk1NDMgMS44OTU0MyAxIDMgMUgxM0MxNC4xMDQ2IDEgMTUgMS44OTU0MyAxNSAzVjEzQzE1IDE0LjEwNDYgMTQuMTA0NiAxNSAxMyAxNUgzQzEuODk1NDMgMTUgMSAxNC4xMDQ2IDEgMTNWM1oiIGZpbGw9IiM1MDUwNTAiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDIgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMgMkgzQzIuNDQ3NzIgMiAyIDIuNDQ3NzIgMiAzVjEzQzIgMTMuNTUyMyAyLjQ0NzcyIDE0IDMgMTRIMTNDMTMuNTUyMyAxNCAxNCAxMy41NTIzIDE0IDEzVjNDMTQgMi40NDc3MiAxMy41NTIzIDIgMTMgMlpNMyAxQzEuODk1NDMgMSAxIDEuODk1NDMgMSAzVjEzQzEgMTQuMTA0NiAxLjg5NTQzIDE1IDMgMTVIMTNDMTQuMTA0NiAxNSAxNSAxNC4xMDQ2IDE1IDEzVjNDMTUgMS44OTU0MyAxNC4xMDQ2IDEgMTMgMUgzWiIgZmlsbD0iIzMwMzAzMCIvPjxwYXRoIGlkPSJFbGxpcHNlIiBkPSJNMTMgOEMxMyA1LjIzODU4IDEwLjc2MTQgMyA4IDNDNS4yMzg1OCAzIDMgNS4yMzg1OCAzIDhDMyAxMC43NjE0IDUuMjM4NTggMTMgOCAxM0MxMC43NjE0IDEzIDEzIDEwLjc2MTQgMTMgOFoiIGZpbGw9IiNFQUMyODIiLz48L2c+PC9zdmc+';
	var iTriangleYellow = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHJpYW5nbGUgLXllbGxvdyI+PGcgaWQ9IlZlY3RvciAyLjMiPjxwYXRoIGQ9Ik0xIDE1SDE1TDggMUwxIDE1WiIgZmlsbD0iI0VBQzI4MiIvPjxwYXRoIGQ9Ik04IDIuMTE4MDNMMTQuMTkxIDE0LjVIMS44MDkwMkw4IDIuMTE4MDNaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utb3BhY2l0eT0iMC40Ii8+PC9nPjwvZz48L3N2Zz4=';
	var iTriangleGreen = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0idHJpYW5nbGUtZ3JlZW4iPjxwYXRoIGlkPSJWZWN0b3IgMi4yIiBkPSJNMSAxMkgxNUw4IDNMMSAxMloiIGZpbGw9IiM2OEE0OTAiLz48cGF0aCBpZD0iVmVjdG9yIDIuMiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSAxMkw4IDNMMSAxMkgxNVpNMTIuOTU1NCAxMUw4IDQuNjI4ODJMMy4wNDQ2NCAxMUgxMi45NTU0WiIgZmlsbD0iIzMyNkY1QiIvPjwvZz48L3N2Zz4=';
	var iTriangleRed = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0idHJpYW5nbGUtcmVkIj48cGF0aCBpZD0iVmVjdG9yIDIuMiIgZD0iTTE1IDRMMSA0TDggMTNMMTUgNFoiIGZpbGw9IiNENjU1MzIiLz48cGF0aCBpZD0iVmVjdG9yIDIuMiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDRMOCAxM0wxNSA0TDEgNFpNMy4wNDQ2NCA1TDggMTEuMzcxMkwxMi45NTU0IDVMMy4wNDQ2NCA1WiIgZmlsbD0iI0EyMzgxQyIvPjwvZz48L3N2Zz4=';
	var iTwoFilledBars = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHdvIGZpbGxlZCBiYXJzIj48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyIgZD0iTTEwIDFIMTRWMTVIMTBWMVoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAySDExVjE0SDEzVjJaTTEwIDFWMTVIMTRWMUgxMFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIiBkPSJNNyA0SDExVjE1SDdWNFoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCA1SDhWMTRIMTBWNVpNNyA0VjE1SDExVjRIN1oiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIiBkPSJNNCA3SDhWMTVINFY3WiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcgOEg1VjE0SDdWOFpNNCA3VjE1SDhWN0g0WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzIiBkPSJNMSAxMEg1VjE1SDFWMTBaIiBmaWxsPSIjNEE3REIxIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQgMTFIMlYxNEg0VjExWk0xIDEwVjE1SDVWMTBIMVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvZz48L3N2Zz4=';
	var iTwoFilledBoxes = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVHdvIGZpbGxlZWQgYm94ZXMiPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIiBkPSJNNyAzQzcgMS44OTU0MyA3Ljg5NTQzIDEgOSAxSDEzQzE0LjEwNDYgMSAxNSAxLjg5NTQzIDE1IDNWN0MxNSA4LjEwNDU3IDE0LjEwNDYgOSAxMyA5SDlDNy44OTU0MyA5IDcgOC4xMDQ1NyA3IDdWM1oiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAySDlDOC40NDc3MiAyIDggMi40NDc3MiA4IDNWN0M4IDcuNTUyMjggOC40NDc3MiA4IDkgOEgxM0MxMy41NTIzIDggMTQgNy41NTIyOCAxNCA3VjNDMTQgMi40NDc3MiAxMy41NTIzIDIgMTMgMlpNOSAxQzcuODk1NDMgMSA3IDEuODk1NDMgNyAzVjdDNyA4LjEwNDU3IDcuODk1NDMgOSA5IDlIMTNDMTQuMTA0NiA5IDE1IDguMTA0NTcgMTUgN1YzQzE1IDEuODk1NDMgMTQuMTA0NiAxIDEzIDFIOVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy40IiBkPSJNMCAzQzAgMS44OTU0MyAwLjg5NTQzMSAxIDIgMUg2QzcuMTA0NTcgMSA4IDEuODk1NDMgOCAzVjdDOCA4LjEwNDU3IDcuMTA0NTcgOSA2IDlIMkMwLjg5NTQzMSA5IDAgOC4xMDQ1NyAwIDdWM1oiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuNCAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02IDJIMkMxLjQ0NzcyIDIgMSAyLjQ0NzcyIDEgM1Y3QzEgNy41NTIyOCAxLjQ0NzcyIDggMiA4SDZDNi41NTIyOCA4IDcgNy41NTIyOCA3IDdWM0M3IDIuNDQ3NzIgNi41NTIyOCAyIDYgMlpNMiAxQzAuODk1NDMxIDEgMCAxLjg5NTQzIDAgM1Y3QzAgOC4xMDQ1NyAwLjg5NTQzMSA5IDIgOUg2QzcuMTA0NTcgOSA4IDguMTA0NTcgOCA3VjNDOCAxLjg5NTQzIDcuMTA0NTcgMSA2IDFIMloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIiBkPSJNMCAxMEMwIDguODk1NDMgMC44OTU0MzEgOCAyIDhINkM3LjEwNDU3IDggOCA4Ljg5NTQzIDggMTBWMTRDOCAxNS4xMDQ2IDcuMTA0NTcgMTYgNiAxNkgyQzAuODk1NDMxIDE2IDAgMTUuMTA0NiAwIDE0VjEwWiIgZmlsbD0iIzRBN0RCMSIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4yIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYgOUgyQzEuNDQ3NzIgOSAxIDkuNDQ3NzIgMSAxMFYxNEMxIDE0LjU1MjMgMS40NDc3MiAxNSAyIDE1SDZDNi41NTIyOCAxNSA3IDE0LjU1MjMgNyAxNFYxMEM3IDkuNDQ3NzIgNi41NTIyOCA5IDYgOVpNMiA4QzAuODk1NDMxIDggMCA4Ljg5NTQzIDAgMTBWMTRDMCAxNS4xMDQ2IDAuODk1NDMxIDE2IDIgMTZINkM3LjEwNDU3IDE2IDggMTUuMTA0NiA4IDE0VjEwQzggOC44OTU0MyA3LjEwNDU3IDggNiA4SDJaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyIgZD0iTTcgMTBDNyA4Ljg5NTQzIDcuODk1NDMgOCA5IDhIMTNDMTQuMTA0NiA4IDE1IDguODk1NDMgMTUgMTBWMTRDMTUgMTUuMTA0NiAxNC4xMDQ2IDE2IDEzIDE2SDlDNy44OTU0MyAxNiA3IDE1LjEwNDYgNyAxNFYxMFoiIGZpbGw9IiM0QTdEQjEiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMyAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyA5SDlDOC40NDc3MiA5IDggOS40NDc3MiA4IDEwVjE0QzggMTQuNTUyMyA4LjQ0NzcyIDE1IDkgMTVIMTNDMTMuNTUyMyAxNSAxNCAxNC41NTIzIDE0IDE0VjEwQzE0IDkuNDQ3NzIgMTMuNTUyMyA5IDEzIDlaTTkgOEM3Ljg5NTQzIDggNyA4Ljg5NTQzIDcgMTBWMTRDNyAxNS4xMDQ2IDcuODk1NDMgMTYgOSAxNkgxM0MxNC4xMDQ2IDE2IDE1IDE1LjEwNDYgMTUgMTRWMTBDMTUgOC44OTU0MyAxNC4xMDQ2IDggMTMgOEg5WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==';
	var iUp = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0idXAiIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPjxwYXRoIGlkPSJVbmlvbiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjUgMEwxNSA1LjVWMTEuNUwxMSA4LjNWMTVMNiAxNUw2IDguM0wyIDExLjVMMiA1LjVMOC41IDBaIiBmaWxsPSIjNjhBNDkwIi8+PHBhdGggaWQ9IlVuaW9uIChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1IDExLjVWNS41TDguNSAwTDIgNS41TDIgMTEuNUw2IDguM0w2IDE1TDExIDE1VjguM0wxNSAxMS41Wk0xMCAxNFY2LjIxOTM4TDE0IDkuNDE5MzhWNS45NjM4TDguNSAxLjMwOTk1TDMgNS45NjM4TDMgOS40MTkzOEw3IDYuMjE5MzhMNyAxNEwxMCAxNFoiIGZpbGw9IiMzMjZGNUIiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==';
	var iUpGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0idXAtZ3JheSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggaWQ9IlVuaW9uIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNTAwMDIgMEwxNCA1LjVWMTEuNUwxMCA4LjNWMTVMNS4wMDAwMiAxNUw1LjAwMDAyIDguM0wxLjAwMDAyIDExLjVMMS4wMDAwMiA1LjVMNy41MDAwMiAwWiIgZmlsbD0iIzgwODA4MCIvPjxwYXRoIGlkPSJVbmlvbiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNCAxMS41VjUuNUw3LjUwMDAyIDBMMS4wMDAwMiA1LjVMMS4wMDAwMiAxMS41TDUuMDAwMDIgOC4zTDUuMDAwMDIgMTVMMTAgMTVWOC4zTDE0IDExLjVaTTkuMDAwMDIgMTRWNi4yMTkzOEwxMyA5LjQxOTM4VjUuOTYzOEw3LjUwMDAyIDEuMzA5OTVMMi4wMDAwMiA1Ljk2MzhMMi4wMDAwMiA5LjQxOTM4TDYuMDAwMDIgNi4yMTkzOEw2LjAwMDAyIDE0TDkuMDAwMDIgMTRaIiBmaWxsPSIjNjQ2MjYyIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=';
	var iUpIncline = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVXBJbmNsaW5lIj48cGF0aCBpZD0iVW5pb24iIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUgMTBMMTUgMUw2IDAuOTk5OTk5TDEgNkw2LjExMDg2IDZMMC45OTk5NSAxMS4xMTA5TDQuODg5MDQgMTVMMTAgOS44ODkwNEwxMCAxNUwxNSAxMFoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBpZD0iVW5pb24gKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMTVMMTUgMTBMMTUgMUw2IDAuOTk5OTk5TDEgNkw2LjExMDg2IDZMMC45OTk5NSAxMS4xMTA5TDQuODg5MDQgMTVMMTAgOS44ODkwNEwxMCAxNVpNNC44ODkwNCAxMy41ODU4TDExIDcuNDc0ODJMMTEgMTIuNTg1OEwxNCA5LjU4NTc5TDE0IDJMNi40MTQyMSAyTDMuNDE0MjEgNUw4LjUyNTA4IDVMMi40MTQxNiAxMS4xMTA5TDQuODg5MDQgMTMuNTg1OFoiIGZpbGw9IiNBNDgwMkIiLz48L2c+PC9zdmc+';
	var iUpInclineGray = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iVXBJbmNsaW5lLWdyYXkiPjxwYXRoIGlkPSJVbmlvbiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSAxMEwxNSAxTDYgMC45OTk5OTlMMSA2TDYuMTEwODYgNkwwLjk5OTk1IDExLjExMDlMNC44ODkwNCAxNUwxMCA5Ljg4OTA0TDEwIDE1TDE1IDEwWiIgZmlsbD0iIzgwODA4MCIvPjxwYXRoIGlkPSJVbmlvbiAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAxNUwxNSAxMEwxNSAxTDYgMC45OTk5OTlMMSA2TDYuMTEwODYgNkwwLjk5OTk1IDExLjExMDlMNC44ODkwNCAxNUwxMCA5Ljg4OTA0TDEwIDE1Wk00Ljg4OTA0IDEzLjU4NThMMTEgNy40NzQ4MkwxMSAxMi41ODU4TDE0IDkuNTg1NzlMMTQgMkw2LjQxNDIxIDJMMy40MTQyMSA1TDguNTI1MDggNUwyLjQxNDE2IDExLjExMDlMNC44ODkwNCAxMy41ODU4WiIgZmlsbD0iIzY0NjI2MiIvPjwvZz48L3N2Zz4=';
	var iZeroFilledBars = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iWmVybyBmaWxsZWQgYmFycyI+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEiIGQ9Ik00IDdIOFYxNUg0VjdaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjEgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyA4SDVWMTRIN1Y4Wk00IDdWMTVIOFY3SDRaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMiIGQ9Ik0xIDEwSDVWMTVIMVYxMFoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNCAxMUgyVjE0SDRWMTFaTTEgMTBWMTVINVYxMEgxWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjMiIGQ9Ik0xMCAxSDE0VjE1SDEwVjFaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjMgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMgMkgxMVYxNEgxM1YyWk0xMCAxVjE1SDE0VjFIMTBaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMiIgZD0iTTcgNEgxMVYxNUg3VjRaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjIgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgNUg4VjE0SDEwVjVaTTcgNFYxNUgxMVY0SDdaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48L2c+PC9zdmc+';
	var iZeroFilledBoxes = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iWmVybyBmaWxsZWQgYm94ZXMiPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy4xIiBkPSJNNyAzQzcgMS44OTU0MyA3Ljg5NTQzIDEgOSAxSDEzQzE0LjEwNDYgMSAxNSAxLjg5NTQzIDE1IDNWN0MxNSA4LjEwNDU3IDE0LjEwNDYgOSAxMyA5SDlDNy44OTU0MyA5IDcgOC4xMDQ1NyA3IDdWM1oiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuMSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAySDlDOC40NDc3MiAyIDggMi40NDc3MiA4IDNWN0M4IDcuNTUyMjggOC40NDc3MiA4IDkgOEgxM0MxMy41NTIzIDggMTQgNy41NTIyOCAxNCA3VjNDMTQgMi40NDc3MiAxMy41NTIzIDIgMTMgMlpNOSAxQzcuODk1NDMgMSA3IDEuODk1NDMgNyAzVjdDNyA4LjEwNDU3IDcuODk1NDMgOSA5IDlIMTNDMTQuMTA0NiA5IDE1IDguMTA0NTcgMTUgN1YzQzE1IDEuODk1NDMgMTQuMTA0NiAxIDEzIDFIOVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy42IiBkPSJNNyAxMEM3IDguODk1NDMgNy44OTU0MyA4IDkgOEgxM0MxNC4xMDQ2IDggMTUgOC44OTU0MyAxNSAxMFYxNEMxNSAxNS4xMDQ2IDE0LjEwNDYgMTYgMTMgMTZIOUM3Ljg5NTQzIDE2IDcgMTUuMTA0NiA3IDE0VjEwWiIgZmlsbD0iI0IzQjNCMyIvPjxwYXRoIGlkPSJSZWN0YW5nbGUgMy42IChTdHJva2UpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzIDlIOUM4LjQ0NzcyIDkgOCA5LjQ0NzcyIDggMTBWMTRDOCAxNC41NTIzIDguNDQ3NzIgMTUgOSAxNUgxM0MxMy41NTIzIDE1IDE0IDE0LjU1MjMgMTQgMTRWMTBDMTQgOS40NDc3MiAxMy41NTIzIDkgMTMgOVpNOSA4QzcuODk1NDMgOCA3IDguODk1NDMgNyAxMFYxNEM3IDE1LjEwNDYgNy44OTU0MyAxNiA5IDE2SDEzQzE0LjEwNDYgMTYgMTUgMTUuMTA0NiAxNSAxNFYxMEMxNSA4Ljg5NTQzIDE0LjEwNDYgOCAxMyA4SDlaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuNCIgZD0iTTAgM0MwIDEuODk1NDMgMC44OTU0MzEgMSAyIDFINkM3LjEwNDU3IDEgOCAxLjg5NTQzIDggM1Y3QzggOC4xMDQ1NyA3LjEwNDU3IDkgNiA5SDJDMC44OTU0MzEgOSAwIDguMTA0NTcgMCA3VjNaIiBmaWxsPSIjQjNCM0IzIi8+PHBhdGggaWQ9IlJlY3RhbmdsZSAzLjQgKFN0cm9rZSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNiAySDJDMS40NDc3MiAyIDEgMi40NDc3MiAxIDNWN0MxIDcuNTUyMjggMS40NDc3MiA4IDIgOEg2QzYuNTUyMjggOCA3IDcuNTUyMjggNyA3VjNDNyAyLjQ0NzcyIDYuNTUyMjggMiA2IDJaTTIgMUMwLjg5NTQzMSAxIDAgMS44OTU0MyAwIDNWN0MwIDguMTA0NTcgMC44OTU0MzEgOSAyIDlINkM3LjEwNDU3IDkgOCA4LjEwNDU3IDggN1YzQzggMS44OTU0MyA3LjEwNDU3IDEgNiAxSDJaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuNSIgZD0iTTAgMTBDMCA4Ljg5NTQzIDAuODk1NDMxIDggMiA4SDZDNy4xMDQ1NyA4IDggOC44OTU0MyA4IDEwVjE0QzggMTUuMTA0NiA3LjEwNDU3IDE2IDYgMTZIMkMwLjg5NTQzMSAxNiAwIDE1LjEwNDYgMCAxNFYxMFoiIGZpbGw9IiNCM0IzQjMiLz48cGF0aCBpZD0iUmVjdGFuZ2xlIDMuNSAoU3Ryb2tlKSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02IDlIMkMxLjQ0NzcyIDkgMSA5LjQ0NzcyIDEgMTBWMTRDMSAxNC41NTIzIDEuNDQ3NzIgMTUgMiAxNUg2QzYuNTUyMjggMTUgNyAxNC41NTIzIDcgMTRWMTBDNyA5LjQ0NzcyIDYuNTUyMjggOSA2IDlaTTIgOEMwLjg5NTQzMSA4IDAgOC44OTU0MyAwIDEwVjE0QzAgMTUuMTA0NiAwLjg5NTQzMSAxNiAyIDE2SDZDNy4xMDQ1NyAxNiA4IDE1LjEwNDYgOCAxNFYxMEM4IDguODk1NDMgNy4xMDQ1NyA4IDYgOEgyWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9nPjwvc3ZnPg==';

	var c_arrIcons = [20];
	c_arrIcons[EIconSetType.Arrows3] = [iDown, iSide, iUp];
	c_arrIcons[EIconSetType.Arrows3Gray] = [iDownGray, iSideGray, iUpGray];
	c_arrIcons[EIconSetType.Flags3] = [iFlagRed, iFlagYellow, iFlagGreen];
	c_arrIcons[EIconSetType.Signs3] = [iDiamondRed, iTriangleYellow, iCircleGreen];
	c_arrIcons[EIconSetType.Symbols3] = [iCrossRed, iExclamationYellow, iCheckGreen];
	c_arrIcons[EIconSetType.Symbols3_2] = [iCrossSymbolRed, iExclamationSymbolYellow, iCheckSymbolGreen];
	c_arrIcons[EIconSetType.Traffic3Lights1] = [iCircleRed, iCircleYellow, iCircleGreen];
	c_arrIcons[EIconSetType.Traffic3Lights2] = [iTrafficLightRed, iTrafficLightYellow, iTrafficLightGreen];
	c_arrIcons[EIconSetType.Arrows4] = [iDown, iDownIncline, iUpIncline, iUp];
	c_arrIcons[EIconSetType.Arrows4Gray] = [iDownGray, iDownInclineGray, iUpInclineGray, iUpGray];
	c_arrIcons[EIconSetType.Rating4] = [iOneFilledBars, iTwoFilledBars, iThreeFilledBars, iFourFilledBars];
	c_arrIcons[EIconSetType.RedToBlack4] = [iCircleBlack, iCircleGray, iCircleLightRed, iCircleRed];
	c_arrIcons[EIconSetType.Traffic4Lights] = [iCircleBlack, iCircleRed, iCircleYellow, iCircleGreen];
	c_arrIcons[EIconSetType.Arrows5] = [iDown, iDownIncline, iSide, iUpIncline, iUp];
	c_arrIcons[EIconSetType.Arrows5Gray] = [iDownGray, iDownInclineGray, iSideGray, iUpInclineGray, iUpGray];
	c_arrIcons[EIconSetType.Quarters5] = [iCircleWhite, iCircleThreeWhiteQuarters, iCircleTwoWhiteQuarters, iCircleOneWhiteQuarter, iCircleBlack];
	c_arrIcons[EIconSetType.Rating5] = [iZeroFilledBars, iOneFilledBars, iTwoFilledBars, iThreeFilledBars, iFourFilledBars];
	c_arrIcons[EIconSetType.Triangles3] = [iTriangleRed, iDashYellow, iTriangleGreen];
	c_arrIcons[EIconSetType.Stars3] = [iStarSilver, iStarHalf, iStarGold];
	c_arrIcons[EIconSetType.Boxes5] = [iZeroFilledBoxes, iOneFilledBoxes, iTwoFilledBoxes, iThreeFilledBoxes, iFourFilledBoxes];

	function getIconsForLoad() {
		return [iCheckGreen, iCheckSymbolGreen, iCircleTwoWhiteQuarters, iCircleBlack, iCircleGray, iCircleGreen,
			iCircleLightRed, iCircleOneWhiteQuarter, iCircleRed, iCircleThreeWhiteQuarters, iCircleWhite,
			iCircleYellow, iCrossRed, iCrossSymbolRed, iDashYellow, iDiamondRed, iDown, iDownGray, iDownIncline,
			iDownInclineGray, iExclamationSymbolYellow, iExclamationYellow, iFlagGreen, iFlagRed, iFlagYellow,
			iFourFilledBars, iFourFilledBoxes, iOneFilledBars, iOneFilledBoxes, iSide, iSideGray, iStarGold, iStarHalf,
			iStarSilver, iThreeFilledBars, iThreeFilledBoxes, iTrafficLightGreen, iTrafficLightRed,
			iTrafficLightYellow, iTriangleYellow, iTriangleGreen, iTriangleRed, iTwoFilledBars, iTwoFilledBoxes, iUp,
			iUpGray, iUpIncline, iUpInclineGray, iZeroFilledBars, iZeroFilledBoxes];
	}

	function getCFIcon(oRuleElement, index) {
		var oIconSet = oRuleElement.aIconSets[index];
		var iconSetType = (oIconSet && null !== oIconSet.IconSet) ? oIconSet.IconSet : oRuleElement.IconSet;
		if (EIconSetType.NoIcons === iconSetType) {
			return null;
		}
		var icons = c_arrIcons[iconSetType] || c_arrIcons[EIconSetType.Traffic3Lights1];
		return icons[(oIconSet && null !== oIconSet.IconId) ? oIconSet.IconId : index] || icons[icons.length - 1];
	}

	/*
	 * Export
	 * -----------------------------------------------------------------------------
	 */
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CConditionalFormatting = CConditionalFormatting;
	window['AscCommonExcel'].CConditionalFormattingFormulaParent = CConditionalFormattingFormulaParent;
	window['AscCommonExcel'].CConditionalFormattingRule = CConditionalFormattingRule;
	window['AscCommonExcel'].CColorScale = CColorScale;
	window['AscCommonExcel'].CDataBar = CDataBar;
	window['AscCommonExcel'].CFormulaCF = CFormulaCF;
	window['AscCommonExcel'].CIconSet = CIconSet;
	window['AscCommonExcel'].CConditionalFormatValueObject = CConditionalFormatValueObject;
	window['AscCommonExcel'].CConditionalFormatIconSet = CConditionalFormatIconSet;
	window['AscCommonExcel'].CGradient = CGradient;

	window['AscCommonExcel'].getIconsForLoad = getIconsForLoad;
	window['AscCommonExcel'].getCFIcon = getCFIcon;
})(window);
