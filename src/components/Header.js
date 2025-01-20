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
import Main from "../pages/Main";

//이미지
import logo from '../assets/images/miracle-logo.svg';



const Header = ({ setIsLoggedIn }) => {

  const location = useLocation();
  console.log("location", location.pathname.slice(1));
  const [clickMenu, setClickMenu] = useState(location.pathname.slice(1));

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <h1>
            <Link 
              to="https://apex.miracleplay.gg/"
              target="_b"
            ><img src={logo} alt="logo" />
            </Link>
          </h1>
          <div className="header-menu">
            <ul className="header-menu__ul">
              <li
                className={`header-menu__li  ${
                  clickMenu === "" ? "header-menu__li-clicked" : ""
                }`}
                onClick={() => {
                  setClickMenu("");
                }}
              >
                <Link to="/">EARN</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
};

export default Header;
