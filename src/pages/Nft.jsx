import ContentWrap from '../components/nft/ContentWrap';
import Search from '../components/nft/Search';

import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import { InfoRowWrap } from '../components/nft/InfoRow';

import '../styles/Nft.scss';

const Nft = () => {
    return (
        <div className="nft">
            <NftExchange />
            <Search />
            <ContentWrap title="TOP NFTs" link="/nft">
                <NftItemList data={[1, 2, 3, 4]} />
            </ContentWrap>
            <ContentWrap title="Popular Collection" link="/nft">
                <CollectionItemList data={[1, 2, 3]} />
            </ContentWrap>
            <ContentWrap title="Popular Genre"></ContentWrap>
            <ContentWrap title="Data">
                <InfoRowWrap row={4}>
                    <InfoRowWrap.ValueItem title="Total Volume" value="14,300" />
                    <InfoRowWrap.ValueItem title="Average Price" value="105" />
                    <InfoRowWrap.ValueItem title="Number of NFTs Issued" value="3,500" />
                    <InfoRowWrap.ValueItem title="Highest Deal Today" value="4,343" />
                </InfoRowWrap>
            </ContentWrap>
        </div>
    );
};

export default Nft;

const NftExchange = () => {
    return (
        <div className="nft__exchange">
            <h1 className="nft__exchange--title">NFT Exchange</h1>
            <p className="nft__exchange--desc">
                Your music, nowe as an NFT
                <br />
                Connect AI-generated creations with the world
            </p>
            <button className="nft__exchange--button">Mint NFT</button>
        </div>
    );
};
