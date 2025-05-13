import ModalWrap from '../../../ModalWrap';

import './RequestSuccessModal.scss';

const RequestSuccessModal = ({ handleClose, title, message }) => {
  return (
    <ModalWrap title={title} onClose={handleClose}>
      <div className="albums-delete-confirm-modal">
        <p className="albums-delete-confirm-modal__message text-center">{message}</p>
        <div className="albums-delete-confirm-modal__buttons">
          <button className="confirm-button ok-button" onClick={handleClose}>
            OK
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default RequestSuccessModal;
