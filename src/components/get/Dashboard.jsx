import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="get-detail-dashboard">
      <Participation />
      <BurnInfo />
    </div>
  );
};

export default Dashboard;

const Participation = () => {
  return (
    <div className="get-detail-dashboard__participation">
      {/** */}
      <div className="get-detail-dashboard__content--title">
        <h4 className="title-text">MIC Burn Participation</h4>
        <p className="sub-info">
          MIC Held : <span className="sub-info__points">12,500</span>
        </p>
      </div>
      {/** */}
      <p className="get-detail-dashboard__input--title">Amount of MIC to Burn</p>
      <label className="get-detail-dashboard__input" htmlFor="values">
        <input
          type="number"
          onWheel={e => e.target.blur()}
          name="values"
          placeholder="Enter MIC to Burn"
        ></input>
        <button>Max</button>
      </label>
      <div className="get-detail-dashboard__notice">
        <h5 className="notice-title">MIC approval required</h5>
        <p className="notice-content">
          The expected rewards are based on current contributions and may vary depending on the
          burns of other participants.
        </p>
      </div>
      <button className="get-detail-dashboard__burn-button">Burn MIC</button>
    </div>
  );
};

const BurnInfo = () => {
  return (
    <div className="get-detail-dashboard__burn-info">
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">MIC to be burned</h4>
          <p className="sub-info">
            Updates every <span className="sub-info__points">30</span> minutes
          </p>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
          <p className="content-box-info">
            Time <span className="content-box-info__point">2.76%</span> Of Total Burn Amount
          </p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">Estimated MIC Reward</h4>
          <p className="sub-info">
            Updates every <span className="sub-info__points">30</span> minutes
          </p>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
          <p className="content-box-info">
            Current Rank: <span className="content-box-info__point">28th</span>
          </p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">MIC to be burned</h4>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">MIC to be burned</h4>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
        </div>
      </div>
      {/** */}
    </div>
  );
};
