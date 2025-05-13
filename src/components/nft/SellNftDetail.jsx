import './MintNftDetail.scss';
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import 'react-h5-audio-player/lib/styles.css';
import ContentWrap from '../unit/ContentWrap';

// 이미지·아이콘 ------------------------------------------------------
import micIcon from '../../assets/images/icon/mic-icon.svg';
import mobIcon from '../../assets/images/icon/mob-icon.svg';
import polygonIcon from '../../assets/images/icon/polygon-icon.svg';
import usdtIcon from '../../assets/images/icon/usdt-icon.svg';
import usdcIcon from '../../assets/images/icon/usdc-icon.svg';

import NftConfirmModal from '../NftConfirmModal';
import SongsBar from '../unit/SongsBar';
import { ethers, parseUnits } from 'ethers';
import { getSongsGradeIcon } from '../../utils/getGradeIcon';

const serverApi = process.env.REACT_APP_SERVER_API;
// ────────────────────────────────
function MintNftSellDetail2() {
  const { id, nft_id } = useParams(); // id : 앨범 id, nft_id : nft id
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const [isActive, setIsActive] = useState(false); // track active state for the title
  const [sellPrice, setSellPrice] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState({ name: 'MOB', icon: mobIcon }); // default coin

  const navigate = useNavigate();

  const handleTitleClick = () => {
    setIsActive(prev => !prev); // toggle active class
  };
  const handleCoinClick = (coinName, coinIcon) => {
    setSelectedCoin({ name: coinName, icon: coinIcon }); // update title with selected coin
    setIsActive(false); // remove active class
  };

  const {
    data: nftInfo,
    isLoading,
    refetch,
  } = useQuery(
    ['nft_info', { id, nft_id }],
    async () => {
      const res = await axios.get(`${serverApi}/api/nfts/${nft_id}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    { refetchOnMount: false }
  );
  console.log('nftInfo', nftInfo);

  const getDecimalsBySymbol = symbol => {
    switch (symbol.toUpperCase()) {
      case 'USDT':
      case 'USDC':
        return 6;
      default:
        return 18;
    }
  };

  let sellPriceInWei;
  try {
    const decimals = getDecimalsBySymbol(selectedCoin.name);
    sellPriceInWei = parseUnits((sellPrice || '0').toString(), decimals);
  } catch (error) {
    console.error('Failed to convert sellPrice to Wei:', error);
    sellPriceInWei = parseUnits('0', 18);
  }

  console.log('sellPriceInWei', sellPriceInWei);

  // 금액 입력함수 숫자만 소수점 4자리까지 입력
  const handleSellPriceChange = e => {
    const value = e.target.value;
    const regex = /^[0-9]*(\.[0-9]{0,4})?$/;
    if (regex.test(value)) {
      setSellPrice(value);
    }
  };

  return (
    <>
      <div className="mint-detail">
        <dl className="album-detail__title">
          <dt>Sell NFT</dt>
        </dl>

        <SongsBar songId={nftInfo?.data?.song_id} />

        <ContentWrap title="Set NFT sell conditions">
          <div className="level-quantity-box">
            <dl className="level-quantity-box__dl">
              <dt>Grade of NFT</dt>
              <dd>
                <div className="level-quantity-box__grade">
                  {getSongsGradeIcon(nftInfo?.data?.rating) && (
                    <img src={getSongsGradeIcon(nftInfo?.data?.rating)} alt="grade" />
                  )}
                  {nftInfo?.data?.rating}
                </div>
              </dd>
            </dl>
            <dl className="level-quantity-box__dl">
              <dt>Quantity</dt>
              <dd>1</dd>
            </dl>
            <dl className="level-quantity-box__dl">
              <dt>Cumulative MIC earned</dt>
              <dd>
                <p>
                  0 <span>($ 0)</span>
                </p>
                <div className="mic">
                  <img src={micIcon} alt="mic-icon" />
                  MIC
                </div>
              </dd>
            </dl>
          </div>
          <div className="sell-nft-input-box__cover">
            <div className="sell-nft-input-box">
              <p className="sell-nft-input-box__title">Sell price</p>
              <div className="sell-nft-input-box__value">
                <input
                  placeholder="How much will you sell each NFT for? (e.g. 0.05)"
                  value={sellPrice}
                  onChange={handleSellPriceChange}
                  type="number"
                />
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
        <button
          className={`sell-btn ${sellPrice === 0 || !sellPrice ? 'disabled' : ''}`}
          onClick={() => setShowModal(true)}
          disabled={sellPrice === 0 || !sellPrice}
        >
          Sell
        </button>
      </div>
      {showModal && (
        <NftConfirmModal
          setShowModal={setShowModal}
          title="Confirm"
          nftName={nftInfo?.data?.nft_name}
          confirmSellTxt={true}
          sellPrice={sellPrice}
          sellPriceInWei={sellPriceInWei}
          selectedCoin={selectedCoin}
          thirdwebId={nftInfo?.data?.thirdweb_id}
          listingId={nftInfo?.data?.listing_id}
          // onSuccess={() => navigate('/my-page?category=NFT+MarketPlace&page=1&nft_filter=Listed')}
        />
      )}
    </>
  );
}

export default MintNftSellDetail2;
