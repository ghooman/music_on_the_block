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
  const { walletAddress } = useContext(AuthContext);

  // 검색어 가져오기
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword); // 입력 중인 값
  const [confirmedKeyword, setConfirmedKeyword] = useState(initialKeyword); // 실제 검색 기준

  // 검색어 상태
  const handleChange = e => setKeyword(e.target.value);
  const handleClear = () => setKeyword('');

  // 페이지네이션 상태
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

  // ------- 통합 검색 상태 -----------
  const [songList, setSongList] = useState([]); // 곡 리스트
  const [artistList, setArtistList] = useState([]); // 아티스트 리스트
  const [albumList, setAlbumList] = useState([]); // 앨범 리스트

  // 탭 구분
  const [selectedTab, setSelectedTab] = useState('Music');
  const tabs = [{ name: 'Music' }, { name: 'Artist' }, { name: 'Album' }];

  // 탭의 응답 여부
  const [artistFetched, setArtistFetched] = useState(false);
  const [albumFetched, setAlbumFetched] = useState(false);
  const [musicFetched, setMusicFetched] = useState(false);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // 페이지네이션 한 페이지 데이터 갯수
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

  // // 곡&아티스트&앨범 검색 API 함수
  useEffect(() => {
    if (!confirmedKeyword.trim() || !walletAddress) return;

    setIsLoading(true);
    setArtistFetched(false);
    setAlbumFetched(false);
    setMusicFetched(false);

    const fetchSongs = axios.get(`${serverAPI}/api/music/search/list`, {
      params: {
        search_keyword: confirmedKeyword,
        limit: 9999,
        wallet_address: walletAddress?.address,
      },
    });

    const fetchArtists = axios.get(`${serverAPI}/api/music/artist/search/list`, {
      params: {
        search_keyword: confirmedKeyword,
        limit: 9999,
      },
    });

    const fetchAlbums = axios.get(`${serverAPI}/api/music/album/bundle/search/list`, {
      params: {
        search_keyword: confirmedKeyword,
        limit: 9999,
      },
    });

    Promise.all([fetchSongs, fetchArtists, fetchAlbums])
      .then(([songsRes, artistsRes, albumsRes]) => {
        setSongList(songsRes.data.data_list);
        setArtistList(artistsRes.data.data_list);
        setAlbumList(albumsRes.data.data_list);
      })
      .catch(err => {
        console.error('통합 검색 실패:', err);
      })
      .finally(() => {
        setMusicFetched(true);
        setArtistFetched(true);
        setAlbumFetched(true);
        setIsLoading(false);
      });
  }, [confirmedKeyword, walletAddress]);

  // url 바뀌었을 때 상태 반영하기
  useEffect(() => {
    const newKeyword = searchParams.get('keyword') || '';
    setKeyword(newKeyword);
    setConfirmedKeyword(newKeyword);
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // 현재 페이지에 보여줄 리스트 자르기
  const getListByTab = () => {
    switch (selectedTab) {
      case 'Music':
        return songList;
      case 'Artist':
        return artistList;
      case 'Album':
        return albumList;
      default:
        return [];
    }
  };

  const pagedList = getListByTab().slice((currentPage - 1) * viewCount, currentPage * viewCount);

  // URL page 변경되면 currentPage 업데이트
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

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

  // 검색 결과 판단 로직
  useEffect(() => {
    if (musicFetched && artistFetched && albumFetched) {
      if (songList.length > 0) setSelectedTab('Music');
      else if (artistList.length > 0) setSelectedTab('Artist');
      else if (albumList.length > 0) setSelectedTab('Album');
    }
  }, [musicFetched, artistFetched, albumFetched, songList, artistList, albumList]);

  const allFetchDone = artistFetched && albumFetched && musicFetched;
  const noResult =
    allFetchDone && songList.length === 0 && artistList.length === 0 && albumList.length === 0;

  return (
    <>
      <SearchBar keyword={keyword} handleChange={handleChange} handleClear={handleClear} />

      {/* 로딩 중일 때 */}
      {isLoading && (
        <div className="result-loading">
          <Loading />
        </div>
      )}

      {/* 로딩 끝난 후 */}
      {!isLoading && (
        <>
          {songList.length === 0 && artistList.length === 0 && albumList.length === 0 ? (
            <div className="result-section">
              <p className="no-result-txt">{t('No search results found.')}</p>
            </div>
          ) : (
            <div className="result-section">
              {/* 탭 보여주기 */}
              <nav className="tab__nav">
                {tabs.map(tab => (
                  <button
                    key={tab.name}
                    className={`tab__nav-item ${selectedTab === tab.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedTab(tab.name);
                      setCurrentPage(1);
                      setSearchParams(prev => ({
                        ...Object.fromEntries(prev),
                        page: '1',
                        keyword: confirmedKeyword,
                      }));
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
                  {pagedList.length > 0 ? (
                    <>
                      <div className="artist-list">
                        {pagedList.map(artist => (
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
                        totalCount={artistList.length}
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
                  {pagedList.length > 0 ? (
                    <>
                      {pagedList.map(album => (
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
                        totalCount={albumList.length}
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
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SearchResult;
