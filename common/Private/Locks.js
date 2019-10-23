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

// Import
var c_oAscSdtLockType = Asc.c_oAscSdtLockType;


CTable.prototype.Document_Is_SelectionLocked = function(CheckType, bCheckInner)
{
	var bCheckContentControl = false;
    switch (CheckType)
    {
        case AscCommon.changestype_Paragraph_Content:
        case AscCommon.changestype_Paragraph_Properties:
		case AscCommon.changestype_Paragraph_AddText:
		case AscCommon.changestype_Paragraph_TextProperties:
		case AscCommon.changestype_ContentControl_Add:
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Delete:
        case AscCommon.changestype_Image_Properties:
        {
			if (this.IsCellSelection())
			{
				var arrCells = this.GetSelectionArray();
				var Count = arrCells.length;
				for (var Index = 0; Index < Count; Index++)
				{
					var Pos  = arrCells[Index];
					var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

					Cell.Content.Set_ApplyToAll(true);
					Cell.Content.Document_Is_SelectionLocked(CheckType);
					Cell.Content.Set_ApplyToAll(false);
				}
			}
			else if (this.CurCell)
			{
				this.CurCell.Content.Document_Is_SelectionLocked(CheckType);
			}

            bCheckContentControl = true;
            break;
        }
        case AscCommon.changestype_Remove:
        {
			if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type))
			{
				this.Lock.Check(this.Get_Id());

				var arrCells = this.Internal_Get_SelectionArray();
				for (var nIndex = 0, nCellsCount = arrCells.length; nIndex < nCellsCount; ++nIndex)
				{
					var Pos  = arrCells[nIndex];
					var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
					Cell.Content.CheckContentControlDeletingLock();
				}
			}
			else
			{
				this.CurCell.Content.Document_Is_SelectionLocked(CheckType);
			}

			bCheckContentControl = true;
            break;
        }
        case AscCommon.changestype_Table_Properties:
        {
            if ( false != bCheckInner && true === this.IsInnerTable() )
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
            else
                this.Lock.Check( this.Get_Id() );

			bCheckContentControl = true;
            break;
        }
        case AscCommon.changestype_Table_RemoveCells:
        {
            /*
             // Проверяем все ячейки
             if ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type )
             {
             var Count = this.Selection.Data.length;
             for ( var Index = 0; Index < Count; Index++ )
             {
             var Pos = this.Selection.Data[Index];
             var Cell = this.Content[Pos.Row].Get_Cell( Pos.Cell );
             Cell.Content.Document_Is_SelectionLocked( CheckType );
             }
             }
             else
             this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
             */

            // Проверяем саму таблицу

            if ( false != bCheckInner && true === this.IsInnerTable() )
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
            else
                this.Lock.Check( this.Get_Id() );

			bCheckContentControl = true;
            break;
        }
        case AscCommon.changestype_Document_SectPr:
        case AscCommon.changestype_HdrFtr:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }

	if (bCheckContentControl && this.Parent && this.Parent.CheckContentControlEditingLock)
		this.Parent.CheckContentControlEditingLock();
};
CTable.prototype.CheckContentControlDeletingLock = function()
{
	for (var nCurRow = 0, nRowsCount = this.Content.length; nCurRow < nRowsCount; ++nCurRow)
	{
		var oRow = this.Content[nCurRow];
		for (var nCurCell = 0, nCellsCount = oRow.Get_CellsCount(); nCurCell < nCellsCount; ++nCurCell)
		{
			oRow.Get_Cell(nCurCell).Content.CheckContentControlDeletingLock();
		}
	}
};
CBlockLevelSdt.prototype.Document_Is_SelectionLocked = function(CheckType, bCheckInner)
{
	if (AscCommon.changestype_Document_Content_Add === CheckType && this.Content.IsCursorAtBegin())
		return AscCommon.CollaborativeEditing.Add_CheckLock(false);

	var isCheckContentControlLock = this.LogicDocument ? this.LogicDocument.IsCheckContentControlsLock() : true;

	if (CheckType === AscCommon.changestype_Paragraph_TextProperties)
	{
		this.SkipCheckLockForCheckBox(true);
		if (!this.CanBeEdited())
			this.Lock.Check(this.GetId());
		this.SkipCheckLockForCheckBox(false);


		isCheckContentControlLock = false;
	}

	var nContentControlLock = this.GetContentControlLock();

	if (AscCommon.changestype_ContentControl_Properties === CheckType)
		return this.Lock.Check(this.GetId());

	if (AscCommon.changestype_ContentControl_Remove === CheckType)
		this.Lock.Check(this.GetId());

	if (isCheckContentControlLock
		&& (AscCommon.changestype_Paragraph_Content === CheckType
		|| AscCommon.changestype_Paragraph_AddText === CheckType
		|| AscCommon.changestype_ContentControl_Add === CheckType
		|| AscCommon.changestype_Remove === CheckType
		|| AscCommon.changestype_Delete === CheckType
		|| AscCommon.changestype_Document_Content === CheckType
		|| AscCommon.changestype_Document_Content_Add === CheckType
		|| AscCommon.changestype_ContentControl_Remove === CheckType)
		&& ((this.IsSelectionUse()
		&& this.IsSelectedAll())
		|| this.IsApplyToAll()))
	{
		var bSelectedOnlyThis = false;
		// Если это происходит на добавлении текста, тогда проверяем, что выделен только данный элемент

		if (AscCommon.changestype_Remove !== CheckType && AscCommon.changestype_Delete !== CheckType)
		{
			var oInfo = this.LogicDocument.GetSelectedElementsInfo();
			bSelectedOnlyThis = oInfo.GetBlockLevelSdt() === this ? true : false;
		}

		if (c_oAscSdtLockType.SdtContentLocked === nContentControlLock
			|| (c_oAscSdtLockType.SdtLocked === nContentControlLock && true !== bSelectedOnlyThis)
			|| (!this.CanBeEdited() && true === bSelectedOnlyThis))
		{
			return AscCommon.CollaborativeEditing.Add_CheckLock(true);
		}
		else
		{
			AscCommon.CollaborativeEditing.AddContentControlForSkippingOnCheckEditingLock(this);
			this.Content.Document_Is_SelectionLocked(CheckType, bCheckInner);
			AscCommon.CollaborativeEditing.RemoveContentControlForSkippingOnCheckEditingLock(this);
			return;
		}
	}
	else if (isCheckContentControlLock
		&& !this.CanBeEdited())
	{
		return AscCommon.CollaborativeEditing.Add_CheckLock(true);
	}
	else
	{
		return this.Content.Document_Is_SelectionLocked(CheckType, bCheckInner);
	}
};
CBlockLevelSdt.prototype.CheckContentControlEditingLock = function()
{
	var isCheckContentControlLock = this.LogicDocument ? this.LogicDocument.IsCheckContentControlsLock() : true;
	if (!isCheckContentControlLock)
		return;

	var nContentControlLock = this.GetContentControlLock();

	if (false === AscCommon.CollaborativeEditing.IsNeedToSkipContentControlOnCheckEditingLock(this)
		&& (c_oAscSdtLockType.SdtContentLocked === nContentControlLock || c_oAscSdtLockType.ContentLocked === nContentControlLock))
		return AscCommon.CollaborativeEditing.Add_CheckLock(true);

	if (this.Parent && this.Parent.CheckContentControlEditingLock)
		this.Parent.CheckContentControlEditingLock();
};
CBlockLevelSdt.prototype.CheckContentControlDeletingLock = function()
{
	var isCheckContentControlLock = this.LogicDocument ? this.LogicDocument.IsCheckContentControlsLock() : true;
	if (!isCheckContentControlLock)
		return;

	var nContentControlLock = this.GetContentControlLock();

	if (c_oAscSdtLockType.SdtContentLocked === nContentControlLock || c_oAscSdtLockType.SdtLocked === nContentControlLock)
		return AscCommon.CollaborativeEditing.Add_CheckLock(true);

	this.Content.CheckContentControlEditingLock();
};
CInlineLevelSdt.prototype.Document_Is_SelectionLocked = function(CheckType)
{
	if (CheckType === AscCommon.changestype_Paragraph_TextProperties)
	{
		this.SkipCheckLockForCheckBox(true);
		if (!this.CanBeEdited())
			AscCommon.CollaborativeEditing.Add_CheckLock(true);
		this.SkipCheckLockForCheckBox(false);

		return;
	}

	var isCheckContentControlLock = this.Paragraph && this.Paragraph.LogicDocument ? this.Paragraph.LogicDocument.IsCheckContentControlsLock() : true;

	if (!isCheckContentControlLock)
		return;

	var nContentControlLock = this.GetContentControlLock();

	if ((AscCommon.changestype_Paragraph_Content === CheckType
		|| AscCommon.changestype_Paragraph_AddText === CheckType
		|| AscCommon.changestype_ContentControl_Add === CheckType
		|| AscCommon.changestype_Remove === CheckType
		|| AscCommon.changestype_Delete === CheckType
		|| AscCommon.changestype_Document_Content === CheckType
		|| AscCommon.changestype_Document_Content_Add === CheckType)
		&& this.IsSelectionUse()
		&& this.IsSelectedAll())
	{
		var bSelectedOnlyThis = false;

		// Если это происходит на добавлении текста, тогда проверяем, что выделен только данный элемент
		if (AscCommon.changestype_Remove !== CheckType && AscCommon.changestype_Delete !== CheckType)
		{
			var oInfo = this.Paragraph.LogicDocument.GetSelectedElementsInfo();
			bSelectedOnlyThis = oInfo.GetInlineLevelSdt() === this ? true : false;
		}

		if (c_oAscSdtLockType.SdtContentLocked === nContentControlLock
			|| (c_oAscSdtLockType.SdtLocked === nContentControlLock && true !== bSelectedOnlyThis)
			|| (!this.CanBeEdited() && true === bSelectedOnlyThis))
		{
			return AscCommon.CollaborativeEditing.Add_CheckLock(true);
		}
	}
	else if ((AscCommon.changestype_Paragraph_Content === CheckType
		|| AscCommon.changestype_Paragraph_AddText === CheckType
		|| AscCommon.changestype_ContentControl_Add === CheckType
		|| AscCommon.changestype_Remove === CheckType
		|| AscCommon.changestype_Delete === CheckType
		|| AscCommon.changestype_Document_Content === CheckType
		|| AscCommon.changestype_Document_Content_Add === CheckType
		|| AscCommon.changestype_Image_Properties === CheckType)
		&& !this.CanBeEdited())
	{
		return AscCommon.CollaborativeEditing.Add_CheckLock(true);
	}
};
