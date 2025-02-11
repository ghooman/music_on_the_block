import React, { useState } from "react";
import "./AiServices.scss";
import demoChart from "../../assets/images/mypage/demo-chart.png";
import demoChart2 from "../../assets/images/mypage/demo-chart2.png";
import demoChart3 from "../../assets/images/mypage/demo-chart3.png";
import FilterDateModal from "../../components/unit/FilterDateModal";
import Filter from "../unit/Filter";
const AiServices = () => {
  const [selectedAiService, setSelectedAiService] = useState(
    "AI Lyric & Songwriting"
  );

  const [openModal, setOpenModal] = useState(false);

  const handleAiServiceClick = (aiService) => {
    setSelectedAiService(aiService);
  };
  return (
    <>
      <div className="ai__services">
        {[
          "AI Lyric & Songwriting",
          "AI Singing Evaluation",
          "AI Cover Creation",
        ].map((aiService) => (
          <button
            key={aiService}
            className={`ai__service-btn ${
              selectedAiService === aiService ? "active" : ""
            }`}
            onClick={() => handleAiServiceClick(aiService)}
          >
            {aiService}
          </button>
        ))}
      </div>

      <div className="ai__chart">
        <img src={demoChart} alt="chart" />
      </div>

      <section className="ai__ai-status">
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

      <section className="ai__period">
        <p className="period__title">AI Work Trends by Period</p>
        <div className="period__menu">
          <Filter
            list={["All", "Lyric", "Latest"]}
            clickEvent={() => setOpenModal(true)}
          />
        </div>
        <div className="period__chart">
          <img src={demoChart3} alt="chart" />
        </div>
      </section>
      {openModal && <FilterDateModal setOpenModal={setOpenModal} />}
    </>
  );
};
export default AiServices;
