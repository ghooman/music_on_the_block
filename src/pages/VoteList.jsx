
import React, { useState } from 'react';
import Filter from '../components/unit/Filter';
import SearchBar from '../components/unit/SearchBar';
import VoteItem from '../components/unit/VoteItem';
import SuccessModal from '../components/modal/SuccessModal';
import ConfirmModal from '../components/modal/ConfirmModal';
import Pagination from '../components/unit/Pagination';

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

  // Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleVoteSubmit = () => {
    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }, 1000); // 예시: 1초 후 완료
  };

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
        keyword={search}
        handleChange={handleChange}
        handleClear={handleClear}
      />
      <div className='vote-list-section'>
        {voteList.length === 0 ? (
          <p className="no-result-txt">이벤트에 접수된 곡을 정리 중이에요!</p>
        ) : (
          <>
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
                  onVoteClick={() => setShowConfirmModal(true)}
                  // detailLink={`/song-detail/${item.id}`} -> 곡의 상세 페이지로 이동
                />
              </li>
            ))}
          </ul>
          <Pagination
            totalCount={voteList.length}
            viewCount={viewCount}
            page={page}
            setPage={setPage}
          />
          </>
        )}
      </div>

      {/* 출제곡 리스트 중 '투표하기' 클릭 시 나오는 투표 컨펌 모달 */}
      {showConfirmModal && (
        <ConfirmModal
          title="이 음악에 투표하시겠어요?"
          customContent={
            <>
            계정 당 투표는 3회만 가능하며, 재투표 및 취소가 불가능하니 신중하게 투표해 주세요.
            <p className='vote-txt'>현재 <b className='color-green'><span className='color-green'>3</span>회</b> 투표할 수 있습니다.</p>
            </>
          }
          cancelMessage="취소"
          okMessage="투표"
          okHandler={handleVoteSubmit}
          setShowConfirmModal={setShowConfirmModal}
          closeIcon={false}
          loading={isVoting}
        />
      )}
      {/* 투표 컨펌 모달 내 '투표' 클릭 후, 투표 완료 시 나오는 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          title="투표 완료"
          content="소중한 한 표가 성공적으로 반영되었어요!"
          closeIcon={false}
          setShowSuccessModal={setShowSuccessModal}
        />
      )}
    </>
  )
}

export default VoteList