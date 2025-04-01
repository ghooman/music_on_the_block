import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';

import nft01 from '../../assets/images/nft/nft01.png';
import nft02 from '../../assets/images/nft/nft02.png';
import nft03 from '../../assets/images/nft/nft03.png';
import nft04 from '../../assets/images/nft/nft04.png';
import nft05 from '../../assets/images/nft/nft05.png';
import nft06 from '../../assets/images/nft/nft06.png';
import nft07 from '../../assets/images/nft/nft07.png';
import nft08 from '../../assets/images/nft/nft08.png';
import collection01 from '../../assets/images/nft/collection01.png';
import collection02 from '../../assets/images/nft/collection02.png';
import collection03 from '../../assets/images/nft/collection03.png';
import collection04 from '../../assets/images/nft/collection04.png';
import lyricIcon from '../../assets/images/icon/Lyric-Icon.svg';
import compositionIcon from '../../assets/images/icon/Composition-Icon.svg';
import songIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import loveIcon from '../../assets/images/like-icon/like-icon.svg';
import playIcon from '../../assets/images/album/play-icon.svg';
import defaultCoverImg from '../../assets/images/header/logo.svg';
import coverImg from '../../assets/images/intro/intro-demo-img.png';
import coverImg2 from '../../assets/images/intro/intro-demo-img2.png';
import coverImg3 from '../../assets/images/intro/intro-demo-img3.png';
import coverImg4 from '../../assets/images/demo/album01.svg';
import coverImg5 from '../../assets/images/demo/album02.svg';
import coverImg6 from '../../assets/images/demo/album03.svg';
import coverImg7 from '../../assets/images/demo/album04.svg';
import coverImg8 from '../../assets/images/demo/album05.svg';
import coverImg9 from '../../assets/images/demo/album06.svg';

import './NftItem.scss';

const nftData = [
    {
        id: 1,
        image: nft01,
        desc: 'Melodic Dreams - A fusion of sound and emotion',
        title: 'Melodic Dreams #001',
        price: '0.23',
        quantity: '10/100',
        type: 'Lyric',
        genre: 'Pop',
        duration: '3:45',
    },
    {
        id: 2,
        image: nft02,
        desc: 'Rhythm of Nature - Organic beats and harmonies',
        title: 'Nature Rhythm #002',
        price: '0.45',
        quantity: '5/50',
        type: 'Composition',
        genre: 'Ambient',
        duration: '4:20',
    },
    {
        id: 3,
        image: nft03,
        desc: 'Urban Pulse - City sounds reimagined',
        title: 'Urban Beats #003',
        price: '0.32',
        quantity: '15/150',
        type: 'Song',
        genre: 'Electronic',
        duration: '3:15',
    },
    {
        id: 4,
        image: nft04,
        desc: 'Digital Symphony - Future of music',
        title: 'Digital Symphony #004',
        price: '0.28',
        quantity: '20/200',
        type: 'Lyric',
        genre: 'Classical',
        duration: '5:30',
    },
    {
        id: 5,
        image: nft05,
        desc: 'Jazz Fusion - Modern meets traditional',
        title: 'Jazz Fusion #005',
        price: '0.35',
        quantity: '8/80',
        type: 'Composition',
        genre: 'Jazz',
        duration: '4:15',
    },
    {
        id: 6,
        image: nft06,
        desc: 'Rock Revolution - Power of sound',
        title: 'Rock Revolution #006',
        price: '0.42',
        quantity: '12/120',
        type: 'Song',
        genre: 'Rock',
        duration: '3:50',
    },
    {
        id: 7,
        image: nft07,
        desc: 'Hip Hop Vibes - Street beats',
        title: 'Hip Hop Vibes #007',
        price: '0.38',
        quantity: '15/150',
        type: 'Lyric',
        genre: 'Hip Hop',
        duration: '3:30',
    },
    {
        id: 8,
        image: nft08,
        desc: 'EDM Energy - Electronic dance music',
        title: 'EDM Energy #008',
        price: '0.25',
        quantity: '10/100',
        type: 'Composition',
        genre: 'EDM',
        duration: '4:00',
    },
];

const collectionData = [
    {
        id: 1,
        image: collection01,
        title: 'Melodic Masters',
        username: 'MusicMaster',
        highestPrice: '0.85',
        totalItems: '100',
    },
    {
        id: 2,
        image: collection02,
        title: 'Rhythm Raiders',
        username: 'BeatMaker',
        highestPrice: '0.65',
        totalItems: '75',
    },
    {
        id: 3,
        image: collection03,
        title: 'Sound Pioneers',
        username: 'AudioArtist',
        highestPrice: '0.95',
        totalItems: '150',
    },
    {
        id: 4,
        image: collection04,
        title: 'Digital Beats',
        username: 'SoundDesigner',
        highestPrice: '0.75',
        totalItems: '120',
    },
    {
        id: 5,
        image: collection01,
        title: 'Melodic Masters',
        username: 'MusicMaster',
        highestPrice: '0.85',
        totalItems: '100',
    },
    {
        id: 6,
        image: collection02,
        title: 'Rhythm Raiders',
        username: 'BeatMaker',
        highestPrice: '0.65',
        totalItems: '75',
    },
    {
        id: 7,
        image: collection03,
        title: 'Sound Pioneers',
        username: 'AudioArtist',
        highestPrice: '0.95',
        totalItems: '150',
    },
    {
        id: 8,
        image: collection04,
        title: 'Digital Beats',
        username: 'SoundDesigner',
        highestPrice: '0.75',
        totalItems: '120',
    },
];

export const NftItemList = ({ data }) => {
    return (
        <div className="nft-item-wrap">
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    <NftItem item={nftData[item - 1]} />
                </React.Fragment>
            ))}
        </div>
    );
};

export const CollectionItemList = ({ data }) => {
    return (
        <div className="nft-item-collection-wrap">
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    <CollectionItem item={collectionData[item - 1]} />
                </React.Fragment>
            ))}
        </div>
    );
};

const NftItem = ({ item }) => {
    return (
        <Link className="nft-item">
            <Images music item={item} />
            <Desc desc={item.desc} />
            <Title title={item.title} />
            <div className="nft-item__prices col">
                <PriceItems title="Price" value={`${item.price} MOB`} />
                <PriceItems title="NFT Quantity" value={item.quantity} />
            </div>
        </Link>
    );
};

export const CollectionItem = ({ item }) => {
    return (
        <Link className="nft-item" to="/nft/collection/detail">
            <Images item={item} />
            <CollectionTitle title={item.title} />
            <Username username={item.username} />
            <div className="nft-item__prices raw">
                <PriceItems title="Highest Price" value={`${item.highestPrice} MOB`} />
                <PriceItems title="Total NFT Items" value={item.totalItems} />
            </div>
        </Link>
    );
};

//===========
// Compositions
//===========

const Images = ({ music, item }) => {
    const getTypeIcon = (type) => {
        switch (type) {
            case 'Lyric':
                return lyricIcon;
            case 'Composition':
                return compositionIcon;
            case 'Song':
                return songIcon;
            default:
                return null;
        }
    };

    return (
        <div className="nft-item__images">
            <img src={item.image} alt={item.title || item.desc} />
            {music && (
                <>
                    <div className="nft-item__images--type">
                        <img src={getTypeIcon(item.type)} alt={item.type} />
                    </div>
                    <div className="nft-item__images--genre">{item.genre}</div>
                    <div className="nft-item__images--running-time">{item.duration}</div>
                </>
            )}
        </div>
    );
};

const Desc = ({ desc }) => {
    return <p className="nft-item__desc">{desc}</p>;
};

const CollectionTitle = ({ title }) => {
    return <p className="nft-collection-item__title">{title}</p>;
};

const Title = ({ title }) => {
    return <p className="nft-item__title">{title}</p>;
};

const Username = ({ username }) => {
    return <p className="nft-item__username">{username}</p>;
};

const PriceItems = ({ title, value }) => {
    return (
        <div className="nft-item__prices--box">
            <p className="nft-item__prices--title">{title}</p>
            <p className="nft-item__prices--price-value">{value}</p>
        </div>
    );
};

// 스와이프 컴포넌트
export const NftSwiper = () => {
    // 스와이프 옵션
    const swiperOptions = {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 16,
        initialSlide: 2,
        grabCursor: true,
        centeredSlides: true,
        pagination: {
            clickable: true,
        },
        navigation: true,
        modules: [Pagination, Navigation, Autoplay],
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            680: {
                slidesPerView: 2,
            },
            930: {
                slidesPerView: 5,
            },
        },
    };

    // 트랙 데이터
    const tracks = [
        {
            id: 1,
            title: 'POP',
            cover: coverImg,
            duration: null,
        },
        {
            id: 2,
            title: 'CLASSICAL',
            cover: coverImg2,
            duration: null,
        },
        {
            id: 3,
            title: 'GENRE',
            cover: coverImg3,
            duration: null,
        },
        {
            id: 4,
            title: 'JAZZ',
            cover: coverImg4,
            duration: null,
        },
        {
            id: 5,
            title: 'ROCK',
            cover: coverImg5,
            duration: null,
        },
        {
            id: 6,
            title: 'DANCE',
            cover: coverImg6,
            duration: null,
        },
        {
            id: 7,
            title: 'VOCAL',
            cover: coverImg7,
            duration: null,
        },
        {
            id: 8,
            title: 'K-POP',
            cover: coverImg8,
            duration: null,
        },
        {
            id: 9,
            title: 'Z-POP',
            cover: coverImg9,
            duration: null,
        },
    ];

    return (
        <div className="nft-slider__swiper">
            <Swiper {...swiperOptions} className="nft-slider">
                {tracks.map((track, index) => (
                    <SwiperSlide key={track.id}>
                        <button className="nft-slider__item">
                            <p className="nft-slider__item__title">{track.title}</p>
                            <img src={track.cover} alt="user" />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export const GraphItem = ({}) => {
    return (
        <div className="nft-item__graph">
            <div className="nft-item__graph--img">
                <p className="nft-item__graph--img__title">Transaction Volume</p>
                <img src={graph1Img01} />
            </div>
            <div className="nft-item__graph--img">
                <p className="nft-item__graph--img__title">NFT Issuance</p>
                <img src={graph1Img02} />
            </div>
        </div>
    );
};
