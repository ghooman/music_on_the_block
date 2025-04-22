import { useState } from 'react';

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

    return (
        <div className="collection-detail">
            <CollectionInfo />
            <Categories
                categories={['Overview', 'NFT Item', 'History']}
                value={selectCategory}
                onClick={setSelectCategory}
            />
            {selectCategory === 'Overview' && <Overview />}
            {selectCategory === 'NFT Item' && <NFTItems />}
            {selectCategory === 'History' && <History />}
        </div>
    );
};

export default CollectionDetail;

const CollectionInfo = () => {
    return (
        <div className="collection-detail-info-wrap">
            <div className="collection-detail-info">
                <div className="collection-detail-info__data">
                    <img className="collection-detail-info__data--image" src={dummy_collectionImage} alt="images" />
                    <div className="collection-detail-info__data--texts">
                        <h1 className="texts__title">Collection Name</h1>
                        <div className="texts__user">
                            <img src={dummy_userImage} alt="images" />
                            YolkHead
                        </div>
                        {/* <div className="texts__desc">
                            <p className="texts__desc--title">Collection Description:</p>
                            <p className="texts__desc--text">
                                "A collection that captures time, moments completed through art" is not just a mere
                                assembly of objects. It is a trace of accumulated time, pieces that complete a single
                                story. Collecting something is a precious act that imbues the object with deep affection
                                and meaning.
                            </p>
                        </div> */}
                        <div className="collection-detail-info__like">
                            <img src={likeImage} alt="like" /> 22,353
                        </div>
                    </div>
                </div>
                <div className="collection-detail-info__stats">
                    <CollectionInfo.StatsItem title="NFT Items" value={2} suffix="ITEMS" />
                    <CollectionInfo.StatsItem title="Highest Price" value={10.39} suffix="MOB" />
                    <CollectionInfo.StatsItem title="Lowest Price" value={0.01} suffix="MOB" />
                    <CollectionInfo.StatsItem title="Total Volume" value={10} suffix="MOB" />
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

const Overview = () => {
    return (
        <>
            <ContentWrap title="Overview">
                <NftOverview title="Detail">
                    {/* <NftOverviewItem 
                        title="two" 
                        value="100 MOB" 
                        isTwo
                    />
                    <NftOverviewItem 
                        title="two" 
                        value="100 MOB" 
                        isTwo
                    /> */}
                    <NftOverviewItem title="NFT Items" value="1,573" />
                    <NftOverviewItem title="Number of Transactions" value="125" />
                    <NftOverviewItem title="Total Volume" value="342,453" />
                    <NftOverviewItem title="Average Price" value="100 MOB" />
                    <NftOverviewItem title="Highest Price" value="100 MOB" />
                    <NftOverviewItem title="Lowest Price" value="100 MOB" />
                    <NftOverviewItem title="Recent Transaction Date" value="Sat, 04 Nov 2023 14:40:00 UTC+9" isLong />
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
    return (
        <ContentWrap title="NFT Items">
            <ContentWrap.SubWrap gap={8}>
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
                    headers={[
                        '#',
                        'Type',
                        'Item',
                        'Artist Name',
                        'Price(MOB)',
                        'Details',
                    ]}
                />
            </ContentWrap.SubWrap>
            <Pagination />
        </ContentWrap>
    );
};
