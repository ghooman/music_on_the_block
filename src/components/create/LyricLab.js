import React, { useEffect } from 'react';
import { useState } from 'react';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemWrap, SelectItemStory } from './SelectItem';

import subBg2 from '../../assets/images/create/subbanner-bg2.png';

import './LyricLab.scss';

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

const stylisticPreset = {
    Poetic: ['Poetic'],
    Emotional: ['Emotional'],
    Bold: ['Bold'],
    Soft: ['Soft'],
};

const LyricLab = ({ handler, children, value }) => {
    return (
        <div className="create__lyric-lab">
            <SelectItemWrap>
                <SelectItem
                    mainTitle="Selet a Tags"
                    subTitle="Popular Tags"
                    setter={handler}
                    objKey="lyric_tag"
                    selected={value?.lyric_tag}
                    preset={tagPreset}
                    multiple
                />
                <SelectItem
                    mainTitle="Select a Genre"
                    subTitle="Popular Genre"
                    setter={handler}
                    objKey="lyric_genre"
                    selected={value?.lyric_genre}
                    preset={genrePreset}
                />
                <SelectItem
                    mainTitle="Select a Style"
                    subTitle="Popular Style"
                    setter={handler}
                    objKey="lyric_style"
                    selected={value?.lyric_style}
                    preset={stylePreset}
                />
                <SelectItem
                    mainTitle="Select a Stylistic"
                    subTitle="Popular Stylistic"
                    setter={handler}
                    objKey="lyric_stylistic"
                    selected={value?.lyric_stylistic}
                    preset={stylisticPreset}
                />
                <SelectItemStory />
            </SelectItemWrap>
            <SubBanner>
                <SubBanner.LeftImages src={subBg2} />
                <SubBanner.Title text="What happens if I skip a step?" />
                <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths." />
                <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections." />
            </SubBanner>
            {children} {/** 버튼 */}
        </div>
    );
};
export default LyricLab;
