import { CtxType, RenderData } from './types'

// 渲染器
export class KsSheetRenderer {
  private _context: CtxType
  private _offsetContext: CtxType
  constructor(context: CtxType, offsetContext: CtxType) {
    this._context = context
    this._offsetContext = offsetContext
  }

  public async render(ctx: CtxType, renderData: RenderData) {
    //TODO 只清除变化的区域
    ctx.clearRect(0, 0, renderData.width, renderData.height)

    this.drawAreas(ctx, renderData)
    // this.drawLines(ctx, renderData);

    // ScrollBar.render(ctx, renderData.hScroll);
    // ScrollBar.render(ctx, renderData.vScroll);

    // this.tailClean(ctx, renderData);
  }

  /************************** Draw Area **************************************/

  public drawAreas(ctx: CtxType, renderData: RenderData) {
    // this.drawAreaData(ctx, renderData);
    // this.drawAreaTitle(ctx, renderData);
    // this.drawAreaIndex(ctx, renderData);
    // this.drawAreaStats(ctx, renderData);
    // this.drawOptionalPart(ctx, renderData);
  }
}
