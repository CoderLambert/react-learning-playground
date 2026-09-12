export const ASSESSMENT_REPOSITORY_METHODS = Object.freeze([
  "listQuestions",
  "getQuestion",
  "createQuestions",
  "updateQuestion",
  "retireQuestion",
  "createSession",
  "getSession",
  "saveAttempt",
  "listAttempts",
  "getMutationReceipt",
]);

export function assertAssessmentRepository(repository) {
  if (!repository || typeof repository !== "object") {
    throw new TypeError("assessment repository is required");
  }
  for (const method of ASSESSMENT_REPOSITORY_METHODS) {
    if (typeof repository[method] !== "function") {
      throw new TypeError(`assessment repository.${method} is required`);
    }
  }
  return repository;
}

export const ASSESSMENT_QUERY_STORE_METHODS = Object.freeze(["subscribe", "getSnapshot"]);

export function assertAssessmentQueryStore(store) {
  if (!store || typeof store !== "object") {
    throw new TypeError("assessment query store is required");
  }
  for (const method of ASSESSMENT_QUERY_STORE_METHODS) {
    if (typeof store[method] !== "function") {
      throw new TypeError(`assessment query store.${method} is required`);
    }
  }
  return store;
}
