import { useTranslation } from 'react-i18next';
import ModalWrap from './ModalWrap';

import './UnFollowModal.scss';

/**
 * @param {function} setUnFollowModal : 모달 조작 함수
 * @param {object} profileData : 프로필 데이터
 * @param {function} handleClick : 함수 정의
 * @returns
 */
const UnFollowModal = ({ setUnFollowModal, profileData, handleClick }) => {
  const { t } = useTranslation('modal');

  console.log(profileData, '프로필 데이터');

  return (
    <ModalWrap
      onClose={setUnFollowModal}
      title={t('Unfollow')}
      // title={`Do you want to Unfollow '${profileData?.name || profileData?.artist}'?`}
    >
      <div className="unfollow-modal">
        <p className="unfollow-modal__message">
          {t(`Do you want to Unfollow`)} {`${profileData?.name || profileData?.artist}?`}
        </p>

        <div className="unfollow-modal__button-wrap">
          <button onClick={() => setUnFollowModal(false)} className="unfollow-modal__button no">
            {t('NO')}
          </button>
          <button
            onClick={async () => {
              await handleClick();
              setUnFollowModal(false);
            }}
            className="unfollow-modal__button yes"
          >
            {t('YES')}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default UnFollowModal;
