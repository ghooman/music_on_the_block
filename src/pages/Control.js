import React, { useState } from "react";
import "../styles/Control.scss";
import dummyImg from "../assets/images/dummy.png";
import dummyImg2 from "../assets/images/dummy2.png";
import dropDownIcon from "../assets/images/red-down-arrow.svg";
const Control = () => {
  return (
    <div className="control-background">
      <di className="control__container">
        <div className="container__left-box">
          <div className="left-box__title">
            <span className="title__left">세븐일레븐 사당점</span>
            <div className="title__right">
              <div className="title-right__icon"></div>2023.01.17 16:57
            </div>
          </div>
          <div className="left-box__video">
            <img src={dummyImg2} alt="img" />
          </div>
        </div>
        <div className="container__right-box">
          <div className="right-box__drop">
            <span>점포명</span>
            <div className="drop-down__box">
              <button>
                세븐일레븐 강남점
                <img src={dropDownIcon} alt="dropdownIcon" />
              </button>
            </div>
            {/* <ul className="drop-box__list">
              <li>GTX A2 점포</li>
            </ul> */}
          </div>

          <div className="right-box__item">
            <img src={dummyImg} alt="img" />
            <div className="item__title">
              <span>세븐일레븐 신포점</span>
              <span>
                REC<div className="title__icon"></div>
              </span>
            </div>
          </div>
          <div className="right-box__item">
            <img src={dummyImg} alt="img" />
            <div className="item__title">
              <span>세븐일레븐 논현점</span>
              <span>
                REC<div className="title__icon"></div>
              </span>
            </div>
          </div>
          <div className="right-box__item">
            <img src={dummyImg} alt="img" />
            <div className="item__title">
              <span>세븐일레븐 명동점</span>
              <span>
                REC <div className="title__icon"></div>
              </span>
            </div>
          </div>
          <div className="right-box__item">
            <img src={dummyImg} alt="img" />
            <div className="item__title">
              <span>세븐일레븐 홍대역점</span>
              <span>
                REC<div className="title__icon"></div>
              </span>
            </div>
          </div>
        </div>
      </di>
    </div>
  );
};

export default Control;
