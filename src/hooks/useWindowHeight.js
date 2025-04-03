import { useState, useEffect } from 'react';

const useWindowHeight = (targetHeight = 550) => {
  const [isBelowHeight, setIsBelowHeight] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsBelowHeight(window.innerHeight <= targetHeight);
    };

    // 초기 상태 설정
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [targetHeight]);

  return isBelowHeight;
};

export default useWindowHeight; 