import { useRef, useState } from 'react';
import { useRanger, Ranger } from '@tanstack/react-ranger';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './SelectItem.scss';
import ExpandedButton from './ExpandedButton';

export const SelectItemWrap = ({ children, dropdown }) => {
    const [visible, setVisible] = useState(!dropdown);

    return (
        <div className="create__select-components">
            <div className="tag-select-title">
                <h2 className="tag-select-title__text">Select a Tags</h2>
                {dropdown && (
                    <div
                        className={`tag-select-title__dropdown-toggle ${visible ? 'visible' : ''}`}
                        onClick={() => setVisible((prev) => !prev)}
                    >
                        <div className={`tag-select-title__dropdown-thumb ${visible ? 'visible' : ''}`}></div>
                    </div>
                )}
            </div>
            {visible ? children : null}
        </div>
    );
};

export const SelectItem = ({ mainTitle, subTitle, preset, setter, objKey, selected, multiple, color }) => {
    const [input, setInput] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    const addItem = () => {
        if (!input.trim()) return;
        setSelectedPreset(null);

        setter((prev) => {
            let copy = { ...prev };
            if (multiple) {
                let set = Array.from(new Set([...copy[objKey], input]));
                if (set.length > 5) {
                    set.shift();
                }
                copy[objKey] = set;
            } else {
                copy[objKey] = [input];
            }
            return copy;
        });
        setInput('');
    };

    const deleteItem = (deleteItem) => {
        setSelectedPreset(null);
        setter((prev) => {
            let copy = { ...prev };
            copy[objKey] = copy[objKey].filter((item) => item !== deleteItem);
            return copy;
        });
    };

    const handlePreset = (key, value) => {
        setter((prev) => {
            let copy = { ...prev };
            copy[objKey] = value;
            setSelectedPreset(key);
            return copy;
        });
    };

    return (
        <div className="tag-select">
            <div className="tag-title__block">
                <h3 className="tag-title">{mainTitle}</h3>
                <p className="tag-title__notice">
                    {multiple ? 'You can enter up to 5 keywords' : ' You can select only one option'}
                </p>
            </div>
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
                <div className="tag-input-comment-button-wrap">
                    {color && (
                        <label className="tag-input-comment-button">
                            Select
                            <input
                                type="color"
                                onChange={(e) => setInput(e.target.value)}
                                onBlur={() => {
                                    addItem();
                                }}
                            />
                        </label>
                    )}
                    {/* <button className="tag-input-comment-button" onClick={addItem}>
                        Add
                    </button> */}
                    <ExpandedButton
                        title="Add"
                        buttonColor="#cf0"
                        borderRadius={12}
                        color="#1a1a1a"
                        style={{ width: 120, height: 30, fontFamily: 'orbitron600', fontSize: 14 }}
                        onClick={addItem}
                    />
                </div>
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

export const SelectItemTempo = ({ tempo, setTempo }) => {
    const rangeRef = useRef(null);

    const rangesInstance = useRanger({
        getRangerElement: () => rangeRef.current,
        values: tempo,
        min: 60,
        max: 250,
        stepSize: 1,
        onChange: (instance) => {
            setTempo(instance.sortedValues);
        },
    });

    return (
        <div className="tag-select">
            <div className="tag-title__block">
                <h3 className="tag-title">Select a Tempo</h3>
            </div>
            <div
                className={`tag-title__tempos ${
                    tempo > 59 && tempo < 80 ? 'slow' : tempo > 80 && tempo < 120 ? 'medium' : tempo > 120 ? 'fast' : ''
                }`}
            >
                {tempo > 59 && tempo < 80 && 'Slow : Calm and reflective (60-80 BPM)'}
                {tempo > 80 && tempo < 120 && 'Medium: Balanced and versatile (81-120 BPM)'}
                {tempo > 120 && 'Fast: Energetic and upbeat (121-160 BPM)'}
            </div>
            <div className="tag-select__range" ref={rangeRef}>
                {rangesInstance?.getSteps().map(() => {
                    return (
                        <div
                            className="tag-select__range--applicable"
                            style={{ width: `${rangesInstance.getPercentageForValue(tempo)}%` }}
                        ></div>
                    );
                })}
                {rangesInstance
                    .handles()
                    ?.map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart, isActive }, i) => (
                        <button
                            className="tag-select__range--thumb"
                            key={i}
                            onKeyDown={onKeyDownHandler}
                            onMouseDown={onMouseDownHandler}
                            onTouchStart={onTouchStart}
                            role="slider"
                            aria-valuemin={rangesInstance.options.min}
                            aria-valuemax={rangesInstance.options.max}
                            aria-valuenow={value}
                            style={{
                                left: `${rangesInstance.getPercentageForValue(value)}%`,
                            }}
                        >
                            <div className="tag-select__range--thumb-tick">
                                <span>{value}</span> BPM
                            </div>
                        </button>
                    ))}
            </div>
        </div>
    );
};

export const SelectItemStory = () => {
    return (
        <div className="tag-select">
            <div className="tag-title__block">
                <h3 className="tag-title">Your Story</h3>
                <p className="tag-title__notice">You can enter up to 100 words</p>
            </div>
            <textarea className="tag-input" type="text" placeholder="Briefly describe the story you want to tell." />
        </div>
    );
};
