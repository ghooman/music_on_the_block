import { useState } from 'react';
import ModalWrap from './ModalWrap';

import './SongDeleteAndReleaseModal.scss';

const SongDeleteAndReleaseModal = ({ songData, setter, deleteHandler, releaseHander }) => {
  const [isComplete, setIsComplete] = useState(false);

  const onClose = () => {
    setter(false);
  };

  const handler = async () => {
    try {
      if (deleteHandler) {
        deleteHandler();
        setIsComplete(true);
        return;
      } else if (releaseHander) {
        releaseHander();
        setter(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalWrap title="Confirm" onClose={onClose}>
      <div className="song-delete-and-release-modal">
        {isComplete ? (
          <p className="song-delete-and-release-modal__message">
            The song has been deleted successfully
          </p>
        ) : (
          <div className="song-delete-and-release-modal__message--box">
            <p className="song-delete-and-release-modal__title">Title : {songData?.title}</p>
            <p className="song-delete-and-release-modal__message">
              * Are you sure you want to {deleteHandler && 'delete'} {releaseHander && 'release'}{' '}
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
                {releaseHander && 'Release'}
              </button>
            </>
          )}
        </div>
      </div>
    </ModalWrap>
  );
};

export default SongDeleteAndReleaseModal;
