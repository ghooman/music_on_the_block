import React, { useState } from 'react';
import './AiServices.scss';
import demoChart from '../../assets/images/mypage/demo-chart.png';
import demoChart2 from '../../assets/images/mypage/demo-chart2.png';
import demoChart3 from '../../assets/images/mypage/demo-chart3.png';
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

import FilterDateModal from '../../components/unit/FilterDateModal';
import Filter from '../unit/Filter';
import PreparingModal from '../PreparingModal';
import SubCategories from '../unit/SubCategories';
import { LineChart, PieChart } from '../unit/Chart';

const AiServiceList = ['AI Lyrics & Songwriting', 'AI Singing Evaluation', 'AI Cover Creation'];
const AiServiceTypeList = ['All', 'Lyrics', 'Songwriting', 'Lyrics + Songwriting'];

const chartData = [
    {
        id: 'AI Lyrics & Songwriting',
        image: LyricsAndSongwritingIcon,
        value: 46,
        color: 'hsl(252, 100%, 50%)',
    },
    {
        id: 'AI Singing Evaluation',
        image: SongwritingIcon,
        value: 68,
        color: 'hsl(162, 100%, 50%)',
    },
    {
        id: 'AI Cover Creation',
        image: LyricsIcon,
        value: 17,
        color: 'hsl(342, 100%, 50%)',
    },
];

const statusData = [
    {
        id: 'Lyrics',
        image: LyricsAndSongwritingIcon,
        value: 46,
        color: 'hsl(72, 100%, 50%)',
    },
    {
        id: 'Songwriting',
        image: SongwritingIcon,
        value: 68,
        color: 'hsl(73, 100%, 26%)',
    },
    {
        id: 'Lyrics + Songwriting',
        image: LyricsIcon,
        value: 17,
        color: 'hsl(74, 100%, 11%)',
    },
];

const AiServices = () => {
    const [aiServiceStatus, setAiServiceStatus] = useState('All');
    const [openModal, setOpenModal] = useState(false);
    const [showPreparingModal, setShowPreparingModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState(chartData[0]);
    const [statusChartItem, setStatusChartItem] = useState(statusData[0]);

    const handleAiServiceClick = (aiService) => {
        // if (aiService === 'AI Singing Evaluation' || aiService === 'AI Cover Creation') {
        //     setShowPreparingModal(true);
        //     return;
        // }
        // setSelectedAiService(aiService);
    };

    return (
        <>
            {/** 차트 조작 버튼입니다. */}
            <div className="ai__services">
                {chartData.map((aiService) => (
                    <button
                        key={aiService}
                        className={`ai__service-btn ${selectedItem.id === aiService.id ? 'active' : ''}`}
                        onClick={() => setSelectedItem(aiService)}
                    >
                        <div className="ai__service-btn--image">
                            <img src={aiService.image} alt="icon" />
                        </div>
                        {aiService.id}
                    </button>
                ))}
            </div>

            {/** 콘텐츠 */}
            <div className="ai__chart">
                <PieChart
                    height={300}
                    width={300}
                    data={chartData}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    legends
                />
            </div>

            {/** 차트 조작 */}
            <section className="ai__ai-status">
                <p className="ai-status__title">AI Service Status</p>
                <SubCategories categories={AiServiceTypeList} handler={setAiServiceStatus} value={aiServiceStatus} />
                {/** 콘텐츠 */}
                <div className="ai-status__info">
                    <div className="ai-status__chart">
                        {/* <img src={demoChart2} alt="chart" /> */}
                        <PieChart
                            height={300}
                            width={300}
                            data={statusData}
                            selectedItem={statusData.find((item) => item.id === aiServiceStatus)}
                            setSelectedItem={setStatusChartItem}
                        />
                    </div>
                    <div className="ai-status__detail">
                        <p className="ai-status__detail-title">AI Service Detail</p>
                        <div className="ai-status__detail-box">
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Top Type</p>
                                <p className="detail-item__value">Love</p>
                            </div>
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Total Creation</p>
                                <p className="detail-item__value">239</p>
                            </div>
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Total Earn</p>
                                <p className="detail-item__value">1,000 MIC</p>
                            </div>
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Total Likes</p>
                                <p className="detail-item__value">100</p>
                            </div>
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Total Plays</p>
                                <p className="detail-item__value">24</p>
                            </div>
                            <div className="ai-status__detail-item">
                                <p className="detail-item__title">Last Used Date</p>
                                <p className="detail-item__value">Sat, 04 Nov 2023 14:40:00 UTC+0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ai__period">
                <p className="period__title">AI Work Trends by Period</p>
                <div className="period__menu"></div>
                <div className="period__chart">
                    <LineChart />
                </div>
            </section>
            {openModal && <FilterDateModal setOpenModal={setOpenModal} />}
            {showPreparingModal && <PreparingModal setPreparingModal={setShowPreparingModal} />}
        </>
    );
};

export default AiServices;
