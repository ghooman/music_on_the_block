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
  return (
    <div className="get-detail-leaderboard__user">
      <div className="get-detail-leaderboard__user--profile">
        <h4 className="get-detail-leaderboard__user--profile-title">My Ranking Information</h4>
        <div className="get-detail-leaderboard__user--profile-data"></div>
      </div>
      <div className="get-detail-leaderboard__user--information">
        <div className="get-detail-leaderboard__user--information--item">
          <p className="information--item-title">Wallet Address</p>
          <p className="information--item-value">1</p>
        </div>
        <div className="get-detail-leaderboard__user--information--item">
          <p className="information--item-title">Contribution</p>
          <p className="information--item-value">1</p>
        </div>
        <div className="get-detail-leaderboard__user--information--item">
          <p className="information--item-title">Estimated Reward(MOB)</p>
          <p className="information--item-value">1</p>
        </div>
        <div className="get-detail-leaderboard__user--information--item">
          <p className="information--item-title">Burned MIC</p>
          <p className="information--item-value">1</p>
        </div>
      </div>
    </div>
  );
};

const Tables = () => {
  return (
    <div className="get-detail-leaderboard__tables">
      <div></div>

      <button>See More</button>
    </div>
  );
};
