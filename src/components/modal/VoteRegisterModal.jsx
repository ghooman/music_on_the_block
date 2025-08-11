
import ModalWrap from '../ModalWrap';
import { useTranslation } from 'react-i18next';

function VoteRegisterModal() {
    const { t } = useTranslation('modal');
  return (
    <ModalWrap onClose={setShowModal} title={t(title) || ''}>
      <div className="modal">

      </div>
    </ModalWrap>
  );
};

export default VoteRegisterModal