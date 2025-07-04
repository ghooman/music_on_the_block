import './CreateSideBar.scss';
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
  console.log('사이드바에서 받음', pageNumber);
  console.log('isConfirmLyricStatus', isConfirmLyricStatus);
  // pageNumber가 0, generatedLyric이 ''이면 갸사 생성 박스 활성
  // pageNumber가 0, generatedLyric이 값이 있으면 갸사 수정 박스 활성
  // pageNumber가 1, generatedLyric이 값이 있으면 멜로디 생성 박스 활성
  //   if (pageNumber == 0 && isConfirmLyricStatus == null) {
  //     document.querySelectorAll('.create__sidebar--item--checktitle')[0].classList.remove('opacity');
  //     document.querySelectorAll('.create__sidebar--item--icon')[0].classList.remove('opacity');
  //     document.querySelectorAll('.create__sidebar--item')[0].style.border =
  //       '1px solid var(--White-10, rgba(255, 255, 255, 0.10))';
  //     document.querySelectorAll('.create__sidebar--item')[0].style.background = '#303030';
  //   }

  return (
    <div className="create__sidebar">
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
            <p>가사 생성</p>
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
            <p>가사 수정</p>
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
              <p>멜로디 생성</p>
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
              <p>{pageNumber === 1 ? '가사보기/수정' : '가사'}</p>
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
