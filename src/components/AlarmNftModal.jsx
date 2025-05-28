import './AlarmNftModal.scss';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../assets/images/close.svg';
import { WebSocketContext } from '../contexts/WebSocketContext';

const AlarmNftModal = () => {
  const { t } = useTranslation('modal');
  const { lastNftMessage } = useContext(WebSocketContext);
  const navigate = useNavigate();

  const [nftData, setNftData] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  console.log('lastNftMessage', lastNftMessage);
  // 웹소켓 메시지 처리
  useEffect(() => {
    if (!lastNftMessage) return;

    try {
      const data = lastNftMessage;

      // NFT 판매 데이터가 있는지 확인 (pk가 있으면 NFT 판매 알림으로 판단)
      if (data.pk && data.song_name) {
        setNftData({
          pk: data.pk,
          song_name: data.song_name,
          seller_user_name: data.seller_user_name,
          buy_user_name: data.buy_user_name,
        });
        setIsClosed(false); // 모달 표시
      }
    } catch (err) {
      console.error('NFT 알림 메시지 처리 에러:', err);
    }
  }, [lastNftMessage]);

  const handleClose = () => setIsClosed(true);
  const handleOverlayClick = () => setIsClosed(false);

  const handleOk = () => {
    if (nftData?.pk) {
      navigate(`/nft/detail/${nftData.pk}`);
    }
    setNftData(null);
    setIsClosed(true);
  };

  // NFT 데이터가 없으면 렌더링하지 않음
  if (!nftData) return null;

  return (
    <>
      <div className={`alarm__nft__modal ${isClosed ? 'active' : ''}`}>
        <div className="alarm__nft__modal__item">
          <button className="alarm__nft__modal__item__closed" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <p className="alarm__nft__modal__item__title">{nftData?.song_name}</p>
          <p className="alarm__nft__modal__item__txt">{t('NFT sale completed!')}</p>
          <button className="alarm__nft__modal__item__link" onClick={handleOk}>
            {t('OK')}
          </button>
        </div>
      </div>
      <div
        className={`alarm__nft__modal__arr ${isClosed ? 'active' : ''}`}
        onClick={handleOverlayClick}
      ></div>
    </>
  );
};

export default AlarmNftModal;
