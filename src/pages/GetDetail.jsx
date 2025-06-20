import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import PreparingModal from '../components/PreparingModal';
import Dashboard from '../components/get/Dashboard';
import Leaderboard from '../components/get/Leaderboard';

import '../styles/GetDetail.scss';
import Timer from '../components/get/Timer';
import { useUserDetail } from '../hooks/useUserDetail';
import { sliceWalletAddress } from '../utils/sliceWalletAddress';

const GetDetail = () => {
  const { data: userData } = useUserDetail();
  const { t } = useTranslation('get');
  const [searchParams] = useSearchParams();
  const [preparingModal, setPreparingModal] = useState(false);

  const categories = [
    { name: 'dashboard' },
    { name: 'leaderboard' },
    { name: 'history', preparing: true, cnt: 100 },
  ];

  const tab = searchParams.get('tab') || categories?.[0]?.name;

  return (
    <>
      <div className="get-detail">
        <div className="get-detail__banner">
          <div className="get-detail__banner--text-box">
            <p className="title">{t('Get Race')}</p>
            <p className="desc">
              {t(
                'Join the competition by burning your reward tokens – and discover new value in the process.'
              )}
            </p>
          </div>
        </div>
        <div className="get-detail__progress-wallet">
          {/** */}
          <div className="get-race-content-box">
            <p className={'get-race-content-box__text white fs12 fw400'}>
              {t('Round')} #3 {t('in progress')}
            </p>
            <p className="get-race-content-box__text green fs14 fw700">
              <Timer fontSize={14} color={'#00d293'} fontFamily={'Pretendard700'} textWidth={9} />
            </p>
          </div>
          {/** */}
          {/** */}
          <div className="get-race-content-box">
            <p className={'get-race-content-box__text white fs12 fw400'}>{t('Connected wallet')}</p>
            <p className="get-race-content-box__text green fs14 fw700">
              {sliceWalletAddress(userData?.wallet_address) || '-'}
            </p>
          </div>
          {/** */}
        </div>
        <div className="get-detail__tabs">
          <div className="get-detail__tabs-box">
            {categories.map(item => (
              <Link
                className={`get-detail__tabs-box--item ${tab === item.name ? 'select' : ''}`}
                onClick={e => {
                  if (item.preparing) {
                    e.preventDefault();
                    setPreparingModal(true);
                  }
                }}
                to={`?tab=${item.name}`}
                key={item.name}
              >
                {t(item.name)}
                {item.cnt && <div className="item-alarm">{item.cnt < 100 ? item.cnt : '99+'}</div>}
              </Link>
            ))}
          </div>
        </div>
        <div className="get-detail__status">
          <div className="get-detail__status-button round">{t('Round')} #3</div>
          <div className="get-detail__status-button progress">{t('Progress')}</div>
        </div>
        <div className="get-detail__info">
          {/** */}
          <div className="get-race-content-box">
            <p className="get-race-content-box__text green fs14 fw400">{t('TOTAL REWARD')}(MOB)</p>
            <p className="get-race-content-box__text gray fs14 fw500">{t('Basic Reward')} 30,000</p>
            <p className="get-race-content-box__text gray fs14 fw500 m-8">+</p>
            <p className="get-race-content-box__text yellow fs14 fw500">
              {t('Revenue Share')} 20,000
            </p>
          </div>
          {/** */}
          {/** */}
          <div className="get-race-content-box">
            <p className="get-race-content-box__text green fs14 fw400">{t('TOTAL BURNED MIC')}</p>
            <p className="get-race-content-box__text gray fs18 fw500">45,250</p>
          </div>
          {/** */}
          {/** */}
          <div className="get-race-content-box">
            <p className="get-race-content-box__text green fs14 fw400">{t('START TIME')}</p>
            <p className="get-race-content-box__text gray fs18 fw500">
              Sat, 04 Nov 2023 14:40:00 UTC+9
            </p>
          </div>
          {/** */}
          {/** */}
          <div className="get-race-content-box">
            <p className="get-race-content-box__text green fs14 fw400">{t('REMAINING TIME')}</p>
            <p className="get-race-content-box__text yellow fs18 fw500">
              {/* 4D 23H 32M */}
              <Timer fontSize={18} color={'#ffd700'} fontFamily={'Pretendard700'} textWidth={11} />
            </p>
          </div>
          {/** */}
        </div>

        <div className="get-detail__content">
          {/** 주 콘텐츠. */}
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'leaderboard' && <Leaderboard />}
          {tab === 'history' && <div>히스토리</div>}
        </div>
      </div>
      {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
    </>
  );
};

export default GetDetail;
