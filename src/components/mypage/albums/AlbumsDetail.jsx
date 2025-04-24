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
import { getMyAlbumBundleInfo } from '../../../api/AlbumsDetail';

// 더미 데이터
const dummySongsList = {
  data_list: [
    {
      id: 1,
      title: 'Song 1',
      name: 'Artist 1',
      album: 'Album 1',
      release_date: '2021-01-01',
      cover_image: songImg,
      music_url: track3,
    },
    {
      id: 2,
      title: 'Song 2',
      name: 'Artist 2',
      album: 'Album 2',
      release_date: '2021-02-01',
      cover_image: songImg,
      music_url: track2,
    },
    {
      id: 3,
      title: 'Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3',
      name: 'Artist 3',
      album: 'Album 3',
      release_date: '2021-03-01',
      cover_image: songImg,
      music_url: track3,
    },
  ],
  total_cnt: 3,
};

const AlbumsDetail = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [albumBundleInfo, setAlbumBundleInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // 더미 데이터 사용 (API 호출 대신 더미 데이터)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchAlbumBundleInfo = async () => {
    try {
      const response = await getMyAlbumBundleInfo(id, token);
      setAlbumBundleInfo(response);
    } catch (error) {
      console.error('앨범 번들 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAlbumBundleInfo();
  }, []);

  const audioRef = useRef(null);
  const [activeSong, setActiveSong] = useState(null); // activeSong 상태 관리

  const subCategoryList = [
    {
      name: 'AI Lyrics & Songwriting',
      image: generatedLyricSongwritingIcon,
      preparing: false,
    },
    { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
  ];
  const [selected, setSelected] = useState(subCategoryList[0].name);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const songsSort = searchParams.get('songs_sort');
  const releaseType = searchParams.get('release_type') || 'Unreleased songs';

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
              <button
                className="my-album-details__box__header__left__img-box__button"
                onClick={handleDetailModal}
              >
                <img src={MoreHoriz} alt="more-horiz" />
              </button>
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
                <button
                  className="my-album-details__box__header__right__box__title__edit-btn"
                  onClick={() => handleEditAlbum(albumBundleInfo)}
                >
                  Edit Album
                  <img src={editIcon} alt="edit-icon" />
                </button>
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
              <Link
                to={`/edit-album-songs/${id}`}
                className="my-album-details__box__body__sub-categories__edit-btn"
              >
                Edit Songs
                <img src={editIcon} alt="edit-icon" />
              </Link>
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
          onAlbumCreated={fetchAlbumBundleInfo}
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
