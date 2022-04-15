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

		function CVml_Vector3D_65536(sVal) {
			this.m_nX;
			this.m_nY;
			this.m_nZ;
			if(sVal) {
				this.fromString(sVal);
			}
		}
		CVml_Vector3D_65536.prototype.fromString = function(sValue) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;

			let nLen = sValue.length;
			if ( nLen <= 0 )
				return 0;

			let nPos = sValue.indexOf(",");
			if ( -1 === nPos )
			{//only x position
				let strX = sValue;
				strX.replace("@", "");

				this.m_nX = strX.length === 0 ? 0 : parseInte(strX);
				return 0;
			}
			let strX = sValue.substr( 0, nPos );
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);

			let nPos2 = sValue.indexOf( ",", nPos + 1 );
			if ( -1 === nPos2 )
			{// only x, y position
				let strY = sValue.substr( nPos + 1);
				strY.replace("@", "");
				this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
				return 0;
			}

			let strY = sValue.substr( nPos + 1, nPos2 - nPos - 1);
			let strZ = sValue.substr( nPos2 + 1, nLen - nPos2 - 1 ) ;

			strY.replace("@", "");
			strZ.replace("@", "");

			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
			this.m_nZ = strZ.length === 0 ? 0 : parseInt(strZ);
		};

		function CVml_Vector3D(sVal) {
			this.m_nX;
			this.m_nY;
			this.m_nZ;
			if(sVal) {
				this.fromString(sVal);
			}
		}
		CVml_Vector3D.prototype.fromString = function(sValue) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;

			let nLen = sValue.length;
			if ( nLen <= 0 )
				return 0;

			let nPos = sValue.indexOf(",");
			if ( -1 == nPos )
			{//only x position
				let strX = sValue;
				strX.replace("@", "");

				this.m_nX = strX.length === 0 ? 0 : parseInt(strX);
				return 0;
			}
			let strX = sValue.substr( 0, nPos );
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);

			let nPos2 = sValue.indexOf(",", nPos + 1 );
			if ( -1 == nPos2 )
			{// only x, y position
				let strY = sValue.substr( nPos + 1);
				strY.replace("@", "");
				this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
				return 0;
			}

			let strY = sValue.substr( nPos + 1, nPos2 - nPos - 1);
			let strZ = sValue.substr( nPos2 + 1, nLen - nPos2 - 1 ) ;

			strY.replace("@", "");
			strZ.replace("@", "");

			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
			this.m_nZ = strZ.length === 0 ? 0 : parseInt(strZ);
		};


		function CVml_Vector2D(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			if(sVal) {
				this.fromString(sVal);
			}
		}
		CVml_Vector2D.prototype.fromString = function(sValue) {
			this.m_nX = 0;
			this.m_nY = 0;

			let nLen = sValue.length();
			if ( nLen <= 0 )
				return 0;

			let nPos = sValue.indexOf(",");

			let strX, strY;
			if ( -1 == nPos )
			{//only x coord
				strX = sValue;
			}
			else
			{
				strX = sValue.substr( 0, nPos );
				strY = sValue.substr( nPos + 1, nLen - nPos - 1 ) ;
			}
			strY.replace("@", "");
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);
			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
		};

		function CVml_Vector2D_F(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			if(sVal) {
				this.fromString(sVal);
			}
		}
		CVml_Vector2D_F.prototype.fromString = function(sValue) {
			this.m_nX = 0;
			this.m_nY = 0;

			let nLen = sValue.length();
			if ( nLen <= 0 )
				return 0;

			let nPos = sValue.indexOf(",");

			let strX, strY;
			if ( -1 == nPos )
			{//only x coord
				strX = sValue;
			}
			else
			{
				strX = sValue.substr( 0, nPos );
				strY = sValue.substr( nPos + 1, nLen - nPos - 1 ) ;
			}
			strY.replace("@", "");
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseFloat(strX);
			this.m_nY = strY.length === 0 ? 0 : parseFloat(strY);
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


		function readColorMode(reader) {

			let sVal = reader.GetValue()
			switch (sVal) {
				case "auto": {
					return EInsetMode.insetmodeAuto;
					break;
				}
				case "custom": {
					return EInsetMode.insetmodeCustom;
					break;
				}
			}
			return null;
		}

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
			this.m_oPrlet = null;
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


			this.items = [];

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
				this.m_oOpacity = readCVml_1_65536(reader);
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
				this.m_oInsetMode = readColorMode(reader);
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
			else if ("print" === name) this.m_oPrlet = reader.GetValueBool();
			else if ("strokecolor" === name) this.m_oStrokeColor = this.readColor(reader);
			else if ("stroked" === name) this.m_oStroked = reader.GetValueBool();
			else if ("strokeweight" === name) this.m_oStrokeWeight = reader.GetValueInt();
			else if ("style" === name) this.m_oStyle = reader.GetValue();
			else if ("target" === name) this.m_sTarget = reader.GetValue();
			else if ("title" === name) this.m_sTitle = reader.GetValue();
			else if ("wrapcoords" === name) this.m_oWrapCoords = this.readPolygon2D(reader);
		};
		CVmlCommonElements.prototype.readChildXml = function (name, reader) {
			let oItem = null;
			if ("callout" === name)
				oItem = new CCallout();
			else if ("clippath" === name)
				oItem = new CClipPath();
			else if ("extrusion" === name)
				oItem = new CExtrusion();
			else if ("lock" === name)
				oItem = new CLock();
			else if ("signatureline" === name)
				oItem = new CSignatureLine();
			else if ("skew" === name)
				oItem = new CSkew();
			else if ("fill" === name)
				oItem = new CFill();
			else if ("formulas" === name)
				oItem = new CFormulas();
			else if ("handles" === name)
				oItem = new CHandles();
			else if ("imagedata" === name)
				oItem = new CImageData();
			else if ("path" === name)
				oItem = new CPath();
			else if ("shadow" === name)
				oItem = new CShadow();
			else if ("stroke" === name)
				oItem = new CStroke();
			else if ("textbox" === name)
				oItem = new CTextbox();
			else if ("textpath" === name)
				oItem = new CTextPath();
			else if ("anchorLock" === name)
				oItem = new CAnchorLock();
			else if ("borderbottom" === name)
				oItem = new CBorder();
			else if ("borderleft" === name)
				oItem = new CBorder();
			else if ("borderright" === name)
				oItem = new CBorder();
			else if ("bordertop" === name)
				oItem = new CBorder();
			else if ("wrap" === name)
				oItem = new CWrap();
			else if ("wrap" === name)
				oItem = new CWrap();
			else if ("ClientData" === name)
				oItem = new CClientData();
			if(oItem) {
				oItem.fromXml(reader);
			}
			this.items.push(oItem);

		};
		CVmlCommonElements.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CVmlCommonElements.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


		function readCVml_1_65536(reader) {
			let sValue =  reader.GetValue();
			let nLen = sValue.length;
			if ( nLen <= 0 )
				return 0;

			let bFraction = ( 'f' === sValue.charAt(nLen - 1) );

			if ( bFraction )
			{
				let strValue = sValue.substr( 0, nLen - 1 );
				let nValue = strValue.length === 0 ? 0 : parseInt(strValue);

				return Math.max( 0.0, Math.min( 65536.0, nValue) )/ 65536.0;
			}
			else
			{
				let dValue = sValue.length === 0 ? 0 : parseFloat( sValue );
				return Math.max( 0.0, Math.min( 1.0, dValue) );
			}
		}

		function CArc() {
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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
			CVmlCommonElements.call(this);
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


		let EVmlAngle =
		{
			vmlangle30   :   0,
			vmlangle45   :   1,
			vmlangle60   :   2,
			vmlangle90   :   3,
			vmlangleAny  :   4,
			vmlangleAuto :   5
		};


		let EExt =
		{
			extBackwardCompatible : 0,
			extEdit				: 1,
			extView				: 2,
		};

		let EVmlCalloutType =
		{
			vmlcallouttypeRectangle     : 0,
			vmlcallouttypeRoundRectangle: 1,
			vmlcallouttypeOval          : 2,
			vmlcallouttypeCloud         : 3
		};


		function CCallout() {
			CBaseNoId.call(this);
			this.m_oAccentbar = null;
			this.m_oAngle = null;
			this.m_oDistance = null;
			this.m_oDrop = null;
			this.m_oDropAuto = null;
			this.m_oExt = null;
			this.m_oGap = null;
			this.m_oLength = null;
			this.m_oLengthSpecified = null;
			this.m_oMinusX = null;
			this.m_oMinusY = null;
			this.m_oOn = null;
			this.m_oTextBorder = null;
			this.m_oType = null;
		}
		IC(CCallout, CBaseNoId, 0);
		CCallout.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "accentbar": {
					this.m_oAccentbar = reader.GetValueBool();
					break;
				}
				case "angle": {
					let sVal = reader.GetValue();
					switch (sVal) {
						case "30": {
							this.m_oAngle = EVmlAngle.vmlangle30;
							break
						}
						case "45": {
							this.m_oAngle = EVmlAngle.vmlangle45;
							break
						}
						case "60": {
							this.m_oAngle = EVmlAngle.vmlangle60;
							break
						}
						case "90": {
							this.m_oAngle = EVmlAngle.vmlangle90;
							break
						}
						case "any": {
							this.m_oAngle = EVmlAngle.vmlangleAny;
							break
						}
						case "auto": {
							this.m_oAngle = EVmlAngle.vmlangleAuto;
							break
						}
						default: {
							this.m_oAngle = EVmlAngle.vmlangleAuto;
							break
						}
					}
					break;
				}
				case "distance": {
					this.m_oDistance = reader.GetValueInt();
					break;
				}
				case "drop": {
					this.m_oDrop = reader.GetValue();
					break;
				}
				case "dropauto": {
					this.m_oDropAuto = reader.GetValueBool();
					break;
				}
				case "ext": {
					this.m_oExt = readExt(reader);
					break;
				}
				case "gap": {
					this.m_oGap = reader.GetValueInt();
					break;
				}
				case "length": {
					this.m_oLength = reader.GetValueInt();
					break;
				}
				case "lengthspecified": {
					this.m_oLengthSpecified = reader.GetValueBool();
					break;
				}
				case "minusx": {
					this.m_oMinusX = reader.GetValueBool();
					break;
				}
				case "minusy": {
					this.m_oMinusY = reader.GetValueBool();
					break;
				}
				case "on": {
					this.m_oOn = reader.GetValueBool();
					break;
				}
				case "textborder": {
					this.m_oTextBorder = reader.GetValueBool();
					break;
				}
				case "type": {
					let sVal = reader.GetValue();
					switch (sVal) {
						case "rectangle": {
							this.m_oType = EVmlCalloutType.vmlcallouttypeRectangle;
							break;
						}
						case "roundedrectangle": {
							this.m_oType = EVmlCalloutType.vmlcallouttypeRoundRectangle;
							break;
						}
						case "oval": {
							this.m_oType = EVmlCalloutType.vmlcallouttypeOval;
							break;
						}
						case "cloud": {
							this.m_oType = EVmlCalloutType.vmlcallouttypeCloud;
							break;
						}
					}
					break;
				}
			}
		};
		CCallout.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CCallout.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CCallout.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CClipPath() {
			CBaseNoId.call(this);
			this.m_oV = null;
		}
		IC(CClipPath, CBaseNoId, 0);
		CClipPath.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "v": {
					this.m_oV = reader.GetValue();
					break;
				}
			}
		};
		CClipPath.prototype.readChildXml = function (name, reader) {
		};
		CClipPath.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CClipPath.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


		let EExtrusionType =
		{
			extrusiontypeParallel: 0,
			extrusiontypePerspective: 1
		};

		function readExt(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "backwardCompatible": {
					return EExt.extBackwardCompatible;
					break;
				}
				case "edit": {
					return EExt.extEdit;
					break;
				}
				case "view": {
					return EExt.extView;
					break;
				}
			}
			return null;
		}

		function readExtrusionType(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "parallel":
					return
				case "extrusiontypeParallel":
					return EExtrusionType.extrusiontypePerspective;
			}
			return EExtrusionType.extrusiontypeParallel;;
		}
		function CExtrusion() {
			CBaseNoId.call(this);
			this.m_oAutoRotationCenter = null;
			this.m_oBackDepth = null;
			this.m_oBrightness = null;
			this.m_oColor = null;
			this.m_oColorMode = null;
			this.m_oDiffusity = null;
			this.m_oEdge = null;
			this.m_oExt = null;
			this.m_oFacet = null;
			this.m_oForeDepth = null;
			this.m_oLightFace = null;
			this.m_oLightHarsh = null;
			this.m_oLightHarsh2 = null;
			this.m_oLightLevel = null;
			this.m_oLightLevel2 = null;
			this.m_oLightPosition = null;
			this.m_oLightPosition2 = null;
			this.m_oLockRotationCenter = null;
			this.m_oMetal = null;
			this.m_oOn = null;
			this.m_oOrientation = null;
			this.m_oOrientationAngle = null;
			this.m_oPlane = null;
			this.m_oRender = null;
			this.m_oRotationAngle = null;
			this.m_oRotationCenter = null;
			this.m_oShininess = null;
			this.m_oSkewAmt = null;
			this.m_oSkewAngle = null;
			this.m_oSpecularity = null;
			this.m_oType = null;
			this.m_oViewPolet = null;
			this.m_oViewPointOrigin = null;
		}
		IC(CExtrusion, CBaseNoId, 0);
		CExtrusion.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "autorotationcenter": {
					this.m_oAutoRotationCenter = reader.GetValueBool();
					break;
				}
				case "backdepth": {
					this.m_oBackDepth = reader.GetValue();
					break;
				}
				case "brightness": {
					this.m_oBrightness = readCVml_1_65536(reader);
					break;
				}
				case "color": {
					this.m_oColor = CVmlCommonElements.prototype.readColor.call(this, reader);
					break;
				}
				case "colormode": {
					this.m_oColorMode = readColorMode(reader);
					break;
				}
				case "diffusity": {
					this.m_oDiffusity = readCVml_1_65536(reader);
					break;
				}
				case "edge": {
					this.m_oEdge = reader.GetValue();
					break;
				}
				case "ext": {
					this.m_oExt = readExt(reader);
					break;
				}
				case "facet": {
					this.m_oFacet = reader.GetValueInt();
					break;
				}
				case "foredepth": {
					this.m_oForeDepth = reader.GetValue();
					break;
				}
				case "lightface": {
					this.m_oLightFace = reader.GetValueBool();
					break;
				}
				case "lightharsh": {
					this.m_oLightHarsh = reader.GetValueBool();
					break;
				}
				case "lightharsh2": {
					this.m_oLightHarsh2 = reader.GetValueBool();
					break;
				}
				case "lightlevel": {
					this.m_oLightLevel = readCVml_1_65536(reader);
					break;
				}
				case "lightlevel2": {
					this.m_oLightLevel2 = readCVml_1_65536(reader);
					break;
				}
				case "lightposition": {
					this.m_oLightPosition = new CVml_Vector3D_65536(reader.GetValue());
					break;
				}
				case "lightposition2": {
					this.m_oLightPosition2 = new CVml_Vector3D_65536(reader.GetValue());
					break;
				}
				case "lockrotationcenter": {
					this.m_oLockRotationCenter = reader.GetValueBool();
					break;
				}
				case "metal": {
					this.m_oMetal = reader.GetValueBool();
					break;
				}
				case "on": {
					this.m_oOn = reader.GetValueBool();
					break;
				}
				case "orientation": {
					this.m_oOrientation = new CVml_Vector3D(reader.GetValue());
					break;
				}
				case "orientationangle": {
					this.m_oOrientationAngle = reader.GetValueInt();
					break;
				}
				case "plane": {
					this.m_oPlane = reader.GetValue();
					break;
				}
				case "render": {
					this.m_oRender = reader.GetValue();
					break;
				}
				case "rotationangle": {
					this.m_oRotationAngle = CVml_Vector2D(reader.GetValue());
					break;
				}
				case "rotationcenter": {
					this.m_oRotationCenter = CVml_Vector3D(reader.GetValue());
					break;
				}
				case "shininess": {
					this.m_oShininess = reader.GetValueInt();
					break;
				}
				case "skewamt": {
					this.m_oSkewAmt = AscFormat.getPercentageValue(reader.GetValue());
					break;
				}
				case "skewangle": {
					this.m_oSkewAngle = reader.GetValueInt();
					break;
				}
				case "specularity": {
					this.m_oSpecularity = readCVml_1_65536(reader);
					break;
				}
				case "type": {
					this.m_oType = readExtrusionType(reader);
					break;
				}
				case "viewpoint": {
					this.m_oViewPolet = new CVml_Vector3D(reader.GetValue());
					break;
				}
				case "viewpointorigin": {
					this.m_oViewPointOrigin = new CVml_Vector2D_F(reader.GetValue());
					break;
				}
			}
		};
		CExtrusion.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CExtrusion.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CExtrusion.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CLock() {
			CBaseNoId.call(this);
		}
		IC(CLock, CBaseNoId, 0);
		CLock.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "adjusthandles": this.m_oAdjustHandles = reader.GetValueBool(); break;
				case "aspectratio":   this.m_oAspectRatio = reader.GetValueBool(); break;
				case "cropping":      this.m_oCropping = reader.GetValueBool(); break;
				case "ext":           this.m_oExt = readExt(reader); break;
				case "grouping":      this.m_oGrouping = reader.GetValueBool(); break;
				case "position":      this.m_oPosition = reader.GetValueBool(); break;
				case "rotation":      this.m_oRotation = reader.GetValueBool(); break;
				case "selection":     this.m_oSelection = reader.GetValueBool(); break;
				case "shapetype":     this.m_oShapeType = reader.GetValueBool(); break;
				case "text":          this.m_oText = reader.GetValueBool(); break;
				case "ungrouping":    this.m_oUnGrouping = reader.GetValueBool(); break;
				case "verticies":     this.m_oVerticies = reader.GetValueBool(); break;
			}
		};
		CLock.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CLock.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CLock.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CSignatureLine() {
			CBaseNoId.call(this);
		}
		IC(CSignatureLine, CBaseNoId, 0);
		CSignatureLine.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "o:addlxml":              this.m_sAddXml = reader.GetValue(); break;
				case "allowcomments":          this.m_oAllowComments = reader.GetValueBool(); break;
				case "v:ext":                  this.m_oExt = readExt(reader); break;
				case "id":                     this.m_oId = reader.GetValue(); break;
				case "issignatureline":        this.m_oIsSignatureLine = reader.GetValueBool(); break;
				case "provid":                 this.m_oProvId = reader.GetValue(); break;
				case "showsigndate":           this.m_oShowSignDate = reader.GetValueBool(); break;
				case "o:signinginstructions":  this.m_sSigningInstructions = reader.GetValue(); break;
				case "signinginstructionsset": this.m_oSigningInstructionsSet = reader.GetValueBool(); break;
				case "o:sigprovurl":           this.m_sSigProvUrl = reader.GetValue(); break;
				case "o:suggestedsigner":      this.m_sSuggestedSigner = reader.GetValue(); break;
				case "o:suggestedsigner2":     this.m_sSuggestedSigner2 = reader.GetValue(); break;
				case "o:suggestedsigneremail": this.m_sSuggestedSignerEmail = reader.GetValue(); break;
			}
		};
		CSignatureLine.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CSignatureLine.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CSignatureLine.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CSkew() {
			CBaseNoId.call(this);
		}
		IC(CSkew, CBaseNoId, 0);
		CSkew.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CSkew.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CSkew.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CSkew.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CFill() {
			CBaseNoId.call(this);
		}
		IC(CFill, CBaseNoId, 0);
		CFill.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CFill.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CFill.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CFill.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CFormulas() {
			CBaseNoId.call(this);
		}
		IC(CFormulas, CBaseNoId, 0);
		CFormulas.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CFormulas.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CFormulas.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CFormulas.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CHandles() {
			CBaseNoId.call(this);
		}
		IC(CHandles, CBaseNoId, 0);
		CHandles.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CHandles.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CHandles.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CHandles.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CImageData() {
			CBaseNoId.call(this);
		}
		IC(CImageData, CBaseNoId, 0);
		CImageData.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CImageData.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CImageData.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CImageData.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CPath() {
			CBaseNoId.call(this);
		}
		IC(CPath, CBaseNoId, 0);
		CPath.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CPath.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CPath.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CPath.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CShadow() {
			CBaseNoId.call(this);
		}
		IC(CShadow, CBaseNoId, 0);
		CShadow.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CShadow.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CShadow.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CShadow.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CStroke() {
			CBaseNoId.call(this);
		}
		IC(CStroke, CBaseNoId, 0);
		CStroke.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CStroke.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CStroke.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CStroke.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CTextbox() {
			CBaseNoId.call(this);
		}
		IC(CTextbox, CBaseNoId, 0);
		CTextbox.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CTextbox.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CTextbox.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CTextbox.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CTextPath() {
			CBaseNoId.call(this);
		}
		IC(CTextPath, CBaseNoId, 0);
		CTextPath.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CTextPath.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CTextPath.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CTextPath.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CAnchorLock() {
			CBaseNoId.call(this);
		}
		IC(CAnchorLock, CBaseNoId, 0);
		CAnchorLock.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CAnchorLock.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CAnchorLock.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CAnchorLock.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CBorder() {
			CBaseNoId.call(this);
		}
		IC(CBorder, CBaseNoId, 0);
		CBorder.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CBorder.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CBorder.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CBorder.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CWrap() {
			CBaseNoId.call(this);
		}
		IC(CWrap, CBaseNoId, 0);
		CWrap.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CWrap.prototype.readChildXml = function (name, reader) {
			switch (name) {
			}
		};
		CWrap.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CWrap.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


	})(window);