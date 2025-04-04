import { useState } from 'react';
import Categories from '../components/nft/Categories';
import ContentWrap from '../components/nft/ContentWrap';
import { CollectionItemList, NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/nft/Pagination';
import Search from '../components/nft/Search';
import FilterItems from '../components/nft/FilterItems';

import '../styles/NftList.scss';

const NftList = () => {
    const [selectCategory, setSelectCategory] = useState('NFT item');

    return (
        <div className="nft-list">
            <Categories categories={['NFT item', 'Collection']} value={selectCategory} onClick={setSelectCategory} />
            <ContentWrap title={`NFT list (${selectCategory === 'NFT item' ? 'item' : 'Collection'})`}>
                <ContentWrap.SubWrap gap={8}>
                    <FilterItems />
                    <Search />
                </ContentWrap.SubWrap>
                {selectCategory === 'NFT item' && <NftItemList data={[1, 2, 3, 4, 5, 6, 7, 8]} />}
                {selectCategory === 'Collection' && <CollectionItemList data={[1, 2, 3, 4, 5, 6, 7, 8]} />}
                <Pagination />
            </ContentWrap>
        </div>
    );
};

export default NftList;
