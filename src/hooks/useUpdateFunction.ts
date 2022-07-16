/**
   我们在使用 useCallback 的时候，可能会将依赖项 设置为空数组，来避免 rerender，但如果在内部，使用了
   某个外部的值，那么就会导致，拿不到最新的值，如果想拿到，就必须添加依赖，这个时候 rerender 会失效。
   useUpdateFunction 就是解决这个问题。
   1、在组件多次 render 时保持引用一致。
   2、函数内始终能获取到最新的 props 与 state。

   更新 cbRef.current 的逻辑放在 useLayoutEffect 回调中进行。
   这就保证了 cbRef.current 始终在「视图完成渲染」后再更新：

   // 或者使用 useEffect 和 useRef
 */

import { useCallback, useLayoutEffect, useRef } from 'react'

const useUpdateFunction = <T extends unknown[], U>(cb: (...arg: T) => U) => {
  const cbRef = useRef<(...arg: T) => U>(cb)

  useLayoutEffect(() => {
    if (cbRef.current !== cb) {
      cbRef.current = cb
    }
  })

  return useCallback((...arg: T) => cbRef.current(...arg), [])
}

export default useUpdateFunction
