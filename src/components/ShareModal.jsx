import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './ShareModal.scss';

const ShareModal = ({ setShareModal,shareUrl }) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('URL copied to clipboard!'))
      .catch((err) => {
        alert('Failed to copy!');
        console.error(err);
      });
  };

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
          {shareUrl}
        </p>
        <button 
          className='share-modal__link__btn'
          onClick={copyToClipboard}
        >
          Copy
        </button>
      </div>
    </ModalWrap>
  );
};

export default ShareModal;
