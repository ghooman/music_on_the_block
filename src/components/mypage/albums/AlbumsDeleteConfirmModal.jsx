import { useContext, useState } from 'react';
import axios from 'axios';

import ModalWrap from '../../ModalWrap';

import { deleteAlbumsList } from '../../../api/AlbumsListApi';

import './AlbumsDeleteConfirmModal.scss';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AlbumsDeleteConfirmModal = ({ setAlbumsDeleteConfirmModal, albumData, completeAction }) => {
  const { token } = useContext(AuthContext);
  const [isDelete, setIsDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //==================
  // 앨범 삭제 핸들러
  //==================
  const handleAlbumsDelete = async () => {
    try {
      const res = await deleteAlbumsList(albumData.id, token);
      setIsDelete(true);
    } catch (e) {
      console.error(e);
    }
  };

  // JSX
  if (!token) return;
  else if (!isDelete)
    return (
      <Confirm
        onClose={() => setAlbumsDeleteConfirmModal(false)}
        handleAlbumsDelete={handleAlbumsDelete}
        albumData={albumData}
      />
    );
  else if (isDelete) return <Complete onClose={completeAction} />;
};

export default AlbumsDeleteConfirmModal;

//=================
//=================
//=================
const Confirm = ({ onClose, handleAlbumsDelete, albumData }) => {
  return (
    <ModalWrap title="Delete Album" onClose={onClose}>
      <div className="albums-delete-confirm-modal">
        <p className="albums-delete-confirm-modal__message">
          This action cannot be undone
          <br />
          All tracks in this album will also be permanently deleted.
        </p>
        <p className="albums-delete-confirm-modal__message">
          Are you sure want to delete
          <br />
          <span>"{albumData?.album_name}"?</span>
        </p>
        <div className="albums-delete-confirm-modal__buttons">
          <button className="confirm-button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button delete-button" onClick={handleAlbumsDelete}>
            Delete Album
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

const Complete = ({ onClose }) => {
  return (
    <ModalWrap>
      <div className="albums-delete-confirm-modal">
        <p className="albums-delete-confirm-modal__message text-center">
          Album deleted successfully.
        </p>
        <div className="albums-delete-confirm-modal__buttons">
          <button className="confirm-button ok-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};
