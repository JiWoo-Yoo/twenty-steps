import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate, useAnimation } from "framer-motion";
import { DOLL_IMAGES, COMMON_ASSETS } from "../constants/dollAssets";

// ⭐️ 스텝별 눈알 크기가 다르므로, 이동 반경(radius)을 개별 제어하도록 추가
const PUPIL_POSITIONS = {
  3: {
    leftEye: { top: "27.7%", left: "40.5%", width: "3%", radius: 2 }, // 작게 움직임
    rightEye: { top: "27.7%", left: "45.5%", width: "3%", radius: 2 },
  },
  4: {
    leftEye: { top: "41%", left: "58%", width: "3%", radius: 1.5 }, // 작게 움직임
    rightEye: { top: "46%", left: "58%", width: "3%", radius: 1.5 },
  },
  5: {
    leftEye: { top: "40%", left: "76%", width: "3%", radius: 10 }, // 작게 움직임
    rightEye: { top: "27%", left: "81%", width: "3%", radius: 10 },
  },
  6: {
    leftEye: { top: "6%", left: "42%", width: "3%", radius: 3 }, // 작게 움직임
    rightEye: { top: "6%", left: "59%", width: "3%", radius: 3 },
  },
  7: {
    leftEye: { top: "96%", left: "15%", width: "5%", radius: 5 }, // 작게 움직임
    rightEye: { top: "89%", left: "28%", width: "5%", radius: 5 },
  },
  8: {
    leftEye: { top: "53%", left: "39%", width: "8%", radius: 10 }, // 작게 움직임
    rightEye: { top: "52%", left: "58%", width: "8%", radius: 10 },
  },
};

// baseRotation: 대각선 이미지를 세로로 축 늘어지게 세워두는 초기 각도
const HAIR_POSITIONS = {
  3: {
    top: "22%",
    left: "31%",
    width: "10%",
    pivot: "90% 20%",
    baseRotation: -40,
  },
  5: {
    top: "19%",
    left: "36%",
    width: "30%",
    pivot: "90% 20%",
    baseRotation: -80,
  },
};

export const Doll = ({ step, onReset, onNextStep }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // ⭐️  6단계 클릭 횟수를 추적하는 상태 추가
  const [clickCount, setClickCount] = useState(0);

  // ⭐️  클릭 타격감(움찔거림)을 제어할 애니메이션 컨트롤러
  const bodyControls = useAnimation();

  const pupilConfig = PUPIL_POSITIONS[step];
  const hairConfig = HAIR_POSITIONS[step];

  // MotionValue 초기화 (스텝 진입 시 0이 아니라 기본 각도로 시작)
  const rotateValue = useMotionValue(hairConfig ? hairConfig.baseRotation : 0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !pupilConfig) return;
      const rect = containerRef.current.getBoundingClientRect();
      // 화면 내 마우스 위치를 -1에서 1 사이의 정규화된 방향 벡터로만 추출
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    if (hairConfig) {
      rotateValue.set(hairConfig.baseRotation);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [step, pupilConfig, rotateValue, hairConfig]);

  const baseImageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  };

  // 눈알 렌더링을 위한 공통 함수
  const renderEye = (eyeData, key) => (
    <img
      key={key}
      src={COMMON_ASSETS.pupil}
      style={{
        position: "absolute",
        top: eyeData.top,
        left: eyeData.left,
        width: eyeData.width,
        // 정규화된 방향(mousePos) * 개별 설정된 이동 반경(radius)
        transform: `translate(calc(-50% + ${mousePos.x * eyeData.radius}px), calc(-50% + ${mousePos.y * eyeData.radius}px))`,
        pointerEvents: "none",
      }}
      alt={`pupil-${key}`}
    />
  );

  // ⭐️ 인형 클릭 핸들러
  const handleBodyClick = async () => {
    // 6단계가 아니면 클릭 무시
    if (step !== 6) return;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // 클릭할 때마다 살짝 흔들리는 타격감 애니메이션
    await bodyControls.start({
      x: [0, -5, 5, -5, 5, 0], // 좌우로 흔들림
      transition: { duration: 0.2 },
    });

    // 4번 클릭을 채웠을 때
    if (nextCount >= 4) {
      // 상태 초기화
      setClickCount(0);

      // 부모 컴포넌트에 다음 스텝으로 넘어가라고 알림 (화면 리렌더링)
      if (onNextStep) onNextStep();
    }
  };

  return (
    <div className={`doll-container step-${step}`} ref={containerRef}>
      {/* 1. 인형 몸통 */}
      <motion.img
        src={DOLL_IMAGES[step - 1]}
        style={{
          ...baseImageStyle,
          // 6단계일 때만 마우스 커서를 포인터로 변경해서 누를 수 있다는 걸 암시
          cursor: step === 6 ? "pointer" : "default",
          // 클릭 이벤트를 받아야 하므로 pointerEvents: 'none' 무효화
          pointerEvents: step === 6 ? "auto" : "none",
        }}
        alt="body"
        onClick={handleBodyClick}
        animate={bodyControls} // 움찔거리는 애니메이션 연결
      />

      {/* 2. 눈알 (왼쪽, 오른쪽 각각 렌더링) */}
      {pupilConfig && renderEye(pupilConfig.leftEye, "left")}
      {pupilConfig && renderEye(pupilConfig.rightEye, "right")}

      {/* 3. 머리카락 */}
      {hairConfig && (
        <motion.img
          key={`hair-${step}`}
          src={COMMON_ASSETS.hair}
          draggable={false}
          style={{
            position: "absolute",
            top: hairConfig.top,
            left: hairConfig.left,
            width: hairConfig.width,

            // 1. 축을 이미지 우측 상단(뿌리)에 정확히 박아넣음
            transformOrigin: hairConfig.pivot,

            rotate: rotateValue,
            cursor: "grab",
            zIndex: 10,
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
          alt={`hair-step-${step}`}
          onPan={(e, info) => {
            // 2. 당기는 방향 연산: 오른쪽 당기면(-), 왼쪽 당기면(+)
            let nextRotate = hairConfig.baseRotation - info.offset.x * 0.4;

            // 3. 머리카락이 꺾이는 한계치 설정 (세로 상태 기준 좌우 50도까지만)
            const min = hairConfig.baseRotation - 50;
            const max = hairConfig.baseRotation + 50;
            rotateValue.set(Math.max(min, Math.min(max, nextRotate)));
          }}
          onPanEnd={() => {
            // 4. 손을 놓으면 0도가 아니라, 다시 세로 상태(baseRotation)로 찰랑이며 복귀
            animate(rotateValue, hairConfig.baseRotation, {
              type: "spring",
              stiffness: 250,
              damping: 12,
            });
          }}
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
