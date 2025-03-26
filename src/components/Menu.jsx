// src/components/Menu.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";
import levelIcon from "../assets/images/menu/level-icon.svg";
import userImg from "../assets/images/intro/intro-demo-img2.png";
import copyIcon from "../assets/images/menu/content-copy-icon.svg";
import { AuthContext } from "../contexts/AuthContext";
import { WalletConnect } from "./WalletConnect";

const Menu = ({
  active,
  setActive,
  setPreparingModal,
  setSignInModal,
  // login, setLogin 제거 가능 (AuthContext로 대체)
}) => {
  const [activeMenus, setActiveMenus] = useState([]);
  const [activeSingle, setActiveSingle] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  // AuthContext에서 전역 인증 상태 업데이트 함수 가져오기
  const { isLoggedIn, setIsLoggedIn, setWalletAddress } =
    useContext(AuthContext);

  // WalletConnect에서 전달받은 콜백 함수
  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
      // 이후 AuthContext의 useEffect나 React Query로 토큰 발급 API를 호출할 수 있음
    }
  };

  // (기존 메뉴 관련 핸들러 코드 유지)
  const handleSlideToggle = (menuName) => {
    setActiveMenus((prev) => (prev.includes(menuName) ? [] : [menuName]));
    setActiveSingle(null);
    setActiveSubItem(null);
  };

  const handleSingleActive = (menuName) => {
    setActiveSingle(activeSingle === menuName ? null : menuName);
    setActiveMenus([]);
    setActiveSubItem(null);
    setActive(false);
    if (
      menuName !== "album" &&
      menuName !== "my-page" &&
      menuName !== "my-favorites"
    ) {
      setPreparingModal(true);
    }
  };

  const handleSubItemClick = (subItemName) => {
    setActiveSubItem(subItemName);
    setActive(false);
  };

  const closeMenu = () => {
    setActive(false);
  };

  return (
    <>
      <div className={`menu ${active ? "active" : ""}`}>
        <div className="menu__cover">
          <dl className="menu__box">
            <Link
              to="/my-page"
              onClick={() => handleSingleActive("my-page")}
              className="menu__box__title"
            >
              My Pg
            </Link>
            <dd>
              {/* WalletConnect를 통해 로그인 처리 */}
              <WalletConnect onConnect={handleWalletConnect} />
              {isLoggedIn && (
                <>
                  <div className="menu__box__my-page">
                    <div className="menu__box__my-page__level">
                      <p className="menu__box__my-page__level__img">
                        <img src={levelIcon} alt="level icon" />
                      </p>
                      <p className="number">10</p>
                      <p className="level">Level</p>
                    </div>
                    <div className="menu__box__my-page__info">
                      <div className="menu__box__my-page__info__top">
                        <p
                          className="menu__box__my-page__info__top__img"
                          style={{ backgroundImage: `url(${userImg})` }}
                        ></p>
                        <dl className="menu__box__my-page__info__top__txt">
                          <dt>
                            0xF2D...45
                            <button>
                              <img src={copyIcon} alt="copy icon" />
                            </button>
                          </dt>
                          <dd>Yolkhead_12142</dd>
                        </dl>
                      </div>
                      <div className="menu__box__my-page__info__bottom">
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>100</p>
                          <span>MOB</span>
                        </div>
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>45,345</p>
                          <span>EXP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </dd>
          </dl>
          {/* 이후 나머지 메뉴 코드 유지 */}
          <dl className="menu__box">
            <dt className="menu__box__title">MENU</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* 이하 슬라이드 탭 및 일반 메뉴 항목 */}
                {/* ... */}
              </div>
            </dd>
          </dl>
          {/* ... 추가 메뉴 코드 */}
        </div>
      </div>
    </>
  );
};

export default Menu;
