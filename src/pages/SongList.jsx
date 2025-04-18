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

import '../styles/SongList.scss';
import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import Pagination from '../components/unit/Pagination';
import NoneContent from '../components/unit/NoneContent';
import AlbumItem from '../components/unit/AlbumItem';
import PlayerHeader from '../components/PlayerHeader';

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import IntroLogo2 from '../components/IntroLogo2';

const serverApi = process.env.REACT_APP_SERVER_API;

const SongList = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const songsSort = searchParams.get('songs_sort');

    const [songList, setSongList] = useState([]);
    const [totalCount, setTotalCount] = useState(null);

    // 플레이어 관련 상태
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [selectedList, setSelectedList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    const audioRef = useRef(null);

    // 곡 목록 API 호출
    useEffect(() => {
        if (!page) return;
        const getSongList = async () => {
            try {
                const res = await axios.get(`${serverApi}/api/music/all/list`, {
                    params: {
                        page,
                        search_keyword: search,
                        sort_by: songsSort,
                    },
                });
                setSongList(res.data.data_list);
                setTotalCount(res.data.total_cnt);
            } catch (e) {
                console.error(e);
            }
        };
        getSongList();
    }, [page, search, songsSort]);

    // 스크롤 감지: 상단 고정 효과
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY >= 88);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 오디오 시간 업데이트 핸들러
    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };

    // AlbumItem 클릭 시 플레이어에 반영하는 함수 (list와 id 전달)
    const handlePlay = ({ list, track, id }) => {
        setSelectedList(list);
        setSelectedId(id);
        setSelectedMusic(track);
        setIsPlaying(true);
        setCurrentTime(0);
    };

    // 선택된 곡이 없으면 2초 후 첫 번째 트랙을 자동 선택
    useEffect(() => {
        if (!songList) return;
        const timer = setTimeout(() => {
            if (songList.length > 0 && !selectedMusic) {
                handlePlay({ list: songList, id: 'songlist', track: songList[0] });
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [songList, selectedMusic]);

    // 다음 곡 재생
    const handleNext = () => {
        if (!selectedList.length || !selectedMusic) return;
        const currentIndex = selectedList.findIndex((t) => t.id === selectedMusic.id);
        const nextIndex = (currentIndex + 1) % selectedList.length;
        setSelectedMusic(selectedList[nextIndex]);
    };

    // 이전 곡 재생
    const handlePrev = () => {
        if (!selectedList.length || !selectedMusic) return;
        const currentIndex = selectedList.findIndex((t) => t.id === selectedMusic.id);
        const prevIndex = (currentIndex - 1 + selectedList.length) % selectedList.length;
        setSelectedMusic(selectedList[prevIndex]);
    };

    // 좋아요 클릭 핸들러 (필요 시 API 연동)
    const handleLikeClick = (track) => {
        console.log('좋아요 클릭', track);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    return (
        <>
            <div className="songs-list">
                {/* PlayerHeader를 추가하여 상단에서 재생 UI 제공 */}
                <PlayerHeader
                    selectedMusic={selectedMusic}
                    isPlaying={isPlaying}
                    isScrolled={isScrolled}
                    handleTimeUpdate={handleTimeUpdate}
                    handleLikeClick={handleLikeClick}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    // 여기서는 빈 함수 또는 적절한 함수들을 전달하세요.
                    getTracks={() => {}}
                    handleGetMusicList={() => {}}
                    setIsPlaying={setIsPlaying}
                    audioRef={audioRef}
                />
                <ContentWrap title="Song List">
                    <ContentWrap.SubWrap gap={8}>
                        <Filter songsSort={true} generateType={true} />
                        <Search placeholder="Search by song title" reset={{ page: 1 }} />
                    </ContentWrap.SubWrap>
                    {songList.length > 0 ? (
                        <div className="songs-list__items">
                            {songList.map((track, index, list) => (
                                <AlbumItem
                                    key={track.id}
                                    track={track}
                                    // isActive 비교: 선택된 아이템인지 확인 (예시에서는 'songlist' id 사용)
                                    isActive={`${selectedId}+${selectedMusic?.id}` === `songlist+${track.id}`}
                                    currentTime={currentTime}
                                    onClick={() => {
                                        handlePlay({
                                            list: songList,
                                            track: track,
                                            id: 'songlist',
                                        });
                                    }}
                                    audioRef={audioRef}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoneContent message={'No data'} height={400} />
                    )}
                    <Pagination totalCount={totalCount} viewCount={15} page={page} />
                </ContentWrap>
            </div>
            <IntroLogo2 />
        </>
    );
};

export default SongList;
