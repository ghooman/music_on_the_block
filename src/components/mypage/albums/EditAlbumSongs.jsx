import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import SongPlayTable from '../../unit/SongPlayTable'; // SongPlayTable 추가
import axios from 'axios'; // axios 임포트

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
import { useQuery } from 'react-query';
import { AuthContext } from '../../../contexts/AuthContext';

// 더미 데이터
const dummySongsList = {
    data_list: [
        {
            id: 1,
            title: 'Song 1',
            name: 'Artist 1',
            album: 'Album 1',
            release_date: '2021-01-01',
            cover_image: songImg,
            music_url: track3,
        },
        {
            id: 2,
            title: 'Song 2',
            name: 'Artist 2',
            album: 'Album 2',
            release_date: '2021-02-01',
            cover_image: songImg,
            music_url: track2,
        },
        {
            id: 3,
            title: 'Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3',
            name: 'Artist 3',
            album: 'Album 3',
            release_date: '2021-03-01',
            cover_image: songImg,
            music_url: track3,
        },
    ],
    total_cnt: 3,
};

const subCategoryList = [
    { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
    { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
    { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
];

const serverApi = process.env.REACT_APP_SERVER_API;

const EditAlbumSongs = () => {
    const [selected, setSelected] = useState(subCategoryList[0].name);
    const [iseditAlbumModal, setIsEditAlbumModal] = useState(false);
    const [activeSong, setActiveSong] = useState(null);
    const [albumsBundleData, setAlbumsBundleData] = useState(null); // 앨범 원본 데이터

    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const audioRef = useRef(null);

    useEffect(() => {
        const getAlbumsBundleData = async () => {
            try {
                const res = await axios.get(`${serverApi}/api/music/my/album/bundle/${id}/detail`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAlbumsBundleData(res.data.song_list);
            } catch (e) {
                console.error(e);
            }
        };
        getAlbumsBundleData();
    }, [id]);

    return (
        <>
            <div className="edit-album-songs">
                <p className="edit-album-songs__title">Edit album Songs</p>
                <ContentWrap border={false}>
                    <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
                    <ContentWrap.SubWrap gap={8}>
                        <Filter songsSort />
                        <Search
                            placeholder="Search by Artist name or Song title..."
                            handler={null}
                            reset={{ page: 1 }}
                        />
                    </ContentWrap.SubWrap>
                    <SongPlayEditTable
                        title="Selected Songs"
                        songList={albumsBundleData}
                        setSongList={setAlbumsBundleData}
                        activeSong={activeSong}
                        setActiveSong={setActiveSong}
                        audioRef={audioRef}
                    />
                    <AddDeleteBtn />
                    <SongPlayEditTable
                        title="Album Songs"
                        songList={albumsBundleData}
                        setSongList={setAlbumsBundleData}
                        activeSong={activeSong}
                        setActiveSong={setActiveSong}
                        audioRef={audioRef}
                    />
                </ContentWrap>
                <button className="edit-btn" onClick={() => setIsEditAlbumModal(true)}>
                    Edit
                </button>
            </div>
            {iseditAlbumModal && <EditAlbumModal setIsEditAlbumModal={setIsEditAlbumModal} />}
        </>
    );
};

export default EditAlbumSongs;

const AddDeleteBtn = () => {
    return (
        <div className="add-delete-btn">
            <button type="button">
                <img src={addIcon} alt="addIcon" />
                Add
            </button>
            <button type="button">
                <img src={dellIcon} alt="dellIcon" />
                Delete
            </button>
        </div>
    );
};
