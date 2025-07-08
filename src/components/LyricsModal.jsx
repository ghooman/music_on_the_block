import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LyricsModal.scss';
import closeIcon from '../assets/images/icons/close-icon.svg';

const LyricsModal = ({ setShowLyricsModal, generatedLyric, onSave }) => {
  const { t } = useTranslation('song_create');
  /* 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = '');
  }, []);

  /* 로컬 편집 상태 */
  const [editedLyric, setEditedLyric] = useState(generatedLyric || '');
  const isModified = editedLyric.trim() !== (generatedLyric || '').trim(); // 공백만 변화인 경우 무시

  /* 오버레이 클릭 시 닫기 */
  const handleOverlayClick = e => {
    if (e.target.classList.contains('lyrics-modal__overlay')) {
      setShowLyricsModal(false);
    }
  };

  /* 저장 */
  const handleSave = () => {
    if (!isModified || typeof onSave !== 'function') return;
    onSave(editedLyric); // 부모 상태 업데이트
    setShowLyricsModal(false); // 모달 닫기
  };

  return (
    <div className="lyrics-modal__overlay" onClick={handleOverlayClick}>
      <div className="lyrics-modal__box">
        {/* Header */}
        <div className="lyrics-modal__header">
          <h2 className="lyrics-modal__title">{t('Lyrics')}</h2>
          <img
            src={closeIcon}
            alt="close"
            className="lyrics-modal__close"
            onClick={() => setShowLyricsModal(false)}
          />
        </div>

        {/* Body */}
        <div className="lyrics-modal__body">
          <textarea value={editedLyric} onChange={e => setEditedLyric(e.target.value)} />
        </div>

        {/* Footer */}
        <div className="lyrics-modal__footer">
          <button
            className={`lyrics-modal__button ${isModified ? 'active' : ''}`}
            disabled={!isModified}
            onClick={handleSave}
          >
            {isModified ? t('Lyrics Edited') : t('Edit Lyrics')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LyricsModal;
