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

(function(){

    let POLYGON_INTENT_TYPE = {
        PolygonCloud:       0,
        PolyLineDimension:  1,
        PolygonDimension:   2
    }

    /**
	 * Class representing a Ink annotation.
	 * @constructor
    */
    function CAnnotationPolygon(sName, nPage, aRect, oDoc)
    {
        AscPDF.CPdfShape.call(this);
        AscPDF.CAnnotationBase.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Polygon, nPage, aRect, oDoc);
        
        AscPDF.initShape(this);

        this._point         = undefined;
        this._popupOpen     = false;
        this._popupRect     = undefined;
        this._richContents  = undefined;
        this._rotate        = undefined;
        this._state         = undefined;
        this._stateModel    = undefined;
        this._width         = undefined;
        this._vertices      = undefined;
        this._intent        = undefined;
    }
    CAnnotationPolygon.prototype.constructor = CAnnotationPolygon;
    AscFormat.InitClass(CAnnotationPolygon, AscPDF.CPdfShape, AscDFH.historyitem_type_Pdf_Annot_Polygon);
    Object.assign(CAnnotationPolygon.prototype, AscPDF.CAnnotationBase.prototype);
    
    CAnnotationPolygon.prototype.SetVertices = function(aVertices) {
        let oViewer = editor.getDocumentRenderer();
        let oDoc    = oViewer.getPDFDoc();
        
        this.recalcGeometry();
        oDoc.History.Add(new CChangesPDFAnnotVertices(this, this.GetVertices(), aVertices));

        this._vertices = aVertices;
    };
    CAnnotationPolygon.prototype.GetVertices = function() {
        return this._vertices;
    };

    CAnnotationPolygon.prototype.Recalculate = function(bForce) {
        if (true !== bForce && false == this.IsNeedRecalc()) {
            return;
        }

        if (this.recalcInfo.recalculateGeometry)
            this.RefillGeometry();

        this.recalculateTransform();
        this.updateTransformMatrix();
        this.recalculate();
        this.SetNeedRecalc(false);
    };
    CAnnotationPolygon.prototype.RefillGeometry = function() {
        let oViewer = editor.getDocumentRenderer();
        let oDoc    = oViewer.getPDFDoc();
        
        let aPoints = this.GetVertices();

        let aPolygonPoints = [];
        for (let i = 0; i < aPoints.length - 1; i += 2) {
            aPolygonPoints.push({
                x: aPoints[i] * g_dKoef_pt_to_mm,
                y: (aPoints[i + 1])* g_dKoef_pt_to_mm
            });
        }
        
        let aShapeRectInMM = this.GetRect().map(function(measure) {
            return measure * g_dKoef_pt_to_mm;
        });

        oDoc.StartNoHistoryMode();

        let geometry;
        if (this.GetBorderEffectStyle() === AscPDF.BORDER_EFFECT_STYLES.Cloud) {
            geometry = AscPDF.generateCloudyGeometry(aPolygonPoints, aShapeRectInMM, this.spPr.geometry, this.GetBorderEffectIntensity());
        }
        else {
            geometry = generateGeometry(aPolygonPoints, aShapeRectInMM, this.spPr.geometry);
        }

        if (this.spPr.geometry == null)
            this.spPr.setGeometry(geometry);

        oDoc.EndNoHistoryMode();
    };
    CAnnotationPolygon.prototype.SetRect = function(aOrigRect) {
        let oViewer     = Asc.editor.getDocumentRenderer();
        let oDoc        = oViewer.getPDFDoc();

        oDoc.History.Add(new CChangesPDFAnnotRect(this, this.GetOrigRect(), aOrigRect));

        this._origRect = aOrigRect;

        let oXfrm = this.getXfrm();
        if (oXfrm) {
            AscCommon.History.StartNoHistoryMode();
            oXfrm.setOffX(aOrigRect[0] * g_dKoef_pt_to_mm);
            oXfrm.setOffY(aOrigRect[1] * g_dKoef_pt_to_mm);
            oXfrm.setExtX((aOrigRect[2] - aOrigRect[0]) * g_dKoef_pt_to_mm);
            oXfrm.setExtY((aOrigRect[3] - aOrigRect[1]) * g_dKoef_pt_to_mm);
            AscCommon.History.EndNoHistoryMode();
        }

        this.AddToRedraw();
        this.SetWasChanged(true);
    };
    CAnnotationPolygon.prototype.LazyCopy = function() {
        let oDoc = this.GetDocument();
        oDoc.StartNoHistoryMode();

        let oPolygon = new CAnnotationPolygon(AscCommon.CreateGUID(), this.GetPage(), this.GetOrigRect().slice(), oDoc);
        oPolygon.lazyCopy = true;

        this.fillObject(oPolygon);

        let aStrokeColor    = this.GetStrokeColor();
        let aFillColor      = this.GetFillColor();
        let aVertices       = this.GetVertices();

        oPolygon._apIdx = this._apIdx;
        oPolygon._originView = this._originView;
        oPolygon.SetOriginPage(this.GetOriginPage());
        oPolygon.SetAuthor(this.GetAuthor());
        oPolygon.SetModDate(this.GetModDate());
        oPolygon.SetCreationDate(this.GetCreationDate());
        oPolygon.SetContents(this.GetContents());
        aStrokeColor && oPolygon.SetStrokeColor(aStrokeColor.slice());
        aFillColor && oPolygon.SetFillColor(aFillColor.slice());
        oPolygon.SetWidth(this.GetWidth());
        oPolygon.SetOpacity(this.GetOpacity());
        aVertices && oPolygon.SetVertices(aVertices.slice());
        oPolygon.SetWasChanged(oPolygon.IsChanged());
        oPolygon.recalcInfo.recalculateGeometry = true;
        oPolygon.recalculate();

        oDoc.EndNoHistoryMode();

        return oPolygon;
    };
    CAnnotationPolygon.prototype.onMouseDown = function(x, y, e) {
        let oViewer         = Asc.editor.getDocumentRenderer();
        let oDrawingObjects = oViewer.DrawingObjects;

        this.selectStartPage = this.GetPage();

        let pageObject = oViewer.getPageByCoords2(x, y);
        if (!pageObject)
            return false;

        let X = pageObject.x;
        let Y = pageObject.y;

        oDrawingObjects.OnMouseDown(e, X, Y, pageObject.index);
        oDrawingObjects.startEditGeometry();
    };
    CAnnotationPolygon.prototype.GetGeometryEdit = function() {
        if (this.GetBorderEffectStyle() !== AscPDF.BORDER_EFFECT_STYLES.Cloud)
            return this.spPr.geometry;
        
        let oViewer = editor.getDocumentRenderer();
        let oDoc    = oViewer.getPDFDoc();
        
        let aPoints = this.GetVertices();
        let aPolygonPoints = [];
        for (let i = 0; i < aPoints.length - 1; i += 2) {
            aPolygonPoints.push({
                x: aPoints[i] * g_dKoef_pt_to_mm,
                y: (aPoints[i + 1])* g_dKoef_pt_to_mm
            });
        }
        
        let aShapeRectInMM = this.GetRect().map(function(measure) {
            return measure * g_dKoef_pt_to_mm;
        });

        oDoc.StartNoHistoryMode();
        this._internalGeomForEdit = generateGeometry(aPolygonPoints, aShapeRectInMM, this._internalGeomForEdit);
        this._internalGeomForEdit.Recalculate(aShapeRectInMM[2] - aShapeRectInMM[0], aShapeRectInMM[3] - aShapeRectInMM[1]);
        oDoc.EndNoHistoryMode();

        return this._internalGeomForEdit;
    };
    CAnnotationPolygon.prototype.IsPolygon = function() {
        return true;
    };
    CAnnotationPolygon.prototype.WriteToBinary = function(memory) {
        memory.WriteByte(AscCommon.CommandType.ctAnnotField);

        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);

        this.WriteToBinaryBase(memory);
        this.WriteToBinaryBase2(memory);
        
        // vertices
        let aVertices = this.GetVertices();
        if (aVertices) {
            memory.WriteLong(aVertices.length);
            for (let i = 0; i < aVertices.length; i++) {
                memory.WriteDouble(aVertices[i]);
            }
        }
        
        // fill
        let aFill = this.GetFillColor();
        if (aFill != null) {
            memory.annotFlags |= (1 << 16);
            memory.WriteLong(aFill.length);
            for (let i = 0; i < aFill.length; i++)
                memory.WriteDouble(aFill[i]);
        }

        // intent
        let nIntent = this.GetIntent();
        if (nIntent != null) {
            memory.annotFlags |= (1 << 20);
            memory.WriteByte(nIntent);
        }

        let nEndPos = memory.GetCurPosition();
        memory.Seek(memory.posForFlags);
        memory.WriteLong(memory.annotFlags);
        
        memory.Seek(nStartPos);
        memory.WriteLong(nEndPos - nStartPos);
        memory.Seek(nEndPos);
    };

    function generateGeometry(aPoints, aBounds, oGeometry) {
        let xMin = aBounds[0];
        let yMin = aBounds[1];
        let xMax = aBounds[2];
        let yMax = aBounds[3];

        let geometry = oGeometry ? oGeometry : new AscFormat.Geometry();
        if (oGeometry) {
            oGeometry.pathLst = [];
        }

        let bClosed     = false;
        let min_dist    = editor.WordControl.m_oDrawingDocument.GetMMPerDot(3);
        let oLastPoint  = aPoints[aPoints.length-1];
        let nLastIndex  = aPoints.length-1;
        if(oLastPoint.bTemporary) {
            nLastIndex--;
        }
        if(nLastIndex > 1)
        {
            let dx = aPoints[0].x - aPoints[nLastIndex].x;
            let dy = aPoints[0].y - aPoints[nLastIndex].y;
            if(Math.sqrt(dx*dx +dy*dy) < min_dist)
            {
                bClosed = true;
            }
        }

        let w = xMax - xMin, h = yMax-yMin;
        let kw, kh, pathW, pathH;
        if(w > 0)
        {
            pathW = 43200;
            kw = 43200/ w;
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
        
        geometry.AddPathCommand(0,undefined, undefined, undefined, pathW, pathH);
        geometry.AddPathCommand(1, (((aPoints[0].x - xMin) * kw) >> 0) + "", (((aPoints[0].y - yMin) * kh) >> 0) + "");

        let oPt, nPt;
        let nPtCount = aPoints.length;
        // если последняя точка совпадает с первой, значит её не учитываем
        if (aPoints[0].x == aPoints[aPoints.length - 1].x && aPoints[0].y == aPoints[aPoints.length - 1].y)
            nPtCount = aPoints.length - 1;

        for(nPt = 1; nPt < nPtCount; nPt++) {
            oPt = aPoints[nPt];

            geometry.AddPathCommand(2,
                (((oPt.x - xMin) * kw) >> 0) + "", (((oPt.y - yMin) * kh) >> 0) + ""
            );
        }
        
        geometry.AddPathCommand(6);

        geometry.preset = null;
        geometry.rectS = null;
        return geometry;
    }
    
    window["AscPDF"].CAnnotationPolygon = CAnnotationPolygon;
})();

