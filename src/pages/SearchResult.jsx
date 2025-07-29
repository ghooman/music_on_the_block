import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/unit/SearchBar';

// 스타일
import '../styles/SearchResult.scss';

function SearchResult() {
    const { t } = useTranslation('main');
    const [search, setSearch] = useState(''); // 검색어 상태
    const handleChange = (e) => setSearch(e.target.value); // 입력 변경 핸들러
    const handleClear = () => setSearch(''); // 초기화 핸들러

    // const [music, setMusic] = useState([]);
    // const [artist, setArtist] = useState([]);
    // const [album, setAlbum] = useState([]);
    const [music, setMusic] = useState([
    { id: 1, title: 'Test Song A' },
    { id: 2, title: 'Test Song B' },
    ]);

    const [artist, setArtist] = useState([
    { id: 1, name: 'Test Artist X' },
    ]);

    const [album, setAlbum] = useState([
    { id: 1, title: 'Test Album Z' },
    ]);

    const [selectedTab, setSelectedTab] = useState('곡');
    const tabs = [
        { name: '곡' },
        { name: '아티스트' },
        { name: '앨범'},
    ];



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
                  <nav className="mypage__nav">
                        {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`mypage__nav-item ${selectedTab === tab.name ? 'active' : ''}`}
                            onClick={() => {
                            if (tab.preparing) {
                                alert(t('준비 중입니다.'));
                            } else {
                                setSelectedTab(tab.name);
                            }
                            }}
                        >
                            {t(tab.name)}
                        </button>
                        ))}
                    </nav>
                  {selectedTab === '곡' && (
                        <div className="result-list">
                        {music.map((item) => (
                            <div key={item.id} className="result-item">🎵 {item.title}</div>
                        ))}
                        </div>
                    )}

                    {selectedTab === '아티스트' && (
                        <div className="result-list">
                        {artist.map((item) => (
                            <div key={item.id} className="result-item">🎤 {item.name}</div>
                        ))}
                        </div>
                    )}

                    {selectedTab === '앨범' && (
                        <div className="result-list">
                        {album.map((item) => (
                            <div key={item.id} className="result-item">💿 {item.title}</div>
                        ))}
                        </div>
                    )}
                </>
            )}
        </div>
        </>
    )
}

export default SearchResult