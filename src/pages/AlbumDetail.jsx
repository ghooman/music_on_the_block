import "../styles/AlbumDetail.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import axios from "axios";
import MyAudioPlayer from "../components/MyAudioPlayer";
import coverImg from "../assets/images/intro/intro-demo-img.png";
import coverImg2 from "../assets/images/intro/intro-demo-img2.png";
import coverImg3 from "../assets/images/intro/intro-demo-img3.png";
import coverImg4 from "../assets/images/demo/album01.svg";
import coverImg5 from "../assets/images/demo/album02.svg";
import coverImg6 from "../assets/images/demo/album03.svg";
import coverImg7 from "../assets/images/demo/album04.svg";
import coverImg8 from "../assets/images/demo/album05.svg";
import coverImg9 from "../assets/images/demo/album06.svg";
import loveIcon from "../assets/images/like-icon/like-icon.svg";
import lovedIcon from "../assets/images/like-icon/like-icon-on.svg";
import playIcon from "../assets/images/album/play-icon.svg";
import commentIcon from "../assets/images/album/chat-icon.svg";
import shareIcon from "../assets/images/album/share-icon.svg";
import defaultCoverImg from "../assets/images/header/logo.svg";
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";

//스와이프
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  Autoplay,
} from "swiper/modules";

import AdvancedCommentComponent from "../components/AdvancedCommentComponent";
import ShareModal from "../components/ShareModal";
import { AuthContext } from "../contexts/AuthContext";

function AlbumDetail() {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { id, walletAddress } = useParams();
  const { token } = useContext(AuthContext);
  const dummyData = [
    {
      id: 30,
      userName: "User A",
      description: "he dances through his masks<br />like breathing - Yolkhead",
      date: "Sat, 04 Nov 2023 14:40:00 UTC+0",
      liked: true,
      buttonClass: "details-btn",
    },
    {
      id: 31,
      userName: "User B",
      description: "he dances through his masks<br />like breathing - Yolkhead",
      date: "Sat, 04 Nov 2023 14:50:00 UTC+0",
      liked: false,
      buttonClass: "details-btn ",
    },
    {
      id: 32,
      userName: "User C",
      description: "he dances through his masks",
      date: "Sat, 04 Nov 2023 15:00:00 UTC+0",
      liked: false,
      buttonClass: "details-btn disabled",
    },
    {
      id: 33,
      userName: "User D",
      description: "moving forward without looking back - PoetX",
      date: "Sat, 04 Nov 2023 15:10:00 UTC+0",
      liked: true,
      buttonClass: "details-btn",
    },
    {
      id: 34,
      userName: "User E",
      description: "shadows whisper in the moonlight - Anonymous",
      date: "Sat, 04 Nov 2023 15:20:00 UTC+0",
      liked: false,
      buttonClass: "details-btn ",
    },
  ];

  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: "he dances through his masks like breathing - Yolkhead",
      src: track1,
      cover: coverImg,
      duration: null,
    },
    {
      id: 2,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg2,
      duration: null,
    },
    {
      id: 3,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg3,
      duration: null,
    },
    {
      id: 4,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg4,
      duration: null,
    },
    {
      id: 5,
      title: "he dances through his masks like breathing - Yolkhead",
      src: track2,
      cover: coverImg5,
      duration: null,
    },
    {
      id: 6,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg6,
      duration: null,
    },
    {
      id: 7,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 8,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 9,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg9,
      duration: null,
    },

    {
      id: 10,
      title: "he dances through his masks like breathing - Yolkhead",
      src: track1,
      cover: coverImg9,
      duration: null,
    },
    {
      id: 11,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 12,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 13,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg4,
      duration: null,
    },
    {
      id: 14,
      title: "he dances through his masks like breathing - Yolkhead",
      src: track2,
      cover: coverImg5,
      duration: null,
    },
    {
      id: 15,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg6,
      duration: null,
    },
    {
      id: 16,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg7,
      duration: null,
    },
    {
      id: 17,
      title: "Touch The Sky - Simon Doty",
      src: track1,
      cover: coverImg8,
      duration: null,
    },
    {
      id: 18,
      title: "Touch The Sky - Simon Doty",
      src: track2,
      cover: coverImg9,
      duration: null,
    },
  ]);
  const swiperOptions = {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 8,
    initialSlide: 2,
    grabCursor: true,
    pagination: {
      clickable: true,
    },
    navigation: true,
    modules: [Pagination, Navigation, Autoplay],
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      680: {
        slidesPerView: 2,
      },
      930: {
        slidesPerView: 3,
      },
    },
  };

  const [isActive, setIsActive] = useState(false);
  const [isShareModal, setShareModal] = useState(false);
  const [loved, setLoved] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };
  const handleToggleLove = () => {
    setLoved((prev) => !prev);
  };

  const commentRef = useRef(null);

  const handleScrollToComment = () => {
    if (commentRef.current) {
      const offset = -100;
      const top =
        commentRef.current.getBoundingClientRect().top +
        window.scrollY +
        offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };
  // 앨범 관련 상태
  const [album, setAlbum] = useState(null);
  // 앨범 상세 정보 가져오기
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      try {
        const response = await axios.get(`${serverApi}/api/music/${id}`, {
          params: {
            wallet_address: walletAddress,
          },
        });

        console.log("앨범 상세 정보:", response.data);
        setAlbum(response.data);
      } catch (error) {
        console.error("앨범 상세 정보 가져오기 에러:", error);
      }
    };
    fetchAlbumDetail();
  }, [id, walletAddress, token, serverApi]);

  return (
    <>
      <div className="album-detail">
        <dl className="album-detail__title">
          <dt>AI Lyric & Songwriting</dt>
          <dd>lyric+Songwriting</dd>
        </dl>
        <section className="album-detail__song-detail">
          <p className="album-detail__song-detail__title">Song Detail</p>
          {/* 음악 재생 */}
          <audio src={album?.music_url || track1} controls></audio>
          <div className="album-detail__song-detail__bot">
            <div className="album-detail__song-detail__left">
              <div
                className={`album-detail__song-detail__left__img ${
                  isActive ? "active" : ""
                }`}
                onClick={handleClick}
              >
                <img src={album?.image || coverImg} />
                <div className="album-detail__song-detail__left__img__txt">
                  <pre>{album?.lyrics}</pre>
                </div>
              </div>
              <div className="album-detail__song-detail__left__info">
                <div className="album-detail__song-detail__left__info__number">
                  <button className="love" onClick={handleToggleLove}>
                    <img src={loved ? lovedIcon : loveIcon} alt="love" />
                    {loved ? 146 : 145}
                  </button>
                  {/* <button className="play"><img src={playIcon}/>125K</button> */}
                  <button className="comment" onClick={handleScrollToComment}>
                    <img src={commentIcon} />
                    125K
                  </button>
                  <button
                    className="album-detail__song-detail__left__info__share-btn"
                    onClick={() => setShareModal(true)}
                  >
                    <img src={shareIcon} />
                  </button>
                </div>
                <p className="play">
                  <img src={playIcon} />
                  125K
                </p>
              </div>
            </div>
            <div className="album-detail__song-detail__right">
              <p className="album-detail__song-detail__right__title">
                he dances through his masks like breathing - Yolkhead
              </p>
              <div className="album-detail__song-detail__right__type">
                <div className="album-detail__song-detail__right__type__item">
                  Moon
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Lover
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Mystery
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Serenity
                </div>
              </div>
              <div className="album-detail__song-detail__right__info-box">
                <dl>
                  <dt>Story</dt>
                  <dd>A love story about two people overcoming challenges</dd>
                </dl>
                <dl>
                  <dt>Genre</dt>
                  <dd>POP</dd>
                </dl>
                <dl>
                  <dt>Style</dt>
                  <dd>Passion</dd>
                </dl>
                <dl>
                  <dt>Stylistic</dt>
                  <dd>emotioal stylistic</dd>
                </dl>
                <dl>
                  <dt>Creation Data</dt>
                  <dd>
                    Sat, 04 Nov 2023 14:40:00 UTC+0
                    <span>Sat, 04 Nov 2023 14:40:00 UTC+0</span>
                  </dd>
                </dl>
                <dl className="artist">
                  <dt>Artist</dt>
                  <dd>
                    <p className="user">
                      <img src={coverImg2} />
                      Yolkhead
                    </p>
                    <Link className="see-more-btn" to="/my-page">
                      See More
                    </Link>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="album-detail__rank-table">
          <dl className="album-detail__rank-table__title">
            <dt>Albums Leaderboard Rank</dt>
            <dd>Most Likes</dd>
          </dl>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Artist</th>
                  <th>Song Title</th>
                  <th>Date</th>
                  <th>Like</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.userName}</td>
                    <td
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    ></td>
                    <td>{item.date}</td>
                    <td>
                      <span
                        className={`heart ${item.liked ? "liked" : ""}`}
                      ></span>
                    </td>
                    <td>
                      <button className={item.buttonClass}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <button className="album-detail__filter-btn">
            Filter
          </button> */}
          <div ref={commentRef}>
            <AdvancedCommentComponent />
          </div>
        </section>

        <section className="album-detail__slide">
          <dl className="album-detail__slide__title">
            <dt>Recommended Music Source</dt>
            <dd>
              Discover music tracks tailored to your preferences. Based on mood,
              genre, and user recommendations, these songs are perfectly matched
              to your current selection
            </dd>
          </dl>
          <div className="album-detail__slide__swiper">
            <Swiper {...swiperOptions} className="album-detail-slide">
              {tracks.slice(0, 9).map((track, index) => (
                <SwiperSlide>
                  <button
                    key={track.id}
                    className={`album__content-list__list__item`}
                  >
                    <div className="album__content-list__list__item__left">
                      <p
                        className="album__content-list__list__item__left__img"
                        style={{ backgroundImage: `url(${track.cover})` }}
                      ></p>
                      <span className="time">2:11</span>
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
                          <img src={loveIcon} />
                          145
                        </p>
                        <p className="play">
                          <img src={playIcon} />
                          145
                        </p>
                      </div>
                      <div className="album__content-list__list__item__right__user">
                        <p className="album__content-list__list__item__right__user__info">
                          <img src={defaultCoverImg} />
                          Yolkhead
                        </p>
                        <button className="album__content-list__list__item__right__user__btn">
                          유저정보
                        </button>
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section className="album-detail__slide">
          <dl className="album-detail__slide__title">
            <dt>Content liked by other users</dt>
            <dd>
              Expand your music journey with tracks loved by users who
              appreciated this sound. Find hidden gems and connect with similar
              musical tastes.
            </dd>
          </dl>
          <div className="album-detail__slide__swiper">
            <Swiper {...swiperOptions} className="album-detail-slide">
              {tracks.slice(0, 9).map((track, index) => (
                <SwiperSlide>
                  <button
                    key={track.id}
                    className={`album__content-list__list__item`}
                  >
                    <div className="album__content-list__list__item__left">
                      <p
                        className="album__content-list__list__item__left__img"
                        style={{ backgroundImage: `url(${track.cover})` }}
                      ></p>
                      <span className="time">2:11</span>
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
                          <img src={loveIcon} />
                          145
                        </p>
                        <p className="play">
                          <img src={playIcon} />
                          145
                        </p>
                      </div>
                      <div className="album__content-list__list__item__right__user">
                        <p className="album__content-list__list__item__right__user__info">
                          <img src={defaultCoverImg} />
                          Yolkhead
                        </p>
                        <button className="album__content-list__list__item__right__user__btn">
                          유저정보
                        </button>
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>
      {isShareModal && <ShareModal setShareModal={setShareModal} />}
    </>
  );
}

export default AlbumDetail;
