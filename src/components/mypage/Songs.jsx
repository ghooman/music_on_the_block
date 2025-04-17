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
import SongPlayTable from '../unit/SongPlayTable';
import AlbumItem from '../unit/AlbumItem';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';
import Loading from '../../components/IntroLogo2';

// 🔌 API 모듈
import { GetMyTopAlbumList } from '../../api/GetMyTopAlbumList';
import { getReleaseAndUnReleaseSongData } from '../../api/getReleaseAndUnReleaseSongData';

// 🎨 스타일
import './Songs.scss';
import axios from 'axios';

// 환경변수
const serverApi = process.env.REACT_APP_SERVER_API;

const topAlbumsCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
    { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
];

const myAlbumsCategoryList = [
    { name: 'Unreleased songs', preparing: false },
    { name: 'Released songs', preparing: false },
];

const Songs = ({ token }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [topAlbumsCategory, setTopAlbumsCategory] = useState(topAlbumsCategoryList[0].name);

    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';
    const songsSort = searchParams.get('songs_sort');
    const releaseType = searchParams.get('release_type') || 'Unreleased songs';

    // 내 TOP 앨범 리스트 API 호출
    const { data: topSongsData, isLoading: topSongLoading } = useQuery(
        ['top_songs'],
        async () => {
            const { data } = await GetMyTopAlbumList(token);
            return data;
        },
        { refetchOnWindowFocus: false, enabled: !!token }
    );

    // 송 리스트 get API
    const { data: songsList, isLoading: songsListLoading } = useQuery(
        ['songs_list', { token, page, songsSort, search, releaseType }],
        async () => {
            const { data } = await getReleaseAndUnReleaseSongData({
                token,
                page,
                sort_by: songsSort,
                search_keyword: search,
                type: releaseType,
            });
            return data;
        },
        { refetchOnWindowFocus: false, enabled: !!token && !!releaseType }
    );

    //=============
    // 삭제
    //=============
    const handleDelete = async (id) => {
        try {
            const res = await axios.post(`${serverApi}/api/music/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    //=============
    // 릴리즈
    //=============
    const handleRelease = async (id) => {
        try {
            const res = await axios.post(`${serverApi}/api/music/${id}/release`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="songs">
            <ContentWrap title="Top Songs">
                <SubCategories
                    categories={topAlbumsCategoryList}
                    handler={setTopAlbumsCategory}
                    value={topAlbumsCategory}
                />
                <div className="songs__body">
                    <div className="songs__item">
                        <p className="songs__item-title">Top Like</p>
                        <AlbumItem track={topSongsData?.top_like} />
                    </div>
                    <div className="songs__item">
                        <p className="songs__item-title">Top Plays</p>
                        <AlbumItem track={topSongsData?.top_plays} />
                    </div>
                    <div className="songs__item">
                        <p className="songs__item-title">Top Comments</p>
                        <AlbumItem track={topSongsData?.top_comments} />
                    </div>
                </div>
            </ContentWrap>
            <ContentWrap title="Songs">
                <SubCategories
                    categories={myAlbumsCategoryList}
                    handler={(value) => {
                        setSearchParams((prev) => {
                            const { page, search, songs_sort, ...rest } = Object.fromEntries(prev);
                            return { ...rest, release_type: value, page: 1 };
                        });
                    }}
                    value={releaseType}
                />
                <ContentWrap.SubWrap gap={8}>
                    <Filter songsSort />
                    <Search placeholder="Search by song title..." handler={null} reset={{ page: 1 }} />
                </ContentWrap.SubWrap>
                <SongPlayTable
                    songList={songsList?.data_list}
                    deleteOption={true}
                    releaseOption={releaseType === 'Unrelease songs'}
                    handleDelete={handleDelete}
                    handleRelease={handleRelease}
                />
                <Pagination totalCount={songsList?.total_cnt} handler={null} viewCount={10} page={page} />
            </ContentWrap>
            {(topSongLoading || songsListLoading) && <Loading />}
        </div>
    );
};

export default Songs;
