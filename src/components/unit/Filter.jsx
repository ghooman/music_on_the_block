import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModalWrap from '../ModalWrap';

import './Filter.scss';

import resetIcon from '../../assets/images/icon/reset.svg';
import pencelIcon from '../../assets/images/icon/pencel.svg';
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';
import generatedLyricSongwritingIcon from '../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../assets/images/icon/generated-cover-creation.svg';

import LyricsAndSongwritingIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import grade1Icon from '../../assets/images/icon/grade-icon/Grade01-icon.svg';
import grade2Icon from '../../assets/images/icon/grade-icon/Grade2-icon.svg';
import grade3Icon from '../../assets/images/icon/grade-icon/Grade3-icon.svg';
import grade4Icon from '../../assets/images/icon/grade-icon/Grade4-icon.svg';
import grade5Icon from '../../assets/images/icon/grade-icon/Grade5-icon.svg';

import criticJinwooYooIcon from '../../assets/images/evaluation/persona-user01.png';
import criticDrexxIcon from '../../assets/images/evaluation/persona-user02.png';
import criticElaraMoonIcon from '../../assets/images/evaluation/persona-user03.png';

import checkIcon from '../../assets/images/check-icon.svg';
import { useTranslation } from 'react-i18next';

/**
 *
 * @param {boolean | string[] | {name, image}[]} props : 사용하는 필터들 (boolean 타입 작성 시 프리셋, 문자열로 이루어진 배열 타입 작성 시 작성한 필터)
 */

/**
 * 프롭스 추가 시 변수도 추가해주어야 합니다.
 */

const Filter = ({
  period,
  // 필터링 옵션
  aiServiceFilter,
  gradeFilter,
  salesFilter,
  tokenFilter,
  buySellFilter,
  criticFilter,
  mintedFilter,
  // 정렬 옵션
  songsSort,
  albumSort,
  nftSort,
  collectionSort,
  userSort,
}) => {
  const { t } = useTranslation('module');

  const [searchParamas, setSearchParams] = useSearchParams();
  const [modal, setModal] = useState(false);
  const [paramsObj, setParamsObj] = useState({});

  const page = searchParamas.get('page');

  // 프롭스와 맞춰주세요

  const period_ = searchParamas.get('period');
  //필터
  const aiServiceFilter_ = searchParamas.get('ai_service_filter');
  const gradeFilter_ = searchParamas.get('grade_filter');
  const salesFilter_ = searchParamas.get('sales_filter');
  const tokenFilter_ = searchParamas.get('token_filter');
  const buySellFilter_ = searchParamas.get('buy_sell_filter');
  const criticFilter_ = searchParamas.get('critic_filter');
  const mintedFilter_ = searchParamas.get('minted_filter');
  // 정렬
  const songsSort_ = searchParamas.get('songs_sort');
  const collectionSort_ = searchParamas.get('collection_sort');
  const albumSort_ = searchParamas.get('album_sort');
  const nftSort_ = searchParamas.get('nft_sort');
  const userSort_ = searchParamas.get('user_sort');

  // queries 변수에 값을 넣어야 filter 아이템이 표시됩니다.
  const queries = [
    period_,
    //필터
    aiServiceFilter_,
    gradeFilter_,
    salesFilter_,
    tokenFilter_,
    buySellFilter_,
    mintedFilter_,
    //정렬
    songsSort_,
    collectionSort_,
    albumSort_,
    nftSort_,
    userSort_,
  ];

  const handleQueryParameter = () => {
    setSearchParams(prev => {
      const parameters = { ...Object.fromEntries(prev), ...paramsObj, ...(page && { page: 1 }) };
      return Object.fromEntries(
        Object.entries(parameters).filter(([key, value]) => value !== null)
      );
    });
    setModal(false);
  };

  return (
    <div className="albums__filter">
      <button className="albums__filter__btn" onClick={() => setModal(prev => !prev)}>
        <span>{t('Filter')}</span>
      </button>
      {queries.map((item, index) => {
        if (!item) return null;
        return (
          <button className="albums__filter__btn" key={`filter-item-${index}`}>
            <span>{t(item)}</span>
          </button>
        );
      })}

      {modal && (
        <ModalWrap title={t('Filter')} onClose={setModal}>
          <div className="albums__filter-modal">
            {period && (
              <FilterCategory
                value={period_}
                setParamsObj={setParamsObj}
                title="Period"
                filterName="period"
                filterItems={
                  // songs를 단순 true로 설정 시 프리셋 제공
                  // 커스텀이 필요할 경우 배열로 전달
                  typeof period === 'boolean' ? ['Latest', 'Early'] : period
                }
              />
            )}
            {aiServiceFilter && (
              <FilterCategory
                value={aiServiceFilter_}
                setParamsObj={setParamsObj}
                title="Types"
                filterName="ai_service_filter"
                filterItems={
                  typeof aiServiceFilter === 'boolean'
                    ? [
                        { name: 'Song', icon: LyricsAndSongwritingIcon },
                        { name: 'BGM', icon: SongwritingIcon },
                      ]
                    : aiServiceFilter
                }
              />
            )}
            {gradeFilter && (
              <FilterCategory
                value={gradeFilter_}
                setParamsObj={setParamsObj}
                title="Grade"
                filterName="grade_filter"
                filterItems={
                  typeof gradeFilter === 'boolean'
                    ? [
                        { name: 'New', icon: grade1Icon },
                        { name: 'Indie', icon: grade2Icon },
                        { name: 'Rising', icon: grade3Icon },
                        { name: 'Top', icon: grade4Icon },
                        { name: 'Legend', icon: grade5Icon },
                      ]
                    : gradeFilter
                }
              />
            )}
            {salesFilter && (
              <FilterCategory
                value={salesFilter_}
                setParamsObj={setParamsObj}
                title="Sort by"
                filterName="sales_filter"
                filterItems={
                  typeof salesFilter === 'boolean' ? ['Listed', 'Unlisted'] : salesFilter
                }
              />
            )}
            {tokenFilter && (
              <FilterCategory
                value={tokenFilter_}
                setParamsObj={setParamsObj}
                title="Token"
                filterName="token_filter"
                filterItems={
                  // 0630 하늘 fix: USDT, USDC 관련 내용 주석 처리
                  typeof tokenFilter === 'boolean' ? ['MOB', 'POL'] : tokenFilter
                }
              />
            )}
            {buySellFilter && (
              <FilterCategory
                value={buySellFilter_}
                setParamsObj={setParamsObj}
                title="Sale Action"
                filterName="buy_sell_filter"
                filterItems={typeof buySellFilter === 'boolean' ? ['Buy', 'Sell'] : buySellFilter}
              />
            )}
            {criticFilter && (
              <FilterCategory
                value={criticFilter_}
                setParamsObj={setParamsObj}
                title="Type"
                filterName="critic_filter"
                filterItems={
                  typeof criticFilter === 'boolean'
                    ? [
                        { name: 'Jinwoo Yoo', icon: criticJinwooYooIcon },
                        {
                          name: 'Drexx',
                          icon: criticDrexxIcon,
                        },
                        {
                          name: 'Elara Moon',
                          icon: criticElaraMoonIcon,
                        },
                      ]
                    : criticFilter
                }
              />
            )}
            {mintedFilter && (
              <FilterCategory
                value={mintedFilter_}
                setParamsObj={setParamsObj}
                title="NFT Mint Status"
                filterName="minted_filter"
                filterItems={
                  typeof mintedFilter === 'boolean'
                    ? [{ name: 'Minted' }, { name: 'Unminted' }]
                    : mintedFilter
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
            {collectionSort && (
              <FilterCategory
                value={collectionSort_}
                setParamsObj={setParamsObj}
                title="Sort by"
                filterName="collection_sort"
                filterItems={
                  typeof collectionSort === 'boolean'
                    ? [
                        'Highest Price First',
                        'Lowest Price First',
                        'Most NFT Items',
                        'Least NFT Items',
                        'Most Liked',
                        'Least Liked',
                      ]
                    : collectionSort
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
            {nftSort && (
              <FilterCategory
                value={nftSort_}
                setParamsObj={setParamsObj}
                title="Sort by"
                filterName="nft_sort"
                filterItems={
                  typeof nftSort === 'boolean'
                    ? ['Latest', 'Oldest', 'Highest Price', 'Lowest Price']
                    : nftSort
                }
              />
            )}
            {userSort && (
              <FilterCategory
                value={userSort_}
                setParamsObj={setParamsObj}
                title="Sort by"
                filterName="user_sort"
                filterItems={
                  typeof userSort === 'boolean'
                    ? [
                        'Highest Level',
                        'Lowest Level',
                        'Most Songs',
                        'Least Songs',
                        'Most Followers',
                        'Least Followers',
                      ]
                    : userSort
                }
              />
            )}
            <div className="albums__filter-buttons">
              {/* <button className="albums__filter-buttons--button reset">
                                <img src={resetIcon} alt="icon" />
                                Reset
                            </button> */}
              <button
                className="albums__filter-buttons--button view"
                onClick={handleQueryParameter}
              >
                {/* View {Object.values(paramsObj).filter((item) => item).length} results
                                <img src={pencelIcon} alt="icon" /> */}
                {t('APPLY')} +{' '}
                <div className="albums__filter-buttons--button-count">
                  {Object.values(paramsObj).filter(item => item).length}
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
  const { t } = useTranslation('module');

  useEffect(() => {
    setParamsObj(prev => ({
      ...prev,
      ...{ [filterName]: selectItem },
    }));
  }, [selectItem]);

  return (
    <FilterItemWrap title={t(title)}>
      {filterItems.map((item, index) => {
        if (typeof item === 'object') {
          // 이미지 넣을 경우
          return (
            <React.Fragment key={item + index}>
              <FilterButton
                translateFn={t}
                value={item.name}
                icon={item.icon}
                select={selectItem}
                handleClick={() =>
                  setSelectItem(prev => {
                    if (prev === item.name) return null;
                    else return item.name;
                  })
                }
              ></FilterButton>
            </React.Fragment>
          );
        } else {
          return (
            <FilterButton
              translateFn={t}
              value={item}
              select={selectItem}
              handleClick={() =>
                setSelectItem(prev => {
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

const FilterButton = ({ value, select, handleClick, icon, translateFn }) => {
  return (
    <button
      className={`albums__filter-item-wrap--contents__item ${value === select && 'select'}`}
      onClick={handleClick}
    >
      <div className={`checkbox ${value === select && 'checked'}`}>
        {value === select && <img src={checkIcon} alt="icon" />}
      </div>
      {icon && (
        <div className="icons">
          <img src={icon} alt="icon" />
        </div>
      )}
      {translateFn(value)}
    </button>
  );
};
