import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ContentWrap from '../../components/unit/ContentWrap';
import NoneContent from '../../components/unit/NoneContent';
import { RadarChart } from '../../components/unit/Chart';
import EvaluationGuideModal from '../../components/EvaluationGuideModal';
import AlbumItem from '../unit/AlbumItem';

import './EvaluationResultsComp.scss';

//이미지
import issueIcon from '../../assets/images/icon/issue-opened.svg';

// 데이터 및 함수
import { criticsDataForObject } from '../../data/criticsData';
import { getCriticEvaluationList, getEvaluationList } from '../../api/evaluation/getList';
import { useNavigate } from 'react-router-dom';

// 스와이퍼
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { useQuery } from 'react-query';

/**
 *
 * @param {object} evaluationData : 평가 데이터
 * @param {object} songData : 곡 데이터 - Begin Now 버튼(평가하러가기) 클릭시 경로 이동을 위한 정보
 * @param {string} critic : 심사위원 이름
 * @param {boolean} isResult : 결과창을 보는 옵션 (버튼이 추가 됨)
 * @param {boolean} isOwner : 조회한 곡이 나의 곡인지 확인하는 파라미터 (Begin Now 버튼 랜더링 여부를 결정)
 * @returns
 */
const EvaluationResultsComp = ({ evaluationData, songData, critic, isResult, isOwner }) => {
  const { t } = useTranslation('evaluation');

  return (
    <>
      <ContentWrap border={false} className="none-padding">
        <ContentWrap title={t('Result')} border={false}>
          {evaluationData && <Result t={t} evaluationData={evaluationData} />}
          {!evaluationData && (
            <NoneContent height={300} message="No evaluation history yet.">
              {isOwner && <BeginBtn t={t} songData={songData} critic={critic} />}
            </NoneContent>
          )}
          {isResult && <ResultBtn t={t} evaluationData={evaluationData} />}
        </ContentWrap>
        {evaluationData && (
          <>
            <ContentWrap title={t('Full Evaluation')}>
              {evaluationData && <FullEvaluation t={t} evaluationData={evaluationData} />}
              {!evaluationData && <NoneContent height={185} message="No evaluation history yet." />}
            </ContentWrap>
            <ContentWrap title={t('Other Songs Evaluationed By This Critic')}>
              <SongsCritic
                t={t}
                critic={critic}
                id={evaluationData?.id || evaluationData?.song_id}
              />
            </ContentWrap>
            {isResult && <ResultBtn t={t} evaluationData={evaluationData} />}
          </>
        )}
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

const BeginBtn = ({ t, songData, critic }) => {
  const navigate = useNavigate();

  return (
    <div className="btns">
      <button
        onClick={() =>
          navigate(
            `/evaluation-begin?search=${songData?.title}&song_id=${songData?.id}&critic=${critic}`
          )
        }
      >
        {t('Begin Now')}
      </button>
    </div>
  );
};

const ResultBtn = ({ t, evaluationData }) => {
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
        <article className={`full-evaluation__feed-back__txt active`}>
          <p className="ull-evaluation__feed-back__txt__title">{t('Feedback')}</p>
          <div className="ull-evaluation__feed-back__txt__memo">
            {evaluationData?.feedback || '-'}
          </div>
          {/* <button
            className="full-evaluation__feed-back__txt__see-more"
            onClick={() => setIsActive(prev => !prev)}
          >
            {t('See More')}
            <span></span>
          </button> */}
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
  const swiperOptions = {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 16,
    grabCursor: true,
    pagination: {
      clickable: true,
    },
    FreeMode: true,
    navigation: true,
    modules: [FreeMode, Navigation],
  };

  const { data: criticEvaluationList = [] } = useQuery(
    ['critic_evaluation_list', critic, id],
    async () => {
      const res = await getEvaluationList({ critic, page: 1, search_keyword: '' });

      const { data_list } = res.data;
      console.log(id, data_list, 'D');
      return data_list.filter(item => item.song_id !== id);
    }
  );

  return (
    <>
      <section className="critic-list">
        {criticEvaluationList?.length > 0 && (
          <Swiper {...swiperOptions} className="critic-list__swiper-wrapper">
            {criticEvaluationList.map(item => (
              <SwiperSlide key={item.id} className="critic-list__swiper-slide">
                <AlbumItem track={item} type="evaluation" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {criticEvaluationList?.length <= 0 && (
          <NoneContent height={200} message="No evaluation history yet." />
        )}
      </section>
    </>
  );
};
