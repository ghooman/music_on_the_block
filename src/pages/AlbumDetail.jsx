// components/AlbumDetail.js
import '../styles/AlbumDetail.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import MyAudioPlayer from '../components/MyAudioPlayer';

import coverImg from '../assets/images/black-img.jpg';
import demoImg from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../assets/images/like-icon/like-icon-on.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import commentIcon from '../assets/images/album/chat-icon.svg';
import shareIcon from '../assets/images/album/share-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import issueIcon from '../assets/images/icon/issue-opened.svg';

import persona01 from '../assets/images/evaluation/persona-all-bg.png';
import persona02 from '../assets/images/evaluation/persona-user01.png';
import persona03 from '../assets/images/evaluation/persona-user02.png';
import persona04 from '../assets/images/evaluation/persona-user03.png';

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
import { incrementPlayCount } from '../api/incrementPlayCount';
import { getSongsGradeIcon } from '../utils/getGradeIcon';
import AlbumItem from '../components/unit/AlbumItem';
import IntroLogo3 from '../components/IntroLogo3';

import { WalletConnect } from '../components/WalletConnect';
// import SongReleaseModal from '../components/SongReleaseModal';
import SongDeleteAndReleaseModal from '../components/SongDeleteAndReleaseModal';
import AlbumGuideModal from '../components/AlbumGuideModal';
import NftConfirmModal from '../components/NftConfirmModal';
import EvaluationResults from './EvaluationResults';
import TransactionsModal from '../components/TransactionsModal';

const serviceCategory = [
  {
    service: 'AI Lyrics & Songwriting',
    preparing: false,
  },
  {
    service: 'AI Singing Evaluation',
    preparing: false,
  },
  {
    service: 'AI Cover Creation',
    preparing: true,
  },
];

function AlbumDetail() {
  const { t } = useTranslation('song_detail');

  const serverApi = process.env.REACT_APP_SERVER_API;
  const { id } = useParams();
  const { token, walletAddress, isLoggedIn } = useContext(AuthContext);
  const listenTime = useRef(0);
  const navigate = useNavigate();
  const walletConnectRef = React.useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const service = searchParams.get('service') || 'AI Lyrics & Songwriting';
  const critic = searchParams.get('critic') || 'Jinwoo Yoo';

  // 앨범 상세 정보 상태 및 로딩 상태
  const [album, setAlbum] = useState(null);
  const [albumDuration, setAlbumDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 리더보드, Your Picks, Similar Vibes 관련 상태
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [favoriteGenreList, setFavoriteGenreList] = useState([]);
  const [similarVibesList, setSimilarVibesList] = useState([]);

  // 모달 관련 상태
  const [isPreparingModal, setPreparingModal] = useState(false);
  const [isShareModal, setShareModal] = useState(false);
  const [isReleaseModal, setIsReleaseModal] = useState(false);
  const [albumGuideModal, setAlbumGuideModal] = useState(false);
  const [isTransactionsModal, setIsTransactionsModal] = useState(false);
  // 플레이어 상태 및 재생 관련 변수
  const [isPlaying, setIsPlaying] = useState(false);
  const playCountRef = useRef(false);
  const [prevTime, setPrevTime] = useState(0);

  // NFT 액션 정의
  const [nftAction, setNftAction] = useState('');

  // 댓글 영역 스크롤 이동을 위한 ref
  const commentRef = useRef(null);

  // 진행바 스크롤 이동 핸들러
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

  // 스와이퍼 옵션
  const swiperOptions = {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 8,
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
      1250: {
        slidesPerView: 3,
      },
    },
  };

  // 초기 앨범 상세 정보 가져오기 함수 (초기 로딩 및 사용자 명시 업데이트)
  const fetchAlbumDetail = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response = await axios.get(
        `${serverApi}/api/music/${id}?wallet_address=${walletAddress?.address}`
      );
      setAlbum(response.data);
      // 앨범 재생 시간 계산
      const audio = new Audio(response?.data?.music_url);
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        setAlbumDuration(duration);
      });
      console.log('album', response.data);
    } catch (error) {
      console.error('앨범 상세 정보 가져오기 에러:', error);
    }
    if (showLoading) setIsLoading(false);
  };

  // 리더보드 데이터 가져오기
  const getLeaderboardData = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/leader/board/rank`);
      // console.log('플레 데터 확인용 : :', res.data);
      setLeaderBoardData(res.data);
    } catch (error) {
      console.error('getLeaderboardData error:', error);
    }
  };

  // Your Picks 데이터 가져오기
  const getFavoriteGenre = async () => {
    try {
      const res = await axios.get(
        `${serverApi}/api/music/recommended/list?wallet_address=${walletAddress?.address}`
      );
      setFavoriteGenreList(res.data);
    } catch (error) {
      console.error('getFavoriteGenre error:', error);
    }
  };

  // Similar Vibes 데이터 가져오기
  const getSimilarVibes = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/${id}/content/link/list`);
      setSimilarVibesList(res.data);
    } catch (error) {
      console.error('getSimilarVibes error:', error);
    }
  };

  // 플레이 카운트 업데이트를 위한 전용 함수
  // 전체 앨범 데이터를 다시 불러오지 않고, play_cnt 값만 직접 업데이트합니다.
  const updatePlayCount = async () => {
    try {
      await incrementPlayCount(album?.id, serverApi);
      setAlbum(prev => (prev ? { ...prev, play_cnt: (prev.play_cnt || 0) + 1 } : prev));
    } catch (error) {
      console.error('플레이 카운트 업데이트 에러:', error);
    }
  };

  // // onListen 이벤트 핸들러 (재생 시간이 90초 이상일 때 플레이 카운트 업데이트)
  // const handleListen = async (e) => {
  //     const currentTime = e.target.currentTime;
  //     // 리와인드 시 플래그 초기화
  //     if (currentTime < prevTime) {
  //         playCountRef.current = false;
  //     }
  //     setPrevTime(currentTime);
  //     // 재생 시간이 90초 이상이고 아직 업데이트하지 않은 경우
  //     if (!playCountRef.current && currentTime >= 90) {
  //         await updatePlayCount();
  //         playCountRef.current = true;
  //     }
  // };

  // 좋아요 핸들러
  const handleLike = async () => {
    try {
      if (album?.is_like) {
        await cancelLikeAlbum(id, token);
        setAlbum(prev => ({
          ...prev,
          like: Math.max(0, --prev.like),
          is_like: !prev.is_like,
        }));
      } else {
        await likeAlbum(id, token);
        setAlbum(prev => ({
          ...prev,
          like: Math.max(0, ++prev.like),
          is_like: !prev.is_like,
        }));
      }
      // 좋아요 후 전체 데이터를 다시 불러오는 대신 필요 시 play_cnt, like 등의 값만 업데이트하거나 fetchAlbumDetail 호출
    } catch (error) {
      console.error('좋아요 처리 에러:', error);
    }
  };

  // 진행바 혹은 이미지 클릭 시 활성화 상태 관리
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    // URL 의 :id 파라미터가 변하면 isActive 초기화
    setIsActive(false);
  }, [id]);
  const handleClick = () => {
    if (album?.ai_service == 0) return;
    setIsActive(prev => !prev);
  };

  useEffect(() => {
    listenTime.current = 0;
    setIsPlaying(false);
    fetchAlbumDetail();
    getLeaderboardData();
    getFavoriteGenre();
    getSimilarVibes();
    // walletAddress나 id가 변경될 때마다 데이터를 업데이트합니다.
  }, [id, walletAddress, token, serverApi]);

  // 앨범 데이터가 로드되면 자동 재생
  useEffect(() => {
    if (album?.music_url) {
      // 약간의 지연 후 재생 시작 (UI가 완전히 로드된 후)
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [album]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        ++listenTime.current;
        if (listenTime.current === 90) updatePlayCount();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  // 가사 출력 전 텍스트 포맷 함수
  const formatTime = time => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 태그 문자열 파싱
  const tagString = album?.tags;
  const tagArray = tagString
    ? tagString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    : [];

  const { setIsLoggedIn, setWalletAddress } = useContext(AuthContext);

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = (e, action) => {
    if (!isLoggedIn) {
      e.preventDefault();

      // 로그인이 필요한 경우 WalletConnect 모달 열기
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          walletConnectButton.click();
        }
      }
      return;
    }

    // 로그인된 경우 원래 동작 실행
    switch (action) {
      case 'release':
        setIsReleaseModal(true);
        break;
      case 'sell':
        navigate(`/nft/sell/details/${album?.id}/${album?.nft_id}`);
        break;
      case 'cancel':
        navigate(`/nft/detail/${album?.nft_id}`);
        break;
      // case 'mint':
      //   setNftAction(action);
      //   break;
      // case 'buy':
      //   navigate(`/mint/detail/${album?.id}/${album?.nft_id}/buy`);
      //   break;
      default:
        setNftAction(action);
        break;
    }
  };

  const handleRelease = async () => {
    const res = await axios.post(`${serverApi}/api/music/${id}/release`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // useEffect를 사용하여 ThirdWeb 버튼을 참조
  useEffect(() => {
    // 컴포넌트가 마운트된 후에 참조할 수 있도록 약간의 지연 추가
    const timer = setTimeout(() => {
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          // 버튼 스타일 설정
          walletConnectButton.style.position = 'absolute';
          walletConnectButton.style.opacity = '0';
          walletConnectButton.style.pointerEvents = 'none';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  // 버전이름 변환
  let create_version = '';
  switch (album?.ai_model) {
    case 'topmediai':
      create_version = 'L&S One (V1.0)';
      break;
    case 'mureka-5.5':
      create_version = 'L&S Pro (V2.0)';
      break;
    case 'mureka-6':
      create_version = 'L&S Pro (V2.0)';
      break;
    case 'V3.5':
      create_version = 'L&S Plus (V2.2)';
      break;
    case 'V4':
      create_version = 'L&S Plus (V2.2)';
      break;
    case 'V4_5':
      create_version = 'L&S Plus (V2.2)';
      break;
    default:
      create_version = 'L&S One (V1.0)';
      break;
  }

  const personas = [
    // { img: persona01, name: 'All' },
    { img: persona02, name: 'Jinwoo Yoo' },
    { img: persona03, name: 'Drexx' },
    { img: persona04, name: 'Elara Moon' },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  // transactions modal 오픈
  const handleTransactionsModal = () => {
    setIsTransactionsModal(true);
  };
  return (
    <>
      {isLoading && <IntroLogo3 />}

      {/* 숨겨진 WalletConnect 컴포넌트 */}
      <div
        ref={walletConnectRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          visibility: 'hidden',
        }}
      >
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      <div className="song-detail">
        <dl className="album-detail__title">
          <dt>{t('Song Details')}</dt>
        </dl>
        <section className="album-detail__song-detail">
          <div className="album-detail__song-detail__title-box">
            {/* <p className="album-detail__song-detail__title">Song Details</p> */}
            {/* <p className="album-detail__song-detail__right__version">{create_version}</p> */}
          </div>
          <div className="album-detail__song-detail__bot">
            <div className="album-detail__song-detail__left">
              <section className="album-detail__audio">
                <AudioPlayer
                  src={album?.music_url}
                  onPlay={() => {
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                  }}
                  // onListen={handleListen}
                  listenInterval={1000}
                  autoPlay={true}
                />
                <p className={`album-detail__audio__cover ${isPlaying ? 'playing' : 'paused'}`}>
                  <img
                    src={album?.cover_image?.replace('public', '400to400') || coverImg}
                    alt="album cover"
                  />
                </p>
              </section>
              <div
                className={`album-detail__song-detail__left__img ${isActive ? 'active' : ''}`}
                onClick={handleClick}
              >
                {album ? (
                  <img src={album?.cover_image || demoImg} alt="앨범 이미지" />
                ) : (
                  <div style={{ backgroundColor: 'black' }} />
                )}
                <div className="album-detail__song-detail__left__img__txt">
                  <pre>
                    {album?.lyrics
                      // 1. "###"와 그 이후 공백을 제거
                      ?.replace(/#\s*/g, '')
                      ?.replace(/###\s*/g, '')
                      // 2. "**"로 감싼 텍스트 제거 (필요 시 개행 처리 등 별도 조정 가능)
                      ?.replace(/(\*\*.*?\*\*)/g, '')
                      // 3. 대괄호([]) 안 텍스트 제거
                      ?.replace(/\[([^\]]+)\]/g, '')
                      // 4. 소괄호 안 텍스트 처리:
                      //    - (Verse 1), (Pre-Chorus) 등 키워드가 있으면 괄호를 제거하고 텍스트만 남김
                      //    - 그 외의 경우에는 내용 자체를 제거
                      ?.replace(/\(([^)]+)\)/g, (match, p1) => {
                        if (
                          /^(?:\d+\s*)?(?:Verse|Pre-Chorus|Chorus|Bridge|Hook|Outro|Intro)(?:\s*\d+)?$/i.test(
                            p1.trim()
                          )
                        ) {
                          return p1.trim();
                        }
                        return '';
                      })
                      // 5. "Verse", "Pre-Chorus", "Chorus", "Bridge" 등 앞에 줄바꿈과 띄어쓰기를 추가
                      ?.replace(
                        /((?:\d+\s*)?(?:Verse|Pre-Chorus|Chorus|Bridge|Hook|Outro|Intro)(?:\s*\d+)?)/gi,
                        '\n$1'
                      )
                      ?.trim()}
                  </pre>
                </div>
                <button className="album-detail__song-detail__left__img__lyrics-btn">
                  {t('Lyrics')}
                </button>
              </div>
              <div className="album-detail__song-detail__left__info">
                {/* <div className="album-detail__song-detail__left__info__number">
                      <p className="love" onClick={handleLike}>
                          <img src={album?.is_like ? halfHeartIcon : loveIcon} alt="love Icon" />
                          {album?.like || 0}
                      </p>
                      <p className="play">
                          <img src={playIcon} alt="play Icon" />
                          {album?.play_cnt || 0}
                      </p>
                      <p className="comment" onClick={handleScrollToComment}>
                          <img src={commentIcon} alt="comment Icon" />
                          {album?.comment_cnt || 0}
                      </p>
                    </div> */}
                {!setIsLoggedIn && (
                  <div className="album-detail__song-detail__left__info__number">
                    <p className="play">
                      <img src={playIcon} alt="play Icon" />
                      {album?.play_cnt || 0}
                    </p>
                    <p className="love" onClick={handleLike}>
                      <img src={album?.is_like ? halfHeartIcon : loveIcon} alt="love Icon" />
                      {album?.like || 0}
                    </p>
                    {/* <p className="comment" onClick={handleScrollToComment}>
                      <img src={commentIcon} alt="comment Icon" />
                      {album?.comment_cnt || 0}
                    </p> */}
                    {album?.rating && (
                      <p className={`nfts ${album?.rating}`}>
                        {getSongsGradeIcon(album?.rating) && (
                          <img src={getSongsGradeIcon(album?.rating)} alt={`${album?.rating}`} />
                        )}
                        {album?.is_nft && (
                          <>
                            <div className="nfts-section"></div>
                            <span className="nfts-text">NFT</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                )}
                {setIsLoggedIn && (
                  <div className="album-detail__song-detail__left__info__number">
                    <p className="play">
                      <img src={playIcon} alt="play Icon" />
                      {album?.play_cnt || 0}
                    </p>
                    <p className="love" onClick={handleLike}>
                      <img src={album?.is_like ? halfHeartIcon : loveIcon} alt="love Icon" />
                      {album?.like || 0}
                      {setIsLoggedIn && <WalletConnect onConnect={handleWalletConnect} />}
                    </p>
                    {/* <p className="comment" onClick={handleScrollToComment}>
                      <img src={commentIcon} alt="comment Icon" />
                      {album?.comment_cnt || 0}
                    </p> */}
                    {album?.rating && (
                      <p className={`nfts ${album?.rating}`}>
                        {getSongsGradeIcon(album?.rating) && (
                          <img src={getSongsGradeIcon(album?.rating)} alt={`${album?.rating}`} />
                        )}
                        {album?.is_nft && (
                          <>
                            <div className="nfts-section"></div>
                            <span className="nfts-text">NFT</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                )}
                <div className="album-detail__song-detail__left__info__btn-box">
                  <button
                    className="album-detail__song-detail__left__info__txid-btn"
                    onClick={handleTransactionsModal}
                  >
                    TXID
                  </button>
                  <button
                    className="album-detail__song-detail__left__info__share-btn"
                    onClick={() => setShareModal(true)}
                  >
                    <img src={shareIcon} alt="share Icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="album-detail__song-detail__right">
              <div className="album-detail__song-detail__right__box">
                <p className="album-detail__song-detail__right__title">{album?.title}</p>
                <p className="album-detail__song-detail__right__version">{create_version}</p>
              </div>
              <div className="album-detail__song-detail__right__type">
                {tagArray.map((type, index) => (
                  <div key={index} className="album-detail__song-detail__right__type__item">
                    {type}
                  </div>
                ))}
              </div>
              <div className="album-detail__song-detail__right__info-box">
                <dl>
                  <dt>{t('Type')}</dt>
                  <dd>{album?.ai_service == 0 ? 'BGM' : 'Song'}</dd>
                </dl>
                <dl>
                  <dt>{t('Genre')}</dt>
                  <dd>{album?.genre || '-'}</dd>
                </dl>
                {album?.ai_service != 0 && (
                  <dl>
                    <dt>{t('Gender')}</dt>
                    <dd>{album?.gender || '-'}</dd>
                  </dl>
                )}
                <dl>
                  <dt>{t('Musical Instrument')}</dt>
                  <dd>{album?.musical_instrument || '-'}</dd>
                </dl>
                <dl>
                  <dt>{t('Tempo')}</dt>
                  <dd>{album?.tempo || '-'}</dd>
                </dl>
                <dl>
                  <dt>{t('Detail')}</dt>
                  <dd>{album?.detail || '-'}</dd>
                </dl>
                <dl>
                  <dt>{t('Creation Date')}</dt>
                  <dd>
                    <span>{formatLocalTime(album?.create_dt)}</span>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('Song Length')}</dt>
                  <dd>{formatTime(albumDuration) || '-'}</dd>
                </dl>
                <dl className="artist">
                  <dt>{t('Artist')}</dt>
                  <dd>
                    <Link className="user" to={`/profile?username=${album?.name}`}>
                      <img src={album?.user_profile || defaultCoverImg} alt="user profile" />
                      {album?.name || '-'}
                    </Link>
                  </dd>
                </dl>
                {/* 공간차지용 */}
                {album?.ai_service == 0 && (
                  <dl style={{ visibility: 'hidden' }}>
                    <dt>{t('Blank')}</dt>
                    <dd>-</dd>
                  </dl>
                )}
                <div className="album-detail__control-guide">
                  <p className="album-detail__control-guide--text">{t('NFT Status')}</p>
                  <img
                    className="album-detail__control-guide--icon"
                    src={issueIcon}
                    alt="guide"
                    onClick={() => setAlbumGuideModal(true)}
                  />
                </div>
                {album?.is_owner && (
                  <>
                    <div className="album-detail__control-button-wraps">
                      <button
                        className="album-detail__control-button release-button"
                        onClick={e => handleButtonClick(e, 'release')}
                        disabled={album?.is_release}
                      >
                        {t('Release')}
                      </button>
                      <button
                        className="album-detail__control-button mint-button"
                        onClick={e => handleButtonClick(e, 'mint')}
                        disabled={album?.is_nft || !album?.is_release}
                      >
                        {t('Mint')}
                      </button>
                      <button
                        className="album-detail__control-button sell-button"
                        onClick={e => handleButtonClick(e, 'sell')}
                        disabled={
                          !album?.is_nft ||
                          !album?.is_release ||
                          album?.now_sales_status === 'Listed'
                        }
                      >
                        {t('Sell')}
                      </button>
                      <button
                        className="album-detail__control-button cancel-button"
                        onClick={e => handleButtonClick(e, 'cancel')}
                        disabled={
                          !album?.is_nft ||
                          !album?.is_release ||
                          album?.now_sales_status !== 'Listed'
                        }
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </>
                )}
                {!album?.is_owner && (
                  <button
                    className="album-detail__control-button buy-button"
                    disabled={
                      !album?.is_nft || !album?.is_release || album?.now_sales_status !== 'Listed'
                    }
                    onClick={e => handleButtonClick(e, 'buy')}
                  >
                    {t('Buy NFT')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="album__content-list__tab">
          {serviceCategory.map(item => (
            <button
              key={item.service}
              className={`album__content-list__tab__item ${
                service === item.service ? 'active' : ''
              }`}
              onClick={() => {
                if (item.preparing) {
                  setPreparingModal(true);
                  return;
                }
                setSearchParams({ service: item.service });
              }}
            >
              {t(item.service)}
            </button>
          ))}
        </section>

        {service === 'AI Lyrics & Songwriting' && (
          <>
            <section
              className={`album-detail__rank-table ${
                isLoggedIn ? 'is-logged-in' : 'not-logged-in'
              }`}
            >
              <div ref={commentRef}>
                <AdvancedCommentComponent id={id} />
              </div>
              <dl className="album-detail__rank-table__title">
                <dt>{t('Songs Leaderboard Rank')}</dt>
                <dd>{t('Most Plays')}</dd>
              </dl>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t('Artist')}</th>
                      <th>{t('Song Title')}</th>
                      <th>{t('Plays')}</th>
                      <th>{t('Likes')}</th>
                      <th>{t('Details')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderBoardData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td className="user-info">
                          <p>
                            <img src={item.user_profile || defaultCoverImg} alt="user profile" />
                            {item.name}
                          </p>
                        </td>
                        <td className="title">
                          <p></p>
                          {item.title}
                        </td>
                        <td>
                          {/* {formatLocalTime(item.create_dt)} */}
                          {item?.play_cnt}
                        </td>
                        <td>{item.like}</td>
                        <td>
                          <Link className="details-btn active" to={'/song-detail/' + item.id}>
                            {t('Details')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="album-detail__slide">
              <dl className="album-detail__slide__title">
                <dt>{t('Your Picks')}</dt>
                <dd>{t('Top tracks from your favorite genre.')}</dd>
              </dl>
              <div className="album-detail__slide__swiper">
                <Swiper {...swiperOptions} className="song-detail-slide">
                  {favoriteGenreList.map(track => (
                    <SwiperSlide key={track.id}>
                      <AlbumItem track={track} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>

            <section className="album-detail__slide">
              <dl className="album-detail__slide__title">
                <dt>{t('Similar Vibes')}</dt>
                <dd>{t('Top tracks from the same genre as this song.')}</dd>
              </dl>
              <div className="album-detail__slide__swiper">
                <Swiper {...swiperOptions} className="song-detail-slide">
                  {similarVibesList.map(track => (
                    <SwiperSlide key={track.id}>
                      <AlbumItem track={track} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          </>
        )}
        {service === 'AI Singing Evaluation' && (
          <>
            <article className="main__content-item__persona">
              {personas.map((persona, index) => (
                <div
                  key={index}
                  className={`main__content-item__persona__item ${
                    critic === persona.name ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSearchParams(prev => {
                      return { ...Object.fromEntries(prev), critic: persona.name };
                    });
                  }}
                >
                  <img src={persona.img} alt={persona.name} />
                  <p>{persona.name}</p>
                </div>
              ))}
            </article>
            <EvaluationResults />
          </>
        )}
      </div>
      {isShareModal && (
        <ShareModal
          setShareModal={setShareModal}
          shareUrl={window.location.href}
          title={album?.title}
        />
      )}
      {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      {isReleaseModal && (
        <SongDeleteAndReleaseModal
          songData={album}
          setter={setIsReleaseModal}
          releaseHandler={handleRelease}
          action={() => fetchAlbumDetail()}
        />
      )}
      {albumGuideModal && <AlbumGuideModal setAlbumGuideModal={setAlbumGuideModal} />}
      {nftAction && (
        <NftConfirmModal
          title="Confirm"
          setShowModal={setNftAction}
          confirmMintTxt={nftAction === 'mint'}
          confirmBuyTxt={nftAction === 'buy'}
          confirmSellTxt={nftAction === 'sell'}
          confirmCancelTxt={nftAction === 'cancel'}
          songId={album?.id}
          setShowSuccessModal={() => null}
          // onSuccess={() => {
          //   if (nftAction === 'buy') {
          //     navigate(`/my-page?category=NFTs&tab=History&page=1`);
          //   } else if (nftAction === 'mint') {
          //     fetchAlbumDetail();
          //   }
          // }}
          nftData={album}
        />
      )}
      {isTransactionsModal && (
        <TransactionsModal
          setTransactionsModal={setIsTransactionsModal}
          transactions={album?.transactions}
        />
      )}
    </>
  );
}

export default AlbumDetail;
