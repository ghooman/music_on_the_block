import ModalWrap from './ModalWrap';
import { useNavigate } from 'react-router-dom';
import './NftConfirmSuccessModal.scss';

const NftConfirmSuccessModal = ({ setShowSuccessModal, title }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowSuccessModal(false);
    navigate('/nft');
  };

  return (
    <ModalWrap title={title} onClose={handleClose} className="confirm-modal">
      <div className="confirm-modal__btns">
        <button className="confirm-modal__btns__ok" onClick={handleClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default NftConfirmSuccessModal;
