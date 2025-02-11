import { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';

import ExpandedButton from './ExpandedButton';

import dummy_ai_artist from '../../assets/images/mypage/demo-user.png';

import dummy_music from '../../assets/music/song01.mp3';

import 'react-h5-audio-player/lib/styles.css';
import './Finalize.scss';

const Finalize = ({ children, albumCover, skipLyric, skipMelody, setCheckList }) => {
    return (
        <div className="craete__finalizes">
            <MusicInfo albumCover={albumCover} skipMelody={skipMelody}></MusicInfo>
            <CreatedLyrics skipLyric={skipLyric}></CreatedLyrics>
            <CheckList setCheckList={setCheckList}></CheckList>
            {children}
        </div>
    );
};

export default Finalize;

const MusicInfo = ({ albumCover, skipLyric, skipMelody }) => {
    const datas = [
        { title: 'Title', value: 'Winter Serenity' },
        {
            title: 'AI Artist',
            value: (
                <>
                    <img src={dummy_ai_artist} alt="artist" /> Yolkhaed
                </>
            ),
            color: 'white',
        },
        { title: 'Ai Service', value: 'AI Lyric & Songwriting' },
        { title: 'Genre', value: 'Lyric' },
        { title: 'Style', value: 'POP' },
        { title: 'Stylistic', value: 'Emotional' },
        { title: 'Creation Date', value: 'Sat, 04 Nov 2023 14:40:00 UTC+9' },
        { title: 'Story', value: 'A love story about two people overcoming challenges' },
    ];

    return (
        <div className="music-info">
            <div style={{ width: '100%' }}>
                <div className="music-info__image" style={{ backgroundImage: `url(${albumCover.image})` }}>
                    <div className="music-info__image__feel-box">
                        {albumCover?.feel.map((item) => (
                            // <div className="music-info__image__feel-item">{item}</div>
                            <ExpandedButton
                                title={item}
                                buttonColor="#00ffb3"
                                color="#1a1a1a"
                                borderRadius="12px 4px 12px 12px"
                                style={{
                                    fontFamily: 'Inter400',
                                    fontSize: 14,
                                    padding: '4px 12px',
                                }}
                            />
                        ))}
                    </div>
                </div>
                {!skipMelody && <AudioPlayer src={dummy_music} />}
            </div>
            <ul className="music-info__data">
                {datas.map((item) => (
                    <li className="music-info__data--item">
                        <div className="music-info__data--item-title">{item.title}</div>
                        <div className="music-info__data--item-value" style={{ color: item.color }}>
                            {item.value}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CreatedLyrics = ({ skipLyric }) => {
    const lyrics = [
        {
            part: 'Verse1',
            lyric: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        },
        {
            part: 'Chorus',
            lyric: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        },
        {
            part: 'Verse2',
            lyric: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look",
        },
        {
            part: 'Bridge',
            lyric: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. ',
        },
        {
            part: 'Outro',
            lyric: 'it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search',
        },
    ];
    if (skipLyric) return null;

    return (
        <div className="created-lyrics">
            <p className="created-lyrics__title">AI-Generated</p>
            <div className="created-lyrics__items">
                {lyrics.map((item, index) => (
                    <div className="created-lyrics__item">
                        <p className="created-lyrics__item--part">{item.part}</p>
                        <span className="created-lyrics__item--lyric">{item.lyric}</span>
                    </div>
                ))}
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
