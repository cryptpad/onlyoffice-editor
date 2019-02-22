/**
 * Created by Sergey.Luzyanin on 10/18/2018.
 */
(function (undefined){
    function CLockedCanvas() {
        AscFormat.CGroupShape.call(this);
    }
    CLockedCanvas.prototype = Object.create(AscFormat.CGroupShape.prototype);
    CLockedCanvas.prototype.constructor = CLockedCanvas;
    CLockedCanvas.prototype.getObjectType = function(){
        return AscDFH.historyitem_type_LockedCanvas;
    };
    CLockedCanvas.prototype.canRotate = function () {
        return false;
    };

    CLockedCanvas.prototype.recalculateBounds = function () {
        var tr = this.localTransform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.extX,0));
        arr_p_y.push(tr.TransformPointY(this.extX,0));
        arr_p_x.push(tr.TransformPointX(this.extX,this.extY));
        arr_p_y.push(tr.TransformPointY(this.extX,this.extY));
        arr_p_x.push(tr.TransformPointX(0,this.extY));
        arr_p_y.push(tr.TransformPointY(0,this.extY));
        this.bounds.x = Math.min.apply(Math, arr_p_x);
        this.bounds.y = Math.min.apply(Math, arr_p_y);
        this.bounds.l = this.bounds.x;
        this.bounds.t = this.bounds.y;
        this.bounds.r = Math.max.apply(Math, arr_p_x);
        this.bounds.b = Math.max.apply(Math, arr_p_y);
        this.bounds.w = this.bounds.r - this.bounds.l;
        this.bounds.h = this.bounds.b - this.bounds.t;
    };


    CLockedCanvas.prototype.draw = function(graphics) {
        // if(this.parent){
        //     graphics.m_oCoordTransform.sx *= (this.parent.Extent.W / this.spPr.xfrm.extX);
        //     graphics.m_oCoordTransform.sy *= (this.parent.Extent.H / this.spPr.xfrm.extY);
        // }
        AscFormat.CGroupShape.prototype.draw.call(this, graphics);
    };

    CLockedCanvas.prototype.hitInPath = function () {
        return false;
    };

    CLockedCanvas.prototype.hitInInnerArea = function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    };

    CLockedCanvas.prototype.hit = function (x, y) {
        return this.hitInInnerArea(x, y);
    };


    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CLockedCanvas = CLockedCanvas;
})();