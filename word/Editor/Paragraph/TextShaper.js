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
	const COEF     = 25.4 / 72 / 64;
	const LIGATURE = 2;

	function ClusterCodePointLength(nCodePoint)
	{
		if (nCodePoint <= 0x0000007F)
			return 1;
		else if (nCodePoint <= 0x000007FF)
			return 2;
		else if (nCodePoint <= 0x0000FFFF)
			return 3;

		return 4;
	}
	function ClusterStringLength(sValue)
	{
		let nLen = 0;
		for (let oIterator = sValue.getUnicodeIterator(); oIterator.check(); oIterator.next())
		{
			nLen += ClusterCodePointLength(oIterator.value());
		}
		return nLen;
	}

	/**
	 * @param nGID
	 * @param nAdvanceX
	 * @param nAdvanceY
	 * @param nOffsetX
	 * @param nOffsetY
	 * @constructor
	 */
	function CGlyph(nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY)
	{
		this.GID      = nGID;
		this.AdvanceX = nAdvanceX;
		this.AdvanceY = nAdvanceY;
		this.OffsetX  = nOffsetX;
		this.OffsetY  = nOffsetY;
	}

	/**
	 * @param nFontId
	 * @param nStyle
	 * @constructor
	 */
	function CGrapheme(nFontId, nStyle)
	{
		this.Font   = nFontId;
		this.Style  = nStyle;
		this.Glyphs = [];
	}
	CGrapheme.prototype.Add = function(nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY)
	{
		this.Glyphs.push(new CGlyph(nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY));
	};
	CGrapheme.prototype.Draw = function(oContext, nX, nY, nFontSize)
	{
		let nKoef =  COEF / 72 * nFontSize;

		for (let nIndex = 0, nCount = this.Glyphs.length; nIndex < nCount; ++nIndex)
		{
			let oGlyph = this.Glyphs[nIndex];
			oContext.tg(oGlyph.GID, nX + oGlyph.OffsetX * nKoef, nY + oGlyph.OffsetY * nKoef);
			nX += oGlyph.AdvanceX * nKoef;
			nY += oGlyph.AdvanceY * nKoef;
		}
	};

	function CreateGrapheme(nFontId, nFontStyle)
	{
		return new CGrapheme(nFontId, nFontStyle);
	}
	function AddGlyphToGrapheme(oGrapheme, nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY)
	{
		oGrapheme.Add(nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY);
	}
	function DrawGrapheme(oGrapheme, oContext, nX, nY, nFontSize)
	{
		let sFontName = AscCommon.FontNameMap.GetName(oGrapheme.Font);
		oContext.SetFontInternal(sFontName, nFontSize, oGrapheme.Style);
		oGrapheme.Draw(oContext, nX, nY, nFontSize);
	}

	// function CreateGrapheme(nFontId, nFontStyle)
	// {
	// 	return [nFontId << 8 | nFontStyle];
	// }
	// function AddGlyphToGrapheme(oGrapheme, nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY)
	// {
	// 	oGrapheme.push(nGID);
	// 	oGrapheme.push(nAdvanceX);
	// 	oGrapheme.push(nAdvanceY);
	// 	oGrapheme.push(nOffsetX);
	// 	oGrapheme.push(nOffsetY);
	// }
	// function DrawGrapheme(oGrapheme, oContext, nX, nY, nFontSize)
	// {
	// 	let nFontId = oGrapheme[0] >> 8;
	// 	let nStyle  = oGrapheme[0] & 0xF;
	//
	// 	let sFontName = AscCommon.FontNameMap.GetName(nFontId);
	// 	oContext.SetFontInternal(sFontName, nFontSize, nStyle);
	//
	// 	let nKoef = COEF / 72 * nFontSize;
	// 	let nPos = 1, nCount = oGrapheme.length;
	// 	while (nPos < nCount)
	// 	{
	// 		let nGID      = oGrapheme[nPos++];
	// 		let nAdvanceX = oGrapheme[nPos++];
	// 		let nAdvanceY = oGrapheme[nPos++];
	// 		let nOffsetX  = oGrapheme[nPos++];
	// 		let nOffsetY  = oGrapheme[nPos++];
	//
	// 		oContext.tg(nGID, nX + nOffsetX * nKoef, nY + nOffsetY * nKoef);
	// 		nX += nAdvanceX * nKoef;
	// 		nY += nAdvanceY * nKoef;
	// 	}
	// }

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
		this.Text     = "";
	}
	CTextShaper.prototype.Init = function()
	{
		this.Parent = null;
		this.TextPr = null;

		this.ClearBuffer();
	};
	CTextShaper.prototype.ClearBuffer = function()
	{
		this.Items    = [];
		this.Script   = -1;
		this.FontId   = -1;
		this.FontSlot = fontslot_None;
		this.Text     = "";
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

				this.Text += AscCommon.encodeSurrogateChar(nUnicode);
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

		let nScript = AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED === this.Script ? AscFonts.HB_SCRIPT.HB_SCRIPT_COMMON : this.Script;

		let nDirection = this.GetDirection(nScript);

		let arrGlyphs = MEASURER.ShapeText(this.FontId, this.Text, 15, nScript, nDirection, "en");
		let nFontId   = AscCommon.FontNameMap.GetId(this.FontId.m_pFaceInfo.family_name);

		let oFontInfo = this.TextPr.GetFontInfo(this.FontSlot);
		let nFontSize = oFontInfo.Size;
		let nKoef     = COEF * nFontSize / 72;


		MEASURER.SetFontInternal(this.FontId.m_pFaceInfo.family_name, 72, oFontInfo.Style);

		if (AscFonts.HB_DIRECTION.HB_DIRECTION_RTL === nDirection)
		{
			// TODO: Пока у нас нет поддержки RTL мы все слова идущие в RTL считаем как большую составную графему, и не
			//       разбиваем их на нормальные графемы

			let oGrapheme = CreateGrapheme(nFontId, oFontInfo.Style);
			this.Items[0].SetGrapheme(oGrapheme, this.FontSlot);

			let nGraphemeWidth = 0;
			for (let nGlyphIndex = 0, nGlyphsCount = arrGlyphs.length; nGlyphIndex < nGlyphsCount; ++nGlyphIndex)
			{
				let oGlyph = arrGlyphs[nGlyphIndex];
				AddGlyphToGrapheme(oGrapheme, oGlyph.gid, oGlyph.x_advance, oGlyph.y_advance, oGlyph.x_offset, oGlyph.y_offset);
				nGraphemeWidth += oGlyph.x_advance * nKoef;
			}

			this.Items[0].SetWidth(nGraphemeWidth);

			for (let nCharIndex = 1, nCharsCount = this.Items.length; nCharIndex < nCharsCount; ++nCharIndex)
			{
				this.Items[nCharIndex].SetGrapheme(null);
				this.Items[nCharIndex].SetWidth(0);
			}
		}
		else
		{
			let nCharIndex = 0;
			let nClusterMax = ClusterStringLength(this.Text);
			for (let nGlyphIndex = 0, nGlyphsCount = arrGlyphs.length; nGlyphIndex < nGlyphsCount; ++nGlyphIndex)
			{
				let oGlyph   = arrGlyphs[nGlyphIndex];
				let nCluster = oGlyph.cluster;

				let nGraphemeWidth = oGlyph.x_advance * nKoef;
				let arrLigature    = [this.Items[nCharIndex]];

				let nStartChar = this.Items[nCharIndex];

				let oGrapheme = CreateGrapheme(nFontId, oFontInfo.Style);
				AddGlyphToGrapheme(oGrapheme, oGlyph.gid, oGlyph.x_advance, oGlyph.y_advance, oGlyph.x_offset, oGlyph.y_offset);

				let isLigature = LIGATURE === oGlyph.type;

				this.Items[nCharIndex].SetGrapheme(oGrapheme, this.FontSlot);

				nCluster += ClusterCodePointLength(this.Items[nCharIndex].GetCodePoint());
				nCharIndex++;

				while (nGlyphIndex < nGlyphsCount - 1 && arrGlyphs[nGlyphIndex + 1].cluster === oGlyph.cluster)
				{
					oGlyph = arrGlyphs[++nGlyphIndex];
					AddGlyphToGrapheme(oGrapheme, oGlyph.gid, oGlyph.x_advance, oGlyph.y_advance, oGlyph.x_offset, oGlyph.y_offset);

					nGraphemeWidth += oGlyph.x_advance * nKoef;
				}

				nStartChar.SetWidth(nGraphemeWidth);

				let nNextCluster = nGlyphIndex === nGlyphsCount - 1 ? nClusterMax : arrGlyphs[nGlyphIndex + 1].cluster;
				while (nCluster < nNextCluster && nCharIndex < this.Items.length)
				{
					arrLigature.push(this.Items[nCharIndex]);
					this.Items[nCharIndex].SetGrapheme(null, 0);
					this.Items[nCharIndex].SetWidth(0);
					nCluster += ClusterCodePointLength(this.Items[nCharIndex].GetCodePoint());
					nCharIndex++;
				}

				let nLigatureLen = arrLigature.length;
				if (nLigatureLen > 1 && isLigature)
				{
					for (let nLigatureIndex = 0; nLigatureIndex < nLigatureLen; ++nLigatureIndex)
					{
						arrLigature[nLigatureIndex].SetWidth(nGraphemeWidth / nLigatureLen);
					}
				}
			}
		}
		//console.log(arrGlyphs);

		this.ClearBuffer();
	};
	CTextShaper.prototype.GetTextScript = function(nUnicode)
	{
		return AscFonts.hb_get_script_by_unicode(nUnicode);
	};
	CTextShaper.prototype.GetFontSlot = function(nUnicode)
	{
		let oTextPr = this.TextPr;
		if (!this.TextPr)
			return fontslot_None;

		return g_font_detector.Get_FontClass(nUnicode, oTextPr.RFonts.Hint, oTextPr.Lang.EastAsia, oTextPr.CS, oTextPr.RTL);
	};
	CTextShaper.prototype.GetDirection = function(nScript)
	{
		return AscFonts.hb_get_script_horizontal_direction(nScript);
	};
	CTextShaper.prototype.private_CheckNewSegment = function(nUnicode)
	{
		let nScript   = this.GetTextScript(nUnicode);
		let nFontSlot = this.GetFontSlot(nUnicode);

		if ((nScript !== this.Script
				&& -1 !== this.Script
				&& AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript
				&& AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== this.Script)
			|| (nFontSlot !== this.FontSlot
				&& -1 !== this.FontSlot
				&& fontslot_None !== nFontSlot
				&& fontslot_None !== this.FontSlot))
			this.FlushWord();

		this.private_CheckFont(nFontSlot);

		let nFontId = this.FontId;

		if (AscFonts.HB_SCRIPT.HB_SCRIPT_INHERITED !== nScript || -1 === this.FontId)
			nFontId = MEASURER.GetFileFontId(nUnicode);

		if (this.FontId !== nFontId && -1 !== this.FontId)
			this.FlushWord();

		this.Script   = nScript;
		this.FontSlot = nFontSlot;
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
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CTextShaper  = CTextShaper;
	window['AscCommon'].TextShaper   = new CTextShaper();
	window['AscCommon'].DrawGrapheme = DrawGrapheme;

})(window);
