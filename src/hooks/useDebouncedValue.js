import { useEffect, useState } from "react";

/**
 * 将定时器同步细节封装起来，调用方只关心“延迟后的值”。
 * 这是自定义 Hook 很典型的工程价值：把 Effect 封装成声明式能力。
 */
export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
