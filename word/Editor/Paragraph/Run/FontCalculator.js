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
	 * Данный класс рассчитывает текстовые настройки шрифта для выделенного текста
	 * @constructor
	 */
	function CFontCalculator()
	{
		this.Bold     = null;
		this.Italic   = null;
		this.FontSize = null;
		this.FontName = null;
	}
	CFontCalculator.prototype.Calculate = function(oDocContent, oTextPr)
	{
		this.Reset();

		if (oDocContent.IsTextSelectionUse())
			this.HandleSelectionCase(oDocContent);
		else
			this.HandleCursorCase(oDocContent);

		oTextPr.Bold       = this.Bold;
		oTextPr.Italic     = this.Italic;
		oTextPr.FontSize   = this.FontSize;
		oTextPr.FontFamily = {Name : this.FontName, Index : -1};
	};
	//------------------------------------------------------------------------------------------------------------------
	CFontCalculator.prototype.Reset = function()
	{
		this.Bold     = null;
		this.Italic   = null;
		this.FontSize = null;
		this.FontName = null;
	};
	CFontCalculator.prototype.HandleSelectionCase = function(oDocContent)
	{
		let oThis = this;
		oDocContent.CheckSelectedRunContent(function(oRun, nStartPos, nEndPos)
		{
			if (oThis.IsStop())
				return true;

			if (oRun.IsEmpty())
				return false;

			let nFontSlot = oRun.GetFontSlot(nStartPos, nEndPos);
			let oTextPr   = oRun.Get_CompiledPr(false);

			if (nFontSlot & AscWord.fontslot_CS)
			{
				oThis.CheckBold(oTextPr.BoldCS);
				oThis.CheckItalic(oTextPr.ItalicCS);
				oThis.CheckFontSize(oTextPr.FontSizeCS);
				oThis.CheckFontName(oTextPr.RFonts.CS.Name);
			}

			if (nFontSlot !== AscWord.fontslot_CS && nFontSlot !== AscWord.fontslot_None)
			{
				oThis.CheckBold(oTextPr.Bold);
				oThis.CheckItalic(oTextPr.Italic);
				oThis.CheckFontSize(oTextPr.FontSize);
			}

			if (nFontSlot & AscWord.fontslot_ASCII)
				oThis.CheckFontName(oTextPr.RFonts.Ascii.Name);

			if (nFontSlot & AscWord.fontslot_HAnsi)
				oThis.CheckFontName(oTextPr.RFonts.HAnsi.Name);

			if (nFontSlot & AscWord.fontslot_EastAsia)
				oThis.CheckFontName(oTextPr.RFonts.EastAsia.Name);

			return false;
		});
	};
	CFontCalculator.prototype.HandleCursorCase = function(oDocContent)
	{
		this.Bold     = undefined;
		this.Italic   = undefined;
		this.FontSize = undefined;
		this.FontName = undefined;

		let oParagraph = oDocContent.GetCurrentParagraph();
		if (!oParagraph)
			return;

		let oParaContentPos = oParagraph.Get_ParaContentPos(false, false);
		if (!oParaContentPos)
			return;

		let oRun = oParagraph.GetClassByPos(oParaContentPos);
		if (!oRun || !(oRun instanceof AscWord.ParaRun))
			return;

		let nInRunPos = oParaContentPos.Get(oParaContentPos.GetDepth());
		let oItem;
		if (nInRunPos > 0)
			oItem = oRun.GetElement(nInRunPos - 1);
		else
			oItem = oRun.GetElement(nInRunPos);

		let oTextPr   = oRun.Get_CompiledPr(false);
		let nFontSlot = AscWord.fontslot_ASCII;
		if (oItem && oItem.IsText())
			nFontSlot = AscWord.GetFontSlot(oItem.GetCodePoint(), oTextPr.RFonts.Hint, oTextPr.Lang.EastAsia, oTextPr.CS, oTextPr.RTL);

		if (nFontSlot & AscWord.fontslot_ASCII)
			this.FontName = oTextPr.RFonts.Ascii.Name;
		else if (nFontSlot & AscWord.fontslot_HAnsi)
			this.FontName = oTextPr.RFonts.HAnsi.Name;
		else if (nFontSlot & AscWord.fontslot_EastAsia)
			this.FontName = oTextPr.RFonts.EastAsia.Name;

		if (nFontSlot & AscWord.fontslot_CS)
		{
			this.Bold     = oTextPr.BoldCS;
			this.Italic   = oTextPr.ItalicCS;
			this.FontSize = oTextPr.FontSizeCS;
			this.FontName = oTextPr.RFonts.CS.Name;
		}
		else
		{
			this.Bold     = oTextPr.Bold;
			this.Italic   = oTextPr.Italic;
			this.FontSize = oTextPr.FontSize;
		}
	};
	CFontCalculator.prototype.IsStop = function()
	{
		return (undefined === this.Bold
			&& undefined === this.Italic
			&& undefined === this.FontSize
			&& undefined === this.FontName);
	};
	CFontCalculator.prototype.CheckBold = function(isBold)
	{
		if (undefined === this.Bold)
			return;

		if (null === this.Bold)
			this.Bold = isBold;
		else if (this.Bold !== isBold)
			this.Bold = undefined;
	};
	CFontCalculator.prototype.CheckItalic = function(isItalic)
	{
		if (undefined === this.Italic)
			return;

		if (null === this.Italic)
			this.Italic = isItalic;
		else if (this.Italic !== isItalic)
			this.Italic = undefined;
	};
	CFontCalculator.prototype.CheckFontSize = function(nFontSize)
	{
		if (undefined === this.FontSize)
			return;

		if (null === this.FontSize)
			this.FontSize = nFontSize;
		else if (this.FontSize !== nFontSize)
			this.FontSize = undefined;
	};
	CFontCalculator.prototype.CheckFontName = function(sFontName)
	{
		if (undefined === this.FontName)
			return;

		if (null === this.FontName)
			this.FontName = sFontName;
		else if (this.FontName !== sFontName)
			this.FontName = undefined;
	};
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'] = window['AscWord'] || {};
	window['AscWord'].FontCalculator = new CFontCalculator();

})(window);
