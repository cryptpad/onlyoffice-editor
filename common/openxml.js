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

(function(window) {
	var openXml = {};

	function SaxParserBase() {
		this.depth = 0;
		this.depthSkip = null;
		this.context = null;
		this.contextStack = [];
	}

	SaxParserBase.prototype.onError = function(msg) {
		throw new Error(msg);
	};
	SaxParserBase.prototype.onStartNode = function(elem, getAttrs, isTagEnd, getStringNode) {
		this.depth++;
		if (!this.isSkip()) {
			var newContext;
			if (this.context.onStartNode) {
				newContext = this.context.onStartNode.call(this.context, elem, getAttrs, EasySAXParser.entityDecode, isTagEnd, getStringNode);
				if (!newContext) {
					this.skip();
				}
			}
			if (!this.isSkip() && !isTagEnd) {
				this.context = newContext ? newContext : this.context;
				this.contextStack.push(this.context);
			}
		}
	};
	SaxParserBase.prototype.onTextNode = function(text) {
		if (this.context && this.context.onTextNode) {
			this.context.onTextNode.call(this.context, text, EasySAXParser.entityDecode);
		}
	};
	SaxParserBase.prototype.onEndNode = function(elem, isTagStart, getStringNode) {
		this.depth--;
		var isSkip = this.isSkip();
		if (isSkip && this.depth <= this.depthSkip) {
			this.depthSkip = null;
		}
		if (!isSkip){
			var prevContext = this.context;
			if(!isTagStart){
				this.contextStack.pop();
				this.context = this.contextStack[this.contextStack.length - 1];
			}
			if (this.context && this.context.onEndNode) {
				this.context.onEndNode.call(this.context, prevContext, elem, EasySAXParser.entityDecode, isTagStart, getStringNode);
			}
		}
	};
	SaxParserBase.prototype.skip = function() {
		this.depthSkip = this.depth - 1;
	};
	SaxParserBase.prototype.isSkip = function() {
		return null !== this.depthSkip
	};
	SaxParserBase.prototype.parse = function(xml, context) {
		var t = this;
		this.context = context;
		var parser = new EasySAXParser({'autoEntity': false});
		parser.on('error', function() {
			t.onError.apply(t, arguments);
		});
		parser.on('startNode', function() {
			t.onStartNode.apply(t, arguments);
		});
		parser.on('textNode', function() {
			t.onTextNode.apply(t, arguments);
		});
		parser.on('endNode', function() {
			t.onEndNode.apply(t, arguments);
		});
		parser.parse(xml);
	};

	openXml.SaxParserBase = SaxParserBase;
	openXml.SaxParserDataTransfer = {};

	function ContentTypes(){
		this.Defaults = {};
		this.Overrides = {};
	}
	ContentTypes.prototype.onStartNode = function(elem, attr, uq, tagend, getStrNode) {
		var attrVals;
		if ('Default' === elem) {
			if (attr()) {
				attrVals = attr();
				this.Defaults[attrVals['Extension']] = attrVals['ContentType'];
			}
		} else if ('Override' === elem) {
			if (attr()) {
				attrVals = attr();
				this.Overrides[attrVals['PartName']] = attrVals['ContentType'];
			}
		}
		return this;
	};
	ContentTypes.prototype.toXml = function(writer) {
		writer.Seek(0);
		writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		writer.WriteXmlNodeStart("Types");
		writer.WriteXmlString(" xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"");
		writer.WriteXmlNodeEnd("Types", true);
		for (var ext in this.Defaults) {
			if (this.Defaults.hasOwnProperty(ext)) {
				writer.WriteXmlNodeStart("Default");
				writer.WriteXmlAttributeStringEncode("Extension", ext);
				writer.WriteXmlAttributeStringEncode("ContentType", this.Defaults[ext]);
				writer.WriteXmlNodeEnd("Default", true, true);
			}
		}
		for (var partName in this.Overrides) {
			if (this.Overrides.hasOwnProperty(partName)) {
				writer.WriteXmlNodeStart("Override");
				writer.WriteXmlAttributeStringEncode("PartName", partName);
				writer.WriteXmlAttributeStringEncode("ContentType", this.Overrides[partName]);
				writer.WriteXmlNodeEnd("Override", true, true);
			}
		}
		writer.WriteXmlNodeEnd("Types");
		return writer.GetDataUint8();
	};
	ContentTypes.prototype.add = function(partName, contentType) {
		var exti = partName.lastIndexOf(".");
		var ext = partName.substring(exti + 1);
		var res = !(this.Overrides[partName] || this.Defaults[ext]);
		if (contentType) {
			this.Overrides[partName] = contentType;
		}
		this.Defaults[ext] = "application/xml";//todo mime type
		return res;
	};
	function Rels(pkg, part){
		this.pkg = pkg;
		this.part = part;
		this.rels = [];
		this.nextRId = 1;
	}

	Rels.prototype.onStartNode = function(elem, attr, uq, tagend, getStrNode) {
		var attrVals;
		if ('Relationships' === elem) {
		} else if ('Relationship' === elem) {
			if (attr()) {
				attrVals = attr();
				var rId = attrVals["Id"] || "";
				var targetMode = attrVals["TargetMode"] || null;
				var theRel = new openXml.OpenXmlRelationship(this.pkg, this.part, rId, attrVals["Type"],
					attrVals["Target"], targetMode);
				this.rels.push(theRel);
				if (rId.startsWith("rId")) {
					this.nextRId = Math.max(this.nextRId, parseInt(rId.substring("rId").length) || 1);
				}
			}
		}
		return this;
	};
	Rels.prototype.toXml = function(writer) {
		writer.Seek(0);
		writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		writer.WriteXmlNodeStart("Relationships");
		writer.WriteXmlString(" xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"");
		writer.WriteXmlNodeEnd("Relationships", true);
		this.rels.forEach(function(elem){
			elem.toXml(writer, "Relationship");
		});
		writer.WriteXmlNodeEnd("Relationships");
		return writer.GetDataUint8();
	};
	Rels.prototype.getNextRId = function() {
		return "rId" + (this.nextRId++);
	};


	/******************************** OpenXmlPackage ********************************/
	function openFromZip(zip, pkg) {
		var ctf = zip.files["[Content_Types].xml"];
		if (ctf) {
			new SaxParserBase().parse(ctf.sync("string"), pkg.cntTypes);
		}
		for (var f in zip.files) {
			if (zip.files.hasOwnProperty(f)) {
				if (!f.endsWith("/")) {
					var f2 = f;
					var contentType = null;
					if (f !== "[Content_Types].xml") {
						f2 = "/" + f;
						contentType = pkg.getContentType(f);
					}
					pkg.parts[f2] = new openXml.OpenXmlPart(pkg, f2, contentType);
				}
			}
		}
	}

	openXml.OpenXmlPackage = function(zip, xmlWriter) {
		this.zip = zip;
		this.xmlWriter = xmlWriter;
		this.parts = {};
		this.cntTypes = new ContentTypes();

		openFromZip(this.zip, this);
	}

	openXml.OpenXmlPackage.prototype.removePart = function (uri) {
		var removePart = this.parts[uri];
		if(removePart) {
			delete this.parts[uri];
			this.zip.removeFile(removePart.getUriRelative());
		}
		return removePart;
	}
	openXml.OpenXmlPackage.prototype.addPartWithoutRels = function (uri, contentType, data) {
		//add part
		var newPart = new openXml.OpenXmlPart(this, uri, contentType);
		this.parts[uri] = newPart;
		//zip
		this.zip.addFile(newPart.getUriRelative(), data);
		// update [Content_Types].xml
		var changed = this.cntTypes.add(uri, contentType);
		if(changed) {
			this.zip.removeFile("[Content_Types].xml");
			this.zip.addFile("[Content_Types].xml", this.cntTypes.toXml(this.xmlWriter));
		}
		return newPart;
	}
	openXml.OpenXmlPackage.prototype.addPart = function (uri, contentType, data, target, relationshipType) {
		var newPart = this.addPartWithoutRels(uri, contentType, data);
		//update rels
		this.addRelationship(relationshipType, target);
		return newPart;
	}
	openXml.OpenXmlPackage.prototype.addRelationship = function (relationshipType, target, targetMode) {
		return this.getRootPart().addRelationship(relationshipType, target, targetMode);
	}

	openXml.OpenXmlPackage.prototype.getParts = function() {
		var parts = [];
		for (var part in this.parts) {
			if (this.parts[part].contentType !== openXml.contentTypes.relationships && part !== "[Content_Types].xml") {
				parts.push(this.parts[part]);
			}
		}
		return parts;
	}

	openXml.OpenXmlPackage.prototype.getRootPart = function() {
		return new openXml.OpenXmlPart(this, "/", openXml.contentTypes.relationships);
	}
	openXml.OpenXmlPackage.prototype.getRels = function() {
		return this.getRootPart().getRels();
	}
	openXml.OpenXmlPackage.prototype.getRelationships = function() {
		return this.getRootPart().getRelationships();
	}

	openXml.OpenXmlPackage.prototype.getRelationship = function(rId) {
		return this.getRootPart().getRelationship(rId);
	}

	openXml.OpenXmlPackage.prototype.getRelationshipsByRelationshipType = function(relationshipType) {
		return this.getRootPart().getRelationshipsByRelationshipType(relationshipType);
	}

	openXml.OpenXmlPackage.prototype.getPartsByRelationshipType = function(relationshipType) {
		return this.getRootPart().getPartsByRelationshipType(relationshipType);
	}

	openXml.OpenXmlPackage.prototype.getPartByRelationshipType = function(relationshipType) {
		return this.getRootPart().getPartByRelationshipType(relationshipType);
	}

	openXml.OpenXmlPackage.prototype.getRelationshipsByContentType = function(contentType) {
		return this.getRootPart().getRelationshipsByContentType(contentType);
	}

	openXml.OpenXmlPackage.prototype.getPartsByContentType = function(contentType) {
		return this.getRootPart().getPartsByContentType(contentType);
	};

	openXml.OpenXmlPackage.prototype.getRelationshipById = function(rId) {
		return this.getRootPart().getRelationshipById(contentType);
	}

	openXml.OpenXmlPackage.prototype.getPartById = function(rId) {
		return this.getRootPart().getPartById(rId);
	}

	openXml.OpenXmlPackage.prototype.getPartByUri = function(uri) {
		var part = this.parts[uri];
		return part;
	}

	openXml.OpenXmlPackage.prototype.getContentType = function(uri) {
		var ct = this.cntTypes.Overrides[uri];
		if (!ct) {
			var exti = uri.lastIndexOf(".");
			var ext = uri.substring(exti + 1);
			ct = this.cntTypes.Defaults[ext];
		}
		return ct;
	};

	/*********** OpenXmlPart ***********/

	openXml.OpenXmlPart = function(pkg, uri, contentType) {
		this.pkg = pkg;      // reference to the parent package
		this.uri = uri;      // the part is also indexed by uri in the package
		this.contentType = contentType;
	};

	openXml.OpenXmlPart.prototype.getUriRelative = function() {
		return this.uri.substring(1);
	};
	openXml.OpenXmlPart.prototype.getDocumentContent = function(type) {
		type = type || "string";
		var file = this.pkg.zip.files[this.getUriRelative()];
		if (file) {
			return file.sync(type);
		}
		return "";
	};
	openXml.OpenXmlPart.prototype.addPart = function (uri, contentType, data, relationshipType, target) {
		var newPart = this.pkg.addPartWithoutRels(uri, contentType, data);
		//update rels
		this.pkg.addRelationship(relationshipType, target);
		return newPart;
	}
	openXml.OpenXmlPart.prototype.addRelationship = function (relationshipType, target, targetMode) {
		var relsFilename = getRelsPartUriOfPart(this);
		var rels = this.getRels();
		var rId = rels.getNextRId();
		var newRel = new openXml.OpenXmlRelationship(rels.pkg, rels.part, rId, relationshipType, target, targetMode);
		rels.rels.push(newRel);
		this.pkg.removePart(relsFilename);
		this.pkg.addPartWithoutRels(relsFilename, null, rels.toXml(this.pkg.xmlWriter));
		return rId;
	}

	function getRelsPartUriOfPart(part) {
		var uri = part.uri;
		var lastSlash = uri.lastIndexOf('/');
		var partFileName = uri.substring(lastSlash + 1);
		var relsFileName = uri.substring(0, lastSlash) + "/_rels/" + partFileName + ".rels";
		return relsFileName;
	}

	function getPartUriOfRelsPart(part) {
		var uri = part.uri;
		var lastSlash = uri.lastIndexOf('/');
		var partFileName = uri.substring(lastSlash + 1, uri.length - '.rels'.length);
		var relsFileName = uri.substring(0, uri.lastIndexOf('/', lastSlash - 1) + 1) + partFileName;
		return relsFileName;
	}

	function getRelsPartOfPart(part) {
		var relsFileName = getRelsPartUriOfPart(part);
		var relsPart = part.pkg.getPartByUri(relsFileName);
		return relsPart;
	}

	openXml.OpenXmlPart.prototype.getRels = function() {
		var relsPackage = new Rels(null, this);
		var relsPart = getRelsPartOfPart(this);
		if(relsPart) {
			new SaxParserBase().parse(relsPart.getDocumentContent(), relsPackage);
		}
		return relsPackage;
	}
	openXml.OpenXmlPart.prototype.getRelationships = function() {
		return this.getRels().rels;
	}

	openXml.OpenXmlPart.prototype.getRelationship = function(rId) {
		var rels = this.getRelationships();
		for (var i = 0; i < rels.length; ++i) {
			var rel = rels[i];
			if (rel.relationshipId == rId) {
				return rel;
			}
		}
		return null;
	}

	// returns all related parts of the source part
	openXml.OpenXmlPart.prototype.getParts = function() {
		var parts = [];
		var rels = this.getRelationships();
		for (var i = 0; i < rels.length; ++i) {
			var part = this.pkg.getPartByUri(rels[i].targetFullName);
			parts.push(part);
		}
		return parts;
	}

	openXml.OpenXmlPart.prototype.getRelationshipsByRelationshipType = function(relationshipType) {
		var rels = this.getRelationships();
		return rels.filter(function (rel) {
			return rel.relationshipType === relationshipType;
		});
	}

	// returns all related parts of the source part with the given relationship type
	openXml.OpenXmlPart.prototype.getPartsByRelationshipType = function(relationshipType) {
		var parts = [];
		var rels = this.getRelationshipsByRelationshipType(relationshipType);
		for (var i = 0; i < rels.length; ++i) {
			var part = this.pkg.getPartByUri(rels[i].targetFullName);
			parts.push(part);
		}
		return parts;
	}

	openXml.OpenXmlPart.prototype.getPartByRelationshipType = function(relationshipType) {
		var parts = this.getPartsByRelationshipType(relationshipType);
		if (parts.length < 1) {
			return null;
		}
		return parts[0];
	}

	openXml.OpenXmlPart.prototype.getRelationshipsByContentType = function(contentType) {
		var rels = this.getRelationships();
		return rels.filter(function (rel) {
			return this.getContentType(rel.targetFullName) === contentType;
		});
	}

	openXml.OpenXmlPart.prototype.getPartsByContentType = function(contentType) {
		var parts = [];
		var rels = this.getRelationshipsByContentType(contentType);
		for (var i = 0; i < rels.length; ++i) {
			var part = this.pkg.getPartByUri(rels[i].targetFullName);
			parts.push(part);
		}
		return parts;
	}

	openXml.OpenXmlPart.prototype.getRelationshipById = function(relationshipId) {
		return this.getRelationship(relationshipId);
	}

	openXml.OpenXmlPart.prototype.getPartById = function(relationshipId) {
		var rel = this.getRelationshipById(relationshipId);
		if (rel) {
			var part = this.pkg.getPartByUri(rel.targetFullName);
			return part;
		}
		return null;
	}

	/******************************** OpenXmlRelationship ********************************/

	openXml.OpenXmlRelationship = function(pkg, part, relationshipId, relationshipType, target, targetMode) {
		this.fromPkg = pkg;        // if from a part, this will be null
		this.fromPart = part;      // if from a package, this will be null;
		this.relationshipId = relationshipId;
		this.relationshipType = relationshipType;
		this.target = target;
		this.targetMode = targetMode;
		if (!targetMode) {
			this.targetMode = "Internal";
		}

		var workingTarget = target;
		var workingCurrentPath;
		if (this.fromPkg) {
			workingCurrentPath = "/";
		}
		if (this.fromPart) {
			var slashIndex = this.fromPart.uri.lastIndexOf('/');
			if (slashIndex === -1) {
				workingCurrentPath = "/";
			} else {
				workingCurrentPath = this.fromPart.uri.substring(0, slashIndex) + "/";
			}
		}
		if (targetMode === "External") {
			this.targetFullName = this.target;
			return;
		}
		while (workingTarget.startsWith('../')) {
			if (workingCurrentPath.endsWith('/')) {
				workingCurrentPath = workingCurrentPath.substring(0, workingCurrentPath.length - 1);
			}
			var indexOfLastSlash = workingCurrentPath.lastIndexOf('/');
			if (indexOfLastSlash === -1) {
				throw "internal error when processing relationships";
			}
			workingCurrentPath = workingCurrentPath.substring(0, indexOfLastSlash + 1);
			workingTarget = workingTarget.substring(3);
		}

		this.targetFullName = workingCurrentPath + workingTarget;
	}
	openXml.OpenXmlRelationship.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		if (this.relationshipId) {
			writer.WriteXmlAttributeStringEncode("Id", this.relationshipId);
		}
		if (this.relationshipType) {
			writer.WriteXmlAttributeString("Type", this.relationshipType);
		}
		if (this.target) {
			writer.WriteXmlAttributeStringEncode("Target", this.target);
		}
		if (this.targetMode) {
			writer.WriteXmlAttributeString("TargetMode", this.targetMode);
		}
		writer.WriteXmlNodeEnd(name, true, true);
	};

	/******************************** OpenXmlRelationship ********************************/

	// ********************* content types ***********************
	openXml.contentTypes = {
		calculationChain: "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml",
		cellMetadata: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
		chart: "application/vnd.openxmlformats-officedocument.drawingml.chart+xml",
		chartColorStyle: "application/vnd.ms-office.chartcolorstyle+xml",
		chartDrawing: "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml",
		chartsheet: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
		chartStyle: "application/vnd.ms-office.chartstyle+xml",
		commentAuthors: "application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml",
		connections: "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml",
		coreFileProperties: "application/vnd.openxmlformats-package.core-properties+xml",
		customFileProperties: "application/vnd.openxmlformats-officedocument.custom-properties+xml",
		customization: "application/vnd.ms-word.keyMapCustomizations+xml",
		customProperty: "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty",
		customXmlProperties: "application/vnd.openxmlformats-officedocument.customXmlProperties+xml",
		diagramColors: "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml",
		diagramData: "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml",
		diagramLayoutDefinition: "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml",
		diagramPersistLayout: "application/vnd.ms-office.drawingml.diagramDrawing+xml",
		diagramStyle: "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml",
		dialogsheet: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
		digitalSignatureOrigin: "application/vnd.openxmlformats-package.digital-signature-origin",
		documentSettings: "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml",
		drawings: "application/vnd.openxmlformats-officedocument.drawing+xml",
		endnotes: "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml",
		excelAttachedToolbars: "application/vnd.ms-excel.attachedToolbars",
		extendedFileProperties: "application/vnd.openxmlformats-officedocument.extended-properties+xml",
		externalWorkbook: "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml",
		fontData: "application/x-fontdata",
		fontTable: "application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml",
		footer: "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
		footnotes: "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml",
		gif: "image/gif",
		glossaryDocument: "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml",
		handoutMaster: "application/vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml",
		header: "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml",
		jpeg: "image/jpeg",
		mainDocument: "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
		notesMaster: "application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml",
		notesSlide: "application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml",
		numberingDefinitions: "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml",
		pict: "image/pict",
		pivotTable: "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml",
		pivotTableCacheDefinition: "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml",
		pivotTableCacheRecords: "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml",
		png: "image/png",
		presentation: "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml",
		presentationProperties: "application/vnd.openxmlformats-officedocument.presentationml.presProps+xml",
		presentationTemplate: "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml",
		queryTable: "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml",
		relationships: "application/vnd.openxmlformats-package.relationships+xml",
		ribbonAndBackstageCustomizations: "http://schemas.microsoft.com/office/2009/07/customui",
		sharedStringTable: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
		singleCellTable: "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml",
		slicerCache: "application/vnd.openxmlformats-officedocument.spreadsheetml.slicerCache+xml",
		slicers: "application/vnd.openxmlformats-officedocument.spreadsheetml.slicer+xml",
		slide: "application/vnd.openxmlformats-officedocument.presentationml.slide+xml",
		slideComments: "application/vnd.openxmlformats-officedocument.presentationml.comments+xml",
		slideLayout: "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml",
		slideMaster: "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml",
		slideShow: "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml",
		slideSyncData: "application/vnd.openxmlformats-officedocument.presentationml.slideUpdateInfo+xml",
		styles: "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml",
		tableDefinition: "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml",
		tableStyles: "application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml",
		theme: "application/vnd.openxmlformats-officedocument.theme+xml",
		themeOverride: "application/vnd.openxmlformats-officedocument.themeOverride+xml",
		tiff: "image/tiff",
		trueTypeFont: "application/x-font-ttf",
		userDefinedTags: "application/vnd.openxmlformats-officedocument.presentationml.tags+xml",
		viewProperties: "application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml",
		vmlDrawing: "application/vnd.openxmlformats-officedocument.vmlDrawing",
		volatileDependencies: "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml",
		webSettings: "application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml",
		wordAttachedToolbars: "application/vnd.ms-word.attachedToolbars",
		wordprocessingComments: "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml",
		wordprocessingTemplate: "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml",
		workbook: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
		workbookRevisionHeader: "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml",
		workbookRevisionLog: "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml",
		workbookStyles: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
		workbookTemplate: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml",
		workbookUserData: "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml",
		worksheet: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
		worksheetComments: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
		worksheetSortMap: "application/vnd.ms-excel.wsSortMap+xml",
		xmlSignature: "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml",
	};

	// *********** relationship types ***********
	openXml.relationshipTypes = {
		alternativeFormatImport: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk",
		calculationChain: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/calcChain",
		cellMetadata: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
		chart: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
		chartColorStyle: "http://schemas.microsoft.com/office/2011/relationships/chartColorStyle",
		chartDrawing: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartUserShapes",
		chartsheet: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
		chartStyle: "http://schemas.microsoft.com/office/2011/relationships/chartStyle",
		commentAuthors: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors",
		connections: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/connections",
		coreFileProperties: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
		customFileProperties: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
		customization: "http://schemas.microsoft.com/office/2006/relationships/keyMapCustomizations",
		customProperty: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customProperty",
		customXml: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
		customXmlMappings: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/xmlMaps",
		customXmlProperties: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
		diagramColors: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors",
		diagramData: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData",
		diagramLayoutDefinition: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout",
		diagramPersistLayout: "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing",
		diagramStyle: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle",
		dialogsheet: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
		digitalSignatureOrigin: "http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/origin",
		documentSettings: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings",
		drawings: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
		endnotes: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes",
		excelAttachedToolbars: "http://schemas.microsoft.com/office/2006/relationships/attachedToolbars",
		extendedFileProperties: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
		externalWorkbook: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
		font: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font",
		fontTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable",
		footer: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
		footnotes: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes",
		glossaryDocument: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/glossaryDocument",
		handoutMaster: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/handoutMaster",
		header: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",
		image: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
		mainDocument: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
		notesSlide: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide",
		numberingDefinitions: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",
		pivotTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotTable",
		pivotTableCacheDefinition: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheDefinition",
		pivotTableCacheRecords: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheRecords",
		presentation: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
		presentationProperties: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps",
		queryTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/queryTable",
		ribbonAndBackstageCustomizations: "http://schemas.microsoft.com/office/2007/relationships/ui/extensibility",
		sharedStringTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
		singleCellTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableSingleCells",
		slide: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide",
		slideComments: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
		slideLayout: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout",
		slideMaster: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster",
		slideSyncData: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideUpdateInfo",
		styles: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
		tableDefinition: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/table",
		tableStyles: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles",
		theme: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
		themeOverride: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/themeOverride",
		thumbnail: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail",
		userDefinedTags: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/tags",
		viewProperties: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps",
		vmlDrawing: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
		volatileDependencies: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/volatileDependencies",
		webSettings: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings",
		wordAttachedToolbars: "http://schemas.microsoft.com/office/2006/relationships/attachedToolbars",
		wordprocessingComments: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
		workbook: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
		workbookRevisionHeader: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/revisionHeaders",
		workbookRevisionLog: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/revisionLog",
		workbookStyles: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
		workbookUserData: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/usernames",
		worksheet: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet",
		worksheetComments: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
		worksheetSortMap: "http://schemas.microsoft.com/office/2006/relationships/wsSortMap",
		xmlSignature: "http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/signature",
	};

	window.openXml = openXml;
	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].openXml = openXml;

}(window));
