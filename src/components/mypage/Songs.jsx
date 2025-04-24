// 📦 외부 라이브러리
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

// 🖼️ 이미지/에셋
import generatedLyricSongwritingIcon from '../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../assets/images/icon/generated-cover-creation.svg';

// 🧩 유닛 컴포넌트
import Filter from '../unit/Filter';
import SongPlayTable from '../unit/SongPlayTable';
import AlbumItem from '../unit/AlbumItem';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';
import Loading from '../../components/IntroLogo2';
import SongDeleteModal from '../../components/SongDeleteModal';
import SongReleaseModal from '../../components/SongReleaseModal';

// 🔌 API 모듈
import { GetMyTopAlbumList } from '../../api/GetMyTopAlbumList';
import { getReleaseAndUnReleaseSongData } from '../../api/getReleaseAndUnReleaseSongData';

// 🎨 스타일
import './Songs.scss';
import axios from 'axios';

// 환경변수
const serverApi = process.env.REACT_APP_SERVER_API;

const myAlbumsCategoryList = [
  { name: 'Unreleased songs', preparing: false },
  { name: 'Released songs', preparing: false },
];

const Songs = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteMusic, setDeleteMusic] = useState(null);
  const [releaseMusic, setReleaseMusic] = useState(null);

  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const songsSort = searchParams.get('songs_sort');
  const releaseType = searchParams.get('release_type') || 'Unreleased songs';

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
    songListRefetch();
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
    songListRefetch();
  };

  return (
    <div className="songs">
      <TopSongsTemplates topSongsData={topSongsData} />
      <ContentWrap title="Songs">
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
          releaseOption={releaseType === 'Unreleased songs'}
          handleDelete={setDeleteMusic}
          handleRelease={setReleaseMusic}
          gradeOption={releaseType === 'Released songs'}
          NftOption={true}
        />
        <Pagination totalCount={songsList?.total_cnt} handler={null} viewCount={15} page={page} />
      </ContentWrap>
      {(topSongLoading || songsListLoading) && <Loading />}
      {deleteMusic && (
        <SongDeleteModal
          setSongDeleteModal={setDeleteMusic}
          songData={deleteMusic}
          handler={handleDelete}
        />
      )}
      {releaseMusic && (
        <SongReleaseModal
          setSongReleaseModal={setReleaseMusic}
          songData={releaseMusic}
          handler={handleRelease}
        />
      )}
    </div>
  );
};

export default Songs;

export const TopSongsTemplates = ({ topSongsData }) => {
  const topAlbumsCategoryList = [
    {
      name: 'AI Lyrics & Songwriting',
      image: generatedLyricSongwritingIcon,
      preparing: false,
    },
    { name: 'AI Singing Evaluation', image: generatedSigingEvaluationIcon, preparing: true },
    { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
  ];

  const [topAlbumsCategory, setTopAlbumsCategory] = useState(topAlbumsCategoryList?.[0].name);

  return (
    <ContentWrap title="Top Songs">
      <SubCategories
        categories={topAlbumsCategoryList}
        handler={setTopAlbumsCategory}
        value={topAlbumsCategory}
      />
      <div className="songs__body">
        <div className="songs__item">
          <p className="songs__item-title">Top Plays</p>
          <AlbumItem track={topSongsData?.top_plays} />
        </div>
        <div className="songs__item">
          <p className="songs__item-title">Top Likes</p>
          <AlbumItem track={topSongsData?.top_like} />
        </div>
        <div className="songs__item">
          <p className="songs__item-title">Top Comments</p>
          <AlbumItem track={topSongsData?.top_comments} />
        </div>
      </div>
    </ContentWrap>
  );
};
