import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('nft_marketplace');

  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [mintData, setMintData] = useState(null);
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');
  const gradeFilter = searchParams.get('grade_filter');
  const aiServiceFilter = searchParams.get('ai_service_filter');
  const navigate = useNavigate();

  // 더미
  const {
    data: songList,
    isLoading,
    refetch,
  } = useQuery(
    ['nft_mint_list', { page, search, songsSort, gradeFilter, aiServiceFilter }],
    async () => {
      const res = await axios.get(`${serverApi}/api/nfts/mitable`, {
        params: {
          page: page,
          search_keyword: search,
          sort_by: songsSort,
          nft_rating: gradeFilter,
          ai_service: aiServiceFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res?.data?.data;
    },
    { refetchOnMount: false }
  );

  const handleMint = item => {
    setMintData(item);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div>
      <ContentWrap title={t('Mint NFT')}>
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} gradeFilter={true} aiServiceFilter={true} />
          <Search placeholder="Search" />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songList?.data_list}
          likesOption={true}
          playsOption={true}
          artistOption={false}
          mintOption={true}
          gradeOption={true}
          handleMint={item => handleMint(item)}
        />
        <Pagination totalCount={songList?.total_cnt} viewCount={10} page={page} />
      </ContentWrap>
      {mintData && (
        <NftConfirmModal
          setShowModal={setMintData}
          setShowSuccessModal={setShowMintSuccess}
          title="Confirm"
          confirmSellTxt={false}
          confirmMintTxt={true}
          confirmCancelTxt={false}
          confirmBuyTxt={false}
          selectedSong={selectedSong}
          songId={mintData?.id}
          nftName={mintData?.title}
          // onSuccess={() => {
          //   refetch();
          // }}
        />
      )}
      <Loading isLoading={isLoading} />
    </div>
  );
};

export default NftMintList;
