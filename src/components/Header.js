import React, { useState } from "react";
import "./Header.scss";
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
import Album from "../pages/Album";

//이미지
import mainLogo from '../assets/images/header/logo.svg';
import Menu from "./Menu";



const Header = ({ setIsLoggedIn }) => {

  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div className="header">
        <div className="header__inner">
          {/* <label class="hamburger">
            <input type="checkbox" />
            <svg viewBox="0 0 32 32">
              <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
              <path class="line" d="M7 16 27 16"></path>
            </svg>
          </label> */}
          <button className={`menu-btn ${isActive ? "active" : ""}`} onClick={handleClick}>
            <svg viewBox="0 0 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </button>

          <h1>
            <Link
              to='/'
            >
              <img src={mainLogo} className="logo"/>
              <div className="text-box">
                <div className="text-wrap">
                  <svg width={300} height={30} viewBox="0 0 300 30">
                    <text x="0" y="90%">M</text>
                    <text x="22" y="90%">U</text>
                    <text x="42" y="90%">S</text>
                    <text x="62" y="90%">I</text>
                    <text x="70" y="90%">C</text>
                    <text x="96" y="90%">O</text>
                    <text x="116" y="90%">N</text>
                  </svg>
                  <svg width={300} height={30} viewBox="0 0 300 30">
                    <text x="0" y="60%">T</text>
                    <text x="18" y="60%">H</text>
                    <text x="38" y="60%">E</text>
                    <text x="64" y="60%">B</text>
                    <text x="84" y="60%">L</text>
                    <text x="104" y="60%">O</text>
                    <text x="124" y="60%">C</text>
                    <text x="144" y="60%">K</text>
                  </svg>
                </div>
              </div>
            </Link>
          </h1>
        </div>
      </div>

      <Menu/>

      <Routes>
        <Route path="/" element={<Album />} />
      </Routes>
    </>
  );
};

export default Header;
