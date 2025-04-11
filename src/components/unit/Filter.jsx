import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalWrap from '../ModalWrap';

import './Filter.scss';

import resetIcon from '../../assets/images/icon/reset.svg';
import pencelIcon from '../../assets/images/icon/pencel.svg';

// 생각중인 필터는 이렇습니다.
// url만 조작함.
// 사용하는 부모 컴포넌트에서 쿼리 파라미터로 필터링

const Filter = ({ period = true, types = true, songs }) => {
    const [searchParamas, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState(false);

    const [paramsObj, setParamsObj] = useState({});

    const page = searchParamas.get('page');

    const period_ = searchParamas.get('period');
    const types_ = searchParamas.get('types');
    const songs_ = searchParamas.get('songs');

    const handleQueryParameter = () => {
        setSearchParams((prev) => {
            const parameters = { ...Object.fromEntries(prev), ...paramsObj, ...(page && { page: 1 }) };
            return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => value !== null));
        });
        setFilter(false);
    };

    useEffect(() => {
        if (!filter) setParamsObj({});
    }, [filter]);

    return (
        <div className="albums__filter">
            <button className="albums__filter__btn" onClick={() => setFilter((prev) => !prev)}>
                <span>Filter</span>
            </button>
            {[period_, types_, songs_].map((item) => {
                if (!item) return null;
                return (
                    <button className="albums__filter__btn">
                        <span>{item}</span>
                    </button>
                );
            })}

            {filter && (
                <ModalWrap title="Filter" onClose={setFilter}>
                    <div className="albums__filter-modal">
                        {period && (
                            <FilterCategory
                                value={period_}
                                setParamsObj={setParamsObj}
                                filterName="period"
                                filterItems={['Latest', 'Early']}
                            />
                        )}
                        {types && (
                            <FilterCategory
                                value={types_}
                                setParamsObj={setParamsObj}
                                filterName="types"
                                filterItems={['Lyrics', 'Songwriting']}
                            />
                        )}
                        {songs && (
                            <FilterCategory
                                value={songs_}
                                setParamsObj={setParamsObj}
                                filterName="songs"
                                filterItems={['Latest', 'Oldest', 'Most Likes', 'Low Likes', 'Most Replied']}
                            />
                        )}
                        <div className="albums__filter-buttons">
                            <button className="albums__filter-buttons--button reset">
                                <img src={resetIcon} alt="icon" />
                                Reset
                            </button>
                            <button className="albums__filter-buttons--button view" onClick={handleQueryParameter}>
                                View {Object.keys(paramsObj).reduce((a, b) => a + 1, 0)} results
                                <img src={pencelIcon} alt="icon" />
                            </button>
                        </div>
                    </div>
                </ModalWrap>
            )}
        </div>
    );
};

export default Filter;

const FilterItemWrap = ({ title, children }) => {
    return (
        <div className="albums__filter-item-wrap">
            <p className="albums__filter-item-wrap--title">{title}</p>
            <div className="albums__filter-item-wrap--contents">{children}</div>
        </div>
    );
};

const FilterCategory = ({ value, setParamsObj, filterItems, filterName }) => {
    const [selectItem, setSelectItem] = useState(value);

    useEffect(() => {
        setParamsObj((prev) => ({
            ...prev,
            ...{ [filterName]: selectItem },
        }));
    }, [selectItem]);

    return (
        <FilterItemWrap title={filterName}>
            {filterItems.map((item) => (
                <button
                    className={`albums__filter-item-wrap--contents__item ${selectItem === item && 'select'}`}
                    onClick={() =>
                        setSelectItem((prev) => {
                            if (prev === item) return null;
                            else return item;
                        })
                    }
                    key={`${filterName}-${item}`}
                >
                    {item}
                </button>
            ))}
        </FilterItemWrap>
    );
};
