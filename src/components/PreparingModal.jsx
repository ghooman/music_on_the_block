import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './PreparingModal.scss';

const PreparingModal = ({ setPreparingModal }) => {
  return (
    <ModalWrap title="PREPARING" onClose={() => setPreparingModal(false)} className="preparing">
      <button className="preparing-btn" onClick={() => setPreparingModal(false)}>
        OK
      </button>
    </ModalWrap>
  );
};

export default PreparingModal;
