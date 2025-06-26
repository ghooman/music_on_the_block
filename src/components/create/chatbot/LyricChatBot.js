// components/create/chatbot/LyricChatBot.js
import React, { useState, useRef, useEffect } from 'react';

import { useUserDetail } from '../../../hooks/useUserDetail';
import OpenAI from 'openai';
import jsPDF from 'jspdf';
import CreateLoading from '../../CreateLoading';
import { generateKoreanPdf } from '../../../utils/pdfGenerator';
import defaultCoverImg from '../../../assets/images/header/logo.svg';
import mobProfilerImg from '../../../assets/images/mob-profile-img01.svg';
// 통일된 프롬프트 파일 불러오기
import lyricPrompts from '../../../locales/lyricPrompts';
import { useTranslation } from 'react-i18next';
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
  selectedVersion,
}) => {
  const { t } = useTranslation('song_create');

  const { data: userData } = useUserDetail();
  const generatedLyricsRef = useRef(null);
  // 선택된 언어에 따라 초기 메시지 선택
  const getInitialMessage = () => {
    return (
      lyricPrompts.chatbot.initialMessage[selectedLanguage] ||
      lyricPrompts.chatbot.initialMessage['ENG']
    );
  };

  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: getInitialMessage() },
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

  const initialJpnLyricPlaceholder = [
    '猫を主人公とした明るい雰囲気の歌詞',
    '別れ後に悲しみを感じている哀れなバラード',
    '勉強するときに聞くといい歌',
    '友達と一緒に遊ぶときに聞くといい歌',
  ];

  const initialIdnLyricPlaceholder = [
    'Lirik yang menyenangkan dan positif dengan kucing sebagai tokoh utama',
    'Lirik yang menyedihkan tentang patah hati',
    'Lirik yang cocok untuk didengarkan saat belajar',
    'Lirik yang cocok untuk didengarkan saat bersama teman',
  ];

  const initialVieLyricPlaceholder = [
    'Lời bài hát vui vẻ và tích cực với mèo là nhân vật chính',
    'Lời bài hát buồn về tình yêu đã mất',
    'Lời bài hát phù hợp để nghe khi học',
    'Lời bài hát phù hợp để nghe khi vui chơi với bạn bè',
  ];

  // 선택된 언어에 따라서 목록중 랜덤으로 하나
  const initialLyricPlaceholderList = {
    KOR: initialKorLyricPlaceholder[Math.floor(Math.random() * initialKorLyricPlaceholder.length)],
    ENG: initialEngLyricPlaceholder[Math.floor(Math.random() * initialEngLyricPlaceholder.length)],
    JPN: initialJpnLyricPlaceholder[Math.floor(Math.random() * initialJpnLyricPlaceholder.length)],
    IDN: initialIdnLyricPlaceholder[Math.floor(Math.random() * initialIdnLyricPlaceholder.length)],
    VIE: initialVieLyricPlaceholder[Math.floor(Math.random() * initialVieLyricPlaceholder.length)],
  };

  const initialLyricPlaceholder = initialLyricPlaceholderList[selectedLanguage];

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
            content:
              lyricPrompts.chatbot.systemMessages[selectedLanguage] ||
              lyricPrompts.chatbot.systemMessages.ENG,
          },
          ...chatHistory,
          { role: 'user', content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, '');

      // [가사 추출] 예외 경우 제외하고 가사저장
      const errorMessages = [
        'Cannot generate lyrics based on the provided input. Please try again.',
        '가사 생성에 어울리지 않는 내용입니다. 다시 입력해주세요',
        '歌詞生成に適さない内容です。再度入力してください。',
        'Konten tidak cocok untuk pembuatan lirik. Silakan coba lagi.',
        'Nội dung không phù hợp để tạo lời bài hát. Vui lòng thử lại.',
      ];

      const isErrorMessage = errorMessages.some(errorMsg => botMessage.includes(errorMsg));

      if (!isErrorMessage) {
        setGeneratedLyric(botMessage);
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
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
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
            <h2>{t('Chat bot')}</h2>
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
                  <pre className="message__content--text">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && <div className="message bot">Loading...</div>}
          </div>
          {/* <div className="chatbot__input">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyPress={handleKeyPress}
              // placeholder={initialLyricPlaceholder}
              placeholder={chatHistory.length > 1 ? '' : initialLyricPlaceholder}
            />
          </div> */}
          <div className="chatbot__textarea">
            <textarea
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyPress={handleKeyPress}
              // placeholder={initialLyricPlaceholder}
              placeholder={chatHistory.length > 1 ? '' : initialLyricPlaceholder}
            />
          </div>
          <button className="chatbot__button" onClick={handleSendMessage}>
            {t('Send')}
          </button>
        </section>
        <div className="music__information__buttons">
          <button
            className={`music__information__button ${isGenerateButtonDisabled ? 'disabled' : ''}`}
            disabled={isGenerateButtonDisabled}
            onClick={() => {
              handleIsStatus();
            }}
          >
            {t('Confirm')}
          </button>
        </div>
      </div>
    );
  else
    return (
      <div ref={generatedLyricsRef} className="create__lyric-lab">
        <h2>{t('Generated Lyrics')}</h2>
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
          {selectedVersion !== 'V4_5' && (
            <p
              className={`generated-lyrics__confirm-buttons--text ${
                selectedVersion !== 'V4_5' && generatedLyric?.length > 1000 ? 'disabled' : ''
              }`}
            >
              {t('Lyrics Length')} : {generatedLyric?.length} / 1000
            </p>
          )}

          <div className="generated-lyrics__confirm-buttons--button-wrap">
            <button
              className="generated-lyrics__confirm-buttons--button edit"
              onClick={() => setMode(prev => (prev === 'edit' ? 'read' : 'edit'))}
            >
              {t('EDIT')}
            </button>
            <button
              className={`generated-lyrics__confirm-buttons--button confirm ${
                selectedVersion !== 'V4_5' && generatedLyric?.length > 1000 ? 'disabled' : ''
              }`}
              disabled={selectedVersion !== 'V4_5' && generatedLyric?.length > 1000}
              onClick={() => {
                setGeneratedLyric(generatedLyric);
                setPageNumber(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {t('CONFIRM')}
            </button>
          </div>
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
            {t('Download as text')} (.txt)
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
            {t('Download as pdf')} (.pdf)
          </button>
        </div>
      </div>
    );
};

export default LyricChatBot;
