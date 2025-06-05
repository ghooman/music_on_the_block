import '../styles/Album.scss';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import persona01 from '../assets/images/evaluation/persona-all-bg.png';
import songCreateIcon1 from '../assets/images/album/song-create-icon1.svg';
import songCreateIcon2 from '../assets/images/album/song-create-icon2.svg';
import songCreateIcon3 from '../assets/images/album/song-create-icon3.svg';

import PreparingModal from '../components/PreparingModal';

import axios from 'axios';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { getHitMusicList } from '../api/HitMusicList';
import AlbumItem from '../components/unit/AlbumItem';
// import PlayerHeader from '../components/PlayerHeader';
import IntroLogo2 from '../components/IntroLogo2';
import NoneContent from '../components/unit/NoneContent';

//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// 유틸 & API 통신 함수
import { getTransaction } from '../api/Transaction';
import { getSongsGradeIcon } from '../utils/getGradeIcon';
import CreateLoading from '../components/CreateLoading';
import { getEvaluationList } from '../api/evaluation/getList';

// 데이터
import { criticsDataForArray, criticsDataForObject } from '../data/criticsData';
import { disableEvaluation } from '../data/service';
import {
  EvaluationListItem,
  EvaluationListItemWrapper,
} from '../components/unit/EvaluationListItem';

const serverApi = process.env.REACT_APP_SERVER_API;

function Album() {
  const { t } = useTranslation('main');
  const evaluationSectionRef = useRef(null); // Add ref for evaluation section

  const [searchParams, setSearchParams] = useSearchParams();
  const { token, walletAddress } = useContext(AuthContext);
  const { currentTrack, currentTime, playTrack, isTrackActive, audioRef, togglePlayPause } =
    useAudio();

  const [isPreparingModal, setPreparingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('AI Lyrics & Songwriting');

  // 로컬 상태로 관리할 데이터들
  const [totalList, setTotalList] = useState([]);
  const [hitList, setHitList] = useState([]);
  const [randomList, setRandomList] = useState([]);
  const [evaluationListByHighScore, setEvaluationListByHighScore] = useState([]);
  const [evaluationListByLatest, setEvaluationListByLatest] = useState([]);
  const [showAllEvaluations, setShowAllEvaluations] = useState(false);

  const [transaction, setTransaction] = useState(null); // 트랜잭션 상태 관리

  const service = searchParams.get('service') || 'AI Lyrics & Songwriting';
  const critic = searchParams.get('critic') || 'All';

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await getTransaction(token);
        setTransaction(response.data);
        // console.log("트랜잭션 데이터:", response.data);
      } catch (error) {
        console.error('트랜잭션 가져오기 에러:', error);
      }
    };
    fetchTransaction();
  }, [token]);

  const handleLikeClick = async track => {
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

  const getTracks = async () => {
    try {
      const res = await axios.get(
        `${serverApi}/api/music/all/list?wallet_address=${walletAddress?.address}`
      );
      setTotalList(res.data.data_list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetMusicList = async () => {
    try {
      const res = await getHitMusicList(walletAddress);
      // 트랙마다 오디오 정보를 불러와 duration 설정
      const fetchedTracks = res.data;
      fetchedTracks.forEach((track, index) => {
        const audio = new Audio(track.music_url);
        audio.addEventListener('loadedmetadata', () => {
          fetchedTracks[index].duration = audio.duration;
          setHitList([...fetchedTracks]);
        });
      });
      setHitList(fetchedTracks);
    } catch (e) {
      console.error(e);
    }
  };

  const getRandomTracks = async () => {
    try {
      const res = await axios.get(
        `${serverApi}/api/music/all/list/random?wallet_address=${walletAddress?.address}`
      );
      setRandomList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getEvaluationData = async () => {
    try {
      const evaluationHigestScore = await getEvaluationList({ critic, sort_by: 'Highest Score' });
      const evaluationLatest = await getEvaluationList({ critic, sort_by: 'Latest' });
      setEvaluationListByHighScore(evaluationHigestScore.data?.data_list);
      setEvaluationListByLatest(evaluationLatest.data?.data_list);
    } catch (e) {
      console.error(e);
    }
  };

  // 전역 오디오 상태를 사용하는 handlePlay 함수
  const handlePlay = ({ list, id, track }) => {
    playTrack({
      track,
      playlist: list,
      playlistId: id,
    });
  };

  // tracks 업데이트 후, 선택된 트랙이 없다면 첫 번째 트랙(인덱스 0)을 선택
  useEffect(() => {
    // 2초후 에 트랙이 없으면 첫 번째 트랙을 선택
    if (!totalList) return;
    const timer = setTimeout(() => {
      if (totalList.length > 0 && !currentTrack) {
        handlePlay({ list: totalList, id: 'total', track: totalList[0] });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [totalList, currentTrack]);

  // 월렛 어드레스 변경 시 (로그인 계정 변경 시)
  useEffect(() => {
    getTracks();
    handleGetMusicList();
    getRandomTracks();
  }, [walletAddress]);

  // 심사위원 변경 시
  useEffect(() => {
    getEvaluationData();
  }, [critic]);

  const audioPlayer = audioRef?.current?.audio?.current;

  // 평가 노래 재생 함수
  const handlePlayEvaluation = item => {
    const evaluationPlaylistId = 'evaluation-high-score';
    const isCurrentlyActive = isTrackActive(item, evaluationPlaylistId);

    if (isCurrentlyActive) {
      togglePlayPause();
    } else {
      playTrack({
        track: item,
        playlist: evaluationListByHighScore,
        playlistId: evaluationPlaylistId,
      });
    }
  };

  return (
    <>
      <div className="main">
        <section className="main__to-day-header">
          <div className="main__to-day-header__song-create">
            <p className="main__to-day-header__song-create__title">
              {t('What shall we try today?')}
            </p>
            <div className="main__to-day-header__song-create-list">
              <Link to="/create" className="main__to-day-header__song-create-list__item">
                <p className="main__to-day-header__song-create-list__item__title">
                  {t('Create your own song')}
                  <br />
                  {t('very quickly')}
                </p>
                <img src={songCreateIcon1} alt="songCreateIcon1" />
              </Link>
              <Link to="/evaluation" className="main__to-day-header__song-create-list__item">
                <p className="main__to-day-header__song-create-list__item__title">
                  {t('Get your song')}
                  <br />
                  {t('evaluated')}
                </p>
                <img src={songCreateIcon2} alt="songCreateIcon2" />
              </Link>
              <Link
                onClick={() => setPreparingModal(true)}
                className="main__to-day-header__song-create-list__item"
              >
                <p className="main__to-day-header__song-create-list__item__title">
                  {t('Create a song')}
                  <br />
                  {t('with your own voice')}
                </p>
                <img src={songCreateIcon3} alt="songCreateIcon3" />
              </Link>
            </div>
          </div>
        </section>
        <article className="album__content-list__tab">
          <button
            className={`album__content-list__tab__item ${
              service === 'AI Lyrics & Songwriting' ? 'active' : ''
            }`}
            onClick={() => {
              setSearchParams({ service: 'AI Lyrics & Songwriting' });
            }}
          >
            {t('AI Lyrics & Songwriting')}
          </button>
          <button
            className={`album__content-list__tab__item ${
              service === 'AI Singing Evaluation' ? 'active' : ''
            }`}
            onClick={() => {
              if (disableEvaluation) {
                setPreparingModal(true);
                return;
              }

              setSearchParams({ service: 'AI Singing Evaluation', critic: 'All' });
            }}
          >
            {t('AI Singing Evaluation')}
          </button>
          <button
            className={`album__content-list__tab__item ${
              service === 'AI Cover Creation' ? 'active' : ''
            }`}
            onClick={() => setPreparingModal(true)}
          >
            {t('AI Cover Creation')}
          </button>
        </article>
        {service === 'AI Lyrics & Songwriting' && (
          <article className="main__content-item">
            <List
              title={t('Latest')}
              data={totalList}
              id="Latest"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="There are no songs."
              isTrackActive={isTrackActive}
            />
            {/* <List
              title={t('Total')}
              data={randomList}
              // data={[...totalList].sort(() => Math.random() - 0.5)}
              id="total"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="There are no songs."
              isTrackActive={isTrackActive}
            /> */}

            <section className="main__content-item">
              <article className="album__content-list">
                <p className="album__content-list__title">
                  {t('Evaluation Stage')}
                  <Link
                    className="album__content-list__see-more-btn"
                    to="/song/list?service=AI+Singing+Evaluation"
                  >
                    {t('See More')}
                  </Link>
                </p>
                <article
                  className="main__content-item__persona"
                  ref={evaluationSectionRef}
                  // style={{ scrollMarginTop: '-100px' }}
                >
                  {[{ name: 'All', image: persona01 }, ...criticsDataForArray].map(
                    (persona, index) => (
                      <div
                        key={index}
                        className={`main__content-item__persona__item ${
                          critic === persona?.name ? 'active' : ''
                        }`}
                        onClick={() =>
                          setSearchParams(prev => {
                            setShowAllEvaluations(false);
                            return { ...Object.fromEntries(prev), critic: persona.name };
                          })
                        }
                      >
                        <img src={persona.image} alt={persona.name} />
                        <p>{persona.name}</p>
                      </div>
                    )
                  )}
                </article>

                <div className="album__content-list__evaluation-stage">
                  {/* <button className='album__content-list__evaluation-stage__item'>
                  <div className='album__content-list__evaluation-stage__item__thought'>
                    <p className='album__content-list__evaluation-stage__item__thought__play'>
                      <img src={coverImg10} alt='coverImg'/>
                    </p>
                    <p className='album__content-list__evaluation-stage__item__thought__txt'>
                      <img src={persona02} alt='Jinwoo-Yoo-img'/>
                      "This track almost made me feel something. Almost. That's a masterpiece."
                    </p>
                  </div>
                  <dl className='album__content-list__evaluation-stage__item__title'>
                    <dt>he dances through his masks like breathing - Yolkhead</dt>
                    <dd><img src={defaultCoverImg} alt='user-name'/>Artist name</dd>
                  </dl>
                  <div className='album__content-list__evaluation-stage__item__details-number'>
                    <p className='basic'>100</p>
                    <button className='details-btn'>Details</button>
                  </div>
                </button> */}
                  {evaluationListByHighScore.length > 0 && (
                    <EvaluationListItemWrapper>
                      {(showAllEvaluations
                        ? evaluationListByHighScore
                        : evaluationListByHighScore.slice(0, 5)
                      ).map(item => (
                        <EvaluationListItem
                          key={item.id}
                          data={item}
                          selectedMusic={currentTrack}
                          player={audioPlayer}
                          handler={() => handlePlayEvaluation(item)}
                        />
                      ))}
                    </EvaluationListItemWrapper>
                  )}
                  {evaluationListByHighScore.length <= 0 && (
                    <NoneContent height={300} message="No evaluation history yet." />
                  )}

                  {/* {evaluationListByHighScore.length > 5 && (
                  <button 
                    className='album__content-list__evaluation-stage__view-all-btn'
                    onClick={() => {
                      setShowAllEvaluations(!showAllEvaluations);
                      if (showAllEvaluations) {
                        // When clicking "Show Less", scroll to the evaluation section with offset
                        setTimeout(() => {
                          evaluationSectionRef.current?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }, 100);
                      }
                    }}
                  >
                    {showAllEvaluations ? t('Show less') : t('View all evaluations')}
                  </button>
                )} */}

                  <Link
                    to="/evaluation-stage"
                    className="album__content-list__evaluation-stage__view-all-btn"
                  >
                    {t('View all evaluations')}
                  </Link>
                </div>
              </article>
              {/* <List
              title={t('Recently Rated')}
              className="recently-rated"
              data={evaluationListByLatest}
              id="evaluation-latest"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="No evaluation history yet."
              type="evaluation"
              isTrackActive={isTrackActive}
            /> */}
            </section>

            <section className="main__nft-market">
              <Link to="/nft" className="main__nft-market__link">
                <span className="main__nft-market__link-text">{t('NFT Marketplace')}</span>
              </Link>
            </section>

            <ListSlider
              hitMusicList={hitList}
              currentTime={currentTime}
              handleLikeClick={handleLikeClick}
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              id="slide"
              isTrackActive={isTrackActive}
            />
            <section className="album__content-list">
              <List
                title={t('AI Lyrics & Songwriting')}
                data={randomList}
                id="random"
                currentTrack={currentTrack}
                handlePlay={handlePlay}
                currentTime={currentTime}
                setPreparingModal={setPreparingModal}
                link="/song/list?songs=Latest"
                noDataMessage="There are no songs."
                isTrackActive={isTrackActive}
              />
            </section>
          </article>
        )}

        {service === 'AI Singing Evaluation' && (
          <section className="main__content-item">
            <article className="main__content-item__persona">
              {[{ name: 'All', image: persona01 }, ...criticsDataForArray].map((persona, index) => (
                <div
                  key={index}
                  className={`main__content-item__persona__item ${
                    critic === persona?.name ? 'active' : ''
                  }`}
                  onClick={() =>
                    setSearchParams(prev => {
                      return { ...Object.fromEntries(prev), critic: persona.name };
                    })
                  }
                >
                  <img src={persona.image} alt={persona.name} />
                  <p>{persona.name}</p>
                </div>
              ))}
            </article>
            <article className="album__content-list">
              <p className="album__content-list__title">
                {t('Evaluation Stage')}
                <Link
                  className="album__content-list__see-more-btn"
                  to="/song/list?service=AI+Singing+Evaluation"
                >
                  {t('See More')}
                </Link>
              </p>
              <div className="album__content-list__evaluation-stage">
                {evaluationListByHighScore.length > 0 && (
                  <EvaluationListItemWrapper>
                    {evaluationListByHighScore.map(item => (
                      <EvaluationListItem
                        key={item.id}
                        data={item}
                        selectedMusic={currentTrack}
                        player={audioPlayer}
                        handler={() => handlePlayEvaluation(item)}
                      />
                    ))}
                  </EvaluationListItemWrapper>
                )}
                {evaluationListByHighScore.length <= 0 && (
                  <NoneContent height={300} message="No evaluation history yet." />
                )}
              </div>
            </article>
            <List
              title={t('Recently Rated')}
              className="recently-rated"
              data={evaluationListByLatest}
              id="evaluation-latest"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="No evaluation history yet."
              type="evaluation"
              isTrackActive={isTrackActive}
            />
          </section>
        )}

        <section className="main__stats">
          <dl className="main__stats__title">
            <dt>{t('Number of Artists')}</dt>
            <dd>
              <Counter targetNumber={transaction?.number_of_users} />
            </dd>
          </dl>
          <dl className="main__stats__title">
            <dt>{t('Number of Songs')}</dt>
            <dd>
              <Counter targetNumber={transaction?.number_of_songs} />
            </dd>
          </dl>
          <dl className="main__stats__title">
            <dt>{t('Transactions')}</dt>
            <dd>
              <Counter targetNumber={transaction?.transaction} />
            </dd>
          </dl>
        </section>

        {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      </div>
      <IntroLogo2 />
      {/* <CreateLoading/> */}
    </>
  );
}

export default Album;

const List = ({
  data,
  id,
  currentTrack,
  currentTime,
  handlePlay,
  title,
  setPreparingModal,
  link,
  audioRef,
  className,
  noDataMessage,
  type,
  isTrackActive,
}) => {
  // 스와이퍼 옵션
  const { t } = useTranslation('main');

  const swiperOptions = {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 16,
    grabCursor: true,
    pagination: {
      clickable: true,
    },
    FreeMode: true,
    navigation: true,
    modules: [FreeMode, Navigation],
    // modules: [Pagination, Navigation, Autoplay],
    // breakpoints: {
    //   0: {
    //     slidesPerView: 1,
    //   },
    //   680: {
    //     slidesPerView: 2,
    //   },
    //   930: {
    //     slidesPerView: 3,
    //   },
    // },
  };
  return (
    <section className={`album__content-list ${className}`}>
      <p className="album__content-list__title">
        {title}
        <Link
          className="album__content-list__see-more-btn"
          to={link}
          onClick={e => {
            if (!link) {
              e.preventDefault();
              setPreparingModal(true);
            }
          }}
        >
          {t('See More')}
        </Link>
      </p>

      <article className="album__content-list__list">
        {data?.length <= 0 && <NoneContent message={noDataMessage} height={300} />}
        <Swiper {...swiperOptions} className="song-detail-slide">
          {data?.slice(0, 9).map((track, _, list) => (
            <SwiperSlide key={track.id}>
              <AlbumItem
                key={track.id}
                track={track}
                isActive={isTrackActive(track, id)}
                currentTime={currentTime}
                onClick={() => {
                  handlePlay({ list: list, track: track, id: id });
                }}
                audioRef={audioRef}
                type={type}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </article>
    </section>
  );
};

const ListSlider = ({
  hitMusicList,
  currentTrack,
  currentTime,
  handleLikeClick,
  handlePlay,
  id,
  isTrackActive,
}) => {
  const { t } = useTranslation('main');

  const swiperRef = useRef(null);

  const handleSlideChange = swiper => {
    const slides = swiper.slides;
    const activeIndex = swiper.activeIndex;
    const totalSlides = slides.length;

    slides.forEach((slide, index) => {
      slide.classList.remove('swiper-slide-next-next', 'swiper-slide-prev-prev');

      if (index === (activeIndex + 2) % totalSlides) {
        slide.classList.add('swiper-slide-next-next');
      }
      if (index === (activeIndex - 2 + totalSlides) % totalSlides) {
        slide.classList.add('swiper-slide-prev-prev');
      }
    });
  };

  const formatTime = time => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <section className="album__slide">
      <p className="album__slide__title">{t('Hit Music List')}</p>

      {hitMusicList?.length > 0 && (
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
          onSlideChange={swiper => handleSlideChange(swiper)}
        >
          {hitMusicList.map((track, index) => (
            <SwiperSlide
              key={track.id}
              className={`swiper-music-list__item ${isTrackActive(track, id) ? 'active' : ''}`}
              onClick={() => handlePlay({ track: track, id: id, list: hitMusicList })}
            >
              <div className="swiper-music-list__item__left">
                <div
                  className="swiper-music-list__item__left__img"
                  style={{
                    backgroundImage: `url(${
                      track.cover_image === 'string'
                        ? coverImg10
                        : track?.cover_image?.replace('public', '280to280')
                    })`,
                  }}
                ></div>
                <span className="time">
                  {isTrackActive(track, id)
                    ? `${formatTime(currentTime)}`
                    : formatTime(track.duration)}
                </span>
                <div className={`swiper-music-list__item__left__grade ${track.rating}`}>
                  <img
                    className="swiper-music-list__item__left__grade--image"
                    src={getSongsGradeIcon(track.rating)}
                    alt="icon"
                  />
                  {track?.is_nft && (
                    <>
                      <div className="swiper-music-list__item__left__grade--section"></div>
                      <p className="swiper-music-list__item__left__grade--nft">NFT</p>
                    </>
                  )}
                </div>
              </div>
              <div className="swiper-music-list__item__right">
                <p className="swiper-music-list__item__right__title">{track.title}</p>
                <div className="swiper-music-list__item__right__love-play">
                  <p className="play">
                    <img src={playIcon} alt="PlayIcon" />
                    {track?.play_cnt || 0}
                  </p>
                  <p className="love" onClick={() => handleLikeClick(track)}>
                    <img src={track.is_like ? halfHeartIcon : loveIcon} alt="LikeIcon" />
                    {track?.like || 0}
                  </p>
                </div>
                <div className="swiper-music-list__item__right__user">
                  <p className="swiper-music-list__item__right__user__info">
                    <img src={track?.user_profile || defaultCoverImg} alt="likeIcon" />
                    {track?.name || 'unKnown'}
                  </p>
                  <Link
                    className="swiper-music-list__item__right__user__btn"
                    to={'/song-detail/' + track.id}
                    onClick={e => e.stopPropagation()}
                  >
                    {t('Details')}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {hitMusicList?.length <= 0 && <NoneContent height={240} message="There are no songs." />}
    </section>
  );
};

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
