// components/create/chatbot/MelodyChatBot.js
import "../../../styles/ChatBot.scss";
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import CreateLoading from "../../CreateLoading";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import defaultCoverImg from "../../../assets/images/header/logo.svg";
import mobProfilerImg from "../../../assets/images/mob-profile-img01.svg";
// 언어별 리소스 파일 불러오기
import koMelody from "../../../locales/koMelody";
import enMelody from "../../../locales/enMelody";
const MelodyChatBot = ({
  createLoading,
  setCreateLoading,
  lyricData,
  lyricStory,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
  melodyData,
  setMelodyData,
  selectedLanguage, // "KOR" 또는 "ENG"
  albumCover,
  setAlbumCover,
}) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  // 선택된 언어에 따라 리소스 파일 선택
  const locale = selectedLanguage === "ENG" ? enMelody : koMelody;
  const {
    melody_tag = [],
    melody_genre = "",
    melody_gender = "",
    melody_instrument = "",
    melody_tempo = "",
    melody_detail = "",
    melody_title = "",
  } = melodyData || {};

  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: locale.chatbot.initialMessage },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // OpenAI 클라이언트 초기화
  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // 예시: getChatResponse 함수 내에서 프롬프트 관련 내용을 각각의 상태로 저장하는 부분
  async function getChatResponse() {
    setLoading(true);
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: locale.chatbot.systemMessage,
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, "");

      // [태그 추출]
      if (locale.extraction.tagRegex.test(botMessage)) {
        const tagMatch = botMessage.match(locale.extraction.tagRegex);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(",")
            .map((tag) => tag.trim());
          setMelodyData((prevData) => ({
            ...prevData,
            melody_tag: extractedTags,
          }));
        }
      }

      // [곡의 타이틀 추출]
      if (locale.extraction.titleRegex.test(botMessage)) {
        const titleMatch = botMessage.match(locale.extraction.titleRegex);
        if (titleMatch && titleMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_title: titleMatch[1].trim(),
          }));
        }
      }

      // [장르 추출]
      if (locale.extraction.genreRegex.test(botMessage)) {
        const genreMatch = botMessage.match(locale.extraction.genreRegex);
        if (genreMatch && genreMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_genre: genreMatch[1].trim(),
          }));
        }
      }

      // [보이스 추출]
      if (locale.extraction.voiceRegex.test(botMessage)) {
        const voiceMatch = botMessage.match(locale.extraction.voiceRegex);
        if (voiceMatch && voiceMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_gender: voiceMatch[1].trim(),
          }));
        }
      }

      // [악기 추출]
      // 영어의 경우 'Instruments ('를 사용하도록 업데이트합니다.
      if (locale.extraction.instrumentRegex.test(botMessage)) {
        const instrumentMatch = botMessage.match(
          locale.extraction.instrumentRegex
        );
        if (instrumentMatch && instrumentMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_instrument: instrumentMatch[1].trim(),
          }));
        }
      }

      // [템포 추출]
      if (locale.extraction.tempoRegex.test(botMessage)) {
        const tempoMatch = botMessage.match(locale.extraction.tempoRegex);
        if (tempoMatch && tempoMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_tempo: tempoMatch[1].trim(),
          }));
        }
      }

      // [추가 요소/스토리 추출]
      if (locale.extraction.detailRegex.test(botMessage)) {
        const detailMatch = botMessage.match(locale.extraction.detailRegex);
        if (detailMatch && detailMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_detail: detailMatch[1].trim(),
          }));
        }
      }

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "assistant", content: botMessage },
      ]);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setLoading(false);
    }
  }

  // 사용자 입력 처리
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // 사용자 메시지 전송 처리
  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userInput },
      ]);
      getChatResponse();
      setUserInput("");
    }
  };

  // Enter 키 이벤트 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  // ====== 앨범 커버 생성 함수 (앨범 커버 URL 반환) ======
  // 앨범커버프롬프트

  const generateAlbumCover = async () => {
    try {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `
        [가사 데이터]
        태그: ${lyricData?.lyric_tag.join(", ")}
        장르: ${lyricData?.lyric_genre?.[0]}
        스타일: ${lyricData?.lyric_stylistic?.[0]}
        
        [노래 스토리]
        ${lyricStory}
        
        [디자인 요청]
        앨범 커버 디자인 : 
        - 위에 태그 또는 장르, 스토리가 있을 경우 그에 대한 디자인 요소를 포함할 것.
        - 태그가 없을 경우, 일반적인 감정이나 주제를 반영한 디자인을 생성할 것.
        - 이미지에는 위의 키워드들을 반영하여, 예를 들어 "${lyricData?.lyric_tag.join(
          ", "
        )}"와 "${lyricData?.lyric_genre?.[0]}"의 느낌을 표현할 것.
        - 주인공 및 스토리 요소 ("${lyricStory}")를 강조하여, 캐릭터와 분위기를 구체적으로 묘사할 것.
      `,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      console.log("prompt", prompt);
      console.log("generateAlbumCover:", response.data);
      const cover = response.data[0].url;
      setAlbumCover(cover);
      return cover;
    } catch (error) {
      console.error("앨범 커버 생성 오류:", error);
      return null;
    }
  };

  // ====== 음악 생성 함수 ========
  // localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분)
  const albumIdStorageKey = "generatedAlbumId";
  const storeAlbumId = (id, title) => {
    const expires = Date.now() + 15 * 60 * 1000; // 15분 후
    localStorage.setItem(
      albumIdStorageKey,
      JSON.stringify({ id, title, expires })
    );
  };
  // musicGenerate 함수 수정: coverUrl 인자를 받아 사용
  const musicGenerate = async (coverUrl) => {
    try {
      const formData = {
        album: {
          title: melody_title,
          detail: melody_detail,
          language: selectedLanguage,
          genre: melody_genre,
          style: "",
          gender: melody_gender,
          musical_instrument: melody_instrument,
          ai_service: "",
          ai_service_type: "",
          tempo: parseInt(melody_tempo),
          song_length: "",
          lyrics: generatedLyric,
          mood: "",
          tags: melody_tag?.join(", ") || "",
          cover_image: coverUrl, // 직접 전달받은 coverUrl 사용
        },
        album_lyrics_info: {
          language: selectedLanguage,
          feelings: "", // 현재 사용하지 않으므로 빈 문자열 처리
          genre: lyricData?.lyric_genre?.[0] || "",
          style: lyricData?.lyric_stylistic?.[0] || "",
          form: lyricData?.lyric_tag ? lyricData.lyric_tag.join(", ") : "",
          my_story: lyricStory,
        },
      };
      console.log("formData", formData);
      const res = await axios.post(
        `${serverApi}/api/music/album/lyrics`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": "f47d348dc08d492492a7a5d546d40f4a",
            "Content-Type": "application/json",
          },
        }
      );

      storeAlbumId(res.data.id, res.data.title);
      console.log("handleSubmit", res);
      console.log("storeAlbumId", res.data.id, res.data.title);
      navigate(`/main`);
    } catch (err) {
      alert("에러 발생");
      console.error("handleSubmit error", err);
    } finally {
      setLoading(false);
    }
  };

  // ====== Generate Song 버튼 클릭 핸들러 ======
  const handleGenerateSong = async () => {
    setCreateLoading(true);
    try {
      // // 앨범 커버 생성 후 URL 반환
      const cover = await generateAlbumCover();
      if (cover) {
        // 생성된 cover 값을 인자로 전달하여 musicGenerate 함수 호출
        await musicGenerate(cover);
      } else {
        alert("앨범 커버 생성에 실패하였습니다.");
      }
    } catch (error) {
      console.error("노래 생성 중 오류 발생:", error);
      alert("노래 생성에 오류가 발생하였습니다.");
    } finally {
      setCreateLoading(false);
    }
  };
  // 생성 버튼 허용 여부 input 들이 값이 다 있을 경우 통과
  const isGenerateButtonDisabled = "";

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatHistory, loading]);

  return (
    <div className="chatbot__background">
      {createLoading && <CreateLoading />}
      <section className="chatbot">
        <div className="chatbot__header">
          <h2>Melody Maker</h2>
        </div>
        <div className="chatbot__messages" ref={scrollContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message__content">
                {/* <img src={mobProfilerImg}/> */}
                <img
                  src={
                    msg.role === "assistant" ? mobProfilerImg : defaultCoverImg
                  }
                  alt="profile"
                />
                <p className="message__content--text">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="message bot">Loading...</div>}
        </div>
        <div className="chatbot__input">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>
      <section className={`music__information ${isActive ? "active" : ""}`}>
        <div className="music__information__header" onClick={handleToggle}>
          <h2>Music Information</h2>
        </div>
        <div className="music__information__tags">
          <h3>Melody Tags</h3>
          <input
            type="text"
            value={melodyData?.melody_tag}
            placeholder="Enter tags separated by commas"
            readOnly
          />
        </div>
        <div className="music__information__genre">
          <h3>Melody Title</h3>
          <input
            type="text"
            value={melodyData?.melody_title}
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__genre">
          <h3>Melody Genre</h3>
          <input
            type="text"
            value={melodyData?.melody_genre}
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__gender">
          <h3>Melody Gender</h3>
          <input
            type="text"
            value={melodyData?.melody_gender}
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__instrument">
          <h3>Melody Instrument</h3>
          <input
            type="text"
            value={melodyData?.melody_instrument}
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__tempo">
          <h3>Melody Tempo</h3>
          <input
            type="text"
            value={melodyData?.melody_tempo}
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__detail">
          <h3>Melody Detail</h3>
          <input
            type="text"
            value={melodyData?.melody_detail}
            placeholder="Enter"
            readOnly
          />
        </div>
      </section>
      <div className="music__information__buttons">
        <button
          className={`music__information__button ${
            isGenerateButtonDisabled ? "disabled" : ""
          }`}
          onClick={handleGenerateSong}
          disabled={isGenerateButtonDisabled} // 버튼 비활성화 조건 추가
        >
          Generate Song
        </button>
      </div>
    </div>
  );
};

export default MelodyChatBot;
