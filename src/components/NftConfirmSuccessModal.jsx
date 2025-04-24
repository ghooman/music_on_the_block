import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './NftConfirmSuccessModal.scss';

const NftConfirmSuccessModal = ({ setShowSuccessModal,title }) => {




    return (
        <ModalWrap 
            title={title} 
            onClose={() => setShowSuccessModal(false)} 
            className="confirm-modal"
        >
            <div className='confirm-modal__btns'>
                <button className='confirm-modal__btns__ok'
                    onClick={()=>setShowSuccessModal(false)}
                >OK</button>
            </div>
        </ModalWrap>
    );
};

export default NftConfirmSuccessModal;
