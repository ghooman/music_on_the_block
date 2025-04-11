import '../styles/SongList.scss';

import ContentWrap from '../components/unit/ContentWrap';
import Filter from '../components/unit/Filter';
import Search from '../components/unit/Search';
import Pagination from '../components/unit/Pagination';
import NoneContent from '../components/unit/NoneContent';
import AlbumItem from '../components/unit/AlbumItem';

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

const SongList = () => {
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const [songList, setSongList] = useState([]);
    const [totalCount, setTotalCount] = useState(null);

    useEffect(() => {
        if (!page) return;
        const getSongList = async () => {
            try {
                const res = await axios.get(`${serverApi}/api/music/all/list`, {
                    params: {
                        page,
                        search,
                    },
                });
                setSongList(res.data.data_list);
                setTotalCount(res.data.total_cnt);
            } catch (e) {
                console.error(e);
            }
        };
        getSongList();
    }, [page, search]);

    return (
        <div className="songs-list">
            <ContentWrap title="Song List">
                <ContentWrap.SubWrap gap={8}>
                    <Filter songs />
                    <Search reset={{ page: 1 }} />
                </ContentWrap.SubWrap>
                {songList.length > 0 ? (
                    <div className="songs-list__items">
                        {songList?.map((track) => (
                            <AlbumItem track={track} />
                        ))}
                    </div>
                ) : (
                    <NoneContent message={'No data'} height={400} />
                )}
                <Pagination totalCount={totalCount} viewCount={9} page={page} />
            </ContentWrap>
        </div>
    );
};

export default SongList;
