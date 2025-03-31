import React, { useState, useRef, useEffect } from "react";
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
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";
import track3 from "../assets/music/MusicOnTheBlock_v1.mp3";
// import AudioVisualizer from "./AudioVisualizer";
// import VisualizeAudio from "./VisualizeAudio";

// import { VoiceVisualizer } from 'react-voice-visualizer';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import MusicList from "./MusicList";
import IntroLogo from "./IntroLogo";
import PreparingModal from "./PreparingModal";

const Intro = ({ setIsLoggedIn }) => {
  const audioRef = useRef(null);

  const [mediaRecorder, setMediaRecorder] = useState(true);
  const [isPreparingModal, setPreparingModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2); // id가 3인 아이템부터 시작
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
      id: 1,
      albumTitle: "1Music on the Block",
      artist: "Nakil Kim",
      info: "13 songs, 2025",
      tabTitle: "AI Singing Evaluation",
      img: albumImg01,
    },
    {
      id: 2,
      albumTitle: "Music on the Block",
      artist: "Nakil Kim",
      info: "14 songs, 2025",
      tabTitle: "AI Lyric & Songwriting",
      img: albumImg02,
    },
    {
      id: 3,
      albumTitle: "Music on the Block",
      artist: "Nakil Kim3",
      info: "15 songs, 2026",
      tabTitle: "AI Cover Creation",
      img: albumImg03,
    },
    {
      id: 4,
      albumTitle: "Music on the Block",
      artist: "Nakil Kim",
      info: "13 songs, 2024",
      tabTitle: "AI Singing Evaluation",
      img: albumImg01,
    },
    {
      id: 5,
      albumTitle: "Music on the Block",
      artist: "Nakil Kim",
      info: "14 songs, 2025",
      tabTitle: "AI Lyric & Songwriting",
      img: albumImg02,
    },
    {
      id: 6,
      albumTitle: "Music on the Block",
      artist: "Nakil Kim",
      info: "15 songs, 2026",
      tabTitle: "AI Cover Creation",
      img: albumImg03,
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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2350); // 2.4초 후 실행

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <>
      <IntroLogo />
      {isVisible && (
        <div className="intro">
          <div className="intro__inner">
            <section className="intro__number">
              <dl className="intro__number__title">
                <dt>Number of users</dt>
                <dd>
                  <Counter targetNumber={110} />
                </dd>
              </dl>
              <dl className="intro__number__title">
                <dt>Number of songs</dt>
                <dd>
                  <Counter targetNumber={127} />
                </dd>
              </dl>
              <dl className="intro__number__title">
                <dt>Transition</dt>
                <dd>
                  <Counter targetNumber={159} />
                </dd>
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

                {items.map(
                  (item, index) =>
                    index === activeIndex && (
                      <div
                        key={index}
                        className={`intro__slide-pc__left__item ${animationClass}`}
                      >
                        <p className="intro__slide-pc__left__img">
                          <img
                            src={item.img}
                            alt={`${item.albumTitle} album cover`}
                          />
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
                )}
              </article>
              <article className="intro__slide-pc__right">
                <Swiper
                  direction={"vertical"}
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
                    <SwiperSlide key={item.tabTitle}>
                      <Link
                        // to="/create"
                        to={
                          item.tabTitle === "AI Lyric & Songwriting"
                            ? "/create"
                            : "#"
                        }
                        onClick={(e) => {
                          if (item.tabTitle !== "AI Lyric & Songwriting") {
                            e.preventDefault(); // 기본 링크 이동 막기
                            setPreparingModal(true); // 프리페어링 모달 열기
                          }
                        }}
                      >
                        {item.tabTitle}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </article>
            </section>

            <section className="intro__slide-mobile">
              <Link to="/create" className="intro__slide-mobile__create-btn">
                CREATE
              </Link>
              <div className="intro__slide-mobile__tab">
                <Link className="intro__slide-mobile__tab__item active">
                  AI Lyric & <br />
                  Songwriting
                </Link>
                <Link
                  className="intro__slide-mobile__tab__item"
                  onClick={() => setPreparingModal(true)}
                >
                  AI Cover
                  <br /> Creation
                </Link>
                <Link
                  className="intro__slide-mobile__tab__item"
                  onClick={() => setPreparingModal(true)}
                >
                  AI Singing <br />
                  Evaluation
                </Link>
              </div>
              <ul className="intro__slide-mobile__tab-list">
                <li className="intro__slide-mobile__tab-list__item">
                  <dl className="intro__slide-mobile__tab-list__item__title">
                    <dt>
                      he dances through his masks like breathing - Yolkhead
                    </dt>
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
                <li className="intro__album__list__item">
                  <img src={albumImg01} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg02} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg03} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg01} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg02} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg03} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg01} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg02} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg03} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg01} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg02} />
                </li>
                <li className="intro__album__list__item">
                  <img src={albumImg03} />
                </li>
              </ul>
              <Link to="/album" className="intro__album__btn">
                ALBUM
              </Link>
            </section>
          </div>
        </div>
      )}
      {isPreparingModal && (
        <PreparingModal setPreparingModal={setPreparingModal} />
      )}
    </>
  );
};

export default Intro;

const Counter = ({ targetNumber }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 애니메이션 지속 시간 (2초)
    const interval = 10; // 업데이트 간격 (20ms)
    const step = targetNumber / (duration / interval);

    const timer = setInterval(() => {
      start += step;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return <>{count.toLocaleString()}</>;
};
