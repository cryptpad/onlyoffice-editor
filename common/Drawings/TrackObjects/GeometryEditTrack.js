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

    EditShapeGeometryTrack.prototype.track = function(e, posX, posY) {

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
        var originalPoint = geometry.originalEditPoint;
        var nextPoint = geometry.gmEditPoint.nextPoint;
        var prevPoint = geometry.gmEditPoint.prevPoint;
        var curFirstCommand = arrPathCommand[originalPoint.pathC1];
        var curSecondCommand = arrPathCommand[originalPoint.pathC1]

            if(geometry.gmEditPoint.isFirstCPoint) {
                arrPathCommand[originalPoint.pathC1].X1 = _relative_x;
                arrPathCommand[originalPoint.pathC1].Y1 = _relative_y;
                geometry.gmEditPoint.g1X = _relative_x;
                geometry.gmEditPoint.g1Y = _relative_y;
                arrPathCommand[originalPoint.pathC1].isLine = false;

                if(curFirstCommand.isEllipseArc && curSecondCommand.isEllipseArc) {
                    var g2X = geometry.gmEditPoint.g1X - geometry.gmEditPoint.X;
                    var g2Y = geometry.gmEditPoint.g1Y - geometry.gmEditPoint.Y;

                    arrPathCommand[originalPoint.pathC2].X0 = geometry.gmEditPoint.X - g2X;
                    arrPathCommand[originalPoint.pathC2].Y0 = geometry.gmEditPoint.Y - g2Y;
                    geometry.gmEditPoint.g2X = geometry.gmEditPoint.X - g2X;
                    geometry.gmEditPoint.g2Y = geometry.gmEditPoint.Y - g2Y;
                }
            } else if(geometry.gmEditPoint.isSecondCPoint) {
                arrPathCommand[originalPoint.pathC2].X0 = _relative_x;
                arrPathCommand[originalPoint.pathC2].Y0 = _relative_y;
                geometry.gmEditPoint.g2X = _relative_x;
                geometry.gmEditPoint.g2Y = _relative_y;

                arrPathCommand[originalPoint.pathC2].isLine = false;

                if(curFirstCommand.isEllipseArc && curSecondCommand.isEllipseArc) {
                    var g1X = geometry.gmEditPoint.g2X - geometry.gmEditPoint.X;
                    var g1Y = geometry.gmEditPoint.g2Y - geometry.gmEditPoint.Y;

                    arrPathCommand[originalPoint.pathC1].X1 = geometry.gmEditPoint.X - g1X;
                    arrPathCommand[originalPoint.pathC1].Y1 = geometry.gmEditPoint.Y - g1Y;
                    geometry.gmEditPoint.g1X = geometry.gmEditPoint.X - g1X;
                    geometry.gmEditPoint.g1Y = geometry.gmEditPoint.Y - g1Y;
                }
            } else {

                //second curve relative to point
                var pathCommand = arrPathCommand[originalPoint.pathC1];
                var X0 = pathCommand.isLine ? (prevPoint.X + _relative_x / 2) / (3 / 2) : prevPoint.g2X;
                var Y0 = pathCommand.isLine ? (prevPoint.Y + _relative_y / 2) / (3 / 2) : prevPoint.g2Y;
                var X1 = pathCommand.isLine ? (prevPoint.X + _relative_x * 2) / 3 : _relative_x - originalPoint.X + originalPoint.g1X;
                var Y1 = pathCommand.isLine ? (prevPoint.Y + _relative_y * 2) / 3 : _relative_y - originalPoint.Y + originalPoint.g1Y;

                var command = {
                    id: 4, X0, Y0, X1, Y1,
                    X2: _relative_x,
                    Y2: _relative_y,
                    X: _relative_x,
                    Y: _relative_y,
                    isEllipseArc: pathCommand.isEllipseArc,
                    isLine: pathCommand.isLine
                }
                geometry.gmEditPoint.g1X = command.X1;
                geometry.gmEditPoint.g1Y = command.Y1;

                if(originalPoint.pathC1 > originalPoint.pathC2) {
                    arrPathCommand[0].X = _relative_x;
                    arrPathCommand[0].Y = _relative_y;
                }
                arrPathCommand[geometry.gmEditPoint.pathC1] = command;

                //second curve relative to point
                var pathCommand = arrPathCommand[geometry.gmEditPoint.pathC2]
                var X0 = pathCommand.isLine ? (nextPoint.X + _relative_x * 2) / 3 : _relative_x - originalPoint.X + originalPoint.g2X;
                var Y0 = pathCommand.isLine ? (nextPoint.Y + _relative_y * 2) / 3 : _relative_y - originalPoint.Y + originalPoint.g2Y;
                var X1 = pathCommand.isLine ? (nextPoint.X + _relative_x / 2) / (3 / 2) : nextPoint.g1X;
                var Y1 = pathCommand.isLine ? (nextPoint.Y + _relative_y / 2) / (3 / 2) : nextPoint.g1Y;

                var command = {
                    id: 4, X0, Y0, X1, Y1,
                    X2: nextPoint.X,
                    Y2: nextPoint.Y,
                    X: nextPoint.X,
                    Y: nextPoint.Y,
                    isEllipseArc: pathCommand.isEllipseArc,
                    isLine: pathCommand.isLine
                }

                geometry.gmEditPoint.g2X = command.X0;
                geometry.gmEditPoint.g2Y = command.Y0;

                geometry.gmEditPoint.X = _relative_x;
                geometry.gmEditPoint.Y = _relative_y;

                arrPathCommand[geometry.gmEditPoint.pathC2] = command;
            }

        /*<------------------------------------------------------------->*/
        var last_x = geometry.gmEditList[0].X,
            last_y = geometry.gmEditList[0].Y,
            xMin = last_x, yMin = last_y, xMax = last_x, yMax = last_y;
        for(var i = 0; i < arrPathCommand.length; ++i) {

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

    EditShapeGeometryTrack.prototype.convertToBezier = function(geom) {

        var pathPoints = geom.pathLst[0].ArrPathCommand;

        for(var i = 0; i < pathPoints.length; i++) {
            if(pathPoints[i].id === 2 && geom.ellipsePointsList.length === 0)
                return;
        };

        geom.gmEditList = [];
        var countArc = 0;
        var X = pathPoints[0].X;
        var Y = pathPoints[0].Y;

     pathPoints.splice(pathPoints.length - 1);
     pathPoints.splice(0, 1);

     for(var i = 0; i < pathPoints.length; i++) {
            var elem = pathPoints[i];
            var elemX, elemY;
            switch (elem.id) {
                case 0:
                case 1:
                    elemX = elem.X;
                    elemY = elem.Y;
                    break;
                case 2:
                    if (geom.ellipsePointsList[countArc]) {
                        pathPoints.splice(i, 1);
                        geom.ellipsePointsList[countArc].forEach(function (elem) {
                            var elemArc = {
                                id: 4,
                                X: elem.X2,
                                Y: elem.Y2,
                                X0: elem.X0,
                                Y0: elem.Y0,
                                X1: elem.X1,
                                Y1: elem.Y1,
                                X2: elem.X2,
                                Y2: elem.Y2,
                                isEllipseArc: true
                            }

                            pathPoints.splice(i, 0, elemArc);
                            i++;
                        })
                        i = i - 1;
                        countArc++;
                    }
                    break;
                case 3:
                    elemX = elem.X1;
                    elemY = elem.Y1;
                    break;
                case 4:
                    elemX = elem.X2;
                    elemY = elem.Y2;
                    break;
            }

            if (elemX !== undefined && elemY !== undefined && elem.id !== 2) {
                pathPoints[i] = elem;
                pathPoints[i].X = elemX;
                pathPoints[i].Y = elemY;
                elemX = null;
                elemY = null;
            }
        };

        //if the end point is not equal to the start point, then draw a line between them
        var firstPointX = parseFloat(X.toFixed(4));
        var firstPointY = parseFloat(Y.toFixed(4));
        var lastPointX = parseFloat(pathPoints[pathPoints.length - 1].X.toFixed(4));
        var lastPointY = parseFloat(pathPoints[pathPoints.length - 1].Y.toFixed(4));
        if(firstPointX !== lastPointX || firstPointY !== lastPointY) {
            var prevCommand = pathPoints[pathPoints.length - 1];
            pathPoints.push(
                {
                    id: 4,
                    X0: (prevCommand.X + X / 2) / (3 / 2),
                    Y0: (prevCommand.Y + Y / 2) / (3 / 2),
                    X1: (prevCommand.X + X * 2) / 3,
                    Y1: (prevCommand.Y + Y * 2) / 3,
                    X2: X,
                    Y2: Y,
                    X,
                    Y,
                    isLine: true
                });
        }

       pathPoints.forEach(function(elem, index) {
          var prevCommand = index - 1 >= 0 ? pathPoints[index - 1] : pathPoints[pathPoints.length - 1];

           switch (elem.id) {
               case 1:
                   pathPoints[index] = {
                       id: 4,
                       X0: (prevCommand.X + elem.X / 2) / (3 / 2),
                       Y0: (prevCommand.Y + elem.Y / 2) / (3 / 2),
                       X1: (prevCommand.X + elem.X * 2) / 3,
                       Y1: (prevCommand.Y + elem.Y * 2) / 3,
                       X2: elem.X,
                       Y2: elem.Y,
                       X: elem.X,
                       Y: elem.Y,
                       isLine: true
                   }
                   break;
               case 3:
                   pathPoints[index] = {
                       id: 4,
                       X0: (elem.X0 + prevCommand.X) / 2,
                       Y0: (elem.Y0 + prevCommand.Y) / 2,
                       X1: (elem.X1 + elem.X0) / 2,
                       Y1: (elem.Y1 + elem.Y0) / 2,
                       X2: elem.X1,
                       Y2: elem.Y1,
                       X: elem.X,
                       Y: elem.Y,
                   }
                   break;

           }
       });

        for (var index = 0; index < pathPoints.length; index++) {
            var curCommand = pathPoints[index];
            var nextIndex = index + 1 <= pathPoints.length - 1 ? index + 1 : 0;
            var nextCommand = pathPoints[nextIndex];

            var curPoint = {
                id: curCommand.id,
                g1X : curCommand.X1,
                g1Y : curCommand.Y1,
                g2X:  nextCommand.X0,
                g2Y:  nextCommand.Y0,
                X: curCommand.X,
                Y: curCommand.Y,
                pathC1: index + 1,
                pathC2: nextIndex + 1,
            };
            geom.gmEditList.push(curPoint);
        }

        for (var index = 0; index < geom.gmEditList.length; index++) {
            geom.gmEditList[index].nextPoint = (index + 1 <= geom.gmEditList.length - 1) ? geom.gmEditList[index + 1] : geom.gmEditList[0];
            geom.gmEditList[index].prevPoint = (index - 1 >= 0) ? geom.gmEditList[index - 1] : geom.gmEditList[geom.gmEditList.length - 1];
        }

        pathPoints.unshift({id: 0, X, Y});
        pathPoints.push({id: 5});
    }


    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].EditShapeGeometryTrack = EditShapeGeometryTrack;
})(window);

