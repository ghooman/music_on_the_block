import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { GetMyTopAlbumList } from '../../../api/GetMyTopAlbumList';
import { getReleaseAndUnReleaseSongData } from '../../../api/getReleaseAndUnReleaseSongData';

import TopSongsTemplates from './TopSongsTeplates';
import ContentWrap from '../../unit/ContentWrap';
import SubCategories from '../../unit/SubCategories';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import Pagination from '../../unit/Pagination';
import SongPlayTable from '../../table/SongPlayTable';
import NftConfirmModal from '../../NftConfirmModal';
import SongDeleteAndReleaseModal from '../../SongDeleteAndReleaseModal';
import Loading from '../../IntroLogo2';

const serverApi = process.env.REACT_APP_SERVER_API;

const myAlbumsCategoryList = [
  { name: 'Unreleased', preparing: false },
  { name: 'Released', preparing: false },
];

const MySongsList = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteMusic, setDeleteMusic] = useState(null);
  const [releaseMusic, setReleaseMusic] = useState(null);
  const [mintMusic, setMintMusic] = useState(null);

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const songsSort = searchParams.get('songs_sort');
  const releaseType = searchParams.get('release_type') || 'Unreleased';
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
    ['songs_list', { token, page, songsSort, search, releaseType }],
    async () => {
      const { data } = await getReleaseAndUnReleaseSongData({
        token,
        page,
        sort_by: songsSort,
        search_keyword: search,
        type: releaseType,
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
      <TopSongsTemplates topSongsData={topSongsData} />
      <ContentWrap title="Song List">
        <SubCategories
          categories={myAlbumsCategoryList}
          handler={value => {
            setSearchParams(prev => {
              const { page, search, songs_sort, ...rest } = Object.fromEntries(prev);
              return { ...rest, release_type: value, page: 1 };
            });
          }}
          value={releaseType}
        />
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} />
          <Search placeholder="Search by song title..." handler={null} reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <SongPlayTable
          songList={songsList?.data_list}
          deleteOption={true}
          releaseOption={releaseType === 'Unreleased'}
          gradeOption={releaseType === 'Released'}
          nftOption={releaseType === 'Released'}
          mintOption={releaseType === 'Released'}
          handleDelete={setDeleteMusic}
          handleRelease={setReleaseMusic}
          handleMint={handleMint}
          playsOption={true}
          likesOption={true}
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
            navigate('/my-page?category=Songs&release_type=Released+songs&page=1');
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
