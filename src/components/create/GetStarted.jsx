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
import chatbotImg from '../../assets/images/create/create-chat.png';
import generalImg from '../../assets/images/create/create-general.png';
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
      description: [
        'AI와 대화하며 편하게 음악을 생성할 수 있어요',
        '무궁무진한 자유로움을 원한다면, 챗봇 형식!',
      ],
      img: chatbotImg,
    },
    {
      title: 'General Format',
      description: [
        '다양한 옵션 중 원하는 것을 골라보세요',
        '제작이 어려워 선택지가 필요하다면, 일반 형식!',
      ],
      img: generalImg,
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
        <h3 className="create__get-started--format-title">{t('음악 생성 형식')}</h3>
        <div className="create__get-started--format-container">
          {formats.map((format, idx) => (
            <article
              key={idx}
              className={`create__get-started--format-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => handleArticleClick(idx)}
            >
              <div className="create__get-started--format-item-info">
                <h3 className="create__get-started--format-item-title">{t(format.title)}</h3>
                <p className="create__get-started--format-item-txt">
                  {format.description.map((desc, idx) => (
                    <span key={idx}>{t(desc)}</span>
                  ))}
                </p>
              </div>
              <div className="create__get-started--format-item-img">
                <img src={format.img} alt="format" />
              </div>
            </article>
          ))}
        </div>
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
