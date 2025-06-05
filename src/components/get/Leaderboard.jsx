import { useUserDetail } from '../../hooks/useUserDetail';

import GetHistoryTable from '../table/GetHistoryTable';

import arrowIcon from '../../assets/images/arrow_down.svg';

import './Leaderboard.scss';
import { sliceWalletAddress } from '../../utils/sliceWalletAddress';
import { useTranslation } from 'react-i18next';
import { useTransition } from 'react';

const Leaderboard = () => {
  return (
    <div className="get-detail-leaderboard">
      <UserInfo />
      <Tables />
    </div>
  );
};

export default Leaderboard;

const UserInfo = () => {
  const { data } = useUserDetail();
  const { t } = useTranslation('get');

  const infoArray = [
    {
      title: t('Wallet Address'),
      value: sliceWalletAddress(data?.wallet_address) || 0,
    },
    {
      title: t('Contribution'),
      value: '25.48%' || 0,
    },
    {
      title: t('Estimated Reward(MOB)'),
      value: 35384?.toLocaleString() || 0,
    },
    {
      title: t('Burned MIC'),
      value: 12.234?.toLocaleString() || 0,
    },
  ];

  return (
    <div className="get-detail-leaderboard__user">
      <div className="get-detail-leaderboard__user--profile">
        <h4 className="get-detail-leaderboard__user--profile-title">
          {t('My Ranking Information')}
        </h4>

        <div className="get-detail-leaderboard__user--profile-data">
          {data && (
            <>
              <div className="profile-data-image">
                <img className="profile-data-image__profile" src={data?.profile} alt="profile" />
              </div>
              <div className="profile-data-info">
                <p className="profile-data-info__text address">
                  {sliceWalletAddress(data?.wallet_address)}
                </p>
                <p className="profile-data-info__text name">{data?.name}</p>
              </div>
            </>
          )}
          {!data && (
            <>
              <div className="skeleton circle-type"></div>
              <div className="skeleton bar-type"></div>
            </>
          )}
        </div>
      </div>
      <div className="get-detail-leaderboard__user--information">
        {infoArray.map((info, index) => (
          <div className="get-detail-leaderboard__user--information--item">
            <p className={`information--item-title ${!info.value ? 'disable' : ''}`}>
              {info.title}
            </p>
            <p className={`information--item-value`}>{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Tables = () => {
  const { t } = useTranslation('get');

  return (
    <div className="get-detail-leaderboard__tables">
      <div className="get-detail-leaderboard__tables--title">
        <p className="title">{t('Previous Top Ranking')}</p>
        <p className="notice">
          {t('Updated every')} <span className="notice-point">30 {t('minutes')}</span>
        </p>
      </div>
      <GetHistoryTable />
      <button className="get-detail-leaderboard__tables--see-more">
        <img src={arrowIcon} alt="arrow" />
        {t('See More')}
      </button>
    </div>
  );
};
