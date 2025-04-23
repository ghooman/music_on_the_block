import React, { useState } from 'react';
import './MintDetailLeft.scss';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import heartIcon from '../../assets/images/like-icon/like-icon.svg';
import demoImg      from '../../assets/images/intro/intro-demo-img4.png';
import playIcon     from '../../assets/images/album/play-icon.svg';
import loveIcon     from '../../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../../assets/images/like-icon/like-icon-on.svg';


const MintDetailLeft = ({ album,track1}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isActive,  setIsActive]  = useState(false);


    return (
        <>
            <div className="album-detail__mint-detail__left">
                {/* 오디오 */}
                <section className="album-detail__audio">
                    <AudioPlayer
                        src={album?.music_url || track1}
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
                    <img src={album.cover_image} alt="album cover" />
                    </p>
                </section>

                {/* 커버 · 가사 */}
                <div
                    className={`album-detail__mint-detail__left__img ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                >
                    <img src={album.cover_image || demoImg} alt="cover" />
                    <div className="album-detail__mint-detail__left__img__txt">
                    <pre>
                        {album.lyrics
                        .replace(/#\s*/g, '')
                        .replace(/###\s*/g, '')
                        .replace(/(\*\*.*?\*\*)/g, '')
                        .replace(/\[([^\]]+)\]/g, '')
                        .replace(/\(([^)]+)\)/g, '')}
                    </pre>
                    </div>
                    <button className="album-detail__mint-detail__left__img__lyrics-btn">Lyrics</button>
                </div>

                {/* 플레이·좋아요 */}
                <div className="album-detail__mint-detail__left__info">
                    <div className="album-detail__mint-detail__left__info__number">
                    <p className="play"><img src={playIcon} alt="play" />{album.play_cnt}</p>
                    <p className="love"><img src={loveIcon} alt="love" />{album.like}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MintDetailLeft;
