import React, { useState, useContext, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import ModalWrap from '../ModalWrap';
import { useTranslation } from 'react-i18next';
import SearchBar from '../unit/SearchBar';

import SampleAlbumImg from '../../assets/images/vote/vote-sample-artist.png';
import SampleArtistImg from '../../assets/images/album/album-cover.png';
import defaultCoverImg from '../../assets/images/header/logo-png.png';
import defaultAlbumImage from '../../assets/images/album/album-cover.png';

import Loading from '../Loading.js';

import './VoteRegisterModal.scss';

import axios from 'axios';
const serverAPI = process.env.REACT_APP_SERVER_API;

function VoteRegisterModal({ onClose, onSubmit, tracks = [] }) {
  // --------------- 상태 모을 -------------
  const { token, walletAddress } = useContext(AuthContext);
  const { t } = useTranslation('modal');

  // 검색 입력값
  const [keyword, setKeyword] = useState('');

  // 검색 결과
  const [songList, setSongList] = useState([]);
  const [songListCnt, setSongListCnt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 제출 여부(엔터/아이콘을 눌렀는지)
  const [submitted, setSubmitted] = useState(false);

  // 단일 선택(현재 구조 유지). 다중 선택으로 바꿀 거면 Set 사용 추천
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);

  const handleSelectTrack = idx => {
    setSelectedTrackIndex(prev => (prev === idx ? null : idx));
  };

  // --------------- 함수 모음 ---------------
  // 입력 시에는 제출 상태를 해제해서 “검색어를 입력해주세요” 유지
  const handleChange = e => {
    setKeyword(e.target.value);
    setSubmitted(false);
  };

  const handleClear = () => {
    setKeyword('');
    setSongList([]);
    setSongListCnt(0);
    setIsLoading(false);
    setSubmitted(false); // 입력폼 초기화 시 안내문 보이도록
  };

  // 모달 내부에서 사용할 실제 검색 함수 (SearchBar의 onSearch가 이걸 호출)
  const handleSearchMusic = async kw => {
    const q = (kw ?? keyword)?.trim();
    if (!q) return; // 빈 문자열이면 검색 안 함

    setSubmitted(true); // ✅ 여기서부터 결과/로딩 영역 활성화
    setIsLoading(true);
    try {
      const res = await axios.get(`${serverAPI}/api/music/search/list`, {
        params: { search_keyword: q, limit: 9999 },
      });
      const list = res.data?.data_list ?? [];
      setSongList(list);
      setSongListCnt(res.data?.total_cnt ?? list.length);
      // setSelectedTrackIndex(null); // 새 검색 시 선택 초기화(선택 유지 원하면 제거)
    } catch (err) {
      console.error('검색 실패:', err);
      setSongList([]);
      setSongListCnt(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrap onClose={() => onClose?.()} title={t('음악 등록')}>
      <div className="vote-register-modal">
        <SearchBar
          keyword={keyword}
          handleChange={handleChange}
          handleClear={handleClear}
          hideTitle
          onSearch={handleSearchMusic}
        />

        {/* ✅ 렌더링 분기 */}
        {!submitted && <p className="no-result-txt">{t('검색어를 입력해주세요')}</p>}

        {submitted && isLoading && (
          <div className="result-loading">
            <Loading />
          </div>
        )}

        {submitted && !isLoading && songListCnt === 0 && (
          <p className="no-result-txt">{t('No results found')}</p>
        )}

        {/* 결과 리스트 */}
        {submitted && !isLoading && songListCnt > 0 && (
          <ul className="vote-register-modal__track-list">
            {songList.map((track, idx) => (
              <li
                key={track.id ?? idx}
                className={`vote-register-modal__track-item ${
                  selectedTrackIndex === idx ? 'active' : ''
                }`}
                onClick={() => handleSelectTrack(idx)}
              >
                <img
                  src={track.cover_image || defaultAlbumImage}
                  alt={track.title}
                  className="album-thumb"
                />
                <div className="meta-content">
                  <strong className="meta-title">{track.title}</strong>
                  {track.name && (
                    <span className="meta-artist">
                      <img
                        src={track.user_profile || defaultCoverImg}
                        alt={track.name}
                        className="artist-thumb"
                      />
                      <small className="artist-name">{track.name}</small>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          className={`vote-register-modal__btn ${
            selectedTrackIndex !== null
              ? 'vote-register-modal__btn--active'
              : 'vote-register-modal__btn--deactive'
          }`}
          disabled={selectedTrackIndex === null}
          onClick={() => {
            const selected = selectedTrackIndex !== null ? [songList[selectedTrackIndex]] : [];
            onSubmit?.(selected); // 상위로 선택 결과 전달 (배열)
          }}
        >
          {t('총 N개의 음악 등록').replace('N', String(selectedTrackIndex !== null ? 1 : 0))}
        </button>
      </div>
    </ModalWrap>
  );
}

export default VoteRegisterModal;
