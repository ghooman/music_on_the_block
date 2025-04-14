import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalWrap from '../ModalWrap';

import './Filter.scss';

import resetIcon from '../../assets/images/icon/reset.svg';
import pencelIcon from '../../assets/images/icon/pencel.svg';

// 생각중인 필터는 이렇습니다.
// url만 조작함.
// 사용하는 부모 컴포넌트에서 쿼리 파라미터로 필터링

/**
 *
 * @param {boolean} parameter : 사용하는 필터들
 */

/**
 * 프롭스 추가 시 변수도 추가해주어야 합니다.
 */

const Filter = ({ period, types, songs }) => {
    const [searchParamas, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState(false);

    const [paramsObj, setParamsObj] = useState({});

    const page = searchParamas.get('page');

    // 프롭스와 맞춰주세요
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

    return (
        <div className="albums__filter">
            <button className="albums__filter__btn" onClick={() => setFilter((prev) => !prev)}>
                <span>Filter</span>
            </button>
            {[period_, types_, songs_].map((item, index) => {
                if (!item) return null;
                return (
                    <button className="albums__filter__btn" key={`filter-item-${index}`}>
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
                                filterItems={['Lyrics + Songwriting', 'Songwriting']}
                            />
                        )}
                        {songs && (
                            <FilterCategory
                                value={songs_}
                                setParamsObj={setParamsObj}
                                filterName="songs"
                                filterItems={[
                                    'Latest',
                                    'Oldest',
                                    'Most Liked',
                                    'Least Liked',
                                    'Most Played',
                                    'Least Played',
                                ]}
                            />
                        )}
                        <div className="albums__filter-buttons">
                            <button className="albums__filter-buttons--button reset">
                                <img src={resetIcon} alt="icon" />
                                Reset
                            </button>
                            <button className="albums__filter-buttons--button view" onClick={handleQueryParameter}>
                                View {Object.values(paramsObj).filter((item) => item).length} results
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
