import React, { useEffect, useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../contexts/AudioContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OpenAI from 'openai';

import Filter from '../components/unit/Filter';
import NoneContent from '../components/unit/NoneContent';
import Loading from '../components/IntroLogo2';
import ErrorModal from '../components/modal/ErrorModal';
import SongsBar from '../components/unit/SongsBar';
import ContentWrap from '../components/unit/ContentWrap';
import Search from '../components/unit/Search';
import EvaluationConfirmModal from '../components/EvaluationConfirmModal';

import { getPossibleCount } from '../api/evaluation/getPossibleCount';
import { getReleaseAndUnReleaseSongData } from '../api/getReleaseAndUnReleaseSongData';
import { getAnalysisResult, getAnalysisTaskId } from '../api/evaluation/getAnalysisData';
import { saveEvaluationData } from '../api/evaluation/saveEvaluationData';

import { useInfiniteQuery, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../contexts/AuthContext';

import { criticsDataForArray } from '../data/criticsData';

import '../styles/EvaluationBegin.scss';
import { ResponsiveLine } from '@nivo/line';
import { setDefaultLocale } from 'react-datepicker';

const EvaluationBegin = () => {
  let TO;

  const navigate = useNavigate();
  const { t } = useTranslation('evaluation');
  const { token } = useContext(AuthContext);
  const {
    currentTrack,
    currentTime,
    playTrack,
    isTrackActive,
    audioRef,
    togglePlayPause,
    isPlaying,
  } = useAudio();
  const audioPlayer = audioRef?.current?.audio?.current;

  const [isLoading, setIsLoading] = useState(false);
  const [selectMusic, setSelectMusic] = useState(null);
  const [selectCritic, setSelectCritic] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [evaluationConfirmModal, setEvaluationConfirmModal] = useState(false);

  //================
  // 생성 가능 횟수 체크
  //================
  const { data: possibleCnt, isFetching: possibleCntLoading } = useQuery(
    ['evaluation_possible_cnt', token, selectMusic?.id, selectCritic?.name],
    async () => {
      const res = await getPossibleCount({
        token,
        song_id: selectMusic?.id,
        critic: selectCritic?.name,
      });
      return res.data.cnt;
    },
    { enabled: !!selectCritic && !!selectMusic }
  );

  //================
  // GPT 점수 정의
  //================
  const getEvaluationResult = async ({ analysisResult }) => {
    // OpenAI 클라이언트 초기화
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    let retryCnt = 0;
    let responses = null;
    let result = null;

    const { emotion, creativity, structure, sound, popularity } = analysisResult;
    const { spectral_centroid, tonnetz, mfcc, rms } = emotion?.features;
    const { chroma_stft, spectral_contrast, zero_crossing_rate } = creativity?.features;
    const { onset_strength, tempo, tempogram, beat_track } = structure?.features;
    const { spectral_bandwidth, spectral_flatness } = sound?.features;
    const { chroma_cqt } = popularity?.features;

    // GPT 점수 요청
    const request = async () => {
      try {
        const response = await client.chat.completions.create({
          model: 'gpt-4.1-nano',
          messages: [
            {
              role: 'system',
              content: `
               당신은 다음과 같은 성향의 음악 심사위원입니다 : 
                
                1. 선호하는 장르 : ${selectCritic?.likeGenre.join(', ')}
                2. 말투 : ${selectCritic?.speechStyle}
                3. 성향 : ${selectCritic?.judgingPhilosophy}
                4. 항목별 가중치 (1.0 = 기준 값)
                  - emotion: ${selectCritic.weights.emotion}
                  - creativity: ${selectCritic.weights.creativity}
                  - structure: ${selectCritic.weights.structure}
                  - sound: ${selectCritic.weights.sound}
                  - popularity: ${selectCritic.weights.popularity}

                ※ 평가 시 위 항목별 가중치를 반영하여 점수를 산정하십시오.

               당신은 음악 평가 전문가이며, 이 데이터를 기반으로 5가지 항목의 점수를 분석하고 평가합니다 :

                점수 항목은 다음과 같습니다:  
                1. emotion  
                2. creativity  
                3. structure  
                4. sound  
                5. popularity

          
                각 항목은 다음 특성(features)을 참고하여 평가합니다:

                emotion: spectral_centroid, tonnetz, mfcc, rms  
                creativity: chroma_stft, spectral_contrast, zero_crossing_rate  
                structure: onset_strength, tempo, tempogram, beat_track  
                sound: mfcc, spectral_bandwidth, rms, spectral_flatness  
                popularity: tempo, chroma_cqt, spectral_centroid, rms

              다음은 분석 데이터 입니다.

                - spectral_centroid : ${spectral_centroid}
                - tonnetz : ${tonnetz}
                - mfcc : ${mfcc}
                - rms : ${rms}

                - chroma_stft : ${chroma_stft}
                - spectral_contrast : ${spectral_contrast}
                - zero_crossing_rate : ${zero_crossing_rate}

                - onset_strength : ${onset_strength}
                - tempo : ${tempo}
                - tempogram : ${tempogram}
                - beat_track : ${beat_track}

                - spectral_bandwidth : ${spectral_bandwidth}
                - spectral_flatness : ${spectral_flatness}

                - chroma_cqt : ${chroma_cqt}


                다음은 반환값 형식입니다.

                {
                  "emotion": 0.0,           emotion 평가 값 (0.0~100.0)
                  "creativity": 0.0,        creativity 평가 값 (0.0~100.0)
                  "structure": 0.0,         structure 평가 값 (0.0~100.0)
                  "sound": 0.0,             sound 평가 값 (0.0~100.0)
                  "popularity": 0.0,        popularity 평가 값 (0.0~100.0)
                  "feedback": "",           emotion, creativity, structure, sound, popularity 값을 종합한 피드백 영문으로 반환 심사위원의 말투로
                  "to_improve": "",         개선이 필요한 점 영문으로 반환 심사위원의 말투로
                  "why_this_score": "",     각 점수를 준 이유에 대한 간략한 설명 영문으로 반환 심사위원의 말투로
                  "key_points": ""          핵심 개선 포인트 요약 영문으로 반환 심사위원의 말투로

                  "feedback_kr" : "",        "feedback" 속성 값의 한글 번역 심사위원의 말투로
                  "to_improve_kr" : "",        "to_improve" 속성 값의 한글 번역 심사위원의 말투로
                  "why_this_score_kr" : "",    "why_this_score" 속성 값의 한글 번역 심사위원의 말투로
                  "key_points_kr" : "",        "key_points" 속성 값의 한글 번역 심사위원의 말투로

                  "feedback_id" : "",        "feedback" 속성 값의 인도네시아어 번역 심사위원의 말투로
                  "to_improve_id" : "",        "to_improve" 속성 인도네시아어 한글 번역 심사위원의 말투로
                  "why_this_score_id" : "",    "why_this_score" 속성 값의 인도네시아어 번역 심사위원의 말투로
                  "key_points_id" : "",        "key_points" 속성 값의 인도네시아어 번역 심사위원의 말투로
                  
                  "feedback_ja" : "",        "feedback" 속성 값의 일본어 번역 심사위원의 말투로
                  "to_improve_ja" : "",        "to_improve" 속성 일본어 한글 번역 심사위원의 말투로
                  "why_this_score_ja" : "",    "why_this_score" 속성 값의 일본어 번역 심사위원의 말투로
                  "key_points_ja" : "",        "key_points" 속성 값의 일본어 번역 심사위원의 말투로

                  "feedback_vi" : "",        "feedback" 속성 값의 베트남어 번역 심사위원의 말투로
                  "to_improve_vi" : "",        "to_improve" 속성 베트남어 한글 번역 심사위원의 말투로
                  "why_this_score_vi" : "",    "why_this_score" 속성 값의 베트남어 번역 심사위원의 말투로
                  "key_points_vi" : "",        "key_points" 속성 값의 베트남어 번역 심사위원의 말투로


                }

                  ※ 가중치가 적용된 최종 점수는 0.0~100.0 사이로 제한하십시오.
                  ※ 모든 점수는 가중치를 반영하여 조정된 후 소수점 첫째 자리까지 반영하십시오.
                  ※ 값이 없는 항목은 존재할 수 없음. 모든 항목에 값이 있어야 함.
                  ※ 제시된 JSON 형식을 무조건 따르시오. JSON 외 다른 형식은 허용되지 않음. 

                `,
            },
          ],
        });
        responses = JSON.parse(response?.choices[0]?.message?.content);
        // 간혹 필드 자체를 반환하지 않는 경우가 있습니다
        // 필드 자체를 반환하지 않을 경우에 대비해 코드가 더럽지만 해당 코드를 추가합니다.
        const checks = [
          responses?.emotion,
          responses?.creativity,
          responses?.structure,
          responses?.sound,
          responses?.popularity,
          // 피드백 영어
          responses?.feedback,
          responses?.to_improve,
          responses?.why_this_score,
          responses?.key_points,
          // 피드백 한국어
          responses?.feedback_kr,
          responses?.to_improve_kr,
          responses?.why_this_score_kr,
          responses?.key_points_kr,
          // 피드백 인도네시아어
          responses?.feedback_id,
          responses?.to_improve_id,
          responses?.why_this_score_id,
          responses?.key_points_id,
        ].every(item => item);

        if (checks === true) {
          result = responses;
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    };

    while (retryCnt < 5) {
      // 에러 발생 시 재시도
      // JSON 형식 반환 중 에러가 발생하거나
      // GPT 서버 오류로 인한 에러 발생 시
      // 5번까지 재시도
      const res = await request();
      if (res === true) retryCnt = 100;
      else retryCnt++;
    }

    if (result === null) {
      throw new Error('Unable to measure the score. Please try again.');
    }

    return result;
  };

  //=================
  // 분석 데이터 산출
  //=================
  const getAnalysisData = async ({ task_id }) => {
    return new Promise((resolve, reject) => {
      const getData = async () => {
        try {
          const res = await getAnalysisResult({ task_id });
          const { status } = res.data;
          if (status === 'done') {
            clearTimeout(TO);
            resolve(res.data);
          } else if (status === 'processing') {
            TO = setTimeout(getData, 3000);
          } else if (status === 'fail') {
            clearTimeout(TO);
            reject('Fail');
          }
        } catch (e) {
          console.log(e, '에러');
          clearTimeout(TO);
          reject('Fail');
        }
      };
      getData();
    });
  };

  //==================
  // 평가 점수 저장
  //==================
  const saveEvaluationScore = async evaluationResultData => {
    const { emotion, creativity, structure, sound, popularity } = evaluationResultData;
    evaluationResultData.score = (emotion + creativity + structure + sound + popularity) / 5;
    evaluationResultData.critic = selectCritic?.name;
    evaluationResultData.song_id = selectMusic?.id;
    try {
      await saveEvaluationData({
        token,
        song_id: selectMusic?.id,
        evaluation_data: evaluationResultData,
      });

      return evaluationResultData;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  };

  //==================
  // 평가
  //==================
  const handleEvaluation = async () => {
    setIsLoading(true);
    try {
      const res = await getAnalysisTaskId({
        token,
        song_id: selectMusic?.id,
        critic: selectCritic?.name,
      });
      const { task_id } = res.data; // task_id 발급
      const analData = await getAnalysisData({ task_id }); // 분석 데이터 반환
      const evaluationResultData = await getEvaluationResult({ analysisResult: analData?.result }); // GPT로 최종 점수 정의
      const result = await saveEvaluationScore(evaluationResultData); // 저장
      navigate('/evaluation-results', { state: result });
    } catch (e) {
      console.error(e);
      setEvaluationConfirmModal(false);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(TO);
    };
  }, []);

  return (
    <>
      <ContentWrap title={t('AI Song Evaluation')} border={false} className="none-padding">
        <Step1
          t={t}
          token={token}
          selectMusic={selectMusic}
          setSelectMusic={setSelectMusic}
          currentTrack={currentTrack}
          currentTime={currentTime}
          togglePlayPause={togglePlayPause}
          playTrack={playTrack}
          isPlaying={isPlaying}
        />
        <Step2 t={t} selectCritic={selectCritic} setSelectCritic={setSelectCritic} />
        <Step3
          t={t}
          possibleCnt={possibleCnt}
          selectMusic={selectMusic}
          selectCritic={selectCritic}
          currentTrack={currentTrack}
          currentTime={currentTime}
          togglePlayPause={togglePlayPause}
          playTrack={playTrack}
          isPlaying={isPlaying}
        />
        <ViewResults
          t={t}
          possibleCnt={possibleCnt}
          selectMusic={selectMusic}
          selectCritic={selectCritic}
          possibleCntLoading={possibleCntLoading}
          handleClick={() => setEvaluationConfirmModal(true)}
        />
      </ContentWrap>
      {errorMessage && (
        <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} button />
      )}
      {evaluationConfirmModal && (
        <EvaluationConfirmModal
          setEvaluationConfirmModal={setEvaluationConfirmModal}
          isLoading={isLoading}
          handler={handleEvaluation}
        />
      )}
    </>
  );
};

export default EvaluationBegin;

const Step1 = ({
  t,
  token,
  selectMusic,
  setSelectMusic,
  togglePlayPause,
  currentTrack,
  playTrack,
  isPlaying,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const song_id = searchParams.get('song_id');

  const songs_sort = searchParams.get('songs_sort');
  const grade_fiter = searchParams.get('grade_filter');
  const ai_service_filter = searchParams.get('ai_service_filter');
  const search = searchParams.get('search');

  const { ref, inView } = useInView();
  // 평가에서 노래 선택시 함수
  // const handleSelectMusic = item => {
  //   // span 클릭 시에는 임시 선택만 하고 재생하지 않음
  //   setTemporarySelect(item);
  // };

  // SongsBar에서 앨범 커버 클릭 시 재생을 위한 함수
  const handlePlayMusic = item => {
    if (item?.id === currentTrack?.id) {
      togglePlayPause();
    } else {
      playTrack({
        track: item,
        playlist: listData,
        playlistId: 'evaluation-playlist',
      });
    }
  };
  //===============
  // 무한 스크롤
  //===============
  const { data, hasNextPage, isLoading, fetchNextPage } = useInfiniteQuery(
    ['song_data_in_infinite', songs_sort, grade_fiter, ai_service_filter, search],
    async ({ pageParam = 1 }) => {
      const res = await getReleaseAndUnReleaseSongData({
        token,
        page: pageParam,
        type: 'Released',
        sort_by: songs_sort,
        rating: grade_fiter,
        ai_service: ai_service_filter,
        search_keyword: search,
      });

      return res.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalLoaded = allPages.reduce((sum, page) => sum + page?.data_list?.length, 0);
        return totalLoaded < lastPage.total_cnt ? allPages.length + 1 : undefined;
      },
    }
  );
  const listData = data?.pages?.flatMap(item => item.data_list) || [];

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (!song_id || !listData || listData.length <= 0) {
      setSelectMusic(null);
      return;
    }
    setSelectMusic(listData?.find(item => item.id === parseInt(song_id)));
  }, [song_id, listData]);

  return (
    <ContentWrap title={t('Step 1')}>
      <div className="step1">
        <p className="step1__title">{t('Select your song.')}</p>
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} gradeFilter={true} aiServiceFilter={true} />
          <Search placeholder="Search by song title" />
        </ContentWrap.SubWrap>
        <div className="step1__list">
          {!isLoading && listData?.length === 0 && <NoneContent message="No data" height={220} />}
          {!isLoading &&
            listData.map(item => (
              <span
                key={item.id}
                onClick={() => {
                  // setSelectMusic(prev => {
                  //   if (prev?.id === item?.id) return null;
                  //   return item;
                  // });
                  setSearchParams(prev => {
                    let id;
                    if (selectMusic?.id === item.id) {
                      id = null;
                    } else {
                      id = item.id;
                    }
                    const { song_id: ids, ...rest } = Object.fromEntries(prev);
                    return { ...rest, ...(id ? { song_id: id } : null) };
                  });
                }}
              >
                <SongsBar
                  itemData={item}
                  isSelected={item?.id === selectMusic?.id}
                  play={item?.id === currentTrack?.id && isPlaying}
                  onPlayClick={() => handlePlayMusic(item)}
                />
              </span>
            ))}
          <span ref={ref} style={{ width: '100%', height: 1 }}></span>
        </div>
        {/* <button
          className="select-btn"
          disabled={!temporarySelect}
          onClick={() => {
            setSelectMusic(prev => {
              return { ...temporarySelect };
            });
          }}
        >
          {t('Select')}
        </button> */}
      </div>
      <Loading isLoading={isLoading} />
    </ContentWrap>
  );
};

const Step2 = ({ t, setSelectCritic }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const critic = searchParams.get('critic');

  useEffect(() => {
    setSelectCritic(criticsDataForArray.find(item => item.name === critic));
  }, [critic]);

  return (
    <ContentWrap title={t('Step 2')}>
      <div className="step2">
        <p className="step2__title">{t('Choose your music critic.')}</p>
        <div className="step2__choose">
          {criticsDataForArray?.map(item => (
            <button
              className={`step2__choose__item ${critic === item?.name ? 'active' : ''}`}
              onClick={() =>
                setSearchParams(prev => {
                  const { critic, ...rest } = Object.fromEntries(prev);
                  if (item.name === critic) {
                    return { ...rest };
                  } else {
                    return { critic: item.name, ...rest };
                  }
                })
              }
              key={item?.name}
            >
              <img src={item?.image} alt="Jinwoo Yoo" />
              <dl className="step2__choose__item__title">
                <dt
                  dangerouslySetInnerHTML={{
                    __html: t(`"${item.introductionForReactNode}"`),
                  }}
                ></dt>
                <dd>{item?.name}</dd>
              </dl>
            </button>
          ))}
        </div>
      </div>
    </ContentWrap>
  );
};

const Step3 = ({
  t,
  possibleCnt,
  selectMusic,
  selectCritic,
  possibleCntLoading,

  currentTrack,
  currentTime,
  togglePlayPause,
  playTrack,
  isPlaying,
}) => {
  const handlePlayMusic = item => {
    if (item?.id === currentTrack?.id) {
      togglePlayPause();
    } else {
      playTrack({
        track: item,
        playlist: [],
        playlistId: 'evaluation-playlist',
      });
    }
  };

  return (
    <ContentWrap title={t('Step 3')}>
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
          {selectMusic && (
            <SongsBar
              itemData={selectMusic}
              onPlayClick={() => handlePlayMusic(selectMusic)}
              isSelected={true}
              play={selectMusic?.id === currentTrack?.id && isPlaying}
            />
          )}
          {!selectMusic && (
            <NoneContent height={130} message="Please select your song and music critic." />
          )}
          <dl className="step3__selected-song__critic">
            <dt>{t('Critic')}</dt>
            <dd>
              <p>{selectCritic?.name || '-'}</p>
              {selectCritic && selectMusic && !possibleCntLoading && (
                <span>
                  {t('Remaining')}: <strong>{possibleCnt >= 0 ? possibleCnt : '-'} / 1</strong>
                </span>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </ContentWrap>
  );
};

const ViewResults = ({ t, possibleCnt, selectMusic, selectCritic, handleClick }) => {
  // 비활성화 조건
  const disabled = !possibleCnt || possibleCnt < 1 || !selectMusic || !selectCritic;

  return (
    <>
      <button onClick={handleClick} className="view-results" disabled={disabled}>
        {t('View Results')}
      </button>
    </>
  );
};
