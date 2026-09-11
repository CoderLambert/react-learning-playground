import { useState } from "react";

/**
 * 复用“计数行为”，但每次调用都会拥有自己独立的 State。
 * Custom Hook 共享的是状态逻辑，不是状态实例。
 */
export function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((current) => current + step);
  const decrement = () => setCount((current) => current - step);
  const reset = () => setCount(initialValue);

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
