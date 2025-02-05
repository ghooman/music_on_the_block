import React, { useState } from "react";
import "./Menu.scss";
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
import levelIcon from '../assets/images/menu/level-icon.svg';
import userImg from '../assets/images/intro/intro-demo-img2.png';
import copyIcon from '../assets/images/menu/content-copy-icon.svg';



const Menu = ({ }) => {

  const [isActive, setIsActive] = useState(false);


  return (
    <>
      <div className="menu">
        <dl className="menu__box">
          <dt className="menu__box__title">My Pg</dt>
          <dd>
            <div className="menu__box__my-page">
              <div className="menu__box__my-page__level">
                <p className="menu__box__my-page__level__img">
                  <img src={levelIcon}/>
                </p>
                <p className="number">10</p>
                <p className="level">Level</p>
              </div>
              <div className="menu__box__my-page__info">
                <div className="menu__box__my-page__info__top">
                  <p className="menu__box__my-page__info__top__img"
                    style={{
                      backgroundImage: `url(${userImg})`,
                    }}
                  >
                  </p>
                  <dl className="menu__box__my-page__info__top__txt">
                    <dt>
                      0xF2D...45
                      <button>
                        <img src={copyIcon}/>
                      </button>
                    </dt>
                    <dd>
                      Yolkhead_12142
                    </dd>
                  </dl>
                </div>
                <div className="menu__box__my-page__info__bottom">
                  <div className="menu__box__my-page__info__bottom__box">
                    <p>100</p><span>MOB</span>
                  </div>
                  <div className="menu__box__my-page__info__bottom__box">
                    <p>45,345</p><span>EXP</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="menu__box__log-out-btn">Log Out</button>
          </dd>
        </dl>
        <dl className="menu__box">
          <dt className="menu__box__title">MENU</dt>
          <dd>
            <div className="menu__box__gnb-list">
              <div className="menu__box__gnb-list__item ai-services">
                <button className="menu__box__gnb-list__item__btn">
                  <p className="icon"></p>AI Services
                </button>
              </div>
            </div>
          </dd>
        </dl>
      </div>
    </>
  );
};

export default Menu;
