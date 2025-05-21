import { useTranslation } from 'react-i18next';
import ModalWrap from '../../../ModalWrap';
import Loading from '../../../Loading';

import './AlbumCollectionDeleteConfirmModal.scss';

const AlbumCollectionDeleteConfirmModal = ({
  handleClose,
  handleDelete,
  name,
  loading,
  target,
}) => {
  const { t } = useTranslation('modal');

  return (
    <ModalWrap title={t(`Delete ${target}`)} onClose={handleClose}>
      <div className="album-collection-module-delete-confirm-modal">
        <p className="album-collection-module-delete-confirm-modal__message">
          {t('This action cannot be undone')}
          <br />
          {t(
            `All ${
              target === 'Collection' ? 'nfts' : 'tracks'
            } in this ${target?.toLowerCase()} will also be permanently deleted.`
          )}
        </p>
        <p className="album-collection-module-delete-confirm-modal__message">
          {t('Are you sure want to delete')}
          <br />
          <span>"{name}"?</span>
        </p>
        <div className="album-collection-module-delete-confirm-modal__buttons">
          <button className="confirm-button cancel-button" onClick={handleClose}>
            {t('Cancel')}
          </button>
          <button
            className="confirm-button delete-button"
            onClick={async () => {
              await handleDelete();
            }}
            disabled={loading}
          >
            {loading ? <Loading /> : t(`Delete ${target}`)}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};
export default AlbumCollectionDeleteConfirmModal;
