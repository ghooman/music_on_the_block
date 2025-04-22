import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import SongPlayTable from '../../unit/SongPlayTable'; // SongPlayTable 추가
import axios from 'axios'; // axios 임포트
import { useQuery } from 'react-query';
import { AuthContext } from '../../../contexts/AuthContext';

// 이미지/아이콘들
import songImg from '../../../assets/images/intro/intro-demo-img2.png';
import addIcon from '../../../assets/images/add-icon.svg';
import dellIcon from '../../../assets/images/delete-icon.svg';
import editIcon from '../../../assets/images/edit.svg';

import './EditAlbumSongs.scss';
import track2 from '../../../assets/music/MusicOnTheBlock_v1.mp3';
import track3 from '../../../assets/music/nisoft_song.mp3';

// AI 관련 아이콘들
import LyricsIcon from '../../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../../assets/images/icon/Composition-Icon.svg';

import SongPlayEditTable from '../../unit/SongPlayEditTable';
import EditAlbumModal from '../../EditAlbumModal';

const subCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
];

const serverApi = process.env.REACT_APP_SERVER_API;

const EditAlbumSongs = () => {
    const [selected, setSelected] = useState(subCategoryList[0].name);
    const [iseditAlbumModal, setIsEditAlbumModal] = useState(false);
    const [activeSong, setActiveSong] = useState(null);
    const [albumsBundleData, setAlbumsBundleData] = useState(null); // 앨범 원본 데이터
    const [addBundleSongList, setAddBundleSongList] = useState([]);
    const [albumBundleSongList, setAlbumbundleSongList] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const audioRef = useRef(null);
    const navigate = useNavigate();

    const search = searchParams.get('search');
    const songsSort = searchParams.get('songs_sort');
    const songsFilter = searchParams.get('songs_filter') || 'liked';

    //=================
    // 추가
    //=================
    const handleAdd = () => {
        const copy = [...addBundleSongList];
        const newCopy = copy.filter((item) => item.check === true);
        setAddBundleSongList((prev) => prev.map((item) => ({ ...item, check: false }))); // 모든 데이터 체크 비활성화
        const maps = new Map(newCopy.map((item) => [item.id, item]));
        const arrays = Array.from(maps.values());

        setAlbumbundleSongList((prev) => {
            let copy = [...prev];
            let checkReset = arrays.map((item) => ({ ...item, check: false }));
            let maps = new Map([...copy, ...checkReset].map((item) => [item.id, item]));
            return Array.from(maps.values());
        });
    };

    //=================
    // 삭제
    //=================
    const handleDelete = () => {
        const copy = [...albumBundleSongList];
        const newCopy = copy.filter((item) => !item.check);
        setAlbumbundleSongList(newCopy);
        setActiveSong(null);
    };

    //==================
    // 앨범 수정 요청
    //==================
    const handleEdit = async () => {
        const songIdArray = albumBundleSongList.map((item) => item.id);
        try {
            const res = await axios.post(`${serverApi}/api/music/album/bundle/${id}/song`, songIdArray, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getAlbumsBundleData();
        } catch (e) {
            console.error(e);
        }
    };

    //==================
    // 앨범 데이터 가져오기
    //==================
    const getAlbumsBundleData = async () => {
        try {
            const res = await axios.get(`${serverApi}/api/music/my/album/bundle/${id}/detail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlbumsBundleData(res.data);
            setAlbumbundleSongList(res.data?.song_list.map((item) => ({ ...item, check: false })));
        } catch (e) {
            console.error(e);
        }
    };

    // 가진 곡
    useEffect(() => {
        setActiveSong(null);
        const getAddBundleData = async () => {
            let url;
            switch (songsFilter) {
                case 'following':
                    url = '/api/music/my/following/list/no/paging';
                    break;
                case 'mine':
                    url = '/api/music/my/list/no/paging';
                    break;
                case 'liked':
                    url = '/api/music/my/like/list/no/paging';
                    break;
                default:
                    url = '';
            }
            try {
                const res = await axios.get(`${serverApi + url}`, {
                    params: {
                        search_keyword: search,
                        sort_by: songsSort,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAddBundleSongList(res.data.filter((item) => !!item.music_url));
            } catch (e) {
                console.error(e);
            }
        };
        getAddBundleData();
    }, [songsFilter, search, songsSort]);

    // 현재 앨범 데이터
    useEffect(() => {
        getAlbumsBundleData();
    }, [id]);

    useEffect(() => {
        if (!activeSong) {
            audioRef.current.pause();
        } else {
            audioRef.current.currentTime = 0;
            audioRef.current.src = activeSong?.music_url;
            audioRef.current.play();
        }
    }, [activeSong]);

    console.log(albumBundleSongList, '송 리스트');

    return (
        <>
            <div className="edit-album-songs">
                <p className="edit-album-songs__title">Edit album Songs</p>
                <p className="edit-album-songs__title__album-name">{albumsBundleData?.album_name}</p>
                <div className="edit-album-songs__tab">
                    {/* <button
                        className={`edit-album-songs__tab__item ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        Recently Played
                    </button> */}
                    <button
                        className={`edit-album-songs__tab__item ${songsFilter === 'liked' ? 'active' : ''}`}
                        onClick={() => {
                            setSearchParams({ songs_filter: 'liked' });
                        }}
                    >
                        Liked Songs
                    </button>

                    <button
                        className={`edit-album-songs__tab__item ${songsFilter === 'mine' ? 'active' : ''}`}
                        // onClick={() => setActiveTab('mine')}
                        onClick={() => {
                            setSearchParams({ songs_filter: 'mine' });
                        }}
                    >
                        My Songs
                    </button>

                    <button
                        className={`edit-album-songs__tab__item ${songsFilter === 'following' ? 'active' : ''}`}
                        // onClick={() => setActiveTab('following')}
                        onClick={() => {
                            setSearchParams({ songs_filter: 'following' });
                        }}
                    >
                        Following
                    </button>
                </div>
                {/**
                 * 음악 재생
                 * 컴포넌트를 두 개 사용하는 이유로 플레이어를 외부로 뺍니다. (중복 재생 이슈를 막기 위해)
                 */}
                <div className="audio-container">
                    <audio controls ref={audioRef} />
                </div>

                <ContentWrap border={false}>
                    <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
                    <ContentWrap.SubWrap gap={8}>
                        <Filter songsSort />
                        <Search
                            placeholder="Search by Artist name or Song title..."
                            handler={null}
                            defaultValue={search}
                        />
                    </ContentWrap.SubWrap>
                    <SongPlayEditTable
                        title="Selected Songs"
                        songList={addBundleSongList}
                        setSongList={setAddBundleSongList}
                        activeSong={activeSong}
                        setActiveSong={setActiveSong}
                    />
                    <AddDeleteBtn addHandler={handleAdd} deleteHandler={handleDelete} />
                    <SongPlayEditTable
                        title="Album Songs"
                        songList={albumBundleSongList}
                        setSongList={setAlbumbundleSongList}
                        activeSong={activeSong}
                        setActiveSong={setActiveSong}
                    />
                </ContentWrap>
                <button className="edit-btn" onClick={() => setIsEditAlbumModal(true)}>
                    Edit
                </button>
            </div>
            {iseditAlbumModal && (
                <EditAlbumModal
                    setIsEditAlbumModal={setIsEditAlbumModal}
                    handleClick={handleEdit}
                    songsCount={albumBundleSongList?.length}
                    action={() => navigate(`/albums-detail/${id}`)}
                />
            )}
        </>
    );
};

export default EditAlbumSongs;

const AddDeleteBtn = ({ addHandler, deleteHandler }) => {
    return (
        <div className="add-delete-btn">
            <button type="button" onClick={addHandler}>
                <img src={addIcon} alt="addIcon" />
                Add
            </button>
            <button type="button" onClick={deleteHandler}>
                <img src={dellIcon} alt="dellIcon" />
                Delete
            </button>
        </div>
    );
};
