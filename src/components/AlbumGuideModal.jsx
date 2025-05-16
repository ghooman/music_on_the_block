import ModalWrap from './ModalWrap';

import './AlbumGuideModal.scss';

const AlbumGuideModal = ({ setAlbumGuideModal }) => {
  const onClose = () => {
    setAlbumGuideModal(false);
  };

  return (
    <ModalWrap title="NFT Status" onClose={onClose}>
      <div className="album-guide-modal">
        <p className="album-guide-modal__text">
          This song was created using AI lyrics & songwriting.
        </p>
        <p className="album-guide-modal__text">
          The NFT release and trading process proceeds as follows
        </p>
        <br />
        <GuideItem title="Release">Pulbish the song and prepare it for NFT minting.</GuideItem>
        <GuideItem title="Mint">
          Register the song as an NFT on the blockchain.
          <br />
          (You will select a collection during this step.)
        </GuideItem>
        <GuideItem title="Sell">
          List the NFT for sale on the marketplace.
          <br />
          (Includes setting the price, sale period, etc.)
        </GuideItem>
        <GuideItem title="Cancel">
          Cancel a listed sale and return the NFT to your storage.
          <br />
          (You can relist it for sale anytime.)
        </GuideItem>
        <GuideItem title="Buy">
          Purchase NFTs listed by other users.
          <br />
          (Connect your wallet and proceed with payment.)
        </GuideItem>
        <p className="album-guide-modal__text">
          → The purchased NFT will be stored in your wallet in a "minted" state. If you wish to sell
          it, you must manually list it using the Sell process.
        </p>
        <button className="album-guide-modal__button" onClick={onClose}>
          OK
        </button>
      </div>
    </ModalWrap>
  );
};

export default AlbumGuideModal;

const GuideItem = ({ children, title }) => {
  return (
    <>
      {title && <p className="album-guide-modal__text">• {title}</p>}
      <ul>
        <li>{children}</li>
      </ul>
      <br />
    </>
  );
};
