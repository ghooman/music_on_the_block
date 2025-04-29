import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './PreparingModal.scss';

const PreparingModal = ({ setShowPreparingModal }) => {
  return (
    <ModalWrap title="PREPARING" onClose={() => setShowPreparingModal(false)} className="preparing">
      <button className="preparing-btn" onClick={() => setShowPreparingModal(false)}>
        OK
      </button>
    </ModalWrap>
  );
};

export default PreparingModal;
