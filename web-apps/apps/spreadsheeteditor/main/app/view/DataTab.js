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
/**
 *  DataTab.js
 *
 *  Created on 30.05.2019
 *
 */

define([
    'common/main/lib/util/utils',
    'common/main/lib/component/BaseView',
    'common/main/lib/component/Layout',
    'common/main/lib/view/OpenDialog',
    'common/main/lib/component/TextareaField'
], function () {
    'use strict';

    SSE.Views.DataTab = Common.UI.BaseView.extend(_.extend((function(){
        function setEvents() {
            var me = this;
            me.btnUngroup.menu.on('item:click', function (menu, item, e) {
                me.fireEvent('data:ungroup', [item.value]);
            });
            me.btnUngroup.on('click', function (b, e) {
                me.fireEvent('data:ungroup');
            });
            me.btnGroup.menu.on('item:click', function (menu, item, e) {
                me.fireEvent('data:group', [item.value, item.checked]);
            });
            me.btnGroup.on('click', function (b, e) {
                me.fireEvent('data:group');
            });
            me.btnGroup.menu.on('show:before', function (menu, e) {
                me.fireEvent('data:groupsettings', [menu]);
            });
            me.btnTextToColumns.on('click', function (b, e) {
                me.fireEvent('data:tocolumns');
            });
            me.btnRemoveDuplicates.on('click', function (b, e) {
                me.fireEvent('data:remduplicates');
            });
            me.btnDataValidation.on('click', function (b, e) {
                me.fireEvent('data:datavalidation');
            });
            // isn't used for awhile
            // me.btnShow.on('click', function (b, e) {
            //     me.fireEvent('data:show');
            // });
            // me.btnHide.on('click', function (b, e) {
            //     me.fireEvent('data:hide');
            // });
            me.btnsSortDown.forEach(function(button) {
                button.on('click', function (b, e) {
                    me.fireEvent('data:sort', [Asc.c_oAscSortOptions.Ascending]);
                });
            });
            me.btnsSortUp.forEach(function(button) {
                button.on('click', function (b, e) {
                    me.fireEvent('data:sort', [Asc.c_oAscSortOptions.Descending]);
                });
            });
            me.btnsSetAutofilter.forEach(function(button) {
                button.on('click', function (b, e) {
                    me.fireEvent('data:setfilter', [Asc.c_oAscSortOptions.Descending]);
                });
            });
            me.btnsClearAutofilter.forEach(function(button) {
                button.on('click', function (b, e) {
                    me.fireEvent('data:clearfilter', [Asc.c_oAscSortOptions.Descending]);
                });
            });
            me.btnCustomSort.on('click', function (b, e) {
                me.fireEvent('data:sortcustom');
            });

            // XXX Cryptpad: Disable external links
            // me.btnExternalLinks.on('click', function (b, e) {
            //     me.fireEvent('data:externallinks');
            // });

            me.btnGoalSeek.on('click', function (b, e) {
                me.fireEvent('data:goalseek');
            });

            me.btnDataFromText.menu ?
            me.btnDataFromText.menu.on('item:click', function (menu, item, e) {
                me.fireEvent('data:fromtext', [item.value]);
            }) : me.btnDataFromText.on('click', function (b, e) {
                me.fireEvent('data:fromtext', ['file']);
            });
        }

        return {
            options: {},

            initialize: function (options) {
                Common.UI.BaseView.prototype.initialize.call(this);
                this.toolbar = options.toolbar;

                this.lockedControls = [];

                var me = this,
                    $host = me.toolbar.$el,
                    _set = Common.enumLock;

                this.btnDataFromText = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-data-from-text'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-import-data',
                    caption: this.capDataFromText,
                    // menu: !this.toolbar.mode.isDesktopApp,
                    menu: true,
                    action: 'import-data',
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.sheetLock, _set.wbLock, _set.lostConnect, _set.coAuth, _set.wsLock],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnDataFromText);

                this.btnGroup = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-group'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-cell-group',
                    caption: this.capBtnGroup,
                    split: true,
                    menu: true,
                    action: 'cell-group',
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.sheetLock, _set.lostConnect, _set.coAuth, _set.wsLock, _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnGroup);

                this.btnUngroup = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-ungroup'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-cell-ungroup',
                    caption: this.capBtnUngroup,
                    split: true,
                    menu: true,
                    action: 'cell-ungroup',
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.sheetLock, _set.lostConnect, _set.coAuth, _set.wsLock, _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnUngroup);

                this.btnTextToColumns = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-text-column'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-to-columns',
                    caption: this.capBtnTextToCol,
                    split: false,
                    disabled: true,
                    lock: [_set.multiselect, _set.multiselectCols, _set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.lostConnect, _set.coAuth, _set.wsLock, _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnTextToColumns);

                // this.btnShow = new Common.UI.Button({
                //     cls         : 'btn-toolbar',
                //     iconCls     : 'btn-show-details',
                //     style: 'padding-right: 2px;',
                //     caption: this.capBtnTextShow,
                //     lock        : [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth]
                // });
                // Common.Utils.injectComponent($host.find('#slot-btn-show-details'), this.btnShow);
                // this.lockedControls.push(this.btnShow);

                // this.btnHide = new Common.UI.Button({
                //     cls         : 'btn-toolbar',
                //     iconCls     : 'btn-hide-details',
                //     style: 'padding-right: 2px;',
                //     caption: this.capBtnTextHide,
                //     lock        : [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth]
                // });
                // Common.Utils.injectComponent($host.find('#slot-btn-hide-details'), this.btnHide);
                // this.lockedControls.push(this.btnHide);

                this.btnRemoveDuplicates = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-rem-duplicates'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-big-remove-duplicates',
                    caption: this.capBtnTextRemDuplicates,
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.lostConnect, _set.coAuth, _set.ruleFilter, _set.editPivot, _set.cantModifyFilter, _set.sheetLock, _set.wsLock, _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnRemoveDuplicates);

                this.btnDataValidation = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-data-validation'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-data-validation',
                    caption: this.capBtnTextDataValidation,
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.lostConnect, _set.coAuth, _set.editPivot, _set.cantModifyFilter, _set.sheetLock, _set.wsLock, _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnDataValidation);

                this.btnCustomSort = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-custom-sort'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-custom-sort',
                    caption: this.capBtnTextCustomSort,
                    disabled: true,
                    lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.lostConnect, _set.coAuth, _set.ruleFilter, _set.cantModifyFilter, _set.sheetLock, _set['Sort'], _set.userProtected],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnCustomSort);

                // this.btnExternalLinks = new Common.UI.Button({
                //     parentEl: $host.find('#slot-btn-data-external-links'),
                //     cls: 'btn-toolbar x-huge icon-top',
                //     iconCls: 'toolbar__icon btn-edit-links',
                //     caption: this.capDataExternalLinks,
                //     disabled: true,
                //     lock: [_set.editCell, _set.sheetLock, _set.wbLock, _set.lostConnect, _set.coAuth, _set.wsLock],
                //     dataHint: '1',
                //     dataHintDirection: 'bottom',
                //     dataHintOffset: 'small'
                // });
                // this.lockedControls.push(this.btnExternalLinks);

                this.btnGoalSeek = new Common.UI.Button({
                    parentEl: $host.find('#slot-btn-goal-seek'),
                    cls: 'btn-toolbar x-huge icon-top',
                    iconCls: 'toolbar__icon btn-goal-seek',
                    caption: this.capGoalSeek,
                    disabled: true,
                    lock: [_set.editCell, _set.lostConnect, _set.coAuth],
                    dataHint: '1',
                    dataHintDirection: 'bottom',
                    dataHintOffset: 'small'
                });
                this.lockedControls.push(this.btnGoalSeek);

                this.btnsSortDown = Common.Utils.injectButtons($host.find('.slot-sortdesc'), '', 'toolbar__icon btn-sort-down', '',
                    [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter, _set.cantModifyFilter, _set.sheetLock, _set.cantSort, _set['Sort'], _set.userProtected], undefined, undefined, undefined, '1', 'top', undefined, 'D');

                this.btnsSortUp = Common.Utils.injectButtons($host.find('.slot-sortasc'), '', 'toolbar__icon btn-sort-up', '',
                    [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter, _set.cantModifyFilter, _set.sheetLock, _set.cantSort, _set['Sort'], _set.userProtected], undefined, undefined, undefined, '1', 'top', undefined, 'U');

                this.btnsSetAutofilter = Common.Utils.injectButtons($host.find('.slot-btn-setfilter'), '', 'toolbar__icon btn-autofilter', '',
                    [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selSlicer, _set.lostConnect, _set.coAuth, _set.ruleFilter, _set.editPivot, _set.cantModifyFilter, _set.tableHasSlicer, _set.wsLock, _set.userProtected],
                    false, false, true, '1', 'bottom', undefined, 'F');

                this.btnsClearAutofilter = Common.Utils.injectButtons($host.find('.slot-btn-clear-filter'), '', 'toolbar__icon btn-clear-filter', '',
                    [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleDelFilter, _set.wsLock, _set.userProtected], undefined, undefined, undefined, '1', 'bottom', undefined, 'N');

                Array.prototype.push.apply(this.lockedControls, this.btnsSortDown.concat(this.btnsSortUp, this.btnsSetAutofilter,this.btnsClearAutofilter));
                Common.UI.LayoutManager.addControls(this.lockedControls);
                Common.NotificationCenter.on('app:ready', this.onAppReady.bind(this));
            },

            render: function (el) {
                return this;
            },

            onAppReady: function (config) {
                var me = this;
                (new Promise(function (accept, reject) {
                    accept();
                })).then(function(){
                    me.btnUngroup.updateHint( me.tipUngroup );
                    var _menu = new Common.UI.Menu({
                        items: [
                            {caption: me.textRows, value: 'rows'},
                            {caption: me.textColumns, value: 'columns'},
                            {caption: me.textClear, value: 'clear'}
                        ]
                    });
                    me.btnUngroup.setMenu(_menu);

                    me.btnGroup.updateHint(me.tipGroup);
                    _menu = new Common.UI.Menu({
                        items: [
                            {caption: me.textGroupRows, value: 'rows'},
                            {caption: me.textGroupColumns, value: 'columns'},
                            {caption: '--'},
                            {caption: me.textBelow, value: 'below', checkable: true},
                            {caption: me.textRightOf, value: 'right', checkable: true}
                        ]
                    });
                    me.btnGroup.setMenu(_menu);

                    me.btnDataFromText.updateHint(me.tipDataFromText);
                    me.btnDataFromText.menu && me.btnDataFromText.setMenu(new Common.UI.Menu({
                        items: [
                            { caption: me.mniFromFile, value: 'file' },
                            // { caption: me.mniFromUrl,  value: 'url' }, CryptPad: Disable URL import, because it is broken because CSP rules
                            { caption: '--'},
                            {   caption: me.mniFromXMLFile,
                                value: 'xml'
                            }
                            // { caption: me.mniImageFromStorage, value: 'storage'}
                        ]
                    }));
                    me.toolbar.mode.isDesktopApp && me.btnDataFromText.menu.items[1].setVisible(false);

                    me.btnTextToColumns.updateHint(me.tipToColumns);
                    me.btnRemoveDuplicates.updateHint(me.tipRemDuplicates);
                    me.btnDataValidation.updateHint(me.tipDataValidation);
                    // XXX Cryptpad: Disable external links
                    // me.btnExternalLinks.updateHint(me.tipExternalLinks);
                    me.btnGoalSeek.updateHint(me.tipGoalSeek);

                    me.btnsSortDown.forEach( function(btn) {
                        btn.updateHint(me.toolbar.txtSortAZ);
                    });
                    me.btnsSortUp.forEach( function(btn) {
                        btn.updateHint(me.toolbar.txtSortZA);
                    });
                    me.btnsSetAutofilter.forEach( function(btn) {
                        btn.updateHint(me.toolbar.txtFilter + ' (Ctrl+Shift+L)');
                    });
                    me.btnsClearAutofilter.forEach( function(btn) {
                        btn.updateHint(me.toolbar.txtClearFilter);
                    });
                    me.btnCustomSort.updateHint(me.tipCustomSort);

                    setEvents.call(me);
                });
            },

            show: function () {
                Common.UI.BaseView.prototype.show.call(this);
                this.fireEvent('show', this);
            },

            getButtons: function(type) {
                if (type == 'sort-down')
                    return this.btnsSortDown;
                else if (type == 'sort-up')
                    return this.btnsSortUp;
                else if (type == 'sort-custom')
                    return this.btnCustomSort;
                else if (type == 'set-filter')
                    return this.btnsSetAutofilter;
                else if (type == 'clear-filter')
                    return this.btnsClearAutofilter;
                else if (type == 'rem-duplicates')
                    return this.btnRemoveDuplicates;
                else if (type == 'data-validation')
                    return this.btnDataValidation;
                else if (type===undefined)
                    return this.lockedControls;
                return [];
            },

            SetDisabled: function (state) {
                this.lockedControls && this.lockedControls.forEach(function(button) {
                    if ( button ) {
                        button.setDisabled(state);
                    }
                }, this);
            },

            capBtnGroup: 'Group',
            capBtnUngroup: 'Ungroup',
            textRows: 'Ungroup rows',
            textColumns: 'Ungroup columns',
            textGroupRows: 'Group rows',
            textGroupColumns: 'Group columns',
            textClear: 'Clear outline',
            tipGroup: 'Group range of cells',
            tipUngroup: 'Ungroup range of cells',
            capBtnTextToCol: 'Text to Columns',
            tipToColumns: 'Separate cell text into columns',
            capBtnTextShow: 'Show details',
            capBtnTextHide: 'Hide details',
            textBelow: 'Summary rows below detail',
            textRightOf: 'Summary columns to right of detail',
            capBtnTextCustomSort: 'Custom Sort',
            tipCustomSort: 'Custom sort',
            capBtnTextRemDuplicates: 'Remove Duplicates',
            tipRemDuplicates: 'Remove duplicate rows from a sheet',
            capBtnTextDataValidation: 'Data Validation',
            tipDataValidation: 'Data validation',
            capDataFromText: 'From Text/CSV',
            tipDataFromText: 'Get data from file',
            mniFromFile: 'Get Data from File',
            mniFromUrl: 'Get Data from URL',
            capDataExternalLinks: 'External Links',
            tipExternalLinks: 'View other files this spreadsheet is linked to',
            mniFromXMLFile: 'From Local XML',
            capGoalSeek: 'Goal Seek',
            tipGoalSeek: 'Find the right input for the value you want'
        }
    }()), SSE.Views.DataTab || {}));
});
