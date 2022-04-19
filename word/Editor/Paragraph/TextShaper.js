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
	 *
	 * @constructor
	 */
	function CTextShaper()
	{
		this.Parent = null;
		this.Buffer = [];
		this.Items  = [];
		this.TextPr = null;
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
		let arrSegments = MEASURER.m_oManager.m_pFont.ShapeCodePointsArray(this.Buffer, 0, AscFonts.HB_SCRIPT["HB_SCRIPT_LATIN"], AscFonts.HB_DIRECTION.HB_DIRECTION_LTR, "en");

		for (let nSegment = 0, nSegmentsCount = arrSegments.length; nSegment < nSegmentsCount; ++nSegment)
		{
			let oSegment = arrSegments[nSegment];
			let nClusterMax = 0;

			for (var oIterator = oSegment.text.getUnicodeIterator(); oIterator.check(); oIterator.next())
			{
				nClusterMax += ClusterLength(oIterator.value());
			}

			for (let nGlyphIndex = 0, nGlyphsCount = oSegment.glyphs.length; nGlyphIndex < nGlyphsCount; ++nGlyphIndex)
			{
				let oGrapheme = oSegment.glyphs[nGlyphIndex];
				let nCluster = oGrapheme.cluster;

				let nGraphemeWidth = oGrapheme.x_advance * COEF;
				let arrLigature = [this.Items[nCharIndex]];
				this.Items[nCharIndex].SetGrapheme(oGrapheme.gid, oSegment.font, nGraphemeWidth);

				nCluster += ClusterLength(this.Items[nCharIndex].GetCodePoint());
				nCharIndex++;

				while (nGlyphIndex < nGlyphsCount - 1 && oSegment.glyphs[nGlyphIndex + 1].cluster === oGrapheme.cluster)
				{
					nGlyphIndex++;
					this.Items[nCharIndex].SetGrapheme(oSegment.glyphs[nGlyphIndex].gid, oSegment.font, 0);
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

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CTextShaper = CTextShaper;
	window['AscCommon'].TextShaper  = new CTextShaper();

})(window);
