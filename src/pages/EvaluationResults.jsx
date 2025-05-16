import React, { useEffect, useState, useContext } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationResults.scss';
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/unit/Filter';
import Loading from '../components/IntroLogo2';

import { BarChart, LineChart, PieChart, RadarChart } from '../components/unit/Chart';

//이미지

import judgeImg01 from '../assets/images/evaluation/judge-img01.png';
import issueIcon from '../assets/images/icon/issue-opened.svg';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';




const EvaluationResults = () => {

  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
        <ContentWrap title="Result" border={false}>
          <Result/>
          <Btns/>
        </ContentWrap>
        <ContentWrap title="Full Evaluation">
          <FullEvaluation/>
        </ContentWrap>
        <ContentWrap title="Other Songs Evaluationed By This Critic">
          <SongsCritic/>
        </ContentWrap>
        <Btns/>
      </ContentWrap>
    </>
  );
};

export default EvaluationResults;


const Result = () => {

  return (
    <>
      <section className='result'>
        <article className='result__critic'>
          <p className='result__critic__title'>Critic</p>
          <img src={judgeImg01}/>
          <dl className='result__critic__txt'>
            <dt>"Soul first, sound second.”</dt>
            <dd>Jinwoo Yoo</dd>
          </dl>
        </article>
        <article className='result__graph'>
          <button className='result__graph__title'>Evaluation Graph<img src={issueIcon}/></button>
          <div className='result__graph__score'>
            <div className='result__graph__score__graph'>
              <RadarChart/>
            </div>
            <div className='result__graph__score__number'>
              <p className='result__graph__score__number__title'>
                Score:<span>80.00/100</span>
              </p>
              <div className='result__graph__score__number__txt'>
                <dl>
                  <dt>Emotional Impact :</dt>
                  <dd>12</dd>
                </dl>
                <dl>
                  <dt>Creativity & Individuality :</dt>
                  <dd>10</dd>
                </dl>
                <dl>
                  <dt>Structure & Composition :</dt>
                  <dd>80</dd>
                </dl>
                <dl>
                  <dt>Sound Quality & Mixing :</dt>
                  <dd>60</dd>
                </dl>
                <dl>
                  <dt>Relatability & Popularity :</dt>
                  <dd>80</dd>
                </dl>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};


const Btns = () => {

  return (
    <div className='btns'>
      <button
        className='rate-again'
      >Rate Again
      </button>
      <button
        className='save-evaluation'
      >Save Evaluation
      </button>
    </div>
  );
};


const FullEvaluation = () => {

  const [isActive, setIsActive] = useState(false);

  return (
    <div className='full-evaluation'>
      <section className='full-evaluation__feed-back'>
        <article className='full-evaluation__feed-back__human'>
          <img src={judgeImg01} alt='judgeImg01'/>
          <p className='full-evaluation__feed-back__human__title'>Jinwoo Yoo</p>
        </article>
        <article className={`full-evaluation__feed-back__txt ${isActive ? 'active' : ''}`}>
          <p className='ull-evaluation__feed-back__txt__title'>Feedback</p>
          <div className='ull-evaluation__feed-back__txt__memo'>
            This song conveys emotions well. The emotional explosion in the chorus is particularly impressive. However, adding more original elements could make it shine even more.
            This song conveys emotions well. The emotional explosion in the chorus is particularly impressive. However, adding more original elements could make it shine even more.
            This song conveys emotions well. The emotional explosion in the chorus is particularly impressive. However, adding more original elements could make it shine even more.
            This song conveys emotions well. The emotional explosion in the chorus is particularly impressive. However, adding more original elements could make it shine even more.
          </div>
          <button 
            className='full-evaluation__feed-back__txt__see-more'
            onClick={() => setIsActive(prev => !prev)}
          >
            See More
            <span></span>
          </button>
        </article>
      </section>
      <section className='full-evaluation__point-box'>
        <dl>
          <dt>To Improve</dt>
          <dd>Try to incorporate more personal experiences into the lyrics.</dd>
        </dl>
        <dl>
          <dt>Why This Score</dt>
          <dd>The rhythm fits very well with the lyrics.</dd>
        </dl>
        <dl>
          <dt>Key Points</dt>
          <dd>The chorus is very catchy.</dd>
        </dl>
      </section>
    </div>
  );
};



const SongsCritic = () => {


  return (
    <>
      <section className='critic-list'>
        <div className='critic-list__item'>
          <div className='critic-list__item__left'>
            <p className='critic-list__item__left__img'>
              <img src={judgeImg03}/>
            </p>
            <p className='critic-list__item__left__title'>Title / Artist</p>
          </div>
          <div className='critic-list__item__right'>
            <RadarChart/>
          </div>
        </div>
        <div className='critic-list__item'>
          <div className='critic-list__item__left'>
            <p className='critic-list__item__left__img'>
              <img src={judgeImg03}/>
            </p>
            <p className='critic-list__item__left__title'>Title / Artist</p>
          </div>
          <div className='critic-list__item__right'>
            <RadarChart/>
          </div>
        </div>
        <div className='critic-list__item'>
          <div className='critic-list__item__left'>
            <p className='critic-list__item__left__img'>
              <img src={judgeImg03}/>
            </p>
            <p className='critic-list__item__left__title'>Title / Artist</p>
          </div>
          <div className='critic-list__item__right'>
            <RadarChart/>
          </div>
        </div>
        <div className='critic-list__item'>
          <div className='critic-list__item__left'>
            <p className='critic-list__item__left__img'>
              <img src={judgeImg03}/>
            </p>
            <p className='critic-list__item__left__title'>Title / Artist</p>
          </div>
          <div className='critic-list__item__right'>
            <RadarChart/>
          </div>
        </div>


      </section>
    </>
  );
};


