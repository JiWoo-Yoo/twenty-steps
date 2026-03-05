import { useEffect, useState } from 'react'
import './App.css'
import {Doll} from './components/Doll.jsx'

export const App = () => {
  // Lazy Initializer
  const [step] = useState(() => { // 렌더링 단계 두 번 호출 (strict모드에서 값을 2번 읽음)
    const saved = Number(localStorage.getItem('steps')) || 0;
    return Math.min(saved + 1, 20);
  });

  useEffect(() => { // 최종 커밋(값 다 읽고 확정) 직후 단 한 번 호출 (로컬스토리지에 1번 씀)
    localStorage.setItem('steps', step);
  }, [step]);

  const getBgColor = () => {
    if (step === 4 || step === 14) return 'red';
    if (step === 8 || step === 19) return 'black';
    return 'white';
  }

  return (
    <div className="app-container"
    style={{ 
      backgroundColor: getBgColor(), 
    }}>
     {step > 0 && <Doll key={step} step={step} />}
    </div>
  )
}
