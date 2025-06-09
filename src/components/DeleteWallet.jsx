import {useState,useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './DeleteWallet.scss';
import { useTranslation } from 'react-i18next';

const DeleteWallet = ({ setDeleteWalletModal }) => {
  const { t } = useTranslation('modal');


  return (
    <ModalWrap
      title={t('Delete Wallet')}
      onClose={() => setDeleteWalletModal(false)}
      className="delete-wallet"
    >
      <p className='delete-wallet__txt'>
        {t('Are you sure you want to delete the registered wallet?')}
      </p>
      <div className='delete-wallet__btn-wrap'>
        <button className="cancel-btn" onClick={() => setDeleteWalletModal(false)}>
          {t('Cancel')}
        </button>
        <button className="delete-btn" onClick={() => setDeleteWalletModal(false)}>
          {t('Delete')}
        </button>
      </div>
    </ModalWrap>
  );
};

export default DeleteWallet;
