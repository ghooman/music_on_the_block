import { useEffect, useState } from 'react';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemTempo, SelectItemWrap, SelectItemStory } from './SelectItem';

import './MelodyMaker.scss';

const tagPreset = {
    Love: ['passionate', 'romantic', 'tender', 'endearing', 'devoted'],
    Trable: ['chaotic', 'turbulent', 'unsettling', 'difficult', 'hectic'],
    Winter: ['frosty', 'chilly', 'serene', 'crisp', 'snowy'],
};

const genrePreset = {
    POP: ['POP'],
    Ballad: ['Ballad'],
    'R&B': ['R&B'],
    Rock: ['Rock'],
};

const stylePreset = {
    Happy: ['Happy'],
    Sad: ['Sad'],
    Excitement: ['Excitement'],
    Passionate: ['Passionate'],
};

const instrumentPreset = {
    Guitar: ['Guitar'],
    Piano: ['Piano'],
    Drums: ['Drums'],
    Bass: ['Bass'],
};

const MelodyMaker = ({ handler, children }) => {
    const [melody, setMelody] = useState({
        melody_tag: [],
        melody_genre: [],
        melody_style: [],
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
                    mainTitle="Select a Tags"
                    subTitle="Popular Tags"
                    setter={setMelody}
                    objKey="melody_tag"
                    selected={melody?.melody_tag}
                    preset={tagPreset}
                    multiple
                />
                <SelectItem
                    mainTitle="Select a Genre"
                    subTitle="Popular Genre"
                    setter={setMelody}
                    objKey="melody_genre"
                    selected={melody?.melody_genre}
                    preset={genrePreset}
                />
                <SelectItem
                    mainTitle="Select a Style"
                    subTitle="Popular Style"
                    setter={setMelody}
                    objKey="melody_style"
                    selected={melody?.melody_style}
                    preset={stylePreset}
                />
                <SelectItem
                    mainTitle="Select a Musical Instrument"
                    subTitle="Popular Musical Instrument"
                    setter={setMelody}
                    objKey="melody_instrument"
                    selected={melody?.melody_instrument}
                    preset={instrumentPreset}
                />
                <SelectItemTempo />
                <SelectItemStory />
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
