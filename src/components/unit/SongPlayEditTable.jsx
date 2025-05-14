import React from 'react';
import NoneContent from './NoneContent';

import { getSongsGradeIcon } from '../../utils/getGradeIcon';

import './SongPlayEditTable.scss';

import typeImage from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import arrowIcon from '../../assets/images/add-icon.svg';
import defaultUserImage from '../../assets/images/header/logo-png.png';

/**
 * SongPlayEditTable
 * @param {Array}                             songList       곡 데이터
 * @param {number|null}                       activeSong     현재 재생 중인 곡 ID
 * @param {React.Dispatch<React.SetStateAction<number|null>>} setActiveSong
 * @param {React.RefObject<HTMLAudioElement>} audioRef
 */
export const SongPlayEditTableWrapper = ({ children }) => {
  return <div className="song-play-edit-table-wrapper">{children}</div>;
};

export const SongPlayEditButtons = ({ handleAdd, handleDelete }) => {
  return (
    <div className="song-play-edit-table-add-delete-button">
      <button className="button-item add-button" onClick={handleAdd}>
        Add
        <img src={arrowIcon} alt="icon" />
      </button>
      <button className="button-item delete-button" onClick={handleDelete}>
        <img src={arrowIcon} alt="icon" />
        Delete
      </button>
    </div>
  );
};

export const SongPlayEditTable = ({
  title,
  songList = [],
  setSongList,
  activeSong,
  setActiveSong,
  limit,

  songOption,
  typeOption,
  gradeOption,
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
          (<span>{songList?.length || 0}</span>&nbsp;
          {songList?.length === 1 ? 'Song' : 'Songs'} {limit ? <>/ {limit} Songs</> : ''} )
        </p>
      </div>
      {/** 테이블 시작 */}
      <div className="song-play-edit-table__table">
        {/** 테이블 헤드 */}
        <div className="song-play-edit-table__table--head">
          <div className="table-items">
            <input type="checkbox" onChange={handleSelectAll} checked={allCheck} />
          </div>
          {songOption && <div className="table-items head-song">Song</div>}
          {typeOption && <div className="table-items head-type">Type</div>}
          {gradeOption && <div className="table-items head-grade">Grade</div>}
          <div className="table-items head-title">Title</div>
        </div>

        {/** 테이블 바디 */}
        {songList?.map(item => (
          <div
            key={item.id}
            className="song-play-edit-table__table--body"
            onClick={e => {
              if (!songOption) return;
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
            {songOption && (
              <div
                className={`table-items body-song ${item?.id === activeSong?.id ? 'active' : ''}`}
              >
                <img src={item.cover_image?.replace('public', '140to140')} alt="cover" />
                <div className="loading-wave">
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                </div>
              </div>
            )}
            {/** 타입 */}
            {typeOption && <div></div>}
            {/** 등급 */}
            {gradeOption && <div></div>}
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
    </div>
  );
};
