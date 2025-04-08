import { useEffect } from "react";
import ModalWrap from "./ModalWrap";

import "./LyricsModal.scss";

const LyricsModal = ({ setShowLyricsModal, generatedLyric }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // setIsPrivateModal(false);
    };
  });

  return (
    <ModalWrap
      title="LYRICS"
      onClose={() => setShowLyricsModal(false)}
      className="lyrics"
    >
      <pre className="lyrics__content">
        {generatedLyric || "No lyrics available"}
      </pre>
    </ModalWrap>
  );
};

export default LyricsModal;
