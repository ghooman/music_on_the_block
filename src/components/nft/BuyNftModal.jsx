import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ModalWrap from '../ModalWrap';
import { useBuyFromListing } from '../../hooks/useBuyFromListing';
import './BuyNftModal.scss';
import axios from 'axios';
import ErrorModal from '../modal/ErrorModal';
import {
  MOB_CONTRACT_ADDRESS,
  POL_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
} from '../../contract/contractAddresses';
const BuyNftModal = ({ setBuyNftModal, nftData, selectedCollection }) => {
  const buyFromListing = useBuyFromListing();
  const { token } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  console.log('nftData', nftData);
  console.log('selectedCollection', selectedCollection);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onClose = () => {
    setBuyNftModal(false);
  };
  const ContractAddress = () => {
    switch (nftData?.sales_token) {
      case 'MOB':
        return MOB_CONTRACT_ADDRESS;
      case 'POL':
        return POL_CONTRACT_ADDRESS;
      case 'USDT':
        return USDT_CONTRACT_ADDRESS;
      case 'USDC':
        return USDC_CONTRACT_ADDRESS;
      default:
        return null;
    }
  };
  const currencyAddress = ContractAddress();
  // 서버에 구매 요청 보내는 함수

  const handleServerBuy = async tx_id => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/${nftData?.listing_id}/${selectedCollection?.id}/purchase?tx_id=${tx_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('serverResponse', response);
      return response;
    } catch (error) {
      console.error('Error during buy from listing:', error);
      throw error;
    }
  };
  const handleBuy = async () => {
    if (!agree) return;
    setIsLoading(true);
    try {
      const tx_id = await buyFromListing(
        nftData?.listing_id,
        currencyAddress,
        nftData?.price,
        nftData?.sales_token
      );
      await handleServerBuy(tx_id);
    } catch (error) {
      const match = error.message.match(/{.*}/);

      console.log(error, '에러 매치');

      setErrorMessage(
        (match && JSON.parse(match?.[0]))?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          'Error'
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (errorMessage) {
    return <ErrorModal message={errorMessage} setShowErrorModal={setErrorMessage} button />;
  }
  return (
    <ModalWrap title="Confirm buy NFT" onClose={onClose}>
      <div className="buy-nft-modal">
        <p className="buy-nft-modal__text">
          Buying [{nftData?.nft_name}] transfers the NFT to your wallet
        </p>
        <ul className="buy-nft-modal__list">
          <li className="buy-nft-modal__list--item">Confirm buy : {nftData?.nft_name}</li>
          <li className="buy-nft-modal__list--item">
            Price : {nftData?.price} {nftData?.sales_token}
          </li>
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
            disabled={!agree || isLoading}
          >
            {isLoading ? 'Buying...' : 'Buy NFT'}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default BuyNftModal;
