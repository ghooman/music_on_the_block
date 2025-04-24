import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import SongPlayTable from '../../unit/SongPlayTable'; // SongPlayTable 추가
import NoneContent from '../../../components/unit/NoneContent';
import AlbumsCreateModal from './AlbumsCreateModal';
import AlbumsDetailsModal from './AlbumsDetailsModal';
// 이미지/아이콘들
import songImg from '../../../assets/images/intro/intro-demo-img2.png';
import playIcon from '../../../assets/images/play-icon2.svg';
import stopIcon from '../../../assets/images/stop-icon.svg';
import editIcon from '../../../assets/images/edit.svg';
import defaultAlbumImage from '../../../assets/images/mypage/albums-upload-logo.png';
import defaultUserImage from '../../../assets/images/header/logo-png.png';
import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import MoreHoriz from '../../../assets/images/icon/more-horiz.svg';
import './AlbumsDetail.scss';
import track2 from '../../../assets/music/MusicOnTheBlock_v1.mp3';
import track3 from '../../../assets/music/nisoft_song.mp3';

// AI 관련 아이콘들
import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';
import { getAlbumBundleDetail } from '../../../api/AlbumsDetail';
import { useQuery } from 'react-query';

const subCategoryList = [
  {
    name: 'AI Lyrics & Songwriting',
    image: generatedLyricSongwritingIcon,
    preparing: false,
  },
  { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
];

const AlbumsDetail = () => {
  const { token, walletAddress } = useContext(AuthContext);
  const { address } = walletAddress || {};
  const { id } = useParams();
  // const [albumBundleInfo, setAlbumBundleInfo] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected] = useState(subCategoryList[0].name);
  const [activeSong, setActiveSong] = useState(null); // activeSong 상태 관리
  const audioRef = useRef(null);

  const {
    data: albumBundleInfo,
    isLoading,
    refetch,
  } = useQuery(['album_bundle_detail', { id, address }], async () => {
    return await getAlbumBundleDetail({ bundle_id: id, address: address });
  });

  console.log(albumBundleInfo, '번들 인포');

  const handleDetailModal = () => {
    setShowDetailModal(true);
  };

  const handleEditAlbum = () => {
    setShowCreateModal(true);
    setShowDetailModal(false);
  };

  return (
    <div className="my-album-details">
      <p className="my-album-details__title">Album Details</p>
      <div className="my-album-details__box">
        <section className="my-album-details__box__header">
          <article className="my-album-details__box__header__left">
            <div className="my-album-details__box__header__left__img-box">
              {albumBundleInfo?.is_owner && (
                <button
                  className="my-album-details__box__header__left__img-box__button"
                  onClick={handleDetailModal}
                >
                  <img src={MoreHoriz} alt="more-horiz" />
                </button>
              )}
              {!isLoading && (
                <img
                  className="my-album-details__box__header__left__img-box__img"
                  src={albumBundleInfo?.cover_image || defaultAlbumImage}
                  alt="cover-img"
                />
              )}
            </div>
          </article>
          <article className="my-album-details__box__header__right">
            <div className="my-album-details__box__header__right__box">
              <p className="my-album-details__box__header__right__box__title">
                <span>{albumBundleInfo?.album_name}</span>
                {albumBundleInfo?.is_owner && (
                  <button
                    className="my-album-details__box__header__right__box__title__edit-btn"
                    onClick={() => handleEditAlbum(albumBundleInfo)}
                  >
                    Edit Album
                    <img src={editIcon} alt="edit-icon" />
                  </button>
                )}
              </p>
              <div className="my-album-details__box__header__right__box__list">
                <div className="my-album-details__box__header__right__box__list__item">
                  <p className="my-album-details__box__header__right__box__list__item__title">
                    Artist
                  </p>
                  <p className="my-album-details__box__header__right__box__list__item__title-value">
                    <img
                      src={albumBundleInfo?.user_profile || defaultUserImage}
                      alt="user-img"
                      className="user-img"
                    />
                    {albumBundleInfo?.name}
                  </p>
                </div>
                <div className="my-album-details__box__header__right__box__list__item">
                  <p className="my-album-details__box__header__right__box__list__item__title">
                    Songs
                  </p>
                  <p className="my-album-details__box__header__right__box__list__item__title-value">
                    {albumBundleInfo?.song_cnt}
                  </p>
                </div>
              </div>
              {/* Play 버튼 */}
              <button
                className="my-album-details__box__header__right__play-btn"
                disabled={albumBundleInfo?.song_cnt <= 0}
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
            </div>
          </article>
        </section>
        <section className="my-album-details__box__body">
          <ContentWrap title="Favorites" border={false}>
            <div className="my-album-details__box__body__sub-categories">
              <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
              {albumBundleInfo?.is_owner && (
                <Link
                  to={`/edit-album-songs/${id}`}
                  className="my-album-details__box__body__sub-categories__edit-btn"
                >
                  Edit Songs
                  <img src={editIcon} alt="edit-icon" />
                </Link>
              )}
            </div>

            {albumBundleInfo?.song_list?.length > 0 ? (
              <SongPlayTable
                songList={albumBundleInfo?.song_list}
                activeSong={activeSong}
                setActiveSong={setActiveSong}
                isScroll={true}
                isTrigger={isPlaying}
                setIsTrigger={setIsPlaying}
              />
            ) : (
              <NoneContent
                image={NoDataImage}
                title="No songs in this album"
                message="This album is currently empty."
                message2="Add songs to complete your album."
              />
            )}
          </ContentWrap>
        </section>
      </div>{' '}
      {showCreateModal && (
        <AlbumsCreateModal
          setShowCreateModal={setShowCreateModal}
          status={'edit'}
          albumData={albumBundleInfo}
          onAlbumCreated={refetch}
        />
      )}
      {showDetailModal && albumBundleInfo && (
        <AlbumsDetailsModal
          setShowDetailModal={setShowDetailModal}
          album={albumBundleInfo}
          token={token}
          onEditClick={() => handleEditAlbum(albumBundleInfo)}
          isFromAlbumDetail={true}
        />
      )}
    </div>
  );
};

export default AlbumsDetail;
