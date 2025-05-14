import ModalWrap from '../../../ModalWrap';
import Loading from '../../../Loading';

import './AlbumCollectionDeleteConfirmModal.scss';

const AlbumCollectionDeleteConfirmModal = ({ handleClose, handleDelete, name, loading }) => {
  return (
    <ModalWrap title="Delete Album" onClose={handleClose}>
      <div className="album-collection-module-delete-confirm-modal">
        <p className="album-collection-module-delete-confirm-modal__message">
          This action cannot be undone
          <br />
          All tracks in this album will also be permanently deleted.
        </p>
        <p className="album-collection-module-delete-confirm-modal__message">
          Are you sure want to delete
          <br />
          <span>"{name}"?</span>
        </p>
        <div className="album-collection-module-delete-confirm-modal__buttons">
          <button className="confirm-button cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="confirm-button delete-button"
            onClick={async () => {
              await handleDelete();
            }}
            disabled={loading}
          >
            {loading ? <Loading /> : 'Delete Album'}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};
export default AlbumCollectionDeleteConfirmModal;
