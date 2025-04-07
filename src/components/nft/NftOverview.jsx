import React from 'react';
import './NftOverview.scss';
import lyricIcon from "../../assets/images/icon/Lyrics-Icon.svg"; //작사
import compositionIcon from "../../assets/images/icon/Composition-Icon.svg"; //작곡
import songIcon from "../../assets/images/icon/Songwriting-Icon.svg"; //작사+작곡=노래

export const NftOverviewItem = ({ title, value, isLong, isTwo, typeImg }) => {
    return (
        <dl className={`nft-overview__content--item ${isLong ? 'long' : ''} ${isTwo ? 'isTwo' : ''}`}>
            <dt>{title}</dt>
            <dd>
                {typeImg && <img src={songIcon} alt="song" />}
                {value}
            </dd>
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