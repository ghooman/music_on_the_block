import { useState, useEffect } from 'react';
import ModalWrap from '../ModalWrap';

import './AddNodeWalletModal.scss';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';

const AddNodeWallet = ({ setAddNodeWalletModal }) => {
  const { t } = useTranslation('modal');

  const [isLoading, setIsLoading] = useState(false);

  return (
    <ModalWrap
      title={t('Add Node Wallet')}
      onClose={() => setAddNodeWalletModal(false)}
      className="add-node-wallet"
    >
      <dl className="add-node-wallet__dl">
        <dt>{t('Wallet Name')}</dt>
        <dd>
          <input type="text" placeholder={t('Enter Wallet Name')} />
        </dd>
      </dl>
      <dl className="add-node-wallet__dl">
        <dt>{t('Wallet Address')}</dt>
        <dd className="error">
          <input type="text" placeholder={t('Enter Wallet Address')} />
          <p className="error-msg">{t('The wallet address is incorrect.')}</p>
        </dd>
      </dl>
      <div className="add-node-wallet__btn-wrap">
        <button className="cancel-btn" onClick={() => setAddNodeWalletModal(false)}>
          {t('Cancel')}
        </button>
        <button
          className={`add-btn ${isLoading ? 'disabled' : ''}`}
          onClick={() => setAddNodeWalletModal(false)}
        >
          {!isLoading && <>{t('Add')}</>}
          {isLoading && <Loading />}
        </button>
      </div>
    </ModalWrap>
  );
};

export default AddNodeWallet;
