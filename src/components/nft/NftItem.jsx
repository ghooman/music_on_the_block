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

export const NftItem = () => {
    return (
        <Link className="nft-item">
            <div className="nft-item__images">
                {/* <img alt="nft images" /> */}
                <div className="nft-item__images--type"></div>
                <div className="nft-item__images--genre"></div>
                <div className="nft-item__images--running-time"></div>
            </div>
            <p className="nft-item__desc">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <p className="nft-item__title">NFTs Titles</p>
            <div className="nft-item__prices">
                <PriceItems title="Price" value="0.23 MOB" />
                <PriceItems title="NFT Quantity" value="10/ 100" />
            </div>
        </Link>
    );
};

export default NftItem;

const PriceItems = ({ title, value }) => {
    return (
        <div className="nft-item__prices--box">
            <p className="nft-item__prices--title">{title}</p>
            <p className="nft-item__prices--price-value">{value}</p>
        </div>
    );
};
