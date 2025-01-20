import "../styles/Main.scss";
import React, { useEffect, useRef, useState } from "react";

// 이미지
// import pass_img from "../assets/images/pass-img.png";


import { Link } from "react-router-dom";

import NodeActivation from '../components/earn/NodeActivation';
import NodeDashboard from '../components/earn/NodeDashboard';


function Main({ setClickMenu }) {

  const [activeTab, setActiveTab] = useState('Activation');

  return (
    <div className="main">
      <div className="main__inner">
        <div className="earn__tab">
          <button
            className={`earn__tab__item ${activeTab === 'Activation' ? 'active' : ''}`}
            onClick={() => setActiveTab('Activation')}
          >
            Node Activation
          </button>
          <button
            className={`earn__tab__item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            Node Dashboard
          </button>
        </div>
        <div className="earn__tab-list">
          {activeTab === 'Activation' && <NodeActivation />}
          {activeTab === 'Dashboard' && <NodeDashboard />}
        </div>
      </div>
    </div>
  );
}

export default Main;
