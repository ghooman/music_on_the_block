import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import ModalWrap from '../ModalWrap';
import { useTranslation } from 'react-i18next';
import SearchBar from '../unit/SearchBar';
import Loading from '../Loading.js';

import defaultCoverImg from '../../assets/images/header/logo-png.png';
import defaultAlbumImage from '../../assets/images/album/album-cover.png';

import './VoteRegisterModal.scss';
import axios from 'axios';
const serverAPI = process.env.REACT_APP_SERVER_API;

function VoteRegisterModal({ onClose, onSubmit, excludedIds = [] }) {
  // --------------- 상태 모음 -------------
  const { token, walletAddress } = useContext(AuthContext);
  const { t } = useTranslation('modal');

  // 검색 입력값
  const [keyword, setKeyword] = useState('');

  // 검색 결과 (현재 화면에 보이는 결과만)
  const [songList, setSongList] = useState([]);
  const [songListCnt, setSongListCnt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 제출 여부(엔터/아이콘을 눌렀는지)
  const [submitted, setSubmitted] = useState(false);

  // ✅ 선택 항목을 “검색과 무관하게” 유지: id -> track 객체
  const [selectedMap, setSelectedMap] = useState(new Map());

  // 제외할 ID들을 언제나 Set으로 사용
  const excludedIdSet = useMemo(() => {
    try {
      return new Set(Array.isArray(excludedIds) ? excludedIds : [...excludedIds]);
    } catch {
      return new Set();
    }
  }, [excludedIds]);

  // 제외 리스트가 바뀌면 선택에서도 제거(안전)
  useEffect(() => {
    setSelectedMap(prev => {
      const next = new Map(prev);
      for (const id of [...next.keys()]) {
        if (excludedIdSet.has(id)) next.delete(id);
      }
      return next;
    });
  }, [excludedIdSet]);

  const toggleSelect = track => {
    const id = track?.id;
    if (id == null) return; // 방어
    setSelectedMap(prev => {
      const next = new Map(prev);
      next.has(id) ? next.delete(id) : next.set(id, track);
      return next;
    });
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
    setSubmitted(false);
    // ❌ 선택은 유지해야 하므로 selectedMap은 건드리지 않습니다.
  };

  // 모달 내부에서 사용할 실제 검색 함수 (SearchBar의 onSearch가 이걸 호출)
  const handleSearchMusic = async kw => {
    const q = (kw ?? keyword)?.trim();
    if (!q) return; // 빈 문자열이면 검색 안 함

    setSubmitted(true); // 여기서부터 결과/로딩 영역 활성화
    setIsLoading(true);
    try {
      const res = await axios.get(`${serverAPI}/api/music/search/list`, {
        params: { search_keyword: q, limit: 9999 },
      });
      const rawList = res.data?.data_list ?? [];

      // ✅ 이미 등록된 곡 제외
      const filteredList = rawList.filter(
        track => track?.id != null && !excludedIdSet.has(track.id)
      );

      setSongList(filteredList);
      setSongListCnt(filteredList.length);

      // 혹시 선택에 포함되어 있는데 서버에서 제외된 항목이 있다면 제거(이중 안전)
      setSelectedMap(prev => {
        const next = new Map(prev);
        for (const id of [...next.keys()]) {
          if (excludedIdSet.has(id)) next.delete(id);
        }
        return next;
      });
    } catch (err) {
      console.error('검색 실패:', err);
      setSongList([]);
      setSongListCnt(0);
      // 선택은 유지
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCount = selectedMap.size;

  // ✅ 선택된 track들을 “모두” 제출 (현재 검색결과에 없어도 제출됨)
  const handleSubmit = () => {
    const selectedTracks = Array.from(selectedMap.values());
    onSubmit?.(selectedTracks);
  };

  return (
    <ModalWrap onClose={() => onClose?.()} title={t('음악 등록')}>
      <div className="vote-register-modal">
        <SearchBar
          mode="callback"
          keyword={keyword}
          handleChange={handleChange}
          handleClear={handleClear}
          hideTitle
          onSearch={kw => handleSearchMusic(kw)}
        />

        <div className="result-box">
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
              {songList.map(track => {
                const active = selectedMap.has(track.id);
                return (
                  <li
                    key={track.id}
                    className={`vote-register-modal__track-item ${active ? 'active' : ''}`}
                    onClick={() => toggleSelect(track)}
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
                );
              })}
            </ul>
          )}
        </div>

        <button
          className={`vote-register-modal__btn ${
            selectedCount > 0
              ? 'vote-register-modal__btn--active'
              : 'vote-register-modal__btn--deactive'
          }`}
          disabled={selectedCount === 0}
          onClick={handleSubmit}
        >
          {t('총 N개의 음악 등록').replace('N', String(selectedCount))}
        </button>
      </div>
    </ModalWrap>
  );
}

export default VoteRegisterModal;
