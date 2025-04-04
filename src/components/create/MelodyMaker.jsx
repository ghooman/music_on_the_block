import "./MelodyMaker.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubBanner from "./SubBanner";
import {
  SelectItem,
  SelectItemTempo,
  SelectItemWrap,
  SelectItemInputOnly,
} from "./SelectItem";
import ExpandedButton from "./ExpandedButton";
import CompleteModal from "./../SingUpCompleteModal";
import subBg1 from "../../assets/images/create/subbanner-bg1.png";
import subBg2 from "../../assets/images/create/subbanner-bg2.png";
import CreateLoading from "../CreateLoading";
import { AuthContext } from "../../contexts/AuthContext";
import { RemainCountButton } from "../unit/RemainCountButton";
const tagPreset = {
  Joyful: ["Joyful"],
  Melancholic: ["Melancholic"],
  Playful: ["Playful"],
  Romantic: ["Romantic"],
  Whimsical: ["Whimsical"],
  Majestic: ["Majestic"],
  Ethereal: ["Ethereal"],
  Serene: ["Serene"],
  Mysterious: ["Mysterious"],
  Soothing: ["Soothing"],
  Energetic: ["Energetic"],
  Powerful: ["Powerful"],
  Chill: ["Chill"],
  Hypnotic: ["Hypnotic"],
  Edgy: ["Edgy"],
};

const genrePreset = {
  POP: ["POP"],
  Ballad: ["Ballad"],
  "R&B": ["R&B"],
  Rock: ["Rock"],
  EDM: ["EDM"],
  Jazz: ["Jazz"],
  Classic: ["Classic"],
  HipHop: ["HipHop"],
  Latin: ["Latin"],
};

const genderPreset = {
  "Male Solo": ["Male Solo"],
  "Female Solo": ["Female Solo"],
  "Male Group": ["Male Group"],
  "Female Group": ["Female Group"],
  "Mixed Group": ["Mixed Group"],
};

const agePreset = {
  "Infant (0~5)": ["Infant (0~5)"],
  "Child (6~12)": ["Child (6~12)"],
  "Teen (13~18)": ["Teen (13~18)"],
  "Young Adult (19~29)": ["Young Adult (19~29)"],
  "MiddleAge (30~49)": ["MiddleAge (30~49)"],
  "Senior (50~)": ["Senior (50~)"],
};

const instrumentPreset = {
  Guitar: ["Guitar"],
  Piano: ["Piano"],
  Drums: ["Drums"],
  Bass: ["Bass"],
  Violin: ["Violin"],
  Cello: ["Cello"],
  Flute: ["Flute"],
  Trumpet: ["Trumpet"],
  Harp: ["Harp"],
  Synthesizer: ["Synthesizer"],
};

// localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분)
const albumIdStorageKey = "generatedAlbumId";
const storeAlbumId = (id, title) => {
  const expires = Date.now() + 15 * 60 * 1000; // 15분 후
  localStorage.setItem(
    albumIdStorageKey,
    JSON.stringify({ id, title, expires })
  );
};

const MelodyMaker = ({
  lylicData,
  melodyData,
  setMelodyData,
  melodyStory,
  setMelodyStory,
  tempo,
  setTempo,
  generatedLyric,
  generatedMusicResult,
  setGeneratedMusicResult,
  setPageNumber,
  onSkip,
  SelectedWrap,
  SelectedItem,
  isMelodyPage,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const { melody_tag, melody_genre, melody_style, melody_instrument } =
    melodyData || {};
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  // const [showModal, setShowModal] = useState(false);
  // 각 필드에 값이 있는지 확인하는 변수
  const isAnyFieldFilled =
    (title && title.trim() !== "") ||
    (melody_tag && melody_tag.length > 0) ||
    (melody_genre &&
      melody_genre.length > 0 &&
      melody_genre[0].trim() !== "") ||
    (melody_style &&
      melody_style.length > 0 &&
      melody_style[0].trim() !== "") ||
    (melody_instrument &&
      melody_instrument.length > 0 &&
      melody_instrument[0].trim() !== "") ||
    (melodyStory && melodyStory.trim() !== "");

  const promptPreview = `
      Language: ${selectedLanguage},
      ${melody_tag ? "Tags:" + melody_tag.join(", ") : ""}
      ${melody_genre ? "Genre:" + melody_genre?.join(", ") : ""}
      ${melody_style ? "Style:" + melody_style?.join(", ") : ""}
      ${melody_instrument ? "Instrument:" + melody_instrument?.join(", ") : ""}
      ${melodyStory ? "Story : " + melodyStory : ""}
      Tempo : ${tempo}
      `;
  const formData = {
    title: title,
    ai_service: "",
    ai_service_type: "",
    lyrics: generatedLyric,
    genre: melody_genre?.[0] ? melody_genre?.[0] : "",
    style: melody_style?.[0] ? melody_style?.[0] : "",
    language: selectedLanguage,
    mood: "",
    musical_instrument: "",
    story: melodyStory,
    tags: melody_tag ? melody_tag.join(", ") : "",
    specific_lyrics: "",
    image: "",
    tempo: tempo,
    color_palette: "",
    song_length: "",
  };

  // 노래 생성 요청 함수 수정
  const musicGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${serverApi}/api/music/album/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": "f47d348dc08d492492a7a5d546d40f4a", // 필요한 경우 API 키 추가
        },
      });
      storeAlbumId(res.data.id, res.data.title);
      // setShowModal(true);
      setGeneratedMusicResult(res.data);
      console.log("handleSubmit", res);
      console.log("storeAlbumId", res.data.id, res.data.title);
      navigate(`/my-page?category=Albums`);
    } catch (err) {
      alert("에러 발생");
      console.log("handleSubmit error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generatedMusicResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [generatedMusicResult]);

  // if (!generatedMusicResult)
  return (
    <div className="create__melody-maker">
      <RemainCountButton remainingCount={1} />
      <SubBanner>
        <SubBanner.RightImages src={subBg1} />
        <SubBanner.Title text="Load Lyric Lab Details"></SubBanner.Title>
        <SubBanner.Message text="Quickly import shared details from the Lyric Section, such as Tags, Genre, and Style. Save time by reusing your inputs!"></SubBanner.Message>
        <SubBanner.Button
          title="Load Details"
          handler={() => alert("가사 보여주기!")}
        ></SubBanner.Button>
      </SubBanner>

      <SelectItemWrap currentStep={"isMelodyPage"}>
        <SubBanner>
          <SubBanner.LeftImages src={subBg2} />
          <SubBanner.Title text="Select a Tags" />
          <SubBanner.Message text="Please select tags that can express the mood, emotion, and image of the song." />
          <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections." />
        </SubBanner>
        <SelectItemInputOnly value={title} setter={setTitle} title="Title" />
        <SelectItem
          mainTitle="Select a Genre"
          subTitle="Popular Genre"
          setter={setMelodyData}
          objKey="melody_genre"
          selected={melodyData?.melody_genre}
          preset={genrePreset}
        />
        <SelectItem
          mainTitle="Select a Gender"
          subTitle="Popular Gender"
          setter={setMelodyData}
          objKey="melody_voice"
          selected={melodyData?.melody_voice}
          preset={genderPreset}
        />
        <SelectItem
          mainTitle="Select Age"
          subTitle="Popular Age"
          setter={setMelodyData}
          objKey="melody_age"
          selected={melodyData?.melody_age}
          preset={agePreset}
        />
        <SelectItem
          mainTitle="Select a Musical Instrument"
          subTitle="Popular Musical Instrument"
          setter={setMelodyData}
          objKey="melody_instrument"
          selected={melodyData?.melody_instrument}
          preset={instrumentPreset}
          multiple
          add
        />
        <SelectItemTempo tempo={tempo} setTempo={setTempo} />
        <SelectItemInputOnly
          value={melodyStory}
          setter={setMelodyStory}
          title="Your Story"
        />
        <div className="selected-tag-list">
          <div className="selected-tag-list__title">
            <h3>Selected Tags (max_length : 200)</h3>
            <span>
              current length :
              <span style={{ color: promptPreview?.length > 200 && "red" }}>
                {promptPreview?.length}
              </span>
            </span>
          </div>
          <div className="selected-tag-list__tags">
            <pre>{promptPreview}</pre>
          </div>
        </div>
      </SelectItemWrap>
      <div
        className="mb40"
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <SelectedWrap title="Lyric Lab">
          <SelectedItem title="Tags" value={lylicData?.lyric_tag} multiple />
          <SelectedItem title="Genre" value={lylicData?.lyric_genre} />
          <SelectedItem title="Style" value={lylicData?.lyric_style} />
          <SelectedItem title="Stylistic" value={lylicData?.lyric_stylistic} />
        </SelectedWrap>
      </div>
      {isMelodyPage && (
        <SelectedWrap title="Melody Maker">
          <SelectedItem title="Tags" value={melodyData?.melody_tag} multiple />
          <SelectedItem title="Genre" value={melodyData?.melody_genre} />
          <SelectedItem title="Style" value={melodyData?.melody_style} />
          <SelectedItem
            title={
              <>
                Musical
                <br />
                Instrument
              </>
            }
            value={melodyData?.melody_instrument}
          />
          <SelectedItem title="Tempo" value={tempo} />
        </SelectedWrap>
      )}
      <div className="button-wrap">
        <div className="button-wrap__left">
          <ExpandedButton
            className="back"
            onClick={() => setPageNumber((prev) => prev + -1)}
          >
            Back
          </ExpandedButton>
          {/* 임시 위치 ui상 style none으로 */}
          <ExpandedButton
            className="skip"
            onClick={onSkip}
            style={{ display: "none" }}
          >
            Skip
          </ExpandedButton>
        </div>
        <ExpandedButton
          className={
            loading || promptPreview.length > 200 || !isAnyFieldFilled
              ? "next"
              : "next enable"
          }
          onClick={() => musicGenerate()}
          disabled={loading || promptPreview.length > 200 || !isAnyFieldFilled}
        >
          {loading ? "Loading" : "Generate"}
        </ExpandedButton>
      </div>
      {loading && <CreateLoading textTrue />}
      {/* {showModal && (
        <CompleteModal
          setShowModal={setShowModal}
          message="Your song is successfully created!"
          link={`/album-detail/${generatedMusicResult?.id}`}
        />
      )} */}
    </div>
  );
};

export default MelodyMaker;
