import ModalWrap from "../../ModalWrap";
import { useState } from "react";
import "./AlbumsCreateModal.scss";

import UploadButtonImage from "../../../assets/images/icon/picture1.svg";
import defaultAlbumsImage from "../../../assets/images/mypage/albums-upload-logo.png";

const AlbumsCreateModal = ({ setShowCreateModal, status }) => {
  const [albumsImage, setAlbumsImage] = useState(null);
  const [albumsName, setAlbumsName] = useState("");

  return (
    <ModalWrap onClose={setShowCreateModal} title={"Create Album"}>
      <div className="albums-create-modal">
        <p className="albums-create-modal__title">Album Cover Image</p>
        <span className="albums-create-modal__size-info">
          (jpg, png, under 4MB)
        </span>
        <div className="albums-create-modal__image-box">
          <img
            className="albums-create-modal__image"
            src={defaultAlbumsImage}
            alt="albums_cover_image"
          />
          <button>
            <img
              className="albums-create-modal__button-image"
              src={UploadButtonImage}
              alt="button_icon"
            />
          </button>
        </div>
        <p className="albums-create-modal__name">Album Name</p>
        <div className="albums-create-modal__name-box">
          <input
            className="albums-create-modal__name-box__input"
            placeholder="Please enter the album name"
            value={albumsName}
            onChange={(e) => setAlbumsName(e.target.value)}
          />
          <span className="albums-create-modal__name-box__input__length">
            {albumsName?.length || 0}/40
          </span>
        </div>
        <div className="albums-create-modal__button-box">
          <button
            className="albums-create-modal__button__cancel"
            onClick={() => setShowCreateModal(false)}
          >
            Cancel
          </button>
          <button className="albums-create-modal__button__create">
            Create
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};
export default AlbumsCreateModal;
