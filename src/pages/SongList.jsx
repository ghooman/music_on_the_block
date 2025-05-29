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
import { useGlobalMusic } from '../contexts/GlobalMusicContext';
import axios from 'axios';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import Pagination from '../components/unit/Pagination';
import NoneContent from '../components/unit/NoneContent';
import AlbumItem from '../components/unit/AlbumItem';
import PlayerHeader from '../components/PlayerHeader';
import SubCategories from '../components/unit/SubCategories';
import Loading from '../components/IntroLogo2';

import generatedLyricSongwritingIcon from '../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../assets/images/icon/generated-cover-creation.svg';

import '../styles/SongList.scss';

import { getEvaluationList } from '../api/evaluation/getList';

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
    preparing: false,
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

  // 전역 음악 컨텍스트 사용
  const {
    selectedMusic,
    selectedId,
    isPlaying,
    currentTime,
    audioRef,
    playMusic,
    handleTimeUpdate,
    setIsPlaying,
  } = useGlobalMusic();

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
  const [isScrolled, setIsScrolled] = useState(false);

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
        sort_by: '',
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 88);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="songs-list">
        <PlayerHeader
          selectedMusic={selectedMusic}
          isPlaying={isPlaying}
          isScrolled={isScrolled}
          handleTimeUpdate={handleTimeUpdate}
          handleLikeClick={() => {}}
          handlePrev={() => {}}
          handleNext={() => {}}
          getTracks={() => {}}
          handleGetMusicList={() => {}}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
        />
        <ContentWrap title={t('Song List')}>
          <ContentWrap.SubWrap gap={8}>
            <SubCategories
              categories={categories}
              handler={({ name }) => {
                setSearchParams(prev => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set('service', name);
                  newParams.set('page', '1');
                  return newParams;
                });
              }}
              value={service}
              translateFn={t}
            />
            <Filter songs />
            <Search reset={{ page: 1 }} />
          </ContentWrap.SubWrap>
          <>
            {!isLoading && songList?.length > 0 ? (
              <div className="songs-list__items">
                {songList.map((track, index, list) => (
                  <AlbumItem
                    key={track.id}
                    track={track}
                    // isActive 비교: 선택된 아이템인지 확인 (예시에서는 'songlist' id 사용)
                    isActive={`${selectedId}+${selectedMusic?.id}` === `songlist+${track.id}`}
                    currentTime={currentTime}
                    onClick={() => {
                      playMusic({
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
      {isLoading && <Loading />}
    </>
  );
};

export default SongList;
