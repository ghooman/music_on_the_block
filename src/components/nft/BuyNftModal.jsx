import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ModalWrap from '../ModalWrap';
import { useBuyFromListing } from '../../hooks/useBuyFromListing';
import { useTokenAllowanceCheck } from '../../hooks/useTokenAllowanceCheck';
import { useTokenApprove } from '../../hooks/useTokenApprove';
import './BuyNftModal.scss';
import axios from 'axios';
import ErrorModal from '../modal/ErrorModal';
import {
  MOB_CONTRACT_ADDRESS,
  POL_CONTRACT_ADDRESS,
  // 0630 하늘 fix: USDT, USDC 관련 내용 주석 처리
  // USDT_CONTRACT_ADDRESS,
  // USDC_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
  MARKET_PLACE_CONTRACT_ADDRESS,
} from '../../contract/contractAddresses';
import { useNavigate } from 'react-router-dom';
import { checkPolygonStatus } from '../../api/checkPolygonStatus';
import PolygonStatus from '../unit/PolygonStatus';
import Loading from '../Loading';
import { useTokenBalance } from '../../hooks/useTokenBalance';
const BuyNftModal = ({ setBuyNftModal, nftData, selectedCollection }) => {
  console.log('nftData', nftData);
  // 폴리곤 상태 확인
  const [polygonStatus, setPolygonStatus] = useState(null);
  useEffect(() => {
    const fetchPolygonStatus = async () => {
      const status = await checkPolygonStatus();
      setPolygonStatus(status);
    };
    fetchPolygonStatus();
  }, []);
  const polygonDisabled = polygonStatus?.status?.includes('장애');
  // 0630 하늘 fix: USDT, USDC 관련 내용 주석 처리
  const { mobAllowanceData, polAllowanceData } = useTokenAllowanceCheck();
  const { mobTokenApprove, polTokenApprove } = useTokenApprove();
  const buyFromListing = useBuyFromListing();
  const { token } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const navigate = useNavigate();

  const { refetchAll } = useTokenBalance();

  const ContractAddress = () => {
    switch (nftData?.sales_token) {
      case 'MOB':
        return MOB_CONTRACT_ADDRESS;
      case 'POL':
        return POL_CONTRACT_ADDRESS;
      // case 'USDT':
      //   return USDT_CONTRACT_ADDRESS;
      // case 'USDC':
      //   return USDC_CONTRACT_ADDRESS;
      default:
        return null;
    }
  };
  const currencyAddress = ContractAddress();

  // 토큰 허용량 확인
  useEffect(() => {
    if (!nftData?.price) return;

    const checkAllowance = async () => {
      try {
        let currentAllowance = 0;

        // 토큰 종류에 따라 허용량 설정
        switch (nftData?.sales_token) {
          case 'MOB':
            currentAllowance = mobAllowanceData || 0;
            break;
          case 'POL':
            currentAllowance = polAllowanceData || 0;
            break;
          // case 'USDT':
          //   currentAllowance = usdtAllowanceData || 0;
          //   break;
          // case 'USDC':
          //   currentAllowance = usdcAllowanceData || 0;
          //   break;
          default:
            currentAllowance = 0;
        }

        // console.log('currentAllowance', currentAllowance);
        // console.log('nftData.price', nftData.price);

        if (currentAllowance && Number(currentAllowance) >= Number(nftData.price)) {
          setNeedsApproval(false);
        } else {
          setNeedsApproval(true);
        }
      } catch (error) {
        console.error('Error checking allowance:', error);
        setNeedsApproval(true);
      }
    };

    checkAllowance();
  }, [nftData, mobAllowanceData, polAllowanceData]);

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
        // case 'USDT':
        //   await usdtTokenApprove();
        //   break;
        // case 'USDC':
        //   await usdcTokenApprove();
        //   break;
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
        `${serverApi}/api/nfts/${nftData?.listing_id}/${selectedCollection?.id}/purchase?tx_id=${tx_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('serverResponse', response);
      navigate(`/nft`);
      return response;
    } catch (error) {
      console.error('Error during buy from listing:', error);
      setErrorMessage(error?.response?.data?.detail || error?.message || 'Error during purchase');
    }
  };

  const handleBuyProcess = async () => {
    if (!agree || polygonDisabled || isLoading) return;
    setIsLoading(true);

    try {
      // 1번 어프로브 체크
      if (needsApproval) {
        setIsApproving(true);
        try {
          await approveToken();
          setNeedsApproval(false);
          setIsApproving(false);
        } catch (error) {
          const match = error.message.match(/{.*}/);
          setErrorMessage(
            (match && JSON.parse(match?.[0]))?.message ||
              error?.response?.data?.detail ||
              error?.message ||
              'Error during approval'
          );
          setIsApproving(false);
          setIsLoading(false);
          return;
        }
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
    } catch (error) {
      const match = error.message.match(/{.*}/);
      setErrorMessage(
        (match && JSON.parse(match?.[0]))?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          'Error'
      );
    } finally {
      refetchAll();
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return <ErrorModal message={errorMessage} setShowErrorModal={setErrorMessage} button />;
  }

  const handleClose = () => {
    if (isLoading) return;

    setBuyNftModal(false);
  };

  return (
    <ModalWrap title="Confirm" onClose={handleClose}>
      <div className="buy-nft-modal">
        <div className="buy-nft-modal__title_box">
          <p className="buy-nft-modal__text">Title : {nftData?.nft_name}</p>
          <p className="buy-nft-modal__text">
            Price : {nftData?.price} {nftData?.sales_token} ($100)
          </p>
        </div>
        <p className="buy-nft-modal__text">
          ※ Network MIC fees may apply. <br />
          No refund or cancellation after purchase.
        </p>
        <PolygonStatus />
        <label className="buy-nft-modal__checkbox-wrap">
          <input
            className="buy-nft-modal__checkbox"
            type="checkbox"
            checked={agree}
            onChange={() => {
              if (isLoading) return;
              setAgree(prev => !prev);
            }}
          />
          <p className="buy-nft-modal__checkbox--message">
            No refunds or cancellations after purchase
          </p>
        </label>
        <div className="buy-nft-modal__button-wrap">
          <button className="buy-nft-modal__button cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="buy-nft-modal__button buy-button"
            onClick={handleBuyProcess}
            disabled={!agree || isLoading || isApproving || polygonDisabled}
          >
            {isLoading || polygonDisabled ? <Loading /> : 'Buy NFT'}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default BuyNftModal;
