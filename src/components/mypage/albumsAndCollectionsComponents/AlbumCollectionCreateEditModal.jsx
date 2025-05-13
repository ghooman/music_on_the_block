import { useContext, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

import ModalWrap from '../../ModalWrap';
import Loading from '../../Loading';

import UploadButtonImage from '../../../assets/images/icon/picture1.svg';
import defaultAlbumsImage from '../../../assets/images/intro/mob-album-cover.png';

import './AlbumCollectionCreateEditModal.scss';

const AlbumCollectionCreateEditModal = ({
  handleCreate,
  handleEdit,
  handleDelete,
  handleClose,
  editData,
  loading,
}) => {
  const [image, setImage] = useState(editData?.image || null);
  const [name, setName] = useState(editData?.name || '');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  //============
  // 이미지 미리보기
  //============
  const previewImage = useMemo(() => {
    if (!image) return null;
    else if (typeof image === 'string') return image;
    else return URL.createObjectURL(image);
  }, [image]);

  // 유효성 체크 (이미지 사이즈, 이름 길이)
  const invalidImageSize = image?.size > 3 * 1024 * 1024;
  const invalidNameSize = name?.length >= 40 || !name?.trim();

  // 모달 타이틀 정의
  const title = handleCreate ? 'Create' : handleEdit && handleDelete ? 'Edit' : 'Create';

  if (success) {
    return <Success title={success} onClose={handleClose} />;
  }

  return (
    <ModalWrap title={title} onClose={handleClose}>
      <div className="album-collection-module-create-edit-modal">
        <p className="album-collection-module-create-edit-modal__title">Album Cover Image</p>
        <span className="album-collection-module-create-edit-modal__size-info">
          (jpg, png, under 4MB)
        </span>
        <div className="album-collection-module-create-edit-modal__image-box">
          <img
            className="album-collection-module-create-edit-modal__image"
            src={previewImage || defaultAlbumsImage}
            alt="albums_cover_image"
          />

          <button onClick={() => fileInputRef.current.click()}>
            <img
              className="album-collection-module-create-edit-modal__button-image"
              src={UploadButtonImage}
              alt="button_icon"
            />
          </button>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={e => {
              setImage(e.target.files[0]);
            }}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <p className="album-collection-module-create-edit-modal__name">Album Name</p>
        <div className="album-collection-module-create-edit-modal__name-box">
          <input
            className="album-collection-module-create-edit-modal__name-box__input"
            placeholder="Please enter the album name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={40}
          />
          <span className="album-collection-module-create-edit-modal__name-box__input__length">
            {name.length}/40
          </span>
        </div>

        {/* {errorMessage && (
          <p className="album-collection-module-create-edit-modal__error-message">{errorMessage}</p>
        )} */}

        <div className="album-collection-module-create-edit-modal__button-box">
          <button
            className="album-collection-module-create-edit-modal__button cancel-button"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          {handleEdit && (
            <button
              className={`album-collection-module-create-edit-modal__button create-button${
                loading ? ' disabled' : ''
              }`}
              onClick={() => handleEdit()}
              disabled={loading || invalidImageSize || invalidNameSize}
            >
              {loading ? <Loading /> : 'Edit'}
            </button>
          )}

          {handleCreate && (
            <button
              className={`album-collection-module-create-edit-modal__button create-button${
                loading ? ' disabled' : ''
              }`}
              onClick={async () => {
                await handleCreate({ image, name: name?.trim() });
                setSuccess('Album create success!');
              }}
              disabled={loading || invalidImageSize || invalidNameSize}
            >
              {loading ? <Loading /> : 'Create'}
            </button>
          )}
        </div>
        {handleEdit && handleDelete && (
          <button
            className="album-collection-module-create-edit-modal__button delete-button"
            onClick={() => null}
          >
            Delete
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default AlbumCollectionCreateEditModal;

const Success = ({ title, onClose }) => {
  return <ModalWrap title={title} onClose={onClose}></ModalWrap>;
};
