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
import AlbumItem from '../components/unit/AlbumItem';

//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
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
  const {
    currentTrack,
    currentTime,
    playTrack,
    isTrackActive,
    audioRef,
    togglePlayPause,
    //
  } = useAudio();

  const handlePlay = ({ list, id, track }) => {
    if (currentTrack.id === track.id) {
      togglePlayPause();
      return;
    }

    playTrack({
      track,
      playlist: list,
      playlistId: id,
    });
  };

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

  const { data: evaluationListForLatest } = useQuery(['evaluation_list_latest'], async () => {
    const res = await getEvaluationList({
      page: 1,
      search_keyword: '',
      critic: 'All',
      sort_by: 'Latest',
    });
    return res.data.data_list;
  });

  return (
    <div className="evaluation-stage">
      <ContentWrap title="Evaluation Stage" border={false} style={{ padding: 0 }}>
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
          style={{ padding: 0 }}
          linkPosition="left"
        >
          {evaluationListForHighestScore?.length > 0 && (
            <EvaluationListItemWrapper>
              {evaluationListForHighestScore?.map((item, _, list) => (
                <React.Fragment key={item.id}>
                  <EvaluationListItem
                    data={item}
                    selectedMusic={currentTrack}
                    player={audioRef?.current?.audio?.current}
                    handler={() => handlePlay({ list, track: item, id: item.id })}
                  />
                </React.Fragment>
              ))}
            </EvaluationListItemWrapper>
          )}
          {evaluationListForHighestScore?.length <= 0 && (
            <NoneContent message="No evaluation history yet." height={300} />
          )}
        </ContentWrap>
        <ContentWrap title="Recently Rated">
          <div className="album__content-list__list">
            <Swiper {...swiperOptions} className="evaluation-stage__slide">
              {evaluationListForLatest?.slice(0, 9).map((track, _, list) => (
                <SwiperSlide key={track.id} className="evaluation-stage__slide_item">
                  <AlbumItem
                    key={track.id}
                    track={track}
                    isActive={isTrackActive(track, 'evaluation-stage')}
                    currentTime={currentTime}
                    onClick={() => {
                      handlePlay({ list: list, track: track, id: track.id });
                    }}
                    audioRef={audioRef}
                    type={'evaluation'}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </ContentWrap>
      </ContentWrap>
      <Loading isLoading={isLoading} />
    </div>
  );
}

export default EvaluationStage;
