// components/create/chatbot/LyricChatBot.js
import './LyricChatBot.scss';
import React, { useState, useRef, useEffect } from 'react';

import { useUserDetail } from '../../../hooks/useUserDetail';
import OpenAI from 'openai';
import jsPDF from 'jspdf';
import ExpandedButton from '../ExpandedButton';
import CreateLoading from '../../CreateLoading';
import { generateKoreanPdf } from '../../../utils/pdfGenerator';
import defaultCoverImg from '../../../assets/images/header/logo.svg';
import mobProfilerImg from '../../../assets/images/mob-profile-img01.svg';
// 언어별 리소스 파일 불러오기
import koLyric from '../../../locales/koLyric';
import enLyric from '../../../locales/enLyric';
const LyricChatBot = ({
  selectedLanguage,
  createLoading,
  lyricData,
  setLyricData,
  lyricStory,
  setLyricStory,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
}) => {
  const { data: userData } = useUserDetail();
  const generatedLyricsRef = useRef(null);
  // 선택된 언어에 따라 리소스 파일 선택
  const locale = selectedLanguage === 'KOR' ? koLyric : enLyric;

  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: locale.chatbot.initialMessage },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(false); // 가사 완료후 제네러이트 송 상태
  const [mode, setMode] = useState('read');

  // 초기 가사 placeholder
  const initialKorLyricPlaceholder = [
    '고양이가 주인공인 밝은 분위기의 가사',
    '이별후 슬픔을 겪고 있는 애잔한 발라드',
    '공부할때 듣기 좋은 노래',
    '친구들과 함께 놀고 싶을때 들으면 좋을 노래',
  ];

  const initialEngLyricPlaceholder = [
    'A cheerful and positive lyric with a cat as the main character',
    'A sad ballad about heartbreak',
    'A song that is good to listen to while studying',
    'A song that is perfect for hanging out with friends',
  ];
  // 선택된 언어에 따라서 목록중 랜덤으로 하나
  const initialLyricPlaceholder =
    selectedLanguage === 'KOR'
      ? initialKorLyricPlaceholder[Math.floor(Math.random() * initialKorLyricPlaceholder.length)]
      : initialEngLyricPlaceholder[Math.floor(Math.random() * initialEngLyricPlaceholder.length)];

  // OpenAI 클라이언트 초기화
  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function getChatResponse() {
    setLoading(true);
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content: locale.chatbot.systemMessage,
          },
          ...chatHistory,
          { role: 'user', content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, '');

      // [태그 추출]
      if (locale.extraction.tagRegex.test(botMessage)) {
        const tagMatch = botMessage.match(locale.extraction.tagRegex);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(',')
            .map(tag => tag.trim());
          setLyricData(prevData => ({
            ...prevData,
            lyric_tag: extractedTags,
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 태그 추출
      else if (
        locale.extraction.promptTagRegex &&
        locale.extraction.promptTagRegex.test(botMessage)
      ) {
        const tagMatch = botMessage.match(locale.extraction.promptTagRegex);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(',')
            .map(tag => tag.trim());
          setLyricData(prevData => ({
            ...prevData,
            lyric_tag: extractedTags,
          }));
        }
      }

      // [감정 추출]
      if (locale.extraction.genreRegex.test(botMessage)) {
        const genreMatch = botMessage.match(locale.extraction.genreRegex);
        if (genreMatch && genreMatch[1]) {
          setLyricData(prevData => ({
            ...prevData,
            lyric_genre: genreMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 감정 추출
      else if (
        locale.extraction.promptGenreRegex &&
        locale.extraction.promptGenreRegex.test(botMessage)
      ) {
        const genreMatch = botMessage.match(locale.extraction.promptGenreRegex);
        if (genreMatch && genreMatch[1]) {
          setLyricData(prevData => ({
            ...prevData,
            lyric_genre: genreMatch[1].trim(),
          }));
        }
      }

      // [느낌/분위기 추출]
      if (locale.extraction.stylisticRegex.test(botMessage)) {
        const stylisticMatch = botMessage.match(locale.extraction.stylisticRegex);
        if (stylisticMatch && stylisticMatch[1]) {
          setLyricData(prevData => ({
            ...prevData,
            lyric_stylistic: stylisticMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 느낌/분위기 추출
      else if (
        locale.extraction.promptStylisticRegex &&
        locale.extraction.promptStylisticRegex.test(botMessage)
      ) {
        const stylisticMatch = botMessage.match(locale.extraction.promptStylisticRegex);
        if (stylisticMatch && stylisticMatch[1]) {
          setLyricData(prevData => ({
            ...prevData,
            lyric_stylistic: stylisticMatch[1].trim(),
          }));
        }
      }

      // [추가 요소/스토리 추출]
      if (locale.extraction.storyRegex.test(botMessage)) {
        const storyMatch = botMessage.match(locale.extraction.storyRegex);
        if (storyMatch && storyMatch[1]) {
          setLyricStory(storyMatch[1].trim());
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 추가 요소/스토리 추출
      else if (
        locale.extraction.promptStoryRegex &&
        locale.extraction.promptStoryRegex.test(botMessage)
      ) {
        const storyMatch = botMessage.match(locale.extraction.promptStoryRegex);
        if (storyMatch && storyMatch[1]) {
          setLyricStory(storyMatch[1].trim());
        }
      }

      // [가사 추출]
      if (
        botMessage.includes(selectedLanguage === 'ENG' ? 'Start Lyrics' : '가사 시작') &&
        botMessage.includes(selectedLanguage === 'ENG' ? 'End Lyrics' : '가사 끝')
      ) {
        const lyricRegex = locale.extraction.lyricRegex;
        const lyricMatch = botMessage.match(lyricRegex);
        if (lyricMatch && lyricMatch[1]) {
          let extractedLyric = lyricMatch[1].trim();
          extractedLyric = extractedLyric
            .replace(/(\(Verse\s*\d*\)|\(Chorus\)|\(Bridge\)|\(Outro\))/g, '\n$1')
            .trim();
          setGeneratedLyric(extractedLyric);
        }
      }
      setChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: botMessage }]);
      console.log('response', response);
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setLoading(false);
    }
  }

  // 사용자 입력 처리
  const handleUserInput = e => {
    setUserInput(e.target.value);
  };

  // 사용자 메시지 전송 처리
  const handleSendMessage = () => {
    if (userInput?.trim()) {
      setChatHistory(prevHistory => [...prevHistory, { role: 'user', content: userInput }]);
      getChatResponse();
      setUserInput('');
    }
  };

  // Enter 키 이벤트 처리
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 생성 버튼 허용 조건: 최종 가사가 비어있지 않고 로딩 중이 아닐 때
  const isGenerateButtonDisabled = generatedLyric?.trim() === '' || createLoading;

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatHistory, loading]);

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(prev => !prev);
  };

  const handleIsStatus = () => {
    setIsStatus(true);
    window.scrollTo(0, 0);
  };

  if (!isStatus)
    return (
      <div className="chatbot__background">
        {createLoading && <CreateLoading />}
        <section className="chatbot">
          <div className="chatbot__header">
            <h2>Chat bot</h2>
          </div>
          <div className="chatbot__messages" ref={scrollContainerRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message__content">
                  <img
                    src={
                      msg.role === 'assistant'
                        ? mobProfilerImg
                        : userData?.profile || defaultCoverImg
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
              placeholder={initialLyricPlaceholder}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </section>
        <section className={`music__information ${isActive ? 'active' : ''}`}>
          <div className="music__information__header" onClick={handleToggle}>
            <h2>Music Information</h2>
          </div>
          <div className="music__information__tags">
            <h3>Lyrics Tags</h3>
            <input
              type="text"
              value={lyricData.lyric_tag.join(', ')}
              placeholder="Enter tags separated by commas"
              readOnly
            />
          </div>
          <div className="music__information__genre">
            <h3>Lyrics Mood</h3>
            <input
              type="text"
              value={lyricData.lyric_genre}
              placeholder="Love, Sad, Hope, Fun, ..."
              readOnly
            />
            <div className="music__information__stylistic">
              <h3>Lyrics Stylistic</h3>
              <input
                type="text"
                value={lyricData.lyric_stylistic}
                placeholder="Enter stylistic elements"
                readOnly
              />
            </div>
          </div>
          <div className="music__information__story">
            <h3>Lyrics Story</h3>
            <textarea value={lyricStory} placeholder="Enter your story here..." rows="4" readOnly />
          </div>
          <div className="music__information__lyric">
            <h3>Final Lyrics</h3>
            <div className="music__information__lyric--text">
              <textarea
                value={generatedLyric}
                placeholder="Enter your lyrics here..."
                rows="10"
                readOnly
              />
            </div>
          </div>
        </section>
        <div className="music__information__buttons">
          <button
            className={`music__information__button ${isGenerateButtonDisabled ? 'disabled' : ''}`}
            disabled={isGenerateButtonDisabled}
            onClick={() => {
              handleIsStatus();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  else
    return (
      <div ref={generatedLyricsRef} className="create__lyric-lab">
        <h2>Generated Lyrics</h2>
        {mode === 'read' && <pre className="generated-lyrics__lyrics">{generatedLyric}</pre>}
        {mode === 'edit' && (
          <pre className="generated-lyrics__lyrics">
            <textarea
              className="generated-lyrics__lyrics"
              value={generatedLyric}
              // onChange={(e) => setCreatedLyrics(e.target.value)}
              onChange={e => {
                // 입력된 텍스트가 비어있을 경우 최소 한 줄의 공백을 유지하도록 설정
                const newText = e.target.value.trim() === '' ? '\n' : e.target.value;
                setGeneratedLyric(newText);
              }}
              onKeyDown={e => {
                // 엔터키를 눌렀을 때 화면이 내려가는 것을 방지
                if (e.key === 'Enter') {
                  const currentScroll = e.target.scrollTop;
                  setTimeout(() => {
                    e.target.scrollTop = currentScroll; // 화면 스크롤 픽스
                  }, 0);
                }
              }}
            />
          </pre>
        )}
        <div className="generated-lyrics__confirm-buttons">
          <p
            className={`generated-lyrics__confirm-buttons--text ${
              generatedLyric?.length > 1000 ? 'disabled' : ''
            }`}
          >
            Lyric Length : {generatedLyric?.length} / 1000
          </p>
          <button
            className="generated-lyrics__confirm-buttons--button edit"
            onClick={() => setMode(prev => (prev === 'edit' ? 'read' : 'edit'))}
          >
            EDIT
          </button>
          <button
            className={`generated-lyrics__confirm-buttons--button confirm ${
              generatedLyric?.length > 1000 ? 'disabled' : ''
            }`}
            disabled={generatedLyric?.length > 1000}
            onClick={() => {
              setGeneratedLyric(generatedLyric);
              setPageNumber(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            CONFIRM
          </button>
        </div>
        <div className="generated-lyrics__download-buttons">
          <button
            className="generated-lyrics__download-buttons--button txt"
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([generatedLyric], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'lyrics.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download as text (.txt)
          </button>
          <button
            className="generated-lyrics__download-buttons--button pdf"
            onClick={() => {
              // 가사 언어에 따라 pdf 생성 방식을 분기합니다.
              if (selectedLanguage === 'KOR') {
                // 한글일 경우 커스텀 pdf 생성 함수 호출
                generateKoreanPdf(generatedLyric);
              } else {
                // 영어 등 다른 언어의 경우 기존 로직 사용
                const doc = new jsPDF();
                const lines = doc.splitTextToSize(generatedLyric, 180);
                doc.text(lines, 10, 10);
                doc.save('lyrics.pdf');
              }
            }}
          >
            Download as pdf (.pdf)
          </button>
        </div>
      </div>
    );
};

export default LyricChatBot;
