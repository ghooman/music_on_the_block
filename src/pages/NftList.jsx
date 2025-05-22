import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { CollectionItemList, NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Search from '../components/unit/Search';
import FilterItems from '../components/unit/FilterItems';
import Filter from '../components/unit/Filter';
import Loading from '../components/IntroLogo2';

import { getNftsList } from '../api/nfts/nftsListApi';
import { getNftCollections } from '../api/nfts/nftCollectionsApi';

import '../styles/NftList.scss';
import { useQuery } from 'react-query';
import SubCategories from '../components/unit/SubCategories';
import { useTranslation } from 'react-i18next';

const subCategoryList = [
  { name: 'All', preparing: false },
  { name: 'Unlisted', preparing: false },
  { name: 'Listed', preparing: false },
];

const NftList = () => {
  const { t } = useTranslation('nft_marketplace');

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');
  const page = searchParams.get('page');
  const search = searchParams.get('search');

  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const songsSort = searchParams.get('songs_sort');
  const collectionSort = searchParams.get('collection_sort');
  const nowSalesStatus = searchParams.get('now_sales_status') || 'All';

  const handleSubCategory = value => {
    setSearchParams({ category: 'NFT Items', page: 1, now_sales_status: value });
  };

  useEffect(() => {
    if (!category) {
      setSearchParams(
        { category: 'NFT Items', page: 1, ...(search ? { search: search } : null) },
        { replace: true }
      );
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="nft-list">
      <Categories
        categories={['NFT Items', 'Collections']}
        value={category}
        translateFn={t}
        onClick={category => {
          setSearchParams({ category, page: 1 });
        }}
      />
      <ContentWrap title={` ${category === 'NFT Items' ? t('NFT Items') : t('Collections')}`}>
        {category === 'NFT Items' && (
          <>
            <SubCategories
              categories={subCategoryList}
              value={nowSalesStatus}
              translateFn={t}
              handler={handleSubCategory}
            />
            <NFTList
              page={page}
              search={search}
              gradeFilter={gradeFilter}
              songsSort={songsSort}
              tokenFilter={tokenFilter}
              nowSalesStatus={nowSalesStatus}
            />
          </>
        )}
        {category === 'Collections' && (
          <CollectionList page={page} search={search} collectionSort={collectionSort} />
        )}
      </ContentWrap>
    </div>
  );
};

export default NftList;

//=================
//======컴포넌트=====
//=================

const NFTList = ({ page, search, gradeFilter, songsSort, tokenFilter, nowSalesStatus }) => {
  const { data, isLoading } = useQuery(
    ['nft_list_all', page, search, gradeFilter, songsSort, tokenFilter, nowSalesStatus],
    async () => {
      const response = await getNftsList({
        page: page,
        search_keyword: search,
        sort_by: songsSort,
        nft_rating: gradeFilter,
        sales_token: tokenFilter,
        now_sales_status: nowSalesStatus,
      });
      return response.data;
    }
  );

  return (
    <>
      <ContentWrap.SubWrap gap={8}>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} generateFilter={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <NftItemList data={data?.data_list} />
      <Pagination totalCount={data?.total_cnt} viewCount={12} page={page} />
      {isLoading && <Loading />}
    </>
  );
};

const CollectionList = ({ page, search, collectionSort }) => {
  const { data, isLoading } = useQuery(
    ['collection_list_all', page, search, collectionSort],
    async () => {
      const response = await getNftCollections({
        page: page,
        search_keyword: search,
        sort_by: collectionSort,
      });
      return response.data;
    }
  );

  return (
    <>
      <ContentWrap.SubWrap gap={8}>
        <Filter collectionSort={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <CollectionItemList data={data?.data_list} />
      <Pagination totalCount={data?.total_cnt} viewCount={9} page={page} />
      {isLoading && <Loading />}
    </>
  );
};
