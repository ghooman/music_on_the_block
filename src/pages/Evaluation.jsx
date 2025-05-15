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

const Evaluation = () => {


  return (
    <>
      <ContentWrap title="AI Song Evaluation" border={false} className="Evaluation">
        <ContentWrap title="Why Join The Evaluation?" border={false}>
          <JoinEvaluation/>
        </ContentWrap>
      </ContentWrap>
    </>
  );
};

export default Evaluation;





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
