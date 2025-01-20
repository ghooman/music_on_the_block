// components/NodeActivation.js

import React, { useState } from 'react';
import './NodeActivation.scss';
// import questionIcon from '../../assets/images/earn/question-mark-icon.svg';
import Loading from '../Loading';


const NodeActivation = ({ }) => {

  const [isActivationLoading,setActivationLoading] = useState(false)
  const [isDeactivationLoading,setDeactivationLoading] = useState(false)

  return (
    <>
      <article className='get-started'>
        <p className='get-started__title'>Get Started</p>
        <div className='get-started__list'>
          <div className='get-started__list__item'>
            <p className='get-started__list__item__number'>1</p>
            <dl className='get-started__list__item__txt'>
              <dt>Connect Wallet</dt>
              <dd>
                Connect your Web3 wallet to access your NFTs. Make sure you are connected to the correct network.
                <ul>
                  <li>•Click the “Login” button</li>
                  <li>•Select your preferred wallet (MetaMask, etc.)</li>
                  <li>•Confirm the connection request</li>
                </ul>
              </dd>
            </dl>
          </div>
          <div className='get-started__list__item'>
            <p className='get-started__list__item__number'>2</p>
            <dl className='get-started__list__item__txt'>
              <dt>Activate Node</dt>
              <dd>
                Choose the NFTs you want to activate as nodes. The entire balance will be escrowed.
                <ul>
                  <li>•View your available NFTs</li>
                  <li>•Select the NFT type you wish to escrow</li>
                  <li>•Confirm your selection</li>
                </ul>
              </dd>
            </dl>
          </div>
          <div className='get-started__list__item'>
            <p className='get-started__list__item__number'>3</p>
            <dl className='get-started__list__item__txt'>
              <dt>Receive Node every month</dt>
              <dd>
                Approve the contract interaction and confirm the escrow transaction.
                <ul>
                  <li>•Approve contract access to your NFTs</li>
                  <li>•Confirm the escrow transaction</li>
                  <li>•Wait for transaction confirmation</li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </article>
      <article  className='node-key'>
        <p className='node-key__title'>Owned Node Key</p>
        <div className='node-key__section'>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #1</dt>
              <dd>1,000</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #2</dt>
              <dd>27</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #3</dt>
              <dd>518</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
        </div>
        <button type='button' className='activation'>
          {!isActivationLoading &&<>Activation</>}
          {isActivationLoading &&<Loading/>}
        </button>
      </article>
      <article  className='node-key'>
        <p className='node-key__title'>Escrowed Node Key</p>
        <div className='node-key__section'>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #1</dt>
              <dd>0</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #2</dt>
              <dd>0</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
          <div className='node-key__section__item'>
            <dl className='node-key__section__item__title'>
              <dt>Section #3</dt>
              <dd>0</dd>
            </dl>
            <p className='node-key__section__item__quantity'>Node Quantity</p>
          </div>
        </div>
        <button type='button' className='deactivation'>
          {!isDeactivationLoading &&<>Deactivation</>}
          {isDeactivationLoading &&<Loading/>}
        </button>
      </article>
    </>
  );
};

export default NodeActivation;
