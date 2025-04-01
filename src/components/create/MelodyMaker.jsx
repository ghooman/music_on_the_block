import "./MelodyMaker.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SubBanner from "./SubBanner";
import {
  SelectItem,
  SelectItemTempo,
  SelectItemWrap,
  SelectItemStory,
} from "./SelectItem";
import ExpandedButton from "./ExpandedButton";
import CompleteModal from "./../SingUpCompleteModal";
import subBg1 from "../../assets/images/create/subbanner-bg1.png";
import subBg2 from "../../assets/images/create/subbanner-bg2.png";
import CreateLoading from "../CreateLoading";
import { AuthContext } from "../../contexts/AuthContext";

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

// localStorage에 앨범 id와 만료 시각을 저장하는 함수 (15분)
const albumIdStorageKey = "generatedAlbumId";
const storeAlbumId = (id) => {
  const expires = Date.now() + 15 * 60 * 1000; // 15분 후
  localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, expires }));
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
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
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
      Tags : ${melody_tag ? melody_tag.join(", ") : ""}
      Genre : ${melody_genre ? melody_genre?.join(", ") : ""}
      Style : ${melody_style ? melody_style?.join(", ") : ""}
      Instrument : ${melody_instrument ? melody_instrument?.join(", ") : ""}
      Story : ${melodyStory}
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
    tempo: 0,
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
      // 서버로부터 받은 앨범 고유 id를 localStorage에 저장 (15분 만료)
      storeAlbumId(res.data.id);
      setShowModal(true);
      setGeneratedMusicResult(res.data);
      console.log("handleSubmit", res);
      console.log("storeAlbumId", res.data.id);
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
      <SubBanner>
        <SubBanner.RightImages src={subBg1} />
        <SubBanner.Title text="Load Lyric Lab Details"></SubBanner.Title>
        <SubBanner.Message text="Quickly import shared details from the Lyric Section, such as Tags, Genre, and Style. Save time by reusing your inputs!"></SubBanner.Message>
        <SubBanner.Button title="Load Details"></SubBanner.Button>
      </SubBanner>
      <SelectItemWrap
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      >
        <p className="title__text">Title</p>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
          multiple
          add
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
        <SelectItemStory value={melodyStory} setter={setMelodyStory} />
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
      <SubBanner>
        <SubBanner.LeftImages src={subBg2} />
        <SubBanner.Title text="What happens if I skip a step"></SubBanner.Title>
        <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths."></SubBanner.Message>
        <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections."></SubBanner.SubMessage>
      </SubBanner>

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
      {showModal && (
        <CompleteModal
          setShowModal={setShowModal}
          message="Your song is successfully created!"
          link={`/album-detail/${generatedMusicResult?.id}`}
        />
      )}
    </div>
  );
};

export default MelodyMaker;
