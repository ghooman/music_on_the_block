import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { getUserGradeSquareIcon } from '../utils/getGradeIcon';
import axios from 'axios';

import SearchBar from '../components/unit/SearchBar';
import Pagination from '../components/unit/Pagination';
import AlbumItem from '../components/unit/AlbumItem';
import AlbumCollectionItems from '../components/mypage/albumsAndCollectionsComponents/AlbumCollectionItems';
import Loading from '../../src/components/Loading.jsx';
// 이미지
import artistLevelIcon from '../assets/images/icons/artist-level-icon.svg';
import artistSampleImg from '../assets/images/album/artist-sample.png';
import defaultAlbumImage from '../assets/images/album/album-cover.png';

import defaultCoverImg2 from '../assets/images/logo-png2.png';

// 스타일
import '../styles/SearchResult.scss';

const serverAPI = process.env.REACT_APP_SERVER_API;

function SearchResult() {
  const navigate = useNavigate();
  const { t } = useTranslation('main');
  const { token, walletAddress } = useContext(AuthContext);

  // 검색어 가져오기
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);

  // 검색어 상태
  const handleChange = e => setKeyword(e.target.value);
  const handleClear = () => setKeyword('');

  // 페이지네이션 상태
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // Pagination
  const [musicPage, setMusicPage] = useState(1);
  const [artistPage, setArtistPage] = useState(1);
  const [albumPage, setAlbumPage] = useState(1);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

  // ------- 통합 검색 상태 -----------
  const [songList, setSongList] = useState([]); // 곡 리스트
  const [artistList, setArtistList] = useState([]); // 아티스트 리스트
  const [albumList, setAlbumList] = useState([]); // 앨범 리스트

  // 탭 구분
  const [selectedTab, setSelectedTab] = useState('Music');
  const tabs = [{ name: 'Music' }, { name: 'Artist' }, { name: 'Album' }];

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  //   const [music, setMusic] = useState([
  //     { id: 1, title: 'Test Song A' },
  //     { id: 2, title: 'Test Song B' },
  //     { id: 3, title: 'Test Song C' },
  //     { id: 4, title: 'Test Song D' },
  //     { id: 5, title: 'Test Song E' },
  //     { id: 6, title: 'Test Song F' },
  //   ]);

  const getViewCount = () => {
    switch (selectedTab) {
      case 'Music':
        return 15;
      case 'Artist':
        return 16;
      case 'Album':
        return 12;
      default:
        return 15;
    }
  };

  const viewCount = getViewCount();

  const [artist, setArtist] = useState([
    {
      id: 1,
      name: 'Test Artist X',
      coverImage: artistSampleImg,
      music: 12,
      follower: 3500,
    },
  ]);

  const [album, setAlbum] = useState([
    {
      id: 1,
      title: 'Test Album Z',
      artist: '앨범 아티스트',
      songCount: 12,
      isOwner: false,
      defaultAlbumImage: defaultAlbumImage,
    },
  ]);

  //   const pagedMusic = music.slice((musicPage - 1) * viewCountMusic, musicPage * viewCountMusic);
  //   const pagedArtist = artist.slice(
  //     (artistPage - 1) * viewCountArtist,
  //     artistPage * viewCountArtist
  //   );
  //   const pagedAlbum = album.slice((albumPage - 1) * viewCountAlbum, albumPage * viewCountAlbum);

  // 곡 검색 API 함수
  useEffect(() => {
    setIsLoading(true);
    if (selectedTab !== 'Music' || !keyword.trim() || !walletAddress) return;

    const handleGetSongList = async () => {
      try {
        const res = await axios.get(`${serverAPI}/api/music/search/list`, {
          params: {
            search_keyword: keyword,
            // page: currentPage,
            limit: 9999,
            wallet_address: walletAddress?.address,
          },
        });
        const list = res.data.data_list;
        console.log('곡 검색 API 함수 가져오기 완료~!', list);
        setSongList(list);
      } catch (error) {
        console.error('곡 검색 API 함수 error입니당', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetSongList();
  }, [keyword, walletAddress, selectedTab]);

  // 아티스트 검색 API 함수
  useEffect(() => {
    setIsLoading(true);
    if (selectedTab !== 'Artist' || !keyword.trim()) return;

    const handleGetArtistList = async () => {
      try {
        const res = await axios.get(`${serverAPI}/api/music/artist/search/list`, {
          params: {
            search_keyword: keyword,
            limit: 9999,
          },
        });
        const list = res.data.data_list;
        console.log('아티스트 검색 API 함수 가져오기 완료~!', list);
        setArtistList(list);
      } catch (error) {
        console.error('아티스트 검색 API 함수 error입니당', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetArtistList();
  }, [keyword, selectedTab]);

  // 앨범 검색 API 함수
  useEffect(() => {
    setIsLoading(true);
    if (selectedTab !== 'Album' || !keyword.trim()) return;

    const handleGetAlbumList = async () => {
      try {
        const res = await axios.get(`${serverAPI}/api/music/album/bundle/search/list`, {
          params: {
            search_keyword: keyword,
            limit: 9999,
          },
        });
        const list = res.data.data_list;
        console.log('앨범 검색 API 함수 가져오기 완료~!', list);
        setAlbumList(list);
      } catch (error) {
        console.error('앨범 검색 API 함수 error입니당', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetAlbumList();
  }, [keyword, selectedTab]);

  // 현재 페이지에 보여줄 리스트 자르기
  const getListByTab = () => {
    switch (selectedTab) {
      case 'Music':
        return songList;
      case 'Artist':
        return artist;
      case 'Album':
        return album;
      default:
        return [];
    }
  };

  const pagedList = getListByTab().slice((currentPage - 1) * viewCount, currentPage * viewCount);

  // URL page 변경되면 currentPage 업데이트
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  // 페이지네이션 페이지 함수
  const handlePageChange = newPage => {
    setMusicPage(newPage); // 내부 상태가 필요하다면 유지
    navigate(`/search-result?keyword=${encodeURIComponent(keyword)}&page=${newPage}`);
  };

  const handlePlay = track => {
    setCurrentTrack(track);
    const player = audioRef?.current;
    if (!player) return;
    player.src = track.url;
    player.play();
  };

  const handleNavigate = albumId => {
    navigate(`/album/${albumId}`);
  };

  return (
    <>
      <SearchBar keyword={keyword} handleChange={handleChange} handleClear={handleClear} />
      {/* 로딩 중일 때 전체 화면 로딩 컴포넌트 출력 */}
      {isLoading ? (
        <div className="result-loading">
          <Loading />
        </div>
      ) : (
        <div className="result-section">
          {songList.length === 0 && artist.length === 0 && album.length === 0 ? (
            <p className="no-result-txt">{t('No search results found.')}</p>
          ) : (
            <>
              <nav className="tab__nav">
                {tabs.map(tab => (
                  <button
                    key={tab.name}
                    className={`tab__nav-item ${selectedTab === tab.name ? 'active' : ''}`}
                    onClick={() => {
                      if (tab.preparing) {
                        alert(t('PREPARING'));
                      } else {
                        setSelectedTab(tab.name);
                        setCurrentPage(1); // 탭 바뀔 때 페이지 초기화
                      }
                    }}
                  >
                    {t(tab.name)}
                  </button>
                ))}
              </nav>
              {/* Music 탭 클릭 시 */}
              {selectedTab === 'Music' && (
                <div className="result-list__music">
                  {pagedList?.length > 0 ? (
                    <>
                      {pagedList.map(track => (
                        <AlbumItem
                          key={track.id}
                          track={track}
                          isActive={currentTrack?.id === track.id}
                          currentTime={currentTime}
                          onClick={() => handlePlay(track)}
                          audioRef={audioRef}
                        />
                      ))}
                      <Pagination
                        totalCount={songList.length}
                        viewCount={viewCount}
                        page={currentPage}
                        setPage={setCurrentPage}
                      />
                    </>
                  ) : (
                    <div className="no-result-txt">{t('No search results found.')}</div>
                  )}
                </div>
              )}

              {/* Artist 탭 클릭 시 */}
              {selectedTab === 'Artist' && (
                <div className="result-list__artist">
                  {artistList.length > 0 ? (
                    <>
                      <div className="artist-list">
                        {artistList.map(artist => (
                          <figure key={artist.id} className="artist-item">
                            <div className="artist-thumb">
                              <Link to={`/profile?category=AI+Services&username=${artist.name}`}>
                                <img
                                  src={artist.profile ? artist.profile : defaultCoverImg2}
                                  alt={artist.name}
                                />
                              </Link>
                            </div>
                            <figcaption className="artist-info">
                              <h3 className="artist-name">
                                <span>{artist.name}</span>
                                <img
                                  src={getUserGradeSquareIcon(artist?.user_rating)}
                                  alt="Artist Level Icon"
                                  className="artist-level"
                                />
                              </h3>
                              <p className="artist-meta">
                                <span>
                                  Music <small>{artist.total_songs}</small>
                                </span>
                                <span>
                                  Follower <small>{artist.followers}</small>
                                </span>
                              </p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                      <Pagination
                        totalCount={artist.length}
                        viewCount={viewCount}
                        page={currentPage}
                        setPage={setCurrentPage}
                      />
                    </>
                  ) : (
                    <div className="no-result-txt">{t('No search results found.')}</div>
                  )}
                </div>
              )}

              {/* Album 탭 클릭 시 */}
              {selectedTab === 'Album' && (
                <div className="result-list__album">
                  {albumList.length > 0 ? (
                    <>
                      {albumList.map(album => (
                        <div key={album.id} className="album-card">
                          <AlbumCollectionItems.Item
                            name={album.album_name}
                            artist={album.name}
                            count={album.song_cnt}
                            isOwner={album.isOwner}
                            coverImage={album.cover_image}
                            handleNavigate={() => handleNavigate(album.id)}
                            target="Collection"
                            translateFn={word => word}
                          />
                        </div>
                      ))}
                      <Pagination
                        totalCount={album.length}
                        viewCount={viewCount}
                        page={currentPage}
                        setPage={setCurrentPage}
                      />
                    </>
                  ) : (
                    <div className="no-result-txt">{t('No search results found.')}</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default SearchResult;
