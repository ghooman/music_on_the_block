import axios from 'axios';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import SongPlayTable from '../components/unit/SongPlayTable';
import Pagination from '../components/unit/Pagination';
import Loading from '../components/IntroLogo2';

const serverApi = process.env.REACT_APP_SERVER_API;

const NftMintList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');

  // 더미
  const { data: songList, isLoading } = useQuery(
    ['nft_sell_list', { page, search, songsSort }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/all/list`, {
        params: {
          page: page,
          search_keyword: search,
          sort_by: songsSort,
        },
      });
      return res.data;
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

  return (
    <div>
      <ContentWrap title="Mint an NFT">
        <ContentWrap.SubWrap gap={8}>
          <ContentWrap.SubTitle subTitle="Mint one of your songs" />
          <Filter songsSort={true} />
          <Search placeholder="Search" />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songList?.data_list}
          likesOption={true}
          playsOption={true}
          artistOption={false}
          mintOption={true}
          handleMint={() => handleMint()}
        />
        <Pagination totalCount={songList?.total_cnt} viewCount={15} page={page} />
      </ContentWrap>
      {isLoading && <Loading />}
    </div>
  );
};

export default NftMintList;
