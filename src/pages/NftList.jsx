import { useState } from 'react';
import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { CollectionItemList, NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Search from '../components/unit/Search';
import FilterItems from '../components/unit/FilterItems';

import '../styles/NftList.scss';

const NftList = () => {
    const [selectCategory, setSelectCategory] = useState('NFT item');

    return (
        <div className="nft-list">
            <Categories categories={['NFT item', 'Collection']} value={selectCategory} onClick={setSelectCategory} />
            <ContentWrap title={` ${selectCategory === 'NFT item' ? 'NFT Item (List)' : 'NFT Collection (List)'}`}>
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
