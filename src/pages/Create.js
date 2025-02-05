import { useEffect, useState } from 'react';
import React from 'react';

import '../styles/Create.scss';
import LyricLab from '../components/create/LyricLab';

const Create = () => {
    const [pageNumber, setPageNumber] = useState(0);

    return (
        <div className="music_create">
            <Title />
            <Progress pageNumber={pageNumber} />
            <Banner />
            {pageNumber === 0 && <LyricLab setPageNumber={setPageNumber} />}
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
                <React.Fragment>
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

const Banner = () => {
    return (
        <div className="lyric mb40">
            <p className="lyric__title">Lyric Lab</p>
            <strong className="lyric__strong">"Crafting the Perfect Words for Your Song"</strong>
            <p className="lyric__notice">
                In this step, you’ll provide the core elements for your song’s lyrics. Start by selecting up to 5
                meaningful keywords that capture the essence of your story. Then, choose a genre and emotional style
                that best matches the vibe of your song. Finally, describe the story you want to tell in up to 100
                words. AI will use this informatio
            </p>
            <div className="lyric__tip-box">
                <p className="lyric__tip-header">Tip : </p>
                <p className="lyric__tips">
                    Use keywords that represent themes or emotions, such as 'Love,' 'Dream,' or 'Adventure.' Be as
                    descriptive as possible in the story section for the best results
                </p>
            </div>
        </div>
    );
};
