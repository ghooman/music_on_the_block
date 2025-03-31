import ContentWrap from '../components/nft/ContentWrap';
import { NftItemWraps, NftCollectionItemWraps } from '../components/nft/NftItem';
import Search from '../components/nft/Search';

const Nft = () => {
    return (
        <div>
            <ContentWrap title="TOP NFTs" link="1">
                <Search />  

            </ContentWrap>
        </div>
    );
};

export default Nft;
