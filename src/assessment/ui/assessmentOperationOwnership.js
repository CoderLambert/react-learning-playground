export function createAssessmentOperationToken({ generation, learningUnitId, sessionId = null, requestId }) {
  return Object.freeze({ generation, learningUnitId, sessionId, requestId });
}

export function isAssessmentOperationCurrent(token, current) {
  if (!token || !current) return false;
  if (token.generation !== current.generation) return false;
  if (token.learningUnitId !== current.learningUnitId) return false;
  if (token.requestId !== current.requestId) return false;
  if (token.sessionId !== null && token.sessionId !== current.sessionId) return false;
  return true;
}
