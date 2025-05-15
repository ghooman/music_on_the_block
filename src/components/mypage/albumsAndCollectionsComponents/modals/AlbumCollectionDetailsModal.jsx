import ModalWrap from '../../../ModalWrap';

import './AlbumCollectionDetailsModal.scss';

const AlbumCollectionDetailsModal = ({
  handleClose,
  onNavigate,
  onEditClick,
  onDeleteClick,
  name,
  artist,
  count,
  target,
}) => {
  const elementname = target === 'Collection' ? 'NTFs' : 'Songs';

  return (
    <ModalWrap title={`${target} Details`} onClose={handleClose}>
      <div className="album-collection-module-detail-modal">
        <div className="album-collection-module-detail-modal__info">
          <p className="album-collection-module-detail-modal__info__title">[{name}]</p>
          <p className="album-collection-module-detail-modal__info__artist">{artist}</p>
          <p className="album-collection-module-detail-modal__info__songs">
            {count} {elementname}
          </p>
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
                if (onNavigate) onNavigate();
              }}
            >
              Edit {elementname}
            </button>
          </div>
          <button
            className="album-collection-module-detail-modal__button__delete"
            onClick={onDeleteClick}
          >
            Delete {target}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default AlbumCollectionDetailsModal;
