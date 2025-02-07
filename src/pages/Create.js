import { useEffect, useState } from 'react';
import React from 'react';

import '../styles/Create.scss';
import LyricLab from '../components/create/LyricLab';
import MelodyMaker from '../components/create/MelodyMaker';
import DescriptionBanner from '../components/create/DescriptionBanner';
import AlbumCoverSudio from '../components/create/AlbumCoverStudio';
import Finalize from '../components/create/Finalize';

const Create = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [lylicData, setLyricData] = useState({
        lyric_tag: [],
        lyric_genre: [],
        lyric_style: [],
        lyric_stylistic: [],
    });

    const [melodyData, setMelodyData] = useState({
        melody_tag: [],
        melody_genre: [],
        melody_style: [],
        melody_instrument: [],
    });

    return (
        <div className="music_create">
            <Title />
            <Progress pageNumber={pageNumber} />
            <DescriptionBanner pageNumber={pageNumber} />
            {pageNumber !== 3 && (
                <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SelectedWrap title="Lyric Lab">
                        <SelectedItem title="Tags" value={lylicData?.lyric_tag} multiple />
                        <SelectedItem title="Genre" value={lylicData?.lyric_genre} />
                        <SelectedItem title="Style" value={lylicData?.lyric_style} />
                        <SelectedItem title="Stylistic" value={lylicData?.lyric_stylistic} />
                    </SelectedWrap>
                    <SelectedWrap title="Melody Maker">
                        <SelectedItem title="Tags" value={melodyData?.melody_tag} multiple />
                        <SelectedItem title="Genre" value={melodyData?.melody_genre} />
                        <SelectedItem title="Style" value={melodyData?.melody_style} />
                        <SelectedItem title="Musical Instrument" value={melodyData?.melody_instrument} />
                    </SelectedWrap>
                </div>
            )}
            {pageNumber === 0 && (
                <LyricLab handler={setLyricData}>
                    <ButtonWrap>
                        <ButtonWrap.Button title="skip" />
                        <ButtonWrap.Button title="next" handler={() => setPageNumber((prev) => prev + 1)} />
                    </ButtonWrap>
                </LyricLab>
            )}
            {pageNumber === 1 && (
                <MelodyMaker handler={setMelodyData}>
                    <ButtonWrap>
                        <ButtonWrap.Button title="skip" />
                        <ButtonWrap.Button title="next" handler={() => setPageNumber((prev) => prev + 1)} />
                    </ButtonWrap>
                </MelodyMaker>
            )}
            {pageNumber === 2 && (
                <AlbumCoverSudio>
                    <ButtonWrap>
                        <ButtonWrap.Button title="skip" />
                        <ButtonWrap.Button title="next" handler={() => setPageNumber((prev) => prev + 1)} />
                    </ButtonWrap>
                </AlbumCoverSudio>
            )}
            {pageNumber === 3 && <Finalize></Finalize>}
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

const SelectedItem = ({ title, value, multiple }) => {
    return (
        <div className={`selected-item ${multiple ? 'multiple' : ''}`}>
            <p className="item-title">{title}</p>
            <div className="item-value">
                {value?.length > 0 ? (
                    value.map((item) => (
                        <span className={`values ${multiple ? 'multiple' : ''} `} key={item}>
                            {item}
                        </span>
                    ))
                ) : (
                    <p className="values">-</p>
                )}
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
