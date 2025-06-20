// import '../styles/SongList.scss';

// import ContentWrap from '../components/unit/ContentWrap';
// import Filter from '../components/unit/Filter';
// import Search from '../components/unit/Search';
// import Pagination from '../components/unit/Pagination';
// import NoneContent from '../components/unit/NoneContent';
// import AlbumItem from '../components/unit/AlbumItem';

// import { useSearchParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const serverApi = process.env.REACT_APP_SERVER_API;

// const SongList = () => {
//     const [searchParams] = useSearchParams();

//     const page = searchParams.get('page');
//     const search = searchParams.get('search');
//     const songs = searchParams.get('songs');

//     const [songList, setSongList] = useState([]);
//     const [totalCount, setTotalCount] = useState(null);

//     useEffect(() => {
//         if (!page) return;
//         const getSongList = async () => {
//             try {
//                 const res = await axios.get(`${serverApi}/api/music/all/list`, {
//                     params: {
//                         page,
//                         search_keyword: search,
//                         sort_by: songs,
//                     },
//                 });
//                 setSongList(res.data.data_list);
//                 setTotalCount(res.data.total_cnt);
//             } catch (e) {
//                 console.error(e);
//             }
//         };
//         getSongList();
//     }, [page, search, songs]);

//     return (
//         <>
//             <div className="songs-list">
//                 <ContentWrap title="Song List">
//                     <ContentWrap.SubWrap gap={8}>
//                         <Filter songs />
//                         <Search reset={{ page: 1 }} />
//                     </ContentWrap.SubWrap>
//                     {songList.length > 0 ? (
//                         <div className="songs-list__items">
//                             {songList?.map((track) => (
//                                 <AlbumItem track={track} />
//                             ))}
//                         </div>
//                     ) : (
//                         <NoneContent message={'No data'} height={400} />
//                     )}
//                     <Pagination totalCount={totalCount} viewCount={15} page={page} />
//                 </ContentWrap>
//             </div>
//         </>

//     );
// };

// export default SongList;
//===================================기존 원본=========================

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import Pagination from '../components/unit/Pagination';
import NoneContent from '../components/unit/NoneContent';
import AlbumItem from '../components/unit/AlbumItem';
import SubCategories from '../components/unit/SubCategories';
import Loading from '../components/IntroLogo2';

import generatedLyricSongwritingIcon from '../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../assets/images/icon/generated-cover-creation.svg';

import '../styles/SongList.scss';

import { getEvaluationList } from '../api/evaluation/getList';
import { disableEvaluation } from '../data/service';
import { useAudio } from '../contexts/AudioContext';

const serverApi = process.env.REACT_APP_SERVER_API;

const categories = [
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

const SongList = () => {
  const { t } = useTranslation('song_list');

  const [searchParams, setSearchParams] = useSearchParams();

  const service = searchParams.get('service') || categories[0]?.name;
  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort');
  const aiServiceFilter = searchParams.get('ai_service_filter');
  const criticFilter = searchParams.get('critic_filter');

  const definedService =
    service === 'AI Lyrics & Songwriting'
      ? 'song'
      : service === 'AI Singing Evaluation'
      ? 'evaluation'
      : '';

  const [songList, setSongList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 전역 오디오 상태 사용
  const { currentTrack, currentTime, playTrack, isTrackActive, audioRef } = useAudio();

  // 곡 목록 API 호출
  useEffect(() => {
    if (!page) return;
    setIsLoading(true);
    //===========
    // 노래 데이터 리스트
    //===========
    const getSongListData = async () => {
      const res = await axios.get(`${serverApi}/api/music/all/list`, {
        params: {
          page,
          search_keyword: search,
          sort_by: songsSort,
          ai_service: aiServiceFilter,
        },
      });
      return res.data;
    };

    //===========
    // 평가 데이터 리스트
    //===========
    const getEvaluationListData = async () => {
      const res = await getEvaluationList({
        page,
        search_keyword: search,
        critic: criticFilter,
        sort_by: songsSort,
      });
      return res.data;
    };

    //===========
    // API 통신 분기처리
    //===========
    const getData = async () => {
      try {
        setIsLoading(true);
        let res;
        if (service === 'AI Lyrics & Songwriting') {
          res = await getSongListData();
        } else if (service === 'AI Singing Evaluation') {
          res = await getEvaluationListData();
        }

        setSongList(res.data_list);
        setTotalCount(res.total_cnt);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [page, search, songsSort, service, aiServiceFilter, criticFilter]);

  // 전역 오디오 상태를 사용하는 handlePlay 함수
  const handlePlay = ({ list, track, id }) => {
    playTrack({
      track,
      playlist: list,
      playlistId: id,
    });
  };

  // 선택된 곡이 없으면 2초 후 첫 번째 트랙을 자동 선택
  useEffect(() => {
    if (!songList) return;
    const timer = setTimeout(() => {
      if (songList.length > 0 && !currentTrack) {
        handlePlay({ list: songList, id: 'songlist', track: songList[0] });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [songList, currentTrack]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, isLoading]);

  return (
    <>
      <div className="songs-list">
        <ContentWrap title={t('Song List')}>
          <SubCategories
            categories={categories}
            value={service}
            translateFn={t}
            handler={service => {
              setSearchParams(prev => {
                return { search: '', page: 1, service };
              });
            }}
          />
          <ContentWrap.SubWrap gap={8}>
            <Filter
              songsSort={
                definedService === 'song'
                  ? true
                  : definedService === 'evaluation'
                  ? ['Highest Score', 'Lowest Score', 'Latest', 'Oldest']
                  : null
              }
              aiServiceFilter={definedService === 'song'}
              gradeFilter={definedService === 'song'}
              mintedFilter={definedService === 'song'}
              criticFilter={definedService === 'evaluation'}
            />
            <Search placeholder="Search by song title" reset={{ page: 1 }} />
          </ContentWrap.SubWrap>
          <>
            {!isLoading && songList?.length > 0 ? (
              <div className="songs-list__items">
                {songList.map((track, index, list) => (
                  <AlbumItem
                    key={track.id}
                    track={track}
                    // 전역 상태의 isTrackActive 함수 사용
                    isActive={isTrackActive(track, 'songlist')}
                    currentTime={currentTime}
                    onClick={() => {
                      handlePlay({
                        list: songList,
                        track: track,
                        id: 'songlist',
                      });
                    }}
                    type={definedService}
                    audioRef={audioRef}
                  />
                ))}
              </div>
            ) : (
              <NoneContent message="No data" height={400} />
            )}
          </>
          <Pagination totalCount={totalCount} viewCount={15} page={page} />
        </ContentWrap>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
};

export default SongList;
