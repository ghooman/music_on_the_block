import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoneContent from './NoneContent';
import './AlbumsTable.scss';
import playIcon from '../../assets/images/play-icon2.svg';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import track3 from '../../assets/music/MusicOnTheBlock_v1.mp3';
import defaultImage from '../../assets/images/header/logo-png.png';

/**
 *
 * @param {Array} songList : 곡의 데이터 리스트입니다.
 * @param {boolean} deleteOption : 삭제 옵션
 * @param {function} handleDelete : 삭제 핸들러
 * @param {boolean} releaseOption : 릴리즈 옵션
 * @param {function} handleRelease : 릴리즈 핸들러
 * @param {boolean} mintOption : 민트 옵션
 * @param {function} handleMint : 민트 핸들러
 * @param {boolean} sellOption : 판매 옵션
 * @param {function} handleSell : 판매 핸들러
 * @param {boolean} likesOption : 좋아요 수 표시 여부
 * @param {boolean} playsOption : 플레이 수 표시 여부
 * @param {boolean} artistOption : 아티스트 표시 여부
 *
 * @param {boolean} isContinue : 자동 재생 여부
 * @param {boolean} isScroll : 스크롤옵션
 * @param {boolean} isTrigger : 자동 재생 트리거
 * @param {function} setIsTrigger : 자동 재생 트리거 핸들러
 * @returns
 */
const SongPlayTable = ({
    songList = [],
    //== 삭제
    deleteOption,
    handleDelete,
    //== 릴리즈
    releaseOption,
    handleRelease,
    //== 민트
    mintOption,
    handleMint,
    //== 셀
    sellOption,
    handleSell,
    //== 좋아요
    likesOption,
    //== 플레이
    playsOption,
    //== 아티스트
    artistOption = true,
    //== 그외 옵션
    isContinue = true,
    isScroll,
    isTrigger,
    setIsTrigger,
}) => {
    const [activeSong, setActiveSong] = useState(null);
    let triggerIndex = useRef(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!activeSong) {
            audioRef.current.pause();
        } else {
            audioRef.current.currentTime = 0;
            audioRef.current.src = activeSong?.music_url;
            audioRef.current.play();
        }
    }, [activeSong]);

    useEffect(() => {
        if (isTrigger === true) {
            setActiveSong(songList[0]);
        } else {
            setActiveSong(null);
        }
    }, [isTrigger]);

    console.log(songList, '송 리스트');

    return (
        <>
            <div className="audio-container">
                <audio
                    controls
                    ref={audioRef}
                    onEnded={() => {
                        if (isContinue) {
                            setActiveSong(
                                songList[++triggerIndex.current] ? songList[triggerIndex.current] : songList[0]
                            );
                        } else {
                            setActiveSong(null);
                        }
                    }}
                />
            </div>

            <div className={`albums-table ${isScroll ? 'scroll' : ''}`}>
                <table>
                    <thead className={`${isScroll ? 'sticky' : ''}`}>
                        <tr>
                            <th>#</th>
                            <th className="albums-table__song">Song</th>
                            <th className="albums-table__type">Type</th>
                            {artistOption && <th>Artist</th>}
                            <th className="albums-table__song-title">Song Title</th>
                            {playsOption && <th>Plays</th>}
                            {likesOption && <th>Likes</th>}
                            <th>Details</th>
                            {deleteOption && <th>Delete</th>}
                            {releaseOption && <th>Release</th>}
                            {mintOption && <th>NFT Mint</th>}
                            {sellOption && <th>Sell NFT</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {songList && songList.length > 0 && (
                            <>
                                {songList?.map((album, index) => (
                                    <tr
                                        key={album.id}
                                        className={activeSong?.id === album.id ? 'active' : ''}
                                        onClick={() => {
                                            if (activeSong?.id === album?.id) {
                                                setActiveSong(null);
                                            } else {
                                                setActiveSong(album);
                                                if (isTrigger && setIsTrigger) {
                                                    triggerIndex.current = index;
                                                }
                                            }
                                        }}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            <button className="albums-table__song-btn">
                                                <img src={album.cover_image} alt="images" />
                                                <div className="loading-wave">
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                </div>
                                            </button>
                                        </td>
                                        <td>
                                            <img src={songTypeIcon} />
                                        </td>
                                        {artistOption && (
                                            <td>
                                                <div className="albums-table__artist">
                                                    <img
                                                        className="albums-table__artist-img"
                                                        src={album.user_profule || defaultImage}
                                                        alt="profile"
                                                    />

                                                    {album.name}
                                                </div>
                                            </td>
                                        )}
                                        <td>{album.title}</td>
                                        {playsOption && <td>{album?.play_cnt?.toLocaleString()}</td>}
                                        {likesOption && <td>{album?.like?.toLocaleString()}</td>}
                                        <td>
                                            <div className="td-content">
                                                <Link
                                                    className="albums-table__detail-btn"
                                                    to={`/song-detail/${album.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </td>
                                        {deleteOption && handleDelete && (
                                            <td>
                                                <div className="td-content">
                                                    <button
                                                        className="albums-table__detail-btn delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(album);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                        {releaseOption && handleRelease && (
                                            <td>
                                                <div className="td-content">
                                                    <button
                                                        className="albums-table__detail-btn release"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRelease(album);
                                                        }}
                                                    >
                                                        Release
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                        {mintOption && handleMint && (
                                            <td>
                                                <div className="td-content">
                                                    <button
                                                        className="albums-table__detail-btn mint"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMint(album);
                                                        }}
                                                    >
                                                        Mint
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                        {sellOption && handleSell && (
                                            <td>
                                                <div className="td-content">
                                                    <button
                                                        className="albums-table__detail-btn sell"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSell(album);
                                                        }}
                                                    >
                                                        Sell
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
                {songList?.length === 0 && <NoneContent message={'There are no songs created yet.'} height={300} />}
            </div>
        </>
    );
};

export default SongPlayTable;
