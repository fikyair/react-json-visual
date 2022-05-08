import { StatisticsListType } from '../KsCanvas/types'

export function initState(options?: StateData): StateData {
  return {
    visibleCS: false,
    columnSStyle: {},
    menuList: [],
    viewFormAuth: 'unfinished',
    viewSheetAuth: 'unfinished',
    enableBatchSelect: true,
    ...options,
  }
}

type Reducer<STATE, ACTION> = React.Reducer<STATE, ACTION>
type StateData = {
  visibleCS: boolean
  menuList: StatisticsListType[]
  viewFormAuth: boolean | 'unfinished'
  viewSheetAuth: boolean | 'unfinished'
  enableBatchSelect: boolean
  columnSStyle: {
    display?: string
  }
}

type SelfAction<STATE> = {
  type: string
  payload: any
}

export const reducer: Reducer<StateData, SelfAction<object>> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case 'setData':
      return { ...state, ...payload }
    case 'columnSStyle':
      const { rect, visibleCS, menuList } = payload
      return {
        ...state,
        visibleCS,
        menuList,
        columnSStyle: {
          width: rect[2],
          height: rect[3],
          position: 'absolute',
          zIndex: 1000,
          left: rect[0],
          top: rect[1],
          cursor: 'pointer',
        },
      }
    default:
      return state
  }
}
