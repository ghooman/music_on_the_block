import { useEffect } from "react";
import ModalWrap from "./ModalWrap";

import "./ServiceUpdateModal.scss";

const ServiceUpdateModal = ({ setServiceUpdateModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // setIsPrivateModal(false);
    };
  });

  return (
    <ModalWrap
      title="Service Update"
      onClose={() => setServiceUpdateModal(false)}
      className="service-updating"
    >
      <p className="service-updating-text">
        We're currently updating our service.
      </p>
      <button
        className="service-updating-btn"
        onClick={() => setServiceUpdateModal(false)}
      >
        OK
      </button>
    </ModalWrap>
  );
};

export default ServiceUpdateModal;
