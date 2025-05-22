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

const subCategoryList = [
  { name: 'AI Lyrics & Songwriting', image: generatedLyricSongwritingIcon, preparing: false },
  { name: 'AI Singing Evaluation', image: generatedSigingEvaluationIcon, preparing: true },
  { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
];

const MyFavorites = () => {
  const { t } = useTranslation('my_page');

  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(subCategoryList[0].name);
  const { token } = useContext(AuthContext);

  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;
  const generateType = searchParams.get('generate_type');
  const songsSort = searchParams.get('songs_sort') || 'Latest';

  const { data: favoritesSongsList, isLoading } = useQuery(
    ['favoritest_songs', { token, search, page, generateType, songsSort }],
    async () => {
      let res = await getLikeList({ token, page, search_keyword: search, sort_by: songsSort });
      return res.data;
    },
    { refetchOnWindowFocus: false, enabled: !!token }
  );

  return (
    <>
      <ContentWrap title={t('Favorites')}>
        <SubCategories
          categories={subCategoryList}
          handler={() => null}
          value={selected}
          translateFn={t}
        />
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} generateFilter={true} gradeFilter={true} />
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
