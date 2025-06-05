import { useUserDetail } from '../../hooks/useUserDetail';

import GetHistoryTable from '../table/GetHistoryTable';

import arrowIcon from '../../assets/images/arrow_down.svg';

import './Leaderboard.scss';

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

  const infoArray = [
    {
      title: 'Wallet Address',
      value: data?.wallet_address.slice(0, 5) + '...' + data?.wallet_address.slice(-2),
    },
    {
      title: 'Contribution',
      value: '25.48%',
    },
    {
      title: 'Estimated Reward(MOB)',
      value: 35384?.toLocaleString(),
    },
    {
      title: 'Burned MIC',
      value: 12.234?.toLocaleString(),
    },
  ];

  return (
    <div className="get-detail-leaderboard__user">
      <div className="get-detail-leaderboard__user--profile">
        <h4 className="get-detail-leaderboard__user--profile-title">My Ranking Information</h4>
        <div className="get-detail-leaderboard__user--profile-data">
          <div className="profile-data-image">
            <img className="profile-data-image__profile" src={data?.profile} alt="profile" />
            {/* <img className="profile-data-image__grade" src="" alt="grade" /> */}
          </div>
          <div className="profile-data-info">
            <p className="profile-data-info__text address">0xF2d...45</p>
            <p className="profile-data-info__text name">name</p>
          </div>
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
  return (
    <div className="get-detail-leaderboard__tables">
      <div className="get-detail-leaderboard__tables--title">
        <p className="title">Previous Top Ranking</p>
        <p className="notice">
          Updated every <span className="notice-point">30 minutes</span>
        </p>
      </div>
      <GetHistoryTable />
      <button className="get-detail-leaderboard__tables--see-more">
        <img src={arrowIcon} alt="arrow" />
        See More
      </button>
    </div>
  );
};
