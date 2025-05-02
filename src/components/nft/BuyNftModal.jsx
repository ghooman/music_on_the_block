import { useState } from 'react';
import ModalWrap from '../ModalWrap';

import './BuyNftModal.scss';

const BuyNftModal = ({ setBuyNftModal, nftData, selectedCollection }) => {
  const [agree, setAgree] = useState(false);

  const onClose = () => {
    setBuyNftModal(false);
  };

  const handleBuy = () => {
    if (!agree) return;
  };

  return (
    <ModalWrap title="Confirm buy NFT" onClose={onClose}>
      <div className="buy-nft-modal">
        <p className="buy-nft-modal__text">Buying "아이템 네임" transfers the NFT to your wallet</p>
        <ul className="buy-nft-modal__list">
          <li className="buy-nft-modal__list--item">Confirm buy : [아이템 네임]</li>
          <li className="buy-nft-modal__list--item">Price : 가격</li>
          <li className="buy-nft-modal__list--item">Network gas fees may apply</li>
        </ul>
        <label className="buy-nft-modal__checkbox-wrap">
          <input
            className="buy-nft-modal__checkbox"
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(prev => !prev)}
          />
          <p className="buy-nft-modal__checkbox--message">
            No refunds or cancellations after purchase
          </p>
        </label>
        <div className="buy-nft-modal__button-wrap">
          <button className="buy-nft-modal__button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="buy-nft-modal__button buy-button"
            onClick={handleBuy}
            disabled={!agree}
          >
            Buy NFT
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default BuyNftModal;
