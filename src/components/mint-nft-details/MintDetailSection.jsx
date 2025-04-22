import React from 'react';
import './MintDetailSection.scss';
import heartIcon from '../../assets/images/like-icon/like-icon.svg';
import MintDetailLeft from './MintDetailLeft';
import MintDetailRight from './MintDetailRight';



const MintDetailSection = ({ album, tagArray, albumDuration,track1 }) => {


    return (
        <>
                <section className="album-detail__mint-detail">
                    {/* <p className="album-detail__mint-detail__title">Song Details</p> */}
                    <div className="album-detail__mint-detail__bot">
                        <MintDetailLeft  album={album} track1={track1}/>
                        <MintDetailRight album={album} tagArray={tagArray} albumDuration={albumDuration} />
                    </div>
                </section>
        </>
    );
};

export default MintDetailSection;
