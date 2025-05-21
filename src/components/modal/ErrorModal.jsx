import { useTranslation } from 'react-i18next';
import ModalWrap from '../ModalWrap';

import './ErrorModal.scss';

const ErrorModal = ({ title, setShowErrorModal, message, button, action }) => {
  const { t } = useTranslation('error');

  const onClose = () => {
    if (action) {
      action();
    }
    setShowErrorModal(false);
  };

  return (
    <ModalWrap onClose={onClose} title={title || 'Error'}>
      <div className="error-modal">
        <div className="error-modal__logo-box"></div>
        <p className="error-modal__text">{t(message) || 'No Text'}</p>
        {button && (
          <button className="error-modal__button" onClick={onClose}>
            {t('OK')}
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default ErrorModal;
