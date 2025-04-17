import { useState } from 'react';
import ModalWrap from './ModalWrap';

import './SongDeleteModal.scss';

const SongDeleteModal = ({ songData, setSongDeleteModal, handler }) => {
    const [isComplete, setIsComplete] = useState(false);

    const onClose = () => {
        setSongDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await handler();
            setIsComplete(true);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWrap title="Delete" onClose={onClose}>
            <div className="song-delete-modal">
                {isComplete ? (
                    <p className="song-delete-modal__message">The song has been deleted successfully</p>
                ) : (
                    <>
                        <p className="song-delete-modal__message">
                            Are you sure you want to delete this song?
                            <br />
                            You can still delete it later if you change your mind.
                        </p>
                        <p className="song-delete-modal__message">
                            Are you sure you want to delete
                            <br />
                            <span className="point">"{songData?.title}?"</span>
                        </p>
                    </>
                )}

                <div className="song-delete-modal__button-wrap">
                    {isComplete ? (
                        <button className="song-delete-modal__button delete-btn" onClick={onClose}>
                            OK
                        </button>
                    ) : (
                        <>
                            <button className="song-delete-modal__button cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="song-delete-modal__button delete-btn" onClick={handleDelete}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </ModalWrap>
    );
};

export default SongDeleteModal;
