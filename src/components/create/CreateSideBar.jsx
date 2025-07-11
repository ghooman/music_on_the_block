import './CreateSideBar.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';

// 아이콘 모음
import checkWhite from '../../assets/images/icons/check-white-icon.svg';
import checkGreen from '../../assets/images/icons/check-green-icon.svg';
import lyricsCreate from '../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../assets/images/icons/lyrics-edit-icon.svg';
import MelodyMaker from '../../assets/images/icons/melody-maker-icon.svg';
import rightArrow from '../../assets/images/icons/right-arrow-icon.svg';
import LyricsModal from '../LyricsModal';
import { badwords } from '../../data/badwords';
import ErrorModal from '../modal/ErrorModal';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const stepIcons = [
    { default: lyricsCreate, done: checkGreen },
    { default: lyricsEdit, done: checkGreen },
    { default: MelodyMaker, done: checkGreen },
  ];
  const getIconSrc = idx => {
    // idx 0: 가사 생성, idx 1: 가사 편집, idx 2: 멜로디
    const isDone =
      (idx === 0 && isConfirmLyricStatus) || // 가사 생성 완료
      (idx === 1 && pageNumber === 1); // 가사 편집 완료
    return isDone ? stepIcons[idx].done : stepIcons[idx].default;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 가사의 부적절한 단어 포함 감지
  const hasBadwords = (text = '') => {
    const normalizedText = text.replace(/\s+/g, '').toLowerCase();
    return badwords.some(word => normalizedText.includes(word));
  };

  // 가사 부적절한 단어 포함 시, 에러 모달 띄우기 위함
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="create__sidebar">
      {isMobile && (
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
            {[0, 1, 2].map(idx => (
              <Fragment key={idx}>
                {/* ① 아이콘 */}
                <div
                  className={`step-icon ${
                    (idx === 0 && pageNumber === 0 && !isConfirmLyricStatus) ||
                    (idx === 1 && pageNumber === 0 && isConfirmLyricStatus) ||
                    (idx === 2 && pageNumber === 1)
                      ? 'active'
                      : ''
                  }`}
                >
                  <img src={getIconSrc(idx)} alt="step" />
                </div>

                {/* ② 아이콘 뒤에 선 넣기 (마지막 아이콘은 제외) */}
                {idx < 2 && <div className="step-line" />}
              </Fragment>
            ))}
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
            type="button"
            className={`
    create__sidebar--item lyrics
    ${pageNumber === 1 ? 'active' : ''}
    ${pageNumber !== 1 ? 'disabled' : ''}
  `}
            disabled={pageNumber !== 1}
            onClick={() => {
              if (pageNumber === 1) setShowLyricsModal(true); // ✔️ 안전 가드
            }}
          >
            <div
              className={`
      create__sidebar--item--checktitle
      create__sidebar--item--checktitle--spaced
      ${pageNumber === 1 ? '' : 'opacity'}
    `}
            >
              <p>{pageNumber === 1 ? t('View/Edit Lyrics') : t('Lyrics')}</p>
              <img src={rightArrow} alt="arrow" />
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
          onSave={newLyric => {
            if (hasBadwords(newLyric)) {
              setErrorTitle(t('Music cannot be generated.'));
              setErrorMessage(
                t(`Inappropriate or offensive words were detected in the lyrics.
Please revise the lyrics and try again.`)
              );
              setShowErrorModal(true);
              return;
            }
            setGeneratedLyric(newLyric);
          }} // ← 추가
        />
      )}
      {isMobile && pageNumber === 1 && (
        <button className="mobile-lyrics-btn" onClick={() => setShowLyricsModal(true)}>
          {/* 필요하면 아이콘도 추가 */}
          {t('View/Edit Lyrics')}
        </button>
      )}
      {showErrorModal && (
        <ErrorModal
          title={errorTitle}
          message={errorMessage}
          button={true}
          setShowErrorModal={setShowErrorModal}
        />
      )}
    </div>
  );
};

export default CreateSideBar;
