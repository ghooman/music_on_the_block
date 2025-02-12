import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MyPage.scss";
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
const MyPage = () => {
  const [selectedService, setSelectedService] = useState("AI Services");

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  return (
    <div className="mypage">
      {/* 프로필 섹션 */}
      <div className="mypage__profile">
        <div className="mypage__profile-bg">
          <img src={demoBg} alt="profile-bg" />
        </div>
        <div className="mypage__profile-overlay"> </div>
        <div className="mypage__profile-info">
          <div className="mypage__profile-edit-box">
            <div className="mypage__profile-img">
              <img src={demoUser} alt="profile-img" />
            </div>
            <div className="mypage__profile-info-box">
              <p className="mypage__username">UserName</p>
              <div className="mypage__stats">
                <div className="stats__info">
                  <img src={demoFlag} alt="flag" />
                  <span className="neon">Kor</span>
                  <span>/ Level</span>
                  <span className="neon">10</span>
                </div>
              </div>
            </div>
            <Link to="/account-setting" className="mypage__profile-edit">
              <img src={gearImg} alt="gear" />
            </Link>
          </div>
          <p className="mypage__bio">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className="mypage__social-icons">
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
          </div>
          <div className="mypage__exp">
            <div className="mypage__exp-box">
              <span className="exp-box__neon">EXP</span>
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
        {[
          "AI Services",
          "Albums",
          "My Favorites",
          "Rewards & Payments",
          "Tournaments",
        ].map((service) => (
          <button
            key={service}
            className={`mypage__nav-item ${
              selectedService === service ? "active" : ""
            }`}
            onClick={() => handleServiceClick(service)}
          >
            {service}
          </button>
        ))}
      </nav>
      {selectedService === "AI Services" && <AiServices />}
      {selectedService === "Albums" && <Albums />}
      {selectedService === "My Favorites" && <MyFavorites />}
      {selectedService === "Rewards & Payments" && <Reward />}
    </div>
  );
};

export default MyPage;
