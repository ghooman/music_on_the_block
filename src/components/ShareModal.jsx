import { useEffect, useState } from "react";
import ModalWrap from "./ModalWrap";

import checkIcon from "../assets/images/check-icon2.svg";
import "./ShareModal.scss";

const ShareModal = ({ setShareModal, shareUrl, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = `${shareUrl}\n\nTitle: ${title}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        alert("Failed to copy!");
        console.error(err);
      });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <ModalWrap
      title="SHARE"
      onClose={() => setShareModal(false)}
      className="share-modal"
    >
      <div className="share-modal__link">
        <p className="share-modal__link__txt">{shareUrl}</p>
        <button className="share-modal__link__btn" onClick={copyToClipboard}>
          {!copied && <span>Copy</span>}
          {copied && <img src={checkIcon} alt="check" />}
        </button>
      </div>
    </ModalWrap>
  );
};

export default ShareModal;
