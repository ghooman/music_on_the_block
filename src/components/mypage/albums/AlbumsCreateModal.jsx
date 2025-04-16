import ModalWrap from "../ModalWrap";
import { useState } from "react";
import "./AlbumsCreateModal.scss";

import UploadButtonImage from "../../../assets/images/icon/picture1.svg";
import defaultAlbumsLogo from "../../../assets/images/mypage/albums-upload-logo.png";

const AlbumsCreateModal = ({ setShowCreateModal, status }) => {
  const [albumsLogo, setAlbumsLogo] = useState(null);
  const [albumsName, setAlbumsName] = useState("");

  return (
    <ModalWrap onClose={setShowCreateModal} title={"Create Album"}>
      <div className="albums-create-modal">
        <p className="album-create-modal__title">Album Cover Image</p>
        <span className="album-create-modal__size-info">
          (jpg, png, under 4MB)
        </span>
        <div className="album-create-modal__image-box">
          <img
            className="album-create-modal__image"
            src=""
            alt="albums_cover_image"
          />
          <button>
            <img
              className="album-create-modal__button-image"
              alt="button_icon"
            />
          </button>
        </div>
        <p className="album-create-modal__name">Album Name</p>
        <div className="album-create-modal__name-box">
          <input
            className="album-create-modal__name-box__input"
            placeholder="Please enter the album name"
          >
            <span className="album-create-modal__name-box__input__length">
              {albumsName?.length || 0}/40
            </span>
          </input>
        </div>
        <div className="album-create-modal__button-box">
          <button className="album-create-modal__button__cancel">Cancel</button>
          <button className="album-create-modal__button__create">Create</button>
        </div>
      </div>
    </ModalWrap>
  );
};
export default AlbumsCreateModal;
