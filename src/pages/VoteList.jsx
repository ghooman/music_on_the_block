import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Filter from '../components/unit/Filter';
import SearchBar from '../components/unit/SearchBar';
import VoteItem from '../components/unit/VoteItem';
import SuccessModal from '../components/modal/SuccessModal';
import ConfirmModal from '../components/modal/ConfirmModal';
import Pagination from '../components/unit/Pagination';
import Loading from '../components/Loading.js';

// 스타일
import '../styles/VoteList.scss';
import axios from 'axios';
import { Wallet } from 'ethers';

const serverAPI = process.env.REACT_APP_SERVER_API;

function VoteList() {
  const { token, walletAddress } = useContext(AuthContext);
  // -------------------- 상태 모음 -------------------------------------------------
  // search-bar : 타이핑 시 clear 버튼 노출, clear 버튼 클릭 시 setSearch 리셋
  const [search, setSearch] = useState('');
  // 페이지 로딩
  const [isPageLoading, setIsPageLoading] = useState(false);
  // 신청된 곡 리스트 상태
  const [songList, setSongList] = useState([]);
  const [songCnt, setSongCnt] = useState(0);

  // 페이지네이션을 위한 상태들
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  // 한 페이지에 보여줄 데이터 개수 (API 문서에서 limit=15로 설정되어 있음)
  const itemsPerPage = 15;

  // Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // -------------------- 함수 모음 -------------------------------------------------
  // 안전하게 문자열 주소만 추출
  const walletAddr =
    typeof walletAddress === 'string' ? walletAddress : walletAddress?.address ?? '';

  // 신청된 곡 리스트 가져오는 함수
  const handleGetSongList = async (page = 1) => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(`${serverAPI}/api/music/popular/vote/song`, {
        params: {
          page,
          limit: itemsPerPage,
          // type: '',
          // sort: '',
          ...(walletAddr && { wallet_address: walletAddr }),
        },
      });
      const list = res.data.data_list ?? [];
      const cnt = res.data.total_cnt ?? 0;

      console.log('신청된 곡 리스트 가져오기 완료!', list);
      setSongList(list);
      setSongCnt(cnt);
    } catch (error) {
      console.error('신청된 곡 리스트 가져오는 함수 error입니당', error);
      setSongList([]); // 에러 시 빈 배열로 초기화
    } finally {
      setIsPageLoading(false);
    }
  };

  // 4. useEffect 수정 - currentPage가 변경될 때마다 API 호출
  // 신청된 곡 리스트 업데이트
  useEffect(() => {
    handleGetSongList(currentPage);
  }, [currentPage, walletAddress]);

  const handleChange = e => {
    setSearch(e.target.value);
  };
  const handleClear = () => {
    setSearch('');
  };

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
      <h2 className="album__content-list__title">인기곡 투표</h2>
      <Filter
        aiServiceFilter={true} // 곡/비지엠 선택 필터
        songsSort={['Latest', 'Oldest']} // 최신순/오래된순 정렬 기준 필터
      />
      <SearchBar keyword={search} handleChange={handleChange} handleClear={handleClear} />
      <div className="vote-list-section">
        {isPageLoading && (
          <div className="result-loading">
            <Loading />
          </div>
        )}

        {!isPageLoading && (
          <>
            {songList.length === 0 ? (
              <p className="no-result-txt">이벤트에 접수된 곡을 정리 중이에요!</p>
            ) : (
              <>
                <ul className="vote-list">
                  {songList.map((item, index) => (
                    <li className="vote-list__item" key={`vote-item-${index}`}>
                      <VoteItem
                        albumImage={item.cover_image}
                        type={item.type}
                        playCount={item.play_cnt}
                        likeCount={item.like_cnt}
                        musicTitle={item.song_name}
                        artistImage={item.artist_profile_image}
                        artistName={item.artist_name}
                        voteCount={item.vote_cnt}
                        isVoted={item.voted_by_me}
                        onVoteClick={() => setShowConfirmModal(true)}
                        detailLink={`/song-detail/${item.song_id}`} // -> 곡의 상세 페이지로 이동
                      />
                    </li>
                  ))}
                </ul>
                <Pagination
                  totalCount={songCnt}
                  viewCount={itemsPerPage}
                  page={currentPage}
                  handler={setCurrentPage}
                />
              </>
            )}
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
              <p className="vote-txt">
                현재{' '}
                <b className="color-green">
                  <span className="color-green">3</span>회
                </b>{' '}
                투표할 수 있습니다.
              </p>
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
  );
}

export default VoteList;
