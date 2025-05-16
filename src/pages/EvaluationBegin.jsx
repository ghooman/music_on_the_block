import React, { useEffect, useState, useContext } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationBegin.scss';
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/unit/Filter';
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


const EvaluationBegin = () => {


  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
        <ContentWrap title="Step 1" >
          <Step1/>
        </ContentWrap>
        <ContentWrap title="Step 2" border={false}>
          <Step2/>
        </ContentWrap>
        <ContentWrap title="Step 3" >
          <Step3/>
        </ContentWrap>
      </ContentWrap>
    </>
  );
};

export default EvaluationBegin;


const Step1 = () => {

  const dummySongIds = [101, 102, 103];
  return (
    <>
      <div className='step1'>
        <p className='step1__title'>
        Select your song.<br/>Click the song, then tap “Select” below to continue.
        </p>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <div className='step1__list'>
          {dummySongIds.map(id => (
            <SongsBar key={id} songId={id} />
          ))}
        </div>
        <button className='select-btn'>Select</button>
      </div>
    </>
  );
};

const Step2 = () => {
  
  const [activeIdx, setActiveIdx] = useState(null);

  const handleClick = idx => {
    setActiveIdx(prev => (prev === idx ? null : idx));
  };


  return (
    <>
      <div className='step2'>
        <p className='step2__title'>Choose your music critic.</p>
        <div className='step2__choose'>
          <button
            className={`step2__choose__item ${activeIdx === 0 ? 'active' : ''}`}
            onClick={() => handleClick(0)}
          >
            <img src={judgeImg01} alt='Jinwoo Yoo' />
            <dl className='step2__choose__item__title'>
              <dt>"<span>Soul</span> first, sound second.”</dt>
              <dd>Jinwoo Yoo</dd>
            </dl>
          </button>

          <button
            className={`step2__choose__item ${activeIdx === 1 ? 'active' : ''}`}
            onClick={() => handleClick(1)}
          >
            <img src={judgeImg02} alt='Drexx' />
            <dl className='step2__choose__item__title'>
              <dt>"No <span>flow?</span> No mercy. Off-beat? Game over."</dt>
              <dd>Drexx</dd>
            </dl>
          </button>

          <button
            className={`step2__choose__item ${activeIdx === 2 ? 'active' : ''}`}
            onClick={() => handleClick(2)}
          >
            <img src={judgeImg03} alt='Elara Moon' />
            <dl className='step2__choose__item__title'>
              <dt>"Between the <span>Melody</span>, she finds the truth."</dt>
              <dd>Elara Moon</dd>
            </dl>
          </button>
        </div>
      </div>
    </>
  );
};

const Step3 = () => {
  const dummySongIds = [100];
  return (
    <>
      <div className='step3'>
        <p className='step3__title'>
          Please review your selected options.<br />
          If you would like to proceed with these choices, click “View Results” at the bottom of the screen.
        </p>
        <div className='step3__selected-song'>
          <p className='step3__selected-song__title'>Selected Song</p>
          {dummySongIds.map(id => (
            <SongsBar key={id} songId={id} />
          ))}
          <dl className='step3__selected-song__critic'>
            <dt>Critic</dt>
            <dd>
              <p>Jinwoo Yoo</p>
              <span>Todays Left: <strong>1/1</strong></span>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

const BeginNowBtn = () => {

  return (
    <>
      <Link 
        to='/'
        className='begin-now-btn'
      >Begin Now
      </Link>
    </>
  );
};