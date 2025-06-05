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




function EvaluationStage() {
  const { t } = useTranslation('evaluation');


  return (
    
    <>
      <div className='evaluation-stage'>

      </div>
    </>
    
  );
}

export default EvaluationStage;




