import React, { useRef, useState, useMemo } from "react";
import "./Loading.scss";

import loadingImg from "../assets/images/loading-img.gif";



const CreateLoading = ({textTrue,textTrue2}) => {

  return (
    <>
      <div className="loading-wrap">
        <div className="middle">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
          <div className="bar bar3"></div>
          <div className="bar bar4"></div>
          <div className="bar bar5"></div>
          <div className="bar bar6"></div>
          <div className="bar bar7"></div>
          <div className="bar bar8"></div>
        </div>
        {textTrue &&
          <p className="middle__title">Song Lyrics In Progress</p>
        }
        {textTrue2 &&
          <p className="middle__title">Lyrics In progress</p>
        }
      </div>

      <p className="middle__bg"></p>

      
    </>
  );
};

export default CreateLoading;


