const BASE = {
  learningUnitId: "fixture-lesson",
  flow: {
    learningUnitId: "fixture-lesson",
    version: 1,
    objective: "Explain one deterministic React mechanism and transfer it to unfamiliar code.",
    coreModelTitle: "Input → mechanism → output",
    mentalModel: "The same core mechanism explains the Demo and the transfer task.",
    misconceptionTitle: "Do not confuse the input with the resulting behavior",
    misconception: "The wrong model skips the mechanism.",
    decisionRuleTitle: "Trace the mechanism before choosing",
    decisionRule: "Use the mechanism rather than memorizing the Demo output.",
    practiceTitle: "Apply the model",
    practiceDescription: "Repair unfamiliar code with the same mechanism.",
    verifyTitle: "Verify transfer",
    verifyDescription: "Use unfamiliar code and diagnostic alternatives.",
    aiReviewTarget: "Only review the fixture lesson core mechanism.",
    stageHints: {
      understand: "Understand the mechanism.",
      practice: "Apply it to unfamiliar code.",
      verify: "Verify the transfer.",
    },
  },
  concept: {
    learningUnitId: "fixture-lesson",
    version: 1,
    mechanismMap: [
      {
        id: "input",
        label: "Input",
        example: "value",
        role: "Feeds the mechanism",
        change: "Produces the next behavior",
      },
    ],
    contrastCases: [
      {
        id: "correct-model",
        title: "Mechanism first",
        conclusion: "Trace the mechanism instead of memorizing output.",
      },
    ],
    codeEvidence: [
      {
        id: "evidence-one",
        title: "First source-backed mechanism",
        explanation: "This line shows the input boundary.",
        sourceRef: { kind: "source", fileName: "FixtureDemo.jsx", startLine: 1, endLine: 2 },
      },
      {
        id: "evidence-two",
        title: "Second source-backed mechanism",
        explanation: "This line shows the resulting behavior.",
        sourceRef: { kind: "source", fileName: "FixtureDemo.jsx", startLine: 3, endLine: 4 },
      },
    ],
    misconceptions: {
      "skips-mechanism": {
        id: "skips-mechanism",
        title: "Skips the mechanism",
        diagnosis: "The answer jumps from input directly to an unsupported result.",
        counterEvidence: "The source evidence exposes the missing intermediate step.",
        experiment: "Change the input and trace the intermediate step again.",
      },
    },
  },
  guided: {
    learningUnitId: "fixture-lesson",
    revision: 1,
    goal: "Apply the mechanism to unfamiliar code.",
    steps: [
      {
        id: "predict-answer",
        type: "predict",
        prompt: "What happens first?",
        response: {
          kind: "choice",
          options: [
            { id: "predict-correct", label: "Trace the mechanism" },
            { id: "predict-wrong", label: "Guess the output" },
          ],
        },
        reveal: {
          expectedOptionId: "predict-correct",
          observation: "The mechanism determines the result.",
        },
      },
      {
        id: "experiment-demo",
        type: "experiment",
        prompt: "Run the Demo.",
        demoActionId: "run-fixture-demo",
        expectedObservation: "The observable result follows the mechanism.",
      },
      {
        id: "explain-model",
        type: "explain",
        prompt: "Explain the mechanism.",
        response: { kind: "text", placeholder: "Explain..." },
      },
      {
        id: "practice-transfer",
        type: "practice",
        prompt: "Choose the minimal repair.",
        codeContext: {
          label: "FixtureTransfer.jsx",
          language: "jsx",
          code: "function FixtureTransfer() { return null; }",
        },
        response: {
          kind: "patch-choice",
          options: [
            { id: "patch-correct", label: "Patch A", patch: "- wrong\n+ correct" },
            { id: "patch-wrong", label: "Patch B", patch: "- wrong\n+ stillWrong" },
          ],
        },
        reveal: {
          expectedOptionId: "patch-correct",
          observation: "The correct patch preserves the mechanism.",
        },
      },
      {
        id: "review-evidence",
        type: "review",
        prompt: "Review the evidence.",
        resources: ["notes", "source", "demo"],
      },
    ],
  },
  questions: [
    {
      id: "fixture-q1",
      learningUnitId: "fixture-lesson",
      revision: 1,
      content: {
        prompt: "Which answer follows the mechanism?",
        options: [
          { id: "correct", text: "Trace it" },
          { id: "wrong", text: "Skip it" },
        ],
        correctOptionId: "correct",
        diagnosticOptionMap: { wrong: "skips-mechanism" },
        codeContext: {
          label: "Unknown.jsx",
          language: "jsx",
          code: "function Unknown() { return null; }",
        },
      },
    },
    {
      id: "fixture-q2",
      learningUnitId: "fixture-lesson",
      revision: 1,
      content: {
        prompt: "Question two",
        options: [
          { id: "correct", text: "Correct" },
          { id: "wrong", text: "Wrong" },
        ],
        correctOptionId: "correct",
      },
    },
    {
      id: "fixture-q3",
      learningUnitId: "fixture-lesson",
      revision: 1,
      content: {
        prompt: "Question three",
        options: [
          { id: "correct", text: "Correct" },
          { id: "wrong", text: "Wrong" },
        ],
        correctOptionId: "correct",
      },
    },
    {
      id: "fixture-q4",
      learningUnitId: "fixture-lesson",
      revision: 1,
      content: {
        prompt: "Question four",
        options: [
          { id: "correct", text: "Correct" },
          { id: "wrong", text: "Wrong" },
        ],
        correctOptionId: "correct",
      },
    },
    {
      id: "fixture-q5",
      learningUnitId: "fixture-lesson",
      revision: 1,
      content: {
        prompt: "Question five",
        options: [
          { id: "correct", text: "Correct" },
          { id: "wrong", text: "Wrong" },
        ],
        correctOptionId: "correct",
      },
    },
  ],
  sourceFiles: {
    "FixtureDemo.jsx": [
      "const input = value;",
      "const intermediate = transform(input);",
      "const output = finish(intermediate);",
      "return output;",
      "",
    ].join("\n"),
  },
};

export function createGoldenLearningContractFixture() {
  return structuredClone(BASE);
}

export function createInvalidLearningContractFixture(kind) {
  const fixture = createGoldenLearningContractFixture();

  if (kind === "identity") {
    fixture.guided.learningUnitId = "other-lesson";
  } else if (kind === "source-range") {
    fixture.concept.codeEvidence[0].sourceRef.endLine = 99;
  } else if (kind === "practice") {
    fixture.guided.steps[3].reveal.expectedOptionId = "missing-option";
  } else if (kind === "verify-misconception") {
    fixture.questions[0].content.diagnosticOptionMap.wrong = "unknown-misconception";
  } else if (kind === "optional-contrast") {
    fixture.concept.contrastCases = [];
  } else {
    throw new Error("Unknown invalid fixture kind: " + kind);
  }

  return fixture;
}
