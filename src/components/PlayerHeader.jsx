// PlayerHeader.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../contexts/AudioContext';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import MyAudioPlayer from '../components/MyAudioPlayer';
import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import likeIcon from '../assets/images/like-icon.svg';
import likeIconOn from '../assets/images/like-icon-on.svg';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import soundIcon from '../assets/images/sound-icon.svg';
import soundIconOff from '../assets/images/mingcute_volume-fill.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import './PlayerHeader.scss';

const PlayerHeader = () => {
  const { t } = useTranslation('module');
  const { token } = useContext(AuthContext);
  const {
    currentTrack,
    isPlaying,
    isScrolled,
    setIsScrolled,
    handleTimeUpdate,
    playNext,
    playPrevious,
    setIsPlaying,
    audioRef,
    setCurrentTrack,
    isMuted,
    toggleMute,
    handleGlobalLike,
  } = useAudio();
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 88);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  // 좋아요 클릭 핸들러
  const handleLikeClick = async track => {
    if (!track || !token) return;

    try {
      await handleGlobalLike(track.id, token);
    } catch (error) {
      console.error('PlayerHeader 좋아요 처리 에러:', error);
    }
  };

  // 트랙이 없으면 PlayerHeader를 숨김
  if (!currentTrack) {
    return null;
  }

  return (
    <div
      className={`main__header 
        ${currentTrack ? 'active' : ''} 
        ${isScrolled ? 'scrolled' : ''} 
        ${isPlaying ? 'playing' : 'no-playing'}`}
    >
      <div className="main__header__album-cover">
        <p
          className="main__header__album-cover__img"
          style={{
            backgroundImage: `url(${
              currentTrack?.cover_image === 'string'
                ? coverImg10
                : currentTrack?.cover_image?.replace('public', '140to140')
            })`,
          }}
        ></p>
        <p className="main__header__title">{currentTrack?.title || t('Select an Album')}</p>
      </div>
      <p className="main__header--mobile-title">
        {currentTrack?.title || t('Select an Album')}
        <span>
          <img src={currentTrack?.user_profile || defaultCoverImg} alt="user-profile" />
          {currentTrack?.name || 'unKnown'}
        </span>
      </p>
      <p className="main__header__like" onClick={() => handleLikeClick(currentTrack)}>
        <img src={currentTrack?.is_like ? likeIconOn : likeIcon} alt="like-heart-icon" />
      </p>
      <button
        className="main__header__sound-btn"
        onClick={toggleMute}
        onMouseEnter={() => setIsVolumeHovered(true)}
        onMouseLeave={() => setIsVolumeHovered(false)}
      >
        <img src={isMuted ? soundIconOff : soundIcon} alt="sound-icon" />
      </button>
      {/* <div className="main__header__cover-info">
        <div className="main__header__cover-info__love-play">
          <p className="play">
            <img src={playIcon} alt="play-icon" />
            {currentTrack?.play_cnt || 0}
          </p>
          <p className="love" onClick={() => handleLikeClick(currentTrack)}>
            <img src={currentTrack?.is_like ? halfHeartIcon : loveIcon} alt="like-heart-icon" />
            {currentTrack?.like || 0}
          </p>
          <p>|</p>
          <p className="name">
            <img src={currentTrack?.user_profile || defaultCoverImg} alt="user-profile" />
            {currentTrack?.name || 'unKnown'}
          </p>
        </div>
        <Link className="main__header__cover-info__btn" to={`/song-detail/${currentTrack?.id}`}>
          {t('Details')}
        </Link>
      </div> */}
      <MyAudioPlayer
        track={currentTrack}
        onTimeUpdate={handleTimeUpdate}
        onClickPrevious={playPrevious}
        onClickNext={playNext}
        getTracks={() => {}} // 전역에서 관리하므로 필요 시 별도 구현
        handleGetMusicList={() => {}} // 전역에서 관리하므로 필요 시 별도 구현
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        isVolumeHovered={isVolumeHovered}
        setIsVolumeHovered={setIsVolumeHovered}
      />
    </div>
  );
};

export default PlayerHeader;
