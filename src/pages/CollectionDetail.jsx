import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';

import likeImage from '../assets/images/like-icon/like-icon-on.svg';
import unLikeImage from '../assets/images/like-icon/like-icon.svg';

import '../styles/CollectionDetail.scss';
import { NftGraph } from '../components/nft/NftGraph';
import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
import SubCategories from '../components/unit/SubCategories';

import {
  getNftCollectionDetail,
  getNftCollectionOverview,
  getNftCollectionNftList,
  getNftCollectionHistory,
} from '../api/nfts/nftCollectionsApi';

import CollectionHistoryTable from '../components/table/CollectionHistoryTable';
const CollectionDetail = () => {
  const [selectCategory, setSelectCategory] = useState('Overview');
  const [collectionDetail, setCollectionDetail] = useState(null);
  const [collectionNftList, setCollectionNftList] = useState(null);
  const [collectionNftListTotalCnt, setCollectionNftListTotalCnt] = useState(null);
  const [collectionHistory, setCollectionHistory] = useState(null);
  const [collectionHistoryTotalCnt, setCollectionHistoryTotalCnt] = useState(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const sort_by = searchParams.get('sort_by');
  const ai_service = searchParams.get('ai_service');
  const nft_rating = searchParams.get('nft_rating');
  const salse_token = searchParams.get('salse_token');

  // 컬렉션 기본 정보
  const fetchCollectionDetail = async () => {
    try {
      const response = await getNftCollectionDetail({ id });
      setCollectionDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch collection detail:', error);
    }
  };
  // 컬렉션 NFT 리스트
  const fetchCollectionNftList = async () => {
    try {
      const response = await getNftCollectionNftList({
        id,
        page,
        sort_by,
        search_keyword: search,
        ai_service,
        nft_rating,
        salse_token,
      });
      console.log(response.data, '컬렉션 NFT 리스트');
      setCollectionNftList(response.data?.data_list);
      setCollectionNftListTotalCnt(response.data.total_cnt);
    } catch (error) {
      console.error('Failed to fetch collection NFT list:', error);
    }
  };
  // 컬렉션 활동 기록
  const fetchCollectionHistory = async () => {
    try {
      const response = await getNftCollectionHistory({
        id,
        page,
        sort_by,
        search_keyword: search,
        ai_service,
        nft_rating,
        salse_token,
      });
      console.log(response.data, '컬렉션 활동 기록');
      setCollectionHistory(response.data?.data_list);
      setCollectionHistoryTotalCnt(response.data.total_cnt);
    } catch (error) {
      console.error('Failed to fetch collection history:', error);
    }
  };
  useEffect(() => {
    fetchCollectionDetail();
  }, [id]);

  useEffect(() => {
    if (selectCategory === 'NFT Item') {
      fetchCollectionNftList();
    }
  }, [id, page, search, sort_by, ai_service, nft_rating, salse_token, selectCategory]);

  return (
    <div className="collection-detail">
      <CollectionInfo collectionDetail={collectionDetail} />
      <Categories
        categories={['Overview', 'NFT Item', 'History']}
        value={selectCategory}
        onClick={setSelectCategory}
      />
      {selectCategory === 'Overview' && <Overview id={id} />}
      {selectCategory === 'NFT Item' && (
        <NFTItems
          id={id}
          collectionNftList={collectionNftList}
          collectionNftListTotalCnt={collectionNftListTotalCnt}
          fetchCollectionNftList={fetchCollectionNftList}
        />
      )}
      {selectCategory === 'History' && (
        <History
          id={id}
          collectionHistory={collectionHistory}
          fetchCollectionHistory={fetchCollectionHistory}
          collectionHistoryTotalCnt={collectionHistoryTotalCnt}
        />
      )}
    </div>
  );
};

export default CollectionDetail;

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

const NFTItems = ({ id, collectionNftList, collectionNftListTotalCnt, fetchCollectionNftList }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategoryList = [{ name: 'All' }, { name: 'Unlisted' }, { name: 'Listed' }];
  const [selected, setSelected] = useState(subCategoryList[0].name);

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const sort_by = searchParams.get('sort_by');
  const ai_service = searchParams.get('ai_service');
  const nft_rating = searchParams.get('nft_rating');
  const salse_token = searchParams.get('salse_token');
  const now_sales_status = searchParams.get('now_sales_status');

  useEffect(() => {
    fetchCollectionNftList();
  }, [id, page, search, sort_by, ai_service, nft_rating, salse_token, now_sales_status]);

  const handleSearch = keyword => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      search: keyword,
      page: 1,
    });
  };

  const handleSubCategory = categoryName => {
    setSelected(categoryName);

    const params = { ...Object.fromEntries(searchParams), page: 1 };

    if (categoryName === 'All') {
      delete params.now_sales_status;
    } else if (categoryName === 'Listed') {
      params.now_sales_status = 'true';
    } else if (categoryName === 'Unlisted') {
      params.now_sales_status = 'false';
    }

    setSearchParams(params);
  };

  return (
    <ContentWrap title="NFT Items">
      <ContentWrap.SubWrap gap={8}>
        <SubCategories categories={subCategoryList} handler={handleSubCategory} value={selected} />
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <Search placeholder="Search" value={search || ''} onChange={handleSearch} />
      </ContentWrap.SubWrap>
      <NftItemList data={collectionNftList || []} />
      <Pagination
        totalCount={collectionNftListTotalCnt}
        viewCount={12}
        page={page}
        onChange={newPage =>
          setSearchParams({
            ...Object.fromEntries(searchParams),
            page: newPage,
          })
        }
      />
    </ContentWrap>
  );
};

const History = ({ id, collectionHistory, collectionHistoryTotalCnt, fetchCollectionHistory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const sort_by = searchParams.get('sort_by');
  const ai_service = searchParams.get('ai_service');
  const nft_rating = searchParams.get('nft_rating');
  const salse_token = searchParams.get('salse_token');

  useEffect(() => {
    fetchCollectionHistory();
  }, [id, page, search, sort_by, ai_service, nft_rating, salse_token]);

  return (
    <ContentWrap title="History">
      <ContentWrap.SubWrap gap={8}>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <Search placeholder="Search" />
        <CollectionHistoryTable data={collectionHistory} />
      </ContentWrap.SubWrap>
      <Pagination
        totalCount={collectionHistoryTotalCnt}
        viewCount={10}
        page={page}
        onChange={newPage => setSearchParams({ page: newPage })}
      />
    </ContentWrap>
  );
};
