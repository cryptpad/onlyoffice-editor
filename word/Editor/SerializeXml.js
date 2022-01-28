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

(function(window, undefined) {
	//document
	CDocument.prototype.toZip = function(zip, context) {
		var res = null;
		var memory = new AscCommon.CMemory();
		memory.context = context;
		var filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);
		var docPart = filePart.addPart(AscCommon.openXml.Types.mainDocument);
		docPart.part.setDataXml(this, memory);
		memory.Seek(0);

		memory.WriteXmlString(AscCommonWord.g_sXmlWebSettings);
		var sampleData = memory.GetDataUint8();
		var webSettingsPart = docPart.part.addPart(AscCommon.openXml.Types.webSettings);
		webSettingsPart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString(AscCommonWord.g_sXmlSettings);
		sampleData = memory.GetDataUint8();
		var settingsPart = docPart.part.addPart(AscCommon.openXml.Types.documentSettings);
		settingsPart.part.setData(sampleData);
		memory.Seek(0);

		var stylesPart = docPart.part.addPart(AscCommon.openXml.Types.styles);
		stylesPart.part.setDataXml(this.Styles, memory);
		memory.Seek(0);

		memory.WriteXmlString(AscCommonWord.g_sXmlTheme);
		sampleData = memory.GetDataUint8();
		var themePart = docPart.part.addPart(AscCommon.openXml.Types.theme);
		themePart.part.setData(sampleData);
		memory.Seek(0);

		memory.WriteXmlString(AscCommonWord.g_sXmlFonts);
		sampleData = memory.GetDataUint8();
		var fontsPart = docPart.part.addPart(AscCommon.openXml.Types.fontTable);
		fontsPart.part.setData(sampleData);
		memory.Seek(0);
	};
	CDocument.prototype.fromXml = function(reader, Content) {
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
	CDocument.prototype.fromXmlDocContent = function(reader, Content) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			CDocument.prototype.fromXmlDocContentElem(reader, name, Content, this.DrawingDocument, this);
		}
	};
	CDocument.prototype.fromXmlDocContentElem = function(reader, name, Content, DrawingDocument, Parent) {
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
	CDocument.prototype.toXml = function(writer) {
		writer.WriteXmlString(AscCommonWord.g_sXmlHeader);
		writer.WriteXmlNodeStart("w:document");
		writer.WriteXmlString(AscCommonWord.g_sXmlDocumentNamespaces);
		writer.WriteXmlAttributesEnd();
		if (this.Background) {
			//this.Background.toXml(writer, "w:background");
		}
		writer.WriteXmlNodeStart("w:body");
		writer.WriteXmlAttributesEnd();
		this.Content.forEach(function(item) {
			CDocument.prototype.toXmlDocContentElem(writer, item);
		});
		// this.SectPr.toXml(writer, "w:background");
		writer.WriteXmlNodeEnd("w:body");
		writer.WriteXmlNodeEnd("w:document");
	};
	CDocument.prototype.toXmlDocContentElem = function(writer, item) {
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
	CTable.prototype.fromXml = function(reader) {
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
					this.Pr = new CTablePr();
					this.Pr.fromXml(reader, this);
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
		if (null !== this.Pr) {
			this.Pr.toXml(writer, "w:tblPr", this);
		}
		tblGrid.toXml(writer, "w:tblGrid");
		writer.WriteXmlArray(this.Content, "w:tr");
		writer.WriteXmlArray(this.customXml, "w:customXml");
		writer.WriteXmlArray(this.sdt, "w:sdt");
		writer.WriteXmlArray(this.todo_EG_RunLevelElts, "w:todo_EG_RunLevelElts");
		writer.WriteXmlNodeEnd(name);
	};
	CTablePr.prototype.fromXml = function(reader, opt_table) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "tblStyle" : {
					if (opt_table) {
						elem = new CT_StringStax();
						elem.fromXml(reader);
						if (elem.getVal(undefined)) {
							reader.context.oReadResult.tableStyles.push(
								{pPr: opt_table, style: elem.getVal(undefined)});
						}
					}
					break;
				}
				case "tblpPr" : {
					if (opt_table) {
						elem = new CT_TblPPr();
						elem.fromXml(reader);
						elem.toTable(opt_table);
					}
					break;
				}
				// case "tblOverlap" : {
				// 	this.TblOverlap = new CT_TblOverlap();
				// 	this.TblOverlap.fromXml(reader);
				// 	break;
				// }
				// case "bidiVisual" : {
				// 	this.BidiVisual = new CT_OnOff();
				// 	this.BidiVisual.fromXml(reader);
				// 	break;
				// }
				case "tblStyleRowBandSize" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.TableStyleRowBandSize = elem.getVal(undefined);
					break;
				}
				case "tblStyleColBandSize" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.TableStyleColBandSize = elem.getVal(undefined);
					break;
				}
				case "tblW" : {
					this.TableW = new CTableMeasurement(tblwidth_Auto, 0);
					this.TableW.fromXml(reader);
					break;
				}
				case "jc" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Jc = fromXml_ST_JcTable(elem.getVal(undefined));
					break;
				}
				case "tblCellSpacing" : {
					var tblCellSpacing = new CTableMeasurement(tblwidth_Auto, 0);
					tblCellSpacing.fromXml(reader);
					if (tblwidth_Mm === tblCellSpacing.Type) {
						//different understanding of TableCellSpacing with Word
						this.TableCellSpacing = 2 * g_dKoef_twips_to_mm * tblCellSpacing.W;
					}
					break;
				}
				case "tblInd" : {
					var tblInd = new CTableMeasurement(tblwidth_Auto, 0);
					tblInd.fromXml(reader);
					if (tblwidth_Mm === tblInd.Type) {
						this.TableInd = g_dKoef_twips_to_mm * tblInd.W;
					}
					break;
				}
				case "tblBorders" : {
					var pBdr = new CT_Bdr();
					pBdr.fromXml(reader);
					pBdr.toObj(this.TableBorders);
					break;
				}
				case "shd" : {
					this.Shd = new CDocumentShd();
					this.Shd.fromXml(reader);
					break;
				}
				case "tblLayout" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.TableLayout = fromXml_ST_TblLayoutType(elem.getVal(undefined));
					break;
				}
				case "tblCellMar" : {
					this.TableCellMar = {Bottom: undefined, Left: undefined, Right: undefined, Top: undefined};
					elem = new CT_TblCellMar();
					elem.fromXml(reader);
					elem.toObj(this.TableCellMar);
					break;
				}
				case "tblLook" : {
					if (opt_table) {
						elem = new CTableLook();
						elem.SetDefault();
						elem.fromXml(reader);
						opt_table.Set_TableLook(elem);
					}
					break;
				}
				case "tblCaption" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.TableCaption = elem.getVal(undefined);
					break;
				}
				case "tblDescription" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.TableDescription = elem.getVal(undefined);
					break;
				}
				case "tblPrChange" : {
					//todo
					// this.TblPrChange = new CT_TblPrChange();
					// this.TblPrChange.fromXml(reader);
					break;
				}
			}
		}
	};
	CTablePr.prototype.toXml = function(writer, name, opt_table) {
		var TableStyle;
		if (opt_table) {
			TableStyle = CT_StringStax.prototype.fromVal(opt_table.Get_TableStyle());
		}
		var TblpPr;
		if (opt_table && !opt_table.Inline) {
			TblpPr = new CT_TblPPr();
			TblpPr.fromTable(opt_table);
		}
		var TableStyleRowBandSize = CT_DecimalNumber.prototype.fromVal(this.TableStyleRowBandSize);
		var TableStyleColBandSize = CT_DecimalNumber.prototype.fromVal(this.TableStyleColBandSize);
		var Jc = CT_StringStax.prototype.fromVal(toXml_ST_JcTable(this.Jc));
		var TableCellSpacing;
		if (undefined !== this.TableCellSpacing) {
			TableCellSpacing = new CTableMeasurement(tblwidth_Mm, this.TableCellSpacing * g_dKoef_mm_to_twips / 2);
		}
		var TableInd;
		if (undefined !== this.TableInd) {
			TableInd = new CTableMeasurement(tblwidth_Mm, this.TableInd * g_dKoef_mm_to_twips);
		}
		var TableBorders = new CT_Bdr();
		TableBorders.fromObj(this.TableBorders);
		if (TableBorders.isEmpty()) {
			TableBorders = null;
		}
		var TableLayout = CT_StringStax.prototype.fromVal(toXml_ST_TblLayoutType(this.TableLayout));
		var TableCellMar;
		if (this.TableCellMar) {
			TableCellMar = new CT_TblCellMar();
			TableCellMar.fromObj(this.TableCellMar);
			if (TableCellMar.isEmpty()) {
				TableCellMar = null;
			}
		}
		var TableCaption = CT_StringStax.prototype.fromVal(this.TableCaption);
		var TableDescription = CT_StringStax.prototype.fromVal(this.TableDescription);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(TableStyle, "w:tblStyle");
		writer.WriteXmlNullable(TblpPr, "w:tblpPr");
		// writer.WriteXmlNullable(this.TblOverlap, "w:tblOverlap");
		// writer.WriteXmlNullable(this.BidiVisual, "w:bidiVisual");
		writer.WriteXmlNullable(TableStyleRowBandSize, "w:tblStyleRowBandSize");
		writer.WriteXmlNullable(TableStyleColBandSize, "w:tblStyleColBandSize");
		writer.WriteXmlNullable(this.TableW, "w:tblW");
		writer.WriteXmlNullable(Jc, "w:jc");
		writer.WriteXmlNullable(TableCellSpacing, "w:tblCellSpacing");
		writer.WriteXmlNullable(TableInd, "w:tblInd");
		writer.WriteXmlNullable(TableBorders, "w:tblBorders");
		writer.WriteXmlNullable(this.Shd, "w:shd");
		writer.WriteXmlNullable(TableLayout, "w:tblLayout");
		writer.WriteXmlNullable(TableCellMar, "w:tblCellMar");
		if (opt_table) {
			writer.WriteXmlNullable(opt_table.Get_TableLook(), "w:tblLook");
		}
		writer.WriteXmlNullable(TableCaption, "w:tblCaption");
		writer.WriteXmlNullable(TableDescription, "w:tblDescription");
		// writer.WriteXmlNullable(this.TblPrChange, "w:tblPrChange");
		writer.WriteXmlNodeEnd(name);
	};
	function CT_TblGrid() {
		this.gridCol = [];
		this.tblGridChange = null;
		return this;
	}

	CT_TblGrid.prototype.fromTable = function(table) {
		if (table.TableGrid) {
			for (var i = 0; i < table.TableGrid.length; ++i) {
				var elem = new CT_TblGridCol();
				elem.w = table.TableGrid[i];
				this.gridCol.push(elem);
			}
		}
	};
	CT_TblGrid.prototype.toTable = function(table) {
		var tableGrid = this.gridCol.map(function(elem) {
			return elem.w;
		});
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
					this.w =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
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
	CTableLook.prototype.readAttr = function(reader) {
		var FirstRow, LastRow, FirstColumn, LastColumn, NoHBand, NoVBand;
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "firstRow": {
					FirstRow = reader.GetValueBool();
					break;
				}
				case "lastRow": {
					LastRow = reader.GetValueBool();
					break;
				}
				case "firstColumn": {
					FirstColumn = reader.GetValueBool();
					break;
				}
				case "lastColumn": {
					LastColumn = reader.GetValueBool();
					break;
				}
				case "noHBand": {
					NoHBand = reader.GetValueBool();
					break;
				}
				case "noVBand": {
					NoVBand = reader.GetValueBool();
					break;
				}
			}
		}
		this.Set(!!FirstColumn, !!FirstRow, !!LastColumn, !!LastRow, !NoHBand, !NoVBand);
	};
	CTableLook.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CTableLook.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeBool("w:firstRow", this.Is_FirstRow());
		writer.WriteXmlNullableAttributeBool("w:lastRow", this.Is_LastRow());
		writer.WriteXmlNullableAttributeBool("w:firstColumn", this.Is_FirstCol());
		writer.WriteXmlNullableAttributeBool("w:lastColumn", this.Is_LastCol());
		writer.WriteXmlNullableAttributeBool("w:noHBand", !this.Is_BandHor());
		writer.WriteXmlNullableAttributeBool("w:noVBand", !this.Is_BandVer());
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
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				// case "cnfStyle" : {
				// 	this.CnfStyle = new CT_Cnf();
				// 	this.CnfStyle.fromXml(reader);
				// 	break;
				// }
				// case "divId" : {
				// 	this.DivId = new CT_DecimalNumber();
				// 	this.DivId.fromXml(reader);
				// 	break;
				// }
				case "gridBefore" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.GridBefore = elem.getVal(undefined);
					break;
				}
				case "gridAfter" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.GridAfter = elem.getVal(undefined);
					break;
				}
				case "wBefore" : {
					this.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
					this.WBefore.fromXml(reader);
					break;
				}
				case "wAfter" : {
					this.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
					this.WAfter.fromXml(reader);
					break;
				}
				case "cantSplit" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.CantSplit = elem.getVal(undefined);
					break;
				}
				case "trHeight" : {
					this.Height = new CTableRowHeight(0, Asc.linerule_Auto);
					this.Height.fromXml(reader);
					break;
				}
				case "tblHeader" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.TableHeader = elem.getVal(undefined);
					break;
				}
				case "tblCellSpacing" : {
					var tblCellSpacing = new CTableMeasurement(tblwidth_Auto, 0);
					tblCellSpacing.fromXml(reader);
					if (tblwidth_Mm === tblCellSpacing.Type) {
						//different understanding of TableCellSpacing with Word
						this.TableCellSpacing = 2 * g_dKoef_twips_to_mm * tblCellSpacing.W;
					}
					break;
				}
				case "jc" : {
					var Jc = new CT_StringStax();
					Jc.fromXml(reader);
					this.Jc = fromXml_ST_JcTable(Jc.getVal(undefined));
					break;
				}
				// case "hidden" : {
				// 	this.Hidden = new CT_OnOff();
				// 	this.Hidden.fromXml(reader);
				// 	break;
				// }
				case "ins" : {
					//todo
					// this.Ins = new CT_TrackChange();
					// this.Ins.fromXml(reader);
					break;
				}
				case "del" : {
					// this.Del = new CT_TrackChange();
					// this.Del.fromXml(reader);
					break;
				}
				case "trPrChange" : {
					// this.TrPrChange = new CT_TrPrChange();
					// this.TrPrChange.fromXml(reader);
					break;
				}
			}
		}
	};
	CTableRowPr.prototype.toXml = function(writer, name) {
		var GridBefore = CT_DecimalNumber.prototype.fromVal(this.GridBefore);
		var GridAfter = CT_DecimalNumber.prototype.fromVal(this.GridAfter);
		var CantSplit = CT_OnOff.prototype.fromVal(this.CantSplit);
		var TableHeader = CT_OnOff.prototype.fromVal(this.TableHeader);
		var TableCellSpacing;
		if (undefined !== this.TableCellSpacing) {
			TableCellSpacing = new CTableMeasurement(tblwidth_Mm, Pr.TableCellSpacing * g_dKoef_mm_to_twips / 2);
		}

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		// writer.WriteXmlNullable(this.CnfStyle, "w:cnfStyle");
		// writer.WriteXmlNullable(this.DivId, "w:divId");
		writer.WriteXmlNullable(GridBefore, "w:gridBefore");
		writer.WriteXmlNullable(GridAfter, "w:gridAfter");
		writer.WriteXmlNullable(this.WBefore, "w:wBefore");
		writer.WriteXmlNullable(this.WAfter, "w:wAfter");
		writer.WriteXmlNullable(CantSplit, "w:cantSplit");
		writer.WriteXmlNullable(this.Height, "w:trHeight");
		writer.WriteXmlNullable(TableHeader, "w:tblHeader");
		writer.WriteXmlNullable(TableCellSpacing, "w:tblCellSpacing");
		writer.WriteXmlNullable(toXml_ST_JcTable(this.Jc), "w:jc");
		// writer.WriteXmlNullable(this.Hidden, "w:hidden");
		// writer.WriteXmlNullable(this.Ins, "w:ins");
		// writer.WriteXmlNullable(this.Del, "w:del");
		// writer.WriteXmlNullable(this.TrPrChange, "w:trPrChange");
		writer.WriteXmlNodeEnd(name);
	};
	CTableMeasurement.prototype.readAttr = function(reader) {
		var w;
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "w": {
					w = reader.GetValueInt();
					break;
				}
				case "type": {
					this.Type = fromXml_ST_TblWidth(reader.GetValue()) || tblwidth_Auto;
					break;
				}
			}
		}
		this.SetValueByType(w);
	};
	CTableMeasurement.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CTableMeasurement.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeInt("w:w", this.GetValueByType());
		writer.WriteXmlNullableAttributeString("w:type", toXml_ST_TblWidth(this.Type));
		writer.WriteXmlAttributesEnd(true);
	};
	CTableRowHeight.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.Value =
						AscCommon.universalMeasureToMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
				case "hRule": {
					this.HRule = fromXml_ST_HeightRule(reader.GetValue());
					break;
				}
			}
		}
	};
	CTableRowHeight.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CTableRowHeight.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeIntWithKoef("w:val", this.Value, AscCommonWord.g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeString("w:hRule", toXml_ST_HeightRule(this.HRule));
		writer.WriteXmlAttributesEnd(true);
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
			var newItem = CDocument.prototype.fromXmlDocContentElem(reader, name, Content, this.Content.DrawingDocument,
				this.Content);
			if (!newItem) {
				switch (name) {
					case "tcPr" : {
						var cellPr = new CTableCellPr();
						cellPr.fromXml(reader);
						this.Set_Pr(cellPr);
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
		writer.WriteXmlNullable(this.Pr, "w:tcPr");
		this.Content.Content.forEach(function(item) {
			CDocument.prototype.toXmlDocContentElem(writer, item);
		});
		writer.WriteXmlNodeEnd(name);
	};
	CTableCellPr.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				// case "cnfStyle" : {
				// 	this.CnfStyle = new CT_Cnf();
				// 	this.CnfStyle.fromXml(reader);
				// 	break;
				// }
				case "tcW" : {
					this.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
					this.TableCellW.fromXml(reader);
					break;
				}
				case "gridSpan" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.GridSpan = elem.getVal(undefined);
					break;
				}
				case "hverge" :
				case "hMerge" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.HMerge = fromXml_ST_Merge(elem.getVal(undefined));
					break;
				}
				case "vmerge" :
				case "vMerge" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.VMerge = fromXml_ST_Merge(elem.getVal(undefined));
					break;
				}
				case "tcBorders" : {
					var pBdr = new CT_Bdr();
					pBdr.fromXml(reader);
					pBdr.toObj(this.TableCellBorders);
					break;
				}
				case "shd" : {
					this.Shd = new CDocumentShd();
					this.Shd.fromXml(reader);
					break;
				}
				case "noWrap" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.NoWrap = elem.getVal(undefined);
					break;
				}
				case "tcMar" : {
					this.TableCellMar = {Bottom: undefined, Left: undefined, Right: undefined, Top: undefined};
					elem = new CT_TblCellMar();
					elem.fromXml(reader);
					elem.toObj(this.TableCellMar);
					break;
				}
				case "textDirection" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.TextDirection = fromXml_ST_TextDirection(elem.getVal(undefined));
					break;
				}
				// case "tcFitText" : {
				// 	this.TcFitText = new CT_OnOff();
				// 	this.TcFitText.fromXml(reader);
				// 	break;
				// }
				case "vAlign" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.VAlign = fromXml_ST_VerticalJc(elem.getVal(undefined));
					break;
				}
				// case "hideMark" : {
				// 	this.HideMark = new CT_OnOff();
				// 	this.HideMark.fromXml(reader);
				// 	break;
				// }
				// case "headers" : {
				// 	this.Headers = new CT_Headers();
				// 	this.Headers.fromXml(reader);
				// 	break;
				// }
				case "cellIns" : {
					// this.CellIns = new CT_TrackChange();
					// this.CellIns.fromXml(reader);
					break;
				}
				case "cellDel" : {
					// this.CellDel = new CT_TrackChange();
					// this.CellDel.fromXml(reader);
					break;
				}
				// case "cellMerge" : {
				// 	this.CellMerge = new CT_CellMergeTrackChange();
				// 	this.CellMerge.fromXml(reader);
				// 	break;
				// }
				case "tcPrChange" : {
					// this.TcPrChange = new CT_TcPrChange();
					// this.TcPrChange.fromXml(reader);
					break;
				}
			}
		}
	};
	CTableCellPr.prototype.toXml = function(writer, name) {
		var GridSpan = CT_DecimalNumber.prototype.fromVal(this.GridSpan);
		var HMerge = CT_StringStax.prototype.fromVal(toXml_ST_Merge(this.HMerge));
		var VMerge = CT_StringStax.prototype.fromVal(toXml_ST_Merge(this.VMerge));
		var TableCellBorders = new CT_Bdr();
		TableCellBorders.fromObj(this.TableCellBorders);
		if (TableCellBorders.isEmpty()) {
			TableCellBorders = null;
		}
		var NoWrap = CT_OnOff.prototype.fromVal(this.NoWrap);
		var TableCellMar;
		if (this.TableCellMar) {
			TableCellMar = new CT_TblCellMar();
			TableCellMar.fromObj(this.TableCellMar);
			if (TableCellMar.isEmpty()) {
				TableCellMar = null;
			}
		}
		var TextDirection = CT_StringStax.prototype.fromVal(toXml_ST_TextDirection(this.TextDirection));
		var VAlign = CT_StringStax.prototype.fromVal(toXml_ST_VerticalJc(this.VAlign));

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		// writer.WriteXmlNullable(this.CnfStyle, "w:cnfStyle");
		writer.WriteXmlNullable(this.TableCellW, "w:tcW");
		writer.WriteXmlNullable(GridSpan, "w:gridSpan");
		writer.WriteXmlNullable(HMerge, "w:hmerge");
		writer.WriteXmlNullable(VMerge, "w:vmerge");
		writer.WriteXmlNullable(TableCellBorders, "w:tcBorders");
		writer.WriteXmlNullable(this.Shd, "w:shd");
		writer.WriteXmlNullable(NoWrap, "w:noWrap");
		writer.WriteXmlNullable(TableCellMar, "w:tcMar");
		writer.WriteXmlNullable(TextDirection, "w:textDirection");
		// writer.WriteXmlNullable(this.TcFitText, "w:tcFitText");
		writer.WriteXmlNullable(VAlign, "w:vAlign");
		// writer.WriteXmlNullable(this.HideMark, "w:hideMark");
		// writer.WriteXmlNullable(this.Headers, "w:headers");
		// writer.WriteXmlNullable(this.CellIns, "w:cellIns");
		// writer.WriteXmlNullable(this.CellDel, "w:cellDel");
		// writer.WriteXmlNullable(this.CellMerge, "w:cellMerge");
		// writer.WriteXmlNullable(this.TcPrChange, "w:tcPrChange");
		writer.WriteXmlNodeEnd(name);
	};
	Paragraph.prototype.fromXml = function(reader) {
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
	Paragraph.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		if (this.Pr) {
			this.Pr.toXml(writer, "w:pPr", this);
		}
		this.Content.forEach(function(item) {
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
					this.OutlineLvl = outlineLvl.getVal(undefined);
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
					this.W =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				case "h": {
					this.H =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				case "vSpace": {
					this.VSpace =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				case "hSpace": {
					this.HSpace =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
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
					if (null !== x) {
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
					if (null !== y) {
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
					this.Lvl = ilvl.getVal(undefined);
					break;
				}
				case "numId" : {
					var numId = new CT_DecimalNumber();
					this.NumId = numId.getVal(undefined);
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
		this.Color = themeColor.getColor(0, 0, 0);
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
		writer.WriteXmlNullableAttributeUInt("w:sz", this.getSizeIn8Point());
		writer.WriteXmlNullableAttributeUInt("w:space", this.getSpaceInPoint());
		themeColor.toXmlElems(writer);
// 		writer.WriteXmlNullableAttributeStringEncode("w:shadow", this.Shadow);
// 		writer.WriteXmlNullableAttributeStringEncode("w:frame", this.Frame);
		writer.WriteXmlAttributesEnd(true);
	};
	CDocumentShd.prototype.readAttr = function(reader) {
		var themeColor = new CT_Color("color", "themeColor", "themeTint", "themeShade");
		var themeFill = new CT_Color("fill", "themeFill", "themeFillTint", "themeFillShade");
		while (reader.MoveToNextAttribute()) {
			var name = reader.GetNameNoNS();
			if ("val" === name) {
				this.Value = fromXml_ST_Shd(reader.GetValue());
			} else if (!themeColor.readAttrElem(reader, name)) {
				themeFill.readAttrElem(reader, name)
			}
		}
		this.Color = themeColor.getColor(255, 255, 255);
		this.Unifill = themeColor.getUnifill();
		this.Fill = themeFill.getColor(255, 255, 255);
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
					this.Pos =
						AscCommon.universalMeasureToMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, undefined);
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
					this.Before =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
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
					this.After =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
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
					linePt =
						AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt, undefined);
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
					this.Left =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				// case "startChars": {
				// 	this.Startchars = reader.GetValueInt();
				// 	break;
				// }
				case "right":
				case "end": {
					this.Right =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				// case "endChars": {
				// 	this.Endchars = reader.GetValueInt();
				// 	break;
				// }
				case "hanging": {
					Hanging =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
					break;
				}
				// case "hangingChars": {
				// 	this.Hangingchars = reader.GetValueInt();
				// 	break;
				// }
				case "firstLine": {
					this.FirstLine =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
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
	ParaRun.prototype.fromXml = function(reader) {
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
	ParaRun.prototype.toXml = function(writer, name) {
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
	CTextPr.prototype.fromXml = function(reader) {
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
					this.Color = elem.getColor(0, 0, 0);
					this.Unifill = elem.getUnifill();
					break;
				}
				case "spacing" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Spacing =
						AscCommon.universalMeasureToMm(elem.getVal(undefined), AscCommonWord.g_dKoef_twips_to_mm,
							undefined);
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
					this.Position =
						AscCommon.universalMeasureToMm(elem.getVal(undefined), AscCommonWord.g_dKoef_pt_to_mm / 2,
							undefined);
					break;
				}
				case "sz" : {
					elem = new CT_UnsignedDecimalNumber();
					elem.fromXml(reader);
					var fontSize = elem.getVal(undefined);
					if (undefined !== fontSize) {
						this.FontSize = fontSize / 2;
					}
					break;
				}
				case "szCs" : {
					elem = new CT_UnsignedDecimalNumber();
					elem.fromXml(reader);
					var fontSizeCS = elem.getVal(undefined);
					if (undefined !== fontSizeCS) {
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
	CTextPr.prototype.toXml = function(writer, name) {
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
		if (undefined !== this.Spacing) {
			Spacing = CT_DecimalNumber.prototype.fromVal(this.Spacing * g_dKoef_mm_to_twips);
		}
		var Position;
		if (undefined !== this.Position) {
			Position = CT_DecimalNumber.prototype.fromVal(this.Position * g_dKoef_mm_to_pt * 2);
		}
		var FontSize;
		if (undefined !== this.FontSize) {
			FontSize = CT_UnsignedDecimalNumber.prototype.fromVal(this.FontSize * 2);
		}
		var FontSizeCS;
		if (undefined !== this.FontSizeCS) {
			FontSizeCS = CT_UnsignedDecimalNumber.prototype.fromVal(this.FontSizeCS * 2);
		}
		var Highlight;
		if (undefined !== this.Highlight) {
			Highlight = CT_StringStax.prototype.fromVal(
				highlight_None !== this.Highlight ? this.Highlight.ToHexColor() : "none");
		}
		var Underline;
		if (undefined !== this.Underline) {
			Underline = new CT_Underline();
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
		writer.WriteXmlNullableAttributeStringEncode("w:ascii", this.Ascii && this.Ascii.Name);
		writer.WriteXmlNullableAttributeStringEncode("w:hAnsi", this.Hansi && this.Hansi.Name);
		writer.WriteXmlNullableAttributeStringEncode("w:eastAsia", this.Eastasia && this.Eastasia.Name);
		writer.WriteXmlNullableAttributeStringEncode("w:cs", this.Cs && this.Cs.Name);
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

	//styles
	CStyles.prototype.fromXml = function(reader) {
		var name;
		if (!reader.ReadNextNode()) {
			return;
		}
		name = reader.GetNameNoNS();
		if ("styles" !== name) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		name = reader.GetNameNoNS();
		if ("styles" === name) {
			var elem, depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				switch (reader.GetNameNoNS()) {
					case "docDefaults" : {
						var DocDefaults = new CT_DocDefaults();
						DocDefaults.fromXml(reader);
						reader.context.oReadResult.DefpPr = DocDefaults.PPrDefault;
						reader.context.oReadResult.DefrPr = DocDefaults.RPrDefault;
						break;
					}
					// case "latentStyles" : {
					// 	this.LatentStyles = new CT_LatentStyles();
					// 	this.LatentStyles.fromXml(reader);
					// 	break;
					// }
					case "style" : {
						var oNewId = {id: null, def: false};
						elem = new CStyle(null, null, null, null);
						elem.fromXml(reader, oNewId);
						reader.context.oReadResult.styles[oNewId.id] = {style: elem, param: oNewId};
						break;
					}
				}
			}
		}
	};
	CStyles.prototype.toXml = function(writer) {
		var DocDefaults = new CT_DocDefaults();
		DocDefaults.RPrDefault = this.Default.TextPr;
		DocDefaults.PPrDefault = this.Default.ParaPr;

		writer.WriteXmlString(AscCommonWord.g_sXmlHeader);
		writer.WriteXmlNodeStart("w:styles");
		writer.WriteXmlString(AscCommonWord.g_sXmlStylesNamespaces);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(DocDefaults, "w:docDefaults");
		writer.WriteXmlString(AscCommonWord.g_sXmlStylesLatentStyles);
		for (var id in this.Style) {
			if (this.Style.hasOwnProperty(id)) {
				var style = this.Style[id];
				var addition = {id: id, def: this.Is_StyleDefault(style.Name)};
				style.toXml(writer, "w:style", addition);
			}
		}
		this.Style.forEach(function(elem) {

		});
		writer.WriteXmlNodeEnd("w:styles");
	};
	function CT_DocDefaults() {
		this.RPrDefault = null;
		this.PPrDefault = null;
		return this;
	}

	CT_DocDefaults.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "rPrDefault" : {
					this.RPrDefault = new CTextPr();
					this.RPrDefault.fromXml(reader);
					break;
				}
				case "pPrDefault" : {
					this.PPrDefault = new CParaPr();
					this.PPrDefault.fromXml(reader);
					break;
				}
			}
		}
	};
	CT_DocDefaults.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.RPrDefault, "w:rPrDefault");
		writer.WriteXmlNullable(this.PPrDefault, "w:pPrDefault");
		writer.WriteXmlNodeEnd(name);
	};
	CStyle.prototype.readAttr = function(reader, opt_addition) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "type": {
					this.Set_Type(fromXml_ST_StyleType(reader.GetValue()) || styletype_Paragraph);
					break;
				}
				case "styleId": {
					if (opt_addition) {
						opt_addition.id = reader.GetValueDecodeXml();
					}
					break;
				}
				case "default": {
					if (opt_addition) {
						opt_addition.def = reader.GetValueBool();
					}
					break;
				}
				case "customStyle": {
					this.SetCustom(reader.GetValueBool());
					break;
				}
			}
		}
	};
	CStyle.prototype.fromXml = function(reader, opt_addition) {
		this.readAttr(reader, opt_addition);
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "name" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Set_Name(elem.getVal(undefined));
					break;
				}
				// case "aliases" : {
				// 	this.Aliases = new CT_String();
				// 	this.Aliases.fromXml(reader);
				// 	break;
				// }
				case "basedOn" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Set_BasedOn(elem.getVal(undefined));
					break;
				}
				case "next" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Set_Next(elem.getVal(undefined));
					break;
				}
				case "link" : {
					elem = new CT_StringStax();
					elem.fromXml(reader);
					this.Set_Link(elem.getVal(undefined));
					break;
				}
				// case "autoRedefine" : {
				// 	this.AutoRedefine = new CT_OnOff();
				// 	this.AutoRedefine.fromXml(reader);
				// 	break;
				// }
				case "hidden" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Set_QFormat(elem.getVal(undefined));
					break;
				}
				case "uiPriority" : {
					elem = new CT_DecimalNumber();
					elem.fromXml(reader);
					this.Set_UiPriority(elem.getVal(undefined));
					break;
				}
				case "semiHidden" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Set_SemiHidden(elem.getVal(undefined));
					break;
				}
				case "unhideWhenUsed" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Set_UnhideWhenUsed(elem.getVal(undefined));
					break;
				}
				case "qFormat" : {
					elem = new CT_OnOff();
					elem.fromXml(reader);
					this.Set_QFormat(elem.getVal(undefined));
					break;
				}
				// case "locked" : {
				// 	this.Locked = new CT_OnOff();
				// 	this.Locked.fromXml(reader);
				// 	break;
				// }
				// case "personal" : {
				// 	this.Personal = new CT_OnOff();
				// 	this.Personal.fromXml(reader);
				// 	break;
				// }
				// case "personalCompose" : {
				// 	this.PersonalCompose = new CT_OnOff();
				// 	this.PersonalCompose.fromXml(reader);
				// 	break;
				// }
				// case "personalReply" : {
				// 	this.PersonalReply = new CT_OnOff();
				// 	this.PersonalReply.fromXml(reader);
				// 	break;
				// }
				// case "rsid" : {
				// 	this.Rsid = new CT_LongHexNumber();
				// 	this.Rsid.fromXml(reader);
				// 	break;
				// }
				case "pPr" : {
					elem = new CParaPr();
					elem.fromXml(reader);
					//todo aPostOpenStyleNumCallbacks
					this.Set_ParaPr(elem);
					break;
				}
				case "rPr" : {
					elem = new CTextPr();
					elem.fromXml(reader);
					this.Set_TextPr(elem);
					break;
				}
				case "tblPr" : {
					elem = new CTablePr();
					elem.fromXml(reader);
					this.Set_TablePr(elem);
					break;
				}
				case "trPr" : {
					elem = new CTableRowPr();
					elem.fromXml(reader);
					this.Set_TableRowPr(elem);
					break;
				}
				case "tcPr" : {
					elem = new CTableCellPr();
					elem.fromXml(reader);
					this.Set_TableCellPr(elem);
					break;
				}
				case "tblStylePr" : {
					// elem = new CT_TblStylePr();
					// elem.fromXml(reader);
					// this.TblStylePr.push(elem);
					break;
				}
			}
		}
	};
	CStyle.prototype.toXml = function(writer, name, opt_addition) {
		var Name = CT_StringStax.prototype.fromVal(this.Name);
		var BasedOn = CT_StringStax.prototype.fromVal(this.BasedOn);
		var Next = CT_StringStax.prototype.fromVal(this.Next);
		var Link = CT_StringStax.prototype.fromVal(this.Link);
		var hidden = CT_OnOff.prototype.fromVal(this.hidden);
		var uiPriority = CT_DecimalNumber.prototype.fromVal(this.uiPriority);
		var semiHidden = CT_OnOff.prototype.fromVal(this.semiHidden);
		var unhideWhenUsed = CT_OnOff.prototype.fromVal(this.unhideWhenUsed);
		var qFormat = CT_OnOff.prototype.fromVal(this.qFormat);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeString("w:type", toXml_ST_StyleType(this.Type));
		writer.WriteXmlNullableAttributeStringEncode("w:styleId", opt_addition && opt_addition.id);
		writer.WriteXmlAttributeBoolIfTrue("w:default", opt_addition && opt_addition.def);
		writer.WriteXmlAttributeBoolIfTrue("w:customStyle", this.IsCustom());
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(Name, "w:name");
		// writer.WriteXmlNullable(this.Aliases, "w:aliases");
		writer.WriteXmlNullable(BasedOn, "w:basedOn");
		writer.WriteXmlNullable(Next, "w:next");
		writer.WriteXmlNullable(Link, "w:link");
		// writer.WriteXmlNullable(this.AutoRedefine, "w:autoRedefine");
		writer.WriteXmlNullable(hidden, "w:hidden");
		writer.WriteXmlNullable(uiPriority, "w:uiPriority");
		writer.WriteXmlNullable(semiHidden, "w:semiHidden");
		writer.WriteXmlNullable(unhideWhenUsed, "w:unhideWhenUsed");
		writer.WriteXmlNullable(qFormat, "w:qFormat");
		// writer.WriteXmlNullable(this.Locked, "w:locked");
		// writer.WriteXmlNullable(this.Personal, "w:personal");
		// writer.WriteXmlNullable(this.PersonalCompose, "w:personalCompose");
		// writer.WriteXmlNullable(this.PersonalReply, "w:personalReply");
		// writer.WriteXmlNullable(this.Rsid, "w:rsid");
		writer.WriteXmlNullable(this.ParaPr, "w:pPr");
		writer.WriteXmlNullable(this.TextPr, "w:rPr");
		writer.WriteXmlNullable(this.TablePr, "w:tblPr");
		writer.WriteXmlNullable(this.TableRowPr, "w:trPr");
		writer.WriteXmlNullable(this.TableCellPr, "w:tcPr");
		// writer.WriteXmlArray(this.TblStylePr, "w:tblStylePr");
		writer.WriteXmlNodeEnd(name);
	};
	//misc
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

	function CT_TblPPr() {
		this.LeftFromText = null;
		this.RightFromText = null;
		this.TopFromText = null;
		this.BottomFromText = null;
		this.VertAnchor = null;
		this.HorzAnchor = null;
		this.TblpXSpec = null;
		this.TblpX = null;
		this.TblpYSpec = null;
		this.TblpY = null;
		return this;
	}

	CT_TblPPr.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "leftFromText": {
					this.LeftFromText =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
				case "rightFromText": {
					this.RightFromText =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
				case "topFromText": {
					this.TopFromText =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
				case "bottomFromText": {
					this.BottomFromText =
						AscCommon.universalMeasureToUnsignedMm(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_mm, 0);
					break;
				}
				case "vertAnchor": {
					this.VertAnchor = fromXml_ST_VAnchor(reader.GetValue());
					break;
				}
				case "horzAnchor": {
					this.HorzAnchor = fromXml_ST_HAnchor(reader.GetValue());
					break;
				}
				case "tblpXSpec": {
					this.TblpXSpec = fromXml_ST_XAlign(reader.GetValue());
					break;
				}
				case "tblpX": {
					var TblpX = AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt,
						null);
					if (null !== TblpX) {
						this.TblpX = AscCommonWord.g_dKoef_pt_to_twips * TblpX;
					}
					break;
				}
				case "tblpYSpec": {
					this.TblpYSpec = fromXml_ST_YAlign(reader.GetValue());
					break;
				}
				case "tblpY": {
					var TblpY = AscCommon.universalMeasureToPt(reader.GetValue(), AscCommonWord.g_dKoef_twips_to_pt,
						null);
					if (null !== TblpY) {
						this.TblpY = AscCommonWord.g_dKoef_pt_to_twips * TblpY;
					}
					break;
				}
			}
		}
	};
	CT_TblPPr.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_TblPPr.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeUIntWithKoef("w:leftFromText", this.LeftFromText,
			AscCommonWord.g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeUIntWithKoef("w:rightFromText", this.RightFromText,
			AscCommonWord.g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeUIntWithKoef("w:topFromText", this.TopFromText,
			AscCommonWord.g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeUIntWithKoef("w:bottomFromText", this.BottomFromText,
			AscCommonWord.g_dKoef_mm_to_twips);
		writer.WriteXmlNullableAttributeString("w:vertAnchor", toXml_ST_VAnchor(this.VertAnchor));
		writer.WriteXmlNullableAttributeString("w:horzAnchor", toXml_ST_HAnchor(this.HorzAnchor));
		writer.WriteXmlNullableAttributeString("w:tblpXSpec", toXml_ST_XAlign(this.TblpXSpec));
		writer.WriteXmlNullableAttributeInt("w:tblpX", this.TblpX);
		writer.WriteXmlNullableAttributeString("w:tblpYSpec", toXml_ST_YAlign(this.TblpYSpec));
		writer.WriteXmlNullableAttributeInt("w:tblpY", this.TblpY);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_TblPPr.prototype.fromTable = function(table) {
		var PositionH = table.PositionH;
		if (PositionH) {
			this.HorzAnchor = PositionH.RelativeFrom;
			if (PositionH.Align) {
				this.TblpXSpec = PositionH.Value;
			} else {
				this.TblpX = table.Get_PositionHValueInTwips();
			}
		}
		var PositionV = table.PositionV;
		if (PositionV) {
			this.VertAnchor = PositionV.RelativeFrom;
			if (PositionV.Align) {
				this.TblpYSpec = PositionV.Value;
			} else {
				this.TblpY = table.Get_PositionVValueInTwips();
			}
		}
	};
	CT_TblPPr.prototype.toTable = function(table) {
		table.Set_Inline(false);
		if (null !== this.HorzAnchor) {
			if (null !== this.TblpXSpec) {
				table.Set_PositionH(this.HorzAnchor, true, this.TblpXSpec);
			} else if (null !== this.TblpX) {
				table.Set_PositionH(this.HorzAnchor, true, this.TblpX * AscCommonWord.g_dKoef_twips_to_mm);
			}
		}
		if (null !== this.VertAnchor) {
			if (null !== this.TblpYSpec) {
				table.Set_PositionV(this.VertAnchor, true, this.TblpYSpec);
			} else if (null !== this.TblpY) {
				table.Set_PositionV(this.VertAnchor, true, this.TblpY * AscCommonWord.g_dKoef_twips_to_mm);
			}
		}
		if (null !== this.LeftFromText || null !== this.TopFromText || null !== this.RightFromText ||
			null !== this.BottomFromText) {
			table.Set_Distance(this.LeftFromText || 0, this.TopFromText || 0, this.RightFromText || 0,
				this.BottomFromText || 0);
		}
	};
	function CT_TblCellMar() {
		this.Top = null;
		this.Start = null;
		this.Bottom = null;
		this.End = null;
		return this;
	}

	CT_TblCellMar.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "top" : {
					this.Top = new CTableMeasurement(tblwidth_Auto, 0);
					this.Top.fromXml(reader);
					break;
				}
				case "left" :
				case "start" : {
					this.Left = new CTableMeasurement(tblwidth_Auto, 0);
					this.Left.fromXml(reader);
					break;
				}
				case "bottom" : {
					this.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
					this.Bottom.fromXml(reader);
					break;
				}
				case "right" :
				case "end" : {
					this.Right = new CTableMeasurement(tblwidth_Auto, 0);
					this.Right.fromXml(reader);
					break;
				}
			}
		}
	};
	CT_TblCellMar.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.Top, "w:top");
		writer.WriteXmlNullable(this.Left, "w:left");
		writer.WriteXmlNullable(this.Bottom, "w:bottom");
		writer.WriteXmlNullable(this.Right, "w:right");
		writer.WriteXmlNodeEnd(name);
	};
	CT_TblCellMar.prototype.fromObj = function(obj) {
		for (var elem in obj) {
			if (obj.hasOwnProperty(elem) && obj[elem]) {
				this[elem] = obj[elem];
			}
		}
	};
	CT_TblCellMar.prototype.toObj = function(obj) {
		for (var elem in this) {
			if (this.hasOwnProperty(elem) && this[elem]) {
				obj[elem] = this[elem];
			}
		}
	};
	CT_TblCellMar.prototype.isEmpty = function() {
		for (var elem in this) {
			if (this.hasOwnProperty(elem) && this[elem]) {
				return false;
			}
		}
		return true;
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
		for (var elem in obj) {
			if (obj.hasOwnProperty(elem) && obj[elem]) {
				this[elem] = obj[elem];
			}
		}
	};
	CT_Bdr.prototype.toObj = function(obj) {
		for (var elem in this) {
			if (this.hasOwnProperty(elem) && this[elem]) {
				obj[elem] = this[elem];
			}
		}
	};
	CT_Bdr.prototype.isEmpty = function() {
		for (var elem in this) {
			if (this.hasOwnProperty(elem) && this[elem]) {
				return false;
			}
		}
		return true;
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
		return null === this.Val && null === this.ThemeColor && null === this.ThemeTint && null === this.ThemeShade;
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

	//enums
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

	function fromXml_ST_TblWidth(val) {
		switch (val) {
			case "nil":
				return tblwidth_Nil;
			case "pct":
				return tblwidth_Pct;
			case "dxa":
				return tblwidth_Mm;
			case "auto":
				return tblwidth_Auto;
		}
		return undefined;
	}

	function toXml_ST_TblWidth(val) {
		switch (val) {
			case tblwidth_Nil:
				return "nil";
			case tblwidth_Pct:
				return "pct";
			case tblwidth_Mm:
				return "dxa";
			case tblwidth_Auto:
				return "auto";
		}
		return null;
	}

	function fromXml_ST_JcTable(val) {
		switch (val) {
			case "center":
				return AscCommon.align_Center;
			case "right":
			case "end":
				return AscCommon.align_Right;
			case "left":
			case "start":
				return AscCommon.align_Left;
		}
		return undefined;
	}

	function toXml_ST_JcTable(val) {
		switch (val) {
			case AscCommon.align_Center:
				return "center";
			case AscCommon.align_Right:
				return "right";
			case AscCommon.align_Left:
				return "left";
		}
		return null;
	}

	function fromXml_ST_TblLayoutType(val) {
		switch (val) {
			case "fixed":
				return tbllayout_Fixed;
			case "autofit":
				return tbllayout_AutoFit;
		}
		return undefined;
	}

	function toXml_ST_TblLayoutType(val) {
		switch (val) {
			case tbllayout_Fixed:
				return "fixed";
			case tbllayout_AutoFit:
				return "autofit";
		}
		return null;
	}

	function fromXml_ST_Merge(val) {
		switch (val) {
			case "continue":
				return vmerge_Continue;
			case "restart":
				return vmerge_Restart;
		}
		return undefined;
	}

	function toXml_ST_Merge(val) {
		switch (val) {
			case vmerge_Continue:
				return "continue";
			case vmerge_Restart:
				return "restart";
		}
		return null;
	}

	function fromXml_ST_TextDirection(val) {
		switch (val) {
			case "tb":
				return textdirection_LRTB;
			case "rl":
				return textdirection_TBRL;
			case "lr":
				return textdirection_BTLR;
			case "tbV":
				return textdirection_LRTBV;
			case "rlV":
				return textdirection_TBRLV;
			case "lrV":
				return textdirection_TBLRV;
		}
		return undefined;
	}

	function toXml_ST_TextDirection(val) {
		switch (val) {
			case textdirection_LRTB:
				return "tb";
			case textdirection_TBRL:
				return "rl";
			case textdirection_BTLR:
				return "lr";
			case textdirection_LRTBV:
				return "tbV";
			case textdirection_TBRLV:
				return "rlV";
			case textdirection_TBLRV:
				return "lrV";
		}
		return null;
	}

	function fromXml_ST_VerticalJc(val) {
		switch (val) {
			case "top":
				return vertalignjc_Top;
			case "center":
				return vertalignjc_Center;
			case "both":
				return vertalignjc_Top;
			case "bottom":
				return vertalignjc_Bottom;
		}
		return undefined;
	}

	function toXml_ST_VerticalJc(val) {
		switch (val) {
			case vertalignjc_Top:
				return "top";
			case vertalignjc_Center:
				return "center";
			// case ST_VerticalJc.Both:
			// 	return "both";
			case vertalignjc_Bottom:
				return "bottom";
		}
		return null;
	}

	function fromXml_ST_StyleType(val) {
		switch (val) {
			case "paragraph":
				return styletype_Paragraph;
			case "character":
				return styletype_Character;
			case "table":
				return styletype_Table;
			case "numbering":
				return styletype_Numbering;
		}
		return undefined;
	}

	function toXml_ST_StyleType(val) {
		switch (val) {
			case styletype_Paragraph:
				return "paragraph";
			case styletype_Character:
				return "character";
			case styletype_Table:
				return "table";
			case styletype_Numbering:
				return "numbering";
		}
		return null;
	}
})(window);