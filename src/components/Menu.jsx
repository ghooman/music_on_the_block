import React, { useState, useEffect } from "react";
import "./Menu.scss";
import { Link } from "react-router-dom";

// 이미지
import levelIcon from "../assets/images/menu/level-icon.svg";
import userImg from "../assets/images/intro/intro-demo-img2.png";
import copyIcon from "../assets/images/menu/content-copy-icon.svg";
import { WalletConnect } from "./WalletConnect";

const Menu = ({
  active,
  setActive,
  setPreparingModal,
  login,
  setSignInModal,
  setLogin,
}) => {
  const [activeMenus, setActiveMenus] = useState([]);
  const [activeSingle, setActiveSingle] = useState(null); // 단일 선택용 상태
  const [activeSubItem, setActiveSubItem] = useState(null); // 하위 메뉴 li 활성화 상태

  // 슬라이드 탭(여러 개 X, 하나만 활성화)
  const handleSlideToggle = (menuName) => {
    setActiveMenus(
      (prev) => (prev.includes(menuName) ? [] : [menuName]) // 하나만 활성화 (중복 X)
    );
    setActiveSingle(null); // 일반 아이템(activeSingle) 초기화
    setActiveSubItem(null); // 하위 메뉴 초기화
  };

  // 일반 아이템 (Albums, Shop) 클릭 시 동작
  const handleSingleActive = (menuName) => {
    setActiveSingle(activeSingle === menuName ? null : menuName);
    setActiveMenus([]); // 슬라이드 탭들 비활성화
    setActiveSubItem(null); // 하위 메뉴 초기화
    setActive(false);
    if (menuName !== "album" && menuName !== "my-page") {
      setPreparingModal(true);
    }
  };

  // 하위 메뉴 아이템 클릭 시 활성화 (슬라이드 탭 안의 <li>)
  const handleSubItemClick = (subItemName) => {
    setActiveSubItem(subItemName);
    setActive(false);
  };

  const closeMenu = () => {
    setActive(false);
  };

  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 80) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <>
      {/* <div className={`menu ${active ? 'active' : ''} ${isScrolled ? 'fixed' : ''}`}> */}
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
              {/* {!login && (
                <button
                  className="menu__box__login-btn"
                  onClick={() => setSignInModal(true)}
                >
                  Log In
                </button>
              )} */}
              <WalletConnect setLogin={setLogin} />
              {login && (
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
                  {/* <button
                    className="menu__box__log-out-btn"
                    onClick={() => setLogin(false)}
                  >
                    Log Out
                  </button> */}
                </>
              )}
            </dd>
          </dl>

          <dl className="menu__box">
            <dt className="menu__box__title">MENU</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* AI Services - 슬라이드 탭 */}
                <div
                  className={`menu__box__gnb-list__item ai-services slide-tab ${
                    activeMenus.includes("ai-services") ? "active" : ""
                  }`}
                >
                  <button
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSlideToggle("ai-services")}
                  >
                    <p className="icon"></p>AI Services
                  </button>
                  <ul className="menu__box__gnb-list__item__list">
                    <li
                      className={activeSubItem === "ai-lyric" ? "active" : ""}
                      onClick={() => handleSubItemClick("ai-lyric")}
                    >
                      <Link to="/create">AI Lyric & Songwriting</Link>
                    </li>
                    <li
                      className={activeSubItem === "ai-singing" ? "active" : ""}
                      // onClick={() => handleSubItemClick("ai-singing")}
                      onClick={() => setPreparingModal(true)}
                    >
                      <Link to="">AI Singing Evaluation</Link>
                    </li>
                    <li
                      className={activeSubItem === "ai-cover" ? "active" : ""}
                      // onClick={() => handleSubItemClick("ai-cover")}
                      onClick={() => setPreparingModal(true)}
                    >
                      <Link to="">AI Cover Creation</Link>
                    </li>
                  </ul>
                </div>

                {/* 일반 아이템 - Albums */}
                <div
                  className={`menu__box__gnb-list__item ${
                    activeSingle === "album" ? "active" : ""
                  }`}
                >
                  <Link
                    to="/album"
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("album")}
                  >
                    <p className="icon"></p>Albums
                  </Link>
                </div>

                {/* 일반 아이템 - Shop */}
                <div
                  className={`menu__box__gnb-list__item shop ${
                    activeSingle === "shop" ? "active" : ""
                  }`}
                >
                  <Link
                    to=""
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("shop")}
                  >
                    <p className="icon"></p>Shop
                  </Link>
                </div>

                {/* Earn - 슬라이드 탭 */}
                <div
                  className={`menu__box__gnb-list__item earn slide-tab ${
                    activeMenus.includes("earn") ? "active" : ""
                  }`}
                >
                  <button
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSlideToggle("earn")}
                  >
                    <p className="icon"></p>Earn
                  </button>
                  <ul className="menu__box__gnb-list__item__list">
                    <li
                      className={activeSubItem === "staking" ? "active" : ""}
                      // onClick={() => handleSubItemClick("staking")}
                      onClick={() => setPreparingModal(true)}
                    >
                      <Link to="">Staking</Link>
                    </li>
                    <li
                      className={activeSubItem === "governance" ? "active" : ""}
                      // onClick={() => handleSubItemClick("governance")}
                      onClick={() => setPreparingModal(true)}
                    >
                      <Link to="">Governance</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </dd>
          </dl>

          <dl className="menu__box">
            <dt className="menu__box__title">EVENT</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* 일반 아이템 - tournaments */}
                <div
                  className={`menu__box__gnb-list__item tournaments ${
                    activeSingle === "tournaments" ? "active" : ""
                  }`}
                >
                  <Link
                    to=""
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("tournaments")}
                  >
                    <p className="icon"></p>tournaments
                  </Link>
                </div>
              </div>
            </dd>
          </dl>

          <dl className="menu__box">
            <dt className="menu__box__title">LIBRARY</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* 일반 아이템 - Artists */}
                <div
                  className={`menu__box__gnb-list__item artists ${
                    activeSingle === "artists" ? "active" : ""
                  }`}
                >
                  <Link
                    to=""
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("artists")}
                  >
                    <p className="icon"></p>Artists
                  </Link>
                </div>

                {/* 일반 아이템 - Rewards & Payments */}
                <div
                  className={`menu__box__gnb-list__item rewards ${
                    activeSingle === "rewards" ? "active" : ""
                  }`}
                >
                  <Link
                    to=""
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("rewards")}
                  >
                    <p className="icon"></p>Rewards & Payments
                  </Link>
                </div>
              </div>
            </dd>
          </dl>

          <dl className="menu__box">
            <dt className="menu__box__title">MY LIBRARY</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* 일반 아이템 - My Page */}
                <div
                  className={`menu__box__gnb-list__item my-page ${
                    activeSingle === "my-page" ? "active" : ""
                  }`}
                >
                  <Link
                    to="/account-setting"
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("my-page")}
                  >
                    <p className="icon"></p>My Page
                  </Link>
                </div>

                {/* 일반 아이템 - My Favorites */}
                <div
                  className={`menu__box__gnb-list__item my-favorite ${
                    activeSingle === "my-favorite" ? "active" : ""
                  }`}
                >
                  <Link
                    to="/my-page"
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSingleActive("my-favorites")}
                  >
                    <p className="icon"></p>My Favorites
                  </Link>
                </div>
              </div>
            </dd>
          </dl>

          <dl className="menu__box">
            <dt className="menu__box__title">GENERAL</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* AI Services - 슬라이드 탭 */}
                <div
                  className={`menu__box__gnb-list__item Language slide-tab ${
                    activeMenus.includes("Language") ? "active" : ""
                  }`}
                >
                  <button
                    className="menu__box__gnb-list__item__btn"
                    onClick={() => handleSlideToggle("Language")}
                  >
                    <p className="icon"></p>Language
                  </button>
                  <ul className="menu__box__gnb-list__item__list">
                    <li
                      className={activeSubItem === "english" ? "active" : ""}
                      onClick={() => handleSubItemClick("english")}
                    >
                      <Link to="">English</Link>
                    </li>
                    <li
                      className={activeSubItem === "korea" ? "active" : ""}
                      onClick={() => handleSubItemClick("korea")}
                    >
                      <Link to="">한국어</Link>
                    </li>
                    <li
                      className={activeSubItem === "japan" ? "active" : ""}
                      onClick={() => handleSubItemClick("japan")}
                    >
                      <Link to="">日本語</Link>
                    </li>
                    <li
                      className={activeSubItem === "china" ? "active" : ""}
                      onClick={() => handleSubItemClick("china")}
                    >
                      <Link to="">中国人</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

export default Menu;
