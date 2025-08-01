import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import NoneContent from '../../components/unit/NoneContent';
import { TableBody, TableHeader, Table, TableItem, TableWrapper } from '../table/TableCompositions';
import { useAudio } from '../../contexts/AudioContext';

import { useTranslation } from 'react-i18next';

import SongAddAlbumModal from '../mypage/albumsAndCollectionsComponents/modals/SongAddAlbumModal';

/**
 *
 * @param {Array} songList : 곡의 데이터 리스트입니다.
 * @param {boolean} deleteOption : 삭제 옵션
 * @param {function} handleDelete : 삭제 핸들러
 * @param {boolean} releaseOption : 릴리즈 옵션
 * @param {function} handleRelease : 릴리즈 핸들러
 * @param {boolean} mintOption : 민트 옵션
 * @param {function} handleMint : 민트 핸들러
 * @param {boolean} sellOption : 판매 옵션
 * @param {function} handleSell : 판매 핸들러
 * @param {boolean} likesOption : 좋아요 수 표시 여부
 * @param {boolean} playsOption : 플레이 수 표시 여부
 * @param {boolean} artistOption : 아티스트 표시 여부
 *
 * @param {boolean} isContinue : 자동 재생 여부
 * @param {boolean} isScroll : 스크롤옵션
 * @param {boolean} isTrigger : 자동 재생 트리거
 * @param {function} setIsTrigger : 자동 재생 트리거 핸들러
 * @returns
 */
const SongPlayTable = ({
  songList = [],
  //== 삭제
  deleteOption,
  handleDelete,
  //== 릴리즈
  releaseOption,
  handleRelease,
  //== 민트
  mintOption,
  handleMint,
  //== 셀
  sellOption,
  handleSell,
  //== 좋아요
  likesOption,
  //== 플레이
  playsOption,
  //== 아티스트
  artistOption = true,

  //== 등급
  gradeOption,
  //== NFT 여부
  nftOption,

  //== 그외 옵션
  isContinue = true,
  isScroll,
  isTrigger,
  setIsTrigger,
}) => {
  const { t } = useTranslation('module');
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');

  // AudioContext 사용
  const { currentTrack, playTrack, togglePlayPause, isTrackActive } = useAudio();

  let triggerIndex = useRef(0);

  // 테이블 전용 playlist ID
  const tablePlaylistId = 'song-table';

  useEffect(() => {
    if (isTrigger === true && songList.length > 0) {
      // 첫 번째 곡 자동 재생
      const firstSong = songList[0];
      playTrack({
        track: {
          ...firstSong,
          music_url: firstSong?.music_url || firstSong?.nft_music_url,
        },
        playlist: songList,
        playlistId: tablePlaylistId,
        continuePlay: isContinue,
      });
      triggerIndex.current = 0;
    }

    // ✅ Stop 버튼 눌렀을 때 정지
    if (isTrigger === false) {
      togglePlayPause(false); // 또는 stopTrack() 등 명시적 정지 함수가 있다면 그것 사용
    }
  }, [isTrigger, songList]);

  // 곡 클릭 핸들러
  const handleSongClick = (item, index) => {
    const isCurrentlyActive = isTrackActive(item, tablePlaylistId);

    if (isCurrentlyActive) {
      // 현재 재생 중인 곡이면 재생/일시정지 토글
      togglePlayPause();
    } else {
      // 다른 곡이면 새로 재생
      playTrack({
        track: {
          ...item,
          music_url: item?.music_url || item?.nft_music_url,
        },
        playlist: songList,
        playlistId: tablePlaylistId,
        continuePlay: isContinue,
      });
      if (isTrigger && setIsTrigger) {
        triggerIndex.current = index;
      }
    }
  };

  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <>
      {/* 자체 오디오 엘리먼트 제거 - AudioContext에서 관리 */}
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableHeader.Indexs>#</TableHeader.Indexs>
            <TableHeader.Col>{t('Song')}</TableHeader.Col>
            <TableHeader.Col>{t('Type')}</TableHeader.Col>
            {gradeOption && <TableHeader.Col>{t('Grade')}</TableHeader.Col>}
            {nftOption && <TableHeader.Col>{t('NFT')}</TableHeader.Col>}
            {artistOption && <TableHeader.Col>{t('Artist')}</TableHeader.Col>}
            <TableHeader.Col>{t('Song Title')}</TableHeader.Col>
            {playsOption && <TableHeader.Col>{t('Plays')}</TableHeader.Col>}
            {likesOption && <TableHeader.Col>{t('Likes')}</TableHeader.Col>}
            {/* Add Album (테이블에서 버튼 추가) */}
            <TableHeader.Col>{t('Add Album')}</TableHeader.Col>
            <TableHeader.Col>{t('Details')}</TableHeader.Col>
            {deleteOption && <TableHeader.Col>{t('Delete')}</TableHeader.Col>}
            {releaseOption && <TableHeader.Col>{t('Release')}</TableHeader.Col>}
            {mintOption && <TableHeader.Col>{t('NFT Mint')}</TableHeader.Col>}
            {sellOption && <TableHeader.Col>{t('Sell NFT')}</TableHeader.Col>}
          </TableHeader>
          <TableBody>
            {songList &&
              songList.length > 0 &&
              songList.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableItem isHover={true} handleClick={() => handleSongClick(item, index)}>
                    <TableItem.Text text={index + 1} />
                    <TableItem.Song
                      image={
                        item.cover_image?.replace('public', '140to140') ||
                        item.nft_image?.replace('public', '140to140')
                      }
                      active={isTrackActive(item, tablePlaylistId)}
                      width={40}
                    />
                    <TableItem.AiServiceType service={item?.ai_service} />
                    {gradeOption && <TableItem.Grade grade={item.rating} />}
                    {nftOption && <TableItem.Text text={item.is_nft ? 'NFT' : '-'} />}
                    {artistOption && <TableItem.UserInfo image={item.profile} name={item.name} />}
                    <TableItem.Text text={item.title || item.nft_name} />
                    {playsOption && <TableItem.Text text={item.play_cnt?.toLocaleString()} />}
                    {likesOption && <TableItem.Text text={item.like?.toLocaleString()} />}

                    {/* Add Album 버튼 추가 */}
                    <TableItem.Button
                      title={t('Add')}
                      type="add"
                      handleClick={e => {
                        e.stopPropagation(); // 테이블 row 클릭 방지
                        setSelectedSong(item); // 선택한 곡 정보 저장
                        setShowAddAlbumModal(true); // 모달 오픈
                      }}
                    />

                    <TableItem.Button
                      title={t('Details')}
                      type="details"
                      handleClick={() => navigate(`/song-detail/${item?.song_id || item?.id} `)}
                    />

                    {deleteOption && handleDelete && (
                      <TableItem.Button
                        title={t('Delete')}
                        type="delete"
                        disabled={item.is_nft}
                        handleClick={e => {
                          e.stopPropagation();
                          handleDelete(item);
                        }}
                      />
                    )}

                    {releaseOption && handleRelease && (
                      <TableItem.Button
                        title={t('Release')}
                        type="release"
                        handleClick={e => {
                          e.stopPropagation();
                          handleRelease(item);
                        }}
                      />
                    )}

                    {mintOption && handleMint && (
                      <TableItem.Button
                        title={t('Mint')}
                        type="mint"
                        disabled={item.is_nft}
                        handleClick={e => {
                          e.stopPropagation();
                          handleMint(item);
                        }}
                      />
                    )}

                    {sellOption && handleSell && (
                      <TableItem.Button
                        title={t('Sell')}
                        type="sell"
                        handleClick={() => navigate(`/nft/sell/details/${item.song_id}/${item.id}`)}
                      />
                    )}
                  </TableItem>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
        {songList.length <= 0 && (
          <NoneContent message="There are no songs created yet." height={300} />
        )}
      </TableWrapper>
      {showAddAlbumModal && selectedSong && (
        <SongAddAlbumModal
          song={selectedSong}
          token={authToken}
          onClose={() => {
            setShowAddAlbumModal(false);
            setSelectedSong(null);
          }}
        />
      )}
    </>
  );
};

export default SongPlayTable;
