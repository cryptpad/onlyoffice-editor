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

/*
    PLACEHOLDERS
 */
(function(window, undefined){

    var AscCommon = window['AscCommon'];

    AscCommon.PlaceholderButtonType = {
    	Image : 0,
        ImageUrl : 1,
		Chart : 2,
		Table : 3,
        Video : 4,
        Audio : 5
	};

    var exportObj = AscCommon.PlaceholderButtonType;
    AscCommon["PlaceholderButtonType"] = exportObj;
    exportObj["Image"] = exportObj.Image;
    exportObj["ImageUrl"] = exportObj.ImageUrl;
    exportObj["Chart"] = exportObj.Chart;
    exportObj["Table"] = exportObj.Table;
    exportObj["Video"] = exportObj.Video;
    exportObj["Audio"] = exportObj.Audio;

    AscCommon.PlaceholderButtonState = {
        None : 0,
        Active : 1,
        Over : 2
    };

    var ButtonSize1x = 42;
    var ButtonImageSize1x = 28;
    var ButtonBetweenSize1x = 8;

    function PlaceholderIcons()
    {
        function PI()
        {
            this.images = [];
            this.load = function(type, url)
            {
                this.images[0] = new Image();
                this.images[0].onload = function() { this.asc_complete = true; };
                this.images[0].src = "../../../../sdkjs/common/Images/placeholders/" + url + ".png";

                this.images[1] = new Image();
                this.images[1].onload = function() { this.asc_complete = true; };
                this.images[1].src = "../../../../sdkjs/common/Images/placeholders/" + url + "@2x.png";
            };
            this.loadActive = function(url)
            {
                this.images[2] = new Image();
                this.images[2].onload = function() { this.asc_complete = true; };
                this.images[2].src = "../../../../sdkjs/common/Images/placeholders/" + url + "_active.png";

                this.images[3] = new Image();
                this.images[3].onload = function() { this.asc_complete = true; };
                this.images[3].src = "../../../../sdkjs/common/Images/placeholders/" + url + "_active@2x.png";
            };
            this.get = function()
            {
                var index = AscCommon.AscBrowser.isRetina ? 1 : 0;
                return this.images[index].asc_complete ? this.images[index] : null;
            };
            this.getActive = function()
            {
                var index = AscCommon.AscBrowser.isRetina ? 3 : 2;
                return this.images[index].asc_complete ? this.images[index] : null;
            };
        }

        this.images = [];

        this.register = function(type, url, support_active)
        {
            this.images[type] = new PI();
            this.images[type].load(type, url);
            support_active && this.images[type].loadActive(url);
        };
        this.get = function(type)
        {
        	return this.images[type] ? this.images[type].get() : null;
        };
        this.getActive = function(type)
        {
            return this.images[type] ? this.images[type].getActive() : null;
        };
    }

    AscCommon.CreateDrawingPlaceholder = function(id, buttons, page, rect, transform)
	{
		var placeholder = new Placeholder();
		placeholder.id = id;
		placeholder.buttons = buttons;
		placeholder.anchor.page = page;
		placeholder.anchor.rect = rect;
        placeholder.anchor.transform = transform;

        for (var i = 0; i < placeholder.buttons.length; i++)
            placeholder.states[i] = AscCommon.PlaceholderButtonState.None;

        return placeholder;
	};

    // объект плейсхордер - может содержать в себе несколько кнопок
	// сам решает, где и как рисовать
	function Placeholder()
	{
		this.events = null; // Placeholders

		// id button (parent shape id)
		this.id = null;

		// list of buttons {AscCommon.PlaceholderButtonType}
		this.buttons = [];
        this.states = []; // states

		// position
		this.anchor = {
			page : -1,
			rect : { x : 0, y : 0, w : 0, h : 0 },
			transform : null
		};
	}

	Placeholder.prototype.getCenterInPixels = function(pixelsRect, pageWidthMM, pageHeightMM)
    {
        var cx = this.anchor.rect.x + this.anchor.rect.w / 2;
        var cy = this.anchor.rect.y + this.anchor.rect.h / 2;
        if (this.anchor.transform)
        {
            var tmpCx = cx;
            var tmpCy = cy;
            cx = this.anchor.transform.TransformPointX(tmpCx, tmpCy);
            cy = this.anchor.transform.TransformPointY(tmpCx, tmpCy);
        }

        return {
            x : (0.5 + pixelsRect.left + cx * (pixelsRect.right - pixelsRect.left) / pageWidthMM) >> 0,
            y : (0.5 + pixelsRect.top + cy * (pixelsRect.bottom - pixelsRect.top) / pageHeightMM) >> 0
        };
    };

	// расчет всех ректов кнопок
    Placeholder.prototype.getButtonRects = function(pointCenter, scale)
	{
	    //координаты ретины - масштабируются при отрисовке
        var ButtonSize = ButtonSize1x;//AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);
        var ButtonBetweenSize = ButtonBetweenSize1x;//AscCommon.AscBrowser.convertToRetinaValue(ButtonBetweenSize1x, true);

		// максимум 2 ряда
		var buttonsCount = this.buttons.length;
		var countColumn = (buttonsCount < 3) ? buttonsCount : (this.buttons.length + 1) >> 1;
		var countColumn2 = buttonsCount - countColumn;

		var sizeAllHor = (countColumn * ButtonSize + (countColumn - 1) * ButtonBetweenSize);
        var sizeAllHor2 = (countColumn2 * ButtonSize + (countColumn2 - 1) * ButtonBetweenSize);
        var sizeAllVer = buttonsCount > 0 ? ButtonSize : 0;
        if (buttonsCount > countColumn)
            sizeAllVer += (ButtonSize + ButtonBetweenSize);

        var parentW = (this.anchor.rect.w * scale.x) >> 1;
        var parentH = (this.anchor.rect.h * scale.y) >> 1;

        if ((parentW + (ButtonBetweenSize << 1)) < sizeAllHor || (parentH + (ButtonBetweenSize << 1)) < sizeAllVer)
            return [];

		var xStart = pointCenter.x - (sizeAllHor >> 1);
        var yStart = pointCenter.y - (((buttonsCount == countColumn) ? ButtonSize : (2 * ButtonSize + ButtonBetweenSize)) >> 1);

		var ret = [];
		var x = xStart;
		var y = yStart;
		var i = 0;
		while (i < countColumn)
		{
			ret.push({x : x, y : y});
			x += (ButtonSize + ButtonBetweenSize);
			i++;
		}

		x = xStart + ((sizeAllHor - sizeAllHor2) >> 1);
        y = yStart + ButtonSize + ButtonBetweenSize;
        while (i < buttonsCount)
        {
            ret.push({x : x, y : y});
            x += (ButtonSize + ButtonBetweenSize);
            i++;
        }

        return ret;
	};

	Placeholder.prototype.isInside = function(x, y, pixelsRect, pageWidthMM, pageHeightMM, pointMenu)
    {
        var pointCenter = this.getCenterInPixels(pixelsRect, pageWidthMM, pageHeightMM);
        var scale = {
            x : (pixelsRect.right - pixelsRect.left) / pageWidthMM,
            y : (pixelsRect.bottom - pixelsRect.top) / pageHeightMM
        };
    	var rects = this.getButtonRects(pointCenter, scale);
        var ButtonSize = ButtonSize1x;//AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);

        var px = (0.5 + pixelsRect.left + x * (pixelsRect.right - pixelsRect.left) / pageWidthMM) >> 0;
        var py = (0.5 + pixelsRect.top + y * (pixelsRect.bottom - pixelsRect.top) / pageHeightMM) >> 0;

        var rect;
    	for (var i = 0; i < rects.length; i++)
		{
			rect = rects[i];
			if ((px >= rect.x) && (px <= (rect.x + ButtonSize)) && (py >= rect.y) && (py <= (rect.y + ButtonSize)))
			{
			    if (pointMenu)
			    {
                    pointMenu.x = rect.x;
                    pointMenu.y = rect.y;
                }
                return i;
            }
		}

		return -1;
    };

    Placeholder.prototype.onPointerDown = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
    {
        var pointMenu = { x : 0, y : 0 };
        var indexButton = this.isInside(x, y, pixelsRect, pageWidthMM, pageHeightMM, pointMenu);

		if (-1 == indexButton)
			return false;

		if (this.states[indexButton] == AscCommon.PlaceholderButtonState.Active)
        {
            this.states[indexButton] = AscCommon.PlaceholderButtonState.Over;
            this.events.document.m_oWordControl.OnUpdateOverlay();
            this.events.document.m_oWordControl.EndUpdateOverlay();

            this.events.closeCallback(this.buttons[indexButton], this);
            return true;
        }
        else if (this.events.mapActive[this.buttons[indexButton]])
        {
            for (var i = 0; i < this.buttons.length; i++)
            {
                if (indexButton != i)
                    this.states[i] = AscCommon.PlaceholderButtonState.None;
            }

            this.states[indexButton] = AscCommon.PlaceholderButtonState.Active;
            this.events.document.m_oWordControl.OnUpdateOverlay();
            this.events.document.m_oWordControl.EndUpdateOverlay();
        }

        var xCoord = pointMenu.x;
		var yCoord = pointMenu.y;
        if (true == this.events.document.m_oWordControl.m_bIsRuler)
        {
            xCoord += (5 * g_dKoef_mm_to_pix) >> 0;
            yCoord += (7 * g_dKoef_mm_to_pix) >> 0;
        }
        
		this.events.callCallback(this.buttons[indexButton], this, xCoord, yCoord);
		return true;
    };

    Placeholder.prototype.onPointerMove = function(x, y, pixelsRect, pageWidthMM, pageHeightMM, checker)
    {
        var indexButton = this.isInside(x, y, pixelsRect, pageWidthMM, pageHeightMM);

        // может в кнопку-то и не попали, но состояние могло смениться => нужно перерисовать интерфейс
        var isUpdate = false;
        for (var i = 0; i < this.buttons.length; i++)
        {
            if (i == indexButton)
            {
                if (this.states[i] == AscCommon.PlaceholderButtonState.None)
                {
                    this.states[i] = AscCommon.PlaceholderButtonState.Over;
                    isUpdate = true;
                }
            }
            else
            {
                if (this.states[i] == AscCommon.PlaceholderButtonState.Over)
                {
                    this.states[i] = AscCommon.PlaceholderButtonState.None;
                    isUpdate = true;
                }
            }
        }

        checker.isNeedUpdateOverlay |= isUpdate;
        return (-1 != indexButton);
    };

    Placeholder.prototype.onPointerUp = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
    {
		// ничего. нажимаем сразу при down
    };

    Placeholder.prototype.draw = function(overlay, pixelsRect, pageWidthMM, pageHeightMM)
	{
        var pointCenter = this.getCenterInPixels(pixelsRect, pageWidthMM, pageHeightMM);
        var scale = {
            x : (pixelsRect.right - pixelsRect.left) / pageWidthMM,
            y : (pixelsRect.bottom - pixelsRect.top) / pageHeightMM
        };
        var rects = this.getButtonRects(pointCenter, scale);
        if (rects.length != this.buttons.length)
            return;

        var ButtonSize = ButtonSize1x;//AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);
        var ButtonImageSize = ButtonImageSize1x;//AscCommon.AscBrowser.convertToRetinaValue(ButtonImageSize1x, true);
        var offsetImage = (ButtonSize - ButtonImageSize) >> 1;

        var ctx = overlay.m_oContext;
        for (var i = 0; i < this.buttons.length; i++)
        {
            overlay.CheckPoint(rects[i].x, rects[i].y);
            overlay.CheckPoint(rects[i].x + ButtonSize, rects[i].y + ButtonSize);

            var img = (this.states[i] == AscCommon.PlaceholderButtonState.Active) ? this.events.icons.getActive(this.buttons[i]) : this.events.icons.get(this.buttons[i]);
            if (img)
            {
                var oldGlobalAlpha = ctx.globalAlpha;

                ctx.globalAlpha = ((this.states[i] == AscCommon.PlaceholderButtonState.None) ? 0.75 : 1);

                /* первый вариант
                ctx.beginPath();
                ctx.fillStyle = "#F1F1F1";
                ctx.fillRect(rects[i].x, rects[i].y, ButtonSize, ButtonSize);
                ctx.beginPath();
                */

                // второй вариант
                ctx.beginPath();
                ctx.fillStyle = (this.states[i] == AscCommon.PlaceholderButtonState.Active) ? "#7D858C" : "#F1F1F1";
                var x = rects[i].x;
                var y = rects[i].y;
                var r = 4;
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + ButtonSize - r, y);
                ctx.quadraticCurveTo(x + ButtonSize, y, x + ButtonSize, y + r);
                ctx.lineTo(x + ButtonSize, y + ButtonSize - r);
                ctx.quadraticCurveTo(x + ButtonSize, y + ButtonSize, x + ButtonSize - r, y + ButtonSize);
                ctx.lineTo(x + r, y + ButtonSize);
                ctx.quadraticCurveTo(x, y + ButtonSize, x, y + ButtonSize - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.fill();
                ctx.beginPath();

                ctx.drawImage(img, rects[i].x + offsetImage, rects[i].y + offsetImage, ButtonImageSize, ButtonImageSize);

                ctx.globalAlpha = oldGlobalAlpha;
            }
        }
	};
	
	function Placeholders(drDocument)
	{
	    this.document = drDocument;

		this.callbacks = [];
		this.objects = [];

		this.icons = new PlaceholderIcons();
		this.icons.register(AscCommon.PlaceholderButtonType.Image, "image");
        this.icons.register(AscCommon.PlaceholderButtonType.ImageUrl, "image_url");
        this.icons.register(AscCommon.PlaceholderButtonType.Table, "table", true);
        this.icons.register(AscCommon.PlaceholderButtonType.Chart, "chart", true);
        this.icons.register(AscCommon.PlaceholderButtonType.Audio, "audio");
        this.icons.register(AscCommon.PlaceholderButtonType.Video, "video");

        // типы, которые поддерживают состояние Active
        this.mapActive = [];
        this.mapActive[AscCommon.PlaceholderButtonType.Table] = true;
        this.mapActive[AscCommon.PlaceholderButtonType.Chart] = true;
    }

	Placeholders.prototype.registerCallback = function(type, callback)
	{
		this.callbacks[type] = callback;
	};

    Placeholders.prototype.callCallback = function(type, obj)
    {
        this.callbacks[type] && this.callbacks[type](obj);
    };

    Placeholders.prototype.closeCallback = function(type, obj)
    {
        // TODO:
    };

    Placeholders.prototype.closeAllActive = function()
    {
        var isUpdate = false;
        for (var i = 0; i < this.objects.length; i++)
        {
            var obj = this.objects[i];
            for (var j = 0; j < obj.states.length; j++)
            {
                if (obj.states[j] == AscCommon.PlaceholderButtonState.Active)
                {
                    isUpdate = true;
                    obj.states[j] = AscCommon.PlaceholderButtonState.None;
                }
            }
        }
        if (isUpdate)
            this.document.m_oWordControl.OnUpdateOverlay();
    };

    Placeholders.prototype.draw = function(overlay, page, pixelsRect, pageWidthMM, pageHeightMM)
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].anchor.page != page)
                continue;

            this.objects[i].draw(overlay, pixelsRect, pageWidthMM, pageHeightMM);
        }
    };

    Placeholders.prototype.onPointerDown = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
	{
		for (var i = 0; i < this.objects.length; i++)
		{
		    if (this.objects[i].anchor.page != pos.Page)
		        continue;

			if (this.objects[i].onPointerDown(pos.X, pos.Y, pixelsRect, pageWidthMM, pageHeightMM))
				return true;
		}
		return false;
	};

    Placeholders.prototype.onPointerMove = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
    {
        var checker = { isNeedUpdateOverlay : false };
        var isButton = false;
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].anchor.page != pos.Page)
                continue;

            isButton |= this.objects[i].onPointerMove(pos.X, pos.Y, pixelsRect, pageWidthMM, pageHeightMM, checker);
        }

        if (isButton)
            this.document.SetCursorType("default");

        // обновить оверлей
        if (checker.isNeedUpdateOverlay && this.document.m_oWordControl)
        {
            this.document.m_oWordControl.OnUpdateOverlay();

            if (isButton)
                this.document.m_oWordControl.EndUpdateOverlay();
        }

        return isButton;
    };

    Placeholders.prototype.onPointerUp = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
    {
        return this.onPointerMove(pos, pixelsRect, pageWidthMM, pageHeightMM);
    };

    Placeholders.prototype.update = function(objects)
	{
		var count = this.objects.length;
		var newCount = objects ? objects.length : 0;
		if (count != newCount)
			return this._onUpdate(objects);

		var t1, t2;
		for (var i = 0; i < count; i++)
		{
            if (this.objects[i].id != objects[i].id)
                return this._onUpdate(objects);

			if (this.objects[i].page != objects[i].page)
				return this._onUpdate(objects);

			t1 = this.objects[i].anchor.rect;
            t2 = objects[i].anchor.rect;

            if (Math.abs(t1.x - t2.x) > 0.001 || Math.abs(t1.y - t2.y) > 0.001 ||
                Math.abs(t1.w - t2.w) > 0.001 || Math.abs(t1.h - t2.h) > 0.001)
            	return this._onUpdate(objects);

            t1 = this.objects[i].anchor.transform;
            t2 = objects[i].anchor.transform;

            if (!t1 && !t2)
            	continue;

            if ((t1 && !t2) || (!t1 && t2))
                return this._onUpdate(objects);

            if (Math.abs(t1.sx - t2.sx) > 0.001 || Math.abs(t1.sy - t2.sy) > 0.001 ||
                Math.abs(t1.shx - t2.shx) > 0.001 || Math.abs(t1.shy - t2.shy) > 0.001 ||
                Math.abs(t1.tx - t2.tx) > 0.001 || Math.abs(t1.ty - t2.ty) > 0.001)
                return this._onUpdate(objects);
		}
	};

    Placeholders.prototype._onUpdate = function(objects)
    {
        this.objects = objects ? objects : [];
        for (var i = 0; i < this.objects.length; i++)
		{
			this.objects[i].events = this;
		}

        this.document.m_oWordControl && this.document.m_oWordControl.OnUpdateOverlay();
    };

    AscCommon.DrawingPlaceholders = Placeholders;

    // example use
    /*
    placeholders.registerCallback(AscCommon.PlaceholderButtonType.Image, function(obj, x, y) {});
    this.placeholders.update(
        [
            AscCommon.CreateDrawingPlaceholder(0, [
             AscCommon.PlaceholderButtonType.Image,
             AscCommon.PlaceholderButtonType.Video,
             AscCommon.PlaceholderButtonType.Audio,
             AscCommon.PlaceholderButtonType.Table,
             AscCommon.PlaceholderButtonType.Chart
            ], 0, { x : 10, y : 10, w : 100, h : 100 }, null),
            AscCommon.CreateDrawingPlaceholder(0, [AscCommon.PlaceholderButtonType.Image], 0, { x : 100, y : 100, w : 100, h : 100 }, null)
        ]
    );
    */

})(window);

/*
    CONTENTCONTROLS
 */
(function(window, undefined){

    var AscCommon = window['AscCommon'];

    AscCommon.CCButtonType = {
        Name : 0,
        Toc : 1,
        Image : 2
    };

    AscCommon.ContentControlTrack = {
        Hover 	: 0,
        In 		: 1
    };

    var ButtonSize1x = 20;

    function CCIcons()
    {
        function CCI()
        {
            this.type = 0;
            this.images = [];

            this.load = function(type, url)
            {
                this.type = type;
                this.images[0] = new Image();
                this.images[0].onload = function() { this.asc_complete = true; };
                this.images[0].src = "../../../../sdkjs/common/Images/content_controls/" + url + ".png";

                this.images[1] = new Image();
                this.images[1].onload = function() { this.asc_complete = true; };
                this.images[1].src = "../../../../sdkjs/common/Images/content_controls/" + url + "_active.png";

                this.images[2] = new Image();
                this.images[2].onload = function() { this.asc_complete = true; };
                this.images[2].src = "../../../../sdkjs/common/Images/content_controls/" + url + "@2x.png";

                this.images[3] = new Image();
                this.images[3].onload = function() { this.asc_complete = true; };
                this.images[3].src = "../../../../sdkjs/common/Images/content_controls/" + url + "_active@2x.png";
            };

            this.get = function(isActive)
            {
                var index = AscCommon.AscBrowser.isRetina ? 2 : 0;
                if (isActive)
                    index++;
                if (this.images[index].asc_complete)
                    return this.images[index];
                return null;
            };
        }

        this.images = [];

        this.register = function(type, url)
        {
            var image = new CCI();
            image.load(type, url);
            this.images[type] = image;
        };

        this.getImage = function(type, isActive)
        {
            if (!this.images[type])
                return null;

            return this.images[type].get(isActive);
        };
    }

    function CContentControlTrack(_id, _type, _data, _transform, _name, _name_advanced, _button_types, _color)
    {
        this.id = (undefined == _id) ? -1 : _id;
        this.type = (undefined == _type) ? -1 : _type;
        this.color = _color;

        this.rects = undefined;
        this.paths = undefined;

        if (undefined === _data[0].Points)
            this.rects = _data;
        else
            this.paths = _data;

        this.transform = (undefined == _transform) ? null : _transform;

        this.X = undefined;
        this.Y = undefined;

        this.Name = _name ? _name : "";
        this.NameButtonAdvanced = _name_advanced ? true : false;
        this.Buttons = _button_types ? _button_types : [];

        this.HoverButtonIndex = -2; // -1 => Text, otherwise index in this.Buttons
        this.ActiveButtonIndex = -2; // -1 => Text, otherwise index in this.Buttons
        this.NameWidth = 0;
    }
    CContentControlTrack.prototype.getPage = function()
    {
        if (this.rects)
            return this.rects[0].Page;
        if (this.paths)
            return this.paths[0].Page;
        return 0;
    };
    CContentControlTrack.prototype.getXY = function()
    {
        if (undefined === this.X && undefined === this.Y)
        {
            if (this.rects)
            {
                this.X = this.rects[0].X;
                this.Y = this.rects[0].Y;
            }
            else if (this.paths)
            {
                var _points = this.paths[0].Points;
                this.Y = _points[0].Y;

                for (var i = 1; i < _points.length; i++)
                {
                    if (this.Y > _points[i].Y)
                        this.Y = _points[i].Y;
                }

                this.X = 1000000000;
                for (var i = 0; i < _points.length; i++)
                {
                    if (Math.abs(this.Y - _points[i].Y) < 0.0001)
                    {
                        if (this.X > _points[i].X)
                            this.X = _points[i].X;
                    }
                }
            }
        }

        return { X : this.X, Y : this.Y };
    };
    CContentControlTrack.prototype.Copy = function()
    {
        return new CContentControlTrack(this.id, this.type, this.rects ? this.rects : this.paths, this.transform, this.color);
    };
    CContentControlTrack.prototype.getColor = function()
    {
        return this.color;
    };

    function ContentControls(drDocument)
    {
        this.document = drDocument;

        this.icons = new CCIcons();
        this.icons.register(AscCommon.CCButtonType.Toc, "toc");
        this.icons.register(AscCommon.CCButtonType.Image, "img");

        this.ContentControlObjects = [];
        this.ContentControlObjectsLast = [];
        this.ContentControlObjectState = -1;
        this.ContentControlSmallChangesCheck = { X: 0, Y: 0, Page: 0, Min: 2, IsSmall : true };

        this.measures = {};

        this.getFont = function(dKoef)
        {
            if (!dKoef)
                return "11px Helvetica, Arial, sans-serif";
            var size = (1 + 2 * 11 / dKoef) >> 0;
            if (size & 1)
                return (size >> 1) + ".5px Helvetica, Arial, sans-serif";
            return (size >> 1) + "px Helvetica, Arial, sans-serif";
        };

        this.measure = function(text, ctx, not_cache)
        {
            if (!this.measures[text])
                this.measures[text] = [0, 0];

            if (not_cache)
                return ctx.measureText(text).width;

            var arr = this.measures[text];
            var index = AscCommon.AscBrowser.isRetina ? 1 : 0;
            if (0 != arr[index])
                return arr[index];

            arr[index] = ctx.measureText(text).width;
            return arr[index];
        };

        // сохранение текущих в последние
        // вызывается в конце метода DrawContentControlsTrack
        this.ContentControlsSaveLast = function()
        {
            this.ContentControlObjectsLast = [];
            for (var i = 0; i < this.ContentControlObjects.length; i++)
            {
                this.ContentControlObjectsLast.push(this.ContentControlObjects[i].Copy());
            }
        };

        // совпадают ли текущие с последними? (true не совпадают)
        // вызывается на onPointerMove, если никаких других причин для обновления интерфейса нет - то
        // смотрим, сменилось ли тут чего-то
        this.ContentControlsCheckLast = function()
        {
            var _len1 = this.ContentControlObjects.length;
            var _len2 = this.ContentControlObjectsLast.length;

            if (_len1 != _len2)
                return true;

            var count1, count2;
            for (var i = 0; i < _len1; i++)
            {
                var _obj1 = this.ContentControlObjects[i];
                var _obj2 = this.ContentControlObjectsLast[i];

                if (_obj1.id != _obj2.id)
                    return true;
                if (_obj1.type != _obj2.type)
                    return true;

                if (_obj1.rects && _obj2.rects)
                {
                    count1 = _obj1.rects.length;
                    count2 = _obj2.rects.length;

                    if (count1 != count2)
                        return true;

                    for (var j = 0; j < count1; j++)
                    {
                        if (Math.abs(_obj1.rects[j].X - _obj2.rects[j].X) > 0.00001 ||
                            Math.abs(_obj1.rects[j].Y - _obj2.rects[j].Y) > 0.00001 ||
                            Math.abs(_obj1.rects[j].R - _obj2.rects[j].R) > 0.00001 ||
                            Math.abs(_obj1.rects[j].B - _obj2.rects[j].B) > 0.00001 ||
                            _obj1.rects[j].Page != _obj2.rects[j].Page)
                        {
                            return true;
                        }
                    }
                }
                else if (_obj1.path && _obj2.path)
                {
                    count1 = _obj1.paths.length;
                    count2 = _obj2.paths.length;

                    if (count1 != count2)
                        return true;

                    var _points1, _points2;
                    for (var j = 0; j < count1; j++)
                    {
                        if (_obj1.paths[j].Page != _obj2.paths[j].Page)
                            return true;

                        _points1 = _obj1.paths[j].Points;
                        _points2 = _obj2.paths[j].Points;

                        if (_points1.length != _points2.length)
                            return true;

                        for (var k = 0; k < _points1.length; k++)
                        {
                            if (Math.abs(_points1[k].X - _points2[k].X) > 0.00001 || Math.abs(_points1[k].Y - _points2[k].Y) > 0.00001)
                                return true;
                        }
                    }
                }
                else
                {
                    return true;
                }
            }

            return false;
        };

        this.DrawContentControlsTrack = function(overlay)
        {
            var ctx = overlay.m_oContext;
            ctx.strokeStyle = "#ADADAD";
            ctx.lineWidth = 1;

            var _object, _rect, _path;
            var _x, _y, _r, _b;
            var _transform, offset_x, offset_y;
            var _curPage;
            var _color;

            var isNoButtons = this.document.m_oLogicDocument ? this.document.m_oLogicDocument.IsFillingFormMode() : false;
            var buttonsCount = 0;
            var _pages = this.document.m_arrPages;

            for (var nIndexContentControl = 0; nIndexContentControl < this.ContentControlObjects.length; nIndexContentControl++)
            {
                _object = this.ContentControlObjects[nIndexContentControl];
                _transform = _object.transform;
                _curPage = _object.getPage();
                _color = _object.getColor();

                buttonsCount = _object.Buttons.length;
                if (isNoButtons)
                    buttonsCount = 0;

                if (_color)
                {
                    ctx.strokeStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", 1)";
                    ctx.fillStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", 0.25)";
                }
                else
                {
                    ctx.strokeStyle = "#ADADAD";
                    ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
                }


                offset_x = 0;
                offset_y = 0;
                if (_transform && global_MatrixTransformer.IsIdentity2(_transform))
                {
                    offset_x = _transform.tx;
                    offset_y = _transform.ty;
                    _transform = null;
                }

                if (!_transform)
                {
                    if (_object.rects)
                    {
                        for (var j = 0; j < _object.rects.length; j++)
                        {
                            _rect = _object.rects[j];

                            if (_rect.Page < this.m_lDrawingFirst || _rect.Page > this.m_lDrawingEnd)
                                continue;

                            var _page = _pages[_rect.Page];
                            var drPage = _page.drawingPage;

                            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                            ctx.beginPath();

                            _x = (drPage.left + dKoefX * (_rect.X + offset_x));
                            _y = (drPage.top + dKoefY * (_rect.Y + offset_y));
                            _r = (drPage.left + dKoefX * (_rect.R + offset_x));
                            _b = (drPage.top + dKoefY * (_rect.B + offset_y));

                            overlay.CheckRect(_x, _y, _r - _x, _b - _y);
                            ctx.rect((_x >> 0) + 0.5, (_y >> 0) + 0.5, (_r - _x) >> 0, (_b - _y) >> 0);

                            if (_object.type == AscCommon.ContentControlTrack.Hover)
                            {
                                //ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
                                ctx.fill();
                            }
                            ctx.stroke();

                            ctx.beginPath();
                        }
                    }
                    else if (_object.paths)
                    {
                        for (var j = 0; j < _object.paths.length; j++)
                        {
                            _path = _object.paths[j];
                            if (_path.Page < this.m_lDrawingFirst || _path.Page > this.m_lDrawingEnd)
                                continue;

                            var _page = _pages[_path.Page];
                            var drPage = _page.drawingPage;

                            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                            ctx.beginPath();

                            var Points = _path.Points;

                            var nCount = Points.length;
                            for (var nIndex = 0; nIndex < nCount; nIndex++)
                            {
                                _x = (drPage.left + dKoefX * (Points[nIndex].X + offset_x));
                                _y = (drPage.top + dKoefY * (Points[nIndex].Y + offset_y));

                                overlay.CheckPoint(_x, _y);

                                _x = (_x >> 0) + 0.5;
                                _y = (_y >> 0) + 0.5;

                                if (0 == nIndex)
                                    ctx.moveTo(_x, _y);
                                else
                                    ctx.lineTo(_x, _y);
                            }

                            ctx.closePath();

                            if (_object.type == AscCommon.ContentControlTrack.Hover)
                            {
                                //ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
                                ctx.fill();
                            }

                            ctx.stroke();
                            ctx.beginPath();
                        }
                    }
                }
                else
                {
                    if (_object.rects)
                    {
                        for (var j = 0; j < _object.rects.length; j++)
                        {
                            _rect = _object.rects[j];

                            if (_rect.Page < this.m_lDrawingFirst || _rect.Page > this.m_lDrawingEnd)
                                continue;

                            var x1 = _transform.TransformPointX(_rect.X, _rect.Y);
                            var y1 = _transform.TransformPointY(_rect.X, _rect.Y);

                            var x2 = _transform.TransformPointX(_rect.R, _rect.Y);
                            var y2 = _transform.TransformPointY(_rect.R, _rect.Y);

                            var x3 = _transform.TransformPointX(_rect.R, _rect.B);
                            var y3 = _transform.TransformPointY(_rect.R, _rect.B);

                            var x4 = _transform.TransformPointX(_rect.X, _rect.B);
                            var y4 = _transform.TransformPointY(_rect.X, _rect.B);

                            var _page = _pages[_rect.Page];
                            var drPage = _page.drawingPage;

                            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                            x1 = drPage.left + dKoefX * x1;
                            x2 = drPage.left + dKoefX * x2;
                            x3 = drPage.left + dKoefX * x3;
                            x4 = drPage.left + dKoefX * x4;

                            y1 = drPage.top + dKoefY * y1;
                            y2 = drPage.top + dKoefY * y2;
                            y3 = drPage.top + dKoefY * y3;
                            y4 = drPage.top + dKoefY * y4;

                            ctx.beginPath();

                            overlay.CheckPoint(x1, y1);
                            overlay.CheckPoint(x2, y2);
                            overlay.CheckPoint(x3, y3);
                            overlay.CheckPoint(x4, y4);

                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.lineTo(x3, y3);
                            ctx.lineTo(x4, y4);
                            ctx.closePath();

                            if (_object.type == AscCommon.ContentControlTrack.Hover)
                            {
                                //ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
                                ctx.fill();
                            }
                            ctx.stroke();

                            ctx.beginPath();
                        }
                    }
                    else if (_object.paths)
                    {
                        for (var j = 0; j < _object.paths.length; j++)
                        {
                            _path = _object.paths[j];
                            if (_path.Page < this.m_lDrawingFirst || _path.Page > this.m_lDrawingEnd)
                                continue;

                            var _page = _pages[_path.Page];
                            var drPage = _page.drawingPage;

                            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                            ctx.beginPath();

                            var Points = _path.Points;

                            var nCount = Points.length;
                            for (var nIndex = 0; nIndex < nCount; nIndex++)
                            {
                                var _x = _transform.TransformPointX(Points[nIndex].X, Points[nIndex].Y);
                                var _y = _transform.TransformPointY(Points[nIndex].X, Points[nIndex].Y);

                                _x = (drPage.left + dKoefX * _x);
                                _y = (drPage.top + dKoefY * _y);

                                overlay.CheckPoint(_x, _y);

                                if (0 == nIndex)
                                    ctx.moveTo(_x, _y);
                                else
                                    ctx.lineTo(_x, _y);
                            }

                            ctx.closePath();

                            if (_object.type == AscCommon.ContentControlTrack.Hover)
                            {
                                //ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
                                ctx.fill();
                            }

                            ctx.stroke();
                            ctx.beginPath();
                        }
                    }
                }

                if (_object.type == AscCommon.ContentControlTrack.In)
                {
                    if (_curPage < this.m_lDrawingFirst || _curPage > this.m_lDrawingEnd)
                        continue;

                    _rect = _object.getXY();
                    var _page = _pages[_curPage];
                    var drPage = _page.drawingPage;

                    var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                    var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                    if (!_transform)
                    {
                        _x = (drPage.left 	+ dKoefX * (_rect.X + offset_x));
                        _y = (drPage.top 	+ dKoefY * (_rect.Y + offset_y));

                        _x = ((_x >> 0) + 0.5) - 15;
                        _y = ((_y >> 0) + 0.5);

                        var nAdvancedL = 0;
                        var nAdvancedLB = 0;

                        if (_object.Name == "" && 0 == buttonsCount)
                        {
                            if (!isNoButtons)
                            {
                                ctx.rect(_x, _y, 15, 20);
                                overlay.CheckRect(_x, _y, 15, 20);

                                ctx.fillStyle = (1 == this.ContentControlObjectState) ? AscCommonWord.GlobalSkin.ContentControlsAnchorActive : AscCommonWord.GlobalSkin.ContentControlsBack;

                                ctx.fill();
                                ctx.stroke();
                            }
                        }
                        else
                        {
                            _x += 15;
                            _y -= 20;

                            var widthControl = 0;

                            if (_object.Name != "")
                            {
                                ctx.font = this.getFont();
                                widthControl += (this.measure(_object.Name, ctx) >> 0);
                                widthControl += 6; // 3 + 3
                                if (_object.NameButtonAdvanced && !isNoButtons)
                                {
                                    nAdvancedL = _x + 15 + widthControl;
                                    widthControl += 5;
                                    widthControl += 3;
                                }
                                else
                                    widthControl += 3;
                            }

                            _object.NameWidth = widthControl;

                            nAdvancedLB = _x + widthControl;
                            if (!isNoButtons)
                                nAdvancedLB += 15;

                            widthControl += (20 * buttonsCount);

                            var _textNameOffset = 15;
                            if (isNoButtons)
                                _textNameOffset = 0;

                            overlay.CheckRect(_x, _y, _textNameOffset + widthControl, 20);

                            ctx.beginPath();

                            var _fillStyleSetup = (1 == this.ContentControlObjectState) ? AscCommonWord.GlobalSkin.ContentControlsAnchorActive : AscCommonWord.GlobalSkin.ContentControlsBack;
                            var _fillStyle = "";
                            var _fillX = _x;
                            var _fillW = isNoButtons ? 0 : 15;
                            if (_object.NameWidth != 0)
                            {
                                if (_object.ActiveButtonIndex == -1)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsActive;
                                else if (_object.HoverButtonIndex == -1)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsHover;
                                else
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsBack;

                                if (_fillStyle != _fillStyleSetup)
                                {
                                    ctx.rect(_fillX, _y, _fillW, 20);
                                    _fillX = _fillX + _fillW;
                                    _fillW = 0;

                                    ctx.fillStyle = _fillStyleSetup;
                                    ctx.fill();
                                    ctx.beginPath();
                                }
                                _fillW += _object.NameWidth;
                                _fillStyleSetup = _fillStyle;
                            }

                            for (var nIndexB = 0; nIndexB < buttonsCount; nIndexB++)
                            {
                                if (_object.ActiveButtonIndex == nIndexB)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsActive;
                                else if (_object.HoverButtonIndex == nIndexB)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsHover;
                                else
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsBack;

                                if (_fillStyle != _fillStyleSetup)
                                {
                                    ctx.rect(_fillX, _y, _fillW, 20);
                                    _fillX = _fillX + _fillW;
                                    _fillW = 0;

                                    ctx.fillStyle = _fillStyleSetup;
                                    ctx.fill();
                                    ctx.beginPath();
                                }

                                _fillW += 20;
                                _fillStyleSetup = _fillStyle;
                            }

                            ctx.rect(_fillX, _y, _fillW, 20);
                            ctx.fillStyle = _fillStyleSetup;
                            ctx.fill();
                            _fillX = _fillX + _fillW;
                            _fillW = 0;

                            ctx.beginPath();
                            if (!isNoButtons)
                                ctx.rect(_x, _y, 15 + widthControl, 20);
                            else
                                ctx.rect(_x, _y, widthControl, 20);
                            ctx.stroke();
                        }

                        ctx.beginPath();

                        if (_object.Name != "")
                        {
                            ctx.fillStyle = (_object.ActiveButtonIndex == -1) ? AscCommonWord.GlobalSkin.ContentControlsTextActive : AscCommonWord.GlobalSkin.ContentControlsText;

                            ctx.fillText(_object.Name, _x + _textNameOffset + 3, _y + 20 - 6);

                            if (_object.NameButtonAdvanced && !isNoButtons)
                            {
                                nAdvancedL = (nAdvancedL + 0.5) >> 0;
                                var nY = _y - 0.5;
                                nY += 10;
                                nY -= 1;

                                var plus = AscCommon.AscBrowser.isRetina ? 0.5 : 1;

                                for (var i = 0; i <= 2; i+=plus)
                                    ctx.rect(nAdvancedL + i, nY + i, 1, 1);

                                for (var i = 0; i <= 2; i+=plus)
                                    ctx.rect(nAdvancedL + 4 - i, nY + i, 1, 1);

                                ctx.fill();
                                ctx.beginPath();
                            }
                        }

                        var _yCell = _y;
                        if (!AscCommon.AscBrowser.isRetina)
                            _yCell = 1 + (_y >> 0);

                        for (var nIndexB = 0; nIndexB < buttonsCount; nIndexB++)
                        {
                            var image = this.icons.getImage(_object.Buttons[nIndexB], nIndexB == _object.ActiveButtonIndex);
                            if (image)
                                ctx.drawImage(image, nAdvancedLB >> 0, _yCell, 20, 20);
                            nAdvancedLB += 20;
                        }

                        if (!isNoButtons)
                        {
                            var cx = _x - 0.5 + 4;
                            var cy = _y - 0.5 + 4;

                            var _color1 = "#ADADAD";
                            var _color2 = "#D4D4D4";

                            if (0 == this.ContentControlObjectState || 1 == this.ContentControlObjectState) {
                                _color1 = "#444444";
                                _color2 = "#9D9D9D";
                            }

                            overlay.AddRect(cx, cy, 3, 3);
                            overlay.AddRect(cx + 5, cy, 3, 3);
                            overlay.AddRect(cx, cy + 5, 3, 3);
                            overlay.AddRect(cx + 5, cy + 5, 3, 3);
                            overlay.AddRect(cx, cy + 10, 3, 3);
                            overlay.AddRect(cx + 5, cy + 10, 3, 3);

                            ctx.fillStyle = _color2;
                            ctx.fill();
                            ctx.beginPath();

                            ctx.moveTo(cx + 1.5, cy);
                            ctx.lineTo(cx + 1.5, cy + 3);
                            ctx.moveTo(cx + 6.5, cy);
                            ctx.lineTo(cx + 6.5, cy + 3);
                            ctx.moveTo(cx + 1.5, cy + 5);
                            ctx.lineTo(cx + 1.5, cy + 8);
                            ctx.moveTo(cx + 6.5, cy + 5);
                            ctx.lineTo(cx + 6.5, cy + 8);
                            ctx.moveTo(cx + 1.5, cy + 10);
                            ctx.lineTo(cx + 1.5, cy + 13);
                            ctx.moveTo(cx + 6.5, cy + 10);
                            ctx.lineTo(cx + 6.5, cy + 13);

                            ctx.moveTo(cx, cy + 1.5);
                            ctx.lineTo(cx + 3, cy + 1.5);
                            ctx.moveTo(cx + 5, cy + 1.5);
                            ctx.lineTo(cx + 8, cy + 1.5);
                            ctx.moveTo(cx, cy + 6.5);
                            ctx.lineTo(cx + 3, cy + 6.5);
                            ctx.moveTo(cx + 5, cy + 6.5);
                            ctx.lineTo(cx + 8, cy + 6.5);
                            ctx.moveTo(cx, cy + 11.5);
                            ctx.lineTo(cx + 3, cy + 11.5);
                            ctx.moveTo(cx + 5, cy + 11.5);
                            ctx.lineTo(cx + 8, cy + 11.5);

                            ctx.strokeStyle = _color1;
                            ctx.stroke();
                        }
                        ctx.beginPath();
                    }
                    else
                    {
                        var _x = _rect.X - (15 / dKoefX);
                        var _y = _rect.Y;
                        var _r = _rect.X;
                        var _b = _rect.Y + (20 / dKoefY);

                        var nAdvancedL = 0;
                        var nAdvancedLB = 0;
                        if (_object.Name != "" || 0 != buttonsCount && !isNoButtons)
                        {
                            _x = _rect.X;
                            _y = _rect.Y - (20 / dKoefY);
                            _b = _rect.Y;

                            var widthControl = 0;

                            if (_object.Name != 0)
                            {
                                ctx.font = this.getFont();
                                widthControl += (this.measure(_object.Name, ctx) + 3);
                                widthControl += 6; // 3 + 3
                                if (_object.NameButtonAdvanced && !isNoButtons)
                                {
                                    nAdvancedL = 15 + widthControl;
                                    widthControl += 5;
                                    widthControl += 3;
                                }
                                else
                                    widthControl += 3;
                            }

                            _object.NameWidth = widthControl;

                            nAdvancedLB = widthControl;
                            if (!isNoButtons)
                                nAdvancedLB += 15;

                            widthControl += (20 * buttonsCount);

                            if (!isNoButtons)
                                _r = _x + ((15 + widthControl) / dKoefX);
                            else
                                _r = _x + (widthControl / dKoefX);
                        }

                        var x1 = _transform.TransformPointX(_x, _y);
                        var y1 = _transform.TransformPointY(_x, _y);

                        var x2 = _transform.TransformPointX(_r, _y);
                        var y2 = _transform.TransformPointY(_r, _y);

                        var x3 = _transform.TransformPointX(_r, _b);
                        var y3 = _transform.TransformPointY(_r, _b);

                        var x4 = _transform.TransformPointX(_x, _b);
                        var y4 = _transform.TransformPointY(_x, _b);

                        x1 = drPage.left + dKoefX * x1;
                        x2 = drPage.left + dKoefX * x2;
                        x3 = drPage.left + dKoefX * x3;
                        x4 = drPage.left + dKoefX * x4;

                        y1 = drPage.top + dKoefY * y1;
                        y2 = drPage.top + dKoefY * y2;
                        y3 = drPage.top + dKoefY * y3;
                        y4 = drPage.top + dKoefY * y4;

                        overlay.CheckPoint(x1, y1);
                        overlay.CheckPoint(x2, y2);
                        overlay.CheckPoint(x3, y3);
                        overlay.CheckPoint(x4, y4);

                        ctx.beginPath();

                        if (_object.Name == "" && 0 == buttonsCount)
                        {
                            if (!isNoButtons)
                            {
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.lineTo(x3, y3);
                                ctx.lineTo(x4, y4);
                                ctx.closePath();

                                ctx.fillStyle = (1 == this.ContentControlObjectState) ? AscCommonWord.GlobalSkin.ContentControlsAnchorActive : AscCommonWord.GlobalSkin.ContentControlsBack;
                                ctx.fill();
                                ctx.stroke();
                            }
                        }
                        else
                        {
                            var _ft = new AscCommon.CMatrix();
                            _ft.sx = _transform.sx;
                            _ft.shx = _transform.shx;
                            _ft.shy = _transform.shy;
                            _ft.sy = _transform.sy;
                            _ft.tx = _transform.tx;
                            _ft.ty = _transform.ty;

                            var coords = new AscCommon.CMatrix();
                            coords.sx = dKoefX;
                            coords.sy = dKoefY;
                            coords.tx = drPage.left;
                            coords.ty = drPage.top;

                            global_MatrixTransformer.MultiplyAppend(_ft, coords);

                            ctx.transform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);

                            var _fillStyleSetup = (1 == this.ContentControlObjectState) ? AscCommonWord.GlobalSkin.ContentControlsAnchorActive : AscCommonWord.GlobalSkin.ContentControlsBack;
                            var _fillStyle = "";
                            var _fillX = _x;
                            var _fillW = isNoButtons ? 0 : 15;
                            if (_object.Name != "")
                            {
                                if (_object.NameWidth != 0)
                                {
                                    if (_object.ActiveButtonIndex == -1)
                                        _fillStyle = AscCommonWord.GlobalSkin.ContentControlsActive;
                                    else if (_object.HoverButtonIndex == -1)
                                        _fillStyle = AscCommonWord.GlobalSkin.ContentControlsHover;
                                    else
                                        _fillStyle = AscCommonWord.GlobalSkin.ContentControlsBack;

                                    if (_fillStyle != _fillStyleSetup)
                                    {
                                        ctx.rect(_fillX, _y, _fillW / dKoefX, 20 / dKoefY);
                                        _fillX = _fillX + _fillW / dKoefX;
                                        _fillW = 0;

                                        ctx.fillStyle = _fillStyleSetup;
                                        ctx.fill();
                                        ctx.beginPath();
                                    }

                                    _fillW += _object.NameWidth;
                                    _fillStyleSetup = _fillStyle;
                                }
                            }

                            for (var nIndexB = 0; nIndexB < buttonsCount; nIndexB++)
                            {
                                if (_object.ActiveButtonIndex == nIndexB)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsActive;
                                else if (_object.HoverButtonIndex == nIndexB)
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsHover;
                                else
                                    _fillStyle = AscCommonWord.GlobalSkin.ContentControlsBack;

                                if (_fillStyle != _fillStyleSetup)
                                {
                                    ctx.rect(_fillX, _y, _fillW / dKoefX, 20 / dKoefY);
                                    _fillX = _fillX + _fillW / dKoefX;
                                    _fillW = 0;

                                    ctx.fillStyle = _fillStyleSetup;
                                    ctx.fill();
                                    ctx.beginPath();
                                }

                                _fillW += 20;
                                _fillStyleSetup = _fillStyle;
                            }

                            ctx.rect(_fillX, _y, _fillW / dKoefX, 20 / dKoefY);
                            ctx.fillStyle = _fillStyleSetup;
                            ctx.fill();
                            _fillX = _fillX + _fillW / dKoefX;
                            _fillW = 0;

                            ctx.beginPath();

                            if (_object.Name != "")
                            {
                                ctx.fillStyle = (_object.ActiveButtonIndex == -1) ? AscCommonWord.GlobalSkin.ContentControlsTextActive : AscCommonWord.GlobalSkin.ContentControlsText;

                                ctx.font = this.getFont(dKoefY);
                                var _offset15 = isNoButtons ? 0 : 15;
                                ctx.fillText(_object.Name, _x + (_offset15 + 3) / dKoefX, _y + (20 - 6) / dKoefY);

                                if (_object.NameButtonAdvanced && !isNoButtons)
                                {
                                    var nY = _y;
                                    nY += 9 / dKoefY;

                                    for (var i = 0; i < 3; i++)
                                        ctx.rect(_x + (nAdvancedL + i) / dKoefX, nY + i / dKoefY, 1 / dKoefX, 1 / dKoefY);

                                    for (var i = 0; i < 2; i++)
                                        ctx.rect(_x + (nAdvancedL + 4 - i) / dKoefX, nY + i / dKoefY, 1 / dKoefX, 1 / dKoefY);

                                    ctx.fill();
                                    ctx.beginPath();
                                }
                            }

                            for (var nIndexB = 0; nIndexB < buttonsCount; nIndexB++)
                            {
                                var image = this.icons.getImage(_object.Buttons[nIndexB], nIndexB == _object.ActiveButtonIndex);
                                if (image)
                                    ctx.drawImage(image, _x + nAdvancedLB / dKoefX, _y, 20 / dKoefX, 20 / dKoefY);
                                nAdvancedLB += 20;
                            }

                            overlay.SetBaseTransform();

                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.lineTo(x3, y3);
                            ctx.lineTo(x4, y4);
                            ctx.closePath();

                            ctx.stroke();
                        }

                        ctx.beginPath();

                        if (!isNoButtons)
                        {
                            var cx1 = _x + 5 / dKoefX;
                            var cy1 = _y + 5 / dKoefY;
                            var cx2 = _x + 10 / dKoefX;
                            var cy2 = _y + 5 / dKoefY;

                            var cx3 = _x + 5 / dKoefX;
                            var cy3 = _y + 10 / dKoefY;
                            var cx4 = _x + 10 / dKoefX;
                            var cy4 = _y + 10 / dKoefY;

                            var cx5 = _x + 5 / dKoefX;
                            var cy5 = _y + 15 / dKoefY;
                            var cx6 = _x + 10 / dKoefX;
                            var cy6 = _y + 15 / dKoefY;

                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx1, cy1), drPage.top + dKoefY * _transform.TransformPointY(cx1, cy1), 1.5);
                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx2, cy2), drPage.top + dKoefY * _transform.TransformPointY(cx2, cy2), 1.5);
                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx3, cy3), drPage.top + dKoefY * _transform.TransformPointY(cx3, cy3), 1.5);
                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx4, cy4), drPage.top + dKoefY * _transform.TransformPointY(cx4, cy4), 1.5);
                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx5, cy5), drPage.top + dKoefY * _transform.TransformPointY(cx5, cy5), 1.5);
                            overlay.AddEllipse(drPage.left + dKoefX * _transform.TransformPointX(cx6, cy6), drPage.top + dKoefY * _transform.TransformPointY(cx6, cy6), 1.5);

                            var _color1 = "#ADADAD";
                            if (0 == this.ContentControlObjectState || 1 == this.ContentControlObjectState)
                                _color1 = "#444444";

                            ctx.fillStyle = _color1;
                            ctx.fill();
                            ctx.beginPath();
                        }
                    }
                }
            }

            this.ContentControlsSaveLast();
        };

        this.OnDrawContentControl = function(id, type, rects, transform, name, name_advanced, button_types, color)
        {
            var isActiveRemove = false;
            // всегда должен быть максимум один hover и in
            for (var i = 0; i < this.ContentControlObjects.length; i++)
            {
                if (type == this.ContentControlObjects[i].type)
                {
                    if (-2 != this.ContentControlObjects[i].ActiveButtonIndex)
                        isActiveRemove = true;

                    this.ContentControlObjects.splice(i, 1);
                    i--;
                }
            }

            if (null == id || !rects || rects.length == 0)
            {
                if (isActiveRemove)
                    this.document.m_oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
                return;
            }

            if (type == AscCommon.ContentControlTrack.In)
            {
                if (this.ContentControlObjects.length != 0 && this.ContentControlObjects[0].id == id)
                {
                    if (-2 != this.ContentControlObjects[0].ActiveButtonIndex)
                        isActiveRemove = true;

                    this.ContentControlObjects.splice(0, 1);
                }
                if (this.document.m_oWordControl.m_oApi.isViewMode)
                    this.ContentControlObjects.push(new CContentControlTrack(id, type, rects, transform, name, undefined, undefined, color));
                else
                    this.ContentControlObjects.push(new CContentControlTrack(id, type, rects, transform, name, name_advanced, button_types, color));
            }
            else
            {
                if (this.ContentControlObjects.length != 0 && this.ContentControlObjects[0].id == id)
                    return;

                if (this.document.m_oWordControl.m_oApi.isViewMode)
                    this.ContentControlObjects.push(new CContentControlTrack(id, type, rects, transform, name, undefined, undefined, color));
                else
                    this.ContentControlObjects.push(new CContentControlTrack(id, type, rects, transform, name, name_advanced, button_types, color));
            }

            if (isActiveRemove)
                this.document.m_oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
        };

        this.onPointerDown = function(pos)
        {
            var oWordControl = this.document.m_oWordControl;
            var isNoButtons = this.document.m_oLogicDocument ? this.document.m_oLogicDocument.IsFillingFormMode() : false;

            for (var i = 0; i < this.ContentControlObjects.length; i++)
            {
                var _content_control = this.ContentControlObjects[i];
                var _content_control_buttons_len = _content_control.Buttons.length;
                if (isNoButtons)
                    _content_control_buttons_len = 0;

                if (_content_control.type == AscCommon.ContentControlTrack.In)
                {
                    var _rect = _content_control.getXY();

                    var _page = this.document.m_arrPages[_content_control.getPage()];
                    if (!_page)
                        return false;

                    var drPage = _page.drawingPage;

                    var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                    var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                    var _x = _rect.X - (15 / dKoefX);
                    var _y = _rect.Y;
                    var _r = _rect.X;
                    var _b = _rect.Y + (20 / dKoefY);

                    if (_content_control.Name != "" || 0 != _content_control_buttons_len)
                    {
                        _x = _rect.X;
                        _y = _rect.Y - (20 / dKoefY);
                        _r = _rect.X + (15 / dKoefX);
                        _b = _rect.Y;
                    }

                    var posX = pos.X;
                    var posY = pos.Y;

                    var _transform = _content_control.transform;
                    if (_transform && global_MatrixTransformer.IsIdentity2(_transform))
                    {
                        _x += _transform.tx;
                        _y += _transform.ty;
                        _r += _transform.tx;
                        _b += _transform.ty;

                        _transform = null;
                    }
                    if (_transform)
                    {
                        var _invert = global_MatrixTransformer.Invert(_transform);
                        posX = _invert.TransformPointX(pos.X, pos.Y);
                        posY = _invert.TransformPointY(pos.X, pos.Y);
                    }

                    if (posX > _x && posX < _r && posY > _y && posY < _b)
                    {
                        oWordControl.m_oLogicDocument.SelectContentControl(_content_control.id);
                        this.ContentControlObjectState = 1;
                        this.ContentControlSmallChangesCheck.X = pos.X;
                        this.ContentControlSmallChangesCheck.Y = pos.Y;
                        this.ContentControlSmallChangesCheck.Page = pos.Page;
                        this.ContentControlSmallChangesCheck.IsSmall = true;

                        //this.document.InlineTextTrackEnabled = true;
                        this.document.InlineTextTrack = null;
                        this.document.InlineTextTrackPage = -1;

                        oWordControl.ShowOverlay();
                        oWordControl.OnUpdateOverlay();
                        oWordControl.EndUpdateOverlay();

                        this.document.LockCursorType("default");
                        return true;
                    }
                    else if (_content_control.NameButtonAdvanced && !isNoButtons && posX > _r && posX < (_r + _content_control.NameWidth / dKoefX) && posY > _y && posY < _b)
                    {
                        if (_content_control.ActiveButtonIndex == -1)
                        {
                            _content_control.ActiveButtonIndex = -2;
                            oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
                        }
                        else
                        {
                            _content_control.ActiveButtonIndex = -1;

                            var xCC = _r;
                            var yCC = _b;
                            if (_transform)
                            {
                                xCC = _transform.TransformPointX(_r, _b);
                                yCC = _transform.TransformPointY(_r, _b);
                            }

                            var posOnScreen = this.document.ConvertCoordsToCursorWR(xCC, yCC, _content_control.getPage());
                            oWordControl.m_oApi.sendEvent("asc_onShowContentControlsActions", 0, posOnScreen.X, posOnScreen.Y);
                        }

                        oWordControl.ShowOverlay();
                        oWordControl.OnUpdateOverlay();
                        oWordControl.EndUpdateOverlay();

                        this.document.LockCursorType("default");
                        return true;
                    }
                    else
                    {
                        var _posR = _r + _content_control.NameWidth / dKoefX;
                        for (var indexB = 0; indexB < _content_control_buttons_len; indexB++)
                        {
                            if (posX > _posR && posX < (_posR + 20 / dKoefX) && posY > _y && posY < _b)
                            {
                                if (_content_control.ActiveButtonIndex == indexB)
                                {
                                    _content_control.ActiveButtonIndex = -2;
                                    oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
                                }
                                else
                                {
                                    _content_control.ActiveButtonIndex = indexB;

                                    var xCC = _posR;
                                    var yCC = _b;
                                    if (_transform)
                                    {
                                        xCC = _transform.TransformPointX(_posR, _b);
                                        yCC = _transform.TransformPointY(_posR, _b);
                                    }

                                    var posOnScreen = this.document.ConvertCoordsToCursorWR(xCC, yCC, _content_control.getPage());
                                    oWordControl.m_oApi.sendEvent("asc_onShowContentControlsActions", indexB + 1, posOnScreen.X, posOnScreen.Y);
                                }

                                oWordControl.ShowOverlay();
                                oWordControl.OnUpdateOverlay();
                                oWordControl.EndUpdateOverlay();

                                this.document.LockCursorType("default");
                                return true;
                            }
                            _posR += (20 / dKoefX);
                        }
                    }

                    break;
                }
            }

            return false;
        };

        this.checkSmallChanges = function(pos)
        {
            if (!this.ContentControlSmallChangesCheck.IsSmall)
                return;

            if (pos.Page != this.ContentControlSmallChangesCheck.Page ||
                Math.abs(pos.X - this.ContentControlSmallChangesCheck.X) > this.ContentControlSmallChangesCheck.Min ||
                Math.abs(pos.Y - this.ContentControlSmallChangesCheck.Y) > this.ContentControlSmallChangesCheck.Min)
            {
                this.ContentControlSmallChangesCheck.IsSmall = false;
            }
        };

        this.isInlineTrack = function()
        {
            return (this.ContentControlObjectState == 1) ? true : false;
        };

        this.onPointerMove = function(pos)
        {
            var oWordControl = this.document.m_oWordControl;
            var isNoButtons = oWordControl.m_oLogicDocument ? oWordControl.m_oLogicDocument.IsFillingFormMode() : false;

            var _content_control = null;
            var isChangeHover = false;
            for (var i = 0; i < this.ContentControlObjects.length; i++)
            {
                if (-2 != this.ContentControlObjects[i].HoverButtonIndex)
                    isChangeHover = true;
                this.ContentControlObjects[i].HoverButtonIndex = -2;
                if (this.ContentControlObjects[i].type == AscCommon.ContentControlTrack.In)
                {
                    _content_control = this.ContentControlObjects[i];
                    break;
                }
            }

            if (_content_control && pos.Page == _content_control.getPage())
            {
                var _content_control_buttons_len = _content_control.Buttons.length;
                if (isNoButtons)
                    _content_control_buttons_len = 0;

                if (1 == this.ContentControlObjectState)
                {
                    if (pos.Page == this.ContentControlSmallChangesCheck.Page &&
                        Math.abs(pos.X - this.ContentControlSmallChangesCheck.X) < this.ContentControlSmallChangesCheck.Min &&
                        Math.abs(pos.Y - this.ContentControlSmallChangesCheck.Y) < this.ContentControlSmallChangesCheck.Min)
                    {
                        oWordControl.ShowOverlay();
                        oWordControl.OnUpdateOverlay();
                        oWordControl.EndUpdateOverlay();
                        return true;
                    }

                    this.document.InlineTextTrackEnabled = true;
                    this.ContentControlSmallChangesCheck.IsSmall = false;

                    this.document.InlineTextTrack = oWordControl.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
                    this.document.InlineTextTrackPage = pos.Page;

                    oWordControl.ShowOverlay();
                    oWordControl.OnUpdateOverlay();
                    oWordControl.EndUpdateOverlay();
                    return true;
                }

                var _page = this.document.m_arrPages[pos.Page];
                var drPage = _page.drawingPage;

                var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
                var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;

                var rect = _content_control.getXY();
                var _x = rect.X - (15 / dKoefX);
                var _y = rect.Y;
                var _r = rect.X;
                var _b = rect.Y + (20 / dKoefY);

                if (_content_control.Name != "" || 0 != _content_control_buttons_len)
                {
                    _x = rect.X;
                    _y = rect.Y - (20 / dKoefY);
                    _r = rect.X + (15 / dKoefX);
                    _b = rect.Y;
                }

                var posX = pos.X;
                var posY = pos.Y;

                var _transform = _content_control.transform;
                if (_transform && global_MatrixTransformer.IsIdentity2(_transform))
                {
                    _x += _transform.tx;
                    _y += _transform.ty;
                    _r += _transform.tx;
                    _b += _transform.ty;

                    _transform = null;
                }
                if (_transform)
                {
                    var _invert = global_MatrixTransformer.Invert(_transform);
                    posX = _invert.TransformPointX(pos.X, pos.Y);
                    posY = _invert.TransformPointY(pos.X, pos.Y);
                }

                var _old = this.ContentControlObjectState;
                this.ContentControlObjectState = -1;
                if (posX > _x && posX < _r && posY > _y && posY < _b)
                {
                    this.ContentControlObjectState = 0;
                    oWordControl.ShowOverlay();
                    oWordControl.OnUpdateOverlay();
                    oWordControl.EndUpdateOverlay();

                    this.document.SetCursorType("default");

                    oWordControl.m_oApi.sync_MouseMoveStartCallback();
                    oWordControl.m_oApi.sync_MouseMoveEndCallback();
                    return true;
                }
                else if (_content_control.NameButtonAdvanced && !isNoButtons && posX > _r && posX < (_r + _content_control.NameWidth / dKoefX) && posY > _y && posY < _b)
                {
                    _content_control.HoverButtonIndex = -1;
                    oWordControl.ShowOverlay();
                    oWordControl.OnUpdateOverlay();
                    oWordControl.EndUpdateOverlay();

                    this.document.SetCursorType("default");

                    oWordControl.m_oApi.sync_MouseMoveStartCallback();
                    oWordControl.m_oApi.sync_MouseMoveEndCallback();
                    return true;
                }
                else
                {
                    var _posR = _r + _content_control.NameWidth / dKoefX;
                    for (var indexB = 0; indexB < _content_control_buttons_len; indexB++)
                    {
                        if (posX > _posR && posX < (_posR + 20 / dKoefX) && posY > _y && posY < _b)
                        {
                            _content_control.HoverButtonIndex = indexB;
                            oWordControl.ShowOverlay();
                            oWordControl.OnUpdateOverlay();
                            oWordControl.EndUpdateOverlay();

                            this.document.SetCursorType("default");

                            oWordControl.m_oApi.sync_MouseMoveStartCallback();
                            oWordControl.m_oApi.sync_MouseMoveEndCallback();
                            return true;
                        }
                        _posR += (20 / dKoefX);
                    }
                }

                if (_old != this.ContentControlObjectState)
                    oWordControl.OnUpdateOverlay();
            }

            if (isChangeHover)
                oWordControl.OnUpdateOverlay();

            return false;
        };

        this.onPointerUp = function(pos)
        {
            var oWordControl = this.document.m_oWordControl;

            var oldContentControlSmall = this.ContentControlSmallChangesCheck.IsSmall;
            this.ContentControlSmallChangesCheck.IsSmall = true;

            if (this.ContentControlObjectState == 1)
            {
                for (var i = 0; i < this.ContentControlObjects.length; i++)
                {
                    var _object = this.ContentControlObjects[i];
                    if (_object.type == AscCommon.ContentControlTrack.In)
                    {
                        if (this.document.InlineTextTrackEnabled)
                        {
                            if (this.document.InlineTextTrack && !oldContentControlSmall) // значит был MouseMove
                            {
                                this.document.InlineTextTrack = oWordControl.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
                                this.document.m_oLogicDocument.OnContentControlTrackEnd(_object.id, this.document.InlineTextTrack, AscCommon.global_keyboardEvent.CtrlKey);
                                this.document.InlineTextTrackEnabled = false;
                                this.document.InlineTextTrack = null;
                                this.document.InlineTextTrackPage = -1;
                            }
                            else
                            {
                                this.document.InlineTextTrackEnabled = false;
                            }
                        }
                        break;
                    }
                }

                this.ContentControlObjectState = 0;
                oWordControl.ShowOverlay();
                oWordControl.OnUpdateOverlay();
                oWordControl.EndUpdateOverlay();
                return true;
            }

            return false;
        }
    }

    AscCommon.DrawingContentControls = ContentControls;

})(window);