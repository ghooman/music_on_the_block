import React, { useState } from 'react';
import './AiServices.scss';

import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

import FilterDateModal from '../../components/unit/FilterDateModal';
import Filter from '../unit/Filter';
import PreparingModal from '../PreparingModal';
import SubCategories from '../unit/SubCategories';
import { LineChart, PieChart } from '../unit/Chart';

const AiServiceTypeList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon },
    { name: 'AI Singing Evaluation', image: SongwritingIcon, preparing: true },
    { name: 'AI Cover Creation', image: LyricsIcon, preparing: true },
];
const AiStatusList = [
    { name: 'All' },
    { name: 'Songwriting', image: LyricsAndSongwritingIcon },
    { name: 'Lyrics + Songwriting', image: SongwritingIcon, preparing: true },
];

const AiServices = () => {
    const [openModal, setOpenModal] = useState(false);
    const [showPreparingModal, setShowPreparingModal] = useState(false);

    const [selectedServiceChartItem, setSelectedSErviceChartItem] = useState(AiServiceTypeList[0].name);
    const [selectedStatusChartItem, setSelectedStatusItem] = useState(AiStatusList[0]?.name);

    const [aiServiceData, setAiServiceData] = useState([
        {
            id: 'AI Lyrics & Songwriting',
            value: 100,
            color: 'hsl(252, 100%, 50%)',
            image: LyricsAndSongwritingIcon,
        },
        {
            id: 'AI Singing Evaluation',
            value: 0,
            color: 'hsl(162, 100%, 50%)',
            preparing: true,
            image: SongwritingIcon,
        },
        {
            id: 'AI Cover Creation',
            value: 0,
            color: 'hsl(342, 100%, 50%)',
            preparing: true,
            image: LyricsIcon,
        },
    ]);

    const [aiStatusData, setAiStatusData] = useState([
        {
            id: 'Songwriting',
            value: 68,
            color: 'hsl(101, 100.00%, 26.10%)',
        },
        {
            id: 'Lyrics + Songwriting',
            value: 0,
            color: 'hsl(139, 100.00%, 11.00%)',
            preparing: true,
        },
    ]);

    return (
        <>
            {/** 차트 조작 버튼입니다. */}
            <div className="ai__services">
                {AiServiceTypeList.map((item) => (
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
                    data={aiServiceData}
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
                        <PieChart height={300} width={300} data={aiStatusData} selectedItem={selectedStatusChartItem} />
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
                <p className="period__title">AI Work Trends by Period (14-Day Fixed)</p>
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
