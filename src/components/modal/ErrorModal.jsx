import ModalWrap from "../ModalWrap";

import "./ErrorModal.scss";

const ErrorModal = ({ title, setShowErrorModal, message }) => {
  return (
    <ModalWrap onClose={setShowErrorModal} title={title || ""}>
      <div className="error-modal">
        <div className="error-modal__logo-box"></div>
        <p className="error-modal__text">{message || "No Text"}</p>
      </div>
    </ModalWrap>
  );
};

export default ErrorModal;
