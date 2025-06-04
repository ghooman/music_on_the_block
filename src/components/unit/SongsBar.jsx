// components/AlbumItem.jsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

import './SongsBar.scss';
import grade01Icon from '../../assets/images/icon/grade-icon/Grade01-icon.svg';
import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import playIcon from '../../assets/images/album/play-icon.svg';
import defaultCoverImg from '../../assets/images/header/logo-png.png';
import loverIcon from '../../assets/images/icon/heart.svg';
import typeIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import { useTranslation } from 'react-i18next';

const SongsBar = ({ songId, itemData, play, onPlayClick, isSelected }) => {
  const { t } = useTranslation('module');
  const { token, walletAddress } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [album, setAlbum] = useState(null);
  const [albumDuration, setAlbumDuration] = useState(0);

  // 초기 앨범 상세 정보 가져오기 함수 (초기 로딩 및 사용자 명시 업데이트)
  const fetchAlbumDetail = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response = await axios.get(
        `${serverApi}/api/music/${songId || id}?wallet_address=${walletAddress?.address}`
      );
      setAlbum(response.data);
      // 앨범 재생 시간 계산
      const audio = new Audio(response?.data?.music_url);
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        setAlbumDuration(duration);
      });
      console.log('album', response.data);
    } catch (error) {
      console.error('앨범 상세 정보 가져오기 에러:', error);
    }
    if (showLoading) setIsLoading(false);
  };

  useEffect(() => {
    if (songId && !itemData) {
      fetchAlbumDetail();
    } else {
      setAlbum(itemData);
    }
  }, [id, itemData]);

  return (
    <>
      <section className={`songs-bar ${play ? 'active' : ''} ${isSelected ? 'selected' : ''}`}>
        <article className="songs-bar__play-box">
          <p
            className="songs-bar__play-box__img"
            onClick={e => {
              e.stopPropagation(); // span 클릭 이벤트 전파 방지
              if (onPlayClick) {
                onPlayClick();
              }
            }}
          >
            <img src={album?.cover_image || defaultCoverImg} alt="album-cover" />
            {play && (
              <div className="loading-wave">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            )}
          </p>
          <p className="songs-bar__play-box__title">
            {album?.title} - {album?.name}
          </p>
        </article>
        <article className="songs-bar__value-box">
          <div className="songs-bar__value-box__item">
            <p>
              {t('Grade')}
              <img src={grade01Icon} alt="grade-icon" />
            </p>
            <p>
              {t('Type')}
              <img src={typeIcon} alt="type-icon" />
            </p>
          </div>
          <div className="songs-bar__value-box__item">
            <p>
              <img src={playIcon} alt="play-icon" className="play-icon" />
              {album?.play_cnt}
            </p>
            <p>
              <img src={album?.is_like ? halfHeartIcon : loverIcon} alt="love-icon" />
              {album?.like}
            </p>
          </div>
          <Link
            className="songs-bar__details-btn"
            to={`/song-detail/${songId || id || itemData?.id}`}
          >
            {t('Details')}
          </Link>
        </article>
      </section>
    </>
  );
};

export default SongsBar;
