import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './ShareModal.scss';

const ShareModal = ({ setShareModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // setIsPrivateModal(false);
    };
  });

  return (
    <ModalWrap
      title="SHARE"
      onClose={() => setShareModal(false)}
      className="share-modal"
    >
      <div className='share-modal__link'>
        <p className='share-modal__link__txt'>
          https://www.youtube.com/
        </p>
        <button className='share-modal__link__btn'>
          Copy
        </button>
      </div>
    </ModalWrap>
  );
};

export default ShareModal;
