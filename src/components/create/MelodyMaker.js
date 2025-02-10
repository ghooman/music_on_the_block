import { useEffect, useState } from 'react';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemTempo, SelectItemWrap, SelectItemStory } from './SelectItem';

import subBg1 from '../../assets/images/create/subbanner-bg1.png';
import subBg2 from '../../assets/images/create/subbanner-bg2.png';
import subBg3 from '../../assets/images/create/subbanner-bg3.png';

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

const MelodyMaker = ({ handler, value, children, tempo, setTempo }) => {

    return (
        <div className="create__melody-maker">
            <SubBanner>
                <SubBanner.RightImages src={subBg1} />
                <SubBanner.Title text="Load Lyric Lab Details"></SubBanner.Title>
                <SubBanner.Message text="Quickly import shared details from the Lyric Section, such as Tags, Genre, and Style. Save time by reusing your inputs!"></SubBanner.Message>
                <SubBanner.Button title="Load Details"></SubBanner.Button>
            </SubBanner>
            <SelectItemWrap>
                <SelectItem
                    mainTitle="Select a Tags"
                    subTitle="Popular Tags"
                    setter={handler}
                    objKey="melody_tag"
                    selected={value?.melody_tag}
                    preset={tagPreset}
                    multiple
                />
                <SelectItem
                    mainTitle="Select a Genre"
                    subTitle="Popular Genre"
                    setter={handler}
                    objKey="melody_genre"
                    selected={value?.melody_genre}
                    preset={genrePreset}
                />
                <SelectItem
                    mainTitle="Select a Style"
                    subTitle="Popular Style"
                    setter={handler}
                    objKey="melody_style"
                    selected={value?.melody_style}
                    preset={stylePreset}
                />
                <SelectItem
                    mainTitle="Select a Musical Instrument"
                    subTitle="Popular Musical Instrument"
                    setter={handler}
                    objKey="melody_instrument"
                    selected={value?.melody_instrument}
                    preset={instrumentPreset}
                />
                <SelectItemTempo tempo={tempo} setTempo={setTempo} />
                <SelectItemStory />
            </SelectItemWrap>
            <SubBanner>
                <SubBanner.LeftImages src={subBg2} />
                <SubBanner.Title text="What happens if I skip a step"></SubBanner.Title>
                <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths."></SubBanner.Message>
                <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections."></SubBanner.SubMessage>
            </SubBanner>
            {children}
        </div>
    );
};

export default MelodyMaker;
