import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './PreparingModal.scss';

const PreparingModal = ({ setPreparingModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // setIsPrivateModal(false);
    };
  });

  return (
    <ModalWrap
      title="PREPARING"
      onClose={() => setPreparingModal(false)}
      className="preparing"
    >
      <button
        className="preparing-btn"
        onClick={() => setPreparingModal(false)}
      >
        OK
      </button>
    </ModalWrap>
  );
};

export default PreparingModal;
