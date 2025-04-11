import { SelectItem, SelectItemWrap } from "./SelectItem";
import { useEffect, useState } from "react";
import SubBanner from "./SubBanner";
import ExpandedButton from "./ExpandedButton";

import creatingIcon from "../../assets/images/icon/creating.svg";
import demoImage from "../../assets/images/intro/intro-demo-img.png";
import demoImage2 from "../../assets/images/intro/intro-demo-img2.png";
import demoImage3 from "../../assets/images/intro/intro-demo-img3.png";
import demoImage4 from "../../assets/images/demo/album01.svg";
import demoImage5 from "../../assets/images/demo/album02.svg";
import demoImage6 from "../../assets/images/demo/album03.svg";
import demoImage7 from "../../assets/images/demo/album04.svg";
import demoImage8 from "../../assets/images/demo/album05.svg";
import demoImage9 from "../../assets/images/demo/album06.svg";

import subBg3 from "../../assets/images/create/subbanner-bg3.png";
import OpenAI from "openai";

import "./AlbumCoverStudio.scss";

const colorPreset = {
  "#FF4550": ["#FF4550"],
  "#FF2500": ["#FF2500"],
  "#CF0": ["#CF0"],
};

const moodPreset = {
  Vintage: ["Vintage"],
  Mordern: ["Mordern"],
  Soft: ["Soft"],
  Retro: ["Retro"],
};

const texturePreset = {
  "Grainy Film": ["Grainy Film"],
  "Watercolor Splash": ["Watercolor Splash"],
  "Rough Paper": ["Rough Paper"],
};
// OpenAI 클라이언트 초기화
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // .env 파일 등에 저장된 API 키 사용
  dangerouslyAllowBrowser: true,
});
const AlbumCoverStudio = ({ children, lyricData, generatedLyrics }) => {
  const [cover, setCover] = useState({
    cover_color: [],
    cover_mood: [],
    cover_texture: [],
  });
  console.log("generatedLyrics", generatedLyrics);
  const [coverCreate, setCoverCreate] = useState(false);
  const [albumCover, setAlbumCover] = useState(null);
  const [inputPrompt, setInputPrompt] = useState("");
  // 지피티 DALL-E API 호출
  const generateAlbumCover = async () => {
    try {
      const response = await client.images.generate({
        model: "dall-e-2",
        prompt:
          generatedLyrics +
          "앞에 첨부한 가사를 기반으로 앨범 커버 디자인을 생성해줄래",
        size: "256x256",
        // quality: "standard",
        n: 1,
      });
      //   const response = await client.images.generate({
      //     model: "dall-e-3",
      //     prompt:
      //       generatedLyrics +
      //       "앞에 첨부한 가사를 기반으로 앨범 커버 디자인을 생성해줄래",
      //     size: "1024x1024",
      //     quality: "standard",
      //     n: 1,
      //   });
      console.log(response.data);
      setAlbumCover(response.data[0].url);
    } catch (error) {
      console.error("Error generating album cover:", error);
    }
  };
  return (
    <div className="create__album-cover-studio">
      <div className="create__album-cover-studio--title">
        <h2>Album Cover Studio</h2>
        <p>Generate your own album cover with AI</p>
      </div>
      <div className="create__album-cover-studio--input">
        <input
          type="text"
          placeholder="Enter your prompt here"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
        />
        <button onClick={generateAlbumCover}>Generate</button>
      </div>
      <div className="create__album-cover-studio--cover">
        <div className="create__album-cover-studio--cover--info">
          <img src={albumCover || demoImage} alt="Album Cover" />
        </div>
      </div>
      {/* <SelectItemWrap dropdown>
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
        <SubBanner.RightImages src={subBg3} />
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
            }, 2);
          }}
        ></SubBanner.Button>
      </SubBanner>
      <CoverCreate coverCreate={coverCreate} setAlbumCover={setAlbumCover} />
      {children} */}
    </div>
  );
};

export default AlbumCoverStudio;

const CoverCreate = ({ coverCreate, setAlbumCover }) => {
  const [selectImage, setSelectImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { image: demoImage, feel: ["Exiting", "Minilalist"] },
    { image: demoImage2, feel: ["Loud", "April"] },
    { image: demoImage3, feel: ["Heart", "Beat"] },
    { image: demoImage4, feel: ["Japan", "Tired"] },
    { image: demoImage5, feel: ["Sunset", "Sunglass"] },
    { image: demoImage6, feel: ["Pain", "Press"] },
    { image: demoImage7, feel: ["Organic", "Shadow", "Dance"] },
    { image: demoImage8, feel: ["Space", "Void", "Stars", "Science"] },
    { image: demoImage9, feel: ["Scared", "Sweet", "Girl"] },
  ];

  useEffect(() => {
    if (coverCreate === false) {
      setSelectImage(null);
      setAlbumCover(null);
    }
  }, [coverCreate, setSelectImage, setAlbumCover]);

  console.log(selectImage?.progress);

  return (
    <div className="creating mb40">
      <div className="creating-list">
        <p className="creating-list__title">Album Cover Studio History</p>
        <div className="creating-list__items">
          {images.map((item, index) => (
            <CreateItem
              item={item}
              setSelectImage={setSelectImage}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              key={index}
              index={index}
              coverCreate={coverCreate}
            />
          ))}
        </div>
      </div>
      <div
        className="creating-select"
        style={{
          backgroundImage: selectImage?.isCreated
            ? `url(${selectImage.image})`
            : "",
        }}
      >
        {selectImage?.isCreated && (
          <>
            <div className="creating-select__feel-box">
              {selectImage?.feel.map((item) => (
                <ExpandedButton className="creating-select__feel-item">
                  {item}
                </ExpandedButton>
              ))}
            </div>

            <ExpandedButton
              className="creating-select__confirm"
              onClick={() => setAlbumCover(selectImage)}
            >
              Confirm
            </ExpandedButton>
          </>
        )}
        {!selectImage?.isCreated && (
          <>
            <img src={creatingIcon} alt="creating" />
            <p className="creating-select__wait-text">
              Creating Your Album Cover...Please wait.
            </p>
            <progress value={selectImage?.progress} max={100}></progress>
          </>
        )}
      </div>
    </div>
  );
};

const CreateItem = ({
  item,
  setSelectImage,
  coverCreate,
  currentIndex,
  index,
  setCurrentIndex,
}) => {
  const [progressValue, setProgressValue] = useState(0);
  const [isCreated, setIsCreated] = useState(false);

  let Interval;

  useEffect(() => {
    if (currentIndex === index) {
      setSelectImage((prev) => {
        return { ...item, progress: progressValue, isCreated };
      });
    }
  }, [progressValue, currentIndex]);

  useEffect(() => {
    if (!coverCreate) {
      setProgressValue(0);
      setIsCreated(false);
      clearInterval(Interval);
      return;
    }
    Interval = setInterval(() => {
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
      className={`creating-list__items--item ${
        index === currentIndex ? "selected" : ""
      }`}
      onClick={() => {
        setCurrentIndex(index);
      }}
      style={{
        backgroundImage: isCreated && coverCreate ? `url(${item.image})` : "",
      }}
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
