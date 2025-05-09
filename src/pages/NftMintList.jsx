import axios from 'axios';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import SongPlayTable from '../components/table/SongPlayTable';
import Pagination from '../components/unit/Pagination';
import Loading from '../components/IntroLogo2';
import NftConfirmModal from '../components/NftConfirmModal';
const serverApi = process.env.REACT_APP_SERVER_API;

const NftMintList = () => {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');
  const gradeFilter = searchParams.get('grade_filter');

  // 더미
  const { data: songList, isLoading } = useQuery(
    ['nft_mint_list', { page, search, songsSort, gradeFilter }],
    async () => {
      const res = await axios.get(`${serverApi}/api/nfts/mitable`, {
        params: {
          page: page,
          search_keyword: search,
          sort_by: songsSort,
          nft_rating: gradeFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res?.data?.data;
    },
    { refetchOnMount: false }
  );

  const handleMint = () => {
    alert('민트!');
    // 민트 함수 정의 해주세염
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <ContentWrap title="Mint an NFT">
        <ContentWrap.SubWrap gap={8}>
          <ContentWrap.SubTitle subTitle="Mint one of your songs" />
          <Filter songsSort={true} gradeFilter={true} />
          <Search placeholder="Search" />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songList?.data_list}
          likesOption={true}
          playsOption={true}
          artistOption={false}
          mintOption={true}
          gradeOption={true}
          handleMint={() => handleMint()}
        />
        <Pagination totalCount={songList?.total_cnt} viewCount={10} page={page} />
      </ContentWrap>
      {showMintModal && (
        <NftConfirmModal
          setShowModal={setShowMintModal}
          setShowSuccessModal={setShowMintSuccess}
          title="Confirm"
          confirmSellTxt={false}
          confirmMintTxt={true}
          confirmCancelTxt={false}
          confirmBuyTxt={false}
          selectedSong={selectedSong}
          onSuccess={() => {
            setShowMintSuccess(false);
          }}
        />
      )}
    </div>
  );
};

export default NftMintList;
