import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './GptErrorModal.scss';
import { useTranslation } from 'react-i18next';

const GptErrorModal = ({ setPreparingModal }) => {
  const { t } = useTranslation('modal');

  return (
    <ModalWrap
      title={t('ERROR')}
      onClose={() => setPreparingModal(false)}
      className="error-modal"
    >
      <p className='error-modal__txt'>
        {t('Please regenerate it again in a little while.')}
      </p>
      <button className="error-modal-btn" onClick={() => setPreparingModal(false)}>
        {t('OK')}
      </button>
    </ModalWrap>
  );
};

export default GptErrorModal;
