// pages/ChatBot.js
import React, { useState } from "react";
import "../styles/ChatBot.scss";
import OpenAI from "openai";

const ChatBot = () => {
  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "만들고 싶은 노래 장르를 말해주세요!" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 최종 프롬프트와 생성된 가사를 위한 상태
  const [finalTitle, setFinalTitle] = useState("");
  const [finalLyricPrompt, setFinalLyricPrompt] = useState("");
  const [finalLyric, setFinalLyric] = useState("");

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
              "2. 장르 선택 후, 곡의 제목(타이틀)을 정할 수 있도록 '곡의 제목은 무엇인가요?'라고 질문합니다.\n" +
              "3. 해당 장르와 제목에 맞는 노래의 느낌이나 분위기를 정할 수 있도록 '특정한 느낌이나 분위기를 원하시는게 있나요?'라고 질문합니다.\n" +
              "4. 사용자가 구체적인 느낌이나 분위기를 정한 경우, 추가로 '곡에 포함되길 원하는 특정한 요소나 스토리가 있으신가요?'라고 물어봅니다.\n" +
              "5. 이 모든 선택사항(장르, 제목, 느낌/분위기, 추가 요소)을 정리하여 사용자에게 최종 확인을 요청할 때, 반드시 아래와 같이 출력해 주세요.[예시 출력] 곡 제목 : '유저가 정한 제목', 최종 프롬프트 : '장르(유저가 정한 장르), 느낌/분위기(유저가 정한 분위기), 추가 요소/스토리(유저가 정한 내용)입니다. 이 내용을 바탕으로 노래 가사를 생성할까요?'\n" +
              '6. 사용자가 최종 확인을 하면, 그 정보를 바탕으로 맞춤형 노래 가사를 생성합니다. 생성된 가사는 반드시 "가사 시작"과 "가사 끝"이라는 마커 사이에만 노래 가사 내용이 포함되도록 출력해 주세요.[예시 출력] 가사 시작 (1절) ... (후렴) ... (2절) ...(후렴) ... 가사 끝' +
              "대화는 단계별로 진행되어 사용자의 선택에 따라 세부사항이 반영되도록 해주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      // 불필요한 ** 문자 제거
      botMessage = botMessage.replace(/\*\*/g, "");

      // [제목 추출]
      if (botMessage.includes("곡 제목 :")) {
        const titleRegex = /곡 제목\s*:\s*'([^']+)'/;
        const titleMatch = botMessage.match(titleRegex);
        if (titleMatch && titleMatch[1]) {
          setFinalTitle(titleMatch[1].trim());
        }
      }

      // [프롬프트 추출]
      if (botMessage.includes("최종 프롬프트 :")) {
        const promptRegex = /최종 프롬프트\s*:\s*'([^']+)'/;
        const promptMatch = botMessage.match(promptRegex);
        if (promptMatch && promptMatch[1]) {
          setFinalLyricPrompt(promptMatch[1].trim());
        }
      }

      // [가사 추출]
      if (botMessage.includes("가사 시작") && botMessage.includes("가사 끝")) {
        const lyricRegex = /가사 시작\s*([\s\S]*?)\s*가사 끝/;
        const lyricMatch = botMessage.match(lyricRegex);
        if (lyricMatch && lyricMatch[1]) {
          let extractedLyric = lyricMatch[1].trim();
          // 필요에 따라 (Verse), (Chorus) 등의 구분 앞에 줄바꿈 추가
          extractedLyric = extractedLyric
            .replace(
              /(\(Verse\s*\d*\)|\(Chorus\)|\(Bridge\)|\(Outro\))/g,
              "\n$1"
            )
            .trim();
          setFinalLyric(extractedLyric);
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

  // 추가적인 상태들
  const initialQuestions = ["K-POP", "BALLAD", "HIP-HOP"];
  const [lyricDropdown, setLyricDropdown] = useState(false);
  const [lyricInput, setLyricInput] = useState("");
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
        <div className="music__information__title">
          <h3>Lyric Title</h3>
          <input
            type="text"
            value={finalTitle}
            placeholder="Final Lyric Title"
            readOnly
          />
        </div>
        <div className="music__information__prompt">
          <h3>Lyric Prompt</h3>
          <input
            type="text"
            value={finalLyricPrompt}
            placeholder="Final Lyric Prompt"
            readOnly
          />
        </div>
        <div className="music__information__lyric">
          <h3>Final Lyric</h3>
          <textarea
            value={finalLyric}
            placeholder="Enter your lyrics here..."
            rows="10"
            readOnly
          />
        </div>
        <div className="music__information__buttons">
          <button>
            <span>Generate Song</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ChatBot;
