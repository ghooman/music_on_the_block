import React, { useState, useRef } from 'react';
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
 * @param {boolean} releaseOption : 릴리즈 옵션
 * @param {function} handleDelete : 삭제 핸들러
 * @param {function} handleRelease : 릴리즈 핸들러
 * @returns
 */
const SongPlayTable = ({
    songList = [],
    deleteOption,
    releaseOption,
    handleDelete,
    handleRelease,
    activeSong,
    setActiveSong, // activeSong과 setActiveSong을 상위 컴포넌트에서 전달받습니다.
    audioRef,
    isScroll, // 페이지네이션 X 스크롤 옵션
}) => {
    // const [activeSong, setActiveSong] = useState(null);
    // const audioRef = useRef(null);

    // 테이블 행 클릭 시 해당 곡을 재생
    const handleRowClick = (album) => {
        if (!audioRef.current) {
            console.warn('Audio element is not available.');
            return;
        }

        if (activeSong === album.id) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
                setActiveSong(null);
            }
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setActiveSong(album.id);
            audioRef.current.src = album?.music_url;
            audioRef.current.play();
        }
    };

    return (
        <>
            <div className="audio-container">
                <audio controls ref={audioRef} />
            </div>

            <div className={`albums-table ${isScroll ? 'scroll' : ''}`}>
                <table>
                    <thead className={`${isScroll ? 'sticky' : ''}`}>
                        <tr>
                            <th>#</th>
                            <th className="albums-table__song">Song</th>
                            <th className="albums-table__type">Type</th>
                            <th>Artist</th>
                            <th className="albums-table__song-title">Song Title</th>
                            <th>Details</th>
                            {deleteOption && <th>Delete</th>}
                            {releaseOption && <th>Release</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {songList && songList.length > 0 && (
                            <>
                                {songList?.map((album, index) => (
                                    <tr
                                        key={album.id}
                                        className={activeSong === album.id ? 'active' : ''}
                                        onClick={() => handleRowClick(album)}
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
                                        <td>{album.title}</td>
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
