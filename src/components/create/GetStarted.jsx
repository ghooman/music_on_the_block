import './GetStarted.scss';
import { useState, useEffect } from 'react';
import { WalletConnect } from '../WalletConnect';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';
import { useTranslation } from 'react-i18next';
import lockIcon from '../../assets/images/create/icons/lock-icon.svg';
import typeIcon from '../../assets/images/create/icons/type-icon.svg';
import versionIcon from '../../assets/images/create/icons/version-icon.svg';
import axios from 'axios';

const GetStarted = ({
  handler,
  createPossibleCount,
  setCreateMode,
  setSelectedLanguage,
  setSelectedVersion,
  selectedVersion,
  selectedPrivacy,
  setSelectedPrivacy,
  selectedCreationMode,
  setSelectedCreationMode,
}) => {
  const { t } = useTranslation('song_create');
  const { isRegistered, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };
  const [activeIndex, setActiveIndex] = useState(null);
  const formats = [
    {
      title: 'Chatbot Format',
      description: 'Chat with AI to create your own song.',
      keywords: ['AI Chatbot', 'Conversation', 'Flow'],
    },
    {
      title: 'General Format',
      description: 'Select and input to create your own song.',
      keywords: ['Selection', 'Input', 'Control'],
    },
  ];

  const handleArticleClick = index => {
    setActiveIndex(index);
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('L&S Plus(V2.2)');

  const [versionList, setVersionList] = useState([]);

  useEffect(() => {
    const fetchVersionList = async () => {
      const res = await axios.get(`${serverApi}/api/music/ai/active`);
      // setVersionList({ suno: true, mureka: true, topmediai: true });
      setVersionList(res.data);
      setTitle(
        res.data.suno ? 'L&S Plus(V2.2)' : res.data.mureka ? 'L&S Pro(V2.0)' : 'L&S One(V1.0)'
      );
    };
    fetchVersionList();
  }, []);
  // 버전 항목 선택
  const handleSelect = newTitle => {
    setTitle(newTitle);
    setOpen(false);
    if (newTitle === 'L&S Plus(V2.2)') {
      setSelectedVersion('V4_5');
    } else if (newTitle === 'L&S Pro(V2.0)') {
      setSelectedVersion('mureka-6');
    } else if (newTitle === 'L&S One(V1.0)') {
      setSelectedVersion('topmediai');
    }
  };
  // radio 버튼 상태
  return (
    <div className="create__get-started">
      <h1 className="create__get-started--title">{t('Create Your Own Song With AI')}</h1>
      <RemainCountButton createPossibleCount={createPossibleCount} />
      <div className="create__get-started--radio-box">
        <div className="created__get-started--privacy">
          <h3>{t('음악 생성 기본설정')}</h3>
          <div className="create__get-started--radio-box-item">
            {/* 옵션 선택 (릴리즈 선택 박스 ) */}
            <div className="creation-mode-options">
              <div className="create__get-started--radio-box-item-icon">
                <img src={lockIcon} alt="lock" />
                <p className="create__get-started--radio-box-item-icon-title">
                  {t('음악 공개 여부')}
                </p>
              </div>
              <div className="create__get-started--radio-box-item-content">
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="release"
                    name="privacy"
                    value="release"
                    checked={selectedPrivacy === 'release'}
                    onChange={e => setSelectedPrivacy(e.target.value)}
                  />
                  <label htmlFor="release">{t('Release')}</label>
                </div>
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="unrelease"
                    name="privacy"
                    value="unrelease"
                    checked={selectedPrivacy === 'unrelease'}
                    onChange={e => setSelectedPrivacy(e.target.value)}
                  />
                  <label htmlFor="unrelease">{t('Unrelease')}</label>
                </div>
              </div>
            </div>
            {/* 옵션 선택 (음악 타입 설정 모드) */}
            <div className="creation-mode-options">
              <div className="create__get-started--radio-box-item-icon">
                <img src={typeIcon} alt="type" />
                <p className="create__get-started--radio-box-item-icon-title">{t('음악 타입')}</p>
              </div>
              <div className="create__get-started--radio-box-item-content">
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="song"
                    name="creationMode"
                    value="song"
                    checked={selectedCreationMode === 'song'}
                    onChange={e => setSelectedCreationMode(e.target.value)}
                  />
                  <label htmlFor="song">{t('Song')}</label>
                </div>
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="bgm"
                    name="creationMode"
                    value="bgm"
                    checked={selectedCreationMode === 'bgm'}
                    onChange={e => setSelectedCreationMode(e.target.value)}
                  />
                  <label htmlFor="bgm">BGM</label>
                </div>
              </div>
            </div>
            {/* 옵션 선택 (Ai 버전 선택 박스) */}
            <div className="creation-mode-options version-selection">
              <div className="create__get-started--radio-box-item-icon">
                <img src={versionIcon} alt="version" />
                <p className="create__get-started--radio-box-item-icon-title">
                  {t('AI 버전 선택')}
                </p>
              </div>{' '}
              <div className={`create__get-started--version${open ? ' active' : ''}`}>
                <div className="create__get-started--version__select">
                  <p
                    className="create__get-started--version__select__title"
                    onClick={() => setOpen(!open)}
                  >
                    {title}
                  </p>
                  <ul className="create__get-started--version__select__list">
                    <li
                      className={!versionList.suno ? 'disabled' : ''}
                      onClick={() => versionList.suno && handleSelect('L&S Plus(V2.2)')}
                    >
                      <p>L&S Plus(V2.2)</p>
                      <span>
                        {t('Advanced AI Model for High-Quality and Extended Song Generation')}
                      </span>
                    </li>
                    <li
                      className={!versionList.mureka ? 'disabled' : ''}
                      onClick={() => versionList.mureka && handleSelect('L&S Pro(V2.0)')}
                    >
                      <p>L&S Pro(V2.0)</p>
                      <span>
                        {t('Standard AI Model Offering Enhanced Audio Quality and Stability')}
                      </span>
                    </li>
                    <li
                      className={!versionList.topmediai ? 'disabled' : ''}
                      onClick={() => versionList.topmediai && handleSelect('L&S One(V1.0)')}
                    >
                      <p>L&S One(V1.0)</p>
                      <span>{t('Basic AI Model for Simple Lyrics and Music Composition')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="create__get-started--format">
        {formats.map((format, idx) => (
          <article
            key={idx}
            className={`create__get-started--format-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => handleArticleClick(idx)}
          >
            <h3 className="create__get-started--format-item-title">&lt;{t(format.title)}&gt;</h3>
            <p className="create__get-started--format-item-txt">
              {t(format.description)}
              <span>
                * {t('Keywords')}:{' '}
                {format.keywords.map((keyword, index, { length }) => {
                  let suffix = index === length - 1 ? '' : ' · ';
                  return t(keyword) + suffix;
                })}
              </span>
            </p>
            {/* <div className="create__get-started--format-item-select">
              <p className="create__get-started--format-item-select-title">
                {t('Language selection')}
              </p>
              <div className="create__get-started--format-item-select-items">
                <div className="container">
                  {languages.map((lang, langIdx) => (
                    <div className="radio" key={langIdx}>
                      <input
                        id={`radio-${idx}-${langIdx}`}
                        name={`radio-${idx}`}
                        type="radio"
                        disabled={activeIndex !== idx}
                        defaultChecked={langIdx === 0}
                        onChange={() => {
                          setSelectedLanguage(lang === '한국어' ? 'KOR' : 'ENG');
                        }}
                      />
                      <label htmlFor={`radio-${idx}-${langIdx}`} className="radio-label">
                        {t(lang)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </article>
        ))}
      </section>

      <div className="create__btn">
        {isRegistered ? (
          <button
            className={`create__get-started--button ${
              createPossibleCount === 0 || activeIndex === null ? 'disabled' : ''
            }`}
            onClick={() => {
              if (activeIndex === null) return; // 포맷 선택 전이면 동작 막음
              const mode = activeIndex === 0 ? 'chatbot' : 'select';
              setCreateMode(mode);
              handler();
            }}
            disabled={createPossibleCount === 0 || activeIndex === null}
          >
            {t('Create')}
          </button>
        ) : (
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </div>
    </div>
  );
};

export default GetStarted;
