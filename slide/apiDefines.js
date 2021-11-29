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

/** @enum {number} */
var c_oAscZoomType = {
	Current  : 0,
	FitWidth : 1,
	FitPage  : 2
};

/** @enum {number} */
var c_oAscCollaborativeMarksShowType = {
	All         : 0,
	LastChanges : 1
};

/** @enum {number} */
var c_oAscVertAlignJc = {
	Top    : 0x00, // var vertalignjc_Top    = 0x00;
	Center : 0x01, // var vertalignjc_Center = 0x01;
	Bottom : 0x02  // var vertalignjc_Bottom = 0x02
};

/** @enum {number} */
var c_oAscAlignType = {
	LEFT    : 0,
	CENTER  : 1,
	RIGHT   : 2,
	JUSTIFY : 3,
	TOP     : 4,
	MIDDLE  : 5,
	BOTTOM  : 6
};

/** @enum {number} */
var c_oAscContextMenuTypes = {
	Main       : 0,
	Thumbnails : 1
};

var THEME_THUMBNAIL_WIDTH   = 180;
var THEME_THUMBNAIL_HEIGHT  = 135;
var LAYOUT_THUMBNAIL_WIDTH  = 180;
var LAYOUT_THUMBNAIL_HEIGHT = 135;

/** @enum {number} */
var c_oAscTableSelectionType = {
	Cell   : 0,
	Row    : 1,
	Column : 2,
	Table  : 3
};

/** @enum {number} */
var c_oAscAlignShapeType = {
	ALIGN_LEFT   : 0,
	ALIGN_RIGHT  : 1,
	ALIGN_TOP    : 2,
	ALIGN_BOTTOM : 3,
	ALIGN_CENTER : 4,
	ALIGN_MIDDLE : 5
};

/** @enum {number} */
var c_oAscTableLayout = {
	AutoFit : 0x00,
	Fixed   : 0x01
};

/** @enum {number} */
var c_oAscSlideTransitionTypes = {
	None    : 0,
	Fade    : 1,
	Push    : 2,
	Wipe    : 3,
	Split   : 4,
	UnCover : 5,
	Cover   : 6,
	Clock   : 7,
	Zoom    : 8
};

/** @enum {number} */
var c_oAscSlideTransitionParams = {
	Fade_Smoothly      : 0,
	Fade_Through_Black : 1,

	Param_Left        : 0,
	Param_Top         : 1,
	Param_Right       : 2,
	Param_Bottom      : 3,
	Param_TopLeft     : 4,
	Param_TopRight    : 5,
	Param_BottomLeft  : 6,
	Param_BottomRight : 7,

	Split_VerticalIn    : 8,
	Split_VerticalOut   : 9,
	Split_HorizontalIn  : 10,
	Split_HorizontalOut : 11,

	Clock_Clockwise        : 0,
	Clock_Counterclockwise : 1,
	Clock_Wedge            : 2,

	Zoom_In        : 0,
	Zoom_Out       : 1,
	Zoom_AndRotate : 2
};

/** @enum {number} */
var c_oAscLockTypeElemPresentation = {
	Object       : 1,
	Slide        : 2,
	Presentation : 3
};

/** @enum {number} */
var c_oAscSlideDgmBuildType = {
	AllAtOnce:           0,
	BreadthByLvl:        1,
	BreadthByNode:       2,
	CCW:                 3,
	CCWIn:               4,
	CCWOut:              5,
	Cust:                6,
	CW:                  7,
	CWIn:                8,
	CWOut:               9,
	DepthByBranch:       10,
	DepthByNode:         11,
	Down:                12,
	InByRing:            13,
	OutByRing:           14,
	Up:                  15,
	Whole:               16
};

/** @enum {number} */
var c_oAscSlideLayoutType = {
	Blank:                   0,
	Chart:                   1,
	ChartAndTx:              2,
	ClipArtAndTx:            3,
	ClipArtAndVertTx:        4,
	Cust:                    5,
	Dgm:                     6,
	FourObj:                 7,
	MediaAndTx:              8,
	Obj:                     9,
	ObjAndTwoObj:            10,
	ObjAndTx:                11,
	ObjOnly:                 12,
	ObjOverTx:               13,
	ObjTx:                   14,
	PicTx:                   15,
	SecHead:                 16,
	Tbl:                     17,
	Title:                   18,
	TitleOnly:               19,
	TwoColTx:                20,
	TwoObj:                  21,
	TwoObjAndObj:            22,
	TwoObjAndTx:             23,
	TwoObjOverTx:            24,
	TwoTxTwoObj:             25,
	Tx:                      26,
	TxAndChart:              27,
	TxAndClipArt:            28,
	TxAndMedia:              29,
	TxAndObj:                30,
	TxAndTwoObj:             31,
	TxOverObj:               32,
	VertTitleAndTx:          33,
	VertTitleAndTxOverChart: 34,
	VertTx:                  35
};

/** @enum {number} */
var c_oAscColorSchemeIndex = {
	Accent1:  0,
	Accent2:  1,
	Accent3:  2,
	Accent4:  3,
	Accent5:  4,
	Accent6:  5,
	Bg1:      6,
	Bg2:      7,
	Dk1:      8,
	Dk2:      9,
	FolHlink: 10,
	Hlink:    11,
	Lt1:      12,
	Lt2:      13,
	PhClr:    14,
	Tx1:      15,
	Tx2:      16
};

/** @enum {number} */
var c_oAscConformanceType = {
	Strict:       0,
	Transitional: 1
};

/** @enum {number} */
var c_oAscSlideBgBwModeType = {
	Auto:       0,
	Black:      1,
	BlackGray:  2,
	BlackWhite: 3,
	Clr:        4,
	Gray:       5,
	GrayWhite:  6,
	Hidden:     7,
	InvGray:    8,
	LtGray:     9,
	White:      10
};
/** @enum {number} */
var c_oAscSlideChartSubElementType = {
	Category:     0,
	GridLegend:   1,
	PtInCategory: 2,
	PtInSeries:   3,
	Series:       4
};
/** @enum {number} */
var c_oAscSlideAnimDgmBuildType = {
	AllAtOnce:  0,
	lvlAtOnce:  1,
	lvlOne:     2,
	one:        3
};

/** @enum {number} */
var c_oAscSlideRuntimeTriggerType = {
	All:   0,
	First: 1,
	Last:  2
};
/** @enum {number} */
var c_oAscSlideTriggerEventType = {
	Begin:       0,
	End:         1,
	OnBegin:     2,
	OnClick:     3,
	OnDblClick:  4,
	OnEnd:       5,
	OnMouseOut:  6,
	OnMouseOver: 7,
	OnNext:      8,
	OnPrev:      9,
	OnStopAudio: 10
};
/** @enum {number} */
var c_oAscSlideNodeFillType = {
	Freeze:     0,
	Hold:       1,
	Remove:     2,
	Transition: 3
};
/** @enum {number} */
var c_oAscSlideMasterRelationType = {
	LastClick: 0,
	NextClick: 1,
	SameClick: 2
};
/** @enum {number} */
var c_oAscSlideNodeType = {
	AfterEffect:     0,
	AfterGroup:      1,
	ClickEffect:     2,
	ClickPar:        3,
	InteractiveSeq:  4,
	MainSeq:         5,
	TmRoot:          6,
	WithEffect:      7,
	WithGroup:       8
};
/** @enum {number} */
var c_oAscSlidePresetClassType = {
	Emph:      0,
	Entr:      1,
	Exit:      2,
	Mediacall: 3,
	Path:      4,
	Verb:      5
};
/** @enum {number} */
var c_oAscSlideRestartType = {
	Always:        0,
	Never:         1,
	WhenNotActive: 2
};
/** @enum {number} */
var c_oAscSlideSyncBehaviorType = {
	CanSlip: 0,
	Locked:  1
};
/** @enum {number} */
var c_oAscSlidePrevAcType = {
	None:      0,
	SkipTimed: 1
};
/** @enum {number} */
var c_oAscSlideNextAcType = {
	None: 0,
	Seek: 1
};
/** @enum {number} */
var c_oAscSlideCalcModeType = {
	Discrete: 0,
	Lin:      1,
	Fmla:     2
};
/** @enum {number} */
var c_oAscSlideTLValueType = {
	Num: 0,
	Clr: 1,
	Str: 2
};
/** @enum {number} */
var c_oAscSlideTLAccumulateType = {
	Always: 0,
	None:   1
};
/** @enum {number} */
var c_oAscSlideTLAdditiveType = {
	Base: 0,
	Mult: 1,
	None: 2,
	Repl: 3,
	Sum:  4
};
/** @enum {number} */
var c_oAscSlideTLOverrideType = {
	ChildStyle: 0,
	Normal:     1
};
/** @enum {number} */
var c_oAscSlideTLTransformType = {
	Img: 0,
	Pt:  1
};
/** @enum {number} */
var c_oAscSlideTLColorSpaceType = {
	Rgb: 0,
	Hsl: 1
};
/** @enum {number} */
var c_oAscSlideTLOriginType = {
	Parent: 0,
	Layout: 1
};
/** @enum {number} */
var c_oAscSlideTLPathEditMode = {
	Fixed:    0,
	Relative: 1
};
/** @enum {number} */
var c_oAscSlideTLCommandType = {
	Call: 0,
	Evt:  1,
	Verb: 2
};
/** @enum {number} */
var c_oAscSlideAnimChartBuildType = {
	AllAtOnce:  0,
	Category:   1,
	CategoryEl: 2,
	Series:     3,
	SeriesEl:   4
};

/** @enum {number} */
var c_oAscSlideOleChartBuildType = {
	AllAtOnce:  0,
	Category:   1,
	CategoryEl: 2,
	Series:     3,
	SeriesEl:   4
};

/** @enum {number} */
var c_oAscSlideParaBuildType = {
	AllAtOnce: 0,
	Cust:      1,
	P:         2,
	Whole:     3
};
/** @enum {number} */
var c_oAscSlideIterateType = {
	El: 0,
	Lt: 1,
	Wd: 2
};
/** @enum {number} */
var c_oAscBlendModeType = {
	Darken:  0,
	Lighten: 1,
	Mult:    2,
	Over:    3,
	Screen:  4
};
/** @enum {number} */
var c_oAscPresetShadowVal = {
	shdw1:  0,
	shdw2:  1,
	shdw3:  2,
	shdw4:  3,
	shdw5:  4,
	shdw6:  5,
	shdw7:  6,
	shdw8:  7,
	shdw9:  8,
	shdw10: 9,
	shdw11: 10,
	shdw12: 11,
	shdw13: 12,
	shdw14: 13,
	shdw15: 14,
	shdw16: 15,
	shdw17: 16,
	shdw18: 17,
	shdw19: 18,
	shdw20: 19
};
var c_oSerFormat = {
	Version   : 1,
	Signature : "PPTY"
};

var c_oAscPresentationShortcutType = {
	EditSelectAll   : 1,
	EditUndo        : 2,
	EditRedo        : 3,
	Cut             : 4,
	Copy            : 5,
	Paste           : 6,
	Duplicate       : 7,
	Print           : 8,
	Save            : 9,
	ShowContextMenu : 10
};

var TABLE_STYLE_WIDTH_PIX  = 72;
var TABLE_STYLE_HEIGHT_PIX = 52;

//------------------------------------------------------------export---------------------------------------------------
var prot;
window['Asc'] = window['Asc'] || {};

prot = window['Asc']['c_oAscCollaborativeMarksShowType'] = c_oAscCollaborativeMarksShowType;
prot['All']         = c_oAscCollaborativeMarksShowType.All;
prot['LastChanges'] = c_oAscCollaborativeMarksShowType.LastChanges;

prot = window['Asc']['c_oAscVertAlignJc'] = c_oAscVertAlignJc;
prot['Top']    = c_oAscVertAlignJc.Top;
prot['Center'] = c_oAscVertAlignJc.Center;
prot['Bottom'] = c_oAscVertAlignJc.Bottom;

prot = window['Asc']['c_oAscContextMenuTypes'] = window['Asc'].c_oAscContextMenuTypes = c_oAscContextMenuTypes;
prot['Main']       = c_oAscContextMenuTypes.Main;
prot['Thumbnails'] = c_oAscContextMenuTypes.Thumbnails;

prot = window['Asc']['c_oAscAlignShapeType'] = c_oAscAlignShapeType;
prot['ALIGN_LEFT']   = c_oAscAlignShapeType.ALIGN_LEFT;
prot['ALIGN_RIGHT']  = c_oAscAlignShapeType.ALIGN_RIGHT;
prot['ALIGN_TOP']    = c_oAscAlignShapeType.ALIGN_TOP;
prot['ALIGN_BOTTOM'] = c_oAscAlignShapeType.ALIGN_BOTTOM;
prot['ALIGN_CENTER'] = c_oAscAlignShapeType.ALIGN_CENTER;
prot['ALIGN_MIDDLE'] = c_oAscAlignShapeType.ALIGN_MIDDLE;

prot = window['Asc']['c_oAscTableLayout'] = c_oAscTableLayout;
prot['AutoFit'] = c_oAscTableLayout.AutoFit;
prot['Fixed']   = c_oAscTableLayout.Fixed;

prot = window['Asc']['c_oAscSlideTransitionTypes'] = c_oAscSlideTransitionTypes;
prot['None']    = c_oAscSlideTransitionTypes.None;
prot['Fade']    = c_oAscSlideTransitionTypes.Fade;
prot['Push']    = c_oAscSlideTransitionTypes.Push;
prot['Wipe']    = c_oAscSlideTransitionTypes.Wipe;
prot['Split']   = c_oAscSlideTransitionTypes.Split;
prot['UnCover'] = c_oAscSlideTransitionTypes.UnCover;
prot['Cover']   = c_oAscSlideTransitionTypes.Cover;
prot['Clock']   = c_oAscSlideTransitionTypes.Clock;
prot['Zoom']    = c_oAscSlideTransitionTypes.Zoom;

prot = window['Asc']['c_oAscSlideTransitionParams'] = c_oAscSlideTransitionParams;
prot['Fade_Smoothly']          = c_oAscSlideTransitionParams.Fade_Smoothly;
prot['Fade_Through_Black']     = c_oAscSlideTransitionParams.Fade_Through_Black;
prot['Param_Left']             = c_oAscSlideTransitionParams.Param_Left;
prot['Param_Top']              = c_oAscSlideTransitionParams.Param_Top;
prot['Param_Right']            = c_oAscSlideTransitionParams.Param_Right;
prot['Param_Bottom']           = c_oAscSlideTransitionParams.Param_Bottom;
prot['Param_TopLeft']          = c_oAscSlideTransitionParams.Param_TopLeft;
prot['Param_TopRight']         = c_oAscSlideTransitionParams.Param_TopRight;
prot['Param_BottomLeft']       = c_oAscSlideTransitionParams.Param_BottomLeft;
prot['Param_BottomRight']      = c_oAscSlideTransitionParams.Param_BottomRight;
prot['Split_VerticalIn']       = c_oAscSlideTransitionParams.Split_VerticalIn;
prot['Split_VerticalOut']      = c_oAscSlideTransitionParams.Split_VerticalOut;
prot['Split_HorizontalIn']     = c_oAscSlideTransitionParams.Split_HorizontalIn;
prot['Split_HorizontalOut']    = c_oAscSlideTransitionParams.Split_HorizontalOut;
prot['Clock_Clockwise']        = c_oAscSlideTransitionParams.Clock_Clockwise;
prot['Clock_Counterclockwise'] = c_oAscSlideTransitionParams.Clock_Counterclockwise;
prot['Clock_Wedge']            = c_oAscSlideTransitionParams.Clock_Wedge;
prot['Zoom_In']                = c_oAscSlideTransitionParams.Zoom_In;
prot['Zoom_Out']               = c_oAscSlideTransitionParams.Zoom_Out;
prot['Zoom_AndRotate']         = c_oAscSlideTransitionParams.Zoom_AndRotate;

prot = window['Asc']['c_oAscPresentationShortcutType'] = window['Asc'].c_oAscPresentationShortcutType = c_oAscPresentationShortcutType;
prot['EditSelectAll']   = c_oAscPresentationShortcutType.EditSelectAll;
prot['EditUndo']        = c_oAscPresentationShortcutType.EditUndo;
prot['EditRedo']        = c_oAscPresentationShortcutType.EditRedo;
prot['Cut']             = c_oAscPresentationShortcutType.Cut;
prot['Copy']            = c_oAscPresentationShortcutType.Copy;
prot['Paste']           = c_oAscPresentationShortcutType.Paste;
prot['Duplicate']       = c_oAscPresentationShortcutType.Duplicate;
prot['Print']           = c_oAscPresentationShortcutType.Print;
prot['Save']            = c_oAscPresentationShortcutType.Save;
prot['ShowContextMenu'] = c_oAscPresentationShortcutType.ShowContextMenu;

window['AscCommon']                = window['AscCommon'] || {};
window['AscCommon'].c_oSerFormat   = c_oSerFormat;
window['AscCommon'].CurFileVersion = c_oSerFormat.Version;
