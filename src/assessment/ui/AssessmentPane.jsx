import { AssessmentPracticePane } from "./AssessmentPracticePane.jsx";
import { AssessmentQuestionManager } from "./AssessmentQuestionManager.jsx";

export function AssessmentPane(props) {
  return (
    <div className="min-w-0">
      <AssessmentQuestionManager session={props.session ?? null} />
      <AssessmentPracticePane {...props} />
    </div>
  );
}

export default AssessmentPane;
