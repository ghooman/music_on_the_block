import { useState } from 'react';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './SelectItem.scss';

export const SelectItemWrap = ({ children }) => {
    return <div className="tag-select-wrap">{children}</div>;
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
        <div className="create__select-components">
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
                <div className="tag-input-comment-button-wrap">
                    {color && (
                        <label className="tag-input-comment-button">
                            Select
                            <input
                                type="color"
                                // style={{ display: 'none' }}
                                onChange={(e) => setInput(e.target.value)}
                                onBlur={() => {
                                    addItem();
                                }}
                            />
                        </label>
                    )}
                    <button className="tag-input-comment-button" onClick={addItem}>
                        Comment
                    </button>
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

export default SelectItem;
