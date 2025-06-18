import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './LicenseKeyModal.scss';
import { useTranslation } from 'react-i18next';

const LicenseKeyModal = ({ setLicenseKeyModal }) => {
  const { t } = useTranslation('modal');

  return (
    <ModalWrap
      title={t('License key connection completed.')}
      onClose={() => setLicenseKeyModal(false)}
      className="license-key-modal"
    >
      <p className='license-key-modal__txt'>
        {t('Please fully close the app and reopen it for smooth usage.')}
      </p>
      <button className="license-key-modal-btn" onClick={() => setLicenseKeyModal(false)}>
        {t('OK')}
      </button>
    </ModalWrap>
  );
};

export default LicenseKeyModal;
