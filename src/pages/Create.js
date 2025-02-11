import { useEffect, useState } from 'react';
import React from 'react';

import LyricLab from '../components/create/LyricLab';
import MelodyMaker from '../components/create/MelodyMaker';
import DescriptionBanner from '../components/create/DescriptionBanner';
import AlbumCoverSudio from '../components/create/AlbumCoverStudio';
import Finalize from '../components/create/Finalize';
import GetStarted from '../components/create/GetStarted';
import CreateCompleteModal from '../components/CreateCompleteModal';
import SkipModal from '../components/SkipModal';

import ExpandedButton from '../components/create/ExpandedButton';

import '../styles/Create.scss';

const Create = () => {
    const [pageNumber, setPageNumber] = useState(-1);
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
    const [tempo, setTempo] = useState([90]);
    const [albumCover, setAlbumCover] = useState(null);
    const [checkList, setCheckList] = useState(false);

    const [skipLyric, setSkipLyric] = useState(false);
    const [skipMelody, setSkipMelody] = useState(false);

    const [skip, setSkip] = useState('');
    const [createCompleteModal, setCreateCompleteModal] = useState(false);

    const skipHandler = () => {
        if (skip === 'lyric') {
            setSkipLyric(true);
        } else {
            setSkipMelody(true);
        }
        setPageNumber((prev) => prev + 1);
        setSkip(false);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    if (pageNumber === -1) return <GetStarted handler={() => setPageNumber(0)} />;

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
                        <SelectedItem
                            title={
                                <>
                                    Musical
                                    <br />
                                    Instrument
                                </>
                            }
                            value={melodyData?.melody_instrument}
                        />
                        <SelectedItem title="Tempo" value={tempo} />
                    </SelectedWrap>
                </div>
            )}
            {pageNumber === 0 && (
                <LyricLab handler={setLyricData} value={lylicData}>
                    <div className="button-wrap">
                        <div className="button-wrap__left">
                            <Button title="skip" handler={() => setSkip('lyric')} />
                        </div>
                        <Button
                            title="next"
                            disabled={!Object.values(lylicData)?.every((value) => value.length > 0)}
                            handler={() => setPageNumber((prev) => prev + 1)}
                        />
                    </div>
                </LyricLab>
            )}
            {pageNumber === 1 && (
                <MelodyMaker handler={setMelodyData} value={melodyData} tempo={tempo} setTempo={setTempo}>
                    <div className="button-wrap">
                        <div className="button-wrap__left">
                            <Button title="back" handler={() => setPageNumber((prev) => prev + -1)} />
                            <Button title="skip" handler={() => setSkip('melody')} />
                        </div>
                        <Button
                            title="next"
                            disabled={!Object.values(melodyData)?.every((value) => value.length > 0)}
                            handler={() => setPageNumber((prev) => prev + 1)}
                        />
                    </div>
                </MelodyMaker>
            )}
            {pageNumber === 2 && (
                <AlbumCoverSudio setAlbumCover={setAlbumCover}>
                    <div className="button-wrap">
                        <div className="button-wrap__left">
                            <Button title="back" handler={() => setPageNumber((prev) => prev - 1)} />
                        </div>
                        <Button title="next" disabled={!albumCover} handler={() => setPageNumber((prev) => prev + 1)} />
                    </div>
                </AlbumCoverSudio>
            )}
            {pageNumber === 3 && (
                <Finalize
                    albumCover={albumCover}
                    lylicData={lylicData}
                    melodyData={melodyData}
                    skipLyric={skipLyric}
                    skipMelody={skipMelody}
                    setCheckList={setCheckList}
                >
                    <div className="button-wrap">
                        <Button title="back" handler={() => setPageNumber((prev) => prev - 1)} />
                        <Button title="upload" disabled={!checkList} handler={() => setCreateCompleteModal(true)} />
                    </div>
                </Finalize>
            )}
            {skip && <SkipModal setSkipModal={setSkip} handler={skipHandler} />}
            {createCompleteModal && <CreateCompleteModal setCreateCompleteModal={setCreateCompleteModal} />}
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
                    value.map((item) => {
                        if (!multiple) {
                            return (
                                <span className={`values`} key={item}>
                                    {item}
                                </span>
                            );
                        } else {
                            return (
                                <ExpandedButton
                                    title={item}
                                    buttonColor="#00FFb3"
                                    borderRadius="12px 4px 12px 12px"
                                    color="#1a1a1a"
                                    style={{ height: 24, fontFamily: 'Inter400', fontSize: 14, padding: '0px 8px' }}
                                />
                            );
                        }
                    })
                ) : (
                    <p className="values">-</p>
                )}
            </div>
        </div>
    );
};

const Button = ({ title, handler, disabled = false }) => {
    let style;
    let buttonColor;
    let color;
    switch (title) {
        case 'next':
        case 'upload':
            buttonColor = '#cf0';
            color = '#000';
            break;
        case 'skip':
            buttonColor = '#6458ff';
            color = '#f1f1f1';
            break;
        case 'back':
            buttonColor = '#383838';
            color = '#f1f1f1';
            break;
        default:
    }

    if (disabled) {
        buttonColor = '#2C3A00';
        color = '#1f1f1f';
    }

    return (
        // <button className={title} disabled={disabled} onClick={handler}>
        //     {title}
        // </button>

        <ExpandedButton
            title={title}
            borderRadius={12}
            buttonColor={buttonColor}
            color={color}
            onClick={handler}
            disabled={disabled}
            style={{
                ...style,
                fontFamily: 'orbitron600',
                height: 40,
                minWidth: 140,
            }}
        />
    );
};
