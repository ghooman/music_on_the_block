import React, { useState, useRef, useEffect } from "react";
import "./IntroLogo.scss";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from "react-router-dom";
// import LogoHansung from "../assets/images/";

//스와이퍼
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
  Thumbs,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

//이미지
import albumImg01 from "../assets/images/intro/intro-demo-img.png";
import albumImg02 from "../assets/images/intro/intro-demo-img2.png";
import albumImg03 from "../assets/images/intro/intro-demo-img3.png";
import audioUrl from "../assets/music/song01.mp3";
import mainLogo from "../assets/images/header/logo.svg";



const IntroLogo = ({ setIsLoggedIn }) => {



  return (
    <>
      <div className="intro-logo">
        <div className="text-box">
          <img src={mainLogo} className="logo" />
          <div className="text-wrap">
            <svg width={300} height={60} viewBox="0 0 300 60">
              <text x="0" y="90%">
                M
              </text>
              <text x="46" y="90%">
                U
              </text>
              <text x="86" y="90%">
                S
              </text>
              <text x="126" y="90%">
                I
              </text>
              <text x="140" y="90%">
                C
              </text>
              <text x="190" y="90%">
                O
              </text>
              <text x="230" y="90%">
                N
              </text>
            </svg>
            <svg width={320} height={60} viewBox="0 0 320 60">
              <text x="0" y="60%">
                T
              </text>
              <text x="36" y="60%">
                H
              </text>
              <text x="76" y="60%">
                E
              </text>
              <text x="126" y="60%">
                B
              </text>
              <text x="166" y="60%">
                L
              </text>
              <text x="206" y="60%">
                O
              </text>
              <text x="246" y="60%">
                C
              </text>
              <text x="286" y="60%">
                K
              </text>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroLogo;
