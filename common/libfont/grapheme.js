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
	const FONTSIZE        = 72;
	const STRING_MAX_LEN  = 1024;
	const COEF            = 25.4 / 72 / 64 / FONTSIZE;
	const GRAPHEME_BUFFER = new Uint32Array(STRING_MAX_LEN);
	let   GRAPHEME_LEN    = 0;
	const GRAPHEMES_CACHE = {};                      // FontId + [GID] -> GraphemeId
	const GRAPHEMES       = [[0, 0, 0, 0, 0, 0, 0]]; // GraphemeId -> Grapheme
	let   GRAPHEME_INDEX  = 0;
	const NO_GRAPHEME     = 0;

	function InitGrapheme(nFontId, nFontStyle)
	{
		GRAPHEME_LEN = 2;
		GRAPHEME_BUFFER[0] = nFontId << 8 | nFontStyle;
		GRAPHEME_BUFFER[1] = 0;
	}
	function AddGlyphToGrapheme(nGID, nAdvanceX, nAdvanceY, nOffsetX, nOffsetY)
	{
		GRAPHEME_BUFFER[GRAPHEME_LEN++] = nGID;
		GRAPHEME_BUFFER[GRAPHEME_LEN++] = nAdvanceX;
		GRAPHEME_BUFFER[GRAPHEME_LEN++] = nAdvanceY;
		GRAPHEME_BUFFER[GRAPHEME_LEN++] = nOffsetX;
		GRAPHEME_BUFFER[GRAPHEME_LEN++] = nOffsetY;

		GRAPHEME_BUFFER[1] += nAdvanceX;
	}
	function DrawGrapheme(nGraphemeId, oContext, nX, nY, nFontSize)
	{
		let oGrapheme = GRAPHEMES[nGraphemeId];
		if (!oGrapheme)
			return;

		let nFontId = oGrapheme[0] >> 8;
		let nStyle  = oGrapheme[0] & 0xF;

		let sFontName = AscCommon.FontNameMap.GetName(nFontId);
		oContext.SetFontInternal(sFontName, nFontSize, nStyle);

		let nKoef = COEF * nFontSize;
		let nPos = 2, nCount = oGrapheme.length;
		while (nPos < nCount)
		{
			let nGID      = oGrapheme[nPos++];
			let nAdvanceX = oGrapheme[nPos++];
			let nAdvanceY = oGrapheme[nPos++];
			let nOffsetX  = oGrapheme[nPos++];
			let nOffsetY  = oGrapheme[nPos++];

			oContext.tg(nGID, nX + nOffsetX * nKoef, nY + nOffsetY * nKoef);
			nX += nAdvanceX * nKoef;
			nY += nAdvanceY * nKoef;
		}
	}
	function CompareGraphemes(g)
	{
		if (g.length !== GRAPHEME_LEN)
			return false;

		for (let nPos = 0; nPos < GRAPHEME_LEN; ++nPos)
		{
			if (g[nPos] !== GRAPHEME_BUFFER[nPos])
				return false;
		}

		return true;
	}
	function GetGraphemeIndex()
	{
		let arrBuffer = new Uint32Array(GRAPHEME_LEN);
		for (let nIndex = 0; nIndex < GRAPHEME_LEN; ++nIndex)
			arrBuffer[nIndex] = GRAPHEME_BUFFER[nIndex];

		GRAPHEMES[++GRAPHEME_INDEX] = arrBuffer;
		return GRAPHEME_INDEX;
	}
	function GetGrapheme()
	{
		let nFontId = GRAPHEME_BUFFER[0];
		if (!GRAPHEMES_CACHE[nFontId])
			GRAPHEMES_CACHE[nFontId] = {};

		let result = GRAPHEMES_CACHE[nFontId];

		let nPos = 2;
		while (nPos < GRAPHEME_LEN)
		{
			let nGID = GRAPHEME_BUFFER[nPos];
			nPos += 5;

			if (!result[nGID])
				result[nGID] = {};

			result = result[nGID];
		}

		// TODO: Для скорости проверку совпадения отключили (всегда совпадает)
		if (!result.Grapheme)
			result.Grapheme = GetGraphemeIndex();
		// else if (!CompareGraphemes(result.Buffer))
		// 	return GetGraphemeIndex();

		return result.Grapheme;
	}
	function GetGraphemeWidth(nGraphemeId)
	{
		let oGrapheme = GRAPHEMES[nGraphemeId];
		if (!oGrapheme)
			return 0;

		return oGrapheme[1] * COEF;
	}
	//--------------------------------------------------------export----------------------------------------------------
	window['AscFonts'] = window['AscFonts'] || {};
	window['AscFonts'].GRAPHEME_STRING_MAX_LEN = STRING_MAX_LEN;
	window['AscFonts'].GRAPHEME_COEF           = COEF;
	window['AscFonts'].NO_GRAPHEME             = NO_GRAPHEME;
	window['AscFonts'].MEASURE_FONTSIZE        = FONTSIZE;
	window['AscFonts'].InitGrapheme            = InitGrapheme;
	window['AscFonts'].DrawGrapheme            = DrawGrapheme;
	window['AscFonts'].CompareGraphemes        = CompareGraphemes;
	window['AscFonts'].AddGlyphToGrapheme      = AddGlyphToGrapheme;
	window['AscFonts'].GetGrapheme             = GetGrapheme;
	window['AscFonts'].GetGraphemeWidth        = GetGraphemeWidth;

})(window);
