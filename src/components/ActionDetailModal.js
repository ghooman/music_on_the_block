import React from "react";
import "./ActionDetailModal.scss";
import dummy from "../assets/images/dummy2.png";
import closeIcon from "../assets/images/ci_close-big.svg";
const ActionDetailModal = ({ setActionListModal }) => {
  return (
    <div className="action-detail-modal__background">
      <button className="action-detail__close-icon">
        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={(e) => {
            setActionListModal((prev) => !prev);
            console.log(e.target);
          }}
        />
      </button>
      <div className="action-detail__title">조치사항 상세보기</div>
      <div className="action-detail__container">
        <div className="action-detail__left-box">
          <div className="left-box__video">
            <img src={dummy} alt="detailVideo" />
          </div>
        </div>
        <div className="action-detail__right-box">
          <div className="right-box__info">
            <span className="info__title">감지 일시</span>
            <div className="info__text">
              2022-00-00 00:00:00 ~ 2022-0000 00:00:30
            </div>
          </div>
          <div className="right-box__info">
            <span className="info__title">점포 위치</span>{" "}
            <div className="info__text">세븐일레븐 OOO점</div>
          </div>
          <div className="right-box__info">
            <span className="info__title">감지 내용</span>
            <div className="info__text">기물 파손</div>
          </div>
          <div className="right-box__info">
            <span className="info__title">조치 일시</span>
            <div className="info__text">2022-00-00 00:00:00</div>
          </div>
          <div className="right-box__info">
            <span className="info__title">확인자</span>
            <div className="info__text">김확인</div>
          </div>
          <div className="right-box__info">
            <span className="info__title">조치자</span>
            <div className="info__text">김조치</div>
          </div>
          <div className="right-box__info">
            <span className="info__title">위반자</span>
            <div className="info__text">김위반</div>
          </div>
          <div className="right-box__info">
            <span className="info__result-title">조치결과</span>
            <div className="info__result-text">기물파손에 대한 점포 응대</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionDetailModal;
