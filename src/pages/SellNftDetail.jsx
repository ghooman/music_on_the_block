import '../styles/MintNftSellDetail.scss';
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'react-h5-audio-player/lib/styles.css';
import ContentWrap from '../components/unit/ContentWrap';

// 이미지·아이콘 ------------------------------------------------------
import micIcon from '../assets/images/icon/mic-icon.svg';
import mobIcon from '../assets/images/icon/mob-icon.svg';
import polygonIcon from '../assets/images/icon/polygon-icon.svg';
import usdtIcon from '../assets/images/icon/usdt-icon.svg';
import usdcIcon from '../assets/images/icon/usdc-icon.svg';

// import MintDetailSection from '../components/mint-nft-details/MintDetailSection';
import NftConfirmModal from '../components/NftConfirmModal';
import NftConfirmSuccessModal from '../components/NftConfirmSuccessModal';
import SongsBar from '../components/unit/SongsBar';

// // ──────────────── 더미 데이터 ────────────────
// const album = {
//     title:              'he dances through his masks like breathing - Yolkhead',
//     music_url:          track1,
//     cover_image:        coverImg,
//     detail:             'This is a dummy song for UI layout only.',
//     language:           'English',
//     genre:              'Pop',
//     gender:             'Any',
//     musical_instrument: 'Guitar',
//     tempo:              '120 BPM',
//     create_dt:          '2025‑04‑22',
//     name:               'Dummy Artist',
//     user_profile:       defaultCoverImg,
//     play_cnt:           123,
//     like:               45,
//     comment_cnt:        6,
//     lyrics:             `# Verse 1
//     This is **dummy** lyrics.
//     [Chorus] Sing along!`,
// };

// const tagArray          = ['Pop', 'Bright', 'Happy'];
// const albumDuration     = '3:02';

// ────────────────────────────────
function MintNftSellDetail2() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isActive, setIsActive] = useState(false); // track active state for the title
  const [selectedCoin, setSelectedCoin] = useState({ name: 'MOB', icon: mobIcon }); // default coin
  const handleTitleClick = () => {
    setIsActive(prev => !prev); // toggle active class
  };
  const handleCoinClick = (coinName, coinIcon) => {
    setSelectedCoin({ name: coinName, icon: coinIcon }); // update title with selected coin
    setIsActive(false); // remove active class
  };

  return (
    <>
      <div className="mint-detail">
        <dl className="album-detail__title">
          <dt>Sell NFT</dt>
          {/* <dd>Lyrics + Songwriting (Demo)</dd> */}
        </dl>

        <SongsBar />

        <ContentWrap title="Set NFT sell conditions">
          <div className="level-quantity-box">
            <dl className="level-quantity-box__dl">
              <dt>Level of NFT</dt>
              <dd>1</dd>
            </dl>
            <dl className="level-quantity-box__dl">
              <dt>Quantity</dt>
              <dd>1</dd>
            </dl>
            <dl className="level-quantity-box__dl">
              <dt>Cumulative MIC earned</dt>
              <dd>
                <p>
                  1,234 <span>($1,000)</span>
                </p>
                <div className="mic">
                  <img src={micIcon} alt="mic-icon" />
                  MIC
                </div>
              </dd>
            </dl>
          </div>
          {/* <div className='sell-nft-input-box'>
                        <p className='sell-nft-input-box__title'>Cumulative MIC earned</p>
                        <div className='sell-nft-input-box__value'>
                            <input placeholder='1,234 (=$1,000)' />
                            <button className='sell-nft-input-box__value__btn'><img src={micIcon} alt='mic-icon'/>MIC</button>
                        </div>
                    </div> */}
          <div className="sell-nft-input-box__cover">
            <div className="sell-nft-input-box">
              <p className="sell-nft-input-box__title">Sell price</p>
              <div className="sell-nft-input-box__value">
                <input placeholder="How much will you sell each NFT for? (e.g. 0.05)" />
                {/* <button className='sell-nft-input-box__value__btn'><img src={mobIcon} alt='mic-icon'/>MOB</button> */}
              </div>
            </div>
            <div className="sell-nft-select-box">
              <p className="sell-nft-select-box__title">Select token</p>
              <div className={`sell-nft-select-box__value-box ${isActive ? 'active' : ''}`}>
                <p className={`sell-nft-select-box__value-box__title `} onClick={handleTitleClick}>
                  <img src={selectedCoin.icon} alt={selectedCoin.name} />
                  {selectedCoin.name}
                </p>
                <ul className="sell-nft-select-box__value-box__list">
                  <li onClick={() => handleCoinClick('MOB', mobIcon)}>
                    <img src={mobIcon} alt="MOB" /> MOB
                  </li>
                  <li onClick={() => handleCoinClick('POL', polygonIcon)}>
                    <img src={polygonIcon} alt="POL" /> POL
                  </li>
                  <li onClick={() => handleCoinClick('USDT', usdtIcon)}>
                    <img src={usdtIcon} alt="USDT" /> USDT
                  </li>
                  <li onClick={() => handleCoinClick('USDC', usdcIcon)}>
                    <img src={usdcIcon} alt="USDC" /> USDC
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ContentWrap>
        <button className="sell-btn" onClick={() => setShowModal(true)}>
          Sell
        </button>
      </div>
      {showModal && (
        <NftConfirmModal
          setShowModal={setShowModal}
          setShowSuccessModal={setShowSuccessModal}
          title="Confirm Sell"
          confirmSellTxt={true}
        />
      )}
      {showSuccessModal && (
        <NftConfirmSuccessModal
          setShowSuccessModal={setShowSuccessModal}
          title="Your NFT has been listed for sale!"
        />
      )}
    </>
  );
}

export default MintNftSellDetail2;
