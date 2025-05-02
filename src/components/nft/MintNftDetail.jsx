// 🔧 React & 기본 라이브러리
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import 'react-h5-audio-player/lib/styles.css';

// 🧠 컨텍스트
import { AuthContext } from '../../contexts/AuthContext';

// 📦 API
import { getMyNftCollections } from '../../api/nfts/nftCollectionsApi';
import { getNftDetail } from '../../api/nfts/nftDetailApi';

// 💻 컴포넌트
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import Filter from '../unit/Filter';
import SongsBar from '../unit/SongsBar';
import NoneContent from '../unit/NoneContent';
import ErrorModal from '../modal/ErrorModal';
import Loading from '../IntroLogo2';
import NftConfirmModal from '../NftConfirmModal';
import NftConfirmSuccessModal from '../NftConfirmSuccessModal';
import CreateCollectionModal from '../CreateCollectionModal';
import BuyNftModal from './BuyNftModal';
import { CollectionItemList } from './NftItem';

// 🎨 스타일 & 에셋
import './MintNftDetail.scss';
import editIcon from '../../assets/images/edit.svg';

// ────────────────────────────────
function MintNftDetail() {
  const { token, walletAddress } = useContext(AuthContext);
  const { id, nft_id, status } = useParams();
  const { ref, inView } = useInView({ threshold: 1.0 });

  const [searchParams] = useSearchParams();
  const [selectedCollection, setSelectedCollection] = useState(null);

  // 모달

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [mintNftModal, setMintNftModal] = useState(false);
  const [buyNftModal, setBuyNftModal] = useState(false);

  const navigate = useNavigate();

  const search = searchParams.get('search');
  const collectionSort = searchParams.get('collection_sort');

  // NFT 검사
  const { data: nftData, isLoading: nftLoading } = useQuery(
    ['nft_data_for_mint', id, nft_id],
    async () => {
      const res = await getNftDetail({ nft_id: nft_id, wallet_address: walletAddress?.address });
      return res.data;
    },
    {
      enabled: status === 'buy',
      refetchOnWindowFocus: false,
      retry: 0,
      onError: e => {
        setErrorMessage(e?.response?.data?.detail || 'Error');
      },
    }
  );

  // 무한 스크롤
  const {
    data: collectionData,
    hasNextPage,
    fetchNextPage,
    isLoading: collectionsLoading,
    refetch,
  } = useInfiniteQuery(
    ['collections_list_for_mint', token, collectionSort, search],
    async ({ pageParam = 1 }) => {
      const res = await getMyNftCollections(token, pageParam, collectionSort, search);
      return res;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalLoaded = allPages.reduce((sum, page) => sum + page.data_list.length, 0);
        return totalLoaded < lastPage.total_cnt ? allPages.length + 1 : undefined;
      },
    }
  );

  const allItems = collectionData?.pages?.flatMap(page => page.data_list) || [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      {(collectionsLoading || nftLoading) && <Loading />}
      <div className="mint-detail">
        <dl className="album-detail__title">
          <dt>{status === 'mint' ? 'Mint NFT' : 'Buy NFT'}</dt>
        </dl>
        <SongsBar />
        <ContentWrap title="Select Collection">
          <div className="filter-create">
            <Filter collectionSort={true} />
            <button className="create-btn" onClick={() => setShowCollectionModal(true)}>
              Create New Collection
              <img src={editIcon} alt="editIcon" />
            </button>
          </div>
          <Search placeholder="Search Collection" />
          {allItems.length === 0 ? (
            <NoneContent message="There are no collections." height={300} />
          ) : (
            <div className="scroll-box">
              <CollectionItemList
                data={allItems}
                linkMove={false}
                setSelectedCollection={setSelectedCollection}
              />
              <div ref={ref} style={{ height: 1 }}></div>
            </div>
          )}
          <button
            className={`mint-btn ${selectedCollection ? '' : 'disabled'}`}
            onClick={() => {
              if (status === 'mint') setMintNftModal(true);
              else if (status === 'buy') setBuyNftModal(true);
            }}
            disabled={!selectedCollection}
          >
            {status}
          </button>
        </ContentWrap>
      </div>
      {mintNftModal && (
        <NftConfirmModal
          setShowModal={setMintNftModal}
          setShowSuccessModal={setShowSuccessModal}
          title="Confirm Mint"
          confirmSellTxt={false}
          confirmMintTxt={true}
          songId={id}
          selectedCollection={selectedCollection}
        />
      )}
      {showSuccessModal && (
        <NftConfirmSuccessModal
          setShowSuccessModal={setShowSuccessModal}
          title="To mint your song, create or select a collection."
        />
      )}
      {showCollectionModal && (
        <CreateCollectionModal
          setShowCollectionModal={setShowCollectionModal}
          fetchMyNftCollections={refetch}
        />
      )}
      {buyNftModal && (
        <BuyNftModal
          setBuyNftModal={setBuyNftModal}
          nftData={nftData}
          selectedCollection={selectedCollection}
        />
      )}
      {errorMessage && (
        <ErrorModal
          setShowErrorModal={setErrorMessage}
          message={errorMessage}
          button
          action={() => navigate('/')}
        />
      )}
    </>
  );
}

export default MintNftDetail;
