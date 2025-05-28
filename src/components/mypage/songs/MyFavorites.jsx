// 라이브러리
import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

// 이미지
import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

// 컴포넌트
import Filter from '../../unit/Filter';
import ContentWrap from '../../unit/ContentWrap';
import Search from '../../unit/Search';
import Pagination from '../../unit/Pagination';
import SubCategories from '../../unit/SubCategories';
import Loading from '../../../components/IntroLogo2';
import SongPlayTable from '../../table/SongPlayTable';

// API 모듈
import { getLikeList } from '../../../api/getLikeAndUnLikeList';

// Context
import { AuthContext } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const MyFavorites = () => {
  const { t } = useTranslation('my_page');

  const [searchParams] = useSearchParams();
  const { token } = useContext(AuthContext);

  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;

  const aiServiceFilter = searchParams.get('ai_service_filter');
  const gradeFilter = searchParams.get('grade_filter');
  const mintedFiter = searchParams.get('minted_filter');

  const songsSort = searchParams.get('songs_sort') || 'Latest';

  const { data: favoritesSongsList, isLoading } = useQuery(
    [
      'favoritest_songs',
      { token, search, page, songsSort, aiServiceFilter, gradeFilter, mintedFiter },
    ],
    async () => {
      let res = await getLikeList({
        token,
        page,
        search_keyword: search,
        sort_by: songsSort,
        ai_service: aiServiceFilter,
        rating: gradeFilter,
        is_minted: mintedFiter,
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, enabled: !!token }
  );

  return (
    <>
      <ContentWrap title={t('Favorites')}>
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} aiServiceFilter={true} gradeFilter={true} mintedFilter={true} />
          <Search placeholder="Search by song title" />
        </ContentWrap.SubWrap>
        {/* <AlbumsTable songList={favoritesSongsList?.data_list}></AlbumsTable> */}
        <SongPlayTable
          songList={favoritesSongsList?.data_list}
          nftOption={true}
          playsOption={true}
          likesOption={true}
          gradeOption={true}
        />
        <Pagination totalCount={favoritesSongsList?.total_cnt} viewCount={15} page={page} />
      </ContentWrap>
      {isLoading && <Loading />}
    </>
  );
};

export default MyFavorites;
