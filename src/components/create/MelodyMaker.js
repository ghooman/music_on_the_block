import { useEffect, useState } from 'react';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemWrap } from './SelectItem';

import './MelodyMaker.scss';

const instrumentPreset = {
    Orchestra: ['Violin', 'Chello', 'Timpani'],
    Band: ['Drum', 'Guitar', 'Bass', 'Synth'],
};

const MelodyMaker = ({ handler, children }) => {
    const [melody, setMelody] = useState({
        melody_instrument: [],
    });

    useEffect(() => {
        handler(melody);
    }, [melody, handler]);

    return (
        <div className="create__melody-maker">
            <SubBanner>
                <SubBanner.Title text="Load Lyric Lab Details"></SubBanner.Title>
                <SubBanner.Message text="Quickly import shared details from the Lyric Section, such as Tags, Genre, and Style. Save time by reusing your inputs!"></SubBanner.Message>
                <SubBanner.Button title="Load Details"></SubBanner.Button>
            </SubBanner>
            <SelectItemWrap>
                <SelectItem
                    mainTitle="Popular Tags"
                    subTitle="Popular Tags"
                    setter={setMelody}
                    objKey="melody_instrument"
                    selected={melody?.melody_instrument}
                    preset={instrumentPreset}
                />
            </SelectItemWrap>
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
