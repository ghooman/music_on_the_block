// React & Routing
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

// React Query
import { useQuery } from 'react-query';

// Context
import { AuthContext } from '../../contexts/AuthContext';

// API
import { getNftCollections } from '../../api/nfts/nftCollectionsApi';
import { getNftsList, getNftTransactionHistory } from '../../api/nfts/nftsListApi';

// Components - Layout & UI
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import SubBanner from '../create/SubBanner';
import Loading from '../IntroLogo2';

// Components - Tables & Items
import CollectionTable from '../table/CollectionTable';
import NftTable from './../table/NftTable';
import { CollectionItemList } from '../nft/NftItem';

// Assets & Styles
import subBannerImage4 from '../../assets/images/create/subbanner-bg4.png';
import './NFTs.scss';

const subCategoryList = [
  { name: 'NFT items', preparing: false },
  // { name: 'Favorites', preparing: false },
  // { name: 'Collections', preparing: false },
  { name: 'History', preparing: false },
];

const nftFilterItemList = ['Listed', 'Unlisted'];

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
    <div className="mypage__nfts">
      <SubCategories
        categories={subCategoryList}
        handler={category => {
          if (category === tab) return;
          setSearchParams({
            category: 'NFTs',
            tab: category,
            ...(usernameQuery ? { username: usernameQuery } : null),
          });
        }}
        value={tab}
      />
      {tab === 'NFT items' && (
        <NftItems token={token} username={username} isMyProfile={isMyProfile} />
      )}
      {/* {tab === 'Collections' && (
        <CollectionItems token={token} username={username} isMyProfile={isMyProfile} />
      )} */}
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
  const nftFilter = searchParams.get('nft_filter') || 'Listed';

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
      <div className="mypage__nfts__button-wrap">
        {nftFilterItemList.map(item => (
          <button
            key={item}
            className={`mypage__nfts__button-wrap--button ${nftFilter === item ? 'selected' : ''}`}
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
          <Search placeholder="Search by Item ..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <NftTable
          saleOption={isMyProfile}
          nftList={data?.data_list}
          onCancelSuccess={() => refetch()}
          listedDateOption={nftFilter === 'Listed'}
          mintedDateOption={nftFilter === 'Unlisted'}
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

  return (
    <>
      {isMyProfile && (
        <SubBanner>
          <SubBanner.LeftImages src={subBannerImage4} />
          <SubBanner.Title text="Create Your Own Collection" />
          <SubBanner.Message text="Bring your favofite NFT music together and curate a collection that's uniquely yours. Now's the time to show the world your taste in music!" />
          <SubBanner.Button title="Create Collection" />
        </SubBanner>
      )}
      <ContentWrap title="Collections">
        <ContentWrap.SubWrap gap={8}>
          <Filter collectionSort={['Latest', 'Oldest', 'Most NFT Items', 'Least NFT Items']} />
          <Search placeholder="Search by Item ..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <CollectionItemList data={data?.data_list} />
        <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
        {isLoading && <Loading />}
      </ContentWrap>
    </>
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
