import ModalWrap from "../ModalWrap";

import logoIcon from "../../assets/images/header/logo-png.png";

import "./ErrorModal.scss";
import { useNavigate } from "react-router-dom";

const ErrorModal = ({ title, setShowErrorModal, message }) => {
  const navigate = useNavigate();

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
