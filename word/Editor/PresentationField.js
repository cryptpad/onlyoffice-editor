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

    function AlignNum(Num, nDigitsCount)
    {
        
    }

    function CPresentationField(Paragraph)
    {
        ParaRun.call(this, Paragraph, false);
        this.Guid = null;
        this.FieldType = null;
        this.PPr = null;
    }
    CPresentationField.prototype = Object.create(ParaRun.prototype);
    CPresentationField.prototype.constructor = CPresentationField;


    CPresentationField.prototype.Copy = function()
    {
        var Field = new CPresentationField(this.Paragraph);
        Field.Set_Pr( this.Pr.Copy() );
        Field.SetGuid( AscCommon.GUID() );
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
        this.Guid = sGuid;
    };
    CPresentationField.prototype.SetFieldType = function(Type)
    {
        this.FieldType = Type;
    };
    CPresentationField.prototype.SetPPr = function(Pr)
    {
        this.PPr = Pr;
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
    CPresentationField.prototype.private_GetString = function()
    {
        var sStr = null;
        // if(typeof this.FieldType === 'string') {
        //     var sFieldType = this.FieldType.toLowerCase();
        //     sStr = sFieldType;
        //     switch (sFieldType)
        //     {
        //         case "slidenum":
        //         {
        //
        //             break;
        //         }
        //         case "datetime":
        //         {
        //
        //             break;
        //         }
        //         case "datetime1":
        //         {
        //             var oDate = new Date();
        //             sStr = oDate.getMonth() + '/' + oDate.getDay() + '/' + oDate.getYear();
        //             break;
        //         }
        //         case "datetime2":
        //         {
        //             var oDate = new Date();
        //             sStr = oDate.getMonth() + '/' + oDate.getDay() + '/' + oDate.getYear();
        //             break;
        //         }
        //         case "datetime3":
        //         {
        //             break;
        //         }
        //         case "datetime4":
        //         {
        //             break;
        //         }
        //         case "datetime5":
        //         {
        //             break;
        //         }
        //         case "datetime6":
        //         {
        //             break;
        //         }
        //         case "datetime7":
        //         {
        //             break;
        //         }
        //         case "datetime8":
        //         {
        //             break;
        //         }
        //         case "datetime9":
        //         {
        //             break;
        //         }
        //         case "datetime10":
        //         {
        //             break;
        //         }
        //         case "datetime11":
        //         {
        //             break;
        //         }
        //         case "datetime12":
        //         {
        //             break;
        //         }
        //         case "datetime13":
        //         {
        //             break;
        //         }
        //         default:
        //         {
        //             break;
        //         }
        //     }
        // }
        // switch (this.FieldType)
        // {
        //     case
        //     default:
        //     {
        //         break;
        //     }
        // }
    //}
    return sStr;
};

CPresentationField.prototype.Recalculate_MeasureContent = function()
{
    if (!this.RecalcInfo.IsMeasureNeed())
        return;
    this.private_CalculateContent();
    ParaRun.prototype.Recalculate_MeasureContent.call(this);
};


//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CPresentationField = CPresentationField;
})(window);
