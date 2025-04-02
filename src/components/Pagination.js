import React, { useEffect, useState } from "react";
import "./Pagination.scss";

/**
 *
 * @param {number} page - 현재 선택된 페이지
 * @param {function} setPage - 현재 선택된 페이지를 변경하는 함수 (콜백함수)
 * @param {number} totalCount - 보여줄 데이터의 총 개수
 * @param {number} viewCount - 보여줄 데이터의 개수
 */
const Pagination = ({ page, setPage, totalCount, viewCount }) => {
  const [totalPages, setTotalPages] = useState([]);
  const pageCount = Math.ceil(totalCount / viewCount);

  const handleNext = () => {
    if (page >= pageCount - 1) return;
    setPage(page + 1);
  };

  const handlePrev = () => {
    if (page <= 0) return;
    setPage(page - 1);
  };

  useEffect(() => {
    let pages = Math.ceil(totalCount / viewCount);
    let index = Math.floor(page / 5);
    let array = new Array(pages || 0).fill(null).map((_item, index) => index);
    setTotalPages(array.slice(index * 5, index * 5 + 5));
  }, [page, totalCount, viewCount]);

  return (
    <>
      <ul className="pagination">
        <li className="pagination__one" onClick={() => setPage(0)}>
          처음
        </li>
        <li className="pagination__prev" onClick={handlePrev}>
          이전
        </li>
        {totalPages.map((item, index) => {
          return (
            <li
              className={`${page === item ? "active" : ""}`}
              key={index}
              onClick={() => setPage(item)}
            >
              <p>{item + 1}</p>
            </li>
          );
        })}
        <li className="pagination__next" onClick={handleNext}>
          다음
        </li>
        <li className="pagination__last" onClick={() => setPage(pageCount - 1)}>
          맨끝
        </li>
      </ul>
    </>
  );
};

export default Pagination;
