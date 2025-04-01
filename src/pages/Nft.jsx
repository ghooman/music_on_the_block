import React from "react";
import ContentWrap from '../components/nft/ContentWrap';
import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import { NftSlider } from '../components/nft/NftSlider';
import { NftGraph } from '../components/nft/NftGraph';
import Search from '../components/nft/Search';
import nftBanner from '../assets/images/nft/nft-banner.png';
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
            <ContentWrap title="Popular Genre">
                <NftSlider />
            </ContentWrap>
            <ContentWrap title="Data">
                <InfoRowWrap row={4}>
                    <InfoRowWrap.ValueItem title="Total Volume" value="16,145" />
                    <InfoRowWrap.ValueItem title="Total Volume" value="240" />
                    <InfoRowWrap.ValueItem title="Total Volume" value="3,224" />
                    <InfoRowWrap.ValueItem title="Total Volume" value="4,359" />
                </InfoRowWrap>
                <NftGraph />
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
