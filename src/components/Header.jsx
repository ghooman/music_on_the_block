import React, { useState } from "react";
import "./Header.scss";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from "react-router-dom";
// import LogoHansung from "../assets/images/";
import Album from "../pages/Album";
import PreparingModal from "./PreparingModal";

//이미지
import mainLogo from "../assets/images/header/logo.svg";
import betaLogo from "../assets/images/header/beta.svg";
import closeIcon from "../assets/images/close.svg";
import Menu from "./Menu";
import MyPage from "../pages/MyPage";
import SignInModal from "./SignInModal";
import CreateLoading from "./CreateLoading";
import AlarmModal from "./AlarmModal";

const Header = ({ setIsLoggedIn }) => {
  const [isSignInModal, setSignInModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [isPreparingModal, setPreparingModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <>
      <div className="header">
        <div className="header__inner">
          <button
            className={`menu-btn ${isActive ? "active" : ""}`}
            onClick={handleClick}
          >
            <svg viewBox="0 0 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </button>
          <h1>
            <Link to="/album">
              <img src={mainLogo} className="logo" />
              <div className="text-box">
                <div className="text-wrap">
                  <svg width={220} height={30} viewBox="0 0 220 30">
                    <text x="0" y="90%">
                      M
                    </text>
                    <text x="22" y="90%">
                      U
                    </text>
                    <text x="42" y="90%">
                      S
                    </text>
                    <text x="62" y="90%">
                      I
                    </text>
                    <text x="70" y="90%">
                      C
                    </text>
                    <text x="96" y="90%">
                      O
                    </text>
                    <text x="116" y="90%">
                      N
                    </text>
                  </svg>
                  <svg width={220} height={30} viewBox="0 0 220 30">
                    <text x="0" y="60%">
                      T
                    </text>
                    <text x="18" y="60%">
                      H
                    </text>
                    <text x="38" y="60%">
                      E
                    </text>
                    <text x="64" y="60%">
                      B
                    </text>
                    <text x="84" y="60%">
                      L
                    </text>
                    <text x="104" y="60%">
                      O
                    </text>
                    <text x="124" y="60%">
                      C
                    </text>
                    <text x="144" y="60%">
                      K
                    </text>
                  </svg>
                </div>
              </div>
              <img src={betaLogo} className="beta-logo" />
            </Link>
          </h1>
        </div>
      </div>

      <Menu
        active={isActive}
        setActive={setIsActive}
        setPreparingModal={setPreparingModal}
        setSignInModal={setSignInModal}
        setLogin={setLogin}
        login={login}
      />
      {isPreparingModal && (
        <PreparingModal setPreparingModal={setPreparingModal} />
      )}
      {isSignInModal && (
        <SignInModal
          setSignInModal={setSignInModal}
          setLogin={setLogin}
          login={login}
        />
      )}

      {/* <Routes>
        <Route path="/" element={<Album />} />
      </Routes> */}

      <AlarmModal />
    </>
  );
};

export default Header;
