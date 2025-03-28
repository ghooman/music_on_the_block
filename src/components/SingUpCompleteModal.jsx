import ModalWrap from "./ModalWrap";
import ExpandedButton from "../components/create/ExpandedButton";

import logoIcon from "../assets/images/header/logo.svg";

import "./CreateCompleteModal.scss";
import { Link, useNavigate } from "react-router-dom";

const SingUpCompleteModal = ({ setShowModal, message, link }) => {
  const navigate = useNavigate();

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
        <Link to={link}>Ok</Link>
      </div>
    </ModalWrap>
  );
};

export default SingUpCompleteModal;
