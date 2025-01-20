// components/NodeDashboard.js

import React, { useState } from 'react';
import './NodeDashboard.scss';
import noneIcon from '../../assets/images/none-icon.svg';
import Loading from '../Loading';
import NodeClaimModal from "../../components/NodeClaimModal";

const NodeDashboard = ({ }) => {

  const [isDeactivated, setIsDeactivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [claimedRows, setClaimedRows] = useState([]);
  const [currentClaimIndex, setCurrentClaimIndex] = useState(null);
  const [isLogin, setLogin] = useState(false);

  const rewardData = [
    {
      Weekly: "Weekly Reward Packet #1",
      Percent: 0,
      xMucQuantity: "1,696",
      ClaimLevel: "Level#0",
      Reward: false,
    },
    {
      Weekly: "Weekly Reward Packet #2",
      Percent: 20,
      xMucQuantity: "1,000",
      ClaimLevel: "Level#1 (25%)",
      Reward: true,
    },
    {
      Weekly: "Weekly Reward Packet #3",
      Percent: 60,
      xMucQuantity: "1,000",
      ClaimLevel: "Level#1 (50%)",
      Reward: true,
    },
    {
      Weekly: "Weekly Reward Packet #4",
      Percent: 80,
      xMucQuantity: "1,000",
      ClaimLevel: "Level#1 (75%)",
      Reward: true,
    },
    {
      Weekly: "Weekly Reward Packet #5",
      Percent: 100,
      xMucQuantity: "1,000",
      ClaimLevel: "Level#1 (100%)",
      Reward: false,
    },
  ];

  const handleClaim = (index) => {
    setCurrentClaimIndex(index);
    setOpenModal(true);
  };
  const handleModalClaim = () => {
    if (currentClaimIndex !== null) {
      setClaimedRows([...claimedRows, currentClaimIndex]);
      setOpenModal(false);
    }
  };

  return (
    <>
      <section className='node-dashboard'>
        <article className='node-dashboard__wallet'>
          <p className='node-dashboard__wallet__title'>Wallet Address</p>
          <div className='node-dashboard__wallet__view-box'>
            {isLogin && 
              <p className='node-dashboard__wallet__view-box__txt'>
                0x123abc456def789ghi012jkl345mno678pqr901stu
              </p>
            }
            {!isLogin && 
              <button type='button' className='login-btn'
                onClick={()=>setLogin(true)}
              >Login</button>
            }
          </div>
        </article>
        <article className='node-dashboard__license-key'>
          <p className='node-dashboard__license-key__title'>license Key</p>
          {!isLogin &&
            <p className='none-box'>
              No Information
            </p>
          }
          {isLogin &&
            <div className='node-dashboard__license-key__running-box'>
              <p className='node-dashboard__license-key__running-box__view'>
                0x123abc456def789ghi012jkl345mno678pqr901stu
              </p>
              <p className='node-dashboard__license-key____running-box__running-txt'>Running</p>
            </div>
          }
        </article>
        <article className='node-dashboard__quantity'>
          <p className='node-dashboard__quantity__title'>Quantity</p>
          {!isLogin &&
            <p className='none-box'>
              No Information
            </p>
          }
          {isLogin && 
            <div className='node-dashboard__quantity__list'>
              <div className='node-dashboard__quantity__list__item'>
                <dl className='node-dashboard__quantity__list__item__title'>
                  <dt>Section #1</dt>
                  <dd>1,000</dd>
                </dl>
                <p className='node-dashboard__quantity__list__item__quantity'>Node Quantity</p>
              </div>
              <div className='node-dashboard__quantity__list__item'>
                <dl className='node-dashboard__quantity__list__item__title'>
                  <dt>Section #2</dt>
                  <dd>38</dd>
                </dl>
                <p className='node-dashboard__quantity__list__item__quantity'>Node Quantity</p>
              </div>
              <div className='node-dashboard__quantity__list__item'>
                <dl className='node-dashboard__quantity__list__item__title'>
                  <dt>Section #3</dt>
                  <dd>130</dd>
                </dl>
                <p className='node-dashboard__quantity__list__item__quantity'>Node Quantity</p>
              </div>
            </div>          
          }

        </article>
        <article className='node-dashboard__reward'>
          <p className='node-dashboard__reward__title'>Node Reward</p>
          {!isLogin &&
            <p className='none-box'>
              Please Connect Your Wallet
            </p>
          }
          {isLogin && 
            <div className="node-dashboard__reward__list">
              <table className="node-dashboard__reward__list__table">
                <thead>
                  <tr>
                    <th>Weekly Reward Packet</th>
                    <th>Reward Percent </th>
                    <th>Node Quantity</th>
                    <th>Claim Level </th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardData.map((row, index) => (
                    <tr
                      key={index}
                      // className={claimedRows.includes(index) ? "claim" : ""}
                      className={
                        claimedRows.includes(index) ||
                        index === rewardData.length - 1
                          ? "claim"
                          : ""
                      } //마지막tr만 claim 클래스 추가
                    >
                      <td>{row.Weekly}</td>
                      <td>
                        <div className="progress-bar">
                          <p
                            className="progress-bar__value"
                            style={{ width: `${row.Percent}%` }}
                          ></p>
                        </div>
                      </td>
                      <td>
                        <p>{row.xMucQuantity}</p>
                      </td>
                      <td>{row.ClaimLevel}</td>
                      <td>
                        <button
                          className={`claim-btn ${isDeactivated ? "deactivate" : ""}`}
                          onClick={() => handleClaim(index)}
                        >
                          {!loading && 
                            <>Claim</>
                          }
                          {loading&&
                            <Loading/>
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }

        </article>
      </section>
      
      {openModal && (
        <NodeClaimModal
          setOpenModal={setOpenModal}
          handleModalClaim={handleModalClaim}
        />
      )}
    </>
  );
};

export default NodeDashboard;
