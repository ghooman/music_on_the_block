import ModalWrap from './ModalWrap';
import { useNavigate } from 'react-router-dom';
import './NftConfirmSuccessModal.scss';

const NftConfirmSuccessModal = ({ setShowSuccessModal, title, content, noRedirect, onSuccess }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowSuccessModal(false);
    if (onSuccess) onSuccess();
    // if (!noRedirect) {
    //   navigate('/nft');
    // }
  };

  return (
    <ModalWrap title={title} onClose={handleClose} className="confirm-success-modal">
      {content && <p className="confirm-success-modal__content">{content}</p>}
      <div className="confirm-success-modal__btns">
        <button className="confirm-success-modal__btns__ok" onClick={handleClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default NftConfirmSuccessModal;
