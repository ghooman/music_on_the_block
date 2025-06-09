import React, { useState, useRef, useEffect } from 'react';
import './IntroLogo2.scss';
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from 'react-router-dom';
// import LogoHansung from "../assets/images/";

import mainLogo from '../assets/images/header/logo-png.png';

const IntroLogo = ({ autoClose, isLoading }) => {
  return (
    <>
      <div
        className={`intro-logo2 ${!isLoading ? 'loading-screen' : ''} ${
          autoClose ? 'auto-close' : ''
        }`}
      >
        <img className="intro-logo2__image" src={mainLogo} alt="logo" />
      </div>
    </>
  );
};

export default IntroLogo;
