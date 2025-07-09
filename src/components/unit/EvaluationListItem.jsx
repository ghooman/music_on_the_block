import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { criticsDataForObject } from '../../data/criticsData';

import coverImg10 from '../../assets/images/intro/intro-demo-img4.png';

import './EvaluationListItem.scss';
import i18n from '../../i18n/i18n';

export const EvaluationListItemWrapper = ({ children }) => {
  return <div className="unit-component-evaluation-list-item-wrapper">{children}</div>;
};

export const EvaluationListItem = ({ data, selectedMusic, handler, player }) => {
  const { t } = useTranslation('main');
  const { language } = i18n;

  const evaluationByLang = {
    English: {
      feedback: data.feedback,
    },
    한국어: {
      feedback: data.feedback_kr,
    },
    Indonesia: {
      feedback: data.feedback_id,
    },
    日本語: {
      feedback: data?.feedback_ja,
    },
    'Tiếng Việt': {
      feedback: data?.feedback_vi,
    },
  };

  return (
    <button
      key={data.id}
      className={`unit-component-evaluation-list-item ${
        selectedMusic?.id === data.id && !player?.paused ? 'music-play' : ''
      }`}
      onClick={() => {
        console.log('selectedMusic', selectedMusic);
        console.log('data', data);
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
          {/* <span>{evaluationByLang[language]?.feedback || '-'}</span> */}
          <span>{evaluationByLang[language]?.feedback?.trim() || '-'}</span>
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
            data.score >= 90
              ? 'gold'
              : data.score >= 80
              ? 'silver'
              : data.score >= 70
              ? 'bronze'
              : ''
          }`}
        >
          {data?.score?.toFixed(2)}{' '}
        </p>
        <Link
          to={`/song-detail/${data.song_id}?service=AI+Singing+Evaluation&critic=${data.critic}`}
          className="details-btn"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {t('Details')}
        </Link>
      </div>
    </button>
  );
};
