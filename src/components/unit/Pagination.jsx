import { useEffect, useState } from 'react';
import './Pagination.scss';
import { useSearchParams } from 'react-router-dom';

/**
 *
 * @param {number} totalCount : 데이터의 총 개수
 * @param {number} slice : 몇 개로 자를지
 * @param {function} handler : 페이지네이션 핸들러 함수
 * @param {number | string} page : 현재 페이지 (state or query parameter) 1부터
 * @returns JSX
 */
const Pagination = ({ totalCount = 1, viewCount = 1, handler, page = 1 }) => {
    const [pages, setPages] = useState([]);
    const [_, setSearchParams] = useSearchParams();
    const nowPage = parseInt(page); // 문자열일 경우 버그 발생 가능성이 있어 정수형으로 파싱을 합니다.
    const max = pages?.length;
    const min = 1;

    useEffect(() => {
        let array = [];
        const count = Math.ceil(totalCount / viewCount);
        for (let i = 1; i <= count; i++) {
            array.push(i);
        }
        setPages(array);

        if (!handler) {
            setSearchParams(
                (prev) => {
                    return { ...Object.fromEntries(prev), page: 1 };
                },
                { replace: true }
            );
        }
    }, [totalCount, viewCount]);

    const handlePage = (page) => {
        if (page >= min && page <= max) {
            if (handler) {
                // State로 페이지 조작할 때
                handler(page);
                return;
            } else {
                // 쿼리파라미터로 조작 시
                setSearchParams((prev) => {
                    return { ...Object.fromEntries(prev), page: page };
                });
            }
        }
    };

    if (totalCount === 0 || !viewCount) return;

    return (
        <div className="unit-component-pagination">
            <div className="unit-component-pagination-content">
                <div
                    className="unit-component-pagination-content__page prev"
                    onClick={() => handlePage(nowPage - 1)}
                ></div>
                {pages
                    .slice(Math.floor((nowPage - 1) / 5) * 5, 5 + Math.floor((nowPage - 1) / 5) * 5)
                    .map((item, index) => (
                        <button
                            key={index}
                            className={`unit-component-pagination-content__page ${nowPage === item && 'enable'}`}
                            onClick={() => handlePage(item)}
                        >
                            {item}
                        </button>
                    ))}
                <div
                    className="unit-component-pagination-content__page next"
                    onClick={() => handlePage(nowPage + 1)}
                ></div>
            </div>
        </div>
    );
};

export default Pagination;
