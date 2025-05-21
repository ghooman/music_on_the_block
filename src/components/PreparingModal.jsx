import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './PreparingModal.scss';
import { useTranslation } from 'react-i18next';

const PreparingModal = ({ setPreparingModal }) => {
  const { t } = useTranslation('modal');

  return (
    <ModalWrap
      title={t('PREPARING')}
      onClose={() => setPreparingModal(false)}
      className="preparing"
    >
      <button className="preparing-btn" onClick={() => setPreparingModal(false)}>
        {t('OK')}
      </button>
    </ModalWrap>
  );
};

export default PreparingModal;
