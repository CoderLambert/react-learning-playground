import { getCheckpointChapter } from "../components/chapterCheckpointMap.js";

function getUnitId(unit) {
  return typeof unit === "string" ? unit : unit?.id;
}

/**
 * Derive chapter/path navigation from the authoritative registry order plus the
 * existing chapter checkpoint terminal mapping. No chapter lesson list is
 * duplicated here.
 */
export function buildLearningPath(learningUnits) {
  const units = Array.isArray(learningUnits) ? learningUnits.filter((unit) => getUnitId(unit)) : [];
  const chapters = [];
  let chapterStart = 0;

  units.forEach((unit, index) => {
    const chapter = getCheckpointChapter(getUnitId(unit));
    if (!chapter) return;

    const chapterUnits = units.slice(chapterStart, index + 1);
    if (chapterUnits.length === 0) return;

    chapters.push({
      chapter,
      units: chapterUnits,
      firstId: getUnitId(chapterUnits[0]),
      checkpointId: getUnitId(chapterUnits[chapterUnits.length - 1]),
    });
    chapterStart = index + 1;
  });

  const byUnitId = new Map();
  const orderedIds = units.map(getUnitId);
  const globalIndexById = new Map(orderedIds.map((id, index) => [id, index]));

  chapters.forEach((chapterEntry, chapterIndex) => {
    const nextChapterFirstId = chapters[chapterIndex + 1]?.firstId ?? null;

    chapterEntry.units.forEach((unit, positionIndex) => {
      const id = getUnitId(unit);
      const globalIndex = globalIndexById.get(id);
      byUnitId.set(id, {
        chapter: chapterEntry.chapter,
        position: positionIndex + 1,
        chapterSize: chapterEntry.units.length,
        previousId: globalIndex > 0 ? orderedIds[globalIndex - 1] : null,
        nextId: globalIndex < orderedIds.length - 1 ? orderedIds[globalIndex + 1] : null,
        checkpointId: chapterEntry.checkpointId,
        nextChapterFirstId,
      });
    });
  });

  return { chapters, byUnitId };
}

export function getLearningPathEntry(learningUnits, unitId) {
  if (!unitId) return null;
  return buildLearningPath(learningUnits).byUnitId.get(unitId) ?? null;
}
