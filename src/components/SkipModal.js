import ModalWrap from '../components/ModalWrap';
import ExpandedButton from './create/ExpandedButton';

import lightBulb from '../assets/images/icon/lightbulb.svg';

import './SkipModal.scss';

const SkipModal = ({ setSkipModal, handler }) => {
    return (
        <ModalWrap title="Confirm Step Skip" onClose={setSkipModal}>
            <div className="modal__skip">
                <p className="skip-modal__desc">
                    You've chosen to skip the <span>Melody Maker</span> step.
                    <br />
                    This means your <span>final result</span> will include <span>Lyric only</span>, without any
                    Melodies.
                </p>
                <p className="skip-modal__desc">Would You like to proceed or go back to complete this step?</p>
                <div className="skip-modal__sub-desc">
                    <img src={lightBulb} alt="icon" />
                    You can always revisit this step later if needed.
                </div>
                <div className="skip-modal__button-wrap">
                    {/* <button className="skip-modal__button go-back" onClick={() => setSkipModal(false)}>
                        Go Back
                    </button>
                    <button className="skip-modal__button yes-continue" onClick={handler}>
                        Yes, Continue
                    </button> */}
                    <Buttons title="Go Back" handler={() => setSkipModal(false)} />
                    <Buttons title="Yes, Continue" handler={handler} />
                </div>
            </div>
        </ModalWrap>
    );
};

export default SkipModal;

const Buttons = ({ title, handler }) => {
    let buttonColor;
    let color;
    let style;
    switch (title) {
        case 'Go Back':
            buttonColor = '#383838';
            color = '#f1f1f1';
            break;
        case 'Yes, Continue':
            style = { flex: 1 };
            buttonColor = '#cf0';
            color = '#1a1a1a';
            break;
        default:
    }

    return (
        <ExpandedButton
            title={title}
            borderRadius={12}
            buttonColor={buttonColor}
            color={color}
            style={{ padding: '8px 10px', fontFamily: 'orbitron600', ...style }}
            onClick={handler}
        />
    );
};
