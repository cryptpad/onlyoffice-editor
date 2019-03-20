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

(function (window, undefined)
{
    window['AscFonts'] = window['AscFonts'] || {};

    window['AscFonts'].api = null;
    window['AscFonts'].onSuccess = null;
    window['AscFonts'].onError = null;
    window['AscFonts'].maxLoadingIndex = 4; // engine, file, manager, wasm
    window['AscFonts'].curLoadingIndex = 0;

    window['AscFonts'].onLoadModule = function()
	{
		++window['AscFonts'].curLoadingIndex;

		if (window['AscFonts'].curLoadingIndex == window['AscFonts'].curLoadingMax)
		{
			if (window['AscFonts'].api)
			{
                window['AscFonts'].onSuccess.call(window['AscFonts'].api);
			}

			delete window['AscFonts'].curLoadingIndex;
            delete window['AscFonts'].maxLoadingIndex;
            delete window['AscFonts'].api;
            delete window['AscFonts'].onSuccess;
            delete window['AscFonts'].onError;
		}
	};

    window['AscFonts'].load = function(api, onSuccess, onError)
    {
        window['AscFonts'].api = api;
        window['AscFonts'].onSuccess = onSuccess;
        window['AscFonts'].onError = onError;

        var url = "../../../../sdkjs/common/libfont";
        var useWasm = false;
        var webAsmObj = window["WebAssembly"];
        if (typeof webAsmObj === "object")
		{
            if (typeof webAsmObj["Memory"] === "function")
			{
				if ((typeof webAsmObj["instantiateStreaming"] === "function") || (typeof webAsmObj["instantiate"] === "function"))
					useWasm = true;
			}
		}

		useWasm ? (url += "/wasm") : (url += "/js");
		if (!useWasm)
            window['AscFonts'].onLoadModule();

		var _onSuccess = function(){
		};
		var _onError = function(){
            window['AscFonts'].onError();
		};

        if (window['AscNotLoadAllScript'])
        {
            AscCommon.loadScript(url + "/engine.js", onSuccess, onError);
            AscCommon.loadScript(url + "/file.js", onSuccess, onError);
            AscCommon.loadScript(url + "/manager.js", onSuccess, onError);
        }
        else
        {
            AscCommon.loadScript(url + "/engine.js", onSuccess, onError);
        }
    };

})(window, undefined);