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

/**
 * @param {Window} window
 * @param {undefined} undefined
 */
(function (window, undefined) {
	var CellValueType = AscCommon.CellValueType;

	AscCommonExcel.Workbook.prototype.toZip = function (zip, context) {
		context.wb = this;
		var memory = new AscCommon.CMemory();
		memory.context = context;
		var filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);
		var wbXml = new CT_Workbook(this);
		var wbPart = filePart.addPart(AscCommon.openXml.Types.workbook);
		wbPart.part.setDataXml(wbXml, memory);
		memory.Seek(0);

		if (context.oSharedStrings.index > 0) {
			var sharedString = new CT_SharedStrings();
			sharedString.initFromMap(this, context.oSharedStrings);
			var sharedStringPart = wbPart.part.addPart(AscCommon.openXml.Types.sharedStringTable);
			sharedStringPart.part.setDataXml(sharedString, memory);
			memory.Seek(0);
		}
		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><fonts count="1" x14ac:knownFonts="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><charset val="204"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>');
		sampleData = memory.GetDataUint8();
		var stylePart = wbPart.part.addPart(AscCommon.openXml.Types.workbookStyles);
		stylePart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>');
		var sampleData = memory.GetDataUint8();
		var themePart = wbPart.part.addPart(AscCommon.openXml.Types.theme);
		themePart.part.setData(sampleData);
		memory.Seek(0);
	};
	function CT_Workbook(wb) {
		//Members
		this.wb = wb;
		this.sheets = null;
		this.pivotCaches = null;
	}
	CT_Workbook.prototype.fromXml = function(reader) {
		if (!reader.ReadNextNode()) {
			return;
		}
		if ("workbook" !== reader.GetNameNoNS()) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		if ("workbook" === reader.GetNameNoNS()) {
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				var name = reader.GetNameNoNS();
				if ("sheets" === name) {
					var sheets = new CT_Sheets(this.wb);
					sheets.fromXml(reader);
					this.sheets = sheets.sheets
				} else if ("pivotCaches" === name) {
					var pivotCaches = new CT_PivotCaches();
					pivotCaches.fromXml(reader);
					this.pivotCaches = pivotCaches.pivotCaches
				}
			}
		}
	};
	CT_Workbook.prototype.toXml = function(writer) {
		writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		writer.WriteXmlNodeStart("workbook");
		writer.WriteXmlString(' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"');
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeStart('workbookPr');
		writer.WriteXmlAttributesEnd(true);
		writer.WriteXmlNodeStart('bookViews');
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNodeStart('workbookView');
		if (null != this.wb.nActive) {
			writer.WriteXmlAttributeNumber("activeTab", this.wb.nActive);
		}
		writer.WriteXmlAttributesEnd(true);
		writer.WriteXmlNodeEnd('bookViews');
		var sheetsXml = new CT_Sheets(this.wb);
		sheetsXml.toXml(writer);
		writer.WriteXmlNodeStart('calcPr');
		writer.WriteXmlAttributesEnd(true);
		writer.WriteXmlNodeEnd("workbook");
	};

	AscCommonExcel.Worksheet.prototype.fromXml = function(reader) {
		if (!reader.ReadNextNode()) {
			return;
		}
		if ("worksheet" !== reader.GetNameNoNS()) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		if ("worksheet" === reader.GetNameNoNS()) {
			var context = reader.GetContext();
			context.initFromWS(this);
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				var name = reader.GetNameNoNS();
				if ("sheetData" === name) {
					var sheetData = new AscCommonExcel.CT_SheetData(this);
					sheetData.fromXml(reader);
				} else if ("drawing" === name) {
					var drawing = new AscCommonExcel.CT_DrawingWSRef();
					drawing.fromXml(reader);
					context.drawingId = drawing.id;
				}
			}
		}
	};
	AscCommonExcel.Worksheet.prototype.toXml = function (writer) {
		var t = this;
		var context = writer.context;
		writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		writer.WriteXmlNodeStart("worksheet");
		writer.WriteXmlString(' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"');
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlString('<dimension ref="A1"/>');
		writer.WriteXmlString('<sheetViews><sheetView tabSelected="1" workbookViewId="0"/></sheetViews>');
		writer.WriteXmlString('<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>');
		writer.WriteXmlNodeStart('sheetData');
		writer.WriteXmlAttributesEnd();
		this.toXmlSheetData(writer);
		writer.WriteXmlNodeEnd("sheetData");
		if (this.Drawings.length > 0) {
			var drawing = new AscCommonExcel.CT_DrawingWS(t);
			var drawingPart = context.part.addPart(AscCommon.openXml.Types.drawings);
			drawingPart.part.setDataXml(drawing, writer);
			var drawingRef = new AscCommonExcel.CT_DrawingWSRef();
			drawingRef.id = drawingPart.rId;
			drawingRef.toXml(writer, "drawing");
		}
		writer.WriteXmlNodeEnd("worksheet");
	};
	AscCommonExcel.Worksheet.prototype.toXmlSheetData = function (writer) {
		var ws = this;
		var context = writer.context;
		var isCopyPaste = context.isCopyPaste;
		var range;
		if (isCopyPaste) {
			range = ws.getRange3(isCopyPaste.r1, isCopyPaste.c1, isCopyPaste.r2, isCopyPaste.c2);
		} else {
			range = ws.getRange3(0, 0, AscCommon.gc_nMaxRow0, AscCommon.gc_nMaxCol0);
		}
		var isFirstRow = true;
		var writeEndRow = function(){
			if (isFirstRow) {
				isFirstRow = false;
			} else {
				writer.WriteXmlNodeEnd("row");
			}
		};


		var curRow = -1;
		var allRow = ws.getAllRowNoEmpty();
		var tempRow = new AscCommonExcel.Row(ws);
		if (allRow) {
			tempRow.copyFrom(allRow);
		}
		range._foreachRowNoEmpty(function(row, excludedCount) {
			writeEndRow();
			row.toXml(writer);
			curRow = row.getIndex();
		}, function(cell, nRow0, nCol0, nRowStart0, nColStart0, excludedCount) {
			if (curRow != nRow0) {
				tempRow.setIndex(nRow0);
				writeEndRow();
				tempRow.toXml(writer);
				curRow = tempRow.getIndex();
			}
			//сохраняем как и Excel даже пустой стиль(нужно чтобы убрать стиль строки/колонки)
			if (null != cell.xfs || false == cell.isNullText()) {
				cell.toXml(writer);
			}
		}, (ws.bExcludeHiddenRows && isCopyPaste));
		writeEndRow();
	};
	AscCommonExcel.Row.prototype.toXml = function(writer) {
		var context = writer.context;
		var s = context.stylesForWrite.add(this.xfs) || null;
		var outlineLevel = this.outlineLevel > 0 ? this.outlineLevel : null;

		writer.WriteXmlNodeStart("row");
		writer.WriteXmlAttributeNumber("r", this.index+1);
		writer.WriteXmlNullableAttributeNumber("s", s);
		writer.WriteXmlNullableAttributeNumber("ht", this.h);
		writer.WriteXmlAttributeBoolIfTrue("hidden", this.getHidden());
		writer.WriteXmlAttributeBoolIfTrue("customHeight", this.getCustomHeight());
		writer.WriteXmlNullableAttributeNumber("outlineLevel", outlineLevel);
		writer.WriteXmlAttributeBoolIfTrue("collapsed", this.getCollapsed());
		writer.WriteXmlAttributesEnd();
	};
	AscCommonExcel.Cell.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		var value = reader.GetContext().cellValue;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("v" === reader.GetName()) {
				value.fromXml(reader);
				if (CellValueType.String === this.type) {
					var ss = reader.GetContext().sharedStrings[parseInt(value.val)];
					if (undefined !== ss) {
						if (typeof ss === 'string') {
							this.setValueTextInternal(ss);
						} else {
							this.setValueMultiTextInternal(ss);
						}
					}
				} else if (CellValueType.Error === this.type) {
					this.setValueTextInternal(value.val);
				} else {
					this.setValueNumberInternal(parseFloat(value.val));
				}
			}
		}
	};
	AscCommonExcel.Cell.prototype.readAttr = function(reader) {
		var val;
		var cellBase = reader.GetContext().cellBase;
		while (reader.MoveToNextAttribute()) {
			if ("r" === reader.GetName()) {
				val = reader.GetValue();
				cellBase.fromRefA1(val);
				this.setRowCol(cellBase.row, cellBase.col);
				this.ws.nRowsCount = Math.max(this.ws.nRowsCount, this.nRow);
				this.ws.nColsCount = Math.max(this.ws.nColsCount, this.nCol);
				this.ws.cellsByColRowsCount = Math.max(this.ws.cellsByColRowsCount, this.nCol);
			} else if ("s" === reader.GetName()) {
				val = reader.GetValue();
				this.xfs = null;//parseInt(val);
			} else if ("t" === reader.GetName()) {
				val = reader.GetValue();
				switch(val) {
					case "s":
						this.type = CellValueType.String;
						break;
					case "str":
						this.type = CellValueType.String;
						break;
					case "n":
						this.type = CellValueType.Number;
						break;
					case "e":
						this.type = CellValueType.Error;
						break;
					case "b":
						this.type = CellValueType.Bool;
						break;
					case "inlineStr":
						this.type = CellValueType.String;
						break;
					case "d":
						this.type = CellValueType.String;
						break;
				}
			}
		}
	};
	AscCommonExcel.Cell.prototype.toXml = function(writer) {
		var context = writer.context;
		var ws = this.ws;
		var ref = AscCommon.CellBase.prototype.toRefA1(this.nRow, this.nCol);
		var s = context.stylesForWrite.add(this.xfs) || null;
		var formulaToWrite = null;
		if (this.isFormula() && !(context.isCopyPaste && ws.bIgnoreWriteFormulas)) {
			formulaToWrite = ws.PrepareFormulaToWrite(this);
		}
		var text = null;
		var number = null;
		var type = null;
		switch (this.type) {
			case CellValueType.String:
				type = "s";
				if (formulaToWrite) {
					text = this.text;
				} else {
					var textIndex = this.getTextIndex();
					if (null !== textIndex) {
						var index = context.oSharedStrings.strings[textIndex];
						if (undefined === index) {
							index = context.oSharedStrings.index++;
							context.oSharedStrings.strings[textIndex] = index;
						}
						number = index;
					}
				}
				break;
			case CellValueType.Error:
				type = "e";
				text = this.text;
				break;
			case CellValueType.Bool:
				type = "b";
				number = this.number;
				break;
			default:
				number = this.number;
				break;
		}
		writer.WriteXmlNodeStart("c");
		writer.WriteXmlAttributeString("r", ref);
		writer.WriteXmlNullableAttributeNumber("s", s);
		writer.WriteXmlNullableAttributeString("t", type);
		if (!this.isNullText()) {
			writer.WriteXmlAttributesEnd();
			writer.WriteXmlNullableValueString("f", formulaToWrite);
			if(null !== text) {
				writer.WriteXmlValueString("v", text);
			} else if(null !== number) {
				writer.WriteXmlValueNumber("v", number);
			}
			writer.WriteXmlNodeEnd("c");

		} else {
			writer.WriteXmlAttributesEnd(true);
		}
	};

	function CT_DrawingWS(ws) {
		this.ws = ws;
		this.anchors = [];
	}

	CT_DrawingWS.prototype.fromXml = function (reader) {
		if (!reader.ReadNextNode()) {
			return;
		}
		if ("wsDr" !== reader.GetNameNoNS()) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		var objectRender = new AscFormat.DrawingObjects();
		if ("wsDr" === reader.GetNameNoNS()) {
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				var name = reader.GetNameNoNS();
				if ("twoCellAnchor" === name) {
					var drawing = objectRender.createDrawingObject();
					drawing.fromXml(reader);
				} else if ("oneCellAnchor" === name) {
				} else if ("absoluteAnchor" === name) {
				}
			}
		}
	};
	CT_DrawingWS.prototype.toXml = function (writer) {
		writer.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
		writer.WriteXmlNodeStart("xdr:wsDr");
		writer.WriteXmlString(' xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"');
		writer.WriteXmlAttributesEnd();
		this.ws.Drawings.forEach(function(drawing) {
			drawing.toXml(writer);
		});
		writer.WriteXmlNodeEnd("xdr:wsDr");
	};
	function CT_SharedStrings() {
		this.sharedStrings = [];
	}
	CT_SharedStrings.prototype.initFromMap = function(wb, oSharedStrings) {
		for (var i in oSharedStrings.strings) {
			if (oSharedStrings.strings.hasOwnProperty(i)){
				var from = parseInt(i);
				var to = oSharedStrings.strings[i];
				this.sharedStrings[to] = wb.sharedStrings.get(from);
			}
		}
	};
	CT_SharedStrings.prototype.fromXml = function(reader) {
		if (!reader.ReadNextNode()) {
			return;
		}
		if ("sst" !== reader.GetNameNoNS()) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		var si = new CT_Si();
		if ("sst" === reader.GetNameNoNS()) {
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				var name = reader.GetNameNoNS();
				if ("si" === name) {
					si.clean();
					si.fromXml(reader);
					if (null !== si.text) {
						this.sharedStrings.push(si.text);
					} else if (null !== si.multiText) {
						this.sharedStrings.push(si.multiText);
					} else {
						this.sharedStrings.push("");
					}
				}
			}
		}
		reader.GetContext().sharedStrings = this.sharedStrings;
	};
	CT_SharedStrings.prototype.toXml = function(writer) {
		writer.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
		writer.WriteXmlNodeStart("sst");
		writer.WriteXmlString(' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"');
		writer.WriteXmlAttributeNumber("count", this.sharedStrings.length);
		writer.WriteXmlAttributeNumber("uniqueCount", this.sharedStrings.length);
		writer.WriteXmlAttributesEnd();

		var si = new CT_Si();
		this.sharedStrings.forEach(function(elem) {
			si.clean();
			si.text = elem;
			si.toXml(writer);
		});
		writer.WriteXmlNodeEnd("sst");
	};
	function CT_Si() {
		this.text = null;
		this.multiText = null;
	}
	CT_Si.prototype.clean = function() {
		this.text = null;
		this.multiText = null;
	};
	CT_Si.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("t" === reader.GetName()) {
				this.text = reader.GetTextDecodeXml();
			} else if ("r" === reader.GetName()) {
				this.text = reader.GetTextDecodeXml();
			}
		}
	};
	CT_Si.prototype.toXml = function(writer) {
		writer.WriteXmlNodeStart("si");
		writer.WriteXmlAttributesEnd();
		if (null !== this.text) {
			writer.WriteXmlValueString("t", this.text);
		} else if (null !== this.multiText) {
			//todo
			//writer.WriteXmlValueString("r", this.multiText);
		}
		writer.WriteXmlNodeEnd("si");
	};

	function CT_PivotCaches() {
		this.pivotCaches = [];
	}
	CT_PivotCaches.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while( reader.ReadNextSiblingNode(depth) ) {
			if ( "pivotCache" === reader.GetNameNoNS() ) {
				var pivotCache = new CT_PivotCache();
				pivotCache.fromXml(reader);
				this.pivotCaches.push(pivotCache);
			}
		}
	};
	function CT_DrawingWSRef() {
		this.id = null;
	}
	CT_DrawingWSRef.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_DrawingWSRef.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("r:id", this.id);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_DrawingWSRef.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			if ("id" === reader.GetNameNoNS()) {
				this.id = reader.GetValueDecodeXml();
			}
		}
	};

	function CT_SheetData(ws) {
		this.ws = ws;
		this._openRow = new AscCommonExcel.Row(ws);
	}

	CT_SheetData.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		var row = reader.GetContext().row;
		while (reader.ReadNextSiblingNode(depth)) {
			if ("row" === reader.GetName()) {
				row.clear();
				row.fromXml(reader);
				row.saveContent();
			}
		}
	};
	function CT_Sheets(wb) {
		this.wb = wb;
		this.sheets = [];
	}
	CT_Sheets.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while( reader.ReadNextSiblingNode(depth) ) {
			if ( "sheet" === reader.GetNameNoNS() ) {
				var sheet = new CT_Sheet();
				sheet.fromXml(reader);
				this.sheets.push(sheet);
			}
		}
	};
	CT_Sheets.prototype.toXml = function(writer) {
		var t = this;
		var context = writer.context;
		var index = 1;
		this.wb.forEach(function(ws) {
			var sheetXml = new CT_Sheet();
			var wsPart = context.part.addPart(AscCommon.openXml.Types.worksheet);
			wsPart.part.setDataXml(ws, writer);
			sheetXml.id = wsPart.rId;
			sheetXml.sheetId = index++;
			sheetXml.name = ws.getName();
			t.sheets.push(sheetXml);
			context.sheetIds[ws.getId()] = sheetXml.sheetId;
		}, context.isCopyPaste);
		writer.WriteXmlNodeStart("sheets");
		writer.WriteXmlAttributesEnd();
		this.sheets.forEach(function(sheetXml) {
			sheetXml.toXml(writer);
		}, context.isCopyPaste);
		writer.WriteXmlNodeEnd("sheets");
	};
	function CT_Sheet() {
		//Attributes
		this.name = null;
		this.sheetId = null;
		this.id = null;
	}
	CT_Sheet.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_Sheet.prototype.toXml = function(writer) {
		writer.WriteXmlNodeStart("sheet");
		writer.WriteXmlNullableAttributeString("name", this.name);
		writer.WriteXmlNullableAttributeNumber("sheetId", this.sheetId);
		writer.WriteXmlNullableAttributeString("r:id", this.id);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_Sheet.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			this.parseAttributes(attr());
		}
	};
	CT_Sheet.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			if ("name" === name) {
				this.name = reader.GetValueDecodeXml();
			} else if ("sheetId" === name) {
				this.sheetId = reader.GetValueInt();
			} else if ("id" === name) {
				this.id = reader.GetValueDecodeXml();
			}
		}
	};
	CT_Sheet.prototype.parseAttributes = function(vals, uq) {
		var val;
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}
	};
	function CT_Value() {
		//Attributes
		this.space = null;
		this.val = null;
	}
	CT_Value.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		this.val = reader.GetText();
	};
	CT_Value.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			this.parseAttributes(attr());
		}
	};
	CT_Value.prototype.readAttr = function(reader) {
		//todo space
	};
	CT_Value.prototype.parseAttributes = function(vals, uq) {
		var val;
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}
	};
	function CT_PivotCache() {
		//Attributes
		this.cacheId = null;
		this.id = null;
	}
	CT_PivotCache.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_PivotCache.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			var vals = attr();
			this.parseAttributes(attr(), uq);
		}
	};
	CT_PivotCache.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			if ("id" === name) {
				this.id = reader.GetValueDecodeXml();
			} else if ("cacheId" === name) {
				this.cacheId = parseInt(reader.GetValue());
			}
		}
	};
	CT_PivotCache.prototype.parseAttributes = function(vals, uq) {
		var val;
		val = vals["cacheId"];
		if (undefined !== val) {
			this.cacheId = val - 0;
		}
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = AscCommon.unleakString(uq(val));
		}
	};

	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CT_Workbook = CT_Workbook;
	window['AscCommonExcel'].CT_SharedStrings = CT_SharedStrings;
	window['AscCommonExcel'].CT_SheetData = CT_SheetData;
	window['AscCommonExcel'].CT_Value = CT_Value;
	window['AscCommonExcel'].CT_DrawingWS = CT_DrawingWS;
	window['AscCommonExcel'].CT_DrawingWSRef = CT_DrawingWSRef;
})(window);
