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
		this.IconSet = true;
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

	var sDown = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWFzayBpZD0icGF0aC0xLWluc2lkZS0xIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjUgMTZMMiAxMC41TDIgNC41TDYgNy43TDYgMC45OTk5OTlMMTEgMUwxMSA3LjdMMTUgNC41TDE1IDEwLjVMOC41IDE2WiIvPjwvbWFzaz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNkwyIDEwLjVMMiA0LjVMNiA3LjdMNiAwLjk5OTk5OUwxMSAxTDExIDcuN0wxNSA0LjVMMTUgMTAuNUw4LjUgMTZaIiBmaWxsPSIjRDY1NTMyIi8+PHBhdGggZD0iTTIgMTAuNUwxIDEwLjVMMSAxMC45NjM4TDEuMzU0MDYgMTEuMjYzNEwyIDEwLjVaTTguNSAxNkw3Ljg1NDA2IDE2Ljc2MzRMOC41IDE3LjMxTDkuMTQ1OTQgMTYuNzYzNEw4LjUgMTZaTTIgNC41TDIuNjI0NyAzLjcxOTEzTDEgMi40MTkzN0wxIDQuNUwyIDQuNVpNNiA3LjdMNS4zNzUzIDguNDgwODdMNyA5Ljc4MDYyTDcgNy43TDYgNy43Wk02IDAuOTk5OTk5TDYgLTcuODY4MDVlLTA3TDUgLTguNzQyMjhlLTA3TDUgMC45OTk5OTlMNiAwLjk5OTk5OVpNMTEgMUwxMiAxTDEyIC0yLjYyMjY4ZS0wN0wxMSAtMy40OTY5MWUtMDdMMTEgMVpNMTEgNy43TDEwIDcuN0wxMCA5Ljc4MDYzTDExLjYyNDcgOC40ODA4N0wxMSA3LjdaTTE1IDQuNUwxNiA0LjVMMTYgMi40MTkzOEwxNC4zNzUzIDMuNzE5MTNMMTUgNC41Wk0xNSAxMC41TDE1LjY0NTkgMTEuMjYzNEwxNiAxMC45NjM4TDE2IDEwLjVMMTUgMTAuNVpNMS4zNTQwNiAxMS4yNjM0TDcuODU0MDYgMTYuNzYzNEw5LjE0NTk0IDE1LjIzNjZMMi42NDU5NCA5LjczNjYxTDEuMzU0MDYgMTEuMjYzNFpNMSA0LjVMMSAxMC41TDMgMTAuNUwzIDQuNUwxIDQuNVpNNi42MjQ2OSA2LjkxOTEzTDIuNjI0NyAzLjcxOTEzTDEuMzc1MzEgNS4yODA4N0w1LjM3NTMgOC40ODA4N0w2LjYyNDY5IDYuOTE5MTNaTTcgNy43TDcgMC45OTk5OTlMNSAwLjk5OTk5OUw1IDcuN0w3IDcuN1pNNiAyTDExIDJMMTEgLTMuNDk2OTFlLTA3TDYgLTcuODY4MDVlLTA3TDYgMlpNMTAgMUwxMCA3LjdMMTIgNy43TDEyIDFMMTAgMVpNMTQuMzc1MyAzLjcxOTEzTDEwLjM3NTMgNi45MTkxM0wxMS42MjQ3IDguNDgwODdMMTUuNjI0NyA1LjI4MDg3TDE0LjM3NTMgMy43MTkxM1pNMTYgMTAuNUwxNiA0LjVMMTQgNC41TDE0IDEwLjVMMTYgMTAuNVpNOS4xNDU5NCAxNi43NjM0TDE1LjY0NTkgMTEuMjYzNEwxNC4zNTQxIDkuNzM2NjFMNy44NTQwNiAxNS4yMzY2TDkuMTQ1OTQgMTYuNzYzNFoiIGZpbGw9IiM5RTM4MUMiIG1hc2s9InVybCgjcGF0aC0xLWluc2lkZS0xKSIvPjwvc3ZnPg==';
	var sDownIncline = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWFzayBpZD0icGF0aC0xLWluc2lkZS0xIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA2TDE1IDE1TDYgMTVMMSAxMEw2LjExMDg2IDEwTDAuOTk5OTUgNC44ODkwOUw0Ljg4OTA0IDFMMTAgNi4xMTA5NkwxMCAwLjk5OTk5OUwxNSA2WiIvPjwvbWFzaz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1IDZMMTUgMTVMNiAxNUwxIDEwTDYuMTEwODYgMTBMMC45OTk5NSA0Ljg4OTA5TDQuODg5MDQgMUwxMCA2LjExMDk2TDEwIDAuOTk5OTk5TDE1IDZaIiBmaWxsPSIjRUFDMjgyIi8+PHBhdGggZD0iTTE1IDE1TDE1IDE2TDE2IDE2TDE2IDE1TDE1IDE1Wk0xNSA2TDE2IDZMMTYgNS41ODU3OUwxNS43MDcxIDUuMjkyODlMMTUgNlpNNiAxNUw1LjI5Mjg5IDE1LjcwNzFMNS41ODU3OSAxNkw2IDE2TDYgMTVaTTEgMTBMMSA5TC0xLjQxNDIxIDlMMC4yOTI4OTMgMTAuNzA3MUwxIDEwWk02LjExMDg2IDEwTDYuMTEwODYgMTFMOC41MjUwNyAxMUw2LjgxNzk3IDkuMjkyODlMNi4xMTA4NiAxMFpNMC45OTk5NSA0Ljg4OTA5TDAuMjkyODQ0IDQuMTgxOThMLTAuNDE0MjYzIDQuODg5MDlMMC4yOTI4NDQgNS41OTYxOUwwLjk5OTk1IDQuODg5MDlaTTQuODg5MDQgMUw1LjU5NjE0IDAuMjkyODkzTDQuODg5MDQgLTAuNDE0MjE0TDQuMTgxOTMgMC4yOTI4OTNMNC44ODkwNCAxWk0xMCA2LjExMDk2TDkuMjkyODkgNi44MTgwN0wxMSA4LjUyNTE4TDExIDYuMTEwOTZMMTAgNi4xMTA5NlpNMTAgMC45OTk5OTlMMTAuNzA3MSAwLjI5Mjg5M0w5IC0xLjQxNDIxTDkgMC45OTk5OTlMMTAgMC45OTk5OTlaTTE2IDE1TDE2IDZMMTQgNkwxNCAxNUwxNiAxNVpNNiAxNkwxNSAxNkwxNSAxNEw2IDE0TDYgMTZaTTAuMjkyODkzIDEwLjcwNzFMNS4yOTI4OSAxNS43MDcxTDYuNzA3MTEgMTQuMjkyOUwxLjcwNzExIDkuMjkyODlMMC4yOTI4OTMgMTAuNzA3MVpNNi4xMTA4NiA5TDEgOUwxIDExTDYuMTEwODYgMTFMNi4xMTA4NiA5Wk02LjgxNzk3IDkuMjkyODlMMS43MDcwNiA0LjE4MTk4TDAuMjkyODQ0IDUuNTk2MTlMNS40MDM3NSAxMC43MDcxTDYuODE3OTcgOS4yOTI4OVpNMS43MDcwNiA1LjU5NjE5TDUuNTk2MTQgMS43MDcxMUw0LjE4MTkzIDAuMjkyODkzTDAuMjkyODQ0IDQuMTgxOThMMS43MDcwNiA1LjU5NjE5Wk00LjE4MTkzIDEuNzA3MTFMOS4yOTI4OSA2LjgxODA3TDEwLjcwNzEgNS40MDM4Nkw1LjU5NjE0IDAuMjkyODkzTDQuMTgxOTMgMS43MDcxMVpNOSAwLjk5OTk5OUw5IDYuMTEwOTZMMTEgNi4xMTA5NkwxMSAwLjk5OTk5OUw5IDAuOTk5OTk5Wk0xNS43MDcxIDUuMjkyODlMMTAuNzA3MSAwLjI5Mjg5M0w5LjI5Mjg5IDEuNzA3MTFMMTQuMjkyOSA2LjcwNzExTDE1LjcwNzEgNS4yOTI4OVoiIGZpbGw9IiNBNDgwMkIiIG1hc2s9InVybCgjcGF0aC0xLWluc2lkZS0xKSIvPjwvc3ZnPg==';
	var sSide = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIj48bWFzayBpZD0icGF0aC0xLWluc2lkZS0xIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiA3LjVMMTAuNSAxNEwzLjUgMTRMNy41IDEwTDMuNDYyOTZlLTA4IDEwTDEuNTM5MDllLTA4IDVMNy41IDVMMy41IDFMMTAuNSAxTDE2IDcuNVoiLz48L21hc2s+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiA3LjVMMTAuNSAxNEwzLjUgMTRMNy41IDEwTDMuNDYyOTZlLTA4IDEwTDEuNTM5MDllLTA4IDVMNy41IDVMMy41IDFMMTAuNSAxTDE2IDcuNVoiIGZpbGw9IiNFQUMyODIiLz48cGF0aCBkPSJNMTAuNSAxNEwxMC41IDE1TDEwLjk2MzggMTVMMTEuMjYzNCAxNC42NDU5TDEwLjUgMTRaTTE2IDcuNUwxNi43NjM0IDguMTQ1OTRMMTcuMzEgNy41TDE2Ljc2MzQgNi44NTQwNkwxNiA3LjVaTTMuNSAxNEwyLjc5Mjg5IDEzLjI5MjlMMS4wODU3OSAxNUwzLjUgMTVMMy41IDE0Wk03LjUgMTBMOC4yMDcxMSAxMC43MDcxTDkuOTE0MjEgOUw3LjUgOUw3LjUgMTBaTTMuNDYyOTZlLTA4IDEwTC0xIDEwTC0xIDExTDMuODQ3NzNlLTA4IDExTDMuNDYyOTZlLTA4IDEwWk0xLjUzOTA5ZS0wOCA1TDQuMzMzMjNlLTA4IDRMLTEgNEwtMSA1TDEuNTM5MDllLTA4IDVaTTcuNSA1TDcuNSA2TDkuOTE0MjEgNkw4LjIwNzExIDQuMjkyODlMNy41IDVaTTMuNSAxTDMuNSA0LjYxOTdlLTA3TDEuMDg1NzkgNS4wMjM3MWUtMDdMMi43OTI4OSAxLjcwNzExTDMuNSAxWk0xMC41IDFMMTEuMjYzNCAwLjM1NDA1OEwxMC45NjM4IDMuMzcwNjZlLTA3TDEwLjUgMy40NDgyOGUtMDdMMTAuNSAxWk0xMS4yNjM0IDE0LjY0NTlMMTYuNzYzNCA4LjE0NTk0TDE1LjIzNjYgNi44NTQwNkw5LjczNjYxIDEzLjM1NDFMMTEuMjYzNCAxNC42NDU5Wk0zLjUgMTVMMTAuNSAxNUwxMC41IDEzTDMuNSAxM0wzLjUgMTVaTTYuNzkyODkgOS4yOTI4OUwyLjc5Mjg5IDEzLjI5MjlMNC4yMDcxMSAxNC43MDcxTDguMjA3MTEgMTAuNzA3MUw2Ljc5Mjg5IDkuMjkyODlaTTcuNSA5TDMuMDc4MThlLTA4IDlMMy44NDc3M2UtMDggMTFMNy41IDExTDcuNSA5Wk0xIDEwTDEgNUwtMSA1TC0xIDEwTDEgMTBaTS0xLjI1NTA1ZS0wOCA2TDcuNSA2TDcuNSA0TDQuMzMzMjNlLTA4IDRMLTEuMjU1MDVlLTA4IDZaTTIuNzkyODkgMS43MDcxMUw2Ljc5Mjg5IDUuNzA3MTFMOC4yMDcxMSA0LjI5Mjg5TDQuMjA3MTEgMC4yOTI4OTRMMi43OTI4OSAxLjcwNzExWk0xMC41IDMuNDQ4MjhlLTA3TDMuNSA0LjYxOTdlLTA3TDMuNSAyTDEwLjUgMkwxMC41IDMuNDQ4MjhlLTA3Wk0xNi43NjM0IDYuODU0MDZMMTEuMjYzNCAwLjM1NDA1OEw5LjczNjYxIDEuNjQ1OTRMMTUuMjM2NiA4LjE0NTk0TDE2Ljc2MzQgNi44NTQwNloiIGZpbGw9IiM5NjZFMEMiIG1hc2s9InVybCgjcGF0aC0xLWluc2lkZS0xKSIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+';
	var sUpIncline = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWFzayBpZD0icGF0aC0xLWluc2lkZS0xIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSAxMEwxNSAxTDYgMC45OTk5OTlMMSA2TDYuMTEwODYgNkwwLjk5OTk1IDExLjExMDlMNC44ODkwNCAxNUwxMCA5Ljg4OTA0TDEwIDE1TDE1IDEwWiIvPjwvbWFzaz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1IDEwTDE1IDFMNiAwLjk5OTk5OUwxIDZMNi4xMTA4NiA2TDAuOTk5OTUgMTEuMTEwOUw0Ljg4OTA0IDE1TDEwIDkuODg5MDRMMTAgMTVMMTUgMTBaIiBmaWxsPSIjRUFDMjgyIi8+PHBhdGggZD0iTTE1IDFMMTYgMUwxNiAxLjQ0NTAyZS0wN0wxNSAwTDE1IDFaTTE1IDEwTDE1LjcwNzEgMTAuNzA3MUwxNiAxMC40MTQyTDE2IDEwTDE1IDEwWk02IDAuOTk5OTk5TDYgLTEuMzAwNTJlLTA2TDUuNTg1NzkgLTEuMzYwMzdlLTA2TDUuMjkyODkgMC4yOTI4OTJMNiAwLjk5OTk5OVpNMSA2TDAuMjkyODkzIDUuMjkyODlMLTEuNDE0MjEgN0wxIDdMMSA2Wk02LjExMDg2IDZMNi44MTc5NyA2LjcwNzExTDguNTI1MDggNUw2LjExMDg2IDVMNi4xMTA4NiA2Wk0wLjk5OTk1IDExLjExMDlMMC4yOTI4NDMgMTAuNDAzOEwtMC40MTQyNjMgMTEuMTEwOUwwLjI5Mjg0NCAxMS44MThMMC45OTk5NSAxMS4xMTA5Wk00Ljg4OTA0IDE1TDQuMTgxOTMgMTUuNzA3MUw0Ljg4OTA0IDE2LjQxNDJMNS41OTYxNCAxNS43MDcxTDQuODg5MDQgMTVaTTEwIDkuODg5MDRMMTEgOS44ODkwNEwxMSA3LjQ3NDgyTDkuMjkyODkgOS4xODE5M0wxMCA5Ljg4OTA0Wk0xMCAxNUw5IDE1TDkgMTcuNDE0MkwxMC43MDcxIDE1LjcwNzFMMTAgMTVaTTE0IDFMMTQgMTBMMTYgMTBMMTYgMUwxNCAxWk02IDJMMTUgMkwxNSAwTDYgLTEuMzAwNTJlLTA2TDYgMlpNMS43MDcxMSA2LjcwNzExTDYuNzA3MTEgMS43MDcxMUw1LjI5Mjg5IDAuMjkyODkyTDAuMjkyODkzIDUuMjkyODlMMS43MDcxMSA2LjcwNzExWk02LjExMDg2IDVMMSA1TDEgN0w2LjExMDg2IDdMNi4xMTA4NiA1Wk01LjQwMzc2IDUuMjkyODlMMC4yOTI4NDMgMTAuNDAzOEwxLjcwNzA2IDExLjgxOEw2LjgxNzk3IDYuNzA3MTFMNS40MDM3NiA1LjI5Mjg5Wk0wLjI5Mjg0NCAxMS44MThMNC4xODE5MyAxNS43MDcxTDUuNTk2MTQgMTQuMjkyOUwxLjcwNzA2IDEwLjQwMzhMMC4yOTI4NDQgMTEuODE4Wk01LjU5NjE0IDE1LjcwNzFMMTAuNzA3MSAxMC41OTYxTDkuMjkyODkgOS4xODE5M0w0LjE4MTkzIDE0LjI5MjlMNS41OTYxNCAxNS43MDcxWk0xMSAxNUwxMSA5Ljg4OTA0TDkgOS44ODkwNEw5IDE1TDExIDE1Wk0xNC4yOTI5IDkuMjkyODlMOS4yOTI4OSAxNC4yOTI5TDEwLjcwNzEgMTUuNzA3MUwxNS43MDcxIDEwLjcwNzFMMTQuMjkyOSA5LjI5Mjg5WiIgZmlsbD0iI0E0ODAyQiIgbWFzaz0idXJsKCNwYXRoLTEtaW5zaWRlLTEpIi8+PC9zdmc+';
	var sUp = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIj48bWFzayBpZD0icGF0aC0xLWluc2lkZS0xIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjUgMEwxNCA1LjVWMTEuNUwxMCA4LjNWMTVMNSAxNUw1IDguM0wxIDExLjVMMSA1LjVMNy41IDBaIi8+PC9tYXNrPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy41IDBMMTQgNS41VjExLjVMMTAgOC4zVjE1TDUgMTVMNSA4LjNMMSAxMS41TDEgNS41TDcuNSAwWiIgZmlsbD0iIzY4QTQ5MCIvPjxwYXRoIGQ9Ik0xNCA1LjVMMTUgNS41VjUuMDM2MkwxNC42NDU5IDQuNzM2NjFMMTQgNS41Wk03LjUgMEw4LjE0NTk0IC0wLjc2MzM4Nkw3LjUgLTEuMzA5OTVMNi44NTQwNiAtMC43NjMzODZMNy41IDBaTTE0IDExLjVMMTMuMzc1MyAxMi4yODA5TDE1IDEzLjU4MDZWMTEuNUgxNFpNMTAgOC4zTDEwLjYyNDcgNy41MTkxM0w5IDYuMjE5MzhWOC4zSDEwWk0xMCAxNVYxNkgxMVYxNUgxMFpNNSAxNUg0TDQgMTZINVYxNVpNNSA4LjNINlY2LjIxOTM4TDQuMzc1MyA3LjUxOTEzTDUgOC4zWk0xIDExLjVIMEwwIDEzLjU4MDZMMS42MjQ3IDEyLjI4MDlMMSAxMS41Wk0xIDUuNUwwLjM1NDA1OCA0LjczNjYxTDAgNS4wMzYyVjUuNUgxWk0xNC42NDU5IDQuNzM2NjFMOC4xNDU5NCAtMC43NjMzODZMNi44NTQwNiAwLjc2MzM4NkwxMy4zNTQxIDYuMjYzMzlMMTQuNjQ1OSA0LjczNjYxWk0xNSAxMS41VjUuNUwxMyA1LjVWMTEuNUwxNSAxMS41Wk05LjM3NTMgOS4wODA4N0wxMy4zNzUzIDEyLjI4MDlMMTQuNjI0NyAxMC43MTkxTDEwLjYyNDcgNy41MTkxM0w5LjM3NTMgOS4wODA4N1pNOSA4LjNWMTVIMTFWOC4zSDlaTTEwIDE0TDUgMTRWMTZMMTAgMTZWMTRaTTYgMTVMNiA4LjNINFYxNUg2Wk0xLjYyNDcgMTIuMjgwOUw1LjYyNDcgOS4wODA4N0w0LjM3NTMgNy41MTkxM0wwLjM3NTMwNSAxMC43MTkxTDEuNjI0NyAxMi4yODA5Wk0wIDUuNUwwIDExLjVIMkwyIDUuNUgwWk02Ljg1NDA2IC0wLjc2MzM4NkwwLjM1NDA1OCA0LjczNjYxTDEuNjQ1OTQgNi4yNjMzOUw4LjE0NTk0IDAuNzYzMzg2TDYuODU0MDYgLTAuNzYzMzg2WiIgZmlsbD0iIzMyNkY1QiIgbWFzaz0idXJsKCNwYXRoLTEtaW5zaWRlLTEpIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=';

	var c_arrIcons = [20];
	c_arrIcons[EIconSetType.Traffic3Lights1] = [sDownIncline];
	c_arrIcons[EIconSetType.Arrows3] = [sDown, sSide, sUp];
	c_arrIcons[EIconSetType.Arrows5] = [sDown, sDownIncline, sSide, sUpIncline, sUp];

	function getIconsForLoad() {
		return [sDown, sDownIncline, sSide, sUpIncline, sUp];
	}

	function getIconByType(type, index) {
		var icons = c_arrIcons[type] || c_arrIcons[EIconSetType.Traffic3Lights1];
		return icons[index] || icons[icons.length - 1];
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
	window['AscCommonExcel'].getIconByType = getIconByType;
})(window);
