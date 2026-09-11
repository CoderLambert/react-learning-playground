export const NOTE_CONTENT_ROOT = "src/content/notes";
export const NOTE_FILE_SUFFIX = ".mdx";
export const NOTE_PATH_PATTERN = `${NOTE_CONTENT_ROOT}/{learningUnitId}${NOTE_FILE_SUFFIX}`;

function assertLearningUnitId(learningUnitId) {
  if (typeof learningUnitId !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(learningUnitId)) {
    throw new TypeError(`Invalid learning unit id: ${String(learningUnitId)}`);
  }
  return learningUnitId;
}

export function getNoteFileName(learningUnitId) {
  return `${assertLearningUnitId(learningUnitId)}${NOTE_FILE_SUFFIX}`;
}

export function getNotePath(learningUnitId) {
  return `${NOTE_CONTENT_ROOT}/${getNoteFileName(learningUnitId)}`;
}

/**
 * Stable consumer API for Demo -> Note resolution.
 *
 * F0 intentionally ships no MDX runtime. The MDX Runtime worker will replace
 * this implementation with lazy import.meta.glob resolution while preserving
 * this function signature. A missing note is represented by null and must be a
 * non-fatal state in LearningInspector.
 *
 * @param {string} learningUnitId
 * @returns {null | (() => Promise<unknown>)}
 */
export function getNoteLoader(learningUnitId) {
  assertLearningUnitId(learningUnitId);
  return null;
}
