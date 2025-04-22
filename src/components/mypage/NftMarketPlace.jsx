import { useState } from 'react';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';

import './NftMarketPlace.scss';

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
    return (
        <>
            <div className="nft-market-place__button-wrap">
                {nftFilterItemList.map((item) => (
                    <button key={item} className="nft-market-place__button-wrap--button">
                        {item}
                    </button>
                ))}
            </div>
            <ContentWrap title="NFTs list">
                <ContentWrap.SubWrap gap={8}>
                    <Filter />
                    <Search placeholder="Search by Item or Affiliated Collection..." reset={{ page: 1 }} />
                </ContentWrap.SubWrap>
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
        </ContentWrap>
    );
};
