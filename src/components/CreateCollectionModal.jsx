import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ModalWrap from './ModalWrap';
import { createNftCollection } from '../api/nfts/nftCollectionsApi';

import './CreateCollectionModal.scss';
import demoImg from '../assets/images/demo-cover-img.png';
import loadIcon from '../assets/images/img-load-btn.svg';

const CreateCollectionModal = ({ setShowCollectionModal, fetchMyNftCollections }) => {
  const { token } = useContext(AuthContext);
  const [preview, setPreview] = useState(demoImg);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [collectionName, setCollectionName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('Image size must be under 4MB');
      return;
    }

    // 파일 형식 체크
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrorMessage('Only jpg or png format is allowed');
      return;
    }

    setSelectedFile(file);
    const newUrl = URL.createObjectURL(file);
    setPreview(newUrl);
    setErrorMessage('');

    return () => URL.revokeObjectURL(newUrl);
  };

  const handleCreateCollection = async () => {
    if (!collectionName.trim()) {
      setErrorMessage('Please enter a collection name');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('payload', JSON.stringify({ name: collectionName.trim() }));

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        // 이미지가 없을 경우 demoImg를 사용
        const response = await fetch(demoImg);
        const blob = await response.blob();
        formData.append('image', blob, 'demo-cover-img.png');
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      await createNftCollection(token, formData);
      await fetchMyNftCollections(token); // 컬렉션 생성 후 리스트 업데이트
      setShowCollectionModal(false);
    } catch (error) {
      console.error('Collection creation failed:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to create collection. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrap
      title="Create New Collection"
      onClose={() => setShowCollectionModal(false)}
      className="create-collection-modal"
    >
      <p className="create-collection-modal__small-txt">(jpg, png, under 4MB)</p>
      <div className="create-collection-modal__img-load">
        <img src={preview} alt="img-load" />
        <button
          type="button"
          className="create-collection-modal__img-load__btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <img src={loadIcon} alt="loadIcon" />
        </button>
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <dl className="create-collection-modal__input-box">
        <dt>Collection name</dt>
        <dd>
          <input
            placeholder="Please enter a collection name"
            value={collectionName}
            onChange={e => {
              setCollectionName(e.target.value);
              setErrorMessage('');
            }}
            disabled={isLoading}
          />
        </dd>
      </dl>
      {errorMessage && (
        <p className="create-collection-modal__error" style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </p>
      )}
      <div className="create-collection-modal__btns">
        <button
          className="create-collection-modal__btns__cancel"
          onClick={() => setShowCollectionModal(false)}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          className={`create-collection-modal__btns__ok ${
            !isLoading ? 'create-collection-modal__btns__ok' : 'disabled'
          } ${collectionName.trim() ? 'create-collection-modal__btns__ok' : 'disabled'}`}
          onClick={handleCreateCollection}
          disabled={!collectionName.trim() || isLoading}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </ModalWrap>
  );
};

export default CreateCollectionModal;
