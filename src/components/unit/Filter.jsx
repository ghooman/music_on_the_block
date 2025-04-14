import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalWrap from '../ModalWrap';

import './Filter.scss';

import resetIcon from '../../assets/images/icon/reset.svg';
import pencelIcon from '../../assets/images/icon/pencel.svg';
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

/**
 *
 * @param {boolean | string[] | {name, image}[]} props : 사용하는 필터들 (boolean 타입 작성 시 프리셋, 문자열로 이루어진 배열 타입 작성 시 작성한 필터)
 */

/**
 * 프롭스 추가 시 변수도 추가해주어야 합니다.
 */

const Filter = ({ period, types, songs, connections }) => {
    const [searchParamas, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState(false);

    const [paramsObj, setParamsObj] = useState({});

    const page = searchParamas.get('page');

    // 프롭스와 맞춰주세요
    const period_ = searchParamas.get('period');
    const types_ = searchParamas.get('types');
    const songs_ = searchParamas.get('songs');
    const connections_ = searchParamas.get('connections');

    // queries 변수에 값을 넣어야 filter 아이템이 표시됩니다.
    const queries = [period_, types_, songs_, connections_];

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
            {queries.map((item, index) => {
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
                                title="period"
                                filterName="period"
                                filterItems={
                                    // songs를 단순 true로 설정 시 프리셋 제공
                                    // 커스텀이 필요할 경우 배열로 전달
                                    typeof period === 'boolean' ? ['Latest', 'Early'] : period
                                }
                            />
                        )}
                        {types && (
                            <FilterCategory
                                value={types_}
                                setParamsObj={setParamsObj}
                                title="types"
                                filterName="types"
                                filterItems={
                                    typeof types === 'boolean'
                                        ? [
                                              { name: 'Lyrics + Songwriting' },
                                              { name: 'Songwriting' },
                                              'Lyrics + Songwriting',
                                              'Songwriting',
                                          ]
                                        : types
                                }
                            />
                        )}
                        {songs && (
                            <FilterCategory
                                value={songs_}
                                setParamsObj={setParamsObj}
                                title="Sort by"
                                filterName="songs"
                                filterItems={
                                    typeof songs === 'boolean'
                                        ? [
                                              'Latest',
                                              'Oldest',
                                              'Most Liked',
                                              'Least Liked',
                                              'Most Played',
                                              'Least Played',
                                          ]
                                        : songs
                                }
                            />
                        )}
                        {connections && (
                            <FilterCategory
                                value={connections_}
                                setParamsObj={setParamsObj}
                                title="Sort by"
                                filterName="connections"
                                filterItems={
                                    typeof connections === 'boolean'
                                        ? [
                                              'Highest Level',
                                              'Lowest Level',
                                              'Most Songs',
                                              'Least Songs',
                                              'Most Followers',
                                              'Least Followers',
                                          ]
                                        : connections
                                }
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

const FilterCategory = ({ value, setParamsObj, filterItems, filterName, title }) => {
    const [selectItem, setSelectItem] = useState(value);

    useEffect(() => {
        setParamsObj((prev) => ({
            ...prev,
            ...{ [filterName]: selectItem },
        }));
    }, [selectItem]);

    return (
        <FilterItemWrap title={title}>
            {filterItems.map((item) => {
                if (item?.image) {
                    return (
                        <button
                            className={`albums__filter-item-wrap--contents__item ${
                                selectItem === item?.name && 'select'
                            }`}
                            onClick={() =>
                                setSelectItem((prev) => {
                                    if (prev === item?.name) return null;
                                    else return item?.name;
                                })
                            }
                            key={`${filterName}-${item}`}
                        >
                            <div>
                                <img src={item.image} alt="icon" />
                            </div>
                            {item?.name}
                        </button>
                    );
                } else {
                    return (
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
                    );
                }
            })}
        </FilterItemWrap>
    );
};
