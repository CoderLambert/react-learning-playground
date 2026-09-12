export class AssessmentQueryStore {
  #snapshot;
  #listeners = new Set();

  constructor(initialSnapshot = null) {
    this.#snapshot = initialSnapshot;
  }

  getSnapshot = () => this.#snapshot;

  subscribe = (listener) => {
    if (typeof listener !== "function") {
      throw new TypeError("listener must be a function");
    }

    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  replaceSnapshot(nextSnapshot) {
    if (Object.is(this.#snapshot, nextSnapshot)) return this.#snapshot;

    this.#snapshot = nextSnapshot;
    for (const listener of [...this.#listeners]) listener();
    return this.#snapshot;
  }
}

export function createAssessmentQueryStore(initialSnapshot = null) {
  return new AssessmentQueryStore(initialSnapshot);
}
