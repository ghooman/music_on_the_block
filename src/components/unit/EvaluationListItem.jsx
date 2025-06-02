import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { criticsDataForObject } from '../../data/criticsData';

import coverImg10 from '../../assets/images/intro/intro-demo-img4.png';

import './EvaluationListItem.scss';

export const EvaluationListItemWrapper = ({ children }) => {
  return <div className="unit-component-evaluation-list-item-wrapper">{children}</div>;
};

export const EvaluationListItem = ({ data, selectedMusic, handler, player }) => {
  const { t } = useTranslation('main');
  return (
    <button
      key={data.id}
      className={`unit-component-evaluation-list-item ${
        selectedMusic?.id === data.id && !player?.paused ? 'music-play' : ''
      }`}
      onClick={() => {
        if (handler) handler();
      }}
    >
      <div className="unit-component-evaluation-list-item__thought">
        <p className="unit-component-evaluation-list-item__thought__play">
          <img src={data.cover_image || coverImg10} alt="coverImg" />
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        </p>
        <p className="unit-component-evaluation-list-item__thought__txt">
          <img src={criticsDataForObject[data.critic]?.image} alt="Jinwoo-Yoo-img" />
          <span>"{data.feedback}"</span>
        </p>
      </div>
      <dl className="unit-component-evaluation-list-item__title">
        <dt>{data.title}</dt>
        <dd>
          {/* <img src={data?.artist_profile || defaultCoverImg} alt="user-name" /> */}
          {data.artist}
        </dd>
      </dl>
      <div className="unit-component-evaluation-list-item__details-number">
        <p
          className={`grade ${
            data.score >= 90 ? 'gold' : data.score >= 80 ? '' : data.score >= 70 ? 'bronze' : ''
          }`}
        >
          {data?.score}{' '}
        </p>
        <Link
          to={`/song-detail/${data.song_id}?service=AI+Singing+Evaluation&critic=${data.critic}`}
          className="details-btn"
        >
          {t('Details')}
        </Link>
      </div>
    </button>
  );
};
