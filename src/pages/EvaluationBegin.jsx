import React, { useEffect, useState, useContext } from 'react';
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

    // GPT 점수 요청
    const request = async () => {
      try {
        const response = await client.chat.completions.create({
          model: 'gpt-4.1-nano',
          messages: [
            {
              role: 'system',
              content: `

             

                음악 분석 데이터 :  ${JSON.stringify(analysisResult)}
                가사 : ${selectMusic?.lyrics || '가사 없음.'}
                심사위원 성향 :
                  - 심사 철학 : ${selectCritic?.judgingPhilosophy}
                  - 평가 기준 중 다음 항목들을 특히 중시합니다 :
                            ${selectCritic?.important?.join(', \n')}

                  다음 조건에 따라 JSON 형태로 평가 결과를 반환하시오:

                  0. 프롬프트를 끝까지 정독하여 누락된 내용이 절대 없어야함.
                  1. 입력 데이터는 emotion, creativity, structure, sound, popularity 항목을 포함합니다.
                  2. 각 항목의 점수는 해당 항목의 features 객체 내 음향 데이터 분석 결과와 가사의 예술성을 종합하여 산출합니다.
                  3. 가사가 없는 경우(예: BGM)는 가사 항목을 제외하고 평가합니다.
                  4. 각 항목의 점수는 0점에서 100점까지의 실수형태로 평가합니다.
                  5. 평가 결과는 다음 JSON 형식을 반드시 준수하여 작성하십시오:

                  {
                    "emotion": 0.0,          // emotion.features 내 데이터 분석 기반 감정 전달력 점수(0.0~100.0)
                    "creativity": 0.0,       // creativity.features 내 데이터 분석 기반 창의성 점수(0.0~100.0)
                    "structure": 0.0,        // structure.features 내 데이터 분석 기반 구성력 점수(0.0~100.0)
                    "sound": 0.0,            // sound.features 내 데이터 분석 기반 사운드 완성도 점수(0.0~100.0)
                    "popularity": 0.0,       // popularity.features 내 데이터 분석 기반 대중성 점수(0.0~100.0)        
                    "feedback": "",          // 항목별 모든 속성을 반드시 평가 
                    "to_improve": "",        // 개선이 필요한 점 
                    "why_this_score": "",    // 각 점수를 준 이유에 대한 간략한 설명
                    "key_points": ""         // 핵심 개선 포인트 요약
                    "feedback_kr" : "",       // "feedback" 속성 값의 한글 번역 도널드 트럼프의 말투로
                    "to_improve_kr" : "",       // "to_improve" 속성 값의 한글 번역 도널드 트럼프의 말투로
                    "why_this_score_kr" : "",   // "why_this_score" 속성 값의 한글 번역 도널드 트럼프의 말투로
                    "key_points_kr" : "",       // "key_points" 속성 값의 한글 번역 도널드 트럼프의 말투로
                  }

                  7. 응답은 반드시 영어로, 
                  8. 영어 답변과 한글 답변 모두 ${selectCritic?.prompt} 의 설정을 따르시오
                  9. JSON 이외의 형식으로 응답하지 마십시오.
                  10. 심사위원의 특성에 따른 변별력을 추가하시오
                  11. 분석 결과가 선호하는 장르인 경우 모든 점수부분에 가산점 부여
                  12. 음악 분석 데이터의 항목별 features 내의 모든 속성은 반드시 점수 산정에 영향을 미쳐야 함, 
                  13. 값이 없는 항목은 존재할 수 없음. 모든 항목에 값이 있어야 함.
                  14. 제시된 JSON 형식을 무조건 따르시오.
                 
                  ${selectCritic?.prompt}


                  ※ 이 형식을 무조건 따르시오. JSON 외 다른 형식은 허용되지 않음.
              `,
            },
            // { role: 'user', content: `${JSON.stringify(analysisResult)}` },
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
          responses?.feedback,
          responses?.to_improve,
          responses?.why_this_score,
          responses?.key_points,
          responses?.feedback_kr,
          responses?.to_improve_kr,
          responses?.why_this_score_kr,
          responses?.key_points_kr,
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

    while (retryCnt < 3) {
      // 에러 발생 시 재시도
      // JSON 형식 반환 중 에러가 발생하거나
      // GPT 서버 오류로 인한 에러 발생 시
      // 3번까지 재시도
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
