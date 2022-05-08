import { PostProcessParam, Processer, ProcesserParam } from './types'

export const postProcessList: Processer[] = [
  postProcessCheck,
  processHoverRect,
  processClickRect,
  processDragRect,
]

function postProcessCheck(param: ProcesserParam) {
  const renderData = param.renderData
  if (!renderData.postParams) {
    renderData.postParams = {} as PostProcessParam
  }
}

//TODO 这里应该考虑按照功能组件(widget)需要自行插入数据处理，统一处理部分应该考虑只处理必要的通用数据，并且应该考虑可以被后续流程修改的可能性
function processHoverRect(param: ProcesserParam) {
  const renderData = param.renderData
  const context = param.context
  const postParams = renderData.postParams

  if (
    context.hoverRI != undefined &&
    context.hoverRI >= renderData.startRI &&
    context.hoverRI <= renderData.endRI
  ) {
    postParams.focusRI = context.hoverRI
  } else {
    postParams.focusRI = undefined
  }
}

function processClickRect(param: ProcesserParam) {}

function processDragRect(param: ProcesserParam) {}
