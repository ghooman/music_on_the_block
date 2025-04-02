import ModalWrap from "./ModalWrap";

import logoIcon from "../assets/images/header/logo.svg";

import "./CreateCompleteModal.scss";
import { Link } from "react-router-dom";

const SingUpCompleteModal = ({
  setShowModal,
  message,
  link,
  setIsRegistered,
}) => {
  return (
    <ModalWrap onClose={setShowModal} title="Congratulations">
      <div className="modal__create-complete">
        <div className="create-complete__logo-text">
          <img src={logoIcon} alt="logo" />
          <p>
            MUSIC ON
            <br />
            THE BLOCK
          </p>
        </div>
        <p className="create-complete__text">{message}</p>
        <Link to={link} onClick={() => setIsRegistered(true)}>
          Ok
        </Link>
      </div>
    </ModalWrap>
  );
};

export default SingUpCompleteModal;
