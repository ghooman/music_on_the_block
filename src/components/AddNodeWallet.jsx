import { useState, useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './AddNodeWallet.scss';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';

import { postNodeViewer } from '../api/nodeViewerApi';

const AddNodeWallet = ({
  setAddNodeWalletModal,
  token,
  isError,
  errorMessage,
  setIsError,
  setErrorMessage,
  onSuccess,
}) => {
  const { t } = useTranslation('modal');

  const [isLoading, setIsLoading] = useState(false);

  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleWalletNameChange = e => {
    setWalletName(e.target.value);
    // 입력 시 에러 상태 초기화
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handleWalletAddressChange = e => {
    setWalletAddress(e.target.value);
    // 입력 시 에러 상태 초기화
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handleAddNodeWallet = async () => {
    if (!walletName.trim() || !walletAddress.trim()) {
      setIsError(true);
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const response = await postNodeViewer(token, walletAddress, walletName);

      if (response.status === 200 || response.status === 201) {
        // 성공 시 모달 닫기 및 리스트 새로고침
        setAddNodeWalletModal(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('지갑 추가 실패:', error);
      setIsError(true);
      setErrorMessage('지갑 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrap
      title={t('Add Node Wallet')}
      onClose={() => setAddNodeWalletModal(false)}
      className="add-node-wallet"
    >
      <dl className="add-node-wallet__dl">
        <dt>{t('Wallet Name')}</dt>
        <dd>
          <input
            type="text"
            placeholder={t('Enter Wallet Name')}
            value={walletName}
            onChange={handleWalletNameChange}
          />
        </dd>
      </dl>
      <dl className="add-node-wallet__dl">
        <dt>{t('Wallet Address')}</dt>
        <dd className={`${isError ? 'error' : ''}`}>
          <input
            type="text"
            placeholder={t('Enter Wallet Address')}
            value={walletAddress}
            onChange={handleWalletAddressChange}
          />
          {isError && (
            <p className="error-msg">{errorMessage || t('The wallet address is incorrect.')}</p>
          )}
        </dd>
      </dl>
      <div className="add-node-wallet__btn-wrap">
        <button className="cancel-btn" onClick={() => setAddNodeWalletModal(false)}>
          {t('Cancel')}
        </button>
        <button className={`add-btn ${isLoading ? 'disabled' : ''}`} onClick={handleAddNodeWallet}>
          {!isLoading && <>{t('Add')}</>}
          {isLoading && <Loading />}
        </button>
      </div>
    </ModalWrap>
  );
};

export default AddNodeWallet;
