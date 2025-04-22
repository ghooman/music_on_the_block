import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MintDetailRight.scss';
const formatLocalTime = (v) => v; // 더미
const formatTime      = (v) => v; // 더미


const MintDetailRight = ({ album, tagArray, albumDuration}) => {


    return (
        <>
            <div className="album-detail__mint-detail__right">
                <p className="album-detail__mint-detail__right__title">{album.title}</p>

                <div className="album-detail__mint-detail__right__type">
                    {tagArray.map((t) => (
                    <div key={t} className="album-detail__mint-detail__right__type__item">{t}</div>
                    ))}
                </div>

                <div className="album-detail__mint-detail__right__info-box">
                    <dl><dt>Detail</dt>             <dd>{album.detail}</dd></dl>
                    <dl><dt>Language</dt>           <dd>{album.language}</dd></dl>
                    <dl><dt>Genre</dt>              <dd>{album.genre}</dd></dl>
                    <dl><dt>Gender</dt>             <dd>{album.gender}</dd></dl>
                    <dl><dt>Musical Instrument</dt> <dd>{album.musical_instrument}</dd></dl>
                    <dl><dt>Tempo</dt>              <dd>{album.tempo}</dd></dl>
                    <dl><dt>Creation Date</dt>      <dd>{formatLocalTime(album.create_dt)}</dd></dl>
                    <dl><dt>Song Length</dt>        <dd>{formatTime(albumDuration)}</dd></dl>
                    <dl className="artist">
                    <dt>Artist</dt>
                    <dd>
                        <Link to="#" className="user">
                        <img src={album.user_profile} alt="profile" /> {album.name}
                        </Link>
                    </dd>
                    </dl>
                </div>
            </div>
        </>
    );
};

export default MintDetailRight;
