import { useEffect } from 'react';

import modalCloseImg from '../assets/images/close.svg';

import './ModalWrap.scss';

const ModalWrap = ({ className = '', children, onClose, title = 'MODAL' }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const modalClose = (e) => {
        // if (e.target.className === 'modal-wrap') {
        //     onClose(false);
        // }
        if (e.target.className.includes('modal-wrap')) {
            onClose(false);
        }
    };

    return (
        <div className={`modal-wrap ${className}`} onClick={(e) => modalClose(e)}>
            <div className="modal-content-box">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <img className="modal-close" src={modalCloseImg} onClick={() => onClose(false)} />
                </div>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default ModalWrap;
