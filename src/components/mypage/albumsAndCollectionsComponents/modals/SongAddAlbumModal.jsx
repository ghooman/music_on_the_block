import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import './SongAddAlbumModal.scss'; // SCSS 파일 연결
import ErrorModal from '../../../modal/ErrorModal';

import { AuthContext } from '../../../../contexts/AuthContext';
import defaultAlbumImage from '../../../../assets/images/intro/mob-album-cover.png';

const serverApi = process.env.REACT_APP_SERVER_API;

const SongAddAlbumModal = ({ song, onClose }) => {
  const { t } = useTranslation('modal');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, walletAddress, user } = useContext(AuthContext);
  const { address } = walletAddress || {};

  // 1. 앨범 리스트 불러오기
  console.log('song:', song);
  console.log('token:', token);
  console.log('address:', address);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${serverApi}/api/music/my/album/bundle/list`, {
          params: { page: 1 }, // 기본 페이지
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('✅ 앨범 API 응답:', res.data);

        const albumsWithStatus = res.data?.data_list?.map(album => ({
          ...album,
          registered: album.song_list?.some(s => s.id === song.id),
        }));

        console.log('🎯 가공된 앨범 리스트:', albumsWithStatus);

        setAlbums(albumsWithStatus);
      } catch (err) {
        console.error('❌ 앨범 리스트 조회 실패:', err);
      }
    };

    if (song && token) fetchAlbums();
  }, [song, token]);

  // 2. 앨범 선택/해제
  const toggleSelect = albumId => {
    if (selectedAlbumIds.includes(albumId)) {
      setSelectedAlbumIds(prev => prev.filter(id => id !== albumId));
    } else {
      setSelectedAlbumIds(prev => [...prev, albumId]);
    }
  };

  // 3. 등록 요청
  const handleAdd = async () => {
    if (selectedAlbumIds.length === 0 || !song?.id) {
      alert('앨범과 곡을 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      for (const albumId of selectedAlbumIds) {
        // 1. 해당 앨범의 기존 곡 리스트 조회
        const res = await axios.get(`${serverApi}/api/music/user/album/bundle/${albumId}/detail`, {
          params: {
            wallet_address: walletAddress?.address,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const existingSongs = res.data?.song_list || [];
        const existingSongIds = existingSongs.map(s => s.id);

        // 2. 현재 선택한 곡을 추가
        const updatedSongIds = [...new Set([...existingSongIds, song.id])];

        // 3. 전체 곡 ID 리스트로 갱신 요청
        await axios.post(`${serverApi}/api/music/album/bundle/${albumId}/song`, updatedSongIds, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setErrorTitle(t('Added to Album'));
      setErrorMessage(t(`Selected music has been added successfully.`));
      setShowErrorModal(true);

      // onClose(); // 또는 refetch
    } catch (error) {
      console.error('추가 실패:', error.response?.data || error.message);
      setErrorTitle(t('Failed to add to album'));
      setErrorMessage(t(`Music could not be added due to an error.`));
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div>
      {showErrorModal && (
        <ErrorModal
          title={errorTitle}
          message={errorMessage}
          button={true}
          setShowErrorModal={() => {
            setShowErrorModal(false);
            onClose(); // 부모 모달 닫기까지 확실히
          }}
        />
      )}

      <div className="song-add-album-modal">
        <div className="song-add-album-modal__box">
          <div className="song-add-album-modal__inner">
            <div className="song-add-album-modal__header">
              <div className="song-add-album-modal__title">{t(`Add to Album`)}</div>
              <div className="song-add-album-modal__close" onClick={onClose}>
                ✕
              </div>
            </div>

            <div className="song-add-album-modal__content">
              <div className="song-add-album-modal__scroll">
                {albums.length === 0 && (
                  <p style={{ color: '#aaa' }}>{t(`No album has been registered.`)}</p>
                )}
                {albums.map(album => (
                  <div
                    key={album.id}
                    className={`song-add-album-modal__album-item 
                    ${
                      selectedAlbumIds.includes(album.id)
                        ? 'song-add-album-modal__album-item--selected'
                        : ''
                    }
                    ${album.registered ? 'song-add-album-modal__album-item--registered' : ''}`}
                    onClick={() => {
                      if (!album.registered) toggleSelect(album.id);
                    }}
                  >
                    <img
                      src={
                        album.cover_image?.includes('public')
                          ? album.cover_image.replace('public', '140to140')
                          : defaultAlbumImage
                      }
                      alt={album.album_name}
                    />
                    <div className="song-add-album-modal__album-info">
                      <div className="song-add-album-modal__album-name">{album.album_name}</div>
                      <div className="song-add-album-modal__song-count">
                        {album.song_cnt}
                        {t(`Song`)}
                      </div>
                    </div>
                    {album.registered && (
                      <div className="song-add-album-modal__badge">{t(`Registered`)}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="song-add-album-modal__footer">
                <button
                  className={`song-add-album-modal__add-btn ${
                    selectedAlbumIds.length === 0 || isSubmitting
                      ? 'song-add-album-modal__add-btn--disabled'
                      : ''
                  }`}
                  onClick={handleAdd}
                  disabled={selectedAlbumIds.length === 0 || isSubmitting}
                >
                  {isSubmitting ? t(`Registering...`) : t(`Add`)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongAddAlbumModal;
