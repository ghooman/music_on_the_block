// 📦 외부 라이브러리
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

// 🖼️ 이미지/에셋
import heartIcon from '../../assets/images/icon/heart.svg';
import moreIcon from '../../assets/images/icon/more.svg';
import playIcon from '../../assets/images/icon/play.svg';
import commentIcon from '../../assets/images/icon/comment.svg';
import demoAlbum from '../../assets/images/mypage/demo-album.png';
import demoUser from '../../assets/images/mypage/demo-user.png';
import viewAllBackground from '../../assets/images/mypage/view-all-button.png';

// 🧩 유닛 컴포넌트
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import FilterAiServiceModal from '../unit/FilterAiServiceModal';
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

const AiServiceList = ['All', 'AI Singing Evaluation', 'AI Lyrics & Songwriting', 'AI Cover Creation'];
const AiServiceTypeList = ['Lyrics', 'Songwriting', 'Sing', 'Link'];
const SortByList = ['Latest', 'Oldest', 'Most Liked', 'Most Commented', 'Low Likes', 'Most Comments'];

const topAlbumsCategoryList = ['AI Lyrics & Songwriting', 'AI Singing Evaluation', 'AI Cover Creation'];
const myAlbumsCategoryList = ['Unreleased songs', 'Released songs'];

const Albums = ({ token }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const [modalList, setModalList] = useState([
        { title: 'AI Service List', items: AiServiceList },
        { title: 'AI Service Type List', items: AiServiceTypeList },
        { title: 'Sort By List', items: SortByList },
    ]);

    const [myTopAlbumList, setMyTopAlbumList] = useState({});
    const [mySongData, setMySongData] = useState({});

    const [topAlbumsCategory, setTopAlbumsCategory] = useState(topAlbumsCategoryList[0]);
    const [myAlbumsCategory, setMyAlbumsCategory] = useState(myAlbumsCategoryList[0]);

    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';

    // 첫 번째 필터 클릭 이벤트 (AI 서비스 리스트 + 타입 리스트만 전달)
    const handleFilterClick = () => {
        setModalList([
            { title: 'AI Service List', items: AiServiceList },
            { title: 'AI Service Type List', items: AiServiceTypeList },
        ]);
        setOpenModal(true);
    };

    // 두 번째 필터 클릭 이벤트 (AI 서비스 리스트 + 타입 리스트 + 정렬 리스트 전달)
    const handleAlbumsFilterClick = () => {
        setModalList([
            { title: 'AI Service List', items: AiServiceList },
            { title: 'AI Service Type List', items: AiServiceTypeList },
            { title: 'Sort By List', items: SortByList },
        ]);
        setOpenModal(true);
    };
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

    // useEffect(() => {
    //     if (token) {
    //         const fetchMyTopAlbumList = async () => {
    //             try {
    //                 const response = await GetMyTopAlbumList(token);
    //                 console.log('API 응답:', response);
    //                 const { data } = response;
    //                 setMyTopAlbumList({
    //                     top_like: data?.top_like,
    //                     top_plays: data?.top_plays,
    //                     top_comments: data?.top_comments,
    //                 });
    //             } catch (error) {
    //                 console.error('Error fetching my top album list:', error);
    //             }
    //         };
    //         fetchMyTopAlbumList();
    //     }
    // }, [token]);

    // useEffect(() => {
    //     if (token) {
    //         const fetchMyMusicList = async () => {
    //             try {
    //                 const response = await getMyMusicList({ token, page, search });
    //                 setMySongData(response?.data);
    //             } catch (e) {
    //                 console.error(e);
    //             }
    //         };

    //         fetchMyMusicList();
    //     }
    // }, [token, page, search]);

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
                    {/* {topSongsData &&
                        Object.entries(topSongsData).map(([key, value], index) => (
                            <div className="albums__item" key={index}>
                                <p className="albums__item-title">{key?.replaceAll('_', ' ')}</p>
                                <div className="albums__item-intro">
                                    <div className="albums__item__img-box">
                                        <img
                                            className="albums__item__img"
                                            src={value?.image || demoAlbum}
                                            alt="album"
                                        />
                                    </div>
                                    <div className="albums__item-desc">
                                        <div className="albums__item__icon-box">
                                            <div className="albums__item__play-count">
                                                <img src={heartIcon} alt="heart" />
                                                <span>{value?.like}</span>
                                            </div>
                                            <div className="albums__item__play-count">
                                                <img src={commentIcon} alt="comment" />
                                                <span>{value?.comment_cnt}</span>
                                            </div>
                                        </div>
                                        <div className="albums__item__user-info">
                                            <img
                                                className="albums__item__user-img"
                                                src={value?.user_profile || demoUser}
                                                alt="user"
                                            />
                                            <span>{value?.name || 'Unknown'}</span>
                                            <button className="albums__item__more-btn">
                                                <img src={moreIcon} alt="more" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))} */}
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
            {openModal && <FilterAiServiceModal list={modalList} onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default Albums;
