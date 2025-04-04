
import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './LyricsModal.scss';

const LyricsModal = ({ setLyricsModal }) => {
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
      onClose={() => setLyricsModal(false)}
      className="lyrics"
    >
        <div className="lyrics__content">
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
        sakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdfsakldjklasjgklasjghjkasdf
      </div>
    </ModalWrap>
  );
};

export default LyricsModal;
