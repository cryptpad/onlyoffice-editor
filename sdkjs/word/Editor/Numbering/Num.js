/*
 * (c) Copyright Ascensio System SIA 2010-2024
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
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
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

/**
 * Класс представляющий нумерацию параграфов в документах
 * @param {AscWord.CNumbering} oNumbering - ссылка на главный объект нумерации в документах
 * @param {string} sAbstractNumId - идентификатор абстрактной нумерации
 * @constructor
 */
function CNum(oNumbering, sAbstractNumId)
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Lock = new AscCommon.CLock();
	if (!AscCommon.g_oIdCounter.m_bLoad)
	{
		this.Lock.Set_Type(AscCommon.c_oAscLockTypes.kLockTypeMine, false);
		if (typeof AscCommon.CollaborativeEditing !== "undefined")
			AscCommon.CollaborativeEditing.Add_Unlock2(this);
	}

	this.AbstractNumId = sAbstractNumId ? sAbstractNumId : null;
	this.LvlOverride   = [];
	this.Numbering     = oNumbering;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	AscCommon.g_oTableId.Add(this, this.Id);
}
CNum.prototype.Get_Id = function()
{
	return this.Id;
};
/**
 * Идентификатор данного объекта
 * @returns {string}
 */
CNum.prototype.GetId = function()
{
	return this.Id;
};
/**
 * Создаем копию данной нумерации
 * @returns {CNum}
 */
CNum.prototype.Copy = function()
{
	var oNum = this.Numbering.CreateNum();

	var oNewAbstractNum = this.Numbering.GetAbstractNum(oNum.AbstractNumId);
	var oAbstractNum    = this.Numbering.GetAbstractNum(this.AbstractNumId);

	if (oAbstractNum && oNewAbstractNum)
		oNewAbstractNum.Copy(oAbstractNum);

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (this.LvlOverride[nLvl] && this.LvlOverride[nLvl].NumberingLvl)
			oNum.SetLvlOverride(this.LvlOverride[nLvl].GetLvl().Copy(), nLvl, this.LvlOverride[nLvl].GetStartOverride());
	}

	return oNum;
};
/**
 * Получаем заданный уровень
 * @param nLvl {number} 0..8
 * @returns {CNumberingLvl}
 */
CNum.prototype.GetLvl = function(nLvl)
{
	if (this.private_HaveLvlOverride(nLvl))
		return this.LvlOverride[nLvl].GetLvl();

	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return new CNumberingLvl();

	return oAbstractNum.GetLvl(nLvl);
};
/**
 * Создаем многоуровневый список с заданным пресетом
 * @param nType {c_oAscMultiLevelNumbering}
 */
CNum.prototype.CreateDefault = function(nType)
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return;

	oAbstractNum.CreateDefault(nType);
	this.ClearAllLvlOverride();
};
/**
 * Задаем новый уровень нумерации
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 */
CNum.prototype.SetLvl = function(oNumberingLvl, nLvl)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvl(nLvl, oNumberingLvl);
	}
};
/**
 * Заполняем настройки уровня из интерфейсного класса
 * @param oAscNumberingLvl {CAscNumberingLvl}
 * @param nLvl {number} 0..8
 */
CNum.prototype.SetAscLvl = function(oAscNumberingLvl, nLvl)
{
	var oNumberingLvl = new CNumberingLvl();
	oNumberingLvl.FillFromAscNumberingLvl(oAscNumberingLvl);
	this.SetLvl(oNumberingLvl, nLvl);
};
/**
 * Делаем заданный уровень заданного пресета
 * @param nLvl {number} 0..8
 * @param nType {c_oAscNumberingLevel}
 * @param [sText=undefined] Используется для типа c_oAscNumberingLevel.Bullet
 * @param [oTextPr=undefined] {CTextPr} Используется для типа c_oAscNumberingLevel.Bullet
 */
CNum.prototype.SetLvlByType = function(nLvl, nType, sText, oTextPr)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = new CNumberingLvl();
		oNumberingLvl.SetByType(nType, nLvl, sText, oTextPr);

		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlByType(nLvl, nType, sText, oTextPr);
	}
};
/**
 * Заполняем уровень по заданному формату
 * @param nLvl {number} 0..8
 * @param nType
 * @param sFormatText
 * @param nAlign
 */
CNum.prototype.SetLvlByFormat = function(nLvl, nType, sFormatText, nAlign)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = new CNumberingLvl();
		oNumberingLvl.SetByFormat(nLvl, nType, sFormatText, nAlign);

		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlByFormat(nLvl, nType, sFormatText, nAlign);
	}
};
/**
 * Выставляем является ли данный уровень сквозным или каждый раз перестартовывать нумерацию
 * @param nLvl {number} 0..8
 * @param isRestart {boolean}
 */
CNum.prototype.SetLvlRestart = function(nLvl, isRestart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl        = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl     = oNumberingLvl.Copy();
		oNewNumberingLvl.Restart = (isRestart ? -1 : 0);
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlRestart(nLvl, isRestart);
	}
};
/**
 * Задаем начальное значения для данного уровня
 * @param nLvl {number} 0..8
 * @param nStart {number}
 */
CNum.prototype.SetLvlStart = function(nLvl, nStart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl      = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl   = oNumberingLvl.Copy();
		oNewNumberingLvl.Start = nStart;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlStart(nLvl, nStart);
	}
};
/**
 * Связываем данную нумерацию с заголовками
 * @param styles {CStyles}
 */
CNum.prototype.LinkWithHeadings = function(styles)
{
	for (let iLvl = 0; iLvl <= 8; ++iLvl)
	{
		this.LinkWithStyle(iLvl, styles.GetDefaultHeading(iLvl), styles);
	}
};
/**
 * Связываем заданный уровень с заданным стилем
 * @param {number} iLvl 0..8
 * @param {string} styleId
 * @param {AscWord.CStyles} styleManager
 */
CNum.prototype.LinkWithStyle = function(iLvl, styleId, styleManager)
{
	if ("number" !== typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;
	
	let numLvl = this.GetLvl(iLvl);
	let pStyle = numLvl.GetPStyle();
	if (pStyle && styleManager.Get(pStyle))
	{
		let oldStyle = styleManager.Get(pStyle);
		oldStyle.SetNumPr(null);
	}

	let style = styleManager.Get(styleId);
	if (!style)
		return;

	style.SetNumPr(this.GetId(), iLvl);

	if (this.private_HaveLvlOverride(iLvl))
	{
		var oNumberingLvl      = this.LvlOverride[iLvl].GetLvl();
		var oNewNumberingLvl   = oNumberingLvl.Copy();
		oNewNumberingLvl.SetPStyle(styleId);
		this.SetLvlOverride(oNewNumberingLvl, iLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlPStyle(iLvl, styleId);
	}
};
/**
 * Выставляем тип разделителя между табом и последующим текстом
 * @param nLvl {number} 0..8
 * @param nSuff {number}
 */
CNum.prototype.SetLvlSuff = function(nLvl, nSuff)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl     = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl  = oNumberingLvl.Copy();
		oNewNumberingLvl.Suff = nSuff;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlSuff(nLvl, nSuff);
	}
};
/**
 * Устанавливаем новый уровень
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 * @param [nStartOverride=-1]
 */
CNum.prototype.SetLvlOverride = function(oNumberingLvl, nLvl, nStartOverride)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (!oNumberingLvl && !this.LvlOverride[nLvl] && (-1 === nStartOverride || undefined == nStartOverride))
		return;

	var oLvlOverrideOld = this.LvlOverride[nLvl];
	var oLvlOverrideNew = new CLvlOverride(oNumberingLvl, nLvl, nStartOverride);

	AscCommon.History.Add(new CChangesNumLvlOverrideChange(this, oLvlOverrideOld, oLvlOverrideNew, nLvl));

	this.LvlOverride[nLvl] = oLvlOverrideNew;
	this.RecalculateRelatedParagraphs(nLvl);
};
/**
 * Удаляем все записи о перекрывании уровней
 */
CNum.prototype.ClearAllLvlOverride = function()
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		this.SetLvlOverride(undefined, nLvl);
	}
};
/**
 * Изменяем базовую нумерацию
 * @param sId {string}
 */
CNum.prototype.SetAbstractNumId = function(sId)
{
	if (sId !== this.AbstractNumId)
	{
		AscCommon.History.Add(new CChangesNumAbstractNum(this, this.AbstractNumId, sId));
		this.AbstractNumId = sId;
		this.RecalculateRelatedParagraphs(-1);
	}
};
/**
 * Сообщаем, что параграфы связанные с заданным уровнем нужно пересчитать
 * @param nLvl {number} 0..8 - заданный уровен, если -1 то для всех уровней
 */
CNum.prototype.RecalculateRelatedParagraphs = function(nLvl)
{
	if (nLvl < 0 || nLvl > 8)
		nLvl = undefined;

	let logicDocument = editor.WordControl.m_oLogicDocument;
	if (!logicDocument || !logicDocument.IsDocumentEditor())
		return;

	let styleManager = logicDocument.GetStyles();
	if (undefined !== nLvl)
	{
		let lvl   = this.GetLvl(nLvl);
		let style = styleManager.Get(lvl.GetPStyle());
		if (style)
			logicDocument.Add_ChangedStyle(style.GetId());
	}
	else
	{
		for (let iLvl = 0; iLvl <= 8; ++iLvl)
		{
			let lvl   = this.GetLvl(iLvl);
			let style = styleManager.Get(lvl.GetPStyle());
			if (style)
				logicDocument.Add_ChangedStyle(style.GetId());
		}
	}
	
	logicDocument.GetNumberingCollection().CheckNum(this.Id, nLvl);
	
	var arrParagraphs = logicDocument.GetAllParagraphsByNumbering({NumId : this.Id, Lvl : nLvl});
	for (var nIndex = 0, nCount = arrParagraphs.length; nIndex < nCount; ++nIndex)
	{
		arrParagraphs[nIndex].RecalcCompiledPr();
	}
};
/**
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CNum.prototype.ApplyTextPr = function(nLvl, oTextPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.TextPr.Merge(oTextPr);
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.ApplyTextPr(nLvl, oTextPr);
	}
};
/**
 * Сдвигаем все уровни на заданное значение (оно задается для нулевого уровня)
 * @param nLeftNew {number}
 */
CNum.prototype.ShiftLeftInd = function(nLeftNew)
{
	var oFirstLevel = this.GetLvl(0);
	var nLeftOld    = oFirstLevel.ParaPr.Ind.Left ? oFirstLevel.ParaPr.Ind.Left : 0;

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvlOld = this.GetLvl(nLvl);
		var oLvlNew = this.GetLvl(nLvl).Copy();

		oLvlNew.ParaPr.Ind.Left = oLvlOld.ParaPr.Ind.Left ? oLvlOld.ParaPr.Ind.Left - nLeftOld + nLeftNew : nLeftNew - nLeftOld;

		this.SetLvl(oLvlNew, nLvl);
	}
};
/**
 * Получаем Id NumStyleLink
 * @returns {null | string}
 */
CNum.prototype.GetNumStyleLink = function()
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return null;

	return oAbstractNum.GetNumStyleLink();
};
/**
 * Получаем Id StyleLink
 * @returns {null | string}
 */
CNum.prototype.GetStyleLink = function()
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return null;

	return oAbstractNum.GetStyleLink();
};
/**
 * Получаем уровень списка по заданном стилю
 * @param sStyleId {string}
 * @returns {number}
 */
CNum.prototype.GetLvlByStyle = function(sStyleId)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		if (oLvl && sStyleId === oLvl.GetPStyle())
			return nLvl;
	}

	return -1;
};
/**
 * Получаем нумерованное значение для заданного уровня с учетом заданого сдвига и формата данного уровня
 * @param nLvl {number} 0..8
 * @param nNumShift {number}
 * @param [isForceArabic=false] {boolean}
 * @param oLangForTextNumbering {AscCommonWord.CLang}
 */
CNum.prototype.private_GetNumberedLvlText = function(nLvl, nNumShift, isForceArabic, oLangForTextNumbering)
{
	var nFormat = this.GetLvl(nLvl).GetFormat();
	if (true === isForceArabic
		&& nFormat !== Asc.c_oAscNumberingFormat.Decimal
		&& nFormat !== Asc.c_oAscNumberingFormat.DecimalZero)
		nFormat = Asc.c_oAscNumberingFormat.Decimal;

	return AscCommon.IntToNumberFormat(nNumShift, nFormat, {lang: oLangForTextNumbering});
};
/**
 * Функция отрисовки заданного уровня нумерации в заданной позиции
 * @param nX
 * @param nY
 * @param oContext
 * @param nLvl
 * @param oNumInfo
 * @param oNumTextPr
 * @param oTheme
 * @param isRtl {boolean}
 */
CNum.prototype.Draw = function(nX, nY, oContext, nLvl, oNumInfo, oNumTextPr, oTheme, isRtl)
{
	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();
	var dKoef   = oNumTextPr.VertAlign !== AscCommon.vertalign_Baseline ? AscCommon.vaKSize : 1;
	
	oContext.SetTextPr(oNumTextPr, oTheme);
	g_oTextMeasurer.SetTextPr(oNumTextPr, oTheme);
	
	let numDraw = new AscWord.NumBidiDraw();
	numDraw.begin(nX, nY, oContext, g_oTextMeasurer, oNumTextPr, isRtl);
	
	for (let i = 0, count = arrText.length; i < count; ++i)
	{
		let element = arrText[i];
		if (numbering_lvltext_Text === element.Type)
		{
			let strValue  = element.Value;
			let codePoint = strValue.charCodeAt(0);
			let curCoef   = dKoef;
			
			let info;
			if ((info = this.ApplyTextPrToCodePoint(codePoint, oNumTextPr)))
			{
				curCoef  *= info.FontCoef;
				codePoint = info.CodePoint;
				strValue  = String.fromCodePoint(codePoint);
			}
			
			numDraw.addTextString(strValue, curCoef);
		}
		else if (numbering_lvltext_Num === element.Type)
		{
			var langForTextNumbering = oNumTextPr.Lang;
			
			var nCurLvl = element.Value;
			var T       = "";
			
			if (nCurLvl < oNumInfo.length)
				T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl], oLvl.IsLegalStyle() && nCurLvl < nLvl, langForTextNumbering);
			
			numDraw.addTextString(T, dKoef);
		}
	}

	numDraw.end();
};
/**
 * Функция пересчета заданного уровня нумерации
 * @param oContext
 * @param nLvl
 * @param oNumInfo
 * @param oNumTextPr
 * @param oTheme
 * @returns {{Width : number, Ascent : number}}
 */
CNum.prototype.Measure = function(oContext, nLvl, oNumInfo, oNumTextPr, oTheme)
{
	var nX = 0;

	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();
	var dKoef   = oNumTextPr.VertAlign !== AscCommon.vertalign_Baseline ? AscCommon.vaKSize : 1;

	oContext.SetTextPr(oNumTextPr, oTheme);
	oContext.SetFontSlot(AscWord.fontslot_ASCII, dKoef);
	var nAscent = oContext.GetAscender();

	for (var nTextIndex = 0, nTextLen = arrText.length; nTextIndex < nTextLen; ++nTextIndex)
	{
		switch (arrText[nTextIndex].Type)
		{
			case numbering_lvltext_Text:
			{
				let strValue  = arrText[nTextIndex].Value;
				let codePoint = strValue.getUnicodeIterator().value();
				let curCoef   = dKoef;

				let info;
				if ((info = this.ApplyTextPrToCodePoint(codePoint, oNumTextPr)))
				{
					curCoef *= info.FontCoef;
					codePoint = info.CodePoint;
					strValue  = String.fromCodePoint(codePoint);
				}

				var FontSlot = AscWord.GetFontSlotByTextPr(codePoint, oNumTextPr);

				oContext.SetFontSlot(FontSlot, curCoef);
				nX += oContext.MeasureCode(codePoint).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				oContext.SetFontSlot(AscWord.fontslot_ASCII, dKoef);
				var nCurLvl = arrText[nTextIndex].Value;
				var sLangForTextNumbering = oNumTextPr.Lang;
				var T = "";

				if (nCurLvl < oNumInfo.length)
					T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl], oLvl.IsLegalStyle() && nCurLvl < nLvl, sLangForTextNumbering);

				for (var iter = T.getUnicodeIterator(); iter.check(); iter.next())
				{
					var CharCode = iter.value();
					nX += oContext.MeasureCode(CharCode).Width;
				}

				break;
			}
		}
	}

	return {
		Width  : nX,
		Ascent : nAscent
	};
};
/**
 * Составляем список всех используемых символов
 * @param oFontCharMap
 * @param nLvl {number} 0..8
 * @param oNumInfo
 * @param oNumTextPr {CTextPr}
 */
CNum.prototype.CreateFontCharMap = function(oFontCharMap, nLvl, oNumInfo, oNumTextPr)
{
	oFontCharMap.StartFont(oNumTextPr.FontFamily.Name, oNumTextPr.Bold, oNumTextPr.Italic, oNumTextPr.FontSize);

	var arrText = this.GetLvl(nLvl).GetLvlText();
	for (var nIndex = 0, nCount = arrText.length; nIndex < nCount; ++nIndex)
	{
		switch (arrText[nIndex].Type)
		{
			case numbering_lvltext_Text:
			{
				oFontCharMap.AddChar(arrText[nIndex].Value);
				break;
			}
			case numbering_lvltext_Num:
			{
				var nCurLvl = arrText[nIndex].Value;

				var T = "";
				if (nCurLvl < oNumInfo.length)
					T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl]);

				for (var Index2 = 0; Index2 < T.length; Index2++)
				{
					var Char = T.charAt(Index2);
					oFontCharMap.AddChar(Char);
				}

				break;
			}
		}
	}
};
/**
 * Получаем список всех используемых шрифтов
 * @param arrAllFonts {array}
 */
CNum.prototype.GetAllFontNames = function(arrAllFonts)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);

		if (oLvl)
			oLvl.GetTextPr().GetAllFontNames(arrAllFonts);
	}
};
/**
 * Получаем текст нумерации для заданного уровня
 * @param nLvl {number} 0..8
 * @param oNumInfo
 * @param bWithoutLastLvlText {?boolean}
 * @param [oLang] {AscCommonWord.CLang}
 * @returns {string}
 */
CNum.prototype.GetText = function(nLvl, oNumInfo, bWithoutLastLvlText, oLang)
{
	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();

	var sResult = "";
	for (var Index = 0; Index < arrText.length; Index++)
	{
		switch (arrText[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				if(bWithoutLastLvlText && Index === arrText.length - 1)
				{
					break;
				}
				sResult += arrText[Index].Value;
				break;
			}
			case numbering_lvltext_Num:
			{
				var nCurLvl = arrText[Index].Value;
				if (nCurLvl < oNumInfo.length)
					sResult += this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl], false, oLang);

				break;
			}
		}
	}

	return sResult;
};
/**
 * Обрабатываем окончание загрузки изменений
 * @param oData
 */
CNum.prototype.Process_EndLoad = function(oData)
{
	if (undefined !== oData.Lvl)
		this.RecalculateRelatedParagraphs(oData.Lvl);
};
/**
 * Проверяем есть ли у нас LvlOverride с перезаписанным уровнем
 * @param nLvl {number} 0..8
 * @returns {boolean}
 */
CNum.prototype.private_HaveLvlOverride = function(nLvl)
{
	return !!(this.LvlOverride[nLvl] && this.LvlOverride[nLvl].GetLvl());
};
/**
 * Получаем связанную абстрактную нумерацию
 * @returns {CAbstractNum}
 */
CNum.prototype.GetAbstractNum = function()
{
	return this.Numbering.GetAbstractNum(this.AbstractNumId);
};
/**
 * Получаем идентификатор связанной абстрактной нумерации
 * @returns {string}
 */
CNum.prototype.GetAbstractNumId = function()
{
	return this.AbstractNumId;
};
/**
 * Получаем параметр StartOverride для заданного уровня
 * @param nLvl {number} 0..8
 * @returns {number} возвращаем -1, если данный параметр не задан
 */
CNum.prototype.GetStartOverride = function(nLvl)
{
	var oLvlOverride = this.LvlOverride[nLvl];
	if (!oLvlOverride)
		return -1;

	return oLvlOverride.GetStartOverride();
};
/**
 * Проверяем есть ли у данной нумерации уровни с текстом, зависящим от других уровней
 * @returns {boolean}
 */
CNum.prototype.IsHaveRelatedLvlText = function()
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		var arrLvlText = oLvl.GetLvlText();
		for (var nIndex = 0, nCount = arrLvlText.length; nIndex < nCount; ++nIndex)
		{
			var oLvlText = arrLvlText[nIndex];
			if (numbering_lvltext_Num === oLvlText.Type && nLvl !== oLvlText.Value)
				return true;
		}
	}

	return false;
};
/**
 * Выставляем текстовые настройки для заданного уровня
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CNum.prototype.SetTextPr = function(nLvl, oTextPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.TextPr = oTextPr;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetTextPr(nLvl, oTextPr);
	}
};
/**
 * Выставляем настройки параграфа для заданного уровня
 * @param nLvl {number} 0..8
 * @param oParaPr {CParaPr}
 */
CNum.prototype.SetParaPr = function(nLvl, oParaPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.ParaPr = oParaPr;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetParaPr(nLvl, oParaPr);
	}
};
/**
 * Заполняем специальный класс для общения с интерфейсом
 * @param oAscNum {CAscNumbering}
 */
CNum.prototype.FillToAscNum = function(oAscNum)
{
	oAscNum.NumId = this.GetId();
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		oLvl.FillToAscNumberingLvl(oAscNum.get_Lvl(nLvl));
	}
};
/**
 * Заполняем настройки нумерации из интерфейсного класса
 * @param oAscNum {CAscNumbering}
 */
CNum.prototype.FillFromAscNum = function(oAscNum)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = new CNumberingLvl();
		var oAscLvl = oAscNum.get_Lvl(nLvl);
		oLvl.FillFromAscNumberingLvl(oAscLvl);
		this.SetLvl(oLvl, nLvl);
	}
};
/**
 * Проверяем похожи ли две заданные нумерации
 * @param oNum {CNum}
 * @returns {boolean}
 */
CNum.prototype.IsSimilar = function(oNum)
{
	if (!oNum)
		return false;

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		if (!oLvl.IsSimilar(oNum.GetLvl(nLvl)))
			return false;
	}

	return true;
};
/**
 * Проверяем, одинаковы ли две заданные нумерации
 * @param oNum {CNum}
 * @returns {boolean}
 */
CNum.prototype.IsEqual = function(oNum)
{
	if (!oNum)
		return false;

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		if (!oLvl.IsEqual(oNum.GetLvl(nLvl)))
			return false;
	}

	return true;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
CNum.prototype.Refresh_RecalcData = function(Data)
{
};
CNum.prototype.Document_Is_SelectionLocked = function(nCheckType)
{
	return this.IsSelectionLocked(nCheckType);
};
CNum.prototype.IsSelectionLocked = function(nCheckType)
{
	switch (nCheckType)
	{
		case AscCommon.changestype_Paragraph_Content:
		case AscCommon.changestype_Paragraph_Properties:
		case AscCommon.changestype_Paragraph_AddText:
		case AscCommon.changestype_Paragraph_TextProperties:
		case AscCommon.changestype_ContentControl_Add:
		{
			this.Lock.Check(this.Get_Id());
			break;
		}
		case AscCommon.changestype_Document_Content:
		case AscCommon.changestype_Document_Content_Add:
		case AscCommon.changestype_Image_Properties:
		{
			AscCommon.CollaborativeEditing.Add_CheckLock(true);
			break;
		}
	}

	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (oAbstractNum)
		oAbstractNum.IsSelectionLocked(nCheckType);
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
CNum.prototype.Write_ToBinary2 = function(oWriter)
{
	oWriter.WriteLong(AscDFH.historyitem_type_Num);

	// String          : Id
	// String          : AbstractNumId
	// Variable[9 Lvl] : LvlOverride

	oWriter.WriteString2(this.Id);
	oWriter.WriteString2(this.AbstractNumId);

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (this.LvlOverride[nLvl])
		{
			oWriter.WriteBool(true);
			this.LvlOverride[nLvl].WriteToBinary(oWriter);
		}
		else
		{
			oWriter.WriteBool(false);
		}
	}
};
CNum.prototype.Read_FromBinary2 = function(oReader)
{
	// String          : Id
	// String          : AbstractNumId
	// Variable[9 Lvl] : LvlOverride

	this.Id            = oReader.GetString2();
	this.AbstractNumId = oReader.GetString2();

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (oReader.GetBool())
		{
			this.LvlOverride[nLvl] = new CLvlOverride();
			this.LvlOverride[nLvl].ReadFromBinary();
		}
	}

	if (!this.Numbering)
		this.Numbering = editor.WordControl.m_oLogicDocument.GetNumbering();

	this.Numbering.AddNum(this);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CNum.prototype.ApplyTextPrToCodePoint = function(codePoint, textPr)
{
	if (!textPr || (!textPr.Caps && !textPr.SmallCaps))
		return null;

	let resultCodePoint = (String.fromCharCode(codePoint).toUpperCase()).charCodeAt(0);
	if (resultCodePoint === codePoint)
		return null;

	return {
		CodePoint : resultCodePoint,
		FontCoef  : !textPr.Caps ? smallcaps_Koef : 1,
	};
};


/**
 * Класс реализующий замену уровня в нумерации CNum
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 * @param [nStartOverride=-1] {number}
 * @constructor
 */
function CLvlOverride(oNumberingLvl, nLvl, nStartOverride)
{
	this.NumberingLvl  = oNumberingLvl;
	this.Lvl           = nLvl;
	this.StartOverride = undefined !== nStartOverride ? nStartOverride : -1;
}
CLvlOverride.prototype.GetLvl = function()
{
	return this.NumberingLvl;
};
CLvlOverride.prototype.GetStartOverride = function()
{
	return this.StartOverride;
};
CLvlOverride.prototype.WriteToBinary = function(oWriter)
{
	// Long : Lvl
	// Long : StartOverride
	// bool : isUndefined NumberingLvl
	// false -> CNumberingLvl : NumberingLvl

	oWriter.WriteLong(this.Lvl);
	oWriter.WriteLong(this.StartOverride);

	if (this.NumberingLvl)
	{
		oWriter.WriteBool(false);
		this.NumberingLvl.WriteToBinary(oWriter);
	}
	else
	{
		oWriter.WriteBool(true);
	}
};
CLvlOverride.prototype.ReadFromBinary = function(oReader)
{
	// Long : Lvl
	// Long : StartOverride
	// bool : isUndefined NumberingLvl
	// false -> CNumberingLvl : NumberingLvl

	this.Lvl           = oReader.GetLong();
	this.StartOverride = oReader.GetLong();
	this.NumberingLvl  = undefined;

	if (!oReader.GetBool())
	{
		this.NumberingLvl = new CNumberingLvl();
		this.NumberingLvl.ReadFromBinary(oReader);
	}
};

(function(){
	
	/**
	 * Class for rendering num
	 * @constructor
	 */
	function NumBidiDraw()
	{
		this.bidiFlow = new AscWord.BidiFlow(this);
		
		this.x = 0;
		this.y = 0;
		
		this.graphics = null;
		this.measurer = null;
		this.textPr   = null;
	}
	
	NumBidiDraw.prototype.begin = function(x, y, graphics, measurer, textPr, isRtl)
	{
		this.x = x;
		this.y = y;
		
		this.graphics = graphics;
		this.measurer = measurer;
		this.textPr   = textPr;
		
		this.bidiFlow.begin(isRtl);
	};
	NumBidiDraw.prototype.addTextString = function(text, fontCoeff)
	{
		for (let iter = text.getUnicodeIterator(); iter.check(); iter.next())
		{
			this.addCodePoint(iter.value(), fontCoeff);
		}
	};
	NumBidiDraw.prototype.addCodePoint = function(codePoint, fontCoeff)
	{
		this.bidiFlow.add([codePoint, fontCoeff], AscBidi.getType(codePoint));
	};
	NumBidiDraw.prototype.end = function()
	{
		this.bidiFlow.end();
	};
	NumBidiDraw.prototype.handleBidiFlow = function(data, direction)
	{
		let codePoint = data[0];
		let fontCoeff = data[1];
		
		if (AscBidi.DIRECTION.R === direction && AscBidi.isPairedBracket(codePoint))
			codePoint = AscBidi.getPairedBracket(codePoint);
		
		let fontSlot = AscWord.GetFontSlotByTextPr(codePoint, this.textPr);
		
		this.graphics.SetFontSlot(fontSlot, fontCoeff);
		this.graphics.FillTextCode(this.x, this.y, codePoint);
		
		this.measurer.SetFontSlot(fontSlot, fontCoeff);
		this.x += this.measurer.MeasureCode(codePoint).Width;
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.NumBidiDraw = NumBidiDraw;
})();

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CNum = CNum;

window['AscWord'] = window['AscWord'] || {};
window['AscWord'].CNum = CNum;

