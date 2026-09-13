export function createCompactionOwnership() {
  let generation = 0;
  let activePromise = null;

  return {
    invalidate() {
      generation += 1;
      activePromise = null;
      return generation;
    },

    capture() {
      return { generation };
    },

    getActivePromise() {
      return activePromise;
    },

    activate(token, promise) {
      if (token?.generation !== generation) return false;
      activePromise = promise;
      return true;
    },

    isCurrent(token, promise) {
      return token?.generation === generation && activePromise === promise;
    },

    clear(token, promise) {
      if (!this.isCurrent(token, promise)) return false;
      activePromise = null;
      return true;
    },
  };
}
