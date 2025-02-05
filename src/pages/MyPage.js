import React, { useState } from "react";
import "../styles/MyPage.scss";
import demoBg from "../assets/images/mypage/demo-bg.png";
import demoUser from "../assets/images/mypage/demo-user.png";
import demoFlag from "../assets/images/mypage/demo-flag.png";
import gearImg from "../assets/images/mypage/gear.svg";
import demoSocial from "../assets/images/mypage/instar.png";

const MyPage = () => {
  const [selectedService, setSelectedService] = useState("AI Services");
  const [selectedAiService, setSelectedAiService] = useState(
    "AI Lyric & Songwriting"
  );

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleAiServiceClick = (aiService) => {
    setSelectedAiService(aiService);
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
            <div className="mypage__profile-edit">
              <img src={gearImg} alt="gear" />
            </div>
          </div>
          <p className="mypage__bio">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className="mypage__social-icons">
            <button className="social-icon">
              <img src={demoSocial} alt="social" />
            </button>
            <button className="social-icon">
              <img src={demoSocial} alt="social" />
            </button>
            <button className="social-icon">
              <img src={demoSocial} alt="social" />
            </button>
            <button className="social-icon">
              <img src={demoSocial} alt="social" />
            </button>
            <button className="social-icon">
              <img src={demoSocial} alt="social" />
            </button>
          </div>
          <div className="mypage__exp">
            <div className="mypage__exp-box">
              <span className="exp-box__neon">EXP*</span>
              <span className="exp-box__value">52,104</span>
            </div>
            <div className="mypage__exp-box">
              <span className="exp-box__neon">MOB*</span>
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

      <div className="mypage__services">
        {[
          "AI Lyric & Songwriting",
          "AI Singing Evaluation",
          "AI Cover Creation",
        ].map((aiService) => (
          <button
            key={aiService}
            className={`mypage__service-btn ${
              selectedAiService === aiService ? "active" : ""
            }`}
            onClick={() => handleAiServiceClick(aiService)}
          >
            {aiService}
          </button>
        ))}
      </div>

      <section className="mypage__status">
        <h3 className="mypage__title">
          AI Service <span>Status*</span>
        </h3>
        <div className="mypage__status-filters">
          {["ALL", "Lyric", "Songwriting", "Lyric & Songwriting"].map(
            (filter) => (
              <button key={filter} className="status-filter">
                {filter}
              </button>
            )
          )}
        </div>
        <div className="mypage__chart"></div>
      </section>

      {/* AI 서비스 상세 정보 */}
      <section className="mypage__details">
        <h3 className="mypage__title">AI Service Detail</h3>
        <div className="mypage__info-grid">
          <div className="mypage__info-card">
            <h4>Top Tags</h4>
            <span className="mypage__highlight">Love</span>
          </div>
          <div className="mypage__info-card">
            <h4>Total Creation</h4>
            <p>239</p>
          </div>
          <div className="mypage__info-card">
            <h4>Total Cost</h4>
            <p>5,304 MOB</p>
          </div>
          <div className="mypage__info-card">
            <h4>Top Genre</h4>
            <p>Ballad</p>
          </div>
          <div className="mypage__info-card">
            <h4>Top Style</h4>
            <p>Romantic</p>
          </div>
          <div className="mypage__info-card">
            <h4>Last Used Date</h4>
            <p>Sat, 04 Nov 2023 14:40:00 UTC+9</p>
          </div>
        </div>
      </section>

      {/* AI 작업 트렌드 */}
      <section className="mypage__trends">
        <h3 className="mypage__title">AI Work Trends by Period*</h3>
        <div className="mypage__filters">
          <button className="active">Filter</button>
          <button>Month</button>
          <button>Year</button>
        </div>
        <div className="mypage__chart"></div>
      </section>
    </div>
  );
};

export default MyPage;
