// pages/MyPage.js
import '../styles/MyPage.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import demoBg from '../assets/images/mypage/demo-bg.png';
import gearImg from '../assets/images/mypage/gear.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';

import AiServices from '../components/mypage/AiServices';
import Songs from '../components/mypage/Songs';
import Albums from '../components/mypage/albums/Albums';
import MyFavorites from '../components/mypage/MyFavorites';
import { WalletConnect } from '../components/WalletConnect';

import { useUserDetail } from '../hooks/useUserDetail';
import PreparingModal from '../components/PreparingModal';
import Connections from '../components/mypage/Connections';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import UnFollowModal from '../components/UnFollowModal';
import SongsUser from '../components/mypage/SongsUser';
import NftMarketPlace from '../components/mypage/NftMarketPlace';
import Loading from '../components/IntroLogo2';

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
  const { token } = useContext(AuthContext);
  const { data: userData } = useUserDetail();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');

  const serviceTabObj = [
    { name: 'AI Services', preparing: false },
    { name: 'Songs', preparing: false },
    { name: 'Connections', preparing: false },
    { name: 'Favorites', preparing: false },
    { name: 'Albums', preparing: false },
    { name: 'NFT MarketPlace', preparing: false },
  ];

  const handleTab = tab => {
    if (tab === category) return;
    setSearchParams({ category: tab });
  };

  useEffect(() => {
    if (!category) {
      setSearchParams({ category: 'AI Services' }, { replace: true });
    }
  }, []);

  return (
    <div className="mypage">
      <ProfileInfo userData={userData} token={token} isMyProfile>
        <ProfileInfo.TokenAmount mic={0} mob={0} />
      </ProfileInfo>
      <Tabs tabs={serviceTabObj} select={category} handleTab={handleTab} />
      {category === 'AI Services' && <AiServices username={userData?.name} />}
      {category === 'Songs' && <Songs token={token} />}
      {category === 'Connections' && <Connections />}
      {category === 'Favorites' && <MyFavorites />}
      {category === 'Albums' && <Albums username={userData?.name} isCreate={true} />}
      {category === 'NFT MarketPlace' && <NftMarketPlace username={userData?.name} isMyProfile />}
    </div>
  );
};

//=================
// 다른 사람 페이지
//=================
const UserProfile = () => {
  // 데이터 정의
  const { walletAddress, token, setIsLoggedIn, setWalletAddress, isLoggedIn } =
    useContext(AuthContext);
  const { data: userData } = useUserDetail();
  const [searchParams, setSearchParams] = useSearchParams();
  const [unFollowModal, setUnFollowModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const username = searchParams.get('username');
  const category = searchParams.get('category');

  const serviceTabObj = [
    { name: 'AI Services', preparing: false },
    { name: 'Songs', preparing: false },
    { name: 'Albums', preparing: false },
    { name: 'NFT MarketPlace', preparing: false },
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
    ['user_profile', username, walletAddress],
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
      queryClient.setQueryData(['user_profile', username, walletAddress], prev => {
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
      navigate('/my-page', { replace: true });
    } else if (!username) {
      navigate('/', { replace: true });
    } else if (!category) {
      setSearchParams({ category: 'AI Services', username: username }, { replace: true });
    }
  }, []);

  return (
    <div className="mypage">
      <ProfileInfo userData={profileData}>
        {isLoggedIn && !isFetching ? (
          <>
            {profileData?.is_follow && (
              <ProfileInfo.UnFollowingButton handleUnFollowing={() => setUnFollowModal(true)} />
            )}
            {!profileData?.is_follow && (
              <ProfileInfo.FollowingButton handleFollowing={() => handleFollowing()} />
            )}
          </>
        ) : (
          <WalletConnect onConnect={handleWalletConnect} />
        )}
      </ProfileInfo>
      <Tabs tabs={serviceTabObj} handleTab={handleTab} select={category} />
      {category === 'AI Services' && <AiServices username={username} />}
      {category === 'Songs' && <SongsUser username={username} />}
      {category === 'Albums' && <Albums username={username} isCreate={false} />}
      {category === 'NFT MarketPlace' && <NftMarketPlace username={username} />}
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
  return (
    <div className="mypage__profile">
      <div className="profile__bg" style={{ backgroundImage: `url(${demoBg})` }}></div>
      {/**=== */}
      <div className="profile__info">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="profile__info--name-level">
            <img
              className="profile__info--profile-image"
              src={userData?.profile || defaultCoverImg}
              alt="profile"
            />
            <p className="profile__info--name-text">{userData?.name}</p>
            <div className="profile__info--level">
              <p className="profile__info--level-text">level</p>
              <img className="profile__info--level-icon" src="" alt="icon" />
              <p className="profile__info--level-rating">{userData?.user_rating}</p>
            </div>
          </div>
          <img src={gearImg} alt="edit" />
        </div>
      </div>
      {/**=== */}
      <div className="profile__record">
        <div className="profile__record--item">
          <p className="profile__record--item-title">Songs</p>
          <p className="profile__record--item-value"></p>
        </div>
        <div className="profile__record--item">
          <p className="profile__record--item-title">Following</p>
          <p className="profile__record--item-value"></p>
        </div>
        <div className="profile__record--item">
          <p className="profile__record--item-title">Followers</p>
          <p className="profile__record--item-value"></p>
        </div>
      </div>
      {/**=== */}
    </div>
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

ProfileInfo.FollowingButton = ({ handleFollowing }) => {
  return (
    <button className="mypage__follow-btn follow" onClick={handleFollowing}>
      FOLLOW
    </button>
  );
};

ProfileInfo.UnFollowingButton = ({ handleUnFollowing }) => {
  return (
    <button className="mypage__follow-btn unfollow" onClick={handleUnFollowing}>
      UNFOLLOW
    </button>
  );
};

const Tabs = ({ tabs, handleTab, select }) => {
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
          {service?.name}
        </button>
      ))}
      {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
    </nav>
  );
};
