// components/AlbumDetail.js
import '../styles/AlbumDetail.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import MyAudioPlayer from '../components/MyAudioPlayer';
import coverImg from '../assets/images/intro/intro-demo-img.png';
import demoImg from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../assets/images/like-icon/like-icon-on.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import commentIcon from '../assets/images/album/chat-icon.svg';
import shareIcon from '../assets/images/album/share-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import track1 from '../assets/music/song01.mp3';
import track2 from '../assets/music/nisoft_song.mp3';
import { Swiper, SwiperSlide } from 'swiper/react';

import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import PreparingModal from '../components/PreparingModal';
import AdvancedCommentComponent from '../components/AdvancedCommentComponent';
import ShareModal from '../components/ShareModal';
import { AuthContext } from '../contexts/AuthContext';
import { formatUtcTime, formatLocalTime } from '../utils/getFormattedTime';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import LyricsModal from '../components/LyricsModal';
// 외부에서 플레이 카운트 업데이트 함수를 import합니다.
import { incrementPlayCount } from "../api/incrementPlayCount";
import AlbumItem from "../components/unit/AlbumItem";
import IntroLogo3 from "../components/IntroLogo3";
function AlbumDetail() {
    const [isPreparingModal, setPreparingModal] = useState(false);
    const serverApi = process.env.REACT_APP_SERVER_API;
    const { id } = useParams();
    const { token, walletAddress } = useContext(AuthContext);

    console.log('walletAddress1', walletAddress);
    console.log('walletAddress2', walletAddress?.address);
    // 리더보드 데이터
    const [leaderBoardData, setLeaderBoardData] = useState([]);
    // console.log("leaderBoardData", leaderBoardData);
    const getLeaderboardData = async () => {
        try {
            const res = await axios.get(`${serverApi}/api/music/leader/board/rank`);
            console.log('getLeaderboardData', res);
            setLeaderBoardData(res.data);
        } catch (error) {
            console.log('getLeaderboardData error: ', error);
        }
    };

    // Your Picks

    const [favoriteGenreList, setFavoriteGenreList] = useState([]);
    console.log('favoriteGenreList', favoriteGenreList);

    const getFavoriteGenre = async () => {
        try {
            const res = await axios.get(
                `${serverApi}/api/music/recommended/list?wallet_address=${walletAddress?.address}`
            );

            setFavoriteGenreList(res.data);
        } catch (error) {
            console.error('getFavoriteGenre error: ', error);
        }
    };

    const [similarVibesList, setSimilarVibesList] = useState([]);
    console.log('similarVibesList', similarVibesList);

    const getSimilarVibes = async () => {
        try {
            const res = await axios.get(`${serverApi}/api/music/${id}/content/link/list`);

            setSimilarVibesList(res.data);
        } catch (error) {
            console.error('getSimilarVibes error: ', error);
        }
    };

    const swiperOptions = {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 8,
        // initialSlide: 2,
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
    const handleClick = () => {
        setIsActive((prev) => !prev);
    };

    const commentRef = useRef(null);
    const handleScrollToComment = () => {
        if (commentRef.current) {
            const offset = -100;
            const top = commentRef.current.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }
    };

    // 앨범 상세 정보 상태
    const [album, setAlbum] = useState(null);
    const [albumDuration, setAlbumDuration] = useState(null);

    // 앨범 시간 변환 함수
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

  // 앨범 상세 정보 가져오기 함수
  const fetchAlbumDetail = async () => {
    // 페이지 전환 시 기존 데이터를 초기화하고 로딩 상태 true로 설정합니다.
    setAlbum(null);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${serverApi}/api/music/${id}?wallet_address=${walletAddress?.address}`
      );
      setAlbum(response.data);
      // 앨범 재생 시간 계산
      const audio = new Audio(response?.data?.music_url);
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        setAlbumDuration(duration);
      });
    } catch (error) {
      console.error("앨범 상세 정보 가져오기 에러:", error);
    }
    setIsLoading(false);
  };

    useEffect(() => {
        fetchAlbumDetail();
        getLeaderboardData();
        getFavoriteGenre();
        getSimilarVibes();
    }, [id, walletAddress, token, serverApi]);

    const [isPlaying, setIsPlaying] = useState(false);

    // 플레이 카운트 업데이트 로직 적용을 위한 useRef 및 상태 선언
    const playCountRef = useRef(false);
    const [prevTime, setPrevTime] = useState(0);

    const handleListen = async (e) => {
        const currentTime = e.target.currentTime;
        // 재생 시간이 이전 시간보다 작으면(리와인드 시) 플래그 초기화
        if (currentTime < prevTime) {
            playCountRef.current = false;
        }
        setPrevTime(currentTime);

        // 아직 카운트 업데이트를 하지 않았고, 90초 이상 재생 시 업데이트 실행
        if (!playCountRef.current && currentTime >= 90) {
            await incrementPlayCount(album?.id, serverApi);
            playCountRef.current = true;
            // 재생 시간 업데이트 후 앨범 상세 정보 다시 가져오기
            fetchAlbumDetail();
        }
    };

    // 앨범 관련 기타 상태 및 이벤트 핸들러
    const tagString = album?.tags;
    const tagArray = tagString
        ? tagString
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
        : [];

    const handleLike = async () => {
        console.log('id', id);
        try {
            if (album?.is_like) {
                await cancelLikeAlbum(id, token);
            } else {
                await likeAlbum(id, token);
            }
            fetchAlbumDetail();
        } catch (error) {
            console.error('좋아요 에러:', error);
        }
    };

  const { isLoggedIn } = useContext(AuthContext);
  const LoadingSpinner = () => {
    return <div className="loading-spinner">Loading...</div>;
  };
  // 로딩 상태 변수 추가
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <IntroLogo3 />}
      <div className="song-detail">
        <dl className="album-detail__title">
          <dt>AI Lyrics & Songwriting</dt>
          <dd>Lyrics+Songwriting</dd>
        </dl>
        <section className="album-detail__song-detail">
          <p className="album-detail__song-detail__title">Song Detail</p>
          <div className="album-detail__song-detail__bot">
            <div className="album-detail__song-detail__left">
              <section className="album-detail__audio">
                <AudioPlayer
                  src={album?.music_url || track1}
                  onPlay={() => {
                    console.log("PLAY!");
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    console.log("PAUSE!");
                    setIsPlaying(false);
                  }}
                  onEnded={() => {
                    console.log("ENDED!");
                    setIsPlaying(false);
                  }}
                  // onListen 이벤트를 통해 재생 시간 체크 후 플레이 카운트 업데이트
                  onListen={handleListen}
                  listenInterval={1000}
                />
                <p
                  className={`album-detail__audio__cover ${
                    isPlaying ? "playing" : "paused"
                  }`}
                >
                  <img src={album?.cover_image || coverImg} alt="album cover" />
                </p>
              </section>
              <div
                className={`album-detail__song-detail__left__img ${
                  isActive ? "active" : ""
                }`}
                onClick={handleClick}
              >
                {album ? (
                  <img src={album?.cover_image || demoImg} alt="앨범 이미지" />
                ) : (
                  <div style={{ backgroundColor: "black" }} />
                )}
                <div className="album-detail__song-detail__left__img__txt">
                  {/* <pre>{album?.lyrics}</pre> */}
                  <pre>
                    {album?.lyrics
                      ?.replace(/(###\s?[\w\s]+)/g, "\n$1") // "###"로 시작하는 절 제목 위에 두 개의 줄바꿈 추가
                      ?.replace(/(\*\*.*?\*\*)/g, "\n$1") // **텍스트** 위에 두 개의 줄바꿈 추가
                      ?.replace(/\[([^\]]+)\]/g, "\n[$1]") // [] 안의 텍스트 위에만 줄바꿈 추가 (아래 줄바꿈 없음)
                      ?.replace(/\(([^\)]+)\)/g, "\n($1)") // () 안의 텍스트 위에만 줄바꿈 추가 (아래 줄바꿈 없음)
                      ?.trim()}
                  </pre>
                  {/* {album?.lyrics && console.log("가사 내용:", album.lyrics)} */}
                </div>
                <button className="album-detail__song-detail__left__img__lyrics-btn">
                  Lyrics
                </button>
              </div>
              <div className="album-detail__song-detail__left__info">
                <div className="album-detail__song-detail__left__info__number">
                  <p className="love" onClick={handleLike}>
                    <img
                      src={album?.is_like ? halfHeartIcon : loveIcon}
                      alt="love Icon"
                    />
                    {album?.like || 0}
                  </p>
                  <p className="play">
                    <img src={playIcon} />
                    {album?.play_cnt || 0}
                  </p>
                  <p className="comment" onClick={handleScrollToComment}>
                    <img src={commentIcon} />
                    {album?.comment_cnt || 0}
                  </p>
                </div>
                <button
                  className="album-detail__song-detail__left__info__share-btn"
                  onClick={() => setShareModal(true)}
                >
                  <img src={shareIcon} />
                </button>
              </div>
            </div>
            <div className="album-detail__song-detail__right">
              <p className="album-detail__song-detail__right__title">
                {album?.title}
              </p>
              <div className="album-detail__song-detail__right__type">
                {tagArray.map((type, index) => (
                  <div
                    key={index}
                    className="album-detail__song-detail__right__type__item"
                  >
                    {type}
                  </div>
                ))}
              </div>
              <div className="album-detail__song-detail__right__info-box">
                <dl>
                  <dt>Detail</dt>
                  <dd>{album?.detail || "-"}</dd>
                </dl>
                <dl>
                  <dt>Language</dt>
                  <dd>{album?.language || "-"}</dd>
                </dl>
                <dl>
                  <dt>Genre</dt>
                  <dd>{album?.genre || "-"}</dd>
                </dl>
                <dl>
                  <dt>Stylistic</dt>
                  <dd>{album?.Stylistic || "-"}</dd>
                </dl>
                <dl>
                  <dt>Gender</dt>
                  <dd>{album?.gender || "-"}</dd>
                </dl>
                {/* <dl>
                  <dt>Age</dt>
                  <dd>{album?.voice_age || "-"}</dd>
                </dl> */}
                <dl>
                  <dt>Musical Instrument</dt>
                  <dd>{album?.musical_instrument || "-"}</dd>
                </dl>
                <dl>
                  <dt>Tempo</dt>
                  <dd>{album?.tempo || "-"}</dd>
                </dl>
                <dl>
                  <dt>Creation Data</dt>
                  <dd>
                    <span>{formatLocalTime(album?.create_dt)}</span>
                  </dd>
                </dl>
                <dl>
                  <dt>Song Length</dt>
                  <dd>{formatTime(albumDuration) || "-"}</dd>
                </dl>
                <dl className="artist">
                  <dt>Artist</dt>
                  <dd>
                    <p className="user">
                      <img src={album?.user_profile || defaultCoverImg} />
                      {album?.name || "-"}
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </section>

                <section
                    // className="album-detail__rank-table"
                    className={`album-detail__rank-table ${isLoggedIn ? 'is-logged-in' : 'not-logged-in'}`}
                >
                    <div ref={commentRef}>
                        <AdvancedCommentComponent id={id} />
                    </div>
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
                                    <th>Likes</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderBoardData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td className="user-info">
                                            <p>
                                                <img src={item.user_profile || defaultCoverImg} />
                                                {item.name}
                                            </p>
                                        </td>
                                        <td>
                                            <p>{item.title}</p>
                                        </td>
                                        <td>{formatLocalTime(item.create_dt)}</td>
                                        <td>{item.like}</td>
                                        <td>
                                            <Link
                                                // className={item.buttonClass}
                                                className="details-btn active"
                                                to={'/song-detail/' + item.id}
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* <button className="album-detail__filter-btn">
            Filter
          </button> */}
                </section>

                <section className="album-detail__slide">
                    <dl className="album-detail__slide__title">
                        <dt>Your Picks</dt>
                        <dd>Top tracks from your favorite genre.</dd>
                    </dl>
                    <div className="album-detail__slide__swiper">
                        <Swiper {...swiperOptions} className="song-detail-slide">
                            {favoriteGenreList.map((track, index) => (
                                <SwiperSlide key={track.id}>
                                    <AlbumItem track={track} />
                                    {/* <button key={track.id} className={`album__content-list__list__item`}>
                                        <div className="album__content-list__list__item__left">
                                            <p
                                                className="album__content-list__list__item__left__img"
                                                style={{ backgroundImage: `url(${track.cover_image})` }}
                                            ></p>
                                            <span className="time">{formatTime(track.duration)}</span>
                                        </div>
                                        <div className="album__content-list__list__item__right">
                                            <p className="album__content-list__list__item__right__title">
                                                {track.title}
                                            </p>
                                            <div className="album__content-list__list__item__right__love-play">
                                                <p className="love">
                                                    <img src={loveIcon} />
                                                    {track.like}
                                                </p>
                                                <p className="play">
                                                    <img src={playIcon} />
                                                    {track.play_cnt}
                                                </p>
                                            </div>
                                            <div className="album__content-list__list__item__right__user">
                                                <p className="album__content-list__list__item__right__user__info">
                                                    <img
                                                        src={track.user_profile ? track.user_profile : defaultCoverImg}
                                                        alt="User profile"
                                                    />
                                                    {track.name}
                                                </p>
                                                <Link
                                                    className="album__content-list__list__item__right__user__btn"
                                                    to={`/song-detail/${track?.id}`}
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </button> */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>

                <section className="album-detail__slide">
                    <dl className="album-detail__slide__title">
                        <dt>Similar Vibes</dt>
                        <dd>Top tracks from the same genre as this song.</dd>
                    </dl>
                    <div className="album-detail__slide__swiper">
                        <Swiper {...swiperOptions} className="song-detail-slide">
                            {similarVibesList.map((track, index) => (
                                <SwiperSlide key={track.id}>
                                    <AlbumItem track={track} />
                                </SwiperSlide>
                            ))}
                            {/* {tracks.slice(0, 9).map((track, index) => (
                                <SwiperSlide>
                                    <button key={track.id} className={`album__content-list__list__item`}>
                                        <div className="album__content-list__list__item__left">
                                            <p
                                                className="album__content-list__list__item__left__img"
                                                style={{ backgroundImage: `url(${track.cover})` }}
                                            ></p>
                                            <span className="time">2:11</span>
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
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </button>
                                </SwiperSlide>
                            ))} */}
                        </Swiper>
                    </div>
                </section>
            </div>
            {isShareModal && (
                <ShareModal setShareModal={setShareModal} shareUrl={window.location.href} title={album?.title} />
            )}
            {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
        </>
    );
}

export default AlbumDetail;
