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
import Loading from '../components/IntroLogo2';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

const Nft = () => {
  const { t } = useTranslation('nft_marketplace');

  const navigate = useNavigate();

  const { data: nftStatistics, isLoading: statisticsLoading } = useQuery(
    ['nft_statistics'],
    async () => {
      const res = await getNftsStatistics();
      return res.data;
    }
  );

  const { data: nftListData, isLoading: listLoading } = useQuery(
    ['nft_main_list_data'],
    async () => {
      const res = await getNftsMain();
      return res.data;
    }
  );

  return (
    <div className="nft">
      <NftExchange navigate={navigate} />
      <Search
        placeholder="Search by item name"
        handler={search => navigate(`/nft/list?category?=NFT+Items&page=1&search=${search}`)}
      />
      <ContentWrap title={t('TOP NFTs')} link="/nft/list?category=NFT+Items&page=1">
        <NftItemList data={nftListData?.nft_list} />
      </ContentWrap>
      {/* <ContentWrap title="Popular Collection" link="/nft/list?category=Collections&page=1">
        <CollectionItemList data={collectionList} />
      </ContentWrap> */}
      <ContentWrap title={t('Popular Genre')}>
        <NftSlider />
      </ContentWrap>
      <ContentWrap title={t('Data')}>
        <InfoRowWrap row={4}>
          <InfoRowWrap.ValueItem
            title={t('Total Volume')}
            value={'$ ' + (nftStatistics?.total_price?.toLocaleString() || 0)}
          />
          <InfoRowWrap.ValueItem
            title={t('Average Price')}
            value={'$ ' + (nftStatistics?.avg_price?.toLocaleString() || 0)}
          />
          <InfoRowWrap.ValueItem
            title={t('Number of NFTs Issued')}
            value={nftStatistics?.create_nft_cnt?.toLocaleString() || 0}
          />
          <InfoRowWrap.ValueItem
            title={t('Highest Deal Today')}
            value={'$ ' + (nftStatistics?.today_max_price?.toLocaleString() || 0)}
          />
        </InfoRowWrap>
        <NftGraph
          barTitle={t('Number of Transactions')}
          barGraphData={nftStatistics?.total_transaction_price_progress}
          lineTitle={t('NFT Price Change Trend')}
          lineGraphData={nftStatistics?.create_nft_progress}
        />
      </ContentWrap>
      {(statisticsLoading || listLoading) && <Loading />}
    </div>
  );
};

export default Nft;

const NftExchange = () => {
  const { t } = useTranslation('nft_marketplace');

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
      <h1 className="nft__exchange--title">{t('NFT MarketPlace')}</h1>
      <p className="nft__exchange--desc">
        {t('Your music, now as an NFT')}
        <br />
        {t('Connect AI-generated creations with the world')}
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
            to="/my-page?category=NFTs"
            onClick={handleButtonClick}
          >
            {t('My NFTs')}
          </Link>
        </div>
        <div className="nft__exchange--btns__right">
          <Link
            className="nft__exchange--button mint"
            to="/nft/mint/list"
            onClick={handleButtonClick}
          >
            {t('Mint NFT')}
          </Link>
          <Link className="nft__exchange--button" to="/nft/sell/list" onClick={handleButtonClick}>
            {t('Sell NFT')}
          </Link>
        </div>
      </div>
    </div>
  );
};
