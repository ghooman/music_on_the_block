import ModalWrap from './ModalWrap';
import ExpandedButton from '../components/create/ExpandedButton';

import logoIcon from '../assets/images/header/logo.svg';

import './CreateCompleteModal.scss';
import { useNavigate } from 'react-router-dom';

const CreateCompleteModal = ({ setCreateCompleteModal }) => {
    const navigate = useNavigate();

    return (
        <ModalWrap onClose={setCreateCompleteModal} title="Congratulations">
            <div className="modal__create-complete">
                <div className="create-complete__logo-text">
                    <img src={logoIcon} alt="logo" />
                    <p>
                        MUSIC ON
                        <br />
                        THE BLOCK
                    </p>
                </div>
                <p className="create-complete__text">Successfully uploaded to the album!</p>
                {/* <button className="create-complete__button" onClick={() => navigate('/')}>
                    OK
                </button> */}
                <ExpandedButton
                    title="OK"
                    buttonColor="#cf0"
                    color="#1a1a1a"
                    borderRadius={12}
                    onClick={() => navigate('/')}
                    style={{ height: 48, width: '100%', fontFamily: 'orbitron600' }}
                />
            </div>
        </ModalWrap>
    );
};

export default CreateCompleteModal;
