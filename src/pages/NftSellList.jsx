import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import SongPlayTable from '../components/table/SongPlayTable';
import Pagination from '../components/unit/Pagination';
import Loading from '../components/IntroLogo2';
import { AuthContext } from '../contexts/AuthContext';

const serverApi = process.env.REACT_APP_SERVER_API;

const NftSellList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useContext(AuthContext);

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');
  const gradeFilter = searchParams.get('grade_filter');

  const { data: songList, isLoading } = useQuery(
    ['nft_sell_list', { page, search, songsSort, gradeFilter }],
    async () => {
      const res = await axios.get(`${serverApi}/api/nfts/my/sellable`, {
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
      return res.data;
    },

    { refetchOnMount: false }
  );

  const handleSell = () => {
    alert('판매!');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <ContentWrap title="Sell NFT">
        <ContentWrap.SubWrap gap={8}>
          <ContentWrap.SubTitle subTitle={'Sell one of your NFTs'} />
          <Filter songsSort={true} gradeFilter={true} />
          <Search placeholder="Search" />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songList?.data?.data_list}
          likesOption={true}
          playsOption={true}
          artistOption={false}
          sellOption={true}
          gradeOption={true}
          handleSell={() => handleSell()}
        />
        <Pagination totalCount={songList?.total_cnt} viewCount={15} page={page} />
      </ContentWrap>
    </div>
  );
};

export default NftSellList;
