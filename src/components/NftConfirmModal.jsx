import ModalWrap from './ModalWrap';
import { mintNft } from '../api/nfts/nftMintApi';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './NftConfirmModal.scss';

const NftConfirmModal = ({
  setShowModal,
  title,
  confirmSellTxt,
  confirmMintTxt,
  setShowSuccessModal,
  selectedCollection,
  songId,
}) => {
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleMint = async () => {
    setIsLoading(true);
    const response = await mintNft(token, songId, selectedCollection?.id);
    if (response.status === 'success') {
      setShowModal(false);
      setShowSuccessModal(true);
    } else {
      console.error('error', response);
    }
    setIsLoading(false);
  };

  return (
    <ModalWrap title={title} onClose={() => setShowModal(false)} className="confirm-modal">
      <dl>
        {confirmSellTxt && <dt>[{selectedCollection?.name}]</dt>}
        {confirmMintTxt && <dt>Confirm minting: [{selectedCollection?.name}]</dt>}
        <dd>Network gas fees may apply. No refund or cancellation after purchase.</dd>
      </dl>
      <div className="confirm-modal__btns">
        <button className="confirm-modal__btns__cancel" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        {confirmMintTxt && (
          <button
            className="confirm-modal__btns__ok"
            onClick={() => {
              handleMint();
            }}
          >
            {isLoading ? 'Minting...' : 'Mint'}
          </button>
        )}

        {confirmSellTxt && (
          <button
            className="confirm-modal__btns__ok"
            onClick={() => {
              setShowModal(false);
              setShowSuccessModal(true);
            }}
          >
            Sell
          </button>
        )}
      </div>
    </ModalWrap>
  );
};

export default NftConfirmModal;
