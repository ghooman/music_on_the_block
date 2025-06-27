import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SongPlayTable from '../../table/SongPlayTable';
import Loading from '../../../components/IntroLogo2';
import TopSongsTemplate from './TopSongsTemplate';
import SubCategories from '../../unit/SubCategories';
import { EvaluationListItemWrapper, EvaluationListItem } from '../../unit/EvaluationListItem';
import NoneContent from '../../unit/NoneContent';

import { getEvaluationList } from '../../../api/evaluation/getList';
import { disableEvaluation } from '../../../data/service';

import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './Songs.scss';

const serverApi = process.env.REACT_APP_SERVER_API;

const topAlbumsCategoryList = [
  {
    name: 'AI Lyrics & Songwriting',
    image: generatedLyricSongwritingIcon,
    preparing: false,
  },
  {
    name: 'AI Singing Evaluation',
    image: generatedSigingEvaluationIcon,
    preparing: disableEvaluation,
  },
  {
    name: 'AI Cover Creation',
    image: generatedCoverCreationIcon,
    preparing: true,
  },
];

const UserSongsList = ({ username }) => {
  const { t } = useTranslation('my_page');

  const [searchParams, setSearchParams] = useSearchParams();

  const selectAiServiceCategory =
    searchParams.get('ai_service_category') || 'AI Lyrics & Songwriting';

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');
  const aiServiceFilter = searchParams.get('ai_service_filter');
  const criticFilter = searchParams.get('critic_filter');

  const { data: songList, isLoading: songListLoading } = useQuery(
    ['song_list_by_username', { page, search, songsSort, username }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/all/list`, {
        params: {
          page: page,
          search_keyword: search,
          sort_by: songsSort,
          name: username,
          ai_service: aiServiceFilter,
        },
      });
      return res.data;
    }
  );

  const { data: evaluationData, isLoading: evaluationListLoading } = useQuery(
    ['evaluation_list', { page, songsSort, search, username, criticFilter }],
    async () => {
      const res = await getEvaluationList({
        page,
        sort_by: songsSort,
        search_keyword: search,
        name: username,
        critic: criticFilter,
      });
      return res.data;
    },
    {
      enabled: !!username && selectAiServiceCategory === 'AI Singing Evaluation',
    }
  );

  return (
    <div className="songs">
      <ContentWrap title={t('Songs')}>
        <SubCategories
          categories={topAlbumsCategoryList}
          value={selectAiServiceCategory}
          handler={value =>
            setSearchParams({
              username: username,
              category: 'Songs',
              ai_service_category: value,
              page: 1,
            })
          }
        />
        <TopSongsTemplate
          topSong={selectAiServiceCategory === 'AI Lyrics & Songwriting'}
          topScore={selectAiServiceCategory === 'AI Singing Evaluation'}
          username={username}
        />
      </ContentWrap>
      <ContentWrap title={t('Song List')}>
        {selectAiServiceCategory === 'AI Lyrics & Songwriting' && (
          <>
            <ContentWrap.SubWrap gap={8}>
              <Filter songsSort={['Latest', 'Oldest']} aiServiceFilter={true} />
              <Search reset={{ page: 1 }} placeholder="Search by song title" />
            </ContentWrap.SubWrap>
            <SongPlayTable
              songList={songList?.data_list}
              gradeOption={true}
              nftOption={true}
              artistOption={false}
            />
            <Pagination totalCount={songList?.total_cnt} viewCount={15} page={page} />
          </>
        )}
        {selectAiServiceCategory === 'AI Singing Evaluation' && (
          <>
            <ContentWrap.SubWrap gap={8}>
              <Filter
                criticFilter={true}
                songsSort={['Highest Score', 'Lowest Score', 'Latest', 'Oldest']}
              />
              <Search placeholder="Search by song title" handler={null} reset={{ page: 1 }} />
            </ContentWrap.SubWrap>
            <EvaluationListItemWrapper>
              {evaluationData?.data_list?.map(item => (
                <EvaluationListItem data={item} />
              ))}
              {evaluationData?.data_list?.length <= 0 && (
                <NoneContent height={300} message="There are no songs evaluated yet." />
              )}
            </EvaluationListItemWrapper>
            <Pagination totalCount={evaluationData?.total_cnt} viewCount={15} page={page} />
          </>
        )}
      </ContentWrap>
      <Loading isLoading={evaluationListLoading || songListLoading} />
    </div>
  );
};

export default UserSongsList;
