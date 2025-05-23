import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.scss';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import useWindowHeight from '../hooks/useWindowHeight';

// 이미지
import levelIcon from '../assets/images/menu/level-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import copyIcon from '../assets/images/menu/content-copy-icon.svg';
import checkIcon from '../assets/images/check-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import polIcon from '../assets/images/icon/polygon-icon.svg';
import usdtIcon from '../assets/images/icon/usdt-icon.svg';
import usdcIcon from '../assets/images/icon/usdc-icon.svg';
import langIcon from '../assets/images/icon/lang-icon.svg';
import notificationIcon from '../assets/images/icon/notification-icon.svg';
import notificationSong from '../assets/images/menu/notifications/song.png';
import notificationNFT from '../assets/images/menu/notifications/nft.png';
import notificationNone from '../assets/images/icon/notifications_off.svg';

import { AuthContext } from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { WalletConnect } from './WalletConnect';
import { useUserDetail } from '../hooks/useUserDetail';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { getUserGradeSquareIcon } from '../utils/getGradeIcon';
import { useTranslation } from 'react-i18next';
import { translatedNationsName } from '../i18n/i18n';

import {
  getNotifications,
  deleteNotification,
  postNotificationCheck,
  deleteAllNotifications,
} from '../api/notifications';
import NoneContent from '../components/unit/NoneContent';
import ConfirmModal from './modal/ConfirmModal';
import SuccessModal from './modal/SuccessModal';
const Menu = ({ active, setActive, setPreparingModal, login, setSignInModal, setLogin }) => {
  const { t, i18n } = useTranslation('main');

  const [option, setOption] = useState('');
  const [activeMenus, setActiveMenus] = useState([]);
  const [activeSingle, setActiveSingle] = useState(null); // 단일 선택용 상태
  const [activeSubItem, setActiveSubItem] = useState(null); // 하위 메뉴 li 활성화 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set()); // 삭제 중인 알림 ID들 관리
  const [deleteNotificationLoading, setDeleteNotificationLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isBelowHeight = useWindowHeight(750);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  // AuthContext에서 전역 인증 상태 업데이트 함수 가져오기
  const { token, isLoggedIn, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);

  // WebSocket 컨텍스트에서 lastMessage 가져오기
  const { lastMessage } = useContext(WebSocketContext);

  // WalletConnect에서 전달받은 콜백 함수
  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
      // 이후 AuthContext의 useEffect나 React Query로 토큰 발급 API를 호출할 수 있음
    }
  };
  const { data: userData, isLoading, error } = useUserDetail();
  // console.log('userData', userData);
  const micBalance = userData?.mic_point.toFixed(4) || '0.0000';
  // 슬라이드 탭(여러 개 X, 하나만 활성화)
  const handleSlideToggle = menuName => {
    setActiveMenus(
      prev => (prev.includes(menuName) ? [] : [menuName]) // 하나만 활성화 (중복 X)
    );
    setActiveSingle(null); // 일반 아이템(activeSingle) 초기화
    setActiveSubItem(null); // 하위 메뉴 초기화
  };

  // 일반 아이템 (Albums, Shop) 클릭 시 동작
  const handleSingleActive = menuName => {
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
  const handleSubItemClick = subItemName => {
    setActiveSubItem(subItemName);
    setActiveMenus([]); // 슬라이드 탭들 비활성화
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
      .catch(err => {
        console.error('복사에 실패하였습니다: ', err);
      });
  };

  const {
    data: notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(token),
    enabled: !!token, // 토큰이 있을 때만 실행
    refetchInterval: 30000, // 30초마다 자동 새로고침
    refetchIntervalInBackground: false, // 백그라운드에서는 새로고침 안함
  });

  useEffect(() => {
    if (token) {
      queryClient.invalidateQueries(['notifications']);
    }
  }, [token]);

  // WebSocket으로 새로운 알림이 올 때 알림 목록 업데이트
  useEffect(() => {
    if (lastMessage && token) {
      if (
        lastMessage.type === 'notification' ||
        lastMessage.notification_type ||
        lastMessage.message_type === 'notification' ||
        (lastMessage.status &&
          (lastMessage.status === 'notification' || lastMessage.status === 'alert'))
      ) {
        // 알림 목록 다시 가져오기
        queryClient.invalidateQueries(['notifications']);
      }
    }
  }, [lastMessage, token, queryClient]);

  // 알림 패널을 열 때 알림 목록 새로고침
  useEffect(() => {
    if (option === 'notification' && token) {
      queryClient.invalidateQueries(['notifications']);
    }
  }, [option, token, queryClient]);

  const { mobBalance, polBalance, usdcBalance, usdtBalance } = useTokenBalance();
  const flattenedDataList = notifications?.flatMap(item => item.data_list);

  // 개별 알림 삭제 mutation
  const deleteNotificationMutation = useMutation(
    ({ id, notification_type }) => {
      if (!token) {
        return Promise.reject(new Error('인증 토큰이 없습니다'));
      }
      return deleteNotification(token, id, notification_type);
    },
    {
      onMutate: async ({ id, notification_type }) => {
        // 토큰 체크
        if (!token) {
          throw new Error('로그인이 필요합니다');
        }

        // 삭제 중 상태 추가
        setDeletingIds(prev => new Set([...prev, id]));

        // 기존 쿼리 취소
        await queryClient.cancelQueries(['notifications']);

        // 이전 데이터 백업 (rollback용)
        const previousNotifications = queryClient.getQueryData(['notifications']);

        // Optimistic Update: UI에서 즉시 해당 알림 제거
        queryClient.setQueryData(['notifications'], old => {
          if (!old) return old;

          return old
            .map(group => ({
              ...group,
              data_list: group.data_list.filter(item => item.id !== id),
            }))
            .filter(group => group.data_list.length > 0);
        });

        return { previousNotifications };
      },
      onError: (err, variables, context) => {
        // 에러 발생 시 이전 상태로 복원
        if (context?.previousNotifications) {
          queryClient.setQueryData(['notifications'], context.previousNotifications);
        }
        console.error('알림 삭제 실패:', err);
        // 에러 토스트나 알림을 표시할 수 있습니다
      },
      onSuccess: (data, variables) => {
        // 성공적으로 삭제되었으므로 아무것도 하지 않음 (이미 optimistic update 적용됨)
        console.log('알림이 성공적으로 삭제되었습니다');
      },
      onSettled: (data, error, variables) => {
        // 삭제 중 상태 제거
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(variables.id);
          return newSet;
        });
      },
    }
  );

  // 알림 기록 개별 삭제 함수
  const handleDeleteNotification = (id, notification_type) => {
    if (!token) {
      return;
    }
    deleteNotificationMutation.mutate({ id, notification_type });
  };
  // 알람 기록 전체 삭제 함수
  const handleDeleteAllNotifications = async () => {
    try {
      setDeleteNotificationLoading(true);
      const response = await deleteAllNotifications(token);
      console.log('response', response);

      if (response.status === 'success') {
        // 알림 목록을 빈 배열로 업데이트
        queryClient.setQueryData(['notifications'], []);
        setShowConfirmModal(false);
        setDeleteNotificationLoading(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('알림 삭제 중 오류 발생:', error);
      setDeleteNotificationLoading(false);
      alert('알림 삭제 중 오류가 발생했습니다.');
    }
  };
  return (
    <>
      {/** 반응형 모바일 사이즈 시 menu 클래스의 포지션 영향을 받아 부득이 하게 밖으로 뺐습니다.*/}
      <ul
        className={`menu-box__lang-notification--select-lang-box pc ${
          option === 'lang' ? 'visible' : ''
        }`}
      >
        {translatedNationsName.map(lang => (
          <li
            className="menu-box__lang-notification--select-lang-box__item"
            key={lang}
            onClick={() => {
              i18n.changeLanguage(lang);
              setOption('');
            }}
          >
            {lang}
          </li>
        ))}
      </ul>
      <ul
        className={`menu-box__lang-notification--select-notification-box ${
          option === 'notification' ? 'visible' : ''
        }`}
      >
        <div className="menu-box__lang-notification--select-notification-box__header">
          <button
            className="menu-box__lang-notification--select-notification-box__close-btn"
            onClick={() => setOption('')}
          >
            X
          </button>
          <p className="menu-box__lang-notification--select-notification-box__header__title">
            Notifications
          </p>
          <button
            className="menu-box__lang-notification--select-notification-box__header__btn"
            onClick={() => setShowConfirmModal(true)}
            disabled={flattenedDataList?.length === 0}
            style={{
              opacity: flattenedDataList?.length === 0 ? 0.5 : 1,
              cursor: flattenedDataList?.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Delete All
          </button>
        </div>
        {flattenedDataList?.length > 0 ? (
          flattenedDataList?.map(item => (
            <li
              key={item.id}
              className="menu-box__lang-notification--select-notification-box__item"
            >
              <div className="menu-box__lang-notification--select-notification-box__item__img-box">
                <img src={item?.image} alt="song_image" />
              </div>
              <div className="menu-box__lang-notification--select-notification-box__item__txt-box">
                <div className="menu-box__lang-notification--select-notification-box__item__txt-box__header">
                  <img src={true ? notificationSong : notificationNFT} alt="song_image" />
                  <p className="menu-box__lang-notification--select-notification-box__item__txt-box__header__title">
                    {item?.notification_type === 'song' ? (
                      <>
                        The <span className="sky">song</span> has been created!
                      </>
                    ) : (
                      <>
                        Your <span className="purple">song</span> sold successfully.
                      </>
                    )}
                  </p>
                </div>
                <p className="menu-box__lang-notification--select-notification-box__item__txt-box__header__name">
                  {item?.name}
                </p>
                <p className="menu-box__lang-notification--select-notification-box__item__txt-box__date-box__time">
                  {item?.create_dt}
                </p>
              </div>
              <button
                className="menu-box__lang-notification--select-notification-box__item__btn"
                onClick={() => handleDeleteNotification(item?.id, item?.notification_type)}
                disabled={deletingIds.has(item?.id)}
                style={{
                  opacity: deletingIds.has(item?.id) ? 0.5 : 1,
                  cursor: deletingIds.has(item?.id) ? 'not-allowed' : 'pointer',
                }}
              >
                {deletingIds.has(item?.id) ? '...' : 'x'}
              </button>
            </li>
          ))
        ) : (
          <NoneContent
            message="You have no notifications yet."
            height={300}
            image={notificationNone}
          />
        )}
      </ul>
      <div className={`menu ${active ? 'active' : ''} ${isBelowHeight ? 'small-height' : ''}`}>
        <div className="menu__cover">
          <dl className="menu__box">
            <dd>
              {/** 언어 및 알림 */}
              <div className="menu-box__lang-notification">
                <button
                  className="menu-box__lang-notification--button"
                  onClick={() => {
                    setOption(prev => {
                      if (prev === 'lang') return '';
                      else return 'lang';
                    });
                  }}
                >
                  <img src={langIcon} alt="icon" />
                  {t('Language')}
                </button>
                <button
                  className="menu-box__lang-notification--button"
                  onClick={() => {
                    setOption(prev => {
                      if (prev === 'notification') return '';
                      else return 'notification';
                    });
                  }}
                >
                  <img src={notificationIcon} alt="icon" />
                  {t('Notification')}
                </button>
              </div>
              <ul
                className={`menu-box__lang-notification--select-lang-box mobile ${
                  option === 'lang' ? 'visible' : ''
                }`}
              >
                {translatedNationsName.map(lang => (
                  <li
                    className="menu-box__lang-notification--select-lang-box__item"
                    key={lang}
                    onClick={() => {
                      i18n.changeLanguage(lang);
                      setOption('');
                    }}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
              <WalletConnect onConnect={handleWalletConnect} />
              {isLoggedIn && (
                <>
                  <div className="menu__box__my-page">
                    {/* <div className="menu__box__my-page__level">
                      <p className="level">Level</p>
                      <p className="menu__box__my-page__level__img">
                        {getUserGradeSquareIcon(userData?.user_rating) && (
                          <img
                            src={getUserGradeSquareIcon(userData?.user_rating)}
                            alt="level icon"
                          />
                        )}
                      </p>
                      <p className="grade">{userData?.user_rating}</p>
                    </div> */}
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
                      <div className="menu__box__my-page__level">
                        <p className="level">{t('Level')}</p>
                        <p className="menu__box__my-page__level__img">
                          <img
                            src={getUserGradeSquareIcon(userData?.user_rating)}
                            alt="level icon"
                          />
                        </p>
                        <p className="grade">{userData?.user_rating}</p>
                      </div>
                      <div className="menu__box__my-page__info__bottom">
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>{mobBalance}</p>
                          <span>
                            <img src={mobIcon} alt="mob icon" />
                            MOB
                          </span>
                        </div>
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>{micBalance}</p>
                          <span>
                            <img src={micIcon} alt="mic icon" />
                            MIC
                          </span>
                        </div>
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>{polBalance}</p>
                          <span>
                            <img src={polIcon} alt="mob icon" />
                            POL
                          </span>
                        </div>
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>{usdtBalance}</p>
                          <span>
                            <img src={usdtIcon} alt="usdt icon" />
                            USDT
                          </span>
                        </div>
                        <div className="menu__box__my-page__info__bottom__box">
                          <p>{usdcBalance}</p>
                          <span>
                            <img src={usdcIcon} alt="usdc icon" />
                            USDC
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
            <dt className="menu__box__title">{t('MENU')}</dt>
            <dd>
              <div className="menu__box__gnb-list">
                {/* 일반 아이템 - Albums */}
                <div className={`menu__box__gnb-list__item ${pathname === '/' ? 'active' : ''}`}>
                  <Link
                    to="/"
                    className="menu__box__gnb-list__item__btn main"
                    onClick={() => handleSingleActive('album')}
                  >
                    <p className="icon"></p>
                    {t('Main')}
                  </Link>
                </div>
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
                    <p className="icon"></p>
                    {t('AI Services')}
                  </button>
                  <ul className="menu__box__gnb-list__item__list">
                    <li
                      className={activeSubItem === 'ai-lyrics' ? 'active' : ''}
                      onClick={() => handleSubItemClick('ai-lyrics')}
                    >
                      <Link to="/create">{t('AI Lyrics & Songwriting')}</Link>
                    </li>
                    <li
                      className={activeSubItem === 'ai-singing' ? 'active' : ''}
                      onClick={() => handleSubItemClick('ai-singing')}
                      // onClick={() => setPreparingModal(true)}
                    >
                      <Link to="/evaluation">{t('AI Singing Evaluation')}</Link>
                    </li>
                    <li
                      className={activeSubItem === 'ai-cover' ? 'active' : ''}
                      // onClick={() => handleSubItemClick("ai-cover")}
                      onClick={() => setPreparingModal(true)}
                    >
                      <Link to="">{t('AI Cover Creation')}</Link>
                    </li>
                  </ul>
                </div>

                {/* 일반 아이템 - NFT MarketPlace */}
                <div
                  className={`menu__box__gnb-list__item ${
                    pathname.startsWith('/nft') ? 'active' : ''
                  }`}
                >
                  <Link
                    to="/nft"
                    className="menu__box__gnb-list__item__btn shop"
                    onClick={() => handleSingleActive('nft')}
                    // onClick={() => setPreparingModal(true)}
                  >
                    <p className="icon"></p>
                    {t('NFT MarketPlace')}
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
                    className="menu__box__gnb-list__item__btn earn"
                    onClick={() => handleSingleActive('earn')}
                  >
                    <p className="icon"></p>
                    {t('Eco System')}
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

          {isLoggedIn && (
            <dl className="menu__box">
              <dt className="menu__box__title">{t('MY LIBRARY')}</dt>
              <dd>
                <div className="menu__box__gnb-list">
                  {/* <div
                    className={`menu__box__gnb-list__item my-page ${
                      pathname.startsWith('/my-page') ? 'active' : ''
                    }`}
                  >
                    <Link
                      to="/my-page?category=AI Services"
                      className="menu__box__gnb-list__item__btn"
                      onClick={() => handleSingleActive('my-page')}
                      // onClick={() => setPreparingModal(true)}
                    >
                      <p className="icon"></p>My Page
                    </Link>
                  </div> */}
                  <div
                    className={`menu__box__gnb-list__item my-music slide-tab ${
                      activeMenus.includes('my-music') ? 'active' : ''
                    }`}
                  >
                    <button
                      className="menu__box__gnb-list__item__btn"
                      onClick={() => handleSlideToggle('my-music')}
                    >
                      <p className="icon"></p>
                      {t('My Page')}
                    </button>
                    <ul className="menu__box__gnb-list__item__list my-music">
                      <li
                        className={activeSubItem === 'Songs' ? 'active' : ''}
                        onClick={() => handleSubItemClick('Songs')}
                      >
                        <Link to="/my-page?category=AI+Services">{t('AI Services')}</Link>
                      </li>
                      <li
                        className={activeSubItem === 'Songs' ? 'active' : ''}
                        onClick={() => handleSubItemClick('Songs')}
                      >
                        <Link to="/my-page?category=Songs">{t('Songs')}</Link>
                      </li>
                      <li
                        className={activeSubItem === 'Connections' ? 'active' : ''}
                        onClick={() => handleSubItemClick('Connections')}
                      >
                        <Link to="/my-page?category=Connections">{t('Connections')}</Link>
                      </li>
                      <li
                        className={activeSubItem === 'NFTs' ? 'active' : ''}
                        onClick={() => handleSubItemClick('NFTs')}
                      >
                        <Link to="/my-page?category=NFTs">{t('NFTs')}</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </dd>
            </dl>
          )}

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
      {showConfirmModal && (
        <ConfirmModal
          title="Confirm Delete"
          content="Are you sure you want to delete all notifications?"
          cancelMessage="Cancel"
          okMessage="Yes, Continue"
          setShowConfirmModal={setShowConfirmModal}
          okHandler={handleDeleteAllNotifications}
          loading={deleteNotificationLoading}
          setLoading={setDeleteNotificationLoading}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          title="Success"
          content="Notifications deleted successfully."
          setShowSuccessModal={setShowSuccessModal}
        />
      )}
    </>
  );
};

export default Menu;
