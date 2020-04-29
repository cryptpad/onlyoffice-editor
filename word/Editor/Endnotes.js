/*
 * (c) Copyright Ascensio System SIA 2010-2020
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
/**
 * User: Ilja.Kirillov
 * Date: 09.04.2020
 * Time: 13:31
 */

/**
 * Класс, работающий с концевыми сносками документа
 * @param {CDocument} oLogicDocument - Ссылка на главный документ.
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CEndnotesController(oLogicDocument)
{
	CDocumentControllerBase.call(this, oLogicDocument);

	this.Id = oLogicDocument.GetIdCounter().Get_NewId();

	this.EndnotePr = new CFootnotePr(); // Глобальные настройки для сносок
	this.EndnotePr.InitDefaultEndnotePr();

	this.Endnote = {};
	this.Pages   = [];
	this.Sections = {};

	// Специальные сноски
	this.ContinuationNotice    = null;
	this.ContinuationSeparator = null;
	this.Separator             = null;

	this.Selection = {
		Use : false,

		Start : {
			Endnote          : null,
			Index            : 0,
			Section          : 0,
			Page             : 0,
			Column           : 0,
			EndnotePageIndex : 0
		},

		End : {
			Endnote          : null,
			Index            : 0,
			Section          : 0,
			Page             : 0,
			Column           : 0,
			EndnotePageIndex : 0
		},

		Endnotes  : {},
		Direction : 0
	};

	this.CurEndnote = null;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	oLogicDocument.GetTableId().Add(this, this.Id);
}

CEndnotesController.prototype = Object.create(CDocumentControllerBase.prototype);
CEndnotesController.prototype.constructor = CEndnotesController;

/**
 * Получаем Id данного класса
 */
CEndnotesController.prototype.Get_Id = function()
{
	return this.Id;
};
/**
 * Получаем Id данного класса
 */
CEndnotesController.prototype.GetId = function()
{
	return this.Id;
};
CEndnotesController.prototype.Refresh_RecalcData = function(Data)
{
};
CEndnotesController.prototype.Refresh_RecalcData2 = function(nRelPageIndex)
{
	var nAbsPageIndex = nRelPageIndex;
};
/**
 * Начальная инициализация после загрузки
 */
CEndnotesController.prototype.ResetSpecialEndnotes = function()
{
	var oSeparator = new CFootEndnote(this);
	oSeparator.AddToParagraph(new ParaSeparator(), false);
	var oParagraph = oSeparator.GetElement(0);
	oParagraph.Set_Spacing({After : 0, Line : 1, LineRule : Asc.linerule_Auto}, false);
	this.SetSeparator(oSeparator);

	var oContinuationSeparator = new CFootEndnote(this);
	oContinuationSeparator.AddToParagraph(new ParaContinuationSeparator(), false);
	oParagraph = oContinuationSeparator.GetElement(0);
	oParagraph.Set_Spacing({After : 0, Line : 1, LineRule : Asc.linerule_Auto}, false);
	this.SetContinuationSeparator(oContinuationSeparator);

	this.SetContinuationNotice(null);
};
/**
 * Создаем новую сноску
 * @returns {CFootEndnote}
 */
CEndnotesController.prototype.CreateEndnote = function()
{
	var oEndnote = new CFootEndnote(this);

	this.Endnote[oEndnote.GetId()] = oEndnote;

	this.LogicDocument.GetHistory().Add(new CChangesEndnotesAddEndnote(this, oEndnote.GetId()));
	return oEndnote;
};
/**
 * Добавляем сноску (функция для открытия файла)
 * @param {CFootEndnote} oEndnote
 */
CEndnotesController.prototype.AddEndnote = function(oEndnote)
{
	this.Endnote[oEndnote.GetId()] = oEndnote;
	this.LogicDocument.GetHistory().Add(new CChangesEndnotesAddEndnote(this, oEndnote.GetId()));
};
CEndnotesController.prototype.SetSeparator = CFootnotesController.prototype.SetSeparator;
CEndnotesController.prototype.SetContinuationSeparator = CFootnotesController.prototype.SetContinuationSeparator;
CEndnotesController.prototype.SetContinuationNotice = CFootnotesController.prototype.SetContinuationNotice;
CEndnotesController.prototype.SetEndnotePrNumFormat = function(nFormatType)
{
	if (undefined !== nFormatType && this.EndnotePr.NumFormat !== nFormatType)
	{
		this.LogicDocument.GetHistory().Add(new CChangesSectionEndnoteNumFormat(this, this.EndnotePr.NumFormat, nFormatType));
		this.EndnotePr.NumFormat = nFormatType;
	}
};
CEndnotesController.prototype.SetEndnotePrPos = function(nPos)
{
	if (undefined !== nPos && this.EndnotePr.Pos !== nPos)
	{
		this.LogicDocument.GetHistory().Add(new CChangesSectionEndnotePos(this, this.EndnotePr.Pos, nPos));
		this.EndnotePr.Pos = nPos;
	}
};
CEndnotesController.prototype.SetEndnotePrNumStart = function(nStart)
{
	if (undefined !== nStart && this.EndnotePr.NumStart !== nStart)
	{
		this.LogicDocument.GetHistory().Add(new CChangesSectionEndnoteNumStart(this, this.EndnotePr.NumStart, nStart));
		this.EndnotePr.NumStart = nStart;
	}
};
CEndnotesController.prototype.SetEndnotePrNumRestart = function(nRestartType)
{
	if (undefined !== nRestartType && this.EndnotePr.NumRestart !== nRestartType)
	{
		this.LogicDocument.GetHistory().Add(new CChangesSectionEndnoteNumRestart(this, this.EndnotePr.NumRestart, nRestartType));
		this.EndnotePr.NumRestart = nRestartType;
	}
};
CEndnotesController.prototype.GetEndnotePrPos = function()
{
	return this.EndnotePr.Pos;
};
/**
 * Проверяем, используется заданная сноска в документе.
 * @param {string} sEndnoteId
 * @param {CFootEndnote.array} arrEndnotesList
 * @returns {boolean}
 */
CEndnotesController.prototype.Is_UseInDocument = function(sEndnoteId, arrEndnotesList)
{
	// TODO: Реализовать
	return true;
};
/**
 * Проверяем является ли данная сноска текущей.
 * @param oEndnote
 * return {boolean}
 */
CEndnotesController.prototype.Is_ThisElementCurrent = function(oEndnote)
{
	if (oEndnote === this.CurEndnote && docpostype_Endnotes === this.LogicDocument.GetDocPosType())
		return true;

	return false;
};
/**
 * Есть ли сноски на заданной странице
 * @param {number} nPageAbs
 * @returns {boolean}
 */
CEndnotesController.prototype.IsEmptyPage = function(nPageAbs)
{
	var oPage = this.Pages[nPageAbs];
	if (!oPage)
		return false;

	for (var nIndex = 0, nCount = oPage.Sections.length; nIndex < nCount; ++nIndex)
	{
		var oSection = this.Sections[oPage.Sections[nIndex]];
		if (!oSection)
			continue;

		var oSectionPage = oSection.Pages[nPageAbs];
		if (!oSectionPage)
			continue;

		for (var nColumnIndex = 0, nColumnsCount = oSectionPage.Columns.length; nColumnIndex < nColumnsCount; ++nColumnIndex)
		{
			if (!this.IsEmptyPageColumn(nPageAbs, nColumnIndex, oPage.Sections[nIndex]))
				return false;
		}
	}

	return true;
};
CEndnotesController.prototype.IsEmptyPageColumn = function(nPageIndex, nColumnIndex, nSectionIndex)
{
	var oColumn = this.private_GetPageColumn(nPageIndex, nColumnIndex, nSectionIndex);
	if (!oColumn || oColumn.Elements.length <= 0)
		return true;

	return false;
};
CEndnotesController.prototype.GetPageBounds = function(nPageAbs, nColumnAbs, nSectionAbs)
{
	var oColumn = this.private_GetPageColumn(nPageAbs, nColumnAbs, nSectionAbs);
	if (!oColumn)
		return new CDocumentBounds(0, 0, 0, 0);

	return new CDocumentBounds(oColumn.X, oColumn.Y, oColumn.XLimit, oColumn.Y + oColumn.Height);
};
CEndnotesController.prototype.Get_PageContentStartPos = function(nPageAbs, nColumnAbs, nSectionAbs)
{
	var oColumn = this.private_GetPageColumn(nPageAbs, nColumnAbs, nSectionAbs);
	if (!oColumn)
		return {X : 0, Y : 0, XLimit : 0, YLimit : 0};

	return {X : oColumn.X, Y : oColumn.Y + oColumn.Height, XLimit : oColumn.XLimit, YLimit : oColumn.YLimit};
};
CEndnotesController.prototype.OnContentReDraw = function(StartPageAbs, EndPageAbs)
{
	this.LogicDocument.OnContentReDraw(StartPageAbs, EndPageAbs);
};
CEndnotesController.prototype.GetEndnoteNumberOnPage = function(nPageAbs, nColumnAbs, oSectPr)
{
	var nNumRestart = section_footnote_RestartContinuous;
	var nNumStart   = 1;
	if (oSectPr)
	{
		nNumRestart = oSectPr.GetEndnoteNumRestart();
		nNumStart   = oSectPr.GetEndnoteNumStart();
	}

	// NumStart никак не влияет в случае RestartEachSect. Влияет только на случай RestartContinuous:
	// к общему количеству сносок добавляется данное значение, взятое для текущей секции, этоже значение из предыдущих
	// секций не учитывается.

	if (section_footnote_RestartEachSect === nNumRestart)
	{
		for (var nPageIndex = nPageAbs; nPageIndex >= 0; --nPageIndex)
		{
			var oPage = this.Pages[nPageIndex];
			if (oPage && oPage.Endnotes.length > 0)
			{
				var oEndnote = oPage.Endnotes[oPage.Endnotes.length - 1];
				if (oEndnote.GetReferenceSectPr() !== oSectPr)
					return 1;

				return oPage.Endnotes[oPage.Endnotes.length - 1].GetNumber() + 1;
			}
		}
	}
	else// if (section_footnote_RestartContinuous === nNumRestart)
	{
		// Здесь нам надо считать, сколько сносок всего в документе до данного момента, отталкиваться от предыдущей мы
		// не можем, потому что Word считает общее количество сносок, а не продолжает нумерацию с предыдущей секции,
		// т.е. после последнего номера 4 в старой секции, в новой секции может идти уже, например, 9.
		var nEndnotesCount = 0;
		for (var nPageIndex = nPageAbs; nPageIndex >= 0; --nPageIndex)
		{
			var oPage = this.Pages[nPageIndex];
			if (oPage && oPage.Endnotes.length > 0)
			{
				for (var nEndnoteIndex = 0, nTempCount = oPage.Endnotes.length; nEndnoteIndex < nTempCount; ++nEndnoteIndex)
				{
					var oEndnote = oPage.Endnotes[nEndnoteIndex];
					if (oEndnote && true !== oEndnote.IsCustomMarkFollows())
						nEndnotesCount++;
				}
			}
		}

		return nEndnotesCount + nNumStart;
	}

	return 1;
};
/**
 * Сбрасываем рассчетные данный для заданной страницы.
 * @param {number} nPageIndex
 * @param {CSectionPr} oSectPr
 */
CEndnotesController.prototype.Reset = function(nPageIndex, oSectPr)
{
	this.Pages.length = nPageIndex;
	if (!this.Pages[nPageIndex])
		this.Pages[nPageIndex] = new CEndnotePage();
};
/**
 * Регистрируем сноски на заданной странице
 * @param nPageAbs
 * @param arrEndnotes
 */
CEndnotesController.prototype.RegisterEndnotes = function(nPageAbs, arrEndnotes)
{
	if (!this.Pages[nPageAbs])
		return;

	this.Pages[nPageAbs].AddEndnotes(arrEndnotes);
};
/**
 * Проверяем, есть ли сноски, которые нужно пересчитать в конце заданной секции
 * @param oSectPr {CSectionPr} секция, в конце которой мы расчитываем сноски
 * @param isFinal {boolean} последняя ли это секция документа
 * @returns {boolean}
 */
CEndnotesController.prototype.HaveEndnotes = function(oSectPr, isFinal)
{
	var nEndnotesPos = this.GetEndnotePrPos();

	if (isFinal && section_endnote_PosDocEnd === nEndnotesPos)
	{
		for (var nCurPage = 0, nPagesCount = this.Pages.length; nCurPage < nPagesCount; ++nCurPage)
		{
			if (this.Pages[nCurPage].Endnotes.length > 0)
				return true;
		}
	}
	else if (section_endnote_PosSectEnd === nEndnotesPos)
	{
		// Мы должны найти просто ссылку на самую последнюю сноску, и если она привязана не данной секции, значит
		// в данной секции и не было никаких сносок
		for (var nCurPage = this.Pages.length - 1; nCurPage >= 0; --nCurPage)
		{
			var oPage = this.Pages[nCurPage];
			if (oPage.Endnotes.length > 0)
			{
				return (oSectPr === oPage.Endnotes[oPage.Endnotes.length - 1].GetReferenceSectPr());
			}
		}
	}

	return false;
};
CEndnotesController.prototype.ClearSection = function(nSectionIndex)
{
	this.Sections.length = nSectionIndex;
	this.Sections[nSectionIndex] = new CEndnoteSection();
};
CEndnotesController.prototype.FillSection = function(nPageAbs, nColumnAbs, oSectPr, nSectionIndex, isFinal)
{
	var oSection = this.private_UpdateSection(oSectPr, nSectionIndex, isFinal, nPageAbs);
	if (oSection.Endnotes.length <= 0)
		return recalcresult2_End;

	oSection.StartPage   = nPageAbs;
	oSection.StartColumn = nColumnAbs;
};
CEndnotesController.prototype.Recalculate = function(X, Y, XLimit, YLimit, nPageAbs, nColumnAbs, nColumnsCount, oSectPr, nSectionIndex, isFinal)
{
	var oSection = this.Sections[nSectionIndex];
	if (!oSection)
		return recalcresult2_End;

	if (this.Pages[nPageAbs])
		this.Pages[nPageAbs].AddSection(nSectionIndex);

	var nStartPos = 0;
	var isStart   = true;

	if (nPageAbs < oSection.StartPage || (nPageAbs === oSection.StartPage && nColumnAbs < oSection.StartColumn))
	{
		// Такого не должно быть
		return recalcresult2_End;
	}
	else if (nPageAbs === oSection.StartPage && nColumnAbs === oSection.StartColumn)
	{
		nStartPos = 0;
		isStart   = true;
	}
	else if (0 === nColumnAbs)
	{
		if (!oSection.Pages[nPageAbs - 1] || oSection.Pages[nPageAbs - 1].Columns.length <= 0)
			return recalcresult2_End;

		nStartPos = oSection.Pages[nPageAbs - 1].Columns[oSection.Pages[nPageAbs - 1].Columns.length - 1].EndPos;
		isStart   = false;
	}
	else
	{
		nStartPos = oSection.Pages[nPageAbs].Columns[nColumnAbs - 1].EndPos;
		isStart   = false;
	}

	// Случай, когда на предыдущей странице не убралось ни одной сноски и мы перенеслись сразу на следующую
	if (-1 === nStartPos)
	{
		nStartPos = 0;
		isStart   = true;
	}

	if (!oSection.Pages[nPageAbs])
		oSection.Pages[nPageAbs] = new CEndnoteSectionPage();

	var oColumn = new CEndnoteSectionPageColumn();
	oSection.Pages[nPageAbs].Columns[nColumnAbs] = oColumn;

	oColumn.X      = X;
	oColumn.Y      = Y;
	oColumn.XLimit = XLimit;
	oColumn.YLimit = YLimit;

	oColumn.StartPos = nStartPos;

	var _Y = Y;
	if (isStart && this.Separator)
	{
		this.Separator.PrepareRecalculateObject();
		this.Separator.SetSectionIndex(nSectionIndex);
		this.Separator.Reset(X, _Y, XLimit, YLimit);
		this.Separator.Set_StartPage(nPageAbs, nColumnAbs, nColumnsCount);
		this.Separator.Recalculate_Page(0, true);
		oColumn.SeparatorRecalculateObject = this.Separator.SaveRecalculateObject();
		oColumn.Separator = true;

		var oBounds = this.Separator.GetPageBounds(0);
		_Y += oBounds.Bottom - oBounds.Top;
		oColumn.Height = _Y - Y;
	}
	else if (!isStart && this.ContinuationSeparator)
	{
		this.ContinuationSeparator.PrepareRecalculateObject();
		this.ContinuationSeparator.SetSectionIndex(nSectionIndex);
		this.ContinuationSeparator.Reset(X, _Y, XLimit, YLimit);
		this.ContinuationSeparator.Set_StartPage(nPageAbs, nColumnAbs, nColumnsCount);
		this.ContinuationSeparator.Recalculate_Page(0, true);
		oColumn.SeparatorRecalculateObject = this.ContinuationSeparator.SaveRecalculateObject();
		oColumn.Separator = false;

		var oBounds = this.Separator.GetPageBounds(0);
		_Y += oBounds.Bottom - oBounds.Top;
		oColumn.Height = _Y - Y;
	}

	for (var nPos = nStartPos, nCount = oSection.Endnotes.length; nPos < nCount; ++nPos)
	{
		var oEndnote = oSection.Endnotes[nPos];

		oEndnote.SetSectionIndex(nSectionIndex);
		if (isStart || nPos !== nStartPos)
		{
			oEndnote.Reset(X, _Y, XLimit, YLimit);
			oEndnote.Set_StartPage(nPageAbs, nColumnAbs, nColumnsCount);
		}

		var nRelativePage = oEndnote.GetElementPageIndex(nPageAbs, nColumnAbs);
		var nRecalcResult = oEndnote.Recalculate_Page(nRelativePage, true);

		if (recalcresult2_NextPage === nRecalcResult)
		{
			if (0 === nPos && !oEndnote.IsContentOnFirstPage())
			{
				oColumn.EndPos = -1;
				return recalcresult2_NextPage;
			}
			else
			{
				oColumn.EndPos = nPos;
				oColumn.Elements.push(oEndnote);

				var oBounds = oEndnote.GetPageBounds(nRelativePage);
				_Y += oBounds.Bottom - oBounds.Top;
				oColumn.Height = _Y - Y;

				return recalcresult2_NextPage;
			}
		}
		else if (recalcresult2_CurPage === nRecalcResult)
		{
			// Такого не должно быть при расчете сносок
		}

		oColumn.EndPos = nPos;
		oColumn.Elements.push(oEndnote);

		var oBounds = oEndnote.GetPageBounds(nRelativePage);
		_Y += oBounds.Bottom - oBounds.Top;
		oColumn.Height = _Y - Y;

		if (recalcresult2_NextPage === nRecalcResult)
		{
			return recalcresult2_NextPage;
		}
	}

	return recalcresult2_End;
};
CEndnotesController.prototype.private_UpdateSection = function(oSectPr, nSectionIndex, isFinal, nPageAbs)
{
	var oPos = this.GetEndnotePrPos();

	this.Sections.length = nSectionIndex;
	this.Sections[nSectionIndex] = new CEndnoteSection();

	for (var nCurPage = 0; nCurPage <= nPageAbs; ++nCurPage)
	{
		var oPage = this.Pages[nCurPage];
		if (oPage)
		{
			for (var nEndnoteIndex = 0, nEndnotesCount = oPage.Endnotes.length; nEndnoteIndex < nEndnotesCount; ++nEndnoteIndex)
			{
				if ((oPos === section_endnote_PosDocEnd && isFinal) || (oPos === section_endnote_PosSectEnd && oPage.Endnotes[nEndnoteIndex].GetReferenceSectPr() === oSectPr))
					this.Sections[nSectionIndex].Endnotes.push(oPage.Endnotes[nEndnoteIndex]);
			}
		}
	}

	return this.Sections[nSectionIndex];
};
/**
 * Отрисовываем сноски на заданной странице.
 * @param {number} nPageAbs
 * @param {number} nSectionIndex
 * @param {CGraphics} oGraphics
 */
CEndnotesController.prototype.Draw = function(nPageAbs, nSectionIndex, oGraphics)
{
	var oSection = this.Sections[nSectionIndex];
	if (!oSection)
		return;

	var oPage = oSection.Pages[nPageAbs];
	if (!oPage)
		return;

	for (var nColumnIndex = 0, nColumnsCount = oPage.Columns.length; nColumnIndex < nColumnsCount; ++nColumnIndex)
	{
		var oColumn = oPage.Columns[nColumnIndex];
		if (!oColumn || oColumn.Elements.length <= 0)
			continue;

		if (oColumn.Separator && this.Separator && oColumn.SeparatorRecalculateObject)
		{
			this.Separator.LoadRecalculateObject(oColumn.SeparatorRecalculateObject);
			this.Separator.Draw(nPageAbs, oGraphics);
		} else if (!oColumn.Separator && this.ContinuationSeparator && oColumn.SeparatorRecalculateObject)
		{
			this.ContinuationSeparator.LoadRecalculateObject(oColumn.SeparatorRecalculateObject);
			this.ContinuationSeparator.Draw(nPageAbs, oGraphics);
		}

		for (var nEndnoteIndex = 0, nEndnotesCount = oColumn.Elements.length; nEndnoteIndex < nEndnotesCount; ++nEndnoteIndex)
		{
			var oEndnote = oColumn.Elements[nEndnoteIndex];
			var nEndnotePageIndex = oEndnote.GetElementPageIndex(nPageAbs, nColumnIndex);
			oEndnote.Draw(nEndnotePageIndex + oEndnote.StartPage, oGraphics);
		}
	}
};
CEndnotesController.prototype.GetColumnFields = function(nPageAbs, nColumnAbs, nSectionIndex)
{
	var oColumn = this.private_GetPageColumn(nPageAbs, nColumnAbs, nSectionIndex);
	if (!oColumn)
		return {X : 0, XLimit : 297};

	return {X : oColumn.X, XLimit : oColumn.XLimit};
};
CEndnotesController.prototype.StartSelection = function(X, Y, nPageAbs, oMouseEvent)
{
	if (true === this.Selection.Use)
		this.RemoveSelection();

	var oResult = this.private_GetEndnoteByXY(X, Y, nPageAbs);
	if (null === oResult)
	{
		// BAD
		this.Selection.Use = false;
		return;
	}

	this.Selection.Use   = true;
	this.Selection.Start = oResult;
	this.Selection.End   = oResult;

	this.Selection.Start.Endnote.Selection_SetStart(X, Y, this.Selection.Start.EndnotePageIndex, oMouseEvent);

	this.CurEndnote = this.Selection.Start.Endnote;

	this.Selection.Endnotes = {};
	this.Selection.Endnotes[this.Selection.Start.Endnote.GetId()] = this.Selection.Start.Endnote;
	this.Selection.Direction = 0;
};
CEndnotesController.prototype.EndSelection = function(X, Y, nPageAbs, oMouseEvent)
{
	if (true === this.IsMovingTableBorder())
	{
		this.CurEndnote.Selection_SetEnd(X, Y, nPageAbs, oMouseEvent);
		return;
	}

	var oResult = this.private_GetEndnoteByXY(X, Y, nPageAbs);
	if (null === oResult)
	{
		// BAD
		this.Selection.Use = false;
		return;
	}

	this.Selection.End = oResult;
	this.CurEndnote    = this.Selection.End.Endnote;

	var sStartId = this.Selection.Start.Endnote.GetId();
	var sEndId   = this.Selection.End.Endnote.GetId();

	// Очищаем старый селект везде кроме начальной сноски
	for (var sEndnoteId in this.Selection.Endnotes)
	{
		if (sEndnoteId !== sStartId)
			this.Selection.Endnotes[sEndnoteId].RemoveSelection();
	}

	// Новый селект
	if (this.Selection.Start.Endnote !== this.Selection.End.Endnote)
	{
		if (this.Selection.Start.Page > this.Selection.End.Page
			|| (this.Selection.Start.Page === this.Selection.End.Page
				&& (this.Selection.Start.Section > this.Selection.End.Section
					|| (this.Selection.Start.Section === this.Selection.End.Section
						&& (this.Selection.Start.Column > this.Selection.End.Column
							|| (this.Selection.Start.Column === this.Selection.End.Column
								&& this.Selection.Start.Index > this.Selection.End.Index))))))
		{
			this.Selection.Start.Endnote.Selection_SetEnd(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, 0, oMouseEvent);
			this.Selection.End.Endnote.Selection_SetStart(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, this.Selection.End.Endnote.Pages.length - 1, oMouseEvent);
			this.Selection.Direction = -1;
		}
		else
		{
			this.Selection.Start.Endnote.Selection_SetEnd(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, this.Selection.Start.Endnote.Pages.length - 1, oMouseEvent);
			this.Selection.End.Endnote.Selection_SetStart(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, 0, oMouseEvent);
			this.Selection.Direction = 1;
		}
		this.Selection.End.Endnote.Selection_SetEnd(X, Y, this.Selection.End.EndnotePageIndex, oMouseEvent);

		var oRange = this.private_GetEndnotesRange(this.Selection.Start, this.Selection.End);
		for (var sEndnoteId in oRange)
		{
			if (sEndnoteId !== sStartId && sEndnoteId !== sEndId)
			{
				var oEndnote = oRange[sEndnoteId];
				oEndnote.SelectAll();
			}
		}
		this.Selection.Endnotes = oRange;
	}
	else
	{
		this.Selection.End.Endnote.Selection_SetEnd(X, Y, this.Selection.End.EndnotePageIndex, oMouseEvent);
		this.Selection.Endnotes = {};
		this.Selection.Endnotes[this.Selection.Start.Endnote.GetId()] = this.Selection.Start.Endnote;
		this.Selection.Direction = 0;
	}
};
CEndnotesController.prototype.GetCurEndnote = function()
{
	return this.CurEndnote;
};
/**
 * Проверяем попадание в сноски на заданной странице.
 * @param X
 * @param Y
 * @param nPageAbs
 * @returns {boolean}
 */
CEndnotesController.prototype.CheckHitInEndnote = function(X, Y, nPageAbs)
{
	var isCheckBottom = this.GetEndnotePrPos() === section_endnote_PosSectEnd;

	if (true === this.IsEmptyPage(nPageAbs))
		return false;

	var oPage = this.Pages[nPageAbs];
	for (var nIndex = 0, nCount = oPage.Sections.length; nIndex < nCount; ++nIndex)
	{
		var oSection = this.Sections[oPage.Sections[nIndex]];
		if (!oSection)
			continue;

		var _isCheckBottom = isCheckBottom;
		if (!_isCheckBottom && oPage.Sections[nIndex] === this.Sections.length - 1 && nPageAbs === this.Pages.length - 1)
			_isCheckBottom = false;

		var oSectionPage = oSection.Pages[nPageAbs];

		var oColumn = null;
		var nFindedColumnIndex = 0, nColumnsCount = oSectionPage.Columns.length;
		for (var nColumnIndex = 0; nColumnIndex < nColumnsCount; ++nColumnIndex)
		{
			if (nColumnIndex < nColumnsCount - 1)
			{
				if (X < (oSectionPage.Columns[nColumnIndex].XLimit + oSectionPage.Columns[nColumnIndex + 1].X) / 2)
				{
					oColumn            = oSectionPage.Columns[nColumnIndex];
					nFindedColumnIndex = nColumnIndex;
					break;
				}
			}
			else
			{
				oColumn            = oSectionPage.Columns[nColumnIndex];
				nFindedColumnIndex = nColumnIndex;
			}
		}

		if (!oColumn || nFindedColumnIndex >= nColumnsCount)
			return false;

		for (var nElementIndex = 0, nElementsCount = oColumn.Elements.length; nElementIndex < nElementsCount; ++nElementIndex)
		{
			var oEndnote          = oColumn.Elements[nElementIndex];
			var nEndnotePageIndex = oEndnote.GetElementPageIndex(nPageAbs, nFindedColumnIndex);
			var oBounds           = oEndnote.GetPageBounds(nEndnotePageIndex);

			if (oBounds.Top <= Y && (!isCheckBottom || oBounds.Bottom >= Y))
				return true;
		}
	}

	return false;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CEndnotesController.prototype.private_GetPageColumn = function(nPageAbs, nColumnAbs, nSectionAbs)
{
	var oSection = this.Sections[nSectionAbs];
	if (!oSection)
		return null;

	var oPage = oSection.Pages[nPageAbs];
	if (!oPage)
		return null;

	var oColumn = oPage.Columns[nColumnAbs];
	if (!oColumn)
		return null;

	return oColumn;
};
CEndnotesController.prototype.private_GetEndnoteOnPageByXY = function(X, Y, nPageAbs)
{
	if (true === this.IsEmptyPage(nPageAbs))
		return null;

	var oPage = this.Pages[nPageAbs];
	for (var nSectionIndex = oPage.Sections.length; nSectionIndex >= 0; --nSectionIndex)
	{
		var oSection = this.Sections[oPage.Sections[nSectionIndex]];
		if (!oSection)
			continue;

		var oSectionPage = oSection.Pages[nPageAbs];
		if (!oSectionPage)
			continue;

		var oColumn      = null;
		var nColumnIndex = 0;
		for (var nColumnsCount = oSectionPage.Columns.length; nColumnIndex < nColumnsCount; ++nColumnIndex)
		{
			if (nColumnIndex < nColumnsCount - 1)
			{
				if (X < (oSectionPage.Columns[nColumnIndex].XLimit + oSectionPage.Columns[nColumnIndex + 1].X) / 2)
				{
					oColumn = oSectionPage.Columns[nColumnIndex];
					break;
				}
			}
			else
			{
				oColumn = oSectionPage.Columns[nColumnIndex];
				break;
			}
		}

		if (!oColumn)
			continue;

		if (oColumn.Elements.length <= 0)
		{
			var nCurColumnIndex = nColumnIndex - 1;
			while (nCurColumnIndex >= 0)
			{
				if (oSectionPage.Columns[nCurColumnIndex].Elements.length > 0)
				{
					oColumn      = oSectionPage.Columns[nCurColumnIndex];
					nColumnIndex = nCurColumnIndex;
					break;
				}
				nCurColumnIndex--;
			}

			if (nCurColumnIndex < 0)
			{
				nCurColumnIndex = nColumnIndex + 1;
				while (nCurColumnIndex <= oSectionPage.Columns.length - 1)
				{
					if (oSectionPage.Columns[nCurColumnIndex].Elements.length > 0)
					{
						oColumn      = oSectionPage.Columns[nCurColumnIndex];
						nColumnIndex = nCurColumnIndex;
						break;
					}
					nCurColumnIndex++;
				}
			}
		}

		if (!oColumn)
			continue;

		for (var nIndex = oColumn.Elements.length - 1; nIndex >= 0; --nIndex)
		{
			var oEndnote = oColumn.Elements[nIndex];

			var nElementPageIndex = oEndnote.GetElementPageIndex(nPageAbs, nColumnIndex);
			var oBounds           = oEndnote.GetPageBounds(nElementPageIndex);

			if (oBounds.Top <= Y || (0 === nIndex && 0 === nSectionIndex))
				return {
					Endnote          : oEndnote,
					Index            : nIndex,
					Section          : oPage.Sections[nSectionIndex],
					Page             : nPageAbs,
					Column           : nColumnIndex,
					EndnotePageIndex : nElementPageIndex
				};
		}
	}

	return null;
};
CEndnotesController.prototype.private_GetEndnoteByXY = function(X, Y, nPageAbs)
{
	var oResult = this.private_GetEndnoteOnPageByXY(X, Y, nPageAbs);
	if (null !== oResult)
		return oResult;

	var nCurPage = PageAbs - 1;
	while (nCurPage >= 0)
	{
		oResult = this.private_GetEndnoteOnPageByXY(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, nCurPage);
		if (null !== oResult)
			return oResult;

		nCurPage--;
	}

	nCurPage = PageAbs + 1;
	while (nCurPage < this.Pages.length)
	{
		oResult = this.private_GetEndnoteOnPageByXY(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, nCurPage);
		if (null !== oResult)
			return oResult;

		nCurPage++;
	}

	return null;
};
CEndnotesController.prototype.private_GetEndnotesRange = function(Start, End)
{
	var oResult = {};

	if (Start.Page > End.Page || (Start.Page === End.Page && (Start.Section > End.Section || (Start.Section === End.Section && (Start.Column > End.Column || (Start.Column === End.Column && Start.Index > End.Index))))))
	{
		var Temp = Start;
		Start    = End;
		End      = Temp;
	}

	if (Start.Page === End.Page)
	{
		this.private_GetEndnotesOnPage(Start.Page, Start.Section, Start.Column, Start.Index, End.Section, End.Column, End.Index, oResult);
	}
	else
	{
		this.private_GetEndnotesOnPage(Start.Page, Start.Section, Start.Column, Start.Index, -1, -1, -1, oResult);

		for (var nCurPage = Start.Page + 1; nCurPage <= End.Page - 1; ++nCurPage)
		{
			this.private_GetEndnotesOnPage(nCurPage, -1, -1, -1, -1, -1, -1, oResult);
		}

		this.private_GetEndnotesOnPage(End.Page, -1, -1, -1, End.Section, End.Column, End.Index, oResult);
	}

	return oResult;
};
CEndnotesController.prototype.private_GetEndnotesOnPage = function(nPageAbs, nSectionStart, nColumnStart, nStartIndex, nSectionEnd, nColumnEnd, nEndIndex, oEndnotes)
{
	var _nSectionStart = nSectionStart;
	var _nSectionEnd   = nSectionEnd;

	if (-1 === nSectionStart || -1 === nSectionEnd)
	{
		var oPage = this.Pages[nPageAbs];
		if (!oPage || oPage.Sections.length <= 0)
			return;

		if (-1 === nSectionStart)
			_nSectionStart = oPage.Sections[0];

		if (-1 === nSectionEnd)
			_nSectionEnd = oPage.Sections[oPage.Sections.length - 1];
	}

	for (var nSectionIndex = _nSectionStart; nSectionIndex <= _nSectionEnd; ++nSectionIndex)
	{
		var oSection = this.Sections[nSectionIndex];
		if (!oSection)
			return;

		var oSectionPage = oSection.Pages[nPageAbs];
		if (!oSectionPage)
			return;

		var _nColumnStart = -1 === nColumnStart ? 0 : nColumnStart;
		var _nColumnEnd   = -1 === nColumnEnd ? oSectionPage.Columns.length - 1 : nColumnEnd;

		var _nStartIndex = -1 === nColumnStart || -1 === nStartIndex ? 0 : nStartIndex;
		var _nEndIndex   = -1 === nColumnEnd || -1 === nEndIndex ? oSectionPage.Columns[_nColumnEnd].Elements.length - 1 : nEndIndex;

		for (var nColIndex = _nColumnStart; nColIndex <= _nColumnEnd; ++nColIndex)
		{
			var nSIndex = (nSectionIndex === _nSectionStart && nColIndex === _nColumnStart) ? _nStartIndex : 0;
			var nEIndex = (nSectionIndex === _nSectionEnd && nColIndex === _nColumnEnd) ? _nEndIndex : oSectionPage.Columns[nColIndex].Elements.length - 1;

			this.private_GetEndnotesOnPageColumn(nPageAbs, nColIndex, _nSectionStart, nSIndex, nEIndex, oEndnotes);
		}
	}
};
CEndnotesController.prototype.private_GetEndnotesOnPageColumn = function(nPageAbs, nColumnAbs, nSectionAbs, nStartIndex, nEndIndex, oEndnotes)
{
	var oColumn = this.private_GetPageColumn(nPageAbs, nColumnAbs, nSectionAbs);

	var _StartIndex = -1 === nStartIndex ? 0 : nStartIndex;
	var _EndIndex   = -1 === nEndIndex ? oColumn.Elements.length - 1 : nEndIndex;

	for (var nIndex = _StartIndex; nIndex <= _EndIndex; ++nIndex)
	{
		var oEndnote = oColumn.Elements[nIndex];
		oEndnotes[oEndnote.GetId()] = oEndnote;
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controller area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CEndnotesController.prototype.CanUpdateTarget = function()
{
	return true;
};
CEndnotesController.prototype.RecalculateCurPos = function(bUpdateX, bUpdateY)
{
	if (this.CurEndnote)
		return this.CurEndnote.RecalculateCurPos(bUpdateX, bUpdateY);

	return {X : 0, Y : 0, Height : 0, PageNum : 0, Internal : {Line : 0, Page : 0, Range : 0}, Transform : null};
};
CEndnotesController.prototype.GetCurPage = function()
{
	if (this.CurEndnote)
		return this.CurEndnote.Get_StartPage_Absolute();

	return -1;
};


CEndnotesController.prototype.RemoveSelection = function(bNoCheckDrawing)
{
	if (true === this.Selection.Use)
	{
		for (var sId in this.Selection.Endnotes)
		{
			this.Selection.Endnotes[sId].RemoveSelection(bNoCheckDrawing);
		}

		this.Selection.Use = false;
	}

	this.Selection.Endnotes = {};
	if (this.CurEndnote)
		this.Selection.Endnotes[this.CurEndnote.GetId()] = this.CurEndnote;
};
CEndnotesController.prototype.IsSelectionEmpty = function(bCheckHidden)
{
	if (true !== this.IsSelectionUse())
		return true;

	var oEndnote = null;
	for (var sId in this.Selection.Endnotes)
	{
		if (null === oEndnote)
			oEndnote = this.Selection.Endnotes[sId];
		else if (oEndnote !== this.Selection.Endnotes[sId])
			return false;
	}

	if (null === oEndnote)
		return true;

	return oEndnote.IsSelectionEmpty(bCheckHidden);
};

CEndnotesController.prototype.IsSelectionUse = function()
{
	return this.Selection.Use;
};

CEndnotesController.prototype.DrawSelectionOnPage = function(nPageAbs)
{
	if (true !== this.Selection.Use || true === this.IsEmptyPage(nPageAbs))
		return;

	var oPage = this.Pages[nPageAbs];
	if (!oPage)
		return;


	for (var nSectionIndex = 0, nSectionsCount = oPage.Sections.length; nSectionIndex < nSectionsCount; ++nSectionIndex)
	{
		var oSection = this.Sections[oPage.Sections[nSectionIndex]];
		if (!oSection)
			continue;

		var oSectionPage = oSection.Pages[nPageAbs];
		if (!oSectionPage)
			continue;

		for (var nColumnIndex = 0, nColumnsCount = oSectionPage.Columns.length; nColumnIndex < nColumnsCount; ++nColumnIndex)
		{
			var oColumn = oSectionPage.Columns[nColumnIndex];
			for (var nIndex = 0, nCount = oColumn.Elements.length; nIndex < nCount; ++nIndex)
			{
				var oEndnote = oColumn.Elements[nIndex];
				if (oEndnote === this.Selection.Endnotes[oEndnote.GetId()])
				{
					var nEndnotePageIndex = oEndnote.GetElementPageIndex(nPageAbs, nColumnIndex);
					oEndnote.DrawSelectionOnPage(nEndnotePageIndex);
				}
			}
		}
	}
};
CEndnotesController.prototype.UpdateSelectionState = CFootnotesController.prototype.UpdateSelectionState;

/**
 * Класс регистрирующий концевые сноски на странице
 * и номера секций, сноски которых были пересчитаны на данной странице
 * @constructor
 */
function CEndnotePage()
{
	this.Endnotes = [];
	this.Sections = [];
}
CEndnotePage.prototype.Reset = function()
{
	this.Endnotes = [];
	this.Sections = [];
};
CEndnotePage.prototype.AddEndnotes = function(arrEndnotes)
{
	this.Endnotes = this.Endnotes.concat(arrEndnotes)
};
CEndnotePage.prototype.AddSection = function(nSectionIndex)
{
	this.Sections.push(nSectionIndex);
};

function CEndnoteSection()
{
	this.Endnotes    = [];
	this.StartPage   = 0;
	this.StartColumn = 0;

	this.Pages = [];

	this.SeparatorRecalculateObject = null;
	this.Separator                  = false; // true - Separator
}

function CEndnoteSectionPage()
{
	this.Columns = [];
}

function CEndnoteSectionPageColumn()
{
	this.Elements = [];
	this.StartPos = 0;
	this.EndPos   = -1;

	this.X      = 0;
	this.XLimit = 0;
	this.Y      = 0;
	this.YLimit = 0;
	this.Height = 0;

	this.ContinuationSeparatorRecalculateObject = null;
}
