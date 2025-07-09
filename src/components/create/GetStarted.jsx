import './GetStarted.scss';
import { useState, useEffect } from 'react';
import { WalletConnect } from '../WalletConnect';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import lockIcon from '../../assets/images/icons/lock-icon.svg';
import typeIcon from '../../assets/images/icons/type-icon.svg';
import versionIcon from '../../assets/images/icons/version-icon.svg';
import chatbotModeIcon from '../../assets/images/icons/chatbotmode-icon.svg';
import standardModeIcon from '../../assets/images/icons/standardmode-icon.svg';
import rightArrow from '../../assets/images/icons/right-arrow-icon.svg';
import React from 'react';

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
  const navigate = useNavigate();
  const { isLoggedIn, isRegistered, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);
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
      title: 'Chatbot Mode',
      type: 'chatbot',
      description: t(`Create music through a conversation with AI
For boundless creativity, choose Chatbot Mode!`),
      keywords: [],
    },
    {
      title: 'Standard Mode',
      type: 'standard',
      description: t(`Choose from a variety of options
If you need guidance, go with Standard Mode!`),
      keywords: [],
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
  const remainCount = isLoggedIn ? createPossibleCount : 0;

  // radio 버튼 상태
  return (
    <div className="create__get-started">
      <div className="create__get-started--media-title">
        <div className="create__get-started--media-title--group">
          <img
            src={rightArrow}
            alt="right-arrow"
            onClick={() => navigate('/')} // 메인 페이지로 이동
            style={{ cursor: 'pointer' }} // 클릭 가능하게 마우스 커서 설정
          />

          <p>{t('AI Music Writing')}</p>
        </div>
      </div>

      <div className="create__get-started--title--section">
        <h1 className="create__get-started--title">
          {t('Ready to create your own music with AI?')}
        </h1>
        <RemainCountButton createPossibleCount={remainCount} />
      </div>

      <div className="create__get-started--radio-box">
        <h3 className="create__get-started--radio-box--title">
          {t('Music Creation Basic Settings')}
        </h3>
        <div className="created__get-started--radio-box-group">
          <div className="created__get-started--privacy">
            <div className="creation-mode-options">
              <div className="creation-mode-title">
                <img src={lockIcon} alt="lock icon" />
                <p>{t('Music Visibility')}</p>
              </div>
              <div className="privacy-option-group">
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
          </div>

          <div className="created__get-started--creation-mode">
            <div className="creation-mode-options">
              <div className="creation-mode-title">
                <img src={typeIcon} alt="type icon" />
                <p>{t('Music Type')}</p>
              </div>
              <div className="privacy-option-group">
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="song"
                    name="creationMode"
                    value="song"
                    checked={selectedCreationMode === 'song'}
                    onChange={e => setSelectedCreationMode(e.target.value)}
                  />
                  <label htmlFor="song">{t('SONG')}</label>
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
                  <label htmlFor="bgm">{t('BGM')}</label>
                </div>
              </div>
            </div>
          </div>
          <div className="created__get-started--version">
            <div className="version-mode-options">
              <div className="version-mode-title">
                <img src={versionIcon} alt="version icon" />
                <p>{t('Select AI Version')}</p>
              </div>
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
                      <span>{t('Premium model – long, high-quality songs')}</span>
                    </li>
                    <li
                      className={!versionList.mureka ? 'disabled' : ''}
                      onClick={() => versionList.mureka && handleSelect('L&S Pro(V2.0)')}
                    >
                      <p>L&S Pro(V2.0)</p>
                      <span>{t('Standard model – better sound & stability')}</span>
                    </li>
                    <li
                      className={!versionList.topmediai ? 'disabled' : ''}
                      onClick={() => versionList.topmediai && handleSelect('L&S One(V1.0)')}
                    >
                      <p>L&S One(V1.0)</p>
                      <span>{t('Basic model – simple lyrics & music')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="create__get-started--format">
        <h3 className="create__get-started--format-title">{t('Select Creation Format')}</h3>
        <div className="create__get-started--format-item-group">
          {formats.map((format, idx) => (
            <article
              key={idx}
              className={`create__get-started--format-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => handleArticleClick(idx)}
            >
              {/* 아이콘 삽입 */}
              <img
                className="create__get-started--format-item-icon"
                src={format.type === 'chatbot' ? chatbotModeIcon : standardModeIcon}
                alt={`${format.title} icon`}
              />
              <h3 className="create__get-started--format-item-title">{t(format.title)}</h3>
              <p className="create__get-started--format-item-txt">
                {format.description.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="create__btn">
        {isLoggedIn ? (
          /* ① 로그인한 경우 – ‘Create’ 버튼 */
          <button
            className={`create__get-started--button ${
              remainCount === 0 || activeIndex === null ? 'disabled' : ''
            }`}
            onClick={() => {
              if (activeIndex === null || remainCount === 0) return;
              const mode = activeIndex === 0 ? 'chatbot' : 'select';
              setCreateMode(mode);
              handler();
            }}
            disabled={remainCount === 0 || activeIndex === null}
          >
            {t('Start Music Creation')}
          </button>
        ) : (
          /* ② 로그인하지 않은 경우 – 로그인/지갑 연결 컴포넌트 */
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </div>
    </div>
  );
};

export default GetStarted;
