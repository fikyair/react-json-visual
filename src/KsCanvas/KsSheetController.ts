import { KsSheetData } from './KsSheetData'
import { KsSheetRenderer } from './KsSheetRenderer'
import { CtxType, RenderData } from './types'

export class KsSheetController {
  //画布
  protected _canvas: HTMLCanvasElement | null = null
  protected _renderer: KsSheetRenderer | undefined
  // 渲染中状态
  private _isRendering: boolean = false

  protected _input: any
  protected _context: CtxType | null = null
  protected _offsetContext: CtxType
  protected _offsetCanvas: HTMLCanvasElement
  protected _thisFrame: (e: unknown) => void

  //动态数据
  protected _data: KsSheetData
  public get data(): KsSheetData {
    return this._data
  }

  public _sheet: any | undefined = undefined

  private _getSheetSync() {
    return this._sheet
  }

  public constructor() {
    this._offsetCanvas = document.createElement('canvas')
    this._offsetContext = this._offsetCanvas.getContext('2d')!
    this._data = new KsSheetData(
      this._offsetContext,
      this._getSheetSync.bind(this)
    ) // 获取 sheet 信息

    // this._input = new KsSheetInput(this);
    // 构建画布
    this._thisFrame = this.frame.bind(this)
    window.requestAnimationFrame(this._thisFrame)
  }

  public frame(e: any) {
    if (this._data && this.data.isProcessPadding) {
      new Promise(async () => {
        const renderData = await this._data.processData()
        if (!renderData) {
          return
        }
        // if (this.__autoResizeHeight) {
        //   let dataCount = renderData.dataCount
        //   if (this.__minRowCount != undefined) {
        //     dataCount = Math.max(this.__minRowCount, dataCount)
        //   }
        //   if (this.__maxRowCount != undefined) {
        //     dataCount = Math.min(this.__maxRowCount, dataCount)
        //   }
        //   const height =
        //     dataCount * renderData.dataRowH +
        //     renderData.titleRowH +
        //     renderData.statsRowH +
        //     renderData.scrollSizeHorizon
        //   if (height != this.__curHeight) {
        //     this.setConfig({
        //       width: this._data.width,
        //       height: height,
        //       devicePixelRatio: this._data.devicePixelRatio,
        //     })
        //   }
        // }
        // http://localhost:8080/
        if (this._renderer && this._context) {
          // let startTime = window.performance.now();

          await this._renderer.render(this._context, renderData)

          this.data.renderOver(renderData)

          // console.log('render:', window.performance.now() - startTime);
          // console.log('render:', window.performance.now() - startTime, renderData);
        }
      })
    }

    if (this && this._thisFrame) {
      window.requestAnimationFrame(this._thisFrame)
    }
  }

  public setCanvas(newCanvas: HTMLCanvasElement | null) {
    if (newCanvas) {
      this._canvas = newCanvas
      //   this._input.registerControlHandler(this._canvas)

      this._context = newCanvas.getContext('2d')
      if (this._context) {
        this._renderer = new KsSheetRenderer(this._context, this._offsetContext)
      }
    }
  }
}
