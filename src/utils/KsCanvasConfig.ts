import { ColorSystem } from './ColorSystem'

let debug = true
debug = false

export namespace KsCanvasConfig {
  export const LINE_STYLE_BASE_H: string = debug
    ? 'blue'
    : ColorSystem.Neutral.i
  export const LINE_STYLE_BASE_V: string = debug
    ? 'lightgreen'
    : LINE_STYLE_BASE_H
  export const LINE_STYLE_BORDER: string = debug ? 'black' : LINE_STYLE_BASE_H

  export const LINE_STYLE_FROZEN: string = debug
    ? 'DeepSkyBlue'
    : ColorSystem.Theme.d
  export const LINE_FROZEN_LINEAR_WIDTH = debug ? 100 : 8
  export const LINE_FROZEN_LINEAR_STYLE: [number, string][] = [
    [0, '#00000015'],
    [1, '#00000000'],
  ]
  export const FROZEN_WIDTH_RIGHT_PADDING: number = 72

  export const HOVER_AREA_BG_COLOR: string = debug
    ? 'red'
    : ColorSystem.Neutral.a + '0D'
  //数据行预设行高
  export const DATA_ROW_HEIGHTS: number[] = [33]
  //数据区域背景颜色
  export const DATA_AREA_BG_COLOR: string = debug
    ? 'pink'
    : ColorSystem.Neutral.l
  export const DATA_FROZEN_AREA_BG_COLOR: string = debug
    ? 'lightgreen'
    : ColorSystem.Neutral.l
  export const DATA_TEXT_COLOR: string = debug ? 'black' : ColorSystem.Neutral.b
  export const DATA_TEXT_FONT_SIZE: number = 13
  export const DATA_TEXT_FONT: string = DATA_TEXT_FONT_SIZE + 'px PingFang SC'
  export const DATA_TEXT_ALIGN: CanvasTextAlign = 'left'
  export const DATA_TEXT_BASE_LINE: CanvasTextBaseline = 'middle'
  export const DATA_TEXT_BORDER: number = 8
  export const DATA_COL_MIN_WIDTH: number = 72

  //文本裁剪后显示的符号
  export const TEXT_SUSPENSION: string = '...'
  export const CATEGORY_BORDER: number = 6
  export const CATEGORY_BAR_RADIUS: number = 4
  export const CATEGORY_BAR_HEIGHT: number = 24
  export const CATEGORY_BAR_MAX_WIDTH: number = 100
  export const CATEGORY_BAR_SEPARATE: number = 4 // 多个选项间的间距
  export const PIC_BORDER: number = 4
  export const PIC_SEPARATE: number = 4
  export const PIC_BG_COLOR: string = debug ? 'black' : ColorSystem.Neutral.j
  export const USER_BORDER: number = 4
  export const USER_AVATAR_SIZE: number = 24
  export const USER_AVATAR_SEPARATOR: number = 4
  export const ATTACHMENT_BORDER: number = 4
  export const ATTACHMENT_SEPARATE: number = 4
  export const ATTACHMENT_BG_COLOR: string = debug
    ? 'black'
    : ColorSystem.Neutral.a + '0D'
  export const ATTACHMENT_TEXT_COLOR: string = ColorSystem.Neutral.b
  export const ATTACHMENT_HEIGHT: number = 24
  export const ATTACHMENT_ICON_SIZE: number = 20
  export const ATTACHMENT_ICON_BORDER_LEFT: number = 4
  export const ATTACHMENT_ICON_BORDER_RIGHT: number = 4
  export const ATTACHMENT_ICON_TOTAL_WIDTH: number =
    ATTACHMENT_ICON_SIZE +
    ATTACHMENT_ICON_BORDER_LEFT +
    ATTACHMENT_ICON_BORDER_RIGHT
  export const ATTACHMENT_ITEM_MAX_WIDTH: number = 120
  export const ATTACHMENT_NAME_MARGIN_RIGHT: number = 4
  export const ATTACHMENT_TITLE_MAX_WIDTH: number =
    ATTACHMENT_ITEM_MAX_WIDTH -
    ATTACHMENT_ICON_BORDER_LEFT -
    ATTACHMENT_ICON_SIZE -
    ATTACHMENT_ICON_BORDER_RIGHT -
    ATTACHMENT_NAME_MARGIN_RIGHT
  export const ILLEGAL_BAR_COLOR: string = ColorSystem.Neutral.g
  export const ILLEGAL_MAX_LENGTH: number = 32
  export const ILLEGAL_BAR_ALIGN: number = 8
  export const ILLEGAL_BAR_HALF_HEIGHT: number = 1

  //表头行高
  export const TITLE_AREA_ROW_HEIGHT: number = 40
  //表头区域背景颜色
  export const TITLE_AREA_BG_COLOR: string = debug
    ? 'red'
    : ColorSystem.Neutral.k
  export const TITLE_AREA_BG_FOCUS_COLOR: string = debug
    ? 'pink'
    : ColorSystem.Neutral.j
  export const TITLE_TEXT_COLOR: string = ColorSystem.Neutral.d
  export const TITLE_TEXT_FONT_SIZE: number = 14
  export const TITLE_TEXT_FONT: string = TITLE_TEXT_FONT_SIZE + 'px PingFang SC'
  export const TITLE_TEXT_ALIGN: CanvasTextAlign = 'left'
  export const TITLE_TEXT_BASE_LINE: CanvasTextBaseline = 'middle'
  export const TITLE_TEXT_BORDER: number = 8
  export const TITLE_ICON_BORDER: number = 8
  export const TITLE_ICON_SIZE: number = 16
  export const TITLE_OPTION_BUTTON_FOCUS_COLOR: string = debug
    ? 'blue'
    : ColorSystem.Neutral.a + '0D'
  export const TITLE_OPTION_BUTTON_SIZE: number = 24
  export const TITLE_OPTION_BUTTON_OFFSET_RIGHT: number = 12
  export const TITLE_OPTION_BUTTON_ICON_SIZE: number = 16
  export const TITLE_OPTION_BUTTON_ICON_URL: string = ''
  export const TITLE_WIDTH_CHANGE_SIZE: number = 12 // 修改列宽的控制区域大小，区域为列分割线左右分别扩展出来的区域长度

  //统计行行高
  export const STATS_AREA_ROW_HEIGHT = 32
  //统计区域背景颜色
  export const STATS_AREA_BG_COLOR: string = debug
    ? 'gray'
    : ColorSystem.Neutral.j
  export const STATS_AREA_BG_FOCUS_COLOR: string = debug
    ? 'lightgreen'
    : ColorSystem.Neutral.a + '0D'
  export const STATS_TEXT_COLOR: string = ColorSystem.Neutral.c
  export const STATS_TEXT_PRE_COLOR: string = ColorSystem.Neutral.d
  export const STATS_TEXT_FONT_SIZE: number = 12
  export const STATS_TEXT_FONT: string =
    STATS_TEXT_FONT_SIZE + 'px SF Pro Display'
  export const STATS_TEXT_ALIGN: CanvasTextAlign = 'right'
  export const STATS_TEXT_BASE_LINE: CanvasTextBaseline = 'middle'
  export const STATS_TEXT_BORDER: number = 8
  export const STATS_INDEX_TEXT_PADDING: number = 6.5
  export const STATS_INDEX_ALIGN: CanvasTextAlign = 'center'

  //序号列预设列宽
  //根据序号大小不同显示为不同的宽度，每个元素中第一个数为序号最大大小，第二个为列宽度
  //当序号数大于最后一个数时，列宽不再增长
  export const INDEX_AREA_COL_WIDTHES: [number, number][] = [[0, 40]]
  export const INDEX_AREA_COL_MIN_WIDTH: number = 40
  //序号区域背景颜色
  export const INDEX_AREA_BG_COLOR: string = debug
    ? 'yellow'
    : ColorSystem.Neutral.k
  //序号列勾选框配置属性
  export const INDEX_CHECK_MARK_COLOR: string = ColorSystem.Neutral.n
  export const INDEX_CHECK_BOX_WIDTH: number = 16
  export const INDEX_CHECK_BOX_HEIGHT: number = INDEX_CHECK_BOX_WIDTH
  export const INDEX_TEXT_COLOR: string = ColorSystem.Neutral.d
  export const INDEX_TEXT_FONT_SIZE: number = 12
  export const INDEX_TEXT_FONT: string =
    INDEX_TEXT_FONT_SIZE + 'px SF Pro Display'
  export const INDEX_TEXT_ALIGN: CanvasTextAlign = 'center'
  export const INDEX_TEXT_BASE_LINE: CanvasTextBaseline = 'middle'

  export const SCROLL_SIZE_HORIZON: number = 16
  export const SCROLL_SIZE_VERTICAL: number = 24
  export const SCROLL_HEAD_PADDING: number = 4
  export const SCROLL_HEAD_RADIUS: number = 4
  export const SCROLL_BAR_COLOR = debug ? 'blue' : ColorSystem.Neutral.a + '1A'
  export const SCROLL_BAR_BG_COLOR = debug ? 'orange' : STATS_AREA_BG_COLOR

  // 默认列宽度
  export const DEFAULT_COL_WIDTH: number = 216
  export const DEFAULT_EDITOR_COL_WIDTH: number = 100

  export const EDITOR_COL_ID = 'EDITOR_COLUMN'

  //TODO 需要新增一个列类型
  // export const EDITOR_COL: SheetType.ColumnsText = {
  //   type: 'text',
  //   new: false,
  //   column_id: EDITOR_COL_ID,
  //   name: '+',
  //   config: { type: 'single', default: '', user_defined: { validation: { required: false } } }, // TODO: 类型
  //   default: '',
  // };
}
