import { useContext } from 'react';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import CollectionTable from '../table/CollectionTable';
import CollectionHistoryTable from '../table/CollectionHistoryTable';
import Loading from '../IntroLogo2';

import './NftMarketPlace.scss';
import NftTable from './../table/NftTable';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  getMyNftCollections,
  getNftCollectionHistory,
  getNftCollections,
} from '../../api/nfts/nftCollectionsApi';
import { AuthContext } from '../../contexts/AuthContext';
import { getNftsList, getNftTransactionHistory } from '../../api/nfts/nftsListApi';

const subCategoryList = [
  { name: 'NFT items', preparing: false },
  { name: 'Collections', preparing: false },
  { name: 'History', preparing: false },
];

const nftFilterItemList = ['All', 'Unlisted', 'Listed'];

/**
 *
 * @param {string} username : 유저네임
 * @param {boolean} isMyProfile : 나의 프로필인지 남의 프로필인지 확인하는 프롭스
 * @returns
 */
const NftMarketPlace = ({ username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { token } = useContext(AuthContext);
  const usernameQuery = searchParams.get('username');
  const tab = searchParams.get('tab') || subCategoryList?.[0].name;

  return (
    <div className="nft-market-place">
      <SubCategories
        categories={subCategoryList}
        handler={category => {
          if (category === tab) return;
          setSearchParams({
            category: 'NFT MarketPlace',
            tab: category,
            ...(usernameQuery ? { username: usernameQuery } : null),
          });
        }}
        value={tab}
      />
      {tab === 'NFT items' && (
        <NftItems token={token} username={username} isMyProfile={isMyProfile} />
      )}
      {tab === 'Collections' && (
        <CollectionItems token={token} username={username} isMyProfile={isMyProfile} />
      )}
      {tab === 'History' && <History username={username} isMyProfile={isMyProfile} />}
    </div>
  );
};

export default NftMarketPlace;

const NftItems = ({ username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const nftSort = searchParams.get('nft_sort');
  const nftFilter = searchParams.get('nft_filter') || 'All';

  const { data, isLoading, refetch } = useQuery(
    ['nfts_data', page, nftFilter, search, gradeFilter, tokenFilter, nftSort, username],
    async () => {
      const res = await getNftsList({
        page: page,
        now_sales_status: nftFilter,
        search_keyword: search,
        nft_rating: gradeFilter,
        sales_token: tokenFilter,
        sort_by: nftSort,
        user_name: username,
      });
      return res.data;
    }
  );

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
        <NftTable
          saleOption={isMyProfile}
          nftList={data?.data_list}
          onCancelSuccess={() => refetch()}
        />
        <Pagination totalCount={data?.total_cnt} viewCount={12} page={page} />
        {isLoading && <Loading />}
      </ContentWrap>
    </>
  );
};

const CollectionItems = ({ token, username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const collectionSort = searchParams.get('collection_sort');

  const { data, isLoading } = useQuery(
    ['collection_data', token, page, search, collectionSort, username],
    async () => {
      const res = await getNftCollections({
        page: page,
        search_keyword: search,
        sort_by: collectionSort,
        user_name: username,
      });
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log('collection_data', data);
  return (
    <ContentWrap title="Collection list">
      <ContentWrap.SubWrap gap={8}>
        <Filter collectionSort={['Latest', 'Oldest', 'Most NFT Items', 'Least NFT Items']} />
        <Search placeholder="Search by Item or Affiliated Collection..." reset={{ page: 1 }} />
      </ContentWrap.SubWrap>
      <CollectionTable collectionList={data?.data_list} />
      <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
      {isLoading && <Loading />}
    </ContentWrap>
  );
};

const History = ({ username }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const nftSort = searchParams.get('nft_sort');

  const { data, isLoading, refetch } = useQuery(
    ['nft_transaction_history_data', page, search, gradeFilter, tokenFilter, username, nftSort],
    async () => {
      const response = await getNftTransactionHistory({
        page: page,
        search_keyword: search,
        nft_rating: gradeFilter,
        sales_token: tokenFilter,
        sort_by: nftSort,
        user_name: username,
      });
      return response.data;
    }
  );

  return (
    <ContentWrap title="History">
      {isLoading && <Loading />}
      <ContentWrap.SubWrap gap={8}>
        <Filter gradeFilter={true} tokenFilter={true} buySellFilter={true} nftSort={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <NftTable
        nftList={data?.data_list}
        collectionOption={false}
        buyerOption={true}
        sellerOption={true}
        saleStatusOption={true}
        onCancelSuccess={() => refetch()}
      />
      <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
    </ContentWrap>
  );
};
