import React, { forwardRef, useRef, useState } from 'react'
import { useEffect } from 'react'
import { KsSheetController } from './KsSheetController'
import {
  BatchSelectModeCallbackType,
  ColumnId,
  EntityId,
  FormId,
  LoadingFlagCallbackType,
  RectType,
  SheetId,
} from './types'

export interface KsSheetProps {
  width: number
  height: number
  sheetEntityId?: EntityId
  sheetId: SheetId
  onStatsClickCallback?: StatsMenuClickType
  onColClickCallback?: (column: any, rect: RectType) => void
  onLineClick?: (formId: FormId, columnId: ColumnId) => void
  onDataLoading?: LoadingFlagCallbackType
  onBatchModeChangedCallback?: BatchSelectModeCallbackType // 当批量操作状态修改时，回调设定的函数
}
export type StatsMenuClickType = (
  column: any,
  rect: RectType,
  curType: any[]
) => void

const KsSheet = forwardRef((props: KsSheetProps, ref) => {
  const curCanvas = useRef<HTMLCanvasElement>(null)
  const [curSheet, setCurSheet] = useState<KsSheetController | undefined>()

  useEffect(() => {
    setCurSheet(new KsSheetController())
    return () => {
      setCurSheet(undefined)
    }
  }, [])

  useEffect(() => {
    curSheet?.setCanvas(curCanvas.current)
  }, [curSheet, curCanvas])

  useEffect(() => {
    if (props.sheetEntityId) {
      window.dataCenter.getEntity<any>(props.sheetEntityId).then((_entity) => {
        console.log('_entity: ', _entity)
        // return curSheet?.setSheet(_entity);
      })
    }
  }, [curSheet, props.sheetEntityId])

  useEffect(() => {
    if (curCanvas.current) {
      var ctx = curCanvas.current.getContext('2d') // 得到渲染上下文
      // 绘制第一个长方形
      //   ctx.fillStyle = 'rgb(200,0,0)'
      //   ctx.fillRect(10, 10, 55, 50)

      // 绘制第二个长方形
      //   ctx.fillStyle = 'rgba(0, 0, 200, 0.5)'
      //   ctx.fillRect(30, 30, 55, 50)
    }
  })
  return <canvas ref={curCanvas} width={props.width} height={props.height} />
})

export default KsSheet
