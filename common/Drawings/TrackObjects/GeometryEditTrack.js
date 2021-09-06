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

    var PathType = {
        POINT: 0,
        LINE: 1,
        ARC: 2,
        BEZIER_3: 3,
        BEZIER_4: 4,
        END: 5
    };

    function EditShapeGeometryTrack(originalObject, document, drawingObjects, extX, extY) {
        AscFormat.ExecuteNoHistory(function() {
            this.drawingObjects = drawingObjects;
            this.geometry = originalObject.spPr.geometry.createDuplicate();
            this.geometry.parent = originalObject.spPr.geometry.parent;
            this.originalShape = originalObject;
            this.originalObject = originalObject;
            this.shapeWidth = extX ? extX : originalObject.extX;
            this.shapeHeight = extY ? extY : originalObject.extY;
            var oPen = originalObject.pen;
            var oBrush = originalObject.brush;
            this.transform = originalObject.transform;
            this.overlayObject = new AscFormat.OverlayObject(this.geometry, this.shapeWidth, this.shapeHeight, oBrush, oPen, this.transform);
            this.xMin = 0;
            this.yMin = 0;
            this.xMax = this.shapeWidth;
            this.yMax = this.shapeHeight;
            this.addingPoint = {pathIndex: null, commandIndex: null};
            this.document = document;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
        }, this, []);
    };

    EditShapeGeometryTrack.prototype.draw = function(overlay)
    {
        if(AscFormat.isRealNumber(this.originalShape.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalShape.selectStartPage);
        }
        //Check correct
        this.overlayObject.TransformMatrix = this.originalShape.transform;
        this.overlayObject.draw(overlay);
    };

    EditShapeGeometryTrack.prototype.track = function(e, posX, posY) {
        var geometry = this.geometry;

        if(!geometry.gmEditPoint) {
            return;
        }
        geometry.gdLstInfo = [];
        geometry.cnxLstInfo = [];

        for(var i = 0; i < geometry.pathLst.length; i++) {
            geometry.pathLst[i].ArrPathCommandInfo = [];
        }

        var invert_transform = this.originalShape.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);
        var originalPoint = geometry.originalEditPoint;
        var gmEditPoint = geometry.gmEditPoint;
        var nextPoint = gmEditPoint.nextPoint;
        var prevPoint = gmEditPoint.prevPoint;
        var currentPath = geometry.pathLst[gmEditPoint.pathIndex];
        var arrPathCommand = currentPath.ArrPathCommand;

        var cur_command_type_array = geometry.arrPathCommandsType[gmEditPoint.pathIndex];
        var cur_command_type_1 = cur_command_type_array[gmEditPoint.pathC1];
        var cur_command_type_2 = cur_command_type_array[gmEditPoint.pathC2];

            if(gmEditPoint.isHitInFirstCPoint) {
                arrPathCommand[gmEditPoint.pathC1].X1 = _relative_x;
                arrPathCommand[gmEditPoint.pathC1].Y1 = _relative_y;

                if(cur_command_type_1 === PathType.LINE) {
                    cur_command_type_array[gmEditPoint.pathC1] = PathType.BEZIER_4;
                }

                var g1X = gmEditPoint.g1X;
                var g1Y = gmEditPoint.g1Y;

                gmEditPoint.g1X = _relative_x;
                gmEditPoint.g1Y = _relative_y;

                if(cur_command_type_1 === PathType.ARC && cur_command_type_2 === PathType.ARC) {

                    var isEllipseArc = Math.abs((gmEditPoint.X - g1X) * (gmEditPoint.g2Y - g1Y) - (gmEditPoint.g2X - g1X) * (gmEditPoint.Y - g1Y));

                    if(Math.floor(isEllipseArc) === 0) {
                        var g2X = gmEditPoint.g1X - gmEditPoint.X;
                        var g2Y = gmEditPoint.g1Y - gmEditPoint.Y;

                        arrPathCommand[gmEditPoint.pathC2].X0 = gmEditPoint.X - g2X;
                        arrPathCommand[gmEditPoint.pathC2].Y0 = gmEditPoint.Y - g2Y;
                        gmEditPoint.g2X = gmEditPoint.X - g2X;
                        gmEditPoint.g2Y = gmEditPoint.Y - g2Y;
                    } else {
                        var pathElemType =  geometry.arrPathCommandsType[gmEditPoint.pathIndex];
                        pathElemType[gmEditPoint.pathC1] = PathType.BEZIER_4;
                        pathElemType[gmEditPoint.pathC2] = PathType.BEZIER_4;
                    }
                }
            } else if(gmEditPoint.isHitInSecondCPoint) {
                arrPathCommand[gmEditPoint.pathC2].X0 = _relative_x;
                arrPathCommand[gmEditPoint.pathC2].Y0 = _relative_y;

                if(cur_command_type_2 === PathType.LINE) {
                    cur_command_type_array[gmEditPoint.pathC2] = PathType.BEZIER_4;
                }

                var g2X = gmEditPoint.g2X;
                var g2Y = gmEditPoint.g2Y;

                gmEditPoint.g2X = _relative_x;
                gmEditPoint.g2Y = _relative_y;

                if(cur_command_type_1 === PathType.ARC && cur_command_type_2 === PathType.ARC) {


                    var isEllipseArc = Math.abs((gmEditPoint.X - gmEditPoint.g1X) * (g2Y - gmEditPoint.g1Y) - (g2X - gmEditPoint.g1X) * (gmEditPoint.Y - gmEditPoint.g1Y));

                    if(Math.floor(isEllipseArc) === 0) {
                        var g1X = gmEditPoint.g2X - gmEditPoint.X;
                        var g1Y = gmEditPoint.g2Y - gmEditPoint.Y;

                        arrPathCommand[gmEditPoint.pathC1].X1 = gmEditPoint.X - g1X;
                        arrPathCommand[gmEditPoint.pathC1].Y1 = gmEditPoint.Y - g1Y;
                        gmEditPoint.g1X = gmEditPoint.X - g1X;
                        gmEditPoint.g1Y = gmEditPoint.Y - g1Y;
                    } else {
                       var pathElemType =  geometry.arrPathCommandsType[gmEditPoint.pathIndex];
                       pathElemType[gmEditPoint.pathC1] = PathType.BEZIER_4;
                       pathElemType[gmEditPoint.pathC2] = PathType.BEZIER_4;
                    }
                }
            } else {
                var X0, X1, Y0, Y1;
                //second curve relative to point
                var pathCommand = arrPathCommand[gmEditPoint.pathC1];
                var isPathCommand = (gmEditPoint.g1X !== undefined && gmEditPoint.g1Y !== undefined);

                X0 = cur_command_type_1 === PathType.LINE ? (prevPoint.X + _relative_x / 2) / (3 / 2) : prevPoint.g2X;
                Y0 = cur_command_type_1 === PathType.LINE ? (prevPoint.Y + _relative_y / 2) / (3 / 2) : prevPoint.g2Y;

                if (isPathCommand) {
                    X1 = cur_command_type_1 === PathType.LINE ? (prevPoint.X + _relative_x * 2) / 3 : _relative_x - originalPoint.X + originalPoint.g1X;
                    Y1 = cur_command_type_1 === PathType.LINE ? (prevPoint.Y + _relative_y * 2) / 3 : _relative_y - originalPoint.Y + originalPoint.g1Y;
                }

                var id = pathCommand.id === PathType.POINT ? PathType.POINT : PathType.BEZIER_4;
                var command = {
                    id: id,
                    X0: X0,
                    Y0: Y0,
                    X1: X1,
                    Y1: Y1,
                    X2: _relative_x,
                    Y2: _relative_y,
                    X: _relative_x,
                    Y: _relative_y
                }

                if(gmEditPoint.g1X !== undefined && gmEditPoint.g1Y !== undefined) {
                    gmEditPoint.g1X = command.X1;
                    gmEditPoint.g1Y = command.Y1;
                }

                gmEditPoint.X = _relative_x;
                gmEditPoint.Y = _relative_y;

                if(gmEditPoint.pathC1 && gmEditPoint.pathC2 && (gmEditPoint.pathC1 > gmEditPoint.pathC2)) {
                    arrPathCommand[gmEditPoint.pathC2 - 1].X = _relative_x;
                    arrPathCommand[gmEditPoint.pathC2 - 1].Y = _relative_y;
                }
                arrPathCommand[gmEditPoint.pathC1] = command;

                //second curve relative to point
                if(gmEditPoint.pathC2) {
                    var X0, X1, Y0, Y1;
                    var pathCommand = arrPathCommand[gmEditPoint.pathC2];
                    var isPathCommand = (gmEditPoint.g2X !== undefined && gmEditPoint.g2Y !== undefined);

                    if (isPathCommand) {
                        X0 = cur_command_type_2 === PathType.LINE ? (nextPoint.X + _relative_x * 2) / 3 : _relative_x - originalPoint.X + originalPoint.g2X;
                        Y0 = cur_command_type_2 === PathType.LINE ? (nextPoint.Y + _relative_y * 2) / 3 : _relative_y - originalPoint.Y + originalPoint.g2Y;
                    }

                    X1 = cur_command_type_2 === PathType.LINE ? (nextPoint.X + _relative_x / 2) / (3 / 2) : nextPoint.g1X;
                    Y1 = cur_command_type_2 === PathType.LINE ? (nextPoint.Y + _relative_y / 2) / (3 / 2) : nextPoint.g1Y;

                    var id = pathCommand.id === PathType.POINT ? PathType.POINT : PathType.BEZIER_4;
                    var command = {
                        id: id,
                        X0: X0,
                        Y0: Y0,
                        X1: X1,
                        Y1: Y1,
                        X2: nextPoint.X,
                        Y2: nextPoint.Y,
                        X: nextPoint.X,
                        Y: nextPoint.Y
                    }

                    if (isPathCommand) {
                        gmEditPoint.g2X = command.X0;
                        gmEditPoint.g2Y = command.Y0;
                    }

                    gmEditPoint.X = _relative_x;
                    gmEditPoint.Y = _relative_y;

                    arrPathCommand[gmEditPoint.pathC2] = command;
                }
            }
    };

    EditShapeGeometryTrack.prototype.getBounds = function() {
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
        
        arr_p_x.push(this.xMin);
        arr_p_x.push(this.xMax);
        arr_p_y.push(this.yMin);
        arr_p_y.push(this.yMax);


        bounds_checker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        bounds_checker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        bounds_checker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        bounds_checker.Bounds.max_y = Math.max.apply(Math, arr_p_y);

        bounds_checker.Bounds.posX = this.originalShape.x + this.xMin;
        bounds_checker.Bounds.posY = this.originalShape.y + this.yMin;
        bounds_checker.Bounds.extX = this.originalShape.extX;
        bounds_checker.Bounds.extY = this.originalShape.extY;

        return bounds_checker.Bounds;
    };

    EditShapeGeometryTrack.prototype.addPathCommandInfo = function (command, arrPathElem, x1, y1, x2, y2, x3, y3) {
        switch (command) {
            case 0: {
                var path = new AscFormat.Path();
                path.setExtrusionOk(x1 || false);
                path.setFill(y1 || "norm");
                path.setStroke(x2 != undefined ? x2 : true);
                path.setPathW(y2);
                path.setPathH(x3);
                this.AddPath(path);
                break;
            }
            case 1: {
                this.geometry.pathLst[arrPathElem].moveTo(x1, y1);
                break;
            }
            case 2: {
                this.geometry.pathLst[arrPathElem].lnTo(x1, y1);
                break;
            }
            case 3: {
                this.geometry.pathLst[arrPathElem].arcTo(x1/*wR*/, y1/*hR*/, x2/*stAng*/, y2/*swAng*/);
                break;
            }
            case 4: {
                this.geometry.pathLst[arrPathElem].quadBezTo(x1, y1, x2, y2);
                break;
            }
            case 5: {
                this.geometry.pathLst[arrPathElem].cubicBezTo(x1, y1, x2, y2, x3, y3);
                break;
            }
            case 6: {
                this.geometry.pathLst[arrPathElem].close();
                break;
            }
        }
    };

    EditShapeGeometryTrack.prototype.trackEnd = function() {
        this.originalObject.spPr.xfrm.setExtX(this.xMax - this.xMin);
        this.originalObject.spPr.xfrm.setExtY(this.yMax - this.yMin);
        this.originalObject.spPr.setGeometry(this.geometry.createDuplicate());
    };

    EditShapeGeometryTrack.prototype.convertToBezier = function(geometry) {

        var originalGeometry = this.originalObject.calcGeometry, countArc = 0;

        for(var j = 0; j < geometry.pathLst.length; j++) {
            geometry.pathLst[j].ArrPathCommandInfo = [];
            var pathPoints = geometry.pathLst[j].ArrPathCommand;
            var arrCommandsType = [];
            for (var i = 0; i < pathPoints.length; i++) {
                var elem = pathPoints[i];
                var elemX = null, elemY = null;
                switch (elem.id) {
                    case PathType.POINT:
                        elemX = elem.X;
                        elemY = elem.Y;
                        arrCommandsType.push(PathType.POINT);
                        break;
                    case PathType.LINE:
                        elemX = elem.X;
                        elemY = elem.Y;
                        arrCommandsType.push(PathType.LINE);
                        break;
                    case PathType.ARC:
                        if (originalGeometry.ellipsePointsList[countArc]) {
                            pathPoints.splice(i, 1);
                            originalGeometry.ellipsePointsList[countArc].forEach(function (elem) {
                                if(elem.X && elem.Y && pathPoints[i - 1] && pathPoints[i - 1].id === PathType.POINT) {
                                   pathPoints[i - 1].X = elem.X;
                                   pathPoints[i - 1].Y = elem.Y;
                                } else {
                                    var elemArc = {
                                        id: PathType.ARC,
                                        X0: elem.X0,
                                        Y0: elem.Y0,
                                        X1: elem.X1,
                                        Y1: elem.Y1,
                                        X2: elem.X2,
                                        Y2: elem.Y2
                                    }
                                    arrCommandsType.push(PathType.ARC);
                                    pathPoints.splice(i, 0, elemArc);
                                    i++;
                                }
                            })
                            i = i - 1;
                            countArc++;
                        }
                        break;
                    case PathType.BEZIER_3:
                        elemX = elem.X1;
                        elemY = elem.Y1;
                        arrCommandsType.push(PathType.BEZIER_3);
                        break;
                    case PathType.BEZIER_4:
                        elemX = elem.X2;
                        elemY = elem.Y2;
                        arrCommandsType.push(PathType.BEZIER_4);
                        break;
                    case PathType.END:
                        arrCommandsType.push(PathType.END);
                        break;
                }

                if (elemX !== undefined && elemY !== undefined && elem.id !== PathType.ARC && elem.id !== PathType.END) {
                    pathPoints[i] = elem;
                }
            };
            var start_index = 0;
            // insert pathCommand when end point is not equal to the start point, then draw a line between them
            for (var cur_index = 1; cur_index < pathPoints.length; cur_index++) {

                if(pathPoints[cur_index].id === PathType.POINT) {
                    start_index = cur_index;
                }

                if (pathPoints[cur_index].id === PathType.END && (!pathPoints[cur_index + 1] || pathPoints[cur_index + 1].id === PathType.POINT)) {
                    var prevCommand = pathPoints[cur_index - 1];
                    var pointCommand = pathPoints[start_index];
                    var prevCommandX = prevCommand.X !== undefined ? prevCommand.X : prevCommand.X2;
                    var prevCommandY = prevCommand.Y !== undefined ? prevCommand.Y : prevCommand.Y2;

                    var firstPointX = parseFloat(pathPoints[start_index].X.toFixed(2));
                    var firstPointY = parseFloat(pathPoints[start_index].Y.toFixed(2));
                    var lastPointX = parseFloat(prevCommandX.toFixed(2));
                    var lastPointY = parseFloat(prevCommandY.toFixed(2));
                    if (firstPointX !== lastPointX || firstPointY !== lastPointY) {

                        pathPoints.splice(cur_index, 0,
                            {
                                id: PathType.LINE,
                                X: pointCommand.X,
                                Y: pointCommand.Y
                            });
                      arrCommandsType.splice(cur_index, 0, PathType.LINE);
                        ++cur_index;
                    }
                }
            }

            pathPoints.forEach(function (elem, cur_index) {

                var prevCommand = pathPoints[cur_index - 1];
                if(prevCommand) {
                    var prevCommandX = prevCommand.X !== undefined ? prevCommand.X : prevCommand.X2;
                    var prevCommandY = prevCommand.Y !== undefined ? prevCommand.Y : prevCommand.Y2;
                }

                switch (elem.id) {
                    case 1:
                        pathPoints[cur_index] = {
                            id: PathType.LINE,
                            X0: (prevCommandX + elem.X / 2) / (3 / 2),
                            Y0: (prevCommandY + elem.Y / 2) / (3 / 2),
                            X1: (prevCommandX + elem.X * 2) / 3,
                            Y1: (prevCommandY + elem.Y * 2) / 3,
                            X2: elem.X,
                            Y2: elem.Y
                        }
                        break;
                    case 3:
                        pathPoints[cur_index] = {
                            id: PathType.BEZIER_3,
                            X0: (elem.X0 + prevCommandX) / 2,
                            Y0: (elem.Y0 + prevCommandY) / 2,
                            X1: (elem.X1 + elem.X0) / 2,
                            Y1: (elem.Y1 + elem.Y0) / 2,
                            X2: elem.X1,
                            Y2: elem.Y1
                        }
                        break;
                }
            });
            if(geometry.arrPathCommandsType.length < geometry.pathLst.length) {
                geometry.arrPathCommandsType.push(arrCommandsType);
            }
        }

        geometry.isGeomConverted = true;
        geometry.setPreset(null);
        geometry.rectS = null;
    };

    EditShapeGeometryTrack.prototype.createGeometryEditList = function(geometry) {
        geometry.gmEditList = [];

        for(var j = 0; j < geometry.pathLst.length; j++) {

            var start_index = 0, isFirstAndLastPointsEqual = false;
            var pathPoints = geometry.pathLst[j].ArrPathCommand;

            for (var index = 0; index < pathPoints.length; index++) {
                var curCommand = pathPoints[index];
                var nextPath = pathPoints[index + 1];

                if (curCommand.id !== PathType.END) {
                    var nextIndex = 0;
                    var isAddingStartPoint = false;

                    if (!nextPath || nextPath.id === PathType.POINT || nextPath.id === PathType.END) {

                        nextIndex = isFirstAndLastPointsEqual ? (index === start_index ? null : start_index + 1) : null;

                        if (nextPath) {
                            start_index = nextPath.id === PathType.POINT ? index + 1 : index + 2;
                            isFirstAndLastPointsEqual = false;
                        }
                    } else {
                        nextIndex = index + 1;
                    }

                    if (curCommand.id === PathType.POINT) {
                        //finding last point in figure element
                        var i = 1;
                        while((index + i <= pathPoints.length - 1) && pathPoints[index + i].id !== PathType.POINT) {
                            ++i;
                        }
                        if(pathPoints[index + i - 1].id === PathType.END) {
                            --i;
                        }
                        var firstPoint = pathPoints[start_index];
                        var firstPointX = firstPoint.X !== undefined ? firstPoint.X : firstPoint.X2;
                        firstPointX = parseFloat(firstPointX.toFixed(2));
                        var firstPointY = firstPoint.Y !== undefined ? firstPoint.Y : firstPoint.Y2;
                        firstPointY = parseFloat(firstPointY.toFixed(2));

                        var lastPoint = pathPoints[index + i - 1];
                        var lastPointX = lastPoint.X !== undefined ? lastPoint.X : lastPoint.X2;
                        lastPointX = parseFloat(lastPointX.toFixed(2));
                        var lastPointY = lastPoint.Y !== undefined ? lastPoint.Y : lastPoint.Y2;
                        lastPointY = parseFloat(lastPointY.toFixed(2));

                        (firstPointX !== lastPointX || firstPointY !== lastPointY) ? isAddingStartPoint = true : isFirstAndLastPointsEqual = true;
                    }

                    if(pathPoints[index].id !== PathType.POINT || isAddingStartPoint) {
                        var nextCommand = pathPoints[nextIndex];

                        var g1X = curCommand.X1;
                        var g1Y = curCommand.Y1;
                        var g2X = nextCommand ? nextCommand.X0 : undefined;
                        var g2Y = nextCommand ? nextCommand.Y0 : undefined;


                        var curPoint = {
                            g1X: g1X,
                            g1Y: g1Y,
                            g2X: g2X,
                            g2Y: g2Y,
                            X: (curCommand.X !== undefined ? curCommand.X : curCommand.X2),
                            Y: (curCommand.Y !== undefined ? curCommand.Y : curCommand.Y2),
                            pathC1: index,
                            pathC2: nextIndex,
                            pathIndex: j
                        };
                        geometry.gmEditList.push(curPoint);
                    }
                }
                curCommand.id = (curCommand.id !== PathType.POINT && curCommand.id !== PathType.END) ? PathType.BEZIER_4 : curCommand.id;
            }
        }

        var startIndex = 0;
        for (var cur_index = 0; cur_index < geometry.gmEditList.length; cur_index++) {
            if(geometry.gmEditList[cur_index].pathC2 > geometry.gmEditList[cur_index].pathC1) {
                geometry.gmEditList[cur_index].nextPoint = geometry.gmEditList[cur_index + 1];
                geometry.gmEditList[cur_index + 1].prevPoint = geometry.gmEditList[cur_index];
            } else {
                geometry.gmEditList[cur_index].nextPoint =  geometry.gmEditList[startIndex];
                geometry.gmEditList[startIndex].prevPoint = geometry.gmEditList[cur_index];
                startIndex = cur_index + 1;
            }
        }

        //update gmEditPoint coords
        if(geometry.gmEditPoint) {
            var pointC1 = geometry.gmEditPoint.pathC1;
            var pointC2 = geometry.gmEditPoint.pathC2;
            var isHitInFirstCPoint = geometry.gmEditPoint.isHitInFirstCPoint;
            var isHitInSecondCPoint = geometry.gmEditPoint.isHitInSecondCPoint;
            geometry.gmEditList.forEach(function(elem) {
                if(elem.pathIndex === geometry.gmEditPoint.pathIndex && elem.pathC1 === pointC1 && elem.pathC2 === pointC2) {
                    geometry.gmEditPoint = elem;
                    geometry.gmEditPoint.isHitInFirstCPoint = isHitInFirstCPoint;
                    geometry.gmEditPoint.isHitInSecondCPoint = isHitInSecondCPoint;
                }
            })
        }
    };

    EditShapeGeometryTrack.prototype.addCommandsInPathInfo = function(geometry) {
        var last_x = geometry.gmEditList[0].X,
            last_y = geometry.gmEditList[0].Y,
            xMin = last_x, yMin = last_y, xMax = last_x, yMax = last_y;
        for (var i = 0; i < geometry.pathLst.length; i++) {
            var arrPathCommand = geometry.pathLst[i].ArrPathCommand;
            geometry.pathLst[i].ArrPathCommandInfo = [];
            for (var j = 0; j < arrPathCommand.length; ++j) {

                var path_command = arrPathCommand[j];

                if (path_command.id === PathType.BEZIER_4) {

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
        }


        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;

        var w = xMax - xMin, h = yMax - yMin;
        var kw, kh, pathW, pathH;
        if (w > 0) {
            pathW = 43200;
            kw = 43200 / w;
        }
        else {
            pathW = 0;
            kw = 0;
        }
        if (h > 0) {
            pathH = 43200;
            kh = 43200 / h;
        }
        else {
            pathH = 0;
            kh = 0;
        }

        for (var i = 0; i < geometry.pathLst.length; i++) {
            var arrPathCommand = geometry.pathLst[i].ArrPathCommand;
            for (var j = 0; j < arrPathCommand.length; ++j) {

                switch (arrPathCommand[j].id) {
                    case PathType.POINT: {
                        this.addPathCommandInfo(1, i, (((arrPathCommand[j].X - xMin) * kw) >> 0) + "", (((arrPathCommand[j].Y - yMin) * kh) >> 0) + "");
                        break;
                    }
                    case PathType.BEZIER_4: {
                        this.addPathCommandInfo(5, i, (((arrPathCommand[j].X0 - xMin) * kw) >> 0) + "", (((arrPathCommand[j].Y0 - yMin) * kh) >> 0) + "", (((arrPathCommand[j].X1 - xMin) * kw) >> 0) + "", (((arrPathCommand[j].Y1 - yMin) * kh) >> 0) + "", (((arrPathCommand[j].X2 - xMin) * kw) >> 0) + "", (((arrPathCommand[j].Y2 - yMin) * kh) >> 0) + "");
                        break;
                    }
                    case PathType.END: {
                        this.addPathCommandInfo(6, i);
                    }
                }
            }
            geometry.pathLst[i].pathW = pathW, geometry.pathLst[i].pathH = pathH;
        }
    };

    EditShapeGeometryTrack.prototype.addPoint = function(invert_transform, geometry, X, Y) {
        var commandIndex = this.addingPoint.commandIndex;
        var pathIndex = this.addingPoint.pathIndex;

        var pathElem = geometry.pathLst[pathIndex].ArrPathCommand;
        var curCommand = pathElem[commandIndex];

        var gmEditListElem = geometry.gmEditList.filter(function(elem) {
            return elem.pathC1 === commandIndex;
        })[0];
        var prevCommand_1 = gmEditListElem.prevPoint;
        var prevCommand_2 = prevCommand_1.prevPoint;

        var curCommandX = curCommand.X !== undefined ? curCommand.X : curCommand.X2;
        var curCommandY = curCommand.Y !== undefined ? curCommand.Y : curCommand.Y2;

        var X0 = prevCommand_1.X + (X - prevCommand_2.X) / 4;
        var Y0 = prevCommand_1.Y + (Y - prevCommand_2.Y) / 4;
        var X1 = X - (curCommandX - prevCommand_1.X) / 4;
        var Y1 = Y - (curCommandY - prevCommand_1.Y) / 4;
        var newPathElem = {id: PathType.BEZIER_4, X0: X0, Y0: Y0, X1: X1, Y1: Y1, X2: X, Y2: Y, X: X, Y: Y};
        curCommand.X0 = X + (curCommandX - prevCommand_1.X) / 4;
        curCommand.Y0 = Y + (curCommandY - prevCommand_1.Y) / 4;

        pathElem.splice(commandIndex, 0, newPathElem);
        geometry.arrPathCommandsType[pathIndex].splice(commandIndex, 0, PathType.BEZIER_4);


        geometry.pathLst[pathIndex].ArrPathCommandInfo = [];

    };

    EditShapeGeometryTrack.prototype.deletePoint = function(geometry) {
        var gmEditPoint = geometry.gmEditPoint,
            pathIndex = gmEditPoint.pathIndex,
            pathElem = geometry.pathLst[pathIndex],
            arrayCommands = geometry.pathLst[pathIndex].ArrPathCommand;

        if(pathElem && pathElem.stroke === true && pathElem.fill === "none") {
            return;
        }

        var gmEditPoint = geometry.gmEditPoint,
            pathC1 = gmEditPoint.pathC1,
            pathC2 = gmEditPoint.pathC2,
            pointCount = 0;

        var increment_index = pathC1;
        var decrement_index = pathC1;

        while(arrayCommands[decrement_index] && arrayCommands[decrement_index].id !== PathType.POINT) {
            --decrement_index;
            ++pointCount;
        }
        while(arrayCommands[increment_index + 1] && arrayCommands[increment_index + 1].id !== PathType.END) {
            ++increment_index;
            ++pointCount;
        }

        if(pointCount > 2) {

            if (pathC1 > pathC2) {
                arrayCommands[decrement_index] = {id: PathType.POINT, X: arrayCommands[pathC1 - 1].X2, Y: arrayCommands[pathC1 - 1].Y2};
            }
            var curArrCommandsType = geometry.arrPathCommandsType[pathIndex];

            //if next command is line, then recalculate to make it
            var nextPath = gmEditPoint.nextPoint.pathC1;
            if (curArrCommandsType[nextPath] && (curArrCommandsType[nextPath] === PathType.LINE)) {
                var prevX = gmEditPoint.prevPoint.X, prevY = gmEditPoint.prevPoint.Y,
                    nextX = gmEditPoint.nextPoint.X, nextY = gmEditPoint.nextPoint.Y;
                arrayCommands[nextPath].X0 = (nextX + prevX * 2) / 3;
                arrayCommands[nextPath].Y0 = (nextY + prevY * 2) / 3;
                arrayCommands[nextPath].X1 = (nextX + prevX / 2) / (3 / 2);
                arrayCommands[nextPath].Y1 = (nextY + prevY / 2) / (3 / 2);
            }
            arrayCommands.splice(pathC1, 1);
            curArrCommandsType.splice(pathC1, 1);


            this.createGeometryEditList(geometry);
            geometry.gmEditPoint = null;
            geometry.isGeomConverted = false;
            this.addCommandsInPathInfo(geometry, pathIndex);
        }
    };

    EditShapeGeometryTrack.prototype.isCanContinue = function() {
      var originalGeometry = this.originalObject.calcGeometry,
          geometry  = this.geometry;

        for (var j = 0; j < this.geometry.pathLst.length; j++) {
            var pathPoints = geometry.pathLst[j].ArrPathCommand;
            for (var i = 0; i < pathPoints.length; i++) {
                if (pathPoints[i].id === PathType.ARC && originalGeometry.ellipsePointsList.length === 0)
                    return false;
            }
        }
        return true;
    };

    EditShapeGeometryTrack.prototype.clearPoints = function() {
        var originalGeometry = this.originalObject.calcGeometry;
        if(originalGeometry) {
            originalGeometry.gmEditList = [];
            originalGeometry.gmEditPoint = null;
            originalGeometry.ellipsePointsList = [];
        }
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].EditShapeGeometryTrack = EditShapeGeometryTrack;
})(window);

