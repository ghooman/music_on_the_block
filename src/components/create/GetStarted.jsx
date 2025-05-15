import './GetStarted.scss';
import { useState } from 'react';
import { WalletConnect } from '../WalletConnect';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';

const GetStarted = ({
  handler,
  createPossibleCount,
  setCreateMode,
  setSelectedLanguage,
  setSelectedVersion,
  selectedVersion,
}) => {
  const { isRegistered, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);

  console.log('selectedVersion', selectedVersion);
  const handleVersionChange = e => {
    setSelectedVersion(e.target.value);
  };

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
      keywords: 'AI Chatbot · Conversation · Flow',
    },
    {
      title: 'General Format',
      description: 'Select and input to create your own song.',
      keywords: 'Selection · Input · Control',
    },
  ];
  const languages = ['한국어', 'English'];

  const handleArticleClick = index => {
    setActiveIndex(index);
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('L&S Plus(V2.2)');

  // 버전 항목 선택
  const handleSelect = (newTitle) => {
    setTitle(newTitle);
    setOpen(false);
  };

  return (
    <div className="create__get-started">
      <h1 className="create__get-started--title">Create Your Own Song With AI</h1>
      <h2 className="create__get-started--subtitle">
        Turn your ideas into beautiful lyrics and melodies with the power of AI
      </h2>
      <div className="create__get-started--features">
        <h3 className="create__get-started--features-title">Code Features</h3>
        <div className="create__get-started--features-items">
          {['Lyrics Generation', 'Melody Composition', 'Style Adaptation'].map((item, index) => (
            <div className="create__get-started--features-item" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="create__get-started--features sequence">
        <div>
          <h3 className="create__get-started--features-title">Cost</h3>
          <p className="create__get-started--features-item">-- MOB</p>
        </div>
        <div>
          <h3 className="create__get-started--features-title">Used</h3>
          <p className="create__get-started--features-item">--</p>
        </div>
        <div>
          <h3 className="create__get-started--features-title">Precision</h3>
          <p className="create__get-started--features-item ">--%</p>
        </div>
      </div>
      <RemainCountButton createPossibleCount={createPossibleCount} />

        <div className={`create__get-started--version${open ? ' active' : ''}`}>
          <p className='create__get-started--version__title'>&lt;Ai Version&gt;</p>
          <div className="create__get-started--version__select">
            <p
              className="create__get-started--version__select__title"
              onClick={() => setOpen(!open)}
            >
              {title}
            </p>
              <ul className="create__get-started--version__select__list">
                <li onClick={() => handleSelect('L&S Plus(V2.2)')}>
                  <p>L&S Plus(V2.2)</p>
                  <span>
                    Advanced AI Model for High-Quality and Extended Song Generation
                  </span>
                </li>
                <li onClick={() => handleSelect('L&S Pro(V2.0)')}>
                  <p>L&S Pro(V2.0)</p>
                  <span>
                    Standard AI Model Offering Enhanced Audio Quality and Stability
                  </span>
                </li>
                <li onClick={() => handleSelect('L&S One(V1.0)')}>
                  <p>L&S One(V1.0)</p>
                  <span>
                    Basic AI Model for Simple Lyrics and Music Composition
                  </span>
                </li>
              </ul>
          </div>
      </div>

      <div className="create__get-started--version">
        <label htmlFor="version">Version</label>
        <select id="version" name="version" onChange={handleVersionChange}>
          <option value="V4_5">L&S Plus(V2.2)</option>
          <option value="mureka-6">L&S Pro(V2.0)</option>
          <option value="topmediai">L&S One(V1.0)</option>

          {/* 이전 버젼 모델들
          <option value="topmediai">topmediai</option>
          <option value="mureka-5.5">mureka-5.5</option>
          <option value="mureka-6">mureka-6</option>
          <option value="V3_5">suno-3.5</option>
          <option value="V4">suno-4</option>
          <option value="V4_5">suno-4.5</option> */}
        </select>
      </div>

      <section className="create__get-started--format">
        {formats.map((format, idx) => (
          <article
            key={idx}
            className={`create__get-started--format-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => handleArticleClick(idx)}
          >
            <h3 className="create__get-started--format-item-title">&lt;{format.title}&gt;</h3>
            <p className="create__get-started--format-item-txt">
              {format.description}
              <span>* Keywords: {format.keywords}</span>
            </p>
            <div className="create__get-started--format-item-select">
              <p className="create__get-started--format-item-select-title">Language selection</p>
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
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            Create
          </button>
        ) : (
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </div>
    </div>
  );
};

export default GetStarted;
