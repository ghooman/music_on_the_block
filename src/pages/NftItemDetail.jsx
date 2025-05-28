import React, { useState, useEffect, useRef, useContext, use } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import Search from '../components/unit/Search';
import NftConfirmModal from '../components/NftConfirmModal';

import loveIcon from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../assets/images/like-icon/like-icon-on.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import grade1Icon from '../assets/images/icon/grade-icon/Grade01-icon.svg';
import shareIcon from '../assets/images/album/share-icon.svg';
import moreIcon from '../assets/images/icon/more_horiz-icon.svg';
import copyIcon from '../assets/images/icon/content_copy-icon.svg';
import checkIcon from '../assets/images/icon/check-icon.svg';
import defaultCoverImg from '../assets/images/intro/mob-album-cover.png';
import defaultUserImg from '../assets/images/header/logo-png.png';
import downloadIcon from '../assets/images/icon/download-icon.svg';

import AudioPlayer from 'react-h5-audio-player';

import '../styles/NftItemDetail.scss';
import { NftGraph } from '../components/nft/NftGraph';
import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';
import { AuthContext } from '../contexts/AuthContext';
import { formatLocalTime } from '../utils/getFormattedTime';

import Filter from '../components/unit/Filter';
import {
  getNftDetail,
  getNftOverview,
  getNftsHistory,
  getNftStatistics,
  getNftTransactions,
} from '../api/nfts/nftDetailApi';
import NftHistoryTable from '../components/table/NftHistoryTable';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { WalletConnect } from '../components/WalletConnect';
import ShareModal from '../components/ShareModal';
import { getSongsGradeIcon } from '../utils/getGradeIcon';
import { useTranslation } from 'react-i18next';

import TransactionsModal from '../components/TransactionsModal';
import DownloadModal from '../components/DownloadModal';
import { musicDownload } from '../utils/musicDownload';
const NftItemDetail = () => {
  const { t } = useTranslation('nft_marketplace');

  const [selectCategory, setSelectCategory] = useState('Track Information');
  const [_, setSearchParams] = useSearchParams();

  const { id } = useParams();

  useEffect(() => {
    setSearchParams({}, { replace: true });
  }, [selectCategory]);

  return (
    <div className="nft-item-detail">
      <NftItemDetailInfo id={id} t={t} />
      <Categories
        categories={['Track Information', 'Transaction Statistics', 'History']}
        value={selectCategory}
        onClick={setSelectCategory}
        translateFn={t}
      />
      {selectCategory === 'Track Information' && <TrackInformation id={id} t={t} />}
      {selectCategory === 'Transaction Statistics' && <TransactionStatistics id={id} t={t} />}
      {selectCategory === 'History' && <History id={id} t={t} />}
    </div>
  );
};

export default NftItemDetail;

const NftItemDetailInfo = ({ id, t }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelNft, setCancelNft] = useState(null);
  const [nftAction, setNftAction] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const [isShareModal, setIsShareModal] = useState(false);
  const [isDownloadModal, setIsDownloadModal] = useState(false);
  const [isTransactionsModal, setIsTransactionsModal] = useState(false);
  const { token, walletAddress, isLoggedIn, setIsLoggedIn, setWalletAddress } =
    useContext(AuthContext);

  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const walletConnectRef = React.useRef(null);

  const handleClick = () => {
    setIsActive(prev => !prev);
  };

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = (e, action) => {
    if (!isLoggedIn) {
      e.preventDefault();

      // 로그인이 필요한 경우 WalletConnect 모달 열기
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          walletConnectButton.click();
        }
      }
      return;
    }

    // 로그인된 경우 원래 동작 실행
    switch (action) {
      case 'buy':
        // navigate(`/mint/detail/${nftDetailData?.song_id}/${nftDetailData?.id}/buy`);
        setNftAction(action);
        break;
      case 'sell':
        navigate(`/nft/sell/details/${nftDetailData?.song_id}/${nftDetailData?.id}`);
        break;
      case 'cancel':
        // setCancelNft(true);
        setNftAction(action);
        break;
      default:
        break;
    }
  };

  // useEffect를 사용하여 ThirdWeb 버튼을 참조
  useEffect(() => {
    // 컴포넌트가 마운트된 후에 참조할 수 있도록 약간의 지연 추가
    const timer = setTimeout(() => {
      if (walletConnectRef.current) {
        const walletConnectButton = walletConnectRef.current.querySelector('.tw-connect-wallet');
        if (walletConnectButton) {
          // 버튼 스타일 설정
          walletConnectButton.style.position = 'absolute';
          walletConnectButton.style.opacity = '0';
          walletConnectButton.style.pointerEvents = 'none';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // nft 데이터 가져오기
  const { data: nftDetailData, refetch: nftDetailRefetch } = useQuery(
    ['nft_detail_data', id, walletAddress?.address],
    () => getNftDetail({ nft_id: id, wallet_address: walletAddress?.address }),
    {
      enabled: !!id,
    }
  );

  console.log('nftDetailData', nftDetailData);

  // txid 가져오기
  const {
    data: txidData,
    isLoading: isTxidLoading,
    error: txidError,
  } = useQuery(
    ['nft_txid_data', nftDetailData?.song_id],
    () => getNftTransactions(nftDetailData.song_id),
    {
      enabled: !!nftDetailData?.song_id, // song_id가 생길 때만 실행
    }
  );

  const handleLikes = async () => {
    if (!nftDetailData?.is_like) {
      return await likeAlbum(nftDetailData?.song_id, token);
    } else {
      return await cancelLikeAlbum(nftDetailData?.song_id, token);
    }
  };

  const mutate = useMutation(handleLikes, {
    onSuccess: () => {
      queryClient.setQueryData(['nft_detail_data', id, walletAddress?.address], prev => {
        if (prev.is_like === false) {
          prev.like = ++prev.like;
        } else {
          prev.like = --prev.like;
        }
        prev.is_like = !prev.is_like;
        return prev;
      });
    },
    onError: e => {
      console.log(e);
    },
  });

  const likeHandler = e => {
    e.preventDefault();
    mutate?.mutate();
  };

  console.log(nftDetailData, 'nft detail data');

  // transactions modal 오픈
  const handleTransactionsModal = () => {
    setIsTransactionsModal(true);
  };

  const [album, setAlbum] = useState(null);
  console.log('album', album);
  const [copied, setCopied] = useState(false);
  const [isActiveMore, setIsActiveMore] = useState(false);

  const handleToggle = () => {
    setIsActiveMore(prev => !prev);
  };

  const handleCloseMenu = e => {
    e.stopPropagation();
    setIsActiveMore(false);
  };

  const copyToClipboard = e => {
    e.stopPropagation();

    const textToCopy = `${window.location.href}\n\nTitle: ${nftDetailData?.nft_name}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setIsActiveMore(false);
        }, 1500);
      })
      .catch(console.error);
  };

  // 음원 다운로드
  const handleDownloadClick = async e => {
    e.stopPropagation();
    if (nftDetailData?.is_owner) {
      try {
        await musicDownload({ token, id: nftDetailData?.song_id, title: nftDetailData.nft_name });
      } catch (error) {
        alert('A server error occurred. Please try again later.');
        console.error(error);
      }
    } else {
      setIsDownloadModal(true);
    }
  };

  return (
    <>
      {/* 숨겨진 WalletConnect 컴포넌트 */}
      <div
        ref={walletConnectRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          visibility: 'hidden',
        }}
      >
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      <div className="nft-item-detail-info-wrap">
        <p className="nft-item-detail-info-wrap__title">
          {t('NFT Item Details')}
          <span>{t('L&S One (V1.0)')}</span>
        </p>
        <section className="nft-item-detail__song-detail">
          <div className="nft-item-detail__song-detail__bot">
            <div className="nft-item-detail__song-detail__left">
              <section className="album-detail__audio">
                <AudioPlayer
                  src={nftDetailData?.nft_music_url}
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
                  <img src={nftDetailData?.nft_image} alt="album cover" />
                </p>
              </section>
              <div
                className={`nft-item-detail__song-detail__left__img ${isActive ? 'active' : ''}`}
                onClick={handleClick}
              >
                {nftDetailData ? (
                  <img
                    src={nftDetailData?.nft_image?.replace('public', '400to400') || defaultCoverImg}
                    alt="앨범 이미지"
                  />
                ) : (
                  <img src={defaultCoverImg} alt="기본 이미지" />
                )}
                {nftDetailData?.ai_service !== 0 && (
                  <>
                    <div className="nft-item-detail__song-detail__left__img__txt">
                      <pre>
                        {nftDetailData?.nft_lyrics
                          // 1. "###"와 그 이후 공백을 제거
                          ?.replace(/#\s*/g, '')
                          ?.replace(/###\s*/g, '')
                          // 2. "**"로 감싼 텍스트 제거 (필요 시 개행 처리 등 별도 조정 가능)
                          ?.replace(/(\*\*.*?\*\*)/g, '')
                          // 3. 대괄호([]) 안 텍스트 제거
                          ?.replace(/\[([^\]]+)\]/g, '')
                          // 4. 소괄호 안 텍스트 처리:
                          //    - (Verse 1), (Pre-Chorus) 등 키워드가 있으면 괄호를 제거하고 텍스트만 남김
                          //    - 그 외의 경우에는 내용 자체를 제거
                          ?.replace(/\(([^)]+)\)/g, (match, p1) => {
                            if (
                              /^(?:\d+\s*)?(?:Verse|Pre-Chorus|Chorus|Bridge|Hook|Outro|Intro)(?:\s*\d+)?$/i.test(
                                p1.trim()
                              )
                            ) {
                              return p1.trim();
                            }
                            return '';
                          })
                          // 5. "Verse", "Pre-Chorus", "Chorus", "Bridge" 등 앞에 줄바꿈과 띄어쓰기를 추가
                          ?.replace(
                            /((?:\d+\s*)?(?:Verse|Pre-Chorus|Chorus|Bridge|Hook|Outro|Intro)(?:\s*\d+)?)/gi,
                            '\n$1'
                          )
                          ?.trim()}
                      </pre>
                    </div>
                    <button className="nft-item-detail__song-detail__left__img__lyric-btn">
                      {t('Lyrics')}
                    </button>
                  </>
                )}
              </div>
              <div className="nft-item-detail__song-detail__left__info">
                <div className="nft-item-detail__song-detail__left__info__number">
                  <p className="play">
                    <img src={playIcon} alt="play" />
                    {nftDetailData?.play_cnt || 0}
                  </p>
                  <p className="love" onClick={likeHandler}>
                    <img src={nftDetailData?.is_like ? halfHeartIcon : loveIcon} alt="love Icon" />
                    {nftDetailData?.like || 0}
                  </p>
                  <p className={`nfts ${nftDetailData?.rating}`}>
                    {getSongsGradeIcon(nftDetailData?.rating) && (
                      <img src={getSongsGradeIcon(nftDetailData?.rating)} alt="icon" />
                    )}
                    <div className="nfts-section"></div>
                    <p className="nfts-text">NFT</p>
                  </p>
                </div>
                <div className="nft-item-detail__song-detail__left__info__btn-box">
                  {/* <button
                    className="nft-item-detail__song-detail__left__info__txid-btn"
                    onClick={handleTransactionsModal}
                  >
                    TXID
                  </button>
                  <button
                    className="nft-item-detail__song-detail__left__info__dow-btn"
                  >
                    download
                    <img src={downloadIcon} alt='downloadIcon'/>
                  </button>
                  <button className="share" onClick={() => setIsShareModal(true)}>
                    <img src={shareIcon} alt="share" />
                  </button> */}
                  <button
                    className={`nft-item-detail__song-detail__more-btn ${
                      isActiveMore ? 'active' : ''
                    }`}
                    onClick={handleToggle}
                  >
                    <img src={moreIcon} alt="moreIcon" />
                    <ul className="nft-item-detail__song-detail__more-btn__list">
                      <li onClick={copyToClipboard}>
                        {!copied ? (
                          <>
                            Copy Link <img src={copyIcon} />
                          </>
                        ) : (
                          <>
                            Copied Link <img src={checkIcon} />
                          </>
                        )}
                      </li>
                      <li
                        onClick={e => {
                          handleCloseMenu(e);
                          handleDownloadClick(e);
                        }}
                      >
                        Download <img src={downloadIcon} />
                      </li>
                      <li
                        onClick={e => {
                          handleCloseMenu(e);
                          handleTransactionsModal();
                        }}
                      >
                        TXIDs
                      </li>
                    </ul>
                  </button>
                </div>
              </div>
            </div>
            <div className="nft-item-detail__song-detail__right">
              <p className="nft-item-detail__song-detail__right__title">
                {nftDetailData?.nft_name}
              </p>
              <div className="nft-item-detail__song-detail__right__info-box">
                <dl className="artist">
                  <dt>{t('Artist')}</dt>
                  <dd>
                    <p className="user">
                      <img src={nftDetailData?.user_profile || defaultUserImg} alt="profile" />
                      {nftDetailData?.user_name || '-'}
                    </p>
                    {/* <Link className="see-more-btn" to="/my-page">
                                            See More
                                        </Link> */}
                  </dd>
                </dl>
                <dl>
                  <dt>{t('Type')}</dt>
                  <dd>
                    {nftDetailData?.ai_service === 0
                      ? 'BGM'
                      : nftDetailData?.ai_service === 1
                      ? 'Song'
                      : '-'}
                  </dd>
                </dl>
                <dl>
                  <dt>{t('Item ID')}</dt>
                  <dd># {nftDetailData?.id}</dd>
                </dl>
                <dl>
                  <dt>{t('Collection')}</dt>
                  <dd>{nftDetailData?.connect_collection_name || '-'}</dd>
                </dl>

                <dl
                  className={nftDetailData?.now_sales_status}
                  // className="Listed"
                  // className="Sold"
                >
                  <dt>{t('Sell Status')}</dt>
                  <dd>{nftDetailData?.now_sales_status}</dd>
                </dl>
                <dl>
                  <dt>{t('Mint NFT date')}</dt>
                  <dd>{formatLocalTime(nftDetailData?.create_dt)}</dd>
                </dl>
              </div>
              <div className="nft-item-detail__song-detail__right__value-box">
                <dl className="nft-item-detail__song-detail__right__value-box__price">
                  <dt>{t('Price')}</dt>
                  <dd>
                    {nftDetailData?.price
                      ? `${nftDetailData?.price} ${nftDetailData?.sales_token}`
                      : '-'}
                    {/* {nftDetailData?.price && <span>$ {nftDetailData.price * 0.03}</span>} */}
                  </dd>
                </dl>
              </div>

              {nftDetailData && (
                <div className="nft-item-detail__song-detail__right__btn-box">
                  {!nftDetailData?.is_owner && nftDetailData?.now_sales_status === 'Unlisted' && (
                    <button
                      className="nft-item-detail__song-detail__right__btn-box__btn unlisted-nft"
                      onClick={e => null}
                    >
                      {t('Unlisted')}
                    </button>
                  )}
                  {!nftDetailData?.is_owner && nftDetailData?.now_sales_status === 'Listed' && (
                    <button
                      className="nft-item-detail__song-detail__right__btn-box__btn"
                      onClick={e => handleButtonClick(e, 'buy')}
                    >
                      {t('Buy NFT')}
                    </button>
                  )}
                  {nftDetailData?.is_owner && nftDetailData?.now_sales_status === 'Unlisted' && (
                    <button
                      className="nft-item-detail__song-detail__right__btn-box__btn sell-nft"
                      onClick={e => handleButtonClick(e, 'sell')}
                    >
                      {t('Sell NFT')}
                    </button>
                  )}
                  {nftDetailData?.is_owner && nftDetailData?.now_sales_status === 'Listed' && (
                    <button
                      className="nft-item-detail__song-detail__right__btn-box__btn cancel-nft"
                      onClick={e => handleButtonClick(e, 'cancel')}
                    >
                      {t('Cancel NFT')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      {nftAction && (
        <NftConfirmModal
          setShowModal={setNftAction}
          setShowSuccessModal={setCancelSuccess}
          title="Confirm"
          confirmBuyTxt={nftAction === 'buy'}
          confirmSellTxt={nftAction === 'sell'}
          confirmMintTxt={nftAction === 'mint'}
          confirmCancelTxt={nftAction === 'cancel'}
          nftId={nftDetailData.id}
          nftName={nftDetailData.nft_name}
          nftData={nftDetailData}
          listingId={nftDetailData?.listing_id}
          // onSuccess={() => {
          //   if (nftAction === 'buy') {
          //     // 구매 성공 후 바로 페이지 이동하지 않고, 성공 모달이 표시되도록 변경
          //     // navigate(`/my-page?category=NFTs&tab=History&page=1`);
          //     // 성공 모달이 닫힐 때 NftConfirmSuccessModal 내부에서 페이지 이동 처리
          //     return;
          //   }

          //   setCancelSuccess(false);
          //   nftDetailRefetch();
          // }}
        />
      )}
      {isShareModal && (
        <ShareModal
          setShareModal={setIsShareModal}
          shareUrl={window.location.href}
          title={nftDetailData?.title}
        />
      )}
      {isTransactionsModal && (
        <TransactionsModal setTransactionsModal={setIsTransactionsModal} txidData={txidData} />
      )}
      {isDownloadModal && (
        <DownloadModal
          setIsDownloadModal={setIsDownloadModal}
          needOwner={!nftDetailData?.is_owner}
        />
      )}
    </>
  );
};

const TrackInformation = ({ id }) => {
  const { t } = useTranslation('nft_marketplace');

  const { data: activityData } = useQuery(['transaction_activity_data', id], async () => {
    const res = await getNftOverview({ nft_id: id });
    return res.data;
  });

  return (
    <>
      <ContentWrap title={t('Activity')}>
        <NftOverview title={t('Content Information')}>
          <NftOverviewItem title={t('Tags')} value={activityData?.nft_tags || '-'} isLong />
          <NftOverviewItem
            title={t('Creation Date')}
            value={
              activityData?.nft_song_create_dt
                ? formatLocalTime(activityData?.nft_song_create_dt)
                : '-'
            }
            isLong
          />
          <NftOverviewItem title={t('Type')} value="Lyrics + Songwriting" isTwo typeImg />
          <NftOverviewItem title={t('Language')} value={activityData?.nft_language || '-'} isTwo />
          <NftOverviewItem title={t('Genre')} value={activityData?.genre || '-'} />
          <NftOverviewItem title={t('Gender')} value={activityData?.nft_gender || '-'} />
          <NftOverviewItem
            title={t('Musical Instrument')}
            value={activityData?.nft_musical_instrument || '-'}
          />
          <NftOverviewItem title="Tempo" value={activityData?.nft_tempo || '-'} isTwo />
          <NftOverviewItem title="Song Length" value={activityData?.song_length || '-'} isTwo />
          <NftOverviewItem title="Detail" value={activityData?.nft_detail || '-'} isLong />
        </NftOverview>
      </ContentWrap>
      {/* {activityData?.recommand_list && ( */}
      <ContentWrap title={t('More from this Collection')}>
        <NftItemList data={activityData?.recommand_list} />
      </ContentWrap>
      {/* )} */}
    </>
  );
};

const TransactionStatistics = ({ id }) => {
  const { t } = useTranslation('nft_marketplace');

  const { data: statisticsData } = useQuery(['transaction_statistics_data', id], async () => {
    const res = await getNftStatistics({ nft_id: id });
    return res.data;
  });

  return (
    <ContentWrap title={t('Transaction Statistics')}>
      <NftOverview title={t('Key Information Related to Transactions')}>
        <NftOverviewItem
          title={t('Price')}
          value={statisticsData?.price?.toLocaleString() || '-'}
          isTwo
        />
        <NftOverviewItem
          title={t('Recent Transaction Date')}
          value={
            statisticsData?.last_transaction_date
              ? formatLocalTime(statisticsData?.last_transaction_date)
              : '-'
          }
          isTwo
        />
      </NftOverview>
      <NftOverview title={t('Transaction Statistics')}>
        <NftOverviewItem
          title={t('Number of Transactions')}
          value={statisticsData?.transaction_cnt?.toLocaleString() || '-'}
          isTwo
        />
        <NftOverviewItem
          title={t('Total Volume')}
          value={
            statisticsData?.total_price
              ? `${statisticsData?.total_price?.toLocaleString()} ${statisticsData?.sales_token}`
              : '-'
          }
          isTwo
        />
        <NftOverviewItem
          title={t('Average Price')}
          value={
            statisticsData?.avg_price
              ? `${statisticsData?.avg_price?.toLocaleString()} ${statisticsData?.sales_token}`
              : '-'
          }
        />
        <NftOverviewItem
          title="Highest Price"
          value={
            statisticsData?.max_price
              ? `${statisticsData?.max_price?.toLocaleString()} ${statisticsData?.sales_token}`
              : '-'
          }
        />
        <NftOverviewItem
          title={t('Lowest Price')}
          value={
            statisticsData?.min_price
              ? `${statisticsData?.min_price?.toLocaleString()} ${statisticsData?.sales_token}`
              : '-'
          }
        />
      </NftOverview>
      <ContentWrap title={t('Graph List')}>
        <NftGraph
          barGraphData={statisticsData?.transaction_cnt_progress}
          barTitle={`${t('Transaction Volume')} ${t('(7-Day Fixed)')}`}
          lineGraphData={statisticsData?.transaction_price_progress}
          lineTitle={`${t('Average Price')} ${t('(7-Day Fixed)')}`}
        />
      </ContentWrap>
    </ContentWrap>
  );
};

const History = ({ id, t }) => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const nftSort = searchParams.get('nft_sort');
  const tokenFilter = searchParams.get('token_filter');

  const { data: historyData } = useQuery(
    ['transaction_history_data', id, page, search, nftSort, tokenFilter],
    async () => {
      const res = await getNftsHistory({
        nft_id: id,
        page,
        sort_by: nftSort,
        search_keyword: search,
        sales_token: tokenFilter,
      });
      return res.data;
    }
  );

  return (
    <ContentWrap title={t('Information')}>
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
