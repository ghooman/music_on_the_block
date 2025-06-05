import '../styles/Get.scss';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import coverImg10 from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/album/love-icon.svg';
import halfHeartIcon from '../assets/images/icon/half-heart.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import persona01 from '../assets/images/evaluation/persona-all-bg.png';
import songCreateIcon1 from '../assets/images/album/song-create-icon1.svg';
import songCreateIcon2 from '../assets/images/album/song-create-icon2.svg';
import songCreateIcon3 from '../assets/images/album/song-create-icon3.svg';

import PreparingModal from '../components/PreparingModal';



function Get() {
  const { t } = useTranslation('get');



  return (
    
    <>
      <div className="get">
        <section className="get__header">
          <dl className="get__header__title">
            <dt>Get Race</dt>
            <dd>
              Join the competition by burning your reward tokens earned from tournaments — and unlock new value along the way!
            </dd>
          </dl>
        </section>
        <section className="get__content">
          <article className="get__content__item">
            <dl className='set__content__item__mob'>
              <dt>Total Reward(MOB)</dt>
              <dd>
              Basic Reward 30,000 + 
              </dd>
            </dl>
          </article>
        </section>
      </div>
    </>
    
  );
}

export default Get;




