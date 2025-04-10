import { useEffect, useState } from 'react';
import './Pagination.scss';

/**
 *
 * @param {number} totalCount : 데이터의 총 개수
 * @param {number} slice : 몇 개로 자를지
 * @param {function} handler : 페이지네이션 핸들러 함수
 * @param {number | string} page : 현재 페이지 (state or query parameter) 1부터
 * @returns JSX
 */
const Pagination = ({ totalCount = 3, slice = 5, handler, page = 1 }) => {
    const [pages, setPages] = useState([]);
    const nowPage = parseInt(page); // 문자열일 경우 버그 발생 가능성이 있어 정수형으로 파싱을 합니다.

    useEffect(() => {
        let array = [];
        const count = Math.ceil(totalCount / slice);
        for (let i = 1; i <= count; i++) {
            array.push(i);
        }
        setPages(array);
    }, [totalCount, slice]);

    const nextHandler = () => {
        // 마지막 페이지 (전체 페이지네이션의 길이 경우) return
        if (nowPage === pages?.length) return;
        handler(nowPage + 1);
    };

    const prevHandler = () => {
        // 1 페이지일 경우 return
        if (nowPage === 1) return;
        handler(nowPage - 1);
    };

    return (
        <div className="unit-component-pagination">
            <div className="unit-component-pagination-content">
                <div className="unit-component-pagination-content__page prev" onClick={prevHandler}></div>
                {pages
                    .slice(Math.floor((nowPage - 1) / 5) * 5, 5 + Math.floor((nowPage - 1) / 5) * 5)
                    .map((item, index) => (
                        <button
                            key={index}
                            className={`unit-component-pagination-content__page ${nowPage === item && 'enable'}`}
                            onClick={() => handler(item)}
                        >
                            {item}
                        </button>
                    ))}
                <div className="unit-component-pagination-content__page next" onClick={nextHandler}></div>
            </div>
        </div>
    );
};

export default Pagination;
