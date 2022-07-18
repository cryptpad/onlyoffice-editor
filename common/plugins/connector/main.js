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

var connector = new Asc.EditorConnector({frame : "frameEditor"});

document.getElementById("buttonConnect").onclick = function()
{
	connector.connect();
};
document.getElementById("buttonDisconnect").onclick = function()
{
	connector.disconnect();
};
document.getElementById("buttonTest1").onclick = function()
{
	connector.callMethod("GetVersion", [], function(version)
	{
		console.log(version);
	});

	connector.attachEvent("onTargetPositionChanged", function()
	{
		console.log("event: onTargetPositionChanged");
	});

	connector.attachEvent("onChangeContentControl", function()
	{
		console.log("event: onChangeContentControl");
	});

	connector.attachEvent("onFocusContentControl", function()
	{
		console.log("event: onFocusContentControl");
	});


	connector.attachEvent("onBlurContentControl", function(oPr)
	{
		let sTag = oPr["Tag"];
		console.log(oPr);
		console.log(sTag);
		if ("BankBIC" === sTag)
		{
			connector.callCommand(function() {

				let oDocument = Api.GetDocument();

				let arrForms  = oDocument.GetFormsByTag("BankBIC");
				if (1 === arrForms.length &&  arrForms[0].GetText() === "12345678")
				{
					arrForms = oDocument.GetFormsByTag("BankAccount");
					for (let nIndex = 0, nCount = arrForms.length; nIndex < nCount; ++nIndex)
					{
						let oForm = arrForms[nIndex];
						if (oForm.GetFormType() === "textForm")
							oForm.SetText("10101110100000000123");
					}

					arrForms = oDocument.GetFormsByTag("BankName");
					for (let nIndex = 0, nCount = arrForms.length; nIndex < nCount; ++nIndex)
					{
						let oForm = arrForms[nIndex];
						if (oForm.GetFormType() === "textForm")
							oForm.SetText("OnlyOffice BANK");
					}

					arrForms = oDocument.GetFormsByTag("BankPlace");
					for (let nIndex = 0, nCount = arrForms.length; nIndex < nCount; ++nIndex)
					{
						let oForm = arrForms[nIndex];
						if (oForm.GetFormType() === "textForm")
							oForm.SetText("Himalayas");
					}
				}
			}, function() { console.log("callback command"); });


		}
		console.log("event: onBlurContentControl");
	});

};
document.getElementById("buttonTest2").onclick = function()
{
	connector.callCommand(function() {

		var oDocument = Api.GetDocument();
		var oParagraph = Api.CreateParagraph();
		oParagraph.AddText("Hello world!");
		oDocument.InsertContent([oParagraph]);

	}, function() { console.log("callback command"); });
};
