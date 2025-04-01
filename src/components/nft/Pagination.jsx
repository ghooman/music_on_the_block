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
        <div className="nft-pagination">
            <div className="nft-pagination-content">
                <button className="nft-pagination-content__page prev-next">뒤</button>
                {pages.slice(Math.floor(page / 5) * 5, 5 + Math.floor(page / 5) * 5).map((item, index) => (
                    <button key={index} className={`nft-pagination-content__page ${page === index && 'enable'}`}>
                        {item}
                    </button>
                ))}
                <button className="nft-pagination-content__page prev-next">앞</button>
            </div>
        </div>
    );
};

export default Pagination;
