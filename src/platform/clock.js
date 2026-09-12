export function createSystemClock({ DateImpl = Date } = {}) {
  if (typeof DateImpl !== "function") {
    throw new TypeError("Date implementation is required");
  }

  return Object.freeze({
    now() {
      return new DateImpl();
    },
    nowIso() {
      return new DateImpl().toISOString();
    },
  });
}

export function createFixedClock(value) {
  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    throw new TypeError("fixed clock value must be a valid date");
  }

  return Object.freeze({
    now() {
      return new Date(timestamp);
    },
    nowIso() {
      return new Date(timestamp).toISOString();
    },
  });
}

export const systemClock = createSystemClock();
