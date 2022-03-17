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
	let CChartSpace = window['AscFormat'].CChartSpace;
	let CPivotSource = window['AscFormat'].CPivotSource;
	let CProtection = window['AscFormat'].CProtection;
	let CPrintSettings = window['AscFormat'].CPrintSettings;
	let CHeaderFooterChart = window['AscFormat'].CHeaderFooterChart;
	let CPageMarginsChart = window['AscFormat'].CPageMarginsChart;
	let CPageSetup = window['AscFormat'].CPageSetup;
	let CChart = window['AscFormat'].CChart;
	let CTitle = window['AscFormat'].CTitle;
	let CChartText = window['AscFormat'].CChartText;
	let CStrRef = window['AscFormat'].CStrRef;
	let CStrCache = window['AscFormat'].CStrCache;
	let CStringPoint = window['AscFormat'].CStringPoint;
	let CPivotFmt = window['AscFormat'].CPivotFmt;
	let CMarker = window['AscFormat'].CMarker;
	let CDLbl = window['AscFormat'].CDLbl;
	let CView3d = window['AscFormat'].CView3d;
	let CChartWall = window['AscFormat'].CChartWall;
	let CPictureOptions = window['AscFormat'].CPictureOptions;
	let CLegend = window['AscFormat'].CLegend;
	let CLegendEntry = window['AscFormat'].CLegendEntry;
	let CPlotArea = window['AscFormat'].CPlotArea;
	let CDTable = window['AscFormat'].CDTable;
	let CAreaChart = window['AscFormat'].CAreaChart;
	let CBarChart = window['AscFormat'].CBarChart;
	let CBubbleChart = window['AscFormat'].CBubbleChart;
	let CDoughnutChart = window['AscFormat'].CDoughnutChart;
	let CLineChart = window['AscFormat'].CLineChart;
	let CPieChart = window['AscFormat'].CPieChart;
	let CRadarChart = window['AscFormat'].CRadarChart;
	let CScatterChart = window['AscFormat'].CScatterChart;
	let CStockChart = window['AscFormat'].CStockChart;
	let CSurfaceChart = window['AscFormat'].CSurfaceChart;
	let CAreaSeries = window['AscFormat'].CAreaSeries;
	let CTx = window['AscFormat'].CTx;
	let CDPt = window['AscFormat'].CDPt;
	let CDLbls = window['AscFormat'].CDLbls;
	let CNumFmt = window['AscFormat'].CNumFmt;
	let CTrendLine = window['AscFormat'].CTrendLine;
	let CErrBars = window['AscFormat'].CErrBars;
	let CCat = window['AscFormat'].CCat;
	let CYVal = window['AscFormat'].CYVal;

	let CT_OnOff, CT_StringStax, CT_DecimalNumber, CT_UnsignedDecimalNumber, CT_Double;
//CT_ChartSpace
	CChartSpace.prototype.fromXml = function (reader) {
		reader.context.curChart = this;
		var name;
		if (!reader.ReadNextNode()) {
			return;
		}
		name = reader.GetNameNoNS();
		if ("chartSpace" !== name) {
			if (!reader.ReadNextNode()) {
				return;
			}
		}
		name = reader.GetNameNoNS();
		if ("chartSpace" === name || "chartSpace" === name || "chartSpace" === name) {
			var elem, depth = reader.GetDepth();
			while (reader.ReadNextSiblingNode(depth)) {
				switch (reader.GetNameNoNS()) {
					case "date1904" : {
						this.setDate1904(CT_OnOff.prototype.toVal(reader, this.date1904));
						break;
					}
					case "lang" : {
						this.setLang(CT_StringStax.prototype.toVal(reader, this.lang));
						break;
					}
					case "roundedCorners" : {
						this.setRoundedCorners(CT_OnOff.prototype.toVal(reader, this.roundedCorners));
						break;
					}
					case "AlternateContent" : {
						//todo
						break;
					}
					case "style" : {
						this.setStyle(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.style));
						break;
					}
					case "clrMapOvr" : {
						//todo
						elem = new AscFormat.ClrMap();
						elem.fromXml(reader);
						this.setClrMapOvr(elem);
						break;
					}
					case "pivotSource" : {
						elem = new CPivotSource();
						elem.fromXml(reader);
						this.setPivotSource(elem);
						break;
					}
					case "protection" : {
						elem = new CProtection();
						elem.fromXml(reader);
						this.setPivotSource(elem);
						break;
					}
					case "chart" : {
						elem = new AscFormat.CChart();
						elem.fromXml(reader);
						this.setChart(elem);
						break;
					}
					case "spPr" : {
						readSpPr(reader, this);
						break;
					}
					case "txPr" : {
						readTxPr(reader, this);
						break;
					}
					// case "externalData" : {
					// 	this.setExternalData(CT_ExternalData.prototype.toVal(reader, this.externalData));
					// 	this.externalData = CT_ExternalData.prototype.toVal(reader, this.externalData);
					// 	this.externalData = new CT_ExternalData();
					// 	this.externalData.fromXml(reader);
					// 	break;
					// }
					case "printSettings" : {
						elem = new CPrintSettings();
						elem.fromXml(reader);
						this.setPrintSettings(elem);
						break;
					}
					// case "extLst" : {
					// 	var subDepth = reader.GetDepth();
					// 	while (reader.ReadNextSiblingNode(subDepth)) {
					// 		if ("ext" === reader.GetNameNoNS()) {
					// 			elem = new CT_Extension();
					// 			elem.fromXml(reader);
					// 			this.extLst.push(elem);
					// 		}
					// 	}
					// 	break;
					// }
					case "themeOverride" : {
						//todo
						break;
					}
					//todo userShapes, styles, colors
				}
			}
		}
	};
	CChartSpace.prototype.toXml = function (writer) {
		var name = "c:chartSpace";
		writer.WriteXmlString(AscCommonWord.g_sXmlHeader);
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlString(AscCommonWord.g_sXmlChartNamespaces);
		writer.WriteXmlAttributesEnd();

		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.date1904), "c:date1904");
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(this.lang), "c:lang");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.roundedCorners), "c:roundedCorners");
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.style), "c:style");
		writer.WriteXmlNullable(this.clrMapOvr, "c:clrMapOvr");
		writer.WriteXmlNullable(this.pivotSource, "c:pivotSource");
		writer.WriteXmlNullable(this.protection, "c:protection");
		writer.WriteXmlNullable(this.chart, "c:chart");
		// writer.WriteXmlNullable(this.spPr, "c:spPr");
		// writer.WriteXmlNullable(this.txPr, "c:txPr");
		// writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.externalData), "c:externalData");
		writer.WriteXmlNullable(this.printSettings, "c:printSettings");
		// writer.WriteXmlNullable(this.userShapes, "c:userShapes");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		// writer.WriteXmlNullable(this.themeOverride, "c:themeOverride");
		writer.WriteXmlNodeEnd(name);
	};

	CPivotSource.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "name" : {
					this.setName(reader.GetTextDecodeXml());
					break;
				}
				case "fmtId" : {
					this.setFmtId(CT_UnsignedInt.prototype.toVal(reader, this.fmtId));
					break;
				}
				case "extLst" : {
					break;
				}
			}
		}
	};
	CPivotSource.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullableValueStringEncode("c:name", this.name);
		writer.WriteXmlNullable(CT_UnsignedInt.prototype.fromVal(this.fmtId), "c:fmtId");
		//todo extLst
		writer.WriteXmlNodeEnd(name);
	};

	CProtection.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "chartObject" : {
					this.setChartObject(CT_OnOff.prototype.toVal(reader, this.chartObject));
					break;
				}
				case "data" : {
					this.setData(CT_OnOff.prototype.toVal(reader, this.data));
					break;
				}
				case "formatting" : {
					this.setFormatting(CT_OnOff.prototype.toVal(reader, this.formatting));
					break;
				}
				case "selection" : {
					this.setSelection(CT_OnOff.prototype.toVal(reader, this.selection));
					break;
				}
				case "userInterface" : {
					this.setUserInterface(CT_OnOff.prototype.toVal(reader, this.userInterface));
					break;
				}
			}
		}
	};
	CProtection.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.chartObject), "c:chartObject");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.data), "c:data");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.formatting), "c:formatting");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.selection), "c:selection");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.userInterface), "c:userInterface");
		writer.WriteXmlNodeEnd(name);
	};

	CPrintSettings.prototype.fromXml = function(reader) {
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "headerFooter" : {
					elem = new CHeaderFooterChart();
					elem.fromXml(reader);
					this.setHeaderFooter(elem);
					break;
				}
				case "pageMargins" : {
					elem = new CPageMarginsChart();
					elem.fromXml(reader);
					this.setPageMargins(elem);
					break;
				}
				case "pageSetup" : {
					elem = new CPageSetup();
					elem.fromXml(reader);
					this.setPageSetup(elem);
					break;
				}
			}
		}
	};
	CPrintSettings.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.headerFooter, "c:headerFooter");
		writer.WriteXmlNullable(this.pageMargins, "c:pageMargins");
		writer.WriteXmlNullable(this.pageSetup, "c:pageSetup");
		writer.WriteXmlNodeEnd(name);
	};

	CHeaderFooterChart.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "alignWithMargins": {
					this.setAlignWithMargins(reader.GetValueBool());
					break;
				}
				case "differentOddEven": {
					this.setDifferentOddEven(reader.GetValueBool());
					break;
				}
				case "differentFirst": {
					this.setDifferentFirst(reader.GetValueBool());
					break;
				}
			}
		}
	};
	CHeaderFooterChart.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		var elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "oddHeader" : {
					this.setOddHeader(reader.GetTextDecodeXml());
					break;
				}
				case "oddFooter" : {
					this.setOddHeader(reader.GetTextDecodeXml());
					break;
				}
				case "evenHeader" : {
					this.setEvenHeader(reader.GetTextDecodeXml());
					break;
				}
				case "evenFooter" : {
					this.setEvenFooter(reader.GetTextDecodeXml());
					break;
				}
				case "firstHeader" : {
					this.setFirstHeader(reader.GetTextDecodeXml());
					break;
				}
				case "firstFooter" : {
					this.setFirstFooter(reader.GetTextDecodeXml());
					break;
				}
			}
		}
	};
	CHeaderFooterChart.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeBool("c:alignWithMargins", this.alignWithMargins);
		writer.WriteXmlNullableAttributeBool("c:differentOddEven", this.differentOddEven);
		writer.WriteXmlNullableAttributeBool("c:differentFirst", this.differentFirst);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullableValueStringEncode("c:oddHeader", this.oddHeader);
		writer.WriteXmlNullableValueStringEncode("c:oddFooter", this.oddFooter);
		writer.WriteXmlNullableValueStringEncode("c:evenHeader", this.evenHeader);
		writer.WriteXmlNullableValueStringEncode("c:evenFooter", this.evenFooter);
		writer.WriteXmlNullableValueStringEncode("c:firstHeader", this.firstHeader);
		writer.WriteXmlNullableValueStringEncode("c:firstFooter", this.firstFooter);
		writer.WriteXmlNodeEnd(name);
	};

	CPageMarginsChart.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "l": {
					this.setL(reader.GetValueDouble(this.l));
					break;
				}
				case "r": {
					this.setR(reader.GetValueDouble(this.r));
					break;
				}
				case "t": {
					this.setT(reader.GetValueDouble(this.t));
					break;
				}
				case "b": {
					this.setB(reader.GetValueDouble(this.b));
					break;
				}
				case "header": {
					this.setHeader(reader.GetValueDouble(this.header));
					break;
				}
				case "footer": {
					this.setFooter(reader.GetValueDouble(this.footer));
					break;
				}
			}
		}
	};
	CPageMarginsChart.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CPageMarginsChart.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeDouble("c:l", this.l);
		writer.WriteXmlNullableAttributeDouble("c:r", this.r);
		writer.WriteXmlNullableAttributeDouble("c:t", this.t);
		writer.WriteXmlNullableAttributeDouble("c:b", this.b);
		writer.WriteXmlNullableAttributeDouble("c:header", this.header);
		writer.WriteXmlNullableAttributeDouble("c:footer", this.footer);
		writer.WriteXmlAttributesEnd(true);
	};

	CPageSetup.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "paperSize": {
					this.setPaperSize(reader.GetValueUInt(this.paperSize));
					break;
				}
				case "paperHeight": {
					this.setPaperHeight(AscCommon.universalMeasureToMm(reader.GetValue(), 1, this.paperHeight));
					break;
				}
				case "paperWidth": {
					this.setPaperWidth(AscCommon.universalMeasureToMm(reader.GetValue(), 1, this.paperWidth));
					break;
				}
				case "firstPageNumber": {
					this.setFirstPageNumber(reader.GetValueUInt(this.firstPageNumber));
					break;
				}
				case "orientation": {
					this.setOrientation(fromXml_ST_PageSetupOrientation(reader.GetValue(), this.orientation));
					break;
				}
				case "blackAndWhite": {
					this.setBlackAndWhite(reader.GetValueBool());
					break;
				}
				case "draft": {
					this.setDraft(reader.GetValueBool());
					break;
				}
				case "useFirstPageNumber": {
					this.setUseFirstPageNumb(reader.GetValueBool());
					break;
				}
				case "horizontalDpi": {
					this.setHorizontalDpi(reader.GetValueInt(this.horizontalDpi));
					break;
				}
				case "verticalDpi": {
					this.setVerticalDpi(reader.GetValueInt(this.verticalDpi));
					break;
				}
				case "copies": {
					this.setCopies(reader.GetValueUInt(this.copies));
					break;
				}
			}
		}
	};
	CPageSetup.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CPageSetup.prototype.toXml = function(writer, name) {
		let paperHeight = null;
		if (null !== this.paperHeight) {
			paperHeight = this.paperHeight + "mm";
		}
		let paperWidth = null;
		if (null !== this.paperWidth) {
			paperWidth = this.paperWidth + "mm";
		}
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeUInt("c:paperSize", this.paperSize);
		writer.WriteXmlNullableAttributeStringEncode("c:paperHeight", paperHeight);
		writer.WriteXmlNullableAttributeStringEncode("c:paperWidth", paperWidth);
		writer.WriteXmlNullableAttributeUInt("c:firstPageNumber", this.firstPageNumber);
		writer.WriteXmlNullableAttributeString("c:orientation", toXml_ST_PageSetupOrientation(this.orientation));
		writer.WriteXmlNullableAttributeBool("c:blackAndWhite", this.blackAndWhite);
		writer.WriteXmlNullableAttributeBool("c:draft", this.draft);
		writer.WriteXmlNullableAttributeBool("c:useFirstPageNumber", this.useFirstPageNumber);
		writer.WriteXmlNullableAttributeInt("c:horizontalDpi", this.horizontalDpi);
		writer.WriteXmlNullableAttributeInt("c:verticalDpi", this.verticalDpi);
		writer.WriteXmlNullableAttributeUInt("c:copies", this.copies);
		writer.WriteXmlAttributesEnd(true);
	};

//CT_Chart
	CChart.prototype.fromXml = function(reader) {
		let t = this;
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "title" : {
					elem = new CTitle();
					elem.fromXml(reader);
					this.setTitle(elem);
					break;
				}
				case "autoTitleDeleted" : {
					this.setAutoTitleDeleted(CT_OnOff.prototype.toVal(reader, this.autoTitleDeleted));
					break;
				}
				case "pivotFmts" : {
					reader.readXmlArray("pivotFmt", function () {
						elem = new CPivotFmt();
						elem.fromXml(reader);
						t.setPivotFmts(elem);
					});
					break;
				}
				case "view3D" : {
					elem = new AscFormat.CView3d();
					elem.fromXml(reader);
					this.setView3D(elem);
					break;
				}
				case "floor" : {
					elem = new AscFormat.CChartWall();
					elem.fromXml(reader);
					this.setFloor(elem);
					break;
				}
				case "sideWall" : {
					elem = new AscFormat.CChartWall();
					elem.fromXml(reader);
					this.setSideWall(elem);
					break;
				}
				case "backWall" : {
					elem = new AscFormat.CChartWall();
					elem.fromXml(reader);
					this.setBackWall(elem);
					break;
				}
				case "plotArea" : {
					elem = new AscFormat.CPlotArea();
					elem.fromXml(reader);
					this.setPlotArea(elem);
					break;
				}
				case "legend" : {
					elem = new AscFormat.CLegend();
					elem.fromXml(reader);
					elem.updateLegendPos();
					this.setLegend(elem);
					break;
				}
				case "plotVisOnly" : {
					this.setPlotVisOnly(CT_OnOff.prototype.toVal(reader, this.plotVisOnly));
					break;
				}
				case "dispBlanksAs" : {
					this.setDispBlanksAs(fromXml_ST_DispBlanksAs(CT_StringStax.prototype.toVal(reader, this.dispBlanksAs), this.dispBlanksAs));
					break;
				}
				case "showDLblsOverMax" : {
					this.setShowDLblsOverMax(CT_OnOff.prototype.toVal(reader, this.showDLblsOverMax));
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CChart.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.title, "c:title");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.autoTitleDeleted), "c:autoTitleDeleted");
		writer.WriteXmlArray(this.pivotFmts, "c:pivotFmt", "c:pivotFmts" );
		writer.WriteXmlNullable(this.view3D, "c:view3D");
		writer.WriteXmlNullable(this.floor, "c:floor");
		writer.WriteXmlNullable(this.sideWall, "c:sideWall");
		writer.WriteXmlNullable(this.backWall, "c:backWall");
		writer.WriteXmlNullable(this.plotArea, "c:plotArea");
		writer.WriteXmlNullable(this.legend, "c:legend");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.plotVisOnly), "c:plotVisOnly");
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(toXml_ST_DispBlanksAs(this.dispBlanksAs)), "c:dispBlanksAs");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showDLblsOverMax), "c:showDLblsOverMax");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CTitle.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "tx" : {
					elem = new AscFormat.CChartText();
					elem.fromXml(reader);
					elem.setChart(reader.context.curChart);
					this.setTx(elem);
					break;
				}
				case "layout" : {
					readLayout(reader, this);
					break;
				}
				case "overlay" : {
					this.setOverlay(CT_OnOff.prototype.toVal(reader, this.overlay));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CTitle.prototype.toXml = function(writer, name) {
		let layout = null;
		if (this.layout) {
			layout = new CT_XmlNode();
			layout.members["c:manualLayout"] = this.layout;
		}
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.tx, "c:tx");
		writer.WriteXmlNullable(layout, "c:layout");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.overlay), "c:overlay");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CChartText.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "rich" : {
					//todo
					elem = new AscFormat.CTextBody();
					elem.fromXml(reader);
					this.setRich(elem);
					this.rich.setParent(this);
					break;
				}
				case "strRef" : {
					elem = new AscFormat.CStrRef();
					elem.fromXml(reader);
					this.setStrRef(elem);
					break;
				}
			}
		}
	};
	CChartText.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.rich, "c:rich");
		writer.WriteXmlNullable(this.strRef, "c:strRef");
		writer.WriteXmlNodeEnd(name);
	};

	CStrRef.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "f" : {
					this.setF(reader.GetTextDecodeXml());
					break;
				}
				case "strCache" : {
					elem = new AscFormat.CStrCache();
					elem.fromXml(reader);
					this.setStrCache(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CStrRef.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullableValueStringEncode("c:f", this.f);
		writer.WriteXmlNullable(this.strCache, "c:strCache");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CStrCache.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "ptCount" : {
					this.setPtCount(CT_UnsignedInt.prototype.toVal(reader, this.ptCount));
					break;
				}
				case "pt" : {
					elem = new CStringPoint();
					elem.fromXml(reader);
					this.addPt(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CStrCache.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.ptCount, "c:ptCount");
		writer.WriteXmlArray(this.pt, "c:pt");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CStringPoint.prototype.readAttr = function(reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "idx": {
					this.setIdx(reader.GetValueUInt(this.idx));
					break;
				}
			}
		}
	};
	CStringPoint.prototype.fromXml = function(reader) {
		this.readAttr(reader);
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "v" : {
					this.setVal(reader.GetTextDecodeXml());
					break;
				}
			}
		}
	};
	CStringPoint.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeUInt("c:idx", this.idx);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullableValueStringEncode("c:v", this.val);
		writer.WriteXmlNodeEnd(name);
	};

	CPivotFmt.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "idx" : {
					this.setIdx(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.idx));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
				case "marker" : {
					elem = new AscFormat.CMarker();
					elem.fromXml(reader);
					this.setMarker(elem);
					break;
				}
				case "dLbl" : {
					elem = new AscFormat.CDLbl();
					elem.fromXml(reader);
					elem.correctValues();
					this.setLbl(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CPivotFmt.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.idx, "c:idx");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		writer.WriteXmlNullable(this.marker, "c:marker");
		writer.WriteXmlNullable(this.dLbl, "c:dLbl");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CMarker.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "symbol" : {
					this.setSymbol(fromXml_ST_MarkerStyle(CT_StringStax.prototype.toVal(reader, this.symbol), this.symbol));
					break;
				}
				case "size" : {
					this.setSize(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.size));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CMarker.prototype.toXml = function(writer, name) {
		let symbol = CT_StringStax.prototype.fromVal(toXml_ST_MarkerStyle(this.symbol));
		let size = CT_UnsignedDecimalNumber.prototype.fromVal(this.size);

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(symbol, "c:symbol");
		writer.WriteXmlNullable(size, "c:size");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};
	CDLbl.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "layout" : {
					readLayout(reader, this);
					break;
				}
				case "tx" : {
					elem = new AscFormat.CChartText();
					elem.fromXml(reader);
					elem.setChart(reader.context.curChart);
					this.setTx(elem);
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
			}
		}
	};
	CDLbl.prototype.toXml = function(writer, name) {
		let layout = null;
		if (this.layout) {
			layout = new CT_XmlNode();
			layout.members["c:manualLayout"] = this.layout;
		}
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(layout, "c:layout");
		writer.WriteXmlNullable(this.tx, "c:tx");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		writer.WriteXmlNodeEnd(name);
	};

	CView3d.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "rotX" : {
					this.setRotX(CT_DecimalNumber.prototype.toVal(reader, this.rotX));
					break;
				}
				case "hPercent" : {
					this.setHPercent(CT_DecimalNumber.prototype.toVal(reader, this.hPercent));
					break;
				}
				case "rotY" : {
					this.setRotY(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.rotY));
					break;
				}
				case "depthPercent" : {
					this.setDepthPercent(CT_DecimalNumber.prototype.toVal(reader, this.depthPercent));
					break;
				}
				case "rAngAx" : {
					this.setRAngAx(CT_OnOff.prototype.toVal(reader, this.rAngAx));
					break;
				}
				case "perspective" : {
					this.setPerspective(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.perspective));
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CView3d.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_DecimalNumber.prototype.fromVal(this.rotX), "c:rotX");
		writer.WriteXmlNullable(CT_DecimalNumber.prototype.fromVal(this.hPercent), "c:hPercent");
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.rotY), "c:rotY");
		writer.WriteXmlNullable(CT_DecimalNumber.prototype.fromVal(this.depthPercent), "c:depthPercent");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.rAngAx), "c:rAngAx");
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.perspective), "c:perspective");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CChartWall.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "thickness" : {
					this.setThickness(CT_DecimalNumber.prototype.toVal(reader, this.thickness));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "pictureOptions" : {
					elem = new AscFormat.CPictureOptions();
					elem.fromXml(reader);
					this.setPictureOptions(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CChartWall.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_DecimalNumber.prototype.fromVal(this.thickness), "c:thickness");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.pictureOptions, "c:pictureOptions");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CPictureOptions.prototype.fromXml = function(reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "applyToFront" : {
					this.setApplyToFront(CT_OnOff.prototype.toVal(reader, this.applyToFront));
					break;
				}
				case "applyToSides" : {
					this.setApplyToSides(CT_OnOff.prototype.toVal(reader, this.applyToSides));
					break;
				}
				case "applyToEnd" : {
					this.setApplyToEnd(CT_OnOff.prototype.toVal(reader, this.applyToEnd));
					break;
				}
				case "pictureFormat" : {
					this.setPictureFormat(fromXml_ST_PictureFormat(CT_StringStax.prototype.toVal(reader, this.pictureFormat), this.pictureFormat));
					break;
				}
				case "pictureStackUnit" : {
					this.setPictureStackUnit(CT_Double.prototype.toVal(reader, this.pictureStackUnit));
					break;
				}
			}
		}
	};
	CPictureOptions.prototype.toXml = function(writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.applyToFront), "c:applyToFront");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.applyToSides), "c:applyToSides");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.applyToEnd), "c:applyToEnd");
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(toXml_ST_PictureFormat(this.pictureFormat)), "c:pictureFormat");
		writer.WriteXmlNullable(CT_Double.prototype.fromVal(this.pictureStackUnit), "c:pictureStackUnit");
		writer.WriteXmlNodeEnd(name);
	};

	CLegend.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "legendPos" : {
					this.setLegendPos(fromXml_ST_LegendPos(CT_StringStax.prototype.toVal(reader, this.legendPos), this.legendPos));
					break;
				}
				case "legendEntry" : {
					elem = new CLegendEntry();
					elem.fromXml(reader);
					this.addLegendEntry(elem);
					break;
				}
				case "layout" : {
					readLayout(reader, this);
					break;
				}
				case "overlay" : {
					this.setOverlay(CT_OnOff.prototype.toVal(reader, this.overlay));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CLegend.prototype.toXml = function (writer, name) {
		let layout = null;
		if (this.layout) {
			layout = new CT_XmlNode();
			layout.members["c:manualLayout"] = this.layout;
		}

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(toXml_ST_LegendPos(this.legendPos)), "c:legendPos");
		writer.WriteXmlArray(this.legendEntryes, "c:legendEntry");
		writer.WriteXmlNullable(layout, "c:layout");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.overlay), "c:overlay");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CLegendEntry.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "idx" : {
					this.setIdx(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.idx));
					break;
				}
				case "delete" : {
					this.setDelete(CT_OnOff.prototype.toVal(reader, this.delete));
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CLegendEntry.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.idx), "c:idx");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.delete), "c:delete");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};
//CT_PlotArea
	CPlotArea.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "layout" : {
					readLayout(reader, this);
					break;
				}
				case "area3DChart" : {
					elem = new AscFormat.CAreaChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "areaChart" : {
					elem = new AscFormat.CAreaChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "bar3DChart" : {
					elem = new AscFormat.CBarChart();
					elem.fromXml(reader);
					elem.set3D(true);
					this.addChart(elem);
					break;
				}
				case "barChart" : {
					elem = new AscFormat.CBarChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "bubbleChart" : {
					elem = new AscFormat.CBubbleChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "doughnutChart" : {
					elem = new AscFormat.CDoughnutChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "line3DChart" : {
					elem = new AscFormat.CLineChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "lineChart" : {
					elem = new AscFormat.CLineChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "pie3DChart" : {
					elem = new AscFormat.CPieChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "pieChart" : {
					elem = new AscFormat.CPieChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "radarChart" : {
					elem = new AscFormat.CRadarChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "scatterChart" : {
					elem = new AscFormat.CScatterChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "stockChart" : {
					elem = new AscFormat.CStockChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "surface3DChart" : {
					elem = new AscFormat.CSurfaceChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
				case "surfaceChart" : {
					elem = new AscFormat.CSurfaceChart();
					elem.fromXml(reader);
					this.addChart(elem);
					break;
				}
					// <xsd:choice minOccurs="0" maxOccurs="unbounded">
					// 	<xsd:element name="valAx" type="CT_ValAx" minOccurs="1" maxOccurs="1"/>
					// 	<xsd:element name="catAx" type="CT_CatAx" minOccurs="1" maxOccurs="1"/>
					// 	<xsd:element name="dateAx" type="CT_DateAx" minOccurs="1" maxOccurs="1"/>
					// 	<xsd:element name="serAx" type="CT_SerAx" minOccurs="1" maxOccurs="1"/>
					// </xsd:choice>
				case "dTable" : {
					elem = new AscFormat.CDTable();
					elem.fromXml(reader);
					this.setDTable(elem);
					break;
				}
				case "spPr" : {
					readSpPr(reader, this)
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CPlotArea.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.layout, "c:layout");
//todo Items
//todo Items1
		writer.WriteXmlNullable(this.dTable, "c:dTable");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CDTable.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "showHorzBorder" : {
					this.setShowHorzBorder(CT_OnOff.prototype.toVal(reader, this.showHorzBorder));
					break;
				}
				case "showVertBorder" : {
					this.setShowVertBorder(CT_OnOff.prototype.toVal(reader, this.showVertBorder));
					break;
				}
				case "showOutline" : {
					this.setShowOutline(CT_OnOff.prototype.toVal(reader, this.showOutline));
					break;
				}
				case "showKeys" : {
					this.setShowKeys(CT_OnOff.prototype.toVal(reader, this.showKeys));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CDTable.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showHorzBorder), "c:showHorzBorder");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showVertBorder), "c:showVertBorder");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showOutline), "c:showOutline");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showKeys), "c:showKeys");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CAreaChart.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "grouping" : {
					this.setGrouping(fromXml_ST_Grouping(CT_StringStax.prototype.toVal(reader, this.grouping), this.grouping));
					break;
				}
				case "varyColors" : {
					this.setVaryColors(CT_OnOff.prototype.toVal(reader, this.varyColors));
					break;
				}
				case "ser" : {
					elem = new AscFormat.CAreaSeries();
					elem.fromXml(reader);
					this.addSer(elem);
					break;
				}
				case "dLbls" : {
					this.CorrectDlbls(oNewVal);

					this.setDLbls(CT_DLbls.prototype.toVal(reader, this.dLbls));
					this.dLbls = CT_DLbls.prototype.toVal(reader, this.dLbls);
					elem = new CT_DLbls();
					elem.fromXml(reader);
					this.setDLbls(elem);
					break;
				}
				case "dropLines" : {
					this.setDropLines(CT_ChartLines.prototype.toVal(reader, this.dropLines));
					this.dropLines = CT_ChartLines.prototype.toVal(reader, this.dropLines);
					elem = new CT_ChartLines();
					elem.fromXml(reader);
					this.setDropLines(elem);
					break;
				}
				case "gapDepth" : {
					this.setGapDepth(CT_GapAmount.prototype.toVal(reader, this.gapDepth));
					this.gapDepth = CT_GapAmount.prototype.toVal(reader, this.gapDepth);
					elem = new CT_GapAmount();
					elem.fromXml(reader);
					this.setGapDepth(elem);
					break;
				}
				case "axId" : {
					elem = new CT_UnsignedInt();
					elem.fromXml(reader);
					this.axId.push(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CAreaChart.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.grouping, "c:grouping");
		writer.WriteXmlNullable(this.varyColors, "c:varyColors");
		writer.WriteXmlArray(this.ser, "c:ser");
		writer.WriteXmlNullable(this.dLbls, "c:dLbls");
		writer.WriteXmlNullable(this.dropLines, "c:dropLines");
		writer.WriteXmlNullable(this.gapDepth, "c:gapDepth");
		writer.WriteXmlArray(this.axId, "c:axId");
		writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CAreaSeries.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "idx" : {
					this.setIdx(CT_UnsignedInt.prototype.toVal(reader, this.idx));
					break;
				}
				case "order" : {
					this.setOrder(CT_UnsignedInt.prototype.toVal(reader, this.order));
					break;
				}
				case "tx" : {
					elem = new AscFormat.CTx();
					elem.fromXml(reader);
					this.setTx(elem);
					break;
				}
				case "spPr" : {
					readSpPr(reader, this)
					break;
				}
				case "pictureOptions" : {
					elem = new AscFormat.CPictureOptions();
					elem.fromXml(reader);
					this.setPictureOptions(elem);
					break;
				}
				case "dPt" : {
					elem = new AscFormat.CDPt();
					elem.fromXml(reader);
					this.addDPt(elem);
					break;
				}
				case "dLbls" : {
					elem = new AscFormat.CDLbls();
					elem.fromXml(reader);
					elem.correctValues();
					this.setDLbls(elem);
					break;
				}
				case "trendline" : {
					elem = new AscFormat.CTrendLine();
					elem.fromXml(reader);
					this.setTrendline(elem);
					break;
				}
				case "errBars" : {
					elem = new AscFormat.CErrBars();
					elem.fromXml(reader);
					this.setErrBars(elem);
					break;
				}
				case "cat" : {
					elem = new AscFormat.CCat();
					elem.fromXml(reader);
					this.setCat(elem);
					break;
				}
				case "val" : {
					elem = new AscFormat.CYVal();
					elem.fromXml(reader);
					this.setVal(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CAreaSeries.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.idx, "c:idx");
		writer.WriteXmlNullable(this.order, "c:order");
		writer.WriteXmlNullable(this.tx, "c:tx");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.pictureOptions, "c:pictureOptions");
		writer.WriteXmlArray(this.dPt, "c:dPt");
		writer.WriteXmlNullable(this.dLbls, "c:dLbls");
		writer.WriteXmlArray(this.trendline, "c:trendline");
		writer.WriteXmlArray(this.errBars, "c:errBars");
		writer.WriteXmlNullable(this.cat, "c:cat");
		writer.WriteXmlNullable(this.val, "c:val");
		writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CTx.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "strRef" : {
					elem = new AscFormat.CStrRef();
					elem.fromXml(reader);
					this.setStrRef(elem);
					break;
				}
				case "v" : {
					this.setVal(reader.GetTextDecodeXml());
					break;
				}
			}
		}
	};
	CTx.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(this.strRef, "c:strRef");
		writer.WriteXmlNullableValueStringEncode("c:v", this.val);
		writer.WriteXmlNodeEnd(name);
	};

	CDPt.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "idx" : {
					this.setIdx(CT_UnsignedInt.prototype.toVal(reader, this.idx));
					break;
				}
				case "invertIfNegative" : {
					this.setInvertIfNegative(CT_OnOff.prototype.toVal(reader, this.invertIfNegative));
					break;
				}
				case "marker" : {
					elem = new AscFormat.CMarker();
					elem.fromXml(reader);
					this.setMarker(elem);
					break;
				}
				case "bubble3D" : {
					this.setBubble3D(CT_OnOff.prototype.toVal(reader, this.bubble3D));
					break;
				}
				case "explosion" : {
					this.setExplosion(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.explosion));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "pictureOptions" : {
					elem = new AscFormat.CPictureOptions();
					elem.fromXml(reader);
					this.setPictureOptions(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CDPt.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.idx), "c:idx");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.invertIfNegative), "c:invertIfNegative");
		writer.WriteXmlNullable(this.marker, "c:marker");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.bubble3D), "c:bubble3D");
		writer.WriteXmlNullable(CT_UnsignedDecimalNumber.prototype.fromVal(this.explosion), "c:explosion");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.pictureOptions, "c:pictureOptions");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};
	CDLbls.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "dLbl" : {
					elem = new CDLbl();
					elem.fromXml(reader);
					elem.correctValues();
					this.addDLbl(elem);
					break;
				}
				case "dLblPos" : {
					this.setDLblPos(fromXml_ST_DLblPos(CT_StringStax.prototype.toVal(reader, this.dLblPos), this.dLblPos));
					break;
				}
				case "delete" : {
					this.setDelete(CT_OnOff.prototype.toVal(reader, this.delete));
					break;
				}
				case "leaderLines" : {
					elem = readChartLines(reader);
					this.setLeaderLines(elem || new AscFormat.CSpPr());
					break;
				}
				case "numFmt" : {
					elem = new AscFormat.CNumFmt();
					elem.fromXml(reader);
					this.setNumFmt(elem);
					break;
				}
				case "separator" : {
					this.setSeparator(reader.GetTextDecodeXml());
					break;
				}
				case "showBubbleSize" : {
					this.setShowBubbleSize(CT_OnOff.prototype.toVal(reader, this.showBubbleSize));
					break;
				}
				case "showCatName" : {
					this.setShowCatName(CT_OnOff.prototype.toVal(reader, this.showCatName));
					break;
				}
				case "showLegendKey" : {
					this.setShowLegendKey(CT_OnOff.prototype.toVal(reader, this.showLegendKey));
					break;
				}
				case "showPercent" : {
					this.setShowPercent(CT_OnOff.prototype.toVal(reader, this.showPercent));
					break;
				}
				case "showVal" : {
					this.setShowVal(CT_OnOff.prototype.toVal(reader, this.showVal));
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "txPr" : {
					readTxPr(reader, this);
					break;
				}
			}
		}
	};
	CDLbls.prototype.toXml = function (writer, name) {
		//todo sequence
		let leaderLines = null;
		if (this.leaderLines) {
			leaderLines = new CT_XmlNode();
			leaderLines.members["c:spPr"] = this.leaderLines;
		}

		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlArray(this.dLbl, "c:dLbl");
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(toXml_ST_DLblPos(this.dLblPos)), "c:dLblPos");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.delete), "c:delete");
		writer.WriteXmlNullable(leaderLines, "c:leaderLines");
		writer.WriteXmlNullable(this.numFmt, "c:numFmt");
		writer.WriteXmlNullableValueStringEncode("c:separator", this.separator);
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showBubbleSize), "c:showBubbleSize");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showCatName), "c:showCatName");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showLegendKey), "c:showLegendKey");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showPercent), "c:showPercent");
		writer.WriteXmlNullable(CT_OnOff.prototype.fromVal(this.showVal), "c:showVal");
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(this.txPr, "c:txPr");
// 		writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	CNumFmt.prototype.readAttr = function (reader) {
		while (reader.MoveToNextAttribute()) {
			switch (reader.GetNameNoNS()) {
				case "formatCode": {
					this.setFormatCode(reader.GetValueDecodeXml());
					break;
				}
				case "sourceLinked": {
					this.setSourceLinked(reader.GetValueBool());
					break;
				}
			}
		}
	};
	CNumFmt.prototype.fromXml = function (reader) {
		this.readAttr(reader);
		reader.ReadTillEnd();
	};
	CNumFmt.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlNullableAttributeStringEncode("c:formatCode", this.formatCode);
		writer.WriteXmlNullableAttributeBool("c:sourceLinked", this.sourceLinked);
		writer.WriteXmlAttributesEnd(true);
	};


	CTrendLine.prototype.fromXml = function (reader) {
		let elem, depth = reader.GetDepth();
		while (reader.ReadNextSiblingNode(depth)) {
			switch (reader.GetNameNoNS()) {
				case "name" : {
					this.setName(reader.GetTextDecodeXml());
					break;
				}
				case "spPr" : {
					readSpPr(reader, this);
					break;
				}
				case "trendlineType" : {
					this.setTrendlineType(fromXml_ST_TrendlineType(CT_StringStax.prototype.toVal(reader, this.trendlineType), this.trendlineType));
					break;
				}
				case "order" : {
					this.setOrder(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.order));
					break;
				}
				case "period" : {
					this.setPeriod(CT_UnsignedDecimalNumber.prototype.toVal(reader, this.order));
					break;
				}
				case "forward" : {
					this.setForward(CT_Double.prototype.toVal(reader, this.forward));
					break;
				}
				case "backward" : {
					this.setBackward(CT_Double.prototype.toVal(reader, this.backward));
					break;
				}
				case "intercept" : {
					this.setIntercept(CT_Double.prototype.toVal(reader, this.intercept));
					break;
				}
				case "dispRSqr" : {
					this.setDispRSqr(CT_OnOff.prototype.toVal(reader, this.dispRSqr));
					break;
				}
				case "dispEq" : {
					this.setDispEq(CT_OnOff.prototype.toVal(reader, this.dispEq));
					break;
				}
				case "trendlineLbl" : {
					elem = new AscFormat.CDLbl();
					elem.fromXml(reader);
					elem.correctValues();
					this.setTrendlineLbl(elem);
					break;
				}
				// case "extLst" : {
				// 	let subDepth = reader.GetDepth();
				// 	while (reader.ReadNextSiblingNode(subDepth)) {
				// 		if ("ext" === reader.GetNameNoNS()) {
				// 			elem = new CT_Extension();
				// 			elem.fromXml(reader);
				// 			this.extLst.push(elem);
				// 		}
				// 	}
				// 	break;
				// }
			}
		}
	};
	CTrendLine.prototype.toXml = function (writer, name) {
		writer.WriteXmlNodeStart(name);
		writer.WriteXmlAttributesEnd();
		writer.WriteXmlNullableValueStringEncode("c:name", this.name);
		writer.WriteXmlNullable(this.spPr, "c:spPr");
		writer.WriteXmlNullable(CT_StringStax.prototype.fromVal(toXml_ST_TrendlineType(this.trendlineType)), "c:trendlineType");
		writer.WriteXmlNullable(this.order, "c:order");
		writer.WriteXmlNullable(this.period, "c:period");
		writer.WriteXmlNullable(this.forward, "c:forward");
		writer.WriteXmlNullable(this.backward, "c:backward");
		writer.WriteXmlNullable(this.intercept, "c:intercept");
		writer.WriteXmlNullable(this.dispRSqr, "c:dispRSqr");
		writer.WriteXmlNullable(this.dispEq, "c:dispEq");
		writer.WriteXmlNullable(this.trendlineLbl, "c:trendlineLbl");
		// writer.WriteXmlArray(this.extLst, "c:extLst");
		writer.WriteXmlNodeEnd(name);
	};

	function readSpPrPlain(reader) {
		//todo
		let elem = new AscFormat.CSpPr();
		elem.fromXml(reader);
		return elem;
	}
	function readSpPr(reader, parent) {
		let elem = readSpPrPlain(reader);
		elem.setParent(parent);
		parent.setSpPr(elem);
	}
	function readTxPr(reader, parent) {
		//todo
		let elem = new AscFormat.CTextBody();
		elem.fromXml(reader);
		elem.setParent(parent);
		parent.setTxPr(elem);
	}
	function readLayout(reader, parent) {
		let elem = new CT_XmlNode(function(reader, name) {
			if ("manualLayout" === name) {
				var layout = new AscFormat.CLayout();
				layout.fromXml(reader);
				return layout;
			}
		});
		elem.fromXml(reader);
		if (elem.members["manualLayout"]) {
			parent.setLayout(elem.members["manualLayout"]);
		}
	}
	function readChartLines(reader) {
		let elem = new CT_XmlNode(function(reader, name) {
			if ("spPr" === name) {
				return readSpPrPlain(reader);
			}
		});
		elem.fromXml(reader);
		return elem.members["spPr"];
	}

	function fromXml_ST_PageSetupOrientation(val, def) {
		switch (val) {
			case "default":
				return AscFormat.PAGE_SETUP_ORIENTATION_DEFAULT;
			case "portrait":
				return AscFormat.PAGE_SETUP_ORIENTATION_PORTRAIT;
			case "landscape":
				return AscFormat.PAGE_SETUP_ORIENTATION_LANDSCAPE;
		}
		return def;
	}
	function toXml_ST_PageSetupOrientation(val) {
		switch (val) {
			case AscFormat.PAGE_SETUP_ORIENTATION_DEFAULT:
				return "default";
			case AscFormat.PAGE_SETUP_ORIENTATION_PORTRAIT:
				return "portrait";
			case AscFormat.PAGE_SETUP_ORIENTATION_LANDSCAPE:
				return "landscape";
		}
		return null;
	}
	function fromXml_ST_MarkerStyle(val, def) {
		switch (val) {
			case "circle":
				return AscFormat.SYMBOL_CIRCLE;
			case "dash":
				return AscFormat.SYMBOL_DASH;
			case "diamond":
				return AscFormat.SYMBOL_DIAMOND;
			case "dot":
				return AscFormat.SYMBOL_DOT;
			case "none":
				return AscFormat.SYMBOL_NONE;
			case "picture":
				return AscFormat.SYMBOL_PICTURE;
			case "plus":
				return AscFormat.SYMBOL_PLUS;
			case "square":
				return AscFormat.SYMBOL_SQUARE;
			case "star":
				return AscFormat.SYMBOL_STAR;
			case "triangle":
				return AscFormat.SYMBOL_TRIANGLE;
			case "x":
				return AscFormat.SYMBOL_X;
			case "auto":
				return null;
		}
		return def;
	}
	function toXml_ST_MarkerStyle(val) {
		switch (val) {
			case AscFormat.SYMBOL_CIRCLE:
				return "circle";
			case AscFormat.SYMBOL_DASH:
				return "dash";
			case AscFormat.SYMBOL_DIAMOND:
				return "diamond";
			case AscFormat.SYMBOL_DOT:
				return "dot";
			case AscFormat.SYMBOL_NONE:
				return "none";
			case AscFormat.SYMBOL_PICTURE:
				return "picture";
			case AscFormat.SYMBOL_PLUS:
				return "plus";
			case AscFormat.SYMBOL_SQUARE:
				return "square";
			case AscFormat.SYMBOL_STAR:
				return "star";
			case AscFormat.SYMBOL_TRIANGLE:
				return "triangle";
			case AscFormat.SYMBOL_X:
				return "x";
			// case null:
			// 	return "auto";
		}
		return null;
	}
	function fromXml_ST_PictureFormat(val, def) {
		switch (val) {
			case "stretch":
				return AscFormat.PICTURE_FORMAT_STACK_STRETCH;
			case "stack":
				return AscFormat.PICTURE_FORMAT_STACK;
			case "stackScale":
				return AscFormat.PICTURE_FORMAT_STACK_SCALE;
		}
		return def;
	}
	function toXml_ST_PictureFormat(val) {
		switch (val) {
			case AscFormat.PICTURE_FORMAT_STACK_STRETCH:
				return "stretch";
			case AscFormat.PICTURE_FORMAT_STACK:
				return "stack";
			case AscFormat.PICTURE_FORMAT_STACK_SCALE:
				return "stackScale";
		}
		return null;
	}
	function fromXml_ST_LegendPos(val, def) {
		switch (val) {
			case "b":
				return Asc.c_oAscChartLegendShowSettings.bottom;
			case "tr":
				return Asc.c_oAscChartLegendShowSettings.topRight;
			case "l":
				return Asc.c_oAscChartLegendShowSettings.left;
			case "r":
				return Asc.c_oAscChartLegendShowSettings.right;
			case "t":
				return Asc.c_oAscChartLegendShowSettings.top;
		}
		return def;
	}
	function toXml_ST_LegendPos(val) {
		switch (val) {
			case Asc.c_oAscChartLegendShowSettings.bottom:
				return "b";
			case Asc.c_oAscChartLegendShowSettings.topRight:
				return "tr";
			case Asc.c_oAscChartLegendShowSettings.left:
				return "l";
			case Asc.c_oAscChartLegendShowSettings.right:
				return "r";
			case Asc.c_oAscChartLegendShowSettings.top:
				return "t";
		}
		return null;
	}
	function fromXml_ST_DispBlanksAs(val, def) {
		switch (val) {
			case "span":
				return AscFormat.DISP_BLANKS_AS_SPAN;
			case "gap":
				return AscFormat.DISP_BLANKS_AS_GAP;
			case "zero":
				return AscFormat.DISP_BLANKS_AS_ZERO;
		}
		return def;
	}
	function toXml_ST_DispBlanksAs(val) {
		switch (val) {
			case AscFormat.DISP_BLANKS_AS_SPAN:
				return "span";
			case AscFormat.DISP_BLANKS_AS_GAP:
				return "gap";
			case AscFormat.DISP_BLANKS_AS_ZERO:
				return "zero";
		}
		return null;
	}
	function fromXml_ST_DLblPos(val, def) {
		switch (val) {
			case "bestFit":
				return Asc.c_oAscChartDataLabelsPos.bestFit;
			case "b":
				return Asc.c_oAscChartDataLabelsPos.b;
			case "ctr":
				return Asc.c_oAscChartDataLabelsPos.ctr;
			case "inBase":
				return Asc.c_oAscChartDataLabelsPos.inBase;
			case "inEnd":
				return Asc.c_oAscChartDataLabelsPos.inEnd;
			case "l":
				return Asc.c_oAscChartDataLabelsPos.l;
			case "outEnd":
				return Asc.c_oAscChartDataLabelsPos.outEnd;
			case "r":
				return Asc.c_oAscChartDataLabelsPos.r;
			case "t":
				return Asc.c_oAscChartDataLabelsPos.t;
		}
		return def;
	}
	function toXml_ST_DLblPos(val) {
		switch (val) {
			case Asc.c_oAscChartDataLabelsPos.bestFit:
				return "bestFit";
			case Asc.c_oAscChartDataLabelsPos.b:
				return "b";
			case Asc.c_oAscChartDataLabelsPos.ctr:
				return "ctr";
			case Asc.c_oAscChartDataLabelsPos.inBase:
				return "inBase";
			case Asc.c_oAscChartDataLabelsPos.inEnd:
				return "inEnd";
			case Asc.c_oAscChartDataLabelsPos.l:
				return "l";
			case Asc.c_oAscChartDataLabelsPos.outEnd:
				return "outEnd";
			case Asc.c_oAscChartDataLabelsPos.r:
				return "r";
			case Asc.c_oAscChartDataLabelsPos.t:
				return "t";
		}
		return null;
	}
	function fromXml_ST_TrendlineType(val, def) {
		switch (val) {
			case "exp":
				return AscFormat.TRENDLINE_TYPE_EXP;
			case "linear":
				return AscFormat.TRENDLINE_TYPE_LINEAR;
			case "log":
				return AscFormat.TRENDLINE_TYPE_LOG;
			case "movingAvg":
				return AscFormat.TRENDLINE_TYPE_MOVING_AVG;
			case "poly":
				return AscFormat.TRENDLINE_TYPE_POLY;
			case "power":
				return AscFormat.TRENDLINE_TYPE_POWER;
		}
		return def;
	}
	function toXml_ST_TrendlineType(val) {
		switch (val) {
			case AscFormat.TRENDLINE_TYPE_EXP:
				return "exp";
			case AscFormat.TRENDLINE_TYPE_LINEAR:
				return "linear";
			case AscFormat.TRENDLINE_TYPE_LOG:
				return "log";
			case AscFormat.TRENDLINE_TYPE_MOVING_AVG:
				return "movingAvg";
			case AscFormat.TRENDLINE_TYPE_POLY:
				return "poly";
			case AscFormat.TRENDLINE_TYPE_POWER:
				return "power";
		}
		return null;
	}
})(window);
