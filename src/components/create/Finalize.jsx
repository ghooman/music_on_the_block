import { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";

import ExpandedButton from "./ExpandedButton";

import dummy_ai_artist from "../../assets/images/mypage/demo-user.png";

import "react-h5-audio-player/lib/styles.css";
import "./Finalize.scss";

const Finalize = ({
  children,
  generatedMusic,
  skipLyric,
  skipMelody,
  setCheckList,
  generatedLyric,
}) => {
  return (
    <div className="craete__finalizes">
      <MusicInfo
        generatedMusic={generatedMusic}
        skipMelody={skipMelody}
      ></MusicInfo>
      <CreatedLyrics
        skipLyric={skipLyric}
        generatedLyric={generatedLyric}
      ></CreatedLyrics>
      <CheckList setCheckList={setCheckList}></CheckList>
      {children}
    </div>
  );
};

export default Finalize;

const MusicInfo = ({ generatedMusic, skipMelody }) => {
  const datas = [
    { title: "Title", value: "Winter Serenity" },
    {
      title: "AI Artist",
      value: (
        <>
          <img src={dummy_ai_artist} alt="artist" /> Yolkhaed
        </>
      ),
      color: "white",
    },
    { title: "Ai Service", value: "AI Lyrics & Songwriting" },
    { title: "Genre", value: "Lyrics" },
    { title: "Style", value: "POP" },
    { title: "Stylistic", value: "Emotional" },
    { title: "Creation Date", value: "Sat, 04 Nov 2023 14:40:00 UTC+9" },
    {
      title: "Story",
      value: "A love story about two people overcoming challenges",
    },
  ];

  return (
    <div className="music-info">
      <div style={{ width: "100%" }}>
        <div
          className="music-info__image"
          style={{ backgroundImage: `url(${generatedMusic?.image_file})` }}
        >
          {/* <div className="music-info__image__feel-box">
                        {albumCover?.feel.map((item) => (
                            <ExpandedButton className="music-info__image__feel-item">{item}</ExpandedButton>
                        ))}
                    </div> */}
        </div>
        {/* {!skipMelody && <AudioPlayer src={generatedMusic?.audio_file} />} */}
        {!skipMelody && <AudioPlayer src={generatedMusic?.audio_file} />}
        {/* <AudioPlayer
                    src={generatedMusic?.audio_file}
                /> */}
      </div>
      <ul className="music-info__data">
        {datas.map((item) => (
          <li className="music-info__data--item">
            <div className="music-info__data--item-title">{item.title}</div>
            <div
              className="music-info__data--item-value"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CreatedLyrics = ({ skipLyric, generatedLyric }) => {
  if (skipLyric) return null;

  return (
    <div className="created-lyrics">
      <p className="created-lyrics__title">AI-Generated</p>
      <div className="created-lyrics__items">
        {/* {lyrics.map((item, index) => (
                    <div className="created-lyrics__item">
                        <p className="created-lyrics__item--part">{item.part}</p>
                        <span className="created-lyrics__item--lyrics">{item.lyrics}</span>
                    </div>
                ))} */}
        <pre style={{ backgroundColor: "transparent" }}>{generatedLyric}</pre>
      </div>
    </div>
  );
};

const CheckList = ({ setCheckList }) => {
  const [checks, setChecks] = useState([false, false, false, false]);

  const chekkkk = [
    {
      title: "Is your work finalized?",
      desc: "Are the lyrics, melody, or both finalized and ready for the next step?",
    },
    {
      title: "Does your work align with your vision?",
      desc: "Does the tone, mood, and overall content match what you envisioned?",
    },
    {
      title: "Have you reviewed all key details?",
      desc: "Make sure to double-check tags, settings, and content accuracy.",
    },
    {
      title: "Are you ready to save or upload your work?",
      desc: "Choose to save your work as a draft or upload it to the community.",
    },
  ];

  useEffect(() => {
    setCheckList(checks.every((item) => item));
  }, [checks, setCheckList]);

  return (
    <div className="check-list">
      <p className="check-list__title">Final Checklist</p>
      {chekkkk.map((item, index) => (
        <label className="check-list__items" key={`check-list-index${index}`}>
          <input
            checked={checks[index]}
            onChange={() =>
              setChecks((prev) => {
                let copy = [...prev];
                copy[index] = !copy[index];
                return copy;
              })
            }
            type="checkbox"
          ></input>
          <span className="check"></span>
          <div>
            <p className="check-list__items--title">{item.title}</p>
            <span className="check-list__items--desc">{item.desc}</span>
          </div>
        </label>
      ))}
    </div>
  );
};
