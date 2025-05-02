import ModalWrap from './ModalWrap';
import axios from 'axios';
import { mintNft } from '../api/nfts/nftMintApi';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './NftConfirmModal.scss';

import { useNFTApprovalCheck } from '../hooks/useNFTApprovalCheck';
import { useApproveMusicNFT } from '../hooks/useApproveMusicNFT';
import { useCancelListing } from '../hooks/useCancelListing';
import { useSellNFT } from '../hooks/useCreateListing';
import {
  MOB_CONTRACT_ADDRESS,
  POL_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
} from '../contract/contractAddresses';

import ErrorModal from '../components/modal/ErrorModal';

const NftConfirmModal = ({
  setShowModal,
  title,
  confirmSellTxt,
  confirmMintTxt,
  confirmCancelTxt,
  setShowSuccessModal,
  selectedCollection,
  songId,
  nftName,
  selectedCoin,
  sellPrice,
  sellPriceInWei,
  thirdwebId,
  nftId,
  listingId,
}) => {
  console.log('sellPrice', sellPrice);
  console.log('nftId', nftId);
  console.log('listingId', listingId);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('sellPriceInWei', sellPriceInWei);

  // 생성 1번
  const nftApprovalCheckData = useNFTApprovalCheck();
  // 생성 2번
  const approveMusicNFT = useApproveMusicNFT();
  // 생성 3번
  const sellNFT = useSellNFT();
  // 취소 hook
  const cancelListing = useCancelListing();

  // ====== NFT 민팅 함수 ======
  const handleMint = async () => {
    setIsLoading(true);
    try {
      const response = await mintNft(token, songId, selectedCollection?.id);
      if (response.status === 'success') {
        setShowModal(false);
        setShowSuccessModal(true);
      } else {
        console.error('error', response);
      }
    } catch (error) {
      const match = error.message.match(/{.*}/);
      setErrorMessage(
        JSON.parse(match?.[0])?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          'Error'
      );
    } finally {
      setIsLoading(false);
    }
  };
  // ===== NFT 민팅 함수 끝 =====

  // ====== NFT 판매 함수 ======
  const ContractAddress = () => {
    switch (selectedCoin.name) {
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

  // 서버에 판매 정보 등록 함수
  const serverPostSellNft = async listingId => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/my/sell/${thirdwebId}?price=${sellPrice}&sales_token=${selectedCoin.name}&listing_id=${listingId}`,
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
      console.error('Server post error:', error);
      throw error;
    }
  };

  // 전체 판매 프로세스를 하나의 비동기 함수로 처리
  const handleSell = async () => {
    setIsLoading(true);
    try {
      // 1. 승인 상태 확인 (이미 useNFTApprovalCheck에서 자동으로 확인됨)
      console.log('NFT approval status:', nftApprovalCheckData);

      // 2. 필요시 승인 진행
      if (!nftApprovalCheckData) {
        console.log('NFT not approved, starting approval process');
        await approveMusicNFT();
      }

      // 3. 판매 리스팅 생성
      const currencyAddress = ContractAddress();
      const now = Math.floor(Date.now() / 1000);
      const tenYearsLater = now + 10 * 365 * 24 * 60 * 60;

      const nftParams = {
        assetContract: MUSIC_NFT_CONTRACT_ADDRESS,
        tokenId: thirdwebId,
        quantity: 1,
        currency: currencyAddress,
        pricePerToken: sellPriceInWei,
        startTimestamp: now,
        endTimestamp: tenYearsLater,
        reserved: false,
      };

      const listingResult = await sellNFT(nftParams);
      console.log('Listing created:', listingResult);

      // 4. 서버에 판매 정보 등록
      const serverResponse = await serverPostSellNft(listingResult);
      console.log('Server response:', serverResponse);

      // 성공 시 모달 변경
      setShowModal(false);
      setShowSuccessModal(true);
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
  // ===== NFT 판매 함수 끝 =====

<<<<<<< HEAD
  if (errorMessage) {
    return <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} button />;
  }

  // 서버에서 판매 취소 함수
  const serverCancelListing = async listingId => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/my/sell/${listingId}/cancel`,
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
      console.error('Error during cancel listing:', error);
      throw error;
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await cancelListing(listingId);
      await serverCancelListing(listingId);
      console.log('cancelListing', listingId);
    } catch (error) {
      console.error('Error during cancel listing:', error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setShowSuccessModal(true);
    }
=======
  const handleCancel = () => {
    setShowModal(false);
>>>>>>> d3955d11d61ea9ee6a7c16cec3004983cec99a10
  };

  if (errorMessage) {
    return <ErrorModal message={errorMessage} setShowErrorModal={setErrorMessage} button />;
  }

  return (
    <ModalWrap title={title} onClose={() => setShowModal(false)} className="confirm-modal">
      <dl>
        {(confirmSellTxt || confirmCancelTxt) && <dt>[{selectedCollection?.name || nftName}]</dt>}
        {confirmMintTxt && <dt>Confirm minting: [{selectedCollection?.name}]</dt>}
        <dd>Network gas fees may apply. No refund or cancellation after purchase.</dd>
      </dl>
      <div className="confirm-modal__btns">
        <button className="confirm-modal__btns__cancel" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        {confirmMintTxt && (
          <button className="confirm-modal__btns__ok" onClick={handleMint}>
            {isLoading ? 'Minting...' : 'Mint'}
          </button>
        )}

        {confirmSellTxt && (
          <button className="confirm-modal__btns__ok" onClick={handleSell}>
            {isLoading ? 'Loading...' : 'Sell'}
          </button>
        )}
        {confirmCancelTxt && (
          <button className="confirm-modal__btns__ok" onClick={handleCancel}>
            {isLoading ? 'Loading...' : 'Yes, Continue'}
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default NftConfirmModal;
