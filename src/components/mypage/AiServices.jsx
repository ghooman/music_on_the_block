import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './AiServices.scss';

import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

import generatedLyricSongwritingIcon from '../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../assets/images/icon/generated-cover-creation.svg';

import FilterDateModal from '../../components/unit/FilterDateModal';
import PreparingModal from '../PreparingModal';
import SubCategories from '../unit/SubCategories';
import { BarChart, LineChart, PieChart } from '../unit/Chart';

const serverApi = process.env.REACT_APP_SERVER_API;

const AiServiceTypeList = [
  { name: 'AI Lyrics & Songwriting', image: generatedLyricSongwritingIcon, preparing: false },
  { name: 'AI Singing Evaluation', image: generatedSigingEvaluationIcon, preparing: true },
  { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
];
const AiStatusList = [
  { name: 'All' },
  { name: 'Lyrics + Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
  { name: 'Songwriting', image: SongwritingIcon, preparing: true },
];

const AiServices = ({ username }) => {
  const [openModal, setOpenModal] = useState(false);
  const [showPreparingModal, setShowPreparingModal] = useState(false);

  const [selectedServiceChartItem, setSelectedSErviceChartItem] = useState(
    AiServiceTypeList[0].name
  );
  const [selectedStatusChartItem, setSelectedStatusItem] = useState(AiStatusList[0]?.name);

  const [dailyUsageData, setDailyUsageData] = useState([]);
  const [songRatingCountData, setSongRatingCountData] = useState();

  const [aiServiceData, setAiServiceData] = useState();
  const aiServiceChartData = [
    {
      id: 'AI Lyrics & Songwriting',
      value: aiServiceData?.song_writing,
      color: 'hsl(252, 100%, 50%)',
      preparing: false,
      image: generatedLyricSongwritingIcon,
    },
    {
      id: 'AI Singing Evaluation',
      value: aiServiceData?.singing_evaluation,
      color: 'hsl(162, 100%, 50%)',
      preparing: true,
      image: generatedSigingEvaluationIcon,
    },
    {
      id: 'AI Cover Creation',
      value: aiServiceData?.cover_creation,
      color: 'hsl(342, 100%, 50%)',
      preparing: true,
      image: generatedCoverCreationIcon,
    },
  ];

  const [aiStatusData, setAiStatusData] = useState();
  const aiStatusChartData = [
    {
      id: 'Lyrics + Songwriting',
      value: aiStatusData?.total_creation,
      color: 'hsl(101, 100.00%, 26.10%)',
      preparing: false,
    },
    {
      id: 'Songwriting',
      value: 0,
      color: 'hsl(139, 100.00%, 11.00%)',
      preparing: true,
    },
  ];

  useEffect(() => {
    if (!username) return;

    const getAiServiceData = async () => {
      try {
        const res = await axios.get(`${serverApi}/api/user/statistics?name=${username}`);
        setAiServiceData(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    const getStatusData = async () => {
      try {
        const res = await axios.get(`${serverApi}/api/user/ai/service/statistics?name=${username}`);
        setAiStatusData(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    const getSongRatingCount = async () => {
      try {
        const res = await axios.get(
          `${serverApi}/api/user/song/rating/count?user_name=${username}`
        );
        console.log('등급별 카운트', res.data);
        const data = Object.entries(res.data)?.map(([key, value]) => {
          return { date: key, value: value };
        });
        console.log(data, '등급별 카운트2');

        setSongRatingCountData(data);
      } catch (e) {
        console.error(e);
      }
    };

    const getDailyUsageData = async () => {
      try {
        const res = await axios.get(
          `${serverApi}/api/user/daily/ai/usage/statistics?name=${username}`
        );
        const formatXY = res.data?.map(item => ({ x: item.record_date, y: item.cnt }));
        setDailyUsageData(formatXY);
      } catch (e) {
        console.error(e);
      }
    };

    getSongRatingCount();
    getAiServiceData();
    getStatusData();
    getDailyUsageData();
  }, [username]);

  return (
    <>
      {/** 차트 조작 버튼입니다. */}
      <div className="ai__services">
        {AiServiceTypeList?.map(item => (
          <button
            key={item.name}
            className={`ai__service-btn ${selectedServiceChartItem === item.name ? 'active' : ''}`}
            onClick={() => {
              if (item?.preparing) {
                setShowPreparingModal(true);
                return;
              }
              setSelectedSErviceChartItem(item.name);
            }}
          >
            <div className="ai__service-btn--image">
              <img src={item.image} alt="icon" />
            </div>
            {item.name}
          </button>
        ))}
      </div>

      {/** 콘텐츠 */}
      <div className="ai__chart">
        <PieChart
          height={300}
          width={300}
          data={aiServiceChartData}
          selectedItem={selectedServiceChartItem}
          legends
        />
      </div>

      {/** 차트 조작 */}
      <section className="ai__ai-status">
        <p className="ai-status__title">AI Service Status</p>
        <SubCategories
          categories={AiStatusList}
          handler={setSelectedStatusItem}
          value={selectedStatusChartItem}
        />
        {/** 콘텐츠 */}
        <div className="ai-status__info">
          <div className="ai-status__chart">
            {/* <img src={demoChart2} alt="chart" /> */}
            <PieChart
              height={300}
              width={300}
              data={aiStatusChartData}
              selectedItem={selectedStatusChartItem}
            />
          </div>
          <div className="ai-status__detail">
            <p className="ai-status__detail-title">AI Service Details</p>
            <div className="ai-status__detail-box">
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Top Genre</p>
                <p className="detail-item__value">{aiStatusData?.top_type || '-'}</p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Creation</p>
                <p className="detail-item__value">
                  {aiStatusData?.total_creation?.toLocaleString() || '-'}
                </p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Earn</p>
                <p className="detail-item__value">
                  {aiStatusData?.total_earn?.toLocaleString() || '-'} MIC
                </p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Likes</p>
                <p className="detail-item__value">
                  {aiStatusData?.total_likes?.toLocaleString() || '-'}
                </p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Total Plays</p>
                <p className="detail-item__value">
                  {aiStatusData?.total_plays?.toLocaleString() || '-'}
                </p>
              </div>
              <div className="ai-status__detail-item">
                <p className="detail-item__title">Last Used Date</p>
                <p className="detail-item__value">{aiStatusData?.last_used_date || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai__period">
        <p className="period__title">Graph List</p>
        <div className="period__menu"></div>
        <div className="period__chart">
          <div className="period__chart--item">
            <p>Song Grade Distribution</p>
            {dailyUsageData && <LineChart data={dailyUsageData} />}
          </div>
          <div className="period__chart--item">
            <p>Al Work Trends By Period (7-Dats Fixed)</p>
            {songRatingCountData && <BarChart data={songRatingCountData} />}
          </div>
        </div>
      </section>
      {openModal && <FilterDateModal setOpenModal={setOpenModal} />}
      {showPreparingModal && <PreparingModal setPreparingModal={setShowPreparingModal} />}
    </>
  );
};

export default AiServices;
