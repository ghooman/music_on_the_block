import React from 'react';
import { useState } from 'react';

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

const LyricLab = ({ setPageNumber }) => {
    const [liricLab, setLiricLab] = useState({
        lyric_tag: [],
        lyric_genre: [],
        lyric_style: [],
        lyric_stylistic: [],
    });

    return (
        <div className="create__lyric-lab">
            <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SelectedWrap title="Lyric Lab">
                    <SelectedItem title="Tags" value={liricLab?.lyric_tag} />
                    <SelectedItem title="Genre" value={liricLab?.lyric_genre} />
                    <SelectedItem title="Style" value={liricLab?.lyric_style} />
                    <SelectedItem title="Stylistic" value={liricLab?.lyric_stylistic} />
                </SelectedWrap>
                {/* <SelectedWrap title="Melody Maker">
                            <SelectedItem title="Tags" />
                            <SelectedItem title="Genre" />
                            <SelectedItem title="Style" />
                            <SelectedItem title="Musical Instrument" />
                            <SelectedItem title="Tempo" />
                        </SelectedWrap> */}
            </div>
            <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <TagSelectTitle />
                <TagSelect
                    title="Popular Tags"
                    setLiricLab={setLiricLab}
                    objKey="lyric_tag"
                    selected={liricLab?.lyric_tag}
                    preset={tagPreset}
                />
                <TagSelect
                    title="Popular Genre"
                    setLiricLab={setLiricLab}
                    objKey="lyric_genre"
                    selected={liricLab?.lyric_genre}
                    preset={genrePreset}
                />
                <TagSelect
                    title="Popular Style"
                    setLiricLab={setLiricLab}
                    objKey="lyric_style"
                    selected={liricLab?.lyric_style}
                    preset={stylePreset}
                />
                <TagSelect
                    title="Popular Stylistic"
                    setLiricLab={setLiricLab}
                    objKey="lyric_stylistic"
                    selected={liricLab?.lyric_stylistic}
                    preset={stylisticPreset}
                />
            </div>
        </div>
    );
};
export default LyricLab;

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
            <div className="item-value">{value?.length > 0 ? value.map((item) => <p>{item}</p>) : <p>-</p>}</div>
        </div>
    );
};

const TagSelectTitle = () => {
    return (
        <div className="tag-select-title">
            <h2 className="tag-select-title__text">Select a Tags</h2>
            <div className="tag-select-title__notice">You can enter up to 5 keywords</div>
        </div>
    );
};

const TagSelect = ({ title, preset, setLiricLab, objKey, selected }) => {
    const [input, setInput] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    const addItem = () => {
        if (!input.trim()) return;
        setSelectedPreset(null);
        setLiricLab((prev) => {
            let copy = { ...prev };
            let set = Array.from(new Set([...copy[objKey], input]));
            copy[objKey] = set;
            return copy;
        });
        setInput('');
    };

    const deleteItem = (deleteItem) => {
        setSelectedPreset(null);
        setLiricLab((prev) => {
            let copy = { ...prev };
            copy[objKey] = copy[objKey].filter((item) => item !== deleteItem);
            return copy;
        });
    };

    const handlePreset = (key, value) => {
        setLiricLab((prev) => {
            let copy = { ...prev };
            copy[objKey] = value;
            setSelectedPreset(key);
            return copy;
        });
    };

    return (
        <div className="tag-select">
            <h3 className="tag-title">{title}</h3>
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
