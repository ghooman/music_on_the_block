// pages/ChatBot.js
import React, { useState } from "react";
import "../styles/ChatBot.scss";
import OpenAI from "openai";

const ChatBot = () => {
  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "만들고 싶은 노래 장르를 말해줘!" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 최종 프롬프트와 생성된 가사를 위한 상태
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
              "2. 장르 선택 후, 해당 장르에 맞는 노래의 느낌이나 분위기를 정할 수 있도록 '특정한 느낌이나 분위기를 원하시는게 있나요?'라고 질문합니다.\n" +
              "3. 사용자가 구체적인 느낌이나 분위기를 정한 경우, 추가로 '곡에 포함되길 원하는 특정한 요소나 스토리가 있으신가요?'라고 물어봅니다.\n" +
              "4. 이 모든 선택사항(장르, 느낌/분위기, 추가 요소)을 정리하여 사용자에게 최종 프롬프트 내용을 보여주고, '최종 프롬프트 : 유저가 정한 내용들'이라고 물어보며 최종 프롬프트 바탕으로 노래 가사를 생성할 것인지 확인합니다.\n" +
              "5. 사용자가 최종 확인을 하면 그 정보를 기반으로 맞춤형 노래 가사를 생성합니다. 생성된 가사는 '최종 가사 : 생성된가사' 형식으로 보여줍니다.\n\n" +
              "대화는 단계별로 진행되어 사용자의 선택에 따라 세부사항이 반영되도록 해주세요.",
          },
          ...chatHistory,
          { role: "user", content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      // 불필요한 ** 문자 제거
      botMessage = botMessage.replace(/\*\*/g, "");

      // 최종 프롬프트 추출 (예: "최종 프롬프트 : ..." 부분)
      if (botMessage.includes("최종 프롬프트")) {
        const fpRegex =
          /최종 프롬프트\s*:\s*(.*?)\s*이 내용을 바탕으로 노래 가사를 생성할까요\?/s;
        const fpMatch = botMessage.match(fpRegex);
        if (fpMatch && fpMatch[1]) {
          let promptText = fpMatch[1].trim();
          // '-' 기준으로 줄바꿈 적용
          promptText = promptText.replace(/-\s*/g, "\n- ").trim();
          setFinalLyricPrompt(promptText);
        }
      }

      // 최종 가사 추출 (예: "최종 가사 : ..." 이후의 모든 텍스트)
      if (botMessage.includes("최종 가사")) {
        // "최종 가사" 뒤에 괄호로 추가된 텍스트가 있을 수 있으므로 (?:\(.*?\))? 로 처리합니다.
        const lyricRegex = /최종 가사\s*(?:\(.*?\))?\s*:\s*([\s\S]+)/;
        const lyricMatch = botMessage.match(lyricRegex);
        if (lyricMatch && lyricMatch[1]) {
          let extractedLyric = lyricMatch[1].trim();
          extractedLyric = extractedLyric
            .replace(
              /(\(Verse\s*\d*\)|\(Chorus\)|\(Bridge\)|\(Outro\))/g,
              "\n$1"
            )
            .trim();
          console.log("추출된 최종 가사:", extractedLyric);
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
