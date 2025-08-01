
import React, { useState } from 'react';
import Filter from '../components/unit/Filter';
import SearchBar from '../components/unit/SearchBar';
import VoteItem from '../components/unit/VoteItem';

// 스타일
import '../styles/VoteList.scss';

function VoteList() {
  // search-bar : 타이핑 시 clear 버튼 노출, clear 버튼 클릭 시 setSearch 리셋
  const [search, setSearch] = useState('');
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleClear = () => {
    setSearch('');
  };

  // VoteItem Data
  const voteList = [
    {
      albumImage: '',
      genre: "BGM",
      playCount: "125K",
      heartCount: "145",
      musicTitle: "Music name",
      artistImage: '',
      artistName: 'Yolkhead',
      voteCount: '500 ',
      isVoted: false
    },
    {
      albumImage: '',
      genre: "BGM",
      playCount: "125K",
      heartCount: "145",
      musicTitle: "Music name",
      artistImage: '',
      artistName: 'Yolkhead',
      voteCount: '500 ',
      isVoted: true
    }
  ]

  // Pagination
  const [page, setPage] = useState(1);
  const viewCount = 20;
  const pagedVoteList = voteList.slice((page - 1) * viewCount, page * viewCount);
  
  return (
    <>
      <h2 className='album__content-list__title'>
        인기곡 투표
      </h2>
      <Filter 
        aiServiceFilter={true} // 곡/비지엠 선택 필터
        songsSort={['Latest', 'Oldest']} // 최신순/오래된순 정렬 기준 필터
      />
      <SearchBar
        search={search}
        handleChange={handleChange}
        handleClear={handleClear}
      />
      <div className='vote-list-section'>
        {voteList.length === 0 ? (
          <p className="no-result-txt">이벤트에 접수된 곡을 정리 중이에요!</p>
        ) : (
          <ul className="vote-list">
            {voteList.map((item, index) => (
              <li className="vote-list__item" key={`vote-item-${index}`}>
                <VoteItem
                  albumImage={item.albumImage}
                  genre={item.genre}
                  playCount={item.playCount}
                  heartCount={item.heartCount}
                  musicTitle={item.musicTitle}
                  artistImage={item.artistImage}
                  artistName={item.artistName}
                  voteCount={item.voteCount}
                  isVoted={item.isVoted}
                  // detailLink={`/vote/${item.id}`} -> 곡의 상세 페이지로 이동
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default VoteList