import React, { useState } from "react";
import "./AlarmModal.scss";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from "react-router-dom";

//이미지
import mainLogo from "../assets/images/header/logo.svg";
import closeIcon from "../assets/images/close.svg";


const AlarmModal = ({  }) => {

  const [loading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleOverlayClick = () => {
    setIsClosed(false); // active 클래스 제거
  };

  return (
    <>

      <div className={`alarm__modal ${isClosed ? "active" : ""}`}>
        <div className="alarm__modal__item">
          <button className="alarm__modal__item__closed"
            onClick={handleClose} 
          >
            <img src={closeIcon} />
          </button>
          <p className="alarm__modal__item__title">ALARM</p>
          <p className="alarm__modal__item__txt">
            AI song is currently being generated
          </p>

          {loading ? (
            <div className="middle2">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
              <div className="bar bar5"></div>
              <div className="bar bar6"></div>
              <div className="bar bar7"></div>
              <div className="bar bar8"></div>
            </div>
          ) : (
            <Link className="alarm__modal__item__link" to="/">
              My Song Link
            </Link>
          )}
        </div>
      </div>

      <div
        className={`alarm__modal__arr ${isClosed ? "active" : ""}`}
        onClick={handleOverlayClick}
      ></div>
      
    </>
  );
};

export default AlarmModal;
