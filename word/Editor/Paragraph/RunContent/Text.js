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
	const FLAGS_MASK                        = 0xFFFFFFFF; // 4 байта
	const FLAGS_ASCII                       = 0x00000000; // В 0-1 битах записан
	const FLAGS_CS                          = 0x00000001; // FontSlot (не флагами, а значением
	const FLAGS_HANSI                       = 0x00000002; // от 0 до 3)
	const FLAGS_EASTASIA                    = 0x00000003; //
	const FLAGS_FONTKOEF_SCRIPT             = 0x00000004; // 2 бит
	const FLAGS_FONTKOEF_SMALLCAPS          = 0x00000008; // 3 бит
	const FLAGS_SPACEAFTER                  = 0x00000010; // 4 бит
	const FLAGS_CAPITALS                    = 0x00000020; // 5 бит
	const FLAGS_LIGATURE                    = 0x00000040; // 6 бит
	const FLAGS_LIGATURE_CONTINUE           = 0x00000080; // 7 бит
	const FLAGS_COMBINING_MARK              = 0x00000100; // 8 бит
	const FLAGS_TEMPORARY                   = 0x00000200; // 9 бит
	const FLAGS_TEMPORARY_LIGATURE          = 0x00000400; // 10 бит
	const FLAGS_TEMPORARY_LIGATURE_CONTINUE = 0x00000800; // 11 бит
	const FLAGS_TEMPORARY_COMBINING_MARK    = 0x00001000; // 12 бит
	const FLAGS_VISIBLE_WIDTH               = 0x00002000; // 13 бит

	// 16-31 биты зарезервированы под FontSize

	const FLAGS_NON_FONTKOEF_SCRIPT             = FLAGS_MASK ^ FLAGS_FONTKOEF_SCRIPT;
	const FLAGS_NON_FONTKOEF_SMALLCAPS          = FLAGS_MASK ^ FLAGS_FONTKOEF_SMALLCAPS;
	const FLAGS_NON_SPACEAFTER                  = FLAGS_MASK ^ FLAGS_SPACEAFTER;
	const FLAGS_NON_CAPITALS                    = FLAGS_MASK ^ FLAGS_CAPITALS;
	const FLAGS_NON_LIGATURE                    = FLAGS_MASK ^ FLAGS_LIGATURE;
	const FLAGS_NON_LIGATURE_CONTINUE           = FLAGS_MASK ^ FLAGS_LIGATURE_CONTINUE;
	const FLAGS_NON_COMBINING_MARK              = FLAGS_MASK ^ FLAGS_COMBINING_MARK;
	const FLAGS_NON_TEMPORARY                   = FLAGS_MASK ^ FLAGS_TEMPORARY;
	const FLAGS_NON_TEMPORARY_LIGATURE          = FLAGS_MASK ^ FLAGS_TEMPORARY_LIGATURE;
	const FLAGS_NON_TEMPORARY_LIGATURE_CONTINUE = FLAGS_MASK ^ FLAGS_TEMPORARY_LIGATURE_CONTINUE;
	const FLAGS_NON_VISIBLE_WIDTH               = FLAGS_MASK ^ FLAGS_VISIBLE_WIDTH;
	const FLAGS_NON_TEMPORARY_COMBINING_MARK    = FLAGS_MASK ^ FLAGS_TEMPORARY_COMBINING_MARK;

	/**
	 * Класс представляющий текстовый символ
	 * @param {Number} nCharCode - Юникодное значение символа
	 * @constructor
	 * @extends {AscWord.CRunElementBase}
	 */
	function CRunText(nCharCode)
	{
		AscWord.CRunElementBase.call(this);

		this.Value    = undefined !== nCharCode ? nCharCode : 0x00;
		this.Width    = 0x00000000 | 0;
		this.Flags    = 0x00000000 | 0;
		this.Grapheme = AscFonts.NO_GRAPHEME;

		this.Set_SpaceAfter(this.private_IsSpaceAfter());

		if (AscFonts.IsCheckSymbols)
			AscFonts.FontPickerByCharacter.getFontBySymbol(this.Value);

	}
	CRunText.prototype = Object.create(AscWord.CRunElementBase.prototype);
	CRunText.prototype.constructor = CRunText;

	CRunText.prototype.Type = para_Text;
	CRunText.prototype.Set_CharCode = function(CharCode)
	{
		this.Value = CharCode;
		this.Set_SpaceAfter(this.private_IsSpaceAfter());

		if (AscFonts.IsCheckSymbols)
			AscFonts.FontPickerByCharacter.getFontBySymbol(this.Value);
	};
	CRunText.prototype.GetCharCode = function()
	{
		return this.Value;
	};
	CRunText.prototype.GetCodePoint = function()
	{
		return this.Value;
	};
	CRunText.prototype.SetGrapheme = function(nGrapheme)
	{
		this.Grapheme = nGrapheme;
	};
	CRunText.prototype.SetTemporaryGrapheme = function(nGrapheme)
	{
		this.Flags |= FLAGS_TEMPORARY;
		this.TempGrapheme = nGrapheme;
	};
	CRunText.prototype.GetGrapheme = function()
	{
		return (this.Flags & FLAGS_TEMPORARY ? this.TempGrapheme : this.Grapheme);
	};
	CRunText.prototype.ResetTemporaryGrapheme = function()
	{
		this.Flags &= FLAGS_NON_TEMPORARY;
	};
	CRunText.prototype.SetMetrics = function(nFontSize, nFontSlot, oTextPr)
	{
		let nFontCoef = 1;

		if (undefined !== nFontSlot)
		{
			let nFS = FLAGS_ASCII;
			if (nFontSlot & fontslot_EastAsia)
				nFS = FLAGS_EASTASIA;
			else if (nFontSlot & fontslot_HAnsi)
				nFS = FLAGS_HANSI;
			else if (nFontSlot & fontslot_CS)
				nFS = FLAGS_CS;

			this.Flags = (this.Flags & 0xFFFFFFFC) | nFS;

			if (oTextPr.Caps || oTextPr.SmallCaps)
			{
				this.Flags |= FLAGS_CAPITALS;

				if (!oTextPr.Caps && this.Value !== (String.fromCharCode(this.Value).toUpperCase()).charCodeAt(0))
					this.Flags |= FLAGS_FONTKOEF_SMALLCAPS;
				else
					this.Flags &= FLAGS_NON_FONTKOEF_SMALLCAPS;
			}
			else
			{
				this.Flags &= FLAGS_NON_CAPITALS;
				this.Flags &= FLAGS_NON_FONTKOEF_SMALLCAPS;
			}

			if (oTextPr.VertAlign !== AscCommon.vertalign_Baseline)
				this.Flags |= FLAGS_FONTKOEF_SCRIPT;
			else
				this.Flags &= FLAGS_NON_FONTKOEF_SCRIPT;

			if (this.Flags & FLAGS_FONTKOEF_SCRIPT && this.Flags & FLAGS_FONTKOEF_SMALLCAPS)
				nFontCoef = smallcaps_and_script_koef;
			else if (this.Flags & FLAGS_FONTKOEF_SCRIPT)
				nFontCoef = AscCommon.vaKSize;
			else if (this.Flags & FLAGS_FONTKOEF_SMALLCAPS)
				nFontCoef = smallcaps_Koef;
		}

		// Разрешенные размеры шрифта только либо целое, либо целое/2. Даже после применения FontKoef, поэтому
		// мы должны подкрутить коэффициент так, чтобы после домножения на него, у на получался разрешенный размер.
		let _nFontSize = nFontSize;
		if (1 !== nFontCoef)
			_nFontSize = (((_nFontSize * nFontCoef * 2 + 0.5) | 0) / 2);

		this.Flags = (this.Flags & 0xFFFF) | (((_nFontSize * 64) & 0xFFFF) << 16);
	};
	CRunText.prototype.SetCodePointType = function(nType)
	{
		if (nType === AscWord.CODEPOINT_TYPE.LIGATURE)
			this.Flags |= FLAGS_LIGATURE;
		else
			this.Flags &= FLAGS_NON_LIGATURE;

		if (nType === AscWord.CODEPOINT_TYPE.LIGATURE_CONTINUE)
			this.Flags |= FLAGS_LIGATURE_CONTINUE;
		else
			this.Flags &= FLAGS_NON_LIGATURE_CONTINUE;

		if (nType === AscWord.CODEPOINT_TYPE.COMBINING_MARK)
			this.Flags |= FLAGS_COMBINING_MARK;
		else
			this.Flags &= FLAGS_NON_COMBINING_MARK;
	};
	CRunText.prototype.SetTemporaryCodePointType = function(nType)
	{
		if (nType === AscWord.CODEPOINT_TYPE.LIGATURE)
			this.Flags |= FLAGS_TEMPORARY_LIGATURE;
		else
			this.Flags &= FLAGS_NON_TEMPORARY_LIGATURE;

		if (nType === AscWord.CODEPOINT_TYPE.LIGATURE_CONTINUE)
			this.Flags |= FLAGS_TEMPORARY_LIGATURE_CONTINUE;
		else
			this.Flags &= FLAGS_NON_TEMPORARY_LIGATURE_CONTINUE;

		if (nType === AscWord.CODEPOINT_TYPE.COMBINING_MARK)
			this.Flags |= FLAGS_TEMPORARY_COMBINING_MARK;
		else
			this.Flags &= FLAGS_NON_TEMPORARY_COMBINING_MARK;
	};
	CRunText.prototype.GetCodePointType = function()
	{
		if (this.Flags & FLAGS_TEMPORARY)
		{
			if (this.Flag & FLAGS_TEMPORARY_LIGATURE)
				return AscWord.CODEPOINT_TYPE.LIGATURE;
			else if (this.Flags & FLAGS_TEMPORARY_LIGATURE_CONTINUE)
				return AscWord.CODEPOINT_TYPE.LIGATURE_CONTINUE;
			else if (this.Flags & FLAGS_TEMPORARY_COMBINING_MARK)
				return AscWord.CODEPOINT_TYPE.COMBINING_MARK;
		}
		else
		{
			if (this.Flag & FLAGS_LIGATURE)
				return AscWord.CODEPOINT_TYPE.LIGATURE;
			else if (this.Flags & FLAGS_LIGATURE_CONTINUE)
				return AscWord.CODEPOINT_TYPE.LIGATURE_CONTINUE;
			else if (this.Flags & FLAGS_COMBINING_MARK)
				return AscWord.CODEPOINT_TYPE.COMBINING_MARK;
		}

		return AscWord.CODEPOINT_TYPE.BASE;
	};
	CRunText.prototype.IsLigature = function()
	{
		if (this.Flags & FLAGS_TEMPORARY)
			return !!(this.Flags & FLAGS_TEMPORARY_LIGATURE);
		else
			return !!(this.Flags & FLAGS_LIGATURE);
	};
	CRunText.prototype.GetLigatureWidth = function()
	{
		return (AscFonts.GetGraphemeWidth(this.Flags & FLAGS_TEMPORARY ? this.TempGrapheme : this.Grapheme) * (((this.Flags >> 16) & 0xFFFF) / 64));
	};
	CRunText.prototype.SetWidth = function(nWidth)
	{
		this.Width = ((nWidth * (((this.Flags >> 16) & 0xFFFF) / 64)) * AscWord.TEXTWIDTH_DIVIDER) | 0;
	};
	CRunText.prototype.SetTemporaryWidth = function(nWidth)
	{
		this.TempWidth = ((nWidth * (((this.Flags >> 16) & 0xFFFF) / 64)) * AscWord.TEXTWIDTH_DIVIDER) | 0;
	};
	CRunText.prototype.SetWidthVisible = function(nWidth)
	{
		let nW = (nWidth * AscWord.TEXTWIDTH_DIVIDER) | 0;

		let isTemporary = this.IsTemporary();

		if ((isTemporary && this.TempWidth !== nW)
			|| (!isTemporary && this.Width !== nW))
		{
			this.Flags |= FLAGS_VISIBLE_WIDTH;
			this.WidthVisible = nW;
		}
		else
		{
			this.Flags &= FLAGS_NON_VISIBLE_WIDTH;
		}
	};
	CRunText.prototype.GetWidthVisible = function()
	{
		if (this.Flags & FLAGS_VISIBLE_WIDTH)
			return (this.WidthVisible / AscWord.TEXTWIDTH_DIVIDER);
		else if (this.Flags & FLAGS_TEMPORARY)
			return (this.TempWidth / AscWord.TEXTWIDTH_DIVIDER);
		else
			return (this.Width / AscWord.TEXTWIDTH_DIVIDER);
	};
	CRunText.prototype.Get_Width = function()
	{
		return this.GetWidth();
	};
	CRunText.prototype.GetWidth = function()
	{
		if (this.Flags & FLAGS_TEMPORARY)
			return (this.TempWidth / AscWord.TEXTWIDTH_DIVIDER);

		return (this.Width / AscWord.TEXTWIDTH_DIVIDER);
	};
	CRunText.prototype.GetMeasuredWidth = function()
	{
		return (this.GetWidth() / (((this.Flags >> 16) & 0xFFFF) / 64));
	};
	CRunText.prototype.Draw = function(X, Y, Context, PDSE, oTextPr)
	{
		// if (undefined !== this.LGap)
		// {
		// 	this.private_DrawGapsBackground(X, Y, Context, PDSE, oTextPr);
		// 	X += this.LGap;
		// }

		let nFontSize = (((this.Flags >> 16) & 0xFFFF) / 64);
		if (this.Flags & FLAGS_TEMPORARY)
		{
			if (AscFonts.NO_GRAPHEME !== this.TempGrapheme)
				AscFonts.DrawGrapheme(this.TempGrapheme, Context, X, Y, nFontSize);
		}
		else if (AscFonts.NO_GRAPHEME !== this.Grapheme && (!this.IsNBSP() || (editor && editor.ShowParaMarks)))
		{
			AscFonts.DrawGrapheme(this.Grapheme, Context, X, Y, nFontSize);
		}
	};
	CRunText.prototype.Measure = function(Context, TextPr)
	{
		// if (this.LGap || this.RGap)
		// {
		// 	delete this.LGap;
		// 	delete this.RGap;
		// }
	};
	CRunText.prototype.CanAddNumbering = function()
	{
		return true;
	};
	CRunText.prototype.Copy = function()
	{
		return new CRunText(this.Value);
	};
	CRunText.prototype.IsEqual = function(oElement)
	{
		return (oElement.Type === this.Type && this.Value === oElement.Value);
	};
	CRunText.prototype.IsNBSP = function()
	{
		return (this.Value === nbsp_charcode);
	};
	CRunText.prototype.IsPunctuation = function()
	{
		return !!(undefined !== AscCommon.g_aPunctuation[this.Value]);
	};
	CRunText.prototype.IsNumber = function()
	{
		return this.IsDigit();
	};
	CRunText.prototype.Is_SpecialSymbol = function()
	{
		if (1 === g_aSpecialSymbols[this.Value])
			return true;

		return false;
	};
	CRunText.prototype.IsSpaceAfter = function()
	{
		return !!(this.Flags & FLAGS_SPACEAFTER);
	};
	/**
	 * Получаем символ для проверки орфографии
	 * @param bCaps {boolean}
	 * @return {string}
	 */
	CRunText.prototype.GetCharForSpellCheck = function(bCaps)
	{
		// Закрывающуюся кавычку (0x2019), посылаем как апостроф

		if (0x2019 === this.Value)
			return String.fromCharCode(0x0027);
		else
		{
			if (true === bCaps)
				return (String.fromCharCode(this.Value)).toUpperCase();
			else
				return String.fromCharCode(this.Value);
		}
	};
	CRunText.prototype.Set_SpaceAfter = function(bSpaceAfter)
	{
		if (bSpaceAfter)
			this.Flags |= FLAGS_SPACEAFTER;
		else
			this.Flags &= FLAGS_NON_SPACEAFTER;
	};
	CRunText.prototype.IsNoBreakHyphen = function()
	{
		return (false === this.IsSpaceAfter() && this.Value === 0x002D);
	};
	CRunText.prototype.Write_ToBinary = function(Writer)
	{
		// Long : Type
		// Long : Value

		Writer.WriteLong(para_Text);
		Writer.WriteLong(this.Value);
	};
	CRunText.prototype.Read_FromBinary = function(Reader)
	{
		this.Set_CharCode(Reader.GetLong());
	};
	CRunText.prototype.private_IsSpaceAfter = function()
	{
		// Дефисы
		if (0x002D === this.Value || 0x2014 === this.Value)
			return true;

		if (AscCommon.isEastAsianScript(this.Value) && this.CanBeAtEndOfLine())
			return true;

		return false;
	};
	CRunText.prototype.CanBeAtBeginOfLine = function()
	{
		if (this.IsNBSP())
			return false;

		return (!(AscCommon.g_aPunctuation[this.Value] & AscCommon.PUNCTUATION_FLAG_CANT_BE_AT_BEGIN));
	};
	CRunText.prototype.CanBeAtEndOfLine = function()
	{
		if (this.IsNBSP())
			return false;

		return (!(AscCommon.g_aPunctuation[this.Value] & AscCommon.PUNCTUATION_FLAG_CANT_BE_AT_END));
	};
	CRunText.prototype.GetAutoCorrectFlags = function()
	{
		// 33 !
		// 34 "
		// 39 '
		// 45 -
		// 58 :
		// 59 ;
		// 63 ?
		if (33 === this.Value
			|| 34 === this.Value
			|| 39 === this.Value
			|| 45 === this.Value
			|| 58 === this.Value
			|| 59 === this.Value
			|| 63 === this.Value)
			return AscCommonWord.AUTOCORRECT_FLAGS_ALL;

		// /,\,@  - исключения, на них мы не должны стартовать атозамену первой буквы предложения
		if ((this.IsPunctuation() || this.IsNumber()) && 92 !== this.Value && 47 !== this.Value && 64 !== this.Value)
			return AscCommonWord.AUTOCORRECT_FLAGS_FIRST_LETTER_SENTENCE | AscCommonWord.AUTOCORRECT_FLAGS_HYPHEN_WITH_DASH;

		return AscCommonWord.AUTOCORRECT_FLAGS_NONE;
	};
	CRunText.prototype.IsDiacriticalSymbol = function()
	{
		return !!(0x0300 <= this.Value && this.Value <= 0x036F);
	};
	CRunText.prototype.IsDot = function()
	{
		return (this.Value === 0x002E);
	};
	CRunText.prototype.IsExclamationMark = function()
	{
		return (this.Value === 0x0021);
	};
	CRunText.prototype.IsQuestionMark = function()
	{
		return (this.Value === 0x003F);
	};
	CRunText.prototype.IsHyphen = function()
	{
		return (this.Value === 0x002D);
	};
	CRunText.prototype.SetGaps = function(nLeftGap, nRightGap)
	{
		this.LGap = nLeftGap;
		this.RGap = nRightGap;

		this.Width        += ((nLeftGap + nRightGap) * AscWord.TEXTWIDTH_DIVIDER) | 0;
		this.WidthVisible += ((nLeftGap + nRightGap) * AscWord.TEXTWIDTH_DIVIDER) | 0;
	};
	CRunText.prototype.ResetGapBackground = function()
	{
		this.RGapCount     = undefined;
		this.RGapCharCode  = undefined;
		this.RGapCharWidth = undefined;
		this.RGapShift     = undefined;
		this.RGapFontSlot  = undefined;
		this.RGapFont      = undefined;
	};
	CRunText.prototype.SetGapBackground = function(nCount, nCharCode, nCombWidth, oContext, sFont, oTextPr, oTheme, nCombBorderW)
	{
		this.RGapCount    = nCount;
		this.RGapCharCode = nCharCode;
		this.RGapFontSlot = g_font_detector.Get_FontClass(nCharCode, oTextPr.RFonts.Hint, oTextPr.Lang.EastAsia, oTextPr.CS, oTextPr.RTL);

		if (sFont)
		{
			this.RGapFont = sFont;

			var oCurTextPr = oTextPr.Copy();
			oCurTextPr.SetFontFamily(sFont);

			oContext.SetTextPr(oCurTextPr, oTheme);
			oContext.SetFontSlot(this.RGapFontSlot, oTextPr.Get_FontKoef());
		}

		this.RGapCharWidth = !nCharCode ? nCombBorderW : Math.max(oContext.MeasureCode(nCharCode).Width + oTextPr.Spacing + nCombBorderW, nCombBorderW);
		this.RGapShift     = Math.max(nCombWidth, this.RGapCharWidth);

		if (sFont)
			oContext.SetTextPr(oTextPr, oTheme);
	};
	CRunText.prototype.private_DrawGapsBackground = function(X, Y, oContext, PDSE, oTextPr)
	{
		if (!this.RGapCharCode)
			return;

		if (this.RGapFont)
		{
			var oCurTextPr = oTextPr.Copy();
			oCurTextPr.SetFontFamily(this.RGapFont);

			oContext.SetTextPr(oCurTextPr, PDSE.Theme);
			oContext.SetFontSlot(this.RGapFontSlot, oTextPr.Get_FontKoef());
		}

		if (this.RGap && this.RGapCount)
		{
			X += this.Width / AscWord.TEXTWIDTH_DIVIDER;
			var nShift = (this.RGapShift - this.RGapCharWidth) / 2;

			for (var nIndex = 0; nIndex < this.RGapCount; ++nIndex)
			{
				X -= nShift + this.RGapCharWidth;

				oContext.FillTextCode(X, Y, this.RGapCharCode);

				X -= nShift;
			}
		}

		if (this.RGapFont)
			oContext.SetTextPr(oTextPr, PDSE.Theme);
	};
	CRunText.prototype.IsLetter = function()
	{
		return (!this.IsPunctuation() && !this.IsNumber() && !this.IsNBSP());
	};
	CRunText.prototype.IsDigit = function()
	{
		return AscCommon.IsDigit(this.Value);
	};
	CRunText.prototype.ToSearchElement = function(oProps)
	{
		if (0x2D === this.Value && !this.IsSpaceAfter())
			return new AscCommonWord.CSearchTextSpecialNonBreakingHyphen();

		if (!oProps.IsMatchCase())
			return new AscCommonWord.CSearchTextItemChar(String.fromCodePoint(this.Value).toLowerCase().codePointAt(0));

		return new AscCommonWord.CSearchTextItemChar(this.Value);
	};
	CRunText.prototype.ToMathElement = function()
	{
		if (38 === this.Value)
			return new CMathAmp();

		let oText = new CMathText();
		oText.add(this.Value);
		return oText;
	};
	CRunText.prototype.IsText = function()
	{
		return true;
	};
	CRunText.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
	{
		let fontSlot = g_font_detector.Get_FontClass(this.Value, nHint, nEA_lcid, isCS, isRTL);
		if (fontSlot === fontslot_ASCII)
			return rfont_ASCII;
		else if (fontSlot === fontslot_HAnsi)
			return rfont_HAnsi;
		else if (fontSlot === fontslot_CS)
			return rfont_CS;
		else if (fontSlot === fontslot_EastAsia)
			return rfont_EastAsia;

		return rfont_None;
	};
	CRunText.prototype.IsCombiningMark = function()
	{
		return !!(this.Flags & FLAGS_TEMPORARY ? this.Flags & FLAGS_TEMPORARY_COMBINING_MARK : this.Flags & FLAGS_COMBINING_MARK);
	};
	CRunText.prototype.IsLigatureContinue = function()
	{
		if (this.Flags & FLAGS_TEMPORARY)
			return !!(this.Flags & FLAGS_TEMPORARY_LIGATURE_CONTINUE);
		else
			return !!(this.Flags & FLAGS_LIGATURE_CONTINUE);
	};
	CRunText.prototype.IsTemporary = function()
	{
		return !!(this.Flags & FLAGS_TEMPORARY);
	};
	CRunText.prototype.IsNeedSaveRecalculateObject = function()
	{
		return true;
	};
	CRunText.prototype.SaveRecalculateObject = function()
	{
		let state = [this.Flags, this.Grapheme, this.Width];

		if (this.Flags & FLAGS_TEMPORARY)
		{
			state.push(this.TempGrapheme);
			state.push(this.TempWidth);
		}

		if (this.Flags & FLAGS_VISIBLE_WIDTH)
		{
			state.push(this.WidthVisible);
		}

		return state;
	};
	CRunText.prototype.LoadRecalculateObject = function(oState)
	{
		if (!oState || oState.length < 3)
			return;

		let nPos = 0;

		this.Flags    = oState[nPos++];
		this.Grapheme = oState[nPos++];
		this.Width    = oState[nPos++];

		if (this.Flags & FLAGS_TEMPORARY)
		{
			this.TempGrapheme = oState[nPos++];
			this.TempWidth    = oState[nPos++];
		}

		if (this.Flags & FLAGS_VISIBLE_WIDTH)
		{
			this.WidthVisible = oState[nPos++];
		}
	};
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'] = window['AscWord'] || {};
	window['AscWord'].CRunText = CRunText;

})(window);
