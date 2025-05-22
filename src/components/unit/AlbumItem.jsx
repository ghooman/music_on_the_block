// components/AlbumItem.jsx
import { Link } from 'react-router-dom';
import './AlbumItem.scss';

import loveIcon from '../../assets/images/album/love-icon.svg';
import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import playIcon from '../../assets/images/album/play-icon.svg';
import playIcon2 from '../../assets/images/play-icon2.svg';
import stopIcon from '../../assets/images/stop-icon.svg';
import defaultCoverImg from '../../assets/images/header/logo-png.png';
import coverImg10 from '../../assets/images/intro/intro-demo-img4.png';
import { useEffect, useState } from 'react';
import { getSongsGradeIcon } from '../../utils/getGradeIcon';
import { useTranslation } from 'react-i18next';

import { criticsDataForObject } from '../../data/criticsData';

const AlbumItem = ({
  track,
  isActive = false,
  currentTime,
  onClick,
  audioRef,
  formatTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`,
  type = 'song',
}) => {
  const { t } = useTranslation('module');
  const [runningTime, setRunningTime] = useState();

  useEffect(() => {
    if (!track) return;
    const audio = new Audio(track.music_url);

    const setting = () => {
      let time;
      time = audio.duration;
      setRunningTime(time);
    };
    audio.addEventListener('loadedmetadata', setting);
    return () => {
      audio.removeEventListener('loadedmetadata', setting);
    };
  }, [track]);

  const handleTogglePlay = e => {
    e.stopPropagation();

    const player = audioRef?.current?.audio?.current;
    if (!player) return;

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  if (!track) return;

  return (
    <button
      className={`album__content-list__list__item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="album__content-list__list__item__left">
        {isActive && (
          // <button className="album__content-list__list__item__left__play-btn">
          //     <img src={stopIcon} />
          // </button>

          <button
            className="album__content-list__list__item__left__play-btn"
            onClick={handleTogglePlay}
          >
            <img
              src={audioRef?.current?.audio?.current?.paused ? playIcon2 : stopIcon}
              alt="toggle play"
            />
          </button>
        )}
        <p
          className="album__content-list__list__item__left__img"
          style={{
            backgroundImage: `url(${
              track?.cover_image === 'string'
                ? coverImg10
                : track?.cover_image?.replace('public', '140to140')
            })`,
          }}
        ></p>
        <div className={`album__content-list__list__item__songs_grade ${track?.rating} `}>
          <img src={getSongsGradeIcon(track?.rating)} alt={`${track?.rating}`} />
          {track?.is_nft && (
            <>
              <div className="album__content-list__list__item__songs_grade--section"></div>
              <p className="album__content-list__list__item__songs_grade--nfts">NFT</p>
            </>
          )}
        </div>
        <span className="time">
          <strong>
            {isActive ? formatTime(currentTime) : runningTime && formatTime(runningTime)}
          </strong>
          {/* <strong>{runningTime && formatTime(runningTime)}</strong> */}
        </span>
      </div>
      <div className="album__content-list__list__item__right">
        {type === 'song' && (
          <>
            <SongTitle title={track?.title} />
            <Counts playCnt={track?.play_cnt} isLike={track?.is_like} like={track?.like} />
            <Profile userProfile={track?.user_profile} name={track?.name} />
            <SongDetailsButton id={track?.id} />
          </>
        )}
        {type === 'evaluation' && (
          <>
            <Critics critic="Jinwoo Yoo" />
            <SongTitle title={track?.title} />
            <Profile userProfile={track?.user_profile} name={track?.name} />
            <EvaluationScore score={track?.score} />
            <EvaluationDetailsButton id={track?.song_id} critic={track?.critic} />
          </>
        )}
      </div>
    </button>
  );
};

export default AlbumItem;

const SongTitle = ({ title }) => {
  return <p className="album__content-list__list__item__right__title">{title}</p>;
};

const Counts = ({ playCnt, isLike, like }) => {
  return (
    <div className="album__content-list__list__item__right__love-play">
      <p className="play">
        <img src={playIcon} alt="play" />
        {playCnt || 0}
      </p>
      <p className="love">
        <img src={isLike ? halfHeartIcon : loveIcon} alt="like" />
        {like || 0}
      </p>
    </div>
  );
};

const Profile = ({ userProfile, name }) => {
  return (
    <p className="album__content-list__list__item__right__user__info">
      <img src={userProfile || defaultCoverImg} alt="profile" />
      {name || 'unKnown'}
    </p>
  );
};

const SongDetailsButton = ({ id }) => {
  const { t } = useTranslation('module');
  return (
    <Link
      className="album__content-list__list__item__right__user__btn song"
      to={`/song-detail/${id}`}
    >
      {t('Details')}
    </Link>
  );
};

const EvaluationDetailsButton = ({ id, critic }) => {
  const { t } = useTranslation('module');
  return (
    <Link
      className="album__content-list__list__item__right__user__btn evaluation"
      to={`/song-detail/${id}?service=AI+Singing+Evaluation&critic=${critic}`}
    >
      {t('Details')}
    </Link>
  );
};

const Critics = ({ critic, evaluation_dt }) => {
  return (
    <div className="album__content-list__list__item__right__critic">
      <img src={criticsDataForObject[critic].image} alt="critic" />
      <p>1 minutes ago</p>
    </div>
  );
};

const EvaluationScore = ({ score = 0 }) => {
  return (
    <div className="album__content-list__list__item__right__evaluation-score">
      {score.toFixed(2)}
    </div>
  );
};
