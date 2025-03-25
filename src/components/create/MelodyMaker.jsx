import { useState,useEffect } from "react";
import axios from "axios";

import SubBanner from "./SubBanner";
import {
  SelectItem,
  SelectItemTempo,
  SelectItemWrap,
  SelectItemStory,
} from "./SelectItem";
import ExpandedButton from "./ExpandedButton";

import subBg1 from "../../assets/images/create/subbanner-bg1.png";
import subBg2 from "../../assets/images/create/subbanner-bg2.png";

import "./MelodyMaker.scss";
import AudioPlayer from "react-h5-audio-player";
import CreateLoading from "../CreateLoading";

const tagPreset = {
  Love: ["passionate", "romantic", "tender", "endearing", "devoted"],
  Trable: ["chaotic", "turbulent", "unsettling", "difficult", "hectic"],
  Winter: ["frosty", "chilly", "serene", "crisp", "snowy"],
};

const genrePreset = {
  POP: ["POP"],
  Ballad: ["Ballad"],
  "R&B": ["R&B"],
  Rock: ["Rock"],
};

const stylePreset = {
  Happy: ["Happy"],
  Sad: ["Sad"],
  Excitement: ["Excitement"],
  Passionate: ["Passionate"],
};

const instrumentPreset = {
  Guitar: ["Guitar"],
  Piano: ["Piano"],
  Drums: ["Drums"],
  Bass: ["Bass"],
};

const MelodyMaker = ({
  melodyData,
  setMelodyData,
  melodyStory,
  setMelodyStory,
  tempo,
  setTempo,
  generatedLyric,
  generatedMusicResult,
  setGeneratedMusicResult,
  setGeneratedMusic,
  setPageNumber,
  onSkip,
}) => {
  const { melody_tag, melody_genre, melody_style, melody_instrument } =
    melodyData || {};

  const [loading, setLoading] = useState(false);
  const [selectMusic, setSelectMusic] = useState(null);
  const promptPreview = `
      Tags : ${melody_tag ? melody_tag.join(", ") : ""}
      Genre : ${melody_genre?.[0] ? melody_genre?.[0] : ""}
      Style : ${melody_style?.[0] ? melody_style?.[0] : ""}
      Instrument : ${melody_instrument?.[0] ? melody_instrument?.[0] : ""}
      Story : ${melodyStory}
      `;

  const formData = {
    is_auto: 0,
    prompt: promptPreview,
    lyrics: generatedLyric,
    title: "제목",
    instrumental: 0,
  };

  console.log("노래 생성 데이터", formData.prompt);
  console.log("노래 생성 데이터 길이", formData.prompt.length);

  const musicGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://api.topmediai.com/v1/music",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "f47d348dc08d492492a7a5d546d40f4a", // 필요한 경우 API 키를 추가하세요.
          },
        }
      );
      setGeneratedMusicResult(res.data.data);
      console.log("handleSubmit", res.data.data);
    } catch (err) {
      alert("에러 발생");
      console.log("handleSubmit", err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (generatedMusicResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [generatedMusicResult]);

  if (!generatedMusicResult)
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
            setter={setMelodyData}
            objKey="melody_tag"
            selected={melodyData?.melody_tag}
            preset={tagPreset}
            multiple
          />
          <SelectItem
            mainTitle="Select a Genre"
            subTitle="Popular Genre"
            setter={setMelodyData}
            objKey="melody_genre"
            selected={melodyData?.melody_genre}
            preset={genrePreset}
          />
          <SelectItem
            mainTitle="Select a Style"
            subTitle="Popular Style"
            setter={setMelodyData}
            objKey="melody_style"
            selected={melodyData?.melody_style}
            preset={stylePreset}
          />
          <SelectItem
            mainTitle="Select a Musical Instrument"
            subTitle="Popular Musical Instrument"
            setter={setMelodyData}
            objKey="melody_instrument"
            selected={melodyData?.melody_instrument}
            preset={instrumentPreset}
          />
          <SelectItemTempo tempo={tempo} setTempo={setTempo} />
          <SelectItemStory value={melodyStory} setter={setMelodyStory} />
          <div className="selected-tag-list">
            <div className="selected-tag-list__title">
              <h3>Selected Tags (max_length : 150)</h3>
              <span>
                current length :
                <span style={{ color: promptPreview?.length > 150 && "red" }}>
                  {promptPreview?.length}
                </span>
              </span>
            </div>
            <div className="selected-tag-list__tags">
              <pre>{promptPreview}</pre>
            </div>
          </div>
        </SelectItemWrap>
        <SubBanner>
          <SubBanner.LeftImages src={subBg2} />
          <SubBanner.Title text="What happens if I skip a step"></SubBanner.Title>
          <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths."></SubBanner.Message>
          <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections."></SubBanner.SubMessage>
        </SubBanner>
        <div className="button-wrap">
          <div className="button-wrap__left">
            <ExpandedButton
              className="back"
              onClick={() => setPageNumber((prev) => prev + -1)}
            >
              Back
            </ExpandedButton>
            <ExpandedButton className="skip" onClick={onSkip}>
              Skip
            </ExpandedButton>
          </div>
          <ExpandedButton
            className="next"
            // onClick={() => setPageNumber((prev) => prev + 1)}
            onClick={() => musicGenerate()}
            disabled={
              // !Object.values(melodyData)?.every((values) => values.length > 0) ||
              loading || promptPreview.length > 150
            }
          >
            {loading ? "Loading" : "Generate"}
          </ExpandedButton>
        </div>
        {loading && <CreateLoading textTrue />}
      </div>
    );
  else if (generatedMusicResult)
    return (
      <div className="response">
        <h2>MUSIC</h2>
        <div className="music-response">
          {generatedMusicResult &&
            generatedMusicResult.map((item) => (
              <div
                className={`music-response-item ${
                  item.item_uuid === selectMusic?.item_uuid ? "active" : ""
                }`}
                key={item.item_uuid}
                onClick={() => setSelectMusic(item)}
              >
                <img src={item.image_file} alt={item.title} />
                <div className="music-info">
                  <h3>{item.title}</h3>
                  {/* <p>
                      <strong>Tags:</strong> {item.tag}
                  </p> */}
                  {/* <audio controls>
                    <source src={item.audio_file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio> */}
                  <AudioPlayer src={item.audio_file} />
                </div>
              </div>
            ))}
        </div>
        <pre className="lyrics-box">{generatedMusicResult?.[0]?.lyric}</pre>
        {/* <pre>{JSON.stringify(generatedResult, null, 2)}</pre> */}
        <div className="button-wrap">
          <div className="button-wrap__left">
            <ExpandedButton
              className="back"
              onClick={() => setPageNumber((prev) => prev + -1)}
            >
              Back
            </ExpandedButton>
            {/* <ExpandedButton className="skip" onClick={onSkip}>
                            Skip
                        </ExpandedButton> */}
          </div>
          <ExpandedButton
            className="next"
            // onClick={() => setPageNumber((prev) => prev + 1)}
            onClick={() => {
              setGeneratedMusic(selectMusic);
              setPageNumber((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!selectMusic}
          >
            Select
          </ExpandedButton>
        </div>
      </div>
    );
};

export default MelodyMaker;
