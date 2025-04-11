// components/create/chatbot/LyricChatBot.js
import "./LyricChatBot.scss";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import CreateLoading from "../../CreateLoading";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import defaultCoverImg from '../../../assets/images/header/logo.svg';

const LyricChatBot = ({
  createLoading,
  setCreateLoading,
  lyricData,
  setLyricData,
  lyricStory,
  setLyricStory,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
}) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  // lyricData가 undefined일 경우 빈 객체({})를 사용하여 안전하게 구조 분해
  const {
    lyric_tag = [],
    lyric_genre = "",
    lyric_stylistic = "",
  } = lyricData || {};

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
              "[예시 출력] 최종 프롬프트: '태그(유저가 정한 태그), 장르(유저가 정한 장르), 느낌/분위기(유저가 정한 느낌/분위기), 추가 요소/스토리(유저가 정한 내용)입니다. 이 내용을 바탕으로 노래 가사를 생성할까요?'\n" +
              "6. 사용자가 최종 확인을 하면, 그 정보를 바탕으로 맞춤형 노래 가사를 생성합니다. 생성된 가사는 반드시 '가사 시작'과 '가사 끝' 사이에 출력되되, 가사 구성은 고정된 형식이 아니라 사용자가 선택한 장르 및 프롬프트에 따라 유동적으로 작성해 주세요. 예를 들어, K-POP의 경우 'Verse, Pre-Chorus, Chorus, Bridge' 등 해당 장르의 특징을 반영하여, 사용자가 원하는 가사 구성을 생성할 수 있도록 합니다.\n" +
              "대화는 단계별로 진행되어 사용자의 선택에 따라 세부사항이 반영되도록 해주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, "");

      // [태그 추출]
      if (botMessage.includes("태그(")) {
        const tagRegex = /태그\(([^)]+)\)/;
        const tagMatch = botMessage.match(tagRegex);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(",")
            .map((tag) => tag.trim());
          setLyricData((prevData) => ({
            ...prevData,
            lyric_tag: extractedTags,
          }));
        }
      }

      // [장르 추출]
      if (botMessage.includes("장르(")) {
        const genreRegex = /장르\(([^)]+)\)/;
        const genreMatch = botMessage.match(genreRegex);
        if (genreMatch && genreMatch[1]) {
          setLyricData((prevData) => ({
            ...prevData,
            lyric_genre: genreMatch[1].trim(),
          }));
        }
      }

      // [느낌/분위기 추출]
      if (botMessage.includes("느낌/분위기(")) {
        const stylisticRegex = /느낌\/분위기\(([^)]+)\)/;
        const stylisticMatch = botMessage.match(stylisticRegex);
        if (stylisticMatch && stylisticMatch[1]) {
          setLyricData((prevData) => ({
            ...prevData,
            lyric_stylistic: stylisticMatch[1].trim(),
          }));
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
          extractedLyric = extractedLyric
            .replace(
              /(\(Verse\s*\d*\)|\(Chorus\)|\(Bridge\)|\(Outro\))/g,
              "\n$1"
            )
            .trim();
          setGeneratedLyric(extractedLyric);
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
    if (userInput?.trim()) {
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

  // 생성 버튼 허용 조건: 최종 가사가 비어있지 않고 로딩 중이 아닐 때
  const isGenerateButtonDisabled =
    generatedLyric?.trim() === "" || createLoading;

  return (
    <div className="chatbot__background">
      {createLoading && <CreateLoading />}
      <section className="chatbot">
        <div className="chatbot__header">
          <h2>Lyric Maker</h2>
        </div>
        <div className="chatbot__messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <img src={defaultCoverImg}/>
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
            value={lyricData.lyric_tag.join(", ")}
            placeholder="Enter tags separated by commas"
            readOnly
          />
        </div>
        <div className="music__information__genre">
          <h3>Lyric Genre</h3>
          <input
            type="text"
            value={lyricData.lyric_genre}
            placeholder="POP, K-POP, ROCK, HIP-HOP ..."
            readOnly
          />
          <div className="music__information__stylistic">
            <h3>Lyric Stylistic</h3>
            <input
              type="text"
              value={lyricData.lyric_stylistic}
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
            value={generatedLyric}
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
            disabled={isGenerateButtonDisabled}
            onClick={() => {
              setPageNumber(1);
            }}
          >
            <span>Confirm</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LyricChatBot;
