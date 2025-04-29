import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Search from '../components/unit/Search';

import loveIcon from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../assets/images/like-icon/like-icon-on.svg';
import playIcon from '../assets/images/album/play-icon.svg';

import defaultCoverImg from '../assets/images/intro/mob-album-cover.png';
import defaultUserImg from '../assets/images/header/logo-png.png';

// import track1 from '../assets/music/song01.mp3';
import track2 from '../assets/music/nisoft_song.mp3';

import AudioPlayer from 'react-h5-audio-player';

import '../styles/NftItemDetail.scss';
import { NftGraph } from '../components/nft/NftGraph';
import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
import axios from 'axios';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { AuthContext } from '../contexts/AuthContext';
import { formatUtcTime, formatLocalTime } from '../utils/getFormattedTime';
import SongPlayTable from '../components/table/SongPlayTable';
import Filter from '../components/unit/Filter';
import {
  getNftDetail,
  getNftOverview,
  getNftsHistory,
  getNftStatistics,
} from '../api/nfts/nftDetailApi';
import NftHistoryTable from '../components/table/NftHistoryTable';

const NftItemDetail = () => {
  const [selectCategory, setSelectCategory] = useState('Track Information');
  const [_, setSearchParams] = useSearchParams();
  const { id } = useParams();

  useEffect(() => {
    setSearchParams({});
  }, [selectCategory]);

  return (
    <div className="nft-item-detail">
      <NftItemDetailInfo id={id} />
      <Categories
        categories={['Track Information', 'Transaction Statistics', 'History']}
        value={selectCategory}
        onClick={setSelectCategory}
      />
      {selectCategory === 'Track Information' && <TrackInformation id={id} />}
      {selectCategory === 'Transaction Statistics' && <TransactionStatistics id={id} />}
      {selectCategory === 'History' && <History id={id} />}
    </div>
  );
};

export default NftItemDetail;

const NftItemDetailInfo = ({ id }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;

  const { token, walletAddress } = useContext(AuthContext);

  const [album, setAlbum] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isShareModal, setShareModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    setIsActive(prev => !prev);
  };

  const commentRef = useRef(null);

  const handleScrollToComment = () => {
    if (commentRef.current) {
      const offset = -100;
      const top = commentRef.current.getBoundingClientRect().top + window.scrollY + offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };
  // 앨범 관련 상태

  // 앨범 상세 정보 가져오기
  const fetchAlbumDetail = async () => {
    try {
      const response = await getNftDetail({ nft_id: id, wallet_address: walletAddress?.address });
      console.log('앨범 상세 정보:', response.data);
      setAlbum(response.data);
    } catch (error) {
      console.error('앨범 상세 정보 가져오기 에러:', error);
    }
  };
  useEffect(() => {
    fetchAlbumDetail();
  }, [id, walletAddress, token, serverApi]);

  // album 객체에 tags 문자열이 존재하는지 확인합니다.
  const tagString = album?.tags;
  // tags 문자열이 존재하면, 쉼표로 구분된 배열로 변환 후 불필요한 공백을 제거합니다.
  const tagArray = tagString
    ? tagString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    : [];

  // 좋아요 , 좋아요 취소 버튼 클릭
  const handleLike = async () => {
    console.log('id', id);
    try {
      if (album?.is_like) {
        await cancelLikeAlbum(id, token);
      } else {
        await likeAlbum(id, token);
      }
      fetchAlbumDetail();
    } catch (error) {
      console.error('좋아요 에러:', error);
    }
  };

  return (
    <>
      <div className="nft-item-detail-info-wrap">
        <p className="nft-item-detail-info-wrap__title">NFT Item Details</p>
        <section className="nft-item-detail__song-detail">
          {/* <p className="nft-item-detail__song-detail__title">Song Details</p> */}
          <div className="nft-item-detail__song-detail__bot">
            <div className="nft-item-detail__song-detail__left">
              <section className="album-detail__audio">
                <AudioPlayer
                  src={track2}
                  onPlay={() => {
                    console.log('PLAY!');
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    console.log('PAUSE!');
                    setIsPlaying(false);
                  }}
                  onEnded={() => {
                    console.log('ENDED!');
                    setIsPlaying(false);
                  }}
                />
                <p className={`album-detail__audio__cover ${isPlaying ? 'playing' : 'paused'}`}>
                  <img src={defaultCoverImg} alt="album cover" />
                </p>
              </section>
              <div
                className={`nft-item-detail__song-detail__left__img ${isActive ? 'active' : ''}`}
                onClick={handleClick}
              >
                {/* {album ? (
                                    <img src={album?.image || demoImg} alt="앨범 이미지" />
                                ) : (
                                    <div
                                        style={{
                                            backgroundColor: "black",
                                        }}
                                    />
                                )} */}
                {album ? (
                  <img src={album?.nft_image || defaultCoverImg} alt="앨범 이미지" />
                ) : (
                  <img src={defaultCoverImg} alt="기본 이미지" />
                )}
                <div className="nft-item-detail__song-detail__left__img__txt">
                  <pre>{album?.nft_lyrics}</pre>
                </div>
                <button className="nft-item-detail__song-detail__left__img__lyric-btn">
                  Lyrics
                </button>
              </div>
              <div className="nft-item-detail__song-detail__left__info">
                <div className="nft-item-detail__song-detail__left__info__number">
                  <p className="play">
                    <img src={playIcon} />
                    {album?.play_cnt || 0}
                  </p>
                  <p
                    className="love"
                    // onClick={handleLike}
                  >
                    <img src={album?.is_like ? halfHeartIcon : loveIcon} alt="love Icon" />
                    {album?.like || 0}
                  </p>
                  {/* <button className="comment" onClick={handleScrollToComment}>
                                        <img src={commentIcon} />
                                        {album?.comment_cnt || 0}
                                    </button> */}
                </div>
                {/* <button
                                    className="nft-item-detail__song-detail__left__info__share-btn"
                                    onClick={() => setShareModal(true)}
                                >
                                    <img src={shareIcon} />
                                </button> */}
              </div>
            </div>
            <div className="nft-item-detail__song-detail__right">
              <p className="nft-item-detail__song-detail__right__title">{album?.nft_name}</p>
              {/* <div className="nft-item-detail__song-detail__right__type">
                                {(tagArray.length > 0 ? tagArray : ['Pop', 'Rock', 'Electronic', 'Jazz']).map(
                                    (type, index) => (
                                        <div key={index} className="nft-item-detail__song-detail__right__type__item">
                                            {type}
                                        </div>
                                    )
                                )}
                            </div> */}
              <div className="nft-item-detail__song-detail__right__info-box">
                <dl>
                  <dt>Item ID</dt>
                  <dd>Item ID (# {album?.id})</dd>
                </dl>
                <dl>
                  <dt>Collection</dt>
                  <dd>{album?.connect_collection_name}</dd>
                </dl>
                <dl className="artist">
                  <dt>Artist</dt>
                  <dd>
                    <p className="user">
                      <img src={album?.user_profile || defaultUserImg} />
                      {album?.user_name || '-'}
                    </p>
                    {/* <Link className="see-more-btn" to="/my-page">
                                            See More
                                        </Link> */}
                  </dd>
                </dl>
                <dl
                  className={
                    album?.now_sales_status === '보관'
                      ? 'Unlisted'
                      : album?.now_sales_status === '판매중'
                      ? 'Listed'
                      : ''
                  }
                  // className="Listed"
                  // className="Sold"
                >
                  <dt>Sell Status</dt>
                  <dd>
                    {album?.now_sales_status === '보관' && 'Unlisted'}
                    {album?.now_sales_status === '판매중' && 'Listed'}
                  </dd>
                </dl>
                <dl>
                  <dt>Mint NFT date</dt>
                  <dd>{album?.create_dt}</dd>
                </dl>
                {/* <dl>
                                    <dt>Creation Data</dt>
                                    <dd>
                                        {formatUtcTime(album?.create_dt) || "-"}
                                        <span>{formatLocalTime(album?.create_dt)}</span>
                                    </dd>
                                </dl> */}
              </div>
              <div className="nft-item-detail__song-detail__right__value-box">
                {/* <dl>
                                    <dt>NFT Quantity</dt>
                                    <dd>10 / 100</dd>
                                </dl> */}
                <dl className="nft-item-detail__song-detail__right__value-box__price">
                  <dt>Price</dt>
                  <dd>
                    {album?.price} {album?.sales_token}
                    <span>$1,000</span>
                  </dd>
                </dl>
              </div>
              {/* <div className="nft-item-detail__song-detail__right__time-box">
                <p className="nft-item-detail__song-detail__right__time-box__title">
                  Sale End Date
                </p>
                <p className="nft-item-detail__song-detail__right__time-box__utc">
                  Sat, 04 Nov 2023 14:40:00 UTC+9
                </p>
                <p className="nft-item-detail__song-detail__right__time-box__end">
                  Time Remaining Until End
                </p>
                <div className="nft-item-detail__song-detail__right__time-box__time">
                  <p>00</p>
                  <span>:</span>
                  <p>00</p>
                  <span>:</span>
                  <p>00</p>
                </div>
              </div> */}
              <div className="nft-item-detail__song-detail__right__btn-box">
                {!album?.is_owner && album?.now_sales_status === '판매중' && (
                  <button className="nft-item-detail__song-detail__right__btn-box__btn">
                    Buy NFT
                  </button>
                )}
                {album?.is_owner && album?.now_sales_status === '보관' && (
                  <button className="nft-item-detail__song-detail__right__btn-box__btn sell-nft">
                    Sell NFT
                  </button>
                )}
                {album?.is_owner && album?.now_sales_status === '판매중' && (
                  <button className="nft-item-detail__song-detail__right__btn-box__btn cancel-nft">
                    Cancel NFT
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const TrackInformation = ({ id }) => {
  const [activityData, setActivityData] = useState();

  const getActivityData = async () => {
    try {
      const res = await getNftOverview({ nft_id: id });
      setActivityData(res.data);
    } catch (e) {
      console.error(e, '에러!');
    }
  };

  useEffect(() => {
    getActivityData();
  }, []);

  return (
    <>
      <ContentWrap title="Activity">
        <NftOverview title="Content Information">
          <NftOverviewItem title="Tags" value={activityData?.nft_tags || '-'} isLong />
          <NftOverviewItem
            title="Creation Date"
            value={activityData?.nft_song_create_dt || '-'}
            isLong
          />
          <NftOverviewItem title="Type" value="Lyrics + Songwriting" isTwo typeImg />
          <NftOverviewItem title="Language" value={activityData?.nft_language || '-'} isTwo />
          <NftOverviewItem title="Genre" value={activityData?.genre || '-'} />
          <NftOverviewItem title="Gender" value={activityData?.nft_gender || '-'} />
          <NftOverviewItem
            title="Musical Instrument"
            value={activityData?.nft_musical_instrument || '-'}
          />
          <NftOverviewItem title="Tempo" value={activityData?.nft_tempo || '-'} />
          <NftOverviewItem title="Detail" value={activityData?.nft_detail || '-'} />
          <NftOverviewItem title="Song Length" value={activityData?.song_length || '-'} />
        </NftOverview>
      </ContentWrap>
      <ContentWrap title="Recommended NFTs">
        <NftItemList data={activityData?.recommand_list} />
      </ContentWrap>
    </>
  );
};

const TransactionStatistics = ({ id }) => {
  const [statisticsData, setStatisticsData] = useState();

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const res = await getNftStatistics({ nft_id: id });
        setStatisticsData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStatisticsData();
  }, []);

  return (
    <ContentWrap title="Transaction Statistics">
      <NftOverview title="Key Information Related to Transactions">
        <NftOverviewItem
          title="Price"
          value={statisticsData?.price?.toLocaleString() || '-'}
          isTwo
        />
        <NftOverviewItem
          title="Recent Transaction Date"
          value={statisticsData?.last_transaction_date || '-'}
          isTwo
        />
      </NftOverview>
      <NftOverview title="Transaction Statistics">
        <NftOverviewItem
          title="Number of Transactions"
          value={statisticsData?.transaction_cnt?.toLocaleString() || '-'}
          isTwo
        />
        <NftOverviewItem
          title="Total Volume"
          value={`${statisticsData?.total_price?.toLocaleString() || '-'} ${
            statisticsData?.sales_token || ''
          }`}
          isTwo
        />
        <NftOverviewItem
          title="Average Price"
          value={`${statisticsData?.avg_price?.toLocaleString() || '-'} ${
            statisticsData?.sales_token || ''
          }`}
        />
        <NftOverviewItem
          title="Highest Price"
          value={`${statisticsData?.max_price?.toLocaleString() || '-'} ${
            statisticsData?.sales_token || ''
          }`}
        />
        <NftOverviewItem
          title="Lowest Price"
          value={`${statisticsData?.min_price?.toLocaleString() || '-'} ${
            statisticsData?.sales_token || ''
          }`}
        />
      </NftOverview>
      <ContentWrap title="Graph List">
        <NftGraph
          barGraphData={statisticsData?.transaction_cnt_progress}
          lineGraphData={statisticsData?.transaction_price_progress}
        />
      </ContentWrap>
    </ContentWrap>
  );
};

const History = ({ id }) => {
  const [historyData, setHistoryData] = useState();
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const nftSort = searchParams.get('nft_sort');
  const tokenFilter = searchParams.get('token_filter');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const res = await getNftsHistory({
          nft_id: id,
          page,
          sort_by: nftSort,
          search_keyword: search,
          sales_token: tokenFilter,
        });
        console.log(res.data, '배고픔');
        setHistoryData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistoryData();
  }, [page, search, tokenFilter, nftSort, id]);

  return (
    <ContentWrap title="Information">
      {/* <InfoRowWrap row={3}>
                <InfoRowWrap.UserItem
                    title="Most Purchased Artist"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Highest Bidding Artist"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
                <InfoRowWrap.UserItem
                    title="Most Recently Traded Artist"
                    value={{ picture: dummy_userImage, username: 'YolkHead' }}
                />
            </InfoRowWrap> */}
      <ContentWrap.SubWrap gap={8}>
        <Filter tokenFilter={true} nftSort={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      {/* <CustomTable
        data={historyData?.data_list}
        headers={['#', ' Artist Name', 'Price', 'Transaction Date']}
      /> */}
      <NftHistoryTable data={historyData?.data_list || []} />
      {/* <SongPlayTable
        songList={[]}
        likesOption={true}
        playsOption={true}
        artistOption={false}
        mintOption={true}
        gradeOption={true}
        handleMint={() => null}
      /> */}

      <Pagination totalCount={historyData?.total_cnt} viewCount={10} page={page} />
    </ContentWrap>
  );
};
