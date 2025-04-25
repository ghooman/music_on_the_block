import ModalWrap from '../ModalWrap';

import './ErrorModal.scss';

const ErrorModal = ({ title, setShowErrorModal, message, button }) => {
  const onClose = () => {
    setShowErrorModal(false);
  };

  return (
    <ModalWrap onClose={onClose} title={title || ''}>
      <div className="error-modal">
        <div className="error-modal__logo-box"></div>
        <p className="error-modal__text">{message || 'No Text'}</p>
        {button && (
          <button className="error-modal__button" onClick={onClose}>
            OK
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default ErrorModal;
