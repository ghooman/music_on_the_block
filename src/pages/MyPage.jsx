// pages/MyPage.js
import '../styles/MyPage.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import demoBg from '../assets/images/mypage/demo-bg.png';
import demoUser from '../assets/images/mypage/demo-user.png';
import demoFlag from '../assets/images/mypage/demo-flag.png';
import gearImg from '../assets/images/mypage/gear.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import micIcon from '../assets/images/icon/mic-icon.svg';
import instarIcon from '../assets/images/social/instar.svg';
import facebookIcon from '../assets/images/social/facebook.svg';
import xIcon from '../assets/images/social/x.svg';
import discordIcon from '../assets/images/social/discord.svg';
import youtubeIcon from '../assets/images/social/youtube.svg';

import AiServices from '../components/mypage/AiServices';
import Albums from '../components/mypage/Albums';
import MyFavorites from '../components/mypage/MyFavorites';
import Reward from '../components/mypage/Reward';

import { useUserDetail } from '../hooks/useUserDetail';
import PreparingModal from '../components/PreparingModal';
import Connections from '../components/mypage/Connections';

const serviceTab = ['AI Services', 'Reward & Payments'];
const musicTab = ['Songs', 'Connections', 'Favorites', 'Albums'];

const MyPage = () => {
    const { path } = useParams();
    const { data: userData } = useUserDetail();
    const { token } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPreparingModal, setPreparingModal] = useState(false);

    const category = searchParams.get('category');
    const tabs = path === 'music' ? musicTab : serviceTab;
    const handleServiceClick = (service) => {
        // if (serviceTab?.includes(service)) {
        setSearchParams({ category: service });
        // } else {
        // setPreparingModal(true);
        // }
    };

    useEffect(() => {
        if (!category || category !== tabs[0]) {
            setSearchParams({ category: tabs[0] }, { replace: true });
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
                            <img src={userData?.profile || demoUser} alt="profile-img" />
                        </div>
                        <div className="mypage__profile-info-box">
                            <p className="mypage__username">{userData?.name}</p>
                            <div className="mypage__stats">
                                <div className="stats__info">
                                    {/* <img src={demoFlag} alt="flag" /> */}
                                    {/* <span className="neon">Kor</span> */}
                                    <div>
                                        <span>Level</span>
                                        <span className="neon">10</span>
                                    </div>
                                    <div>
                                        <span>Songs</span>
                                        <span className="neon">624</span>
                                    </div>
                                    <div>
                                        <span>Followers</span>
                                        <span className="neon">1,235</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/account-setting" className="mypage__profile-edit">
                            <img src={gearImg} alt="gear" />
                        </Link>
                    </div>
                    <p className="mypage__bio">{userData?.introduce || 'No introduction'}</p>
                    {/* <div className="mypage__social-icons">
            <button className="social-icon">
              <img src={instarIcon} alt="social" />
            </button>
            <button className="social-icon">
              <img src={facebookIcon} alt="social" />
            </button>
            <button className="social-icon">
              <img src={xIcon} alt="social" />
            </button>
            <button className="social-icon">
              <img src={discordIcon} alt="social" />
            </button>
            <button className="social-icon">
              <img src={youtubeIcon} alt="social" />
            </button>
          </div> */}
                    <div className="mypage__exp">
                        <div className="mypage__exp-box">
                            <span className="exp-box__value">52,104</span>
                            <div className="exp-box__coin">
                                <img className="exp-box__coin--image" src={micIcon} alt="mic" />
                                <span className="exp-box__coin--text">MIC</span>
                            </div>
                        </div>
                        <div className="mypage__exp-box">
                            <span className="exp-box__value">2,104</span>
                            <div className="exp-box__coin">
                                <img className="exp-box__coin--image" src={mobIcon} alt="mob" />
                                <span className="exp-box__coin--text">MOB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="mypage__nav">
                {tabs.map((service) => (
                    <button
                        key={service}
                        className={`mypage__nav-item ${category === service ? 'active' : ''}`}
                        onClick={() => handleServiceClick(service)}
                    >
                        {service}
                    </button>
                ))}
            </nav>
            {/** service */}
            {category === 'AI Services' && <AiServices />}
            {category === 'Reward & Payments' && <Reward />}

            {/** music */}
            {category === 'Songs' && <Albums token={token} />}
            {category === 'Connections' && <Connections />}
            {category === 'Favorites' && <MyFavorites />}
            {category === 'Albums' && <div></div>}

            {/** */}
            {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
        </div>
    );
};

export default MyPage;
