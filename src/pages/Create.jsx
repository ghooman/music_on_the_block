// pages/Create.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ExpandedButton from '../components/create/ExpandedButton';
import LyricLab from '../components/create/LyricLab';
import MelodyMaker from '../components/create/MelodyMaker';
import LyricChatBot from '../components/create/chatbot/LyricChatBot';
import MelodyChatBot from '../components/create/chatbot/MelodyChatBot';
import DescriptionBanner from '../components/create/DescriptionBanner';
import GetStarted from '../components/create/GetStarted';
import AlbumCoverStudio from '../components/create/AlbumCoverStudio';
import Finalize from '../components/create/Finalize';
import CreateCompleteModal from '../components/CreateCompleteModal';
import SkipModal from '../components/SkipModal';
import '../styles/Create.scss';
import { getCreatePossibleCount } from '../api/getCreatePossibleCount';
import { useUserDetail } from '../hooks/useUserDetail';
import ErrorModal from '../components/modal/ErrorModal';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const { token, walletAddress, isRegistered } = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [pageNumber, setPageNumber] = useState(-1); // -1: 시작화면, 0: 가사 생성, 1: 멜로디 생성, 2: 앨범 커버 스튜디오, 3: 미리보기 및 최종화면
  const [createMode, setCreateMode] = useState(''); // chatbot, select
  const [createLoading, setCreateLoading] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('V4_5');
  const [selectedPrivacy, setSelectedPrivacy] = useState('release');
  const [selectedCreationMode, setSelectedCreationMode] = useState('song');
  const { data: userData, refetch } = useUserDetail();

  // i18n 언어에 따른 selectedLanguage 자동 설정
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const currentLanguage = i18n.language;
    return currentLanguage === '한국어' ? 'KOR' : currentLanguage === 'English' ? 'ENG' : 'IDN';
  });

  // i18n 언어 변경 감지
  useEffect(() => {
    const currentLanguage = i18n.language;
    if (currentLanguage === '한국어') {
      setSelectedLanguage('KOR');
    } else if (currentLanguage === 'English') {
      setSelectedLanguage('ENG');
    } else if (currentLanguage === 'Indonesia') {
      setSelectedLanguage('IDN');
    } else if (currentLanguage === '日本語') {
      setSelectedLanguage('JPN');
    } else if (currentLanguage === 'Tiếng Việt') {
      setSelectedLanguage('VIE');
    }
  }, [i18n.language]);
  // 사용자 생성 상태 확인 함수
  const checkUserCreatingStatus = async () => {
    try {
      // refetch가 반환하는 객체에서 최신 데이터를 꺼내 쓴다
      const { data: freshUser } = await refetch();

      if (freshUser?.is_creating) {
        setShowErrorModal(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('유저 정보 조회 실패:', error);
      return false;
    }
  };

  // 시작 페이지에서 다음 페이지로 이동하는 핸들러
  const handleStartPageNext = async () => {
    const isCreating = await checkUserCreatingStatus();
    if (!isCreating) {
      // BGM 모드인 경우 가사 생성 단계를 건너뛰고 바로 멜로디 생성 단계로 이동
      if (selectedCreationMode === 'bgm') {
        setPageNumber(1);
      } else {
        setPageNumber(0);
      }
    }
  };

  // 회원가입이나 지갑 연결이 필요한 단계(예: pageNumber가 0 이상)에서는 검사
  useEffect(() => {
    if (pageNumber >= 0 && (!walletAddress || !isRegistered)) {
      // 조건에 맞지 않으면 메인 페이지로 이동
      navigate('/');
    }
  }, [pageNumber, walletAddress, isRegistered]);

  const [lyricData, setLyricData] = useState({
    lyric_tag: [],
    lyric_genre: [],
  });
  const [lyricStory, setLyricStory] = useState('');
  const [melodyData, setMelodyData] = useState({
    melody_tag: [],
    melody_genre: [],
    melody_gender: [],
    melody_instrument: [],
    melody_tempo: [],
    melody_detail: [],
    melody_title: [],
    melody_introduction: [],
  });
  const [melodyDetail, setMelodyDetail] = useState('');
  // 남은 생성횟수 확인
  const [createPossibleCount, setCreatePossibleCount] = useState(0);
  useEffect(() => {
    const fetchCreatePossibleCount = async () => {
      try {
        const response = await getCreatePossibleCount(token);
        setCreatePossibleCount(response.data);
      } catch (error) {
        console.error('Error fetching create possible count:', error);
      }
    };

    fetchCreatePossibleCount();
  }, [token]);

  const [generatedLyric, setGeneratedLyric] = useState('');
  const [generatedMusicResult, setGeneratedMusicResult] = useState(null);
  const [tempo, setTempo] = useState([90]);
  const [songLength, setSongLength] = useState([90]);
  const [skipLyric, setSkipLyric] = useState(false);
  const [skipMelody, setSkipMelody] = useState(false);
  const [skip, setSkip] = useState('');
  const [albumCover, setAlbumCover] = useState(null);

  const skipHandler = () => {
    if (skip === 'lyrics') {
      setSkipLyric(true);
    } else {
      setSkipMelody(true);
    }
    setPageNumber(prev => prev + 1);
    setSkip(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageNumber]);

  if (pageNumber === -1)
    return (
      <>
        <GetStarted
          handler={handleStartPageNext}
          createPossibleCount={createPossibleCount}
          setCreateMode={setCreateMode}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedVersion={setSelectedVersion}
          selectedVersion={selectedVersion}
          selectedPrivacy={selectedPrivacy}
          setSelectedPrivacy={setSelectedPrivacy}
          selectedCreationMode={selectedCreationMode}
          setSelectedCreationMode={setSelectedCreationMode}
        />
        {showErrorModal && (
          <ErrorModal
            title="Cannot create duplicates"
            message={['Song generation is in progress.', "You can proceed after it's done."]}
            setShowErrorModal={setShowErrorModal}
            button={true}
          />
        )}
      </>
    );

  const isLyricPage = pageNumber === 0;
  const isMelodyPage = pageNumber === 1;
  return (
    <div className="music_create">
      <Title />
      <Progress pageNumber={pageNumber} />
      <DescriptionBanner pageNumber={pageNumber} />
      {createMode === 'chatbot' && (
        <>
          {pageNumber === 0 && (
            <LyricChatBot
              createLoading={createLoading}
              setCreateLoading={setCreateLoading}
              lyricData={lyricData}
              setLyricData={setLyricData}
              lyricStory={lyricStory}
              setLyricStory={setLyricStory}
              setGeneratedLyric={setGeneratedLyric}
              generatedLyric={generatedLyric}
              setPageNumber={setPageNumber}
              selectedLanguage={selectedLanguage}
              selectedVersion={selectedVersion}
            />
          )}
          {pageNumber === 1 && (
            <MelodyChatBot
              createLoading={createLoading}
              setCreateLoading={setCreateLoading}
              lyricData={lyricData}
              melodyData={melodyData}
              setMelodyData={setMelodyData}
              lyricStory={lyricStory}
              setLyricStory={setLyricStory}
              generatedLyric={generatedLyric}
              setPageNumber={setPageNumber}
              selectedLanguage={selectedLanguage}
              albumCover={albumCover}
              setAlbumCover={setAlbumCover}
              generatedMusicResult={generatedMusicResult}
              setGeneratedMusicResult={setGeneratedMusicResult}
              finalPrompt={finalPrompt}
              setFinalPrompt={setFinalPrompt}
              selectedVersion={selectedVersion}
              selectedPrivacy={selectedPrivacy}
              selectedCreationMode={selectedCreationMode}
              songLength={songLength}
              setSongLength={setSongLength}
            />
          )}
        </>
      )}
      {createMode === 'select' && (
        <>
          {pageNumber === 0 && (
            <LyricLab
              createMode={createMode}
              setCreateMode={setCreateMode}
              lyricData={lyricData}
              setLyricData={setLyricData}
              lyricStory={lyricStory}
              setLyricStory={setLyricStory}
              generatedLyric={generatedLyric}
              setGeneratedLyric={setGeneratedLyric}
              onSkip={() => setSkip('lyrics')}
              setPageNumber={setPageNumber}
              melodyData={melodyData}
              tempo={tempo}
              SelectedWrap={SelectedWrap}
              SelectedItem={SelectedItem}
              isLyricPage={isLyricPage}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              createPossibleCount={createPossibleCount}
              albumCover={albumCover}
              setAlbumCover={setAlbumCover}
              selectedVersion={selectedVersion}
            ></LyricLab>
          )}
          {pageNumber === 1 && (
            <MelodyMaker
              lyricData={lyricData}
              lyricStory={lyricStory}
              melodyData={melodyData}
              setMelodyData={setMelodyData}
              melodyDetail={melodyDetail}
              setMelodyDetail={setMelodyDetail}
              tempo={tempo}
              setTempo={setTempo}
              generatedLyric={generatedLyric}
              generatedMusicResult={generatedMusicResult}
              setGeneratedMusicResult={setGeneratedMusicResult}
              onSkip={() => setSkip('melody')}
              setPageNumber={setPageNumber}
              SelectedWrap={SelectedWrap}
              SelectedItem={SelectedItem}
              isMelodyPage={isMelodyPage}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              createPossibleCount={createPossibleCount}
              albumCover={albumCover}
              setAlbumCover={setAlbumCover}
              finalPrompt={finalPrompt}
              setFinalPrompt={setFinalPrompt}
              selectedVersion={selectedVersion}
              selectedPrivacy={selectedPrivacy}
              selectedCreationMode={selectedCreationMode}
              songLength={songLength}
              setSongLength={setSongLength}
            ></MelodyMaker>
          )}
        </>
      )}
    </div>
  );
};

export default Create;

const Title = () => {
  const { t } = useTranslation('song_create');

  return <h1 className="title">{t('Recommended Music Source')}</h1>;
};

const Progress = ({ pageNumber }) => {
  const { t } = useTranslation('song_create');

  const pages = [
    'Lyrics Lab',
    'Melody Maker',
    // "Alubum Cover Studio",
    // "Preview & Finalize",
  ];

  return (
    <div className="progress mb40">
      {pages.map((item, index, { length }) => (
        <React.Fragment key={item}>
          <div className="progress__item">
            <div className={`progress__square ${pageNumber >= index ? 'enable' : ''}`}></div>
            <p className={`progress__text ${pageNumber >= index ? 'enable' : ''}`}>{t(item)}</p>
          </div>
          {length - 1 > index && (
            <span className={`progress__arrow ${pageNumber >= index ? 'enable' : ''}`}></span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const SelectedWrap = ({ children, title }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(prev => !prev);
  };
  return (
    <div className={`selected-wrap ${isActive ? 'active' : ''}`}>
      <h2 className="wrap-title" onClick={handleToggle}>
        {title}
      </h2>
      <div className="wrap-content">{children}</div>
    </div>
  );
};

const SelectedItem = ({ title, value, multiple }) => {
  return (
    <div className={`selected-item ${multiple ? 'multiple' : ''}`}>
      <p className="item-title">{title}</p>
      <div className="item-value">
        {value?.length > 0 ? (
          value.map(item => {
            if (!multiple) {
              return (
                <span className={`values`} key={item}>
                  {item}
                </span>
              );
            } else {
              return <button className="values multiple">{item}</button>;
            }
          })
        ) : (
          <p className="values">-</p>
        )}
      </div>
    </div>
  );
};
