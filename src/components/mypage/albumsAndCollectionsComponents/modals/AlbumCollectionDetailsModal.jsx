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
      <div className="albums-details-modal">
        <div className="albums-details-modal__info">
          <p className="albums-details-modal__info__title">[{name}]</p>
          <p className="albums-details-modal__info__artist">{artist}</p>
          <p className="albums-details-modal__info__songs">{count} Songs</p>
        </div>
        <div className="albums-details-modal__button-box">
          <div className="albums-details-modal__button-box__edit">
            <button className="albums-details-modal__button__edit" onClick={onEditClick}>
              Edit Details
            </button>
            <button
              className="albums-details-modal__button__edit-songs"
              onClick={() => {
                handleNavigate();
              }}
            >
              Edit Songs
            </button>
          </div>
          <button className="albums-details-modal__button__delete" onClick={onDeleteClick}>
            Delete Album
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default AlbumCollectionDetailsModal;
