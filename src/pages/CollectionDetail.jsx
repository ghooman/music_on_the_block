import { useState } from 'react';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/nft/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/nft/Pagination';
import FilterItems from '../components/nft/FilterItems';
import Search from '../components/nft/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';

import likeImage from '../assets/images/like-icon/like-icon-on.svg';
import unLikeImage from '../assets/images/like-icon/like-icon.svg';
import dummy_collectionImage from '../assets/images/nft/collection01.png';
import dummy_userImage from '../assets/images/account/demo-user1.png';

import '../styles/CollectionDetail.scss';

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
                    <div className="collection-detail-info__data--texts">
                        <h1 className="texts__title">Collection Name</h1>
                        <div className="texts__user">
                            <img src={dummy_userImage} alt="images" />
                            YolkHead
                        </div>
                        <div className="texts__desc">
                            <p className="texts__desc--title">Collection Description:</p>
                            <p className="texts__desc--text">
                                "A collection that captures time, moments completed through art" is not just a mere
                                assembly of objects. It is a trace of accumulated time, pieces that complete a single
                                story. Collecting something is a precious act that imbues the object with deep affection
                                and meaning.
                            </p>
                        </div>
                        <div className="collection-detail-info__like">
                            <img src={likeImage} alt="like" /> 22,353
                        </div>
                    </div>
                    <img className="collection-detail-info__data--image" src={dummy_collectionImage} alt="images" />
                </div>
                <div className="collection-detail-info__stats">
                    <CollectionInfo.StatsItem title="Number of NFT Items" value={2} suffix="ITEMS" />
                    <CollectionInfo.StatsItem title="Highest Price" value={10.39} suffix="MOB" />
                    <CollectionInfo.StatsItem title="Lowest Price" value={0.01} suffix="MOB" />
                    <CollectionInfo.StatsItem title="Total Volume" value={10 + ' MOB'} />
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
            <ContentWrap title="Graph List"></ContentWrap>
            <ContentWrap title="Top NFTs in this Collection">
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
        <ContentWrap title="Activities">
            <InfoRowWrap row={3}>
                <InfoRowWrap.UserItem
                    title="Most Purchased User"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Highest Bidding User"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Most Recently Traded User"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
            </InfoRowWrap>
            <ContentWrap.SubWrap gap={8}>
                <FilterItems />
                <Search />
            </ContentWrap.SubWrap>
            <Pagination />
        </ContentWrap>
    );
};
