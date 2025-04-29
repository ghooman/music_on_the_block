import { useState } from 'react';
import ModalWrap from './ModalWrap';

import './SongReleaseModal.scss';

const SongReleaseModal = ({ songData, setSongReleaseModal, handler }) => {
  const [isComplete, setIsComplete] = useState(false);

  const onClose = () => {
    setSongReleaseModal(false);
  };

  const handleRelease = async () => {
    try {
      await handler();
      setIsComplete(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalWrap title="Release" onClose={onClose}>
      <div className="song-release-modal">
        {isComplete ? (
          <p>Your song has been released successfully!</p>
        ) : (
          <>
            <p className="song-release-modal__message">
              Are you sure you want to release this song?
              <br />
              You can still delete it later if you change your mind.
            </p>
            <p className="song-release-modal__message">
              Are you sure you want to delete
              <br />
              <span className="point">"{songData?.title}"?</span>
            </p>
          </>
        )}

        <div className="song-release-modal__button-wrap">
          {isComplete ? (
            <button className="song-release-modal__button release-btn" onClick={onClose}>
              OK
            </button>
          ) : (
            <>
              <button className="song-release-modal__button cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="song-release-modal__button release-btn"
                onClick={() => handleRelease()}
              >
                Release
              </button>
            </>
          )}
        </div>
      </div>
    </ModalWrap>
  );
};

export default SongReleaseModal;
