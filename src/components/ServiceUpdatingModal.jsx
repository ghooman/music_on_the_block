import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './ServiceUpdatingModal.scss';

const ServiceUpdatingModal = ({ setServiceUpdatingModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // setIsPrivateModal(false);
    };
  });

  return (
    <ModalWrap
      title="SERVICE UPDATING"
      onClose={() => setServiceUpdatingModal(false)}
      className="service-updating"
    >
      <p className='service-updating-text'>
        currently updating the service.
      </p>
      <button
        className="service-updating-btn"
        onClick={() => setServiceUpdatingModal(false)}
      >
        OK
      </button>
    </ModalWrap>
  );
};

export default ServiceUpdatingModal;
