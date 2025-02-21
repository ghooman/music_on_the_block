import "../styles/Album.scss";
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from 'react-router-dom';
import MyAudioPlayer from '../components/MyAudioPlayer';
import coverImg from '../assets/images/intro/intro-demo-img.png';
import coverImg2 from '../assets/images/intro/intro-demo-img2.png';
import coverImg3 from '../assets/images/intro/intro-demo-img3.png';
import coverImg4 from '../assets/images/demo/album01.svg';
import coverImg5 from '../assets/images/demo/album02.svg';
import coverImg6 from '../assets/images/demo/album03.svg';
import coverImg7 from '../assets/images/demo/album04.svg';
import coverImg8 from '../assets/images/demo/album05.svg';
import coverImg9 from '../assets/images/demo/album06.svg';
import loveIcon from '../assets/images/album/love-icon.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";
import track3 from "../assets/music/MusicOnTheBlock_v1.mp3";


//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';


function Album() {

  const [activeTab, setActiveTab] = useState("AI Lyric & Songwriting");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 88) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //노래플레이 자스
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: 'he dances through his masks like breathing - Yolkhead',
      src: track1,
      cover: coverImg,
      duration: null,
    },
    {
      id: 2,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg2,
      duration: null,
    },
    {
      id: 3,
      title: 'Touch The Sky - Simon Doty',
      src: track2,
      cover: coverImg3,
      duration: null,
    },
    {
      id: 4,
      title: 'Touch The Sky - Simon Doty',
      src: track1,
      cover: coverImg4,
      duration: null,
    },
    {
      id: 5,
      title: 'he dances through his masks like breathing - Yolkhead',
      src: track2,
      cover: coverImg5,
      duration: null,
    },
    {
      id: 6,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg6,
      duration: null,
    },
    {
      id: 7,
      title: 'Touch The Sky - Simon Doty',
      src: track1,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 8,
      title: 'Touch The Sky - Simon Doty',
      src: track2,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 9,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg9,
      duration: null,
    },

    {
      id: 10,
      title: 'he dances through his masks like breathing - Yolkhead',
      src: track1,
      cover: coverImg9,
      duration: null,
    },
    {
      id: 11,
      title: 'Touch The Sky - Simon Doty',
      src: track2,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 12,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 13,
      title: 'Touch The Sky - Simon Doty',
      src: track1,
      cover: coverImg4,
      duration: null,
    },
    {
      id: 14,
      title: 'he dances through his masks like breathing - Yolkhead',
      src: track2,
      cover: coverImg5,
      duration: null,
    },
    {
      id: 15,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg6,
      duration: null,
    },
    {
      id: 16,
      title: 'Touch The Sky - Simon Doty',
      src: track2,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 17,
      title: 'Touch The Sky - Simon Doty',
      src: track1,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 18,
      title: 'Touch The Sky - Simon Doty',
      src: track3,
      cover: coverImg9,
      duration: null,
    },
  ]);

  useEffect(() => {
    const updatedTracks = [...tracks];
    updatedTracks.forEach((track, index) => {
      const audio = new Audio(track.src);
      audio.addEventListener('loadedmetadata', () => {
        updatedTracks[index].duration = audio.duration;
        setTracks([...updatedTracks]);
      });
    });
  }, []);

  const handleTrackClick = (index) => {
    setSelectedTrackIndex(index);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleClickPrevious = () => {
    if (selectedTrackIndex !== null) {
      const prevIndex = selectedTrackIndex === 0 ? tracks.length - 1 : selectedTrackIndex - 1;
      setSelectedTrackIndex(prevIndex);
    }
  };

  const handleClickNext = () => {
    if (selectedTrackIndex !== null) {
      const nextIndex = selectedTrackIndex === tracks.length - 1 ? 0 : selectedTrackIndex + 1;
      setSelectedTrackIndex(nextIndex);
    }
  };

  

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 선택된 트랙의 정보 또는 기본 정보를 설정
  const selectedTrack = selectedTrackIndex !== null ? tracks[selectedTrackIndex] : null;
  const albumTitle = selectedTrack ? selectedTrack.title : 'Select an Album';
  const albumCover = selectedTrack ? selectedTrack.cover : defaultCoverImg;




  //스와이프
  const swiperRef = useRef(null);
  const handleSlideChange = (swiper) => {
    const slides = swiper.slides;
    const activeIndex = swiper.activeIndex;
    const totalSlides = slides.length;

    slides.forEach((slide, index) => {
      // 모든 슬라이드에서 이전 커스텀 클래스 제거
      slide.classList.remove("swiper-slide-next-next", "swiper-slide-prev-prev");

      // 다음-다음 슬라이드
      if (index === (activeIndex + 2) % totalSlides) {
        slide.classList.add("swiper-slide-next-next");
      }

      // 이전-이전 슬라이드
      if (index === (activeIndex - 2 + totalSlides) % totalSlides) {
        slide.classList.add("swiper-slide-prev-prev");
      }
    });
  };

  
  return (
    <div className="album">
        <div 
          className={`album__header 
            ${selectedTrackIndex !== null ? 'active' : ''} 
            ${isScrolled ? 'scrolled' : ''}`
          }
        >
        <div className="album__header__album-cover">
          <p
            className="album__header__album-cover__img"
            style={{ backgroundImage: `url(${albumCover})` }}
          >
          </p>
          <p className="album__header__title">
            {albumTitle}
          </p>
        </div>
        <div className="album__header__cover-info">
          <div className="album__header__cover-info__love-play">
            <p className="love"><img src={loveIcon}/>145</p>
            <p className="play"><img src={playIcon}/>145</p>
            <p>|</p>
            <p className="name">Yolkhead</p>
          </div>
          <Link 
            className='album__header__cover-info__btn'
            to='/album-detail'
          >See More</Link>
        </div>
        <MyAudioPlayer
          track={selectedTrack}
          onTimeUpdate={handleTimeUpdate}
          onClickPrevious={handleClickPrevious}
          onClickNext={handleClickNext}
        />
      </div>

      <section className="album__content-list">
        <p className="album__content-list__title">Total</p>
        <article className="album__content-list__list">
          {tracks.slice(0, 9).map((track, index) => (
            <button
              key={track.id}
              className={`album__content-list__list__item ${selectedTrackIndex === index ? 'active' : ''}`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="album__content-list__list__item__left">
                <p
                  className="album__content-list__list__item__left__img"
                  style={{ backgroundImage: `url(${track.cover})` }}
                >
                </p>
                <span className="time">
                  {selectedTrackIndex === index
                    ? `${formatTime(currentTime)}`
                    : formatTime(track.duration)}
                </span>
                {/* <span className="time">
                  {selectedTrackIndex === index
                    ? `${formatTime(currentTime)} / ${formatTime(track.duration)}`
                    : formatTime(track.duration)}
                </span> */}
              </div>
              <div className="album__content-list__list__item__right">
                <p className="album__content-list__list__item__right__title">
                  {track.title}
                </p>
                <div className="album__content-list__list__item__right__love-play">
                  <p className="love"><img src={loveIcon}/>145</p>
                  <p className="play"><img src={playIcon}/>145</p>
                </div>
                <div className="album__content-list__list__item__right__user">
                  <p className="album__content-list__list__item__right__user__info">
                    <img src={defaultCoverImg}/>Yolkhead
                  </p>
                  <button className="album__content-list__list__item__right__user__btn">
                    유저정보
                  </button>
                </div>
              </div>
            </button>
          ))}
        </article>
        <Link 
          className="album__content-list__see-more-btn"
          to=''
        >See More
        </Link>
      </section>

      <section className="album__slide">
        <p className="album__slide__title">Hit Music List</p>
        <Swiper
          ref={swiperRef}
          loop={true}
          slidesPerView={5}
          centeredSlides={true}
          spaceBetween={0}
          initialSlide={2}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="swiper-music-list"
          onSlideChange={(swiper) => handleSlideChange(swiper)}
        >
          {tracks.map((track, index) => (
            <SwiperSlide
              key={track.id}
              className={`swiper-music-list__item ${selectedTrackIndex === index ? 'active' : ''}`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="swiper-music-list__item__left">
                <div
                  className="swiper-music-list__item__left__img"
                  style={{ backgroundImage: `url(${track.cover})` }}
                >
                </div>
                <span className="time">
                  {selectedTrackIndex === index
                    ? `${formatTime(currentTime)}`
                    : formatTime(track.duration)}
                </span>
              </div>
              <div className="swiper-music-list__item__right">
                <p className="swiper-music-list__item__right__title">
                  {track.title}
                </p>
                <div className="swiper-music-list__item__right__love-play">
                  <p className="love"><img src={loveIcon}/>145</p>
                  <p className="play"><img src={playIcon}/>145</p>
                </div>
                <div className="swiper-music-list__item__right__user">
                  <p className="swiper-music-list__item__right__user__info">
                    <img src={defaultCoverImg}/>Yolkhead
                  </p>
                  <button className="swiper-music-list__item__right__user__btn">
                    유저정보
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* {tracks.map((track, index) => (
            <SwiperSlide className="swiper-music-list__item">
              <p 
                // style={{ backgroundImage: `url(${track.cover})` }}
              >1
              </p>
            </SwiperSlide>
          ))} */}
          {/* <SwiperSlide><p>Slide 2</p></SwiperSlide>
          <SwiperSlide><p>Slide 3</p></SwiperSlide>
          <SwiperSlide><p>Slide 4</p></SwiperSlide>
          <SwiperSlide><p>Slide 5</p></SwiperSlide>
          <SwiperSlide><p>Slide 6</p></SwiperSlide>
          <SwiperSlide><p>Slide 7</p></SwiperSlide>
          <SwiperSlide><p>Slide 8</p></SwiperSlide>
          <SwiperSlide><p>Slide 9</p></SwiperSlide> */}
        </Swiper>
      </section>


      <section className="album__content-list">
        <article className="album__content-list__tab">
          <button
            className={`album__content-list__tab__item ${activeTab === "AI Lyric & Songwriting" ? "active" : ""}`}
            onClick={() => setActiveTab("AI Lyric & Songwriting")}
          >
            AI Lyric & Songwriting
          </button>
          <button
            className={`album__content-list__tab__item ${activeTab === "AI Singing Evaluation" ? "active" : ""}`}
            onClick={() => setActiveTab("AI Singing Evaluation")}
          >
            AI Singing Evaluation
          </button>
        </article>
        <p className="album__content-list__title">AI Lyric & Songwriting</p>
        <article className="album__content-list__list">
          {tracks.slice(9).map((track, index) => (
            <button
              key={track.id}
              className={`album__content-list__list__item ${selectedTrackIndex === index ? 'active' : ''}`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="album__content-list__list__item__left">
                <p
                  className="album__content-list__list__item__left__img"
                  style={{ backgroundImage: `url(${track.cover})` }}
                >
                </p>
                <span className="time">
                  {selectedTrackIndex === index
                    ? `${formatTime(currentTime)}`
                    : formatTime(track.duration)}
                </span>
                {/* <span className="time">
                  {selectedTrackIndex === index
                    ? `${formatTime(currentTime)} / ${formatTime(track.duration)}`
                    : formatTime(track.duration)}
                </span> */}
              </div>
              <div className="album__content-list__list__item__right">
                <p className="album__content-list__list__item__right__title">
                  {track.title}
                </p>
                <div className="album__content-list__list__item__right__love-play">
                  <p className="love"><img src={loveIcon}/>145</p>
                  <p className="play"><img src={playIcon}/>145</p>
                </div>
                <div className="album__content-list__list__item__right__user">
                  <p className="album__content-list__list__item__right__user__info">
                    <img src={defaultCoverImg}/>Yolkhead
                  </p>
                  <button className="album__content-list__list__item__right__user__btn">
                    유저정보
                  </button>
                </div>
              </div>
            </button>
          ))}
        </article>
        <Link 
          className="album__content-list__see-more-btn"
          to=''
        >See More
        </Link>
      </section>

    </div>
  );
}

export default Album;
