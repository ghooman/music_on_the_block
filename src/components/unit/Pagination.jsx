import { useEffect, useState } from 'react';
import './Pagination.scss';

const Pagination = ({ totalCount = 3, slice = 5, onClick, page = 0 }) => {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        let array = [];
        const count = Math.ceil(totalCount / slice);
        for (let i = 1; i <= count; i++) {
            array.push(i);
        }
        setPages(array);
    }, [totalCount, slice]);

    return (
        <div className="unit-component-pagination">
            <div className="unit-component-pagination-content">
                <div className="unit-component-pagination-content__page prev"></div>
                {pages.slice(Math.floor(page / 5) * 5, 5 + Math.floor(page / 5) * 5).map((item, index) => (
                    <button
                        key={index}
                        className={`unit-component-pagination-content__page ${page === index && 'enable'}`}
                    >
                        {item}
                    </button>
                ))}
                <div className="unit-component-pagination-content__page next"></div>
            </div>
        </div>
    );
};

export default Pagination;
