/**
 * useState 改变值之后立刻获取最新的状态
 * 原因：1、 直接将最新的值当作参数传递给func不就行了吗，但是有时不只是一个状态，可能要传递的参数很多
 * 在 A 函数中 set 了最新值，并且在 A 函数中调用 B 函数，期望在不传参的情况下调用 B 函数
 * 在 B 函数中想获取最新值。
 */

import { useEffect, useState, useCallback } from 'react'
const useSyncCallback = (callback: any) => {
  const [proxyState, setProxyState] = useState({ current: false })
  const [params, setParams] = useState([])

  // 在 useSyncCallback 中创建一个新的函数 Func，并返回，通过这个Func来模拟函数调用
  // 在这个函数中我们要做的就是变更 proxyState 的 current 值为 true，来使得让 callback 被调用的条件成立，
  // 同时触发 react 组件 render 。这样内部的 useEffect 就会执行，随后调用 callback 实现我们想要的效果
  const Func = useCallback(
    (...args: any) => {
      setParams(args)
      setProxyState({ current: true })
    },
    [proxyState]
  )

  // 所以在useEffect获取的状态一定是最新的，所以利用这一点，把我们写的函数放到 useEffect 执行，函数里获取的状态就一定是最新的
  useEffect(() => {
    if (proxyState.current === true) setProxyState({ current: false })
  }, [proxyState])

  // 只有在 proxyState.current 为 true 才会调用
  useEffect(() => {
    proxyState.current && callback(...params)
  })

  return Func
}

export default useSyncCallback
