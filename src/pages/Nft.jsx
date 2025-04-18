import React from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import { NftSlider } from '../components/nft/NftSlider';
import { NftGraph } from '../components/nft/NftGraph';
import Search from '../components/unit/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/Nft.scss';

const Nft = () => {
    return (
        <div className="nft">
            <NftExchange />
            <Search placeholder="Search" />
            <ContentWrap title="TOP NFTs" link="/nft/list">
                <NftItemList data={[1, 2, 3, 4]} />
            </ContentWrap>
            <ContentWrap title="Popular Collection" link="/nft/list">
                <CollectionItemList data={[1, 2, 3]} />
            </ContentWrap>
            <ContentWrap title="Popular Genre">
                <NftSlider />
            </ContentWrap>
            <ContentWrap title="Data">
                <InfoRowWrap row={4}>
                    <InfoRowWrap.ValueItem title="Total Volume" value="16,145" />
                    <InfoRowWrap.ValueItem title="Average Price" value="240" />
                    <InfoRowWrap.ValueItem title="Number of NFTs Issued" value="3,224" />
                    <InfoRowWrap.ValueItem title="Highest Deal Today" value="4,359" />
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
            <h1 className="nft__exchange--title">NFT MarketPlace</h1>
            <p className="nft__exchange--desc">
                Your music, now as an NFT
                <br />
                Connect AI-generated creations with the world
            </p>
            <button className="nft__exchange--button">Mint NFT</button>
        </div>
    );
};
