import { useTranslation } from 'react-i18next';
import ModalWrap from '../../../ModalWrap';
import './AlbumCollectionNoticeModal.scss';

const AlbumCollectionNoticeModal = ({ setAlbumsNoticeModal }) => {
  const { t } = useTranslation('modal');

  const onClose = () => {
    setAlbumsNoticeModal(0);
  };
  return (
    <ModalWrap title="Notice" onClose={onClose}>
      <div className="album-collection-module-notice-modal">
        <p className="album-collection-module-notice-modal__message">
          {t('Added, excluding the previously selected songs.')}
        </p>
        <button className="album-collection-module-notice-modal__button" onClick={onClose}>
          {t('OK')}
        </button>
      </div>
    </ModalWrap>
  );
};
export default AlbumCollectionNoticeModal;
