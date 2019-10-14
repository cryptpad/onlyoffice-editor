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

var native_renderer = null;

function NativeOpenFile()
{
	var doc_bin = window.native.GetFileString(window.native.GetFilePath());
	window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();

	var _api;
	if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
	{
		_api = new window["Asc"]["asc_docs_api"]("");
	}
	else
	{
		_api = new window["Asc"]["spreadsheet_api"]();
	}
	_api.asc_nativeOpenFile(doc_bin);
	window["_api"] = window["API"] = _api;
}

function NativeOpenFile2(_params)
{
	window["CreateMainTextMeasurerWrapper"]();

	window.g_file_path = "native_open_file";
	window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
	var doc_bin = window.native.GetFileString(window.g_file_path);
	var _api;
	if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
	{
		_api = new window["Asc"]["asc_docs_api"]("");

		if (undefined !== _api.Native_Editor_Initialize_Settings)
		{
			_api.Native_Editor_Initialize_Settings(_params);
		}

		_api.asc_nativeOpenFile(doc_bin);

		if (_api.NativeAfterLoad)
			_api.NativeAfterLoad();

		// ToDo get_PropertyThemeColorSchemes method removed, now the only Event!!!!
		/*if (_api.__SendThemeColorScheme)
			_api.__SendThemeColorScheme();

		if (_api.get_PropertyThemeColorSchemes)
		{
			var schemes = _api.get_PropertyThemeColorSchemes();
			if (schemes)
			{
				var st = global_memory_stream_menu;
				st["ClearNoAttack"]();
				AscCommon.asc_WriteColorSchemes(schemes, st);
				window["native"]["OnCallMenuEvent"](2404, st); // ASC_MENU_EVENT_TYPE_COLOR_SCHEMES
			}
		}*/
	}
	else
	{
		_api = new window["Asc"]["spreadsheet_api"]();
		_api.asc_nativeOpenFile(doc_bin);
	}

	window["_api"] = window["API"] = _api;
}

function NativeCalculateFile()
{
	window["API"].asc_nativeCalculateFile();
}

function NativeApplyChangesData(data, isFull)
{
	window["API"].asc_nativeApplyChanges2(data, isFull);
}

function NativeApplyChanges()
{
	var __changes = [];
	var _count_main = window.native.GetCountChanges();
	for (var i = 0; i < _count_main; i++)
	{
		var _changes_file = window.native.GetChangesFile(i);
		var _changes = JSON.parse(window.native.GetFileString(_changes_file));

		for (var j = 0; j < _changes.length; j++)
		{
			__changes.push(_changes[j]);
		}
	}

	window["API"].asc_nativeApplyChanges(__changes);
}
function NativeGetFileString()
{
	return window["API"].asc_nativeGetFile();
}
function NativeGetFileData()
{
	return window["API"].asc_nativeGetFileData();
}
function NativeGetFileDataHtml()
{
	if (window["API"].asc_nativeGetHtml)
		return window["API"].asc_nativeGetHtml();
	return "";
}

function NativeStartMailMergeByList(database)
{
	if (window["API"].asc_StartMailMergeByList)
		return window["API"].asc_StartMailMergeByList(database);
	return undefined;
}
function NativePreviewMailMergeResult(index)
{
	if (window["API"].asc_PreviewMailMergeResult)
		return window["API"].asc_PreviewMailMergeResult(index);
	return undefined;
}
function NativeGetMailMergeFiledValue(index, name)
{
	if (window["API"].asc_GetMailMergeFiledValue)
		return window["API"].asc_GetMailMergeFiledValue(index, name);
	return "";
}

function GetNativeCountPages()
{
	return window["API"].asc_nativePrintPagesCount();
}

function GetNativeFileDataPDF(_param)
{
	return window["API"].asc_nativeGetPDF(_param);
}

window.memory1 = null;
window.memory2 = null;

function GetNativePageBase64(pageIndex)
{
	if (null == window.memory1)
		window.memory1 = CreateNativeMemoryStream();
	else
		window.memory1.ClearNoAttack();

	if (null == window.memory2)
		window.memory2 = CreateNativeMemoryStream();
	else
		window.memory2.ClearNoAttack();

	if (native_renderer == null)
	{
		native_renderer = window["API"].asc_nativeCheckPdfRenderer(window.memory1, window.memory2);
	}
	else
	{
		window.memory1.ClearNoAttack();
		window.memory2.ClearNoAttack();
	}

	window["API"].asc_nativePrint(native_renderer, pageIndex);
	return window.memory1;
}

function GetNativePageMeta(pageIndex)
{
	return window["API"].GetNativePageMeta(pageIndex);
}

function GetNativeId()
{
	return window.native.GetFileId();
}

// для работы с таймерами
window.NativeSupportTimeouts = true;
window.NativeTimeoutObject = {};

function clearTimeout(id)
{
	if (!window.NativeSupportTimeouts)
		return;

	window.NativeTimeoutObject["" + id] = undefined;
	window["native"]["ClearTimeout"](id);
}
function setTimeout(func, interval)
{
	if (!window.NativeSupportTimeouts)
		return;

	var id = window["native"]["GenerateTimeoutId"](interval);
	window.NativeTimeoutObject["" + id] = {"func": func, repeat: false};
	return id;
}

function clearInterval(id)
{
	if (!window.NativeSupportTimeouts)
		return;

	window.NativeTimeoutObject["" + id] = undefined;
	window["native"]["ClearTimeout"](id);
}
function setInterval(func, interval)
{
	if (!window.NativeSupportTimeouts)
		return;

	var id = window["native"]["GenerateTimeoutId"](interval);
	window.NativeTimeoutObject["" + id] = {func: func, repeat: true, interval: interval};
	return id;
}

window.native.Call_TimeoutFire = function (id)
{
	if (!window.NativeSupportTimeouts)
		return;

	var prop = "" + id;

	var timeoutObject = window.NativeTimeoutObject[prop];
	if (!timeoutObject) {
		return;
	}

	window.NativeTimeoutObject[prop] = undefined;

	if (!timeoutObject.func)
		return;

	timeoutObject.func.call(null);

	if (timeoutObject.repeat) {
		setInterval(timeoutObject.func, timeoutObject.interval);
	}

	timeoutObject.func = null;
};

window.clearTimeout = clearTimeout;
window.setTimeout = setTimeout;
window.clearInterval = clearInterval;
window.setInterval = setInterval;

var console = {
	log: function (param)
	{
		window.native.ConsoleLog(param);
	},
	time: function (param)
	{
	},
	timeEnd: function (param)
	{
	}
};

window["NativeCorrectImageUrlOnPaste"] = function (url)
{
	return window["native"]["CorrectImageUrlOnPaste"](url);
};
window["NativeCorrectImageUrlOnCopy"] = function (url)
{
	return window["native"]["CorrectImageUrlOnCopy"](url);
};

var global_memory_stream_menu = CreateNativeMemoryStream();

// HTML page interface
window.native.Call_OnUpdateOverlay = function (param)
{
	return window["API"].Call_OnUpdateOverlay(param);
};

window.native.Call_OnMouseDown = function (e)
{
	return window["API"].Call_OnMouseDown(e);
};
window.native.Call_OnMouseUp = function (e)
{
	return window["API"].Call_OnMouseUp(e);
};
window.native.Call_OnMouseMove = function (e)
{
	return window["API"].Call_OnMouseMove(e);
};
window.native.Call_OnCheckMouseDown = function (e)
{
	return window["API"].Call_OnCheckMouseDown(e);
};

window.native.Call_OnKeyDown = function (e)
{
	return window["API"].Call_OnKeyDown(e);
};
window.native.Call_OnKeyPress = function (e)
{
	return window["API"].Call_OnKeyPress(e);
};
window.native.Call_OnKeyUp = function (e)
{
	return window["API"].Call_OnKeyUp(e);
};
window.native.Call_OnKeyboardEvent = function (e)
{
	return window["API"].Call_OnKeyboardEvent(e);
};

window.native.Call_CalculateResume = function ()
{
	return window["API"].Call_CalculateResume();
};

window.native.Call_TurnOffRecalculate = function ()
{
	return window["API"].Call_TurnOffRecalculate();
};
window.native.Call_TurnOnRecalculate = function ()
{
	return window["API"].Call_TurnOnRecalculate();
};

window.native.Call_CheckTargetUpdate = function ()
{
	return window["API"].Call_CheckTargetUpdate();
};
window.native.Call_Common = function (type, param)
{
	return window["API"].Call_Common(type, param);
};

window.native.Call_HR_Tabs = function (arrT, arrP)
{
	return window["API"].Call_HR_Tabs(arrT, arrP);
};
window.native.Call_HR_Pr = function (_indent_left, _indent_right, _indent_first)
{
	return window["API"].Call_HR_Pr(_indent_left, _indent_right, _indent_first);
};
window.native.Call_HR_Margins = function (_margin_left, _margin_right)
{
	return window["API"].Call_HR_Margins(_margin_left, _margin_right);
};
window.native.Call_HR_Table = function (_params, _cols, _margins, _rows)
{
	return window["API"].Call_HR_Table(_params, _cols, _margins, _rows);
};

window.native.Call_VR_Margins = function (_top, _bottom)
{
	return window["API"].Call_VR_Margins(_top, _bottom);
};
window.native.Call_VR_Header = function (_header_top, _header_bottom)
{
	return window["API"].Call_VR_Header(_header_top, _header_bottom);
};
window.native.Call_VR_Table = function (_params, _cols, _margins, _rows)
{
	return window["API"].Call_VR_Table(_params, _cols, _margins, _rows);
};

window.native.Call_Menu_Event = function (type, _params)
{
	return window["API"].Call_Menu_Event(type, _params);
};
