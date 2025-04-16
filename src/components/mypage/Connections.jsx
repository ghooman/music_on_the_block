import { useContext, useEffect, useState } from 'react';

import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';

import './Connections.scss';
import AlbumsTable from '../unit/AlbumsTable';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useQuery } from 'react-query';

const categories = [
    { name: 'Following', preparing: false },
    { name: 'Followers', preparing: false },
];

const serverApi = process.env.REACT_APP_SERVER_API;

const Connections = () => {
    const [searchParamas, setSearchParams] = useSearchParams();

    const { token } = useContext(AuthContext);

    const page = searchParamas.get('page') || 1;
    const search = searchParamas.get('search') || '';
    const connectionsSort = searchParamas.get('connections_sort') || 'Latest';
    const connectionsType = searchParamas.get('connections_type') || 'Following';

    const { data: connectionsData } = useQuery(
        ['follow_list', { token, page, search, connectionsSort, connectionsType }],
        async () => {
            const path = connectionsType === 'Following' ? 'following' : 'follower';
            const res = await axios.get(`${serverApi}/api/music/my/${path}/list`, {
                params: {
                    page,
                    search_keyword: search,
                    sort_by: connectionsSort,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        },
        { refetchOnWindowFocus: false, enabled: !!token }
    );

    return (
        <div className="connections">
            <ContentWrap title="Connections">
                <SubCategories
                    categories={categories}
                    handler={(value) =>
                        setSearchParams((prev) => {
                            const { connections_sort, search, ...rest } = Object.fromEntries(prev);
                            return { ...rest, connections_type: value, page: 1 };
                        })
                    }
                    value={connectionsType}
                />
                <ContentWrap.SubWrap gap={8}>
                    <Filter connectionsSort />
                    <Search />
                </ContentWrap.SubWrap>
                <AlbumsTable />
                <Pagination totalCount={connectionsData?.total_cnt} viewCount={10} page={page} />
            </ContentWrap>
        </div>
    );
};

export default Connections;
