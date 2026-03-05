import React, { useState } from 'react';

export const Doll = ({ step }) => {
  const [dollData] = useState(() => {
    // 20단계: 해방 (정면 거대 상자)
    if (step === 20) {
      return {
        style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(4)' },
        pose: 'pose-center'
      };
    }

    const side = Math.floor(Math.random() * 4);
    const randomPos = Math.random() * 80 + 10;
    const intrusion = (step / 19) * 45; 
    const scale = 0.6 + (step * 0.1); 

    let style = { position: 'absolute' };
    let transform = '';
    let pose = '';

    switch (side) {
      case 0: // 상단 벽 -> 아래로 빼꼼 (노란색 상자)
        style.top = `${-10 + intrusion}%`;
        style.left = `${randomPos}%`;
        transform = 'translate(-50%, 0)';
        pose = 'pose-top';
        break;
      case 1: // 하단 벽 -> 위로 빼꼼 (초록색 상자)
        style.bottom = `${-10 + intrusion}%`;
        style.left = `${randomPos}%`;
        transform = 'translate(-50%, 0)';
        pose = 'pose-bottom';
        break;
      case 2: // 왼쪽 벽 -> 오른쪽으로 빼꼼 (파란색 상자)
        style.left = `${-10 + intrusion}%`;
        style.top = `${randomPos}%`;
        transform = 'translate(0, -50%)';
        pose = 'pose-left';
        break;
      case 3: // 오른쪽 벽 -> 왼쪽으로 빼꼼 (보라색 상자)
        style.right = `${-10 + intrusion}%`;
        style.top = `${randomPos}%`;
        transform = 'translate(0, -50%)';
        pose = 'pose-right';
        break;
    }

    return { 
      style: { ...style, transform: `${transform} scale(${scale})` },
      pose 
    };
  });

  return (
    <div 
      className={`doll ${dollData.pose}`} // 클래스에 따라 배경이미지/색상 변경
      style={{
        ...dollData.style,
        width: '120px',
        height: '180px',
        // 이미지가 생기면 여기에 URL 넣기
        '--doll-image': 'none', // 'url(/images/doll.png)' 로 변경하면 이미지 적용됨
      }}
    >
      {/* 개발용 디버깅: 포즈 확인용 문구 */}
      <span style={{ fontSize: '10px', color: 'white' }}>{dollData.pose}</span>
    </div>
  );
};