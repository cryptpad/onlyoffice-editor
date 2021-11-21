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

		writer.WriteXmlString('<xdr:nvPicPr><xdr:cNvPr id="' + cNvPrIndex + '" name="Picture ' + cNvPrIndex +
			'"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>');
		writer.WriteXmlNullable(this.blipFill, "xdr:blipFill");
		writer.WriteXmlNullable(this.spPr, "xdr:spPr");

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
		var depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			if ("blip" === reader.GetNameNoNS()) {
				while (reader.MoveToNextAttribute()) {
					if ("embed" === reader.GetNameNoNS()) {
						var rId = reader.GetValue();
						var rel = reader.rels.getRelationship(rId);
						if ("Internal" === rel.targetMode) {
							var path = rel.targetFullName.substring(1);
							var data = reader.GetContext().zip.files[path].sync('uint8array');
							var blob = new Blob([data], {type: "image/png"});
							var url = window.URL.createObjectURL(blob);
							AscCommon.g_oDocumentUrls.addImageUrl(path, url);
							AscCommon.pptx_content_loader.Reader.initAfterBlipFill(path, this);
						}
					}
				}
			}
		}
	};
	window['AscFormat'].CBlipFill.prototype.toXml = function(writer, name)
	{
		var context = writer.context;
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNodeStart("a:blip");
		writer.WriteXmlString(' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"');
		var rId = context.part.addRelationship(AscCommon.openXml.Types.image.relationType, "https://static.tildacdn.com/tild6433-3065-4530-b337-313461393462/-PClxnhCxUk.jpg", openXml.TargetMode.external);
		writer.WriteXmlAttributeString("r:embed", rId);
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
})(window);
