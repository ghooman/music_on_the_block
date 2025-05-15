import '../styles/Album.scss';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import persona01 from '../assets/images/evaluation/persona-all-bg.png';
import persona02 from '../assets/images/evaluation/persona-user01.png';
import persona03 from '../assets/images/evaluation/persona-user02.png';
import persona04 from '../assets/images/evaluation/persona-user03.png';
import PreparingModal from '../components/PreparingModal';

import axios from 'axios';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { getHitMusicList } from '../api/HitMusicList';
import AlbumItem from '../components/unit/AlbumItem';
import PlayerHeader from '../components/PlayerHeader';
import IntroLogo2 from '../components/IntroLogo2';

//스와이프
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { getTransaction } from '../api/Transaction';

const serverApi = process.env.REACT_APP_SERVER_API;

function Album() {
  const { token, walletAddress } = useContext(AuthContext);
  const [isPreparingModal, setPreparingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('AI Lyrics & Songwriting');
  const [isScrolled, setIsScrolled] = useState(false);

  // 노래플레이 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  // const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [totalList, setTotalList] = useState([]);
  const [hitList, setHitList] = useState([]);
  const [randomList, setRandomList] = useState([]);

  const [selectedList, setSelectedList] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [transaction, setTransaction] = useState(null); // 트랜잭션 상태 관리

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

  const handleTimeUpdate = time => {
    setCurrentTime(time);
  };

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

  // 아이템 클릭하여 음악 재생시 사용되는 함수입니다.
  // 카테고리 리스트와, id를 설정해야 재생시 나타나는 UI 중복 랜더링을 막을 수 있습니다.
  const handlePlay = ({ list, id, track }) => {
    setSelectedList(list);
    setSelectedId(id);
    setSelectedMusic(track);
  };

  // 다음 곡 재생 버튼 클릭 시
  const handleNext = () => {
    if (!selectedList || !selectedMusic || !selectedId) return;
    const index = selectedList.indexOf(selectedMusic);
    setSelectedMusic(selectedList[(index + 1) % selectedList.length]);
  };

  // 이전 곡 재생 버튼 클릭 시
  const handlePrev = () => {
    if (!selectedList || !selectedMusic || !selectedId) return;
    const index = selectedList.indexOf(selectedMusic);
    const prevIndex = (index - 1 + selectedList.length) % selectedList.length;
    setSelectedMusic(selectedList[prevIndex]);
  };

  // tracks 업데이트 후, 선택된 트랙이 없다면 첫 번째 트랙(인덱스 0)을 선택
  useEffect(() => {
    // 2초후 에 트랙이 없으면 첫 번째 트랙을 선택
    if (!totalList) return;
    const timer = setTimeout(() => {
      if (totalList.length > 0 && !selectedMusic) {
        handlePlay({ list: totalList, id: 'total', track: totalList[0] });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [totalList]);

  // 선택 음악 변경 시
  useEffect(() => {
    if (!selectedMusic) return;
    setIsPlaying(true);
    setCurrentTime(0);
  }, [selectedMusic]);

  // 월렛 어드레스 변경 시 (로그인 계정 변경 시)
  useEffect(() => {
    getTracks();
    handleGetMusicList();
    getRandomTracks();
  }, [walletAddress]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 88);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const audioRef = useRef(null); // 오디오 제어용 ref


  const personas = [
    { img: persona01, name: 'All' },
    { img: persona02, name: 'Jinwoo Yoo' },
    { img: persona03, name: 'Drexx' },
    { img: persona04, name: 'Elara Moon' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  
  const dummyData = [
    {
      id: 0,
      quote: `"A melancholic drift that lingers long after the final note."`,
      trackName: `Fading Light - Mina Velour`,
      artistName: `Mina Velour`,
      score: 87,
      grade: 'Silver',
    },
    {
      id: 1,
      quote: `"The rhythm felt like waves crashing in my chest. Powerful."`,
      trackName: `Ocean Pulse - Raye Nakamura`,
      artistName: `Raye Nakamura`,
      score: 92,
      grade: 'Gold',
    },
    {
      id: 2,
      quote: `"Creative, chaotic, and strangely captivating."`,
      trackName: `Color Spill - Drexx`,
      artistName: `Drexx`,
      score: 78,
      grade: 'Bronze',
    },
    {
      id: 3,
      quote: `"A clean composition with a haunting undertone. Very impressive."`,
      trackName: `Whispers in Bloom - Elara Moon`,
      artistName: `Elara Moon`,
      score: 95,
      grade: 'Gold',
    },
    {
      id: 4,
      quote: `"The hook is solid, but the middle section loses momentum."`,
      trackName: `Midway Collapse - Jinwoo Yoo`,
      artistName: `Jinwoo Yoo`,
      score: 70,
      grade: 'Bronze',
    },
    {
      id: 5,
      quote: `"This track almost made me feel something. Almost. That’s a masterpiece."`,
      trackName: `he dances through his masks like breathing - Yolkhead`,
      artistName: `Yolkhead`,
      score: 100,
      grade: 'Gold',
    },
    {
      id: 6,
      quote: `"Subtle, emotional, and immersive. A delicate journey."`,
      trackName: `Feather Skin - Aoi Ren`,
      artistName: `Aoi Ren`,
      score: 89,
      grade: 'Silver',
    },
    {
      id: 7,
      quote: `"There's a beauty in how the imperfections blend together."`,
      trackName: `Broken Lace - V!DA`,
      artistName: `V!DA`,
      score: 84,
      grade: 'Silver',
    },
    {
      id: 8,
      quote: `"Too polished. I miss the raw emotion."`,
      trackName: `Glass Sky - Lumen`,
      artistName: `Lumen`,
      score: 68,
      grade: 'Basic',
    },
    {
      id: 9,
      quote: `"The rhythm is clever, the harmony is brilliant. I’m impressed."`,
      trackName: `Fire Within - Leo.K`,
      artistName: `Leo.K`,
      score: 93,
      grade: 'Gold',
    },
  ];
  
  
  const [activeId, setActiveId] = useState(null);

  const handleToggle = (id) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const shuffledTotalList = useMemo(() => {
    return [...totalList].sort(() => Math.random() - 0.5);
  }, [totalList]); // totalList가 바뀔 때만 새로 셔플

  return (
    <>
      <div className="main">
        {/* <div
              className={`main__header 
              ${selectedMusic !== null ? 'active' : ''} 
              ${isScrolled ? 'scrolled' : ''} 
              ${isPlaying ? 'playing' : 'no-playing'}`}
          >
              <div className="main__header__album-cover">
                  <p
                      className="main__header__album-cover__img"
                      style={{
                          backgroundImage: `url(${
                              selectedMusic?.cover_image === 'string' ? coverImg10 : selectedMusic?.cover_image
                          })`,
                      }}
                  ></p>
                  <p className="main__header__title">{selectedMusic?.title || 'Select an Album'}</p>
              </div>
              <div className="main__header__cover-info">
                  <div className="main__header__cover-info__love-play">
                      <p className="love" onClick={() => handleLikeClick(selectedMusic)}>
                          <img src={selectedMusic?.is_like ? halfHeartIcon : loveIcon} alt="like-heart-icon" />
                          {selectedMusic?.like || 0}
                      </p>
                      <p className="play">
                          <img src={playIcon} alt="play-icon" />
                          {selectedMusic?.play_cnt || 0}
                      </p>
                      <p>|</p>
                      <p className="name">
                          <img src={selectedMusic?.user_profile || defaultCoverImg} />
                          {selectedMusic?.name || 'unKnown'}
                      </p>
                  </div>
                  <Link className="main__header__cover-info__btn" to={`/song-detail/${selectedMusic?.id}`}>
                      Details
                  </Link>
              </div>
              <MyAudioPlayer
                  track={selectedMusic}
                  onTimeUpdate={handleTimeUpdate}
                  // onClickPrevious={handleClickPrevious}
                  // onClickNext={handleClickNext}
                  onClickPrevious={handlePrev}
                  onClickNext={handleNext}
                  getTracks={getTracks}
                  handleGetMusicList={handleGetMusicList}
                  setIsPlaying={setIsPlaying}
                  audioRef={audioRef}
              />
          </div> */}
        <PlayerHeader
          selectedMusic={selectedMusic}
          isPlaying={isPlaying}
          isScrolled={isScrolled}
          handleTimeUpdate={handleTimeUpdate}
          handleLikeClick={handleLikeClick}
          handlePrev={handlePrev}
          handleNext={handleNext}
          getTracks={getTracks}
          handleGetMusicList={handleGetMusicList}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
        />
        <article className="album__content-list__tab">
          <button
            className={`album__content-list__tab__item ${
              activeTab === 'AI Lyrics & Songwriting' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('AI Lyrics & Songwriting')}
          >
            AI Lyrics & Songwriting
          </button>
          <button
            className={`album__content-list__tab__item ${
              activeTab === 'AI Singing Evaluation' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('AI Singing Evaluation')}
          >
            AI Singing Evaluation
          </button>
          <button
            className={`album__content-list__tab__item ${
              activeTab === 'AI Cover Creation' ? 'active' : ''
            }`}
            onClick={() => setPreparingModal(true)}
          >
            AI Cover Creation
          </button>
        </article>
        {activeTab === "AI Lyrics & Songwriting" && (
          <article className='main__content-item'>
            <List
              title="Latest"
              data={totalList}
              id="Latest"
              selectedMusic={selectedMusic}
              selectedId={selectedId}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
            />
            <List
              title="Total"
              data={shuffledTotalList}
              // data={[...totalList].sort(() => Math.random() - 0.5)} 
              id="total"
              selectedMusic={selectedMusic}
              selectedId={selectedId}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
            />
            <ListSlider
              hitMusicList={hitList}
              currentTime={currentTime}
              handleLikeClick={handleLikeClick}
              selectedMusic={selectedMusic}
              selectedId={selectedId}
              handlePlay={handlePlay}
              id="slide"
            />
            <section className="album__content-list">
              <List
                title="AI Lyrics & Songwriting"
                data={randomList}
                id="random"
                selectedMusic={selectedMusic}
                selectedId={selectedId}
                handlePlay={handlePlay}
                currentTime={currentTime}
                setPreparingModal={setPreparingModal}
                link="/song/list?songs=Latest"
              />
            </section>
          </article>
        )}

        {activeTab === "AI Singing Evaluation" && (
          <section className='main__content-item'>
            <article className='main__content-item__persona'>
              {personas.map((persona, index) => (
                <div
                  key={index}
                  className={`main__content-item__persona__item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={persona.img} alt={persona.name} />
                  <p>{persona.name}</p>
                </div>
              ))}
            </article>
            <article className="album__content-list">
              <p className="album__content-list__title">
                Evaluation Stage
                <Link
                  className="album__content-list__see-more-btn"
                  to='/'
                >
                  See More
                </Link>
              </p>
              <div className='album__content-list__evaluation-stage'>
                {/* <button className='album__content-list__evaluation-stage__item'>
                  <div className='album__content-list__evaluation-stage__item__thought'>
                    <p className='album__content-list__evaluation-stage__item__thought__play'>
                      <img src={coverImg10} alt='coverImg'/>
                    </p>
                    <p className='album__content-list__evaluation-stage__item__thought__txt'>
                      <img src={persona02} alt='Jinwoo-Yoo-img'/>
                      “This track almost made me feel something. Almost. That’s a masterpiece.”
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
                {dummyData.map(item => (
                  <button
                    key={item.id}
                    className={`album__content-list__evaluation-stage__item ${activeId === item.id ? 'music-play' : ''}`}
                    onClick={() => handleToggle(item.id)}
                  >
                    <div className='album__content-list__evaluation-stage__item__thought'>
                      <p className='album__content-list__evaluation-stage__item__thought__play'>
                        <img src={coverImg10} alt='coverImg' />
                        <div className="loading-wave">
                          <div className="loading-bar"></div>
                          <div className="loading-bar"></div>
                          <div className="loading-bar"></div>
                          <div className="loading-bar"></div>
                        </div>
                      </p>
                      <p className='album__content-list__evaluation-stage__item__thought__txt'>
                        <img src={persona02} alt='Jinwoo-Yoo-img' />
                        <span>{item.quote}</span>
                      </p>
                    </div>
                    <dl className='album__content-list__evaluation-stage__item__title'>
                      <dt>{item.trackName}</dt>
                      <dd>
                        <img src={defaultCoverImg} alt='user-name' />
                        {item.artistName}
                      </dd>
                    </dl>
                    <div className='album__content-list__evaluation-stage__item__details-number'>
                      <p className={`grade ${item.grade.toLowerCase()}`}>{item.score} </p>
                      <button className='details-btn'>Details</button>
                    </div>
                  </button>
                ))}
              </div>
            </article>
            <List
              title="Recently Rated"
              className="recently-rated"
              data={totalList}
              id="total"
              selectedMusic={selectedMusic}
              selectedId={selectedId}
              handlePlay={handlePlay}
              currentTime={currentTime}
              link="/song/list?songs=Latest"
              setPreparingModal={setPreparingModal}
              audioRef={audioRef}
            />
          </section>
        )}



        <section className="intro__number">
          <dl className="intro__number__title">
            <dt>Number of Artists</dt>
            <dd>
              <Counter targetNumber={transaction?.number_of_users} />
            </dd>
          </dl>
          <dl className="intro__number__title">
            <dt>Number of Songs</dt>
            <dd>
              <Counter targetNumber={transaction?.number_of_songs} />
            </dd>
          </dl>
          <dl className="intro__number__title">
            <dt>Transitions</dt>
            <dd>
              <Counter targetNumber={transaction?.transaction} />
            </dd>
          </dl>
        </section>

        {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      </div>
      <IntroLogo2 />
    </>
  );
}

export default Album;

const List = ({
  data,
  id,
  selectedMusic,
  selectedId,
  currentTime,
  handlePlay,
  title,
  setPreparingModal,
  link,
  audioRef,
  className
}) => {
    // 스와이퍼 옵션
    const swiperOptions = {
      loop: false,
      slidesPerView:'auto',
      spaceBetween: 16,
      grabCursor: true,
      pagination: {
        clickable: true,
      },
      FreeMode:true,
      navigation: true,
      modules: [FreeMode,Navigation],
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
          See More
        </Link>
      </p>

      <article className="album__content-list__list">
        <Swiper {...swiperOptions} className="song-detail-slide">
          {data?.slice(0, 9).map((track, _, list) => (
            <SwiperSlide key={track.id}>
              <AlbumItem
                key={track.id}
                track={track}
                isActive={`${selectedId}+${selectedMusic?.id}` === `${id}+${track.id}`}
                currentTime={currentTime}
                onClick={() => {
                  handlePlay({ list: list, track: track, id: id });
                }}
                audioRef={audioRef}
              />
            </SwiperSlide>
          ))}
            
        </Swiper>
        {/* {data?.slice(0, 9).map((track, _, list) => (
          <React.Fragment key={`${id}+${track.id}`}>
            <AlbumItem
              key={track.id}
              track={track}
              isActive={`${selectedId}+${selectedMusic?.id}` === `${id}+${track.id}`}
              currentTime={currentTime}
              onClick={() => {
                handlePlay({ list: list, track: track, id: id });
              }}
              audioRef={audioRef}
            />
          </React.Fragment>
        ))} */}
      </article>
    </section>
  );
};

const ListSlider = ({
  hitMusicList,
  selectedMusic,
  currentTime,
  handleLikeClick,
  handlePlay,
  selectedId,
  id,

  // \n
}) => {
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
        onSlideChange={swiper => handleSlideChange(swiper)}
      >
        {hitMusicList.map((track, index) => (
          <SwiperSlide
            key={track.id}
            className={`swiper-music-list__item ${
              selectedId + selectedMusic?.id === id + track?.id ? 'active' : ''
            }`}
            onClick={() => handlePlay({ track: track, id: id, list: hitMusicList })}
          >
            <div className="swiper-music-list__item__left">
              <div
                className="swiper-music-list__item__left__img"
                style={{
                  backgroundImage: `url(${
                    track.cover_image === 'string'
                      ? coverImg10
                      : track.cover_image.replace('public', '280to280')
                  })`,
                }}
              ></div>
              <span className="time">
                {`${selectedId}+${selectedMusic?.id}` === `${id}+${track.id}`
                  ? `${formatTime(currentTime)}`
                  : formatTime(track.duration)}
              </span>
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
                >
                  Details
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
