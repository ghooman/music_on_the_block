import '../styles/Album.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import PreparingModal from '../components/PreparingModal';
// 스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { getHitMusicList } from '../api/HitMusicList';
import AlbumItem from '../components/unit/AlbumItem';
import PlayerHeader from '../components/PlayerHeader';
import IntroLogo2 from '../components/IntroLogo2';

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
        <List
          title="Total"
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
              onClick={() => setPreparingModal(true)}
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
            audioRef={audioRef}
          />
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
}) => {
  return (
    <section className="album__content-list">
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
        {data?.slice(0, 9).map((track, _, list) => (
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
        ))}
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
