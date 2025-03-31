import { Link } from 'react-router-dom';
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

import './NftItem.scss';

const nftData = [
    {
        id: 1,
        image: nft01,
        desc: "Melodic Dreams - A fusion of sound and emotion",
        title: "Melodic Dreams #001",
        price: "0.23",
        quantity: "10/100",
        type: "Music",
        genre: "Pop",
        duration: "3:45"
    },
    {
        id: 2,
        image: nft02,
        desc: "Rhythm of Nature - Organic beats and harmonies",
        title: "Nature Rhythm #002",
        price: "0.45",
        quantity: "5/50",
        type: "Music",
        genre: "Ambient",
        duration: "4:20"
    },
    {
        id: 3,
        image: nft03,
        desc: "Urban Pulse - City sounds reimagined",
        title: "Urban Beats #003",
        price: "0.32",
        quantity: "15/150",
        type: "Music",
        genre: "Electronic",
        duration: "3:15"
    },
    {
        id: 4,
        image: nft04,
        desc: "Digital Symphony - Future of music",
        title: "Digital Symphony #004",
        price: "0.28",
        quantity: "20/200",
        type: "Music",
        genre: "Classical",
        duration: "5:30"
    }
];

const collectionData = [
    {
        id: 1,
        image: collection01,
        title: "Melodic Masters",
        username: "MusicMaster",
        highestPrice: "0.85",
        totalItems: "100"
    },
    {
        id: 2,
        image: collection02,
        title: "Rhythm Raiders",
        username: "BeatMaker",
        highestPrice: "0.65",
        totalItems: "75"
    },
    {
        id: 3,
        image: collection03,
        title: "Sound Pioneers",
        username: "AudioArtist",
        highestPrice: "0.95",
        totalItems: "150"
    }
];

export const NftItemWraps = ({ data }) => {
    return (
        <div className="nft-item-wrap">
            {nftData.map((item) => (
                <NftItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export const NftCollectionItemWraps = ({ data }) => {
    return (
        <div className="nft-item-collection-wrap">
            {collectionData.map((item) => (
                <CollectionItem key={item.id} item={item} />
            ))}
        </div>
    );
};

const NftItem = ({ item }) => {
    return (
        <Link className="nft-item">
            <Images item={item} />
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
        <Link className="nft-item">
            <Images item={item} isCollection={true} />
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

const Images = ({ item, isCollection }) => {
    return (
        <div className="nft-item__images">
            <img src={item.image} alt={isCollection ? item.title : item.desc} />
            {!isCollection && (
                <>
                    <div className="nft-item__images--type">{item.type}</div>
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
