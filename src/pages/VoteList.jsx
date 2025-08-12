import React, { useState, useContext, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Filter from '../components/unit/Filter';
import SearchBar from '../components/unit/SearchBar';
import VoteItem from '../components/unit/VoteItem';
import SuccessModal from '../components/modal/SuccessModal';
import ConfirmModal from '../components/modal/ConfirmModal';
import Pagination from '../components/unit/Pagination';
import VoteRegisterModal from '../components/modal/VoteRegisterModal';

import SampleAlbumImg from '../assets/images/vote/vote-sample-album.png';
import SampleArtistImg from '../assets/images/vote/vote-sample-artist.png';

import Loading from '../components/Loading.js';

// 스타일
import '../styles/VoteList.scss';
import axios from 'axios';
import { Wallet } from 'ethers';

const serverAPI = process.env.REACT_APP_SERVER_API;

function VoteList() {
  const { token, walletAddress } = useContext(AuthContext);
  const isLoggedIn = Boolean(token);
  // -------------------- 상태 모음 -------------------------------------------------
  // search-bar : 타이핑 시 clear 버튼 노출, clear 버튼 클릭 시 setSearch 리셋
  const [search, setSearch] = useState('');
  // 페이지 로딩
  const [isPageLoading, setIsPageLoading] = useState(false);
  // 신청된 곡 리스트 상태
  const [songList, setSongList] = useState([]);
  const [songCnt, setSongCnt] = useState(0);
  // 남은 투표 가능 횟수 상태
  const [remainVoteCnt, setRemainVoteCnt] = useState(0);
  // 신청곡 추가 권한 유저 지갑주소 상태
  const [masterUserWallet, setMasterUserWallet] = useState([]);

  const handleChange = e => setSearch(e.target.value);
  const handleClear = () => setSearch('');
  // ----------- 필터링 -----------
  // UI → 서버 파라미터 매핑
  const TYPE_MAP = { Song: 'song', BGM: 'bgm' };
  const SORT_MAP = { Latest: 'latest', Oldest: 'oldest', 'Most Voted': 'vote_desc' };

  // 필터 선택 상태 (UI 라벨 기준으로 저장)
  const [selectedTypeLabel, setSelectedTypeLabel] = useState(null); // 'Song' | 'BGM' | null
  const [selectedSortLabel, setSelectedSortLabel] = useState('Most Voted'); // 기본값 예시

  // ----------- 페이지네이션 -----------
  // 페이지네이션을 위한 상태들
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  // 한 페이지에 보여줄 데이터 개수 (API 문서에서 limit=15로 설정되어 있음)
  const itemsPerPage = 15;

  // Modal - 투표하기
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false); // 오류났을경우
  const [showNoVoteLeftModal, setShowNoVoteLeftModal] = useState(false); // 투표횟수 0회

  // 선택된 곡의 ID를 저장하는 상태 변수 추가
  const [selectedSongId, setSelectedSongId] = useState(null);

  // Modal - 음악 등록하기
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // 투표 등록 모달 추가
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // -------------------- 함수 모음 -------------------------------------------------
  // 안전하게 문자열 주소만 추출
  const walletAddr =
    typeof walletAddress === 'string' ? walletAddress : walletAddress?.address ?? '';

  // 신청된 곡 리스트 가져오는 함수
  // 리스트 가져오기: 인자에 type/sort 라벨을 받을 수 있게
  const handleGetSongList = async ({
    page = 1,
    typeLabel = selectedTypeLabel,
    sortLabel = selectedSortLabel,
  } = {}) => {
    try {
      setIsPageLoading(true);

      const type = TYPE_MAP[typeLabel] ?? undefined; // 'song' | 'bgm' | undefined
      const sort = SORT_MAP[sortLabel] ?? undefined; // 'latest' | 'oldest' | 'vote_desc' | undefined

      const finalParams = {
        page,
        limit: itemsPerPage,
        ...(type && { type }),
        ...(sort && { sort }),
        ...(walletAddr && { wallet_address: walletAddr }),
      };

      console.log('[GET /popular/vote/song params]', finalParams);

      const res = await axios.get(`${serverAPI}/api/music/popular/vote/song`, {
        params: finalParams,
      });

      const list = res.data.data_list ?? [];
      const cnt = res.data.total_cnt ?? 0;

      console.log('신청된 곡 리스트 가져오기 완료!', list);
      setSongList(list);
      setSongCnt(cnt);
    } catch (error) {
      console.error('신청된 곡 리스트 가져오는 함수 error입니당', error);
      setSongList([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  // 남은 투표 가능 횟수 조회
  const handleRemainVoteCount = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/user/vote/cnt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cnt = res.data.cnt;
      console.log('남은 투표 가능 횟수 조회하기 완료!', cnt);
      setRemainVoteCnt(cnt);
    } catch (error) {
      console.error('남은 투표 가능 횟수 조회하기 error입니당', error);
    }
  };

  // 실패 detail → 내부 reason 매핑
  const mapDetailToReason = detail => {
    switch (detail) {
      case 'Already Vote Song':
        return 'already_voted';
      case 'No vote count':
        return 'no_vote_count';
      default:
        return 'unknown';
    }
  };

  // 곡 투표하는 함수
  const handleVoteSong = async songId => {
    try {
      const id = Number(songId);
      const res = await axios.post(`${serverAPI}/api/music/${id}/vote`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status === 'success') {
        await handleRemainVoteCount();
        await handleGetSongList({ page: currentPage });
        return { ok: true };
      }

      return { ok: false, reason: mapDetailToReason(res.data?.detail) };
    } catch (error) {
      const detail = error.response?.data?.detail;
      console.error('곡 투표하기 함수 error입니당', error);
      return { ok: false, reason: mapDetailToReason(detail) };
    }
  };

  // 곡 투표 제출하는 함수
  const handleVoteSubmit = async () => {
    if (!selectedSongId || isVoting) return;

    if (remainVoteCnt <= 0) {
      setShowConfirmModal(false);
      setShowNoVoteLeftModal(true);
      return;
    }

    setIsVoting(true);
    try {
      const result = await handleVoteSong(selectedSongId);

      if (result.ok) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        setShowConfirmModal(false);
        if (result.reason === 'no_vote_count') setShowNoVoteLeftModal(true);
        else if (result.reason === 'already_voted') setShowFailModal(true);
        else setShowFailModal(true);
      }
    } catch (e) {
      console.error('투표 제출 중 오류', e);
      setShowConfirmModal(false);
      setShowFailModal(true);
    } finally {
      setIsVoting(false);
    }
  };

  // 신청곡 추가 권한 유저 지갑주소 함수
  const handleGetMasterUserWallet = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/music/popular/vote/song/create/wallet/address`);
      console.log('유저 지갑주소 모음', res.data);
      setMasterUserWallet(res.data);
    } catch (err) {
      console.error('신청곡 추가 권한 유저 지갑주소 함수 error입니당', err);
    }
  };

  // 유저 지갑 주소에 따라서 마스터계정 유무 판별
  useEffect(() => {
    handleGetMasterUserWallet();
  }, [walletAddress]);

  // 마스터 유저 지갑주소 리스트에 현재 지갑이 있는지 판별 (대소문자/공백 정규화)
  const isMasterWallet =
    !!walletAddress &&
    masterUserWallet
      ?.map(v => (v?.address ?? v)?.toString().trim().toLowerCase())
      .includes((walletAddress?.address ?? walletAddress)?.toString().trim().toLowerCase());

  // 4. useEffect 수정 - currentPage가 변경될 때마다 API 호출
  // 신청된 곡 리스트 업데이트
  useEffect(() => {
    handleGetSongList({ page: currentPage });
  }, [currentPage, walletAddress]);

  const handleRegisterSelect = tracks => {
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
      artistName: 'Yolkhead',
    },
    {
      id: 2,
      albumImage: SampleAlbumImg,
      musicTitle: 'Music name',
      artistImage: SampleArtistImg,
      artistName: 'Yolkhead',
    },
    {
      id: 3,
      albumImage: SampleAlbumImg,
      musicTitle: 'Music name',
      artistImage: SampleArtistImg,
      artistName: 'Yolkhead',
    },
  ];
  return (
    <>
      <div className="vote-list-title">
        <h2 className="album__content-list__title">인기곡 투표</h2>
        {isMasterWallet && (
          <button
            className="register-btn"
            onClick={() => {
              console.log('지갑주소!!', walletAddress);
              setShowRegisterModal(true);
            }}
          >
            이벤트 음악 등록
          </button>
        )}
      </div>
      <Filter
        aiServiceFilter={true}
        songsSort={['Latest', 'Oldest']}
        onApply={params => {
          // params 예: { ai_service_filter: 'Song', songs_sort: 'Latest', page: 1, ... }
          const nextTypeLabel = params?.ai_service_filter ?? null; // 'Song' | 'BGM' | null
          const nextSortLabel = params?.songs_sort ?? 'Most Voted'; // 'Most Voted' | 'Latest' | 'Oldest'

          setSelectedTypeLabel(nextTypeLabel);
          setSelectedSortLabel(nextSortLabel);
          setCurrentPage(1);

          // 바로 조회 (라벨을 인자로 넘겨 안전하게)
          handleGetSongList({ page: 1, typeLabel: nextTypeLabel, sortLabel: nextSortLabel });
        }}
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
                        disabled={!isLoggedIn || item.voted_by_me || isVoting}
                        onVoteClick={() => {
                          setSelectedSongId(item.song_id); // 선택된 곡 ID 저장
                          setShowConfirmModal(true); // 모달 열기
                          handleRemainVoteCount(); // 남은 투표 횟수
                        }}
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
                  <span className="color-green">{remainVoteCnt}</span>회
                </b>{' '}
                투표할 수 있습니다.
              </p>
            </>
          }
          cancelMessage="취소"
          okMessage="투표"
          okHandler={handleVoteSubmit} // 투표 제출
          setShowConfirmModal={setShowConfirmModal}
          closeIcon={false}
          loading={isVoting}
        />
      )}
      {/* 투표 컨펌 모달 내 '투표' 클릭 후, 투표 완료 시 나오는 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          title="투표 완료!"
          content="소중한 한 표가 성공적으로 반영되었어요!"
          closeIcon={false}
          onClose={setShowSuccessModal}
        />
      )}
      {/* 투표 컨펌 모달 내 '투표' 클릭 후, 투표 오류 시 나오는 오류 모달 */}
      {showFailModal && (
        <SuccessModal
          title="통신 중 문제가 발생했어요."
          content="다시 시도해주세요."
          closeIcon={false}
          onClose={setShowFailModal}
        />
      )}
      {/* 출제곡 리스트 중 '투표하기' 클릭 시 나오는 투표 컨펌 모달 -> 유저의 남은 투표 횟수 0회일 경우 */}
      {showNoVoteLeftModal && (
        <SuccessModal
          title="투표 기회를 모두 소진하였어요."
          content="3회의 투표기회를 모두 소진하여 더 이상 투표할 수 없어요!"
          closeIcon={false}
          onClose={setShowNoVoteLeftModal}
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
  );
}

export default VoteList;
