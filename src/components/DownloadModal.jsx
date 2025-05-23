import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './DownloadModal.scss';
import { useTranslation } from 'react-i18next';

const DownloadModal = ({ setIsDownloadModal, needOwner, needMint }) => {
  const { t } = useTranslation('modal');

  return (
    <ModalWrap
      title={t('DOWNLOAD ERROR')}
      onClose={() => setIsDownloadModal(false)}
      className="down-load-modal"
    >
      {needOwner && (
        <p className="down-load-modal__txt">
          {t('ONLY_OWNER_DOWNLOAD', 'Only owners can download')}
        </p>
      )}

      {needMint && (
        <p className="down-load-modal__txt">
          {t('NEED_MINT_DOWNLOAD', "You'll need Mint to download.")}
        </p>
      )}

      <button className="down-load-modal-btn" onClick={() => setIsDownloadModal(false)}>
        {t('OK')}
      </button>
    </ModalWrap>
  );
};

export default DownloadModal;
