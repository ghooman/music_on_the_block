// import { useSearchParams } from 'react-router-dom';
// import ContentWrap from '../unit/ContentWrap';
// import Filter from '../unit/Filter';
// import Pagination from '../unit/Pagination';
// import Search from '../unit/Search';
// import SubBanner from '../../components/create/SubBanner';

// import SubCategories from '../unit/SubCategories';

// import subBannerImage4 from '../../assets/images/create/subbanner-bg4.png';
// import songImg from '../../assets/images/intro/intro-demo-img2.png';
// import playIcon from '../../assets/images/play-icon2.svg';
// import editIcon from '../../assets/images/edit.svg';

// // 이미지
// import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
// import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
// import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// import './AlbumsDetail.scss';
// import { useState } from 'react';

// const AlbumsDetail = () => {

//     const subCategoryList = [
//         { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
//         { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
//         { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
//     ];
//     const [selected, setSelected] = useState(subCategoryList[0].name);

//     return (
//         <>
//             <div className='my-album-details'>
//                 <p className='my-album-details__title'>Album Details</p>
//                 <div className='my-album-details__box'>
//                     <section className='my-album-details__box__header'>
//                         <article className='my-album-details__box__header__left'>
//                             <div className='my-album-details__box__header__left__img-box'>
//                                 <img src={songImg} alt='cover-img'/>
//                             </div>
//                         </article>
//                         <article className='my-album-details__box__header__right'>
//                             <div className='my-album-details__box__header__right__box'>
//                                 <p className='my-album-details__box__header__right__box__title'>
//                                     <span>title texttitle texttitle texttitle texttitle text</span>
//                                     <button className='my-album-details__box__header__right__box__title__edit-btn'>
//                                         Edit Album
//                                         <img src={editIcon} alt='edit-icon'/>
//                                     </button>
//                                 </p>
//                                 <div className='my-album-details__box__header__right__box__list'>
//                                     <div className='my-album-details__box__header__right__box__list__item'>
//                                         <p className='my-album-details__box__header__right__box__list__item__title'>
//                                             Artist
//                                         </p>
//                                         <p className='my-album-details__box__header__right__box__list__item__title-value'>
//                                             <img src={songImg} alt='user-img' className='user-img'/>
//                                             user name
//                                         </p>
//                                     </div>
//                                     <div className='my-album-details__box__header__right__box__list__item'>
//                                         <p className='my-album-details__box__header__right__box__list__item__title'>
//                                         Songs
//                                         </p>
//                                         <p className='my-album-details__box__header__right__box__list__item__title-value'>
//                                             12
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <button className='my-album-details__box__header__right__play-btn'>
//                                     <img src={playIcon} alt='play-icon'/>Play
//                                 </button>
//                             </div>
//                         </article>
//                     </section>
//                     <section className='my-album-details__box__body'>
//                     <ContentWrap title="Favorites" border={false}>
//                         <SubCategories categories={subCategoryList} handler={() => null} value={selected} />

//                     </ContentWrap>

//                     </section>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AlbumsDetail;

// import React, { useState, useRef } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import ContentWrap from '../unit/ContentWrap';
// import Filter from '../unit/Filter';
// import Pagination from '../unit/Pagination';
// import Search from '../unit/Search';
// import SubCategories from '../unit/SubCategories';
// import SongPlayTable from '../unit/SongPlayTable';  // SongPlayTable 추가
// import axios from 'axios';  // axios 임포트

// // 이미지/아이콘들
// import songImg from '../../assets/images/intro/intro-demo-img2.png';
// import playIcon from '../../assets/images/play-icon2.svg';
// import editIcon from '../../assets/images/edit.svg';

// import './AlbumsDetail.scss';
// import track2 from '../../assets/music/MusicOnTheBlock_v1.mp3';
// import track3 from '../../assets/music/nisoft_song.mp3';

// // AI 관련 아이콘들
// import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
// import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
// import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

// // 더미 데이터
// const dummySongsList = {
//     data_list: [
//         {
//             id: 1,
//             title: 'Song 1',
//             name: 'Artist 1',
//             album: 'Album 1',
//             release_date: '2021-01-01',
//             cover_image: songImg,
//             music_url: track3,
//         },
//         {
//             id: 2,
//             title: 'Song 2',
//             name: 'Artist 2',
//             album: 'Album 2',
//             release_date: '2021-02-01',
//             cover_image: songImg,
//             music_url: track2,
//         },
//         {
//             id: 3,
//             title: 'Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3',
//             name: 'Artist 3',
//             album: 'Album 3',
//             release_date: '2021-03-01',
//             cover_image: songImg,
//             music_url: track3,
//         },
//     ],
//     total_cnt: 3,
// };

// const AlbumsDetail = ({ token }) => {
//     const audioRef = useRef(null);

//     const subCategoryList = [
//         { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
//         { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
//         { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
//     ];
//     const [selected, setSelected] = useState(subCategoryList[0].name);

//     const [searchParams, setSearchParams] = useSearchParams();
//     const page = searchParams.get('page') || 1;
//     const search = searchParams.get('search') || '';
//     const songsSort = searchParams.get('songs_sort');
//     const releaseType = searchParams.get('release_type') || 'Unreleased songs';

//     // 더미 데이터 사용 (API 호출 대신 더미 데이터)
//     const songsList = dummySongsList;

//     // 삭제 핸들러
//     const handleDelete = async (id) => {
//         console.log(`Delete song with id: ${id}`);
//     };

//     // 릴리즈 핸들러
//     const handleRelease = async (id) => {
//         console.log(`Release song with id: ${id}`);
//     };

//     // Play 버튼 클릭 시 모든 곡 순차적으로 재생
//     const handlePlayClick = () => {
//         if (audioRef.current) {
//             let currentIndex = 0;

//             // 첫 번째 곡을 설정
//             audioRef.current.src = songsList.data_list[currentIndex].music_url;
//             audioRef.current.play();

//             // 곡이 끝날 때마다 다음 곡을 재생하도록 설정
//             audioRef.current.onended = () => {
//                 currentIndex += 1;
//                 if (currentIndex < songsList.data_list.length) {
//                     audioRef.current.src = songsList.data_list[currentIndex].music_url;
//                     audioRef.current.play();
//                 }
//             };
//         }
//     };

//     return (
//         <div className="my-album-details">
//             <p className="my-album-details__title">Album Details</p>
//             <div className="my-album-details__box">
//                 <section className="my-album-details__box__header">
//                     <article className="my-album-details__box__header__left">
//                         <div className="my-album-details__box__header__left__img-box">
//                             <img src={songImg} alt="cover-img" />
//                         </div>
//                     </article>
//                     <article className="my-album-details__box__header__right">
//                         <div className="my-album-details__box__header__right__box">
//                             <p className="my-album-details__box__header__right__box__title">
//                                 <span>title texttitle texttitle texttitle texttitle text</span>
//                                 <button className="my-album-details__box__header__right__box__title__edit-btn">
//                                     Edit Album
//                                     <img src={editIcon} alt="edit-icon" />
//                                 </button>
//                             </p>
//                             <div className="my-album-details__box__header__right__box__list">
//                                 <div className="my-album-details__box__header__right__box__list__item">
//                                     <p className="my-album-details__box__header__right__box__list__item__title">
//                                         Artist
//                                     </p>
//                                     <p className="my-album-details__box__header__right__box__list__item__title-value">
//                                         <img src={songImg} alt="user-img" className="user-img" />
//                                         user name
//                                     </p>
//                                 </div>
//                                 <div className="my-album-details__box__header__right__box__list__item">
//                                     <p className="my-album-details__box__header__right__box__list__item__title">
//                                         Songs
//                                     </p>
//                                     <p className="my-album-details__box__header__right__box__list__item__title-value">
//                                         12
//                                     </p>
//                                 </div>
//                             </div>
//                             {/* <button className="my-album-details__box__header__right__play-btn">
//                                 <img src={playIcon} alt="play-icon" /> Play
//                             </button> */}
//                             <button className="my-album-details__box__header__right__play-btn" onClick={handlePlayClick}>
//                                 <img src={playIcon} alt="play-icon" /> Play
//                             </button>
//                         </div>
//                     </article>
//                 </section>
//                 <section className="my-album-details__box__body">
//                     <ContentWrap title="Favorites" border={false}>
//                         <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
//                         <SongPlayTable
//                             songList={songsList?.data_list}
//                             deleteOption={true}
//                             releaseOption={releaseType === 'Unreleased songs'}
//                             handleDelete={handleDelete}
//                             handleRelease={handleRelease}
//                         />
//                     </ContentWrap>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default AlbumsDetail;

import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useSearchParams, useParams } from "react-router-dom";
import ContentWrap from "../../unit/ContentWrap";
import Filter from "../../unit/Filter";
import Pagination from "../../unit/Pagination";
import Search from "../../unit/Search";
import SubCategories from "../../unit/SubCategories";
import SongPlayTable from "../../unit/SongPlayTable"; // SongPlayTable 추가
import axios from "axios"; // axios 임포트
import NoneContent from "../../../components/unit/NoneContent";

// 이미지/아이콘들
import songImg from "../../../assets/images/intro/intro-demo-img2.png";
import playIcon from "../../../assets/images/play-icon2.svg";
import stopIcon from "../../../assets/images/stop-icon.svg";
import editIcon from "../../../assets/images/edit.svg";
import defaultAlbumImage from "../../../assets/images/mypage/albums-upload-logo.png";
import NoDataImage from "../../../assets/images/mypage/albums-no-data.svg";
import "./AlbumsDetail.scss";
import track2 from "../../../assets/music/MusicOnTheBlock_v1.mp3";
import track3 from "../../../assets/music/nisoft_song.mp3";

// AI 관련 아이콘들
import LyricsIcon from "../../../assets/images/icon/Lyrics-Icon.svg";
import LyricsAndSongwritingIcon from "../../../assets/images/icon/Songwriting-Icon.svg";
import SongwritingIcon from "../../../assets/images/icon/Composition-Icon.svg";
import { getMyAlbumBundleInfo } from "../../../api/AlbumsDetail";

// 더미 데이터
const dummySongsList = {
  data_list: [
    {
      id: 1,
      title: "Song 1",
      name: "Artist 1",
      album: "Album 1",
      release_date: "2021-01-01",
      cover_image: songImg,
      music_url: track3,
    },
    {
      id: 2,
      title: "Song 2",
      name: "Artist 2",
      album: "Album 2",
      release_date: "2021-02-01",
      cover_image: songImg,
      music_url: track2,
    },
    {
      id: 3,
      title: "Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3Song 3",
      name: "Artist 3",
      album: "Album 3",
      release_date: "2021-03-01",
      cover_image: songImg,
      music_url: track3,
    },
  ],
  total_cnt: 3,
};

const AlbumsDetail = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [albumBundleInfo, setAlbumBundleInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("id", id);
    const fetchAlbumBundleInfo = async () => {
      try {
        const response = await getMyAlbumBundleInfo(id, token);
        setAlbumBundleInfo(response);
      } catch (error) {
        console.error("앨범 번들 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbumBundleInfo();
  }, []);

  const audioRef = useRef(null);
  const [activeSong, setActiveSong] = useState(null); // activeSong 상태 관리

  const subCategoryList = [
    {
      name: "AI Lyrics & Songwriting",
      image: LyricsAndSongwritingIcon,
      preparing: false,
    },
    { name: "AI Singing Evaluation", image: LyricsIcon, preparing: true },
    { name: "AI Cover Creation", image: SongwritingIcon, preparing: true },
  ];
  const [selected, setSelected] = useState(subCategoryList[0].name);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const search = searchParams.get("search") || "";
  const songsSort = searchParams.get("songs_sort");
  const releaseType = searchParams.get("release_type") || "Unreleased songs";

  // 더미 데이터 사용 (API 호출 대신 더미 데이터)
  const songsList = dummySongsList;

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    /* Stop 누른 상태 */
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      setIsPlaying(false);
      setActiveSong(null);
      return;
    }

    /* Play 시작 */
    let currentIndex = 0;
    setActiveSong(songsList.data_list[currentIndex].id);
    setIsPlaying(true);

    audioRef.current.src = songsList.data_list[currentIndex].music_url;
    audioRef.current.play();

    audioRef.current.onended = () => {
      currentIndex += 1;
      if (currentIndex < songsList.data_list.length) {
        setActiveSong(songsList.data_list[currentIndex].id);
        audioRef.current.src = songsList.data_list[currentIndex].music_url;
        audioRef.current.play();
      } else {
        setIsPlaying(false);
        setActiveSong(null);
      }
    };
  };

  return (
    <div className="my-album-details">
      <p className="my-album-details__title">Album Details</p>
      <div className="my-album-details__box">
        <section className="my-album-details__box__header">
          <article className="my-album-details__box__header__left">
            <div className="my-album-details__box__header__left__img-box">
              <img
                src={albumBundleInfo?.cover_image || defaultAlbumImage}
                alt="cover-img"
              />
            </div>
          </article>
          <article className="my-album-details__box__header__right">
            <div className="my-album-details__box__header__right__box">
              <p className="my-album-details__box__header__right__box__title">
                <span>{albumBundleInfo?.album_name}</span>
                <button className="my-album-details__box__header__right__box__title__edit-btn">
                  Edit Album
                  <img src={editIcon} alt="edit-icon" />
                </button>
              </p>
              <div className="my-album-details__box__header__right__box__list">
                <div className="my-album-details__box__header__right__box__list__item">
                  <p className="my-album-details__box__header__right__box__list__item__title">
                    Artist
                  </p>
                  <p className="my-album-details__box__header__right__box__list__item__title-value">
                    <img src={songImg} alt="user-img" className="user-img" />
                    {albumBundleInfo?.name}
                  </p>
                </div>
                <div className="my-album-details__box__header__right__box__list__item">
                  <p className="my-album-details__box__header__right__box__list__item__title">
                    Songs
                  </p>
                  <p className="my-album-details__box__header__right__box__list__item__title-value">
                    {albumBundleInfo?.song_cnt}
                  </p>
                </div>
              </div>
              {/* Play 버튼 */}
              <button
                className="my-album-details__box__header__right__play-btn"
                onClick={handlePlayClick}
              >
                <img
                  src={isPlaying ? stopIcon : playIcon}
                  alt={isPlaying ? "stop-icon" : "play-icon"}
                />
                {isPlaying ? " Stop" : " Play"}
              </button>
            </div>
          </article>
        </section>
        <section className="my-album-details__box__body">
          <ContentWrap title="Favorites" border={false}>
            <SubCategories
              categories={subCategoryList}
              handler={() => null}
              value={selected}
            />
            {/* <SongPlayTable
              songList={songsList?.data_list}
              // deleteOption={true}
              // releaseOption={releaseType === 'Unreleased songs'}
              activeSong={activeSong} // 상위 컴포넌트에서 관리하는 activeSong 전달
              setActiveSong={setActiveSong} // 상위 컴포넌트에서 관리하는 setActiveSong 전달
              audioRef={audioRef} // audioRef 전달
            /> */}
            {albumBundleInfo?.song_list?.length > 0 ? (
              <SongPlayTable
                songList={albumBundleInfo?.song_list}
                activeSong={activeSong}
                setActiveSong={setActiveSong}
              />
            ) : (
              <NoneContent
                image={NoDataImage}
                title="No songs in this album"
                message="This album is currently empty."
                message2="Add songs to complete your album."
              />
            )}
          </ContentWrap>
        </section>
      </div>
    </div>
  );
};

export default AlbumsDetail;
