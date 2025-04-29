import React, { useEffect, useState } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import { NftSlider } from '../components/nft/NftSlider';
import { NftGraph } from '../components/nft/NftGraph';
import Search from '../components/unit/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/Nft.scss';
import { Link } from 'react-router-dom';
import { getNftsMain } from '../api/nfts/nftsMainApi';
const Nft = () => {
  const [nftList, setNftList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  useEffect(() => {
    const fetchNftsMain = async () => {
      try {
        const response = await getNftsMain();
        setNftList(response?.data?.nft_list);
        setCollectionList(response?.data?.nft_collection_list);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
    };

    fetchNftsMain();
  }, []);
  return (
    <div className="nft">
      <NftExchange />
      <Search placeholder="Search" />
      <ContentWrap title="TOP NFTs" link="/nft/list">
        <NftItemList data={nftList} />
      </ContentWrap>
      <ContentWrap title="Popular Collection" link="/nft/list">
        <CollectionItemList data={collectionList} />
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

      <div className="nft__exchange--btns">
        <div className="nft__exchange--btns__left">
          <Link className="nft__exchange--button my" to="/my-page?category=NFT MarketPlace">
            My NFTs
          </Link>
        </div>
        <div className="nft__exchange--btns__right">
          <Link className="nft__exchange--button mint" to="/nft/mint/list">
            Mint NFT
          </Link>
          <Link className="nft__exchange--button" to="/nft/sell/list">
            Sell NFT
          </Link>
        </div>
      </div>
    </div>
  );
};
