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
	function CT_GraphicalObject(graphicFrame) {
		this.Namespace = null;
		this.GraphicData = null;

		this.GraphicFrame = graphicFrame;
		return this;
	}
	CT_GraphicalObject.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "graphicData" : {
					this.GraphicData = new CT_GraphicalObjectData(this.GraphicFrame);
					this.GraphicData.fromXml(reader);
					break;
				}
			}
		}
	};
	CT_GraphicalObject.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		if (this.Namespace) {
			writer.WriteXmlString(this.Namespace);
		}
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.GraphicData, "a:graphicData");
		writer.WriteXmlNodeEnd(name);
	};
	function CT_GraphicalObjectData(graphicFrame) {
		this.Uri = null;
		this.graphicObject = null;

		this.graphicFrame = graphicFrame;
	}
	CT_GraphicalObjectData.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "uri": {
					this.Uri = reader.GetValueDecodeXml();
					break;
				}
			}
		}
	};
	CT_GraphicalObjectData.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			let name = reader.GetNameNoNS();
			this.graphicObject = AscFormat.CGraphicObjectBase.prototype.fromXmlElem(reader, name, this.graphicFrame);
		}
	};
	CT_GraphicalObjectData.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		//"http://schemas.openxmlformats.org/drawingml/2006/picture"
		writer.WriteXmlNullableAttributeStringEncode("uri", this.Uri);
		writer.WriteXmlAttributesEnd();
		AscFormat.CGraphicObjectBase.prototype.toXmlElem(writer, this.graphicObject, "pic");
		writer.WriteXmlNodeEnd(name);
	};

	window['AscFormat'].CGraphicObjectBase.prototype.fromXmlElem = function(reader, name, graphicFrame) {
		let res = null;
		if ("pic" === name) {
			res = new AscFormat.CImageShape();
			res.fromXml(reader);
		} else if ("graphicFrame" === name) {
			res = new AscFormat.CGraphicFrame();
			res.fromXml(reader);
			res = res.graphicObject;
		} else if ("chart" === name) {
			if (typeof AscFormat.CChartSpace !== "undefined") {
				let elem = new CT_XmlNode();
				elem.fromXml(reader);
				let rId = elem.attributes["id"];
				var rel = reader.rels.getRelationship(rId);
				if ("Internal" === rel.targetMode) {
					var chartPart = reader.rels.pkg.getPartByUri(rel.targetFullName);
					if (chartPart) {
						var chartContent = chartPart.getDocumentContent();
						var chartReader = new StaxParser(chartContent, chartPart, reader.context);
						res = new AscFormat.CChartSpace();
						res.fromXml(chartReader);

						res.setBDeleted(false);
						if (res.hasCharts()) {
							let chartStylePart = chartPart.getPartByRelationshipType(openXml.Types.chartStyle.relationType);
							if (chartStylePart) {
								let chartStyleContent = chartStylePart.getDocumentContent();
								if (chartStyleContent) {
									let chartStyle = new AscFormat.CChartStyle();
									let readerStyle = new StaxParser(chartStyleContent, chartStylePart, reader.context);
									chartStyle.fromXml(readerStyle);
									res.setChartStyle(chartStyle);
								}
							}
							let chartColorStylePart = chartPart.getPartByRelationshipType(openXml.Types.chartColorStyle.relationType);
							if (chartColorStylePart) {
								let chartColorStyleContent = chartColorStylePart.getDocumentContent();
								if (chartColorStyleContent) {
									let chartStyle = new AscFormat.CChartColors();
									let readerStyle = new StaxParser(chartColorStyleContent, chartColorStylePart, reader.context);
									chartStyle.fromXml(readerStyle);
									res.setChartColors(chartStyle);
								}
							}
						} else {
							res = null;
						}
					}
				}
			}
		} else if("tbl" === name)  {
			var _table = new CTable(reader.context.DrawingDocument, graphicFrame || null, true, 0, 0, [], true);
			_table.fromDrawingML(reader);
			if(graphicFrame) {
				graphicFrame.setGraphicObject(_table);
			}
		}
		return res;
	};
	window['AscFormat'].CGraphicObjectBase.prototype.toXmlElem = function(writer, graphicObject, ns) {
		let elemForWriting = graphicObject;
		let graphicObjectName;
		switch (graphicObject.getObjectType()) {
			case AscDFH.historyitem_type_Shape:
				break;
			case AscDFH.historyitem_type_Cnx:
				break;
			case AscDFH.historyitem_type_OleObject:
			case AscDFH.historyitem_type_ImageShape:
				graphicObjectName = ns + ":pic";
				break;
			case AscDFH.historyitem_type_GroupShape:
			case AscDFH.historyitem_type_SmartArt:
				break;
			case AscDFH.historyitem_type_GraphicFrame:
				graphicObjectName = ns + ":graphicFrame";
				break;
			case AscDFH.historyitem_type_ChartSpace:
			{
				let partType = AscCommon.c_oEditorId.Word === writer.context.editorId ? AscCommon.openXml.Types.chartWord: AscCommon.openXml.Types.chart;
				graphicObjectName = "c:chart";
				let chartPart = writer.context.part.addPart(partType);
				chartPart.part.setDataXml(graphicObject, writer);
				let elem = new CT_XmlNode();
				elem.attributes["xmlns:c"] = "http://schemas.openxmlformats.org/drawingml/2006/chart";
				elem.attributes["xmlns:r"] = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
				elem.attributes["r:id"] = chartPart.rId;
				elemForWriting = elem;
				if (graphicObject.chartStyle) {
					let chartStylePart = chartPart.part.addPart(AscCommon.openXml.Types.chartStyle);
					chartStylePart.part.setDataXml(graphicObject.chartStyle, writer);
				}
				if (graphicObject.chartColors) {
					let chartColorPart = chartPart.part.addPart(AscCommon.openXml.Types.chartColorStyle);
					chartColorPart.part.setDataXml(graphicObject.chartColors, writer);
				}
				break;
			}
			case AscDFH.historyitem_type_SlicerView:
				break;
		}
		if (graphicObjectName) {
			writer.WriteXmlNullable(elemForWriting, graphicObjectName);
		}
	};



	window['AscFormat'].CBlipFill.prototype.toXml = function(writer, name)
	{
		var context = writer.context;
		var imagePart = context.imageMap[this.RasterImageId];
		if (!imagePart) {
			var ext = AscCommon.GetFileExtension(this.RasterImageId);
			var type = context.editorId === AscCommon.c_oEditorId.Word? AscCommon.openXml.Types.imageWord : AscCommon.openXml.Types.image;
			type = Object.assign({}, type);
			type.filename += ext;
			type.contentType = openXml.GetMimeType(ext);
			imagePart = context.part.addPart(type);
			context.imageMap[this.RasterImageId] = imagePart;
		}

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeStart("a:blip");
		writer.WriteXmlString(' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"');
		writer.WriteXmlAttributeString("r:embed", imagePart.rId);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlString('<a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst>');
		writer.WriteXmlNodeEnd("a:blip");

		writer.WriteXmlNodeStart("a:stretch");
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNodeStart("a:fillRect");
		writer.WriteXmlAttributesEnd(true);
		writer.WriteXmlNodeEnd("a:stretch");

		writer.WriteXmlNodeEnd(name);
	};

	window['AscFormat'].CT_GraphicalObject = CT_GraphicalObject;
	window['AscFormat'].CT_GraphicalObjectData = CT_GraphicalObjectData;

	function CT_ComplexType() {
		this.val = null;
		return this;
	}
	CT_ComplexType.prototype.constructor = CT_ComplexType;
	CT_ComplexType.prototype.readAttrVal = function(reader) {
	};
	CT_ComplexType.prototype.writeAttrVal = function(writer, val) {
	};
	CT_ComplexType.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "val": {
					this.val = this.readAttrVal(reader);
					break;
				}
			}
		}
	};
	CT_ComplexType.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CT_ComplexType.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		this.writeAttrVal(writer, this.val);
		writer.WriteXmlAttributesEnd(true);
	};
	CT_ComplexType.prototype.fromVal = function(val) {
		var res = null;
		if (null !== val && undefined !== val) {
			res = new this.constructor();
			res.val = val;
		}
		return res;
	};
	CT_ComplexType.prototype.toVal = function(reader, def) {
		let elem = new this.constructor();
		elem.fromXml(reader);
		return elem.getVal(def);
	};
	CT_ComplexType.prototype.getVal = function(def) {
		return null !== this.val ? this.val : def;
	};

	function CT_String() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_String, CT_ComplexType, 0);
	CT_String.prototype.readAttrVal = function(reader) {
		return reader.GetValueDecodeXml();
	};
	CT_String.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeStringEncode("val", val);
	};

	function CT_Bool() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_Bool, CT_ComplexType, 0);
	CT_Bool.prototype.readAttrVal = function(reader) {
		return reader.GetValueBool();
	};
	CT_Bool.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeBool("val", val);
	};

	function CT_Int() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_Int, CT_ComplexType, 0);
	CT_Int.prototype.readAttrVal = function(reader) {
		return reader.GetValueInt(this.val);
	};
	CT_Int.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeInt("val", this.val);
	};

	function CT_UInt() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_UInt, CT_ComplexType, 0);
	CT_UInt.prototype.readAttrVal = function(reader) {
		return reader.GetValueUInt(this.val);
	};
	CT_UInt.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeUInt("val", this.val);
	};

	function CT_Double() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_Double, CT_ComplexType, 0);
	CT_Double.prototype.readAttrVal = function(reader) {
		return reader.GetValueDouble(this.val);
	};
	CT_Double.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeDouble("val", this.val);
	};

	function CT_StringW() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_StringW, CT_String, 0);
	CT_StringW.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeStringEncode("w:val", val);
	};

	function CT_BoolW() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_BoolW, CT_Bool, 0);
	CT_BoolW.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeBool("w:val", val);
	};

	function CT_IntW() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_IntW, CT_Int, 0);
	CT_IntW.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeInt("w:val", this.val);
	};

	function CT_UIntW() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_UIntW, CT_UInt, 0);
	CT_UIntW.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeUInt("w:val", this.val);
	};

	function CT_DoubleW() {
		CT_ComplexType.call(this);
	}
	AscFormat.InitClass(CT_DoubleW, CT_Double, 0);
	CT_DoubleW.prototype.writeAttrVal = function(writer, val) {
		writer.WriteXmlNullableAttributeDouble("w:val", this.val);
	};

	AscCommonWord.Paragraph.prototype.fromDrawingML = function(reader) {
		var depth = reader.GetDepth();
		let EndPos = 0;
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			switch(name) {
				case "br": {
					let oRun = new AscCommonWord.ParaRun(this, false);
					oRun.AddToContent( 0, new ParaNewLine(AscCommonWord.break_Line));
					this.AddToContent(EndPos++, oRun);
					oRun.fromDrawingML(reader);//Read run properties
					break;
				}
				case "endParaRPr": {
					let oTextPr = new AscCommonWord.CTextPr();
					oTextPr.fromDrawingML(reader);
					this.TextPr.Apply_TextPr(oTextPr);
					let oEndRun = this.Content[this.Content.length - 1]; //TODO: check whether it needs to set properties for end run
					var oParaTextPrEnd = new CTextPr();
					oParaTextPrEnd.Set_FromObject(oTextPr);
					oEndRun.Set_Pr(oParaTextPrEnd);
					break;
				}
				case "fld": {
					let oFld = new AscCommonWord.CPresentationField(this);
					oFld.fromDrawingML(reader);
					this.AddToContent(EndPos++, new ParaRun(this, false));
					this.AddToContent(EndPos++, oFld);
					this.AddToContent(EndPos++, new ParaRun(this, false));
					break;
				}
				case "pPr": {
					let oParaPr = new AscCommonWord.CParaPr();
					oParaPr.fromDrawingML(reader);
					this.Set_Pr(oParaPr);
					break;
				}
				case "r": {
					let oRun = new AscCommonWord.ParaRun(this, false);
					oRun.fromDrawingML(reader);
					let oRunPr = oRun.Pr;
					let oHyperLink = oRunPr && (oRunPr.hlinkClick || oRunPr.hlinkMouseOver);
					if(oHyperLink) {
						let oParaHLink = new ParaHyperlink();
						oParaHLink.SetValue(oHyperLink.id);
						if (oHyperLink.tooltip) {
							oParaHLink.SetToolTip(oHyperLink.tooltip);
						}
						oRunPr.Underline = true;
						oParaHLink.Add_ToContent(0, oRun, false);
						this.AddToContent(EndPos++, oParaHLink);
					}
					else {
						this.AddToContent(EndPos++, oRun);
					}
					break;
				}
			}
		}
	};
	AscCommonWord.ParaRun.prototype.fromDrawingML = function (reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			switch(name) {
				case "rPr": {
					let oTextPr = new AscCommonWord.CTextPr();
					oTextPr.fromDrawingML(reader);
					this.SetPr(oTextPr);
					break;
				}
				case "t": {
					this.AddText(reader.GetTextDecodeXml(), -1);
					break;
				}
			}
		}
	};
	AscCommonWord.CTextPr.prototype.fromDrawingML = function (reader) {
		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "altLang": {
					break;
				}
				case "b": {
					this.Bold = reader.GetValueBool();
					break;
				}
				case "baseline": {
					let nBaseline = AscFormat.getPercentageValue(reader.GetValue());
					if (nBaseline < 0)
						this.VertAlign = AscCommon.vertalign_SubScript;
					else if (nBaseline > 0)
						this.VertAlign = AscCommon.vertalign_SuperScript;
					break;
				}
				case "bmk": {
					break;
				}
				case "cap": {
					let sCap = reader.GetValue();
					if(sCap === "all") {
						this.Caps = true;
						this.SmallCaps = false;
					}
					else if(sCap === "small") {
						this.Caps = false;
						this.SmallCaps = true;
					}
					else {
						this.Caps = false;
						this.SmallCaps = false;
					}
 					break;
				}
				case "dirty": {
					break;
				}
				case "err": {
					break;
				}
				case "i": {
					this.Italic = reader.GetValueBool();
					break;
				}
				case "kern": {
					break;
				}
				case "kumimoji": {
					break;
				}
				case "lang": {
					let sLang = reader.GetValue();
					let nLcid = Asc.g_oLcidNameToIdMap[sLang];
					if(nLcid)
						this.Lang.Val = nLcid;
					break;
				}
				case "noProof": {
					break;
				}
				case "normalizeH": {
					break;
				}
				case "smtClean": {
					break;
				}
				case "smtId": {
					break;
				}
				case "spc": {
					this.Spacing = reader.GetValueInt() * 25.4 / 7200;
					break;
				}
				case "strike": {
					let sStrike = reader.GetValue();
					if(sStrike === "dblStrike") {
						this.Strikeout = false;
						this.DStrikeout = true;
					}
					else if(sStrike === "sngStrike") {
						this.Strikeout = true;
						this.DStrikeout = false;
					}
					else if(sStrike === "noStrike") {
						this.Strikeout = false;
						this.DStrikeout = false;
					}
					break;
				}
				case "sz": {
					var nSz = reader.GetValueInt() / 100;
					nSz = ((nSz * 2) + 0.5) >> 0;
					nSz /= 2;
					this.FontSize = nSz;
					break;
				}
				case "u": {
					this.Underline = reader.GetValue() !== "none";
					break;
				}
			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(AscFormat.CUniFill.prototype.isFillName(name)) {
				this.Unifill = new AscFormat.CUniFill();
				this.Unifill.fromXml(reader, name);
			}
			else if(name === "ln") {
				this.TextOutline = new AscFormat.CLn();
				this.TextOutline.fromXml(reader);
			}
			else if(name === "cs") {
				let sName = readTypeface(reader);
				if(sName) {
					this.RFonts.CS = { Name: sName, Index : -1 };
				}
			}
			else if(name === "ea") {
				let sName = readTypeface(reader);
				if(sName) {
					this.RFonts.EastAsia = { Name: sName, Index : -1 };
				}
			}
			else if(name === "latin") {
				let sName = readTypeface(reader);
				if(sName) {
					this.RFonts.Ascii = { Name: sName, Index : -1 };
					this.RFonts.HAnsi = { Name: sName, Index : -1 };
				}
			}
			else if(name === "hlinkClick" || name === "hlinkMouseOver") {
				let oHLink = new AscFormat.CT_Hyperlink();
				oHLink.fromXml(reader);
				if(name === "hlinkClick") {
					this.hlinkClick = oHLink;
				}
				else {
					this.hlinkMouseOver = oHLink;
				}
			}
			else if(name === "highlight") {
				let oHLink = new AscFormat.CT_Hyperlink();
				oHLink.fromXml(reader);
				this.HighlightColor = readHighlightColor(reader);
			}
		}
	};
	AscCommonWord.CParaPr.prototype.fromDrawingML = function (reader) {
		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "algn": {
					let sVal = reader.GetValue();
					switch (sVal) {
						case "ctr": {
							this.Jc = AscCommon.align_Center;
							break;
						}
						case "dist": {
							this.Jc = AscCommon.align_Justify;
							break;
						}
						case "just": {
							this.Jc = AscCommon.align_Justify;
							break;
						}
						case "justLow": {
							this.Jc = AscCommon.align_Justify;
							break;
						}
						case "l": {
							this.Jc = AscCommon.align_Left;
							break;
						}
						case "r": {
							this.Jc = AscCommon.align_Right;
							break;
						}
						case "thaiDist": {
							this.Jc = AscCommon.align_Justify;
							break;
						}
					}
					break;
				}
				case "defTabSz": {
					this.DefaultTab = reader.GetValueInt()/36000;
					break;
				}
				case "eaLnBrk": {
					break;
				}
				case "fontAlgn": {
					break;
				}
				case "hangingPunct": {
					break;
				}
				case "indent": {
					this.Ind.FirstLine = reader.GetValueInt()/36000;
					break;
				}
				case "latinLnBrk": {
					break;
				}
				case "lvl": {
					this.Lvl = reader.GetValueInt();
					break;
				}
				case "marL": {
					this.Ind.Left = reader.GetValueInt()/36000;
					break;
				}
				case "marR": {
					this.Ind.Right = reader.GetValueInt()/36000;
					break;
				}
				case "rtl": {
					break;
				}
			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name.indexOf("bu") === 0) {
				if(!this.Bullet) {
					this.Bullet = new AscFormat.CBullet();
				}
				this.Bullet.readChildXml(reader, name);
			}
			else if(name === "defRPr") {
				let oRPr = new AscCommonWord.CTextPr();
				oRPr.fromDrawingML(reader);
				this.DefaultRunPr = oRPr;
			}
			else if(name === "extLst") {

			}
			else if(name === "lnSpc") {
				this.Spacing.lnSpcFromDrawingML(reader);
			}
			else if(name === "spcAft") {
				this.Spacing.spcAftFromDrawingML(reader);
			}
			else if(name === "spcBef") {
				this.Spacing.spcBefFromDrawingML(reader);
			}
			else if(name === "tabLst") {
				this.Tabs = new CParaTabs();
				this.Tabs.fromDrawingML(reader);
			}
		}
	};
	AscCommonWord.CPresentationField.prototype.fromDrawingML = function(reader) {
		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "id": {
					this.SetGuid(reader.GetValue());
					break;
				}
				case "type": {
					this.SetFieldType(reader.GetValue());
					break;
				}
			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "pPr") {
				let oParaPr = new AscCommonWord.CParaPr();
				oParaPr.fromDrawingML(reader);
				this.SetPPr(oParaPr);
			}
			else if(name === "rPr") {
				let oTextPr = new AscCommonWord.CTextPr();
				oTextPr.fromDrawingML(reader);
				this.SetPr(oTextPr);
			}
			else if(name === "t") {
				this.AddText(reader.GetTextDecodeXml(), -1);
			}
		}
	};
	AscCommonWord.CTable.prototype.fromDrawingML = function(reader) {
		let oTable = this;

		this.SetTableLayout(tbllayout_Fixed);
		reader.context.TablesMap[this.Get_Id()] = this;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "tblGrid") {
				let aGrid = [];
				let oPr = new CT_XmlNode(function (reader, name) {
					if(name === "gridCol") {
						let oPr = new CT_XmlNode(function (reader, name) {
							return true;
						});
						oPr.fromXml(reader);
						if(oPr.attributes["w"]) {
							let nW = parseInt(oPr.attributes["w"]);
							if(AscFormat.isRealNumber(nW)) {
								aGrid.push(nW / 36000);
							}
						}
					}
					return true;
				});
				oPr.fromXml(reader);
				this.SetTableGrid(aGrid);
			}
			else if(name === "tblPr") {
				let oPr = new CTablePr();
				oPr.fromDrawingML(reader, this);
				this.Set_Pr(oPr);
			}
			else if(name === "tr") {
				let oRow = new CTableRow(this, 0);
				oRow.fromDrawingML(reader);
				let nIdx = this.Content.length;
				this.Content[nIdx] = oRow;
				this.Content[nIdx].Recalc_CompiledPr();
				History.Add(new CChangesTableAddRow(this, nIdx, [this.Content[nIdx]]));
			}
		}
	};
	CTablePr.prototype.fromDrawingML = function(reader, oTable) {
		let sName;
		let oTableLook = null;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "bandCol": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.BandVer = reader.GetValueBool();
					break;
				}
				case "bandRow": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.BandHor = reader.GetValueBool();
					break;
				}
				case "firstCol": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.FirstCol = reader.GetValueBool();
					break;
				}
				case "firstRow": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.FirstRow = reader.GetValueBool();
					break;
				}
				case "lastCol": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.LastCol = reader.GetValueBool();
					break;
				}
				case "lastRow": {
					if(!oTableLook) {
						oTableLook = new AscCommon.CTableLook();
					}
					oTableLook.LastRow = reader.GetValueBool();
					break;
				}
				case "rtl": {
					//TODO
					break;
				}
			}
		}
		if(oTable && oTableLook) {
			oTable.Set_TableLook(oTableLook);
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(AscFormat.CUniFill.prototype.isFillName(name)) {
				let oFill = new AscFormat.CUniFill();
				oFill.fromXml(reader, name);
				this.Shd = new CDocumentShd();
				this.Shd.Value = Asc.c_oAscShdClear;
				this.Shd.Unifill = oFill;
			}
			if(name === "tableStyleId") {
				this.style = reader.GetTextDecodeXml();
			}
		}
	};
	AscCommonWord.CTableRow.prototype.fromDrawingML = function (reader) {
		let sName;

		let fRowHeight = 5;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "h": {
					fRowHeight = reader.GetValueInt() / 36000;
					break;
				}

			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "tc") {
				let oCell = this.Add_Cell(this.Content.length, this, null, false);
				oCell.fromDrawingML(reader);
			}
		}
		this.updateHeightAfterOpen(fRowHeight);
	};
	AscCommonWord.CTableRow.prototype.updateHeightAfterOpen = function(fRowHeight) {
		var fMaxTopMargin = 0, fMaxBottomMargin = 0, fMaxTopBorder = 0, fMaxBottomBorder = 0;
		var bLoadVal = AscCommon.g_oIdCounter.m_bLoad;
		var bRead = AscCommon.g_oIdCounter.m_bRead;
		AscCommon.g_oIdCounter.m_bLoad = false;
		AscCommon.g_oIdCounter.m_bRead = false;
		for(let i = 0;  i < this.Content.length; ++i){
			var oCell = this.Content[i];
			var oMargins = oCell.GetMargins();
			if(oMargins.Bottom.W > fMaxBottomMargin){
				fMaxBottomMargin = oMargins.Bottom.W;
			}
			if(oMargins.Top.W > fMaxTopMargin){
				fMaxTopMargin = oMargins.Top.W;
			}
			var oBorders = oCell.Get_Borders();
			if(oBorders.Top.Size > fMaxTopBorder){
				fMaxTopBorder = oBorders.Top.Size;
			}
			if(oBorders.Bottom.Size > fMaxBottomBorder){
				fMaxBottomBorder = oBorders.Bottom.Size;
			}
		}
		AscCommon.g_oIdCounter.m_bLoad = bLoadVal;
		AscCommon.g_oIdCounter.m_bRead = bRead;
		this.Set_Height(Math.max(1, fRowHeight - fMaxTopMargin - fMaxBottomMargin - fMaxTopBorder/2 - fMaxBottomBorder/2), Asc.linerule_AtLeast);
	};
	AscCommonWord.CTableCell.prototype.fromDrawingML = function (reader) {
		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "gridSpan": {
					this.Set_GridSpan(reader.GetValueInt());
					break;
				}
				case "hMerge": {
					this.hMerge = reader.GetValueBool();
					break;
				}
				case "id": {
					let sId = reader.GetValue();
					break;
				}
				case "rowSpan": {
					let nVal = reader.GetValueInt();
					if(nVal > 1) {
						this.SetVMerge(vmerge_Restart);
					}
					break;
				}
				case "vMerge": {
					let bIsVMerge = reader.GetValueBool();
					if (bIsVMerge && this.Pr.VMerge != vmerge_Restart)
					{
						this.SetVMerge(vmerge_Continue);
					}
					break;
				}

			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "tcPr") {
				let props = new CTableCellPr();
				props.fromDrawingML(reader);
				props.Merge(this.Pr);
				this.Set_Pr(props);
			}
			else if(name === "txBody") {
				AscFormat.CTextBody.prototype.fromXml(reader, false, this.Content);
			}
		}
	};
	CTableCellPr.prototype.fromDrawingML = function (reader) {

		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "anchor": {
					let sVal = reader.GetValue();
					switch (sVal) {
						case "b": {
							this.VAlign = vertalignjc_Bottom;
							break;
						}
						case "ctr": {
							this.VAlign = vertalignjc_Center;
							break;
						}
						case "dist": {
							this.VAlign = vertalignjc_Center;
							break;
						}
						case "just": {
							this.VAlign = vertalignjc_Center;
							break;
						}
						case "t": {
							this.VAlign = vertalignjc_Top;
							break;
						}
					}
					break;
				}
				case "anchorCtr": {
					let sVal = reader.GetValue();
					break;
				}
				case "horzOverflow": {
					let sVal = reader.GetValue();
					break;
				}
				case "marB": {
					if(!this.TableCellMar)
						this.TableCellMar = {};
					this.TableCellMar.Bottom   = new CTableMeasurement(tblwidth_Mm, reader.GetValueInt() / 36000);
					break;
				}
				case "marL": {
					if(!this.TableCellMar)
						this.TableCellMar = {};
					this.TableCellMar.Left   = new CTableMeasurement(tblwidth_Mm, reader.GetValueInt() / 36000);
					break;
				}
				case "marR": {
					if(!this.TableCellMar)
						this.TableCellMar = {};
					this.TableCellMar.Right   = new CTableMeasurement(tblwidth_Mm, reader.GetValueInt() / 36000);
					break;
				}
				case "marT": {
					if(!this.TableCellMar)
						this.TableCellMar = {};
					this.TableCellMar.Top   = new CTableMeasurement(tblwidth_Mm, reader.GetValueInt() / 36000);
					break;
				}
				case "vert": {
					let sVal = reader.GetValue();
					switch (sVal) {
						case "eaVert": {
							this.TextDirection = Asc.c_oAscCellTextDirection.TBRL;
							break;
						}
						case "horz": {
							this.TextDirection = Asc.c_oAscCellTextDirection.LRTB;
							break;
						}
						case "mongolianVert": {
							this.TextDirection = Asc.c_oAscCellTextDirection.TBRL;
							break;
						}
						case "vert": {
							this.TextDirection = Asc.c_oAscCellTextDirection.BTLR;
							break;
						}
						case "vert270": {
							this.TextDirection = Asc.c_oAscCellTextDirection.BTLR;
							break;
						}
						case "wordArtVert": {
							this.TextDirection = Asc.c_oAscCellTextDirection.TBRL;
							break;
						}
						case "wordArtVertRtl": {
							this.TextDirection = Asc.c_oAscCellTextDirection.TBRL;
							break;
						}
					}
					break;
				}

			}
		}
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if (AscFormat.CUniFill.prototype.isFillName(name)) {
				let oFill = new AscFormat.CUniFill();
				oFill.fromXml(reader, name);
				this.Shd = new CDocumentShd();
				this.Shd.Value = Asc.c_oAscShdClear;
				this.Shd.Unifill = oFill;
			}
			else if (name === "cell3D") {

			}
			else if (name === "extLst") {

			}
			else if (name === "lnB") {
				if(!this.TableCellBorders) {
					this.TableCellBorders = {};
				}
				this.TableCellBorders.Bottom = readBorder(reader);
			}
			else if (name === "lnBlToTr") {

			}
			else if (name === "lnL") {
				if(!this.TableCellBorders) {
					this.TableCellBorders = {};
				}
				this.TableCellBorders.Left = readBorder(reader);
			}
			else if (name === "lnR") {
				if(!this.TableCellBorders) {
					this.TableCellBorders = {};
				}
				this.TableCellBorders.Right = readBorder(reader);
			}
			else if (name === "lnT") {
				if(!this.TableCellBorders) {
					this.TableCellBorders = {};
				}
				this.TableCellBorders.Top = readBorder(reader);
			}
			else if (name === "lnTlToBr") {

			}
		}
	};


	function readBorder(reader) {
		let oLn = new AscFormat.CLn();
		oLn.fromXml(reader);
		let border = new CDocumentBorder();
		if(oLn.Fill)
		{
			border.Unifill = oLn.Fill;
		}
		border.Size = (oLn.w == null) ? 12700 : ((oLn.w) >> 0);
		border.Size /= 36000;

		border.Value = border_Single;
		return border;
	}

	let SPACING_SCALE = 0.00352777778;

	function readSpacing(reader) {
		let sName;
		let depth = reader.GetDepth();
		let oRet = {val: null, valPct: null};
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "spcPct") {
				while (reader.MoveToNextAttribute()) {
					sName = reader.GetNameNoNS();
					switch(sName) {
						case "val": {
							let nVal = AscFormat.getPercentageValue(reader.GetValue());
							if(nVal !== null) {
								oRet.valPct = nVal / 100;
							}
							break;
						}
					}
				}
			}
			else if(name === "spcPts") {
				while (reader.MoveToNextAttribute()) {
					sName = reader.GetNameNoNS();
					switch(sName) {
						case "val": {
							let nVal = reader.GetValueInt()
							oRet.val = nVal * SPACING_SCALE;
							break;
						}
					}
				}
			}
		}
		return oRet;
	}
	CParaSpacing.prototype.lnSpcFromDrawingML = function (reader) {
		let oSpc = readSpacing(reader);
		if(oSpc.valPct !== null) {
			this.Line = oSpc.valPct;
			this.LineRule = Asc.linerule_Auto;
		}
		else if(oSpc.val !== null) {
			this.Line = oSpc.val;
			this.LineRule = Asc.linerule_Exact;
		}
	};
	CParaSpacing.prototype.spcAftFromDrawingML = function (reader) {
		let oSpc = readSpacing(reader);
		if(oSpc.valPct !== null) {
			this.AfterPct = oSpc.valPct;
			this.After = 0;
		}
		else if(oSpc.val !== null) {
			this.After = oSpc.val;
		}
	};
	CParaSpacing.prototype.spcBefFromDrawingML = function (reader) {
		let oSpc = readSpacing(reader);
		if(oSpc.valPct !== null) {
			this.BeforePct = oSpc.valPct;
			this.Before = 0;
		}
		else if(oSpc.val !== null) {
			this.Before = oSpc.val;
		}
	};


	CParaTabs.prototype.fromDrawingML = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(name === "tab") {
				let oTab = new CParaTab();
				oTab.fromDrawingML(reader);
				this.Tabs.push(oTab);
			}
		}
	};

	CParaTab.fromDrawingML = function(reader) {

		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "algn": {
					let sVal = reader.GetValue();
					if(sVal === "ctr") {
						this.Value = tab_Center;
					}
					else if(sVal === "r") {
						this.Value = tab_Right;
					}
					else {
						this.Value = tab_Left;
					}
					break;
				}
				case "pos": {
					this.Pos = reader.GetValueInt() / 36000;
					break;
				}
			}
		}
	};

	function readTypeface(reader) {
		let sName;
		while (reader.MoveToNextAttribute()) {
			sName = reader.GetNameNoNS();
			switch(sName) {
				case "typeface": {
					return reader.GetValue();
				}
			}
		}
		return null;
	}
	function readHighlightColor(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			var name = reader.GetNameNoNS();
			if(AscFormat.CUniColor.prototype.isUnicolor(name)) {
				let oColor = new AscFormat.CUniColor();
				oColor.fromXml(reader, name);
				return oColor;
			}
		}
		return null;
	}


	// function CT_String() {
	// 	this.val = null;
	// 	return this;
	// }
	// CT_String.prototype.readAttr = function(reader) {
	// 	while (reader.MoveToNextAttribute()) {
	// 		switch (reader.GetNameNoNS()) {
	// 			case "val": {
	// 				this.val = reader.GetValueDecodeXml();
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
	// CT_String.prototype.fromXml = function(reader) {
	// 	this.readAttr(reader);
	// 	reader.ReadTillEnd();
	// };
	// CT_String.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeStringEncode("val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// CT_String.prototype.fromVal = function(val) {
	// 	var res = null;
	// 	if (null !== val && undefined !== val) {
	// 		res = new CT_String();
	// 		res.val = val;
	// 	}
	// 	return res;
	// };
	// CT_String.prototype.toVal = function(reader, def) {
	// 	let elem = new CT_String();
	// 	elem.fromXml(reader);
	// 	return elem.getVal(def);
	// };
	// CT_String.prototype.getVal = function(def) {
	// 	return null !== this.val ? this.val : def;
	// };
	//
	// function CT_Bool() {
	// 	this.val = null;
	// 	return this;
	// }
	// CT_Bool.prototype.readAttr = function(reader) {
	// 	while (reader.MoveToNextAttribute()) {
	// 		switch (reader.GetNameNoNS()) {
	// 			case "val": {
	// 				this.val = reader.GetValueBool();
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
	// CT_Bool.prototype.fromXml = function(reader) {
	// 	this.readAttr(reader);
	// 	reader.ReadTillEnd();
	// };
	// CT_Bool.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeBool("val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// CT_Bool.prototype.fromVal = function(val) {
	// 	var res = null;
	// 	if (null !== val && undefined !== val) {
	// 		res = new CT_Bool();
	// 		res.val = val;
	// 	}
	// 	return res;
	// };
	// CT_Bool.prototype.toVal = function(reader, def) {
	// 	let elem = new CT_Bool();
	// 	elem.fromXml(reader);
	// 	return elem.getVal(def);
	// };
	// CT_Bool.prototype.getVal = function(def) {
	// 	return null !== this.val ? this.val : def;
	// };
	//
	// function CT_Int() {
	// 	this.val = null;
	// 	return this;
	// }
	// CT_Int.prototype.readAttr = function(reader) {
	// 	while (reader.MoveToNextAttribute()) {
	// 		switch (reader.GetNameNoNS()) {
	// 			case "val": {
	// 				this.val = reader.GetValueInt(this.val);
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
	// CT_Int.prototype.fromXml = function(reader) {
	// 	this.readAttr(reader);
	// 	reader.ReadTillEnd();
	// };
	// CT_Int.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeInt("val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// CT_Int.prototype.fromVal = function(val) {
	// 	var res = null;
	// 	if (null !== val && undefined !== val) {
	// 		res = new CT_Int();
	// 		res.val = val;
	// 	}
	// 	return res;
	// };
	// CT_Int.prototype.toVal = function(reader, def) {
	// 	let elem = new CT_Int();
	// 	elem.fromXml(reader);
	// 	return elem.getVal(def);
	// };
	// CT_Int.prototype.getVal = function(def) {
	// 	return null !== this.val ? this.val : def;
	// };
	//
	// function CT_UInt() {
	// 	this.val = null;
	// 	return this;
	// }
	// CT_UInt.prototype.readAttr = function(reader) {
	// 	while (reader.MoveToNextAttribute()) {
	// 		switch (reader.GetNameNoNS()) {
	// 			case "val": {
	// 				this.val = reader.GetValueUInt(this.val);
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
	// CT_UInt.prototype.fromXml = function(reader) {
	// 	this.readAttr(reader);
	// 	reader.ReadTillEnd();
	// };
	// CT_UInt.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeUInt("val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// CT_UInt.prototype.fromVal = function(val) {
	// 	var res = null;
	// 	if (null !== val && undefined !== val) {
	// 		res = new CT_UInt();
	// 		res.val = val;
	// 	}
	// 	return res;
	// };
	// CT_UInt.prototype.toVal = function(reader, def) {
	// 	let elem = new CT_UInt();
	// 	elem.fromXml(reader);
	// 	return elem.getVal(def);
	// };
	// CT_UInt.prototype.getVal = function(def) {
	// 	return null !== this.val ? this.val : def;
	// };
	// function CT_Double() {
	// 	this.val = null;
	// 	return this;
	// }
	//
	// CT_Double.prototype.readAttr = function(reader) {
	// 	while (reader.MoveToNextAttribute()) {
	// 		switch (reader.GetNameNoNS()) {
	// 			case "val": {
	// 				this.val = reader.GetValueDouble(this.val);
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
	// CT_Double.prototype.fromXml = function(reader) {
	// 	this.readAttr(reader);
	// 	reader.ReadTillEnd();
	// };
	// CT_Double.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeDouble("val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// CT_Double.prototype.fromVal = function(val) {
	// 	var res = null;
	// 	if (null !== val && undefined !== val) {
	// 		res = new CT_Double();
	// 		res.val = val;
	// 	}
	// 	return res;
	// };
	// CT_Double.prototype.toVal = function(reader, def) {
	// 	let elem = new CT_Double();
	// 	elem.fromXml(reader);
	// 	return elem.getVal(def);
	// };
	// CT_Double.prototype.getVal = function(def) {
	// 	return null !== this.val ? this.val : def;
	// };
	//
	// function CT_BoolW() {
	// 	CT_Bool.call(this);
	// }
	// CT_BoolW.prototype = Object.create(CT_Bool.prototype);
	// CT_BoolW.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeBool("w:val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// function CT_StringW() {
	// 	CT_String.call(this);
	// }
	// CT_StringW.prototype = Object.create(CT_String.prototype);
	// CT_StringW.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeStringEncode("w:val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// function CT_IntW() {
	// 	CT_Int.call(this);
	// }
	// CT_IntW.prototype = Object.create(CT_Int.prototype);
	// CT_IntW.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeInt("w:val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// function CT_UIntW() {
	// 	CT_UInt.call(this);
	// }
	// CT_UIntW.prototype = Object.create(CT_UInt.prototype);
	// CT_UIntW.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeUInt("w:val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };
	// function CT_DoubleW() {
	// 	CT_Double.call(this);
	// }
	// CT_DoubleW.prototype = Object.create(CT_Double.prototype);
	// CT_DoubleW.prototype.toXml = function(writer, name) {
	// 	writer.WriteXmlNodeStart(name);
	// 	writer.WriteXmlNullableAttributeDouble("w:val", this.val);
	// 	writer.WriteXmlAttributesEnd(true);
	// };

	window['AscCommon'].CT_Bool = CT_Bool;
	window['AscCommon'].CT_String = CT_String;
	window['AscCommon'].CT_Int = CT_Int;
	window['AscCommon'].CT_UInt = CT_UInt;
	window['AscCommon'].CT_Double = CT_Double;

	window['AscCommon'].CT_BoolW = CT_BoolW;
	window['AscCommon'].CT_StringW = CT_StringW;
	window['AscCommon'].CT_IntW = CT_IntW;
	window['AscCommon'].CT_UIntW = CT_UIntW;
	window['AscCommon'].CT_DoubleW = CT_DoubleW;
})(window);
