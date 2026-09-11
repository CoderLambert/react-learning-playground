import { useCallback, useEffect, useRef } from "react";

export function useInspectorScrollMemory(scopeKey) {
  const positionsRef = useRef(new Map());
  const elementsRef = useRef(new Map());

  useEffect(() => {
    positionsRef.current.clear();
    elementsRef.current.forEach((element) => {
      if (element) element.scrollTop = 0;
    });
  }, [scopeKey]);

  const registerPane = useCallback((paneKey, element) => {
    if (!element) {
      elementsRef.current.delete(paneKey);
      return;
    }

    elementsRef.current.set(paneKey, element);
    const savedPosition = positionsRef.current.get(paneKey);
    if (typeof savedPosition === "number" && element.scrollTop !== savedPosition) {
      element.scrollTop = savedPosition;
    }
  }, []);

  const rememberScroll = useCallback((paneKey, event) => {
    positionsRef.current.set(paneKey, event.currentTarget.scrollTop);
  }, []);

  const getPaneProps = useCallback(
    (paneKey) => ({
      ref: (element) => registerPane(paneKey, element),
      onScroll: (event) => rememberScroll(paneKey, event),
    }),
    [registerPane, rememberScroll],
  );

  return { getPaneProps };
}
