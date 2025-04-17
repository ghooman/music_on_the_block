// 라이브러리
import { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

// CSS
import './MyFavorites.scss';

// 이미지
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// 컴포넌트
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import Pagination from '../unit/Pagination';
import SubCategories from '../unit/SubCategories';
import Loading from '../../components/IntroLogo2';

// API 모듈
import { getLikeList } from '../../api/getLikeAndUnLikeList';

// Context
import { AuthContext } from '../../contexts/AuthContext';
import SongPlayTable from '../unit/SongPlayTable';

const subCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
    { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
];

const MyFavorites = () => {
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
            <ContentWrap title="Favorites">
                <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
                <ContentWrap.SubWrap gap={8}>
                    <Filter songsSort />
                    <Search />
                </ContentWrap.SubWrap>
                {/* <AlbumsTable songList={favoritesSongsList?.data_list}></AlbumsTable> */}
                <SongPlayTable songList={favoritesSongsList?.data_list} />
                <Pagination totalCount={favoritesSongsList?.total_cnt} viewCount={10} page={page} />
            </ContentWrap>
            {isLoading && <Loading />}
        </>
    );
};

export default MyFavorites;
