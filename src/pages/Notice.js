import "../styles/Notice.scss";
import Header from "../components/Header";
import React, { useState } from "react";
import NoticePostModal from "../components/NoticePostModal";

import { FiEdit } from "react-icons/fi";
import { PiCaretRightBold } from "react-icons/pi";
import { PiCaretLeftBold } from "react-icons/pi";

const dummy = [
  { id: 1, text: "세븐일레븐 사당점 공지합니다.", day: "2023.01.18" },
  { id: 2, text: "세븐일레븐 강남점 공지합니다.", day: "2023.01.19" },
  { id: 3, text: "세븐일레븐 홍대점 공지합니다.", day: "2023.01.20" },
  { id: 4, text: "세븐일레븐 신촌점 공지합니다.", day: "2023.01.21" },
  { id: 5, text: "세븐일레븐 이태원점 공지합니다.", day: "2023.01.22" },
  { id: 6, text: "세븐일레븐 종로점 공지합니다.", day: "2023.01.23" },
  { id: 7, text: "세븐일레븐 명동점 공지합니다.", day: "2023.01.24" },
  { id: 8, text: "세븐일레븐 서초점 공지합니다.", day: "2023.01.25" },
  { id: 9, text: "세븐일레븐 강북점 공지합니다.", day: "2023.01.26" },
  { id: 10, text: "세븐일레븐 강동점 공지합니다.", day: "2023.01.27" },
  { id: 11, text: "세븐일레븐 강서점 공지합니다.", day: "2023.01.28" },
  { id: 12, text: "세븐일레븐 신림점 공지합니다.", day: "2023.01.29" },
  { id: 13, text: "세븐일레븐 잠실점 공지합니다.", day: "2023.01.30" },
  { id: 14, text: "세븐일레븐 노원점 공지합니다.", day: "2023.01.31" },
  { id: 15, text: "세븐일레븐 성북점 공지합니다.", day: "2023.02.01" },
  { id: 16, text: "세븐일레븐 서대문점 공지합니다.", day: "2023.02.02" },
  { id: 17, text: "세븐일레븐 은평점 공지합니다.", day: "2023.02.03" },
  { id: 18, text: "세븐일레븐 중랑점 공지합니다.", day: "2023.02.04" },
  { id: 19, text: "세븐일레븐 동대문점 공지합니다.", day: "2023.02.05" },
  { id: 20, text: "세븐일레븐 관악점 공지합니다.", day: "2023.02.06" },
  { id: 21, text: "세븐일레븐 구로점 공지합니다.", day: "2023.02.07" },
  { id: 22, text: "세븐일레븐 영등포점 공지합니다.", day: "2023.02.08" },
  { id: 23, text: "세븐일레븐 송파점 공지합니다.", day: "2023.02.09" },
  { id: 24, text: "세븐일레븐 강남역점 공지합니다.", day: "2023.02.10" },
  { id: 25, text: "세븐일레븐 홍대입구점 공지합니다.", day: "2023.02.11" },
  { id: 26, text: "세븐일레븐 서울대점 공지합니다.", day: "2023.02.12" },
  { id: 27, text: "세븐일레븐 고려대점 공지합니다.", day: "2023.02.13" },
  { id: 28, text: "세븐일레븐 건국대점 공지합니다.", day: "2023.02.14" },
  { id: 29, text: "세븐일레븐 한양대점 공지합니다.", day: "2023.02.15" },
  { id: 30, text: "세븐일레븐 서울시립대점 공지합니다.", day: "2023.02.16" },
  { id: 31, text: "세븐일레븐 홍익대점 공지합니다.", day: "2023.02.17" },
  { id: 32, text: "세븐일레븐 연세대점 공지합니다.", day: "2023.02.18" },
  { id: 33, text: "세븐일레븐 서강대점 공지합니다.", day: "2023.02.19" },
  { id: 34, text: "세븐일레븐 경희대점 공지합니다.", day: "2023.02.20" },
  { id: 35, text: "세븐일레븐 한국외대점 공지합니다.", day: "2023.02.21" },
  { id: 36, text: "세븐일레븐 이화여대점 공지합니다.", day: "2023.02.22" },
  { id: 37, text: "세븐일레븐 숙대점 공지합니다.", day: "2023.02.23" },
  { id: 38, text: "세븐일레븐 성신여대점 공지합니다.", day: "2023.02.24" },
  { id: 39, text: "세븐일레븐 한양여대점 공지합니다.", day: "2023.02.25" },
  { id: 40, text: "세븐일레븐 숭실대점 공지합니다.", day: "2023.02.26" },
  { id: 41, text: "세븐일레븐 동덕여대점 공지합니다.", day: "2023.02.27" },
  { id: 42, text: "세븐일레븐 서경대점 공지합니다.", day: "2023.02.28" },
  { id: 43, text: "세븐일레븐 경기대점 공지합니다.", day: "2023.03.01" },
  { id: 44, text: "세븐일레븐 수원대점 공지합니다.", day: "2023.03.02" },
  { id: 45, text: "세븐일레븐 성균관대점 공지합니다.", day: "2023.03.03" },
  { id: 46, text: "세븐일레븐 순천향대점 공지합니다.", day: "2023.03.04" },
  { id: 47, text: "세븐일레븐 계명대점 공지합니다.", day: "2023.03.05" },
  { id: 48, text: "세븐일레븐 아주대점 공지합니다.", day: "2023.03.06" },
  { id: 49, text: "세븐일레븐 충남대점 공지합니다.", day: "2023.03.07" },
  { id: 50, text: "세븐일레븐 경북대점 공지합니다.", day: "2023.03.08" },
];

const Notice = ({ setClickMenu }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(dummy.length / itemsPerPage); // ceil 을 써야 마지막 아이템이 한개라도있어도 페이지를 생성 시킬 수 있기때문에

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const reversedDummy = [...dummy].reverse();
  const currentItems = reversedDummy.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 공지 모달
  const [noticePostModal, setNoticePostModal] = useState(false);
  const handlePostModal = (e) => {
    setNoticePostModal((prev) => !prev);
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="notice">
      <div className="notice__container">
        <div className="notice__top-content">
          <h1 className="notice__title">공지사항</h1>
          <button className="notice__post" onClick={handlePostModal}>
            {/* 공지작성 */}
            <FiEdit />
          </button>
        </div>
        <div className="notice__list-box">
          <ul className="notice__list">
            {currentItems.map((item, index) => (
              <li className="notice__list-item" key={item.id}>
                <p className="list-item__index">{item.id}</p>
                <div className="list-item__wrapper">
                  <p className="list-item__text">{item.text}</p>
                  <p className="list-item__day">{item.day}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="notice__pagination">
          <div className="pagination__box">
            <button
              className="pagination__prev-button"
              onClick={() => handleClick(Math.max(1, currentPage - 1))}
            >
              <PiCaretLeftBold className="prev-button__PiCaretLeftBold"/>
              {/* Prev */}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                className={`pagination__button ${
                  currentPage === page ? "pagination__button-active" : ""
                }`}
                key={page}
                onClick={() => handleClick(page)}
              >
                {page}
                {/* 다섯개 단위로 끊을려면 생각해보기 */}
              </button>
            ))}
            <button
              className="pagination__next-button"
              onClick={() => handleClick(Math.min(totalPages, currentPage + 1))}
            >
              <PiCaretRightBold className="next-button__PiCaretRightBold"/>
              {/* Next */}
            </button>
          </div>
        </div>
      </div>
      {noticePostModal && (
        <NoticePostModal setNoticePostModal={setNoticePostModal} />
      )}
    </div>
  );
};

export default Notice;
