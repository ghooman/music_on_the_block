import { useTranslation } from 'react-i18next';
import ModalWrap from '../ModalWrap';
import Loading from '../Loading';
import './ConfirmModal.scss';

const ConfirmModal = ({
  title,
  content,
  customContent, // 커스텀 컨텐츠 용 (투표 리스트 추가 txt)
  setShowConfirmModal,
  cancelMessage,
  okMessage,
  okHandler,
  loading,
  closeIcon = true
}) => {
  const { t } = useTranslation('modal');

  const handleClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <ModalWrap title={t(title)} onClose={handleClose} closeIcon={closeIcon}>
      <div className="confirm-modal">
        {/* customContent가 있으면 그것을 우선 표시 */}
        {customContent ? (
          <div className="confirm-modal__message">{customContent}</div>
        ) : (
          <p className="confirm-modal__message">{t(content)}</p>
        )}
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
