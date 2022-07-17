// @ts-nocheck
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants'
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import useUpdateFunction from './hooks/useUpdateFunction'
import useSyncCallback from './hooks/useAsyncCallback'
import icon from './utils/icons.png'

import { Utils } from './utils/tools'

const RowHeight = 32
function App() {
  const curCanvas = useRef<HTMLCanvasElement>(null)
  const offsetCanvas = useRef<HTMLCanvasElement>(null)
  const offsetCtx = useRef<HTMLCanvasElement>(null)
  const [getCur, setCur] = useState(() => ({ curX: 0, curY: 0 }))
  const [point, setPoint] = useState(() => ({ pointX: -1, pointY: -1 }))
  const [progress, setProgressing] = useState<NN | BB>(false)
  const [tabConfig, setTabConfig] = useState(() => ({
    colNum: 13,
    RowNum: 6,
    colWidth: 220,
  }))

  const [popover, setPopover] = useState({})

  useEffect(() => {
    if (curCanvas.current) {
      const tableCtx = curCanvas.current.getContext('2d') // 得到渲染上下文
      if (!tableCtx) return
      let canvasWidth = tableCtx.canvas.width
      let canvasHeight = tableCtx.canvas.height
      drawBorder(tableCtx, { width: canvasWidth, height: canvasHeight })

      // 离屏
      const _offsetCanvas = document.createElement('canvas')
      const _offsetCtx = _offsetCanvas.getContext('2d')
      _offsetCanvas.width = 1156
      _offsetCanvas.height = 450
      offsetCanvas.current = _offsetCanvas
      offsetCtx.current = _offsetCtx
      // dprCanvas(offsetCtx.current, offsetCanvas.current)
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

  const frame = useSyncCallback(() => {
    if (progress) {
      //在动画没有结束前，递归渲染
      renderer()
    }
    window.requestAnimationFrame(frame)
  })

  const renderer = useSyncCallback(() => {
    if (curCanvas.current) {
      const tableCtx = curCanvas.current.getContext('2d') // 得到渲染上下文
      const canvasWidth = tableCtx.canvas.width
      const canvasHeight = tableCtx.canvas.height
      tableCtx.clearRect(0, 0, canvasWidth, canvasHeight)
      const curX = Utils.clamp(getCur.curX, 0, 1708)
      const __curY = Utils.clamp(getCur.curY, 0, 3000)
      const curY = RowHeight - (__curY % RowHeight)
      // 向下滑动触摸板 deltaY 是正，__curY 不断增大，curY 结果不断减小，每条线的绘制起始点不断减小，所以表现为向上滚动
      setCur({ curX: curX, curY: __curY })
      drawHLines(tableCtx, tableCtx?.canvas.width, curY + 40) // 留出标题行
      drawVLines(tableCtx, tableCtx?.canvas.height, curX) // 留出序号列
      drawData(tableCtx, offsetCtx.current, offsetCanvas.current, curX, curY) // 画数据
    }
  })

  useEffect(() => {
    const tableCtx = curCanvas.current.getContext('2d') // 得到渲染上下文
    dpr(tableCtx)
    // dpr(offsetCtx)
  }, [])

  useEffect(() => {
    window.requestAnimationFrame(frame)
  }, [])

  const onWheel = useUpdateFunction((e: WheelEvent) => {
    setCur((pre) => {
      return {
        curX: pre.curX + e.deltaX,
        curY: pre.curY + e.deltaY,
      }
    })
  })

  const drawData = (
    tableCtx: CanvasRenderingContext2D,
    offsetCtx: CanvasRenderingContext2D,
    offsetCanvas: HTMLCanvasElement,
    curX
  ) => {
    for (let ci = 0; ci < 10; ci++) {
      for (let ri = 0; ri < 10; ri++) {
        offsetCtx.fillStyle = '#000'
        offsetCtx.font = '16px SF Pro Display'
        offsetCtx.fillText(
          '你好',
          definePreSum()[ci] - curX + 64.5,
          ri * RowHeight - getCur.curY + 55.5
        )
      }
    }

    // const imageData = offsetCtx.getImageData(
    //   0,
    //   0,
    //   offsetCanvas.width,
    //   offsetCanvas.height
    // )
    // tableCtx.putImageData(imageData, 100, 100)
    tableCtx.drawImage(offsetCanvas, 59 + 0.5, 40)
  }

  function dprCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const width = canvas.width
    const height = canvas.height
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.transform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)

    canvas.style.height = height + 'px'
    canvas.style.width = width + 'px'
  }

  function dpr(ctx) {
    const canvas = document.getElementById('canvas')
    let width = canvas.width
    let height = canvas.height
    if (window.devicePixelRatio) {
      // 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
      // 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小
      canvas.height = height * window.devicePixelRatio
      canvas.width = width * window.devicePixelRatio
      // 所以需要将绘制比例放大
      // ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.transform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      )
      // 然后设置实际的大小
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }
  }

  const drawStatus = (
    tableCtx: CanvasRenderingContext2D,
    canvasWidth: number
  ) => {
    tableCtx.moveTo(0, 40 + 0.5)
    tableCtx.lineTo(canvasWidth, 40 + 0.5)
    // 画 icons
    let myIcons = new Image()
    myIcons.src = icon
    // offsetCtx.current.drawImage(myIcons, 50, 50, 50, 50, 100, 10, 80, 80)
    tableCtx.drawImage(myIcons, 50, 50, 50, 50, 100, 10, 80, 80)
  }

  // 画水平线
  const drawHLines = (
    tableCtx: CanvasRenderingContext2D,
    canvasWidth: number,
    curY: number
  ) => {
    tableCtx.beginPath()
    // 画标题栏
    drawStatus(tableCtx, canvasWidth)
    tableCtx.strokeStyle = 'green'
    while (curY < 500) {
      tableCtx.moveTo(0 + 0.5, curY + 0.5)
      tableCtx.lineTo(canvasWidth + 0.5, curY + 0.5)
      curY += RowHeight
    }
    tableCtx.stroke()
  }

  const drawIndexRect = (
    tableCtx: CanvasRenderingContext2D,
    canvasHeight: number
  ) => {
    // 序号区（area3）范围矩阵 [0, 0, 59 + 0.5, canvasHeight]
    tableCtx.moveTo(59 + 0.5, 0)
    tableCtx.lineTo(59 + 0.5, canvasHeight)
    const areaIndexIndexRect = [0, 0, 59 + 0.5, canvasHeight]

    const click = Utils.inRect(areaIndexIndexRect, [point.pointX, point.pointY])

    if (click) {
      // onColEditClick，可以绑定在 canvas 的 ref 上，暴露给外界
      setPopover({
        display: 'block',
        position: 'absolute',
        top: `${point.pointY}px`,
        left: `${point.pointX}px`,
      })
    } else {
      setPopover({
        display: 'none',
      })
    }
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
    drawIndexRect(tableCtx, canvasHeight)
    const colPreSum = definePreSum()
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

  const onMousedown = (e: MouseEvent) => {
    console.log('点击位置', e.offsetX, e.offsetY)
    setPoint({ pointX: e.offsetX, pointY: e.offsetY })
  }

  useEffect(() => {
    window.addEventListener('wheel', onWheel)
    window.addEventListener('mousedown', onMousedown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('mousedown', onMousedown)
    }
  }, [])
  // console.log('popover: ', popover)
  return (
    <div style={{ margin: 20, position: 'absolute' }}>
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
      <canvas id="canvas" ref={curCanvas} height={450} width={1156} />
      <div
        style={{
          width: 100,
          height: 200,
          display: 'none',
          background: '#fff',
          boxShadow: '2px 2px 0px 0px #f4f4f4',
          borderRadius: '4px',
          ...popover,
        }}
      >
        hi
      </div>

      <button onClick={() => setProgressing(true)}>开始渲染</button>
      <button onClick={() => setProgressing(false)}>停止渲染</button>
    </div>
  )
}

export default App
