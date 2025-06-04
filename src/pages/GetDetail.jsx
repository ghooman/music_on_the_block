import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import Dashboard from '../components/get/Dashboard';

import '../styles/GetDetail.scss';

const GetDetail = () => {
  const { t } = useTranslation('get');
  const [searchParams] = useSearchParams();
  const categories = [{ name: 'dashboard' }, { name: 'leaderboard' }, { name: 'history' }];

  const tab = searchParams.get('tab') || categories?.[0]?.name;

  return (
    <div className="get-detail">
      <div className="get-detail__banner"></div>
      <div className="get-detail__progress-wallet">
        <GetRaceContentBox>
          <GetRaceContentBox.White12px400>
            {t('Round #3 Information in progress')}
          </GetRaceContentBox.White12px400>
          <GetRaceContentBox.Green14px700>4D 23H 32M</GetRaceContentBox.Green14px700>
        </GetRaceContentBox>

        <GetRaceContentBox>
          <GetRaceContentBox.White12px400>{t('Connected wallet')}</GetRaceContentBox.White12px400>
          <GetRaceContentBox.Green14px700>0x1Fb3....8c4a</GetRaceContentBox.Green14px700>
        </GetRaceContentBox>
      </div>
      <div className="get-detail__tabs">
        <div className="get-detail__tabs-box">
          {categories.map(item => (
            <Link
              className={`get-detail__tabs-box--item ${tab === item.name ? 'select' : ''}`}
              to={`?tab=${item.name}`}
              key={item.name}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="get-detail__status">
        <div className="get-detail__status-button round">{t('Round')} #3</div>
        <div className="get-detail__status-button status">{t('Progress')}</div>
      </div>
      <div className="get-detail__info">
        <GetRaceContentBox>
          <GetRaceContentBox.Green14px400>{t('TOTAL REWARD')}(MOB)</GetRaceContentBox.Green14px400>
          <GetRaceContentBox.Gray14px500>{t('Basic Reward')} 30,000</GetRaceContentBox.Gray14px500>
          <GetRaceContentBox.Gray14px500>+</GetRaceContentBox.Gray14px500>
          <GetRaceContentBox.Yellow14px500>
            {t('Revenue Share')} 20,000
          </GetRaceContentBox.Yellow14px500>
        </GetRaceContentBox>

        <GetRaceContentBox>
          <GetRaceContentBox.Green14px400>{t('TOTAL BUNRED MIC')}</GetRaceContentBox.Green14px400>
          <GetRaceContentBox.Gray18px500>45,250</GetRaceContentBox.Gray18px500>
        </GetRaceContentBox>

        <GetRaceContentBox>
          <GetRaceContentBox.Green14px400>{t('START TIME')}</GetRaceContentBox.Green14px400>
          <GetRaceContentBox.Gray18px500>
            Sat, 04 Nov 2023 14:40:00 UTC+9
          </GetRaceContentBox.Gray18px500>
        </GetRaceContentBox>

        <GetRaceContentBox>
          <GetRaceContentBox.Green14px400>{t('REMAINING TIME')}</GetRaceContentBox.Green14px400>
          <GetRaceContentBox.Yellow18px500>4D 23H 32M</GetRaceContentBox.Yellow18px500>
        </GetRaceContentBox>
      </div>

      <div className="get-detail__content">
        {/** 주 콘텐츠. */}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'leaderboard' && <div>리더보드</div>}
        {tab === 'history' && <div>히스토리</div>}
      </div>
    </div>
  );
};

export default GetDetail;

const GetRaceContentBox = React.memo(({ children }) => {
  return <div className="get-race-content-box">{children}</div>;
});

GetRaceContentBox.White12px400 = ({ children }) => {
  return <p className={'get-race-content-box__text white fs12 fw400'}>{children || '-'}</p>;
};

GetRaceContentBox.Green14px700 = ({ children }) => {
  return <p className="get-race-content-box__text green fs14 fw700">{children || '-'}</p>;
};

GetRaceContentBox.Green14px400 = ({ children }) => {
  return <p className="get-race-content-box__text green fs14 fw400">{children || '-'}</p>;
};

GetRaceContentBox.Gray14px500 = ({ children }) => {
  return <p className="get-race-content-box__text gray fs14 fw500">{children || '-'}</p>;
};
GetRaceContentBox.Gray18px500 = ({ children }) => {
  return <p className="get-race-content-box__text gray fs18 fw500">{children || '-'}</p>;
};

GetRaceContentBox.Yellow14px500 = ({ children }) => {
  return <p className="get-race-content-box__text yellow fs14 fw500">{children || '-'}</p>;
};

GetRaceContentBox.Yellow18px500 = ({ children }) => {
  return <p className="get-race-content-box__text yellow fs18 fw500">{children || '-'}</p>;
};
