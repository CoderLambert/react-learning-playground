export function SingleChoiceQuestion({ question, value = "", onChange, disabled = false }) {
  return (
    <fieldset disabled={disabled} aria-describedby={`${question.id}-explanation`}>
      <legend>{question.content.prompt}</legend>
      {question.content.options.map((option) => (
        <label key={option.id}>
          <input
            type="radio"
            name={`assessment-${question.id}`}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange?.(option.id)}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default SingleChoiceQuestion;
