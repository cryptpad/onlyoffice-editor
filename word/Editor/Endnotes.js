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

	// Специальные сноски
	this.ContinuationNotice    = null;
	this.ContinuationSeparator = null;
	this.Separator             = null;

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
/**
 * Проверяем, используется заданная сноска в документе.
 * @param {string} sFootnoteId
 * @param {CFootEndnote.array} arrEndnotesList
 * @returns {boolean}
 */
CEndnotesController.prototype.Is_UseInDocument = function(sFootnoteId, arrEndnotesList)
{
	// TODO: Реализовать
	return true;
};
