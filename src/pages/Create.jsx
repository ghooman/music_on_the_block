// pages/Create.js
import { useEffect, useState, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ExpandedButton from "../components/create/ExpandedButton";
import LyricLab from "../components/create/LyricLab";
import MelodyMaker from "../components/create/MelodyMaker";
import DescriptionBanner from "../components/create/DescriptionBanner";
import AlbumCoverSudio from "../components/create/AlbumCoverStudio";
import Finalize from "../components/create/Finalize";
import GetStarted from "../components/create/GetStarted";
import CreateCompleteModal from "../components/CreateCompleteModal";
import SkipModal from "../components/SkipModal";
import "../styles/Create.scss";

const Create = () => {
  const { walletAddress, isRegistered } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(-1);
  // 회원가입이나 지갑 연결이 필요한 단계(예: pageNumber가 0 이상)에서는 검사
  useEffect(() => {
    if (pageNumber >= 0 && (!walletAddress || !isRegistered)) {
      // 조건에 맞지 않으면 메인 페이지로 이동
      navigate("/");
    }
  }, [pageNumber, walletAddress, isRegistered, navigate]);
  const [lylicData, setLyricData] = useState({
    lyric_tag: [],
    lyric_genre: [],
    lyric_style: [],
    lyric_stylistic: [],
  });
  const [lyricStory, setLyricStory] = useState("");

  const [melodyData, setMelodyData] = useState({
    melody_tag: [],
    melody_genre: [],
    melody_style: [],
    melody_instrument: [],
  });
  const [melodyStory, setMelodyStory] = useState("");

  const [generatedLyric, setGeneratedLyric] = useState("");
  const [generatedMusic, setGeneratedMusic] = useState({});

  const [generatedMusicResult, setGeneratedMusicResult] = useState(null);

  const [tempo, setTempo] = useState([90]);
  const [checkList, setCheckList] = useState(false);

  const [skipLyric, setSkipLyric] = useState(false);
  const [skipMelody, setSkipMelody] = useState(false);

  const [skip, setSkip] = useState("");
  const [createCompleteModal, setCreateCompleteModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ENG");
  const skipHandler = () => {
    if (skip === "lyric") {
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

  if (pageNumber === -1) return <GetStarted handler={() => setPageNumber(0)} />;

  const isLyricPage = pageNumber === 0;
  const isMelodyPage = pageNumber === 1;

  return (
    <div className="music_create">
      <Title />
      <Progress pageNumber={pageNumber} />
      <DescriptionBanner pageNumber={pageNumber} />
      {/* {pageNumber !== 2 && (
                <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SelectedWrap title="Lyric Lab">
                        <SelectedItem title="Tags" value={lylicData?.lyric_tag} multiple />
                        <SelectedItem title="Genre" value={lylicData?.lyric_genre} />
                        <SelectedItem title="Style" value={lylicData?.lyric_style} />
                        <SelectedItem title="Stylistic" value={lylicData?.lyric_stylistic} />
                    </SelectedWrap>
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
                </div>
            )} */}
      {pageNumber === 0 && (
        <LyricLab
          lylicData={lylicData}
          setLyricData={setLyricData}
          lyricStory={lyricStory}
          setLyricStory={setLyricStory}
          setLy
          generatedLyric={generatedLyric}
          setGeneratedLyric={setGeneratedLyric}
          onSkip={() => setSkip("lyric")}
          setPageNumber={setPageNumber}
          melodyData={melodyData}
          tempo={tempo}
          SelectedWrap={SelectedWrap}
          SelectedItem={SelectedItem}
          isLyricPage={isLyricPage}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        ></LyricLab>
      )}
      {pageNumber === 1 && (
        <MelodyMaker
          melodyData={melodyData}
          setMelodyData={setMelodyData}
          melodyStory={melodyStory}
          setMelodyStory={setMelodyStory}
          tempo={tempo}
          setTempo={setTempo}
          generatedLyric={generatedLyric}
          generatedMusic={generatedMusic}
          setGeneratedMusic={setGeneratedMusic}
          generatedMusicResult={generatedMusicResult}
          setGeneratedMusicResult={setGeneratedMusicResult}
          onSkip={() => setSkip("melody")}
          setPageNumber={setPageNumber}
          SelectedWrap={SelectedWrap}
          SelectedItem={SelectedItem}
          isMelodyPage={isMelodyPage}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        ></MelodyMaker>
      )}
      {/* {pageNumber === 2 && (
                <AlbumCoverSudio setAlbumCover={setAlbumCover}>
                    <div className="button-wrap">
                        <div className="button-wrap__left">
                            <ExpandedButton className="back" onClick={() => setPageNumber((prev) => prev - 1)}>
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
                </AlbumCoverSudio>
            )}

      {pageNumber === 2 && (
        <Finalize
          generatedMusic={generatedMusic}
          generatedLyric={generatedLyric}
          lylicData={lylicData}
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

export default Create;

const Title = () => {
  return <h1 className="title">Recommended Music Source</h1>;
};

const Progress = ({ pageNumber }) => {
  const pages = [
    "Lyric Lab",
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
