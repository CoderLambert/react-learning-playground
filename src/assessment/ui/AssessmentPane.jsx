import { useEffect, useRef, useState } from "react";
import { AssessmentPracticePane } from "./AssessmentPracticePane.jsx";
import { AssessmentQuestionManager } from "./AssessmentQuestionManager.jsx";

export function AssessmentPane(props) {
  const [starting, setStarting] = useState(false);
  const startRequestRef = useRef(0);
  const session = props.session ?? null;
  const startError = !session && props.feedback && typeof props.feedback.explanation === "string"
    ? props.feedback.explanation
    : null;

  useEffect(() => {
    startRequestRef.current += 1;
    setStarting(false);
  }, [props.learningUnitId]);

  const handleStart = typeof props.onStart === "function"
    ? async () => {
      if (starting) return;
      const requestId = ++startRequestRef.current;
      setStarting(true);
      try {
        await props.onStart();
      } finally {
        if (requestId === startRequestRef.current) setStarting(false);
      }
    }
    : undefined;

  return (
    <div className="min-w-0">
      <AssessmentQuestionManager
        session={session}
        runtime={props.runtime ?? null}
        learningUnitId={props.learningUnitId ?? null}
      />
      <AssessmentPracticePane
        {...props}
        session={session}
        feedback={session ? props.feedback : null}
        startError={startError}
        starting={starting}
        onStart={handleStart}
      />
    </div>
  );
}

export default AssessmentPane;