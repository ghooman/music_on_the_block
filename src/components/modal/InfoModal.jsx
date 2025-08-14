import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import modalCloseImg from '../../assets/images/close.svg';
import copyIcon from '../../assets/images/icons/icons-copy.svg';
import './InfoModal.scss';

function InfoModal({ onClose, isMyProfile }) {
  const { t, i18n } = useTranslation('modal');
  // 한국어에서만 '개' 처리를 위해 사용
  const isKorean = i18n.language === 'ko';

  const artistInfo = {
    // country: '대한민국',
    joinDate: '2025. 06. 03',
    mintingNFT: 24,
    sellingNFT: 14,
    album: 7,
    collection: 0,
    franchiseCode: '443532QQD',
    licenseKey: '4382-9424-2823-4832',
  };
  return ReactDOM.createPortal(
    <div className="info-modal__overlay" onClick={onClose}>
      <div className="info-modal__container" onClick={e => e.stopPropagation()}>
        <div className="info-modal__header">
          <h2 className="info-modal__tit">Artist Information</h2>
          <button className="info-modal__close" onClick={onClose}>
            <img src={modalCloseImg} alt="Close" />
          </button>
        </div>

        <ul className="info-modal__content">
          <li>
            <h3>{t('Minting NFT')}</h3>
            <div>
              {artistInfo.mintingNFT}
              {isKorean ? '개' : ''}
            </div>
          </li>
          <li>
            <h3>{t('Selling NFT')}</h3>
            <div>
              {artistInfo.sellingNFT}
              {isKorean ? '개' : ''}
            </div>
          </li>
          <li>
            <h3>{t('Album')}</h3>
            <div>
              {artistInfo.album}
              {isKorean ? '개' : ''}
            </div>
          </li>
          <li>
            <h3>{t('Collection')}</h3>
            <div>
              {artistInfo.collection}
              {isKorean ? '개' : ''}
            </div>
          </li>
          <li className="info-modal__user-row">
            <h3>{t('Join Date')}</h3>
            <div>{artistInfo.joinDate}</div>
          </li>
          {isMyProfile && (
            <>
              <li className="info-modal__user-row">
                <h3>{t('Franchise Code')}</h3>
                <div className="copy-txt">
                  {artistInfo.franchiseCode}
                  <img src={copyIcon} alt="Copy" />
                </div>
              </li>
              <li className="info-modal__user-row">
                <h3>{t('Linked License Key')}</h3>
                <div>{artistInfo.licenseKey || '-'}</div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
}

export default InfoModal;
