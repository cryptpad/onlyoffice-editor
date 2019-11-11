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
		Video : 1,
		Chart : 2,
		Table : 3
	};

    AscCommon.PlaceholderButtonState = {
        None : 0,
        Active : 1,
        Over : 2
    };

    var ButtonSize1x = 28;
    var ButtonBetweenSize1x = 16;

    function PlaceholderIcons()
    {
        function PI()
        {
            this.images = [];
            this.load = function(type, url);
            {
                this.images[0] = new Image();
                this.images[0].onload = function() { this.asc_complete = true; };
                this.images[0].src = "../../../../sdkjs/common/Images/content_control_" + url + ".png";

                this.images[2] = new Image();
                this.images[2].onload = function() { this.asc_complete = true; };
                this.images[2].src = "../../../../sdkjs/common/Images/content_control_" + url + "_2x.png";
            };
            this.get = function()
            {
                var index = AscCommon.AscBrowser.isRetina ? 1 : 0;
                return this.images[index].asc_complete ? this.images[index] : null;
            };
        }

        this.images = [];

        this.register = function(type, url)
        {
            this.images[type] = new PI();
            this.images[type].load(type, url);
        };
        this.get = function(type)
        {
        	return this.images[type] ? this.images[type].get() : null;
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

	// расчет всех ректов кнопок
    Placeholder.prototype.getButtonRects = function()
	{
        var ButtonSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);
        var ButtonBetweenSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonBetweenSize1x, true);

		// максимум 2 ряда
		var buttonsCount = this.buttons.length;
		var countColumn = (buttonsCount < 3) ? buttonsCount : (this.buttons.length + 1) >> 1;

		var xStart = this.anchor.rect.x + (this.anchor.rect.w - (countColumn * ButtonSize + (countColumn - 1) * ButtonBetweenSize)) >> 1;
		var yStart = this.anchor.rect.y + ((buttonsCount == countColumn) ? (this.anchor.rect.h - ButtonSize) : (this.anchor.rect.h - (2 * ButtonSize + ButtonBetweenSize))) >> 1;

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

        x = xStart;
        y = yStart + ButtonSize + ButtonBetweenSize;
        while (i < buttonsCount)
        {
            ret.push({x : x, y : y});
            x += (ButtonSize + ButtonBetweenSize);
            i++;
        }

        return ret;
	};

	Placeholder.prototype.applyTransformToPoint = function(x, y)
	{
		var ret = { x : x, y : y };
		if (this.anchor.transform)
		{
            if (global_MatrixTransformer.IsIdentity2(this.anchor.transform))
			{
				ret.x -= this.anchor.transform.tx;
                ret.y -= this.anchor.transform.ty;
			}
			else
			{
                var invertTransform = global_MatrixTransformer.Invert(this.anchor.transform);
                ret.x = invertTransform.TransformPointX(x, y);
                ret.y = invertTransform.TransformPointY(x, y);
			}
		}
        return { x : _x, y : _y };
	};

    Placeholder.prototype.isInside = function(x, y)
    {
    	var point = this.applyTransformToPoint(x, y);
        var rect = this.anchor.rect;

        var isInsideMain = (point.x >= rect.x) && (point.x <= (rect.x + rect.w)) && (point.y >= rect.y) && (point.y <= (rect.y + rect.h));
    	if (!isInsideMain)
    		return -1;

    	var rects = this.getButtonRects();
        var ButtonSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);

    	for (var i = 0; i < rects.length; i++)
		{
			rect = rects[i];
			if ((point.x >= rect.x) && (point.x <= (rect.x + ButtonSize)) && (point.y >= rect.y) && (point.y <= (rect.y + ButtonSize)))
				return i;
		}

		return -1;
    };

    Placeholder.prototype.onPointerDown = function(e, x, y)
    {
        var indexButton = this.isInside(x, y);

		if (-1 == indexButton)
			return false;

		this.events.callCallback(this.buttons[indexButton], this);
		return true;
    };

    Placeholder.prototype.onPointerMove = function(e, x, y)
    {
        var indexButton = this.isInside(x, y);
        var isUpdate = false;

        for (var i = 0; i < this.buttons.length; i++)
        {
            if (i == indexButton)
            {
                if (this.states[i] != AscCommon.PlaceholderButtonState.Over)
                {
                    this.states[i] = AscCommon.PlaceholderButtonState.Over;
                    isUpdate = true;
                }
            }
            else
            {
                if (this.states[i] != AscCommon.PlaceholderButtonState.None)
                {
                    this.states[i] = AscCommon.PlaceholderButtonState.None;
                    isUpdate = true;
                }
            }
        }

        return isUpdate;
    };

    Placeholder.prototype.onPointerUp = function(e, x, y)
    {
		// ничего. нажимаем сразу при down
    };

    Placeholder.prototype.draw = function(overlay, rect)
	{
	};
	
	function Placeholders()
	{
		this.callbacks = [];
		this.objects = [];

		this.icons = new PlaceholderIcons();
		this.icons.register(AscCommon.PlaceholderButtonType.Image, "img2");
    }

	Placeholders.prototype.registerCallback = function(type, callback)
	{
		this.callbacks[type] = callback;
	};

    Placeholders.prototype.callCallback = function(type, obj)
    {
        this.callbacks[type] && this.callbacks[type](obj);
    };

    Placeholders.prototype.onPointerDown = function(e, x, y)
	{
		for (var i = 0; i < this.objects.length; i++)
		{
			if (this.objects.onPointerDown(e, x, y))
				return true;
		}
		return false;
	};

    Placeholders.prototype.onPointerMove = function(e, x, y)
    {
        var isUpdate = false;
        for (var i = 0; i < this.objects.length; i++)
        {
            isUpdate |= this.objects.onPointerMove(e, x, y);
        }
        // обновить оверлей
        if (isUpdate && this.onUpdate)
            this.onUpdate();
    };

    Placeholders.prototype.onPointerUp = function(e, x, y)
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

        this.onUpdate && this.onUpdate();
    };

})(window);