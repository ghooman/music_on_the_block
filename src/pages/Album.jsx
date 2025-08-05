import '../styles/Album.scss';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserGradeSquareIcon } from '../utils/getGradeIcon';

import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import defaultCoverImg2 from '../assets/images/logo-png2.png';
import persona01 from '../assets/images/evaluation/persona-all-bg.png';
import songCreateImg from '../assets/images/album/music-icon.png';
import mainBannerImg1 from '../assets/images/album/main-banner-01.png';
import mainBannerImgMobile1 from '../assets/images/album/main-banner-01-mobile.png';
import artistSampleImg from '../assets/images/album/artist-sample.png';
import artistLevelIcon from '../assets/images/icons/artist-level-icon.svg';
import { FaArrowRight } from 'react-icons/fa';
import defaultAlbumImage from '../assets/images/album/album-cover.png';

import PreparingModal from '../components/PreparingModal';

import axios from 'axios';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { getHitMusicList } from '../api/HitMusicList';
import AlbumItem from '../components/unit/AlbumItem';
// import PlayerHeader from '../components/PlayerHeader';
import IntroLogo2 from '../components/IntroLogo2';
import NoneContent from '../components/unit/NoneContent';
import AlbumCollectionItems from '../components/mypage/albumsAndCollectionsComponents/AlbumCollectionItems';
import SearchBar from '../components/unit/SearchBar';

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
import GptErrorModal from '../components/GptErrorModal';

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

  // 추천 아티스트 상태
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  // 추천 앨범 상태
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);

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

      setHitList(res.data);
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

  console.log('앨범');

  const navigate = useNavigate();

  // search-bar : 타이핑 시 clear 버튼 노출, clear 버튼 클릭 시 setSearch 리셋
  const [keyword, setKeyword] = useState('');
  const handleChange = e => {
    setKeyword(e.target.value);
  };
  const handleClear = () => {
    setKeyword('');
  };

  // 추천 아티스트 슬라이더
  const artistSwiperRef = useRef(null);
  const [artistActiveIndex, setArtistActiveIndex] = useState(0);

  const handleArtistSlideChange = swiper => {
    setArtistActiveIndex(swiper.realIndex);
  };

  // 추천 아티스트 가져오는 API 함수
  const handleGetRecommendedArtist = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/recommend/artist`, null);
      setRecommendedArtists(res.data);
      console.log('추천 아티스트 가져오기 완료!', res.data);
    } catch (error) {
      console.error('추천 아티스트 가져오는 API 함수 error입니당', error);
    }
  };

  // 추천 앨범 가져오는 API 함수
  const handleGetRecommendedAlbum = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/recommend/bundle`, null);
      setRecommendedAlbums(res.data);
      console.log('추천 앨범 가져오기 완료!', res.data);
    } catch (error) {
      console.error('추천 앨범 가져오는 API 함수 error입니당', error);
    }
  };
  // 추천 리스트 새로고침!
  useEffect(() => {
    if (!token) return;
    handleGetRecommendedArtist();
    handleGetRecommendedAlbum();
  }, [token]);

  // 추천 앨범 리스트
  const handleNavigate = albumId => {
    navigate(`/albums-detail/${albumId}`);
  };

  return (
    <>
      <div className="main">
        <div className="banner-slider">
          <Swiper
            className="banner-slider__swiper"
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={true}
            pagination={{ clickable: true }}
          >
            <SwiperSlide>
              <div className="banner-slider__swiper-list" onClick={() => navigate('/create')}>
                <div className="banner-slider__swiper-content banner-slider__swiper-content__crafted">
                  <div className="swiper-context">
                    <h2 className="banner-slider__welcome-txt">
                      {t(`Welcome To Music On The Block!`)}
                    </h2>
                    <div className="banner-slider__welcome-desc">
                      <p className="desc-txt">
                        <span>{t('Your own')}</span>
                        <strong>{t('unique music,')}</strong>
                      </p>
                      <p className="desc-txt">
                        <span>{t('Created in no time')}</span>
                        <strong>{t('with a simple guide.')}</strong>
                      </p>
                    </div>
                    <p className="banner-slider__creattion-txt">
                      {t('Create Music')}
                      <FaArrowRight width={6} color="#fff" opacity={0.7} />
                    </p>
                  </div>
                  <img src={songCreateImg} alt="" className="banner-slider__music-icon" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="banner-slider__swiper-list">
                <div className="banner-slider__swiper-content">
                  <Link to="/vote-event" className='banner-slider__link'>
                    <picture className="banner-slider__picture">
                      <source media="(min-width: 481px)" srcset={mainBannerImg1} />
                      <source media="(max-width: 480px)" srcset={mainBannerImgMobile1} />
                      <img src={mainBannerImg1} alt="Main banner example" className='banner-slider__swiper-banner-img' />
                    </picture>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <SearchBar keyword={keyword} handleChange={handleChange} handleClear={handleClear} />

        <div className="main__content-item">
          {/* 인기 음악 */}
          <List
            title={t('Hit Music')}
            data={hitList}
            id="Latest"
            currentTrack={currentTrack}
            handlePlay={handlePlay}
            currentTime={currentTime}
            link="/song/list?songs_sort=Most+Played"
            setPreparingModal={setPreparingModal}
            audioRef={audioRef}
            noDataMessage="There are no songs."
            isTrackActive={isTrackActive}
          />

          {/* 추천 아티스트 캐러셀 */}
          <section className="artist-section">
            <h2 className="album__content-list__title">{t('Recommended Artists')}</h2>
            <div className="artist-slider-wrap">
              <Swiper
                modules={[Autoplay]}
                slidesPerView="auto"
                centeredSlides={true}
                loop={true}
                initialSlide={Math.floor(recommendedArtists.length / 2)}
                slidesPerGroup={1}
                resistanceRatio={0}
                longSwipesRatio={0.99}
                longSwipesMs={300}
                threshold={20}
                speed={400}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                // breakpoints={{
                //   1600: {
                //     slidesPerView: 9,
                //   },
                //   1360: {
                //     slidesPerView: 7,
                //   },
                //   768: {
                //     slidesPerView: 5,
                //   },
                //   480: {
                //     slidesPerView: 3,
                //   },
                //   0: {
                //     slidesPerView: 2,
                //   },
                // }}
                className="artist-slider"
              >
                {recommendedArtists.map((artist, idx) => (
                  <SwiperSlide key={idx}>
                    <figure
                      className={`artist-item ${
                        artistActiveIndex === idx % recommendedArtists.length ? 'is-active' : ''
                      }`}
                    >
                      <div className="artist-thumb">
                        {/* 선택한 아티스트의 페이지로 이동 */}
                        <Link to={`/profile?category=AI+Services&username=${artist.name}`}>
                          <img
                            src={artist.profile ? artist.profile : defaultCoverImg2}
                            alt={artist.name}
                          />
                        </Link>
                      </div>
                      <figcaption className="artist-info">
                        <h3 className="artist-name">
                          <span>{artist.name}</span>
                          <img
                            src={getUserGradeSquareIcon(artist?.user_rating)}
                            alt="Artist Level Icon"
                            className="artist-level"
                          />
                        </h3>
                        <p className="artist-meta">
                          <span>
                            Music
                            <small>{artist.total_songs}</small>
                          </span>
                          <span>
                            Follower
                            <small>{artist.followers}</small>
                          </span>
                        </p>
                      </figcaption>
                    </figure>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          {/* 추천 앨범 리스트 */}
          <section className="album-section">
            <h2 className="album__content-list__title">{t('Recommended Albums')}</h2>
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={16}
              grabCursor={true}
              loop={false}
              centeredSlides={false}
              className="recommended-albums-slider"
            >
              {recommendedAlbums.map(album => (
                <SwiperSlide key={album.id} className="recommended-albums-item">
                  <AlbumCollectionItems.Item
                    name={album.album_name}
                    artist={album.name}
                    count={album.song_cnt}
                    isOwner={album.is_owner}
                    coverImage={album.cover_image}
                    handleNavigate={() => handleNavigate(album.id)}
                    target="Collection"
                    translateFn={word => word}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </div>

        {/* NFT 마켓플레이스 */}
        <section className="main__nft-market">
          <Link to="/nft" className="main__nft-market__link">
            <span className="main__nft-market__link-text">{t('NFT Marketplace')}</span>
          </Link>
        </section>

        {/* 최신음악 */}
        {service === 'AI Lyrics & Songwriting' && (
          <article className="main__content-item">
            <List
              title={t('Latest')}
              data={totalList}
              id="Latest"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs_sort=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="There are no songs."
              isTrackActive={isTrackActive}
            />

            {/* 추천음악 */}
            <List
              title={t('Recommended Music')}
              data={randomList}
              id="Recommended"
              currentTrack={currentTrack}
              handlePlay={handlePlay}
              currentTime={currentTime}
              // ✅ songs_sort는 'Latest', 대신 랜덤 플래그를 따로 추가
              link="/song/list?songs_sort=Latest&from=RandomSection"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
              noDataMessage="There are no songs."
              isTrackActive={isTrackActive}
            />
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
            <article className="main__content-item__persona" ref={evaluationSectionRef}>
              {[{ name: 'All', image: persona01 }, ...criticsDataForArray].map((persona, index) => (
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
              ))}
            </article>

            <div className="album__content-list__evaluation-stage">
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

              <Link
                to="/evaluation-stage"
                className="album__content-list__evaluation-stage__view-all-btn"
              >
                {t('View all evaluations')}
              </Link>
            </div>
          </article>
        </section>

        {/* 이전 코드 */}
        {/* {service === 'AI Lyrics & Songwriting' && (
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

                  <Link
                    to="/evaluation-stage"
                    className="album__content-list__evaluation-stage__view-all-btn"
                  >
                    {t('View all evaluations')}
                  </Link>
                </div>
              </article>
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
        )} */}

        {/* {service === 'AI Singing Evaluation' && (
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
        )} */}

        {/* <section className="main__stats">
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
        </section> */}

        {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      </div>
      <IntroLogo2 autoClose={true} />
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

  console.log('리스트');
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

  console.log('리스트사이드바');
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
                <span className="time">{track?.ai_service === 1 ? 'Song' : 'BGM'}</span>
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
