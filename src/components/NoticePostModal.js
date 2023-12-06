import React from "react";
import "../components/NoticePostModal.scss";
const NoticePostModal = ({ setNoticePostModal }) => {
  const handleCloseModal = () => {
    setNoticePostModal((prev) => !prev);
    document.body.style.overflow = "";
  };
  const handleModalBackground = (e) => {
    if (e.target === e.currentTarget) {
      setNoticePostModal((prev) => {
        document.body.style.overflow = "";
        return !prev;
      });
    }
  };

  return (
    <div className="notice-modal__background" onClick={handleModalBackground}>
      <div className="notice-modal__box">
        <h1 className="notice-modal__writing"> 공지사항 작성</h1>
        <form className="notice-modal__form">
          <p className="notice-modal__title">공지사항 제목</p>
          <input
            type="text"
            className="title__text"
            placeholder="공지사항 제목을 적어주세요."
          />
          <p className="notice-modal__content">공지사항 내용</p>
          <input
            type="textarea"
            className="content__input"
            placeholder="내용을 입력해주세요"
          />
          <div className="notice-modal__btn-box">
            <button
              className="notice-modal__cancel-btn"
              onClick={handleCloseModal}
            >
              취소
            </button>
            <button
              className="notice-modal__confirm-btn"
              onClick={handleCloseModal}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticePostModal;
