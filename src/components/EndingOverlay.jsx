import { useState } from "react";
import { motion as Motion } from "framer-motion";

export const EndingOverlay = ({ onReset }) => {
  const [particles] = useState(() =>
    [...Array(50)].map((_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
      // ⭐️ 색상은 아주 연한 우유빛 핑크로 유지
      color: i % 2 === 0 ? "#FFD1DC" : "#FFF0F5",
    })),
  );

  const sentence = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // 인형이 더 잘 보이도록 배경 투명도 최적화
        background:
          "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(1.5px)",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <Motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.initialX}vw`, y: "-10vh" }}
          animate={{
            opacity: [0, 1, 1, 0], // 중간에 머무는 시간을 늘림
            y: "110vh",
            x: [
              `${p.initialX}vw`,
              `${p.initialX + 10}vw`,
              `${p.initialX - 10}vw`,
            ],
            rotate: p.rotate + 1080,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "14px",
            height: "16px", // 크기를 살짝 키워 시인성 확보
            backgroundColor: p.color,
            borderRadius: "50% 0 50% 0",
            // ⭐️ 핵심: 이중 필터 (어두운 그림자로 형태를 잡고, 밝은 글로우로 화사함 추가)
            filter:
              "drop-shadow(0 0 1px rgba(0,0,0,0.3)) drop-shadow(0 0 3px rgba(255,255,255,0.8))",
            zIndex: 1,
          }}
        />
      ))}

      <Motion.h1
        variants={sentence}
        initial="hidden"
        animate="visible"
        style={{
          color: "white",
          fontSize: "4.5rem",
          fontWeight: "800",
          // 글자 테두리를 더 선명하게
          textShadow:
            "2px 2px 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 182, 193, 0.6)",
          marginBottom: "0.2rem",
          zIndex: 10,
        }}
      >
        {"Thank You".split("").map((char, index) => (
          <Motion.span key={index} variants={letter}>
            {char}
          </Motion.span>
        ))}
      </Motion.h1>

      <Motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2 }}
        style={{
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "500",
          letterSpacing: "0.15rem",
          textShadow: "1px 1px 8px rgba(0, 0, 0, 1)", // 작은 글씨 가독성 극대화
          marginBottom: "3rem",
          zIndex: 10,
        }}
      >
        For your unwavering attention
      </Motion.p>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 4, duration: 1.5 }}
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          color: "white",
          fontSize: "1rem",
          letterSpacing: "0.2rem",
          fontStyle: "italic",
          textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
          zIndex: 10,
        }}
      >
        presented by Yoo
      </Motion.div>

      <Motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        onClick={onReset}
        style={{
          padding: "12px 35px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          cursor: "pointer",
          borderRadius: "25px",
          zIndex: 10,
          fontWeight: "bold",
        }}
      >
        처음부터 다시 하기
      </Motion.button>
    </Motion.div>
  );
};
