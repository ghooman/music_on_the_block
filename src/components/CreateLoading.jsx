import React, { useRef, useState, useMemo } from "react";
import "./Loading.scss";

import loadingImg from "../assets/images/loading-img.gif";



const CreateLoading = ({textTrue}) => {

  return (
    <>
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
      <p className="middle__bg"></p>
      {textTrue &&
        <p className="middle__title">music generation takes at least 3 minutes</p>
      }
      
    </>
  );
};

export default CreateLoading;


