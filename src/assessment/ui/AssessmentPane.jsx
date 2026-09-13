import { AssessmentPracticePane } from "./AssessmentPracticePane.jsx";
import { AssessmentQuestionManager } from "./AssessmentQuestionManager.jsx";

export function AssessmentPane(props) {
  const session = props.session ?? null;

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
        startError={session ? null : props.startError}
        starting={Boolean(props.starting)}
        onStart={props.onStart}
      />
    </div>
  );
}

export default AssessmentPane;
