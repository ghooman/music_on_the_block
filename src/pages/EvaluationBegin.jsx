import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationBegin.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import OpenAI from 'openai';

import Filter from '../components/unit/Filter';
import NoneContent from '../components/unit/NoneContent';
// import Loading from '../components/IntroLogo2';
import Loading from '../components/IntroLogo2';
import ErrorModal from '../components/modal/ErrorModal';

//이미지
import judgeImg01 from '../assets/images/evaluation/judge-img01.png';
import judgeImg02 from '../assets/images/evaluation/judge-img02.png';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';

import SongsBar from '../components/unit/SongsBar';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../contexts/AuthContext';
import { getPossibleCount } from '../api/evaluation/getPossibleCount';
import { getReleaseAndUnReleaseSongData } from '../api/getReleaseAndUnReleaseSongData';
import { getAnalysisData } from '../api/evaluation/getAnalysisData';

const EvaluationBegin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('evaluation');
  const { token } = useContext(AuthContext);

  const [selectMusic, setSelectMusic] = useState(null);
  const [selectCritic, setSelectCritic] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  //================
  // 생성 가능 횟수 체크
  //================
  const { data: possibleCnt } = useQuery(
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
  const getScoreByOpenAI = async ({ analysisData }) => {
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
                다음 조건에 따라 JSON 형태로 평가 결과를 반환하시오:

                  1. 입력된 데이터는 emotion, creativity, structure, sound, popularity 항목을 포함한다.
                  2. 각 항목은 100점 만점 기준으로 평가하시오.
                  3. 말투는 변수 ${selectCritic?.speechStyle || '정중한 말투'} 스타일로 작성하시오.
                  4. 응답은 반드시 한글로 작성하시오.
                  5. 아래 JSON 형식을 반드시 지킬 것:

                  {
                    "emotion": 감정 전달력에 대한 점수 (0~100),
                    "creativity": 창의성에 대한 점수 (0~100),
                    "structure": 구성력에 대한 점수 (0~100),
                    "sound": 사운드/음악적 완성도 점수 (0~100),
                    "popularity": 대중성에 대한 점수 (0~100),
                    "feedback": 전반적인 피드백 (자연어),
                    "to_improve": 개선이 필요한 점 (자연어),
                    "why_this_score": 각 점수를 준 이유에 대한 설명 (자연어),
                    "key_point": 핵심적인 개선 포인트 요약 (자연어)
                  }

                  ※ 이 형식을 무조건 따르시오. JSON 외 다른 형식은 허용되지 않음.
              `,
            },
            { role: 'user', content: `${analysisData}` },
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

  //================
  // 평가 프로세스
  //================

  const handleEvaluation = async () => {
    try {
      // 1. 서버에서 음악 분석 데이터를 불러옴
      const { data: analysisData } = await getAnalysisData({
        token,
        song_id: selectMusic?.id,
        critic: selectCritic?.name,
      });
      // 2. JSON으로 파싱
      const analysisDataJSON = JSON.stringify(analysisData);
      // 3. ChatGPT를 통해 점수 산정
      const scoringData = await getScoreByOpenAI({ analysisData: analysisDataJSON });
      // 4. 결과 페이지로 이동
      navigate('/evaluation-results', {
        state: {
          song_data: selectMusic,
          critic: selectCritic.name,
          ...scoringData,
        },
      });
    } catch (e) {
      console.error(e);
      setErrorMessage(e?.response?.detail?.data || e?.message);
    }
  };

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
          handleClick={handleEvaluation}
        />
      </ContentWrap>
      {errorMessage && <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} />}
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
  const criticData = [
    {
      id: 1,
      name: 'Jinwoo Yoo',
      desc: '<span>Soul</span> first, sound second.',
      image: judgeImg01,
    },
    {
      id: 2,
      name: 'Drexx',
      desc: 'No <span>flow?</span> No mercy. Off-beat? Game over.',
      image: judgeImg02,
    },
    {
      id: 3,
      name: 'Elara Moon',
      desc: 'Between the <span>Melody</span>, she finds the truth.',
      image: judgeImg03,
    },
  ];

  return (
    <>
      <div className="step2">
        <p className="step2__title">{t('Choose your music critic.')}</p>
        <div className="step2__choose">
          {criticData?.map(critic => (
            <button
              className={`step2__choose__item ${critic?.id === selectCritic?.id ? 'active' : ''}`}
              onClick={() =>
                setSelectCritic(prev => {
                  if (prev?.id === critic?.id) return null;
                  return critic;
                })
              }
              key={critic?.id}
            >
              <img src={critic?.image} alt="Jinwoo Yoo" />
              <dl className="step2__choose__item__title">
                <dt
                  dangerouslySetInnerHTML={{
                    __html: t(`"${critic.desc}"`),
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

const Step3 = ({ t, possibleCnt, selectMusic, selectCritic }) => {
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
              {selectCritic && (
                <span>
                  {t('Todays Left')}: <strong>{possibleCnt}/1</strong>
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
