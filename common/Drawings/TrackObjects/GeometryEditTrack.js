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

    function EditShapeGeometryTrack(originalObject) {
        this.geometry = originalObject.calcGeometry;
        this.originalShape = originalObject;
        this.originalObject = originalObject;
        this.shapeWidth = originalObject.extX;
        this.shapeHeight = originalObject.extY;
        var oPen = originalObject.pen;
        var oBrush = originalObject.brush;
        this.transform = originalObject.transform;
        this.invertTransform = originalObject.invertTransform;
        this.overlayObject = new AscFormat.OverlayObject(this.geometry, this.resizedExtX, this.originalExtY, oBrush, oPen, this.transform);
    };

    EditShapeGeometryTrack.prototype.draw = function(overlay, transform)
    {
        if(AscFormat.isRealNumber(this.originalShape.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalShape.selectStartPage);
        }
        this.overlayObject.draw(overlay);
    };

    EditShapeGeometryTrack.prototype.track = function(kd1, kd2, e, posX, posY) {

        var geometry = this.originalObject.calcGeometry;
        var arrPathCommand = geometry.pathLst[0].ArrPathCommand;
        geometry.gdLstInfo = [];
        geometry.cnxLstInfo = [];
        geometry.pathLst[0].ArrPathCommandInfo = [];
        geometry.rectS = null;

        var invert_transform = this.invertTransform;
        var transform = this.transform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);
        var curPoint = geometry.gmEditPoint.curCoords;
        var nextPoint = geometry.gmEditPoint.nextCoords;
        var originalPoint = geometry.originalEditPoint;

            var pathCommand = arrPathCommand[geometry.gmEditPoint.curCoords.pathCommand];

            var id = pathCommand.id;
            if(geometry.gmEditPoint.isFirstCPoint) {

                arrPathCommand[curPoint.pathCommand].X1 = _relative_x;
                arrPathCommand[curPoint.pathCommand].Y1 = _relative_y;
                geometry.gmEditPoint.curCoords.X1 = _relative_x;
                geometry.gmEditPoint.curCoords.Y1 = _relative_y;
                console.log('isFirstCommandPoint');
            } else if(geometry.gmEditPoint.isSecondCPoint) {

                arrPathCommand[nextPoint.pathCommand].X0 = _relative_x;
                arrPathCommand[nextPoint.pathCommand].Y0 = _relative_y;
                geometry.gmEditPoint.nextCoords.X0 = _relative_x;
                geometry.gmEditPoint.nextCoords.Y0 = _relative_y;
                console.log('isSecondCommandPoint');
            } else
            switch (id) {
                // case 0:
                case 1:
                    pathCommand.X = _relative_x;
                    pathCommand.Y = _relative_y;
                    break;
                case 4:
                case 2:
                    // ignore clock direction
                    var fX2 = _relative_x;
                    var fY2 = _relative_y;

                    var fCX1 = originalPoint.curCoords.X0;
                    var fCY1 = originalPoint.curCoords.Y0;

                    var fCX2 = fX2 - originalPoint.curCoords.X2 + originalPoint.curCoords.X1;
                    var fCY2 = fY2 - originalPoint.curCoords.Y2 + originalPoint.curCoords.Y1;

                    var command = {
                        id: 4,
                        X0: fCX1,
                        Y0: fCY1,
                        X1: fCX2,
                        Y1: fCY2,
                        X2:_relative_x,
                        Y2: _relative_y
                    }
                    if(geometry.gmEditPoint.isStartPoint) {
                        arrPathCommand[0].X = _relative_x;
                        arrPathCommand[0].Y = _relative_y;
                    }

                    arrPathCommand[curPoint.pathCommand] = command;

                    var nextCommand = arrPathCommand[geometry.gmEditPoint.nextCoords.pathCommand];

                        var fX1 = _relative_x;
                        var fY1 = _relative_y;

                        var fCX1 = fX1 - originalPoint.curCoords.X2 + originalPoint.nextCoords.X0;
                        var fCY1 = fY1 - originalPoint.curCoords.Y2 + originalPoint.nextCoords.Y0;

                        var fCX2 = originalPoint.nextCoords.X1;
                        var fCY2 = originalPoint.nextCoords.Y1;

                        nextCommand.X0 = fCX1;
                        nextCommand.Y0 = fCY1;
                        nextCommand.X1 = fCX2;
                        nextCommand.Y1 = fCY2;
                        nextCommand.X2 = geometry.gmEditPoint.nextCoords.X2;
                        nextCommand.Y2 = geometry.gmEditPoint.nextCoords.Y2;

                    break;
                case 3:
                    pathCommand.X1 = _relative_x;
                    pathCommand.Y1 = _relative_y;
                    break;
            }


        /*<------------------------------------------------------------->*/
        var last_x = arrPathCommand[0].X,
            last_y = arrPathCommand[0].Y,
            xMin = last_x, yMin = last_y, xMax = last_x, yMax = last_y;
        for(var i = 0;  i < arrPathCommand.length; ++i) {

            var path_command = arrPathCommand[i];


            if (path_command.id === 4) {

                var bezier_polygon = AscFormat.partition_bezier4(last_x, last_y, path_command.X0, path_command.Y0, path_command.X1, path_command.Y1, path_command.X2, path_command.Y2, AscFormat.APPROXIMATE_EPSILON);
                for (var point_index = 1; point_index < bezier_polygon.length; ++point_index) {
                    var cur_point = bezier_polygon[point_index];
                    if (xMin > cur_point.x)
                        xMin = cur_point.x;
                    if (xMax < cur_point.x)
                        xMax = cur_point.x;
                    if (yMin > cur_point.y)
                        yMin = cur_point.y;
                    if (yMax < cur_point.y)
                        yMax = cur_point.y;

                    last_x = path_command.X2;
                    last_y = path_command.Y2;
                }
            }
        }



        var shape = this.originalShape;
        shape.spPr.xfrm.setExtX(xMax-xMin);
        shape.spPr.xfrm.setExtY(yMax - yMin);
        shape.setStyle(AscFormat.CreateDefaultShapeStyle());

        var w = xMax - xMin, h = yMax-yMin;
        var kw, kh, pathW, pathH;
        if(w > 0)
        {
            pathW = 43200;
            kw = 43200 / w;
        }
        else
        {
            pathW = 0;
            kw = 0;
        }
        if(h > 0)
        {
            pathH = 43200;
            kh = 43200 / h;
        }
        else
        {
            pathH = 0;
            kh = 0;
        }

        for(var i = 0;  i < arrPathCommand.length; ++i)
        {


            switch (arrPathCommand[i].id) {
                case 0: {
                    var pCommandX = transform.TransformPointX(arrPathCommand[i].X, arrPathCommand[i].Y);
                    var pCommandY = transform.TransformPointY(arrPathCommand[i].X, arrPathCommand[i].Y);
                    geometry.AddPathCommand(1, ((( arrPathCommand[i].X - xMin) * kw) >> 0) + "", (((arrPathCommand[i].Y - yMin) * kh) >> 0) + "");
                    break;
                }
                //оставить или удалить в зависимости от реализации
                // case 1: {
                //     geometry.AddPathCommand(2, (((pCommandX - xMin) * kw) >> 0) + "", (((pCommandY - yMin) * kh) >> 0) + "");
                //     break;
                // }
                // case 2: {
                //     var wR = transform.TransformPointX(arrPathCommand[i].wR, arrPathCommand[i].hR);
                //     var hR = transform.TransformPointY(arrPathCommand[i].wR, arrPathCommand[i].hR);
                //     geometry.AddPathCommand(3, (((wR - xMin) * kw) >> 0) + "", (((hR - yMin) * kh) >> 0) + "", arrPathCommand[i].stAng, arrPathCommand[i].swAng);
                // }
                case 4: {
                    geometry.AddPathCommand(5, (((arrPathCommand[i].X0 - xMin) * kw) >> 0) + "", (((arrPathCommand[i].Y0 - yMin) * kh) >> 0) + "", (((arrPathCommand[i].X1 - xMin)* kw) >> 0) + "", (((arrPathCommand[i].Y1 - yMin) * kh) >> 0) + "", (((arrPathCommand[i].X2 - xMin) * kw) >> 0) + "", (((arrPathCommand[i].Y2 - yMin) * kh) >> 0) + "");
                    break;
                }
                case 3: {
                  break;
                }
            }
        }

        geometry.pathLst[0].pathW = pathW, geometry.pathLst[0].pathH = pathH;
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

        AscFormat.CheckSpPrXfrm(this.originalShape);

    };

    EditShapeGeometryTrack.prototype.convertToBezier = function() {

        var geom = this.originalObject.calcGeometry;

        for(var i = 0; i < geom.gmEditList.length; i++) {
            var gmEditPoint = geom.gmEditList[i];
            var curCoords = gmEditPoint.curCoords;
            var prevCoords = gmEditPoint.prevCoords;
            switch (gmEditPoint.curCoords.id) {
                case 0:
                case 1:
                    //пока для массива с одним arrPathCommand
                    curCoords.X0 = (prevCoords.X + curCoords.X / 2) / (3 / 2);
                    curCoords.Y0 = (prevCoords.Y + curCoords.Y / 2) / (3 / 2);
                    curCoords.X1 = (prevCoords.X + curCoords.X * 2) / 3;
                    curCoords.Y1 = (prevCoords.Y + curCoords.Y * 2) / 3;
                    curCoords.X2 = curCoords.X;
                    curCoords.Y2 = curCoords.Y;
                    curCoords.fX2 = curCoords.X;
                    curCoords.fY2 = curCoords.Y;

                    break;
                case 2:
                    curCoords.X2 = curCoords.X;
                    curCoords.Y2 = curCoords.Y;
                    break;
                case 3:
                    var X0 = (curCoords.X0 + prevCoords.X) / 2;
                    var Y0 = (curCoords.Y0 + prevCoords.Y) / 2;
                    var X1 = (curCoords.X1 + curCoords.X0) / 2;
                    var Y1 = (curCoords.Y1 + curCoords.Y0) / 2;
                    var X2 = curCoords.X1;
                    var Y2 = curCoords.Y1;
                    curCoords.X0 = X0;
                    curCoords.Y0 = Y0;
                    curCoords.X1 = X1;
                    curCoords.Y1 = Y1;
                    curCoords.X2 = X2;
                    curCoords.Y2 = Y2;
                    break;
            }

            var command = {
                id: 4,
                X0: curCoords.X0,
                Y0: curCoords.Y0,
                X1: curCoords.X1,
                Y1: curCoords.Y1,
                X2: curCoords.X2,
                Y2: curCoords.Y2
            }

            //refactoring
            geom.originalEditPoint.curCoords = {
                id: 4,
                X0: geom.gmEditPoint.curCoords.X0,
                Y0: geom.gmEditPoint.curCoords.Y0,
                X1: geom.gmEditPoint.curCoords.X1,
                Y1: geom.gmEditPoint.curCoords.Y1,
                X2: geom.gmEditPoint.curCoords.X2,
                Y2: geom.gmEditPoint.curCoords.Y2
            }
            geom.originalEditPoint.nextCoords = {
                id: 4,
                X0: geom.gmEditPoint.nextCoords.X0,
                Y0: geom.gmEditPoint.nextCoords.Y0,
                X1: geom.gmEditPoint.nextCoords.X1,
                Y1: geom.gmEditPoint.nextCoords.Y1,
                X2: geom.gmEditPoint.nextCoords.X2,
                Y2: geom.gmEditPoint.nextCoords.Y2
            }
            geom.pathLst[0].ArrPathCommand[gmEditPoint.curCoords.pathCommand] = command;
            gmEditPoint.curCoords.id = 4;
        }
    }


    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].EditShapeGeometryTrack = EditShapeGeometryTrack;
})(window);

