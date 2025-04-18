import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.scss';
import useWindowHeight from '../hooks/useWindowHeight';

// 이미지
import levelIcon from '../assets/images/menu/level-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import copyIcon from '../assets/images/menu/content-copy-icon.svg';
import checkIcon from '../assets/images/check-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import { AuthContext } from '../contexts/AuthContext';
import { WalletConnect } from './WalletConnect';
import { useUserDetail } from '../hooks/useUserDetail';
const Menu = ({ active, setActive, setPreparingModal, login, setSignInModal, setLogin }) => {
    const [activeMenus, setActiveMenus] = useState([]);
    const [activeSingle, setActiveSingle] = useState(null); // 단일 선택용 상태
    const [activeSubItem, setActiveSubItem] = useState(null); // 하위 메뉴 li 활성화 상태
    const isBelowHeight = useWindowHeight(750);
    const { pathname } = useLocation();

    // AuthContext에서 전역 인증 상태 업데이트 함수 가져오기
    const { isLoggedIn, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);

    // WalletConnect에서 전달받은 콜백 함수
    const handleWalletConnect = (loggedIn, walletAddress) => {
        setIsLoggedIn(loggedIn);
        if (loggedIn && walletAddress) {
            setWalletAddress(walletAddress);
            // 이후 AuthContext의 useEffect나 React Query로 토큰 발급 API를 호출할 수 있음
        }
    };
    const { data: userData, isLoading, error } = useUserDetail();
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
        if (
            menuName !== 'album' &&
            menuName !== 'nft' &&
            menuName !== 'my-page' &&
            menuName !== 'my-favorites' &&
            menuName !== 'earn'
        ) {
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
    const [copied, setCopied] = useState(false);

    // userData.wallet_address가 존재하면 앞 5글자와 뒤 4글자만 표시합니다.
    const truncatedAddress = userData?.wallet_address
        ? `${userData.wallet_address.slice(0, 5)}...${userData.wallet_address.slice(-4)}`
        : 'No wallet';

    const copyAddress = () => {
        const wallet = userData?.wallet_address;

        if (!wallet) {
            console.warn('지갑 주소가 없습니다.');
            return;
        }

        navigator.clipboard
            .writeText(wallet)
            .then(() => {
                setCopied(true); // 체크 아이콘 보여주기
                setTimeout(() => {
                    setCopied(false); // 3초 후 원래대로
                }, 2000);
            })
            .catch((err) => {
                console.error('복사에 실패하였습니다: ', err);
            });
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
            <div className={`menu ${active ? 'active' : ''} ${isBelowHeight ? 'small-height' : ''}`}>
                <div className="menu__cover">
                    <dl className="menu__box">
                        <Link
                            // to="/my-page/service?category=AI Services"
                            // onClick={() => handleSingleActive("my-page")}
                            // onClick={() => setPreparingModal(true)}
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
                            <WalletConnect onConnect={handleWalletConnect} />
                            {isLoggedIn && (
                                <>
                                    <div className="menu__box__my-page">
                                        <div className="menu__box__my-page__level">
                                            <p className="menu__box__my-page__level__img">
                                                <img src={levelIcon} alt="level icon" />
                                            </p>
                                            <p className="number">1</p>
                                            <p className="level">Level</p>
                                        </div>
                                        <div className="menu__box__my-page__info">
                                            <div className="menu__box__my-page__info__top">
                                                <p
                                                    className="menu__box__my-page__info__top__img"
                                                    style={{
                                                        backgroundImage: `url(${userData?.profile || defaultCoverImg})`,
                                                    }}
                                                ></p>
                                                <dl className="menu__box__my-page__info__top__txt">
                                                    <dt>
                                                        {truncatedAddress}
                                                        <button onClick={copyAddress}>
                                                            <img
                                                                src={copied ? checkIcon : copyIcon}
                                                                alt={copied ? '복사 완료' : '복사 아이콘'}
                                                            />
                                                        </button>
                                                    </dt>
                                                    <dd>{userData?.name || 'No Sign up'}</dd>
                                                </dl>
                                            </div>
                                            <div className="menu__box__my-page__info__bottom">
                                                <div className="menu__box__my-page__info__bottom__box">
                                                    <p>0</p>
                                                    <span>
                                                        <img src={mobIcon} alt="mob icon" />
                                                        MOB
                                                    </span>
                                                </div>
                                                <div className="menu__box__my-page__info__bottom__box">
                                                    <p>0</p>
                                                    <span>
                                                        <img src={micIcon} alt="mic icon" />
                                                        MIC
                                                    </span>
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
                                        activeMenus.includes('ai-services') ? 'active' : ''
                                    }`}
                                >
                                    <button
                                        className="menu__box__gnb-list__item__btn"
                                        onClick={() => handleSlideToggle('ai-services')}
                                    >
                                        <p className="icon"></p>AI Services
                                    </button>
                                    <ul className="menu__box__gnb-list__item__list">
                                        <li
                                            className={activeSubItem === 'ai-lyrics' ? 'active' : ''}
                                            onClick={() => handleSubItemClick('ai-lyrics')}
                                        >
                                            <Link to="/create">AI Lyrics & Songwriting</Link>
                                        </li>
                                        <li
                                            className={activeSubItem === 'ai-singing' ? 'active' : ''}
                                            // onClick={() => handleSubItemClick("ai-singing")}
                                            onClick={() => setPreparingModal(true)}
                                        >
                                            <Link to="">AI Singing Evaluation</Link>
                                        </li>
                                        <li
                                            className={activeSubItem === 'ai-cover' ? 'active' : ''}
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
                                        pathname.startsWith('/main') ? 'active' : ''
                                    }`}
                                >
                                    <Link
                                        to="/main"
                                        className="menu__box__gnb-list__item__btn"
                                        onClick={() => handleSingleActive('album')}
                                    >
                                        <p className="icon"></p>Main
                                    </Link>
                                </div>
                                {/* 일반 아이템 - NFT MarketPlace */}
                                <div
                                    className={`menu__box__gnb-list__item ${
                                        pathname.startsWith('/nft') ? 'active' : ''
                                    }`}
                                >
                                    <Link
                                        to="/nft"
                                        className="menu__box__gnb-list__item__btn"
                                        onClick={() => handleSingleActive('nft')}
                                    >
                                        <p className="icon"></p>NFT MarketPlace
                                    </Link>
                                </div>

                                {/* 일반 아이템 - Shop */}
                                {/* <div
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
                </div> */}

                                <div
                                    className={`menu__box__gnb-list__item shop ${
                                        pathname.startsWith('/earn') ? 'active' : ''
                                    }`}
                                >
                                    <Link
                                        to="https://eco.musicontheblock.com"
                                        target="_b"
                                        className="menu__box__gnb-list__item__btn"
                                        onClick={() => handleSingleActive('earn')}
                                    >
                                        <p className="icon"></p>Eco System
                                    </Link>
                                </div>

                                {/* Earn - 슬라이드 탭 */}
                                {/* <div
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
                </div> */}
                            </div>
                        </dd>
                    </dl>




                  {/* {isLoggedIn && (
                        <dl className="menu__box">
                            <dt className="menu__box__title">MY LIBRARY</dt>
                            <dd>
                                <div className="menu__box__gnb-list">
                                    <div
                                        className={`menu__box__gnb-list__item my-page ${
                                            pathname.startsWith('/my-page/service') ? 'active' : ''
                                        }`}
                                    >
                                        <Link
                                            to="/my-page/service?category=AI Services"
                                            className="menu__box__gnb-list__item__btn"
                                            onClick={() => handleSingleActive('my-page')}
                                            // onClick={() => setPreparingModal(true)}
                                        >
                                            <p className="icon"></p>My Page
                                        </Link>
                                    </div>
                                    <div
                                        className={`menu__box__gnb-list__item my-music slide-tab ${
                                            activeMenus.includes('my-music') ? 'active' : ''
                                        }`}
                                    >
                                        <button
                                            className="menu__box__gnb-list__item__btn"
                                            onClick={() => handleSlideToggle('my-music')}
                                        >
                                            <p className="icon"></p>My Music
                                        </button>
                                        <ul className="menu__box__gnb-list__item__list my-music">
                                            <li
                                                className={activeSubItem === 'Songs' ? 'active' : ''}
                                                onClick={() => handleSubItemClick('Songs')}
                                            >
                                                <Link to="/my-page/music?category=Songs">Songs</Link>
                                            </li>
                                            <li
                                                className={activeSubItem === 'Connections' ? 'active' : ''}
                                                onClick={() => handleSubItemClick('Connections')}
                                            >
                                                <Link to="/my-page/music?category=Connections">Connections</Link>
                                            </li>
                                            <li
                                                className={activeSubItem === 'Favorites' ? 'active' : ''}
                                                onClick={() => handleSubItemClick('Favorites')}
                                            >
                                                <Link to="/my-page/music?category=Favorites">Favorites</Link>
                                            </li>
                                            <li
                                                className={activeSubItem === 'Albums' ? 'active' : ''}
                                                onClick={() => handleSubItemClick('Albums')}
                                            >
                                                <Link to="/my-page/music?category=Albums">Albums</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </dd>
                        </dl>
                    )} */}




                    {/* <dl className="menu__box">
            <dt className="menu__box__title">GENERAL</dt>
            <dd>
              <div className="menu__box__gnb-list">
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
          </dl> */}
                </div>
            </div>
        </>
    );
};

export default Menu;
