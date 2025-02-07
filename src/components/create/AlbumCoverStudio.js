import { SelectItem, SelectItemWrap } from './SelectItem';
import { useEffect, useState } from 'react';

import SubBanner from './SubBanner';

import creatingIcon from '../../assets/images/icon/creating.svg';
import demoImage from '../../assets/images/intro/intro-demo-img.png';
import demoImage2 from '../../assets/images/intro/intro-demo-img2.png';
import demoImage3 from '../../assets/images/intro/intro-demo-img3.png';
import demoImage4 from '../../assets/images/demo/album01.svg';
import demoImage5 from '../../assets/images/demo/album02.svg';
import demoImage6 from '../../assets/images/demo/album03.svg';
import demoImage7 from '../../assets/images/demo/album04.svg';
import demoImage8 from '../../assets/images/demo/album05.svg';
import demoImage9 from '../../assets/images/demo/album06.svg';

import './AlbumCoverStudio.scss';

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

const AlbumCoverSudio = ({ children, setAlbumCover }) => {
    const [cover, setCover] = useState({
        cover_color: [],
        cover_mood: [],
        cover_texture: [],
    });

    const [coverCreate, setCoverCreate] = useState(false);

    return (
        <div className="create__album-cover-studio">
            <SelectItemWrap dropdown>
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
            <SubBanner>
                <SubBanner.Title text="Generate Album Cover"></SubBanner.Title>
                <SubBanner.Message
                    text="If customization is OFF, the design will be based on your input from Steps 1 & 2.
With customization ON, the design will also reflect your additional settings."
                ></SubBanner.Message>
                <SubBanner.Button
                    title="Generate"
                    handler={() => {
                        setCoverCreate(false);
                        setTimeout(() => {
                            setCoverCreate(true);
                        }, 200);
                    }}
                ></SubBanner.Button>
            </SubBanner>
            <CoverCreate coverCreate={coverCreate} setAlbumCover={setAlbumCover} />
            {children}
        </div>
    );
};

export default AlbumCoverSudio;

const CoverCreate = ({ coverCreate, setAlbumCover }) => {
    const [selectImage, setSelectImage] = useState(null);
    const images = [
        { image: demoImage, feel: [] },
        { image: demoImage2, feel: [] },
        { image: demoImage3, feel: [] },
        { image: demoImage4, feel: [] },
        { image: demoImage5, feel: [] },
        { image: demoImage6, feel: [] },
        { image: demoImage7, feel: [] },
        { image: demoImage8, feel: [] },
        { image: demoImage9, feel: [] },
    ];

    useEffect(() => {
        if (coverCreate === false) {
            setSelectImage(null);
        }
    }, [coverCreate]);

    useEffect(() => {
        setAlbumCover(selectImage);
    }, [selectImage]);

    return (
        <div className="creating mb40">
            <div className="creating-list">
                <p className="creating-list__title">Album Cover Studio History</p>
                <div className="creating-list__items">
                    {images.map((item, index) => (
                        <CreateItem item={item} setSelectImage={setSelectImage} key={index} coverCreate={coverCreate} />
                    ))}
                </div>
            </div>
            <div
                className="creating-select"
                style={{ backgroundImage: selectImage ? `url(${selectImage.image})` : '' }}
            >
                {!selectImage && (
                    <>
                        <img src={creatingIcon} alt="creating" />
                        <p className="creating-select__wait-text">Creating Your Album Cover...Please wait.</p>
                    </>
                )}
            </div>
        </div>
    );
};

const CreateItem = ({ item, setSelectImage, coverCreate }) => {
    const [progressValue, setProgressValue] = useState(0);
    const [isCreated, setIsCreated] = useState(false);

    useEffect(() => {
        if (!coverCreate) {
            setProgressValue(0);
            setIsCreated(false);
            return;
        }
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
    }, [coverCreate]);

    return (
        <div
            className="creating-list__items--item"
            onClick={() => {
                if (!isCreated) return;
                setSelectImage(item);
            }}
            style={{ backgroundImage: isCreated && coverCreate ? `url(${item.image})` : '' }}
        >
            {!isCreated && (
                <>
                    <img src={creatingIcon} alt="creating" />
                    <progress value={progressValue} max={100}></progress>
                </>
            )}
        </div>
    );
};
