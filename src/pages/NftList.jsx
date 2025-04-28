import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { CollectionItemList, NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Search from '../components/unit/Search';
import FilterItems from '../components/unit/FilterItems';
import Filter from '../components/unit/Filter';

import { getNftsList } from '../api/nfts/nftsListApi';
import { getNftCollections } from '../api/nfts/nftCollectionsApi';

import '../styles/NftList.scss';

const NftList = () => {
  const [selectCategory, setSelectCategory] = useState('NFT item');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');

  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const songsSort = searchParams.get('songs_sort');
  const connectionsSort = searchParams.get('connections_sort');

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [selectCategory]);

  return (
    <div className="nft-list">
      <Categories
        categories={['NFT item', 'Collection']}
        value={selectCategory}
        onClick={setSelectCategory}
      />
      <ContentWrap
        title={` ${selectCategory === 'NFT item' ? 'NFT Item (List)' : 'NFT Collection (List)'}`}
      >
        {selectCategory === 'NFT item' && (
          <NFTList
            page={page}
            search={search}
            gradeFilter={gradeFilter}
            songsSort={songsSort}
            tokenFilter={tokenFilter}
          />
        )}
        {selectCategory === 'Collection' && (
          <CollectionList page={page} search={search} connectionsSort={connectionsSort} />
        )}
      </ContentWrap>
    </div>
  );
};

export default NftList;

//=================
//======컴포넌트=====
//=================

const NFTList = ({ page, search, gradeFilter, songsSort }) => {
  const [nftData, setNftData] = useState();

  useEffect(() => {
    const fetchNftList = async () => {
      try {
        const response = await getNftsList({
          page: page,
          search_keyword: search,
          sort_by: songsSort,
        });
        setNftData(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNftList();
  }, [page, search]);

  return (
    <>
      <ContentWrap.SubWrap gap={8}>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <NftItemList data={nftData?.data_list} />
      <Pagination totalCount={nftData?.total_cnt} viewCount={12} page={page} />
    </>
  );
};

const CollectionList = ({ page, search, connectionsSort }) => {
  const [collectionData, setCollectionData] = useState();

  useEffect(() => {
    const fetchCollectionList = async () => {
      try {
        const response = await getNftCollections({
          page: page,
          search_keyword: search,
          sort_by: connectionsSort,
        });
        setCollectionData(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCollectionList();
  }, [page, search, connectionsSort]);

  return (
    <>
      <ContentWrap.SubWrap gap={8}>
        <Filter connectionsSort={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <CollectionItemList data={collectionData?.data_list} />
      <Pagination totalCount={collectionData?.total_cnt} viewCount={9} page={page} />
    </>
  );
};
