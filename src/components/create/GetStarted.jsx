import './GetStarted.scss';
import { useState } from 'react';
import ExpandedButton from './ExpandedButton';
import { WalletConnect } from '../WalletConnect';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';
const GetStarted = ({ handler, createPossibleCount, setCreateMode, setSelectedLanguage }) => {
    const { isRegistered, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);

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

    const handleArticleClick = (index) => {
        setActiveIndex(index);
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

            {/* <section className="create__get-started--format ">
        <article className="create__get-started--format-item active">
          <h3 className="create__get-started--format-item-title">
            &lt;Chatbot Format&gt;
          </h3>
          <p className="create__get-started--format-item-txt">
            Chat with AI to create your own song.
            <span>* Keywords: AI Chatbot · Conversation · Flow</span>
          </p>
          <div className="create__get-started--format-item-select">
            <p className="create__get-started--format-item-select-title">Language selection</p>
            <div className="create__get-started--format-item-select-items">
            <div class="container">
              <div class="radio">
                <input id="radio-1" name="radio" type="radio" checked/>
                <label for="radio-1" class="radio-label">한국어</label>
              </div>
              <div class="radio">
                <input id="radio-2" name="radio" type="radio"/>
                <label  for="radio-2" class="radio-label">English</label>
              </div>
            </div>
            </div>
          </div>
        </article>
        <article className="create__get-started--format-item">
          <h3 className="create__get-started--format-item-title">
            &lt;General Format&gt;
          </h3>
          <p className="create__get-started--format-item-txt">
            Select and input to create your own song.
            <span>* Keywords: Selection · Input · Control</span>
          </p>
          <div className="create__get-started--format-item-select">
            <p className="create__get-started--format-item-select-title">Language selection</p>
            <div className="create__get-started--format-item-select-items">
            <div class="container">
              <div class="radio">
                <input id="radio-1" name="radio" type="radio" checked/>
                <label for="radio-1" class="radio-label">한국어</label>
              </div>
              <div class="radio">
                <input id="radio-2" name="radio" type="radio"/>
                <label  for="radio-2" class="radio-label">English</label>
              </div>
            </div>
            </div>
          </div>
        </article>
      </section> */}

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

            {/* <div className="create__btn">
        {isRegistered && activeIndex !== null ? (
          <ExpandedButton
            className={`create__get-started--button ${
              createPossibleCount === 0 ? "disabled" : ""
            }`}
            onClick={() => {
              const mode = activeIndex === 0 ? "chatbot" : "select";
              handler();
              setCreateMode(mode);
            }}
            disabled={createPossibleCount === 0}
          >
            Create
          </ExpandedButton>
        ) : (
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </div> */}

            <div className="create__btn">
                {isRegistered ? (
                    <button
                        className={`create__get-started--button ${
                            createPossibleCount === 0 || activeIndex === null ? 'disabled' : ''
                        }`}
                        onClick={() => {
                            if (activeIndex === null) return; // 포맷 선택 전이면 동작 막음
                            const mode = activeIndex === 0 ? 'chatbot' : 'select';
                            handler();
                            setCreateMode(mode);
                        }}
                        disabled={createPossibleCount === 0 || activeIndex === null}
                    >
                        {/* {activeIndex === 0
              ? "ChatBot Create"
              : activeIndex === 1
              ? "General Create"
              : "Select Format"} */}
                        Create
                    </button>
                ) : (
                    <WalletConnect onConnect={handleWalletConnect} />
                )}
            </div>

            {/* {isRegistered ? (
        <ExpandedButton
          className={`create__get-started--button ${
            createPossibleCount === 0 ? "disabled" : ""
          }`}
          onClick={() => {
            handler();
            setCreateMode("select");
          }}
          disabled={createPossibleCount === 0}
        >
          Create
        </ExpandedButton>
      ) : (
        <WalletConnect onConnect={handleWalletConnect} />
      )}
      {isRegistered ? (
        <ExpandedButton
          className={`create__get-started--button ${
            createPossibleCount === 0 ? "disabled" : ""
          }`}
          onClick={() => {
            handler();
            setCreateMode("chatbot");
          }}
          disabled={createPossibleCount === 0}
        >
          ChatBot Create
        </ExpandedButton>
      ) : (
        <WalletConnect onConnect={handleWalletConnect} />
      )} */}
        </div>
    );
};

export default GetStarted;
