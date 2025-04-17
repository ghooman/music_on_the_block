// pages/MyPage.js
import '../styles/MyPage.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import demoBg from '../assets/images/mypage/demo-bg.png';
import gearImg from '../assets/images/mypage/gear.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import defaultCoverImg from '../assets/images/header/logo.svg';
import instarIcon from '../assets/images/social/instar.svg';
import facebookIcon from '../assets/images/social/facebook.svg';
import xIcon from '../assets/images/social/x.svg';
import discordIcon from '../assets/images/social/discord.svg';
import youtubeIcon from '../assets/images/social/youtube.svg';

import AiServices from '../components/mypage/AiServices';
import Songs from '../components/mypage/Songs';
import Albums from '../components/mypage/Albums';
import MyFavorites from '../components/mypage/MyFavorites';
import Reward from '../components/mypage/Reward';
import { WalletConnect } from '../components/WalletConnect';

import { useUserDetail } from '../hooks/useUserDetail';
import PreparingModal from '../components/PreparingModal';
import Connections from '../components/mypage/Connections';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import UnFollowModal from '../components/UnFollowModal';

const serverApi = process.env.REACT_APP_SERVER_API;

const serviceTabObj = [
    { name: 'AI Services', preparing: false },
    { name: 'Reward & Payments', preparing: true },
];
const musicTabObj = [
    { name: 'Songs', preparing: false },
    { name: 'Connections', preparing: false },
    { name: 'Favorites', preparing: false },
    { name: 'Albums', preparing: false },
];

/**
 *
 * @param {boolean} isMyProfile : 현재 컴포넌트가 나의 정보를 보여주어야 하는지 다른 유저의 정보를 보여주어야 하는지 결정하는 파라미터
 * @returns
 */

const MyPage = ({ isMyProfile }) => {
    // 분기 설정

    if (isMyProfile) return <MyProfile />;
    else return <UserProfile />;
};

export default MyPage;

//==================================================
//==================================================
//=================데이터 정의=========================
//==================================================
//==================================================

const MyProfile = () => {
    // 데이터 정의
    const { token } = useContext(AuthContext);
    const { data: userData } = useUserDetail();
    return (
        <Templates userData={userData} token={token} isMyProfile>
            <Templates.TokenAmount mic={0} mob={0} />
        </Templates>
    );
};

const UserProfile = () => {
    // 데이터 정의
    const { walletAddress, token, setIsLoggedIn, setWalletAddress, isLoggedIn } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [unFollowModal, setUnFollowModal] = useState(false);

    const queryClient = useQueryClient();
    const username = searchParams.get('username');

    const handleWalletConnect = (loggedIn, walletAddress) => {
        setIsLoggedIn(loggedIn);
        if (loggedIn && walletAddress) {
            setWalletAddress(walletAddress);
        }
    };

    const {
        data: profileData,
        refetch,
        isLoading,
    } = useQuery(
        ['user_profile', username, walletAddress],
        async () => {
            const res = await axios.get(
                `${serverApi}/api/user/profile?name=${username}&wallet_address=${walletAddress?.address}`
            );
            return res.data;
        },
        { refetchOnWindowFocus: false }
    );

    // 팔로잉
    const handleFollowing = async () => {
        if (!token) return;
        const update = (follow) => {
            queryClient.setQueryData(['user_profile', username, walletAddress], (prevData) => {
                return { ...prevData, is_follow: follow };
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

    // 언팔로잉은 언팔로잉 모달에서 진행합니다.

    return (
        <>
            <Templates userData={profileData}>
                {isLoggedIn && !isLoading ? (
                    <>
                        {profileData?.is_follow && (
                            <Templates.UnFollowingButton handleUnFollowing={() => setUnFollowModal(true)} />
                        )}
                        {!profileData?.is_follow && (
                            <Templates.FollowingButton handleFollowing={() => handleFollowing()} />
                        )}
                    </>
                ) : (
                    <WalletConnect onConnect={handleWalletConnect} />
                )}
            </Templates>
            {unFollowModal && isLoggedIn && (
                <UnFollowModal
                    setUnFollowModal={setUnFollowModal}
                    profileData={profileData}
                    handleClick={handleUnFollowing}
                />
            )}
        </>
    );
};

//==================================================
//==================================================
//=================구현부============================
//==================================================
//==================================================

const Templates = ({ userData, token, isMyProfile, children }) => {
    const { path } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPreparingModal, setPreparingModal] = useState(false);

    const tabs = path === 'music' ? musicTabObj : serviceTabObj;
    const category = searchParams.get('category');

    const handleServiceClick = (service) => {
        setSearchParams({ category: service });
    };

    useEffect(() => {
        if (!category || category !== tabs[0].name) {
            setSearchParams(
                (prev) => {
                    return { category: tabs[0].name, ...Object.fromEntries(prev) };
                },
                { replace: true }
            );
        }
    }, []);

    return (
        <div className="mypage">
            {/* 프로필 섹션 */}
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
            <nav className="mypage__nav">
                {tabs.map((service) => (
                    <button
                        key={service.name}
                        className={`mypage__nav-item ${category === service.name ? 'active' : ''}`}
                        onClick={() => {
                            if (service.preparing) {
                                setPreparingModal(true);
                                return;
                            }
                            handleServiceClick(service.name);
                        }}
                    >
                        {service.name}
                    </button>
                ))}
            </nav>
            {/** service */}
            {category === 'AI Services' && <AiServices username={userData?.name} />}
            {/* {category === 'Reward & Payments' && <Reward />} */}

            {/** music */}
            {path === 'music' && category === 'Songs' && <Songs token={token} />}
            {path === 'music' && category === 'Connections' && <Connections />}
            {path === 'music' && category === 'Favorites' && <MyFavorites />}
            {path === 'music' && category === 'Albums' && <Albums />}

            {/** */}
            {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
        </div>
    );
};

Templates.TokenAmount = ({ mic, mob }) => {
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

Templates.FollowingButton = ({ handleFollowing }) => {
    return (
        <button className="mypage__follow-btn follow" onClick={handleFollowing}>
            FOLLOW
        </button>
    );
};

Templates.UnFollowingButton = ({ handleUnFollowing }) => {
    return (
        <button className="mypage__follow-btn unfollow" onClick={handleUnFollowing}>
            UNFOLLOW
        </button>
    );
};
