import { useState } from 'react';
import ModalWrap from './ModalWrap';

import './SongDeleteAndReleaseModal.scss';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './modal/ErrorModal';

const SongDeleteAndReleaseModal = ({ songData, setter, deleteHandler, releaseHandler, action }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const onClose = () => {
    if (!isComplete) {
      setter(false);
    } else if (errorMessage) {
      setErrorMessage(false);
    } else {
      if (action) action();
      setter(false);
    }
  };

  const handler = async () => {
    try {
      if (deleteHandler) {
        deleteHandler();
        setIsComplete(true);
        return;
      } else if (releaseHandler) {
        releaseHandler();
        setIsComplete(true);
        // setter(null);
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || 'Error');
      console.error(e);
    }
  };

  if (errorMessage) {
    return <ErrorModal setShowErrorModal={setErrorMessage} button message={errorMessage} />;
  }

  return (
    <ModalWrap title="Confirm" onClose={onClose}>
      <div className="song-delete-and-release-modal">
        {isComplete ? (
          <p className="song-delete-and-release-modal__message--complete">
            The song has been {deleteHandler && 'delete'} {releaseHandler && 'release'} successfully
          </p>
        ) : (
          <div className="song-delete-and-release-modal__message--box">
            <p className="song-delete-and-release-modal__title">Title : {songData?.title}</p>
            <p className="song-delete-and-release-modal__message">
              * Are you sure you want to {deleteHandler && 'delete'} {releaseHandler && 'release'}{' '}
              this song?
            </p>
          </div>
        )}

        <div className="song-delete-and-release-modal__button-wrap">
          {isComplete ? (
            <button className="song-delete-and-release-modal__button delete-btn" onClick={onClose}>
              OK
            </button>
          ) : (
            <>
              <button
                className="song-delete-and-release-modal__button cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="song-delete-and-release-modal__button delete-btn"
                onClick={handler}
              >
                {deleteHandler && 'Delete'}
                {releaseHandler && 'Release'}
              </button>
            </>
          )}
        </div>
      </div>
    </ModalWrap>
  );
};

export default SongDeleteAndReleaseModal;
