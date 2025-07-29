import React, { useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/unit/SearchBar';
import Pagination from '../components/unit/Pagination';
import AlbumItem from '../components/unit/AlbumItem';
import AlbumCollectionItems from '../components/mypage/albumsAndCollectionsComponents/AlbumCollectionItems';
// 이미지
import artistLevelIcon from '../assets/images/icons/artist-level-icon.svg';
import artistSampleImg from '../assets/images/album/artist-sample.png';
import defaultAlbumImage from '../assets/images/album/album-cover.png';

// 스타일
import '../styles/SearchResult.scss';

function SearchResult() {
    const { t } = useTranslation('main');
    const [search, setSearch] = useState(''); // 검색어 상태
    const handleChange = (e) => setSearch(e.target.value); // 입력 변경 핸들러
    const handleClear = () => setSearch(''); // 초기화 핸들러
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState('Music');
    const tabs = [
        { name: 'Music' },
        { name: 'Artist' },
        { name: 'Album'},
    ];

    const [music, setMusic] = useState([
    { id: 1, title: 'Test Song A' },
    { id: 2, title: 'Test Song B' },
    { id: 3, title: 'Test Song C' },
    { id: 4, title: 'Test Song D' },
    { id: 5, title: 'Test Song E' },
    { id: 6, title: 'Test Song F' },
    ]);

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


    const [currentTrack, setCurrentTrack] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    const handlePlay = (track) => {
        setCurrentTrack(track);
        const player = audioRef?.current;
        if (!player) return;
        player.src = track.url;
        player.play();
    };

    const handleNavigate = (albumId) => {
        navigate(`/album/${albumId}`);
    };

    // Pagination
    const [musicPage, setMusicPage] = useState(1);
    const [artistPage, setArtistPage] = useState(1);
    const [albumPage, setAlbumPage] = useState(1);
    const viewCountMusic = 15;
    const viewCountArtist = 16;
    const viewCountAlbum = 12;
    const pagedMusic = music.slice((musicPage - 1) * viewCountMusic, musicPage * viewCountMusic);
    const pagedArtist = artist.slice((artistPage - 1) * viewCountArtist, artistPage * viewCountArtist);
    const pagedAlbum = album.slice((albumPage - 1) * viewCountAlbum, albumPage * viewCountAlbum);

    return (
        <>
        <SearchBar
            search={search}
            handleChange={handleChange}
            handleClear={handleClear}
        />
        <div className="result-section">
            {music.length === 0 && artist.length === 0 && album.length === 0 ? (
                <p className='no-result-txt'>
                    {t('No search results found.')}
                </p>
            ) : (
            <>
            <nav className="tab__nav">
                {tabs.map((tab) => (
                <button
                    key={tab.name}
                    className={`tab__nav-item ${selectedTab === tab.name ? 'active' : ''}`}
                    onClick={() => {
                    if (tab.preparing) {
                        alert(t('PREPARING'));
                    } else {
                        setSelectedTab(tab.name);
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
                {music?.length > 0 ? (
                <>
                {music.map((track) => (
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
                    totalCount={music.length}
                    viewCount={viewCountMusic}
                    page={musicPage}
                    setPage={setMusicPage}
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
                {pagedArtist.length > 0 ? (
                <>
                    <div className="artist-list">
                    {pagedArtist.map((artist) => (
                        <figure key={artist.id} className="artist-item">
                        <div className="artist-thumb">
                            <Link to="/my-page?category=AI+Services">
                            <img src={artist.coverImage} alt={artist.name} />
                            </Link>
                        </div>
                        <figcaption className="artist-info">
                            <h3 className="artist-name">
                            <span>{artist.name}</span>
                            <img
                                src={artistLevelIcon}
                                alt="Artist Level Icon"
                                className="artist-level"
                            />
                            </h3>
                            <p className="artist-meta">
                            <span>
                                Music <small>{artist.music}</small>
                            </span>
                            <span>
                                Follower <small>{artist.follower}</small>
                            </span>
                            </p>
                        </figcaption>
                        </figure>
                    ))}
                    </div>
                    <Pagination
                    totalCount={artist.length}
                    viewCount={viewCountArtist}
                    page={artistPage}
                    setPage={setArtistPage}
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
                {pagedAlbum.length > 0 ? (
                <>
                    {pagedAlbum.map((album) => (
                    <div key={album.id} className="album-card">
                        <AlbumCollectionItems.Item
                        name={album.title}
                        artist={album.artist}
                        count={album.songCount}
                        isOwner={album.isOwner}
                        coverImage={album.defaultAlbumImage}
                        handleNavigate={() => handleNavigate(album.id)}
                        target="Collection"
                        translateFn={(word) => word}
                        />
                    </div>
                    ))}
                    <Pagination
                    totalCount={album.length}
                    viewCount={viewCountAlbum}
                    page={albumPage}
                    setPage={setAlbumPage}
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
        </>
    )
}

export default SearchResult