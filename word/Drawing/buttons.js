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

	Placeholder.prototype.isInside = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
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
				return i;
		}

		return -1;
    };

    Placeholder.prototype.onPointerDown = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
    {
        var indexButton = this.isInside(x, y, pixelsRect, pageWidthMM, pageHeightMM);

		if (-1 == indexButton)
			return false;

		if (this.states[indexButton] == AscCommon.PlaceholderButtonState.Active)
        {
            this.states[indexButton] = AscCommon.PlaceholderButtonState.Over;
            this.events.document.m_oWordControl.OnUpdateOverlay();
            this.events.document.m_oWordControl.EndUpdateOverlay();

            this.events.closeCallback(this.buttons[indexButton], this);
            return;
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

		this.events.callCallback(this.buttons[indexButton], this);
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
        //this.icons.register(AscCommon.PlaceholderButtonType.ImageUrl, "image_url");
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

    Placeholders.prototype.draw = function(overlay, page, pixelsRect, pageWidthMM, pageHeightMM)
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].anchor.page != page)
                continue;

            this.objects[i].draw(overlay, pixelsRect, pageWidthMM, pageHeightMM);
        }
    };

    Placeholders.prototype.onPointerDown = function(x, y, page, pixelsRect, pageWidthMM, pageHeightMM)
	{
		for (var i = 0; i < this.objects.length; i++)
		{
		    if (this.objects[i].anchor.page != page)
		        continue;

			if (this.objects[i].onPointerDown(x, y, pixelsRect, pageWidthMM, pageHeightMM))
				return true;
		}
		return false;
	};

    Placeholders.prototype.onPointerMove = function(x, y, page, pixelsRect, pageWidthMM, pageHeightMM)
    {
        var checker = { isNeedUpdateOverlay : false };
        var isButton = false;
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].anchor.page != page)
                continue;

            isButton |= this.objects[i].onPointerMove(x, y, pixelsRect, pageWidthMM, pageHeightMM, checker);
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

    Placeholders.prototype.onPointerUp = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
    {
        return false;
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

			t1 = this.objects[i].rect;
            t2 = objects[i].rect;

            if (Math.abs(t1.x - t2.x) > 0.001 || Math.abs(t1.y - t2.y) > 0.001 ||
                Math.abs(t1.w - t2.w) > 0.001 || Math.abs(t1.h - t2.h) > 0.001)
            	return this._onUpdate(objects);

            t1 = this.objects[i].transform;
            t2 = objects[i].transform;

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

})(window);