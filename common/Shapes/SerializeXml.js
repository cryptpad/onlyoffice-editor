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
	function CT_GraphicalObject() {
		this.Namespace = null;
		this.GraphicData = null;
		return this;
	}
	CT_GraphicalObject.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "graphicData" : {
					this.GraphicData = new CT_GraphicalObjectData();
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
	function CT_GraphicalObjectData() {
		this.Uri = null;
		this.graphicObject = null;
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
			this.graphicObject = AscFormat.CGraphicObjectBase.prototype.fromXmlElem(reader, name);
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

	window['AscFormat'].CGraphicObjectBase.prototype.fromXmlElem = function(reader, name) {
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

	window['AscFormat'].CGraphicFrame.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("xfrm" === reader.GetNameNoNS()) {
				var xfrm = new AscFormat.CXfrm();
				xfrm.fromXml(reader);
				this.setSpPr(new AscFormat.CSpPr());
				this.spPr.setParent(this);
				this.spPr.setXfrm(xfrm);
				this.spPr.xfrm.setParent(this.spPr);
			} else if ("graphic" === reader.GetNameNoNS()) {
				let graphic = new AscFormat.CT_GraphicalObject();
				graphic.fromXml(reader);
				let graphicObject = graphic.GraphicData && graphic.GraphicData.graphicObject;
				if (graphicObject) {
					//todo init in graphic.fromXml
					graphicObject.setBDeleted(false);
					graphicObject.setParent(this);
					this.setGraphicObject(graphicObject);
				}
			}
			//todo
		}
	};
	window['AscFormat'].CGraphicFrame.prototype.toXml = function(writer, name) {
		var context = writer.context;
		var cNvPrIndex = context.cNvPrIndex++;
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		var ns = StaxParser.prototype.GetNSFromNodeName(name);

		writer.WriteXmlString('<'+ns+':nvGraphicFramePr>');
		writer.WriteXmlString('<'+ns+':cNvPr id="' + cNvPrIndex + '" name="GraphicFrame ' + cNvPrIndex + '"/>');
		writer.WriteXmlString('<'+ns+':cNvGraphicFramePr/></'+ns+':nvGraphicFramePr>');
		writer.WriteXmlNullable(this.spPr && this.spPr.xfrm, ns + ":xfrm");
		writer.WriteXmlNullable(this.graphicObject, "a:graphic");
		writer.WriteXmlNodeEnd(name);
	};
	window['AscFormat'].CImageShape.prototype.toXml = function(writer, name) {
		var context = writer.context;
		var cNvPrIndex = context.cNvPrIndex++;
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		var ns = StaxParser.prototype.GetNSFromNodeName(name);

		writer.WriteXmlString('<'+ns+':nvPicPr>');
		writer.WriteXmlString('<'+ns+':cNvPr id="' + cNvPrIndex + '" name="Picture ' + cNvPrIndex + '"/>');
		writer.WriteXmlString('<'+ns+':cNvPicPr><a:picLocks noChangeAspect="1"/></'+ns+':cNvPicPr></'+ns+':nvPicPr>');
		writer.WriteXmlNullable(this.blipFill, ns + ":blipFill");
		writer.WriteXmlNullable(this.spPr, ns + ":spPr");

		writer.WriteXmlNodeEnd(name);
	};

	window['AscFormat'].CImageShape.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("blipFill" === reader.GetNameNoNS()) {
				var uni_fill = new AscFormat.CUniFill();
				uni_fill.fromXml(reader);
				this.setBlipFill(uni_fill.fill);
			} else if ("spPr" === reader.GetNameNoNS()) {
				var spPr = new AscFormat.CSpPr();
				spPr.setParent(this);
				spPr.fromXml(reader);
				this.setSpPr(spPr);
			}
			//todo
		}
	};
	window['AscFormat'].CImageShape.prototype.toXml = function(writer, name) {
		var context = writer.context;
		var cNvPrIndex = context.cNvPrIndex++;
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		var ns = StaxParser.prototype.GetNSFromNodeName(name);

		writer.WriteXmlString('<'+ns+':nvPicPr>');
		writer.WriteXmlString('<'+ns+':cNvPr id="' + cNvPrIndex + '" name="Picture ' + cNvPrIndex + '"/>');
		writer.WriteXmlString('<'+ns+':cNvPicPr><a:picLocks noChangeAspect="1"/></'+ns+':cNvPicPr></'+ns+':nvPicPr>');
		writer.WriteXmlNullable(this.blipFill, ns + ":blipFill");
		writer.WriteXmlNullable(this.spPr, ns + ":spPr");

		writer.WriteXmlNodeEnd(name);
	};

	window['AscFormat'].CSpPr.prototype.fromXml = function(reader) {
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("xfrm" === reader.GetNameNoNS()) {
				var xfrm = new AscFormat.CXfrm();
				xfrm.fromXml(reader);
				this.setXfrm(xfrm);
				this.xfrm.setParent(this);
			} else if ("prstGeom" === reader.GetNameNoNS()) {
				//todo
				var prst = "";
				while (reader.MoveToNextAttribute()) {
					if ("prst" === reader.GetName()) {
						prst = reader.GetValueDecodeXml();
					}
				}
				var oGeometry = AscFormat.CreateGeometry(prst);
				if (oGeometry && oGeometry.pathLst.length > 0)
					this.setGeometry(oGeometry);
			}
		}
	};
	window['AscFormat'].CSpPr.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNullable(this.xfrm, "a:xfrm");
		writer.WriteXmlString('<a:prstGeom prst="rect"> <a:avLst/> </a:prstGeom>');

		writer.WriteXmlNodeEnd(name);
	};

	window['AscFormat'].CXfrm.prototype.fromXml = function(reader) {
		this.readAttr(reader);

		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("off" === reader.GetNameNoNS()) {
				this.readAttrOff(reader, this.setOffX, this.setOffY);
			} else if ("ext" === reader.GetNameNoNS()) {
				this.readAttrExt(reader, this.setExtX, this.setExtY);
			} else if ("chOff" === reader.GetNameNoNS()) {
				this.readAttrOff(reader, this.setChOffX, this.setChOffY);
			} else if ("chExt" === reader.GetNameNoNS()) {
				this.readAttrExt(reader, this.setChExtX, this.setChExtY);
			}
		}
	};
	window['AscFormat'].CXfrm.prototype.toXml = function(writer, name)
	{
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeBool("flipH", this.flipH);
		writer.WriteXmlNullableAttributeBool("flipV", this.flipV);
		if(null !== this.rot) {
			writer.WriteXmlAttributeNumber("rot", Math.round(this.rot * 180 * 60000 / Math.PI));
		}
		writer.WriteXmlAttributesEnd();

		if (null !== this.offX || null !== this.offY) {
			writer.WriteXmlNodeStart("a:off");
			if (null !== this.offX) {
				writer.WriteXmlAttributeNumber("x", Math.round(this.offX * AscCommon.c_dScalePPTXSizes));
			}
			if (null !== this.offY) {
				writer.WriteXmlAttributeNumber("y", Math.round(this.offY * AscCommon.c_dScalePPTXSizes));
			}
			writer.WriteXmlAttributesEnd(true);
		}
		if (null !== this.extX || null !== this.extY) {
			writer.WriteXmlNodeStart("a:ext");
			if (null !== this.extX) {
				writer.WriteXmlAttributeNumber("cx", Math.round(this.extX * AscCommon.c_dScalePPTXSizes));
			}
			if (null !== this.extY) {
				writer.WriteXmlAttributeNumber("cy", Math.round(this.extY * AscCommon.c_dScalePPTXSizes));
			}
			writer.WriteXmlAttributesEnd(true);
		}
		if (null !== this.chOffX || null !== this.chOffY) {
			writer.WriteXmlNodeStart("a:chOff");
			if (null !== this.chOffX) {
				writer.WriteXmlAttributeNumber("x", Math.round(this.chOffX * AscCommon.c_dScalePPTXSizes));
			}
			if (null !== this.chOffY) {
				writer.WriteXmlAttributeNumber("y", Math.round(this.chOffY * AscCommon.c_dScalePPTXSizes));
			}
			writer.WriteXmlAttributesEnd(true);
		}
		if (null !== this.chExtX || null !== this.chExtY) {
			writer.WriteXmlNodeStart("a:chExt");
			if (null !== this.chExtX) {
				writer.WriteXmlAttributeNumber("cx", Math.round(this.chExtX * AscCommon.c_dScalePPTXSizes));
			}
			if (null !== this.chExtY) {
				writer.WriteXmlAttributeNumber("cy", Math.round(this.chExtY * AscCommon.c_dScalePPTXSizes));
			}
			writer.WriteXmlAttributesEnd(true);
		}
		writer.WriteXmlNodeEnd(name);
	};
	window['AscFormat'].CXfrm.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			if ("flipH" === reader.GetName()) {
				this.setFlipH(reader.GetValueBool());
			} else if ("flipV" === reader.GetName()) {
				this.setFlipV(reader.GetValueBool());
			} else if ("rot" === reader.GetName()) {
				this.setRot((reader.GetValueInt()/60000)*Math.PI/180);
			}
		}
	};
	window['AscFormat'].CXfrm.prototype.readAttrOff = function(reader, fSetX, fSetY) {
		while (reader.MoveToNextAttribute()) {
			if ("x" === reader.GetName()) {
				fSetX.call(this, reader.GetValueInt()/ AscCommon.c_dScalePPTXSizes);
			} else if ("y" === reader.GetName()) {
				fSetY.call(this, reader.GetValueInt()/ AscCommon.c_dScalePPTXSizes);
			}
		}
	};
	window['AscFormat'].CXfrm.prototype.readAttrExt = function(reader, fSetCX, fSetCY) {
		while (reader.MoveToNextAttribute()) {
			if ("cx" === reader.GetName()) {
				fSetCX.call(this, reader.GetValueInt()/ AscCommon.c_dScalePPTXSizes);
			} else if ("cy" === reader.GetName()) {
				fSetCY.call(this, reader.GetValueInt()/ AscCommon.c_dScalePPTXSizes);
			}
		}
	};

	window['AscFormat'].CUniFill.prototype.fromXml = function(reader)
	{
		var name = reader.GetNameNoNS();
		var depth = reader.GetDepth();
		switch (name) {
			case "blipFill":
				var blipFill = new AscFormat.CBlipFill();
				blipFill.fromXml(reader);
				this.setFill(blipFill);
				break;
			default:
				reader.ReadTillEnd(depth);
				break;
		}
	};
	window['AscFormat'].CUniFill.prototype.toXml = function(writer)
	{
		var fill = this.fill;
		if (!fill)
			return;
		switch (fill.type)
		{
			case c_oAscFill.FILL_TYPE_NOFILL:break;
			case c_oAscFill.FILL_TYPE_GRP:break;
			case c_oAscFill.FILL_TYPE_GRAD:break;
			case c_oAscFill.FILL_TYPE_PATT:break;
			case c_oAscFill.FILL_TYPE_BLIP:
				fill.toXml(writer, "xdr:blipFill");
				break;
			case c_oAscFill.FILL_TYPE_SOLID:break;
			default:break;
		}
	};

	window['AscFormat'].CBlipFill.prototype.fromXml = function(reader)
	{
		var context = reader.context;
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("blip" === reader.GetNameNoNS()) {
				while (reader.MoveToNextAttribute()) {
					if ("embed" === reader.GetNameNoNS()) {
						var rId = reader.GetValue();
						var rel = reader.rels.getRelationship(rId);
						if ("Internal" === rel.targetMode) {
							var blipFills = context.imageMap[rel.targetFullName.substring(1)];
							if (!blipFills) {
								context.imageMap[rel.targetFullName.substring(1)] = blipFills = [];
							}
							blipFills.push(this);
						}
					}
				}
			}
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
