import { useState } from 'react';
import ModalWrap from '../ModalWrap';

import './BuyNftModal.scss';

const BuyNftModal = () => {
  const [agree, setAgree] = useState(false);

  return (
    <ModalWrap title="Confirm buy NFT">
      <div className="buy-nft-modal">
        <p className="buy-nft-modal__text">Buying "아이템 네임" transfers the NFT to your wallet</p>
        <ul className="buy-nft-modal__list">
          <li className="buy-nft-modal__list--item">Confirm buy : [아이템 네임]</li>
          <li className="buy-nft-modal__list--item">Price : 가격</li>
          <li className="buy-nft-modal__list--item">Network gas fees may apply</li>
        </ul>
        <div className="buy-nft-modal__checkbox-wrap">
          <input className="buy-nft-modal__checkbox" type="checkbox" />
          <p className="buy-nft-modal__checkbox--message">
            No refunds or cancellations after purchase
          </p>
        </div>
        <div className="buy-nft-modal__button-wrap">
          <button className="buy-nft-modal__button">Cancel</button>
          <button className="buy-nft-modal__button">Buy NFT</button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default BuyNftModal;
