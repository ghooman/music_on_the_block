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


const EvaluationBegin = () => {


  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
        <ContentWrap title="Step 1" >
          <Step1/>
        </ContentWrap>
      </ContentWrap>
    </>
  );
};

export default EvaluationBegin;


const Step1 = () => {

  return (
    <>
      <div className='step1'>
        <p className='step1__title'>
        Select your song.<br/>Click the song, then tap “Select” below to continue.
        </p>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <div className='step1__list'>
          
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