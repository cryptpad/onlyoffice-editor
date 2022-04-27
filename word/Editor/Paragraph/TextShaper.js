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
	const COEF     = 25.4 / 72 / 64;

	function ClusterLength(nCodePoint)
	{
		if (nCodePoint <= 0x0000007F)
			return 1;
		else if (nCodePoint <= 0x000007FF)
			return 2;
		else if (nCodePoint <= 0x0000FFFF)
			return 3;

		return 4;
	}

	/**
	 * @param nGID
	 * @param nAdvanceX
	 * @param nAdvanceY
	 * @constructor
	 */
	function CGlyph(nGID, nAdvanceX, nAdvanceY)
	{
		this.GID      = nGID;
		this.AdvanceX = nAdvanceX;
		this.AdvanceY = nAdvanceY;
	}

	/**
	 * @param nFontId
	 * @constructor
	 */
	function CGrapheme(nFontId)
	{
		this.Font   = nFontId;
		this.Glyphs = [];
	}
	CGrapheme.prototype.Add = function(nGID, nAdvanceX, nAdvanceY)
	{
		this.Glyphs.push(new CGlyph(nGID, nAdvanceX, nAdvanceY));
	};
	CGrapheme.prototype.Draw = function(oContext, nX, nY)
	{
		oContext.m_oGrFonts.Ascii.Name = this.Font;
		oContext.m_oGrFonts.Ascii.Index = -1;
		oContext.SetFontSlot(fontslot_ASCII, 1);

		for (let nIndex = 0, nCount = this.Glyphs.length; nIndex < nCount; ++nIndex)
		{
			let oGlyph = this.Glyphs[nIndex];
			oContext.tg(oGlyph.GID, nX, nY);
			nX += oGlyph.AdvanceX;
			nY += oGlyph.AdvanceY;
		}
	};

	/**
	 *
	 * @constructor
	 */
	function CTextShaper()
	{
		this.Parent = null;
		this.Buffer = [];
		this.Items  = [];
		this.TextPr = null;
		this.Script = -1;
	}
	CTextShaper.prototype.Init = function()
	{
		this.Parent = null;
		this.Buffer = [];
		this.Items  = [];
	};
	CTextShaper.prototype.Shape = function(oParagraph)
	{
		this.Init();

		oParagraph.CheckRunContent((o) => this.ShapeRun(o));
	};
	CTextShaper.prototype.ShapeRun = function(oRun)
	{
		let oRunParent = oRun.GetParent();
		let oTextPr    = oRun.Get_CompiledPr(false);

		// TODO: Сравнить настройки для шрифта, и выставить настройки после Flush!!!

		if (this.Parent !== oRunParent || !this.TextPr || this.TextPr.IsEqual(oTextPr))
			this.FlushWord();

		this.Parent = oRunParent;
		this.TextPr = oTextPr;

		for (let nPos = 0, nCount = oRun.GetElementsCount(); nPos < nCount; ++nPos)
		{
			let oItem = oRun.GetElement(nPos);
			if (!oItem.IsText())
			{
				this.FlushWord();
			}
			else
			{
				let nScript = this.GetTextScript(oItem.GetCodePoint());
				if (nScript !== this.Script)
				{
					this.FlushWord();
					this.Script = nScript;
				}

				this.Buffer.push(oItem.GetCharCode());
				this.Items.push(oItem);
				if (oItem.IsSpaceAfter())
					this.FlushWord();
			}
		}
	};
	CTextShaper.prototype.FlushWord = function()
	{
		if (!this.Buffer.length)
			return;

		MEASURER.SetTextPr(this.TextPr);
		MEASURER.SetFontSlot(fontslot_ASCII, 1);

		let nCharIndex = 0;
		let arrSegments = MEASURER.m_oManager.m_pFont.ShapeCodePointsArray(this.Buffer, 15, this.Script, AscFonts.HB_DIRECTION.HB_DIRECTION_LTR, "en");
		for (let nSegment = 0, nSegmentsCount = arrSegments.length; nSegment < nSegmentsCount; ++nSegment)
		{
			let oSegment = arrSegments[nSegment];
			let nClusterMax = 0;

			for (var oIterator = oSegment.text.getUnicodeIterator(); oIterator.check(); oIterator.next())
			{
				nClusterMax += ClusterLength(oIterator.value());
			}

			MEASURER.SetFontInternal(oSegment.font, this.TextPr.FontSize, 0);

			for (let nGlyphIndex = 0, nGlyphsCount = oSegment.glyphs.length; nGlyphIndex < nGlyphsCount; ++nGlyphIndex)
			{
				let oGlyph = oSegment.glyphs[nGlyphIndex];
				let nCluster = oGlyph.cluster;

				let nGraphemeWidth = oGlyph.x_advance * COEF;
				let arrLigature = [this.Items[nCharIndex]];

				let nStartChar = this.Items[nCharIndex];

				this.Items[nCharIndex].SetGrapheme(oGlyph.gid, oSegment.font, nGraphemeWidth);

				// TODO: Поменять на нормальную проверку CombiningMark
				if (oGlyph.x_advance < 0.001)
				{
					let nTempGID = MEASURER.m_oManager.m_pFont.GetGIDByUnicode(0x25CC)
					if (nTempGID)
					{
						let nTempW = MEASURER.m_oManager.m_pFont.GetChar(0x25CC).fAdvanceX * 25.4 / 72;
						this.Items[nCharIndex].SetBaseGrapheme(nTempGID, nTempW);
					}
				}


				nCluster += ClusterLength(this.Items[nCharIndex].GetCodePoint());
				nCharIndex++;

				let arrMarks = [];
				while (nCharIndex < this.Buffer.length && nGlyphIndex < nGlyphsCount - 1 && oSegment.glyphs[nGlyphIndex + 1].cluster === oGlyph.cluster)
				{
					let nCombineW = Math.max(0, oSegment.glyphs[nGlyphIndex + 1].x_advance * COEF);
					nStartChar.AddWidth(nCombineW);

					for (let nMarkIndex = 0, nMarksCount = arrMarks.length; nMarkIndex < nMarksCount; ++nMarkIndex)
					{
						arrMarks[nMarkIndex].AddShift(-nCombineW, 0);
					}

					nGlyphIndex++;
					this.Items[nCharIndex].SetGrapheme(oSegment.glyphs[nGlyphIndex].gid, oSegment.font, 0);
					this.Items[nCharIndex].SetShift(-nCombineW, 0);
					arrMarks.push(this.Items[nCharIndex]);
					nCluster += ClusterLength(this.Items[nCharIndex].GetCodePoint());
					nCharIndex++;
				}

				let nNextCluster = nGlyphIndex === nGlyphsCount - 1 ? nClusterMax : oSegment.glyphs[nGlyphIndex + 1].cluster;
				while (nCluster < nNextCluster && nCharIndex < this.Items.length)
				{
					arrLigature.push(this.Items[nCharIndex]);
					this.Items[nCharIndex].SetGrapheme(0, 0, 0);
					nCluster += ClusterLength(this.Items[nCharIndex].GetCodePoint());
					nCharIndex++;
				}

				let nLigatureLen = arrLigature.length;
				if (nLigatureLen > 1)
				{
					for (let nLigatureIndex = 0; nLigatureIndex < nLigatureLen; ++nLigatureIndex)
					{
						arrLigature[nLigatureIndex].SetWidth(nGraphemeWidth / nLigatureLen);
					}
				}
			}
		}
		console.log(arrSegments);

		this.Buffer = [];
		this.Items  = [];
	};
	CTextShaper.prototype.GetTextScript = function(nUnicode)
	{
		return AscFonts.hb_get_script_by_unicode(nUnicode);
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CTextShaper = CTextShaper;
	window['AscCommon'].TextShaper  = new CTextShaper();

})(window);
