import { useState } from "react";

export function TestQueue() {
  const [step, setStep] = useState(0);

  function handleBatch() {
    setStep((prev) => prev + 1);
    setStep(42);
    setStep((prev) => prev + 1);
  }

  return <button onClick={handleBatch}>点击测试：{step}</button>;
}
