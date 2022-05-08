import {
  CanvasData,
  CtxType,
  POINT_X,
  POINT_Y,
  Processer,
  ProcesserParam,
  RenderData,
  SheetId,
} from './types'
import icon from '../configs/icons.png'
import { postProcessList } from './KsSheetDataPost'
import { extendDeep } from '../utils/tools'
import { KsCanvasConfig } from '../utils/KsCanvasConfig'

type DataLoader = () => undefined

const DEFAULT_SHEET_DATA_COUNT = 1000
const DEFAULT_SHEET_DATA_POWER = 2

const DEFAULT_SHEET_OFFSET = [0, 0]
const DEFAULT_SHEET_POINT = [-1, -1]

export class KsSheetData {
  //TMP
  private _icons: HTMLImageElement
  private _containerLoader: DataLoader | undefined = undefined

  constructor(ctx: CtxType, containerLoader: DataLoader) {
    this._offsetCtx = ctx
    //TMP
    this._icons = new Image()
    this._icons.src = icon

    this._containerLoader = containerLoader
  }

  private _curSheetDataDisplayCount: number = DEFAULT_SHEET_DATA_COUNT
  public get curSheetDataDisplayCount(): number {
    return this._curSheetDataDisplayCount
  }
  public set curSheetDataDisplayCount(value: number) {
    this._curSheetDataDisplayCount = value
    this.markReprocessData()
  }

  public markReprocessData() {
    this._isPadding = true
  }

  private _renderingData: RenderData = {} as RenderData

  public get renderingData(): RenderData {
    return this._renderingData
  }

  private _getRenderData(): RenderData {
    //TODO use two render data switch this
    return this.renderingData
  }

  // 返回一个用于测量渲染尺寸的RenderingContext2D
  // 先暂时持有controller里面的离屏缓存
  private _getRenderContext(): CtxType {
    return this._offsetCtx
  }
  public get curX(): number {
    return this._canvasData.cur[POINT_X]
  }
  public set curX(value: number) {
    this._canvasData.cur[POINT_X] = value
    this.markReprocessData()
  }
  public get curY(): number {
    return this._canvasData.cur[POINT_Y]
  }
  public set curY(value: number) {
    this._canvasData.cur[POINT_Y] = value
    this.markReprocessData()
  }

  public get pointX(): number {
    return this._canvasData.point[POINT_X]
  }
  public set pointX(value: number) {
    this._canvasData.point[POINT_X] = value
    this.markReprocessData()
  }

  public get pointY(): number {
    return this._canvasData.point[POINT_Y]
  }
  public set pointY(value: number) {
    this._canvasData.point[POINT_Y] = value
    this.markReprocessData()
  }

  private _sheetId: SheetId = ''
  public get sheetId(): SheetId {
    return this._sheetId
  }

  public set sheetId(value: SheetId) {
    if (value != this._sheetId) {
      this._sheetId = value
      this.markReprocessData()
    }
  }

  private _editMode: boolean = true
  public get editMode(): boolean {
    return this._editMode
  }
  public set editMode(value: boolean) {
    this._editMode = value
    this.markReprocessData()
  }

  private _showTitleIcon: boolean = true
  public get showTitleIcon(): boolean {
    return this._showTitleIcon
  }
  public set showTitleIcon(value: boolean) {
    this._showTitleIcon = value
    this.markReprocessData()
  }

  private _titleFocusEnable: boolean = true
  public get titleFocusEnable(): boolean {
    return this._titleFocusEnable
  }
  public set titleFocusEnable(value: boolean) {
    this._titleFocusEnable = value
    this.markReprocessData()
  }

  private _lockedWidth: number | undefined
  public get lockedWidth(): number | undefined {
    return this._lockedWidth
  }
  public set lockedWidth(value: number | undefined) {
    this._lockedWidth = value
    this.markReprocessData()
  }

  private _ignoreWidthChanging: boolean = false
  public get ignoreWidthChanging(): boolean {
    return this._ignoreWidthChanging
  }
  public set ignoreWidthChanging(value: boolean) {
    this._ignoreWidthChanging = value
    this.markReprocessData()
  }

  private _showStatsLine: boolean = true
  public get showStatsLine(): boolean {
    return this._showStatsLine
  }
  public set showStatsLine(value: boolean) {
    this._showStatsLine = value
    this.markReprocessData()
  }

  private _autoHideScroll: boolean = true
  public get autoHideScroll(): boolean {
    return this._autoHideScroll
  }
  public set autoHideScroll(value: boolean) {
    this._autoHideScroll = value
    this.markReprocessData()
  }

  private _hideIndexArea: boolean = false
  public get hideIndexArea(): boolean {
    return this._hideIndexArea
  }
  public set hideIndexArea(value: boolean) {
    this._hideIndexArea = value
  }

  private _ignoreDatas: boolean = false
  public get ignoreDatas(): boolean {
    return this._ignoreDatas
  }
  public set ignoreDatas(value: boolean) {
    this._ignoreDatas = value
  }

  //数据准备过程
  private _processList: Processer[] = [
    this._processBaseData, // 画布基本数据准备
    // this._processSheet, // 表格数据准备
    // this._processRenderRect,
    // this._processCullingData, // 准备裁剪剔除数据
    // this._processInteractRect,
  ]

  private _hoverRI: number | undefined = -1
  public get hoverRI(): number | undefined {
    return this._hoverRI
  }

  private _canvasData: CanvasData = {
    cur: extendDeep(DEFAULT_SHEET_OFFSET),
    point: extendDeep(DEFAULT_SHEET_POINT),
    width: 0,
    height: 0,
    devicePixelRatio: 1,
  }

  // 当数据异常或不需要渲染时返回undefined
  public processData(): RenderData | undefined {
    let renderData = this._getRenderData()
    let sheet = this._containerLoader ? this._containerLoader() : undefined

    if (!sheet) {
      return undefined
    }

    let postParam: ProcesserParam = {
      renderData: renderData,
      context: this,
      renderCtx: this._getRenderContext(),
      sheet: sheet,
    }

    this._processList.map((processer) => processer(postParam))

    postProcessList.map((processer) => processer(postParam))

    //TODO 这里之后应该考虑把数据直接吐给异步渲染线程/纤程
    this._isPadding = false
    this._isRendering = true

    this._canvasData.cur[POINT_X] = renderData.curX
    this._canvasData.cur[POINT_Y] = renderData.curY

    if (
      renderData.moveHeight - renderData.curY < renderData.dataRowH * 0.5 &&
      Math.abs(
        renderData.dataHeight -
          this.curSheetDataDisplayCount * renderData.dataRowH
      ) <= Number.EPSILON
    ) {
      this.curSheetDataDisplayCount *= DEFAULT_SHEET_DATA_POWER
    }

    return renderData
  }

  private _processBaseData(param: ProcesserParam) {
    const renderData = param.renderData
    const context = param.context
    //TMP 临时放置用于调试
    renderData.dataContainer = context
    renderData.icon = context._icons

    renderData.curX = context.curX
    renderData.curY = context.curY
    renderData.curMinDisplayDataCount = context.curSheetDataDisplayCount

    renderData.width = context._canvasData.width
    renderData.height = context._canvasData.height
    renderData.pointX = context.pointX
    renderData.pointY = context.pointY
    renderData.devicePixelRatio = context._canvasData.devicePixelRatio

    renderData.sheetId = context.sheetId
    renderData.isEditMode = context.editMode
    renderData.showTitleIcon = context.showTitleIcon
    renderData.titleFocusEnable = context.titleFocusEnable
    renderData.lockedWidth = context.lockedWidth
    renderData.ignoreWidthChanging = context.ignoreWidthChanging
    renderData.showStatsLine = context.showStatsLine
    renderData.autoHideScroll = context.autoHideScroll
    renderData.hideIndexArea = context.hideIndexArea
    renderData.ignoreDatas = context.ignoreDatas

    renderData.dataRowH = KsCanvasConfig.DATA_ROW_HEIGHTS[0]
    renderData.titleRowH = KsCanvasConfig.TITLE_AREA_ROW_HEIGHT
    renderData.statsRowH = renderData.showStatsLine
      ? KsCanvasConfig.STATS_AREA_ROW_HEIGHT
      : 0
    renderData.scrollSizeHorizon = KsCanvasConfig.SCROLL_SIZE_HORIZON
    renderData.scrollSizeVertical = KsCanvasConfig.SCROLL_SIZE_VERTICAL
    renderData.addColWidth = KsCanvasConfig.DEFAULT_EDITOR_COL_WIDTH
  }

  // 返回一个用于测量渲染尺寸的RenderingContext2D
  // 先暂时持有controller里面的离屏缓存
  private _offsetCtx: CtxType
  // 等待计算状态
  private _isPadding: boolean = true
  // 渲染中状态
  private _isRendering: boolean = false

  // 判断是否再等待计算计算和渲染
  // 若无需计算/重绘,表示检查通过，返回true，
  public get isProcessPadding(): boolean {
    return this._isPadding && !this._isRendering
  }

  // 渲染完成，归还renderData
  public renderOver(renderData: RenderData) {
    this._isRendering = false
  }
}
