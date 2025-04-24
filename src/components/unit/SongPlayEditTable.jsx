// import React, { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import NoneContent from './NoneContent';
// import './AlbumsTable.scss';
// import playIcon from '../../assets/images/play-icon2.svg';
// import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
// import track3 from '../../assets/music/MusicOnTheBlock_v1.mp3';

// /**
//  *
//  * @param {Array} songList : 곡의 데이터 리스트입니다.

//  * @returns
//  */
// const SongPlayEditTable = ({
//     songList = [],

//     activeSong,
//     setActiveSong,  // activeSong과 setActiveSong을 상위 컴포넌트에서 전달받습니다.
//     audioRef,
// }) => {

//     // const [activeSong, setActiveSong] = useState(null);
//     // const audioRef = useRef(null);

//     // 테이블 행 클릭 시 해당 곡을 재생
//     const handleRowClick = (album) => {
//         if (!audioRef.current) {
//             console.warn('Audio element is not available.');
//             return;
//         }

//         if (activeSong === album.id) {
//             if (audioRef.current.paused) {
//                 audioRef.current.play();
//             } else {
//                 audioRef.current.pause();
//                 setActiveSong(null);
//             }
//         } else {
//             audioRef.current.pause();
//             audioRef.current.currentTime = 0;
//             setActiveSong(album.id);
//             audioRef.current.src = album?.music_url;
//             audioRef.current.play();
//         }
//     };

//     return (
//         <>
//             <div className="audio-container">
//                 <audio controls ref={audioRef} />
//             </div>

//             <div className="albums-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th className="albums-table__song">Song</th>
//                             <th className="albums-table__type">Type</th>
//                             <th>Artist</th>
//                             <th className="albums-table__song-title">Song Title</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {songList && songList.length > 0 && (
//                             <>
//                                 {songList?.map((album, index) => (
//                                     <tr
//                                         key={album.id}
//                                         className={activeSong === album.id ? 'active' : ''}
//                                         onClick={() => handleRowClick(album)}
//                                     >
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <button className="albums-table__song-btn">
//                                                 <img src={album.cover_image} alt="images" />
//                                                 <div className="loading-wave">
//                                                     <div className="loading-bar"></div>
//                                                     <div className="loading-bar"></div>
//                                                     <div className="loading-bar"></div>
//                                                     <div className="loading-bar"></div>
//                                                 </div>
//                                             </button>
//                                         </td>
//                                         <td>
//                                             <img src={songTypeIcon} />
//                                         </td>
//                                         <td>
//                                             <div className="albums-table__artist">
//                                                 {album.name}
//                                             </div>
//                                         </td>
//                                         <td>{album.title}</td>
//                                     </tr>
//                                 ))}
//                             </>
//                         )}
//                     </tbody>
//                 </table>
//                 {songList?.length === 0 && <NoneContent message={'There are no songs created yet.'} height={300} />}
//             </div>
//         </>
//     );
// };

// export default SongPlayEditTable;

import React, { useEffect, useState, useRef } from 'react';
import NoneContent from './NoneContent';
import './SongPlayEditTable.scss';
import './AlbumsTable.scss';
import defaultUserImage from '../../assets/images/header/logo-png.png';

/**
 * SongPlayEditTable
 * @param {Array}                             songList       곡 데이터
 * @param {number|null}                       activeSong     현재 재생 중인 곡 ID
 * @param {React.Dispatch<React.SetStateAction<number|null>>} setActiveSong
 * @param {React.RefObject<HTMLAudioElement>} audioRef
 */
const SongPlayEditTable = ({ title, songList = [], setSongList, activeSong, setActiveSong }) => {
  /* ---------- 선택 체크박스 ---------- */
  // const [selectedIds, setSelectedIds] = useState([]);

  // const allSelected = songList?.length > 0 && selectedIds?.length === songList?.length;

  // const handleSelectAll = (e) => {
  //     setSelectedIds(e.target?.checked ? songList.map((s) => s.id) : []);
  // };

  // const handleSelectOne = (id) => {
  //     setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  // };

  // const handleSelectAll = (e) => {
  //     setSelectedIds(e.target?.checked ? songList.map((s) => s.id) : []);
  // };

  const allCheck = songList?.length > 0 && songList?.every(item => item.check);

  const handleSelectAll = e => {
    setSongList(prev => {
      const copy = [...prev];
      return copy.map(item => ({ ...item, check: !allCheck }));
    });
  };

  const handleSelectOne = (id, check) => {
    setSongList(prev => {
      const copy = [...prev];
      return copy.map(item => {
        if (item.id === id) {
          return { ...item, check: check ? false : true };
        }
        return { ...item };
      });
    });
  };

  // /* ---------- 재생 ---------- */
  // const handleRowClick = (album) => {
  //     if (!audioRef.current) return;

  //     if (activeSong === album.id) {
  //         audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
  //         setActiveSong(audioRef.current.paused ? null : album.id);
  //     } else {
  //         audioRef.current.pause();
  //         audioRef.current.currentTime = 0;
  //         audioRef.current.src = album.music_url;
  //         audioRef.current.play();
  //         setActiveSong(album.id);
  //     }
  // };

  /* ---------- 렌더 ---------- */
  // return (
  //   <div className="song-play-edit-table">
  //     <div className="song-play-edit-table__title">{title}</div>
  //     <div className="song-play-edit-table__table-wrap">
  //       <table className="song-play-edit-table__table">
  //         <thead>
  //           <tr>
  //             <th>
  //               <input
  //                 type="checkbox"
  //                 className="styled-checkbox"
  //                 checked={allCheck}
  //                 onChange={handleSelectAll}
  //               />
  //             </th>
  //             <th className="albums-table__song">Song</th>
  //             <th className="albums-table__type">Type</th>
  //             <th>Artist</th>
  //             <th className="albums-table__song-title">Song&nbsp;Title</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {songList?.map((album, index) => (
  //             <tr
  //               key={album.id}
  //               className={activeSong?.id === album?.id ? 'active' : ''}
  //               onClick={() => {
  //                 if (activeSong?.id === album?.id) {
  //                   setActiveSong(null);
  //                 } else {
  //                   setActiveSong(album);
  //                 }
  //               }}
  //             >
  //               <td onClick={e => e.stopPropagation()}>
  //                 <input
  //                   type="checkbox"
  //                   className="styled-checkbox"
  //                   checked={album?.check}
  //                   onChange={e => {
  //                     e.stopPropagation();
  //                     handleSelectOne(album.id, album?.check);
  //                   }}
  //                 />
  //               </td>
  //               <td>
  //                 <button className="song">
  //                   <img src={album.cover_image} alt="cover" />
  //                   <div className="loading-wave">
  //                     <div className="loading-bar" />
  //                     <div className="loading-bar" />
  //                     <div className="loading-bar" />
  //                     <div className="loading-bar" />
  //                   </div>
  //                 </button>
  //               </td>
  //               <td className="type">
  //                 <img src={songTypeIcon} alt="type" />
  //               </td>
  //               <td>
  //                 <div className="user">
  //                   <img src={album.user_profile || defaultUserImage} alt="user-img" />
  //                   {album.name}
  //                 </div>
  //               </td>
  //               <td>{album.title}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  console.log(songList, '곡 리스트');

  return (
    <div>
      <div className="selected-song-number">
        {title}
        <p>
          (<span>{songList?.filter(item => item.check).length}</span>&nbsp;
          {songList?.filter(item => item.check).length === 1 ? 'Song' : 'Songs'})
        </p>
        {/* <p>(<span>3</span> Songs)</p> */}
      </div>

      <div className="albums-table scroll">
        <table style={{ minWidth: '0px', width: '100%' }}>
          <thead className="sticky">
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  checked={allCheck}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="albums-table__song">Song</th>
              <th className="albums-table__song-title">Song&nbsp;Title</th>
            </tr>
          </thead>
          <tbody>
            {songList?.map((album, index) => (
              <tr
                key={album.id}
                className={activeSong?.id === album?.id ? 'active' : ''}
                onClick={() => {
                  if (activeSong?.id === album?.id) {
                    setActiveSong(null);
                  } else {
                    setActiveSong(album);
                  }
                }}
              >
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="styled-checkbox"
                    checked={album?.check}
                    onChange={e => {
                      e.stopPropagation();
                      handleSelectOne(album.id, album?.check);
                    }}
                  />
                </td>
                <td>
                  <button className="albums-table__song-btn">
                    <img src={album.cover_image} alt="cover" />
                    <div className="loading-wave">
                      <div className="loading-bar" />
                      <div className="loading-bar" />
                      <div className="loading-bar" />
                      <div className="loading-bar" />
                    </div>
                  </button>
                </td>
                <td>
                  {album.title}
                  <br />
                  <div className="albums-table__artist--edit-table">
                    <img src={album.user_profile || defaultUserImage} alt="profile" />
                    {album.name}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {songList?.length === 0 && (
          <NoneContent message="There are no songs created yet." height={300} />
        )}
      </div>
    </div>
  );
};

export default SongPlayEditTable;
