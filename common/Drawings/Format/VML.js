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


		function Cm_To_Mm(dValue) {
			return dValue * 10;
		}

		function Cm_To_Pt(dValue) {
			return dValue * 72 / 2.54;
		}

		function Cm_To_Px(dValue) {
			return dValue * 72 * 4 / 3 / 2.54;
		}

		function Cm_To_Inch(dValue) {
			return dValue / 2.54;
		}

		function Cm_To_Dx(dValue) {
			return dValue * 72 * 20 / 2.54;
		}

		function Cm_To_Sx(dValue) {
			return dValue * 72 * 100 * 1000 / 20;
		}

		function Cm_To_Multi(dValue) {
			return dValue * 72 * 20 / 2.54;
		}

		function Cm_To_Emu(dValue) {
			return dValue * 360000;
		}

		function Mm_To_Cm(dValue) {
			return dValue / 10;
		}

		function Mm_To_Pt(dValue) {
			return dValue * 72 / 10 / 2.54;
		}

		function Mm_To_Px(dValue) {
			return dValue * 72 * 4 / 3 / 10 / 2.54;
		}

		function Mm_To_Inch(dValue) {
			return dValue / 2.54 / 10;
		}

		function Mm_To_Dx(dValue) {
			return dValue * 72 * 20 / 10 / 2.54;
		}

		function Mm_To_Sx(dValue) {
			return dValue * 72 * 100 * 1000 / 10 / 20;
		}

		function Mm_To_Multi(dValue) {
			return dValue * 72 * 20 / 10 / 2.54;
		}

		function Mm_To_Emu(dValue) {
			return dValue * 36000;
		}

		function Pt_To_Cm(dValue) {
			return dValue * 2.54 / 72;
		}

		function Pt_To_Mm(dValue) {
			return dValue * 2.54 * 10 / 72;
		}

		function Pt_To_Px(dValue) {
			return dValue * 4 / 3;
		}

		function Pt_To_Inch(dValue) {
			return dValue / 72;
		}

		function Pt_To_Dx(dValue) {
			return dValue * 20;
		}

		function Pt_To_Sx(dValue) {
			return dValue * 2.54 * 100 * 1000 / 20;
		}

		function Pt_To_Multi(dValue) {
			return dValue * 20;
		}

		function Pt_To_Emu(dValue) {
			return dValue * 12700;
		}

		function Px_To_Cm(dValue) {
			return dValue * 2.54 * 3 / 72 / 4;
		}

		function Px_To_Mm(dValue) {
			return dValue * 2.54 * 10 * 3 / 72 / 4;
		}

		function Px_To_Pt(dValue) {
			return dValue * 3 / 4;
		}

		function Px_To_Inch(dValue) {
			return dValue * 3 / 72 / 4;
		}

		function Px_To_Dx(dValue) {
			return dValue * 20 * 3 / 4;
		}

		function Px_To_Sx(dValue) {
			return dValue * 2.54 * 100 * 1000 * 3 / 20 / 4;
		}

		function Px_To_Multi(dValue) {
			return dValue * 20 * 3 / 4;
		}

		function Px_To_Emu(dValue) {
			return dValue * 9525;
		}

		function Inch_To_Cm(dValue) {
			return dValue * 2.54;
		}

		function Inch_To_Mm(dValue) {
			return dValue * 2.54 * 10;
		}

		function Inch_To_Pt(dValue) {
			return dValue * 72;
		}

		function Inch_To_Px(dValue) {
			return dValue * 72 * 4 / 3;
		}

		function Inch_To_Dx(dValue) {
			return dValue * 72 * 20;
		}

		function Inch_To_Sx(dValue) {
			return dValue * 1000 * 100 * 2.54 * 72 / 20;
		}

		function Inch_To_Multi(dValue) {
			return dValue * 72 * 20;
		}

		function Inch_To_Emu(dValue) {
			return dValue * 914400;
		}

		function Dx_To_Cm(dValue) {
			return dValue * 2.54 / 72 / 20;
		}

		function Dx_To_Mm(dValue) {
			return dValue * 2.54 * 10 / 72 / 20;
		}

		function Dx_To_Pt(dValue) {
			return dValue / 20;
		}


		function Dx_To_Px(dValue) {
			return dValue * 4 / 3 / 20;
		}

		function Dx_To_Inch(dValue) {
			return dValue / 20 / 72;
		}

		function Dx_To_Sx(dValue) {
			return dValue * 635;
		}

		function Dx_To_Multi(dValue) {
			return dValue;
		}

		function Dx_To_Emu(dValue) {
			return dValue * 635;
		}

		function Sx_To_Cm(dValue) {
			return dValue * 20 / 72 / 100 / 1000;
		}

		function Sx_To_Mm(dValue) {
			return dValue * 20 / 72 / 100 / 1000 * 10;
		}

		function Sx_To_Pt(dValue) {
			return dValue * 20 / 100 / 1000 / 2.54;
		}

		function Sx_To_Px(dValue) {
			return dValue * 20 * 4 / 3 / 100 / 1000 / 2.54;
		}

		function Sx_To_Inch(dValue) {
			return dValue * 20 / 2.54 / 72 / 100 / 1000;
		}

		function Sx_To_Dx(dValue) {
			return dValue * 20 * 20 / 2.54 / 100 / 1000;
		}

		function Sx_To_Multi(dValue) {
			return dValue * 20 * 20 / 2.54 / 100 / 1000;
		}

		function Sx_To_Emu(dValue) {
			return dValue;
		}

		function Multi_To_Cm(dValue) {
			return dValue * 2.54 / 72 / 20;
		}

		function Multi_To_Mm(dValue) {
			return dValue * 2.54 * 10 / 72 / 20;
		}

		function Multi_To_Pt(dValue) {
			return dValue / 20;
		}

		function Multi_To_Px(dValue) {
			return dValue * 4 / 3 / 20;
		}

		function Multi_To_Inch(dValue) {
			return dValue / 20 / 72;
		}

		function Multi_To_Sx(dValue) {
			return dValue * 635;
		}

		function Multi_To_Dx(dValue) {
			return dValue;
		}

		function Multi_To_Emu(dValue) {
			return dValue * 635;
		}

		function Emu_To_Cm(dValue) {
			return dValue / 360000;
		}

		function Emu_To_Mm(dValue) {
			return dValue / 36000;
		}

		function Emu_To_Pt(dValue) {
			return dValue / 12700;
		}

		function Emu_To_Twips(dValue) {
			return dValue / 635;
		}

		function Emu_To_Px(dValue) {
			return dValue / 9525;
		}

		function Emu_To_Inch(dValue) {
			return dValue / 914400;
		}

		function Emu_To_Sx(dValue) {
			return dValue;
		}

		function Emu_To_Dx(dValue) {
			return dValue / 635;
		}

		function Emu_To_Multi(dValue) {
			return dValue / 635;
		}

		function CUniversalMeasure() {
			this.m_bUnit = null;
			this.m_dValue = null;
		}

		CUniversalMeasure.prototype.GetValue = function () {
			return this.m_dValue;
		};
		CUniversalMeasure.prototype.ToPoints = function () {
			return this.m_dValue;
		};
		CUniversalMeasure.prototype.ToInches = function () {
			return this.m_dValue / 72.0;
		};
		CUniversalMeasure.prototype.ToMm = function () {
			return this.m_dValue * 25.4 / 72;
		}
		CUniversalMeasure.prototype.ToTwips = function () {
			return Pt_To_Dx(this.m_dValue);
		}
		CUniversalMeasure.prototype.ToHps = function () {
			return (this.m_dValue * 2);
		}
		CUniversalMeasure.prototype.ToUnsignedTwips = function () {
			return Math.abs(Pt_To_Dx(this.m_dValue));
		}
		CUniversalMeasure.prototype.FromPoints = function (dValue) {
			this.m_dValue = dValue;
			return this.m_dValue;
		}
		CUniversalMeasure.prototype.FromTwips = function (dValue) {
			this.m_dValue = Dx_To_Pt(dValue);
			return this.m_dValue;
		}
		CUniversalMeasure.prototype.FromMm = function (dValue) {
			this.m_dValue = Mm_To_Pt(dValue);
			return this.m_dValue;
		}
		CUniversalMeasure.prototype.FromInches = function (dValue) {
			this.m_dValue = Inch_To_Pt(dValue);
			return this.m_dValue;
		}
		CUniversalMeasure.prototype.FromEmu = function (dValue) {
			this.m_dValue = Emu_To_Pt(dValue);
			return this.m_dValue;
		}
		CUniversalMeasure.prototype.IsUnits = function () {
			return this.m_bUnit;
		}
		CUniversalMeasure.prototype.Parse = function (sValue, dKoef) {
			this.m_bUnit = false;
			this.m_dValue = 0;

			if (sValue.length === 0) return;

			if (sValue.length <= 2) {
				this.m_dValue = parseFloat(sValue) / dKoef;
				return;
			}

			let sUnit = sValue.substr(sValue.length - 2, 2);
			this.m_bUnit = true;

			if ("cm" === sUnit) {
				let dValue = parseFloat(sValue.substr(0, sValue.length - 2));
				this.m_dValue = Cm_To_Pt(dValue);
			} else if ("mm" === sUnit) {
				let dValue = parseFloat(sValue.substr(0, sValue.length - 2));
				this.m_dValue = Mm_To_Pt(dValue);
			} else if ("in" === sUnit) {
				let dValue = parseFloat(sValue.substr(0, sValue.length - 2));
				this.m_dValue = Inch_To_Pt(dValue);
			} else if ("pt" === sUnit) {
				this.m_dValue = parseFloat(sValue.substr(0, sValue.length - 2));
			} else if ("pc" === sUnit) {
				let dValue = parseFloat(sValue.substr(0, sValue.length - 2));
				this.m_dValue = dValue * 12.0;
			} else if ("pi" === sUnit) {
				let dValue = parseFloat(sValue.substr(0, sValue.length - 2));
				this.m_dValue = dValue * 12.0;
			} else {
				this.m_bUnit = false;
				this.m_dValue = parseFloat(sValue) / dKoef;

			}
		}

		function CUniversalMeasureOrPercent() {
			CUniversalMeasure.call(this);
			this.m_bTrailingPercentSign = null;
		}
		IC(CUniversalMeasureOrPercent, CUniversalMeasure, 0);
		CUniversalMeasureOrPercent.prototype.SetValue = function (dValue) {
			this.m_bUnit = false;
			this.m_dValue = dValue;
		};
		CUniversalMeasureOrPercent.prototype.FromString = function (sValue) {
			this.m_bUnit = false;
			this.m_bTrailingPercentSign = false;
			if (sValue.length === 0) {
				this.m_dValue = 0;
				return this.m_dValue;
			}
			if ('%' === sValue[sValue.length - 1]) {
				this.m_bTrailingPercentSign = true;
				this.m_dValue = parseFloat(sValue.substr(0, sValue.length - 1));
			} else {
				this.Parse(sValue, 1);
			}
			return this.m_dValue;
		};
		CUniversalMeasureOrPercent.prototype.ToString = function () {
			let sResult;
			if (this.m_bUnit)
				sResult = this.m_dValue + "pt";
			else if (this.m_bTrailingPercentSign)
				sResult = this.m_dValue + "%";
			else
				sResult = this.m_dValue + "";
			return sResult;
		};
		CUniversalMeasureOrPercent.prototype.IsPercent = function () {
			return this.m_bTrailingPercentSign;
		};

		function readPoint(reader) {
			return new CPoint(reader.GetValue());
		}

		function CPoint(sValue) {
			CUniversalMeasure.call(this);
			if (sValue) {
				this.FromString(sValue);
			}
		}
		IC(CPoint, CUniversalMeasure, 0);
		CPoint.prototype.FromString = function (sValue) {
			this.Parse(sValue, 1);
			return this.m_dValue;
		};
		CPoint.prototype.SetValue = function (dValue) {
			this.m_bUnit = false;
			this.m_dValue = dValue;
		};
		CPoint.prototype.ToString = function () {
			return this.m_dValue + "pt";
		};
		CPoint.prototype.FromPoints = function (dValue) {
			this.m_dValue = dValue;
			return this.m_dValue;
		};
		CPoint.prototype.FromInches = function (dValue) {
			this.m_dValue = dValue * 72;
			return this.m_dValue;
		};
		CPoint.prototype.GetValue = function () {
			return this.m_dValue;
		};

		function CInch() {
			CUniversalMeasure.call(this);
		}
		IC(CInch, CUniversalMeasure, 0)
		CInch.prototype.FromString = function (sValue) {
			this.Parse(sValue, 1.0 / 72);
			return this.m_dValue;
		};
		CInch.prototype.SetValue = function (dValue) {
			this.m_bUnit = false;
			this.m_dValue = this.FromInches(dValue);
		};
		CInch.prototype.ToString = function () {
			return this.ToInches() + "in";
		};


		function CVMLDrawing() {
			CBaseNoId.call(this);
			this.items = []
		}
		IC(CVMLDrawing, CBaseNoId, 0);

		CVMLDrawing.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CVMLDrawing.prototype.readChildXml = function (name, reader) {
			let oItem;
			if ("arc" === name) {
				oItem = new CArc();
			}
			if ("curve" === name) {
				oItem = new CCurve();
			}
			if ("group" === name) {
				oItem = new CGroup();
			}
			if ("image" === name) {
				oItem = new CImage();
			}
			if ("line" === name) {
				oItem = new CLine();
			}
			if ("oval" === name) {
				oItem = new COval();
			}
			if ("polyline" === name) {
				oItem = new CPolyLine();
			}
			if ("rect" === name) {
				oItem = new CRect();
			}
			if ("roundrect" === name) {
				oItem = new CRoundRect();
			}
			if ("shape" === name) {
				oItem = new CShape();
			}
			if ("shapetype" === name) {
				oItem = new CShapeType();
			}
			if (oItem) {
				oItem.fromXml(reader);
				this.items.push(oItem);
			}
		};
		CVMLDrawing.prototype.writeChildren = function (writer) {
		};


		let shemeDefaultColor =
			[
				0x00000000, 0x00FFFFFF, 0x00FF0000, 0x0000FF00, 0x000000FF, 0x00FFFF00, 0x00FF00FF, 0x0000FFFF,
				0x00000000, 0x00FFFFFF, 0x00FF0000, 0x0000FF00, 0x000000FF, 0x00FFFF00, 0x00FF00FF, 0x0000FFFF,
				0x00800000, 0x00008000, 0x00000080, 0x00808000, 0x00800080, 0x00008080, 0x00C0C0C0, 0x00808080,
				0x009999FF, 0x00993366, 0x00FFFFCC, 0x00CCFFFF, 0x00660066, 0x00FF8080, 0x000066CC, 0x00CCCCFF,
				0x00000080, 0x00FF00FF, 0x00FFFF00, 0x0000FFFF, 0x00800080, 0x00800000, 0x00008080, 0x000000FF,
				0x0000CCFF, 0x00CCFFFF, 0x00CCFFCC, 0x00FFFF99, 0x0099CCFF, 0x00FF99CC, 0x00CC99FF, 0x00FFCC99,
				0x003366FF, 0x0033CCCC, 0x0099CC00, 0x00FFCC00, 0x00FF9900, 0x00FF6600, 0x00666699, 0x00969696,
				0x00003366, 0x00339966, 0x00003300, 0x00333300, 0x00993300, 0x00993366, 0x00333399, 0x00333333
			];
		let controlPanelColors2 =
			[
				0x00000000, 0x00FFFFFF, 0x00000000, 0x00FFFFFF,
				0x00000000, 0x00000000, 0x00000000, 0x00FFFFFF,
				0x00FFFFFF, 0x00000000, 0x00FFFFFF, 0x00FFFFFF,
				0x00000000, 0x00000000, 0x00000000, 0x00000000,
				0x00FFFFFF, 0x00FFFFFF, 0x00FFFFFF, 0x00000000,
				0x00FFFFFF, 0x00000000, 0x00000000, 0x00000000,
				0x00000000, 0x00000000, 0x00FFFFFF, 0x00FFFFFF
			];
		let controlPanelColors1 =
			[
				0x00FFFFFF, 0x00CCCCCC, 0x00FFFFFF, 0x006363CE,
				0x00DDDDDD, 0x00DDDDDD, 0x00888888, 0x00000000,
				0x00000000, 0x00808080, 0x00B5D5FF, 0x00000000,
				0x00FFFFFF, 0x00FFFFFF, 0x007F7F7F, 0x00FBFCC5,
				0x00000000, 0x00F7F7F7, 0x00000000, 0x00FFFFFF,
				0x00666666, 0x00C0C0C0, 0x00DDDDDD, 0x00C0C0C0,
				0x00888888, 0x00FFFFFF, 0x00CCCCCC, 0x00000000
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
		CColor.prototype.fromString = function (sVal) {
			if (sVal.charAt(0) === '#') {
				this.byHexColor(sVal)
			} else {
				this.byColorName(sVal);
			}
		};
		CColor.prototype.setRGB = function () {

			if (this.type === EColorType.colortypeRGB) return;

			switch (this.type) {
				case EColorType.colortypeAqua: {
					this.r = 0x00;
					this.g = 0xff;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeBlack: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeBlue: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeFuchsia: {
					this.r = 0xff;
					this.g = 0x00;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeGray: {
					this.r = 0x80;
					this.g = 0x80;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeGreen: {
					this.r = 0x00;
					this.g = 0x80;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeLime: {
					this.r = 0x00;
					this.g = 0xff;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeMaroon: {
					this.r = 0x80;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeNavy: {
					this.r = 0x00;
					this.g = 0x00;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeOlive: {
					this.r = 0x80;
					this.g = 0x80;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypePurple: {
					this.r = 0x80;
					this.g = 0x00;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeRed: {
					this.r = 0xff;
					this.g = 0x00;
					this.b = 0x00;
				}
					break;
				case EColorType.colortypeSilver: {
					this.r = 0xc0;
					this.g = 0xc0;
					this.b = 0xc0;
				}
					break;
				case EColorType.colortypeTeal: {
					this.r = 0x00;
					this.g = 0x80;
					this.b = 0x80;
				}
					break;
				case EColorType.colortypeWhite: {
					this.r = 0xff;
					this.g = 0xff;
					this.b = 0xff;
				}
					break;
				case EColorType.colortypeYellow: {
					this.r = 0xff;
					this.g = 0xff;
					this.b = 0;
				}
					break;
				case EColorType.colortypeNone:
				default: {
					this.r = 0;
					this.g = 0;
					this.b = 0;
				}
					break;
			}
		};
		CColor.prototype.byHexColor = function (sVal) {
			this.type = EColorType.colortypeRGB;
			let nColor = parseInt(sVal.slice(1));
			this.r = (nColor >> 16) & 0xFF;
			this.g = (nColor >> 8) & 0xFF;
			this.b = nColor & 0xFF;
		};
		CColor.prototype.byColorName = function (sVal) {
			this.type = EColorType.colortypeNone;

			if (sVal.indexOf("aqua") > -1) this.type = EColorType.colortypeAqua;
			else if (sVal.indexOf("black") > -1) this.type = EColorType.colortypeBlack;
			else if (sVal.indexOf("blue") > -1) this.type = EColorType.colortypeBlue;
			else if (sVal.indexOf("fuchsia") > -1) this.type = EColorType.colortypeFuchsia;
			else if (sVal.indexOf("gray") > -1) this.type = EColorType.colortypeGray;
			else if (sVal.indexOf("green") > -1) this.type = EColorType.colortypeGreen;
			else if (sVal.indexOf("lime") > -1) this.type = EColorType.colortypeLime;
			else if (sVal.indexOf("maroon") > -1) this.type = EColorType.colortypeMaroon;
			else if (sVal.indexOf("navy") > -1) this.type = EColorType.colortypeNavy;
			else if (sVal.indexOf("olive") > -1) this.type = EColorType.colortypeOlive;
			else if (sVal.indexOf("purple") > -1) this.type = EColorType.colortypePurple;
			else if (sVal.indexOf("red") > -1) this.type = EColorType.colortypeRed;
			else if (sVal.indexOf("silver") > -1) this.type = EColorType.colortypeSilver;
			else if (sVal.indexOf("teal") > -1) this.type = EColorType.colortypeTeal;
			else if (sVal.indexOf("white") > -1) this.type = EColorType.colortypeWhite;
			else if (sVal.indexOf("yellow") > -1) this.type = EColorType.colortypeYellow;
			else if (sVal.indexOf("[") > -1 && sVal.indexOf("]") > -1) {
				let p1 = sVal.indexOf("[");
				let p2 = sVal.indexOf("]");
				let sIndex = p2 > p1 ? sVal.substr(p1 + 1, p2 - p1 - 1) : "";

				if (sIndex.length > 0) {
					let index = parseInt(sIndex);
					let nRGB = 0;
					if (index < 64) {
						nRGB = shemeDefaultColor[index];
					} else if (index > 64 && index < 92) {
						nRGB = controlPanelColors1[index - 65];
					}
					this.r = ((nRGB >> 16) & 0xff);
					this.g = ((nRGB >> 8) & 0xff);
					this.b = (nRGB & 0xff);
					this.type = EColorType.colortypeRGB;
				}
			}

			this.setRGB();

		};


		function CVmlVector2D(sVal) {
			this.x = 0;
			this.y = 0;

			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVmlVector2D.prototype.fromString = function (sValue) {
			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			let strX, strY;
			if (-1 === nPos) {//only x coord
				strX = sValue;
			} else {
				strX = sValue.substr(0, nPos);
				strY = sValue.substr(nPos + 1, nLen - nPos - 1);
			}
			strY.replace("@", "");
			strX.replace("@", "");
			this.x = strX.length === 0 ? 0 : parseInt(strX);
			this.y = strY.length === 0 ? 0 : parseInt(strY);
			return 0;
		};

		function CVmlPolygon2D(sVal) {
			this.pts = [];
			if (sVal) {
				this.fromString(sVal)
			}
		}

		CVmlPolygon2D.prototype.fromString = function (sValue) {
			this.pts.length = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nStartPos = 0;
			while (true) {
				let nMidPos = sValue.indexOf(",", nStartPos);
				let nEndPos = sValue.indexOf(",", nMidPos + 1);

				if (-1 === nMidPos)
					break;

				if (-1 === nEndPos)
					nEndPos = nLen;

				let strX = sValue.substr(nStartPos, nMidPos - nStartPos);
				let strY = sValue.substr(nStartPos, nMidPos - nStartPos);

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


		function CVml_Matrix(sValue) {
			this.m_dSxx = null;
			this.m_dSxy = null;
			this.m_dSyx = null;
			this.m_dSyy = null;
			this.m_dPx = null;
			this.m_dPy = null;
			this.ResetMatrix();
			if (sValue) {
				this.FromString(sValue);
			}
		}

		CVml_Matrix.prototype.ResetMatrix = function () {
			this.m_dSxx = 1;
			this.m_dSxy = 0;
			this.m_dSyx = 0;
			this.m_dSyy = 1;
			this.m_dPx = 0;
			this.m_dPy = 0;
		}
		CVml_Matrix.prototype.SetMatrix = function (dSxx, dSxy, dSyx, dSyy, dPx, dPy) {
			this.m_dSxx = dSxx;
			this.m_dSxy = dSxy;
			this.m_dSyx = dSyx;
			this.m_dSyy = dSyy;
			this.m_dPx = dPx;
			this.m_dPy = dPy;
		}
		CVml_Matrix.prototype.Get_Sxx = function () {
			return this.m_dSxx;
		}
		CVml_Matrix.prototype.Get_Sxy = function () {
			return this.m_dSxy;
		}
		CVml_Matrix.prototype.Get_Syx = function () {
			return this.m_dSyx;
		}
		CVml_Matrix.prototype.Get_Syy = function () {
			return this.m_dSyy;
		}
		CVml_Matrix.prototype.Get_Px = function () {
			return this.m_dPx;
		}
		CVml_Matrix.prototype.Get_Py = function () {
			return this.m_dPy;
		}
		CVml_Matrix.prototype.FromString = function (sValue) {
			this.ResetMatrix();

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			// Sxx
			let nStartPos = 0;
			let nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dSxx = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			// Sxy
			nStartPos = nEndPos + 1;
			nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dSxy = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			// Syx
			nStartPos = nEndPos + 1;
			nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dSyx = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			// Syy
			nStartPos = nEndPos + 1;
			nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dSyy = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			// Px
			nStartPos = nEndPos + 1;
			nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dPx = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			// Py
			nStartPos = nEndPos + 1;
			nEndPos = sValue.indexOf(",", nStartPos);
			if (-1 === nEndPos)
				nEndPos = nLen;

			if (nEndPos - nStartPos > 0) {
				let strValue = sValue.substr(nStartPos, nEndPos - nStartPos);
				this.m_dPy = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			nStartPos = nEndPos + 1;
			return 0;
		}
		CVml_Matrix.prototype.ToString = function () {
			return this.m_dSxx + "," + this.m_dSxy + "," + this.m_dSyx + "," + this.m_dSyy + "," + this.m_dPx + "," + this.m_dPy;
		}


		function CPercentage(sValue) {
			{
				this.m_dValue = 0;
				if (sValue) {
					this.FromString(sValue);
				}
			}

		}

		CPercentage.prototype.GetValue = function () {
			return this.m_dValue;
		};
		CPercentage.prototype.SetValue = function (dValue) {
			this.m_dValue = dValue;
		};
		CPercentage.prototype.FromString = function (sValue) {
			let nPos = sValue.indexOf('%');
			let nLen = sValue.length;
			if (-1 === nPos || nPos !== sValue.length - 1 || nLen <= 0) {
				if (-1 === nPos) {
					let dValue = sValue.length === 0 ? 0 : parseFloat(sValue);
					if (Math.abs(dValue) >= 0 && Math.abs(dValue) <= 1) {
						this.m_dValue = dValue;
					} else {
						this.m_dValue = dValue / 1000.0;
					}
				} else
					this.m_dValue = 0;
			} else {
				let strValue = sValue.substr(0, nLen - 1);
				this.m_dValue = strValue.length === 0 ? 0 : parseFloat(strValue);
			}

			return this.m_dValue;
		};
		CPercentage.prototype.ToString = function () {
			return this.m_dValue + "%";
		};
		CPercentage.prototype.ToStringDecimalNumber = function () {
			let sResult = this.m_dValue * 1000.0 >> 0;

			return sResult;
		};

		function CVml_Vector2D_Units_Or_Percentage(sValue) {
			this.m_dX = 0;
			this.m_dY = 0;
			this.m_bUnitsX = true;
			this.m_bUnitsY = true;
			if (sValue) {
				this.FromString(sValue);
			}
		}

		CVml_Vector2D_Units_Or_Percentage.prototype.GetX = function () {
			return this.m_dX;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.GetY = function () {
			return this.m_dY;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.IsXinPoints = function () {
			return this.m_bUnitsX;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.IsYinPoints = function () {
			return this.m_bUnitsY;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.SetValue_Points = function (dX, dY) {
			this.m_dX = dX;
			this.m_dY = dY;

			this.m_bUnitsX = true;
			this.m_bUnitsY = true;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.FromString = function (sValue) {
			this.m_dX = 0;
			this.m_dY = 0;
			this.m_bUnitsX = true;
			this.m_bUnitsY = true;

			let nLen = sValue.length;
			if (nLen < 1)
				return 0;

			let nPos = sValue.indexOf(",");
			if (-1 === nPos)
				return 0;

			let sTemp = sValue.substr(0, nPos);
			if (-1 !== sTemp.indexOf('%')) {
				let oPerc = new CPercentage(sTemp);
				this.m_dX = oPerc.GetValue();
				this.m_bUnitsX = false;
			} else {
				let oPt = new CPoint(sTemp);
				this.m_dX = oPt.GetValue();
				this.m_bUnitsX = true;
			}

			sTemp = sValue.substr(nPos + 1, nLen - nPos - 1);
			if (-1 !== sTemp.indexOf('%')) {
				let oPerc = new CPercentage(sTemp);
				this.m_dY = oPerc.GetValue();
				this.m_bUnitsY = false;
			} else {
				let oPt = new CPoint(sTemp);
				this.m_dY = oPt.GetValue();
				this.m_bUnitsY = true;
			}

			return 0;
		};
		CVml_Vector2D_Units_Or_Percentage.prototype.ToString = function () {
			let sResult = this.m_dX + "";

			if (this.m_bUnitsX) sResult += "pt,";
			else sResult += "%,";

			sResult += this.m_dY;

			if (this.m_bUnitsY) sResult += "pt";
			else sResult += "%";

			return sResult;
		};


		function CVml_1_65536_Or_Percentage(sVal) {
			this.m_dValue = 0;
			if (sVal) {
				this.FromString(sVal);
			}
		}

		CVml_1_65536_Or_Percentage.prototype.GetValue = function () {
			return this.m_dValue;
		};

		CVml_1_65536_Or_Percentage.prototype.SetValue = function (dValue) {
			this.m_dValue = Math.max(0.0, Math.min(1.0, dValue));
		};

		CVml_1_65536_Or_Percentage.prototype.SetValue = function (nValue) {
			this.m_dValue = Math.max(0.0, Math.min(65536.0, nValue)) / 65536.0;
		};
		CVml_1_65536_Or_Percentage.prototype.SetPercentage = function (dValue) {
			this.m_dValue = Math.max(0.0, Math.min(100.0, dValue)) / 100.0;
		};

		CVml_1_65536_Or_Percentage.prototype.FromString = function (sValue) {
			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let bFraction = ('f' === sValue.charAt(nLen - 1));
			let bPercentage = ('%' === sValue.charAt(nLen - 1));

			if (bFraction) {
				let strValue = sValue.substr(0, nLen - 1);
				let nValue = strValue.length === 0 ? 0 : parseInt(strValue);

				this.SetValue(nValue);
			} else if (bPercentage) {
				let strValue = sValue.substr(0, nLen - 1);
				let dValue = strValue.length === 0 ? 0 : parseFloat(strValue);
				this.SetPercentage(dValue);
			} else {
				let dValue = sValue.length === 0 ? 0 : parseFloat(sValue);
				this.SetValue(dValue);
			}

			return this.m_dValue;
		};

		CVml_1_65536_Or_Percentage.prototype.ToString = function () {
			return this.m_dValue + "";
		};


		function CVml_Vector3D_65536(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVml_Vector3D_65536.prototype.fromString = function (sValue) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			if (-1 === nPos) {//only x position
				let strX = sValue;
				strX.replace("@", "");

				this.m_nX = strX.length === 0 ? 0 : parseInt(strX);
				return 0;
			}
			let strX = sValue.substr(0, nPos);
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);

			let nPos2 = sValue.indexOf(",", nPos + 1);
			if (-1 === nPos2) {// only x, y position
				let strY = sValue.substr(nPos + 1);
				strY.replace("@", "");
				this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
				return 0;
			}

			let strY = sValue.substr(nPos + 1, nPos2 - nPos - 1);
			let strZ = sValue.substr(nPos2 + 1, nLen - nPos2 - 1);

			strY.replace("@", "");
			strZ.replace("@", "");

			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
			this.m_nZ = strZ.length === 0 ? 0 : parseInt(strZ);
		};

		function CVml_Vector3D(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVml_Vector3D.prototype.fromString = function (sValue) {
			this.m_nX = 0;
			this.m_nY = 0;
			this.m_nZ = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			if (-1 === nPos) {//only x position
				let strX = sValue;
				strX.replace("@", "");

				this.m_nX = strX.length === 0 ? 0 : parseInt(strX);
				return 0;
			}
			let strX = sValue.substr(0, nPos);
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);

			let nPos2 = sValue.indexOf(",", nPos + 1);
			if (-1 === nPos2) {// only x, y position
				let strY = sValue.substr(nPos + 1);
				strY.replace("@", "");
				this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
				return 0;
			}

			let strY = sValue.substr(nPos + 1, nPos2 - nPos - 1);
			let strZ = sValue.substr(nPos2 + 1, nLen - nPos2 - 1);

			strY.replace("@", "");
			strZ.replace("@", "");

			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
			this.m_nZ = strZ.length === 0 ? 0 : parseInt(strZ);
		};


		function CVml_Vector2D(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVml_Vector2D.prototype.fromString = function (sValue) {
			this.m_nX = 0;
			this.m_nY = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");

			let strX, strY;
			if (-1 === nPos) {//only x coord
				strX = sValue;
			} else {
				strX = sValue.substr(0, nPos);
				strY = sValue.substr(nPos + 1, nLen - nPos - 1);
			}
			strY.replace("@", "");
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseInt(strX);
			this.m_nY = strY.length === 0 ? 0 : parseInt(strY);
		};

		function CVml_Vector2D_F(sVal) {
			this.m_nX = 0;
			this.m_nY = 0;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVml_Vector2D_F.prototype.fromString = function (sValue) {
			this.m_nX = 0;
			this.m_nY = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");

			let strX, strY;
			if (-1 === nPos) {//only x coord
				strX = sValue;
			} else {
				strX = sValue.substr(0, nPos);
				strY = sValue.substr(nPos + 1, nLen - nPos - 1);
			}
			strY.replace("@", "");
			strX.replace("@", "");

			this.m_nX = strX.length === 0 ? 0 : parseFloat(strX);
			this.m_nY = strY.length === 0 ? 0 : parseFloat(strY);
		};

		let EInsetMode =
			{
				insetmodeAuto: 0,
				insetmodeCustom: 1
			};

		//--------------------------------------------------------------------------------
		let EBWMode =
			{
				bwmodeAuto: 0,
				bwmodeBlack: 1,
				bwmodeBlackTextAndLines: 2,
				bwmodeColor: 3,
				bwmodeGrayOutline: 4,
				bwmodeGrayScale: 5,
				bwmodeHide: 6,
				bwmodeHighContrast: 7,
				bwmodeInverseGray: 8,
				bwmodeLightGrayscale: 9,
				bwmodeUndrawn: 10,
				bwmodeWhite: 11
			};


		let EColorMode =
			{
				colormodeAuto: 0,
				colormodeCustom: 1
			};

		function readColorMode(reader) {
			let sVal = reader.GetValue()
			switch (sVal) {
				case "auto": {
					return EColorMode.colormodeAuto;
				}
				case "custom": {
					return EColorMode.colormodeCustom;
				}
			}
			return null;
		}

		function readInsetMode(reader) {

			let sVal = reader.GetValue()
			switch (sVal) {
				case "auto": {
					return EInsetMode.insetmodeAuto;
				}
				case "custom": {
					return EInsetMode.insetmodeCustom;
				}
			}
			return null;
		}

		function readColorType(reader) {
			return new CColor(reader.GetValue());
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
			return readColorType(reader);
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
				}
				case "black": {
					return EBWMode.bwmodeBlack;
				}
				case "blackTextAndLines": {
					return EBWMode.bwmodeBlackTextAndLines;
				}
				case "color": {
					return EBWMode.bwmodeColor;
				}
				case "grayOutline": {
					return EBWMode.bwmodeGrayOutline;
				}
				case "grayScale": {
					return EBWMode.bwmodeGrayScale;
				}
				case "hide": {
					return EBWMode.bwmodeHide;
				}
				case "highContrast": {
					return EBWMode.bwmodeHighContrast;
				}
				case "inverseGray": {
					return EBWMode.bwmodeInverseGray;
				}
				case "lightGrayscale": {
					return EBWMode.bwmodeLightGrayscale;
				}
				case "undrawn": {
					return EBWMode.bwmodeUndrawn;
				}
				case "white": {
					return EBWMode.bwmodeWhite;
				}
			}
			return null;
		};
		CVmlCommonElements.prototype.readAttrXml = function (name, reader) {
			if ("alt" === name) this.m_sAlt = reader.GetValue();
			else if ("chromakey" === name) this.m_oChromaKey = this.readColor(reader);
			else if ("class" === name) this.m_sClass = reader.GetValue();
			else if ("coordorigin" === name) this.m_oCoordOrigin = this.readVector2D(reader);
			else if ("coordsize" === name) this.m_oCoordSize = this.readVector2D(reader);
			else if ("fillcolor" === name) this.m_oFillColor = this.readColor(reader);
			else if ("filled" === name) this.m_oFilled = reader.GetValueBool();
			else if ("href" === name) this.m_sHref = reader.GetValue();
			else if ("id" === name) this.m_sId = reader.GetValue();
			else if ("insetpen" === name) this.m_oInsetPen = reader.GetValueBool();
			else if ("allowincell" === name) this.m_oAllowInCell = reader.GetValueBool();
			else if ("allowoverlap" === name) this.m_oAllowOverlap = reader.GetValueBool();
			else if ("opacity" === name) {
				this.m_oOpacity = readCVml_1_65536(reader);
			} else if ("borderbottomcolor" === name) this.m_oBorderBottomColor = this.readColor(reader);
			else if ("borderleftcolor" === name) this.m_oBorderLeftColor = this.readColor(reader);
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
			} else if ("hrnoshade" === name) this.m_oHrNoShade = reader.GetValueBool();
			else if ("hrpct" === name) this.m_oHrPct = reader.GetValueDouble();
			else if ("hrstd" === name) this.m_oHrStd = reader.GetValueBool();
			else if ("insetmode" === name) {
				this.m_oInsetMode = readInsetMode(reader);
			} else if ("ole" === name) this.m_oOle = reader.GetValueBool();
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
			if (oItem) {
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
			let sValue = reader.GetValue();
			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let bFraction = ('f' === sValue.charAt(nLen - 1));

			if (bFraction) {
				let strValue = sValue.substr(0, nLen - 1);
				let nValue = strValue.length === 0 ? 0 : parseInt(strValue);

				return Math.max(0.0, Math.min(65536.0, nValue)) / 65536.0;
			} else {
				let dValue = sValue.length === 0 ? 0 : parseFloat(sValue);
				return Math.max(0.0, Math.min(1.0, dValue));
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
			this.m_oFrom = null;
			this.m_oControl1 = null;
			this.m_oControl2 = null;
			this.m_oTo = null;
		}

		IC(CCurve, CVmlCommonElements, 0);
		CCurve.prototype.readAttrXml = function (name, reader) {
			if ("control1" === name) {
				this.m_oControl1 = new CVml_Vector2D_Units(reader.GetValue());
				return;
			} else if ("control2" === name) {
				this.m_oControl2 = new CVml_Vector2D_Units(reader.GetValue());
				return;
			} else if ("from" === name) {
				this.m_oFrom = new CVml_Vector2D_Units(reader.GetValue());
				return;
			} else if ("to" === name) {
				this.m_oTo = new CVml_Vector2D_Units(reader.GetValue());
				return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
		};
		CCurve.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};


		let EEditAs =
			{
				editasBullseye: 0,
				editasCanvas: 1,
				editasCycle: 2,
				editasOrgchart: 3,
				editasRadial: 4,
				editasStacked: 5,
				editasVenn: 6
			};

		function readEditAs(reader) {
			let sValue = reader.GetValue();
			if (("bullseye") === sValue) return EEditAs.editasBullseye;
			else if (("canvas") === sValue) return EEditAs.editasCanvas;
			else if (("cycle") === sValue) return EEditAs.editasCycle;
			else if (("orgchart") === sValue) return EEditAs.editasOrgchart;
			else if (("radial") === sValue) return EEditAs.editasRadial;
			else if (("stacked") === sValue) return EEditAs.editasStacked;
			else if (("venn") === sValue) return EEditAs.editasVenn;
			return EEditAs.editasCanvas;
		}


		function CVml_TableLimits(sValue) {
			this.m_arrLimits = [];
			if (sValue) {
				this.FromString(sValue);
			}
		}

		CVml_TableLimits.prototype.GetSize = function () {
			return this.m_arrLimits.length;
		};
		CVml_TableLimits.prototype.GetAt = function (nIndex) {
			if (nIndex < 0 || nIndex >= this.m_arrLimits.length)
				return 0;

			return this.m_arrLimits[nIndex];
		};
		CVml_TableLimits.prototype.AddValue = function (dValue) {
			this.m_arrLimits.push(dValue);
		};
		CVml_TableLimits.prototype.FromString = function (sValue) {
			let nPos = 0;
			let nLen = sValue.length;

			let nSpacePos = 0;
			let wChar;
			while (nPos < nLen) {
				while (' ' === (wChar = sValue.charAt(nPos))) {
					nPos++;
					if (nPos >= nLen)
						return 0;
				}

				nSpacePos = sValue.indexOf(" ", nPos);
				if (-1 === nSpacePos)
					nSpacePos = nLen;

				let oPoint = new CPoint(sValue.substr(nPos, nSpacePos - nPos));
				nPos = nSpacePos + 1;

				this.m_arrLimits.push(oPoint.ToPoints());
			}

			return 0;
		};
		CVml_TableLimits.prototype.ToString = function () {
			let sResult;

			for (let nIndex = 0; nIndex < this.m_arrLimits.length; nIndex++) {
				sResult += (this.m_arrLimits[nIndex] + "pt ");
			}

			return sResult;
		}

		function CVml_TableProperties(sValue) {

			this.m_eValue = 0;
			if (sValue) {
				this.FromString(sValue);
			}
		}


		CVml_TableProperties.prototype.FromString = function (sValue) {
			this.m_eValue = parseInt(sValue);
			return this.m_eValue;
		};

		CVml_TableProperties.prototype.ToString = function () {
			return this.m_eValue + "";
		};

		CVml_TableProperties.prototype.IsTable = function () {
			return (this.m_eValue & 1 ? true : false);
		};

		CVml_TableProperties.prototype.IsPlaceholder = function () {
			return (this.m_eValue & 2 ? true : false);
		};

		CVml_TableProperties.prototype.IsBiDirectionalText = function () {
			return (this.m_eValue & 4 ? true : false);
		};

		function CGroup() {
			CVmlCommonElements.call(this);
			this.m_oEditAs = null;
			this.m_oTableLimits = null;
			this.m_oTableProperties = null;
		}

		IC(CGroup, CVmlCommonElements, 0);

		CGroup.prototype.readAttrXml = function (name, reader) {
			if (("editas") === name) {
				this.m_oEditAs = readEditAs(reader);
				return;
			} else if (("tableproperties") === name) {
				this.m_oTableProperties = new CVml_TableProperties(reader.GetValue());
				return;
			} else if (("tablelimits") === name) {
				this.m_oTableLimits = new CVml_TableLimits(reader.GetValue());
				return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
		};
		CGroup.prototype.readChildXml = function (name, reader) {
			let oItem = null;
			if (("callout") === name)
				oItem = new CCallout();
			else if (("clippath") === name)
				oItem = new CClipPath();
			else if (("diagram") === name)
				oItem = new CDiagram();
			else if (("extrusion") === name)
				oItem = new CExtrusion();
			else if (("lock") === name)
				oItem = new CLock();
			else if (("signatureline") === name)
				oItem = new CSignatureLine();
			else if (("skew") === name)
				oItem = new CSkew();
			else if (("arc") === name)
				oItem = new CArc();
			else if (("curve") === name)
				oItem = new CCurve();
			else if (("fill") === name)
				oItem = new CFill();
			else if (("formulas") === name)
				oItem = new CFormulas();
			else if (("group") === name)
				oItem = new CGroup();
			else if (("handles") === name)
				oItem = new CHandles();
			else if (("imagedata") === name)
				oItem = new CImageData();
			else if (("image") === name)
				oItem = new CImage();
			else if (("line") === name)
				oItem = new CLine();
			else if (("oval") === name)
				oItem = new COval();
			else if (("path") === name)
				oItem = new CPath();
			else if (("polyline") === name)
				oItem = new CPolyLine();
			else if (("rect") === name)
				oItem = new CRect();
			else if (("roundrect") === name)
				oItem = new CRoundRect();
			else if (("shadow") === name)
				oItem = new CShadow();
			else if (("shape") === name)
				oItem = new CShape();
			else if (("shapetype") === name)
				oItem = new CShapeType();
			else if (("stroke") === name)
				oItem = new CStroke();
			else if (("textbox") === name)
				oItem = new CTextbox();
			else if (("textpath") === name)
				oItem = new CTextPath();
			else if (("anchorLock") === name)
				oItem = new CAnchorLock();
			else if (("borderbottom") === name)
				oItem = new CBorder();
			else if (("borderleft") === name)
				oItem = new CBorder();
			else if (("borderright") === name)
				oItem = new CBorder();
			else if (("bordertop") === name)
				oItem = new CBorder();
			else if (("wrap") === name)
				oItem = new CWrap();
			else if (("ClientData") === name)
				oItem = new CClientData();

			if (oItem) {
				oItem.fromXml(reader);
				this.items.push(oItem);
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
			this.m_sSrc = null;
			this.m_oCropLeft = null;
			this.m_oCropTop = null;
			this.m_oCropRight = null;
			this.m_oCropBottom = null;
			this.m_oGain = null;
			this.m_oBlackLevel = null;
			this.m_oGamma = null;
			this.m_oGrayscale = null;
			this.m_oBiLevel = null;
		}

		IC(CImage, CVmlCommonElements, 0);
		CImage.prototype.readAttrXml = function (name, reader) {
			if (("bilevel") === name) {
				this.m_oBiLevel = reader.GetValueBool();
				return;
			} else if (("blacklevel") === name) {
				this.m_oBlackLevel = reader.GetValueDouble();
				return;
			} else if (("cropleft") === name) {
				this.m_oCropLeft = readCVml_1_65536(reader);
				return;
			} else if (("croptop") === name) {
				this.m_oCropTop = readCVml_1_65536(reader);
				return;
			} else if (("cropright") === name) {
				this.m_oCropRight = readCVml_1_65536(reader);
				return;
			} else if (("cropbottom") === name) {
				this.m_oCropBottom = readCVml_1_65536(reader);
				return;
			} else if (("gain") === name) {
				this.m_oGain = reader.GetValueDouble();
				return;
			} else if (("gamma") === name) {
				this.m_oGamma = reader.GetValueDouble();
				return;
			} else if (("grayscale") === name) {
				this.m_oGrayscale = reader.GetValueBool();
				return;
			} else if (("src") === name) {
				this.m_sSrc = reader.GetValue();
				return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
		};
		CImage.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		function CLine() {
			CVmlCommonElements.call(this);
			this.m_oFrom = null;
			this.m_oTo = null;
		}

		IC(CLine, CVmlCommonElements, 0);
		CLine.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "from":
					this.m_oFrom = new CVml_Vector2D_Units(reader.GetValue());
					return;
				case "to":
					this.m_oTo = new CVml_Vector2D_Units(reader.GetValue());
					return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
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

		function CPolyLine() {
			CVmlCommonElements.call(this);
			this.m_oPoints = null;
		}

		IC(CPolyLine, CVmlCommonElements, 0);
		CPolyLine.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "points":
					this.m_oPoints = new CVml_Polygon2D_Units(reader.GetValue());
					return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
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

		function CRoundRect() {
			CVmlCommonElements.call(this);

			this.m_oArcSize = null;
		}

		IC(CRoundRect, CVmlCommonElements, 0);
		CRoundRect.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "arcsize":
					this.m_oArcSize = new CVml_1_65536_Or_Percentage(reader.GetValue());
					return;
			}
			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
		};
		CRoundRect.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CRoundRect.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CShape() {
			CVmlCommonElements.call(this);
			this.m_sType = null;
			this.m_sAdj = null;
			this.m_oPath = null;
			this.m_sGfxData = null;
			this.m_sEquationXML = null;
		}

		IC(CShape, CVmlCommonElements, 0);
		CShape.prototype.readAttrXml = function (name, reader) {
			if (("adj") === name) {
				this.m_sAdj = reader.GetValue();
				return;
			}
			if (("equationxml") === name) {
				this.m_sEquationXML = reader.GetValue();
				return;
			}
			if (("gfxdata") === name) {
				this.m_sGfxData = reader.GetValue();
				return;
			}
			if (("path") === name) {
				this.m_oPath = reader.GetValue();
				return;
			}
			if (("type") === name) {
				this.m_sType = reader.GetValue();
				return;
			}

			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
		};
		CShape.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		function CShapeType() {
			CVmlCommonElements.call(this);
			this.m_sAdj = null;
			this.m_oPath = null;
			this.m_oMaster = null;
		}

		IC(CShapeType, CVmlCommonElements, 0);
		CShapeType.prototype.readAttrXml = function (name, reader) {

			if (("adj") === name) {
				this.m_sAdj = reader.GetValue();
				return;
			}
			if (("path") === name) {
				this.m_oPath = reader.GetValue();
				return;
			}
			if (("master") === name) {
				this.m_oMaster = reader.GetValueBool();
				return;
			}

			CVmlCommonElements.prototype.readAttrXml.call(this, name, reader);
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
				vmlangle30: 0,
				vmlangle45: 1,
				vmlangle60: 2,
				vmlangle90: 3,
				vmlangleAny: 4,
				vmlangleAuto: 5
			};


		let EExt =
			{
				extBackwardCompatible: 0,
				extEdit: 1,
				extView: 2,
			};

		let EVmlCalloutType =
			{
				vmlcallouttypeRectangle: 0,
				vmlcallouttypeRoundRectangle: 1,
				vmlcallouttypeOval: 2,
				vmlcallouttypeCloud: 3
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

		function CDiagram() {
			CBaseNoId.call(this);
			this.m_oAutoFormat = null;
			this.m_oAutoLayout = null;
			this.m_sConstrainbounds = null;
			this.m_oDmgBaseTextScale = null;
			this.m_oDmgFontSize = null;
			this.m_oDmgScaleX = null;
			this.m_oDmgScaleY = null;
			this.m_oDmgStyle = null;
			this.m_oExt = null;
			this.m_oReverse = null;

			this.m_oRelationTable;
		}

		IC(CDiagram, CBaseNoId, 0);
		CDiagram.prototype.readAttrXml = function (name, reader) {
			if (("autoformat") === name) {
				this.m_oAutoFormat = reader.GetValueBool();
				return;
			}
			if (("autolayout") === name) {
				this.m_oAutoLayout = reader.GetValueBool();
				return;
			}
			if (("constrainbounds") === name) {
				this.m_sConstrainbounds = reader.GetValue();
				return;
			}
			if (("dgmbasetextscale") === name) {
				this.m_oDmgBaseTextScale = reader.GetValueInt();
				return;
			}
			if (("dgmfontsize") === name) {
				this.m_oDmgFontSize = reader.GetValueInt();
				return;
			}
			if (("dgmscalex") === name) {
				this.m_oDmgScaleX = reader.GetValueInt();
				return;
			}
			if (("dgmscaley") === name) {
				this.m_oDmgScaleY = reader.GetValueInt();
				return;
			}
			if (("dgmstyle") === name) {
				this.m_oDmgStyle = reader.GetValueInt();
				return;
			}
			if (("ext") === name) {
				this.m_oExt = readExt(reader);
				return;
			}
			if (("reverse") === name) {
				this.m_oReverse = reader.GetValueBool();
			}
		};
		CDiagram.prototype.readChildXml = function (name, reader) {
			if ("relationtable" === name)
				this.m_oRelationTable = reader.GetTextDecodeXml();
		};
		CDiagram.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CDiagram.prototype.writeChildren = function (writer) {
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
				}
				case "edit": {
					return EExt.extEdit;
				}
				case "view": {
					return EExt.extView;
				}
			}
			return null;
		}

		function readExtrusionType(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "parallel":
					return EExtrusionType.extrusiontypeParallel;
				case "extrusiontypeParallel":
					return EExtrusionType.extrusiontypePerspective;
			}
			return EExtrusionType.extrusiontypeParallel;
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
					this.m_oRotationAngle = new CVml_Vector2D(reader.GetValue());
					break;
				}
				case "rotationcenter": {
					this.m_oRotationCenter = new CVml_Vector3D(reader.GetValue());
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
		CExtrusion.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		function CLock() {
			CBaseNoId.call(this);
		}

		IC(CLock, CBaseNoId, 0);
		CLock.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "adjusthandles":
					this.m_oAdjustHandles = reader.GetValueBool();
					break;
				case "aspectratio":
					this.m_oAspectRatio = reader.GetValueBool();
					break;
				case "cropping":
					this.m_oCropping = reader.GetValueBool();
					break;
				case "ext":
					this.m_oExt = readExt(reader);
					break;
				case "grouping":
					this.m_oGrouping = reader.GetValueBool();
					break;
				case "position":
					this.m_oPosition = reader.GetValueBool();
					break;
				case "rotation":
					this.m_oRotation = reader.GetValueBool();
					break;
				case "selection":
					this.m_oSelection = reader.GetValueBool();
					break;
				case "shapetype":
					this.m_oShapeType = reader.GetValueBool();
					break;
				case "text":
					this.m_oText = reader.GetValueBool();
					break;
				case "ungrouping":
					this.m_oUnGrouping = reader.GetValueBool();
					break;
				case "verticies":
					this.m_oVerticies = reader.GetValueBool();
					break;
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
				case "addlxml":
					this.m_sAddXml = reader.GetValue();
					break;
				case "allowcomments":
					this.m_oAllowComments = reader.GetValueBool();
					break;
				case "ext":
					this.m_oExt = readExt(reader);
					break;
				case "id":
					this.m_oId = reader.GetValue();
					break;
				case "issignatureline":
					this.m_oIsSignatureLine = reader.GetValueBool();
					break;
				case "provid":
					this.m_oProvId = reader.GetValue();
					break;
				case "showsigndate":
					this.m_oShowSignDate = reader.GetValueBool();
					break;
				case "signinginstructions":
					this.m_sSigningInstructions = reader.GetValue();
					break;
				case "signinginstructionsset":
					this.m_oSigningInstructionsSet = reader.GetValueBool();
					break;
				case "sigprovurl":
					this.m_sSigProvUrl = reader.GetValue();
					break;
				case "suggestedsigner":
					this.m_sSuggestedSigner = reader.GetValue();
					break;
				case "suggestedsigner2":
					this.m_sSuggestedSigner2 = reader.GetValue();
					break;
				case "suggestedsigneremail":
					this.m_sSuggestedSignerEmail = reader.GetValue();
					break;
			}
		};
		CSignatureLine.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		function CSkew() {
			CBaseNoId.call(this);
		}

		IC(CSkew, CBaseNoId, 0);
		CSkew.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "ext":
					this.m_oExt = readExt(reader.GetValue());
					break;
				case "id":
					this.m_sId = reader.GetValue();
					break;
				case "matrix":
					this.m_sMatrix = reader.GetValue();
					break;
				case "offset":
					this.m_sOffset = reader.GetValue();
					break;
				case "on":
					this.m_oOn = reader.GetValueBool();
					break;
				case "origin":
					this.m_sOrigin = reader.GetValue();
					break;
			}
		};
		CSkew.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CSkew.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


		let EFillType =
			{
				filltypeBackground: 0,
				filltypeFrame: 1,
				filltypeGradient: 2,
				filltypeGradientCenter: 3,
				filltypeGradientRadial: 4,
				filltypeGradientUnscaled: 5,
				filltypePattern: 6,
				filltypeSolid: 7,
				filltypeTile: 8
			};

		function readFillType(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "background":
					return EFillType.filltypeBackground;
				case "frame":
					return EFillType.filltypeFrame;
				case "gradient":
					return EFillType.filltypeGradient;
				case "gradientCenter":
					return EFillType.filltypeGradientCenter;
				case "gradientRadial":
					return EFillType.filltypeGradientRadial;
				case "gradientUnscaled":
					return EFillType.filltypeGradientUnscaled;
				case "pattern":
					return EFillType.filltypePattern;
				case "solid":
					return EFillType.filltypeSolid;
				case "tile":
					return EFillType.filltypeTile;
			}
			return EFillType.filltypeSolid;
		}

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
				case "vext":
					this.m_oExt = readExt(reader);
					break;
				case "type":
					this.m_oType = readFillType(reader);
					break;
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
			this.items = [];
		}

		IC(CFormulas, CBaseNoId, 0);
		CFormulas.prototype.readAttrXml = function (name, reader) {
			switch (name) {
			}
		};
		CFormulas.prototype.readChildXml = function (name, reader) {
			switch (name) {
				case "f": {
					let oF = new CF();
					oF.fromXml(reader);
					this.items.push(oF);
					break;
				}
			}
		};
		CFormulas.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CFormulas.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CF() {
			CBaseNoId.call(this);
			this.m_sEqn = null;
		}

		IC(CF, CBaseNoId, 0);
		CF.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "eqn": {
					this.m_sEqn = reader.GetValue();
					break;
				}
			}
		};
		CF.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};


		function CHandles() {
			CBaseNoId.call(this);
			this.items = [];
		}

		IC(CHandles, CBaseNoId, 0);
		CHandles.prototype.readChildXml = function (name, reader) {
			switch (name) {
				case "h": {
					let oPr = new CH();
					oPr.fromXml(reader);
					this.items.push(oPr);
					break;
				}
			}
		};
		CHandles.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


		let EVml_Vector2D_Position =
			{
				vmlvector2dposConstant: 0,
				vmlvector2dposFormula: 1,
				vmlvector2dposAdjValue: 2,
				vmlvector2dposCenter: 3,
				vmlvector2dposTopLeft: 4,
				vmlvector2dposBottomRight: 5
			};

		function CVml_Vector2D_Position(sVal) {
			this.m_eTypeX = null;
			this.m_eTypeY = null;

			this.m_sIdX = null;
			this.m_sIdY = null;

			this.m_dX = null;
			this.m_dY = null;
			if (sVal) {
				this.fromString(sVal);
			}
		}

		CVml_Vector2D_Position.prototype.fromString = function (sValue) {
			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			if (-1 === nPos)
				return 0;

			let sFirst = sValue.substr(0, nPos);
			let sSecond = sValue.substr(nPos + 1, nLen - nPos - 1);

			this.parse(sFirst, true);
			this.parse(sSecond, false);

			return 0;
		};
		CVml_Vector2D_Position.prototype.parse = function (sValue, bFirst) {
			let eValue = EVml_Vector2D_Position.vmlvector2dposConstant;
			let dValue = 0.0;
			let sId;
			sValue.replace(" ", "");
			let nLen = sValue.length;
			if (nLen > 0) {

				let wChar = sValue[0];
				switch (wChar) {
					case '0':
					case '1':
					case '2':
					case '3':
					case '4':
					case '5':
					case '6':
					case '7':
					case '8':
					case '9':
					case '.':
						eValue = EVml_Vector2D_Position.vmlvector2dposConstant;
						dValue = sValue.length === 0 ? 0 : parseFloat(sValue);
						break;
					case 'c':

						if ("center" === sValue)
							eValue = EVml_Vector2D_Position.vmlvector2dposCenter;
						break;
					case 't':
						if ("topleft" === sValue)
							eValue = EVml_Vector2D_Position.vmlvector2dposTopLeft;
						break;
					case 'b':
						if ("bottomright" === sValue)
							eValue = EVml_Vector2D_Position.vmlvector2dposBottomRight;
						break;
					case '@':
						eValue = EVml_Vector2D_Position.vmlvector2dposFormula;
						sId = sValue.substr(1, nLen - 1);
						break;
					case '#':
						eValue = EVml_Vector2D_Position.vmlvector2dposAdjValue;
						sId = sValue.substr(1, nLen - 1);
						break;
				}
			}
			if (bFirst) {
				this.m_eTypeX = eValue;
				this.m_sIdX = sId;
				this.m_dX = dValue;
			} else {
				this.m_eTypeY = eValue;
				this.m_sIdY = sId;
				this.m_dY = dValue;
			}
		};


		function CVml_Polygon2D_Units(val) {
			this.m_arrPoints = [];
			this.m_wcDelimiter = " ";
			if (val) {
				if (val instanceof CVml_Polygon2D_Units) {
					this.m_wcDelimiter = " ";
					this.FromString(val.ToString());
				} else {
					this.FromString(val);
				}
			}
		}

		CVml_Polygon2D_Units.prototype.SetDelimiter = function (wcNew) {
			this.m_wcDelimiter = wcNew;
		};
		CVml_Polygon2D_Units.prototype.GetX = function (nIndex) {
			if (nIndex < 0 || nIndex >= this.m_arrPoints.length)
				return 0;

			return this.m_arrPoints[nIndex].dX;
		};
		CVml_Polygon2D_Units.prototype.GetY = function (nIndex) {
			if (nIndex < 0 || nIndex >= this.m_arrPoints.length)
				return 0;

			return this.m_arrPoints[nIndex].dY;
		};

		CVml_Polygon2D_Units.prototype.AddPoint = function (dX, dY) {
			TPoint
			oPt(dX, dY);
			this.m_arrPoints.push(oPt);
		};

		CVml_Polygon2D_Units.prototype.FromString = function (sValue) {
			this.m_arrPoints.length = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nStartPos = 0;
			while (true) {
				let nMidPos = sValue.indexOf(",", nStartPos);
				let nEndPos = sValue.indexOf(this.m_wcDelimiter, nMidPos + 1);

				if (-1 === nMidPos)
					break;

				if (-1 === nEndPos)
					nEndPos = nLen;

				let strX = sValue.substr(nStartPos, nMidPos - nStartPos);
				let strY = sValue.substr(nMidPos + 1, nEndPos - nMidPos - 1);

				strX.replace("@", "");
				strY.replace("@", "");

				let nX = strX.length === 0 ? 0 : parseInt(strX);
				let nY = strY.length === 0 ? 0 : parseInt(strY);

				this.m_arrPoints.push(new TPoint(nX, nY));

				nStartPos = nEndPos + 1;
			}


			return 0;
		};

		CVml_Polygon2D_Units.prototype.ToString = function () {
			let sResult;

			for (let nIndex = 0; nIndex < this.m_arrPoints.length; nIndex++) {
				sResult += this.m_arrPoints[nIndex].dX + "," + this.m_arrPoints[nIndex].dY;
				if (nIndex < this.m_arrPoints.length - 1)
					sResult += this.m_wcDelimiter;
			}

			return sResult;
		};


		function CH() {
			CBaseNoId.call(this);
			this.m_oInvX = null;
			this.m_oInvY = null;
			this.m_oMap = null;
			this.m_oPolar = null;
			this.m_oPosition = null;
			this.m_oRadiusRange = null;
			this.m_oSwitch = null;
			this.m_oXRange = null;
			this.m_oYRange = null;
		}

		IC(CH, CBaseNoId, 0);
		CH.prototype.readAttrXml = function (name, reader) {
			if ("invx" === name) this.m_oInvX = reader.GetValueBool();
			else if ("invy" === name) this.m_oInvY = reader.GetValueBool();
			else if ("map" === name) this.m_oMap = new CVml_Vector2D(reader.GetValue());
			else if ("position" === name) this.m_oPosition = new CVml_Vector2D_Position(reader.GetValue());
			else if ("polar" === name) this.m_oPolar = new CVml_Vector2D(reader.GetValue());
			else if ("radiusrange" === name) this.m_oRadiusRange = new CVml_Vector2D(reader.GetValue());
			else if ("switch" === name) this.m_oSwitch = reader.GetValueBool();
			else if ("xrange" === name) this.m_oXRange = new CVml_Vector2D(reader.GetValue());
			else if ("yrange" === name) this.m_oYRange = new CVml_Vector2D(reader.GetValue());

		};
		CH.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		function CImageData() {
			CBaseNoId.call(this);
			this.m_sAltHref = null;
			this.m_oBiLevel = null;
			this.m_oBlackLevel = null;
			this.m_oChromaKey = null;
			this.m_oCropLeft = null;
			this.m_oCropTop = null;
			this.m_oCropRight = null;
			this.m_oCropBottom = null;
			this.m_oDetectMouseClick = null;
			this.m_oEmbossColor = null;
			this.m_oGain = null;
			this.m_oGamma = null;
			this.m_oGrayscale = null;
			this.m_rHref = null;
			this.m_oHref = null;
			this.m_rId = null;
			this.m_oId = null;
			this.m_oMovie = null;
			this.m_oOleId = null;
			this.m_rPict = null;
			this.m_oRecolorTarget = null;
			this.m_oRelId = null;
			this.m_sSrc = null;
			this.m_sTitle = null;
		}

		IC(CImageData, CBaseNoId, 0);
		CImageData.prototype.readAttrXml = function (name, reader) {
			if ("bilevel" === name) this.m_oBiLevel = reader.GetValueBool();
			else if ("blacklevel" === name) this.m_oBlackLevel = reader.GetValueDouble();
			else if ("cropleft" === name) this.m_oCropLeft = readCVml_1_65536(reader);
			else if ("croptop" === name) this.m_oCropTop = readCVml_1_65536(reader);
			else if ("cropright" === name) this.m_oCropRight = readCVml_1_65536(reader);
			else if ("cropbottom" === name) this.m_oCropBottom = readCVml_1_65536(reader);
			else if ("embosscolor" === name) this.m_oEmbossColor = readColorType(reader);
			else if ("gain" === name) this.m_oGain = reader.GetValueDouble();
			else if ("gamma" === name) this.m_oGamma = reader.GetValueDouble();
			else if ("grayscale" === name) this.m_oGrayscale = reader.GetValueBool();
			else if ("id" === name) {
				let sName = reader.GetName();
				if (sName === "id") {
					this.m_oId = reader.GetValue();
				} else if (sName === "r:id" || sName === "relationships:id") {
					this.m_rId = reader.GetValue();
				}
			} else if ("detectmouseclick" === name) this.m_oDetectMouseClick = reader.GetValue();
			else if ("href" === name) {
				let sName = reader.GetName();
				if (sName === "o:href") {
					this.m_oHref = reader.GetValue();
				} else if (sName === "r:href") {
					this.m_rHref = reader.GetValue();
				}
			} else if ("oleid" === name) this.m_oOleId = reader.GetValue();
			else if ("title" === name) this.m_sTitle = reader.GetValue();
			else if ("pict" === name) this.m_rPict = reader.GetValue();
			else if ("recolortarget" === name) this.m_oRecolorTarget = readColorType(reader);
			else if ("src" === name) this.m_sSrc = reader.GetValue();
		}
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


		function CVml_Polygon2D(sValue) {
			this.m_arrPoints = [];
			if (sValue) {
				this.FromString(sValue);
			}
		}


		CVml_Polygon2D.prototype.GetSize = function () {
			return this.m_arrPoints.length;
		}

		CVml_Polygon2D.prototype.GetX = function (nIndex) {
			if (nIndex < 0 || nIndex >= this.m_arrPoints.length)
				return 0;

			return this.m_arrPoints[nIndex].nX;
		}
		CVml_Polygon2D.prototype.GetY = function (nIndex) {
			if (nIndex < 0 || nIndex >= this.m_arrPoints.length)
				return 0;

			return this.m_arrPoints[nIndex].nY;
		}

		CVml_Polygon2D.prototype.AddPo = function (nX, nY) {
			let oPt = new TPoint(nX, nY);
			this.m_arrPoints.push(oPt);
		}

		CVml_Polygon2D.prototype.FromString = function (sValue) {
			this.m_arrPoints.length = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nStartPos = 0;
			while (true) {
				let nMidPos = sValue.indexOf(",", nStartPos);
				let nEndPos = sValue.indexOf(",", nMidPos + 1);

				if (-1 === nMidPos)
					break;

				if (-1 === nEndPos)
					nEndPos = nLen;

				let strX = sValue.substr(nStartPos, nMidPos - nStartPos);
				let strY = sValue.substr(nStartPos, nMidPos - nStartPos);

				strX.replace("@", "");
				strY.replace("@", "");

				let nX = strX.length === 0 ? 0 : parseInt(strX);
				let nY = strY.length === 0 ? 0 : parseInt(strY);

				this.m_arrPoints.push(new TPoint(nX, nY));

				nStartPos = nEndPos + 1;
			}


			return 0;
		}

		CVml_Polygon2D.prototype.ToString = function () {
			let sResult;

			for (let nIndex = 0; nIndex < this.m_arrPoints.length; nIndex++) {
				let sTemp = this.m_arrPoints[nIndex].nX + "," + this.m_arrPoints[nIndex].nY;
				if (nIndex < this.m_arrPoints.length - 1) sTemp += ",";
				sResult += sTemp;
			}

			return sResult;
		};

		function TPoint(n_X, n_Y) {
			this.nX = n_X;
			this.nY = n_Y;
		}


		function CVml_Vector2D_Units(sValue) {
			this.m_dX = 0;
			this.m_dY = 0;
			if (sValue) {
				this.fromString(sValue);
			}
		}

		CVml_Vector2D_Units.prototype.fromString = function (sValue) {
			this.m_dX = 0;
			this.m_dY = 0;

			let nLen = sValue.length;
			if (nLen <= 0)
				return 0;

			let nPos = sValue.indexOf(",");
			if (-1 === nPos) {//only x position
				let oPt1 = new CPoint(sValue);
				this.m_dX = oPt1.GetValue();
				return 0;
			}


			let oPt1 = new CPoint(sValue.substr(0, nPos));
			this.m_dX = oPt1.GetValue();


			let oPt2 = new CPoint(sValue.substr(nPos + 1, nLen - nPos - 1));
			this.m_dY = oPt2.GetValue();
			return 0;
		};


		let EConnectType =
			{
				connecttypeCustom: 0,
				connecttypeNone: 1,
				connecttypeRect: 2,
				connecttypeSegments: 3
			};

		function readConnectType(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "custom": {
					return EConnectType.connecttypeCustom;
				}
				case "none": {
					return EConnectType.connecttypeNone;
				}
				case "rect": {
					return EConnectType.connecttypeRect;
				}
				case "segments": {
					return EConnectType.connecttypeSegments;
				}
			}
		}

		function CPath() {
			CBaseNoId.call(this);
			this.m_oArrowOk = null;
			this.m_oConnectAngles = null;
			this.m_oConnectLocs = null;
			this.m_oConnectType = null;
			this.m_oExtrusionOk = null;
			this.m_oFillOk = null;
			this.m_oGradientShapeOk = null;
			this.m_oId = null;
			this.m_oInsetPenOk = null;
			this.m_oLimo = null;
			this.m_oShadowOk = null;
			this.m_oStrokeOk = null;
			this.m_oTextBoxRect = null;
			this.m_oTextPathOk = null;
			this.m_oV = null;
		}

		IC(CPath, CBaseNoId, 0);
		CPath.prototype.readAttrXml = function (name, reader) {
			if ("arrowok" === name) this.m_oArrowOk = reader.GetValueBool();
			else if ("fillok" === name) this.m_oFillOk = reader.GetValueBool();
			else if ("gradientshapeok" === name) this.m_oGradientShapeOk = reader.GetValueBool();
			else if ("id" === name) this.m_oId = reader.GetValue();
			else if ("insetpenok" === name) this.m_oInsetPenOk = reader.GetValueBool();
			else if ("limo" === name) this.m_oLimo = new CVml_Vector2D_Units(reader.GetValue());
			else if ("connectangles" === name) this.m_oConnectAngles = reader.GetValue();
			else if ("connectlocs" === name) this.m_oConnectLocs = reader.GetValue();
			else if ("connecttype" === name) this.m_oConnectType = readConnectType(reader);
			else if ("extrusionok" === name) this.m_oExtrusionOk = reader.GetValueBool();
			else if ("shadowok" === name) this.m_oShadowOk = reader.GetValueBool();
			else if ("strokeok" === name) this.m_oStrokeOk = reader.GetValueBool();
			else if ("textboxrect" === name) this.m_oTextBoxRect = new CVml_Polygon2D(reader.GetValue());
			else if ("textpathok" === name) this.m_oTextPathOk = reader.GetValue();
			else if ("v" === name) this.m_oV = reader.GetValue();
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

		let EShadowType =
			{
				shadowtypeDouble: 1,
				shadowtypeEmboss: 2,
				shadowtypePerspective: 3,
				shadowtypeSingle: 4
			};


		function readShadowType(reader) {
			let sVal = reader.GetValue();
			switch (sVal) {
				case "double" : {
					return EShadowType.shadowtypeDouble;
				}
				case "emboss" : {
					return EShadowType.shadowtypeEmboss;
				}
				case "perspective" : {
					return EShadowType.shadowtypePerspective;
				}
				case "single" : {
					return EShadowType.shadowtypeSingle;
				}
					return EShadowType.shadowtypeSingle;
			}
		}

		function CShadow() {
			CBaseNoId.call(this);
			this.m_oColor = null;
			this.m_oColor2 = null;
			this.m_oId = null;
			this.m_oMatrix = null;
			this.m_oObscured = null;
			this.m_oOffset = null;
			this.m_oOffset2 = null;
			this.m_oOn = null;
			this.m_oOpacity = null;
			this.m_oOrigin = null;
			this.m_oType = null;
		}

		IC(CShadow, CBaseNoId, 0);
		CShadow.prototype.readAttrXml = function (name, reader) {
			if ("color" === name) this.m_oColor = readColorType(reader);
			else if ("color2" === name) this.m_oColor2 = readColorType(reader);
			else if ("id" === name) this.m_oId = reader.GetValue();
			else if ("matrix" === name) this.m_oMatrix = new CVml_Matrix(reader.GetValue());
			else if ("obscured" === name) this.m_oObscured = reader.GetValueBool();
			else if ("offset" === name) this.m_oOffset = new CVml_Vector2D_Units_Or_Percentage(reader.GetValue());
			else if ("offset2" === name) this.m_oOffset2 = new CVml_Vector2D_Units_Or_Percentage(reader.GetValue());
			else if ("on" === name) this.m_oOn = reader.GetValueBool();
			else if ("opacity" === name) this.m_oOpacity = readCVml_1_65536(reader);
			else if ("origin" === name) this.m_oOrigin = new CVml_Vector2D_Units_Or_Percentage(reader.GetValue());
			else if ("type" === name) this.m_oType = readShadowType(reader);
		};
		CShadow.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};


		let EVmlDashStyle =
			{
				vmldashstyleSolid: 0,
				vmldashstyleShortDash: 1,
				vmldashstyleShortDot: 2,
				vmldashstyleShortDashDot: 3,
				vmldashstyleShortDashDotDot: 4,
				vmldashstyleDot: 5,
				vmldashstyleDash: 6,
				vmldashstyleLongDash: 7,
				vmldashstyleDashDot: 8,
				vmldashstyleLongDashDot: 9,
				vmldashstyleLongDashDotDot: 10,
				vmldashstyleCustom: 11
			};

		function readDashStyle(reader) {
			let sValue = reader.GetValue();
			if ("solid" === sValue) return EVmlDashStyle.vmldashstyleSolid;
			else if ("shortdash" === sValue) return EVmlDashStyle.vmldashstyleShortDash;
			else if ("shortdot" === sValue) return EVmlDashStyle.vmldashstyleShortDot;
			else if ("shortdashdot" === sValue) return EVmlDashStyle.vmldashstyleShortDashDot;
			else if ("shortdashdotdot" === sValue) return EVmlDashStyle.vmldashstyleShortDashDotDot;
			else if ("dot" === sValue) return EVmlDashStyle.vmldashstyleDot;
			else if ("dash" === sValue) return EVmlDashStyle.vmldashstyleDash;
			else if ("dashdot" === sValue) return EVmlDashStyle.vmldashstyleDashDot;
			else if ("longdash" === sValue) return EVmlDashStyle.vmldashstyleLongDash;
			else if ("longdashdot" === sValue) return EVmlDashStyle.vmldashstyleLongDashDot;
			else if ("longdashdotdot" === sValue) return EVmlDashStyle.vmldashstyleLongDashDotDot;
			return EVmlDashStyle.vmldashstyleSolid;
		}


		let EStrokeArrowLength =
			{
				strokearrowlengthLong: 0,
				strokearrowlengthMedium: 1,
				strokearrowlengthShort: 2
			};

		function readArrowLength(reader) {
			let sValue = reader.GetValue();
			if ("long" === sValue) return EStrokeArrowLength.strokearrowlengthLong;
			else if ("medium" === sValue) return EStrokeArrowLength.strokearrowlengthMedium;
			else if ("short" === sValue) return EStrokeArrowLength.strokearrowlengthShort;
			return EStrokeArrowLength.strokearrowlengthMedium
		}


		let EStrokeArrowType =
			{
				strokearrowtypeBlock: 0,
				strokearrowtypeClassic: 1,
				strokearrowtypeDiamond: 2,
				strokearrowtypeNone: 3,
				strokearrowtypeOpen: 4,
				strokearrowtypeOval: 5
			};

		function readArrowType(reader) {
			let sValue = reader.GetValue();
			if ("block" === sValue) return EStrokeArrowType.strokearrowtypeBlock;
			else if ("classic" === sValue) return EStrokeArrowType.strokearrowtypeClassic;
			else if ("diamond" === sValue) return EStrokeArrowType.strokearrowtypeDiamond;
			else if ("none" === sValue) return EStrokeArrowType.strokearrowtypeNone;
			else if ("open" === sValue) return EStrokeArrowType.strokearrowtypeOpen;
			else if ("oval" === sValue) return EStrokeArrowType.strokearrowtypeOval;
			return EStrokeArrowType.strokearrowtypeNone;
		}


		let EStrokeArrowWidth =
			{
				strokearrowwidthMedium: 0,
				strokearrowwidthNarrow: 1,
				strokearrowwidthWide: 2
			};

		function readArrowWidth(reader) {
			let sValue = reader.GetValue();
			if ("medium" === sValue) return EStrokeArrowWidth.strokearrowwidthMedium;
			else if ("narrow" === sValue) return EStrokeArrowWidth.strokearrowwidthNarrow;
			else if ("wide" === sValue) return EStrokeArrowWidth.strokearrowwidthWide;
			return EStrokeArrowWidth.strokearrowwidthMedium;
		}


		//--------------------------------------------------------------------------------
		let EStrokeEndCap =
			{
				strokeendcapFlat: 0,
				strokeendcapRound: 1,
				strokeendcapSqaure: 2
			};


		function readEndCap(reader) {
			let sValue = reader.GetValue();
			if ("flat" === sValue) return EStrokeEndCap.strokeendcapFlat;
			else if ("round" === sValue) return EStrokeEndCap.strokeendcapRound;
			else if ("square" === sValue) return EStrokeEndCap.strokeendcapSqaure;
			return EStrokeEndCap.strokeendcapRound;
		}


		let EStrokeJoinStyle =
			{
				strokejoinstyleBevel: 0,
				strokejoinstyleMiter: 1,
				strokejoinstyleRound: 2
			};

		function readJoinStyle(reader) {
			let sValue = reader.GetValue();
			if ("round" === sValue) return EStrokeJoinStyle.strokejoinstyleRound;
			else if ("miter" === sValue) return EStrokeJoinStyle.strokejoinstyleMiter;
			else if ("bevel" === sValue) return EStrokeJoinStyle.strokejoinstyleBevel;
			return EStrokeJoinStyle.strokejoinstyleRound;
		}


		let EStrokeLineStyle =
			{
				strokelinestyleSingle: 0,
				strokelinestyleThickBetweenThin: 1,
				strokelinestyleThickThin: 2,
				strokelinestyleThinThick: 3,
				strokelinestyleThinThin: 4
			};

		function readLineStyle(reader) {
			let sValue = reader.GetValue();
			if ("single" === sValue) return EStrokeLineStyle.strokelinestyleSingle;
			else if ("thickBetweenThin" === sValue) return EStrokeLineStyle.strokelinestyleThickBetweenThin;
			else if ("thickThin" === sValue) return EStrokeLineStyle.strokelinestyleThickThin;
			else if ("thinThick" === sValue) return EStrokeLineStyle.strokelinestyleThinThick;
			else if ("thinThin" === sValue) return EStrokeLineStyle.strokelinestyleThinThin;
			return EStrokeLineStyle.strokelinestyleSingle;
		}


		let EImageAspect =
			{
				imageaspectAtLeast: 0,
				imageaspectAtMost: 1,
				imageaspectIgnore: 2
			};

		function readImageAspect(reader) {
			let sValue = reader.GetValue();
			if ("atLeast" === sValue) return EImageAspect.imageaspectAtLeast;
			else if ("atMost" === sValue) return EImageAspect.imageaspectAtMost;
			else if ("ignore" === sValue) return EImageAspect.imageaspectIgnore;
			return EImageAspect.imageaspectIgnore;
		}

		function CStroke() {
			CBaseNoId.call(this);

			this.m_oId = null;
			this.m_sAltHref = null;
			this.m_oColor = null;
			this.m_oColor2 = null;
			this.m_oDahsStyle = null;
			this.m_oEndArrow = null;
			this.m_oEndArrowLength = null;
			this.m_oEndArrowWidth = null;
			this.m_oEndCap = null;
			this.m_oFillType = null;
			this.m_oForceDash = null;
			this.m_sHref = null;
			this.m_rId = null;
			this.m_oImageAlignShape = null;
			this.m_oImageAspect = null;
			this.m_oImageSize = null;
			this.m_oInsetPen = null;
			this.m_oJoinStyle = null;
			this.m_oLineStyle = null;
			this.m_oMiterLimit = null;
			this.m_oOn = null;
			this.m_oOpacity = null;
			this.m_oRelId = null;
			this.m_sSrc = null;
			this.m_oStartArrow = null;
			this.m_oStartArrowLength = null;
			this.m_oStartArrowWidth = null;
			this.m_sTitle = null;
			this.m_oWeight = null;

			// Childs
			this.m_oLeft = null;
			this.m_oTop = null;
			this.m_oRight = null;
			this.m_oBottom = null;
			this.m_oColumn = null;
		}

		IC(CStroke, CBaseNoId, 0);
		CStroke.prototype.readAttrXml = function (name, reader) {
			if ("color" === name) this.m_oColor = readColorType(reader);
			else if ("color2" === name) this.m_oColor2 = readColorType(reader);
			else if ("dashstyle" === name) this.m_oDahsStyle = readDashStyle(reader);
			else if ("endarrow" === name) this.m_oEndArrow = readArrowType(reader);
			else if ("endarrowlength" === name) this.m_oEndArrowLength = readArrowLength(reader);
			else if ("endarrowwidth" === name) this.m_oEndArrowWidth = readArrowWidth(reader);
			else if ("endcap" === name) this.m_oEndCap = readEndCap(reader);
			else if ("filltype" === name) this.m_oFillType = readFillType(reader);
			else if ("id" === name) {
				let sName = reader.GetName();
				if (sName === "id") {
					this.m_oId = reader.GetValue();
				} else if (sName === "r:id" || sName === "relationships:id") {
					this.m_rId = reader.GetValue();
				}
			} else if ("imagealignshape" === name) this.m_oImageAlignShape = reader.GetValueBool();
			else if ("imageaspect" === name) this.m_oImageAspect = readImageAspect(reader);
			else if ("imagesize" === name) this.m_oImageSize = new CVml_Vector2D_Units_Or_Percentage(reader.GetValue());
			else if ("insetpen" === name) this.m_oInsetPen = reader.GetValueBool();
			else if ("joinstyle" === name) this.m_oJoinStyle = readJoinStyle(reader);
			else if ("linestyle" === name) this.m_oLineStyle = readLineStyle(reader);
			else if ("miterlimit" === name) this.m_oMiterLimit = reader.GetValueInt();
			else if ("althref" === name) this.m_sAltHref = reader.GetValue();
			else if ("forcedash" === name) this.m_oForceDash = reader.GetValueBool();
			else if ("href" === name) this.m_sHref = reader.GetValue();
			else if ("on" === name) this.m_oOn = reader.GetValueBool();
			else if ("opacity" === name) this.m_oOpacity = reader.GetValueDouble();
			else if ("relid" === name) this.m_oRelId = reader.GetValue();
			else if ("title" === name) this.m_sTitle = reader.GetValue();
			else if ("src" === name) this.m_sSrc = reader.GetValue();
			else if ("startarrow" === name) this.m_oStartArrow = readArrowType(reader);
			else if ("startarrowlength" === name) this.m_oStartArrowLength = readArrowLength(reader);
			else if ("startarrowwidth" === name) this.m_oStartArrowWidth = readArrowWidth(reader);
			else if ("weight" === name) this.m_oWeight = reader.GetValueDouble();
		};
		CStroke.prototype.readChildXml = function (name, reader) {
			if ("left" === name)
				this.m_oLeft = this.readChildSide(reader);
			else if ("top" === name)
				this.m_oTop = this.readChildSide(reader);
			else if ("right" === name)
				this.m_oRight = this.readChildSide(reader);
			else if ("bottom" === name)
				this.m_oBottom = this.readChildSide(reader);
			else if ("column" === name)
				this.m_oColumn = this.readChildSide(reader);
		};
		CStroke.prototype.readChildSide = function (reader) {

			let oSide = new CStrokeChild();
			oSide.fromXml(reader);
			return oSide;
		};
		CStroke.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CStroke.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CStrokeChild(sType) {
			CBaseNoId.call(this);

			this.m_sType = sType;
			this.m_sAlthref = null;
			this.m_oColor = null;
			this.m_oColor2 = null;
			this.m_oDashStyle = null;
			this.m_oEndArrow = null;
			this.m_oEndArrowLength = null;
			this.m_oEndArrowWidth = null;
			this.m_oEndCap = null;
			this.m_oExt = null;
			this.m_oFillType = null;
			this.m_oForceDash = null;
			this.m_sHref = null;
			this.m_oImageAlignShape = null;
			this.m_oImageAspect = null;
			this.m_sImageSize = null;
			this.m_oInsetPen = null;
			this.m_oJoinStyle = null;
			this.m_oLineStyle = null;
			this.m_oMiterLimit = null;
			this.m_oOn = null;
			this.m_sOpacity = null;
			this.m_sSrc = null;
			this.m_oStartArrow = null;
			this.m_oStartArrowLength = null;
			this.m_oStartArrowWidth = null;
			this.m_sTitle = null;
			this.m_sWeight = null;
		}

		IC(CStrokeChild, CBaseNoId, 0);
		CStrokeChild.prototype.readAttrXml = function (name, reader) {
			if ("althref") this.m_sAlthref = reader.GetValue();
			else if ("color") this.m_oColor = readColorType(reader);
			else if ("color2") this.m_oColor2 = readColorType(reader);
			else if ("dashstyle") this.m_oDashStyle = readDashStyle(reader);
			else if ("endarrow") this.m_oEndArrow = readArrowType(reader);
			else if ("endarrowlength") this.m_oEndArrowLength = readArrowLength(reader);
			else if ("endarrowwidth") this.m_oEndArrowWidth = readArrowWidth(reader);
			else if ("endcap") this.m_oEndCap = readEndCap(reader);
			else if ("ext") this.m_oExt = readExt(reader);
			else if ("filltype") this.m_oFillType = readFillType(reader);
			else if ("forcedash") this.m_oForceDash = reader.GetValueBool();
			else if ("href") this.m_sHref = reader.GetValue();
			else if ("imagealignshape") this.m_oImageAlignShape = reader.GetValueBool();
			else if ("imageaspect") this.m_oImageAspect = readImageAspect(reader)
			else if ("imagesize") this.m_sImageSize = reader.GetValue();
			else if ("insetpen") this.m_oInsetPen = reader.GetValueBool();
			else if ("joinstyle") this.m_oJoinStyle = readJoinStyle(reader);
			else if ("linestyle") this.m_oLineStyle = readLineStyle(reader);
			else if ("miterlimit") this.m_oMiterLimit = reader.GetValueInt()
			else if ("on") this.m_oOn = reader.GetValueBool();
			else if ("opacity") this.m_sOpacity = reader.GetValue();
			else if ("src") this.m_sSrc = reader.GetValue();
			else if ("startarrow") this.m_oStartArrow = readArrowType(reader);
			else if ("startarrowlength") this.m_oStartArrowLength = readArrowLength(reader);
			else if ("startarrowwidth") this.m_oStartArrowWidth = readArrowWidth(reader);
			else if ("title") this.m_sTitle = reader.GetValue();
			else if ("weight") this.m_sWeight = reader.GetValue();
		};
		CStrokeChild.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CStrokeChild.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};


		function CVml_TextBoxInset(sValue) {

			this.m_dLeft = 0;
			this.m_dTop = 0;
			this.m_dRight = 0;
			this.m_dBottom = 0;
			if (sValue) {
				this.FromString(sValue);
			}
		}


		CVml_TextBoxInset.prototype.GetLeft = function (nIndex) {
			return this.m_dLeft;
		};
		CVml_TextBoxInset.prototype.GetTop = function (nIndex) {
			return this.m_dTop;
		};
		CVml_TextBoxInset.prototype.GetRight = function (nIndex) {
			return this.m_dRight;
		};
		CVml_TextBoxInset.prototype.GetBottom = function (nIndex) {
			return this.m_dBottom;
		};
		CVml_TextBoxInset.prototype.Set = function (dL, dT, dR, dB) {
			this.m_dLeft = dL;
			this.m_dTop = dT;
			this.m_dRight = dR;
			this.m_dBottom = dB;
		};
		CVml_TextBoxInset.prototype.FromString = function (sValue) {
			this.Set(0, 0, 0, 0);

			if (sValue.length === 0)
				return 0;

			let arSplit = [];

			sValue.replace("@", "");
			arSplit = sValue.split(", ");

			if (arSplit.length > 0) {
				let oPt = new CPoint(arSplit[0]);
				this.m_dLeft = oPt.GetValue();
			}

			if (arSplit.length > 1) {
				let oPt = new CPoint(arSplit[1]);
				this.m_dTop = oPt.GetValue();
			}

			if (arSplit.length > 2) {
				let oPt = new CPoint(arSplit[2]);
				this.m_dRight = oPt.GetValue();
			}

			if (arSplit.length > 3) {
				let oPt = new CPoint(arSplit[3]);
				this.m_dBottom = oPt.GetValue();
			}

			return 0;
		};
		CVml_TextBoxInset.prototype.ToString = function () {
			return "" + this.m_dLeft + "pt," + this.m_dTop + "pt," + this.m_dRight + "pt," + this.m_dBottom + "pt";
		};


		function CTextbox() {
			CBaseNoId.call(this);
			this.m_oId = null;
			this.m_oStyle = null;
			this.m_oInset = null;
			this.m_oSingleClick = null;
			this.m_oInsetMode = null;

			this.m_oTxtbxContent = null;
			this.m_oText = null;
		}

		IC(CTextbox, CBaseNoId, 0);
		CTextbox.prototype.readAttrXml = function (name, reader) {
			if ("id" === name) this.m_oId = reader.GetValue();
			else if ("inset" === name) this.m_oInset = new CVml_TextBoxInset(reader.GetValue());
			else if ("insetmode" === name) this.m_oInsetMode = readInsetMode(reader);
			else if ("singleclick" === name) this.m_oSingleClick = reader.GetValueBool();
			else if ("style" === name) this.m_oStyle = new CCssStyle(reader.GetValue());
		};
		CTextbox.prototype.readChildXml = function (name, reader) {
			if ("txbxContent" === name) {
				this.m_oTxtbxContent = AscFormat.fReadTxBoxContentXML(reader, this)
			} else if ("div" === name) {
				this.m_oText = reader.GetTextDecodeXml();
			}
		};
		CTextbox.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CTextbox.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};

		function CCssStyle(sValue) {
			this.m_arrProperties = null;
			this.m_sCss = null;
			if (sValue) {
				this.FromString(sValue);
			}
		}

		CCssStyle.prototype.Clear = function () {
			this.m_arrProperties.length = 0;
		}

		CCssStyle.prototype.FromString = function (sValue) {
			this.Clear();

			this.m_sCss = sValue;
			this.ParseProperties();

			return this.m_sCss;
		};

		CCssStyle.prototype.ToString = function () {
			return this.m_sCss;
		};

		CCssStyle.prototype.ParseProperties = function () {
			let sTemp = this.m_sCss;
			while (sTemp.length > 0) {
				let nPos = sTemp.indexOf(';');
				if (-1 === nPos) {
					let oProperty = new CCssProperty(sTemp);
					if ((ECssPropertyType.cssptUnknown !== oProperty.get_Type())) {
						this.m_arrProperties.push(oProperty);
					}
					sTemp = "";

				} else {
					let oProperty = new CCssProperty(sTemp.substr(0, nPos));
					if ((ECssPropertyType.cssptUnknown !== oProperty.get_Type())) {
						this.m_arrProperties.push(oProperty);
					}
					sTemp = sTemp.substr(nPos + 1, sTemp.length - nPos - 1);
				}
			}
			return true;
		};


		let ECssPropertyType =
			{
				cssptUnknown: 0,
				cssptFlip: 1000,
				cssptHeight: 1001,
				cssptLeft: 1002,
				cssptMarginBottom: 1003,
				cssptMarginLeft: 1004,
				cssptMarginRight: 1005,
				cssptMarginTop: 1006,
				cssptMsoPositionHorizontal: 1007,
				cssptMsoPositionHorizontalRelative: 1008,
				cssptMsoPositionVertical: 1009,
				cssptMsoPositionVerticalRelative: 1010,
				cssptMsoWrapDistanceBottom: 1011,
				cssptMsoWrapDistanceLeft: 1012,
				cssptMsoWrapDistanceRight: 1013,
				cssptMsoWrapDistanceTop: 1014,
				cssptMsoWrapEdited: 1015,
				cssptMsoWrapStyle: 1016,
				cssptPosition: 1017,
				cssptRotation: 1018,
				cssptTop: 1019,
				cssptVisibility: 1020,
				cssptWidth: 1021,
				cssptZIndex: 1022,
				csspctMsoWidthPercent: 1023,
				csspctMsoHeightPercent: 1024,

				cssptDirection: 1100,
				cssptLayoutFlow: 1101,
				cssptMsoDirectionAlt: 1102,
				cssptMsoFitShapeToText: 1103,
				cssptMsoFitTextToShape: 1104,
				cssptMsoLayoutFlowAlt: 1105,
				cssptMsoNextTextbox: 1106,
				cssptMsoRotate: 1107,
				cssptMsoTextScale: 1108,
				cssptVTextAnchor: 1109,

				cssptFont: 1200,
				cssptFontFamily: 1201,
				cssptFontSize: 1202,
				cssptFontStyle: 1203,
				cssptFontVariant: 1204,
				cssptFontWeight: 1205,
				cssptMsoTextShadow: 1206,
				cssptTextDecoration: 1207,
				cssptVRotateLetters: 1208,
				cssptVSameLetterHeights: 1209,
				cssptVTextAlign: 1210,
				cssptVTextKern: 1211,
				cssptVTextReverse: 1212,
				cssptVTextSpacingMode: 1213,
				cssptVTextSpacing: 1214,
				cssptHTextAlign: 1215
			};


		let ECssFlip =
			{
				cssflipX: 0,
				cssflipY: 1,
				cssflipXY: 2,
				cssflipYX: 3
			};
		let ECssUnitsType =
			{
				cssunitstypeAuto: 0,
				cssunitstypeUnits: 1,
				cssunitstypePerc: 2,
				cssunitstypeAbsolute: 3
			};

		function TCssUnitsValue(type, value) {
			this.eType = type;
			this.dValue = value; // pt
		}

		let ECssMsoPosHorRel =
			{
				cssmsoposhorrelMargin: 0,
				cssmsoposhorrelPage: 1,
				cssmsoposhorrelText: 2,
				cssmsoposhorrelChar: 3,
				cssmsoposhorrelLeftMargin: 4,
				cssmsoposhorrelRightMargin: 5
			};
		let ECssMsoPosHor =
			{
				cssmsoposhorAbsolute: 0,
				cssmsoposhorLeft: 1,
				cssmsoposhorCenter: 2,
				cssmsoposhorRight: 3,
				cssmsoposhorInside: 4,
				cssmsoposhorOutside: 5
			};
		let ECssMsoPosVer =
			{
				cssmsoposverAbsolute: 0,
				cssmsoposverTop: 1,
				cssmsoposverCenter: 2,
				cssmsoposverBottom: 3,
				cssmsoposverInside: 4,
				cssmsoposverOutside: 5
			};
		let ECssMsoPosVerRel =
			{
				cssmsoposverrelMargin: 0,
				cssmsoposverrelPage: 1,
				cssmsoposverrelText: 2,
				cssmsoposverrelLine: 3,
				cssmsoposverrelTopMargin: 4,
				cssmsoposverrelBottomMargin: 5
			};
		let ECssMsoWrapStyle =
			{
				cssmsowrapstyleSqaure: 0,
				cssmsowrapstyleNone: 1,
			};
		let ECssPosition =
			{
				csspositionStatic: 0,
				csspositionAbsolute: 1,
				csspositionRelative: 2,
			};
		let ECssVisibility =
			{
				cssvisibilityHidden: 0,
				cssvisibilityInherit: 1,
			};
		let ECssZIndexType =
			{
				csszindextypeAuto: 0,
				csszindextypeOrder: 1
			};

		function TCssZIndexValue(type, order) {
			this.eType = type;
			this.nOrder = order;
		}

		let ECssDirection =
			{
				cssdirectionLTR: 0,
				cssdirectionRTL: 1
			};
		let ECssLayoutFlow =
			{
				csslayoutflowHorizontal: 0,
				csslayoutflowVertical: 1,
				csslayoutflowVerticalIdeographic: 2,
				csslayoutflowHorizontalIdeographic: 3
			};
		let ECssDirectionAlt =
			{
				cssdirectionaltContext: 0,
			};
		let ECssLayoutFlowAlt =
			{
				csslayoutflowaltBottomToTop: 0,
			};

		let ECssMsoRotate =
			{
				cssmsorotate0: 0,
				cssmsorotate90: 90,
				cssmsorotate180: 180,
				cssmsorotate270: -90
			};
		let ECssVTextAnchor =
			{
				cssvtextanchorTop: 0,
				cssvtextanchorMiddle: 1,
				cssvtextanchorBottom: 2,
				cssvtextanchorTopCenter: 3,
				cssvtextanchorMiddleCenter: 4,
				cssvtextanchorBottomCenter: 5,
				cssvtextanchorTopBaseline: 6,
				cssvtextanchorBottomBaseline: 7,
				cssvtextanchorTopCenterBaseline: 8,
				cssvtextanchorBottomCenterBaseline: 9
			};
		let ECssFontStyle =
			{
				cssfontstyleNormal: 0,
				cssfontstyleItalic: 1,
				cssfontstyleOblique: 2
			};
		let ECssFontVarian =
			{
				cssfontvariantNormal: 0,
				cssfontvariantSmallCaps: 1,
			};
		let ECssFontWeight =
			{
				cssfontweightNormal: 0,
				cssfontweightLighter: 1,
				cssfontweight100: 100,
				cssfontweight200: 200,
				cssfontweight300: 300,
				cssfontweight400: 400,
				cssfontweightBold: 550,
				cssfontweightBolder: 750,
				cssfontweight500: 500,
				cssfontweight600: 600,
				cssfontweight700: 700,
				cssfontweight800: 800,
				cssfontweight900: 900
			};
		let ECssTextDecoration =
			{
				csstextdecorationNone: 0,
				csstextdecorationUnderline: 1,
				csstextdecorationOverline: 2,
				csstextdecorationLineThrough: 3,
				csstextdecorationBlink: 4,
			};
		let ECssVTextAlign =
			{
				cssvtextalignLeft: 0,
				cssvtextalignRight: 1,
				cssvtextalignCenter: 2,
				cssvtextalignJustify: 3,
				cssvtextalignLetterJustify: 4,
				cssvtextalignStretchJustify: 5,
			};
		let ECssVTextSpacingMode =
			{
				cssvtextspacingmodeTightening: 0,
				cssvtextspacingmodeTracking: 1
			};


		function UCssValue() {
			this.eFlip = null;
			this.oValue = null;
			this.eMsoPosHor = null;
			this.eMsoPosHorRel = null;
			this.eMsoPosVer = null;
			this.eMsoPosVerRel = null;
			this.bValue = null;
			this.eMsoWrapStyle = null;
			this.ePosition = null;
			this.eVisibility = null;
			this.oZIndex = null;
			this.eDirection = null;
			this.eLayoutFlow = null;
			this.eDirectionAlt = null;
			this.eLayoutFlowAlt = null;
			this.wsValue = null;
			this.eRotate = null;
			this.eVTextAnchor = null;
			this.eFontStyle = null;
			this.eFontVariant = null;
			this.eFontWeight = null;
			this.eTextDecoration = null;
			this.eVTextAlign = null;
			this.eVTextSpacingMode = null;
			this.eHTextAlign = null;
		}

		function CCssProperty(sBuffer) {
			this.m_eType = ECssPropertyType.cssptUnknown;
			this.m_oValue = new UCssValue();
			if (sBuffer) {
				this.Parse(sBuffer);
			}
		}

		CCssProperty.prototype.get_Value = function () {
			return this.m_oValue;
		}

		CCssProperty.prototype.get_Type = function () {
			return this.m_eType;
		}


		CCssProperty.prototype.Parse = function (sBuffer) {
			let nPos = sBuffer.indexOf(':');
			let sValue;

			if (-1 === nPos) {
				this.m_eType = ECssPropertyType.cssptUnknown;
			} else {
				let sProperty = sBuffer.substr(0, nPos);
				sValue = sBuffer.substr(nPos + 1, sBuffer.length - (nPos + 1));

				sProperty = sProperty.replace(/\s/g, "");

				if (sProperty.length <= 2) {
					this.m_eType = ECssPropertyType.cssptUnknown;
					return;
				}

				let nChar1 = sProperty.charAt(0);
				let nChar2 = sProperty.charAt(0);

				switch (nChar1) {
					case 'd': {
						if (("direction") === sProperty) this.m_eType = ECssPropertyType.cssptDirection;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'f': {
						switch (nChar2) {
							case 'l': {
								if (("flip") === sProperty) this.m_eType = ECssPropertyType.cssptFlip;
								else this.m_eType = ECssPropertyType.cssptUnknown;

								break;
							}
							case 'o': {
								if (("font") === sProperty) this.m_eType = ECssPropertyType.cssptFont;
								else if (("font-family") === sProperty) this.m_eType = ECssPropertyType.cssptFontFamily;
								else if (("font-size") === sProperty) this.m_eType = ECssPropertyType.cssptFontSize;
								else if (("font-style") === sProperty) this.m_eType = ECssPropertyType.cssptFontStyle;
								else if (("font-variant") === sProperty) this.m_eType = ECssPropertyType.cssptFontVariant;
								else if (("font-weight") === sProperty) this.m_eType = ECssPropertyType.cssptFontWeight;
								else this.m_eType = ECssPropertyType.cssptUnknown;

								break;
							}
							default: {
								this.m_eType = ECssPropertyType.cssptUnknown;
								break;
							}
						}
						break;
					}
					case 'h': {
						if (("height") === sProperty) this.m_eType = ECssPropertyType.cssptHeight;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'l': {
						if (("layout-flow") === sProperty) this.m_eType = ECssPropertyType.cssptLayoutFlow;
						else if (("left") === sProperty) this.m_eType = ECssPropertyType.cssptLeft;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'm': {
						switch (nChar2) {
							case 'a': {
								if (("margin-bottom") === sProperty) this.m_eType = ECssPropertyType.cssptMarginBottom;
								else if (("margin-left") === sProperty) this.m_eType = ECssPropertyType.cssptMarginLeft;
								else if (("margin-right") === sProperty) this.m_eType = ECssPropertyType.cssptMarginRight;
								else if (("margin-top") === sProperty) this.m_eType = ECssPropertyType.cssptMarginTop;
								else this.m_eType = ECssPropertyType.cssptUnknown;

								break;
							}
							case 's': {
								if (("mso-direction-alt") === sProperty) this.m_eType = ECssPropertyType.cssptMsoDirectionAlt;
								else if (("mso-fit-shape-to-text") === sProperty) this.m_eType = ECssPropertyType.cssptMsoFitShapeToText;
								else if (("mso-fit-text-to-shape") === sProperty) this.m_eType = ECssPropertyType.cssptMsoFitTextToShape;
								else if (("mso-layout-flow-alt") === sProperty) this.m_eType = ECssPropertyType.cssptMsoLayoutFlowAlt;
								else if (("mso-next-textbox") === sProperty) this.m_eType = ECssPropertyType.cssptMsoNextTextbox;
								else if (("mso-position-horizontal") === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionHorizontal;
								else if (("mso-position-horizontal-relative") === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionHorizontalRelative;
								else if (("mso-position-vertical") === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionVertical;
								else if (("mso-position-vertical-relative") === sProperty) this.m_eType = ECssPropertyType.cssptMsoPositionVerticalRelative;
								else if (("mso-rotate") === sProperty) this.m_eType = ECssPropertyType.cssptMsoRotate;
								else if (("mso-text-scale") === sProperty) this.m_eType = ECssPropertyType.cssptMsoTextScale;
								else if (("mso-text-shadow") === sProperty) this.m_eType = ECssPropertyType.cssptMsoTextShadow;
								else if (("mso-wrap-distance-bottom") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceBottom;
								else if (("mso-wrap-distance-left") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceLeft;
								else if (("mso-wrap-distance-right") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceRight;
								else if (("mso-wrap-distance-top") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapDistanceTop;
								else if (("mso-wrap-edited") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapEdited;
								else if (("mso-wrap-style") === sProperty) this.m_eType = ECssPropertyType.cssptMsoWrapStyle;
								else if (("mso-height-percent") === sProperty) this.m_eType = ECssPropertyType.csspctMsoHeightPercent;
								else if (("mso-width-percent") === sProperty) this.m_eType = ECssPropertyType.csspctMsoWidthPercent;
								else this.m_eType = ECssPropertyType.cssptUnknown;

								break;
							}
							default: {
								this.m_eType = ECssPropertyType.cssptUnknown;
								break;
							}
						}
						break;
					}
					case 'p': {
						if (("position") === sProperty) this.m_eType = ECssPropertyType.cssptPosition;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'r': {
						if (("rotation") === sProperty) this.m_eType = ECssPropertyType.cssptRotation;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 't': {
						if (("text-decoration") === sProperty) this.m_eType = ECssPropertyType.cssptTextDecoration;
						else if (("top") === sProperty) this.m_eType = ECssPropertyType.cssptTop;
						else if (("text-align") === sProperty) this.m_eType = ECssPropertyType.cssptHTextAlign;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'v': {
						if (("visibility") === sProperty) this.m_eType = ECssPropertyType.cssptVisibility;
						else if (("v-rotate-letters") === sProperty) this.m_eType = ECssPropertyType.cssptVRotateLetters;
						else if (("v-same-letter-heights") === sProperty) this.m_eType = ECssPropertyType.cssptVSameLetterHeights;
						else if (("v-text-align") === sProperty) this.m_eType = ECssPropertyType.cssptVTextAlign;
						else if (("v-text-anchor") === sProperty) this.m_eType = ECssPropertyType.cssptVTextAnchor;
						else if (("v-text-kern") === sProperty) this.m_eType = ECssPropertyType.cssptVTextKern;
						else if (("v-text-reverse") === sProperty) this.m_eType = ECssPropertyType.cssptVTextReverse;
						else if (("v-text-spacing-mode") === sProperty) this.m_eType = ECssPropertyType.cssptVTextSpacingMode;
						else if (("v-text-spacing") === sProperty) this.m_eType = ECssPropertyType.cssptVTextSpacing;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'w': {
						if (("width") === sProperty) this.m_eType = ECssPropertyType.cssptWidth;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					case 'z': {
						if (("z-index") === sProperty) this.m_eType = ECssPropertyType.cssptZIndex;
						else this.m_eType = ECssPropertyType.cssptUnknown;

						break;
					}
					default: {
						this.m_eType = ECssPropertyType.cssptUnknown;
						break;
					}
				}
			}

			switch (this.m_eType) {
				case ECssPropertyType.cssptUnknown :
					this.ReadValue_Unknown(sValue);
					break;

				case ECssPropertyType.cssptFlip :
					this.ReadValue_Flip(sValue);
					break;
				case ECssPropertyType.cssptHeight :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptLeft :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMarginBottom :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMarginLeft :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMarginRight :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMarginTop :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMsoPositionHorizontal :
					this.ReadValue_MsoPosHor(sValue);
					break;
				case ECssPropertyType.cssptMsoPositionHorizontalRelative :
					this.ReadValue_MsoPosHorRel(sValue);
					break;
				case ECssPropertyType.cssptMsoPositionVertical :
					this.ReadValue_MsoPosVer(sValue);
					break;
				case ECssPropertyType.cssptMsoPositionVerticalRelative :
					this.ReadValue_MsoPosVerRel(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapDistanceBottom :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapDistanceLeft :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapDistanceRight :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapDistanceTop :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapEdited :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptMsoWrapStyle :
					this.ReadValue_MsoWrapStyle(sValue);
					break;
				case ECssPropertyType.cssptPosition :
					this.ReadValue_Position(sValue);
					break;
				case ECssPropertyType.cssptRotation :
					this.ReadValue_Rotation(sValue);
					break;
				case ECssPropertyType.cssptTop :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptVisibility :
					this.ReadValue_Visibility(sValue);
					break;
				case ECssPropertyType.cssptWidth :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptZIndex :
					this.ReadValue_ZIndex(sValue);
					break;

				case ECssPropertyType.cssptDirection :
					this.ReadValue_Direction(sValue);
					break;
				case ECssPropertyType.cssptLayoutFlow :
					this.ReadValue_LayoutFlow(sValue);
					break;
				case ECssPropertyType.cssptMsoDirectionAlt :
					this.ReadValue_DirectionAlt(sValue);
					break;
				case ECssPropertyType.cssptMsoFitShapeToText :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptMsoFitTextToShape :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptMsoLayoutFlowAlt :
					this.ReadValue_LayoutFlowAlt(sValue);
					break;
				case ECssPropertyType.cssptMsoNextTextbox :
					this.ReadValue_String(sValue);
					break;
				case ECssPropertyType.cssptMsoRotate :
					this.ReadValue_MsoRotate(sValue);
					break;
				case ECssPropertyType.cssptMsoTextScale :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptVTextAnchor :
					this.ReadValue_VTextAnchor(sValue);
					break;

				case ECssPropertyType.cssptFont :
					this.ReadValue_String(sValue);
					break;
				case ECssPropertyType.cssptFontFamily :
					this.ReadValue_String(sValue);
					break;
				case ECssPropertyType.cssptFontSize :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptFontStyle :
					this.ReadValue_FontStyle(sValue);
					break;
				case ECssPropertyType.cssptFontVariant :
					this.ReadValue_FontVariant(sValue);
					break;
				case ECssPropertyType.cssptFontWeight :
					this.ReadValue_FontWeight(sValue);
					break;
				case ECssPropertyType.cssptMsoTextShadow :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptTextDecoration :
					this.ReadValue_TextDecoration(sValue);
					break;
				case ECssPropertyType.cssptVRotateLetters :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptVSameLetterHeights :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptVTextAlign :
					this.ReadValue_VTextAlign(sValue);
					break;
				case ECssPropertyType.cssptVTextKern :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptVTextReverse :
					this.ReadValue_Boolean(sValue);
					break;
				case ECssPropertyType.cssptVTextSpacingMode :
					this.ReadValue_VTextSpacingMode(sValue);
					break;
				case ECssPropertyType.cssptVTextSpacing :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.csspctMsoWidthPercent :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.csspctMsoHeightPercent :
					this.ReadValue_Units(sValue);
					break;
				case ECssPropertyType.cssptHTextAlign :
					this.ReadValue_VTextAlign(sValue);
					break;
			}
		}

		CCssProperty.prototype.ReadValue_Unknown = function (sValue) {
		}
		CCssProperty.prototype.ReadValue_Flip = function (sValue) {
			if (("x") === sValue) this.m_oValue.eFlip = ECssFlip.cssflipX;
			else if (("y") === sValue) this.m_oValue.eFlip = ECssFlip.cssflipY;
			else if (("xy") === sValue) this.m_oValue.eFlip = ECssFlip.cssflipXY;
			else if (("yx") === sValue) this.m_oValue.eFlip = ECssFlip.cssflipYX;
			else
				this.m_eType = ECssPropertyType.cssptUnknown;
		}
		CCssProperty.prototype.ReadValue_Units = function (sValue) {
			let nPos = -1;
			if (-1 !== (nPos = sValue.indexOf(("auto")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAuto;
			} else if (-1 !== (nPos = sValue.indexOf(("in")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Inch_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf(("cm")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Cm_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf(("mm")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Mm_To_Pt(dValue);
			} else if (-1 !== (nPos = sValue.indexOf(("em")))) {
			} else if (-1 !== (nPos = sValue.indexOf(("ex")))) {
			} else if (-1 !== (nPos = sValue.indexOf(("pt")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = dValue;
			} else if (-1 !== (nPos = sValue.indexOf(("pc")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = dValue * 12;
			} else if (-1 !== (nPos = sValue.indexOf(("%")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypePerc;

				let strValue = sValue.substr(0, nPos);
				this.m_oValue.oValue.dValue = strValue.length === 0 ? 0 : parseFloat(strValue);
			} else if (-1 !== (nPos = sValue.indexOf(("px")))) {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeUnits;

				let strValue = sValue.substr(0, nPos);
				let dValue = parseFloat(sValue);

				this.m_oValue.oValue.dValue = Px_To_Pt(dValue);
			} else {
				this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAbsolute;
				this.m_oValue.oValue.dValue = parseFloat(sValue);
			}
		}

		CCssProperty.prototype.ReadValue_MsoPosHor = function (sValue) {
			if (("absolute") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorAbsolute;
			else if (("left") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorLeft;
			else if (("center") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorCenter;
			else if (("right") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorRight;
			else if (("inside") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorInside;
			else if (("outside") === sValue) this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorOutside;
			else
				this.m_oValue.eMsoPosHor = ECssMsoPosHor.cssmsoposhorAbsolute;
		}
		CCssProperty.prototype.ReadValue_MsoPosHorRel = function (sValue) {
			if (("left-margin-area") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelLeftMargin;
			else if (("right-margin-area") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelRightMargin;
			else if (("margin") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelMargin;
			else if (("page") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelPage;
			else if (("text") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelText;
			else if (("char") === sValue) this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelChar;
			else
				this.m_oValue.eMsoPosHorRel = ECssMsoPosHorRel.cssmsoposhorrelText;
		}
		CCssProperty.prototype.ReadValue_MsoPosVer = function (sValue) {
			if (("absolute") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverAbsolute;
			else if (("top") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverTop;
			else if (("center") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverCenter;
			else if (("bottom") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverBottom;
			else if (("inside") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverInside;
			else if (("outside") === sValue) this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverOutside;
			else
				this.m_oValue.eMsoPosVer = ECssMsoPosVer.cssmsoposverAbsolute;
		}
		CCssProperty.prototype.ReadValue_MsoPosVerRel = function (sValue) {
			if (("bottom-margin-area") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelBottomMargin;
			else if (("top-margin-area") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelTopMargin;
			else if (("margin") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelMargin;
			else if (("page") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelPage;
			else if (("text") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelText;
			else if (("line") === sValue) this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelLine;
			else
				this.m_oValue.eMsoPosVerRel = ECssMsoPosVerRel.cssmsoposverrelText;
		}

		CCssProperty.prototype.ReadValue_Rotation = function (sValue) {
			this.m_oValue.oValue.m_eType = ECssUnitsType.cssunitstypeAbsolute;
			this.m_oValue.oValue.dValue = sValue.length === 0 ? 0 : parseFloat(sValue);

			if (sValue.indexOf(("fd")) !== -1) {
				this.m_oValue.oValue.dValue /= 6000.;
			} else if (sValue.indexOf(("f")) === sValue.length - 1) {
				this.m_oValue.oValue.dValue /= 65536.;
			}
		}
		CCssProperty.prototype.ReadValue_Boolean = function (sValue) {
			if (("true") === sValue || ("t") === sValue || ("1") === sValue)
				this.m_oValue.bValue = true;
			else
				this.m_oValue.bValue = false;
		}
		CCssProperty.prototype.ReadValue_MsoWrapStyle = function (sValue) {
			if (("square") === sValue) this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleSqaure;
			else if (("none") === sValue) this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleNone;
			else
				this.m_oValue.eMsoWrapStyle = ECssMsoWrapStyle.cssmsowrapstyleSqaure;
		}
		CCssProperty.prototype.ReadValue_Position = function (sValue) {
			if (("static") === sValue) this.m_oValue.ePosition = ECssPosition.csspositionStatic;
			else if (("absolute") === sValue) this.m_oValue.ePosition = ECssPosition.csspositionAbsolute;
			else if (("relative") === sValue) this.m_oValue.ePosition = ECssPosition.csspositionRelative;
			else
				this.m_oValue.ePosition = ECssPosition.csspositionAbsolute;
		}
		CCssProperty.prototype.ReadValue_Visibility = function (sValue) {
			if (("hidden") === sValue) this.m_oValue.eVisibility = ECssVisibility.cssvisibilityHidden;
			else if (("inherit") === sValue) this.m_oValue.eVisibility = ECssVisibility.cssvisibilityInherit;
			else
				this.m_oValue.eVisibility = ECssVisibility.cssvisibilityInherit;
		}
		CCssProperty.prototype.ReadValue_ZIndex = function (sValue) {
			if (("auto") === sValue) this.m_oValue.oZIndex.m_eType = ECssZIndexType.csszindextypeAuto;
			else {
				this.m_oValue.oZIndex.m_eType = ECssZIndexType.csszindextypeOrder;
				this.m_oValue.oZIndex.nOrder = parseInt(sValue);

			}
		}
		CCssProperty.prototype.ReadValue_Direction = function (sValue) {
			if (("ltr") === sValue) this.m_oValue.eDirection = ECssDirection.cssdirectionLTR;
			else if (("rtl") === sValue) this.m_oValue.eDirection = ECssDirection.cssdirectionRTL;
			else
				this.m_oValue.eDirection = ECssDirection.cssdirectionLTR;
		}
		CCssProperty.prototype.ReadValue_LayoutFlow = function (sValue) {
			if (("horizontal") === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontal;
			else if (("vertical") === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowVertical;
			else if (("vertical-ideographic") === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowVerticalIdeographic;
			else if (("horizontal-ideographic") === sValue) this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontalIdeographic;
			else
				this.m_oValue.eLayoutFlow = ECssLayoutFlow.csslayoutflowHorizontal;
		}
		CCssProperty.prototype.ReadValue_DirectionAlt = function (sValue) {
			this.m_oValue.eDirectionAlt = ECssDirectionAlt.cssdirectionaltContext;
		}
		CCssProperty.prototype.ReadValue_LayoutFlowAlt = function (sValue) {
			this.m_oValue.eLayoutFlowAlt = ECssLayoutFlowAlt.csslayoutflowaltBottomToTop;
		}
		CCssProperty.prototype.ReadValue_String = function (sValue) {
			this.m_oValue.wsValue = sValue;
		}

		CCssProperty.prototype.ReadValue_MsoRotate = function (sValue) {
			if (("0") === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate0;
			else if (("90") === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate90;
			else if (("180") === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate180;
			else if (("-90") === sValue) this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate270;
			else
				this.m_oValue.eRotate = ECssMsoRotate.cssmsorotate0;
		}
		CCssProperty.prototype.ReadValue_VTextAnchor = function (sValue) {
			if (("top") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTop;
			else if (("middle") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorMiddle;
			else if (("bottom") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottom;
			else if (("top-center") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopCenter;
			else if (("middle-center") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorMiddleCenter;
			else if (("bottom-center") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomCenter;
			else if (("top-baseline") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopBaseline;
			else if (("bottom-baseline") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomBaseline;
			else if (("top-center-baseline") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTopCenterBaseline;
			else if (("bottom-center-baseline") === sValue) this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorBottomCenterBaseline;
			else
				this.m_oValue.eVTextAnchor = ECssVTextAnchor.cssvtextanchorTop;
		}
		CCssProperty.prototype.ReadValue_FontStyle = function (sValue) {
			if (("normal") === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleNormal;
			else if (("italic") === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleItalic;
			else if (("oblique") === sValue) this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleOblique;
			else
				this.m_oValue.eFontStyle = ECssFontStyle.cssfontstyleNormal;
		}
		CCssProperty.prototype.ReadValue_FontVariant = function (sValue) {
			if (("normal") === sValue) this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantNormal;
			else if (("small-caps") === sValue) this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantSmallCaps;
			else
				this.m_oValue.eFontVariant = ECssFontVarian.cssfontvariantNormal;
		}
		CCssProperty.prototype.ReadValue_FontWeight = function (sValue) {
			if (("normal") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightNormal;
			else if (("lighter") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightLighter;
			else if (("100") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight100;
			else if (("200") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight200;
			else if (("300") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight300;
			else if (("400") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight400;
			else if (("bold") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightBold;
			else if (("bolder") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightBolder;
			else if (("500") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight500;
			else if (("600") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight600;
			else if (("700") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight700;
			else if (("800") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight800;
			else if (("900") === sValue) this.m_oValue.eFontWeight = ECssFontWeight.cssfontweight900;
			else
				this.m_oValue.eFontWeight = ECssFontWeight.cssfontweightNormal;
		}
		CCssProperty.prototype.ReadValue_TextDecoration = function (sValue) {
			if (("none") === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationNone;
			else if (("underline") === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationUnderline;
			else if (("overline") === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationOverline;
			else if (("line-through") === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationLineThrough;
			else if (("blink") === sValue) this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationBlink;
			else
				this.m_oValue.eTextDecoration = ECssTextDecoration.csstextdecorationNone;
		}
		CCssProperty.prototype.ReadValue_VTextAlign = function (sValue) {
			if (("left") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLeft;
			else if (("right") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignRight;
			else if (("center") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignCenter;
			else if (("justify") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignJustify;
			else if (("letter-justify") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLetterJustify;
			else if (("stretch-justify") === sValue) this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignStretchJustify;
			else
				this.m_oValue.eVTextAlign = ECssVTextAlign.cssvtextalignLeft;
		}
		CCssProperty.prototype.ReadValue_VTextSpacingMode = function (sValue) {
			if (("tightening") === sValue) this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTightening;
			else if (("tracking") === sValue) this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTracking;
			else
				this.m_oValue.eVTextSpacingMode = ECssVTextSpacingMode.cssvtextspacingmodeTightening;
		}


		function CTextPath() {
			CBaseNoId.call(this);
			this.m_oFitPath = null;
			this.m_oFitShape = null;
			this.m_oId = null;
			this.m_oOn = null;
			this.m_sString = null;
			this.m_oStyle = null;
			this.m_oTrim = null;
			this.m_oXScale = null;
			this.m_sStringOriginal = null;
		}

		IC(CTextPath, CBaseNoId, 0);
		CTextPath.prototype.readAttrXml = function (name, reader) {
			let wsChar = name.charCodeAt(0);
			switch (wsChar) {
				case 'f':
					if (("fitpath") === name) this.m_oFitPath = reader.GetValueBool();
					else if (("fitshape") === name) this.m_oFitShape = reader.GetValueBool();
					break;
				case 'i':
					if (("id") === name) this.m_oId = reader.GetValue();
					break;
				case 'o':
					if (("on") === name) this.m_oOn = reader.GetValueBool();
					break;
				case 's':
					if (("string") === name) this.m_sString = reader.GetValue();
					else if (("style") === name) this.m_oStyle = new CCssStyle(reader.GetValue());
					break;
				case 't':
					if (("trim") === name) this.m_oTrim = reader.GetValueBool();
					break;
				case 'x':
					if (("xscale") === name) this.m_oXScale = reader.GetValueBool();
					break;
			}
		};
		CTextPath.prototype.writeAttrXmlImpl = function (writer) {
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


		let EBorderType =
			{
				bordertypeDash: 0, // (pecifies a line border consisting of a dashed line around the parent object.)
				bordertypeDashDotDot: 1, // (Dash Dot Dot Border)
				bordertypeDashDotStroked: 2, // (Stroked Dash Dot Border)
				bordertypeDashedSmall: 3, // (Small Dash Border)
				bordertypeDot: 4, // (Dotted Border)
				bordertypeDotDash: 5, // (Dot Dash Border)
				bordertypeDouble: 6, // (Double Line Border)
				bordertypeDoubleWave: 7, // (Double Wavy Lines Border)
				bordertypeHairline: 8, // (Hairline Border)
				bordertypeHTMLInset: 9, // (Inset Border)
				bordertypeHTMLOutset: 10, // (Outset Border)
				bordertypeNone: 11, // (No Border)
				bordertypeSingle: 12, // (Single Line Border)
				bordertypeThick: 13, // (Thick Line Border)
				bordertypeThickBetweenThin: 14, // (Thin-thick-thin Border)
				bordertypeThickBetweenThinLarge: 15, // (Large thin-thick-thin Border)
				bordertypeThickBetweenThinSmall: 16, // (Small thin-thick-thin Lines Border)
				bordertypeThickThin: 17, // (Thick Thin Line Border)
				bordertypeThickThinLarge: 18, // (Thick Thin Large Gap Border)
				bordertypeThickThinSmall: 19, // (Small thick-thin lines border)
				bordertypeThinThick: 20, // (Thin Thick Line Border)
				bordertypeThinThickLarge: 21, // (Thin Thick Large Gap Border)
				bordertypeThinThickSmall: 22, // (Thin Thick Small Gap Border)
				bordertypeThreeDEmboss: 23, // (3D Embossed Border)
				bordertypeThreeDEngrave: 24, // (3D Engraved Border)
				bordertypeTriple: 25, // (Triple Line Border)
				bordertypeWave: 26 // (Wavy Border)
			};


		function readBorderType(reader) {
			let sValue = reader.GetValue();
			let wChar = sValue.charAt(0);
			switch (wChar) {
				case 'd':
					if (("dash") === sValue) return EBorderType.bordertypeDash;
					else if (("dashDotDot") === sValue) return EBorderType.bordertypeDashDotDot;
					else if (("dashDotStroked") === sValue) return EBorderType.bordertypeDashDotStroked;
					else if (("dashedSmall") === sValue) return EBorderType.bordertypeDashedSmall;
					else if (("dot") === sValue) return EBorderType.bordertypeDot;
					else if (("dotDash") === sValue) return EBorderType.bordertypeDotDash;
					else if (("double") === sValue) return EBorderType.bordertypeDouble;
					else if (("doubleWave") === sValue) return EBorderType.bordertypeDoubleWave;
					break;
				case 'h':
					if (("hairline") === sValue) return EBorderType.bordertypeHairline;
					break;

				case 'H':
					if (("HTMLInset") === sValue) return EBorderType.bordertypeHTMLInset;
					else if (("HTMLOutset") === sValue) return EBorderType.bordertypeHTMLOutset;
					break;

				case 'n':
					if (("none") === sValue) return EBorderType.bordertypeNone;
					break;

				case 's':
					if (("single") === sValue) return EBorderType.bordertypeSingle;
					break;

				case 't':
					if (("thick") === sValue) return EBorderType.bordertypeThick;
					else if (("thickBetweenThin") === sValue) return EBorderType.bordertypeThickBetweenThin;
					else if (("thickBetweenThinLarge") === sValue) return EBorderType.bordertypeThickBetweenThinLarge;
					else if (("thickBetweenThinSmall") === sValue) return EBorderType.bordertypeThickBetweenThinSmall;
					else if (("thickThin") === sValue) return EBorderType.bordertypeThickThin;
					else if (("thickThinLarge") === sValue) return EBorderType.bordertypeThickThinLarge;
					else if (("thickThinSmall") === sValue) return EBorderType.bordertypeThickThinSmall;
					else if (("thinThick") === sValue) return EBorderType.bordertypeThinThick;
					else if (("thinThickLarge") === sValue) return EBorderType.bordertypeThinThickLarge;
					else if (("thinThickSmall") === sValue) return EBorderType.bordertypeThinThickSmall;
					else if (("threeDEmboss") === sValue) return EBorderType.bordertypeThreeDEmboss;
					else if (("threeDEngrave") === sValue) return EBorderType.bordertypeThreeDEngrave;
					else if (("triple") === sValue) return EBorderType.bordertypeTriple;
					break;

				case 'w':
					if (("wave") === sValue) return EBorderType.bordertypeWave;
					break;
			}
			return EBorderType.bordertypeNone;
		}

		let EBorderShadow =
			{
				bordershadowFalse: 0,
				bordershadowTrue: 1
			};

		function readBorderShadow(reader) {
			let bVal = reader.GetValueBool();
			return bVal ? EBorderShadow.bordershadowTrue : EBorderShadow.bordershadowFalse;
		}

		function CBorder(sType) {
			CBaseNoId.call(this);
			this.m_sType = sType;
			this.m_oShadow = null;
			this.m_oType = null;
			this.m_oWidth = null;
		}

		IC(CBorder, CBaseNoId, 0);
		CBorder.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "shadow":
					this.m_oShadow = readBorderShadow(reader);
					break;
				case "type":
					this.m_oType = readBorderType(reader);
					break;
				case "width":
					this.m_oWidth = reader.GetValueInt();
					break;
			}
		};
		CBorder.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};

		let EWrapSide =
			{
				wrapsideBoth: 0,
				wrapsideLargest: 1,
				wrapsideLeft: 2,
				wrapsideRight: 3
			};

		function readWrapSide(reader) {
			let sValue = reader.GetValue();

			if ("both" === sValue) return EWrapSide.wrapsideBoth;
			if ("largest" === sValue) return EWrapSide.wrapsideLargest;
			if ("left" === sValue) return EWrapSide.wrapsideLeft;
			if ("right" === sValue) return EWrapSide.wrapsideRight;
		}

		let EVerticalAnchor =
			{
				verticalanchorLine: 0,
				verticalanchorMargin: 1,
				verticalanchorPage: 2,
				verticalanchorText: 3
			};

		function readVerticalAnchor(reader) {
			let sVal = reader.GetValue();
			if (sVal === "line") return EVerticalAnchor.verticalanchorLine;
			if (sVal === "margin") return EVerticalAnchor.verticalanchorMargin;
			if (sVal === "page") return EVerticalAnchor.verticalanchorPage;
			if (sVal === "text") return EVerticalAnchor.verticalanchorText;
			return EVerticalAnchor.verticalanchorLine;
		}

		function readHorizontalAnchor(reader) {
			let sVal = reader.GetValue();
			if (sVal === "line") return EHorizontalAnchor.horizontalanchorChar;
			if (sVal === "margin") return EHorizontalAnchor.horizontalanchorMargin;
			if (sVal === "page") return EHorizontalAnchor.horizontalanchorPage;
			if (sVal === "text") return EHorizontalAnchor.horizontalanchorText;
			return EHorizontalAnchor.horizontalanchorChar;
		}


		let EHorizontalAnchor =
			{
				horizontalanchorChar: 0,
				horizontalanchorMargin: 1,
				horizontalanchorPage: 2,
				horizontalanchorText: 3
			};


		let EWrapType =
			{
				wraptypeNone: 0,
				wraptypeSquare: 1,
				wraptypeThrough: 2,
				wraptypeTight: 3,
				wraptypeTopAndBottom: 4
			};

		function readWrapType(reader) {
			let sVal = reader.GetValue();
			if (sVal === "none") return EWrapType.wraptypeNone;
			if (sVal === "square") return EWrapType.wraptypeSquare;
			if (sVal === "through") return EWrapType.wraptypeThrough;
			if (sVal === "tight") return EWrapType.wraptypeTight;
			if (sVal === "topAndBottom") return EWrapType.wraptypeTopAndBottom;
			return EWrapType.wraptypeNone;
		}

		function CWrap() {
			CBaseNoId.call(this);

			this.m_oAnchorX = null;
			this.m_oAnchorY = null;
			this.m_oSide = null;
			this.m_oType = null;
		}

		IC(CWrap, CBaseNoId, 0);
		CWrap.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "anchorx":
					this.m_oAnchorX = readHorizontalAnchor(reader);
					break;
				case "anchory":
					this.m_oAnchorY = readVerticalAnchor(reader);
					break;
				case "side":
					this.m_oSide = readWrapSide(reader);
					break;
				case "type":
					this.m_oType = readWrapType(reader);
					break;
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


		let EVmlClientDataObjectType =
			{
				vmlclientdataobjecttypeButton: 0,
				vmlclientdataobjecttypeCheckbox: 1,
				vmlclientdataobjecttypeDialog: 2,
				vmlclientdataobjecttypeDrop: 3,
				vmlclientdataobjecttypeEdit: 4,
				vmlclientdataobjecttypeGBox: 5,
				vmlclientdataobjecttypeGroup: 6,
				vmlclientdataobjecttypeLabel: 7,
				vmlclientdataobjecttypeLineA: 8,
				vmlclientdataobjecttypeList: 9,
				vmlclientdataobjecttypeMovie: 10,
				vmlclientdataobjecttypeNote: 11,
				vmlclientdataobjecttypePict: 12,
				vmlclientdataobjecttypeRadio: 13,
				vmlclientdataobjecttypeRect: 14,
				vmlclientdataobjecttypeRectA: 15,
				vmlclientdataobjecttypeScroll: 16,
				vmlclientdataobjecttypeShape: 17,
				vmlclientdataobjecttypeSpin: 18
			};

		function readClientDataObjectType(reader) {
			let sValue = reader.GetValue();
			if (("Button") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeButton;
			else if (("Checkbox") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeCheckbox;
			else if (("Dialog") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeDialog;
			else if (("Drop") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeDrop;
			else if (("Edit") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeEdit;
			else if (("GBox") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeGBox;
			else if (("Group") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeGroup;
			else if (("Label") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeLabel;
			else if (("LineA") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeLineA;
			else if (("List") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeList;
			else if (("Movie") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeMovie;
			else if (("Note") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeNote;
			else if (("Pict") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypePict;
			else if (("Radio") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeRadio;
			else if (("Rect") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeRect;
			else if (("RectA") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeRectA;
			else if (("Scroll") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeScroll;
			else if (("Shape") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeShape;
			else if (("Spin") === sValue) return EVmlClientDataObjectType.vmlclientdataobjecttypeSpin;
			return EVmlClientDataObjectType.vmlclientdataobjecttypeButton;
		}

		function CClientData() {
			CBaseNoId.call(this);
			this.m_oObjectType = null;

			this.m_oMoveWithCells = null;
			this.m_oSizeWithCells = null;
			this.m_oAnchor = null;
			this.m_oRow = null;
			this.m_oColumn = null;
			this.m_oMin = null;
			this.m_oMax = null;
			this.m_oInc = null;
			this.m_oDx = null;
			this.m_oPage = null;
			this.m_oDropLines = null;
			this.m_oSel = null;
			this.m_oWidthMin = null;
			this.m_oDropStyle = null;
			this.m_oFirstButton = null;
			this.m_oDefaultSize = null;
			this.m_oAutoFill = null;
			this.m_oAutoScale = null;
			this.m_oAutoLine = null;
			this.m_oHoriz = null;
			this.m_oVScroll = null;
			this.m_oAutoPict = null;
			this.m_oColored = null;
			this.m_oMultiLine = null;
			this.m_oNoThreeD = null;
			this.m_oNoThreeD2 = null;
			this.m_oLockText = null;
			this.m_oJustLastX = null;
			this.m_oSecretEdit = null;
			this.m_oFmlaLink = null;
			this.m_oFmlaRange = null;
			this.m_oFmlaMacro = null;
			this.m_oFmlaTxbx = null;
			this.m_oFmlaGroup = null;
			this.m_oCf = null;
			this.m_oChecked = null;
			this.m_oMultiSel = null;
			this.m_oSelType = null;
			this.m_oVal = null;
			this.m_oTextHAlign = null;
			this.m_oTextVAlign = null;
			this.m_oVisible = null;
		}

		IC(CClientData, CBaseNoId, 0);
		CClientData.prototype.readAttrXml = function (name, reader) {
			switch (name) {
				case "ObjectType" :
					this.m_oObjectType = readClientDataObjectType(reader);
					break;
			}
		};
		CClientData.prototype.readChildXml = function (name, reader) {
			let sContent = reader.GetTextDecodeXml();
			if ("MoveWithCells" === name) this.m_oMoveWithCells = sContent.length === 0 ? "t" : sContent;
			else if ("SizeWithCells" === name) this.m_oSizeWithCells = sContent.length === 0 ? "t" : sContent;
			else if ("Anchor" === name) this.m_oAnchor = sContent;
			else if ("Row" === name) this.m_oRow = sContent;
			else if ("Column" === name) this.m_oColumn = sContent;
			else if ("DefaultSize" === name) this.m_oDefaultSize = sContent.length === 0 ? "t" : sContent;
			else if ("AutoLine" === name) this.m_oAutoLine = sContent.length === 0 ? "t" : sContent;
			else if ("AutoFill" === name) this.m_oAutoFill = sContent.length === 0 ? "t" : sContent;
			else if ("AutoPict" === name) this.m_oAutoPict = sContent.length === 0 ? "t" : sContent;
			else if ("AutoScale" === name) this.m_oAutoScale = sContent.length === 0 ? "t" : sContent;
			else if ("FmlaLink" === name) this.m_oFmlaLink = sContent;
			else if ("FmlaRange" === name) this.m_oFmlaRange = sContent;
			else if ("FmlaMacro" === name) this.m_oFmlaMacro = sContent;
			else if ("FmlaTxbx" === name) this.m_oFmlaTxbx = sContent;
			else if ("FmlaGroup" === name) this.m_oFmlaGroup = sContent;
			else if ("CF" === name) this.m_oCf = sContent;
			else if ("Min" === name) this.m_oMin = sContent;
			else if ("Max" === name) this.m_oMax = sContent;
			else if ("Val" === name) this.m_oVal = sContent;
			else if ("Inc" === name) this.m_oInc = sContent;
			else if ("Sel" === name) this.m_oSel = sContent.length === 0 ? "t" : sContent;
			else if ("WidthMin" === name) this.m_oWidthMin = sContent;
			else if ("Dx" === name) this.m_oDx = sContent;
			else if ("Page" === name) this.m_oPage = sContent;
			else if ("DropLines" === name) this.m_oDropLines = sContent;
			else if ("NoThreeD2" === name) this.m_oNoThreeD2 = sContent.length === 0 ? "t" : sContent;
			else if ("NoThreeD" === name) this.m_oNoThreeD = sContent.length === 0 ? "t" : sContent;
			else if ("DropStyle" === name) this.m_oDropStyle = sContent;
			else if ("FirstButton" === name) this.m_oFirstButton = sContent.length === 0 ? "t" : sContent;
			else if ("VScroll" === name) this.m_oVScroll = sContent.length === 0 ? "t" : sContent;
			else if ("Horiz" === name) this.m_oHoriz = sContent.length === 0 ? "t" : sContent;
			else if ("TextHAlign" === name) this.m_oTextHAlign = sContent;
			else if ("TextVAlign" === name) this.m_oTextVAlign = sContent;
			else if ("Colored" === name) this.m_oColored = sContent.length === 0 ? "t" : sContent;
			else if ("MultiLine" === name) this.m_oMultiLine = sContent.length === 0 ? "t" : sContent;
			else if ("LockText" === name) this.m_oLockText = sContent.length === 0 ? "t" : sContent;
			else if ("JustLastX" === name) this.m_oJustLastX = sContent.length === 0 ? "t" : sContent;
			else if ("SecretEdit" === name) this.m_oSecretEdit = sContent.length === 0 ? "t" : sContent;
			else if ("SelType" === name) this.m_oSelType = sContent;
			else if ("Visible" === name) this.m_oVisible = sContent.length === 0 ? "t" : sContent;
		};
		CClientData.prototype.writeAttrXmlImpl = function (writer) {
			//TODO:Implement in children
		};
		CClientData.prototype.writeChildren = function (writer) {
			//TODO:Implement in children
		};
	})(window);