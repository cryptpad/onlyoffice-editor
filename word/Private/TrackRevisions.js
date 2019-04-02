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

// Import
var changestype_2_ElementsArray_and_Type = AscCommon.changestype_2_ElementsArray_and_Type;
var History = AscCommon.History;

//----------------------------------------------------------------------------------------------------------------------
// Работаем с рецензированием
//----------------------------------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.asc_SetTrackRevisions = function(bTrack)
{
	var oLogicDocument = this.WordControl.m_oLogicDocument;
	if (!oLogicDocument)
		return;

	return oLogicDocument.SetTrackRevisions(bTrack);
};
Asc['asc_docs_api'].prototype.asc_IsTrackRevisions = function()
{
	var oLogicDocument = this.WordControl.m_oLogicDocument;
	if (!oLogicDocument)
		return false;

    return oLogicDocument.IsTrackRevisions();
};
Asc['asc_docs_api'].prototype.sync_BeginCatchRevisionsChanges = function()
{
    this.RevisionChangesStack = [];
};
Asc['asc_docs_api'].prototype.sync_EndCatchRevisionsChanges = function()
{
    this.sendEvent("asc_onShowRevisionsChange", this.RevisionChangesStack);
};
Asc['asc_docs_api'].prototype.asc_GetRevisionsChangesStack = function()
{
	return this.RevisionChangesStack;
};
Asc['asc_docs_api'].prototype.sync_AddRevisionsChange = function(Change)
{
    this.RevisionChangesStack.push(Change);
};
Asc['asc_docs_api'].prototype.asc_AcceptChanges = function(oChange)
{
	if (oChange)
		this.WordControl.m_oLogicDocument.AcceptRevisionChange(oChange);
	else
		this.WordControl.m_oLogicDocument.AcceptRevisionChangesBySelection();
};
Asc['asc_docs_api'].prototype.asc_RejectChanges = function(oChange)
{
	if (oChange)
		this.WordControl.m_oLogicDocument.RejectRevisionChange(oChange);
	else
		this.WordControl.m_oLogicDocument.RejectRevisionChangesBySelection();
};
Asc['asc_docs_api'].prototype.asc_HaveRevisionsChanges = function(isCheckOwnChanges)
{
	if (!this.WordControl.m_oLogicDocument)
		return false;
    return this.WordControl.m_oLogicDocument.HaveRevisionChanges(isCheckOwnChanges);
};
Asc['asc_docs_api'].prototype.asc_HaveNewRevisionsChanges = function()
{
    return this.asc_HaveRevisionsChanges();
};
Asc['asc_docs_api'].prototype.asc_GetNextRevisionsChange = function()
{
    return this.WordControl.m_oLogicDocument.GetNextRevisionChange();
};
Asc['asc_docs_api'].prototype.asc_GetPrevRevisionsChange = function()
{
    return this.WordControl.m_oLogicDocument.GetPrevRevisionChange();
};
Asc['asc_docs_api'].prototype.sync_UpdateRevisionsChangesPosition = function(X, Y)
{
    this.sendEvent("asc_onUpdateRevisionsChangesPosition", X, Y);
};
Asc['asc_docs_api'].prototype.asc_AcceptAllChanges = function()
{
	this.WordControl.m_oLogicDocument.AcceptAllRevisionChanges();
};
Asc['asc_docs_api'].prototype.asc_RejectAllChanges = function()
{
	this.WordControl.m_oLogicDocument.RejectAllRevisionChanges();
};
Asc['asc_docs_api'].prototype.asc_GetTrackRevisionsReportByAuthors = function()
{
	var oResult = {};
	var oAllChanges = this.WordControl.m_oLogicDocument.TrackRevisionsManager.Get_AllChanges();
	for (var ParaId in oAllChanges)
	{
		var arrChanges = oAllChanges[ParaId];
		for (var nIndex = 0, nCount = arrChanges.length; nIndex < nCount; ++nIndex)
		{
			var oChange   = arrChanges[nIndex];
			var sUserName = oChange.get_UserName();
			var nDateTime = oChange.get_DateTime();

			if (!oResult[sUserName])
				oResult[sUserName] = [];

			var arrUserChanges = oResult[sUserName];

			var nPos = 0;
			var nLen = arrUserChanges.length;
			while (nPos < nLen)
			{
				if (nDateTime < arrUserChanges[nPos].get_DateTime())
					break;

				nPos++;
			}

			arrUserChanges.splice(nPos, 0, oChange);
		}
	}

	return oResult;
};

Asc['asc_docs_api'].prototype['asc_SetTrackRevisions']                = Asc['asc_docs_api'].prototype.asc_SetTrackRevisions;
Asc['asc_docs_api'].prototype['asc_IsTrackRevisions']                 = Asc['asc_docs_api'].prototype.asc_IsTrackRevisions;
Asc['asc_docs_api'].prototype['sync_BeginCatchRevisionsChanges']      = Asc['asc_docs_api'].prototype.sync_BeginCatchRevisionsChanges;
Asc['asc_docs_api'].prototype['sync_EndCatchRevisionsChanges']        = Asc['asc_docs_api'].prototype.sync_EndCatchRevisionsChanges;
Asc['asc_docs_api'].prototype['sync_AddRevisionsChange']              = Asc['asc_docs_api'].prototype.sync_AddRevisionsChange;
Asc['asc_docs_api'].prototype['asc_AcceptChanges']                    = Asc['asc_docs_api'].prototype.asc_AcceptChanges;
Asc['asc_docs_api'].prototype['asc_RejectChanges']                    = Asc['asc_docs_api'].prototype.asc_RejectChanges;
Asc['asc_docs_api'].prototype['asc_HaveRevisionsChanges']             = Asc['asc_docs_api'].prototype.asc_HaveRevisionsChanges;
Asc['asc_docs_api'].prototype['asc_HaveNewRevisionsChanges']          = Asc['asc_docs_api'].prototype.asc_HaveNewRevisionsChanges;
Asc['asc_docs_api'].prototype['asc_GetNextRevisionsChange']           = Asc['asc_docs_api'].prototype.asc_GetNextRevisionsChange;
Asc['asc_docs_api'].prototype['asc_GetPrevRevisionsChange']           = Asc['asc_docs_api'].prototype.asc_GetPrevRevisionsChange;
Asc['asc_docs_api'].prototype['sync_UpdateRevisionsChangesPosition']  = Asc['asc_docs_api'].prototype.sync_UpdateRevisionsChangesPosition;
Asc['asc_docs_api'].prototype['asc_AcceptAllChanges']                 = Asc['asc_docs_api'].prototype.asc_AcceptAllChanges;
Asc['asc_docs_api'].prototype['asc_RejectAllChanges']                 = Asc['asc_docs_api'].prototype.asc_RejectAllChanges;
Asc['asc_docs_api'].prototype['asc_GetTrackRevisionsReportByAuthors'] = Asc['asc_docs_api'].prototype.asc_GetTrackRevisionsReportByAuthors;
//----------------------------------------------------------------------------------------------------------------------
// CDocument
//----------------------------------------------------------------------------------------------------------------------
CDocument.prototype.SetTrackRevisions = function(bTrack)
{
    this.TrackRevisions = bTrack;
};
CDocument.prototype.ContinueTrackRevisions = function()
{
    this.TrackRevisionsManager.ContinueTrackRevisions();
};
CDocument.prototype.GetNextRevisionChange = function()
{
	this.TrackRevisionsManager.ContinueTrackRevisions();
	var oChange = this.TrackRevisionsManager.GetNextChange();
	if (oChange)
	{
		this.RemoveSelection();
		this.private_SelectRevisionChange(oChange);
		this.Document_UpdateSelectionState();
		this.Document_UpdateInterfaceState(true);
	}
};
CDocument.prototype.GetPrevRevisionChange = function()
{
	this.TrackRevisionsManager.ContinueTrackRevisions();
	var oChange = this.TrackRevisionsManager.GetPrevChange();
	if (oChange)
	{
		this.RemoveSelection();
		this.private_SelectRevisionChange(oChange);
		this.Document_UpdateSelectionState();
		this.Document_UpdateInterfaceState(true);
	}
};
CDocument.prototype.GetRevisionsChangeElement = function(nDirection, oCurrentElement)
{
	return this.private_GetRevisionsChangeElement(nDirection, oCurrentElement).GetFoundedElement();
};
CDocument.prototype.private_GetRevisionsChangeElement = function(nDirection, oCurrentElement)
{
    var oSearchEngine = new CRevisionsChangeParagraphSearchEngine(nDirection, oCurrentElement, this.TrackRevisionsManager);
    if (null === oCurrentElement)
    {
		oCurrentElement = this.GetCurrentParagraph(false, false, {ReturnSelectedTable : true});
        if (null === oCurrentElement)
            return oSearchEngine;

		oSearchEngine.SetCurrentElement(oCurrentElement);
		oSearchEngine.SetFoundedElement(oCurrentElement);
        if (true === oSearchEngine.IsFound())
            return oSearchEngine;
    }

    var oFootnote = oCurrentElement.Parent ? oCurrentElement.Parent.GetTopDocumentContent() : null;
    if (!(oFootnote instanceof CFootEndnote))
    	oFootnote = null;

    var HdrFtr = oCurrentElement.GetHdrFtr();
    if (null !== HdrFtr)
    {
        this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, HdrFtr);

        if (nDirection > 0)
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInDocument(oSearchEngine, 0);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInFooters(oSearchEngine, null);
		}
		else
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInFooters(oSearchEngine, null);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInDocument(oSearchEngine, this.Content.length - 1);
		}


        if (true !== oSearchEngine.IsFound())
            this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, null);
    }
    else if (oFootnote)
	{
		this.private_GetRevisionsChangeElementInFooters(oSearchEngine, oFootnote);

		if (nDirection > 0)
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, null);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInDocument(oSearchEngine, 0);
		}
		else
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInDocument(oSearchEngine, this.Content.length - 1);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, null);
		}

		if (true !== oSearchEngine.IsFound())
			this.private_GetRevisionsChangeElementInFooters(oSearchEngine, null);
	}
    else
    {
        var Pos = (true === this.Selection.Use && docpostype_DrawingObjects !== this.GetDocPosType() ? (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos) : this.CurPos.ContentPos);
        this.private_GetRevisionsChangeElementInDocument(oSearchEngine, Pos);

        if (nDirection > 0)
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInFooters(oSearchEngine, null);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, null);
		}
		else
		{
			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInHdrFtr(oSearchEngine, null);

			if (true !== oSearchEngine.IsFound())
				this.private_GetRevisionsChangeElementInFooters(oSearchEngine, null);
		}

        if (true !== oSearchEngine.IsFound())
            this.private_GetRevisionsChangeElementInDocument(oSearchEngine, nDirection > 0 ? 0 : this.Content.length - 1);
    }

    return oSearchEngine;
};
CDocument.prototype.private_GetRevisionsChangeElementInDocument = function(SearchEngine, Pos)
{
    var Direction = SearchEngine.GetDirection();
    this.Content[Pos].GetRevisionsChangeElement(SearchEngine);
    while (true !== SearchEngine.IsFound())
    {
        Pos = (Direction > 0 ? Pos + 1 : Pos - 1);
        if (Pos >= this.Content.length || Pos < 0)
            break;

        this.Content[Pos].GetRevisionsChangeElement(SearchEngine);
    }
};
CDocument.prototype.private_GetRevisionsChangeElementInHdrFtr = function(SearchEngine, HdrFtr)
{
    var AllHdrFtrs = this.SectionsInfo.GetAllHdrFtrs();
    var Count = AllHdrFtrs.length;

    if (Count <= 0)
        return;

    var Pos = -1;
    if (null !== HdrFtr)
    {
        for (var Index = 0; Index < Count; ++Index)
        {
            if (HdrFtr === AllHdrFtrs[Index])
            {
                Pos = Index;
                break;
            }
        }
    }

    var Direction = SearchEngine.GetDirection();
    if (Pos < 0 || Pos >= Count)
    {
        if (Direction > 0)
            Pos = 0;
        else
            Pos = Count - 1;
    }

    AllHdrFtrs[Pos].GetRevisionsChangeElement(SearchEngine);
    while (true !== SearchEngine.IsFound())
    {
        Pos = (Direction > 0 ? Pos + 1 : Pos - 1);
        if (Pos >= Count || Pos < 0)
            break;

        AllHdrFtrs[Pos].GetRevisionsChangeElement(SearchEngine);
    }
};
CDocument.prototype.private_GetRevisionsChangeElementInFooters = function(SearchEngine, oFootnote)
{
	var arrFootnotes = this.GetFootnotesList(null, null);
	var nCount = arrFootnotes.length;
	if (nCount <= 0)
		return;

	var nPos = -1;
	if (oFootnote)
	{
		for (var nIndex = 0; nIndex < nCount; ++nIndex)
		{
			if (arrFootnotes[nPos] === oFootnote)
			{
				nPos = nIndex;
				break;
			}
		}
	}

	var nDirection = SearchEngine.GetDirection();
	if (nPos < 0 || nPos >= nCount)
	{
		if (nDirection > 0)
			nPos = 0;
		else
			nPos = nCount - 1;
	}

	arrFootnotes[nPos].GetRevisionsChangeElement(SearchEngine);
	while (true !== SearchEngine.IsFound())
	{
		nPos = (nDirection > 0 ? nPos + 1 : nPos - 1);
		if (nPos >= nCount || nPos < 0)
			break;

		arrFootnotes[nPos].GetRevisionsChangeElement(SearchEngine);
	}
};
CDocument.prototype.private_SelectRevisionChange = function(oChange)
{
	if (oChange && oChange.get_Paragraph())
	{
		this.RemoveSelection();
		var oElement = oChange.get_Paragraph();

		if (this.TrackRevisionsManager.CompleteTrackChangesForElements([oElement]))
			return;

		if (oElement instanceof Paragraph)
		{
			oElement.Selection.Use = true;
			oElement.Set_SelectionContentPos(oChange.get_StartPos(), oChange.get_EndPos());
			oElement.Set_ParaContentPos(oChange.get_StartPos(), false, -1, -1);
			oElement.Document_SetThisElementCurrent(false);
		}
		else if (oElement instanceof CTable)
		{
			oElement.SelectRows(oChange.get_StartPos(), oChange.get_EndPos());
			oElement.Document_SetThisElementCurrent(false);
		}
	}
};
CDocument.prototype.AcceptRevisionChange = function(oChange)
{
	if (oChange)
	{
		var arrRelatedParas = this.TrackRevisionsManager.GetChangeRelatedParagraphs(oChange, true);

		if (this.TrackRevisionsManager.CompleteTrackChangesForElements(arrRelatedParas))
		{
			this.Document_UpdateInterfaceState();
			this.Document_UpdateSelectionState();
			return;
		}

		if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, {
				Type      : changestype_2_ElementsArray_and_Type,
				Elements  : arrRelatedParas,
				CheckType : AscCommon.changestype_Paragraph_Content
			}))
		{
			this.Create_NewHistoryPoint(AscDFH.historydescription_Document_AcceptRevisionChange);
			this.private_SelectRevisionChange(oChange);
			this.AcceptRevisionChanges(oChange.get_Type(), false);
		}
	}
};
CDocument.prototype.RejectRevisionChange = function(oChange)
{
	if (oChange)
	{
		var arrRelatedParas = this.TrackRevisionsManager.GetChangeRelatedParagraphs(oChange, false);

		if (this.TrackRevisionsManager.CompleteTrackChangesForElements(arrRelatedParas))
		{
			this.Document_UpdateInterfaceState();
			this.Document_UpdateSelectionState();
			return;
		}

		if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, {
				Type      : changestype_2_ElementsArray_and_Type,
				Elements  : arrRelatedParas,
				CheckType : AscCommon.changestype_Paragraph_Content
			}))
		{
			this.Create_NewHistoryPoint(AscDFH.historydescription_Document_RejectRevisionChange);
			this.private_SelectRevisionChange(oChange);
			this.RejectRevisionChanges(oChange.get_Type(), false);
		}
	}
};
CDocument.prototype.AcceptRevisionChangesBySelection = function()
{
    var CurrentChange = this.TrackRevisionsManager.Get_CurrentChange();
    if (null !== CurrentChange)
	{
		this.AcceptRevisionChange(CurrentChange);
	}
    else
    {
        var SelectedParagraphs = this.GetAllParagraphs({Selected : true});
        var RelatedParas = this.TrackRevisionsManager.Get_AllChangesRelatedParagraphsBySelectedParagraphs(SelectedParagraphs, true);
        if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : RelatedParas, CheckType : AscCommon.changestype_Paragraph_Content}))
        {
            this.Create_NewHistoryPoint(AscDFH.historydescription_Document_AcceptRevisionChangesBySelection);
            this.AcceptRevisionChanges(undefined, false);

            if (true === this.History.Is_LastPointEmpty())
                this.History.Remove_LastPoint();
        }
    }

    this.TrackRevisionsManager.Clear_CurrentChange();
    this.GetNextRevisionChange();
};
CDocument.prototype.RejectRevisionChangesBySelection = function()
{
    var CurrentChange = this.TrackRevisionsManager.Get_CurrentChange();
    if (null !== CurrentChange)
	{
		this.RejectRevisionChange(CurrentChange);
	}
    else
    {
        var SelectedParagraphs = this.GetAllParagraphs({Selected : true});
        var RelatedParas = this.TrackRevisionsManager.Get_AllChangesRelatedParagraphsBySelectedParagraphs(SelectedParagraphs, false);
        if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : RelatedParas, CheckType : AscCommon.changestype_Paragraph_Content}))
        {
            this.Create_NewHistoryPoint(AscDFH.historydescription_Document_AcceptRevisionChangesBySelection);
            this.RejectRevisionChanges(undefined, false);

            if (true === this.History.Is_LastPointEmpty())
                this.History.Remove_LastPoint();
        }
    }

	this.TrackRevisionsManager.Clear_CurrentChange();
    this.GetNextRevisionChange();
};
CDocument.prototype.AcceptAllRevisionChanges = function(isSkipCheckLock)
{
    var RelatedParas = this.TrackRevisionsManager.Get_AllChangesRelatedParagraphs(true);
    if (true === isSkipCheckLock || false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : RelatedParas, CheckType : AscCommon.changestype_Paragraph_Content}))
    {
        this.Create_NewHistoryPoint(AscDFH.historydescription_Document_AcceptAllRevisionChanges);
        var LogicDocuments = this.TrackRevisionsManager.Get_AllChangesLogicDocuments();
        for (var LogicDocId in LogicDocuments)
        {
            var LogicDoc = AscCommon.g_oTableId.Get_ById(LogicDocId);
            if (LogicDoc)
            {
                LogicDoc.AcceptRevisionChanges(undefined, true);
            }
        }

        if (true !== isSkipCheckLock && true === this.History.Is_LastPointEmpty())
        {
            this.History.Remove_LastPoint();
            return;
        }

        this.RemoveSelection();
        this.private_CorrectDocumentPosition();
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    }
};
CDocument.prototype.RejectAllRevisionChanges = function(isSkipCheckLock)
{
    var RelatedParas = this.TrackRevisionsManager.Get_AllChangesRelatedParagraphs(false);
    if (true === isSkipCheckLock || false === this.Document_Is_SelectionLocked(AscCommon.changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : RelatedParas, CheckType : AscCommon.changestype_Paragraph_Content}))
    {
        this.Create_NewHistoryPoint(AscDFH.historydescription_Document_RejectAllRevisionChanges);

        this.private_RejectAllRevisionChanges();

        if (true !== isSkipCheckLock && true === this.History.Is_LastPointEmpty())
        {
            this.History.Remove_LastPoint();
            return;
        }

        this.RemoveSelection();
        this.private_CorrectDocumentPosition();
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    }
};
CDocument.prototype.private_RejectAllRevisionChanges = function()
{
	var LogicDocuments = this.TrackRevisionsManager.Get_AllChangesLogicDocuments();
	for (var LogicDocId in LogicDocuments)
	{
		var LogicDoc = this.TableId.Get_ById(LogicDocId);
		if (LogicDoc)
		{
			LogicDoc.RejectRevisionChanges(undefined, true);
		}
	}
};
CDocument.prototype.AcceptRevisionChanges = function(Type, bAll)
{
    // Принимаем все изменения, которые попали в селект.
    // Принимаем изменения в следующей последовательности:
    // 1. Изменение настроек параграфа
    // 2. Изменение настроек текста
    // 3. Добавление/удаление текста
    // 4. Добавление/удаление параграфа
    if (docpostype_Content === this.CurPos.Type || true === bAll)
    {
        if (true === this.Selection.Use || true === bAll)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos)
            {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }

            var LastElement = this.Content[EndPos];
			var LastParaEnd = (!LastElement.IsParagraph() || true === LastElement.Selection_CheckParaEnd());

            if (true === bAll)
            {
                StartPos = 0;
                EndPos = this.Content.length - 1;
                LastParaEnd = true;
            }

            if (undefined === Type || c_oAscRevisionsChangeType.ParaPr === Type)
            {
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type() && (true === Element.IsSelectedAll() || true == bAll) && true === Element.HavePrChange())
                    {
                        Element.AcceptPrChange();
                    }
                }
            }

            for (var nCurPos = StartPos; nCurPos <= EndPos; ++nCurPos)
            {
                var oElement = this.Content[nCurPos];
				oElement.AcceptRevisionChanges(Type, bAll);
            }

            if (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type || c_oAscRevisionsChangeType.ParaRem === Type || c_oAscRevisionsChangeType.RowsRem === Type || c_oAscRevisionsChangeType.RowsAdd === Type)
            {
                EndPos = (true === LastParaEnd ? EndPos : EndPos - 1);
                for (var nCurPos = EndPos; nCurPos >= StartPos; --nCurPos)
                {
                    var oElement = this.Content[nCurPos];
                    if (oElement.IsParagraph())
                    {
                        var ReviewType = oElement.GetReviewType();
                        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type))
                        {
							oElement.SetReviewType(reviewtype_Common);
                        }
                        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaRem === Type))
                        {
							oElement.SetReviewType(reviewtype_Common);
                            this.Concat_Paragraphs(nCurPos);
                        }
                    }
                    else if (oElement.IsTable())
					{
						// После принятия изменений у нас могла остаться пустая таблица, такую мы должны удалить
						if (oElement.GetRowsCount() <= 0)
						{
							this.RemoveFromContent(nCurPos, 1, false);
						}
					}
                }
            }
        }
    }
    else if (docpostype_HdrFtr === this.CurPos.Type)
    {
        this.HdrFtr.AcceptRevisionChanges(Type, bAll);
    }
    else if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.DrawingObjects.AcceptRevisionChanges(Type, bAll);
    }
    else if (docpostype_Footnotes === this.CurPos.Type)
	{
		this.Footnotes.AcceptRevisionChanges(Type, bAll);
	}

    if (true !== bAll)
    {
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    }
};
CDocument.prototype.RejectRevisionChanges = function(Type, bAll)
{
    // Отменяем все изменения, которые попали в селект.
    // Отменяем изменения в следующей последовательности:
    // 1. Изменение настроек параграфа
    // 2. Изменение настроек текста
    // 3. Добавление/удаление текста
    // 4. Добавление/удаление параграфа

    if (docpostype_Content === this.CurPos.Type || true === bAll)
    {
        if (true === this.Selection.Use || true === bAll)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos)
            {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }

            var LastElement = this.Content[EndPos];
            var LastParaEnd = (!LastElement.IsParagraph() || true === LastElement.Selection_CheckParaEnd());

            if (true === bAll)
            {
                StartPos = 0;
                EndPos = this.Content.length - 1;
                LastParaEnd = true;
            }

            if (undefined === Type || c_oAscRevisionsChangeType.ParaPr === Type)
            {
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type() && (true === Element.IsSelectedAll() || true === bAll) && true === Element.HavePrChange())
                    {
                        Element.RejectPrChange();
                    }
                }
            }

            for (var nCurPos = StartPos; nCurPos <= EndPos; ++nCurPos)
            {
                var oElement = this.Content[nCurPos];
				oElement.RejectRevisionChanges(Type, bAll);
            }

			if (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type || c_oAscRevisionsChangeType.ParaRem === Type || c_oAscRevisionsChangeType.RowsRem === Type || c_oAscRevisionsChangeType.RowsAdd === Type)
            {
                EndPos = (true === LastParaEnd ? EndPos : EndPos - 1);
                for (var nCurPos = EndPos; nCurPos >= StartPos; --nCurPos)
                {
                    var oElement = this.Content[nCurPos];
                    if (oElement.IsParagraph())
                    {
                        var ReviewType = oElement.GetReviewType();
                        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type))
                        {
                        	var oNextPara   = this.Content[nCurPos + 1];
                        	var oNextParaPr = null;
                        	if (oNextPara && oNextPara.IsParagraph())
								oNextParaPr = oNextPara.GetDirectParaPr(false);

							oElement.SetReviewType(reviewtype_Common);
                            this.Concat_Paragraphs(nCurPos);

                            if (oNextParaPr)
								oElement.SetDirectParaPr(oNextParaPr.Copy(true));
                        }
                        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaRem === Type))
                        {
							var oReviewInfo = oElement.GetReviewInfo();
							var oPrevInfo   = oReviewInfo.GetPrevAdded();
							if (oPrevInfo)
							{
								oElement.SetReviewTypeWithInfo(reviewtype_Add, oPrevInfo.Copy());
							}
							else
							{
								oElement.SetReviewType(reviewtype_Common);
							}
                        }
                    }
                    else if (oElement.IsTable())
					{
						// После принятия изменений у нас могла остаться пустая таблица, такую мы должны удалить
						if (oElement.GetRowsCount() <= 0)
						{
							this.RemoveFromContent(nCurPos, 1, false);
						}
					}
                }
            }
        }
    }
    else if (docpostype_HdrFtr === this.CurPos.Type)
    {
        this.HdrFtr.RejectRevisionChanges(Type, bAll);
    }
    else if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.DrawingObjects.RejectRevisionChanges(Type, bAll);
    }
    else if (docpostype_Footnotes === this.CurPos.Type)
	{
		this.Footnotes.RejectRevisionChanges(Type, bAll);
	}

    if (true !== bAll)
    {
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    }
};
CDocument.prototype.HaveRevisionChanges = function(isCheckOwnChanges)
{
    this.TrackRevisionsManager.ContinueTrackRevisions();

    if (true === isCheckOwnChanges)
    	return this.TrackRevisionsManager.Have_Changes();
    else
    	return this.TrackRevisionsManager.HaveOtherUsersChanges();
};
//----------------------------------------------------------------------------------------------------------------------
// CHeaderFooterController
//----------------------------------------------------------------------------------------------------------------------
CHeaderFooterController.prototype.AcceptRevisionChanges = function(Type, bAll)
{
    if (null !== this.CurHdrFtr)
        this.CurHdrFtr.Content.AcceptRevisionChanges(Type, bAll);
};
CHeaderFooterController.prototype.RejectRevisionChanges = function(Type, bAll)
{
    if (null !== this.CurHdrFtr)
        this.CurHdrFtr.Content.RejectRevisionChanges(Type, bAll);
};
//----------------------------------------------------------------------------------------------------------------------
// CDocumentContent
//----------------------------------------------------------------------------------------------------------------------
CDocumentContent.prototype.AcceptRevisionChanges = function(Type, bAll)
{
    if (docpostype_Content === this.CurPos.Type || true === bAll)
    {
        if (true === this.Selection.Use || true === bAll)
        {
        	var StartPos, EndPos, LastParaEnd;

			if (true === bAll)
			{
				StartPos    = 0;
				EndPos      = this.Content.length - 1;
				LastParaEnd = true;
			}
			else
			{
				StartPos = this.Selection.StartPos;
				EndPos   = this.Selection.EndPos;
				if (StartPos > EndPos)
				{
					StartPos = this.Selection.EndPos;
					EndPos   = this.Selection.StartPos;
				}

				var LastElement = this.Content[EndPos];
				LastParaEnd = type_Paragraph === LastElement.GetType() && true === LastElement.Selection_CheckParaEnd() ? true : false;
			}

            if (undefined === Type || c_oAscRevisionsChangeType.ParaPr === Type)
            {
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type() && (true === Element.IsSelectedAll() || true === bAll) && true === Element.HavePrChange())
                    {
                        Element.AcceptPrChange();
                    }
                }
            }

            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
            {
                var Element = this.Content[CurPos];
                Element.AcceptRevisionChanges(Type, bAll);
            }

            if (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type || c_oAscRevisionsChangeType.ParaRem === Type)
            {
                EndPos = (true === LastParaEnd ? EndPos : EndPos - 1);
                for (var CurPos = EndPos; CurPos >= StartPos; CurPos--)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type())
                    {
                        var ReviewType = Element.GetReviewType();
                        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type))
                        {
                            Element.SetReviewType(reviewtype_Common);
                        }
                        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaRem === Type))
                        {
                            Element.SetReviewType(reviewtype_Common);
                            this.Concat_Paragraphs(CurPos);
                        }
                    }
                }
            }
        }
    }
    else if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.DrawingObjects.AcceptRevisionChanges(Type, bAll);
    }
};
CDocumentContent.prototype.RejectRevisionChanges = function(Type, bAll)
{
    if (docpostype_Content === this.CurPos.Type || true === bAll)
    {
        if (true === this.Selection.Use || true === bAll)
        {
        	var StartPos, EndPos, LastParaEnd;
			if (true === bAll)
			{
				StartPos = 0;
				EndPos = this.Content.length - 1;
				LastParaEnd = true;
			}
			else
			{
				StartPos = this.Selection.StartPos;
				EndPos   = this.Selection.EndPos;
				if (StartPos > EndPos)
				{
					StartPos = this.Selection.EndPos;
					EndPos   = this.Selection.StartPos;
				}

				var LastElement = this.Content[EndPos];
				LastParaEnd = type_Paragraph === LastElement.GetType() && true === LastElement.Selection_CheckParaEnd() ? true : false;
			}

            if (undefined === Type || c_oAscRevisionsChangeType.ParaPr === Type)
            {
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type() && (true === Element.IsSelectedAll() || true === bAll) && true === Element.HavePrChange())
                    {
                        Element.RejectPrChange();
                    }
                }
            }

            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
            {
                var Element = this.Content[CurPos];
                Element.RejectRevisionChanges(Type, bAll);
            }

            if (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type || c_oAscRevisionsChangeType.ParaRem === Type)
            {
                EndPos = (true === LastParaEnd ? EndPos : EndPos - 1);
                for (var CurPos = EndPos; CurPos >= StartPos; CurPos--)
                {
                    var Element = this.Content[CurPos];
                    if (type_Paragraph === Element.Get_Type())
                    {
                        var ReviewType = Element.GetReviewType();
                        if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaAdd === Type))
                        {
							var oNextPara   = this.Content[CurPos + 1];
							var oNextParaPr = null;
							if (oNextPara && oNextPara.IsParagraph())
								oNextParaPr = oNextPara.GetDirectParaPr(false);

							Element.SetReviewType(reviewtype_Common);
							this.Concat_Paragraphs(CurPos);

							if (oNextParaPr)
								Element.SetDirectParaPr(oNextParaPr.Copy(true));
                        }
                        else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.ParaRem === Type))
                        {
                            Element.SetReviewType(reviewtype_Common);
                        }
                    }
                }
            }
        }
    }
    else if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.DrawingObjects.RejectRevisionChanges(Type, bAll);
    }
};
CDocumentContent.prototype.GetRevisionsChangeElement = function(SearchEngine)
{
    if (true === SearchEngine.IsFound())
        return;

    var Direction = SearchEngine.GetDirection();
    var Pos = 0;
    if (true !== SearchEngine.IsCurrentFound())
    {
        Pos = (true === this.Selection.Use ? (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos) : this.CurPos.ContentPos);
    }
    else
    {
        if (Direction > 0)
        {
            Pos = 0;
        }
        else
        {
            Pos = this.Content.length - 1;
        }
    }

    this.Content[Pos].GetRevisionsChangeElement(SearchEngine);
    while (true !== SearchEngine.IsFound())
    {
        Pos = (Direction > 0 ? Pos + 1 : Pos - 1);
        if (Pos >= this.Content.length || Pos < 0)
            break;

        this.Content[Pos].GetRevisionsChangeElement(SearchEngine);
    }
};
//----------------------------------------------------------------------------------------------------------------------
// CFootnotesController
//----------------------------------------------------------------------------------------------------------------------
CFootnotesController.prototype.AcceptRevisionChanges = function(Type, bAll)
{
	if (null !== this.CurFootnote)
		this.CurFootnote.AcceptRevisionChanges(Type, bAll);
};
CFootnotesController.prototype.RejectRevisionChanges = function(Type, bAll)
{
	if (null !== this.CurFootnote)
		this.CurFootnote.RejectRevisionChanges(Type, bAll);
};