import { useCallback, useEffect, useMemo, useState } from "react";

export const DEMO_QUERY_PARAM = "demo";

function getBrowserWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function getLearningUnitIds(entries) {
  if (!Array.isArray(entries)) return [];

  return entries
    .map((entry) => (typeof entry === "string" ? entry : entry?.id))
    .filter((id) => typeof id === "string" && id.length > 0);
}

export function resolveDemoId(candidate, entries, fallbackId) {
  const ids = getLearningUnitIds(entries);
  if (ids.includes(candidate)) return candidate;
  if (ids.includes(fallbackId)) return fallbackId;
  return ids[0] ?? null;
}

export function readDemoUrlState(locationLike, entries, fallbackId) {
  const ids = getLearningUnitIds(entries);
  const params = new URLSearchParams(locationLike?.search ?? "");
  const candidate = params.get(DEMO_QUERY_PARAM);
  const hasDemoParam = params.has(DEMO_QUERY_PARAM);
  const valid = candidate !== null && ids.includes(candidate);

  return {
    demoId: resolveDemoId(candidate, ids, fallbackId),
    requestedDemoId: candidate,
    hasDemoParam,
    isValid: !hasDemoParam || valid,
  };
}

export function buildDemoUrl(locationLike, demoId) {
  const pathname = locationLike?.pathname || "/";
  const params = new URLSearchParams(locationLike?.search ?? "");
  const hash = locationLike?.hash ?? "";

  if (demoId) {
    params.set(DEMO_QUERY_PARAM, demoId);
  } else {
    params.delete(DEMO_QUERY_PARAM);
  }

  const search = params.toString();
  return `${pathname}${search ? `?${search}` : ""}${hash}`;
}

export function writeDemoUrl(demoId, {
  history,
  location,
  mode = "push",
} = {}) {
  const browserWindow = getBrowserWindow();
  const targetHistory = history ?? browserWindow?.history;
  const targetLocation = location ?? browserWindow?.location;

  if (!targetHistory || !targetLocation) return false;

  const url = buildDemoUrl(targetLocation, demoId);
  const method = mode === "replace" ? "replaceState" : "pushState";

  try {
    targetHistory[method]({ demoId }, "", url);
    return true;
  } catch {
    return false;
  }
}

export function useDemoUrlState({
  learningUnits,
  defaultDemoId,
  windowTarget = getBrowserWindow(),
} = {}) {
  const learningUnitIds = useMemo(
    () => getLearningUnitIds(learningUnits),
    [learningUnits],
  );
  const fallbackDemoId = useMemo(
    () => resolveDemoId(defaultDemoId, learningUnitIds, learningUnitIds[0]),
    [defaultDemoId, learningUnitIds],
  );

  const readCurrentDemoId = useCallback(() => (
    readDemoUrlState(windowTarget?.location, learningUnitIds, fallbackDemoId).demoId
  ), [fallbackDemoId, learningUnitIds, windowTarget]);

  const [demoId, setDemoId] = useState(readCurrentDemoId);

  useEffect(() => {
    if (!windowTarget) return undefined;

    const urlState = readDemoUrlState(
      windowTarget.location,
      learningUnitIds,
      fallbackDemoId,
    );

    setDemoId(urlState.demoId);

    if (urlState.hasDemoParam && !urlState.isValid && urlState.demoId) {
      writeDemoUrl(urlState.demoId, {
        history: windowTarget.history,
        location: windowTarget.location,
        mode: "replace",
      });
    }

    const handlePopState = () => {
      setDemoId(readCurrentDemoId());
    };

    windowTarget.addEventListener("popstate", handlePopState);
    return () => windowTarget.removeEventListener("popstate", handlePopState);
  }, [fallbackDemoId, learningUnitIds, readCurrentDemoId, windowTarget]);

  const selectDemo = useCallback((nextDemoId, { replace = false } = {}) => {
    const resolved = resolveDemoId(nextDemoId, learningUnitIds, fallbackDemoId);
    if (!resolved) return null;

    writeDemoUrl(resolved, {
      history: windowTarget?.history,
      location: windowTarget?.location,
      mode: replace ? "replace" : "push",
    });
    setDemoId(resolved);
    return resolved;
  }, [fallbackDemoId, learningUnitIds, windowTarget]);

  const syncFromUrl = useCallback(() => {
    const nextDemoId = readCurrentDemoId();
    setDemoId(nextDemoId);
    return nextDemoId;
  }, [readCurrentDemoId]);

  return {
    demoId,
    selectDemo,
    replaceDemo: (nextDemoId) => selectDemo(nextDemoId, { replace: true }),
    syncFromUrl,
  };
}
