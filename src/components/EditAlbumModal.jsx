import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './EditAlbumModal.scss';

const EditAlbumModal = ({ setIsEditAlbumModal, handleClick }) => {
    const handler = async () => {
        await handleClick();
        setIsEditAlbumModal(false);
    };

    return (
        <ModalWrap title="EDIT MODAL" onClose={() => setIsEditAlbumModal(false)} className="edit-modal">
            <p className="edit-modal__txt">
                The album will be updated soon.
                <br />
                Would you like to update the album
                <br />
                with the selected songs?
                <br />
                <br />
                Songs: <span>0</span> songs
            </p>
            <div className="edit-modal__btns">
                <button onClick={() => setIsEditAlbumModal(false)}>Cancel</button>
                <button onClick={handler}>Edit</button>
            </div>
        </ModalWrap>
    );
};

export default EditAlbumModal;
