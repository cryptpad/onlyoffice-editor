/**
 * Created by Sergey.Luzyanin on 1/14/2019.
 */
(function(window, undefined){
     var oMonths = {};
    oMonths[0] = "January";
    oMonths[1] = "February";
    oMonths[2] = "March";
    oMonths[3] = "April";
    oMonths[4] = "May";
    oMonths[5] = "June";
    oMonths[6] = "July";
    oMonths[7] = "August";
    oMonths[8] = "September";
    oMonths[9] = "October";
    oMonths[10] = "November";
    oMonths[11] = "December";

     var oDays = {};
    oDays[0] = "Sunday";
    oDays[1] = "Monday";
    oDays[2] = "Tuesday";
    oDays[3] = "Wednesday";
    oDays[4] = "Thursday";
    oDays[5] = "Friday";
    oDays[6] = "Saturday";

    function AlignNum(Num, nDigitsCount)
    {
        var sStr = "" + Num;
        for(var i = sStr.length; i < nDigitsCount; ++i)
        {
            sStr = '0' + sStr;
        }
        return sStr;
    }

    function CPresentationField(Paragraph)
    {
        ParaRun.call(this, Paragraph, false);
        this.Guid = null;
        this.FieldType = null;
        this.PPr = null;

        this.Slide = null;
        this.SlideNum = null;
    }
    CPresentationField.prototype = Object.create(ParaRun.prototype);
    CPresentationField.prototype.constructor = CPresentationField;


    CPresentationField.prototype.Copy = function(Selected, oPr)
    {
        if(oPr && oPr.Paragraph && oPr.Paragraph.bFromDocument)
        {
            return ParaRun.prototype.Copy.call(this, Selected, oPr);
        }
        var Field = new CPresentationField(this.Paragraph);
        Field.Set_Pr( this.Pr.Copy() );
        Field.SetGuid( '{' + AscCommon.GUID() + '}');
        Field.SetFieldType( this.FieldType );
        if(this.PPr)
        {
            Field.SetPPr(this.PPr.Copy());
        }
        return Field;
    };

    CPresentationField.prototype.Copy2 = function()
    {
        this.Copy();
    };

    CPresentationField.prototype.SetGuid = function(sGuid)
    {
        History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_PresentationField_Guid, this.Guid, sGuid));
        this.Guid = sGuid;
    };
    CPresentationField.prototype.SetFieldType = function(Type)
    {
        History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_PresentationField_FieldType, this.FieldType, Type));
        this.FieldType = Type;
    };
    CPresentationField.prototype.SetPPr = function(Pr)
    {
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_PresentationField_PPr, this.PPr, Pr));
        this.PPr = Pr;
    };

    CPresentationField.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
    {
        if(AscCommon.History.Is_On())
        {
            return;
        }
        ParaRun.prototype.Add_ToContent.call(this, Pos, Item, UpdatePosition);
    };
    CPresentationField.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
    {
        if(AscCommon.History.Is_On())
        {
            return;
        }
        ParaRun.prototype.Remove_FromContent.call(this, Pos, Count, UpdatePosition);
    };

    CPresentationField.prototype.private_CalculateContent = function()
    {
        AscFormat.ExecuteNoHistory(function(){
            this.Content.length = 0;
            var sStr = this.private_GetString();
            if(typeof sStr === 'string')
            {
                this.AddText(sStr, -1);
            }
        }, this, []);
    };
    CPresentationField.prototype.GetFieldType = function(){
        if(typeof this.FieldType === 'string') {
            return this.FieldType.toLowerCase();
        }
        return "";
    };
    CPresentationField.prototype.private_GetString = function()
    {
        var sStr = null;
        var oDate;
        var oStylesObject;
        if(typeof this.FieldType === 'string')
        {
            var sFieldType = this.FieldType.toLowerCase();
            switch (sFieldType)
            {
                case "slidenum":
                {
                    if(this.Paragraph && this.Paragraph.Parent)
                    {
                        oStylesObject = this.Paragraph.Parent.Get_Styles();
                        if(oStylesObject.slide)
                        {
                            this.Slide = oStylesObject.slide;
                            if(AscFormat.isRealNumber(this.Slide.num))
                            {
                                this.SlideNum = this.Slide.num;
                                sStr = '' + (this.Slide.num + 1);
                            }
                        }
                        else if(oStylesObject.layout)
                        {
                            this.SlideNum = oStylesObject.layout.lastRecalcSlideIndex;
                            sStr = '' + (oStylesObject.layout.lastRecalcSlideIndex + 1);
                        }
                        else if(oStylesObject.master)
                        {
                            this.SlideNum = oStylesObject.master.lastRecalcSlideIndex;
                            sStr = '' + (oStylesObject.master.lastRecalcSlideIndex + 1);
                        }
                    }
                    break;
                }
                case "value":
                {
                    if(this.Paragraph && this.Paragraph.Parent)
                    {
                        oStylesObject = this.Paragraph.Parent.Get_Styles();
                        if(oStylesObject.shape && oStylesObject.shape.getValueString())
                        {
                            sStr = oStylesObject.shape.getValueString();
                        }
                    }
                    break;
                }
                case "percentage":
                {
                    if(this.Paragraph && this.Paragraph.Parent)
                    {
                        oStylesObject = this.Paragraph.Parent.Get_Styles();
                        if(oStylesObject.shape && oStylesObject.shape.getPercentageString())
                        {
                            sStr = oStylesObject.shape.getPercentageString();
                        }
                    }
                    break;
                }
                case "datetime":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getMonth() + 1, 2) + '/' + AlignNum(oDate.getDate(), 2) + '/' + oDate.getFullYear();
                    break;
                }
                case "datetime1":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getMonth() + 1, 2) + '/' + AlignNum(oDate.getDate(), 2) + '/' + oDate.getFullYear();
                    break;
                }
                case "datetime2":
                {
                    oDate = new Date();
                    sStr = AscCommon.translateManager.getValue(oDays[oDate.getDay()]) + ', ' + AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]) + ' ' + AlignNum(oDate.getDate(), 2) + ', ' + oDate.getFullYear();
                    break;
                }
                case "datetime3":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getDate(), 2) + ' ' + AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]) + ' ' + oDate.getFullYear();
                    break;
                }
                case "datetime4":
                {
                    oDate = new Date();
                    sStr = AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]) + ' ' + AlignNum(oDate.getDate(), 2) + ', ' + oDate.getFullYear();
                    break;
                }
                case "datetime5":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getDate(), 2) + '-' + AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]).slice(0, 3) + '-' + (oDate.getFullYear() + '').slice(2, 4);
                    break;
                }
                case "datetime6":
                {
                    oDate = new Date();
                    sStr = AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]) + ' ' + (oDate.getFullYear() + '').slice(2, 4);
                    break;
                }
                case "datetime7":
                {
                    oDate = new Date();
                    sStr = AscCommon.translateManager.getValue(oMonths[oDate.getMonth()]).slice(0, 3) + '-' + (oDate.getFullYear() + '').slice(2, 4);
                    break;
                }
                case "datetime8":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getMonth() + 1, 2) + '/' + AlignNum(oDate.getDate(), 2) + '/' + oDate.getFullYear() + ' ' + oDate.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
                    break;
                }
                case "datetime9":
                {
                    oDate = new Date();
                    sStr = AlignNum(oDate.getMonth() + 1, 2) + '/' + AlignNum(oDate.getDate(), 2) + '/' + oDate.getFullYear() + ' ' + oDate.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' });
                    break;
                }
                case "datetime10":
                {
                    oDate = new Date();
                    sStr = oDate.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', hour12: false });
                    break;
                }
                case "datetime11":
                {
                    oDate = new Date();
                    sStr = oDate.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', second: 'numeric', hour12: false });
                    break;
                }
                case "datetime12":
                {
                    oDate = new Date();
                    sStr = oDate.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
                    break;
                }
                case "datetime13":
                {
                    oDate = new Date();
                    sStr = oDate.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' });
                    break;
                }
                default:
                {
                    sStr = sFieldType.toUpperCase();
                    break;
                }
            }
        }
        return sStr;
    };

    CPresentationField.prototype.Recalculate_MeasureContent = function()
    {
        if (!this.RecalcInfo.IsMeasureNeed())
            return;
        this.private_CalculateContent();
        ParaRun.prototype.Recalculate_MeasureContent.call(this);
    };

    CPresentationField.prototype.Recalculate_MeasureContent = function()
    {
        if (!this.RecalcInfo.IsMeasureNeed())
            return;
        this.private_CalculateContent();
        ParaRun.prototype.Recalculate_MeasureContent.call(this);
    };

    CPresentationField.prototype.Write_ToBinary2 = function(Writer)
    {
        var StartPos = Writer.GetCurPosition();
        ParaRun.prototype.Write_ToBinary2.call(this, Writer);
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong( AscDFH.historyitem_type_PresentationField);
        Writer.Seek(EndPos);
    };

    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    drawingsChangesMap[AscDFH.historyitem_PresentationField_FieldType] = function(oClass, value){oClass.FieldType = value;};
    drawingsChangesMap[AscDFH.historyitem_PresentationField_Guid] = function(oClass, value){oClass.Guid = value;};
    drawingsChangesMap[AscDFH.historyitem_PresentationField_PPr] = function(oClass, value){oClass.PPr = value;};

    AscDFH.changesFactory[AscDFH.historyitem_PresentationField_FieldType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PresentationField_Guid] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PresentationField_PPr] = window['AscDFH'].CChangesDrawingsObjectNoId;

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CPresentationField = CPresentationField;
})(window);
