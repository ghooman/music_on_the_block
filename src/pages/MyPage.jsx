import React, { useState, useEffect, useContext, useTransition, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

import demoBg from '../assets/images/mypage/demo-bg.png';
import gearImg from '../assets/images/mypage/gear.svg';
import linkIcon from '../assets/images/icon/link.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import arrowDownIcon from '../assets/images/icons/icons-arrow-down.svg';
import infoIcon from '../assets/images/icons/icons-info.svg';

import AiServices from '../components/mypage/aiservices/AiServices';
import Songs from '../components/mypage/songs/Songs';
import MyFavorites from '../components/mypage/songs/MyFavorites';
import LinksModal from '../components/LinksModal';
import { WalletConnect } from '../components/WalletConnect';
import PreparingModal from '../components/PreparingModal';
import Connections from '../components/mypage/connections/Connections';
import UnFollowModal from '../components/UnFollowModal';
import NFTs from '../components/mypage/nfts/NFTs';
import MicEarning from '../components/mypage/mic/MicEarning';
import OtherConnections from '../components/mypage/connections/OtherConnections';
import InfoModal from '../components/modal/InfoModal';

import { useUserDetail } from '../hooks/useUserDetail';
import { getUserGradeSquareIcon } from '../utils/getGradeIcon';

import '../styles/MyPage.scss';
import { useTranslation } from 'react-i18next';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {boolean} isMyProfile : 현재 컴포넌트가 나의 정보를 보여주어야 하는지 다른 유저의 정보를 보여주어야 하는지 결정하는 파라미터
 * @returns
 */

const MyPage = ({ isMyProfile }) => {
  if (isMyProfile) return <MyProfile />;
  else return <UserProfile />;
};

export default MyPage;

//=================
// 마이 페이지
//=================
const MyProfile = () => {
  // 데이터 정의

  const { t } = useTranslation('my_page');

  const { token } = useContext(AuthContext);
  const { data: userData } = useUserDetail();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');

  // 마이페이지 : Music, NFT, Connections, AI Searvice, MIC Earning 노출
  const serviceTabObj = [
    { name: 'Songs', preparing: false },
    { name: 'NFTs', preparing: false },
    { name: 'Connections', preparing: false },
    { name: 'AI Services', preparing: false },
    { name: 'MIC Earning', preparing: false },
  ];

  const handleTab = tab => {
    if (tab === category) return;
    setSearchParams({ category: tab });
  };

  return (
    <div className="mypage">
      <ProfileInfo userData={userData} token={token} isMyProfile>
        {/* <ProfileInfo.TokenAmount mic={0} mob={0} /> */}
      </ProfileInfo>
      <Tabs tabs={serviceTabObj} select={category} handleTab={handleTab} />
      {category === 'Songs' && <Songs username={userData?.name} isMyProfile token={token} />}
      {category === 'NFTs' && <NFTs username={userData?.name} isMyProfile />}
      {/* {category === 'Connections' && <Connections />} */}
      {category === 'Connections' && <Connections ownerName={userData?.name} isSelf />}
      {category === 'AI Services' && <AiServices username={userData?.name} />}
      {category === 'MIC Earning' && <MicEarning username={userData?.name} isMyProfile />}
    </div>
  );
};

//=================
// 다른 사람 페이지
//=================
const UserProfile = () => {
  // 데이터 정의
  const { t } = useTranslation('my_page');

  const { walletAddress, token, setIsLoggedIn, setWalletAddress, isLoggedIn } =
    useContext(AuthContext);
  const { data: userData } = useUserDetail();
  const [searchParams, setSearchParams] = useSearchParams();
  const [unFollowModal, setUnFollowModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const username = searchParams.get('username');
  const category = searchParams.get('category');

  // 다른 사람의 마이페이지 : SONGS, NFT, CONNECTIONS 노출
  const serviceTabObj = [
    { name: 'Songs', preparing: false },
    { name: 'NFTs', preparing: false },
    { name: 'Connections', preparing: false },
  ];

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };

  // 프로필 데이터
  const {
    data: profileData,
    refetch,
    isFetching,
  } = useQuery(
    ['user_profile', username, walletAddress?.address],
    async () => {
      const res = await axios.get(
        `${serverApi}/api/user/profile?name=${username}&wallet_address=${walletAddress?.address}`
      );
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: username !== userData?.name,
      retry: 0,
    }
  );

  // 팔로잉
  const handleFollowing = async () => {
    if (!token) return;
    const update = follow => {
      queryClient.setQueryData(['user_profile', username, walletAddress.address], prev => {
        return { ...prev, is_follow: follow, followers: prev?.followers + 1 };
      });
    };
    try {
      update(true);
      const res = await axios.post(`${serverApi}/api/user/${profileData?.id}/follow`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      update(false);
      console.error(e);
    }
  };

  // 언팔로잉
  const handleUnFollowing = async () => {
    try {
      const res = await axios.post(`${serverApi}/api/user/${profileData?.id}/follow/cancel`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  // 탭 핸들러
  const handleTab = tab => {
    if (tab === category) return;
    setSearchParams(prev => {
      return { category: tab, username: username };
    });
  };

  useEffect(() => {
    if (username === userData?.name) {
      navigate('/my-page?category=AI+Services', { replace: true });
    } else if (!username) {
      navigate('/', { replace: true });
    } else if (!category) {
      setSearchParams({ category: 'Songs', username: username }, { replace: true });
    }
  }, [userData]);

  return (
    <div className="mypage">
      <ProfileInfo userData={profileData}>
        {isLoggedIn && !isFetching ? (
          <>
            {profileData?.is_follow && (
              <ProfileInfo.UnFollowingButton
                handleUnFollowing={() => setUnFollowModal(true)}
                title={t('Unfollow')}
              />
            )}
            {!profileData?.is_follow && (
              <ProfileInfo.FollowingButton
                handleFollowing={() => handleFollowing()}
                title={t('Follow')}
              />
            )}
          </>
        ) : (
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </ProfileInfo>
      <Tabs tabs={serviceTabObj} handleTab={handleTab} select={category} />
      {category === 'Songs' && <Songs username={username} />}
      {category === 'NFTs' && <NFTs username={username} />}
      {category === 'AI Services' && <AiServices username={username} />}
      {unFollowModal && isLoggedIn && (
        <UnFollowModal
          setUnFollowModal={setUnFollowModal}
          profileData={profileData}
          handleClick={handleUnFollowing}
        />
      )}
    </div>
  );
};

//==================================================
//==================================================
//=================컴포넌트===========================
//==================================================
//==================================================

const ProfileInfo = ({ userData, isMyProfile, children }) => {
  const { t } = useTranslation('my_page');
  const [seeMore, setSeeMore] = useState(false);
  const [showSeeMoreButton, setShowSeeMoreButton] = useState(false);
  const [linksModal, setLinksModal] = useState(false);
  const contentRef = useRef(null);
  const { pathname, search: queryParameter } = useLocation();
  const content = userData?.introduce || '-';

  // 한 줄을 넘는지 확인하는 함수
  const checkIfOverflows = () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const parentElement = element.parentElement;
      const containerWidth = parentElement ? parentElement.offsetWidth : element.offsetWidth;
      const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
      const fontFamily = window.getComputedStyle(element).fontFamily;

      console.log('containerWidth:', containerWidth);
      console.log('fontSize:', fontSize);
      console.log('fontFamily:', fontFamily);
      console.log('content:', content);

      // 컨테이너 너비가 0이면 텍스트 길이로 임시 판단
      if (containerWidth <= 0) {
        console.log('컨테이너 너비가 0이므로 텍스트 길이로 판단');
        return content.length > 50; // 임시 기준
      }

      // 임시 캔버스를 만들어서 실제 텍스트 너비를 측정
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px ${fontFamily}`;

      const textWidth = context.measureText(content).width;
      console.log('textWidth:', textWidth);

      // 여백을 고려하여 한 줄을 넘는지 확인
      const maxWidth = containerWidth - 20; // 여백 20px 고려
      const isOverflowing = textWidth > maxWidth;

      console.log('maxWidth:', maxWidth);
      console.log('isOverflowing:', isOverflowing);
      console.log('비교:', `${textWidth} > ${maxWidth} = ${isOverflowing}`);

      return isOverflowing;
    }
    return false;
  };

  useEffect(() => {
    // DOM이 업데이트된 후 실제 높이를 확인
    const checkContentHeight = () => {
      if (contentRef.current) {
        const isOverflowing = checkIfOverflows();

        console.log('isOverflowing:', isOverflowing);
        console.log('content length:', content.length);

        setShowSeeMoreButton(isOverflowing);
      }
    };

    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 확인
    const timer = setTimeout(checkContentHeight, 300);

    return () => clearTimeout(timer);
  }, [content]);

  const toggleSeeMore = () => {
    setSeeMore(prev => {
      const newState = !prev;
      console.log('seeMore 상태 변경:', newState);
      return newState;
    });
  };

  console.log('높이 측정', contentRef.current?.scrollHeight);

  const linkCount = (userData?.link_list?.length || 0) - 1; // 첫 링크 제외
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <>
      <div className="mypage__profile">
        <div
          className="profile__bg"
          style={{ backgroundImage: `url(${userData && (userData?.background_image || demoBg)})` }}
        ></div>
        <div className="profile__info" id="profile-info">
          {/* === */}
          <div className="profile__info__cover">
            <div className="profile__info--name-level">
              <img
                className="profile__info--profile-image"
                src={userData?.profile || defaultCoverImg}
                alt="profile"
              />
              <div className="profile__info--profile-top">
                <div className="profile__info--profile--name">
                  <p className="profile__info--name-text">{userData?.name}</p>
                  {/* 팔로우버튼 */}
                  {children}
                </div>
                <div className="profile__info--count">
                  <div className="profile__info--level">
                    <p className="profile__info--level-text">Level</p>
                    {getUserGradeSquareIcon(userData?.user_rating) && (
                      <img
                        className="profile__info--level-icon"
                        src={getUserGradeSquareIcon(userData?.user_rating)}
                        alt="icon"
                      />
                    )}
                    <p className="profile__info--level-rating">{userData?.user_rating}</p>
                  </div>
                  <div className="profile__info--img-count">
                    {/* 해당 사용자의 모든 곡에 대한 재생 수 */}
                    <span className="total-play-count">125K</span>
                    {/* 해당 사용자의 모든 곡에 대한 좋아요 수 */}
                    <span className="total-like-count">145</span>
                  </div>
                </div>
                <div className="profile__record">
                  <div className="profile__record--item">
                    <p className="profile__record--item-title">{t('Songs')}</p>
                    <p className="profile__record--item-value">{userData?.total_songs}</p>
                  </div>
                  <div className="profile__record--item">
                    <p className="profile__record--item-title">{t('Following')}</p>
                    <p className="profile__record--item-value">{userData?.followings}</p>
                  </div>
                  <div className="profile__record--item">
                    <p className="profile__record--item-title">{t('Followers')}</p>
                    <p className="profile__record--item-value">{userData?.followers}</p>
                  </div>
                  <button
                    className="profile__record--item profile__record--modal-btn"
                    onClick={() => setIsInfoModalOpen(true)}
                  >
                    <img src={infoIcon} alt="Artist Information Modal Button" />
                  </button>
                </div>
              </div>
            </div>

            {isMyProfile && (
              <div className="profile__info__btns">
                <Link to={`/account-setting?prev=${pathname + queryParameter}`}>
                  {t('Edit profile')}
                </Link>
                {/* 라이센트 키 연동 시 버튼 삭제 필요 */}
                <Link
                  to={`/license-key`}
                  className="key-link"
                  //key-pass
                >
                  {t('Link license key')}
                </Link>
              </div>
            )}
          </div>
          {/* === */}
          {/* <div className="profile__record">
            <div className="profile__record--item">
              <p className="profile__record--item-title">{t('Songs')}</p>
              <p className="profile__record--item-value">{userData?.total_songs}</p>
            </div>
            <div className="profile__record--item">
              <p className="profile__record--item-title">{t('Following')}</p>
              <p className="profile__record--item-value">{userData?.followings}</p>
            </div>
            <div className="profile__record--item">
              <p className="profile__record--item-title">{t('Followers')}</p>
              <p className="profile__record--item-value">{userData?.followers}</p>
            </div>
          </div> */}
          {/* <div className="profile__desc">
            <p ref={contentRef} className={`profile__desc--content ${seeMore ? 'open' : ''}`}>
              {content}
            </p>
            {console.log('현재 클래스명:', `profile__desc--content ${seeMore ? 'open' : ''}`)}
            {showSeeMoreButton && (
              <button className="profile__desc--button" onClick={toggleSeeMore}>
                {seeMore ? t('Hide') : t('See More')}
              </button>
            )}
          </div> */}
          {userData?.link_list?.[0] && (
            <div className="profile__link">
              <img className="profile__link--icon" src={linkIcon} alt="link" />
              <Link className="profile__link--item" to={userData?.link_list?.[0].link} target="_b">
                {userData?.link_list?.[0].link}
              </Link>

              {linkCount > 0 && (
                <p className="profile__link--count" onClick={() => setLinksModal(true)}>
                  <span>{t('and')}</span> {linkCount} {t('link')}
                </p>
              )}
              {/* {userData?.link_list.length > 0 && (
                <p className="profile__link--count"
                  onClick={() => setLinksModal(true)}
                >
                  {userData?.link_list?.length-1} {t('external link')}
                </p>
              )} */}
            </div>
          )}
          <div className="profile__desc">
            <p ref={contentRef} className={`profile__desc--content ${seeMore ? 'open' : ''}`}>
              {content}
            </p>
            {console.log('현재 클래스명:', `profile__desc--content ${seeMore ? 'open' : ''}`)}
            {showSeeMoreButton && (
              <button className="profile__desc--button" onClick={toggleSeeMore}>
                {seeMore ? t('Hide') : t('See More')}
                <img
                  src={arrowDownIcon}
                  alt=""
                  className={`profile__desc--button__arrow ${seeMore ? 'up' : 'down'}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      {linksModal && (
        <LinksModal
          linkItems={userData?.link_list.map(item => item.link)}
          setLinksModal={setLinksModal}
        />
      )}

      {isInfoModalOpen && (
        <InfoModal onClose={() => setIsInfoModalOpen(false)} isMyProfile={isMyProfile} />
      )}
    </>
  );

  return (
    <div className="mypage__profile">
      <div className="mypage__profile-bg">
        <img src={demoBg} alt="profile-bg" />
      </div>
      <div className="mypage__profile-info">
        <div className="mypage__profile-edit-box">
          <div className="mypage__profile-img">
            <img src={userData?.profile || defaultCoverImg} alt="profile-img" />
          </div>
          <div className="mypage__profile-info-box">
            <p className="mypage__username">{userData?.name}</p>
            <div className="mypage__stats">
              <div className="stats__info">
                {/* <img src={demoFlag} alt="flag" /> */}
                {/* <span className="neon">Kor</span> */}
                <div>
                  <span>Level</span>
                  <span className="neon">{userData?.level}</span>
                </div>
                <div>
                  <span>Songs</span>
                  <span className="neon">{userData?.total_songs}</span>
                </div>
                <div>
                  <span>Followers</span>
                  <span className="neon">{userData?.followers}</span>
                </div>
              </div>
            </div>
          </div>
          {isMyProfile && (
            <Link to="/account-setting" className="mypage__profile-edit">
              <img src={gearImg} alt="gear" />
            </Link>
          )}
        </div>
        <p className="mypage__bio">{userData?.introduce || 'No introduction'}</p>
        {children}
      </div>
    </div>
  );
};

ProfileInfo.TokenAmount = ({ mic, mob }) => {
  return (
    <div className="mypage__exp">
      <div className="mypage__exp-box">
        <span className="exp-box__value">{mic}</span>
        <div className="exp-box__coin">
          <img className="exp-box__coin--image" src={micIcon} alt="mic" />
          <span className="exp-box__coin--text">MIC</span>
        </div>
      </div>
      <div className="mypage__exp-box">
        <span className="exp-box__value">{mob}</span>
        <div className="exp-box__coin">
          <img className="exp-box__coin--image" src={mobIcon} alt="mob" />
          <span className="exp-box__coin--text">MOB</span>
        </div>
      </div>
    </div>
  );
};

ProfileInfo.FollowingButton = ({ handleFollowing, title }) => {
  return (
    <button className="mypage__follow-btn follow" onClick={handleFollowing}>
      {title}
    </button>
  );
};

ProfileInfo.UnFollowingButton = ({ handleUnFollowing, title }) => {
  return (
    <button className="mypage__follow-btn unfollow" onClick={handleUnFollowing}>
      {title}
    </button>
  );
};

const Tabs = ({ tabs, handleTab, select }) => {
  const { t } = useTranslation('my_page');

  const [preparingModal, setPreparingModal] = useState(false);

  return (
    <nav className="mypage__nav">
      {tabs?.map(service => (
        <button
          key={service?.name}
          className={`mypage__nav-item ${select === service?.name ? 'active' : ''}`}
          onClick={() => {
            if (service.preparing) {
              setPreparingModal(true);
              return;
            } else if (handleTab) handleTab(service?.name);
          }}
        >
          {t(service?.name)}
        </button>
      ))}
      {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
    </nav>
  );
};
