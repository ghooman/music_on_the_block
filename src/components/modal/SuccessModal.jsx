import ModalWrap from '../ModalWrap';

import './SuccessModal.scss';

const SuccessModal = ({ title, content, setShowSuccessModal, onSuccess }) => {
  const handleClose = () => {
    if (onSuccess) onSuccess();
    setShowSuccessModal(false);
  };

  return (
    <ModalWrap title={title} onClose={handleClose}>
      <div className="success-modal">
        {content && <p className="success-modal__message">{content}</p>}
        <button className="success-modal__button" onClick={handleClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default SuccessModal;
