
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
import MintDetailSection from '../components/mint-nft-details/MintDetailSection';


// ──────────────── 더미 데이터 ────────────────
const album = {
    title:              'he dances through his masks like breathing - Yolkhead',
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


// Swiper 최소 옵션

// ────────────────────────────────
function MintNftSellDetail() {

    return (
        <>
            <div className="mint-detail">
                {/*  제목  */}
                <dl className="album-detail__title">
                    <dt>Mint Details</dt>
                    {/* <dd>Lyrics + Songwriting (Demo)</dd> */}
                </dl>
                <MintDetailSection
                    album={album}
                    tagArray={tagArray}
                    albumDuration={albumDuration}
                    track1={track1}
                />
            </div>

        </>
    );
}

export default MintNftSellDetail;
