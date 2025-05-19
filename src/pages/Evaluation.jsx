import React, { useEffect, useState, useContext } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/Evaluation.scss';
import { Link, useNavigate } from 'react-router-dom';
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


const Evaluation = () => {


  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
        <ContentWrap title="Why Join The Evaluation?" border={false} className="Evaluation">
          <JoinEvaluation/>
          <BeginNowBtn/>
        </ContentWrap>
        <ContentWrap title="Professional Music Critics Waiting For You." border={false}>
          <Judge/>
          <BeginNowBtn/>
        </ContentWrap>
        <ContentWrap title="AI Simple Guide To Help Your Journey." border={false}>
          <AiStep/>
          <BeginNowBtn/>
        </ContentWrap>
      </ContentWrap>
    </>
  );
};

export default Evaluation;



const BeginNowBtn = () => {

  return (
    <>
      <Link 
        to='/evaluation-begin'
        className='begin-now-btn'
      >Begin Now
      </Link>
    </>
  );
};


const JoinEvaluation = () => {

  return (
    <>
      <section className='join-evaluation'>
        <article className='join-evaluation__item two'>
          <dl className='join-evaluation__item__title'>
            <dt>
              <img src={earnMicIcon}/>
              Feel it, rate it, earn MIC.
            </dt>
            <dd>
              React to music, earn MIC points. Emotion becomes value.
            </dd>
          </dl>
          <dl className='join-evaluation__item__title'>
            <dt>
              <img src={algorithmIcon}/>
              Your emotions, your algorithm.
            </dt>
            <dd>
              Your reactions train AI to match your taste—and inspire creation.
            </dd>
          </dl>
        </article>
        <article className='join-evaluation__item'>
          <dl className='join-evaluation__item__title'>
            <dt>
              <img src={songValueIcon}/>
              Your Emotion Boosts Song Value.
            </dt>
            <dd>
              Songs with a lot of emotional evaluations can have higher NFT values. Your single emotion becomes a factor that increases the asset value of the song.
            </dd>
          </dl>
        </article>
        <article className='join-evaluation__item two'>
          <dl className='join-evaluation__item__title'>
            <dt>
              <img src={newMusicIcon}/>
              Feelings Fuel New Music.
            </dt>
            <dd>
              Emotions inspire new music and increase its value.
            </dd>
          </dl>
          <dl className='join-evaluation__item__title'>
            <dt>
              <img src={biggerRewardsIcon}/>
              Smarter Picks, Bigger Rewards.
            </dt>
            <dd>
              The more you feel, the smarter your rewards get.
            </dd>
          </dl>
        </article>
      </section>
    </>
  );
};




const Judge = () => {

  return (
    <>
      <div className='judge'>
        <div className='judge__item'>
          <p className='judge__item__title one'>
            "<span>Soul</span> first, sound second.”
          </p>
          <img src={judgeImg01} alt='judgeImg01'/>
          <p className='judge__name'>Jinwoo Yoo</p>
          <p className='judge__txt'>
            A veteran composer who listens with his soul. For him, music isn’t perfect unless it’s honest.
          </p>
        </div>
        <div className='judge__item'>
          <p className='judge__item__title'>
          "No <span>flow?</span> No mercy.
          Off-beat? Game over."
          </p>
          <img src={judgeImg02} alt='judgeImg01'/>
          <p className='judge__name'>Drexx</p>
          <p className='judge__txt'>
            Precision is his rhythm. A razor-sharp rapper who breaks down your flow like it’s science.
          </p>
        </div>
        <div className='judge__item'>
          <p className='judge__item__title'>
            "Between the <span>Melody</span>, she finds the truth."
          </p>
          <img src={judgeImg03} alt='judgeImg01'/>
          <p className='judge__name'>Jinwoo Yoo</p>
          <p className='judge__txt'>
            A veteran composer who listens with his soul. For him, music isn’t perfect unless it’s honest.
          </p>
        </div>
      </div>
    </>
  );
};




const AiStep = () => {

  return (
    <>
      <section className='ai-step'>
        <article className='ai-step__item'>
          <dl className='ai-step__item__txt'>
            <dt>Understand The System</dt>
            <dd>Before you begin, take a moment to learn how the evaluation works and who will be Evaluationing your song.</dd>
          </dl>
          <div className='ai-step__item__step'>
            <p className='ai-step__item__step__title'>Step 1</p>
          </div>
          <img src={step1Img}/>
        </article>
        <article className='ai-step__item reversal'>
          <dl className='ai-step__item__txt'>
            <dt>Choose</dt>
            <dd>Once you start the evaluation, please follow the steps.After completing all steps, click “View Results” to see your results.</dd>
          </dl>
          <div className='ai-step__item__step'>
            <p className='ai-step__item__step__title'>Step 2</p>
          </div>
          <img src={step2Img}/>
        </article>
        <article className='ai-step__item'>
          <dl className='ai-step__item__txt'>
            <dt>View Your Results</dt>
            <dd>When your evaluation is done, check your insights. You can share the results with friends or keep them for your own.</dd>
          </dl>
          <div className='ai-step__item__step'>
            <p className='ai-step__item__step__title'>Step 3</p>
          </div>
          <img src={step3Img}/>
        </article>
        <article className='ai-step__item reversal'>
          <dl className='ai-step__item__txt'>
            <dt>Explore & Improve</dt>
            <dd>Explore new music, improve your work, and connect with others through shared evaluations and feedback.</dd>
          </dl>
          <div className='ai-step__item__step'>
            <p className='ai-step__item__step__title'>Step 4</p>
          </div>
          <img src={step4Img}/>
        </article>
      </section>
    </>
  );
};
