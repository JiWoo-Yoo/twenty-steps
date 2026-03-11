import { useEffect, useState } from "react";
import "./App.css";
import { Doll } from "./components/Doll.jsx";

export const App = () => {
  // Lazy Initializer
  const [step, setStep] = useState(() => {
    // 렌더링 단계 두 번 호출 (strict모드에서 값을 2번 읽음)
    const saved = Number(localStorage.getItem("steps")) || 0;
    return Math.min(saved + 1, 10);
  });

  useEffect(() => {
    // 최종 커밋(값 다 읽고 확정) 직후 단 한 번 호출 (로컬스토리지에 1번 씀)
    localStorage.setItem("steps", step);
  }, [step]);

  const handleReset = () => {
    localStorage.removeItem("steps");
    window.location.reload(); // 간단하게 페이지 새로고침으로 초기화
  };

  const handleNextStep = () => {
    if (step < 10) {
      setStep(step + 1);
    }
  };

  return (
    <div className="app-container">
      {step > 0 && (
        <Doll
          key={step}
          step={step}
          onReset={handleReset}
          onNextStep={handleNextStep}
        />
      )}
    </div>
  );
};
