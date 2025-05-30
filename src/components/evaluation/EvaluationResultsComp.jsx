import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ContentWrap from '../../components/unit/ContentWrap';
import NoneContent from '../../components/unit/NoneContent';
import { RadarChart } from '../../components/unit/Chart';
import EvaluationGuideModal from '../../components/EvaluationGuideModal';

import './EvaluationResultsComp.scss';

//이미지
import issueIcon from '../../assets/images/icon/issue-opened.svg';

// 데이터 및 함수
import { criticsDataForObject } from '../../data/criticsData';
import { getCriticEvaluationList } from '../../api/evaluation/getList';
import { useNavigate } from 'react-router-dom';

const EvaluationResultsComp = ({ evaluationData, critic, buttons }) => {
  const { t } = useTranslation('evaluation');

  console.log(evaluationData, '평가 데이터 입니다.');

  return (
    <>
      <ContentWrap title={t('AI Song Evaluation')} border={false} className="none-padding">
        <ContentWrap title={t('Result')} border={false}>
          {evaluationData && <Result t={t} evaluationData={evaluationData} />}
          {!evaluationData && <NoneContent height={300} message="No evaluation history yet." />}
          {buttons && <Btns t={t} evaluationData={evaluationData} />}
        </ContentWrap>
        <ContentWrap title={t('Full Evaluation')}>
          {evaluationData && <FullEvaluation t={t} evaluationData={evaluationData} />}
          {!evaluationData && <NoneContent height={185} message="No evaluation history yet." />}
        </ContentWrap>
        <ContentWrap title={t('Other Songs Evaluationed By This Critic')}>
          <SongsCritic t={t} critic={critic} id={evaluationData?.id} />
        </ContentWrap>
        {buttons && <Btns t={t} evaluationData={evaluationData} />}
      </ContentWrap>
    </>
  );
};

export default EvaluationResultsComp;

const Result = ({ t, evaluationData }) => {
  const [evaluationGuideModal, setEvaluationGuideModal] = useState(false);

  return (
    <>
      <section className="result">
        <article className="result__critic">
          <p className="result__critic__title">{t('Critic')}</p>
          <img src={criticsDataForObject[evaluationData?.critic]?.image} alt="critic" />
          <dl className="result__critic__txt">
            <dt>{t(criticsDataForObject[evaluationData?.critic]?.introduction)}</dt>
            <dd>{evaluationData?.critic}</dd>
          </dl>
        </article>
        <article className="result__graph">
          <button className="result__graph__title">
            {t('Evaluation Graph')}
            <img src={issueIcon} alt="icon" onClick={() => setEvaluationGuideModal(true)} />
          </button>
          <div className="result__graph__score">
            <div className="result__graph__score__graph">
              <RadarChart
                data={[
                  { item: evaluationData?.emotion, value: evaluationData?.emotion },
                  { item: evaluationData?.creativity, value: evaluationData?.creativity },
                  { item: evaluationData?.structure, value: evaluationData?.structure },
                  { item: evaluationData?.sound, value: evaluationData?.sound },
                  { item: evaluationData?.popularity, value: evaluationData?.popularity },
                ]}
              />
            </div>
            <div className="result__graph__score__number">
              <p className="result__graph__score__number__title">
                {t('Score')}:
                <span>{evaluationData?.score ? evaluationData?.score?.toFixed(2) : '-'}/100</span>
              </p>
              <div className="result__graph__score__number__txt">
                <dl>
                  <dt>{t('Emotion')} :</dt>
                  <dd>{evaluationData?.emotion}</dd>
                </dl>
                <dl>
                  <dt>{t('Creativity')} :</dt>
                  <dd>{evaluationData?.creativity}</dd>
                </dl>
                <dl>
                  <dt>{t('Structure')} :</dt>
                  <dd>{evaluationData?.structure}</dd>
                </dl>
                <dl>
                  <dt>{t('Sound')} :</dt>
                  <dd>{evaluationData?.sound}</dd>
                </dl>
                <dl>
                  <dt>{t('Popularity')} :</dt>
                  <dd>{evaluationData?.popularity}</dd>
                </dl>
              </div>
            </div>
          </div>
        </article>
      </section>
      {evaluationGuideModal && (
        <EvaluationGuideModal setEvaluationGuideModal={setEvaluationGuideModal} />
      )}
    </>
  );
};

const Btns = ({ t, evaluationData }) => {
  const navigate = useNavigate();

  return (
    <div className="btns">
      <button
        className="rate-again"
        onClick={() => {
          navigate(
            `/song-detail/${
              evaluationData?.song_id || evaluationData?.id
            }?service=AI+Singing+Evaluation&critic=${evaluationData?.critic}`,
            { replace: true }
          );
        }}
      >
        {t('Complete')}
      </button>
      <button
        className="save-evaluation"
        onClick={() => {
          navigate(`/evaluation-begin`, { replace: true });
        }}
      >
        {t('Try Another')}
      </button>
    </div>
  );
};

const FullEvaluation = ({ t, evaluationData }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="full-evaluation">
      <section className="full-evaluation__feed-back">
        <article className="full-evaluation__feed-back__human">
          <img src={criticsDataForObject[evaluationData?.critic]?.image} alt="judgeImg01" />
          <p className="full-evaluation__feed-back__human__title">{evaluationData?.critic}</p>
        </article>
        <article className={`full-evaluation__feed-back__txt ${isActive ? 'active' : ''}`}>
          <p className="ull-evaluation__feed-back__txt__title">{t('Feedback')}</p>
          <div className="ull-evaluation__feed-back__txt__memo">
            {evaluationData?.feedback || '-'}
          </div>
          <button
            className="full-evaluation__feed-back__txt__see-more"
            onClick={() => setIsActive(prev => !prev)}
          >
            {t('See More')}
            <span></span>
          </button>
        </article>
      </section>
      <section className="full-evaluation__point-box">
        <dl>
          <dt>{t('To Improve')}</dt>
          <dd>{evaluationData?.to_improve || '-'}</dd>
        </dl>
        <dl>
          <dt>{t('Why This Score')}</dt>
          <dd>{evaluationData?.why_this_score || '-'}</dd>
        </dl>
        <dl>
          <dt>{t('Key Points')}</dt>
          <dd>{t(evaluationData?.key_points || '-')}</dd>
        </dl>
      </section>
    </div>
  );
};

const SongsCritic = ({ t, critic, id }) => {
  const [criticEvaluationList, setCriticEvaluationList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getCriticEvaluationList({ critic });
        setCriticEvaluationList(res.data);
      } catch (e) {
        setCriticEvaluationList([]);
        // console.error(e);
      }
    };
    getData();
  }, [critic]);

  return (
    <>
      <section className="critic-list">
        {criticEvaluationList.map(item => (
          <div className="critic-list__item" key={item.id}>
            <div className="critic-list__item__left">
              <p className="critic-list__item__left__img">
                <img src={item.cover_image} alt="images" />
              </p>
              <p className="critic-list__item__left__title">
                {item.title} / {item.artist}
              </p>
            </div>
            <div className="critic-list__item__right">
              <RadarChart
                data={[
                  {
                    item: item?.emotion,
                    value: item?.emotion,
                  },
                  {
                    item: item?.creativity,
                    value: item?.creativity,
                  },
                  {
                    item: item?.structure,
                    value: item?.structure,
                  },
                  {
                    item: item?.sound,
                    value: item?.sound,
                  },
                  {
                    item: item?.popularity,
                    value: item?.popularity,
                  },
                ]}
              />
            </div>
          </div>
        ))}
        {criticEvaluationList?.length <= 0 && (
          <NoneContent height={185} message="No evaluation history yet." />
        )}
      </section>
    </>
  );
};
