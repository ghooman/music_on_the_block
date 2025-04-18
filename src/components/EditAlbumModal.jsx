import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './EditAlbumModal.scss';

const EditAlbumModal = ({ setIsEditAlbumModal }) => {
    return (
        <ModalWrap title="EDIT MODAL" onClose={() => setIsEditAlbumModal(false)} className="edit-modal">
            <p className='edit-modal__txt'>
                The album will be updated soon.<br/>
                Would you like to update the album<br/>
                with the selected songs?
                <br/>
                <br/>
                Songs: <span>0</span> songs
            </p>
            <div className='edit-modal__btns'>
                <button onClick={()=>setIsEditAlbumModal(false)}>Cancel</button>
                <button>Edit</button>
            </div>
        </ModalWrap>
    );
};

export default EditAlbumModal;
