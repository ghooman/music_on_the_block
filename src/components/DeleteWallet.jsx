import { useState, useEffect } from 'react';
import ModalWrap from './ModalWrap';
import Loading from './Loading';

import './DeleteWallet.scss';
import { useTranslation } from 'react-i18next';
import { deleteNodeViewer } from '../api/nodeViewerApi';

const DeleteWallet = ({
  setDeleteWalletModal,
  token,
  deleteWalletId,
  setIsError,
  setErrorMessage,
  onSuccess,
}) => {
  const { t } = useTranslation('modal');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteWallet = async () => {
    if (!deleteWalletId) {
      setErrorMessage('삭제할 지갑 ID가 없습니다.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const response = await deleteNodeViewer(token, deleteWalletId);

      if (response.status === 200 || response.status === 204) {
        // 성공 시 모달 닫기 및 리스트 새로고침
        setDeleteWalletModal(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('지갑 삭제 실패:', error);
      setIsError(true);
      setErrorMessage('지갑 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrap
      title={t('Delete Wallet')}
      onClose={() => setDeleteWalletModal(false)}
      className="delete-wallet"
    >
      <p className="delete-wallet__txt">
        {t('Are you sure you want to delete the registered wallet?')}
      </p>
      <div className="delete-wallet__btn-wrap">
        <button className="cancel-btn" onClick={() => setDeleteWalletModal(false)}>
          {t('Cancel')}
        </button>
        <button
          className={`delete-btn ${isLoading ? 'disabled' : ''}`}
          onClick={handleDeleteWallet}
          disabled={isLoading}
        >
          {!isLoading && <>{t('Delete')}</>}
          {isLoading && <Loading />}
        </button>
      </div>
    </ModalWrap>
  );
};

export default DeleteWallet;
