// PlayerHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import MyAudioPlayer from '../components/MyAudioPlayer';
import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import './PlayerHeader.scss';


const PlayerHeader = ({
  selectedMusic,
  isPlaying,
  isScrolled,
  handleTimeUpdate,
  handleLikeClick,
  handlePrev,
  handleNext,
  getTracks,
  handleGetMusicList,
  setIsPlaying,
  audioRef
}) => {
  return (
    <div
      className={`main__header 
        ${selectedMusic ? 'active' : ''} 
        ${isScrolled ? 'scrolled' : ''} 
        ${isPlaying ? 'playing' : 'no-playing'}`}
    >
      <div className="main__header__album-cover">
        <p
          className="main__header__album-cover__img"
          style={{
            backgroundImage: `url(${
              selectedMusic?.cover_image === 'string'
                ? coverImg10
                : selectedMusic?.cover_image
            })`,
          }}
        ></p>
        <p className="main__header__title">
          {selectedMusic?.title || 'Select an Album'}
        </p>
      </div>
      <div className="main__header__cover-info">
        <div className="main__header__cover-info__love-play">
          <p className="play">
            <img src={playIcon} alt="play-icon" />
            {selectedMusic?.play_cnt || 0}
          </p>
          <p className="love" onClick={() => handleLikeClick(selectedMusic)}>
            <img
              src={selectedMusic?.is_like ? halfHeartIcon : loveIcon}
              alt="like-heart-icon"
            />
            {selectedMusic?.like || 0}
          </p>
          <p>|</p>
          <p className="name">
            <img src={selectedMusic?.user_profile || defaultCoverImg} alt="user-profile" />
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
        onClickPrevious={handlePrev}
        onClickNext={handleNext}
        getTracks={getTracks}
        handleGetMusicList={handleGetMusicList}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
      />
    </div>
  );
};

export default PlayerHeader;
