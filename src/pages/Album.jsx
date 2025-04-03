import "../styles/Album.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import MyAudioPlayer from "../components/MyAudioPlayer";
import coverImg from "../assets/images/intro/intro-demo-img.png";
import coverImg2 from "../assets/images/intro/intro-demo-img2.png";
import coverImg3 from "../assets/images/intro/intro-demo-img3.png";
import coverImg10 from "../assets/images/intro/intro-demo-img4.png";
import coverImg4 from "../assets/images/demo/album01.svg";
import coverImg5 from "../assets/images/demo/album02.svg";
import coverImg6 from "../assets/images/demo/album03.svg";
import coverImg7 from "../assets/images/demo/album04.svg";
import coverImg8 from "../assets/images/demo/album05.svg";
import coverImg9 from "../assets/images/demo/album06.svg";
import loveIcon from "../assets/images/album/love-icon.svg";
import halfHeartIcon from "../assets/images/icon/half-heart.svg";
import playIcon from "../assets/images/album/play-icon.svg";
import defaultCoverImg from "../assets/images/header/logo.svg";
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";
import track3 from "../assets/music/MusicOnTheBlock_v1.mp3";

// 스와이프
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { likeAlbum, cancelLikeAlbum } from "../api/AlbumLike";
import { getHitMusicList } from "../api/HitMusicList";
function Album() {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token, walletAddress } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("AI Lyric & Songwriting");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 88);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // getHitMusicList
  const [hitMusicList, setHitMusicList] = useState([]);
  useEffect(() => {
    const handleGetMusicList = async () => {
      try {
        const res = await getHitMusicList(walletAddress);
        setHitMusicList(res.data);
        // console.log("hitMusicList", res.data);
      } catch (e) {
        console.error(e);
      }
    };
    handleGetMusicList();
  }, [walletAddress]);
  // 노래플레이 관련 상태
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [tracks, setTracks] = useState([]);

  const getTracks = async () => {
    try {
      const res = await axios.get(
        `${serverApi}/api/music/all/list?wallet_address=${walletAddress?.address}`
      );
      const fetchedTracks = res.data.data_list;

      // 트랙마다 오디오 정보를 불러와 duration 설정
      fetchedTracks.forEach((track, index) => {
        const audio = new Audio(track.music_url);
        audio.addEventListener("loadedmetadata", () => {
          fetchedTracks[index].duration = audio.duration;
          setTracks([...fetchedTracks]);
        });
      });
      setTracks(fetchedTracks);
      console.log("album", fetchedTracks);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getTracks();
    }
  }, [walletAddress]);

  // tracks 업데이트 후, 선택된 트랙이 없다면 첫 번째 트랙(인덱스 0)을 선택
  useEffect(() => {
    if (tracks.length > 0 && selectedTrackIndex === null) {
      setSelectedTrackIndex(0);
    }
  }, [tracks, selectedTrackIndex]);

  const handleTrackClick = (index) => {
    setSelectedTrackIndex(index);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleClickPrevious = () => {
    if (selectedTrackIndex !== null) {
      const prevIndex =
        selectedTrackIndex === 0 ? tracks.length - 1 : selectedTrackIndex - 1;
      setSelectedTrackIndex(prevIndex);
    }
  };

  const handleClickNext = () => {
    if (selectedTrackIndex !== null) {
      const nextIndex =
        selectedTrackIndex === tracks.length - 1 ? 0 : selectedTrackIndex + 1;
      setSelectedTrackIndex(nextIndex);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 선택된 트랙의 정보
  const selectedTrack =
    selectedTrackIndex !== null ? tracks[selectedTrackIndex] : null;
  const albumTitle = selectedTrack ? selectedTrack.title : "Select an Album";
  const albumCover = selectedTrack ? selectedTrack.cover : defaultCoverImg;

  // 스와이프 관련 설정
  const swiperRef = useRef(null);
  const handleSlideChange = (swiper) => {
    const slides = swiper.slides;
    const activeIndex = swiper.activeIndex;
    const totalSlides = slides.length;

    slides.forEach((slide, index) => {
      slide.classList.remove(
        "swiper-slide-next-next",
        "swiper-slide-prev-prev"
      );

      if (index === (activeIndex + 2) % totalSlides) {
        slide.classList.add("swiper-slide-next-next");
      }
      if (index === (activeIndex - 2 + totalSlides) % totalSlides) {
        slide.classList.add("swiper-slide-prev-prev");
      }
    });
  };

  const handleLikeClick = async (track) => {
    try {
      if (track?.is_like) {
        await cancelLikeAlbum(track?.id, token);
      } else {
        await likeAlbum(track?.id, token);
      }
      getTracks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="album">
      <div
        className={`album__header 
            ${selectedTrackIndex !== null ? "active" : ""} 
            ${isScrolled ? "scrolled" : ""}`}
      >
        <div className="album__header__album-cover">
          <p
            className="album__header__album-cover__img"
            style={{
              backgroundImage: `url(${
                selectedTrack?.image === "string"
                  ? coverImg10
                  : selectedTrack?.image
              })`,
            }}
          ></p>
          <p className="album__header__title">{albumTitle}</p>
        </div>
        <div className="album__header__cover-info">
          <div className="album__header__cover-info__love-play">
            <p className="love" onClick={() => handleLikeClick(selectedTrack)}>
              <img
                src={selectedTrack?.is_like ? halfHeartIcon : loveIcon}
                alt="like-heart-icon"
              />
              {selectedTrack?.like || 0}
            </p>
            <p className="play">
              <img src={playIcon} alt="play-icon" />
              {selectedTrack?.play_cnt || 0}
            </p>
            <p>|</p>
            <p className="name">
              <img src={selectedTrack?.user_profile || defaultCoverImg} />
              {selectedTrack?.name || "unKnown"}
            </p>
          </div>
          <Link
            className="album__header__cover-info__btn"
            to={`/album-detail/${selectedTrack?.id}`}
          >
            Detail
          </Link>
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
              className={`album__content-list__list__item ${
                selectedTrackIndex === index ? "active" : ""
              }`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="album__content-list__list__item__left">
                <p
                  className="album__content-list__list__item__left__img"
                  style={{
                    backgroundImage: `url(${
                      track.image === "string" ? coverImg10 : track.image
                    })`,
                  }}
                ></p>
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
                  <p className="love">
                    <img src={track.is_like ? halfHeartIcon : loveIcon} />
                    {track?.like || 0}
                  </p>
                  <p className="play">
                    <img src={playIcon} />
                    {track?.play_cnt || 0}
                  </p>
                </div>
                <div className="album__content-list__list__item__right__user">
                  <p className="album__content-list__list__item__right__user__info">
                    <img src={track?.user_profile || defaultCoverImg} />
                    {track?.name || "unKnown"}
                  </p>
                  <Link
                    className="album__content-list__list__item__right__user__btn"
                    to={"/album-detail/" + track.id}
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </button>
          ))}
        </article>
        <Link className="album__content-list__see-more-btn" to="">
          Detail
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
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Pagination, Autoplay]}
          className="swiper-music-list"
          onSlideChange={(swiper) => handleSlideChange(swiper)}
        >
          {hitMusicList.map((track, index) => (
            <SwiperSlide
              key={track.id}
              className={`swiper-music-list__item ${
                selectedTrackIndex === index ? "active" : ""
              }`}
              // onClick={() => handleTrackClick(index)}
            >
              <div className="swiper-music-list__item__left">
                <div
                  className="swiper-music-list__item__left__img"
                  style={{
                    backgroundImage: `url(${
                      track.image === "string" ? coverImg10 : track.image
                    })`,
                  }}
                ></div>
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
                  <p className="love" onClick={() => handleLikeClick(track)}>
                    <img src={track.is_like ? halfHeartIcon : loveIcon} />
                    {track?.like || 0}
                  </p>
                  <p className="play">
                    <img src={playIcon} />
                    {track?.play_cnt || 0}
                  </p>
                </div>
                <div className="swiper-music-list__item__right__user">
                  <p className="swiper-music-list__item__right__user__info">
                    <img src={track?.user_profile || defaultCoverImg} />
                    {track?.name || "unKnown"}
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
            className={`album__content-list__tab__item ${
              activeTab === "AI Lyric & Songwriting" ? "active" : ""
            }`}
            onClick={() => setActiveTab("AI Lyric & Songwriting")}
          >
            AI Lyric & Songwriting
          </button>
          <button
            className={`album__content-list__tab__item ${
              activeTab === "AI Singing Evaluation" ? "active" : ""
            }`}
            onClick={() => setActiveTab("AI Singing Evaluation")}
          >
            AI Singing Evaluation
          </button>
        </article>
        <p className="album__content-list__title">AI Lyric & Songwriting</p>
        <article className="album__content-list__list">
          {tracks.slice(0, 9).map((track, index) => (
            <button
              key={track.id}
              className={`album__content-list__list__item ${
                selectedTrackIndex === index ? "active" : ""
              }`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="album__content-list__list__item__left">
                <p
                  className="album__content-list__list__item__left__img"
                  style={{
                    backgroundImage: `url(${
                      track.image === "string" ? coverImg10 : track.image
                    })`,
                  }}
                ></p>
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
                  <p className="love">
                    <img src={track.is_like ? halfHeartIcon : loveIcon} />
                    {track?.like || 0}
                  </p>
                  <p className="play">
                    <img src={playIcon} />
                    {track?.play_cnt || 0}
                  </p>
                </div>
                <div className="album__content-list__list__item__right__user">
                  <p className="album__content-list__list__item__right__user__info">
                    <img src={track?.user_profile || defaultCoverImg} />
                    {track?.name || "unKnown"}
                  </p>
                  <button className="album__content-list__list__item__right__user__btn">
                    Detail
                  </button>
                </div>
              </div>
            </button>
          ))}
        </article>
        <Link className="album__content-list__see-more-btn" to="">
          Detail
        </Link>
      </section>
    </div>
  );
}

export default Album;
