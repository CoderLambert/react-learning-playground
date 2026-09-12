import { SingleChoiceQuestion } from "./SingleChoiceQuestion.jsx";
import { TrueFalseQuestion } from "./TrueFalseQuestion.jsx";

export function QuestionRenderer(props) {
  const { question } = props;
  if (!question) return null;
  if (question.type === "single_choice") return <SingleChoiceQuestion {...props} />;
  if (question.type === "true_false") return <TrueFalseQuestion {...props} />;
  return <p role="alert">暂不支持此题型：{String(question.type)}</p>;
}

export default QuestionRenderer;
