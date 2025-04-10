// pages/Create.js
import { useEffect, useState, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ExpandedButton from "../components/create/ExpandedButton";
import LyricLab from "../components/create/LyricLab";
import MelodyMaker from "../components/create/MelodyMaker";
import DescriptionBanner from "../components/create/DescriptionBanner";
import AlbumCoverStudio from "../components/create/AlbumCoverStudio";
import Finalize from "../components/create/Finalize";
import GetStarted from "../components/create/GetStarted";
import CreateCompleteModal from "../components/CreateCompleteModal";
import SkipModal from "../components/SkipModal";
import "../styles/Create.scss";
import { getCreatePossibleCount } from "../api/getCreatePossibleCount";
import LyricChatBot from "../components/create/chatbot/LyricChatBot";
const Create = () => {
  const { token, walletAddress, isRegistered } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(-1);
  // 회원가입이나 지갑 연결이 필요한 단계(예: pageNumber가 0 이상)에서는 검사
  useEffect(() => {
    if (pageNumber >= 0 && (!walletAddress || !isRegistered)) {
      // 조건에 맞지 않으면 메인 페이지로 이동
      navigate("/");
    }
  }, [pageNumber, walletAddress, isRegistered]);

  const [lyricData, setLyricData] = useState({
    lyric_tag: [],
    lyric_genre: [],
    lyric_stylistic: [],
  });
  const [lyricStory, setLyricStory] = useState("");
  const [melodyData, setMelodyData] = useState({
    melody_tag: [],
    melody_genre: [],
    melody_gender: [],
    melody_instrument: [],
  });
  // 남은 생성횟수 확인
  const [createPossibleCount, setCreatePossibleCount] = useState(0);
  useEffect(() => {
    const fetchCreatePossibleCount = async () => {
      try {
        const response = await getCreatePossibleCount(token);
        setCreatePossibleCount(response.data);
      } catch (error) {
        console.error("Error fetching create possible count:", error);
      }
    };

    fetchCreatePossibleCount();
  }, [token]);

  const [melodyDetail, setMelodyDetail] = useState("");

  const [generatedLyric, setGeneratedLyric] = useState("");

  const [generatedMusicResult, setGeneratedMusicResult] = useState(null);

  const [tempo, setTempo] = useState([90]);
  const [checkList, setCheckList] = useState(false);

  const [skipLyric, setSkipLyric] = useState(false);
  const [skipMelody, setSkipMelody] = useState(false);

  const [skip, setSkip] = useState("");
  const [createCompleteModal, setCreateCompleteModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("KOR");
  const [albumCover, setAlbumCover] = useState(null);

  const skipHandler = () => {
    if (skip === "lyrics") {
      setSkipLyric(true);
    } else {
      setSkipMelody(true);
    }
    setPageNumber((prev) => prev + 1);
    setSkip(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  if (pageNumber === -1)
    return (
      <GetStarted
        handler={() => setPageNumber(0)}
        createPossibleCount={createPossibleCount}
      />
    );

  const isLyricPage = pageNumber === 0;
  const isMelodyPage = pageNumber === 1;
  return (
    <div className="music_create">
      <Title />
      <Progress pageNumber={pageNumber} />
      <DescriptionBanner pageNumber={pageNumber} />
      {pageNumber === 0 && (
        <LyricLab
          lyricData={lyricData}
          setLyricData={setLyricData}
          lyricStory={lyricStory}
          setLyricStory={setLyricStory}
          generatedLyric={generatedLyric}
          setGeneratedLyric={setGeneratedLyric}
          onSkip={() => setSkip("lyrics")}
          setPageNumber={setPageNumber}
          melodyData={melodyData}
          tempo={tempo}
          SelectedWrap={SelectedWrap}
          SelectedItem={SelectedItem}
          isLyricPage={isLyricPage}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          createPossibleCount={createPossibleCount}
          albumCover={albumCover}
          setAlbumCover={setAlbumCover}
        ></LyricLab>
      )}
    </div>
  );
};

export default Create;

const SelectCreateLayout = ({
  pageNumber,
  lyricData,
  lyricStory,
  melodyData,
  setMelodyData,
  melodyDetail,
  setMelodyDetail,
  tempo,
  setTempo,
  generatedLyric,
  generatedMusicResult,
  setGeneratedMusicResult,
  skip,
  setSkip,
  skipHandler,
  setPageNumber,
  SelectedWrap,
  SelectedItem,
  isMelodyPage,
  selectedLanguage,
  setSelectedLanguage,
  createPossibleCount,
  albumCover,
  setAlbumCover,
  createCompleteModal,
  setCreateCompleteModal,
}) => {
  return (
    <div>
      {pageNumber === 1 && (
        <MelodyMaker
          lyricData={lyricData}
          lyricStory={lyricStory}
          melodyData={melodyData}
          setMelodyData={setMelodyData}
          melodyDetail={melodyDetail}
          setMelodyDetail={setMelodyDetail}
          tempo={tempo}
          setTempo={setTempo}
          generatedLyric={generatedLyric}
          generatedMusicResult={generatedMusicResult}
          setGeneratedMusicResult={setGeneratedMusicResult}
          onSkip={() => setSkip("melody")}
          setPageNumber={setPageNumber}
          SelectedWrap={SelectedWrap}
          SelectedItem={SelectedItem}
          isMelodyPage={isMelodyPage}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          createPossibleCount={createPossibleCount}
          albumCover={albumCover}
          setAlbumCover={setAlbumCover}
        ></MelodyMaker>
      )}
      {/* {pageNumber === 2 && (
        <AlbumCoverStudio
          setAlbumCover={setAlbumCover}
          lyricData={lyricData}
          generatedLyric={generatedLyric}
        >
          <div className="button-wrap">
            <div className="button-wrap__left">
              <ExpandedButton
                className="back"
                onClick={() => setPageNumber((prev) => prev - 1)}
              >
                Back
              </ExpandedButton>
            </div>
            <ExpandedButton
              className="next"
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={!albumCover}
            >
              Next
            </ExpandedButton>
          </div>
        </AlbumCoverStudio>
      )} */}

      {/* {pageNumber === 2 && (
        <Finalize
          generatedMusic={generatedMusic}
          generatedLyric={generatedLyric}
          lyricData={lyricData}
          melodyData={melodyData}
          skipLyric={skipLyric}
          skipMelody={skipMelody}
          setCheckList={setCheckList}
        >
          <div className="button-wrap">
            <ExpandedButton
              className="back"
              onClick={() => setPageNumber((prev) => prev - 1)}
            >
              Back
            </ExpandedButton>
            <ExpandedButton
              className="next"
              disabled={!checkList}
              onClick={() => setCreateCompleteModal(true)}
            >
              Upload
            </ExpandedButton>
          </div>
        </Finalize>
      )} */}

      {skip && <SkipModal setSkipModal={setSkip} handler={skipHandler} />}
      {createCompleteModal && (
        <CreateCompleteModal setCreateCompleteModal={setCreateCompleteModal} />
      )}
    </div>
  );
};

const Title = () => {
  return <h1 className="title">Recommended Music Source</h1>;
};

const Progress = ({ pageNumber }) => {
  const pages = [
    "Lyrics Lab",
    "Melody Maker",
    // "Alubum Cover Studio",
    // "Preview & Finalize",
  ];

  return (
    <div className="progress mb40">
      {pages.map((item, index, { length }) => (
        <React.Fragment key={item}>
          <div className="progress__item">
            <div
              className={`progress__square ${
                pageNumber >= index ? "enable" : ""
              }`}
            ></div>
            <p
              className={`progress__text ${
                pageNumber >= index ? "enable" : ""
              }`}
            >
              {item}
            </p>
          </div>
          {length - 1 > index && (
            <span
              className={`progress__arrow ${
                pageNumber >= index ? "enable" : ""
              }`}
            ></span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const SelectedWrap = ({ children, title }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };
  return (
    <div className={`selected-wrap ${isActive ? "active" : ""}`}>
      <h2 className="wrap-title" onClick={handleToggle}>
        {title}
      </h2>
      <div className="wrap-content">{children}</div>
    </div>
  );
};

const SelectedItem = ({ title, value, multiple }) => {
  return (
    <div className={`selected-item ${multiple ? "multiple" : ""}`}>
      <p className="item-title">{title}</p>
      <div className="item-value">
        {value?.length > 0 ? (
          value.map((item) => {
            if (!multiple) {
              return (
                <span className={`values`} key={item}>
                  {item}
                </span>
              );
            } else {
              return (
                <ExpandedButton className="values multiple">
                  {item}
                </ExpandedButton>
              );
            }
          })
        ) : (
          <p className="values">-</p>
        )}
      </div>
    </div>
  );
};
