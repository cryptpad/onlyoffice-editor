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

    function EditShapeGeometryTrack(originalShape) {
        this.geometry = originalShape.calcGeometry;
        this.originalShape = originalShape;
        this.originalObject = originalShape;
        this.shapeWidth = originalShape.extX;
        this.shapeHeight = originalShape.extY;
        var oPen = originalShape.pen;
        var oBrush = originalShape.brush;
        this.transform = originalShape.transform.CreateDublicate();
        this.overlayObject = new AscFormat.OverlayObject(this.geometry, this.shapeWidth, this.shapeHeight, oBrush, oPen, this.transform);
        this.invertTransform = originalShape.invertTransform;
    };

    EditShapeGeometryTrack.prototype.draw = function(overlay, transform)
    {
        if(AscFormat.isRealNumber(this.originalShape.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalShape.selectStartPage);
        }
        this.overlayObject.draw(overlay);
    };

    EditShapeGeometryTrack.prototype.track = function(posX, posY) {
        var invert_transform = this.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);

        this.geometry.pathLst[0].ArrPathCommand[this.geometry.gmEditPoint.pathCommand].X = _relative_x;
        this.geometry.pathLst[0].ArrPathCommand[this.geometry.gmEditPoint.pathCommand].Y = _relative_y;
    };

    EditShapeGeometryTrack.prototype.getBounds = function() {
        //временно, в качестве заглушки
        var bounds_checker = new  AscFormat.CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        var tr = this.originalShape.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalShape.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalShape.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalShape.extX,this.originalShape.extY));
        arr_p_y.push(tr.TransformPointY(this.originalShape.extX,this.originalShape.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalShape.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalShape.extY));

        arr_p_x.push(bounds_checker.Bounds.min_x);
        arr_p_x.push(bounds_checker.Bounds.max_x);
        arr_p_y.push(bounds_checker.Bounds.min_y);
        arr_p_y.push(bounds_checker.Bounds.max_y);

        bounds_checker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        bounds_checker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        bounds_checker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        bounds_checker.Bounds.max_y = Math.max.apply(Math, arr_p_y);

        bounds_checker.Bounds.posX = this.originalShape.x;
        bounds_checker.Bounds.posY = this.originalShape.y;
        bounds_checker.Bounds.extX = this.originalShape.extX;
        bounds_checker.Bounds.extY = this.originalShape.extY;

        return bounds_checker.Bounds;
    };

    EditShapeGeometryTrack.prototype.trackEnd = function() {

    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].EditShapeGeometryTrack = EditShapeGeometryTrack;
})(window);

