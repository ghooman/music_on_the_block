// components/IntroLogo3.js
import React, { useState, useEffect } from "react";
import "./IntroLogo3.scss";
import mainLogo from "../assets/images/header/logo.svg";

const IntroLogo3 = ({ setIsLoggedIn }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (isImageLoaded) {
      // 이미지가 로드된 후 일정 시간 딜레이 후 애니메이션 시작
      const timer = setTimeout(() => {
        setStartAnimation(true);
      }, 500); // 필요시 딜레이 시간을 조절하세요.
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);

  return (
    <div className={`intro-logo3 ${startAnimation ? "animate" : ""}`}>
      <img
        src={mainLogo}
        alt="main logo"
        onLoad={() => setIsImageLoaded(true)}
      />
    </div>
  );
};

export default IntroLogo3;
