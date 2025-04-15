import { useState, useEffect } from 'react';

import './MyFavorites.scss';
// 이미지
import viewAllBackground from '../../assets/images/mypage/view-all-button.png';
// 컴포넌트
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import FilterItems from '../unit/FilterItems';
import Pagination from '../unit/Pagination';
import { useSearchParams } from 'react-router-dom';

const MyFavorites = () => {
    const [searchParams] = useSearchParams();

    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const types = searchParams.get('types');
    const songs = searchParams.get('songs');

    useEffect(() => {}, [search, page, types, songs]);

    return (
        <ContentWrap title="Favorites">
            <ContentWrap.SubWrap gap={8}>
                <Filter types songs />
                <Search />
            </ContentWrap.SubWrap>
            <AlbumsTable></AlbumsTable>
            <Pagination />
        </ContentWrap>
    );
};

export default MyFavorites;
