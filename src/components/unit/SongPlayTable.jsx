import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import './AlbumsTable.scss';

import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import songImg from '../../assets/images/intro/intro-demo-img2.png';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import NoneContent from './NoneContent';
import track3 from "../../assets/music/MusicOnTheBlock_v1.mp3";

/**
 *
 * @param {Array} songList : 곡의 데이터 리스트입니다.
 * @param {Component} children : 페이지네이션을 넣는 것을 권장드립니다! (부모 컴포넌트에서 페이지네이션 조작을 위해)
 * @returns
 */

const SongPlayTable = ({
    songList = [],
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
                            <th className='albums-table__song'>Song</th>
                            <th className='albums-table__type'>Type</th>
                            <th>Artist</th>
                            <th className='albums-table__song-title'>Song Title</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songList && songList.length > 0 && (
                            <>
                                {songList?.map((album, index) => (
                                    <tr key={album.id}
                                        className={activeSong === album.id ? 'active' : ''}
                                        onClick={() => handleRowClick(album)}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            <button className='albums-table__song-btn'>
                                                <img src={songImg}/>
                                                <div className="loading-wave">
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                    <div className="loading-bar"></div>
                                                </div>
                                            </button>
                                        </td>
                                        <td><img src={songTypeIcon}/></td>
                                        <td>
                                            <div className='albums-table__artist'>
                                                <img src={songImg} className='albums-table__artist-img'/>{album.name}
                                            </div>
                                        </td>
                                        <td>{album.title}</td>
                                        <td>
                                            <div className="td-content">
                                                <Link
                                                    className="albums-table__detail-btn"
                                                    to={`/song-detail/${album.id}`}
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
                {songList?.length === 0 && <NoneContent message={'There are no songs created yet.'} height={300} />}
                {/* {songList?.length > 0 && (
                    <Pagination totalCount={totalCount} viewCount={viewCount} page={page} setPage={setPage} />
                )} */}
            </div>
        </>
    );
};

export default SongPlayTable;
