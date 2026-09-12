const OPTIONS = Object.freeze([
  { value: true, label: "正确" },
  { value: false, label: "错误" },
]);

export function TrueFalseQuestion({ question, value = null, onChange, disabled = false }) {
  return (
    <fieldset disabled={disabled} aria-describedby={`${question.id}-explanation`}>
      <legend>{question.content.prompt}</legend>
      {OPTIONS.map((option) => (
        <label key={String(option.value)}>
          <input
            type="radio"
            name={`assessment-${question.id}`}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default TrueFalseQuestion;
