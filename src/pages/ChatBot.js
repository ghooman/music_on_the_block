// pages/ChatBot.js

import React, { useState } from "react";
import "../styles/ChatBot.scss";
import OpenAI from "openai";

const ChatBot = () => {
  // 초기 chatHistory에 봇의 초기 메시지도 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "나랑같이 노래를 제작 해볼래 ?" },
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
          // 시스템 프롬프트 추가
          {
            role: "system",
            content:
              "당신은 노래 가사 제작에 특화된 전문가입니다. 사용자와 대화할 때 반드시 노래 가사 제작과 관련된 응답만 제공해주세요. " +
              "가사를 작성할 때는 사용자가 제시하는 주제, 감정, 분위기를 정확하게 반영하고, 각 절, 코러스, 브리지 등 가사의 구성 요소를 명확하게 구분하여 작성하세요. " +
              "창의적이고 독창적인 표현을 사용하되 전체적인 내용의 일관성을 유지하며, 필요시 추가 정보를 요청하거나 배경 설명을 제공하여 사용자의 이해를 돕도록 하세요. " +
              "또한, 요청에 따라 현대적, 클래식, 감성적 등 다양한 언어 스타일로 가사를 작성할 수 있도록 유연하게 대응해 주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      const botMessage = response.choices[0].message.content;
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

  // 사용자 메시지 전송
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

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  // 초기 프리셋 질문
  const initialQuestions = [
    "가사를 먼저 만들고싶어!",
    "",
    "어떤 분위기의 노래를 원하나요?",
  ];

  const [lyricDropdown, setLyricDropdown] = useState(false);
  const [lyricInput, setLyricInput] = useState("");
  const [lyricOptions, setLyricOptions] = useState({
    tags: ["사랑", "이별", "행복", "슬픔", "추억"],
    genre: ["발라드"],
    stylistic: ["감성적"],
  });
  const [finalLyric, setFinalLyric] = useState([]);

  const [musicDropdown, setMusicDropdown] = useState(false);
  const [musicInput, setMusicInput] = useState("");
  const [musicOptions, setMusicOptions] = useState([]);
  const [musicData, setMusicData] = useState([]);

  return (
    <div className="chatbot__background">
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
        <div className="music__information__lyric">
          <h3>Lyric</h3>
          <input
            type="text"
            value={lyricInput}
            onChange={(e) => setLyricInput(e.target.value)}
            placeholder="Enter lyric..."
          />
          <button onClick={() => setLyricDropdown(!lyricDropdown)}>
            {lyricDropdown ? "Hide Options" : "Show Options"}
          </button>
          {lyricDropdown && (
            <div className="lyric__options">
              {lyricOptions.map((option, index) => (
                <div key={index} className="lyric__option">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatBot;
