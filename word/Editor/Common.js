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

// Функция копирует объект или массив. (Обычное равенство в javascript приравнивает указатели)
function Common_CopyObj(Obj)
{
    if( !Obj || !('object' == typeof(Obj) || 'array' == typeof(Obj)) )
    {
        return Obj;
    }

    var c = 'function' === typeof Obj.pop ? [] : {};
    var p, v;
    for(p in Obj)
    {
        if(Obj.hasOwnProperty(p))
        {
            v = Obj[p];
            if(v && 'object' === typeof v )
            {
                c[p] = Common_CopyObj(v);
            }
            else
            {
                c[p] = v;
            }
        }
    }
    return c;
}

/**
 * Класс для обркботки конвертации текста в таблицу
 * @constructor
 */
function CTextToTableEngine()
{
	this.SeparatorType = Asc.c_oAscTextToTableSeparator.Paragraph;
	this.Separator     = 0;
	this.MaxCols       = 0;

	this.Mode = 0; // Режим, 0 - вычисляем размер, 1 - проверяем типы разделителей

	this.Cols    = 0;
	this.Rows    = 0;
	this.CurCols = 0;

	this.Tab           = true;
	this.Semicolon     = true;
	this.ParaTab       = false;
	this.ParaSemicolon = false;
}
CTextToTableEngine.prototype.Reset = function()
{
	this.Cols    = 0;
	this.Rows    = 0;
	this.CurCols = 0;

	this.Tab           = true;
	this.Semicolon     = true;
	this.ParaTab       = false;
	this.ParaSemicolon = false;
};
CTextToTableEngine.prototype.GetSeparatorType = function()
{
	return this.Type;
};
CTextToTableEngine.prototype.GetSeparator = function()
{
	return this.Separator;
};
CTextToTableEngine.prototype.AddItem = function()
{
	if (this.IsParagraphSeparator())
		return;

	if (this.MaxCols)
	{
		if (this.CurCols < this.MaxCols)
		{
			this.CurCols++;
		}
		else
		{
			if (this.Cols < this.CurCols)
				this.Cols = this.CurCols;

			this.Rows++;
			this.CurCols = 0;
		}
	}
	else
	{
		this.CurCols++;
	}
};
CTextToTableEngine.prototype.OnStartParagraph = function()
{
	if (this.IsCalculateTableSizeMode())
	{
		this.AddItem();
	}
	else if (this.IsCheckSeparatorMode())
	{
		this.ParaTab       = false;
		this.ParaSemicolon = false;
	}
};
CTextToTableEngine.prototype.OnEndParagraph = function()
{
	if (this.IsCalculateTableSizeMode())
	{
		if (this.IsParagraphSeparator())
		{
			if (this.MaxCols)
			{
				if (0 === this.CurCols)
					this.Rows++;

				if (this.CurCols < this.MaxCols)
				{
					this.CurCols++;
				}
				else
				{
					if (this.Cols < this.CurCols)
						this.Cols = this.CurCols;

					this.Rows++;
					this.CurCols = 1;
				}
			}
			else
			{
				this.Rows++;
			}
		}
		else
		{
			if (this.CurCols)
			{
				if (this.Cols < this.CurCols)
					this.Cols = this.CurCols;

				this.Rows++;
				this.CurCols = 0;
			}
		}
	}
	else if (this.IsCheckSeparatorMode())
	{
		this.Tab       = this.Tab && this.ParaTab;
		this.Semicolon = this.Semicolon && this.ParaSemicolon;
	}
};
CTextToTableEngine.prototype.IsParagraphSeparator = function()
{
	return this.SeparatorType === Asc.c_oAscTextToTableSeparator.Paragraph;
};
CTextToTableEngine.prototype.IsSymbolSeparator = function(nCharCode)
{
	return (this.SeparatorType === Asc.c_oAscTextToTableSeparator.Symbol && this.Separator === nCharCode);
};
CTextToTableEngine.prototype.IsTabSeparator = function()
{
	return this.SeparatorType === Asc.c_oAscTextToTableSeparator.Tab;
};
CTextToTableEngine.prototype.SetCalculateTableSizeMode = function(nSeparatorType, nSeparator, nMaxCols)
{
	this.Mode = 0;

	this.SeparatorType = undefined !== nSeparatorType ? nSeparatorType : Asc.c_oAscTextToTableSeparator.Paragraph;
	this.Separator     = undefined !== nSeparator ? nSeparator : 0;
	this.MaxCols       = undefined !== nMaxCols ? nMaxCols : 0;
};
CTextToTableEngine.prototype.SetCheckSeparatorMode = function()
{
	this.Mode = 1;
};
CTextToTableEngine.prototype.IsCalculateTableSizeMode = function()
{
	return (0 === this.Mode);
};
CTextToTableEngine.prototype.IsCheckSeparatorMode = function()
{
	return (1 === this.Mode);
};
CTextToTableEngine.prototype.AddTab = function()
{
	this.ParaTab = true;
};
CTextToTableEngine.prototype.AddSemicolon = function()
{
	this.ParaSemicolon = true;
};
CTextToTableEngine.prototype.HaveTab = function()
{
	return this.Tab;
};
CTextToTableEngine.prototype.HaveSemicolon = function()
{
	return this.Semicolon;
};

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CTextToTableEngine = CTextToTableEngine;
