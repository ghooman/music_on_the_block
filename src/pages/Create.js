import { useEffect, useState } from 'react';
import React from 'react';

import LyricLab from '../components/create/LyricLab';
import MelodyMaker from '../components/create/MelodyMaker';
import DescriptionBanner from '../components/create/DescriptionBanner';
import AlbumCoverSudio from '../components/create/AlbumCoverStudio';
import Finalize from '../components/create/Finalize';
import SkipModal from '../components/SkipModal';

import '../styles/Create.scss';
import CreateCompleteModal from '../components/CreateCompleteModal';
import GetStarted from '../components/create/GetStarted';

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
                    {/** children은 버튼만 정의 함. */}
                    <div className="button-wrap">
                        <span></span>
                        <div className="button-wrap__right">
                            <Button title="skip" handler={() => setSkip('lyric')} />
                            <Button
                                title="next"
                                disabled={!Object.values(lylicData)?.every((value) => value.length > 0)}
                                handler={() => setPageNumber((prev) => prev + 1)}
                            />
                        </div>
                    </div>
                </LyricLab>
            )}
            {pageNumber === 1 && (
                <MelodyMaker handler={setMelodyData} value={melodyData} tempo={tempo} setTempo={setTempo}>
                    {/** children은 버튼만 정의 함. */}
                    <div className="button-wrap">
                        <Button title="back" handler={() => setPageNumber((prev) => prev + -1)} />
                        {/* <div className="button-wrap__right"> */}
                        <Button title="skip" handler={() => setSkip('melody')} />
                        <Button
                            title="next"
                            disabled={!Object.values(melodyData)?.every((value) => value.length > 0)}
                            handler={() => setPageNumber((prev) => prev + 1)}
                        />
                        {/* </div> */}
                    </div>
                </MelodyMaker>
            )}
            {pageNumber === 2 && (
                <AlbumCoverSudio setAlbumCover={setAlbumCover}>
                    {/** children은 버튼만 정의 함. */}
                    <div className="button-wrap">
                        <Button title="back" handler={() => setPageNumber((prev) => prev - 1)} />
                        <div className="button-wrap__right">
                            <Button
                                title="next"
                                disabled={!albumCover}
                                handler={() => setPageNumber((prev) => prev + 1)}
                            />
                        </div>
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
                >
                    {/** children은 버튼만 정의 함. */}
                    <CheckList setCheckList={setCheckList}></CheckList>
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

const CheckList = ({ setCheckList }) => {
    const [checks, setChecks] = useState([false, false, false, false]);

    const chekkkk = [
        {
            title: 'Is your work finalized?',
            desc: 'Are the lyrics, melody, or both finalized and ready for the next step?',
        },
        {
            title: 'Does your work align with your vision?',
            desc: 'Does the tone, mood, and overall content match what you envisioned?',
        },
        {
            title: 'Have you reviewed all key details?',
            desc: 'Make sure to double-check tags, settings, and content accuracy.',
        },
        {
            title: 'Are you ready to save or upload your work?',
            desc: 'Choose to save your work as a draft or upload it to the community.',
        },
    ];

    useEffect(() => {
        setCheckList(checks.every((item) => item));
    }, [checks, setCheckList]);

    return (
        <div className="check-list">
            <p className="check-list__title">Final Checklist</p>
            {chekkkk.map((item, index) => (
                <label className="check-list__items" key={`check-list-index${index}`}>
                    <input
                        checked={checks[index]}
                        onChange={() =>
                            setChecks((prev) => {
                                let copy = [...prev];
                                copy[index] = !copy[index];
                                return copy;
                            })
                        }
                        type="checkbox"
                    ></input>
                    <span className="check"></span>
                    <div>
                        <p className="check-list__items--title">{item.title}</p>
                        <span className="check-list__items--desc">{item.desc}</span>
                    </div>
                </label>
            ))}
        </div>
    );
};

const Button = ({ title, handler, disabled }) => {
    return (
        <button className={title} disabled={disabled} onClick={handler}>
            {title}
        </button>
    );
};
