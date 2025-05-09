// components/AlbumsCreateModal.js
import ModalWrap from '../../ModalWrap';
import { useState, useRef, useContext, useEffect } from 'react';
import './AlbumsCreateModal.scss';
import { createAlbumsList, updateAlbumsList } from '../../../api/AlbumsListApi';

import UploadButtonImage from '../../../assets/images/icon/picture1.svg';
import defaultAlbumsImage from '../../../assets/images/intro/mob-album-cover.png';
import { AuthContext } from '../../../contexts/AuthContext';
import AlbumsDeleteConfirmModal from './AlbumsDeleteConfirmModal';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';

const AlbumsCreateModal = ({ setShowCreateModal, status, onAlbumCreated, albumData }) => {
  const { token } = useContext(AuthContext);
  const [albumsImage, setAlbumsImage] = useState(null);
  const [albumsName, setAlbumsName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAlbums, setDeleteAlbums] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === 'edit' && albumData) {
      setAlbumsName(albumData.album_name || '');
      if (albumData.cover_image) {
        setAlbumsImage({
          preview: albumData.cover_image,
        });
      }
    }
  }, [status, albumData]);

  const handleImageUpload = e => {
    setErrorMessage('');
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('이미지 크기는 4MB 이하이어야 합니다.');
      return;
    }

    // 파일 형식 체크
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrorMessage('jpg 또는 png 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAlbumsImage({
        file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInputName = e => {
    setErrorMessage('');
    setAlbumsName(e.target.value);
  };

  const handleCreateAlbum = async () => {
    setErrorMessage('');
    if (!albumsName.trim()) {
      setErrorMessage('앨범 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        'payload',
        JSON.stringify({
          album_name: albumsName,
          album_id: status === 'edit' ? albumData.id : undefined,
        })
      );

      if (albumsImage?.file) {
        formDataToSend.append('cover_image', albumsImage.file);
      }

      const response = await createAlbumsList(formDataToSend, token, status === 'edit');

      if (response.status === 200 || response.status === 201) {
        await onAlbumCreated();
        setShowCreateModal(false);
      } else {
        setErrorMessage(
          status === 'edit'
            ? '앨범 수정에 실패했습니다.'
            : '앨범 생성에 실패했습니다. 다시 시도해주세요.'
        );
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(
          `${status === 'edit' ? '앨범 수정' : '앨범 생성'} 실패: ${error.response.data.message}`
        );
      } else {
        setErrorMessage(
          status === 'edit'
            ? '앨범 수정에 실패했습니다.'
            : '앨범 생성에 실패했습니다. 다시 시도해주세요.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAlbum = async () => {
    setErrorMessage('');
    if (!albumsName.trim()) {
      setErrorMessage('앨범 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let response;

      // 이미지 업데이트가 있는 경우 먼저 처리
      if (albumsImage?.file) {
        const imageFormData = new FormData();
        imageFormData.append('cover_image', albumsImage.file);
        imageFormData.append('payload', JSON.stringify({}));

        console.log('이미지 업데이트 API 호출 전 FormData:');
        for (let [key, value] of imageFormData.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        response = await updateAlbumsList(albumData.id, imageFormData, token);
      }

      // 이름 업데이트 처리
      const nameFormData = new FormData();
      nameFormData.append(
        'payload',
        JSON.stringify({
          album_name: albumsName,
        })
      );
      nameFormData.append('cover_image', '');

      console.log('이름 업데이트 API 호출 전 FormData:');
      for (let [key, value] of nameFormData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      response = await updateAlbumsList(albumData.id, nameFormData, token);

      if (response.status === 200 || response.status === 201) {
        await onAlbumCreated();
        setShowCreateModal(false);
      } else {
        setErrorMessage('앨범 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(`앨범 수정 실패: ${error.response.data.message}`);
      } else {
        setErrorMessage('앨범 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (status === 'edit') {
      await handleUpdateAlbum();
    } else {
      await handleCreateAlbum();
    }
  };

  if (deleteAlbums) {
    return (
      <AlbumsDeleteConfirmModal
        setAlbumsDeleteConfirmModal={setDeleteAlbums}
        albumData={albumData}
        setShowCreateModal={setShowCreateModal}
        completeAction={() => navigate('/my-page?category=Albums')}
      />
    );
  }
  const handleClose = () => {
    if (isLoading) return;

    setShowCreateModal(false);
  };

  return (
    <>
      <ModalWrap onClose={handleClose} title={status === 'edit' ? 'Edit Album' : 'Create Album'}>
        <div className="albums-create-modal">
          <p className="albums-create-modal__title">Album Cover Image</p>
          <span className="albums-create-modal__size-info">(jpg, png, under 4MB)</span>

          <div className="albums-create-modal__image-box">
            <img
              className="albums-create-modal__image"
              src={albumsImage?.preview || defaultAlbumsImage}
              alt="albums_cover_image"
            />
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current.click()}>
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
              onChange={handleInputName}
              maxLength={40}
            />
            <span className="albums-create-modal__name-box__input__length">
              {albumsName.length}/40
            </span>
          </div>

          {errorMessage && <p className="albums-create-modal__error-message">{errorMessage}</p>}

          <div className="albums-create-modal__button-box">
            <button
              className="albums-create-modal__button cancel-button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="albums-create-modal__button create-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loading/> : status === 'edit' ? 'Edit' : 'Create'}
            </button>
          </div>
          {status === 'edit' && (
            <button
              className="albums-create-modal__button delete-button"
              onClick={() => setDeleteAlbums(true)}
            >
              Delete
            </button>
          )}
        </div>
      </ModalWrap>
      
    </>
  );
};

export default AlbumsCreateModal;
