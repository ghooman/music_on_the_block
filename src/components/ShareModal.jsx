import { useEffect, useState } from 'react';
import ModalWrap from './ModalWrap';
import { useTranslation } from 'react-i18next';

import checkIcon from '../assets/images/check-icon.svg';
import copyIcon from '../assets/images/menu/content-copy-icon.svg';
import './ShareModal.scss';

const ShareModal = ({ setShareModal, shareUrl, title }) => {
  const { t } = useTranslation('modal');

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = `${shareUrl}\n\nTitle: ${title}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <ModalWrap title={t('SHARE')} onClose={() => setShareModal(false)} className="share-modal">
      <div className="share-modal__link">
        <p className="share-modal__link__txt">{shareUrl}</p>
        <button className="share-modal__link__btn" onClick={copyToClipboard}>
          {!copied && <img src={copyIcon} alt="copy" />}
          {copied && <img src={checkIcon} alt="check" />}
        </button>
      </div>
    </ModalWrap>
  );
};

export default ShareModal;
