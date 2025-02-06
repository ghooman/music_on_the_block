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

const LyricLab = ({ setPageNumber, setLiric, children }) => {
    const [lyric, setLyric] = useState({
        lyric_tag: [],
        lyric_genre: [],
        lyric_style: [],
        lyric_stylistic: [],
    });

    const [selectPreset, setSelectPreset] = useState({
        lyric_tag: '',
        lyric_genre: '',
        lyric_style: '',
        lyric_stylistic: '',
    });

    const removeSelectPreset = (key) => {
        setSelectPreset((prev) => {
            let copy = { ...prev };
            copy[key] = '';
            return copy;
        });
    };

    const addTag = (key, value) => {
        removeSelectPreset(key);
        setLyric((prev) => {
            let copy = { ...prev };
            let set = Array.from(new Set([...copy[key], value]));
            copy[key] = set;
            return copy;
        });
    };

    const deleteTag = (key, value) => {
        removeSelectPreset(key);
        setLyric((prev) => {
            let copy = { ...prev };
            copy[key] = copy[key].filter((item) => item !== value);
            return copy;
        });
    };

    useEffect(() => {
        setLiric(lyric);
    }, [lyric]);

    return (
        <div className="create__lyric-lab">
            <div className="tag-select-wrap mb40">
                <TagSelectTitle />
                <SelectItem title="Select a Tags" subTitle="Popular Tags">
                    <SelectItem.Preset presets={tagPreset}></SelectItem.Preset>
                    <SelectItem.InputAndButton handler={addTag} objKey="lyric_tag"></SelectItem.InputAndButton>
                    <SelectItem.SelectedItems handler={deleteTag} objKey="lyric_tag" selected={lyric.lyric_tag} />
                </SelectItem>
                <SelectItem title="Select a Genre" subTitle="Popular Genre">
                    <SelectItem.Preset presets={genrePreset}></SelectItem.Preset>
                    <SelectItem.InputAndButton handler={addTag} objKey="lyric_genre"></SelectItem.InputAndButton>
                    <SelectItem.SelectedItems handler={deleteTag} objKey="lyric_genre" selected={lyric.lyric_genre} />
                </SelectItem>
                <SelectItem title="Select a Style" subTitle="Popular Style">
                    <SelectItem.Preset presets={stylePreset}></SelectItem.Preset>
                    <SelectItem.InputAndButton handler={addTag} objKey="lyric_style"></SelectItem.InputAndButton>
                    <SelectItem.SelectedItems handler={deleteTag} objKey="lyric_style" selected={lyric.lyric_style} />
                </SelectItem>
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

const TagSelect = ({ mainTitle, subTitle, preset, setLyric, objKey, selected }) => {
    const [input, setInput] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    const addItem = () => {
        if (!input.trim()) return;
        setSelectedPreset(null);
        setLyric((prev) => {
            let copy = { ...prev };
            let set = Array.from(new Set([...copy[objKey], input]));
            copy[objKey] = set;
            return copy;
        });
        setInput('');
    };

    const deleteItem = (deleteItem) => {
        setSelectedPreset(null);
        setLyric((prev) => {
            let copy = { ...prev };
            copy[objKey] = copy[objKey].filter((item) => item !== deleteItem);
            return copy;
        });
    };

    const handlePreset = (key, value) => {
        setLyric((prev) => {
            let copy = { ...prev };
            copy[objKey] = value;
            setSelectedPreset(key);
            return copy;
        });
    };

    return (
        <div className="tag-select">
            <h3 className="tag-title">{mainTitle}</h3>
            <h4 className="tag-sub-title">{subTitle}</h4>
            <div className="tag-preset">
                {preset &&
                    Object.entries(preset).map(([key, value], index) => (
                        <button
                            className={`tag-button presets ${selectedPreset === key ? 'enable' : ''}`}
                            key={`preset-${index}`}
                            onClick={() => handlePreset(key, value)}
                        >
                            {key}
                        </button>
                    ))}
            </div>
            <div className="tag-input-box">
                <input
                    value={input}
                    className="tag-input"
                    placeholder="Please enter your keyword here"
                    maxLength={10}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') addItem();
                    }}
                ></input>
                <button className="tag-input-comment-button" onClick={addItem}>
                    Comment
                </button>
            </div>
            <div className="tag-selected">
                {selected.map((item, index) => (
                    <button className="tag-button selected" key={`selected-${index}`} onClick={() => deleteItem(item)}>
                        <img src={cancelIcon} alt="close" />
                        {item}
                    </button>
                ))}
            </div>
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
