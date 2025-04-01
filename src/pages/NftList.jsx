import { useState } from 'react';
import Categories from '../components/nft/Categories';
import ContentWrap from '../components/nft/ContentWrap';
import { CollectionItemList, NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/nft/Pagination';
import Search from '../components/nft/Search';
import FilterItems from '../components/nft/FilterItems';
import { InfoRowWrap } from '../components/nft/InfoRow';

const NftList = () => {
    const [selectCategory, setSelectCategory] = useState('NFT item');

    return (
        <ContentWrap title="NFT list">
            <Categories categories={['NFT item', 'Collection']} value={selectCategory} onClick={setSelectCategory} />
            <FilterItems />
            <Search />
            {selectCategory === 'NFT item' && <NftItemList data={[1, 2, 3, 4, 5, 6, 7, 8]} />}
            {selectCategory === 'Collection' && <CollectionItemList data={[1, 2, 3, 4, 5, 6, 7, 8]} />}
            <Pagination />
            <InfoRowWrap row={4}>
                <InfoRowWrap.ValueItem title="Total Volume" value="하하하3하" />
                <InfoRowWrap.ValueItem title="Total Volume" value="히히히히" />
                <InfoRowWrap.ValueItem title="Total Volume" value="히하ㅓdf히ㅏ허" />
                <InfoRowWrap.ValueItem title="Total Volume" value="히하ㅓ히ㅏ허" />
            </InfoRowWrap>
        </ContentWrap>
    );
};

export default NftList;
