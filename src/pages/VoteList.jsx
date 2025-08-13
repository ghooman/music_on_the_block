
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Filter from '../components/unit/Filter';
import SearchBar from '../components/unit/SearchBar';
import VoteItem from '../components/unit/VoteItem';
import SuccessModal from '../components/modal/SuccessModal';
import ConfirmModal from '../components/modal/ConfirmModal';
import Pagination from '../components/unit/Pagination';
import VoteRegisterModal from '../components/modal/VoteRegisterModal';

import SampleAlbumImg from '../assets/images/vote/vote-sample-album.png';
import SampleArtistImg from '../assets/images/vote/vote-sample-artist.png';
import clearIcon from '../assets/images/icons/clear-icon.svg';
import searchIcon from '../assets/images/icons/search-icon.svg';

// 스타일
import '../styles/VoteList.scss';
import '../components/unit/SearchBar.scss';

function VoteList() {
    const { t } = useTranslation('main');
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

  // Modal - 투표하기
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Modal - 음악 등록하기
  const [selectedTracks, setSelectedTracks] = useState([]); 
  const [showRegisterModal, setShowRegisterModal] = useState(false); // 투표 등록 모달 추가
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);


  const handleVoteSubmit = () => {
    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }, 1000); // 예시: 1초 후 완료
  };

  const handleRegisterSelect = (tracks) => {
    setSelectedTracks(tracks);
    setShowRegisterModal(false);
    setShowRegisterConfirm(true);
  };

  const dummyTracks = [
  { 
    id: 1, 
    albumImage: SampleAlbumImg, 
    musicTitle: 'Music name',  
    artistImage: SampleArtistImg, 
    artistName: 'Yolkhead' },
  { 
    id: 2,  
    albumImage: SampleAlbumImg, 
    musicTitle: 'Music name',    
    artistImage: SampleArtistImg, 
    artistName: 'Yolkhead' },
  { 
    id: 3,  
    albumImage: SampleAlbumImg, 
    musicTitle: 'Music name',        
    artistImage: SampleArtistImg, 
    artistName: 'Yolkhead' },
];
  return (
    <>
      <div className='vote-list-title'>
        <h2 className='album__content-list__title'>
          인기곡 투표
        </h2>
        <button className='register-btn' onClick={() => setShowRegisterModal(true)}>이벤트 음악 등록</button>
      </div>
      <Filter 
        aiServiceFilter={true} // 곡/비지엠 선택 필터
        songsSort={['Latest', 'Oldest']} // 최신순/오래된순 정렬 기준 필터
      />
      <section className="search-section">
        <h2 className="search-section__tit">
          {t('What are you looking for?')}
        </h2>
        <div className="search-section__search-bar">
          <input
            type="text"
            className="search-bar__input"
            placeholder={t('Search for music and artists')}
            aria-label={t('Search for music and artists')}
            // value={keyword}
            // onChange={handleChange}
            // onKeyDown={e => {
            //   if (e.key === 'Enter') {
            //     handleSearch();
            //   }
            // }}
          />
          <div className="search-bar__button">
            <button className="search-bar__btn-reset"
              // className={`search-bar__btn-reset${
              //   keyword.length > 0 ? ' search-bar__btn-reset--typing' : ''
              // }`}
              onClick={handleClear}
              aria-label={t('Clear Search Form')}
            >
              <img src={clearIcon} alt="" />
            </button>
            <button
              className="search-bar__btn-search"
              aria-label={t('Search')}
              // onClick={handleSearch}
            >
              <img src={searchIcon} alt="" />
            </button>
          </div>
        </div>
      </section>
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


      {/* '이벤트 음악 등록' 클릭 시 나오는 투표 등록 모달 */}
      {showRegisterModal && (
        <VoteRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSubmit={handleRegisterSelect} // 선택 결과
          tracks={dummyTracks} 
        />
      )}
      {/* 투표 등록 모달 내 '음악 등록' 클릭 시 나오는 컨펌 모달, '취소' 클릭해도 선택한 정보 그대로 남아있도록 부탁드립니다. */}
      {showRegisterConfirm && (
        <ConfirmModal
          title={`총 ${selectedTracks.length} 개의 음악을 등록할까요?`}
          customContent={<>선택한 음악이 전부 이벤트 음악으로 등록됩니다.</>}
          cancelMessage="취소"
          okMessage="확인"
          // okHandler={handleRegisterSubmit}
          setShowConfirmModal={setShowRegisterConfirm}
          closeIcon={false}
          loading={isRegistering}
        />
      )}
    </>
  )
}

export default VoteList