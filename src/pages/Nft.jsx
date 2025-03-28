import ContentWrap from '../components/nft/ContentWrap';
import { NftItemWraps, NftItem } from '../components/nft/NftItem';
import Search from '../components/nft/Search';

const Nft = () => {
    return (
        <div>
            <ContentWrap title="TOP NFTs" link="1">
                <Search />
                <NftItemWraps data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
            </ContentWrap>
        </div>
    );
};

export default Nft;
