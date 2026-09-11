export const NOTE_CONTENT_ROOT = "src/content/notes";
export const NOTE_FILE_SUFFIX = ".mdx";
export const NOTE_PATH_PATTERN = `${NOTE_CONTENT_ROOT}/{learningUnitId}${NOTE_FILE_SUFFIX}`;

const NOTE_MODULE_LOADERS = import.meta.glob("../content/notes/*.mdx");
const NOTE_IMPORT_ROOT = "../content/notes";

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

function getNoteImportPath(learningUnitId) {
  return `${NOTE_IMPORT_ROOT}/${getNoteFileName(learningUnitId)}`;
}

/**
 * Stable consumer API for Demo -> Note resolution.
 *
 * Vite expands the glob into per-file dynamic import functions. No note module
 * is eagerly imported, so adding many notes does not grow the initial app
 * bundle with their compiled MDX bodies.
 *
 * Missing notes are represented by null and are a normal migration state while
 * content is being added incrementally.
 *
 * @param {string} learningUnitId
 * @returns {null | (() => Promise<unknown>)}
 */
export function getNoteLoader(learningUnitId) {
  const importPath = getNoteImportPath(learningUnitId);
  return NOTE_MODULE_LOADERS[importPath] ?? null;
}

export function hasNote(learningUnitId) {
  return getNoteLoader(learningUnitId) !== null;
}

export function getAvailableNoteIds() {
  const prefix = `${NOTE_IMPORT_ROOT}/`;
  return Object.keys(NOTE_MODULE_LOADERS)
    .filter((path) => path.startsWith(prefix) && path.endsWith(NOTE_FILE_SUFFIX))
    .map((path) => path.slice(prefix.length, -NOTE_FILE_SUFFIX.length))
    .sort();
}
