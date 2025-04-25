import React, { useEffect, useState, useRef } from 'react';
import NoneContent from './NoneContent';
import './SongPlayEditTable.scss';
import './AlbumsTable.scss';
import typeImage from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import defaultUserImage from '../../assets/images/header/logo-png.png';

/**
 * SongPlayEditTable
 * @param {Array}                             songList       곡 데이터
 * @param {number|null}                       activeSong     현재 재생 중인 곡 ID
 * @param {React.Dispatch<React.SetStateAction<number|null>>} setActiveSong
 * @param {React.RefObject<HTMLAudioElement>} audioRef
 */
const SongPlayEditTable = ({
  title,
  songList = [],
  setSongList,
  activeSong,
  setActiveSong,
  count,
  limit,
}) => {
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

  return (
    <div className="song-play-edit-table">
      <div className="song-play-edit-table__selected">
        {title}
        <p className="song-play-edit-table__selected--numbers">
          (<span>{count || 0}</span>&nbsp;
          {count === 1 ? 'Song' : 'Songs'} {limit ? <>/ {limit} Songs</> : ''} )
        </p>
      </div>
      {/** 테이블 시작 */}
      <div className="song-play-edit-table__table">
        {/** 테이블 헤드 */}
        <div className="song-play-edit-table__table--head">
          <div className="table-items">
            <input type="checkbox" onChange={handleSelectAll} checked={allCheck} />
          </div>
          <div className="table-items head-song">Song</div>
          <div className="table-items head-title">Title</div>
        </div>

        {/** 테이블 바디 */}
        {songList?.map(item => (
          <div
            className="song-play-edit-table__table--body"
            onClick={e => {
              setActiveSong(prev => {
                if (item?.id === prev?.id) return null;
                else return item;
              });
            }}
          >
            {/** 체크박스 */}
            <div className="table-items">
              <input
                type="checkbox"
                onClick={e => {
                  e.stopPropagation();
                }}
                onChange={e => {
                  handleSelectOne(item.id, item.check);
                }}
                checked={item.check}
              />
            </div>

            {/** 노래 이미지 */}
            <div className={`table-items body-song ${item?.id === activeSong?.id ? 'active' : ''}`}>
              <img src={item.cover_image} alt="cover" />
              <div className="loading-wave">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            </div>

            {/** 제목 */}
            <div className="table-items body-title">
              <p className="body-title__song-title">{item.title}</p>
              <div className="body-title__artist">
                <img
                  className="artist__image"
                  src={item.profile || defaultUserImage}
                  alt="profile images"
                />
                <p className="artist__name">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
        {songList.length <= 0 && <NoneContent message="There are no songs." height={230} />}
      </div>

      {/* <div className="albums-table scroll">
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
              <th>Type</th>
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
                  <img src={typeImage} alt="type" />
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
      </div> */}
    </div>
  );
};

export default SongPlayEditTable;
