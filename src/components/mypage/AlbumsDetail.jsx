import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import SongPlayTable from '../unit/SongPlayTable';  // SongPlayTable 추가
import axios from 'axios';  // axios 임포트

// 이미지/아이콘들
import songImg from '../../assets/images/intro/intro-demo-img2.png';
import playIcon from '../../assets/images/play-icon2.svg';
import stopIcon from '../../assets/images/stop-icon.svg';
import editIcon from '../../assets/images/edit.svg';

import './AlbumsDetail.scss';
import track2 from '../../assets/music/MusicOnTheBlock_v1.mp3';
import track3 from '../../assets/music/nisoft_song.mp3';

// AI 관련 아이콘들
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// 더미 데이터
const dummySongsList = {
    data_list: [
        {
            id: 1,
            title: 'Song 1',
            name: 'Artist 1',
            album: 'Album 1',
            release_date: '2021-01-01',
            cover_image: songImg,
            music_url: track3,
        },
        {
            id: 2,
            title: 'Song 2',
            name: 'Artist 2',
            album: 'Album 2',
            release_date: '2021-02-01',
            cover_image: songImg,
            music_url: track2,
        },
        {
            id: 3,
            title: 'Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3',
            name: 'Artist 3',
            album: 'Album 3',
            release_date: '2021-03-01',
            cover_image: songImg,
            music_url: track3,
        },
    ],
    total_cnt: 3,
};

const AlbumsDetail = ({ token }) => {
    const audioRef = useRef(null);
    const [activeSong, setActiveSong] = useState(null); // activeSong 상태 관리

    const subCategoryList = [
        { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
        { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
        { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
    ];
    const [selected, setSelected] = useState(subCategoryList[0].name);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';
    const songsSort = searchParams.get('songs_sort');
    const releaseType = searchParams.get('release_type') || 'Unreleased songs';

    // 더미 데이터 사용 (API 호출 대신 더미 데이터)
    const songsList = dummySongsList;


    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
    if (!audioRef.current) return;

    /* Stop 누른 상태 */
    if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        setIsPlaying(false);
        setActiveSong(null);
        return;
    }

    /* Play 시작 */
    let currentIndex = 0;
    setActiveSong(songsList.data_list[currentIndex].id);
    setIsPlaying(true);

    audioRef.current.src = songsList.data_list[currentIndex].music_url;
    audioRef.current.play();

    audioRef.current.onended = () => {
        currentIndex += 1;
        if (currentIndex < songsList.data_list.length) {
        setActiveSong(songsList.data_list[currentIndex].id);
        audioRef.current.src = songsList.data_list[currentIndex].music_url;
        audioRef.current.play();
        } else {
        setIsPlaying(false);
        setActiveSong(null);
        }
    };
    };

    return (
        <div className="my-album-details">
            <p className="my-album-details__title">Album Details</p>
            <div className="my-album-details__box">
                <section className="my-album-details__box__header">
                    <article className="my-album-details__box__header__left">
                        <div className="my-album-details__box__header__left__img-box">
                            <img src={songImg} alt="cover-img" />
                        </div>
                    </article>
                    <article className="my-album-details__box__header__right">
                        <div className="my-album-details__box__header__right__box">
                            <p className="my-album-details__box__header__right__box__title">
                                <span>title texttitle texttitle texttitle texttitle text</span>
                                <button className="my-album-details__box__header__right__box__title__edit-btn">
                                    Edit Album
                                    <img src={editIcon} alt="edit-icon" />
                                </button>
                            </p>
                            <div className="my-album-details__box__header__right__box__list">
                                <div className="my-album-details__box__header__right__box__list__item">
                                    <p className="my-album-details__box__header__right__box__list__item__title">
                                        Artist
                                    </p>
                                    <p className="my-album-details__box__header__right__box__list__item__title-value">
                                        <img src={songImg} alt="user-img" className="user-img" />
                                        user name
                                    </p>
                                </div>
                                <div className="my-album-details__box__header__right__box__list__item">
                                    <p className="my-album-details__box__header__right__box__list__item__title">
                                        Songs
                                    </p>
                                    <p className="my-album-details__box__header__right__box__list__item__title-value">
                                        12
                                    </p>
                                </div>
                            </div>
                            {/* Play 버튼 */}
                            <button className="my-album-details__box__header__right__play-btn" onClick={handlePlayClick}>
                                <img
                                    src={isPlaying ? stopIcon : playIcon}
                                    alt={isPlaying ? 'stop-icon' : 'play-icon'}
                                />
                                {isPlaying ? ' Stop' : ' Play'}
                            </button>
                        </div>
                    </article>
                </section>
                <section className="my-album-details__box__body">
                    <ContentWrap title="Favorites" border={false}>
                        <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
                        <SongPlayTable
                            songList={songsList?.data_list}
                            // deleteOption={true}
                            // releaseOption={releaseType === 'Unreleased songs'}
                            activeSong={activeSong}  // 상위 컴포넌트에서 관리하는 activeSong 전달
                            setActiveSong={setActiveSong}  // 상위 컴포넌트에서 관리하는 setActiveSong 전달
                            audioRef={audioRef}  // audioRef 전달
                        />
                    </ContentWrap>
                </section>
            </div>
        </div>
    );
};

export default AlbumsDetail;
