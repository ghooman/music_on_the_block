import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './NftConfirmModal.scss';

const NftConfirmModal = ({ setShowModal,title,confirmSellTxt,confirmMintTxt,setShowSuccessModal }) => {




    return (
        <ModalWrap title={title} onClose={() => setShowModal(false)} className="confirm-modal">
            
            <dl>
                {confirmSellTxt && <dt>[Item Name]</dt>}
                {confirmMintTxt && <dt>Confirm minting: [Item Name]</dt>}
                <dd>
                    Network gas fees may apply. 
                    No refund or cancellation after purchase.
                </dd>
            </dl>
            <div className='confirm-modal__btns'>
                <button 
                    className='confirm-modal__btns__cancel'
                    onClick={()=>setShowModal(false)}
                >Cancel</button>
                {confirmSellTxt && 
                    <button className='confirm-modal__btns__ok'
                    onClick={() => {
                        setShowModal(false);
                        setShowSuccessModal(true);
                    }}
                    >Sell</button>
                }
            </div>
        </ModalWrap>
    );
};

export default NftConfirmModal;
