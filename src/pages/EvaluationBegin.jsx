import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationBegin.scss';
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/unit/Filter';
import Loading from '../components/IntroLogo2';

//이미지
import earnMicIcon from '../assets/images/evaluation/earnMicIcon.svg';
import algorithmIcon from '../assets/images/evaluation/algorithmIcon.svg';
import songValueIcon from '../assets/images/evaluation/songValueIcon.svg';
import newMusicIcon from '../assets/images/evaluation/newMusicIcon.svg';
import biggerRewardsIcon from '../assets/images/evaluation/biggerRewardsIcon.svg';

import judgeImg01 from '../assets/images/evaluation/judge-img01.png';
import judgeImg02 from '../assets/images/evaluation/judge-img02.png';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';

import step1Img from '../assets/images/evaluation/step1-img.png';
import step2Img from '../assets/images/evaluation/step2-img.png';
import step3Img from '../assets/images/evaluation/step3-img.png';
import step4Img from '../assets/images/evaluation/step4-img.png';

import SongsBar from '../components/unit/SongsBar';

const EvaluationBegin = () => {
  const { t } = useTranslation('evaluation');

  return (
    <>
      <ContentWrap title={t('AI Song Evaluation')} border={false} className="none-padding">
        <ContentWrap title={t('Step 1')}>
          <Step1 t={t} />
        </ContentWrap>
        <ContentWrap title={t('Step 2')} border={false}>
          <Step2 t={t} />
        </ContentWrap>
        <ContentWrap title={t('Step 3')}>
          <Step3 t={t} />
        </ContentWrap>
        <ViewResults t={t} />
      </ContentWrap>
    </>
  );
};

export default EvaluationBegin;

const Step1 = ({ t }) => {
  const dummySongIds = [101, 102, 103];
  return (
    <>
      <div className="step1">
        <p className="step1__title">
          {t('Select your song.')}
          <br />
          {t('Click the song, then tap “Select” below to continue.')}
        </p>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <div className="step1__list">
          {dummySongIds.map(id => (
            <SongsBar key={id} songId={id} />
          ))}
        </div>
        <button className="select-btn">{t('Select')}</button>
      </div>
    </>
  );
};

const Step2 = ({ t }) => {
  const [activeIdx, setActiveIdx] = useState(null);

  const handleClick = idx => {
    setActiveIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <>
      <div className="step2">
        <p className="step2__title">{t('Choose your music critic.')}</p>
        <div className="step2__choose">
          <button
            className={`step2__choose__item ${activeIdx === 0 ? 'active' : ''}`}
            onClick={() => handleClick(0)}
          >
            <img src={judgeImg01} alt="Jinwoo Yoo" />
            <dl className="step2__choose__item__title">
              <dt
                dangerouslySetInnerHTML={{ __html: t('"<span>Soul</span> first, sound second."') }}
              ></dt>
              <dd>Jinwoo Yoo</dd>
            </dl>
          </button>

          <button
            className={`step2__choose__item ${activeIdx === 1 ? 'active' : ''}`}
            onClick={() => handleClick(1)}
          >
            <img src={judgeImg02} alt="Drexx" />
            <dl className="step2__choose__item__title">
              <dt
                dangerouslySetInnerHTML={{
                  __html: t('"No <span>flow?</span> No mercy. Off-beat? Game over."'),
                }}
              ></dt>
              <dd>Drexx</dd>
            </dl>
          </button>

          <button
            className={`step2__choose__item ${activeIdx === 2 ? 'active' : ''}`}
            onClick={() => handleClick(2)}
          >
            <img src={judgeImg03} alt="Elara Moon" />
            <dl className="step2__choose__item__title">
              <dt
                dangerouslySetInnerHTML={{
                  __html: t('"Between the <span>Melody</span>, she finds the truth."'),
                }}
              ></dt>
              <dd>Elara Moon</dd>
            </dl>
          </button>
        </div>
      </div>
    </>
  );
};

const Step3 = ({ t }) => {
  const dummySongIds = [100];
  return (
    <>
      <div className="step3">
        <p className="step3__title">
          {t('Please review your selected options.')}
          <br />
          {t(
            'If you would like to proceed with these choices, click “View Results” at the bottom of the screen.'
          )}
        </p>
        <div className="step3__selected-song">
          <p className="step3__selected-song__title">{t('Selected Song')}</p>
          {dummySongIds.map(id => (
            <SongsBar key={id} songId={id} />
          ))}
          <dl className="step3__selected-song__critic">
            <dt>{t('Critic')}</dt>
            <dd>
              <p>Jinwoo Yoo</p>
              <span>
                {t('Todays Left')}: <strong>1/1</strong>
              </span>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

const ViewResults = ({ t }) => {
  return (
    <>
      <Link to="/evaluation-results" className="view-results">
        {t('View Results')}
      </Link>
    </>
  );
};
