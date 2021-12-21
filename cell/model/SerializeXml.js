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
				} else if ("autoFilter" === name) {
					var autoFilter = new AscCommonExcel.AutoFilter();
					autoFilter.fromXml(reader);
					this.AutoFilter = autoFilter;
				} else if ("dataValidations" === name) {
					var dataValidations = new AscCommonExcel.CDataValidations();
					dataValidations.fromXml(reader);
					this.dataValidations = dataValidations;
				} else if ("extLst" === name) {

					/*virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
					{
						if ( oReader.IsEmptyNode() )
							return;

						int nCurDepth = oReader.GetDepth();
						while( oReader.ReadNextSiblingNode( nCurDepth ) )
						{
							std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());
							if ( _T("ext") == sName )
							{
								OOX::Drawing::COfficeArtExtension *oExt = new OOX::Drawing::COfficeArtExtension(oReader);
								if (oExt) m_arrExt.push_back( oExt );
							}
						}
					}*/

					var extLst = new COfficeArtExtensionList();
					extLst.fromXml(reader);
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


		/*if(m_arrItems.empty()) return;

		writer.WriteString(L"<tableParts");
		WritingStringAttrInt(L"count", (int)m_arrItems.size());
		writer.WriteString(L">");

		for ( size_t i = 0; i < m_arrItems.size(); ++i)
		{
			if ( m_arrItems[i] )
			{
				m_arrItems[i]->toXML(writer);
			}
		}

		writer.WriteString(L"</tableParts>");*/


		if (this.TableParts && this.TableParts.length > 0) {

			writer.WriteXmlNodeStart("tableParts");
			writer.WriteXmlAttributeNumber("count", this.TableParts.length);
			writer.WriteXmlAttributesEnd();

			for (var i = 0; i < this.TableParts.length; i++) {
				var tablePart = context.part.addPart(AscCommon.openXml.Types.tableDefinition);
				tablePart.part.setDataXml(this.TableParts[i], writer);
				//CT_DrawingWSRef - внутри только id, поэтому здесь использую. либо переимонвать, либо базовый сделать с такими аттрибутами
				var tableRef = new AscCommonExcel.CT_DrawingWSRef();
				tableRef.id = tablePart.rId;
				tableRef.toXml(writer, "tablePart");
			}

			writer.WriteXmlNodeEnd("tableParts");
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
	

	//Tables & AutoFilter
	/*function CT_TableParts(ws) {
		this.ws = ws;
		this.tableParts = [];
	}
	CT_TableParts.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while( reader.ReadNextSiblingNode(depth) ) {
			if ( "tablePart" === reader.GetNameNoNS() ) {
				var tablePart = new CT_TablePart();
				tablePart.fromXml(reader);
				this.tableParts.push(tablePart);
			}
		}
	};
	function CT_TablePart() {
		//Attributes
		this.name = null;
		this.sheetId = null;
		this.id = null;
	}
	CT_TablePart.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_TablePart.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			this.parseAttributes(attr());
		}
	};
	CT_TablePart.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			if ("id" === name) {
				this.id = reader.GetValueDecodeXml();
			}
		}
	};*/


	AscCommonExcel.TablePart.prototype.fromXml = function(reader) {
		if (!reader.ReadNextNode()) {
			return;
		}

		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("autoFilter" === name) {
				var autoFilter = new AscCommonExcel.AutoFilter();
				autoFilter.fromXml(reader);
				this.AutoFilter = autoFilter;
			} else if ("sortState" === name) {
				var sortState = new AscCommonExcel.SortState();
				sortState.fromXml(reader);
				this.SortState = sortState;
			} else if ("tableColumns" === name) {
				var _depth = reader.GetDepth();
				while (reader.ReadNextSiblingNode(_depth)) {
					var _name = reader.GetNameNoNS();
					if ("tableColumn" === _name) {
						var tableColumn = new AscCommonExcel.TableColumn();
						tableColumn.fromXml(reader);
						if (!this.TableColumns) {
							this.TableColumns = [];
						}
						this.TableColumns.push(tableColumn);
					}
				}
			} else if ("tableStyleInfo" === name) {
				var tableStyleInfo = new AscCommonExcel.TableStyleInfo();
				tableStyleInfo.fromXml(reader);
				this.TableStyleInfo = tableStyleInfo;
			}  else if ("extLst" === name) {

			}
		}

		/*ReadAttributes( oReader );

		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( (L"autoFilter") == sName )
			m_oAutoFilter = oReader;
		else if ( (L"sortState") == sName )
			m_oSortState = oReader;
		else if ( (L"tableColumns") == sName )
			m_oTableColumns = oReader;
		else if ( (L"tableStyleInfo") == sName )
			m_oTableStyleInfo = oReader;
		else if ((L"extLst") == sName)
			m_oExtLst = oReader;
		}*/

	};
	AscCommonExcel.TablePart.prototype.readAttr = function(reader) {
		var val;

		/*( oReader, L"name",					m_oName )
		( oReader, L"headerRowCount",		m_oHeaderRowCount )
		( oReader, L"totalsRowCount",		m_oTotalsRowCount )
		( oReader, L"displayName",			m_oDisplayName )
		( oReader, L"tableBorderDxfId",		m_oTableBorderDxfId )
		( oReader, L"comment",				m_oComment )
		( oReader, L"connectionId",			m_oConnectionId )
		( oReader, L"dataDxfId",			m_oDataDxfId )
		( oReader, L"dataCellStyle",		m_oDataCellStyle )
		( oReader, L"headerRowBorderDxfId",	m_oHeaderRowBorderDxfId )
		( oReader, L"headerRowCellStyle",	m_oHeaderRowCellStyle )
		( oReader, L"headerRowDxfId",		m_oHeaderRowDxfId )
		( oReader, L"insertRow",			m_oInsertRow )
		( oReader, L"insertRowShift",		m_oInsertRowShift )
		( oReader, L"published",			m_oPublished )
		( oReader, L"id",					m_oId )
		( oReader, L"tableType",			m_oTableType )
		( oReader, L"totalsRowBorderDxfId",	m_oTotalsRowBorderDxfId )
		( oReader, L"totalsRowCellStyle",	m_oTotalsRowCellStyle )
		( oReader, L"totalsRowDxfId",		m_oTotalsRowDxfId )
		( oReader, L"totalsRowShown",		m_oTotalsRowShown )*/

		/*AutoFilter: null
		DisplayName: null
		HeaderRowCount: null
		QueryTable: null
		Ref: null
		SortState: null
		TableColumns: null
		TableStyleInfo: null
		TotalsRowCount: null
		altText: null
		altTextSummary: null
		handlers: null
		result: null
		tableType: null*/

		
		while (reader.MoveToNextAttribute()) {
			if ("ref" === reader.GetName()) {
				val = reader.GetValue();
				this.Ref = AscCommonExcel.g_oRangeCache.getAscRange(val);
			} else if ("displayName" === reader.GetName()) {
				val = reader.GetValue();
				this.DisplayName = val;
			} else if ("headerRowCount" === reader.GetName()) {
				val = reader.GetValue();
				this.HeaderRowCount = val;
			} else if ("totalsRowCount" === reader.GetName()) {
				val = reader.GetValue();
				this.TotalsRowCount = val;
			}
		}
	};
	AscCommonExcel.TablePart.prototype.toXml = function(writer) {

		/*writer.WriteString(L"<table \
xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" \
xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
mc:Ignorable=\"xr xr3\" \
xmlns:xr=\"http://schemas.microsoft.com/office/spreadsheetml/2014/revision\" \
xmlns:xr3=\"http://schemas.microsoft.com/office/spreadsheetml/2016/revision3\"");

		WritingStringNullableAttrInt(L"id", m_oId, m_oId->GetValue());
		WritingStringNullableAttrEncodeXmlString(L"name", m_oName, *m_oName);
		WritingStringNullableAttrEncodeXmlString(L"displayName", m_oDisplayName, *m_oDisplayName);
		WritingStringNullableAttrString(L"ref", m_oRef, m_oRef->ToString());
		WritingStringNullableAttrInt(L"connectionId", m_oConnectionId, m_oConnectionId->GetValue());
		WritingStringNullableAttrString(L"tableType", m_oTableType, m_oTableType->ToString());
		WritingStringNullableAttrString(L"comment", m_oComment, *m_oComment);
		WritingStringNullableAttrInt(L"tableBorderDxfId", m_oTableBorderDxfId, m_oTableBorderDxfId->GetValue());
		WritingStringNullableAttrString(L"dataCellStyle", m_oDataCellStyle, *m_oDataCellStyle);
		WritingStringNullableAttrInt(L"dataDxfId", m_oDataDxfId, m_oDataDxfId->GetValue());
		WritingStringNullableAttrString(L"headerRowCellStyle", m_oHeaderRowCellStyle, *m_oHeaderRowCellStyle);
		WritingStringNullableAttrInt(L"headerRowBorderDxfId", m_oHeaderRowBorderDxfId, m_oHeaderRowBorderDxfId->GetValue());
		WritingStringNullableAttrInt(L"headerRowDxfId", m_oHeaderRowDxfId, m_oHeaderRowDxfId->GetValue());
		WritingStringNullableAttrString(L"totalsRowCellStyle", m_oTotalsRowCellStyle, *m_oTotalsRowCellStyle);
		WritingStringNullableAttrInt(L"totalsRowDxfId", m_oTotalsRowDxfId, m_oTotalsRowDxfId->GetValue());
		WritingStringNullableAttrInt(L"totalsRowBorderDxfId", m_oTotalsRowBorderDxfId, m_oTotalsRowBorderDxfId->GetValue());

		//if (m_oHeaderRowCount.IsInit() && 0 == m_oHeaderRowCount->GetValue())
		//	WritingStringAttrString(L"headerRowCount", L"1");
		//if (m_oTotalsRowCount.IsInit() && m_oTotalsRowCount->GetValue() > 0)
		//          WritingStringAttrString(L"totalsRowCount", L"1");
		//      else
		//	WritingStringAttrString(L"totalsRowShown", L"0");//m_oTotalsRowShown
		WritingStringNullableAttrInt(L"headerRowCount", m_oHeaderRowCount, m_oHeaderRowCount->GetValue());
		WritingStringNullableAttrInt(L"totalsRowCount", m_oTotalsRowCount, m_oTotalsRowCount->GetValue());
		WritingStringNullableAttrBool2(L"totalsRowShown", m_oTotalsRowShown);

		WritingStringNullableAttrBool2(L"insertRow", m_oInsertRow);
		WritingStringNullableAttrBool2(L"insertRowShift", m_oInsertRowShift);
		WritingStringNullableAttrBool2(L"published", m_oPublished);

		writer.WriteString(L">");

		if(m_oAutoFilter.IsInit())
			m_oAutoFilter->toXML(writer);
		if(m_oSortState.IsInit())
			m_oSortState->toXML(writer);
		if(m_oTableColumns.IsInit())
			m_oTableColumns->toXML(writer);
		if(m_oTableStyleInfo.IsInit())
			m_oTableStyleInfo->toXML(writer);
		if(m_oExtLst.IsInit())
		{
			writer.WriteString(m_oExtLst->toXMLWithNS(L""));
		}
		writer.WriteString(L"</table>");*/





		writer.WriteXmlString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n');
		writer.WriteXmlNodeStart("table");
		writer.WriteXmlString(' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" mc:Ignorable="xr xr3"');
		writer.WriteXmlNullableAttributeNumber("id", this.Id ? this.Id : null);
		writer.WriteXmlNullableAttributeStringEncode("name", this.Name ? this.Name : null);
		writer.WriteXmlNullableAttributeStringEncode("displayName", this.DisplayName);
		writer.WriteXmlNullableAttributeString("ref", this.Ref.getName());
		writer.WriteXmlNullableAttributeNumber("headerRowCount", this.HeaderRowCount);
		writer.WriteXmlNullableAttributeNumber("totalsRowCount", this.TotalsRowCount);

		writer.WriteXmlAttributesEnd();

		if (this.AutoFilter) {
			this.AutoFilter.toXml(writer);
		}
		if (this.SortState) {
			this.SortState.toXml(writer);
		}
		if(this.TableColumns) {
			writer.WriteXmlNodeStart("tableColumns");
			writer.WriteXmlAttributeNumber("count", this.TableColumns.length);
			writer.WriteXmlAttributesEnd();

			for (var i = 0; i < this.TableColumns.length; ++i) {
				this.TableColumns[i].toXml(writer, i);
			}
			writer.WriteXmlNodeEnd("tableColumns");
		}
		if (this.TableStyleInfo) {
			this.TableStyleInfo.toXml(writer);
		}
		/*if(m_oExtLst.IsInit())
		{
			writer.WriteString(m_oExtLst->toXMLWithNS(L""));
		}*/

		writer.WriteXmlNodeEnd("table");
	};
	AscCommonExcel.TablePart.prototype.setAttr = function(attr, val, oAttr) {
		//была идея делать так для удобства, но память нужно экономить
		/*var oAttr = {"ref": "Ref", "displayName" : "DisplayName", "headerRowCount" : "HeaderRowCount"};
		while (reader.MoveToNextAttribute()) {
			this.setAttr(reader.GetName(), reader.GetValue(), oAttr);
		}*/

		if (oAttr[attr]) {
			this[oAttr[attr]] = val;
		}
	};

	/*void CTable::fromXML(XmlUtils::CXmlLiteReader& oReader)
	{
		ReadAttributes( oReader );

		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( (L"autoFilter") == sName )
			m_oAutoFilter = oReader;
		else if ( (L"sortState") == sName )
			m_oSortState = oReader;
		else if ( (L"tableColumns") == sName )
			m_oTableColumns = oReader;
		else if ( (L"tableStyleInfo") == sName )
			m_oTableStyleInfo = oReader;
		else if ((L"extLst") == sName)
			m_oExtLst = oReader;
		}
	}
	void CTable::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
	{
		WritingElement_ReadAttributes_Start( oReader )
		( oReader, L"ref",					m_oRef )
			( oReader, L"name",					m_oName )
			( oReader, L"headerRowCount",		m_oHeaderRowCount )
			( oReader, L"totalsRowCount",		m_oTotalsRowCount )
			( oReader, L"displayName",			m_oDisplayName )
			( oReader, L"tableBorderDxfId",		m_oTableBorderDxfId )
			( oReader, L"comment",				m_oComment )
			( oReader, L"connectionId",			m_oConnectionId )
			( oReader, L"dataDxfId",			m_oDataDxfId )
			( oReader, L"dataCellStyle",		m_oDataCellStyle )
			( oReader, L"headerRowBorderDxfId",	m_oHeaderRowBorderDxfId )
			( oReader, L"headerRowCellStyle",	m_oHeaderRowCellStyle )
			( oReader, L"headerRowDxfId",		m_oHeaderRowDxfId )
			( oReader, L"insertRow",			m_oInsertRow )
			( oReader, L"insertRowShift",		m_oInsertRowShift )
			( oReader, L"published",			m_oPublished )
			( oReader, L"id",					m_oId )
			( oReader, L"tableType",			m_oTableType )
			( oReader, L"totalsRowBorderDxfId",	m_oTotalsRowBorderDxfId )
			( oReader, L"totalsRowCellStyle",	m_oTotalsRowCellStyle )
			( oReader, L"totalsRowDxfId",		m_oTotalsRowDxfId )
			( oReader, L"totalsRowShown",		m_oTotalsRowShown )
		WritingElement_ReadAttributes_End( oReader )
	}*/
	AscCommonExcel.AutoFilter.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("filterColumn" === reader.GetName()) {
				var filterColumn = new AscCommonExcel.FilterColumn();
				filterColumn.fromXml(reader);
				if (!this.FilterColumns) {
					this.FilterColumns = [];
				}
				this.FilterColumns.push(filterColumn);
			} else if ("sortState" === reader.GetName()) {
				var sortState = new AscCommonExcel.SortState();
				sortState.fromXml(reader);
				this.SortState = sortState;
			}
		}
	};
	AscCommonExcel.AutoFilter.prototype.readAttr = function(reader) {
		var val;
		while (reader.MoveToNextAttribute()) {
			if ("ref" === reader.GetName()) {
				val = reader.GetValue();
				this.Ref = AscCommonExcel.g_oRangeCache.getAscRange(val);
			}
		}
	};
	AscCommonExcel.AutoFilter.prototype.toXml = function(writer) {
		writer.WriteXmlNodeStart("autoFilter");
		if (null !== this.Ref) {
			writer.WriteXmlAttributeStringEncode("ref", this.Ref.getName());
		}
		writer.WriteXmlAttributesEnd();
		if (this.FilterColumns) {
			for (var i = 0; i < this.FilterColumns.length; ++i) {
				var elem = this.FilterColumns[i];
				elem.toXml(writer);
			}
		}
		if (this.SortState) {
			this.SortState.toXml(writer);
		}

		writer.WriteXmlNodeEnd("autoFilter");
	};

	AscCommonExcel.TableStyleInfo.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (!reader.IsEmptyNode()) {
			reader.ReadTillEnd();
		}

	};
	AscCommonExcel.TableStyleInfo.prototype.readAttr = function(reader) {
		var val;
		while (reader.MoveToNextAttribute()) {
			if ("name" === reader.GetName()) {
				val = reader.GetValue();
				this.Name = val;
			} else if ("showColumnStripes" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowColumnStripes = val;
			} else if ("showFirstColumn" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowFirstColumn = val;
			} else if ("showLastColumn" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowLastColumn = val;
			} else if ("showRowStripes" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowRowStripes = val;
			}
		}
	};

	AscCommonExcel.TableStyleInfo.prototype.toXml = function (writer) {

		/*int nShowColumnStripes = 0;
		int nShowFirstColumn = 0;
		int nShowLastColumn = 0;
		int nShowRowStripes = 0;
		if(m_oShowColumnStripes.IsInit() && true == m_oShowColumnStripes->ToBool())
		nShowColumnStripes = 1;
		if(m_oShowFirstColumn.IsInit() && true == m_oShowFirstColumn->ToBool())
		nShowFirstColumn = 1;
		if(m_oShowLastColumn.IsInit() && true == m_oShowLastColumn->ToBool())
		nShowLastColumn = 1;
		if(m_oShowRowStripes.IsInit() && true == m_oShowRowStripes->ToBool())
		nShowRowStripes = 1;

		writer.WriteString(L"<tableStyleInfo");
		WritingStringNullableAttrEncodeXmlString(L"name", m_oName, m_oName.get());
		WritingStringAttrInt(L"showFirstColumn", nShowFirstColumn);
		WritingStringAttrInt(L"showLastColumn", nShowLastColumn);
		WritingStringAttrInt(L"showRowStripes", nShowRowStripes);
		WritingStringAttrInt(L"showColumnStripes", nShowColumnStripes);
		writer.WriteString(L"/>");*/

		var nShowColumnStripes = this.ShowColumnStripes === true ? 1 : 0;
		var nShowFirstColumn = this.ShowFirstColumn === true ? 1 : 0;
		var nShowLastColumn = this.ShowLastColumn === true ? 1 : 0;
		var nShowRowStripes = this.ShowRowStripes === true ? 1 : 0;

		writer.WriteXmlNodeStart("tableStyleInfo");

		writer.WriteXmlNullableAttributeStringEncode("name", this.Name);
		writer.WriteXmlAttributeNumber("showFirstColumn", nShowFirstColumn);
		writer.WriteXmlAttributeNumber("showLastColumn", nShowLastColumn);
		writer.WriteXmlAttributeNumber("showRowStripes", nShowRowStripes);
		writer.WriteXmlAttributeNumber("showColumnStripes", nShowColumnStripes);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("tableStyleInfo");
	};

	AscCommonExcel.TableColumn.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("totalsRowFormula" === name) {
				/*var formula = this.stream.GetString2LE(length);
				this.oReadResult.tableCustomFunc.push({formula: formula, column: oTableColumn, ws: this.ws});*/
			} else if ("calculatedColumnFormula" === name) {
				/*var DxfId = this.stream.GetULongLE();
				oTableColumn.dxf = this.Dxfs[DxfId];*/
			}
		}

		/*int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( (L"totalsRowFormula") == sName )
			m_oTotalsRowFormula = oReader.GetText3();
		else if ( (L"calculatedColumnFormula") == sName )
			m_oCalculatedColumnFormula = oReader.GetText3();
		}*/
	};
	AscCommonExcel.TableColumn.prototype.readAttr = function(reader) {

		/*WritingElement_ReadAttributes_Read_if     ( oReader, L"dataCellStyle",		m_oDataCellStyle )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"dataDxfId",			m_oDataDxfId )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"headerRowCellStyle",	m_oHeaderRowCellStyle )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"headerRowDxfId",		m_oHeaderRowDxfId )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"id",					m_oId )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"name",				m_oName )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"queryTableFieldId",	m_oQueryTableFieldId )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"totalsRowCellStyle",	m_oTotalsRowCellStyle )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"totalsRowDxfId",		m_oTotalsRowDxfId )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"totalsRowLabel",		m_oTotalsRowLabel )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"totalsRowFunction",	m_oTotalsRowFunction )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"uniqueName",			m_oUniqueName )
		WritingElement_ReadAttributes_Read_if     ( oReader, L"uid",				m_oUid )*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("name" === reader.GetName()) {
				val = reader.GetValue();
				this.Name = val;
			} else if ("totalsRowLabel" === reader.GetName()) {
				val = reader.GetValue();
				this.TotalsRowLabel = val;
			} else if ("totalsRowFunction" === reader.GetName()) {
				val = reader.GetValue();
				this.TotalsRowFunction = val;
			} else if ("dataDxfId" === reader.GetName()) {
				val = reader.GetValue();
				this.dxf = val;
				/*var DxfId = this.stream.GetULongLE();
				oTableColumn.dxf = this.Dxfs[DxfId];*/
			} else if ("showRowStripes" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowRowStripes = val;
			} else if ("queryTableFieldId" === reader.GetName()) {
				val = reader.GetValueBool();
				this.queryTableFieldId = val;
				//oTableColumn.queryTableFieldId = this.stream.GetULongLE();
			} else if ("uniqueName" === reader.GetName()) {
				val = reader.GetValue();
				this.uniqueName = val;
			}
		}
	};


	AscCommonExcel.TableColumn.prototype.toXml = function (writer, index) {

		/*std::wstring sRoot;
	writer.WriteString(L"<tableColumn");
	WritingStringNullableAttrInt(L"id", m_oId, m_oId->GetValue());
	WritingStringNullableAttrEncodeXmlString(L"name", m_oName, *m_oName);
	WritingStringNullableAttrEncodeXmlString(L"uniqueName", m_oUniqueName, *m_oUniqueName);
	WritingStringNullableAttrEncodeXmlString(L"totalsRowLabel", m_oTotalsRowLabel, m_oTotalsRowLabel.get());
	//есть такой баг: при сохранениии "sum" и названия таблицы "Table1" (русский excel), выдается ошибка в формулах
	WritingStringNullableAttrString(L"totalsRowFunction", m_oTotalsRowFunction, m_oTotalsRowFunction->ToString());
	WritingStringNullableAttrInt(L"queryTableFieldId", m_oQueryTableFieldId, m_oQueryTableFieldId->GetValue());
	WritingStringNullableAttrString(L"dataCellStyle", m_oDataCellStyle, *m_oDataCellStyle);
	WritingStringNullableAttrInt(L"dataDxfId", m_oDataDxfId, m_oDataDxfId->GetValue());
	WritingStringNullableAttrString(L"headerRowCellStyle", m_oHeaderRowCellStyle, *m_oHeaderRowCellStyle);
	WritingStringNullableAttrInt(L"headerRowDxfId", m_oHeaderRowDxfId, m_oHeaderRowDxfId->GetValue());
	WritingStringNullableAttrString(L"totalsRowCellStyle", m_oTotalsRowCellStyle, *m_oTotalsRowCellStyle);
	WritingStringNullableAttrInt(L"totalsRowDxfId", m_oTotalsRowDxfId, m_oTotalsRowDxfId->GetValue());
	if(m_oTotalsRowFormula.IsInit() || m_oCalculatedColumnFormula.IsInit())
	{
		writer.WriteString(L">");

		if(m_oCalculatedColumnFormula.IsInit())
		{
			WritingStringValEncodeXmlString(L"calculatedColumnFormula", m_oCalculatedColumnFormula.get());
		}
		if(m_oTotalsRowFormula.IsInit())
		{
			WritingStringValEncodeXmlString(L"totalsRowFormula", m_oTotalsRowFormula.get());
		}

		writer.WriteString(L"</tableColumn>");
	}
	else
	{
		writer.WriteString(L"/>");
	}*/


		writer.WriteXmlNodeStart("tableColumn");

		writer.WriteXmlNullableAttributeNumber("id", this.Id ? this.Id : index + 1);
		writer.WriteXmlNullableAttributeStringEncode("name", this.Name);
		writer.WriteXmlNullableAttributeStringEncode("uniqueName", this.UniqueName ? this.UniqueName : null);
		writer.WriteXmlNullableAttributeStringEncode("totalsRowLabel", this.TotalsRowLabel);
		//есть такой баг: при сохранениии "sum" и названия таблицы "Table1" (русский excel), выдается ошибка в формулах
		writer.WriteXmlNullableAttributeString("totalsRowFunction", this.TotalsRowFunction);
		writer.WriteXmlNullableAttributeNumber("queryTableFieldId", this.QueryTableFieldId ? this.QueryTableFieldId :  null);
		writer.WriteXmlNullableAttributeString("dataCellStyle", this.DataCellStyle ? this.DataCellStyle : null);
		writer.WriteXmlNullableAttributeNumber("dataDxfId", this.DataDxfId ? this.DataDxfId : null);
		writer.WriteXmlNullableAttributeString("headerRowCellStyle", this.HeaderRowCellStyle ? this.HeaderRowCellStyle : null);
		writer.WriteXmlNullableAttributeNumber("headerRowDxfId", this.HeaderRowDxfId ? this.HeaderRowDxfId : null);
		writer.WriteXmlNullableAttributeString("totalsRowCellStyle", this.TotalsRowCellStyle ? this.TotalsRowCellStyle : null);
		writer.WriteXmlNullableAttributeNumber("totalsRowDxfId", this.TotalsRowDxfId ? this.TotalsRowDxfId : null);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("tableColumn");
	};

	AscCommonExcel.SortState.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("sortCondition" === name) {
				var sortCondition = new AscCommonExcel.SortCondition();
				sortCondition.fromXml(reader);
				if (!this.SortConditions) {
					this.SortConditions = [];
				}
				this.SortConditions.push(sortCondition);
			}
		}
	};

	AscCommonExcel.SortState.prototype.readAttr = function(reader) {
		var val;
		while (reader.MoveToNextAttribute()) {
			if ("ref" === reader.GetName()) {
				val = reader.GetValue();
				this.Ref = AscCommonExcel.g_oRangeCache.getAscRange(val);
			} else if ("caseSensitive" === reader.GetName()) {
				val = reader.GetValueBool();
				this.CaseSensitive = val;
			} else if ("columnSort" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ColumnSort = val;
			} else if ("sortMethod" === reader.GetName()) {
				val = reader.GetValue();
				this.SortMethod = val;
			}
		}
	};

	AscCommonExcel.SortState.prototype.toXml = function (writer) {

		/*if(m_oRef.IsInit() && !m_arrItems.empty())
		{
			writer.WriteString(L"<sortState");
			WritingStringAttrEncodeXmlString(L"ref", m_oRef->ToString());
			WritingStringNullableAttrBool(L"caseSensitive", m_oCaseSensitive);
			WritingStringNullableAttrBool(L"columnSort", m_oColumnSort);
			WritingStringNullableAttrString(L"sortMethod", m_oSortMethod, m_oSortMethod->ToString());
			writer.WriteString(L">");

			for ( size_t i = 0; i < m_arrItems.size(); ++i)
			{
				if (  m_arrItems[i] )
				{
					m_arrItems[i]->toXML(writer);
				}
			}

			writer.WriteString(L"</sortState>");*/

		writer.WriteXmlNodeStart("sortState");
		writer.WriteXmlString(' xmlns:xlrd2="http://schemas.microsoft.com/office/spreadsheetml/2017/richdata2"');

		if (null !== this.Ref) {
			writer.WriteXmlAttributeStringEncode("ref", this.Ref.getName());
		}
		if (null !== this.CaseSensitive) {
			writer.WriteXmlAttributeBool("caseSensitive", this.CaseSensitive);
		}
		if (null !== this.ColumnSort) {
			writer.WriteXmlAttributeBool("columnSort", this.ColumnSort);
		}
		if (null !== this.SortMethod) {
			writer.WriteXmlAttributeString("sortMethod", this.SortMethod);
		}
		writer.WriteXmlAttributesEnd();

		if (this.SortConditions) {
			for (var i = 0; i < this.SortConditions.length; ++i) {
				this.SortConditions[i].toXml(writer);
			}
		}

		writer.WriteXmlNodeEnd("sortState");

	};


	AscCommonExcel.FilterColumn.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var val;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("colorFilter" === name) {
				val = new Asc.ColorFilter();
				val.fromXml(reader);
				this.ColorFilter = val;
			} else if ("dynamicFilter" === name) {
				val = new Asc.DynamicFilter();
				val.fromXml(reader);
				this.DynamicFilter = val;
			} else if ("customFilters" === name) {
				val = new Asc.CustomFilters();
				val.fromXml(reader);
				this.CustomFiltersObj = val;
			} else if ("filters" === name) {
				val = new AscCommonExcel.Filters();
				val.fromXml(reader);
				this.Filters = val;
				this.Filters.sortDate();
				/*oFilterColumn.Filters = new AscCommonExcel.Filters();
				res = this.bcr.Read1(length, function(t,l){
					return oThis.ReadFilters(t,l, oFilterColumn.Filters);
				});
				oFilterColumn.Filters.sortDate();*/
			} else if ("top10" === name) {
				val = new AscCommonExcel.Top10();
				val.fromXml(reader);
				this.Filters = val;
			}
		}
	};

	AscCommonExcel.FilterColumn.prototype.readAttr = function(reader) {
		var val;
		while (reader.MoveToNextAttribute()) {
			if ("colId" === reader.GetName()) {
				val = reader.GetValueInt();
				this.ColId = val;
			} else if ("hiddenButton" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowButton = !val;
			} else if ("showButton" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ShowButton = val;
			}
		}
	};

	AscCommonExcel.FilterColumn.prototype.toXml = function(writer) {
		/*writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		WritingStringNullableAttrInt(L"colId", m_oColId, m_oColId->GetValue());
		if(m_oShowButton.IsInit() && false == m_oShowButton->ToBool())
		writer.WriteString(L" showButton=\"0\"");
		WritingStringNullableAttrBool(L"hiddenButton", m_oHiddenButton);
		writer.EndAttributes();
		if(m_oColorFilter.IsInit())
			m_oColorFilter->toXMLWithNS(writer, child_ns, L"colorFilter", child_ns);
		if(m_oDynamicFilter.IsInit())
			m_oDynamicFilter->toXMLWithNS(writer, child_ns, L"dynamicFilter", child_ns);
		if(m_oCustomFilters.IsInit())
			m_oCustomFilters->toXMLWithNS(writer, child_ns, L"customFilters", child_ns);
		if(m_oFilters.IsInit())
			m_oFilters->toXMLWithNS(writer, child_ns, L"filters", child_ns);
		if(m_oTop10.IsInit())
			m_oTop10->toXMLWithNS(writer, child_ns, L"top10", child_ns);
		writer.EndNodeWithNS(node_ns, node_name);*/

		//TODO дублиуется код в workbookElems

		writer.WriteXmlNodeStart("filterColumn");

		if (null !== this.ColId) {
			writer.WriteXmlAttributeNumber("colId", this.ColId);
		}
		if (true !== this.ShowButton) {
			if (this.ShowButton) {
				writer.WriteXmlAttributeBool("showButton", this.ShowButton);
			} else {
				writer.WriteXmlAttributeBool("hiddenButton", !this.ShowButton);
			}
		}
		writer.WriteXmlAttributesEnd();

		if (null !== this.ColorFilter) {
			this.ColorFilter.toXml(writer);
		}
		if (null !== this.CustomFiltersObj) {
			this.CustomFiltersObj.toXml(writer);
		}
		if (null !== this.DynamicFilter) {
			this.DynamicFilter.toXml(writer);
		}
		if (null !== this.Filters) {
			this.Filters.toXml(writer);
		}
		if (null !== this.Top10) {
			this.Top10.toXml(writer);
		}
		writer.WriteXmlNodeEnd("filterColumn");

	};

	AscCommonExcel.SortCondition.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (!reader.IsEmptyNode()) {
			reader.ReadTillEnd();
		}
	};

	AscCommonExcel.SortCondition.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_SortCondition">
			160 <xsd:attribute name="descending" type="xsd:boolean" use="optional" default="false"/>
			161 <xsd:attribute name="sortBy" type="ST_SortBy" use="optional" default="value"/>
			162 <xsd:attribute name="ref" type="ST_Ref" use="required"/>
			163 <xsd:attribute name="customList" type="s:ST_Xstring" use="optional"/>
			164 <xsd:attribute name="dxfId" type="ST_DxfId" use="optional"/>
			165 <xsd:attribute name="iconSet" type="ST_IconSetType" use="optional" default="3Arrows"/>
			166 <xsd:attribute name="iconId" type="xsd:unsignedInt" use="optional"/>
			167 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("descending"),      m_oDescending )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("ref"),      m_oRef )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("sortBy"),      m_oSortBy )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("dxfId"),      m_oDxfId )*/

		//serialize
		/*var res = c_oSerConstants.ReadOk;
		if ( c_oSer_SortState.ConditionRef == type )
			oSortCondition.Ref = AscCommonExcel.g_oRangeCache.getAscRange(this.stream.GetString2LE(length));
		else if ( c_oSer_SortState.ConditionSortBy == type )
			oSortCondition.ConditionSortBy = this.stream.GetUChar();
		else if ( c_oSer_SortState.ConditionDescending == type )
			oSortCondition.ConditionDescending = this.stream.GetBool();
		else if ( c_oSer_SortState.ConditionDxfId == type )
		{
			var DxfId = this.stream.GetULongLE();
			oSortCondition.dxf = this.Dxfs[DxfId];
		}
		else
			res = c_oSerConstants.ReadUnknown;
		return res;*/

		var val;
		while (reader.MoveToNextAttribute()) {
			if ("descending" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ConditionDescending = val;
			} else if ("ref" === reader.GetName()) {
				val = AscCommonExcel.g_oRangeCache.getAscRange(reader.GetValue());
				this.Ref = val;
			} else if ("sortBy" === reader.GetName()) {
				val = reader.GetValueBool();
				this.ConditionSortBy = val;
			} else if ("dxfId" === reader.GetName()) {
				val = reader.GetValueBool();
				this.dxf = val;
				/*var DxfId = this.stream.GetULongLE();
				oSortCondition.dxf = this.Dxfs[DxfId];*/
			}
		}
	};

	AscCommonExcel.SortCondition.prototype.toXml = function (writer) {

		/*writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		WritingStringNullableAttrString(L"sortBy", m_oSortBy, m_oSortBy->ToString());
		WritingStringNullableAttrBool(L"descending", m_oDescending);
		WritingStringNullableAttrEncodeXmlString(L"ref", m_oRef, m_oRef->ToString());
		WritingStringNullableAttrInt(L"dxfId", m_oDxfId, m_oDxfId->GetValue());
		writer.EndAttributesAndNode();*/

		writer.WriteXmlNodeStart("sortCondition");

		if (null !== this.ConditionSortBy) {
			writer.WriteXmlAttributeString("sortBy", this.ConditionSortBy);
		}
		if (null !== this.ConditionDescending) {
			writer.WriteXmlAttributeBool("descending", this.ConditionDescending);
		}
		if (null !== this.Ref) {
			writer.WriteXmlAttributeStringEncode("ref", this.Ref.getName());
		}
		if (null !== this.dxf) {
			writer.WriteXmlAttributeNumber("dxfId", this.dxf);
		}
		writer.WriteXmlAttributesEnd();


		writer.WriteXmlNodeEnd("sortCondition");
	};

	Asc.ColorFilter.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (!reader.IsEmptyNode()) {
			reader.ReadTillEnd();
		}
	};

	Asc.ColorFilter.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_ColorFilter">
		67 <xsd:attribute name="dxfId" type="ST_DxfId" use="optional"/>
		68 <xsd:attribute name="cellColor" type="xsd:boolean" use="optional" default="true"/>
		69 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Start( oReader )

		WritingElement_ReadAttributes_Read_if     ( oReader, _T("cellColor"),      m_oCellColor )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("dxfId"),      m_oDxfId )

		WritingElement_ReadAttributes_End( oReader )*/

		//serialize
		/*  var res = c_oSerConstants.ReadOk;
		if ( c_oSer_ColorFilter.CellColor == type )
			oColorFilter.CellColor = this.stream.GetBool();
		else if ( c_oSer_ColorFilter.DxfId == type )
		{
			var DxfId = this.stream.GetULongLE();
			oColorFilter.dxf = this.Dxfs[DxfId];
		}
		else
			res = c_oSerConstants.ReadUnknown;*/

		var val;
		while (reader.MoveToNextAttribute()) {
			if ("cellColor" === reader.GetName()) {
				val = reader.GetValueBool();
				this.CellColor = val;
			} else if ("dxfId" === reader.GetName()) {
				//TODO все dxf проверить
				val = reader.GetValue();
				this.dxf = val;
				/*var DxfId = this.stream.GetULongLE();
				oColorFilter.dxf = this.Dxfs[DxfId];*/
			}
		}
	};

	Asc.ColorFilter.prototype.toXml = function(writer) {
		/*writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		WritingStringAttrInt(L"dxfId", m_oDxfId->GetValue());
		if(m_oCellColor.IsInit() && false == m_oCellColor->ToBool())
		writer.WriteString(L" cellColor=\"0\"");
		writer.EndAttributesAndNode();*/

		writer.WriteXmlNodeStart("colorFilter");
		writer.WriteXmlNullableAttributeNumber("dxfId", this.dxf ? this.dxf : null);
		if (this.CellColor === false) {
			writer.WriteXmlNullableAttributeNumber("cellColor", 0);
		}
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("colorFilter");
	};

	Asc.DynamicFilter.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (!reader.IsEmptyNode()) {
			reader.ReadTillEnd();
		}
	};

	Asc.DynamicFilter.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_DynamicFilter">
		85 <xsd:attribute name="type" type="ST_DynamicFilterType" use="required"/>
		86 <xsd:attribute name="valIso" type="xsd:dateTime" use="optional"/>
		87 <xsd:attribute name="maxValIso" type="xsd:dateTime" use="optional"/>
		88 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("type"),      m_oType )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oVal )
		WritingElement_ReadAttributes_Read_if     ( oReader, _T("maxVal"),      m_oMaxVal )*/

		//serialize
		/*   if ( c_oSer_DynamicFilter.Type == type )
                oDynamicFilter.Type = this.stream.GetUChar();
            else if ( c_oSer_DynamicFilter.Val == type )
                oDynamicFilter.Val = this.stream.GetDoubleLE();
            else if ( c_oSer_DynamicFilter.MaxVal == type )
                oDynamicFilter.MaxVal = this.stream.GetDoubleLE();*/

		var val;
		while (reader.MoveToNextAttribute()) {
			if ("type" === reader.GetName()) {
				val = reader.GetValue();
				this.Type = val;
			} else if ("val" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.val = val;
			} else if ("maxVal" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.MaxVal = val;
			}
		}
	};

	Asc.DynamicFilter.prototype.toXml = function(writer) {
		/*writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		WritingStringAttrString(L"type", m_oType->ToString());
		WritingStringNullableAttrDouble(L"val", m_oVal, m_oVal->GetValue());
		WritingStringNullableAttrDouble(L"maxVal", m_oMaxVal, m_oMaxVal->GetValue());
		writer.EndAttributesAndNode();*/

		writer.WriteXmlNodeStart("dynamicFilter");
		writer.WriteXmlAttributeString("type", this.Type);
		writer.WriteXmlNullableAttributeNumber("val", this.val);
		writer.WriteXmlNullableAttributeNumber("maxVal", this.MaxVal);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("dynamicFilter");
	};

	Asc.CustomFilters.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("customFilter" === name) {
				var val = new Asc.CustomFilter();
				val.fromXml(reader);
				if (!this.CustomFilters) {
					this.CustomFilters = [];
				}
				this.CustomFilters.push(val);
			}
		}

		/*ReadAttributes( oReader );

		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( _T("customFilter") == sName )
				m_arrItems.push_back( new CCustomFilter(oReader));
		}*/
	};

	Asc.CustomFilters.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_CustomFilters">
		51 <xsd:sequence>
		52 <xsd:element name="customFilter" type="CT_CustomFilter" minOccurs="1" maxOccurs="2"/>
		53 </xsd:sequence>
		54 <xsd:attribute name="and" type="xsd:boolean" use="optional" default="false"/>
		55 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("and"),      m_oAnd )*/

		//serialize
		/*    if ( c_oSer_CustomFilters.And == type )
                oCustomFilters.And = this.stream.GetBool();
            else if ( c_oSer_CustomFilters.CustomFilters == type )
            {
                oCustomFilters.CustomFilters = [];
                res = this.bcr.Read1(length, function(t,l){
                    return oThis.ReadCustomFiltersItems(t,l, oCustomFilters.CustomFilters);
                });
            }*/

		var val;
		while (reader.MoveToNextAttribute()) {
			if ("And" === reader.GetName()) {
				val = reader.GetValueBool();
				this.And = val;
			}
		}
	};

	Asc.CustomFilters.prototype.toXml = function(writer) {
		/*if(m_arrItems.empty()) return;

		writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		if (m_oAnd.IsInit() && true == m_oAnd->ToBool())
		writer.WriteString(L" and=\"1\"");
		writer.EndAttributes();

		for ( size_t i = 0; i < m_arrItems.size(); ++i)
		{
			if (  m_arrItems[i] )
			{
				m_arrItems[i]->toXMLWithNS(writer, child_ns, L"customFilter", child_ns);
			}
		}

		writer.EndNodeWithNS(node_ns, node_name);*/

		writer.WriteXmlNodeStart("сustomFilters");

		writer.WriteXmlNullableAttributeString("and", this.And ? 1 : null);
		writer.WriteXmlAttributesEnd();

		for ( var i = 0; i < this.CustomFilters.length; ++i)
		{
			this.CustomFilters[i].toXml(writer);
		}

		writer.WriteXmlNodeEnd("сustomFilters");
	};

	Asc.CustomFilter.prototype.fromXml = function (reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};

	Asc.CustomFilter.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_CustomFilters">
		51 <xsd:sequence>
		52 <xsd:element name="customFilter" type="CT_CustomFilter" minOccurs="1" maxOccurs="2"/>
		53 </xsd:sequence>
		54 <xsd:attribute name="and" type="xsd:boolean" use="optional" default="false"/>
		55 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("operator"),      m_oOperator )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oVal )*/

		//serialize
		/*     var res = c_oSerConstants.ReadOk;
            if ( c_oSer_CustomFilters.Operator == type )
                oCustomFiltersItem.Operator = this.stream.GetUChar();
            else if ( c_oSer_CustomFilters.Val == type )
                oCustomFiltersItem.Val = this.stream.GetString2LE(length);*/

		var val;
		while (reader.MoveToNextAttribute()) {
			if ("operator" === reader.GetName()) {
				val = reader.GetValue();
				this.Operator = this.convertOperator(val);
			} else if ("val" === reader.GetName()) {
				val = reader.GetValue();
				this.Val = val;
			}
		}
	};

	Asc.CustomFilter.prototype.toXml = function(writer) {
		/*if(m_oOperator.IsInit() && m_oVal.IsInit())
		{
			writer.StartNodeWithNS(node_ns, node_name);
			writer.StartAttributes();
			WritingStringAttrString(L"operator", m_oOperator->ToString());
			WritingStringAttrEncodeXmlString(L"val", m_oVal.get());
			writer.EndAttributesAndNode();
		}*/

		writer.WriteXmlNodeStart("сustomFilter");

		writer.WriteXmlAttributeString("operator", this.convertOperator(this.Operator, true));
		writer.WriteXmlAttributeStringEncode("val", this.Val);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("сustomFilter");
	};

	Asc.CustomFilter.prototype.convertOperator = function(val, revert) {
		/*<xsd:simpleType name="ST_FilterOperator">
					75 <xsd:restriction base="xsd:string">
					76 <xsd:enumeration value="equal"/>
					77 <xsd:enumeration value="lessThan"/>
					78 <xsd:enumeration value="lessThanOrEqual"/>
					79 <xsd:enumeration value="notEqual"/>
					80 <xsd:enumeration value="greaterThanOrEqual"/>
					81 <xsd:enumeration value="greaterThan"/>
					82 </xsd:restriction>
					83 </xsd:simpleType>*/

		/*var c_oAscCustomAutoFilter = {
			equals: 1,
			isGreaterThan: 2,
			isGreaterThanOrEqualTo: 3,
			isLessThan: 4,
			isLessThanOrEqualTo: 5,
			doesNotEqual: 6,
			beginsWith: 7,
			doesNotBeginWith: 8,
			endsWith: 9,
			doesNotEndWith: 10,
			contains: 11,
			doesNotContain: 12
		};*/

		var res;
		if (revert) {
			switch (val) {
				case Asc.c_oAscCustomAutoFilter.equals:
					res = "equal";
					break;
				case Asc.c_oAscCustomAutoFilter.isLessThan:
					res = "lessThan";
					break;
				case Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo:
					res = "lessThanOrEqual";
					break;
				case Asc.c_oAscCustomAutoFilter.doesNotEqual:
					res = "notEqual";
					break;
				case Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo:
					res = "greaterThanOrEqual";
					break;
				case Asc.c_oAscCustomAutoFilter.isGreaterThan:
					res = "greaterThan";
					break;
			}
		} else {
			switch (val) {
				case "equal":
					res = Asc.c_oAscCustomAutoFilter.equals;
					break;
				case "lessThan":
					res = Asc.c_oAscCustomAutoFilter.isLessThan;
					break;
				case "lessThanOrEqual":
					res = Asc.c_oAscCustomAutoFilter.isLessThanOrEqualTo;
					break;
				case "notEqual":
					res = Asc.c_oAscCustomAutoFilter.doesNotEqual;
					break;
				case "greaterThanOrEqual":
					res = Asc.c_oAscCustomAutoFilter.isGreaterThanOrEqualTo;
					break;
				case "greaterThan":
					res = Asc.c_oAscCustomAutoFilter.isGreaterThan;
					break;
			}
		}

		return res;
	};

	AscCommonExcel.Filters.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var val;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("dateGroupItem" === name) {
				val = new AscCommonExcel.DateGroupItem();
				val.fromXml(reader);
				var autoFilterDateElem = new AscCommonExcel.AutoFilterDateElem();
				autoFilterDateElem.convertDateGroupItemToRange(val);
				this.Dates.push(autoFilterDateElem);
			} else if ("filter" === name) {
				val = new AscCommonExcel.Filter();
				val.fromXml(reader);
				if (null != val.Val) {
					this.Values[val.Val] = 1;
				}
			}
		}

		/*ReadAttributes( oReader );

		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( _T("dateGroupItem") == sName )
				m_arrItems.push_back( new CDateGroupItem(oReader));
			if ( _T("filter") == sName )
				m_arrItems.push_back( new CFilter(oReader));
		}*/

	};

	AscCommonExcel.Filters.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_Filters">
		39 <xsd:sequence>
		40 <xsd:element name="filter" type="CT_Filter" minOccurs="0" maxOccurs="unbounded"/>
		41 <xsd:element name="dateGroupItem" type="CT_DateGroupItem" minOccurs="0"
		42 maxOccurs="unbounded"/>
		43 </xsd:sequence>Annex A
		4409
		44 <xsd:attribute name="blank" type="xsd:boolean" use="optional" default="false"/>
		45 <xsd:attribute name="calendarType" type="s:ST_CalendarType" use="optional" default="none"/>
		46 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("blank"),      m_oBlank )*/

		//serialize
		/*    var res = c_oSerConstants.ReadOk;
		var oThis = this;
		if ( c_oSer_FilterColumn.Filter == type )
		{
			var oFilterVal = new AscCommonExcel.Filter();
			res = this.bcr.Read1(length, function(t,l){
				return oThis.ReadFilter(t,l, oFilterVal);
			});
			if(null != oFilterVal.Val)
				oFilters.Values[oFilterVal.Val] = 1;
		}
		else if ( c_oSer_FilterColumn.DateGroupItem == type )
		{
			var oDateGroupItem = new AscCommonExcel.DateGroupItem();
			res = this.bcr.Read2Spreadsheet(length, function(t,l){
				return oThis.ReadDateGroupItem(t,l, oDateGroupItem);
			});

			var autoFilterDateElem = new AscCommonExcel.AutoFilterDateElem();
			autoFilterDateElem.convertDateGroupItemToRange(oDateGroupItem);
			oFilters.Dates.push(autoFilterDateElem);
		}
		else if ( c_oSer_FilterColumn.FiltersBlank == type )
			oFilters.Blank = this.stream.GetBool();
		else
			res = c_oSerConstants.ReadUnknown;
		return res;*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("blank" === reader.GetName()) {
				val = reader.GetValueBool();
				this.Blank = val;
			}
		}
	};

	AscCommonExcel.Filters.prototype.toXml = function(writer) {


		/*if(!m_arrItems.empty() || m_oBlank.IsInit())
		{
			writer.StartNodeWithNS(node_ns, node_name);
			writer.StartAttributes();
			WritingStringNullableAttrBool(L"blank", m_oBlank);
			writer.EndAttributes();

			for ( size_t i = 0; i < m_arrItems.size(); ++i)
			{
				if (  m_arrItems[i] )
				{
					CFilter* pFilter = dynamic_cast<CFilter*>(m_arrItems[i]);
					CDateGroupItem* pDateGroupItem = dynamic_cast<CDateGroupItem*>(m_arrItems[i]);
					if(pFilter)
					{
						pFilter->toXMLWithNS(writer, child_ns, L"filter", child_ns);
					}
					else if(pDateGroupItem)
					{
						pDateGroupItem->toXMLWithNS(writer, child_ns, L"dateGroupItem", child_ns);
					}
				}
			}

			writer.EndNodeWithNS(node_ns, node_name);
		}*/

		writer.WriteXmlNodeStart("filters");

		writer.WriteXmlNullableAttributeBool("blank", this.Blank);
		writer.WriteXmlAttributesEnd();

		var i;
		if (this.Values) {
			for (i in this.Values) {
				writer.WriteXmlNodeStart("filter");

				writer.WriteXmlNullableAttributeStringEncode("val", i);
				writer.WriteXmlAttributesEnd();

				writer.WriteXmlNodeEnd("filter");
			}
		}
		if (this.Dates) {
			for (i = 0; i < this.Dates.length; i++) {
				this.Dates[i].toXml(writer);
			}
		}

		writer.WriteXmlNodeEnd("filters");

	};

	AscCommonExcel.DateGroupItem.prototype.fromXml = function (reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};

	AscCommonExcel.DateGroupItem.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:simpleType name="ST_DateTimeGrouping">
		193 <xsd:restriction base="xsd:string">
		194 <xsd:enumeration value="year"/>
		195 <xsd:enumeration value="month"/>
		196 <xsd:enumeration value="day"/>
		197 <xsd:enumeration value="hour"/>
		198 <xsd:enumeration value="minute"/>
		199 <xsd:enumeration value="second"/>
		200 </xsd:restriction>
		201 </xsd:simpleType>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("dateTimeGrouping"),      m_oDateTimeGrouping )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("day"),      m_oDay )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("hour"),      m_oHour )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("minute"),      m_oMinute )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("month"),      m_oMonth )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("second"),      m_oSecond )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("year"),      m_oYear )*/

		//serialize
		/*   if ( c_oSer_DateGroupItem.DateTimeGrouping == type )
                oDateGroupItem.DateTimeGrouping = this.stream.GetUChar();
            else if ( c_oSer_DateGroupItem.Day == type )
                oDateGroupItem.Day = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Hour == type )
                oDateGroupItem.Hour = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Minute == type )
                oDateGroupItem.Minute = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Month == type )
                oDateGroupItem.Month = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Second == type )
                oDateGroupItem.Second = this.stream.GetULongLE();
            else if ( c_oSer_DateGroupItem.Year == type )
                oDateGroupItem.Year = this.stream.GetULongLE();
            else*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("dateTimeGrouping" === reader.GetName()) {
				val = reader.GetValue();
				this.DateTimeGrouping = val;
			} else if ("day" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Day = val;
			} else if ("hour" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Hour = val;
			} else if ("minute" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Minute = val;
			} else if ("month" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Month = val;
			} else if ("second" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Second = val;
			} else if ("year" === reader.GetName()) {
				val = reader.GetValueDouble();
				this.Year = val;
			}
		}
	};

	AscCommonExcel.DateGroupItem.prototype.toXml = function(writer) {


		/*writer.StartNodeWithNS(node_ns, node_name);
		writer.StartAttributes();
		WritingStringNullableAttrInt(L"year", m_oYear, m_oYear->GetValue());
		WritingStringNullableAttrInt(L"month", m_oMonth, m_oMonth->GetValue());
		WritingStringNullableAttrInt(L"day", m_oDay, m_oDay->GetValue());
		WritingStringNullableAttrInt(L"hour", m_oHour, m_oHour->GetValue());
		WritingStringNullableAttrInt(L"minute", m_oMinute, m_oMinute->GetValue());
		WritingStringNullableAttrInt(L"second", m_oSecond, m_oSecond->GetValue());
		WritingStringNullableAttrString(L"dateTimeGrouping", m_oDateTimeGrouping, m_oDateTimeGrouping->ToString());
		writer.EndAttributesAndNode();*/

		writer.WriteXmlNodeStart("dateGroupItem");

		writer.WriteXmlNullableAttributeNumber("year", this.Year);
		writer.WriteXmlNullableAttributeNumber("month", this.Month);
		writer.WriteXmlNullableAttributeNumber("day", this.Day);
		writer.WriteXmlNullableAttributeNumber("hour", this.Hour);
		writer.WriteXmlNullableAttributeNumber("minute", this.Minute);
		writer.WriteXmlNullableAttributeNumber("second", this.Second);
		writer.WriteXmlNullableAttributeString("dateTimeGrouping", this.DateTimeGrouping);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("dateGroupItem");

	};

	AscCommonExcel.Filter.prototype.fromXml = function (reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};

	AscCommonExcel.Filter.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:attribute name="val" type="s:ST_Xstring"/>*/

		//x2t
		/*WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oVal )*/

		//serialize
		/*    var res = c_oSerConstants.ReadOk;
            if ( c_oSer_Filter.Val == type )
                oFilter.Val = this.stream.GetString2LE(length);*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("val" === reader.GetName()) {
				val = reader.GetValue();
				this.Val = val;
			}
		}
	};

	AscCommonExcel.Filter.prototype.toXml = function(writer) {

		/*if(m_oVal.IsInit())
		{
			writer.StartNodeWithNS(node_ns, node_name);
			writer.StartAttributes();
			WritingStringAttrEncodeXmlString(L"val", *m_oVal);
			writer.EndAttributesAndNode();
		}*/

		writer.WriteXmlNodeStart("filter");

		writer.WriteXmlNullableAttributeStringEncode("val", this.Val);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeEnd("filter");

	};


	/*void CDataValidations::fromXML(XmlUtils::CXmlLiteReader& oReader)
	{
		ReadAttributes( oReader );

		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

			if ( L"dataValidation" == sName )
			{
				m_arrItems.push_back( new CDataValidation( oReader ));
			}
		}
	}

	void CDataValidations::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
	{
		WritingElement_ReadAttributes_Start( oReader )
		WritingElement_ReadAttributes_Read_if		( oReader, L"count",	m_oCount)
		WritingElement_ReadAttributes_Read_else_if	( oReader, L"disablePrompts",m_oDisablePrompts)
		WritingElement_ReadAttributes_Read_else_if	( oReader, L"xWindow",	m_oXWindow)
		WritingElement_ReadAttributes_Read_else_if	( oReader, L"yWindow",	m_oYWindow)
		WritingElement_ReadAttributes_End( oReader )
	}*/

	AscCommonExcel.CDataValidations.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		var val;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("dataValidation" === name) {
				val = new AscCommonExcel.CDataValidation();
				val.fromXml(reader);
				this.elems.push(val);
			}
		}

		/*void CDataValidations::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());

				if ( L"dataValidation" == sName )
				{
					m_arrItems.push_back( new CDataValidation( oReader ));
				}
			}
		}*/
	};

	AscCommonExcel.CDataValidations.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_DataValidations">
			2595 <xsd:sequence>
			2596 <xsd:element name="dataValidation" type="CT_DataValidation" minOccurs="1"
			2597 maxOccurs="unbounded"/>
			2598 </xsd:sequence>
			2599 <xsd:attribute name="disablePrompts" type="xsd:boolean" use="optional" default="false"/>
			2600 <xsd:attribute name="xWindow" type="xsd:unsignedInt" use="optional"/>
			2601 <xsd:attribute name="yWindow" type="xsd:unsignedInt" use="optional"/>
			2602 <xsd:attribute name="count" type="xsd:unsignedInt" use="optional"/>
			2603 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if		( oReader, L"count",	m_oCount)
			WritingElement_ReadAttributes_Read_else_if	( oReader, L"disablePrompts",m_oDisablePrompts)
			WritingElement_ReadAttributes_Read_else_if	( oReader, L"xWindow",	m_oXWindow)
			WritingElement_ReadAttributes_Read_else_if	( oReader, L"yWindow",	m_oYWindow)
			WritingElement_ReadAttributes_End( oReader )*/

		//serialize
		/*   var res = c_oSerConstants.ReadOk;
			var oThis = this;
			if (c_oSer_DataValidation.DataValidations == type) {
				res = this.bcr.Read1(length, function(t, l) {
					return oThis.ReadDataValidationsContent(t, l, dataValidations);
				});
			} else if (c_oSer_DataValidation.DisablePrompts == type) {
				dataValidations.disablePrompts = this.stream.GetBool();
			} else if (c_oSer_DataValidation.XWindow == type) {
				dataValidations.xWindow = this.stream.GetLong();
			} else if (c_oSer_DataValidation.YWindow == type) {
				dataValidations.yWindow = this.stream.GetLong();
            } else
                res = c_oSerConstants.ReadUnknown;
            return res;*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("disablePrompts" === reader.GetName()) {
				val = reader.GetValueBool();
				this.disablePrompts = val;
			} else if ("XWindow" === reader.GetName()) {
				val = reader.GetValueInt();
				this.XWindow = val;
			} else if ("yWindow" === reader.GetName()) {
				val = reader.GetValueInt();
				this.yWindow = val;
			}
		}
	};

	AscCommonExcel.CDataValidation.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		//TODO EXT x14:
		var val;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("formula1" === name) {
				val = new Asc.CDataFormula(reader.GetText());
				this.formula1 = val;
			} else if ("formula2" === name) {
				val = new Asc.CDataFormula(reader.GetText());
				this.formula2 = val;
			} else if ("sqref" === name) {
				this.setSqRef(reader.GetText());
			}
			//--------------------------------------------------- xml spreadsheet 2002
			else if ("Range" == name) {
				/*r1c1_formula_convert::base_row = 1;
				r1c1_formula_convert::base_col = 1;

				r1c1_formula_convert convert;

				m_oSqRef = convert.convert(oReader.GetText2());*/
			} else if ("Type" == name) {
				/*m_oType = oReader.GetText2();

				m_oAllowBlank.Init();
				m_oAllowBlank->FromBool(true);

				m_oShowInputMessage.Init();
				m_oShowInputMessage->FromBool(true);*/
			} else if ("Value" == name) {
				/*r1c1_formula_convert::base_row = 1;
				r1c1_formula_convert::base_col = 1;

				r1c1_formula_convert convert;

				m_oFormula1 = new CDataValidationFormula(m_pMainDocument);
				m_oFormula1->m_sText = convert.convert(oReader.GetText3());*/
			}
		}

		/*void CDataValidation::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while (oReader.ReadNextSiblingNode(nCurDepth))
			{
				std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());
				if (L"formula1" == sName)
				{
					m_oFormula1 = oReader;
				}
			else if (L"formula2" == sName)
				{
					m_oFormula2 = oReader;
				}
			else if (L"sqref" == sName)
				{
					m_oSqRef = oReader.GetText2();
				}
//--------------------------------------------------- xml spreadsheet 2002
			else if (L"Range" == sName)
				{
					r1c1_formula_convert::base_row = 1;
					r1c1_formula_convert::base_col = 1;

					r1c1_formula_convert convert;

					m_oSqRef = convert.convert(oReader.GetText2());
				}
			else if (L"Type" == sName)
				{
					m_oType = oReader.GetText2();

					m_oAllowBlank.Init();
					m_oAllowBlank->FromBool(true);

					m_oShowInputMessage.Init();
					m_oShowInputMessage->FromBool(true);
				}
			else if (L"Value" == sName)
				{
					r1c1_formula_convert::base_row = 1;
					r1c1_formula_convert::base_col = 1;

					r1c1_formula_convert convert;

					m_oFormula1 = new CDataValidationFormula(m_pMainDocument);
					m_oFormula1->m_sText = convert.convert(oReader.GetText3());

					//if (m_oFormula1->m_sText.find(L"!") == std::wstring::npos)
					//{
					//	CXlsxFlat* xlsx_flat = dynamic_cast<CXlsxFlat*>(m_pMainDocument);
					//	if (xlsx_flat)
					//	{
					//		CSheet *pSheet = xlsx_flat->m_pWorkbook->m_oSheets->m_arrItems.back();
					//		if (pSheet->m_oName.IsInit())
					//		{
					//			m_oFormula1->m_sText = *pSheet->m_oName + L"!" + m_oFormula1->m_sText;
					//		}
					//	}
					//}
				}
			}
		}*/
	};

	AscCommonExcel.CDataValidation.prototype.readAttr = function(reader) {
		//documentation
		/*<xsd:complexType name="CT_DataValidation">
			2605 <xsd:sequence>
			2606 <xsd:element name="formula1" type="ST_Formula" minOccurs="0" maxOccurs="1"/>
			2607 <xsd:element name="formula2" type="ST_Formula" minOccurs="0" maxOccurs="1"/>
			2608 </xsd:sequence>
			2609 <xsd:attribute name="type" type="ST_DataValidationType" use="optional" default="none"/>
			2610 <xsd:attribute name="errorStyle" type="ST_DataValidationErrorStyle" use="optional"
			2611 default="stop"/>
			2612 <xsd:attribute name="imeMode" type="ST_DataValidationImeMode" use="optional"
			2613 default="noControl"/>
			2614 <xsd:attribute name="operator" type="ST_DataValidationOperator" use="optional"
			2615 default="between"/>
			2616 <xsd:attribute name="allowBlank" type="xsd:boolean" use="optional" default="false"/>
			2617 <xsd:attribute name="showDropDown" type="xsd:boolean" use="optional" default="false"/>
			2618 <xsd:attribute name="showInputMessage" type="xsd:boolean" use="optional" default="false"/>
			2619 <xsd:attribute name="showErrorMessage" type="xsd:boolean" use="optional" default="false"/>
			2620 <xsd:attribute name="errorTitle" type="s:ST_Xstring" use="optional"/>
			2621 <xsd:attribute name="error" type="s:ST_Xstring" use="optional"/>
			2622 <xsd:attribute name="promptTitle" type="s:ST_Xstring" use="optional"/>
			2623 <xsd:attribute name="prompt" type="s:ST_Xstring" use="optional"/>
			2624 <xsd:attribute name="sqref" type="ST_Sqref" use="required"/>
			2625 </xsd:complexType>*/

		//x2t
		/*WritingElement_ReadAttributes_StartChar( oReader )
			WritingElement_ReadAttributes_Read_ifChar		( oReader, "allowBlank",	m_oAllowBlank)
			else if ( strcmp("error", wsName) == 0 )
			{
				m_oError = oReader.GetAttributeTextWithHHHH();
			}
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "errorStyle",	m_oErrorStyle)
			else if ( strcmp("errorTitle", wsName) == 0 )
			{
				m_oErrorTitle = oReader.GetAttributeTextWithHHHH();
			}
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "imeMode",		m_oImeMode)
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "operator",		m_oOperator)
			else if ( strcmp("prompt", wsName) == 0 )
			{
				m_oPrompt = oReader.GetAttributeTextWithHHHH();
			}
			else if ( strcmp("promptTitle", wsName) == 0 )
			{
				m_oPromptTitle = oReader.GetAttributeTextWithHHHH();
			}
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "showDropDown",	m_oShowDropDown)
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "showErrorMessage",m_oShowErrorMessage)
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "showInputMessage",m_oShowInputMessage)
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "sqref",			m_oSqRef)
			WritingElement_ReadAttributes_Read_else_ifChar	( oReader, "type",			m_oType)
			WritingElement_ReadAttributes_EndChar( oReader )*/

		//serialize
		/*  var res = c_oSerConstants.ReadOk;
			if (c_oSer_DataValidation.AllowBlank == type) {
				dataValidation.allowBlank = this.stream.GetBool();
			} else if (c_oSer_DataValidation.Type == type) {
				dataValidation.type = this.stream.GetUChar();
			} else if (c_oSer_DataValidation.Error == type) {
				dataValidation.error = this.stream.GetString2LE(length);
			} else if (c_oSer_DataValidation.ErrorTitle == type) {
				dataValidation.errorTitle = this.stream.GetString2LE(length);
			} else if (c_oSer_DataValidation.ErrorStyle == type) {
				dataValidation.errorStyle = this.stream.GetUChar();
			} else if (c_oSer_DataValidation.ImeMode == type) {
				dataValidation.imeMode = this.stream.GetUChar();
			} else if (c_oSer_DataValidation.Operator == type) {
				dataValidation.operator = this.stream.GetUChar();
			} else if (c_oSer_DataValidation.Prompt == type) {
				dataValidation.prompt = this.stream.GetString2LE(length);
			} else if (c_oSer_DataValidation.PromptTitle == type) {
				dataValidation.promptTitle = this.stream.GetString2LE(length);
			} else if (c_oSer_DataValidation.ShowDropDown == type) {
				dataValidation.showDropDown = this.stream.GetBool();
			} else if (c_oSer_DataValidation.ShowErrorMessage == type) {
				dataValidation.showErrorMessage = this.stream.GetBool();
			} else if (c_oSer_DataValidation.ShowInputMessage == type) {
				dataValidation.showInputMessage = this.stream.GetBool();
			} else if (c_oSer_DataValidation.SqRef == type) {
			    dataValidation.setSqRef(this.stream.GetString2LE(length));
			} else if (c_oSer_DataValidation.Formula1 == type) {
			    dataValidation.formula1 = new Asc.CDataFormula(this.stream.GetString2LE(length));
			} else if (c_oSer_DataValidation.Formula2 == type) {
                dataValidation.formula2 = new Asc.CDataFormula(this.stream.GetString2LE(length));
			} else
				res = c_oSerConstants.ReadUnknown;
			return res;*/


		var val;
		while (reader.MoveToNextAttribute()) {
			if ("allowBlank" === reader.GetName()) {
				val = reader.GetValueBool();
				this.allowBlank = val;
			} else if ("error" === reader.GetName()) {
				val = reader.GetValue();
				this.error = val;
			} else if ("errorStyle" === reader.GetName()) {
				val = reader.GetValue();
				this.errorStyle = val;
			} else if ("errorTitle" === reader.GetName()) {
				val = reader.GetValue();
				this.errorTitle = val;
			} else if ("imeMode" === reader.GetName()) {
				val = reader.GetValue();
				this.imeMode = val;
			} else if ("operator" === reader.GetName()) {
				val = reader.GetValue();
				this.operator = val;
			} else if ("prompt" === reader.GetName()) {
				val = reader.GetValue();
				this.prompt = val;
			} else if ("promptTitle" === reader.GetName()) {
				val = reader.GetValue();
				this.promptTitle = val;
			} else if ("showDropDown" === reader.GetName()) {
				val = reader.GetValueBool();
				this.showDropDown = val;
			} else if ("showErrorMessage" === reader.GetName()) {
				val = reader.GetValueBool();
				this.showErrorMessage = val;
			} else if ("showInputMessage" === reader.GetName()) {
				val = reader.GetValueBool();
				this.showInputMessage = val;
			} else if ("sqref" === reader.GetName()) {
				val = reader.GetValue();
				this.setSqRef(val);
			} else if ("type" === reader.GetName()) {
				val = reader.GetValue();
				this.type = val;
			}
		}
	};


	//COfficeArtExtensionList

	/*virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
	{
		if ( oReader.IsEmptyNode() )
			return;

		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());
			if ( _T("ext") == sName )
			{
				OOX::Drawing::COfficeArtExtension *oExt = new OOX::Drawing::COfficeArtExtension(oReader);
				if (oExt) m_arrExt.push_back( oExt );
			}
		}
	}*/

	function COfficeArtExtensionList () {
		this.m_arrExt = [];
	}

	COfficeArtExtensionList.prototype.fromXml = function (reader) {
		if (reader.IsEmptyNode()) {
			return;
		}

		/*virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());
				if ( _T("ext") == sName )
				{
					OOX::Drawing::COfficeArtExtension *oExt = new OOX::Drawing::COfficeArtExtension(oReader);
					if (oExt) m_arrExt.push_back( oExt );
				}
			}
		}*/

		//TODO обработать ext!
		var val;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if ("ext" === name) {
				val = new COfficeArtExtension();
				val.fromXml(reader);
				this.m_arrExt.push(val.extArr);
			}
		}
	};

	function COfficeArtExtension() {
		this.uri = null;
		this.extArr = [];
	}

	COfficeArtExtension.prototype.fromXml = function (reader) {
		this.readAttr(reader);

		if (reader.IsEmptyNode()) {
			return;
		}

		if (this.uri === "{63B3BB69-23CF-44E3-9099-C40C66FF867C}"	||
		this.uri === "{05C60535-1F16-4fd2-B633-F4F36F0B64E0}"	||
		this.uri === "{504A1905-F514-4f6f-8877-14C23A59335A}"	||
		this.uri === "{78C0D931-6437-407d-A8EE-F0AAD7539E65}"	||
		this.uri === "{B025F937-C7B1-47D3-B67F-A62EFF666E3E}"	||
		this.uri === "{CCE6A557-97BC-4b89-ADB6-D9C93CAAB3DF}"	||
		this.uri === "{A8765BA9-456A-4dab-B4F3-ACF838C121DE}"	||
		this.uri === "{3A4CF648-6AED-40f4-86FF-DC5316D8AED3}"	||
		this.uri === "{BBE1A952-AA13-448e-AADC-164F8A28A991}"	||
		this.uri === "{46BE6895-7355-4a93-B00E-2C351335B9C9}"	||
		this.uri === "{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"	||
		this.uri === "{03082B11-2C62-411c-B77F-237D8FCFBE4C}"	||
		this.uri === "{2F2917AC-EB37-4324-AD4E-5DD8C200BD13}"	||
		this.uri === "{470722E0-AACD-4C17-9CDC-17EF765DBC7E}"	||
		this.uri === "{46F421CA-312F-682f-3DD2-61675219B42D}"	||
		this.uri === "{DE250136-89BD-433C-8126-D09CA5730AF9}"	||
		this.uri === "{19B8F6BF-5375-455C-9EA6-DF929625EA0E}"	||
		this.uri === "http://schemas.microsoft.com/office/drawing/2008/diagram") {
			var val;
			var depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				var name = reader.GetNameNoNS();
				if ("compatExt" === name) {
					/*val = new AscCommonExcel.CDataValidation();
					val.fromXml(reader);
					this.elems.push(val);*/
				} else if ("compatExt" === name) {

				} else if ("sparklineGroups" === name) {

				} else if ("dataModelExt" === name) {

				} else if ("table" === name) {

				} else if ("conditionalFormattings" === name) {

				} else if ("dataValidations" === name) {
					val = new AscCommonExcel.CDataValidations();
					val.fromXml(reader);
					this.extArr.push(val);
				} else if ("connection" === name) {

				} else if ("slicerList" === name) {

				} else if ("slicerCaches" === name) {

				} else if ("dxfs" === name) {

				} else if ("slicerStyles" === name) {

				} else if ("slicerCachePivotTables" === name) {

				} else if ("tableSlicerCache" === name) {

				} else if ("slicerCacheHideItemsWithNoData" === name) {

				} else if ("id" === name) {

				}  else if ("presenceInfo" === name) {

				}
			}
		}


		/*if ((m_sUri.IsInit()) && (*m_sUri == L"{63B3BB69-23CF-44E3-9099-C40C66FF867C}"	||
		*m_sUri == L"{05C60535-1F16-4fd2-B633-F4F36F0B64E0}"	||
	*m_sUri == L"{504A1905-F514-4f6f-8877-14C23A59335A}"	||
	*m_sUri == L"{78C0D931-6437-407d-A8EE-F0AAD7539E65}"	||
	*m_sUri == L"{B025F937-C7B1-47D3-B67F-A62EFF666E3E}"	||
	*m_sUri == L"{CCE6A557-97BC-4b89-ADB6-D9C93CAAB3DF}"	||
	*m_sUri == L"{A8765BA9-456A-4dab-B4F3-ACF838C121DE}"	||
	*m_sUri == L"{3A4CF648-6AED-40f4-86FF-DC5316D8AED3}"	||
	*m_sUri == L"{BBE1A952-AA13-448e-AADC-164F8A28A991}"	||
	*m_sUri == L"{46BE6895-7355-4a93-B00E-2C351335B9C9}"	||
	*m_sUri == L"{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"	||
	*m_sUri == L"{03082B11-2C62-411c-B77F-237D8FCFBE4C}"	||
	*m_sUri == L"{2F2917AC-EB37-4324-AD4E-5DD8C200BD13}"	||
	*m_sUri == L"{470722E0-AACD-4C17-9CDC-17EF765DBC7E}"	||
	*m_sUri == L"{46F421CA-312F-682f-3DD2-61675219B42D}"	||
	*m_sUri == L"{DE250136-89BD-433C-8126-D09CA5730AF9}"	||
	*m_sUri == L"{19B8F6BF-5375-455C-9EA6-DF929625EA0E}"	||
	*m_sUri == L"http://schemas.microsoft.com/office/drawing/2008/diagram"))
		{
			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				std::wstring sName = XmlUtils::GetNameNoNS(oReader.GetName());
				if (sName == L"compatExt")//2.3.1.2 compatExt
				{	//attributes spid -https://msdn.microsoft.com/en-us/library/hh657207(v=office.12).aspx
					m_oCompatExt = oReader;
				}
			else if (sName == L"sparklineGroups")
				{
					m_oSparklineGroups = oReader;
				}
			else if (sName == L"dataModelExt")
				{
					m_oDataModelExt = oReader;
				}
			else if (sName == L"table")
				{
					m_oAltTextTable = oReader;
				}
			else if (sName == L"conditionalFormattings")
				{
					if ( oReader.IsEmptyNode() )
						continue;

					int nCurDepth1 = oReader.GetDepth();
					while( oReader.ReadNextSiblingNode( nCurDepth1 ) )
					{
						m_arrConditionalFormatting.push_back(new OOX::Spreadsheet::CConditionalFormatting(oReader));
					}
				}
			else if (sName == L"dataValidations")
				{
					m_oDataValidations = oReader;
				}
			else if (sName == L"connection")
				{
					m_oConnection = oReader;
				}
			else if (sName == L"slicerList")
				{
					if (L"{A8765BA9-456A-4dab-B4F3-ACF838C121DE}" == *m_sUri)
					{
						m_oSlicerList = oReader;
					}
				else
					{
						m_oSlicerListExt = oReader;
					}
				}
			else if (sName == L"slicerCaches")
				{
					if (L"{BBE1A952-AA13-448e-AADC-164F8A28A991}" == *m_sUri)
					{
						m_oSlicerCaches = oReader;
					}
				else
					{
						m_oSlicerCachesExt = oReader;
					}
				}
			else if (sName == L"dxfs")
				{
					m_oDxfs = oReader;
				}
			else if (sName == L"slicerStyles")
				{
					m_oSlicerStyles = oReader;
				}
			else if (sName == L"slicerCachePivotTables")
				{
					if ( oReader.IsEmptyNode() )
						continue;

					int nCurDepth1 = oReader.GetDepth();
					while( oReader.ReadNextSiblingNode( nCurDepth1 ) )
					{
						m_oSlicerCachePivotTables.push_back(new OOX::Spreadsheet::CSlicerCachePivotTable(oReader));
					}
				}
			else if (sName == L"tableSlicerCache")
				{
					m_oTableSlicerCache = oReader;
				}
			else if (sName == L"slicerCacheHideItemsWithNoData")
				{
					m_oSlicerCacheHideItemsWithNoData = oReader;
				}
			else if (sName == L"id")
				{
					m_oId = oReader.GetText2();
				}
			else if (sName == L"presenceInfo")
				{
					m_oPresenceInfo = oReader;
				}
			}
		}
	else
		{
			if ( !oReader.IsEmptyNode() )
				oReader.ReadTillEnd();
		}
	}*/
	};

	COfficeArtExtension.prototype.readAttr = function (reader) {
		var val;
		while (reader.MoveToNextAttribute()) {
			if ("uri" === reader.GetName()) {
				val = reader.GetValue();
				this.uri = val;
			}
		}
	}


	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CT_Workbook = CT_Workbook;
	window['AscCommonExcel'].CT_SharedStrings = CT_SharedStrings;
	window['AscCommonExcel'].CT_SheetData = CT_SheetData;
	window['AscCommonExcel'].CT_Value = CT_Value;
	window['AscCommonExcel'].CT_DrawingWS = CT_DrawingWS;
	window['AscCommonExcel'].CT_DrawingWSRef = CT_DrawingWSRef;
})(window);
