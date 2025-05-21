import { useNavigate } from 'react-router-dom';
import React from 'react';

import MoreHoriz from '../../../assets/images/icon/more-horiz.svg';
import defaultAlbumImage from '../../../assets/images/intro/mob-album-cover.png';

import './AlbumCollectionItems.scss';

const AlbumCollectionItems = ({ children }) => {
  return <div className="album-collections-module-items-wraps">{children}</div>;
};

AlbumCollectionItems.Item = ({
  name,
  artist,
  count,
  isOwner,
  coverImage,
  handleNavigate,
  handleDetail,
  target,
  translateFn,
}) => {
  const element = target === 'Collection' ? 'NFT' : 'Song';

  return (
    <div className="album-collections-module-items" onClick={() => handleNavigate()}>
      <div className="album-collections-module-items__info">
        <h1>{name || '-'}</h1>
        <p>{artist}</p>
        <div className="album-collections-module-items__info--edit">
          <span>
            {count} {translateFn ? translateFn(element) : element}
            {count > 1 && 's'}
          </span>
          {isOwner && (
            <button
              className="album-collections-module-items__info--edit-btn"
              onClick={e => {
                e.stopPropagation(); // 버블링 방지
                if (handleDetail) handleDetail();
              }}
            >
              <img src={MoreHoriz} alt="more_content" />
            </button>
          )}
        </div>
      </div>
      <div className="album-collections-module-items__cover">
        <img
          src={coverImage?.replace('public', '280to280') || defaultAlbumImage}
          alt="album_cover"
        />
      </div>
    </div>
  );
};

export default AlbumCollectionItems;
