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

(	/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

    var AscBrowser = window['AscCommon'].AscBrowser;

var debug = false;

var ArrowType = {
    NONE: 0,
    ARROW_TOP: 1,
    ARROW_RIGHT: 2,
    ARROW_BOTTOM: 3,
    ARROW_LEFT: 4
};

var AnimationType = {
    NONE: 0,
    SCROLL_HOVER: 1,
    ARROW_HOVER: 2,
    SCROLL_ACTIVE: 3,
    ARROW_ACTIVE: 4
};

function GetClientWidth( elem ) {
    var _w = elem.clientWidth;
    if ( 0 != _w )
        return _w;

    var _string_w = "" + elem.style.width;
    if ( -1 < _string_w.indexOf( "%" ) )
        return 0;

    var _intVal = parseInt( _string_w );
    if ( !isNaN( _intVal ) && 0 < _intVal )
        return _intVal;

    return 0;
}
function GetClientHeight( elem ) {
    var _w = elem.clientHeight;
    if ( 0 != _w )
        return _w;

    var _string_w = "" + elem.style.height;
    if ( -1 < _string_w.indexOf( "%" ) )
        return 0;

    var _intVal = parseInt( _string_w );
    if ( !isNaN( _intVal ) && 0 < _intVal )
        return _intVal;

    return 0;
}

function CArrowDrawer( settings ) {
    // размер квадратика в пикселах
    this.Size = 16;
    this.SizeW = 16;
    this.SizeH = 16;

    this.SizeNaturalW = this.SizeW;
    this.SizeNaturalH = this.SizeH;

    this.IsRetina = false;

    // просто рисовать - неправильно. рисуется с антиалиазингом - и получается некрасиво
    /*this.ColorGradStart = {R:69, G:70, B:71};
     this.ColorGradEnd = {R:116, G:117, B:118};*/

    function HEXTORGB( colorHEX ) {
        return {
            R:parseInt( colorHEX.substring( 1, 3 ), 16 ),
            G:parseInt( colorHEX.substring( 3, 5 ), 16 ),
            B:parseInt( colorHEX.substring( 5, 7 ), 16 )
        }
    }

    this.ColorGradStart  = {R: settings.arrowColor, G: settings.arrowColor, B: settings.arrowColor};
    this.ColorGradEnd = [];


    this.ColorBorderNone = settings.arrowBorderColor;
    this.ColorBorderOver = settings.arrowOverBorderColor;
    this.ColorBorderActive = settings.arrowActiveBorderColor;

    this.ColorBackNone = settings.arrowBackgroundColor;
    this.ColorBackOver = settings.arrowOverBackgroundColor;
    this.ColorBackActive = settings.arrowActiveBackgroundColor;

    // вот такие мега настройки для кастомизации)
    this.IsDrawBorderInNoneMode = false;
    this.IsDrawBorders = true;

    // имя - направление стрелки
    this.ImageLeft = null;
    this.ImageTop = null;
    this.ImageRight = null;
    this.ImageBottom = null;

    this.IsNeedInvertOnActive = settings.isNeedInvertOnActive;

    this.lastArrowStatus1 = -1;
    this.lastArrowStatus2 = -1;
    this.startColorFadeInOutStart1 = {R:-1,G:-1,B:-1};
    this.startColorFadeInOutStart2 = {R:-1,G:-1,B:-1};

    this.fadeInTimeoutFirst = -1;
    this.fadeOutTimeoutFirst = -1;

    this.fadeInTimeout1 = -1;
    this.fadeOutTimeout1 = -1;
    this.fadeInTimeout2 = -1;
    this.fadeOutTimeout2 = -1;


    this.fadeInActive1 = false;
    this.fadeOutActive1 = false;

    this.fadeInActive2 = false;
    this.fadeOutActive2 = false;

    this.fadeInFadeOutDelay = settings.fadeInFadeOutDelay || 30;

}
CArrowDrawer.prototype.InitSize = function ( sizeW, sizeH, is_retina ) {
    if ( ( sizeH == this.SizeH || sizeW == this.SizeW ) && is_retina == this.IsRetina && null != this.ImageLeft )
        return;

    this.SizeW = Math.max( sizeW, 1 );
    this.SizeH = Math.max( sizeH, 1 );
    this.IsRetina = is_retina;

    this.SizeNaturalW = this.SizeW;
    this.SizeNaturalH = this.SizeH;

    if ( this.IsRetina ) {
        this.SizeW <<= 1;
        this.SizeH <<= 1;

        this.SizeNaturalW <<= 1;
        this.SizeNaturalH <<= 1;
    }

    if (null == this.ImageLeft || null == this.ImageTop || null == this.ImageRight || null == this.ImageBottom)
	{
		this.ImageLeft = document.createElement('canvas');
		this.ImageTop = document.createElement('canvas');
		this.ImageRight = document.createElement('canvas');
		this.ImageBottom = document.createElement('canvas');
	}


	var len = 6;
	if ( this.SizeH < 6 )
		return;

	if (this.IsRetina)
		len <<= 1;

	// теперь делаем нечетную длину
	if ( 0 == (len & 1) )
		len += 1;

	var countPart = (len + 1) >> 1,
		plusColor, _data, px,
		_x = ((this.SizeW - len) >> 1),
		_y = this.SizeH - ((this.SizeH - countPart) >> 1),
		_radx = _x + (len >> 1),
		_rady = _y - (countPart >> 1),
		r, g, b;
	var __x = _x, __y = _y, _len = len;
	r = this.ColorGradStart.R;
	g = this.ColorGradStart.G;
	b = this.ColorGradStart.B;
	this.ImageTop.width = this.SizeW;
	this.ImageTop.height = this.SizeH;
    this.ImageBottom.width = this.SizeW;
    this.ImageBottom.height = this.SizeH;
    this.ImageLeft.width = this.SizeW;
    this.ImageLeft.height = this.SizeH;
    this.ImageRight.width = this.SizeW;
    this.ImageRight.height = this.SizeH;
	var ctx = this.ImageTop.getContext('2d');
	var ctxBottom = this.ImageBottom.getContext('2d');
	var ctxLeft = this.ImageLeft.getContext('2d');
    var ctxRight = this.ImageRight.getContext('2d');

	_data = ctx.createImageData(this.SizeW, this.SizeH);
	px = _data.data;

	while (_len > 0) {
		var ind = 4 * (this.SizeW * __y + __x);
		for (var i = 0; i < _len; i++) {
			px[ind++] = r;
			px[ind++] = g;
			px[ind++] = b;
			px[ind++] = 255;
		}

		r = r >> 0;
		g = g >> 0;
		b = b >> 0;

		__x += 1;
		__y -= 1;
		_len -= 2;
	}

	ctx.putImageData(_data, 0, -1);

    ctxLeft.translate( _radx, _rady + 1 );
    ctxLeft.rotate( -Math.PI / 2 );
    ctxLeft.translate( -_radx, -_rady );
    ctxLeft.drawImage( this.ImageTop, 0, 0 );

    ctxBottom.translate( _radx + 1, _rady + 1 );
    ctxBottom.rotate( Math.PI );
    ctxBottom.translate( -_radx, -_rady );
    ctxBottom.drawImage( this.ImageTop, 0, 0 );

    ctxRight.translate( _radx + 1, _rady );
    ctxRight.rotate( Math.PI / 2 );
    ctxRight.translate( -_radx, -_rady );
    ctxRight.drawImage( this.ImageTop, 0, 0 );

    if ( this.IsRetina ) {
        this.SizeW >>= 1;
        this.SizeH >>= 1;
    }
};

/*CArrowDrawer.prototype.drawTopLeftArrow = function(type,mode,ctx,w,h){

    clearTimeout( this.fadeInTimeout1 );
    this.fadeInTimeout1 = null;
    clearTimeout( this.fadeOutTimeout1 );
    this.fadeOutTimeout1 = null;

    ctx.beginPath();

    var startColorFadeIn = this.startColorFadeInOutStart1.R < 0 ? _HEXTORGB_( this.ColorBackNone ) :  this.startColorFadeInOutStart1,
        startColorFadeOut = this.startColorFadeInOutStart1.R < 0 ? _HEXTORGB_( this.ColorBackOver ) : this.startColorFadeInOutStart1,
        that = this,
        img1 = this.ImageTop[mode],
        x1 = 0, y1 = 0,
        is_vertical = true,
        xDeltaIMG = 0, yDeltaIMG = 0, xDeltaBORDER = 0.5, yDeltaBORDER = 1.5,
        tempIMG1 = document.createElement( 'canvas' );

    tempIMG1.width = this.SizeNaturalW;
    tempIMG1.height = this.SizeNaturalH;

    var ctx1 = tempIMG1.getContext('2d');
    if (this.IsRetina)
    {
        ctx1.setTransform(2, 0, 0, 2, 0, 0);
    }

    function fadeIn() {

        var ctx_piperImg, px, _len;

        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," +
                                  that.startColorFadeInOutStart1.G + "," +
                                  that.startColorFadeInOutStart1.B + ")";

        startColorFadeIn.R -= 2;
        startColorFadeIn.G -= 2;
        startColorFadeIn.B -= 2;

        ctx1.rect( 0.5, 1.5, strokeW, strokeH );
        ctx1.fill();

        if ( that.IsDrawBorders ) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }

        ctx_piperImg = img1.getContext( '2d' );
        _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
        px = _data.data;

        _len = px.length;

        for ( var i = 0; i < _len; i += 4 ) {
            if ( px[i + 3] == 255 ) {
                px[i] += 4;
                px[i + 1] += 4;
                px[i + 2] += 4;
            }
        }
        ctx_piperImg.putImageData( _data, 0, 0 );

        ctx1.drawImage( img1, 0, 0, that.SizeW, that.SizeH );

        if ( startColorFadeIn.R >= 207 ) {
            that.startColorFadeInOutStart1 = startColorFadeIn;
            ctx.drawImage(tempIMG1,x1 + xDeltaIMG,y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeInTimeout1 = setTimeout( fadeIn, that.fadeInFadeOutDelay );
        }
        else {
            clearTimeout( that.fadeInTimeout1 );
            that.fadeInTimeout1 = null;
            that.fadeInActive1 = false;
            startColorFadeIn.R += 2;
            startColorFadeIn.G += 2;
            startColorFadeIn.B += 2;
            that.startColorFadeInOutStart1 = startColorFadeIn;

            ctx_piperImg = img1.getContext( '2d' );
            _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
            px = _data.data;

            _len = px.length;

            for ( var i = 0; i < _len; i += 4 ) {
                if ( px[i + 3] == 255 ) {
                    px[i] -= 4;
                    px[i + 1] -= 4;
                    px[i + 2] -= 4;
                }
            }
            ctx_piperImg.putImageData( _data, 0, 0 );
        }

    }

    function fadeOut(){

        var ctx_piperImg, px, _len;

        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," +
                                  that.startColorFadeInOutStart1.G + "," +
                                  that.startColorFadeInOutStart1.B + ")";

        startColorFadeOut.R += 2;
        startColorFadeOut.G += 2;
        startColorFadeOut.B += 2;

        ctx1.rect( 0.5, 1.5, strokeW, strokeH  );
        ctx1.fill();

        if ( that.IsDrawBorders ) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }

        ctx_piperImg = img1.getContext( '2d' );
        _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
        px = _data.data;

        _len = px.length;

        for ( var i = 0; i < _len; i += 4 ) {
            if ( px[i + 3] == 255 ) {
//                console.log("3 " + i + " " +  " " + px[i])
                px[i] -= 4;
                px[i + 1] -= 4;
                px[i + 2] -= 4;
            }
        }
        ctx_piperImg.putImageData( _data, 0, 0 );

        ctx1.drawImage( img1, 0, 0, that.SizeW, that.SizeH );

        if ( startColorFadeOut.R <= 241 ) {
            that.startColorFadeInOutStart1 = startColorFadeOut;
            ctx.drawImage(tempIMG1,x1 + xDeltaIMG,y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeOutTimeout1 = setTimeout( fadeOut, that.fadeInFadeOutDelay );
        }
        else {
            clearTimeout( that.fadeOutTimeout1 );
            that.fadeOutTimeout1 = null;
            that.fadeOutActive1 = false;
            startColorFadeOut.R -= 2;
            startColorFadeOut.G -= 2;
            startColorFadeOut.B -= 2;
            that.startColorFadeInOutStart1 = startColorFadeOut;

            ctx_piperImg = img1.getContext( '2d' );
            _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
            px = _data.data;

            _len = px.length;

            for ( var i = 0; i < _len; i += 4 ) {
                if ( px[i + 3] == 255 ) {
                    px[i] += 4;
                    px[i + 1] += 4;
                    px[i + 2] += 4;
                }
            }
            ctx_piperImg.putImageData( _data, 0, 0 );
        }

    }

    if ( mode === null || mode === undefined ) {
        mode = ScrollOverType.NONE;
    }

    switch ( type ) {
        case ScrollArrowType.ARROW_LEFT:
        {
            x1 = 1;
            y1 = -1;
            is_vertical = false;
            img1 = this.ImageLeft[mode];
            break;
        }
        default:
        {
            y1 = 0;
            img1 = this.ImageTop[mode];
            break;
        }
    }

    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;

    switch ( mode ) {
        case ScrollOverType.NONE:
        {
            if ( this.lastArrowStatus1 == ScrollOverType.OVER ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_LEFT:
                    {
                        img1 = this.ImageLeft[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageTop[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus1 = mode;
                this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
                this.fadeOutActive1 = true;
                fadeOut();
            }
            else{

                if ( this.lastArrowStatus1 == ScrollOverType.ACTIVE ) {

                    var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];

                    switch ( type ) {
                        case ScrollArrowType.ARROW_LEFT:
                        {
                            im = this.ImageLeft[ScrollOverType.STABLE];
                            break;
                        }
                        default:
                        {
                            im = this.ImageTop[ScrollOverType.STABLE];
                            break;
                        }
                    }

                    ctx_im = im.getContext( '2d' );
                    _data = ctx_im.getImageData( 0, 0, img1.width, img1.height );
                    px = _data.data;

                    _len = px.length;

                    for ( var i = 0; i < _len; i += 4 ) {
                        if ( px[i + 3] == 255 ) {
                            px[i] = c.R;
                            px[i + 1] = c.G;
                            px[i + 2] = c.B;
                        }
                    }

                    this.startColorFadeInOutStart1 = {R:-1,G:-1,B:-1};

                    ctx_im.putImageData( _data, 0, 0 )

                }

                ctx.beginPath();
                ctx.fillStyle = this.ColorBackNone;
                ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderNone;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }
            }
            break;
        }
        case ScrollOverType.STABLE:
        {
            if ( this.lastArrowStatus1 == ScrollOverType.OVER ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_LEFT:
                    {
                        img1 = this.ImageLeft[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageTop[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus1 = mode;
                this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
                this.fadeOutActive1 = true;
                fadeOut();
            }
            else{

                if ( this.lastArrowStatus1 != ScrollOverType.STABLE ) {

                    var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];

                    switch ( type ) {
                        case ScrollArrowType.ARROW_LEFT:
                        {
                            im = this.ImageLeft[ScrollOverType.STABLE];
                            break;
                        }
                        default:
                        {
                            im = this.ImageTop[ScrollOverType.STABLE];
                            break;
                        }
                    }

                    ctx_im = im.getContext( '2d' );
                    _data = ctx_im.getImageData( 0, 0, img1.width, img1.height );
                    px = _data.data;

                    _len = px.length;

                    for ( var i = 0; i < _len; i += 4 ) {
                        if ( px[i + 3] == 255 ) {
                            px[i] = c.R;
                            px[i + 1] = c.G;
                            px[i + 2] = c.B;
                        }
                    }

                    this.startColorFadeInOutStart1 = {R:-1,G:-1,B:-1};

                    ctx_im.putImageData( _data, 0, 0 )

                }

                ctx.beginPath();
                ctx.fillStyle = this.ColorBackStable;
                ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderStable;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }
            }
            break;
        }
        case ScrollOverType.OVER:
        {
            if ( this.lastArrowStatus1 == ScrollOverType.NONE || this.lastArrowStatus1 == ScrollOverType.STABLE ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_LEFT:
                    {
                        img1 = this.ImageLeft[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageTop[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus1 = mode;
                this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeIn : this.startColorFadeInOutStart1;
                this.fadeInActive1 = true;
                fadeIn();
            }
            else{
                ctx.beginPath();
                ctx.fillStyle = this.ColorBackOver;
                ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderOver;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }
            }
            break;
        }
        case ScrollOverType.ACTIVE:
        {
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackActive;
			ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );

            if ( !this.IsNeedInvertOnActive ) {
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
            }
            else {
                // slow method
                var _ctx = img1.getContext( "2d" );

                var _data = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );
                var _data2 = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );

                var _len = 4 * this.SizeW * this.SizeH;
                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255;// - _data.data[i];
                        _data.data[i + 1] = 255;// - _data.data[i + 1];
                        _data.data[i + 2] = 255;// - _data.data[i + 2];
                    }
                }

                _ctx.putImageData( _data, 0, 0 );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );

                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255 - _data.data[i];
                        _data.data[i + 1] = 255 - _data.data[i + 1];
                        _data.data[i + 2] = 255 - _data.data[i + 2];
                    }
                }
                _ctx.putImageData( _data2, 0, 0 );

                _data = null;
                _data2 = null;
            }
            if ( this.IsDrawBorders ) {
                ctx.strokeStyle = this.ColorBorderActive;
                ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                ctx.stroke();
            }
            break;
        }
        default:{
            break;
        }
    }

    this.lastArrowStatus1 = mode;

};
CArrowDrawer.prototype.drawBottomRightArrow = function(type,mode,ctx,w,h){

    clearTimeout( this.fadeInTimeout2 );
    this.fadeInTimeout2 = null;
    clearTimeout( this.fadeOutTimeout2 );
    this.fadeOutTimeout2 = null;

    ctx.beginPath();

    var startColorFadeIn = this.startColorFadeInOutStart2.R < 0 ? _HEXTORGB_( this.ColorBackNone ) :  this.startColorFadeInOutStart2,
        startColorFadeOut =  this.startColorFadeInOutStart2.R < 0 ? _HEXTORGB_( this.ColorBackOver ) : this.startColorFadeInOutStart2,
        that = this,
        img1 = this.ImageTop[mode],
        x1 = 0, y1 = 0,
        is_vertical = true,
        bottomRightDelta = 1,
        xDeltaIMG = 0, yDeltaIMG = 0, xDeltaBORDER = 0.5, yDeltaBORDER = 1.5,
        tempIMG1 = document.createElement( 'canvas' );

    tempIMG1.width = this.SizeNaturalW;
    tempIMG1.height = this.SizeNaturalH;

    var ctx1 = tempIMG1.getContext('2d');

    if (this.IsRetina)
    {
        ctx1.setTransform(2, 0, 0, 2, 0, 0);
    }

    function fadeIn(){

        var ctx_piperImg, px, _len;

        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart2.R + "," +
                                  that.startColorFadeInOutStart2.G + "," +
                                  that.startColorFadeInOutStart2.B + ")";

        startColorFadeIn.R -= 2;
        startColorFadeIn.G -= 2;
        startColorFadeIn.B -= 2;

        ctx1.rect( .5, 1.5, strokeW, strokeH );
        ctx1.fill();

        if ( that.IsDrawBorders ) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }

        ctx_piperImg = img1.getContext( '2d' );
        _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
        px = _data.data;

        _len = px.length;

        for ( var i = 0; i < _len; i += 4 ) {
            if ( px[i + 3] == 255 ) {
                px[i] += 4;
                px[i + 1] += 4;
                px[i + 2] += 4;
            }
        }
        ctx_piperImg.putImageData( _data, 0, 0 );

        ctx1.drawImage( img1, 0, 0, that.SizeW, that.SizeH );

        if ( startColorFadeIn.R >= 207 ) {
            that.startColorFadeInOutStart2 = startColorFadeIn;
            ctx.drawImage(tempIMG1,x1 + xDeltaIMG,y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeInTimeout2 = setTimeout( fadeIn, that.fadeInFadeOutDelay );
        }
        else {
            clearTimeout( that.fadeInTimeout2 );
            that.fadeInTimeout2 = null;
            that.fadeInActive2 = false;
            startColorFadeIn.R += 2;
            startColorFadeIn.G += 2;
            startColorFadeIn.B += 2;
            that.startColorFadeInOutStart2 = startColorFadeIn;

            ctx_piperImg = img1.getContext( '2d' );
            _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
            px = _data.data;

            _len = px.length;

            for ( var i = 0; i < _len; i += 4 ) {
                if ( px[i + 3] == 255 ) {
                    px[i] -= 4;
                    px[i + 1] -= 4;
                    px[i + 2] -= 4;
                }
            }
            ctx_piperImg.putImageData( _data, 0, 0 );

        }

    }

    function fadeOut(){

        var ctx_piperImg, px, _len;

        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart2.R + "," +
                                  that.startColorFadeInOutStart2.G + "," +
                                  that.startColorFadeInOutStart2.B + ")";

        startColorFadeOut.R += 2;
        startColorFadeOut.G += 2;
        startColorFadeOut.B += 2;

        ctx1.rect( .5, 1.5, strokeW, strokeH  );
        ctx1.fill();

        if ( that.IsDrawBorders ) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }

        ctx_piperImg = img1.getContext( '2d' );
        _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
        px = _data.data;
        _len = px.length;

        for ( var i = 0; i < _len; i += 4 ) {
            if ( px[i + 3] == 255 ) {
                px[i] -= 4;
                px[i + 1] -= 4;
                px[i + 2] -= 4;
            }
        }

        ctx_piperImg.putImageData( _data, 0, 0 );

        ctx1.drawImage( img1, 0, 0, that.SizeW, that.SizeH );

        if ( startColorFadeOut.R <= 241 ) {
            that.startColorFadeInOutStart2 = startColorFadeOut;
            ctx.drawImage(tempIMG1,x1 + xDeltaIMG,y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeOutTimeout2 = setTimeout( fadeOut, that.fadeInFadeOutDelay );
        }
        else {
            clearTimeout( that.fadeOutTimeout2 );
            that.fadeOutTimeout2 = null;
            that.fadeOutActive2 = false;
            startColorFadeOut.R -= 2;
            startColorFadeOut.G -= 2;
            startColorFadeOut.B -= 2;
            that.startColorFadeInOutStart2 = startColorFadeOut;

            ctx_piperImg = img1.getContext( '2d' );
            _data = ctx_piperImg.getImageData( 0, 0, img1.width, img1.height );
            px = _data.data;

            _len = px.length;

            for ( var i = 0; i < _len; i += 4 ) {
                if ( px[i + 3] == 255 ) {
                    px[i] += 4;
                    px[i + 1] += 4;
                    px[i + 2] += 4;
                }
            }
            ctx_piperImg.putImageData( _data, 0, 0 );

        }

    }

    if ( mode === null || mode === undefined ) {
        mode = ScrollOverType.NONE;
    }

    switch ( type ) {
        case ScrollArrowType.ARROW_RIGHT:
        {
            is_vertical = false;
            x1 = w - this.SizeW - bottomRightDelta;
            y1 = -1;
            img1 = this.ImageRight[mode];

            break;
        }
        case ScrollArrowType.ARROW_BOTTOM:
        {
            y1 = h - this.SizeH - bottomRightDelta - 1;
            img1 = this.ImageBottom[mode];

            break;
        }
    }

    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;

    switch ( mode ) {
        case ScrollOverType.NONE:
        {
            if ( this.lastArrowStatus2 == ScrollOverType.OVER ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_RIGHT:
                    {
                        img1 = this.ImageRight[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageBottom[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus2 = mode;
                this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart2;
                this.fadeOutActive2 = true;
                fadeOut();
            }
            else{

                if ( this.lastArrowStatus2 == ScrollOverType.ACTIVE ) {

                    var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];

                    switch ( type ) {
                        case ScrollArrowType.ARROW_RIGHT:
                        {
                            im = this.ImageRight[ScrollOverType.STABLE];
                            break;
                        }
                        default:
                        {
                            im = this.ImageBottom[ScrollOverType.STABLE];
                            break;
                        }
                    }

                    ctx_im = im.getContext( '2d' );
                    _data = ctx_im.getImageData( 0, 0, img1.width, img1.height );
                    px = _data.data;

                    _len = px.length;

                    for ( var i = 0; i < _len; i += 4 ) {
                        if ( px[i + 3] == 255 ) {
                            px[i] = c.R;
                            px[i + 1] = c.G;
                            px[i + 2] = c.B;
                        }
                    }

                    this.startColorFadeInOutStart2 = {R:-1,G:-1,B:-1};

                    ctx_im.putImageData( _data, 0, 0 )

                }

                ctx.beginPath();
                ctx.fillStyle = this.ColorBackNone;
                ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderNone;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }
            }
            break;
        }
        case ScrollOverType.STABLE:
        {
            if ( this.lastArrowStatus2 == ScrollOverType.OVER ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_RIGHT:
                    {
                        img1 = this.ImageRight[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageBottom[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus2 = mode;
                this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart2;
                this.fadeOutActive2 = true;
                fadeOut();
            }
            else{

                if ( this.lastArrowStatus2 != ScrollOverType.STABLE ) {

                    var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];

                    switch ( type ) {
                        case ScrollArrowType.ARROW_RIGHT:
                        {
                            im = this.ImageRight[ScrollOverType.STABLE];
                            break;
                        }
                        default:
                        {
                            im = this.ImageBottom[ScrollOverType.STABLE];
                            break;
                        }
                    }

                    ctx_im = im.getContext( '2d' );
                    _data = ctx_im.getImageData( 0, 0, img1.width, img1.height );
                    px = _data.data;

                    _len = px.length;

                    for ( var i = 0; i < _len; i += 4 ) {
                        if ( px[i + 3] == 255 ) {
                            px[i] = c.R;
                            px[i + 1] = c.G;
                            px[i + 2] = c.B;
                        }
                    }

                    this.startColorFadeInOutStart2 = {R:-1,G:-1,B:-1};

                    ctx_im.putImageData( _data, 0, 0 )

                }

                ctx.beginPath();
                ctx.fillStyle = this.ColorBackStable;
				ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                ctx.strokeStyle = this.ColorBackStable;
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderStable;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }
            }
            break;
        }
        case ScrollOverType.OVER:
        {

            if ( this.lastArrowStatus2 == ScrollOverType.NONE || this.lastArrowStatus2 == ScrollOverType.STABLE ) {

                switch ( type ) {
                    case ScrollArrowType.ARROW_RIGHT:
                    {
                        img1 = this.ImageRight[ScrollOverType.STABLE];
                        break;
                    }
                    default:
                    {
                        img1 = this.ImageBottom[ScrollOverType.STABLE];
                        break;
                    }
                }

                this.lastArrowStatus2 = mode;
                this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeIn : this.startColorFadeInOutStart2;
                this.fadeInActive2 = true;
                fadeIn();
            }
            else{
                ctx.beginPath();
                ctx.fillStyle = this.ColorBackOver;
				ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
                if ( this.IsDrawBorders ) {
                    ctx.strokeStyle = this.ColorBorderOver;
                    ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                    ctx.stroke();
                }

            }
            break;
        }
        case ScrollOverType.ACTIVE:
        {
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackActive;
			ctx.fillRect( x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH );

            if ( !this.IsNeedInvertOnActive ) {
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );
            }
            else {
                // slow method
                var _ctx = img1.getContext( "2d" );

                var _data = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );
                var _data2 = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );

                var _len = 4 * this.SizeW * this.SizeH;
                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255;// - _data.data[i];
                        _data.data[i + 1] = 255;// - _data.data[i + 1];
                        _data.data[i + 2] = 255;// - _data.data[i + 2];
                    }
                }

                _ctx.putImageData( _data, 0, 0 );
                ctx.drawImage( img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH );

                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255 - _data.data[i];
                        _data.data[i + 1] = 255 - _data.data[i + 1];
                        _data.data[i + 2] = 255 - _data.data[i + 2];
                    }
                }
                _ctx.putImageData( _data2, 0, 0 );

                _data = null;
                _data2 = null;
            }
            if ( this.IsDrawBorders ) {
                ctx.strokeStyle = this.ColorBorderActive;
                ctx.rect( x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH );
                ctx.stroke();
            }
            break;
        }
        default:{
            break;
        }
    }

    this.lastArrowStatus2 = mode;
};*/

function _HEXTORGB_( colorHEX ) {
    return {
        R:parseInt( colorHEX.substring( 1, 3 ), 16 ),
        G:parseInt( colorHEX.substring( 3, 5 ), 16 ),
        B:parseInt( colorHEX.substring( 5, 7 ), 16 )
    }
}

	/**
	 * @constructor
	 */
	function ScrollSettings() {
		this.showArrows = true;
		this.screenW = -1;
		this.screenH = -1;
		this.screenAddH = 0;
		this.contentH = undefined;
		this.contentW = undefined;
		this.scrollerMinHeight = 34;
		this.scrollerMaxHeight = 99999;
		this.scrollerMinWidth = 34;
		this.scrollerMaxWidth = 99999;
		this.initialDelay = 300;
		this.arrowRepeatFreq = 50;
		this.trackClickRepeatFreq = 70;
		this.scrollPagePercent = 1. / 8;
		this.arrowDim = 13;
		this.marginScroller = 4;
		this.scrollerColor = 241;
		this.scrollerColorOver = "#cfcfcf";
		this.scrollerColorLayerOver = "#cfcfcf";
		this.scrollerColorActive = "#ADADAD";
		this.scrollBackgroundColor = "#f4f4f4";
		this.scrollBackgroundColorHover = "#f4f4f4";
		this.scrollBackgroundColorActive = "#f4f4f4";
		this.strokeStyleNone = "#cfcfcf";
		this.strokeStyleOver = "#cfcfcf";
		this.strokeStyleActive = "#ADADAD";
		this.vscrollStep = 10;
		this.hscrollStep = 10;
		this.wheelScrollLines = 1;
		this.arrowColor = 173;
		this.arrowBorderColor = "#cfcfcf";
		this.arrowBackgroundColor = 241;
		this.arrowStableColor = "#ADADAD";
		this.arrowStableBorderColor = "#cfcfcf";
		this.arrowStableBackgroundColor = "#F1F1F1";
		this.arrowOverColor = "#f1f1f1";
		this.arrowOverBorderColor = "#cfcfcf";
		this.arrowOverBackgroundColor = "#cfcfcf";
		this.arrowActiveColor = "#f1f1f1";
		this.arrowActiveBorderColor = "#ADADAD";
		this.arrowActiveBackgroundColor = "#ADADAD";
		this.fadeInFadeOutDelay = 20;
		this.piperColor = "#cfcfcf";
		this.piperColorHover = "#f1f1f1";
		this.defaultColor = 241;
		this.hoverColor = 207;
		this.activeColor = 173;
		this.arrowSizeW = 13;
		this.arrowSizeH = 13;
		this.cornerRadius = 0;
		this.slimScroll = false;
		this.alwaysVisible = false;
		this.isNeedInvertOnActive = false;
        this.isVerticalScroll = true;
        this.isHorizontalScroll = false;
	}

	/**
	 * @constructor
	 */
	function ScrollObject( elemID, settings, dbg ) {
		if ( dbg )
			debug = dbg;
		this.that = this;

		this.settings = settings;
		this.ArrowDrawer = new CArrowDrawer( this.settings );

		this.mouseUp = false;
		this.mouseDown = false;

		this.that.mouseover = false;

		this.that.mouseOverOut = -1;

		this.scrollerMouseDown = false;
		// this.scrollerStatus = ScrollOverType.NONE;
		// this.lastScrollerStatus = this.scrollerStatus;
        this.animState = AnimationType.NONE;
        this.lastAnimState = this.animState;
        this.arrowState = ArrowType.NONE;

        this.isInit = false;

		this.moveble = false;
		this.lock = false;
		this.scrollTimeout = null;

		this.StartMousePosition = {x:0, y:0};
		this.EndMousePosition = {x:0, y:0};

		this.dragMinY = 0;
		this.dragMaxY = 0;

		this.scrollVCurrentY = 0;
		this.scrollHCurrentX = 0;
		this.arrowPosition = 0;

		this.verticalTrackHeight = 0;
		this.horizontalTrackWidth = 0;

		this.paneHeight = 0;
		this.paneWidth = 0;

		this.maxScrollY = 0;
		this.maxScrollX = 0;
		this.maxScrollY2 = 0;
		this.maxScrollX2 = 0;

		this.scrollCoeff = 0;

		this.scroller = {x:0, y:1, h:0, w:0};

		this.canvas = null;
		this.context = null;

		this.eventListeners = [];

		this.IsRetina = false;
		this.canvasW = 1;
		this.canvasH = 1;

		this.ScrollOverType1 = -1;
		this.ScrollOverType2 = -1;

		this.scrollColor = this.settings.scrollerColor;
		this.arrowBackColor = this.ArrowDrawer.ColorBackNone;
		this.arrowColor = this.settings.arrowColor;
		this.piperColor = 207;

        this.fadeTimeout = null;
		// this.startColorFadeInStart = _HEXTORGB_(this.settings.scrollerColor).R;
		// this.startColorFadeOutStart = _HEXTORGB_(this.settings.scrollerColorOver).R;
		this.startColorFadeInOutStart = -1;

		this.IsRetina = AscBrowser.isRetina;

		this.piperImgVert = document.createElement( 'canvas' );
		this.piperImgHor =  document.createElement( 'canvas' );

		this.piperImgVert.height = 13;
		this.piperImgVert.width = 5;

		this.piperImgHor.width = 13;
		this.piperImgHor.height = 5;

		this.disableCurrentScroll = false;

		if(this.settings.slimScroll){
			this.piperImgVert.width =
					this.piperImgHor.height = 3;
		}

		var r, g, b, ctx_piperImg, _data, px, k;
		r = _HEXTORGB_( this.settings.piperColor );
		g = r.G;
		b = r.B;
		r = r.R;

		k = this.piperImgVert.width * 4;

			ctx_piperImg = this.piperImgVert.getContext( '2d' );
			_data = ctx_piperImg.createImageData( this.piperImgVert.width, this.piperImgVert.height );
			px = _data.data;

			for ( var i = 0; i < this.piperImgVert.width * this.piperImgVert.height * 4; ) {
				px[i++] = r;
				px[i++] = g;
				px[i++] = b;
				px[i++] = 255;
				i = ( i % k === 0 ) ? i + k : i;
			}

			ctx_piperImg.putImageData( _data, 0, 0 );

			ctx_piperImg = this.piperImgHor.getContext( '2d' );

			_data = ctx_piperImg.createImageData( this.piperImgHor.width, this.piperImgHor.height );
			px = _data.data;

			for ( var i = 0; i < this.piperImgHor.width * this.piperImgHor.height * 4; ) {
				px[i++] = r;
				px[i++] = g;
				px[i++] = b;
				px[i++] = 255;
				i = ( i % 4 === 0 && i % 52 !== 0 ) ? i + 4 : i
			}

			ctx_piperImg.putImageData( _data, 0, 0 )

			r = _HEXTORGB_( this.settings.piperColorHover );
			g = r.G;
			b = r.B;
			r = r.R;

		this._init( elemID );
	}

	ScrollObject.prototype._init = function ( elemID ) {
		if ( !elemID ) return false;

		this.isInit = false;

		var holder = document.getElementById( elemID );

		if ( holder.getElementsByTagName( 'canvas' ).length == 0 ){
			this.canvas = holder.appendChild( document.createElement( "CANVAS" ) );
		}
		else {
			this.canvas = holder.children[1];
		}

		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

		this.canvas.that = this;
		this.canvas.style.zIndex = 100;
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0px";
		this.canvas.style["msTouchAction"] = "none";
		if ( navigator.userAgent.toLowerCase().indexOf( "webkit" ) != -1 ){
			this.canvas.style.webkitUserSelect = "none";
		}

		this.context = this.canvas.getContext( '2d' );
		if ( !this.IsRetina ){
			this.context.setTransform( 1, 0, 0, 1, 0, 0 );
		}
		else{
			this.context.setTransform( 2, 0, 0, 2, 0, 0 );
		}

		if ( this.settings.showArrows ){
			this.arrowPosition = this.settings.arrowDim + 2;
		}
		else{
			this.arrowPosition = this.settings.marginScroller;
		}

		this._setDimension( holder.clientHeight, holder.clientWidth );
		this.maxScrollY = this.maxScrollY2 = holder.firstElementChild.clientHeight - this.settings.screenH > 0 ? holder.firstElementChild.clientHeight - this.settings.screenH : 0;
		this.maxScrollX = this.maxScrollX2 = holder.firstElementChild.clientWidth - this.settings.screenW > 0 ? holder.firstElementChild.clientWidth - this.settings.screenW : 0;

		// this.isVerticalScroll = holder.firstElementChild.clientHeight / Math.max( this.canvasH, 1 ) > 1;
		// this.isHorizontalScroll = holder.firstElementChild.clientWidth / Math.max( this.canvasW, 1 ) > 1;

		this._setScrollerHW();

		this.paneHeight = this.canvasH - this.arrowPosition * 2;
		this.paneWidth = this.canvasW - this.arrowPosition * 2;

		this.RecalcScroller();

		AscCommon.addMouseEvent(this.canvas, "down", this.evt_mousedown);
        AscCommon.addMouseEvent(this.canvas, "move", this.evt_mousemove);
        AscCommon.addMouseEvent(this.canvas, "up", this.evt_mouseup);
        AscCommon.addMouseEvent(this.canvas, "over", this.evt_mouseover);
        AscCommon.addMouseEvent(this.canvas, "out", this.evt_mouseout);
        this.canvas.onmousewheel = this.evt_mousewheel;

		var _that = this;
		this.canvas.ontouchstart = function ( e ) {
			_that.evt_mousedown( e.touches[0] );
			return false;
		};
		this.canvas.ontouchmove = function ( e ) {
			_that.evt_mousemove( e.touches[0] );
			return false;
		};
		this.canvas.ontouchend = function ( e ) {
			_that.evt_mouseup( e.changedTouches[0] );
			return false;
		};

		if ( this.canvas.addEventListener ){
			this.canvas.addEventListener( 'DOMMouseScroll', this.evt_mousewheel, false );
		}

		this.context.fillStyle = this.settings.scrollBackgroundColor;
		this.context.fillRect(0,0,this.canvasW,this.canvasH);

		// this._drawArrow();
		this._draw();

		return true;
	};
    ScrollObject.prototype.disableCurrentScroll = function() {
        this.disableCurrentScroll = true;
    };
	ScrollObject.prototype.checkDisableCurrentScroll = function() {
        var ret = this.disableCurrentScroll;
        this.disableCurrentScroll = false;
        return ret;
    };
	ScrollObject.prototype.getMousePosition = function ( evt ) {
		// get canvas position
		var obj = this.canvas;
		var top = 0;
		var left = 0;
		while ( obj && obj.tagName != 'BODY' ) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}

		// return relative mouse position
		var mouseX = ((evt.clientX * AscBrowser.zoom) >> 0) - left + window.pageXOffset;
		var mouseY = ((evt.clientY * AscBrowser.zoom) >> 0) - top + window.pageYOffset;

		return {
			x:mouseX,
			y:mouseY
		};
	};
	ScrollObject.prototype.RecalcScroller = function ( startpos ) {
		if ( this.settings.isVerticalScroll ) {
			if ( this.settings.showArrows ) {
				this.verticalTrackHeight = this.canvasH - this.arrowPosition * 2;
				this.scroller.y = this.arrowPosition;
			}
			else {
				this.verticalTrackHeight = this.canvasH;
				this.scroller.y = 1;
			}
			var percentInViewV;

			percentInViewV = (this.maxScrollY + this.paneHeight ) / this.paneHeight;
			this.scroller.h = Math.ceil( 1 / percentInViewV * this.verticalTrackHeight );

			if ( this.scroller.h < this.settings.scrollerMinHeight )
				this.scroller.h = this.settings.scrollerMinHeight;
			else if ( this.scroller.h > this.settings.scrollerMaxHeight )
				this.scroller.h = this.settings.scrollerMaxHeight;
			this.scrollCoeff = this.maxScrollY / Math.max( 1, this.paneHeight - this.scroller.h );
			if ( startpos ) {
				this.scroller.y = startpos / this.scrollCoeff + this.arrowPosition;
			}
			this.dragMaxY = this.canvasH - this.arrowPosition - this.scroller.h + 1;
			this.dragMinY = this.arrowPosition;
		}

		if ( this.settings.isHorizontalScroll ) {
			if ( this.settings.showArrows ) {
				this.horizontalTrackWidth = this.canvasW - this.arrowPosition * 2;
				this.scroller.x = this.arrowPosition + 1;
			}
			else {
				this.horizontalTrackWidth = this.canvasW;
				this.scroller.x = 1;
			}
			var percentInViewH;
			percentInViewH = ( this.maxScrollX + this.paneWidth ) / this.paneWidth;
			this.scroller.w = Math.ceil( 1 / percentInViewH * this.horizontalTrackWidth );

			if ( this.scroller.w < this.settings.scrollerMinWidth )
				this.scroller.w = this.settings.scrollerMinWidth;
			else if ( this.scroller.w > this.settings.scrollerMaxWidth )
				this.scroller.w = this.settings.scrollerMaxWidth;
			this.scrollCoeff = this.maxScrollX / Math.max( 1, this.paneWidth - this.scroller.w );
			if ( typeof startpos !== "undefined" ) {
				this.scroller.x = startpos / this.scrollCoeff + this.arrowPosition;
			}
			this.dragMaxX = this.canvasW - this.arrowPosition - this.scroller.w;
			this.dragMinX = this.arrowPosition;
		}
	};
	ScrollObject.prototype.Repos = function ( settings, bIsHorAttack, bIsVerAttack ) {
		if (this.IsRetina != AscBrowser.isRetina)
		{
			this.IsRetina = AscBrowser.isRetina;
			this.ArrowDrawer.InitSize(this.settings.arrowSizeH, this.settings.arrowSizeW, this.IsRetina);
		}

		if (bIsVerAttack)
		{
			var _canvasH = settings.screenH;
			if (undefined !== _canvasH && settings.screenAddH)
				_canvasH += settings.screenAddH;

			if (_canvasH == this.canvasH && undefined !== settings.contentH)
			{
				var _maxScrollY = settings.contentH - settings.screenH > 0 ? settings.contentH - settings.screenH : 0;
				if (_maxScrollY == this.maxScrollY)
					return;
			}
		}
		if (bIsHorAttack)
		{
			if (settings.screenW == this.canvasW && undefined !== settings.contentW)
			{
				var _maxScrollX = settings.contentW - settings.screenW > 0 ? settings.contentW - settings.screenW : 0;
				if (_maxScrollX == this.maxScrollX)
					return;
			}
		}

		var _parentClientW = GetClientWidth( this.canvas.parentNode );
		var _parentClientH = GetClientHeight( this.canvas.parentNode );

		var _firstChildW = 0;
        var _firstChildH = 0;
        if (this.canvas.parentNode)
        {
            _firstChildW = GetClientWidth(this.canvas.parentNode.firstElementChild);
            _firstChildH = GetClientHeight(this.canvas.parentNode.firstElementChild);
        }

		this._setDimension( _parentClientH, _parentClientW );
		this.maxScrollY = this.maxScrollY2 = _firstChildH - settings.screenH > 0 ? _firstChildH - settings.screenH : 0;
		this.maxScrollX = this.maxScrollX2 = _firstChildW - settings.screenW > 0 ? _firstChildW - settings.screenW : 0;

		this.settings.isVerticalScroll = _firstChildH / Math.max( this.canvasH, 1 ) > 1 || this.settings.isVerticalScroll || (true === bIsVerAttack);
		this.settings.isHorizontalScroll = _firstChildW / Math.max( this.canvasW, 1 ) > 1 || this.settings.isHorizontalScroll || (true === bIsHorAttack);
		this._setScrollerHW();

		this.paneHeight = this.canvasH - this.arrowPosition * 2;
		this.paneWidth = this.canvasW - this.arrowPosition * 2;
		this.RecalcScroller();
		if ( this.settings.isVerticalScroll && !this.settings.alwaysVisible) {

			if (this.scrollVCurrentY > this.maxScrollY)
				this.scrollVCurrentY = this.maxScrollY;

			this.scrollToY( this.scrollVCurrentY );
			if(this.maxScrollY == 0){
				this.canvas.style.display = "none";
			}
			else{
				this.canvas.style.display = "";
			}
		}
		else if ( this.settings.isHorizontalScroll ) {

			if (this.scrollHCurrentX > this.maxScrollX)
				this.scrollHCurrentX = this.maxScrollX;

			this.scrollToX( this.scrollHCurrentX );
			if(this.maxScrollX == 0 && !this.settings.alwaysVisible){
				this.canvas.style.display = "none";
			}
			else{
				this.canvas.style.display = "";
			}
		}

		// this._drawArrow();
		this._draw();
	};
	ScrollObject.prototype.Reinit = function ( settings, pos ) {
	    var size;
		this._setDimension( this.canvas.parentNode.clientHeight, this.canvas.parentNode.clientWidth );

		size = this.canvas.parentNode.firstElementChild.clientHeight - (settings.screenH || this.canvas.parentNode.offsetHeight);
		this.maxScrollY = this.maxScrollY2 = 0 < size ? size : 0;

		size = this.canvas.parentNode.firstElementChild.clientWidth - (settings.screenH || this.canvas.parentNode.offsetWidth);
		this.maxScrollX = this.maxScrollX2 = 0 < size ? size : 0;

		this.settings.isVerticalScroll = this.canvas.parentNode.firstElementChild.clientHeight / Math.max( this.canvasH, 1 ) > 1 || this.settings.isVerticalScroll;
		this.settings.isHorizontalScroll = this.canvas.parentNode.firstElementChild.clientWidth / Math.max( this.canvasW, 1 ) > 1 || this.settings.isHorizontalScroll;
		this._setScrollerHW();

		this.paneHeight = this.canvasH - this.arrowPosition * 2;
		this.paneWidth = this.canvasW - this.arrowPosition * 2;
		this.RecalcScroller();
		this.reinit = true;
		if ( this.settings.isVerticalScroll ) {
			pos !== undefined ? this.scrollByY( pos - this.scrollVCurrentY ) : this.scrollToY( this.scrollVCurrentY );
		}

		if ( this.settings.isHorizontalScroll ) {
			pos !== undefined ? this.scrollByX( pos - this.scrollHCurrentX ) : this.scrollToX( this.scrollHCurrentX );
		}
		this.reinit = false;
		// this._drawArrow();
		this._draw();
	};
	ScrollObject.prototype._scrollV = function ( that, evt, pos, isTop, isBottom, bIsAttack ) {
		if ( !this.settings.isVerticalScroll ) {
			return;
		}

		if ( that.scrollVCurrentY !== pos || bIsAttack === true ) {
            var oldPos = that.scrollVCurrentY;
		    that.scrollVCurrentY = pos;
		    evt.scrollD = evt.scrollPositionY = that.scrollVCurrentY;
			evt.maxScrollY = that.maxScrollY;
			that.handleEvents( "onscrollvertical", evt );
			if (that.checkDisableCurrentScroll()) {
			    // prevented...
                that.scrollVCurrentY = oldPos;
                return;
            }
            that._draw();
		}
		else if ( that.scrollVCurrentY === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock ) {
			evt.pos = pos;
			that.handleEvents( "onscrollVEnd", evt );
		}
	};
	ScrollObject.prototype._correctScrollV = function ( that, yPos ) {
		if ( !this.settings.isVerticalScroll )
			return null;

		var events = that.eventListeners["oncorrectVerticalScroll"];
		if ( events ) {
			if ( events.length != 1 )
				return null;

			return events[0].handler.apply( that, [yPos] );
		}
		return null;
	};
	ScrollObject.prototype._correctScrollByYDelta = function ( that, delta ) {
		if ( !this.settings.isVerticalScroll )
			return null;

		var events = that.eventListeners["oncorrectVerticalScrollDelta"];
		if ( events ) {
			if ( events.length != 1 )
				return null;

			return events[0].handler.apply( that, [delta] );
		}
		return null;
	};
	ScrollObject.prototype._scrollH = function ( that, evt, pos, isTop, isBottom ) {
		if ( !this.settings.isHorizontalScroll ) {
			return;
		}
		if ( that.scrollHCurrentX !== pos ) {
			that.scrollHCurrentX = pos;
			evt.scrollD = evt.scrollPositionX = that.scrollHCurrentX;
			evt.maxScrollX = that.maxScrollX;

//            that._drawArrow();
			that._draw();
			that.handleEvents( "onscrollhorizontal", evt );
		}
		else if ( that.scrollHCurrentX === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock ) {
			evt.pos = pos;
			that.handleEvents( "onscrollHEnd", evt );
		}

	};
	ScrollObject.prototype.scrollByY = function ( delta, bIsAttack ) {
		if ( !this.settings.isVerticalScroll ) {
			return;
		}

		var result = this._correctScrollByYDelta( this, delta );
		if ( result != null && result.isChange === true )
			delta = result.Pos;

		var destY = this.scrollVCurrentY + delta, isTop = false, isBottom = false, vend = false;

		if ( destY < 0 ) {
			destY = 0;
			isTop = true;
			isBottom = false;
		}
		else if ( destY > this.maxScrollY2 ) {
			this.handleEvents( "onscrollVEnd", destY - this.maxScrollY );
			vend = true;
			destY = this.maxScrollY2;
			isTop = false;
			isBottom = true;
		}

		this.scroller.y = destY / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
		if ( this.scroller.y < this.dragMinY )
			this.scroller.y = this.dragMinY + 1;
		else if ( this.scroller.y > this.dragMaxY )
			this.scroller.y = this.dragMaxY;

		var arrow = this.settings.showArrows ? this.arrowPosition : 0;
		if ( this.scroller.y + this.scroller.h > this.canvasH - arrow ) {
			this.scroller.y -= Math.abs( this.canvasH - arrow - this.scroller.y - this.scroller.h );
		}

		this.scroller.y = Math.round(this.scroller.y);

		if ( vend ) {
			this.moveble = true;
		}
		this._scrollV( this, {}, destY, isTop, isBottom);
		if ( vend ) {
			this.moveble = false;
		}
	};
	ScrollObject.prototype.scrollToY = function ( destY ) {
		if ( !this.settings.isVerticalScroll ) {
			return;
		}

		this.scroller.y = destY / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
		if ( this.scroller.y < this.dragMinY )
			this.scroller.y = this.dragMinY + 1;
		else if ( this.scroller.y > this.dragMaxY )
			this.scroller.y = this.dragMaxY;

		var arrow = this.settings.showArrows ? this.arrowPosition : 0;
		if ( this.scroller.y + this.scroller.h > this.canvasH - arrow ) {
			this.scroller.y -= Math.abs( this.canvasH - arrow - this.scroller.y - this.scroller.h );
		}

		this.scroller.y = Math.round(this.scroller.y);

		this._scrollV( this, {}, destY, false, false );
	};
	ScrollObject.prototype.scrollByX = function ( delta ) {
		if ( !this.settings.isHorizontalScroll ) {
			return;
		}
		var destX = this.scrollHCurrentX + delta, isTop = false, isBottom = false, hend = false;

		if ( destX < 0 ) {
			destX = 0;
			isTop = true;
			isBottom = false;
		}
		else if ( destX > this.maxScrollX2 ) {
			this.handleEvents( "onscrollHEnd", destX - this.maxScrollX );
			hend = true;
			destX = this.maxScrollX2;
			isTop = false;
			isBottom = true;
		}

		this.scroller.x = destX / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
		if ( this.scroller.x < this.dragMinX )
			this.scroller.x = this.dragMinX + 1;
		else if ( this.scroller.x > this.dragMaxX )
			this.scroller.x = this.dragMaxX;

		var arrow = this.settings.showArrows ? this.arrowPosition : 0;
		if ( this.scroller.x + this.scroller.w > this.canvasW - arrow ) {
			this.scroller.x -= Math.abs( this.canvasW - arrow - this.scroller.x - this.scroller.w );
		}

		this.scroller.x = Math.round(this.scroller.x);

		if ( hend ) {
			this.moveble = true;
		}
		this._scrollH( this, {}, destX, isTop, isBottom );
		if ( hend ) {
			this.moveble = true;
		}
	};
	ScrollObject.prototype.scrollToX = function ( destX ) {
		if ( !this.settings.isHorizontalScroll ) {
			return;
		}

		this.scroller.x = destX / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
		if ( this.scroller.x < this.dragMinX )
			this.scroller.x = this.dragMinX + 1;
		else if ( this.scroller.x > this.dragMaxX )
			this.scroller.x = this.dragMaxX;

		var arrow = this.settings.showArrows ? this.arrowPosition : 0;
		if ( this.scroller.x + this.scroller.w > this.canvasW - arrow ) {
			this.scroller.x -= Math.abs( this.canvasW - arrow - this.scroller.x - this.scroller.w );
		}

		this.scroller.x = Math.round(this.scroller.x);

		this._scrollH( this, {}, destX, false, false );
	};
	ScrollObject.prototype.scrollTo = function ( destX, destY ) {
		this.scrollToX( destX );
		this.scrollToY( destY );
	};
	ScrollObject.prototype.scrollBy = function ( deltaX, deltaY ) {
		this.scrollByX( deltaX );
		this.scrollByY( deltaY );
	};

	ScrollObject.prototype.roundRect = function ( x, y, width, height, radius ) {
		if ( typeof radius === "undefined" ) {
			radius = 1;
		}
		this.context.beginPath();
		this.context.moveTo( x + radius, y );
		this.context.lineTo( x + width - radius, y );
		this.context.quadraticCurveTo( x + width, y, x + width, y + radius );
		this.context.lineTo( x + width, y + height - radius );
		this.context.quadraticCurveTo( x + width, y + height, x + width - radius, y + height );
		this.context.lineTo( x + radius, y + height );
		this.context.quadraticCurveTo( x, y + height, x, y + height - radius );
		this.context.lineTo( x, y + radius );
		this.context.quadraticCurveTo( x, y, x + radius, y );
		this.context.closePath();
	};

	ScrollObject.prototype._clearContent = function () {
		this.context.clearRect( 0, 0, this.canvasW, this.canvasH );
	};

    ScrollObject.prototype._drawArrows = function() {
        var t = this.ArrowDrawer;
        var that = this;
        // var img = that.settings.isVerticalScroll ? t.ImageTop[AnimationType.NONE] : t.ImageLeft[AnimationType.NONE];

        var xDeltaIMG = 0, yDeltaIMG = 0, xDeltaBORDER = 0.5, yDeltaBORDER = 1.5;
        var x1 = that.settings.isVerticalScroll ? 0 : 1;
        var y1 = that.settings.isVerticalScroll ? 0 : -1;
        var strokeW = t.SizeW - 1;
        var strokeH = t.SizeH - 1;
		var cnvs = that.canvas,
			ctx = cnvs.getContext('2d');
        // var ctx = that.context;
        ctx.beginPath();
        ctx.fillStyle = t.ColorBackNone;
        var bottomRightDelta = 1;
        var arrowImage = that.ArrowDrawer.ImageTop;
        if(that.settings.isVerticalScroll) {
			for (var i = 0; i < 2; i++) {
				ctx.fillRect(x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH);

				if (t.IsDrawBorders) {
					ctx.strokeStyle = t.ColorBorderNone;
					ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
					ctx.stroke();
				}

                that.context.drawImage(arrowImage, x1, y1);
                y1 = that.canvasH - t.SizeH - bottomRightDelta - 1;
                arrowImage = that.ArrowDrawer.ImageBottom;
			}
		}

        var arrowImage = that.ArrowDrawer.ImageLeft;

        if(that.settings.isHorizontalScroll) {
            for(var i = 0; i < 2; i++) {
                ctx.fillRect(x1 + xDeltaBORDER >> 0, y1 + yDeltaBORDER >> 0, strokeW, strokeH);

                if (t.IsDrawBorders) {
                    ctx.strokeStyle = t.ColorBorderNone;
                    ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                    ctx.stroke();
                }

                that.context.drawImage(arrowImage, x1, y1);
                x1 = that.canvasW - t.SizeW - bottomRightDelta;
                arrowImage = that.ArrowDrawer.ImageRight;
            }
        }
    }

    ScrollObject.prototype._drawScroll = function(fillColor, piperColor) {
        var that = this;
        that.context.beginPath();

        if ( that.settings.isVerticalScroll ) {
            var _y = that.settings.showArrows ? that.arrowPosition : 0,
                _h = that.canvasH - (_y << 1);

            if ( _h > 0 ) {
                that.context.rect( 0, _y, that.canvasW, _h );
            }
        }
        else if ( that.settings.isHorizontalScroll ) {
            var _x = that.settings.showArrows ? that.arrowPosition : 0,
                _w = that.canvasW - (_x << 1);

            if ( _w > 0 ) {
                that.context.rect( _x, 0, _w, that.canvasH );
            }
        }

        switch ( that.animState ) {

            case AnimationType.SCROLL_HOVER:
            {
                that.context.fillStyle = that.settings.scrollBackgroundColorHover;
                break;
            }
            case AnimationType.SCROLL_ACTIVE:
            {
                that.context.fillStyle = that.settings.scrollBackgroundColorActive;
                break;
            }
            case AnimationType.NONE:
            default:
            {
                that.context.fillStyle = that.settings.scrollBackgroundColor;
                that.context.strokeStyle = that.settings.strokeStyleNone;
                break;
            }

        }

        that.context.fill();
        that.context.beginPath();

        if ( that.settings.isVerticalScroll && that.maxScrollY != 0 ) {
            var _y = that.scroller.y >> 0, arrow = that.settings.showArrows ? that.arrowPosition : 0;
            if ( _y < arrow ) {
                _y = arrow;
            }
            var _b = Math.round(that.scroller.y + that.scroller.h);// >> 0;
            if ( _b > (that.canvasH - arrow - 1) ) {
                _b = that.canvasH - arrow - 1;
            }

            if ( _b > _y ) {
                that.roundRect( that.scroller.x - 0.5, _y + 0.5, that.scroller.w - 1, that.scroller.h - 1, that.settings.cornerRadius );
            }
        }
        else if ( that.settings.isHorizontalScroll && that.maxScrollX != 0 ) {
            var _x = that.scroller.x >> 0, arrow = that.settings.showArrows ? that.arrowPosition : 0;
            if ( _x < arrow ) {
                _x = arrow;
            }
            var _r = (that.scroller.x + that.scroller.w) >> 0;
            if ( _r > (that.canvasW - arrow - 2) ) {
                _r = that.canvasW - arrow - 1;
            }

            if ( _r > _x ) {
                that.roundRect( _x + 0.5, that.scroller.y - 0.5, that.scroller.w - 1, that.scroller.h - 1, that.settings.cornerRadius );
            }
        }

		that.context.fillStyle =  "rgb(" + fillColor + "," + fillColor + "," + fillColor + ")";
		that.context.strokeStyle = fillColor === 173 ? "rgb(" + 173 + "," + 173 + "," + 173 + ")" : this.settings.strokeStyleOver;

		that.context.fill();
		that.context.stroke();

       var ctx_piperImg, _data, px, img, x, y;

       if ( that._checkPiperImagesV() ) {

           x = that.scroller.x + (that.settings.slimScroll ? 2 : 3);
           y = (that.scroller.y >> 0) + Math.floor( that.scroller.h / 2 ) - 6;

           ctx_piperImg = that.piperImgVert.getContext( '2d' );
           ctx_piperImg.globalCompositeOperation = "source-in";
           ctx_piperImg.fillStyle = "rgb(" + piperColor + "," +
               piperColor + "," +
               piperColor + ")";
           ctx_piperImg.fillRect(0, 0, that.scroller.w - 1, that.scroller.h - 1);

           img = that.piperImgVert;
       }
       else if ( that._checkPiperImagesH() ) {
           x = (that.scroller.x >> 0) + Math.floor( that.scroller.w / 2 ) - 6;
           y = that.scroller.y + 3;

           ctx_piperImg = that.piperImgHor.getContext( '2d' );
           _data = ctx_piperImg.getImageData( 0, 0, that.piperImgHor.width, that.piperImgHor.height );
           px = _data.data;

           ctx_piperImg = that.piperImgHor.getContext( '2d' );
           ctx_piperImg.globalCompositeOperation = "source-in";
           ctx_piperImg.fillStyle = "rgb(" + that.piperColor + "," +
               that.piperColor + "," +
               that.piperColor + ")";
           ctx_piperImg.fillRect(0, 0, that.scroller.w - 1,  that.scroller.h - 1);

           img = that.piperImgHor;
       }

       if(img)
       that.context.drawImage( img, x, y );
   }

   ScrollObject.prototype._animateArrow = function(fadeIn, backgroundColorUnfade) {

       var xDeltaIMG = 0, yDeltaIMG = 0, cnvs = document.createElement( 'canvas' ), that = this,
       ctx = cnvs.getContext('2d'), context = that.context, bottomRightDelta = 1,
       hoverColor = that.settings.hoverColor, defaultColor = that.settings.defaultColor, activeColor = that.settings.activeColor;
       cnvs.width = that.ArrowDrawer.SizeNaturalW;
       cnvs.height = that.ArrowDrawer.SizeNaturalH;
       ctx.fillStyle = that.ArrowDrawer.ColorBackActive;

       if (fadeIn) {
           if(that.arrowBackColor > hoverColor )
               that.arrowBackColor -= 2;

           if(that.arrowColor < defaultColor)
           that.arrowColor += 4;

           console.log(that.arrowColor + " arrowIN");

       } else if (fadeIn === false) {
           if(that.arrowBackColor < defaultColor )
               that.arrowBackColor += 2;

           if(that.arrowColor > activeColor )
           that.arrowColor -= 4;
           console.log(that.arrowColor + " arrowOUT");
       } else {
           that.arrowBackColor = backgroundColorUnfade;
           that.arrowColor = backgroundColorUnfade === defaultColor ? activeColor : defaultColor;
           that.activeColor = activeColor;
       }

       ctx.fillStyle = "rgb(" + that.arrowBackColor + "," +
           that.arrowBackColor + "," +
           that.arrowBackColor + ")";

       var x = 0, y = 0, arrowImage = that.ArrowDrawer.ImageTop;

       if (that.arrowState === ArrowType.ARROW_BOTTOM || that.arrowState === ArrowType.ARROW_BOTTOM) {
           y = that.canvasH - that.ArrowDrawer.SizeH - bottomRightDelta - 1;
           arrowImage = that.ArrowDrawer.ImageBottom;
       } else
       if (that.arrowState === ArrowType.ARROW_RIGHT || that.arrowState === ArrowType.ARROW_RIGHT) {
           y = -1;
           x = 1;
           x = that.canvasW - that.ArrowDrawer.SizeW - bottomRightDelta;
           arrowImage = that.ArrowDrawer.ImageRight;
       } else
       if (that.arrowState === ArrowType.ARROW_LEFT || that.arrowState === ArrowType.ARROW_LEFT) {
           y = -1;
           x = 1;
           arrowImage = that.ArrowDrawer.ImageLeft;
       }

       ctx.rect( 0.5,  1.5, that.ArrowDrawer.SizeW - 1, that.ArrowDrawer.SizeH - 1);
       ctx.fill();

       if (that.ArrowDrawer.IsDrawBorders) {
           var borderColor = hoverColor;

           if(backgroundColorUnfade === activeColor) {
               borderColor = activeColor;
           }

           ctx.strokeStyle = "rgb(" + borderColor  + "," +
               borderColor  + "," +
               borderColor  + ")";
           ctx.stroke();
       }

       var imgContext = arrowImage.getContext('2d');
       imgContext.globalCompositeOperation = "source-in";
       imgContext.fillStyle = "rgb(" + that.arrowColor + "," +
           that.arrowColor + "," +
           that.arrowColor + ")";
       imgContext.fillRect(0.5, 1.5, that.ArrowDrawer.SizeW - 1, that.ArrowDrawer.SizeH - 1);
       ctx.drawImage(arrowImage, xDeltaIMG, yDeltaIMG, that.ArrowDrawer.SizeW, that.ArrowDrawer.SizeH);

       context.drawImage(cnvs, x + xDeltaIMG, y + yDeltaIMG, that.ArrowDrawer.SizeW, that.ArrowDrawer.SizeH);
   }

   ScrollObject.prototype._animateScroll = function(fadeIn, fillColor) {
       var that = this, hoverColor = that.settings.hoverColor,
           defaultColor = that.settings.defaultColor, activeColor = that.settings.activeColor;

       that.context.beginPath();

       that._drawScroll(that.scrollColor, that.piperColor);


       if((fadeIn && that.scrollColor <= 207 && that.piperColor >= 241) || (!fadeIn && that.scrollColor >= 241 && that.piperColor <= 207)) {
           return;
       }
       if(fadeIn) {
           that.scrollColor -= 2;
           that.piperColor += 2;
       }else if(fadeIn === false) {
           that.scrollColor += 2;
           that.piperColor -= 2;
       } else {
          that.scrollColor = fillColor;
          if(that.scrollColor === defaultColor) {
              that.piperColor = hoverColor;
          } else if(that.scrollColor === hoverColor || that.scrollColor === activeColor) {
              that.piperColor = defaultColor
          }
       }
	}
    ScrollObject.prototype._doAnimation = function (lastAnimState) {
		var that = this,
		hoverColor = 207, defaultColor = 241, activeColor = 173;
        if(that.animState === AnimationType.NONE &&  lastAnimState === AnimationType.NONE) {
            that._animateScroll(defaultColor);
            return;
        } else
        if (that.animState === AnimationType.ARROW_HOVER && lastAnimState === AnimationType.NONE) {
			that._animateArrow(true, this.arrowState);
			that._animateScroll(true);
			if (that.scrollColor <= hoverColor && that.arrowBackColor <= hoverColor && that.arrowColor >= 241) {
				return;
			}
		}
		else
		if (that.animState === AnimationType.SCROLL_HOVER && lastAnimState === AnimationType.NONE) {
			that._animateScroll(true);
			if (that.scrollColor <= hoverColor) {
				return;
			}
		}
		else
		if (that.animState === AnimationType.NONE && lastAnimState === AnimationType.ARROW_HOVER) {
			that._animateArrow( false, that.arrowState);
			that._animateScroll(false);
			if (that.scrollColor >= defaultColor && that.arrowBackColor >= defaultColor && that.arrowColor <= activeColor) {
				return;
			}
		}
		else
		if (that.animState === AnimationType.SCROLL_HOVER && lastAnimState === AnimationType.ARROW_HOVER) {
			that._animateArrow(false);
			that._animateScroll(true);
			if (that.scrollColor <= hoverColor && that.arrowBackColor >= defaultColor) {
				return;
			}
		}
		else
		if (that.animState === AnimationType.NONE && lastAnimState === AnimationType.SCROLL_HOVER) {
            if(that.arrowBackColor < defaultColor)
			that._animateArrow(false);

			that._animateScroll(false);
			if (that.scrollColor >= defaultColor && that.arrowBackColor >= defaultColor && that.arrowColor <= activeColor) {
				return;
			}
		}
		else
		if (that.animState === AnimationType.ARROW_HOVER && lastAnimState === AnimationType.SCROLL_HOVER) {
			that._animateArrow( true);
			that._animateScroll(true);
			if (that.scrollColor <= hoverColor && that.arrowBackColor <= hoverColor) {
				return;
			}
		}
		else
		if (this.animState === AnimationType.SCROLL_HOVER && lastAnimState === AnimationType.SCROLL_ACTIVE) {
		    that._animateArrow(false);
            that._drawScroll(hoverColor, defaultColor);

            if(that.arrowBackColor >= defaultColor) {
                return;
            }
		}
		else
        if (this.animState === AnimationType.ARROW_ACTIVE) {

            that._animateScroll(true);
			if(lastAnimState !== AnimationType.ARROW_ACTIVE)
            that._animateArrow(undefined, activeColor);
            if (that.scrollColor <= hoverColor) {
                return;
            }
        }
        else
        if (this.animState === AnimationType.ARROW_HOVER && lastAnimState === AnimationType.ARROW_ACTIVE) {
            that._animateArrow(undefined, hoverColor);
            that._animateScroll(true);
            return;
        }
        else
        if (this.animState === AnimationType.NONE && lastAnimState === AnimationType.ARROW_ACTIVE) {
			that._animateArrow(undefined, defaultColor);
			that._animateScroll(false);

			if (that.scrollColor >= defaultColor)
				return;
			
		}
        else
		if (this.animState === AnimationType.ARROW_HOVER && lastAnimState === AnimationType.SCROLL_ACTIVE) {
			that._animateArrow(true);
			if(that.arrowBackColor <= hoverColor) {
			    return;
            }
		}
        else
        if (this.animState === AnimationType.SCROLL_ACTIVE) {

            if(that.arrowBackColor < defaultColor)
            that._animateArrow(false);

            that._drawScroll(activeColor, defaultColor);
			if (that.arrowBackColor >= defaultColor) {
				return;
			}
        }
		else return;

		that.fadeTimeout = setTimeout(function () {that._doAnimation(lastAnimState)}, that.settings.fadeInFadeOutDelay);
    }

    ScrollObject.prototype._draw = function () {

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

        if (!this.isInit && this.settings.showArrows) {
            this._drawArrows();
            this.isInit = true;
        }

        this._doAnimation(this.lastAnimState, this.arrowState);
        this.lastAnimState = this.animState;
	};

	ScrollObject.prototype._checkPiperImagesV = function() {
		if ( this.settings.isVerticalScroll && this.maxScrollY != 0 && this.scroller.h >= 13 )
			return true;
		return false;
	};
	ScrollObject.prototype._checkPiperImagesH = function() {
		if ( this.settings.isHorizontalScroll && this.maxScrollX != 0 && this.scroller.w >= 13 )
			return true;
		return false;
	};

	/*ScrollObject.prototype._drawArrow = function ( type ) {
		if ( this.settings.showArrows ) {
			var w = this.canvasW;
			var h = this.canvasH;
			if ( this.settings.isVerticalScroll ) {
				switch ( type ) {
					case ArrowStatus.upLeftArrowHover_downRightArrowNonActive://upArrow mouse hover, downArrow stable
						if ( ScrollOverType.OVER != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.OVER, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.OVER;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h );
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					case ArrowStatus.upLeftArrowActive_downRightArrowNonActive://upArrow mouse down, downArrow stable
						if ( ScrollOverType.ACTIVE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.ACTIVE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.ACTIVE;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					case ArrowStatus.upLeftArrowNonActive_downRightArrowHover://upArrow stable, downArrow mouse hover
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.OVER != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.OVER, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.OVER;
						}
						break;
					case ArrowStatus.upLeftArrowNonActive_downRightArrowActive://upArrow stable, downArrow mouse down
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.ACTIVE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.ACTIVE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.ACTIVE;
						}
						break;
					case ArrowStatus.arrowHover://upArrow stable, downArrow mouse down
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					default ://upArrow stable, downArrow stable
						if ( ScrollOverType.NONE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.NONE;
						}
						if ( ScrollOverType.NONE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.NONE;
						}
						break;
				}
			}
			if ( this.settings.isHorizontalScroll ) {
				switch ( type ) {
					case ArrowStatus.upLeftArrowHover_downRightArrowNonActive://leftArrow mouse hover, rightArrow stable
						if ( ScrollOverType.OVER != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.OVER, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.OVER;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					case ArrowStatus.upLeftArrowActive_downRightArrowNonActive://leftArrow mouse down, rightArrow stable
						if ( ScrollOverType.ACTIVE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.ACTIVE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.ACTIVE;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
//                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h );
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					case ArrowStatus.upLeftArrowNonActive_downRightArrowHover://leftArrow stable, rightArrow mouse hover
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.OVER != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.OVER, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.OVER;
						}
						break;
					case ArrowStatus.upLeftArrowNonActive_downRightArrowActive://leftArrow stable, rightArrow mouse down
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.ACTIVE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.ACTIVE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.ACTIVE;
						}
						break;
					case ArrowStatus.arrowHover://upArrow stable, downArrow mouse down
						if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.STABLE;
						}
						if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.STABLE;
						}
						break;
					default ://leftArrow stable, rightArrow stable
						if ( ScrollOverType.NONE != this.ScrollOverType1 ) {
							this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h);
							this.ScrollOverType1 = ScrollOverType.NONE;
						}
						if ( ScrollOverType.NONE != this.ScrollOverType2 ) {
							this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h);
							this.ScrollOverType2 = ScrollOverType.NONE;
						}
						break;
				}
			}
		}
	};*/

	ScrollObject.prototype._setDimension = function ( h, w ) {

		if ( w == this.canvasW && h == this.canvasH )
			return;

		this.ScrollOverType1 = -1;
		this.ScrollOverType2 = -1;

		this.canvasW = w;
		this.canvasH = h;

		if ( !this.IsRetina ) {
			this.canvas.height = h;
			this.canvas.width = w;

			this.context.setTransform( 1, 0, 0, 1, 0, 0 );
		}
		else {
			this.canvas.height = h << 1;
			this.canvas.width = w << 1;

			this.context.setTransform( 2, 0, 0, 2, 0, 0 );
		}
	};
	ScrollObject.prototype._setScrollerHW = function () {
		if ( this.settings.isVerticalScroll ) {
			this.scroller.x = 1;//0;
			this.scroller.w = this.canvasW - 1;
			if ( this.settings.showArrows )
				this.ArrowDrawer.InitSize( this.settings.arrowSizeW, this.settings.arrowSizeH, this.IsRetina );
		}
		else if ( this.settings.isHorizontalScroll ) {
			this.scroller.y = 1;//0;
			this.scroller.h = this.canvasH - 1;
			if ( this.settings.showArrows )
				this.ArrowDrawer.InitSize( this.settings.arrowSizeH, this.settings.arrowSizeW, this.IsRetina );
		}
	};
	ScrollObject.prototype._MouseHoverOnScroller = function ( mp ) {
		if ( mp.x >= this.scroller.x && mp.x <= this.scroller.x + this.scroller.w &&
			mp.y >= this.scroller.y && mp.y <= this.scroller.y + this.scroller.h ) {
			return true;
		}
		else {
			return false;
		}
	};

    ScrollObject.prototype._MouseArrowHover = function (mp) {
        if (this.settings.isVerticalScroll) {
            if (
                mp.x >= 0 &&
                mp.x <= this.canvasW &&
                mp.y >= 0 &&
                mp.y <= this.settings.arrowDim
            ) {
                return ArrowType.ARROW_TOP;
            } else if (
                mp.x >= 0 &&
                mp.x <= this.canvasW &&
                mp.y >= this.canvasH - this.settings.arrowDim &&
                mp.y <= this.canvasH
            ) {
                return ArrowType.ARROW_BOTTOM;
            } else return ArrowType.NONE;
        }
        if (this.settings.isHorizontalScroll) {
            if (
                mp.x >= 0 &&
                mp.x <= this.settings.arrowDim &&
                mp.y >= 0 &&
                mp.y <= this.canvasH
            ) {
                return ArrowType.ARROW_LEFT;
            } else if (
                mp.x >= this.canvasW - this.settings.arrowDim &&
                mp.x <= this.canvasW &&
                mp.y >= 0 &&
                mp.y <= this.canvasH
            ) {
                return ArrowType.ARROW_RIGHT;
            } else return ArrowType.NONE;
        }
    };

	ScrollObject.prototype._MouseHoverOnArrowUp = function ( mp ) {
		if ( this.settings.isVerticalScroll ) {
			if (
				mp.x >= 0 &&
				mp.x <= this.canvasW &&
				mp.y >= 0 &&
				mp.y <= this.settings.arrowDim
			) {
				return true;
			}
			else return false;
		}
		if ( this.settings.isHorizontalScroll ) {
			if (
				mp.x >= 0 &&
				mp.x <= this.settings.arrowDim &&
				mp.y >= 0 &&
				mp.y <= this.canvasH
			) {
				return true;
			}
			else return false;
		}
	};
	ScrollObject.prototype._MouseHoverOnArrowDown = function ( mp ) {
		if ( this.settings.isVerticalScroll ) {
			if (
				mp.x >= 0 &&
				mp.x <= this.canvasW &&
				mp.y >= this.canvasH - this.settings.arrowDim &&
				mp.y <= this.canvasH
			) {
				return true;
			}
			else return false;
		}
		if ( this.settings.isHorizontalScroll ) {
			if (
				mp.x >= this.canvasW - this.settings.arrowDim &&
				mp.x <= this.canvasW &&
				mp.y >= 0 &&
				mp.y <= this.canvasH
			) {
				return true;
			}
			else return false;
		}
	};

	ScrollObject.prototype._arrowDownMouseDown = function () {
		var that = this, scrollTimeout, isFirst = true,
			doScroll = function () {
				if ( that.settings.isVerticalScroll )
					that.scrollByY( that.settings.vscrollStep );
				else if ( that.settings.isHorizontalScroll )
					that.scrollByX( that.settings.hscrollStep );
				that._draw();
				scrollTimeout = setTimeout( doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq );
				isFirst = false;
			};
		doScroll();
		this.bind( "mouseup.main mouseout", function () {
			scrollTimeout && clearTimeout( scrollTimeout );
			scrollTimeout = null;
		} );
	};
	ScrollObject.prototype._arrowUpMouseDown = function () {
		var that = this, scrollTimeout, isFirst = true,
			doScroll = function () {
				if ( that.settings.isVerticalScroll )
					that.scrollByY( -that.settings.vscrollStep );
				else if ( that.settings.isHorizontalScroll )
					that.scrollByX( -that.settings.hscrollStep );
                that._draw();
				scrollTimeout = setTimeout( doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq );
				isFirst = false;
			};
		doScroll();
		this.bind( "mouseup.main mouseout", function () {
			scrollTimeout && clearTimeout( scrollTimeout );
			scrollTimeout = null;
		} )
	};

	ScrollObject.prototype.getCurScrolledX = function () {
		return this.scrollHCurrentX;
	};
	ScrollObject.prototype.getCurScrolledY = function () {
		return this.scrollVCurrentY;
	};
	ScrollObject.prototype.getMaxScrolledY = function () {
		return this.maxScrollY;
	};
	ScrollObject.prototype.getMaxScrolledX = function () {
		return this.maxScrollX;
	};
	ScrollObject.prototype.getIsLockedMouse = function () {
		return (this.that.mouseDownArrow || this.that.mouseDown);
	};
	/************************************************************************/
	/*events*/
	ScrollObject.prototype.evt_mousemove = function ( e ) {

        if (this.style)
            this.style.cursor = "default";

        // var arrowStat = ArrowStatus.arrowHover;
        var evt = e || window.event;

		if ( evt.preventDefault )
			evt.preventDefault();
		else
			evt.returnValue = false;

		var mousePos = this.that.getMousePosition( evt );
		this.that.EndMousePosition.x = mousePos.x;
		this.that.EndMousePosition.y = mousePos.y;
		var downHover = this.that._MouseHoverOnArrowDown( mousePos ),
			upHover = this.that._MouseHoverOnArrowUp( mousePos ),
			scrollerHover = this.that._MouseHoverOnScroller( mousePos ),
			arrowHover = this.that._MouseArrowHover(mousePos);

		if (this.that.settings.showArrows && this.that.mouseDownArrow) {
			if (arrowHover) {
				this.that.arrowState = arrowHover;
				this.that.animState = AnimationType.ARROW_ACTIVE;
			} else {
				this.that.animState = AnimationType.ARROW_ACTIVE;
			}
		} else if (this.that.settings.showArrows && !this.that.mouseDownArrow) {
			if (!arrowHover) {
				this.that.animState = AnimationType.SCROLL_HOVER;
			} else {
				this.that.animState = AnimationType.ARROW_HOVER;
                this.that.arrowState = arrowHover;
			}
		}

		if ( this.that.mouseDown && this.that.scrollerMouseDown ) {
			this.that.moveble = true;
		}
		else {
			this.that.moveble = false;
		}

		if ( this.that.settings.isVerticalScroll ) {
			if ( this.that.moveble && this.that.scrollerMouseDown ) {
				var isTop = false, isBottom = false;
				if (arrowHover) {
					this.that.animState = AnimationType.ARROW_HOVER;
				} else {
					this.that.animState = AnimationType.SCROLL_ACTIVE;
				}
				var _dlt = this.that.EndMousePosition.y - this.that.StartMousePosition.y;
				if ( this.that.EndMousePosition.y == this.that.StartMousePosition.y ) {
					return;
				}
				else if ( this.that.EndMousePosition.y < this.that.arrowPosition ) {
					this.that.EndMousePosition.y = this.that.arrowPosition;
					_dlt = 0;
					this.that.scroller.y = this.that.arrowPosition;
				}
				else if ( this.that.EndMousePosition.y > this.that.canvasH - this.that.arrowPosition ) {
					this.that.EndMousePosition.y = this.that.canvasH - this.that.arrowPosition;
					_dlt = 0;
					this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
				}
				else {
					if ( (_dlt > 0 && this.that.scroller.y + _dlt + this.that.scroller.h <= this.that.canvasH - this.that.arrowPosition ) ||
						(_dlt < 0 && this.that.scroller.y + _dlt >= this.that.arrowPosition) ) {
						this.that.scroller.y += _dlt;
					}
				}

				var destY = (this.that.scroller.y - this.that.arrowPosition) * this.that.scrollCoeff;
				//var result = editor.WordControl.CorrectSpeedVerticalScroll(destY);
				var result = this.that._correctScrollV( this.that, destY );
				if ( result != null && result.isChange === true ) {
					destY = result.Pos;
				}

				this.that._scrollV( this.that, evt, destY, isTop, isBottom );
				this.that.StartMousePosition.x = this.that.EndMousePosition.x;
				this.that.StartMousePosition.y = this.that.EndMousePosition.y;
			}
		}
		else if ( this.that.settings.isHorizontalScroll ) {
			if ( this.that.moveble && this.that.scrollerMouseDown ) {

				var isTop = false, isBottom = false;
                if (arrowHover) {
                    this.that.animState = AnimationType.ARROW_HOVER;
                } else {
                    this.that.animState = AnimationType.SCROLL_ACTIVE;
                }
				var _dlt = this.that.EndMousePosition.x - this.that.StartMousePosition.x;
				if ( this.that.EndMousePosition.x == this.that.StartMousePosition.x )
					return;
				else if ( this.that.EndMousePosition.x < this.that.arrowPosition ) {
					this.that.EndMousePosition.x = this.that.arrowPosition;
					_dlt = 0;
					this.that.scroller.x = this.that.arrowPosition;
				}
				else if ( this.that.EndMousePosition.x > this.that.canvasW - this.that.arrowPosition ) {
					this.that.EndMousePosition.x = this.that.canvasW - this.that.arrowPosition;
					_dlt = 0;
					this.that.scroller.x = this.that.canvasW - this.that.arrowPosition - this.that.scroller.w;
				}
				else {
					if ( (_dlt > 0 && this.that.scroller.x + _dlt + this.that.scroller.w <= this.that.canvasW - this.that.arrowPosition ) ||
						(_dlt < 0 && this.that.scroller.x + _dlt >= this.that.arrowPosition) )
						this.that.scroller.x += _dlt;
				}
				var destX = (this.that.scroller.x - this.that.arrowPosition) * this.that.scrollCoeff

				this.that._scrollH( this.that, evt, destX, isTop, isBottom );

				this.that.StartMousePosition.x = this.that.EndMousePosition.x;
				this.that.StartMousePosition.y = this.that.EndMousePosition.y;
			}
		}

		if ( !this.that.mouseDownArrow ) {
			// this.that._drawArrow( arrowStat );
		}

        this.that.moveble = false;

		if ( this.that.lastAnimState != this.that.animState) {
			this.that._draw();
		}

	};
	ScrollObject.prototype.evt_mouseout = function ( e ) {

		var evt = e || window.event;

		if ( this.that.settings.showArrows ) {
			this.that.mouseDownArrow = false;
			this.that.handleEvents( "onmouseout", evt );
		}

		if ( !this.that.moveble ) {
			this.that.animState = AnimationType.NONE;
		}
		if(this.that.mouseDown && this.that.scrollerMouseDown) {
            this.that.animState = AnimationType.SCROLL_ACTIVE;
        }

			this.that._draw();

	};
	ScrollObject.prototype.evt_mouseover = function ( e ) {

		this.that.mouseover = true;

	};
	ScrollObject.prototype.evt_mouseup = function ( e ) {
		var evt = e || window.event;

		this.that.handleEvents( "onmouseup", evt );

		// prevent pointer events on all iframes (while only plugin!)
		if (window.g_asc_plugins)
			window.g_asc_plugins.enablePointerEvents();

		if ( evt.preventDefault )
			evt.preventDefault();
		else
			evt.returnValue = false;

		var mousePos = this.that.getMousePosition( evt );
		this.that.scrollTimeout && clearTimeout( this.that.scrollTimeout );
		this.that.scrollTimeout = null;
		if ( this.that.scrollerMouseDown ) {
			this.that.mouseDown = false;
			this.that.mouseUp = true;
			this.that.scrollerMouseDown = false;
			this.that.mouseDownArrow = false;
			if ( this.that._MouseHoverOnScroller( mousePos ) ) {
				this.that.animState = AnimationType.SCROLL_HOVER;
			}
			else {
				this.that.animState = AnimationType.NONE;
			}
			// this.that._drawArrow();
		} else {
		    this.that.animState = AnimationType.ARROW_HOVER;
			this.that.mouseDownArrow = false;
		}
		this.that._draw();
		//for unlock global mouse event
		if ( this.that.onLockMouse && this.that.offLockMouse ) {
			this.that.offLockMouse( evt );
		}
	};
	ScrollObject.prototype.evt_mousedown = function ( e ) {
		var evt = e || window.event;

		// prevent pointer events on all iframes (while only plugin!)
		if (window.g_asc_plugins)
			window.g_asc_plugins.disablePointerEvents();

		// если сделать превент дефолт - перестанет приходить mousemove от window
		/*
		 if (evt.preventDefault)
		 evt.preventDefault();
		 else
		 evt.returnValue = false;
		 */

		var mousePos = this.that.getMousePosition( evt ),
			downHover = this.that._MouseHoverOnArrowDown( mousePos ),
			upHover = this.that._MouseHoverOnArrowUp( mousePos ),
		    arrowHover = this.that._MouseArrowHover(mousePos);

		if ( this.that.settings.showArrows && downHover ) {
			this.that.mouseDownArrow = true;
			this.that.arrowState = arrowHover;
			this.that.animState = AnimationType.ARROW_ACTIVE;
			this.that._arrowDownMouseDown();
		}
		else if ( this.that.settings.showArrows && upHover ) {
			this.that.mouseDownArrow = true;
			this.that.arrowState = arrowHover;
            this.that.animState = AnimationType.ARROW_ACTIVE;
			this.that._arrowUpMouseDown();
		}
		else {
			this.that.mouseDown = true;
			this.that.mouseUp = false;

			if ( this.that._MouseHoverOnScroller( mousePos ) ) {
				this.that.scrollerMouseUp = false;
				this.that.scrollerMouseDown = true;

				if ( this.that.onLockMouse ) {
					this.that.onLockMouse( evt );
				}
				this.that.StartMousePosition.x = mousePos.x;
				this.that.StartMousePosition.y = mousePos.y;
				this.that.animState = AnimationType.SCROLL_ACTIVE;
				this.that._draw();
			}
			else {
				if ( this.that.settings.isVerticalScroll ) {
					var _tmp = this,
						direction = mousePos.y - this.that.scroller.y - this.that.scroller.h / 2,
						step = this.that.paneHeight * this.that.settings.scrollPagePercent,
//                        verticalDragPosition = this.that.scroller.y,
						isFirst = true,
						doScroll = function () {
							_tmp.that.lock = true;
							if ( direction > 0 ) {
								if ( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 + step < mousePos.y ) {
									_tmp.that.scrollByY( step * _tmp.that.scrollCoeff );
								}
								else {
									var _step = Math.abs( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y );
									_tmp.that.scrollByY( _step * _tmp.that.scrollCoeff );
									cancelClick();
									return;
								}
							}
							else if ( direction < 0 ) {
								if ( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - step > mousePos.y ) {
									_tmp.that.scrollByY( -step * _tmp.that.scrollCoeff );
								}
								else {
									var _step = Math.abs( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y );
									_tmp.that.scrollByY( -_step * _tmp.that.scrollCoeff );
									cancelClick();
									return;
								}
							}
							_tmp.that.scrollTimeout = setTimeout( doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq );
							isFirst = false;
							// _tmp.that._drawArrow( ArrowStatus.arrowHover );
						},
						cancelClick = function () {
							_tmp.that.scrollTimeout && clearTimeout( _tmp.that.scrollTimeout );
							_tmp.that.scrollTimeout = null;
							_tmp.that.unbind( "mouseup.main", cancelClick );
							_tmp.that.lock = false;
						};

					if ( this.that.onLockMouse ) {
						this.that.onLockMouse( evt );
					}

					doScroll();
					this.that.bind( "mouseup.main", cancelClick );
				}
				if ( this.that.settings.isHorizontalScroll ) {
					var _tmp = this,
						direction = mousePos.x - this.that.scroller.x - this.that.scroller.w / 2,
						step = this.that.paneWidth * this.that.settings.scrollPagePercent,
//                        horizontalDragPosition = this.that.scroller.x,
						isFirst = true,
						doScroll = function () {
							_tmp.that.lock = true;
							if ( direction > 0 ) {
								if ( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 + step < mousePos.x ) {
									_tmp.that.scrollByX( step * _tmp.that.scrollCoeff );
								}
								else {
									var _step = Math.abs( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x );
									_tmp.that.scrollByX( _step * _tmp.that.scrollCoeff );
									cancelClick();
									return;
								}
							}
							else if ( direction < 0 ) {
								if ( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - step > mousePos.x ) {
									_tmp.that.scrollByX( -step * _tmp.that.scrollCoeff );
								}
								else {
									var _step = Math.abs( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x );
									_tmp.that.scrollByX( -_step * _tmp.that.scrollCoeff );
									cancelClick();
									return;
								}
							}
							_tmp.that.scrollTimeout = setTimeout( doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq );
							isFirst = false;
							// _tmp.that._drawArrow( ArrowStatus.arrowHover );
						},
						cancelClick = function () {
							_tmp.that.scrollTimeout && clearTimeout( _tmp.that.scrollTimeout );
							_tmp.that.scrollTimeout = null;
							_tmp.that.unbind( "mouseup.main", cancelClick );
							_tmp.that.lock = false;
						};

					if ( this.that.onLockMouse ) {
						this.that.onLockMouse( evt );
					}

					doScroll();
					this.that.bind( "mouseup.main", cancelClick );
				}
			}
		}
	};
	ScrollObject.prototype.evt_mousewheel = function ( e ) {
		var evt = e || window.event;
		/* if ( evt.preventDefault )
		 evt.preventDefault();
		 else
		 evt.returnValue = false;*/

		var delta = 1;
		if ( this.that.settings.isHorizontalScroll ) return;
		if ( undefined != evt.wheelDelta )
			delta = (evt.wheelDelta > 0) ? -this.that.settings.vscrollStep : this.that.settings.vscrollStep;
		else
			delta = (evt.detail > 0) ? this.that.settings.vscrollStep : -this.that.settings.vscrollStep;
		delta *= this.that.settings.wheelScrollLines;
		this.that.scroller.y += delta;
		if ( this.that.scroller.y < 0 ) {
			this.that.scroller.y = 0;
		}
		else if ( this.that.scroller.y + this.that.scroller.h > this.that.canvasH ) {
			this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
		}
		this.that.scrollByY( delta )
	};
	ScrollObject.prototype.evt_click = function ( e ) {
		var evt = e || window.event;
		var mousePos = this.that.getMousePosition( evt );
		if ( this.that.settings.isHorizontalScroll ) {
			if ( mousePos.x > this.arrowPosition && mousePos.x < this.that.canvasW - this.that.arrowPosition ) {
				if ( this.that.scroller.x > mousePos.x ) {
					this.that.scrollByX( -this.that.settings.vscrollStep );
				}
				if ( this.that.scroller.x < mousePos.x && this.that.scroller.x + this.that.scroller.w > mousePos.x ) {
					return false;
				}
				if ( this.that.scroller.x + this.that.scroller.w < mousePos.x ) {
					this.that.scrollByX( this.that.settings.hscrollStep );
				}
			}
		}
		if ( this.that.settings.isVerticalScroll ) {
			if ( mousePos.y > this.that.arrowPosition && mousePos.y < this.that.canvasH - this.that.arrowPosition ) {
				if ( this.that.scroller.y > mousePos.y ) {
					this.that.scrollByY( -this.that.settings.vscrollStep );
				}
				if ( this.that.scroller.y < mousePos.y && this.that.scroller.y + this.that.scroller.h > mousePos.y ) {
					return false;
				}
				if ( this.that.scroller.y + this.that.scroller.h < mousePos.y ) {
					this.that.scrollByY( this.that.settings.hscrollStep );
				}
			}
		}
	};

	/************************************************************************/
	/*for events*/
	ScrollObject.prototype.bind = function ( typesStr, handler ) {
		var types = typesStr.split( " " );
		/*
		 * loop through types and attach event listeners to
		 * each one.  eg. "click mouseover.namespace mouseout"
		 * will create three event bindings
		 */
		for ( var n = 0; n < types.length; n++ ) {
			var type = types[n];
			var event = (type.indexOf( 'touch' ) == -1) ? 'on' + type : type;
			var parts = event.split( "." );
			var baseEvent = parts[0];
			var name = parts.length > 1 ? parts[1] : "";

			if ( !this.eventListeners[baseEvent] ) {
				this.eventListeners[baseEvent] = [];
			}

			this.eventListeners[baseEvent].push( {
				name:name,
				handler:handler
			} );
		}
	};
	ScrollObject.prototype.unbind = function ( typesStr ) {
		var types = typesStr.split( " " );

		for ( var n = 0; n < types.length; n++ ) {
			var type = types[n];
			var event = (type.indexOf( 'touch' ) == -1) ? 'on' + type : type;
			var parts = event.split( "." );
			var baseEvent = parts[0];

			if ( this.eventListeners[baseEvent] && parts.length > 1 ) {
				var name = parts[1];

				for ( var i = 0; i < this.eventListeners[baseEvent].length; i++ ) {
					if ( this.eventListeners[baseEvent][i].name == name ) {
						this.eventListeners[baseEvent].splice( i, 1 );
						if ( this.eventListeners[baseEvent].length === 0 ) {
							this.eventListeners[baseEvent] = undefined;
						}
						break;
					}
				}
			}
			else {
				this.eventListeners[baseEvent] = undefined;
			}
		}
	};
	ScrollObject.prototype.handleEvents = function ( eventType, evt, p ) {
		var that = this;
		// generic events handler
		function handle( obj ) {
			var el = obj.eventListeners;
			if ( el[eventType] ) {
				var events = el[eventType];
				for ( var i = 0; i < events.length; i++ ) {
					events[i].handler.apply( obj, [evt] );
				}
			}
		}

		/*
		 * simulate bubbling by handling shape events
		 * first, followed by group events, followed
		 * by layer events
		 */
		handle( that );
	};

    //---------------------------------------------------------export---------------------------------------------------
	window["AscCommon"].ScrollSettings = ScrollSettings;
    window["AscCommon"].ScrollObject = ScrollObject;
})(window);
