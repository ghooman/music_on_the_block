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
    <ModalWrap onClose={onClose} title={t(title) || t('Error')}>
      <div className="error-modal">
        <div className="error-modal__logo-box"></div>
        <p className="error-modal__text" style={{ whiteSpace: 'pre-line' }}>
          {typeof message === 'object' &&
            message.map((text, index, { length }) => {
              if (index !== length - 1) {
                return (
                  <>
                    {t(text)}
                    <br />
                  </>
                );
              } else {
                return t(text);
              }
            })}
          {typeof message === 'string' && t(message)}
          {!message && 'No Text'}
        </p>
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
