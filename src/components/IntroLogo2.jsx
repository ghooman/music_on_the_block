import React, { useState, useRef, useEffect } from "react";
import "./IntroLogo2.scss";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from "react-router-dom";
// import LogoHansung from "../assets/images/";


import mainLogo from "../assets/images/header/logo.svg";



const IntroLogo = ({ setIsLoggedIn }) => {



  return (
    <>
    <div className="intro-logo2">
      <img src={mainLogo} alt="main logo" />
    </div>
    </>
  );
};

export default IntroLogo;
