import ModalWrap from '../../ModalWrap';

import './AlbumsNoticeModal.scss';

const AlbumsNoticeModal = ({ setAlbumsNoticeModal }) => {
  const onClose = () => {
    setAlbumsNoticeModal(0);
  };

  return (
    <ModalWrap title="Notice" onClose={onClose}>
      <div className="albums-notice-modal">
        <p className="albums-notice-modal__message">
          Added, excluding the previously selected songs.
        </p>
        <button className="albums-notice-modal__button" onClick={onClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default AlbumsNoticeModal;
