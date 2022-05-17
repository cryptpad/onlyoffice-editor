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

(function(window)
{
	const MEASURER = AscCommon.g_oTextMeasurer;
	const FONTSIZE = 72;

	/**
	 *
	 * @constructor
	 */
	function CTextShaper()
	{
		this.Parent   = null;
		this.Items    = [];
		this.TextPr   = null;
		this.Script   = -1;
		this.FontId   = -1;
		this.FontSlot = fontslot_None;
	}
	CTextShaper.prototype.Init = function()
	{
		this.Parent = null;
		this.TextPr = null;

		this.ClearBuffer();
	};
	CTextShaper.prototype.ClearBuffer = function()
	{
		this.Items.length = 0;
		this.Script   = -1;
		this.FontId   = -1;
		this.FontSlot = fontslot_None;

		AscFonts.HB_BeginString();
	};
	CTextShaper.prototype.Shape = function(oParagraph)
	{
		this.Init();
		oParagraph.CheckRunContent((o) => this.ShapeRun(o));
	};
	CTextShaper.prototype.ShapeRun = function(oRun)
	{
		this.private_CheckRun(oRun);

		for (let nPos = 0, nCount = oRun.GetElementsCount(); nPos < nCount; ++nPos)
		{
			let oItem = oRun.GetElement(nPos);
			if (!oItem.IsText() || oItem.IsNBSP())
			{
				this.FlushWord();
			}
			else
			{
				let nUnicode = oItem.GetCodePoint();
				this.private_CheckNewSegment(nUnicode);

				AscFonts.HB_AppendToString(nUnicode);

				this.Items.push(oItem);
				if (oItem.IsSpaceAfter())
					this.FlushWord();
			}
		}
	};
	CTextShaper.prototype.FlushWord = function()
	{
		if (!this.Items.length || !this.TextPr)
			return;

		AscFonts.HB_EndString();

		let nScript = AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED === this.Script ? AscFonts.HB_SCRIPT.HB_SCRIPT_COMMON : this.Script;

		let nDirection = AscFonts.HB_DIRECTION.HB_DIRECTION_LTR;//this.GetDirection(nScript);

		let oFontInfo = this.TextPr.GetFontInfo(this.FontSlot);
		let nFontId   = AscCommon.FontNameMap.GetId(this.FontId.m_pFaceInfo.family_name);
		MEASURER.SetFontInternal(this.FontId.m_pFaceInfo.family_name, FONTSIZE, oFontInfo.Style);

		this.ItemIndex = 0;
		this.FontSize  = oFontInfo.Size;

		AscFonts.HB_ShapeString(this, nFontId, oFontInfo.Style, this.FontId, 15, nScript, nDirection, "en");

		this.ClearBuffer();
	};
	CTextShaper.prototype.FlushGrapheme = function(oGrapheme, nWidth, nCodePointsCount, isLigature)
	{
		if (this.ItemIndex + nCodePointsCount - 1 >= this.Items.length)
			return;

		let _isLigature = isLigature && nCodePointsCount > 1;

		let _nWidth = (_isLigature ? nWidth / nCodePointsCount : nWidth) * this.FontSize;
		this.Items[this.ItemIndex].SetGrapheme(oGrapheme, this.FontSlot);
		this.Items[this.ItemIndex].SetWidth(_nWidth);

		_nWidth = _isLigature ? _nWidth : 0;
		for (let nIndex = 1; nIndex < nCodePointsCount; ++nIndex)
		{
			this.Items[this.ItemIndex + nIndex].SetGrapheme(null, 0);
			this.Items[this.ItemIndex + nIndex].SetWidth(_nWidth);
		}

		this.ItemIndex += nCodePointsCount;
	};
	CTextShaper.prototype.GetTextScript = function(nUnicode)
	{
		return AscFonts.hb_get_script_by_unicode(nUnicode);
	};
	CTextShaper.prototype.GetFontSlot = function(nUnicode)
	{
		let oTextPr = this.TextPr;
		if (!oTextPr)
			return fontslot_None;

		return g_font_detector.Get_FontClass(nUnicode, oTextPr.RFonts.Hint, oTextPr.Lang.EastAsia, oTextPr.CS, oTextPr.RTL);
	};
	CTextShaper.prototype.GetDirection = function(nScript)
	{
		return AscFonts.hb_get_script_horizontal_direction(nScript);
	};
	CTextShaper.prototype.private_CheckNewSegment = function(nUnicode)
	{
		if (this.Items.length >= AscFonts.HB_STRING_MAX_LEN)
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

		if (AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript || -1 === this.FontId)
			nFontId = MEASURER.GetFileFontId(nUnicode, -1 !== this.FontId ? this.FontId : null);

		if (this.FontId !== nFontId && -1 !== this.FontId)
			this.FlushWord();

		this.Script   = AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript || -1 === this.Script ? nScript : this.Script;
		this.FontSlot = fontslot_None !== nFontSlot ? nFontSlot : this.FontSlot;
		this.FontId   = nFontId;
	};
	CTextShaper.prototype.private_CheckFont = function(nFontSlot)
	{
		if (this.FontSlot !== nFontSlot)
		{
			let oFontInfo = this.TextPr.GetFontInfo(nFontSlot);
			MEASURER.SetFontInternal(oFontInfo.Name, 72, oFontInfo.Style);
		}
	};
	CTextShaper.prototype.private_CheckRun = function(oRun)
	{
		let oRunParent = oRun.GetParent();
		let oTextPr    = oRun.Get_CompiledPr(false);

		if (this.Parent !== oRunParent || !this.TextPr || !this.TextPr.IsEqual(oTextPr))
			this.FlushWord();

		this.Parent = oRunParent;
		this.TextPr = oTextPr;
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonWord'] = window['AscCommonWord'] || {};
	window['AscCommonWord'].CTextShaper = CTextShaper;
	window['AscCommonWord'].TextShaper  = new CTextShaper();

})(window);
