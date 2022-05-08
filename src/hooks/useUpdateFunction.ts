/**
 * @author chenliang
 * @file 控制回调不会出现闭包劫持的问题，保证回调内部的值都是最新值
 * @example const closureInit = useUpdateFunction(init); useEffect(closureInit, deps);
 */

import { useRef } from 'react'

const useUpdateFunction = <T extends unknown[], U>(cb: (...arg: T) => U) => {
  const cbRef = useRef<(...arg: T) => U>(cb)

  if (cbRef.current !== cb) {
    cbRef.current = cb
  }

  return (...arg: T) => cbRef.current(...arg)
}

export default useUpdateFunction
