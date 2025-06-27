import './CreateSideBar.scss';
// 아이콘 모음
import checkWhite from '../../assets/images/icons/check-white-icon.svg';
import lyricsCreate from '../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../assets/images/icons/lyrics-edit-icon.svg';
import MelodyMaker from '../../assets/images/icons/melody-maker-icon.svg';
import rightArrow from '../../assets/images/icons/right-arrow-icon.svg';

const CreateSideBar = ({ pageNumber, generatedLyric }) => {
  console.log('사이드바에서 받음', pageNumber);
  console.log('사이드바에서 가사 생성확인', generatedLyric);
  // pageNumber가 0, generatedLyric이 ''이면 갸사 생성 박스 활성
  // pageNumber가 0, generatedLyric이 값이 있으면 갸사 수정 박스 활성
  // pageNumber가 1, generatedLyric이 값이 있으면 멜로디 생성 박스 활성
  //   if (pageNumber == 0 && generatedLyric == null) {
  //     document.querySelectorAll('.create__sidebar--item--checktitle')[0].classList.remove('opacity');
  //     document.querySelectorAll('.create__sidebar--item--icon')[0].classList.remove('opacity');
  //     document.querySelectorAll('.create__sidebar--item')[0].style.border =
  //       '1px solid var(--White-10, rgba(255, 255, 255, 0.10))';
  //     document.querySelectorAll('.create__sidebar--item')[0].style.background = '#303030';
  //   }

  return (
    <div className="create__sidebar">
      <div className="create__sidebar--group">
        <div className="create__sidebar--item">
          <div
            className={`create__sidebar--item--checktitle ${
              pageNumber === 0 && generatedLyric?.length < 0 ? 'opacity' : ''
            }`}
          >
            <img src={checkWhite} />
            <p>가사 생성</p>
          </div>
          <img
            className={`create__sidebar--item--icon ${
              pageNumber === 0 && generatedLyric?.length < 0 ? 'opacity' : ''
            }`}
            src={lyricsCreate}
            alt="lyrics-create"
          />
        </div>
        <div className="create__sidebar--item">
          <div className={`create__sidebar--item--checktitle`}>
            <img src={checkWhite} />
            <p>가사 수정</p>
          </div>
          <img className="create__sidebar--item--icon opacity" src={lyricsEdit} alt="lyrics-edit" />
        </div>
        <div className="create__sidebar--melody-maker">
          <div className="create__sidebar--item">
            <div className="create__sidebar--item--checktitle opacity">
              <img src={checkWhite} />
              <p>멜로디 생성</p>
            </div>
            <img
              className="create__sidebar--item--icon opacity"
              src={MelodyMaker}
              alt="melody-maker"
            />
          </div>
          <div className="create__sidebar--item lyrics">
            <div className="create__sidebar--item--checktitle create__sidebar--item--checktitle--spaced opacity">
              <p>가사</p>
              <img src={rightArrow} alt="right-arrow opacity" />
            </div>
          </div>
        </div>
      </div>
      <div className="create__sidebar--line"></div>
    </div>
  );
};

export default CreateSideBar;
