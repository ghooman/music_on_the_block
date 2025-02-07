import ModalWrap from '../components/ModalWrap';

import './SkipModal.scss';

const SkipModal = ({ setSkipModal }) => {
    return <ModalWrap onClose={setSkipModal}></ModalWrap>;
};

export default SkipModal;
