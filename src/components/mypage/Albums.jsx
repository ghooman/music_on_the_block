import './Albums.scss';
import { useEffect, useState } from 'react';
import heartIcon from '../../assets/images/icon/heart.svg';
import moreIcon from '../../assets/images/icon/more.svg';
import playIcon from '../../assets/images/icon/play.svg';
import commentIcon from '../../assets/images/icon/comment.svg';
import demoAlbum from '../../assets/images/mypage/demo-album.png';
import demoUser from '../../assets/images/mypage/demo-user.png';
import viewAllBackground from '../../assets/images/mypage/view-all-button.png';
import Filter from '../unit/Filter';
import AlbumsTable from '../unit/AlbumsTable';
import FilterAiServiceModal from '../unit/FilterAiServiceModal';
import { GetMyTopAlbumList } from '../../api/GetMyTopAlbumList';
import ContentWrap from '../unit/ContentWrap';
import Search from '../unit/Search';

const Albums = ({ token }) => {
    const [openModal, setOpenModal] = useState(false);
    const [modalList, setModalList] = useState([]);
    const [myTopAlbumList, setMyTopAlbumList] = useState({});
    const AiServiceList = ['All', 'AI Singing Evaluation', 'AI Lyrics & Songwriting', 'AI Cover Creation'];

    const AiServiceTypeList = ['Lyrics', 'Songwriting', 'Sing', 'Link'];

    const SortByList = ['Latest', 'Oldest', 'Most Liked', 'Most Commented', 'Low Likes', 'Most Comments'];
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
    useEffect(() => {
        if (token) {
            const fetchMyTopAlbumList = async () => {
                try {
                    const response = await GetMyTopAlbumList(token);
                    console.log('API 응답:', response);
                    // 응답 데이터가 객체 형태이므로 그대로 저장
                    setMyTopAlbumList(response.data);
                } catch (error) {
                    console.error('Error fetching my top album list:', error);
                }
            };
            fetchMyTopAlbumList();
        }
    }, [token]);

    return (
        <div className="albums">
            <section className="albums__list">
                <div className="albums__header">
                    <h1 className="albums__title">Top Albums</h1>
                    <Filter list={['AI Lyrics + Songwriting']} clickEvent={handleFilterClick} />
                </div>
                <div className="albums__body">
                    {Object.values(myTopAlbumList).map((item, index) => (
                        <div className="albums__item" key={index}>
                            <p className="albums__item-title">{item?.title}</p>
                            <div className="albums__item-intro">
                                <div className="albums__item__img-box">
                                    <img className="albums__item__img" src={item?.image || demoAlbum} alt="album" />
                                </div>
                                <div className="albums__item-desc">
                                    {/* <p className="albums__item-desc-text">{item?.lyrics}</p> */}
                                    <div className="albums__item__icon-box">
                                        <div className="albums__item__play-count">
                                            <img src={heartIcon} alt="heart" />
                                            <span>{item?.like}</span>
                                        </div>
                                        <div className="albums__item__play-count">
                                            <img src={commentIcon} alt="comment" />
                                            <span>{item?.comment_cnt}</span>
                                        </div>
                                    </div>
                                    <div className="albums__item__user-info">
                                        <img
                                            className="albums__item__user-img"
                                            src={item?.user_profile || demoUser}
                                            alt="user"
                                        />
                                        <span>{item?.name || 'Unknown'}</span>
                                        <button className="albums__item__more-btn">
                                            <img src={moreIcon} alt="more" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <ContentWrap title="My Albums">
                <Filter clickEvent={handleAlbumsFilterClick} />
                <Search />
                <AlbumsTable />
            </ContentWrap>
            {openModal && <FilterAiServiceModal list={modalList} onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default Albums;
