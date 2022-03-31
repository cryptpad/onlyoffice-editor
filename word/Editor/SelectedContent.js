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

(function(window, undefined)
{
	const FLAG_MATH          = 0x0001;
	const FLAG_SHAPE         = 0x0002;
	const FLAG_TABLE         = 0x0004;
	const FLAG_NOT_PARAGRAPH = 0x0008; // Есть не параграф в массиве

	/**
	 * Класс, используемый для вставки или переноса содержимого внутри документа
	 * @constructor
	 */
	function CSelectedContent()
	{
		this.Elements       = [];
		this.Flags          = 0;

		this.DrawingObjects = [];
		this.Comments       = [];
		this.CommentsMarks  = {};
		this.Maths          = [];

		this.LogicDocument  = null;

		this.NewCommentsGuid     = false;
		this.SaveNumberingValues = false;
		this.CopyComments        = true;

		this.MoveDrawing      = false; // Только для переноса автофигур

		this.InsertOptions = {
			Table : Asc.c_oSpecialPasteProps.overwriteCells
		};

		// Опции для отслеживания переноса
		this.TrackRevisions = false;
		this.MoveTrackId    = null;
		this.MoveTrackRuns  = [];
		this.HaveMovedParts = false;

		this.LastSection = null;
	}

	CSelectedContent.prototype.Reset = function()
	{
		this.Elements = [];
		this.Flags    = 0;

		this.DrawingObjects = [];
		this.Comments       = [];
		this.Maths          = [];


		this.MoveDrawing = false;
	};
	CSelectedContent.prototype.Add = function(oElement)
	{
		this.Elements.push(oElement);
	};
	CSelectedContent.prototype.EndCollect = function(oLogicDocument)
	{
		this.private_CollectObjects();
		this.private_CheckComments(oLogicDocument);
		this.private_CheckTrackMove(oLogicDocument);
	};
	CSelectedContent.prototype.SetNewCommentsGuid = function(isNew)
	{
		this.NewCommentsGuid = isNew;
	};
	CSelectedContent.prototype.SetMoveDrawing = function(isMoveDrawing)
	{
		this.MoveDrawing = isMoveDrawing;
	};
	CSelectedContent.prototype.SetCopyComments = function(isCopy)
	{
		this.CopyComments = isCopy;
	};
	CSelectedContent.prototype.CanConvertToMath = function()
	{
		// Проверка возможности конвертации имеющегося контента в контент для вставки в формулу
		// Если формулы уже имеются, то ничего не конвертируем
		return !!((!this.Flags & FLAG_MATH) && !(this.Flags & FLAG_NOT_PARAGRAPH));
	};
	CSelectedContent.prototype.HaveShape = function()
	{
		return !!(this.Flags & FLAG_SHAPE);
	};
	CSelectedContent.prototype.HaveMath = function()
	{
		return !!(this.Flags & FLAG_MATH);
	};
	CSelectedContent.prototype.HaveTable = function()
	{
		return !!(this.Flags & FLAG_TABLE);
	};
	CSelectedContent.prototype.Insert = function(oAnchorPos)
	{
		let oParagraph     = oAnchorPos.Paragraph;
		let oDocContent    = oParagraph.GetParent();
		let oLogicDocument = oParagraph.GetLogicDocument();

		if (!oDocContent || !oLogicDocument)
			return;

		this.LogicDocument = oLogicDocument;

		this.PrepareObjectsForInsert();

		var Para        = NearPos.Paragraph;
		var ParaNearPos = Para.Get_ParaNearestPos(NearPos);
		var LastClass   = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];

		this.private_CheckContentBeforePaste(oAnchorPos);

		// for (var nIndex = 0, nCount = SelectedContent.DrawingObjects.length; nIndex < nCount; ++nIndex)
		// {
		// 	SelectedContent.DrawingObjects[nIndex].Set_Parent(Para);
		// }

		if (para_Math_Run === LastClass.Type)
		{
			var MathRun        = LastClass;
			var NewMathRun     = MathRun.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
			var MathContent    = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
			var MathContentPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];
			var Element        = SelectedContent.Elements[0].Element;

			var InsertMathContent = null;
			for (var nPos = 0, nParaLen = Element.Content.length; nPos < nParaLen; nPos++)
			{
				if (para_Math === Element.Content[nPos].Type)
				{
					InsertMathContent = Element.Content[nPos];
					break;
				}
			}

			// Try to convert content to ParaMath in simple cases
			if (!InsertMathContent)
				InsertMathContent = SelectedContent.ConvertToMath();

			if (null !== InsertMathContent)
			{
				MathContent.Add_ToContent(MathContentPos + 1, NewMathRun);
				MathContent.Insert_MathContent(InsertMathContent.Root, MathContentPos + 1, true);
			}
		}
		else if (para_Run === LastClass.Type)
		{
			var oForm = null;
			var oDstPictureCC = LastClass.GetParentPictureContentControl();
			if (oDstPictureCC)
			{
				var oSrcPicture = null;
				for (var nIndex = 0, nCount = SelectedContent.DrawingObjects.length; nIndex < nCount; ++nIndex)
				{
					if (SelectedContent.DrawingObjects[nIndex].IsPicture())
					{
						oSrcPicture = SelectedContent.DrawingObjects[nIndex].GraphicObj.copy();
						break;
					}
				}

				var arrParaDrawings = oDstPictureCC.GetAllDrawingObjects();
				if (arrParaDrawings.length > 0 && oSrcPicture)
				{
					oDstPictureCC.SetShowingPlcHdr(false);
					oSrcPicture.setParent(arrParaDrawings[0]);
					arrParaDrawings[0].Set_GraphicObject(oSrcPicture);

					if (oDstPictureCC.IsPictureForm())
						oDstPictureCC.UpdatePictureFormLayout();

					this.DrawingObjects.resetSelection();
					this.RemoveSelection();
					oDstPictureCC.SelectContentControl();

					var sKey = oDstPictureCC.GetFormKey();
					if (arrParaDrawings[0].IsPicture() && sKey)
					{
						this.OnChangeForm(sKey, oDstPictureCC, arrParaDrawings[0].GraphicObj.getImageUrl());
					}
				}

				return;
			}
			else if ((oForm = LastClass.GetParentForm()))
			{
				if ((!oForm.IsTextForm() || oForm.IsComboBox()))
					return;

				var sInsertedText = SelectedContent.GetText({ParaEndToSpace : false});
				if (!sInsertedText || !sInsertedText.length)
					return;

				var nInLastClassPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 1];

				var isPlaceHolder  = LastClass.GetParentForm().IsPlaceHolder();
				if (isPlaceHolder && LastClass.GetParent() instanceof CInlineLevelSdt)
				{
					var oInlineLeveLSdt = LastClass.GetParent();
					oInlineLeveLSdt.ReplacePlaceHolderWithContent();
					LastClass       = oInlineLeveLSdt.GetElement(0);
					nInLastClassPos = 0;
				}

				LastClass.State.ContentPos = nInLastClassPos;

				var nInRunStartPos = LastClass.State.ContentPos;
				LastClass.AddText(sInsertedText, nInLastClassPos);
				var nInRunEndPos = LastClass.State.ContentPos;

				var nLastClassLen = LastClass.GetElementsCount();
				nInRunStartPos    = Math.min(nLastClassLen, Math.min(nInRunStartPos, nInRunEndPos));
				nInRunEndPos      = Math.min(nLastClassLen, nInRunEndPos);

				// TODO: Оставляем селект, т.к. в большинстве случаев после Insert он убирается командой
				//       MoveCursorRight. Когда это будет контролироваться в данной функции, передлать здесь
				LastClass.SelectThisElement();
				LastClass.Selection.Use      = true;
				LastClass.Selection.StartPos = nInRunStartPos;
				LastClass.Selection.EndPos   = nInRunEndPos;

				return;
			}

			var NearContentPos = NearPos.ContentPos;
			// Сначала найдем номер элемента, начиная с которого мы будем производить вставку
			var DstIndex       = -1;
			var Count          = this.Content.length;
			for (var Index = 0; Index < Count; Index++)
			{
				if (this.Content[Index] === Para)
				{
					DstIndex = Index;
					break;
				}
			}

			if (-1 === DstIndex)
				return false;

			var Elements      = SelectedContent.Elements;
			var ElementsCount = Elements.length;
			var FirstElement  = SelectedContent.Elements[0];
			if (1 === ElementsCount && true !== FirstElement.SelectedAll && type_Paragraph === FirstElement.Element.GetType() && true !== FirstElement.Element.Is_Empty())
			{
				// Нам нужно в заданный параграф вставить выделенный текст
				var NewPara          = FirstElement.Element;
				var NewElementsCount = NewPara.Content.length - 1; // Последний ран с para_End не добавляем

				// TODO: Как будет время проверить, возможно тут надо делать проверку
				//  (oInlineLeveLSdt.IsPlaceHolder() || oInlineLeveLSdt.IsContentControlTemporary())
				var oInlineLeveLSdt;
				if (LastClass instanceof ParaRun
					&& (oInlineLeveLSdt = LastClass.GetParent())
					&& oInlineLeveLSdt instanceof CInlineLevelSdt
					&& oInlineLeveLSdt.IsPlaceHolder())
				{
					if (oInlineLeveLSdt.IsContentControlTemporary())
					{
						var oResult = oInlineLeveLSdt.RemoveContentControlWrapper();

						var oSdtParent = oResult.Parent;
						var oSdtPos    = oResult.Pos;
						var oSdtCount  = oResult.Count;

						if (!oSdtParent
							|| ParaNearPos.Classes.length < 3
							|| ParaNearPos.Classes[ParaNearPos.Classes.length - 2] !== oInlineLeveLSdt
							|| ParaNearPos.Classes[ParaNearPos.Classes.length - 3] !== oSdtParent)
							return;

						var oRun = new ParaRun(undefined, false);
						oRun.SetPr(oInlineLeveLSdt.GetDefaultTextPr().Copy());

						oSdtParent.RemoveFromContent(oSdtPos, oSdtCount);
						oSdtParent.AddToContent(oSdtPos, oRun);

						LastClass = oRun;
						ParaNearPos.Classes.length--;
						ParaNearPos.Classes[ParaNearPos.Classes.length - 1] = LastClass;
						ParaNearPos.NearPos.ContentPos.Update(oSdtPos, ParaNearPos.Classes.length - 2);
						ParaNearPos.NearPos.ContentPos.Update(0, ParaNearPos.Classes.length - 1);
					}
					else
					{
						oInlineLeveLSdt.ReplacePlaceHolderWithContent();
						LastClass = oInlineLeveLSdt.GetElement(0);
						ParaNearPos.Classes[ParaNearPos.Classes.length - 1] = LastClass;
						ParaNearPos.NearPos.ContentPos.Update(0, ParaNearPos.Classes.length - 2);
						ParaNearPos.NearPos.ContentPos.Update(0, ParaNearPos.Classes.length - 1);
					}
				}

				var LastClass  = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
				var NewElement = LastClass.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
				var PrevClass  = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
				var PrevPos    = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];

				PrevClass.Add_ToContent(PrevPos + 1, NewElement);

				// TODO: Заглушка для переноса автофигур и картинок. Когда разрулим ситуацию так, чтобы когда у нас
				//       в текста была выделена автофигура выделение шло для автофигур, тогда здесь можно будет убрать.
				var bNeedSelect = (true === SelectedContent.MoveDrawing ? false : true);

				for (var Index = 0; Index < NewElementsCount; Index++)
				{
					var Item = NewPara.Content[Index];
					PrevClass.Add_ToContent(PrevPos + 1 + Index, Item);

					if (true === bNeedSelect)
						Item.SelectAll();
				}

				if (true === bNeedSelect)
				{
					PrevClass.Selection.Use      = true;
					PrevClass.Selection.StartPos = PrevPos + 1;
					PrevClass.Selection.EndPos   = PrevPos + 1 + NewElementsCount - 1;

					for (var Index = 0; Index < ParaNearPos.Classes.length - 2; Index++)
					{
						var Class    = ParaNearPos.Classes[Index];
						var ClassPos = ParaNearPos.NearPos.ContentPos.Data[Index];

						Class.Selection.Use      = true;
						Class.Selection.StartPos = ClassPos;
						Class.Selection.EndPos   = ClassPos;
					}

					this.Selection.Use      = true;
					this.Selection.StartPos = DstIndex;
					this.Selection.EndPos   = DstIndex;
				}

				if (PrevClass.Correct_Content)
				{
					PrevClass.Correct_Content();
				}
			}
			else
			{
				var bConcatS   = ( type_Paragraph !== Elements[0].Element.GetType() ? false : true );
				var bConcatE   = ( type_Paragraph !== Elements[ElementsCount - 1].Element.GetType() || true === Elements[ElementsCount - 1].SelectedAll ? false : true );
				var ParaS      = Para;
				var ParaE      = Para;
				var ParaEIndex = DstIndex;

				// Нам надо разделить наш параграф в заданной позиции, если позиция в
				// начале или конце параграфа, тогда делить не надо
				Para.Cursor_MoveToNearPos(NearPos);
				Para.RemoveSelection();

				var bAddEmptyPara          = false;
				var bDoNotIncreaseDstIndex = false;

				if (true === Para.IsCursorAtEnd() && !Para.IsEmpty())
				{
					bConcatE = false;

					if (1 === ElementsCount && type_Paragraph === FirstElement.Element.GetType() && ( true === FirstElement.Element.Is_Empty() || true == FirstElement.SelectedAll ))
					{
						bConcatS = false;

						// TODO: Возможно флаг bDoNotIncreaseDstIndex не нужен, и здесь не нужно увеличивать индекс DstIndex
						if (type_Paragraph !== this.Content[DstIndex].Get_Type() || true !== this.Content[DstIndex].Is_Empty())
						{
							DstIndex++;
							bDoNotIncreaseDstIndex = true;
						}
					}
					else if (true === Elements[ElementsCount - 1].SelectedAll && true === bConcatS)
						bAddEmptyPara = true;
				}
				else if (true === Para.IsCursorAtBegin())
				{
					bConcatS = false;
				}
				else
				{
					// Создаем новый параграф
					var NewParagraph = new Paragraph(this.DrawingDocument, this);
					Para.Split(NewParagraph);
					this.Internal_Content_Add(DstIndex + 1, NewParagraph);

					ParaE      = NewParagraph;
					ParaEIndex = DstIndex + 1;
				}

				var NewEmptyPara = null;
				if (true === bAddEmptyPara && true !== SelectedContent.DoNotAddEmptyPara)
				{
					// Создаем новый параграф
					NewEmptyPara = new Paragraph(this.DrawingDocument, this);
					NewEmptyPara.Set_Pr(ParaS.Pr);
					NewEmptyPara.TextPr.Apply_TextPr(ParaS.TextPr.Value);
					this.Internal_Content_Add(DstIndex + 1, NewEmptyPara);
				}

				var StartIndex = 0;
				if (true === bConcatS)
				{
					// Вызываем так, чтобы выделить все внутренние элементы
					var _ParaS = Elements[0].Element;
					_ParaS.SelectAll();
					var _ParaSContentLen = _ParaS.Content.length;

					// Если мы присоединяем новый параграф, то и копируем все настройки параграфа (так делает Word)
					ParaS.Concat(Elements[0].Element);
					ParaS.Set_Pr(Elements[0].Element.Pr);
					ParaS.TextPr.Clear_Style();
					ParaS.TextPr.Apply_TextPr(Elements[0].Element.TextPr.Value);

					StartIndex++;

					ParaS.Selection.Use      = true;
					ParaS.Selection.StartPos = ParaS.Content.length - _ParaSContentLen;
					ParaS.Selection.EndPos   = ParaS.Content.length - 1;

					for (var nParaSIndex = ParaS.Selection.StartPos; nParaSIndex <= Math.min(ParaS.Selection.EndPos, ParaS.Content.length - 1); ++nParaSIndex)
					{
						ParaS.Content[nParaSIndex].SelectAll(1);
					}
				}
				else if (true !== Para.IsCursorAtBegin() && true !== bDoNotIncreaseDstIndex)
				{
					DstIndex++;
				}

				var EndIndex = ElementsCount - 1;
				if (true === bConcatE && ElementsCount > 1)
				{
					var _ParaE    = Elements[ElementsCount - 1].Element;
					var TempCount = _ParaE.Content.length - 1;

					_ParaE.SelectAll();
					_ParaE.Concat(ParaE);
					_ParaE.Set_Pr(ParaE.Pr);

					this.Internal_Content_Add(ParaEIndex, _ParaE);
					this.Internal_Content_Remove(ParaEIndex + 1, 1);

					_ParaE.Selection.Use      = true;
					_ParaE.Selection.StartPos = 0;
					_ParaE.Selection.EndPos   = TempCount;

					EndIndex--;
				}

				for (var Index = StartIndex; Index <= EndIndex; Index++)
				{
					this.Internal_Content_Add(DstIndex + Index, Elements[Index].Element);
					this.Content[DstIndex + Index].SelectAll();
				}

				var LastPos = DstIndex + ElementsCount - 1;
				if (NewEmptyPara && NewEmptyPara === this.Content[LastPos + 1])
				{
					LastPos++;
					this.Content[LastPos].SelectAll();
				}

				this.Selection.Use      = true;
				this.Selection.StartPos = DstIndex;
				this.Selection.EndPos   = LastPos;
				this.CurPos.ContentPos  = LastPos;
			}

			if (docpostype_DrawingObjects !== this.CurPos.Type)
				this.SetDocPosType(docpostype_Content);
		}

		SelectedContent.PostInsert(this);
	};
	CSelectedContent.prototype.PrepareObjectsForInsert = function()
	{
		let oLogicDocument = this.LogicDocument;

		if (oLogicDocument.IsDocumentEditor())
		{
			if (this.NewCommentsGuid)
				this.CreateNewCommentsGuid();

			this.private_CopyDocPartNames();

			if (this.CopyComments)
				this.private_CopyComments();
		}
	};
	CSelectedContent.prototype.PostInsert = function(oLogicDocument)
	{
		this.CheckInsertSignatures();

		if (oLogicDocument && oLogicDocument.IsDocumentEditor())
			SelectedContent.CheckInsertInlineDrawing();
	};
	CSelectedContent.prototype.CheckInsertSignatures = function()
	{
		var aDrawings        = this.DrawingObjects;
		var nDrawing, oDrawing, oSp;
		var sLastSignatureId = null;
		for (nDrawing = 0; nDrawing < aDrawings.length; ++nDrawing)
		{
			oDrawing = aDrawings[nDrawing];
			oSp      = oDrawing.GraphicObj;
			if (oSp && oSp.signatureLine)
			{
				oSp.setSignature(oSp.signatureLine);
				sLastSignatureId = oSp.signatureLine.id;
			}
		}
		if (sLastSignatureId)
		{
			editor.sendEvent("asc_onAddSignature", sLastSignatureId);
		}
	};
	CSelectedContent.prototype.CheckInsertInlineDrawing = function()
	{
		if (this.MoveDrawing)
			return;

		//correct size of inline image when SelectedContent contains the only one inline image
		if (1 === this.DrawingObjects.length && 1 === this.Elements.length)
		{
			var oParaDrawing = this.DrawingObjects[0];
			if (oParaDrawing.IsInline())
			{
				var oElement        = this.Elements[0];
				var oContentElement = oElement.Element;
				if (oContentElement.IsParagraph())
				{
					var bAdditionalContent = oContentElement.CheckRunContent(function(oRun)
					{
						var aContent = oRun.Content;
						for (var nIdx = 0; nIdx < aContent.length; ++nIdx)
						{
							var oItem = aContent[nIdx];
							if (oItem.Type !== para_End && oItem.Type !== para_Drawing)
							{
								return true;
							}
						}
						return false;
					});
					if (!bAdditionalContent)
					{
						oParaDrawing.CheckFitToColumn();
					}
				}
			}
		}
	};
	CSelectedContent.prototype.SetInsertOptionForTable = function(nType)
	{
		this.InsertOptions.Table = nType;
	};
	/**
	 * Converts current content to ParaMath if it possible. Doesn't change current SelectedContent.
	 * @returns {?AscCommonWord.ParaMath}
	 * */
	CSelectedContent.prototype.ConvertToMath = function()
	{
		if (!this.CanConvertToMath())
			return null;

		var oParaMath = new AscCommonWord.ParaMath();
		oParaMath.Root.Remove_FromContent(0, oParaMath.Root.GetElementsCount());

		for (var nParaIndex = 0, nParasCount = this.Elements.length, nRunPos = 0; nParaIndex < nParasCount; ++nParaIndex)
		{
			var oParagraph = this.Elements[nParaIndex].Element;
			if (type_Paragraph !== oParagraph.GetType())
				continue;

			for (var nInParaPos = 0; nInParaPos < oParagraph.GetElementsCount(); ++nInParaPos)
			{
				var oElement = oParagraph.Content[nInParaPos];
				if (para_Run === oElement.GetType())
				{
					var oRun = new ParaRun(oParagraph, true);
					oParaMath.Root.Add_ToContent(nRunPos++, oRun);

					for (var nInRunPos = 0, nCount = oElement.GetElementsCount(); nInRunPos < nCount; ++nInRunPos)
					{
						var oItem = oElement.Content[nInRunPos];
						if (para_Text === oItem.Type)
						{
							if (38 === oItem.Value)
							{
								oRun.Add(new CMathAmp(), true);
							}
							else
							{
								var oMathText = new CMathText(false);
								oMathText.add(oItem.Value);
								oRun.Add(oMathText, true);
							}
						}
						else if (para_Space === oItem.Value)
						{
							var oMathText = new CMathText(false);
							oMathText.add(0x0032);
							oRun.Add(oMathText, true);
						}
					}

					oRun.Apply_Pr(oElement.Get_TextPr());
				}
			}
		}

		oParaMath.Root.Correct_Content(true);
		return oParaMath;
	};
	/**
	 * Устанавливаем, что сейчас происходит перенос во время рецензирования
	 * @param {boolean} isTrackRevision
	 * @param {string} sMoveId
	 */
	CSelectedContent.prototype.SetMoveTrack = function(isTrackRevision, sMoveId)
	{
		this.TrackRevisions = isTrackRevision;
		this.MoveTrackId    = sMoveId;
	};
	/**
	 * Проверяем собираем ли содержимое для переноса в рецензировании
	 * @returns {boolean}
	 */
	CSelectedContent.prototype.IsMoveTrack = function()
	{
		return this.MoveTrackId !== null;
	};
	/**
	 * @returns {boolean}
	 */
	CSelectedContent.prototype.IsTrackRevisions = function()
	{
		return this.TrackRevisions;
	};
	/**
	 * Добавляем ран, который участвует в переносе
	 * @param {ParaRun} oRun
	 */
	CSelectedContent.prototype.AddRunForMoveTrack = function(oRun)
	{
		this.MoveTrackRuns.push(oRun);
	};
	/**
	 * Устанавливаем есть ли в содержимом текст перенесенный во время рецензирования
	 * @param {boolean} isHave
	 */
	CSelectedContent.prototype.SetMovedParts = function(isHave)
	{
		this.HaveMovedParts = isHave;
	};
	/**
	 * Запрашиваем, есть ли перенесенная во время рецензирования часть
	 * @returns {boolean}
	 */
	CSelectedContent.prototype.IsHaveMovedParts = function()
	{
		return this.HaveMovedParts;
	};
	/**
	 * Запоминаем секцию, на которой закончилось выделение (если оно было в основной части документа)
	 * @param {CSectionPr} oSectPr
	 */
	CSelectedContent.prototype.SetLastSection = function(oSectPr)
	{
		this.LastSection = oSectPr;
	};
	/**
	 * Получаем секцию, на которой закончилось выделение
	 * @returns {null|CSectionPr}
	 */
	CSelectedContent.prototype.GetLastSection = function()
	{
		return this.LastSection;
	};
	/**
	 * Сохранять значения нумерации
	 * @param {boolean} isSave
	 */
	CSelectedContent.prototype.SetSaveNumberingValues = function(isSave)
	{
		this.SaveNumberingValues = isSave;
	};
	/**
	 * Заппрашиваем, нужно ли сохранять расчитанные значения нумерации
	 * @returns {boolean}
	 */
	CSelectedContent.prototype.IsSaveNumberingValues = function()
	{
		return this.SaveNumberingValues;
	};
	/**
	 * Конвертируем элементы в один элемент с простым текстом
	 */
	CSelectedContent.prototype.ConvertToText = function()
	{
		var oParagraph = new Paragraph(editor.WordControl.m_oDrawingDocument);

		var sText = "";
		for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
		{
			var oElement = this.Elements[nIndex].Element;
			if (oElement.IsParagraph())
				sText += oElement.GetText();
		}

		var oRun = new ParaRun(oParagraph, null);
		oRun.AddText(sText);
		oParagraph.AddToContent(0, oRun);

		this.Elements.length = 0;
		this.Elements.push(new CSelectedElement(oParagraph, false));
	};
	CSelectedContent.prototype.GetText = function(oPr)
	{
		var sText = "";
		for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
		{
			var oElement = this.Elements[nIndex].Element;
			if (oElement.IsParagraph())
				sText += oElement.GetText(oPr);
		}
		return sText;
	};
	CSelectedContent.prototype.ConvertToPresentation = function(Parent)
	{
		var Elements = this.Elements.slice(0);
		this.Elements.length = 0;

		for (var nIndex = 0, nCount = Elements.length; nIndex < nCount; ++nIndex)
		{
			var oElement = Elements[nIndex].Element;
			if (oElement.IsParagraph())
			{
				this.Elements.push(new CSelectedElement(AscFormat.ConvertParagraphToPPTX(oElement, Parent.DrawingDocument, Parent, true, false), false))
			}
		}
	};
	//----------------- Private Area -----------------------------------------------------------------------------------
	CSelectedContent.prototype.private_CollectObjects = function()
	{
		for (let nPos = 0, nCount = this.Elements.length; nPos < nCount; ++nPos)
		{
			let oElement = this.Elements[nPos].Element;

			oElement.Set_DocumentPrev(0 === nPos ? null : this.Elements[nPos - 1].Element);
			oElement.Set_DocumentNext(nPos === nCount - 1 ? null : this.Elements[nPos + 1].Element);
			oElement.ProcessComplexFields();

			let arrParagraphs = oElement.GetAllParagraphs();
			for (let nParaIndex = 0, nParasCount = arrParagraphs.length; nParaIndex < nParasCount; ++nParaIndex)
			{
				let oParagraph = arrParagraphs[nParaIndex];
				oParagraph.GetAllDrawingObjects(this.DrawingObjects);
				oParagraph.GetAllComments(this.Comments);
				oParagraph.GetAllMaths(this.Maths);
			}

			if (oElement.IsParagraph() && nCount > 1)
				oElement.CorrectContent();

			if (oElement.IsTable())
				this.Flags |= FLAG_TABLE;

			if (!oElement.IsParagraph())
				this.Flags |= FLAG_NOT_PARAGRAPH;

			oElement.MoveCursorToEndPos(false);
		}

		if (this.Maths.length)
			this.Flags |= FLAG_MATH;

		for (let nPos = 0, nCount = this.DrawingObjects.length; nPos < nCount; ++nPos)
		{
			let oDrawing = this.DrawingObjects[nPos];
			if (oDrawing.IsShape() || oDrawing.IsGroup())
			{
				this.Flags |= FLAG_SHAPE;
				break;
			}
		}
	};
	CSelectedContent.prototype.private_CheckComments = function(oLogicDocument)
	{
		if (!(oLogicDocument instanceof AscCommonWord.CDocument))
			return;

		var mCommentsMarks = {};
		for (var nIndex = 0, nCount = this.Comments.length; nIndex < nCount; ++nIndex)
		{
			var oMark = this.Comments[nIndex].Comment;

			var sId = oMark.GetCommentId();
			if (!mCommentsMarks[sId])
				mCommentsMarks[sId] = {};

			if (oMark.IsCommentStart())
				mCommentsMarks[sId].Start = oMark;
			else
				mCommentsMarks[sId].End   = oMark;
		}

		// Пробегаемся по найденным комментариям и удаляем те, у которых нет начала или конца
		var oCommentsManager = oLogicDocument.GetCommentsManager();
		for (var sId in mCommentsMarks)
		{
			var oEntry = mCommentsMarks[sId];

			var oParagraph = null;
			if (!oEntry.Start && oEntry.End)
				oParagraph = oEntry.End.GetParagraph();
			else if (oEntry.Start && !oEntry.End)
				oParagraph = oEntry.Start.GetParagraph();

			var oComment = oCommentsManager.GetById(sId);
			if ((!oEntry.Start && !oEntry.End) || !oComment)
				delete mCommentsMarks[sId];
			else
				oEntry.Comment = oComment;

			if (oParagraph)
			{
				var bOldValue = oParagraph.DeleteCommentOnRemove;
				oParagraph.DeleteCommentOnRemove = false;
				oParagraph.RemoveCommentMarks(sId);
				oParagraph.DeleteCommentOnRemove = bOldValue;
				delete mCommentsMarks[sId];
			}
		}

		this.CommentsMarks = mCommentsMarks;
	};
	CSelectedContent.prototype.private_CheckTrackMove = function(oLogicDocument)
	{
		if (this.Elements.length <= 0 || !oLogicDocument || !oLogicDocument.TrackMoveId)
			return;

		var isCanMove = !this.IsHaveMovedParts();
		for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
		{
			if (!this.Elements[nIndex].Element.IsParagraph())
			{
				isCanMove = false;
				break;
			}
		}

		if (oLogicDocument.TrackMoveRelocation)
			isCanMove = true;

		if (isCanMove)
		{
			if (oLogicDocument.TrackMoveRelocation)
			{
				var oMarks = oLogicDocument.GetTrackRevisionsManager().GetMoveMarks(oLogicDocument.TrackMoveId);
				if (oMarks)
				{
					oMarks.To.Start.RemoveThisMarkFromDocument();
					oMarks.To.End.RemoveThisMarkFromDocument();
				}
			}

			var oStartElement = this.Elements[0].Element;
			var oEndElement   = this.Elements[this.Elements.length - 1].Element;

			var oStartParagraph = oStartElement.GetFirstParagraph();
			var oEndParagraph   = oEndElement.GetLastParagraph();

			oStartParagraph.AddToContent(0, new CParaRevisionMove(true, false, oLogicDocument.TrackMoveId));

			if (oEndParagraph !== oEndElement || this.Elements[this.Elements.length - 1].SelectedAll)
			{
				var oEndRun = oEndParagraph.GetParaEndRun();
				oEndRun.AddAfterParaEnd(new CRunRevisionMove(false, false, oLogicDocument.TrackMoveId));

				var oInfo = new CReviewInfo();
				oInfo.Update();
				oInfo.SetMove(Asc.c_oAscRevisionsMove.MoveTo);
				oEndRun.SetReviewTypeWithInfo(reviewtype_Add, oInfo, false);
			}
			else
			{
				oEndParagraph.AddToContent(oEndParagraph.GetElementsCount(), new CParaRevisionMove(false, false, oLogicDocument.TrackMoveId));
			}

			for (var nIndex = 0, nCount = this.MoveTrackRuns.length; nIndex < nCount; ++nIndex)
			{
				var oRun  = this.MoveTrackRuns[nIndex];
				var oInfo = new CReviewInfo();
				oInfo.Update();
				oInfo.SetMove(Asc.c_oAscRevisionsMove.MoveTo);
				oRun.SetReviewTypeWithInfo(reviewtype_Add, oInfo);
			}
		}
		else
		{
			oLogicDocument.TrackMoveId = null;
		}
	};
	CSelectedContent.prototype.private_CreateNewCommentsGuid = function()
	{
		let oManager = this.LogicDocument.GetCommentsManager();
		for (var Index = 0; Index < this.Comments.length; Index++)
		{
			var comment = oManager.GetById(this.Comments[Index].Comment.CommentId);
			if (comment)
			{
				comment.CreateNewCommentsGuid();
			}
		}
	};
	CSelectedContent.prototype.private_CopyDocPartNames = function()
	{
		var arrCC = [];
		for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
		{
			this.Elements[nIndex].Element.GetAllContentControls(arrCC);
		}

		var oGlossaryDocument = this.LogicDocument.GetGlossaryDocument();
		for (var nIndex = 0, nCount = arrCC.length; nIndex < nCount; ++nIndex)
		{
			var oCC = arrCC[nIndex];

			var sPlaceHolderName = oCC.GetPlaceholder();
			if (sPlaceHolderName)
			{
				var oDocPart = oGlossaryDocument.GetDocPartByName(sPlaceHolderName);
				if (!oDocPart || oGlossaryDocument.IsDefaultDocPart(oDocPart))
					continue;

				var sNewName = oGlossaryDocument.GetNewName();
				oGlossaryDocument.AddDocPart(oDocPart.Copy(sNewName));
				oCC.SetPlaceholder(sNewName);
			}
		}
	};
	CSelectedContent.prototype.private_CopyComments = function()
	{
		var oCommentsManager = this.LogicDocument.GetCommentsManager();
		for (let sId in this.CommentsMarks)
		{
			let oEntry = this.CommentsMarks[sId];

			var oNewComment = oEntry.Comment.Copy();
			oCommentsManager.Add(oNewComment);

			var sNewId = oNewComment.GetId();
			oLogicDocument.GetApi().sync_AddComment(sNewId, oNewComment.GetData());
			oEntry.Start.SetCommentId(sNewId);
			oEntry.End.SetCommentId(sNewId);

			oNewComment.SetRangeStart(oEntry.Start.GetId());
			oNewComment.SetRangeEnd(oEntry.End.GetId());
		}
	};
	/**
	 * Проверяем содержимое, которые мы вставляем, в зависимости от места куда оно вставляется
	 * @param oAnchorPos {NearestPos}
	 * @param oDocContent {AscCommonWord.CDocumentContent}
	 */
	CSelectedContent.prototype.private_CheckContentBeforePaste = function(oAnchorPos, oDocContent)
	{
		var oParagraph = oAnchorPos.Paragraph;

		// Если мы вставляем в специальный контент контрол, тогда производим простую вставку текста
		var oParaState = oParagraph.SaveSelectionState();
		oParagraph.RemoveSelection();
		oParagraph.Set_ParaContentPos(oAnchorPos.ContentPos, false, -1, -1, false);
		var arrContentControls = oParagraph.GetSelectedContentControls();
		oParagraph.LoadSelectionState(oParaState);

		for (var nIndex = 0, nCount = arrContentControls.length; nIndex < nCount; ++nIndex)
		{
			if (arrContentControls[nIndex].IsComboBox() || arrContentControls[nIndex].IsDropDownList())
			{
				this.ConvertToText();
				break;
			}
		}

		if (this.LogicDocument.IsPresentationEditor())
			this.ConvertToPresentation(oDocContent);
	};

	/**
	 * @param oElement
	 * @param isSelectedAll
	 * @constructor
	 */
	function CSelectedElement(oElement, isSelectedAll)
	{
		this.Element     = oElement;
		this.SelectedAll = isSelectedAll;
	}


	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommonWord'] = window['AscCommonWord'] || {};
	window['AscCommonWord'].CSelectedContent = CSelectedContent;
	window['AscCommonWord'].CSelectedElement = CSelectedElement;

})(window);
