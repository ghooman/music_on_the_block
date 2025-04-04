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
  Love: ["Love"],
  Moon: ["Moon"],
  Travel: ["Travel"],
  Winter: ["Winter"],
  Cafe: ["Cafe"],
  School: ["School"],
  Space: ["Space"],
  Nature: ["Nature"],
  Cat: ["Cat"],
  Strawberry: ["Strawberry"],
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
  "Child (0~12)": ["Child"],
  "Teen (13~18)": ["Teen"],
  "Young Adult (19~29)": ["Young Adult"],
  "MiddleAge (30~49)": ["MiddleAge"],
  "Senior (50~)": ["Senior"],
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
  lyricStory,
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
  createPossibleCount,
}) => {
  const {
    melody_tag,
    melody_genre,
    melody_gender,
    melody_age,
    melody_instrument,
  } = melodyData || {};
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
    (melody_gender &&
      melody_gender.length > 0 &&
      melody_gender[0].trim() !== "") ||
    (melody_age && melody_age.length > 0 && melody_age[0].trim() !== "") ||
    (melody_instrument &&
      melody_instrument.length > 0 &&
      melody_instrument[0].trim() !== "") ||
    (melodyStory && melodyStory.trim() !== "");

  const promptPreview = `
      Language: ${selectedLanguage},
      ${melody_tag ? "Tags:" + melody_tag.join(", ") : ""}
      ${melody_genre ? "Genre:" + melody_genre?.join(", ") : ""}
      ${melody_gender ? "Gender" + melody_gender?.join(", ") : ""} 
      ${melody_age ? "Age:" + melody_age?.join(", ") : ""}
      ${melody_instrument ? "Instrument:" + melody_instrument?.join(", ") : ""}
      ${melodyStory ? "Story : " + melodyStory : ""}
      Tempo : ${tempo}
      `;
  const formData = {
    title: title,
    story: melodyStory,
    language: selectedLanguage,
    lyrics: generatedLyric,
    genre: melody_genre?.[0] ? melody_genre?.[0] : "",
    style: "",
    gender: melody_gender?.[0] ? melody_gender?.[0] : "",
    voice_age: melody_age?.[0] ? melody_age?.[0] : "",
    musical_instrument: melody_instrument?.[0] ? melody_instrument?.[0] : "",
    tags: melody_tag ? melody_tag.join(", ") : "",
    image: "",
    tempo: parseFloat(tempo),
    song_length: "",
    mood: "",
    ai_service: "",
    ai_service_type: "",
    mood: "",
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
      navigate(`/album`);
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
      <RemainCountButton createPossibleCount={createPossibleCount} />
      <SubBanner>
        <SubBanner.RightImages src={subBg1} />
        <SubBanner.Title text="View Lyric Lab Results"></SubBanner.Title>
        <SubBanner.Message text="These lyrics were previously written by AI in Lyric Lab."></SubBanner.Message>
        <SubBanner.Message text="Based on these lyrics, AI composition is currently in progress in Melody Maker."></SubBanner.Message>
        <SubBanner.Button
          title="View Lyrics"
          handler={() => alert("가사 보여주기!")}
        ></SubBanner.Button>
      </SubBanner>

      <SelectItemWrap currentStep={"isMelodyPage"}>
        <SubBanner>
          <SubBanner.LeftImages src={subBg2} />
          <SubBanner.Title text="Select a Tags" />
          <SubBanner.Message text="Please select tags that can express the mood, emotion, and image of the song." />
          <SelectItem
            subTitle="Popular Tags"
            setter={setMelodyData}
            objKey="melody_tag"
            selected={melodyData?.melody_tag}
            preset={tagPreset}
            className="sub-banner__tags"
            multiple
          />
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
          objKey="melody_gender"
          selected={melodyData?.melody_gender}
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
          <SelectedItem title="Stylistic" value={lylicData?.lyric_stylistic} />
          <div className="lyric-lab__selected-item">
            <p className="lyric-lab__selected-item--title">Your Story</p>
            <p className="lyric-lab__selected-item--text">
              {lyricStory || "-"}
            </p>
          </div>
        </SelectedWrap>
      </div>
      {isMelodyPage && (
        <SelectedWrap title="Melody Maker">
          <SelectedItem title="Tags" value={melodyData?.melody_tag} multiple />
          <SelectedItem title="Genre" value={melodyData?.melody_genre} />
          <SelectedItem title="Gender" value={melodyData?.melody_gender} />
          <SelectedItem title="Age" value={melodyData?.melody_age} />
          {/* <SelectedItem title="Story" value={melodyStory} /> */}
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
