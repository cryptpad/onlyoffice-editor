/*
 * (c) Copyright Ascensio System SIA 2010-2023
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

$(function ()
{
	const logicDocument = AscTest.CreateLogicDocument();
	const styleManager  = logicDocument.GetStyleManager();
	
	QUnit.module("Test the application of numbering to the document");
	
	QUnit.test("Numbering for headings", function (assert)
	{
		AscTest.ClearDocument();
		
		for (let iHead = 0; iHead < 9; ++iHead)
		{
			let p = AscTest.CreateParagraph();
			logicDocument.PushToContent(p);
			let styleId = styleManager.GetDefaultHeading(iHead);
			p.SetParagraphStyle(styleManager.Get(styleId).GetName());
			let run = new AscWord.CRun();
			p.AddToContent(0, run);
			run.AddText("Heading " + iHead);
		}
		
		assert.strictEqual(logicDocument.GetElementsCount(), 9, "Check number of paragraphs");
		logicDocument.SelectAll();
		logicDocument.SetParagraphNumbering(AscWord.GetNumberingObjectByDeprecatedTypes(2, 4));
		AscTest.Recalculate();
		
		assert.strictEqual(logicDocument.GetElement(0).GetNumberingText(false), "Article I.", "Check numbering text for heading 1");
		assert.strictEqual(logicDocument.GetElement(1).GetNumberingText(false), "Section I.01", "Check numbering text for heading 2");
		assert.strictEqual(logicDocument.GetElement(2).GetNumberingText(false), "(a)", "Check numbering text for heading 3");
		assert.strictEqual(logicDocument.GetElement(3).GetNumberingText(false), "(i)", "Check numbering text for heading 4");
		assert.strictEqual(logicDocument.GetElement(4).GetNumberingText(false), "1)", "Check numbering text for heading 5");
		assert.strictEqual(logicDocument.GetElement(5).GetNumberingText(false), "a)", "Check numbering text for heading 6");
		assert.strictEqual(logicDocument.GetElement(6).GetNumberingText(false), "i)", "Check numbering text for heading 7");
		assert.strictEqual(logicDocument.GetElement(7).GetNumberingText(false), "a.", "Check numbering text for heading 8");
		assert.strictEqual(logicDocument.GetElement(8).GetNumberingText(false), "i.", "Check numbering text for heading 8");
		

	});
});
