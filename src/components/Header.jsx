import React, { useState, useEffect } from 'react';
import './Header.scss';
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from 'react-router-dom';
// import LogoHansung from "../assets/images/";
import Album from '../pages/Album';
import PreparingModal from './PreparingModal';

//이미지
// import mainLogo from '../assets/images/header/logo.svg';
import mainLogo from '../assets/images/header/header-logo.png';
import betaLogo from '../assets/images/header/beta.svg';
import closeIcon from '../assets/images/close.svg';
import Menu from './Menu';
import MyPage from '../pages/MyPage';
import SignInModal from './SignInModal';
import CreateLoading from './CreateLoading';
import AlarmModal from './AlarmModal';
import AlarmNftModal from './AlarmNftModal';
import MusicPlayer from './AudioPlayer';

const Header = ({ setIsLoggedIn }) => {
  const [isSignInModal, setSignInModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [isPreparingModal, setPreparingModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(prev => !prev);
  };

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  return (
    <>
      <div className="header">
        <div className="header__inner">
          <button className={`menu-btn ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <svg viewBox="0 0 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </button>
          <h1>
            <Link to="/">
              <img src={mainLogo} alt='mainLogo'/>
              {/* <img src={mainLogo} className="logo" /> */}
              {/* <div className="text-box pc">
                <div className="text-wrap">
                  <svg width={220} height={30} viewBox="0 0 220 30">
                    <text x="0" y="90%">
                      M
                    </text>
                    <text x="20" y="90%">
                      U
                    </text>
                    <text x="38" y="90%">
                      S
                    </text>
                    <text x="57" y="90%">
                      I
                    </text>
                    <text x="64" y="90%">
                      C
                    </text>
                    <text x="90" y="90%">
                      O
                    </text>
                    <text x="108" y="90%">
                      N
                    </text>
                  </svg>
                  <svg width={220} height={30} viewBox="0 0 220 30">
                    <text x="0" y="60%">
                      T
                    </text>
                    <text x="16" y="60%">
                      H
                    </text>
                    <text x="34" y="60%">
                      E
                    </text>
                    <text x="58" y="60%">
                      B
                    </text>
                    <text x="76" y="60%">
                      L
                    </text>
                    <text x="93" y="60%">
                      O
                    </text>
                    <text x="110" y="60%">
                      C
                    </text>
                    <text x="128" y="60%">
                      K
                    </text>
                  </svg>
                </div>
              </div> */}
              {/* <div className="text-box mobile">
                <div className="text-wrap">
                  <svg width={110} height={22} viewBox="0 0 110 22">
                    <text x="0" y="90%">
                      M
                    </text>
                    <text x="16" y="90%">
                      U
                    </text>
                    <text x="30" y="90%">
                      S
                    </text>
                    <text x="45" y="90%">
                      I
                    </text>
                    <text x="52" y="90%">
                      C
                    </text>
                    <text x="76" y="90%">
                      O
                    </text>
                    <text x="90" y="90%">
                      N
                    </text>
                  </svg>
                  <svg width={120} height={22} viewBox="0 0 120 22">
                    <text x="0" y="60%">
                      T
                    </text>
                    <text x="13" y="60%">
                      H
                    </text>
                    <text x="28" y="60%">
                      E
                    </text>
                    <text x="46" y="60%">
                      B
                    </text>
                    <text x="60" y="60%">
                      L
                    </text>
                    <text x="74" y="60%">
                      O
                    </text>
                    <text x="88" y="60%">
                      C
                    </text>
                    <text x="102" y="60%">
                      K
                    </text>
                  </svg>
                </div>
              </div> */}
            </Link>
            <img src={betaLogo} className="beta-logo" />
          </h1>
        </div>
        <Menu
          active={isActive}
          setActive={setIsActive}
          setPreparingModal={setPreparingModal}
          setSignInModal={setSignInModal}
          setLogin={setLogin}
          login={login}
        />
      </div>
      {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      {isSignInModal && (
        <SignInModal setSignInModal={setSignInModal} setLogin={setLogin} login={login} />
      )}

      {/* <Routes>
        <Route path="/" element={<Album />} />
      </Routes> */}

      <AlarmModal />
      {/* <AlarmNftModal /> */}

      {/* <MusicPlayer/> */}
    </>
  );
};

export default Header;
