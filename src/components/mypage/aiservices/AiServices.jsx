import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import './AiServices.scss';

import LyricsIcon from '../../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../../assets/images/icon/Composition-Icon.svg';

import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import FilterDateModal from '../../../components/unit/FilterDateModal';
import PreparingModal from '../../PreparingModal';
import SubCategories from '../../unit/SubCategories';
import Loading from '../../IntroLogo2';
import { BarChart, LineChart, PieChart } from '../../unit/Chart';

import { formatLocalTime } from '../../../utils/getFormattedTime';

import { disableEvaluation } from '../../../data/service';
import { criticsDataForArray } from '../../../data/criticsData';

const serverApi = process.env.REACT_APP_SERVER_API;

const AiServiceTypeList = [
  { name: 'AI Lyrics & Songwriting', image: generatedLyricSongwritingIcon, preparing: false },
  {
    name: 'AI Singing Evaluation',
    image: generatedSigingEvaluationIcon,
    preparing: disableEvaluation,
  },
  { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
];

const AiServices = ({ username }) => {
  const { t } = useTranslation('my_page');

  const [openModal, setOpenModal] = useState(false);
  const [showPreparingModal, setShowPreparingModal] = useState(false);

  const [selectedServiceChartItem, setSelectedServiceChartItem] = useState(
    AiServiceTypeList[0].name
  );

  // 최상단 차트 데이터 GET
  const { data: aiServiceData, isLoading } = useQuery(
    ['ai_service_data_overview', username],
    async () => {
      const res = await axios.get(`${serverApi}/api/user/statistics?name=${username}`);
      return res.data;
    }
  );

  const aiServiceChartData = [
    {
      id: 'AI Lyrics & Songwriting',
      value: aiServiceData?.song_writing,
      color: 'hsl(252, 100%, 50%)',
      image: generatedLyricSongwritingIcon,
    },
    {
      id: 'AI Singing Evaluation',
      value: aiServiceData?.singing_evaluation,
      color: 'hsl(162, 100%, 50%)',
      image: generatedSigingEvaluationIcon,
    },
    {
      id: 'AI Cover Creation',
      value: aiServiceData?.cover_creation,
      color: 'hsl(342, 100%, 50%)',
      image: generatedCoverCreationIcon,
    },
  ];

  return (
    <>
      <section className="ai__ai-status">
        <p className="ai-status__title">{t('AI Services')}</p>
        {/** 차트 조작 버튼입니다. */}
        <div className="ai__services">
          {AiServiceTypeList?.map(item => (
            <button
              key={item.name}
              className={`ai__service-btn ${
                selectedServiceChartItem === item.name ? 'active' : ''
              }`}
              onClick={() => {
                if (item?.preparing) {
                  setShowPreparingModal(true);
                  return;
                }
                setSelectedServiceChartItem(item.name);
              }}
            >
              <div className="ai__service-btn--image">
                <img src={item.image} alt="icon" />
              </div>
              {t(item.name)}
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
      </section>
      {/** 차트 조작 */}
      {selectedServiceChartItem === 'AI Lyrics & Songwriting' && (
        <>
          <LyricsAndSonwritingStatus t={t} username={username} />
          <LyricsAndSonwritingGraph t={t} username={username} />
        </>
      )}
      {selectedServiceChartItem === 'AI Singing Evaluation' && (
        <>
          <EvaluationStatus t={t} username={username} />
          <EvaluationGraph t={t} username={username} />
        </>
      )}

      {openModal && <FilterDateModal setOpenModal={setOpenModal} />}
      {showPreparingModal && <PreparingModal setPreparingModal={setShowPreparingModal} />}
      <Loading isLoading={isLoading} />
    </>
  );
};

export default AiServices;

//===================
// 곡 생성 상세 정보
//===================

const LyricsAndSonwritingStatus = ({ t, username }) => {
  const [select, setSelect] = useState('All');

  const { data: statusData } = useQuery(
    [`status_data_for_lyrics_songwriting`, username],
    async () => {
      const res = await axios.get(`${serverApi}/api/user/ai/service/statistics?name=${username}`);

      return res.data;
    }
  );

  const AiStatusList = [
    { name: 'All' },
    { name: 'Song', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'BGM', image: SongwritingIcon, preparing: false },
  ];

  const aiStatusChartData = [
    {
      id: 'Song',
      value: statusData?.total_song_creation,
      color: 'hsl(101, 100.00%, 26.10%)',
    },
    {
      id: 'BGM',
      value: statusData?.total_bgm_creation,
      color: 'hsl(139, 100.00%, 11.00%)',
    },
  ];

  const detailsArray = [
    { title: 'Top Genre', value: statusData?.top_type || '-' },
    { title: 'Total Creation', value: statusData?.total_creation?.toLocaleString() || '-' },
    { title: 'Total Earn', value: (statusData?.total_earn?.toLocaleString() || '-') + 'MIC' },
    { title: 'Total Likes', value: statusData?.total_likes?.toLocaleString() || '-' },
    { title: 'Total Plays', value: statusData?.total_plays?.toLocaleString() || '-' },
    {
      title: 'Last Used Date',
      value: statusData?.last_used_date ? formatLocalTime(statusData?.last_used_date) : '-',
    },
  ];

  return (
    <StatusTemplate
      t={t}
      categories={AiStatusList}
      select={select}
      setSelect={setSelect}
      pieChartData={aiStatusChartData}
      detailData={detailsArray}
    />
  );
};

//===================
// 평가 관련 상세 정보
//===================

const EvaluationStatus = ({ t, username }) => {
  const [select, setSelect] = useState('All');

  const { data: statusData } = useQuery(['status_data_for_evaluation_data', username], async () => {
    const res = await axios.get(
      `${serverApi}/api/user/evaluation/service/statistics?name=${username}`
    );

    return res.data;
  });

  const categories = [{ name: 'All' }, ...criticsDataForArray.map(item => ({ name: item.name }))];
  const detailsArray = [
    { title: 'Total Evaluation', value: statusData?.total_evaluation || 0 },
    { title: 'Top Score', value: statusData?.top_score || 0 },
    { title: 'Top Emotion', value: statusData?.top_emotion || 0 },
    { title: 'Top Creativity', value: statusData?.top_creativity || 0 },
    { title: 'Top Structure', value: statusData?.top_structure || 0 },
    { title: 'Top Sound', value: statusData?.top_sound || 0 },
    { title: 'Top Popularity', value: statusData?.top_popularity || 0 },
  ];

  const findCriticsCount = name => {
    if (statusData?.data_list) {
      return statusData?.data_list?.find(item => item.critic === name)?.cnt || 0;
    }
  };

  const chartss = criticsDataForArray.map((critic, index) => ({
    id: critic?.name,
    value: findCriticsCount(critic.name),
    color: `hsl(10${index * 60}, 100.00%, 26.10%)`,
  }));

  return (
    <StatusTemplate
      t={t}
      categories={categories}
      select={select}
      setSelect={setSelect}
      pieChartData={chartss}
      detailData={detailsArray}
    />
  );
};

//===============
// 음악 생성 그래프
//===============
const LyricsAndSonwritingGraph = ({ t, username }) => {
  const { data: dailyUsageData } = useQuery(
    ['graph_data_for_daily_usage', username],
    async () => {
      const res = await axios.get(
        `${serverApi}/api/user/daily/ai/usage/statistics?name=${username}`
      );
      const formatXY = res.data?.map(item => ({ x: item.record_date, y: item.cnt }));
      return formatXY;
    },
    { enabled: !!username }
  );

  const { data: ratingCountData } = useQuery(
    ['graph_data_for_rating_count', username],
    async () => {
      const res = await axios.get(`${serverApi}/api/user/song/rating/count?user_name=${username}`);
      const data = Object.entries(res.data)?.map(([key, value]) => {
        return { date: key, value: value };
      });

      return data;
    },
    { enabled: !!username }
  );

  return (
    <GraphTemplate
      t={t}
      lineDataTitle="AI Work Trends By Period (7-Dates Fixed)"
      lineData={dailyUsageData}
      barDataTitle="Song Grade Distribution"
      barData={ratingCountData}
    />
  );
};

//=============
// 평가 그래프
//=============
const EvaluationGraph = ({ t, username }) => {
  const { data: dailyUsageData } = useQuery(
    ['graph_data_for_daily_usage_score', username],
    async () => {
      const res = await axios.get(
        `${serverApi}/api/user/evaluation/usage/statistics?name=${username}`
      );
      const formatXY = res.data?.map(item => ({ x: item.record_date, y: item.cnt }));
      return formatXY;
    },
    { enabled: !!username }
  );

  const { data: scoreData } = useQuery(
    ['graph_data_for_score', username],
    async () => {
      const res = await axios.get(`${serverApi}/api/user/evaluation/average?name=${username}`);
      const data = Object.entries(res.data)?.map(([key, value]) => {
        return { date: key, value: value };
      });

      return data;
    },
    { enabled: !!username }
  );

  return (
    <GraphTemplate
      t={t}
      lineDataTitle="AI Work Trends By Period (7-Dates Fixed)"
      lineData={dailyUsageData}
      barDataTitle="Song Grade Distribution"
      barData={scoreData}
    />
  );
};

const StatusTemplate = ({ t, categories, select, setSelect, pieChartData, detailData }) => {
  return (
    <section className="ai__ai-status">
      <p className="ai-status__title">{t('AI Service Status')}</p>
      <SubCategories categories={categories} translateFn={t} value={select} handler={setSelect} />
      <div className="ai-status__info">
        <div className="ai-status__chart">
          <PieChart height={300} width={300} data={pieChartData} selectedItem={select} />
        </div>
        <div className="ai-status__detail">
          <p className="ai-status__detail-title">{t('AI Service Details')}</p>
          <div className="ai-status__detail-box">
            {detailData.map((item, index) => (
              <div className="ai-status__detail-item" key={index}>
                <p className="detail-item__title">{t(item.title)}</p>
                <p className="detail-item__value">{item?.value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const GraphTemplate = ({ t, lineDataTitle, lineData, barDataTitle, barData }) => {
  return (
    <section className="ai__period">
      <p className="period__title">{t('Graph List')}</p>
      <div className="period__menu"></div>
      <div className="period__chart">
        <div className="period__chart--item">
          <p>{t(lineDataTitle)}</p>
          {lineData && <LineChart data={lineData} />}
        </div>
        <div className="period__chart--item">
          <p>{t(barDataTitle)}</p>
          {barData && <BarChart data={barData} />}
        </div>
      </div>
    </section>
  );
};
