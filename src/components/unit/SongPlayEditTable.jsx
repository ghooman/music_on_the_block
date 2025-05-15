import React, { useEffect } from 'react';
import NoneContent from './NoneContent';

import { getSongsGradeIcon } from '../../utils/getGradeIcon';

import './SongPlayEditTable.scss';

import typeImage from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import arrowIcon from '../../assets/images/add-icon.svg';
import defaultUserImage from '../../assets/images/header/logo-png.png';
import { useInView } from 'react-intersection-observer';

/**
 * SongPlayEditTable
 * @param {Array}                             dataList       곡 데이터
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
  dataList = [],
  setDataList,
  activeSong,
  setActiveSong,
  limit,
  target,

  songOption,
  titleOption,

  typeOption,
  gradeOption,
  itemOption,
}) => {
  const { ref, inView } = useInView();
  const allCheck = dataList?.length > 0 && dataList?.every(item => item.check);
  const elementName = target === 'Collection' ? 'NFT' : 'Song';

  const handleSelectAll = e => {
    setDataList(prev => {
      const copy = [...prev];
      return copy.map(item => ({ ...item, check: !allCheck }));
    });
  };

  const handleSelectOne = (id, check) => {
    setDataList(prev => {
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
          (<span>{dataList?.length || 0}</span>&nbsp;
          {dataList?.length === 1 ? elementName : elementName + 's'}{' '}
          {limit ? (
            <>
              / {limit} {elementName + 's'}
            </>
          ) : (
            ''
          )}{' '}
          )
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
          {titleOption && <div className="table-items head-title">Title</div>}
          {itemOption && <div className="table-items head-item">Item</div>}
        </div>

        {/** 테이블 바디 */}
        {dataList?.map(item => (
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
            {typeOption && (
              <div className="table-items body-type">
                <img src={typeImage} alt="type icon" />
              </div>
            )}
            {/** 등급 */}
            {gradeOption && (
              <div className="table-items body-grade">
                <img src={getSongsGradeIcon(item.rating)} alt="grade icon" />
              </div>
            )}
            {/** 제목 */}
            {titleOption && (
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
            )}
            {itemOption && <div className="table-items body-item">{item.nft_name}</div>}
          </div>
        ))}
        {dataList.length <= 0 && (
          <NoneContent
            message={`There are no ${target === 'Collection' ? 'NFTs' : 'Songs'}.`}
            height={230}
          />
        )}
      </div>
    </div>
  );
};
