import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import NoneContent from './NoneContent';

import './AlbumsTable.scss';

import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';

import track3 from '../../assets/music/MusicOnTheBlock_v1.mp3';

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
    // children
}) => {
    const [activeSong, setActiveSong] = useState(null);
    const audioRef = useRef(null);

    const handleRowClick = (album) => {
        // audioRef.current가 유효한지 먼저 체크
        if (!audioRef.current) {
            console.warn('Audio element is not available.');
            return;
        }

        if (activeSong === album.id) {
            // 이미 활성화된 행이면 재생 중인지 여부로 토글
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
                // 재생을 멈추면 activeSong을 초기화
                setActiveSong(null);
            }
        } else {
            // 다른 행 클릭 시 현재 오디오 정지 후 새 행 재생 시작
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
                <audio controls ref={audioRef} src={track3} />
            </div>
            <div className="albums-table">
                <table>
                    <thead>
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
                                                {/* <img src={album?.} className="albums-table__artist-img" /> */}
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
