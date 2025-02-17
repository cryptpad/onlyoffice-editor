/*
 * (c) Copyright Ascensio System SIA 2010-2024
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
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
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
function CNativeGraphics(nativeEmbed)
{
    AscCommon.CGraphicsBase.call(this, AscCommon.RendererType.NativeDrawer);

    /** @suppress {checkVars} */
    this.Native = nativeEmbed ? nativeEmbed : CreateEmbedObject("CGraphicsEmbed");

    this.isNativeGraphics = true;

    this.width        = 0;
    this.height       = 0;
    this.m_dWidthMM   = 0;
    this.m_dHeightMM  = 0;
    this.m_lWidthPix  = 0;
    this.m_lHeightPix = 0;
    this.m_dDpiX      = 96.0;
    this.m_dDpiY      = 96.0;

    this.TextureFillTransformScaleX = 1;
    this.TextureFillTransformScaleY = 1;

    this.dash_no_smart   = null;
    this.TextClipRect    = null;
    this.ArrayPoints     = null;
    this.MaxEpsLine      = null;
    this.m_oTextPr       = null;

    this.m_oGrFonts = {
        Ascii    : {Name : "", Index : -1}, 
        EastAsia : {Name : "", Index : -1}, 
        HAnsi    : {Name : "", Index : -1}, 
        CS       : {Name : "", Index : -1}
    };
}

CNativeGraphics.prototype = Object.create(AscCommon.CGraphicsBase.prototype);
CNativeGraphics.prototype.constructor = CNativeGraphics;

CNativeGraphics.prototype.create = function(nativecontrol, width_px, height_px, width_mm, height_mm)
{
    this.TextureFillTransformScaleX = width_mm  / (width_px  >> 0);
    this.TextureFillTransformScaleY = height_mm / (height_px >> 0);
    this.Native["create"](nativecontrol, width_px, height_px, width_mm, height_mm);
};
CNativeGraphics.prototype.put_GlobalAlpha = function(enable, alpha)
{
    this.Native["put_GlobalAlpha"](enable, alpha);
};
CNativeGraphics.prototype.Start_GlobalAlpha = function()
{
    // this.Native["Start_GlobalAlpha"]();
};
CNativeGraphics.prototype.End_GlobalAlpha = function()
{
    this.Native["End_GlobalAlpha"]();
};
// pen methods
CNativeGraphics.prototype.p_color = function(r, g, b, a)
{
    this.Native["p_color"](r, g, b, a);
};
CNativeGraphics.prototype.p_width = function(w)
{
    this.Native["p_width"](w);
};
CNativeGraphics.prototype.p_dash = function(params)
{
    this.Native["p_dash"](params ? params : []);
};
// brush methods
CNativeGraphics.prototype.b_color1 = function(r, g, b, a)
{
    this.Native["b_color1"](r, g, b, a);
};
CNativeGraphics.prototype.b_color2 = function(r, g, b, a)
{
    this.Native["b_color2"](r, g, b, a);
};
CNativeGraphics.prototype.transform = function(sx, shy, shx, sy, tx, ty)
{
    this.Native["transform"](sx, shy, shx, sy, tx, ty);
};
CNativeGraphics.prototype.CalculateFullTransform = function(isInvertNeed)
{
    this.Native["CalculateFullTransform"](isInvertNeed);
};
// path commands
CNativeGraphics.prototype._s = function()
{
    this.Native["_s"]();
};
CNativeGraphics.prototype._e = function()
{
    this.Native["_e"]();
};
CNativeGraphics.prototype._z = function()
{
    this.Native["_z"]();
};
CNativeGraphics.prototype._m = function(x, y)
{
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    this.Native["_m"](x, y);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
};
CNativeGraphics.prototype._l = function(x, y)
{
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    this.Native["_l"](x, y);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
};
CNativeGraphics.prototype._c = function(x1, y1, x2, y2, x3, y3)
{
    x1 = isNaN(x1) ? 0 : x1;
    y1 = isNaN(y1) ? 0 : y1;
    x2 = isNaN(x2) ? 0 : x2;
    y2 = isNaN(y2) ? 0 : y2;
    x3 = isNaN(x3) ? 0 : x3;
    y3 = isNaN(y3) ? 0 : y3;
    this.Native["_c"](x1, y1, x2, y2, x3, y3);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        this.ArrayPoints[this.ArrayPoints.length] = {x: x1, y: y1};
        this.ArrayPoints[this.ArrayPoints.length] = {x: x2, y: y2};
        this.ArrayPoints[this.ArrayPoints.length] = {x: x3, y: y3};
    }
};
CNativeGraphics.prototype._c2 = function(x1, y1, x2, y2)
{
    x1 = isNaN(x1) ? 0 : x1;
    y1 = isNaN(y1) ? 0 : y1;
    x2 = isNaN(x2) ? 0 : x2;
    y2 = isNaN(y2) ? 0 : y2;
    this.Native["_c2"](x1, y1, x2, y2);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        this.ArrayPoints[this.ArrayPoints.length] = {x: x1, y: y1};
        this.ArrayPoints[this.ArrayPoints.length] = {x: x2, y: y2};
    }
};
CNativeGraphics.prototype.ds = function()
{
    this.Native["ds"]();
};
CNativeGraphics.prototype.df = function()
{
    this.Native["df"]();
};
// canvas state
CNativeGraphics.prototype.save = function()
{
    this.Native["save"]();
};
CNativeGraphics.prototype.restore = function()
{
    this.Native["restore"]();
};
CNativeGraphics.prototype.clip = function()
{
    this.Native["clip"]();
};
CNativeGraphics.prototype.reset = function()
{
    this.Native["reset"]();
};
CNativeGraphics.prototype.transform3 = function(m, isNeedInvert)
{
    this.Native["transform"](m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
};
// images
CNativeGraphics.prototype.drawImage2 = function(img, x, y, w, h, alpha, srcRect)
{
    this.Native["drawImage2"](img, x, y, w, h, alpha, srcRect);
};
CNativeGraphics.prototype.drawImage = function(img, x, y, w, h, alpha, srcRect, nativeImage)
{
    this.Native["drawImage"](img, x, y, w, h, alpha, srcRect, nativeImage);
};
// text
CNativeGraphics.prototype.GetFont = function()
{
    return this.Native["GetFont"]();
};
CNativeGraphics.prototype.font = function(font_id, font_size)
{
    this.Native["font"](font_id, font_size);
};
CNativeGraphics.prototype.SetFont = function(font)
{
    if (null == font)
        return;

    var flag = 0;
    if (font.Bold)    flag |= 0x01;
    if (font.Italic)  flag |= 0x02;
    if (font.Bold)    flag |= 0x04;
    if (font.Italic)  flag |= 0x08;

    this.Native["SetFont"](font.FontFamily.Name, font.FontFamily.Index, font.FontSize, flag);
};
CNativeGraphics.prototype.SetTextPr = function(textPr, theme)
{
    this.m_oTextPr = textPr;
    if (theme)
    {
        this.m_oGrFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(this.m_oTextPr.RFonts.Ascii    ? this.m_oTextPr.RFonts.Ascii.Name    : null);
        this.m_oGrFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(this.m_oTextPr.RFonts.EastAsia ? this.m_oTextPr.RFonts.EastAsia.Name : null);
        this.m_oGrFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(this.m_oTextPr.RFonts.HAnsi    ? this.m_oTextPr.RFonts.HAnsi.Name    : null);
        this.m_oGrFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(this.m_oTextPr.RFonts.CS       ? this.m_oTextPr.RFonts.CS.Name       : null);
        this.m_oGrFonts.Ascii.Index    = -1;
        this.m_oGrFonts.EastAsia.Index = -1;
        this.m_oGrFonts.HAnsi.Index    = -1;
        this.m_oGrFonts.CS.Index       = -1;
    }
    else
    {
        this.m_oGrFonts = this.m_oTextPr.RFonts;
    }
};

CNativeGraphics.prototype.SetFontInternal = function(name, size, style)
{
    this.Native["SetFont"](name, -1, size, style);
};

CNativeGraphics.prototype.SetFontSlot = function(slot, fontSizeKoef)
{
    var _lastFont = {FontFamily : {Name : "Arial", Index : -1}, FontSize : 16, Italic : true, Bold : true};
    switch(slot)
    {
        case 0: // fontslot_ASCII
        {
            _lastFont.FontFamily.Name = this.m_oGrFonts.Ascii.Name;
            _lastFont.FontSize = this.m_oTextPr.FontSize;
            _lastFont.Bold     = this.m_oTextPr.Bold;
            _lastFont.Italic   = this.m_oTextPr.Italic;
            break;
        }
        case 1: // fontslot_EastAsia
        {
              _lastFont.FontFamily.Name = this.m_oGrFonts.EastAsia.Name;
              _lastFont.FontSize = this.m_oTextPr.FontSize;
              _lastFont.Bold     = this.m_oTextPr.Bold;
              _lastFont.Italic   = this.m_oTextPr.Italic;
              break;
        }
        case 2: // fontslot_CS
        {
            _lastFont.FontFamily.Name = this.m_oGrFonts.CS.Name;
            _lastFont.FontSize = this.m_oTextPr.FontSizeCS;
            _lastFont.Bold     = this.m_oTextPr.BoldCS;
            _lastFont.Italic   = this.m_oTextPr.ItalicCS;
            break;
        }
        case 3: // fontslot_HAnsi
        default:
        {
            _lastFont.FontFamily.Name = this.m_oGrFonts.HAnsi.Name;
            _lastFont.FontSize = this.m_oTextPr.FontSize;
            _lastFont.Bold     = this.m_oTextPr.Bold;
            _lastFont.Italic   = this.m_oTextPr.Italic;
            break;
        }
    }
    if (undefined !== fontSizeKoef)
    {
        _lastFont.FontSize *= fontSizeKoef;
    }
    this.SetFont(_lastFont);
};
CNativeGraphics.prototype.GetTextPr = function()
{
    return this.m_oTextPr;
};
CNativeGraphics.prototype.FillText = function(x, y, text)
{
    var _code = text.charCodeAt(0);
    this.Native["FillText"](x, y, _code);
};
CNativeGraphics.prototype.t = function(text, x, y, isBounds)
{
    this.Native["t"](x, y, text);
};
CNativeGraphics.prototype.FillText2 = function(x, y, text, cropX, cropW)
{
    var _code = text.charCodeAt(0);
    this.Native["FillText2"](x, y, _code, cropX, cropW);
};
CNativeGraphics.prototype.t2 = function(text, x, y, cropX, cropW)
{
    this.Native["t2"](x, y, text, cropX, cropW);
};
CNativeGraphics.prototype.FillTextCode = function(x, y, lUnicode)
{
    this.Native["FillTextCode"](x, y, lUnicode);
};
CNativeGraphics.prototype.tg = function(code, x, y)
{
    this.Native["tg"](code, x, y);
};

CNativeGraphics.prototype.SetIntegerGrid = function(param)
{
    this.Native["SetIntegerGrid"](param);
};
CNativeGraphics.prototype.GetIntegerGrid = function()
{
    return this.Native["GetIntegerGrid"]();
};
CNativeGraphics.prototype.DrawStringASCII = function(name, size, bold, italic, text, x, y, bIsHeader)
{
    this.SetFont({FontFamily : {Name : name, Index : -1}, FontSize : size, Italic : italic, Bold : bold});
    this.Native["DrawStringASCII"](text, x, y);
};
CNativeGraphics.prototype.DrawStringASCII2 = function(name, size, bold, italic, text, x, y, bIsHeader)
{
    this.SetFont({FontFamily : {Name : name, Index : -1}, FontSize : size, Italic : italic, Bold : bold});
    this.Native["DrawStringASCII2"](text, x, y);
};
CNativeGraphics.prototype.DrawHeaderEdit = function(yPos, lock_type, sectionNum, bIsRepeat, type)
{
    this.Native["DrawHeaderEdit"](yPos, lock_type, sectionNum, bIsRepeat, type);
};
CNativeGraphics.prototype.DrawFooterEdit = function(yPos, lock_type, sectionNum, bIsRepeat, type)
{
    this.Native["DrawFooterEdit"](yPos, lock_type, sectionNum, bIsRepeat, type);
};
CNativeGraphics.prototype.DrawLockParagraph = function(lock_type, x, y1, y2)
{
    this.Native["DrawLockParagraph"](x, y1, y2);
};
CNativeGraphics.prototype.DrawLockObjectRect = function(lock_type, x, y, w, h)
{
    if (this.IsThumbnail)
        return;

    this.Native["DrawLockObjectRect"](x, y, w, h);
};
CNativeGraphics.prototype.DrawEmptyTableLine = function(x1, y1, x2, y2)
{
    this.Native["DrawEmptyTableLine"](x1, y1, x2, y2);
};
CNativeGraphics.prototype.DrawSpellingLine = function(y0, x0, x1, w)
{
    this.Native["DrawSpellingLine"](y0, x0, x1, w);
};
// smart methods for horizontal / vertical lines
CNativeGraphics.prototype.drawHorLine = function(align, y, x, r, penW)
{
    this.Native["drawHorLine"](align, y, x, r, penW);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
        this.ArrayPoints[this.ArrayPoints.length] = {x: r, y: y};
    }
};
CNativeGraphics.prototype.drawHorLine2 = function(align, y, x, r, penW)
{
    this.Native["drawHorLine2"](align, y, x, r, penW);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        var _y1 = y - penW / 2;
        var _y2 = _y1 + 2 * penW;

        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: _y1};
        this.ArrayPoints[this.ArrayPoints.length] = {x: r, y: _y1};
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: _y2};
        this.ArrayPoints[this.ArrayPoints.length] = {x: r, y: _y2};
    }
};
CNativeGraphics.prototype.drawVerLine = function(align, x, y, b, penW)
{
    this.Native["drawVerLine"](align, x, y, b, penW);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: b};
    }
};
// мега крутые функции для таблиц
CNativeGraphics.prototype.drawHorLineExt = function(align, y, x, r, penW, leftMW, rightMW)
{
    this.Native["drawHorLineExt"](align, y, x, r, penW, leftMW, rightMW);

    if (false === this.GetIntegerGrid() && this.ArrayPoints != null)
    {
        this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
        this.ArrayPoints[this.ArrayPoints.length] = {x: r, y: y};
    }
};
CNativeGraphics.prototype.rect = function(x, y, w, h)
{
    this.Native["rect"](x, y, w, h);
};
CNativeGraphics.prototype.TableRect = function(x, y, w, h)
{
    this.Native["TableRect"](x, y, w, h);
};
// функции клиппирования
CNativeGraphics.prototype.AddClipRect = function(x, y, w, h)
{
    this.Native["AddClipRect"](x, y, w, h);
};
CNativeGraphics.prototype.RemoveClipRect = function()
{
    this.Native["RemoveClipRect"]();
};
CNativeGraphics.prototype.SetClip = function(r)
{
    this.Native["SetClip"](r.x, r.y, r.w, r.h);
};
CNativeGraphics.prototype.RemoveClip = function()
{
    this.Native["RemoveClip"]();
};
CNativeGraphics.prototype.drawCollaborativeChanges = function(x, y, w, h, Color)
{
};
CNativeGraphics.prototype.drawMailMergeField = function(x, y, w, h)
{
    this.Native["drawMailMergeField"](x, y, w, h);
};
CNativeGraphics.prototype.drawSearchResult = function(x, y, w, h)
{
    this.Native["drawSearchResult"](x, y, w, h);
};
CNativeGraphics.prototype.drawFlowAnchor = function(x, y)
{
    this.Native["drawFlowAnchor"](x, y);
};
CNativeGraphics.prototype.SavePen = function()
{
    this.Native["SavePen"]();
};
CNativeGraphics.prototype.RestorePen = function()
{
    this.Native["RestorePen"]();
};
CNativeGraphics.prototype.SaveBrush = function()
{
    this.Native["SaveBrush"]();
};
CNativeGraphics.prototype.RestoreBrush = function()
{
    this.Native["RestoreBrush"]();
};
CNativeGraphics.prototype.SavePenBrush = function()
{
    this.Native["SavePenBrush"]();
};
CNativeGraphics.prototype.RestorePenBrush = function()
{
    this.Native["RestorePenBrush"]();
};
CNativeGraphics.prototype.SaveGrState = function()
{
    this.Native["SaveGrState"]();
};
CNativeGraphics.prototype.RestoreGrState = function()
{
    this.Native["RestoreGrState"]();
};
CNativeGraphics.prototype.StartClipPath = function()
{
    this.Native["StartClipPath"]();
};
CNativeGraphics.prototype.EndClipPath = function()
{
    this.Native["EndClipPath"]();
};
CNativeGraphics.prototype.StartCheckTableDraw = function()
{
    return this.Native["StartCheckTableDraw"]();
};
CNativeGraphics.prototype.EndCheckTableDraw = function(bIsRestore)
{
    if(bIsRestore)
        this.RestoreGrState();
};
CNativeGraphics.prototype.SetTextClipRect = function(_l, _t, _r, _b)
{
    this.Native["SetTextClipRect"](_l, _t, _r, _b);
};
CNativeGraphics.prototype.AddSmartRect = function(x, y, w, h, pen_w)
{
    this.Native["AddSmartRect"](x, y, w, h, pen_w);
};
CNativeGraphics.prototype.CheckUseFonts2 = function(_transform)
{
};
CNativeGraphics.prototype.UncheckUseFonts2 = function()
{
};
CNativeGraphics.prototype.DrawFootnoteRect = function(x, y, w, h)
{
    this.Native["DrawFootnoteRect"](x, y, w, h);
};
// new methods
CNativeGraphics.prototype.toDataURL = function(type)
{
    return this.Native["toDataURL"](type);
};
CNativeGraphics.prototype.GetPenColor = function()
{
    return this.Native["GetPenColor"]();
};
CNativeGraphics.prototype.GetBrushColor = function()
{
    return this.Native["GetBrushColor"]();
};
CNativeGraphics.prototype.put_brushTexture = function(src, type)
{
    this.Native["put_brushTexture"](src, type);
};
CNativeGraphics.prototype.put_brushTextureMode = function(mode)
{
    this.Native["put_brushTextureMode"](mode);
};
CNativeGraphics.prototype.put_BrushTextureAlpha = function(a)
{
    this.Native["put_BrushTextureAlpha"](a);
};
CNativeGraphics.prototype.put_BrushGradient = function(gradFill, points, transparent)
{
    var colors = new Array(gradFill.colors.length * 5);
    for (var i = 0; i < gradFill.colors.length; i++) {
        colors[i * 5] = gradFill.colors[i].pos;
        colors[i * 5 + 1] = gradFill.colors[i].color.RGBA.R;
        colors[i * 5 + 2] = gradFill.colors[i].color.RGBA.G;
        colors[i * 5 + 3] = gradFill.colors[i].color.RGBA.B;
        colors[i * 5 + 4] = gradFill.colors[i].color.RGBA.A;
    }
    this.Native["put_BrushGradient"](colors, transparent, points.x0, points.y0, points.x1, points.y1, points.r0, points.r1);
};
CNativeGraphics.prototype.TransformPointX = function(x, y)
{
    return this.Native["TransformPointX"](x, y);
};
CNativeGraphics.prototype.TransformPointY = function(x, y)
{
    return this.Native["TransformPointY"](x, y);
};
CNativeGraphics.prototype.put_LineJoin = function(join)
{
    this.Native["put_LineJoin"](join);
};
CNativeGraphics.prototype.get_LineJoin = function()
{
    return this.Native["get_LineJoin"]();
};
CNativeGraphics.prototype.put_TextureBoundsEnabled = function(enabled)
{
};
CNativeGraphics.prototype.put_TextureBounds = function(x, y, w, h)
{
    this.Native["put_TextureBounds"](x, y, w, h);
};
CNativeGraphics.prototype.GetLineWidth = function()
{
    return this.Native["GetlineWidth"]();
};
CNativeGraphics.prototype.DrawPath = function(path)
{
    this.Native["DrawPath"](path);
};
CNativeGraphics.prototype.drawpath = function(path)
{
    this.Native["DrawPath"](path);
};
CNativeGraphics.prototype.CoordTransformOffset = function(tx, ty)
{
    this.Native["CoordTransformOffset"](tx, ty);
};
CNativeGraphics.prototype.GetTransform = function()
{
    var _trans = this.Native["GetTransform"]();
    var _transform = new AscCommon.CMatrix;
    _transform.sx  = _trans.sx;
    _transform.shx = _trans.shx;
    _transform.shy = _trans.shy;
    _transform.sy  = _trans.sy;
    _transform.tx  = _trans.tx;
    _transform.ty  = _trans.ty;
    return _transform;
};
CNativeGraphics.prototype.GetBrush = function()
{
    return { Color1 : this.Native["GetBrushColor"]()};
};
CNativeGraphics.prototype.GetPen = function()
{
    return { Color : this.Native["GetPenColor"]()};
};

CNativeGraphics.prototype.Destroy = function()
{
    this.Native["Destroy"]();
};

CNativeGraphics.prototype.CreateLayer = function(opacity)
{
    this.Native["CreateLayer"](opacity);
};
CNativeGraphics.prototype.BlendLayer = function()
{
    this.Native["BlendLayer"]();
};

AscCommon.CNativeGraphics = CNativeGraphics;
