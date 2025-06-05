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
import Timer from '../components/get/Timer';



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
          <Link to='/get/detail' className="get__content__item">
            <div className='get__content__item__day-mob'>
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className='get__content__item__mob'>
              <dt>Total Reward(MOB)</dt>
              <dd>
                <p>100,000</p>
              </dd>
            </dl>
            <dl className='get__content__item__minutes'>
              <dt>
                Updated Every 30 Minutes
                <span>Total Geted MIC</span>
              </dt>
              <dd>
                100,000
              </dd>
            </dl>
            <dl className='get__content__item__start-time'>
              <dt>
                Start Time
              </dt>
              <dd>
                Sat, 04 Nov 2023 14:40:00 UTC+9
              </dd>
            </dl>
            <dl className='get__content__item__remaining-time'>
              <dt>
                Remaining Time
              </dt>
              <dd>
              <Timer 
                fontSize={18} 
                color={'#00FFB3'} 
                fontFamily={'Inter700'} 
                textWidth={10}
                />
              </dd>
            </dl>
          </Link>
          <Link to='/get/detail' className="get__content__item">
            <div className='get__content__item__day-mob'>
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className='get__content__item__mob'>
              <dt>Total Reward(MOB)</dt>
              <dd>
                <p>Basic Reward 30,000</p> + <span>Revenue Share 20,000</span>
              </dd>
            </dl>
            <dl className='get__content__item__minutes'>
              <dt>
                Updated Every 30 Minutes
                <span>Total Geted MIC</span>
              </dt>
              <dd>
                100,000
              </dd>
            </dl>
            <dl className='get__content__item__start-time'>
              <dt>
                Start Time
              </dt>
              <dd>
                Sat, 04 Nov 2023 14:40:00 UTC+9
              </dd>
            </dl>
            <dl className='get__content__item__remaining-time'>
              <dt>
                Remaining Time
              </dt>
              <dd>
              <Timer 
                fontSize={18} 
                color={'#00FFB3'} 
                fontFamily={'Inter700'} 
                textWidth={10}
                />
              </dd>
            </dl>
          </Link>
          <Link to='/get/detail' className="get__content__item">
            <div className='get__content__item__day-mob'>
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className='get__content__item__mob'>
              <dt>Total Reward(MOB)</dt>
              <dd>
                <p>Basic Reward 30,000</p> + <span>Revenue Share 20,000</span>
              </dd>
            </dl>
            <dl className='get__content__item__minutes'>
              <dt>
                Updated Every 30 Minutes
                <span>Total Geted MIC</span>
              </dt>
              <dd>
                100,000
              </dd>
            </dl>
            <dl className='get__content__item__start-time'>
              <dt>
                Start Time
              </dt>
              <dd>
                Sat, 04 Nov 2023 14:40:00 UTC+9
              </dd>
            </dl>
            <dl className='get__content__item__remaining-time'>
              <dt>
                Remaining Time
              </dt>
              <dd>
              <Timer 
                fontSize={18} 
                color={'#00FFB3'} 
                fontFamily={'Inter700'} 
                textWidth={10}
                />
              </dd>
            </dl>
          </Link>
          <Link to='/get/detail' className="get__content__item none-item">
            <p className='get__content__item__none-title'>
              Get the Pool in Preparation
            </p>
          </Link>
        </section>
      </div>
    </>
    
  );
}

export default Get;




