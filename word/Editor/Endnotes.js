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
 * Создаем новую сноску
 * @returns {CFootEndnote}
 */
CEndnotesController.prototype.CreateFootnote = function()
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
CEndnotesController.prototype.AddFootnote = function(oEndnote)
{
	this.Footnote[oEndnote.GetId()] = oEndnote;
	this.LogicDocument.GetHistory().Add(new CChangesEndnotesAddEndnote(this, oEndnote.GetId()));
};
