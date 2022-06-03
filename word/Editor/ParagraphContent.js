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

// Содержимое параграфа должно иметь:
//
// 1. Type    - тип
// 2. Draw    - рисуем на контексте
// 3. Measure  - измеряем
//---- после использования Measure -----
// 1. Width        - ширина (для рассчетов)
// 2. Height       - высота
// 3. WidthVisible - видимая ширина
// ------- после пересчета -------------
// 1. CurPage
// 2. CurLine
// 3. CurRange

// Import
var g_fontApplication = AscFonts.g_fontApplication;

var g_oTableId      = AscCommon.g_oTableId;
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var isRealObject    = AscCommon.isRealObject;
var History         = AscCommon.History;

var HitInLine  = AscFormat.HitInLine;
var MOVE_DELTA = AscFormat.MOVE_DELTA;

var c_oAscRelativeFromH = Asc.c_oAscRelativeFromH;
var c_oAscRelativeFromV = Asc.c_oAscRelativeFromV;
var c_oAscSectionBreakType = Asc.c_oAscSectionBreakType;


var break_Line   = 0x01;
var break_Page   = 0x02;
var break_Column = 0x03;

var break_Clear_None  = 0x00;
var break_Clear_All   = 0x01;
var break_Clear_Left  = 0x02;
var break_Clear_Right = 0x03;

var nbsp_charcode = 0x00A0;

var nbsp_string = String.fromCharCode(0x00A0);
var sp_string   = String.fromCharCode(0x0032);

// Suitable Run content for the paragraph simple changes
var g_oSRCFPSC             = [];
g_oSRCFPSC[para_Text]      = 1;
g_oSRCFPSC[para_Space]     = 1;
g_oSRCFPSC[para_End]       = 1;
g_oSRCFPSC[para_Tab]       = 1;
g_oSRCFPSC[para_Sym]       = 1;
g_oSRCFPSC[para_PageCount] = 1;
g_oSRCFPSC[para_FieldChar] = 1;
g_oSRCFPSC[para_InstrText] = 1;
g_oSRCFPSC[para_Bookmark]  = 1;


var g_aSpecialSymbols     = [];
g_aSpecialSymbols[0x00AE] = 1;


// Список символов, которые не могут находиться в конце строки
// A characters that can not be at the end of a line
var g_aCCNBAEL = [];

const PARATEXT_FLAGS_MASK               = 0xFFFFFFFF; // 4 байта
const PARATEXT_FLAGS_FONTKOEF_SCRIPT    = 0x00000004; // 2 бит
const PARATEXT_FLAGS_FONTKOEF_SMALLCAPS = 0x00000008; // 3 бит
const PARATEXT_FLAGS_SPACEAFTER         = 0x00000010; // 4 бит
const PARATEXT_FLAGS_CAPITALS           = 0x00000020; // 5 бит
const PARATEXT_FLAGS_LIGATURE           = 0x00000040; // 6 бит
const PARATEXT_FLAGS_VISIBLE_WIDTH      = 0x00000800; // 11 бит

const PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT             = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SCRIPT;
const PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS          = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
const PARATEXT_FLAGS_NON_CAPITALS                    = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_CAPITALS;


/**
 * Класс представляющий пробелбный символ
 * @param {number} [nCharCode=0x20] - Юникодное значение символа
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaSpace(nCharCode)
{
	AscWord.CRunElementBase.call(this);

	this.Value        = undefined !== nCharCode ? nCharCode : 0x20;
    this.Flags        = 0x00000000 | 0;
    this.Width        = 0x00000000 | 0;
    this.WidthVisible = 0x00000000 | 0;
    this.WidthOrigin  = 0x00000000 | 0;

	if (AscFonts.IsCheckSymbols)
		AscFonts.FontPickerByCharacter.getFontBySymbol(this.Value);
}
ParaSpace.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaSpace.prototype.constructor = ParaSpace;

ParaSpace.prototype.Type = para_Space;
ParaSpace.prototype.IsSpace = function()
{
	return true;
};
ParaSpace.prototype.Draw = function(X, Y, Context, PDSE, oTextPr)
{
	if (undefined !== editor && editor.ShowParaMarks)
	{
		if (undefined !== this.LGap)
		{
			this.private_DrawGapsBackground(X, Y, Context, PDSE, oTextPr);
			X += this.LGap;
		}

		Context.SetFontSlot(fontslot_ASCII, this.Get_FontKoef());

		if (this.SpaceGap)
			X += this.SpaceGap;

		if (0x2003 === this.Value || 0x2002 === this.Value)
			Context.FillText(X, Y, String.fromCharCode(0x00B0));
		else if (0x2005 === this.Value)
			Context.FillText(X, Y, String.fromCharCode(0x007C));
		else
			Context.FillText(X, Y, String.fromCharCode(0x00B7));
	}
};
ParaSpace.prototype.Measure = function(Context, TextPr)
{
	this.Set_FontKoef_Script(TextPr.VertAlign !== AscCommon.vertalign_Baseline);
	this.Set_FontKoef_SmallCaps(true !== TextPr.Caps && true === TextPr.SmallCaps);

	// Разрешенные размеры шрифта только либо целое, либо целое/2. Даже после применения FontKoef, поэтому
	// мы должны подкрутить коэффициент так, чтобы после домножения на него, у нас получался разрешенный размер
	var FontKoef = this.Get_FontKoef();
	var FontSize = TextPr.FontSize;
	if (1 !== FontKoef)
		FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;

	Context.SetFontSlot(fontslot_ASCII, FontKoef);

	var Temp  = Context.MeasureCode(this.Value).Width;

	var ResultWidth  = (Math.max((Temp + TextPr.Spacing), 0) * 16384) | 0;
	this.Width       = ResultWidth;
	this.WidthOrigin = ResultWidth;

	if (Math.abs(Temp) > 0.001)
	{
		let nEnKoef;
		if (g_oTextMeasurer.m_oManager && g_oTextMeasurer.m_oManager.m_pFont && 0 !== g_oTextMeasurer.m_oManager.m_pFont.GetGIDByUnicode(0x2002))
			nEnKoef = Context.MeasureCode(0x2002).Width / Temp;
		else
			nEnKoef = TextPr.FontSize / 72 * 25.4 / 2 / Temp;

		this.WidthEn = (ResultWidth * nEnKoef) | 0;
	}
	else
	{
		this.WidthEn = ResultWidth;
	}

	if (0x2003 === this.Value || 0x2002 === this.Value)
		this.SpaceGap = Math.max((Temp - Context.MeasureCode(0x00B0).Width) / 2, 0);
	else if (0x2005 === this.Value)
		this.SpaceGap = (Temp - Context.MeasureCode(0x007C).Width) / 2;
	else if (undefined !== this.SpaceGap)
		this.SpaceGap = 0;

	// Не меняем здесь WidthVisible, это значение для пробела высчитывается отдельно, и не должно меняться при пересчете

	if (this.LGap || this.RGap)
	{
		delete this.LGap;
		delete this.RGap;
	}
};
ParaSpace.prototype.Get_FontKoef = function()
{
	if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS)
		return smallcaps_and_script_koef;
	else if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT)
		return AscCommon.vaKSize;
	else if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS)
		return smallcaps_Koef;
	else
		return 1;
};
ParaSpace.prototype.Set_FontKoef_Script = function(bScript)
{
	if (bScript)
		this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
	else
		this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;
};
ParaSpace.prototype.Set_FontKoef_SmallCaps = function(bSmallCaps)
{
	if (bSmallCaps)
		this.Flags |= PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
	else
		this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS;
};
ParaSpace.prototype.CanAddNumbering = function()
{
	return true;
};
ParaSpace.prototype.Copy = function()
{
	return new ParaSpace(this.Value);
};
ParaSpace.prototype.Write_ToBinary = function(Writer)
{
	// Long : Type
	// Long : Value

	Writer.WriteLong(para_Space);
	Writer.WriteLong(this.Value);
};
ParaSpace.prototype.Read_FromBinary = function(Reader)
{
	this.Value = Reader.GetLong();
};
ParaSpace.prototype.GetAutoCorrectFlags = function()
{
	return AscCommonWord.AUTOCORRECT_FLAGS_ALL;
};
ParaSpace.prototype.SetCondensedWidth = function(nKoef)
{
	this.Width = this.WidthOrigin * nKoef;
};
ParaSpace.prototype.ResetCondensedWidth = function()
{
	this.Width = this.WidthOrigin;
};
ParaSpace.prototype.BalanceSingleByteDoubleByteWidth = function()
{
	this.Width = this.WidthEn;
};
ParaSpace.prototype.SetGaps = function(nLeftGap, nRightGap)
{
	this.LGap = nLeftGap;
	this.RGap = nRightGap;

	this.Width       += ((nLeftGap + nRightGap) * AscWord.TEXTWIDTH_DIVIDER) | 0;
	this.WidthOrigin += ((nLeftGap + nRightGap) * AscWord.TEXTWIDTH_DIVIDER) | 0;
};
ParaSpace.prototype.ResetGapBackground = AscWord.CRunText.prototype.ResetGapBackground;
ParaSpace.prototype.SetGapBackground = AscWord.CRunText.prototype.SetGapBackground;
ParaSpace.prototype.private_DrawGapsBackground = AscWord.CRunText.prototype.private_DrawGapsBackground;
ParaSpace.prototype.ToSearchElement = function(oProps)
{
	return new AscCommonWord.CSearchTextItemChar(0x20);
};
ParaSpace.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};
ParaSpace.prototype.ToMathElement = function()
{
	let oSpace = new CMathText();
	oSpace.add(0x0032);
	return oSpace;
};

/**
 * Класс представляющий символ
 * @param Char
 * @param FontFamily
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaSym(Char, FontFamily)
{
	AscWord.CRunElementBase.call(this);

    this.FontFamily = FontFamily;
    this.Char       = Char;

    this.FontSlot   = fontslot_ASCII;
    this.FontKoef   = 1;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;
}
ParaSym.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaSym.prototype.constructor = ParaSym;

ParaSym.prototype.Type = para_Sym;
ParaSym.prototype.Draw = function(X,Y,Context, TextPr)
{
	var CurTextPr = TextPr.Copy();

	switch (this.FontSlot)
	{
		case fontslot_ASCII:
			CurTextPr.RFonts.Ascii = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_CS:
			CurTextPr.RFonts.CS = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_EastAsia:
			CurTextPr.RFonts.EastAsia = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_HAnsi:
			CurTextPr.RFonts.HAnsi = {Name : this.FontFamily, Index : -1};
			break;
	}

	Context.SetTextPr(CurTextPr);
	Context.SetFontSlot(this.FontSlot, this.FontKoef);

	Context.FillText(X, Y, String.fromCharCode(this.Char));
	Context.SetTextPr(TextPr);
};
ParaSym.prototype.Measure = function(Context, TextPr)
{
	this.FontKoef = TextPr.Get_FontKoef();

	var Hint = TextPr.RFonts.Hint;
	var bCS  = TextPr.CS;
	var bRTL = TextPr.RTL;
	var lcid = TextPr.Lang.EastAsia;

	this.FontSlot = g_font_detector.Get_FontClass(this.CalcValue.charCodeAt(0), Hint, lcid, bCS, bRTL);

	var CurTextPr = TextPr.Copy();

	switch (this.FontSlot)
	{
		case fontslot_ASCII:
			CurTextPr.RFonts.Ascii = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_CS:
			CurTextPr.RFonts.CS = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_EastAsia:
			CurTextPr.RFonts.EastAsia = {Name : this.FontFamily, Index : -1};
			break;
		case fontslot_HAnsi:
			CurTextPr.RFonts.HAnsi = {Name : this.FontFamily, Index : -1};
			break;
	}

	Context.SetTextPr(CurTextPr);
	Context.SetFontSlot(this.FontSlot, this.FontKoef);

	var Temp = Context.Measure(this.CalcValue);
	Context.SetTextPr(TextPr);

	Temp.Width = Math.max(Temp.Width + TextPr.Spacing, 0);

	this.Width        = Temp.Width;
	this.Height       = Temp.Height;
	this.WidthVisible = Temp.Width;
};
ParaSym.prototype.CanAddNumbering = function()
{
	return true;
};
ParaSym.prototype.Copy = function()
{
	return new ParaSym(this.Char, this.FontFamily);
};
ParaSym.prototype.IsEqual = function(oElement)
{
	return (this.Type === oElement.Type && this.Char === oElement.Char && this.FontFamily === oElement.FontFamily);
};
ParaSym.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : FontFamily
	// Long   : Char

	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.FontFamily);
	Writer.WriteLong(this.Char);
};
ParaSym.prototype.Read_FromBinary = function(Reader)
{
	// String : FontFamily
	// Long   : Char

	this.FontFamily = Reader.GetString2();
	this.Char       = Reader.GetLong();
};


/**
 * Класс представляющий символ конца параграфа
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaEnd()
{
	AscWord.CRunElementBase.call(this);

    this.SectionEnd    = null;
    this.WidthVisible = 0x00000000 | 0;
	this.Flags        = 0x00000000 | 0;
}
ParaEnd.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaEnd.prototype.constructor = ParaEnd;

ParaEnd.prototype.Type = para_End;
ParaEnd.prototype.Draw = function(X, Y, Context, bEndCell, bForceDraw)
{
	if ((undefined !== editor && editor.ShowParaMarks) || true === bForceDraw)
	{
		var FontKoef = (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT ? AscCommon.vaKSize : 1);
		Context.SetFontSlot(fontslot_ASCII, FontKoef);

		if (this.SectionEnd)
			this.private_DrawSectionEnd(X, Y, Context);
		else if (true === bEndCell)
			Context.FillText(X, Y, String.fromCharCode(0x00A4));
		else
			Context.FillText(X, Y, String.fromCharCode(0x00B6));
	}
};
ParaEnd.prototype.Measure = function(Context, oTextPr, bEndCell)
{
	var dFontKoef = 1;
	if (oTextPr.VertAlign !== AscCommon.vertalign_Baseline)
	{
		this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
		dFontKoef = AscCommon.vaKSize;
	}
	else
	{
		this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;
	}

	Context.SetFontSlot(fontslot_ASCII, dFontKoef);

	if (true === bEndCell)
		this.WidthVisible = (Context.Measure(String.fromCharCode(0x00A4)).Width * AscWord.TEXTWIDTH_DIVIDER) | 0;
	else
		this.WidthVisible = (Context.Measure(String.fromCharCode(0x00B6)).Width * AscWord.TEXTWIDTH_DIVIDER) | 0;
};
ParaEnd.prototype.Get_Width = function()
{
	return 0;
};
ParaEnd.prototype.UpdateSectionEnd = function(nSectionType, nWidth, oLogicDocument)
{
	if (!oLogicDocument)
		return;

	var oPr = oLogicDocument.GetSectionEndMarkPr(nSectionType);

	var nStrWidth = oPr.StringWidth;
	var nSymWidth = oPr.ColonWidth;

	this.SectionEnd = {
		String       : null,
		ColonsCount  : 0,
		ColonWidth   : nSymWidth,
		ColonSymbol  : oPr.ColonSymbol,
		Widths       : []
	};

	if (nWidth - 6 * nSymWidth >= nStrWidth)
	{
		this.SectionEnd.ColonsCount = parseInt((nWidth - nStrWidth) / (2 * nSymWidth));
		this.SectionEnd.String      = oPr.String;

		var nAdd = 0;
		var nResultWidth = 2 * nSymWidth * this.SectionEnd.ColonsCount + nStrWidth;
		if (nResultWidth < nWidth)
		{
			nAdd = (nWidth - nResultWidth) / (2 * this.SectionEnd.ColonsCount + this.SectionEnd.Widths.length);
			this.SectionEnd.ColonWidth += nAdd;
		}

		for (var nPos = 0, nLen = oPr.Widths.length; nPos < nLen; ++nPos)
		{
			this.SectionEnd.Widths[nPos] = oPr.Widths[nPos] + nAdd;
		}
	}
	else
	{
		this.SectionEnd.ColonsCount = parseInt(nWidth / nSymWidth);

		var nResultWidth = nSymWidth * this.SectionEnd.ColonsCount;
		if (nResultWidth < nWidth && this.SectionEnd.ColonsCount > 0)
			this.SectionEnd.ColonWidth += (nWidth - nResultWidth) /this.SectionEnd.ColonsCount ;
	}

	this.WidthVisible = (nWidth * AscWord.TEXTWIDTH_DIVIDER) | 0;
};
ParaEnd.prototype.ClearSectionEnd = function()
{
	this.SectionEnd = null;
};
ParaEnd.prototype.private_DrawSectionEnd = function(X, Y, Context)
{
	Context.b_color1(0, 0, 0, 255);
	Context.p_color(0, 0, 0, 255);
	Context.SetFont({
		FontFamily : {Name : "Courier New", Index : -1},
		FontSize   : 8,
		Italic     : false,
		Bold       : false
	});

	for (var nPos = 0, nCount = this.SectionEnd.ColonsCount; nPos < nCount; ++nPos)
	{
		Context.FillTextCode(X, Y, this.SectionEnd.ColonSymbol);
		X += this.SectionEnd.ColonWidth;
	}

	if (this.SectionEnd.String)
	{
		for (var nPos = 0, nCount = this.SectionEnd.String.length; nPos < nCount; ++nPos)
		{
			Context.FillText(X, Y, this.SectionEnd.String[nPos]);
			X += this.SectionEnd.Widths[nPos];
		}

		for (var nPos = 0, nCount = this.SectionEnd.ColonsCount; nPos < nCount; ++nPos)
		{
			Context.FillTextCode(X, Y, this.SectionEnd.ColonSymbol);
			X += this.SectionEnd.ColonWidth;
		}
	}
};
ParaEnd.prototype.CanAddNumbering = function()
{
	return true;
};
ParaEnd.prototype.Copy = function()
{
	return new ParaEnd();
};
ParaEnd.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	Writer.WriteLong(para_End);
};
ParaEnd.prototype.Read_FromBinary = function(Reader)
{
};
ParaEnd.prototype.GetAutoCorrectFlags = function()
{
	return (AscCommonWord.AUTOCORRECT_FLAGS_FIRST_LETTER_SENTENCE
		| AscCommonWord.AUTOCORRECT_FLAGS_HYPERLINK
		| AscCommonWord.AUTOCORRECT_FLAGS_HYPHEN_WITH_DASH);
};
ParaEnd.prototype.ToSearchElement = function(oProps)
{
	return new AscCommonWord.CSearchTextSpecialParaEnd();
};
ParaEnd.prototype.IsParaEnd = function()
{
	return true;
};
ParaEnd.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};


/**
 * Класс представляющий разрыв строки/колонки/страницы
 * @param nBreakType
 * @param nClear {break_Clear_None | break_Clear_All | break_Clear_Left | break_Clear_Right}
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaNewLine(nBreakType, nClear)
{
	AscWord.CRunElementBase.call(this);

    this.BreakType = nBreakType;
	this.Clear     = nClear ? nClear : break_Clear_None;

    this.Flags = {}; // специальные флаги для разных break
    this.Flags.Use = true;

    if (break_Page === this.BreakType || break_Column === this.BreakType)
        this.Flags.NewLine = true;

    this.Height       = 0;
    this.Width        = 0;
    this.WidthVisible = 0;
}
ParaNewLine.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaNewLine.prototype.constructor = ParaNewLine;

ParaNewLine.prototype.Type = para_NewLine;
ParaNewLine.prototype.Draw = function(X, Y, Context)
{
	if (false === this.Flags.Use)
		return;

	if (undefined !== editor && editor.ShowParaMarks)
	{
		// Цвет и шрифт можно не запоминать и не выставлять старый, т.к. на данном элемента всегда заканчивается
		// отрезок обтекания или целая строка.

		switch (this.BreakType)
		{
			case break_Line:
			{
				Context.b_color1(0, 0, 0, 255);
				Context.SetFont({
					FontFamily : {Name : "ASCW3", Index : -1},
					FontSize   : 10,
					Italic     : false,
					Bold       : false
				});
				Context.FillText(X, Y, String.fromCharCode(0x0038/*0x21B5*/));
				break;
			}
			case break_Page:
			case break_Column:
			{
				var strPageBreak = this.Flags.BreakPageInfo.Str;
				var Widths       = this.Flags.BreakPageInfo.Widths;

				Context.b_color1(0, 0, 0, 255);
				Context.SetFont({
					FontFamily : {Name : "Courier New", Index : -1},
					FontSize   : 8,
					Italic     : false,
					Bold       : false
				});

				var Len = strPageBreak.length;
				for (var Index = 0; Index < Len; Index++)
				{
					Context.FillText(X, Y, strPageBreak[Index]);
					X += Widths[Index];
				}

				break;
			}
		}

	}
};
ParaNewLine.prototype.Measure = function(Context)
{
	if (false === this.Flags.Use)
	{
		this.Width        = 0;
		this.WidthVisible = 0;
		this.Height       = 0;
		return;
	}

	switch (this.BreakType)
	{
		case break_Line:
		{
			this.Width  = 0;
			this.Height = 0;

			Context.SetFont({FontFamily : {Name : "ASCW3", Index : -1}, FontSize : 10, Italic : false, Bold : false});
			var Temp = Context.Measure(String.fromCharCode(0x0038));

			// Почему-то в шрифте Wingding 3 символ 0x0038 имеет неправильную ширину
			this.WidthVisible = Temp.Width * 1.7;

			break;
		}
		case break_Page:
		case break_Column:
		{
			this.Width  = 0;
			this.Height = 0;

			break;
		}
	}
};
ParaNewLine.prototype.Get_Width = function()
{
	return this.Width;
};
ParaNewLine.prototype.GetWidthVisible = function()
{
	return this.WidthVisible;
};
ParaNewLine.prototype.SetWidthVisible = function(WidthVisible)
{
	this.WidthVisible = WidthVisible;
};
ParaNewLine.prototype.Update_String = function(_W)
{
	if (false === this.Flags.Use)
	{
		this.Width        = 0;
		this.WidthVisible = 0;
		this.Height       = 0;
		return;
	}

	if (break_Page === this.BreakType || break_Column === this.BreakType)
	{
		var W = false === this.Flags.NewLine ? 50 : Math.max(_W, 50);

		g_oTextMeasurer.SetFont({
			FontFamily : {Name : "Courier New", Index : -1},
			FontSize   : 8,
			Italic     : false,
			Bold       : false
		});

		var Widths = [];

		var nStrWidth    = 0;
		var strBreakPage = break_Page === this.BreakType ? " Page Break " : " Column Break ";
		var Len          = strBreakPage.length;
		for (var Index = 0; Index < Len; Index++)
		{
			var Val       = g_oTextMeasurer.Measure(strBreakPage[Index]).Width;
			nStrWidth += Val;
			Widths[Index] = Val;
		}

		var strSymbol = String.fromCharCode("0x00B7");
		var nSymWidth = g_oTextMeasurer.Measure(strSymbol).Width * 2 / 3;

		var strResult = "";
		if (W - 6 * nSymWidth >= nStrWidth)
		{
			var Count     = parseInt((W - nStrWidth) / ( 2 * nSymWidth ));
			var strResult = strBreakPage;
			for (var Index = 0; Index < Count; Index++)
			{
				strResult = strSymbol + strResult + strSymbol;
				Widths.splice(0, 0, nSymWidth);
				Widths.splice(Widths.length, 0, nSymWidth);
			}
		}
		else
		{
			var Count = parseInt(W / nSymWidth);
			for (var Index = 0; Index < Count; Index++)
			{
				strResult += strSymbol;
				Widths[Index] = nSymWidth;
			}
		}

		var ResultW = 0;
		var Count   = Widths.length;
		for (var Index = 0; Index < Count; Index++)
		{
			ResultW += Widths[Index];
		}

		var AddW = 0;
		if (ResultW < W && Count > 1)
		{
			AddW = (W - ResultW) / (Count - 1);
		}

		for (var Index = 0; Index < Count - 1; Index++)
		{
			Widths[Index] += AddW;
		}

		this.Flags.BreakPageInfo        = {};
		this.Flags.BreakPageInfo.Str    = strResult;
		this.Flags.BreakPageInfo.Widths = Widths;

		this.Width        = W;
		this.WidthVisible = W;
	}
};
ParaNewLine.prototype.CanAddNumbering = function()
{
	if (break_Line === this.BreakType)
		return true;

	return false;
};
ParaNewLine.prototype.Copy = function()
{
	return new ParaNewLine(this.BreakType);
};
ParaNewLine.prototype.IsEqual = function(oElement)
{
	return (oElement.Type === this.Type && this.BreakType === oElement.BreakType);
};
/**
 * Функция проверяет особый случай, когда у нас PageBreak, после которого в параграфе ничего не идет
 * @returns {boolean}
 */
ParaNewLine.prototype.Is_NewLine = function()
{
	if (break_Line === this.BreakType || ((break_Page === this.BreakType || break_Column === this.BreakType) && true === this.Flags.NewLine))
		return true;

	return false;
};
ParaNewLine.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// Long   : BreakType
	// Optional :
	// Long   : Flags (breakPage)
	Writer.WriteLong(para_NewLine);
	Writer.WriteLong(this.BreakType);

	if (break_Page === this.BreakType || break_Column === this.BreakType)
		Writer.WriteBool(this.Flags.NewLine);
	else
		Writer.WriteLong(this.Clear);
};
ParaNewLine.prototype.Read_FromBinary = function(Reader)
{
	this.BreakType = Reader.GetLong();

	if (break_Page === this.BreakType || break_Column === this.BreakType)
		this.Flags = {NewLine : Reader.GetBool()};
	else
		this.Clear = Reader.GetLong();
};
/**
 * Разрыв страницы или колонки?
 * @returns {boolean}
 */
ParaNewLine.prototype.IsPageOrColumnBreak = function()
{
	return (break_Page === this.BreakType || break_Column === this.BreakType);
};
/**
 * Разрыв страницы?
 * @returns {boolean}
 */
ParaNewLine.prototype.IsPageBreak = function()
{
	return (break_Page === this.BreakType);
};
/**
 * Разрыв колонки?
 * @returns {boolean}
 */
ParaNewLine.prototype.IsColumnBreak = function()
{
	return (break_Column === this.BreakType);
};
/**
 * Перенос строки?
 * @returns {boolean}
 */
ParaNewLine.prototype.IsLineBreak = function()
{
	return (break_Line === this.BreakType);
};
ParaNewLine.prototype.GetAutoCorrectFlags = function()
{
	return (AscCommonWord.AUTOCORRECT_FLAGS_FIRST_LETTER_SENTENCE
		| AscCommonWord.AUTOCORRECT_FLAGS_HYPERLINK);
};
ParaNewLine.prototype.ToSearchElement = function(oProps)
{
	if (break_Page === this.BreakType)
		return new AscCommonWord.CSearchTextSpecialPageBreak();
	else if (break_Column === this.BreakType)
		return new AscCommonWord.CSearchTextSpecialColumnBreak();
	else
		return new AscCommonWord.CSearchTextSpecialLineBreak();
};
ParaNewLine.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};
ParaNewLine.prototype.IsBreak = function()
{
	return true;
};


/**
 * Класс представляющий символ(текст) нумерации параграфа
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaNumbering()
{
	AscWord.CRunElementBase.call(this);

	this.Item = null; // Элемент в ране, к которому привязана нумерация
	this.Run  = null; // Ран, к которому привязана нумерация

	this.Line  = 0;
	this.Range = 0;
	this.Page  = 0;

	this.Internal = {
		FinalNumInfo    : undefined,
		FinalCalcValue  : -1,
		FinalNumId      : null,
		FinalNumLvl     : -1,

		SourceNumInfo   : undefined,
		SourceCalcValue : -1,
		SourceNumId     : null,
		SourceNumLvl    : -1,
		SourceWidth     : 0,

		Reset : function()
		{
			this.FinalNumInfo    = undefined;
			this.FinalCalcValue  = -1;
			this.FinalNumId      = null;
			this.FinalNumLvl     = -1;

			this.SourceNumInfo   = undefined;
			this.SourceCalcValue = -1;
			this.SourceNumId     = null;
			this.SourceNumLvl    = -1;
			this.SourceWidth     = 0;
		}
	};
}
ParaNumbering.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaNumbering.prototype.constructor = ParaNumbering;

ParaNumbering.prototype.Type = para_Numbering;
ParaNumbering.prototype.Draw = function(X, Y, oContext, oNumbering, oTextPr, oTheme, oPrevNumTextPr)
{
	var _X = X;
	if (this.Internal.SourceNumInfo)
	{
		oNumbering.Draw(this.Internal.SourceNumId,this.Internal.SourceNumLvl, _X, Y, oContext, this.Internal.SourceNumInfo, oPrevNumTextPr ? oPrevNumTextPr : oTextPr, oTheme);
		_X += this.Internal.SourceWidth;
	}

	if (this.Internal.FinalNumInfo)
	{
		oNumbering.Draw(this.Internal.FinalNumId,this.Internal.FinalNumLvl, _X, Y, oContext, this.Internal.FinalNumInfo, oTextPr, oTheme);
	}
};
ParaNumbering.prototype.Measure = function (oContext, oNumbering, oTextPr, oTheme, oFinalNumInfo, oFinalNumPr, oSourceNumInfo, oSourceNumPr)
{
	this.Width        = 0;
	this.Height       = 0;
	this.WidthVisible = 0;
	this.WidthNum     = 0;
	this.WidthSuff    = 0;

	this.Internal.Reset();

	if (!oNumbering)
	{
		return {
			Width        : this.Width,
			Height       : this.Height,
			WidthVisible : this.WidthVisible
		}
	}

	var nWidth = 0, nAscent = 0;
	if (oFinalNumInfo && oFinalNumPr && undefined !== oFinalNumInfo[oFinalNumPr.Lvl])
	{
		var oTemp = oNumbering.Measure(oFinalNumPr.NumId, oFinalNumPr.Lvl, oContext, oFinalNumInfo, oTextPr, oTheme);

		this.Internal.FinalNumInfo   = oFinalNumInfo;
		this.Internal.FinalCalcValue = oFinalNumInfo[oFinalNumPr.Lvl];
		this.Internal.FinalNumId     = oFinalNumPr.NumId;
		this.Internal.FinalNumLvl    = oFinalNumPr.Lvl;

		nWidth    = oTemp.Width;
		nAscent   = oTemp.Ascent;
	}

	if (oSourceNumInfo && oSourceNumPr && undefined !== oSourceNumInfo[oSourceNumPr.Lvl])
	{
		var oTemp = oNumbering.Measure(oSourceNumPr.NumId, oSourceNumPr.Lvl, oContext, oSourceNumInfo, oTextPr, oTheme);

		this.Internal.SourceNumInfo   = oSourceNumInfo;
		this.Internal.SourceCalcValue = oSourceNumInfo[oSourceNumPr.Lvl];
		this.Internal.SourceNumId     = oSourceNumPr.NumId;
		this.Internal.SourceNumLvl    = oSourceNumPr.Lvl;
		this.Internal.SourceWidth     = oTemp.Width;
		nWidth += this.Internal.SourceWidth;

		if (nAscent < oTemp.Ascent)
			nAscent = oTemp.Ascent;
	}

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
	this.WidthNum     = nWidth;
	this.WidthSuff    = 0;
	this.Height       = nAscent; // Это не вся высота, а только высота над BaseLine
};
ParaNumbering.prototype.Check_Range = function(Range, Line)
{
	if (null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line)
		return true;

	return false;
};
ParaNumbering.prototype.CanAddNumbering = function()
{
	return false;
};
ParaNumbering.prototype.Copy = function()
{
	return new ParaNumbering();
};
ParaNumbering.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	Writer.WriteLong(this.Type);
};
ParaNumbering.prototype.Read_FromBinary = function(Reader)
{
};
ParaNumbering.prototype.GetCalculatedValue = function()
{
	return this.Internal.FinalCalcValue;
};
/**
 * Нужно ли отрисовывать исходную нумерацию
 * @returns {boolean}
 */
ParaNumbering.prototype.HaveSourceNumbering = function()
{
	return !!this.Internal.SourceNumInfo;
};
/**
 * Нужно ли отрисовывать финальную нумерацию
 * @returns {boolean}
 */
ParaNumbering.prototype.HaveFinalNumbering = function()
{
	return !!this.Internal.FinalNumInfo;
};
/**
 * Получаем ширину исходной нумерации
 * @returns {number}
 */
ParaNumbering.prototype.GetSourceWidth = function()
{
	return this.Internal.SourceWidth;
};
ParaNumbering.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};

// TODO: Реализовать табы по точке и с чертой (tab_Bar tab_Decimal)
var tab_Bar     = Asc.c_oAscTabType.Bar;
var tab_Center  = Asc.c_oAscTabType.Center;
var tab_Clear   = Asc.c_oAscTabType.Clear;
var tab_Decimal = Asc.c_oAscTabType.Decimal;
var tab_Num     = Asc.c_oAscTabType.Num;
var tab_Right   = Asc.c_oAscTabType.Right;
var tab_Left    = Asc.c_oAscTabType.Left;

var tab_Symbol = 0x0022;//0x2192;

/**
 * Класс представляющий элемент табуляции.
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaTab()
{
	AscWord.CRunElementBase.call(this);

	this.Width        = 0;
	this.WidthVisible = 0;
	this.RealWidth    = 0;

	this.DotWidth        = 0;
	this.UnderscoreWidth = 0;
	this.HyphenWidth     = 0;
	this.Leader          = Asc.c_oAscTabLeader.None;
}
ParaTab.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaTab.prototype.constructor = ParaTab;

ParaTab.prototype.Type = para_Tab;
ParaTab.prototype.Draw = function(X, Y, Context)
{
	if (this.WidthVisible > 0.01)
	{
		var sChar = null, nCharWidth = 0;
		switch (this.Leader)
		{
			case Asc.c_oAscTabLeader.Dot:
				sChar      = '.';
				nCharWidth = this.DotWidth;
				break;
			case Asc.c_oAscTabLeader.Heavy:
			case Asc.c_oAscTabLeader.Underscore:
				sChar      = '_';
				nCharWidth = this.UnderscoreWidth;
				break;
			case Asc.c_oAscTabLeader.Hyphen:
				sChar      = '-';
				nCharWidth = this.HyphenWidth;
				break;
			case Asc.c_oAscTabLeader.MiddleDot:
				sChar      = '·';
				nCharWidth = this.MiddleDotWidth;
				break;
		}

		if (null !== sChar && nCharWidth > 0.001)
		{
			Context.SetFontSlot(fontslot_ASCII, 1);
			var nCharsCount = Math.floor(this.WidthVisible / nCharWidth);

			var _X = X + (this.WidthVisible - nCharsCount * nCharWidth) / 2;
			for (var nIndex = 0; nIndex < nCharsCount; ++nIndex, _X += nCharWidth)
				Context.FillText(_X, Y, sChar);
		}
	}

	if (editor && editor.ShowParaMarks)
	{
		Context.p_color(0, 0, 0, 255);
		Context.b_color1(0, 0, 0, 255);

		var X0 = this.Width / 2 - this.RealWidth / 2;

		Context.SetFont({FontFamily : {Name : "ASCW3", Index : -1}, FontSize : 10, Italic : false, Bold : false});

		if (X0 > 0)
			Context.FillText2(X + X0, Y, String.fromCharCode(tab_Symbol), 0, this.Width);
		else
			Context.FillText2(X, Y, String.fromCharCode(tab_Symbol), this.RealWidth - this.Width, this.Width);
	}
};
ParaTab.prototype.Measure = function(Context)
{
	Context.SetFontSlot(fontslot_ASCII, 1);
	
	this.DotWidth        = Context.Measure(".").Width;
	this.UnderscoreWidth = Context.Measure("_").Width;
	this.HyphenWidth     = Context.Measure("-").Width * 1.5;
	this.MiddleDotWidth  = Context.Measure("·").Width;

	Context.SetFont({FontFamily : {Name : "ASCW3", Index : -1}, FontSize : 10, Italic : false, Bold : false});
	this.RealWidth = Context.Measure(String.fromCharCode(tab_Symbol)).Width;
};
ParaTab.prototype.SetLeader = function(nLeaderType)
{
	this.Leader = nLeaderType;
};
ParaTab.prototype.Get_Width = function()
{
	return this.Width;
};
ParaTab.prototype.GetWidthVisible = function()
{
	return this.WidthVisible;
};
ParaTab.prototype.SetWidthVisible = function(WidthVisible)
{
	this.WidthVisible = WidthVisible;
};
ParaTab.prototype.Copy = function()
{
	return new ParaTab();
};
ParaTab.prototype.IsNeedSaveRecalculateObject = function()
{
	return true;
};
ParaTab.prototype.SaveRecalculateObject = function()
{
	return {
		Width        : this.Width,
		WidthVisible : this.WidthVisible
	};
};
ParaTab.prototype.LoadRecalculateObject = function(RecalcObj)
{
	this.Width        = RecalcObj.Width;
	this.WidthVisible = RecalcObj.WidthVisible;
};
ParaTab.prototype.PrepareRecalculateObject = function()
{
};
ParaTab.prototype.GetAutoCorrectFlags = function()
{
	return AscCommonWord.AUTOCORRECT_FLAGS_ALL;
};
ParaTab.prototype.ToSearchElement = function(oProps)
{
	return new AscCommonWord.CSearchTextSpecialTab();
};
ParaTab.prototype.IsTab = function()
{
	return true;
};
ParaTab.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};

/**
 * Класс представляющий элемент номер страницы
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaPageNum()
{
	AscWord.CRunElementBase.call(this);

    this.FontKoef = 1;

    this.NumWidths = [];

    this.Widths = [];
    this.String = [];

    this.Width        = 0;
    this.WidthVisible = 0;

    this.Parent = null;
}
ParaPageNum.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaPageNum.prototype.constructor = ParaPageNum;

ParaPageNum.prototype.Type = para_PageNum;
ParaPageNum.prototype.Draw = function(X, Y, Context)
{
	// Value - реальное значение, которое должно быть отрисовано.
	// Align - прилегание параграфа, в котором лежит данный номер страницы.

	var Len = this.String.length;

	var _X = X;
	var _Y = Y;

	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);
	for (var Index = 0; Index < Len; Index++)
	{
		var Char = this.String.charAt(Index);
		Context.FillText(_X, _Y, Char);
		_X += this.Widths[Index];
	}
};
ParaPageNum.prototype.Measure = function (Context, TextPr)
{
	this.FontKoef = TextPr.Get_FontKoef();
	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);

	for (var Index = 0; Index < 10; Index++)
	{
		this.NumWidths[Index] = Context.Measure("" + Index).Width;
	}

	this.Width        = 0;
	this.Height       = 0;
	this.WidthVisible = 0;
};
ParaPageNum.prototype.Get_Width = function()
{
	return this.Width;
};
ParaPageNum.prototype.GetWidthVisible = function()
{
	return this.WidthVisible;
};
ParaPageNum.prototype.SetWidthVisible = function(WidthVisible)
{
	this.WidthVisible = WidthVisible;
};
ParaPageNum.prototype.Set_Page = function(PageNum)
{
	this.String = "" + PageNum;
	var Len     = this.String.length;

	var RealWidth = 0;
	for (var Index = 0; Index < Len; Index++)
	{
		var Char = parseInt(this.String.charAt(Index));

		this.Widths[Index] = this.NumWidths[Char];
		RealWidth += this.NumWidths[Char];
	}

	this.Width        = RealWidth;
	this.WidthVisible = RealWidth;
};
ParaPageNum.prototype.IsNeedSaveRecalculateObject = function()
{
	return true;
};
ParaPageNum.prototype.SaveRecalculateObject = function(Copy)
{
	return new CPageNumRecalculateObject(this.Type, this.Widths, this.String, this.Width, Copy);
};
ParaPageNum.prototype.LoadRecalculateObject = function(RecalcObj)
{
	this.Widths = RecalcObj.Widths;
	this.String = RecalcObj.String;

	this.Width        = RecalcObj.Width;
	this.WidthVisible = this.Width;
};
ParaPageNum.prototype.PrepareRecalculateObject = function()
{
	this.Widths = [];
	this.String = "";
};
ParaPageNum.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
	var sValue = "1234567890";
	for (var Index = 0; Index < sValue.length; Index++)
	{
		var Char = sValue.charAt(Index);
		FontCharMap.AddChar(Char);
	}
};
ParaPageNum.prototype.CanAddNumbering = function()
{
	return true;
};
ParaPageNum.prototype.Copy = function()
{
	return new ParaPageNum();
};
ParaPageNum.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	Writer.WriteLong(para_PageNum);
}
ParaPageNum.prototype.Read_FromBinary = function(Reader)
{
};
ParaPageNum.prototype.GetPageNumValue = function()
{
	var nPageNum = parseInt(this.String);
	if (isNaN(nPageNum))
		return 1;

	return nPageNum;
};
ParaPageNum.prototype.GetType = function()
{
	return this.Type;
};
/**
 * Выставляем родительский класс
 * @param {ParaRun} oParent
 */
ParaPageNum.prototype.SetParent = function(oParent)
{
	this.Parent = oParent;
};
/**
 * Получаем родительский класс
 * @returns {?ParaRun}
 */
ParaPageNum.prototype.GetParent = function()
{
	return this.Parent;
};
ParaPageNum.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};

function CPageNumRecalculateObject(Type, Widths, String, Width, Copy)
{
    this.Type   = Type;
    this.Widths = Widths;
    this.String = String;
    this.Width  = Width;

    if ( true === Copy )
    {
        this.Widths = [];
        var Len = Widths.length;
        for ( var Index = 0; Index < Len; Index++ )
            this.Widths[Index] = Widths[Index];
    }
}


/**
 * Класс представляющий символ нумерации у параграфа в презентациях
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaPresentationNumbering()
{
	AscWord.CRunElementBase.call(this);

    // Эти данные заполняются во время пересчета, перед вызовом Measure
    this.Bullet    = null;
    this.BulletNum = null;
}
ParaPresentationNumbering.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaPresentationNumbering.prototype.constructor = ParaPresentationNumbering;

ParaPresentationNumbering.prototype.Type = para_PresentationNumbering;
ParaPresentationNumbering.prototype.Draw = function(X, Y, Context, PDSE)
{
	this.Bullet.Draw(X, Y, Context, PDSE);
};
ParaPresentationNumbering.prototype.Measure = function (Context, FirstTextPr, Theme)
{
	this.Width        = 0;
	this.Height       = 0;
	this.WidthVisible = 0;

	var Temp = this.Bullet.Measure(Context, FirstTextPr, this.BulletNum, Theme);

	this.Width        = Temp.Width;
	this.WidthVisible = Temp.Width;
};
ParaPresentationNumbering.prototype.CanAddNumbering = function()
{
	return false;
};
ParaPresentationNumbering.prototype.Copy = function()
{
	return new ParaPresentationNumbering();
};
ParaPresentationNumbering.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	Writer.WriteLong(this.Type);
};
ParaPresentationNumbering.prototype.Read_FromBinary = function(Reader)
{
};
ParaPresentationNumbering.prototype.Check_Range = function(Range, Line)
{
	if (null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line)
		return true;

	return false;
};


/**
 * Класс представляющий ссылку на сноску
 * @param {CFootEndnote} Footnote - Ссылка на сноску
 * @param {string} CustomMark
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaFootnoteReference(Footnote, CustomMark)
{
	this.Footnote   = Footnote instanceof AscCommonWord.CFootEndnote ? Footnote : null;
	this.CustomMark = CustomMark ? CustomMark : undefined;

	this.Width        = 0;
	this.WidthVisible = 0;
	this.Number       = 1;
	this.NumFormat    = Asc.c_oAscNumberingFormat.Decimal;

	this.Run          = null;
	this.Widths       = [];

	if (this.Footnote)
		this.Footnote.SetRef(this);
}
ParaFootnoteReference.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaFootnoteReference.prototype.constructor = ParaFootnoteReference;

ParaFootnoteReference.prototype.Type = para_FootnoteReference;
ParaFootnoteReference.prototype.Get_Type = function()
{
	return para_FootnoteReference;
};
ParaFootnoteReference.prototype.Draw = function(X, Y, Context, PDSE)
{
	if (true === this.IsCustomMarkFollows())
		return;

	var TextPr = this.Run.Get_CompiledPr(false);

	var FontKoef = 1;
	if (TextPr.VertAlign !== AscCommon.vertalign_Baseline)
		FontKoef = AscCommon.vaKSize;

	Context.SetFontSlot(fontslot_ASCII, FontKoef);

	var _X = X;
	var T  = this.private_GetString();
	if (this.Widths.length !== T.length)
		return;

	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char = T.charAt(nPos);
		Context.FillText(_X, Y, Char);
		_X += this.Widths[nPos];
	}

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect && this.Run)
	{
		var TextAscent = this.Run.TextAscent;
		Context.p_color(0, 0, 0, 255);
		Context.DrawFootnoteRect(X, PDSE.BaseLine - TextAscent, this.Get_Width(), TextAscent);
	}
};
ParaFootnoteReference.prototype.Measure = function(Context, TextPr, MathInfo, Run)
{
	this.Run = Run;
	this.private_Measure();
};
ParaFootnoteReference.prototype.Copy = function(oPr)
{
	if (this.Footnote)
	{
		var oFootnote;
		if (oPr && oPr.Comparison)
		{
			oFootnote = oPr.Comparison.createFootNote();
		}
		else
		{
			oFootnote = this.Footnote.Parent.CreateFootnote();
		}
		oFootnote.Copy2(this.Footnote, oPr);
	}

	var oRef = new ParaFootnoteReference(oFootnote);

	oRef.Number    = this.Number;
	oRef.NumFormat = this.NumFormat;

	return oRef;
};
ParaFootnoteReference.prototype.IsEqual = function(oElement)
{
	return (oElement.Type === this.Type && this.Footnote === oElement.Footnote && oElement.CustomMark === this.CustomMark);
};
ParaFootnoteReference.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : FootnoteId
	// Bool : is undefined mark ?
	// false -> String2 : CustomMark
	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Footnote ? this.Footnote.GetId() : "");

	if (undefined === this.CustomMark)
	{
		Writer.WriteBool(true);
	}
	else
	{
		Writer.WriteBool(false);
		Writer.WriteString2(this.CustomMark);
	}
};
ParaFootnoteReference.prototype.Read_FromBinary = function(Reader)
{
	// String : FootnoteId
	// Bool : is undefined mark ?
	// false -> String2 : CustomMark
	this.Footnote = g_oTableId.Get_ById(Reader.GetString2());

	if (false === Reader.GetBool())
		this.CustomMark = Reader.GetString2();
};
ParaFootnoteReference.prototype.GetFootnote = function()
{
	return this.Footnote;
};
ParaFootnoteReference.prototype.UpdateNumber = function(PRS, isKeepNumber)
{
	if (this.Footnote && true !== PRS.IsFastRecalculate() && PRS.TopDocument instanceof CDocument)
	{
		var nPageAbs    = PRS.GetPageAbs();
		var nColumnAbs  = PRS.GetColumnAbs();
		var nAdditional = PRS.GetFootnoteReferencesCount(this);
		var oSectPr     = PRS.GetSectPr();
		var nNumFormat  = oSectPr.GetFootnoteNumFormat();

		var oLogicDocument       = this.Footnote.Get_LogicDocument();
		var oFootnotesController = oLogicDocument.GetFootnotesController();

		if (!isKeepNumber)
		{
			this.NumFormat = nNumFormat;
			this.Number    = oFootnotesController.GetFootnoteNumberOnPage(nPageAbs, nColumnAbs, oSectPr) + nAdditional;

			// Если данная сноска не участвует в нумерации, просто уменьшаем ей номер на 1, для упрощения работы
			if (this.IsCustomMarkFollows())
				this.Number--;
		}

		this.private_Measure();
		this.Footnote.SetNumber(this.Number, oSectPr, this.IsCustomMarkFollows());
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = Asc.c_oAscNumberingFormat.Decimal;
		this.private_Measure();
	}
};
ParaFootnoteReference.prototype.private_Measure = function()
{
	if (!this.Run)
		return;

	if (this.IsCustomMarkFollows())
	{
		this.Width        = 0;
		this.WidthVisible = 0;
		return;
	}

	var oMeasurer = g_oTextMeasurer;

	var TextPr = this.Run.Get_CompiledPr(false);
	var Theme  = this.Run.GetParagraph().Get_Theme();

    var FontKoef = 1;
    if (TextPr.VertAlign !== AscCommon.vertalign_Baseline)
        FontKoef = AscCommon.vaKSize;

	oMeasurer.SetTextPr(TextPr, Theme);
	oMeasurer.SetFontSlot(fontslot_ASCII, FontKoef);

	var X = 0;
	var T = this.private_GetString();
	this.Widths = [];
	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char  = T.charAt(nPos);
		var CharW = oMeasurer.Measure(Char).Width
		this.Widths.push(CharW);
		X += CharW;
	}


	var ResultWidth   = (Math.max((X + TextPr.Spacing), 0) * AscWord.TEXTWIDTH_DIVIDER) | 0;
	this.Width        = ResultWidth;
	this.WidthVisible = ResultWidth;
};
ParaFootnoteReference.prototype.private_GetString = function()
{
	if (Asc.c_oAscNumberingFormat.Decimal === this.NumFormat)
		return Numbering_Number_To_String(this.Number);
	if (Asc.c_oAscNumberingFormat.LowerRoman === this.NumFormat)
		return Numbering_Number_To_Roman(this.Number, true);
	else if (Asc.c_oAscNumberingFormat.UpperRoman === this.NumFormat)
		return Numbering_Number_To_Roman(this.Number, false);
	else if (Asc.c_oAscNumberingFormat.LowerLetter === this.NumFormat)
		return Numbering_Number_To_Alpha(this.Number, true);
	else if (Asc.c_oAscNumberingFormat.UpperLetter === this.NumFormat)
		return Numbering_Number_To_Alpha(this.Number, false);
	else// if (Asc.c_oAscNumberingFormat.Decimal === this.NumFormat)
		return Numbering_Number_To_String(this.Number);
};
ParaFootnoteReference.prototype.IsCustomMarkFollows = function()
{
	return (undefined !== this.CustomMark ? true : false);
};
ParaFootnoteReference.prototype.GetCustomText = function()
{
	return this.CustomMark;
};
ParaFootnoteReference.prototype.CreateDocumentFontMap = function(FontMap)
{
	if (this.Footnote)
		this.Footnote.Document_CreateFontMap(FontMap);
};
ParaFootnoteReference.prototype.GetAllContentControls = function(arrContentControls)
{
	if (this.Footnote)
		this.Footnote.GetAllContentControls(arrContentControls);
};
ParaFootnoteReference.prototype.GetAllFontNames = function(arrAllFonts)
{
	if (this.Footnote)
		this.Footnote.Document_Get_AllFontNames(arrAllFonts);
};
ParaFootnoteReference.prototype.SetParent = function(oRun)
{
	this.Run = oRun;
};
ParaFootnoteReference.prototype.GetRun = function()
{
	return this.Run;
};
ParaFootnoteReference.prototype.ToSearchElement = function(oProps)
{
	return new AscCommonWord.CSearchTextSpecialFootnoteMark();
};
ParaFootnoteReference.prototype.PreDelete = function()
{
	var oFootnote = this.Footnote;
	if (oFootnote)
	{
		oFootnote.PreDelete();
		oFootnote.ClearContent(true);
	}
};
ParaFootnoteReference.prototype.IsReference = function()
{
	return true;
};
ParaFootnoteReference.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};

/**
 * Класс представляющий номер сноски внутри сноски.
 * @param {CFootEndnote} Footnote - Ссылка на сноску.
 * @constructor
 * @extends {ParaFootnoteReference}
 */
function ParaFootnoteRef(Footnote)
{
	ParaFootnoteReference.call(this, Footnote);
}
ParaFootnoteRef.prototype = Object.create(ParaFootnoteReference.prototype);
ParaFootnoteRef.prototype.constructor = ParaFootnoteRef;

ParaFootnoteRef.prototype.Type = para_FootnoteRef;
ParaFootnoteRef.prototype.Get_Type = function()
{
	return para_FootnoteRef;
};
ParaFootnoteRef.prototype.Copy = function(oPr)
{
	var oFootnote = this.GetFootnote();
	var oParagraph, oParent, oTopDocument;
	if(oPr && oPr.Paragraph)
	{
		oParagraph = oPr.Paragraph;
		oParent = oParagraph.GetParent();
		if(oParent)
		{
			oTopDocument = oParent.GetTopDocumentContent();
			if(oTopDocument && oTopDocument instanceof CFootEndnote)
			{
				oFootnote = oTopDocument;
			}
		}
	}
	return new ParaFootnoteRef(oFootnote);
};
ParaFootnoteRef.prototype.UpdateNumber = function(oFootnote)
{
	this.Footnote = oFootnote;
	if (this.Footnote && this.Footnote instanceof CFootEndnote)
	{
		this.Number    = this.Footnote.GetNumber();
		this.NumFormat = this.Footnote.GetReferenceSectPr().GetFootnoteNumFormat();
		this.private_Measure();
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = Asc.c_oAscNumberingFormat.Decimal;
		this.private_Measure();
	}
};
ParaFootnoteRef.prototype.PreDelete = function()
{
};

/**
 * Класс представляющий собой разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaSeparator()
{
	AscWord.CRunElementBase.call(this);
	this.LineW = 0;
}
ParaSeparator.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaSeparator.prototype.constructor = ParaSeparator;

ParaSeparator.prototype.Type     = para_Separator;
ParaSeparator.prototype.Get_Type = function()
{
	return para_Separator;
};
ParaSeparator.prototype.Draw     = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

    Context.p_color(0, 0, 0, 255);
	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect)
    {
        Context.DrawFootnoteRect(X, PDSE.LineTop, this.Get_Width(), PDSE.BaseLine - PDSE.LineTop);
    }
};
ParaSeparator.prototype.Measure  = function(Context, TextPr)
{
	this.Width        = (50 * AscWord.TEXTWIDTH_DIVIDER) | 0;
	this.WidthVisible = (50 * AscWord.TEXTWIDTH_DIVIDER) | 0;

	this.LineW = (TextPr.FontSize / 18) * g_dKoef_pt_to_mm;
};
ParaSeparator.prototype.Copy     = function()
{
	return new ParaSeparator();
};
ParaSeparator.prototype.UpdateWidth = function(PRS)
{
	var oPara    = PRS.Paragraph;
	var nCurPage = PRS.Page;

	oPara.Parent.Update_ContentIndexing();
	var oLimits = oPara.Parent.Get_PageContentStartPos2(oPara.PageNum, oPara.ColumnNum, nCurPage, oPara.Index);

	var nWidth = (Math.min(50, (oLimits.XLimit - oLimits.X)) * AscWord.TEXTWIDTH_DIVIDER) | 0;

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
};
ParaSeparator.prototype.IsNeedSaveRecalculateObject = function()
{
	return true;
};
ParaSeparator.prototype.SaveRecalculateObject = function(isCopy)
{
	return {
		Width : this.Width
	};
};
ParaSeparator.prototype.LoadRecalculateObject = function(oRecalcObj)
{
	this.Width        = oRecalcObj.Width;
	this.WidthVisible = oRecalcObj.Width;
};
ParaSeparator.prototype.PrepareRecalculateObject = function()
{
};

/**
 * Класс представляющий собой длинный разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaContinuationSeparator()
{
	AscWord.CRunElementBase.call(this);
	this.LineW = 0;
}
ParaContinuationSeparator.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaContinuationSeparator.prototype.constructor = ParaContinuationSeparator;

ParaContinuationSeparator.prototype.Type         = para_ContinuationSeparator;
ParaContinuationSeparator.prototype.Get_Type     = function()
{
	return para_ContinuationSeparator;
};
ParaContinuationSeparator.prototype.Draw         = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

    Context.p_color(0, 0, 0, 255);
	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect)
    {
        Context.DrawFootnoteRect(X, PDSE.LineTop, this.Get_Width(), PDSE.BaseLine - PDSE.LineTop);
    }
};
ParaContinuationSeparator.prototype.Measure      = function(Context, TextPr)
{
	this.Width        = (50 * AscWord.TEXTWIDTH_DIVIDER) | 0;
	this.WidthVisible = (50 * AscWord.TEXTWIDTH_DIVIDER) | 0;

	this.LineW = (TextPr.FontSize / 18) * g_dKoef_pt_to_mm;
};
ParaContinuationSeparator.prototype.Copy         = function()
{
	return new ParaContinuationSeparator();
};
ParaContinuationSeparator.prototype.UpdateWidth = function(PRS)
{
	var oPara    = PRS.Paragraph;
	var nCurPage = PRS.Page;

	oPara.Parent.Update_ContentIndexing();
	var oLimits = oPara.Parent.Get_PageContentStartPos2(oPara.PageNum, oPara.ColumnNum, nCurPage, oPara.Index);

	var nWidth = (Math.max(oLimits.XLimit - PRS.X, 50) * AscWord.TEXTWIDTH_DIVIDER) | 0;

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
};
ParaContinuationSeparator.prototype.IsNeedSaveRecalculateObject = function()
{
	return true;
};
ParaContinuationSeparator.prototype.SaveRecalculateObject = function(isCopy)
{
	return {
		Width : this.Width
	};
};
ParaContinuationSeparator.prototype.LoadRecalculateObject = function(oRecalcObj)
{
	this.Width        = oRecalcObj.Width;
	this.WidthVisible = oRecalcObj.Width;
};
ParaContinuationSeparator.prototype.PrepareRecalculateObject = function()
{
};


/**
 * Класс представляющий элемент "количество страниц"
 * @param PageCount
 * @constructor
 * @extends {AscWord.CRunElementBase}
 */
function ParaPageCount(PageCount)
{
	AscWord.CRunElementBase.call(this);

	this.FontKoef  = 1;
	this.NumWidths = [];
	this.Widths    = [];
	this.String    = "";
	this.PageCount = undefined !== PageCount ? PageCount : 1;
	this.Parent    = null;
}
ParaPageCount.prototype = Object.create(AscWord.CRunElementBase.prototype);
ParaPageCount.prototype.constructor = ParaPageCount;

ParaPageCount.prototype.Type = para_PageCount;
ParaPageCount.prototype.Copy = function()
{
	return new ParaPageCount();
};
ParaPageCount.prototype.CanAddNumbering = function()
{
	return true;
};
ParaPageCount.prototype.Measure = function(Context, TextPr)
{
	this.FontKoef = TextPr.Get_FontKoef();
	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);

	for (var Index = 0; Index < 10; Index++)
	{
		this.NumWidths[Index] = Context.Measure("" + Index).Width;
	}

	this.private_UpdateWidth();
};
ParaPageCount.prototype.Draw = function(X, Y, Context)
{
	var Len = this.String.length;

	var _X = X;
	var _Y = Y;

	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);
	for (var Index = 0; Index < Len; Index++)
	{
		var Char = this.String.charAt(Index);
		Context.FillText(_X, _Y, Char);
		_X += this.Widths[Index];
	}
};
ParaPageCount.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
	var sValue = "1234567890";
	for (var Index = 0; Index < sValue.length; Index++)
	{
		var Char = sValue.charAt(Index);
		FontCharMap.AddChar(Char);
	}
};
ParaPageCount.prototype.Update_PageCount = function(nPageCount)
{
	this.PageCount = nPageCount;
	this.private_UpdateWidth();
};
ParaPageCount.prototype.SetNumValue = function(nValue)
{
	this.Update_PageCount(nValue);
};
ParaPageCount.prototype.private_UpdateWidth = function()
{
	this.String = "" + this.PageCount;

	var RealWidth = 0;
	for (var Index = 0, Len = this.String.length; Index < Len; Index++)
	{
		var Char = parseInt(this.String.charAt(Index));

		this.Widths[Index] = this.NumWidths[Char];
		RealWidth += this.NumWidths[Char];
	}

	RealWidth = (RealWidth * AscWord.TEXTWIDTH_DIVIDER) | 0;

	this.Width        = RealWidth;
	this.WidthVisible = RealWidth;
};
ParaPageCount.prototype.Write_ToBinary = function(Writer)
{
	// Long : Type
	// Long : PageCount
	Writer.WriteLong(this.Type);
	Writer.WriteLong(this.PageCount);
};
ParaPageCount.prototype.Read_FromBinary = function(Reader)
{
	this.PageCount = Reader.GetLong();
};
ParaPageCount.prototype.GetPageCountValue = function()
{
	return this.PageCount;
};
/**
 * Выставляем родительский класс
 * @param {ParaRun} oParent
 */
ParaPageCount.prototype.SetParent = function(oParent)
{
	this.Parent = oParent;
};
/**
 * Получаем родительский класс
 * @returns {?ParaRun}
 */
ParaPageCount.prototype.GetParent = function()
{
	return this.Parent;
};
ParaPageCount.prototype.GetFontSlot = function(nHint, nEA_lcid, isCS, isRTL)
{
	return rfont_ASCII;
};


/**
 * Класс представляющий ссылку на сноску
 * @param {CFootEndnote} oEndnote - Ссылка на сноску
 * @param {string} sCustomMark
 * @constructor
 * @extends {ParaFootnoteReference}
 */
function ParaEndnoteReference(oEndnote, sCustomMark)
{
	ParaFootnoteReference.call(this, oEndnote, sCustomMark);
}
ParaEndnoteReference.prototype = Object.create(ParaFootnoteReference.prototype);
ParaEndnoteReference.prototype.constructor = ParaEndnoteReference;

ParaEndnoteReference.prototype.Type = para_EndnoteReference;
ParaEndnoteReference.prototype.Get_Type = function()
{
	return para_EndnoteReference;
};
ParaEndnoteReference.prototype.Copy = function(oPr)
{
	if (this.Footnote)
	{
		var oEndnote;
		if (oPr && oPr.Comparison)
		{
			oEndnote = oPr.Comparison.createEndNote();
		}
		else
		{
			oEndnote = this.Footnote.Parent.CreateEndnote();
		}
		oEndnote.Copy2(this.Footnote, oPr);
	}

	var oRef = new ParaEndnoteReference(oEndnote);

	oRef.Number    = this.Number;
	oRef.NumFormat = this.NumFormat;

	return oRef;
};
ParaEndnoteReference.prototype.UpdateNumber = function(PRS, isKeepNumber)
{
	if (this.Footnote && true !== PRS.IsFastRecalculate() && PRS.TopDocument instanceof CDocument)
	{
		var nPageAbs    = PRS.GetPageAbs();
		var nColumnAbs  = PRS.GetColumnAbs();
		var nNumber     = PRS.GetEndnoteReferenceNumber(this);
		var oSectPr     = PRS.GetSectPr();
		var nNumFormat  = oSectPr.GetEndnoteNumFormat();

		var oLogicDocument      = this.Footnote.GetLogicDocument();
		var oEndnotesController = oLogicDocument.GetEndnotesController();

		if (!isKeepNumber)
		{
			this.NumFormat = nNumFormat;
			this.Number    = -1 === nNumber ? oEndnotesController.GetEndnoteNumberOnPage(nPageAbs, nColumnAbs, oSectPr, this.Footnote) : nNumber;

			// Если данная сноска не участвует в нумерации, просто уменьшаем ей номер на 1, для упрощения работы
			if (this.IsCustomMarkFollows())
				this.Number--;
		}

		this.private_Measure();
		this.Footnote.SetNumber(this.Number, oSectPr, this.IsCustomMarkFollows());
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = Asc.c_oAscNumberingFormat.Decimal;
		this.private_Measure();
	}
};
ParaEndnoteReference.prototype.ToSearchElement = function(oProps)
{
	return new AscCommonWord.CSearchTextSpecialEndnoteMark();
};


/**
 * Класс представляющий номер сноски внутри сноски.
 * @param {CFootEndnote} oEndnote - Ссылка на сноску.
 * @constructor
 * @extends {ParaEndnoteReference}
 */
function ParaEndnoteRef(oEndnote)
{
	ParaEndnoteReference.call(this, oEndnote);
}
ParaEndnoteRef.prototype = Object.create(ParaEndnoteReference.prototype);
ParaEndnoteRef.prototype.constructor = ParaEndnoteRef;

ParaEndnoteRef.prototype.Type = para_EndnoteRef;
ParaEndnoteRef.prototype.Get_Type = function()
{
	return para_EndnoteRef;
};
ParaEndnoteRef.prototype.Copy = function(oPr)
{
	var oEndNote = this.GetFootnote();
	var oParagraph, oParent, oTopDocument;
	if(oPr && oPr.Paragraph)
	{
		oParagraph = oPr.Paragraph;
		oParent = oParagraph.GetParent();
		if(oParent)
		{
			oTopDocument = oParent.GetTopDocumentContent();
			if(oTopDocument && oTopDocument instanceof CFootEndnote)
			{
				oEndNote = oTopDocument;
			}
		}
	}
	return new ParaEndnoteRef(oEndNote);
};
ParaEndnoteRef.prototype.UpdateNumber = function(oEndnote)
{
	this.Footnote = oEndnote;
	if (this.Footnote && this.Footnote instanceof CFootEndnote)
	{
		this.Number    = this.Footnote.GetNumber();
		this.NumFormat = this.Footnote.GetReferenceSectPr().GetEndnoteNumFormat();
		this.private_Measure();
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = Asc.c_oAscNumberingFormat.Decimal;
		this.private_Measure();
	}
};
ParaEndnoteRef.prototype.PreDelete = function()
{
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaNewLine   = ParaNewLine;
window['AscCommonWord'].ParaSpace     = ParaSpace;
window['AscCommonWord'].ParaPageNum   = ParaPageNum;
window['AscCommonWord'].ParaPageCount = ParaPageCount;

window['AscCommonWord'].break_Line = break_Line;
window['AscCommonWord'].break_Page = break_Page;
window['AscCommonWord'].break_Column = break_Column;
