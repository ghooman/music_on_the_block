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
              "당신은 노래 가사 제작에 특화된 전문가입니다. 사용자와 대화할 때 반드시 노래 가사 제작과 관련된 응답만 제공해주세요.",
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

  return (
    <div className="chatbot">
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
    </div>
  );
};

export default ChatBot;
