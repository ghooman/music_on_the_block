// components/create/chatbot/MelodyChatBot.js
import "./MelodyChatBot.scss";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import CreateLoading from "../../CreateLoading";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";

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
  selectedLanguage,
  albumCover,
  setAlbumCover,
}) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

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
    { role: "assistant", content: "만들고 싶은 노래 장르를 말해주세요!" },
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
            content:
              "당신은 작곡 전문가이자 멜로디 제작에 특화된 조수입니다. 지금부터 사용자가 원하는 작곡 멜로디 제작을 위해 아래 단계를 순차적으로 진행할 수 있도록 도와주세요.\n\n" +
              "곡 제작과 관련된 질문이 아닌 경우에는 '곡 제작과 관련된 질문이 아닙니다.'라고 답해주세요.\n\n" +
              "1. 먼저 사용자가 원하는 곡의 장르를 선택하도록 질문합니다.\n" +
              "2. 사용자가 원하는 태그들 정하도록 질문합니다. (사랑,우정,성공 등)\n" +
              "3. 곡의 타이틀을 정하도록 유도합니다.\n" +
              "4. 곡의 보이스 선택: 남성 또는 여성 중 한 명의 보이스를 선택하도록 제안합니다. 현재 시스템은 한 종류의 보이스만 사용할 수 있음을 안내해주세요.\n" +
              "5. 곡에서 사용하길 원하는 악기들을 물어봅니다. (드럼,베이스,피아노 등)\n" +
              "6. 곡의 템포를 결정하도록 안내합니다. (최소 60 BPM에서 최대 120 BPM 사이)\n" +
              "7. 추가적으로 곡에 넣고 싶은 요소들이 있는지 질문합니다.\n" +
              "8. 마지막으로, 지금까지 선택한 옵션들을 다음과 같은 형식으로 정리하여 사용자에게 보여주세요:\n" +
              "   [예시 출력] 최종 프롬프트: '태그(사용자가 선택한 태그), 곡의 타이틀(사용자가 정한 타이틀), 장르(선택한 장르), 보이스(선택한 보이스), 악기(선택한 악기), 템포(선택한 템포), 추가 요소/스토리(사용자가 제시한 추가 요소)입니다. 이대로 곡을 생성하시겠습니까?'\n" +
              "대화는 단계별로 진행되어, 사용자의 선택에 따라 세부사항이 반영되도록 해주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      // 불필요한 ** 문자 제거
      botMessage = botMessage.replace(/\*\*/g, "");

      // [곡 제목 추출] (예시: "곡의 타이틀(달리기)" 식으로 포함된 경우)
      // [태그 추출]
      if (botMessage.includes("태그(")) {
        const tagRegex = /태그\s*\(([^)]+)\)/;
        const tagMatch = botMessage.match(tagRegex);
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
      if (botMessage.includes("곡의 타이틀(")) {
        const titleRegex = /곡의\s*타이틀\s*\(([^)]+)\)/;
        const titleMatch = botMessage.match(titleRegex);
        if (titleMatch && titleMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_title: titleMatch[1].trim(),
          }));
        }
      }

      // [장르 추출]
      if (botMessage.includes("장르(")) {
        const genreRegex = /장르\s*\(([^)]+)\)/;
        const genreMatch = botMessage.match(genreRegex);
        if (genreMatch && genreMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_genre: genreMatch[1].trim(),
          }));
        }
      }

      // [보이스 추출]
      if (botMessage.includes("보이스(")) {
        const voiceRegex = /보이스\s*\(([^)]+)\)/;
        const voiceMatch = botMessage.match(voiceRegex);
        if (voiceMatch && voiceMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_gender: voiceMatch[1].trim(),
          }));
        }
      }

      // [악기 추출]
      if (botMessage.includes("악기(")) {
        const instrumentRegex = /악기\s*\(([^)]+)\)/;
        const instrumentMatch = botMessage.match(instrumentRegex);
        if (instrumentMatch && instrumentMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_instrument: instrumentMatch[1].trim(),
          }));
        }
      }

      // [템포 추출]
      if (botMessage.includes("템포(")) {
        const tempoRegex = /템포\s*\(([^)]+)\)/;
        const tempoMatch = botMessage.match(tempoRegex);
        if (tempoMatch && tempoMatch[1]) {
          setMelodyData((prevData) => ({
            ...prevData,
            melody_tempo: tempoMatch[1].trim(),
          }));
        }
      }

      // [추가 요소/스토리 추출]
      if (botMessage.includes("추가 요소/스토리(")) {
        const detailRegex = /추가 요소\/스토리\s*\(([^)]+)\)/;
        const detailMatch = botMessage.match(detailRegex);
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
  const generateAlbumCover = async () => {
    try {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `
 
        `,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
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
          title: "",
          detail: "",
          language: "KOR",
          genre: "",
          style: "",
          gender: "",
          musical_instrument: "",
          ai_service: "",
          ai_service_type: "",
          tempo: 0,
          song_length: "",
          lyrics: "",
          mood: "",
          tags: "",
          cover_image: coverUrl, // 직접 전달받은 coverUrl 사용
        },
        album_lyrics_info: {
          language: "KOR",
          feelings: "",
          genre: "",
          style: "",
          form: "",
          my_story: "",
        },
      };
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
      navigate(`/album`);
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
      // 앨범 커버 생성 후 URL 반환
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
  // 생성 버튼 허용 조건
  const isGenerateButtonDisabled = "";
  console.log("createLoading", createLoading);
  return (
    <div className="chatbot__background">
      {createLoading && <CreateLoading />}
      <section className="chatbot">
        <div className="chatbot__header">
          <h2>Melody Maker</h2>
        </div>
        <div className="chatbot__messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
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
      <section className="music__information">
        <div className="music__information__header">
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
        <div className="music__information__buttons">
          <button
            className={`music__information__button ${
              isGenerateButtonDisabled ? "disabled" : ""
            }`}
            onClick={handleGenerateSong}
            disabled={isGenerateButtonDisabled} // 버튼 비활성화 조건 추가
          >
            <span>Generate Song</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default MelodyChatBot;
