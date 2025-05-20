import ModalWrap from './ModalWrap';
import axios from 'axios';
import { mintNft2 } from '../api/nfts/nftMintApi';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './NftConfirmModal.scss';
import { useCancelListing } from '../hooks/useCancelListing';
import { useNFTApprovalCheck } from '../hooks/useNFTApprovalCheck';
import { useApproveMusicNFT } from '../hooks/useApproveMusicNFT';
import { useSellNFT } from '../hooks/useCreateListing';
import { useBuyFromListing } from '../hooks/useBuyFromListing';
import { useTokenAllowanceCheck } from '../hooks/useTokenAllowanceCheck';
import { useTokenApprove } from '../hooks/useTokenApprove';
import {
  MOB_CONTRACT_ADDRESS,
  POL_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
  MARKET_PLACE_CONTRACT_ADDRESS,
} from '../contract/contractAddresses';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/modal/ErrorModal';
import { checkPolygonStatus } from '../api/checkPolygonStatus';
import PolygonStatus from './unit/PolygonStatus';
import { useUserDetail } from '../hooks/useUserDetail';
import Loading from './Loading';
import NftConfirmSuccessModal from './NftConfirmSuccessModal';

// 바이 캔슬 민팅 판매

const NftConfirmModal = ({
  setShowModal,
  title = 'Confirm',
  confirmSellTxt,
  confirmMintTxt,
  confirmCancelTxt,
  confirmBuyTxt,
  selectedCollection,
  songId,
  nftName,
  selectedCoin,
  sellPrice,
  sellPriceInWei,
  thirdwebId,
  listingId,
  songData,
  nftData,
  onSuccess,
}) => {
  // 폴리곤 상태 확인
  const [polygonStatus, setPolygonStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successContent, setSuccessContent] = useState('');

  useEffect(() => {
    const fetchPolygonStatus = async () => {
      const status = await checkPolygonStatus();
      setPolygonStatus(status);
    };
    fetchPolygonStatus();
  }, []);
  const polygonDisabled = polygonStatus?.status?.includes('장애');
  // 토큰 잔액 확인
  const { data: userData } = useUserDetail();
  const micBalance = userData?.mic_point || '0.00';
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  console.log('sellPriceInWei', sellPriceInWei);
  const navigate = useNavigate();

  // 생성 1번
  const nftApprovalCheckData = useNFTApprovalCheck();
  // 생성 2번
  const approveMusicNFT = useApproveMusicNFT();
  // 생성 3번
  const sellNFT = useSellNFT();
  // 취소
  const cancelListing = useCancelListing();
  // 구매 관련
  const { mobAllowanceData, polAllowanceData, usdtAllowanceData, usdcAllowanceData } =
    useTokenAllowanceCheck();
  const { mobTokenApprove, polTokenApprove, usdcTokenApprove, usdtTokenApprove } =
    useTokenApprove();
  const buyFromListing = useBuyFromListing();

  // ====== NFT 민팅 함수 ======
  const handleMint = async () => {
    if (isLoading || polygonDisabled) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await mintNft2(token, songId);
      if (response.status === 'success') {
        setSuccessContent('Your song has been minted as an NFT!');
        setShowSuccessModal(true);
      } else {
        console.error('error', response);
        setErrorMessage(response);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  // ===== NFT 민팅 함수 끝 =====

  // ====== NFT 판매 함수 ======
  const ContractAddress = () => {
    switch (selectedCoin?.name || nftData?.sales_token) {
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

  // 서버에 판매 정보 등록 함수
  const serverPostSellNft = async ({ listingResult, transactionHash }) => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/my/sell/${thirdwebId}?price=${sellPrice}&sales_token=${selectedCoin.name}&listing_id=${listingResult}&tx_id=${transactionHash}`,
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
    if (isLoading || polygonDisabled) {
      return;
    }
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

      const { listingResult, transactionHash } = await sellNFT(nftParams);
      console.log('Listing created:', listingResult);

      // 4. 서버에 판매 정보 등록
      const serverResponse = await serverPostSellNft({ listingResult, transactionHash });
      console.log('Server response:', serverResponse);

      // 성공 시 모달 변경
      setSuccessContent('Your NFT has been listed for sale!');
      setShowSuccessModal(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      // const rawMessage = error?.message || '';
      // const match = rawMessage.match(/{.*}/);
      // console.log('rawMessage', rawMessage);

      // let parsedMessage =
      //   (match && JSON.parse(match?.[0]))?.message || error?.response?.data?.detail || rawMessage;

      // if (rawMessage.includes("AA21 didn't pay prefund")) {
      //   parsedMessage = 'Insufficient Polygon gas fee.';
      // }
      console.log(error, '에러에욧!');
      alert(1);
      setErrorMessage(
        error?.response?.data?.detail?.msg || error?.response?.data?.detail || error?.message
      );
    } finally {
      setIsLoading(false);
    }
  };
  // ===== NFT 판매 함수 끝 =====

  // 서버에서 판매 취소 함수
  const serverCancelListing = async ({ listingId, transactionHash }) => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/my/sell/${listingId}/cancel?tx_id=${transactionHash}`,
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
  // ===== NFT 판매 취소 함수  =====
  const handleCancel = async () => {
    if (isLoading || polygonDisabled) {
      return;
    }
    setIsLoading(true);
    try {
      const transactionHash = await cancelListing(listingId);
      const response = await serverCancelListing({ listingId, transactionHash });
      console.log('cancelListing', listingId);

      setSuccessContent('Your listing has been cancelled successfully!');
      setShowSuccessModal(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      const rawMessage = error?.message || '';
      const match = rawMessage.match(/{.*}/);
      console.log('rawMessage', rawMessage);

      let parsedMessage =
        (match && JSON.parse(match?.[0]))?.message || error?.response?.data?.detail || rawMessage;

      if (rawMessage.includes("AA21 didn't pay prefund")) {
        parsedMessage = 'Insufficient Polygon gas fee.';
      }

      setErrorMessage(parsedMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // ===== NFT 판매 취소 함수 끝 =====

  // ===== NFT 구매 함수 =====
  // 토큰 허용량 확인
  useEffect(() => {
    if (!confirmBuyTxt || !nftData?.price) return;
  }, [nftData, confirmBuyTxt]);

  let currentAllowance = 0;

  // 토큰 종류에 따라 허용량 설정
  switch (nftData?.sales_token) {
    case 'MOB':
      currentAllowance = mobAllowanceData;
      break;
    case 'POL':
      currentAllowance = polAllowanceData;
      break;
    case 'USDT':
      currentAllowance = usdtAllowanceData;
      break;
    case 'USDC':
      currentAllowance = usdcAllowanceData;
      break;
    default:
      currentAllowance = 0;
  }

  // 토큰 종류에 따라 적절한 approve 함수 호출
  const approveToken = async () => {
    try {
      switch (nftData?.sales_token) {
        case 'MOB':
          await mobTokenApprove();
          break;
        case 'POL':
          await polTokenApprove();
          break;
        case 'USDT':
          await usdtTokenApprove();
          break;
        case 'USDC':
          await usdcTokenApprove();
          break;
        default:
          throw new Error('지원하지 않는 토큰입니다.');
      }
      return true;
    } catch (error) {
      console.error('Token approval failed:', error);
      throw error;
    }
  };

  // 서버에 구매 요청 보내는 함수
  const handleServerBuy = async tx_id => {
    try {
      const response = await axios.post(
        `${serverApi}/api/nfts/${nftData?.listing_id}/purchase?tx_id=${tx_id}`,
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
      setErrorMessage(error?.response?.data?.detail || error?.message || 'Error during purchase');
    }
  };

  const handleBuy = async () => {
    if (!agree || polygonDisabled || isLoading) return;
    setIsLoading(true);

    try {
      // 1번 어프로브 체크
      if (currentAllowance < nftData.price) {
        await approveToken();
      }
      // 2번 구매 진행 (리스팅 발급)
      const tx_id = await buyFromListing(
        nftData?.listing_id,
        currencyAddress,
        nftData?.price,
        nftData?.sales_token
      );
      // 3번 리스팅 발급후 서버에 구매 요청
      await handleServerBuy(tx_id);

      setSuccessContent('Your NFT purchase was successful!');
      setShowSuccessModal(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      const rawMessage = error?.message || '';
      const match = rawMessage.match(/{.*}/);
      console.log('rawMessage', rawMessage);

      let parsedMessage =
        (match && JSON.parse(match?.[0]))?.message || error?.response?.data?.detail || rawMessage;

      if (rawMessage.includes("AA21 didn't pay prefund")) {
        parsedMessage = 'Insufficient Polygon gas fee.';
      }

      setErrorMessage(parsedMessage);
      console.log(error, '구매 에러');
    } finally {
      setIsLoading(false);
    }
  };
  // ===== NFT 구매 함수 끝 =====

  if (errorMessage) {
    return <ErrorModal message={errorMessage} setShowErrorModal={setErrorMessage} button />;
  }

  const handleClose = () => {
    if (isLoading) return;

    setShowModal(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowModal(false);
  };

  const defineNavigate = () => {
    if (confirmSellTxt) {
      navigate('/my-page?category=NFTs&page=1&nft_filter=Listed');
    } else {
      navigate('/my-page?category=NFTs&page=1&nft_filter=Unlisted');
    }
    window.scrollTo({ top: 0 });
  };

  const defineModalTitle = () => {
    if (confirmSellTxt) return 'Sell';
    else if (confirmBuyTxt) return 'Buy';
    else if (confirmMintTxt) return 'Mint';
    else if (confirmCancelTxt) return 'Cancel';
  };

  if (showSuccessModal) {
    return (
      <NftConfirmSuccessModal
        setShowSuccessModal={handleSuccessModalClose}
        title={'Confirm'}
        content={successContent}
        onSuccess={() => defineNavigate()}
      />
    );
  }

  return (
    <ModalWrap
      title={'Confirm ' + defineModalTitle()}
      onClose={handleClose}
      className="confirm-modal"
    >
      <dl>
        {(confirmSellTxt || confirmCancelTxt || confirmBuyTxt) && (
          <dt>Title: {nftData?.title || nftName}</dt>
        )}
        {confirmSellTxt && (
          <dt>
            Price: {sellPrice} {selectedCoin?.name} ($ 0)
          </dt>
        )}
        {confirmMintTxt && <dt>Title: {songData?.title || nftData?.title || nftName}</dt>}
        {confirmBuyTxt && (
          <dt>
            Price: {nftData?.price} {nftData?.sales_token} ($ 0)
          </dt>
        )}
        <PolygonStatus />
        {confirmBuyTxt && (
          <label className="confirm-modal__checkbox-wrap">
            <input
              className="confirm-modal__checkbox"
              type="checkbox"
              checked={agree}
              onChange={() => {
                if (isLoading) return;
                setAgree(prev => !prev);
              }}
            />
            <p className="confirm-modal__checkbox--message">
              No refunds or cancellations after purchase
            </p>
          </label>
        )}
        {confirmMintTxt && (
          <div className="confirm-modal__title-wrap">
            <p className="confirm-modal__title-wrap__title">
              My MIC{' '}
              <span>
                {isNaN(Number(micBalance)) || Number(micBalance) <= 0
                  ? 0
                  : Number(micBalance).toFixed(2)?.toLocaleString()}
              </span>
            </p>
            <p className="confirm-modal__title-wrap__title">
              MIC Fees <span>0</span>
            </p>
          </div>
        )}
        <dd className="confirm-modal__gas-fee">
          ※{' '}
          {confirmMintTxt ? (
            <>
              MIC fees may apply
              <br />
              and the process may take up to 3 minutes.
            </>
          ) : (
            <>
              Network fees may apply
              <br />
              and the process may take up to 3 minutes.
            </>
          )}
        </dd>
      </dl>
      <div className="confirm-modal__btns">
        <button className="confirm-modal__btns__cancel" onClick={handleClose}>
          Cancel
        </button>
        {confirmMintTxt && (
          <button
            className={`confirm-modal__btns__ok ${isLoading ? ' disabled' : ''}`}
            onClick={handleMint}
          >
            {isLoading || polygonDisabled ? <Loading /> : 'Mint'}
          </button>
        )}

        {confirmSellTxt && (
          <button
            className={`confirm-modal__btns__ok ${isLoading ? 'disabled' : ''}`}
            onClick={handleSell}
          >
            {isLoading || polygonDisabled ? <Loading /> : 'Sell'}
          </button>
        )}
        {confirmCancelTxt && (
          <button
            className={`confirm-modal__btns__ok ${isLoading ? 'disabled' : ''}`}
            onClick={handleCancel}
          >
            {isLoading || polygonDisabled ? <Loading /> : 'Yes, Continue'}
          </button>
        )}
        {confirmBuyTxt && (
          <button
            className={`confirm-modal__btns__ok ${isLoading ? 'disabled' : ''}`}
            onClick={handleBuy}
            disabled={!agree || isLoading || polygonDisabled}
          >
            {isLoading || polygonDisabled ? <Loading /> : 'Buy NFT'}
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default NftConfirmModal;
