import React, { useState } from 'react';
import ModalWrap from '../ModalWrap';
import { useTranslation } from 'react-i18next';
import SearchBar from '../unit/SearchBar';

import SampleAlbumImg from '../../assets/images/vote/vote-sample-artist.png';
import SampleArtistImg from '../../assets/images/album/album-cover.png';

import './VoteRegisterModal.scss';

function VoteRegisterModal({ onClose, onSubmit, tracks = [] }) {
  const { t } = useTranslation('modal');

  const [search, setSearch] = useState('');
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);

  const handleChange = e => setSearch(e.target.value);
  const handleClear = () => setSearch('');

  // li 클릭 시 인덱스 저장하기. 한 번 더 클릭 시 해제
  const handleSelectTrack = idx => {
    setSelectedTrackIndex(idx === selectedTrackIndex ? null : idx);
  };

  return (
    <ModalWrap onClose={() => onClose?.()} title={t('음악 등록')}>
      <div className="vote-register-modal">
        <SearchBar
          keyword={search}
          handleChange={handleChange}
          handleClear={handleClear}
          hideTitle
        />

        {tracks.length === 0 ? (
          <p className="no-result-txt">{t('No results found')}</p>
        ) : (
          <ul className="vote-register-modal__track-list">
            {tracks.map((track, idx) => (
              <li
                key={idx}
                className={`vote-register-modal__track-item ${
                  selectedTrackIndex === idx ? 'active' : ''
                }`}
                onClick={() => handleSelectTrack(idx)}
              >
                <img
                  src={track.albumImage || SampleAlbumImg}
                  alt={track.musicTitle || ''}
                  className="album-thumb"
                />
                <div className="meta-content">
                  <strong className="meta-title">{track.musicTitle}</strong>
                  {track.artistName && (
                    <span className="meta-artist">
                      <img src={SampleArtistImg} alt={track.artistName} className="artist-thumb" />
                      <small className="artist-name">{track.artistName}</small>
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
        >
          {t('총 N개의 음악 등록')}
        </button>
      </div>
    </ModalWrap>
  );
}

export default VoteRegisterModal;
