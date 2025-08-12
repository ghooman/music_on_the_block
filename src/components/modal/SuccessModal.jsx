import { useTranslation } from 'react-i18next';
import ModalWrap from '../ModalWrap';

import './SuccessModal.scss';

const SuccessModal = ({ title, content, onClose, onSuccess, closeIcon = true }) => {
  const { t } = useTranslation('modal');

  const handleClose = () => {
    if (onSuccess) onSuccess();
    onClose(false);
  };

  return (
    <ModalWrap title={t(title)} onClose={handleClose} closeIcon={closeIcon}>
      <div className="success-modal">
        {content && <p className="success-modal__message">{t(content)}</p>}
        <button className="success-modal__button" onClick={handleClose}>
          {t('OK')}
        </button>
      </div>
    </ModalWrap>
  );
};

export default SuccessModal;
