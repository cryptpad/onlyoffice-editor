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
	var EDataValidationType = {
		None: 0,
		Custom: 1,
		Date: 2,
		Decimal: 3,
		List: 4,
		TextLength: 5,
		Time: 6,
		Whole: 7
	};
	var EDataValidationErrorStyle = {
		Stop: 0,
		Warning: 1,
		Information: 2
	};
	var EDataValidationImeMode = {
		NoControl: 0,
		Off: 1,
		On: 2,
		Disabled: 3,
		Hiragana: 4,
		FullKatakana: 5,
		HalfKatakana: 6,
		FullAlpha: 7,
		HalfAlpha: 8,
		FullHangul: 9,
		HalfHangul: 10
	};
	var EDataValidationOperator = {
		Between: 0,
		NotBetween: 1,
		Equal: 2,
		NotEqual: 3,
		LessThan: 4,
		LessThanOrEqual: 5,
		GreaterThan: 6,
		GreaterThanOrEqual: 7
	};

	function CDataValidation() {
		this.sqRef = null;

		this.allowBlank = false;
		this.showDropDown = false;
		this.showErrorMessage = false;
		this.showInputMessage = false;
		this.type = EDataValidationType.None;
		this.errorStyle = EDataValidationErrorStyle.Stop;
		this.imeMode = EDataValidationImeMode.NoControl;
		this.operator = EDataValidationOperator.Between;
		this.error = null;
		this.errorTitle = null;
		this.promt = null;
		this.promptTitle = null;

		this.formula1 = null;
		this.formula2 = null;

		return this;
	}

	CDataValidation.prototype.clone = function() {
		var res = new CDataValidation();
		res.sqRef = this.sqRef;
		res.allowBlank = this.allowBlank;
		res.showDropDown = this.showDropDown;
		res.showErrorMessage = this.showErrorMessage;
		res.showInputMessage = this.showInputMessage;
		res.type = this.type;
		res.errorStyle = this.errorStyle;
		res.imeMode = this.imeMode;
		res.operator = this.operator;
		res.error = this.error;
		res.errorTitle = this.errorTitle;
		res.promt = this.promt;
		res.promptTitle = this.promptTitle;
		res.formula1 = this.formula1;
		res.formula2 = this.formula2;
		return res;
	};

	function CDataValidations() {
		this.disablePrompts = false;
		this.xWindow = null;
		this.yWindow = null;

		this.elems = [];

		return this;
	}

	CDataValidations.prototype.clone = function() {
		var i, res = new CDataValidations();
		res.disablePrompts = this.disablePrompts;
		res.xWindow = this.xWindow;
		res.yWindow = this.yWindow;
		for (i = 0; i < this.elems.length; ++i)
			res.elems.push(this.elems[i].clone());
		return res;
	};

	/*
	 * Export
	 * -----------------------------------------------------------------------------
	 */
	window['Asc'] = window['Asc'] || {};
	window['Asc'].EDataValidationType = EDataValidationType;
	window['Asc'].EDataValidationErrorStyle = EDataValidationErrorStyle;
	window['Asc'].EDataValidationImeMode = EDataValidationImeMode;

	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CDataValidation = CDataValidation;
	window['AscCommonExcel'].CDataValidations = CDataValidations;
})(window);
