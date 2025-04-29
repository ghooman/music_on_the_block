import { useState } from 'react';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import CollectionTable from '../table/CollectionTable';

import './NftMarketPlace.scss';
import NftTable from './../table/NftTable';
import { useSearchParams } from 'react-router-dom';

const subCategoryList = [
  { name: 'NFT items', preparing: false },
  { name: 'Collection', preparing: false },
];

const nftFilterItemList = ['All', 'Unlisted', 'Listed', 'Sold'];

const NftMarketPlace = () => {
  const [type, setType] = useState(subCategoryList?.[0].name);

  return (
    <div className="nft-market-place">
      <SubCategories categories={subCategoryList} handler={setType} value={type} />
      {type === 'NFT items' && <NftItems />}
      {type === 'Collection' && <CollectionItems />}
    </div>
  );
};

export default NftMarketPlace;

const NftItems = () => {
  const [searchParamas, setSearchParams] = useSearchParams();

  const page = searchParamas.get('page');
  const search = searchParamas.get('search');
  const nftSort = searchParamas.get('nft_sort');
  const nftFilter = searchParamas.get('nft_filter') || 'All';

  return (
    <>
      <div className="nft-market-place__button-wrap">
        {nftFilterItemList.map(item => (
          <button
            key={item}
            className={`nft-market-place__button-wrap--button ${
              nftFilter === item ? 'selected' : ''
            }`}
            onClick={() => {
              if (nftFilter === item) return;
              setSearchParams(prev => {
                return { ...Object.fromEntries(prev), nft_filter: item };
              });
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <ContentWrap title="NFTs list">
        <ContentWrap.SubWrap gap={8}>
          <Filter nftSort={true} gradeFilter={true} tokenFilter={true} />
          <Search placeholder="Search by Item or Affiliated Collection..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <NftTable />
        <Pagination />
      </ContentWrap>
    </>
  );
};

const CollectionItems = () => {
  return (
    <ContentWrap title="Collection list">
      <ContentWrap.SubWrap gap={8}>
        <Filter />
        <Search placeholder="Search by Item or Affiliated Collection..." reset={{ page: 1 }} />
      </ContentWrap.SubWrap>
      <CollectionTable />
      <Pagination />
    </ContentWrap>
  );
};
