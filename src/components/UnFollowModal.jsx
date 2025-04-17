import ModalWrap from './ModalWrap';

import './UnFollowModal.scss';

/**
 * @param {function} setUnFollowModal : 모달 조작 함수
 * @param {object} profileData : 프로필 데이터
 * @param {function} handleClick : 함수 정의
 * @returns
 */
const UnFollowModal = ({ setUnFollowModal, profileData, handleClick }) => {
    return (
        <ModalWrap
            onClose={setUnFollowModal}
            title="Unfollow"
            // title={`Do you want to Unfollow '${profileData?.name || profileData?.artist}'?`}
        >
            <div className="unfollow-modal">
                <p className="unfollow-modal__message">
                    {`Do you want to Unfollow '${profileData?.name || profileData?.artist}'?`}
                </p>

                <div className="unfollow-modal__button-wrap">
                    <button onClick={() => setUnFollowModal(false)} className="unfollow-modal__button no">
                        NO
                    </button>
                    <button
                        onClick={async () => {
                            await handleClick();
                            setUnFollowModal(false);
                        }}
                        className="unfollow-modal__button yes"
                    >
                        YES
                    </button>
                </div>
            </div>
        </ModalWrap>
    );
};

export default UnFollowModal;
