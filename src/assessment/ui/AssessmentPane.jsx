import { useAssessmentReview } from "../application/useAssessmentReview.js";
import { AssessmentPracticePane } from "./AssessmentPracticePane.jsx";
import { AssessmentQuestionManager } from "./AssessmentQuestionManager.jsx";
import { AssessmentReviewPanel } from "./AssessmentReviewPanel.jsx";

export function AssessmentPane(props) {
  const session = props.session ?? null;
  const questions = props.questions ?? [];
  const learningUnitId = session?.learningUnitId ?? questions[0]?.learningUnitId ?? null;
  const completedSessionId = session?.status === "completed" ? session.id : null;
  const review = useAssessmentReview({ learningUnitId, activeSessionId: completedSessionId });

  return (
    <div className="min-w-0">
      <AssessmentQuestionManager
        session={session}
        questions={questions}
        commands={props.managementCommands ?? null}
      />
      <AssessmentPracticePane
        {...props}
        session={session}
        feedback={session ? props.feedback : null}
        startError={session ? null : props.startError}
        starting={Boolean(props.starting)}
        onStart={props.onStart}
      />
      <AssessmentReviewPanel
        history={review.history}
        review={review.review}
        loading={review.loading}
        error={review.error}
        storageNotice={review.storageNotice}
        onSelectSession={review.selectSession}
        onOpenEvidence={props.onOpenEvidence}
      />
    </div>
  );
}

export default AssessmentPane;
