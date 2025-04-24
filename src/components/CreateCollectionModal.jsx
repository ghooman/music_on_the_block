import React, { useState, useRef } from 'react';
import ModalWrap from './ModalWrap';

import './CreateCollectionModal.scss';
import demoImg from '../assets/images/demo-cover-img.png';
import loadIcon from '../assets/images/img-load-btn.svg';

const CreateCollectionModal = ({setShowCollectionModal }) => {

        const [preview, setPreview] = useState(demoImg);   // 현재 표시할 이미지
        const fileInputRef = useRef(null);                 // 숨겨둔 <input type="file">
    
        // 버튼 클릭 → 파일 선택창 열기
        const openFileDialog = () => fileInputRef.current?.click();
    
        // 파일 선택 완료 시 이미지 교체
        const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // 새 미리보기 URL 생성 → state 갱신
        const newUrl = URL.createObjectURL(file);
        setPreview(newUrl);
    
        // 이전 URL 해제(메모리 관리)
        return () => URL.revokeObjectURL(newUrl);
        };

    return (
        <ModalWrap 
            title='Create New Collection' 
            onClose={() => setShowCollectionModal(false)} 
            className="create-collection-modal"
        >
            <p className='create-collection-modal__small-txt'>
            (jpg, png, under 4MB)
            </p>
            <div className='create-collection-modal__img-load'>
                <img src={preview} alt='img-load' />
                <button
                    type='button'
                    className='create-collection-modal__img-load__btn'
                    onClick={openFileDialog}
                >
                    <img src={loadIcon} alt='loadIcon' />
                </button>
                <input
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
            <dl className='create-collection-modal__input-box'>
                <dt>Collection name</dt>
                <dd>
                    <input placeholder='Please enter a collection name'/>
                </dd>
            </dl>
            <div className='create-collection-modal__btns'>
                <button 
                    className='create-collection-modal__btns__cancel'
                    onClick={()=>setShowCollectionModal(false)}
                >Cancel</button>
                <button className='create-collection-modal__btns__ok'
                    onClick={()=>setShowCollectionModal(false)}
                >Edit</button>
            </div>
        </ModalWrap>
    );
};

export default CreateCollectionModal;
