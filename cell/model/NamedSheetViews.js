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

(function (undefined) {
	function CT_NamedSheetView() {
		this.nsvFilters = [];
		//this.extLst
		this.name = null;
		this.id = null;

		this.ws = null;

		this._isActive = null;

		//this.Id = AscCommon.g_oIdCounter.Get_NewId();

		return this;
	}

	CT_NamedSheetView.prototype.clone = function () {
		var res = new CT_NamedSheetView();

		for (var i = 0; i < this.nsvFilters.length; ++i) {
			res.nsvFilters[i] = this.nsvFilters[i].clone();
		}

		res.name = this.name;
		res.id = this.id;
		res.ws = this.ws;

		return res;
	};

	CT_NamedSheetView.prototype.setWS = function (ws) {
		this.ws = ws;
	};

	function CT_NsvFilter() {
		this.columnsFilter = [];
		this.sortRules = null;
		//this.extLst
		this.filterId = null;
		this.ref = null;
		this.tableId = null;

		return this;
	}

	CT_NsvFilter.prototype.clone = function () {
		var res = new CT_NsvFilter();
		res.columnFilter = this.columnFilter ? this.columnFilter.clone() : null;
		for (var i = 0; i < this.sortRules.length; ++i) {
			res.sortRules[i] = this.sortRules[i].clone();
		}

		res.filterId = this.filterId;
		res.ref = this.ref;
		res.tableId = this.tableId;
		return res;
	};

	CT_NsvFilter.prototype.initPostOpen = function (tableIds) {
		var table = null;
		if (null != this.tableId) {
			table = tableIds[this.tableId];
			if (table) {
				this.tableId = table.DisplayName;
			}
		}
		return table;
	};

	CT_NsvFilter.prototype.getColumnFilterByColId = function (id) {
		for (var i = 0; i < this.columnsFilter.length; ++i) {
			if (this.columnsFilter.colId === id) {
				return this.columnsFilter[i];
			}
		}
	};

	CT_NsvFilter.prototype.init = function (obj) {
		if (obj) {
			var af;
			if (obj.isTable()) {
				this.ref = obj.Ref;
				this.tableId = obj.DisplayName;
				af = obj.AutoFilter;
			} else {
				this.ref = obj.Ref;
				this.tableId = "0";
				af = obj;
			}

			if (af) {
				for (var i = 0; i < af.FilterColumns.length; i++) {
					var newColumnFilter = new CT_ColumnFilter();
					newColumnFilter.colId = af.FilterColumns[i].ColId;
					newColumnFilter.filter = af.FilterColumns[i].clone();
					this.columnsFilter.push(newColumnFilter);
				}
			}
		}
	};


	function CT_ColumnFilter() {
		this.dxf = null;
		this.filter = null;
		//this.extLst

		//нужно ли?
		this.colId = null;
		this.id = null;

		return this;
	}

	CT_ColumnFilter.prototype.clone = function () {
		var res = new CT_ColumnFilter();
		res.dxf = this.dxf ? this.dxf.clone() : null;
		res.filter = this.filter ? this.filter.clone() : null;

		return res;
	};


	function CT_SortRule() {
		this.dxf = null;
		this.sortCondition = null;
		this.richSortCondition = null;

		//нужно ли?
		this.colId = null;
		this.id = null;

		return this;
	}

	CT_SortRule.prototype.clone = function () {
		var res = new CT_SortRule();
		res.dxf = this.dxf ? this.dxf.clone() : null;
		res.sortCondition = this.sortCondition ? this.sortCondition.clone() : null;
		res.richSortCondition = this.richSortCondition ? this.richSortCondition.clone() : null;

		return res;
	};

	window["Asc"]["CT_NamedSheetView"] = window['Asc'].CT_NamedSheetView = CT_NamedSheetView;
	window["Asc"]["CT_NsvFilter"] = window['Asc'].CT_NsvFilter = CT_NsvFilter;
	window["Asc"]["CT_ColumnFilter"] = window['Asc'].CT_ColumnFilter = CT_ColumnFilter;
	window["Asc"]["CT_SortRule"] = window['Asc'].CT_SortRule = CT_SortRule;

})(window);