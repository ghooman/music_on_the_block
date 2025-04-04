import ModalWrap from "../components/ModalWrap";
import ExpandedButton from "./create/ExpandedButton";

import lightBulb from "../assets/images/icon/lightbulb.svg";

import "./SkipModal.scss";

const SkipModal = ({ setSkipModal, handler }) => {
  return (
    <ModalWrap title="Confirm Step Skip" onClose={setSkipModal}>
      <div className="modal__skip">
        <p className="skip-modal__desc">
          You've chosen to skip the <span>Melody Maker</span> step.
          <br />
          This means your <span>final result</span> will include{" "}
          <span>Lyrics only</span>, without any Melodies.
        </p>
        <p className="skip-modal__desc">
          Would You like to proceed or go back to complete this step?
        </p>
        <div className="skip-modal__sub-desc">
          <img src={lightBulb} alt="icon" />
          You can always revisit this step later if needed.
        </div>
        <div className="skip-modal__button-wrap">
          <ExpandedButton
            className="skip-modal__button go-back"
            onClick={() => setSkipModal(false)}
          >
            Go Back
          </ExpandedButton>
          <ExpandedButton
            className="skip-modal__button yes-continue"
            onClick={handler}
          >
            Yes, Continue
          </ExpandedButton>
        </div>
      </div>
    </ModalWrap>
  );
};

export default SkipModal;
