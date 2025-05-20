import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NoneContent from '../../components/unit/NoneContent';
import { TableBody, TableHeader, Table, TableItem, TableWrapper } from '../table/TableCompositions';

import songTypeIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import { useTranslation } from 'react-i18next';

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
            <TableHeader.Indexs>#</TableHeader.Indexs>
            <TableHeader.Col>{t('Song')}</TableHeader.Col>
            <TableHeader.Col>{t('Type')}</TableHeader.Col>
            {gradeOption && <TableHeader.Col>{t('Grade')}</TableHeader.Col>}
            {nftOption && <TableHeader.Col>{t('NFT')}</TableHeader.Col>}
            {artistOption && <TableHeader.Col>{t('Artist')}</TableHeader.Col>}
            <TableHeader.Col>{t('Song Title')}</TableHeader.Col>
            {playsOption && <TableHeader.Col>{t('Plays')}</TableHeader.Col>}
            {likesOption && <TableHeader.Col>{t('Likes')}</TableHeader.Col>}
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
                    <TableItem.Text text={index + 1} />
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
                        handleClick={() => navigate(`/nft/sell/detail/${item.song_id}/${item.id}`)}
                      />
                    )}
                  </TableItem>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
        {songList.length <= 0 && (
          <NoneContent message={t('There are no songs created yet.')} height={300} />
        )}
      </TableWrapper>
    </>
  );
};

export default SongPlayTable;
