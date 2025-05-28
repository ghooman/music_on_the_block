import { useTranslation } from 'react-i18next';
import ModalWrap from '../ModalWrap';
import Loading from '../Loading';
import './ConfirmModal.scss';

const ConfirmModal = ({
  title,
  content,
  setShowConfirmModal,
  cancelMessage,
  okMessage,
  okHandler,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation('modal');

  const handleClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <ModalWrap title={t(title)} onClose={handleClose}>
      <div className="confirm-modal">
        {content && <p className="confirm-modal__message">{t(content)}</p>}
        <div className="confirm-modal__button-container">
          <button className="confirm-modal__button cancel" onClick={handleClose}>
            {cancelMessage}
          </button>

          <button
            className={`confirm-modal__button ${loading ? 'loading' : ''}`}
            onClick={okHandler}
          >
            {loading ? <Loading /> : okMessage}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default ConfirmModal;
