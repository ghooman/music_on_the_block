import ModalWrap from './ModalWrap';
import ExpandedButton from '../components/create/ExpandedButton';

import logoIcon from '../assets/images/header/logo.svg';

import './CreateCompleteModal.scss';
import { Link, useNavigate } from 'react-router-dom';

const SingUpCompleteModal = ({ setSingUpCompleteModal }) => {
    const navigate = useNavigate();

    return (
        <ModalWrap onClose={setSingUpCompleteModal} title="Congratulations">
            <div className="modal__create-complete">
                <div className="create-complete__logo-text">
                    <img src={logoIcon} alt="logo" />
                    <p>
                        MUSIC ON
                        <br />
                        THE BLOCK
                    </p>
                </div>
                <p className="create-complete__text">"Congratulations on signing up!"</p>
                <Link
                    to='/'
                >Ok
                </Link>
            </div>
        </ModalWrap>
    );
};

export default SingUpCompleteModal;
