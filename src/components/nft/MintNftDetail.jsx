import './MintNftDetail.scss';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import 'react-h5-audio-player/lib/styles.css';
import ContentWrap from '../unit/ContentWrap';
import { NftItemList, CollectionItemList } from './NftItem';
import Search from '../unit/Search';
import FilterItems from '../unit/FilterItems';
// 이미지·아이콘 ------------------------------------------------------

import editIcon from '../../assets/images/edit.svg';

import NftConfirmModal from '../NftConfirmModal';
import NftConfirmSuccessModal from '../NftConfirmSuccessModal';
import SongsBar from '../unit/SongsBar';
import CreateCollectionModal from '../CreateCollectionModal';
import { getMyNftCollections } from '../../api/nfts/nftCollectionsApi';
import NoneContent from '../unit/NoneContent';
import Filter from '../unit/Filter';
import BuyNftModal from './BuyNftModal';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getNftDetail } from '../../api/nfts/nftDetailApi';
// ────────────────────────────────
function MintNftDetail() {
  const { token, walletAddress } = useContext(AuthContext);
  const { id, status } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [myNftCollections, setMyNftCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const [nftData, setNftData] = useState();

  // 모달

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [mintNftModal, setMintNftModal] = useState(false);
  const [buyNftModal, setBuyNftModal] = useState(false);

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search');
  const collectionSort = searchParams.get('collection_sort');

  const fetchMyNftCollections = async () => {
    try {
      const response = await getMyNftCollections(token, page, collectionSort, search);
      setMyNftCollections(response?.data_list);
    } catch (error) {
      console.error('나의 NFTS 컬렉션 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchMyNftCollections();
  }, [token, page, collectionSort, search]);

  const { data, isLoading } = useQuery(
    ['nft_data_for_mint', id],
    async () => {
      const res = await getNftDetail({ nft_id: id, wallet_address: walletAddress?.address });
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      onError: () => {},
    }
  );

  return (
    <>
      <div className="mint-detail">
        <dl className="album-detail__title">
          <dt>{status === 'mint' ? 'Mint NFT' : 'Buy NFT'}</dt>
        </dl>
        <SongsBar setNftData={setNftData} />
        <ContentWrap title="Select Collection">
          <div className="filter-create">
            <Filter collectionSort={true} />
            <button className="create-btn" onClick={() => setShowCollectionModal(true)}>
              Create New Collection
              <img src={editIcon} alt="editIcon" />
            </button>
          </div>
          <Search placeholder="Search Collection" />
          {myNftCollections?.length === 0 ? (
            <NoneContent message="There are no collections." height={300} />
          ) : (
            <CollectionItemList
              data={myNftCollections}
              linkMove={false}
              setSelectedCollection={setSelectedCollection}
            />
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
          fetchMyNftCollections={fetchMyNftCollections}
        />
      )}
      {buyNftModal && <BuyNftModal setBuyNftModal={setBuyNftModal} />}
    </>
  );
}

export default MintNftDetail;
