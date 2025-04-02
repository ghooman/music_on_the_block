import React from 'react';
import './NftOverview.scss';

export const NftOverviewItem = ({ title, value, isLong }) => {
    return (
        <dl className={`nft-overview__content--item ${isLong ? 'long' : ''}`}>
            <dt>{title}</dt>
            <dd>{value}</dd>
        </dl>
    );
};

export const NftOverview = ({ title = "Detail", children }) => {
    return (
        <div className="nft-overview">
            <p className="nft-overview__title">{title}</p>
            <div className="nft-overview__content">
                {children}
            </div>
        </div>
    );
}; 