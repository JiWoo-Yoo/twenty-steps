import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DOLL_IMAGES, COMMON_ASSETS } from '../constants/dollAssets';

// ⭐️ 스텝별 눈알 크기가 다르므로, 이동 반경(radius)을 개별 제어하도록 추가
const PUPIL_POSITIONS = {
    3: { 
      leftEye: { top: '27.7%', left: '40.5%', width: '3%', radius: 2 }, // 작게 움직임
      rightEye: { top: '27.7%', left: '45.5%', width: '3%', radius: 2 }
    },
    4: { 
        leftEye: { top: '41%', left: '58%', width: '3%', radius: 1.5 }, // 작게 움직임
        rightEye: { top: '46%', left: '58%', width: '3%', radius: 1.5 }
      },
      5: { 
        leftEye: { top: '40%', left: '76%', width: '3%', radius: 10 }, // 작게 움직임
        rightEye: { top: '27%', left: '81%', width: '3%', radius: 10 }
      },
      6: { 
        leftEye: { top: '6%', left: '42%', width: '3%', radius: 3 }, // 작게 움직임
        rightEye: { top: '6%', left: '59%', width: '3%', radius: 3 }
      },
      7: { 
        leftEye: { top: '96%', left: '15%', width: '5%', radius: 5 }, // 작게 움직임
        rightEye: { top: '89%', left: '28%', width: '5%', radius: 5 }
      },
      8: { 
        leftEye: { top: '53%', left: '39%', width: '8%', radius: 10 }, // 작게 움직임
        rightEye: { top: '52%', left: '58%', width: '8%', radius: 10 }
      },
  };

// 머리카락 위치 데이터
const HAIR_POSITIONS = {
  3: { top: '10%', left: '40%', width: '20%' },
  9: { top: '5%', left: '45%', width: '30%' },
};

export const Doll = ({ step, onReset }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const pupilConfig = PUPIL_POSITIONS[step];
  const hairConfig = HAIR_POSITIONS[step];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !pupilConfig) return;
      const rect = containerRef.current.getBoundingClientRect();
// 화면 내 마우스 위치를 -1에서 1 사이의 정규화된 방향 벡터로만 추출
const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; 
const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [step, pupilConfig]);

  const baseImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
  };

  // 눈알 렌더링을 위한 공통 함수
  const renderEye = (eyeData, key) => (
    <img 
      key={key}
      src={COMMON_ASSETS.pupil} 
      style={{
        position: 'absolute',
        top: eyeData.top,
        left: eyeData.left,
        width: eyeData.width,
// 정규화된 방향(mousePos) * 개별 설정된 이동 반경(radius)
transform: `translate(calc(-50% + ${mousePos.x * eyeData.radius}px), calc(-50% + ${mousePos.y * eyeData.radius}px))`,
pointerEvents: 'none',
      }} 
      alt={`pupil-${key}`} 
    />
  );

  return (
    <div className={`doll-container step-${step}`} ref={containerRef}>
      
      {/* 1. 인형 몸통 */}
      <img src={DOLL_IMAGES[step - 1]} style={baseImageStyle} alt="body" />

      {/* 2. 눈알 (왼쪽, 오른쪽 각각 렌더링) */}
      {pupilConfig && renderEye(pupilConfig.leftEye, 'left')}
      {pupilConfig && renderEye(pupilConfig.rightEye, 'right')}

      {/* 3. 머리카락 */}
      {hairConfig && (
        <motion.img 
          src={COMMON_ASSETS.hair} 
          style={{
            position: 'absolute',
            top: hairConfig.top,
            left: hairConfig.left,
            width: hairConfig.width,
            cursor: 'grab',
            zIndex: 10,
          }}
          alt="hair"
          drag 
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.4}
          whileDrag={{ cursor: 'grabbing', scale: 1.05 }}
        />
      )}

      {/* 4. 엔딩 */}
      {step === 10 && (
        <div className="ending-overlay">
          <button className="reset-btn" onClick={onReset}>
            처음부터 다시 하기
          </button>
        </div>
      )}
    </div>
  );
};