import { useState, useEffect } from 'react';

import './MyFavorites.scss';
// 이미지
import viewAllBackground from '../../assets/images/mypage/view-all-button.png';
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// 컴포넌트
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import FilterItems from '../unit/FilterItems';
import Pagination from '../unit/Pagination';
import { useSearchParams } from 'react-router-dom';
import SubCategories from '../unit/SubCategories';

const subCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
    { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
];

const MyFavorites = () => {
    const [searchParams] = useSearchParams();
    const [selected, setSelected] = useState(subCategoryList[0].name);

    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const generateType = searchParams.get('generate_type');
    const songsSort = searchParams.get('songs_sort');

    useEffect(() => {}, [search, page, generateType, songsSort]);

    return (
        <ContentWrap title="Favorites">
            <SubCategories categories={subCategoryList} value={selected} />
            <ContentWrap.SubWrap gap={8}>
                <Filter generateType songsSort />
                <Search />
            </ContentWrap.SubWrap>
            <AlbumsTable></AlbumsTable>
            <Pagination />
        </ContentWrap>
    );
};

export default MyFavorites;
