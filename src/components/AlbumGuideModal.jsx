import ModalWrap from './ModalWrap';

import './AlbumGuideModal.scss';
import { useTranslation } from 'react-i18next';

const AlbumGuideModal = ({ setAlbumGuideModal }) => {
  const { t } = useTranslation('modal');

  const onClose = () => {
    setAlbumGuideModal(false);
  };

  return (
    <ModalWrap title={t('NFT Status')} onClose={onClose}>
      <div className="album-guide-modal">
        <p className="album-guide-modal__text">
          {t('This song was created using AI lyrics & songwriting.')}
        </p>
        <p className="album-guide-modal__text">
          {t('The NFT release and trading process proceeds as follows')}
        </p>
        <br />
        <GuideItem title={t('Release')}>
          {t('Pulbish the song and prepare it for NFT minting.')}
        </GuideItem>
        <GuideItem title={t('Mint')}>
          {t('Register the song as an NFT on the blockchain.')}
          <br />({t('You will select a collection during this step.')})
        </GuideItem>
        <GuideItem title={t('Sell')}>
          {t('List the NFT for sale on the marketplace.')}
          <br />({t('Includes setting the price, sale period, etc.')})
        </GuideItem>
        <GuideItem title={t('Cancel')}>
          {t('Cancel a listed sale and return the NFT to your storage.')}
          <br />({t('You can relist it for sale anytime.')})
        </GuideItem>
        <GuideItem title={t('Buy')}>
          {t('Purchase NFTs listed by other users.')}
          <br />({t('Connect your wallet and proceed with payment.')})
        </GuideItem>
        <p className="album-guide-modal__text">
          →{' '}
          {t(
            'The purchased NFT will be stored in your wallet in a "minted" state. If you wish to sell it, you must manually list it using the Sell process.'
          )}
        </p>
        <button className="album-guide-modal__button" onClick={onClose}>
          {t('OK')}
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
