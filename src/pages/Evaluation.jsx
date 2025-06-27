import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/Evaluation.scss';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

import { WalletConnect } from '../components/WalletConnect';

//이미지
import earnMicIcon from '../assets/images/evaluation/earnMicIcon.png';
import algorithmIcon from '../assets/images/evaluation/algorithmIcon.png';
import songValueIcon from '../assets/images/evaluation/songValueIcon.png';
import newMusicIcon from '../assets/images/evaluation/newMusicIcon.png';
import biggerRewardsIcon from '../assets/images/evaluation/biggerRewardsIcon.png';

import judgeImg01 from '../assets/images/evaluation/judge-img01.png';
import judgeImg02 from '../assets/images/evaluation/judge-img02.png';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';

import step1Img from '../assets/images/evaluation/step1-img.png';
import step2Img from '../assets/images/evaluation/step2-img.png';
import step3Img from '../assets/images/evaluation/step3-img.png';
import step4Img from '../assets/images/evaluation/step4-img.png';

import { criticsDataForArray } from '../data/criticsData';

const Evaluation = () => {
  const { t } = useTranslation('evaluation');

  const { isRegistered, isLoggedIn, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);
  const walletConnectRef = React.useRef(null);

  const navigate = useNavigate();

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };

  // useEffect를 사용하여 ThirdWeb 버튼을 참조
  useEffect(() => {
    // 컴포넌트가 마운트된 후에 참조할 수 있도록 약간의 지연 추가
    const timer = setTimeout(() => {
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          // 버튼 스타일 설정
          walletConnectButton.style.position = 'absolute';
          walletConnectButton.style.opacity = '0';
          walletConnectButton.style.pointerEvents = 'none';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = e => {
    if (!isRegistered || !isLoggedIn) {
      e.preventDefault();

      // 버튼 클릭 이벤트 발생시키기
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          walletConnectButton.click();
        }
      }
    } else {
      navigate('/evaluation-begin');
    }
  };

  return (
    <>
      <div
        ref={walletConnectRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          visibility: 'hidden',
        }}
      >
        <WalletConnect onConnect={handleWalletConnect} />
      </div>
      <ContentWrap title={t('AI Song Evaluation')} border={false} className="none-padding">
        <ContentWrap title={t('Why Join The Evaluation?')} border={false} className="Evaluation">
          <JoinEvaluation t={t} />
          <BeginNowBtn t={t} handleClick={handleButtonClick} />
        </ContentWrap>
        <ContentWrap title={t('Professional Music Critics Waiting For You.')} border={false}>
          <Judge t={t} />
          <BeginNowBtn t={t} handleClick={handleButtonClick} />
        </ContentWrap>
        <ContentWrap title={t('AI Simple Guide To Help Your Journey.')} border={false}>
          <AiStep t={t} />
          <BeginNowBtn t={t} handleClick={handleButtonClick} />
        </ContentWrap>
      </ContentWrap>
    </>
  );
};

export default Evaluation;

const BeginNowBtn = ({ t, handleClick }) => {
  return (
    <>
      <button
        className="begin-now-btn"
        onClick={e => {
          if (handleClick) handleClick(e);
        }}
      >
        {t('Begin Now')}
      </button>
    </>
  );
};

const JoinEvaluation = ({ t }) => {
  return (
    <>
      <section className="join-evaluation">
        <article className="join-evaluation__item two">
          <dl className="join-evaluation__item__title">
            <dt>
              <img src={earnMicIcon} />
              {t('Feel it, Rate it, Earn MIC.')}
            </dt>
            <dd>{t('React to music, earn MIC points. Emotion becomes value.')}</dd>
          </dl>
          <dl className="join-evaluation__item__title">
            <dt>
              <img src={algorithmIcon} />
              {t('Your Emotions, Your Algorithm.')}
            </dt>
            <dd>{t('Your reactions train AI to match your taste—and inspire creation.')}</dd>
          </dl>
        </article>
        <article className="join-evaluation__item">
          <dl className="join-evaluation__item__title">
            <dt>
              <img src={songValueIcon} />
              {t('Your Emotion Boosts Song Value.')}
            </dt>
            <dd>
              {t(
                'Songs with a lot of emotional evaluations can have higher NFT values. Your single emotion becomes a factor that increases the asset value of the song.'
              )}
            </dd>
          </dl>
        </article>
        <article className="join-evaluation__item two">
          <dl className="join-evaluation__item__title">
            <dt>
              <img src={newMusicIcon} />
              {t('Feelings Fuel New Music.')}
            </dt>
            <dd>{t('Emotions inspire new music and increase its value.')}</dd>
          </dl>
          <dl className="join-evaluation__item__title">
            <dt>
              <img src={biggerRewardsIcon} />
              {t('Smarter Picks, Bigger Rewards.')}
            </dt>
            <dd>{t('The more you feel, the smarter your rewards get.')}</dd>
          </dl>
        </article>
      </section>
    </>
  );
};

const Judge = ({ t }) => {
  return (
    <>
      <div className="judge">
        {criticsDataForArray.map(critic => (
          <div className="judge__item" key={critic?.name}>
            <p
              className="judge__item__title one"
              dangerouslySetInnerHTML={{ __html: t(`"${critic?.introductionForReactNode}"`) }}
            >
              {/* "<span>Soul</span> first, sound second.” */}
            </p>
            <img className="judge__item__image" src={critic?.image} alt="judgeImg01" />
            <p className="judge__name">{critic?.name}</p>
            <p className="judge__txt">{t(critic?.judgingSummation)}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const AiStep = ({ t }) => {
  return (
    <>
      <section className="ai-step">
        <article className="ai-step__item">
          <dl className="ai-step__item__txt">
            <dt>{t('Understand The System')}</dt>
            <dd>
              {t(
                'Before you begin, take a moment to learn how the evaluation works and who will be Evaluationing your song.'
              )}
            </dd>
          </dl>
          <div className="ai-step__item__step">
            <p className="ai-step__item__step__title">{t('Step 1')}</p>
          </div>
          <img src={step1Img} />
        </article>
        <article className="ai-step__item reversal">
          <dl className="ai-step__item__txt">
            <dt>{t('Choose')}</dt>
            <dd>
              {t(
                'Once you start the evaluation, please follow the steps.After completing all steps, click “View Results” to see your results.'
              )}
            </dd>
          </dl>
          <div className="ai-step__item__step">
            <p className="ai-step__item__step__title">{t('Step 2')}</p>
          </div>
          <img src={step2Img} />
        </article>
        <article className="ai-step__item">
          <dl className="ai-step__item__txt">
            <dt>{t('View Your Results')}</dt>
            <dd>
              {t(
                'When your evaluation is done, check your insights. You can share the results with friends or keep them for your own.'
              )}
            </dd>
          </dl>
          <div className="ai-step__item__step">
            <p className="ai-step__item__step__title">{t('Step 3')}</p>
          </div>
          <img src={step3Img} />
        </article>
        <article className="ai-step__item reversal">
          <dl className="ai-step__item__txt">
            <dt>{t('Explore & Improve')}</dt>
            <dd>
              {t(
                'Explore new music, improve your work, and connect with others through shared evaluations and feedback.'
              )}
            </dd>
          </dl>
          <div className="ai-step__item__step">
            <p className="ai-step__item__step__title">{t('Step 4')}</p>
          </div>
          <img src={step4Img} />
        </article>
      </section>
    </>
  );
};
