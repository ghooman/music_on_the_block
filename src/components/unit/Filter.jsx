import { useSearchParams } from 'react-router-dom';
import './Filter.scss';
import { useEffect } from 'react';
const Filter = ({ list, clickEvent }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams((prev) => {
            return { ...Object.fromEntries(prev), name: '송경세' };
        });
    }, []);

    return (
        <div className="albums__filter">
            <button className="albums__filter__btn">
                <span onClick={clickEvent}>Filter</span>
            </button>
            {list?.map((item, index) => (
                <button className="albums__filter__btn" key={index}>
                    <span>{item}</span>
                </button>
            ))}
        </div>
    );
};

export default Filter;
