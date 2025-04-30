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
// ────────────────────────────────
function MintNftDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [myNftCollections, setMyNftCollections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);

  const [searchParamas, setSearchParams] = useSearchParams();

  const fetchMyNftCollections = async () => {
    try {
      const response = await getMyNftCollections(token, currentPage, sortBy, searchKeyword);
      setMyNftCollections(response?.data_list);
      // console.log('myNftCollections', myNftCollections);
    } catch (error) {
      console.error('나의 NFTS 컬렉션 조회 실패:', error);
    }
  };
  useEffect(() => {
    fetchMyNftCollections();
  }, [token, currentPage, sortBy, searchKeyword]);

  return (
    <>
      <div className="mint-detail">
        <dl className="album-detail__title">
          <dt>Mint NFT</dt>
        </dl>
        <SongsBar />
        <ContentWrap title="Select Collection">
          <div className="filter-create">
            <Filter connectionsSort={true} />
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
            className={selectedCollection ? 'mint-btn' : 'mint-btn disabled'}
            onClick={selectedCollection ? () => setShowModal(true) : null}
          >
            Mint
          </button>
        </ContentWrap>
      </div>
      {showModal && (
        <NftConfirmModal
          setShowModal={setShowModal}
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
    </>
  );
}

export default MintNftDetail;
