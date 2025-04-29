import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import FilterItems from '../components/unit/FilterItems';
import Search from '../components/unit/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';
import CustomTable from '../components/CustomTable';

import likeImage from '../assets/images/like-icon/like-icon-on.svg';
import unLikeImage from '../assets/images/like-icon/like-icon.svg';
import dummy_collectionImage from '../assets/images/nft/collection01.png';
import dummy_userImage from '../assets/images/account/demo-user1.png';

import '../styles/CollectionDetail.scss';
import { NftGraph } from '../components/nft/NftGraph';
import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
import SubCategories from '../components/unit/SubCategories';

import { getNftCollectionDetail, getNftCollectionOverview } from '../api/nfts/nftCollectionsApi';

const dummyData = [
  {
    number: 30,
    type: 'LYRIC',
    item: 'Item Name (#123_1)',
    username: {
      name: 'user',
      picture: dummy_userImage,
    },
    price: '100.000',
    details: 'Details',
  },
  {
    number: 30,
    type: 'COMPOSITION',
    item: 'Item Name (#123_1)',
    username: {
      name: 'Yolkhead',
      picture: dummy_userImage,
    },
    price: '100.000',
    details: 'Details',
  },
  {
    number: 30,
    type: 'SONG',
    item: 'Item Name (#123_1)',
    username: {
      name: 'Alice',
      picture: dummy_userImage,
    },
    price: '100.000',
    details: 'Details',
  },
];

const CollectionDetail = () => {
  const [selectCategory, setSelectCategory] = useState('Overview');
  const [collectionDetail, setCollectionDetail] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        const response = await getNftCollectionDetail({ id });
        setCollectionDetail(response.data);
        setIsOwner(response?.data?.is_owner);
      } catch (error) {
        console.error('Failed to fetch collection detail:', error);
      }
    };
    fetchCollectionDetail();
  }, [id]);

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
            value={collectionOverview?.total_transaction_price}
          />
          <NftOverviewItem
            title="Average Price"
            value={'$ ' + collectionOverview?.avg_transaction_price}
            sub_value={0}
          />
          <NftOverviewItem
            title="Highest Price"
            value={
              collectionOverview?.max_price + ' ' + (collectionOverview?.max_price_token || 'MOB')
            }
            sub_value={'$ 0'}
          />
          <NftOverviewItem
            title="Lowest Price"
            value={
              collectionOverview?.min_price + ' ' + (collectionOverview?.min_price_token || 'MOB')
            }
            sub_value={'$ 0'}
          />
          <NftOverviewItem
            title="Recent Transaction Date"
            value={collectionOverview?.last_transaction_date}
            isLong
          />
        </NftOverview>
      </ContentWrap>
      <ContentWrap title="Graph">
        <NftGraph />
      </ContentWrap>
      <ContentWrap title="Recommended NFTs">
        <NftItemList data={[1, 2, 3, 4]} />
      </ContentWrap>
    </>
  );
};

const NFTItems = () => {
  const subCategoryList = [{ name: 'All' }, { name: 'For Sell' }];
  const [selected, setSelected] = useState(subCategoryList[0].name);

  return (
    <ContentWrap title="NFT Items">
      <ContentWrap.SubWrap gap={8}>
        <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
        <FilterItems />
        <Search />
      </ContentWrap.SubWrap>
      <NftItemList data={[1, 2, 3, 4, 5, 6, 7, 8]} />
      <Pagination />
    </ContentWrap>
  );
};

const History = () => {
  return (
    <ContentWrap title="History">
      {/* <InfoRowWrap row={3}>
                <InfoRowWrap.UserItem
                    title="Most Purchased Artist"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Highest Bidding UArtister"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Most Recently Traded Artist"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
            </InfoRowWrap> */}
      <ContentWrap.SubWrap gap={8}>
        <FilterItems />
        <Search />
        <CustomTable
          data={dummyData}
          headers={['#', 'Type', 'Item', 'Artist Name', 'Price(MOB)', 'Details']}
        />
      </ContentWrap.SubWrap>
      <Pagination />
    </ContentWrap>
  );
};
