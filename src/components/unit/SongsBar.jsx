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

const SongsBar = ({}) => {
  const { token, walletAddress } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { id } = useParams();
  const [barActive, setBarActive] = useState(false);
  const audioRef = useRef(null); // 오디오 태그 접근용 ref
  const [isLoading, setIsLoading] = useState(false);
  const [album, setAlbum] = useState(null);
  const [albumDuration, setAlbumDuration] = useState(0);

  /* active 상태에 따라 재생/정지 */
  useEffect(() => {
    if (!audioRef.current) return;

    if (barActive) {
      audioRef.current.play().catch(() => {}); // 자동 재생 실패 대비 try-catch
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // 필요하면 처음으로
    }
  }, [barActive]);
  // 초기 앨범 상세 정보 가져오기 함수 (초기 로딩 및 사용자 명시 업데이트)

  const fetchAlbumDetail = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response = await axios.get(
        `${serverApi}/api/music/${id}?wallet_address=${walletAddress?.address}`
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
    fetchAlbumDetail();
  }, [id]);

  return (
    <>
      {barActive && (
        <div className="songs-bar-audio">
          <audio ref={audioRef} src={album?.music_url} controls />
        </div>
      )}
      <section
        className={`songs-bar ${barActive ? 'active' : ''}`}
        onClick={() => setBarActive(prev => !prev)}
      >
        <article className="songs-bar__play-box">
          <p className="songs-bar__play-box__img">
            <img src={album?.cover_image || defaultCoverImg} alt="album-cover" />
            <div className="loading-wave">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
          </p>
          <p className="songs-bar__play-box__title">
            {album?.title} - {album?.name}
          </p>
        </article>
        <article className="songs-bar__value-box">
          <div className="songs-bar__value-box__item">
            <p>
              Grade
              <img src={grade01Icon} alt="grade-icon" />
            </p>
            <p>
              Type
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
          <Link className="songs-bar__details-btn" to={`/song-detail/${id}`}>
            Details
          </Link>
        </article>
      </section>
    </>
  );
};

export default SongsBar;
