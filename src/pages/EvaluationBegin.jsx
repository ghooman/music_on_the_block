import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OpenAI from 'openai';

import Filter from '../components/unit/Filter';
import NoneContent from '../components/unit/NoneContent';
import Loading from '../components/IntroLogo2';
import ErrorModal from '../components/modal/ErrorModal';
import SongsBar from '../components/unit/SongsBar';
import ContentWrap from '../components/unit/ContentWrap';

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

  const [isLoading, setIsLoading] = useState(false);
  const [selectMusic, setSelectMusic] = useState(null);
  const [selectCritic, setSelectCritic] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  //================
  // 생성 가능 횟수 체크
  //================
  const { data: possibleCnt, isFe: possibleCntLoading } = useQuery(
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
                가사 : ${selectMusic?.lyrics}
               

                다음 조건에 따라 JSON 형태로 평가 결과를 반환하시오:

                  1. 위 데이터는 emotion, creativity, structure, sound, popularity 항목을 포함한다.
                  2. 음악 분석데이터의 features 키 내의 데이터와 가사를 종합하여 점수를 정의한다.
                  2. 각 항목은 100점 만점 기준으로 평가하시오.
                  3. 말투는 ${selectCritic?.speechStyle || '정중한 말투'} 스타일로 작성하시오.
                  4. 응답은 반드시 한글로 작성하시오.
                  5. 아래 JSON 형식을 반드시 지킬 것:

                  {
                    "emotion": 감정 전달력에 대한 점수 (0~100),
                    "creativity": 창의성에 대한 점수 (0~100),
                    "structure": 구성력에 대한 점수 (0~100),
                    "sound": 사운드/음악적 완성도 점수 (0~100),
                    "popularity": 대중성에 대한 점수 (0~100),
                    "feedback": 전반적인 피드백 (자연어),
                    "to_improve": 개선이 필요한 점 (자연어, 60자 이내),
                    "why_this_score": 각 점수를 준 이유에 대한 설명 (자연어, 60자 이내),
                    "key_points": 핵심적인 개선 포인트 요약 (자연어, 60자 이내)
                  }

                  ※ 이 형식을 무조건 따르시오. JSON 외 다른 형식은 허용되지 않음.
              `,
            },
            // { role: 'user', content: `${JSON.stringify(analysisResult)}` },
          ],
        });
        responses = JSON.parse(response?.choices[0]?.message?.content);
        return true;
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

    if (responses === null) {
      throw new Error('점수 산정에 실패하였습니다');
    }

    return responses;
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
        evalution_data: evaluationResultData,
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
      const { task_id } = res.data;
      const analData = await getAnalysisData({ task_id });
      const evaluationResultData = await getEvaluationResult({ analysisResult: analData?.result });
      const result = await saveEvaluationScore(evaluationResultData);
      navigate('/evaluation-results', { state: result });
    } catch (e) {
      console.error(e);
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
        <ContentWrap title={t('Step 1')}>
          <Step1 t={t} token={token} setSelectMusic={setSelectMusic} />
        </ContentWrap>
        <ContentWrap title={t('Step 2')} border={false}>
          <Step2 t={t} selectCritic={selectCritic} setSelectCritic={setSelectCritic} />
        </ContentWrap>
        <ContentWrap title={t('Step 3')}>
          <Step3
            t={t}
            possibleCnt={possibleCnt}
            selectCritic={selectCritic}
            selectMusic={selectMusic}
          />
        </ContentWrap>
        <ViewResults
          t={t}
          possibleCnt={possibleCnt}
          selectMusic={selectMusic}
          selectCritic={selectCritic}
          possibleCntLoading={possibleCntLoading}
          handleClick={handleEvaluation}
        />
      </ContentWrap>
      {errorMessage && <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} />}
      {isLoading && <Loading autoClose={false} />}
    </>
  );
};

export default EvaluationBegin;

const Step1 = ({ t, token, setSelectMusic }) => {
  const [temporarySelect, setTemporarySelect] = useState(null);
  const [searchParams] = useSearchParams();

  const songs_sort = searchParams.get('songs_sort');
  const grade_fiter = searchParams.get('grade_filter');
  const ai_service_filter = searchParams.get('ai_service_filter');

  const { ref, inView } = useInView();

  //===============
  // 무한 스크롤
  //===============
  const { data, hasNextPage, isLoading, fetchNextPage } = useInfiniteQuery(
    ['song_data_in_infinite', songs_sort, grade_fiter, ai_service_filter],
    async ({ pageParam = 1 }) => {
      const res = await getReleaseAndUnReleaseSongData({
        token,
        page: pageParam,
        type: 'Released',
        sort_by: songs_sort,
        rating: grade_fiter,
        ai_service: ai_service_filter,
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

  return (
    <>
      <div className="step1">
        <p className="step1__title">
          {t('Select your song.')}
          <br />
          {t('Click the song, then tap “Select” below to continue.')}
        </p>
        <Filter songsSort={true} gradeFilter={true} aiServiceFilter={true} />
        <div className="step1__list">
          {isLoading && (
            <div className="step1__list--loading-box">
              <Loading />
            </div>
          )}
          {!isLoading && listData?.length === 0 && <NoneContent message="No data" height={220} />}
          {!isLoading &&
            listData.map(item => (
              <span
                key={item.id}
                onClick={() => {
                  setTemporarySelect(prev => {
                    if (prev?.id === item?.id) {
                      return null;
                    } else {
                      return item;
                    }
                  });
                }}
              >
                <SongsBar itemData={item} play={item?.id === temporarySelect?.id} />
              </span>
            ))}
          <span ref={ref} style={{ width: '100%', height: 1 }}></span>
        </div>
        <button
          className="select-btn"
          disabled={!temporarySelect}
          onClick={() => {
            setSelectMusic(prev => {
              return { ...temporarySelect };
            });
          }}
        >
          {t('Select')}
        </button>
      </div>
    </>
  );
};

const Step2 = ({ t, selectCritic, setSelectCritic }) => {
  return (
    <>
      <div className="step2">
        <p className="step2__title">{t('Choose your music critic.')}</p>
        <div className="step2__choose">
          {criticsDataForArray?.map(critic => (
            <button
              className={`step2__choose__item ${
                critic?.name === selectCritic?.name ? 'active' : ''
              }`}
              onClick={() =>
                setSelectCritic(prev => {
                  if (prev?.name === critic?.name) return null;
                  return critic;
                })
              }
              key={critic?.id}
            >
              <img src={critic?.image} alt="Jinwoo Yoo" />
              <dl className="step2__choose__item__title">
                <dt
                  dangerouslySetInnerHTML={{
                    __html: t(`"${critic.introductionForReactNode}"`),
                  }}
                ></dt>
                <dd>{critic?.name}</dd>
              </dl>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const Step3 = ({ t, possibleCnt, selectMusic, selectCritic, possibleCntLoading }) => {
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
          {selectMusic && <SongsBar itemData={selectMusic} />}
          {!selectMusic && (
            <NoneContent height={130} message="Please select your song and music critic." />
          )}
          <dl className="step3__selected-song__critic">
            <dt>{t('Critic')}</dt>
            <dd>
              <p>{selectCritic?.name || '-'}</p>
              {selectCritic && selectMusic && !possibleCntLoading && (
                <span>
                  {t('Todays Left')}: <strong>{possibleCnt >= 0 ? possibleCnt : '-'} / 1</strong>
                </span>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </>
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
