
import '../styles/MintNftSellDetail.scss';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// 이미지·아이콘 ------------------------------------------------------
import coverImg        from '../assets/images/black-img.jpg';
import demoImg         from '../assets/images/intro/intro-demo-img4.png';
import defaultCoverImg from '../assets/images/header/logo.svg';
import track1          from '../assets/music/song01.mp3';

import loveIcon        from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon   from '../assets/images/like-icon/like-icon-on.svg';
import playIcon        from '../assets/images/album/play-icon.svg';
import commentIcon     from '../assets/images/album/chat-icon.svg';
import shareIcon       from '../assets/images/album/share-icon.svg';


// ──────────────── 더미 데이터 ────────────────
const album = {
    title:              'Dummy Song',
    music_url:          track1,
    cover_image:        coverImg,
    detail:             'This is a dummy song for UI layout only.',
    language:           'English',
    genre:              'Pop',
    gender:             'Any',
    musical_instrument: 'Guitar',
    tempo:              '120 BPM',
    create_dt:          '2025‑04‑22',
    name:               'Dummy Artist',
    user_profile:       defaultCoverImg,
    play_cnt:           123,
    like:               45,
    comment_cnt:        6,
    lyrics:             `# Verse 1
    This is **dummy** lyrics.
    [Chorus] Sing along!`,
};

const tagArray          = ['Pop', 'Bright', 'Happy'];
const albumDuration     = '3:02';


// 날짜·시간 포맷터(더미)
const formatLocalTime = (v) => v;
const formatTime      = (v) => v;

// Swiper 최소 옵션

// ────────────────────────────────
function MintNftSellDetail() {
    const [isPlaying, setIsPlaying]           = useState(false);
    const [isActive,  setIsActive]            = useState(false);   // 가사 영역 토글

    return (
        <>
            <div className="mint-detail">
                {/*  제목  */}
                <dl className="album-detail__title">
                    <dt>Mint Details</dt>
                    {/* <dd>Lyrics + Songwriting (Demo)</dd> */}
                </dl>
                
                <section className="album-detail__mint-detail">
                    {/* <p className="album-detail__mint-detail__title">Song Details</p> */}
                    <div className="album-detail__mint-detail__bot">
                        {/*  왼쪽 영역  */}
                        <div className="album-detail__mint-detail__left">
                            {/*  오디오 플레이어  */}
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
                                    <img src={album.cover_image} alt="album cover" />
                                </p>
                            </section>
                            <div
                                className={`album-detail__mint-detail__left__img ${isActive ? 'active' : ''}`}
                                onClick={() => setIsActive(!isActive)}
                            >
                                <img src={album.cover_image || demoImg} alt="앨범 이미지" />
                                <div className="album-detail__mint-detail__left__img__txt">
                                    <pre>
                                        {album.lyrics
                                            .replace(/#\s*/g, '')
                                            .replace(/###\s*/g, '')
                                            .replace(/(\*\*.*?\*\*)/g, '')
                                            .replace(/\[([^\]]+)\]/g, '')
                                            .replace(/\(([^)]+)\)/g, '')
                                        }
                                    </pre>
                                </div>
                                <button className="album-detail__mint-detail__left__img__lyrics-btn">Lyrics</button>
                            </div>

                            {/*  재생·좋아요·댓글 + 공유  */}
                            <div className="album-detail__mint-detail__left__info">
                                <div className="album-detail__mint-detail__left__info__number">
                                    <p className="play">
                                    <img src={playIcon} alt="play Icon" />{album.play_cnt}
                                    </p>
                                    <p className="love" >
                                    <img src={loveIcon} alt="love Icon" />{album.like}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/*  오른쪽 정보 박스  */}
                        <div className="album-detail__mint-detail__right">
                            <p className="album-detail__mint-detail__right__title">{album.title}</p>

                            <div className="album-detail__mint-detail__right__type">
                                {tagArray.map((type) => (
                                <div key={type} className="album-detail__mint-detail__right__type__item">
                                    {type}
                                </div>
                                ))}
                            </div>

                            <div className="album-detail__mint-detail__right__info-box">
                                <dl><dt>Detail</dt>             <dd>{album.detail}</dd></dl>
                                <dl><dt>Language</dt>           <dd>{album.language}</dd></dl>
                                <dl><dt>Genre</dt>              <dd>{album.genre}</dd></dl>
                                <dl><dt>Gender</dt>             <dd>{album.gender}</dd></dl>
                                <dl><dt>Musical Instrument</dt> <dd>{album.musical_instrument}</dd></dl>
                                <dl><dt>Tempo</dt>              <dd>{album.tempo}</dd></dl>
                                <dl><dt>Creation Date</dt>      <dd><span>{formatLocalTime(album.create_dt)}</span></dd></dl>
                                <dl><dt>Song Length</dt>        <dd>{formatTime(albumDuration)}</dd></dl>
                                <dl className="artist">
                                <dt>Artist</dt>
                                <dd>
                                    <Link className="user" to="#">
                                    <img src={album.user_profile} alt="user profile" />
                                    {album.name}
                                    </Link>
                                </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
}

export default MintNftSellDetail;
