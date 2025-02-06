import React, { useEffect } from 'react';
import { useState } from 'react';

import SubBanner from './SubBanner';
import SelectItem from './SelectItem';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './LyricLab.scss';

const tagPreset = {
    Love: ['passionate', 'romantic', 'tender', 'endearing', 'devoted'],
    Trable: ['chaotic', 'turbulent', 'unsettling', 'difficult', 'hectic'],
    Winter: ['frosty', 'chilly', 'serene', 'crisp', 'snowy'],
};

const genrePreset = {
    POP: ['Catchy', 'Upbeat', 'Mainstream', 'Melodic', 'Danceable'],
    Ballad: ['Emotional', 'Slow', 'Heartfelt', 'Melancholic', 'Romantic'],
    'R&B': ['Smooth', 'Groovy', 'Soulful', 'Rhythmic', 'Sensual'],
    Rock: ['Energetic', 'Loud', 'Gritty', 'Powerful', 'Rebellious'],
};

const stylePreset = {
    Happy: ['Cheerful', 'Lively', 'Optimistic', 'Jolly', 'Vibrant'],
    Sad: ['Melancholic', 'Gloomy', 'Mournful', 'Sorrowful', 'Haunting'],
    Excitement: ['Thrilling', 'Exhilarating', 'Dynamic', 'Intense', 'Electrifying'],
    Passionate: ['Fiery', 'Emotive', 'Powerful', 'Dramatic', 'Fervent'],
};

const stylisticPreset = {
    Poetic: ['Lyrical', 'Metaphorical', 'Elegant', 'Expressive', 'Symbolic'],
    Emotional: ['Heartfelt', 'Touching', 'Deep', 'Sentimental', 'Intense'],
    Bold: ['Striking', 'Confident', 'Unapologetic', 'Brave', 'Fearless'],
    Soft: ['Gentle', 'Smooth', 'Subtle', 'Delicate', 'Mellow'],
};

const LyricLab = ({ handler, children }) => {
    const [lyric, setLyric] = useState({
        lyric_tag: [],
        lyric_genre: [],
        lyric_style: [],
        lyric_stylistic: [],
    });

    useEffect(() => {
        handler(lyric);
    }, [lyric, handler]);

    return (
        <div className="create__lyric-lab">
            <div className="tag-select-wrap mb40">
                <TagSelectTitle />
                <SelectItem
                    mainTitle="Popular Tags"
                    subTitle="Popular Tags"
                    setLyric={setLyric}
                    objKey="lyric_tag"
                    selected={lyric?.lyric_tag}
                    preset={tagPreset}
                />
                <SelectItem
                    mainTitle="Popular Tags"
                    subTitle="Popular Tags"
                    setLyric={setLyric}
                    objKey="lyric_genre"
                    selected={lyric?.lyric_genre}
                    preset={genrePreset}
                />
                <SelectItem
                    mainTitle="Popular Tags"
                    subTitle="Popular Tags"
                    setLyric={setLyric}
                    objKey="lyric_style"
                    selected={lyric?.lyric_style}
                    preset={stylePreset}
                />
                <SelectItem
                    mainTitle="Popular Tags"
                    subTitle="Popular Tags"
                    setLyric={setLyric}
                    objKey="lyric_stylistic"
                    selected={lyric?.lyric_stylistic}
                    preset={stylisticPreset}
                />
                <TagSelectInput mainTitle="Your Story" />
            </div>
            <SubBanner>
                <SubBanner.Title text="What happens if I skip a step?" />
                <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths." />
                <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections." />
            </SubBanner>
            {children} {/** 버튼 */}
        </div>
    );
};
export default LyricLab;

const TagSelectTitle = () => {
    return (
        <div className="tag-select-title">
            <h2 className="tag-select-title__text">Select a Tags</h2>
            <div className="tag-select-title__notice">You can enter up to 5 keywords</div>
        </div>
    );
};

const TagSelectInput = ({ mainTitle }) => {
    return (
        <div className="tag-select">
            <h3 className="tag-title">{mainTitle}</h3>
            <input className="tag-input" type="text" placeholder="Briefly describe the story you want to tell."></input>
        </div>
    );
};
