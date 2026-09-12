export const ASSESSMENT_ERROR_CODES = Object.freeze({
  QUESTION_NOT_FOUND: "QUESTION_NOT_FOUND",
  REVISION_CONFLICT: "REVISION_CONFLICT",
  INVALID_QUESTION: "INVALID_QUESTION",
  INVALID_EVIDENCE: "INVALID_EVIDENCE",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_COMPLETED: "SESSION_COMPLETED",
  DUPLICATE_ATTEMPT: "DUPLICATE_ATTEMPT",
  STORAGE_UNAVAILABLE: "STORAGE_UNAVAILABLE",
});

export class AssessmentError extends Error {
  constructor(code, message, { details = null, cause } = {}) {
    if (!Object.values(ASSESSMENT_ERROR_CODES).includes(code)) {
      throw new TypeError(`Unsupported assessment error code: ${code}`);
    }
    super(message || code, cause === undefined ? undefined : { cause });
    this.name = "AssessmentError";
    this.code = code;
    this.details = details;
  }
}

export function isAssessmentError(error, code) {
  if (!(error instanceof AssessmentError)) return false;
  return code == null ? true : error.code === code;
}
