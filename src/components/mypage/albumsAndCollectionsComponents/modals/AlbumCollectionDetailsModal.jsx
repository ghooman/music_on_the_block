import ModalWrap from '../../../ModalWrap';

import './AlbumCollectionDetailsModal.scss';

const AlbumCollectionDetailsModal = ({
  handleClose,
  handleNavigate,
  onEditClick,
  onDeleteClick,
  name,
  artist,
  count,
}) => {
  return (
    <ModalWrap title="Album Details" onClose={handleClose}>
      <div className="album-collection-module-detail-modal">
        <div className="album-collection-module-detail-modal__info">
          <p className="album-collection-module-detail-modal__info__title">[{name}]</p>
          <p className="album-collection-module-detail-modal__info__artist">{artist}</p>
          <p className="album-collection-module-detail-modal__info__songs">{count} Songs</p>
        </div>
        <div className="album-collection-module-detail-modal__button-box">
          <div className="album-collection-module-detail-modal__button-box__edit">
            <button
              className="album-collection-module-detail-modal__button__edit"
              onClick={onEditClick}
            >
              Edit Details
            </button>
            <button
              className="album-collection-module-detail-modal__button__edit-songs"
              onClick={() => {
                handleNavigate();
              }}
            >
              Edit Songs
            </button>
          </div>
          <button
            className="album-collection-module-detail-modal__button__delete"
            onClick={onDeleteClick}
          >
            Delete Album
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default AlbumCollectionDetailsModal;
