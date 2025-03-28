import { Link } from 'react-router-dom';

import './NftItem.scss';

export const NftItemWraps = ({ data }) => {
    return (
        <div className="nft-item-wrap">
            {data.map(() => (
                <NftItem />
            ))}
        </div>
    );
};

export const NftCollectionItemWraps = ({ data }) => {
    return (
        <div className="nft-item-collection-wrap">
            {data.map((item) => (
                <CollectionItem />
            ))}
        </div>
    );
};

const NftItem = () => {
    return (
        <Link className="nft-item">
            <Images />
            <Desc desc="" />
            <Title title="" />
            <div className="nft-item__prices col">
                <PriceItems title="Price" value="0.23 MOB" />
                <PriceItems title="NFT Quantity" value="10/ 100" />
            </div>
        </Link>
    );
};

export const CollectionItem = () => {
    return (
        <Link className="nft-item">
            <Images />
            <CollectionTitle title="Collection Name" />
            <Username username="Username" />
            <div className="nft-item__prices raw">
                <PriceItems title="Highest Price" value="0.23 MOB" />
                <PriceItems title="Total NFT Items" value="100" />
            </div>
        </Link>
    );
};

//===========
// Compositions
//===========

const Images = () => {
    return (
        <div className="nft-item__images">
            {/* <img alt="nft images" /> */}
            <div className="nft-item__images--type"></div>
            <div className="nft-item__images--genre"></div>
            <div className="nft-item__images--running-time"></div>
        </div>
    );
};

const Desc = ({ desc }) => {
    return <p className="nft-item__desc">{desc}</p>;
};

const CollectionTitle = ({ title }) => {
    return <p className="nft-collection-item__title">{title}</p>;
};

const Title = () => {
    return <p className="nft-item__title">NFTs Titles</p>;
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
