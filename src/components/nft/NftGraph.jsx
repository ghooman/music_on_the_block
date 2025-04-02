import React from 'react';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';
import './NftGraph.scss';

export const NftGraph = () => {
    return (
        <div className="nft-item__graph">
            <div className="nft-item__graph--img">
                <p className="nft-item__graph--img__title">Transaction Volume</p>
                <img src={graph1Img01} alt="Transaction Volume" />
            </div>
            <div className="nft-item__graph--img">
                <p className="nft-item__graph--img__title">NFT Issuance</p>
                <img src={graph1Img02} alt="NFT Issuance" />
            </div>
        </div>
    );
}; 