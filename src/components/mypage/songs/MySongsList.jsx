import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { GetMyTopAlbumList } from '../../../api/GetMyTopAlbumList';
import { getReleaseAndUnReleaseSongData } from '../../../api/getReleaseAndUnReleaseSongData';

import TopSongsTemplate from './TopSongsTemplate';
import ContentWrap from '../../unit/ContentWrap';
import SubCategories from '../../unit/SubCategories';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import Pagination from '../../unit/Pagination';
import SongPlayTable from '../../table/SongPlayTable';
import NftConfirmModal from '../../NftConfirmModal';
import SongDeleteAndReleaseModal from '../../SongDeleteAndReleaseModal';
import Loading from '../../IntroLogo2';
import { useTranslation } from 'react-i18next';

const serverApi = process.env.REACT_APP_SERVER_API;

const myAlbumsCategoryList = [
  { name: 'Unreleased', preparing: false },
  { name: 'Released', preparing: false },
];

const MySongsList = ({ token }) => {
  const { t } = useTranslation('my_page');

  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteMusic, setDeleteMusic] = useState(null);
  const [releaseMusic, setReleaseMusic] = useState(null);
  const [mintMusic, setMintMusic] = useState(null);

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const songsSort = searchParams.get('songs_sort');
  const releaseType = searchParams.get('release_type') || 'Unreleased';
  const aiServiceFilter = searchParams.get('ai_service_filter');
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // 내 TOP 앨범 리스트 API 호출
  const { data: topSongsData, isLoading: topSongLoading } = useQuery(
    ['top_songs'],
    async () => {
      const { data } = await GetMyTopAlbumList(token);
      return data;
    },
    { refetchOnWindowFocus: false, enabled: !!token }
  );

  // 송 리스트 get API
  const {
    data: songsList,
    isLoading: songsListLoading,
    refetch: songListRefetch,
  } = useQuery(
    ['songs_list', { token, page, songsSort, search, releaseType, aiServiceFilter }],
    async () => {
      const { data } = await getReleaseAndUnReleaseSongData({
        token,
        page,
        sort_by: songsSort,
        search_keyword: search,
        type: releaseType,
        ai_service: aiServiceFilter,
      });
      return data;
    },
    { refetchOnWindowFocus: false, enabled: !!token && !!releaseType }
  );

  //=============
  // 삭제
  //=============
  const handleDelete = async id => {
    const res = await axios.delete(`${serverApi}/api/music/${deleteMusic?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  //=============
  // 릴리즈
  //=============
  const handleRelease = async () => {
    const res = await axios.post(`${serverApi}/api/music/${releaseMusic?.id}/release`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  //=============
  // 민트
  //=============
  const handleMint = async item => {
    setMintMusic(item);
  };

  return (
    <div className="songs">
      <TopSongsTemplate topSongsData={topSongsData} />
      <ContentWrap title={t('Song List')}>
        <SubCategories
          categories={myAlbumsCategoryList}
          translateFn={t}
          handler={value => {
            setSearchParams(prev => {
              const { page, search, songs_sort, ...rest } = Object.fromEntries(prev);
              return { ...rest, release_type: value, page: 1 };
            });
          }}
          value={releaseType}
        />
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={['Latest', 'Oldest']} aiServiceFilter={true} />
          <Search placeholder="Search by song title" handler={null} reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songsList?.data_list}
          deleteOption={true}
          releaseOption={releaseType === 'Unreleased'}
          gradeOption={releaseType === 'Released'}
          nftOption={releaseType === 'Released'}
          mintOption={releaseType === 'Released'}
          playsOption={releaseType === 'Released'}
          likesOption={releaseType === 'Released'}
          handleDelete={setDeleteMusic}
          handleRelease={setReleaseMusic}
          handleMint={handleMint}
          artistOption={false}
        />
        <Pagination totalCount={songsList?.total_cnt} handler={null} viewCount={15} page={page} />
      </ContentWrap>
      {(topSongLoading || songsListLoading) && <Loading />}
      {deleteMusic && (
        <SongDeleteAndReleaseModal
          setter={setDeleteMusic}
          songData={deleteMusic}
          deleteHandler={handleDelete}
          action={() => {
            songListRefetch();
          }}
        />
      )}
      {releaseMusic && (
        <SongDeleteAndReleaseModal
          setter={setReleaseMusic}
          songData={releaseMusic}
          releaseHandler={handleRelease}
          action={() => {
            queryClient.invalidateQueries([
              'songs_list',
              { token, page, songsSort, search, releaseType },
            ]);
            navigate('/my-page?category=Songs&release_type=Released&page=1');
          }}
        />
      )}
      {mintMusic && (
        <NftConfirmModal
          setShowModal={setMintMusic}
          songId={mintMusic.id}
          songData={mintMusic}
          confirmMintTxt={true}
          // onSuccess={() => {
          //   songListRefetch();
          // }}
        />
      )}
    </div>
  );
};

export default MySongsList;
