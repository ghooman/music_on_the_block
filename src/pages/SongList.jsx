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

// import { useSearchParams } from 'react-router-dom';
// import { useEffect, useState, useRef, useContext } from 'react';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';

// // import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

// import ContentWrap from '../components/unit/ContentWrap';
// import Filter from '../components/unit/Filter';
// import Search from '../components/unit/Search';
// import Pagination from '../components/unit/Pagination';
// import NoneContent from '../components/unit/NoneContent';
// import AlbumItem from '../components/unit/AlbumItem';
// import SubCategories from '../components/unit/SubCategories';
// import Loading from '../components/IntroLogo2';

// import generatedLyricSongwritingIcon from '../assets/images/icon/generated-lryric-songwriting.svg';
// import generatedSigingEvaluationIcon from '../assets/images/icon/generated-singing-evaluation.svg';
// import generatedCoverCreationIcon from '../assets/images/icon/generated-cover-creation.svg';

// import '../styles/SongList.scss';

// import { getEvaluationList } from '../api/evaluation/getList';
// import { disableEvaluation } from '../data/service';
// import { useAudio } from '../contexts/AudioContext';

// const serverApi = process.env.REACT_APP_SERVER_API;

// const categories = [
//   {
//     name: 'AI Lyrics & Songwriting',
//     image: generatedLyricSongwritingIcon,
//     preparing: false,
//   },
//   {
//     name: 'AI Singing Evaluation',
//     image: generatedSigingEvaluationIcon,
//     preparing: disableEvaluation,
//   },
//   {
//     name: 'AI Cover Creation',
//     image: generatedCoverCreationIcon,
//     preparing: true,
//   },
// ];

// const SongList = () => {
//   const { t } = useTranslation('song_list');

//   const [searchParams, setSearchParams] = useSearchParams();

//   const { token, walletAddress } = useContext(AuthContext);
//   // 랜덤 상태
//   const [randomList, setRandomList] = useState([]);

//   const service = searchParams.get('service') || categories[0]?.name;
//   const page = searchParams.get('page') || 1;
//   const search = searchParams.get('search');
//   const songsSortRaw = searchParams.get('songs_sort');
//   const songsSort = songsSortRaw?.trim(); // 공백 제거
//   const aiServiceFilter = searchParams.get('ai_service_filter');
//   const criticFilter = searchParams.get('critic_filter');

//   const from = searchParams.get('from'); // ex. RandomSection
//   const shouldShuffle = from === 'RandomSection';

//   const shuffleList = list => {
//     const copy = [...list];
//     for (let i = copy.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [copy[i], copy[j]] = [copy[j], copy[i]];
//     }
//     return copy;
//   };

//   const definedService =
//     service === 'AI Lyrics & Songwriting'
//       ? 'song'
//       : service === 'AI Singing Evaluation'
//       ? 'evaluation'
//       : '';

//   const [songList, setSongList] = useState([]);
//   const [totalCount, setTotalCount] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // 전역 오디오 상태 사용
//   const { currentTrack, currentTime, playTrack, isTrackActive, audioRef } = useAudio();

//   const getRandomTracks = async () => {
//     try {
//       const res = await axios.get(`${serverApi}/api/music/all/list/random`, {
//         params: {
//           // page,
//           // search_keyword: search,
//           // ai_service: aiServiceFilter,
//           wallet_address: walletAddress?.address,
//         },
//       });
//       console.log('🎲 랜덤 리스트 응답:', res.data); // 확인 필수
//       setRandomList(res.data.data_list); // ✅ 서버 응답 형식에 따라 변경
//       setTotalCount(res.data.total_cnt); // ✅ 페이지네이션용
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   // 곡 목록 API 호출
//   useEffect(() => {
//     if (!page) return;
//     setIsLoading(true);
//     //===========
//     // 노래 데이터 리스트
//     //===========
//     const getSongListData = async () => {
//       const res = await axios.get(`${serverApi}/api/music/all/list`, {
//         params: {
//           page,
//           search_keyword: search,
//           sort_by: songsSort,
//           ai_service: aiServiceFilter,
//         },
//       });
//       return res.data;
//     };
//     // const getSongListData = async () => {
//     //   // 랜덤일 때는 별도 API 호출
//     //   if (songsSort === 'Random') {
//     //     const res = await axios.get(`${serverApi}/api/music/all/list/random`, {
//     //       params: {
//     //         page,
//     //         search_keyword: search,
//     //         ai_service: aiServiceFilter,
//     //         wallet_address: walletAddress?.address,
//     //       },
//     //     });
//     //     return res.data;
//     //   }

//     //   // 기본: 최신순 / 인기순 등
//     //   const res = await axios.get(`${serverApi}/api/music/all/list`, {
//     //     params: {
//     //       page,
//     //       search_keyword: search,
//     //       sort_by: songsSort,
//     //       ai_service: aiServiceFilter,
//     //     },
//     //   });
//     //   return res.data;
//     // };

//     //===========
//     // 평가 데이터 리스트
//     //===========
//     const getEvaluationListData = async () => {
//       const res = await getEvaluationList({
//         page,
//         search_keyword: search,
//         critic: criticFilter,
//         sort_by: songsSort,
//       });
//       return res.data;
//     };

//     //===========
//     // API 통신 분기처리
//     //===========
//     const getData = async () => {
//       try {
//         setIsLoading(true);
//         let res;
//         if (service === 'AI Lyrics & Songwriting') {
//           res = await getSongListData();
//         } else if (service === 'AI Singing Evaluation') {
//           res = await getEvaluationListData();
//         }

//         let list = res.data_list;
//         if (shouldShuffle) {
//           console.log('🎲 랜덤 셔플 적용됨!');
//           list = shuffleList(list);
//         }

//         setSongList(list);
//         setTotalCount(res.total_cnt);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getData();
//   }, [page, search, songsSort, service, aiServiceFilter, criticFilter]);

//   // 랜덤곡 받아오기

//   useEffect(() => {
//     if (songsSort === 'Random') {
//       console.log('✅ 랜덤 트리거됨');
//       getRandomTracks();
//     }
//   }, [songsSort, walletAddress, page, search, aiServiceFilter]);

//   // 전역 오디오 상태를 사용하는 handlePlay 함수
//   const handlePlay = ({ list, track, id }) => {
//     playTrack({
//       track,
//       playlist: list,
//       playlistId: id,
//     });
//   };

//   // 선택된 곡이 없으면 2초 후 첫 번째 트랙을 자동 선택
//   useEffect(() => {
//     if (!songList) return;
//     const timer = setTimeout(() => {
//       if (songList.length > 0 && !currentTrack) {
//         handlePlay({ list: songList, id: 'songlist', track: songList[0] });
//       }
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, [songList, currentTrack]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [page, isLoading]);

//   return (
//     <>
//       <div className="songs-list">
//         <ContentWrap title={t('Song List')}>
//           <SubCategories
//             categories={categories}
//             value={service}
//             translateFn={t}
//             handler={service => {
//               setSearchParams(prev => {
//                 return { search: '', page: 1, service };
//               });
//             }}
//           />
//           <ContentWrap.SubWrap gap={8}>
//             <Filter
//               songsSort={
//                 definedService === 'song'
//                   ? true
//                   : definedService === 'evaluation'
//                   ? ['Highest Score', 'Lowest Score', 'Latest', 'Oldest']
//                   : null
//               }
//               aiServiceFilter={definedService === 'song'}
//               gradeFilter={definedService === 'song'}
//               mintedFilter={definedService === 'song'}
//               criticFilter={definedService === 'evaluation'}
//             />
//             <Search placeholder="Search by song title" reset={{ page: 1 }} />
//           </ContentWrap.SubWrap>
//           <>
//             {!isLoading &&
//             (songsSort === 'Random'
//               ? randomList && randomList.length > 0
//               : songList && songList.length > 0) ? (
//               <div className="songs-list__items">
//                 {(songsSort === 'Random' ? randomList : songList).map((track, index, list) => (
//                   <AlbumItem
//                     key={track.id}
//                     track={track}
//                     isActive={isTrackActive(track, 'songlist')}
//                     currentTime={currentTime}
//                     onClick={() => {
//                       handlePlay({
//                         list: songsSort === 'Random' ? randomList : songList,
//                         track: track,
//                         id: 'songlist',
//                       });
//                     }}
//                     type={definedService}
//                     audioRef={audioRef}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <NoneContent message="No data" height={400} />
//             )}
//           </>
//           <Pagination totalCount={totalCount} viewCount={15} page={page} />
//         </ContentWrap>
//       </div>
//       <Loading isLoading={isLoading} />
//     </>
//   );
// };

// export default SongList;

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getEvaluationList } from '../api/evaluation/getList';
import { disableEvaluation } from '../data/service';

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
  const { token, walletAddress } = useContext(AuthContext);
  const { currentTrack, currentTime, playTrack, isTrackActive, audioRef } = useAudio();

  const [searchParams, setSearchParams] = useSearchParams();
  const service = searchParams.get('service') || categories[0]?.name;
  const page = searchParams.get('page') || '1'; // 무조건 string
  const search = searchParams.get('search');
  const songsSort = searchParams.get('songs_sort')?.trim();
  const aiServiceFilter = searchParams.get('ai_service_filter');
  const criticFilter = searchParams.get('critic_filter');
  const from = searchParams.get('from'); // ← 랜덤 여부 감지

  // 🔽 추가
  useEffect(() => {
    if (from === 'RandomSection') {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete('from');
      setSearchParams(updatedParams);
    }
  }, []);

  const definedService =
    service === 'AI Lyrics & Songwriting'
      ? 'song'
      : service === 'AI Singing Evaluation'
      ? 'evaluation'
      : '';

  const [songList, setSongList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFromRandom = from === 'RandomSection';

  // ✅ 셔플 유틸
  const shuffleList = list => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // ✅ 셔플된 리스트를 useMemo로 메모이제이션
  const displayList = useMemo(() => {
    if (isFromRandom) {
      return shuffleList(songList);
    }
    return songList;
  }, [songList, isFromRandom]);

  // 데이터 호출
  useEffect(() => {
    const getSongListData = async () => {
      try {
        setIsLoading(true);
        let res;

        if (definedService === 'song') {
          const result = await axios.get(`${serverApi}/api/music/all/list`, {
            params: {
              page,
              search_keyword: search,
              sort_by: songsSort,
              ai_service: aiServiceFilter,
            },
          });
          res = result.data;
        } else if (definedService === 'evaluation') {
          const result = await getEvaluationList({
            page,
            search_keyword: search,
            critic: criticFilter,
            sort_by: songsSort,
          });
          res = result.data;
        }

        let list = res.data_list || [];
        if (isFromRandom) {
          console.log('🎲 랜덤 섹션에서 진입 → 리스트 섞음');
          list = shuffleList(list);
        }

        setSongList(list);
        setTotalCount(res.total_cnt);
      } catch (e) {
        console.error('❌ 데이터 호출 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (!walletAddress?.address) return; // 주소 없는 경우 막기

    getSongListData();
  }, [page, songsSort, service]); // 불필요한 deps 줄이기

  // 자동 재생 (없으면 무시)
  useEffect(() => {
    if (!displayList || displayList.length === 0 || currentTrack) return;

    // 🎲 랜덤 섹션에서는 자동 재생 하지 않음
    if (isFromRandom) return;

    const timer = setTimeout(() => {
      handlePlay({ list: displayList, id: 'songlist', track: displayList[0] });
    }, 2000);

    return () => clearTimeout(timer);
  }, [displayList, currentTrack]);

  const handlePlay = ({ list, track, id }) => {
    // ✅ 자동재생 허용 플래그 세팅
    sessionStorage.setItem('preventAutoPlay', 'true');
    playTrack({ track, playlist: list, playlistId: id });
  };

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
            handler={newService => {
              setSearchParams(prev => ({
                ...Object.fromEntries(prev),
                page: 1,
                service: newService,
              }));
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

          {!isLoading && songList?.length > 0 ? (
            <div className="songs-list__items">
              {songList.map((track, index, list) => (
                <AlbumItem
                  key={track.id}
                  track={track}
                  isActive={isTrackActive(track, 'songlist')}
                  currentTime={currentTime}
                  onClick={() =>
                    handlePlay({
                      list: songList,
                      track,
                      id: 'songlist',
                    })
                  }
                  type={definedService}
                  audioRef={audioRef}
                />
              ))}
            </div>
          ) : (
            <NoneContent message="No data" height={400} />
          )}

          <Pagination totalCount={totalCount} viewCount={16} page={page} />
        </ContentWrap>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
};

export default SongList;
