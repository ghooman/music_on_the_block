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
import judgeImg02 from '../assets/images/evaluation/judge-img02.png';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';




const EvaluationResults = () => {

  const aiServiceChartData = [
    {
      id: 'AI Lyrics & Songwriting',
      value: 10,
      color: 'hsl(252, 100%, 50%)',
      preparing: false,
      image: judgeImg02,
    },

  ];

  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
        <ContentWrap title="Result">
          <Result/>
          <RadarChart
          />
        </ContentWrap>

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
          <button className='result__graph__title'>Evaluation Graph</button>
        </article>
      </section>
    </>
  );
};


const ViewResults = () => {

  return (
    <>
      <Link 
        to='/evaluation-results'
        className='view-results'
      >View Results
      </Link>
    </>
  );
};