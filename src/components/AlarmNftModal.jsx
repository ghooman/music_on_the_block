import './AlarmNftModal.scss';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import closeIcon from '../assets/images/close.svg';
import { WebSocketContext } from '../contexts/WebSocketContext';

const AlarmNftModal = () => {
  const { t } = useTranslation('modal');
  const { lastNftMessage } = useContext(WebSocketContext);

  const [nftData, setNftData] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  console.log('lastNftMessage', lastNftMessage);
  // 웹소켓 메시지 처리
  useEffect(() => {
    if (!lastNftMessage) return;

    try {
      const data = lastNftMessage;

      // NFT 판매 완료 메시지인지 확인 (status나 type으로 구분)
      if (data.type === 'nft_sold' || data.status === 'nft_sold') {
        setNftData({
          name: data.nft_name || data.name || 'NFT',
          message: data.message || 'NFT 판매가 완료되었습니다.',
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
