import './CreateSideBar.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// 아이콘 모음
import checkWhite from '../../assets/images/icons/check-white-icon.svg';
import checkGreen from '../../assets/images/icons/check-green-icon.svg';
import lyricsCreate from '../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../assets/images/icons/lyrics-edit-icon.svg';
import MelodyMaker from '../../assets/images/icons/melody-maker-icon.svg';
import rightArrow from '../../assets/images/icons/right-arrow-icon.svg';
import LyricsModal from '../LyricsModal';
const CreateSideBar = ({
  pageNumber,
  isConfirmLyricStatus,
  showLyricsModal,
  setShowLyricsModal,
  generatedLyric,
  setGeneratedLyric,
}) => {
  const { t } = useTranslation('song_create');
  const navigate = useNavigate();
  // console.log('사이드바에서 받음', pageNumber);
  // console.log('isConfirmLyricStatus', isConfirmLyricStatus);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="create__sidebar">
      {window.innerWidth <= 1200 && (
        <div className="create__sidebar--mobile-header">
          <div className="create__sidebar--mobile-header--title">
            <img src={rightArrow} className="back-arrow" alt="back" onClick={() => navigate(-1)} />
            <div className="mobile-title">
              {pageNumber === 0 && !isConfirmLyricStatus && t('Generate Lyrics')}
              {pageNumber === 0 && isConfirmLyricStatus && t('Edit Lyrics')}
              {pageNumber === 1 && t('Generate Melody')}
            </div>
          </div>

          <div className="mobile-steps">
            <div
              className={`step-icon ${pageNumber === 0 && !isConfirmLyricStatus ? 'active' : ''}`}
            >
              <img src={lyricsCreate} alt="create" />
            </div>
            <div className="step-line"></div>
            <div
              className={`step-icon ${pageNumber === 0 && isConfirmLyricStatus ? 'active' : ''}`}
            >
              <img src={lyricsEdit} alt="edit" />
            </div>
            <div className="step-line"></div>
            <div className={`step-icon ${pageNumber === 1 ? 'active' : ''}`}>
              <img src={MelodyMaker} alt="melody" />
            </div>
          </div>
        </div>
      )}

      <div className="create__sidebar--group">
        <div
          className={`create__sidebar--item ${
            pageNumber === 0 && !isConfirmLyricStatus ? 'active' : ''
          }`}
        >
          <div
            className={`create__sidebar--item--checktitle ${
              pageNumber === 0 && !isConfirmLyricStatus ? '' : 'opacity'
            }`}
          >
            <img src={isConfirmLyricStatus ? checkGreen : checkWhite} />
            <p>{t('Generate Lyrics')}</p>
          </div>
          <img
            className={`create__sidebar--item--icon ${
              pageNumber === 0 && !isConfirmLyricStatus ? '' : 'opacity'
            }`}
            src={lyricsCreate}
            alt="lyrics-create"
          />
        </div>
        <div
          className={`create__sidebar--item ${
            pageNumber === 0 && isConfirmLyricStatus ? 'active' : ''
          }`}
        >
          <div
            className={`create__sidebar--item--checktitle ${
              pageNumber === 0 && isConfirmLyricStatus ? '' : 'opacity'
            }`}
          >
            <img src={pageNumber === 1 ? checkGreen : checkWhite} />
            <p>{t('Edit Lyrics')}</p>
          </div>
          <img
            className={`create__sidebar--item--icon ${
              pageNumber === 0 && isConfirmLyricStatus ? '' : 'opacity'
            }`}
            src={lyricsEdit}
            alt="lyrics-edit"
          />
        </div>
        <div className={'create__sidebar--melody-maker'}>
          <div className={`create__sidebar--item ${pageNumber === 1 ? 'active' : ''}`}>
            <div
              className={`create__sidebar--item--checktitle ${pageNumber === 1 ? '' : 'opacity'}`}
            >
              <img src={checkWhite} />
              <p>{t('Generate Melody')}</p>
            </div>
            <img
              className={`create__sidebar--item--icon ${pageNumber === 1 ? '' : 'opacity'}`}
              src={MelodyMaker}
              alt="melody-maker"
            />
          </div>
          <button
            className={`create__sidebar--item lyrics ${pageNumber === 1 ? 'active' : ''}`}
            onClick={() => {
              setShowLyricsModal(true);
            }}
          >
            <div
              className={`create__sidebar--item--checktitle create__sidebar--item--checktitle--spaced ${
                pageNumber === 1 ? '' : 'opacity'
              }`}
            >
              <p>{pageNumber === 1 ? t('View/Edit Lyrics') : t('Lyrics')}</p>
              <img src={rightArrow} alt="right-arrow opacity" />
            </div>
          </button>
        </div>
      </div>
      <div className="create__sidebar--line"></div>
      {/* 사이드바 UI … */}
      {showLyricsModal && (
        <LyricsModal
          setShowLyricsModal={setShowLyricsModal}
          generatedLyric={generatedLyric}
          onSave={newLyric => setGeneratedLyric(newLyric)} // ← 추가
        />
      )}
    </div>
  );
};

export default CreateSideBar;
