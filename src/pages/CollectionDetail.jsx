import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// 컴포넌트 임포트
import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import { NftGraph } from '../components/nft/NftGraph';
import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
import Pagination from '../components/unit/Pagination';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import SubCategories from '../components/unit/SubCategories';
import CollectionHistoryTable from '../components/table/CollectionHistoryTable';
import Loading from '../components/IntroLogo2';

// API 임포트
import {
  getNftCollectionDetail,
  getNftCollectionOverview,
  getNftCollectionNftList,
  getNftCollectionHistory,
} from '../api/nfts/nftCollectionsApi';

// 에셋 임포트
import likeImage from '../assets/images/like-icon/like-icon-on.svg';
import unLikeImage from '../assets/images/like-icon/like-icon.svg';

// 스타일 임포트
import '../styles/CollectionDetail.scss';
import { useQuery } from 'react-query';

/**
 * 컬렉션 상세 정보 컴포넌트
 */
const CollectionDetail = () => {
  // 상태 관리
  const [selectCategory, setSelectCategory] = useState('Overview');
  const [collectionDetail, setCollectionDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터
  const { id } = useParams();

  /**
   * 컬렉션 기본 정보 조회
   */
  const fetchCollectionDetail = async () => {
    try {
      const response = await getNftCollectionDetail({ id });
      setCollectionDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch collection detail:', error);
    }
  };

  // 컬렉션 기본 정보 조회
  useEffect(() => {
    fetchCollectionDetail();
  }, [id]);

  useEffect(() => {
    setSearchParams({}, { replace: true });
  }, [selectCategory]);

  return (
    <div className="collection-detail">
      <CollectionInfo collectionDetail={collectionDetail} />
      <Categories
        categories={['Overview', 'NFT Item', 'History']}
        value={selectCategory}
        onClick={setSelectCategory}
      />
      {selectCategory === 'Overview' && <Overview id={id} />}
      {selectCategory === 'NFT Item' && <NFTItems id={id} />}
      {selectCategory === 'History' && <History id={id} />}
    </div>
  );
};

/**
 * 컬렉션 기본 정보 컴포넌트
 */
const CollectionInfo = ({ collectionDetail }) => {
  return (
    <div className="collection-detail-info-wrap">
      <div className="collection-detail-info">
        <div className="collection-detail-info__data">
          <img
            className="collection-detail-info__data--image"
            src={collectionDetail?.image}
            alt="images"
          />
          <div className="collection-detail-info__data--texts">
            <h1 className="texts__title">{collectionDetail?.name}</h1>
            <div className="texts__user">
              <img
                className="texts__user--image"
                src={collectionDetail?.user_profile}
                alt="images"
              />
              {collectionDetail?.user_name}
            </div>

            <div className="collection-detail-info__like">
              <img src={collectionDetail?.is_like ? likeImage : unLikeImage} alt="like" />
              {collectionDetail?.like}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 통계 항목 컴포넌트
 */
CollectionInfo.StatsItem = ({ title, value, suffix }) => {
  return (
    <div className="stats__item">
      <h3 className="stats__item--title">{title}</h3>
      <div className="stats__item--value">
        <p className="stats__item--value__text">{value}</p>
        <p className="stats__item--value__suffix">{suffix}</p>
      </div>
    </div>
  );
};

/**
 * 개요 컴포넌트
 */
const Overview = ({ id }) => {
  const [collectionOverview, setCollectionOverview] = useState(null);

  useEffect(() => {
    const fetchCollectionOverview = async () => {
      const response = await getNftCollectionOverview({ id });
      setCollectionOverview(response.data);
    };
    fetchCollectionOverview();
  }, [id]);

  return (
    <>
      <ContentWrap title="Overview">
        <NftOverview title="Detail">
          <NftOverviewItem title="NFT Items" value={collectionOverview?.nft_cnt} />
          <NftOverviewItem title="Number of Transactions" value={0} />
          <NftOverviewItem
            title="Total Volume"
            value={'$ ' + collectionOverview?.total_transaction_price}
          />
        </NftOverview>
        <NftOverview title="Price Informations">
          <NftOverviewItem
            title="Lowest Price"
            value={
              collectionOverview?.min_price + ' ' + (collectionOverview?.min_price_token || 'MOB')
            }
            subValue={'$0'}
          />
          <NftOverviewItem
            title="Highest Price"
            value={
              collectionOverview?.max_price + ' ' + (collectionOverview?.max_price_token || 'MOB')
            }
            subValue={'$0'}
          />
          <NftOverviewItem
            title="Average Price"
            value={'$ ' + collectionOverview?.avg_transaction_price}
          />
          <NftOverviewItem
            title="Recent Transaction Date"
            value={collectionOverview?.last_transaction_date}
            isLong
          />
        </NftOverview>
      </ContentWrap>
      <ContentWrap title="Graph List">
        <NftGraph
          barTitle="Number of Transactions"
          barGraphData={collectionOverview?.total_transaction_price_progress}
          lineTitle="NFT Price Change Trend"
          lineGraphData={collectionOverview?.avg_transaction_price_progress}
        />
      </ContentWrap>
      <ContentWrap title="Top NFTs in this Collection">
        <NftItemList data={collectionOverview?.popular_list} />
      </ContentWrap>
    </>
  );
};

/**
 * NFT 아이템 컴포넌트
 */
const NFTItems = ({ id }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategoryList = [{ name: 'All' }, { name: 'Unlisted' }, { name: 'Listed' }];
  // const [selected, setSelected] = useState(subCategoryList[0].name);

  // URL 파라미터
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const grade_filter = searchParams.get('grade_filter');
  const token_filter = searchParams.get('token_filter');
  const songs_sort = searchParams.get('songs_sort');
  const now_sales_status = searchParams.get('now_sales_status') || 'All';

  /**
   * 서브 카테고리 선택 핸들러
   */
  const handleSubCategory = categoryName => {
    setSearchParams(prev => {
      const { search, ...rest } = Object.fromEntries(prev);
      return { ...rest, now_sales_status: categoryName, page: 1 };
    });
  };

  const { data, isLoading } = useQuery(
    [
      'collection_nft_list_data',
      page,
      search,
      grade_filter,
      token_filter,
      songs_sort,
      now_sales_status,
    ],
    async () => {
      const res = await getNftCollectionNftList({
        id: id,
        search_keyword: search,
        nft_rating: grade_filter,
        sales_token: token_filter,
        sort_by: songs_sort,
        now_sales_status: now_sales_status,
      });
      return res.data;
    }
  );

  return (
    <ContentWrap title="NFT Items">
      {isLoading && <Loading />}
      <ContentWrap.SubWrap gap={8}>
        <SubCategories
          categories={subCategoryList}
          handler={handleSubCategory}
          value={now_sales_status}
        />
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <NftItemList data={data?.data_list || []} />
      <Pagination totalCount={data?.total_cnt} viewCount={12} page={page} />
    </ContentWrap>
  );
};

/**
 * 히스토리 컴포넌트
 */
const History = ({ id }) => {
  const [searchParams] = useSearchParams();

  // URL 파라미터
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const grade_filter = searchParams.get('grade_filter');
  const token_filter = searchParams.get('token_filter');
  const songs_sort = searchParams.get('songs_sort');

  /**
   * 컬렉션 활동 기록 조회
   */
  const { data, isLoading } = useQuery(
    ['collection_history_data', id, page, search, grade_filter, token_filter, songs_sort],
    async () => {
      const res = await getNftCollectionHistory({
        id: id,
        page: page,
        search_keyword: search,
        nft_rating: grade_filter,
        sort_by: songs_sort,
        sales_token: token_filter,
      });
      return res.data;
    }
  );

  return (
    <ContentWrap title="History">
      {isLoading && <Loading />}
      <ContentWrap.SubWrap gap={8}>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <Search placeholder="Search" />
        <CollectionHistoryTable data={data?.data_list} />
      </ContentWrap.SubWrap>
      <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
    </ContentWrap>
  );
};

export default CollectionDetail;
