import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalWrap from '../ModalWrap';

import './Filter.scss';

import resetIcon from '../../assets/images/icon/reset.svg';
import pencelIcon from '../../assets/images/icon/pencel.svg';
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';
import checkIcon from '../../assets/images/check-icon.svg';

/**
 *
 * @param {boolean | string[] | {name, image}[]} props : 사용하는 필터들 (boolean 타입 작성 시 프리셋, 문자열로 이루어진 배열 타입 작성 시 작성한 필터)
 */

/**
 * 프롭스 추가 시 변수도 추가해주어야 합니다.
 */

const Filter = ({ period, generateType, songsSort, connectionsSort, albumSort }) => {
    const [searchParamas, setSearchParams] = useSearchParams();
    const [modal, setModal] = useState(false);
    const [paramsObj, setParamsObj] = useState({});

    const page = searchParamas.get('page');

    // 프롭스와 맞춰주세요
    const period_ = searchParamas.get('period');
    const generateType_ = searchParamas.get('generate_type');
    const songsSort_ = searchParamas.get('songs_sort');
    const connectionsSort_ = searchParamas.get('connections_sort');
    const albumSort_ = searchParamas.get('album_sort');

    // queries 변수에 값을 넣어야 filter 아이템이 표시됩니다.
    const queries = [period_, generateType_, songsSort_, connectionsSort_, albumSort_];

    const handleQueryParameter = () => {
        setSearchParams((prev) => {
            const parameters = { ...Object.fromEntries(prev), ...paramsObj, ...(page && { page: 1 }) };
            return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => value !== null));
        });
        setModal(false);
    };

    return (
        <div className="albums__filter">
            <button className="albums__filter__btn" onClick={() => setModal((prev) => !prev)}>
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

            {modal && (
                <ModalWrap title="Filter" onClose={setModal}>
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
                        {generateType && (
                            <FilterCategory
                                value={generateType_}
                                setParamsObj={setParamsObj}
                                title="types"
                                filterName="generate_type"
                                filterItems={
                                    typeof generateType === 'boolean'
                                        ? [
                                              { name: 'Lyrics + Songwriting', icon: LyricsAndSongwritingIcon },
                                              { name: 'Songwriting', icon: SongwritingIcon },
                                          ]
                                        : generateType
                                }
                            />
                        )}
                        {songsSort && (
                            <FilterCategory
                                value={songsSort_}
                                setParamsObj={setParamsObj}
                                title="Sort by"
                                filterName="songs_sort"
                                filterItems={
                                    typeof songsSort === 'boolean'
                                        ? [
                                              'Latest',
                                              'Oldest',
                                              'Most Liked',
                                              'Least Liked',
                                              'Most Played',
                                              'Least Played',
                                          ]
                                        : songsSort
                                }
                            />
                        )}
                        {connectionsSort && (
                            <FilterCategory
                                value={connectionsSort_}
                                setParamsObj={setParamsObj}
                                title="Sort by"
                                filterName="connections_sort"
                                filterItems={
                                    typeof connectionsSort === 'boolean'
                                        ? [
                                              'Highest Level',
                                              'Lowest Level',
                                              'Most Songs',
                                              'Least Songs',
                                              'Most Followers',
                                              'Least Followers',
                                          ]
                                        : connectionsSort
                                }
                            />
                        )}
                        {albumSort && (
                            <FilterCategory
                                value={albumSort_}
                                setParamsObj={setParamsObj}
                                title="Sort by"
                                filterName="album_sort"
                                filterItems={
                                    typeof albumSort === 'boolean' ? ['Most Songs', 'Fewest Songs'] : albumSort
                                }
                            />
                        )}
                        <div className="albums__filter-buttons">
                            {/* <button className="albums__filter-buttons--button reset">
                                <img src={resetIcon} alt="icon" />
                                Reset
                            </button> */}
                            <button className="albums__filter-buttons--button view" onClick={handleQueryParameter}>
                                {/* View {Object.values(paramsObj).filter((item) => item).length} results
                                <img src={pencelIcon} alt="icon" /> */}
                                APPLY +{' '}
                                <div className="albums__filter-buttons--button-count">
                                    {Object.values(paramsObj).filter((item) => item).length}
                                </div>
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
                if (typeof item === 'object') {
                    // 이미지 넣을 경우
                    return (
                        <FilterButton
                            value={item.name}
                            icon={item.icon}
                            select={selectItem}
                            handleClick={() =>
                                setSelectItem((prev) => {
                                    if (prev === item.name) return null;
                                    else return item.name;
                                })
                            }
                        ></FilterButton>
                    );
                } else {
                    return (
                        <FilterButton
                            value={item}
                            select={selectItem}
                            handleClick={() =>
                                setSelectItem((prev) => {
                                    if (prev === item) return null;
                                    else return item;
                                })
                            }
                        ></FilterButton>
                    );
                }
            })}
        </FilterItemWrap>
    );
};

const FilterButton = ({ value, select, handleClick, icon }) => {
    return (
        <button
            className={`albums__filter-item-wrap--contents__item ${value === select && 'select'}`}
            onClick={handleClick}
        >
            {icon ? (
                <div className="icons">
                    <img src={icon} alt="icon" />
                </div>
            ) : (
                <div className={`checkbox ${value === select && 'checked'}`}>
                    {value === select && <img src={checkIcon} alt="icon" />}
                </div>
            )}
            {value}
        </button>
    );
};
