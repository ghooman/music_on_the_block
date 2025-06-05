// 라이브러리
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 컴포넌트
import {
  EvaluationListItem,
  EvaluationListItemWrapper,
} from '../components/unit/EvaluationListItem';
import NoneContent from '../components/unit/NoneContent';
import ContentWrap from '../components/unit/ContentWrap';
import Loading from '../components/IntroLogo2';

//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// 함수 및 데이터
import { getEvaluationList } from '../api/evaluation/getList';
import { criticsDataForArray } from '../data/criticsData';

// 이미지 에셋
import personaAll from '../assets/images/evaluation/persona-all-bg.png';

// CSS
import '../styles/EvaluationStage.scss';

function EvaluationStage() {
  const { t } = useTranslation('evaluation');
  const [searchParams, setSearchParams] = useSearchParams();

  const critic = searchParams.get('critic') || 'All';

  const { data: evaluationListForHighestScore, isLoading } = useQuery(
    ['evaluation_list_highest_score', critic],
    async () => {
      const res = await getEvaluationList({
        page: 1,
        search_keyword: '',
        critic,
        sort_by: 'Highest Score',
      });
      return res.data.data_list;
    }
  );

  return (
    <div className="evaluation-stage">
      <ContentWrap title="Evaluation Stage" border={false}>
        <div className="evaluation-stage__critics">
          {[{ name: 'All', image: personaAll }, ...criticsDataForArray].map((persona, index) => (
            <div
              key={index}
              className={`evaluation-stage__critics-item ${
                critic === persona?.name ? 'active' : ''
              }`}
              onClick={() =>
                setSearchParams(prev => {
                  return { ...Object.fromEntries(prev), critic: persona.name };
                })
              }
            >
              <img
                className="evaluation-stage__critics-item--image"
                src={persona.image}
                alt={persona.name}
              />
              <p className="evaluation-stage__critics-item--name">{persona.name}</p>
            </div>
          ))}
        </div>

        <ContentWrap
          border={false}
          title="Evaluation Stage"
          link="/song/list?service=AI+Singing+Evaluation"
        >
          {evaluationListForHighestScore?.length > 0 && (
            <EvaluationListItemWrapper>
              {evaluationListForHighestScore?.map(item => (
                <React.Fragment key={item.id}>
                  <EvaluationListItem data={item} />
                </React.Fragment>
              ))}
            </EvaluationListItemWrapper>
          )}
          {evaluationListForHighestScore?.length <= 0 && (
            <NoneContent message="No evaluation history yet." height={300} />
          )}
        </ContentWrap>
        <ContentWrap title="배고픔"></ContentWrap>
      </ContentWrap>
      {isLoading && <Loading />}
    </div>
  );
}

export default EvaluationStage;
