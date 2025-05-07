import React, { useEffect, useState, useContext } from 'react';
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
import { AuthContext } from '../contexts/AuthContext';
import { WalletConnect } from '../components/WalletConnect';

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
      <NftExchange navigate={navigate} />
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
            value={'$ ' + nftStatistics?.total_price?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Average Price"
            value={'$ ' + nftStatistics?.avg_price?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Number of NFTs Issued"
            value={nftStatistics?.create_nft_cnt?.toLocaleString()}
          />
          <InfoRowWrap.ValueItem
            title="Highest Deal Today"
            value={'$ ' + nftStatistics?.today_max_price?.toLocaleString()}
          />
        </InfoRowWrap>
        <NftGraph
          barTitle="Number of Transactions"
          barGraphData={nftStatistics?.total_transaction_price_progress}
          lineTitle="NFT Price Change Trend"
          lineGraphData={nftStatistics?.create_nft_progress}
        />
      </ContentWrap>
    </div>
  );
};

export default Nft;

const NftExchange = () => {
  const { isRegistered, setIsLoggedIn, setWalletAddress } = useContext(AuthContext);
  const walletConnectRef = React.useRef(null);

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };

  // useEffect를 사용하여 ThirdWeb 버튼을 참조
  useEffect(() => {
    // 컴포넌트가 마운트된 후에 참조할 수 있도록 약간의 지연 추가
    const timer = setTimeout(() => {
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          // 버튼 스타일 설정
          walletConnectButton.style.position = 'absolute';
          walletConnectButton.style.opacity = '0';
          walletConnectButton.style.pointerEvents = 'none';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = e => {
    if (!isRegistered) {
      e.preventDefault();

      // 버튼 클릭 이벤트 발생시키기
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          walletConnectButton.click();
        }
      }
    }
  };

  return (
    <div className="nft__exchange">
      <h1 className="nft__exchange--title">NFT MarketPlace</h1>
      <p className="nft__exchange--desc">
        Your music, now as an NFT
        <br />
        Connect AI-generated creations with the world
      </p>

      {/* 숨겨진 WalletConnect 컴포넌트 */}
      <div
        ref={walletConnectRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          visibility: 'hidden',
        }}
      >
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      <div className="nft__exchange--btns">
        <div className="nft__exchange--btns__left">
          <Link
            className="nft__exchange--button my"
            to="/my-page?category=NFT MarketPlace"
            onClick={handleButtonClick}
          >
            My NFTs
          </Link>
        </div>
        <div className="nft__exchange--btns__right">
          <Link
            className="nft__exchange--button mint"
            to="/nft/mint/list"
            onClick={handleButtonClick}
          >
            Mint NFT
          </Link>
          <Link className="nft__exchange--button" to="/nft/sell/list" onClick={handleButtonClick}>
            Sell NFT
          </Link>
        </div>
      </div>
    </div>
  );
};
