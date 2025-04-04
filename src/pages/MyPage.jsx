// pages/MyPage.js
import "../styles/MyPage.scss";
import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import demoBg from "../assets/images/mypage/demo-bg.png";
import demoUser from "../assets/images/mypage/demo-user.png";
import demoFlag from "../assets/images/mypage/demo-flag.png";
import gearImg from "../assets/images/mypage/gear.svg";
import instarIcon from "../assets/images/social/instar.svg";
import facebookIcon from "../assets/images/social/facebook.svg";
import xIcon from "../assets/images/social/x.svg";
import discordIcon from "../assets/images/social/discord.svg";
import youtubeIcon from "../assets/images/social/youtube.svg";

import AiServices from "../components/mypage/AiServices";
import Albums from "../components/mypage/Albums";
import MyFavorites from "../components/mypage/MyFavorites";
import Reward from "../components/mypage/Reward";

import { useUserDetail } from "../hooks/useUserDetail";
import PreparingModal from "../components/PreparingModal";

const MyPage = () => {
  const { data: userData } = useUserDetail();
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const defaultService =
    initialCategory === "Albums" || initialCategory === "AI Services"
      ? initialCategory
      : "AI Services";
  const [selectedService, setSelectedService] = useState(defaultService);
  const [isPreparingModal, setPreparingModal] = useState(false);

  useEffect(() => {
    // URL 파라미터가 변경되었을 때 상태를 업데이트
    const category = searchParams.get("category");
    if (category === "Albums" || category === "AI Services") {
      setSelectedService(category);
    }
  }, [searchParams]);

  const handleServiceClick = (service) => {
    if (service === "AI Services" || service === "Albums") {
      setSelectedService(service);
      // URL의 쿼리 파라미터 업데이트
      setSearchParams({ category: service });
      setPreparingModal(false);
    } else {
      // 선택된 서비스는 유지하고 프리페어링 모달만 표시
      setPreparingModal(true);
    }
  };

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
                  <span>Level</span>
                  <span className="neon">10</span>
                </div>
              </div>
            </div>
            <Link to="/account-setting" className="mypage__profile-edit">
              <img src={gearImg} alt="gear" />
            </Link>
          </div>
          <p className="mypage__bio">
            {userData?.introduce || "No introduction"}
          </p>
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
              <span className="exp-box__neon">MIC</span>
              <span className="exp-box__value">52,104</span>
            </div>
            <div className="mypage__exp-box">
              <span className="exp-box__neon">MOB</span>
              <span className="exp-box__value">2,104</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="mypage__nav">
        {["AI Services", "Albums", "My Favorites", "Rewards & Payments"].map(
          (service) => (
            <button
              key={service}
              className={`mypage__nav-item ${
                selectedService === service ? "active" : ""
              }`}
              onClick={() => handleServiceClick(service)}
            >
              {service}
            </button>
          )
        )}
      </nav>

      {selectedService === "AI Services" && <AiServices />}
      {selectedService === "Albums" && <Albums token={token} />}
      {isPreparingModal && (
        <PreparingModal setPreparingModal={setPreparingModal} />
      )}
    </div>
  );
};

export default MyPage;
