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

const categories = [
    { name: 'Following', preparing: false },
    { name: 'Followers', preparing: false },
];

const serverApi = process.env.REACT_APP_SERVER_API;

const Connections = () => {
    const [searchParamas, setSearchParams] = useSearchParams();
    const [connectionsData, setConnectionsData] = useState(null);

    const { token } = useContext(AuthContext);

    const page = searchParamas.get('page');
    const search = searchParamas.get('search');
    const connectionsSort = searchParamas.get('connections_sort');
    const connectionsType = searchParamas.get('connections_type');

    useEffect(() => {
        if (!connectionsType) {
            // 커넥션 타입이 정의 되지 않았을 경우 쿼리 파라미터 설정
            setSearchParams(
                (prev) => {
                    return { ...Object.fromEntries(prev), connections_type: 'Following' };
                },
                { replace: true }
            );
            return;
        }

        // 커넥션 타입이 정의 된 경우 API 요청
        const path = connectionsType === 'Following' ? 'following' : 'follower';
        const getConnectionsData = async () => {
            try {
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
                setConnectionsData(res.data);
                console.log(res.data, '커넥션 데이터');
            } catch (e) {
                console.error(e);
            }
        };

        getConnectionsData();
    }, [page, search, connectionsSort, connectionsType]);

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
