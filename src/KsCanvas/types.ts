import { KsSheetData } from './KsSheetData'

export type EntityId = string

export type SheetId = string

export type RectType = [number, number, number, number]

// 列id
export type ColumnId = string
// 表单id
export type FormId = string

export type ColumnStatsType =
  | 'none' // 没有统计值
  | 'count' //非空数据总数
  | 'max' //最大值
  | 'min' //最小值
  | 'discount' //空数据总数
  | 'avg' //平均数
  | 'sum' //求和

// 数据类型统计选项类型
export type StatisticsOptionType = {
  name: string
  type: ColumnStatsType
}

export type StatisticsListType = StatisticsOptionType & {
  column_id: ColumnId
  checked: boolean
}

export type LoadingFlagCallbackType =
  | ((isDisplay: boolean, ffrlagType: string) => void)
  | undefined

export type BatchSelectModeCallbackType = (startSelect: boolean) => void

export type CtxType = CanvasRenderingContext2D

export type PointType = [number, number]
export type CircleType = Parameters<CanvasRenderingContext2D['arc']>

export type ScrollType = 'horizontal' | 'vertical'

export type ScrollPathType = [
  PointType,
  PointType,
  CircleType,
  PointType,
  CircleType
]

export type ScrollBarType = {
  type: ScrollType
  bgColor: string
  barColor: string
  bgRect: RectType
  scrollRect: RectType
  centerX: number
  centerY: number
  barLength: number
  barPath: ScrollPathType
}

export type StatsDataType = {
  column_id: ColumnId
  type: ColumnStatsType
  value: string | number
}

export interface PostProcessParam {
  //hover 焦点行
  focusRI: number | undefined
}

export interface RenderData {
  //TMP 临时引用。用于调试
  dataContainer: KsSheetData
  icon: HTMLImageElement
  //当前表格的引用
  sheet: any
  // Base phase
  sheetId: SheetId //表格id
  isEditMode: boolean // 是否为编辑模式
  editorCI: number // editor 模式的的列位置
  curMinDisplayDataCount: number // 当前最长的拉取长度

  width: number // 窗体宽度
  height: number // 窗体高度
  devicePixelRatio: number // 设备像素比/DPI

  pointX: number //（鼠标)屏幕位置
  pointY: number //（鼠标)屏幕位置

  //TODO 可能得考虑更抽象/一般化的区域设置
  dataRowH: number // 数据行行高
  titleRowH: number // 表头行行高
  statsRowH: number // 统计行行高
  scrollSizeHorizon: number // 水平滚动条尺寸
  scrollSizeVertical: number // 垂直滚动条尺寸
  addColWidth: number // 编辑模式下添加列的宽度

  showTitleIcon: boolean // 是否显示标题图标
  titleFocusEnable: boolean // 在获得焦点时是否需要显示焦点区域和选项按钮
  lockedWidth: number | undefined // 锁定的列宽，当值为undefined时不锁定
  ignoreWidthChanging: boolean // 忽略修改列宽的需求
  showStatsLine: boolean // 是否显示统计行
  autoHideScroll: boolean // 是否自动隐藏滚动条
  hideIndexArea: boolean // 是否需要隐藏序号列
  ignoreDatas: boolean // 隐藏数据

  // Sheet phase
  // 计算所有用于计算的数据，包含部分不需要显示的列数据
  // 在此阶段前数据应该被准备好，或只使用当前阶段的数据进行渲染，在有数据更新时重新渲染
  cols: any[] // 当前显示的列属性
  colIds: any[] // 当前显示的列Id
  colCount: number // 当前显示的列数
  colWidthes: number[] // 当前显示的列宽列表
  colPreSum: number[] // 当前显示的列宽前序和

  frozenCI: number // 冻结列数量，需要保证 frozenCI <= colCount [依赖数据] colCount
  frozenW: number // 冻结列宽度

  batchSelectable: boolean // 是否有选择模式
  batchSelectMode: boolean // 是否处于批量选择模式
  batchSelectAll: boolean // 是否批量反选数据
  batchSelectCount: number // 点击了多少条数据。需要注意的是反选的时候是指取消了多少条数据
  batchSelectData: { [key: FormId]: boolean } // 被选中的数据

  indexColW: number // 序号列列宽
  displayIndex: string // 待显示的行号
  dataCount: number // 数据总行数
  dataWidth: number // 数据总宽度
  dataHeight: number // 数据总宽度

  moveWidth: number // 可移动宽度，也就是curX的最大值
  moveHeight: number // 可移动高度，也就是curY的最大值

  // Culling phase
  // 裁剪阶段，计算出所有不需要被渲染的部分
  curX: number // 表格偏移位置X
  curY: number // 表格偏移位置Y

  lineMaxW: number //表格线最大宽度
  lineMaxH: number //表格线最大高度

  // 可见区域的表格坐标
  // 标记开始行列index,截止行列index
  //
  // 当不存在有效区间时，startCI == colCount, endCI == fronzenCI -1
  // 因为frozenCI <= colCount
  // 则 endCI < startCI
  // 则遍历 [startCI, endCI] 不存在有效值
  startRI: number
  startCI: number //非冻结列的开始列，有效区间[frozenCI, colCount)，若不存在非冻结列需要渲染，则应等于 colCount，[依赖数据] frozenCI
  endRI: number
  endCI: number // 非冻结列的结束列， 有效区间[frozenCI, colCount)，若不存在非冻结列需要渲染，则应等于 frozenCI - 1 [依赖数据] frozenCI
  // 标记数据区绘制位置
  // start为单元格[左/上]边缘，end为单元格[右/下]边缘
  startX: number
  endX: number
  startY: number
  endY: number

  /**
   * --------------------------------------------------
   * |3.2| (frozen title)2.2:      (title)2.1     |   |
   * | - |----------------------------------------|   |
   * |   |                  |                     | v |
   * | i |                  |                     |   |
   * | n |                  |                     | s |
   * | d |                  |                     | c |
   * | e | (frozen data)1.2 |       (data)1.1     | r |
   * | x |                  |                     | o |
   * |   |                  |                     | l |
   * |3.1|                  |                     |   |
   * |   |                  |                     |   |
   * |--------------------------------------------|   |
   * |4.3|(frozen stats)4.2 |       (stats)4.1    |   |
   * |--------------------------------------------+---|
   * |                    h scroll                | 0 |
   * --------------------------------------------------
   */
  //数据非冻结区区（area1.1）范围矩阵
  areaDataRect: RectType
  //数据区冻结区（area1.2）范围矩阵
  areaDataFrozenRect: RectType
  //列名区非冻结区（area2.1）范围矩阵
  areaTitleRect: RectType
  //列名区冻结区（area2.2）范围矩阵
  areaTitleFrozenRect: RectType
  //统计区非冻结区（area4.1）范围矩阵
  areaStatsRect: RectType
  //统计区冻结区（area4.2+4.3）范围矩阵
  areaStatsFrozenRect: RectType
  //序号区（area3）范围矩阵
  areaIndexRect: RectType
  //序号区（area3.2）标题范围矩阵
  areaIndexTitleRect: RectType
  //序号区（area3.1）序号范围矩阵
  areaIndexIndexRect: RectType
  //数据焦点行区域
  areaFocusRect: RectType

  hScroll: ScrollBarType // 水平滚动条参数
  vScroll: ScrollBarType // 垂直滚动条参数

  focusLineRI: number | undefined // focus line index 从0开始， -1表示没有hover的位置

  focusBatchIndex: boolean // focus batch index, 是否focus到batch index 的区域
  focusIndexRI: number | undefined // focus index index, 从0开始， undefined 表示没有hover的位置

  focusTitleCI: number | undefined // focus title index 从0开始， -1表示没有hover的位置
  focusTitleRect: RectType | undefined // focus title 的区域
  focusTitleBtnRect: RectType | undefined // title的可点击区域，
  focusTitleBtnIconRect: RectType | undefined // title的可点击图标位置，

  focusStatsCI: number | undefined // focus stats index 从0开始， -1表示没有hover的位置
  focusStatsRect: RectType | undefined // focus stats 的区域
  statsData: (StatsDataType | undefined)[] // 当前的统计信息

  postParams: PostProcessParam
}

//#region 预处理渲染数据相关的声明
export type ProcesserParam = {
  renderData: RenderData
  context: KsSheetData
  sheet: any
  renderCtx: CtxType
}

export const POINT_X: number = 0
export const POINT_Y: number = 1

export type Processer = (param: ProcesserParam) => void

//#region  渲染数据相关的声明
//画布数据
export type CanvasData = {
  cur: PointType
  point: PointType
  width: number
  height: number
  devicePixelRatio: number
}
