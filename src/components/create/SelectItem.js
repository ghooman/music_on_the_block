import { useRef, useState } from 'react';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './SelectItem.scss';

const SelectItem = ({ title, subTitle, children }) => {
    return (
        <div className="create__select-components">
            <h3 className="tag-title">{title}</h3>
            <h4 className="tag-sub-title">{subTitle}</h4>
            {children}
        </div>
    );
};

SelectItem.Preset = ({ presets, seleted, handler }) => {
    return (
        <div className="tag-preset">
            {presets &&
                Object.entries(presets).map(([key, value], index) => (
                    <button
                        className={`tag-button presets ${seleted === key ? 'enable' : ''}`}
                        key={`preset-${index}`}
                        onClick={() => handler(key, value)}
                    >
                        {key}
                    </button>
                ))}
        </div>
    );
};

SelectItem.InputAndButton = ({ handler, objKey }) => {
    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const item = formData.get('item');
        handler(objKey, item);
        e.currentTarget.reset();
    };

    return (
        <div className="tag-input-box">
            <form onSubmit={onSubmit}>
                <input
                    className="tag-input"
                    placeholder="Please enter your keyword here"
                    name="item"
                    maxLength={10}
                ></input>
                <button type="submit" className="tag-input-comment-button">
                    Comment
                </button>
            </form>
        </div>
    );
};

SelectItem.SelectedItems = ({ selected, handler, objKey }) => {
    return (
        <div className="tag-selected">
            {selected.map((item, index) => (
                <button
                    className="tag-button selected"
                    key={`selected-${objKey}-${index}`}
                    onClick={() => handler(objKey, item)}
                >
                    <img src={cancelIcon} alt="close" />
                    {item}
                </button>
            ))}
        </div>
    );
};

SelectItem.SelectTempo = () => {};

// const TagSelectInput = ({ mainTitle }) => {
//     return (
//         <div className="tag-select">
//             <h3 className="tag-title">{mainTitle}</h3>
//             <input className="tag-input" type="text" placeholder="Briefly describe the story you want to tell."></input>
//         </div>
//     );
// };

export default SelectItem;
