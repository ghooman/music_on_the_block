import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './EditAlbumModal.scss';
import { useNavigate } from 'react-router-dom';

const EditAlbumModal = ({ setIsEditAlbumModal, handleClick, songsCount, action }) => {
    const handler = async () => {
        await handleClick();
        if (action) {
            action();
        }

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
                Songs: <span>{songsCount}</span> songs
            </p>
            <div className="edit-modal__btns">
                <button onClick={() => setIsEditAlbumModal(false)}>Cancel</button>
                <button onClick={handler}>Edit</button>
            </div>
        </ModalWrap>
    );
};

export default EditAlbumModal;
