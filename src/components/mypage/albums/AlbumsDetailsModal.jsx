import { useState } from "react";
import ModalWrap from "../../ModalWrap";
import "./AlbumsDetailsModal.scss";

import { deleteAlbumsList } from "../../../api/AlbumsListApi";

const AlbumsDetailsModal = ({
  setShowDetailModal,
  album,
  token,
  onAlbumCreated,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteAlbum = async () => {
    await deleteAlbumsList(album?.id, token);
    await onAlbumCreated();
    setDeleteSuccess(true);
  };

  // 초기 상태: 앨범 상세 정보 표시
  if (!deleteConfirm && !deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="Album Details">
        <div className="albums-details-modal">
          <div className="albums-details-modal__info">
            <p className="albums-details-modal__info__title">
              [{album?.album_name}]
            </p>
            <p className="albums-details-modal__info__artist">{album?.name}</p>
            <p className="albums-details-modal__info__songs">
              {album?.song_cnt} Songs
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <div className="albums-details-modal__button-box__edit">
              <button
                className="albums-details-modal__button__edit"
                onClick={() => {}}
              >
                Edit Details
              </button>
              <button
                className="albums-details-modal__button__edit-songs"
                onClick={() => {}}
              >
                Edit Songs
              </button>
            </div>
            <button
              className="albums-details-modal__button__delete"
              onClick={() => setDeleteConfirm(true)}
            >
              Delete Album
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }

  // 삭제 확인 상태
  if (deleteConfirm && !deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="Delete Album">
        <div className="albums-details-modal">
          <div className="albums-details-modal__delete-confirm">
            <p className="albums-details-modal__delete-confirm__text">
              This action cannot be undone.
            </p>
            <p className="albums-details-modal__delete-confirm__text">
              All tracks in this album will also be permanently deleted.
            </p>
            <p className="albums-details-modal__delete-confirm__question">
              Are you sure you want to delete <br />
              <span className="albums-details-modal__delete-confirm__album-name">
                "{album?.album_name}"
              </span>
              ?
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <button
              className="albums-details-modal__button__cancel"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="albums-details-modal__button__delete-confirm"
              onClick={handleDeleteAlbum}
            >
              Delete Album
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }

  // 삭제 완료 상태
  if (deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="">
        <div className="albums-details-modal">
          <div className="albums-details-modal__success">
            <p className="albums-details-modal__success__text">
              Album deleted successfully.
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <button
              className="albums-details-modal__button__ok"
              onClick={() => setShowDetailModal(false)}
            >
              Ok
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }
};

export default AlbumsDetailsModal;
