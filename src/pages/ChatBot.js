// pages/ChatBot.js
import "../styles/ChatBot.scss";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import CreateLoading from "../components/CreateLoading";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import defaultCoverImg from "../assets/images/header/logo.svg";

const ChatBot = () => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "만들고 싶은 노래 장르를 말해주세요!" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 최종 프롬프트와 생성된 가사를 위한 상태
  const [lyricTitle, setLyricTitle] = useState("");
  const [lyricTags, setLyricTags] = useState("");
  const [lyricGenre, setLyricGenre] = useState("");
  const [lyricStylistic, setLyricStylistic] = useState("");
  const [lyricStory, setLyricStory] = useState("");
  const [lyricResult, setLyricResult] = useState(null);
  // 최종 멜로디 생성 을 위한 상태
  const [melodyTitle, setMelodyTitle] = useState("");
  const [melodyTags, setMelodyTags] = useState("");
  const [melodyGenre, setMelodyGenre] = useState("");
  const [melodyGender, setMelodyGender] = useState("");
  const [melodyInstruments, setMelodyInstruments] = useState("");
  const [melodyTempo, setMelodyTempo] = useState("");
  const [melodyDetail, setMelodyDetail] = useState("");
  const [melodyResult, setMelodyResult] = useState(null);
  // 앨범 커버 및 생성 중 로딩 상태 관리
  const [albumCover, setAlbumCover] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

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
              "당신은 노래 제작에 특화된 전문가입니다. 지금부터 사용자가 맞춤형 노래 제작을 위해 아래 단계를 진행할 수 있도록 도와주세요.\n\n" +
              "1. 먼저, 사용자가 원하는 노래의 장르(예: 팝, 록, 힙합, 발라드 등)를 선택하도록 요청합니다.\n" +
              "2. 장르 선택 후, 곡의 태그들을 정할 수 있도록, '원하는 태그들이 있으신가요?'라고 질문합니다.\n" +
              "3. 해당 장르와 제목에 맞는 노래의 느낌이나 분위기를 정할 수 있도록 '특정한 느낌이나 분위기를 원하시는게 있나요?'라고 질문합니다.\n" +
              "4. 사용자가 구체적인 느낌이나 분위기를 정한 경우, 추가로 '곡에 포함되길 원하는 특정한 요소나 스토리가 있으신가요?'라고 물어봅니다.\n" +
              "5. 이 모든 선택사항(태그, 장르, 느낌/분위기, 추가 요소/스토리)을 정리하여 사용자에게 최종 확인을 요청할 때, 반드시 아래와 같이 출력해 주세요.\n" +
              "[예시 출력] 곡 제목: '유저가 정한 제목', 최종 프롬프트: '태그(유저가 정한 태그), 장르(유저가 정한 장르), 느낌/분위기(유저가 정한 느낌/분위기), 추가 요소/스토리(유저가 정한 내용)입니다. 이 내용을 바탕으로 노래 가사를 생성할까요?'\n" +
              "6. 사용자가 최종 확인을 하면, 그 정보를 바탕으로 맞춤형 노래 가사를 생성합니다. 생성된 가사는 반드시 '가사 시작'과 '가사 끝' 사이에 출력되되, 가사 구성은 고정된 형식이 아니라 사용자가 선택한 장르 및 프롬프트에 따라 유동적으로 작성해 주세요. 예를 들어, K-POP의 경우 'Verse, Pre-Chorus, Chorus, Bridge' 등 해당 장르의 특징을 반영하여, 사용자가 원하는 가사 구성을 생성할 수 있도록 합니다.\n" +
              "대화는 단계별로 진행되어 사용자의 선택에 따라 세부사항이 반영되도록 해주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      // 불필요한 ** 문자 제거
      botMessage = botMessage.replace(/\*\*/g, "");

      // [곡 제목 추출] (예시: "곡 제목: '배추도사무도사'" 식으로 포함된 경우)
      if (botMessage.includes("곡 제목:")) {
        const titleRegex = /곡 제목\s*:\s*'([^']+)'/;
        const titleMatch = botMessage.match(titleRegex);
        if (titleMatch && titleMatch[1]) {
          // setLyricTitle 함수는 별도로 정의되어 있어야 합니다.
          setLyricTitle(titleMatch[1].trim());
        }
      }

      // [태그 추출]
      if (botMessage.includes("태그(")) {
        const tagRegex = /태그\(([^)]+)\)/;
        const tagMatch = botMessage.match(tagRegex);
        if (tagMatch && tagMatch[1]) {
          setLyricTags(tagMatch[1].trim());
        }
      }

      // [장르 추출]
      if (botMessage.includes("장르(")) {
        const genreRegex = /장르\(([^)]+)\)/;
        const genreMatch = botMessage.match(genreRegex);
        if (genreMatch && genreMatch[1]) {
          setLyricGenre(genreMatch[1].trim());
        }
      }

      // [느낌/분위기 추출]
      if (botMessage.includes("느낌/분위기(")) {
        const stylisticRegex = /느낌\/분위기\(([^)]+)\)/;
        const stylisticMatch = botMessage.match(stylisticRegex);
        if (stylisticMatch && stylisticMatch[1]) {
          setLyricStylistic(stylisticMatch[1].trim());
        }
      }

      // [추가 요소/스토리 추출]
      if (botMessage.includes("추가 요소/스토리(")) {
        const storyRegex = /추가 요소\/스토리\(([^)]+)\)/;
        const storyMatch = botMessage.match(storyRegex);
        if (storyMatch && storyMatch[1]) {
          setLyricStory(storyMatch[1].trim());
        }
      }

      // [가사 추출]
      if (botMessage.includes("가사 시작") && botMessage.includes("가사 끝")) {
        const lyricRegex = /가사 시작\s*([\s\S]*?)\s*가사 끝/;
        const lyricMatch = botMessage.match(lyricRegex);
        if (lyricMatch && lyricMatch[1]) {
          let extractedLyric = lyricMatch[1].trim();
          // 필요한 경우 (Verse), (Chorus) 등 구분 앞에 줄바꿈 추가
          extractedLyric = extractedLyric
            .replace(
              /(\(Verse\s*\d*\)|\(Chorus\)|\(Bridge\)|\(Outro\))/g,
              "\n$1"
            )
            .trim();
          setLyricResult(extractedLyric);
        }
      }

      console.log("lyricTags:", lyricTags);
      console.log("lyricGenre:", lyricGenre);
      console.log("lyricStylistic:", lyricStylistic);
      console.log("lyricStory:", lyricStory);

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
          Create an album cover for a song titled "${lyricTitle}". Use  as a visual reference or inspiration for the design. The cover should reflect the song’s title, genre, and lyrical theme: "${lyricResult}". If no specific reference is available, use your creative judgment to interpret the mood and meaning visually.
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
          title: lyricTitle,
          detail: "",
          language: "KOR",
          genre: lyricGenre,
          style: "",
          gender: "",
          musical_instrument: "",
          ai_service: "",
          ai_service_type: "",
          tempo: 0,
          song_length: "",
          lyrics: lyricResult,
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
    if (!lyricGenre || !lyricTitle || !lyricResult) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

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
  const isGenerateButtonDisabled =
    !lyricGenre || !lyricTitle || !lyricResult || createLoading;

  return (
    <div className="chatbot__background">
      {createLoading && <CreateLoading />}
      <section className="chatbot">
        <div className="chatbot__header">
          <h2>ChatBot</h2>
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
          <h3>Lyric Tags</h3>
          <input
            type="text"
            value={lyricTags}
            placeholder="Enter tags separated by commas"
            readOnly
          />
        </div>
        <div className="music__information__genre">
          <h3>Lyric Genre</h3>
          <input
            type="text"
            value={lyricGenre}
            placeholder="POP,K-POP,ROCK,HIP-HOP ..."
            readOnly
          />
          <div className="music__information__stylistic">
            <h3>Lyric Stylistic</h3>
            <input
              type="text"
              value={lyricStylistic}
              placeholder="Enter stylistic elements"
              readOnly
            />
          </div>
        </div>
        <div className="music__information__story">
          <h3>Lyric Story</h3>
          <textarea
            value={lyricStory}
            placeholder="Enter your story here..."
            rows="4"
            readOnly
          />
        </div>
        <div className="music__information__lyric">
          <h3>Final Lyric</h3>
          <textarea
            value={lyricResult}
            placeholder="Enter your lyrics here..."
            rows="10"
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

export default ChatBot;
