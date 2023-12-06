import React from "react";
import "./StorageModal.scss";

const StorageModal = ({ setStorageModal,onConfirm }) => {
  const handleStorageModalCancel = () => {
    setStorageModal((prev) => !prev);
    document.body.overflow = "";
  };
  const handleStorageModalConfirm = () => {
    onConfirm();
    setStorageModal((prev) => !prev);
    document.body.overflow = "";
  };
  return (
    <div className="storage-modal__background">
      <div className="storage-modal__box">
        <div className="storage-modal__title">내용을 저장하시겠습니까?</div>
        <div className="storage-modal__btn-box">
          <button
            className="storage-modal__cancel-btn"
            onClick={handleStorageModalCancel}
          >
            취소
          </button>
          <button
            className="storage-modal__confirm-btn"
            onClick={handleStorageModalConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageModal;
