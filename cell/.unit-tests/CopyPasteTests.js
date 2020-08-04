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

$( function () {

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
	AscCommonExcel.WorkbookView.prototype.showWorksheet = function() {
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
	AscCommonExcel.WorksheetView.prototype._reinitializeScroll = function() {
	};
	AscCommon.baseEditorsApi.prototype._onEndLoadSdk = function() {
	};



	var sData = AscCommon.getEmpty();
	var api = new Asc.spreadsheet_api({
		'id-view': 'editor_sdk'
	});
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
	var wsView = api.wb.getWorksheet(0);
	wsView.handlers = api.handlers;
	wsView.objectRender = new AscFormat.DrawingObjects();
	var ws = api.wbModel.aWorksheets[0];

	var getRange = function (c1, r1, c2, r2) {
		return new window["Asc"].Range(c1, r1, c2, r2);
	};

	test( "Test: \"simple tests\"", function () {

		ws.getRange2("A1").setValue("-4");

		ws.selectionRange.ranges = [getRange(0, 0, 0, 0)];
		var base64 = AscCommonExcel.g_clipboardExcel.copyProcessor.getBinaryForCopy(ws, wsView.objectRender);

		ws.selectionRange.ranges = [getRange(0, 1, 0, 1)];
		AscCommonExcel.g_clipboardExcel.pasteData(wsView, AscCommon.c_oAscClipboardDataFormat.Internal, base64);

		strictEqual(ws.getRange2("A2").getValue(), ws.getRange2("A1").getValue());

		ws.selectionRange.ranges = [getRange(0, 5, 0, 5), getRange(1, 5, 1, 8)];
		AscCommonExcel.g_clipboardExcel.pasteData(wsView, AscCommon.c_oAscClipboardDataFormat.Internal, base64);

		strictEqual(ws.getRange2("A6").getValue(), "-4");
		strictEqual(ws.getRange2("B6").getValue(), "-4");
		strictEqual(ws.getRange2("B7").getValue(), "-4");
		strictEqual(ws.getRange2("B8").getValue(), "-4");
		strictEqual(ws.getRange2("B9").getValue(), "-4");
	} );

	test( "Test: \"formula tests\"", function () {
		var val = "=SIN(1)";

		ws.getRange2("A1").setValue(val);

		ws.selectionRange.ranges = [getRange(0, 0, 0, 0)];
		var base64 = AscCommonExcel.g_clipboardExcel.copyProcessor.getBinaryForCopy(ws, wsView.objectRender);

		ws.selectionRange.ranges = [getRange(0, 1, 0, 1)];
		AscCommonExcel.g_clipboardExcel.pasteData(wsView, AscCommon.c_oAscClipboardDataFormat.Internal, base64);

		strictEqual(ws.getRange2("A2").getValueForEdit(), ws.getRange2("A1").getValueForEdit());

		ws.selectionRange.ranges = [getRange(0, 5, 0, 5), getRange(1, 5, 1, 8)];
		AscCommonExcel.g_clipboardExcel.pasteData(wsView, AscCommon.c_oAscClipboardDataFormat.Internal, base64);

		strictEqual(ws.getRange2("A6").getValueForEdit(), val);
		strictEqual(ws.getRange2("B6").getValueForEdit(), val);
		strictEqual(ws.getRange2("B7").getValueForEdit(), val);
		strictEqual(ws.getRange2("B8").getValueForEdit(), val);
		strictEqual(ws.getRange2("B9").getValueForEdit(), val);
	} );

	module("CopyPaste");
} );