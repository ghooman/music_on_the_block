import { useState } from 'react';

import SubBanner from './SubBanner';
import SelectItem from './SelectItem';

import './MelodyMaker.scss';

const instrumentPreset = {
    Orchestra: ['Violin'],
    Band: ['Drum'],
};

const MelodyMaker = ({ children }) => {
    const [melody, setMelody] = useState({
        melody_instrument: [],
    });
    const [selectPreset, setSelectPreset] = useState({
        melody_instrument: '',
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
        setMelody((prev) => {
            let copy = { ...prev };
            let set = Array.from(new Set([...copy[key], value]));
            copy[key] = set;
            return copy;
        });
    };

    const deleteTag = (key, value) => {
        removeSelectPreset(key);
        setMelody((prev) => {
            let copy = { ...prev };
            copy[key] = copy[key].filter((item) => item !== value);
            return copy;
        });
    };

    return (
        <div className="create__melody-maker">
            <SubBanner>
                <SubBanner.Title text="Load Lyric Lab Details"></SubBanner.Title>
                <SubBanner.Message text="Quickly import shared details from the Lyric Section, such as Tags, Genre, and Style. Save time by reusing your inputs!"></SubBanner.Message>
                <SubBanner.Button title="Load Details"></SubBanner.Button>
            </SubBanner>
            <div className="tag-select-wrap mb40">
                <SelectItem title="Select a Musical Instrument" subTitle="Popular Musical Instrument">
                    <SelectItem.Preset presets={instrumentPreset}></SelectItem.Preset>
                    <SelectItem.InputAndButton handler={addTag} objKey="melody_instrument"></SelectItem.InputAndButton>
                    <SelectItem.SelectedItems
                        handler={deleteTag}
                        objKey="melody_instrument"
                        selected={melody.melody_instrument}
                    />
                </SelectItem>
            </div>
            <SubBanner>
                <SubBanner.Title text="What happens if I skip a step"></SubBanner.Title>
                <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths."></SubBanner.Message>
                <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections."></SubBanner.SubMessage>
            </SubBanner>
            {children}
        </div>
    );
};

export default MelodyMaker;
