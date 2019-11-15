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

$(function() {
	// function getDataMatrix(ws, range) {
	// 	var res = [];
	// 	ws.getRange3(range.r1, range.c1, range.r2, range.c2)._foreach(function(cell, r, c, r1, c1) {
	// 		if (!res[r - r1]) {
	// 			res[r - r1] = [];
	// 		}
	// 		res[r - r1][c - c1] = cell.getValue();
	// 	});
	// 	return res;
	// }
	//
	// function getTestMatrix(ws) {
	// 	if (!ws || !ws.pivotTables[0]) {
	// 		return "";
	// 	}
	// 	var res = [];
	// 	var ranges = ws.pivotTables[0].getReportRanges();
	// 	for (var i = 0; i < ranges.length; ++i) {
	// 		res.push(getDataMatrix(ws, ranges[i]));
	// 	}
	// 	var str = "[\n";
	// 	for (var i = 0; i < res.length; ++i) {
	// 		var row = res[i];
	// 		str += "[\n";
	// 		for (var j = 0; j < row.length; ++j) {
	// 			str += JSON.stringify(row[j]);
	// 			if (j + 1 < row.length) {
	// 				str += ",\n";
	// 			} else {
	// 				str += "\n";
	// 			}
	// 		}
	// 		if (i + 1 < res.length) {
	// 			str += "],\n";
	// 		} else {
	// 			str += "]\n";
	// 		}
	// 	}
	// 	str += "]\n";
	// 	return str;
	// };
	// baseEditorsApi.prototype.onDocumentContentReady = function() {
	// 	console.log(getTestMatrix(this.wbModel.aWorksheets[0]));
	// };

	Asc.spreadsheet_api.prototype._init = function() {
	};
	Asc.spreadsheet_api.prototype._loadFonts = function(fonts, callback) {
		callback();
	};
	AscCommonExcel.WorkbookView.prototype._calcMaxDigitWidth = function() {
	};
	AscCommonExcel.WorkbookView.prototype._init = function() {
	};
	AscCommonExcel.WorkbookView.prototype._onWSSelectionChanged = function() {
	};
	AscCommonExcel.WorksheetView.prototype._init = function() {
	};
	AscCommonExcel.WorksheetView.prototype._onUpdateFormatTable = function() {
	};
	AscCommonExcel.WorksheetView.prototype.setSelection = function() {
	};
	AscCommonExcel.WorksheetView.prototype.draw = function() {
	};
	AscCommonExcel.WorksheetView.prototype._prepareDrawingObjects = function() {
	};
	AscCommon.baseEditorsApi.prototype._onEndLoadSdk = function() {
	};


	var sData = AscCommon.getEmpty();
	var api = new Asc.spreadsheet_api({
		'id-view': 'editor_sdk'
	});
	api.FontLoader = {
		LoadDocumentFonts: function() {
			setTimeout(startTests, 0)
		}
	};
	window["Asc"]["editor"] = api;
	AscCommon.g_oTableId.init();
	api._onEndLoadSdk();
	api._openDocument(sData);
	api._openOnClient();
	api.collaborativeEditing = new AscCommonExcel.CCollaborativeEditing({});
	api.wb = new AscCommonExcel.WorkbookView(api.wbModel, api.controller, api.handlers, api.HtmlElement,
		api.topLineEditorElement, api, api.collaborativeEditing, api.fontRenderingMode);
	var wb = api.wbModel;
	wb.handlers.add("getSelectionState", function() {
		return null;
	});
	var ws = api.wbModel.aWorksheets[0];

	var reportRange = AscCommonExcel.g_oRangeCache.getAscRange("B20");
	var testDataRange = AscCommonExcel.g_oRangeCache.getAscRange("B2:H13");
	var testData = [
		["Region", "Gender", "Style", "Ship date", "Units", "Price", "Cost"],
		["East", "Boy", "Tee", "38383", "12", "11.04", "10.42"],
		["East", "Boy", "Golf", "38383", "12", "13", "12.6"],
		["East", "Boy", "Fancy", "38383", "12", "11.96", "11.74"],
		["East", "Girl", "Tee", "38383", "10", "11.27", "10.56"],
		["East", "Girl", "Golf", "38383", "10", "12.12", "11.95"],
		["East", "Girl", "Fancy", "38383", "10", "13.74", "13.33"],
		["West", "Boy", "Tee", "38383", "11", "11.44", "10.94"],
		["West", "Boy", "Golf", "38383", "11", "12.63", "11.73"],
		["West", "Boy", "Fancy", "38383", "11", "12.06", "11.51"],
		["West", "Girl", "Tee", "38383", "15", "13.42", "13.29"],
		["West", "Girl", "Golf", "38383", "15", "11.48", "10.67"]
	];

	function fillData(ws, range) {
		var range = ws.getRange4(range.r1, range.c1);
		for (var i = 0; i < testData.length; ++i) {
			var row = testData[i];
			for (var j = 0; j < row.length; ++j) {
				range.setOffset(new AscCommon.CellBase(i, j));
				range.setValue(row[j]);
				range.setOffset(new AscCommon.CellBase(-i, -j));
			}
		}
	}

	function getDataMatrix(ws, range) {
		var res = [];
		ws.getRange3(range.r1, range.c1, range.r2, range.c2)._foreach(function(cell, r, c, r1, c1) {
			if (!res[r - r1]) {
				res[r - r1] = [];
			}
			res[r - r1][c - c1] = cell.getValue();
		});
		return res;
	}

	function checkReportRange(pivot, standard, message) {
		var ranges = pivot.getReportRanges();
		//strictEqual(ranges.length, standard.length, message + "_count");
		for (var i = 0; i < ranges.length; ++i) {
			deepEqual(getDataMatrix(pivot.GetWS(), ranges[i]), standard[i], message + "_" + i);
		}

		var styleError = "";
		var dataError = "";
		var ws = pivot.GetWS();
		ws._forEachCell(function(cell) {
			if (!testDataRange.contains(cell.nCol, cell.nRow)) {
				var inPivot = ranges.some(function(range) {
					return range.contains(cell.nCol, cell.nRow);
				});
				var compiledStyle = ws.sheetMergedStyles.getStyle(ws.hiddenManager, cell.nRow, cell.nCol, ws);
				if (inPivot) {
					if (!compiledStyle || 0 === compiledStyle.table.length) {
						styleError = cell.getName();
					}
				} else {
					if (compiledStyle && 0 < compiledStyle.table.length) {
						styleError = cell.getName();
					}
					if (!cell.isEmptyTextString()) {
						dataError = cell.getName();
					}
				}
			}
		});
		if (pivot.getColumnFieldsCount() + pivot.getRowFieldsCount(true) > 0) {
			strictEqual(styleError, "", message + "_styleError");
		}
		strictEqual(dataError, "", message + "_dataError");
	}

	function checkOperation(pivot, standardsUndo, standards, message) {
		checkReportRange(pivot, standards, message);
		if (standardsUndo) {
			var wb = pivot.GetWS().workbook;
			var changes = wb.SerializeHistory();
			AscCommon.History.Undo();
			checkReportRange(pivot, standardsUndo, message + "_undo");
			AscCommon.History.Redo();
			checkReportRange(pivot, standards, message + "_redo");
			AscCommon.History.Undo();
			wb.DeserializeHistory(changes);
			checkReportRange(pivot, standards, message + "_changes");
		}
	}

	var standards = {
		"compact_0row_0col_0data": [
			[
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""]
			]
		],
		"compact_0row_0col_1data": [
			[
				["Sum of Price"],
				["134.16"]
			]
		],
		"compact_0row_0col_2data_col": [
			[
				["Sum of Price", "Sum of Cost"],
				["134.16", "128.74"]
			]
		],
		"compact_0row_0col_2data_row": [
			[
				["Values", ""],
				["Sum of Price", "134.16"],
				["Sum of Cost", "128.74"]
			]
		],
		"compact_0row_1col_0data": [
			[
				["Column Labels", "", "", ""],
				["Fancy", "Golf", "Tee", "Grand Total"]
			]
		],
		"compact_0row_1col_1data": [
			[
				["", "Column Labels", "", "", ""],
				["", "Fancy", "Golf", "Tee", "Grand Total"],
				["Sum of Price", "37.76", "49.23", "47.17", "134.16"]
			]
		],
		"compact_0row_1col_2data_col": [
			[
				["Column Labels", "", "", "", "", "", "", ""],
				["Fancy", "", "Golf", "", "Tee", "", "Total Sum of Price", "Total Sum of Cost"],
				["Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "", ""],
				["37.76", "36.58", "49.23", "46.95", "47.17", "45.21", "134.16", "128.74"]
			]
		],
		"compact_0row_1col_2data_row": [
			[
				["", "Column Labels", "", "", ""],
				["Values", "Fancy", "Golf", "Tee", "Grand Total"],
				["Sum of Price", "37.76", "49.23", "47.17", "134.16"],
				["Sum of Cost", "36.58", "46.95", "45.21", "128.74"]
			]
		],
		"compact_0row_2col_0data": [
			[
				["Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""]
			]
		],
		"compact_0row_2col_1data": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["Sum of Price", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23", "11.27",
					"11.44", "11.04", "13.42", "47.17", "134.16"
				]
			]
		],
		"compact_0row_2col_2data_col": [
			[
				["Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", ""
				],
				["Fancy", "", "", "", "", "", "Fancy Sum of Price", "Fancy Sum of Cost", "Golf", "", "", "", "", "", "",
					"", "Golf Sum of Price", "Golf Sum of Cost", "Tee", "", "", "", "", "", "", "", "Tee Sum of Price",
					"Tee Sum of Cost", "Total Sum of Price", "Total Sum of Cost"
				],
				["10", "", "11", "", "12", "", "", "", "10", "", "11", "", "12", "", "15", "", "", "", "10", "", "11",
					"", "12", "", "15", "", "", "", "", ""
				],
				["Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "", "",
					"Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost",
					"Sum of Price", "Sum of Cost", "", "", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost",
					"Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "", "", "", ""
				],
				["13.74", "13.33", "12.06", "11.51", "11.96", "11.74", "37.76", "36.58", "12.12", "11.95", "12.63",
					"11.73", "13", "12.6", "11.48", "10.67", "49.23", "46.95", "11.27", "10.56", "11.44", "10.94",
					"11.04", "10.42", "13.42", "13.29", "47.17", "45.21", "134.16", "128.74"
				]
			]
		],
		"compact_0row_2col_2data_row": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Values", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["Sum of Price", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23", "11.27",
					"11.44", "11.04", "13.42", "47.17", "134.16"
				],
				["Sum of Cost", "13.33", "11.51", "11.74", "36.58", "11.95", "11.73", "12.6", "10.67", "46.95", "10.56",
					"10.94", "10.42", "13.29", "45.21", "128.74"
				]
			]
		],
		"compact_1row_0col_0data": [
			[
				["Row Labels"],
				["East"],
				["West"],
				["Grand Total"]
			]
		],
		"compact_1row_0col_1data": [
			[
				["Row Labels", "Sum of Price"],
				["East", "73.13"],
				["West", "61.03"],
				["Grand Total", "134.16"]
			]
		],
		"compact_1row_0col_2data_col": [
			[
				["Row Labels", "Sum of Price", "Sum of Cost"],
				["East", "73.13", "70.6"],
				["West", "61.03", "58.14"],
				["Grand Total", "134.16", "128.74"]
			]
		],
		"compact_1row_0col_2data_row": [
			[
				["Row Labels", ""],
				["East", ""],
				["Sum of Price", "73.13"],
				["Sum of Cost", "70.6"],
				["West", ""],
				["Sum of Price", "61.03"],
				["Sum of Cost", "58.14"],
				["Total Sum of Price", "134.16"],
				["Total Sum of Cost", "128.74"]
			]
		],
		"compact_1row_1col_0data": [
			[
				["", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "", "", "", ""],
				["West", "", "", "", ""],
				["Grand Total", "", "", "", ""]
			]
		],
		"compact_1row_1col_1data": [
			[
				["Sum of Price", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "25.7", "25.12", "22.31", "73.13"],
				["West", "12.06", "24.11", "24.86", "61.03"],
				["Grand Total", "37.76", "49.23", "47.17", "134.16"]
			]
		],
		"compact_1row_1col_2data_col": [
			[
				["", "Column Labels", "", "", "", "", "", "", ""],
				["", "Fancy", "", "Golf", "", "Tee", "", "Total Sum of Price", "Total Sum of Cost"],
				["Row Labels", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "", ""
				],
				["East", "25.7", "25.07", "25.12", "24.55", "22.31", "20.98", "73.13", "70.6"],
				["West", "12.06", "11.51", "24.11", "22.4", "24.86", "24.23", "61.03", "58.14"],
				["Grand Total", "37.76", "36.58", "49.23", "46.95", "47.17", "45.21", "134.16", "128.74"]
			]
		],
		"compact_1row_1col_2data_row": [
			[
				["", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "", "", "", ""],
				["Sum of Price", "25.7", "25.12", "22.31", "73.13"],
				["Sum of Cost", "25.07", "24.55", "20.98", "70.6"],
				["West", "", "", "", ""],
				["Sum of Price", "12.06", "24.11", "24.86", "61.03"],
				["Sum of Cost", "11.51", "22.4", "24.23", "58.14"],
				["Total Sum of Price", "37.76", "49.23", "47.17", "134.16"],
				["Total Sum of Cost", "36.58", "46.95", "45.21", "128.74"]
			]
		],
		"compact_1row_2col_0data": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["West", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Grand Total", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
			]
		],
		"compact_1row_2col_1data": [
			[
				["Sum of Price", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "13.74", "", "11.96", "25.7", "12.12", "", "13", "", "25.12", "11.27", "", "11.04", "",
					"22.31", "73.13"
				],
				["West", "", "12.06", "", "12.06", "", "12.63", "", "11.48", "24.11", "", "11.44", "", "13.42", "24.86",
					"61.03"
				],
				["Grand Total", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23", "11.27",
					"11.44", "11.04", "13.42", "47.17", "134.16"
				]
			]
		],
		"compact_1row_2col_2data_col": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", ""
				],
				["", "Fancy", "", "", "", "", "", "Fancy Sum of Price", "Fancy Sum of Cost", "Golf", "", "", "", "", "",
					"", "", "Golf Sum of Price", "Golf Sum of Cost", "Tee", "", "", "", "", "", "", "",
					"Tee Sum of Price", "Tee Sum of Cost", "Total Sum of Price", "Total Sum of Cost"
				],
				["", "10", "", "11", "", "12", "", "", "", "10", "", "11", "", "12", "", "15", "", "", "", "10", "",
					"11", "", "12", "", "15", "", "", "", "", ""
				],
				["Row Labels", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "", "", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "Sum of Price", "Sum of Cost", "", "", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "", "", "", ""
				],
				["East", "13.74", "13.33", "", "", "11.96", "11.74", "25.7", "25.07", "12.12", "11.95", "", "", "13",
					"12.6", "", "", "25.12", "24.55", "11.27", "10.56", "", "", "11.04", "10.42", "", "", "22.31",
					"20.98", "73.13", "70.6"
				],
				["West", "", "", "12.06", "11.51", "", "", "12.06", "11.51", "", "", "12.63", "11.73", "", "", "11.48",
					"10.67", "24.11", "22.4", "", "", "11.44", "10.94", "", "", "13.42", "13.29", "24.86", "24.23",
					"61.03", "58.14"
				],
				["Grand Total", "13.74", "13.33", "12.06", "11.51", "11.96", "11.74", "37.76", "36.58", "12.12",
					"11.95", "12.63", "11.73", "13", "12.6", "11.48", "10.67", "49.23", "46.95", "11.27", "10.56",
					"11.44", "10.94", "11.04", "10.42", "13.42", "13.29", "47.17", "45.21", "134.16", "128.74"
				]
			]
		],
		"compact_1row_2col_2data_row": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "13.74", "", "11.96", "25.7", "12.12", "", "13", "", "25.12", "11.27", "", "11.04", "",
					"22.31", "73.13"
				],
				["Sum of Cost", "13.33", "", "11.74", "25.07", "11.95", "", "12.6", "", "24.55", "10.56", "", "10.42",
					"", "20.98", "70.6"
				],
				["West", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "", "12.06", "", "12.06", "", "12.63", "", "11.48", "24.11", "", "11.44", "", "13.42",
					"24.86", "61.03"
				],
				["Sum of Cost", "", "11.51", "", "11.51", "", "11.73", "", "10.67", "22.4", "", "10.94", "", "13.29",
					"24.23", "58.14"
				],
				["Total Sum of Price", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23",
					"11.27", "11.44", "11.04", "13.42", "47.17", "134.16"
				],
				["Total Sum of Cost", "13.33", "11.51", "11.74", "36.58", "11.95", "11.73", "12.6", "10.67", "46.95",
					"10.56", "10.94", "10.42", "13.29", "45.21", "128.74"
				]
			]
		],
		"compact_2row_0col_0data": [
			[
				["Row Labels"],
				["East"],
				["Boy"],
				["Girl"],
				["West"],
				["Boy"],
				["Girl"],
				["Grand Total"]
			]
		],
		"compact_2row_0col_1data": [
			[
				["Row Labels", "Sum of Price"],
				["East", "73.13"],
				["Boy", "36"],
				["Girl", "37.13"],
				["West", "61.03"],
				["Boy", "36.13"],
				["Girl", "24.9"],
				["Grand Total", "134.16"]
			]
		],
		"compact_2row_0col_2data_col": [
			[
				["Row Labels", "Sum of Price", "Sum of Cost"],
				["East", "73.13", "70.6"],
				["Boy", "36", "34.76"],
				["Girl", "37.13", "35.84"],
				["West", "61.03", "58.14"],
				["Boy", "36.13", "34.18"],
				["Girl", "24.9", "23.96"],
				["Grand Total", "134.16", "128.74"]
			]
		],
		"compact_2row_0col_2data_row": [
			[
				["Row Labels", ""],
				["East", ""],
				["Boy", ""],
				["Sum of Price", "36"],
				["Sum of Cost", "34.76"],
				["Girl", ""],
				["Sum of Price", "37.13"],
				["Sum of Cost", "35.84"],
				["East Sum of Price", "73.13"],
				["East Sum of Cost", "70.6"],
				["West", ""],
				["Boy", ""],
				["Sum of Price", "36.13"],
				["Sum of Cost", "34.18"],
				["Girl", ""],
				["Sum of Price", "24.9"],
				["Sum of Cost", "23.96"],
				["West Sum of Price", "61.03"],
				["West Sum of Cost", "58.14"],
				["Total Sum of Price", "134.16"],
				["Total Sum of Cost", "128.74"]
			]
		],
		"compact_2row_1col_0data": [
			[
				["", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "", "", "", ""],
				["Boy", "", "", "", ""],
				["Girl", "", "", "", ""],
				["West", "", "", "", ""],
				["Boy", "", "", "", ""],
				["Girl", "", "", "", ""],
				["Grand Total", "", "", "", ""]
			]
		],
		"compact_2row_1col_1data": [
			[
				["Sum of Price", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "25.7", "25.12", "22.31", "73.13"],
				["Boy", "11.96", "13", "11.04", "36"],
				["Girl", "13.74", "12.12", "11.27", "37.13"],
				["West", "12.06", "24.11", "24.86", "61.03"],
				["Boy", "12.06", "12.63", "11.44", "36.13"],
				["Girl", "", "11.48", "13.42", "24.9"],
				["Grand Total", "37.76", "49.23", "47.17", "134.16"]
			]
		],
		"compact_2row_1col_2data_col": [
			[
				["", "Column Labels", "", "", "", "", "", "", ""],
				["", "Fancy", "", "Golf", "", "Tee", "", "Total Sum of Price", "Total Sum of Cost"],
				["Row Labels", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "", ""
				],
				["East", "25.7", "25.07", "25.12", "24.55", "22.31", "20.98", "73.13", "70.6"],
				["Boy", "11.96", "11.74", "13", "12.6", "11.04", "10.42", "36", "34.76"],
				["Girl", "13.74", "13.33", "12.12", "11.95", "11.27", "10.56", "37.13", "35.84"],
				["West", "12.06", "11.51", "24.11", "22.4", "24.86", "24.23", "61.03", "58.14"],
				["Boy", "12.06", "11.51", "12.63", "11.73", "11.44", "10.94", "36.13", "34.18"],
				["Girl", "", "", "11.48", "10.67", "13.42", "13.29", "24.9", "23.96"],
				["Grand Total", "37.76", "36.58", "49.23", "46.95", "47.17", "45.21", "134.16", "128.74"]
			]
		],
		"compact_2row_1col_2data_row": [
			[
				["", "Column Labels", "", "", ""],
				["Row Labels", "Fancy", "Golf", "Tee", "Grand Total"],
				["East", "", "", "", ""],
				["Boy", "", "", "", ""],
				["Sum of Price", "11.96", "13", "11.04", "36"],
				["Sum of Cost", "11.74", "12.6", "10.42", "34.76"],
				["Girl", "", "", "", ""],
				["Sum of Price", "13.74", "12.12", "11.27", "37.13"],
				["Sum of Cost", "13.33", "11.95", "10.56", "35.84"],
				["East Sum of Price", "25.7", "25.12", "22.31", "73.13"],
				["East Sum of Cost", "25.07", "24.55", "20.98", "70.6"],
				["West", "", "", "", ""],
				["Boy", "", "", "", ""],
				["Sum of Price", "12.06", "12.63", "11.44", "36.13"],
				["Sum of Cost", "11.51", "11.73", "10.94", "34.18"],
				["Girl", "", "", "", ""],
				["Sum of Price", "", "11.48", "13.42", "24.9"],
				["Sum of Cost", "", "10.67", "13.29", "23.96"],
				["West Sum of Price", "12.06", "24.11", "24.86", "61.03"],
				["West Sum of Cost", "11.51", "22.4", "24.23", "58.14"],
				["Total Sum of Price", "37.76", "49.23", "47.17", "134.16"],
				["Total Sum of Cost", "36.58", "46.95", "45.21", "128.74"]
			]
		],
		"compact_2row_2col_0data": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Boy", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Girl", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["West", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Boy", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Girl", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Grand Total", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
			]
		],
		"compact_2row_2col_1data": [
			[
				["Sum of Price", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "13.74", "", "11.96", "25.7", "12.12", "", "13", "", "25.12", "11.27", "", "11.04", "",
					"22.31", "73.13"
				],
				["Boy", "", "", "11.96", "11.96", "", "", "13", "", "13", "", "", "11.04", "", "11.04", "36"],
				["Girl", "13.74", "", "", "13.74", "12.12", "", "", "", "12.12", "11.27", "", "", "", "11.27", "37.13"],
				["West", "", "12.06", "", "12.06", "", "12.63", "", "11.48", "24.11", "", "11.44", "", "13.42", "24.86",
					"61.03"
				],
				["Boy", "", "12.06", "", "12.06", "", "12.63", "", "", "12.63", "", "11.44", "", "", "11.44", "36.13"],
				["Girl", "", "", "", "", "", "", "", "11.48", "11.48", "", "", "", "13.42", "13.42", "24.9"],
				["Grand Total", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23", "11.27",
					"11.44", "11.04", "13.42", "47.17", "134.16"
				]
			]
		],
		"compact_2row_2col_2data_col": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", ""
				],
				["", "Fancy", "", "", "", "", "", "Fancy Sum of Price", "Fancy Sum of Cost", "Golf", "", "", "", "", "",
					"", "", "Golf Sum of Price", "Golf Sum of Cost", "Tee", "", "", "", "", "", "", "",
					"Tee Sum of Price", "Tee Sum of Cost", "Total Sum of Price", "Total Sum of Cost"
				],
				["", "10", "", "11", "", "12", "", "", "", "10", "", "11", "", "12", "", "15", "", "", "", "10", "",
					"11", "", "12", "", "15", "", "", "", "", ""
				],
				["Row Labels", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "", "", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "Sum of Price", "Sum of Cost", "", "", "Sum of Price", "Sum of Cost", "Sum of Price",
					"Sum of Cost", "Sum of Price", "Sum of Cost", "Sum of Price", "Sum of Cost", "", "", "", ""
				],
				["East", "13.74", "13.33", "", "", "11.96", "11.74", "25.7", "25.07", "12.12", "11.95", "", "", "13",
					"12.6", "", "", "25.12", "24.55", "11.27", "10.56", "", "", "11.04", "10.42", "", "", "22.31",
					"20.98", "73.13", "70.6"
				],
				["Boy", "", "", "", "", "11.96", "11.74", "11.96", "11.74", "", "", "", "", "13", "12.6", "", "", "13",
					"12.6", "", "", "", "", "11.04", "10.42", "", "", "11.04", "10.42", "36", "34.76"
				],
				["Girl", "13.74", "13.33", "", "", "", "", "13.74", "13.33", "12.12", "11.95", "", "", "", "", "", "",
					"12.12", "11.95", "11.27", "10.56", "", "", "", "", "", "", "11.27", "10.56", "37.13", "35.84"
				],
				["West", "", "", "12.06", "11.51", "", "", "12.06", "11.51", "", "", "12.63", "11.73", "", "", "11.48",
					"10.67", "24.11", "22.4", "", "", "11.44", "10.94", "", "", "13.42", "13.29", "24.86", "24.23",
					"61.03", "58.14"
				],
				["Boy", "", "", "12.06", "11.51", "", "", "12.06", "11.51", "", "", "12.63", "11.73", "", "", "", "",
					"12.63", "11.73", "", "", "11.44", "10.94", "", "", "", "", "11.44", "10.94", "36.13", "34.18"
				],
				["Girl", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "11.48", "10.67", "11.48", "10.67", "",
					"", "", "", "", "", "13.42", "13.29", "13.42", "13.29", "24.9", "23.96"
				],
				["Grand Total", "13.74", "13.33", "12.06", "11.51", "11.96", "11.74", "37.76", "36.58", "12.12",
					"11.95", "12.63", "11.73", "13", "12.6", "11.48", "10.67", "49.23", "46.95", "11.27", "10.56",
					"11.44", "10.94", "11.04", "10.42", "13.42", "13.29", "47.17", "45.21", "134.16", "128.74"
				]
			]
		],
		"compact_2row_2col_2data_row": [
			[
				["", "Column Labels", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["", "Fancy", "", "", "Fancy Total", "Golf", "", "", "", "Golf Total", "Tee", "", "", "", "Tee Total",
					"Grand Total"
				],
				["Row Labels", "10", "11", "12", "", "10", "11", "12", "15", "", "10", "11", "12", "15", "", ""],
				["East", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Boy", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "", "", "11.96", "11.96", "", "", "13", "", "13", "", "", "11.04", "", "11.04", "36"],
				["Sum of Cost", "", "", "11.74", "11.74", "", "", "12.6", "", "12.6", "", "", "10.42", "", "10.42",
					"34.76"
				],
				["Girl", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "13.74", "", "", "13.74", "12.12", "", "", "", "12.12", "11.27", "", "", "", "11.27",
					"37.13"
				],
				["Sum of Cost", "13.33", "", "", "13.33", "11.95", "", "", "", "11.95", "10.56", "", "", "", "10.56",
					"35.84"
				],
				["East Sum of Price", "13.74", "", "11.96", "25.7", "12.12", "", "13", "", "25.12", "11.27", "",
					"11.04", "", "22.31", "73.13"
				],
				["East Sum of Cost", "13.33", "", "11.74", "25.07", "11.95", "", "12.6", "", "24.55", "10.56", "",
					"10.42", "", "20.98", "70.6"
				],
				["West", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Boy", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "", "12.06", "", "12.06", "", "12.63", "", "", "12.63", "", "11.44", "", "", "11.44",
					"36.13"
				],
				["Sum of Cost", "", "11.51", "", "11.51", "", "11.73", "", "", "11.73", "", "10.94", "", "", "10.94",
					"34.18"
				],
				["Girl", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
				["Sum of Price", "", "", "", "", "", "", "", "11.48", "11.48", "", "", "", "13.42", "13.42", "24.9"],
				["Sum of Cost", "", "", "", "", "", "", "", "10.67", "10.67", "", "", "", "13.29", "13.29", "23.96"],
				["West Sum of Price", "", "12.06", "", "12.06", "", "12.63", "", "11.48", "24.11", "", "11.44", "",
					"13.42", "24.86", "61.03"
				],
				["West Sum of Cost", "", "11.51", "", "11.51", "", "11.73", "", "10.67", "22.4", "", "10.94", "",
					"13.29", "24.23", "58.14"
				],
				["Total Sum of Price", "13.74", "12.06", "11.96", "37.76", "12.12", "12.63", "13", "11.48", "49.23",
					"11.27", "11.44", "11.04", "13.42", "47.17", "134.16"
				],
				["Total Sum of Cost", "13.33", "11.51", "11.74", "36.58", "11.95", "11.73", "12.6", "10.67", "46.95",
					"10.56", "10.94", "10.42", "13.29", "45.21", "128.74"
				]
			]
		],
		"outline_0row_0col_0data": [
			[
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""],
				["", "", ""]
			]
		],
		"outline_0row_0col_1data": [
			[
				["Sum of Price"],
				["134.16"]
			]
		],
		"outline_0row_0col_2data_col": [
			[
				["Sum of Price","Sum of Cost"],
				["134.16","128.74"]
			]
		],
		"outline_0row_0col_2data_row": [
			[
				["Values",""],
				["Sum of Price","134.16"],
				["Sum of Cost","128.74"]
			]
		],
		"outline_0row_1col_0data": [
			[
				["Style","","",""],
				["Fancy","Golf","Tee","Grand Total"]
			]
		],
		"outline_0row_1col_1data": [
			[
				["","Style","","",""],
				["","Fancy","Golf","Tee","Grand Total"],
				["Sum of Price","37.76","49.23","47.17","134.16"]
			]
		],
		"outline_0row_1col_2data_col": [
			[
				["Style","Values","","","","","",""],
				["Fancy","","Golf","","Tee","","Total Sum of Price","Total Sum of Cost"],
				["Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","",""],
				["37.76","36.58","49.23","46.95","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_0row_1col_2data_row": [
			[
				["","Style","","",""],
				["Values","Fancy","Golf","Tee","Grand Total"],
				["Sum of Price","37.76","49.23","47.17","134.16"],
				["Sum of Cost","36.58","46.95","45.21","128.74"]
			]
		],
		"outline_0row_2col_0data": [
			[
				["Style","Units","","","","","","","","","","","","",""],
				["Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["10","11","12","","10","11","12","15","","10","11","12","15","",""]
			]
		],
		"outline_0row_2col_1data": [
			[
				["","Style","Units","","","","","","","","","","","","",""],
				["","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["Sum of Price","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"]
			]
		],
		"outline_0row_2col_2data_col": [
			[
				["Style","Units","Values","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
				["Fancy","","","","","","Fancy Sum of Price","Fancy Sum of Cost","Golf","","","","","","","","Golf Sum of Price","Golf Sum of Cost","Tee","","","","","","","","Tee Sum of Price","Tee Sum of Cost","Total Sum of Price","Total Sum of Cost"],
				["10","","11","","12","","","","10","","11","","12","","15","","","","10","","11","","12","","15","","","","",""],
				["Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","",""],
				["13.74","13.33","12.06","11.51","11.96","11.74","37.76","36.58","12.12","11.95","12.63","11.73","13","12.6","11.48","10.67","49.23","46.95","11.27","10.56","11.44","10.94","11.04","10.42","13.42","13.29","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_0row_2col_2data_row": [
			[
				["","Style","Units","","","","","","","","","","","","",""],
				["","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Values","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["Sum of Price","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"],
				["Sum of Cost","13.33","11.51","11.74","36.58","11.95","11.73","12.6","10.67","46.95","10.56","10.94","10.42","13.29","45.21","128.74"]
			]
		],
		"outline_1row_0col_0data": [
			[
				["Region"],
				["East"],
				["West"],
				["Grand Total"]
			]
		],
		"outline_1row_0col_1data": [
			[
				["Region","Sum of Price"],
				["East","73.13"],
				["West","61.03"],
				["Grand Total","134.16"]
			]
		],
		"outline_1row_0col_2data_col": [
			[
				["Region","Sum of Price","Sum of Cost"],
				["East","73.13","70.6"],
				["West","61.03","58.14"],
				["Grand Total","134.16","128.74"]
			]
		],
		"outline_1row_0col_2data_row": [
			[
				["Region","Values",""],
				["East","",""],
				["","Sum of Price","73.13"],
				["","Sum of Cost","70.6"],
				["West","",""],
				["","Sum of Price","61.03"],
				["","Sum of Cost","58.14"],
				["Total Sum of Price","","134.16"],
				["Total Sum of Cost","","128.74"]
			]
		],
		"outline_1row_1col_0data": [
			[
				["","Style","","",""],
				["Region","Fancy","Golf","Tee","Grand Total"],
				["East","","","",""],
				["West","","","",""],
				["Grand Total","","","",""]
			]
		],
		"outline_1row_1col_1data": [
			[
				["Sum of Price","Style","","",""],
				["Region","Fancy","Golf","Tee","Grand Total"],
				["East","25.7","25.12","22.31","73.13"],
				["West","12.06","24.11","24.86","61.03"],
				["Grand Total","37.76","49.23","47.17","134.16"]
			]
		],
		"outline_1row_1col_2data_col": [
			[
				["","Style","Values","","","","","",""],
				["","Fancy","","Golf","","Tee","","Total Sum of Price","Total Sum of Cost"],
				["Region","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","",""],
				["East","25.7","25.07","25.12","24.55","22.31","20.98","73.13","70.6"],
				["West","12.06","11.51","24.11","22.4","24.86","24.23","61.03","58.14"],
				["Grand Total","37.76","36.58","49.23","46.95","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_1row_1col_2data_row": [
			[
				["","","Style","","",""],
				["Region","Values","Fancy","Golf","Tee","Grand Total"],
				["East","","","","",""],
				["","Sum of Price","25.7","25.12","22.31","73.13"],
				["","Sum of Cost","25.07","24.55","20.98","70.6"],
				["West","","","","",""],
				["","Sum of Price","12.06","24.11","24.86","61.03"],
				["","Sum of Cost","11.51","22.4","24.23","58.14"],
				["Total Sum of Price","","37.76","49.23","47.17","134.16"],
				["Total Sum of Cost","","36.58","46.95","45.21","128.74"]
			]
		],
		"outline_1row_2col_0data": [
			[
				["","Style","Units","","","","","","","","","","","","",""],
				["","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","","","","","","","","","","","","","","",""],
				["West","","","","","","","","","","","","","","",""],
				["Grand Total","","","","","","","","","","","","","","",""]
			]
		],
		"outline_1row_2col_1data": [
			[
				["Sum of Price","Style","Units","","","","","","","","","","","","",""],
				["","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","13.74","","11.96","25.7","12.12","","13","","25.12","11.27","","11.04","","22.31","73.13"],
				["West","","12.06","","12.06","","12.63","","11.48","24.11","","11.44","","13.42","24.86","61.03"],
				["Grand Total","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"]
			]
		],
		"outline_1row_2col_2data_col": [
			[
				["","Style","Units","Values","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
				["","Fancy","","","","","","Fancy Sum of Price","Fancy Sum of Cost","Golf","","","","","","","","Golf Sum of Price","Golf Sum of Cost","Tee","","","","","","","","Tee Sum of Price","Tee Sum of Cost","Total Sum of Price","Total Sum of Cost"],
				["","10","","11","","12","","","","10","","11","","12","","15","","","","10","","11","","12","","15","","","","",""],
				["Region","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","",""],
				["East","13.74","13.33","","","11.96","11.74","25.7","25.07","12.12","11.95","","","13","12.6","","","25.12","24.55","11.27","10.56","","","11.04","10.42","","","22.31","20.98","73.13","70.6"],
				["West","","","12.06","11.51","","","12.06","11.51","","","12.63","11.73","","","11.48","10.67","24.11","22.4","","","11.44","10.94","","","13.42","13.29","24.86","24.23","61.03","58.14"],
				["Grand Total","13.74","13.33","12.06","11.51","11.96","11.74","37.76","36.58","12.12","11.95","12.63","11.73","13","12.6","11.48","10.67","49.23","46.95","11.27","10.56","11.44","10.94","11.04","10.42","13.42","13.29","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_1row_2col_2data_row": [
			[
				["","","Style","Units","","","","","","","","","","","","",""],
				["","","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","Values","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","","","","","","","","","","","","","","","",""],
				["","Sum of Price","13.74","","11.96","25.7","12.12","","13","","25.12","11.27","","11.04","","22.31","73.13"],
				["","Sum of Cost","13.33","","11.74","25.07","11.95","","12.6","","24.55","10.56","","10.42","","20.98","70.6"],
				["West","","","","","","","","","","","","","","","",""],
				["","Sum of Price","","12.06","","12.06","","12.63","","11.48","24.11","","11.44","","13.42","24.86","61.03"],
				["","Sum of Cost","","11.51","","11.51","","11.73","","10.67","22.4","","10.94","","13.29","24.23","58.14"],
				["Total Sum of Price","","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"],
				["Total Sum of Cost","","13.33","11.51","11.74","36.58","11.95","11.73","12.6","10.67","46.95","10.56","10.94","10.42","13.29","45.21","128.74"]
			]
		],
		"outline_2row_0col_0data": [
			[
				["Region","Gender"],
				["East",""],
				["","Boy"],
				["","Girl"],
				["West",""],
				["","Boy"],
				["","Girl"],
				["Grand Total",""]
			]
		],
		"outline_2row_0col_1data": [
			[
				["Region","Gender","Sum of Price"],
				["East","","73.13"],
				["","Boy","36"],
				["","Girl","37.13"],
				["West","","61.03"],
				["","Boy","36.13"],
				["","Girl","24.9"],
				["Grand Total","","134.16"]
			]
		],
		"outline_2row_0col_2data_col": [
			[
				["Region","Gender","Sum of Price","Sum of Cost"],
				["East","","73.13","70.6"],
				["","Boy","36","34.76"],
				["","Girl","37.13","35.84"],
				["West","","61.03","58.14"],
				["","Boy","36.13","34.18"],
				["","Girl","24.9","23.96"],
				["Grand Total","","134.16","128.74"]
			]
		],
		"outline_2row_0col_2data_row": [
			[
				["Region","Gender","Values",""],
				["East","","",""],
				["","Boy","",""],
				["","","Sum of Price","36"],
				["","","Sum of Cost","34.76"],
				["","Girl","",""],
				["","","Sum of Price","37.13"],
				["","","Sum of Cost","35.84"],
				["East Sum of Price","","","73.13"],
				["East Sum of Cost","","","70.6"],
				["West","","",""],
				["","Boy","",""],
				["","","Sum of Price","36.13"],
				["","","Sum of Cost","34.18"],
				["","Girl","",""],
				["","","Sum of Price","24.9"],
				["","","Sum of Cost","23.96"],
				["West Sum of Price","","","61.03"],
				["West Sum of Cost","","","58.14"],
				["Total Sum of Price","","","134.16"],
				["Total Sum of Cost","","","128.74"]
			]
		],
		"outline_2row_1col_0data": [
			[
				["","","Style","","",""],
				["Region","Gender","Fancy","Golf","Tee","Grand Total"],
				["East","","","","",""],
				["","Boy","","","",""],
				["","Girl","","","",""],
				["West","","","","",""],
				["","Boy","","","",""],
				["","Girl","","","",""],
				["Grand Total","","","","",""]
			]
		],
		"outline_2row_1col_1data": [
			[
				["Sum of Price","","Style","","",""],
				["Region","Gender","Fancy","Golf","Tee","Grand Total"],
				["East","","25.7","25.12","22.31","73.13"],
				["","Boy","11.96","13","11.04","36"],
				["","Girl","13.74","12.12","11.27","37.13"],
				["West","","12.06","24.11","24.86","61.03"],
				["","Boy","12.06","12.63","11.44","36.13"],
				["","Girl","","11.48","13.42","24.9"],
				["Grand Total","","37.76","49.23","47.17","134.16"]
			]
		],
		"outline_2row_1col_2data_col": [
			[
				["","","Style","Values","","","","","",""],
				["","","Fancy","","Golf","","Tee","","Total Sum of Price","Total Sum of Cost"],
				["Region","Gender","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","",""],
				["East","","25.7","25.07","25.12","24.55","22.31","20.98","73.13","70.6"],
				["","Boy","11.96","11.74","13","12.6","11.04","10.42","36","34.76"],
				["","Girl","13.74","13.33","12.12","11.95","11.27","10.56","37.13","35.84"],
				["West","","12.06","11.51","24.11","22.4","24.86","24.23","61.03","58.14"],
				["","Boy","12.06","11.51","12.63","11.73","11.44","10.94","36.13","34.18"],
				["","Girl","","","11.48","10.67","13.42","13.29","24.9","23.96"],
				["Grand Total","","37.76","36.58","49.23","46.95","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_2row_1col_2data_row": [
			[
				["","","","Style","","",""],
				["Region","Gender","Values","Fancy","Golf","Tee","Grand Total"],
				["East","","","","","",""],
				["","Boy","","","","",""],
				["","","Sum of Price","11.96","13","11.04","36"],
				["","","Sum of Cost","11.74","12.6","10.42","34.76"],
				["","Girl","","","","",""],
				["","","Sum of Price","13.74","12.12","11.27","37.13"],
				["","","Sum of Cost","13.33","11.95","10.56","35.84"],
				["East Sum of Price","","","25.7","25.12","22.31","73.13"],
				["East Sum of Cost","","","25.07","24.55","20.98","70.6"],
				["West","","","","","",""],
				["","Boy","","","","",""],
				["","","Sum of Price","12.06","12.63","11.44","36.13"],
				["","","Sum of Cost","11.51","11.73","10.94","34.18"],
				["","Girl","","","","",""],
				["","","Sum of Price","","11.48","13.42","24.9"],
				["","","Sum of Cost","","10.67","13.29","23.96"],
				["West Sum of Price","","","12.06","24.11","24.86","61.03"],
				["West Sum of Cost","","","11.51","22.4","24.23","58.14"],
				["Total Sum of Price","","","37.76","49.23","47.17","134.16"],
				["Total Sum of Cost","","","36.58","46.95","45.21","128.74"]
			]
		],
		"outline_2row_2col_0data": [
			[
				["","","Style","Units","","","","","","","","","","","","",""],
				["","","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","Gender","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","","","","","","","","","","","","","","","",""],
				["","Boy","","","","","","","","","","","","","","",""],
				["","Girl","","","","","","","","","","","","","","",""],
				["West","","","","","","","","","","","","","","","",""],
				["","Boy","","","","","","","","","","","","","","",""],
				["","Girl","","","","","","","","","","","","","","",""],
				["Grand Total","","","","","","","","","","","","","","","",""]
			]
		],
		"outline_2row_2col_1data": [
			[
				["Sum of Price","","Style","Units","","","","","","","","","","","","",""],
				["","","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","Gender","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","","13.74","","11.96","25.7","12.12","","13","","25.12","11.27","","11.04","","22.31","73.13"],
				["","Boy","","","11.96","11.96","","","13","","13","","","11.04","","11.04","36"],
				["","Girl","13.74","","","13.74","12.12","","","","12.12","11.27","","","","11.27","37.13"],
				["West","","","12.06","","12.06","","12.63","","11.48","24.11","","11.44","","13.42","24.86","61.03"],
				["","Boy","","12.06","","12.06","","12.63","","","12.63","","11.44","","","11.44","36.13"],
				["","Girl","","","","","","","","11.48","11.48","","","","13.42","13.42","24.9"],
				["Grand Total","","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"]
			]
		],
		"outline_2row_2col_2data_col": [
			[
				["","","Style","Units","Values","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
				["","","Fancy","","","","","","Fancy Sum of Price","Fancy Sum of Cost","Golf","","","","","","","","Golf Sum of Price","Golf Sum of Cost","Tee","","","","","","","","Tee Sum of Price","Tee Sum of Cost","Total Sum of Price","Total Sum of Cost"],
				["","","10","","11","","12","","","","10","","11","","12","","15","","","","10","","11","","12","","15","","","","",""],
				["Region","Gender","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","Sum of Price","Sum of Cost","","","",""],
				["East","","13.74","13.33","","","11.96","11.74","25.7","25.07","12.12","11.95","","","13","12.6","","","25.12","24.55","11.27","10.56","","","11.04","10.42","","","22.31","20.98","73.13","70.6"],
				["","Boy","","","","","11.96","11.74","11.96","11.74","","","","","13","12.6","","","13","12.6","","","","","11.04","10.42","","","11.04","10.42","36","34.76"],
				["","Girl","13.74","13.33","","","","","13.74","13.33","12.12","11.95","","","","","","","12.12","11.95","11.27","10.56","","","","","","","11.27","10.56","37.13","35.84"],
				["West","","","","12.06","11.51","","","12.06","11.51","","","12.63","11.73","","","11.48","10.67","24.11","22.4","","","11.44","10.94","","","13.42","13.29","24.86","24.23","61.03","58.14"],
				["","Boy","","","12.06","11.51","","","12.06","11.51","","","12.63","11.73","","","","","12.63","11.73","","","11.44","10.94","","","","","11.44","10.94","36.13","34.18"],
				["","Girl","","","","","","","","","","","","","","","11.48","10.67","11.48","10.67","","","","","","","13.42","13.29","13.42","13.29","24.9","23.96"],
				["Grand Total","","13.74","13.33","12.06","11.51","11.96","11.74","37.76","36.58","12.12","11.95","12.63","11.73","13","12.6","11.48","10.67","49.23","46.95","11.27","10.56","11.44","10.94","11.04","10.42","13.42","13.29","47.17","45.21","134.16","128.74"]
			]
		],
		"outline_2row_2col_2data_row": [
			[
				["","","","Style","Units","","","","","","","","","","","","",""],
				["","","","Fancy","","","Fancy Total","Golf","","","","Golf Total","Tee","","","","Tee Total","Grand Total"],
				["Region","Gender","Values","10","11","12","","10","11","12","15","","10","11","12","15","",""],
				["East","","","","","","","","","","","","","","","","",""],
				["","Boy","","","","","","","","","","","","","","","",""],
				["","","Sum of Price","","","11.96","11.96","","","13","","13","","","11.04","","11.04","36"],
				["","","Sum of Cost","","","11.74","11.74","","","12.6","","12.6","","","10.42","","10.42","34.76"],
				["","Girl","","","","","","","","","","","","","","","",""],
				["","","Sum of Price","13.74","","","13.74","12.12","","","","12.12","11.27","","","","11.27","37.13"],
				["","","Sum of Cost","13.33","","","13.33","11.95","","","","11.95","10.56","","","","10.56","35.84"],
				["East Sum of Price","","","13.74","","11.96","25.7","12.12","","13","","25.12","11.27","","11.04","","22.31","73.13"],
				["East Sum of Cost","","","13.33","","11.74","25.07","11.95","","12.6","","24.55","10.56","","10.42","","20.98","70.6"],
				["West","","","","","","","","","","","","","","","","",""],
				["","Boy","","","","","","","","","","","","","","","",""],
				["","","Sum of Price","","12.06","","12.06","","12.63","","","12.63","","11.44","","","11.44","36.13"],
				["","","Sum of Cost","","11.51","","11.51","","11.73","","","11.73","","10.94","","","10.94","34.18"],
				["","Girl","","","","","","","","","","","","","","","",""],
				["","","Sum of Price","","","","","","","","11.48","11.48","","","","13.42","13.42","24.9"],
				["","","Sum of Cost","","","","","","","","10.67","10.67","","","","13.29","13.29","23.96"],
				["West Sum of Price","","","","12.06","","12.06","","12.63","","11.48","24.11","","11.44","","13.42","24.86","61.03"],
				["West Sum of Cost","","","","11.51","","11.51","","11.73","","10.67","22.4","","10.94","","13.29","24.23","58.14"],
				["Total Sum of Price","","","13.74","12.06","11.96","37.76","12.12","12.63","13","11.48","49.23","11.27","11.44","11.04","13.42","47.17","134.16"],
				["Total Sum of Cost","","","13.33","11.51","11.74","36.58","11.95","11.73","12.6","10.67","46.95","10.56","10.94","10.42","13.29","45.21","128.74"]
			]
		]
	};
	fillData(ws, testDataRange);
	var dataRef = "Sheet1!" + testDataRange.getName();

	function setPivotLayout(pivot, layout) {
		switch (layout) {
			case "compact":
				pivot.asc_setCompact(true);
				pivot.asc_setOutline(true);
				break;
			case "outline":
				pivot.asc_setCompact(false);
				pivot.asc_setOutline(true);
				break;
			case "tabular":
				pivot.asc_setCompact(false);
				pivot.asc_setOutline(false);
				break;
		}
	}
	function testCreate(prefix, init) {
		test("Test: Create " + prefix, function() {
			var pivot = init();
			pivot.asc_getStyleInfo().asc_setName(api, pivot, "PivotStyleDark23");

			AscCommon.History.Clear();
			checkOperation(pivot, null, standards[prefix + "_0data"], "0data");

			pivot.asc_addDataField(api, 5);
			checkOperation(pivot, standards[prefix + "_0data"], standards[prefix + "_1data"], "1data");

			pivot.asc_addDataField(api, 6);
			checkOperation(pivot, standards[prefix + "_1data"], standards[prefix + "_2data_col"], "2data_col");

			pivot.asc_moveToRowField(api, Asc.st_VALUES);
			checkOperation(pivot, standards[prefix + "_2data_col"], standards[prefix + "_2data_row"], "2data_row");

			ws.deletePivotTables(new AscCommonExcel.MultiplyRange(pivot.getReportRanges()).getUnionRange());
		});
	}
	function testLayout(layout) {
		testCreate(layout + "_0row_0col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			return pivot;
		});

		testCreate(layout + "_0row_1col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addColField(api, 2);
			return pivot;
		});

		testCreate(layout + "_0row_2col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addColField(api, 2);
			pivot.asc_addColField(api, 4);
			return pivot;
		});

		testCreate(layout + "_1row_0col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			return pivot;
		});

		testCreate(layout + "_1row_1col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			pivot.asc_addColField(api, 2);
			return pivot;
		});

		testCreate(layout + "_1row_2col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			pivot.asc_addColField(api, 2);
			pivot.asc_addColField(api, 4);
			return pivot;
		});

		testCreate(layout + "_2row_0col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			pivot.asc_addRowField(api, 1);
			return pivot;
		});

		testCreate(layout + "_2row_1col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			pivot.asc_addRowField(api, 1);
			pivot.asc_addColField(api, 2);
			return pivot;
		});

		testCreate(layout + "_2row_2col", function() {
			var pivot = api._asc_insertPivot(wb, dataRef, ws, reportRange);
			setPivotLayout(pivot, layout);
			pivot.asc_addRowField(api, 0);
			pivot.asc_addRowField(api, 1);
			pivot.asc_addColField(api, 2);
			pivot.asc_addColField(api, 4);
			return pivot;
		});
	}

	module("Pivot");

	function startTests() {
		testLayout("compact");

		testLayout("outline");

		// testLayout("tabular");
	}
});
