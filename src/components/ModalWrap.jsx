import { useEffect } from 'react';

import modalCloseImg from '../assets/images/close.svg';

import './ModalWrap.scss';

const ModalWrap = ({ className = '', children, onClose, title = 'MODAL', closeIcon = true }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const modalClose = e => {
    if (typeof e.target.className === 'string' && e?.target?.className?.includes('modal-wrap')) {
      onClose(false);
    }
  };

  return (
    <div className={`modal-wrap ${className}`} onClick={e => modalClose(e)}>
      <div className="modal-content-box">
        <div className="modal-header">
          {closeIcon && (
            <img
              className="modal-close"
              src={modalCloseImg}
              onClick={() => onClose(false)}
              alt="close"
            />
          )}
          <h2 className="modal-title">{title}</h2>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrap;
