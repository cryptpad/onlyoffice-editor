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

$(function () {

    let Root, MathContent;

    function Init() {
        let logicDocument = AscTest.CreateLogicDocument();
        logicDocument.RemoveFromContent(0, logicDocument.GetElementsCount(), false);

        let p1 = new AscWord.CParagraph(editor.WordControl);
        logicDocument.AddToContent(0, p1);

        MathContent = new ParaMath();

        if (p1.Content.length > 0)
            p1.Content.splice(0, 1);

        p1.AddToContent(0, MathContent);
        Root = MathContent.Root;
        Root.Correct_Content(true);
    }

    Init();

    function Clear() {
        Root.Remove_FromContent(0, Root.Content.length);
        Root.Correct_Content(true);
    }

    function AddText(str) {
        for (let i = 0; i < str.length; i++) {
            let intCode = str[i].charCodeAt(0);
            let oElement = new AscWord.CRunText(intCode);
            MathContent.Add(oElement);
        }
    }

    function Test(str, intCurPos, arrResult, isLaTeX, isNotClear)
	{
		let Text = "Test: " + str;
		if (!isNotClear) {
			QUnit.module("\'" + str + "\'");
		}
		else {
			Text = "Continuation of the previous test: " + str;
		}


        QUnit.test(Text, function (assert)
		{
            function AutoTest(isLaTeX, str, intCurPos, arrResultContent)
			{

				let CurPos = Root.CurPos;
                AddText(str);

                for (let i = CurPos; i < Root.Content.length; i++)
				{
                    let CurrentContent = Root.Content[i];
                    let CheckContent = arrResultContent[i];

                    assert.strictEqual(
                        CurrentContent.constructor.name,
                        CheckContent[0],
                        "Content[" + i + "] === " +
                        Root.Content[i].constructor.name
                    );

                    let TextContent = CurrentContent.GetTextOfElement();
                    assert.strictEqual(TextContent, CheckContent[1], "Text of Content[" + i + "]: '" + CheckContent[1] + "'");

                    if (CurrentContent.constructor.name === "ParaRun" && i === intCurPos) {
                        assert.strictEqual(CurrentContent.IsCursorAtEnd(), true, "Cursor at the end of ParaRun");
                    }

                }

                assert.strictEqual(Root.CurPos, intCurPos, "Check cursor position: " + intCurPos);
            }

            if (!isNotClear)
                Clear();

            AutoTest(isLaTeX, str, intCurPos, arrResult);
        })
    }

	function MultiLineTest(arrStr, arrCurPos, arrResult, arrCurPosMove)
	{
		QUnit.test("MultiLineTest \'" + arrStr.flat(2).join("") + "\'", function (assert) {

			Clear();
			for (let i = 0; i < arrStr.length; i++)
			{
				let str = arrStr[i];
				let intCurPos = arrCurPos[i];
				let arrCurResult = arrResult[i];
				let CurPosMove = arrCurPosMove[i];

				function AutoTest(str, intCurPos, arrResultContent, CurPosMove)
				{
					AddText(str);

					for (let i = 0; i < Root.Content.length; i++)
					{
						let CurrentContent = Root.Content[i];
						let ResultContent = arrResultContent[i];

						if (ResultContent === undefined) {
							ResultContent = [];
							ResultContent[0] = " " + Root.Content[i].constructor.name;
							ResultContent[1] = CurrentContent.GetTextOfElement();
						}

						assert.strictEqual(CurrentContent.constructor.name, ResultContent[0], "For: \'" + str + "\' block - " + "Content[" + i + "] === " + Root.Content[i].constructor.name);

						let TextContent = CurrentContent.GetTextOfElement();
						assert.strictEqual(TextContent, ResultContent[1], "For: \'" + str + "\' block - " + "Text of Content[" + i + "]: '" + ResultContent[1] + "'");

						if (CurrentContent.constructor.name === "ParaRun" && i === intCurPos)
							assert.strictEqual(CurrentContent.IsCursorAtEnd(), true, "For: \'" + str + "\' block - " + "Cursor at the end of ParaRun");
					}

					if (CurPosMove)
						Root.CurPos += CurPosMove;

					assert.strictEqual(Root.CurPos, intCurPos, "For: \'" + str + "\' block - " + "Check cursor position: " + intCurPos);
				}
				AutoTest(str, intCurPos, arrCurResult, CurPosMove);
			}
		})
	}

    Test("2_1", 0, [["ParaRun", "2_1"]], false);
    Test("2_1 ", 2, [["ParaRun", ""], ["CDegree", "2_(1)"], ["ParaRun", ""]], false);
    Test("\\int", 0, [["ParaRun", "\\int"]], false);

    Test("\\int _x^y\\of 1/2 ", 2, [["ParaRun", ""], ["CNary", "〖∫^y_x▒〖〖1/2〗〗〗"], ["ParaRun", ""]], false);
    Test("1/2 ", 2, [["ParaRun", ""], ["CFraction", "〖1/2〗"], ["ParaRun", ""]], false);

    Test("1/2 +", 2, [["ParaRun", ""], ["CDelimiter", "〖1/2〗"], ["ParaRun", "+"]], false);
    Test("1/2=", 2, [["ParaRun", ""], ["CFraction", "〖1/2〗"], ["ParaRun", "="]], false);

	Test("1/2 +1/2=x/y ", 6, [["ParaRun", ""], ["CDelimiter", "〖1/2〗"], ["ParaRun", "+"], ["CFraction", "〖1/2〗"], ["ParaRun", "="], ["CFraction", "〖x/y〗"], ["ParaRun", " "]], false);

	MultiLineTest(
		["1/2", " "],
		[0, 2],
		[
			[
				["ParaRun", "1/2"]
			],
			[
				["ParaRun", ""],
				["CFraction", "〖1/2〗"],
				["ParaRun", ""]
			],
		],
		[]
		);

	MultiLineTest(
		["1/2 ", "+", "x/y", " "],
		[2, 2, 2, 4],
		[
			[
				["ParaRun", ""],
				["CFraction", "〖1/2〗"],
				["ParaRun", ""]
			],
			[
				["ParaRun", ""],
				["CDelimiter", "〖1/2〗"],
				["ParaRun", "+"]
			],
			[
				["ParaRun", ""],
				["CDelimiter", "〖1/2〗"],
				["ParaRun", "+x/y"]
			],
			[
				["ParaRun", ""],
				["CDelimiter", "〖1/2〗"],
				["ParaRun", "+"],
				["CFraction", "〖x/y〗"],
				["ParaRun", ""],
			],
		],
		[]
	);

// 	MultiLineTest(
// 		["1/2 ", "+", "x/y", " ", " "],
// 		[2, 2, 2, 4],
// 		[
// 			[
// 				["ParaRun", ""],
// 				["CFraction", "〖1/2〗"],
// 				["ParaRun", ""]
// 			],
// 			[
// 				["ParaRun", ""],
// 				["CDelimiter", "〖1/2〗"],
// 				["ParaRun", "+"]
// 			],
// 			[
// 				["ParaRun", ""],
// 				["CDelimiter", "〖1/2〗"],
// 				["ParaRun", "+x/y"]
// 			],
// 			[
// 				["ParaRun", ""],
// 				["CDelimiter", "〖1/2〗"],
// 				["ParaRun", "+"],
// 				["CFraction", "〖x/y〗"],
// 				["ParaRun", ""],
// 			],
// 			[
// 				["ParaRun", ""],
// 				["CDelimiter", "〖1/2〗"],
// 				["ParaRun", "+ "],
// 				["CFraction", "〖x/y〗"],
// 				["ParaRun", ""],
// 			]
// 		],
// 		[0, 0, 0, -1]
// 	);


 });


// AutoTest(false, "\\int ", 0, "∫");
// AutoTest(false, "_x^y\\of ", 0, "∫_x^y▒", true);
// AutoTest(false, "1/2 ", 2, "〖∫^y_x▒〖〖1/2〗〗〗", true);
//
// AutoTest(false, "\\sqrt ", 0, "√");
// AutoTest(false, "(1_2&1) ", 2, "√(1_(2)&1)", true);
// AutoTest(false, "_[1+2] ", 2, "〖√(1_(2)&1)〗_([1+2])", true);
// AutoTest(false, "+", 3, "〖√(1_(2)&1)〗_([1+2]) +", true);
// AutoTest(false, "1/2 ", 4, "", true);
//
// AutoTest(false, "(1+2 ", 0, "(1+2 ");
// AutoTest(false, "(1+2] ", 2, "(1+2]");
