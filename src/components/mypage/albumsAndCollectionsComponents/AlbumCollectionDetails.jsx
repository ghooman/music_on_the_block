import { Link } from 'react-router-dom';
import { useState } from 'react';

import ContentWrap from '../../unit/ContentWrap';
import SubCategories from '../../unit/SubCategories';
import NoneContent from '../../unit/NoneContent';
import SongPlayTable from '../../table/SongPlayTable';
import NftTable from '../../table/NftTable';

import defaultAlbumImage from '../../../assets/images/intro/mob-album-cover.png';
import defaultUserImage from '../../../assets/images/header/logo-png.png';
import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import editIcon from '../../../assets/images/edit.svg';
import playIcon from '../../../assets/images/play-icon2.svg';
import stopIcon from '../../../assets/images/stop-icon.svg';
import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './AlbumCollectionDetails.scss';
import { useInView } from 'react-intersection-observer';

const subCategoryList = [
  {
    name: 'AI Lyrics & Songwriting',
    image: generatedLyricSongwritingIcon,
    preparing: false,
  },
  { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
];

const AlbumCollectionDetails = ({
  userImage,
  userName,
  coverImage,
  name,
  isOwner,
  count,
  dataList,
  id,
  isLoading,
  handleEdit,
  target,
}) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [activeSong, setActiveSong] = useState(null);
  const [selected] = useState(subCategoryList[0].name);

  const editListPath = target === 'Album' ? `edit-album-songs` : `edit-collection-nfts`;

  const bundlename = target;
  const elementsname = target === 'Collection' ? 'NFTs' : 'Songs';

  return (
    <div className="album-collection-detail-page">
      <p className="album-collection-detail-page__title">{target} Details</p>
      <div className="album-collection-detail-page__box">
        <section className="album-collection-detail-page__box__header">
          <article className="album-collection-detail-page__box__header__left">
            <div className="album-collection-detail-page__box__header__left__img-box">
              {!isLoading && (
                <img
                  className="album-collection-detail-page__box__header__left__img-box__img"
                  src={coverImage || defaultAlbumImage}
                  alt="cover-img"
                />
              )}
            </div>
          </article>
          <article className="album-collection-detail-page__box__header__right">
            <div className="album-collection-detail-page__box__header__right__box">
              <p className="album-collection-detail-page__box__header__right__box__title">
                <span>{name}</span>
                {isOwner && (
                  <label
                    className="album-collection-detail-page__box__header__right__box__title__edit-btn"
                    onClick={() => handleEdit()}
                    htmlFor="name"
                  >
                    Edit {target}
                    <img src={editIcon} alt="edit-icon" />
                  </label>
                )}
              </p>
              <div className="album-collection-detail-page__box__header__right__box__list">
                <div className="album-collection-detail-page__box__header__right__box__list__item">
                  <p className="album-collection-detail-page__box__header__right__box__list__item__title">
                    Artist
                  </p>
                  <p className="album-collection-detail-page__box__header__right__box__list__item__title-value">
                    <img src={userImage || defaultUserImage} alt="user-img" className="user-img" />
                    {userName}
                  </p>
                </div>
                <div className="album-collection-detail-page__box__header__right__box__list__item">
                  <p className="album-collection-detail-page__box__header__right__box__list__item__title">
                    {target === 'Collection' && 'NFTs'}
                    {target === 'Album' && 'Songs'}
                  </p>
                  <p className="album-collection-detail-page__box__header__right__box__list__item__title-value">
                    {count}
                  </p>
                </div>
              </div>
              {/* Play 버튼 */}
              {target === 'Album' && (
                <button
                  className="album-collection-detail-page__box__header__right__play-btn"
                  disabled={count <= 0}
                  onClick={() => {
                    setIsPlaying(prev => !prev);
                  }}
                >
                  <img
                    src={isPlaying ? stopIcon : playIcon}
                    alt={isPlaying ? 'stop-icon' : 'play-icon'}
                  />
                  {isPlaying ? ' Stop' : ' Play'}
                </button>
              )}
            </div>
          </article>
        </section>
        <section className="album-collection-detail-page__box__body">
          <ContentWrap title="Favorites" border={false}>
            <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
            <ContentWrap.SubWrap gap={8}>
              <div className="album-collection-detail-page__box__body__edit">
                <p className="album-collection-detail-page__box__body__edit__song-count">
                  {dataList?.length || 0} {/** */}
                  {target === 'Collection' && 'NFTs'}
                  {target === 'Album' && 'Songs'}
                </p>
                {isOwner && (
                  <Link
                    to={`/${editListPath}/${id}`}
                    className="album-collection-detail-page__box__body__edit__edit-btn"
                  >
                    Edit {target === 'Album' ? 'Songs' : 'NFTs'}
                    <img src={editIcon} alt="edit-icon" />
                  </Link>
                )}
              </div>

              {dataList.length > 1 && target === 'Collection' && (
                <NftTable nftList={dataList} dateOption={false} priceOption={false} />
              )}
              {dataList.length > 1 && target === 'Album' && (
                <SongPlayTable
                  songList={dataList}
                  activeSong={activeSong}
                  setActiveSong={setActiveSong}
                  isScroll={true}
                  isTrigger={isPlaying}
                  setIsTrigger={setIsPlaying}
                />
              )}

              {dataList.length <= 0 && (
                <NoneContent
                  image={NoDataImage}
                  title={`No ${elementsname} in this ${bundlename?.toLowerCase()}`}
                  message={`This ${elementsname} is currently empty.`}
                  message2={`Add ${elementsname} to complete your ${bundlename?.toLowerCase()}.`}
                  height={300}
                />
              )}
              {/* )} */}
            </ContentWrap.SubWrap>
          </ContentWrap>
        </section>
      </div>
    </div>
  );
};

export default AlbumCollectionDetails;
