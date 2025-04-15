// components/AlbumItem.jsx
import { Link } from 'react-router-dom';
import './AlbumItem.scss';

import loveIcon from '../../assets/images/album/love-icon.svg';
import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import playIcon from '../../assets/images/album/play-icon.svg';
import playIcon2 from '../../assets/images/play-icon2.svg';
import stopIcon from '../../assets/images/stop-icon.svg';
import defaultCoverImg from '../../assets/images/header/logo.svg';
import coverImg10 from '../../assets/images/intro/intro-demo-img4.png';
import { useEffect, useState } from 'react';

const AlbumItem = ({
    track,
    isActive = false,
    currentTime,
    onClick,
    audioRef,
    formatTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`,
}) => {
    const [runningTime, setRunningTime] = useState();

    useEffect(() => {
        if (!track) return;
        const audio = new Audio(track.music_url);
        audio.addEventListener('loadedmetadata', () => {
            let time;
            time = audio.duration;
            setRunningTime(time);
        });
    }, [track]);

    const handleTogglePlay = (e) => {
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
        <button className={`album__content-list__list__item ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className="album__content-list__list__item__left">
                {isActive && 
                    // <button className="album__content-list__list__item__left__play-btn">
                    //     <img src={stopIcon} />
                    // </button>

                    <button
                        className="album__content-list__list__item__left__play-btn"
                        onClick={handleTogglePlay}
                    >
                        <img
                            src={
                            audioRef?.current?.audio?.current?.paused
                                ? playIcon2
                                : stopIcon
                            }
                            alt="toggle play"
                        />
                    </button>
                }
                <p
                    className="album__content-list__list__item__left__img"
                    style={{
                        backgroundImage: `url(${track?.cover_image === 'string' ? coverImg10 : track?.cover_image})`,
                    }}
                ></p>
                <span className="time">
                    <strong>{isActive ? formatTime(currentTime) : runningTime && formatTime(runningTime)}</strong>
                    {/* <strong>{runningTime && formatTime(runningTime)}</strong> */}
                </span>
            </div>
            <div className="album__content-list__list__item__right">
                <p className="album__content-list__list__item__right__title">{track?.title}</p>
                <div className="album__content-list__list__item__right__love-play">
                    <p className="love">
                        <img src={track?.is_like ? halfHeartIcon : loveIcon} />
                        {track.like || 0}
                    </p>
                    <p className="play">
                        <img src={playIcon} />
                        {track?.play_cnt || 0}
                    </p>
                </div>
                <div className="album__content-list__list__item__right__user">
                    <p className="album__content-list__list__item__right__user__info">
                        <img src={track?.user_profile || defaultCoverImg} />
                        {track?.name || 'unKnown'}
                    </p>
                    <Link
                        className="album__content-list__list__item__right__user__btn"
                        to={`/song-detail/${track?.id}`}
                    >
                        Details
                    </Link>
                </div>
            </div>
        </button>
    );
};

export default AlbumItem;
