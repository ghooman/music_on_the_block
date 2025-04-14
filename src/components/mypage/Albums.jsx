// 📦 외부 라이브러리
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

// 🖼️ 이미지/에셋
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// 🧩 유닛 컴포넌트
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import AlbumItem from '../unit/AlbumItem';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';

// 🔌 API 모듈
import { GetMyTopAlbumList } from '../../api/GetMyTopAlbumList';
import { getMyMusicList } from '../../api/getMyMusicList';

// 🎨 스타일
import './Albums.scss';

const topAlbumsCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
    { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
];
const myAlbumsCategoryList = [
    { name: 'Unreleased songs', preparing: false },
    { name: 'Released songs', preparing: false },
];

const Albums = ({ token }) => {
    const [searchParams, _] = useSearchParams();

    const [topAlbumsCategory, setTopAlbumsCategory] = useState(topAlbumsCategoryList[0].name);
    const [myAlbumsCategory, setMyAlbumsCategory] = useState(myAlbumsCategoryList[0].name);

    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';

    // 내 TOP 앨범 리스트 API 호출

    const { data: topSongsData } = useQuery(
        ['top_songs'],
        async () => {
            const { data } = await GetMyTopAlbumList(token);
            return data;
        },
        { refetchOnWindowFocus: false, enabled: !!token }
    );

    const { data: songsList } = useQuery(
        ['songs_list', { page, search }],
        async () => {
            const { data } = await getMyMusicList({ token, page, search });
            return data;
        },
        { refetchOnWindowFocus: false, enabled: !!token }
    );

    return (
        <div className="albums">
            <ContentWrap title="Top Songs">
                <SubCategories
                    categories={topAlbumsCategoryList}
                    handler={setTopAlbumsCategory}
                    value={topAlbumsCategory}
                />
                <div className="albums__body">
                    <div className="albums__item">
                        <p className="albums__item-title">Top Like</p>
                        <AlbumItem track={topSongsData?.top_like} />
                    </div>
                    <div className="albums__item">
                        <p className="albums__item-title">Top Plays</p>
                        <AlbumItem track={topSongsData?.top_plays} />
                    </div>
                    <div className="albums__item">
                        <p className="albums__item-title">Top Comments</p>
                        <AlbumItem track={topSongsData?.top_comments} />
                    </div>
                </div>
            </ContentWrap>
            <ContentWrap title="Songs">
                <SubCategories
                    categories={myAlbumsCategoryList}
                    handler={setMyAlbumsCategory}
                    value={myAlbumsCategory}
                />
                <ContentWrap.SubWrap gap={8}>
                    <Filter list={['All', 'Latest']} />
                    <Search placeholder="Search by song title..." handler={null} reset={{ page: 1 }} />
                </ContentWrap.SubWrap>
                <AlbumsTable songList={songsList?.data_list}></AlbumsTable>
                <Pagination totalCount={songsList?.total_cnt} handler={null} viewCount={10} page={page} />
            </ContentWrap>
        </div>
    );
};

export default Albums;
