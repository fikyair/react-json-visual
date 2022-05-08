import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import useUpdateFunction from './hooks/useUpdateFunction'
import KsUserSheet from './KsCanvas/KsUserSheet'
import { LoadingFlagCallbackType, StatisticsListType } from './KsCanvas/types'
import { initState, reducer } from './utils/reducer'
import { Utils } from './utils/tools'

const RowHeight = 32
function App() {
  const ksSheetRef = useRef<any>()
  const sheetId = 'sh4b6cf9788f4a5086' // 大数据表格
  const monitorTableCol = (column: any, rect: any) => {
    useStateColRef.current.openUseStateColPopover(column, rect)
  }
  const [state, selfDispatch] = useReducer(reducer, initState())
  const curCanvas = useRef<HTMLCanvasElement>(null)
  const [getCur, setCur] = useState(() => ({ curX: 0, curY: 0 }))
  const [tabConfig, setTabConfig] = useState(() => ({
    colNum: 13,
    RowNum: 6,
    colWidth: 220,
  }))

  // 使用态列
  const useStateColRef = useRef<any>()
  const columnStatistics = (
    column: any,
    rect: any,
    menuList: StatisticsListType[]
  ) => {
    selfDispatch({
      type: 'columnSStyle',
      payload: {
        menuList,
        visibleCS: true,
        rect,
      },
    })
  }

  const onDataLoading1: LoadingFlagCallbackType = useCallback(
    (isDisplay: boolean, flagType: string) => {
      // console.log('loading', isDisplay, flagType);
      // dispatch({
      //   type: 'appModal/saveData',
      //   payload: {
      //     sheetIsLoading: {
      //       isDisplay: isDisplay,
      //       flagType: flagType,
      //       loadingText: '正在加载...',
      //     },
      //   },
      // });
    },
    []
  )
  useEffect(() => {
    if (curCanvas.current) {
      const tableCtx = curCanvas.current.getContext('2d') // 得到渲染上下文
      if (!tableCtx) return
      let canvasWidth = tableCtx.canvas.width
      let canvasHeight = tableCtx.canvas.height
      drawBorder(tableCtx, { width: canvasWidth, height: canvasHeight })
    }
  })

  //画个边框
  const drawBorder = (
    ctx: CanvasRenderingContext2D,
    renderData: { width: number; height: number }
  ) => {
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(0 + 0.5, 0 + 0.5)
    ctx.lineTo(renderData.width - 0.5, 0 + 0.5)
    ctx.lineTo(renderData.width - 0.5, renderData.height - 0.5)
    ctx.lineTo(0 + 0.5, renderData.height - 0.5)
    ctx.lineTo(0 + 0.5, 0 + 0.5)
    ctx.stroke()
  }

  const onWheel = useUpdateFunction((e: WheelEvent) => {
    if (curCanvas.current) {
      const tableCtx = curCanvas.current.getContext('2d') // 得到渲染上下文
      const canvasWidth = tableCtx.canvas.width
      const canvasHeight = tableCtx.canvas.height
      tableCtx.clearRect(0, 0, canvasWidth, canvasHeight)

      setCur((pre) => ({
        curX: pre.curX + e.deltaX,
        curY: pre.curY + e.deltaY,
      }))
      // console.log('first', getCur)
      const _curX = getCur.curX + e.deltaX
      const _curY = getCur.curY + e.deltaY

      const curX = Utils.clamp(_curX, 0, 1708)
      const __curY = Utils.clamp(_curY, 0, 3000)
      const curY = RowHeight - (__curY % RowHeight)
      // 向下滑动触摸板 deltaY 是正，__curY 不断增大，curY 结果不断减小，每条线的绘制起始点不断减小，所以表现为向上滚动
      setCur({ curX: curX, curY: __curY })
      drawHLines(tableCtx, tableCtx?.canvas.width, curY + 40) // 留出标题行
      drawVLines(tableCtx, tableCtx?.canvas.height, curX) // 留出序号列
    }
  })

  // 画水平线
  const drawHLines = (
    tableCtx: CanvasRenderingContext2D,
    canvasWidth: number,
    curY: number
  ) => {
    tableCtx.beginPath()
    // 画标题栏
    tableCtx.moveTo(0, 40 + 0.5)
    tableCtx.lineTo(canvasWidth, 40 + 0.5)
    tableCtx.strokeStyle = 'green'
    while (curY < 500) {
      tableCtx.moveTo(0 + 0.5, curY + 0.5)
      tableCtx.lineTo(canvasWidth + 0.5, curY + 0.5)
      curY += RowHeight
    }
    tableCtx.stroke()
  }

  // 画垂直线
  const drawVLines = (
    tableCtx: CanvasRenderingContext2D,
    canvasHeight: number,
    curX: number
  ) => {
    tableCtx.beginPath()
    tableCtx.strokeStyle = 'lightpink'
    // 画序号列
    tableCtx.moveTo(59 + 0.5, 0)
    tableCtx.lineTo(59 + 0.5, canvasHeight)
    const colPreSum = definePreSum()
    // console.log('colPreSum: ', colPreSum)
    // 更新 -------
    const frozenCI = 0
    const dataWidthInScreen = tableCtx.canvas.width - 59 // 窗体宽度 - 序号列宽度 - 垂直滚动条宽度（如果有）
    let endCI = frozenCI - 1
    let startCI = tabConfig.colNum
    let endCurX = curX + dataWidthInScreen
    let startCurX = curX + 0 // + frozenW
    for (let i = tabConfig.colNum - 1; i >= frozenCI; i--) {
      if (endCurX > colPreSum[i]) {
        endCI = i
        break
      }
    }
    for (let i = frozenCI; i < tabConfig.colNum; i++) {
      if (startCurX < colPreSum[i + 1]) {
        startCI = i
        break
      }
    }
    // console.log('startCI, endCI ', startCI, endCI)
    // 结束 ------------
    // 画表格列
    for (let i = startCI; i <= endCI; i++) {
      // console.log(
      //   'object',
      //   colPreSum[i + 1],
      //   '-',
      //   curX,
      //   '+',
      //   59,
      //   '=',
      //   colPreSum[i + 1] - curX + 59
      // )
      tableCtx.moveTo(colPreSum[i + 1] - curX + 59 + 0.5, 0)
      // 向右滑动触摸板，deltaX 是正，curX 不断增大，垂直线的起始点不断减小，所以表现为想左滚动。
      tableCtx.lineTo(colPreSum[i + 1] - curX + 59 + 0.5, canvasHeight)
    }
    tableCtx.stroke()
  }

  const definePreSum = () => {
    const _colWidth = new Array(tabConfig.colNum).fill(tabConfig.colWidth)
    return _colWidth.reduce((pre, curr, i) => [...pre, pre[i] + curr], [0])
  }

  useEffect(() => {
    window.addEventListener('wheel', onWheel)
    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div style={{ margin: 20 }}>
      {/* <KsUserSheet
        ref={ksSheetRef}
        sheetId={sheetId}
        width={1183}
        height={398}
        onStatsClickCallback={columnStatistics}
        onColClickCallback={monitorTableCol}
        onLineClick={(formId, colId) => {
          // dispatch({
          //   type: 'appModal/saveData',
          //   payload: { formId: formId || '', visibleFormDetail: true },
          // })
        }}
        onDataLoading={onDataLoading1}
      /> */}
      <canvas ref={curCanvas} height={450} width={1156} />
    </div>
  )
}

export default App
