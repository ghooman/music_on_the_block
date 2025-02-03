import React, { useState,useRef, useEffect } from "react";
import "./Intro.scss";
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
import Main from "../pages/Main";
import '../styles/Main.scss';

//스와이퍼
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
  Thumbs,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

//이미지
import albumImg01 from '../assets/images/intro/intro-demo-img.png';
import albumImg02 from '../assets/images/intro/intro-demo-img2.png';
import albumImg03 from '../assets/images/intro/intro-demo-img3.png';
import audioUrl from '../assets/music/song01.mp3';


// import AudioVisualizer from "./AudioVisualizer";
// import VisualizeAudio from "./VisualizeAudio";

// import { VoiceVisualizer } from 'react-voice-visualizer';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import MusicList from "./MusicList";

const Intro = ({ setIsLoggedIn }) => {
  const audioRef = useRef(null);


  const [mediaRecorder, setMediaRecorder] = useState(true); 



  const [activeIndex, setActiveIndex] = useState(0); // 현재 활성화된 슬라이드 인덱스
  const [animationClass, setAnimationClass] = useState(""); // 애니메이션 클래스 관리

  const timeoutRef = useRef(null); // 타이머 추적용 ref 추가

  const handleSlideChange = (swiper) => {
    setAnimationClass("fade-out"); // 페이드아웃 애니메이션 적용

    // 기존 타이머가 있다면 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (swiper?.realIndex !== undefined) { 
        setActiveIndex(swiper.realIndex); // 현재 슬라이드 인덱스 업데이트
        setAnimationClass("fade-in"); // 페이드인 애니메이션 적용
      }
    }, 800); // 애니메이션 시간과 동일하게 설정
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  // const handleSlideChange = (swiper) => {
  //   setAnimationClass("fade-out"); // 페이드아웃 애니메이션 적용
  
  //   setTimeout(() => {
  //     setActiveIndex(swiper.realIndex); // 현재 슬라이드 인덱스 업데이트
  //     setAnimationClass("fade-in"); // 페이드인 애니메이션 적용
  //   }, 800); // 애니메이션 시간과 동일하게 설정
  // };

  

  
  const items = [
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "13 songs, 2024",
      tabTitle:"AI Singing Evaluation", 
      img:albumImg01,
    },
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "14 songs, 2025",
      tabTitle:"AI Lyric & Songwriting", 
      img:albumImg02,
    },
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "15 songs, 2026",
      tabTitle:"AI Cover Creation", 
      img:albumImg03,
    },
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "13 songs, 2024",
      tabTitle:"AI Singing Evaluation", 
      img:albumImg01,
    },
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "14 songs, 2025",
      tabTitle:"AI Lyric & Songwriting", 
      img:albumImg02,
    },
    { 
      albumTitle: "he dances through his masks like breathing - Yolkhead", 
      artist: "Daft Punk", 
      info: "15 songs, 2026",
      tabTitle:"AI Cover Creation", 
      img:albumImg03,
    },

  ];



  // const handleAudioFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // 오디오 파일을 Blob으로 읽어서 시각화에 사용
  //     const audioBlob = new Blob([file], { type: file.type });
  //     recorderControls.setPreloadedAudioBlob(audioBlob);
  //   }
  // };



  return (
    <>
      <div className="intro">
        <div className="intro__inner">
          <section className="intro__number">
            <dl className="intro__number__title">
              <dt>Number of users</dt>
              <dd>110</dd>
            </dl>
            <dl className="intro__number__title">
              <dt>Number of songs</dt>
              <dd>127</dd>
            </dl>
            <dl className="intro__number__title">
              <dt>Transition</dt>
              <dd>159</dd>
            </dl>
          </section>
          
          <section className="intro__slide-pc">
            <article className="intro__slide-pc__left">
              {/* <div className="intro__slide-pc__left__item">
                <p className="intro__slide-pc__left__img">
                  <img src={albumImg01}/>
                </p>
                <dl className="intro__slide-pc__left__title">
                  <dt>he dances through his masks like breathing - Yolkhead </dt>
                  <dd>
                    Daft Punk
                    <span>– 13 songs, 2013</span>
                  </dd>
                </dl>
                <div className="intro__slide-pc__left__sound">
                  사운드
                </div>
              </div> */}

            {items.map((item, index) => (
              index === activeIndex && (
                <div
                  key={index}
                  className={`intro__slide-pc__left__item ${animationClass}`}
                >
                  <p className="intro__slide-pc__left__img">
                    <img src={item.img} alt={`${item.albumTitle} album cover`} />
                  </p>
                  <dl className="intro__slide-pc__left__title">
                    <dt>{item.albumTitle}</dt>
                    <dd>
                      {item.artist}
                      <span>– {item.info}</span>
                    </dd>
                  </dl>
                  <div className="intro__slide-pc__left__sound">
                    <MusicList />          
                  </div>
                </div>
              )
            ))}

            </article>
            <article className="intro__slide-pc__right">
              <Swiper
                direction={'vertical'}
                slidesPerView={3}
                spaceBetween={16}
                // centeredSlides={true}
                loop={true}
                // pagination={{
                //   clickable: true,
                // }}
                // modules={[Pagination]}

                // autoplay={{
                //   delay: 5000,
                //   disableOnInteraction: false,
                //   pauseOnMouseEnter: true, // 마우스 오버 시 자동 재생 멈춤
                //   enabled: true,
                // }}
                // modules={[Autoplay]}
                onSlideChange={handleSlideChange}
                className="intro-swiper"
                speed={1000}
              >
                {items.map((item, index) => (
                  // <SwiperSlide key={index}>
                  //   <Link to="/dd">{item.tabTitle}</Link>
                  // </SwiperSlide>
                  <SwiperSlide key={item.tabTitle}>
                    <Link to="/dd">{item.tabTitle}</Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
          </section>

          <section className="intro__slide-mobile">
            <button className="intro__slide-mobile__create-btn">CREATE</button>
            <vid className="intro__slide-mobile__tab">
              <Link 
                className="intro__slide-mobile__tab__item active"
                to='/ai'
              >
                AI Lyric & <br />Songwriting
              </Link>
              <Link className="intro__slide-mobile__tab__item">
                AI Cover<br /> Creation
              </Link>
              <Link className="intro__slide-mobile__tab__item">
                AI Singing <br />Evaluation
              </Link>
            </vid>
            <ul className="intro__slide-mobile__tab-list">
              <li className="intro__slide-mobile__tab-list__item">
                <dl className="intro__slide-mobile__tab-list__item__title">
                  <dt>he dances through his masks like breathing - Yolkhead</dt>
                  <dd>
                    Daft Punk
                    <span>– 13 songs, 2024</span>
                  </dd>
                </dl>
                <MusicList /> 
              </li> 
            </ul>
          </section>

          <section className="intro__album">
            <ul className="intro__album__list">
              <li className="intro__album__list__item"><img src={albumImg01}/></li>
              <li className="intro__album__list__item"><img src={albumImg02}/></li>
              <li className="intro__album__list__item"><img src={albumImg03}/></li>
              <li className="intro__album__list__item"><img src={albumImg01}/></li>
              <li className="intro__album__list__item"><img src={albumImg02}/></li>
              <li className="intro__album__list__item"><img src={albumImg03}/></li>
              <li className="intro__album__list__item"><img src={albumImg01}/></li>
              <li className="intro__album__list__item"><img src={albumImg02}/></li>
              <li className="intro__album__list__item"><img src={albumImg03}/></li>
              <li className="intro__album__list__item"><img src={albumImg01}/></li>
              <li className="intro__album__list__item"><img src={albumImg02}/></li>
              <li className="intro__album__list__item"><img src={albumImg03}/></li>
            </ul>
            <Link
              to='/album'
              className="intro__album__btn"
            >ALBUM
            </Link>
          </section>

        </div>
      </div>

      {/* <Routes>
        <Route path="/" element={<Main />} />
      </Routes> */}
    </>
  );
};

export default Intro;
