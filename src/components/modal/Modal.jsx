import ModalWrap from '../ModalWrap';

import logoIcon from '../../assets/images/header/logo-png.png';

import './Modal.scss';
import { useNavigate } from 'react-router-dom';

const Modal = ({ title, setShowModal, message, handleClick }) => {
  const navigate = useNavigate();

  return (
    <ModalWrap onClose={setShowModal} title={title || ''}>
      <div className="modal">
        <div className="modal__logo-box">
          <img src={logoIcon} alt="logo" />
          <p>
            MUSIC ON
            <br />
            THE BLOCK
          </p>
        </div>
        <p className="modal__text">{message || 'No Text'}</p>
        {handleClick && (
          <button className="modal__button" onClick={() => handleClick()}>
            Ok
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default Modal;
