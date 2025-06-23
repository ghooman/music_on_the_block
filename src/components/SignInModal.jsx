import ModalWrap from '../components/ModalWrap';
import ExpandedButton from './create/ExpandedButton';

import lightBulb from '../assets/images/icon/lightbulb.svg';
import googleIcon from '../assets/images/google-icon.svg';

import './SignInModal.scss';

const SignInModal = ({ login, setSignInModal, setLogin }) => {
  return (
    <ModalWrap title="Log in" onClose={setSignInModal}>
      <div className="sign-modal">
        <button
          className="sign-modal__item"
          onClick={() => {
            setSignInModal(false);
            setLogin(true);
          }}
        >
          <img src={googleIcon} />
          Sign in with Google
        </button>
      </div>
    </ModalWrap>
  );
};

export default SignInModal;
