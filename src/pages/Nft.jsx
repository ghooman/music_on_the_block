import React, { useEffect, useState } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import { NftSlider } from '../components/nft/NftSlider';
import { NftGraph } from '../components/nft/NftGraph';
import Search from '../components/unit/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/Nft.scss';
import { Link, useNavigate } from 'react-router-dom';
import { getNftsMain, getNftsStatistics } from '../api/nfts/nftsMainApi';
import PreparingModal from '../components/PreparingModal';

const Nft = () => {
  const [nftList, setNftList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [showPreparingModal, setShowPreparingModal] = useState(false);
  const [nftStatistics, setNftStatistics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    //=================
    // 스테이티스틱스
    //=================
    const fetchNftStatistics = async () => {
      try {
        const response = await getNftsStatistics();
        console.log(response?.data, '스테이티스틱스');
        setNftStatistics(response.data);
      } catch (e) {
        console.error('Failed to fetch NFTs Statistics', e);
      }
    };

    //=================
    // 메인 데이터
    //=================
    const fetchNftsMain = async () => {
      try {
        const response = await getNftsMain();
        console.log(response.data, '리스폰스 데이터');
        setNftList(response.data.nft_list);
        setCollectionList(response.data.nft_collection_list);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
    };
    fetchNftStatistics();
    fetchNftsMain();
  }, []);

  return (
    <div className="nft">
      <NftExchange />
      <Search
        placeholder="Search"
        handler={search => navigate(`/nft/list?category?=NFT+item&page=1&search=${search}`)}
      />
      <ContentWrap title="TOP NFTs" link="/nft/list?category=NFT+item&page=1">
        <NftItemList data={nftList} />
      </ContentWrap>
      <ContentWrap title="Popular Collection" link="/nft/list?category=Collection&page=1">
        <CollectionItemList data={collectionList} />
      </ContentWrap>
      <ContentWrap title="Popular Genre">
        <NftSlider />
      </ContentWrap>
      <ContentWrap title="Data">
        <InfoRowWrap row={4}>
          <InfoRowWrap.ValueItem
            title="Total Volume"
            value={nftStatistics?.total_price?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Average Price"
            value={nftStatistics?.avg_price?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Number of NFTs Issued"
            value={nftStatistics?.create_nft_cnt?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Highest Deal Today"
            value={nftStatistics?.today_max_price?.toLocaleString()}
          />
        </InfoRowWrap>
        <NftGraph
          barGraphData={nftStatistics?.total_transaction_price_progress}
          lineGraphData={nftStatistics?.create_nft_progress}
        />
      </ContentWrap>
      {showPreparingModal && <PreparingModal setShowPreparingModal={setShowPreparingModal} />}
    </div>
  );
};

export default Nft;

const NftExchange = ({ setShowPreparingModal }) => {
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
          <button
            className="nft__exchange--button mint"
            onClick={() => setShowPreparingModal(true)}
          >
            Mint NFT
          </button>
          <button className="nft__exchange--button" onClick={() => setShowPreparingModal(true)}>
            Sell NFT
          </button>
        </div>
      </div>
    </div>
  );
};
