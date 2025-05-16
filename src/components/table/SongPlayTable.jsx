import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NoneContent from '../../components/unit/NoneContent';
import { TableBody, TableHeader, Table, TableItem, TableWrapper } from '../table/TableCompositions';

import songTypeIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';

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
  const [activeSong, setActiveSong] = useState(null);
  const navigate = useNavigate();
  let triggerIndex = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!activeSong) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.src = activeSong?.music_url || activeSong?.nft_music_url;
      audioRef.current.play();
    }
  }, [activeSong]);

  useEffect(() => {
    if (isTrigger === true) {
      setActiveSong(songList[0]);
    } else {
      setActiveSong(null);
    }
  }, [isTrigger]);

  console.log(songList, '리스트 데이터');

  return (
    <>
      <div className="audio-container" style={{ display: 'none' }}>
        <audio
          controls
          ref={audioRef}
          onEnded={() => {
            if (isContinue) {
              setActiveSong(
                songList[++triggerIndex.current] ? songList[triggerIndex.current] : songList[0]
              );
            } else {
              setActiveSong(null);
            }
          }}
        />
      </div>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableHeader.Col>#</TableHeader.Col>
            <TableHeader.Col>Song</TableHeader.Col>
            <TableHeader.Col>Type</TableHeader.Col>
            {gradeOption && <TableHeader.Col>Grade</TableHeader.Col>}
            {nftOption && <TableHeader.Col>NFT</TableHeader.Col>}
            {artistOption && <TableHeader.Col>Artist</TableHeader.Col>}
            <TableHeader.Col>Song Title</TableHeader.Col>
            {playsOption && <TableHeader.Col>Plays</TableHeader.Col>}
            {likesOption && <TableHeader.Col>Likes</TableHeader.Col>}
            <TableHeader.Col>Details</TableHeader.Col>
            {deleteOption && <TableHeader.Col>Delete</TableHeader.Col>}
            {releaseOption && <TableHeader.Col>Release</TableHeader.Col>}
            {mintOption && <TableHeader.Col>NFT Mint</TableHeader.Col>}
            {sellOption && <TableHeader.Col>Sell NFT</TableHeader.Col>}
          </TableHeader>
          <TableBody>
            {songList &&
              songList.length > 0 &&
              songList.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableItem
                    isHover={true}
                    handleClick={() => {
                      if (activeSong?.id === item?.id) {
                        setActiveSong(null);
                      } else {
                        setActiveSong(item);
                        if (isTrigger && setIsTrigger) {
                          triggerIndex.current = index;
                        }
                      }
                    }}
                  >
                    <TableItem.Indexs text={index + 1} />
                    <TableItem.Song
                      image={
                        item.cover_image?.replace('public', '140to140') ||
                        item.nft_image?.replace('public', '140to140')
                      }
                      active={item?.id === activeSong?.id}
                      width={40}
                    />
                    <TableItem.Type image={songTypeIcon} />
                    {gradeOption && <TableItem.Grade grade={item.rating} />}
                    {nftOption && <TableItem.Text text={item.is_nft ? 'NFT' : '-'} />}
                    {artistOption && <TableItem.UserInfo image={item.profile} name={item.name} />}
                    <TableItem.Text text={item.title || item.nft_name} />
                    {playsOption && <TableItem.Text text={item.play_cnt?.toLocaleString()} />}
                    {likesOption && <TableItem.Text text={item.like?.toLocaleString()} />}

                    <TableItem.Button
                      title="Details"
                      type="details"
                      handleClick={() => navigate(`/song-detail/${item?.song_id || item?.id} `)}
                    />

                    {deleteOption && handleDelete && (
                      <TableItem.Button
                        title="Delete"
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
                        title="Release"
                        type="release"
                        handleClick={e => {
                          e.stopPropagation();
                          handleRelease(item);
                        }}
                      />
                    )}

                    {mintOption && handleMint && (
                      <TableItem.Button
                        title="Mint"
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
                        title="Sell"
                        type="sell"
                        handleClick={() => navigate(`/nft/sell/detail/${item.song_id}/${item.id}`)}
                      />
                    )}
                  </TableItem>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
        {songList.length <= 0 && (
          <NoneContent message={'There are no songs created yet.'} height={300} />
        )}
      </TableWrapper>
    </>
  );
};

export default SongPlayTable;
