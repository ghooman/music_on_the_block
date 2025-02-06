import SubBanner from './SubBanner';

import creatingIcon from '../../assets/images/icon/creating.svg';

import './AlbumCoverStudio.scss';
import { SelectItem, SelectItemWrap } from './SelectItem';
import { useEffect, useState } from 'react';

const colorPreset = {
    '#FF4550': ['#FF4550'],
    '#FF2500': ['#FF2500'],
    '#CF0': ['#CF0'],
};

const moodPreset = {
    Vintage: ['Vintage'],
    Mordern: ['Mordern'],
    Soft: ['Soft'],
    Retro: ['Retro'],
};

const texturePreset = {
    'Grainy Film': ['Grainy Film'],
    'Watercolor Splash': ['Watercolor Splash'],
    'Rough Paper': ['Rough Paper'],
};

const AlbumCoverSudio = ({ children }) => {
    const [cover, setCover] = useState({
        cover_color: [],
        cover_mood: [],
        cover_texture: [],
    });

    return (
        <div className="create__album-cover-studio">
            <SubBanner>
                <SubBanner.Title text="Generate Album Cover"></SubBanner.Title>
                <SubBanner.Message
                    text="If customization is OFF, the design will be based on your input from Steps 1 & 2.
With customization ON, the design will also reflect your additional settings."
                ></SubBanner.Message>
                <SubBanner.Button title="Generate"></SubBanner.Button>
            </SubBanner>
            <SelectItemWrap>
                <SelectItem
                    preset={colorPreset}
                    mainTitle="Color Palette"
                    subTitle="Popular Tags"
                    setter={setCover}
                    objKey="cover_color"
                    selected={cover?.cover_color}
                    color
                />
                <SelectItem
                    preset={moodPreset}
                    mainTitle="Mood Filters"
                    subTitle="Popular Mood"
                    setter={setCover}
                    objKey="cover_mood"
                    selected={cover?.cover_mood}
                />
                <SelectItem
                    preset={texturePreset}
                    mainTitle="Background Texture"
                    subTitle="Popular Texture"
                    setter={setCover}
                    objKey="cover_texture"
                    selected={cover?.cover_texture}
                />
            </SelectItemWrap>
            <CoverCreate />
            {children}
        </div>
    );
};

export default AlbumCoverSudio;

const CoverCreate = () => {
    const images = new Array(9).fill(null);

    return (
        <div className="creating mb40">
            <div className="creating-list">
                <p className="creating-list__title">Album Cover Studio History</p>
                <div className="creating-list__items">
                    {images.map((item, index) => (
                        <CreateItem />
                    ))}
                </div>
            </div>
            <div className="creating-select">
                <img src={creatingIcon} alt="creating" />
                <p className="creating-select__wait-text">Creating Your Album Cover...Please wait.</p>
            </div>
        </div>
    );
};

const CreateItem = () => {
    const [progressValue, setProgressValue] = useState(0);
    const [isCreated, setIsCreated] = useState(false);

    useEffect(() => {
        let Interval = setInterval(() => {
            let value = Math.floor(Math.random() * (100 - progressValue));
            setProgressValue((prev) => {
                if (prev >= 90) {
                    setIsCreated(true);
                    clearInterval(Interval);
                    return 100;
                } else return prev + value;
            });
        }, 1000);

        return () => {
            clearInterval(Interval);
        };
    }, []);

    return (
        <div className="creating-list__items--item">
            {isCreated ? (
                <div>완성</div>
            ) : (
                <>
                    <img src={creatingIcon} alt="creating" />
                    <progress value={progressValue} max={100}></progress>
                </>
            )}
        </div>
    );
};
