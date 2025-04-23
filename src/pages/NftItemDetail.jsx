import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import Categories from '../components/nft/Categories';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList } from '../components/nft/NftItem';
import Pagination from '../components/unit/Pagination';
import FilterItems from '../components/unit/FilterItems';
import Search from '../components/unit/Search';
import { InfoRowWrap } from '../components/nft/InfoRow';
import CustomTable from '../components/CustomTable';

import coverImg from '../assets/images/intro/intro-demo-img.png';
import coverImg2 from '../assets/images/intro/intro-demo-img2.png';
import coverImg3 from '../assets/images/intro/intro-demo-img3.png';
import coverImg4 from '../assets/images/demo/album01.svg';
import coverImg5 from '../assets/images/demo/album02.svg';
import coverImg6 from '../assets/images/demo/album03.svg';
import coverImg7 from '../assets/images/demo/album04.svg';
import coverImg8 from '../assets/images/demo/album05.svg';
import coverImg9 from '../assets/images/demo/album06.svg';
import likeImage from '../assets/images/like-icon/like-icon-on.svg';
import unLikeImage from '../assets/images/like-icon/like-icon.svg';
import dummy_collectionImage from '../assets/images/nft/collection01.png';
import dummy_userImage from '../assets/images/account/demo-user1.png';
import demoImg from '../assets/images/intro/intro-demo-img4.png';
import loveIcon from '../assets/images/like-icon/like-icon.svg';
import halfHeartIcon from '../assets/images/like-icon/like-icon-on.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import commentIcon from '../assets/images/album/chat-icon.svg';
import shareIcon from '../assets/images/album/share-icon.svg';
import defaultCoverImg from '../assets/images/intro/mob-album-cover.png';
// import defaultCoverImg from "../assets/images/header/logo.svg";

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

const dummyData = [
    {
        number: 1,
        username: 'User Name',
        quantity: 100,
        price: '100.000',
        totalVolume: '100.000',
        transactionDate: 'Sat, 04 Nov 2023 14:40:00 UTC+9',
    },
];

const dummyData2 = [
    {
        number: 30,
        username: {
            picture: dummy_userImage,
            name: 'Yolkhead',
        },
        price: '100.000',
        transactionDate: 'Sat, 04 Nov 2023 14:40:00 UTC+9',
    },
    {
        number: 29,
        username: {
            picture: dummy_userImage,
            name: 'CryptoWhale',
        },
        price: '98.500',
        transactionDate: 'Sat, 04 Nov 2023 14:35:00 UTC+9',
    },
    {
        number: 28,
        username: {
            picture: dummy_userImage,
            name: 'MusicLover',
        },
        price: '99.000',
        transactionDate: 'Sat, 04 Nov 2023 14:30:00 UTC+9',
    },
    {
        number: 27,
        username: {
            picture: dummy_userImage,
            name: 'NFTKing',
        },
        price: '101.000',
        transactionDate: 'Sat, 04 Nov 2023 14:25:00 UTC+9',
    },
    {
        number: 26,
        username: {
            picture: dummy_userImage,
            name: 'BlockMaster',
        },
        price: '97.500',
        transactionDate: 'Sat, 04 Nov 2023 14:20:00 UTC+9',
    },
    {
        number: 25,
        username: {
            picture: dummy_userImage,
            name: 'SoundCollector',
        },
        price: '102.000',
        transactionDate: 'Sat, 04 Nov 2023 14:15:00 UTC+9',
    },
    {
        number: 24,
        username: {
            picture: dummy_userImage,
            name: 'MelodyHunter',
        },
        price: '103.500',
        transactionDate: 'Sat, 04 Nov 2023 14:10:00 UTC+9',
    },
    {
        number: 23,
        username: {
            picture: dummy_userImage,
            name: 'BeatMaker',
        },
        price: '98.000',
        transactionDate: 'Sat, 04 Nov 2023 14:05:00 UTC+9',
    },
    {
        number: 22,
        username: {
            picture: dummy_userImage,
            name: 'RhythmTrader',
        },
        price: '104.000',
        transactionDate: 'Sat, 04 Nov 2023 14:00:00 UTC+9',
    },
    {
        number: 21,
        username: {
            picture: dummy_userImage,
            name: 'SongMaster',
        },
        price: '99.500',
        transactionDate: 'Sat, 04 Nov 2023 13:55:00 UTC+9',
    },
];

const NftItemDetail = () => {
    const [selectCategory, setSelectCategory] = useState('Track Information');

    return (
        <div className="nft-item-detail">
            <NftItemDetailInfo />
            <Categories
                categories={['Track Information', 'Transaction Statistics', 'History']}
                value={selectCategory}
                onClick={setSelectCategory}
            />
            {selectCategory === 'Track Information' && <TrackInformation />}
            {selectCategory === 'Transaction Statistics' && <TransactionStatistics />}
            {selectCategory === 'History' && <History />}
        </div>
    );
};

export default NftItemDetail;

const NftItemDetailInfo = () => {
    const serverApi = process.env.REACT_APP_SERVER_API;
    const { id } = useParams();
    const { token, walletAddress } = useContext(AuthContext);

    const [isActive, setIsActive] = useState(false);
    const [isShareModal, setShareModal] = useState(false);

    const handleClick = () => {
        setIsActive((prev) => !prev);
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
    const [album, setAlbum] = useState(null);
    // 앨범 상세 정보 가져오기
    const fetchAlbumDetail = async () => {
        try {
            const response = await axios.get(`${serverApi}/api/music/${id}?wallet_address=${walletAddress.address}`, {
                params: {
                    wallet_address: walletAddress.address,
                },
            });

            console.log('앨범 상세 정보:', response.data);
            setAlbum(response.data);
        } catch (error) {
            console.error('앨범 상세 정보 가져오기 에러:', error);
        }
    };
    useEffect(() => {
        fetchAlbumDetail();
    }, [id, walletAddress, token, serverApi]);

    const [isPlaying, setIsPlaying] = useState(false);

    // album 객체에 tags 문자열이 존재하는지 확인합니다.
    const tagString = album?.tags;
    // tags 문자열이 존재하면, 쉼표로 구분된 배열로 변환 후 불필요한 공백을 제거합니다.
    const tagArray = tagString
        ? tagString
                .split(',')
                .map((t) => t.trim())
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
                <p className='nft-item-detail-info-wrap__title'>NFT Item Details</p>
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
                                    <img src={album?.image || defaultCoverImg} alt="앨범 이미지" />
                                ) : (
                                    <img src={defaultCoverImg} alt="기본 이미지" />
                                )}
                                <div className="nft-item-detail__song-detail__left__img__txt">
                                    <pre>
                                        {album?.lyrics}
                                    </pre>
                                </div>
                                <button className="nft-item-detail__song-detail__left__img__lyric-btn">Lyrics</button>
                            </div>
                            <div className="nft-item-detail__song-detail__left__info">
                                <div className="nft-item-detail__song-detail__left__info__number">
                                    <p className="play">
                                        <img src={playIcon} />
                                        {album?.play_cnt || 0}
                                    </p>
                                    <p className="love" 
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
                            <p className="nft-item-detail__song-detail__right__title">
                                {album?.title || 'Genosper Album'}
                            </p>
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
                                    <dd>Item ID (#0001)</dd>
                                </dl>
                                <dl>
                                    <dt>Collection</dt>
                                    <dd>Collection Name</dd>
                                </dl>
                                <dl className='Sell'>
                                    <dt>Sell Status</dt>
                                    <dd>Sell</dd>
                                </dl>
                                <dl>
                                    <dt>Mint NFT date</dt>
                                    <dd>Mint NFT date</dd>
                                </dl>
                                {/* <dl>
                                    <dt>Creation Data</dt>
                                    <dd>
                                        {formatUtcTime(album?.create_dt) || "-"}
                                        <span>{formatLocalTime(album?.create_dt)}</span>
                                    </dd>
                                </dl> */}
                                <dl className="artist">
                                    <dt>Artist</dt>
                                    <dd>
                                        <p className="user">
                                            <img src={album?.user_profile || coverImg2} />
                                            {album?.name || '-'}
                                        </p>
                                        {/* <Link className="see-more-btn" to="/my-page">
                                            See More
                                        </Link> */}
                                    </dd>
                                </dl>
                            </div>
                            <div className="nft-item-detail__song-detail__right__value-box">
                                {/* <dl>
                                    <dt>NFT Quantity</dt>
                                    <dd>10 / 100</dd>
                                </dl> */}
                                <dl className='nft-item-detail__song-detail__right__value-box__price'>
                                    <dt>Price</dt>
                                    <dd>
                                        <span>$1,000</span>100 MOB
                                    </dd>
                                </dl>
                            </div>
                            {/* <div className="nft-item-detail__song-detail__right__time-box">
                                <p className="nft-item-detail__song-detail__right__time-box__title">Sale End Date</p>
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
                                {/* <button className="nft-item-detail__song-detail__right__btn-box__btn">Buy NFT</button> */}
                                <button className="nft-item-detail__song-detail__right__btn-box__btn sell-nft">Sell NFT</button>
                                {/* <button className="nft-item-detail__song-detail__right__btn-box__btn cancel-nft">Cancel NFT</button> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

const TrackInformation = () => {
    return (
        <>
            <ContentWrap title="Activity">
                <NftOverview title="Content Information">
                    <NftOverviewItem title="Tags" value="Winter, Night, Moon, Love, Promise" isLong />
                    <NftOverviewItem title="creation date" value="Wed, 16 Apr 2025 21:50:12 UTC+9" isLong />
                    <NftOverviewItem title="Detail" value="Boom Song Box" isTwo />
                    <NftOverviewItem title="Type" value="Lyrics + Songwriting" isTwo typeImg />
                    <NftOverviewItem title="Genre" value="POP" />
                    <NftOverviewItem title="Musical Instrument" value="드럼,베이스" />
                    <NftOverviewItem title="Language" value="KOR" />
                    <NftOverviewItem title="Tempo" value="110" />
                    <NftOverviewItem title="Song Length" value="3:01" />
                    <NftOverviewItem title="Genre" value="K-POP" />
                </NftOverview>
            </ContentWrap>
            <ContentWrap title="Recommended NFTs">
                <NftItemList data={[1, 2, 3, 4]} />
            </ContentWrap>
        </>
    );
};

const TransactionStatistics = () => {
    return (
        <ContentWrap title="Transaction Statistics">
            <NftOverview title="Key Information Related to Transactions">
                <NftOverviewItem title="Price" value="1,000" isTwo />
                <NftOverviewItem title="Recent Transaction Date" value="Sat, 04 Nov 2023 14:40:00 UTC+9" isTwo  />
            </NftOverview>
            <NftOverview title="Transaction Statistics">
                <NftOverviewItem title="Number of Transactions" value="90" isTwo/>
                <NftOverviewItem title="Total Volume" value="157,652 MOB" isTwo/>
                <NftOverviewItem title="Average Price" value="100 MOB" />
                <NftOverviewItem title="Highest Price" value="175 MOB" />
                <NftOverviewItem title="Lowest Price" value="189 MOB" />
            </NftOverview>
            <ContentWrap title="Graph List">
                <NftGraph />
            </ContentWrap>
        </ContentWrap>
    );
};

const History = () => {
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
                <FilterItems />
                <Search />
                <CustomTable
                    data={dummyData2}
                    headers={['#', ' Artist Name', 'Price (MOB)', 'Transaction Date']}
                />
            </ContentWrap.SubWrap>
            <Pagination />
        </ContentWrap>
    );
};
