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

(
	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function (window, undefined) {

		let CBaseId = AscFormat.CBaseFormatObject;
		let CBaseNoId = AscFormat.CBaseNoIdObject;
		let IC = AscFormat.InitClass;

		function CVMLDrawing() {
			CBaseNoId.call(this);
			this.items =[]
		}
		IC(CVMLDrawing, CBaseNoId, 0);

		CVMLDrawing.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CVMLDrawing.prototype.readChildXml = function (name, reader) {
			let oItem;
			if ("arc" === name ) {
				oItem = new CArc();
			}
			if ("curve" === name ) {
				oItem = new CCurve();
			}
			if ("group" === name ) {
				oItem = new CGroup();
			}
			if ("image" === name ) {
				oItem = new CImage();
			}
			if ("line" === name ) {
				oItem = new CLine();
			}
			if ("oval" === name ) {
				oItem = new COval();
			}
			if ("polyline" === name ) {
				oItem = new CPolyLine();
			}
			if ("rect" === name ) {
				oItem = new CRect();
			}
			if ("roundrect" === name ) {
				oItem =  new CRoundRect();
			}
			if ("shape" === name ) {
				oItem = new CShape();
			}
			if ("shapetype" === name ) {
				oItem = new CShapeType();
			}
			if(oItem) {
				oItem.fromXml(reader);
				this.items.push(oItem);
			}
		};
		CVMLDrawing.prototype.writeChildren = function (writer) {
		};


		let shemeDefaultColor =
			[
				0x00000000,	0x00FFFFFF,	0x00FF0000,	0x0000FF00,	0x000000FF,	0x00FFFF00,	0x00FF00FF,	0x0000FFFF,
				0x00000000,	0x00FFFFFF,	0x00FF0000,	0x0000FF00,	0x000000FF,	0x00FFFF00,	0x00FF00FF,	0x0000FFFF,
				0x00800000,	0x00008000,	0x00000080,	0x00808000,	0x00800080,	0x00008080,	0x00C0C0C0,	0x00808080,
				0x009999FF,	0x00993366,	0x00FFFFCC,	0x00CCFFFF,	0x00660066,	0x00FF8080,	0x000066CC,	0x00CCCCFF,
				0x00000080,	0x00FF00FF,	0x00FFFF00,	0x0000FFFF,	0x00800080,	0x00800000,	0x00008080,	0x000000FF,
				0x0000CCFF,	0x00CCFFFF,	0x00CCFFCC,	0x00FFFF99,	0x0099CCFF,	0x00FF99CC,	0x00CC99FF,	0x00FFCC99,
				0x003366FF,	0x0033CCCC,	0x0099CC00,	0x00FFCC00,	0x00FF9900,	0x00FF6600,	0x00666699,	0x00969696,
				0x00003366,	0x00339966,	0x00003300,	0x00333300,	0x00993300,	0x00993366,	0x00333399,	0x00333333
			];
		let controlPanelColors2 =
			[
				0x00000000,	0x00FFFFFF,	0x00000000,	0x00FFFFFF,
				0x00000000,	0x00000000,	0x00000000,	0x00FFFFFF,
				0x00FFFFFF,	0x00000000,	0x00FFFFFF,	0x00FFFFFF,
				0x00000000,	0x00000000,	0x00000000,	0x00000000,
				0x00FFFFFF,	0x00FFFFFF,	0x00FFFFFF,	0x00000000,
				0x00FFFFFF,	0x00000000,	0x00000000,	0x00000000,
				0x00000000,	0x00000000,	0x00FFFFFF,	0x00FFFFFF
			];
		let controlPanelColors1 =
			[
				0x00FFFFFF,	0x00CCCCCC,	0x00FFFFFF,	0x006363CE,
				0x00DDDDDD,	0x00DDDDDD,	0x00888888,	0x00000000,
				0x00000000,	0x00808080,	0x00B5D5FF,	0x00000000,
				0x00FFFFFF,	0x00FFFFFF,	0x007F7F7F,	0x00FBFCC5,
				0x00000000,	0x00F7F7F7,	0x00000000,	0x00FFFFFF,
				0x00666666,	0x00C0C0C0,	0x00DDDDDD,	0x00C0C0C0,
				0x00888888,	0x00FFFFFF,	0x00CCCCCC,	0x00000000
			];

	let EColorType = {
		colortypeNone: 0,
		colortypeRGB: 1,
		colortypeAqua: 2,
		colortypeBlack: 3,
		colortypeBlue: 4,
		colortypeFuchsia: 5,
		colortypeGray: 6,
		colortypeGreen: 7,
		colortypeLime: 8,
		colortypeMaroon: 9,
		colortypeNavy: 10,
		colortypeOlive: 11,
		colortypePurple: 12,
		colortypeRed: 13,
		colortypeSilver: 14,
		colortypeTeal: 15,
		colortypeWhite: 16,
		colortypeYellow: 17
	};


		function CColor(sVal) {
			this.val = EColorType.colortypeRGB;
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.fromString(sVal);
		}
		CColor.prototype.fromString = function(sVal) {
			if(sVal.charAt(0) === '#') {
				this.byHexColor(sVal)
			}
			else {
				this.byColorName(sVal);
			}
		};
		CColor.prototype.setRGB = function() {

			if (this.type === EColorType.colortypeRGB) return;

			switch(this.type)
			{
			case EColorType.colortypeAqua:
			{
				this.r = 0x00;
				this.g = 0xff;
				this.b = 0xff;
			}break;
			case EColorType.colortypeBlack:
			{
				this.r = 0x00;
				this.g = 0x00;
				this.b = 0x00;
			}break;
			case EColorType.colortypeBlue:
			{
				this.r = 0x00;
				this.g = 0x00;
				this.b = 0xff;
			}break;
			case EColorType.colortypeFuchsia:
			{
				this.r = 0xff;
				this.g = 0x00;
				this.b = 0xff;
			}break;
			case EColorType.colortypeGray:
			{
				this.r = 0x80;
				this.g = 0x80;
				this.b = 0x80;
			}break;
			case EColorType.colortypeGreen:
			{
				this.r = 0x00;
				this.g = 0x80;
				this.b = 0x00;
			}break;
			case EColorType.colortypeLime:
			{
				this.r = 0x00;
				this.g = 0xff;
				this.b = 0x00;
			}break;
			case EColorType.colortypeMaroon:
			{
				this.r = 0x80;
				this.g = 0x00;
				this.b = 0x00;
			}break;
			case EColorType.colortypeNavy:
			{
				this.r = 0x00;
				this.g = 0x00;
				this.b = 0x80;
			}break;
			case EColorType.colortypeOlive:
			{
				this.r = 0x80;
				this.g = 0x80;
				this.b = 0x00;
			}break;
			case EColorType.colortypePurple:
			{
				this.r = 0x80;
				this.g = 0x00;
				this.b = 0x80;
			}break;
			case EColorType.colortypeRed:
			{
				this.r = 0xff;
				this.g = 0x00;
				this.b = 0x00;
			}break;
			case EColorType.colortypeSilver:
			{
				this.r = 0xc0;
				this.g = 0xc0;
				this.b = 0xc0;
			}break;
			case EColorType.colortypeTeal:
			{
				this.r = 0x00;
				this.g = 0x80;
				this.b = 0x80;
			}break;
			case EColorType.colortypeWhite:
			{
				this.r = 0xff;
				this.g = 0xff;
				this.b = 0xff;
			}break;
			case EColorType.colortypeYellow:
			{
				this.r = 0xff;
				this.g = 0xff;
				this.b = 0;
			}break;
			case EColorType.colortypeNone:
				default:
				{
					this.r = 0;
					this.g = 0;
					this.b = 0;
				}break;
			}
		};
		CColor.prototype.byHexColor = function(sVal) {
			this.type = EColorType.colortypeRGB;
			let nColor = parseInt(sVal.slice(1));
			this.r = (nColor >> 16) & 0xFF;
			this.g = (nColor >> 8) & 0xFF;
			this.b = nColor & 0xFF;
		};
		CColor.prototype.byColorName = function(sVal) {
			this.type = EColorType.colortypeNone;

			if(sVal.indexOf("aqua") > -1) this.type = EColorType.colortypeAqua;
		else if(sVal.indexOf("black") > -1) this.type = EColorType.colortypeBlack;
		else if(sVal.indexOf("blue") > -1) this.type = EColorType.colortypeBlue;
		else if(sVal.indexOf("fuchsia") > -1) this.type = EColorType.colortypeFuchsia;
		else if(sVal.indexOf("gray") > -1) this.type = EColorType.colortypeGray;
		else if(sVal.indexOf("green") > -1) this.type = EColorType.colortypeGreen;
		else if(sVal.indexOf("lime") > -1) this.type = EColorType.colortypeLime;
		else if(sVal.indexOf("maroon") > -1) this.type = EColorType.colortypeMaroon;
		else if(sVal.indexOf("navy") > -1) this.type = EColorType.colortypeNavy;
		else if(sVal.indexOf("olive") > -1) this.type = EColorType.colortypeOlive;
		else if(sVal.indexOf("purple") > -1) this.type = EColorType.colortypePurple;
		else if(sVal.indexOf("red") > -1) this.type = EColorType.colortypeRed;
		else if(sVal.indexOf("silver") > -1) this.type = EColorType.colortypeSilver;
		else if(sVal.indexOf("teal") > -1) this.type = EColorType.colortypeTeal;
		else if(sVal.indexOf("white") > -1) this.type = EColorType.colortypeWhite;
		else if(sVal.indexOf("yellow") > -1) this.type = EColorType.colortypeYellow;
		else if(sVal.indexOf("[") > -1 && sVal.indexOf("]") > -1)
			{
				let p1 = sVal.indexOf("[");
				let p2 = sVal.indexOf("]");
				let sIndex = p2 > p1 ? sVal.substr(p1 + 1, p2 - p1 - 1) : "";

				if (sIndex.length > 0)
				{
					let index = parseInt(sIndex);
					let nRGB = 0;
					if (index < 64)
					{
						nRGB = shemeDefaultColor[index];
					}
					else if (index > 64 && index < 92)
					{
						nRGB = controlPanelColors1[index - 65];
					}
					this.r = ((nRGB >> 16) & 0xff);
					this.g = ((nRGB >> 8) & 0xff);
					this.b = (nRGB & 0xff);
					this.type  = EColorType.colortypeRGB;
				}
			}

			this.setRGB();

		};


		function CVmlVector2D(sVal) {
			this.x = 0;
			this.y = 0;

			if(sVal){
				this.fromString(sVal);
			}
		}
		CVmlVector2D.prototype.fromString = function (sValue) {
			let nLen = sValue.length;
			if ( nLen <= 0 )
				return 0;

			let nPos = sValue.indexOf(",");
			let strX, strY;
			if ( -1 === nPos ) {//only x coord
				strX = sValue;
			}
			else {
				strX = sValue.substr( 0, nPos );
				strY = sValue.substr( nPos + 1, nLen - nPos - 1 ) ;
			}
			strY.replace("@", "");
			strX.replace("@", "");
			this.x = strX.length === 0 ? 0 : parseInt(strX);
			this.y = strY.length === 0 ? 0 : parseInt(strY);
			return 0;
		};

		function CVmlPolygon2D(sVal) {
			this.pts = [];
			if(sVal) {
				this.fromString(sVal)
			}
		}
		CVmlPolygon2D.prototype.fromString = function (sValue) {
			this.pts.length = 0;

			let nLen = sValue.length;
			if ( nLen <= 0 )
				return 0;

			let nStartPos = 0;
			while ( true )
			{
				let nMidPos = sValue.indexOf(",", nStartPos );
				let nEndPos = sValue.indexOf(",", nMidPos + 1 );

				if ( -1 === nMidPos )
					break;

				if ( -1 === nEndPos )
					nEndPos = nLen;

				let strX = sValue.substr( nStartPos, nMidPos - nStartPos );
				let strY = sValue.substr( nStartPos, nMidPos - nStartPos );

				strX.replace("@", "");
				strY.replace("@", "");

				let nX = strX.length === 0 ? 0 : parseInt(strX);
				let nY = strY.length === 0 ? 0 : parseInt(strY);

				let oPr = new CVmlVector2D();
				oPr.x = nX;
				oPr.y = nY;
				this.pts.push(oPr);
				nStartPos = nEndPos + 1;
			}


			return 0;
		};



		let EInsetMode =
		{
			insetmodeAuto   : 0,
			insetmodeCustom : 1
		};



		//--------------------------------------------------------------------------------
		let  EBWMode =
		{
			bwmodeAuto					: 0,
				bwmodeBlack             : 1,
				bwmodeBlackTextAndLines : 2,
				bwmodeColor             : 3,
				bwmodeGrayOutline       : 4,
				bwmodeGrayScale         : 5,
				bwmodeHide				: 6,
				bwmodeHighContrast      : 7,
				bwmodeInverseGray       : 8,
				bwmodeLightGrayscale    : 9,
				bwmodeUndrawn           : 10,
				bwmodeWhite             : 11
		};

		function CVmlCommonElements() {
			CBaseNoId.call(this);
			// 1 AG_AllCoreAttributes
			// 1.1 AG_CoreAttributes
			this.m_sId = null;
			this.m_oStyle = null;
			this.m_sHref = null;
			this.m_sTarget = null;
			this.m_sClass = null;
			this.m_sTitle = null;
			this.m_sAlt = null;
			this.m_oCoordSize = null;
			this.m_oCoordOrigin = null;
			this.m_oWrapCoords = null;
			this.m_oPrint = null;
			// 1.2 AG_OfficeCoreAttributes
			this.m_sSpId = null;
			this.m_oOned = null;
			this.m_oRegroupId = null;
			this.m_oDoubleClickNotify = null;
			this.m_oButton = null;
			this.m_oUserHidden = null;
			this.m_oBullet = null;
			this.m_oHr = null;
			this.m_oHrStd = null;
			this.m_oHrNoShade = null;
			this.m_oHrPct = null;
			this.m_oHrAlign = null;
			this.m_oAllowInCell = null;
			this.m_oAllowOverlap = null;
			this.m_oUserDrawn = null;
			this.m_oBorderTopColor = null;
			this.m_oBorderLeftColor = null;
			this.m_oBorderBottomColor = null;
			this.m_oBorderRightColor = null;
			this.m_oDgmLayout = null;
			this.m_oDgmNodeKind = null;
			this.m_oDgmLayoutMru = null;
			this.m_oInsetMode = null;
			// 2 AG_AllShapeAttributes
			// 2.1 AG_ShapeAttributes
			this.m_oChromaKey = null;
			this.m_oFilled = null;
			this.m_oFillColor = null;
			this.m_oOpacity = null;
			this.m_oStroked = null;
			this.m_oStrokeColor = null;
			this.m_oStrokeWeight = null;
			this.m_oInsetPen = null;
			// 2.2 AG_OfficeShapeAttributes
			this.m_oSpt = null;
			this.m_oConnectorType = null;
			this.m_oBwMode = null;
			this.m_oBwPure = null;
			this.m_oBwNormal = null;
			this.m_oForceDash = null;
			this.m_oOleIcon = null;
			this.m_oOle = null;
			this.m_oPreferRelative = null;
			this.m_oClipToWrap = null;
			this.m_oClip = null;

		}
		IC(CVmlCommonElements, CBaseNoId, 0);

		CVmlCommonElements.prototype.readColor = function (reader) {
			return new CColor(reader.GetValue());
		};
		CVmlCommonElements.prototype.readVector2D = function (reader) {
			return new CVmlVector2D(reader.GetValue());
		};
		CVmlCommonElements.prototype.readPolygon2D = function (reader) {
			return new CVmlPolygon2D(reader.GetValue());
		};
		CVmlCommonElements.prototype.readBWMode = function (reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "auto": {
					return EBWMode.bwmodeAuto;
					break;
				}
				case "black": {
					return EBWMode.bwmodeBlack;
					break;
				}
				case "blackTextAndLines": {
					return EBWMode.bwmodeBlackTextAndLines;
					break;
				}
				case "color": {
					return EBWMode.bwmodeColor;
					break;
				}
				case "grayOutline": {
					return EBWMode.bwmodeGrayOutline;
					break;
				}
				case "grayScale": {
					return EBWMode.bwmodeGrayScale;
					break;
				}
				case "hide": {
					return EBWMode.bwmodeHide;
					break;
				}
				case "highContrast": {
					return EBWMode.bwmodeHighContrast;
					break;
				}
				case "inverseGray": {
					return EBWMode.bwmodeInverseGray;
					break;
				}
				case "lightGrayscale": {
					return EBWMode.bwmodeLightGrayscale;
					break;
				}
				case "undrawn": {
					return EBWMode.bwmodeUndrawn;
					break;
				}
				case "white": {
					return EBWMode.bwmodeWhite;
					break;
				}
			}
			return null;
		};
		CVmlCommonElements.prototype.readAttrXml = function (name, reader) {
			if ("alt" === name ) this.m_sAlt = reader.GetValue();
			else if ("chromakey" === name ) this.m_oChromaKey = this.readColor(reader);
			else if ("class" === name) this.m_sClass = reader.GetValue();
			else if ("coordorigin" === name ) this.m_oCoordOrigin = this.readVector2D(reader);
			else if ("coordsize" === name ) this.m_oCoordSize = this.readVector2D(reader);
			else if ("fillcolor" === name ) this.m_oFillColor = this.readColor(reader);
			else if ("filled" === name ) this.m_oFilled = reader.GetValueBool();
			else if ("href" === name ) this.m_sHref = reader.GetValue();
			else if ("id" === name ) this.m_sId = reader.GetValue();
			else if ("insetpen" === name ) this.m_oInsetPen = reader.GetValueBool();
			else if ("allowincell" === name ) this.m_oAllowInCell = reader.GetValueBool();
			else if ("allowoverlap" === name ) this.m_oAllowOverlap = reader.GetValueBool();
			else if ("opacity" === name ) {
				let sValue =  reader.GetValue();
				let nLen = sValue.length;
				if ( nLen <= 0 )
					return 0;

				let bFraction = ( 'f' === sValue.charAt(nLen - 1) );

				if ( bFraction )
				{
					let strValue = sValue.substr( 0, nLen - 1 );
					let nValue = strValue.empty() ? 0 : _wtoi(strValue.c_str() );

					this.m_oOpacity = Math.max( 0.0, Math.min( 65536.0, dValue) )/ 65536.0;
				}
				else
				{
					let dValue = sValue.length === 0 ? 0 : parseFloat( sValue );
					this.m_oOpacity = Math.max( 0.0, Math.min( 1.0, dValue) );
				}
			}
			else if ("borderbottomcolor" === name ) this.m_oBorderBottomColor = this.readColor(reader);
			else if ("borderleftcolor" === name ) this.m_oBorderLeftColor = this.readColor(reader);
			else if ("borderrightcolor" === name) this.m_oBorderRightColor = this.readColor(reader);
			else if ("bordertopcolor" === name) this.m_oBorderTopColor = this.readColor(reader);
			else if ("bullet" === name) this.m_oBullet = reader.GetValueBool();
			else if ("button" === name) this.m_oButton = reader.GetValueBool();
			else if ("bwmode" === name) this.m_oBwMode = this.readBWMode(reader);
			else if ("bwnormal" === name) this.m_oBwNormal = this.readBWMode(reader);
			else if ("bwpure" === name) this.m_oBwPure = this.readBWMode(reader);
			else if ("clip" === name) this.m_oClip = reader.GetValueBool();
			else if ("cliptowrap" === name) this.m_oClipToWrap = reader.GetValueBool();
			else if ("connectortype" === name) this.m_oConnectorType = reader.GetValue();
			else if ("doubleclicknotify" === name) this.m_oDoubleClickNotify = reader.GetValueBool();
			else if ("dgmlayout" === name) this.m_oDgmLayout = reader.GetValueInt();
			else if ("dgmlayoutmru" === name) this.m_oDgmLayoutMru = reader.GetValueInt();
			else if ("dgmnodekind" === name) this.m_oDgmNodeKind = reader.GetValue();
			else if ("forcedash" === name) this.m_oForceDash = reader.GetValueBool();
			else if ("hr" === name) this.m_oHr = reader.GetValueBool();
			else if ("hralign" === name) {
				let sVal = reader.GetValue();
				switch (sVal) {
					case "center": {
						this.m_oHrAlign = AscCommon.align_Center;
						break;
					}
					case "left": {
						this.m_oHrAlign = AscCommon.align_Left;
						break;
					}
					case "right": {
						this.m_oHrAlign = AscCommon.align_Right;
						break;
					}
				}
			}
			else if ("hrnoshade" === name) this.m_oHrNoShade = reader.GetValueBool();
			else if ("hrpct" === name) this.m_oHrPct = reader.GetValueDouble();
			else if ("hrstd" === name) this.m_oHrStd = reader.GetValueBool();
			else if ("insetmode" === name) {
				let sVal = reader.GetValue()
				switch (sVal) {
					case "auto": {
						this.m_oInsetMode = EInsetMode.insetmodeAuto;
						break;
					}
					case "custom": {
						this.m_oInsetMode = EInsetMode.insetmodeCustom;
						break;
					}
				}
			}
			else if ("ole" === name) this.m_oOle = reader.GetValueBool();
			else if ("oleicon" === name) this.m_oOleIcon = reader.GetValueBool();
			else if ("oned" === name) this.m_oOned = reader.GetValueBool();
			else if ("preferrelative" === name) this.m_oPreferRelative = reader.GetValueBool();
			else if ("regroupid" === name) this.m_oRegroupId = reader.GetValueInt();
			else if ("spid" === name) this.m_sSpId = reader.GetValue();
			else if ("spt" === name) this.m_oSpt = reader.GetValueInt();
			else if ("userdrawn" === name) this.m_oUserDrawn = reader.GetValueBool();
			else if ("userhidden" === name) this.m_oUserHidden = reader.GetValueBool();
			else if ("print" === name) this.m_oPrint = reader.GetValueBool();
			else if ("strokecolor" === name) this.m_oStrokeColor = this.readColor(reader);
			else if ("stroked" === name) this.m_oStroked = reader.GetValueBool();
			else if ("strokeweight" === name) this.m_oStrokeWeight = reader.GetValueInt();
			else if ("style" === name) this.m_oStyle = reader.GetValue();
			else if ("target" === name) this.m_sTarget = reader.GetValue();
			else if ("title" === name) this.m_sTitle = reader.GetValue();
			else if ("wrapcoords" === name) this.m_oWrapCoords = this.readPolygon2D(reader);
		};
		CArc.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CArc.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CArc.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CArc() {
			CBaseNoId.call(this);
		}
		IC(CArc, CVmlCommonElements, 0);

		CArc.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CArc.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CArc.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CArc.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CCurve() {
			CBaseNoId.call(this);
		}
		IC(CCurve, CVmlCommonElements, 0);

		CCurve.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CCurve.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CCurve.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CCurve.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CGroup() {
			CBaseNoId.call(this);
		}
		IC(CGroup, CVmlCommonElements, 0);

		CGroup.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CGroup.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CGroup.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CGroup.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CImage() {
			CBaseNoId.call(this);
		}
		IC(CImage, CVmlCommonElements, 0);

		CImage.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CImage.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CImage.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CImage.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CLine() {
			CBaseNoId.call(this);
		}
		IC(CLine, CVmlCommonElements, 0);

		CLine.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CLine.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CLine.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CLine.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function COval() {
			CBaseNoId.call(this);
		}
		IC(COval, CVmlCommonElements, 0);

		COval.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		COval.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		COval.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		COval.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CPolyLine() {
			CBaseNoId.call(this);
		}
		IC(CPolyLine, CVmlCommonElements, 0);

		CPolyLine.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CPolyLine.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CPolyLine.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CPolyLine.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CRect() {
			CBaseNoId.call(this);
		}
		IC(CRect, CVmlCommonElements, 0);

		CRect.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CRect.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CRect.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CRect.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CRoundRect() {
			CBaseNoId.call(this);
		}
		IC(CRoundRect, CVmlCommonElements, 0);

		CRoundRect.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CRoundRect.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CRoundRect.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CRoundRect.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CShape() {
			CBaseNoId.call(this);
		}
		IC(CShape, CVmlCommonElements, 0);

		CShape.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CShape.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CShape.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CShape.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CShapeType() {
			CBaseNoId.call(this);
		}
		IC(CShapeType, CVmlCommonElements, 0);

		CShapeType.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CShapeType.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CShapeType.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CShapeType.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};



	})(window);