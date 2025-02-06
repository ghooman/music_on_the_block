import { useEffect, useState } from 'react';
import React from 'react';

import '../styles/Create.scss';
import LyricLab from '../components/create/LyricLab';
import MelodyMaker from '../components/create/MelodyMaker';
import DescriptionBanner from '../components/create/DescriptionBanner';
import AlbumCoverSudio from '../components/create/AlbumCoverStudio';

const Create = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [lylic, setLiric] = useState({
        lyric_tag: [],
        lyric_genre: [],
        lyric_style: [],
        lyric_stylistic: [],
    });

    return (
        <div className="music_create">
            <Title />
            <Progress pageNumber={pageNumber} />
            <DescriptionBanner pageNumber={pageNumber} />
            <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SelectedWrap title="Lyric Lab">
                    <SelectedItem title="Tags" value={lylic?.lyric_tag} />
                    <SelectedItem title="Genre" value={lylic?.lyric_genre} />
                    <SelectedItem title="Style" value={lylic?.lyric_style} />
                    <SelectedItem title="Stylistic" value={lylic?.lyric_stylistic} />
                </SelectedWrap>
            </div>
            {pageNumber === 0 && (
                <LyricLab setPageNumber={setPageNumber} setLiric={setLiric}>
                    <ButtonWrap>
                        <ButtonWrap.Button title="skip" />
                        <ButtonWrap.Button title="next" handler={() => setPageNumber((prev) => prev + 1)} />
                    </ButtonWrap>
                </LyricLab>
            )}
            {pageNumber === 1 && (
                <MelodyMaker>
                    <ButtonWrap>
                        <ButtonWrap.Button title="skip" />
                        <ButtonWrap.Button title="next" handler={() => setPageNumber((prev) => prev + 1)} />
                    </ButtonWrap>
                </MelodyMaker>
            )}
            {pageNumber === 2 && <AlbumCoverSudio></AlbumCoverSudio>}
        </div>
    );
};

export default Create;

const Title = () => {
    return <h1 className="title">Recommended Music Source</h1>;
};

const Progress = ({ pageNumber }) => {
    const pages = ['Lyric Lab', 'Melody Maker', 'Alubum Cover Studio', 'Preview & Finalize'];

    return (
        <div className="progress mb40">
            {pages.map((item, index, { length }) => (
                <React.Fragment key={item}>
                    <div className="progress__item">
                        <div className={`progress__square ${pageNumber >= index ? 'enable' : ''}`}></div>
                        <p className={`progress__text ${pageNumber >= index ? 'enable' : ''}`}>{item}</p>
                    </div>
                    {length - 1 > index && (
                        <span className={`progress__arrow ${pageNumber >= index ? 'enable' : ''}`}></span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const SelectedWrap = ({ children, title }) => {
    return (
        <div className="selected-wrap">
            <h2 className="wrap-title">{title}</h2>
            <div className="wrap-content">{children}</div>
        </div>
    );
};

const SelectedItem = ({ title, value }) => {
    return (
        <div className="selected-item">
            <p className="item-title">{title}</p>
            <div className="item-value">
                {value?.length > 0 ? value.map((item) => <span key={item}>{item}</span>) : <p>-</p>}
            </div>
        </div>
    );
};

const ButtonWrap = ({ children }) => {
    return <div className="button-wrap">{children}</div>;
};

ButtonWrap.Button = ({ title, handler }) => {
    return (
        <button className={title} onClick={handler}>
            {title}
        </button>
    );
};
