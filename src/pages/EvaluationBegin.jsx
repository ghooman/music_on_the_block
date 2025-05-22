import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationBegin.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Filter from '../components/unit/Filter';
import NoneContent from '../components/unit/NoneContent';
// import Loading from '../components/IntroLogo2';
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
import { useInfiniteQuery, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../contexts/AuthContext';
import { getPossibleCount } from '../api/evaluation/getPossibleCount';
import { getReleaseAndUnReleaseSongData } from '../api/getReleaseAndUnReleaseSongData';

const EvaluationBegin = () => {
  const { t } = useTranslation('evaluation');
  const { token } = useContext(AuthContext);
  const [selectMusic, setSelectMusic] = useState(null);
  const [selectCritic, setSelectCritic] = useState(null);

  //================
  // 생성 가능 횟수 체크
  //================
  const { data: possibleCnt } = useQuery(['evaluation_possible_cnt', token], async () => {
    const res = await getPossibleCount({ token });
    return res.data.cnt;
  });

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
        />
      </ContentWrap>
    </>
  );
};

export default EvaluationBegin;

const Step1 = ({ t, token, setSelectMusic }) => {
  const [temporarySelect, setTemporarySelect] = useState(null);
  const [searchParams] = useSearchParams();

  const songs_sort = searchParams.get('songs_sort');
  const grade_fiter = searchParams.get('grade_filter');

  const { ref, inView } = useInView();

  //===============
  // 무한 스크롤
  //===============
  const { data, hasNextPage, isLoading, fetchNextPage } = useInfiniteQuery(
    ['song_data_in_infinite', songs_sort, grade_fiter],
    async ({ pageParam = 1 }) => {
      const res = await getReleaseAndUnReleaseSongData({
        token,
        page: pageParam,
        type: 'Released',
        sort_by: songs_sort,
        rating: grade_fiter,
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
        <Filter songsSort={true} gradeFilter={true} />
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
              <p>{selectCritic?.name}</p>
              <span>
                {t('Todays Left')}: <strong>{possibleCnt}/1</strong>
              </span>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

const ViewResults = ({ t, possibleCnt, selectMusic, selectCritic }) => {
  const navigate = useNavigate();
  // 비활성화 조건
  const disabled = !possibleCnt || possibleCnt < 1 || !selectMusic || !selectCritic;

  return (
    <>
      <button
        onClick={() => navigate('/evaluation-results')}
        className="view-results"
        disabled={disabled}
      >
        {t('View Results')}
      </button>
    </>
  );
};
