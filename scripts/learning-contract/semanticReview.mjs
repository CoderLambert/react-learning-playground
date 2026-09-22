import { createHash } from "node:crypto";

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

function sourceEvidenceProjection(snapshot) {
  return (snapshot.concept?.codeEvidence ?? []).map((evidence) => {
    const ref = evidence.sourceRef;
    const source = snapshot.sourceFiles?.[ref?.fileName];
    const lines = typeof source === "string" ? source.split("\n") : [];
    const excerpt = (
      ref?.kind === "source"
      && Number.isInteger(ref.startLine)
      && Number.isInteger(ref.endLine)
      && ref.startLine >= 1
      && ref.endLine >= ref.startLine
    )
      ? lines.slice(ref.startLine - 1, ref.endLine).join("\n")
      : null;

    return {
      id: evidence.id,
      title: evidence.title,
      explanation: evidence.explanation,
      sourceRef: evidence.sourceRef,
      excerpt,
    };
  });
}

export function createLearningSemanticProjection(snapshot) {
  return {
    learningUnitId: snapshot.learningUnitId,
    flow: snapshot.flow,
    concept: {
      ...snapshot.concept,
      codeEvidence: sourceEvidenceProjection(snapshot),
    },
    guided: snapshot.guided,
    questions: snapshot.questions,
  };
}

export function fingerprintLearningContractSnapshot(snapshot) {
  const projection = stableValue(createLearningSemanticProjection(snapshot));
  return createHash("sha256")
    .update(JSON.stringify(projection))
    .digest("hex");
}
