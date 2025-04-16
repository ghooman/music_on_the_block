import axios from 'axios';
import ModalWrap from './ModalWrap';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {function} setUnFollowModal : 모달 조작 함수
 * @param {object} profileData : 프로필 데이터
 * @param {function} action : 언팔로우 후 실행할 함수
 * @returns
 */
const UnFollowModal = ({ setUnFollowModal, profileData, action, token }) => {
    console.log(profileData, '프로필 데이터');

    const handleUnFollowing = async () => {
        try {
            const res = await axios.post(`${serverApi}/api/user/${profileData?.id}/follow/cancel`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (action) {
                action();
                setUnFollowModal(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWrap onClose={setUnFollowModal} title={`Do you want to Unfollow '${profileData?.name}'?`}>
            <div className="unfollow-modal">
                <button onClick={() => setUnFollowModal(false)}>NO</button>
                <button onClick={handleUnFollowing}>YES</button>
            </div>
        </ModalWrap>
    );
};

export default UnFollowModal;
