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

(function (window, undefined) {
	//docx
	CDocument.prototype.toZip = function (zip, context) {
		var res = null;
		var memory = new AscCommon.CMemory();
		memory.context = context;
		var filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);
		var docPart = filePart.addPart(AscCommon.openXml.Types.mainDocument);
		docPart.part.setDataXml(this, memory);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh"><w:optimizeForBrowser/><w:allowPNG/></w:webSettings>');
		var sampleData = memory.GetDataUint8();
		var webSettingsPart = docPart.part.addPart(AscCommon.openXml.Types.webSettings);
		webSettingsPart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh"><w:zoom w:percent="100"/><w:proofState w:grammar="clean"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="differentiateMultirowTableHeaders" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="useWord2013TrackBottomHyphenation" w:uri="http://schemas.microsoft.com/office/word" w:val="0"/></w:compat><w:rsids><w:rsidRoot w:val="002E24ED"/><w:rsid w:val="002C1F74"/><w:rsid w:val="002E24ED"/><w:rsid w:val="00604857"/><w:rsid w:val="00BD432E"/><w:rsid w:val="00CA6F2E"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US" w:bidi="ar-SA"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val=","/><w:listSeparator w:val=";"/><w14:docId w14:val="2A462AF5"/><w15:chartTrackingRefBased/><w15:docId w15:val="{D435FAAD-BA8F-4C19-83D2-539619B23433}"/></w:settings>');
		sampleData = memory.GetDataUint8();
		var settingsPart = docPart.part.addPart(AscCommon.openXml.Types.documentSettings);
		settingsPart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="0" w:defUnhideWhenUsed="0" w:defQFormat="0" w:count="376"><w:lsdException w:name="Normal" w:uiPriority="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 2" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 3" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 4" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 5" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 6" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 7" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 8" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 9" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="index 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 9" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 1" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 2" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 3" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 4" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 5" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 6" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 7" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 8" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 9" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footer" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="caption" w:semiHidden="1" w:uiPriority="35" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="table of figures" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope return" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="line number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="page number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="table of authorities" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="macro" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toa heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Title" w:uiPriority="10" w:qFormat="1"/><w:lsdException w:name="Closing" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Default Paragraph Font" w:semiHidden="1" w:uiPriority="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Message Header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Subtitle" w:uiPriority="11" w:qFormat="1"/><w:lsdException w:name="Salutation" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Date" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Note Heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Block Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Hyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="FollowedHyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Strong" w:uiPriority="22" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:uiPriority="20" w:qFormat="1"/><w:lsdException w:name="Document Map" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Plain Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="E-mail Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Top of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Bottom of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal (Web)" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Acronym" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Cite" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Code" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Definition" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Keyboard" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Preformatted" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Sample" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Typewriter" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Variable" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Table" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation subject" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="No List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Contemporary" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Elegant" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Professional" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Balloon Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid" w:uiPriority="39"/><w:lsdException w:name="Table Theme" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Placeholder Text" w:semiHidden="1"/><w:lsdException w:name="No Spacing" w:uiPriority="1" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:uiPriority="60"/><w:lsdException w:name="Light List" w:uiPriority="61"/><w:lsdException w:name="Light Grid" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1" w:uiPriority="65"/><w:lsdException w:name="Medium List 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3" w:uiPriority="69"/><w:lsdException w:name="Dark List" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading" w:uiPriority="71"/><w:lsdException w:name="Colorful List" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 1" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 1" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 1" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 1" w:uiPriority="65"/><w:lsdException w:name="Revision" w:semiHidden="1"/><w:lsdException w:name="List Paragraph" w:uiPriority="34" w:qFormat="1"/><w:lsdException w:name="Quote" w:uiPriority="29" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:uiPriority="30" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 1" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 1" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 1" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 1" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 2" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 2" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 2" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 2" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 2" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 2" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 2" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 2" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 3" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 3" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 3" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 3" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 3" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 3" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 3" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 3" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 3" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 4" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 4" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 4" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 4" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 4" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 4" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 4" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 4" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 4" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 5" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 5" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 5" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 5" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 5" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 5" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 5" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 5" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 5" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 6" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 6" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 6" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 6" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 6" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 6" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 6" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 6" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 6" w:uiPriority="73"/><w:lsdException w:name="Subtle Emphasis" w:uiPriority="19" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:uiPriority="21" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:uiPriority="31" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:uiPriority="32" w:qFormat="1"/><w:lsdException w:name="Book Title" w:uiPriority="33" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:semiHidden="1" w:uiPriority="37" w:unhideWhenUsed="1"/><w:lsdException w:name="TOC Heading" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="Plain Table 1" w:uiPriority="41"/><w:lsdException w:name="Plain Table 2" w:uiPriority="42"/><w:lsdException w:name="Plain Table 3" w:uiPriority="43"/><w:lsdException w:name="Plain Table 4" w:uiPriority="44"/><w:lsdException w:name="Plain Table 5" w:uiPriority="45"/><w:lsdException w:name="Grid Table Light" w:uiPriority="40"/><w:lsdException w:name="Grid Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 6" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="List Table 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 6" w:uiPriority="52"/><w:lsdException w:name="Mention" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Smart Hyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Hashtag" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Unresolved Mention" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Smart Link" w:semiHidden="1" w:unhideWhenUsed="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="a"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="a0"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="a1"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="a2"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style></w:styles>');
		sampleData = memory.GetDataUint8();
		var stylesPart = docPart.part.addPart(AscCommon.openXml.Types.styles);
		stylesPart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>');
		sampleData = memory.GetDataUint8();
		var themePart = docPart.part.addPart(AscCommon.openXml.Types.theme);
		themePart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="CC"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="CC"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002EFF" w:usb1="C000785B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="CC"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002EFF" w:usb1="C000785B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Calibri Light"><w:panose1 w:val="020F0302020204030204"/><w:charset w:val="CC"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font></w:fonts>');
		sampleData = memory.GetDataUint8();
		var fontsPart = docPart.part.addPart(AscCommon.openXml.Types.fontTable);
		fontsPart.part.setData(sampleData);
		memory.Seek(0);
	};
	CDocument.prototype.fromXml = function (reader, Content) {
		var name;
		if (!reader.ReadNextNode()) {
			return;
		}
		name = reader.GetNameNoNS();
		if ("document" !== name && "wordDocument" !== name && "glossaryDocument" !== name) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		name = reader.GetNameNoNS();
		if ("document" === name || "wordDocument" === name || "glossaryDocument" === name) {
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				name = reader.GetNameNoNS();
				if ("background" === name) {

				} else if ("body" === name) {
					this.fromXmlDocContent(reader, Content);
				} else if ("docParts" === name) {

				}
			}
		}
	};
	CDocument.prototype.fromXmlDocContent = function (reader, Content) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			CDocument.prototype.fromXmlDocContentElem(reader, name, Content, this.DrawingDocument, this);
		}
	};
	CDocument.prototype.fromXmlDocContentElem = function (reader, name, Content, DrawingDocument, Parent) {
		var res = null;
		var newItem = null;
		switch (name) {
			case "altChunk":
				break;
			case "bookmarkStart":
				break;
			case "bookmarkEnd":
				break;
			case "commentRangeStart":
				break;
			case "commentRangeEnd":
				break;
			case "customXmlDelRangeStart":
				break;
			case "customXmlDelRangeEnd":
				break;
			case "customXmlInsRangeStart":
				break;
			case "customXmlInsRangeEnd":
				break;
			case "customXmlMoveFromRangeStart":
				break;
			case "customXmlMoveFromRangeEnd":
				break;
			case "customXmlMoveToRangeStart":
				break;
			case "customXmlMoveToRangeEnd":
				break;
			case "del":
				break;
			case "ins":
				break;
			case "moveFrom":
				break;
			case "moveFromRangeStart":
				break;
			case "moveFromRangeEnd":
				break;
			case "moveTo":
				break;
			case "moveToRangeStart":
				break;
			case "moveToRangeEnd":
				break;
			case "oMath":
				break;
			case "oMathPara":
				break;
			case "p":
				newItem = new Paragraph(DrawingDocument, Parent);
				break;
			case "permStart":
				break;
			case "permEnd":
				break;
			case "proofErr":
				break;
			case "sdt":
				break;
			case "sectPr":
				break;
			case "tbl":
				var table = new CTable(DrawingDocument, Parent, true, 0, 0, []);
				table.Set_TableStyle2(null);
				table.fromXml(reader);
				if (table.Get_RowsCount() > 0) {
					res = table;
					Content.push(table);
				}
				break;
		}
		if (newItem) {
			newItem.fromXml(reader);
			res = newItem;
			Content.push(newItem);
		}
		return res;
	};
	CDocument.prototype.toXml = function (writer) {
		writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		writer.WriteXmlNodeStart("w:document");
		writer.WriteXmlString(" xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:cx=\"http://schemas.microsoft.com/office/drawing/2014/chartex\" xmlns:cx1=\"http://schemas.microsoft.com/office/drawing/2015/9/8/chartex\" xmlns:cx2=\"http://schemas.microsoft.com/office/drawing/2015/10/21/chartex\" xmlns:cx3=\"http://schemas.microsoft.com/office/drawing/2016/5/9/chartex\" xmlns:cx4=\"http://schemas.microsoft.com/office/drawing/2016/5/10/chartex\" xmlns:cx5=\"http://schemas.microsoft.com/office/drawing/2016/5/11/chartex\" xmlns:cx6=\"http://schemas.microsoft.com/office/drawing/2016/5/12/chartex\" xmlns:cx7=\"http://schemas.microsoft.com/office/drawing/2016/5/13/chartex\" xmlns:cx8=\"http://schemas.microsoft.com/office/drawing/2016/5/14/chartex\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:aink=\"http://schemas.microsoft.com/office/drawing/2016/ink\" xmlns:am3d=\"http://schemas.microsoft.com/office/drawing/2017/model3d\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" xmlns:w16cex=\"http://schemas.microsoft.com/office/word/2018/wordml/cex\" xmlns:w16cid=\"http://schemas.microsoft.com/office/word/2016/wordml/cid\" xmlns:w16=\"http://schemas.microsoft.com/office/word/2018/wordml\" xmlns:w16sdtdh=\"http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash\" xmlns:w16se=\"http://schemas.microsoft.com/office/word/2015/wordml/symex\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14\"");
		writer.WriteXmlAttributesEnd();
		if (this.Background) {
			//this.Background.toXml(writer, "w:background");
		}
		writer.WriteXmlNodeStart("w:body");
		writer.WriteXmlAttributesEnd();
		this.Content.forEach(function (item) {
			CDocument.prototype.toXmlDocContentElem(writer, item);
		});
		// this.SectPr.toXml(writer, "w:background");
		writer.WriteXmlNodeEnd("w:body");
		writer.WriteXmlNodeEnd("w:document");
	};
	CDocument.prototype.toXmlDocContentElem = function (writer, item) {
		switch (item.GetType()) {
			case type_Paragraph:
				item.toXml(writer, "w:p");
				break;
			case type_Table:
				item.toXml(writer, "w:tbl");
				break;
			case type_BlockLevelSdt:
				break;
		}
	};
	CTable.prototype.fromXml = function (reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "bookmarkStart" : {
					break;
				}
				case "bookmarkEnd" : {
					break;
				}
				case "moveFromRangeStart" : {
					break;
				}
				case "moveFromRangeEnd" : {
					break;
				}
				case "moveToRangeStart" : {
					break;
				}
				case "moveToRangeEnd" : {
					break;
				}
				case "commentRangeStart" : {
					break;
				}
				case "commentRangeEnd" : {
					break;
				}
				case "customXmlInsRangeStart" : {
					break;
				}
				case "customXmlInsRangeEnd" : {
					break;
				}
				case "customXmlDelRangeStart" : {
					break;
				}
				case "customXmlDelRangeEnd" : {
					break;
				}
				case "customXmlMoveFromRangeStart" : {
					break;
				}
				case "customXmlMoveFromRangeEnd" : {
					break;
				}
				case "customXmlMoveToRangeStart" : {
					break;
				}
				case "customXmlMoveToRangeEnd" : {
					break;
				}
				case "tblPr" : {
					// var tblPr = new CT_TblPr();
					// this.tblPr.fromXml(reader);
					break;
				}
				case "tblGrid" : {
					var tblGrid = new CT_TblGrid();
					tblGrid.fromXml(reader);
					tblGrid.toTable(this);
					break;
				}
				case "tr" : {
					var row = this.private_AddRow(this.Content.length, 0);
					row.fromXml(reader);
					break;
				}
				case "customXml" : {
					break;
				}
				case "sdt" : {
					break;
				}
				case "todo_EG_RunLevelElts" : {
					break;
				}
			}
		}
	};
	CTable.prototype.toXml = function(writer, name) {
		var tblGrid = new CT_TblGrid();
		tblGrid.fromTable(this);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlArray(this.bookmarkStart, "w:bookmarkStart");
		writer.WriteXmlArray(this.bookmarkEnd, "w:bookmarkEnd");
		writer.WriteXmlArray(this.moveFromRangeStart, "w:moveFromRangeStart");
		writer.WriteXmlArray(this.moveFromRangeEnd, "w:moveFromRangeEnd");
		writer.WriteXmlArray(this.moveToRangeStart, "w:moveToRangeStart");
		writer.WriteXmlArray(this.moveToRangeEnd, "w:moveToRangeEnd");
		writer.WriteXmlArray(this.commentRangeStart, "w:commentRangeStart");
		writer.WriteXmlArray(this.commentRangeEnd, "w:commentRangeEnd");
		writer.WriteXmlArray(this.customXmlInsRangeStart, "w:customXmlInsRangeStart");
		writer.WriteXmlArray(this.customXmlInsRangeEnd, "w:customXmlInsRangeEnd");
		writer.WriteXmlArray(this.customXmlDelRangeStart, "w:customXmlDelRangeStart");
		writer.WriteXmlArray(this.customXmlDelRangeEnd, "w:customXmlDelRangeEnd");
		writer.WriteXmlArray(this.customXmlMoveFromRangeStart, "w:customXmlMoveFromRangeStart");
		writer.WriteXmlArray(this.customXmlMoveFromRangeEnd, "w:customXmlMoveFromRangeEnd");
		writer.WriteXmlArray(this.customXmlMoveToRangeStart, "w:customXmlMoveToRangeStart");
		writer.WriteXmlArray(this.customXmlMoveToRangeEnd, "w:customXmlMoveToRangeEnd");
		writer.WriteXmlNullable(this.tblPr, "w:tblPr");
		tblGrid.toXml(writer, "w:tblGrid");
		writer.WriteXmlArray(this.Content, "w:tr");
		writer.WriteXmlArray(this.customXml, "w:customXml");
		writer.WriteXmlArray(this.sdt, "w:sdt");
		writer.WriteXmlArray(this.todo_EG_RunLevelElts, "w:todo_EG_RunLevelElts");
		writer.WriteXmlNodeEnd(name);
	};
	function CT_TblGrid() {
		this.gridCol = [];
		this.tblGridChange = null;
		return this;
	}
	CT_TblGrid.prototype.fromTable = function(table) {
		if (table.TableGrid) {
			for(var i = 0; i < table.TableGrid.length; ++i) {
				var elem = new CT_TblGridCol();
				elem.w = table.TableGrid[i];
				this.gridCol.push(elem);
			}
		}
	};
	CT_TblGrid.prototype.toTable = function(table) {
		var tableGrid = this.gridCol.map(function(elem) {return elem.w;});
		table.SetTableGrid(tableGrid);
		//todo tblGridChange
	};
	CT_TblGrid.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "gridCol" : {
					var elem = new CT_TblGridCol();
					elem.fromXml(reader);
					this.gridCol.push(elem);
					break;
				}
				case "tblGridChange" : {
					break;
				}
			}
		}
	};
	CT_TblGrid.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlArray(this.gridCol, "w:gridCol");
		writer.WriteXmlNullable(this.tblGridChange, "w:tblGridChange");
		writer.WriteXmlNodeEnd(name);
	};
	function CT_TblGridCol() {
		this.w = null;
		return this;
	}
	CT_TblGridCol.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "w": {
					this.w = AscCommon.universalMeasureToUnsignedMm(reader.GetText(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
			}
		}
	};
	CT_TblGridCol.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_TblGridCol.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeIntWithKoef("w:w", this.w, g_dKoef_mm_to_twips);
		writer.WriteXmlAttributesEnd(true);
	};
	CTableRow.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "rsidRPr": {
					break;
				}
				case "rsidR": {
					break;
				}
				case "rsidDel": {
					break;
				}
				case "rsidTr": {
					break;
				}
			}
		}
	};
	CTableRow.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "tblPrEx" : {
					break;
				}
				case "trPr" : {
					var rowPr = new CTableRowPr();
					rowPr.fromXml(reader);
					this.Set_Pr(rowPr);
					break;
				}
				case "tc" : {
					var cell = this.Add_Cell(this.Get_CellsCount(), this, null, false);
					cell.fromXml(reader);
					break;
				}
				case "customXml" : {
					break;
				}
				case "sdt" : {
					break;
				}
				case "todo_EG_RunLevelElts" : {
					break;
				}
			}
		}
	};
	CTableRow.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		// writer.WriteXmlNullable(this.tblPrEx, "w:tblPrEx");
		writer.WriteXmlNullable(this.Pr, "w:trPr");
		writer.WriteXmlArray(this.Content, "w:tc");
		// writer.WriteXmlArray(this.customXml, "w:customXml");
		// writer.WriteXmlArray(this.sdt, "w:sdt");
		// writer.WriteXmlArray(this.todo_EG_RunLevelElts, "w:todo_EG_RunLevelElts");
		writer.WriteXmlNodeEnd(name);
	};
	CTableRowPr.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "cnfStyle" : {
					break;
				}
				case "divId" : {
					this.divId = new CT_DecimalNumber();
					this.divId.fromXml(reader);
					break;
				}
				case "gridBefore" : {
					this.gridBefore = new CT_DecimalNumber();
					this.gridBefore.fromXml(reader);
					break;
				}
				case "gridAfter" : {
					this.gridAfter = new CT_DecimalNumber();
					this.gridAfter.fromXml(reader);
					break;
				}
				case "wBefore" : {
					this.wBefore = new CT_TblWidth();
					this.wBefore.fromXml(reader);
					break;
				}
				case "wAfter" : {
					this.wAfter = new CT_TblWidth();
					this.wAfter.fromXml(reader);
					break;
				}
				case "cantSplit" : {
					this.cantSplit = new CT_OnOff();
					this.cantSplit.fromXml(reader);
					break;
				}
				case "trHeight" : {
					this.trHeight = new CT_Height();
					this.trHeight.fromXml(reader);
					break;
				}
				case "tblHeader" : {
					this.tblHeader = new CT_OnOff();
					this.tblHeader.fromXml(reader);
					break;
				}
				case "tblCellSpacing" : {
					this.tblCellSpacing = new CT_TblWidth();
					this.tblCellSpacing.fromXml(reader);
					break;
				}
				case "jc" : {
					this.jc = new CT_JcTable();
					this.jc.fromXml(reader);
					break;
				}
				case "hidden" : {
					this.hidden = new CT_OnOff();
					this.hidden.fromXml(reader);
					break;
				}
				case "ins" : {
					this.ins = new CT_TrackChange();
					this.ins.fromXml(reader);
					break;
				}
				case "del" : {
					this.del = new CT_TrackChange();
					this.del.fromXml(reader);
					break;
				}
				case "trPrChange" : {
					this.trPrChange = new CT_TrPrChange();
					this.trPrChange.fromXml(reader);
					break;
				}
			}
		}
	};
	CTableRowPr.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.cnfStyle, "w:cnfStyle");
		writer.WriteXmlNullable(this.divId, "w:divId");
		writer.WriteXmlNullable(this.gridBefore, "w:gridBefore");
		writer.WriteXmlNullable(this.gridAfter, "w:gridAfter");
		writer.WriteXmlNullable(this.wBefore, "w:wBefore");
		writer.WriteXmlNullable(this.wAfter, "w:wAfter");
		writer.WriteXmlNullable(this.cantSplit, "w:cantSplit");
		writer.WriteXmlNullable(this.trHeight, "w:trHeight");
		writer.WriteXmlNullable(this.tblHeader, "w:tblHeader");
		writer.WriteXmlNullable(this.tblCellSpacing, "w:tblCellSpacing");
		writer.WriteXmlNullable(this.jc, "w:jc");
		writer.WriteXmlNullable(this.hidden, "w:hidden");
		writer.WriteXmlNullable(this.ins, "w:ins");
		writer.WriteXmlNullable(this.del, "w:del");
		writer.WriteXmlNullable(this.trPrChange, "w:trPrChange");
		writer.WriteXmlNodeEnd(name);
	};
	CTableCell.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "id": {
					break;
				}
			}
		}
	};
	CTableCell.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		var Content = [];
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			var newItem = CDocument.prototype.fromXmlDocContentElem(reader, name, Content, this.Content.DrawingDocument, this.Content);
			if (!newItem) {
				switch (name) {
					case "tcPr" : {
						// var cellPr = new CTableCellPr();
						// cellPr.fromXml(reader);
						// this.Set_Pr(cellPr);
						break;
					}
				}
			}
		}
		if (Content.length > 0) {
			this.Content.ReplaceContent(Content);
		}
	};
	CTableCell.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		// writer.WriteXmlNullableAttributeString("id", this.id);
		writer.WriteXmlAttributesEnd();
		// writer.WriteXmlNullable(this.tcPr, "w:tcPr");
		this.Content.Content.forEach(function (item) {
			CDocument.prototype.toXmlDocContentElem(writer, item);
		});
		writer.WriteXmlNodeEnd(name);
	};
	Paragraph.prototype.fromXml = function (reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			var newItem = null;
			switch (name) {
				case "bdo":
					break;
				case "bookmarkEnd":
					break;
				case "bookmarkStart":
					break;
				case "commentRangeEnd":
					break;
				case "commentRangeStart":
					break;
				case "customXmlDelRangeEnd":
					break;
				case "customXmlDelRangeStart":
					break;
				case "customXmlInsRangeEnd":
					break;
				case "customXmlInsRangeStart":
					break;
				case "customXmlMoveFromRangeEnd":
					break;
				case "customXmlMoveFromRangeStart":
					break;
				case "customXmlMoveToRangeEnd":
					break;
				case "customXmlMoveToRangeStart":
					break;
				case "dir":
					break;
				case "fldSimple":
					break;
				case "hyperlink":
					break;
				case "moveFromRangeEnd":
					break;
				case "moveFromRangeStart":
					break;
				case "moveToRangeEnd":
					break;
				case "moveToRangeStart":
					break;
				case "oMath":
					break;
				case "oMathPara":
					break;
				case "permEnd":
					break;
				case "permStart":
					break;
				case "pPr":
					this.Pr.fromXml(reader, this);
					break;
				case "proofErr":
					break;
				case "r":
					newItem = new ParaRun(this, false);
					break;
				case "sdt":
					break;
				case "smartTag":
					break;
			}
			if (newItem) {
				newItem.fromXml(reader);
				this.AddToContent(this.GetElementsCount(), newItem);
			}
		}
	};
	Paragraph.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		if (this.Pr) {
			this.Pr.toXml(writer, "w:pPr", this);
		}
		this.Content.forEach(function (item) {
			switch (item.Type) {
				case para_Run:
					item.toXml(writer, "w:r");
					break;
				case para_Field:
					break;
				case para_Hyperlink:
					break;
				case para_Comment:
					break;
				case para_Math:
					break;
				case para_InlineLevelSdt:
					break;
				case para_Bookmark:
					break;
				case para_RevisionMove:
					break;
			}
		});
		writer.WriteXmlNodeEnd(name);
	};
	CParaPr.prototype.fromXml = function(reader, opt_paragraph) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "pStyle" : {
					var pStyle = new CT_StringStax();
					pStyle.fromXml(reader);
					this.PStyle = pStyle.getVal(undefined);
					break;
				}
				case "keepNext" : {
					var keepNext = new CT_OnOff();
					keepNext.fromXml(reader);
					this.KeepNext = keepNext.getVal(undefined);
					break;
				}
				case "keepLines" : {
					var keepLines = new CT_OnOff();
					keepLines.fromXml(reader);
					this.KeepLines = keepLines.getVal(undefined);
					break;
				}
				case "pageBreakBefore" : {
					var pageBreakBefore = new CT_OnOff();
					pageBreakBefore.fromXml(reader);
					this.PageBreakBefore = pageBreakBefore.getVal(undefined);
					break;
				}
				case "framePr" : {
					this.FramePr = new CFramePr();
					this.FramePr.fromXml(reader);
					break;
				}
				case "widowControl" : {
					var widowControl = new CT_OnOff();
					widowControl.fromXml(reader);
					this.WidowControl = widowControl.getVal(undefined);
					break;
				}
				case "numPr" : {
					this.NumPr = new CNumPr();
					this.NumPr.fromXml(reader);
					reader.context.oReadResult.paraNumPrs.push(this.NumPr);
					break;
				}
				case "suppressLineNumbers" : {
					var suppressLineNumbers = new CT_OnOff();
					suppressLineNumbers.fromXml(reader);
					this.SuppressLineNumbers = suppressLineNumbers.getVal(undefined);
					break;
				}
				case "pBdr" : {
					var pBdr = new CT_Bdr();
					pBdr.fromXml(reader);
					pBdr.toObj(this.Brd);
					break;
				}
				case "shd" : {
					this.Shd = new CDocumentShd();
					this.Shd.fromXml(reader);
					break;
				}
				case "tabs" : {
					this.Tabs = new CParaTabs();
					var subDepth = reader.GetDepth();
					while (reader.ReadNextSiblingNode(subDepth)) {
						if ("tab" === reader.GetNameNoNS()) {
							var elem = new CParaTab();
							elem.fromXml(reader);
							if (elem.IsValid()) {
								this.Tabs.Add(elem);
							}
						}
					}
					break;
				}
				// case "suppressAutoHyphens" : {
				// 	this.Suppressautohyphens = new CT_OnOff();
				// 	this.Suppressautohyphens.fromXml(reader);
				// 	break;
				// }
				// case "kinsoku" : {
				// 	this.Kinsoku = new CT_OnOff();
				// 	this.Kinsoku.fromXml(reader);
				// 	break;
				// }
				// case "wordWrap" : {
				// 	this.Wordwrap = new CT_OnOff();
				// 	this.Wordwrap.fromXml(reader);
				// 	break;
				// }
				// case "overflowPunct" : {
				// 	this.Overflowpunct = new CT_OnOff();
				// 	this.Overflowpunct.fromXml(reader);
				// 	break;
				// }
				// case "topLinePunct" : {
				// 	this.Toplinepunct = new CT_OnOff();
				// 	this.Toplinepunct.fromXml(reader);
				// 	break;
				// }
				// case "autoSpaceDE" : {
				// 	this.Autospacede = new CT_OnOff();
				// 	this.Autospacede.fromXml(reader);
				// 	break;
				// }
				// case "autoSpaceDN" : {
				// 	this.Autospacedn = new CT_OnOff();
				// 	this.Autospacedn.fromXml(reader);
				// 	break;
				// }
				// case "bidi" : {
				// 	this.Bidi = new CT_OnOff();
				// 	this.Bidi.fromXml(reader);
				// 	break;
				// }
				// case "adjustRightInd" : {
				// 	this.Adjustrightind = new CT_OnOff();
				// 	this.Adjustrightind.fromXml(reader);
				// 	break;
				// }
				// case "snapToGrid" : {
				// 	this.Snaptogrid = new CT_OnOff();
				// 	this.Snaptogrid.fromXml(reader);
				// 	break;
				// }
				case "spacing" : {
					this.Spacing = new CParaSpacing();
					this.Spacing.fromXml(reader);
					break;
				}
				case "ind" : {
					this.Ind = new CParaInd();
					this.Ind.fromXml(reader);
					break;
				}
				case "contextualSpacing" : {
					var contextualSpacing = new CT_OnOff();
					contextualSpacing.fromXml(reader);
					this.ContextualSpacing = contextualSpacing.getVal(undefined);
					break;
				}
				// case "mirrorIndents" : {
				// 	this.Mirrorindents = new CT_OnOff();
				// 	this.Mirrorindents.fromXml(reader);
				// 	break;
				// }
				// case "suppressOverlap" : {
				// 	this.Suppressoverlap = new CT_OnOff();
				// 	this.Suppressoverlap.fromXml(reader);
				// 	break;
				// }
				case "jc" : {
					var jc = new CT_StringStax();
					jc.fromXml(reader);
					this.Jc = fromXml_ST_Jc1(jc.getVal(undefined));
					break;
				}
				// case "textDirection" : {
				// 	this.Textdirection = new CT_TextDirection();
				// 	this.Textdirection.fromXml(reader);
				// 	break;
				// }
				// case "textAlignment" : {
				// 	this.Textalignment = new CT_TextAlignment();
				// 	this.Textalignment.fromXml(reader);
				// 	break;
				// }
				// case "textboxTightWrap" : {
				// 	this.Textboxtightwrap = new CT_TextboxTightWrap();
				// 	this.Textboxtightwrap.fromXml(reader);
				// 	break;
				// }
				case "outlineLvl" : {
					var outlineLvl = new CT_DecimalNumber();
					outlineLvl.fromXml(reader);
					this.OutlineLvl = outlineLvl.getValue(undefined);
					break;
				}
				// case "divId" : {
				// 	this.Divid = new CT_DecimalNumber();
				// 	this.Divid.fromXml(reader);
				// 	break;
				// }
				// case "cnfStyle" : {
				// 	this.Cnfstyle = new CT_Cnf();
				// 	this.Cnfstyle.fromXml(reader);
				// 	break;
				// }
				case "rPr" : {
					if (opt_paragraph) {
						opt_paragraph.TextPr.Value.fromXml(reader);
					}
					break;
				}
				case "sectPr" : {
					//todo paragraph
					break;
				}
				case "pPrChange" : {
					//todo paragraph
					break;
				}
			}
		}
	};
	CParaPr.prototype.toXml = function(writer, name, opt_paragraph) {
		var PStyle = CT_StringStax.prototype.fromVal(this.PStyle);
		var KeepNext = CT_OnOff.prototype.fromVal(this.KeepNext);
		var KeepLines = CT_OnOff.prototype.fromVal(this.KeepLines);
		var PageBreakBefore = CT_OnOff.prototype.fromVal(this.PageBreakBefore);
		var WidowControl = CT_OnOff.prototype.fromVal(this.WidowControl);
		var SuppressLineNumbers = CT_OnOff.prototype.fromVal(this.SuppressLineNumbers);
		var pBdr = new CT_Bdr();
		pBdr.fromObj(this.Brd);
		if (pBdr.isEmpty()) {
			pBdr = null;
		}
		var Spacing = this.Spacing.Is_Empty() ? null : this.Spacing;
		var Ind = this.Ind.Is_Empty() ? null : this.Ind;
		var ContextualSpacing = CT_OnOff.prototype.fromVal(this.ContextualSpacing);
		var OutlineLvl = CT_DecimalNumber.prototype.fromVal(this.OutlineLvl);
		var JcStr = toXml_ST_Jc1(this.Jc);
		var Jc = JcStr ? CT_StringStax.prototype.fromVal(JcStr) : null;

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(PStyle, "w:pStyle");
		writer.WriteXmlNullable(KeepNext, "w:keepNext");
		writer.WriteXmlNullable(KeepLines, "w:keepLines");
		writer.WriteXmlNullable(PageBreakBefore, "w:pageBreakBefore");
		writer.WriteXmlNullable(this.FramePr, "w:framePr");
		writer.WriteXmlNullable(WidowControl, "w:widowControl");
		writer.WriteXmlNullable(this.NumPr, "w:numPr");//todo
		writer.WriteXmlNullable(SuppressLineNumbers, "w:suppressLineNumbers");
		writer.WriteXmlNullable(pBdr, "w:pBdr");
		writer.WriteXmlNullable(this.Shd, "w:shd");
		// writer.WriteXmlArray(this.Tabs, "w:tabs");//todo
		// writer.WriteXmlNullable(this.Suppressautohyphens, "w:suppressAutoHyphens");
		// writer.WriteXmlNullable(this.Kinsoku, "w:kinsoku");
		// writer.WriteXmlNullable(this.Wordwrap, "w:wordWrap");
		// writer.WriteXmlNullable(this.Overflowpunct, "w:overflowPunct");
		// writer.WriteXmlNullable(this.Toplinepunct, "w:topLinePunct");
		// writer.WriteXmlNullable(this.Autospacede, "w:autoSpaceDE");
		// writer.WriteXmlNullable(this.Autospacedn, "w:autoSpaceDN");
		// writer.WriteXmlNullable(this.Bidi, "w:bidi");
		// writer.WriteXmlNullable(this.Adjustrightind, "w:adjustRightInd");
		// writer.WriteXmlNullable(this.Snaptogrid, "w:snapToGrid");
		writer.WriteXmlNullable(Spacing, "w:spacing");
		writer.WriteXmlNullable(Ind, "w:ind");
		writer.WriteXmlNullable(ContextualSpacing, "w:contextualSpacing");
		// writer.WriteXmlNullable(this.Mirrorindents, "w:mirrorIndents");
		// writer.WriteXmlNullable(this.Suppressoverlap, "w:suppressOverlap");
		writer.WriteXmlNullable(Jc, "w:jc");
		// writer.WriteXmlNullable(this.Textdirection, "w:textDirection");
		// writer.WriteXmlNullable(this.Textalignment, "w:textAlignment");
		// writer.WriteXmlNullable(this.Textboxtightwrap, "w:textboxTightWrap");
		writer.WriteXmlNullable(OutlineLvl, "w:outlineLvl");
		// writer.WriteXmlNullable(this.Divid, "w:divId");
		// writer.WriteXmlNullable(this.Cnfstyle, "w:cnfStyle");
		if (opt_paragraph) {
			writer.WriteXmlNullable(opt_paragraph.TextPr.Value, "w:rPr");
			writer.WriteXmlNullable(this.Sectpr, "w:sectPr");
			writer.WriteXmlNullable(this.Pprchange, "w:pPrChange");
		}
		writer.WriteXmlNodeEnd(name);
	};
	CFramePr.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "dropCap": {
					this.DropCap = fromXml_ST_DropCap(reader.GetValue());
					break;
				}
				case "lines": {
					this.Lines = reader.GetValueInt();
					break;
				}
				case "w": {
					this.W = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				case "h": {
					this.H = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				case "vSpace": {
					this.VSpace = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				case "hSpace": {
					this.HSpace = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				case "wrap": {
					this.Wrap = fromXml_ST_Wrap(reader.GetValue());
					break;
				}
				case "hAnchor": {
					this.HAnchor = fromXml_ST_HAnchor(reader.GetValue());
					break;
				}
				case "vAnchor": {
					this.VAnchor = fromXml_ST_VAnchor(reader.GetValue());
					break;
				}
				case "x": {
					var x = AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt, null);
					if(null !== x) {
						if (-4 === x * AscCommonWord.g_dKoef_pt_to_twips) {
							this.YAlign = Asc.c_oAscXAlign.Center;
						} else {
							this.Y = x * AscCommonWord.g_dKoef_pt_to_mm;
						}
					}
					break;
				}
				case "xAlign": {
					this.XAlign = fromXml_ST_XAlign(reader.GetValue());
					break;
				}
				case "y": {
					var y = AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt, null);
					if(null !== y) {
						if (-4 === y * AscCommonWord.g_dKoef_pt_to_twips) {
							this.YAlign = Asc.c_oAscYAlign.Top;
						} else {
							this.Y = y * AscCommonWord.g_dKoef_pt_to_mm;
						}
					}
					break;
				}
				case "yAlign": {
					this.YAlign = fromXml_ST_YAlign(reader.GetValue());
					break;
				}
				case "hRule": {
					this.HRule = fromXml_ST_HeightRule(reader.GetValue());
					break;
				}
				// case "anchorLock": {
				// 	this.anchorLock = reader.GetValueDecodeXml();
				// 	break;
				// }
			}
		}
	};
	CFramePr.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CFramePr.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:dropCap", toXml_ST_DropCap(this.DropCap));
		writer.WriteXmlNullableAttributeIntWithKoef("w:lines", this.Lines, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeIntWithKoef("w:w", this.W, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeIntWithKoef("w:h", this.H, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeIntWithKoef("w:vSpace", this.VSpace, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeIntWithKoef("w:hSpace", this.HSpace, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeString("w:wrap", toXml_ST_Wrap(this.Wrap));
		writer.WriteXmlNullableAttributeString("w:hAnchor", toXml_ST_HAnchor(this.HAnchor));
		writer.WriteXmlNullableAttributeString("w:vAnchor", toXml_ST_VAnchor(this.WAnchor));
		writer.WriteXmlNullableAttributeIntWithKoef("w:x", this.X, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeString("w:xAlign", toXml_ST_XAlign(this.XAlign));
		writer.WriteXmlNullableAttributeIntWithKoef("w:y", this.Y, g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeString("w:yAlign", toXml_ST_YAlign(this.YAlign));
		writer.WriteXmlNullableAttributeString("w:hRule", toXml_ST_HeightRule(this.HRule));
		// writer.WriteXmlNullableAttributeString("w:anchorLock", this.anchorLock);
		writer.WriteXmlAttributesEnd(true);
	};
	CNumPr.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "ilvl" : {
					var ilvl = new CT_DecimalNumber();
					this.Lvl = ilvl.getValue(undefined);
					break;
				}
				case "numId" : {
					var numId = new CT_DecimalNumber();
					this.NumId = numId.getValue(undefined);
					break;
				}
				// case "ins" : {
				// 	this.ins = new CT_TrackChange();
				// 	this.ins.fromXml(reader);
				// 	break;
				// }
			}
		}
	};
	CNumPr.prototype.toXml = function(writer, name) {
		var ilvl = new CT_DecimalNumber();
		ilvl.val = this.Lvl;
		var numId = new CT_DecimalNumber();
		numId.val = parseInt(this.NumId) || 0;

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(ilvl, "w:ilvl");
		writer.WriteXmlNullable(numId, "w:numId");
		// writer.WriteXmlNullable(this.ins, "w:ins");
		writer.WriteXmlNodeEnd(name);
	};
	CDocumentShd.prototype.readAttr = function(reader) {
		var themeColor = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		var themeFill = new CT_Color("fill", "themeFill", "themeFillTint", "themeFillShade");
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			if("val" === name) {
				this.Value = fromXml_ST_Shd(reader.GetValue());
			} else if(!themeColor.readAttrElem(reader, name)) {
				themeFill.readAttrElem(reader, name)
			}
		}
		this.Color = themeColor.getColor();
		this.Unifill = themeColor.getUnifill();
		this.Fill = themeFill.getUnifill();
		this.themeFill = themeFill.getUnifill();
	};
	CDocumentShd.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CDocumentShd.prototype.toXml = function(writer, name) {
		var themeColor = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		themeColor.setColor(this.Color);
		themeColor.setUniFill(this.Unifill);
		var themeFill = new CT_Color("fill", "themeFill", "themeFillTint", "themeFillShade");
		themeFill.setColor(this.Fill);
		themeColor.setUniFill(this.themeFill);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:val", toXml_ST_Shd(this.Value));
		themeColor.toXmlElems(writer);
		themeFill.toXmlElems(writer);
		writer.WriteXmlAttributesEnd(true);
	};
	CParaTab.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.Val = fromXml_ST_TabJc(reader.GetValue());
					break;
				}
				case "leader": {
					this.Leader = fromXml_ST_TabTlc(reader.GetValue());
					break;
				}
				case "pos": {
					this.Pos = AscCommon.universalMeasureToMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
			}
		}
	};
	CParaTab.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CParaTab.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:val", toXml_ST_TabJc(this.Val));
		writer.WriteXmlNullableAttributeString("w:leader", toXml_ST_TabTlc(this.Leader));
		writer.WriteXmlNullableAttributeIntWithKoef("w:pos", this.Pos, g_dKoef_mm_to_twips);
		writer.WriteXmlAttributesEnd(true);
	};
	CParaSpacing.prototype.readAttr = function(reader) {
		var linePt = null;
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "before": {
					this.Before = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "beforeLines": {
				// 	this.Beforelines = reader.GetValueInt();
				// 	break;
				// }
				case "beforeAutospacing": {
					this.BeforeAutoSpacing = reader.GetValueBool();
					break;
				}
				case "after": {
					this.After = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "afterLines": {
				// 	this.Afterlines = reader.GetValueInt();
				// 	break;
				// }
				case "afterAutospacing": {
					this.AfterAutoSpacing = reader.GetValueBool();
					break;
				}
				case "line": {
					linePt = AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt, undefined);
					break;
				}
				case "lineRule": {
					this.LineRule = fromXml_ST_LineSpacingRule(reader.GetValue());
					break;
				}
			}
		}
		if (null !== linePt) {
			this.SetLineTwips(linePt * AscCommonWord.g_dKoef_pt_to_twips);
		}
	};
	CParaSpacing.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CParaSpacing.prototype.toXml = function(writer, name) {
		var lineKoef = Asc.linerule_Auto === this.LineRule ? 240 : AscCommonWord.g_dKoef_mm_to_twips;

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeIntWithKoef("w:before", this.Before, AscCommonWord.g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:beforeLines", this.Beforelines);
		writer.WriteXmlNullableAttributeBool("w:beforeAutospacing", this.BeforeAutoSpacing);
		writer.WriteXmlNullableAttributeIntWithKoef("w:after", this.After, AscCommonWord.g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:afterLines", this.Afterlines);
		writer.WriteXmlNullableAttributeBool("w:afterAutospacing", this.AfterAutoSpacing);
		writer.WriteXmlNullableAttributeIntWithKoef("w:line", this.Line, lineKoef);
		writer.WriteXmlNullableAttributeString("w:lineRule", toXml_ST_LineSpacingRule(this.LineRule));
		writer.WriteXmlAttributesEnd(true);
	};
	CParaInd.prototype.readAttr = function(reader) {
		var Hanging = undefined;
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "start":
				case "left": {
					this.Left = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "startChars": {
				// 	this.Startchars = reader.GetValueInt();
				// 	break;
				// }
				case "right":
				case "end": {
					this.Right = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "endChars": {
				// 	this.Endchars = reader.GetValueInt();
				// 	break;
				// }
				case "hanging": {
					Hanging = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "hangingChars": {
				// 	this.Hangingchars = reader.GetValueInt();
				// 	break;
				// }
				case "firstLine": {
					this.FirstLine = AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "firstLineChars": {
				// 	this.Firstlinechars = reader.GetValueInt();
				// 	break;
				// }
			}
			if (undefined !== Hanging) {
				this.FirstLine = -Hanging;
			}
		}
	};
	CParaInd.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CParaInd.prototype.toXml = function(writer, name) {
		var Hanging = null;
		var FirstLine = this.FirstLine;
		if (FirstLine < 0) {
			FirstLine = null;
			Hanging = Math.abs(FirstLine);
		}
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeIntWithKoef("w:left", this.Left, g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:startChars", this.Startchars);
		writer.WriteXmlNullableAttributeIntWithKoef("w:right", this.Right, g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:endChars", this.Endchars);
		writer.WriteXmlNullableAttributeIntWithKoef("w:hanging", Hanging, g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:hangingChars", this.Hangingchars);
		writer.WriteXmlNullableAttributeIntWithKoef("w:firstLine", FirstLine, g_dKoef_mm_to_twips);
		// writer.WriteXmlNullableAttributeNumber("w:firstLineChars", this.Firstlinechars);
		writer.WriteXmlAttributesEnd(true);
	};
	ParaRun.prototype.fromXml = function (reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			var newItem;
			switch (name) {
				case "annotationRef":
					break;
				case "br":
					break;
				case "commentReference":
					break;
				case "contentPart":
					break;
				case "continuationSeparator":
					break;
				case "cr":
					break;
				case "dayLong":
					break;
				case "dayShort":
					break;
				case "delInstrText":
					break;
				case "delText":
					break;
				case "drawing":
					break;
				case "endnoteRef":
					break;
				case "endnoteReference":
					break;
				case "fldChar":
					break;
				case "footnoteRef":
					break;
				case "footnoteReference":
					break;
				case "instrText":
					break;
				case "lastRenderedPageBreak":
					break;
				case "monthLong":
					break;
				case "monthShort":
					break;
				case "noBreakHyphen":
					break;
				case "object":
					break;
				case "pgNum":
					break;
				case "pict":
					break;
				case "ptab":
					break;
				case "rPr":
					var textPr = new CTextPr();
					textPr.fromXml(reader);
					this.Set_Pr(textPr);
					break;
				case "ruby":
					break;
				case "separator":
					break;
				case "softHyphen":
					break;
				case "sym":
					break;
				case "t":
					this.AddText(reader.GetTextDecodeXml(), -1);
					break;
				case "tab":
					break;
				case "yearLong":
					break;
				case "yearShort":
					break;
			}
		}
	};
	ParaRun.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		if (this.Pr) {
			this.Pr.toXml(writer, "w:rPr");
		}
		//todo
		var oText = new CParagraphGetText();
		oText.SetBreakOnNonText(false);
		oText.SetParaEndToSpace(false);
		this.Get_Text(oText);
		if (oText.Text) {
			writer.WriteXmlNodeStart("w:t");
			writer.WriteXmlString(" xml:space=\"preserve\"");
			writer.WriteXmlAttributesEnd();
			writer.WriteXmlStringEncode(oText.Text);
			writer.WriteXmlNodeEnd("w:t");
		}
		writer.WriteXmlNodeEnd(name);
	};
	CTextPr.prototype.fromXml = function (reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "rStyle" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.RStyle = elem.getVal(undefined);
					break;
				}
				case "rFonts" : {
					elem = new CRFonts();
					elem.fromXml(reader);
					this.RFonts = elem;
					break;
				}
				case "b" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Bold = elem.getVal(undefined);
					break;
				}
				case "bCs" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.BoldCS = elem.getVal(undefined);
					break;
				}
				case "i" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Italic = elem.getVal(undefined);
					break;
				}
				case "iCs" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.ItalicCS = elem.getVal(undefined);
					break;
				}
				case "caps" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Caps = elem.getVal(undefined);
					break;
				}
				case "smallCaps" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.SmallCaps = elem.getVal(undefined);
					break;
				}
				case "strike" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Strikeout = elem.getVal(undefined);
					break;
				}
				case "dstrike" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.DStrikeout = elem.getVal(undefined);
					break;
				}
				// case "outline" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Outline.push(elem);
				// 	break;
				// }
				// case "shadow" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Shadow.push(elem);
				// 	break;
				// }
				// case "emboss" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Emboss.push(elem);
				// 	break;
				// }
				// case "imprint" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Imprint.push(elem);
				// 	break;
				// }
				// case "noProof" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Noproof.push(elem);
				// 	break;
				// }
				// case "snapToGrid" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Snaptogrid.push(elem);
				// 	break;
				// }
				case "vanish" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Vanish = elem.getVal(undefined);
					break;
				}
				// case "webHidden" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Webhidden.push(elem);
				// 	break;
				// }
				case "color" : {
					elem = new CT_Color("val", "themeColor", "themeTint", "themeShade");
					elem.fromXml(reader);
					this.Color = elem.getColor();
					this.Unifill = elem.getUnifill();
					break;
				}
				case "spacing" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Spacing = AscCommon.universalMeasureToMm(elem.getVal(undefined), AscCommonWord.g_dKoef_twips_to_mm, undefined);
					break;
				}
				// case "w" : {
				// 	elem = new CT_TextScale();
				// 	elem.fromXml(reader);
				// 	this.W.push(elem);
				// 	break;
				// }
				// case "kern" : {
				// 	elem = new CT_HpsMeasure();
				// 	elem.fromXml(reader);
				// 	this.Kern.push(elem);
				// 	break;
				// }
				case "position" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Position = AscCommon.universalMeasureToMm(elem.getVal(undefined), AscCommonWord.g_dKoef_pt_to_mm / 2, undefined);
					break;
				}
				case "sz" : {
					elem = new CT_UnsignedDecimalNumber();
					elem.fromXml(reader);
					var fontSize = elem.getVal(undefined);
					if(undefined !== fontSize) {
						this.FontSize = fontSize / 2;
					}
					break;
				}
				case "szCs" : {
					elem = new CT_UnsignedDecimalNumber();
					elem.fromXml(reader);
					var fontSizeCS = elem.getVal(undefined);
					if(undefined !== fontSizeCS) {
						this.FontSizeCS = fontSizeCS / 2;
					}
					break;
				}
				case "highlight" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					if (AscFormat.mapPrstColor[elem.getVal(undefined)]) {
						var highlight = new CDocumentColor(255, 255, 255);
						highlight.SetFromHexColor(elem.getVal(undefined));
						if (highlight.IsAuto()) {
							this.Highlight = highlight_None;
						} else {
							this.Highlight = highlight;
						}
					}
					break;
				}
				case "u" : {
					elem = new CT_Underline();
					elem.fromXml(reader);
					this.Underline = elem.Val;
					break;
				}
				// case "effect" : {
				// 	elem = new CT_TextEffect();
				// 	elem.fromXml(reader);
				// 	this.Effect.push(elem);
				// 	break;
				// }
				// case "bdr" : {
				// 	elem = new CT_Border();
				// 	elem.fromXml(reader);
				// 	this.Bdr.push(elem);
				// 	break;
				// }
				case "shd" : {
					this.Shd = new CDocumentShd();
					this.Shd.fromXml(reader);
					break;
				}
				// case "fitText" : {
				// 	elem = new CT_FitText();
				// 	elem.fromXml(reader);
				// 	this.Fittext.push(elem);
				// 	break;
				// }
				case "vertAlign" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.VertAlign = fromXml_ST_VerticalAlignRun(elem.getVal(undefined));
					break;
				}
				case "rtl" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.RTL = elem.getVal(undefined);
					break;
				}
				case "cs" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.CS = elem.getVal(undefined);
					break;
				}
				// case "em" : {
				// 	elem = new CT_Em();
				// 	elem.fromXml(reader);
				// 	this.Em.push(elem);
				// 	break;
				// }
				case "lang" : {
					elem = new CLang();
					elem.fromXml(reader);
					this.Lang = elem;
					break;
				}
				// case "eastAsianLayout" : {
				// 	elem = new CT_EastAsianLayout();
				// 	elem.fromXml(reader);
				// 	this.Eastasianlayout.push(elem);
				// 	break;
				// }
				// case "specVanish" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Vanish = elem.getVal(undefined);
				// 	break;
				// }
				// case "oMath" : {
				// 	elem = new CT_OnOff();
				// 	elem.fromXml(reader);
				// 	this.Omath.push(elem);
				// 	break;
				// }
				case "rPrChange" : {
					//todo
					// this.Rprchange = new CT_RPrChange();
					// this.Rprchange.fromXml(reader);
					break;
				}
			}
		}
	};
	CTextPr.prototype.toXml = function (writer, name) {
		var RStyle = CT_StringStax.prototype.fromVal(this.RStyle);
		var RFonts = this.RFonts && this.RFonts.Is_Empty() ? null : this.RFonts;
		var Bold = CT_OnOff.prototype.fromVal(this.Bold);
		var BoldCS = CT_OnOff.prototype.fromVal(this.BoldCS);
		var Italic = CT_OnOff.prototype.fromVal(this.Italic);
		var ItalicCS = CT_OnOff.prototype.fromVal(this.ItalicCS);
		var Caps = CT_OnOff.prototype.fromVal(this.Caps);
		var SmallCaps = CT_OnOff.prototype.fromVal(this.SmallCaps);
		var Strikeout = CT_OnOff.prototype.fromVal(this.Strikeout);
		var DStrikeout = CT_OnOff.prototype.fromVal(this.DStrikeout);
		var Vanish = CT_OnOff.prototype.fromVal(this.Vanish);
		var Color = new CT_Color("val", "themeColor", "themeTint", "themeShade");
		Color.setColor(this.Color);
		Color.setUniFill(this.Unifill);
		var Spacing;
		if(undefined !== this.Spacing) {
			Spacing = CT_DecimalNumber.prototype.fromVal(this.Spacing * g_dKoef_mm_to_twips);
		}
		var Position;
		if(undefined !== this.Position) {
			Position = CT_DecimalNumber.prototype.fromVal(this.Position * g_dKoef_mm_to_pt * 2);
		}
		var FontSize;
		if(undefined !== this.FontSize) {
			FontSize = CT_UnsignedDecimalNumber.prototype.fromVal(this.FontSize * 2);
		}
		var FontSizeCS;
		if(undefined !== this.FontSizeCS) {
			FontSizeCS = CT_UnsignedDecimalNumber.prototype.fromVal(this.FontSizeCS * 2);
		}
		var Highlight;
		if(undefined !== this.Highlight) {
			Highlight = CT_StringStax.prototype.fromVal(highlight_None !== this.Highlight ? this.Highlight.ToHexColor() : "none");
		}
		var Underline;
		if(undefined !== this.Underline) {
			Underline = new Underline();
			Underline.Val = this.Underline;
		}
		if(undefined !== this.Underline) {
			Underline = new Underline();
			Underline.Val = this.Underline;
		}
		var VertAlign = CT_StringStax.prototype.fromVal(toXml_ST_VerticalAlignRun(this.VertAlign));
		var RTL = CT_OnOff.prototype.fromVal(this.RTL);
		var CS = CT_OnOff.prototype.fromVal(this.CS);
		var Lang = this.Lang && this.Lang.Is_Empty() ? null : this.Lang;

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(RStyle, "w:rStyle");
		writer.WriteXmlNullable(RFonts, "w:rFonts");
		writer.WriteXmlNullable(Bold, "w:b");
		writer.WriteXmlNullable(BoldCS, "w:bCs");
		writer.WriteXmlNullable(Italic, "w:i");
		writer.WriteXmlNullable(ItalicCS, "w:iCs");
		writer.WriteXmlNullable(Caps, "w:caps");
		writer.WriteXmlNullable(SmallCaps, "w:smallCaps");
		writer.WriteXmlNullable(Strikeout, "w:strike");
		writer.WriteXmlNullable(DStrikeout, "w:dstrike");
		// writer.WriteXmlNullable(this.Outline, "w:outline");
		// writer.WriteXmlNullable(this.Shadow, "w:shadow");
		// writer.WriteXmlNullable(this.Emboss, "w:emboss");
		// writer.WriteXmlNullable(this.Imprint, "w:imprint");
		// writer.WriteXmlNullable(this.NoProof, "w:noProof");
		// writer.WriteXmlNullable(this.SnapToGrid, "w:snapToGrid");
		writer.WriteXmlNullable(Vanish, "w:vanish");
		// writer.WriteXmlNullable(this.WebHidden, "w:webHidden");
		if (!Color.isEmpty()) {
			Color.toXml(writer, "w:color");
		}
		writer.WriteXmlNullable(Spacing, "w:spacing");
		// writer.WriteXmlNullable(this.W, "w:w");
		// writer.WriteXmlNullable(this.Kern, "w:kern");
		writer.WriteXmlNullable(Position, "w:position");
		writer.WriteXmlNullable(FontSize, "w:sz");
		writer.WriteXmlNullable(FontSizeCS, "w:szCs");
		writer.WriteXmlNullable(Highlight, "w:highlight");
		writer.WriteXmlNullable(Underline, "w:u");
		// writer.WriteXmlNullable(this.Effect, "w:effect");
		// writer.WriteXmlNullable(this.Bdr, "w:bdr");
		writer.WriteXmlNullable(this.Shd, "w:shd");
		// writer.WriteXmlNullable(this.FitText, "w:fitText");
		writer.WriteXmlNullable(VertAlign, "w:vertAlign");
		writer.WriteXmlNullable(RTL, "w:rtl");
		writer.WriteXmlNullable(CS, "w:cs");
		// writer.WriteXmlNullable(this.Em, "w:em");
		writer.WriteXmlNullable(Lang, "w:lang");
		// writer.WriteXmlNullable(this.EastAsianLayout, "w:eastAsianLayout");
		// writer.WriteXmlNullable(Vanish, "w:specVanish");
		// writer.WriteXmlNullable(this.OMath, "w:oMath");
		//todo
		writer.WriteXmlNullable(this.RPrChange, "w:rPrChange");
		writer.WriteXmlNodeEnd(name);
	};
	CRFonts.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "hint": {
					this.Hint = fromXml_ST_Hint(reader.GetValue());
					break;
				}
				case "ascii": {
					this.Ascii = {Name: reader.GetValueDecodeXml(), Index: -1};
					break;
				}
				case "hAnsi": {
					this.Hansi = {Name: reader.GetValueDecodeXml(), Index: -1};
					break;
				}
				case "eastAsia": {
					this.Eastasia = {Name: reader.GetValueDecodeXml(), Index: -1};
					break;
				}
				case "cs": {
					this.Cs = {Name: reader.GetValueDecodeXml(), Index: -1};
					break;
				}
				case "asciiTheme": {
					this.AsciiTheme = reader.GetValue();
					break;
				}
				case "hAnsiTheme": {
					this.HAnsiTheme = reader.GetValue();
					break;
				}
				case "eastAsiaTheme": {
					this.EastAsiaTheme = reader.GetValue();
					break;
				}
				case "cstheme": {
					this.CSTheme = reader.GetValue();
					break;
				}
			}
		}
	};
	CRFonts.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CRFonts.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:hint", toXml_ST_Hint(this.Hint));
		writer.WriteXmlNullableAttributeStringEncode("w:ascii", this.Ascii);
		writer.WriteXmlNullableAttributeStringEncode("w:hAnsi", this.Hansi);
		writer.WriteXmlNullableAttributeStringEncode("w:eastAsia", this.Eastasia);
		writer.WriteXmlNullableAttributeStringEncode("w:cs", this.Cs);
		writer.WriteXmlNullableAttributeString("w:asciiTheme", this.AsciiTheme);
		writer.WriteXmlNullableAttributeString("w:hAnsiTheme", this.HAnsiTheme);
		writer.WriteXmlNullableAttributeString("w:eastAsiaTheme", this.EastAsiaTheme);
		writer.WriteXmlNullableAttributeString("w:cstheme", this.CSTheme);
		writer.WriteXmlAttributesEnd(true);
	};
	CLang.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.Val = Asc.g_oLcidNameToIdMap[reader.GetValue()];
					break;
				}
				case "eastAsia": {
					this.EastAsia = Asc.g_oLcidNameToIdMap[reader.GetValue()];
					break;
				}
				case "bidi": {
					this.Bidi = Asc.g_oLcidNameToIdMap[reader.GetValue()];
					break;
				}
			}
		}
	};
	CLang.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CLang.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeStringEncode("w:val", Asc.g_oLcidIdToNameMap[this.Val]);
		writer.WriteXmlNullableAttributeStringEncode("w:eastAsia", Asc.g_oLcidIdToNameMap[this.EastAsia]);
		writer.WriteXmlNullableAttributeStringEncode("w:bidi", Asc.g_oLcidIdToNameMap[this.Bidi]);
		writer.WriteXmlAttributesEnd(true);
	};

	function CT_StringStax() {
		this.val = null;
		return this;
	}
	CT_StringStax.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.val = reader.GetValueDecodeXml();
					break;
				}
			}
		}
	};
	CT_StringStax.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_StringStax.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeStringEncode("w:val", this.val);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_StringStax.prototype.fromVal = function(val) {
		var res = null;
		if (null !== val && undefined !== val) {
			res = new CT_StringStax();
			res.val = val;
		}
		return res;
	};
	CT_StringStax.prototype.getVal = function(def) {
		return this.val || def;
	};
	function CT_OnOff() {
		this.val = null;
		return this;
	}
	CT_OnOff.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.val = reader.GetValueBool();
					break;
				}
			}
		}
	};
	CT_OnOff.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_OnOff.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeBool("w:val", this.val);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_OnOff.prototype.fromVal = function(val) {
		var res = null;
		if (null !== val && undefined !== val) {
			res = new CT_OnOff();
			res.val = val;
		}
		return res;
	};
	CT_OnOff.prototype.getVal = function(def) {
		return this.val || def;
	};
	function CT_DecimalNumber() {
		this.val = null;
		return this;
	}
	CT_DecimalNumber.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.val = reader.GetValueInt();
					break;
				}
			}
		}
	};
	CT_DecimalNumber.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_DecimalNumber.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeInt("w:val", this.val);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_DecimalNumber.prototype.fromVal = function(val) {
		var res = null;
		if (null !== val && undefined !== val) {
			res = new CT_DecimalNumber();
			res.val = val;
		}
		return res;
	};
	CT_DecimalNumber.prototype.getVal = function(def) {
		return this.val || def;
	};
	function CT_UnsignedDecimalNumber() {
		this.val = null;
		return this;
	}
	CT_UnsignedDecimalNumber.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.val = reader.GetValueUInt();
					break;
				}
			}
		}
	};
	CT_UnsignedDecimalNumber.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_UnsignedDecimalNumber.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeUInt("w:val", this.val);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_UnsignedDecimalNumber.prototype.fromVal = function(val) {
		var res = null;
		if (null !== val && undefined !== val) {
			res = new CT_UnsignedDecimalNumber();
			res.val = val;
		}
		return res;
	};
	CT_UnsignedDecimalNumber.prototype.getVal = function(def) {
		return this.val || def;
	};
	function CT_Bdr() {
		this.Top = null;
		this.Left = null;
		this.Bottom = null;
		this.Right = null;
		this.Between = null;
		this.Bar = null;
		this.InsideH = null;
		this.InsideV = null;
		return this;
	}
	CT_Bdr.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "top" : {
					this.Top = new CDocumentBorder();
					this.Top.fromXml(reader);
					break;
				}
				case "left" : {
					this.Left = new CDocumentBorder();
					this.Left.fromXml(reader);
					break;
				}
				case "bottom" : {
					this.Bottom = new CDocumentBorder();
					this.Bottom.fromXml(reader);
					break;
				}
				case "right" : {
					this.Right = new CDocumentBorder();
					this.Right.fromXml(reader);
					break;
				}
				case "between" : {
					this.Between = new CDocumentBorder();
					this.Between.fromXml(reader);
					break;
				}
				case "bar" : {
					this.Bar = new CDocumentBorder();
					this.Bar.fromXml(reader);
					break;
				}
				case "insideH" : {
					this.InsideH = new CDocumentBorder();
					this.InsideH.fromXml(reader);
					break;
				}
				case "insideV" : {
					this.InsideV = new CDocumentBorder();
					this.InsideV.fromXml(reader);
					break;
				}
			}
		}
	};
	CT_Bdr.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.Top, "w:top");
		writer.WriteXmlNullable(this.Left, "w:left");
		writer.WriteXmlNullable(this.Bottom, "w:bottom");
		writer.WriteXmlNullable(this.Right, "w:right");
		writer.WriteXmlNullable(this.Between, "w:between");
		writer.WriteXmlNullable(this.Bar, "w:bar");
		writer.WriteXmlNullable(this.InsideH, "w:insideH");
		writer.WriteXmlNullable(this.InsideV, "w:insideV");
		writer.WriteXmlNodeEnd(name);
	};
	CT_Bdr.prototype.fromObj = function(obj) {
		for(var elem in obj) {
			if(obj.hasOwnProperty(elem) && obj[elem]) {
				this[elem] = obj[elem];
			}
		}
	};
	CT_Bdr.prototype.toObj = function(obj) {
		for(var elem in this) {
			if(this.hasOwnProperty(elem) && this[elem]) {
				obj[elem] = this[elem];
			}
		}
	};
	CT_Bdr.prototype.isEmpty = function() {
		for(var elem in this) {
			if(this.hasOwnProperty(elem) && this[elem]) {
				return false;
			}
		}
		return true;
	};
	CDocumentBorder.prototype.readAttr = function(reader) {
		var themeColor = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			switch (name) {
				case "val": {
					this.Value = fromXml_ST_Border(reader.GetValue());
					break;
				}
				case "sz": {
					this.setSizeIn8Point(reader.GetValueUInt());
					break;
				}
				case "space": {
					this.setSpaceInPoint(reader.GetValueUInt());
					break;
				}
// 				case "shadow": {
// 					this.Shadow = reader.GetValueDecodeXml();
// 					break;
// 				}
// 				case "frame": {
// 					this.Frame = reader.GetValueDecodeXml();
// 					break;
// 				}
				default:
					themeColor.readAttrElem(reader, name);
					break;
			}
		}
		this.Color = themeColor.getColor();
		this.Unifill = themeColor.getUnifill();
	};
	CDocumentBorder.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CDocumentBorder.prototype.toXml = function(writer, name) {
		var themeColor = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		themeColor.setColor(this.Color);
		themeColor.setUniFill(this.Unifill);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:val", toXml_ST_Border(this.Value));
		themeColor.toXmlElems(writer);
		writer.WriteXmlNullableAttributeUInt("w:sz", this.getSizeIn8Point());
		writer.WriteXmlNullableAttributeUInt("w:space", this.getSpaceInPoint());
// 		writer.WriteXmlNullableAttributeStringEncode("w:shadow", this.Shadow);
// 		writer.WriteXmlNullableAttributeStringEncode("w:frame", this.Frame);
		writer.WriteXmlAttributesEnd(true);
	};
	function CT_Color(xmlVal, xmlThemeColor, xmlThemeTint, xmlThemeShade) {
		this.xmlVal = xmlVal;
		this.xmlThemeColor = xmlThemeColor;
		this.xmlThemeTint = xmlThemeTint;
		this.xmlThemeShade = xmlThemeShade;

		this.Val = null;
		this.ThemeColor = null;
		this.ThemeTint = null;
		this.ThemeShade = null;
		return this;
	}
	CT_Color.prototype.readAttrElem = function(reader, name) {
		if (this.xmlVal === name) {
			this.Val = reader.GetValueDecodeXml();
		} else if (this.xmlThemeColor === name) {
			this.ThemeColor = fromXml_ST_ThemeColor(reader.GetValue());
		} else if (this.xmlThemeTint === name) {
			this.ThemeTint = reader.GetValueByte(16);
		} else if (this.xmlThemeShade === name) {
			this.ThemeShade = reader.GetValueByte(16);
		} else {
			return false;
		}
	};
	CT_Color.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			this.readAttrElem(reader, name);
		}
	};
	CT_Color.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_Color.prototype.toXmlElems = function(writer) {
		var ThemeTint = null !== this.ThemeTint ? AscCommon.ByteToHex(this.ThemeTint).toUpperCase() : null;
		var ThemeShade = null !== this.ThemeShade ? AscCommon.ByteToHex(this.ThemeShade).toUpperCase() : null;
		writer.WriteXmlNullableAttributeStringEncode("w:" + this.xmlVal, this.Val);
		writer.WriteXmlNullableAttributeString("w:" + this.xmlThemeColor, toXml_ST_ThemeColor(this.ThemeColor));
		writer.WriteXmlNullableAttributeString("w:" + this.xmlThemeTint, ThemeTint);
		writer.WriteXmlNullableAttributeString("w:" + this.xmlThemeShade, ThemeShade);
	};
	CT_Color.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		this.toXmlElems(writer);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_Color.prototype.isEmpty = function() {
		return null === this.Val && null === this.ThemeColor &&null === this.ThemeTint &&null === this.ThemeShade;
	};
	CT_Color.prototype.getColor = function(defR, defG, defB) {
		if (this.Val) {
			var color = new CDocumentColor(defR, defG, defB);
			color.SetFromHexColor(this.Val);
			return color;
		}
		return undefined;
	};
	CT_Color.prototype.setColor = function(val) {
		this.Val = val ? val.ToHexColor() : null;
	};
	CT_Color.prototype.getUnifill = function() {
		var unifill = AscCommonWord.CreateThemeUnifill(this.ThemeColor, this.ThemeTint, this.ThemeShade);
		return null != unifill ? unifill : undefined;
	};
	CT_Color.prototype.setUniFill = function(val) {
		var obj = AscCommonWord.CreateFromThemeUnifill(val);
		this.ThemeColor = obj.Color;
		this.ThemeTint = obj.Tint;
		this.ThemeShade = obj.Shade;
	};
	function CT_Underline() {
		this.Val = undefined;
		this.Color = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		return this;
	}
	CT_Underline.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			switch (name) {
				case "val": {
					this.Val = fromXml_ST_Underline(reader.GetValue());
					break;
				}
				default:
					this.Color.readAttrElem(reader, name);
					break;
			}
		}
	};
	CT_Underline.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_Underline.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:val", toXml_ST_Underline(this.Val));
		this.Color.toXmlElems(writer);
		writer.WriteXmlAttributesEnd(true);
	};

	function fromXml_ST_Border(val) {
		switch (val) {
			case "nil":
				return border_None;
			case "none":
				return border_None;
			case "single":
				return border_Single;
			case "thick":
				return border_Single;
			case "double":
				return border_Single;
			case "dotted":
				return border_Single;
			case "dashed":
				return border_Single;
			case "dotDash":
				return border_Single;
			case "dotDotDash":
				return border_Single;
			case "triple":
				return border_Single;
			case "thinThickSmallGap":
				return border_Single;
			case "thickThinSmallGap":
				return border_Single;
			case "thinThickThinSmallGap":
				return border_Single;
			case "thinThickMediumGap":
				return border_Single;
			case "thickThinMediumGap":
				return border_Single;
			case "thinThickThinMediumGap":
				return border_Single;
			case "thinThickLargeGap":
				return border_Single;
			case "thickThinLargeGap":
				return border_Single;
			case "thinThickThinLargeGap":
				return border_Single;
			case "wave":
				return border_Single;
			case "doubleWave":
				return border_Single;
			case "dashSmallGap":
				return border_Single;
			case "dashDotStroked":
				return border_Single;
			case "threeDEmboss":
				return border_Single;
			case "threeDEngrave":
				return border_Single;
			case "outset":
				return border_Single;
			case "inset":
				return border_Single;
			case "apples":
				return border_Single;
			case "archedScallops":
				return border_Single;
			case "babyPacifier":
				return border_Single;
			case "babyRattle":
				return border_Single;
			case "balloons3Colors":
				return border_Single;
			case "balloonsHotAir":
				return border_Single;
			case "basicBlackDashes":
				return border_Single;
			case "basicBlackDots":
				return border_Single;
			case "basicBlackSquares":
				return border_Single;
			case "basicThinLines":
				return border_Single;
			case "basicWhiteDashes":
				return border_Single;
			case "basicWhiteDots":
				return border_Single;
			case "basicWhiteSquares":
				return border_Single;
			case "basicWideInline":
				return border_Single;
			case "basicWideMidline":
				return border_Single;
			case "basicWideOutline":
				return border_Single;
			case "bats":
				return border_Single;
			case "birds":
				return border_Single;
			case "birdsFlight":
				return border_Single;
			case "cabins":
				return border_Single;
			case "cakeSlice":
				return border_Single;
			case "candyCorn":
				return border_Single;
			case "celticKnotwork":
				return border_Single;
			case "certificateBanner":
				return border_Single;
			case "chainLink":
				return border_Single;
			case "champagneBottle":
				return border_Single;
			case "checkedBarBlack":
				return border_Single;
			case "checkedBarColor":
				return border_Single;
			case "checkered":
				return border_Single;
			case "christmasTree":
				return border_Single;
			case "circlesLines":
				return border_Single;
			case "circlesRectangles":
				return border_Single;
			case "classicalWave":
				return border_Single;
			case "clocks":
				return border_Single;
			case "compass":
				return border_Single;
			case "confetti":
				return border_Single;
			case "confettiGrays":
				return border_Single;
			case "confettiOutline":
				return border_Single;
			case "confettiStreamers":
				return border_Single;
			case "confettiWhite":
				return border_Single;
			case "cornerTriangles":
				return border_Single;
			case "couponCutoutDashes":
				return border_Single;
			case "couponCutoutDots":
				return border_Single;
			case "crazyMaze":
				return border_Single;
			case "creaturesButterfly":
				return border_Single;
			case "creaturesFish":
				return border_Single;
			case "creaturesInsects":
				return border_Single;
			case "creaturesLadyBug":
				return border_Single;
			case "crossStitch":
				return border_Single;
			case "cup":
				return border_Single;
			case "decoArch":
				return border_Single;
			case "decoArchColor":
				return border_Single;
			case "decoBlocks":
				return border_Single;
			case "diamondsGray":
				return border_Single;
			case "doubleD":
				return border_Single;
			case "doubleDiamonds":
				return border_Single;
			case "earth1":
				return border_Single;
			case "earth2":
				return border_Single;
			case "earth3":
				return border_Single;
			case "eclipsingSquares1":
				return border_Single;
			case "eclipsingSquares2":
				return border_Single;
			case "eggsBlack":
				return border_Single;
			case "fans":
				return border_Single;
			case "film":
				return border_Single;
			case "firecrackers":
				return border_Single;
			case "flowersBlockPrint":
				return border_Single;
			case "flowersDaisies":
				return border_Single;
			case "flowersModern1":
				return border_Single;
			case "flowersModern2":
				return border_Single;
			case "flowersPansy":
				return border_Single;
			case "flowersRedRose":
				return border_Single;
			case "flowersRoses":
				return border_Single;
			case "flowersTeacup":
				return border_Single;
			case "flowersTiny":
				return border_Single;
			case "gems":
				return border_Single;
			case "gingerbreadMan":
				return border_Single;
			case "gradient":
				return border_Single;
			case "handmade1":
				return border_Single;
			case "handmade2":
				return border_Single;
			case "heartBalloon":
				return border_Single;
			case "heartGray":
				return border_Single;
			case "hearts":
				return border_Single;
			case "heebieJeebies":
				return border_Single;
			case "holly":
				return border_Single;
			case "houseFunky":
				return border_Single;
			case "hypnotic":
				return border_Single;
			case "iceCreamCones":
				return border_Single;
			case "lightBulb":
				return border_Single;
			case "lightning1":
				return border_Single;
			case "lightning2":
				return border_Single;
			case "mapPins":
				return border_Single;
			case "mapleLeaf":
				return border_Single;
			case "mapleMuffins":
				return border_Single;
			case "marquee":
				return border_Single;
			case "marqueeToothed":
				return border_Single;
			case "moons":
				return border_Single;
			case "mosaic":
				return border_Single;
			case "musicNotes":
				return border_Single;
			case "northwest":
				return border_Single;
			case "ovals":
				return border_Single;
			case "packages":
				return border_Single;
			case "palmsBlack":
				return border_Single;
			case "palmsColor":
				return border_Single;
			case "paperClips":
				return border_Single;
			case "papyrus":
				return border_Single;
			case "partyFavor":
				return border_Single;
			case "partyGlass":
				return border_Single;
			case "pencils":
				return border_Single;
			case "people":
				return border_Single;
			case "peopleWaving":
				return border_Single;
			case "peopleHats":
				return border_Single;
			case "poinsettias":
				return border_Single;
			case "postageStamp":
				return border_Single;
			case "pumpkin1":
				return border_Single;
			case "pushPinNote2":
				return border_Single;
			case "pushPinNote1":
				return border_Single;
			case "pyramids":
				return border_Single;
			case "pyramidsAbove":
				return border_Single;
			case "quadrants":
				return border_Single;
			case "rings":
				return border_Single;
			case "safari":
				return border_Single;
			case "sawtooth":
				return border_Single;
			case "sawtoothGray":
				return border_Single;
			case "scaredCat":
				return border_Single;
			case "seattle":
				return border_Single;
			case "shadowedSquares":
				return border_Single;
			case "sharksTeeth":
				return border_Single;
			case "shorebirdTracks":
				return border_Single;
			case "skyrocket":
				return border_Single;
			case "snowflakeFancy":
				return border_Single;
			case "snowflakes":
				return border_Single;
			case "sombrero":
				return border_Single;
			case "southwest":
				return border_Single;
			case "stars":
				return border_Single;
			case "starsTop":
				return border_Single;
			case "stars3d":
				return border_Single;
			case "starsBlack":
				return border_Single;
			case "starsShadowed":
				return border_Single;
			case "sun":
				return border_Single;
			case "swirligig":
				return border_Single;
			case "tornPaper":
				return border_Single;
			case "tornPaperBlack":
				return border_Single;
			case "trees":
				return border_Single;
			case "triangleParty":
				return border_Single;
			case "triangles":
				return border_Single;
			case "triangle1":
				return border_Single;
			case "triangle2":
				return border_Single;
			case "triangleCircle1":
				return border_Single;
			case "triangleCircle2":
				return border_Single;
			case "shapes1":
				return border_Single;
			case "shapes2":
				return border_Single;
			case "twistedLines1":
				return border_Single;
			case "twistedLines2":
				return border_Single;
			case "vine":
				return border_Single;
			case "waveline":
				return border_Single;
			case "weavingAngles":
				return border_Single;
			case "weavingBraid":
				return border_Single;
			case "weavingRibbon":
				return border_Single;
			case "weavingStrips":
				return border_Single;
			case "whiteFlowers":
				return border_Single;
			case "woodwork":
				return border_Single;
			case "xIllusions":
				return border_Single;
			case "zanyTriangles":
				return border_Single;
			case "zigZag":
				return border_Single;
			case "zigZagStitch":
				return border_Single;
			case "custom":
				return border_Single;
		}
		return undefined;
	}
	function toXml_ST_Border(val) {
		switch (val) {
			case border_None:
				return "none";
			case border_Single:
				return "single";
		}
		return null;
	}
	function fromXml_ST_DropCap(val) {
		switch (val) {
			case "none":
				return Asc.c_oAscDropCap.None;
			case "drop":
				return Asc.c_oAscDropCap.Drop;
			case "margin":
				return Asc.c_oAscDropCap.Margin;
		}
		return undefined;
	}
	function toXml_ST_DropCap(val) {
		switch (val) {
			case Asc.c_oAscDropCap.None:
				return "none";
			case Asc.c_oAscDropCap.Drop:
				return "drop";
			case Asc.c_oAscDropCap.Margin:
				return "margin";
		}
		return null;
	}
	function fromXml_ST_Wrap(val) {
		switch (val) {
			case "auto":
				return wrap_Auto;
			case "notBeside":
				return wrap_NotBeside;
			case "around":
				return wrap_Around;
			case "tight":
				return wrap_Tight;
			case "through":
				return wrap_Through;
			case "none":
				return wrap_None;
		}
		return undefined;
	}
	function toXml_ST_Wrap(val) {
		switch (val) {
			case wrap_Auto:
				return "auto";
			case wrap_NotBeside:
				return "notBeside";
			case wrap_Around:
				return "around";
			case wrap_Tight:
				return "tight";
			case wrap_Through:
				return "through";
			case wrap_None:
				return "none";
		}
		return null;
	}
	function fromXml_ST_HAnchor(val) {
		switch (val) {
			case "text":
				return Asc.c_oAscHAnchor.Text;
			case "margin":
				return Asc.c_oAscHAnchor.Margin;
			case "page":
				return Asc.c_oAscHAnchor.Page;
		}
		return undefined;
	}
	function toXml_ST_HAnchor(val) {
		switch (val) {
			case Asc.c_oAscHAnchor.Text:
				return "text";
			case Asc.c_oAscHAnchor.Margin:
				return "margin";
			case Asc.c_oAscHAnchor.Page:
				return "page";
		}
		return null;
	}
	function fromXml_ST_VAnchor(val) {
		switch (val) {
			case "text":
				return Asc.c_oAscVAnchor.Text;
			case "margin":
				return Asc.c_oAscVAnchor.Margin;
			case "page":
				return Asc.c_oAscVAnchor.Page;
		}
		return undefined;
	}
	function toXml_ST_VAnchor(val) {
		switch (val) {
			case Asc.c_oAscVAnchor.Text:
				return "text";
			case Asc.c_oAscVAnchor.Margin:
				return "margin";
			case Asc.c_oAscVAnchor.Page:
				return "page";
		}
		return null;
	}
	function fromXml_ST_XAlign(val) {
		switch (val) {
			case "left":
				return Asc.c_oAscXAlign.Left;
			case "center":
				return Asc.c_oAscXAlign.Center;
			case "right":
				return Asc.c_oAscXAlign.Right;
			case "inside":
				return Asc.c_oAscXAlign.Inside;
			case "outside":
				return Asc.c_oAscXAlign.Outside;
		}
		return undefined;
	}
	function toXml_ST_XAlign(val) {
		switch (val) {
			case Asc.c_oAscXAlign.Left:
				return "left";
			case Asc.c_oAscXAlign.Center:
				return "center";
			case Asc.c_oAscXAlign.Right:
				return "right";
			case Asc.c_oAscXAlign.Inside:
				return "inside";
			case Asc.c_oAscXAlign.Outside:
				return "outside";
		}
		return null;
	}
	function fromXml_ST_YAlign(val) {
		switch (val) {
			case "inline":
				return Asc.c_oAscYAlign.Inline;
			case "top":
				return Asc.c_oAscYAlign.Top;
			case "center":
				return Asc.c_oAscYAlign.Center;
			case "bottom":
				return Asc.c_oAscYAlign.Bottom;
			case "inside":
				return Asc.c_oAscYAlign.Inside;
			case "outside":
				return Asc.c_oAscYAlign.Outside;
		}
		return undefined;
	}
	function toXml_ST_YAlign(val) {
		switch (val) {
			case Asc.c_oAscYAlign.Inline:
				return "inline";
			case Asc.c_oAscYAlign.Top:
				return "top";
			case Asc.c_oAscYAlign.Center:
				return "center";
			case Asc.c_oAscYAlign.Bottom:
				return "bottom";
			case Asc.c_oAscYAlign.Inside:
				return "inside";
			case Asc.c_oAscYAlign.Outside:
				return "outside";
		}
		return null;
	}
	function fromXml_ST_HeightRule(val) {
		switch (val) {
			case "auto":
				return Asc.linerule_Auto;
			case "exact":
				return Asc.linerule_Exact;
			case "atLeast":
				return Asc.linerule_AtLeast;
		}
		return undefined;
	}
	function toXml_ST_HeightRule(val) {
		switch (val) {
			case Asc.linerule_Auto:
				return "auto";
			case Asc.linerule_Exact:
				return "exact";
			case Asc.linerule_AtLeast:
				return "atLeast";
		}
		return null;
	}
	function fromXml_ST_Shd(val) {
		switch (val) {
			case "nil":
				return Asc.c_oAscShd.Nil;
			case "clear":
				return Asc.c_oAscShd.Clear;
			case "solid":
				return Asc.c_oAscShd.Solid;
			case "horzStripe":
				return Asc.c_oAscShd.HorzStripe;
			case "vertStripe":
				return Asc.c_oAscShd.VertStripe;
			case "reverseDiagStripe":
				return Asc.c_oAscShd.ReverseDiagStripe;
			case "diagStripe":
				return Asc.c_oAscShd.DiagStripe;
			case "horzCross":
				return Asc.c_oAscShd.HorzCross;
			case "diagCross":
				return Asc.c_oAscShd.DiagCross;
			case "thinHorzStripe":
				return Asc.c_oAscShd.ThinHorzStripe;
			case "thinVertStripe":
				return Asc.c_oAscShd.ThinVertStripe;
			case "thinReverseDiagStripe":
				return Asc.c_oAscShd.ThinReverseDiagStripe;
			case "thinDiagStripe":
				return Asc.c_oAscShd.ThinDiagStripe;
			case "thinHorzCross":
				return Asc.c_oAscShd.ThinHorzCross;
			case "thinDiagCross":
				return Asc.c_oAscShd.ThinDiagCross;
			case "pct5":
				return Asc.c_oAscShd.Pct5;
			case "pct10":
				return Asc.c_oAscShd.Pct10;
			case "pct12":
				return Asc.c_oAscShd.Pct12;
			case "pct15":
				return Asc.c_oAscShd.Pct15;
			case "pct20":
				return Asc.c_oAscShd.Pct20;
			case "pct25":
				return Asc.c_oAscShd.Pct25;
			case "pct30":
				return Asc.c_oAscShd.Pct30;
			case "pct35":
				return Asc.c_oAscShd.Pct35;
			case "pct37":
				return Asc.c_oAscShd.Pct37;
			case "pct40":
				return Asc.c_oAscShd.Pct40;
			case "pct45":
				return Asc.c_oAscShd.Pct45;
			case "pct50":
				return Asc.c_oAscShd.Pct50;
			case "pct55":
				return Asc.c_oAscShd.Pct55;
			case "pct60":
				return Asc.c_oAscShd.Pct60;
			case "pct62":
				return Asc.c_oAscShd.Pct62;
			case "pct65":
				return Asc.c_oAscShd.Pct65;
			case "pct70":
				return Asc.c_oAscShd.Pct70;
			case "pct75":
				return Asc.c_oAscShd.Pct75;
			case "pct80":
				return Asc.c_oAscShd.Pct80;
			case "pct85":
				return Asc.c_oAscShd.Pct85;
			case "pct87":
				return Asc.c_oAscShd.Pct87;
			case "pct90":
				return Asc.c_oAscShd.Pct90;
			case "pct95":
				return Asc.c_oAscShd.Pct95;
		}
		return undefined;
	}
	function toXml_ST_Shd(val) {
		switch (val) {
			case Asc.c_oAscShd.Nil:
				return "nil";
			case Asc.c_oAscShd.Clear:
				return "clear";
			case Asc.c_oAscShd.Solid:
				return "solid";
			case Asc.c_oAscShd.HorzStripe:
				return "horzStripe";
			case Asc.c_oAscShd.VertStripe:
				return "vertStripe";
			case Asc.c_oAscShd.ReverseDiagStripe:
				return "reverseDiagStripe";
			case Asc.c_oAscShd.DiagStripe:
				return "diagStripe";
			case Asc.c_oAscShd.HorzCross:
				return "horzCross";
			case Asc.c_oAscShd.DiagCross:
				return "diagCross";
			case Asc.c_oAscShd.ThinHorzStripe:
				return "thinHorzStripe";
			case Asc.c_oAscShd.ThinVertStripe:
				return "thinVertStripe";
			case Asc.c_oAscShd.ThinReverseDiagStripe:
				return "thinReverseDiagStripe";
			case Asc.c_oAscShd.ThinDiagStripe:
				return "thinDiagStripe";
			case Asc.c_oAscShd.ThinHorzCross:
				return "thinHorzCross";
			case Asc.c_oAscShd.ThinDiagCross:
				return "thinDiagCross";
			case Asc.c_oAscShd.Pct5:
				return "pct5";
			case Asc.c_oAscShd.Pct10:
				return "pct10";
			case Asc.c_oAscShd.Pct12:
				return "pct12";
			case Asc.c_oAscShd.Pct15:
				return "pct15";
			case Asc.c_oAscShd.Pct20:
				return "pct20";
			case Asc.c_oAscShd.Pct25:
				return "pct25";
			case Asc.c_oAscShd.Pct30:
				return "pct30";
			case Asc.c_oAscShd.Pct35:
				return "pct35";
			case Asc.c_oAscShd.Pct37:
				return "pct37";
			case Asc.c_oAscShd.Pct40:
				return "pct40";
			case Asc.c_oAscShd.Pct45:
				return "pct45";
			case Asc.c_oAscShd.Pct50:
				return "pct50";
			case Asc.c_oAscShd.Pct55:
				return "pct55";
			case Asc.c_oAscShd.Pct60:
				return "pct60";
			case Asc.c_oAscShd.Pct62:
				return "pct62";
			case Asc.c_oAscShd.Pct65:
				return "pct65";
			case Asc.c_oAscShd.Pct70:
				return "pct70";
			case Asc.c_oAscShd.Pct75:
				return "pct75";
			case Asc.c_oAscShd.Pct80:
				return "pct80";
			case Asc.c_oAscShd.Pct85:
				return "pct85";
			case Asc.c_oAscShd.Pct87:
				return "pct87";
			case Asc.c_oAscShd.Pct90:
				return "pct90";
			case Asc.c_oAscShd.Pct95:
				return "pct95";
		}
		return null;
	}
	function fromXml_ST_ThemeColor(val) {
		switch (val) {
			case "dark1":
				return AscCommonWord.EThemeColor.themecolorDark1;
			case "light1":
				return AscCommonWord.EThemeColor.themecolorLight1;
			case "dark2":
				return AscCommonWord.EThemeColor.themecolorDark2;
			case "light2":
				return AscCommonWord.EThemeColor.themecolorLight2;
			case "accent1":
				return AscCommonWord.EThemeColor.themecolorAccent1;
			case "accent2":
				return AscCommonWord.EThemeColor.themecolorAccent2;
			case "accent3":
				return AscCommonWord.EThemeColor.themecolorAccent3;
			case "accent4":
				return AscCommonWord.EThemeColor.themecolorAccent4;
			case "accent5":
				return AscCommonWord.EThemeColor.themecolorAccent5;
			case "accent6":
				return AscCommonWord.EThemeColor.themecolorAccent6;
			case "hyperlink":
				return AscCommonWord.EThemeColor.themecolorHyperlink;
			case "followedHyperlink":
				return AscCommonWord.EThemeColor.themecolorFollowedHyperlink;
			case "none":
				return AscCommonWord.EThemeColor.themecolorNone;
			case "background1":
				return AscCommonWord.EThemeColor.themecolorBackground1;
			case "text1":
				return AscCommonWord.EThemeColor.themecolorText1;
			case "background2":
				return AscCommonWord.EThemeColor.themecolorBackground2;
			case "text2":
				return AscCommonWord.EThemeColor.themecolorText2;
		}
		return null;
	}
	function toXml_ST_ThemeColor(val) {
		switch (val) {
			case AscCommonWord.EThemeColor.themecolorDark1:
				return "dark1";
			case AscCommonWord.EThemeColor.themecolorLight1:
				return "light1";
			case AscCommonWord.EThemeColor.themecolorDark2:
				return "dark2";
			case AscCommonWord.EThemeColor.themecolorLight2:
				return "light2";
			case AscCommonWord.EThemeColor.themecolorAccent1:
				return "accent1";
			case AscCommonWord.EThemeColor.themecolorAccent2:
				return "accent2";
			case AscCommonWord.EThemeColor.themecolorAccent3:
				return "accent3";
			case AscCommonWord.EThemeColor.themecolorAccent4:
				return "accent4";
			case AscCommonWord.EThemeColor.themecolorAccent5:
				return "accent5";
			case AscCommonWord.EThemeColor.themecolorAccent6:
				return "accent6";
			case AscCommonWord.EThemeColor.themecolorHyperlink:
				return "hyperlink";
			case AscCommonWord.EThemeColor.themecolorFollowedHyperlink:
				return "followedHyperlink";
			case AscCommonWord.EThemeColor.themecolorNone:
				return "none";
			case AscCommonWord.EThemeColor.themecolorBackground1:
				return "background1";
			case AscCommonWord.EThemeColor.themecolorText1:
				return "text1";
			case AscCommonWord.EThemeColor.themecolorBackground2:
				return "background2";
			case AscCommonWord.EThemeColor.themecolorText2:
				return "text2";
		}
		return null;
	}
	function fromXml_ST_TabJc(val) {
		switch (val) {
			case "clear":
				return tab_Clear;
			case "start":
			case "left":
				return tab_Left;
			case "center":
				return tab_Center;
			case "end":
			case "right":
				return tab_Right;
			case "decimal":
				return tab_Decimal;
			case "bar":
				return tab_Bar;
			case "num":
				return tab_Num;
		}
		return undefined;
	}
	function toXml_ST_TabJc(val) {
		switch (val) {
			case tab_Clear:
				return "clear";
			case tab_Left:
				return "left";
			case tab_Center:
				return "center";
			case tab_Right:
				return "right";
			case tab_Decimal:
				return "decimal";
			case tab_Bar:
				return "bar";
			case tab_Num:
				return "num";
		}
		return null;
	}
	function fromXml_ST_TabTlc(val) {
		switch (val) {
			case "none":
				return Asc.c_oAscTabLeader.None;
			case "dot":
				return Asc.c_oAscTabLeader.Dot;
			case "hyphen":
				return Asc.c_oAscTabLeader.Hyphen;
			case "underscore":
				return Asc.c_oAscTabLeader.Underscore;
			case "heavy":
				return Asc.c_oAscTabLeader.Heavy;
			case "middleDot":
				return Asc.c_oAscTabLeader.MiddleDot;
		}
		return undefined;
	}
	function toXml_ST_TabTlc(val) {
		switch (val) {
			case Asc.c_oAscTabLeader.None:
				return "none";
			case Asc.c_oAscTabLeader.Dot:
				return "dot";
			case Asc.c_oAscTabLeader.Hyphen:
				return "hyphen";
			case Asc.c_oAscTabLeader.Underscore:
				return "underscore";
			case Asc.c_oAscTabLeader.Heavy:
				return "heavy";
			case Asc.c_oAscTabLeader.MiddleDot:
				return "middleDot";
		}
		return null;
	}
	function fromXml_ST_LineSpacingRule(val) {
		switch (val) {
			case "auto":
				return Asc.linerule_Auto;
			case "exact":
				return Asc.linerule_Exact;
			case "atLeast":
				return Asc.linerule_AtLeast;
		}
		return undefined;
	}
	function toXml_ST_LineSpacingRule(val) {
		switch (val) {
			case Asc.linerule_Auto:
				return "auto";
			case Asc.linerule_Exact:
				return "exact";
			case Asc.linerule_AtLeast:
				return "atLeast";
		}
		return null;
	}
	function fromXml_ST_Jc1(val) {
		switch (val) {
			case "start":
			case "left":
				return AscCommon.align_Left;
			case "center":
				return AscCommon.align_Center;
			case "end":
			case "right":
				return AscCommon.align_Right;
			case "both":
				return AscCommon.align_Left;
			case "mediumKashida":
				return AscCommon.align_Left;
			case "distribute":
				return AscCommon.align_Distributed;
			case "numTab":
				return AscCommon.align_Left;
			case "highKashida":
				return AscCommon.align_Left;
			case "lowKashida":
				return AscCommon.align_Left;
			case "thaiDistribute":
				return AscCommon.align_Left;
		}
		return undefined;
	}
	function toXml_ST_Jc1(val) {
		switch (val) {
			case AscCommon.align_Left:
				return "left";
			case AscCommon.align_Center:
				return "center";
			case AscCommon.align_Right:
				return "right";
			// case AscCommon.align_Justify:
			// 	return "both";
			case AscCommon.align_Distributed:
				return "distribute";
			// case AscCommon.align_CenterContinuous:
			// 	return "distribute";
		}
		return null;
	}
	function fromXml_ST_Hint(val) {
		switch (val) {
			case "default":
				return fonthint_Default;
			case "cs":
				return fonthint_CS;
			case "eastAsia":
				return fonthint_EastAsia;
		}
		return undefined;
	}
	function toXml_ST_Hint(val) {
		switch (val) {
			case fonthint_Default:
				return "default";
			case fonthint_CS:
				return "cs";
			case fonthint_EastAsia:
				return "eastAsia";
		}
		return null;
	}
	function fromXml_ST_Underline(val) {
		switch (val) {
			case "single":
				return true;
			case "words":
				return true;
			case "double":
				return true;
			case "thick":
				return true;
			case "dotted":
				return true;
			case "dottedHeavy":
				return true;
			case "dash":
				return true;
			case "dashedHeavy":
				return true;
			case "dashLong":
				return true;
			case "dashLongHeavy":
				return true;
			case "dotDash":
				return true;
			case "dashDotHeavy":
				return true;
			case "dotDotDash":
				return true;
			case "dashDotDotHeavy":
				return true;
			case "wave":
				return true;
			case "wavyHeavy":
				return true;
			case "wavyDouble":
				return true;
			case "none":
				return false;
		}
		return undefined;
	}
	function toXml_ST_Underline(val) {
		switch (val) {
			case true:
				return "single";
			case false:
				return "none";
		}
		return null;
	}
	function fromXml_ST_VerticalAlignRun(val) {
		switch (val) {
			case "baseline":
				return AscCommon.vertalign_Baseline;
			case "superscript":
				return AscCommon.vertalign_SuperScript;
			case "subscript":
				return AscCommon.vertalign_SubScript;
		}
		return undefined;
	}
	function toXml_ST_VerticalAlignRun(val) {
		switch (val) {
			case AscCommon.vertalign_Baseline:
				return "baseline";
			case AscCommon.vertalign_SuperScript:
				return "superscript";
			case AscCommon.vertalign_SubScript:
				return "subscript";
		}
		return null;
	}
})(window);