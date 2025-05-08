import ModalWrap from './ModalWrap';
import { useNavigate } from 'react-router-dom';
import './NftConfirmSuccessModal.scss';

const NftConfirmSuccessModal = ({ setShowSuccessModal, title, content, noRedirect }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowSuccessModal(false);
    if (!noRedirect) {
      navigate('/nft');
    }
  };

  return (
    <ModalWrap title={title} children={content} onClose={handleClose} className="confirm-modal">
      <div className="confirm-modal__btns">
        <button className="confirm-modal__btns__ok" onClick={handleClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default NftConfirmSuccessModal;
