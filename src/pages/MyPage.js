import React, { useState } from "react";
import "../styles/MyPage.scss";
import demoBg from "../assets/images/mypage/demo-bg.png";
import demoUser from "../assets/images/mypage/demo-user.png";
import demoFlag from "../assets/images/mypage/demo-flag.png";
import gearImg from "../assets/images/mypage/gear.svg";
import demoSocial from "../assets/images/mypage/instar.png";
import demoChart from "../assets/images/mypage/demo-chart.png";
import demoChart2 from "../assets/images/mypage/demo-chart2.png";
import demoChart3 from "../assets/images/mypage/demo-chart3.png";
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

      <div className="mypage__chart">
        <img src={demoChart} alt="chart" />
      </div>

      <section className="mypage__ai-status">
        <p className="ai-status__title">AI Service Status</p>
        <div className="ai-status__menu">
          <button className="ai-status__menu-item active">All</button>
          <button className="ai-status__menu-item">Lyric</button>
          <button className="ai-status__menu-item">Songwritiy</button>
          <button className="ai-status__menu-item">Lyric & Songwritiy</button>
        </div>

        <div className="ai-status__info">
          <div className="ai-status__chart">
            <img src={demoChart2} alt="chart" />
          </div>
          <div className="ai-status__detail">
            <p className="ai-status__detail-title">AI Service Detail</p>
            <div className="ai-status__detail-box">
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Top Tags</p>
                <p className="detail-item__value">Love</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Creation</p>
                <p className="detail-item__value">239</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Cost</p>
                <p className="detail-item__value">5,304 MOB</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Top Game</p>
                <p className="detail-item__value">Ballad</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Top Style</p>
                <p className="detail-item__value">Romantic</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Last Used Date</p>
                <p className="detail-item__value">
                  Sat, 04 Nov 2023 14:40:00 UTC+0
                  <br />
                  Sat, 04 Nov 2023 14:40:00 UTC+9
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mypage__period">
        <p className="period__title">AI Work Trends by Period</p>
        <div className="period__menu">
          <button className="period__menu-item">Filter</button>
          <button className="period__menu-item">Month</button>
          <button className="period__menu-item">5</button>
        </div>
        <div className="period__chart">
          <img src={demoChart3} alt="chart" />
        </div>
      </section>
    </div>
  );
};

export default MyPage;
