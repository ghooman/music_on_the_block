import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SongPlayTable from '../../table/SongPlayTable';
import Loading from '../../../components/IntroLogo2';
import TopSongsTemplate from './TopSongsTemplate';

import './Songs.scss';
import { useTranslation } from 'react-i18next';

const serverApi = process.env.REACT_APP_SERVER_API;

const UserSongsList = ({ username }) => {
  const { t } = useTranslation('my_page');

  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');

  const { data: topSongsData, isLoading: topSongLoading } = useQuery(
    ['top_songs_data_by_username', { username }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/top/list?name=${username}`);
      return res.data;
    }
  );

  const { data: songList, isLoading: songListLoading } = useQuery(
    ['song_list_by_username', { page, search, songsSort, username }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/all/list`, {
        params: {
          page: page,
          search_keyword: search,
          sort_by: songsSort,
          name: username,
        },
      });
      return res.data;
    }
  );

  return (
    <div className="songs">
      <TopSongsTemplate topSongsData={topSongsData} />
      <ContentWrap title={t('Song List')}>
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} />
          <Search reset={{ page: 1 }} placeholder={t('Search by song title') + '...'} />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songList?.data_list}
          gradeOption={true}
          nftOption={true}
          artistOption={false}
        />
        <Pagination totalCount={songList?.total_cnt} viewCount={15} page={page} />
      </ContentWrap>
      {(topSongLoading || songListLoading) && <Loading />}
    </div>
  );
};

export default UserSongsList;
