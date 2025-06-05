import { useRef } from 'react';
import './Dashboard.scss';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('get');

  const inputRef = useRef(null);

  return (
    <div className="get-detail-dashboard__participation">
      {/** */}
      <div className="get-detail-dashboard__content--title">
        <h4 className="title-text">{t('MIC Burn Participation')}</h4>
        <p className="sub-info">
          {t('MIC Held')} : <span className="sub-info__points">12,500</span>
        </p>
      </div>
      {/** */}
      <p className="get-detail-dashboard__input--title">{t('Amount of MIC to Burn')}</p>
      <label className="get-detail-dashboard__input" htmlFor="values">
        <input
          ref={inputRef}
          type="number"
          onWheel={e => e.target.blur()}
          name="values"
          placeholder={t('Enter MIC to Burn')}
        ></input>
        <button
          onClick={() => {
            inputRef.current.focus();
          }}
        >
          {t('Max')}
        </button>
      </label>
      <div className="get-detail-dashboard__notice">
        <h5 className="notice-title">{t('MIC approval required')}</h5>
        <p className="notice-content">
          {t(
            'The expected rewards are based on current contributions and may vary depending on the burns of other participants.'
          )}
        </p>
      </div>
      <button className="get-detail-dashboard__burn-button">{t('Burn MIC')}</button>
    </div>
  );
};

const BurnInfo = () => {
  const { t } = useTranslation('get');

  return (
    <div className="get-detail-dashboard__burn-info">
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">{t('MIC to be burned')}</h4>
          <p className="sub-info">
            {t('Updates every')} <span className="sub-info__points">30</span> {t('minutes')}
          </p>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
          <p className="content-box-info">
            {t('Time')} <span className="content-box-info__point">2.76%</span>{' '}
            {t('Of Total Burn Amount')}
          </p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">{t('Estimated MIC Reward')}</h4>
          <p className="sub-info">
            {t('Updates every')} <span className="sub-info__points">30</span> {t('minutes')}
          </p>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
          <p className="content-box-info">
            {t('Current Rank')}: <span className="content-box-info__point">28th</span>
          </p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">{t('MIC to be burned')}</h4>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
        </div>
      </div>
      {/** */}
      {/** */}
      <div className="get-detail-dashboard__burn-info--content-wrap">
        <div className="get-detail-dashboard__content--title">
          <h4 className="title-text">{t('MIC to be burned')}</h4>
        </div>
        <div className="get-detail-dashboard__burn-info--content-box">
          <p className="content-box-value">1,250</p>
        </div>
      </div>
      {/** */}
    </div>
  );
};
