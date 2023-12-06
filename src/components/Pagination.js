import React from "react";
import "./Pagination.scss";

const Pagination = ({ total, limit, page, setPage }) => {
  //          프롭스 정보            //
  // total : 배열의 Length          //
  // limit : 한 페이지에 보여줄 수  //
  // page : 페이지 변수            //
  // setPage : 페이지 set 함수    //

  // numPages 변수는 페이지를 수를 의미함
  const numPages = Math.ceil(total / limit); // Math.ceil() 주어진 숫자보다 크거나 같은 숫자 중 가장 작은 숫자를 integer 로 반환합니다. 예를 들어 1.3 = 2 반환 1 = 1, -4 = -4, -7.004 = -7, 0.95 = 1

  // 첫번째 페이지로 가는 handle
  const goToFirstPage = () => {
    setPage(1); //
    window.scrollTo(0, 0);
  };

  const goToLastPage = () => {
    setPage(numPages);
    window.scrollTo(0, 0);
  };

  return (
    <div className="paging-area">
      {/* 맨앞으로 가는 클릭 */}
      <button className="pagination-button" onClick={goToFirstPage}>
        «
      </button>
      {/* 이전으로가는 클릭, 클릭시 page -1 으로 set함수 실행 page가 1이 되면 < 이 비활성화 됨 */}
      <button
        className="pagination-button"
        onClick={() => {
          setPage(page - 1);
          window.scrollTo(0, 0);
        }}
        disabled={page === 1}
      >
        ‹
      </button>

      {/* 배열 선언 후 값 채우기 numPages의 모든 숫자를 출력하는거라 fill()에 인자를 넣지 않고 map((_, i) => i+1 ) 로 작성 */}
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <button
            className="pagination-button"
            key={i + 1}
            onClick={() => {
              setPage(i + 1);
              window.scrollTo(0, 0);
            }}
            // 현재 페이지 scss
            aria-current={page === i + 1 ? "page" : null}
          >
            {i + 1}
          </button>
        ))}

      <button
        className="pagination-button"
        onClick={() => {
          setPage(page + 1);
          window.scrollTo(0, 0);
        }}
        disabled={page === numPages}
      >
        ›
      </button>

      <button className="pagination-button" onClick={goToLastPage}>
        »
      </button>
    </div>
  );
};

export default Pagination;
