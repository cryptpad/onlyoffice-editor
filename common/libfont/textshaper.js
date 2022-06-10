/*
 * (c) Copyright Ascensio System SIA 2010-2022
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

(function(window)
{
	/**
	 * @constructor
	 */
	function CFontInfo(sName, nStyle, nSize)
	{
		this.Name  = undefined !== sName ? sName : "Arial";
		this.Style = undefined !== nStyle ? nStyle : 0;
		this.Size  = undefined !== nSize ? nSize : 10;
	}

	const DEFAULT_FONTINFO = new CFontInfo();

	const MEASURER = AscCommon.g_oTextMeasurer;
	const FONTSIZE = 72;

	// Функции для перегрузки
	// 1. Shape - основная функция
	// 2. GetFontInfo - получаем информацию о шрифте
	// 3. PreShape - перегружаем, если перед шейпом слова нужно выполнить дополнительные действия
	// 4. OnClearBuffer

	/**
	 *
	 * @constructor
	 */
	function CTextShaper()
	{
		this.Script    = -1;
		this.FontId    = -1;
		this.FontSubst = false;
		this.FontSlot  = fontslot_None;
		this.FontSize  = 10;
	}
	CTextShaper.prototype.ClearBuffer = function()
	{
		this.OnClearBuffer();

		this.Script   = -1;
		this.FontId   = -1;
		this.FontSlot = fontslot_None;

		this.StartString();
	};
	CTextShaper.prototype.StartString = function()
	{
		AscFonts.HB_StartString();
	};
	CTextShaper.prototype.AppendToString = function(nUnicode)
	{
		this.private_CheckNewSegment(nUnicode);
		AscFonts.HB_AppendToString(nUnicode);
	};
	CTextShaper.prototype.EndString = function()
	{
		AscFonts.HB_EndString();
	};
	CTextShaper.prototype.FlushWord = function()
	{
		if (this.GetBufferLength())
			return this.ClearBuffer();

		this.EndString();

		let nScript = AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED === this.Script ? AscFonts.HB_SCRIPT.HB_SCRIPT_COMMON : this.Script;

		let nDirection = AscFonts.HB_DIRECTION.HB_DIRECTION_LTR;//this.GetDirection(nScript);

		let oFontInfo = this.GetFontInfo(this.FontSlot);
		let nFontId   = AscCommon.FontNameMap.GetId(this.FontId.m_pFaceInfo.family_name);
		AscCommon.g_oTextMeasurer.SetFontInternal(this.FontId.m_pFaceInfo.family_name, FONTSIZE, oFontInfo.Style);

		this.FontSize = oFontInfo.Size;

		AscFonts.HB_ShapeString(this, nFontId, oFontInfo.Style, this.FontId, 15, nScript, nDirection, "en");

		this.ClearBuffer();
	};
	CTextShaper.prototype.GetTextScript = function(nUnicode)
	{
		return AscFonts.hb_get_script_by_unicode(nUnicode);
	};
	CTextShaper.prototype.GetFontSlot = function(nUnicode)
	{
		return g_font_detector.Get_FontClass(nUnicode, fonthint_Default, lcid_unknown, false, false);
	};
	CTextShaper.prototype.GetDirection = function(nScript)
	{
		return AscFonts.hb_get_script_horizontal_direction(nScript);
	};
	CTextShaper.prototype.private_CheckNewSegment = function(nUnicode)
	{
		if (this.GetBufferLength() >= AscFonts.HB_STRING_MAX_LEN)
			this.FlushWord();

		let nScript = this.GetTextScript(nUnicode);
		if (nScript !== this.Script
			&& -1 !== this.Script
			&& AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript
			&& AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== this.Script)
			this.FlushWord();

		let nFontSlot = this.GetFontSlot(nUnicode);
		this.private_CheckFont(nFontSlot);

		let nFontId = this.FontId;
		let isSubst = this.FontSubst;
		if (AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript || -1 === nFontId)
		{
			isSubst = !AscCommon.g_oTextMeasurer.CheckUnicodeInCurrentFont(nUnicode);
			if (-1 === nFontId || isSubst)
				nFontId = AscCommon.g_oTextMeasurer.GetFontBySymbol(nUnicode, -1 !== nFontId ? nFontId : null);

			if (this.FontId !== nFontId
				&& -1 !== this.FontId
				&& this.FontSubst
				&& isSubst
				&& this.private_CheckBufferInFont(nFontId))
				this.FontId = nFontId;

			if (this.FontId !== nFontId && -1 !== this.FontId)
				this.FlushWord();
		}

		this.Script    = AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript || -1 === this.Script ? nScript : this.Script;
		this.FontSlot  = fontslot_None !== nFontSlot ? nFontSlot : this.FontSlot;
		this.FontId    = nFontId;
		this.FontSubst = isSubst;
	};
	CTextShaper.prototype.private_CheckFont = function(nFontSlot)
	{
		if (this.FontSlot !== nFontSlot)
		{
			let oFontInfo = this.GetFontInfo(nFontSlot);
			AscCommon.g_oTextMeasurer.SetFontInternal(oFontInfo.Name, 72, oFontInfo.Style);
		}
	};
	CTextShaper.prototype.private_CheckBufferInFont = function(nFontId)
	{
		for (let nPos = 0, nCount = this.Items.length; nPos < nCount; ++nPos)
		{
			if (!nFontId.GetGIDByUnicode(this.Items[nPos].GetCodePoint()))
				return false;
		}

		return true;
	};
	CTextShaper.prototype.GetFontInfo = function(nFontSlot)
	{
		return DEFAULT_FONTINFO;
	};
	CTextShaper.prototype.OnClearBuffer = function()
	{
	};
	CTextShaper.prototype.FlushGrapheme = function(nGrapheme, nWidth, nCodePointsCount, isLigature)
	{
	};
	CTextShaper.prototype.GetBufferLength = function()
	{
		return 0;
	};
	//--------------------------------------------------------export----------------------------------------------------
	window['AscFonts'] = window['AscFonts'] || {};
	window['AscFonts'].CFontInfo   = CFontInfo;
	window['AscFonts'].CTextShaper = CTextShaper;
	window['AscFonts'].DEFAULT_FONTINFO = DEFAULT_FONTINFO;

})(window);
